<template>
    <div class="add-materiel">
        <el-dialog
                class="custom-dialog"
                title="按工单添加"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="cancel">
            <div class="main-wrap" v-loading="loading">
                <div class="search-area">
                    <div>
                        <span>搜索</span>
                        <el-input  class="search-input"
                                   @change="handleSearch"
                                   v-model="queryColumn"
                                   placeholder="+ 输入商品款号/生产单号/客户/负责人添加"
                                   icon="search">
                        </el-input>
                    </div>
                </div>
                <el-table
                        @select="handleCheckedChange"
                        @select-all="handleCheckAllChange"
                        ref="searchTable"
                        height="520"
                        :data="searchList"
                        border
                        class="custom-table tiny-row mgt8"
                        style="width: 100%">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="styleNo" label="成衣款号" min-width="100"></el-table-column>
                    <el-table-column prop="facMissionNo" label="工单号" min-width="100"></el-table-column>
                    <el-table-column prop="outsideFactoryName" label="整单外发" min-width="100"></el-table-column>
                    <el-table-column prop="placeorderDate" label="制单日期" min-width="100"></el-table-column>
                    <el-table-column prop="deliveryDate" label="交货日期" min-width="100"></el-table-column>
                    <el-table-column prop="customerName" label="客户" min-width="100"></el-table-column>
                    <el-table-column prop="num" label="订货数" min-width="100"></el-table-column>
                    <el-table-column prop="chargerName" label="负责人" min-width="100"></el-table-column>
                </el-table>
                <div class="text-right mgt8">
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.pageNo" :page-size="page.pageSize"
                                   layout="total, prev, pager, next" :total="page.total">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32" >已选：<span class="orange">{{newSelectedList.length ? newSelectedList.length : selectedIdArr.length}}</span> 条生产单</div>
                <el-button @click="cancel">取 消</el-button>
                <el-button :loading="isSubmitting" @click="confirm" type="primary" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        pageQueryOnMission,
    } from '@/api/material.js'

    export default {
        props: ['visible','selectedIdArr','outsideFactoryId'],

        data() {
            return {
                queryColumn: '',      //搜索词
                searchList:[], //搜索结果
                newSelectedList:[], //新一轮选中的列表
                loading:false,
                isSubmitting:false,
                page:{
                    pageNo:1,
                    pageSize:20,
                    total:0
                },
                previewList:[]
            }
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            // selectedIds(){
            //     return this.newSelectedList.map(item => item.facMissionId)
            // }
        },
        watch:{
            visible(val){
                if(val){
                    // this.newSelectedList = JSON.parse(JSON.stringify(this.selectedIdArr))
                    this.page ={
                        pageNo:1,
                        pageSize:20,
                        total:0
                    }
                    this.newSelectedList = [];
                    this.getSearchList()
                }
            }
        },
        methods: {
            // 关键字搜索
            handleSearch(){
                this.page.pageNo = 1
                this.getSearchList()
            },
            // 页码改变
            handleCurrentChange(pageNo){
                this.page.pageNo = pageNo
                this.getSearchList()
            },
            // 获取列表
            getSearchList(){
                let params = {
                    unitId:this.unitId,
                    queryColumn:this.queryColumn,
                    pageNo:this.page.pageNo,
                    pageSize:this.page.pageSize,
                    outsideFactoryId: this.outsideFactoryId,
                };
                this.loading = true;
                pageQueryOnMission(params).then(res =>{
                    this.loading = false;
                    if(res.data.code == 0){
                        this.page.total = res.data.data.totalCount;
                        this.searchList = res.data.data.list;
                        this.$nextTick(function (e) {
                            let newSelectedListId = this.newSelectedList.map(item => item.facMissionId);
                            this.searchList.forEach(row => {
                                if(this.selectedIdArr.includes(row.facMissionId)){
                                    //勾选
                                    this.$refs.searchTable.toggleRowSelection(row,true);
                                    //去重
                                    if(!newSelectedListId.includes(row.facMissionId)){
                                        this.newSelectedList.push(row)
                                    }
                                }
                            });
                        })
                    }
                })
            },
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.$emit('confirm',this.newSelectedList, 'order');
                this.$emit('update:visible',false)

            },
            // 全选/取消全选操作
            handleCheckAllChange(selection) {
                let isCheckAll = selection.length>0
                if(isCheckAll){
                    selection.forEach(item => {
                        if(!this.selectedIdArr.includes(item.facMissionId)){
                            this.newSelectedList.push(item)
                        }
                    })
                } else {
                    let deleteLineIds = this.searchList.map(item => item.facMissionId)
                    let tempList = []
                    this.newSelectedList.forEach(item =>{
                        if(!deleteLineIds.includes(item.facMissionId)){
                            tempList.push(item)
                        }
                    })
                    this.newSelectedList = tempList
                }
                console.log(this.newSelectedList,'全选后')
            },
            // 选中/取消 单个
            handleCheckedChange(selection,row) {
                let selectedLineIds = selection.map(item => item.facMissionId)
                let isChecked = selectedLineIds.includes(row.facMissionId)
                if(isChecked){
                    this.newSelectedList.push(row)
                } else {
                    this.newSelectedList.splice(this.newSelectedList.findIndex(item => item.facMissionId ==row.facMissionId),1)
                }
                console.log(this.newSelectedList,'某次单选后')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .add-materiel{
        .search-area{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .orange-btn{
            color:#ff9c38 ;
            background: transparent;
            border: 1px solid #ff9c38;
        }
    }
</style>
<style lang="scss">
    .add-materiel {
        .search-input{
            width: 360px;
            .el-input__inner{
                height: 32px;
            }
        }
        .el-dialog--small{
            top: 30px !important;
            width:80%;
            min-width: 1366px;
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
