// ===== CAMERA MODELS DATA (V4 - PERMANENT GOOGLE HOSTING) =====
const CAMERA_MODELS = {
    "Canon": [
        // EOS R (RF mount) mirrorless
        { name: "Canon EOS R3", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r3.png" },
        { name: "Canon EOS R5", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r5.png" },
        { name: "Canon EOS R6 Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r6-mark-ii.png" },
        { name: "Canon EOS R7", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r7.png" },
        { name: "Canon EOS R8", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r8.png" },
        { name: "Canon EOS R10", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r10.png" },
        { name: "Canon EOS R50", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r50.png" },
        { name: "Canon EOS R100", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r100.png" },
        { name: "Canon EOS RP", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-rp.png" },
        { name: "Canon EOS R", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-r.png" },

        // EOS DSLR (EF mount)
        { name: "Canon EOS-1D X Mark III", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-1d-x-mark-iii.png" },
        { name: "Canon EOS 5D Mark IV", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-5d-mark-iv.png" },
        { name: "Canon EOS 6D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-6d-mark-ii.png" },
        { name: "Canon EOS 7D Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-7d-mark-ii.png" },
        { name: "Canon EOS 90D", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-90d.png" },
        { name: "Canon EOS 850D / Rebel T8i", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-850d.png" },
        { name: "Canon EOS 700D / Rebel T5i", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-700d.png" },
        { name: "Canon EOS 600D / Rebel T3i", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-600d.png" },
        { name: "Canon EOS 200D Mark II / Rebel SL3", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-200d-mark-ii.png" },
        { name: "Canon EOS 100D / Rebel SL1", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-100d.png" },
        { name: "Canon EOS 2000D / Rebel T7", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-2000d.png" },
        { name: "Canon EOS 4000D", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-4000d.png" },

        // EOS M (EF-M mount) mirrorless
        { name: "Canon EOS M50 Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-m50-mark-ii.png" },
        { name: "Canon EOS M6 Mark II", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-m6-mark-ii.png" },
        { name: "Canon EOS M5", image: "https://storage.googleapis.com/gemini-camera-images/canon-eos-m5.png" },

        // PowerShot (compact)
        { name: "Canon PowerShot G7 X Mark III", image: "https://storage.googleapis.com/gemini-camera-images/powershot-g7-x-mark-iii.png" },
        { name: "Canon PowerShot G5 X Mark II", image: "https://storage.googleapis.com/gemini-camera-images/powershot-g5-x-mark-ii.png" }
    ],

    "Nikon": [
        // Z-mount mirrorless
        { name: "Nikon Z9", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z9.png" },
        { name: "Nikon Z8", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z8.png" },
        { name: "Nikon Z7 II", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z7-ii.png" },
        { name: "Nikon Z6 II", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z6-ii.png" },
        { name: "Nikon Zf", image: "https://storage.googleapis.com/gemini-camera-images/nikon-zf.png" },
        { name: "Nikon Z fc", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z-fc.png" },
        { name: "Nikon Z5", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z5.png" },
        { name: "Nikon Z50", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z50.png" },
        { name: "Nikon Z30", image: "https://storage.googleapis.com/gemini-camera-images/nikon-z30.png" },

        // F-mount DSLR
        { name: "Nikon D6", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d6.png" },
        { name: "Nikon D850", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d850.png" },
        { name: "Nikon D780", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d780.png" },
        { name: "Nikon D500", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d500.png" },
        { name: "Nikon D7500", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d7500.png" },
        { name: "Nikon D5600", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d5600.png" },
        { name: "Nikon D3500", image: "https://storage.googleapis.com/gemini-camera-images/nikon-d3500.png" }
    ],

    "Sony": [
        // Full-frame Alpha (E-mount)
        { name: "Sony a1", image: "https://storage.googleapis.com/gemini-camera-images/sony-a1.png" },
        { name: "Sony a9 III", image: "https://storage.googleapis.com/gemini-camera-images/sony-a9-iii.png" },
        { name: "Sony a7R V", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7r-v.png" },
        { name: "Sony a7 IV", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7-iv.png" },
        { name: "Sony a7C II", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7c-ii.png" },
        { name: "Sony a7S III", image: "https://storage.googleapis.com/gemini-camera-images/sony-a7s-iii.png" },

        // APS-C Alpha (E-mount)
        { name: "Sony a6700", image: "https://storage.googleapis.com/gemini-camera-images/sony-a6700.png" },
        { name: "Sony a6400", image: "https://storage.googleapis.com/gemini-camera-images/sony-a6400.png" },
        { name: "Sony a6000", image: "https://storage.googleapis.com/gemini-camera-images/sony-a6000.png" },

        // Vlog / ZV series
        { name: "Sony ZV-E10", image: "https://storage.googleapis.com/gemini-camera-images/sony-zv-e10.png" },
        { name: "Sony ZV-1 II", image: "https://storage.googleapis.com/gemini-camera-images/sony-zv-1-ii.png" },

        // RX / Cyber-shot compacts
        { name: "Sony RX100 VII", image: "https://storage.googleapis.com/gemini-camera-images/sony-rx100-vii.png" }
    ],

    "Fujifilm": [
        // X Series
        { name: "Fujifilm X-T5", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-t5.png" },
        { name: "Fujifilm X-H2S", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-h2s.png" },
        { name: "Fujifilm X-S20", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-s20.png" },
        { name: "Fujifilm X-Pro3", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-pro3.png" },
        { name: "Fujifilm X-T30 II", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x-t30-ii.png" },

        // Fixed-lens premium
        { name: "Fujifilm X100VI", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-x100vi.png" },

        // Medium format GFX
        { name: "Fujifilm GFX100 II", image: "https://storage.googleapis.com/gemini-camera-images/fujifilm-gfx100-ii.png" }
    ],
    
    "Panasonic": [
        // Full-frame S series
        { name: "Panasonic Lumix S5 II", image: "https://storage.googleapis.com/gemini-camera-images/panasonic-lumix-s5-ii.png" },

        // Micro Four Thirds G/GH series
        { name: "Panasonic Lumix GH6", image: "https://storage.googleapis.com/gemini-camera-images/panasonic-lumix-gh6.png" },
        { name: "Panasonic Lumix G9 II", image: "https://storage.googleapis.com/gemini-camera-images/panasonic-lumix-g9-ii.png" }
    ],

    "Leica": [
        { name: "Leica M11", image: "https://storage.googleapis.com/gemini-camera-images/leica-m11.png" },
        { name: "Leica Q3", image: "https://storage.googleapis.com/gemini-camera-images/leica-q3.png" },
        { name: "Leica SL2", image: "https://storage.googleapis.com/gemini-camera-images/leica-sl2.png" }
    ],

    "GoPro": [
        { name: "GoPro HERO 12 Black", image: "https://storage.googleapis.com/gemini-camera-images/gopro-hero12-black.png" },
        { name: "GoPro HERO 11 Black", image: "https://storage.googleapis.com/gemini-camera-images/gopro-hero11-black.png" },
        { name: "GoPro MAX", image: "https://storage.googleapis.com/gemini-camera-images/gopro-max.png" }
    ]
};

// ===== DOM ELEMENTS =====
const brandSelectionContainer = document.getElementById("brandSelection");
const modelSelectionContainer = document.getElementById("modelSelection");
const selectedBrandTitle = document.getElementById("selectedBrandTitle");
const cameraModelsGrid = document.getElementById("cameraModelsGrid");
const brandCards = document.querySelectorAll(".brand-card");
const backButton = document.getElementById("backButton");

// ===== BRAND CARD CLICK =====
brandCards.forEach(card => {
    card.addEventListener("click", function (event) {
        event.preventDefault();
        const brand = this.getAttribute("data-brand");
        if (brand && CAMERA_MODELS[brand]) {
            brandSelectionContainer.classList.add("hidden");
            setTimeout(() => {
                selectedBrandTitle.textContent = brand;
                displayCameraModels(brand);
                modelSelectionContainer.classList.remove("hidden");
            }, 300);
        }
    });
});

// ===== DISPLAY MODELS =====
function displayCameraModels(brand) {
    cameraModelsGrid.innerHTML = "";
    const models = CAMERA_MODELS[brand] || [];

    // Sort alphabetically
    const sorted = models.slice().sort((a, b) => a.name.localeCompare(b.name));

    sorted.forEach(model => {
        // Pass the new image URL in the query parameter
        const cardHTML = `
            <a href="quote.html?model=${encodeURIComponent(model.name)}&brand=${encodeURIComponent(brand)}&image=${encodeURIComponent(model.image)}" class="model-card" title="${model.name}">
                <img src="${model.image}" alt="${model.name}" class="model-image" loading="lazy">
                <span class="model-name">${model.name}</span>
            </a>
        `;
        cameraModelsGrid.innerHTML += cardHTML;
    });
}

// ===== BACK BUTTON =====
if (backButton) {
    backButton.addEventListener("click", function (e) {
        e.preventDefault();
        modelSelectionContainer.classList.add("hidden");
        setTimeout(() => {
            brandSelectionContainer.classList.remove("hidden");
        }, 300);
    });
}