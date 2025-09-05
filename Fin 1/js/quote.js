document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const modelName = params.get('model');
    const brandName = params.get('brand');
    // This line is crucial - it reads the image URL passed from the model selection page
    const imageUrl = params.get('image');

    function getQuotePrice(modelName) {
        if (!modelName) return 20000;
        let price = 0;
        for (let i = 0; i < modelName.length; i++) {
            price += modelName.charCodeAt(i) * (i + 1);
        }
        price = (price % 130000) + 20000;
        return Math.round(price / 100) * 100;
    }

    if (modelName && brandName) {
        const basePrice = getQuotePrice(modelName);

        document.getElementById('productTitle').textContent = `Sell Old ${modelName}`;
        document.getElementById('modelName').textContent = `${brandName} ${modelName}`;
        const modelImage = document.getElementById('productImage');

        // This block displays the correct image on this quote page
        if (imageUrl) {
            modelImage.src = imageUrl;
        }
        
        document.getElementById('quotePrice').textContent = `₹${basePrice.toLocaleString('en-IN')}`;

        const getExactValueBtn = document.getElementById('getExactValueBtn');
        getExactValueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const valuationData = {
                modelName: modelName,
                brandName: brandName,
                // This line is crucial - it SAVES the image URL for the next pages
                imageUrl: imageUrl, 
                originalQuotePrice: basePrice
            };
            
            sessionStorage.setItem('valuationData', JSON.stringify(valuationData));
            window.location.href = 'assessment.html';
        });
    }
});