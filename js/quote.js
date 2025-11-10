document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const modelName = params.get('model');
    const brandName = params.get('brand');
    const imageUrl = params.get('image');
    // ===================================================
    // NEW: Read the price from the URL
    // ===================================================
    const basePrice = params.get('price');
    // ===================================================

    // This function is no longer needed
    // function getQuotePrice(modelName) { ... }

    if (modelName && brandName && basePrice) {
        
        document.getElementById('productTitle').textContent = `Sell Old ${modelName}`;
        document.getElementById('modelName').textContent = `${brandName} ${modelName}`;
        const modelImage = document.getElementById('productImage');

        if (imageUrl) {
            modelImage.src = imageUrl;
        }
        
        // Use the basePrice from the URL
        document.getElementById('quotePrice').textContent = `₹${Number(basePrice).toLocaleString('en-IN')}`;

        const getExactValueBtn = document.getElementById('getExactValueBtn');
        getExactValueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const valuationData = {
                modelName: modelName,
                brandName: brandName,
                imageUrl: imageUrl, 
                // Save the real price
                originalQuotePrice: Number(basePrice) 
            };
            
            sessionStorage.setItem('valuationData', JSON.stringify(valuationData));
            window.location.href = 'assessment.html';
        });
    } else {
        // Fallback if price or model is missing
        alert("Could not load camera details. Please go back and try again.");
        window.location.href = 'index.html';
    }
});