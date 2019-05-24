<template>
  <el-dialog
    class="custom-dialog custom-rule-dialog"
    title="自定义规则"
    :visible.sync="visible"
    :modal-append-to-body="false"
    @close="$emit('update:visible',false)"
    size="tiny">
    <div class="custom-rules-dialog">
      <div class="edit-color text-center">
        <div class="color-table">
          <div class="color-table-title">
            <div class="color-title-name title-bg title-order">顺序</div>
            <div class="color-title-name title-bg title-code-type">编码类型</div>
            <div class="color-title-name title-bg title-child-setting">子配置</div>
            <div class="color-title-name title-bg title-operation">操作</div>
          </div>
          <div class="color-table-scroll">
            <draggable v-model="updateParams.commonGenerateAttrRuleDTOs" @update="updateInfo">
              <transition-group>
                <div
                  v-for="(item,index) of updateParams.commonGenerateAttrRuleDTOs"
                  :key="'CustomRule'+index"
                  class="color-table-title"
                  style="margin-top:-1px;">
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-order">
                    {{index+1}}
                  </div>
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-code-type inputBox">
                    <el-select
                      @change="selectChange(item,$event)"
                      v-model="item.commonAttrFieldId"
                      placeholder="编码类型"
                      style="border:0;">
                      <el-option
                        :label="$item.attrName+($index>1?'编号':'')"
                        :value="$item.id"
                        v-for="($item, $index) in attrList"
                        :key="$index"></el-option>
                    </el-select>
                  </div>
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-child-setting inputBox">
                    <el-input
                      v-if="item.commonAttrFieldId=='0'"
                      v-model="item.value"
                      placeholder="请输入固定编码"
                      maxlength="8"
                      style="border:0;"
                      :key="index+'1'">
                    </el-input>
                    <el-input
                      v-else-if="item.commonAttrFieldId=='1'"
                      v-model="item.value"
                      @input="inputHandle"
                      placeholder="请输入位数"
                      style="border:0;"
                      :key="index+'1'"
                      maxlength="1">
                    </el-input>
                    <span v-if="item.commonAttrFieldId=='1' && item.value" class="child-setting-unit">位</span>
                  </div>
                  <div class="color-title-name title-operation color-opera handle">
                    <div class="color-sort draggable">
                      <icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序
                    </div>
                    <div class="color-sort" @click="delRule(index)">
                      <span>
                                                  <icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除
                                              </span>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
          <div class="add-color" @click="addRule">+添加</div>
          <el-row>
            <el-col :span="24" class="bottom-btn-wrapper">
              <nf-button class="cancel-commit" @click="cancel">取消</nf-button>
              <nf-button
                class="sure-commit"
                @click="checkCommitData"
                :loading="isloading">确定</nf-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import draggable from "vuedraggable"

export default {
  name: 'autoNumDialog',
  props: {
    visible: Boolean,
    changeType: Number,
    isloading: Boolean,
    attrList: Array,
    editList: Object
  },
  components: {
    draggable
  },
  data() {
    return {
      inputState: [],
      updateParams: {
        commonGenerateAttrRuleDTOs: []
      },
    }
  },
  watch: {
    editList: {
      handler(newValue) {
        this.updateParams = JSON.parse(JSON.stringify(newValue))
      },
      deep: true
    },
    attrList: {
      handler(newValue) {},
      deep: true
    }
  },
  created() {
    const ETList = JSON.parse(JSON.stringify(this.editList))
    if(ETList.commonGenerateAttrRuleDTOs){
      this.updateParams = ETList
    }else{
      this.updateParams = {
        commonGenerateAttrRuleDTOs:[]
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false);
      //取消时弹窗还原默认值
      this.updateParams = JSON.parse(JSON.stringify(this.$parent.editList))
    },
    selectChange(item, e) {
      //设置参数附带名称和attrType
      // const listItem = this.attrList.find(v => v.id === e)
      // this.$set(item,'name',listItem.attrName)
      // this.$set(item,'attrType',listItem.attrType)
    },
    delRule(index) {
      this.updateParams.commonGenerateAttrRuleDTOs.splice(index, 1)
    },
    addRule() {
      console.log('kuhn___新增',this.updateParams);
      this.updateParams.commonGenerateAttrRuleDTOs.push({
        value: '',
        commonAttrFieldId: ''
      })
    },
    emitEvent(eventName, params) {
      this.$emit(eventName, params)
    },
    updateInfo(evt) {
      this.$emit('sort', this.changeType, this.updateParams.commonGenerateAttrRuleDTOs)
    },
    checkInput(arr) {
      let flag = false
      arr.forEach(v => {
        if (v.commonAttrFieldId == '0') { //固定值
          if (v.value == '') {
            flag = true
            return this.$message({
              type: "error",
              message: '请输入固定值',
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            })
          } else {
            let reg = /^[A-Z0-9]{0,8}$/
            if (!reg.test(v.value)) {
              flag = true
              return this.$message({
                type: "error",
                message: '固定值只能是数字和大写字母',
                showClose: true,
                duration: this.$globalConfig.elementUI.duration
              })
            }
          }
        } else if (v.commonAttrFieldId == '1') { //流水号
          let reg = /[1-8]/
          if (!reg.test(v.value)) {
            flag = true
            return this.$message({
              type: "error",
              message: '流水号请输入1至8的数字',
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            })
          }
        }
      })
      return flag
    },
    checkCommitData() {
      let canCommit = false;
      for (let index in this.updateParams.commonGenerateAttrRuleDTOs) {
        if (this.updateParams.commonGenerateAttrRuleDTOs[index].commonAttrFieldId == '1') {
          canCommit = true;
          break
        }
      }
      if (!canCommit) {
        return this.$message({
          type: "error",
          message: '至少包含一个流水号选项',
          showClose: true,
          duration: this.$globalConfig.elementUI.duration
        })
      }
      if (this.checkInput(this.updateParams.commonGenerateAttrRuleDTOs)) return
      this.updateParams.commonGenerateAttrRuleDTOs.forEach(item => {
        let listItem = this.attrList.find(_v => _v.id === item.commonAttrFieldId)
        this.$set(item, 'name', listItem.attrName)
        this.$set(item, 'attrType', listItem.attrType)
      })

      this.$emit('sureCommit', this.changeType, this.updateParams)
    }
  },
}
</script>

