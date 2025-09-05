// js/assessment.js
document.addEventListener("DOMContentLoaded", () => {
  const valuationDataString = sessionStorage.getItem('valuationData');
  if (!valuationDataString) { window.location.href = 'index.html'; return; }
  const valuationData = JSON.parse(valuationDataString);

  // Back
  document.getElementById('backToQuote')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.back();
  });

  // Header data
  document.getElementById('modelNameText').textContent = valuationData.modelName || '';
  document.getElementById('fullModelName').textContent = `${valuationData.brandName || ''} ${valuationData.modelName || ''}`.trim();
  if (valuationData.imageUrl) document.getElementById('productImage').src = valuationData.imageUrl;

  const questions = [
    { id: 'powerOn',        text: 'Does your camera power on and function properly?',                         deduction: 0.30 },
    { id: 'bodyDamage',     text: 'Is the camera body free from major damage (cracks, dents, water damage)?', deduction: 0.25 },
    { id: 'lcdScreen',      text: 'Is the LCD/Touchscreen working without cracks or display issues?',         deduction: 0.20 },
    { id: 'lensCondition',  text: 'Is the lens (if included) free from scratches, fungus, or dust?',          deduction: 0.15 },
    { id: 'autofocusZoom',  text: 'Does autofocus and zoom work properly on your camera/lens?',               deduction: 0.15 }
  ];

  const questionsContainer   = document.getElementById('questionsContainer');
  const finalQuoteContainer  = document.getElementById('finalQuoteContainer');
  const proceedBtn           = document.getElementById('proceedBtn');

  const userAnswers = {}; // { [id]: "yes" | "no" }

  function renderQuestions() {
    questionsContainer.innerHTML = questions.map((q, i) => `
      <div class="question-item">
        <p class="question-text">${i+1}. ${q.text}</p>
        <div class="answer-options">
          <button type="button" class="answer-btn" data-question-id="${q.id}" data-answer="yes">Yes</button>
          <button type="button" class="answer-btn" data-question-id="${q.id}" data-answer="no">No</button>
        </div>
      </div>
    `).join('');
  }

  function calculatePriceAndStore() {
    let currentPrice = Number(valuationData.originalQuotePrice || 0);
    questions.forEach(q => {
      if (userAnswers[q.id] === 'no') currentPrice -= Number(valuationData.originalQuotePrice || 0) * q.deduction;
    });
    // Floor at 10%
    const finalPriceRounded = Math.round(Math.max(currentPrice, Number(valuationData.originalQuotePrice || 0) * 0.10));
    valuationData.priceAfterAssessment = finalPriceRounded;
    sessionStorage.setItem('valuationData', JSON.stringify(valuationData));
  }

  function updateProceedVisibility() {
    const answered = Object.keys(userAnswers).length;
    const total    = questions.length;
    if (answered === total && total > 0) {
      finalQuoteContainer.classList.remove('hidden');
      proceedBtn?.removeAttribute('disabled');     // make sure it’s clickable
    } else {
      proceedBtn?.setAttribute('disabled', 'disabled');
    }
  }

  // Delegate clicks for both buttons and any inner spans/icons
  questionsContainer.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.answer-btn');
    if (!btn) return;

    const qid    = btn.getAttribute('data-question-id');
    const answer = btn.getAttribute('data-answer');

    userAnswers[qid] = answer;

    // toggle selected for this question’s two buttons
    btn.parentElement.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    calculatePriceAndStore();
    updateProceedVisibility();
  });

  // Proceed
  proceedBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    // if somehow clicked early, block it
    if (proceedBtn.hasAttribute('disabled')) return;

    // persist answers for later steps
    valuationData.assessmentAnswers = userAnswers;
    sessionStorage.setItem('valuationData', JSON.stringify(valuationData));

    window.location.href = 'physical-condition.html';
  });

  // initial render
  renderQuestions();
  updateProceedVisibility(); // keep disabled until user answers everything
});
