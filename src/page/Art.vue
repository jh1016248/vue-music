<template>
  <transition name="showRouter">
    <div id="art">
      <div class="item">
        <h3>{{ artList[0].title }}</h3>
        <h4>{{ artList[0].name }}{{ artList[0].time }}</h4>
        <img :src="artList[0].img">
        <div class="img-info">{{ artList[0].name }}</div>
        <div class="content" v-html="artList[0].content"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import unit from '../common/js/unit';
import axios from 'axios';
export default {
  name: 'Art',
  data () {
    return {
      
    }
  },
  computed: {
    oneInd: function() {
      return this.$store.getters.oneInd;
    },
    artList: function (){
      return this.$store.getters.artList;
    },
  },
  methods: {
    getOne: function(ind) {
      var that = this;
      axios.get('/api/one/' + ind).then(function (req){
        var data = JSON.parse(req.request.response).data;
        var list = [];
        for(var i = 0; i < data.content_list.length; i++){
          list.push({
            title: data.content_list[i].title || '',
            content: data.content_list[i].share_info.content,
            img: data.content_list[i].share_info.image,
            time: data.date.split(" ")[0],
            name: data.content_list[i].author.user_name,
          })
        }
        that.$store.commit("setArt",list)
      })
    },
  },
  mounted: function (){
    unit.changeTitle("文章");
    this.$store.commit("changeTab",2);
    this.$store.commit("showMiniBox",false);
    if(this.artList.length == 0){
      this.getOne(0);
    }
  }
}
</script>

<style lang="less" scoped>
  #art{
    display: flex;
    width: 100%;
    padding-top: 1.4rem;
    .item{
      margin: .4rem .2rem 0;
      h3{
        text-align: center;
        font-size: .28rem;
        margin-bottom: .1rem;
      }
      h4{
        text-align: center;
        font-weight: normal;
        font-size: .22rem;
        margin-bottom: .2rem;
        color: #9A9A9A;
      }
      img{
        width: 100%;
        margin-bottom: .2rem;
      }
      .content{
        font-size: .24rem;
        color: #333;
        line-height: 1.3;
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
</style>
