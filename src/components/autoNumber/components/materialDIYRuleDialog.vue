/*
 * @Author: kuhn 
 * @Description: 全局设置 - 自动编码管理 - 物料款号规则 - 自定义规则弹窗
 *    @props  tableData 列表数据
 *    @props  visible 控制弹框显示与隐藏
 *    @props  changeType 款号类型  1-设计款号  2-商品款号
 *    @props  showBeseemSelect 是否显示适用选项
 *    @props  selectData 适用选项列表数据
 *    @props  selectAttrs 适用选项值
 *    @props  isloading 控制确定按钮loading效果
 *    @props  listArr 编码类型列表数据
 * @Date: 2019-05-13 16:38:40 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-15 11:29:47
 */

<template>
  <el-dialog
    class="custom-dialog auto-num-dialog"
    title="自定义规则"
    :visible.sync="centerDialogVisible"
    :modal-append-to-body="false"
    @close="emitEvent('closeDialog')"
    size="tiny">
    <div class="custom-rules-dialog">
      <div class="edit-color text-center">
        <div class="color-table">
          <div class="beseem-wrap" v-if="showBeseemSelect">
            <span class="beseem-text">适用选项</span>
            <el-select
              class="beseem-select"
              v-model="beseemSelectArr"
              multiple
              placeholder="请选择">
              <el-option
                v-for="item in selectData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="color-table-title">
            <div class="color-title-name title-bg title-order">顺序</div>
            <div class="color-title-name title-bg title-code-type">编码类型</div>
            <div class="color-title-name title-bg title-child-setting">子配置</div>
            <div class="color-title-name title-bg title-operation">操作</div>
          </div>
          <div class="color-table-scroll">
            <draggable v-model="attrs" @update="updateInfo">
              <transition-group>
                <div
                  v-for="(item,index) of attrs"
                  :key="'CustomRule'+index"
                  class="color-table-title"
                  style="margin-top:-1px;">
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-order">
                    {{index+1}}
                  </div>
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-code-type inputBox">
                    <el-select
                      v-model="item.attrType"
                      placeholder="编码类型"
                      @change="handlerChangeAttrType($event,index)"
                      style="border:0;">
                      <el-option
                        v-for="(value, key) in listArr"
                        :label="value.attrName"
                        :value="value.id"
                        :key="key">
                      </el-option>
                    </el-select>
                  </div>
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name title-child-setting inputBox">
                    <el-input
                      v-if="item.attrType==0"
                      v-model="item.value"
                      placeholder="请输入固定编码"
                      style="border:0;"
                      :key="index+'1'"
                      @input="checkInput(item.value, item.type, index)">
                    </el-input>
                    <el-input
                      v-else-if="item.attrType==1"
                      v-model="item.value"
                      placeholder="请输入位数"
                      style="border:0;"
                      :key="index+'1'"
                      maxlength="1"
                      max="8"
                      @input="checkInput(item.value, item.type, index)">
                    </el-input>
                    <span v-if="item.attrType==1 && item.value" class="child-setting-unit">位</span>
                  </div>
                  <div class="color-title-name title-operation color-opera handle">
                    <div class="color-sort draggable">
                      <icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序
                    </div>
                    <div class="color-sort" @click="emitEvent('deleteRule',index)">
                      <span><icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
          <div class="add-color" @click="emitEvent('addRule',changeType)">+添加</div>
          <el-row>
            <el-col :span="24" class="bottom-btn-wrapper">
              <nf-button class="cancel-commit" @click="emitEvent('closeDialog',changeType)">取消</nf-button>
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
    tableData: [Array, Object],
    visible: Boolean,
    changeType: Number,
    showBeseemSelect: Boolean,
    selectData: Array,
    selectAttrs: Array,
    isloading: Boolean,
    listArr: Object,
    materialIsEdit: Boolean
  },
  components: {
    draggable
  },
  data() {
    return {
      attrs: this.tableData,
      inputState: [],
      centerDialogVisible: this.visible,
      beseemSelectArr: [],
      attrTypeName: ''
    }
  },
  watch: {
    tableData() {
      this.attrs = this.addAttrToData()
    },
    visible() {
      this.centerDialogVisible = this.visible
    },
    selectAttrs(val) {
      this.beseemSelectArr = val;
    }
  },
  created() {
    this.beseemSelectArr = this.selectAttrs
  },
  methods: {
    /**
     * 分发自定义事件
     */
    emitEvent(eventName, params) {
      this.$emit(eventName, params)
    },
    /**
     * 列表排序
     */
    updateInfo(evt) {
      this.$emit('sort', this.changeType, this.attrs)
    },
    /**
     * 输入框限制
     */
    checkInput(val, type, index) {
      if (type == 0) { //固定编码
        if (val.length == 0 || val.length > 8) {
          this.inputState[index] = false
          this.inputState.splice(0, 0)
          return this.$message({
            type: "error",
            message: '请输入长度为1至8位的数字和大写字母',
            showClose: true,
            duration: this.$globalConfig.elementUI.duration
          })
        } else {
          let reg = /^[A-Z0-9]{0,8}$/
          if (!reg.test(val)) {
            this.inputState[index] = false
            this.inputState.splice(0, 0)
            //this.attrs[index].showIcon = true
            return this.$message({
              type: "error",
              message: '只能是数字和大写字母',
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            })
          }
        }
      } else if (type == 1) {
        let reg = /[1-8]/
        if (!reg.test(val)) {
          //this.attrs[index].showIcon = true
          this.inputState[index] = false
          this.inputState.splice(0, 0)
          return this.$message({
            type: "error",
            message: '只能输入1至8的数字',
            showClose: true,
            duration: this.$globalConfig.elementUI.duration
          })
        }
      }
      this.inputState[index] = true
      this.inputState.splice(0, 0)
    },
    /**
     * 确定提交自定义规则
     */
    checkCommitData() {
      const canCommit = this.attrs.filter(item => {
        return Number(item.attrType) === 1
      })
      const fixdCommit = this.attrs.filter(item => {
        return Number(item.attrType) === 0
      })

      if (canCommit.length <= 0) {
        return this.$message({
          type: "error",
          message: '至少包含一个流水号选项',
          showClose: true,
          duration: this.$globalConfig.elementUI.duration
        })

      }

      if (canCommit) {
        for (let i = 0; i < canCommit.length; i++) {
          // console.log('固定值', canCommit[i].value)
          if (!canCommit[i].value) {
            return this.$message({
              type: "error",
              message: '类型为固定值或流水号的子配置不能为空',
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            })
          }
        }
      }

      if (fixdCommit) {
        for (let i = 0; i < fixdCommit.length; i++) {
          if (!fixdCommit[i].value) {
            return this.$message({
              type: "error",
              message: '类型为固定值或流水号的子配置不能为空',
              showClose: true,
              duration: this.$globalConfig.elementUI.duration
            })
          }

        }
      }

      if (this.beseemSelectArr.length <= 0) {
        return this.$message.error('请至少选择一个适用选项')
      }

      const beseemSelectList = this.selectData.filter(item => {
        return this.beseemSelectArr.includes(item.id)
      })
      // console.log('适用选项信息', beseemSelectList)
      this.$emit('sureCommit', this.attrs, beseemSelectList)
    },
    /**
     * 编码类型change
     */
    handlerChangeAttrType(value, index) {
      const listInfo = this.listArr.filter(item => {
        return item.id === value
      })[0]
      this.attrs[index].name = listInfo.attrName
      this.attrs[index].commonAttrFieldId = listInfo.id
    },
    addAttrToData() {
      for (let index in this.attrs) {
        if (this.attrs[index].type == 0 || this.attrs[index].type == 1) {
          this.inputState[index] = false
          this.inputState.splice(0, 0)
        }
      }
      return this.tableData
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

.auto-num-dialog .el-dialog--tiny {
  width: auto;
}

.custom-dialog.auto-num-dialog .el-dialog__body {
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
