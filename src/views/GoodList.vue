<template>
    <div>
      <!-- 头部 -->
      <nav-header></nav-header>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd @click="checkedPrice('all')"><a href="javascript:void(0)" :class="{'cur':priceCheck=='all'}" >All</a></dd>
                <dd v-for="(price,index) in priceFliter" @click="checkedPrice(index)">
                  <a :class="{'cur':priceCheck==index}" href="javascript:void(0)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>
            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="goods in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/' + goods.prodcutImg" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{goods.productName}}</div>
                      <div class="price">{{goods.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(goods.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
               </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="showFilterPop"></div>
      <!-- footer -->
      <nav-footer></nav-footer>
      <!-- modal模态框 -->
      <modal :mdShow="mdShow" v-on:close="closeModal()" >
        <p slot='message'>
          请先登录，否则无法加入到购物车
        </p>
        <div slot="btnGroup">
           <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
      </modal>

      <modal :mdShow="mdShowCart" v-on:close="closeModal()" >
        <p slot='message'>
         <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成!</span>
        </p>
        <div slot="btnGroup">
           <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
    </div>
</template>
<script>
  import '../assets/css/product.css'
  import NavFooter from '../components/Footer.vue'
  import NavHeader from '../components/Header.vue'
  import NavBread from '../components/NavBread.vue'
  import Modal from '../components/Modal.vue'
  import axios from 'axios'
  export default {
    data () {
      return {
        goodsList: [],
        page: 1,
        sortFlag: true,
        pageSize: 8,
        busy: true, // true 禁用 false不禁用
        loading: false,
        mdShow: false,
        mdShowCart: false,
        priceFliter: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          }
        ],
        priceCheck: 'all',
        filterBy: false,
        overLayFlag: false
      }
    },
    components: {
      NavBread,
      NavHeader,
      NavFooter,
      Modal
    },
    mounted () {
      this.getGoodsList()
    },
    methods: {
      // 商品加载
      getGoodsList (flag) {
        // 参数
        var param = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceCheck
        }
        this.loading = true
        axios.get('/goods/list', {
          params: param
        }).then((response) => {
          var res = response.data
          this.loading = false
          if (res.status === '0') {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list)
              if (res.result.count < 8) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goodsList = res.result.list
              this.busy = false
            }
          } else {
            this.goodsList = []
          }
        })
      },
      // 加载更多
      loadMore () {
        this.busy = true
        setTimeout(() => {
          this.page++
          this.getGoodsList(true)
        }, 500)
      },
      // 加入购物车
      addCart (productId) {
        axios.post('/goods/addCart', {
          productId: productId
        }).then((res) => {
          console.log(res)
          if (res.data.status === '0') {
            this.mdShowCart = true
          } else {
            this.mdShow = true
          }
        })
      },
      // 升序降序
      sortGoods () {
        this.sortFlag = !this.sortFlag
        this.page = 1
        this.getGoodsList()
      },
      // 选择价格区间
      checkedPrice (flag) {
        this.priceCheck = flag
        this.page = 1
        this.getGoodsList()
        this.closePop()
      },
      showFilterPop () {
        this.filterBy = !this.filterBy
        this.overLayFlag = !this.overLayFlag
      },
      closePop () {
        this.filterBy = false
        this.overLayFlag = false
      },
      closeModal () {
        this.mdShow = false
        this.mdShowCart = false
      }
    }
  }
</script>
