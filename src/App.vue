<template>
  <v-app>
    <v-app-bar flat max-height="64px" dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Sutorīmu</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      dark
      color="primary"
    >
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-waves</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Sutorīmu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-if="authUser" to="/" link>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="authUser" to="/profile" link>
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="authUser" to="/refinement" link>
          <v-list-item-icon>
            <v-icon>mdi-clipboard-edit</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Refinement Board</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="authUser" to="/board" link>
          <v-list-item-icon>
            <v-icon>mdi-shoe-sneaker</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Sprint Board</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="authUser" to="/backlog" link>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Ticket Backlog</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="authUser" to="/initepics" link>
          <v-list-item-icon>
            <v-icon>mdi-flag-checkered</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Initiatives/Epics</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="authUser" to="/manage" link>
          <v-list-item-icon>
            <v-icon>mdi-monitor-dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Manage</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="!authUser" to="/login">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="authUser" @click="signoutButtonPressed">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-container class="main-container">
      <v-main>
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import store from '@/store/index'
export default {
  name: 'App',
  data() {
    return {
      drawer: null
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      store.commit('users/replaceValue', { key: 'authUser', value: user })
    })
  },
  computed: {
    authUser() {
      const authUser = store.state.users.authUser || null
      return authUser
    },
    user() {
      const user = store.state.users.user || null
      return user
    }
  },
  methods: {
    signoutButtonPressed(e) {
      e.stopPropagation()
      firebase.auth().signOut()
      store.commit('users/clearState')
      store.commit('initiatives/clearState')
      store.commit('epics/clearState')
      store.commit('stories/clearState')
      store.commit('teams/clearState')
      store.commit('sprints/clearState')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
<style>
.listItem {
  border: solid 1px #d5d5d5 !important;
  margin-bottom: 2em !important;
  width: 100%;
  float: left !important;
  border-radius: 4px !important;
}
.listItem.v-list-item--active {
  color: #2196f3 !important;
  border-color: #2196f3 !important;
}

.listings {
  margin: 1em !important;
  padding: 1em !important;
}
html,
input,
label,
select,
.v-label,
.v-select__selection {
  font-size: 0.85em !important;
}
.dragList {
  min-height: 50px !important;
  min-width: 50px !important;
}
.tickets {
  overflow-y: auto !important;
  margin-top: 7em !important;
}

.tickets h3 {
  text-align: center !important;
  font-weight: 400 !important;
  font-size: 1.5em !important;
}
.ql-container.ql-snow {
  border-bottom-left-radius: 4px !important;
  border-bottom-right-radius: 4px !important;
}
.quillWrapper .ql-snow.ql-toolbar {
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
}
.quillWrapper {
  margin-top: -1em !important;
  margin-left: 1em !important;
  margin-bottom: 8em !important;
  max-width: 820px;
}
.ql-editor {
  min-height: 100px !important;
  font-size: 14px !important;
}
.v-input__control {
  max-width: 350px !important;
}

.creationEditing .v-list-item-group .v-list-item--active {
  color: inherit !important;
  pointer-events: none !important;
}
.initEpics .v-toolbar__content {
  height: 0px !important;
}
</style>
