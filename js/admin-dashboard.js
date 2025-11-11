// js/admin-dashboard.js (with Wallet Functionality)

document.addEventListener('DOMContentLoaded', () => {
    
    const logoutButton = document.getElementById('logout-button');
    const pickupListBody = document.getElementById('pickup-list-body');
    let db; // Firestore database instance

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
            loadPickupRequests();
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

    // 3. Load Data Function
    async function loadPickupRequests() {
        if (!db) {
            pickupListBody.innerHTML = '<tr><td colspan="6">Error: Firestore not loaded.</td></tr>';
            return;
        }

        try {
            // Query the correct collection, order by newest first
            const snap = await db.collection('pickupRequests').orderBy('createdAt', 'desc').get();

            if (snap.empty) {
                pickupListBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No pickup requests found.</td></tr>';
                return;
            }

            // Clear "Loading..."
            pickupListBody.innerHTML = ''; 
            
            snap.forEach(doc => {
                const d = doc.data();
                const docId = doc.id; // Get the document ID
                const customer = d.customer || {};
                const device = d.device || {};
                const schedule = d.schedule || {};

                // Create a new row
                const row = document.createElement('tr');
                
                // --- NEW: Action Button Logic ---
                let actionCell = '';
                if (d.status === 'New') {
                    // Only show button if the user ID exists and status is 'New'
                    if (d.userId) {
                         actionCell = `<td>
                            <button class="complete-btn" 
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

                // --- NEW: Status Logic ---
                let statusCell = '';
                if (d.status === 'Completed') {
                    statusCell = `<td><span class="status-completed">Completed</span></td>`;
                } else {
                    statusCell = `<td><span class="status-new">New</span></td>`;
                }

                // Format data into table cells
                row.innerHTML = `
                    <td class="details-col">
                        <strong>${customer.name || 'N/A'}</strong><br>
                        ${customer.phone || 'N/A'}<br>
                        ${customer.address || 'N/A'}<br>
                        ${customer.city || ''}, ${customer.pincode || ''}
                    </td>
                    <td class="details-col">
                        <strong>${device.brandName || ''} ${device.modelName || ''}</strong><br>
                        Original: ${money(device.originalQuotePrice)}<br>
                        Accessories: ${money(d.finalPrice - (device.priceAfterIssues || 0))}
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
            console.error('Error loading data:', e);
            pickupListBody.innerHTML = `<tr><td colspan="6">Error: ${e.message}</td></tr>`;
        }
    }
    
    // --- NEW: Event Listener for Complete Buttons ---
    pickupListBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('complete-btn')) {
            const btn = e.target;
            const docId = btn.dataset.docId;
            const userId = btn.dataset.userId;
            const price = parseInt(btn.dataset.price, 10);

            // 1. Ask admin for coin amount (e.g., 5% of price)
            const defaultCoins = Math.round(price * 0.05); // 5% bonus
            const coinsToAdd = prompt(`Pickup complete. How many coins to award this user? (Default is 5% = ${defaultCoins} coins)`, defaultCoins);
            
            if (coinsToAdd === null || isNaN(parseInt(coinsToAdd, 10))) {
                return; // Admin cancelled or entered invalid number
            }
            
            const coinAmount = parseInt(coinsToAdd, 10);
            
            if (coinAmount < 0) {
                 alert("Cannot add negative coins.");
                 return;
            }

            btn.disabled = true;
            btn.textContent = 'Working...';

            try {
                // 2. Get references to both documents
                const pickupRef = db.collection('pickupRequests').doc(docId);
                const userRef = db.collection('users').doc(userId);

                // 3. Use a batched write to update both atomically
                const batch = db.batch();
                
                // 3a. Update the pickup request
                batch.update(pickupRef, { status: 'Completed' });
                
                // 3b. Update the user's coin balance
                batch.update(userRef, {
                    coins: firebase.firestore.FieldValue.increment(coinAmount)
                });
                
                // 4. Commit the batch
                await batch.commit();
                
                // 5. Update UI
                alert(`Success! ${coinAmount} coins added to user ${userId}.`);
                btn.textContent = 'Done';
                // Visually update the status cell in the table
                const statusCell = btn.closest('tr').querySelector('.status-new');
                if (statusCell) {
                    statusCell.textContent = 'Completed';
                    statusCell.classList.remove('status-new');
                    statusCell.classList.add('status-completed');
                }
                
            } catch (error) {
                console.error("Error completing pickup:", error);
                alert("Error: " + error.message);
                btn.disabled = false;
                btn.textContent = 'Complete';
            }
        }
    });
    
    function money(n) {
        if (n == null) return 'N/A';
        return `₹${Number(n || 0).toLocaleString('en-IN')}`;
    }
});