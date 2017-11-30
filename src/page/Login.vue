<template>
  <transition name="showFromTop">
    <div id="login">
      <div class="norm-header">
        <router-link to="/index" class="btn back" ><返回</router-link>
      </div>
      <div class="loginwrap">
        <h3>登录</h3>
        <div class="formgroup">
          <input v-model="userName" placeholder="账号">
          <p v-if="userErr.length != 0" v-text="userErr"></p>
        </div>
        <div class="formgroup">
          <input v-model="password" type="password" placeholder="密码">
          <p v-if="passwordErr.length != 0" v-text="passwordErr"></p>
          <p class="text-r"><router-link to="/register">注册></router-link></p>
        </div>
        <a class="btn" @click="toLogin()">登录</a>
      </div>
    </div>
  </transition>  
</template>

<script>
import unit from '../common/js/unit';
import axios from 'axios';
import router from '../router'
export default {
  name: 'Login',
  data () {
    return {
      userName: '',
      password: '',
      userErr: '',
      passwordErr: '',
    }
  },
  computed: {
  },
  methods: {
    checkInfo(callback) {
      var that = this;
      this.userErr = '';
      this.passwordErr = '';
      if(that.userName == ''){
        that.userErr = "用户名不能为空";
      }
      else{
        if(that.password == ''){
          that.passwordErr = '密码不能为空';
        }
        else{
          callback();
        }
      }
    },
    toLogin() {
      var that = this;
      that.checkInfo(function (){
        axios.post("/login",{"userName": that.userName, "password": that.password}).then(function (req){
          var data = req.data;
          if(data.ret == 1){
            unit.login(data.userName, data.nickName, data.pic);
            that.$store.commit("setUserInfo", {"userName": data.userName, "nickName": data.nickName, "pic": data.pic});
            router.push("index")
          }
          else{
            alert("用户名或密码错误！");
          }
        })
      });
      
    },
  },
  mounted: function (){
    unit.changeTitle("登录");
    this.$store.commit("showAside",false);
    this.$store.commit("showMiniBox", false);
  }
}
</script>

<style lang="less" scoped>
  #login{
    background: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  .showFromTop-enter-active {
    transition: all .3s ease;
  }
  .showFromTop-leave-active {
    transition: all .3s ease-out;
  }
  .showFromTop-enter, .showFromTop-leave-active {
    transform: translateX(-100%);
  }
</style>
