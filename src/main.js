import Vue from 'vue'
import App from './App.vue'

// import './plugins/element.js'
import { Button, Select } from 'element-ui'
import router from './router'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Select)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
