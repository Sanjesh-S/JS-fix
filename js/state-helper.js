 // js/state-helper.js
// Helper to safely read valuationData from sessionStorage and show a friendly message if missing/corrupt.

(function (window, document) {
  // Read and parse valuationData safely.
  function safeGetValuationData() {
    try {
      const s = sessionStorage.getItem('valuationData');
      if (!s) return null;
      return JSON.parse(s);
    } catch (err) {
      // invalid JSON
      console.error('Failed to parse valuationData from sessionStorage:', err);
      return null;
    }
  }

  // Create and show a friendly missing-state card on the page.
  function showMissingStateMessage(message) {
    // If message already exists, do nothing.
    if (document.getElementById('missing-state-card')) return;

    const container = document.createElement('div');
    container.id = 'missing-state-card';
    container.style.position = 'fixed';
    container.style.left = '12px';
    container.style.right = '12px';
    container.style.bottom = '12px';
    container.style.maxWidth = '520px';
    container.style.margin = '0 auto';
    container.style.zIndex = '9999';
    container.style.padding = '14px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    container.style.background = '#fff';
    container.style.color = '#111';
    container.style.fontFamily = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial';
    container.style.border = '1px solid #e3e3e3';
    container.style.textAlign = 'center';

    const title = document.createElement('div');
    title.style.fontWeight = '600';
    title.style.fontSize = '15px';
    title.style.marginBottom = '8px';
    title.textContent = 'We could not find your session data';

    const desc = document.createElement('div');
    desc.style.fontSize = '13px';
    desc.style.marginBottom = '12px';
    desc.textContent = message || 'It looks like you opened this page directly or your session expired.';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '10px';
    btnRow.style.justifyContent = 'center';

    const startOver = document.createElement('button');
    startOver.textContent = 'Start Over';
    startOver.style.padding = '8px 12px';
    startOver.style.borderRadius = '6px';
    startOver.style.border = '1px solid #aaa';
    startOver.style.background = '#fff';
    startOver.style.cursor = 'pointer';
    startOver.onclick = function () {
      try { sessionStorage.removeItem('valuationData'); } catch (e) {}
      window.location.href = 'index.html';
    };

    const goHome = document.createElement('button');
    goHome.textContent = 'Go Home';
    goHome.style.padding = '8px 12px';
    goHome.style.borderRadius = '6px';
    goHome.style.border = '1px solid #1a73e8';
    goHome.style.background = '#1a73e8';
    goHome.style.color = '#fff';
    goHome.style.cursor = 'pointer';
    goHome.onclick = function () { window.location.href = 'index.html'; };

    btnRow.appendChild(startOver);
    btnRow.appendChild(goHome);

    container.appendChild(title);
    container.appendChild(desc);
    container.appendChild(btnRow);

    document.body.appendChild(container);
  }

  // Expose helpers on window so page scripts can call them.
  window.StateHelper = {
    safeGetValuationData: safeGetValuationData,
    showMissingStateMessage: showMissingStateMessage
  };
})(window, document);
