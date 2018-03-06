<template>
  <div class="setting container">
    <item-header :title="title"></item-header>
    <div class="setting-survey" v-show="$route.path === '/setting'">
      <div class="query">
        <div class="query-project">
          <label>所属项目</label>
          <project-list @chooseProject="chooseProject" :reset="reset" @isNowReset="isNowReset"></project-list>
        </div>
        <div class="query-model">
          <label>所属模块</label>
          <model-list @chooseSuite="chooseSuite" :reseta="reseta" @isNowReseta="isNowReseta" :suites="suites"></model-list>
        </div>
        <div class="search-btn">
          <button class="reset" @click="resetSearch">重置</button>
          <button class="search" @click="search">扫描</button>
        </div>
      </div>
      <table class="setting-table">
        <thead>
          <tr>
            <th>所属项目</th>
            <th>模块名称</th>
            <th>测试用例个数</th>
            <th>模块描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(settingItem, index) in settingdatas.result"  v-if="index >= (pageIndex - 1) * pageSize && index < pageSize * (pageIndex - 1) + pageSize">
            <td>{{settingItem.project_name}}</td>
            <td>{{settingItem.suite_name}}</td>
            <td>{{settingItem.case_count}}</td>
            <td>{{settingItem.desc}}</td>
            <td><a href="javascript:;" @click="showSettingDetail(settingItem)">[查看]</a></td>
          </tr>
        </tbody>
      </table>
      <el-pagination layout="total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="settingdatas.count" @size-change="sizeChange" @current-change="pageIndexChange">
      </el-pagination>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import projectList from '../ProjectList/ProjectList'
import modelList from '../ModelList/ModelList'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  beforeRouteLeave (to, from, next) {
    this.resetSearch()
    next()
  },
  data () {
    return {
      title: '模块用例管理',
      isDetail: false,
      project: '',
      suite: '',
      reset: false,
      reseta: false,
      pageIndex: 1,
      pageSize: 10
    }
  },
  created () {
    this.getSettingdatas()
  },
  computed: {
    ...mapGetters([
      'settingdatas',
      'suites'
    ])
  },
  components: {
    itemHeader,
    projectList,
    modelList
  },
  methods: {
    ...mapActions([
      'getSettingdatas'
    ]),
    ...mapMutations([
      'emptySuites'
    ]),
    showSettingDetail (item) {
      if (item.module === '') {
        item.module = '-'
      }
      if (item.sub_module === '') {
        item.sub_module = '*'
      }
      this.$router.push('/setting/detail/' + item.project_name + '/' + item.module + '/' + item.sub_module)
    },
    chooseProject (projectId, projectName) {
      this.project = projectName
      let options = {
        project: this.project,
        type: 1
      }
      this.getSettingdatas(options)
    },
    chooseSuite (suite) {
      this.suite = suite
    },
    search () {
      if (this.project && this.suite) {
        let options = {
          project: this.project,
          suite: this.suite
        }
        this.getSettingdatas(options)
      } else if (this.project && this.suite === '') {
        let options = {
          project: this.project,
          type: 2
        }
        this.getSettingdatas(options)
      } else if (!this.project && !this.suite) {
        this.getSettingdatas()
      }
    },
    resetSearch () {
      this.project = ''
      this.suite = ''
      this.reset = true
      this.reseta = true
      this.emptySuites()
      this.getSettingdatas()
    },
    isNowReset (boolean) {
      this.reset = false
    },
    isNowReseta (boolean) {
      this.reseta = false
    },
    sizeChange (pageSize) {
    },
    pageIndexChange (pageIndex) {
      this.pageIndex = pageIndex
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.setting
  .setting-survey
    padding: 30px 0 0 30px
    box-sizing()
    .el-input__inner
      border-radius: 0
    .query
      overflow: hidden
      margin-bottom: 20px
      label
        float: left
        height: 36px
        line-height: 36px
        margin-right: 10px
      .query-project
        float: left
        width: 300px
        margin-right: 20px
        .project-list
          float: left
          .el-input__inner
            height: 42px
            line-height: 42px
            width: 370px
            border-radius: 0
          .searchTitle
            .el-input__inner
              width: 100%
              height: 36px
              line-height: 36px
      .query-model
        float: left
        width: 300px
        .model-list
          float: left
      .search-btn
        float: right
        button.search
          display: inline-block
          height: 36px
          width: 116px
          border: 0
          color: #fff
          background: #1f92f3
          line-height: 36px
          text-align: center
          cursor: pointer
        button.reset
          display: inline-block
          height: 36px
          width: 114px
          border: 0
          background: #fff
          color: #555
          line-height: 36px
          text-align: center
          cursor: pointer
          margin-right: 10px
          border: 1px solid #bfcbd9
    .el-table
      th
        .cell
          color: #1f92f3
          font-weight: bold
      td
        .cell
          colot: #555555
          a
            color: #1f92f3
      .el-table__body-wrapper
        overflow: hidden
    .setting-table
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
        cursor: pointer
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
        td
          font-size: 14px
          height: 40px
          line-height: 40px
          text-align: center
          text-overflow: ellipsis
          a
            color: #1f92f3
      tbody
        tr
          &:hover
            background-color: #eef1f6
</style>
