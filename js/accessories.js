// js/accessories.js (FIXED VERSION)
document.addEventListener("DOMContentLoaded", () => {
  const s = sessionStorage.getItem('valuationData');
  if (!s) { window.location.href = 'index.html'; return; }

  let vd; 
  try { vd = JSON.parse(s); } 
  catch { window.location.href = 'index.html'; return; }
  
  if (typeof vd.priceAfterIssues !== 'number' || isNaN(vd.priceAfterIssues)) {
    window.location.href = 'functional-issues.html'; return;
  }
  
  const basePrice = Number(vd.priceAfterIssues || 0);
  
  // --- NEW: Sidebar Elements ---
  const evaluationImage = document.getElementById('evaluationImage');
  const evaluationModel = document.getElementById('evaluationModel');
  const evaluationList = document.getElementById('evaluation-summary-list');

  // --- NEW: Populate Sidebar Info ---
  if (evaluationImage && vd.imageUrl) evaluationImage.src = vd.imageUrl;
  if (evaluationModel) evaluationModel.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();


  document.getElementById('backToIssues')?.addEventListener('click', (e)=>{ 
    e.preventDefault(); 
    history.back(); 
  });

  const accessoriesGrid = document.getElementById('accessoriesGrid');
  
  // ===================================================
  // UPDATED LINE: We are now finding the new button ID
  // ===================================================
  const nextButton      = document.getElementById('proceedToWarrantyBtn');
  // ===================================================
  
  const noAccessoriesBtn = document.getElementById('noAccessoriesBtn');

  if (!accessoriesGrid || !nextButton) return;

  const accessories = [
    { id:'adapter', label:'Original Adapter with cable', img:'images/acc-adapter.png', bonus:250 },
    { id:'bill',    label:'Bill',                         img:'images/acc-bill.png',    bonus:200 },
    { id:'box',     label:'Box',                          img:'images/acc-box.png',     bonus:300 },
    { id:'battery', label:'Additional Battery',           img:'images/acc-battery.png', bonus:400 }
  ];

  let selected = new Set(vd.accessories || []);
  let noAccessoriesSelected = false; // NEW

  function render() {
    accessoriesGrid.innerHTML = accessories.map(acc => {
      const isSel = selected.has(acc.id) ? 'selected' : '';
      return `
        <div class="issue-card ${isSel}" data-id="${acc.id}" data-bonus="${acc.bonus}" data-label="${acc.label}">
          <img src="${acc.img}" alt="${acc.label}" class="issue-image" loading="lazy" width="120" height="120" 
               onerror="this.src='https://via.placeholder.com/120?text=${encodeURIComponent(acc.label)}'">
          <p class="issue-label">${acc.label}</p>
        </div>`;
    }).join('');
    
    // NEW: Check if "No Accessories" should be pre-selected
    if (vd.accessories && vd.accessories.length === 0) {
        noAccessoriesBtn?.classList.add('selected');
        noAccessoriesSelected = true;
    }
    
    updateEvaluationSidebar(); // NEW
  }
  
  // --- NEW: Sidebar Update Function ---
  function updateEvaluationSidebar() {
    if (!evaluationList) return;
    evaluationList.innerHTML = ''; // Clear the list
    
    // You can add logic here to show previous steps if needed
    
    evaluationList.innerHTML += `
      <div class="evaluation-item">
        <span class="evaluation-question">Accessories</span>
      </div>`;

    if (noAccessoriesSelected) {
      evaluationList.innerHTML += `
        <div class="evaluation-item">
          <span class="evaluation-answer">• No Accessories</span>
        </div>`;
    } else if (selected.size > 0) {
      selected.forEach(id => {
        const acc = accessories.find(a => a.id === id);
        if (acc) {
          evaluationList.innerHTML += `
            <div class="evaluation-item">
              <span class="evaluation-answer">• ${acc.label}</span>
            </div>`;
        }
      });
    } else {
      // Nothing selected yet
      evaluationList.innerHTML += `
        <div class="evaluation-item">
          <span class="evaluation-answer" style="color: var(--muted); font-weight: 500;">• (Select accessories or "No accessories")</span>
        </div>`;
    }
  }


  function recalc() {
    let bonus = 0;
    selected.forEach(id => { 
      const a = accessories.find(x => x.id===id); 
      if (a) bonus += a.bonus; 
    });
    const final = Math.round(basePrice + bonus);
    vd.priceAfterAccessories = final;
    vd.accessories = Array.from(selected);
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    try { window.updateOfferDrawer?.(vd); } catch {}
  }

  function updateProceedState() {
    // This function no longer controls button state
    // We just ensure the container is visible
    const finalQuoteContainer = document.getElementById('finalQuoteContainer');
    finalQuoteContainer?.classList.remove('hidden'); // Show the container
  }

  accessoriesGrid.addEventListener('click', (e)=>{
    const card = e.target.closest('.issue-card'); 
    if(!card) return;
    const id = card.dataset.id;
    
    card.classList.toggle('selected');
    noAccessoriesBtn?.classList.remove('selected');
    noAccessoriesSelected = false; // NEW
    
    selected.has(id) ? selected.delete(id) : selected.add(id);
    recalc();
    updateProceedState();
    updateEvaluationSidebar(); // NEW
  });

  noAccessoriesBtn?.addEventListener('click', () => {
    accessoriesGrid.querySelectorAll('.issue-card.selected')
      .forEach(c => c.classList.remove('selected'));
    selected.clear();
    noAccessoriesBtn.classList.add('selected');
    noAccessoriesSelected = true; // NEW
    
    vd.priceAfterAccessories = basePrice;
    vd.accessories = [];
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    recalc();
    updateProceedState();
    updateEvaluationSidebar(); // NEW
  });

  nextButton.addEventListener('click', (e)=>{
    e.preventDefault();
    
    // NEW: Validation
    if (selected.size === 0 && !noAccessoriesSelected) {
      alert('Please select any accessories or "No accessories".');
      return;
    }
    
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    window.location.href = 'warranty.html';
  });

  // Initialize
  render();
  recalc();
  updateProceedState();
});