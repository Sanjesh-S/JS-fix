// js/warranty.js (v4 - Global Login)

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
  const finishBtn = document.getElementById("finishBtn"); // Corrected ID from 'finishButton' to 'finishBtn'
  const ageRadios = document.querySelectorAll('input[name="device_age"]');
  const finalPriceLabel = finalBox ? finalBox.querySelector('h3') : null;

  // Show the box, hide the price
  if (finalBox) finalBox.classList.remove("hidden");
  if (finalPriceLabel) finalPriceLabel.classList.add("hidden");
  if (finalEl) finalEl.classList.add("hidden");
  
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

  ageRadios.forEach(r => r.addEventListener("change", calcFinal));

  let armed = false;

  function isSessionVerified() {
    try {
      return sessionStorage.getItem('isVerified') === '1';
    } catch (e) {
      return false;
    }
  }

  function revealFinalAndArm() {
    calcFinal(); 
    
    if (finalPriceLabel) finalPriceLabel.classList.remove("hidden");
    if (finalEl) finalEl.classList.remove("hidden");

    if (finishBtn) finishBtn.textContent = "Confirm Order";
    armed = true;
  }
  
  // --- NEW: Define a callback function ---
  // This lets js/login.js tell this page "verification is done"
  window.onLoginVerified = () => {
    console.log("Login verified callback executed.");
    revealFinalAndArm();
  };

  // Click handler
  if (finishBtn) {
    finishBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (armed) {
        window.location.href = "summary.html";
        return;
      }

      const selectedAge = document.querySelector('input[name="device_age"]:checked')?.value;
      if (!selectedAge) {
        alert('Please select the device age before finishing.');
        return;
      }

      if (isSessionVerified()) {
        revealFinalAndArm();
        return;
      }

      // --- MODIFIED: Call the global login modal ---
      if (window.LoginModal && typeof window.LoginModal.show === 'function') {
        alert('Please log in or verify your number to see the final price.');
        // The modal is shown, and onLoginVerified() will be called on success
        window.LoginModal.show(); 
      } else {
        // Fallback if login.js didn't load
        console.error("Global login modal (window.LoginModal.show) not found.");
        alert("Error: Login module not loaded. Please refresh the page.");
      }
    });
  } else {
    console.warn('warranty.js: finish button (#finishBtn) not found.');
  }

  // init
  calcFinal();
});