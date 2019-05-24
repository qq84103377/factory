<template>
    <div class="materialList-financial-details" v-if="needPayNeedReceiveOrderId">
        <div class="details mgt8">
            <!--应付应收详情-->
            <content-wrap :title="title">
                <div>
                    <el-button @click="goFinanceCentre(1)" :disabled="cancelFlag">{{title=='应收详情'?'收款':'付款'}}</el-button>
                    <el-button @click="goFinanceCentre(2)" :disabled="cancelFlag">对冲</el-button>
                </div>
            </content-wrap>
            <div>
                <el-table
                        :data="tableDetails"
                        border
                        class="custom-table"
                        style="width: 80%">
                    <el-table-column
                            prop="needPayNeedReceiveOrderCode"
                            label="单据号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="dateCreated"
                            label="单据时间"
                            width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dateCreated">{{scope.row.dateCreated.substr(0,19)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="needPayNeedReceiveOrderType"
                            label="单据类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.needPayNeedReceiveOrderType">{{scope.row.needPayNeedReceiveOrderType=='NEED_PAY'?'应付':'应收'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="supplierName"
                            label="供应商">
                    </el-table-column>
                    <el-table-column
                            prop="payOrReceiveAmount"
                            :label="header.lines">
                        <template slot-scope="scope">
                            <span>¥{{scope.row.payOrReceiveAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="verificationOffAmount"
                            :label="header.collection">
                        <template slot-scope="scope">
                            <span>¥{{scope.row.verificationOffAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="balanceDueAmount"
                            label="结欠">
                        <template slot-scope="scope">
                            <span>¥{{scope.row.balanceDueAmount}}</span>
                        </template>

                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--对冲记录-->
        <div class="details">
            <content-wrap title="对冲记录">
            </content-wrap>
            <div>
                <el-table
                        :data="hedgeS"
                        class="custom-table"
                        border
                        style="width: 80%">
                    <el-table-column
                            prop="dateCreated"
                            label="操作时间"
                            width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.dateCreated" :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.dateCreated.substr(0,19)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hedgingAmount"
                            label="对冲金额"
                            width="180">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">¥{{scope.row.hedgingAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="hedgingNeedPayNeedReceiveOrderCode"
                            :label="header.associated">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.hedgingNeedPayNeedReceiveOrderCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="creater"
                            label="操作人">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.updater}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="blue-text"
                                       :disabled="scope.row.orderStatus != 1?true:false"
                                       @click="undo(1,scope.row.hedgingOrderId)">撤销
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--核销记录-->
        <div class="details">
            <content-wrap title="核销记录">
            </content-wrap>
            <div>
                <el-table
                        :data="verification"
                        border
                        class="custom-table"
                        style="width: 100%">
                    <el-table-column
                            prop="journalAccountCode"
                            label="流水号"
                            width="180">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.journalAccountCode}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="dateCreated"
                            label="流水时间"
                            width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.dateCreated" :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.dateCreated.substr(0,19)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="journalAccountType"
                            label="收支类型">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}"
                                  v-if="scope.row.journalAccountType">{{scope.row.journalAccountType=='PAY'?'付款':'收款'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="supplierName"
                            label="供应商">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.supplierName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="journalAccountAmount"
                            label="收支金额">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">¥{{scope.row.journalAccountAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="remitMethodName"
                            label="账户">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.remitMethodName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="creater"
                            label="业务员">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.creater}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="verificationOffAmount"
                            label="核销金额">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">¥{{scope.row.verificationOffAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="备注">
                        <template slot-scope="scope">
                            <span :style="{'color':scope.row.orderStatus != 1? '#c0c4cc':'#000'}">{{scope.row.remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="100" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="blue-text"
                                       :disabled="scope.row.orderStatus == 1?false:true"
                                       @click="undo(2,scope.row.journalAccountVerificationId)">撤销
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!--撤销弹窗-->
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定撤销？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delMaterialSpec()">确 定</nf-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getNeedPayNeedReceiveOrderByMaterialArriveOrderId,//倒料和退料详情对冲核销详情数据
        revokeJournalAccountOrderVerificationRecord,// 撤销流水单核销流水记录
        revokeNeedPayNeedReceiveOrderHedging,// 撤销应付应收单对冲
    } from '../../../api/api.js'

    export default {
        name: "materialList-financial-details",
        props: {
            title: {
                type: String,
                default: ''
            },
            header: {
                type: Object,
                default: ''
            },
            flag: {
                type: String,
                default: ''
            },
            urlSupplier: {
                type: Array,
                default: []
            },
            cancelFlag: {
                type: Boolean,
                default: false
            },
            isSampleMaterial:{
                type: Boolean,
                default: false
            }
        },
        created() {
            this.getNeedPayNeedReceiveOrderByMaterialArriveOrderId();//倒料和退料详情对冲核销详情数据
        },
        data() {
            return {
                tableDetails: [],//应付应收详情
                verification: [],//核销金额数据
                hedgeS: [],//对冲所有数据
                deleVisible: false,//撤销弹窗
                type: '',//撤销标记字段调接口
                journalAccountVerificationId: '',//传给后台的核销id
                hedgingOrderId: '',//对冲id
                needPayNeedReceiveOrderId: '',//付款和对冲跳转的id
                orderStatus: 0,//是否已经撤销
                undoPeople: '',//撤销人
            }
        },
        methods: {
            goFinanceCentre(type) {
                if (this.isSampleMaterial){
                    if( !this.powerJudgement.permissions("fac.arriveOrder.pay")){
                        return
                    }
                }
                else {
                    if( !(this.powerJudgement.permissions("fac.samplePurchaseOrder.buy") ||this.powerJudgement.permissions("fac.sampleArriveOrder.pay"))
                    ){
                        return
                    }
                }
                // // 权限
                // if( !(this.powerJudgement.permissions("fac.arriveOrder.pay")
                //     ||this.powerJudgement.permissions("fac.samplePurchaseOrder.buy")
                //     ||this.powerJudgement.permissions("fac.sampleArriveOrder.pay")
                //     )
                // ){
                //     return
                // }
                let supplierId = '';
                let supplierName = '';
                if(this.urlSupplier.length){
                    supplierId = this.urlSupplier[0].id;
                    supplierName = this.urlSupplier[0].name;
                }
                let origin = window.location.origin;
                let path = '';
                if (type === 1) {
                    // 收款
                    path = '/flowwaterAdd';
                    window.open(origin + '/center-admin/#' + path + '/' + this.needPayNeedReceiveOrderId + '?jumpUseId=' + JSON.parse(sessionStorage.getItem('user_login')).userId + '&type=' + this.flag + '&traderId=' + supplierId + '&traderName=' + supplierName+ '&traderType=SUPPLIER' )
                } else {
                    path = '/materialPurchase/APAR/hedge';
                    window.open(origin + '/center-admin/#' + path + '/' + this.needPayNeedReceiveOrderId + '?jumpUseId=' + JSON.parse(sessionStorage.getItem('user_login')).userId + '&type=' + this.flag + '&traderId=' + supplierId + '&traderName=' + supplierName+ '&traderType=SUPPLIER')
                }
            },
            // 撤销弹框
            undo(type, id) {
                if (type == 1) {
                    this.hedgingOrderId = id;//对冲id
                } else {
                    this.journalAccountVerificationId = id;//核销id
                }
                this.type = type;
                this.deleVisible = true;
            },
            //倒料、退料、采购详情对冲核销详情数据
            getNeedPayNeedReceiveOrderByMaterialArriveOrderId() {
                let params = {
                    billMaterialArriveId: this.$route.query.id
                };
                getNeedPayNeedReceiveOrderByMaterialArriveOrderId(params).then(res => {
                    if (res.data.code == 0) {
                        if (res.data.data) {
                            this.needPayNeedReceiveOrderId = res.data.data.needPayNeedReceiveOrderId
                            this.orderStatus = res.data.data.orderStatus
                            this.undoPeople = res.data.data.updater
                            this.tableDetails.push(res.data.data)
                            this.verification = this.tableDetails[0].journalAccountDTOList ? this.tableDetails[0].journalAccountDTOList : []
                            this.hedgeS = this.tableDetails[0].hedgingOrderDTOList ? this.tableDetails[0].hedgingOrderDTOList : []
                            console.log(this.verification, ' this.verification');
                            this.$emit('orderStatus', this.orderStatus, this.undoPeople)
                            console.log(this.orderStatus,'this.orderStatus');
                            console.log(this.undoPeople,'this.undoPeople');
                        }
                    }
                })
            },
            // 撤销
            delMaterialSpec() {
                if (this.type === 1) {
                    let params = {
                        hedgingOrderId: this.hedgingOrderId,
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                        name: JSON.parse(sessionStorage.getItem("user_info")).name
                    };
                    revokeNeedPayNeedReceiveOrderHedging(params).then(res => {
                        this.tableDetails = []
                        this.deleVisible = false
                        this.getNeedPayNeedReceiveOrderByMaterialArriveOrderId()
                    })
                } else if (this.type === 2) {
                    let params = {
                        journalAccountVerificationId: this.journalAccountVerificationId,
                        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                        name: JSON.parse(sessionStorage.getItem("user_info")).name
                    };
                    revokeJournalAccountOrderVerificationRecord(params).then(res => {
                        this.tableDetails = []
                        this.deleVisible = false
                        this.getNeedPayNeedReceiveOrderByMaterialArriveOrderId()
                    })
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .materialList-financial-details {
        padding: 15px 24px 24px 24px;
    }
</style>
<style lang="scss">
    .materialList-financial-details {
        .details {
            margin-bottom: 24px;
        }
        .content_wrap--head, .content_wrap--content {
            display: inline-block;
        }
        .content_wrap--content {
            float: right;
            padding: 0;
            .el-button {
                width: 64px;
                height: 32px;
                border-radius: 2px;
                padding: 0;
            }
            .el-button:first-child {
                color: #FFA914;
                border: 1px solid #FFA914;
            }
            .el-button:nth-child(2) {
                color: #808080;
                border-radius: 2px;
                border: 1px solid rgba(220, 224, 230, 1);
            }
        }
        .content_wrap {
            padding-bottom: 8px;
        }
        /*.el-table th, .el-table td {*/
            /*padding: 10px;*/
        /*}*/
        .el-dialog__wrapper {
            text-align: center;
            background-color: rgba(0, 0, 0, .3);
            .handle-delete {
                margin-top: 40px;
            }
        }
    }
</style>
