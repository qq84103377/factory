<template>
    <section class="mat-inventory">
        <filter-tab typeName="inventory" @filterClick="getDataList"></filter-tab>
        <el-row
                class="mat-middle"
                type="flex"
                justify="space-between"
                align="middle">
            <div class="middle__left">
                <el-input
                        class="search-input"
                        placeholder="输入物料款号/名称、供应商名称/款号搜索"
                        icon="search"
                        v-model.trim="input1"
                        @input='getDataList'>
                </el-input>
            </div>
            <div class="middle__right">
                <nf-button class="in-btn"
                           type="success"
                           size="medium"
                           @click="clickGet"
                >批量入库
                </nf-button>
                <nf-button class="out-btn"
                           type="warning"
                           size="medium"
                           @click="clickStock"
                >批量出库
                </nf-button>
                <nf-button
                        size="medium"
                        @click="handleFeedback">+开余料入库单
                </nf-button>
                <nf-button
                        size="medium"
                        @click="handleMarterielPayoff">+开送料单
                </nf-button>
            </div>
        </el-row>
        <div v-loading="loading">
            <inventory-table
                    :listInfo="tableData"
                    :pageInfo="pageSetting"
                    :filterData="filterData"
                    @select="tableSelect"
                    @pageChange="pageChange"
                    @updateTable="getDataList">
            </inventory-table>
        </div>

        <transition name="opcity">
            <div style="z-index: 999" class="cover" v-show='showCover'>
            </div>
        </transition>
        <!--新建送料单-->
        <transition name="right-move">
            <newFeedBack
                    v-if="showNewFeedBackDialog"
                    source="createNewFeedBack"
                    @cancel="hiddenNewFeedBackDialog"
                    @addSucsess="addNewFeedBackSuccess">
            </newFeedBack>
            <new-pay-off
                    v-if="showNewPayOffDialog"
                    :visible.sync="showNewPayOffDialog"
                    belongModule="0"
                    :materialSkuIds="skuIdArr"
                    @cancel="hiddenNewPayOffDialog"
                    @addSucsess="addNewPayOffSuccess"
                    @success="getDataList"
            ></new-pay-off>
        </transition>
    </section>
</template>

