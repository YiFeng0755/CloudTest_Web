<template>
  <div class="detail-terminal container">
    <!-- v-if="isFirst" -->
    <div class="terminal-first" v-if="$route.matched[2].path === '/report/:type/detail/:fileid/:taskid/terminal' && $route.matched.length !== 4">
      <div class="search-terminal">
        <p>
          <span class="search-title">测试结果:</span>
          <span class="search-btnbox">
            <button :class="{ current: isResultAll }" @click="searchAllResult">全部</button>
            <span>
              <button v-for="item in results" :class="{ current: item.isCur }" @click="searchResult(item)">{{item.label}}</button>
            </span>
          </span>
        </p>
        <p>
          <span class="search-title">系统:</span>
          <span class="search-btnbox">
            <button :class="{ current: isVersionAll }" @click="searchAllVersion">全部</button>
            <span>
              <button v-for="item in devoptions.version" :class="{ current: item.value }" @click="searchVersion(item)">{{item.data}}</button>
            </span>
          </span>
        </p>
        <p>
          <span class="search-title">分辨率:</span>
          <span class="search-btnbox">
            <button :class="{ current: isDpiAll }" @click="searchAllDpi">全部</button>
            <span>
              <button v-for="item in devoptions.dpis" :class="{ current: item.value }" @click="searchDpi(item)">{{item.data}}</button>
            </span>
          </span>
        </p>
      </div>
      <a class="download-report" :href="reportLink">下载报告</a>
      <el-table :data="terminalList" style="width: 100%">
        <el-table-column prop="markName" label="设备名" align="center">
        </el-table-column>
        <el-table-column prop="version" label="系统版本" align="center">
        </el-table-column>
        <el-table-column label="分辨率" align="center">
          <template scope="scope">
            <span>{{scope.row.width}}×{{scope.row.height}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="测试结果" align="center">
          <template scope="scope">
            <span>{{scope.row.status == "fail" ? "未通过" : "通过"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusCode" label="安装" align="center">
          <template scope="scope">
            <span>{{scope.row.statusCode != 1 ? "√" : "×"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusCode" label="启动" align="center">
          <template scope="scope">
            <span>{{(scope.row.statusCode == 0) || (scope.row.statusCode == 3) ? "√" : "×"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="statusCode" label="运行" align="center">
          <template scope="scope">
            <span>{{scope.row.statusCode == 0 ? "√" : "×"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详细" align="center">
          <template scope="scope">
            <router-link class="see" :to="'/report/' + routeType + '/detail/' + routeFileid + '/' + routeTaskid + '/terminal/' + scope.row.serial">[查看]</router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      routeTaskid: '',
      routeType: '',
      routeFileid: '',
      terminalList: [],
      results: [
        {
          label: '通过',
          value: 'success',
          isCur: true
        },
        {
          label: '未通过',
          value: 'fail',
          isCur: true
        }
      ],
      searchStatus: [
        'success',
        'fail'
      ],
      searchVersions: [],
      searchWidth: [],
      reportLink: ''
    }
  },
  created () {
    this.routeFileid = this.$route.params.fileid
    this.routeTaskid = this.$route.params.taskid
    this.routeType = this.$route.params.type
    this.getDevOptions(this.routeTaskid)
    this.searchPost(this.searchStatus, [], [])
    this.reportLink = this.$store.state.configApi.download + this.routeTaskid
  },
  computed: {
    ...mapGetters([
      'devoptions'
    ]),
    isResultAll () {
      let resultLength = this.results.length
      let isAll = []
      this.results.forEach((item) => {
        if (item.isCur) {
          isAll.push(item)
        }
      })
      if (isAll.length === resultLength) {
        return true
      }
      return false
    },
    isVersionAll () {
      if (this.devoptions.version) {
        let versionLength = this.devoptions.version.length
        let isAll = []
        this.devoptions.version.forEach((item) => {
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
      if (this.devoptions.dpis) {
        let dpiLength = this.devoptions.dpis.length
        let isAll = []
        this.devoptions.dpis.forEach((item) => {
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
  methods: {
    ...mapActions([
      'getDevOptions'
    ]),
    searchPost (status, version, width) {
      axios.post(this.$store.state.configApi.filterTaskDevdetail, {
        taskid: this.routeTaskid,
        data: {
          status: status,
          version: version,
          width: width
        }
      }, {
        withCredentials: true
      }).then((response) => {
        this.terminalList = response.data.list
      }).catch((error) => {
        console.log(error)
      })
    },
    searchResult (item) {
      item.isCur = !item.isCur
      if (item.isCur) {
        this.searchStatus.push(item.value)
      } else {
        this.searchStatus.splice(this.searchStatus.indexOf(item.value), 1)
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
    },
    searchAllResult () {
      if (this.isResultAll) {
        this.results.forEach((item, index) => {
          this.results[index].isCur = false
        })
        this.searchStatus = []
      } else {
        this.searchStatus = []
        this.results.forEach((item, index) => {
          this.results[index].isCur = true
          this.searchStatus.push(item.value)
        })
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
    },
    searchAllVersion () {
      if (this.isVersionAll) {
        this.devoptions.version.forEach((item, index) => {
          this.devoptions.version[index].value = false
        })
        this.searchVersions = []
      } else {
        this.searchVersions = []
        this.devoptions.version.forEach((item, index) => {
          this.devoptions.version[index].value = true
          this.searchVersions.push(item.data)
        })
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
    },
    searchVersion (item) {
      item.value = !item.value
      if (item.value) {
        this.searchVersions.push(item.data)
      } else {
        this.searchVersions = []
        this.devoptions.version.forEach((item, index) => {
          if (item.value) {
            this.searchVersions.push(item.data)
          }
        })
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
    },
    searchAllDpi () {
      if (this.isDpiAll) {
        this.devoptions.dpis.forEach((item, index) => {
          this.devoptions.dpis[index].value = false
        })
        this.searchWidth = []
      } else {
        let itemWidth
        this.searchWidth = []
        this.devoptions.dpis.forEach((item, index) => {
          this.devoptions.dpis[index].value = true
          itemWidth = String(item.data).replace(/'*\d$/g, '')
          itemWidth = parseInt(itemWidth)
          this.searchWidth.push(itemWidth)
          this.searchWidth = Array.from(new Set(this.searchWidth))
        })
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
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
        this.devoptions.dpis.forEach((item, index) => {
          let searchWidth
          if (item.value) {
            searchWidth = String(item.data).replace(/'*\d$/g, '')
            searchWidth = parseInt(searchWidth)
            this.searchWidth.push(searchWidth)
          }
        })
      }
      this.searchPost(this.searchStatus, this.searchVersions, this.searchWidth)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.detail-terminal
  .el-input__inner
    border-radius: 0
  .terminal-first
    th
      .cell
        color: #1f92f3
        font-weight: bold
    td
      .see
        color: #1f92f3
        cursor: pointer
    .download-report
      display: block
      width: 134px
      height: 44px
      line-height: 44px
      color: #fff
      background: #1f92f3
      text-align: center
      margin: 20px 0
    .search-terminal
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
</style>
