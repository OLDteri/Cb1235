// Функциональность личного кабинета
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser && window.location.pathname.includes('account.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Обновляем информацию пользователя
    if (currentUser) {
        const userNameElement = document.getElementById('user-name');
        const userEmailElement = document.getElementById('user-email');
        
        if (userNameElement) userNameElement.textContent = currentUser.name;
        if (userEmailElement) userEmailElement.textContent = currentUser.email;
    }

    // Навигация по вкладкам
    const navLinks = document.querySelectorAll('.account-nav a');
    const tabs = document.querySelectorAll('.account-tab');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Убираем активный класс у всех ссылок и вкладок
            navLinks.forEach(nav => nav.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Показываем соответствующую вкладку
            const targetId = this.getAttribute('href').substring(1);
            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Выход из аккаунта
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (window.authSystem) {
                window.authSystem.logout();
            }
        });
    }
});