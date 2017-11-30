<template>
  <transition name="sideIn">
    <div class="aside-menu">
      <div class="aside-wrap">
        <div class="info text-c" :style="{ backgroundColor: skin }">
          <template v-if="user.userName">
            <router-link to="/changeUserInfo"><img :src="userPic(user.pic)"></router-link>
            <p>{{userNickName(user.userName, user.nickName)}}</p>
          </template>
          <template v-else>
            {{user.nickName}}
            <router-link to="/login" class="center"><img src="../assets/norm-head.png"></router-link>
            <p>请登录...</p>
          </template>
        </div>
        <div class="func">
          <!--<a>我的消息</a>-->
          <router-link to="/changeuserinfo" class="center">会员中心</router-link>
          <a @click="changeSkin">个性换肤</a>
        </div>
        <div class="func">
          <a href="">推荐歌单</a>
          <a href="">我的歌单</a>
        </div>
        <div class="func" v-if="user.userName">
          <a @click="loginOut">退出登录</a>
        </div>
      </div>
      <i class="side-close"></i>
      <div class="mark" @click.stop.prevent="showASide()"></div>
    </div>
  </transition>
</template>

<script>
import unit from "../common/js/unit"
import axios from "axios"
import router from "../router"
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'skin',
      'user'
    ]),
  },
  methods: {
    showASide() {
      this.$store.commit("showAside",false);
    },
    changeSkin (){
      this.$store.commit("showBigBox", true)
      this.$store.commit("showAside", false)
    },
    userPic(pic){
      if(pic == "" || pic == undefined){
        return '/static/norm-head.png'
      }
      else{
        return pic;
      }
    },
    userNickName(userName,nickName){
      if(nickName == "" || nickName == undefined){
        return userName
      }
      else{
        return nickName;
      }
    },
    loginOut() {
      var that = this;
      var time = new Date().getTime();
      axios.get("/loginout?v="+time).then(function (res){
        if(res.data.ret == 1){
          that.$store.commit("loginOut");
          unit.loginOut(function (){
            router.push("login")
          });
        } 
      })
    }
  },
  mounted: function (){
  }
}
</script>

<style lang="less" scoped>
  .aside-menu{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    font-size: 0;
    z-index: 3;
    .aside-wrap{
      vertical-align: top;
      display: inline-block;
      width: 3.4rem;
      background: #f5f5f5;
      box-shadow: 0 0 .08rem .05rem rgba(0,0,0,.4);
      .info{
        padding: .2rem;
        color: #fff;
        .btn-login{
          background: #333;
          font-size: .26rem;
          display: block;
          color: #fff;
          margin: 0 auto;
        }
        img{
          width: 1.3rem;
          height: 1.3rem;
          border-radius: 50%;
          margin-bottom: .1rem;
        }
        p{
          font-size: .24rem;
        }
      }
      .func{
        background: #fff;
        margin-bottom: .1rem;
        padding: .1rem;
        a{
          display: block;
          height: .6rem;
          font-size: .24rem;
          line-height: .6rem;
          padding-left: .2rem;
          color: #333;
          border-bottom: .015rem solid #e3e3e3;
          &:last-child{
            border-bottom: none;
          }
        }
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
    .mark{
      display: inline-block;
      width: 2.6rem;
      height: 100%;
    }
  }
  .sideIn-enter-active,.sideIn-leave-active{
    transition: all .3s;
  }
  .sideIn-enter, .sideIn-leave-active {
    transform: translateX(-2.5rem);
    opacity: 0;
  }
</style>
