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
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-menu
                    :close-on-content-click="false"
                    ref="menu"
                    v-model="startMenu"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="sprintStartDate"
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="sprintStartDate"
                      no-title
                      scrollable
                      @input="startMenu = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6">
                  <v-menu
                    :close-on-content-click="false"
                    ref="menu"
                    v-model="endMenu"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        dense
                        v-model="sprintEndDate"
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="sprintEndDate"
                      no-title
                      scrollable
                      @input="endMenu = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="['New', 'Active', 'Archived']"
                    label="Status"
                    required
                    v-model="sprintStatus"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="openSprintStories"
                    item-text="title"
                    item-value="uid"
                    label="Stories"
                    multiple
                    v-model="sprintStories"
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
                    <v-menu
                      :close-on-content-click="false"
                      ref="menu"
                      v-model="startMenuEdit"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          dense
                          v-model="editSprintStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editSprintStartDate"
                        no-title
                        scrollable
                        @input="startMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      :close-on-content-click="false"
                      ref="menu"
                      v-model="endMenuEdit"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          dense
                          v-model="editSprintEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editSprintEndDate"
                        no-title
                        scrollable
                        @input="endMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row v-if="selectedItem !== null">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="['New', 'Active', 'Archived']"
                      label="Status"
                      required
                      v-model="editSprintStatus"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="editingSprintStoriesArray"
                      item-text="title"
                      item-value="uid"
                      label="Stories"
                      multiple
                      v-model="editSprintStories"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row class="mt-0" v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      :close-on-content-click="false"
                      ref="menu"
                      disabled
                      v-model="startMenuEdit"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          dense
                          disabled
                          v-model="editSprintStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editSprintStartDate"
                        no-title
                        disabled
                        scrollable
                        @input="startMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      disabled
                      :close-on-content-click="false"
                      ref="menu"
                      v-model="endMenuEdit"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          disabled
                          outlined
                          dense
                          v-model="editSprintEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editSprintEndDate"
                        no-title
                        disabled
                        scrollable
                        @input="endMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      disabled
                      outlined
                      dense
                      :items="['New', 'Active', 'Archived']"
                      label="Status"
                      required
                      v-model="editSprintStatus"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      disabled
                      dense
                      item-text="text"
                      item-value="value"
                      :items="editingSprintStoriesArray"
                      label="Stories"
                      multiple
                      v-model="editSprintStories"
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

          <div v-if="formMode == 'Sprint'">
            <v-list flat>
              <v-list-item-group v-model="listSelect" color="indigo">
                <v-list-item
                  class="listItem"
                  v-for="(item, i) in sprints"
                  :key="i"
                  @click="selectItem(item)"
                >
                  <v-list-item-content>
                    <v-col>
                      <h4>
                        Start Date:
                      </h4>
                      <p>{{ item.startDate }}</p>

                      <h4>
                        End Date:
                      </h4>
                      <p>{{ item.endDate }}</p>
                      <h4>
                        Status:
                      </h4>
                      <p>{{ item.status }}</p>
                      <h4>
                        Stories:
                      </h4>

                      <div v-if="item.stories">
                        <p
                          v-for="(story, index) in stories.filter(function(u) {
                            return item.stories.includes(u.uid)
                          })"
                          :key="index"
                        >
                          <span>{{ story.title }}</span>
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
  name: 'Sprints',
  components: {},
  props: {
    formMode: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      sprintStartDate: null,
      sprintEndDate: null,
      sprintCreated: null,
      sprintStatus: null,
      editSprintStatus: null,
      sprintStories: [],
      editSprintStories: [],
      editSprintStartDate: null,
      editSprintEndDate: null,
      listSelect: null,
      selectedItem: null,
      snackbar: false,
      snackbarContent: null,
      endMenu: false,
      endMenuEdit: false,
      startMenu: false,
      startMenuEdit: false
    }
  },
  computed: {
    editingSprintStoriesArray() {
      let arr = []
      for (let story of this.stories) {
        if (this.editSprintStories.includes(story.uid)) {
          arr.push(story)
        }
      }
      const complete = this.openSprintStories.concat(arr)

      return complete
    },
    openSprintStories() {
      const openSprintStoriesAll = this.stories.filter(s => {
        return s.status == 'Sprint Ready'
      })
      let openSprintStories = []

      for (let story of openSprintStoriesAll) {
        openSprintStories.push(story)
      }
      return openSprintStories
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
    selectItem(item) {
      this.listSelect = item
      this.selectedItem = item
    },
    clearFields() {
      this.sprintStartDate = null
      this.sprintEndDate = null
      this.editSprintStatus = null
      this.editSprintStories = []
      this.sprintStatus = null
      this.sprintStories = []
      this.editSprintStartDate = null
      this.editSprintEndDate = null
    },
    updateItem() {
      if (this.editSprintStartDate == null || this.editSprintEndDate == null) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const active = this.sprints.map(s => s.status == 'Active')
      if (active.length > 0 && this.editSprintStatus == 'Active') {
        this.snackbarContent = 'Only one Sprint can be active at a time!'
        this.snackbar = true
        return
      }

      let selectedTicket
      for (let story of this.stories) {
        if (this.editSprintStories.includes(story.uid)) {
          selectedTicket = story
        }
        if (selectedTicket) {
          if (selectedTicket.comments) {
            store.dispatch('stories/updateStory', {
              title: selectedTicket.title,
              description: selectedTicket.description,
              created: selectedTicket.created,
              createdBy: selectedTicket.createdBy,
              startDate: selectedTicket.startDate,
              endDate: selectedTicket.endDate,
              uid: selectedTicket.uid,
              epic: selectedTicket.epic,
              label: selectedTicket.label,
              type: selectedTicket.type,
              status: 'To Do',
              team: selectedTicket.team,
              points: selectedTicket.points,
              comments: selectedTicket.comments
            })
          } else {
            store.dispatch('stories/updateStory', {
              title: selectedTicket.title,
              description: selectedTicket.description,
              created: selectedTicket.created,
              createdBy: selectedTicket.createdBy,
              startDate: selectedTicket.startDate,
              endDate: selectedTicket.endDate,
              uid: selectedTicket.uid,
              epic: selectedTicket.epic,
              label: selectedTicket.label,
              type: selectedTicket.type,
              status: 'To Do',
              team: selectedTicket.team,
              points: selectedTicket.points,
              comments: null
            })
          }
        }
      }

      store.dispatch('sprints/updateSprint', {
        uid: this.selectedItem.uid,
        created: this.sprintCreated,
        startDate: this.editSprintStartDate,
        endDate: this.editSprintEndDate,
        status: this.editSprintStatus,
        stories: this.editSprintStories
      })

      this.clearFields()
      this.selectItem(null)
    },
    deleteItem() {
      const payload = { sprint: this.selectedItem, stories: this.stories }
      store.dispatch('sprints/deleteSprint', payload)
      this.clearFields()
      this.selectItem(null)
    },
    createItem() {
      if (this.sprintStartDate == null || this.sprintEndDate == null) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const active = this.sprints.map(s => s.status == 'Active')
      if (active.length > 0 && this.sprintStatus == 'Active') {
        this.snackbarContent = 'Only one Sprint can be active at a time!'
        this.snackbar = true
        return
      }

      let selectedTicket

      for (let story of this.stories) {
        if (this.sprintStories.includes(story.uid)) {
          selectedTicket = story
        }
        if (selectedTicket) {
          if (selectedTicket.comments) {
            store.dispatch('stories/updateStory', {
              title: selectedTicket.title,
              description: selectedTicket.description,
              created: selectedTicket.created,
              createdBy: selectedTicket.createdBy,
              startDate: selectedTicket.startDate,
              endDate: selectedTicket.endDate,
              uid: selectedTicket.uid,
              epic: selectedTicket.epic,
              label: selectedTicket.label,
              type: selectedTicket.type,
              status: 'To Do',
              team: selectedTicket.team,
              points: selectedTicket.points,
              comments: selectedTicket.comments
            })
          } else {
            store.dispatch('stories/updateStory', {
              title: selectedTicket.title,
              description: selectedTicket.description,
              created: selectedTicket.created,
              createdBy: selectedTicket.createdBy,
              startDate: selectedTicket.startDate,
              endDate: selectedTicket.endDate,
              uid: selectedTicket.uid,
              epic: selectedTicket.epic,
              label: selectedTicket.label,
              type: selectedTicket.type,
              status: 'To Do',
              team: selectedTicket.team,
              points: selectedTicket.points,
              comments: null
            })
          }
        }
      }
      const created = new Date()
      const sprint = {
        created: this.sprintCreated,
        startDate: this.sprintStartDate,
        endDate: this.sprintEndDate,
        created: JSON.stringify(created),
        status: this.sprintStatus,
        stories: this.sprintStories
      }
      store.dispatch('sprints/createSprint', sprint)
      this.clearFields()
      this.selectItem(null)
    }
  },
  watch: {
    stories: {
      handler: function(val) {
        if (val !== null) {
          for (let s of val) {
            if (s.status == 'To Do') {
              const sprints = this.sprints.filter(sp => {
                return sp.stories.includes(s.uid)
              })
              if (sprints.length == 0) {
                s.status = 'Sprint Ready'

                if (s.comments) {
                  store.dispatch('stories/updateStory', {
                    title: s.title,
                    description: s.description,
                    created: s.created,
                    createdBy: s.createdBy,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    uid: s.uid,
                    epic: s.epic,
                    label: s.label,
                    type: s.type,
                    status: s.status,
                    team: s.team,
                    points: s.points,
                    comments: s.comments
                  })
                } else {
                  store.dispatch('stories/updateStory', {
                    title: s.title,
                    description: s.description,
                    created: s.created,
                    createdBy: s.createdBy,
                    startDate: s.startDate,
                    endDate: s.endDate,
                    uid: s.uid,
                    epic: s.epic,
                    label: s.label,
                    type: s.type,
                    status: s.status,
                    team: s.team,
                    points: s.points,
                    comments: null
                  })
                }
              }
            }
          }
        }
      },
      deep: true,
      immediate: true
    },

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
          this.editSprintStartDate = val.startDate
          this.editSprintEndDate = val.endDate
          this.editSprintStatus = val.status
          this.editSprintStories = val.stories
        } else {
          this.editSprintStartDate = null
          this.editSprintEndDate = null
          this.editSprintStatus = null
          this.editSprintStories = []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
