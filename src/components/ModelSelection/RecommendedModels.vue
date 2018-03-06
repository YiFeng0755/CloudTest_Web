<template>
  <el-dialog title="推荐机型" v-model="showStatus" @close="hideRecommend">
    <el-table :data="recommendedmdels" style="width: 100%">
      <el-table-column prop="manufacturer" label="品牌" align="center">
      </el-table-column>
      <el-table-column prop="model" label="型号" align="center">
      </el-table-column>
      <el-table-column prop="version" label="系统" align="center">
      </el-table-column>
      <el-table-column label="分辨率" align="center">
        <template scope="scope">
          <span>{{scope.row.display.width}}×{{scope.row.display.height}}</span>
        </template>
      </el-table-column>
    </el-table>
    <button class="recommend-btn" @click="confirm">确定</button>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'isShowRecommend'
  ],
  computed: {
    ...mapGetters([
      'recommendedmdels',
      'recommendSerials'
    ]),
    showStatus () {
      return this.isShowRecommend
    }
  },
  created () {
    this.getRecommendedmdels()
  },
  methods: {
    ...mapActions([
      'getRecommendedmdels'
    ]),
    hideRecommend () {
      this.$emit('hideRecommend', false)
    },
    confirm () {
      this.$emit('recommendSerial', this.recommendSerials)
      this.$emit('hideRecommend', false)
      this.$emit('showModelMethods', false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.el-dialog
  .el-dialog__title
    color: #6f6f6f
  th
    .cell
      color: #1f92f3
      font-weight: bold
  .el-table__body-wrapper
    overflow-y: auto
    overflow-x: hidden
    height: 401px
  .recommend-btn
    display: block
    width: 144px
    height: 48px
    line-height: 48px
    background: #1f92f3
    color: #fff
    margin: 25px auto 0 auto
    border: 0
</style>
