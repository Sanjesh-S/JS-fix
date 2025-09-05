// js/warranty.js (v6)
document.addEventListener("DOMContentLoaded", () => {
  const dataStr = sessionStorage.getItem("valuationData");
  if (!dataStr) { window.location.href = "index.html"; return; }

  const vd = JSON.parse(dataStr);
  const basePrice = Number(vd.priceAfterAccessories || 0);

  // UI
  const img = document.getElementById("deviceImage");
  const nameEl = document.getElementById("deviceName");
  const finalEl = document.getElementById("finalPrice");
  const finalBox = document.getElementById("finalQuoteDisplay");
  const finishBtn = document.getElementById("finishButton");
  const ageRadios = document.querySelectorAll('input[name="device_age"]');

  // Fill
  if (vd.imageUrl) img.src = vd.imageUrl;
  nameEl.textContent = `${vd.brandName || ""} ${vd.modelName || ""}`.trim();

  function calcFinal() {
    let price = basePrice;
    const age = document.querySelector('input[name="device_age"]:checked')?.value;
    if (age === "under_11" && Array.isArray(vd.accessories) && vd.accessories.includes("bill")) {
      price *= 1.05;
    }
    price = Math.round(price);
    finalEl.textContent = `₹${price.toLocaleString("en-IN")}`;
    vd.priceAfterWarranty = price;
    sessionStorage.setItem("valuationData", JSON.stringify(vd));
    try { window.updateOfferDrawer?.(vd); } catch {}
  }

  ageRadios.forEach(r => r.addEventListener("change", calcFinal));

  // Two-step confirm
  let armed = false;
  finishBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!armed) {
      finalBox.classList.remove("hidden");
      finishBtn.textContent = "Confirm Order";
      armed = true;
      calcFinal();
      try { window.showToast?.('Review final price, then confirm.'); } catch {}
      return;
    }
    window.location.href = "summary.html";
  });

  // Back
  document.getElementById("backToAccessories")?.addEventListener("click",(e)=>{ e.preventDefault(); history.back(); });

  // init
  calcFinal();
});
