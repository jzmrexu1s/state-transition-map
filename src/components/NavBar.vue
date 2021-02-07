<template>
  <div id="navbar">
    <el-menu
        :default-active="activeId"
        mode="horizontal"
        class="el-menu-demo"
        router
    >
    <span>State-transition Map builder</span>
    <el-menu-item v-for="item in barData" :key="item.id" :index="item.href"> {{ item.name }}
    </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      activeId: "draw",
      barData: [
        {id: "draw", name: "Draw", href:"/draw"},
        {id: "settings", name: "Settings", href:"/settings"}
      ]
    }
  },
  methods: {
  },
  mounted() {
    this.activeId = this.$route.path.substring(1, this.$route.path.length)
  }
}
</script>

<style scoped>
.el-menu-demo{
}
span{
  float: left;
  display: inline-block;
  line-height: 59px;
  margin-bottom: 1px;
  /*box-sizing: border-box;*/
}
.el-menu{
}
</style>