<template>
    <div class="bill-table">
        <el-table
                :data="facPrdOrderList"
                border
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="billName"
                    label="单据"
                    width="180">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="billNo"
                    label="单号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="billStatusName"
                    align="center"
                    label="状态">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="dateBusiness"
                    label="业务时间">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.dateBusiness | filter}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="userName"
                    label="业务员">
            </el-table-column>

            <el-table-column
                    align="center"
                    prop="outsideFactoryName"
                    label="外发厂">
            </el-table-column>

            <!--调整单显示调整数量和调整原因-->
            <el-table-column
                    v-if="billType === 'FAC_MISSION_ADJUST'"
                    align="center"
                    prop="reportTotal"
                    label="调整数量">
                <template slot-scope="scope">
                    <span
                            :class="{'orange-text': scope.row.reportTotal}">
                            {{scope.row.reportTotal}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="billType === 'FAC_MISSION_ADJUST'"
                    align="center"
                    label="调整原因">
                <template slot-scope="scope">
                    <span
                            :class="{'orange-text': scope.row.adjustReason}">
                            {{scope.row.adjustReason}}
                    </span>
                </template>
            </el-table-column>

            <!--完成单显示完成数量-->
            <el-table-column
                    v-if="billType === 'FAC_MISSION_COMPLETE'"
                    align="center"
                    label="完成数量">
                <template slot-scope="scope">
                    <span
                            :class="{'orange-text': scope.row.reportTotal}">
                            {{scope.row.reportTotal}}
                    </span>
                </template>
            </el-table-column>

            <!--次品单显示次品数量-->
            <el-table-column
                    v-if="billType === 'FAC_MISSION_DEFECTIVE'"
                    align="center"
                    label="次品数量">
                <template slot-scope="scope">
                    <span
                            :class="{'orange-text': scope.row.defectivedTotal}">
                            {{scope.row.defectivedTotal}}
                    </span>
                </template>
            </el-table-column>

            <!--次品单显示废品数量-->
            <el-table-column
                    v-if="billType === 'FAC_MISSION_WASTE'"
                    align="center"
                    label="废品数量">
                <template slot-scope="scope">
                    <span
                            :class="{'orange-text': scope.row.wastedTotal}">
                            {{scope.row.wastedTotal}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column
                    align="center"
                    prop="lastReviewLog"
                    label="审核备注">
            </el-table-column>
            <el-table-column
                    label="操作"
                    fixed="right"
                    width="200">
                <template slot-scope="scope">
                    <el-button class="operate-btn" @click="goDetail(scope.row)">查看详情</el-button>
                    <span v-if="scope.row.taskName==='NORMAL_REVIEW'">
                         <el-button class="operate-btn" @click="taskPass(scope.row.taskId,true)">通过</el-button>
                         <el-button class="operate-btn" @click="taskUnPassDialogGo(scope.row.taskId)">驳回</el-button>
                    </span>
                    <span v-else>
                             <el-button class="operate-btn agree-btn" @click="taskPass(scope.row.taskId,true)">同意</el-button>
                        <el-button class="operate-btn refuse-btn" @click="taskPass(scope.row.taskId,false)">拒绝</el-button>
                      </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {billReviewConfigStatus, billReportReview} from '@/api'
    export default {
        props:['facPrdOrderList','billType'],
        data(){
            return {

            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        filters:{
            filter(val){
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        methods:{
            //跳转详情
            goDetail(row){
                this.$router.push({
                    path:'/allReportBillDetail',
                    query:{
                        billId: row.billId
                    }
                })
            },
            //通过
            taskPass(taskId,type){
                let obj = {
                    taskId,
                    message:'',
                    result:type,
                    userId:this.userId

                }
                billReportReview(obj).then(res=>{
                    if(res.data.code===0){
                        this.$emit('getNewData');
                        this.$message.success('操作成功')
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //驳回
            taskUnPassDialogGo(taskId){
                this.$emit('taskUnPassDialogGo',taskId)
            },

        },
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
            margin-left: 20px;
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
        .unpass-dialog{
            .el-dialog{
                width: 380px;
                .el-dialog__body{
                    padding: 18px;
                }
                .el-dialog__footer{
                    padding: 12px 0;
                }
            }
        }
    }
</style>
