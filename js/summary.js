// js/summary.js (UPDATED for new UI + Multi-Step Modal + Mobile Footer)

document.addEventListener('DOMContentLoaded', () => {
  
  // --- City List ---
  const TAMIL_NADU_CITIES = [
    "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", 
    "Hosur", "Kanchipuram", "Karaikudi", "Karur", "Kumbakonam", "Madurai", 
    "Nagercoil", "Namakkal", "Pollachi", "Pudukkottai", "Rajapalayam", 
    "Ramanathapuram", "Salem", "Sivakasi", "Thanjavur", "Theni", 
    "Thoothukudi (Tuticorin)", "Tiruchirappalli (Trichy)", "Tirunelveli", 
    "Tiruppur", "Tiruvannamalai", "Udhagamandalam (Ooty)", "Vellore", 
    "Viluppuram", "Virudhunagar"
  ];
  
  // --- Time Slots ---
  const TIME_SLOTS = [
    { id: "slot1", text: "09:00 AM - 12:00 PM" },
    { id: "slot2", text: "12:00 PM - 03:00 PM" },
    { id: "slot3", text: "03:00 PM - 05:00 PM" },
    { id: "slot4", text: "05:00 PM - 07:00 PM" }
  ];

  const vd = JSON.parse(sessionStorage.getItem('valuationData') || '{}');

  // Guard: if no base info, send user to start
  if (!vd || !vd.brandName || !vd.modelName) {
    window.location.href = 'index.html';
    return;
  }

  // Price fallbacks
  const basePrice = vd.originalQuotePrice ?? 0;
  const finalPrice =
    vd.priceAfterWarranty ??
    vd.priceAfterAccessories ??
    vd.priceAfterIssues ??
    vd.priceAfterPhysical ??
    vd.priceAfterAssessment ??
    vd.originalQuotePrice ??
    0;

  // --- Main Card Elements ---
  const imgEl = document.getElementById('sumImage');
  const modelEl = document.getElementById('sumModel');
  const finalSellingPriceEl = document.getElementById('finalSellingPrice');
  
  // --- Price Summary Widget (Desktop) ---
  const desktopPriceSummaryWidget = document.getElementById('desktopPriceSummaryWidget');

  // --- Sidebar Elements ---
  const evaluationModel = document.getElementById('evaluationModel');
  const breakdownListEl = document.getElementById('summaryBreakdownList'); // Detailed list
  
  // --- Mobile Footer Elements ---
  const mobileFinalPriceEl = document.getElementById('mobileFinalPrice');
  const viewBreakupBtn = document.getElementById('viewBreakupBtn');
  
  // --- Mobile Modal Elements ---
  const priceSummaryModal = document.getElementById('priceSummaryModal');
  const modalPriceSummaryWidget = document.getElementById('modalPriceSummaryWidget');
  const closeSummaryModalBtn = document.getElementById('closeSummaryModalBtn');


  // --- Populate Sidebar ---
  if (evaluationModel) evaluationModel.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();

  // --- Populate Main Card ---
  if (imgEl && vd.imageUrl) imgEl.src = vd.imageUrl;
  if (modelEl) modelEl.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();
  if (finalSellingPriceEl) finalSellingPriceEl.textContent = money(finalPrice);
  
  // --- Populate Mobile Footer ---
  if (mobileFinalPriceEl) mobileFinalPriceEl.textContent = money(finalPrice);


  // --- Breakdown Logic ---
  const breakdownRows = [];
  let lastPrice = basePrice;
  
  // 1. Base Price
  breakdownRows.push(createRow('Base Quote', basePrice, 'base'));
  
  // 2. Assessment
  if (vd.priceAfterAssessment != null && vd.priceAfterAssessment !== lastPrice) {
    const delta = vd.priceAfterAssessment - lastPrice;
    breakdownRows.push(createRow('Assessment', delta, delta >= 0 ? 'bonus' : 'deduction'));
    lastPrice = vd.priceAfterAssessment;
  }
  
  // 3. Physical
  if (vd.priceAfterPhysical != null && vd.priceAfterPhysical !== lastPrice) {
    const delta = vd.priceAfterPhysical - lastPrice;
    breakdownRows.push(createRow('Physical Condition', delta, delta >= 0 ? 'bonus' : 'deduction'));
    lastPrice = vd.priceAfterPhysical;
  }

  // 4. Issues
  if (vd.priceAfterIssues != null && vd.priceAfterIssues !== lastPrice) {
    const delta = vd.priceAfterIssues - lastPrice;
    breakdownRows.push(createRow('Functional Issues', delta, delta >= 0 ? 'bonus' : 'deduction'));
    lastPrice = vd.priceAfterIssues;
  }
  
  // 5. Accessories
  if (vd.priceAfterAccessories != null && vd.priceAfterAccessories !== lastPrice) {
    const delta = vd.priceAfterAccessories - lastPrice;
    breakdownRows.push(createRow('Accessories', delta, delta >= 0 ? 'bonus' : 'deduction'));
    lastPrice = vd.priceAfterAccessories;
  }
  
  // 6. Warranty
  if (vd.priceAfterWarranty != null && vd.priceAfterWarranty !== lastPrice) {
    const delta = vd.priceAfterWarranty - lastPrice;
    breakdownRows.push(createRow('Warranty', delta, delta >= 0 ? 'bonus' : 'deduction'));
    lastPrice = vd.priceAfterWarranty;
  }

  // --- Populate Sidebar Detailed Breakdown ---
  if (breakdownListEl) {
    breakdownListEl.innerHTML = breakdownRows.join('');
  }
  
  // --- NEW: Build and Populate Price Summary Widgets (Desktop + Mobile) ---
  const totalAdjustments = finalPrice - basePrice;
  const priceSummaryHTML = `
    <div class="summary-row">
      <span>Base Price</span>
      <strong>${money(basePrice)}</strong>
    </div>
    <div class="summary-row">
      <span>Adjustments</span>
      <strong>${totalAdjustments >= 0 ? '+' : '-'} ${money(Math.abs(totalAdjustments))}</strong>
    </div>
    <div class="summary-row">
      <span>Pickup Charges</span>
      <strong>Free <s class="muted">₹100</s></strong>
    </div>
    <div class="summary-row total">
      <span>Total Amount</span>
      <strong>${money(finalPrice)}</strong>
    </div>
  `;
  
  if (desktopPriceSummaryWidget) {
    // Inject into desktop sidebar
    desktopPriceSummaryWidget.innerHTML += priceSummaryHTML;
  }
  if (modalPriceSummaryWidget) {
    // Inject into mobile modal
    modalPriceSummaryWidget.innerHTML = priceSummaryHTML;
  }


  function createRow(label, amount, typeClass) {
    let amountStr = money(amount);
    if (typeClass === 'bonus' && amount > 0) amountStr = `+ ${amountStr}`;
    if (typeClass === 'deduction' && amount < 0) amountStr = `- ${money(Math.abs(amount))}`;
    return `<li class="${typeClass}"><span>${escapeHtml(label)}</span><strong>${amountStr}</strong></li>`;
  }

  // --- NEW: Mobile Modal Listeners ---
  viewBreakupBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (priceSummaryModal) priceSummaryModal.style.display = 'flex';
  });
  
  closeSummaryModalBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (priceSummaryModal) priceSummaryModal.style.display = 'none';
  });

  priceSummaryModal?.addEventListener('click', (e) => {
    if (e.target === priceSummaryModal) { // Only if clicking the backdrop
      priceSummaryModal.style.display = 'none';
    }
  });


  // --- Modal & Booking Logic ---
  
  // All modal steps
  const pickupModal = document.getElementById('pickupModal');
  const step1 = document.getElementById('pickup-step-1');
  const step2 = document.getElementById('pickup-step-2');
  const step3 = document.getElementById('pickup-step-3');
  const step4 = document.getElementById('pickup-step-4'); // Success
  
  // All form elements
  const pickupForm1 = document.getElementById('pickupForm-Step1');
  const pickupForm2 = document.getElementById('pickupForm-Step2');
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custPincode = document.getElementById('custPincode');
  const custAddress = document.getElementById('custAddress');
  const dateSlotsContainer = document.getElementById('date-slots-container');
  const timeSlotsContainer = document.getElementById('time-slots-container');

  // --- MODIFIED: Get ALL "Sell Now" buttons ---
  const bookPickupBtnDesktop = document.getElementById('bookPickupBtnDesktop');
  const bookPickupBtnMobile = document.getElementById('bookPickupBtnMobile');
  
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const goToStep2Btn = document.getElementById('goToStep2Btn');
  const backToStep1Btn = document.getElementById('backToStep1Btn');
  const goToStep3Btn = document.getElementById('goToStep3Btn');
  const backToStep2Btn = document.getElementById('backToStep2Btn');
  const submitPickupBtn = document.getElementById('submitPickupBtn');
  const closeConfirmBtn = document.getElementById('closeConfirmBtn');

  // --- NEW: City Popup Elements ---
  const cityPopup = document.getElementById('city-popup');
  const custCityTrigger = document.getElementById('custCityTrigger');
  const cityPopupClose = document.getElementById('city-popup-close');
  const citySearchInput = document.getElementById('city-search-input');
  const cityList = document.getElementById('city-list');

  // Temp storage for form data
  let pickupData = {};

  // --- MODIFIED: Open Modal Function ---
  function openBookingModal(e) {
    e.preventDefault();
    if (!pickupModal) return;
    // Reset to step 1
    showStep(step1);
    pickupModal.style.display = 'flex';
  }
  
  // --- MODIFIED: Attach listener to BOTH buttons ---
  bookPickupBtnDesktop?.addEventListener('click', openBookingModal);
  bookPickupBtnMobile?.addEventListener('click', openBookingModal);


  // --- Close Modal ---
  modalCloseBtn?.addEventListener('click', hideModal);
  closeConfirmBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('valuationData');
    sessionStorage.removeItem('isVerified');
    window.location.href = 'index.html';
  });

  function hideModal() {
    if (pickupModal) pickupModal.style.display = 'none';
  }

  // --- Step 1: Location Logic ---
  pickupForm1?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save step 1 data
    pickupData.name = custName.value;
    pickupData.phone = custPhone.value;
    pickupData.city = custCityTrigger.value; // Get value from the trigger input
    pickupData.pincode = custPincode.value;
    pickupData.address = custAddress.value;
    
    // Generate slots and go to step 2
    generateDateSlots();
    timeSlotsContainer.innerHTML = '<p>Please select a date first.</p>';
    goToStep3Btn.disabled = true;
    showStep(step2);
  });

  // --- Step 2: Scheduling Logic ---
  backToStep1Btn?.addEventListener('click', () => showStep(step1));
  
  pickupForm2?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save step 2 data
    const selectedDate = document.querySelector('input[name="pickupDate"]:checked');
    const selectedTime = document.querySelector('input[name="pickupTime"]:checked');
    
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }

    pickupData.date = selectedDate.dataset.fullDate;
    pickupData.dateLabel = selectedDate.value;
    pickupData.timeLabel = selectedTime.value;
    
    // Populate confirmation and go to step 3
    populateConfirmation();
    showStep(step3);
  });

  function generateDateSlots() {
    dateSlotsContainer.innerHTML = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const id = `date${i}`;
      const dayName = (i === 0) ? 'Today' : (i === 1) ? 'Tomorrow' : days[date.getDay()];
      const label = `${months[date.getMonth()]} ${date.getDate()}`;
      
      const slotHTML = `
        <div class="slot-option">
          <input type="radio" id="${id}" name="pickupDate" value="${dayName}, ${label}" data-full-date="${date.toISOString().split('T')[0]}">
          <label for="${id}">${dayName}<span class="slot-day">${label}</span></label>
        </div>`;
      dateSlotsContainer.innerHTML += slotHTML;
    }
    
    dateSlotsContainer.querySelectorAll('input[name="pickupDate"]').forEach(radio => {
      radio.addEventListener('change', generateTimeSlots);
    });
  }

  function generateTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    goToStep3Btn.disabled = true;
    
    TIME_SLOTS.forEach(slot => {
      const slotHTML = `
        <div class="slot-option">
          <input type="radio" id="${slot.id}" name="pickupTime" value="${slot.text}">
          <label for="${slot.id}">${slot.text}</label>
        </div>`;
      timeSlotsContainer.innerHTML += slotHTML;
    });
    
    timeSlotsContainer.querySelectorAll('input[name="pickupTime"]').forEach(radio => {
      radio.addEventListener('change', () => {
        goToStep3Btn.disabled = false;
      });
    });
  }

  // --- Step 3: Confirmation Logic ---
  backToStep2Btn?.addEventListener('click', () => showStep(step2));
  
  function populateConfirmation() {
    document.querySelector('#review-device span').textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();
    document.querySelector('#review-price span').textContent = money(finalPrice);
    document.querySelector('#review-name span').textContent = pickupData.name;
    document.querySelector('#review-contact span').textContent = pickupData.phone;
    document.querySelector('#review-address span').textContent = `${pickupData.address}, ${pickupData.city}, ${pickupData.pincode}`;
    document.querySelector('#review-slot span').textContent = `${pickupData.dateLabel} at ${pickupData.timeLabel}`;
  }

  submitPickupBtn?.addEventListener('click', () => {
    // 1. Get user details from our temp object
    const pickupDetails = {
      name: pickupData.name,
      address: pickupData.address,
      city: pickupData.city,
      pincode: pickupData.pincode,
      phone: pickupData.phone,
    };
    
    // 2. Get scheduling details
    const scheduleDetails = {
      date: pickupData.date,
      slot: pickupData.timeLabel,
      dateLabel: pickupData.dateLabel
    };
    
    // 3. Combine into one record
    const pickupRequest = {
      customer: pickupDetails,
      schedule: scheduleDetails,
      device: { ...vd },
      finalPrice: finalPrice,
      status: "New",
      createdAt: new Date().toISOString()
    };
    
    // 4. Save to Firebase Firestore
    saveToFirestore(pickupRequest);
  });
  
  async function saveToFirestore(data) {
    submitPickupBtn.disabled = true;
    submitPickupBtn.textContent = 'Saving...';
    
    try {
      if (!window.firebase || !window.firebase.firestore) {
        throw new Error("Firestore SDK not loaded.");
      }
      
      const db = window.firebase.firestore();
      await db.collection("pickupRequests").add(data);
      
      // Success! Show confirmation
      showStep(step4);

    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an error booking your pickup. Please try again.");
    } finally {
      submitPickupBtn.disabled = false;
      submitPickupBtn.textContent = 'Confirm Pickup';
    }
  }

  // --- NEW: City Popup Logic ---
  
  // Show popup when trigger input is clicked
  custCityTrigger?.addEventListener('click', () => {
    renderCityList();
    cityPopup.style.display = 'flex';
    citySearchInput.focus();
  });

  // Close popup
  cityPopupClose?.addEventListener('click', () => {
    cityPopup.style.display = 'none';
  });

  // Filter list on search
  citySearchInput?.addEventListener('input', (e) => {
    renderCityList(e.target.value);
  });
  
  // Function to render the city list (with optional filter)
  function renderCityList(filter = '') {
    cityList.innerHTML = '';
    const lowerFilter = filter.toLowerCase();
    
    const filteredCities = TAMIL_NADU_CITIES.filter(city => 
      city.toLowerCase().includes(lowerFilter)
    );
    
    if (filteredCities.length === 0) {
      cityList.innerHTML = '<li class="no-results">No cities found.</li>';
      return;
    }
    
    filteredCities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', () => {
        custCityTrigger.value = city; // Set the input value
        pickupData.city = city; // Store in our object
        cityPopup.style.display = 'none'; // Close popup
        citySearchInput.value = ''; // Clear search
      });
      cityList.appendChild(li);
    });
  }

  // --- Helper Functions ---
  
  function showStep(stepToShow) {
    [step1, step2, step3, step4].forEach(step => {
      if (step) step.style.display = 'none';
    });
    if (stepToShow) stepToShow.style.display = 'block';
  }

  function money(n) { return `₹${Number(n || 0).toLocaleString('en-IN')}`; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});