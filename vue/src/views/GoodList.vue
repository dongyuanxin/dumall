<template>
  <div>
    <!-- header样式有些问题，暂时不需要 -->
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">Goods</span>
      <!-- 利用插槽语法的复杂嵌套 -->
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <!--8:15 处有解析 -->
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}" @click="setPriceFilter('all')">All</a>
              </dd>
              <dd v-for="(item,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)"
                   v-bind:class="{'cur':priceChecked===index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>

            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <!-- <li v-for="(item,index) in goodsList"> -->

                <li v-for="item in goodsList">
                  <div class="pic">
                    <!--注意要使用单引号代表字符串，双引号里面是命令  -->
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    <!-- 图片懒加载 -->
                    <!-- <a href="#"><img v-bind:src="'static/'+item.prodcutImg" alt=""></a> -->
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>

              </ul>
            </div>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="800">
              <span v-show="!busy">加载中...</span>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal v-bind:mdShow="mdShow" @close="closeModal()">
      <p slot="message">
        请先登录，否则无法加入购物车
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow = false" href="javascript:void(0)">关闭</a>
      </div>
    </modal>
    <modal v-bind:mdShow="mdShowCart" @close="closeModal()">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>
          加入购物车成功
        </span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart = false" href="javascript:void(0)">继续购物</a>
        <router-link class="btn btn--m"  href="javascript:void(0)" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import "./../assets/css/base.css" // 引入css样式
  import "./../assets/css/product.css"
  import NavHeader from "@/components/NavHeader"
  import NavFooter from "@/components/NavFooter"
  import NavBread from "@/components/NavBread"
  import Modal from "@/components/Modal"
  import axios from "axios"

  export default {
    // 必须写成函数形式
    // 组件互不影响
    data() {
      return {
        goodsList: [], // 利用mounted钩子来进行ajax加载
        priceFilter: [
          {
            startPrice: "0",
            endPrice: "100"
          },
          {
            startPrice: "100",
            endPrice: "500"
          },
          {
            startPrice: "500",
            endPrice: "1000"
          },
          {
            startPrice: "1000",
            endPrice: "5000"
          }
        ],
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false,
        sortFlag: true,
        page:1,
        pageSize:8,
        busy:true,
        mdShow:false,
        mdShowCart:false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },
    mounted() {
      // 1. 只能有一个
      // 2. 实时监测
      // 3. 相关网址：https://segmentfault.com/a/1190000008570622
      this.getGoodList();
    },
    methods: {
      getGoodList(flag) {
        let param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        };
        axios.get("/goods",{
          params:param
        }).then((result) => {
          let res = result.data; // 获取返回数据
          if(res.status==='1') {
            if(flag) { // 需要累加，在原网页上实现瀑布流
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count<8) { // 已经是最后一页
                this.busy = true; // 禁用
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        })
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodList();
      },
      loadMore(){
        this.busy = true; // 先禁用
        // 一定要setTimeOut，否则滚动一次出发很多次，服务器压力过大
        setTimeout(() => {
          this.page++;
          this.getGoodList(true); // 需要累加
        },500);
      },
      showFilterPop() {
        this.filterBy = true;
        this.overLayFlag = true;
      },
      setPriceFilter(index) {
        this.page = 1;
        this.priceChecked = index;
        this.closePop();
        this.getGoodList();
      },
      closePop() {
        this.filterBy = false;
        this.overLayFlag = false;
      },
      addCart(productId) {
        axios.post("/goods/addCart",{
          productId:productId
        }).then((response) => {
          let res = response.data;
          if(res.status==="1") {
            this.mdShowCart = true;
            this.$store.commit('updateCartCount',1);
          } else {
            this.mdShow = true;
          }
        });
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      }
    }
  }
</script>
