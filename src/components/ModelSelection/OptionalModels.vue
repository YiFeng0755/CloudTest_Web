<template>
  <el-dialog title="自选机型" class="optional" v-model="showStatus" @close="hideOptional">
    <div class="left">
      <ul>
        <li>
            <p>系统版本:</p>
            <div class="ophone-box">
              <el-checkbox-group v-model="checkVersions" @change="handleCheckVersions">
                <el-checkbox :label="ophone" v-for="ophone in optionalLists.os_versions"></el-checkbox>
              </el-checkbox-group>
            </div>
        </li>
        <li>
            <p>分 辨 率:</p>
            <div class="ophone-box">
              <el-checkbox-group v-model="checkDpis" @change="handleCheckDpis">
                <el-checkbox :label="ophone" v-for="ophone in optionalLists.dpis"></el-checkbox>
              </el-checkbox-group>
            </div>
        </li>
        <li>
            <p>品 &nbsp;牌:</p>
            <div class="ophone-box">
              <el-checkbox-group v-model="checkManufacturers" @change="handleCheckManufacturer">
                <el-checkbox :label="ophone" v-for="ophone in optionalLists.manufacturers"></el-checkbox>
              </el-checkbox-group>
            </div>
        </li>
      </ul>
    </div>
    <div class="right">
      <p class="right-top">
        <span>已选择{{chooseCount}}款</span>
        <ul v-if="searchLists">
          <label>
            <input type="checkbox" :checked="isAllChecked()" @change="changeAllChecked($event)">
            <span class="original-checkbox"><i class="el-icon-check"></i></span>
            <span class="item-name">全选</span>
          </label>
          <li v-for="sphone in searchLists">
            <label>
              <input type="checkbox" :checked="isParentChecked(sphone)" @change="changeParentChecked(sphone, $event)">
              <span class="original-checkbox"><i class="el-icon-check"></i></span>
              <span class="item-name bold-name">{{sphone.manufacturer}} ({{sphone.selected.length}}款)</span>
            </label>
            <ul class="list-phone">
              <li v-for="device in sphone.devices">
                <label>
                  <input class="optionDevice" type="checkbox" v-model="sphone.selected" :value="device.serial">
                  <span class="original-checkbox"><i class="el-icon-check"></i></span>
                  <span class="item-name">{{device.manufacturer}} {{device.model}} {{device.osVersion}}</span>
                </label>
              </li>
            </ul>
          </li>
        </ul>
      </p>
      <ul>
      </ul>
    </div>
    <div class="bottom">
      <button class="reset" @click="reset">重置</button>
      <button class="confirm" @click="confirm">确定</button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      checkVersions: [],
      checkDpis: [],
      checkManufacturers: [],
      search: {
        manufacturer: [],
        version: [],
        dpis: []
      },
      checkedCities: [],
      testAll: [],
      selectAll: [],
      testLists: [
        {
          manufacturer: 360,
          testSelected: [],
          devices: [
            {
              manufacturer: 360,
              model: 'N4',
              osVersion: '5.0.4'
            },
            {
              manufacturer: 360,
              model: 'A8',
              osVersion: '7.0.4'
            }
          ]
        },
        {
          manufacturer: 'HUAWEI',
          testSelected: [],
          devices: [
            {
              manufacturer: 'HUAWEI',
              model: 'MATE9',
              osVersion: '8.0.1'
            },
            {
              manufacturer: 'HUAWEI',
              model: 'P7',
              osVersion: '6.0.4'
            }
          ]
        }
      ]
    }
  },
  props: [
    'isShowOptional'
  ],
  created () {
    this.getOptionalLists()
  },
  computed: {
    ...mapGetters([
      'optionalLists',
      'searchLists'
    ]),
    showStatus () {
      return this.isShowOptional
    },
    chooseCount () {
      let _this = this
      let count
      _this.selectAll = []
      _this.searchLists.forEach(function (item) {
        _this.selectAll = _this.selectAll.concat(item.selected)
      })
      count = _this.selectAll.length
      _this.selectAll = []
      return count
    }
  },
  methods: {
    ...mapActions([
      'getOptionalLists',
      'getSearchLists'
    ]),
    ...mapMutations([
      'chooseModels',
      'saveModels'
    ]),
    hideOptional () {
      this.checkVersions = []
      this.checkDpis = []
      this.checkManufacturers = []
      this.search.version = []
      this.search.manufacturer = []
      this.search.dpis = []
      this.getSearchLists(this.search)
      this.$emit('hideOptional', false)
    },
    handleCheckVersions (value) {
      this.search.version = value
      this.getSearchLists(this.search)
    },
    handleCheckManufacturer (value) {
      this.search.manufacturer = value
      this.getSearchLists(this.search)
    },
    handleCheckDpis (value) {
      this.search.dpis = value
      this.getSearchLists(this.search)
    },
    handleCheckedPhone (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
    },
    changeParentChecked (data, event) {
      if (event.target.checked === true) {
        data.devices.forEach(function (item) {
          data.selected.indexOf(item.serial) === -1 && data.selected.push(item.serial)
        })
      } else {
        data.selected = []
      }
    },
    isParentChecked (data) {
      let _selected = data.selected
      let _devices = data.devices
      return _devices.every(function (device) {
        return _selected.indexOf(device.serial) !== -1
      })
    },
    changeAllChecked (event) {
      if (event.target.checked === true) {
        this.searchLists.forEach(function (data) {
          data.devices.forEach(function (item) {
            data.selected.indexOf(item.serial) === -1 && data.selected.push(item.serial)
          })
        })
      } else {
        this.searchLists.forEach(function (data) {
          data.selected = []
        })
      }
    },
    isAllChecked () {
      return this.searchLists.every(function (data) {
        return data.selected.length === data.devices.length
      })
    },
    reset () {
      this.checkVersions = []
      this.checkDpis = []
      this.checkManufacturers = []
      this.search.version = []
      this.search.manufacturer = []
      this.search.dpis = []
      this.getSearchLists(this.search)
    },
    confirm () {
      let _this = this
      _this.selectAll = []
      _this.searchLists.forEach(function (item) {
        _this.selectAll = _this.selectAll.concat(item.selected)
      })
      this.$emit('chooseSerial', _this.selectAll, false)
      if (_this.selectAll.length) {
        this.$emit('showModelMethods', true)
        let showModelDetails = []
        _this.searchLists.forEach((item) => {
          if (item.selected.length) {
            item.devices.forEach((itemD) => {
              for (let i = 0; i <= item.selected.length; i++) {
                if (itemD.serial === item.selected[i]) {
                  showModelDetails = showModelDetails.concat(itemD)
                }
              }
            })
          }
        })
        this.saveModels(showModelDetails)
        this.chooseModels(_this.selectAll)
        this.$emit('isMoreModels', true, 5)
      } else {
        this.$emit('showModelMethods', false)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.optional
  .el-dialog
    min-width: 950px
    .left
      width: 70%
      float: left
      height: 500px
      padding: 20px
      border: 1px dashed gray
      border-right: 0
      overflow-y: auto
      box-sizing()
      ul
        height: 458px
        overflow-y: auto
        overflow-x: hidden
        li
          overflow: hidden
          border-bottom: 1px dashed gray
          margin-bottom: 20px
          &:last-child
            margin-bottom: 0
            border-bottom 0
          p
            float: left
            width: 20%
            text-align: left
          .ophone-box
            float: left
            width: 80%
            .el-checkbox
              margin-left: 0
              margin-right: 15px
              &:first-child
                margin-right: 15px
            .el-checkbox
              margin-bottom: 20px
    .right
      width: 30%
      float: left
      height: 500px
      overflow-y: auto
      box-sizing()
      padding: 20px
      border: 1px dashed gray
      p.right-top
        height: 30px
        line-height: 30px
        i
          display: inline-block
          height: 30px
          width: 6px
          background: red
      ul.list-phone
        padding-left: 30px
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
          transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46)
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
        input
          display: none
          &:checked + .original-checkbox
            i
              display: block
              background: #20a0ff
    .bottom
      float: left
      width: 100%
      height: 80px
      position: relative
      .reset
        line-height: 1
        cursor: pointer
        background: #fff
        border: 1px solid #bfcbd9
        color: #555
        text-align: center
        box-sizing()
        padding: 10px 15px;
        font-size: 14px;
        position: absolute
        right: 100px
        top: 22px
      .confirm
        line-height: 1
        cursor: pointer
        background: #1f92f3
        color: #fff
        text-align: center
        box-sizing()
        padding: 10px 15px;
        font-size: 14px;
        border: 0
        position: absolute
        right: 30px
        top: 22px
</style>
