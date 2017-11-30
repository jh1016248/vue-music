import common from './module/common'
import music from './module/music'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        common,
        music
    }
})
