import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import unit from './common/js/unit'
import fastclick from 'fastclick'
import store from './vuex/index'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        fastclick.attach(document.body);
    }, false);
}

Vue.config.productionTip = false

/* eslint-disable no-new */
var vm = new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
