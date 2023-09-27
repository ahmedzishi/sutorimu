import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import firebase from 'firebase'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENTID
}
firebase.initializeApp(firebaseConfig)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
