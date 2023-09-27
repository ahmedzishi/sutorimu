<template>
  <div>
    <v-row class="pa-1" style="max-width:1000px;margin:auto">
      <v-snackbar
        v-model="snackbar"
        color="dark"
        :timeout="3000"
        elevation="24"
        centered
      >
        {{ snackbarContent }}
      </v-snackbar>
      <v-col cols="12" sm="12" md="12">
        <!-- CREATION -->
        <div class="creationEditing">
          <v-card
            v-if="createMode == true"
            class="mx-auto mt-2 creation"
            elevation="0"
          >
            <v-card-title>
              <span class="text-h5 mt-n4 ml-n3 mb-4"
                >Create New {{ issueMode }} Ticket</span
              >
            </v-card-title>

            <!-- CREATE -->
            <v-container style="margin-top: -2em;">
              <v-row class="mt-0">
                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    outlined
                    dense
                    label="Story Title"
                    required
                    v-model="storyTitle"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
              </v-row>
              <v-row>
                <vue-editor
                  id="storyDescription"
                  v-model="storyDescription"
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
                        v-model="storyStartDate"
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="storyStartDate"
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
                        v-model="storyEndDate"
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="storyEndDate"
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
                    :items="epics"
                    item-text="title"
                    item-value="uid"
                    label="Epic"
                    required
                    v-model="storyEpic"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="teams"
                    item-text="name"
                    item-value="uid"
                    label="Assigned"
                    required
                    v-model="storyTeam"
                  ></v-select> </v-col
              ></v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="statusOptions"
                    label="Status"
                    required
                    v-model="storyStatus"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="labelOptions"
                    label="Label"
                    required
                    v-model="storyLabel"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  <v-select
                    outlined
                    dense
                    :items="[0, 1, 2, 3, 5, 8, 13, 20]"
                    label="Points"
                    required
                    v-model="storyPoints"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <!--     <v-select
                    outlined
                    dense
                    :items="labelOptions"
                    label="Label"
                    required
                    v-model="storyLabel"
                  ></v-select> -->
                </v-col>
              </v-row>
            </v-container>

            <v-card-actions>
              <v-btn
                color="blue darken-1 white--text"
                large
                @click="clearFields"
              >
                Clear
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
          <v-card
            v-if="createMode == false"
            class="mx-auto mt-2 creation"
            elevation="0"
          >
            <v-card-title>
              <span class="text-h5 mt-n4 ml-n3 mb-4"
                >{{ issueMode }} Ticket

                <v-icon
                  color="primary"
                  @click="editingMode = true"
                  v-if="editingMode == false && commentMode == false"
                  >mdi-pencil</v-icon
                >

                <v-icon
                  color="primary"
                  @click="editingMode = false"
                  v-if="editingMode == true && commentMode == false"
                  >mdi-pencil-off</v-icon
                >
                <v-icon
                  color="success"
                  @click="commentMode = true"
                  v-if="editingMode == false && commentMode == false"
                  >mdi-message-text</v-icon
                >
                <v-icon
                  color="success"
                  @click="commentMode = false"
                  v-if="editingMode == false && commentMode == true"
                  >mdi-message-bulleted-off</v-icon
                >
              </span>
              <h5
                class="font-weight-light"
                style="margin-left: 1em;
    margin-top: -2em;"
              >
                {{ comments.length }} comments
              </h5>
            </v-card-title>
            <v-card-text>
              <!-- EDITING BEGIN-->
              <v-container style="margin-top: -2em;" v-if="commentMode == true">
                <h2 class="font-weight-light">Comments</h2>
                <br />
                <div>
                  <v-list>
                    <v-list-item-group v-model="listSelect" color="primary">
                      <v-list-item
                        style="border:solid 1px #d5d5d5;border-radius:4px"
                        class="mb-4"
                        v-for="(comment, index) in comments"
                        :key="index"
                      >
                        <v-list-item-content
                          @click="selectItem(comment)"
                          :id="comment.uid"
                          outlined
                          v-if="comment"
                          class="mb-4"
                        >
                          <v-list-item-title
                            v-html="comment.comment"
                          ></v-list-item-title>
                          <br />
                          <span
                            v-if="
                              approvedUsers.filter(function(u) {
                                return u.uid == comment.user
                              }).length == 1
                            "
                            >By:
                            {{
                              approvedUsers.filter(function(u) {
                                return u.uid == comment.user
                              })[0].name
                            }}</span
                          >
                          <br />{{ comment.time }}

                          <div v-if="comment.allReplies" class="mt-8">
                            <h3 class="font-weight-light">Replies</h3>
                            <br />
                            <div
                              v-for="reply in comment.allReplies"
                              :key="reply.uid"
                            >
                              <div
                                :id="reply.uid"
                                style="border:solid 1px #d5d5d5;border-radius:4px;padding:1em"
                                class="mb-4"
                              >
                                <span v-html="reply.reply"></span>
                                <br />
                                <span
                                  v-if="
                                    approvedUsers.filter(function(u) {
                                      return u.uid == reply.user
                                    }).length == 1
                                  "
                                  >By:
                                  {{
                                    approvedUsers.filter(function(u) {
                                      return u.uid == reply.user
                                    })[0].name
                                  }}</span
                                >
                                <br />{{ reply.time }}
                              </div>
                            </div>
                          </div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </div>

                <br />
                <hr v-if="comments.length > 0" />
                <br /><br />
                <vue-editor
                  id="storyComment"
                  v-model="storyComment"
                ></vue-editor>
                <v-btn
                  v-if="selectedComment == null"
                  color="primary"
                  class="mt-n16"
                  @click="addComment"
                  >Add new comment</v-btn
                >
                <v-btn
                  v-if="selectedComment !== null"
                  color="success"
                  class="mt-n16"
                  @click="addReply"
                  >Reply to Comment</v-btn
                >
                <v-btn
                  v-if="selectedComment !== null"
                  color="error"
                  class="mt-n16"
                  @click="
                    selectedComment = null
                    listSelect = null
                  "
                  >Clear selection</v-btn
                >
              </v-container>
              <v-container
                style="margin-top: -2em;"
                v-if="commentMode == false"
              >
                <v-row class="mt-0" v-if="editingMode == true">
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      outlined
                      dense
                      label="Story Title"
                      required
                      v-model="editStoryTitle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
                </v-row>
                <v-row v-if="editingMode == true">
                  <vue-editor
                    id="editStoryDescription"
                    v-model="editStoryDescription"
                  ></vue-editor>
                </v-row>
                <v-row class="mt-0" v-if="editingMode == false">
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      outlined
                      dense
                      label="Story Title"
                      required
                      disabled
                      v-model="editStoryTitle"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6"> &nbsp; </v-col>
                </v-row>
                <v-row v-if="editingMode == false">
                  <vue-editor
                    style="pointer-events:none;opacity:.8"
                    id="editStoryDescription"
                    v-model="editStoryDescription"
                  ></vue-editor>
                </v-row>

                <v-row v-if="editingMode == false">
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
                          v-model="editStoryStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          disabled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editStoryStartDate"
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
                          v-model="editStoryEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          disabled
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editStoryEndDate"
                        no-title
                        scrollable
                        disabled
                        @input="endMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>

                <v-row v-if="editingMode == true">
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
                          v-model="editStoryStartDate"
                          label="Start Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editStoryStartDate"
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
                          v-model="editStoryEndDate"
                          label="End Date"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editStoryEndDate"
                        no-title
                        scrollable
                        @input="endMenuEdit = false"
                      >
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-row v-if="editingMode == true">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="epics"
                      item-text="title"
                      item-value="uid"
                      label="Epic"
                      required
                      v-model="editStoryEpic"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="teams"
                      item-text="name"
                      item-value="uid"
                      label="Assigned"
                      required
                      v-model="editStoryTeam"
                    ></v-select> </v-col
                ></v-row>
                <v-row v-if="editingMode == true">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="statusOptions"
                      label="Status"
                      required
                      v-model="editStoryStatus"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="labelOptions"
                      label="Label"
                      required
                      v-model="editStoryLabel"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row v-if="editingMode == true">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="[0, 1, 2, 3, 5, 8, 13, 20]"
                      label="Points"
                      required
                      v-model="editStoryPoints"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <!--     <v-select
                    outlined
                    dense
                    :items="labelOptions"
                    label="Label"
                    required
                    v-model="storyLabel"
                  ></v-select> -->
                  </v-col>
                </v-row>
                <v-row v-if="editingMode == false">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      :items="epics"
                      disabled
                      item-text="title"
                      item-value="uid"
                      label="Epic"
                      required
                      v-model="editStoryEpic"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      disabled
                      :items="teams"
                      item-text="name"
                      item-value="uid"
                      label="Assigned"
                      required
                      v-model="editStoryTeam"
                    ></v-select> </v-col
                ></v-row>
                <v-row v-if="editingMode == false">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      disabled
                      :items="statusOptions"
                      label="Status"
                      required
                      v-model="editStoryStatus"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      outlined
                      dense
                      disabled
                      :items="labelOptions"
                      label="Label"
                      required
                      v-model="editStoryLabel"
                    ></v-select> </v-col
                ></v-row>
                <v-row v-if="editingMode == false">
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      disabled
                      outlined
                      dense
                      :items="[0, 1, 2, 3, 5, 8, 13, 20]"
                      label="Points"
                      required
                      v-model="editStoryPoints"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <!--     <v-select
                    outlined
                    dense
                    :items="labelOptions"
                    label="Label"
                    required
                    v-model="storyLabel"
                  ></v-select> -->
                  </v-col>
                </v-row>
              </v-container>
              <!-- EDITING END -->
            </v-card-text>
            <v-card-actions v-if="editingMode == true && commentMode == false">
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
            <v-card-actions v-if="editingMode == false && commentMode == false">
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
    </v-row>
  </div>
