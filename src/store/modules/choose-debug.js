import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  choosedebugs: [],
  curdevices: {}
}

const getters = {
  choosedebugs: state => state.choosedebugs,
  curdevices: state => state.curdevices
}

const actions = {
  getChooseDebugs ({commit, state, rootState}) {
    state.choosedebugs = []
    axios.get(rootState.configApi.devices, {
      withCredentials: true
    }).then((respose) => {
      let responseData = respose.data.devices
      commit(types.GET_CHOOSEDEBUGS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getCurDevices ({commit, state, rootState}, serialId) {
    state.curdevices = {}
    axios.get(rootState.configApi.devices + serialId, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.device
      commit(types.GET_CURDEVICES, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_CHOOSEDEBUGS] (state, responseData) {
    state.choosedebugs = responseData
  },
  [types.GET_CURDEVICES] (state, responseData) {
    state.curdevices = responseData
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
