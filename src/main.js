import Vue from 'vue'
import App from './App.vue'

import './plugins/element.js'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import Vue2OrgTree from 'vue2-org-tree'

Vue.use(Vue2OrgTree)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
