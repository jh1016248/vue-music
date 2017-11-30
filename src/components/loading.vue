<template>
  <div id="loading" v-if="isLoading"></div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
	#loading{
    position: fixed;
    z-index: 11;
    top: 40%;
    left: 50%;
    margin-left: -.2rem;
    margin-top: -.2rem;
    display: block;
    width: .4rem;
    height: .39rem;
    background: url(../assets/icon-loading.png) no-repeat;
    background-size: 100%;
    -webkit-animation: rotate 2s infinite linear;
    animation: rotate 2s infinite linear;
  }
</style>
