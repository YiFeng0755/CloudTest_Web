import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  detailreports: {},
  successdetail: '',
  faildetail: '',
  successpercent: '',
  chartdata: [],
  errloglist: []
}

const getters = {
  detailreports: state => state.detailreports,
  successdetail: state => state.successdetail,
  faildetail: state => state.faildetail,
  successpercent: state => state.successpercent,
  chartdata: state => state.chartdata,
  errloglist: state => state.errloglist
}

const actions = {
  getDetailReports ({commit, state, rootState}, options) {
    state.detailreports = {}
    state.successdetail = ''
    state.faildetail = ''
    state.successpercent = ''
    state.chartdata = []
    axios.get(rootState.configApi.loadTaskdetail + options.taskid + '/' + options.type, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_DETAILREPORTS, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getErrLogList ({commit, state, rootState}, taskid) {
    state.errloglist = []
    axios.get(rootState.configApi.loadtaskerrorinfo + taskid, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.errorlist
      commit(types.GET_DETAILLOG, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_DETAILREPORTS] (state, responseData) {
    state.detailreports = responseData
    let Sdevice = 0
    state.detailreports.detail.forEach((item) => {
      if (item.status === 'success') {
        Sdevice++
      }
    })
    state.chartdata = []
    state.successdetail = Sdevice
    state.faildetail = state.detailreports.detail.length - state.successdetail
    state.successpercent = state.successdetail / state.detailreports.detail.length
    if (!state.successpercent) {
    } else {
      state.successpercent = parseInt(state.successpercent.toFixed(2) * 100)
    }
    state.chartdata.push(['通过测试', state.successdetail])
    state.chartdata.push(['未通过测试', state.faildetail])
  },
  [types.GET_DETAILLOG] (state, responseData) {
    state.errloglist = responseData
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
