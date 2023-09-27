import firebase from 'firebase'
const sprints = {
  namespaced: true,
  state: {
    sprints: []
  },
  mutations: {
    clearState(state) {
      state.sprints = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    updateSprint(context, sprint) {
      let updatedSprint
      if (sprint.stories) {
        updatedSprint = {
          uid: sprint.uid,
          created: sprint.created,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          stories: sprint.stories,
          status: sprint.status
        }
      } else {
        updatedSprint = {
          uid: sprint.uid,
          created: sprint.created,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          stories: [],
          status: sprint.status
        }
      }

      firebase
        .database()
        .ref('/sprints/' + sprint.uid + '/')
        .set(updatedSprint)
        .then(() => {
          context.dispatch('listSprints')
        })
    },
    deleteSprint(context, payload) {
      const storyId = payload.stories.filter(function(s) {
        return s.sprint == payload.sprint.uid
      })
      if (storyId.length == 1) {
        delete storyId[0].sprint
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
        .ref('/sprints/' + payload.sprint.uid + '/')
        .remove()
        .then(() => {
          context.dispatch('listSprints')
        })
        .catch(er => console.log(er))
    },
    createSprint(context, sprint) {
      const reference = firebase
        .database()
        .ref('sprints')
        .push()
      const uniqueKey = reference.key
      firebase
        .database()
        .ref('/sprints/' + uniqueKey + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()

          let createSprint
          if (sprint.stories) {
            createSprint = {
              uid: uniqueKey,
              created: sprint.created,
              startDate: sprint.startDate,
              endDate: sprint.endDate,
              stories: sprint.stories,
              status: sprint.status
            }
          } else {
            createSprint = {
              uid: uniqueKey,
              created: sprint.created,
              startDate: sprint.startDate,
              endDate: sprint.endDate,
              stories: null,
              status: sprint.status
            }
          }

          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('sprints/' + uniqueKey + '/')
              .set(createSprint)
          }
        })
        .then(() => {
          context.dispatch('listSprints')
        })
        .catch(er => console.log(er))
    },

    listSprints(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('sprints')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)

              context.commit('replaceValue', {
                key: 'sprints',
                value: arr
              })
              resolve(arr)
            })
          })
      })
    }
  }
}
export default sprints
