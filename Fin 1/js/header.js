// js/header.js
(function injectHeader() {
  // Inject header HTML if not present already (for standalone pages)
  if (!document.querySelector('.site-header')) {
    fetch('header.html')
      .then(r => r.text())
      .then(html => {
        const holder = document.getElementById('header');
        if (holder) holder.innerHTML = html;
        wireMenu();
        injectProgress();
      })
      .catch(() => {
        // Fallback if header.html not found
        wireMenu();
        injectProgress();
      });
  } else {
    wireMenu();
    injectProgress();
  }

  function wireMenu() {
    const nav = document.querySelector('.main-nav');
    const toggle = document.getElementById('menuToggle');
    const list = nav?.querySelector('ul#navLinks');
    if (!toggle || !list) return;

    let open = false;
    toggle.addEventListener('click', () => {
      open = !open;
      toggle.setAttribute('aria-expanded', String(open));
      list.classList.toggle('open', open);

      // Animate height based on content
      if (open) {
        list.style.height = list.scrollHeight + 'px';
        list.style.opacity = '1';
        list.style.transform = 'translateY(0)';
      } else {
        list.style.height = '0px';
        list.style.opacity = '0';
        list.style.transform = 'translateY(-6px)';
      }
    });

    // Close menu on nav link click (mobile)
    list.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (!open) return;
        toggle.click();
      });
    });
  }

  // Simple step progress setup based on <body data-step="">
  function injectProgress() {
    const step = Number(document.body.getAttribute('data-step') || '1');
    // If you later render a visual stepper here, you can read `step`
    // Currently styling is handled via CSS; this keeps room for future enhancements.
  }
})();
