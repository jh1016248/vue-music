<template>
  <transition name="trans-fade">
    <div id="listen-box" :class="listenBox" @click="showBigBox(true)" :style="{backgroundColor: skin}">
      <div class="minibox">
        <div class="header">
          <a class="back" @click.stop="showBigBox(false)"></a>
        </div>
        <img :src="nowMusic.picUrl">
        <div class="info">
          <p>{{ nowMusic.name }}</p>
          <div class="time">
            <span>{{ getTimes(currentTime) }}</span>
            <div class="time-bar-wrap" @click.stop="changeSchedule($event)">
              <div class="time-bar" :style="{width: currentInfo}"></div>
            </div>
            <span>{{ getTimes(duration) }}</span>
          </div>
        </div>
        <span @click.stop="isPlay ? pause() : play()"></span>
        <div class="function-bar">
          <a class="prev" @click.stop="switchMusic('prev')"></a>
          <a class="state" @click.stop="isPlay ? pause() : play()"></a>
          <a class="next" @click.stop="switchMusic('next')"></a>
        </div>
        <div class="skinBox">
          <a :class="skinClass" @click="showSelect()"></a>
          <div class="skinwrap" :class="isShowSelect?'active':''">
            <span v-for="(item,index) in skinItems" :key='item' @click="changeSkin(index)"></span>
          </div>
        </div>
      </div>
      <div class="bigbox">
        <div class="bg" :style="{backgroundImage: 'url('+ nowMusic.picUrl +')'}"></div>
        <div class="rotateImg" :class="{active: isPlay}" v-show="isShowBigBox" :style="{backgroundImage: 'url('+ nowMusic.picUrl +')'}"></div>
      </div>
      <audio :src="nowMusic.url" id="audio"></audio>
    </div>
  </transition>
</template>

<script>
import unit from '../common/js/unit'
import $ from 'jquery'
import { mapGetters } from 'vuex'

