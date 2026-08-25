const SESSION_COOKIE = '__Host-liqaa_session';
const STATE_COOKIE = '__Host-liqaa_oauth_state';
const SESSION_SECONDS = 60 * 60 * 24 * 14;

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });
}
export function requireDB(env) { if (!env.DB) throw new Error('D1 binding DB is not configured'); return env.DB; }
export function parseCookies(request) {
  const raw = request.headers.get('Cookie') || '';
  return Object.fromEntries(raw.split(';').map(x => x.trim().split(/=(.*)/s)).filter(x => x[0]).map(([k,v]) => [k, decodeURIComponent(v || '')]));
}
function b64(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function unb64(value) { const p=value.replace(/-/g,'+').replace(/_/g,'/'); const s=atob(p + '='.repeat((4-p.length%4)%4)); return Uint8Array.from(s, c=>c.charCodeAt(0)); }
export function randomId() { const a = new Uint8Array(32); crypto.getRandomValues(a); return b64(a); }
async function hmac(secret, text) { const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']); return b64(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text)))); }
export async function createOAuthState(secret) { const payload=`${Date.now()}.${randomId()}`; return `${payload}.${await hmac(secret,payload)}`; }
export async function verifyOAuthState(state, secret) { try { const cut=String(state||'').lastIndexOf('.'); if(cut<1) return false; const payload=state.slice(0,cut), signature=state.slice(cut+1), expected=await hmac(secret,payload); if(signature.length!==expected.length) return false; let diff=0; for(let i=0;i<signature.length;i++)diff|=signature.charCodeAt(i)^expected.charCodeAt(i); const timestamp=Number(payload.split('.')[0]); return diff===0 && Number.isFinite(timestamp) && Date.now()-timestamp>=0 && Date.now()-timestamp<600000; } catch (_) { return false; } }
export function cookie(name, value, seconds, extra = '') { return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}${extra}`; }
export function clearCookie(name) { return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`; }
export function userView(row) { return { id:row.id, email:row.email, name:row.name || '', profile_image:row.profile_image || '', email_verified:!!row.email_verified }; }
export function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254; }
export function validPassword(password) { return typeof password === 'string' && password.length >= 8 && password.length <= 128; }
export async function hashPassword(password) {
  const salt = new Uint8Array(16); crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt, iterations:310000 }, key, 256);
  return `pbkdf2$sha256$310000$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}
export async function verifyPassword(password, stored) {
  try {
    const [type, hash, iter, saltText, digestText] = String(stored).split('$');
    if (type !== 'pbkdf2' || hash !== 'sha256' || !saltText || !digestText) return false;
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt:unb64(saltText), iterations:Number(iter) }, key, 256);
    const a = new Uint8Array(bits), b = unb64(digestText); if (a.length !== b.length) return false;
    let diff=0; for(let i=0;i<a.length;i++) diff|=a[i]^b[i]; return diff===0;
  } catch (_) { return false; }
}
export async function createSession(env, userId) {
  const id=randomId(), expires=new Date(Date.now()+SESSION_SECONDS*1000).toISOString();
  await requireDB(env).prepare('INSERT INTO sessions (id,user_id,expires_at) VALUES (?,?,?)').bind(id,userId,expires).run();
  return { id, expires };
}
export async function currentUser(request, env) {
  const id=parseCookies(request)[SESSION_COOKIE]; if (!id) return null;
  const db=requireDB(env);
  const row=await db.prepare('SELECT u.id,u.email,u.name,u.profile_image,u.email_verified FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at > CURRENT_TIMESTAMP').bind(id).first();
  return row || null;
}
export { SESSION_COOKIE, STATE_COOKIE, SESSION_SECONDS };
