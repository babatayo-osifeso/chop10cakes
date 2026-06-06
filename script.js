// ===============================
// PRIMECHOPS FULL APP LOGIC
// ===============================

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("primechops_cart")) || [];

// ===============================
// INIT
// ===============================
window.onload = function () {
    updateCartUI();
};

// ===============================
// CART SYSTEM
// ===============================

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name && item.price === price);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();
}

function removeFromCart(name) {
    const item = cart.find(i => i.name === name);

    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    updateCartUI();
}

// ===============================
// UI UPDATE + LOCAL STORAGE
// ===============================

function updateCartUI() {
    const cartCountElement = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");

    // Save cart to localStorage
    localStorage.setItem("primechops_cart", JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.innerText = totalItems;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your basket is empty.</p>';
        cartTotalElement.innerText = "₦0";
        return;
    }

    let html = "";
    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name} (x${item.quantity})</h4>
                    <span>₦${itemTotal.toLocaleString()}</span>
                </div>
                <i class="fas fa-trash remove-item" onclick="removeFromCart('${item.name}')"></i>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalElement.innerText = `₦${grandTotal.toLocaleString()}`;
}

// ===============================
// CART SIDEBAR
// ===============================

function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("open");
}

// ===============================
// DELIVERY FEE LOGIC
// ===============================

function getDeliveryFee() {
    if (cart.length >= 5) return 2000;
    if (cart.length >= 2) return 1500;
    return 1000;
}

// ===============================
// SAVE ORDER (ADMIN STORAGE)
// ===============================

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem("primechops_orders")) || [];
    orders.push(order);
    localStorage.setItem("primechops_orders", JSON.stringify(orders));
}

// ===============================
// WHATSAPP CHECKOUT
// ===============================

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add something first.");
        return;
    }

    const phoneNumber = "2348156274861";

    let message = "Hello PrimeChops! I would like to place an order:\n\n";
    let grandTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        message += `- ${item.name} (x${item.quantity}) : ₦${itemTotal.toLocaleString()}\n`;
    });

    const deliveryFee = getDeliveryFee();
    grandTotal += deliveryFee;

    message += `\nDelivery Fee: ₦${deliveryFee}`;
    message += `\nTotal: ₦${grandTotal.toLocaleString()}`;

    // Save order snapshot
    saveOrder({
        items: JSON.parse(JSON.stringify(cart)),
        total: grandTotal,
        date: new Date().toISOString()
    });

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    // Clear cart
    cart = [];
    updateCartUI();
}

// ===============================
// MOBILE MENU
// ===============================

function toggleMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = document.querySelector(".menu-toggle i");

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
    } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    }
}

// ===============================
// CATEGORY FILTER
// ===============================

function filterMenu(category) {
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");

        card.style.display =
            category === "all" || cardCategory === category ? "" : "none";
    });
}