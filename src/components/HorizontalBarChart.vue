<template>
  <div>
    <canvas id="horizontal-bar-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import store from '@/store/index'
export default {
  name: 'HorizontalBarChart',
  data() {
    return {
      barChart: null
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('horizontal-bar-chart')
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Initiatives', 'Epics', 'Tickets', 'Teams'],
          datasets: [
            {
              label: 'Totals by type',
              data: [
                this.initiatives.length,
                this.epics.length,
                this.stories.length,
                this.teams.length
              ],
              backgroundColor: ['#4caf50', '#ff5252', '#424242', '#fb8c00'],
              borderColor: '#d5d5d5',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          indexAxis: 'y',
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25
                }
              }
            ]
          }
        }
      })
      this.barChart.update()
    }
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
  mounted() {
    setTimeout(() => {
      this.renderChart()
    }, 100)
  },
  beforeUnmount() {
    this.barChart.reset()
  }
}
</script>
