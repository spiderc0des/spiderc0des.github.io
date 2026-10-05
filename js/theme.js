// ── Theme ───────────────────────────────────────────────
// Loaded in <head> so the saved theme applies before first paint.
(function () {
  const root = document.documentElement;
  const KEY = 'theme';

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function initial() {
    const s = saved();
    if (s === 'light' || s === 'dark') return s;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const next = theme === 'dark' ? 'light' : 'dark';
      btn.querySelector('.tt-label').textContent = next;
      btn.setAttribute('aria-label', `Switch to ${next} mode`);
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }

  apply(initial());

  document.addEventListener('DOMContentLoaded', () => {
    apply(root.getAttribute('data-theme'));
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
  });
})();
