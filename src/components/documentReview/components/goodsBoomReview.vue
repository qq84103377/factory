<template>
    <div class="orderProduction-table">
        <el-table
                :data="facPrdOrderList"
                border
                class="mission"
                key="mission"
                style="width: 100%">

            <el-table-column prop="opTypeText" label="操作类型" width="160" align="center"></el-table-column>
            <el-table-column prop="styleNo" label="商品款号" width="160" align="center"></el-table-column>
            <el-table-column prop="name" label="BOM名称" width="160" align="center"></el-table-column>
            <el-table-column prop="operateDate" label="操作时间" width="240" align="center"></el-table-column>
            <el-table-column prop="reviewStatusText" label="状态" width="160" align="center"></el-table-column>
            <el-table-column prop="reviewRemark" label="审批备注"  align="center" min-width="160"></el-table-column>
            <el-table-column prop="zip" label="操作" fixed="right" width="220" class-name="cellHeight" align="center">
                <template slot-scope="scope">
                    <div class="opera">
                        <el-button class="blue" @click="goDetail(scope.row)">查看</el-button>
                        <!--<div class="blue" @click="check(scope.row)">转工单</div>-->
                        <div @click="taskPass(scope.row.taskId,true,scope.row)">
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'">通过</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='ANTI_REVIEW'">批准</el-button>
                        </div>
                        <div>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'" @click="taskUnPassDialogGo(scope.row.taskId,scope.row)">驳回</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" @click="taskPass(scope.row.taskId,false,scope.row)" v-if="scope.row.taskName==='ANTI_REVIEW'">不批准</el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import {billReviewConfigStatus} from '@/api'
    export default {
        name: "orderTable",
        props:{
            facPrdOrderList:Array,
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        methods:{
            //跳转详情页面
            goDetail(id){
                this.$emit('goDetail',id)
                // let type='formal';
                // this.$router.push({
                //     path:'/orderProductioDetail',
                //     query:{id,type},
                //
                // })
            },
            //通过
            taskPass(taskId,type,row){
                this.$emit('taskPass',taskId,type,row)
                // let obj = {
                //     taskId,
                //     message:'',
                //     result:type,
                //     userId:this.userId
                //
                // }
                // billReviewConfigStatus(obj).then(res=>{
                //     console.log(res);
                //     if(res.data.code===0){
                //         this.$emit('getNewData');
                //         this.$message.success('操作成功')
                //     }else {
                //         this.$message.error(res.data.msg)
                //     }
                //
                // })
            },
            //驳回
            taskUnPassDialogGo(taskId,row){
                this.$emit('taskUnPassDialogGo',taskId,row)
            },
        }
    }
</script>

<style scoped lang="scss">
    .orderProduction-table {
        margin-top: 16px;
    .opera {
        display: flex;
        justify-content: space-between;
        /*justify-content: center;*/
        align-items: center;
        /*padding: 0 24px;*/
        box-sizing: border-box;
        height: 100%;
    }
    .line {
        height: 32px;
        width: 1px;
        background-color: rgba(230, 234, 240, 1);
    }
    .blue {
        font-size: 12px;
        display: flex;
        /*justify-content: space-between;*/
        justify-content: center;
        align-items: center;
        color: #1CA1FF;
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
        height: 100%;
        border: none;
        background-color: transparent
    }
        .cell__row {
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child {
                border: none;
            }
        }
    }
</style>
<style lang="scss">
    @import '../../../assets/style/el-table.scss';
    .orderProduction-table {
        .el-table td .cell {
            line-height: 18px;
            padding: 0;
        }
    }
    .cellHeight .cell{
        height: 100%;
    }
</style>