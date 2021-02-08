<template>
  <div>
    <p>settings</p>
    <button @click="testGet">触发</button>
    <span>{{ testVal }}</span>
  </div>
</template>

<script>
import {Bus} from '@/event-bus'
export default {
  name: "Settings",
  data () {
    return {
      testVal: 0
    }
  },
  mounted () {
    let vm = this
    Bus.$on('Assembly', (data) => {
      console.log(data)
      vm.testVal = data
    })
  },
  methods: {
    testGet: function () {
      this.testVal ++
    }
  }
}
</script>

<style scoped>

</style>