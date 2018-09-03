// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueNotifications from 'vue-notifications';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import App from './App';
import router from './router';

// eslint-disable-next-line
function toast({ title, message, type, timeout, cb }) {
  if (type === VueNotifications.types.warn) {
    // eslint-disable-next-line
    type = 'warning';
  }
  return iziToast[type]({ title, message, timeout });
}

const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast,
};

Vue.use(VueNotifications, options);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
