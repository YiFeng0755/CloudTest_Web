import Vue from 'vue'
import Vuex from 'vuex'
import ProjectList from './modules/project-list'
import ModelList from './modules/model-list'
import Report from './modules/report'
import RecommendedModels from './modules/recommended-models'
import OptionalsModels from './modules/option-models'
import HistoricalUpload from './modules/historical-upload'
import SuccessTest from './modules/success-test'
import DetailReport from './modules/detail-report'
import TerminalReport from './modules/terminal-report'
import UiActivityReport from './modules/ui-activity-report'
import Setting from './modules/setting'
import UiAutoReport from './modules/ui-auto-report'
import ChooseDebugs from './modules/choose-debug'
import * as getters from './getters'
import * as actions from './actions'

Vue.use(Vuex)

const state = {
  ERR_OK: 0,
  configApi: {
    stfRouter: 'http://stf-test.oa.com/#!/devices',
    stfLogin: 'http://stf-test.oa.com/auth/mock/',
    ssoLogin: 'http://sso.oa.com/Index/login/appid/1458',
    loadProject: 'http://stf-test.oa.com/app/api/v1/loadProject',
    selectTaskList: 'http://stf-test.oa.com/app/api/v2/selectTaskList',
    loadRecommendDevices: 'http://stf-test.oa.com/app/api/v1/loadRecommendDevices/',
    apkinfo: 'http://stf-test.oa.com/app/api/v2/apkinfo',
    loadProjectInfo: 'http://stf-test.oa.com/app/api/v2/loadProjectInfo',
    loadProjectName: 'http://stf-test.oa.com/app/api/v2/loadProjectName',
    loadPhoneModels: 'http://stf-test.oa.com/app/api/v2/loadPhoneModels',
    searchPhoneSerial: 'http://stf-test.oa.com/app/api/v2/searchPhoneSerial',
    monkeytest: 'http://stf-test.oa.com/app/api/v2/monkeytest',
    upload: 'http://stf-test.oa.com/s/upload/apk',
    notifiedusers: 'http://stf-test.oa.com/app/api/v1/notifiedusers',
    loadTaskdetail: 'http://stf-test.oa.com/app/api/v1/loadTaskdetail/',
    loadtaskerrorinfo: 'http://stf-test.oa.com/app/api/v1/loadtaskerrorinfo/',
    filterTaskDevdetail: 'http://stf-test.oa.com/app/api/v2/filterTaskDevdetail',
    activityCompatibility: 'http://stf-test.oa.com/app/api/v2/activityCompatibility',
    loadTaskDevOptions: 'http://stf-test.oa.com/app/api/v2/loadTaskDevOptions/',
    download: 'http://stf-test.oa.com/app/api/v1/download/',
    devices: 'http://stf-test.oa.com/app/api/v1/devices/',
    loadDeviceLog: 'http://stf-test.oa.com/app/api/v1/loadDeviceLog/',
    screen: 'http://stf-test.oa.com/app/api/v2/Screencap/',
    loadActivityDetail: 'http://stf-test.oa.com/app/api/v1/loadTaskdetail/',
    loadActivityTaskDetail: 'http://stf-test.oa.com/app/api/v1/loadActivityTaskDetail/',
    stfScreen: 'http://stf-test.oa.com/app/api/v2/Screencap/',
    stfReportLogo: 'http://stf-test.oa.com/app/api/v1/downloadappicon/',
    filterTaskActivitydetail: 'http://stf-test.oa.com/app/api/v2/filterTaskActivitydetail',
    loadTaskActivityOptions: 'http://stf-test.oa.com/app/api/v2/loadTaskActivityOptions/',
    loadTestSuite: 'http://stf-test.oa.com/app/api/v2/loadTestSuite',
    loadTestCase: 'http://stf-test.oa.com/app/api/v2/loadTestCase',
    uiTest: 'http://stf-test.oa.com/app/api/v1/loadTaskdetail/',
    filterUI: 'http://stf-test.oa.com/app/api/v2/filterUI',
    loadSuiteCase: 'http://stf-test.oa.com/app/api/v2/loadSuiteCase',
    uiTestSend: 'http://stf-test.oa.com/app/api/v2/uiTest'
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  modules: {
    ProjectList,
    ModelList,
    Report,
    RecommendedModels,
    HistoricalUpload,
    OptionalsModels,
    SuccessTest,
    DetailReport,
    TerminalReport,
    UiActivityReport,
    Setting,
    UiAutoReport,
    ChooseDebugs
  }
})
