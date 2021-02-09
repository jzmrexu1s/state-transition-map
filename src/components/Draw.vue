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
          <section class="node-table">
            {{meta.desc}}
            <el-table
                :data="meta.status"
                style="width: 100%; font-size: 0.7em"
                :show-header="false"
                :row-style="{height:'15px', border:'none', padding: '0'}"
                :cell-style="{padding:'0'}"
            >
              <el-table-column
                  prop="name"
                  width="60px"
                  :cell-style="{padding:'5px'}"
              ></el-table-column>
              <el-table-column
                  width="50px"
              >
                <template slot-scope="scope">
                  <el-progress :stroke-width="10"
                               :percentage="statusComputePercentage(scope.row.value)"
                               :show-text="false"
                               :color="scope.row.color"></el-progress>
                </template>
              </el-table-column>
              <el-table-column
                  prop="value"
                  width="30px"
              >
              </el-table-column>
            </el-table>
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
import {Bus} from '@/event-bus'

export default {
  name: "DrawCanvas",
  data() {
    return {
      testVal: 10086,
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
      ],
      statusRange: [0, 100],
      statusTypes: [],
    }
  },
  methods: {
    statusComputePercentage: function (value) {
      return value * 100 / (this.statusRange[1] - this.statusRange[0])
    }
  },
  watch: {

  },
  mounted() {
    let vm = this
    console.log(this.statusTypes)
    Bus.$on("setStatusRange", function (range) {
      vm.statusRange = range
    })
    Bus.$on("addStatus", function (status) {
      vm.statusTypes.push(status)
      for (let node of vm.nodeList) {
        console.log(node.meta.status)
        node.meta.status.push({'name': status.name, 'value': vm.statusRange[0], 'color': status.color})
        console.log(node.meta.status)
      }
    })
    Bus.$on("removeStatus", function (id) {
      vm.statusTypes.splice(id, 1)
      for (let node of vm.nodeList) {
        node.meta.status.splice(id, 1)
      }
    })
    Bus.$on("setStatusColor", function (item) {
      vm.statusTypes[item.id].color = item.color
      for (let node of vm.nodeList) {
        node.meta.status[item.id].color = item.color
      }
    })
    setTimeout(() => {
      this.nodeList = [
        {
          'id': 'nodeS3WgFnzCI15X58Qw',
          'coordinate': [-600, -400],
          'meta': {
            'prop': 'start',
            'name': 'State1',
            'status': [
              {'name': 'happy', 'value': 50, 'color': "#abcdef"},
              {'name': 'sad', 'value': 20, 'color': "#408BE0"},
              {'name': 'naive', 'value': 80, 'color': "#408BE0"}
            ]
          }
        },
      ]
    }, 100)
  }
}
</script>

<style scoped>
.base{
  width            : 100%;
  height           : 700px;
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
  font-weight : bold;
}
.flow-node>section{
  text-align  : center;
  line-height : 20px;
  overflow    : hidden;
  padding     : 2px 2px;
  word-break  : break-all;
}
.flow-node-start>header{
  background-color : rgba(50, 50, 50, 1);
}
ul{
  padding-left: 0;
  list-style: none;
}
.el-table::before {
  height: 0;
}
</style>
<style>
.el-progress-bar__innerText{
  /*top: 4px;*/
  /*right: -50px;*/
  /*position: absolute;*/
  color: black;
}
.cell{
  padding: 0 0 0 3px !important;
  line-height: 20px !important;
}
.super-flow__node{
  width: auto !important;
  height: auto !important;
}
</style>