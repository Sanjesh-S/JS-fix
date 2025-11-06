// js/summary.js (UPDATED with DOMContentLoaded fix)

document.addEventListener('DOMContentLoaded', () => {
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

  // --- Fill Summary Details ---
  const imgEl = document.getElementById('sumImage');
  const modelEl = document.getElementById('sumModel');
  const priceEl = document.getElementById('sumPrice');
  const gridEl = document.getElementById('sumGrid');

  if (imgEl && vd.imageUrl) imgEl.src = vd.imageUrl;
  if (modelEl) modelEl.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();
  if (priceEl) priceEl.textContent = money(finalPrice);

  const rows = [];
  addRowIfChanged('Base Quote', vd.originalQuotePrice, null);
  addRowIfChanged('After Assessment', vd.priceAfterAssessment, vd.originalQuotePrice);
  addRowIfChanged('After Physical', vd.priceAfterPhysical, vd.priceAfterAssessment);
  addRowIfChanged('After Issues', vd.priceAfterIssues, vd.priceAfterPhysical);
  addRowIfChanged('After Accessories', vd.priceAfterAccessories, vd.priceAfterIssues);
  addRowIfChanged('After Warranty', vd.priceAfterWarranty, vd.priceAfterAccessories);

  if (gridEl) {
    gridEl.innerHTML = rows.length ? rows.join('') : '<p class="muted">No detailed breakdown available.</p>';
  }

  // --- Modal & Booking Logic ---
  // NOW these elements will be found, because the DOM is loaded
  const pickupModal = document.getElementById('pickupModal');
  const modalForm = document.getElementById('modalStep1_Form');
  const modalConfirm = document.getElementById('modalStep2_Confirm');
  const pickupForm = document.getElementById('pickupForm');
  const bookPickupBtn = document.getElementById('bookPickupBtn');
  const cancelPickupBtn = document.getElementById('cancelPickupBtn');
  const closeConfirmBtn = document.getElementById('closeConfirmBtn');
  
  // Show the modal
  bookPickupBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!pickupModal) {
        console.error("Error: Pickup modal element not found!"); // For debugging
        return;
    }

    // Reset modal to first step
    if (modalForm) modalForm.style.display = 'block';
    if (modalConfirm) modalConfirm.style.display = 'none';
    pickupModal.style.display = 'flex';
  });

  // Hide the modal (Cancel button)
  cancelPickupBtn?.addEventListener('click', () => {
    if (pickupModal) pickupModal.style.display = 'none';
  });
  
  // Close confirmation
  closeConfirmBtn?.addEventListener('click', () => {
    // Clear session and go home
    sessionStorage.removeItem('valuationData');
    sessionStorage.removeItem('isVerified'); // Clear verification flag too
    window.location.href = 'index.html';
  });

  // Handle the form submission
  pickupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 1. Get user details from form
    const pickupDetails = {
      name: document.getElementById('custName').value,
      address: document.getElementById('custAddress').value,
      phone: document.getElementById('custPhone').value,
      altPhone: document.getElementById('custAltPhone').value || null,
    };
    
    // 2. Get device details from session
    const deviceDetails = { ...vd };
    
    // 3. Combine into one record for the database
    const pickupRequest = {
      customer: pickupDetails,
      device: deviceDetails,
      finalPrice: finalPrice,
      status: "New", // You can use this status in your admin view
      createdAt: new Date().toISOString() // Good practice to have a timestamp
    };
    
    // 4. Save to Firebase Firestore
    saveToFirestore(pickupRequest);
  });
  
  async function saveToFirestore(data) {
    const submitBtn = document.getElementById('submitPickupBtn');
    
    // Check if Firestore is available
    if (!window.firebase || !window.firebase.firestore) {
      console.error("Firestore SDK not loaded. Make sure you added the script tag.");
      alert("Error: Database connection failed. Please try again later.");
      return;
    }
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
    }
    
    try {
      const db = window.firebase.firestore();
      
      // Add a new document to the 'pickupRequests' collection
      await db.collection("pickupRequests").add(data);
      
      // Success! Show confirmation
      if (modalForm) modalForm.style.display = 'none';
      if (modalConfirm) modalConfirm.style.display = 'block';

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error booking your pickup. Please try again.");
    } finally {
      // Re-enable button
      if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Confirm Pickup';
      }
    }
  }

  // --- Helper Functions ---
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
});