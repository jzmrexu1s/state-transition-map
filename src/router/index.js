import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/draw',
    component: Home,
    children: [
      {
        path: '/draw',
        component: () => import('@/components/Draw')
      },
      {
        path: '/settings',
        component: () => import('@/components/Settings')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
