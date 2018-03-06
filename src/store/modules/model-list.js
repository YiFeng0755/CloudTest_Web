import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  modellists: []
}

const getters = {
  modellists: state => state.modellists
}

const actions = {
  getModelList ({commit, state, rootState}) {
    state.modellists = []
    axios.get('/api/modellist', {
      withCredentials: true
    }).then((response) => {
      if (response.data.errno === rootState.ERR_OK) {
        let responseData = response.data
        commit(types.GET_MODELLIST, responseData)
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_MODELLIST] (state, responseData) {
    state.modellists = responseData.data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
