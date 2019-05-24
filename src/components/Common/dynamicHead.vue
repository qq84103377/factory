<template>
    <!-- 动态表头配置 -->
    <div class="dynamicHead">
        <el-dialog
                @close="btnLoading = false"
                class="dynamic-header"
                :title="title"
                :visible.sync="dynamicVisible"
                :show-close="false"
                :close-on-click-modal="false"
                size="tiny">
            <div class="main-wrap">
                <div class="main-left">
                    <div class="main-l-head">
                        <span><span style="width: 3px;height: 16px;background: #ff8d37;display: inline-block;margin-right: 6px;margin-bottom: -2px;"></span>可选字段 <span  v-if="source !== 'bomConfig'">({{allItemLength}})</span></span>
                        <el-input v-if="source !== 'bomConfig'"  @change="handleSearch" class="search-input" v-model="searchKey" placeholder="搜索"
                                  icon="search">
                        </el-input>
                    </div>
                    <div class="main-l-body" ref="mainLeft">
                        <div v-if="source === 'bomConfig'" class="bom-select-item" >
                            <div :class="[!item.parentId?'isParent':'isChildren']"   v-for="(item, index) of allSelectItem" :key="item.fieldId">
                                <el-checkbox v-model="item.required" :disabled="item.defaultFlag" @change="bomSelChange(item)">
                                    {{item.name}}
                                </el-checkbox>
                            </div>
                        </div>
                        <el-checkbox-group v-else v-model="checkedArr">
                            <div class="select-item" v-if="source === 'nodeDesign'||source === 'orderProductionList'">
                                <el-checkbox
                                        :disabled="!items.cancelable && source === 'nodeDesign'"
                                        :label="items.id"
                                        v-for="(items, indexs) of allSelectItem"
                                        :key="indexs"
                                        >
                                    {{items.name}}
                                </el-checkbox>
                            </div>
                            <div v-else-if="source === 'createNode'" class="select-item" v-for="(item, index) of allSelectItem" :key="index">
                                <span class="table-title">{{item.name}}</span>
                                <el-checkbox
                                        :label="items.id"
                                        v-for="(items, indexs) of item.children"
                                        :key="items.id"
                                        :style="{width: items.name==='单据名'?'234px':'116px'}"
                                >
                                    {{items.name}}
                                    <el-input style="width: 140px;" v-model="billName" v-if="items.name==='单据名'" placeholder="请输入内容"></el-input>

                                </el-checkbox>
                            </div>

                            <div v-else class="select-item" v-for="(item, index) of allSelectItem" :key="index">
                                <span class="table-title">{{item.name}}</span>
                                <el-checkbox
                                        :label="items.name"
                                        v-for="(items, indexs) of item.FacFieldConfigList"
                                        :key="indexs"
                                        @change="labelChange(items)">
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="main-right">
                    <div class="main-r-head">
                        <span>已选字段 ({{sortItemLength}})</span>
                    </div>
                    <div class="main-r-body" :style="{'height': rightOffsetHeight + 'px'}">
                        <draggable v-model="sortArr" @update="datadragEnd">
                            <transition-group>
                                <div v-for="(item, index) of sortArr" :key="item.name+index" class="item-sort draggable">
                                    <icon style="width:12px;height:12px;margin-right:4px;"
                                          type="icon-liebiaocaozuo_tuodong"></icon>
                                    <template>
                                        <span class="sort-font">{{item.name}}</span>
                                        <icon v-if="(item.cancelable && source === 'nodeDesign') ||(item.parentId && !item.defaultFlag && source === 'bomConfig') || ['nodeDesign','bomConfig'].indexOf(source)===-1" style="width:12px;height:12px;float: right;margin-top: 2px;" type="icon-delete" @click="deleteSortItem(item, index)"></icon>
                                    </template>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
            <div class="reset-btn" @click="handleReset">恢复默认选项</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" :loading="btnLoading" @click="commitData">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import draggable from "vuedraggable";

    export default {
        name: "dynamicHead",
        props: ['title','dynamicVisible', 'allSelectItem', 'checkedArr', 'sortArr','source','billName'],
        /*************
         *
         * title 标题
         * source 父组件是节点管理列表使用该组件
         *
         *************/
        data() {
            return {
                // billName:'',
                searchKey: '',      //搜索词
                rightOffsetHeight: 300, //右侧栏默认高度
                btnLoading:false,
                allSelectItemBf:[],
            }
        },
        created(){
            if(this.allSelectItem&&this.allSelectItem.length){
                this.allSelectItemBf = JSON.parse(JSON.stringify(this.allSelectItem))

            }
        },
        computed: {
            //可选字段数量
            allItemLength() {
                let length = 0;
                if(this.allSelectItem){
                    this.allSelectItem.forEach((item) => {
                        if(item.FacFieldConfigList){
                            length += item.FacFieldConfigList.length;
                        }
                    });
                }
                if(this.source === 'nodeDesign'||this.source === 'orderProductionList'){
                    length = this.allSelectItemBf.length-this.sortArr.length
                    length = length>0?length:0
                }else if(this.source === 'createNode'){
                    let childrenLength = 0
                    this.allSelectItemBf.forEach((item) => {
                        if(item.children){
                            childrenLength += item.children.length;
                        }
                    });
                    length = childrenLength-this.sortArr.length
                    length = length>0?length:0
                }

                return length;
            },
            //已选字段数量
            sortItemLength(){
                if(this.sortArr){
                    if(this.source === 'bomConfig'){
                        let length = this.sortArr.length;
                        this.sortArr.forEach(item=>{
                            if(item.name==='物料字段'||item.name==='需求字段'){
                                length = length-1
                            }
                        });
                        return length
                    }
                    return this.sortArr.length;
                }
            },
        },
        watch:{
            checkedArr(val){
                console.log(val);
                if (!this.source) return;
                this.sortArr = [];
                if(this.source==='nodeDesign'||this.source === 'orderProductionList'){
                    val.forEach(item=>{
                        this.allSelectItem.forEach($item=>{
                            if($item.id===item){
                                this.sortArr.push($item)
                            }
                        });
                    })
                }

                if(this.source==='createNode'){
                    val.forEach(item=>{
                        this.allSelectItem.forEach($item=>{
                            $item.children.forEach($$item=>{
                                if($$item.id===item){
                                    this.sortArr.push($$item)
                                }
                            })

                        });
                    })
                }

            },
        },
        components: {
            draggable
        },
        methods: {
            bomSelChange(item){
                console.log(item);
                //全选操作
                if(!item.parentId){
                    this.allSelectItem.forEach(selItem=>{
                        if(item.fieldId=== selItem.parentId && !selItem.defaultFlag){
                            this.$set(selItem,'required',item.required)
                        }
                    });
                }else {
                    let flag = true;
                    this.allSelectItem.forEach(selItem=>{
                        if(item.parentId=== selItem.parentId && !selItem.required){
                            flag = false
                        }
                    });
                    this.allSelectItem.forEach(selItem=>{
                        if(item.parentId=== selItem.fieldId){
                            this.$set(selItem,'required',flag)
                        }
                    });
                }
                let dynamicCheckArr = this.allSelectItem.filter(item=>item.required);
                this.sortArr = JSON.parse(JSON.stringify(dynamicCheckArr));
            },
            //改变勾选
            labelChange(item) {
                //判断是勾选还是取消
                let isChecked = false;
                let checkedIndex = '';      //被勾选对象所在排序数组的下标
                this.sortArr.forEach((val, i) => {
                    if (val.code === item.code) {
                        isChecked = true;
                        checkedIndex = i;
                    }
                });
                //勾选
                if (!isChecked) {
                    let itemObj = {...item};
                    itemObj.deleteFlag = true;      //可删除标识
                    this.sortArr.push(itemObj);
                } else {
                    this.sortArr.splice(checkedIndex, 1);
                }
                //触发父组件，更新已选数组
                this.$emit('updateCheckedArr', this.checkedArr)
            },

            //搜索
            handleSearch(val) {
                // console.log(val);
                // console.log(this.searchKey);
                if (this.source==='nodeDesign'||this.source === 'orderProductionList'){
                    this.allSelectItem = JSON.parse(JSON.stringify(this.allSelectItemBf)).filter(item=>item.name.indexOf(val)!==-1)
                    return
                } ;
                this.$emit('dynamicSearch', this.searchKey);
            },
            //恢复已选
            handleReset() {
                if(this.source === 'bomConfig'){
                    this.allSelectItem.forEach(selItem=>{
                        this.$set(selItem,'required',true)
                    });
                    this.sortArr = [{
                        "fieldId": "100",
                        "required": false,
                        "parentId": "",
                        "fieldName": "物料字段",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "105",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "图片",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "106",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "物料分类",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "101",
                        "required": true,
                        "parentId": "100",
                        "fieldName": "物料款号",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "104",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "物料名称",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "102",
                        "required": true,
                        "parentId": "100",
                        "fieldName": "颜色",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "103",
                        "required": true,
                        "parentId": "100",
                        "fieldName": "规格",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "107",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "供应商",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "108",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "供应商款号",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "122",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "供应商色号",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "109",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "单位",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "115",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "单件用量",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "116",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "损耗",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "117",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "用于货品颜色",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "118",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "用于货品尺码",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "119",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "用于货品内长",
                        "commonAttType": null,
                        "defaultFlag": true
                    }, {
                        "fieldId": "114",
                        "required": true,
                        "parentId": "",
                        "fieldName": "需求字段",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "110",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "参考单价",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "111",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "备注",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "112",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "净幅宽",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "113",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "克重",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "120",
                        "required": true,
                        "parentId": "114",
                        "fieldName": "首单实际单耗",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, {
                        "fieldId": "121",
                        "required": false,
                        "parentId": "100",
                        "fieldName": "主料",
                        "commonAttType": null,
                        "defaultFlag": false
                    }, ];
                    this.sortArr.forEach(item=>{
                        item.name = item.fieldName
                    });
                    return
                }
                this.$emit('dynamicReset');
            },
            //删除排序项
            deleteSortItem(item, index) {
                this.sortArr.splice(index, 1);
                if (this.source){
                    if (this.source!=='bomConfig'){
                        this.checkedArr.forEach((val, i) => {
                            if(val === item.id){
                                this.checkedArr.splice(i, 1);
                            }
                        });
                    }else {
                        this.allSelectItem.forEach(selItem=>{
                            if(item.fieldId === selItem.fieldId){
                                this.$set(selItem,'required',false)
                            }
                        });
                        this.allSelectItem.forEach(selItem=>{
                            if(item.parentId=== selItem.fieldId){
                                this.$set(selItem,'required',false)
                            }
                        });
                    }
                    return
                } ;

                this.checkedArr.forEach((val, i) => {
                    if(val === item.name){
                        this.checkedArr.splice(i, 1);
                    }
                })
            },
            // 拖动结束，更新数据
            datadragEnd (evt) {
                this.$emit('updateSortArr', this.sortArr);
            },
            //提交
            commitData(){
                if(!this.sortArr.length && this.source !== 'orderProductionList'){
                    this.$message.error('已选不能为空');
                    return
                }
                this.btnLoading = true;
                this.$emit('dynamicCommit',this.sortArr,this.billName);
            },
            //关闭弹窗
            handleClose(){
                this.$emit('closeDynamicHead');
            },
            //计算右侧栏高度
            computedHeight(){
                if(this.$refs.mainLeft){
                    this.rightOffsetHeight = this.$refs.mainLeft.offsetHeight -2;
                }
            },
        },
        updated(){
            this.computedHeight();
        }
    }
</script>
<style lang="scss" scoped>
    .dynamicHead {
        position: relative;
        color: #3B3B3B;
        .dynamic-header {
            .el-dialog__title {
                font-size: 20px;
            }
        }
        .main-wrap {
            overflow: hidden;
            .main-left {
                float: left;
                width: 500px;
                .main-l-head {
                    line-height: 36px;
                    margin-bottom: 10px;
                    overflow: hidden;
                    .search-input {
                        width: 250px;
                        font-size: 14px;
                        float: right;
                    }
                }
                .main-l-body {
                    min-height: 300px;
                    border: 1px solid #E6EAF0;
                    .table-title {
                        display: block;
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .select-item {
                        padding: 10px;
                        border-bottom: 1px solid #E6EAF0;
                        .el-checkbox {
                            width: 116px;
                            overflow: hidden;
                            margin: 4px 0;
                        }
                        &:last-child {
                            border-bottom: none;
                        }
                    }
                    .bom-select-item {
                        border-bottom: 1px solid #E6EAF0;
                        padding-left: 10px;
                        .el-checkbox {
                            width: 146px;
                            overflow: hidden;
                            margin: 4px 0;
                        }
                        &:last-child {
                            border-bottom: none;
                        }
                    }
                    .isChildren{
                        display: inline-block;
                    }
                    .isParent{
                        border-bottom: 1px solid #E6EAF0;
                        border-top: 1px solid #E6EAF0;
                        width: 100%;
                        margin-left: -10px;
                        padding-left: 10px;

                    }
                }
            }
            .main-right {
                float: right;
                width: 200px;
                .main-r-head {
                    line-height: 36px;
                    margin-bottom: 10px;
                }
                .main-r-body {
                    padding: 0 10px;
                    border: 1px solid #E6EAF0;
                    overflow-y: auto;
                    .item-sort {
                        margin: 10px 0;
                        cursor: pointer;
                        .sort-font {
                            display: inline-block;
                            height: 14px;
                            vertical-align: bottom;
                            overflow: hidden;
                            &.disabled {
                                color: #A2ABB8;
                            }
                        }
                    }
                }
            }
        }
        .reset-btn {
            position: absolute;
            left: 30px;
            bottom: 15px;
            display: inline-block;
            font-size: 14px;

            cursor: pointer;
            background: #fff;
            border: 1px solid #c4c4c4;
            color: rgb(31, 41, 61);
            margin: 0;
            padding: 10px 15px;
            border-radius: 4px;
        }
    }
</style>
<style lang="scss">
    .dynamicHead {
        .el-dialog--tiny {
            width: 780px;
        }
        .el-dialog__header {
            padding: 0;
        }
        .el-dialog__title {
            display: block;
            line-height: 50px;
            font-size: 20px;
            font-weight: normal;
            text-align: center;
            border-bottom: 1px solid #E6EAF0;
        }
        .el-dialog__body {
            padding: 15px 30px;
        }
        .el-checkbox + .el-checkbox {
            margin: 0;
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
            background-color: #D3D9E6 !important;
        }
    }
</style>
