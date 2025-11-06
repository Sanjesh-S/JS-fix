// js/warranty.js (v3 - CORRECTED)
// This version fixes the button visibility issue.

document.addEventListener("DOMContentLoaded", () => {
  // Safe read of valuationData
  let vd = null;
  try {
    if (window.StateHelper && typeof window.StateHelper.safeGetValVluationData === 'function') {
      vd = window.StateHelper.safeGetValuationData();
    } else {
      const dataStr = sessionStorage.getItem("valuationData");
      if (dataStr) vd = JSON.parse(dataStr);
    }
  } catch (err) {
    console.error('Error reading valuationData:', err);
    vd = null;
  }

  if (!vd) {
    // If helper exists, show friendly message; otherwise fallback to index.html
    if (window.StateHelper && typeof window.StateHelper.showMissingStateMessage === 'function') {
      window.StateHelper.showMissingStateMessage('This page needs data from the start flow. Click Start Over to begin again.');
    } else {
      window.location.href = "index.html";
    }
    return;
  }

  // DOM elements
  const img = document.getElementById("deviceImage");
  const nameEl = document.getElementById("deviceName");
  const finalEl = document.getElementById("finalPrice");
  const finalBox = document.getElementById("finalQuoteDisplay");
  const finishBtn = document.getElementById("finishButton");
  const ageRadios = document.querySelectorAll('input[name="device_age"]');
  const finalPriceLabel = finalBox ? finalBox.querySelector('h3') : null;

  // ===================================================
  // THE FIX:
  // 1. Show the main box (so the button is visible)
  // 2. Hide the price elements (until verification)
  // ===================================================
  if (finalBox) finalBox.classList.remove("hidden"); // <-- THIS IS THE NEW LINE
  if (finalPriceLabel) finalPriceLabel.classList.add("hidden");
  if (finalEl) finalEl.classList.add("hidden");
  // ===================================================

  // Fill basic UI
  if (img && vd.imageUrl) img.src = vd.imageUrl;
  if (nameEl) nameEl.textContent = `${vd.brandName || ""} ${vd.modelName || ""}`.trim();

  const basePrice = Number(vd.priceAfterAccessories || 0);

  function calcFinal() {
    let price = basePrice;
    const age = document.querySelector('input[name="device_age"]:checked')?.value;
    if (age === "under_11" && Array.isArray(vd.accessories) && vd.accessories.includes("bill")) {
      price *= 1.05;
    }
    price = Math.round(price);
    if (finalEl) finalEl.textContent = `₹${price.toLocaleString("en-IN")}`;
    vd.priceAfterWarranty = price;
    try { sessionStorage.setItem("valuationData", JSON.stringify(vd)); } catch (e) {}
    try { window.updateOfferDrawer?.(vd); } catch {}
  }

  // Recalculate when age option changes
  ageRadios.forEach(r => r.addEventListener("change", calcFinal));

  // Two-step confirm
  let armed = false;

  // Helper: check session verification flag
  function isSessionVerified() {
    try {
      return sessionStorage.getItem('isVerified') === '1';
    } catch (e) {
      return false;
    }
  }

  // Helper: show final price elements
  function revealFinalAndArm() {
    calcFinal(); // ensure price is up-to-date
    
    // Show the price elements
    if (finalPriceLabel) finalPriceLabel.classList.remove("hidden");
    if (finalEl) finalEl.classList.remove("hidden");

    if (finishBtn) finishBtn.textContent = "Confirm Order";
    armed = true;
    try { window.showToast?.('Review final price, then confirm.'); } catch {}
  }

  // Click handler
  if (finishBtn) {
    finishBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // If already armed (user clicked once and price is visible), proceed to summary
      if (armed) {
        window.location.href = "summary.html";
        return;
      }

      // If no age selected, ask user to select
      const selectedAge = document.querySelector('input[name="device_age"]:checked')?.value;
      if (!selectedAge) {
        alert('Please select the device age before finishing.');
        return;
      }

      // If user already verified in session, reveal final and arm right away
      if (isSessionVerified()) {
        revealFinalAndArm();
        return;
      }

      // Not verified: open login modal if available
      if (window.LoginModal && typeof window.LoginModal.show === 'function') {
        // Show modal and when verified, reveal price and proceed
        window.LoginModal.show(function onVerified() {
          try { sessionStorage.setItem('isVerified', '1'); } catch (e) {}
          revealFinalAndArm();
        });
      } else {
        // No login modal available: ask user to login (fallback)
        const ok = confirm('You must login/verify to view the final price. Press OK to go to the home page and start the flow.');
        if (ok) window.location.href = 'index.html';
      }
    });
  } else {
    console.warn('warranty.js: finish button (#finishButton) not found.');
  }

  // init - run initial calc (but price stays hidden)
  calcFinal();
});