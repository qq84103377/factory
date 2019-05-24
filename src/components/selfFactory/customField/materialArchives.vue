/*
 * @Author: kuhn 
 * @Description: 自定义字段 - 物料档案
 * @Date: 2019-05-07 14:54:52 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-09 10:25:00
 */

<template>
  <div>
    <div class="yellow-border-title">
      <span class="title">物料档案</span>
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
          <!-- 选项总数 -->
          <td>
            <span>{{['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)&&!item.isAdd?(item.options?item.options.length:0):'-'}}</span>
          </td>
          <!-- 操作栏 -->
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
          </td>
        </tr>
        <tr>
          <td colspan="7">
            <div @click="addCustomField" class="orange pointer add-btn">+添加自定义字段</div>
          </td>
        </tr>
      </draggable>
    </table>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  sortCustomField,
  getCustomFieldList,
  addCustomField,
  updateCustomFieldName
} from "@/api/selfFactory.js";
export default {
  name: "materialArchives",

  components: {
    draggable
  },

  props: {},

  data() {
    return {
      tableData: [],
      // 字段类型
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
        }
      ]
    }
  },

  created() {
    this.getCustomFieldList()
  },

  mounted() {},

  activited() {},

  update() {},

  beforeRouteUpdate() {},

  methods: {
    /**
     * 获取物料档案数据
     */
    getCustomFieldList() {
      let params = {
        module: 'MATERIALS',
        bossUnitId: this.bossUnitId
      }
      this.loading = true
      getCustomFieldList(params).then(res => {
        // console.log('物料档案')
        // console.log(res)
        if (res.data.code === 0) {
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
    /**
     * 编辑名称
     */
    editCustomField(item) {
      item.isEdit = true
    },
    /**
     * 取消编辑
     */
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
    /**
     * 确定编辑
     */
    confirmEdit(editItem, editIndex) {
      // 字段名称不能为空
      if (!editItem.editCustomFieldName.length) {
        this.$message.error('请输入字段名称')
        editItem.nameWarn = true
        return
      }
      // 字段类型必选
      if (editItem.isAdd && !editItem.customFieldType.length) {
        this.$message.error('请选择字段类型')
        editItem.typeWarn = true
        return
      }
      let isEdit = editItem.customFieldId ? true : false
      if (!isEdit) {
        this.addDIYMaterialField(editItem) // 新增
      } else {
        this.editDIYMaterialField(editItem) // 编辑
      }
    },
    /**
     * 新增自定义字段
     */
    addDIYMaterialField(editItem) {
      // return new Promise((resolve,reject)=>{
      editItem.isSubmitting = true
      const params = {
        bossUnitId: this.bossUnitId,
        module: 'MATERIALS',
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
      // })
    },
    /**
     * 编辑自定义字段
     */
    editDIYMaterialField(editItem) {
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
    },
    /**
     * 弹出管理属性弹窗
     */
    showAttr(item, index) {
      this.$emit('materialManageChange', item, index)
    },
    /**
     * 删除弹窗
     */
    deleteCustomField(item, index) {
      if (['SINGLE_SELECT', 'MULTI_SELECT'].includes(item.customFieldType) && item.used) {
        return this.$message.error('【' + item.customFieldName + '】字段已被引用不可删除')
      } else {
        return this.$emit('materialDelete', item, index)
      }
    },
    /**
     * 删除物料档案
     */
    deleteMaterialArchives(index) {
      this.tableData.splice(index, 1)
    },
    /**
     * 新增自定义字段
     */
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
    /**
     * 排序
     */
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
    }
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

  computed: {
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    }
  },

  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
