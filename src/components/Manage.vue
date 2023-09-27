<template>
  <div v-if="renderComponent == true && loaded == true && user">
    <section v-if="user.approved == false && user">
      You must first be approved to view application
    </section>
    <section v-if="user.approved == true && user">
      <v-container class="mt-0">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-card style="text-align:center" elevation="0" class="pb-3">
              <h3
                style="font-size:1.5em;margin:auto;padding-top:.5em"
                class="font-weight-light"
              >
                Initiatives
              </h3>
              <v-icon x-large style="font-size:3em;">mdi-flag-checkered</v-icon>
              <v-card-text>
                Initiatives are collections of Epics that drive toward a common
                goal or purpose.
              </v-card-text>
              <v-card-actions>
                <div style="margin:auto">
                  <v-btn
                    color="primary"
                    dark
                    large
                    @click="
                      formMode = 'Initiative'
                      dialog = true
                    "
                    >Manage </v-btn
                  ><br />
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-card style="text-align:center" elevation="0" class="pb-3">
              <h3
                style="font-size:1.5em;margin:auto;padding-top:.5em"
                class="font-weight-light"
              >
                Epics
              </h3>
              <v-icon x-large style="font-size:3em;"
                >mdi-notebook-multiple</v-icon
              >
              <v-card-text>
                Epics are large bodies of work that make up an Initiative and
                are broken down into issues (tickets).
              </v-card-text>
              <v-card-actions>
                <div style="margin:auto">
                  <v-btn
                    color="primary"
                    dark
                    large
                    @click="
                      formMode = 'Epic'
                      dialog = true
                    "
                    >Manage </v-btn
                  ><br />
                </div>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-card style="text-align:center" elevation="0" class="pb-3">
              <h3
                style="font-size:1.5em;margin:auto;padding-top:.5em"
                class="font-weight-light"
              >
                Teams
              </h3>
              <v-icon x-large style="font-size:3em;">mdi-account-group</v-icon>
              <v-card-text>
                Teams are made up of users such as Managers, Business Analysts,
                Engineers, etc.
              </v-card-text>
              <v-card-actions>
                <div style="margin:auto">
                  <v-btn
                    color="primary"
                    dark
                    large
                    @click="
                      formMode = 'Team'
                      dialog = true
                    "
                    >Manage </v-btn
                  ><br />
                </div>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="6">
            <v-card style="text-align:center" elevation="0" class="pb-3">
              <h3
                style="font-size:1.5em;margin:auto;padding-top:.5em"
                class="font-weight-light"
              >
                Sprints
              </h3>
              <v-icon x-large style="font-size:3em;">mdi-shoe-sneaker</v-icon>
              <v-card-text>
                A Sprint is a short, time-boxed period when a scrum team works
                to complete a set amount of work.
              </v-card-text>
              <v-card-actions>
                <div style="margin:auto">
                  <v-btn
                    color="primary"
                    dark
                    large
                    @click="
                      formMode = 'Sprint'
                      dialog = true
                    "
                    >Manage </v-btn
                  ><br />
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog
          v-model="dialog"
          persistent
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card elevation="0" style="border:none;border-radius:0px">
            <v-toolbar dark color="primary" elevation="0">
              <v-icon x-large v-if="formMode == 'Team'"
                >mdi-account-group</v-icon
              >
              <v-icon v-if="formMode == 'Initiative'" x-large
                >mdi-flag-checkered</v-icon
              >

              <v-icon v-if="formMode == 'Epic'" x-large
                >mdi-notebook-multiple</v-icon
              >
              <h2 class="ml-4 font-weight-light">{{ formMode }}s</h2>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  dark
                  text
                  @click="
                    dialog = false
                    formMode = null
                  "
                >
                  <v-icon large>mdi-close</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <Teams :formMode="formMode" v-if="formMode == 'Team'"></Teams>
            <Initiatives
              :formMode="formMode"
              v-if="formMode == 'Initiative'"
            ></Initiatives>
            <Epics :formMode="formMode" v-if="formMode == 'Epic'"></Epics>
            <Sprints :formMode="formMode" v-if="formMode == 'Sprint'"></Sprints>
          </v-card>
        </v-dialog>
      </v-container>
      <br />
    </section>
  </div>
</template>

<script>
import store from '@/store/index'
import Teams from '@/components/Teams'
import Initiatives from '@/components/Initiatives'
import Epics from '@/components/Epics'
import Sprints from '@/components/Sprints'
export default {
  name: 'Manage',
  components: { Teams, Initiatives, Epics, Sprints },
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
