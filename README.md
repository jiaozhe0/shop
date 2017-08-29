# shop

> vue2.0+node.js+mongoDB 全栈商城 慕课网

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
***
#前端 vue2 + vuex + vue-router + axios
## 计算属性

## vue插件
> [图片懒加载](https://github.com/hilongjw/vue-lazyload)
> [无限加载](https://github.com/ElemeFE/vue-infinite-scroll) 

## vuex
> vuex是一个专为Vue.js应用程序开发的状态管理模式，使用单一状态树，用一个对象包含了全部的应用层级状态，状态即数据，每个组件里的data都可以称之为状态，当多个页面或组件共用某些状态时，vuex就登场了
> vuex通过store选项，提供一种机制状态从根组件注入到每一个子组件中
### state
> state是唯一的数据源，是一个载体
> 单一状态树
> 由于vuex的状态储存是响应式的，从store实例中读取的状态最简单的方法就是在计算属性中返回某个状态
> 子组件通过 this.$store.state 获取状态树的数据
> mapState:当一个组件需要获取多个状态时，可以使用mapState辅助函数,mapState函数返回一个对象
```
mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
 ```

### mutation
> 更改vuex的store中的状态的唯一方法是提交mutation
> vuex中的mutations 非常类似于事件，每个mutation都有一个字符串的事件类型(type)和一个回调(handler),这个回调函数是我们实际进行状态更改的地方
> mutation 必须是同步函数
> 不能直接调用一个mutation handler , 要使用 store.commit(type)
> 提交载荷，即向store.commit传入额外的参数 ，载荷应该是一个对象
> 使用常量代替Mutation事件类型，把这些常量放在单独的文件中
> 组件中提交mutations
>> this.$store.commit('xxx')
>> 使用mapMutations辅助函数将组件中的methods映射为store.commit调用
``` methods: {
    ...mapMutations([
      'increment' // 映射 this.increment() 为 this.$store.commit('increment')
    ]),
    ...mapMutations({
      add: 'increment' // 映射 this.add() 为 this.$store.commit('increment')
    })
  }
```

### action
> action提交的是mutation，而不是直接变更状态
> action可以包含任意异步操作
>Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
> action 通过store.dispatch方法触发，store.dispatch('xxx')
```
// 以载荷形式分发
store.dispatch('imcrementAsync',{amount:10})
//以对象形式触发
store.dispatch({
	type: 'imcrementAsync',
	amount: 10
})
```
> 组件中提交action
>> this.$store.dispatch('xxx')
>> 使用mapActions辅助函数将组件的methods映射为store.dispatch调用
>store.dispatch 可以处理被触发的action的回调函数返回的Promise，并且store.dispatch仍旧返回Promise

### modules


## axios
> get请求传参 axios.get(url,{params:{}})

***
#服务端 express + mongodb + mongoose
> 开发模式使用[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)代理插件，跨域请求3000端口的数据
## express
> 全局安装 npm install express-gernerator
> 自动生成 express server
## mongodb
## mongoose
* 模式 Schema
> 一种以文件形式存储的数据库模型骨架，无法直接通往数据库端，也就是说它不具备对数据库的操作能力.可以说是数据属性模型(传统意义的表结构)，又或着是“集合”的模型骨架

* 模型 Model
* API 方法
> 






For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
