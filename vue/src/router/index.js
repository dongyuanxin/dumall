import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodList from '@/views/GoodList'
import Cart from "@/views/Cart"
import Address from "@/views/Address"
import OrderConfirm from "@/views/OrderConfirm"
import OrderSuccess from "@/views/OrderSuccess"
Vue.use(Router);

export default new Router({
  //mode:"history",
  routes: [
    {
      path: '/',
      name: 'Home',
      component: GoodList
    },
    {
      path: '/goods',
      name: 'GoodList',
      component: GoodList
    },
    {
      path:"/cart",
      name:"Cart",
      component:Cart
    },
    {
      path:"/address",
      name:"Address",
      component:Address
    },
    {
      path:"/orderConfirm",
      name:"OrderConfirm",
      component:OrderConfirm
    },
    {
      path:"/orderSuccess",
      name:"OrderSuccess",
      component:OrderSuccess
    }
  ]
})
