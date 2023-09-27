<template>
  <div>
    <canvas id="doughnut-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import store from '@/store/index'
export default {
  name: 'doughnutChart',
  data() {
    return {
      doughnutChart: null
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('doughnut-chart')
      this.doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Prioritized',
            'Requirements',
            'Ready for Estimation',
            'Sprint Ready',
            'To Do',
            'In Progress',
            'Review',
            'Production Ready',
            'Closed'
          ],
          datasets: [
            {
              label: 'Total Tickets By Label',
              data: [
                this.prioritized.length,
                this.requirements.length,
                this.readyForEstimation.length,
                this.sprintReady.length,
                this.toDo.length,
                this.inProgress.length,
                this.review.length,
                this.productionReady.length,
                this.closed.length
              ],
              backgroundColor: [
                '#FF8A80',
                '#66E64D',
                '#4D80CC',
                '#9900B3',
                '#E64D66',
                '#4DB380',
                '#FF4D4D',
                '#99E6E6',
                '#6666FF'
              ],
              borderColor: '#d5d5d5',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true
        }
      })
      this.doughnutChart.update()
    }
  },
  computed: {
    prioritized() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Prioritized'
      })

      return stories || []
    },
    requirements() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Requirements'
      })

      return stories || []
    },
    readyForEstimation() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Ready for Estimation'
      })

      return stories || []
    },
    sprintReady() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Sprint Ready'
      })

      return stories || []
    },
    toDo() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'To Do'
      })

      return stories || []
    },
    inProgress() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'In Progress'
      })

      return stories || []
    },
    review() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Review'
      })

      return stories || []
    },
    productionReady() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Production Ready'
      })

      return stories || []
    },
    closed() {
      const stories = this.stories.filter(function(u) {
        return u.status == 'Closed'
      })

      return stories || []
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
  mounted() {
    setTimeout(() => {
      this.renderChart()
    }, 100)
  },
  beforeUnmount() {
    this.doughnutChart.reset()
  }
}
</script>
