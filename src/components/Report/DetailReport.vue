<template>
  <div class="detail-report container">
    <item-header :title="title"></item-header>
    <div class="detail-nav">
      <router-link :to="'/report/' + routeType + '/detail/' + routeFileid + '/' + routeTaskid" class="testlist" :class="{ active1: $route.matched[2].path === '/report/:type/detail/:fileid/:taskid/'}">测试概况<i></i></router-link>
      <router-link :to="'/report/' + routeType + '/detail/' + routeFileid + '/' + routeTaskid + '/terminal'" class="terminallist" :class="{ active1: $route.matched[2].path === '/report/:type/detail/:fileid/:taskid/terminal'}">终端概况<i></i></router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import itemHeader from '../ItemHeader/ItemHeader'

export default {
  data () {
    return {
      title: '兼容性测试报告',
      routeFileid: '',
      routeTaskid: '',
      routeType: ''
    }
  },
  created () {
    this.routeType = this.$route.params.type
    this.routeFileid = this.$route.params.fileid
    this.routeTaskid = this.$route.params.taskid
  },
  components: {
    itemHeader
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.detail-report
  .detail-nav
    margin-top: 20px
    margin-bottom: 20px
    font-size: 0px
    border-bottom: 1px solid #d8cece
    .active1
      color: #1f92f3
    a
      display: inline-block
      width: 70px
      height: 40px
      line-height: 40px
      text-align: center
      font-size: 14px
      margin-right: 10px
      position: relative
      i
        position: absolute
        height: 2px
        width: 100%
        left: 0
        bottom: 0
        background: transparent
      &:hover
        color: #1f92f3
        i
          background: #1f92f3
      &.active1
        color: #1f92f3
        i
          background: #1f92f3
</style>
