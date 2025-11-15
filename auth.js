// Система аутентификации
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Проверяем, есть ли сохраненный пользователь
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }

        // Инициализируем формы
        this.initLoginForm();
        this.initRegisterForm();
        this.initLogout();
    }

    initLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            });
        }
    }

    initRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                
                if (password !== confirmPassword) {
                    this.showNotification('Пароли не совпадают', 'error');
                    return;
                }

                this.register({
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    password: password
                });
            });
        }
    }

    initLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showNotification('Вход выполнен успешно!', 'success');
            
            // Перенаправляем в личный кабинет
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1000);
        } else {
            this.showNotification('Неверный email или пароль', 'error');
        }
    }

    register(userData) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Проверяем, нет ли уже пользователя с таким email
        if (users.find(u => u.email === userData.email)) {
            this.showNotification('Пользователь с таким email уже существует', 'error');
            return;
        }

        // Добавляем нового пользователя
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.showNotification('Регистрация прошла успешно!', 'success');
        
        // Автоматически логиним пользователя
        setTimeout(() => {
            this.login(userData.email, userData.password);
        }, 1000);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showNotification('Выход выполнен', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    updateUI() {
        // Обновляем навигацию в зависимости от статуса авторизации
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const accountBtn = document.getElementById('account-btn');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
            if (accountBtn) accountBtn.style.display = 'inline-block';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification glass ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0078d4'};
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Инициализация системы аутентификации
document.addEventListener('DOMContentLoaded', function() {
    window.authSystem = new AuthSystem();
});