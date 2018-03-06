<template>
  <div class="project-list">
    <el-select v-model="chooseTags" multiple placeholder="点击选择项目" @change="multipleValue" @visible-change="hiddenInput">
      <el-option class="search-input" disabled>
        <el-input v-model="searchInput" placeholder="快速查找"></el-input>
      </el-option>
      <el-option
        v-for="item in filterBy(projectmutiples, searchInput)"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  props: [
    'types',
    'committer',
    'startDate',
    'endDate'
  ],
  data () {
    return {
      tags: [],
      searchInput: ''
    }
  },
  created () {
    this.getProjectMutiples()
  },
  computed: {
    ...mapGetters([
      'projectmutiples',
      'chooseTags'
    ]),
    tagValue () {
      let tagValue = []
      this.tags.forEach((item) => {
        tagValue.push(item.name)
      })
      return tagValue
    },
    search () {
      let search = {}
      search.types = this.types
      search.tagValue = this.tagValue
      search.committer = this.committer
      search.startDate = this.startDate
      search.endDate = this.endDate
      return search
    }
  },
  methods: {
    ...mapActions([
      'getProjectMutiples',
      'searchTasklist'
    ]),
    ...mapMutations([
      'addTag'
    ]),
    multipleValue () {
      this.tags = []
      this.addTag(this.chooseTags)
      for (let i = 0; i <= this.projectmutiples.length - 1; i++) {
        for (let j = 0; j <= this.chooseTags.length - 1; j++) {
          if (this.projectmutiples[i].value === this.chooseTags[j]) {
            this.tags.push({
              key: i,
              name: this.projectmutiples[i].label,
              value: this.projectmutiples[i].value
            })
          }
        }
      }
      this.$emit('chooseTag', this.tags, 1)
      this.searchTasklist(this.search)
      this.searchInput = ''
    },
    hiddenInput () {
      this.searchInput = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.el-select-dropdown__item
  &.search-input
    padding-top: 0
    padding-bottom: 0
    &.hover
      background-color: transparent!important
    .el-input__inner
      border-radius: 0
.el-select-dropdown.is-multiple
  .el-select-dropdown__item
    &.search-input.selected::after
      display: none
</style>
