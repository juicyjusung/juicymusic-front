import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@/styles/variables.scss';
import './plugins/axios';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Notifications from 'vue-notification';

Vue.config.productionTip = false;

Vue.use(Notifications);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
