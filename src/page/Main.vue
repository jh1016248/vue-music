<template>
  <transition name="showRouter">
    <div id="main">
      <ul>
        <li @click="playMusic(item)" :key="item" v-for="(item, index) in musicData">
          <div class="musicitem" @touchstart="tstart($event)" @touchmove="tmove($event)" @touchend="tend($event, index, item)" :class="index == toggle ? 'active':''">
            <div class="info">
              <img :src="item.picUrl + '?param=140y140'">
              <span>{{ index+1 }}、</span>
              <div>{{ item.name }}</div>
            </div>
            <div class="menu">
              <span @click.stop="deleteMusic(index)">删除</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import unit from '../common/js/unit'
export default {
  name: 'Main',
  data () {
    return {
      startX: 0,
      startY: 0,
      end: 0,
      type: 0,  // h s
    	toggle: -1,
    }
  },
  computed: {
    musicData() {
      return this.$store.getters.musicData;
    },
    isPlay() {
      return this.$store.getters.isPlay;
    }
  },
  methods: {
    tstart(e) {
      this.type = 0;
      this.toggle = -1;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    tmove(e) {
      this.end = e.touches[0].clientX;
      if(this.type != 0){
        if(this.type == "h"){
          e.preventDefault();
        }
      }
      else{
        if( Math.abs(this.startX - this.end) >= 20){
          this.type = "h";
        }
        if(Math.abs(this.startY - e.touches[0].clientY) >= 10){
          this.type = "s";
        }
      }
    },
    tend(e, index, item) {
      if(this.type == 'h'){
        if(this.startX - this.end > 20){
          this.toggle = index;
        }
        else if(this.startX - this.end < -20){
          this.toggle = -1;
        }
        e.preventDefault();
      }
      else if(this.type!="s"){
        this.$store.dispatch("playMusic", item);
      }
    },
    deleteMusic(ind) {
      this.toggle = -1;
      this.$store.commit("delete",ind);
    },
    playMusic(item) {
      if(this.toggle!=-1){
        this.$store.dispatch("playMusic", item);
      }
      else{
        this.toggle = -1;
      }
    }
  },
  mounted: function (){
    unit.changeTitle("我的音乐")
    this.$store.commit("showMiniBox", true);
    this.$store.commit("changeTab",0);
  }
}
</script>

<style lang="less" scoped>
  #main{ 
    display: flex;
    height: 100%;
    width: 6.4rem;
    padding-top: 1.4rem;
    padding-bottom: 1.2rem;
    ul{
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      li{
        width: 100%;
        overflow: hidden;
        height: .85rem;
        border-bottom: .015rem solid #e5e5e5;
        font-size: .24rem;
        color: #333;
        .musicitem{
          width: 100%;
          transition: all .3s;
          position: relative;
          .info{
            width: 100%;
            height: .85rem;
            display: flex;
            align-items: center;
            img{
              width: .6rem;
              height: .6rem;
              border-radius: .04rem;
              vertical-align: middle;
              margin-right: .2rem;
              margin-left: .2rem;
            }
            span{
              width: .5rem;
            }
            div{
              flex: 1;
            }
          }
          .menu{
            position: absolute;
            width: 1.6rem;
            right: -1.6rem;
            height: 100%;
            top: 0;
            font-size: 0;
            span{
              display: inline-block;
              width: 50%;
              height: .85rem;
              font-size: .22rem;
              line-height: .85rem;
              background: #ccc;
              text-align: center;
              &:last-child{
                background: red;
                color: #fff;
              }
            }
          }
          &.active{
            transform: translateX(-.8rem);
          }
        }
      }
    }
  }
  .showRouter-enter-active {
    transition: all .3s ease;
  }
  .showRouter-leave-active {
    transition: all 0 ease-out;
  }
  .showRouter-enter, .showRouter-leave-active {
    transform: translateX(-4rem);
    opacity: 0;
  }
</style>
