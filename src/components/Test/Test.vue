<template>
  <div class="test">
    <div class="wrap-card" v-show="$route.path === '/test'">
      <div class="el-card">
        <router-link to="/test/compatible" class="test-p1">
          <img class="el-card-left" src="./testP1.png" height="100" width="100" alt="">
          <div class="el-card-right">
            <h1>兼容性测试</h1>
            <p>快速自动化实现APP在大量真机上安装、运行，并模拟用户操作过程，快速发现APP隐藏的兼容性问题。</p>
          </div>
        </router-link>
      </div>
      <div class="el-card">
        <router-link to="/test/choose" class="test-p2">
          <img class="el-card-left" src="./testP2.gif" alt="">
          <div class="el-card-right">
            <h1>真机调试</h1>
            <p>通过浏览器和开发工具远程连接真是设备，实时操作，快速定位问题，海量机型，7×24小时在线。</p>
          </div>
        </router-link>
      </div>
      <div class="el-card no-margin-top">
        <router-link to="/test/ui-activity" class="test-p3">
          <img class="el-card-left" src="./testP4.gif" alt="">
          <div class="el-card-right">
            <h1>UI活动兼容性测试</h1>
            <p>针对H5活动页面做的测试，可以自动测试多款机型下的适配情况。</p>
          </div>
        </router-link>
      </div>
      <div class="el-card">
        <router-link to="/test/ui-automated" class="test-p4">
          <img class="el-card-left" src="./testP3.gif" alt="">
          <div class="el-card-right">
            <h1>UI自动化测试</h1>
            <p>可以选择不同的测试用例，测试游戏里面各种应用场景。敬请期待...</p>
          </div>
        </router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stf: this.$store.state.configApi.stfRouter
    }
  },
  created () {
    if (window.location.search.charAt(0) === '?') {
      this.$router.push('test')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.test
  min-width: 1000px
  margin-top: 70px
  margin-bottom: 88px
  min-height: 566px
  .wrap-card
    overflow: hidden
    .el-card
      float: left
      height: 268px
      border: 0
      border-radius: 0
      background: #f8f8f8
      position: relative
      a
        display: block
        padding: 80px 64px
        padding-bottom: 0
        color: #999
        height: 268px
        box-sizing()
        &.test-p1, &.test-p2
          border-bottom: 1px solid #e7e7e7
        &.test-p2, &.test-p4
          border-left: 1px solid #e7e7e7
        .el-card-left
          float: left
          width: 100px
          height: 100px
          margin-top: 10px
        .el-card-right
          float: left
          h1
            font-weight: 500
            font-size: 30px
            margin-bottom: 20px
          p
            line-height: 24px
      &:hover
        background: #fff
        a.test-p1:hover
          color: #0cd9aa
        a.test-p2:hover
          color: #1f92f3
        a.test-p3:hover
          color: #fe74b7
        a.test-p4:hover
          color: #ffa657
</style>
