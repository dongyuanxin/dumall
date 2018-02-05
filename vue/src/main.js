// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from "vuex"
import App from './App'
import router from './router'
import VueLazyLoad from "vue-lazyload"
import infiniteScroll from "vue-infinite-scroll"
import {currency} from "./util/currency"

Vue.use(Vuex);

Vue.use(VueLazyLoad,{
  loading:"static/loading-svg/loading-bars.svg"
});

Vue.use(infiniteScroll);

Vue.config.productionTip = false;

// 全局过滤器
Vue.filter(
  "currency",currency
);

// 中大型项目要在 /src 下简历 /vuex 来实现
const store = new Vuex.Store({
  state:{
    nickName:"",//用户名
    cartCount:0 // 购物车数量
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount) {
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
var main = new Vue({
  el: '#app',
  router,
  store, // 注册vuex的store
  template: '<App/>',
  components:{
    App
  }
});
