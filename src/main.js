// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router/router'
import './common/stylus/index.styl'
import store from './store'
import Vue2Filters from 'vue2-filters'

Vue.use(ElementUI)
Vue.use(Vue2Filters)
Vue.filter('timestampFormat', require('./filters/timestampFormatter'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