<script>
    import newFeedBack from '@/components/material/materielFeed-back/new-feed-back/new-feed-back';
    import NewPayOff from "@/components/material/materielPay-off/new-pay-off/new-pay-off.vue";
    import {
        getMatInventoryList
    } from "@/api";

    import filterTab from './filter';
    import inventoryTable from './inventory-table';
    export default {
        name: "mat-inventory",
        components: {
            filterTab,
            inventoryTable,
            newFeedBack,
            NewPayOff,
        },
        data() {
            return {
                input1: '',                      //搜索值
                tableData: [],                   //表格数据
                pageSetting: {                   //分页设置
                    pageNo: 1,                   //第几页
                    pageSize: 20,                //每页条数
                    totalCount: 0                //总条数
                },
                filterData: {},                 //筛选组件返回的数据
                loading:false,
                skuIdArr:[],
                showCover: false,
                showNewFeedBackDialog: false,
                showNewPayOffDialog: false,
            }
        },
        computed: {
            //工厂id
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            //用户id
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            //仓库id
            storehouseId() {
                return this.$route.query.storehouseId;
            }
        },
        methods: {
            //新建余料入库单成功回调
            addNewFeedBackSuccess(){
                this.showCover = false;
                this.showNewFeedBackDialog = false;
                this.getDataList()
            },
            hiddenNewFeedBackDialog(){
                this.showCover = false;
                this.showNewFeedBackDialog = false
            },
            //新建送料单成功回调
            addNewPayOffSuccess(){
                this.showCover = false;
                this.getDataList()
            },
            hiddenNewPayOffDialog(){
                this.showCover = false
            },
            //表格勾选
            tableSelect(val){
                this.skuIdArr = val;
            },
            clickGet() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.stock.batchAdd") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push(
                    "/materialInventory/matBatch?isIn=1&storehouseId=" + this.$route.query.storehouseId
                );
            },
            clickStock() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.stock.batchDelete") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push(
                    "/materialInventory/matBatch?isIn=0&storehouseId=" + this.$route.query.storehouseId
                );
            },
            //开余料单
            handleFeedback(){
                this.showCover = true;
                this.showNewFeedBackDialog = true;
            },
            //开送料单
            handleMarterielPayoff(){
                this.showCover = true;
                this.showNewPayOffDialog = true;
            },
            //搜索、筛选
            getDataList(msg) {
                //避免搜索框输入时清空filterData的值
                if (typeof(msg) != "string") {
                    this.filterData = msg;
                }
                let params = {
                    sampleMaterial:msg.sampleMaterial, //是否为样料
                    unitId: this.unitId,                    //工厂id （必须）
                    userId: this.userId,                    //用户id （必须）
                    storehouseId: this.storehouseId,        //仓库id （必须）
                    materialsKindsId: msg.type,             //物料分类id
                    materialsNo: msg.code,                  //物料款号
                    supplierId: msg.supplier,               //供应商id
                    firstDate: msg.firstStartTime,          //入库开始时间
                    endDate: msg.firstEndTime,              //入库结束时间
                    keyword: this.input1,                   //搜索字
                    pageNo: this.pageSetting.pageNo,         //第几页
                    pageSize: this.pageSetting.pageSize,      //每页条数
                    styleIds:msg.associatedProduct,             //关联商品款号
                };
                this.loading = true
                getMatInventoryList(params).then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.list;
                        this.getStyleColor(this.tableData);
                        this.pageSetting.totalCount = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //分页切换
            pageChange(val) {
                let params = {
                    unitId: this.unitId,                            //工厂id （必须）
                    userId: this.userId,                            //用户id （必须）
                    storehouseId: this.storehouseId,                //仓库id （必须）
                    materialsKindsId: this.filterData.type,         //物料分类id
                    materialsNo: this.filterData.code,              //物料款号
                    supplierId: this.filterData.supplier,           //供应商id
                    firstDate: this.filterData.firstStartTime,      //入库开始时间
                    endDate: this.filterData.firstEndTime,          //入库结束时间
                    keyword: this.input1,                           //搜索字
                    pageNo: val,                                      //第几页
                    pageSize: this.pageSetting.pageSize,              //每页条数
                    styleIds:this.filterData.associatedProduct,             //关联商品款号
                };
                //获取之前先清空之前的数据
                this.tableData = [];
                this.loading = true
                getMatInventoryList(params).then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.list;
                        this.getStyleColor(this.tableData);
                        this.pageSetting.totalCount = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //拼接供应商款号/色号
            getStyleColor(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i].supplierStyleNo && val[i].supplierColorNo) {
                        val[i].styleColor = val[i].supplierStyleNo + ' / ' + val[i].supplierColorNo;
                    } else if (val[i].supplierStyleNo) {
                        val[i].styleColor = val[i].supplierStyleNo;
                    } else if (val[i].supplierColorNo) {
                        val[i].styleColor = val[i].supplierColorNo;
                    } else {
                        val[i].styleColor = "";
                    }
                }
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .mat-inventory {
        width: 100%;
        .mat-middle {
            margin-bottom: 16px;
            .search-input {
                width: 320px;
            }
            .in-btn {
                color: #23c811;
                border: 1px solid #23c811;
                background: #e4f8e2;
                &:hover {
                    background: #c7f1c3;
                    border-color: #23c811;
                }
            }
            .out-btn {
                color: #ffa914;
                border: 1px solid #ffa914;
                background: #fff4e2;
                &:hover {
                    background: #ffe9c4;
                    border-color: #ffa914;
                }
            }
        }
    }
</style>
