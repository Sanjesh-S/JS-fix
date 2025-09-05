// js/functional-issues.js (v6)
document.addEventListener("DOMContentLoaded", () => {
  // Data
  const s = sessionStorage.getItem('valuationData');
  if (!s) { window.location.href = 'index.html'; return; }
  const vd = JSON.parse(s);
  const basePrice = Number(vd.priceAfterPhysical || 0);

  // Back
  document.getElementById('backToPhysical')?.addEventListener('click',(e)=>{ e.preventDefault(); history.back(); });

  // UI
  const issuesGrid   = document.getElementById('issuesGrid');
  const noIssuesBtn  = document.getElementById('noIssuesBtn');
  const proceedBtn   = document.getElementById('proceedToAccessoriesBtn');

  const issues = [
    { id: 'battery',     label: 'Battery weak or Not working or Duplicate', img: 'images/issue-battery.png',     deduction: 0.15 },
    { id: 'flashlight',  label: 'Flashlight not Working',                    img: 'images/issue-flashlight.png',   deduction: 0.05 },
    { id: 'memory_slot', label: 'Memory Card Slot issue',                    img: 'images/issue-memory-card.png',  deduction: 0.20 },
    { id: 'speaker',     label: 'Speaker not working',                       img: 'images/issue-speaker.png',      deduction: 0.10 },
    { id: 'connectors',  label: 'Connectors not working',                    img: 'images/issue-connectors.png',   deduction: 0.15 },
    { id: 'buttons',     label: 'Buttons not working',                       img: 'images/issue-buttons.png',      deduction: 0.10 }
  ];
  const selected = new Set();

  function renderIssues() {
    issuesGrid.innerHTML = issues.map(i => `
      <div class="issue-card" data-id="${i.id}" data-deduction="${i.deduction}">
        <img src="${i.img}" alt="${i.label}" class="issue-image" loading="lazy" width="120" height="120">
        <p class="issue-label">${i.label}</p>
      </div>
    `).join('');
    updateProceedState();
  }

  function recalc() {
    let total = 0;
    selected.forEach(id => {
      const it = issues.find(x => x.id === id);
      if (it) total += Number(it.deduction);
    });
    const current = basePrice * (1 - total);
    const final   = Math.round(Math.max(current, basePrice * 0.05));
    vd.priceAfterIssues = final;
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    try { window.updateOfferDrawer?.(vd); } catch {}
  }

  function updateProceedState(){
    if (!proceedBtn) return;
    const anyIssue = selected.size > 0;
    const noIssues = noIssuesBtn?.classList.contains('selected');
    (anyIssue || noIssues) ? proceedBtn.removeAttribute('disabled') : proceedBtn.setAttribute('disabled','disabled');
  }

  // Clicks
  issuesGrid.addEventListener('click',(e)=>{
    const card = e.target.closest('.issue-card'); if(!card) return;
    const id = card.dataset.id;
    card.classList.toggle('selected');
    noIssuesBtn?.classList.remove('selected');
    selected.has(id) ? selected.delete(id) : selected.add(id);
    recalc(); updateProceedState();
  });

  noIssuesBtn?.addEventListener('click', ()=>{
    issuesGrid.querySelectorAll('.issue-card.selected').forEach(c=>c.classList.remove('selected'));
    selected.clear();
    noIssuesBtn.classList.add('selected');
    recalc(); updateProceedState();
  });

  proceedBtn?.addEventListener('click',(e)=>{
    e.preventDefault();
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    window.location.href = 'accessories.html';
  });

  renderIssues();
  recalc();
  updateProceedState();
});
