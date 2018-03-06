<template>
  <div class="model-list">
    <el-select v-model="value" placeholder="请选择" @change="searchSuite">
      <el-option
        v-for="item in suites"
        :label="item.suite_name"
        :value="item.suite_name">
      </el-option>
  </el-select>
  </div>
</template>

<script>
export default {
  props: [
    'suites',
    'reseta'
  ],
  data () {
    return {
      value: ''
    }
  },
  computed: {
    isNowReset () {
      return this.reseta
    }
  },
  watch: {
    isNowReset (newVal, oldVal) {
      if (newVal) {
        this.value = ''
        this.$emit('isNowReseta', false)
      }
    }
  },
  methods: {
    searchSuite () {
      this.$emit('chooseSuite', this.value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
</style>
