document.addEventListener('DOMContentLoaded', () => {
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

    const orderIdElement = document.getElementById('order-id');
    const orderItemsContainer = document.getElementById('order-items-container');
    const orderTotalElement = document.getElementById('order-total');

    const displayOrder = async () => {
        const orderId = localStorage.getItem('latestOrderId');
        if (!orderId) {
            orderIdElement.textContent = 'No order found.';
            return;
        }
        orderIdElement.textContent = orderId;

        try {
            const orderDoc = await db.collection('orders').doc(orderId).get();

            if (orderDoc.exists) {
                const orderData = orderDoc.data();
                orderItemsContainer.innerHTML = ''; // Clear loading state
                orderData.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'flex justify-between items-center text-gray-600';
                    itemElement.innerHTML = `
                        <span>${item.name} <span class="text-sm font-medium">x ${item.quantity}</span></span>
                        <span class="font-semibold">₹${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    orderItemsContainer.appendChild(itemElement);
                });

                orderTotalElement.textContent = `₹${orderData.total.toFixed(2)}`;

            } else {
                console.error("No such document!");
                orderItemsContainer.innerHTML = '<p class="text-red-500">Could not find order details.</p>';
            }
        } catch (error) {
            console.error("Error getting document:", error);
            orderItemsContainer.innerHTML = '<p class="text-red-500">Error fetching order details.</p>';
        }
    };

    displayOrder();
});
