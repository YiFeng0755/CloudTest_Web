<template>
  <div class="choose-debug container">
    <item-header :title="title"></item-header>
    <div class="choose-search">
      快速查找机型：<el-input v-model="inputDebug"></el-input>
    </div>
    <el-table :data="orderBy(filterBy(choosedebugs, inputDebug), 'present', -1)" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="manufacturer" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="markName" label="型号" align="center">
      </el-table-column>
      <el-table-column prop="version" label="系统" align="center">
      </el-table-column>
      <el-table-column label="分辨率" align="center">
        <template scope="scope">
          <span v-if="scope.row.display">{{scope.row.display.width}}×{{scope.row.display.height}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template scope="scope">
          <span v-if="!scope.row.ready">准备状态</span>
          <span v-else-if="!scope.row.present">离线状态</span>
          <span v-else-if="scope.row.present && scope.row.owner !== null">被使用状态</span>
          <span v-else-if="scope.row.present && scope.row.ready && scope.row.owner === null">可用状态</span>
        </template>
      </el-table-column>
      <el-table-column label="操作者" align="center">
        <template scope="scope">
          <span v-if="scope.row.owner">{{scope.row.owner.name}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template scope="scope">
          <a v-if="scope.row.present && scope.row.ready && scope.row.owner === null" :href="'http://stf-test.oa.com/#!/control/' + scope.row.serial" target="_blank">[点击]</a>
          <span v-else>禁止</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      title: '真机调试',
      inputDebug: ''
    }
  },
  computed: {
    ...mapGetters([
      'choosedebugs'
    ])
  },
  created () {
    this.getChooseDebugs()
  },
  components: {
    itemHeader
  },
  methods: {
    ...mapActions([
      'getChooseDebugs'
    ]),
    // uploadChoose () {
    //   this.$router.go(0)
    // }
    tableRowClassName (row, index) {
      if (!row.present && !row.ready) {
        return 'hide'
      }
      if (!row.present) {
        return 'no-online'
      }
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.choose-debug
  .no-online
    color: #999999
  .hide
    display: none
  .choose-search
    width: 500px
    height: 36px
    line-height: 36px
    margin-bottom: 20px
    .el-input
      width: 300px
      margin-left: 10px
    .el-input__inner
      border-radius: 0
  .el-table
    th
      .cell
        color: #1f92f3
        font-weight: bold
    td
      a
        color: #1f92f3
    .el-table__body-wrapper
      overflow-x: hidden
</style>
