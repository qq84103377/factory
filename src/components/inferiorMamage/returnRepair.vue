<template>
    <div class="return-repair">
        <div class="repair-header">
            <span>退回返修</span>
            <span class="btns">
                <nf-button @click="cancelClick">取消</nf-button>
                <nf-button type="warning" @click="handleCommit" :loading="isloading">确定</nf-button>
            </span>
        </div>
        <div class="repair-content">
            <div class="repair-form">
                <el-form
                        :model="formData"
                        label-width="80px"
                        inline>
                    <el-row type="flex" justify="space-between">
                        <el-col :span="12">
                            <el-form-item class="dialog__form-item is-required" label="完成人员">
                                <workerLeader :single="'single'" v-model="formData.chargerId" :placeholder="'请选择完成人员'"></workerLeader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-form-item class="dialog__form-item is-required" label="完成日期">
                                <el-date-picker
                                        v-model="formData.dateCompleted"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        @change="handlePickDate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between">
                        <el-form-item class="dialog__form-item" label="备注">
                            <el-input class="remark-input" maxlength="20" v-model="formData.remark"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <div class="repair-count yellow-border-title mgb10">
                <h2 class="title">返修合计:
                    <span>{{styleSum}}款 / {{total}}件</span>
                </h2>
                <div class="repair-wrap">
                    <h3>退回返修:</h3>
                    <repair-table
                            ref="repairTable"
                            type="edit"
                            :tableData="repairTableData">
                    </repair-table>
                </div>
                <div class="detail-wrap">
                    <h3>退回明细:</h3>
                    <div
                            v-for="(item, index) in detailData"
                            :key="index"
                            class="detail-msg-list">
                        <div class="detail-msg">
                            <el-row>
                                <el-col :span="6">
                                    <span>商品款号：{{item.styleNo}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>工单号：{{item.orderNo}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>外发厂：{{item.outSideFactoryName}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>出库仓库：{{item.storehouseName}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <nf-sku-table
                                :showNum="true"
                                :editableAndInitial="true"
                                :metadatas="item.metadatas"
                                :quantities="item.skuList">
                        </nf-sku-table>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog
                title="退回操作出错"
                class="return-dialog"
                :visible.sync="errorDialog"
                :modal-append-to-body="false"
                @close="handleClose">
            <div class="body">
                <ul class="message">
                    <li v-for="(item, index) in errorDialogData" :key="index">{{item}}</li>
                </ul>
            </div>
            <div class="footer">
                <nf-button class="warn-btn" @click="handleClose">取消</nf-button>
                <nf-button class="warn-btn" type="warning" @click="handleClose">确定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        inferiorRepairDetails,
        inferiorRepairConfirm,
    } from '@/api/inferiorMamage';
    import repairTable from '@/components/inferiorMamage/repairTable.vue'
    export default {
        name: "returnRepair",
        props:['defectivedArr','filterData','selectAllFlag'],
        /****************
         *
         * defectivedArr 次品数组
         * filterData 父组件筛选条件
         * selectAllFlag 父组件是否选择了全部数据   0：当前页 1：全部
         *
         * **************/
        data(){
            return{
                isloading: false,
                errorDialog: false,
                errorDialogData: [],
                formData:{
                    chargerId: "",          //完成人员
                    dateCompleted: "",      //完成日期
                    remark: "",             //备注
                },
                styleSum: '',       //款数
                total: '',          //件数
                detailData:[],      //退回明细
            }
        },
        components:{
            repairTable
        },
        methods:{
            cancelClick(){
              this.$emit('handleClose');
            },
            //检查必填数据
            checkCommitData(){
                let status = true;
                if(!this.formData.chargerId){
                    this.$message.error('完成人员不能为空');
                    status = false;
                }else if(!this.formData.dateCompleted){
                    this.$message.error('完成日期不能为空');
                    status = false;
                }
                let data = JSON.parse(JSON.stringify(this.$refs.repairTable.tableData));
                //删除批量选择行的数据
                if(data[0].batchRow){
                    data = data.splice(1, data.length);
                }
                data.forEach(item => {
                    if(!item.nodeId){
                        this.$message.error('退回节点不能为空');
                        status = false;
                    }else if(!item.outsideFactoryId){
                        this.$message.error('退回加工厂不能为空');
                        status = false;
                    } else if(!item.chargerId){
                        this.$message.error('退回工位不能为空');
                        status = false;
                    }
                });
                return status
            },
            //确定
            handleCommit(){
                let status = this.checkCommitData();    //必填检查
                if(status){
                    let defectivedRepairData = this.getRepairTableData();   //退回返修数据
                    let params= {
                        unitId: this.$common.unitId(),
                        userId: this.$common.userId(),
                        defectivedBillInfo: {...this.formData},
                        defectivedRepairListList: defectivedRepairData,
                    };
                    inferiorRepairConfirm(params).then(res=>{
                        if(res.data.code ===0){
                            this.$emit('commit');
                            this.$message.success(res.data.msg);
                        }else if(res.data.code === 2 || res.data.code === 3){
                            this.errorDialogData = res.data.data;
                            this.errorDialog = true;
                        }
                    })
                }
            },
            //获取退回返修表格组件的数据
            getRepairTableData(){
                let data = JSON.parse(JSON.stringify(this.$refs.repairTable.tableData));
                //删除批量选择行的数据
                if(data[0].batchRow){
                    data = data.splice(1, data.length);
                }
                //把本厂id "ALL" 转为空
                data.forEach(item => {
                    if(item.outsideFactoryId === 'ALL'){
                        item.outsideFactoryId = ''
                    }
                });
                return data
            },
            //获取数据
            getData(){
                let params= {
                    defectivedIds: this.defectivedArr,
                    ...this.filterData,
                    selectAllFlag: this.selectAllFlag,
                    unitId:this.$common.unitId()
                };
                inferiorRepairDetails(params).then(res=>{
                    if(res.data.code ===0){
                        let data = res.data.data;
                        this.styleSum = data.styleSum;
                        this.total = data.total;
                        this.formData = data.defectivedBillInfo;
                        this.repairTableData = data.defectivedRepairListList;
                        this.detailData = data.defectivedRepairDetailList;
                        this.initFormData();
                    }
                })
            },
            //关闭弹窗
            handleClose(){
                this.errorDialog = false;
            },
            //完成日期选择
            handlePickDate(val) {
                this.formData.dateCompleted = val;
            },
            //初始化表格数据
            initFormData(){
                //完成人员默认当前账号
                if(!this.formData.chargerId){
                    this.formData.chargerId = this.$common.userId();
                }
                //完成日期默认当天
                if(!this.formData.dateCompleted){
                    this.formData.dateCompleted = this.$common.getNowDate();
                }
            },

        },
        created(){
            this.getData();
        }
    }
</script>

<style lang="scss" scoped>
    .return-repair{
        position: fixed;
        top: 0;
        right: 0;
        width: 1000px !important;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2005;
        .repair-header {
            width: 100%;
            color: #3b3b3b;
            font-size: 18px;
            padding: 15px 20px;
            box-sizing: border-box;
            background-color: #fff;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -ms-flex-align: center;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 2;
            .btns{
                font-size: 14px;
            }
        }
        .repair-content {
            padding: 20px;
            overflow: hidden;
            .repair-form{
                padding-left:20px;
            }
            .repair-count{
                &.yellow-border-title{
                    display: block;
                }
                .title{
                    font-size: 16px;
                }
                h3{
                    margin: 20px 0 15px 0;
                    font-weight: normal;
                    font-size: 15px;
                }
                .repair-wrap, .detail-wrap{
                    padding-left:20px;
                }
                .detail-wrap{
                    .detail-msg-list{
                        margin-bottom: 20px;
                    }
                    .detail-msg{
                        margin-bottom: 15px;
                        span{
                            font-size: 14px;
                        }
                    }
                }
            }
        }
        .return-dialog{
            .message{
                max-height: 215px;
                overflow-y: auto;
                padding: 20px 10px;
                border-top: 1px solid #DFE6EC;
                border-bottom: 1px solid #DFE6EC;
                color:#3b3b3b;
                font-size:14px;
                li{
                    line-height: 26px;
                }
            }
            .warn-btn{
                margin: 0 10px;
            }
        }
    }
</style>
<style lang="scss">
    .return-repair{
        .repair-form{
            .remark-input{
                .el-input__inner{
                    width: 310px;
                }
            }
            .el-form--inline .el-form-item{
                margin-right: 0;
            }
        }
        .return-dialog{
            .el-dialog--small{
                width: 550px;
                .el-dialog__header{
                    padding: 20px 10px 10px;
                    text-align: center;
                }
                .el-dialog__body{
                    padding: 0;
                    text-align: center;
                    .footer{
                        padding: 15px 0;
                    }
                }
            }
        }
    }
</style>
