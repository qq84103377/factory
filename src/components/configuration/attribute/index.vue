/*
 * @Author: kuhn 
 * @Description: 全局设置 - 资料档案配置
 * @Date: 2019-05-08 09:43:47 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-21 15:46:10
 */

<template>
  <div class="attribute_List">
    <!--物料档案配置标题-->
    <section class="inventory" v-if="isTitle">
      <el-row
        class="inventory-header"
        type="flex"
        justify="space-between"
        align="middle">
        <div class="inventory-tab">
          <div class="inventory-tab__pane" :class="{'active': $route.path === '/attribute'}">
            物料分类配置
          </div>
        </div>
      </el-row>
    </section>
    <!--数据表格-->
    <attribute-table ref="attrIbuteTable" @editor="editor" :newModify='newModify' @handlerPaginatTotal="handlerPaginatTotal" :pageSize="pageSize" :pageNum="pageNum"></attribute-table>
    <!--+添加物料分类-->
    <!-- <div class="attribute_buttom" @click="add_click">
      <span>+添加物料分类</span>
    </div> -->
    <div class="attribute_buttom">
      <nf-button @click="add_click" class="button">+添加物料分类</nf-button>
      <el-pagination
        class="pagin"
        :page-size="pageSize"
        :current-page="pageNum"
        layout="prev, pager, next"
        @current-change="handlerCurrentChange"
        :total="total">
      </el-pagination>
    </div>
    <!--编辑与新建分类-->
    <attribute-popup
      :title="title"
      v-if="isShow"
      :id="id"
      :no="no"
      :name="name"
      @cancel="cancel">
    </attribute-popup>
  </div>
</template>

<script>
import attributeTable from './attribute-table';
import attributePopup from './attribute-Popup';

export default {
  name: "index",

  props: {
    // 本厂设置 - 规格属性库 - 物料属性库 引用参数
    isTitle: {
      defalut: true
    }
  },

  data() {
    return {
      title: '', //传值给子组件标题
      isShow: false, //弹窗显示与隐藏
      newModify: false, //判断新增重新渲染数据
      id: '', //修改分类的id
      no: '', //分类号
      name: '', //分类名称
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  },
  components: {
    attributeTable,
    attributePopup
  },
  methods: {
    // 添加物料分类弹窗
    add_click() {
      this.no = ""
      this.name = ""
      this.id = ""
      this.title = '添加分类'
      this.isShow = true
    },
    // 关闭弹窗
    cancel(val) {
      this.newModify = !this.newModify
      this.isShow = val
    },
    // 编辑接收
    editor(val, id, no, name) {
      this.no = no
      this.name = name
      this.id = id
      this.title = val
      this.isShow = true
    },
    handlerCurrentChange(current){
      this.pageNum = current
    },
    handlerPaginatTotal(total){
      this.total = total || 0
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute_List {
  font-size: 12px;

  .inventory {
    width: 100%;
    margin-bottom: 12px;

    .inventory-header {
      line-height: 50px;
      border-bottom: 1px solid #e0e6ed;

      .inventory-tab {
        flex: 1;
        margin-bottom: -1px;

        &__pane {
          display: inline-block;
          padding: 0 16px;
          font-size: 20px;
          color: #a2abb8;
          cursor: pointer;
        }

        .active {
          border-bottom: 4px solid #ffa914;
          color: #3b3b3b;
        }
      }
    }
  }

  // .attribute_buttom {
  //   color: #FFA914;
  //   height: 36px;
  //   line-height: 36px;
  //   font-size: 14px;
  //   background: rgba(255, 255, 255, 1);
  //   border-radius: 2px;
  //   text-align: center;
  //   border: 1px solid rgba(220, 224, 230, 1);
  //   cursor: pointer;
  // }

  .attribute_buttom {
    height: 36px;

    .button {
      float: left;
      color: #FFA914;
      font-size: 14px;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 1px solid rgba(220, 224, 230, 1);
    }

    .pagin {
      float: right;
    }
  }
}
</style>
