<template>
  <div class="terminal-two" v-if="$route.matched[3].path === '/report/:type/detail/:fileid/:taskid/terminal/:serial'">
    <div class="two-top">
      <h1 class="two-top-title">{{curdevices.manufacturer}}</h1>
      <div class="terminal-two-content">
        <div class="terminal-two-content-left" v-if="curdevices.phone">
          <span>终端型号: {{curdevices.model}}</span>
          <span>操作系统: {{curdevices.version}}</span>
          <span>IMEI: {{curdevices.phone.imei}}</span>
          <span>屏幕尺寸: {{xdpi}}×{{ydpi}}</span>
          <span>分辨率: {{curdevices.display.width}}×{{curdevices.display.height}}</span>
          <span>网络: {{curdevices.network.type}}</span>
        </div>
        <div class="terminal-two-content-right" v-if="isShowTop">
          <p>测试结果</p>
          <p>通过<span>(安装{{nowStatusCode != 1 ? "√" : "×"}}－－启动{{(nowStatusCode == 0) || (nowStatusCode == 3) ? "√" : "×"}}－－运行{{nowStatusCode == 0 ? "√" : "×"}})</span></p>
        </div>
      </div>
    </div>
    <div class="two-content">
      <p class="two-content-title">
        <span :class="{isLog: isLog}" @click="logImage('log')">LOG<i></i></span>
        <span :class="{isLog: !isLog}" @click="logImage('image')">截图<i></i></span>
      </p>
      <div v-if="isLog">
        <div class="search">
          <el-input v-model="inputsearch" placeholder="输入关键字查询"></el-input>
          <div class="search-btns">
            <button class="searchs" @click="filter">查询</button>
            <a class="downloads" :href="downloadUrl">下载日志</a>
          </div>
        </div>
        <div class="searchBtn">
          <button v-for="search in searchBtns" @click="searchLog(search)" :class="{current: search.isCur}">{{search.label}}</button>
        </div>
        <el-table id="model-table" :data="filterBy(devicelogs.logcat, filterSearch)" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" :row-class-name="tableRowClassName">
          <el-table-column prop="Level" label="level" align="center">
          </el-table-column>
          <el-table-column prop="Tag" label="tag" align="center">
          </el-table-column>
          <el-table-column prop="textdata" label="text" align="center" width="750px">
          </el-table-column>
        </el-table>
        <el-pagination v-if="logtotal" class="log-page" layout="sizes, total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="logtotal" @size-change="sizeChange" @current-change="pageIndexChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400, 500]">
        </el-pagination>
      </div>
      <div class="screens" v-else="!isLog">
        <ul class="screen-box">
          <li v-for="item in screenImgs">
            <a href="javascript:;" target="_blank" @click="showBigImage(item)">
              <img :src="item" alt="">
            </a>
          </li>
        </ul>
        <el-pagination v-if="screeLength" layout="total, prev, pager, next" :current-page="imagePageIndex" :page-size="imagePageSize" :total="screeLength" @size-change="imageSizeChange" @current-change="imagePageIndexChange">
        </el-pagination>
        <p v-if="isWarn">{{warn}}</p>
      </div>
    </div>
    <big-image :show="isShowBig" :src="bigImgSrc" @closeImage="closeImage"></big-image>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import bigImage from './BigImage'

