import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vue2Editor from 'vue2-editor'

Vue.use(Vue2Editor)
Vue.use(Vuetify)

const opts = {
  theme: {
    dark: true
  }
}

export default new Vuetify(opts)
