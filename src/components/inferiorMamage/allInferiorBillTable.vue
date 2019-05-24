<template>
    <div class="bill-table">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    prop="billName"
                    label="单据"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="billNo"
                    label="单号"
                    width="180">
            </el-table-column>
            <el-table-column
                    width="110"
                    label="状态">
                <template slot-scope="scope">
                    <div
                            :class="{
                        'blue-text': renderStatus(scope.row) === 'blue',
                        'green-text': renderStatus(scope.row) === 'green',}">
                        <span>{{scope.row.billStatusName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dateCompleted"
                    label="完成时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="chargerName"
                    width="120"
                    label="完成人员">
            </el-table-column>
            <el-table-column
                    label="外发厂"
                    width="180">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.outsideFactoryNames" :key="index">
                        <span>{{item ? item : '本厂'}}</span>
                        <span v-if="index < scope.row.outsideFactoryNames.length - 1">、</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    label="返修工位">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.repairStations" :key="index">
                        <span>{{item}}</span>
                        <span v-if="index < scope.row.repairStations.length - 1">、</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    label="返修款号">
                <template slot-scope="scope">
                    <span v-for="(item, index) in scope.row.styleNos" :key="index">
                        <span>{{item}}</span>
                        <span v-if="index < scope.row.styleNos.length - 1">、</span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="total"
                    width="120"
                    label="返修数量">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注" width="200">
            </el-table-column>
            <el-table-column
                    label="操作"
                    fixed="right"
                    width="220">
                <template slot-scope="scope">
                    <el-button class="operate-btn" @click="goDetail(scope.row.id)">查看详情</el-button>
                    <el-button class="operate-btn" @click="goDetail(scope.row.id, 'print')">打印</el-button>
                    <el-button v-if="scope.row.status === 'PASS'" class="operate-btn" @click="handleCancel(scope.row.id)">撤销</el-button>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import {
        billRepairUndo,
    } from "@/api/inferiorMamage";
    export default {
        name: "allInferiorBillTable",
        props:['tableData'],
        /******************
         *
         * tableData表格数据
         *
         * ******************/
        data(){
            return {
            }
        },
        methods:{
            //撤销
            handleCancel(id){
                let params= {
                    id: id,
                    userId: this.$common.userId(),
                };
                billRepairUndo(params).then(res=>{
                    if(res.data.code ===0){
                        this.$message.success(res.data.msg);
                        this.$emit('update')
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //跳转详情
            goDetail(id, type){
                this.$router.push({
                    path:'/inferiorMamage/detail',
                    query:{
                        id,
                        type
                    }
                })
            },
            //状态列 显示样式
            renderStatus(row) {
                if (row.status) {
                    if (row.status === 'AUDITING' || row.status === 'PENDING_APPROVAL') {
                        return 'blue'
                    }else if(row.status === 'PASS'){
                        return 'green'
                    }
                }
                return null;
            },

        }
    }
</script>

<style lang="scss" scoped>
    .bill-table{
        .blue-text{
            color: #438DF1;
        }
        .green-text{
            color: #23C811;
        }
        .orange-text{
            color: #FF7F14;
        }
        .operate-btn{
            font-size: 12px;
            padding: 0;
            color: #1CA1FF;
            cursor: pointer;
            background-color: transparent;
            border: none;
            position: relative;
            text-decoration: underline;
            &:before{
                position:absolute;
                top:0;
                left: -10px;
                content:'';
                height:100%;
                width:1px;
                border-left:1px solid rgb(223, 228, 236);
            }
            &:first-child:before{
                border:none;
            }
            &.agree-btn{
                color: #23C811;
            }
            &.refuse-btn{
                color: #FA4150;
            }
            &.cancel-btn{
                color: #808080;
            }
        }
        .el-button + .el-button{
            margin-left: 15px;
        }
    }
</style>
<style lang="scss">
    .bill-table{
        .cancel-line {
            color: #A2ABB8;
        }
    }
</style>
