document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_PASSWORD = "admin"; 
    const firebaseConfig = {
        apiKey: "AIzaSyAL8PpJIqdYLMQlTy-rAy25QMNA2ldPakI",
        authDomain: "food-hub-project.firebaseapp.com",
        projectId: "food-hub-project",
        storageBucket: "food-hub-project.firebasestorage.app",
        messagingSenderId: "1086250595919",
        appId: "1:1086250595919:web:b4efc6f470779aa1241c3a"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    const loginSection = document.getElementById('login-section');
    const dashboard = document.getElementById('dashboard');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const ordersContainer = document.getElementById('orders-container');
    const orderCount = document.getElementById('order-count');
    const loadingOrders = document.getElementById('loading-orders');

    const handleLogin = () => {
        if (passwordInput.value === ADMIN_PASSWORD) {
            loginSection.style.display = 'none';
            dashboard.style.display = 'block';
            listenForOrders(); // Start listening for orders after login
        } else {
            errorMessage.textContent = 'Incorrect password. Please try again.';
        }
    };
    
    // Function to format the timestamp from Firestore
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Converts Firestore timestamp to a readable date and time
        return timestamp.toDate().toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };
    // Function to listen for real-time order updates
    const listenForOrders = () => {
        const ordersRef = db.collection('orders').orderBy('createdAt', 'desc');

        // onSnapshot keeps a live connection to the database
        ordersRef.onSnapshot(snapshot => {
            if (snapshot.empty) {
                loadingOrders.textContent = 'No orders have been placed yet.';
                return;
            }

            loadingOrders.style.display = 'none';
            ordersContainer.innerHTML = ''; // Clear previous orders
            orderCount.textContent = snapshot.size; // Update total order count

            snapshot.forEach(doc => {
                const order = doc.data();
                const orderId = doc.id;

                const orderCard = document.createElement('div');
                orderCard.className = 'border rounded-lg p-6 hover:shadow-md transition-shadow';
                
                let itemsHtml = order.items.map(item => `
                    <li class="flex justify-between">
                        <span>${item.name} <span class="text-gray-500">x ${item.quantity}</span></span>
                        <span class="font-medium">₹${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                `).join('');

                orderCard.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="font-bold text-lg">Order ID: <span class="font-mono text-gray-700">${orderId}</span></p>
                            <p class="text-sm text-gray-500">Placed on: ${formatDate(order.createdAt)}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-2xl text-orange-500">₹${order.total.toFixed(2)}</p>
                            <span class="text-sm font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">${order.status}</span>
                        </div>
                    </div>
                    <div class="mt-4 border-t pt-4">
                        <h4 class="font-semibold mb-2">Items:</h4>
                        <ul class="space-y-1 text-gray-600">
                            ${itemsHtml}
                        </ul>
                    </div>
                `;
                ordersContainer.appendChild(orderCard);
            });
        }, error => {
            console.error("Error listening for orders: ", error);
            loadingOrders.textContent = 'Error loading orders.';
        });
    };

    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
});
