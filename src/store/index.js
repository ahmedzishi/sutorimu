import Vue from 'vue'
import Vuex from 'vuex'
import users from './users'
import epics from './epics'
import stories from './stories'
import initiatives from './initiatives'
import teams from './teams'
import sprints from './sprints'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    users,
    epics,
    teams,
    initiatives,
    stories,
    sprints
  }
})
