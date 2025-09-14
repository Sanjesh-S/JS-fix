// js/physical-condition.js (v6 - FIXED)
document.addEventListener("DOMContentLoaded", () => {
  // Load data
  const s = sessionStorage.getItem('valuationData');
  if (!s) { window.location.href = 'index.html'; return; }
  const vd = JSON.parse(s);
  const basePrice = Number(vd.priceAfterAssessment || 0);

  // Back
  document.getElementById('backToAssessment')?.addEventListener('click', (e) => {
    e.preventDefault(); 
    history.back();
  });

  // Where to show the proceed CTA
  const finalQuoteContainer = document.getElementById('finalQuoteContainer');
  const proceedBtn = document.getElementById('proceedToIssuesBtn');

  // Options (kept your images/labels)
  const conditions = {
    display: [
      { id: 'display_good',   label: 'Good Condition',                 img: 'images/display-good.png',        deduction: 0 },
      { id: 'display_fade',   label: 'Display Fade Condition',         img: 'images/display-fade.png',        deduction: 0.15 },
      { id: 'display_lines',  label: 'Display Lines Condition',        img: 'images/display-lines.png',       deduction: 0.25 },
      { id: 'display_broken', label: 'Display Not Working',            img: 'images/display-not-working.png', deduction: 0.40 }
    ],
    body: [
      { id: 'body_good',   label: 'No Defects',                        img: 'images/body-no-defects.png',     deduction: 0 },
      { id: 'body_minor',  label: 'Minor Scratches/ less than 2',      img: 'images/body-minor-scratches.png', deduction: 0.10 },
      { id: 'body_heavy',  label: 'Heavy Scratches/ paint Peel off',   img: 'images/body-heavy-scratches.png', deduction: 0.20 },
      { id: 'body_broken', label: 'Broken/ Crack',                     img: 'images/body-broken.png',         deduction: 0.50 }
    ],
    error: [
      { id: 'error_no',       label: 'No Error Condition',             img: 'images/error-no.png',            deduction: 0 },
      { id: 'error_with_lens',label: 'With Lens Error Condition',      img: 'images/error-with-lens.png',     deduction: 0.30 },
      { id: 'error_no_lens',  label: 'Without Lens Error Condition',   img: 'images/error-without-lens.png',  deduction: 0.35 }
    ],
    // supports old "lense" images but normalizes key as "lens"
    lens: [
      { id: 'lense_good',        label: 'Good Condition',                 img: 'images/lense-good.png',          deduction: 0 },
      { id: 'lense_focus_issue', label: 'Auto Focus/ Manual Focus Issue', img: 'images/lense-focus-issue.png',   deduction: 0.25 },
      { id: 'lense_fungus',      label: 'Fungus issue',                   img: 'images/lense-fungus.png',        deduction: 0.30 },
      { id: 'lense_scratches',   label: 'Scratches',                      img: 'images/lense-scratches.png',     deduction: 0.20 }
    ]
  };
  
  const selections = { display: null, body: null, error: null, lens: null };

  function card(c, cat) {
    return `
      <div class="condition-card" data-id="${c.id}" data-category="${cat}" data-deduction="${c.deduction}">
        <img src="${c.img}" alt="${c.label}" class="condition-image" loading="lazy" width="140" height="140">
        <p class="condition-label">${c.label}</p>
      </div>`;
  }

  // Gracefully support either #lensConditionGrid or #lenseConditionGrid in your HTML
  function render() {
    const get = (x) => document.getElementById(x);
    const set = (el, html) => { if (el) el.innerHTML = html; };

    set(get('displayConditionGrid'),
        conditions.display.map(c => card(c, 'display')).join(''));

    set(get('bodyConditionGrid'),
        conditions.body.map(c => card(c, 'body')).join(''));

    set(get('errorConditionGrid'),
        conditions.error.map(c => card(c, 'error')).join(''));

    const lensEl = get('lensConditionGrid') || get('lenseConditionGrid');
    set(lensEl, conditions.lens.map(c => card(c, 'lens')).join(''));

    // Add click event listeners to all condition cards after rendering
    document.querySelectorAll('.condition-card').forEach(card => {
      card.addEventListener('click', handleCardClick);
    });
  }

  function allChosen() {
    return ['display','body','error','lens'].every(k => selections[k] !== null);
  }

  function recalc() {
    if (!allChosen()) { 
      finalQuoteContainer?.classList.add('hidden'); 
      return; 
    }
    const total = Object.values(selections).reduce((a,b)=>a+Number(b||0),0);
    const current = basePrice * (1 - total);
    const finalPrice = Math.round(Math.max(current, basePrice * 0.05));
    vd.priceAfterPhysical = finalPrice;
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    finalQuoteContainer?.classList.remove('hidden');
    // live drawer (safe if absent)
    try { window.updateOfferDrawer?.(vd); } catch {}
  }

  function updateProceedButton() {
    if (!proceedBtn) return;
    if (allChosen()) {
      proceedBtn.removeAttribute('disabled');
    } else {
      proceedBtn.setAttribute('disabled', 'disabled');
    }
  }

  // Fixed click handler
  function handleCardClick(e) {
    const card = e.currentTarget; // Use currentTarget instead of closest
    const cat = card.dataset.category;
    const deduction = parseFloat(card.dataset.deduction);
    
    // Update selection
    selections[cat] = deduction;
    
    // Remove selected class from all cards in this category
    document.querySelectorAll(`.condition-card[data-category="${cat}"]`).forEach(c => {
      c.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    // Recalculate and update UI
    recalc();
    updateProceedButton();
  }

  // Next button
  proceedBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (proceedBtn.hasAttribute('disabled')) return; // Don't proceed if disabled
    sessionStorage.setItem('valuationData', JSON.stringify(vd));
    window.location.href = 'functional-issues.html';
  });

  // Initialize
  render();
  recalc();
  updateProceedButton();
});