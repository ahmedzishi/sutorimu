import firebase from 'firebase'

const stories = {
  namespaced: true,
  state: {
    stories: []
  },
  mutations: {
    clearState(state) {
      state.stories = []
    },
    replaceValue(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    addReply(context, comment) {
      const reference = firebase
        .database()
        .ref(
          '/stories/' +
            comment.story_uid +
            '/comments/' +
            comment.comment_uid +
            '/replies/'
        )
        .push()
      const uniqueKey = reference.key
      const commentMsg = {
        reply: comment.reply,
        time: comment.time,
        user: comment.user,
        uid: uniqueKey
      }
      firebase
        .database()
        .ref(
          '/stories/' +
            comment.story_uid +
            '/comments/' +
            comment.comment_uid +
            '/replies/' +
            uniqueKey
        )
        .set(commentMsg)
        .then(() => {
          context.dispatch('listStories')
        })
    },
    addComment(context, comment) {
      const reference = firebase
        .database()
        .ref('/stories/' + comment.story_uid + '/comments/')
        .push()
      const uniqueKey = reference.key
      const commentMsg = {
        comment: comment.comment,
        time: comment.time,
        user: comment.user,
        uid: uniqueKey
      }
      firebase
        .database()
        .ref('/stories/' + comment.story_uid + '/comments/' + uniqueKey)
        .set(commentMsg)
        .then(() => {
          context.dispatch('listStories')
        })
    },
    updateStory(context, story) {
      let updatedStory = {
        uid: story.uid,
        title: story.title,
        description: story.description,
        created: story.created,
        createdBy: story.createdBy,
        startDate: story.startDate,
        endDate: story.endDate,
        epic: story.epic,
        team: story.team,
        status: story.status,
        label: story.label,
        type: story.type,
        comments: story.comments,
        points: story.points
      }

      firebase
        .database()
        .ref('/stories/' + story.uid + '/')
        .set(updatedStory)
        .then(() => {
          context.dispatch('listStories')
        })
    },
    deleteStory(context, story) {
      firebase
        .database()
        .ref('/stories/' + story.uid + '/')
        .remove()
        .then(() => {
          context.dispatch('listStories')
        })
        .catch(er => console.log(er))
    },
    createStory(context, story) {
      const reference = firebase
        .database()
        .ref('stories')
        .push()
      const uniqueKey = reference.key
      firebase
        .database()
        .ref('/stories/' + uniqueKey + '/')
        .once('value')
        .then(snapshot => {
          const data = snapshot.val()
          if (data == null || data == 'null') {
            firebase
              .database()
              .ref('stories/' + uniqueKey + '/')
              .set({
                uid: uniqueKey,
                title: story.title,
                description: story.description,
                created: story.created,
                createdBy: story.createdBy,
                startDate: story.startDate,
                endDate: story.endDate,
                epic: story.epic,
                team: story.team,
                status: story.status,
                label: story.label,
                type: story.type,
                points: story.points
              })
          }
        })
        .then(() => {
          context.dispatch('listStories')
        })
        .catch(er => console.log(er))
    },
    listStories(context) {
      return new Promise(resolve => {
        firebase
          .database()
          .ref('stories')
          .on('value', snapshot => {
            const arr = []
            snapshot.forEach(function(childsnap) {
              var k = childsnap.key
              var d = childsnap.val()
              arr.push(d)
              context.commit('replaceValue', {
                key: 'stories',
                value: arr
              })
              resolve(arr)
            })
          })
      })
    }
  }
}
export default stories
