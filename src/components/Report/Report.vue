<template>
  <div class="report container">
    <div class="report-survey" v-if="$route.path === '/report'">
      <div class="test-type">
        <h3>测试项</h3>
        <p>
          <button :class="{ current: isCompaty }" @click="isCompatys">兼容性测试</button>
          <button :class="{ current: isActivity }" @click="isActivitys">UI活动兼容性测试</button>
          <button :class="{ current: isAuto }" @click="isAutos">UI自动化测试</button>
          <!-- <button :class="{ current: isDepth }" @click="isDepths">深度定制</button> -->
        </p>
      </div>
      <div class="choose-project">
        <h3>选择项目</h3>
        <project-list @chooseTag="showTag" :types="types" :committer="liftTest" :startDate="startDate" :endDate="endDate"></project-list>
        <div class="chooseTag">
          <i class="seize"></i>
          <el-tag v-if="tags" v-for="tag in tags" :closable="true" type="primary" :key="tag" :close-transition="true" @close="handleClose(tag)">
            {{tag.name}}
          </el-tag>
        </div>
      </div>
      <div class="choose-person">
        <h3>提测人</h3>
        <el-input v-model="liftTest" placeholder="请输入内容" @blur="search(types, tagValue, liftTest, startDate, endDate)" @keyup.enter.native="search(types, tagValue, liftTest, startDate, endDate)"></el-input>
      </div>
      <div class="choose-date">
        <h3>提测时间</h3>
        <el-date-picker id="chooseDate" v-model="timeviue" type="daterange" placeholder="选择日期范围" :picker-options="pickerOptions" style="width:   220px" :editable="false"  @change="changeDate">
        </el-date-picker>
      </div>
      <div class="wq"></div>
      <el-table :data="taskList" style="width: 100%" :default-sort="{prop: 'committime', order: 'descending'}">
        <el-table-column prop="projectName" label="项目" align="center">
        </el-table-column>
        <el-table-column prop="taskType" label="测试项" align="center">
          <template scope="scope">
            <span v-if="scope.row.taskType === 'monkey'">兼容性测试</span>
            <span v-else-if="scope.row.taskType === 'activityTest'">UI活动兼容性测试</span>
            <span v-else-if="scope.row.taskType === 'uiTest'">UI自动化测试</span>
          </template>
        </el-table-column>
        <el-table-column prop="appName" label="apk名(版本号)" align="center"></el-table-column>
        <el-table-column prop="allstatus" label="当前状态" align="center">
          <template scope="scope">
            <span>{{scope.row.allstatus == "finish" ? "完成"   : "进行中"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="提交人" align="center"></el-table-column>
        <el-table-column prop="committime" label="提交时间" sortable align="center" :formatter="formatter" width="200px">
        </el-table-column>
        <el-table-column label="查看详情" align="center">
          <template scope="scope">
            <span v-if="scope.row.taskType === 'monkey'">
              <router-link class="see" :to="'/report/' + scope.row.taskType + '/detail/' + scope.row.fileID + '/' + scope.row.taskid" v-if="scope.row.allstatus === 'finish'">[查看]</router-link>
              <span class="nosee" v-else>[进行中]</span>
            </span>
            <span v-else-if="scope.row.taskType === 'activityTest'">
              <router-link class="see" :to="'/report/ui-activity/' + scope.row.taskid" v-if="scope.row.allstatus === 'finish'">[查看]</router-link>
              <span class="nosee" v-else>[进行中]</span>
            </span>
            <span v-else-if="scope.row.taskType === 'uiTest'">
              <router-link class="see" :to="'/report/uiTest/' + scope.row.taskid" v-if="scope.row.allstatus === 'finish'">[查看]</router-link>
              <span class="nosee" v-else>[进行中]</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="total" @size-change="sizeChange" @current-change="pageIndexChange">
      </el-pagination>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import projectList from '../ProjectList/ProjectListMultiple.vue'
import axios from 'axios'

export default {
  beforeRouteLeave (to, from, next) {
    this.addTag([])
    next()
  },
  data () {
    return {
      tags: [],
      liftTest: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      timeviue: [moment().subtract(1, 'months').add(1, 'days').hours(0).minutes(0).seconds(0)._d, moment().hours(23).minutes(59).seconds(59)._d],
      startDate: '',
      endDate: '',
      projectName: 'All',
      pageIndex: 1,
      pageSize: 10,
      isCompaty: true,
      isAuto: true,
      isActivity: true
    }
  },
  created () {
    this.startDate = moment(this.timeviue[0].valueOf()).unix()
    this.endDate = moment(this.timeviue[1].valueOf()).unix()
    this.getTaskList(this)
  },
  computed: {
    ...mapGetters([
      'chooseTags',
      'taskList',
      'count'
    ]),
    total () {
      return this.count
    },
    types () {
      let types = []
      if (this.isCompaty) {
        types.push('monkey')
      }
      if (this.isAuto) {
        types.push('uiTest')
      }
      if (this.isActivity) {
        types.push('activityTest')
      }
      return types
    },
    tagValue () {
      let tagValue = []
      this.tags.forEach((item) => {
        tagValue.push(item.name)
      })
      return tagValue
    }
  },
  components: {
    projectList
  },
  methods: {
    ...mapMutations([
      'addTag',
      'deleteTag',
      'searchTasklist'
    ]),
    ...mapActions([
      'getTaskList'
    ]),
    handleClose (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
      this.deleteTag(tag)
    },
    showTag (tags, pageIndex) {
      this.tags = tags
      this.pageIndex = pageIndex
    },
    changeDate (dates) {
      this.startDate = moment(this.timeviue[0]).hours(0).minutes(0).seconds(0)._d
      this.endDate = moment(this.timeviue[1]).hours(23).minutes(59).seconds(59)._d
      this.startDate = moment(this.startDate.valueOf()).unix()
      this.endDate = moment(this.endDate.valueOf()).unix()
      this.search(this.types, this.tagValue, this.liftTest, this.startDate, this.endDate)
    },
    formatter (row, column) {
      return moment(row[column.property] * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    forstatus (row, column) {
      let statu = ''
      if (row[column.property] === 'finish') {
        statu = '完成测试'
      } else {
        statu = '进行中'
      }
      return statu
    },
    sizeChange (pageSize) {
    },
    pageIndexChange (pageIndex) {
      this.pageIndex = pageIndex
      this.search(this.types, this.tagValue, this.liftTest, this.startDate, this.endDate, pageIndex)
    },
    search (types, tags, committer, startDate, endDate, page) {
      if (page) {
      } else {
        this.pageIndex = 1
      }
      axios.post(this.$store.state.configApi.selectTaskList, {
        taskTypes: types,
        projectNames: tags,
        committer: committer,
        timePast: startDate,
        timeNow: endDate,
        page: page || 1,
        pageSize: 10
      }, {
        withCredentials: true
      }).then((response) => {
        this.searchTasklist(response.data)
      }).catch((error) => {
        console.log(error)
      })
    },
    isCompatys () {
      if (this.isCompaty && this.isAuto && this.isActivity) {
        this.isCompaty = true
        this.isAuto = false
        this.isActivity = false
      } else {
        this.isCompaty = !this.isCompaty
      }
      this.search(this.types, this.tagValue, this.liftTest, this.startDate, this.endDate)
    },
    isAutos () {
      if (this.isCompaty && this.isAuto && this.isActivity) {
        this.isCompaty = false
        this.isAuto = true
        this.isActivity = false
      } else {
        this.isAuto = !this.isAuto
      }
      this.search(this.types, this.tagValue, this.liftTest, this.startDate, this.endDate)
    },
    isActivitys () {
      if (this.isCompaty && this.isAuto && this.isActivity) {
        this.isCompaty = false
        this.isAuto = false
        this.isActivity = true
      } else {
        this.isActivity = !this.isActivity
      }
      this.search(this.types, this.tagValue, this.liftTest, this.startDate, this.endDate)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.report
  overflow: hidden
  .el-input__inner
    border-radius: 0
  .report-survey
    .green
      color: green
    .red
      color: red
    h3
      font-weight: 700
      margin-bottom: 20px
      color: #6f6f6f
    .test-type
      margin-bottom: 20px
      button
        display: inline-block
        line-height: 1
        font-family: inherit
        white-space: nowrap
        cursor: pointer
        background: #fff
        border: 1px solid #1f92f3
        color: #1f92f3
        -webkit-appearance: none
        text-align: center
        box-sizing: border-box
        outline: none
        margin: 0
        -moz-user-select: none
        -webkit-user-select: none
        -ms-user-select: none
        padding: 10px 15px
        font-size: 14px
        &:hover
          color: #fff
          background: #1f92f3
        &.current
          color: #fff
          background: #1f92f3
    .choose-project
      overflow: hidden
      .project-list
        position: relative
        width: 221px
        z-index: 2
        margin-right: 20px
        .el-select__tags
          display: none
      .chooseTag
        position: relative
        left: 0
        top: -36px
        width: 100%
        overflow: hidden
        z-index: 1
        i.seize
          width: 221px
          height: 36px
          float: left
        .el-tag
          float: left
          margin: 0 6px 6px 6px
          height: 36px
          line-height: 36px
          padding: 0 14px
          border-color: #bfcbd9
          color: #b9b9b9
          .el-tag__close
            &:hover
              background-color: transparent
              color: #949494
        .el-tag--primary
          background: #fff
    .choose-person
      margin-top: -16px
      width: 217px
      float: left
      margin-right: 20px
    .choose-date
      margin-top: -16px
      float: left
      .el-input__icon
        display: none
    .wq
      clear: both
      height: 20px
    .el-table
      margin-bottom: 20px
      th
        div
          color: #1f92f3
          font-weight: bold
      td
        color: #555555
        a
          &.see
            color: #1f92f3
        span
          &.nosee
            color: #1f92f3
    .el-pagination
      margin-bottom: 60px
      .el-pager
        .el-pagination
          button
            &:hover
              color: #1f92f3
        li
          &.active
            background: #1f92f3
            border-color: #1f92f3
          &:hover
            color: #fff
            background: #1f92f3
            border-color: #1f92f3
</style>
