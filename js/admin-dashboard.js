// js/admin-dashboard.js (v3 - Full Product Management)

document.addEventListener('DOMContentLoaded', () => {
    
    // Global Elements
    const logoutButton = document.getElementById('logout-button');
    let db; // Firestore database instance

    // Tab Elements
    const showPickupsBtn = document.getElementById('showPickupsBtn');
    const showProductsBtn = document.getElementById('showProductsBtn');
    const pickupsPanel = document.getElementById('pickupsPanel');
    const productsPanel = document.getElementById('productsPanel');

    // Pickups Panel Elements
    const pickupListBody = document.getElementById('pickup-list-body');

    // Products Panel Elements
    const productForm = document.getElementById('product-form');
    const productFormStatus = document.getElementById('product-form-status');
    const productListBody = document.getElementById('product-list-body');
    const saveProductBtn = document.getElementById('save-product-btn');
    
    // Input Fields
    const productCategory = document.getElementById('product-category');
    const productBrand = document.getElementById('product-brand');
    const productName = document.getElementById('product-name');
    const productPrice = document.getElementById('product-price');
    const productImage = document.getElementById('product-image');


    // 1. Auth Gatekeeper
    if (!firebase || !firebase.auth) {
        console.error("Firebase not loaded. Redirecting to login.");
        window.location.href = 'admin-login.html';
        return;
    }
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            console.log('Admin user signed in. Loading data...');
            db = firebase.firestore(); // Initialize db instance
            
            // Load initial tab
            loadPickupRequests();

            // Setup listeners
            setupTabListeners();
            setupPickupListeners();
            setupProductFormListener();
            setupProductListListeners();

        } else {
            // No user is signed in. Redirect to login.
            console.log('No user signed in. Redirecting to login.');
            window.location.href = 'admin-login.html';
        }
    });

    // 2. Logout Function
    logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
            console.log('Admin signed out.');
            window.location.href = 'admin-login.html';
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    });
    
    // 3. Tab Switching Logic
    function setupTabListeners() {
        showPickupsBtn.addEventListener('click', () => {
            pickupsPanel.classList.add('active');
            productsPanel.classList.remove('active');
            showPickupsBtn.classList.add('active');
            showProductsBtn.classList.remove('active');
            loadPickupRequests(); // Refresh data
        });

        showProductsBtn.addEventListener('click', () => {
            pickupsPanel.classList.remove('active');
            productsPanel.classList.add('active');
            showPickupsBtn.classList.remove('active');
            showProductsBtn.classList.add('active');
            loadProducts(); // Load product data
        });
    }


    // ===========================================
    // PICKUP REQUESTS LOGIC (Section 4)
    // ===========================================

    async function loadPickupRequests() {
        if (!db) {
            pickupListBody.innerHTML = '<tr><td colspan="6">Error: Firestore not loaded.</td></tr>';
            return;
        }

        try {
            const snap = await db.collection('pickupRequests').orderBy('createdAt', 'desc').get();
            if (snap.empty) {
                pickupListBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No pickup requests found.</td></tr>';
                return;
            }

            pickupListBody.innerHTML = ''; // Clear "Loading..."
            
            snap.forEach(doc => {
                const d = doc.data();
                const docId = doc.id;
                const customer = d.customer || {};
                const device = d.device || {};
                const schedule = d.schedule || {};

                const row = document.createElement('tr');
                
                let actionCell = '';
                if (d.status === 'New') {
                    if (d.userId) {
                         actionCell = `<td>
                            <button class="action-btn complete-btn" 
                                    data-doc-id="${docId}" 
                                    data-user-id="${d.userId}"
                                    data-price="${d.finalPrice || 0}">
                                Complete
                            </button>
                         </td>`;
                    } else {
                        actionCell = `<td><small>No User ID</small></td>`;
                    }
                } else {
                    actionCell = `<td>-</td>`; // Completed
                }

                let statusCell = (d.status === 'Completed') ? 
                    `<td><span class="status-completed">Completed</span></td>` : 
                    `<td><span class="status-new">New</span></td>`;

                row.innerHTML = `
                    <td class="details-col">
                        <strong>${customer.name || 'N/A'}</strong><br>
                        ${customer.phone || 'N/A'}<br>
                        ${customer.address || 'N/A'}<br>
                        ${customer.city || ''}, ${customer.pincode || ''}
                    </td>
                    <td class="details-col">
                        <strong>${device.brandName || ''} ${device.modelName || ''}</strong><br>
                        Original: ${money(device.originalQuotePrice)}
                    </td>
                    <td><strong>${money(d.finalPrice)}</strong></td>
                    <td class="details-col">
                        ${schedule.dateLabel || 'N/A'}<br>
                        <span style="font-size: 13px;">${schedule.slot || 'N/A'}</span>
                    </td>
                    ${statusCell}
                    ${actionCell}
                `;
                pickupListBody.appendChild(row);
            });

        } catch (e) {
            console.error('Error loading pickup data:', e);
            pickupListBody.innerHTML = `<tr><td colspan="6">Error: ${e.message}</td></tr>`;
        }
    }
    
    function setupPickupListeners() {
        pickupListBody.addEventListener('click', async (e) => {
            if (e.target.classList.contains('complete-btn')) {
                const btn = e.target;
                const docId = btn.dataset.docId;
                const userId = btn.dataset.userId;
                const price = parseInt(btn.dataset.price, 10);

                const defaultCoins = Math.round(price * 0.05); // 5% bonus
                const coinsToAdd = prompt(`Pickup complete. How many coins to award this user? (Default is 5% = ${defaultCoins} coins)`, defaultCoins);
                
                if (coinsToAdd === null || isNaN(parseInt(coinsToAdd, 10))) {
                    return; // Admin cancelled
                }
                
                const coinAmount = parseInt(coinsToAdd, 10);
                if (coinAmount < 0) {
                     alert("Cannot add negative coins.");
                     return;
                }

                btn.disabled = true;
                btn.textContent = 'Working...';

                try {
                    const pickupRef = db.collection('pickupRequests').doc(docId);
                    const userRef = db.collection('users').doc(userId);
                    const batch = db.batch();
                    
                    batch.update(pickupRef, { status: 'Completed' });
                    batch.update(userRef, {
                        coins: firebase.firestore.FieldValue.increment(coinAmount)
                    });
                    
                    await batch.commit();
                    
                    alert(`Success! ${coinAmount} coins added to user ${userId}.`);
                    loadPickupRequests(); // Refresh the list
                    
                } catch (error) {
                    console.error("Error completing pickup:", error);
                    alert("Error: " + error.message);
                    btn.disabled = false;
                    btn.textContent = 'Complete';
                }
            }
        });
    }

    // ===========================================
    // MANAGE PRODUCTS LOGIC (Section 5)
    // ===========================================

    async function loadProducts() {
        if (!db) {
            productListBody.innerHTML = '<tr><td colspan="5">Error: Firestore not loaded.</td></tr>';
            return;
        }

        try {
            const snap = await db.collection('products').orderBy('category').orderBy('brand').orderBy('name').get();
            if (snap.empty) {
                productListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No products found. Click "Add New Product" to start.</td></tr>';
                return;
            }

            productListBody.innerHTML = ''; // Clear "Loading..."
            
            snap.forEach(doc => {
                const d = doc.data();
                const docId = doc.id;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${d.category || 'N/A'}</td>
                    <td>${d.brand || 'N/A'}</td>
                    <td><strong>${d.name || 'N/A'}</strong></td>
                    <td>${money(d.price)}</td>
                    <td>
                        <button class="action-btn edit-btn" data-doc-id="${docId}" data-price="${d.price}">Edit Price</button>
                        <button class="action-btn delete-btn" data-doc-id="${docId}">Delete</button>
                    </td>
                `;
                productListBody.appendChild(row);
            });

        } catch (e) {
            console.error('Error loading product data:', e);
            productListBody.innerHTML = `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
        }
    }

    function setupProductFormListener() {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            saveProductBtn.disabled = true;
            saveProductBtn.textContent = "Saving...";
            productFormStatus.style.display = 'none';

            try {
                const newProduct = {
                    category: productCategory.value.trim(),
                    brand: productBrand.value.trim(),
                    name: productName.value.trim(),
                    price: Number(productPrice.value),
                    image: productImage.value.trim()
                };
                
                if (!newProduct.category || !newProduct.brand || !newProduct.name || !newProduct.price || !newProduct.image) {
                    throw new Error("All fields are required.");
                }

                await db.collection('products').add(newProduct);
                
                productFormStatus.textContent = "Success! Product added.";
                productFormStatus.style.color = "var(--ok)";
                productFormStatus.style.display = "block";

                productForm.reset(); // Clear the form
                loadProducts(); // Refresh the product list

            } catch (error) {
                console.error("Error adding product:", error);
                productFormStatus.textContent = "Error: " + error.message;
                productFormStatus.style.color = "var(--danger)";
                productFormStatus.style.display = "block";
            } finally {
                saveProductBtn.disabled = false;
                saveProductBtn.textContent = "Save Product";
            }
        });
    }

    function setupProductListListeners() {
        productListBody.addEventListener('click', async (e) => {
            const btn = e.target;
            const docId = btn.dataset.docId;
            if (!docId) return;

            // --- Handle Delete ---
            if (btn.classList.contains('delete-btn')) {
                if (!confirm("Are you sure you want to delete this product?")) {
                    return;
                }
                btn.disabled = true;
                try {
                    await db.collection('products').doc(docId).delete();
                    loadProducts(); // Refresh list
                } catch (error) {
                    alert("Error deleting product: " + error.message);
                    btn.disabled = false;
                }
            }

            // --- Handle Edit Price ---
            if (btn.classList.contains('edit-btn')) {
                const currentPrice = btn.dataset.price;
                const newPrice = prompt("Enter the new price:", currentPrice);

                if (newPrice === null || isNaN(Number(newPrice)) || Number(newPrice) <= 0) {
                    return; // User cancelled or entered invalid price
                }
                
                btn.disabled = true;
                try {
                    await db.collection('products').doc(docId).update({
                        price: Number(newPrice)
                    });
                    loadProducts(); // Refresh list
                } catch (error) {
                    alert("Error updating price: " + error.message);
                    btn.disabled = false;
                }
            }
        });
    }
    
    // ===========================================
    // HELPER FUNCTIONS
    // ===========================================
    function money(n) {
        if (n == null) return 'N/A';
        return `₹${Number(n || 0).toLocaleString('en-IN')}`;
    }
});