<template>
  <div>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-title">Personality Types</div></el-col>
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
              v-for="item in personalityTypes"
              :color="item.color"
              closable
              :disable-transitions="false"
              @click="handlePersonalityClickTag(item)"
              @close="handlePersonalityCloseTag(item)"
              effect="dark"
              type="info"
          >
            {{ item.name }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="personalityInputVisible"
              v-model="personalityInputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handlePersonalityInputConfirm"
              @blur="handlePersonalityInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" @click="personalityShowInput" size="small">Add New</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-content">
        <span>Range: from</span>
        <el-input
            class="input-range"
            size="small"
            v-model="personalityRange[0]"
        ></el-input>
        <span>to</span>
        <el-input
            class="input-range"
            size="small"
            v-model="personalityRange[1]"
        ></el-input>
      </div></el-col>
    </el-row>
    <el-dialog
        title="Pick a color"
        :visible.sync="personalityColorPickerOn"
        width="30%"
        @before-close="personalityColorPickerOn = false">
      <chrome-picker v-model="personalitySelectedColor" />
      <span slot="footer" class="dialog-footer">
    <el-button @click="personalityColorPickerOn = false" size="small">Cancel</el-button>
    <el-button type="primary" @click="handlePersonalityColorSelectConfirm" size="small">Set</el-button>
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
      personalityTypes: [],
      personalityInputVisible: false,
      personalityInputValue: '',
      personalitySelectedColor: '#194d33',
      personalitySelectedIdx: 0,
      personalityColorPickerOn: false,
      personalityRange: [0, 100]
    }
  },
  watch: {
    personalityRange: function () {
      Bus.$emit("setPersonalityRange", this.personalityRange)
    }
  },
  methods: {
    handlePersonalityCloseTag: function (item) {
      let id = this.personalityTypes.indexOf(item)
      this.personalityTypes.splice(id, 1)
      Bus.$emit("removePersonality", id)
      console.log(this.personalityTypes)
      this.personalityColorPickerOn = false
    },
    handlePersonalityClickTag: function (item) {
      this.personalityColorPickerOn = true
      this.personalitySelectedIdx = this.personalityTypes.indexOf(item)
    },
    handlePersonalityInputConfirm: function () {
      let inputValue = this.personalityInputValue;
      if (inputValue && this.personalityTypes.every(item => item.name !== inputValue)) {
        let newPersonality = {"name": inputValue, "color": "#408BE0"}
        this.personalityTypes.push(newPersonality)
        Bus.$emit("addPersonality", newPersonality)
      }
      this.personalityInputVisible = false
      this.personalityInputValue = ''
    },
    handlePersonalityColorSelectConfirm: function () {
      this.personalityColorPickerOn = false
      console.log(this.personalitySelectedColor)
      this.personalityTypes[this.personalitySelectedIdx].color = this.personalitySelectedColor.hex
      Bus.$emit("setPersonalityColor", {"id": this.personalitySelectedIdx, "color": this.personalitySelectedColor.hex})
    },
    personalityShowInput: function () {
      this.personalityInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  },
  mounted () {
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