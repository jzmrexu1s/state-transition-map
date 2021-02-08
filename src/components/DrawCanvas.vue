<template>
<div class="base">
<super-flow
    ref="superFlow"
    :node-list="nodeList"
    :link-list="linkList"
    :origin="origin"
    :graph-menu="graphMenuList"
>
<template v-slot:node="{meta}">
  <div :class="`flow-node flow-node-${meta.prop}`">
    <header class="ellipsis">
      {{meta.name}}
    </header>
    <section>
      {{meta.desc}}
    </section>
  </div>
</template>
</super-flow>
<el-dialog
    :title="drawerConf.title"
    :visible.sync="drawerConf.visible"
    :close-on-click-modal="false"
    width="500px"
>

</el-dialog>
</div>
</template>

<script>
export default {
  name: "DrawCanvas",
  data() {
    return {
      drawerConf: {
        title: '',
        visible: false,
        type: null,
        info: null,

      },
      nodeList: [],
      linkList: [],
      origin: [681, 465],
      graphMenuList: [
          [
            {label: "test"}
          ]
      ]
    }
  },
  mounted() {
    setTimeout(() => {
      this.nodeList = [
        {
          'id': 'nodeS3WgFnzCI15X58Qw',
          'width': 100,
          'height': 80,
          'coordinate': [-200, -200],
          'meta': {
            'prop': 'start',
            'name': '开始节点'
          }
        },
        {
          'id': 'nodefHsy9uJObPtdHZv1',
          'width': 160,
          'height': 80,
          'coordinate': [-200, -148],
          'meta': {
            'prop': 'start',
            'name': '审批节点',
            'desc': '111111'
          }
        }
      ]
    }, 100)
  }
}
</script>

<style scoped>
.base{
  width            : 100%;
  height           : 500px;
  margin           : 0 auto;
  background-color : #f5f5f5;
}
.ellipsis{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
}
.flow-node>header{
  font-size   : 14px;
  height      : 32px;
  line-height : 32px;
  padding     : 0 12px;
  color       : #ffffff;
}
.flow-node>section{
  text-align  : center;
  line-height : 20px;
  overflow    : hidden;
  padding     : 6px 12px;
  word-break  : break-all;
}
.flow-node-start>header{
  background-color : #55abfc;
}
</style>
