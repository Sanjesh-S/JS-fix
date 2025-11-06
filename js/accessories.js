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

  function render() {
    accessoriesGrid.innerHTML = accessories.map(acc => {
      const isSel = selected.has(acc.id) ? 'selected' : '';
      return `
        <div class="issue-card ${isSel}" data-id="${acc.id}" data-bonus="${acc.bonus}">
          <img src="${acc.img}" alt="${acc.label}" class="issue-image" loading="lazy" width="120" height="120" 
               onerror="this.src='https://via.placeholder.com/120?text=${encodeURIComponent(acc.label)}'">
          <p class="issue-label">${acc.label}</p>
        </div>`;
    }).join('');
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
    if (!nextButton) return;
    const anyAccessory = selected.size > 0;
    const noAccessories = noAccessoriesBtn?.classList.contains('selected');
    
    // We also need to show the final quote container
    const finalQuoteContainer = document.getElementById('finalQuoteContainer');
    
    if (anyAccessory || noAccessories) {
      nextButton.removeAttribute('disabled');
      finalQuoteContainer?.classList.remove('hidden'); // Show the container
    } else {
      nextButton.setAttribute('disabled','disabled');
      finalQuoteContainer?.classList.add('hidden'); // Hide the container
    }
  }

  accessoriesGrid.addEventListener('click', (e)=>{
    const card = e.target.closest('.issue-card'); 
    if(!card) return;
    const id = card.dataset.id;
    
    card.classList.toggle('selected');
    noAccessoriesBtn?.classList.remove('selected');
    
    selected.has(id) ? selected.delete(id) : selected.add(id);
    recalc();
    updateProceedState();
  });

  noAccessoriesBtn?.addEventListener('click', () => {
    accessoriesGrid.querySelectorAll('.issue-card.selected')
      .forEach(c => c.classList.remove('selected'));
    selected.clear();
    noAccessoriesBtn.classList.add('selected');
    
    vd.priceAfterAccessories = basePrice;
    vd.accessories = [];
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    recalc();
    updateProceedState();
  });

  nextButton.addEventListener('click', (e)=>{
    e.preventDefault();
    if (nextButton.hasAttribute('disabled')) return;
    
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    window.location.href = 'warranty.html';
  });

  // Initialize
  render();
  recalc();
  updateProceedState();
});