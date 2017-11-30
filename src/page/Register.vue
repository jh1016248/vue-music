<template>
  <transition name="showFromTop">
    <div id="register">
      <div class="norm-header" >
        <router-link to="/index" class="btn back" ><返回</router-link>
      </div>
      <div class="loginwrap">
        <h3>注册</h3>
        <div class="formgroup">
          <input v-model="userName" placeholder="账号"/>
          <p v-if="userErr.length != 0" v-text="userErr"></p>
        </div>
        <div class="formgroup">
          <input v-model="password" type="password" placeholder="密码"/>
          <p v-if="passwordErr.length != 0" v-text="passwordErr"></p>
          <p class="text-r"><router-link to="/login">登录></router-link></p>
        </div>
        <a class="btn" @click="toRegister()">注册</a>
      </div>
    </div>
  </transition>  
</template>

<script>
import unit from '../common/js/unit';
import axios from 'axios';
import router from '../router'
export default {
  name: 'Register',
  data () {
    return {
      userName: '',
      password: '',
      userErr: '',
      passwordErr: '',
    }
  },
  computed: {
    skin() {
      return this.$store.state.skin;
    },
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
    toRegister() {
      var that = this;
      that.checkInfo(function (){
        axios.post("/register",{"userName": that.userName, "password": that.password}).then(function (req){
          if(req.data.ret == 1){
            alert("注册成功")
            unit.login(that.userName, that.userName, that.pic)
            that.$store.commit("setUserInfo", {"userName": that.userName, "nickName": that.userName, "pic": that.pic});
            router.push("index")
          }
          else{
            alert("该账号已被注册");
          }
        })
      });
      
    },
  },
  mounted: function (){
    unit.changeTitle("注册");
    this.$store.commit("showAside",false);
    this.$store.commit("showMiniBox", false);
  }
}
</script>

<style lang="less" scoped>
  #register{
    background: #fff;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
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