<style lang="scss">
.custom-rules-dialog {
  .el-input__inner {
    border: none;
  }

  .beseem-wrap {
    .el-input__inner {
      min-height: 30px !important;
    }
  }
}

.custom-rule-dialog .el-dialog--tiny {
  width: auto;
}

.custom-dialog.custom-rule-dialog .el-dialog__body {
  padding: 0;
  border-top: 1px solid #DFE6EC;

  .icon {
    margin-bottom: 0;
  }
}
</style><style lang="scss" scoped>
@import "~scss_vars";

.red {
  color: #fa4150;
}

.title-bg {
  background-color: #f5f7fa;
  color: #a2abb8 !important;
}

.edit-color {
  width: 700px !important;
  height: 100%;
  padding-top: 1px;
  background-color: #fff;
  z-index: 101;

  .color-header {
    width: 850px;
    height: 88px;
    color: #3b3b3b;
    font-size: 24px;
    padding: 16px 32px 20px 32px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e6ed;
    z-index: 2;
  }

  .color-table {
    margin: 20px;
    box-sizing: border-box;

    .beseem-wrap {
      text-align: left;
      margin-bottom: 15px;
      font-size: 12px;

      .beseem-select {
        margin-left: 15px;
        border: 1px solid #BFCBD9;
      }
    }

    .color-table-title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 36px;
      color: #a2abb8;
      border: 1px solid #e6eaf0;
      border-right: none;
    }

    .color-title-name {
      width: 33.3333%;
      display: flex;
      justify-content: normal;
      align-items: center;
      height: 36px;
      padding-left: 10px;
      color: #3b3b3b;
      position: relative;

      .edit-color {
        .el-input__inner {
          text-align: left;
        }
      }

      &>.el-select {
        width: 100%;
      }

      &.title-order {
        width: 12.25%;
      }

      &.title-code-type,
      &.title-child-setting {
        padding-left: 10px;
        width: 30%;
      }

      &.title-operation {
        width: 27.75%;
      }

      &div.inputBox {
        padding-left: 10px;
      }

      &.inputBox {
        border: 10px;
        padding-left: 0;

        .el-input>input {
          border: 0 !important;
        }
      }

      .icon-error {
        width: 1rem;
        height: 1rem;
        background: red;
        color: white;
        border-radius: 1rem;
        margin-right: 5px;
      }

      .child-setting-unit {
        position: absolute;
        left: 1.5rem;
      }
    }

    .color-opera {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 36px;
    }

    .add-color {
      height: 36px;
      display: flex;
      justify-content: normal;
      align-items: center;
      width: 100%;
      height: 36px;
      color: #ffa914;
      border: 1px solid #e6eaf0;
      margin-top: -1px;
      padding-left: 10px;
      box-sizing: border-box;

      &:hover {
        background-color: #f7f9fc;
        cursor: pointer;
      }
    }

    .color-sort {
      display: flex;
      justify-content: normal;
      align-items: center;
      width: 50%;
      border-right: 1px solid #e6eaf0;
      height: 36px;
      padding-left: 10px;
      color: #808080;

      &:hover {
        color: #3b3b3b;
        cursor: pointer;
      }
    }

    .del-color {
      display: flex;
      justify-content: normal;
      align-items: center;
      width: 50%;
    }

    .del-text {
      color: #808080;

      &:hover {
        color: #3b3b3b;
      }
    }

    .color-table-scroll {
      overflow: hidden;
    }

    .edit-color-opera {
      display: flex;
      justify-content: normal;
      align-items: center;
      width: 33.3333%;
      height: 100%;

      .edit-color-cancel {
        margin-right: 24px;
        cursor: pointer;
      }
    }

    .color-draggable {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      min-width: 90%;
    }
  }
}

.backgroundPopover {
  background: #939fb8;
  border: 1px solid #939fb8;
}

.popper__arrow::after {
  border-top-color: #939fb8 !important;
}

.edit-color .el-checkbox__inner {
  width: 14px;
  height: 14px;
  border-radius: 2px;

  &:hover {
    boder: 1px solid #ffa914;
    color: #3b3b3b !important;
  }

  &::after {
    box-sizing: content-box;
    content: "";
    border: 2px solid #fff;
    border-left: 0;
    border-top: 0;
    height: 8px;
    left: 3px;
    position: absolute;
    top: 0px;
    -ms-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    width: 4px;
    transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
    -ms-transform-origin: center;
    transform-origin: center;
  }
}

.edit-color {
  .el-input__inner {
    border: 1px solid #ffa914;
    border-radius: 0px;
  }
}

.edit-color .dialog-content-wrap {
  .delete-tip {
    padding-top: 4px;
    font-size: 16px;
  }

  p {
    line-height: 26px;
  }
}

.edit-color .handle-delete {
  margin-top: 34px;
}

.bottom-btn-wrapper {
  text-align: right;
  margin-top: 20px;

  .sure-commit {
    background: #FFA914;
    border: 1px solid #FFA914;
    color: white;
  }

  .cancel-commit {
    color: #808080;
    border: 1px solid rgba(220, 224, 230, 1);
  }
}
</style>
