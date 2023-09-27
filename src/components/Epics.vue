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
                    label="Epic Title"
                    required
                    v-model="epicTitle"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
              </v-row>
              <v-row>
                <vue-editor
                  id="epicDescription"
                  v-model="epicDescription"
                ></vue-editor>
              </v-row>
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
                        v-model="epicStartDate"
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="epicStartDate"
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
                        v-model="epicEndDate"
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="epicEndDate"
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
                    :items="initiatives"
                    small-chips
                    item-text="title"
                    item-value="uid"
                    label="Initiatives"
                    required
                    v-model="epicInitiative"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6"> </v-col
              ></v-row>
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
                      label="Epic Title"
                      required
                      v-model="editEpicTitle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
                </v-row>
                <v-row v-if="selectedItem !== null">
                  <vue-editor
                    id="editEpicDescription"
                    v-model="editEpicDescription"
                  ></vue-editor>
                </v-row>
                <v-row class="mt-0" v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      outlined
                      dense
                      label="Epic Title"
                      required
                      disabled
                      v-model="editEpicTitle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
                </v-row>
                <v-row v-if="selectedItem == null">
                  <vue-editor
                    style="pointer-events:none;opacity:.8;"
                    id="editEpicDescription"
                    v-model="editEpicDescription"
                  ></vue-editor>
                </v-row>
                <v-row v-if="selectedItem !== null">
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
                          v-model="editEpicStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editEpicStartDate"
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
                          v-model="editEpicEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editEpicEndDate"
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
                      :items="initiatives"
                      item-text="title"
                      item-value="uid"
                      label="Initiatives"
                      required
                      v-model="editEpicInitiative"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6"> </v-col
                ></v-row>
                <v-row v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-menu
                      :close-on-content-click="false"
                      disabled
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
                          v-model="editEpicStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          disabled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editEpicStartDate"
                        no-title
                        scrollable
                        disabled
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
                      disabled
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          outlined
                          dense
                          v-model="editEpicEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          disabled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editEpicEndDate"
                        no-title
                        scrollable
                        disabled
                        @input="endMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row v-if="selectedItem == null">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="initiatives"
                      disabled
                      item-text="title"
                      item-value="uid"
                      label="Initiatives"
                      required
                      v-model="editEpicInitiative"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6"> </v-col
                ></v-row>
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

          <div v-if="formMode == 'Epic'">
            <v-list flat>
              <v-list-item-group v-model="listSelect" color="indigo">
                <v-list-item
                  class="listItem"
                  v-for="(item, i) in epics"
                  :key="i"
                  @click="selectItem(item)"
                >
                  <!--  <v-list-item-icon>
                    <v-icon x-large class="mt-2">mdi-notebook-multiple</v-icon>
                  </v-list-item-icon> -->

                  <v-list-item-content>
                    <v-col>
                      <h4>
                        Name:
                      </h4>
                      <p>{{ item.title }}</p>

                      <h4>
                        Description:
                      </h4>
                      <p v-html="item.description"></p>
                      <h4>
                        Created By:
                      </h4>
                      <p>
                        {{
                          approvedUsers.filter(function(u) {
                            return u.uid == item.createdBy
                          })[0].name
                        }}

                        ({{
                          approvedUsers.filter(function(u) {
                            return u.uid == item.createdBy
                          })[0].role
                        }})
                      </p>

                      <h4>
                        Start Date:
                      </h4>
                      <p>{{ item.startDate }}</p>
                      <h4>
                        End Date:
                      </h4>
                      <p>{{ item.endDate }}</p>
                      <h4>Created:</h4>

                      <p>{{ item.created }}</p>

                      <div
                        class="mb-4"
                        v-if="
                          initiatives.filter(function(u) {
                            return u.uid == item.initiative
                          }).length > 0
                        "
                      >
                        <h4>
                          Initiative:
                        </h4>

                        {{
                          initiatives.filter(function(u) {
                            return u.uid == item.initiative
                          })[0].title
                        }}

                        <br />
                      </div>

                      <div
                        v-if="
                          stories.filter(function(u) {
                            return u.epic == item.uid
                          }).length > 0
                        "
                      >
                        <h4>
                          Stories:
                        </h4>
                        <p
                          v-for="(story, index) in stories.filter(function(u) {
                            return u.epic == item.uid
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
  name: 'Epics',
  components: {},
  props: {
    formMode: {
      type: String,
      default: () => null
    }
  },
  data() {
    return {
      epicTitle: null,
      epicDescription: null,
      epicStartDate: null,
      epicEndDate: null,
      epicInitiative: null,
      editEpicTitle: null,
      editEpicDescription: null,
      editEpicStartDate: null,
      editEpicEndDate: null,
      endMenu: false,
      endMenuEdit: false,
      startMenu: false,
      startMenuEdit: false,
      editEpicInitiative: null,
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
      this.epicTitle = null
      this.epicDescription = null
      this.epicStartDate = null
      this.epicEndDate = null
      this.epicInitiative = null
    },
    updateItem() {
      if (
        this.editEpicTitle == null ||
        this.editEpicDescription == null ||
        this.editEpicStartDate == null ||
        this.editEpicEndDate == null ||
        this.editEpicInitiative == null
      ) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const t = this
      const created = this.epics.filter(function(i) {
        return i.uid == t.selectedItem.uid
      })

      store.dispatch('epics/updateEpic', {
        title: this.editEpicTitle,
        description: this.editEpicDescription,
        created: created[0].created,
        createdBy: this.user.uid,
        startDate: this.editEpicStartDate,
        endDate: this.editEpicEndDate,
        uid: this.selectedItem.uid,
        initiative: this.editEpicInitiative
      })
      this.clearFields()
      this.selectItem(null)
    },
    deleteItem() {
      const payload = { epic: this.selectedItem, stories: this.stories }
      store.dispatch('epics/deleteEpic', payload)
      this.clearFields()
      this.selectItem(null)
    },
    createItem() {
      if (
        this.epicTitle == null ||
        this.epicDescription == null ||
        this.epicStartDate == null ||
        this.epicEndDate == null ||
        this.epicInitiative == null
      ) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const created = new Date()
      const epic = {
        title: this.epicTitle,
        description: this.epicDescription,
        created: JSON.stringify(created),
        createdBy: this.user.uid,
        startDate: this.epicStartDate,
        endDate: this.epicEndDate,
        initiative: this.epicInitiative
      }
      store.dispatch('epics/createEpic', epic)
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
          this.editEpicTitle = val.title
          this.editEpicDescription = val.description
          this.editEpicStartDate = val.startDate
          this.editEpicEndDate = val.endDate
          this.editEpicInitiative = val.initiative
        } else {
          this.editEpicTitle = null
          this.editEpicDescription = null
          this.editEpicStartDate = null
          this.editEpicEndDate = null
          this.editEpicInitiative = null
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
