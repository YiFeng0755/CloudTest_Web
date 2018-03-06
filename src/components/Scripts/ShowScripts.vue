<template>
  <div class="show-scriptss" v-if="show && showScripts">
    <p>已选择{{saveScripts.length}}个脚本</p>
    <table class="show-scriptss-table">
      <thead>
        <tr>
          <th>用例名称</th>
          <!-- <th>模块名称</th> -->
          <th>用例ID</th>
          <!-- <th>参数</th> -->
          <!-- <th>方法名称</th> -->
          <th>作者</th>
          <th>描述</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in saveScripts">
          <td>{{item.class_name}}</td>
          <!-- <td>{{item.suite_name}}</td> -->
          <td>{{item.logic_id}}</td>
          <!-- <td>{{item.parameter}}</td> -->
          <!-- <td><span class="hideLong">{{item.method}}</span></td> -->
          <td>{{item.owner}}</td>
          <td>{{item.doc_string}}</td>
          <td><a href="javascript:;" @click="deleteScript(item.id)">删除</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  props: [
    'showScripts',
    'showScriptsLength'
  ],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'chooseScripts',
      'saveScripts'
    ]),
    show () {
      if (this.saveScripts.length) {
        return true
      } else {
        return false
      }
    },
    chooseCount () {
      return this.chooseScripts.length
    }
  },
  methods: {
    ...mapMutations([
      'deleteSaveScripts'
    ]),
    deleteScript (caseid) {
      this.$emit('deleteCase', caseid)
      this.deleteSaveScripts(caseid)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.show-scriptss
  width: 650px
  border: 1px solid #bfcbd9
  margin-top: 20px
  margin-left: 150px
  padding: 10px
  position: relative
  box-sizing()
  p
    margin-bottom: 10px
  .show-scriptss-table
    width: 100%
    border: 1px solid #dfe6ec
    border-collapse: collapse
    border-spacing: 0
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
        padding:0 10px
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
          text-align: center
          text-overflow: ellipsis
          color: #656565
          padding:0 10px
          vertical-align: middle
          line-height: 1
          span.hideLong
            display: inline-block
            width: 100px
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            line-height: 1
          a
            color: #1f92f3
        &:last.child
          border-bottom: 0
</style>
