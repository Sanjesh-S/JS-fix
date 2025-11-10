// js/script.js (NEW VERSION - CATEGORY-FIRST FLOW)

// ===================================================
// YOUR NEW PRODUCT DATABASE
// ===================================================
// You can add all your products here, organized by category and brand.
const PRODUCT_DATA = {
  "DSLR Cameras": {
    "Canon": [
        { name: "Canon EOS R3", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r3.png", price: 450000 },
        { name: "Canon EOS R5", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r5.png", price: 280000 },
        { name: "Canon EOS R6 Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r6-mark-ii.png", price: 190000 },
        { name: "Canon EOS 100D / Rebel SL1", image: "https://firebasestorage.googleapis.com/v0/b/worthyten-otp-a925d.appspot.com/o/camera_images%2Fcanon-eos-100d.png?alt=media&token=5e0f204e-e680-47e5-b473-bb99e5f4cd06", price: 19000 },
        { name: "Canon EOS 600D / Rebel T3i", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-600d.png", price: 18000 },
    ],
    "Nikon": [
        { name: "Nikon Z9", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z9.png", price: 470000 },
        { name: "Nikon Z8", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z8.png", price: 310000 },
        { name: "Nikon D850", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d850.png", price: 180000 },
    ],
    "Sony": [
        { name: "Sony a7R V", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7r-v.png", price: 300000 },
        { name: "Sony a7 IV", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7-iv.png", price: 180000 },
    ],
    "Fujifilm": [
        { name: "Fujifilm X-T5", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-t5.png", price: 140000 },
    ],
    "GoPro": [
        { name: "GoPro HERO 12 Black", image: "https://storage.googleapis.com/gemini-camera-images/gopro-hero12-black.png", price: 38000 },
    ],
    "Panasonic": [
        { name: "Panasonic Lumix S5 II", image: "https://storage.googleapis.com/gemini-camera-images/panasonic-lumix-s5-ii.png", price: 160000 },
    ]
  },
  "Smartphones": {
    "Apple": [
      { name: "iPhone 15 Pro", image: "https://example.com/img.png", price: 90000 },
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