</template>
<script>
import store from '@/store/index'
export default {
  name: 'Stories',
  components: {},
  props: {
    issueMode: {
      type: String,
      default: () => null
    },
    createMode: {
      type: Boolean,
      default: () => false
    },
    selectedItem: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      statusOptions: [
        'Prioritized',
        'Requirements',
        'Ready for Estimation',
        'Sprint Ready',
        'To Do',
        'In Progress',
        'Review',
        'Production Ready',
        'Closed'
      ],
      labelOptions: [
        'Standard',
        'High Priority',
        'Misc',
        'Unit',
        'QA',
        'Regression',
        'Integration',
        'UAT',
        'Other'
      ],
      commentMode: false,
      storyComment: null,
      storyTitle: null,
      storyType: null,
      storyTeam: null,
      storyStatus: null,
      storyLabel: null,
      editStoryLabel: null,
      editStoryStatus: null,
      storyDescription: null,
      storyStartDate: null,
      storyEndDate: null,
      storyEpic: null,
      storyPoints: null,
      editStoryPoints: null,
      editStoryTitle: null,
      editStoryType: null,
      editStoryDescription: null,
      editStoryStartDate: null,
      editStoryEndDate: null,
      endMenu: false,
      endMenuEdit: false,
      startMenu: false,
      startMenuEdit: false,
      editStoryEpic: null,
      editStoryTeam: null,
      snackbar: false,
      snackbarContent: null,
      editingMode: false,
      selectedComment: null,
      listSelect: null
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
    },
    comments() {
      const t = this
      let comments = []

      const c = store.state.stories.stories.filter(function(c) {
        return c.uid == t.selectedItem.uid
      })

      if (c[0].comments) {
        for (const key in c[0].comments) {
          comments.push(c[0].comments[key])
          if (c[0].comments[key].replies) {
            c[0].comments[key].allReplies = []
            for (const k in c[0].comments[key].replies) {
              c[0].comments[key].allReplies.push(c[0].comments[key].replies[k])
            }
          }
        }
      }

      return comments
    }
  },
  methods: {
    clearFields() {
      this.storyTitle = null
      this.storyDescription = null
      this.storyStartDate = null
      this.storyEndDate = null
      this.storyEpic = null
      this.storyTeam = null
      this.storyLabel = null
      this.storyStatus = null
      this.storyPoints = null
    },
    addComment() {
      const t = this
      const time = new Date()
      store
        .dispatch('stories/addComment', {
          story_uid: this.selectedItem.uid,
          comment: this.storyComment,
          user: this.user.uid,
          time: JSON.stringify(time)
        })
        .then(() => {
          t.storyComment = null
        })
    },
    addReply() {
      const t = this
      const time = new Date()
      store
        .dispatch('stories/addReply', {
          story_uid: this.selectedItem.uid,
          reply: this.storyComment,
          user: this.user.uid,
          time: JSON.stringify(time),
          comment_uid: this.selectedComment.uid
        })
        .then(() => {
          t.storyComment = null
        })
    },
    updateItem() {
      if (
        this.editStoryTitle == null ||
        this.editStoryDescription == null ||
        this.editStoryStartDate == null ||
        this.editStoryEndDate == null ||
        this.editStoryEpic == null ||
        this.editStoryTeam == null ||
        this.editStoryLabel == null ||
        this.editStoryStatus == null ||
        this.editStoryPoints
      ) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const t = this
      const created = this.stories.filter(function(i) {
        return i.uid == t.selectedItem.uid
      })
      if (created[0].comments) {
        store.dispatch('stories/updateStory', {
          title: this.editStoryTitle,
          description: this.editStoryDescription,
          created: created[0].created,
          createdBy: this.user.uid,
          startDate: this.editStoryStartDate,
          endDate: this.editStoryEndDate,
          uid: this.selectedItem.uid,
          epic: this.editStoryEpic,
          label: this.editStoryLabel,
          type: this.issueMode,
          status: this.editStoryStatus,
          team: this.editStoryTeam,
          points: this.editStoryPoints,
          comments: created[0].comments
        })
      } else {
        store.dispatch('stories/updateStory', {
          title: this.editStoryTitle,
          description: this.editStoryDescription,
          created: created[0].created,
          createdBy: this.user.uid,
          startDate: this.editStoryStartDate,
          endDate: this.editStoryEndDate,
          uid: this.selectedItem.uid,
          epic: this.editStoryEpic,
          label: this.editStoryLabel,
          type: this.issueMode,
          status: this.editStoryStatus,
          team: this.editStoryTeam,
          points: this.editStoryPoints,
          comments: null
        })
      }

      this.clearFields()
      this.editingMode = false
      this.commentMode = false
    },
    deleteItem() {
      store.dispatch('stories/deleteStory', this.selectedItem)
      this.clearFields()
    },
    selectItem(item) {
      this.listSelect = item
      this.selectedComment = item
    },
    createItem() {
      if (
        this.storyTitle == null ||
        this.storyDescription == null ||
        this.storyStartDate == null ||
        this.storyEndDate == null ||
        this.storyEpic == null ||
        this.storyStatus == null ||
        this.storyLabel == null ||
        this.storyTeam == null ||
        this.storyPoints == null
      ) {
        this.snackbarContent = 'All fields required'
        this.snackbar = true
        return
      }
      const created = new Date()
      const story = {
        title: this.storyTitle,
        description: this.storyDescription,
        created: JSON.stringify(created),
        createdBy: this.user.uid,
        startDate: this.storyStartDate,
        endDate: this.storyEndDate,
        epic: this.storyEpic,
        label: this.storyLabel,
        type: this.issueMode,
        status: this.storyStatus,
        team: this.storyTeam,
        points: this.storyPoints,
        comments: null
      }
      store.dispatch('stories/createStory', story)
      this.clearFields()
    }
  },
  watch: {
    selectedComment: {
      handler: function(val) {
        if (val !== null) {
          console.log(val)
        }
      },
      deep: true,
      immediate: true
    },
    issueMode: {
      handler: function(val) {
        if (val == null) {
          this.clearFields()
        }
      },
      deep: true,
      immediate: true
    },

    selectedItem: {
      handler: function(val) {
        this.editingMode = false
        this.commentMode = false

        if (val !== null) {
          this.editStoryTitle = val.title
          this.editStoryDescription = val.description
          this.editStoryStartDate = val.startDate
          this.editStoryEndDate = val.endDate
          this.editStoryEpic = val.epic
          this.editStoryLabel = val.label
          this.editStoryStatus = val.status
          this.editStoryTeam = val.team
          this.editStoryPoints = val.points
          this.editStoryType = this.issueMode
        } else {
          this.editStoryTitle = null
          this.editStoryDescription = null
          this.editStoryStartDate = null
          this.editStoryEndDate = null
          this.editStoryEpic = null
          this.editStoryLabel = null
          this.editStoryStatus = null
          this.editStoryTeam = null
          this.editStoryPoints = null
          this.editStoryType = this.issueMode
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
