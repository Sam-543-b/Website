(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const copyEmailBtn = document.getElementById('copyEmail');
  const emailLink = document.getElementById('emailLink');
  const yearEl = document.getElementById('year');

  // Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    if (savedTheme === 'light') root.setAttribute('data-theme', 'light');
  } else {
    // Respect OS preference
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) root.setAttribute('data-theme', 'light');
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('.icon');
    if (!icon) return;
    icon.textContent = currentTheme() === 'light' ? '☀' : '☾';
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = currentTheme() === 'light' ? 'dark' : 'light';
      if (next === 'light') root.setAttribute('data-theme', 'light');
      else root.removeAttribute('data-theme');
      localStorage.setItem('theme', next);
      updateThemeIcon();
    });
  }

  // Copy email
  async function copyEmail() {
    const email = emailLink ? emailLink.textContent.trim() : '';
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      if (copyEmailBtn) {
        const prev = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied ✓';
        setTimeout(() => (copyEmailBtn.textContent = prev), 1200);
      }
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (copyEmailBtn) {
        const prev = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied ✓';
        setTimeout(() => (copyEmailBtn.textContent = prev), 1200);
      }
    }
  }

  if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyEmail);

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
