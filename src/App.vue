<template>
  <div>
    <v-header :name="name"></v-header>
    <router-view></router-view>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from './components/Header/Header'
import vFooter from './components/Footer/Footer'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      name: ''
    }
  },
  computed: mapState([
    'configApi'
  ]),
  components: {
    vHeader,
    vFooter
  },
  created () {
    axios.get(this.configApi.stfLogin, {
      withCredentials: true
    }).then((response) => {
      console.log(response)
      if (response.data.success) {
        this.name = response.data.user_name
        window.localStorage.setItem('userName', this.name)
        axios.get(response.data.redirect, {
          withCredentials: true
        }).then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log(error)
        })
      } else {
        window.location.href = this.configApi.ssoLogin
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style>
</style>
