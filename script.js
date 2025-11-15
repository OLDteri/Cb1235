// script.js - для главной страницы
document.addEventListener('DOMContentLoaded', function() {
    // Показываем популярные товары на главной
    displayPopularProducts();
    
    // Инициализация корзины
    updateCartCount();

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    function displayPopularProducts() {
        const popularGrid = document.getElementById('popular-products-grid');
        if (!popularGrid) return;

        // Берем первые 6 товаров как популярные
        const popularProducts = [
            {
                id: 1,
                name: "ASUS ROG Strix G15",
                price: 129990,
                image: "images/products/laptop1.jpg",
                specs: "RTX 4060 • i7-13700H • 16GB • 1TB SSD"
            },
            {
                id: 2,
                name: "Apple MacBook Pro 16\"",
                price: 249990,
                image: "images/products/laptop2.jpg", 
                specs: "M3 Pro • 18GB • 512GB SSD"
            },
            {
                id: 3,
                name: "Lenovo ThinkPad X1 Carbon",
                price: 189990,
                image: "images/products/laptop3.jpg",
                specs: "i7-1360P • 16GB • 1TB SSD"
            },
            {
                id: 6,
                name: "ASUS TUF Gaming A15", 
                price: 119990,
                image: "images/products/laptop6.jpg",
                specs: "RTX 4050 • Ryzen 7 • 16GB • 512GB SSD"
            },
            {
                id: 10,
                name: "Lenovo Legion 5 Pro",
                price: 169990,
                image: "images/products/laptop10.jpg",
                specs: "RTX 4070 • Ryzen 7 • 32GB • 1TB SSD"
            },
            {
                id: 13,
                name: "Dell Alienware m16",
                price: 219990, 
                image: "images/products/laptop13.jpg",
                specs: "RTX 4070 • i9-13900HX • 32GB • 1TB SSD"
            }
        ];

        popularProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', 'glass', 'fade-in');

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="product-badge">Популярный</div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-specs">
                        <span>${product.specs}</span>
                    </div>
                    <div class="product-price">
                        <span class="price">${product.price.toLocaleString()} ₽</span>
                    </div>
                    <button class="btn add-to-cart" data-product="${product.id}">В корзину</button>
                </div>
            `;
            popularGrid.appendChild(productCard);
        });

        // Обработчики для кнопок "В корзину" на главной
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.product);
                addToCart(productId);
            }
        });

        function addToCart(productId) {
            const product = popularProducts.find(p => p.id === productId);
            if (!product) return;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    specs: product.specs,
                    quantity: 1
                });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} добавлен в корзину`);
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification glass';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 1000;
                animation: slideInRight 0.3s ease;
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }
});