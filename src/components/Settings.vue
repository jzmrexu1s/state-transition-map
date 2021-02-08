<template>
  <div>
    <el-row class="row-tight">
      <el-col :span="4"><div class="grid-title"></div></el-col>
      <el-col :span="20"><div class="grid-title">Emotion Types</div></el-col>
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
              v-for="item in emotionTypes"
              :color="item.color"
              closable
              :disable-transitions="false"
              @close="handleEmotionCloseTag(item)"
              effect="light"
          >
            {{ item.name }}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="emotionInputVisible"
              v-model="emotionInputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleEmotionInputConfirm"
              @blur="handleEmotionInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" @click="emotionShowInput" size="small">New Emotion</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Bus} from '@/event-bus'
import {Chrome} from 'vue-color'
export default {
  name: "Settings",
  data () {
    return {
      emotionTypes: [
      ],
      emotionInputVisible: false,
      emotionInputValue: ''
    }
  },
  methods: {
    testSetEmotionTypes: function () {
      this.emotionTypes = new Set(["Good", "Bad"])
      Bus.$emit('SettingsToDraw', this.emotionTypes)
    },
    handleEmotionCloseTag: function (item) {
      this.emotionTypes.splice(this.emotionTypes.indexOf(item), 1)
    },
    handleEmotionInputConfirm: function () {
      let inputValue = this.emotionInputValue;
      if (inputValue && this.emotionTypes.every(item => item.name !== inputValue)) {
        this.emotionTypes.push({"name": inputValue, "color": "#abcdef"})
      }
      this.emotionInputVisible = false
      this.emotionInputValue = ''
    },
    emotionShowInput: function () {
      this.emotionInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  },
  mounted () {
    console.log(this.emotionTypes)
    Bus.$on('DrawToSettings', function (data) {
      console.log(data)
      this.emotionTypes = data
    })
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
.row-tight {
  margin-bottom: 5px
}
</style>