import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Profile from '@/components/Profile'
import Board from '@/components/Board'
import InitEpics from '@/components/InitEpics'
import Refinement from '@/components/Refinement'
import Backlog from '@/components/Backlog'
import Manage from '@/components/Manage'
import firebase from 'firebase'

Vue.use(Router)

let router = new Router({
  mode: 'history',

  routes: [
    {
      path: '/board',
      name: 'Board',
      component: Board,
      meta: {
        auth: true
      }
    },
    {
      path: '/initEpics',
      name: 'InitEpics',
      component: InitEpics,
      meta: {
        auth: true
      }
    },
    {
      path: '/refinement',
      name: 'Refinement',
      component: Refinement,
      meta: {
        auth: true
      }
    },
    {
      path: '/backlog',
      name: 'Backlog',
      component: Backlog,
      meta: {
        auth: true
      }
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      meta: {
        auth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        auth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        auth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else if (to.matched.some(record => record.meta.guest)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next({
          path: '/'
        })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
