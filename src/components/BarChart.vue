<template>
  <div>
    <canvas id="bar-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import store from '@/store/index'
export default {
  name: 'BarChart',
  data() {
    return {
      barChart: null
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('bar-chart')
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Story', 'Bug', 'Tech Debt', 'Risk'],
          datasets: [
            {
              label: 'Total Tickets By Type',
              data: [
                this.storyTicketData.length,
                this.bugTicketData.length,
                this.techDebtTicketData.length,
                this.riskTicketData.length
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
          scales: {
            yAxes: [
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
    storyTicketData() {
      const stories = this.stories.filter(function(u) {
        return u.type == 'Story'
      })

      return stories || []
    },
    bugTicketData() {
      const stories = this.stories.filter(function(u) {
        return u.type == 'Bug'
      })

      return stories || []
    },
    riskTicketData() {
      const stories = this.stories.filter(function(u) {
        return u.type == 'Risk'
      })

      return stories || []
    },
    techDebtTicketData() {
      const stories = this.stories.filter(function(u) {
        return u.type == 'Tech Debt'
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
    this.barChart.reset()
  }
}
</script>
