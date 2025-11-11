// js/header.js
(function injectHeader() {
  // Inject header HTML if not present already (for standalone pages)
  if (!document.querySelector('.site-header')) {
    fetch('header.html')
      .then(r => r.text())
      .then(html => {
        const holder = document.getElementById('header');
        if (holder) holder.innerHTML = html;
        injectProgress();
      })
      .catch(() => {
        // Fallback if header.html not found
        injectProgress();
      });
  } else {
    injectProgress();
  }

  // Simple step progress setup based on <body data-step="">
  function injectProgress() {
    const step = Number(document.body.getAttribute('data-step') || '1');
    // If you later render a visual stepper here, you can read `step`
    // Currently styling is handled via CSS; this keeps room for future enhancements.
  }
})();