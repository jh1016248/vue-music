<template>
  <transition name="showRouter">
    <div id="songsheet">
      <router-view></router-view>
    </div> 
  </transition>
</template>

<script>
import unit from '../common/js/unit'
export default {
  name: 'songsheet',
  data () {
    return {
    }
  },
  mounted: function (){
    this.$store.commit("changeTab",2);
    unit.changeTitle("歌单");
    this.$store.commit("showMiniBox", false);
  }
}
</script>

<style lang="less" scoped>
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
  #songsheet{ 
    width: 6.4rem;
    height: 100%;
    padding-top: 1.4rem;

    @keyframes scale{
      0%{
        transform: scale(1);
      }
      50%{
        transform: scale(.9);
      }
      100%{
        transform: scale(1);
      }
    }
  }
</style>
