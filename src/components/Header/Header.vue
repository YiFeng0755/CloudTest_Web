<template>
  <div class="header">
    <el-row class="container">
      <el-col :span="24">
        <router-link to="/" class="logo">
          <span></span>
        </router-link>
        <router-link to="/test">
          开始测试
          <em class="route-active"></em>
        </router-link>
        <router-link to="/report">
          测试报告
          <em class="route-active"></em>
        </router-link>
        <router-link to="/setting">
          模块用例管理
          <em class="route-active"></em>
        </router-link>
        <span class="userName">
          <i class="iconfont">&#xe691;</i>
          <i class="name">{{name}}</i>
          <a href="http://test.oa.com:8080/wiki/index.php/%E4%BA%91%E6%B5%8B%E5%B9%B3%E5%8F%B0" target="_blank">云测平台wiki</a>
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: [
    'name'
  ],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.header
  min-width: 1000px
  height: 90px
  background: #1f92f3
  margin-bottom: 20px
  .el-row
    height: 90px
    .el-col
      height: 90px
      padding-right: 20px
      position: relative
      background: #fff
      &:after
        content: ''
        position: absolute
        height: 90px
        width: 100%
        background: #fff
      a
        float: left
        height: 90px
        line-height: 90px
        margin-left: 74px
        color: #1f92f3
        position: relative
        &.active
          .route-active
            position: absolute
            left: 0
            bottom: 0
            height: 2px
            width: 100%
            background: #1f92f3
      a.logo
        width: 208px
        padding-left: 20px
        margin-left: 0
        background: #1f92f3
        span
          width: 208px
          height: 90px
          display: block
          background: url(logo.png) no-repeat
      span.userName
        float: right
        height: 90px
        line-height: 90px
        position: relative
        z-index: 2
        color: #1f92f3
        i
          font-style: normal
          &.name
            color: #1f92f3
        a
          float: right
          margin-left: 10px
</style>
