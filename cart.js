document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const orderForm = document.getElementById('order-form');
    const applyPromoButton = document.getElementById('apply-promo');

    let currentTotal = 0;
    let discount = 0;
    let shippingCost = 0;

    // Получаем текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Функция для получения корзины из localStorage
    function getCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Функция для сохранения корзины в localStorage
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Функция для обновления счетчика товаров в корзине
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    }

    // Функция для отображения товаров в корзине
    function displayCart() {
        const cart = getCart();
        let cartHTML = '';
        currentTotal = 0;

        if (cart.length === 0) {
            cartHTML = '<div class="empty-cart glass" style="padding: 40px; text-align: center;"><p>Корзина пуста</p><a href="catalog.html" class="btn">Перейти в каталог</a></div>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                currentTotal += itemTotal;

                cartHTML += `
                    <div class="cart-item glass" style="margin-bottom: 20px; padding: 20px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;">
                            <div style="flex: 1;">
                                <h3 style="margin-bottom: 10px;">${item.name}</h3>
                                <p style="color: var(--text-secondary); margin-bottom: 10px;">${item.specs || 'Характеристики не указаны'}</p>
                                <div class="quantity-controls" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                    <button class="btn quantity-decrease" data-product-id="${item.id}" style="padding: 5px 10px;">-</button>
                                    <input type="number" class="quantity-input" data-product-id="${item.id}" value="${item.quantity}" min="1" style="width: 60px; text-align: center; padding: 5px;">
                                    <button class="btn quantity-increase" data-product-id="${item.id}" style="padding: 5px 10px;">+</button>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <p style="font-weight: bold;">${item.price.toLocaleString()} ₽ × ${item.quantity} = ${itemTotal.toLocaleString()} ₽</p>
                                    <button class="btn remove-from-cart" data-product-id="${item.id}" style="background: var(--death-red);">Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        cartItemsContainer.innerHTML = cartHTML;
        calculateTotal();
        attachEventListeners();
        
        // Заполняем данные пользователя, если он авторизован
        if (currentUser) {
            document.getElementById('name').value = currentUser.name;
            document.getElementById('email').value = currentUser.email;
            if (currentUser.phone) {
                document.getElementById('phone').value = currentUser.phone;
            }
        }
    }

    // Функция для расчета итоговой суммы
    function calculateTotal() {
        shippingCost = currentTotal >= 50000 ? 0 : 500;
        const totalWithDiscount = currentTotal - discount;
        const finalTotal = Math.max(0, totalWithDiscount) + shippingCost;

        cartTotalPriceElement.textContent = finalTotal.toLocaleString() + ' ₽';
        
        // Обновляем отображение скидки и доставки
        updateOrderSummary();
    }

    // Функция для обновления сводки заказа
    function updateOrderSummary() {
        let summaryHTML = `
            <div class="order-summary glass" style="padding: 20px; margin-bottom: 20px;">
                <h3>Сводка заказа</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>Товары:</span>
                    <span>${currentTotal.toLocaleString()} ₽</span>
                </div>
        `;

        if (discount > 0) {
            summaryHTML += `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--soul-blue);">
                    <span>Скидка:</span>
                    <span>-${discount.toLocaleString()} ₽</span>
                </div>
            `;
        }

        summaryHTML += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Доставка:</span>
                <span>${shippingCost === 0 ? 'Бесплатно' : shippingCost.toLocaleString() + ' ₽'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em; border-top: 1px solid var(--border-light); padding-top: 10px;">
                <span>Итого:</span>
                <span>${cartTotalPriceElement.textContent}</span>
            </div>
        </div>`;

        // Вставляем сводку перед формой заказа
        const orderForm = document.querySelector('.order-form');
        const existingSummary = document.querySelector('.order-summary');
        if (existingSummary) {
            existingSummary.remove();
        }
        orderForm.insertAdjacentHTML('beforebegin', summaryHTML);
    }

    // Функция для привязки обработчиков событий
    function attachEventListeners() {
        // Удаление товара
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                removeFromCart(productId);
            });
        });

        // Уменьшение количества
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                updateQuantity(productId, -1);
            });
        });

        // Увеличение количества
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.dataset.productId;
                updateQuantity(productId, 1);
            });
        });

        // Изменение количества через input
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.dataset.productId;
                const newQuantity = parseInt(this.value);
                if (newQuantity > 0) {
                    setQuantity(productId, newQuantity);
                } else {
                    this.value = 1;
                }
            });
        });
    }

    // Функция для удаления товара из корзины
    function removeFromCart(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id != productId);
        saveCart(cart);
        displayCart();
        showNotification('Товар удален из корзины');
    }

    // Функция для обновления количества товара
    function updateQuantity(productId, change) {
        let cart = getCart();
        const item = cart.find(item => item.id == productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                item.quantity = 1;
            }
            saveCart(cart);
            displayCart();
        }
    }

    // Функция для установки количества товара
    function setQuantity(productId, quantity) {
        let cart = getCart();
        const item = cart.find(item => item.id == productId);
        if (item) {
            item.quantity = quantity;
            saveCart(cart);
            displayCart();
        }
    }

    // Функция для применения промокода
    function applyPromoCode(promoCode) {
        const promo = promoCode.trim().toUpperCase();
        let newDiscount = 0;

        if (promo === 'GEEKBOT25') {
            newDiscount = currentTotal * 0.25;
            discount = newDiscount;
            showNotification('Промокод применен! Скидка 25%');
        } else if (promo === 'TECH10') {
            newDiscount = currentTotal * 0.10;
            discount = newDiscount;
            showNotification('Промокод применен! Скидка 10%');
        } else if (promo === 'WELCOME5') {
            newDiscount = currentTotal * 0.05;
            discount = newDiscount;
            showNotification('Промокод применен! Скидка 5%');
        } else if (promo === 'FREESHIP') {
            shippingCost = 0;
            showNotification('Промокод применен! Бесплатная доставка');
        } else if (promo) {
            showNotification('Неверный промокод');
            return;
        }

        calculateTotal();
    }

    // Функция для показа уведомлений
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

    // Обработчик отправки формы заказа
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const cart = getCart();
        if (cart.length === 0) {
            showNotification('Корзина пуста');
            return;
        }

        const formData = new FormData(this);
        const orderData = {
            name: formData.get('name'),
            email: currentUser ? currentUser.email : formData.get('email'),
            phone: formData.get('phone') || '',
            address: formData.get('address'),
            items: cart,
            total: currentTotal - discount + shippingCost,
            discount: discount,
            shipping: shippingCost,
            orderNumber: 'TS' + Date.now(),
            date: new Date().toISOString(),
            status: 'pending',
            userId: currentUser ? currentUser.email : 'guest'
        };

        // Сохраняем заказ в localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Очищаем корзину
        saveCart([]);
        
        showNotification(`Заказ №${orderData.orderNumber} оформлен! Спасибо за покупку.`);
        
        // Перенаправляем в личный кабинет, если пользователь авторизован
        if (currentUser) {
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 2000);
        }
        
        // Очищаем форму
        this.reset();
        displayCart();
    });

    // Обработчик применения промокода
    applyPromoButton.addEventListener('click', function() {
        const promoInput = document.getElementById('promo');
        applyPromoCode(promoInput.value);
        promoInput.value = '';
    });

    // Обработчик Enter в поле промокода
    document.getElementById('promo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode(this.value);
            this.value = '';
        }
    });

    // Инициализация
    displayCart();
});