// Чат-помощник с простой нейросетью
document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    let isChatOpen = false;
    
    // База знаний для чата
    const knowledgeBase = {
        greetings: ['привет', 'здравствуйте', 'добрый день', 'hello', 'hi'],
        farewells: ['пока', 'до свидания', 'спасибо', 'thanks'],
        questions: {
            'доставк': 'Доставка осуществляется за 1-3 дня. Стоимость: 500 ₽, бесплатно при заказе от 50 000 ₽.',
            'гаранти': 'Гарантия на ноутбуки - 24 месяца. Бесплатное обслуживание в течение гарантийного периода.',
            'возврат': 'Возврат товара возможен в течение 14 дней при сохранении товарного вида.',
            'оплат': 'Мы принимаем банковские карты, электронные кошельки и предоставляем рассрочку.',
            'контакт': 'Наши контакты: +7 (999) 123-45-67, info@techstore.ru',
            'рассрочк': 'Предоставляем рассрочку 0% на 6 месяцев. Оформляется при покупке.',
            'акци': 'Специальные предложения и акции обновляются еженедельно. Следите за нашим сайтом!',
            'рабоч': 'Мы работаем Пн-Пт: 9:00-21:00, Сб-Вс: 10:00-20:00.',
            'каталог': 'Весь каталог ноутбуков доступен в разделе "Каталог". Там вы найдете подробные характеристики и цены.'
        },
        
        defaultAnswers: [
            'Извините, я еще учусь. Можете уточнить ваш вопрос?',
            'Пока я могу ответить на вопросы о доставке, гарантии, оплате и возврате товаров.',
            'Для получения подробной информации позвоните нам: +7 (999) 123-45-67',
            'Посмотрите раздел "Документация" - там есть подробная информация по всем вопросам.'
        ]
    };
    
    // Открытие/закрытие чата
    chatToggle.addEventListener('click', function() {
        isChatOpen = !isChatOpen;
        chatWindow.style.display = isChatOpen ? 'block' : 'none';
    });
    
    chatClose.addEventListener('click', function() {
        isChatOpen = false;
        chatWindow.style.display = 'none';
    });
    
    // Отправка сообщения
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Добавляем сообщение пользователя
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Имитация набора текста ботом
        setTimeout(() => {
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Добавление сообщения в чат
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Генерация ответа (простая "нейросеть")
    function generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Проверка приветствий
        if (knowledgeBase.greetings.some(greet => message.includes(greet))) {
            return 'Здравствуйте! Рад вас видеть. Чем могу помочь с выбором ноутбука?';
        }
        
        // Проверка прощаний
        if (knowledgeBase.farewells.some(farewell => message.includes(farewell))) {
            return 'Всего хорошего! Если возникнут вопросы - обращайтесь!';
        }
        
        // Поиск по ключевым словам
        for (const [keyword, answer] of Object.entries(knowledgeBase.questions)) {
            if (message.includes(keyword)) {
                return answer;
            }
        }
        
        // Случайный ответ по умолчанию
        const randomIndex = Math.floor(Math.random() * knowledgeBase.defaultAnswers.length);
        return knowledgeBase.defaultAnswers[randomIndex];
    }
});