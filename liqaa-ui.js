/* ==========================================================================
   Liqaa 4.1 — Shared UI runtime
   Theme, language (AR/RTL + EN/LTR), icons, toasts, modals, menus, app shell.
   Plain script (no module) so every page can use it, including non-module ones.
   ========================================================================== */
(function (global) {
  'use strict';

  var LS = {
    get: function (k, f) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    raw: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    setRaw: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------------- Icons (single consistent set: Feather-style strokes) --- */
  var ICONS = {
    logo: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M2.8 6.6C2.8 5.83 3.43 5.2 4.2 5.2H14.9C15.67 5.2 16.3 5.83 16.3 6.6V8.4L20.06 5.98C20.82 5.52 21.8 6.08 21.8 6.97V17.03C21.8 17.92 20.82 18.48 20.06 18.02L16.3 15.6V17.4C16.3 18.17 15.67 18.8 14.9 18.8H4.2C3.43 18.8 2.8 18.17 2.8 17.4V6.6Z"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></svg>',
    micOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
    camOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    screen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v7M10 10.5V6a2 2 0 0 0-4 0v9"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    record: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>',
    phoneOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.29.61A2 2 0 0 1 21.5 16v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34A19.79 19.79 0 0 1 2.62 4.5 2 2 0 0 1 4.61 2.5h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.4"/><line x1="23" y1="1" x2="1" y2="23"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9zM5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z"/></svg>',
    text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
    ban: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></svg>',
    google: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L21 8M21 15a9 9 0 0 1-14.85 3.36L3 16"/></svg>'
  };
  function icon(name, cls) {
    var svg = ICONS[name] || '';
    if (!svg) return '';
    return cls ? svg.replace('<svg', '<svg class="' + cls + '"') : svg;
  }

  /* ---------------- i18n ---------------- */
  var STR = {
    ar: {
      brand: 'لقاء', home: 'الرئيسية', meetings: 'الاجتماعات', contacts: 'جهات الاتصال',
      notifications: 'الإشعارات', settings: 'الإعدادات', profile: 'الملف الشخصي',
      help: 'المساعدة والدعم', logout: 'تسجيل الخروج', menu: 'القائمة', close: 'إغلاق',
      cancel: 'إلغاء', save: 'حفظ', saving: 'جارٍ الحفظ…', saved: 'تم حفظ الإعدادات',
      join: 'انضمام', joining: 'جارٍ الانضمام…', create: 'إنشاء', creating: 'جارٍ الإنشاء…',
      copyLink: 'نسخ رابط الاجتماع', linkCopied: 'تم نسخ رابط الاجتماع',
      markAllRead: 'تعليم الكل كمقروء', noNotifs: 'لا توجد إشعارات',
      themeTitle: 'تبديل المظهر', themeLabel: 'تبديل الوضع الفاتح والداكن',
      somethingWrong: 'حدث خطأ ما. برجاء المحاولة مرة أخرى.',
      today: 'اليوم', yesterday: 'أمس', now: 'الآن',
      minAgo: 'منذ {n} دقيقة', hourAgo: 'منذ {n} ساعة', dayAgo: 'منذ {n} يوم',
      about: 'عن لقاء', features: 'المميزات', contact: 'تواصل معنا',
      privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', cookies: 'سياسة الكوكيز',
      guidelines: 'إرشادات المجتمع', rights: '© 2026 لقاء. جميع الحقوق محفوظة.',
      footerAbout: 'اجتماعات فيديو بسيطة وآمنة — مصمّمة عشان تشتغل من أول ضغطة.',
      product: 'المنتج', company: 'الشركة', legal: 'قانوني', accept: 'قبول', decline: 'رفض', contactRequest: 'طلب إضافة إلى جهات الاتصال'
    },
    en: {
      brand: 'Liqaa', home: 'Home', meetings: 'Meetings', contacts: 'Contacts',
      notifications: 'Notifications', settings: 'Settings', profile: 'Profile',
      help: 'Help & Support', logout: 'Log out', menu: 'Menu', close: 'Close',
      cancel: 'Cancel', save: 'Save changes', saving: 'Saving…', saved: 'Settings saved',
      join: 'Join', joining: 'Joining…', create: 'Create', creating: 'Creating…',
      copyLink: 'Copy meeting link', linkCopied: 'Meeting link copied',
      markAllRead: 'Mark all as read', noNotifs: 'No notifications yet',
      themeTitle: 'Toggle theme', themeLabel: 'Toggle light/dark mode',
      somethingWrong: 'Something went wrong. Please try again.',
      today: 'Today', yesterday: 'Yesterday', now: 'Just now',
      minAgo: '{n} min ago', hourAgo: '{n} h ago', dayAgo: '{n} d ago',
      about: 'About', features: 'Features', contact: 'Contact',
      privacy: 'Privacy Policy', terms: 'Terms of Service', cookies: 'Cookie Policy',
      guidelines: 'Community Guidelines', rights: '© 2026 Liqaa. All rights reserved.',
      footerAbout: 'Simple, secure video meetings — built to just work from the first click.',
      product: 'Product', company: 'Company', legal: 'Legal', accept: 'Accept', decline: 'Decline', contactRequest: 'Contact request'
    }
  };

  var pageDict = {};
  function lang() { return LS.raw('lm-lang') === '"en"' || LS.raw('lm-lang') === 'en' ? 'en' : 'ar'; }
  function t(key, vars) {
    var l = lang();
    var d = pageDict[l] || {};
    var s = (d[key] !== undefined) ? d[key] : (STR[l][key] !== undefined ? STR[l][key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = String(s).replace('{' + k + '}', vars[k]); });
    return s;
  }
  function registerDict(dict) { pageDict = dict || {}; }

  function applyLang(l, opts) {
    l = (l === 'en') ? 'en' : 'ar';
    var root = document.documentElement;
    root.lang = l;
    root.dir = (l === 'ar') ? 'rtl' : 'ltr';
    LS.setRaw('lm-lang', l);
    var d = Object.assign({}, STR[l], pageDict[l] || {});
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (d[k] !== undefined) el.innerHTML = d[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph');
      if (d[k] !== undefined) el.setAttribute('placeholder', d[k]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-title');
      if (d[k] !== undefined) { el.setAttribute('title', d[k]); el.setAttribute('aria-label', d[k]); }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (d[k] !== undefined) el.setAttribute('aria-label', d[k]);
    });
    if (d.docTitle) document.title = d.docTitle;
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.textContent = (l === 'ar') ? 'EN' : 'ع'; });
    if (!opts || !opts.silent) document.dispatchEvent(new CustomEvent('liqaa:lang', { detail: { lang: l } }));
  }
  function toggleLang() { applyLang(lang() === 'ar' ? 'en' : 'ar'); }

  /* ---------------- Theme ---------------- */
  function isLight() { return document.documentElement.classList.contains('light'); }
  function applyTheme(light) {
    document.documentElement.classList.toggle('light', !!light);
    LS.setRaw('lm-theme', light ? 'light' : 'dark');
    document.dispatchEvent(new CustomEvent('liqaa:theme', { detail: { light: !!light } }));
  }
  function toggleTheme() { applyTheme(!isLight()); }

  /* ---------------- Toasts ---------------- */
  function toastHost() {
    var h = document.querySelector('.toast-host');
    if (!h) {
      h = document.createElement('div');
      h.className = 'toast-host';
      h.setAttribute('role', 'status');
      h.setAttribute('aria-live', 'polite');
      document.body.appendChild(h);
    }
    return h;
  }
  function toast(msg, type, ms) {
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : ' ok');
    var ic = type === 'error' ? 'alert' : (type === 'info' ? 'info' : 'checkCircle');
    el.innerHTML = icon(ic) + '<span></span>';
    el.querySelector('span').textContent = msg;
    toastHost().appendChild(el);
    var life = ms || 3200;
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 220);
    }, life);
    return el;
  }

  /* ---------------- Copy ---------------- */
  /* Always resolves to a boolean (true = copied). Never rejects, so callers
     can safely do .then(ok => ...). The async Clipboard API is unavailable or
     rejects outside a secure context (plain http://, some in-app webviews),
     so we fall back to a temporary textarea + execCommand. */
  function execCopyFallback(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      // keep it on-screen but invisible: iOS refuses to copy from display:none
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.insetInlineStart = '0';
      ta.style.width = '1px';
      ta.style.height = '1px';
      ta.style.padding = '0';
      ta.style.border = 'none';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length); // iOS Safari needs the explicit range
      var ok = document.execCommand('copy');
      ta.remove();
      return !!ok;
    } catch (e) { return false; }
  }

  function copyText(text) {
    text = String(text == null ? '' : text);
    if (!text) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text)
        .then(function () { return true; })
        .catch(function () { return execCopyFallback(text); });
    }
    return Promise.resolve(execCopyFallback(text));
  }

  /* ---------------- Focus trap + modals ---------------- */
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  var modalStack = [];

  function openModal(el, opts) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    opts = opts || {};
    el._liqaaReturn = document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalStack.push(el);
    setTimeout(function () {
      var target = el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
      if (target) try { target.focus(); } catch (e) {}
    }, 60);
    if (opts.onOpen) opts.onOpen();
  }
  function closeModal(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    modalStack = modalStack.filter(function (m) { return m !== el; });
    if (!modalStack.length) document.body.style.overflow = '';
    var r = el._liqaaReturn;
    if (r && r.focus) setTimeout(function () { try { r.focus(); } catch (e) {} }, 40);
  }
  function closeTopModal() {
    var top = modalStack[modalStack.length - 1];
    if (top) closeModal(top);
  }

  /** Wire scrim-click + [data-close] + Escape for a modal element */
  function bindModal(el) {
    if (typeof el === 'string') el = document.getElementById(el);
    if (!el || el._liqaaBound) return;
    el._liqaaBound = true;
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('mousedown', function (e) {
      if (e.target === el && el.dataset.static !== 'true') closeModal(el);
    });
    el.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(el); });
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(el.querySelectorAll(FOCUSABLE), function (n) { return n.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function bindAllModals(scope) {
    (scope || document).querySelectorAll('.modal-scrim').forEach(bindModal);
  }

  /* ---------------- Dropdown menus ---------------- */
  var openMenus = [];
  /** mirrors "is any menu open?" onto <body> so pages can react in CSS */
  function syncPopoverFlag() {
    if (!document.body) return;
    document.body.classList.toggle('popover-open', openMenus.length > 0);
  }
  function closeAllMenus(except) {
    openMenus.slice().forEach(function (m) {
      if (m.menu === except) return;
      // prefer the menu's own close(): it also detaches scroll/resize listeners
      if (typeof m.menu._liqaaClose === 'function') { m.menu._liqaaClose(); return; }
      m.menu.classList.remove('open');
      m.menu.classList.remove('menu-fixed');
      if (m.trigger) m.trigger.setAttribute('aria-expanded', 'false');
      openMenus = openMenus.filter(function (x) { return x !== m; });
    });
    syncPopoverFlag();
  }
  /** trigger + menu element; keeps menu inside viewport */
  function bindMenu(trigger, menu, opts) {
    if (typeof trigger === 'string') trigger = document.getElementById(trigger);
    if (typeof menu === 'string') menu = document.getElementById(menu);
    if (!trigger || !menu) return;
    opts = opts || {};
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');

    /* Does an ancestor clip us? (.card.flush uses overflow:hidden, scroll
       containers clip too.) If so we cannot rely on absolute positioning —
       the menu would be cut off inside the card. */
    function hasClippingAncestor() {
      var n = menu.parentElement;
      while (n && n !== document.body) {
        var s = getComputedStyle(n);
        if (/(auto|hidden|scroll|clip)/.test(s.overflow + s.overflowX + s.overflowY)) return true;
        n = n.parentElement;
      }
      return false;
    }

    function place() {
      // reset any previous positioning pass
      menu.style.left = ''; menu.style.right = ''; menu.style.top = '';
      menu.style.bottom = ''; menu.style.position = ''; menu.style.width = '';

      var GAP = 8, EDGE = 8;

      if (hasClippingAncestor()) {
        /* Escape the clip: pin to the viewport and anchor to the trigger.
           `position:fixed` is measured against the viewport, so no ancestor
           overflow can cut the menu off. */
        menu.style.position = 'fixed';
        menu.classList.add('menu-fixed');
        var t = trigger.getBoundingClientRect();
        var mw = menu.offsetWidth, mh = menu.offsetHeight;

        // align the menu's inline-end with the trigger's, then clamp
        var left = (getComputedStyle(document.documentElement).direction === 'rtl')
          ? t.left
          : t.right - mw;
        left = Math.max(EDGE, Math.min(left, window.innerWidth - mw - EDGE));
        menu.style.left = left + 'px';

        // flip up when there isn't room below
        var below = window.innerHeight - t.bottom;
        if (below < mh + GAP + EDGE && t.top > mh + GAP + EDGE) {
          menu.style.top = (t.top - mh - GAP) + 'px';
        } else {
          menu.style.top = Math.min(t.bottom + GAP, window.innerHeight - mh - EDGE) + 'px';
        }
        return;
      }

      menu.classList.remove('menu-fixed');
      // keep inside viewport horizontally
      var r = menu.getBoundingClientRect();
      if (r.left < EDGE) menu.style.left = (EDGE - r.left) + 'px';
      var over = r.right - (window.innerWidth - EDGE);
      if (over > 0) menu.style.left = (-over) + 'px';
      // flip up if not enough space below
      var tb = trigger.getBoundingClientRect();
      if (window.innerHeight - tb.bottom < r.height + 16 && tb.top > r.height + 16) {
        menu.style.top = 'auto';
        menu.style.bottom = 'calc(100% + 8px)';
      } else {
        menu.style.bottom = '';
        menu.style.top = 'calc(100% + 8px)';
      }
    }
    /* while open in fixed mode, keep it glued to the trigger */
    var reflow = null;
    function open() {
      closeAllMenus(menu);
      menu.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      openMenus.push({ menu: menu, trigger: trigger });
      place();
      syncPopoverFlag();
      if (!reflow) {
        reflow = function () {
          if (!menu.classList.contains('open')) return;
          // if the trigger scrolled out of view, close instead of floating loose
          var t = trigger.getBoundingClientRect();
          if (t.bottom < 0 || t.top > window.innerHeight) { close(); return; }
          place();
        };
        window.addEventListener('scroll', reflow, true);
        window.addEventListener('resize', reflow);
      }
      if (opts.onOpen) opts.onOpen();
    }
    function close() {
      menu.classList.remove('open');
      menu.classList.remove('menu-fixed');
      trigger.setAttribute('aria-expanded', 'false');
      openMenus = openMenus.filter(function (x) { return x.menu !== menu; });
      if (reflow) {
        window.removeEventListener('scroll', reflow, true);
        window.removeEventListener('resize', reflow);
        reflow = null;
      }
      syncPopoverFlag();
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menu.classList.contains('open')) close(); else open();
    });
    menu.addEventListener('click', function (e) { e.stopPropagation(); });
    menu._liqaaClose = close;
    menu._liqaaOpen = open;
    return { open: open, close: close };
  }

  document.addEventListener('click', function () { closeAllMenus(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (openMenus.length) { closeAllMenus(); return; }
      var drawer = document.getElementById('appDrawer');
      if (drawer && drawer.classList.contains('open')) { closeDrawer(); return; }
      closeTopModal();
    }
  });

  /* ---------------- Button loading ---------------- */
  function setLoading(btn, loading, labelText) {
    if (!btn) return;
    if (loading) {
      if (!btn._orig) btn._orig = btn.innerHTML;
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerHTML = '<span class="spinner"></span><span class="btn-label">' + (labelText || '') + '</span>';
    } else {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      if (btn._orig) btn.innerHTML = btn._orig;
      btn._orig = null;
    }
  }

  /* ---------------- Dates ---------------- */
  function fmtTime(ts) {
    try {
      return new Date(ts).toLocaleTimeString(lang() === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }
  function fmtDay(ts) {
    var d = new Date(ts), now = new Date();
    var sameDay = d.toDateString() === now.toDateString();
    var y = new Date(now.getTime() - 86400000);
    if (sameDay) return t('today');
    if (d.toDateString() === y.toDateString()) return t('yesterday');
    try {
      return d.toLocaleDateString(lang() === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' });
    } catch (e) { return ''; }
  }
  function fmtDateTime(ts) { return fmtDay(ts) + ' • ' + fmtTime(ts); }
  function timeAgo(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return t('now');
    var m = Math.floor(s / 60);
    if (m < 60) return t('minAgo', { n: m });
    var h = Math.floor(m / 60);
    if (h < 24) return t('hourAgo', { n: h });
    return t('dayAgo', { n: Math.floor(h / 24) });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- Session helpers (mirror liqaa-core, no module needed) ---- */
  function session() { return LS.get('liqaa_session', null); }
  function users() {
    var list = LS.get('liqaa_users', []);
    return (Array.isArray(list) ? list : []).map(function (u) {
      return typeof u === 'string' ? { email: u, verified: true } : u;
    });
  }
  function currentUser() {
    var s = session();
    if (!s || !s.email) return null;
    var found = null;
    users().forEach(function (u) {
      if (u.email && u.email.toLowerCase() === s.email.toLowerCase()) found = u;
    });
    return Object.assign({}, s, found || {});
  }
  function displayName(u) {
    var r = u || currentUser() || {};
    var full = [r.firstName, r.lastName].filter(Boolean).join(' ').trim();
    if (full) return full;
    if (r.name) return r.name;
    if (r.email) return String(r.email).split('@')[0];
    return '';
  }
  function initials(name) {
    var s = String(name || '').trim();
    if (!s) return '?';
    var p = s.split(/\s+/);
    if (p.length > 1) return (p[0][0] + p[1][0]).toUpperCase();
    return s[0].toUpperCase();
  }
  function requireAuth() {
    var s = session();
    if (!s || !s.email) { location.replace('login.html'); return false; }
    return true;
  }
  function logout() {
    try { localStorage.removeItem('liqaa_session'); } catch (e) {}
    location.href = 'index.html';
  }

  /* ---------------- Notifications ---------------- */
  function notifications() {
    var n = LS.get('liqaa_notifications', []);
    return Array.isArray(n) ? n : [];
  }
  function unreadCount() {
    return notifications().filter(function (n) { return !n.read && !n.handled; }).length;
  }
  function markAllRead() {
    LS.set('liqaa_notifications', notifications().map(function (n) {
      return Object.assign({}, n, { read: true });
    }));
    try { window.dispatchEvent(new CustomEvent('liqaa-notify')); } catch (e) {}
  }

  /* ---------------- Presence + contact requests ---------------- */
  var coreApi = null, presenceClient = null;
  function startPresence() {
    if (startPresence._started || !session() || !session().email) return;
    startPresence._started = true;
    import('./liqaa-core.js').then(function (core) {
      coreApi = core;
      var u = core.myUsername(); if (!u) return;
      var rec = core.getUserRecord() || core.getSession() || {};
      presenceClient = core.createPresenceClient(u, core.displayName(rec), 'active');
      presenceClient.setOnNotify(function (n) {
        if (!n) return;
        if (n.type === 'contact-accepted') {
          core.addFriend({ username: n.from, name: n.fromName || n.from, status: 'active', avatar: n.avatar || '' });
          core.addNotification(Object.assign({}, n, { type: 'contact-accepted', text: (lang() === 'ar' ? 'قبل ' : '') + (n.fromName || n.from) + (lang() === 'ar' ? ' طلب الإضافة' : ' accepted your contact request') }));
        } else core.addNotification(n);
      });
      presenceClient.connect();
      window.addEventListener('pagehide', function () { try { presenceClient.disconnect(); } catch (e) {} }, { once: true });
    }).catch(function () {});
  }
  function respondContactRequest(n, accepted) {
    if (!coreApi || !n || !n.from) return;
    if (accepted) coreApi.addFriend({ username: n.from, name: n.fromName || n.from, status: 'active', avatar: n.avatar || '' });
    coreApi.markNotificationHandled(n.id);
    coreApi.pushNotify(n.from, { type: accepted ? 'contact-accepted' : 'contact-declined', from: coreApi.myUsername(), fromName: coreApi.displayName(coreApi.getUserRecord() || {}), avatar: (coreApi.getUserRecord() || {}).avatar || '' });
    renderNotifList();
  }

  /* ---------------- App shell (top nav) ---------------- */
  function navItems() {
    return [
      { id: 'home', href: 'dashboard.html', icon: 'home', key: 'home' },
      { id: 'meetings', href: 'meetings.html', icon: 'video', key: 'meetings' },
      { id: 'contacts', href: 'contacts.html', icon: 'users', key: 'contacts' },
      { id: 'settings', href: 'settings.html', icon: 'settings', key: 'settings' }
    ];
  }

  function renderAppBar(active) {
    var u = currentUser() || {};
    var name = displayName(u);
    var av = u.avatar
      ? '<img src="' + escapeHtml(u.avatar) + '" alt="">'
      : escapeHtml(initials(name));

    var links = navItems().map(function (it) {
      return '<a class="nav-link' + (it.id === active ? ' active' : '') + '" href="' + it.href + '"' +
        (it.id === active ? ' aria-current="page"' : '') + '>' + icon(it.icon) +
        '<span data-i18n="' + it.key + '">' + t(it.key) + '</span></a>';
    }).join('');

    var drawerLinks = navItems().map(function (it) {
      return '<a class="nav-link' + (it.id === active ? ' active' : '') + '" href="' + it.href + '">' +
        icon(it.icon) + '<span data-i18n="' + it.key + '">' + t(it.key) + '</span></a>';
    }).join('');

    return '' +
    '<a class="skip-link" href="#main" data-i18n="skipToContent">' + (lang() === 'ar' ? 'تخطَّ إلى المحتوى' : 'Skip to content') + '</a>' +
    '<header class="appbar">' +
      '<div class="container wide appbar-inner">' +
        '<a class="brand" href="dashboard.html"><span class="brand-mark">' + icon('logo') + '</span>' +
          '<span data-i18n="brand">' + t('brand') + '</span></a>' +
        '<nav class="nav-links" aria-label="Main">' + links + '</nav>' +
        '<div class="nav-end">' +
          '<button class="lang-btn" id="langToggle" type="button">' + (lang() === 'ar' ? 'EN' : 'ع') + '</button>' +
          '<button class="switch" id="themeToggle" type="button" data-i18n-title="themeTitle" title="' + t('themeTitle') + '">' +
            '<span class="knob">' +
              '<svg class="ic ic-moon" viewBox="0 0 24 24" fill="#fff"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
              '<svg class="ic ic-sun" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
            '</span></button>' +
          '<div class="menu-wrap">' +
            '<button class="icon-btn" id="notifBtn" type="button" data-i18n-title="notifications" title="' + t('notifications') + '">' +
              icon('bell') + '<span class="notif-dot" id="notifDot" hidden></span></button>' +
            '<div class="menu notif-panel" id="notifMenu" role="menu">' +
              '<div class="np-head"><b data-i18n="notifications">' + t('notifications') + '</b>' +
                '<button class="btn btn-ghost btn-sm" id="notifReadAll" type="button" data-i18n="markAllRead">' + t('markAllRead') + '</button></div>' +
              '<div class="np-list" id="notifList"></div>' +
            '</div>' +
          '</div>' +
          '<div class="menu-wrap">' +
            '<button class="avatar-btn" id="profileBtn" type="button" data-i18n-title="profile" title="' + t('profile') + '">' +
              '<span class="avatar sm" id="navAvatar">' + av + '</span></button>' +
            '<div class="menu" id="profileMenu" role="menu">' +
              '<div class="menu-head"><div class="mh-name" id="pmName">' + escapeHtml(name) + '</div>' +
                '<div class="mh-mail" id="pmMail">' + escapeHtml(u.email || '') + '</div></div>' +
              '<a class="menu-item" href="settings.html#account" role="menuitem">' + icon('user') + '<span data-i18n="profile">' + t('profile') + '</span></a>' +
              '<a class="menu-item" href="settings.html" role="menuitem">' + icon('settings') + '<span data-i18n="settings">' + t('settings') + '</span></a>' +
              '<a class="menu-item" href="help.html" role="menuitem">' + icon('help') + '<span data-i18n="help">' + t('help') + '</span></a>' +
              '<div class="menu-sep"></div>' +
              '<button class="menu-item danger" id="logoutBtn" type="button" role="menuitem">' + icon('logout') + '<span data-i18n="logout">' + t('logout') + '</span></button>' +
            '</div>' +
          '</div>' +
          '<button class="icon-btn burger" id="burgerBtn" type="button" data-i18n-title="menu" title="' + t('menu') + '">' + icon('menu') + '</button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="drawer-scrim" id="drawerScrim"></div>' +
    '<aside class="drawer" id="appDrawer" aria-hidden="true">' +
      '<div class="drawer-head">' +
        '<a class="brand" href="dashboard.html"><span class="brand-mark">' + icon('logo') + '</span>' +
          '<span data-i18n="brand">' + t('brand') + '</span></a>' +
        '<button class="icon-btn" id="drawerClose" type="button" data-i18n-title="close" title="' + t('close') + '">' + icon('close') + '</button>' +
      '</div>' +
      drawerLinks +
      '<a class="nav-link" href="settings.html#account">' + icon('user') + '<span data-i18n="profile">' + t('profile') + '</span></a>' +
      '<div class="menu-sep"></div>' +
      '<button class="nav-link" id="drawerLogout" type="button" style="color:var(--danger)">' + icon('logout') + '<span data-i18n="logout">' + t('logout') + '</span></button>' +
    '</aside>';
  }

  function openDrawer() {
    var d = document.getElementById('appDrawer'), s = document.getElementById('drawerScrim');
    if (!d) return;
    d.classList.add('open'); d.setAttribute('aria-hidden', 'false');
    if (s) s.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    var d = document.getElementById('appDrawer'), s = document.getElementById('drawerScrim');
    if (!d) return;
    d.classList.remove('open'); d.setAttribute('aria-hidden', 'true');
    if (s) s.classList.remove('open');
    document.body.style.overflow = '';
  }

  function notifIconFor(n) {
    if (n.type === 'invite' || n.type === 'call') return 'video';
    if (n.type === 'reminder') return 'clock';
    if (n.type === 'friend') return 'userPlus';
    return 'bell';
  }

  function renderNotifList() {
    var list = document.getElementById('notifList');
    if (!list) return;
    var ns = notifications();
    if (!ns.length) {
      list.innerHTML = '<div class="np-empty">' + escapeHtml(t('noNotifs')) + '</div>';
    } else {
      list.innerHTML = ns.slice(0, 30).map(function (n) {
        var txt = n.text || n.title || (n.from ? (n.from + ' — ' + (n.kind || '')) : '');
        var cls = (!n.read && !n.handled) ? ' unread' : '';
        var body = '<div class="np-ic">' + icon(notifIconFor(n)) + '</div>' +
          '<div class="np-body"><div class="np-txt">' + escapeHtml(txt) + '</div>' +
          '<div class="np-time">' + escapeHtml(timeAgo(n.ts || Date.now())) + '</div>';
        if (n.type === 'contact-request' && n.from && !n.handled) {
          body += '<div class="np-actions"><button class="btn btn-primary btn-sm" type="button" data-contact-response="accept" data-notif-id="' + escapeHtml(n.id || '') + '">' + escapeHtml(t('accept')) + '</button><button class="btn btn-secondary btn-sm" type="button" data-contact-response="decline" data-notif-id="' + escapeHtml(n.id || '') + '">' + escapeHtml(t('decline')) + '</button></div>';
        } else if (n.room) {
          body += '<div class="np-actions"><a class="btn btn-primary btn-sm" href="prejoin.html?room=' +
            encodeURIComponent(n.room) + '">' + escapeHtml(t('join')) + '</a></div>';
        }
        body += '</div>';
        return '<div class="np-item' + cls + '">' + body + '</div>';
      }).join('');
    }
    var dot = document.getElementById('notifDot');
    if (dot) {
      var c = unreadCount();
      dot.hidden = c === 0;
      dot.textContent = c > 9 ? '9+' : String(c);
    }
    list.querySelectorAll('[data-contact-response]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-notif-id');
        var n = notifications().find(function (x) { return x.id === id; });
        respondContactRequest(n, btn.getAttribute('data-contact-response') === 'accept');
      });
    });
  }

  function mountAppBar(active) {
    var host = document.getElementById('appShell');
    if (!host) return;
    host.innerHTML = renderAppBar(active);

    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    var langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.addEventListener('click', toggleLang);

    bindMenu('notifBtn', 'notifMenu', { onOpen: renderNotifList });
    bindMenu('profileBtn', 'profileMenu');

    var readAll = document.getElementById('notifReadAll');
    if (readAll) readAll.addEventListener('click', function (e) {
      e.stopPropagation(); markAllRead(); renderNotifList();
    });

    var lo = document.getElementById('logoutBtn');
    if (lo) lo.addEventListener('click', logout);
    var dlo = document.getElementById('drawerLogout');
    if (dlo) dlo.addEventListener('click', logout);

    var burger = document.getElementById('burgerBtn');
    if (burger) burger.addEventListener('click', function (e) { e.stopPropagation(); openDrawer(); });
    var dc = document.getElementById('drawerClose');
    if (dc) dc.addEventListener('click', closeDrawer);
    var ds = document.getElementById('drawerScrim');
    if (ds) ds.addEventListener('click', closeDrawer);

    renderNotifList();
    if (!mountAppBar._bound) {
      mountAppBar._bound = true;
      window.addEventListener('liqaa-notify', renderNotifList);
      document.addEventListener('liqaa:lang', function () {
        var a = document.querySelector('.nav-link.active');
        var id = null;
        navItems().forEach(function (it) { if (a && a.getAttribute('href') === it.href) id = it.id; });
        mountAppBar(id || mountAppBar._active);
      });
    }
    mountAppBar._active = active;
  }

  /* ---------------- Public footer ---------------- */
  function renderFooter() {
    return '' +
    '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-col">' +
          '<a class="brand" href="index.html"><span class="brand-mark">' + icon('logo') + '</span>' +
            '<span data-i18n="brand">' + t('brand') + '</span></a>' +
          '<p class="footer-about" data-i18n="footerAbout">' + t('footerAbout') + '</p>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="product">' + t('product') + '</h4>' +
          '<a href="index.html#features" data-i18n="features">' + t('features') + '</a>' +
          '<a href="login.html" data-i18n="signIn">' + (lang() === 'ar' ? 'تسجيل الدخول' : 'Sign in') + '</a>' +
          '<a href="signup.html" data-i18n="createAccount">' + (lang() === 'ar' ? 'إنشاء حساب' : 'Create account') + '</a>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="company">' + t('company') + '</h4>' +
          '<a href="index.html#about" data-i18n="about">' + t('about') + '</a>' +
          '<a href="help.html" data-i18n="help">' + t('help') + '</a>' +
          '<a href="help.html#contact" data-i18n="contact">' + t('contact') + '</a>' +
        '</div>' +
        '<div class="footer-col"><h4 data-i18n="legal">' + t('legal') + '</h4>' +
          '<a href="privacy.html" data-i18n="privacy">' + t('privacy') + '</a>' +
          '<a href="terms.html" data-i18n="terms">' + t('terms') + '</a>' +
          '<a href="cookies.html" data-i18n="cookies">' + t('cookies') + '</a>' +
          '<a href="guidelines.html" data-i18n="guidelines">' + t('guidelines') + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom"><span data-i18n="rights">' + t('rights') + '</span>' +
        '<span class="row" style="gap:14px"><a href="privacy.html" style="color:inherit;text-decoration:none" data-i18n="privacy">' + t('privacy') + '</a>' +
        '<a href="terms.html" style="color:inherit;text-decoration:none" data-i18n="terms">' + t('terms') + '</a></span></div>' +
    '</div></footer>';
  }
  function mountFooter() {
    var host = document.getElementById('siteFooter');
    if (host) host.innerHTML = renderFooter();
  }

  /* ---------------- Public page top bar ---------------- */
  function mountPublicBar(opts) {
    opts = opts || {};
    var host = document.getElementById('publicBar');
    if (!host) return;
    var authed = !!(session() && session().email);
    host.innerHTML = '' +
      '<header class="appbar"><div class="container wide appbar-inner">' +
        '<a class="brand" href="index.html"><span class="brand-mark">' + icon('logo') + '</span>' +
          '<span data-i18n="brand">' + t('brand') + '</span></a>' +
        '<div class="nav-end">' +
          '<button class="lang-btn" id="langToggle" type="button">' + (lang() === 'ar' ? 'EN' : 'ع') + '</button>' +
          '<button class="switch" id="themeToggle" type="button" data-i18n-title="themeTitle" title="' + t('themeTitle') + '">' +
            '<span class="knob">' +
              '<svg class="ic ic-moon" viewBox="0 0 24 24" fill="#fff"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
              '<svg class="ic ic-sun" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
            '</span></button>' +
          (opts.accountAction
            ? '<a class="btn btn-primary btn-sm" href="signup.html">' + (lang() === 'ar' ? 'أنشئ حساب' : 'Create account') + '</a>'
            : (authed
              ? '<a class="btn btn-primary btn-sm" href="dashboard.html">' + (lang() === 'ar' ? 'لوحة التحكم' : 'Dashboard') + '</a>'
              : '<a class="btn btn-ghost btn-sm" href="login.html" data-i18n="signIn">' + (lang() === 'ar' ? 'تسجيل الدخول' : 'Sign in') + '</a>' +
                '<a class="btn btn-primary btn-sm" href="signup.html" data-i18n="getStarted">' + (lang() === 'ar' ? 'ابدأ مجانًا' : 'Get started') + '</a>')) +
        '</div>' +
      '</div></header>';
    var tb = document.getElementById('themeToggle');
    if (tb) tb.addEventListener('click', toggleTheme);
    var lb = document.getElementById('langToggle');
    if (lb) lb.addEventListener('click', toggleLang);
  }

  /* ---------------- Confirm dialog ---------------- */
  function confirmDialog(opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var scrim = document.createElement('div');
      scrim.className = 'modal-scrim';
      scrim.innerHTML =
        '<div class="modal" role="dialog" aria-modal="true">' +
          '<div class="modal-head"><div class="mt"><h2></h2><p></p></div>' +
            '<button class="modal-close" type="button" data-x>' + icon('close') + '</button></div>' +
          '<div class="modal-foot">' +
            '<button class="btn btn-secondary" type="button" data-no></button>' +
            '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" type="button" data-yes data-autofocus></button>' +
          '</div>' +
        '</div>';
      scrim.querySelector('h2').textContent = opts.title || '';
      var p = scrim.querySelector('p');
      if (opts.message) p.textContent = opts.message; else p.remove();
      scrim.querySelector('[data-no]').textContent = opts.cancelText || t('cancel');
      scrim.querySelector('[data-yes]').textContent = opts.confirmText || 'OK';
      document.body.appendChild(scrim);
      bindModal(scrim);
      function done(v) {
        closeModal(scrim);
        setTimeout(function () { scrim.remove(); }, 320);
        resolve(v);
      }
      scrim.querySelector('[data-yes]').addEventListener('click', function () { done(true); });
      scrim.querySelector('[data-no]').addEventListener('click', function () { done(false); });
      scrim.querySelector('[data-x]').addEventListener('click', function () { done(false); });
      scrim.addEventListener('mousedown', function (e) { if (e.target === scrim) done(false); });
      requestAnimationFrame(function () { openModal(scrim); });
    });
  }

  /* ---------------- Media device helpers ---------------- */
  function listDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return Promise.resolve({ cams: [], mics: [], speakers: [] });
    }
    return navigator.mediaDevices.enumerateDevices().then(function (ds) {
      return {
        cams: ds.filter(function (d) { return d.kind === 'videoinput'; }),
        mics: ds.filter(function (d) { return d.kind === 'audioinput'; }),
        speakers: ds.filter(function (d) { return d.kind === 'audiooutput'; })
      };
    }).catch(function () { return { cams: [], mics: [], speakers: [] }; });
  }
  function fillDeviceSelect(sel, devices, selectedId, fallbackLabel) {
    if (!sel) return;
    sel.innerHTML = '';
    if (!devices.length) {
      var o = document.createElement('option');
      o.value = ''; o.textContent = fallbackLabel || '—';
      sel.appendChild(o);
      return;
    }
    devices.forEach(function (d, i) {
      var o = document.createElement('option');
      o.value = d.deviceId;
      o.textContent = d.label || (fallbackLabel + ' ' + (i + 1));
      sel.appendChild(o);
    });
    if (selectedId) sel.value = selectedId;
  }
  function mediaErrorMessage(err) {
    var n = err && err.name;
    var ar = lang() === 'ar';
    if (n === 'NotAllowedError' || n === 'SecurityError') {
      return ar ? 'معرفناش نوصل للكاميرا أو المايك — راجع أذونات المتصفح.'
                : "We couldn't access your camera or microphone. Please check your browser permissions.";
    }
    if (n === 'NotFoundError' || n === 'OverconstrainedError') {
      return ar ? 'مفيش كاميرا أو مايك متوصلين بالجهاز.' : 'No camera or microphone was found on this device.';
    }
    if (n === 'NotReadableError') {
      return ar ? 'الكاميرا أو المايك مستخدمين في برنامج تاني.' : 'Your camera or microphone is being used by another app.';
    }
    return ar ? 'حصلت مشكلة في الوصول للأجهزة. جرّب تاني.' : 'Something went wrong accessing your devices. Please try again.';
  }

  /* ---------------- Navigation prefetch ----------------
     HTML pages remain normal links (works without JS), but warm the browser
     cache as soon as a person points at or focuses a local page link. */
  function enableNavPrefetch() {
    if (enableNavPrefetch._bound) return;
    enableNavPrefetch._bound = true;
    var loaded = {};
    function warm(a) {
      if (!a || !a.href || a.target || a.hasAttribute('download')) return;
      var u; try { u = new URL(a.href, location.href); } catch (e) { return; }
      if (u.origin !== location.origin || !/\.html$/i.test(u.pathname) || u.pathname === location.pathname || loaded[u.href]) return;
      loaded[u.href] = true;
      var l = document.createElement('link'); l.rel = 'prefetch'; l.href = u.href; l.as = 'document';
      document.head.appendChild(l);
    }
    document.addEventListener('pointerover', function (e) { warm(e.target.closest && e.target.closest('a[href]')); }, { passive: true });
    document.addEventListener('focusin', function (e) { warm(e.target.closest && e.target.closest('a[href]')); });
  }

  /* ---------------- Scheduled-meeting reminders ----------------
     Kept in the shared runtime so reminders remain active while the user is
     anywhere in Liqaa, not just on the Meetings page. */
  var scheduledReminderTimers = [];
  function refreshScheduledReminders() {
    scheduledReminderTimers.forEach(function (id) { clearTimeout(id); });
    scheduledReminderTimers = [];
    var rooms = LS.get('liqaa_rooms', []);
    if (!Array.isArray(rooms)) return;
    rooms.forEach(function (m) {
      var at = Number(m && m.notifyAt || 0);
      if (!at || m.scheduleNotifiedAt || at <= Date.now()) return;
      var wait = Math.min(at - Date.now(), 2147483647);
      scheduledReminderTimers.push(setTimeout(function () {
        var list = LS.get('liqaa_rooms', []);
        var room = Array.isArray(list) && list.find(function (x) { return x.code === m.code; });
        if (!room || room.scheduleNotifiedAt) return;
        var start = room.scheduledAt ? fmtDateTime(room.scheduledAt) : '';
        var ar = lang() === 'ar';
        var title = ar ? 'اجتماع قريب' : 'Upcoming meeting';
        var text = ar ? ('اجتماع ' + (room.name || '') + ' سيبدأ ' + start) : ((room.name || 'Meeting') + ' starts ' + start);
        var ns = LS.get('liqaa_notifications', []); if (!Array.isArray(ns)) ns = [];
        ns.unshift({ id: Date.now() + '-schedule', type: 'reminder', title: room.name || '', text: text, room: room.code, ts: Date.now(), read: false, handled: false });
        LS.set('liqaa_notifications', ns.slice(0, 100));
        room.scheduleNotifiedAt = Date.now(); LS.set('liqaa_rooms', list);
        try { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body: text, icon: 'liqaa-logo.png' }); } catch (e) {}
        try { window.dispatchEvent(new CustomEvent('liqaa-notify')); } catch (e) {}
      }, wait));
    });
  }

  /* ---------------- Boot ---------------- */
  function boot(opts) {
    opts = opts || {};
    if (opts.dict) registerDict(opts.dict);
    if (opts.requireAuth && !requireAuth()) return false;
    applyLang(lang(), { silent: true });
    if (opts.appBar !== false && document.getElementById('appShell')) mountAppBar(opts.active);
    if (document.getElementById('publicBar')) mountPublicBar({ accountAction: !!opts.publicAccountAction });
    if (document.getElementById('siteFooter')) mountFooter();
    bindAllModals();
    enableNavPrefetch();
    refreshScheduledReminders();
    startPresence();
    document.addEventListener('liqaa:lang', function () {
      if (document.getElementById('publicBar')) mountPublicBar({ accountAction: !!opts.publicAccountAction });
      if (document.getElementById('siteFooter')) mountFooter();
    });
    return true;
  }

  global.Liqaa = {
    LS: LS, icon: icon, ICONS: ICONS,
    lang: lang, t: t, applyLang: applyLang, toggleLang: toggleLang, registerDict: registerDict,
    isLight: isLight, applyTheme: applyTheme, toggleTheme: toggleTheme,
    toast: toast, copyText: copyText,
    openModal: openModal, closeModal: closeModal, bindModal: bindModal, bindAllModals: bindAllModals,
    bindMenu: bindMenu, closeAllMenus: closeAllMenus,
    setLoading: setLoading,
    fmtTime: fmtTime, fmtDay: fmtDay, fmtDateTime: fmtDateTime, timeAgo: timeAgo,
    escapeHtml: escapeHtml,
    session: session, users: users, currentUser: currentUser, displayName: displayName,
    initials: initials, requireAuth: requireAuth, logout: logout,
    notifications: notifications, unreadCount: unreadCount, markAllRead: markAllRead,
    renderNotifList: renderNotifList, mountAppBar: mountAppBar, mountFooter: mountFooter,
    mountPublicBar: mountPublicBar, openDrawer: openDrawer, closeDrawer: closeDrawer,
    confirm: confirmDialog,
    listDevices: listDevices, fillDeviceSelect: fillDeviceSelect, mediaErrorMessage: mediaErrorMessage,
    refreshScheduledReminders: refreshScheduledReminders,
    boot: boot
  };
})(window);
