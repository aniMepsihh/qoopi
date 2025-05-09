document.getElementById('burgerBtn').addEventListener('click', function() {
    document.body.classList.toggle('menu-open');
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Функция активации секции
    function activateSection(targetId) {
        // Удаляем класс active у всех ссылок и фонов
        navLinks.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.bg-image').forEach(img => img.classList.remove('active'));
    
        // Добавляем класс active текущей ссылке и фону
        document.querySelector(`.nav-link[data-target="${targetId}"]`).classList.add('active');
        document.querySelector(`.bg-image[data-target="${targetId}"]`).classList.add('active');
    
        // Плавно скрываем все разделы
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
    
        // Получаем элементы карусели и медиа
        const carousel = document.querySelector('.section__carousel');
        const media = document.querySelector('.media-section');
        const carousel_brends = document.querySelector('.section__carousel-brends');
    
        // Функция для плавного скрытия с сохранением высоты
        function hideElement(element) {
            if (!element) return;
            element.style.opacity = '0';
            element.style.visibility = 'hidden';
        }
    
        // Функция для плавного показа
        function showElement(element) {
            if (!element) return;
            element.style.visibility = 'visible';
            element.style.opacity = '1';
        }
    
        // Скрываем карусель, если не главная
        if (targetId !== 'home') {
            if (carousel) {
                carousel.style.transition = 'opacity 0.5s ease';
                carousel.style.opacity = '0';
                setTimeout(() => {
                    carousel.style.display = 'none';
                }, 500); // совпадает с длительностью анимации
            }
        } else {
            if (carousel) {
                carousel.style.display = 'flex';
                carousel.offsetHeight; // принудительная перерисовка для запуска transition
                carousel.style.transition = 'opacity 0.5s ease';
                carousel.style.opacity = '1';
            }
        }
    
        // Скрываем медиа-секцию, если не блогеры
        if (targetId !== 'blogers') {
            if (media) {
                media.style.transition = 'opacity 0.5s ease';
                media.style.opacity = '0';
                setTimeout(() => {
                    media.style.display = 'none';
                }, 500);
            }
        } else {
            if (media) {
                media.style.display = 'flex';
                media.offsetHeight; // принудительная перерисовка
                media.style.transition = 'opacity 0.5s ease';
                media.style.opacity = '1';
            }
        }

        if (targetId !== 'brends') {
            if (carousel_brends) {
                carousel_brends.style.transition = 'opacity 0.5s ease';
                carousel_brends.style.opacity = '0';
                setTimeout(() => {
                    carousel_brends.style.display = 'none';
                }, 500); // совпадает с длительностью анимации
            }
        } else {
            if (carousel_brends) {
                carousel_brends.style.display = 'flex';
                carousel_brends.offsetHeight; // принудительная перерисовка для запуска transition
                carousel_brends.style.transition = 'opacity 0.5s ease';
                carousel_brends.style.opacity = '1';
            }
        }
    
        // Показываем целевой контент с задержкой
        setTimeout(() => {
            document.getElementById(targetId).classList.add('active');
        }, 300);
    }
    
    // Обработчики кликов для навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            activateSection(targetId);
            
            // Обновляем URL без перезагрузки страницы
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Проверяем хэш при загрузке страницы
    function checkInitialHash() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            activateSection(hash);
        } else {
            // По умолчанию активируем главную страницу
            activateSection('home');
        }
    }
    
    // Обработчик изменения хэша
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            activateSection(hash);
        }
    });
    
    // Инициализация при загрузке
    checkInitialHash();
});
  
  // Закрытие при клике вне окна
  document.getElementById('burgerBtn').addEventListener('click', function(e) {
    
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Инициализация каруселей с разной скоростью
    initCarousel('carousel1', 1.1); // Первая карусель со скоростью 1
    initCarousel('carousel2', 0.9); // Вторая карусель со скоростью 2
    
    function initCarousel(id, scrollSpeed) {
        const mediaStack = document.getElementById(id);
        const mediaItems = mediaStack.querySelectorAll('.media-item');
        let currentPosition = 0;
        
        // Вычисляем высоту всех элементов с отступами
        let totalHeight = 0;
        mediaItems.forEach(item => {
            const isVideo = item.querySelector('video') !== null;
            totalHeight += (isVideo ? 518 : 350) + 16;
        });
        
        // Клонируем элементы для бесшовности
        mediaItems.forEach(item => {
            const clone = item.cloneNode(true);
            mediaStack.appendChild(clone);
        });
        
        // Анимация прокрутки
        function animate() {
            currentPosition -= scrollSpeed;
            
            if (-currentPosition >= totalHeight) {
                currentPosition += totalHeight;
            }
            
            mediaStack.style.transform = `translateY(${currentPosition}px)`;
            requestAnimationFrame(animate);
        }
        
        // Ожидаем загрузки медиа
        const loadPromises = [];
        
        mediaStack.querySelectorAll('video').forEach(video => {
            loadPromises.push(new Promise(resolve => {
                if (video.readyState >= 3) resolve();
                else video.addEventListener('loadeddata', resolve);
            }));
        });
        
        mediaStack.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                loadPromises.push(Promise.resolve());
            } else {
                loadPromises.push(new Promise(resolve => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }));
            }
        });
        
        Promise.all(loadPromises).then(() => {
            requestAnimationFrame(animate);
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация каруселей с разной скоростью
    initCarousel('carousel-brends', 1.1); // Первая карусель со скоростью 1

    
    function initCarousel(id, scrollSpeed) {
        const mediaStack = document.getElementById(id);
        const mediaItems = mediaStack.querySelectorAll('.media-item');
        let currentPosition = 0;
        
        // Вычисляем высоту всех элементов с отступами
        let totalHeight = 0;
        mediaItems.forEach(item => {
            const isVideo = item.querySelector('video') !== null;
            totalHeight += (isVideo ? 518 : 350) + 16;
        });
        
        // Клонируем элементы для бесшовности
        mediaItems.forEach(item => {
            const clone = item.cloneNode(true);
            mediaStack.appendChild(clone);
        });
        
        // Анимация прокрутки
        function animate() {
            currentPosition -= scrollSpeed;
            
            if (-currentPosition >= totalHeight) {
                currentPosition += totalHeight;
            }
            
            mediaStack.style.transform = `translateY(${currentPosition}px)`;
            requestAnimationFrame(animate);
        }
        
        // Ожидаем загрузки медиа
        const loadPromises = [];
        
        mediaStack.querySelectorAll('video').forEach(video => {
            loadPromises.push(new Promise(resolve => {
                if (video.readyState >= 3) resolve();
                else video.addEventListener('loadeddata', resolve);
            }));
        });
        
        mediaStack.querySelectorAll('img').forEach(img => {
            if (img.complete) {
                loadPromises.push(Promise.resolve());
            } else {
                loadPromises.push(new Promise(resolve => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }));
            }
        });
        
        Promise.all(loadPromises).then(() => {
            requestAnimationFrame(animate);
        });
    }
});
