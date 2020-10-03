import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import Elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './plugins/element'
import './assets/fonts/iconfont.css'
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.config.productionTip = false

const commerce = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
