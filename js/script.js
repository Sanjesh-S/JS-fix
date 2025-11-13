// js/script.js (NEW DYNAMIC VERSION - Fetches from Firestore)

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

// ===== GLOBAL DATA STORE =====
// This will hold all our products fetched from Firestore
let allProducts = [];
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

// 1. Populate Categories
function populateCategories() {
  categoryGrid.innerHTML = "";
  
  // ===================================================
  // THE FIX IS HERE
  // We add .filter(c => c) to remove any "undefined" or null categories
  // ===================================================
  const categories = [...new Set(
    allProducts
      .map(p => p.category)
      .filter(c => c) // This filters out any falsy values (null, undefined, "")
  )];
  categories.sort(); // Sort them alphabetically

  categories.forEach(categoryName => {
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

// 2. Populate Brands
function populateBrands(categoryName) {
  brandGrid.innerHTML = "";
  
  // Get all unique brands *for this category*
  const brands = [...new Set(
    allProducts
      .filter(p => p.category === categoryName)
      .map(p => p.brand)
      .filter(b => b) // Also filter out any bad brand data
  )];
  brands.sort(); // Sort them alphabetically

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

// 3. Populate Models
function populateModels(categoryName, brandName) {
  modelGrid.innerHTML = "";
  
  // Get all models that match both category and brand
  const models = allProducts.filter(p => 
    p.category === categoryName && p.brand === brandName
  );
  
  // Sort the models array naturally
  const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
  models.sort((a, b) => collator.compare(a.name, b.name));
  
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

// This function will run as soon as the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Show a loading message
  categoryGrid.innerHTML = "<p>Loading products...</p>";

  // Ensure Firebase is ready before trying to fetch
  function checkFirebase() {
    if (window.firebase && firebase.firestore) {
      fetchProducts();
    } else {
      // Firebase isn't loaded yet, check again in 100ms
      setTimeout(checkFirebase, 100);
    }
  }

  async function fetchProducts() {
    try {
      const db = firebase.firestore();
      const snapshot = await db.collection("products").get();
      
      if (snapshot.empty) {
        categoryGrid.innerHTML = "<p>No products found. Please add some in the admin dashboard.</p>";
        return;
      }
      
      // Map Firestore documents to our allProducts array
      allProducts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          brand: data.brand,
          category: data.category,
          price: data.price,
          image: data.image
        };
      });

      // Now that we have data, populate the categories
      populateCategories();
      
    } catch (error) {
      console.error("Error fetching products:", error);
      categoryGrid.innerHTML = "<p>Error loading products. Please check the console.</p>";
    }
  }

  // Start the process
  checkFirebase();
});