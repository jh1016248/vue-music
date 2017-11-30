<template>
  <div class="sheet-list">
    <p class="title">推荐歌单</p>
    <ul>
      <li v-for="item in sheetList" :key="item.id" @click="toPlayList(item.id)">
        <div class="cover">
          <img :src="item.coverImgUrl+'?param=250y250'">
          <div class="playcount" v-text="playCount(item.playCount)"></div>
          <div class="username" v-text="item.creatorName"></div>
        </div>
        <p v-text="item.name"></p>
      </li>
    </ul>
  </div>
</template>

<script>
import unit from '../common/js/unit'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'songsheet',
  data () {
    return {
      offset: 0,
    }
  },
  computed: {
    ...mapGetters([
      'sheetList',
      'isLoading'
    ]),
  },
  methods: {
    getMusicSheet(offset) {
      var that = this;
      if(!this.isLoading){
        that.$store.commit("setState", {isLoading: true})
        axios.get('http://musicapi.duapp.com/api.php?type=topPlayList&cat=全部' + '&offset=' + offset + '&limit=' + 10)
          .then(function (res){
            var list = res.data.playlists;
            var sheetList = JSON.parse(JSON.stringify(that.sheetList));
            list.forEach(item => {
              sheetList.push({
                name: item.name,
                id: item.id,
                creatorName: item.creator.nickname,
                coverImgUrl: item.coverImgUrl,
                playCount: item.playCount
              })
            })
            that.$store.commit("setState", {sheetList: sheetList})
            that.offset += 10 ;
            that.$store.commit("setState", {isLoading: false})
          })
      }
    },
    playCount(num) {
      return parseInt(num / 10000) + '万'
    },
    toPlayList(id) {
      this.$router.push({path: `/index/songsheet/${id}`})
    }
  },
  mounted: function (){
    this.$store.commit("changeTab",2);
    unit.changeTitle("歌单");
    this.$store.commit("showMiniBox", false);
    if(!this.sheetList.length) {
      this.getMusicSheet(0);
    } 
    var winH = window.innerHeight;

    window.onscroll = () => {
      if(this.$router.history.current.name == 'sheetList'){
        var scrT = document.documentElement.scrollTop || document.body.scrollTop;
        if(scrT >= document.body.offsetHeight -  winH - 50){
          this.getMusicSheet(this.offset);
        } 
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .sheet-list{ 
    .title{
      padding: .2rem;
    }
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        width: 49%;
        height: 4rem;
        margin-bottom: .1rem;
        margin-right: 2%;
        .cover{
          position: relative;
          img{
            width: 100%;
          }
          .playcount{
            position: absolute;
            top: .1rem;
            right: .1rem;
            background: url(../assets/music.png) no-repeat;
            background-size: .32rem .32rem;
            padding-left: .32rem;
            line-height: .32rem;
            color: #fff;
          }
          .username{
            position: absolute;
            bottom: .1rem;
            left: .1rem;
            background: url(../assets/music.png) no-repeat;
            background-size: .32rem .32rem;
            padding-left: .32rem;
            line-height: .32rem;
            color: #fff;
          }
        }
        p{
          padding: 0 .1rem;
          font-size: .22rem;
          line-height: .32rem;
        }
        &:nth-child(2n){
          margin-right: 0;
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
      transform: translateX(250px);
      opacity: 0;
    }
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
