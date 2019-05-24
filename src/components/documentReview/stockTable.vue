<template>
    <section class="stock-table">
        <el-table
                border
                :data="facPrdOrderList"
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="orderNo"
                    label="单据号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="storehouseName"
                    label="仓库">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="operateTypeText"
                    label="单据类型">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="operaterName"
                    label="操作人">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="dateOperate"
                    label="操作日期">
                <template slot-scope="scope">
                    <span v-if="scope.row.dateOperate">{{scope.row.dateOperate.substr(0,10)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="facMissionNo"
                    label="工单号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="customerName"
                    label="客户">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="总计数量">
                <template slot-scope="scope">
                    <span v-if="scope.row.operateTypeText=='调整'">-{{scope.row.subtractNum}}/+{{scope.row.addNum}}</span>
                    <span v-else>{{scope.row.num}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="amount"
                    label="总计金额">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="reviewStatusText"
                    label="审核状态">
            </el-table-column>
            <el-table-column prop="zip" label="操作" fixed="right" width="200" class-name="cellHeight" align="center">
                <template slot-scope="scope">
                    <div style="color: #1CA1FF;display: flex;justify-content: space-between;align-items: center;height: 100%;padding: 0 10px;cursor: pointer;">
                        <div @click="$router.push(`/stockDetail?id=${scope.row.id}&type=${scope.row.operateTypeText=='调整'?2:3}&storehouseId=${$parent.filterFormData.storehouseId}`)">查看</div>
                        <!--<div class="blue"  @click="$emit('taskPass',scope.row.taskId,true,scope.row)">通过</div>-->
                        <!--<div class="blue" @click="$emit('taskUnPassDialogGo',scope.row.taskId,false,scope.row)">驳回</div>-->


                        <div @click="$emit('taskPass',scope.row.taskId,true,scope.row)">
                            <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='NORMAL_REVIEW'">通过</el-button>
                            <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='ANTI_REVIEW'">批准</el-button>
                        </div>
                        <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='NORMAL_REVIEW'" @click="$emit('taskUnPassDialogGo',scope.row.taskId,scope.row)">驳回</el-button>
                        <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='ANTI_REVIEW'" @click="$emit('taskPass',scope.row.taskId,false,scope.row)">不批准</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    export default {
        props: ['facPrdOrderList'],
        data() {
            return {
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
    .opr-btn{
        font-size: 12px;
        padding: 0;
        color: #1CA1FF;
        cursor: pointer;
        background-color: transparent;
        border: none;
    }
</style>