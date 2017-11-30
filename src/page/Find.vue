<template>
  <transition name="showRouter">
    <div id="find">
      <div class="search-wrap">
        <div class="search-box" :class="searchInputing ? 'active' : ''">
          <input v-model="searchText" @click="searchInputing = true" placeholder="搜索音乐、歌手" class="text" >
          <div class="search-btn" @click="search(searchText)"></div>
        </div>
        <div class="search-cancel" v-if="searchInputing" @click="searchInputing = false">取消</div>
      </div>
      <div class="hot-list" v-if="searchRequest.length == 0 && !searchInputing">
        <p>热门搜索</p>
        <ul>
          <li v-for="item in hotList" :key="item" @click="search(item)">{{ item }}</li>
        </ul>
      </div>
      <div class="history-list" v-if="searchInputing">
        <ul>
          <li v-for="(item,index) in historyList"  :key="item" @click="search(item)"><i class="icon-close" @click.stop="deleteHistory(index)"></i>{{ item }}</li>
          <p @click="deleteHistory('all')" v-if="historyList.length > 0">清空搜索历史</p>
        </ul>
      </div>
      <div class="search-music-list" v-if="!isLoading && !searchInputing">
        <MusicList :musicList="searchRequest"></MusicList>
      </div>
    </div> 
  </transition>
</template>

<script>
import unit from '../common/js/unit'
import axios from 'axios'
import { mapGetters } from 'vuex'
import MusicList from '../components/MusicList'
export default {
  name: 'Find',
  data () {
    return {
    	searchText: '',
      hotList: [],
      historyList: [],
      searchInputing: false,
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'searchRequest',
      'searchPlayInd',
      'searchPlaying',
      'isLoading',
    ]),
  },
  methods: {
    search(name) {
      if(name != ''){
        var that = this;
        this.searchText = name;
        this.searchInputing = false;
        
        that.$store.commit("setState", {isLoading: true})
        axios
          .get("https://api.imjad.cn/cloudmusic/?type=search&s="+name)
          .then(function (res){
            var list = res.data.result.songs;
            var searchRequest = [];
            for(let i = 0; i < list.length; i++){
                var item = list[i];
                searchRequest.push({
                  "name": item.name,
                  "id": item.id,
                  "picUrl": item.al.picUrl,
                  "songer": item.ar[0].name
                })
            }
          that.$store.commit("pushSearchRequest",searchRequest);
          that.historyList.unshift(name);
          localStorage.historyList = JSON.stringify(that.historyList);
          that.$store.commit("setState", {isLoading: false})
        })
      }
    },
    strDecode(str) {
      return str.replace(/&#(x)?([^&]{1,5});?/g,function($,$1,$2) {
          return String.fromCharCode(parseInt($2 , $1 ? 16:10));
      });
    },
    addMusic(music,index) {
      this.$store.dispatch("addMusic",music);
    },
    deleteHistory(ind) {
      ind == 'all' ? this.historyList = [] : this.historyList.splice(ind,1);
      localStorage.historyList = JSON.stringify(this.historyList);
    }
  },
  mounted: function (){
    this.$store.commit("changeTab",1);
    unit.changeTitle("发现");
    this.$store.commit("showMiniBox", true);
    var that = this;
    if(that.searchRequest.length == 0){
      axios.get("/api/hot").then(function (req){
        var data = JSON.parse(req.request.response);
        that.hotList = data
      });
    }
    var hl = localStorage.historyList;
    if(hl != undefined){
      this.historyList = JSON.parse(hl);
    }

  }
}
</script>

<style lang="less" scoped>
  #find{ 
    width: 100%;
    height: 100%;
    padding-top: 1.4rem;
    padding-bottom: 1.2rem;
    .search-wrap{
      display: block;
      height: 1rem;
      background: #f3f3f3;
      width: 100%;
      text-align: center;
      font-size: 0;
      padding: 0 .2rem;
      box-sizing: border-box;
      border-bottom: .015rem solid #e4e4e4;
      .search-box{
        display: inline-block;
        position: relative;
        width: 100%;
        padding-top: .25rem;
        .text{
          box-sizing: border-box;
          width: 100%;
          height: .5rem;
          font-size: .22rem;
          line-height: .22rem;
          border-radius: .5rem;
          line-height: .5rem;
          border: .015rem solid #e3e3e3;
          padding: .13rem .65rem .13rem .2rem;
        }
        .search-btn{
          display: block;
          position: absolute;
          right: .15rem;
          top: .35rem;
          width: .3rem;
          height: .3rem;
          background: url(../assets/icon-search2.png) no-repeat;
          background-size: 100%;
        }
        &.active{
          width: 85%;
        }
      }
      .search-cancel{
        display: inline-block;
        width: 15%;
        font-size: .24rem;
        color: #333;
      }
    }
    .hot-list{
      margin: 0 .2rem;
      >p{
        margin: .2rem 0;
      }
      ul{
        font-size: 0;
        li{
          display: inline-block;
          border: .015rem solid #a9a9a9   ;
          border-radius: .5rem;
          height: .5rem;
          padding: 0 .3rem;
          font-size: .2rem;
          box-sizing: border-box;
          line-height: .47rem;
          margin: 0 .25rem .2rem 0;
        }
      }
    }
    .search-music-list{
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
    }
    .history-list{
      ul{
        margin: 0 .2rem;
        li{
          height: .7rem;
          line-height: .7rem;
          padding-left: .6rem;
          background: url(../assets/icon-history.png) .1rem center no-repeat;
          background-size: .3rem .3rem;
          font-size: .24rem;
          border-bottom: .015rem solid #e3e3e3;
          .icon-close{
            display: block;
            float: right;
            width: .3rem;
            height: .3rem;
            background: url(../assets/icon-close.png) no-repeat;
            background-size: 100%;
            margin: .2rem;
          }
        }
      }
      p{
        margin: .2rem 0;
        text-align: center;
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
</style>
