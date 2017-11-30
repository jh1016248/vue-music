<template>
  <transition name="trans-fade">
    <div id="listen-box" :class="isPlay ? 'active' : ''" :style="{backgroundColor: skin}">
      <img :src="nowMusic.picUrl">
      <div class="info">
        <p>{{ nowMusic.name }}</p>
        <div class="time">
          <span>{{ getTimes(currentTime) }}</span>
          <div class="time-bar-wrap" @click="changeSchedule($event)">
            <div class="time-bar" :style="{width: currentInfo}"></div>
          </div>
          <span>{{ getTimes(duration) }}</span>
        </div>
      </div>
      <span @click="isPlay ? pause() : play()"></span>
    </div>
  </transition>
</template>

<script>
import unit from '../common/js/unit'
import $ from 'jquery'
export default {
  name: 'listen-box',
  data () {
    return {
      duration: 0,
      timer: null,
      currentTime: 0,
    }
  },
  computed: {
    skin() {
      return this.$store.state.skin;
    },
    isPlay() {
      return this.$store.state.isPlay;
    },
    nowMusic() {
      return this.$store.state.nowMusic;
    },
    currentInfo() {
      return parseInt(this.currentTime / this.duration * 100) + "%";
    },

  },
  methods: {
    play() {
      this.$store.commit("play",'now');
    },
    pause() {
      clearInterval(this.timer);
      this.$store.commit("stop");
    },
    getTimes(time) {
      var times = parseInt(time); 
      if(times>=60){
        var t1 = parseInt(times/60);
        var t2 = times%60;
        if(t2<10){
          t2 = '0'+t2;
        }
        return t1 + ':' + t2
      }
      else{
        if(times<10){
          return '0:0'+times;
        }
        return '0:'+times;
      }
    },
    changeSchedule(event) {
      var n = (event.offsetX / $(event.target).width()) * this.duration;
      document.querySelector("#audio").currentTime = n;
    },
    
  },
  mounted: function (){
    var that = this;
    var _audio = document.querySelector("#audio");
    _audio.addEventListener("play",function (){
        _audio.oncanplay = function (){
          that.duration = _audio.duration;
          that.timer = setInterval(function (){
            that.currentTime = parseInt(_audio.currentTime);
            if(_audio.ended){
              that.$store.commit("next");
            }
          },1000)
        }
    })
  }
}
</script>

<style lang="less" scoped>
  #listen-box{
    z-index: 2;
    position: fixed;
    display: flex;
    width: 6.4rem;
    height: 1.2rem;
    bottom: 0;
    box-sizing: border-box;
    padding: .1rem;
    align-items: center;
    img{
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
    .info{
      flex: 1;
      color: #fff;
      p{
        text-align: center;
        font-size: .24rem;
        margin-bottom: .2rem;
      }
      .time{
        height: .3rem;
        line-height: .3rem;
        display: flex;
        padding: 0 .5rem;
        span{ 
        }
        .time-bar-wrap{
          position: relative;
          min-width: 70%;
          height: .08rem;
          background: #ccc;
          margin: .08rem .2rem;
          flex: 1;
          .time-bar{
            position: absolute;
            left: 0;
            height: 100%;
            background: #5dc78a;
            &:before{
              content: ' ';
              position: absolute;
              display: block;
              width: .14rem;
              height: .14rem;
              background: #fff;
              border-radius: 50%;
              right: 0;
              top: -.03rem;
            }
          }
        }
      }
    }
    >span{
      display: block;
      width: .48rem;
      height: .48rem;
      background: url(../assets/icon-start.png) no-repeat;
      background-size: 100%;
      margin-right: .2rem;
      transition: all .2s;
      &:active{
        transform: scale(.9)
      }
    }
    &.active{
      img{
        animation: rotate 10s infinite linear;
      }
      >span{
        background-image: url(../assets/icon-stop.png);
      }
    }
  }
  .trans-fade-enter-active,.trans-fade-leave{
    transition: all .3s;
    transform: translateY(0);
  }
  .trans-fade-enter,.trans-fade-leave-active{
    transition: all .3s;
    transform: translateY(100%);
  }

  @keyframes rotate{
    0{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
