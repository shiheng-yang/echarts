import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
// 导入进度条动画
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

const routes = [
  {
    path: '/SignIn',
    component: () => import('@/views/Login/SignIn.vue'),
  },
  {
    path: '/echarts',
    component: () => import('../views/echarts.vue'),
  },
  {
    path: '/echarts1',
    component: () => import('../views/echarts1.vue'),
  },
  {
    path: '/echarts2',
    component: () => import('../views/echarts2.vue'),
  },
  {
    path: '/echarts3',
    component: () => import('../views/echarts3.vue'),
  },
  {
    path: '/echarts4',
    component: () => import('../views/echarts4.vue'),
  },
  {
    path: '/echarts5',
    component: () => import('../views/echarts5.vue'),
  },
  {
    path: '/echarts6',
    component: () => import('../views/echarts6.vue'),
  },
]

const router = new VueRouter({
  routes,
  mode: 'hash',
})

router.beforeEach((to, from, next) => {
  // 提示的进度条
  NProgress.inc(0.2)
  NProgress.configure({ easing: 'ease', speed: 700, showSpinner: false })
  if (to.path == '/SignIn') {
    //去登录页
    if (store.state.user) {
      //是否已登录
      Vue.prototype.$message.success('您已登录')
      NProgress.done()
      next(false)
      return false
    } else {
      next()
    }
  } else {
    //去非登录页
    if (store.state.user) {
      //是否已登录
      next()
    } else {
      NProgress.done() //结束进度条
      next({ path: '/SignIn' })
    }
  }
})

router.afterEach(() => {
  NProgress.done() //结束进度条
})

export default router
