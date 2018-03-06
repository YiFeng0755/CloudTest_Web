import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  devoptions: [],
  devicelogs: [],
  devImages: []
}

const getters = {
  devoptions: state => state.devoptions,
  devicelogs: state => state.devicelogs,
  devImages: state => state.devImages
}

const actions = {
  getDevOptions ({commit, state, rootState}, taskid) {
    state.devoptions = []
    axios.get(rootState.configApi.loadTaskDevOptions + taskid, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_DEVOPTIOS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getDeviceLogs ({commit, state, rootState}, searchOption) {
    state.devicelogs = []
    axios.get(rootState.configApi.loadDeviceLog + searchOption.taskid + '/' + searchOption.phone + '/' + searchOption.type + '/' + searchOption.startn + '/' + searchOption.endn, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.AllLines
      commit(types.GET_DEVICELOG, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getDevImages ({commit, state, rootState}, option) {
    state.devImages = []
    axios.get(rootState.configApi.screen + option.taskid + '/' + option.serials + '/' + option.num, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_DEVIMAGES, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_DEVOPTIOS] (state, responseData) {
    state.devoptions = responseData
  },
  [types.GET_DEVICELOG] (state, responseData) {
    state.devicelogs = responseData
  },
  [types.GET_DEVIMAGES] (state, responseData) {
    state.devImages = state.devImages.push(responseData)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
