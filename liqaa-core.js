// ===== Liqaa Core — مشترك بين الصفحات (presence + notifications + friends + storage + tokens) =====
import { Room, RoomEvent, Track } from './livekit-client.bundle.js';

export const LIVEKIT_CONFIG = {
  url: 'wss://liqaa-ajnv0adj.livekit.cloud',
  apiKey: 'APIcL4rsQrwrRdH',
  apiSecret: 'MNYIuI5T2OtNOSN2RkoDef61enjTtZFwXeV4Wo8gIyyA',
  tokenTtl: 3600
};

export const SRC_MIC = Track.Source.Microphone;
export const SRC_CAM = Track.Source.Camera;
export const SRC_SHARE = Track.Source.ScreenShare;

// ---------- التخزين المحلي ----------
export function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
export function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

export function getSession() { return lsGet('liqaa_session', null); }
export function setSession(s) { lsSet('liqaa_session', s); }
export function getUsers() { return lsGet('liqaa_users', []); }
export function setUsers(u) { lsSet('liqaa_users', u); }

export function getUserRecord() {
  const s = getSession();
  if (!s || !s.email) return null;
  return getUsers().find(u => u.email && u.email.toLowerCase() === s.email.toLowerCase()) || null;
}
export function saveUserRecord(rec) {
  const users = getUsers();
  const i = users.findIndex(u => u.email && u.email.toLowerCase() === rec.email.toLowerCase());
  if (i >= 0) users[i] = Object.assign({}, users[i], rec);
  else users.push(rec);
  setUsers(users);
  setSession(Object.assign({}, getSession() || {}, rec));
}

export function getFriends() { return lsGet('liqaa_friends', []); }
export function saveFriends(f) { lsSet('liqaa_friends', f); }
export function addFriend(f) {
  const fs = getFriends();
  if (!fs.some(x => x.username === f.username)) { fs.push(f); saveFriends(fs); }
}
export function removeFriend(username) { saveFriends(getFriends().filter(x => x.username !== username)); }

function chatKey(a, b) { return 'liqaa_chat:' + [a, b].map(x => String(x).toLowerCase()).sort().join(':'); }
export function getChatHistory(a, b) { return lsGet(chatKey(a, b), []); }
export function saveChatHistory(a, b, h) { lsSet(chatKey(a, b), h.slice(-200)); }

// ---------- الإشعارات ----------
export function getNotifications() { return lsGet('liqaa_notifications', []); }
export function addNotification(n) {
  const ns = getNotifications();
  ns.unshift(Object.assign({ id: Date.now() + '-' + Math.random().toString(36).slice(2, 6), handled: false, ts: Date.now() }, n));
  lsSet('liqaa_notifications', ns.slice(0, 100));
  try { window.dispatchEvent(new CustomEvent('liqaa-notify')); } catch (e) {}
}
export function markNotificationHandled(id) {
  const ns = getNotifications().map(n => n.id === id ? Object.assign({}, n, { handled: true }) : n);
  lsSet('liqaa_notifications', ns);
  try { window.dispatchEvent(new CustomEvent('liqaa-notify')); } catch (e) {}
}
export function clearNotifications() {
  lsSet('liqaa_notifications', []);
  try { window.dispatchEvent(new CustomEvent('liqaa-notify')); } catch (e) {}
}

// ---------- الأسماء والهويات ----------
export function myUsername() {
  const rec = getUserRecord() || getSession() || {};
  return String(rec.username || '').toLowerCase();
}
function roomNameSafe(s) { return String(s).toLowerCase().replace(/[^a-z0-9-]/g, '-'); }
export function personalRoom(username) { return 'user-' + roomNameSafe(username); }
export function dmRoom(a, b) {
  const x = roomNameSafe(a), y = roomNameSafe(b);
  return 'dm-' + (x < y ? x + '-' + y : y + '-' + x);
}

// ---------- توكن الدخول ----------
export async function makeToken(roomName, identity, name) {
  const cfg = LIVEKIT_CONFIG;
  const enc = new TextEncoder();
  const b64url = (bytes) => {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = b64url(enc.encode(JSON.stringify({
    iss: cfg.apiKey,
    sub: identity,
    exp: now + (cfg.tokenTtl || 3600),
    nbf: now - 10,
    name: name,
    video: { roomJoin: true, room: roomName, canUpdateOwnMetadata: true }
  })));
  const key = await crypto.subtle.importKey('raw', enc.encode(cfg.apiSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(header + '.' + payload))));
  return header + '.' + payload + '.' + sig;
}

// ---------- الـ Presence ----------
// كل مستخدم متصل عنده "غرفة شخصية" (user-username) بيمكث فيها بصمة حالة (metadata)
// عشان الأصدقاء يعرفوا: متصل؟ وش حالته إيه؟

