document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAL8PpJIqdYLMQlTy-rAy25QMNA2ldPakI",
        authDomain: "food-hub-project.firebaseapp.com",
        projectId: "food-hub-project",
        storageBucket: "food-hub-project.firebasestorage.app",
        messagingSenderId: "1086250595919",
        appId: "1:1086250595919:web:b4efc6f470779aa1241c3a"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore(); 

    const menuItems = [
        { id: 1, name: 'Chicken Biryani', price: 250, category: 'Biryani', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Biryani'},
        { id: 2, name: 'Veg Biryani', price: 180, category: 'Biryani', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Biryani'},
        { id: 3, name: 'Chicken Pizza', price: 225, category: 'Pizza', image: 'https://placehold.co/300x200/8BC34A/FFFFFF?text=Pizza'},
        { id: 4, name: 'Pepperoni Pizza', price: 180, category: 'Pizza', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Pizza'},
        { id: 5, name: 'Veggie Pizza', price: 150, category: 'Pizza', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Pizza'},
        { id: 6, name: 'French Fries', price: 80, category: 'Fries', image: 'https://placehold.co/300x200/8BC34A/FFFFFF?text=Fries'},
        { id: 7, name: 'Soft Drinks', price: 40, category: 'Drinks', image: 'https://placehold.co/300x200/F44336/FFFFFF?text=Drink'},
        { id: 8, name: 'Cheese Burger', price: 90, category: 'Burgers', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Burger'},
        { id: 9, name: 'Chicken Burger', price: 120, category: 'Burgers', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Burger'},
        { id: 10, name: 'SugarCane Juice', price: 25, category: 'Drinks', image: 'https://placehold.co/300x200/F44336/FFFFFF?text=Drink'},
    ];
    let cart = [];
    const menuGrid = document.getElementById('menu-grid');
    const categoryFilters = document.getElementById('category-filters');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-btn');

    const renderMenu = (filter = 'All') => {
        if (!menuGrid) return;
        menuGrid.innerHTML = '';
        const filteredItems = filter === 'All' ? menuItems : menuItems.filter(item => item.category === filter);
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300';
            card.innerHTML = `<img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover"><div class="p-5"><h3 class="text-xl font-bold mb-2">${item.name}</h3><p class="text-gray-500 mb-4">${item.category}</p><div class="flex justify-between items-center"><span class="text-2xl font-bold text-orange-500">₹${item.price.toFixed(2)}</span><button data-id="${item.id}" class="add-to-cart-btn bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900">Add <i class="fas fa-plus ml-1"></i></button></div></div>`;
            menuGrid.appendChild(card);
        });
    };
    const renderCategories = () => {
        if (!categoryFilters) return;
        const categories = ['All', ...new Set(menuItems.map(item => item.category))];
        categoryFilters.innerHTML = categories.map(category => `<button class="category-btn capitalize px-5 py-2 rounded-full font-semibold ${category === 'All' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-orange-100'}" data-category="${category}">${category}</button>`).join('');
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.category-btn.bg-orange-500').classList.replace('bg-orange-500', 'bg-white');
                document.querySelector('.category-btn.text-white').classList.replace('text-white', 'text-gray-700');
                btn.classList.add('bg-orange-500', 'text-white');
                renderMenu(btn.dataset.category);
            });
        });
    };
    const updateCart = () => {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div class="text-center text-gray-500 mt-10"><i class="fas fa-shopping-basket text-4xl mb-4"></i><p>Your cart is empty.</p></div>`;
        } else {
            cart.forEach(cartItem => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center justify-between mb-4';
                itemElement.innerHTML = `<div class="flex items-center"><img src="${cartItem.image}" class="w-16 h-16 rounded-lg mr-4"><div><h4 class="font-semibold">${cartItem.name}</h4><p class="text-gray-500">₹${cartItem.price.toFixed(2)}</p></div></div><div class="flex items-center gap-3"><button class="quantity-change text-lg font-bold" data-id="${cartItem.id}" data-change="-1">-</button><span>${cartItem.quantity}</span><button class="quantity-change text-lg font-bold" data-id="${cartItem.id}" data-change="1">+</button><button class="remove-item text-red-500 ml-2" data-id="${cartItem.id}"><i class="fas fa-trash-alt"></i></button></div>`;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartSubtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    };
    const addToCart = (itemId) => {
        const item = menuItems.find(i => i.id === itemId);
        const cartItem = cart.find(i => i.id === itemId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        updateCart();
    };
    const handleCartAction = (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const id = parseInt(target.dataset.id);
        if (target.classList.contains('quantity-change')) {
            const change = parseInt(target.dataset.change);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
            }
        }
        if (target.classList.contains('remove-item')) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCart();
    };
    const toggleCart = () => {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
    };

    const handleCheckout = async () => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (subtotal <= 0) {
            alert("Your cart is empty!");
            return;
        }
        const orderData = {
            items: cart,
            total: subtotal,
            status: "Paid",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        try {
            const docRef = await db.collection("orders").add(orderData);
            console.log("Order written with ID: ", docRef.id);
        
            localStorage.setItem('latestOrderId', docRef.id);

            window.location.href = 'order-confirmation.html';

        } catch (error) {
            console.error("Error adding document: ", error);
            alert("There was an error placing your order. Please try again.");
        }
    };

    if (cartButton) cartButton.addEventListener('click', toggleCart);
    if (closeCartButton) closeCartButton.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (menuGrid) menuGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            addToCart(parseInt(e.target.closest('.add-to-cart-btn').dataset.id));
            // Open cart for a moment to show item was added
            toggleCart();
            setTimeout(toggleCart, 800);
        }
    });
    if (cartItemsContainer) cartItemsContainer.addEventListener('click', handleCartAction);
    if (checkoutBtn) checkoutBtn.addEventListener('click', handleCheckout);
    renderCategories();
    renderMenu();
    updateCart();
});

