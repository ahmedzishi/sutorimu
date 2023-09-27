<template>
  <section v-if="renderComponent == true && loaded == true">
    <section v-if="user.approved == false && user">
      You must first be approved to view application
    </section>
    <section v-if="user.approved == true && user">
      <div class="mx-auto mt-8">
        <h2 class="text-center font-weight-light mb-4">Sprint Ready</h2>
        <v-dialog v-model="dialog" max-width="500" dark>
          <v-card>
            <v-card-title class="text-h5">
              Assign&nbsp;
              <span v-if="selectedTicket">{{ selectedTicket.title }}</span
              >&nbsp;to:
            </v-card-title>

            <v-list dense>
              <h4 class="ml-6">Sprints</h4>
              <v-list-item-group color="primary" class="ml-3">
                <v-list-item v-for="(item, i) in sprints" :key="i">
                  <v-list-item-content @click="selectedSprint = item">
                    <v-list-item-title
                      style="font-size:1em"
                      v-text="item.startDate + '-' + item.endDate"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="error" @click="dialog = false">
                Cancel
              </v-btn>

              <v-btn
                color="primary"
                @click="
                  assignToSprint()
                  dialog = false
                "
              >
                Assign
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div
          style="cursor: pointer; "
          v-for="(element, index) in statusSprintReady"
          :key="element.uid"
        >
          <v-card
            class="mx-auto mt-2 mb-2"
            width="600px"
            height="auto"
            @click="
              selectedTicket = element
              dialog = true
            "
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="text-overline mb-4">
                  {{ element.startDate }} - {{ element.endDate }}
                </div>
                <v-list-item-title class="text-h5 mb-1">
                  {{ element.title }}
                </v-list-item-title>

                <span v-html="element.description"></span>
              </v-list-item-content>

              <v-list-item-avatar
                tile
                size="50"
                :color="'success'"
                style="border-radius: 50%!important;"
                v-if="element.type == 'Story'"
              >
                <v-icon color="white">mdi-book-outline</v-icon>
              </v-list-item-avatar>

              <v-list-item-avatar
                tile
                size="50"
                :color="'error'"
                style="border-radius: 50%!important;"
                v-if="element.type == 'Bug'"
              >
                <v-icon color="white">mdi-bug</v-icon>
              </v-list-item-avatar>

              <v-list-item-avatar
                tile
                size="50"
                :color="'warning'"
                style="border-radius: 50%!important;"
                v-if="element.type == 'Risk'"
                ><v-icon color="white">mdi-code-json</v-icon>
              </v-list-item-avatar>

              <v-list-item-avatar
                tile
                size="50"
                :color="'secondary'"
                style="border-radius: 50%!important;"
                v-if="element.type == 'Tech Debt'"
              >
                <v-icon color="white">mdi-file-code</v-icon>
              </v-list-item-avatar>
            </v-list-item>
          </v-card>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'Backlog',
  data() {
    return {
      renderComponent: true,
      loaded: false,
      dialog: false,
      selectedTicket: null,
      selectedSprint: null
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
    statusSprintReady() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Sprint Ready'
      })

      return stories
    },
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
    assignToSprint() {
      console.log(this.selectedSprint)
      if (this.selectedSprint.stories == null) {
        this.selectedSprint.stories = []
      }

      this.selectedSprint.stories.push(this.selectedTicket.uid)
      store.dispatch('sprints/updateSprint', {
        uid: this.selectedSprint.uid,
        created: this.selectedSprint.created,
        startDate: this.selectedSprint.startDate,
        endDate: this.selectedSprint.endDate,
        status: this.selectedSprint.status,
        stories: this.selectedSprint.stories
      })

      if (this.selectedTicket.comments) {
        store.dispatch('stories/updateStory', {
          title: this.selectedTicket.title,
          description: this.selectedTicket.description,
          created: this.selectedTicket.created,
          createdBy: this.selectedTicket.createdBy,
          startDate: this.selectedTicket.startDate,
          endDate: this.selectedTicket.endDate,
          uid: this.selectedTicket.uid,
          epic: this.selectedTicket.epic,
          label: this.selectedTicket.label,
          type: this.selectedTicket.type,
          status: 'To Do',
          team: this.selectedTicket.team,
          points: this.selectedTicket.points,
          comments: this.selectedTicket.comments
        })
      } else {
        store.dispatch('stories/updateStory', {
          title: this.selectedTicket.title,
          description: this.selectedTicket.description,
          created: this.selectedTicket.created,
          createdBy: this.selectedTicket.createdBy,
          startDate: this.selectedTicket.startDate,
          endDate: this.selectedTicket.endDate,
          uid: this.selectedTicket.uid,
          epic: this.selectedTicket.epic,
          label: this.selectedTicket.label,
          type: this.selectedTicket.type,
          status: 'To Do',
          team: this.selectedTicket.team,
          points: this.selectedTicket.points,
          comments: null
        })
      }
    },
    forceRerender() {
      this.renderComponent = false
      this.$nextTick(() => {
        this.renderComponent = true
      })
    }
  }
}
</script>
