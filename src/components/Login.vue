<template>
  <section>
    <center>
      <h1 class="font-weight-light headerText mb-4">
        <v-icon class="headerIcon" color="primary" style="margin-top: -.2em;"
          >mdi-waves</v-icon
        >
        Sutorīmu
      </h1>
      <br />
      <section id="firebaseui-auth-container"></section>
    </center>
  </section>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import store from '@/store/index'
export default {
  name: 'Login',
  data() {
    return {}
  },
  computed: {
    user() {
      const user = store.state.users.user || null
      return user
    },
    authUser() {
      const authUser = store.state.users.authUser || null
      return authUser
    }
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth())
    }
    var uiConfig = {
      signInSuccessUrl: '/', // This redirect can be achived by route using callback.
      signInFlow: 'popup',

      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

<style>
.headerText {
  font-size: 4em;
  margin-top: 1em;
  margin-bottom: 1em;
}
.headerIcon {
  font-size: 1.5em !important;
}
</style>
