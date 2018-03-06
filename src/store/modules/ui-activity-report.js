import * as types from '../mutations-types'
import moment from 'moment'
import axios from 'axios'

const state = {
  uiactivitylist: [],
  uiactivityDetail: [],
  searchOptions: {}
}

const getters = {
  uiactivitylist: state => state.uiactivitylist,
  uiactivityDetail: state => state.uiactivityDetail,
  searchOptions: state => state.searchOptions
}

const actions = {
  getUiActivityList ({commit, state, rootState}, taskid) {
    state.uiactivitylist = []
    axios.get(rootState.configApi.loadActivityDetail + taskid + '/activityTest', {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.list
      commit(types.GET_UIACTIVITYREPORTS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getUiActivityDetail ({commit, state, rootState}, taskid) {
    state.uiactivityDetail = []
    axios.get(rootState.configApi.loadActivityTaskDetail + taskid, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.list
      commit(types.GET_UIACTIVITYDETAIL, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getUiActivityOption ({commit, state, rootState}, taskid) {
    state.searchOptions = {}
    axios.get(rootState.configApi.loadTaskActivityOptions + taskid, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_UIACTIVITYOPTIONS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_UIACTIVITYREPORTS] (state, responseData) {
    state.uiactivitylist = responseData
    state.uiactivitylist.committime = moment(state.uiactivitylist.committime).format('YYYY-MM-DD HH:mm:ss')
  },
  [types.GET_UIACTIVITYDETAIL] (state, responseData) {
    state.uiactivityDetail = responseData
  },
  [types.GET_UIACTIVITYOPTIONS] (state, responseData) {
    state.searchOptions = responseData
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
