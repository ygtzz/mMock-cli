import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';
import store from './vuex/store';
import './index.less';
import routes from './router.js';
import App from './app.vue';
import axios from 'axios';
import VModal from 'vue-js-modal';
import loading from 'vue-loading2';
import 'vue-loading2/dist/vue-loading.css';
import toast from 'vue-toast5';
import 'vue-toast5/dist/vue-toast.css';

Vue.use(VueRouter);
Vue.use(VModal);
Vue.use(loading);
Vue.use(toast);

const router = new VueRouter({
    mode:'hash',
    routes:routes
});

sync(store, router);

new Vue({
  router,
  el: '#app',
  store,
  render: h => h(App)
})
