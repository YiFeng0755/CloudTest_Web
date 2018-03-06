import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  settingdatas: [],
  suites: [],
  detailSuites: {},
  allSuite: []
}

const getters = {
  settingdatas: state => state.settingdatas,
  suites: state => state.suites,
  detailSuites: state => state.detailSuites,
  allSuite: state => state.allSuite
}

const actions = {
  getSettingdatas ({commit, state, rootState}, options) {
    if (!options) {
      state.settingdatas = []
      axios.get(rootState.configApi.loadTestSuite, {
        withCredentials: true
      }).then((response) => {
        let responseData = response.data
        commit(types.GET_SETTINGDATA, responseData)
      }).catch((error) => {
        console.log(error)
      })
    } else if (!options.suite) {
      if (options.type === 1) {
        state.suites = []
        axios.get(rootState.configApi.loadTestSuite, {
          params: {
            project: options.project
          },
          withCredentials: true
        }).then((response) => {
          let responseData = response.data
          commit(types.GET_SUITE, responseData)
        }).catch((error) => {
          console.log(error)
        })
      }
      if (options.type === 2) {
        state.settingdatas = []
        axios.get(rootState.configApi.loadTestSuite, {
          params: {
            project: options.project
          },
          withCredentials: true
        }).then((response) => {
          let responseData = response.data
          commit(types.GET_SETTINGDATA, responseData)
        }).catch((error) => {
          console.log(error)
        })
      }
    } else {
      state.settingdatas = []
      axios.get(rootState.configApi.loadTestSuite, {
        params: {
          project: options.project,
          suite: options.suite
        },
        withCredentials: true
      }).then((response) => {
        let responseData = response.data
        commit(types.GET_SETTINGDATA, responseData)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  getDetailsSuites ({commit, state, rootState}, options) {
    state.detailSuites = {}
    if (!options.suitename) {
      axios.get(rootState.configApi.loadTestCase, {
        params: {
          project: options.projectname
        },
        withCredentials: true
      }).then((response) => {
        let responseData = response.data
        commit(types.GET_DETAILSUITES, responseData)
      }).catch((error) => {
        console.log(error)
      })
    } else {
      axios.get(rootState.configApi.loadTestCase, {
        params: {
          project: options.projectname,
          suite: options.suitename
        },
        withCredentials: true
      }).then((response) => {
        let responseData = response.data
        commit(types.GET_DETAILSUITES, responseData)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  postDetailsSuites ({commit, state, rootState}, options) {
    state.detailSuites = {}
    axios.post(rootState.configApi.loadTestCase, {
      project: options.projectname,
      module: options.module,
      subModule: options.submodule
    }, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data
      commit(types.GET_DETAILSUITES, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getAllSuites ({commit, state, rootState}, projectName) {
    state.allSuite = []
    axios.get(rootState.configApi.loadSuiteCase, {
      params: {
        project: projectName
      },
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.result
      commit(types.GET_ALLSUITES, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_SETTINGDATA] (state, responseData) {
    state.settingdatas = responseData
  },
  [types.GET_SUITE] (state, responseData) {
    state.suites = responseData.result
  },
  [types.GET_DETAILSUITES] (state, responseData) {
    state.detailSuites = responseData.result
  },
  [types.GET_ALLSUITES] (state, responseData) {
    state.allSuite = responseData
  },
  emptySuites (state) {
    state.suites = []
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
