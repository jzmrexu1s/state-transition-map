<template>
  <div class="base">
    <super-flow
        ref="superFlow"
        :node-list="nodeList"
        :link-list="linkList"
        :origin="origin"
        :graph-menu="graphMenuList"
        :link-menu="linkMenuList"
        :node-menu="nodeMenuList"
        :link-desc="linkDesc"
        :draggable="nodeDraggable"
        :link-style="linkStyle"
    >
      <template v-slot:node="{meta}">
        <div :class="`flow-node flow-node-${meta.prop}`" v-if="meta.type === 'status'">
          <header class="ellipsis">
              <el-input v-if="meta.edit"
                        v-model="meta.name"
                        style="width: 100%"
                        ref="value"
                        @blur="meta.edit = false"></el-input>
              <span v-else @click="meta.edit = true"> {{ meta.name }} </span>
          </header>
          <section class="node-table">
            {{meta.desc}}
            <el-table
                :data="meta.status"
                style="width: 100%; font-size: 0.7em"
                :show-header="false"
                :row-style="{height:'15px', border:'none', padding: '0'}"
                :cell-style="{padding:'0'}"
                @cell-click="handleStatusChangeValue"
                :cell-class-name="statusTableCellClassName"
            >
              <el-table-column
                  prop="name"
                  width="60px"
                  :cell-style="{padding:'5px'}"
              ></el-table-column>
              <el-table-column
                  width="70px"
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
                  width="40px"
              >
                <template slot-scope="scope">
                  <el-input v-if="scope.row.edit"
                            v-model="scope.row.value"
                            style="width: 100%"
                            ref="value"
                            @blur="scope.row.edit = false"
                  ></el-input>
                  <span v-else> {{ scope.row.value }} </span>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </div>
        <div :class="`flow-node flow-node-${meta.prop}`" v-else>
          <section class="section-failure">
            <div class="div-failure">
              Failed
            </div>
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
      <el-form
          @submit.native.prevent
          ref="linkSettings"
          :model="linkSetting">
        <el-form-item
            label="Method"
            prop="desc">
          <el-input
              v-model="linkSetting.desc"
              placeholder="">
          </el-input>
        </el-form-item>
        <el-form-item
            label="Possibility"
            prop="possibility"
        >
          <el-input
              v-model="linkSetting.possibility"
              placeholder="From 0 to 1"
          >
          </el-input>
        </el-form-item>
        <el-form-item
            label="Color"
            prop="color"
        >
          <chrome-picker v-model="linkSetting.color" class="link-color-picker"></chrome-picker>
        </el-form-item>
      </el-form>
      <span
          slot="footer"
          class="dialog-footer">
        <el-button
            type="primary"
            @click="linkSettingSubmit">
          Finish
        </el-button>
      </span>
    </el-dialog>
    <el-row style="margin-top: 10px">
      <el-col :span="24">
        <el-input
            type="textarea"
            :rows="1"
            placeholder="Description"
            v-model="description">
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Bus} from '@/event-bus'
import {Chrome} from 'vue-color'
export default {
  name: "DrawCanvas",
  components: {
    'chrome-picker': Chrome
  },
  data() {
    return {
      nodeDraggable: true,
      description: '',
      drawerConf: {
        title: 'Link Settings',
        visible: false,
        type: null,
        info: null,
        open: (info) => {
          let conf = this.drawerConf
          conf.visible = true
          conf.info = info
          let that = this
          setTimeout(function () {
            that.$refs.linkSettings.resetFields()
            if (!conf.info.meta) conf.info.meta = {}
            that.$set(that.linkSetting, 'desc', info.meta.desc ? info.meta.desc : '')
            that.$set(that.linkSetting, 'possibility', info.meta.possibility ? info.meta.possibility: '')
            that.$set(that.linkSetting.color, 'hex', info.meta.color ? info.meta.color.hex: '')
          }, 100)
        }
      },
      nodeList: [],
      linkList: [],
      origin: [681, 465],
      nodeMenuList: [
        [
          {
            label: 'Remove',
            disable: false,
            selected: (node, coordinate) => {
              node.remove()
            }
          }
        ],
      ],
      linkMenuList: [
          [
            {
              label: "Edit...",
              disable: false,
              selected: (link, coordinate) => {
                this.drawerConf.open(link)
              }
            },
            {
              label: 'Remove',
              disable: false,
              selected: (link, coordinate) => {
                link.remove()
              }
            }
          ]
      ],
      graphMenuList: [
        [
          {
            label: "+ State",
            disable: false,
            selected: (graph, coordinate) => {
              let status = []
              for (let type of this.statusTypes) {
                status.push({'name': type.name, 'value': this.statusRange[0], 'color':type.color , 'edit': false, 'editHead': false})
              }
              this.$refs.superFlow.graph.addNode({
                coordinate: coordinate,
                width: 175,
                height: this.nodeHeight,
                id: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5),
                meta: {
                  type: 'status',
                  edit: false,
                  prop: 'start',
                  name: 'State',
                  status: status,
                }
              })
              }
          },
          {
            label: "+ Failure",
            disable: false,
            selected: (graph, coordinate) => {
              this.$refs.superFlow.graph.addNode({
                id: (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5),
                coordinate: coordinate,
                width: 175,
                height: 97,
                meta: {
                  type: 'failure',
                  edit: false,
                  prop: 'start',
                  name: 'State',
                  status: [],
                }
              })
            }
          }
        ]
      ],
      statusRange: [0, 100],
      statusTypes: [],
      linkSetting: {
        desc: '',
        possibility: undefined,
        color: {
          hex: '#000000',
        }
      }
    }
  },
  computed: {
    nodeHeight: function () {
      let newHeight = this.statusTypes.length <= 3 ? 97 : 97 + (this.statusTypes.length - 3) * 21
      for (let node of this.$refs.superFlow.graph.nodeList) {
        if (node.meta.type === 'status') node.height = newHeight
      }
      return newHeight
    }
  },
  methods: {
    statusComputePercentage: function (value) {
      return (value - this.statusRange[0]) * 100 / (this.statusRange[1] - this.statusRange[0])
    },
    statusTableCellClassName: function ({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex
      column.index = columnIndex
    },
    handleStatusChangeValue: function (row, column, cell, event) {
      if (column.index === 2) {
        row.edit = true
        setTimeout(() => {
          this.$refs.value.focus()
        }, 20)
      }
    },
    linkSettingSubmit() {
      const conf = this.drawerConf
      this.$set(conf.info.meta, 'desc', this.linkSetting.desc)
      this.$set(conf.info.meta, 'possibility', this.linkSetting.possibility)
      this.$set(conf.info.meta, 'color', this.linkSetting.color)
      conf.visible = false
    },
    linkDesc(link) {
      if (link.meta) {
        if (link.meta.desc && link.meta.possibility)
        return link.meta.desc +  ': ' + String(link.meta.possibility * 100) + '%'
      }
      return ''
    },
    linkStyle(link) {
      if (link.meta && link.meta.color) {
        return {
          color: link.meta.color.hex
        }
      }
    }
  },
  mounted() {
    let vm = this
    Bus.$on("setStatusRange", function (range) {
      vm.statusRange = range
    })
    Bus.$on("addStatus", function (status) {
      vm.statusTypes.push(status)
      for (let node of vm.$refs.superFlow.graph.nodeList) {
        if (node.meta.type === 'status') {
          node.meta.status.push({
            'name': status.name,
            'value': vm.statusRange[0],
            'color': status.color,
            'edit': false})
        }
      }
    })
    Bus.$on("removeStatus", function (id) {
      vm.statusTypes.splice(id, 1)
      for (let node of vm.$refs.superFlow.graph.nodeList) {
        if (node.meta.type === 'status') {
          node.meta.status.splice(id, 1)
        }
      }
    })
    Bus.$on("setStatusColor", function (item) {
      vm.statusTypes[item.id].color = item.color
      for (let node of vm.$refs.superFlow.graph.nodeList) {
        if (node.meta.type === 'status') {
          node.meta.status[item.id].color = item.color
        }
      }
    })
    setTimeout(() => {
      this.nodeList = [
        // {
        //   'id': 'nodeS3WgFnzCI15X58Qw',
        //   'coordinate': [-600, -400],
        //   'meta': {
        //     'type': 'status',
        //     'prop': 'start',
        //     'name': 'State1',
        //     'edit': false,
        //     'status': [
        //       {'name': 'happy', 'value': 50, 'color': "#abcdef", 'edit': false},
        //       {'name': 'sad', 'value': 20, 'color': "#408BE0", 'edit': false},
        //       {'name': 'naive', 'value': 80, 'color': "#408BE0", 'edit': false}
        //     ],
        //   }
        // },
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
  cursor: pointer;
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
.grid-title {
  border-radius: 4px;
  min-height: 36px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: left;
  line-height: 36px;
}
.div-failure {
  height: 100px;
  line-height: 100px;
  font-weight: bold;
  color: darkred;
}
.section-failure {
  padding: 0 !important;
}
.link-color-picker {
  margin-top: 30px;
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
  text-align: center !important;
  max-height: 20px;
  overflow: auto !important;
}
.super-flow__node{
  /*width: 175px !important;*/
  /*height: 300px !important;*/
  /*min-height: 100px;*/
}
.el-textarea__inner{
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.vc-chrome {
  margin: 0 auto;
}
.el-input__inner{
  padding-left: 2px;
  padding-right: 2px;
  font-size: 0.8em;
  line-height: 20px;
  height: 20px;
}
.el-table_2_column_6{
  cursor: pointer;
}
.el-form-item__label {
  line-height: 20px !important;
}
.el-form-item__content {
  /*overflow: hidden;*/
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
</style>