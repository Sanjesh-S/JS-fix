
// js/home.js - lightweight slider + footer year
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('yearNow');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const slider = document.querySelector('.review-slider');
  if (!slider) return;
  const slides = slider.querySelector('.slides');
  const items  = slider.querySelectorAll('.review');
  const prev   = slider.querySelector('.prev');
  const next   = slider.querySelector('.next');
  let idx = 0;

  function go(i){
    idx = (i + items.length) % items.length;
    slides.style.transform = `translateX(-${idx*100}%)`;
  }

  prev?.addEventListener('click', ()=>go(idx-1));
  next?.addEventListener('click', ()=>go(idx+1));

  if (slider.getAttribute('data-autoplay') === 'true'){
    setInterval(()=>go(idx+1), 4500);
  }
});
