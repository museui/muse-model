import Vue from 'vue';
import store from './models';
import App from './App';

const app = new Vue({
  ...App,
  store
});
app.$mount('#app');
