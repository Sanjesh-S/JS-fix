// js/summary.js
(function () {
  const vd = JSON.parse(sessionStorage.getItem('valuationData') || '{}');

  // Guard: if no base info, send user to start
  if (!vd || !vd.brandName || !vd.modelName) {
    window.location.href = 'index.html';
    return;
  }

  // Price fallbacks (newest ➜ oldest ➜ 0)
  const finalPrice =
    vd.priceAfterWarranty ??
    vd.priceAfterAccessories ??
    vd.priceAfterIssues ??
    vd.priceAfterPhysical ??
    vd.priceAfterAssessment ??
    vd.originalQuotePrice ??
    0;

  // Fill header
  const imgEl = document.getElementById('sumImage');
  const modelEl = document.getElementById('sumModel');
  const priceEl = document.getElementById('sumPrice');
  const gridEl = document.getElementById('sumGrid');

  if (vd.imageUrl) imgEl.src = vd.imageUrl;
  modelEl.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();
  priceEl.textContent = money(finalPrice);

  // Optional step rows if values changed across steps
  const rows = [];
  addRowIfChanged('Base Quote', vd.originalQuotePrice, null);
  addRowIfChanged('After Assessment', vd.priceAfterAssessment, vd.originalQuotePrice);
  addRowIfChanged('After Physical', vd.priceAfterPhysical, vd.priceAfterAssessment);
  addRowIfChanged('After Issues', vd.priceAfterIssues, vd.priceAfterPhysical);
  addRowIfChanged('After Accessories', vd.priceAfterAccessories, vd.priceAfterIssues);
  addRowIfChanged('After Warranty', vd.priceAfterWarranty, vd.priceAfterAccessories);

  gridEl.innerHTML = rows.length ? rows.join('') : '<p class="muted">No detailed breakdown available.</p>';

  // Mobile CTA mirrors the main button
  document.getElementById('bookPickupBtn')?.addEventListener('click', onBook);
  document.getElementById('mobileBook')?.addEventListener('click', onBook);

  function onBook(e) {
    e.preventDefault();
    // Hook your booking flow here
    window.showToast?.('Pickup request started!');
  }

  function addRowIfChanged(label, value, prev) {
    if (value == null) return;
    if (prev == null || Number(value) !== Number(prev)) {
      rows.push(`<div class="sum-row"><span>${escapeHtml(label)}</span><strong>${money(value)}</strong></div>`);
    }
  }

  function money(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}`; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
})();