// فحص هل مستخدم متصل (بينضم لغرفته لحظة ويقرأ حالته)
export async function probeUser(username, myId, waitMs = 2000) {
  const result = { online: false, name: '', username: String(username).toLowerCase(), status: '', avatar: '' };
  if (!username) return result;
  let room = null;
  try {
    const probeId = (myId || 'probe') + ':probe' + Math.random().toString(36).slice(2, 6);
    const token = await makeToken(personalRoom(username), probeId, 'probe');
    room = new Room();
    let settled = false;
    const cleanup = () => { try { room.disconnect(); } catch (e) {} };
    const settle = (res) => {
      if (settled) return;
      settled = true;
      result.online = res.online;
      result.name = res.name || '';
      result.status = res.status || 'active';
      result.avatar = res.avatar || '';
      setTimeout(cleanup, 250);
    };
    const timeout = setTimeout(() => settle({ online: false }), waitMs + 1200);
    const onP = (p) => {
      if (p.identity === probeId) return;
      let meta = {};
      try { meta = JSON.parse(p.metadata || '{}'); } catch (e) {}
      clearTimeout(timeout);
      settle({ online: true, name: meta.name || p.name || '', status: meta.status || 'active', avatar: meta.avatar || '' });
    };
    room.on(RoomEvent.ParticipantConnected, onP);
    await room.connect(LIVEKIT_CONFIG.url, token);
    room.remoteParticipants.forEach(onP);
  } catch (e) {
    /* غير متصل أو خطأ — نعتبره offline */
  }
  return result;
}

// عميل الـ presence: بيمكث في الغرفة الشخصية + بيسلم إشعارات واردة
export function createPresenceClient(username, name, status) {
  let room = null;
  const myId = roomNameSafe(username) + ':p' + Math.random().toString(36).slice(2, 8);
  const avatar = (getUserRecord() || {}).avatar || '';
  let onNotify = null;
  async function connect() {
    try {
      const token = await makeToken(personalRoom(username), myId, name);
      room = new Room();
      room.on(RoomEvent.DataReceived, (payload) => {
        try {
          const n = JSON.parse(new TextDecoder().decode(payload));
          if (n && n.__liqaa) {
            addNotification(n);
            if (onNotify) onNotify(n);
          }
        } catch (e) {}
      });
      await room.connect(LIVEKIT_CONFIG.url, token);
      room.localParticipant.setMetadata(JSON.stringify({ name: name, username: roomNameSafe(username), status: status || 'active', avatar: avatar }));
    } catch (e) {
      console.error('[Liqaa] presence connect failed:', e);
    }
  }
  function updateProfile(name2, status2) {
    if (room && room.localParticipant) {
      room.localParticipant.setMetadata(JSON.stringify({
        name: name2 || name,
        username: roomNameSafe(username),
        status: status2 || status || 'active', avatar: (getUserRecord() || {}).avatar || avatar
      }));
    }
  }
  function disconnect() { try { if (room) room.disconnect(); } catch (e) {} room = null; }
  return { connect, updateProfile, disconnect, setOnNotify: (fn) => { onNotify = fn; } };
}

// دَفْع إشعار لمستخدم (بينضم لغرفته لحظة ويبعت)
export async function pushNotify(username, data) {
  if (!username) return;
  try {
    const id = 'n' + Math.random().toString(36).slice(2, 8);
    const token = await makeToken(personalRoom(username), id, 'sys');
    const room = new Room();
    await room.connect(LIVEKIT_CONFIG.url, token);
    await new Promise(r => setTimeout(r, 450));
    room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(Object.assign({ __liqaa: true }, data))), 0, []);
    await new Promise(r => setTimeout(r, 550));
    room.disconnect();
    return true;
  } catch (e) {
    console.error('[Liqaa] pushNotify failed:', e);
    return false;
  }
}

/* ==========================================================================
   Liqaa 4.1 additions — meetings, contacts, blocking, reports, settings
   (everything above is preserved verbatim from v4)
   ========================================================================== */

// ---------- الاجتماعات (نفس مفتاح liqaa_rooms القديم للتوافق) ----------
export function getMeetings() {
  const list = lsGet('liqaa_rooms', []);
  return Array.isArray(list) ? list : [];
}
export function saveMeetings(list) { lsSet('liqaa_rooms', list.slice(0, 200)); }

export function findMeeting(code) {
  if (!code) return null;
  const c = String(code).trim().toUpperCase();
  return getMeetings().find(m => String(m.code).toUpperCase() === c) || null;
}

export function makeMeetingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

export function createMeeting(opts) {
  const o = opts || {};
  const rec = {
    code: o.code || makeMeetingCode(),
    name: (o.name || '').trim() || 'Liqaa meeting',
    desc: (o.desc || '').trim(),
    image: o.image || '',
    max: o.max || 20,
    password: o.requirePassword ? String(o.password || '') : '',
    requirePassword: !!o.requirePassword,
    allowRecording: o.allowRecording !== false,
    aiEnabled: !!o.aiEnabled,
    locked: false,
    waitingRoom: !!o.waitingRoom,
    host: o.host || '',
    // Kept on the meeting record so scheduled meetings survive navigation/reload.
    scheduledAt: Number(o.scheduledAt) || 0,
    notifyAt: Number(o.notifyAt) || 0,
    scheduleNotifiedAt: 0,
    createdAt: Date.now(),
    lastJoinedAt: 0
  };
  const list = getMeetings();
  list.unshift(rec);
  saveMeetings(list);
  return rec;
}

