<template>
  <section v-if="renderComponent == true && loaded == true">
    <section v-if="user.approved == false && user">
      You must first be approved to view application
    </section>
    <section v-if="user.approved == true && user">
      <div class="mx-auto mt-8 initEpics">
        <v-card>
          <v-toolbar dark flat style="height:55px">
            <template v-slot:extension>
              <v-tabs v-model="tab" align-with-title>
                <v-tabs-slider color="primary"></v-tabs-slider>

                <v-tab v-for="(item, index) in initiatives" :key="index">
                  {{ item.title }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="(item, index) in initiatives" :key="index">
              <v-card flat>
                <v-card-text>
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
                        v-if="
                          epics.filter(function(e) {
                            return e.initiative == item.uid
                          }).length > 0
                        "
                      >
                        <h4>
                          Epics:
                        </h4>
                        <br />
                        <p
                          v-for="(epic, index) in epics.filter(function(e) {
                            return e.initiative == item.uid
                          })"
                          :key="epic.uid"
                        >
                          <v-list-item-content
                            style="border:solid 1px #2196f3;border-radius:4px"
                          >
                            <v-col>
                              <h4>
                                Name:
                              </h4>
                              <p>{{ epic.title }}</p>

                              <h4>
                                Description:
                              </h4>
                              <p v-html="epic.description"></p>
                              <h4>
                                Created By:
                              </h4>
                              <p>
                                {{
                                  approvedUsers.filter(function(u) {
                                    return u.uid == epic.createdBy
                                  })[0].name
                                }}

                                ({{
                                  approvedUsers.filter(function(u) {
                                    return u.uid == epic.createdBy
                                  })[0].role
                                }})
                              </p>

                              <h4>
                                Start Date:
                              </h4>
                              <p>{{ epic.startDate }}</p>
                              <h4>
                                End Date:
                              </h4>
                              <p>{{ epic.endDate }}</p>
                              <h4>Created:</h4>

                              <p>{{ epic.created }}</p>

                              <div
                                v-if="
                                  stories.filter(function(u) {
                                    return u.epic == epic.uid
                                  }).length > 0
                                "
                              >
                                <h4>
                                  Stories:
                                </h4>
                                <p
                                  v-for="(story, index) in stories.filter(
                                    function(u) {
                                      return u.epic == epic.uid
                                    }
                                  )"
                                  :key="index"
                                >
                                  {{ story.title }}
                                </p>
                              </div>
                            </v-col>
                          </v-list-item-content>
                        </p>
                      </div>
                    </v-col>
                  </v-list-item-content>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </section>
  </section>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'InitEpics',
  data() {
    return {
      renderComponent: true,
      loaded: false,
      dialog: false,
      tab: null,
      tabs: null
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
