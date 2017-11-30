<template>
  <div class="header" :style="{backgroundColor: skin}">
    <div class="name">
      <h3>云音乐</h3>
      <a class="side-menu" @click="showASide(true)"></a>
      <router-link to="find" class="side-search"></router-link>
    </div>
    <div class="tab">
      <router-link to="/index/main">我的</router-link>
      <router-link to="/index/find">发现</router-link>
      <router-link to="/index/songsheet">歌单</router-link>
      <i :style="{left: tabInd * 33.3 + '%'}"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'skin',
      'tabInd'
    ]),
  },
  methods: {
    toUrl(num) {
      this.$store.commit("changeTab",num);
    },
    showASide(flag) {
      this.$store.commit("showAside", flag);
    },
  }
}
</script>

<style lang="less" scoped>
	.header{
    position: fixed;
    top: 0;
    width: 6.4rem;
    text-align: center;
    z-index: 2;
    .name{
      height: .7rem;
      line-height: .7rem;
      border-bottom: .015rem solid #e5e5e5;
      h3{
        color: #fff;
        font-size: .26rem;
      }
      .side-menu{
        position: absolute;
        left: .2rem;
        top: .23rem;
        display: block;
        width: .36rem;
        height: .24rem;
        background: url(../assets/icon-menu.png) no-repeat;
        background-size: 100%;
      }
      .side-search{
        position: absolute;
        right: .2rem;
        top: .23rem;
        display: block;
        width: .24rem;
        height: .24rem;
        background: url(../assets/icon-search.png) no-repeat;
        background-size: 100%;
      }
    }
    .tab{
      height: .7rem;
      display: flex;
      a{
        position: relative;
        flex: 1;
        display: block;
        line-height: .7rem;
        color: #fff;
        text-decoration: none;
        &.router-link-active{
          font-weight: bold;
        }
      }
      i{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 33.3%;
        height: .04rem;
        background: #fff;
        transition: all .2s;
      }
    }
  }
</style>
