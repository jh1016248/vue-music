import unit from '../../common/js/unit'
import Vue from 'vue'
const state = {
    nowMusic: '',
    duration: 0,
    isPlay: false,
    musicData: [],
};

const getters = {
    nowMusic: state => state.nowMusic,
    duration: state => state.duration,
    isPlay: state => state.isPlay,
    musicData: state => state.musicData,
};

const mutations = {
    delete (state, ind) {
        if (state.musicData[ind].name == state.nowMusic.name) { //删除当前歌曲
            if (ind == state.musicData.length - 1) { //而且还是最后一个
                state.nowMusic = state.musicData[ind - 1];
                Vue.nextTick(function() {
                    unit.play();
                })
            } else {
                state.nowMusic = state.musicData[ind + 1];
                Vue.nextTick(function() {
                    unit.play();
                })
            }
        }
        state.musicData.splice(ind, 1);
        localStorage.musicData = JSON.stringify(state.musicData)
    },
    findFromId (state, id) {
        var ind = 0;
        for(var i = 0; i<state.musicData.length; i++){
            if(state.musicData[i].musicId == id){
                ind = i;
            }
        }
        return ind;
    },
    play (state, music) {
        state.nowMusic = music;
        state.isPlay = true;
        Vue.nextTick(() => {
            unit.play();
        })
    },
    stop (state) {
        state.isPlay = false;
        Vue.nextTick(function() {
            unit.pause();
        })
    },
    setNormalMusic (state) {
        state.nowMusic = state.musicData[0];
    },
    
};

const actions = {
    playMusic (context, music) {
        var state = context.state;
        var nowMusic = state.nowMusic;
        if(music){
            if(state.isPlay && music.id == nowMusic.id){
                context.commit("stop")
            }
            else{
                if(music.url != ''){
                    context.commit("play", music)
                }
                else{
                    unit.getSong(music.id, function (data){
                        music.url = data.data[0].url;
                        context.commit("play", music)
                    })
                }
            }
        }
    },
    setMusicData (context, list) {
        var state = context.state;
        state.musicData = list;
        Vue.nextTick(function (){
            context.commit("setNormalMusic", list[0]);
        })
    },
    addMusic (context, music) {
        var state = context.state;
        var hasMusic = false;
        if (state.musicData.length) {
            for (var i = 0; i < state.musicData.length; i++) {
                if (music.id == state.musicData[i].id) {
                    hasMusic = true;
                }
            }
            if (!hasMusic) {
                unit.getSong(music.id, function (data){
                    music.url = data.data[0].url;
                    state.musicData.push(music);
                    localStorage.musicData = JSON.stringify(state.musicData);
                    context.commit("play", music)
                })
            }
            else{
                unit.getSong(music.id, function (data){
                    music.url = data.data[0].url;
                    context.commit("play", music)
                })
            }
        }
        else{
            unit.getSong(music.id, function (data){
                music.url = data.data[0].url;
                state.musicData.push(music);
                localStorage.musicData = JSON.stringify(state.musicData);
                context.commit("play", music)
            })
        }
        context.commit("setState", {addToList: true})
        setTimeout(() => {
            context.commit("setState", {addToList: false})
        }, 1000)
    },
    switchMusic (context, flag) {
        var state = context.state;
        let ind = 0,
            music = '',
            leng = state.musicData.length,
            musicData = state.musicData;

        for (let i = 0; i < leng; i++) {
            if (state.nowMusic.id == musicData[i].id) {
                ind = i;
            }
        }
        if (flag == 'prev') {
            music = ind == 0 ? musicData[leng - 1] : musicData[ind - 1]; 
        } 
        else {
            music = ind == leng - 1 ? musicData[0] : musicData[ind + 1];
        }

        unit.getSong(music.id, function (data){
            music.url = data.data[0].url;
            context.commit("play", music)
        })
    },
};

export default {
    state: state,
    getters: getters,
    actions: actions,
    mutations: mutations,
}