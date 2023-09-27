import firebase from 'firebase'
const teams = {
  namespaced: true,
  state: {
    teams: []
  },
  mutations: {
    clearState(state) {
      state.teams = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    updateTeam(context, team) {
      let updatedTeam = {
        uid: team.uid,
        name: team.name,
        members: team.members
      }

      firebase
        .database()
        .ref('/teams/' + team.uid + '/')
        .set(updatedTeam)
        .then(() => {
          context.dispatch('listTeams')
        })
    },
    deleteTeam(context, payload) {
      const storyId = payload.stories.filter(function(s) {
        return s.team == payload.team.uid
      })
      if (storyId.length == 1) {
        delete storyId[0].team
        firebase
          .database()
          .ref('/stories/' + storyId[0].uid + '/')
          .set(storyId[0])
          .then(() => {
            context.dispatch('stories/listStories')
          })
          .catch(er => console.log(er))
      }

      firebase
        .database()
        .ref('/teams/' + payload.team.uid + '/')
        .remove()
        .then(() => {
          context.dispatch('listTeams')
        })
        .catch(er => console.log(er))
    },
    createTeam(context, team) {
      const reference = firebase
        .database()
        .ref('teams')
        .push()
      const uniqueKey = reference.key
      firebase
        .database()
        .ref('/teams/' + uniqueKey + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()
          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('teams/' + uniqueKey + '/')
              .set({
                uid: uniqueKey,
                name: team.name,
                members: team.members
              })
          }
        })
        .then(() => {
          context.dispatch('listTeams')
        })
        .catch(er => console.log(er))
    },

    listTeams(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('teams')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)
              context.commit('replaceValue', {
                key: 'teams',
                value: arr
              })
            })
          })
      })
    }
  }
}
export default teams
