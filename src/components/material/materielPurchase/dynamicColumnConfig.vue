<template>
    <!-- 动态表头配置 -->
    <div class="dynamic-column-config">
        <el-dialog
                class="custom-dialog"
                :title="title"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                :close-on-click-modal="false">
            <div class="main-wrap" v-loading="loading">
                <div class="main-left">
                    <div class="main-l-head">
                        <span>可选字段</span>
                        <el-input  class="search-input" @change="handleSearch" v-model="searchKeyWord" placeholder="输入搜索"
                                  icon="search">
                        </el-input>
                    </div>
                    <div class="main-l-body">
                        <div v-for="item in filterConfigList" :key="item.moduleId" class="check-group">
                            <div class="check-all">
                                <el-checkbox
                                    :indeterminate="item.selectedConfigIds.length>0&&(item.selectedConfigIds.length<item.fieldConfigList.length)"
                                    v-model="item.moduleSelect"
                                    @change="handleCheckAllChange($event,item)">{{ item.moduleName }}</el-checkbox>
                            </div>
                            <!--<el-checkbox-group class="check-list" v-model="item.selectedConfigIds" @change="handleCheckedChange(event,item,childItem)">-->
                            <div class="check-list">
                                <el-checkbox
                                    @change="handleCheckedChange($event,item,childItem)"
                                    :disabled="childItem.configDefault"
                                    v-model="childItem.configSelect"
                                    class="check-item"
                                    v-for="childItem in item.fieldConfigList"
                                    :label="childItem.configName"
                                    :key="childItem.configId">{{childItem.configName}}</el-checkbox>
                            </div>
                            <!--</el-checkbox-group>-->
                        </div>
                    </div>
                </div>
                <div class="main-right">
                    <div class="main-r-head">
                        <span>已选字段 ({{selectedList.length}})</span>
                    </div>
                    <div class="main-r-body">
                        <draggable v-model="selectedList">
                            <transition-group>
                                <div v-for="(item,index) in selectedList" :key="item.configId" class="item-sort draggable">
                                    <icon style="width:12px;height:12px;margin-right:4px;margin-top: -1px;"
                                          type="icon-liebiaocaozuo_tuodong"></icon>
                                        <span :class="['sort-font',{'gray':item.configDefault}]">{{ item.configName }}</span>
                                    <icon @click="deleteSelected(item,index)" v-if="!item.configDefault" style="width:12px;height:12px;float: right;" type="icon-delete"></icon>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
            <div slot="footer" class="text-right">
                <el-button @click="reset" class="fl" >恢复默认选项</el-button>
                <el-button @click="cancel">取 消</el-button>
                <el-button :loading="isSubmitting" @click="confirm" type="primary" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {
        purchaseFacFieldConfigTargetView,
        updateUnitFacField
    } from '@/api/material.js'
    export default {
        name: "dynamicColumnConfig",
        props: ['visible', 'title','targetType'],
        // targetType 哪个页面的表头配置
        // "PURCHASE_DEMAND_BILL_LIST", "采购需求看板-按生产单",
        // "PURCHASE_DEMAND_MATERIALS_LIST", "采购需求看板-按物料",
        // "PURCHASE_LIST", "采购列表",
        // "PURCHASE_CREATE", "新建采购单",
        // "PURCHASE_DETAILS", "采购单详情",
        // "PURCHASE_LIST", "采购列表",
        // "PURCHASE_CREATE", "新建采购单",
        // "PURCHASE_DETAILS", "采购单详情",
        //"SAMPLE_PURCHASE_LIST", "样料采购列表"),
        // "SAMPLE_PURCHASE_CREATE", "新建样料采购单"
        // "SAMPLE_PURCHASE_DETAILS", "样料采购单详情"),
        data() {
            return {
                searchKeyWord: '',      //搜索词
                configList:[], //配置列表
                selectedList:[], //选中列表
                backup:{ //备份，点击取消的时候，还原
                    configList:[],
                    selectedList:[]
                },
                loading:false,
                isSubmitting:false,
                defaultConfigList:[]//默认全部选中的排序列表

            }
        },
        created(){
            this.getConfigList()
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            filterConfigList(){

                if(this.searchKeyWord){
                    let configList = JSON.parse(JSON.stringify(this.configList))
                    this.configList.forEach((item,index) =>{
                        configList[index].fieldConfigList =item.fieldConfigList.filter(childItem=>childItem.configName.indexOf(this.searchKeyWord)>-1)
                    })
                    return configList
                } else {
                    return this.configList
                }
            }
        },
        watch:{
            targetType(val){
                this.getConfigList()
            }
        },
        components: {
            draggable
        },
        methods: {
            getConfigList(){
                let params = {
                    unitId:this.unitId,
                    targetType:this.targetType
                }
                this.loading = true
                purchaseFacFieldConfigTargetView(params).then(res =>{
                    this.loading = false
                    if(res.data.code == 0){
                        this.defaultConfigList = res.data.data.defaultConfigList
                        this.selectedList = res.data.data.fieldConfigList
                        let configList = res.data.data.fieldConfigModuleList
                        configList.forEach(item => {
                            item.selectedConfigIds = []
                            item.fieldConfigList.forEach(childItem =>{
                                if(childItem.configSelect){
                                    item.selectedConfigIds.push(childItem.configId)
                                }
                            })
                        })
                        this.configList = configList
                        // 备份数据
                        this.backup.selectedList = JSON.parse(JSON.stringify(this.selectedList))
                        this.backup.configList = JSON.parse(JSON.stringify(this.configList))
                    }
                })
            },
            // 恢复默认选项
            reset(){
                // let selectedList = []
                let configList =  JSON.parse(JSON.stringify(this.backup.configList))
                configList.forEach(item=>{
                    item.selectedConfigIds = []
                    item.fieldConfigList.forEach(childItem=>{
                        // 本来是通过configDefault来判断是否要默认选中，现在产品说恢复默认即为全部选中
                        // if(childItem.configDefault){
                        //     selectedList.push(childItem)
                            item.selectedConfigIds.push(childItem.configId)
                        // } else {
                            childItem.configSelect = true
                        // }
                    })
                })
                this.selectedList = JSON.parse(JSON.stringify(this.defaultConfigList))
                this.configList = JSON.parse(JSON.stringify(configList))
            },
            cancel(){
                this.$emit('update:visible',false)
                this.selectedList = JSON.parse(JSON.stringify(this.backup.selectedList))
                this.configList = JSON.parse(JSON.stringify(this.backup.configList))
            },
            confirm(){
                let params = {
                    unitId: this.unitId,
                    code: this.targetType,
                    fieldConfigList:this.selectedList
                };
                this.isSubmitting = true
                updateUnitFacField(params).then(res => {
                    this.isSubmitting = false
                    if(res.data.code === 0){
                        this.$message.success('配置成功');
                        // 备份数据
                        this.backup.selectedList = JSON.parse(JSON.stringify(this.selectedList))
                        this.backup.configList = JSON.parse(JSON.stringify(this.configList))
                        this.$emit('update:visible',false)
                        this.$emit('confirm')

                    }else{
                        this.$message.error(res.data.msg);
                    }
                });


            },
            // 全选/取消全选操作
            handleCheckAllChange(event,item) {
                let isCheckAll = event.target.checked

                let defaultConfigIds = []

                item.fieldConfigList.forEach(childItem =>{
                    if(isCheckAll){
                        // 如果选中全选，将原来没有选中的，塞到右边selectedList
                        if(!childItem.configSelect){
                            this.selectedList.push(childItem)
                        }
                    } else {
                        // 如果取消全选，将不是默认配置的选项从右边selectedList中移除
                        if(!childItem.configDefault)
                        this.selectedList.splice(this.selectedList.findIndex(item =>item.configId === childItem.configId),1)
                    }
                    // 将不是默认配置的选项设置成跟全选一样的值
                    if(!childItem.configDefault){
                        childItem.configSelect = event.target.checked
                    } else {
                        // 计算不可修改的选项id
                        defaultConfigIds.push(childItem.configId)
                    }
                })

                item.selectedConfigIds = isCheckAll ?item.fieldConfigList.map(item => item.configId) : defaultConfigIds;

            },
            // 选中/取消 单个
            handleCheckedChange(event,item,childItem) {
                if(event.target.checked){
                    this.selectedList.push(childItem)
                    item.selectedConfigIds.push(childItem.configId)
                } else {
                    this.selectedList.splice(this.selectedList.findIndex(item =>item.configId === childItem.configId),1)
                    item.selectedConfigIds.splice(item.selectedConfigIds.findIndex(item=>item ===childItem.configId),1)
                }
                let checkedCount = item.selectedConfigIds.length
                item.moduleSelect = checkedCount === item.fieldConfigList.length
            },
            // 删除选中的字段
            deleteSelected(item,index){
                this.selectedList.splice(index,1)
                for(let i=0;i<this.configList.length;i++){
                   for (let j =0;j<this.configList[i].fieldConfigList.length;j++){
                       if(this.configList[i].fieldConfigList[j].configId === item.configId){
                           this.$set(this.configList[i].fieldConfigList[j],'configSelect',false)
                           return
                       }
                   }
                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .dynamic-column-config{
        .main-wrap{
            display: flex;
            font-size: 12px;
            .main-left,
            .main-right{
                display: flex;
                flex-direction: column;
                width: 450px;
            }
            .main-left{
                min-height: 400px;
                max-height: 500px;

            }
            .main-right{
                width: 170px;
                max-height: 500px;
                margin-left: 12px;
            }
            .main-l-head,
            .main-r-head{
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 32px;
                margin-bottom: 8px;
                .search-input{
                    width: 200px;
                    height: 32px;
                }
            }
            .main-l-body,
            .main-r-body{
                flex: 1;
                overflow-y: auto;
                border:1px solid #DFE6EC;
            }
            .main-l-body{
                &>.check-group{
                    .check-all,
                    .check-list{
                        display: flex;
                        flex-wrap: wrap;
                        border-bottom: 1px solid #DFE6EC;
                        padding:5px 12px 3px;
                        .check-item{
                            width: 25%;
                            margin: 4px 0;
                        }
                    }
                    .check-all{
                        padding:8px 12px 6px ;
                    }
                    &:last-child>.check-list{
                        border-bottom: 0;
                    }
                }
            }
            .main-r-body{
                padding: 6px 12px;
                .item-sort{
                    cursor: pointer;
                    padding: 6px 0;
                }
            }

        }
    }
</style>
<style lang="scss">
    .dynamic-column-config {
        .search-input{
            .el-input__inner{
                height: 32px;
            }
        }
        .el-dialog--small{
            width: 660px;
            top: 15px !important;
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
