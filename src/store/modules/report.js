import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  chooseTags: [],
  taskList: [],
  count: ''
}

const getters = {
  chooseTags: state => state.chooseTags,
  taskList: state => state.taskList,
  count: state => state.count
}

const actions = {
  getTaskList ({commit, state, rootState}, nowSelect) {
    state.taskList = []
    state.count = ''
    axios.post(rootState.configApi.selectTaskList, {
      taskTypes: ['monkey', 'activityTest', 'uiTest'],
      projectNames: '',
      committer: '',
      timePast: nowSelect.startDate,
      timeNow: nowSelect.endDate,
      page: 1,
      pageSize: 10
    }, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_TASKLIST, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  searchTasklist ({commit, state, rootState}, search) {
    state.taskList = []
    state.count = ''
    axios.post(rootState.configApi.selectTaskList, {
      taskTypes: search.types,
      projectNames: search.tagValue,
      committer: search.committer,
      timePast: search.startDate,
      timeNow: search.endDate,
      page: search.page || 1,
      pageSize: 10
    }, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit('searchTasklist', responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  addTag (state, tag) {
    state.chooseTags = tag
  },
  deleteTag (state, tag) {
    state.chooseTags.forEach((item, index) => {
      if (item === tag.value) {
        state.chooseTags.splice(index, 1)
      }
    })
  },
  [types.GET_TASKLIST] (state, responseData) {
    state.taskList = responseData.taskList
    state.count = responseData.count
  },
  searchTasklist (state, searchData) {
    state.taskList = searchData.taskList
    state.count = searchData.count
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
