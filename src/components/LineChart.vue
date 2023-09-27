<template>
  <div>
    <canvas id="line-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js'
import store from '@/store/index'
export default {
  name: 'lineChart',
  data() {
    return {
      lineChart: null
    }
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('line-chart')
      this.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ],
          datasets: [
            {
              label: 'Tickets created by month',
              data: [
                this.jan.length,
                this.feb.length,
                this.mar.length,
                this.apr.length,
                this.may.length,
                this.jun.length,
                this.jul.length,
                this.aug.length,
                this.sep.length,
                this.oct.length,
                this.nov.length,
                this.dec.length
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
                '#6666FF',
                '#2962FF',
                '#9FA8DA',
                '#7986CB',
                '#5C6BC0',
                '#3F51B5'
              ],
              fill: '#2196f3',
              borderColor: '#2196f3',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true
        }
      })
      this.lineChart.update()
    }
  },
  computed: {
    jan() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Jan'
        )
      })

      return stories || []
    },
    feb() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Feb'
        )
      })

      return stories || []
    },
    mar() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Mar'
        )
      })

      return stories || []
    },
    apr() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Apr'
        )
      })

      return stories || []
    },
    may() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'May'
        )
      })

      return stories || []
    },
    jun() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Jun'
        )
      })

      return stories || []
    },
    jul() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Jul'
        )
      })

      return stories || []
    },
    aug() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Aug'
        )
      })

      return stories || []
    },
    sep() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Sep'
        )
      })

      return stories || []
    },
    oct() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Oct'
        )
      })

      return stories || []
    },
    nov() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Nov'
        )
      })

      return stories || []
    },
    dec() {
      const stories = this.stories.filter(function(u) {
        const month = new Date(u.created.replace(/['"]+/g, ''))
        return (
          month.toLocaleString('en-US', {
            month: 'short'
          }) == 'Dec'
        )
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
    this.lineChart.reset()
  }
}
</script>
