import firebase from 'firebase'

const epics = {
  namespaced: true,
  state: {
    epics: []
  },
  mutations: {
    clearState(state) {
      state.epics = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    updateEpic(context, epic) {
      let updatedEpic = {
        uid: epic.uid,
        title: epic.title,
        description: epic.description,
        created: epic.created,
        createdBy: epic.createdBy,
        startDate: epic.startDate,
        endDate: epic.endDate,
        initiative: epic.initiative
      }

      firebase
        .database()
        .ref('/epics/' + epic.uid + '/')
        .set(updatedEpic)
        .then(() => {
          context.dispatch('listEpics')
        })
    },
    deleteEpic(context, payload) {
      let storyId = payload.stories.filter(function(s) {
        return s.epic == payload.epic.uid
      })
      if (storyId.length == 1) {
        delete storyId[0].firebase
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
        .ref('/epics/' + payload.epic.uid + '/')
        .remove()
        .then(() => {
          context.dispatch('listEpics')
        })
        .catch(er => console.log(er))
    },
    createEpic(context, epic) {
      const reference = firebase
        .database()
        .ref('epics')
        .push()
      const uniqueKey = reference.key
      firebase
        .database()
        .ref('/epics/' + uniqueKey + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()
          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('epics/' + uniqueKey + '/')
              .set({
                uid: uniqueKey,
                title: epic.title,
                description: epic.description,
                created: epic.created,
                createdBy: epic.createdBy,
                startDate: epic.startDate,
                endDate: epic.endDate,
                initiative: epic.initiative
              })
          }
        })
        .then(() => {
          context.dispatch('listEpics')
        })
        .catch(er => console.log(er))
    },

    listEpics(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('epics')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)
              context.commit('replaceValue', {
                key: 'epics',
                value: arr
              })
            })
          })
      })
    }
  }
}
export default epics
