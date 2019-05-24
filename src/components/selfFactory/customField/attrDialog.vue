<template>
  <div class="custom-field-attr-dialog">
    <page-title class="header" :title="customField.customFieldName">
      <nf-button @click="closed">收起
        <icon style="width:12px;height:8px;" type="icon-packup"></icon>
      </nf-button>
    </page-title>
    <div class="body">
      <table class="draggable-table">
        <thead>
          <tr>
            <th style="width: 250px">编号</th>
            <th style="width: 250px">名称</th>
            <th colspan="3" style="width: 260px">操作</th>
          </tr>
        </thead>
        <draggable
          element="tbody"
          v-model="tableData"
          :options="{handle:'.draggable'}"
          @update="sortCustomField">
          <tr v-for="(item,index) in tableData" :key="index">
            <!--编号-->
            <td :class="{'edit-td':item.isEdit}">
              <el-input
                :maxlength="16"
                v-if="item.isEdit"
                type="text"
                v-model.trim="item.editOptionCode"
                placeholder="不填则自动生成"></el-input>
              <div v-else>{{item.optionCode}}</div>
            </td>
            <!--名称-->
            <td :class="{'edit-td':item.isEdit}">
              <el-input
                :class="{'warn-border':item.nameWarn}"
                v-focus="item.nameWarn"
                :maxlength="64"
                v-if="item.isEdit"
                type="text"
                v-model.trim="item.editOptionName"
                placeholder="请输入选项名称"></el-input>
              <div v-else>{{item.optionName}}</div>
            </td>
            <td v-if="!item.isEdit" style="width: 55px">
              <div v-show="!item.isEdit" class="draggable pointer">
                <icon class="action-icon" type="icon-liebiaocaozuo_tuodong"></icon>
                <span>排序</span>
              </div>
            </td>
            <td v-if="!item.isEdit" style="width: 75px">
              <div @click="editRow(item,index)" class="blue pointer">
                <icon class="action-icon" type="icon-edit1"></icon>
                <span>编辑</span>
              </div>
            </td>
            <td v-if="!item.isEdit" style="width: 55px">
              <div
                v-if="!item.used"
                @click="deleteRow(item,index)"
                class="pointer">
                <icon class="action-icon" type="icon-delete"></icon>
                <span>删除</span>
              </div>
            </td>
            <td
              colspan="3"
              v-if="item.isEdit"
              class="text-center">
              <span @click="cancelEdit(item,index)"  class="pointer ">取消</span>
              <el-button
                :loading="item.isSubmitting"
                style="color: #FFA914;font-size: 12px;padding-left: 15px"
                @click="confirmEdit(item,index)"
                type="text">确定</el-button>
            </td>
          </tr>
          <tr>
            <td colspan="7">
              <div @click="addRow" class="orange pointer add-btn">+添加</div>
            </td>
          </tr>
        </draggable>
      </table>
    </div>

    <!--删除弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog"
      :visible.sync="deleteDialog.visible"
      :show-close="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">{{deleteDialog.tipText}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog.visible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  addCustomFieldOption,
  updateCustomFieldOption,
  deleteCustomFieldOption,
  sortCustomFieldOption
} from '@/api/selfFactory.js'
export default {
  props: ['visible', 'customField'],
  data() {
    return {
      tableData: [],
      loading: false,
      isSubmitting: false,
      currentItem: {}, //当前正在操作的item
      currentIndex: '', //当前正在操作的item的index
      deleteDialog: {
        visible: false,
        tipText: '是否确认删除当前选项”',
      },
    }
  },
  watch: {
    visible(val) {
      if (val) {
        let data = JSON.parse(JSON.stringify(this.customField.options))
        data.forEach(item => {
          item.editOptionCode = item.optionCode
          item.editOptionName = item.optionName
          item.isSubmitting = false
          item.isEdit = false
          item.nameWarn = false
        })
        this.tableData = data
      }
    }
  },
  components: {
    draggable
  },
  computed: {
    unitId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    },
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    },
  },
  //自动获取焦点，对input进行DOM操作，实际上；
  directives: {
    focus: {
      inserted: (el, {
        value
      }) => {
        if (value) {
          //由于是饿了么的el-input，需要拿到父元素下面的input
          el.firstElementChild.focus();
        }
      }
    },
  },
  methods: {
    // 收起
    closed() {
      this.$emit('update:visible', false)
    },
    // 添加行
    addRow() {
      this.tableData.push({
        optionId: '',
        optionCode: '',
        editOptionCode: '',
        optionName: '',
        editOptionName: '',
        isEdit: true,
        nameWarn: false, //自定义字段项名称红框控制
      })
    },
    // 点击删除行
    deleteRow(item, index) {
      this.currentItem = item
      this.currentIndex = index
      this.deleteDialog.visible = true
    },
    // 确定删除行
    confirmDelete() {
      this.isSubmitting = true
      let params = {
        optionId: this.currentItem.optionId
      }
      deleteCustomFieldOption(params).then(res => {
        this.isSubmitting = false
        if (res.data.code == 0) {
          this.$message.success('删除成功')
          this.tableData.splice(this.currentIndex, 1)
          this.$emit('updateOptions', JSON.parse(JSON.stringify(this.tableData)))
          this.deleteDialog.visible = false

        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 编辑行
    editRow(item, index) {
      item.isEdit = true
    },
    // 取消编辑
    cancelEdit(item, index) {
      if (!item.optionId) {
        this.tableData.splice(index, 1)
      } else {
        item.editOptionCode = item.optionCode
        item.editOptionName = item.optionName
        item.nameWarn = false
        item.isEdit = false
      }
    },
    // 确定编辑
    confirmEdit(editItem, editIndex) {
      if (!editItem.editOptionName.length) {
        this.$message.error('请输入选项名称')
        editItem.nameWarn = true
        return
      }
      let isEdit = editItem.optionId ? true : false
      let params = {
        customFieldId: this.customField.customFieldId,
        optionCode: editItem.editOptionCode,
        optionName: editItem.editOptionName,
      }
      let api = addCustomFieldOption

      if (isEdit) {
        params.id = editItem.optionId
        api = updateCustomFieldOption
      }
      editItem.isSubmitting = true
      api(params).then(res => {
        editItem.isSubmitting = false
        if (res.data.code == 0) {
          this.$message.success(isEdit ? '编辑成功' : '新建成功')
          editItem.optionId = res.data.data.id
          editItem.optionCode = res.data.data.optionCode
          editItem.optionName = res.data.data.optionName
          editItem.isEdit = false
          this.$emit('updateOptions', JSON.parse(JSON.stringify(this.tableData)))
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 自定义字段排序
    sortCustomField() {
      let ids = []
      this.tableData.forEach(item => {
        if (item.optionId) {
          ids.push(item.optionId)
        }
      })
      sortCustomFieldOption({
        ids
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.success('移动成功')
        }
      })
    }

  },
  created() {}
}
</script>

<style lang="scss" scoped>
.custom-field-attr-dialog {
  position: fixed;
  top: 0;
  right: 0;
  width: 850px !important;
  height: 100%;
  overflow-x: hidden;
  background-color: #fff;
  z-index: 3000;

  .header {
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid #e0e6ed;
  }

  .body {
    padding: 24px;

    .draggable-table {
      width: 100%;

      th,
      td {
        text-align: center;
      }
    }
  }
}
</style><style lang="scss">
.draggable-table {
  font-size: 12px;
  background-color: #fff;
  border-left: 1px solid rgb(223, 228, 236);
  border-top: 1px solid rgb(223, 228, 236);

  .action-icon {
    width: 12px !important;
    height: 12px !important;
    margin: -2px 4px 0 0;
  }

  .add-btn {
    padding: 3px 0;
  }

  th,
  td {
    padding: 0 10px;
    text-align: left;

    border-right: 1px solid rgb(223, 228, 236);
    border-bottom: 1px solid rgb(223, 228, 236);
  }

  th {
    color: #97a5bd;
    background: rgb(238, 240, 246);
    line-height: 30px;
  }

  td {
    line-height: 30px;

    &.edit-td {
      padding: 0;
      background-color: #FFF9ED;

      .el-input__inner,
      .el-textarea__inner {
        font-size: 12px;
        background: transparent;
        border: none;
        text-align: center;
      }

      .warn-border {
        border: 1px solid red;
      }
    }
  }

}
</style>
