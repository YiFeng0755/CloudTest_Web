import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  optionalLists: [],
  searchLists: [],
  chooseModels: [],
  saveModels: []
}

const getters = {
  optionalLists: state => state.optionalLists,
  searchLists: state => state.searchLists,
  chooseModels: state => state.chooseModels,
  saveModels: state => state.saveModels
}

const actions = {
  getOptionalLists ({commit, state, rootState}) {
    state.optionalLists = []
    axios.get(rootState.configApi.loadPhoneModels, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_OPTIONALMODELS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getSearchLists ({commit, state, rootState}, search) {
    state.searchLists = []
    axios.get(rootState.configApi.searchPhoneSerial, {
      params: {
        manufacturer: search.manufacturer,
        version: search.version,
        dpis: search.dpis
      },
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_SEARCHMODELS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_OPTIONALMODELS] (state, responseData) {
    state.optionalLists = responseData
  },
  [types.GET_SEARCHMODELS] (state, responseData) {
    if (responseData.success) {
      state.searchLists = responseData.result
      state.searchLists.forEach((searchList, index) => {
        searchList.devices.forEach((item) => {
          state.searchLists[index].selected.push(item.serial)
        })
      })
    } else {
      state.searchLists = []
    }
  },
  chooseModels (state, models) {
    state.chooseModels = models
  },
  saveModels (state, saveModels) {
    state.saveModels = saveModels
  },
  deleteSaveModels (state, serial) {
    state.saveModels.forEach((item, index) => {
      if (item.serial.indexOf(serial) > -1) {
        state.saveModels.splice(index, 1)
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
