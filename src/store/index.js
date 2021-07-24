import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import products from './products'
import clients from './clients'
import providers from './providers'
import sales from './sales'
import buys from './buys'
import vehicles from './vehicles'
import teams from './teams'
import notifications from './notifications'

Vue.use(Vuex)
const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state:{
      role : '',
      user_id:null,
      loading:false
    },
    getters: {
      can : (state) => (roles) => {
        return roles.some(role => role == state.role)
      }
    },
    actions:{
      setRole({commit}){
        commit('setRole')
      },
      startLoading({commit}){
        commit('startLoading')
      },
      stopLoading({commit}){
        commit('stopLoading')
      }
    },
    mutations:{
      startLoading(state){
        state.loading = true
      },
      stopLoading(state){
        state.loading = false
      },
      setRole(state){
        state.role = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).role : ''
        state.user = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : null
      }
    },
    modules: {
      products,
      clients,
      providers,
      sales,
      buys,
      vehicles,
      teams,
      notifications
    },
    plugins: [vuexLocal.plugin],
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
