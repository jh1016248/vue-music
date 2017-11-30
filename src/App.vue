<template>
  <div id="app">
    <ASideMenu v-if="isShowASide"></ASideMenu>
    <router-view></router-view>
    <ListenBox v-show="showMiniBox"></ListenBox>
    <Loading></Loading>
    <transition name="fadeIn">
      <div id="toast" v-if="addToList">
          <div class="weui-mask_transparent"></div>
          <div class="weui-toast">
              <i class="weui-icon-success weui-icon_toast"></i>
              <p class="weui-toast__content">已添加到播放列表</p>
          </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ASideMenu from './components/ASideMenu'
import ListenBox from './components/ListenBox'
import Loading from './components/Loading'
import unit from './common/js/unit'
import axios from 'axios'

export default {
  name: 'app',
  data: function (){
    return {
      user: '',
    }
  },
  components: {
    ASideMenu,
    ListenBox,
    Loading
  },
  computed: {
    isShowASide(){ 
      return this.$store.getters.isShowASide;
    },
    showMiniBox(){ 
      return this.$store.getters.showMiniBox;
    },
    addToList() {
      return this.$store.getters.addToList;
    }
  },
  methods: {
    getMusic(){
      var that = this;
      if(localStorage.musicData == "undefined" || localStorage.musicData == null || localStorage.musicData == '[]'){
        axios.get("https://api.imjad.cn/cloudmusic?type=playlist&id=906566617")
          .then(res => {
            var musicList = [];
            var list = res.data.playlist.tracks
            console.log(list);

            list.forEach(item => {
              musicList.push({
                name: item.name,
                id: item.id,
                picUrl: item.al.picUrl,
                url: ''
              })
            })

            localStorage.musicData = JSON.stringify(musicList);
            that.$store.dispatch("setMusicData", musicList)
          })
      }
      else{
        that.$store.dispatch("setMusicData", JSON.parse(localStorage.musicData))
      }
    },
  },
  mounted: function (){
    if(!localStorage.hideTip){

      alert("为了你的流量，请在wifi环境下播放音乐")
      localStorage.hideTip = true
    }
    unit.changeTitle("音乐");
    unit.adapt(640,100);
    this.getMusic();
    // var user = unit.getUserInfo();
    // user && this.$store.commit("setUserInfo", user);
  }
}
</script>

<style src="./common/css/style.less" lang="less"></style>
<style lang="less">
  body > div:not(#app){ 
    display: none; 
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .weui-mask_transparent{
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
  .weui-toast {
      position: fixed;
      z-index: 5000;
      width: 9em;
      min-height: 9em;
      top: 270px;
      left: 50%;
      margin-left: -3.8em;
      background: rgba(17,17,17,0.7);
      text-align: center;
      border-radius: 5px;
      color: #FFFFFF;
  }
  .weui-icon_toast {
      margin: 45px 0 0;
      display: block;
  }
  .weui-icon-success{
    width: .5rem;
    height: .5rem;
    background: url(./assets/success.png) no-repeat;
    margin: 35px auto 0;
    background-size: 100%;
  }
  .weui-toast__content {
      margin: 0 0 15px;
  }
  .fadeIn-enter-active , .fadeIn-leave-active {
    transition: all .3s ease;
  }
  .fadeIn-enter, .fadeIn-leave-active {
    opacity: 0;
  }

</style>