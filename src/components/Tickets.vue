<template>
  <div>
    <v-row v-if="renderComponent" class="mt-10 mb-4">
      <v-speed-dial
        style="position:absolute"
        class="mt-0"
        v-model="fab"
        :left="true"
        :direction="'right'"
        :open-on-hover="false"
        :transition="'slide-y-reverse-transition'"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="success" @click="createTicket('Story')">
          <v-icon>mdi-book-outline</v-icon>
        </v-btn>
        <v-btn fab dark small color="error" @click="createTicket('Bug')">
          <v-icon>mdi-bug</v-icon>
        </v-btn>
        <v-btn fab dark small color="warning" @click="createTicket('Risk')">
          <v-icon>mdi-code-json</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="secondary"
          @click="createTicket('Tech Debt')"
        >
          <v-icon>mdi-file-code</v-icon>
        </v-btn>
      </v-speed-dial>

      <h2 v-if="this.currentSprint" style="text-align:center;width:100%">
        Current Sprint: {{ this.totalPoints }} Points<br />
        {{ this.currentSprint.startDate }} -
        {{ this.currentSprint.endDate }}
      </h2>
      <br />
    </v-row>
    <v-dialog v-model="ticketDialog" width="1000">
      <v-card elevation="0" style="border:none;border-radius:0px;">
        <Stories
          :issueMode="issueMode"
          :createMode="createMode"
          :selectedItem="selectedItem"
        ></Stories>
      </v-card>
    </v-dialog>

    <v-container class="tickets">
      <v-row>
        <v-col
          ><div id="todo_status">
            <h3>To Do</h3>

            <draggable
              class="list-group dragList"
              :list="statusTodo"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'To Do')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusTodo"
                  :key="element.uid"
                >
                  <v-card
                    class="mx-auto mt-2 mb-2"
                    width="325"
                    height="125"
                    @click="editTicket(element)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="text-overline mb-4">
                          <v-chip color="primary" class="mr-2">
                            {{ element.points }}
                          </v-chip>
                          {{ element.startDate }} - {{ element.endDate }}
                        </div>

                        <v-list-item-title class="text-h5 mb-1">
                          {{ element.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-html="element.description"></span
                        ></v-list-item-subtitle>
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
              </transition-group>
            </draggable>
          </div></v-col
        >
        <v-col
          ><div id="in_progress_status">
            <h3>In Progress</h3>

            <draggable
              class="list-group dragList"
              :list="statusInProgress"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'In Progress')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusInProgress"
                  :key="element.uid"
                >
                  <v-card
                    class="mx-auto mt-2 mb-2"
                    width="325"
                    height="125"
                    @click="editTicket(element)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="text-overline mb-4">
                          <v-chip color="primary" class="mr-2">
                            {{ element.points }}
                          </v-chip>
                          {{ element.startDate }} - {{ element.endDate }}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                          {{ element.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-html="element.description"></span
                        ></v-list-item-subtitle>
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
              </transition-group>
            </draggable>
          </div></v-col
        >

        <v-col
          ><div id="new_status">
            <h3>Review</h3>
            <draggable
              class="list-group dragList"
              :list="statusReview"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Review')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusReview"
                  :key="element.uid"
                >
                  <v-card
                    class="mx-auto mt-2 mb-2"
                    width="325"
                    height="125"
                    @click="editTicket(element)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="text-overline mb-4">
                          <v-chip color="primary" class="mr-2">
                            {{ element.points }}
                          </v-chip>
                          {{ element.startDate }} - {{ element.endDate }}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                          {{ element.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-html="element.description"></span
                        ></v-list-item-subtitle>
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
              </transition-group>
            </draggable>
          </div>
        </v-col>

        <v-col
          ><div id="completed_status">
            <h3>Production Ready</h3>

            <draggable
              class="list-group dragList"
              :list="statusCompleted"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Production Ready')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusCompleted"
                  :key="element.uid"
                >
                  <v-card
                    class="mx-auto mt-2 mb-2"
                    width="325"
                    height="125"
                    @click="editTicket(element)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="text-overline mb-4">
                          <v-chip color="primary" class="mr-2">
                            {{ element.points }}
                          </v-chip>
                          {{ element.startDate }} - {{ element.endDate }}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                          {{ element.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-html="element.description"></span
                        ></v-list-item-subtitle>
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
              </transition-group>
            </draggable>
          </div></v-col
        >
        <v-col
          ><div id="archived_status">
            <h3>Closed</h3>

            <draggable
              class="list-group dragList"
              :list="statusArchived"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Closed')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusArchived"
                  :key="element.uid"
                >
                  <v-card
                    class="mx-auto mt-2 mb-2"
                    width="325"
                    height="125"
                    @click="editTicket(element)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="text-overline mb-4">
                          <v-chip color="primary" class="mr-2">
                            {{ element.points }}
                          </v-chip>
                          {{ element.startDate }} - {{ element.endDate }}
                        </div>
                        <v-list-item-title class="text-h5 mb-1">
                          {{ element.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <span v-html="element.description"></span
                        ></v-list-item-subtitle>
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
              </transition-group>
            </draggable>
          </div></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>
<script>
import store from '@/store/index'
import draggable from 'vuedraggable'
import Stories from '@/components/Stories'
export default {
  name: 'Tickets',
  components: { draggable, Stories },
  data() {
    return {
      renderComponent: true,
      selectedItem: null,
      createMode: false,
      ticketDialog: false,
      fab: false,
      issueMode: null,
      statusTodoValue: [],
      statusReviewValue: [],
      statusInProgressValue: [],
      statusCompletedValue: [],
      statusArchivedValue: []
    }
  },
  computed: {
    totalPoints() {
      let totalPoints
      const cs = this.currentSprint
      totalPoints = this.stories.filter(u => {
        return u
      })
      let arr = []
      if (totalPoints.length > 0) {
        for (let s of totalPoints) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr.map(p => p.points).reduce((a, b) => a + b, 0) || []
    },
    currentSprint() {
      const sprints = store.state.sprints.sprints.filter(u => {
        return u.status == 'Active'
      })

      return sprints[0] || {}
    },
    statusArchived() {
      let statusArchived
      const cs = this.currentSprint
      statusArchived = this.stories.filter(u => {
        return u.status == 'Closed'
      })
      let arr = []
      if (statusArchived.length > 0) {
        for (let s of statusArchived) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr || []
    },
    statusCompleted() {
      let statusCompleted
      const cs = this.currentSprint
      statusCompleted = this.stories.filter(u => {
        return u.status == 'Production Ready'
      })

      let arr = []
      if (statusCompleted.length > 0) {
        for (let s of statusCompleted) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr || []
    },
    statusInProgress() {
      let statusInProgress
      const cs = this.currentSprint
      statusInProgress = this.stories.filter(u => {
        return u.status == 'In Progress'
      })

      let arr = []
      if (statusInProgress.length > 0) {
        for (let s of statusInProgress) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr || []
    },
    statusTodo() {
      let statusTodo
      const cs = this.currentSprint
      statusTodo = this.stories.filter(u => {
        return u.status == 'To Do'
      })
      let arr = []
      if (statusTodo.length > 0) {
        for (let s of statusTodo) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr || []
    },
    statusReview() {
      let statusReview
      const cs = this.currentSprint
      statusReview = store.state.stories.stories.filter(u => {
        return u.status == 'Review'
      })

      let arr = []
      if (statusReview.length > 0) {
        for (let s of statusReview) {
          if (cs.stories) {
            if (cs.stories.includes(s.uid)) {
              arr.push(s)
            }
          }
        }
      }

      return arr || []
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'status',
        disabled: false,
        ghostClass: 'ghost'
      }
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
    forceRerender() {
      this.renderComponent = false
      this.$nextTick(() => {
        this.renderComponent = true
      })
    },
    createTicket(type) {
      this.createMode = true
      this.issueMode = type
      this.ticketDialog = true
    },
    editTicket(item) {
      this.createMode = false
      this.selectedItem = item
      this.issueMode = item.type
      this.ticketDialog = true
    },
    log: function(evt, status) {
      this.forceRerender()
      if (evt.added) {
        const element = evt.added.element

        const stories = store.state.stories.stories.filter(function(u) {
          return u.uid == element.uid
        })

        if (stories.length == 1) {
          if (element.comments) {
            store.dispatch('stories/updateStory', {
              title: element.title,
              description: element.description,
              created: element.created,
              createdBy: element.createdBy,
              startDate: element.startDate,
              endDate: element.endDate,
              uid: element.uid,
              epic: element.epic,
              label: element.label,
              type: element.type,
              status: status,
              team: element.team,
              points: element.points,
              comments: element.comments
            })
          } else {
            store.dispatch('stories/updateStory', {
              title: element.title,
              description: element.description,
              created: element.created,
              createdBy: element.createdBy,
              startDate: element.startDate,
              endDate: element.endDate,
              uid: element.uid,
              epic: element.epic,
              label: element.label,
              type: element.type,
              status: status,
              team: element.team,
              points: element.points,
              comments: null
            })
          }
        }
      }

      store.dispatch('stories/listStories')
      this.forceRerender()
    }
  }
}
</script>
