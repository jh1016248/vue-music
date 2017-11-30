<template>
  <div class="search-music-list">
    <MusicList :musicList="musicList"></MusicList>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import MusicList from '../components/MusicList'
export default {
  name: 'playList',
  components: {
    MusicList
  },
  data () {
    return {
      musicList: [],
    }
  },
  computed: {

  },
  methods: {
    getData(id) {
      this.$store.commit("setState", {isLoading: true})
      axios.get("https://api.imjad.cn/cloudmusic?type=playlist&id=" + id)
      .then(res => {
        var musicList = [];
        var list = res.data.playlist.tracks

        list.forEach(item => {
          musicList.push({
            "name": item.name,
            "id": item.id,
            "picUrl": item.al.picUrl,
            "songer": item.ar[0].name,
            "url": ''
          })
        })
        this.musicList = musicList;
        this.$store.commit("setState", {isLoading: false})
      })
    },
    
  },
  mounted: function (){
    this.getData(this.$route.params.id)
  }
}
</script>

<style lang="less" scoped>
  .search-music-list{
    
  }
</style>
