<template>
  <div class="attribute_Table_Table_List">
    <div
      v-for="(v,index) in tableData1"
      :vlaue="v.id"
      :key="index"
      class="attribute_Table_content">
      <div class="attribute_Table_top">
        <div class="attribute_Table_left">
          <span>{{v.no}}-{{v.name}}</span>
          <icon type="icon-edit" @click="editor(v.id,v.no,v.name)"></icon>
        </div>
        <div class="attribute_Table_right">
          <span>数量:</span>
          <span>{{v.commonMaterialsKindsAttrsList?v.commonMaterialsKindsAttrsList.length:0}}</span>
        </div>
        <div class="attribute-del-btn" @click="showDelDialog(v.id)">删除分类</div>
      </div>
      <div class="attribute_Table_bottom">
        <div class="isTable">
          <!--表格标题-->
          <div class="color-table-title color-table-title-th">
            <div class="color-title-name color-title-name-name title-bg">
              <span>属性名称</span>
            </div>
            <div class="color-title-name color-title-name-type title-bg">
              <span>属性类型</span>
            </div>
            <div class="color-title-name color-title-name-options title-bg">
              <span>属性选项</span>

            </div>
            <div class="color-title-name color-title-name-operation title-bg " :class="{'color-title-head-operation':v.tag==1}">
              <span>操作</span>
            </div>
          </div>
          <!--表格内容-->
          <div class="color-table-scroll" v-if="v.commonMaterialsKindsAttrsList">
            <draggable
              v-model="v.commonMaterialsKindsAttrsList"
              :options="{handle:'.draggable'}"
              @update="datadragEnd(index)">
              <transition-group>
                <div
                  v-for="(item,i) of v.commonMaterialsKindsAttrsList"
                  :key="item.commonAttrstoreName?item.commonAttrstoreName:item.name+i"
                  class="color-table-title"
                  style="margin-top:-1px;">
                  <!--图层属性名称-->
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name color-title-name-name">
                    <span>{{item.commonAttrstoreName?item.commonAttrstoreName:item.name}}</span>
                  </div>
                  <!--属性类型-->
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name color-title-name-type">
                    <span>{{item.type}}</span>
                  </div>
                  <!--属性选项-->
                  <div style="border-right:1px solid #e6eaf0;" class="color-title-name color-title-name-options">
                    <span v-for=" (v,i) in item.commonAttrstoreOptionsList" :title="v.name" :key="i"><i v-if="i != 0">、</i>{{v.name}}</span>
                  </div>
                  <!--操作-->
                  <div class="color-title-name color-opera color-title-name-operation handle" v-if="item.isShow">
                    <!--排序-->
                    <div class="color-sort draggable">
                      <icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>
                      排序
                    </div>
                    <!--编辑 customField true:自定义字段 false:属性字段-->
                    <div
                      @click="editMaterialSpec(item,item.commonAttrstoreName?item.commonAttrstoreName:item.name,index,i)"
                      class="color-sort"
                      v-if="item.type!='单行文本' && item.type!='单行数值' && !item.customField">
                      <icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>
                      编辑
                    </div>
                    <!--单行文本不能编辑-->
                    <div class="color-sort" v-if="item.type=='单行文本' || item.type=='单行数值' || item.customField">
                      <span>-</span>
                    </div>
                    <!--删除-->
                    <div @click="delX(item,index)" class="color-sort">
                      <span><icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>移除</span>
                    </div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
          <el-popover
            v-model="v.popoverShow"
            placement="top-start"
            width="700"
            @show="addAttributes(index,v.commonMaterialsKindsAttrsList)"
            trigger="click">
            <!--添加属性-->
            <div class="add-color" slot="reference">
              <el-button> +添加属性</el-button>
            </div>
            <div class="add-color-button" style="padding: 10px;padding-top: 0;text-align: right;">
              <el-button @click="v.popoverShow = false">取消</el-button>
              <el-button @click="adddetermine(v.id,v.popoverShow)">确定</el-button>
            </div>
            <el-table
              :class="{}"
              ref="multipleTable"
              :data="tableData3"
              border
              max-height="300"
              tooltip-effect="dark"
              style="width: 100%;display: block;"
              @select="handleSelectionChange"
              @select-all="handleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <!--属性名称-->
              <el-table-column
                prop="name"
                label="属性名称"
                width="180">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.name}}</span>
                  </div>
                </template>
              </el-table-column>

              <!--属性类型-->
              <el-table-column
                prop="type"
                label="属性类型"
                width="180">
                <template slot-scope="scope">
                  <div>
                    <span>{{scope.row.type}}</span>
                  </div>
                </template>
              </el-table-column>
              <!--属性选项-->
              <el-table-column prop="address" label="属性选项">
                <template slot-scope="scope">
                  <div>
                    <span v-for="(item,index) in scope.row.commonAttrstoreOptionsList" :key="index"><i v-if="index != 0">、</i>{{item.name}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 资料配置分页 -->
    <!-- <div class="text-right mgb8">
      <el-pagination
        :page-size="pageSize"
        :current-page="pageNum"
        layout="prev, pager, next"
        @current-change="handlerCurrentChange"
        :total="total">
      </el-pagination>
    </div> -->
    <!--编辑弹窗-->
    <attributelist
      v-if="isShow_click"
      :row_click="row"
      :commonAttrstoreId_click='commonAttrstoreId'
      :dialogForm="isShow_click"
      @isShow_click="isShowClick"
      :title="title"
      :falg="true"
      :material_index="material_index"
      :material_i="material_i"
      @addSuccessful="addSuccessful"></attributelist>
    <!--删除弹窗-->
    <el-dialog
      :show-close="false"
      :modal="false"
      :visible.sync="deleVisible"
      size="tiny">
      <div class="dialog-content-wrap">
        <div>
          <icon
            w="80"
            h="80"
            type="icon-gongdan-jiedianjingbao-da"></icon>
          <p class="delete-tip">是否确定移除当前属性？</p>
        </div>
        <div class="handle-delete">
          <nf-button @click="deleVisible = false">取 消</nf-button>
          <nf-button type="warning" @click="delMaterialSpec()">确 定</nf-button>
        </div>
      </div>
    </el-dialog>

    <!--删除分类弹窗-->
    <warn-dialog
      :visible.sync="warnVisible"
      :message="warnMessage"
      type="1"
      @confirm="warnDialogConfirm">
    </warn-dialog>

    <!--删除分类失败弹窗-->
    <el-dialog
      class="delete-kind-fail"
      title="删除分类失败"
      :visible.sync="delKindsVisible"
      size="tiny"
      :before-close="handleClose">
      <div class="kind-content">
        <p>
          <icon
            w="80"
            h="80"
            type="icon-gongdan-jiedianjingbao-da"></icon>
        </p>
        <span>已有物料使用该物料分类配置的属性，删除失败</span>
      </div>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="delKindsVisible = false">确 定</el-button>
            </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  deleteMaterialsKinds
} from "@/api/api";
import {
  listMaterialsKinds, //物料档案配置列表接口
  deleteCommonMaterialsKindsAttrs, //删除物料分类和属性关联
  attributeList, //属性列表接口
  addCommonMaterialsKindsAttrs, //新增物料分类和属性的关联关系
  updateCommonMaterialsKindsAttrsSort, //更新物料分类和属性关联关系的排序
} from "@/api/material";
import draggable from "vuedraggable";
import attributelist from '../archives/attribute-list';
import warnDialog from '@/components/Common/dialog/warnDialog';

