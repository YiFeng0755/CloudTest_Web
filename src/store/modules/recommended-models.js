import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  recommendedmdels: [],
  recommendSerials: []
}

const getters = {
  recommendedmdels: state => state.recommendedmdels,
  recommendSerials: state => state.recommendSerials
}

const actions = {
  getRecommendedmdels ({commit, state, rootState}) {
    state.recommendedmdels = []
    state.recommendSerials = []
    axios.get(rootState.configApi.loadRecommendDevices, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.list
      commit(types.GET_RECOMMENDEDMODELS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_RECOMMENDEDMODELS] (state, responseData) {
    state.recommendedmdels = responseData
    state.recommendedmdels.forEach((item) => {
      state.recommendSerials.push(item.serial)
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
