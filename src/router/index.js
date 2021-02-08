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
        component: () => import('@/components/Draw'),
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/settings',
        component: () => import('@/components/Settings'),
        meta: {
          keepAlive: true
        }
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
