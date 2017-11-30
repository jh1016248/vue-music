<template>
  <transition name="showFromTop">
    <div id="changeuserinfo">
      <div class="norm-header">
        <router-link to="/index" class="btn back" ><返回</router-link>
        <h3>个人信息</h3>
      </div>
      <div class="group notborder">
        <div class="cell">
          <span>昵称：</span>
          <input class="text" maxlength="8" placeholder="请输入昵称" v-model="nickName">
        </div>
        <div class="cell">
          <span>头像：</span>
          <div class="img upload">
            <img :src="userPic(user.pic)" />
            <input type="file" class="file" ref="inputer" @change="fileUp($event)" accept="image/png,image/jpeg,image/jpg">
            <div class="progress" v-if="uploadProgress.fileName!= undefined"> 
              <div class="progress-bar" :style="{width: uploadProgress.progress}"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-c"><a class="btn btn-middle normal btn-center" @click="submit()">提交</a></div>
    </div>
  </transition>  
</template>

<script>
import unit from '../common/js/unit';
import axios from 'axios';
import router from '../router'
export default {
  name: 'Changeuserinfo',
  data () {
    return {
      nickName: '',
      uploadProgress: '',
    }
  },
  computed: {
    user: function (){
      return this.$store.getters.user;
    },
  },
  methods: {
    fileUp(e) {
      var file = e.target.files[0] || e.dataTransfer.files[0];
      this.onloadFile(file);
    },
    onloadFile(file) {
      var that = this;
      var fr = new FileReader();
      fr.onload = function() {
        var fileName = that.user.userName + ".jpg";
        that.uploadFile(file, fileName);
        var localSrc = window.URL.createObjectURL(file);
        this.user.pic =localSrc;
      };
      fr.readAsDataURL(file);
    },
    uploadFile(file, fileName){
      var that = this;
      var uploadUrl = "/upload";
      var xhr = new XMLHttpRequest();
      xhr.open("POST", uploadUrl, true);
      this.uploadProgress = ({
          fileName: fileName,
          progress: 0
      })
      //上传完执行
      xhr.onload = function(e) {
          //去掉进度条
          that.closeProgress(fileName);
          if(JSON.parse(e.target.responseText).ret == 1){
            var user = unit.getUserInfo();
            user.pic = 'static/user-pic/'+fileName;
            console.log(user.pic)
            unit.login(user.userName, user.nickName, user.pic);
            that.$store.commit("setUserInfo", user)
          }
          else{
            alert("更换图片失败")
          }
      }
      //上传过程中执行
      xhr.upload.onprogress = function(e) {
          var total = e.total,
              loaded = e.loaded;
          //变更进度
          that.changeProgress({
              total: total,
              loaded: loaded,
              fileName: fileName
          });
      };
      var formData = new FormData;
      console.log(fileName)
      formData.append("originalFilename", fileName);
      formData.append("file", file);
      xhr.send(formData);
    },
    changeProgress (info) {
      this.uploadProgress.progress = (info.loaded / info.total) * 100 + "%";
    },
    closeProgress(fileName){
      this.uploadProgress = '';
    },
    userPic(pic){
      if(pic == "" || pic == undefined){
        return '/static/norm-head.png'
      }
      else{
        return pic;
      }
    },
    submit() {
      var that = this;
      if(this.nickName == ''){
        alert("请输入昵称")
        return 
      }
      else{
        axios.post("/userUpdateInfo",{"tag": "nickName","value": that.nickName}).then(function (res){
          if(res.data.ret == 1){
            var user = unit.getUserInfo();
            user.nickName = that.nickName;
            unit.login(user.userName, user.nickName, user.pic);
            that.$store.commit("setUserInfo", user);
            alert("修改成功！")
          }
          else if(res.data.ret == 2){
            alert("和别人重名咯")
          }
        })
      }
    }
  },
  mounted: function (){
    unit.changeTitle("修改个人资料");
    this.$store.commit("showAside",false);
    this.$store.commit("showMiniBox", false);
    this.nickName = this.$store.getters.user.nickName;
  }
}
</script>

<style lang="less" >
  #changeuserinfo{
    .text{
      flex: 1;
      height: .4rem;
      font-size: .22rem;
    }
    .cell{
      .img{
        margin: .2rem 0;
        position: relative;
        width: 1.4rem;
        height: 1.4rem;
        border: .015rem solid #e5e5e5;
        border-radius: 50%;
        img{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .file{
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 2;
        }
        .progress{
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.4);
          .progress-bar{
            position: absolute;
            height: .04rem;
            background: #F00;
            left: 0;
            bottom: 0;
          }
        }
      }
    }
    .btn-middle{
      margin-top: .4rem;
    }
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
