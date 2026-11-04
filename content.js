/* Все данные для замены логотипа, изображений, описаний и ссылок — здесь.
   Изображения кладите в assets/. null означает: материал пока не добавлен.
   Пустые ссылки не превращаются в кнопки. Не используйте # вместо адреса сайта.
   Пример изображения: { src: "assets/yung-lean-desktop.webp", width: 1440,
     height: 960, alt: "Главная страница сайта о Yung Lean", full: "assets/yung-lean-desktop-full.webp" }
   full необязателен: увеличенный снимок для проектов без embedUrl.
   Если есть embedUrl, нажатие запускает действующий сайт в выбранном размере.
*/
window.PORTFOLIO = {
  brand: "vantak",
  ownerName: "Владислав Ящишен",
  logo: null, // Например: { src: "assets/logo.svg", width: 180, height: 54 }
  telegram: { handle: "@VANTAK_1", url: "https://t.me/VANTAK_1" },
  email: "vantakus@mail.ru",
  projects: [
    {
      id: "yung-lean",
      number: "01",
      title: "Yung Lean",
      category: "Фан-концепт / музыка",
      description: "Концепт сайта о европейском туре Yung Lean.",
      note: null,
      role: null,
      tasks: [],
      stack: "React · TypeScript · Vite",
      features: ["Интерактивное интро с книгой", "Карусель альбомов", "Адаптивный интерфейс"],
      desktop: {
        src: "assets/yung-lean-desktop.webp", width: 1425, height: 891,
        alt: "Компьютерная версия фан-концепта Yung Lean: крупный заголовок European Tour и групповая фотография",
        full: "assets/yung-lean-desktop-full.webp"
      },
      mobile: {
        src: "assets/yung-lean-mobile.webp", width: 375, height: 812,
        alt: "Мобильная версия сайта о Yung Lean: первый экран и начало коллекции альбомов"
      },
      embedUrl: "projects/yung-lean/index.html",
      liveUrl: null,
      codeUrl: null
    },
    {
      id: "soydemsya",
      number: "02",
      title: "Сойдёмся",
      category: "Веб-сервис / встречи",
      description: "Сервис, который помогает друзьям выбрать место встречи: собрать пожелания, подобрать варианты и проголосовать за общий план.",
      note: "Интерактивная демоверсия. Встречи и голоса сохраняются только в браузере посетителя.",
      role: null,
      tasks: [],
      stack: "React · TypeScript · Node.js · SQLite",
      features: ["Пожелания и бюджет участников", "Голосование за демоучастников", "Сохранение демоданных в браузере"],
      desktop: {
        src: "assets/soydemsya-desktop.webp", width: 1425, height: 891,
        alt: "Компьютерная версия «Сойдёмся»: заголовок «Меньше переписки. Больше встреч» и иллюстрация друзей за столом",
        full: "assets/soydemsya-desktop-full.webp"
      },
      mobile: {
        src: "assets/soydemsya-mobile.webp", width: 375, height: 812,
        alt: "Мобильная версия «Сойдёмся»: создание встречи и иллюстрация компании друзей",
        full: "assets/soydemsya-mobile-full.webp"
      },
      embedUrl: "projects/soidemsya/index.html",
      liveUrl: null,
      codeUrl: null
    }
  ]
};

