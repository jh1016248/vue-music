const state = {
    user: '',
    skin: localStorage.skin || "#195db1",
    tabInd: 0,
    showMiniBox: false,
    isShowBigBox: false,
    isShowASide: false,
    searchPlaying: false,
    searchPlayInd: -1,
    searchRequest: [],
    artList: [],
    oneInd: 0,
    sheetList: [],
    isLoading: false,
    addToList: false,
};

const getters = {
    user: states => states.user,
    skin: states => states.skin,
    tabInd: states => states.tabInd,
    showMiniBox: states => states.showMiniBox,
    isShowBigBox: states => states.isShowBigBox,
    isShowASide: states => states.isShowASide,
    searchPlaying: states => states.searchPlaying,
    searchPlayInd: states => states.searchPlayInd,
    searchRequest: states => states.searchRequest,
    artList: states => states.artList,
    oneInd: states => states.oneInd,
    sheetList: states => states.sheetList,
    isLoading: state => state.isLoading,
    addToList: state => state.addToList,
};

const actions = {

};

const mutations = {
    setState: function (state, data) {
        for(var i in data){
            state[i] = data[i]
        }
    },
    showAside: function(state, flag) {
        state.isShowASide = flag;
    },
    changeTab: function(state, ind) {
        state.tabInd = ind;
    },
    changeSkin: function(state, color) {
        state.skin = color;
        localStorage.skin = color;
    },
    setUserInfo: function(state, user) {
        state.user = user;
    },
    loginOut: function(state) {
        state.user = '';
    },
    pushSearchRequest: function(state, list) {
        state.searchRequest = list;
    },
    showMiniBox: function(state, flag) {
        state.showMiniBox = flag;
    },
    showBigBox: function(state, flag) {
        state.isShowBigBox = flag;
    },
};

export default {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
}