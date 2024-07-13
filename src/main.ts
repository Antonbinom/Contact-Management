import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

createApp(App)
  // глобально регестрируем наше хранилище
  .provide('store', store)
  // Пользовательская директива фильтрующая все символы кроме цифр
  .directive('number', (el) => {
    el.value = el.value.replace(/[^0-9]/g, '');
  })
  .mount('#app');