export function updateMeeting(code, patch) {
  const list = getMeetings();
  const i = list.findIndex(m => String(m.code).toUpperCase() === String(code).toUpperCase());
  if (i < 0) return null;
  list[i] = Object.assign({}, list[i], patch);
  saveMeetings(list);
  return list[i];
}

export function deleteMeeting(code) {
  saveMeetings(getMeetings().filter(m => String(m.code).toUpperCase() !== String(code).toUpperCase()));
}

export function touchMeeting(code) { updateMeeting(code, { lastJoinedAt: Date.now() }); }

// ---------- Scheduled meetings ----------
export function getScheduledMeetings() {
  return getMeetings().filter(m => Number(m.scheduledAt) > Date.now() - 60000);
}
export function scheduleMeeting(opts) {
  const o = Object.assign({}, opts || {}, { scheduledAt: Number((opts || {}).scheduledAt) || 0, notifyAt: Number((opts || {}).notifyAt) || 0 });
  return createMeeting(o);
}
export function markScheduleNotified(code) { return updateMeeting(code, { scheduleNotifiedAt: Date.now() }); }

/** يقبل كود / رابط كامل / نص فيه ?room= */
export function parseMeetingCode(raw) {
  let s = String(raw || '').trim();
  if (!s) return '';
  const m = s.match(/[?&]room=([^&\s]+)/i);
  if (m) s = decodeURIComponent(m[1]);
  else if (s.includes('/')) s = s.split(/[/?#]/).filter(Boolean).pop() || s;
  return s.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function meetingLink(code) {
  const base = location.origin + location.pathname.replace(/[^/]*$/, '');
  return base + 'room.html?room=' + encodeURIComponent(code);
}

// ---------- جهات الاتصال (مبنية على نفس liqaa_friends) ----------
export function getContacts() { return getFriends(); }
export function saveContacts(list) { saveFriends(list); }

// ---------- الحظر ----------
export function getBlocked() { return lsGet('liqaa_blocked', []); }
export function isBlocked(username) {
  const u = String(username || '').toLowerCase();
  return getBlocked().some(b => String(b.username || '').toLowerCase() === u);
}
export function blockUser(user) {
  const list = getBlocked();
  const u = String(user.username || user.name || '').toLowerCase();
  if (!u || list.some(b => String(b.username).toLowerCase() === u)) return list;
  list.unshift({ username: u, name: user.name || u, at: Date.now() });
  lsSet('liqaa_blocked', list);
  return list;
}
export function unblockUser(username) {
  const u = String(username || '').toLowerCase();
  lsSet('liqaa_blocked', getBlocked().filter(b => String(b.username).toLowerCase() !== u));
}

// ---------- البلاغات ----------
export function getReports() { return lsGet('liqaa_reports', []); }
export function submitReport(report) {
  const list = getReports();
  list.unshift(Object.assign({ id: 'r' + Date.now().toString(36), at: Date.now() }, report));
  lsSet('liqaa_reports', list.slice(0, 100));
  return list[0];
}

// ---------- الإعدادات ----------
const SETTINGS_DEFAULTS = {
  devices: { camera: '', mic: '', speaker: '' },
  joinWithMicOn: true,
  joinWithCamOn: true,
  notifyInvites: true,
  notifyReminders: true,
  notifySounds: true,
  aiSummaries: false,
  aiTranscription: false,
  aiStoreData: false,
  showOnlineStatus: true,
  allowContactRequests: true
};
export function getSettings() { return Object.assign({}, SETTINGS_DEFAULTS, lsGet('liqaa_settings', {})); }
export function saveSettings(patch) {
  lsSet('liqaa_settings', Object.assign({}, getSettings(), patch));
  return getSettings();
}

// ---------- التسجيلات المحلية (ميتاداتا فقط — الملف بينزل على الجهاز) ----------
export function getRecordings() { return lsGet('liqaa_recordings', []); }
export function addRecording(rec) {
  const list = getRecordings();
  list.unshift(Object.assign({ id: 'rec' + Date.now().toString(36), at: Date.now() }, rec));
  lsSet('liqaa_recordings', list.slice(0, 50));
  return list[0];
}
export function deleteRecording(id) {
  lsSet('liqaa_recordings', getRecordings().filter(r => r.id !== id));
}

// ---------- مساعدات العرض ----------
export function displayName(rec) {
  const r = rec || getUserRecord() || getSession() || {};
  const full = [r.firstName, r.lastName].filter(Boolean).join(' ').trim();
  if (full) return full;
  if (r.name) return r.name;
  if (r.email) return String(r.email).split('@')[0];
  return '';
}
export function initials(name) {
  const s = String(name || '').trim();
  if (!s) return '?';
  const parts = s.split(/\s+/);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s[0].toUpperCase();
}
export function maskEmail(email) {
  const s = String(email || '');
  const [u, d] = s.split('@');
  if (!d) return s;
  const head = u.slice(0, 2);
  return head + '*'.repeat(Math.max(2, u.length - 2)) + '@' + d;
}
