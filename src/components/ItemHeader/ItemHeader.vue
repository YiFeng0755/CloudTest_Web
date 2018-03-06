<template>
  <h1 class="item-header">
    <span class="item-title">{{title}}<i class="title-sign"></i></span>
    <a v-if="$route.path === '/test/compatible' || $route.path === '/test/ui-automated' || $route.path === '/test/ui-activity' || $route.path === '/test/choose' || $route.path.indexOf('/detail') !== -1 || $route.path.indexOf('/ui-activity') !== -1 || $route.path.indexOf('/uiTest') !== -1 || ($route.path.indexOf('/setting/detail') === 0 && $route.path !== '/setting')" @click="fallback"><i class="iconfont">&#xe660;</i><span>返回</span></a>
  </h1>
</template>

<script>
export default {
  props: [
    'title'
  ],
  data () {
    return {
    }
  },
  methods: {
    fallback () {
      if (this.$route.path.indexOf('/test') === 0) {
        this.$router.push('/test')
      } else if (this.$route.path.indexOf('/detail') && this.$route.path.indexOf('/setting/detail') === -1) {
        this.$router.push('/report')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.item-header
  border-bottom: 1px solid #e7e7e7
  font-weight: 700
  font-size: 20px
  height: 30px
  line-height: 30px
  margin-bottom: 20px
  .item-title
    height: 30px
    line-height: 30px
    display: inline-block
    position: relative
    color: #1f92f3
    .title-sign
      position: absolute
      width: 100%
      height: 2px
      left: 0
      bottom: -1px
      background: #1f92f3
  a
    float: right
    height: 30px
    line-height: 30px
    width: 47px
    position: relative
    cursor: pointer
    color: #858585
    i
      position: relative
      top: -2px
      left: -2px
    span
      font-size: 14px
      position: absolute
      right: 0
      top: 0
</style>
