<template>
  <div class="uiactivity-report container">
    <item-header :title="title"></item-header>
    <div class="padding-left-top">
      <div class="report-top">
        <div class="report-top-left">
          <p class="testName">{{uiactivitylist.testName}}</p>
          <p>
            <span class="activityUrl">
              <a :href="uiactivitylist.activityUrl" target="_blank">{{uiactivitylist.activityUrl}}</a>
            </span>
            <span>提测人: {{uiactivitylist.userName}}</span>
            <span>提测时间: {{uiactivitylist.committime}}</span>
          </p>
        </div>
        <div class="report-top-right">
          <a :href="activityLink">下载报告</a>
        </div>
      </div>
      <div class="search-activity">
        <p>
          <span class="search-title">系统版本:</span>
          <span class="search-btnbox">
            <button :class="{ current: isVersionAll }" @click="searchAllVersion">全部</button>
            <span>
              <button v-for="item in searchOptions.version" :class="{ current: item.value }" @click="searchVersion(item)">{{item.data}}</button>
            </span>
          </span>
        </p>
        <p>
          <span class="search-title">分辨率:</span>
          <span class="search-btnbox">
            <button :class="{ current: isDpiAll }" @click="searchAllDpi">全部</button>
            <span>
              <button v-for="item in searchOptions.dpis" :class="{ current: item.value }" @click="searchDpi(item)">{{item.data}}</button>
            </span>
          </span>
        </p>
      </div>
      <el-table :data="searchDetail" style="width: 100%" v-if="uiactivitylist">
        <el-table-column prop="markName" label="设备名" align="center"></el-table-column>
        <el-table-column prop="version" label="系统版本" align="center"></el-table-column>
        <el-table-column label="分辨率" align="center">
          <template scope="scope">
            <span>{{scope.row.width}}×{{scope.row.height}}</span>
          </template>
        </el-table-column>
        <el-table-column label="截图" align="center">
          <template scope="scope">
            <span class="seeImage" @click="screeLength(scope.row.serial, scope.row.markName)">[查看]</span>
          </template>
        </el-table-column>
        <el-table-column label="真机调试" align="center">
          <template scope="scope">
            <a class="el-table-a" :href="'http://stf-test.oa.com/#!/control/' + scope.row.serial" target="_blank">点击</a>
          </template>
        </el-table-column>
      </el-table>
      <div class="screens">
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
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import bigImage from './BigImage'

