<template>
  <div class="show-models" v-if="show && saveModels.length">
    <p>已选择{{saveModels.length}}款机器</p>
    <table class="show-models-table">
      <thead>
        <tr>
          <th>分辨率</th>
          <th>系统</th>
          <th>品牌</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in saveModels" v-show="index < showLength">
          <td>{{item.width}}×{{item.height}}</td>
          <td>{{item.osVersion}}</td>
          <td>{{item.manufacturer}}</td>
          <td><a href="javascript:;" @click="deleteItem(item.serial)">删除</a></td>
        </tr>
      </tbody>
    </table>
    <p class="showMore" @click="showMore" v-if="saveModels.length > 5 && showMoreModels">展开全部 ∨</p>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: [
    'showModels',
    'showMoreModels',
    'showLength'
  ],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'chooseModels',
      'saveModels'
    ]),
    show () {
      return this.showModels
    },
    chooseCount () {
      return this.chooseModels.length
    }
  },
  methods: {
    ...mapMutations([
      'deleteSaveModels'
    ]),
    showMore () {
      this.$emit('showMore', false, this.saveModels.length)
    },
    deleteItem (serial) {
      this.$emit('deleteSerial', serial)
      this.deleteSaveModels(serial)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.show-models
  width: 470px
  border: 1px solid #bfcbd9
  margin-top: 20px
  margin-left: 150px
  padding: 10px
  position: relative
  box-sizing()
  p
    margin-bottom: 10px
  p.showMore
    position: absolute
    width: 100%
    left: 0
    bottom: 7px
    margin-bottom: 0
    padding-left: 10px
    box-sizing()
    color: #1f92f3
    cursor: pointer
  .show-models-table
    width: 100%
    border: 1px solid #dfe6ec
    border-collapse: collapse
    border-spacing: 0
    overflow: hidden
    margin: 20px 0
    margin-top: 10px
    font-size: 12px
    thead
      th
        height: 30px
        line-height: 30px
        border-bottom: 1px solid #dfe6ec
        white-space: nowrap
        overflow: hidden
        text-align: center
        background: #eef1f6
        color: #333333
    tbody
      tr
        border-bottom: 1px solid #dfe6ec
        height: 30px
        line-height: 30px
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
          color: #656565
          a
            color: #1f92f3
        &:last.child
          border-bottom: 0
</style>
