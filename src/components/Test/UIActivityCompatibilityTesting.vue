<template>
  <div class="ui-compatible container">
    <item-header :title="title"></item-header>
    <p class="choose-project">
      <span class="test-title">
        选择项目:
      </span>
      <project-list @activityProject="activityProject"></project-list>
    </p>
    <p class="test-name">
      <span class="test-title">
        测试名称:
      </span>
      <el-input v-model="input"></el-input>
    </p>
    <p class="test-description">
      <span class="test-title description-title">
        测试描述:
      </span>
      <el-input type="textarea" :rows="2" v-model="description" placeholder="可不填写"></el-input>
    </p>
    <p class="test-url">
      <span class="test-title">
        测试URL地址:
      </span>
      <el-input v-model="testUrl" placeholder="输入运营平台的活动地址"></el-input>
    </p>
    <p class="test-screen">
      <span class="test-title">
        横竖屏选择:
      </span>
      <el-radio-group v-model="screen" class="choose-screen">
        <el-radio label="LANDSCAPE">横屏</el-radio>
        <el-radio label="PORTRAIT">竖屏</el-radio>
      </el-radio-group>
    </p>
    <p class="choose-phone">
      <span class="choose-title">
        选择测试机:
      </span>
      <button class="optional" @click="optional">点击选择</button>
      <show-models :showModels="showModels" @deleteSerial="changeSerials" :showMoreModels="showMoreModels" @showMore="showMore" :showLength="showLength"></show-models>
    </p>
    <p class="help"><a href="http://test.oa.com:8080/wiki/index.php/%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E5%85%BC%E5%AE%B9%E6%80%A7%E6%B5%8B%E8%AF%95%E6%8C%87%E5%8D%97" target="_blank">帮助文档</a></p>
    <optional-models :isShowOptional="isShowOptional" @hideOptional="hideOptional" @chooseSerial="chooseSerial" @showModelMethods="showModelMethods" @isMoreModels="isMoreModels"></optional-models>
    <test-bottom :input="input" :testUrl="testUrl" :screen="screen"  :description="description" :title="title" :serialId="uploadSerialIds" :activityProject="uploadProjectName"></test-bottom>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import optionalModels from '../ModelSelection/OptionalModels'
import testBottom from './TestBottom'
import showModels from '../ModelSelection/ShowModels'
import projectList from '../ProjectList/ProjectList'

export default {
  data () {
    return {
      title: 'UI活动兼容性测试',
      screen: 'LANDSCAPE',
      isShowOptional: false,
      input: '',
      description: '',
      testUrl: '',
      uploadSerialIds: [],
      showModels: false,
      showMoreModels: '',
      showLength: '',
      uploadProjectName: ''
    }
  },
  components: {
    itemHeader,
    optionalModels,
    testBottom,
    showModels,
    projectList
  },
  methods: {
    optional () {
      this.isShowOptional = true
    },
    hideOptional (boolean) {
      this.isShowOptional = boolean
    },
    chooseSerial (serial, boolean) {
      this.uploadSerialIds = []
      serial.forEach((item) => {
        this.uploadSerialIds.push(item)
      })
      this.isShowOptional = boolean
    },
    showModelMethods (boolean) {
      this.showModels = boolean
    },
    isMoreModels (boolean, showLength) {
      this.showMoreModels = true
      this.showLength = showLength
    },
    changeSerials (serial) {
      if (this.uploadSerialIds.indexOf(serial) > -1) {
        this.uploadSerialIds.splice(this.uploadSerialIds.indexOf(serial), 1)
      }
    },
    showMore (boolean, showLength) {
      this.showMoreModels = false
      this.showLength = showLength
    },
    activityProject (projectName) {
      this.uploadProjectName = projectName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.ui-compatible
  .test-name, .test-description, .test-url, .test-screen
    overflow: hidden
    margin-bottom: 20px
    padding-left: 160px
    span.test-title
      float: left
      height: 42px
      line-height: 42px
      width: 120px
      text-align: right
      margin-right: 30px
      &.description-title
        height: 80px
        line-height: 80px
      &:before
        content: '*'
        color: #ff4949
    .el-input
      float: left
      width: 370px
      .el-input__inner
        width: 370px
        height: 42px
        line-height: 42px
        border-radius: 0
    .el-textarea
      float: left
      width: 370px
      .el-textarea__inner
        width: 370px
        height: 80px
        border-radius: 0
    .el-radio-group
      float: left
      padding: 13px 0 9px 0
    .choose-screen
      .el-radio__label
        font-weight: bold
        font-size: 16px
  .choose-project
    overflow: hidden
    margin-bottom: 20px
    padding-left: 160px
    span.test-title
      float: left
      height: 42px
      line-height: 42px
      width: 120px
      text-align: right
      margin-right: 30px
      &:before
        content: '*'
        color: #ff4949
    .project-list
      float: left
      .el-input__inner
        height: 42px
        line-height: 42px
        width: 370px
        border-radius: 0
  .test-description
    span.test-title
      &:before
        content: ''
        padding-left: 8px
  .choose-phone
    padding-left: 160px
    line-height: 42px
    position: relative
    span.choose-title
      float: left
      height: 42px
      line-height: 42px
      text-align: right
      width: 120px
      margin-right: 30px
      &:before
        content: '*'
        color: #ff4949
    .optional
      border: 1px solid #1f92f3
      color: #1f92f3
      height: 42px
      line-height: 42px
      background: #f8f8f8
      width: 164px
      box-sizing()
      cursor: pointer
  .help
    position: relative
    height: 20px
    margin-top: 20px
    a
      position: absolute
      left: 310px
      text-decoration: underline
      color: #6d6868
</style>
