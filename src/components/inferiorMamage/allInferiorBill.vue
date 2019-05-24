<template>
    <section class="report-bill">
        <page-title class="order-detail__header" title="全部次品管理单据">
            <nf-button @click="goBack"><i class="el-icon-arrow-left"></i>返回上级 </nf-button>
        </page-title>
        <!--筛选-->
        <div class="bill-filter-wrap mb10">
            <all-inferior-bill-filter
                    ref="billFilter"
                    @filter="getBillTableData">
            </all-inferior-bill-filter>
        </div>
        <!--单据表格-->
        <all-inferior-bill-table
                :tableData="tableData"
                @update="billReport">
        </all-inferior-bill-table>
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
    } from "@/api";
    import {
        allInferiorRepairList,
    } from "@/api/inferiorMamage";

    import allInferiorBillFilter from '@/components/inferiorMamage/allInferiorBillFilter.vue';
    import allInferiorBillTable from '@/components/inferiorMamage/allInferiorBillTable.vue';
    export default {
        name: "index",
        data(){
            return{
                tableData: [],
                missionId: this.$route.query.missionId,
                missionPrcdNodeId: this.$route.query.missionPrcdNodeId,
                currentPage: 1,     //当前页
                pageSize: 20,       //每页显示数
                listSum: 0,         //总条数
            }
        },
        components:{
            allInferiorBillFilter,
            allInferiorBillTable,
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
        methods:{
            goBack(){
                this.$router.push({
                    path:'/inferiorMamage'
                });
            },
            //单据表格操作成功后更新数据
            billReport(){
                let val = this.$refs.billFilter.filterData;
                this.getBillTableData(val, 1);
            },
            //获取单据表格数据
            getBillTableData(val, page){
                let params= {
                    unitId: this.$common.unitId(),
                    userId: this.$common.userId(),
                    billType: 'FAC_RETURN_REPAIR',
                    ...val,
                    pageNo: page,
                    pageSize: this.pageSize,
                };
                allInferiorRepairList(params).then(res=>{
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
        mounted(){
            this.handleCurrentChange(1);
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
