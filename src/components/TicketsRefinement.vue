<template>
  <div>
    <v-row v-if="renderComponent" class="mt-10 mb-4">
      <v-speed-dial
        style="position:absolute"
        v-model="fab"
        :left="true"
        :direction="'right'"
        :prioritized-on-hover="false"
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
          ><div id="prioritized_status">
            <h3>Prioritized</h3>

            <draggable
              class="list-group dragList"
              :list="statusPrioritized"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Prioritized')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusPrioritized"
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
          ><div id="requirements_status">
            <h3>Requirements</h3>

            <draggable
              class="list-group dragList"
              :list="statusRequirements"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Requirements')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusRequirements"
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
            <h3>Ready for Estimation</h3>
            <draggable
              class="list-group dragList"
              :list="statusReadyforEstimation"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Ready for Estimation')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusReadyforEstimation"
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
          ><div id="sprintReady_status">
            <h3>Sprint Ready</h3>

            <draggable
              class="list-group dragList"
              :list="statusSprintReady"
              :emptyInsertThreshold="100"
              group="fields"
              :sort="true"
              @change="log($event, 'Sprint Ready')"
              v-bind="dragOptions"
              @start="isDragging = true"
              @end="isDragging = false"
            >
              <transition-group type="transition" name="flip-list">
                <div
                  style="cursor: pointer; "
                  v-for="(element, index) in statusSprintReady"
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
      statusPrioritizedValue: [],
      statusReadyforEstimationValue: [],
      statusRequirementsValue: [],
      statusSprintReadyValue: [],
      statusArchivedValue: []
    }
  },
  computed: {
    statusArchived() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Closed'
      })

      return stories
    },
    statusSprintReady() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Sprint Ready'
      })

      return stories
    },
    statusRequirements() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Requirements'
      })

      return stories
    },
    statusPrioritized() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Prioritized'
      })

      return stories
    },
    statusReadyforEstimation() {
      const stories = store.state.stories.stories.filter(function(u) {
        return u.status == 'Ready for Estimation'
      })

      return stories
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