export default {
  data () {
    return {
      title: 'UI活动兼容性测试报告',
      routeTaskid: '',
      searchDetail: [],
      searchVersions: [],
      searchWidth: [],
      activityLink: '',
      nowSeeImageLenght: '',
      noImage: false,
      screenImgs: [],
      imagePageIndex: 1,
      imagePageSize: 8,
      nowSerial: '',
      isShowBig: false,
      bigImgSrc: '',
      markName: ''
    }
  },
  components: {
    itemHeader,
    bigImage
  },
  created () {
    this.routeTaskid = this.$route.params.taskid
    this.getUiActivityList(this.routeTaskid)
    this.getUiActivityOption(this.routeTaskid)
    this.searchPost([], [])
    this.activityLink = this.$store.state.configApi.download + this.routeTaskid
  },
  computed: {
    ...mapGetters([
      'uiactivitylist',
      'uiactivityDetail',
      'searchOptions',
      'devImages'
    ]),
    isVersionAll () {
      if (this.searchOptions.version) {
        let versionLength = this.searchOptions.version.length
        let isAll = []
        this.searchOptions.version.forEach((item) => {
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
      if (this.searchOptions.dpis) {
        let dpiLength = this.searchOptions.dpis.length
        let isAll = []
        this.searchOptions.dpis.forEach((item) => {
          if (item.value) {
            isAll.push(item)
          }
        })
        if (isAll.length === dpiLength) {
          return true
        }
        return false
      }
    }
  },
  watch: {
    searchDetail (val, oldVal) {
      if (val !== oldVal) {
        let serial = val[0].serial
        let markName = val[0].markName
        this.screeLength(serial, markName)
      }
    }
  },
  methods: {
    ...mapActions([
      'getUiActivityList',
      'getUiActivityDetail',
      'getUiActivityOption',
      'getDevImages'
    ]),
    searchPost (version, width) {
      axios.post(this.$store.state.configApi.filterTaskActivitydetail, {
        taskid: this.routeTaskid,
        data: {
          version: version,
          width: width
        }
      }, {
        withCredentials: true
      }).then((response) => {
        this.searchDetail = response.data.list
      }).catch((error) => {
        console.log(error)
      })
    },
    searchAllVersion () {
      if (this.isVersionAll) {
        this.searchOptions.version.forEach((item, index) => {
          this.searchOptions.version[index].value = false
        })
        this.searchVersions = []
      } else {
        this.searchVersions = []
        this.searchOptions.version.forEach((item, index) => {
          this.searchOptions.version[index].value = true
          this.searchVersions.push(item.data)
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth)
    },
    searchVersion (item) {
      item.value = !item.value
      if (item.value) {
        this.searchVersions.push(item.data)
      } else {
        this.searchVersions = []
        this.searchOptions.version.forEach((item, index) => {
          if (item.value) {
            this.searchVersions.push(item.data)
          }
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth)
    },
    searchAllDpi () {
      if (this.isDpiAll) {
        this.searchOptions.dpis.forEach((item, index) => {
          this.searchOptions.dpis[index].value = false
        })
        this.searchWidth = []
      } else {
        let itemWidth
        this.searchWidth = []
        this.searchOptions.dpis.forEach((item, index) => {
          this.searchOptions.dpis[index].value = true
          itemWidth = String(item.data).replace(/'*\d$/g, '')
          itemWidth = parseInt(itemWidth)
          this.searchWidth.push(itemWidth)
          this.searchWidth = Array.from(new Set(this.searchWidth))
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth)
    },
    searchDpi (item) {
      item.value = !item.value
      let itemWidth
      itemWidth = String(item.data).replace(/'*\d$/g, '')
      itemWidth = parseInt(itemWidth)
      if (item.value) {
        this.searchWidth.push(itemWidth)
        this.searchWidth = Array.from(new Set(this.searchWidth))
      } else {
        this.searchWidth = []
        this.searchOptions.dpis.forEach((item, index) => {
          let searchWidth
          if (item.value) {
            searchWidth = String(item.data).replace(/'*\d$/g, '')
            searchWidth = parseInt(searchWidth)
            this.searchWidth.push(searchWidth)
          }
        })
      }
      this.searchPost(this.searchVersions, this.searchWidth)
    },
    screeLength (serial, markName) {
      this.screenImgs = []
      this.imagePageIndex = 1
      let length
      this.searchDetail.forEach((item) => {
        if (item.serial === serial) {
          if (item.screenCap) {
            length = item.screenCap.length
          } else {
            length = 0
          }
        }
      })
      this.nowSeeImageLenght = length
      this.seeImage(this.nowSeeImageLenght, serial, markName)
    },
    seeImage (length, serial, markName) {
      this.screenImgs = []
      this.nowSerial = serial
      this.markName = markName
      this.noImage = false
      if (length) {
        for (let i = 0; i <= 7; i++) {
          let num = i + 1
          if (num > length) {
            return
          }
          this.screenImgs.push(this.$store.state.configApi.stfScreen + this.routeTaskid + '/' + serial + '/' + num)
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
        this.screenImgs.push(this.$store.state.configApi.stfScreen + this.routeTaskid + '/' + this.nowSerial + '/' + num)
      }
    },
    showBigImage (imgSrc) {
      this.isShowBig = true
      this.bigImgSrc = imgSrc
    },
    closeImage (boolean) {
      this.isShowBig = boolean
      this.bigImgSrc = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.uiactivity-report
  th
    .cell
      color: #1f92f3
      font-weight: bold
  td
    .cell
      color: #555555
      .seeImage
        color: #1f92f3
        cursor: pointer
  .padding-left-top
    padding: 30px 0 0 30px
    box-sizing()
  .report-top
    height: 96px
    background: #fff
    padding: 25px
    box-sizing()
    color: #5d5e5e
    margin-bottom: 20px
    .report-top-left
      float: left
      p
        height: 20px
        line-height: 20px
        span
          margin-right: 20px
          display: inline-block
          float: left
          height: 20px
          line-height: 20px
          &.activityUrl
            width: 300px
            a
              display: inline-block
              width: 100%
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              color: #5d5e5e
      p.testName
        font-size: 18px
        font-weight: bold
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
  .search-activity
    font-size: 0
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
  .screens
    margin-top: 20px
    h1
      height: 30px
      line-height: 30px
      border-bottom: 1px solid #e7e7e7
      color: #5d5e5e
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
    p
      margin-top: 20px
    .el-table-a
      color: #5d5e5e
</style>
