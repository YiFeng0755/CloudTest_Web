<template>
  <div class="test-bottom">
    <button class="fallback" @click="fallback">返回</button>
    <button class="send-test" type="primary" @click="sendTest">提交测试</button>
    <p v-if="warn">{{warn}}</p>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import axios from 'axios'

export default {
  props: [
    'fileId',
    'projectId',
    'compatibleProjectName',
    'serialId',
    'title',
    'description',
    'input',
    'testUrl',
    'screen',
    'activityProject',
    'autoProject',
    'autoFileId',
    'testEnv',
    'cases',
    'autoSerials'
  ],
  data () {
    return {
      warn: ''
    }
  },
  methods: {
    ...mapMutations([
      'newTaskid',
      'newFileid'
    ]),
    fallback () {
      this.$router.go(-1)
    },
    sendTest () {
      if (this.title === '兼容性测试') {
        if (!this.projectId) {
          this.warn = '请选择项目名'
          return
        }
        if (!this.fileId) {
          this.warn = '请上传APK文件'
          return
        }
        if (this.serialId.length === 0) {
          this.warn = '请选择设备'
          return
        }
        this.warn = ''
        axios.post(this.$store.state.configApi.monkeytest, {
          id: this.fileId,
          Project: this.projectId,
          serials: this.serialId,
          projectName: this.compatibleProjectName
        }, {
          withCredentials: true
        }).then((response) => {
          this.newTaskid(response.data.taskid)
          this.newFileid(this.fileId)
          this.$router.push('/test/sendemail')
        }).catch((error) => {
          console.log(error)
        })
      }
      if (this.title === 'UI自动化测试') {
        if (!this.autoProject) {
          this.warn = '请选择项目名'
          return
        }
        if (!this.autoFileId) {
          this.warn = '请上传APK文件'
          return
        }
        if (this.cases.length === 0) {
          this.warn = '请选择测试脚本'
          return
        }
        if (this.autoSerials.length === 0) {
          this.warn = '请选择设备'
          return
        }
        this.warn = ''
        axios.post(this.$store.state.configApi.uiTestSend, {
          projectName: this.autoProject,
          fileId: this.autoFileId,
          testEnv: this.testEnv,
          cases: this.cases,
          serials: this.autoSerials
        }, {
          withCredentials: true
        }).then((response) => {
          console.log(response)
          this.$router.push('/test/sendemail')
        }).catch((error) => {
          console.log(error)
        })
      }
      if (this.title === 'UI活动兼容性测试') {
        if (!this.activityProject) {
          this.warn = '请选择项目'
          return
        }
        if (!this.input) {
          this.warn = '请输入测试名称'
          return
        }
        if (!this.testUrl) {
          this.warn = '请输入测试URL'
          return
        }
        if (this.serialId.length === 0) {
          this.warn = '请选择设备'
          return
        }
        if (this.testUrl.indexOf('http://') !== -1) {
          this.testUrl = this.testUrl
        } else {
          let httpUrl = 'http://'
          this.testUrl = httpUrl.concat(this.testUrl)
        }
        this.warn = ''
        axios.post(this.$store.state.configApi.activityCompatibility, {
          testName: this.input,
          testDesc: this.description,
          activityUrl: this.testUrl,
          screenOrientation: this.screen,
          serials: this.serialId,
          projectName: this.activityProject
        }, {
          withCredentials: true
        }).then((response) => {
          this.newTaskid(response.data.taskid)
          this.newFileid('')
          this.$router.push('/test/sendemail')
        }).catch((error) => {
          console.log(error)
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.test-bottom
  margin-top: 20px
  padding-top: 20px
  font-size: 0
  position: relative
  p
    position: absolute
    width: 100%
    height: 20px
    line-height: 20px
    text-align: center
    left: 0
    top: 0
    color: #FF4949
    font-size: 14px
  .fallback
    line-height: 1
    cursor: pointer
    background: #fff
    border: 1px solid #bfcbd9
    color: #555
    text-align: center
    box-sizing()
    padding: 10px 15px
    font-size: 14px
    margin-right: 10px
  .send-test
    line-height: 1
    cursor: pointer
    background: #1f92f3
    color: #fff
    text-align: center
    box-sizing()
    padding: 10px 15px
    font-size: 14px
    border: 0
</style>
