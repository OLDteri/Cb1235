// Навигация по документации
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.docs-nav-link');
    const sections = document.querySelectorAll('.docs-section');
    
    // Плавная прокрутка к разделам
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Убираем активный класс у всех ссылок
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');
            
            // Плавная прокрутка
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Подсветка активного раздела при скролле
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});