<template>
  <div class="project-list">
    <el-input class="searchTitle" v-model="value" placeholder="选择项目" @focus="showChooseProject"></el-input>
    <el-dialog v-model="showProject" @close="hideChooseProject">
      <el-input v-model="seachValue"></el-input>
      <ul class="projectBox">
        <li v-for="projects in filterBy(projectlists, seachValue)">
          <p>{{projects.projectStudio}}</p>
          <ul class="projects">
            <li v-for="project in projects.projects">
              <el-button @click="chooseProject(project)">{{project.projectName}}</el-button>
            </li>
          </ul>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'reset'
  ],
  data () {
    return {
      value: '',
      seachValue: '',
      showProject: false
    }
  },
  created () {
    this.getProjectList()
  },
  computed: {
    ...mapGetters([
      'projectlists'
    ]),
    isNowReset () {
      return this.reset
    }
  },
  watch: {
    isNowReset (newVal, oldVal) {
      if (newVal) {
        this.value = ''
        this.$emit('isNowReset', false)
      }
    }
  },
  methods: {
    ...mapActions([
      'getProjectList'
    ]),
    showChooseProject () {
      this.showProject = true
    },
    hideChooseProject () {
      this.seachValue = ''
      this.showProject = false
    },
    chooseProject (project) {
      this.value = project.projectName
      this.showProject = false
      this.$emit('chooseProject', project.projectId, project.projectName)
      this.$emit('activityProject', project.projectName)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.project-list
  .projectBox
    margin-top: 10px
    margin-bottom: 20px
    li
      overflow: hidden
      margin-bottom: 5px
    p
      font-weight: 700
      height: 30px
      line-height: 30px
    ul.projects
      li
        float: left
        margin-right: 10px
        .el-button
          margin-top: 0
</style>
