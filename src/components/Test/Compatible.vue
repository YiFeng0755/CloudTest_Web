<template>
  <div class="compatible container">
    <item-header :title="title"></item-header>
    <project-package @uploadSuccess="uploadSuccess" @uploadProject="uploadProject" @historyUploadId="historyUploadId"></project-package>
    <div class="choose-phone">
      <span class="choose-title">选择测试机:</span>
      <button class="recommend" @click="recommend">推荐机型(点击查看)</button>
      <button class="optional" @click="optional">自选机型</button>
      <show-models :showModels="showModels" @deleteSerial="changeSerials" :showMoreModels="showMoreModels" @showMore="showMore" :showLength="showLength"></show-models>
    </div>
    <test-bottom :fileId="uploadFileId" :projectId="uploadProjectId" :compatibleProjectName="compatibleProjectName" :serialId="uploadSerialIds" :title="title"></test-bottom>
    <recommended-models :isShowRecommend="isShowRecommend" @hideRecommend="hideRecommend" @recommendSerial="recommendSerial" @showModelMethods="showModelMethods"></recommended-models>
    <optional-models :isShowOptional="isShowOptional" @hideOptional="hideOptional"  @chooseSerial="chooseSerial" @showModelMethods="showModelMethods" @isMoreModels="isMoreModels"></optional-models>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import projectPackage from '../ProjectPackage/ProjectPackage'
import recommendedModels from '../ModelSelection/RecommendedModels'
import optionalModels from '../ModelSelection/OptionalModels'
import showModels from '../ModelSelection/ShowModels'
import testBottom from './TestBottom'

export default {
  data () {
    return {
      title: '兼容性测试',
      isShowRecommend: false,
      isShowOptional: false,
      uploadFileId: '',
      uploadProjectId: '',
      uploadSerialIds: [],
      showModels: false,
      showMoreModels: '',
      showLength: '',
      compatibleProjectName: ''
    }
  },
  created () {
  },
  components: {
    itemHeader,
    projectPackage,
    recommendedModels,
    optionalModels,
    showModels,
    testBottom
  },
  methods: {
    recommend () {
      this.isShowRecommend = true
    },
    optional () {
      this.isShowOptional = true
    },
    hideRecommend (boolean) {
      this.isShowRecommend = boolean
    },
    hideOptional (boolean) {
      this.isShowOptional = boolean
    },
    uploadSuccess (fileId) {
      this.uploadFileId = fileId
    },
    uploadProject (projectId, projectName) {
      this.uploadProjectId = projectId
      this.compatibleProjectName = projectName
    },
    chooseSerial (serial, boolean) {
      this.uploadSerialIds = []
      serial.forEach((item) => {
        this.uploadSerialIds.push(item)
      })
      this.isShowOptional = boolean
    },
    historyUploadId (historyId) {
      this.uploadFileId = historyId
    },
    showModelMethods (boolean) {
      this.showModels = boolean
    },
    changeSerials (serial) {
      if (this.uploadSerialIds.indexOf(serial) > -1) {
        this.uploadSerialIds.splice(this.uploadSerialIds.indexOf(serial), 1)
      }
    },
    isMoreModels (boolean, showLength) {
      this.showMoreModels = true
      this.showLength = showLength
    },
    showMore (boolean, showLength) {
      this.showMoreModels = false
      this.showLength = showLength
    },
    recommendSerial (serials) {
      this.uploadSerialIds = serials
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.compatible
  i
    font-style: normal
    color: red
  .choose-phone
    margin-top: 20px
    padding-left: 160px
    position: relative
    span.choose-title
      float: left
      height: 52px
      line-height: 52px
      text-align: right
      width: 120px
      &:before
        content: '*'
        color: #ff4949
    button
      width: 164px
      height: 52px
      box-sizing()
      &.recommend
        border: 0
        background: #1f92f3
        color: #fff
        margin-left: 30px
        cursor: pointer
      &.optional
        border: 1px solid #1f92f3
        color: #1f92f3
        background: #f8f8f8
        margin-left: 10px
        cursor: pointer
</style>
