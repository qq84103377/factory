/*
 * @Author: kuhn 
 * @Description: 自定义字段
 * @Date: 2019-05-08 15:44:03 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-20 15:18:48
 */

<template>
  <div v-loading="loading">
    <div class="custom-field-index box-shadow pd24" style="min-height: 100px">
      <div class="yellow-border-title">
        <span class="title">商品档案/设计档案</span>
      </div>
      <table class="draggable-table mgt16">
        <thead>
          <tr>
            <th style="width: 160px">字段名称</th>
            <th style="width: 160px">字段类型</th>
            <th style="width: 80px">选项总数</th>
            <th colspan="4" style="width: 260px">操作</th>
          </tr>
        </thead>
        <draggable
          element="tbody"
          v-model="tableData"
          :options="{handle:'.draggable'}"
          @update="sortCustomField">
          <tr v-for="(item,index) in tableData" :key="index">
            <!--字段名称-->
            <td :class="{'edit-td':item.isAdd||item.isEdit}">
              <el-input
                :class="{'warn-border':item.nameWarn}"
                v-focus="item.nameWarn"
                :maxlength="16"
                v-if="item.isEdit || item.isAdd"
                type="text"
                v-model.trim="item.editCustomFieldName"
                placeholder="请输入字段名称"></el-input>
              <div v-else>{{ item.customFieldName }}</div>
            </td>
            <!--字段类型-->
            <td :class="{'edit-td':item.isAdd}">
              <el-select
                :class="{'warn-border':item.typeWarn}"
                v-if="item.isAdd"
                v-focus="item.typeWarn"
                v-model="item.customFieldType"
                placeholder="请选择字段类型"
                clearable>
                <el-option
                  v-for="typeItem in fieldTypeList"
                  :key="typeItem.type"
                  :label="typeItem.label"
                  :value="typeItem.type">
                </el-option>
              </el-select>
              <div v-else>
                {{item.customFieldType | changeCustomFieldType}}
                <span class="gray" v-show="item.customFieldType =='DECIMAL'">（2位小数）</span>
                <span class="gray" v-show="item.customFieldType =='TEXT'">（100字内）</span>
              </div>
            </td>
            <!--选项总数-->
            <td>
              <span>
                            {{['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)&&!item.isAdd?
                            (item.options?item.options.length:0):'-'}}
                        </span>
            </td>
            <td v-if="!item.isAdd&&!item.isEdit" style="width: 55px">
              <div class="draggable pointer">
                <icon class="action-icon" type="icon-liebiaocaozuo_tuodong"></icon>
                <span>排序</span>
              </div>
            </td>
            <td v-if="!item.isAdd&&!item.isEdit" style="width: 75px">
              <div @click="editCustomField(item)" class="blue pointer">
                <icon class="action-icon" type="icon-edit1"></icon>
                <span>编辑名称</span>
              </div>
            </td>
            <td v-if="!item.isAdd&&!item.isEdit" style="width: 75px">
              <div
                v-show="['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)"
                @click="showAttr(item,index)"
                class="blue pointer">
                <icon class="action-icon" type="icon-configuration"></icon>
                <span>管理属性</span>
              </div>
            </td>
            <td v-if="!item.isAdd&&!item.isEdit" style="width: 55px">
              <div @click="deleteCustomField(item,index)" class="pointer">
                <icon class="action-icon" type="icon-delete"></icon>
                <span>删除</span>
              </div>
            </td>
            <td
              colspan="4"
              v-if="item.isAdd || item.isEdit"
              class="text-center">
              <span @click="cancelEdit(item,index)"  class="pointer ">取消</span>
              <el-button
                :loading="item.isSubmitting"
                style="color: #FFA914;font-size: 12px;padding-left: 15px"
                @click="confirmEdit(item,index)"
                type="text">确定</el-button>
              <!--<span @click="confirmEdit(item,index)" class="orange pointer pdl15">确定</span>-->
            </td>
          </tr>
          <tr>
            <td colspan="7">
              <div @click="addCustomField" class="orange pointer add-btn">+添加自定义字段</div>
            </td>
          </tr>
        </draggable>
      </table>
      <!-- 右侧弹窗 -->
      <transition name="right-move">
        <!-- 属性右侧滑窗 -->
        <!--updateOptions:新增、编辑、删除成功后更新options列表-->
        <attr-dialog
          v-show="attrDialog.visible"
          :visible.sync="attrDialog.visible"
          :customField="currentItem"
          @updateOptions="updateOptions"></attr-dialog>
      </transition>
      <transition name="opcity">
        <div
          class="cover"
          @click="attrDialog.visible = false"
          v-show="attrDialog.visible"></div>
      </transition>
      <!--删除弹窗-->
      <el-dialog
        class="custom-dialog tip-dialog delete-dialog"
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
    <!-- 物料档案 -->
    <div class="custom-field-index box-shadow pd24 mgt8" style="min-height: 100px">
      <materialArchives
        ref="material"
        @materialManageChange="materialManageChange"
        @materialDelete="materialDelete" />
    </div>
  </div>

</template>

<script>
import draggable from "vuedraggable";
import {
  getCustomFieldList,
  addCustomField,
  updateCustomFieldName,
  addCustomFieldOption,
  deleteCustomField,
  sortCustomField
} from '@/api/selfFactory.js'
import AttrDialog from "@/components/selfFactory/customField/attrDialog.vue";
import materialArchives from './materialArchives.vue' // 物料档案
export default {
  data() {
    return {
      tableData: [],
      attrShow: false,
      loading: false,
      isSubmitting: false,
      fieldTypeList: [{
          label: '单选属性',
          type: 'SINGLE_SELECT'
        },
        {
          label: '多选属性',
          type: 'MULTI_SELECT'
        },
        {
          label: '整数型',
          type: 'INTEGER'
        },
        {
          label: '小数型',
          type: 'DECIMAL'
        },
        {
          label: '单行文本',
          type: 'TEXT'
        },
      ],
      currentItem: {}, //当前正在操作的item
      currentIndex: '', //当前正在操作的item的index
      deleteDialog: {
        visible: false,
        tipText: '',
      },
      attrDialog: {
        visible: false
      },
      deleteType: 'goods'
    }
  },
  components: {
    AttrDialog,
    draggable,
    materialArchives
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
  filters: {
    changeCustomFieldType(type) {
      let fieldTypeList = [{
          label: '单选属性',
          type: 'SINGLE_SELECT'
        },
        {
          label: '多选属性',
          type: 'MULTI_SELECT'
        },
        {
          label: '整数型',
          type: 'INTEGER'
        },
        {
          label: '小数型',
          type: 'DECIMAL'
        },
        {
          label: '单行文本',
          type: 'TEXT'
        },
      ]
      let typeItem = fieldTypeList.find(item => item.type == type)

      return typeItem ? typeItem.label : ''
    }
  },
  methods: {
    // 添加行
    addCustomField() {
      this.tableData.push({
        customFieldId: '',
        customFieldName: '',
        editCustomFieldName: '',
        customFieldType: '',
        isSubmitting: false,
        isEdit: false,
        isAdd: true,
        nameWarn: false, //自定义字段名称红框控制
        typeWarn: false //自定义字段类型红框控制
      })
    },
    // 点击删除行
    deleteCustomField(item, index) {
      this.deleteType = 'goods'
      if (['SINGLE_SELECT', 'MULTI_SELECT'].includes(item.customFieldType) && item.used) {
        this.$message.error('【' + item.customFieldName + '】字段已被引用不可删除')
        return
      } else {
        this.deleteDialog.tipText = ['SINGLE_SELECT', 'MULTI_SELECT'].includes(item.customFieldType) ?
          '系统将删除该字段及其选项，操作不可撤销，是否确定删除?' : '系统将删除该字段，操作不可撤销，是否确定删除?'
        this.currentItem = item
        this.currentIndex = index
        this.deleteDialog.visible = true
      }
    },
    // 确定删除行
    confirmDelete() {
      switch (this.deleteType) {
        case 'goods':
          return this.goodsArchivesDelete()
        case 'material':
          return this.materialArchivesDelete()
      }
    },
    /**
     * 商品档案删除
     */
    goodsArchivesDelete() {
      this.isSubmitting = true
      let params = {
        customFieldId: this.currentItem.customFieldId
      }
      deleteCustomField(params).then(res => {
        this.isSubmitting = false
        if (res.data.code == 0) {
          this.$message.success('删除成功')
          this.tableData.splice(this.currentIndex, 1)
          this.deleteDialog.visible = false
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    /**
     * 物料档案删除
     */
    materialArchivesDelete() {
      this.isSubmitting = true
      let params = {
        customFieldId: this.currentItem.customFieldId
      }
      deleteCustomField(params).then(res => {
        this.isSubmitting = false
        if (res.data.code == 0) {
          this.$message.success('删除成功')
          this.deleteDialog.visible = false
          this.$refs.material.deleteMaterialArchives(this.currentIndex)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 编辑行
    editCustomField(item) {
      item.isEdit = true
    },
    // 取消编辑
    cancelEdit(item, index) {
      if (item.isAdd) {
        this.tableData.splice(index, 1)
      } else {
        item.editCustomFieldName = item.customFieldName
        item.nameWarn = false
        item.typeWarn = false
        item.isEdit = false
      }
    },
    // 确定编辑
    confirmEdit(editItem, editIndex) {
      if (!editItem.editCustomFieldName.length) {
        this.$message.error('请输入字段名称')
        editItem.nameWarn = true
        return
      }
      if (editItem.isAdd && !editItem.customFieldType.length) {
        this.$message.error('请选择字段类型')
        editItem.typeWarn = true
        return
      }
      editItem.isSubmitting = true
      let isEdit = editItem.customFieldId ? true : false
      if (isEdit) {
        let params = {
          customFieldId: editItem.customFieldId,
          name: editItem.editCustomFieldName
        }
        updateCustomFieldName(params).then(res => {
          editItem.isSubmitting = false
          if (res.data.code == 0) {
            this.$message.success('编辑成功')
            editItem.customFieldName = editItem.editCustomFieldName
            editItem.isEdit = false
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        let params = {
          bossUnitId: this.bossUnitId,
          module: 'STYLE',
          customFieldName: editItem.editCustomFieldName,
          customFieldType: editItem.customFieldType
        }
        addCustomField(params).then(res => {
          editItem.isSubmitting = false
          if (res.data.code == 0) {
            this.$message.success('新建成功')
            editItem.customFieldId = res.data.data.customFieldId
            editItem.customFieldName = res.data.data.customFieldName
            editItem.isAdd = false
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }

    },
    // 弹出管理属性弹窗
    showAttr(item, index) {
      // console.log('商品档案',item,index)
      if((item.customFieldType==='MULTI_SELECT'||item.customFieldType==='SINGLE_SELECT')&&!item.options){
        item.options = []
      }
      this.currentItem = item
      this.currentIndex = index
      this.attrDialog.visible = true
    },
    getCustomFieldList() {
      let params = {
        module: 'STYLE',
        bossUnitId: this.bossUnitId
      }
      this.loading = true
      getCustomFieldList(params).then(res => {
        if (res.data.code == 0) {
          this.loading = false
          res.data.data.forEach(item => {
            item.isEdit = false
            item.isSubmitting = false
            item.isAdd = false
            item.editCustomFieldName = item.customFieldName
            item.nameWarn = false
            item.typeWarn = false
          })
          this.tableData = res.data.data
        }
      })
    },
    // 对自定义字段选项进行新增、编辑、删除操作，成功后更新options
    updateOptions(options) {
      this.currentItem.options = options
    },
    // 自定义字段排序
    sortCustomField() {
      let ids = []
      this.tableData.forEach(item => {
        if (item.customFieldId) {
          ids.push(item.customFieldId)
        }
      })
      sortCustomField({
        ids
      }).then(res => {
        if (res.data.code == 0) {
          this.$message.success('移动成功')
        }
      })
    },
    /**
     * 物料档案-弹出管理属性弹框
     */
    materialManageChange(item, index) {
      if((item.customFieldType==='MULTI_SELECT'||item.customFieldType==='SINGLE_SELECT')&&!item.options){
        item.options = []
      }
      this.currentItem = item
      this.currentIndex = index
      this.attrDialog.visible = true
    },
    /**
     * 物料档案-弹出确认删除弹窗
     */
    materialDelete(item, index) {
      this.deleteType = 'material'
      this.deleteDialog.tipText = ['SINGLE_SELECT', 'MULTI_SELECT'].includes(item.customFieldType) ?
        '系统将删除该字段及其选项，操作不可撤销，是否确定删除?' : '系统将删除该字段，操作不可撤销，是否确定删除?'
      this.currentItem = item
      this.currentIndex = index
      this.deleteDialog.visible = true
    }
  },
  created() {
    this.getCustomFieldList()
  }
}
</script>

<style lang="scss">
.custom-field-index {
  .delete-dialog .el-dialog--tiny {
    width: 420px !important;
  }
}

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
    background: #f5f7fa;
    line-height: 30px;
  }

  td {
    &.text-center {
      text-align: center;
    }

    line-height: 30px;

    &.edit-td {
      padding: 0;
      background-color: #FFF9ED;

      .el-input__inner,
      .el-textarea__inner {
        font-size: 12px;
        background: transparent;
        border: none;
      }

      .warn-border {
        border: 1px solid red;
      }
    }
  }

}
</style>
