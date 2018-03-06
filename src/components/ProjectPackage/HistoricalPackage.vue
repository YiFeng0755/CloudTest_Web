<template>
  <el-dialog class="history-package" v-model="showStatus" @close="hideHistorical">
    <div class="search-history">
      <h1>选择已上传的包</h1>
      <el-input v-model="input" placeholder="找不到?搜索一下吧"></el-input>
      <i class="el-icon-search"></i>
    </div>
    <table class="history-table">
      <tbody>
        <tr v-for="(item, index) in orderBy(filterBy(historicalUpload, input), 'committime', -1)" v-if="index >= (pageIndex - 1) * pageSize && index < pageSize * (pageIndex - 1) + pageSize" @click="currentPackage(item)">
          <td>{{item.appName}}</td>
          <td>{{item.package}}</td>
          <td>{{item.userName}}</td>
          <td>{{item.committime}}</td>
        </tr>
      </tbody>
    </table>
    <el-pagination layout="total, prev, pager, next" :current-page="pageIndex" :page-size="pageSize" :total="total" @size-change="sizeChange" @current-change="pageIndexChange">
    </el-pagination>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      input: '',
      pageIndex: 1,
      pageSize: 6,
      historys: this.historysStart
    }
  },
  props: [
    'isShowHistorical'
  ],
  created () {
    this.getHistoricalUpload()
  },
  computed: {
    ...mapGetters([
      'historicalUpload',
      'historicalCount'
    ]),
    pages () {
      if (this.filterBy(this.historicalUpload, this.input).length % this.pageSize === 0) {
        return parseInt(this.filterBy(this.historicalUpload, this.input).length / this.pageSize)
      } else {
        if (parseInt(this.filterBy(this.historicalUpload, this.input).length / this.pageSize) === 0) {
          return 1
        } else {
          return parseInt(this.filterBy(this.historicalUpload, this.input).length / this.pageSize) + 1
        }
      }
    },
    total () {
      if (this.input) {
        return this.filterBy(this.historicalUpload, this.input).length
      } else {
        return this.historicalCount
      }
    },
    historysStart () {
      return this.historicalCount
    },
    showStatus () {
      return this.isShowHistorical
    }
  },
  methods: {
    ...mapActions([
      'getHistoricalUpload'
    ]),
    hideHistorical () {
      this.$emit('hideHistorical', false)
    },
    formatter (row, column) {
      return moment(row[column.property]).subtract(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
    },
    currentPackage (item) {
      this.$emit('currentPackage', false, item.fileName, item.id)
    },
    sizeChange (pageSize) {
    },
    pageIndexChange (pageIndex) {
      this.pageIndex = pageIndex
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.el-dialog__wrapper.history-package
  .el-dialog--small
    min-width: 960px
    h1
      height: 60px
      line-height: 60px
      font-size: 24px
  .search-history
    position: relative
    .el-input__inner
      padding-right: 40px
    i
      position: absolute
      right: 10px
      top: 68px
      font-size: 20px
  .history-table
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
      &:hover
        background-color: #eef1f6
      td
        height: 40px
        line-height: 40px
        text-align: center
        text-overflow: ellipsis
  .el-table
    margin: 20px 0
    tr
      background: #f7f7f7
      &:hover
        background: #eef1f6
    .el-table__header-wrapper
      thead
        display: none
    .el-table__body-wrapper
      height: 240px
      overflow: hidden
</style>