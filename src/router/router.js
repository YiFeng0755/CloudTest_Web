import Vue from 'vue'
import VueRouter from 'vue-router'
import Test from '../components/Test/Test'
import Report from '../components/Report/Report'
import Setting from '../components/Setting/Setting'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/test',
      component: Test,
      children: [
        {
          path: 'compatible',
          component: resolve => require(['../components/Test/Compatible.vue'], resolve)
        },
        {
          path: 'ui-automated',
          component: resolve => require(['../components/Test/UIAutomatedTesting.vue'], resolve)
        },
        {
          path: 'choose',
          component: resolve => require(['../components/Test/ChooseDebug.vue'], resolve)
        },
        {
          path: 'ui-activity',
          component: resolve => require(['../components/Test/UIActivityCompatibilityTesting.vue'], resolve)
        },
        {
          path: 'sendemail',
          component: resolve => require(['../components/Test/SendEmail.vue'], resolve)
        }
      ]
    },
    {
      path: '/report',
      component: Report,
      children: [
        {
          path: ':type/detail/:fileid/:taskid',
          component: resolve => require(['../components/Report/DetailReport.vue'], resolve),
          children: [
            {
              path: '',
              component: resolve => require(['../components/Report/TestReport.vue'], resolve)
            },
            {
              path: 'terminal',
              component: resolve => require(['../components/Report/TerminalReport.vue'], resolve),
              children: [
                {
                  path: ':serial',
                  component: resolve => require(['../components/Report/TerminalModel.vue'], resolve)
                }
              ]
            }
          ]
        },
        {
          path: 'uiTest/:taskid',
          component: resolve => require(['../components/Report/UiAutoReport.vue'], resolve)
        },
        {
          path: 'ui-activity/:taskid',
          component: resolve => require(['../components/Report/UiActivityReport.vue'], resolve)
        }
      ]
    },
    {
      path: '/setting',
      component: Setting,
      children: [
        {
          path: 'detail/:projectname/:module/:submodule',
          component: resolve => require(['../components/Setting/SettingDetail.vue'], resolve)
        }
      ]
    },
    {
      path: '*',
      redirect: '/test'
    }
  ],
  linkActiveClass: 'active',
  mode: 'history'
})

export default router
