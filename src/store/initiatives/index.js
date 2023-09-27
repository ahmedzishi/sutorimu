import firebase from 'firebase'

const initiatives = {
  namespaced: true,
  state: {
    initiatives: []
  },
  mutations: {
    clearState(state) {
      state.initiatives = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    updateInitiative(context, initiative) {
      let updatedInitiative = {
        uid: initiative.uid,
        title: initiative.title,
        description: initiative.description,
        created: initiative.created,
        createdBy: initiative.createdBy,
        startDate: initiative.startDate,
        endDate: initiative.endDate
      }

      firebase
        .database()
        .ref('/initiatives/' + initiative.uid + '/')
        .set(updatedInitiative)
        .then(() => {
          context.dispatch('listInitiatives')
        })
    },
    deleteInitiative(context, payload) {
      const epicId = payload.epics.filter(function(e) {
        return e.initiative == payload.initiative.uid
      })
      if (epicId.length == 1) {
        delete epicId[0].initiative
        firebase
          .database()
          .ref('/epics/' + epicId[0].uid + '/')
          .set(epicId[0])
          .then(() => {
            context.dispatch('epics/listEpics')
          })
          .catch(er => console.log(er))
      }

      firebase
        .database()
        .ref('/initiatives/' + payload.initiative.uid + '/')
        .remove()
        .then(() => {
          context.dispatch('listInitiatives')
        })
        .catch(er => console.log(er))
    },
    createInitiative(context, initiative) {
      const reference = firebase
        .database()
        .ref('initiatives')
        .push()
      const uniqueKey = reference.key
      firebase
        .database()
        .ref('/initiatives/' + uniqueKey + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()
          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('initiatives/' + uniqueKey + '/')
              .set({
                uid: uniqueKey,
                title: initiative.title,
                description: initiative.description,
                created: initiative.created,
                createdBy: initiative.createdBy,
                startDate: initiative.startDate,
                endDate: initiative.endDate
              })
          }
        })
        .then(() => {
          context.dispatch('listInitiatives')
        })
        .catch(er => console.log(er))
    },
    listInitiatives(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('initiatives')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)
              context.commit('replaceValue', {
                key: 'initiatives',
                value: arr
              })
            })
          })
      })
    }
  }
}
export default initiatives
