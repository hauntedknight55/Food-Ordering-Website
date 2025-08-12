
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = [
        { id: 1, name: 'Chicken Biryani', price: 250, category: 'Biryani', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Biryani' },
        { id: 2, name: 'Veg Biryani', price: 180, category: 'Biryani', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Biryani' },
        { id: 3, name: 'Chicken Pizza', price: 225, category: 'Pizza', image: 'https://placehold.co/300x200/8BC34A/FFFFFF?text=Pizza' },
        { id: 4, name: 'Pepperoni Pizza', price: 180, category: 'Pizza', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Pizza' },
        { id: 5, name: 'Veggie Pizza', price: 150, category: 'Pizza', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Pizza' },
        { id: 6, name: 'French Fries', price: 80, category: 'Fries', image: 'https://placehold.co/300x200/8BC34A/FFFFFF?text=Fries' },
        { id: 7, name: 'Soft Drinks', price: 40, category: 'Drinks', image: 'https://placehold.co/300x200/F44336/FFFFFF?text=Drink' },
        { id: 8, name: 'Cheese Burger', price: 90, category: 'Burgers', image: 'https://placehold.co/300x200/FFC107/FFFFFF?text=Burger' },
        { id: 9, name: 'Chicken Burger', price: 120, category: 'Burgers', image: 'https://placehold.co/300x200/4CAF50/FFFFFF?text=Burger' },
        { id: 10, name: 'SugarCane Juice', price: 25, category: 'Drinks', image: 'https://placehold.co/300x200/F44336/FFFFFF?text=Drink' },
    ];

    let cart = [];

    // --- DOM ELEMENTS ---
    const menuGrid = document.getElementById('menu-grid');
    const categoryFilters = document.getElementById('category-filters');
    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    // --- FUNCTIONS ---

    // Function to render menu items
    const renderMenu = (filter = 'All') => {
        menuGrid.innerHTML = '';
        const filteredItems = filter === 'All' ? menuItems : menuItems.filter(item => item.category === filter);
        
        filteredItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <div class="p-5">
                    <h3 class="text-xl font-bold mb-2">${item.name}</h3>
                    <p class="text-gray-500 mb-4">${item.category}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-orange-500">₹${item.price.toFixed(2)}</span>
                        <button data-id="${item.id}" class="add-to-cart-btn bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900 transition duration-300">
                            Add <i class="fas fa-plus ml-1"></i>
                        </button>
                    </div>
                </div>
            `;
            menuGrid.appendChild(card);
        });
    };

    // Function to render category filters
    const renderCategories = () => {
        const categories = ['All', ...new Set(menuItems.map(item => item.category))];
        categoryFilters.innerHTML = categories.map(category => `
            <button class="category-btn capitalize px-5 py-2 rounded-full font-semibold transition duration-200 ${category === 'All' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700 hover:bg-orange-100'}" data-category="${category}">
                ${category}
            </button>
        `).join('');
        
        // Add event listeners to new buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.category-btn.bg-orange-500').classList.replace('bg-orange-500', 'bg-white');
                document.querySelector('.category-btn.text-white').classList.replace('text-white', 'text-gray-700');
                btn.classList.add('bg-orange-500', 'text-white');
                btn.classList.remove('bg-white', 'text-gray-700');
                renderMenu(btn.dataset.category);
            });
        });
    };

    // Function to update the cart display
    const updateCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(cartItem => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex items-center justify-between mb-4';
                itemElement.innerHTML = `
                    <div class="flex items-center">
                        <img src="${cartItem.image}" alt="${cartItem.name}" class="w-16 h-16 object-cover rounded-lg mr-4">
                        <div>
                            <h4 class="font-semibold">${cartItem.name}</h4>
                            <p class="text-gray-500">₹${cartItem.price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <button class="quantity-change text-lg font-bold" data-id="${cartItem.id}" data-change="-1">-</button>
                        <span class="w-8 text-center">${cartItem.quantity}</span>
                        <button class="quantity-change text-lg font-bold" data-id="${cartItem.id}" data-change="1">+</button>
                        <button class="remove-item text-red-500 hover:text-red-700 ml-2" data-id="${cartItem.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        
        // Update cart count and subtotal
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartSubtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    };

    // Function to add item to cart
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

    // Function to change quantity or remove item
    const handleCartAction = (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.dataset.id);

        if (target.classList.contains('quantity-change')) {
            const change = parseInt(target.dataset.change);
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.id !== id);
                }
            }
        }

        if (target.classList.contains('remove-item')) {
                cart = cart.filter(i => i.id !== id);
        }
        
        updateCart();
    };
    
    // Toggle cart sidebar
    const toggleCart = () => {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
    };

    // --- EVENT LISTENERS ---
    cartButton.addEventListener('click', toggleCart);
    closeCartButton.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    menuGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            const id = parseInt(button.dataset.id);
            addToCart(id);
            // Open cart for a moment to show item was added
            toggleCart();
            setTimeout(toggleCart, 800);
        }
    });
    
    cartItemsContainer.addEventListener('click', handleCartAction);

    // --- INITIALIZATION ---
    renderCategories();
    renderMenu();
    updateCart();
});