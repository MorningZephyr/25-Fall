
let cart = [];

// Open/Close cart modal
document.getElementById('cart-btn').onclick = function() {
    document.getElementById('cart-modal').classList.add('active');
};

document.getElementById('close-cart').onclick = function() {
    document.getElementById('cart-modal').classList.remove('active');
};

// Add to cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.onclick = function() {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        
        // Check if item exists
        let found = false;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].name === name) {
                cart[i].quantity++;
                found = true;
                break;
            }
        }
        
        if (!found) {
            cart.push({ name: name, price: price, quantity: 1 });
        }
        
        updateCart();
    };
});

// Clear cart
document.getElementById('clear-cart').onclick = function() {
    cart = [];
    updateCart();
};

// Update cart display
function updateCart() {
    const container = document.getElementById('cart-items');
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    
    // Update count
    let count = 0;
    for (let i = 0; i < cart.length; i++) {
        count += cart[i].quantity;
    }
    countEl.textContent = count;
    
    // Update total
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }
    totalEl.textContent = '$' + total.toFixed(2);
    
    // Update items
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        return;
    }
    
    container.innerHTML = '';
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item-btn" onclick="removeItem('${item.name}')">Remove</button>
        `;
        container.appendChild(div);
    }
}

// Remove item
function removeItem(name) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart.splice(i, 1);
            break;
        }
    }
    updateCart();
}

// Initialize
updateCart();
