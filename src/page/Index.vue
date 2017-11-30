<template>
    <div id="Index">
      <VHeader></VHeader>
      <router-view></router-view>
    </div>
</template>

<script>
import VHeader from '../components/Header'

export default {
  name: 'Index',
  data () {
    return {
    }
  },
  components: {
    VHeader,
  },
  computed: {
  },
  methods: {
  },
  mounted: function (){
  }
}
</script>

<style lang="less" scoped>
  
</style>
