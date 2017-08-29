// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'
import './assets/css/base.css'
import Vuex from 'vuex'
// 定义全局价格过滤器
Vue.filter('currency', currency)

// 注册图片懒加载插件
Vue.use(VueLazyLoad, {
  loading: './static/loading-svg/loading-balls.svg'
})
// 注册无限加载插件
Vue.use(infiniteScroll)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    nickName: '',
    cartCount: 0
  },
  mutations: {
    updateUserInfo (state, nickName) {
      state.nickName = nickName
    },
    updateCartCount (state, count) {
      state.cartCount += count
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
