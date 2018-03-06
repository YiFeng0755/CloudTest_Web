<template>
  <div class="uiauto-report container" v-if="uiautolists.result">
    <item-header :title="title"></item-header>
    <div class="uiauto-top">
      <div class="uiauto-survey">
        <div class="report-top-left">
          <p class="testName">{{uiautolists.result.testName}}</p>
          <p>
            <span>项目: {{uiautolists.result.projectName}}</span>
            <span>提测人: {{uiautolists.result.committer}}</span>
            <span>提测时间: {{commitTime}}</span>
          </p>
        </div>
        <div class="report-top-right">
          <a :href="reportLink">下载报告</a>
        </div>
      </div>
      <table class="uiauto-table">
        <thead>
          <tr>
            <th>开始时间</th>
            <!-- <th>结束时间</th> -->
            <th>持续时间</th>
            <th>状态</th>
            <th>测试APK</th>
            <th>运行设备</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{startTime}}</td>
            <!-- <td>{{endTime}}</td> -->
            <td>{{surveyTime}}</td>
            <td>{{uiautolists.result.status === 'finish' ? '完成' : '进行中'}}</td>
            <td>{{uiautolists.result.appName}}</td>
            <td>{{uiautolists.result.devices.length}}台</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="uiauto-search" v-if="isContent">
      <div class="search-auto">
        <p>
          <span class="search-title">系统版本:</span>
          <span class="search-btnbox">
            <button :class="{ current: isVersionAll }" @click="searchAllVersion">全部</button>
            <span>
              <button v-for="item in uiautolists.os_version" :class="{ current: item.value }" @click="searchVersion(item)">{{item.label}}</button>
            </span>
          </span>
        </p>
        <p>
          <span class="search-title">分辨率:</span>
          <span class="search-btnbox">
            <button :class="{ current: isDpiAll }" @click="searchAllDpi">全部</button>
            <span>
              <button v-for="item in uiautolists.width_height" :class="{ current: item.value }" @click="searchDpi(item)">{{item.label}}</button>
            </span>
          </span>
        </p>
        <p>
          <span class="search-title">品牌:</span>
          <span class="search-btnbox">
            <button :class="{ current: isMcuAll }" @click="searchAllMcu">全部</button>
            <span>
              <button v-for="item in uiautolists.manufacturer" :class="{ current: item.value }" @click="searchMcu(item)">{{item.label}}</button>
            </span>
          </span>
        </p>
      </div>
      <div class="uiauto-surveyList">
        <el-table :data="uiautodevices" style="width: 100%">
          <el-table-column prop="markName" label="设备名称" align="center">
          </el-table-column>
          <el-table-column prop="version" label="系统版本" align="center">
          </el-table-column>
          <el-table-column label="分辨率" align="center">
            <template scope="scope">
              <span>{{scope.row.width}}×{{scope.row.height}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="执行结果" align="center">
            <template scope="scope">
              <span>{{scope.row.status === 'finish' ? '完成' : '进行中'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试概况" align="center" width="200">
            <template scope="scope">
              <p>
                共<span class="all">{{scope.row.sucCount + scope.row.failCount + scope.row.waitCount}}</span> 成功<span class="success">{{scope.row.sucCount}}</span> 失败<span class="fail">{{scope.row.failCount}}</span> 等待<span class="wait">{{scope.row.waitCount}}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column label="详细" align="center">
            <template scope="scope">
              <a href="javascript:;" @click="autoDetail(scope.row.cases, scope.row.serial, scope.row.markName)">[查看]</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="uiauto-content" v-if="!isContent">
      <h1>{{markName}}-自动化测试报告详情<i class="title-sign"></i></h1>
      <button class="callback" @click="callbackSurvey">返回</button>
      <p class="line"></p>
      <table class="test-table" id="test-table">
        <thead>
          <tr>
            <!-- <th>序号</th> -->
            <th>用例ID</th>
            <th>用例名称</th>
            <th>所属模块</th>
            <th>开始时间</th>
            <!-- <th>结束时间</th> -->
            <th>持续时间</th>
            <th>状态</th>
            <th>截图</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in detailUiAuto" ref="bbc" :class="{ fail: item.result === 'True' ? false : true, success: item.result === 'True' ? true : false }">
            <!-- <td>{{index + 1}}</td> -->
            <td>{{item.logic_id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.suiteName}}</td>
            <td v-text="formatterTable(item.starttime)"></td>
            <!-- <td v-text="formatterTable(item.endtime)"></td> -->
            <td v-text="formatterHMS(item.starttime, item.endtime)"></td>
            <td>
              <span v-if="item.result === 'True'">成功</span>
              <span class="uiauto-fail" v-else-if="item.result === 'False'" @click="addRow(index, 'test-table', item)">失败</span>
              <span v-else>等待</span>
            </td>
            <td>
              <span class="seeImage" @click="screeLength(item.caseId)">[查看]</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="screens" v-if="isShowScreens">
        <h1 v-if="nowSeeImageLenght || noImage">{{markName}}截图</h1>
        <ul class="screen-box">
          <li v-for="item in screenImgs">
            <a href="javascript:;" target="_blank" @click="showBigImage(item)">
              <img :src="item" alt="">
            </a>
          </li>
        </ul>
        <el-pagination v-if="nowSeeImageLenght" layout="total, prev, pager, next" :current-page="imagePageIndex" :page-size="imagePageSize" :total="nowSeeImageLenght" @size-change="imageSizeChange" @current-change="imagePageIndexChange">
        </el-pagination>
        <p v-if="noImage">该项目没有截图！</p>
      </div>
      <big-image :show="isShowBig" :src="bigImgSrc" @closeImage="closeImage"></big-image>
    </div>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import bigImage from './BigImage'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      title: 'UI自动化测试报告',
      isContent: true,
      routeTaskid: '',
      reportLink: '',
      searchVersions: [],
      searchWidth: [],
      searchManufacturer: [],
      detailUiAuto: [],
      screenImgs: [],
      serial: '',
      imagePageIndex: 1,
      imagePageSize: 8,
      isShowBig: false,
      bigImgSrc: '',
      nowSeeImageLenght: '',
      noImage: false,
      markName: '',
      nowCaseid: '',
      isShowScreens: false
    }
  },
  created () {
    this.routeTaskid = this.$route.params.taskid
    this.reportLink = this.$store.state.configApi.download + this.routeTaskid
    this.getUiAutoLists(this.routeTaskid)
    let options = {
      taskid: this.routeTaskid,
      os_version: [],
      dpis: [],
      manufacturer: []
    }
    this.filterUiAutoLists(options)
  },
  components: {
    itemHeader,
    bigImage
  },
  computed: {
    ...mapGetters([
      'uiautolists',
      'uiautodevices'
    ]),
    commitTime () {
      return moment(this.uiautolists.result.commitTime).format('YYYY-MM-DD HH:mm:ss')
    },
    startTime () {
      return moment(this.uiautolists.result.startTime).format('YYYY-MM-DD HH:mm:ss')
    },
    endTime () {
      return moment(this.uiautolists.result.endTime).format('YYYY-MM-DD HH:mm:ss')
    },
    surveyTime () {
      let start = this.uiautolists.result.startTime
      let end = this.uiautolists.result.endTime
      start = moment(start)
      end = moment(end)
      let ms = Math.abs(end.diff(start))
      let hs = moment.duration(ms)
      let hour = Math.floor(hs.asHours())
      if (hour < 10) {
        hour = '0' + hour
      }
      return hour + moment(moment(ms)).format(':mm:ss')
    },
    isVersionAll () {
      if (this.uiautolists.os_version) {
        let versionLength = this.uiautolists.os_version.length
        let isAll = []
        this.uiautolists.os_version.forEach((item) => {
          if (item.value) {
            isAll.push(item)
          }
        })
        if (isAll.length === versionLength) {
          return true
        }
        return false
      }
    },
    isDpiAll () {
      if (this.uiautolists.width_height) {
        let dpiLength = this.uiautolists.width_height.length
        let isAll = []
        this.uiautolists.width_height.forEach((item) => {
          if (item.value) {
            isAll.push(item)
          }
        })
        if (isAll.length === dpiLength) {
          return true
        }
        return false
      }
    },
    isMcuAll () {
      if (this.uiautolists.manufacturer) {
        let mcuLength = this.uiautolists.manufacturer.length
        let isAll = []
        this.uiautolists.manufacturer.forEach((item) => {
          if (item.value) {
            isAll.push(item)
          }
        })
        if (isAll.length === mcuLength) {
          return true
        }
        return false
      }
    }
  },
  methods: {
    ...mapActions([
      'getUiAutoLists',
      'filterUiAutoLists'
    ]),
    autoDetail (cases, serial, markName) {
      this.isContent = !this.isContent
      this.detailUiAuto = cases
      this.serial = serial
      this.markName = markName
    },
    callbackSurvey () {
      this.isContent = true
      this.serial = ''
      this.isShowScreens = false
      let tab = document.getElementById('test-table')
      let tbody = tab.getElementsByTagName('tbody')[0]
      for (let i = 0, lan = this.detailUiAuto.length, flag = true; i <= lan - 1; flag ? i++ : i) {
        if (this.detailUiAuto[i].caseId) {
          if (this.detailUiAuto[i].result === 'False') {
            tbody.rows[i].className = 'fail'
          } else if (this.detailUiAuto[i].result === 'True') {
            tbody.rows[i].className = 'success'
          }
          tbody.rows[i].cells[1].colSpan = 1
          tbody.rows[i].cells[1].innerHTML = this.detailUiAuto[i].name
          tbody.rows[i].cells[0].style.display = ''
          tbody.rows[i].cells[2].style.display = ''
          tbody.rows[i].cells[3].style.display = ''
          tbody.rows[i].cells[4].style.display = ''
          tbody.rows[i].cells[5].style.display = ''
          tbody.rows[i].cells[6].style.display = ''
          flag = true
        } else {
          this.detailUiAuto.splice(i, 1)
          lan = this.detailUiAuto.length
          flag = false
        }
      }
      this.$nextTick(() => {
        this.$router.push(`/report/uiTest/${this.routeTaskid}`)
      })
      // window.location.href = `/report/uiTest/${this.routeTaskid}`
    },
    searchAllVersion () {
      if (this.isVersionAll) {
        this.uiautolists.os_version.forEach((item, index) => {
          this.uiautolists.os_version[index].value = false
        })
        this.searchVersions = []
      } else {
        this.searchVersions = []
        this.uiautolists.os_version.forEach((item, index) => {
          this.uiautolists.os_version[index].value = true
          this.searchVersions.push(item.label)
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchVersion (item) {
      item.value = !item.value
      if (item.value) {
        this.searchVersions.push(item.label)
      } else {
        this.searchVersions = []
        this.uiautolists.os_version.forEach((item, index) => {
          if (item.value) {
            this.searchVersions.push(item.label)
          }
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchAllDpi () {
      if (this.isDpiAll) {
        this.uiautolists.width_height.forEach((item, index) => {
          this.uiautolists.width_height[index].value = false
        })
        this.searchWidth = []
      } else {
        let itemDpiArr
        let numberDpiArr = []
        let dpis = []
        this.uiautolists.width_height.forEach((item, index) => {
          numberDpiArr = []
          this.uiautolists.width_height[index].value = true
          itemDpiArr = String(item.label).split('x')
          itemDpiArr.forEach((item) => {
            item = parseInt(item)
            numberDpiArr.push(item)
          })
          dpis.push(numberDpiArr)
        })
        dpis = Array.from(new Set(dpis))
        this.searchWidth = dpis
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchDpi (item) {
      item.value = !item.value
      if (item.value) {
        let itemDpiArr
        let numberDpiArr = []
        itemDpiArr = String(item.label).split('x')
        itemDpiArr.forEach((item) => {
          item = parseInt(item)
          numberDpiArr.push(item)
        })
        this.searchWidth.push(numberDpiArr)
        this.searchWidth = Array.from(new Set(this.searchWidth))
      } else {
        this.searchWidth = []
        let dpis = []
        this.uiautolists.width_height.forEach((item, index) => {
          let itemDpiArr
          let numberDpiArr = []
          if (item.value) {
            itemDpiArr = String(item.label).split('x')
            itemDpiArr.forEach((item) => {
              item = parseInt(item)
              numberDpiArr.push(item)
            })
            dpis.push(numberDpiArr)
          }
        })
        dpis = Array.from(new Set(dpis))
        this.searchWidth = dpis
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchAllMcu () {
      if (this.isMcuAll) {
        this.uiautolists.manufacturer.forEach((item, index) => {
          this.uiautolists.manufacturer[index].value = false
        })
        this.searchManufacturer = []
      } else {
        this.searchManufacturer = []
        this.uiautolists.manufacturer.forEach((item, index) => {
          this.uiautolists.manufacturer[index].value = true
          this.searchManufacturer.push(item.label)
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchMcu (item) {
      item.value = !item.value
      if (item.value) {
        this.searchManufacturer.push(item.label)
      } else {
        this.searchManufacturer = []
        this.uiautolists.manufacturer.forEach((item, index) => {
          if (item.value) {
            this.searchManufacturer.push(item.label)
          }
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth, this.searchManufacturer)
    },
    searchPost (version, width, manufacturer) {
      let options = {
        taskid: this.routeTaskid,
        os_version: version,
        dpis: width,
        manufacturer: manufacturer
      }
      this.filterUiAutoLists(options)
    },
    formatter (row, column) {
      return moment(row[column.property]).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterTable (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterHMS (starttime, endtime) {
      let start = starttime
      let end = endtime
      start = moment(start)
      end = moment(end)
      let ms = Math.abs(end.diff(start))
      let hs = moment.duration(ms)
      let hour = Math.floor(hs.asHours())
      if (hour < 10) {
        hour = '0' + hour
      }
      let timer = hour + moment(moment(ms)).format(':mm:ss')
      return timer
    },
    screeLength (caseid) {
      this.isShowScreens = true
      this.screenImgs = []
      this.imagePageIndex = 1
      this.nowCaseid = caseid
      let length
      this.detailUiAuto.forEach((item) => {
        if (item.caseid === caseid) {
          if (item.screenCap) {
            length = item.screenCap.length
          } else {
            length = 0
          }
        }
      })
      this.nowSeeImageLenght = length
      this.seeImage(this.nowSeeImageLenght, caseid)
    },
    seeImage (length, caseid) {
      this.screenImgs = []
      this.noImage = false
      if (length) {
        for (let i = 0; i <= 7; i++) {
          let num = i + 1
          if (num > length) {
            return
          }
          this.screenImgs.push(this.$store.state.configApi.stfScreen + this.routeTaskid + '/' + this.serial + '/' + caseid + '/' + num)
        }
      } else {
        this.noImage = true
      }
    },
    imageSizeChange (pageSize) {
    },
    imagePageIndexChange (pageIndex) {
      this.imagePageIndex = pageIndex
      this.screenImgs = []
      for (let i = (pageIndex - 1) * this.imagePageSize; i <= pageIndex * 8 - 1; i++) {
        let num = i + 1
        if (num > this.nowSeeImageLenght) {
          return
        }
        this.screenImgs.push(this.$store.state.configApi.stfScreen + this.routeTaskid + '/' + this.serial + '/' + this.nowCaseid + '/' + num)
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
    addRow (index, obj, item) {
      let tab = document.getElementById(obj)
      let tbody = tab.getElementsByTagName('tbody')[0]
      let tbodyLength = tbody.rows.length
      let nextIndex = index + 1
      if (nextIndex > tbodyLength - 1) {
        this.detailUiAuto.splice(nextIndex, 0, {name: item.error})
        this.$nextTick(() => {
          tbody.rows[nextIndex].className = 'error'
          tbody.rows[nextIndex].cells[1].colSpan = 7
          tbody.rows[nextIndex].cells[1].innerHTML = this.detailUiAuto[nextIndex].name
          tbody.rows[nextIndex].cells[0].style.display = 'none'
          tbody.rows[nextIndex].cells[2].style.display = 'none'
          tbody.rows[nextIndex].cells[3].style.display = 'none'
          tbody.rows[nextIndex].cells[4].style.display = 'none'
          tbody.rows[nextIndex].cells[5].style.display = 'none'
          tbody.rows[nextIndex].cells[6].style.display = 'none'
          return
        })
      } else {
        if (tbody.rows[nextIndex].cells[1].colSpan === 7) {
          this.detailUiAuto.splice(nextIndex, 1)
          this.$nextTick(() => {
            for (let i = 0; i <= this.detailUiAuto.length - 1; i++) {
              if (this.detailUiAuto[i].caseId) {
                if (tbody.rows[i].className === 'error') {
                  if (this.detailUiAuto[i].result === 'False') {
                    tbody.rows[i].className = 'fail'
                  } else {
                    tbody.rows[i].className = 'success'
                  }
                }
                tbody.rows[i].cells[1].colSpan = 1
                tbody.rows[i].cells[1].innerHTML = this.detailUiAuto[i].name
                tbody.rows[i].cells[0].style.display = ''
                tbody.rows[i].cells[2].style.display = ''
                tbody.rows[i].cells[3].style.display = ''
                tbody.rows[i].cells[4].style.display = ''
                tbody.rows[i].cells[5].style.display = ''
                tbody.rows[i].cells[6].style.display = ''
              } else {
                tbody.rows[i].className = 'error'
                tbody.rows[i].cells[1].colSpan = 7
                tbody.rows[i].cells[1].innerHTML = this.detailUiAuto[i].name
                tbody.rows[i].cells[0].style.display = 'none'
                tbody.rows[i].cells[2].style.display = 'none'
                tbody.rows[i].cells[3].style.display = 'none'
                tbody.rows[i].cells[4].style.display = 'none'
                tbody.rows[i].cells[5].style.display = 'none'
                tbody.rows[i].cells[6].style.display = 'none'
              }
            }
          })
        } else {
          this.detailUiAuto.splice(nextIndex, 0, {name: item.error})
          this.$nextTick(() => {
            for (let i = 0; i <= this.detailUiAuto.length - 1; i++) {
              if (this.detailUiAuto[i].caseId) {
                if (this.detailUiAuto[i].result === 'False') {
                  tbody.rows[i].className = 'fail'
                } else {
                  tbody.rows[i].className = 'success'
                }
                tbody.rows[i].cells[1].colSpan = 1
                tbody.rows[i].cells[1].innerHTML = this.detailUiAuto[i].name
                tbody.rows[i].cells[0].style.display = ''
                tbody.rows[i].cells[2].style.display = ''
                tbody.rows[i].cells[3].style.display = ''
                tbody.rows[i].cells[4].style.display = ''
                tbody.rows[i].cells[5].style.display = ''
                tbody.rows[i].cells[6].style.display = ''
              } else {
                tbody.rows[i].className = 'error'
                tbody.rows[i].cells[1].colSpan = 7
                tbody.rows[i].cells[1].innerHTML = this.detailUiAuto[i].name
                tbody.rows[i].cells[0].style.display = 'none'
                tbody.rows[i].cells[2].style.display = 'none'
                tbody.rows[i].cells[3].style.display = 'none'
                tbody.rows[i].cells[4].style.display = 'none'
                tbody.rows[i].cells[5].style.display = 'none'
                tbody.rows[i].cells[6].style.display = 'none'
              }
            }
          })
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.el-popover
  max-width: 700px
  line-height: 24px
.uiauto-report
  .uiauto-top
    margin: 30px 0 42px 30px
    background: #fff
    padding: 25px
    .uiauto-table
      width: 100%
      border: 1px solid #dfe6ec
      border-bottom: 0
      border-collapse: collapse
      border-spacing: 0
      max-height: 240px
      overflow: hidden
      margin: 20px 0
      tr
        border-bottom: 1px solid #dfe6ec
        height: 40px
        line-height: 40px
        transition: background-color .25s ease
        background: #f7f7f7
        th
          background: #eef1f6
          text-align: center
          color: #7c7c7c
          font-weight: bold
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: middle
          min-width: 0
          font-size: 14px
        td
          font-size: 14px
          height: 40px
          line-height: 40px
          text-align: center
          text-overflow: ellipsis
          color: #555
    box-sizing()
    .uiauto-survey
      height: 70px
      margin-bottom: 20px
      .report-top-left
        float: left
        p
          height: 35px
          line-height: 35px
          &.testName
            color: #5d5e5e
            font-size: 18px
            font-weight: bold
          span
            margin-right: 20px
            display: inline-block
            float: left
            height: 35px
            line-height: 35px
            color: #606060
      .report-top-right
        float: right
        a
          display: block
          width: 134px
          height: 44px
          line-height: 44px
          color: #fff
          background: #1f92f3
          text-align: center
  .search-auto
    font-size: 0
    padding-left: 30px
    p
      margin-bottom: 20px
      overflow: hidden
      position: relative
      padding-left: 90px
      span
        &.search-title
          width: 80px
          height: 26px
          line-height: 26px
          text-align: right
          font-size: 14px
          margin-right: 10px
          position: absolute
          left: 0
          top: 0
          font-weight: bold
          color: #1f92f3
        &.search-btnbox
          float: left
          width: 100%
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
  .uiauto-surveyList
    padding-left: 30px
    th
      .cell
        color: #1f92f3
        font-weight: bold
    td
      .cell
        color: #555
        a
          color: #1f92f3
    .el-table
      .all
        color: #1f92f3
      .success
        color: #18c154
      .fail
        color: #eb0707
      .wait
        color: #ebab12
  .uiauto-content
    font-weight: 700
    font-size: 20px
    margin-bottom: 20px
    padding-left: 30px
    box-sizing()
    position: relative
    button.callback
      position: absolute
      right: 0
      top: 0
      height: 30px
      line-height: 30px
      font-family: inherit
      white-space: nowrap
      cursor: pointer
      background: transparent
      border: 0
      -webkit-appearance: none
      text-align: center
      box-sizing: border-box
      outline: none
      margin: 0
      -moz-user-select: none
      -webkit-user-select: none
      -ms-user-select: none
      font-size: 14px
      color: #1f92f3
    p.line
      width: 100%
      height: 1px
      background: #e7e7e7
      position: absolute
      left: 0
      top: 30px
      z-index: -1
      margin-left: 30px
    th
      .cell
        color: #1f92f3
        font-weight: bold
    td
      .cell
        color: #555
    h1
      height: 30px
      line-height: 30px
      display: inline-block
      position: relative
      color: #1f92f3
      margin-bottom: 20px
      .title-sign
        position: absolute
        width: 100%
        height: 2px
        left: 0
        bottom: -1px
        background: #1f92f3
    .el-table
      span
        color: #1f92f3
        cursor: pointer
    .screens
      margin-top: 20px
      h1
        height: 30px
        line-height: 30px
        border-bottom: 1px solid #e7e7e7
        color: #5d5e5e
        width: 100%
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
    .test-table
      width: 100%
      border: 0
      border-bottom: 0
      border-collapse: collapse
      border-spacing: 0
      margin: 20px 0
      .fail
        td
          color: red
      tr
        height: 40px
        line-height: 40px
        transition: background-color .25s ease
        background: #f7f7f7
        th
          background: #eef1f6
          text-align: center
          color: #1f92f3
          font-weight: bold
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          vertical-align: middle
          min-width: 0
          font-size: 14px
          border: 1px solid #dfe6ec
        td
          font-size: 14px
          height: 40px
          line-height: 40px
          text-align: center
          text-overflow: ellipsis
          border: 1px solid #dfe6ec
          a
            color: #1f92f3
        &.error
          td
            font-size: 12px
            text-align: left
            line-height: 20px
            padding: 10px 20px
            .success
              color: green
            .error
              color: red
            .errormsg
              .title
                color: red
              .error_content
                padding-left: 20px
      tbody
        tr
          &:hover
            background-color: #eef1f6
          span.uiauto-fail
            cursor: pointer
          span.seeImage
            color: #1f92f3
            cursor: pointer
</style>
