<template>
  <div class="test-chart">
    <div :id="chart"></div>
  </div>
</template>

<script>
import HighCharts from 'highcharts'

export default {
  props: [
    'successPer',
    'chartData'
  ],
  data () {
    return {
      chart: 'x-chart'
    }
  },
  methods: {
    initChart: function () {
      HighCharts.chart(this.chart, {
        chart: {
          type: 'pie',
          backgroundColor: 'rgba(255, 255, 255, 0)',
          width: 150,
          height: 160
        },
        title: {
          floating: true,
          text: '<span style="color: #a4a4a4; font-size: 14px;">通过率</span><  br/><span class="percent" style="color: #1f92f3; font-size: 38px">  ' + this.successPer + '%</span>',
          y: 40
        },
        credits: {
          text: ''
        },
        plotOptions: {
          pie: {
            size: 150,
            dataLabels: {
              enabled: false
            },
            innerSize: '140',
            colors: ['#1f92f3', '#e6e6e6']
          }
        },
        series: [
          {
            data: this.chartData,
            states: {
              hover: {
                enabled: false
              }
            }
          }
        ]
      })
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.test-chart
  overflow: hidden
  float: left
  #x-chart
    height: 160px
    width: 150px
    float: left
</style>
