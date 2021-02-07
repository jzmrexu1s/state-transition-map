<template>
  <div id="navbar">
    <el-menu
        :default-active="activeId"
        mode="horizontal"
        class="el-menu-demo"
        router
    >
    <span>State-transition Map Builder</span>
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
      activeId: "/draw",
      barData: [
        {id: "draw", name: "Draw", href:"/draw"},
        {id: "settings", name: "Configuration", href:"/settings"}
      ]
    }
  },
  methods: {
  },
  created() {
    this.activeId = this.$route.path
  }
}
</script>

<style scoped>
.el-menu-demo{
}
span{
  position: absolute;
  left: 0;
  top: 10px;
  line-height: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  border-right: 1px solid rgb(200, 200, 200);
  font-weight: normal;
  font-size: 1.1em;
}
.el-menu{
  text-align: center;
  width: 100%;
  position: relative;
}
.el-menu .el-menu-item{
  float: none;
  display: inline-block;
  font-size: 1em;
  font-weight: bolder;
}
</style>