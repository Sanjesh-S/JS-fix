// js/warranty.js (updated)
// Requires: js/state-helper.js (optional) and js/login.js (optional for the login modal).
// Replace the original file with this full contents.

document.addEventListener("DOMContentLoaded", () => {
  // Safe read of valuationData
  let vd = null;
  try {
    if (window.StateHelper && typeof window.StateHelper.safeGetValuationData === 'function') {
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

  // DOM elements (keep ids/classes same as your markup)
  const img = document.getElementById("deviceImage");
  const nameEl = document.getElementById("deviceName");
  const finalEl = document.getElementById("finalPrice");
  const finalBox = document.getElementById("finalQuoteDisplay");
  const finishBtn = document.getElementById("finishButton");
  const ageRadios = document.querySelectorAll('input[name="device_age"]');

  // If finalBox exists, hide it initially so price won't show until verification
  if (finalBox) finalBox.classList.add("hidden");

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

  // Recalculate when age option changes (still calculate internally but keep finalBox hidden until verified)
  ageRadios.forEach(r => r.addEventListener("change", calcFinal));

  // Two-step confirm - but require verification BEFORE showing price
  let armed = false;

  // Helper: check session verification flag
  function isSessionVerified() {
    try {
      return sessionStorage.getItem('isVerified') === '1';
    } catch (e) {
      return false;
    }
  }

  // Helper: show final box (unhide and set armed state)
  function revealFinalAndArm() {
    calcFinal(); // ensure price is up-to-date
    if (finalBox) finalBox.classList.remove("hidden");
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

  // Back button (if present)
  const backBtn = document.getElementById("backToAccessories");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      history.back();
    });
  }

  // init - run initial calc (but finalBox stays hidden until verified)
  calcFinal();
});
