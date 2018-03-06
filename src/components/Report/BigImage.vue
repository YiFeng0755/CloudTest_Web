<template>
  <el-dialog class="imgBig" v-model="isShowBig" @close="closeImage">
    <p class="tool">
      <a href="javascript:;" class="arr_left" @click="rotate('bigImg', 'left')">左转</a>
      <a href="javascript:;" class="arr_right" @click="rotate('bigImg', 'right')">右转</a>
    </p>
    <a :href="bigImg" target="_blank">
      <img :src="bigImg" alt="" id="bigImg" style="width: 700px">
    </a>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'show',
    'src'
  ],
  computed: {
    isShowBig () {
      return this.show
    },
    bigImg () {
      return this.src
    }
  },
  data () {
    return {
      step: false
    }
  },
  methods: {
    closeImage () {
      this.$emit('closeImage', false)
      if (document.all) {
        this.step = false
        let img = document.getElementById('bigImg')
        img.setAttribute('step', '')
      } else {
        if (this.step) {
          let canvas = document.getElementById('canvas_bigImg')
          let img = document.getElementById('bigImg')
          canvas.parentNode.removeChild(document.getElementById('canvas_bigImg'))
          img.style.visibility = 'inherit'
          img.style.position = 'relative'
          img.setAttribute('step', '')
          this.step = false
        }
      }
    },
    rotate (obj, arr) {
      this.step = true
      let img = document.getElementById(obj)
      if (!img || !arr) {
        return false
      }
      let n = img.getAttribute('step')
      if (n === null) {
        n = 0
      }
      if (arr === 'left') {
        n--
        if (n < 0) {
          n = 3
        }
      } else if (arr === 'right') {
        n++
        if (n > 3) {
          n = 0
        }
      }
      img.setAttribute('step', n)
      if (document.all) {
        img.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + n + ')'
          // HACK FOR MSIE 8
        switch (n) {
          case 0:
            img.parentNode.style.height = img.height
            break
          case 1:
            img.parentNode.style.height = img.width
            break
          case 2:
            img.parentNode.style.height = img.height
            break
          case 3:
            img.parentNode.style.height = img.width
            break
        }
      } else {
        let c = document.getElementById('canvas_' + obj)
        if (c === null) {
          img.style.visibility = 'hidden'
          img.style.position = 'absolute'
          c = document.createElement('canvas')
          c.setAttribute('id', 'canvas_' + obj)
          img.parentNode.appendChild(c)
        }
        let canvasContext = c.getContext('2d')
        switch (n) {
          default :
          case 0 :
            c.setAttribute('width', img.width)
            c.setAttribute('height', img.height)
            canvasContext.rotate(0 * Math.PI / 180)
            canvasContext.drawImage(img, 0, 0, img.width, img.height)
            break
          case 1 :
            c.setAttribute('width', img.height)
            c.setAttribute('height', img.width)
            canvasContext.rotate(90 * Math.PI / 180)
            canvasContext.drawImage(img, 0, -img.height, img.width, img.height)
            break
          case 2 :
            c.setAttribute('width', img.width)
            c.setAttribute('height', img.height)
            canvasContext.rotate(180 * Math.PI / 180)
            canvasContext.drawImage(img, -img.width, -img.height, img.width, img.height)
            break
          case 3 :
            c.setAttribute('width', img.height)
            c.setAttribute('height', img.width)
            canvasContext.rotate(270 * Math.PI / 180)
            canvasContext.drawImage(img, -img.width, 0, img.width, img.height)
            break
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/base.styl"

.imgBig
  .el-dialog
    position: relative
    &.el-dialog--small
      width: inherit
      float: left
    .tool
      height: 28px
      line-height: 24px
      a
        float: left
        width: 50px
        height: 20px
        background: url(arr.gif) no-repeat
        text-indent: 16px
        &.arr_left
          background-position: 2px 6px
        &.arr_right
          background-position: 2px -21px
    button
      position: absolute
    a
      display: block
    img#bigImg
</style>
