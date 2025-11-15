document.addEventListener('DOMContentLoaded', function() {
    // Фиксированная шапка при скролле
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Анимация появления элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Корзина
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();

    // Обработчики для кнопок "В корзину"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.product);
            addToCart(productId);
        }
    });

    // Добавление в корзину
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

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

    // Обновление счетчика корзины
    function updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
    }

    // Показать уведомление
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

    // Данные о 25 ноутбуках
    const products = [
        { 
            id: 1, 
            name: "ASUS ROG Strix G15", 
            price: 129990, 
            image: "images/products/laptop1.jpg",
            specs: "RTX 4060 • i7-13700H • 16GB • 1TB SSD",
            brand: "asus",
            processor: "i7",
            graphics: "rtx4060"
        },
        { 
            id: 2, 
            name: "Apple MacBook Pro 16\"", 
            price: 249990, 
            image: "images/products/laptop2.jpg",
            specs: "M3 Pro • 18GB • 512GB SSD",
            brand: "apple",
            processor: "m1",
            graphics: "integrated"
        },
        { 
            id: 3, 
            name: "Lenovo ThinkPad X1 Carbon", 
            price: 189990, 
            image: "images/products/laptop3.jpg",
            specs: "i7-1360P • 16GB • 1TB SSD",
            brand: "lenovo",
            processor: "i7",
            graphics: "integrated"
        },
         { 
            id: 4, 
            name: "HP Spectre x360", 
            price: 159990, 
            image: "images/products/laptop4.jpg",
            specs: "i7-1355U • 16GB • 1TB SSD • OLED",
            brand: "hp",
            processor: "i7",
            graphics: "integrated"
        },
        { 
            id: 5, 
            name: "Dell XPS 13 Plus", 
            price: 179990, 
            image: "images/products/laptop5.jpg",
            specs: "i7-1360P • 16GB • 512GB SSD",
            brand: "dell",
            processor: "i7",
            graphics: "integrated"
        },
        { 
            id: 6, 
            name: "ASUS TUF Gaming A15", 
            price: 119990, 
            image: "images/products/laptop6.jpg",
            specs: "RTX 4050 • Ryzen 7 • 16GB • 512GB SSD",
            brand: "asus",
            processor: "ryzen7",
            graphics: "rtx3050"
        },
        { 
            id: 7, 
            name: "MSI Katana 15", 
            price: 134990, 
            image: "images/products/laptop7.jpg",
            specs: "RTX 4060 • i5-13450HX • 16GB • 1TB SSD",
            brand: "msi",
            processor: "i5",
            graphics: "rtx4060"
        },
        { 
            id: 8, 
            name: "Acer Predator Helios 300", 
            price: 149990, 
            image: "images/products/laptop8.jpg",
            specs: "RTX 4060 • i7-13700HX • 16GB • 1TB SSD",
            brand: "acer",
            processor: "i7",
            graphics: "rtx4060"
        },
        { 
            id: 9, 
            name: "Apple MacBook Air 13\"", 
            price: 129990, 
            image: "images/products/laptop9.jpg",
            specs: "M2 • 8GB • 256GB SSD",
            brand: "apple",
            processor: "m1",
            graphics: "integrated"
        },
        { 
            id: 10, 
            name: "Lenovo Legion 5 Pro", 
            price: 169990, 
            image: "images/products/laptop10.jpg",
            specs: "RTX 4070 • Ryzen 7 • 32GB • 1TB SSD",
            brand: "lenovo",
            processor: "ryzen7",
            graphics: "rtx4070"
        },
        { 
            id: 11, 
            name: "ASUS ZenBook 14X", 
            price: 139990, 
            image: "images/products/laptop11.jpg",
            specs: "i7-1360P • 16GB • 1TB SSD • OLED",
            brand: "asus",
            processor: "i7",
            graphics: "integrated"
        },
        { 
            id: 12, 
            name: "HP Omen 16", 
            price: 159990, 
            image: "images/products/laptop12.jpg",
            specs: "RTX 4060 • i7-13700HX • 16GB • 1TB SSD",
            brand: "hp",
            processor: "i7",
            graphics: "rtx4060"
        },
        { 
            id: 13, 
            name: "Dell Alienware m16", 
            price: 219990, 
            image: "images/products/laptop13.jpg",
            specs: "RTX 4070 • i9-13900HX • 32GB • 1TB SSD",
            brand: "dell",
            processor: "i9",
            graphics: "rtx4070"
        },
        { 
            id: 14, 
            name: "MSI Stealth 14 Studio", 
            price: 189990, 
            image: "images/products/laptop14.jpg",
            specs: "RTX 4060 • i7-13700H • 32GB • 1TB SSD",
            brand: "msi",
            processor: "i7",
            graphics: "rtx4060"
        },
        { 
            id: 15, 
            name: "Acer Swift X", 
            price: 119990, 
            image: "images/products/laptop15.jpg",
            specs: "RTX 3050 • Ryzen 7 • 16GB • 512GB SSD",
            brand: "acer",
            processor: "ryzen7",
            graphics: "rtx3050"
        },
        { 
            id: 16, 
            name: "ASUS ROG Zephyrus G14", 
            price: 179990, 
            image: "images/products/laptop16.jpg",
            specs: "RTX 4060 • Ryzen 9 • 16GB • 1TB SSD",
            brand: "asus",
            processor: "ryzen7",
            graphics: "rtx4060"
        },
        { 
            id: 17, 
            name: "Lenovo Yoga 9i", 
            price: 149990, 
            image: "images/products/laptop17.jpg",
            specs: "i7-1360P • 16GB • 1TB SSD • OLED 2.8K",
            brand: "lenovo",
            processor: "i7",
            graphics: "integrated"
        },
        { 
            id: 18, 
            name: "HP Pavilion 15", 
            price: 89990, 
            image: "images/products/laptop18.jpg",
            specs: "i5-13420H • 16GB • 512GB SSD",
            brand: "hp",
            processor: "i5",
            graphics: "integrated"
        },
        { 
            id: 19, 
            name: "Dell Inspiron 15", 
            price: 79990, 
            image: "images/products/laptop19.jpg",
            specs: "i5-1335U • 8GB • 512GB SSD",
            brand: "dell",
            processor: "i5",
            graphics: "integrated"
        },
        { 
            id: 20, 
            name: "Apple MacBook Pro 14\"", 
            price: 199990, 
            image: "images/products/laptop20.jpg",
            specs: "M3 Pro • 18GB • 512GB SSD",
            brand: "apple",
            processor: "m1",
            graphics: "integrated"
        },
        { 
            id: 21, 
            name: "ASUS VivoBook Pro 16", 
            price: 109990, 
            image: "images/products/laptop21.jpg",
            specs: "RTX 3050 • Ryzen 5 • 16GB • 512GB SSD",
            brand: "asus",
            processor: "ryzen5",
            graphics: "rtx3050"
        },
        { 
            id: 22, 
            name: "MSI Crosshair 15", 
            price: 129990, 
            image: "images/products/laptop22.jpg",
            specs: "RTX 4050 • i5-13420H • 16GB • 512GB SSD",
            brand: "msi",
            processor: "i5",
            graphics: "rtx3050"
        },
        { 
            id: 23, 
            name: "Acer Nitro 5", 
            price: 99990, 
            image: "images/products/laptop23.jpg",
            specs: "RTX 3050 • i5-12500H • 16GB • 512GB SSD",
            brand: "acer",
            processor: "i5",
            graphics: "rtx3050"
        },
        { 
            id: 24, 
            name: "Lenovo IdeaPad Gaming 3", 
            price: 94990, 
            image: "images/products/laptop24.jpg",
            specs: "RTX 3050 • Ryzen 5 • 16GB • 512GB SSD",
            brand: "lenovo",
            processor: "ryzen5",
            graphics: "rtx3050"
        },
        { 
            id: 25, 
            name: "HP Victus 16", 
            price: 104990, 
            image: "images/products/laptop25.jpg",
            specs: "RTX 4050 • i5-13500H • 16GB • 512GB SSD",
            brand: "hp",
            processor: "i5",
            graphics: "rtx3050"
        }
    ];

    // Функция для отображения товаров
    function displayProducts(productsToShow) {
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;

        productsGrid.innerHTML = '';
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card', 'glass', 'fade-in');

            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="product-badge">Хит продаж</div>
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
            productsGrid.appendChild(productCard);
        });

        // Добавляем наблюдение за новыми элементами
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => observer.observe(el), index * 100);
        });
    }

    // Функция для фильтрации товаров
    function filterProducts() {
        const brandFilter = document.querySelector('select.filter-select:nth-child(1)').value;
        const priceFilter = document.querySelector('select.filter-select:nth-child(2)').value;
        const processorFilter = document.querySelector('select.filter-select:nth-child(3)').value;
        const graphicsFilter = document.querySelector('select.filter-select:nth-child(4)').value;

        let filteredProducts = products;

        if (brandFilter) {
            filteredProducts = filteredProducts.filter(product => product.brand === brandFilter);
        }

        if (processorFilter) {
            filteredProducts = filteredProducts.filter(product => product.processor === processorFilter);
        }

        if (graphicsFilter) {
            filteredProducts = filteredProducts.filter(product => product.graphics === graphicsFilter);
        }

        if (priceFilter) {
            switch(priceFilter) {
                case '0-50000':
                    filteredProducts = filteredProducts.filter(product => product.price <= 50000);
                    break;
                case '50000-100000':
                    filteredProducts = filteredProducts.filter(product => product.price > 50000 && product.price <= 100000);
                    break;
                case '100000-150000':
                    filteredProducts = filteredProducts.filter(product => product.price > 100000 && product.price <= 150000);
                    break;
                case '150000+':
                    filteredProducts = filteredProducts.filter(product => product.price > 150000);
                    break;
            }
        }

        displayProducts(filteredProducts);
    }

    // Инициализация фильтров
    function initFilters() {
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', filterProducts);
        });
    }

    // Инициализация
    displayProducts(products);
    initFilters();

    // Анимация появления элементов при скролле
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => observer.observe(el), index * 100);
    });
});