import Vue from 'vue'
import Vuex from 'vuex'
import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)

export default new Vuex.Store({
  plugins:  process.env.NODE_ENV !== 'production'? [createLogger()] : [],
  state,
  mutations,
  actions,
  getters
})
