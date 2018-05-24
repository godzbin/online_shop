import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import { Tabbar, TabItem } from 'mint-ui';
import App from './App.vue';
import store from './lib/store';
import router from './router';
import components from './components';
import './lib/rem';
import './assets/common/css/index.scss';

Vue.use(VueLazyload, {
  // error: 'dist/error.png',
  loading: 'loading.svg',
});

// mint-ui 组件，按需引入
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);

// 自定义组件
Vue.use(components);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
