<template>
  <div class="detail-test container">
    <div class="app-information">
      <div class="app-information-left">
        <img class="apk-image" :src="logo + fileid">
        <div class="information-box">
          <p class="apk-name">{{detailreports.appName}}</p>
          <p class="apk-version" v-if="detailreports.versionName">{{versionName}}</p>
          <p class="line">
            <span></span>
          </p>
          <p class="apk-all" v-if="detailreports.detail">测试终端数: {{detailreports.detail.length}}</p>
          <p class="apk-success" v-if="detailreports.detail">通过终端数: {{successdetail}}</p>
        </div>
      </div>
      <div class="app-information-right">
        <div class="app-chart" v-if="isShowChart && isPercent">
          <x-chart :success-per="percent" :chart-data="chartdata"></x-chart>
          <div class="app-chart-right">
            <div class="right-top">
              <div class="avgapp-launchtime">
                <div class="right-content">
                  <span>启动时间</span>
                  <p>{{avgappLaunchTime}}s</p>
                </div>
              </div>
              <div class="cpu">
                <div class="right-content">
                  <span>CPU占用</span>
                  <p>{{detailreports.cpu}}%</p>
                </div>
              </div>
            </div>
            <div class="right-bottom">
              <div class="memory">
                <div class="right-content">
                  <span>内存占用</span>
                  <p>{{detailreports.memory}}MB</p>
                </div>
              </div>
              <div class="dataflow">
                <div class="right-content">
                  <span>数据流量</span>
                  <p>{{detailreports.dataflow}}KB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="errloglist" style="width: 100%">
      <el-table-column prop="errorType" label="问题类型" align="center">
      </el-table-column>
      <el-table-column prop="reson" label="出错定位" align="center" width="600px">
        <template scope="scope">
          <span class="log-error">{{typeof scope.row.reson === 'object' ? '-' : scope.row.reson}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobilecount" label="发生机型数" align="center">
      </el-table-column>
      <el-table-column prop="model" label="问题机型" align="center">
        <template scope="scope">
          <a class="model" :href="'/report/' + routeType + '/detail/' + routeFileid + '/' + routeTaskid + '/terminal/' + scope.row.serial">{{scope.row.model}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import chart from './Chart'

export default {
  data () {
    return {
      fileid: '',
      isShowChart: true,
      percent: '',
      chart: [],
      nowchart: [],
      routeFileid: '',
      routeTaskid: '',
      routeType: '',
      logo: this.$store.state.configApi.stfReportLogo
    }
  },
  computed: {
    ...mapGetters([
      'detailreports',
      'successdetail',
      'faildetail',
      'successpercent',
      'chartdata',
      'errloglist'
    ]),
    avgappLaunchTime () {
      return (this.detailreports.avgappLaunchTime / 1000).toFixed(2)
    },
    versionName () {
      return String(this.detailreports.versionName).replace(/'$/g, '')
    },
    isPercent () {
      if (this.successpercent === 0 || this.successpercent) {
        this.percent = this.successpercent
        return true
      } else {
        return false
      }
    }
  },
  created () {
    this.routeFileid = this.$route.params.fileid
    this.routeTaskid = this.$route.params.taskid
    this.routeType = this.$route.params.type
    let options = {
      taskid: this.$route.params.taskid,
      type: this.routeType
    }
    this.getDetailReports(options)
    this.getErrLogList(this.$route.params.taskid)
    this.fileid = this.$route.params.fileid
  },
  methods: {
    ...mapActions([
      'getDetailReports',
      'getErrLogList'
    ])
  },
  components: {
    xChart: chart
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.detail-test
  margin-top: 45px
  [v-cloak]
    display: none
  .app-information
    height: 150px
    position: relative
    margin-bottom: 20px
    .app-information-left
      height: 150px
      width: 40%
      float: left
      .apk-image
        width: 150px
        height: 150px
      .information-box
        width: 210px
        position: absolute
        left: 170px
        top: 10px
        height: 130px
        p
          height: 26px
          line-height: 26px
          color: #919191
          &.apk-name
            font-size: 18px
            color: #1f92f3
          &.line
            height: 26px
            position: relative
            span
              position: absolute
              width: 100%
              height: 1px
              left: 0
              top: 13px
              background: #919191
    .app-information-right
      width: 60%
      float: left
      height: 150px
      position: relative
      box-sizing()
      border-left: 1px solid #919191
      .app-chart
        position: absolute
        left: 0
        height: 150px
        width: 100%
        margin-left: 20px
        box-sizing()
        .app-chart-right
          padding: 20px 10px
          .right-top, .right-bottom
            overflow: hidden
            padding-left: 20px
            .avgapp-launchtime, .cpu, .memory, .dataflow
              height: 45px
              padding-top: 10px
              width: 160px
              float: left
              color: #888888
              .right-content
                height: 45px
                p
                  height: 30px
                  line-height: 30px
                  color: #1f92f3
                  font-size: 18px
  .el-table
    th
      .cell
        color: #1f92f3
        font-weight: bold
    td
      .cell
        color: #555555
    .log-error
      display: block
      height: 24px
      line-height: 24px
      white-space: nowrap
      width: 100%
      overflow: hidden
      text-overflow: ellipsis
</style>
