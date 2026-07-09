// track.js — lightweight usage tracker shared across all pages.
// Sends: (1) one "visit" ping per session per day (daily unique users),
// (2) a periodic "heartbeat" while the tab is visible (currently-active users + location).
// Pauses heartbeats when the tab is hidden to stay well within Cloudflare KV's free write quota.
(function () {
  const TRACK_URL = "https://facpscanner.memesblast01.workers.dev/track";
  const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

  let sessionId = localStorage.getItem('fa_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('fa_session_id', sessionId);
  }

  const page = location.pathname.split('/').pop() || 'index.html';
  const today = new Date().toISOString().slice(0, 10);

  function send(type) {
    try {
      fetch(TRACK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, sessionId, page }),
      }).catch(() => {});
    } catch (e) {}
  }

  // Daily unique visit — sent at most once per session per calendar day
  const lastVisitDate = localStorage.getItem('fa_last_visit_date');
  if (lastVisitDate !== today) {
    send('visit');
    localStorage.setItem('fa_last_visit_date', today);
  }

  let heartbeatTimer = null;
  function startHeartbeat() {
    if (heartbeatTimer) return;
    send('heartbeat');
    heartbeatTimer = setInterval(() => send('heartbeat'), HEARTBEAT_INTERVAL_MS);
  }
  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  }

  if (document.visibilityState === 'visible') startHeartbeat();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') startHeartbeat();
    else stopHeartbeat();
  });
})();
