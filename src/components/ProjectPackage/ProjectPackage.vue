<template>
  <div class="project-package">
    <p class="choose-project">
      <span class="choose-title">
        选择项目:
      </span>
      <project-list @chooseProject="chooseProject"></project-list>
    </p>
    <p class="choose-package">
      <span class="choose-title">
        选择测试包:
      </span>
      <el-radio-group v-model="packageRadio" @change="changeUpload">
        <el-radio :label="1">本地上传</el-radio>
        <el-radio :label="2">选择已上传的包</el-radio>
      </el-radio-group>
      <span class="wq"></span>
      <span class="upload-box" v-show="isLocal">
        <el-upload :action="monkeyUrl" :data="uploadData" :on-error="handleError" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" accept=".apk" with-credentials="true">
          <el-button size="small" type="primary">选择并上传</el-button>
        </el-upload>
      </span>
      <span class="upload-box" v-show="!isLocal">
        <input type="text" class="history-upload" @click="historicalUpload" id="localFileName" v-model="historyUpload"/>
        <label id="upBtn" class="upload" @click="historicalUpload">选择</label>
      </span>
    </p>
    <historical-package @hideHistorical="isHideHistorical" :isShowHistorical="isShowHistorical" @currentPackage="currentPackage"></historical-package>
  </div>
</template>

<script>
import projectList from '../ProjectList/ProjectList'
import historicalPackage from './HistoricalPackage'

export default {
  data () {
    return {
      packageRadio: 1,
      isLocal: true,
      isShowHistorical: false,
      fileName: '',
      monkeyUrl: this.$store.state.configApi.upload,
      historyUpload: '',
      userName: ''
    }
  },
  created () {
    this.userName = window.localStorage.getItem('userName')
  },
  computed: {
    uploadData () {
      return {
        userName: this.userName
      }
    }
  },
  components: {
    projectList,
    historicalPackage
  },
  methods: {
    changeUpload (label) {
      if (label === 1) {
        this.isLocal = true
      } else {
        this.isLocal = false
      }
    },
    historicalUpload () {
      this.isShowHistorical = !this.isShowHistorical
    },
    isHideHistorical (hide) {
      this.isShowHistorical = hide
    },
    handleFile (event) {
      this.fileName = event.currentTarget.files[0].name
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleError (err, response, file) {
      console.log(err, response, file)
    },
    handleSuccess (response, file, fileList) {
      this.$emit('uploadSuccess', response.resources.file.id)
    },
    chooseProject (projectId, projectName) {
      this.$emit('uploadProject', projectId, projectName)
    },
    currentPackage (boolean, fileName, fileId) {
      this.isShowHistorical = boolean
      this.historyUpload = fileName
      this.$emit('historyUploadId', fileId)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.project-package
  padding-left: 160px
  .choose-project
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
    .project-list
      float: left
      .el-input__inner
        height: 42px
        line-height: 42px
        width: 380px
        border-radius: 0
  .choose-package
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
    .el-radio-group
      float: left
      padding: 12px 0 10px 0
    span.wq
      clear: both
      display: block
    .upload-box
      padding-left: 32px
      display: block
      position: relative
      height: 42px
      .el-upload
        height: 42px
        width: 380px
        margin-left: 118px
        position: relative
        border: 1px solid #bfcbd9
        background: #fff
        box-sizing()
        &:hover
          border-color: #8391a5
        .el-upload__files
          margin-bottom: 0
          height: 40px
          li
            height: 40px
            a.el-upload__file__name
              height: 40px
              line-height: 40px
              margin-right: 0
              &:hover
                background: transparent
            .el-upload__btn-delete
              top: 5px
        .el-upload__inner
          position: absolute
          left: 390px
          top: -1px
          font-size: 0
          height: 42px
          line-height: 42px
          button
            padding: 0
            &.el-button--small
              border-radius: 0
              border: 0
            span
              width: 118px
              display: block
              height: 40px
              line-height: 40px
              color: #555555
              background: #fff
              border: 1px solid #bfcbd9
      .upload-input
        outline: none
        height: 42px
        line-height: 42px
        visibility: hidden
      .history-upload
        position: absolute
        border: 1px solid #bfcbd9
        left: 150px
        top: 0
        height: 42px
        line-height: 42px
        width: 380px
        background: #fff
        border: 1px solid #bfcbd9
        padding-left: 10px
        padding-right: 10px
        box-sizing()
      .input-upload
        position: absolute
        border: 1px solid #bfcbd9
        left: 150px
        top: 0
        height: 40px
        line-height: 40px
        width: 380px
        outline: none
        background: transparent
      .show-file-name
        width: 370px
        height: 40px
        line-height: 40px
        border: 0
        position: absolute
        left: 151px
        top: 0
        padding-left: 10px
      label.upload
        position: absolute
        top: 0
        left: 540px
        width: 118px
        height: 40px
        line-height: 40px
        padding: 0 8px
        background: #1D8CE0
        text-align: center
        color: #555555
        background: #fff
        cursor: pointer
        border: 1px solid #bfcbd9
        position: absolute
        z-index: 100
</style>
