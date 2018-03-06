import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  uiautolists: {},
  uiautodevices: [],
  chooseScripts: [],
  saveScripts: []
}

const getters = {
  uiautolists: state => state.uiautolists,
  uiautodevices: state => state.uiautodevices,
  chooseScripts: state => state.chooseScripts,
  saveScripts: state => state.saveScripts
}

const actions = {
  getUiAutoLists ({commit, state, rootState}, taskid) {
    state.uiautolists = {}
    axios.get(rootState.configApi.uiTest + taskid + '/uiTest', {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_UIAUTOREPORT, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  filterUiAutoLists ({commit, state, rootState}, options) {
    state.uiautodevices = []
    axios.post(rootState.configApi.filterUI, {
      taskId: options.taskid,
      os_version: options.os_version,
      dpis: options.dpis,
      manufacturer: options.manufacturer
    }, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.result.devices
      commit('filterUiauto', responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_UIAUTOREPORT] (state, responseData) {
    state.uiautolists = responseData
  },
  filterUiauto (state, responseData) {
    state.uiautodevices = responseData
  },
  chooseScripts (state, scripts) {
    state.chooseScripts = scripts
  },
  saveScripts (state, saveScripts) {
    state.saveScripts = saveScripts
  },
  deleteSaveScripts (state, caseid) {
    state.saveScripts.forEach((item, index) => {
      if (item.id.indexOf(caseid) > -1) {
        state.saveScripts.splice(index, 1)
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
