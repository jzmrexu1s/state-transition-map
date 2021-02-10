<template>
  <div class="base">
    <super-flow
        ref="superFlow"
        :node-list="nodeList"
        :link-list="linkList"
        :origin="origin"
        :graph-menu="graphMenuList"
        :link-menu="linkMenuList"
        :link-desc="linkDesc"
    >
      <template v-slot:node="{meta}">
        <div :class="`flow-node flow-node-${meta.prop}`" v-if="meta.type === 'status'">
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
                            @blur="scope.row.edit"
                            ref="value"
                  ></el-input>
                  <span v-else> {{ scope.row.value }} </span>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </div>
        <div :class="`flow-node flow-node-${meta.prop}`" v-else>
          <section>
            <div class="failure-div">
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
      description: '',
      drawerConf: {
        title: 'Line Settings',
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
          }, 100)
        }
      },
      nodeList: [],
      linkList: [],
      origin: [681, 465],
      linkMenuList: [
          [
            {
              label: "Edit...",
              disable: false,
              selected: (link, coordinate) => {
                this.drawerConf.open(link)
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
                status.push({'name': type.name, 'value': this.statusRange[0], 'color':type.color , 'edit': false})
              }
              this.nodeList.push({
                coordinate: coordinate,
                meta: {
                  type: 'status',
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
              this.nodeList.push({
                coordinate: coordinate,
                meta: {
                  type: 'failure',
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
        possibility: undefined
      }
    }
  },
  methods: {
    statusComputePercentage: function (value) {
      return value * 100 / (this.statusRange[1] - this.statusRange[0])
    },
    statusTableCellClassName: function ({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex
      column.index = columnIndex
    },
    handleStatusChangeValue: function (row, column, cell, event) {
      if (column.index === 2) {
        row.edit = true
        setTimeout(() => {
          this.$refs[column.property].focus()
        }, 20)
      }
    },
    linkSettingSubmit() {
      const conf = this.drawerConf
      this.$set(conf.info.meta, 'desc', this.linkSetting.desc)
      this.$set(conf.info.meta, 'possibility', this.linkSetting.possibility)
      conf.visible = false
    },
    linkDesc(link) {
      if (link.meta) {
        if (link.meta.desc && link.meta.possibility)
        return link.meta.desc +  ': ' + String(link.meta.possibility * 100) + '%'
      }
      return ''
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
      for (let node of vm.nodeList) {
        if (node.meta.type === 'status') {
          node.meta.status.splice(id, 1)
        }
      }
    })
    Bus.$on("setStatusColor", function (item) {
      vm.statusTypes[item.id].color = item.color
      for (let node of vm.nodeList) {
        if (node.meta.type === 'status') {
          node.meta.status[item.id].color = item.color
        }
      }
    })
    setTimeout(() => {
      this.nodeList = [
        {
          'coordinate': [-600, -400],
          'meta': {
            'type': 'status',
            'prop': 'start',
            'name': 'State1',
            'status': [
              {'name': 'happy', 'value': 50, 'color': "#abcdef", 'edit': false},
              {'name': 'sad', 'value': 20, 'color': "#408BE0", 'edit': false},
              {'name': 'naive', 'value': 80, 'color': "#408BE0", 'edit': false}
            ],
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
.grid-title {
  border-radius: 4px;
  min-height: 36px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: left;
  line-height: 36px;
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
}
.super-flow__node{
  width: 175px !important;
  height: auto !important;
}
.el-textarea__inner{
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.vc-chrome {
  margin: 0 auto;
}
.failure-div {
  height: 50px;
  line-height: 50px;
  font-weight: bold;
  color: darkred;
}
</style>