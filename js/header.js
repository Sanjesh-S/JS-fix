// js/header.js (FIXED)
(function injectHeader() {
  
  // This function now runs *after* the HTML is loaded
  function runInit() {
    injectProgress();
    // NEW: Dispatch a custom event so other scripts know the header is ready
    document.dispatchEvent(new Event('headerLoaded'));
  }

  // Inject header HTML if not present already (for standalone pages)
  if (!document.querySelector('.site-header')) {
    fetch('header.html')
      .then(r => r.text())
      .then(html => {
        const holder = document.getElementById('header');
        if (holder) holder.innerHTML = html;
        runInit(); // Call after injection
      })
      .catch(() => {
        runInit(); // Call even on failure
      });
  } else {
    runInit(); // Call if header was already present
  }

  // Simple step progress setup based on <body data-step="">
  function injectProgress() {
    const step = Number(document.body.getAttribute('data-step') || '1');
    // If you later render a visual stepper here, you can read `step`
    // Currently styling is handled via CSS; this keeps room for future enhancements.
  }
})();