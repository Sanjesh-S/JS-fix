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

  // --- NEW: Sidebar Elements ---
  const evaluationImage = document.getElementById('evaluationImage');
  const evaluationModel = document.getElementById('evaluationModel');
  const evaluationList = document.getElementById('evaluation-summary-list');

  // --- NEW: Populate Sidebar Info ---
  if (evaluationImage && valuationData.imageUrl) evaluationImage.src = valuationData.imageUrl;
  if (evaluationModel) evaluationModel.textContent = `${valuationData.brandName || ''} ${valuationData.modelName || ''}`.trim();


  const questions = [
    { id: 'powerOn',        text: 'Does your camera power on and function properly?',                         instruction: 'We currently only accept devices that switch on', deduction: 0.30 },
    { id: 'bodyDamage',     text: 'Is the camera body free from major damage (cracks, dents, water damage)?', instruction: 'Check your device\'s body or buttons condition carefully', deduction: 0.25 },
    { id: 'lcdScreen',      text: 'Is the LCD/Touchscreen working without cracks or display issues?',         instruction: 'Check your device\'s display condition carefully', deduction: 0.20 },
    { id: 'lensCondition',  text: 'Is the lens (if included) free from scratches, fungus, or dust?',          instruction: 'Check your lens condition carefully', deduction: 0.15 },
    { id: 'autofocusZoom',  text: 'Does autofocus and zoom work properly on your camera/lens?',               instruction: 'Check your device\'s autofocus and zoom functionality carefully', deduction: 0.15 }
  ];

  const questionsContainer   = document.getElementById('questionsContainer');
  const finalQuoteContainer  = document.getElementById('finalQuoteContainer');
  const proceedBtn           = document.getElementById('proceedBtn');

  const userAnswers = {}; // { [id]: "yes" | "no" }

  function renderQuestions() {
    questionsContainer.innerHTML = questions.map((q, i) => `
      <div class="question-item">
        <p class="question-text">${q.text}</p>
        <p class="question-instruction">${q.instruction}</p>
        <div class="answer-options">
          <label class="radio-option-box">
            <input type="radio" name="${q.id}" value="yes" data-question-id="${q.id}" data-answer="yes">
            <span>Yes</span>
          </label>
          <label class="radio-option-box">
            <input type="radio" name="${q.id}" value="no" data-question-id="${q.id}" data-answer="no">
            <span>No</span>
          </label>
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

  // --- NEW: Sidebar Update Function ---
  function updateEvaluationSidebar() {
    if (!evaluationList) return;
    evaluationList.innerHTML = ''; // Clear the list

    questions.forEach(q => {
      if (userAnswers[q.id]) {
        const answerText = userAnswers[q.id] === 'yes' ? 'Yes' : 'No';
        const itemHTML = `
          <div class="evaluation-item">
            <span class="evaluation-question">${q.text}</span>
            <span class="evaluation-answer">• ${answerText}</span>
          </div>
        `;
        evaluationList.innerHTML += itemHTML;
      }
    });
  }

  // MODIFIED: This function no longer needs to hide/show or disable the button
  function updateProceedVisibility() {
    // This function is no longer responsible for button visibility.
    // Validation is now handled on click.
  }

  // Handle radio button changes
  questionsContainer.addEventListener('change', (ev) => {
    const radio = ev.target;
    if (!radio.matches('input[type="radio"]')) return;

    const qid    = radio.getAttribute('data-question-id');
    const answer = radio.getAttribute('data-answer');

    userAnswers[qid] = answer;

    // Update visual state - remove selected class from all boxes in this question group
    const questionItem = radio.closest('.question-item');
    questionItem.querySelectorAll('.radio-option-box').forEach(box => {
      box.classList.remove('selected');
    });
    // Add selected class to the checked box
    radio.closest('.radio-option-box').classList.add('selected');

    calculatePriceAndStore();
    updateProceedVisibility();
    updateEvaluationSidebar();
  });

  // Proceed
  // MODIFIED: Added validation alert
  proceedBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    // NEW: Validation check
    const firstUnanswered = questions.find(q => !userAnswers[q.id]);
    if (firstUnanswered) {
      alert('Please select an option for:\n"' + firstUnanswered.text + '"');
      return; // Stop execution
    }
    
    // persist answers for later steps
    valuationData.assessmentAnswers = userAnswers;
    sessionStorage.setItem('valuationData', JSON.stringify(valuationData));

    window.location.href = 'physical-condition.html';
  });

  // initial render
  renderQuestions();
  updateProceedVisibility(); // keep disabled until user answers everything
});