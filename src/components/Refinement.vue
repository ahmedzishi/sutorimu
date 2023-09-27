<template>
  <div v-if="renderComponent == true && loaded == true && user">
    <section v-if="user.approved == false && user">
      You must first be approved to view application
    </section>
    <section v-if="user.approved == true && user">
      <br /><TicketsRefinement></TicketsRefinement>
    </section>
  </div>
</template>

<script>
import store from '@/store/index'
import TicketsRefinement from '@/components/TicketsRefinement'
export default {
  name: 'Refinement',
  components: { TicketsRefinement },
  data() {
    return {
      renderComponent: true,
      loaded: false,
      dialog: false,
      formMode: null
    }
  },
  created() {
    store.dispatch('users/loadUser').then(res => {
      this.loaded = true
      store.dispatch('teams/listTeams')
      store.dispatch('users/listApprovedUsers')
      store.dispatch('initiatives/listInitiatives')
      store.dispatch('epics/listEpics')
      store.dispatch('stories/listStories')
      store.dispatch('sprints/listSprints')
    })
  },
  computed: {
    initiatives() {
      const initiatives = store.state.initiatives.initiatives || []
      return initiatives
    },
    epics() {
      const epics = store.state.epics.epics || []
      return epics
    },
    stories() {
      const stories = store.state.stories.stories || []
      return stories
    },
    sprints() {
      const sprints = store.state.sprints.sprints || []
      return sprints
    },
    teams() {
      const teams = store.state.teams.teams || []
      return teams
    },
    approvedUsers() {
      const approvedUsers = store.state.users.approvedUsers || []
      return approvedUsers
    },
    user() {
      const user = store.state.users.user || null
      return user
    },
    authUser() {
      const authUser = store.state.users.authUser || null
      return authUser
    }
  },
  methods: {
    forceRerender() {
      this.renderComponent = false
      this.$nextTick(() => {
        this.renderComponent = true
      })
    }
  }
}
</script>