export default {
  data () {
    return {
      routeTaskid: '',
      routeSerial: '',
      routeType: '',
      searchBtns: [
        {
          label: '全部日志',
          value: 'All',
          isCur: true
        },
        {
          label: 'Error',
          value: 'Error',
          isCur: false
        },
        {
          label: 'Warn',
          value: 'Warn',
          isCur: false
        },
        {
          label: 'Debug',
          value: 'Debug',
          isCur: false
        },
        {
          label: 'Info',
          value: 'Info',
          isCur: false
        }
      ],
      isLog: true,
      inputsearch: '',
      pageIndex: 1,
      pageSize: 10,
      filterSearch: '',
      isWarn: false,
      warn: '',
      screenImgs: [],
      imagePageIndex: 1,
      imagePageSize: 8,
      isShowBig: false,
      bigImgSrc: ''
    }
  },
  created () {
    this.routeTaskid = this.$route.params.taskid
    this.routeSerial = this.$route.params.serial
    this.routeType = this.$route.params.type
    let options = {
      taskid: this.$route.params.taskid,
      type: this.routeType
    }
    this.getDetailReports(options)
    this.getCurDevices(this.routeSerial)
    let searchOptions = {
      taskid: this.routeTaskid,
      phone: this.routeSerial,
      type: 'All',
      startn: 1,
      endn: this.pageSize
    }
    this.getDeviceLogs(searchOptions)
  },
  computed: {
    ...mapGetters([
      'detailreports',
      'devicelogs',
      'devImages',
      'curdevices'
    ]),
    loading () {
      if (this.devicelogs.logcat) {
        return false
      } else {
        return true
      }
    },
    nowStatusCode () {
      if (this.detailreports.detail) {
        let status
        this.detailreports.detail.forEach((item) => {
          if (item.serial === this.routeSerial) {
            status = item.statusCode
          }
        })
        return status
      }
    },
    isShowTop () {
      if (this.nowStatusCode === 0 || this.nowStatusCode === 1 || this.nowStatusCode === 2 || this.nowStatusCode === 3) {
        return true
      } else {
        return false
      }
    },
    xdpi () {
      if (this.curdevices.display) {
        let xdpi = Math.ceil(this.curdevices.display.xdpi)
        return xdpi
      }
    },
    ydpi () {
      if (this.curdevices.display) {
        let ydpi = Math.ceil(this.curdevices.display.ydpi)
        return ydpi
      }
    },
    logtotal () {
      if (this.devicelogs) {
        let allLine = String(this.devicelogs.AllLine).replace(/\n$/g, '')
        allLine = parseInt(allLine)
        return allLine
      }
    },
    downloadUrl () {
      if (this.routeTaskid && this.routeSerial) {
        return this.$store.state.configApi.download + this.routeTaskid + '/' + this.routeSerial
      }
    },
    screeLength () {
      let serial = this.$route.params.serial
      let length
      if (this.detailreports.detail) {
        this.detailreports.detail.forEach((item) => {
          if (item.serial === serial) {
            if (item.screenCap) {
              length = item.screenCap.length
            } else {
              length = 0
            }
          }
        })
      }
      return length
    }
  },
  methods: {
    ...mapActions([
      'getDetailReports',
      'getDeviceLogs',
      'getDevImages',
      'getCurDevices'
    ]),
    logImage (type) {
      this.isLog = !this.isLog
      let option = {}
      option.taskid = this.routeTaskid
      option.serials = this.routeSerial
      this.screenImgs = []
      this.imagePageIndex = 1
      if (!this.screeLength) {
        this.isWarn = !this.isWarn
        this.warn = '该测试机型没有截图'
      } else {
        for (let i = 0; i <= 7; i++) {
          let num = i + 1
          if (num > this.screeLength) {
            return
          }
          this.screenImgs.push(this.$store.state.configApi.stfScreen + option.taskid + '/' + option.serials + '/' + num)
        }
      }
    },
    searchLog (search) {
      this.searchBtns.forEach((item) => {
        item.isCur = false
      })
      search.isCur = true
      let searchOptions = {
        taskid: this.routeTaskid,
        phone: this.routeSerial,
        type: search.value,
        startn: 1,
        endn: this.pageSize
      }
      if (searchOptions.startn === 1 && searchOptions.endn === this.pageSize) {
        this.pageIndex = 1
        this.getDeviceLogs(searchOptions)
      }
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      this.pageIndex = 1
      let logCur = ''
      this.searchBtns.forEach((item) => {
        if (item.isCur) {
          logCur = item.value
          let searchOptions = {
            taskid: this.routeTaskid,
            phone: this.routeSerial,
            type: logCur,
            startn: (this.pageIndex - 1) * this.pageSize + 1,
            endn: this.pageIndex * this.pageSize
          }
          this.getDeviceLogs(searchOptions)
        }
      })
    },
    pageIndexChange (pageIndex) {
      this.pageIndex = pageIndex
      let logCur = ''
      this.searchBtns.forEach((item) => {
        if (item.isCur) {
          logCur = item.value
          let searchOptions = {
            taskid: this.routeTaskid,
            phone: this.routeSerial,
            type: logCur,
            startn: (pageIndex - 1) * this.pageSize + 1,
            endn: pageIndex * this.pageSize
          }
          this.getDeviceLogs(searchOptions)
        }
      })
    },
    filter () {
      this.filterSearch = this.inputsearch
    },
    imageSizeChange (pageSize) {
    },
    imagePageIndexChange (pageIndex) {
      this.imagePageIndex = pageIndex
      this.screenImgs = []
      for (let i = (pageIndex - 1) * this.imagePageSize; i <= pageIndex * 8 - 1; i++) {
        let num = i + 1
        if (num > this.screeLength) {
          return
        }
        this.screenImgs.push(this.$store.state.configApi.stfScreen + this.routeTaskid + '/' + this.routeSerial + '/' + num)
      }
    },
    showBigImage (imgSrc) {
      this.isShowBig = true
      this.bigImgSrc = imgSrc
    },
    closeImage (boolean) {
      this.isShowBig = boolean
      this.bigImgSrc = ''
    },
    tableRowClassName (row, index) {
      if (row.Level === 'undefined') {
        return 'level-undefined'
      }
      if (row.Level === '[E]' || row.Level === 'E') {
        return 'level-error'
      }
      if (row.Level === '[W]' || row.Level === 'W') {
        return 'level-warn'
      }
      if (row.Level === '[D]' || row.Level === 'D') {
        return 'level-debug'
      }
      if (row.Level === '[I]' || row.Level === 'I') {
        return 'level-info'
      }
      return ''
    }
  },
  components: {
    bigImage
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.terminal-two
  th
    .cell
      color: #1f92f3
      font-weight: bold
  .level-undefined
    color: #b724ff
  .level-error
    color: rgb(254, 0, 0)
  .level-warn
    color: rgb(255, 127, 0)
  .level-debug
    color: rgb(83, 0, 183)
  .level-info
    color: rgb(50, 204, 37)
  .two-top
    height: 150px
    background: #fff
    padding: 30px
    box-sizing()
    color: #5d5e5e
    .two-top-title
      height: 30px
      line-height: 30px
      font-size: 18px
    .terminal-two-content
      height: 60px
      display: block
      .terminal-two-content-left
        width: 70%
        float: left
        span
          display: inline-block
          width: 32%
          height: 30px
          line-height: 30px
      .terminal-two-content-right
        width: 30%
        float: left
        p
          height: 30px
          line-height: 30px
          color: #5e5e5e
          font-weight: bold
          span
            font-weight: normal
  .two-content
    margin-top: 20px
    .two-content-title
      height: 39px
      border-bottom: 1px solid #e7e7e7
      span
        display: inline-block
        margin-right: 10px
        width: 40px
        height: 40px
        line-height: 40px
        text-align: center
        position: relative
        cursor: pointer
        i
          position: absolute
          height: 2px
          width: 100%
          left: 0
          bottom: 0
          background: transparent
        &:hover
          color: #1f92f3
          i
            background: #1f92f3
        &.isLog
          color: #1f92f3
          i
            background: #1f92f3
    .search
      overflow: hidden
      margin: 25px 0
      .el-input
        width: 700px
        box-sizing()
        height: 36px
        line-height: 36px
        float: left
      .search-btns
        float: right
        button
          margin-left: 20px
          border: 0
          width: 98px
          height: 36px
          box-sizing()
          text-align: center
          cursor: pointer
          &.searchs
            border: 1px solid #1f92f3
            color: #1f92f3
            line-height: 34px
            background: #fff
        a
          margin-left: 20px
          border: 0
          width: 98px
          height: 36px
          display: inline-block
          box-sizing()
          text-align: center
          &.downloads
            background: #1f92f3
            color: #fff
            line-height: 34px
            border: 1px solid #1f92f3
    .searchBtn
      button
        display: inline-block
        height: 26px
        line-height: 26px
        font-family: inherit
        white-space: nowrap
        cursor: pointer
        background: #fff
        border: 1px solid #1f92f3
        -webkit-appearance: none
        text-align: center
        box-sizing: border-box
        outline: none
        margin: 0
        -moz-user-select: none
        -webkit-user-select: none
        -ms-user-select: none
        padding: 0 20px
        font-size: 14px
        margin-right: 10px
        color: #1f92f3
        border-radius: 20px
        margin-bottom: 10px
        &:hover
          color: #fff
          border-color: #1f92f3
          background: #1f92f3
        &.current
          color: #fff
          border-color: #1f92f3
          background: #1f92f3
    .log-page
      margin-top: 20px
      li
        &.active
          background: #1f92f3
          border-color: #1f92f3
        &:hover
          color: #fff
          background: #1f92f3
          border-color: #1f92f3
    .screens
      margin-top: 20px
      ul.screen-box
        width: 100%
        overflow: hidden
        li
          float: left
          width: 25%
          padding: 20px
          box-sizing()
          img
            width: 100%
</style>
