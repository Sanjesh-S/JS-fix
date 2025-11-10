// js/script.js (NEW VERSION - CATEGORY-FIRST FLOW)

// ===================================================
// YOUR NEW PRODUCT DATABASE
// ===================================================
// You can add all your products here, organized by category and brand.
const PRODUCT_DATA = {
  "DSLR Cameras": {
    "Canon": [
      { name: "Canon EOS 1200D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 1300D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 1500D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 700D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 200D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 200D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 77D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 60D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 70D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 80D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 6D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 7D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 5D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 5D Mark III", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 5D Mark IV", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 6D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 7D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 600D", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-600d.png", price: 18000 },
      { name: "Canon EOS 800D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 500D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 550D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 650D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 750D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 760D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 450D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 1100D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 1000D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS 3000D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon M50 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon M5 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS M200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R5", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r5.png", price: 280000 },
      { name: "Canon EOS RP", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R6 Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r6-mark-ii.png", price: 190000 },
      { name: "Canon PowerShot SX740 HS", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon 90D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon 100D", image: "https://firebasestorage.googleapis.com/v0/b/worthyten-otp-a925d.appspot.com/o/camera_images%2Fcanon-eos-100d.png?alt=media&token=5e0f204e-e680-47e5-b473-bb99e5f4cd06", price: 19000 },
      { name: "Canon EOS 850D", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R8", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS M100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon G7 X Mark III", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon G7 X Mark II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon G7 X", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon PowerShot SX70 HS", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon IXUS 285 HS", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS Rebel T6", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon PowerShot SX430 IS", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R50", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R10", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
      { name: "Canon EOS R7", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 }
    ],
    "Nikon": [
        { name: "Nikon Z9", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z9.png", price: 470000 },
        { name: "Nikon Z8", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z8.png", price: 310000 },
        { name: "Nikon D850", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d850.png", price: 180000 },
        { name: "Nikon D3100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D3200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D3300", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D3400", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D3500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5300", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5600", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D7000", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D7100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D7200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D810", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D750", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D800", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D7500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D300S", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D3000", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D90", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z 50 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z 5 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z 6 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z 7 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon D5000", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon 800E", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z7 II Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Z6 II Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P90", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P510", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P520", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P530", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P600", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P610", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P950", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix P1000", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L120", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L320", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L340", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L820", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L830", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Nikon Coolpix L840", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 }
    ],
    "Sony": [
        { name: "Sony a7R V", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7r-v.png", price: 300000 },
        { name: "Sony a7 IV", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7-iv.png", price: 180000 },
        { name: "Sony Alpha A6500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A68", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A77 II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A5100 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A6000 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A5000 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A6300 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7 II Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7 III", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A58", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A3500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony CyberShot DSC-H300", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Cybershot DSC-W190", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A6600 Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7R", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7R II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7R III", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7s III", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7s", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A6100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A6400", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A37", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Cybershot DSC-WX500", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Cybershot DSC-H100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Cybershot DSC-H200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Cybershot DSC-H400", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha ZV E1", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha ZV E10", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7C", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7C II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha A7CR", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha FX 30", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha FX3", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha 6700", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony ZV-1F", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Sony Alpha ZV-E10 II", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 }
    ],
    "Fujifilm": [
        { name: "Fujifilm X-T5", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-t5.png", price: 140000 },
        { name: "Fujifilm X-A7", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-A1", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-A5", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-H2", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-H2S", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-S20", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T3", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T100", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T10", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T200", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T20", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T30", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T2", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name:  "Fujifilm X-T4", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X-T30 II Mirrorless", image: "httpss://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "Fujifilm X100F Mirrorless", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 }
    ],
    "GoPro": [
        { name: "GoPro Hero 4", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 5", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 6", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 7", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 8", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 9", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 10", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 11", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 11 Mini", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero Plus", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Max 360", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Fusion", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 12", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 },
        { name: "GoPro Hero 13", image: "https://storage.googleapis.com/gemini-camera-images/placeholder.png", price: 10000 }
    ],
    "Panasonic": [
        { name: "Panasonic Lumix S5 II", image: "https://storage.googleapis.com/gemini-camera-images/panasonic-lumix-s5-ii.png", price: 160000 },
    ]
  },
  "Smartphones": {
    "Apple": [
      { name: "iPhone 15 Pro", image: "httpsto://example.com/img.png", price: 90000 },
      { name: "iPhone 14", image: "https://example.com/img.png", price: 55000 },
    ],
    "Samsung": [
      { name: "Galaxy S23 Ultra", image: "https://example.com/img.png", price: 80000 },
    ]
  },
  "Laptops & Macs": {
    "Apple": [
      { name: "MacBook Pro 14 (M3)", image: "https://example.com/img.png", price: 150000 },
    ],
    "Dell": [
      { name: "XPS 15", image: "https://example.com/img.png", price: 110000 },
    ]
  }
};
// ===================================================


// ===== DOM ELEMENTS =====
const searchInput = document.getElementById("search-input");
const dividerText = document.getElementById("divider-text");

const categorySelection = document.getElementById("category-selection");
const brandSelection = document.getElementById("brand-selection");
const modelSelection = document.getElementById("model-selection");

const categoryGrid = document.getElementById("category-grid");
const brandGrid = document.getElementById("brand-grid");
const modelGrid = document.getElementById("model-grid");

const selectedCategoryTitle = document.getElementById("selected-category-title");
const selectedBrandTitle = document.getElementById("selected-brand-title");

const backToCategoriesBtn = document.getElementById("back-to-categories");
const backToBrandsBtn = document.getElementById("back-to-brands");

// Store the currently selected category and brand
let currentCategory = null;
let currentBrand = null;

// ===== NAVIGATION & DISPLAY LOGIC =====

// Show/Hide sections
function showSection(sectionToShow) {
  [categorySelection, brandSelection, modelSelection].forEach(section => {
    section.classList.add("hidden");
  });
  sectionToShow.classList.remove("hidden");
}

// 1. Populate Categories (On Page Load)
function populateCategories() {
  categoryGrid.innerHTML = "";
  Object.keys(PRODUCT_DATA).forEach(categoryName => {
    // You can add specific icons here if you want
    const cardHTML = `
      <a href="#" class="brand-card" data-category="${categoryName}">
        <span class="brand-name">${categoryName}</span>
      </a>
    `;
    categoryGrid.innerHTML += cardHTML;
  });

  // Add click listeners to the new category cards
  categoryGrid.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = card.getAttribute('data-category');
      selectedCategoryTitle.textContent = currentCategory;
      dividerText.textContent = "Or choose a brand";
      
      populateBrands(currentCategory);
      showSection(brandSelection);
      searchInput.value = ''; // Clear search
      searchInput.placeholder = "Search for a brand or model";
    });
  });
}

// 2. Populate Brands (When a category is clicked)
function populateBrands(categoryName) {
  brandGrid.innerHTML = "";
  const brands = Object.keys(PRODUCT_DATA[categoryName]);
  
  brands.forEach(brandName => {
    const cardHTML = `
      <a href="#" class="brand-card" data-brand="${brandName}">
        <span class="brand-name">${brandName}</span>
      </a>
    `;
    brandGrid.innerHTML += cardHTML;
  });

  // Add click listeners to the new brand cards
  brandGrid.querySelectorAll('.brand-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      currentBrand = card.getAttribute('data-brand');
      selectedBrandTitle.textContent = currentBrand;
      dividerText.textContent = "Or choose a model";
      
      populateModels(currentCategory, currentBrand);
      showSection(modelSelection);
      searchInput.value = ''; // Clear search
      searchInput.placeholder = "Search for a model";
    });
  });
}

// 3. Populate Models (When a brand is clicked)
function populateModels(categoryName, brandName) {
  modelGrid.innerHTML = "";
  const models = PRODUCT_DATA[categoryName][brandName];
  
  models.forEach(model => {
    const cardHTML = `
      <a href="quote.html?model=${encodeURIComponent(model.name)}&brand=${encodeURIComponent(brandName)}&image=${encodeURIComponent(model.image)}&price=${encodeURIComponent(model.price)}" class="model-card" title="${model.name}">
        <img src="${model.image}" alt="${model.name}" class="model-image" loading="lazy">
        <span class="model-name">${model.name}</span>
      </a>
    `;
    modelGrid.innerHTML += cardHTML;
  });
}

// ===== BACK BUTTONS =====
backToCategoriesBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentCategory = null;
  dividerText.textContent = "Or choose a category";
  showSection(categorySelection);
  searchInput.value = '';
  searchInput.placeholder = "Search for a brand or model";
  handleSearch(); // Re-show all categories
});

backToBrandsBtn.addEventListener('click', (e) => {
  e.preventDefault();
  currentBrand = null;
  dividerText.textContent = "Or choose a brand";
  showSection(brandSelection);
  searchInput.value = '';
  searchInput.placeholder = "Search for a brand or model";
  handleSearch(); // Re-show all brands
});


// ===== SEARCH LOGIC (Updated) =====

function handleSearch() {
    if (!searchInput) return; 
    const searchTerm = searchInput.value.toLowerCase();

    // Figure out which grid is active
    if (!categorySelection.classList.contains('hidden')) {
      // Filtering Categories
      filterGrid(categoryGrid.querySelectorAll('.brand-card'), searchTerm, (card) => {
        return (card.getAttribute('data-category') || "").toLowerCase();
      });

    } else if (!brandSelection.classList.contains('hidden')) {
      // Filtering Brands
      filterGrid(brandGrid.querySelectorAll('.brand-card'), searchTerm, (card) => {
        return (card.getAttribute('data-brand') || "").toLowerCase();
      });

    } else if (!modelSelection.classList.contains('hidden')) {
      // Filtering Models
      filterGrid(modelGrid.querySelectorAll('.model-card'), searchTerm, (card) => {
        return (card.querySelector('.model-name').textContent || "").toLowerCase();
      });
    }
}

// Helper function to filter any grid
function filterGrid(cards, searchTerm, getName) {
  cards.forEach(card => {
    const name = getName(card);
    if (name.includes(searchTerm)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// Attach search listener
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

// ===== INITIAL PAGE LOAD =====
// Start by populating the categories
populateCategories();