import * as types from '../mutations-types'
import axios from 'axios'
import moment from 'moment'

const state = {
  historicalUpload: [],
  historicalCount: ''
}

const getters = {
  historicalUpload: state => state.historicalUpload,
  historicalCount: state => state.historicalCount
}

const actions = {
  getHistoricalUpload ({commit, state, rootState}) {
    state.historicalUpload = []
    state.historicalCount = ''
    axios.get(rootState.configApi.apkinfo, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_HISTORICALUPLOAD, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_HISTORICALUPLOAD] (state, responseData) {
    state.historicalUpload = responseData.apkinfos
    state.historicalUpload.forEach((item, index) => {
      state.historicalUpload[index].committime = moment(item.committime).format('YYYY-MM-DD HH:mm:ss')
    })
    state.historicalCount = responseData.count
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
