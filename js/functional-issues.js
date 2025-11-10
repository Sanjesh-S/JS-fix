// js/functional-issues.js (v6)
document.addEventListener("DOMContentLoaded", () => {
  // Data
  const s = sessionStorage.getItem('valuationData');
  if (!s) { window.location.href = 'index.html'; return; }
  const vd = JSON.parse(s);
  const basePrice = Number(vd.priceAfterPhysical || 0);
  
  // --- NEW: Sidebar Elements ---
  const evaluationImage = document.getElementById('evaluationImage');
  const evaluationModel = document.getElementById('evaluationModel');
  const evaluationList = document.getElementById('evaluation-summary-list');

  // --- NEW: Populate Sidebar Info ---
  if (evaluationImage && vd.imageUrl) evaluationImage.src = vd.imageUrl;
  if (evaluationModel) evaluationModel.textContent = `${vd.brandName || ''} ${vd.modelName || ''}`.trim();


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
  let noIssuesSelected = false; // NEW: Track "No Issues" state

  function renderIssues() {
    issuesGrid.innerHTML = issues.map(i => `
      <div class="issue-card" data-id="${i.id}" data-deduction="${i.deduction}" data-label="${i.label}">
        <img src="${i.img}" alt="${i.label}" class="issue-image" loading="lazy" width="120" height="120">
        <p class="issue-label">${i.label}</p>
      </div>
    `).join('');
    updateProceedState();
    updateEvaluationSidebar(); // NEW: Initial sidebar render
  }

  // --- NEW: Sidebar Update Function ---
  function updateEvaluationSidebar() {
    if (!evaluationList) return;
    evaluationList.innerHTML = ''; // Clear the list
    
    // You can add logic here to show previous steps if needed
    // For now, it just shows this step's selections

    evaluationList.innerHTML += `
      <div class="evaluation-item">
        <span class="evaluation-question">Functional Issues</span>
      </div>`;

    if (noIssuesSelected) {
      evaluationList.innerHTML += `
        <div class="evaluation-item">
          <span class="evaluation-answer">• No Functional Issues</span>
        </div>`;
    } else if (selected.size > 0) {
      selected.forEach(id => {
        const issue = issues.find(i => i.id === id);
        if (issue) {
          evaluationList.innerHTML += `
            <div class="evaluation-item">
              <span class="evaluation-answer">• ${issue.label}</span>
            </div>`;
        }
      });
    } else {
      // Nothing selected yet
      evaluationList.innerHTML += `
        <div class="evaluation-item">
          <span class="evaluation-answer" style="color: var(--muted); font-weight: 500;">• (Select issues or "No Issues")</span>
        </div>`;
    }
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
    // This function no longer controls button state
  }

  // Clicks
  issuesGrid.addEventListener('click',(e)=>{
    const card = e.target.closest('.issue-card'); if(!card) return;
    const id = card.dataset.id;
    card.classList.toggle('selected');
    
    noIssuesBtn?.classList.remove('selected');
    noIssuesSelected = false; // NEW
    
    selected.has(id) ? selected.delete(id) : selected.add(id);
    recalc(); updateProceedState();
    updateEvaluationSidebar(); // NEW
  });

  noIssuesBtn?.addEventListener('click', ()=>{
    issuesGrid.querySelectorAll('.issue-card.selected').forEach(c=>c.classList.remove('selected'));
    selected.clear();
    noIssuesBtn.classList.add('selected');
    noIssuesSelected = true; // NEW
    recalc(); updateProceedState();
    updateEvaluationSidebar(); // NEW
  });

  proceedBtn?.addEventListener('click',(e)=>{
    e.preventDefault();
    
    // NEW: Validation
    if (selected.size === 0 && !noIssuesSelected) {
      alert('Please select any functional issues or "No Functional Issues".');
      return;
    }
    
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    window.location.href = 'accessories.html';
  });

  renderIssues();
  recalc();
  updateProceedState();
});