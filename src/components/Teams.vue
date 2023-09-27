<template>
  <div>
    <v-row class="ma-5">
      <v-snackbar
        v-model="snackbar"
        color="dark"
        :timeout="3000"
        elevation="24"
        centered
      >
        {{ snackbarContent }}
      </v-snackbar>
      <v-col cols="12" sm="6" md="6">
        <!-- CREATION -->
        <div class="creationEditing">
          <v-card class="mx-auto mt-0 creation" elevation="0">
            <v-card-title>
              <span class="text-h5">Create {{ formMode }}</span>
            </v-card-title>

            <!-- CREATE -->
            <v-container style="margin-top: -1em;">
              <v-row class="mt-0">
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    dense
                    label="Team Name"
                    required
                    v-model="teamName"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="approvedUsers"
                    item-text="name"
                    item-value="uid"
                    label="Team Members"
                    multiple
                    required
                    v-model="teamMembers"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions>
              <v-btn
                color="blue darken-1 white--text"
                large
                @click="clearFields"
              >
                Cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1 white--text"
                large
                @click="createItem()"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
          <!-- EDITING -->
          <v-card class="mx-auto mt-8 creation" elevation="0">
            <v-card-title>
              <span class="text-h5">Edit {{ formMode }}</span>
            </v-card-title>
            <v-card-text>
              <!-- EDITING BEGIN-->
              <v-container style="margin-top: -1em;">
                <v-row class="mt-0" v-if="selectedItem !== null">
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      outlined
                      dense
                      label="Team Name"
                      required
                      v-model="editTeamName"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="approvedUsers"
                      item-text="name"
                      item-value="uid"
                      label="Team Members"
                      multiple
                      required
                      v-model="editTeamMembers"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row class="mt-0" v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      outlined
                      dense
                      label="Team Name"
                      required
                      disabled
                      v-model="editTeamName"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="approvedUsers"
                      disabled
                      item-text="name"
                      item-value="uid"
                      label="Team Members"
                      multiple
                      required
                      v-model="editTeamMembers"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <!-- EDITING END -->
            </v-card-text>
            <v-card-actions v-if="selectedItem !== null">
              <v-btn
                color="blue darken-1 white--text"
                large
                @click="selectItem(null)"
              >
                Cancel
              </v-btn>
              <v-btn
                color="red darken-1 white--text"
                large
                @click="deleteItem()"
              >
                Delete
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn
                color="green darken-1 white--text"
                large
                @click="updateItem()"
              >
                Update
              </v-btn>
            </v-card-actions>
            <v-card-actions v-if="selectedItem == null">
              <v-btn color="blue darken-1 white--text" large disabled>
                Cancel
              </v-btn>
              <v-btn color="red darken-1 white--text" large disabled>
                Delete
              </v-btn>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1 white--text" large disabled>
                Update
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" sm="12" md="6" lg="6">
        <v-card class="mx-auto mt-0 listings" elevation="0">
          <v-card-title>
            <span class="text-h5 mt-n8">{{ formMode }}s</span>
          </v-card-title>

          <div v-if="formMode == 'Team'">
            <v-list flat>
              <v-list-item-group v-model="listSelect" color="indigo">
                <v-list-item
                  class="listItem"
                  v-for="(item, i) in teams"
                  :key="i"
                  @click="selectItem(item)"
                >
                  <!--    <v-list-item-icon>
                    <v-icon x-large class="mt-2">mdi-account-group</v-icon>
                  </v-list-item-icon> -->

                  <v-list-item-content>
                    <v-col>
                      <h4>
                        Name:
                      </h4>
                      <p>{{ item.name }}</p>

                      <h4>
                        Members:
                      </h4>
                      <div
                        v-for="(member, i) in item.members"
                        :key="i"
                        class="mb-4"
                      >
                        {{
                          approvedUsers.filter(function(u) {
                            return u.uid == member
                          })[0].name
                        }}

                        ({{
                          approvedUsers.filter(function(u) {
                            return u.uid == member
                          })[0].role
                        }})<br />
                      </div>

                      <div
                        v-if="
                          stories.filter(function(u) {
                            return u.team == item.uid
                          }).length > 0
                        "
                      >
                        <h4>
                          Assigned Issues:
                        </h4>
                        <p
                          v-for="(story, index) in stories.filter(function(u) {
                            return u.team == item.uid
                          })"
                          :key="index"
                        >
                          {{ story.title }}
                        </p>
                      </div>
                    </v-col>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import store from '@/store/index'
export default {
  name: 'Teams',
  components: {},
  props: {
    formMode: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      teamName: null,
      teamMembers: [],
      editTeamName: null,
      editTeamMembers: [],
      listSelect: null,
      selectedItem: null,
      snackbar: false,
      snackbarContent: null
    }
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
    selectItem(item) {
      this.listSelect = item
      this.selectedItem = item
    },
    clearFields() {
      this.teamName = null
      this.teamMembers = []
    },
    updateItem() {
      if (this.editTeamName == null || this.editTeamMembers.length == 0) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }

      store.dispatch('teams/updateTeam', {
        name: this.editTeamName,
        members: this.editTeamMembers,
        uid: this.selectedItem.uid
      })
      this.clearFields()
      this.selectItem(null)
    },
    deleteItem() {
      const payload = { team: this.selectedItem, stories: this.stories }
      store.dispatch('teams/deleteTeam', payload)
      this.clearFields()
      this.selectItem(null)
    },
    createItem() {
      if (this.teamName == null || this.teamMembers.length == 0) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const team = {
        name: this.teamName,
        members: this.teamMembers
      }
      store.dispatch('teams/createTeam', team)
      this.clearFields()
      this.selectItem(null)
    }
  },
  watch: {
    formMode: {
      handler: function(val) {
        if (val == null) {
          this.clearFields()
          this.selectItem(null)
        }
      },
      deep: true,
      immediate: true
    },
    selectedItem: {
      handler: function(val) {
        if (val !== null) {
          this.editTeamName = val.name
          this.editTeamMembers = val.members
        } else {
          this.editTeamName = null
          this.editTeamMembers = []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
