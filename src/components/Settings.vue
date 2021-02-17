<template>
  <div>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-title">Status Types</div></el-col>
    </el-row>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-content">Click on the tag to change its color. </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="16">
        <div class="grid-title">
          <el-tag
              :key="item.name"
              v-for="item in statusTypes"
              :color="item.color"
              closable
              :disable-transitions="false"
              @click="handleStatusClickTag(item)"
              @close="handleStatusCloseTag(item)"
              effect="dark"
              type="info"
          >
            {{ item.name }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="statusInputVisible"
              v-model="statusInputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleStatusInputConfirm"
              @blur="handleStatusInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" @click="statusShowInput" size="small">Add New</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-content">
        <span>Range of value: from</span>
        <el-input
            class="input-range"
            size="small"
            v-model="statusRange[0]"
        ></el-input>
        <span>to</span>
        <el-input
            class="input-range"
            size="small"
            v-model="statusRange[1]"
        ></el-input>
      </div></el-col>
    </el-row>
    <el-dialog
        title="Pick a color"
        :visible.sync="statusColorPickerOn"
        width="30%"
        @before-close="statusColorPickerOn = false">
      <chrome-picker v-model="statusSelectedColor" />
      <span slot="footer" class="dialog-footer">
    <el-button @click="statusColorPickerOn = false" size="small">Cancel</el-button>
    <el-button type="primary" @click="handleStatusColorSelectConfirm" size="small">Set</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {Bus} from '@/event-bus'
import {Chrome} from 'vue-color'
export default {
  name: "Settings",
  data () {
    return {
      statusTypes: [],
      statusInputVisible: false,
      statusInputValue: '',
      statusSelectedColor: '#194d33',
      statusSelectedIdx: 0,
      statusColorPickerOn: false,
      statusRange: [0, 10]
    }
  },
  watch: {
    statusRange: function () {
      Bus.$emit("setStatusRange", this.statusRange)
    }
  },
  methods: {
    handleStatusCloseTag: function (item) {
      let id = this.statusTypes.indexOf(item)
      this.statusTypes.splice(id, 1)
      Bus.$emit("removeStatus", id)
      // console.log(this.statusTypes)
      this.statusColorPickerOn = false
    },
    handleStatusClickTag: function (item) {
      this.statusColorPickerOn = true
      this.statusSelectedIdx = this.statusTypes.indexOf(item)
    },
    handleStatusInputConfirm: function () {
      let inputValue = this.statusInputValue;
      if (inputValue && this.statusTypes.every(item => item.name !== inputValue)) {
        let newStatus = {"name": inputValue, "color": "#408BE0"}
        this.statusTypes.push(newStatus)
        Bus.$emit("addStatus", newStatus)
      }
      this.statusInputVisible = false
      this.statusInputValue = ''
    },
    handleStatusColorSelectConfirm: function () {
      this.statusColorPickerOn = false
      console.log(this.statusSelectedColor)
      this.statusTypes[this.statusSelectedIdx].color = this.statusSelectedColor.hex
      Bus.$emit("setStatusColor", {"id": this.statusSelectedIdx, "color": this.statusSelectedColor.hex})
    },
    statusShowInput: function () {
      this.statusInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  mounted () {
    this.statusTypes = [
      {"name": "Anticipation", "color": "#F97B28"},
      {"name": "Joy", "color": "#FFE766"},
      {"name": "Trust", "color": "#36B22F"},
      {"name": "Fear", "color": "#277F21"},
      {"name": "Surprise", "color": "#2089DB"},
      {"name": "Sadness", "color": "#0014C1"},
      {"name": "Disgust", "color": "#D611D8"},
      {"name": "Anger", "color": "#CD0015"},
    ]
  },
  components: {
    'chrome-picker': Chrome
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-title {
  border-radius: 4px;
  min-height: 36px;
  font-size: 1.5em;
  font-weight: bold;
  text-align: left;
  line-height: 36px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-align: left;
  line-height: 36px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.input-range {
  display: inline-block;
  width: 60px;
  margin-left: 10px;
  margin-right: 10px;
  vertical-align: bottom;
}
.row-tight {
  margin-bottom: 5px;
}
.el-tag {
  cursor: pointer;
}
.vc-chrome {
  margin: 0 auto;
}
p {
  margin: 0;
  padding: 0;
}
</style>