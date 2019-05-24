<template>
    <div class="attr-dialog">
        <div class="color-header">
            <div class="title">
                <span>{{info.replace ? '属性名称' : info.name}}</span>
                <div v-if="info.replace">
                    <div v-if="!isShow">
                        <span class="title-name">{{info.name}}</span>
                        <el-button class="edit-btn" type="text" @click="toggleEdit">
                            <icon style="width:14px;height:14px;position:relative;top:-1px;
                        margin: 0 4px 0 15px;" type="icon-edit"></icon>
                            修改名称
                        </el-button>
                    </div>
                    <div v-else>
                        <el-input v-model="name" placeholder="请输入" style="width:200px;text-align:left;margin-left:10px;"></el-input>
                        <el-button type="text" @click="toggleEdit()">取消</el-button>
                        <el-button class="save-btn" type="text" @click="editArrName" style="color:#ffa914;">确定
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="header_right">
                <nf-button style="width: 98px;" @click="cancel">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </div>
        </div>
        <div class="color-table">
            <div class="color-table-title">
                <div class="color-title-name title-bg">编号</div>
                <div  class="color-title-name title-bg">名称</div>
                <div class="color-title-name title-bg">
                    操作 <div style="width:14px;height:14px;cursor:pointer;">
                </div>
                </div>
            </div>
            <div class="color-table-scroll" :style="{'max-height': h-226 + 'px'}">
                <draggable v-model="tableData" :options="{handle:'.draggable'}" @update="datadragEnd" >
                    <transition-group>
                        <div v-for="(item,index) of tableData" :key="'Attr'+index" class="color-table-title" style="margin-top:-1px;">
                            <!-- 编号 -->
                            <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span v-if="!item.isEdit">{{item.code}}</span>
                                <el-input
                                        :maxlength="8"
                                        v-if="item.isEdit"
                                        v-model.trim="item.code"
                                        placeholder="不填则自动生成">
                                </el-input>
                            </div>
                            <!-- 名称 -->
                            <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span  v-show="!item.isEdit">{{item.name}}</span>
                                <el-input
                                        v-if="item.isEdit"
                                        v-model.trim="item.name"
                                        placeholder="请输入规格描述">
                                </el-input>
                            </div>
                            <!-- 操作 -->
                            <div v-if="!item.isEdit" class="color-title-name color-opera handle">
                                <div  class="color-sort draggable"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序</div>
                                <div  @click="editClick(item)" class="color-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                                <div class="color-sort"><span v-if="item.removeTag <= 0"  @click="delX(item,index)">
                                    <icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span></div>
                            </div>
                            <div class="edit-color-opera" v-if="item.isEdit">
                                <div @click="editCancel(item,index)" class="edit-color-cancel">取消</div>
                                <el-button :disabled="item.disabled" @click="save(item)" style="color:#ffa914;border:none;background:#fff;">确定</el-button>
                            </div>
                          </div>
                          <div>
                        </div>
                    </transition-group>
                </draggable>
            </div>
            <div @click="add" class="add-color">+添加</div>
        </div>
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="visible.deleVisible"
                :modal-append-to-body="false"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否删除当前属性</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="curDel(delItem,delIndex)">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import {deleteAttr,addFacCommonSettings,editGoodsAttr,updateFacCommonSettingsSort,getEditFieldName} from '@/api'
    export default {
        props: ['info','h'],
        /*
        info: 列表数据
        */
        data() {
            return {
                edit:false,
                tableData: JSON.parse(JSON.stringify(this.info.attrs)),
                visible:{
                    deleVisible:false,
                },
                delItem:{},
                delIndex:0,
                curRowCode: '',
                curRowName: '',
                name: this.info.name,
                isShow: false
            }
        },
        components: {
            draggable,
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            }
        },
        methods: {
            // 修改属性名称
            toggleEdit () {
                this.isShow = !this.isShow
                this.name = this.info.name
            },
          // 收起
          cancel() {
            this.$emit('cancel', false)
          },
          // 弹出删除弹层，定位删除的item
          delX(item,index) {
            this.visible.deleVisible = true;
            this.delItem = item;
            this.delIndex = index;
          },
          curDel(item,index) {
            let params = {
                id:item.id
            }
            deleteAttr(params).then(res => {
                if(res.data.code ==0) {
                this.tableData.splice(index,1);
                this.visible.deleVisible = false;
                this.$message.success(res.data.msg);
                }else {
                this.$message.error(res.data.msg);
                }
            })
          },
        //   属性名称编辑
          editArrName() {
              let params = {
                  type: this.info.type,
                  name: this.name,
                  userId: this.userId,
              }
              getEditFieldName(params).then(res => {
                  if(res.data.code === 0) {
                      this.$message.success('名称修改成功')
                      this.info.name = this.name
                      this.isShow = false
                  } else {
                      this.$message.error(res.data.msg)
                  }
              })
          },
          // 取消编辑
          editCancel(item,index) {
            if(item.id ==='') {
              if(item.date ===''||item.name ==='') {
                this.tableData.splice(index,1);
              }else if(item.noDel==1){
                item.isEdit = false;
              }else {
                this.tableData.splice(index,1);
              }
            }else {
              item.isEdit = false;
              item.code = this.curRowCode;
              item.name = this.curRowName;
            }
          },
          // 编辑
          editClick(item,index) {
            // 取消其他item的编辑状态
            this.tableData.forEach(items => {
              this.$set(items, 'isEdit', false);
            })
            item.isEdit = true;
            this.curRowCode = item.code
            this.curRowName = item.name
          },
          //点击添加
          add() {
            if(this.tableData.length>0&&this.tableData[this.tableData.length-1].id=='') {
              this.tableData.splice(this.tableData.length-1,1);
            }
            else {
                let addRow = {
                    code: '',
                    name: '',
                    isEdit: true,
                    id: ''
                }
                // 取消其他item的编辑状态
                this.tableData.forEach(items => {
                    this.$set(items, 'isEdit', false);
                })
              this.tableData.push(addRow)
            }
          },
          // 保存：新建、编辑
          save(item) {
              let params = {
                name: item.name,
                value: item.code,
                type: this.info.type,
                id: item.id ? item.id : undefined,
                userId: this.userId
              }
              if (item.id) {
                // 编辑
                if (!item.code) return this.$message.error('修改时编号不能为空')
                this.$set(item,'disabled', true)
                editGoodsAttr(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('修改成功')
                        item.isEdit = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.$set(item,'disabled', false)
                })
              } else {
                  this.$set(item,'disabled', true)
                  addFacCommonSettings(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('添加成功')
                        item.isEdit = false
                        item.code = res.data.data.attributeCode
                        item.name = res.data.data.attributeValue
                        item.id = res.data.data.id
                        item.removeTag = 0
                        item.isActive = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.$set(item,'disabled', false)
                  })
              }
          },
          // 拖动结束，发送排序请求
          datadragEnd() {
            let attrIds = [];
            this.tableData.forEach(i => {
               if(i.id!='') {
                attrIds.push(i.id);
              }
            })
            let params= {
                userId:this.userId,
                type: this.info.type,
                attrIds: attrIds
            }
            updateFacCommonSettingsSort(params).then(
              res=> {
                if(res.data.code===0) {
                  console.log('move success')
                }else {
                  this.$message.error(res.data.msg);
                }
              }
            )
          }
      }
    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .red{
        color: #fa4150;
    }
    .title-bg {
        background-color: #f5f7fa;
        color: #a2abb8 !important;
    }
    .edit-btn {
        color: #1ca1ff;
        display: none;
        cursor: pointer;
    }
    .attr-dialog {
        position: fixed;
        top: 0;
        right: 0;
        width: 850px !important;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 3000;
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
            .title{
                display:flex;
                justify-content: flex-start;
                line-height: 35px;
                &:hover {
                    .edit-btn {
                        display: inline-block;
                    }
                }
                >div{
                    height: 35px;
                    line-height: 35px;
                }
                .title-name{
                    margin-left:8px;
                    font-size:16px;
                }
            }

        }
        .color-table{
            margin:32px;
            box-sizing: border-box;
            .color-table-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 36px;
                color: #a2abb8;
                border: 1px solid #e6eaf0;
            }
            .color-title-name{
                width:33.3333%;
                display: flex;
                justify-content: center;
                align-items: center;
                height:36px;
                color: #3b3b3b;
                position: relative;
                // border-right:1px solid rgb(230, 234, 240);
                &:last-child{
                  border-right:none;
                }
            }
            .color-opera {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height:36px;
            }
            .add-color{
                height:36px;
                display: flex;
                justify-content: center;
                align-items: center;
                width:100%;
                height:36px;
                color:#ffa914;
                border: 1px solid  #e6eaf0;
                margin-top:-1px;
                box-sizing: border-box;
                &:hover{
                    background-color: #f7f9fc;
                    cursor: pointer;
                }
            }
            .color-sort{
                display: flex;
                justify-content: center;
                align-items: center;
                width:50%;
                border-right:1px solid #e6eaf0;
                height:36px;
                color: #808080;
                &:hover {
                    color: #3b3b3b;
                    cursor: pointer;
                }
            }
            .del-color{
                display: flex;
                justify-content: center;
                align-items: center;
                width:50%;
            }
            .del-text{
                color:#808080;
                &:hover {
                    color: #3b3b3b;
                }
            }
            .color-table-scroll{
                overflow-y: auto;
                overflow-x: hidden;
                max-height:600px;
            }
            .edit-color-opera {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 33.3333%;
                height:100%;
                .edit-color-cancel {
                    margin-right:24px;
                    cursor: pointer;
                }
            }
            .color-draggable{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                min-width: 90%;
            }
        }
    }
</style>
<style lang="scss">
    .backgroundPopover{
        background:#939fb8;
        border:1px solid #939fb8;
    }
    .popper__arrow::after{
        border-top-color:#939fb8 !important;
    }
    .attr-dialog .el-checkbox__inner {
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
    .attr-dialog {
        .color-table-scroll{
            .el-input__inner {
                border:none !important;
                border-radius:0px;
                text-align:center;
                background-color: #FFF9ED;
            }
        }
        .color-header{
          .el-input__inner {
            border:1px solid rgb(191, 200, 217);
            text-align:left;
            background-color: #fff;
            &:hover{
              border-color:rgb(131, 140, 165)
            }
          }
        }
    }
    .attr-dialog .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            padding-top:4px;
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }
    .attr-dialog  .handle-delete {
        margin-top: 34px;
    }
</style>






