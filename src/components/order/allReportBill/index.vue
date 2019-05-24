<template>
    <section class="report-bill">
        <page-title class="order-detail__header" title="全部上报单据">
            <nf-button @click="goBack">
                <i class="el-icon-arrow-left"></i>返回上级</nf-button>
        </page-title>
        <!--单据信息-->
        <div class="bill-info-wrap mb10">
            <bill-info :missionInfo="missionInfo"></bill-info>
        </div>
        <!--单据筛选-->
        <div class="bill-filter-wrap mb10">
            <bill-filter
                ref="billFilter"
                :missionId="missionId"
                :missionPrcdNodeId="missionPrcdNodeId"
                @filter="getBillTableData">
            </bill-filter>
        </div>
        <!--单据表格-->
        <bill-table
                :type="type"
                :tableData="tableData"
                @commit="billReport">
        </bill-table>
        <!--分页-->
        <div class="bill-page">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="listSum"
                    layout="total, prev, pager, next">
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import {
        getFacMission,
        billReportList,
    } from "@/api";
    import billInfo from '@/components/order/allReportBill/billInfo.vue';
    import billFilter from '@/components/order/allReportBill/billFilter.vue';
    import billTable from '@/components/order/allReportBill/billTable.vue';
    export default {
        name: "index",
        data(){
            return{
                missionInfo:{},
                tableData: [],
                type: this.$route.query.type,
                missionId: this.$route.query.missionId,
                missionPrcdNodeId: this.$route.query.missionPrcdNodeId,
                currentPage: 1,     //当前页
                pageSize: 20,       //每页显示数
                listSum: 0,         //总条数
            }
        },
        components:{
            billInfo,
            billFilter,
            billTable,
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
        methods:{
            goBack(){
                this.$router.go(-1);
            },
            //单据表格操作成功后更新数据
            billReport(){
                let val = this.$refs.billFilter.filterData;
                this.getBillTableData(val, 1);
            },
            //获取商品信息
            fetchFacMissionInfo() {
                getFacMission({
                    facId: this.facId,
                    missionId: this.missionId
                }).then(async res => {
                    if (res.data.code === 0) {
                        this.missionInfo = res.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //获取单据表格数据
            getBillTableData(val, page){
                let params= {
                    ...val,
                    pageNo: page,
                    pageSize: this.pageSize,
                };
                billReportList(params).then(res=>{
                    if(res.data.code ===0){
                        this.tableData = res.data.data.list;
                        this.listSum = res.data.data.totalCount;
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //分页切换
            handleCurrentChange(page) {
                let val = this.$refs.billFilter.filterData;
                this.getBillTableData(val, page);
            },
        },
        created(){
            this.fetchFacMissionInfo();
        },
    }
</script>

<style lang="scss" scoped>
    .report-bill{
        .mb10{
            margin-bottom: 10px;
        }
        .bill-page{
            text-align: right;
            margin: 15px 0;
        }
    }
</style>