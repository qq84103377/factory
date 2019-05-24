<template>
    <div id="detail">
        <div class="detail" >
            <page-title v-if="!printShow" title="退回返修单详情" bg>
                <nf-button @click="goBack"><i class="el-icon-arrow-left"></i>返回上级</nf-button>
            </page-title>
            <div v-else class="print-title">
                <div class="print-msg">
                    <span>打印时间：{{currentDate}}</span>
                    <span>打印人：{{userInfo.userName}}</span>
                </div>
                <div class="print-name">退回返修单</div>
            </div>
            <div class="content">
                <div class="repair-count bill-message yellow-border-title mgb10">
                    <h2 class="title">单据信息</h2>
                    <div class="bill-message-wrap">
                        <div class="bill-message-left">
                            <el-row>
                                <el-col :span="6">
                                    <span>单据名称：{{formData.billName}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>单据号：{{formData.billNo}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>单据状态：{{formData.statusName}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>完成人员：{{formData.chargerName}}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">
                                    <span>完成时间：{{formData.dateCompleted}}</span>
                                </el-col>
                                <el-col :span="6">
                                    <span>订单备注：{{formData.remark ? formData.remark : '无'}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="bill-message-right" v-if="!printShow">
                            <span v-if="formData.status === 'PASS'" class="bill-btn cancel" @click="handleCancel(formData.billId)">撤销</span>
                            <span class="bill-btn print" @click="handlePrint">打印</span>
                        </div>
                    </div>
                </div>
                <div class="repair-count yellow-border-title mgb10">
                    <h2 class="title">返修合计:
                        <span>{{styleSum ? styleSum : 0}}款 / {{total ? total : 0}}件</span>
                    </h2>
                    <div class="repair-wrap">
                        <h3>退回返修:</h3>
                        <div class="table-wrap">
                            <repair-table
                                    type="see"
                                    :tableData="repairTableData">
                            </repair-table>
                        </div>

                    </div>
                    <div class="detail-wrap" v-if="detailData.length">
                        <h3>退回明细:</h3>
                        <div
                                v-for="(item, index) in detailData"
                                :key="index"
                                class="detail-msg-list">
                            <div class="detail-msg" style="margin-top: 10px;">
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
                                    <el-col :span="6" style="margin-top: 8px;">
                                        <span>订单号：{{item.prdOrderNo}}</span>
                                    </el-col>
                                    <el-col :span="6" style="margin-top: 8px;">
                                        <span>采购单号：{{item.purchaseOrderNo}}</span>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="table-wrap">
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
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import {
        billInferiorRepairDetails,
        qualityDefectivedDetails,
        billRepairUndo,
    } from '@/api/inferiorMamage';
    import repairTable from '@/components/inferiorMamage/repairTable.vue'
    export default {
        name: "returnRepair",
        data(){
            return{
                isloading: false,
                formData:{
                    chargerId: "",          //完成人员
                    dateCompleted: "",      //完成日期
                    remark: "",             //备注
                },
                styleSum: '',       //款数
                total: '',          //件数
                detailData:[],      //退回明细
                printShow: false,   //打印时显示
                currentDate: '',    //当前时间
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        components:{
            repairTable
        },
        methods:{
            goBack(){
                // this.$router.push({
                //     path:'/allInferiorBill'
                // });
                this.$router.go(-1);
            },
            //获取当前日期时间“yyyy-MM-dd HH:MM”
            getNowFormatDate () {
                let date = new Date();
                let seperator1 = "-";
                let seperator2 = ":";
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + date.getHours() + seperator2 + date.getMinutes();
                return currentdate;
            },
            //撤销
            handleCancel(id){
                let params= {
                    id: id,
                    userId: this.$common.userId()
                };
                billRepairUndo(params).then(res=>{
                    if(res.data.code ===0){
                        this.$message.success(res.data.msg);
                        this.getData();
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //打印
            handlePrint(){
                this.currentDate = this.getNowFormatDate();
                //获取打印人
                this.printShow = true;
                this.$nextTick(() => {
                    this.toPrint();
                });
            },
            //打印方法封装
            toPrint(){
                // 获取dom
                let newstr = document.getElementById('detail').innerHTML;
                // 复制给body
                document.body.innerHTML = newstr;
                // 储存打印前的页面
                let oldstr = document.body.innerHTML;
                // 执行打印功能
                window.print();
                if(this.$route.query.type === 'print'){
                    this.$router.push({
                        path:'/allInferiorBill'
                    });
                    window.location.reload();
                }else{
                    window.location.reload();
                    // 打印完成后重新渲染旧页面
                    document.body.innerHTML = oldstr;
                }
            },

            //获取数据
            async getData(){
                let params= {
                    id: this.$route.query.id
                };
                //次品管理表格-查看详情
                if(this.$route.query.from === 'inferiorMamage'){
                   await qualityDefectivedDetails(params).then(res=>{
                        this.responsive(res);
                    })
                }else{
                    await billInferiorRepairDetails(params).then(res=>{
                        this.responsive(res);
                    })
                }
            },

            responsive(res){
                if(res.data.code ===0){
                    let data = res.data.data;
                    this.styleSum = data.styleSum;
                    this.total = data.total;
                    this.formData = data.defectivedBillInfo ? data.defectivedBillInfo : {};
                    this.repairTableData = data.defectivedRepairListList;
                    this.detailData = data.defectivedRepairDetailList;
                }else{
                    this.$message.error(res.data.msg);
                }
            }
        },
        async mounted(){
            await this.getData();
            if(this.$route.query.type === 'print'){
                //延时执行打印，解决样式没渲染完表格出现滚动条的bug
                window.setTimeout(() => {
                    this.handlePrint()
                },500)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .detail{
        .print-title{
            padding:10px 20px;
            .print-msg{
                text-align: right;
                span{
                    padding-left: 20px;
                }
            }
            .print-name{
                font-size: 22px;
                font-weight: bold;
                text-align: center;
            }
        }
        .content {
            .repair-form{
                padding-left:20px;
            }
            .repair-count{
                padding:20px;
                background-color: #fff;
                margin-bottom: 18px;
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
                    padding: 0 15px;
                    .table-wrap{
                        width: 900px;
                    }
                }
                .detail-wrap{
                    .detail-msg{
                        width: 80%;
                        margin-bottom: 15px;
                        span{
                            font-size: 14px;
                        }
                    }
                }
                &.bill-message{
                    .bill-message-wrap{
                        padding: 0 15px;
                        overflow: hidden;
                    }
                    .bill-message-left{
                        float: left;
                        width: 80%;
                        .el-row{
                            margin: 15px 0;
                        }
                    }
                    .bill-message-right{
                        float: right;
                        .bill-btn{
                            display: inline-block;
                            width: 64px;
                            margin: 0 5px;
                            line-height: 32px;
                            text-align: center;
                            font-size: 12px;
                            border-radius: 2px;
                            cursor: pointer;
                            &.cancel{
                                border: 1px solid #999;
                                color:#999;
                            }
                            &.print{
                                border: 1px solid #ffa914;
                                color:#ffa914;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .detail{
        .el-table{
            font-size: 12px;
        }
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
        .el-table__fixed{
            overflow: hidden !important;
        }
    }
</style>
