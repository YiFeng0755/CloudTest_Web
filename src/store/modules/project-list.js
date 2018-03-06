import * as types from '../mutations-types'
import axios from 'axios'

const state = {
  projectlists: [],
  projectmutiples: []
}

const getters = {
  projectlists: state => state.projectlists,
  projectmutiples: state => state.projectmutiples
}

const actions = {
  getProjectList ({commit, state, rootState}) {
    state.projectlists = []
    axios.get(rootState.configApi.loadProjectInfo, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.result
      commit(types.GET_PROJECTLIST, responseData)
    }).catch((error) => {
      console.log(error)
    })
  },
  getProjectMutiples ({commit, state, rootState}) {
    state.projectmutiples = []
    axios.get(rootState.configApi.loadProjectName, {
      withCredentials: true
    }).then((response) => {
      let responseData = response.data.projectNames
      commit(types.GET_PROJECTMUTIPLES, responseData)
    }).catch((error) => {
      console.log(error)
    })
  }
}

const mutations = {
  [types.GET_PROJECTLIST] (state, responseData) {
    state.projectlists = responseData
  },
  [types.GET_PROJECTMUTIPLES] (state, responseData) {
    state.projectmutiples = responseData
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
