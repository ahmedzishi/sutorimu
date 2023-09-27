import firebase from 'firebase'

const users = {
  namespaced: true,
  state: {
    user: null,
    authUser: null,
    approvedUsers: []
  },
  mutations: {
    clearState(state) {
      state.user = null
      state.authUser = null
      state.approvedUsers = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    updateRole(context, role) {
      const userId = firebase.auth().currentUser.uid

      let updatedUser = {
        uid: context.state.user.uid,
        name: context.state.user.name,
        email: context.state.user.email,
        role: role,
        approved: context.state.user.approved
      }

      Object.keys(updatedUser).forEach(key => {
        if (updatedUser[key] == null) {
          delete updatedUser[key]
        }
      })

      firebase
        .database()
        .ref('/approvedUsers/' + userId + '/')
        .set(updatedUser)
      firebase
        .database()
        .ref('/users/' + userId + '/')
        .set(updatedUser)
    },
    approveUser(context) {
      const userId = firebase.auth().currentUser.uid
      firebase
        .database()
        .ref('/approvedUsers/' + userId + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()
          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('approvedUsers/' + userId + '/')
              .set({
                uid: userId,
                name: context.state.user.name,
                email: context.state.user.email,
                role: null,
                approved: context.state.user.approved
              })
          }
        })
        .then(() => {
          context.dispatch('listApprovedUsers')
        })
    },
    loadUser(context) {
      return new Promise(resolve => {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            context.commit('replaceValue', { key: 'authUser', value: user })
            const userId = firebase.auth().currentUser.uid
            firebase
              .database()
              .ref('/users/' + userId)
              .once('value')
              .then(snapshot => {
                const data = snapshot.val()
                if (data == null || data == 'null') {
                  firebase
                    .database()
                    .ref('users/' + user.uid + '/')
                    .set({
                      uid: userId,
                      name: user.displayName,
                      email: user.email,
                      role: null,
                      approved: false
                    })
                }
              })
              .then(() => {
                firebase
                  .database()
                  .ref('/users/' + userId)
                  .on('value', snapshot => {
                    const data = snapshot.val()
                    if (data !== null && data !== 'null') {
                      context.commit('replaceValue', {
                        key: 'user',
                        value: data
                      })
                      if (data.approved == true) {
                        context.dispatch('approveUser')
                      }
                      resolve(data)
                    }
                  })
              })
          }
        })
      })
    },
    listApprovedUsers(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('approvedUsers')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)
              context.commit('replaceValue', {
                key: 'approvedUsers',
                value: arr
              })
            })
          })
      })
    }
  }
}
export default users
