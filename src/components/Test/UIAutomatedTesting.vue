<template>
  <div class="ui-automated container">
    <item-header :title="title"></item-header>
    <project-package @uploadSuccess="uploadSuccess" @historyUploadId="historyUploadId" @uploadProject="uploadProject"></project-package>
    <p class="choose-surroundings">
      <span class="choose-title">
        测试环境:
      </span>
      <span class="project-surroundings">
        <el-radio-group v-model="surroundings">
          <el-radio label="test">测试环境</el-radio>
          <el-radio label="release">正式环境</el-radio>
          <el-radio label="prerelease">预发布环境</el-radio>
        </el-radio-group>
      </span>
    </p>
    <div class="choose-scripts">
      <span class="choose-title">
        选择脚本:
      </span>
      <button class="scripts" @click="scripts">点击选择</button>
      <show-scripts :showScriptsLength="showScriptsLength" @deleteCase="changeScript" :showScripts="showScripts"></show-scripts>
    </div>
    <div class="choose-phone">
      <span class="choose-title">
        选择测试机:
      </span>
      <button class="optional" @click="optional">点击选择</button>
      <show-models :showModels="showModels" :showMoreModels="showMoreModels" :showLength="showLength" @deleteSerial="changeSerials" @showMore="showMore"></show-models>
    </div>
    <scripts :isShowScripts="isShowScripts" @hidescripts="hideScripts" :allSuite="projectId ? allSuite : []" @chooseSctipts="chooseSctipts" @isScriptsBox="isScriptsBox" @showScriptMethods="showScriptMethods"></scripts>
    <optional-models :isShowOptional="isShowOptional" @hideOptional="hideOptional" @chooseSerial="chooseSerial" @isMoreModels="isMoreModels" @showModelMethods="showModelMethods"></optional-models>
    <test-bottom :autoProject="autoProjectName" :autoFileId="autoFileId" :testEnv="surroundings" :cases="scriptsCaseids" :autoSerials="uploadSerialIds" :title="title"></test-bottom>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'
import projectPackage from '../ProjectPackage/ProjectPackage'
import optionalModels from '../ModelSelection/OptionalModels'
import scripts from '../Scripts/Scripts'
import testBottom from './TestBottom'
import showModels from '../ModelSelection/ShowModels'
import showScripts from '../Scripts/ShowScripts'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      title: 'UI自动化测试',
      surroundings: 'test',
      isShowOptional: false,
      isShowScripts: false,
      projectId: '',
      showModels: false,
      showMoreModels: '',
      showLength: '',
      showScripts: false,
      showScriptsLength: '',
      uploadSerialIds: [],
      scriptsCaseids: [],
      autoProjectName: '',
      autoFileId: ''
    }
  },
  computed: {
    ...mapGetters([
      'allSuite'
    ])
  },
  components: {
    itemHeader,
    projectPackage,
    optionalModels,
    scripts,
    testBottom,
    showModels,
    showScripts
  },
  methods: {
    ...mapActions([
      'getAllSuites'
    ]),
    optional () {
      this.isShowOptional = true
    },
    hideOptional (boolean) {
      this.isShowOptional = boolean
    },
    scripts () {
      this.isShowScripts = true
    },
    hideScripts (boolean) {
      this.isShowScripts = boolean
    },
    uploadProject (projectId, projectName) {
      this.projectId = projectId
      this.autoProjectName = projectName
      this.getAllSuites(this.autoProjectName)
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
    chooseSerial (serial, boolean) {
      this.uploadSerialIds = []
      serial.forEach((item) => {
        this.uploadSerialIds.push(item)
      })
      this.isShowOptional = boolean
    },
    isMoreModels (boolean, showLength) {
      this.showMoreModels = true
      this.showLength = showLength
    },
    showModelMethods (boolean) {
      this.showModels = boolean
    },
    showScriptMethods (boolean) {
      this.showScripts = boolean
    },
    chooseSctipts (cases) {
      this.scriptsCaseids = []
      cases.forEach((item) => {
        this.scriptsCaseids.push(item)
      })
    },
    isScriptsBox (scriptslength, boolean) {
      this.showScriptsLength = scriptslength
      this.isShowScripts = boolean
    },
    changeScript (caseid) {
      if (this.scriptsCaseids.indexOf(caseid) > -1) {
        this.scriptsCaseids.splice(this.scriptsCaseids.indexOf(caseid), 1)
      }
    },
    uploadSuccess (fileId) {
      this.autoFileId = fileId
    },
    historyUploadId (historyId) {
      this.autoFileId = historyId
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.ui-automated
  .choose-surroundings
    padding-left: 160px
    overflow: hidden
    margin-bottom: 20px
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
    .project-surroundings
      float: left
      padding: 12px 0 10px 0
  .choose-phone
    padding-left: 160px
    line-height: 42px
    margin-bottom: 20px
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
  .choose-scripts
    padding-left: 160px
    line-height: 42px
    position: relative
    margin-bottom: 20px
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
    .scripts
      border: 1px solid #1f92f3
      color: #1f92f3
      height: 42px
      line-height: 42px
      background: #f8f8f8
      width: 164px
      box-sizing()
      cursor: pointer
</style>
