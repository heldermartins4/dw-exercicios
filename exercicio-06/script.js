let productsData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos.');
            }
            return response.json();
        })
        .then(data => {
            productsData = data; // Armazena os dados dos produtos em uma variável global
            displayProducts(data);
            updateCartBar(); // Atualiza a barra do carrinho após o carregamento dos produtos
        })
        .catch(error => console.error('Erro ao carregar produtos:', error));
});


function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produto adicionado ao carrinho');
    updateCartBar();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(item => item.id === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBar();
}

function getProductById(productId) {
    return productsData.find(product => product.id === productId);
}

function updateCartBar() {
    const cartItemsBar = document.getElementById('cart-items-bar');
    const cartBar = document.getElementById('cart-bar');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cartItemsBar) {
        console.error('Elemento "cart-items-bar" não encontrado.');
        return;
    }

    cartItemsBar.innerHTML = '';

    if (cart.length === 0) {
        cartBar.style.display = 'none';
        return;
    } else {
        cartBar.style.display = 'block';
    }

    cart.forEach(item => {
        const product = getProductById(item.id);
        if (product) {
            const productDiv = document.createElement('div');
            productDiv.className = 'cart-item-bar';

            productDiv.innerHTML = `
                <img src="assets/${product.images[0]}" alt="${product.name}">
                <span>${product.name} (Quantidade: ${item.quantity})</span>
                <button onclick="removeFromCart(${item.id})">-</button>
            `;

            cartItemsBar.appendChild(productDiv);
        }
    });
}

// Função para exibir os produtos na página
function displayProducts(products) {
    const productList = document.getElementById('product-list');

    if (!productList) {
        console.error('Elemento "product-list" não encontrado.');
        return;
    }

    productList.innerHTML = ''; // Garantir que a lista está vazia

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        // Criar o HTML do produto
        productCard.innerHTML = `
            <img src="assets/${product.images[0]}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
        `;

        productList.appendChild(productCard);
    });
}

function displayCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';
    cartItems.forEach(item => {
        const product = getProductById(item.id);
        if (product) {
            const productDiv = document.createElement('div');
            productDiv.className = 'cart-item';
            productDiv.innerHTML = `
                <p>${product.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})">Remover</button>
            `;
            cartContainer.appendChild(productDiv);
        }
    });
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCart();
}
