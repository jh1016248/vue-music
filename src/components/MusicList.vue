<template>
  <ul>
    <li v-for="(item,index) in musicList" :key="item" @click="addMusic(item,index)">
      <img :src="item.picUrl+'?param=100y100'">
      <div class="info">
        <h4>{{ item.name }}</h4>
        <p>{{ item.songer }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: [
    'musicList'
  ],
  methods: {
    addMusic(music,index) {
      this.$store.dispatch("addMusic",music);
    },
  }
}
</script>

<style lang="less" scoped>
	ul{
    li{
      position: relative;
      display: flex;
      height: .9rem;
      align-items: center;
      margin: 0 .1rem;
      border-bottom: .015rem solid #e3e3e3;
      img{
        width: .7rem;
        height: .7rem;
        margin: .1rem .3rem .1rem .1rem;
        border-radius: .04rem;
      }
      h4{
        font-size: .24rem;
      }
      p{
        padding-top: .1rem;
        color: #999;
        font-size: .2rem;
      }
      &.active{
        &:after{
          content: ' ';
          position: absolute;
          right: .2rem;
          top: .3rem;
          display: block;
          width: .3rem;
          height: .3rem;
          background: url(../assets/icon-music.png) no-repeat;
          background-size: 100%;
          animation: scale 1s infinite linear;
        }
      }
    }
}
</style>