export default {
  name: 'listen-box',
  data () {
    return {
      duration: 0,
      timer: null,
      currentTime: 0,
      isShowSelect: false,
      skinItems: {
        '195db1': 'blue',
        'd81e02': 'red',
        '000000': 'black',
        '1b5e20': 'green',
      }
    }
  },
  watch: {
    nowMusic() {
      console.log(this.nowMusic)
    }
  },
  computed: {
    ...mapGetters([
      'skin',
      'isPlay',
      'isShowBigBox',
      'nowMusic',
    ]),
    skinClass(){
      var a = this.skin.split("#")[1];
      return this.skinItems[a];
    },
    currentInfo() {
      return parseInt(this.currentTime / this.duration * 100) + "%";
    },
    listenBox() {
      var str = '';
      if(this.isPlay){
        str = 'active ';
      }
      if(this.isShowBigBox){
        str += "big-box";
      }
      return str;
    }
  },
  methods: {
    play() {
      this.$store.dispatch("playMusic", this.nowMusic);
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
    showBigBox(flag) {
      this.$store.commit("showBigBox",flag);      
    },
    switchMusic(flag) {
      this.$store.dispatch("switchMusic",flag)
    },
    showSelect() {
      this.isShowSelect = !this.isShowSelect;
    },
    changeSkin(color) {
      this.$store.commit("changeSkin","#"+color);
    }
  },
  mounted: function (){
    var that = this;
    var _audio = document.querySelector("#audio");
    _audio.addEventListener("play",function (){
      that.currentTime = parseInt(_audio.currentTime);
      // _audio.oncanplaythrough = function (){

      // }
      that.timer = setInterval(function (){
        that.duration = _audio.duration;
        that.currentTime = parseInt(_audio.currentTime);
        if(_audio.ended){
          that.$store.dispatch("switchMusic","next");
        }
      },1000)
    })
  }
}
</script>

<style lang="less" >
  #listen-box{
    z-index: 2;
    position: fixed;
    width: 6.4rem;
    height: 1.2rem;
    bottom: 0;
    box-sizing: border-box;
    padding: .1rem;
    transition: all .3s;
    .minibox{
      position: relative;
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      align-items: center;
      img{
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        transition: all .3s;
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
            text-shadow: .02rem .02rem .04rem rgba(0,0,0,.6);
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
                right: -.07rem;
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
      .header{
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: none;
        height: .9rem;
        .back{
          position: absolute;
          display: block;
          z-index: 2;
          left: .1rem;
          top: .235rem;
          width: .12rem;
          height: .23rem;
          padding: .1rem;
          background: url(../assets/icon-back.png) center center no-repeat;
          background-size: .12rem .23rem;
        }
      }
      .function-bar{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.2rem;
        box-sizing: border-box;
        padding-top: .42rem;
        text-align: center;
        transform: translateY(100%);
        transition: all .3s;
        a{
          display: inline-block;
          width: .35rem;
          height: .35rem;
          background-size: 100%;
          margin: 0 .2rem;
          &.prev{
            background-image: url(../assets/icon-prev.png);
          }
          &.state{
            background-image: url(../assets/icon-start1.png);
          }
          &.next{
            background-image: url(../assets/icon-next.png);
          }
        }
      }
      .skinBox{
        display: none;
        position: absolute;
        bottom: 2.4rem;
        right: .3rem;
        >a{
          display: block;
          width: .54rem;
          height: .54rem;
          &.blue{
            background: url(../assets/195db1.png);
            background-size: 100%;
          }
          &.red{
            background: url(../assets/d81e02.png);
            background-size: 100%;
          }
          &.black{
            background: url(../assets/000000.png);
            background-size: 100%;
          }
          &.green{
            background: url(../assets/1b5e20.png);
            background-size: 100%;
          }
        }
        .skinwrap{
          position: absolute;
          top: -1.9rem;
          right: .06rem;
          visibility: hidden;
          span{
            display: block;
            width: .35rem;
            height: .35rem;
            border: .02rem solid #fff;
            border-radius: 50%;
            margin-bottom: .1rem;
            transition: all .2s linear;
            opacity: 0;
            transform: translateX(.12rem);
            &:nth-child(1){
              background: #195db1;
              transition-delay: 0s;
            }
            &:nth-child(2){
              background: #d81e02;
              transition-delay: .05s;
            }
            &:nth-child(3){
              background: #000000;
              transition-delay: .1s;
            }
            &:nth-child(4){
              background: #1b5e20;
              transition-delay: .15s;
            }
          }
          &.active{
            visibility: visible;
            span{
              transform: translateX(0);
              opacity: 1;
            }
          }
        }
      }
    }
    .bigbox{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      .bg{
        overflow: hidden;
        width: 100%;
        height: 100%;
        filter: blur(10px);
        transform: scale(1.4);
        background-size: cover;
        background-position: center center;
      }
      .rotateImg{
        position: absolute;
        top: 50%;
        margin-top: -2.5rem;
        left: 50%;
        margin-left: -1.725rem;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 50%;
        background-size: 100%;
        &.active{
          animation: rotate 10s linear infinite; 
        }
      }
    }
    &.active{
      .minibox{
        img{
          animation: rotate 10s infinite linear;
        }
        >span{
          background-image: url(../assets/icon-stop.png);
        }
        .function-bar{
          a.state{
            background-image: url(../assets/icon-stop2.png);
          }
        }
      }
    }
    &.big-box{
      padding: 0;
      height: 100%;
      .minibox{
        position: relative;
        z-index: 2;
        img{
          display: none;
        }
        .info{
          transition: all .3s;
          p{
            position: absolute;
            top: 0;
            left: 0;
            font-size: .28rem;
            width: 100%;
            line-height: .9rem;
            transition: all .3s;
          }
          .time{
            position: absolute;
            width: 90%;
            bottom: 1.5rem;
            padding: 0 5%;
            transition: all .3s;
            .time-bar-wrap{
              margin-top: .12rem;
              transition: all .3s;
            }
          }
        }
        >span{
          display: none;
        }
        .header{
          display: block;
        }
        .function-bar{
          transform: translateY(0);
        }
        .skinBox{
          display: block;
        }

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