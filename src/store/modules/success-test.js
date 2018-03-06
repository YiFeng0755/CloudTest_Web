const state = {
  taskid: '',
  fileid: ''
}

const getters = {
  taskid: state => state.taskid,
  fileid: state => state.fileid
}

const actions = {
}

const mutations = {
  newTaskid (state, taskid) {
    state.taskid = taskid
  },
  newFileid (state, fileid) {
    state.fileid = fileid
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
