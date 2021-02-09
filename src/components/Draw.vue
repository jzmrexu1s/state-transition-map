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
            <ul>
              <li v-for="item in meta.personality">{{ item.name }} --- {{ item.value }}</li>
            </ul>
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
    <ul>
      <li v-for="item in personalityTypes">{{ item }}</li>
    </ul>
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
      personalityRange: [0, 100],
      personalityTypes: [],
    }
  },
  methods: {

  },
  watch: {

  },
  mounted() {
    let vm = this
    console.log(this.personalityTypes)
    Bus.$on("setPersonalityRange", function (range) {
      vm.personalityRange = range
    })
    Bus.$on("addPersonality", function (personality) {
      vm.personalityTypes.push(personality)
      for (let node of vm.nodeList) {
        node.meta.personality.push({'name': personality, 'value': vm.personalityRange[0]})
      }
    })
    Bus.$on("removePersonality", function (id) {
      console.log("id: ", id)
      vm.personalityTypes.splice(id, 1)
      for (let node of vm.nodeList) {
        node.meta.personality.splice(id, 1)
      }
    })
    Bus.$on("setPersonalityColor", function (item) {
      vm.personalityTypes[item.id].color = item.color
    })
    setTimeout(() => {
      this.nodeList = [
        {
          'id': 'nodeS3WgFnzCI15X58Qw',
          'width': 150,
          'height': 150,
          'coordinate': [-600, -400],
          'meta': {
            'prop': 'start',
            'name': 'State1',
            'personality': [
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
  padding     : 6px 12px;
  word-break  : break-all;
}
.flow-node-start>header{
  background-color : #55abfc;
}
.el-table{
  color: #42b983;
}
ul{
  padding-left: 0;
  list-style: none;
}
</style>