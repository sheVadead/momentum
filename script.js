const momentumObject = {
  classes: {
    time: document.querySelector('time'),
    greeting: document.querySelector('.greeting'),
    name: document.querySelector('.name'),
    focusQuestion: document.querySelector('.focus-question'),
    focus: document.querySelector('#focus'),
    day: document.querySelector('.day'),
    month: document.querySelector('.month'),
    wrapper: document.querySelector('.wrapper'),
    searchTown: document.querySelector('.search-box'),
    city: document.querySelector('.city'),
    temp: document.querySelector('.temp'),
    weatherIcon: document.querySelector('.weather-icon'),
    weatherDesc: document.querySelector('.weather'),
    backgroundWrap: document.querySelector('.background-wrapper'),
    weatherPop: document.querySelector('.app-wrap'),
    wind: document.querySelector('.wind-speed'),
    humidityInfo: document.querySelector('.humidity-info'),
    textQuote: document.querySelector('.text'),
    author: document.querySelector('.author'),
    reloadBtn: document.querySelector('.btn'),
    qotd: document.querySelector('.quote-of-the-day'),
    focusQuestion: document.querySelector('.focus-question'),
    searchBox: document.querySelector('.search-box'),
    headerWeather: document.querySelector('header'),
    errorText: document.querySelector('.error-text'),
    hiddenHour: document.querySelector('.hidden-time'),
    imgArray: ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
    i: 0,
    bodyImg: document.body.style.backgroundImage,
    timePeriod: '',
    index: 0,
    listOfImages: [],
    hourForBack: new Date().getSeconds(),
    tenMinutes: 60000,
    oneMinute: 1000,
    mainCont: document.querySelector('main'),

  },
  addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
  },
  startTime() {
    const data = new Date();
    const hours = data.getHours();
    const minutes = data.getMinutes();
    const sec = data.getSeconds();

    momentumObject.classes.time.innerHTML = `${hours}<span>:</span>${momentumObject.addZero(minutes)}<span>:</span>${momentumObject.addZero(sec)}`;
  },
  startDay() {
    const data = new Date();
    this.classes.month.innerHTML = data.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  getWeatherData(city) {
    const promise = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=0e4043b05d572b6ae940f8ae8e46eac8&units=metric`);
    promise.then((response) => response.json()).then((weatherData) => {
      this.configureWeather(weatherData);
      this.setWeather(weatherData);
      this.focusHandler();
    }).catch(() => {
      if (momentumObject.classes.searchBox.value == '') {
        momentumObject.classes.errorText.textContent = 'Вы не ввели название города!';
        momentumObject.classes.errorText.classList.add('error');
        momentumObject.classes.searchBox.classList.add('tremor');
        momentumObject.classes.searchBox.style.borderColor = 'red';
      } else {
        momentumObject.classes.errorText.textContent = 'Такого города не существует!';
        momentumObject.classes.errorText.classList.add('error');
        momentumObject.classes.searchBox.classList.add('tremor');
        momentumObject.classes.searchBox.style.borderColor = 'red';
      }

      this.hideError();
    });
  },
  findCity() {
    momentumObject.classes.searchTown.addEventListener('keypress', (e) => {
      if (e.keyCode == 13) {
        this.getWeatherData(momentumObject.classes.searchTown.value);
      }
    });
    momentumObject.classes.searchTown.addEventListener('focus', () => {
      momentumObject.classes.searchTown.placeholder = '';
    });
    momentumObject.classes.searchTown.addEventListener('blur', () => {
      momentumObject.classes.searchTown.placeholder = 'Search for a city...';
    });
  },
  configureWeather(weatherData) {
    localStorage.setItem('city', `${weatherData.name}, ${weatherData.sys.country}`);
    localStorage.setItem('temp', `${weatherData.main.temp.toFixed(0)}<span>°c</span>`);
    localStorage.setItem('weather', weatherData.weather[0].description);
    localStorage.setItem('wind', `${weatherData.wind.speed}м/c`);
    localStorage.setItem('humidityInfo', `${weatherData.main.humidity}%`);
    localStorage.setItem('icon', `owf-${weatherData.weather[0].id}`);
  },
  getQuote() {
    const url = 'https://favqs.com/api/qotd';
    fetch(url).then((response) => response.json()).then((quoteData) => {
      momentumObject.classes.textQuote.textContent = ` \"${quoteData.quote.body}\"`;
      momentumObject.classes.author.textContent = quoteData.quote.author;
    });
    momentumObject.classes.qotd.addEventListener('click', this.getQuote);
  },
  reloadBackground() {
    let iter = new Date().getHours();
    momentumObject.classes.reloadBtn.addEventListener('click', () => {
      ++iter;
      if (iter > 23) {
        iter = 0;
      }
      const src = momentumObject.classes.listOfImages.flat()[iter];
      const img = document.createElement('img');
      img.src = src;
      document.body.style.backgroundImage = `url(${momentumObject.classes.listOfImages.flat()[iter]})`;
      momentumObject.classes.reloadBtn.disabled = true;
      setTimeout(() => {
        momentumObject.classes.reloadBtn.disabled = false;
      }, 2500);
    });
  },
  getName(e) {
    if (localStorage.getItem('name') === null) {
      momentumObject.classes.name.textContent = '[Enter your name]';
    } else {
      momentumObject.classes.name.textContent = localStorage.getItem('name');
    }
  },
  getFocus(e) {
    if (localStorage.getItem('focus') === null) {
      momentumObject.classes.focus.textContent = '[What in focus today?]';
    } else {
      momentumObject.classes.focus.textContent = localStorage.getItem('focus');
    }
  },
  setName(e) {
    if (e.which == 13 || e.keyCode == 13) {
      if (momentumObject.classes.name.innerText == '' || momentumObject.classes.name.innerText.trim() == '') {
        momentumObject.classes.name.innerText = localStorage.getItem('name') || '[Enter your name]';
        momentumObject.classes.name.blur();
      } else {
        localStorage.setItem('name', momentumObject.classes.name.innerText);
        momentumObject.classes.name.innerText = localStorage.getItem('name');
        momentumObject.classes.name.blur();
      }
    }
  },
  setFocus(e) {
    if (e.which == 13 || e.keyCode == 13) {
      if (momentumObject.classes.focus.innerText == '' || momentumObject.classes.focus.innerText.trim() == '') {
        momentumObject.classes.focus.innerText = localStorage.getItem('focus') || '[What is in focus today?]';
        momentumObject.classes.focus.blur();
      } else {
        localStorage.setItem('focus', momentumObject.classes.focus.innerText);
        momentumObject.classes.focus.innerText = localStorage.getItem('focus');
        momentumObject.classes.focus.blur();
      }
    }
  },
  setWeather(weatherData) {
    momentumObject.classes.weatherIcon.className = 'weather-icon owf';
    momentumObject.classes.temp.innerHTML = `${weatherData.main.temp.toFixed(0)}<span>°c</span>`;
    momentumObject.classes.weatherIcon.classList.add(`owf-${weatherData.weather[0].id}`);
    momentumObject.classes.weatherDesc.textContent = weatherData.weather[0].description;
    momentumObject.classes.wind.textContent = `${weatherData.wind.speed}м/c`;
    momentumObject.classes.humidityInfo.textContent = `${weatherData.main.humidity}%`;
    momentumObject.classes.city.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  },

  getLocalWeather() {
    if (localStorage.getItem('temp')) {
      momentumObject.classes.temp.innerHTML = localStorage.getItem('temp');
      momentumObject.classes.city.innerHTML = localStorage.getItem('city');
      momentumObject.classes.weatherDesc.innerHTML = localStorage.getItem('weather');
      momentumObject.classes.humidityInfo.innerHTML = localStorage.getItem('humidityInfo');
      momentumObject.classes.wind.innerHTML = localStorage.getItem('wind');
      momentumObject.classes.weatherIcon.classList.add(localStorage.getItem('icon'));
    }
  },
  setAll() {
    momentumObject.classes.name.addEventListener('keypress', this.setName);
    momentumObject.classes.name.addEventListener('blur', () => {
      momentumObject.classes.name.textContent = localStorage.getItem('name') || '[Enter your name]';
    });
    momentumObject.classes.focus.addEventListener('keypress', this.setFocus);
    momentumObject.classes.focus.addEventListener('blur', () => {
      momentumObject.classes.focus.textContent = localStorage.getItem('focus') || '[What is in focus today?]';
    });
  },
  focusHandler() {
    momentumObject.classes.name.addEventListener('click', () => {
      momentumObject.classes.name.innerHTML = '';
    });
    momentumObject.classes.focus.addEventListener('click', () => {
      momentumObject.classes.focus.textContent = '';
    });
  },
  hideError() {
    setTimeout(() => {
      setTimeout(() => {
        momentumObject.classes.searchBox.classList.remove('tremor');
        momentumObject.classes.errorText.classList.remove('error');
        momentumObject.classes.searchBox.style.borderColor = '';
        momentumObject.classes.errorText.textContent = '';
      }, 2000);
    });
  },
  getRandomInt() {
    return Math.floor(Math.random() * momentumObject.classes.imgArray.length);
  },
  getRandomNumbers() {
    const period = ['night', 'morning', 'day', 'evening'];
    const set = new Set();
    period.map((item) => {
      while (set.size < 6) {
        const random = momentumObject.getRandomInt();
        set.add(`assets/images/${item}/${momentumObject.classes.imgArray[random]}`);
      }
      momentumObject.classes.listOfImages.push(Array.from(set));
      set.clear();
    });
  },
  setRandomBackground() {
    const hour = new Date().getHours();

    document.body.style.backgroundImage = `url(${momentumObject.classes.listOfImages.flat()[hour]}`;
  },
  intervalHandler() {
    const d = new Date();
    const h = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + 1, 0, 0, 0);
    const e = (h - d) + 1000;
    const hours = d.getHours();
    if (hours < 6) {
      momentumObject.classes.timePeriod = 'night';
      momentumObject.classes.greeting.textContent = 'Good night,   ';
    } else if (hours < 12) {
      momentumObject.classes.timePeriod = 'morning';
      momentumObject.classes.greeting.innerText = 'Good morning, ';
    } else if (hours < 18) {
      momentumObject.classes.timePeriod = 'day';
      momentumObject.classes.greeting.textContent = 'Good day, ';
    } else {
      momentumObject.classes.timePeriod = 'evening';
      momentumObject.classes.greeting.textContent = 'Good evening, ';
    }
    if (e > 100) {
      setTimeout(() => {
        this.setRandomBackground();
        const hour = new Date().getHours();
        if (hour < 6) {
          momentumObject.classes.timePeriod = 'night';
          momentumObject.classes.greeting.textContent = 'Good night,   ';
        } else if (hour < 12) {
          momentumObject.classes.timePeriod = 'morning';
          momentumObject.classes.greeting.textContent = 'Good morning, ';
        } else if (hour < 18) {
          momentumObject.classes.timePeriod = 'day';
          momentumObject.classes.greeting.textContent = 'Good day, ';
        } else {
          momentumObject.classes.timePeriod = 'evening';
          momentumObject.classes.greeting.textContent = 'Good evening, ';
        }
      }, e);
    }
  },
  init() {
    const timerId = setInterval(this.startTime, 1000);
    this.startDay();
    this.findCity();
    this.getQuote();
    this.getFocus();
    this.getName();
    this.setAll();
    this.getLocalWeather();
    this.focusHandler();
    this.getRandomNumbers();
    this.setRandomBackground();
    this.reloadBackground();
    this.intervalHandler();
    setInterval(momentumObject.intervalHandler, 3600000);
  },
};

momentumObject.init();

console.log('Массив изображений для бека. При нажатии на кнопку следующего изображения, они меняются по этому массиву');

console.log(momentumObject.classes.listOfImages.flat());
