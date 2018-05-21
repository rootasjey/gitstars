// ~~~~~~
// router
// ~~~~~~

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/repository/:id',
      name: 'repository',
      component: require('@/components/Repository').default
    },
    {
      path: '/connection',
      name: 'connection',
      component: require('@/components/Connection').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
