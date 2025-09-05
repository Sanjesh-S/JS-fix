// js/ui.js (mobile-cta removed)
// Helpers that can be safely included on all pages

(function () {
  // Offer drawer filler (optional elements)
  try {
    const priceEl = document.getElementById('offerDrawerPrice');
    const bdEl    = document.getElementById('offerBreakdown');
    if (!priceEl && !bdEl) return;
    const s = sessionStorage.getItem('valuationData');
    if (!s) return;
    const vd = JSON.parse(s);
    const final =
      vd.priceAfterWarranty ?? vd.priceAfterAccessories ?? vd.priceAfterIssues ??
      vd.priceAfterPhysical ?? vd.priceAfterAssessment ?? vd.originalQuotePrice ?? 0;
    if (priceEl) priceEl.textContent = `₹${Number(final).toLocaleString('en-IN')}`;
    if (!bdEl) return;
    const rows = [];
    if (vd.originalQuotePrice != null) rows.push(`Base: ₹${Number(vd.originalQuotePrice).toLocaleString('en-IN')}`);
    if (vd.priceAfterAssessment != null && vd.priceAfterAssessment !== vd.originalQuotePrice) rows.push(`After Assessment: ₹${Number(vd.priceAfterAssessment).toLocaleString('en-IN')}`);
    if (vd.priceAfterPhysical != null && vd.priceAfterPhysical !== vd.priceAfterAssessment) rows.push(`After Physical: ₹${Number(vd.priceAfterPhysical).toLocaleString('en-IN')}`);
    if (vd.priceAfterIssues != null && vd.priceAfterIssues !== vd.priceAfterPhysical) rows.push(`After Issues: ₹${Number(vd.priceAfterIssues).toLocaleString('en-IN')}`);
    if (vd.priceAfterAccessories != null && vd.priceAfterAccessories !== vd.priceAfterIssues) rows.push(`After Accessories: ₹${Number(vd.priceAfterAccessories).toLocaleString('en-IN')}`);
    if (vd.priceAfterWarranty != null && vd.priceAfterWarranty !== vd.priceAfterAccessories) rows.push(`Final: ₹${Number(vd.priceAfterWarranty).toLocaleString('en-IN')}`);
    bdEl.innerHTML = rows.map(r=>`<div>${r}</div>`).join('');
  } catch (e) {
    // swallow
  }
})();