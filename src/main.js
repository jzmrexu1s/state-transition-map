import Vue from 'vue'
import App from './App.vue'

import './plugins/element.js'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'

Vue.use(SuperFlow)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