export default {
  name: "attribute-tabel",
  data() {
    return {
      isShow_click: false, //编辑弹框显示与隐藏
      deleVisible: false, //删除弹窗
      tableData1: [], //列表数据
      row: [], //传给弹框的值
      commonAttrstoreId: '', //弹框所需要的id
      id: '', //删除物料分类所需的id
      tableData3: [], //添加属性列表数据
      index: '', //保存点击添加属性的索引
      rowLen: 0, //
      rows: [], //保存当前数据有的数据
      title: '', //点击编辑当前名称
      tableData2: [], //点击编辑属性选项数据
      commonAttrstoreIdList: '', //确定保存的所有ID
      material_index: 0, //物料档案配置点击编辑列表index
      material_i: 0, //物料档案配置点击编辑传属性选项index
      popovewIsShow: false,
      warnVisible: false,
      warnMessage: '',
      materialsKindsId: '', //物料分类id
      delKindsVisible: false, //删除分类失败弹窗
    }
  },
  components: {
    draggable,
    attributelist,
    warnDialog,
  },
  created() {
    this.dataList() //获取列表数据
    this.attributeList() //添加属性库列表
  },
  props: ["newModify",'pageSize','pageNum'],
  watch: {
    newModify() {
      this.dataList()
    },
    pageNum(){
      this.dataList()
    }
  },
  methods: {
    showDelDialog(id) {
      this.warnVisible = true;
      this.warnMessage = '是否确定删除此物料分类？';
      this.materialsKindsId = id;
    },
    //确定删除分类
    warnDialogConfirm() {
      let params = {
        id: this.materialsKindsId
      };
      deleteMaterialsKinds(params).then(res => {
        this.warnVisible = false;
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.dataList();
        } else if (res.data.code === 1) {
          this.delKindsVisible = true;
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    // 添加，修改，删除成功，重新渲染
    addSuccessful() {
      this.dataList()
    },
    // 点击确定保存数据
    adddetermine(commonMaterialsKindsId, popoverShow) {
      popoverShow = false
      let params = {
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //用户id
        commonMaterialsKindsId: commonMaterialsKindsId, //物料分类id (必须)
        commonAttrstoreIdsList: this.commonAttrstoreIdList, //属性id数组(必须)

      };
      addCommonMaterialsKindsAttrs(params).then(res => {
        if (res.data.code === 0) {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.dataList().then(() => {
            this.attributeList()
          })
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 点击勾选赋值
    handleSelectionChange(val) {
      var dataList = []
      val.forEach((key, index) => {
        dataList.push(key.id)
      })
      this.commonAttrstoreIdList = dataList
    },
    // 点击添加保存当前的索引
    addAttributes(index, rows) {
      this.rowLen = rows.length;
      this.index = index;
      this.rows = rows;
      for (let i = 0; i < this.rows.length; i++) {
        let rowsId = this.rows[i].commonAttrstoreId;
        for (let j = 0; j < this.tableData3.length; j++) {
          if (this.tableData3[j].id === rowsId) {
            this.tableData3.splice(j, 1)
          }
        }
      }
    },
    // 属性库列表数据
    attributeList() {
      let params = {
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //用户id
        showCustomField: true
      };
      attributeList(params).then(res => {
        if (res.data.code === 0) {
          for (let i = 0; i < res.data.commonAttrstoreList.length; i++) {
            if (res.data.commonAttrstoreList[i].type == 1) {
              res.data.commonAttrstoreList[i].type = "多选菜单"
            } else if (res.data.commonAttrstoreList[i].type == 2) {
              res.data.commonAttrstoreList[i].type = "单选菜单"
            } else if (res.data.commonAttrstoreList[i].type == 3) {
              res.data.commonAttrstoreList[i].type = "单行文本"
            } else if (res.data.commonAttrstoreList[i].type == 4) {
              res.data.commonAttrstoreList[i].type = "单行数值"
            }
            if (res.data.commonAttrstoreList[i].mandatory == 0) {
              res.data.commonAttrstoreList[i].mandatory = false
            } else if (res.data.commonAttrstoreList[i].mandatory == 1) {
              res.data.commonAttrstoreList[i].mandatory = true
            }
          }
          this.tableData3 = res.data.commonAttrstoreList
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 确定删除物料分类
    delMaterialSpec() {
      let params = {
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //用户id
        id: this.id, //物料分类和属性的关联id（必须）
      };
      deleteCommonMaterialsKindsAttrs(params).then(res => {
        if (res.data.code == 0) {
          this.deleVisible = false
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.dataList().then(() => {
            this.attributeList()
          })

        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 物料档案配置列表数据
    dataList() {
      return new Promise((resolve, reject) => {
        let params = {
          userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //用户id
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        };
        listMaterialsKinds(params).then(res => {
          // console.log('列表数据',res.data)
          // this.total = res.data.totalCount || 0
          this.$emit('handlerPaginatTotal',res.data.totalCount)
          let kindsList = res.data.kindsList;
          kindsList.forEach(item => {
            if (!item.commonMaterialsKindsAttrsList) {
              item.commonMaterialsKindsAttrsList = [];
            } else {
              if (item.commonMaterialsKindsAttrsList.length > 15) {
                item.tag = 1
              } else {
                item.tag = 0
              }
            }
            item.commonMaterialsKindsAttrsList.forEach(val => {
              val.isShow = true;
              val.popoverShow = false;
              if (val.type == 1) {
                val.type = '多选菜单'
              } else if (val.type == 2) {
                val.type = '单选菜单'
              } else if (val.type == 3) {
                val.type = '单行文本'
              } else if (val.type == 4) {
                val.type = '单行数值'
              }
            })
          });
          this.tableData1 = res.data.kindsList
          resolve()
        });
      })
    },
    // 关闭弹窗接收
    isShowClick(val) {
      this.isShow_click = val
    },
    // 删除行
    delX(item) {
      this.id = item.id
      this.deleVisible = true
    },
    // 编辑显示当前确定和取消
    editMaterialSpec(row, name, index, i) {
      this.material_index = index
      this.material_i = i
      this.title = name
      this.isShow_click = true //显示编辑弹窗
      this.row = row
      this.commonAttrstoreId = row.commonAttrstoreId //保存当前编辑的id
    },
    // 取消显示当前行
    editCancel() {
      // this.$refs.elpopover[this.index].popperElm.style.display = 'none'
      // this.tableData3.forEach((v, i) => {
      //     rows.forEach(v2 => {
      //         if (v.id === item.id) {
      //             this.$refs.multipleTable[index].toggleRowSelection(this.tableData3[i], false);
      //         }
      //     })
      // });
      //
      // this.tableData1[index].commonMaterialsKindsAttrsList.splice(i, 1)
      // this.tableData1[index].isShow = !this.tableData1[index].isShow

    },
    // 拖动结束，发送排序请求
    datadragEnd(index) {
      let arrIds = [];
      for (let i = 0; i < this.tableData1[index].commonMaterialsKindsAttrsList.length; i++) {
        if (this.tableData1[index].commonMaterialsKindsAttrsList[i].id != '') {
          arrIds.push(this.tableData1[index].commonMaterialsKindsAttrsList[i].id);
        }
      }
      console.log(arrIds);
      let params = {
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //用户id
        commonMaterialsKindsAttrsIdsList: arrIds //物料分类与属性关联id列表
      };
      updateCommonMaterialsKindsAttrsSort(params).then(res => {
        if (res.data.code === 0) {
          console.log('move success')
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 删除
    click_delete(index) {
      this.tableData2.splice(index, 1)
    },
    // 编辑分类
    editor(id, no, name) {
      this.$emit('editor', '修改分类', id, no, name)
    },
    // 点击编辑
    Modify(index) {
      this.tableData2[index].isShow = !this.tableData2[index].isShow
    },
    // 取消
    cancel(index) {
      this.tableData2[index].isShow = !this.tableData2[index].isShow
    }
  }
}
</script>

<style lang="scss" scoped>
.attribute_Table_Table_List {
  box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
  border-radius: 2px;

  .attribute_Table_content {
    padding: 24px;
    margin-bottom: 12px;
    background-color: #fff;

    .attribute_Table_top {
      .attribute_Table_left {
        display: inline-block;

        >span {
          font-size: 14px;
          font-weight: 700;
          color: rgba(59, 59, 59, 1);
          line-height: 21px;
        }

        .icon {
          cursor: pointer;
          width: 14px;
          height: 14px;
          vertical-align: initial;
        }
      }

      .attribute_Table_right {
        margin-left: 40px;
        display: inline-block;

        >span {
          font-size: 14px;
          color: rgba(59, 59, 59, 1);
          line-height: 21px;
        }
      }

      .attribute-del-btn {
        float: right;
        padding: 10px;
        margin-top: -6px;
        color: #808080;
        cursor: pointer;
        border: 1px solid #BFCBD9;
        border-radius: 2px;
      }

    }

    .attribute_Table_bottom {
      margin-top: 13px;

      .isTable {
        margin-bottom: 24px;

        .color-table-title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 36px;
          color: #a2abb8;
          border: 1px solid #e6eaf0;
        }

        .color-table-title-th {
          background-color: #f7f9fc;
        }

        .color-table-title:hover {
          background-color: rgba(247, 249, 252, 1);
        }

        .color-title-name {
          /*width: 33.3333%;*/
          display: flex;
          justify-content: left;
          align-items: center;
          height: 36px;
          color: #3b3b3b;
          position: relative;
        }

        .color-title-name-name {
          width: 140px;
        }

        .color-title-name-type {
          width: 140px;
        }

        .color-title-name-options {
          width: 100%;
          overflow: hidden;
          overflow: auto;
        }

        .color-title-name-operation {
          width: 280px;
        }

        .color-title-name {
          >span {
            margin-left: 10px;
          }

          >input {
            margin-left: 10px;
          }
        }

        .title-bg {
          border-right: 1px solid rgb(230, 234, 240);
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
          justify-content: left;
          align-items: center;
          width: 100%;
          height: 36px;
          color: #ffa914;
          border: 1px solid #e6eaf0;
          margin-top: -1px;
          box-sizing: border-box;
          padding-left: 10px;

          &:hover {
            background-color: #f7f9fc;
          }

          &:hover .el-button {
            background-color: #f7f9fc;
            cursor: pointer;
          }

          .el-button {
            color: #FFA914;
            border: none;
          }
        }

        .color-sort {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50%;
          border-right: 1px solid #e6eaf0;
          height: 36px;
          color: #808080;

          &:hover {
            color: #3b3b3b;
            cursor: pointer;
          }
        }

        .del-color {
          display: flex;
          justify-content: center;
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
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 600px;
        }

        .edit-color-opera {
          display: flex;
          justify-content: center;
          align-items: center;
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
  }

  .delete-kind-fail {
    text-align: center;

    .kind-content p {
      margin-bottom: 10px;
    }

    .el-dialog__footer {
      text-align: center;
    }
  }
}

.el-popover-none {
  display: none;
}
</style><style lang="scss">
.attribute_Table_Table_List {
  .attribute_Table_content {
    .attribute_Table_bottom {
      .isTable {
        .color-table-scroll {
          .el-input {
            font-size: 12px;

            .el-input__inner {
              padding: 0;
              padding-left: 10px;
              border: none;
            }
          }
        }

        /*.el-popover {*/
        /*bottom: 138px;*/
        /*}*/
      }

      .color-table-title:hover .el-input__inner {
        background-color: rgba(247, 249, 252, 1);
      }

      .el-table__body-wrapper {
        overflow: none;
        overflow: overlay;
      }
    }

    .el-dialog__body {
      text-align: center;

      p {
        font-size: 16px;
        line-height: 60px;
      }

      .handle-delete {
        margin-bottom: 40px;
      }
    }

    .isel-input__inner {
      border: 1px solid #ffa914;
    }

    .color-table-title {
      margin-top: 0 !important;
    }
  }

  .el-dialog__wrapper {
    background-color: rgba(0, 0, 0, 0.5)
  }

  .el-dialog__body {
    text-align: center;
    line-height: 40px;
    /*margin-right: 15px;*/
  }

  .el-table td,
  .el-table th {
    height: 32px;
    font-size: 12px;
  }

  .el-table .cell,
  .el-table th>div {
    padding: 0;
    padding-left: 10px;
  }

  .icon_button {
    font-size: 12px;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: #f7f9fc;
  }

  .color-title-head-operation {
    padding-right: 18px;
  }

  .delete-kind-fail {
    .el-dialog__header {
      margin-bottom: 15px;
    }

    .el-dialog__body {
      padding: 20px 0px 10px;
      border-top: 1px solid #e0e6ed;
    }

    .el-dialog__footer {
      text-align: center;
      padding: 10px 20px 20px;
    }
  }
}

</style>
