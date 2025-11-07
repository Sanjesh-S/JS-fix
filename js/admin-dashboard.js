// js/admin-dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    
    const logoutButton = document.getElementById('logout-button');
    const pickupListBody = document.getElementById('pickup-list-body');

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
        if (!firebase.firestore) {
            pickupListBody.innerHTML = '<tr><td colspan="5">Error: Firestore not loaded.</td></tr>';
            return;
        }

        try {
            const db = firebase.firestore();
            
            // Query the correct collection, order by newest first
            const snap = await db.collection('pickupRequests').orderBy('createdAt', 'desc').get();

            if (snap.empty) {
                pickupListBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No pickup requests found.</td></tr>';
                return;
            }

            // Clear "Loading..."
            pickupListBody.innerHTML = ''; 
            
            snap.forEach(doc => {
                const d = doc.data();
                const customer = d.customer || {};
                const device = d.device || {};
                const schedule = d.schedule || {};

                // Create a new row
                const row = document.createElement('tr');
                
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
                    <td><span class="status-new">${d.status || 'New'}</span></td>
                `;
                
                pickupListBody.appendChild(row);
            });

        } catch (e) {
            console.error('Error loading data:', e);
            pickupListBody.innerHTML = `<tr><td colspan="5">Error: ${e.message}</td></tr>`;
        }
    }
    
    function money(n) {
        if (n == null) return 'N/A';
        return `₹${Number(n || 0).toLocaleString('en-IN')}`;
    }
});