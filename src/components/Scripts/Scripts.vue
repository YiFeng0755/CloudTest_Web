<template>
  <el-dialog  v-model="showStatus" class="scripts container" @close="hideScripts">
    <div class="wrap-search-scripts">
      <div class="all-search">
        <el-input type="text" v-model="sscripts" placeholder="搜索脚本"></el-input>
        <div class="check-all">
          <label>
            <input type="checkbox" :checked="isAllChecked()" @change="changeAllChecked($event)">
            <span class="original-checkbox"><i class="el-icon-check"></i></span>
            <span class="item-name">全选</span>
          </label>
        </div>
        <ul class="suite">
          <li class="suilt-box" v-for="(suite, index) in filterBy(allSuite, sscripts)">
            <div class="case" v-if="suite.cases.length">
              <i class="show-case" :class="{isOpenCase: suite.isOpened}" @click="isOpenSuite(index)" v-text="suite.isOpened ? '－' : '＋'"></i>
              <label class="suiteMenu">
                <input type="checkbox" :checked="isParentChecked(suite)" @change="changeParentChecked(suite, $event)">
                <span class="original-checkbox"><i class="el-icon-check"></i></span>
                <span class="item-name">{{suite.suite_name}}</span>
              </label>
              <ul v-if="suite.cases.length" v-show="suite.isOpened">
                <li v-for="caseitem in suite.cases">
                  <label>
                    <input type="checkbox" v-model="suite.selected" :value="caseitem.id">
                    <span class="original-checkbox"><i class="el-icon-check"></i></span>
                    <span class="item-name">{{caseitem.doc_string}}({{caseitem.class_name}})</span>
                  </label>
                </li>
              </ul>
            </div>
            <div class="case nocase" v-else>
              <label class="suiteMenu">
                <input type="checkbox" :checked="parentChecked(suite)" @change="changeChecked(suite, $event)">
                <span class="original-checkbox"><i class="el-icon-check"></i></span>
                <span class="item-name">{{suite.suite_name}}</span>
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <button class="confirm" @click="confirm">确定</button>
      <button class="reset" @click="reset">重置</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'scripts',
  props: [
    'isShowScripts',
    'allSuite'
  ],
  data () {
    return {
      sscripts: ''
    }
  },
  methods: {
    ...mapMutations([
      'chooseScripts',
      'saveScripts'
    ]),
    hideScripts () {
      this.$emit('hidescripts', false)
      this.allSuite.forEach((data) => {
        data.selected = []
        data.isOpened = true
      })
    },
    changeParentChecked (data, event) {
      if (event.target.checked === true) {
        data.cases.forEach((item) => {
          data.selected.indexOf(item.id) === -1 && data.selected.push(item.id)
        })
      } else {
        data.selected = []
      }
    },
    changeChecked (data, event) {
      if (event.target.checked === true) {
        data.selected.push('noCase')
      } else {
        data.selected = []
      }
    },
    isParentChecked (data) {
      let _selected = data.selected
      let _items = data.cases
      return _items.every((item) => {
        return _selected.indexOf(item.id) !== -1
      })
    },
    parentChecked (data) {
      if (data.selected.length) {
        return true
      } else {
        return false
      }
    },
    changeAllChecked (event) {
      if (event.target.checked === true) {
        this.allSuite.forEach((data) => {
          if (data.cases.length) {
            data.cases.forEach((item) => {
              data.selected.indexOf(item.id) === -1 && data.selected.push(item.id)
            })
          } else {
            data.selected.push('noCase')
          }
        })
      } else {
        this.allSuite.forEach((data) => {
          data.selected = []
        })
      }
    },
    isAllChecked () {
      return this.allSuite.every((data) => {
        if (!data.cases.length) {
          if (data.selected.length) {
            return true
          }
        } else {
          return data.selected.length === data.cases.length
        }
      })
    },
    reset () {
      this.allSuite.forEach((data) => {
        data.selected = []
      })
    },
    confirm () {
      let that = this
      that.selectAll = []
      that.allSuite.forEach(function (item) {
        that.selectAll = that.selectAll.concat(item.selected)
      })
      that.selectAll = Array.from(new Set(that.selectAll))
      if (that.selectAll.indexOf('noCase') !== -1) {
        that.selectAll.splice(that.selectAll.indexOf('noCase'), 1)
      }
      let caseArr = []
      that.allSuite.forEach((item) => {
        if (item.cases.length !== 0) {
          item.cases.forEach((caseitem) => {
            that.selectAll.forEach((caseid) => {
              if (caseid === caseitem.id) {
                caseArr.push(caseitem)
              }
            })
          })
        }
      })
      console.log(caseArr)
      this.saveScripts(caseArr)
      this.chooseScripts(caseArr)
      this.$emit('isScriptsBox', caseArr.length, false)
      this.$emit('chooseSctipts', that.selectAll)
      if (that.selectAll.length) {
        this.$emit('showScriptMethods', true)
      } else {
        this.$emit('showScriptMethods', false)
      }
      this.allSuite.forEach((data) => {
        data.selected = []
      })
    },
    isOpenSuite (index) {
      this.allSuite[index].isOpened = !this.allSuite[index].isOpened
    }
  },
  computed: {
    showStatus () {
      return this.isShowScripts
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.scripts
  .el-dialog
    width: 470px
    .el-dialog__body
      overflow-y: auto
      height: 414px
      padding: 0
      width: 100%
      .wrap-search-scripts
        padding: 20px
        .all-search
          .suite
            .suilt-box
              .case
                position: relative
                .show-case
                  font-style: normal
                  position: absolute
                  height: 16px
                  line-height: 16px
                  width: 16px
                  border: 1px solid #bfcbd9
                  right: 0
                  top: 6px
                  text-align: center
                  cursor: pointer
                  &.isOpenCase
                    border-color: #20a0ff
                  &:hover
                    border-color: #20a0ff
                ul
                  padding-left: 20px
          label
            overflow: hidden
            display: block
            margin: 10px 0
            .item-name
              float: left
              height: 18px
              line-height: 18px
              &.bold-name
                font-weight: bold
            .original-checkbox
              margin-right: 5px
              position: relative
              float: left
              width: 18px
              height: 18px
              background: #fff
              z-index: 1
              transition: border-color .25s cubic-bezier(.71,-.46,1.46)
              border-radius: 4px
              border: 1px solid #bfcbd9
              cursor: pointer
              box-sizing()
              i
                position: absolute
                left: 0
                top: 0
                display: none
                width: 16px
                height: 16px
                color: #fff
                &:before
                  display: block
                  height: 16px
                  line-height: 16px
              &:hover
                border-color: #20a0ff
            &.suiteMenu
              background: #f8f8f8
              height: 18px
              padding: 6px 0
            input
              display: none
              &:checked + .original-checkbox
                i
                  display: block
                  background: #20a0ff
          .el-input
            width: 100%
            .el-input__inner
              border-radius: 0
              height: 42px
              line-height: 42px
    .el-dialog__footer
      text-align: center
      button
        height: 38px
        line-height: 38px
        width: 98px
        box-sizing()
        border-radius: 0
        font-size: 14px
        &.reset
          line-height: 1
          cursor: pointer
          background: #c0c0c0
          border: 1px solid #bfcbd9
          color: #fff
          text-align: center
          margin-right: 10px
        &.confirm
          line-height: 1
          cursor: pointer
          background: #1f92f3
          color: #fff
          text-align: center
          border: 0
</style>
