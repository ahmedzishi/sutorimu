<template>
  <div v-if="renderComponent == true && loaded == true && user">
    <section v-if="user.approved == false && user">
      You must first be approved to view application
    </section>
    <section v-if="user.approved == true && user">
      <div class="mx-auto mt-8" v-if="authUser">
        <v-row>
          <v-col>
            <v-card class="pa-5" v-if="renderComponent"> <BarChart /> </v-card>
          </v-col>
          <v-col>
            <v-card class="pa-5" v-if="renderComponent"> <LineChart /> </v-card
          ></v-col>
          <v-col>
            <v-card class="pa-5" v-if="renderComponent"> <PieChart /> </v-card
          ></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card class="pa-5" v-if="renderComponent">
              <DoughnutChart /> </v-card
          ></v-col>

          <v-col>
            <v-card class="pa-5" v-if="renderComponent">
              <HorizontalBarChart /> </v-card
          ></v-col>
        </v-row>
      </div>
    </section>
  </div>
</template>

<script>
import store from '@/store/index'
import Teams from '@/components/Teams'
import Initiatives from '@/components/Initiatives'
import Epics from '@/components/Epics'
import Tickets from '@/components/Tickets'
import BarChart from '@/components/BarChart.vue'
import PieChart from '@/components/PieChart.vue'
import LineChart from '@/components/LineChart.vue'
import DoughnutChart from '@/components/DoughnutChart.vue'
import HorizontalBarChart from '@/components/HorizontalBarChart.vue'

export default {
  name: 'Home',
  components: {
    Teams,
    Initiatives,
    Epics,
    Tickets,
    BarChart,
    PieChart,
    LineChart,
    DoughnutChart,
    HorizontalBarChart
  },
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
