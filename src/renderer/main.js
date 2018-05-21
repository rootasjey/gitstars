import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import apolloProvider from './graph-ql'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  provide: apolloProvider.provide(),
  template: '<App/>'
}).$mount('#app')
