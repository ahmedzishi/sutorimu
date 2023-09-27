<template>
  <div>
    <canvas id="pie-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import store from '@/store/index'
export default {
  name: 'pieChart',
  data() {
    return {
      pieChart: null
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('pie-chart')
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'Standard',
            'High Priority',
            'Misc',
            'Unit',
            'QA',
            'Regression',
            'Integration',
            'UAT',
            'Other'
          ],
          datasets: [
            {
              label: 'Total Tickets By Label',
              data: [
                this.standard.length,
                this.highpriority.length,
                this.misc.length,
                this.unit.length,
                this.qa.length,
                this.regression.length,
                this.integration.length,
                this.uat.length,
                this.other.length
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
      this.pieChart.update()
    }
  },
  computed: {
    standard() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Standard'
      })

      return stories || []
    },
    highpriority() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'High Priority'
      })

      return stories || []
    },
    misc() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Misc'
      })

      return stories || []
    },
    unit() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Unit'
      })

      return stories || []
    },
    qa() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'QA'
      })

      return stories || []
    },
    regression() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Regression'
      })

      return stories || []
    },
    integration() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Integration'
      })

      return stories || []
    },
    uat() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'UAT'
      })

      return stories || []
    },
    other() {
      const stories = this.stories.filter(function(u) {
        return u.label == 'Other'
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
    this.pieChart.reset()
  }
}
</script>
