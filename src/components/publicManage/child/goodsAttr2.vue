<template>
    <div class="edit-color">
        <div class="color-header">
            <span>编辑属性库</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="$emit('goodsAttrShow')">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </span>
        </div>
        <div class="color-table" v-for="(outerItem, outerIndex) in loopArr" :key="outerIndex">
            <div class="color-table-title">
                <div class="color-title-name title-bg">{{outerItem.name}}编号</div>
                <div  class="color-title-name title-bg">{{outerItem.name}}名</div>
                <div class="color-title-name title-bg">
                操作<div style="width:14px;height:14px;cursor:pointer;" v-popover:popover1>
                        <icon style="width:14px;height:14px;margin-left:4px;" type="icon-tongyong-tishi"></icon>
                        <el-popover  popper-class='backgroundPopover' ref="popover1" placement="top-start" width="180" :offset = "180" height="86" trigger="hover">
                            <div  style="color:#fff;">提示：拖拽标签可调整排序</div>
                        </el-popover>
                    </div>
                </div>
            </div>
            <div class="color-table-scroll" :style="{'max-height': h-226 + 'px'}">
                <draggable v-model="tableData[outerItem.key]" @update="updateInfo(outerItem, tableData[outerItem.key])" >
                    <transition-group>
                        <div v-for="(item,index) of tableData[outerItem.key]" :key="'GoodsAttr'+index" class="color-table-title" style="margin-top:-1px;">
                            <!-- <div @click="isExpandNo(outerItem.key, index)" style="border-right:1px solid #e6eaf0;" class="color-title-name"> -->
                            <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span v-if="!item.isEditState">{{item.code}}</span>
                                <el-input
                                    :maxlength="8"
                                    v-if="item.isEditState"
                                    v-model.trim="item.code"
                                    placeholder="规格号不填则自动生成"
                                    :key="index+'2'"
                                >
                                </el-input>
                            </div>
                            <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span  v-show="!item.isEditState">{{item.attributeValue}}</span>
                                <el-input
                                    v-if="item.isEditState"
                                    v-model.trim="item.attributeValue"
                                    placeholder="请输入"
                                    :key="index+'1'"
                                >
                                </el-input>
                            </div>
                            <div v-if="!item.isEditState" class="color-title-name color-opera handle">
                                <div class="color-sort draggable"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序</div>
                                <div @click="editGoodsAttr(outerItem.key, index)" class="color-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                                <div class="color-sort"><span @click="delX(item,index,outerItem)" v-if="item.removeTag===1">
                                    <icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span></div>
                            </div>
                            <div class="edit-color-opera" v-if="item.isEditState">
                                <div @click="editCancel(outerItem.key, index)" class="edit-color-cancel">取消</div>
                                <div @click="sureGoods(item, outerItem.type, outerItem.key, index, 1)" style="color:#ffa914;cursor:pointer;">确定</div>
                            </div>
                        </div>
                    </transition-group>
                </draggable>
            </div>

            <div v-if="addState[outerIndex]" style="margin-top:-1px;" class="color-table-title" :ref="outerItem.key">
                <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                    <el-input type="text" v-model="add[outerItem.add_key].code" placeholder="不填则自动生成"></el-input>
                </div>
                <div style="border-right:1px solid #e6eaf0;" class="color-title-name">
                    <el-input v-model="add[outerItem.add_key].attributeValue" placeholder="请输入"></el-input>
                </div>
                <div class="edit-color-opera">
                    <div @click="addCancel(outerItem)" class="edit-color-cancel">取消</div>
                    <div @click="sureAddGoods(outerItem)" style="color:#ffa914;cursor:pointer;">确定</div>
                </div>
            </div>
            <div @click="addBrand(outerIndex)" class="add-color">+添加</div>
        </div>
        <el-dialog
            :show-close="false"
            :modal="false"
            :visible.sync="visible.deleVisible"
            size="tiny"
        >
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前属性？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delGoodsAttr(delItem,delIndex,delOuterItem)">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import draggable from "vuedraggable";
import {deleteAttr, addFacCommonSettings, editGoodsAttr, updateFacCommonSettingsSort} from '../../../api/api'
export default {
    props: {
        h: '',
        info: Object
    },
    data() {
        return {
            loopArr: [
                {key: 'brand', name: '品牌', id: 'brandIds', add_key: 'add_Brand', type: 8},
                {key: 'designer', name: '设计师', id: 'designerIds', add_key: 'add_Designer', type: 2},
                {key: 'kind', name: '分类', id: 'kindIds', add_key: 'add_Kind', type: 4},
                {key: 'style', name: '风格', id: 'styleIds', add_key: 'add_Style', type: 9},
                {key: 'tag', name: '标签', id: 'tagIds', add_key: 'add_Tag', type: 7},
                {key: 'year', name: '年份', id: 'yearIds', add_key: 'add_Year', type: 6},
                {key: 'season', name: '季节', id: 'seasonIds', add_key: 'add_Season', type: 5},
                {key: 'month', name: '月份', id: 'monthIds', add_key: 'add_Month', type: 10},
                {key: 'wave', name: '波段', id: 'waveIds', add_key: 'add_Wave', type: 3}
            ],
            add:{
                add_Brand: {code: '', attributeValue: ''},
                add_Designer: {code: '', attributeValue: ''},
                add_Kind: {code: '', attributeValue: ''},
                add_Style: {code: '', attributeValue: ''},
                add_Tag: {code: '', attributeValue: ''},
                add_Year: {code: '', attributeValue: ''},
                add_Season: {code: '', attributeValue: ''},
                add_Month: {code: '', attributeValue: ''},
                add_Wave: {code: '', attributeValue: ''}
            },
            edit: false,
            befordEditData: Object,
            tableData: this.info,
            visible:{
                deleVisible:false,
            },
            addState: [false,false,false,false,false,false,false,false,false],
            filterData: {},
            delItem:{},
            delIndex:0,
            delOuterItem: ''
        }
    },
    components: {
        draggable,
    },
    mounted () {
        // 数据初始化 添加编辑状态
        for (let outItem in this.tableData) {
            if (this.tableData[outItem].constructor === Array) {
                this.filterData[outItem] = this.tableData[outItem]
                let out = this.tableData[outItem]
                for (let innerItem in out) {
                    if (this.tableData[outItem][innerItem]) {
                        this.$set(this.tableData[outItem][innerItem], 'isEditState', false)
                       //this.$set(this.stateSet[outItem], 'addState',false)
                    }
                }

            }
        }
    },
    methods: {
        // 弹出删除弹层，定位删除的item
        delX(item, index, outerItem) {
            if(item.removeTag===1 ) {
                this.visible.deleVisible = true;
                this.delItem = item;
                this.delIndex = index;
                this.delOuterItem = outerItem;
            }
        },
        delGoodsAttr(item,index,outerKey) {
            if(item.removeTag === 1) {
                let params = {
                    id: item.id
                }
                deleteAttr(params).then(
                   res => {
                        if(res.data.code ==0) {
                            this.tableData[outerKey.key].splice(index,1);
                            this.visible.deleVisible = false;
                            this.$message.success(res.data.msg);
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            }else {
                return;
            }
        },
        // 取消添加
        addCancel(key) {
            for (let index in this.addState) {
                this.addState[index] = false
                this.addState.splice(0,0)
            }
            this.add[key.add_key].code = ''
            this.add[key.add_key].attributeValue = ''
        },
        sureAddGoods (key) {
            let addName = this.add[key.add_key].attributeValue
            let addCode = this.add[key.add_key].code
            let arr = this.tableData[key.key]
            let isExist = false
            if (arr != undefined) {
                if (arr.length) {
                    // for (let index in arr) {
                    //     if (arr[index].attributeValue == addName) {
                    //         this.$message({
                    //             message: "已有该"+key.name+"了",
                    //             duration: this.$globalConfig.elementUI.duration,
                    //             type: "error"
                    //         })
                    //         isExist = true
                    //         break
                    //     }
                    // }
                    // for (let index in arr) {
                    //     if (addCode != "" && arr[index].code == addCode) {
                    //         this.$message({
                    //             message: "已有该编号了",
                    //             duration: this.$globalConfig.elementUI.duration,
                    //             type: "error"
                    //         })
                    //         isExist = true
                    //         break
                    //     }
                    // }
                    // if (!isExist) {
                        let obj = {}
                        obj.name = addName
                        obj.code = addCode
                        this.sureGoods(obj, key.type, key.key)
                        obj.attributeValue = obj.name
                    // }
                } else {
                    let obj = {}
                    obj.name = addName
                    obj.code = addCode
                    this.sureGoods(obj, key.type, key.key)
                    obj.attributeValue = obj.name
                    // this.tableData[key.key].unshift(obj)
                }
            }
            this.add[key.add_key].code = ''
            this.add[key.add_key].attributeValue = ''

        },
        // // 编辑物料规格
        editGoodsAttr(key, item) {
            // 取消其他item的编辑状态&条目的添加状态 编辑前将数据存在befordEditData
            this.befordEditData.attributeValue = this.tableData[key][item].attributeValue
            this.befordEditData.code = this.tableData[key][item].code
            this.befordEditData.isEditState = false
            this.cancelAddEditStatus()
            this.tableData[key][item].isEditState = true
        },
        editCancel (key, item) {
            this.tableData[key][item].code = this.befordEditData.code
            this.tableData[key][item].attributeValue = this.befordEditData.attributeValue
            this.tableData[key][item].isEditState = false
            this.tableData[key].splice(0,0)
        },
        // 保存 ,默认添加 传递flag则是修改保存
        sureGoods(obj, type, key, index, flag) {
            let params = {
                name: obj.name || obj.attributeValue,
                value: obj.code,
                type: type,
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            }
            if (flag) {
                params.id = obj.id
                editGoodsAttr(params).then(
                    res=> {
                        if (res.data.code == 0) {
                            if (key && index && this.tableData[key][index].isEditState != undefined) {
                                this.tableData[key][index].isEditState = false // 关闭编辑状态
                            }
                            this.tableData[key][index].isEditState = false
                            this.tableData[key].splice(0,0)
                            this.$message({
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                type: "info"
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                type: "error"
                            })
                        }

                    }
                )
            } else {
                addFacCommonSettings(params).then(
                    res=> {
                        if (res.data.code==0) {
                            this.addState.map((value,index) => {
                                this.addState[index] = false
                            })
                            let data = res.data.data
                            let tempObj = {}
                            tempObj.attributeValue = data.attributeValue
                            tempObj.code = data.attributeCode
                            tempObj.id = data.id
                            tempObj.isEditState = false
                            tempObj.removeTag = data.delFlag
                            tempObj.sort = data.sort
                            this.tableData[key].push(tempObj)
                            this.$message({
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                type: "info"
                            })
                        } else {
                            this.$message({
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                type: "error"
                            })
                        }

                    }
                )
            }
            // if (key && index) {
            //     for (let index in this.addState) {
            //         if (requestRes) {
            //             this.addState[index] = false
            //         }
            //         this.addState.splice(0,0)
            //     }
            //     if (this.tableData[key][index].isEditState != undefined) {
            //         this.tableData[key][index].isEditState = false
            //     }
            // } else if (key) {
            //     for (let index in this.addState) {
            //         if (requestRes) {
            //             this.addState[index] = false
            //         }
            //         this.addState.splice(0,0)
            //     }
            // }
        },
        addBrand(key) {
            this.cancelAddEditStatus()
            this.addState[key] = true
            this.addState.splice(0,0)
        },
        //取消所有的item编辑状态及条目的添加状态
        cancelAddEditStatus () {
            for (let outItem in this.tableData) {
                if (this.tableData[outItem].constructor === Array) {
                    let out = this.tableData[outItem]
                    for (let index in this.addState) {
                        this.addState[index] = false
                        this.addState.splice(0,0)
                    }
                    for (let innerItem in out) {
                        if (this.tableData[outItem][innerItem].isEditState) {
                            this.tableData[outItem][innerItem].isEditState = false
                        }
                    }
                }
            }
        },
        // // 拖动结束，发送排序请求
        updateInfo(outerItem, arr) {
            let arrId = [];
            for (let i = 0; i < arr.length; i++) {
                arrId.push(arr[i].id)
            }
            let params = {
                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            }
            params[outerItem.id] = arrId;
            updateFacCommonSettingsSort(params).then(res => {
                console.log(res.data);
            })
        }
    },
    watch: {
        info () {
            this.tableData = this.info
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
.title-bg {
    background-color: #f5f7fa;
    color: #a2abb8 !important;
}
.edit-color {
    position: fixed;
    top: 0;
    right: 0;
    width: 850px !important;
    height: 100%;
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
                border:1px solid #ffa914;
                border-radius:0px;
                text-align:center;
            }
        }
        .edit-color .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                padding-top:4px;
                font-size: 16px;
            }
            p {
                line-height: 26px;
            }
        }
        .edit-color  .handle-delete {
            margin-top: 34px;
        }
</style>
