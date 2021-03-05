import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import '../common/style/index.js'
import bsLib from '../packages'


Vue.use(bsLib)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
