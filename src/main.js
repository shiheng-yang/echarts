import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入echarts
import * as echarts from 'echarts'
// echarts挂载
Vue.prototype.$echarts = echarts
// element挂载
Vue.use(ElementUI)
// 严格模式
Vue.config.productionTip = false
// 事件中央总线
Vue.prototype.$bus = new Vue()
// 粒子背景
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
