<template>
  <div class="setting-detail">
    <div class="setting-survey">
      <div class="survey-left">
        <p><span class="title">模块名称</span><span class="content">{{detailSuites.suite_name}}</span></p>
        <p><span class="title">所属包</span><span class="content">{{detailSuites.package}}</span></p>
        <!-- <p><span class="title">参数</span><span class="content">{{detailSuites.parameter}}</span></p> -->
      </div>
      <div class="survey-right">
        <p><span class="title">所属项目</span><span class="content">{{detailSuites.projectName}}</span></p>
        <!-- <p><span class="title">所属类</span><span class="content">{{detailSuites.class}}</span></p> -->
        <p><span class="title">描述</span><span class="content">{{detailSuites.desc}}</span></p>
      </div>
    </div>
    <el-table :data="detailSuites.cases" style="width: 100%" border="true">
      <!-- <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column> -->
      <el-table-column prop="logic_id" label="用例ID" align="center"></el-table-column>
      <el-table-column prop="name" label="用例名称" align="center"></el-table-column>
      <el-table-column prop="desc" label="用例描述" align="center"></el-table-column>
      <el-table-column prop="owner" label="作者" align="center"></el-table-column>
      <el-table-column prop="priority" label="优先级" align="center">
        <template scope="scope">
          <span v-if="scope.row.priority === 'EnumPriority.High'">高</span>
          <span v-else-if="scope.row.priority === 'EnumPriority.Normal'">普通</span>
          <span v-else="scope.row.priority === 'EnumPriority.Low'">低</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="编写状态" align="center">
        <template scope="scope">
          <span v-if="scope.row.status === 'EnumPriority.Disgin'">设计中</span>
          <span v-else-if="scope.row.status === 'EnumPriority.Implement'">已实现</span>
          <span v-else="scope.row.status === 'EnumPriority.Suspend'">暂不可用</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      module: '',
      projectname: '',
      submodule: ''
    }
  },
  created () {
    this.module = this.$route.params.module
    this.submodule = this.$route.params.submodule
    if (this.module === '-') {
      this.module = ''
    }
    if (this.submodule === '*') {
      this.submodule = ''
    }
    this.projectname = this.$route.params.projectname
    let options = {
      projectname: this.$route.params.projectname,
      module: this.module,
      submodule: this.submodule
    }
    this.postDetailsSuites(options)
  },
  computed: {
    ...mapGetters([
      'detailSuites'
    ])
  },
  methods: {
    ...mapActions([
      'postDetailsSuites'
    ]),
    fallback () {
      this.$router.push('/setting')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.setting-detail
  margin-top: 30px
  padding-left: 30px
  th
    .cell
      color: #1f92f3
      font-weight: bold
  td
    .cell
      color: #555
  .setting-survey
    padding: 0
    margin: 20px 0
    overflow: hidden
    div
      float: left
      width: 50%
      &.survey-left
        border: 1px solid #dfe6ec
        border-bottom: 0
        box-sizing()
      &.survey-right
        border: 1px solid #dfe6ec
        border-left: 0
        border-bottom: 0
        box-sizing()
      p
        width: 100%
        border-bottom: 1px solid #dfe6ec
        height: 41px
        box-sizing()
        padding-left: 100px
        position: relative
        font-size: 14px
        .title
          position: absolute
          left: 0
          top: 0
          height: 40px
          line-height: 40px
          text-align: center
          color: #1f92f3
          width: 100px
          border-right: 1px solid #dfe6ec
          font-weight: bold
          background: #eef1f6
        .content
          float: left
          width: 100%
          color: #555
          height: 40px
          line-height: 40px
          text-align: center
</style>
