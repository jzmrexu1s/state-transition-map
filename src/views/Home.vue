<template>
  <div class="home">
    <el-container>
      <el-header>
        <NavBar></NavBar>
      </el-header>
      <el-main>
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from '@/components/NavBar'
export default {
  name: 'Home',
  components: {
    NavBar
  }
}
</script>

<style scoped>
.el-header, .el-footer{
  line-height: 60px;
  /*box-sizing: border-box;*/
  /*background: #B3C0D1;*/
}
</style>
