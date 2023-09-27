<template>
  <section v-if="renderComponent == true && loaded == true && authUser">
    <v-card
      class="mx-auto mt-8"
      max-width="400"
      outlined
      style="border:none;"
      v-if="authUser"
    >
      <v-row style="text-align:center;margin-left:1em">
        <v-list-item three-line>
          <v-list-item-content style="margin-left: -40px;margin-bottom:1em">
            <div class="text-overline mb-4">EMAIL: {{ authUser.email }}</div>
            <v-list-item-title class="text-h5 mb-1">
              {{ authUser.displayName }}
            </v-list-item-title>
            <v-list-item-subtitle v-if="authUser.metadata"
              >Last Login:
              {{ authUser.metadata.lastSignInTime }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-row>
      <b v-if="user">
        <br />
        <center v-if="user.approved == false">
          <v-row style="margin-left:-2em">
            <v-col>Access:</v-col>
            <v-col>Denied</v-col>
          </v-row>
        </center>
        <center v-if="user.approved == true">
          <v-row style="margin-left:-2em">
            <v-col>Access:</v-col>
            <v-col>Granted</v-col>
          </v-row>
          <v-row style="margin-left:-2em">
            <v-col>Position:</v-col>
            <v-col>{{ user.role }}</v-col>
          </v-row>
          <br />
          <v-container class="px-10"
            ><v-select
              outlined
              dense
              :items="roles"
              label="Position"
              v-model="role"
              @change="updateRole(role)"
            ></v-select
          ></v-container>
        </center>
        <br />
      </b>
    </v-card>

    <v-row v-if="user.approved == false" class="mt-8">
      <v-alert prominent style="width:100%" color="error">
        <v-row align="center">
          <v-col class="grow" style="color:#fff">
            Welcome to Sutorīmu, please note that you must first have access to
            view the content.
          </v-col>
        </v-row>
      </v-alert>
    </v-row>
  </section>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'Profile',
  data() {
    return {
      renderComponent: true,
      loaded: false,
      dialog: false,
      role: null,
      roles: [
        'Product Manager',
        'Business Analyst',
        'Architect',
        'Front End Engineer',
        'Back End Engineer',
        'Database Admin',
        'Web Designer',
        'CTO',
        'CFO',
        'CEO',
        'COO',
        'Other'
      ]
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
    },
    updateRole(role) {
      store.dispatch('users/updateRole', role)
    }
  }
}
</script>
