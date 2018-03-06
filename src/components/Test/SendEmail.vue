<template>
  <div class="send-success container">
    <h1>提交成功</h1>
    <p class="send-remind">测试报告将随后发送到你的邮箱，当然你也可以在<router-link to="/report" class="to-report">测试报告</router-link>页面查看</p>
    <p class="choose-suggess">如果你也想让其他人接收到测试报告，请在下面勾选并提交</p>
    <div id="uc_test"></div>
    <button class="sendemail-btn" @click="send">提交</button>
    <el-dialog title="提示" v-model="sendSuccess" size="tiny" @close="closePrompt">
      <span>邮件发送成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendSuccess = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import load from '../../js/load'
import axios from 'axios'

export default {
  data () {
    return {
      sendSuccess: false
    }
  },
  mounted () {
    load('http://cmslib.boyaagame.com/tool/?id=uCheck').then(() => {
      $('#uc_test').uCheck('test', {value_en: 1})
    }).catch((err) => {
      console.log(err)
    })
  },
  computed: {
    ...mapGetters([
      'taskid',
      'fileid'
    ])
  },
  methods: {
    send () {
      let str = document.getElementById('uc_test').getElementsByTagName('input')[1].defaultValue
      axios.post(this.$store.state.configApi.notifiedusers, {
        taskid: this.taskid,
        sendusers: str,
        fileID: this.fileid
      }, {
        withCredentials: true
      }).then((response) => {
        this.sendSuccess = true
      }).catch((error) => {
        console.log(error)
      })
    },
    closePrompt () {
      this.sendSuccess = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.send-success
  padding: 40px
  color: #999
  .sendemail-btn
    display: block
    width: 144px
    height: 48px
    line-height: 48px
    background: #1f92f3
    color: #fff
    border: 0
  h1
    font-size: 30px
    font-weight: 700
    height: 50px
    color: #1f92f3
    line-height: 50px
    margin-bottom: 10px
  p.send-remind
    height: 30px
    line-height: 30px
    margin-bottom: 50px
    color: #839fb7
    a.to-report
      color: #1f92f3
      text-decoration: underline
  p.choose-suggess
    font-size: 10px
    padding-left: 40px
    color: #acacac
  #uc_test
    margin-left: 40px
    margin-top: 20px
    height: 153px
    span.chkd-usr
      display: block
      height: 80px;
      margin: 20px 0
      overflow-y: auto
      overflow-x: hidden
      .user-one
        margin: 5px 5px
        i
          background-color: transparent
          &:hover
            background-color: transparent
          &.i-remove
            right: 5px
            top: 5px
        span.badge
            width: 77px
            height: 23px
            background-color: #9f9f9f
            padding-left: 15px
            line-height: 23px
            border-radius: 20px
            text-align: center
    input
        width: 300px
        height: 33px
        margin: 0
        padding-left: 10px
        border: 1px solid #e3e3e3
    button
        width: 108px
        height: 33px
        border: 1px solid #e3e3e3
        background: #fff
        color: #555555
        margin-left: 10px
        margin-right: 24px
        font-size: 16px
</style>
