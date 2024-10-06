let cart = [];
const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const totalContainer = document.getElementById('total');
const cartCount = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');

async function fetchProducts() {
    const response = await fetch('./products.json');
    const products = await response.json();
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts(products);
}

function displayProducts(products) {
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productsContainer.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const product = findProductById(item.id);
            total += product.price * item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;">
                <div style="flex: 1; display: flex; justify-content: space-between; align-items: center;">
                    <h4>${product.name}</h4>
                    <p>Cantidad: ${item.quantity}</p>
                </div>
                <p>
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </p>
                <p>Subtotal: $${(product.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            `;
            cartContainer.appendChild(cartItemDiv);
        });

        const finishButton = document.createElement('button');
        finishButton.innerText = 'Finalizar Compra';
        finishButton.onclick = finalizePurchase;
        cartContainer.appendChild(finishButton);
    }

    totalContainer.innerText = `Total: $${total.toFixed(2)}`;
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function changeQuantity(productId, amount) {
    const product = cart.find(p => p.id === productId);
    if (product) {
        product.quantity += amount;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function findProductById(id) {
    const products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
}

function finalizePurchase() {
    Swal.fire({
        title: '¡Compra finalizada!',
        text: 'Gracias por tu compra. ¡Vuelve pronto!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        cart = [];
        updateCart();
    });
}

cartIcon.addEventListener('click', () => {
    cartContainer.classList.toggle('visible');
});

fetchProducts();
