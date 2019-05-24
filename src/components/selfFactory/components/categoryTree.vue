<template>
    <div class="category-tree-dialog">
        <div class="color-header">
            <div>品类</div>
            <div class="header_right">
                <nf-button style="width: 98px;" @click="cancel">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </div>
        </div>
        <div class="color-table">
            <div class="color-table-title">
                <div class="color-title-name title-bg"><span>编号</span></div>
                <div  class="color-title-name title-bg"><span>名称</span></div>
                <div class="color-title-name title-bg">
                    <span>操作</span>
                </div>
            </div>
            <div class="color-table-scroll" :style="{'max-height': h-226 + 'px'}">
                <draggable v-model="tableData" :options="{handle:'.draggable'}" @update="datadragEnd(tableData,11)" >
                    <transition-group>
                        <div v-for="(item,index) of tableData" :key="'CategoryOne'+index">
                            <!-- 一级 -->
                            <div class="color-table-title" style="margin-top:-1px;">
                                <!-- 编号 -->
                                <div style="border-right:1px solid #e6eaf0;" class="color-title-name item-title">
                                    <i :class="[item.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon']" @click="getShow(item)" v-if="!item.isEdit"></i>
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
                                    <div  class="color-sort draggable">排序</div>
                                    <div  @click="editClick(item)" class="color-sort" style="color:#1CA1FF;"> 编辑</div>
                                    <div  @click="delX(item,index)" class="color-sort"><span v-show="!item.isActive&&item.removeTag <= 0" style="color:#FA4150;">删除</span></div>
                                </div>
                                <div class="edit-color-opera" v-if="item.isEdit">
                                    <div @click="editCancel(item,index)" class="edit-color-cancel">取消</div>
                                    <el-button :disabled="item.disabled" @click="save(item)" style="color:#ffa914;border:none;background:#fff;">确定</el-button>
                                </div>
                            </div>
                            <!-- 中分类 -->
                            <div v-show="item.isActive">
                                <draggable v-model="item.childAttrs" :options="{handle:'.draggable'}" @update="datadragEnd(item.childAttrs,12)" v-if="item.childAttrs&&item.childAttrs.length > 0">
                                    <transition-group>
                                        <div v-for="($item,$index) of item.childAttrs" :key="'CategoryTwo'+$index">
                                            <div class="color-table-title" style="margin-top:-1px;">
                                                <!-- 编号 -->
                                                <div style="border-right:1px solid #e6eaf0;" class="color-title-name item-title">
                                                    <i :class="[$item.isActive ?'el-icon-arrow-up' : 'el-icon-arrow-down', 'item-icon','mgl20']" @click="getShow($item)" v-if="!$item.isEdit"></i>
                                                    <span v-if="!$item.isEdit">{{$item.code}}</span>
                                                    <el-input
                                                            :maxlength="8"
                                                            v-if="$item.isEdit"
                                                            v-model.trim="$item.code"
                                                            placeholder="不填则自动生成">
                                                    </el-input>
                                                </div>
                                                <!-- 名称 -->
                                                <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                                    <span  v-show="!$item.isEdit">{{$item.name}}</span>
                                                    <el-input
                                                            v-if="$item.isEdit"
                                                            v-model.trim="$item.name"
                                                            placeholder="请输入规格描述">
                                                    </el-input>
                                                </div>
                                                <!-- 操作 -->
                                                <div v-if="!$item.isEdit" class="color-title-name color-opera handle">
                                                    <div  class="color-sort draggable">
                                                        排序</div>
                                                    <div  @click="editClick($item,index,item.childAttrs)" class="color-sort" style="color:#1CA1FF;">编辑</div>
                                                    <div  @click="delX($item,index,$index,item.childAttrs)" class="color-sort"><span v-show="$item.removeTag <= 0" style="color:#FA4150;">删除</span></div>
                                                </div>
                                                <div class="edit-color-opera" v-if="$item.isEdit">
                                                    <div @click="editCancel($item,index,$index,item.childAttrs)" class="edit-color-cancel">取消</div>
                                                    <el-button :disabled="$item.disabled" @click="save($item,item.id)" style="color:#ffa914;border:none;background:#fff;">确定</el-button>
                                                </div>
                                            </div>
                                            <!-- 细小分类 -->
                                            <div v-show="$item.isActive">
                                                <draggable v-model="$item.childAttrs" :options="{handle:'.draggable'}" @update="datadragEnd($item.childAttrs,13)" v-if="$item.childAttrs&&$item.childAttrs.length > 0">
                                                    <transition-group>
                                                        <div v-for="(el,key) of $item.childAttrs" :key="'CategoryThree'+key">
                                                            <div class="color-table-title" style="margin-top:-1px;">
                                                                <!-- 编号 -->
                                                                <div style="border-right:1px solid #e6eaf0;" class="color-title-name item-title">
                                                                    <span v-if="!el.isEdit" class="mgl50">{{el.code}}</span>
                                                                    <el-input
                                                                            :maxlength="8"
                                                                            v-if="el.isEdit"
                                                                            v-model.trim="el.code"
                                                                            placeholder="规格号不填则自动生成">
                                                                    </el-input>
                                                                </div>
                                                                <!-- 名称 -->
                                                                <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                                                    <span  v-show="!el.isEdit">{{el.name}}</span>
                                                                    <el-input
                                                                            v-if="el.isEdit"
                                                                            v-model.trim="el.name"
                                                                            placeholder="请输入规格描述">
                                                                    </el-input>
                                                                </div>
                                                                <!-- 操作 -->
                                                                <div v-if="!el.isEdit" class="color-title-name color-opera handle">
                                                                    <div  class="color-sort draggable">排序</div>
                                                                    <div  @click="editClick(el,key,$item.childAttrs)" class="color-sort" style="color:#1CA1FF;">编辑</div>
                                                                    <div  class="color-sort"><span v-show="!el.isActive&&el.removeTag <= 0" style="color:#FA4150;" @click="delX(el,index,$index,$item.childAttrs,key)" >删除</span></div>
                                                                </div>
                                                                <div class="edit-color-opera" v-if="el.isEdit">
                                                                    <div @click="editCancel(el,index,$index,$item.childAttrs,key)" class="edit-color-cancel">取消</div>
                                                                    <el-button :disabled="el.disabled" @click="save(el,$item.id)" style="color:#ffa914;border:none;background:#fff;">确定</el-button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </transition-group>
                                                </draggable>
                                                <div @click="add('small',$item.childAttrs)" class="add-color" style="padding-left:90px;">+添加细小分类</div>
                                            </div>
                                        </div>
                                    </transition-group>
                                </draggable>
                                <div @click="add('middle',item.childAttrs)" class="add-color" style="padding-left:60px;">+添加中分类</div>
                            </div>

                          </div>
                    </transition-group>
                </draggable>
            </div>
            <div @click="add('big')" class="add-color">+添加大类</div>
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
                    <p class="delete-tip">{{text}}</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delSave(delItem,delFirIndex,delTwoIndex,upLevel,delIndex)">确 定</nf-button>
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
        /* info：数据*/
        data() {
            return {
                edit:false,
                tableData: JSON.parse(JSON.stringify(this.info.attrs)),
                visible:{
                    deleVisible:false,
                },
                delItem:{},
                delFirIndex: null, // 大类index
                delTwoIndex: null, // 中类index
                delIndex:null, // 细小分类index
                upLevel: {}, // 上级
                curCode: null,
                curName: null,
                text: ''
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            }
        },
        components: {
            draggable,
        },
        methods: {
            // 展开
            getShow(row) {
                // this.$nextTick(() =>{
                    this.$set(row, 'isActive', !row.isActive)
                // })

            },
          // 收起
          cancel() {
            this.$emit('cancel', false)
          },
          // 弹出删除弹层，定位删除的item
          delX(item,index,$index,upLevel,key) {
            if(item.childAttrs&&item.childAttrs.length > 0) {
                this.text = '是否删除所有子属性'
            } else {
                this.text = '是否删除当前属性'
            }
            this.visible.deleVisible = true;
            this.delItem = item;
            this.delFirIndex = index;
            this.delTwoIndex = $index;
            this.delIndex = key;
            this.upLevel = upLevel
          },
        //   确定删除
        delSave(item,index,$index,upLevel,key) {
            let params = {
                id:item.id
            }
            deleteAttr(params).then(res => {
                if(res.data.code ==0) {
                    if(upLevel) {
                        item.type == 12 ? upLevel.splice($index,1) : upLevel.splice(key,1)
                    } else {
                        this.tableData.splice(index,1);
                    }

                    this.visible.deleVisible = false;
                    this.$message.success(res.data.msg);
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
          // 取消编辑
          editCancel(item,index,$index,upLevel,key) {
            // type :12 => 中分类取消 13 => 细小分类取消
            if(item.id ==='') {
              if(item.noDel==1){
                item.isEdit = false;
              }else {
                if(upLevel) {
                    item.type == 12 ? upLevel.splice($index,1) : upLevel.splice(key,1)
                } else {
                    this.tableData.splice(index,1);
                }
              }
            }else {
                item.code = this.curCode
                item.name = this.curName
                item.isEdit = false;
            }
          },
          // 编辑
          editClick(item,index,upLevel) {
            // upLevel:中分类取消/细小分类取消
            if (upLevel) {
                // 取消二级其他item的编辑状态
                upLevel.forEach(items => {
                    this.$set(items, 'isEdit', false);
                })
            } else {
            // 取消其他item的编辑状态
                this.tableData.forEach(items => {
                    this.$set(items, 'isEdit', false);
                })
            }
            item.isEdit = true
            this.curCode = item.code
            this.curName = item.name
          },
          //点击添加
          add(type,item) {
            let addRow = {
                code: '',
                name: '',
                isEdit: true,
                id: '',
                isActive:false
            }
            if(type =="big") {
                addRow.type = 11
                addRow.childAttrs = []
                if(this.tableData.length>0&&this.tableData[this.tableData.length-1].id=='') {
                    this.tableData.splice(this.tableData.length-1,1);
                }
                else {
                    // 取消其他item的编辑状态
                    this.tableData.forEach(items => {
                        this.$set(items, 'isEdit', false);
                    })
                    this.tableData.push(addRow)
                }
            } else{
                addRow.type = type == 'middle' ? 12 : 13
                addRow.childAttrs = type == 'middle' ? [] : undefined
                if(item.length>0&&item[item.length-1].id=='') {
                    item.splice(item.length-1,1);
                }else {
                    // 取消其他item的编辑状态
                    item.forEach(items => {
                        this.$set(items, 'isEdit', false);
                    })
                    item.push(addRow)
                }
            }

          },
          // 保存新建、编辑
          save(item,parentId) {
            let params = {
                name: item.name,
                value: item.code,
                type: item.type,
                id: item.id ? item.id : undefined,
                userId: this.userId,
                parentId: parentId
            }
            this.$set(item,'disabled', true)
            if (item.id) {
                // 编辑
                if (!item.code) return this.$message.error('修改时编号不能为空')
                editGoodsAttr(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('修改成功')
                        item.isEdit = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    item.disabled = false
                })
              } else {
                //   新建
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
                    item.disabled = false
                })
              }
          },
          // 拖动结束，发送排序请求
          datadragEnd(arr,type) {
            let attrIds = [];
            if(arr&&arr.length > 0) {
                arr.forEach(i => {
                    if (i.id) {
                        attrIds.push(i.id);
                    }
                })
                let params= {
                    userId:this.userId,
                    type: type,
                    attrIds: attrIds
                }
                updateFacCommonSettingsSort(params).then(res=> {
                    if(res.data.code===0) {
                    console.log('move success')
                    }else {
                    this.$message.error(res.data.msg);
                    }
                })
            }
        }
      }
    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .red{
        color: #fa4150;
    }
    .test{
        display: flex;
    }
    .mgl50{
        margin-left:45% !important;
    }
    .mgl20{
        margin-left:20px;
    }
    .title-bg {
        background-color: #f5f7fa;
        color: #a2abb8 !important;
    }
    .category-tree-dialog {
        position: absolute;
        top: 0;
        right: 0;
        width: 850px !important;
        min-height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
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
        .color-table{
            margin:32px;
            box-sizing: border-box;
            height: 500px;
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
                justify-content: flex-start;
                align-items: center;
                height:36px;
                color: #3b3b3b;
                position: relative;
                border-right:1px solid rgb(230, 234, 240);
                &:last-child{
                  border-right:none;
                }
                span{
                    margin-left:10px;
                }
            }
            .item-title{
                cursor: pointer;
                .item-icon{
                    color:#a2abb8;
                    padding:0 10px;
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
                justify-content: flex-start;
                align-items: center;
                width:100%;
                padding-left:30px;
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
    .category-tree-dialog .el-checkbox__inner {
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
    .category-tree-dialog {
        .el-input__inner {
            border:none !important;
            border-radius:0px;
            text-align:center;
            background-color: #FFF9ED;
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
    .category-tree-dialog .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            padding-top:4px;
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }
    .category-tree-dialog  .handle-delete {
        margin-top: 34px;
    }
    .category-tree-dialog + .cover{
        position: absolute;
        z-index: 100;
    }
</style>






