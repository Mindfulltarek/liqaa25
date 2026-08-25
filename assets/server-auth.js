(function () {
  var publicPage = /(?:^|\/)login\.html$|(?:^|\/)signup\.html$/.test(location.pathname);
  fetch('/api/auth/me', { credentials: 'same-origin' }).then(function (r) {
    if (!r.ok) throw new Error('UNAUTHENTICATED'); return r.json();
  }).then(function (data) {
    var u = data.user, prior = null; try { prior = JSON.parse(localStorage.getItem('liqaa_session') || 'null'); } catch (_) {}
    var next = { id:u.id, email:u.email, firstName:(u.name || '').split(/\s+/)[0] || '', lastName:(u.name || '').split(/\s+/).slice(1).join(' '), avatar:u.profile_image || '', verified:!!u.email_verified };
    if (publicPage) { location.replace('dashboard.html'); return; }
    if (!prior || prior.id !== u.id || prior.email !== u.email) { localStorage.setItem('liqaa_session', JSON.stringify(next)); location.reload(); }
  }).catch(function () {
    if (!publicPage) location.replace('login.html');
  });
})();
