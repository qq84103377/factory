<template>
    <section class="adjust-order" :class="{'rightMoveComponent':fromType==='purchaseNeed'}">
        <page-title :title="type==3?'调整单详情':'开调整单'">
            <!--<nf-button @click="changeStatusCallback()">sdad</nf-button>-->
            <nf-button @click="fromType==='purchaseNeed'?$emit('toggle'):$router.go(-1)">{{type==3?'返回':'取消'}}</nf-button>
            <nf-button :loading="btnLoading" v-if="type != 3&&billReviewConfig" style="color: #FFA914;border-color: #FFA914;" @click="handleSubmit(false)">{{type==2?'保存':'存草稿'}}</nf-button>
            <nf-button :loading="btnLoading" v-if="type != 3" type="warning" svg="icon-btn-add" @click="handleSubmit(true)">{{billReviewConfig?'提报':'生成单据'}}</nf-button>
        </page-title>

        <base-box>
            <div style="position: relative;" class="yellow-border-title">
                <div class="title">调整单信息</div>
                <div v-if="type==3&&adjustDetail.status!=5" style="position: absolute;right: 0;top: 0;">
                    <el-popover
                            ref="popover2"
                            placement="bottom"
                            trigger="click">
                        <div style="font-size: 14px;color: #808080;text-align: center;cursor: pointer;">
                            <div style="line-height: 32px;border-bottom: 1px solid #BFCBD9;"
                                 @click="$router.push(`/adjustOrder?id=${$route.query.id}&type=2`)">修改单据
                            </div>
                            <div :loading="btnLoading" style="line-height: 32px;" @click="cancel">作废单据</div>
                        </div>
                    </el-popover>
                    <nf-button v-show="adjustDetail.status==0||adjustDetail.status==4" v-popover:popover2>更多</nf-button>
                    <div style="margin-bottom: 8px;" v-if="adjustDetail.status==1&&hasPower&&billReviewConfig">
                        <nf-button @click="taskPass(adjustDetail.taskId,true)" :loading="btnLoading" type="success">通过</nf-button>
                        <nf-button @click="reason='';taskUnPassDialog=true;" :loading="btnLoading" type="danger">驳回</nf-button>
                    </div>
                    <div style="margin-bottom: 8px;" v-if="adjustDetail.status==3&&hasPower&&billReviewConfig">
                        <nf-button @click="taskPass(adjustDetail.taskId,true)" :loading="btnLoading" type="success">批准</nf-button>
                        <nf-button @click="taskPass(adjustDetail.taskId,false)" :loading="btnLoading" type="danger">不批准</nf-button>
                    </div>
                    <print-template-btn name="" type="order" :id="$route.query.id"></print-template-btn>
                    <!-- status：1【待审核】3【反审待审批】 -->
                    <nf-button :loading="btnLoading" @click="handleUndo" v-if="adjustDetail.status==1 || adjustDetail.status==3" type="warning">
                        <span v-if="adjustDetail.status==1">撤回提报</span>
                        <span v-if="adjustDetail.status==3">撤回申请</span>
                    </nf-button>
                    <nf-button :loading="btnLoading" @click="reason='';applyReviewDialog = true" v-if="adjustDetail.status==2&&billReviewConfig" type="warning">申请反审</nf-button>
                    <nf-button :loading="btnLoading" @click="undoAdjustOrder" v-if="adjustDetail.status==2&&!billReviewConfig" type="warning">驳回单据</nf-button>
                    <nf-button :loading="btnLoading" @click="statusSubmit" v-if="billReviewConfig&&(adjustDetail.status==0||adjustDetail.status==4)" type="warning" >提报</nf-button>
                    <nf-button :loading="btnLoading" @click="doAdjustOrder" v-if="!billReviewConfig&&adjustDetail.status==4" type="warning" >生成单据</nf-button>
                </div>
                <div v-if="type==3&&adjustDetail.status==5" class="icon-disabled"></div>
            </div>
            <el-form v-if="type != 3" class="adjust-order__form">
                <el-form-item label-width="80px" class="form-item" required label="调整单号">
                    <el-input :disabled="type == 2" v-model="orderInfo.prdOrderAdjustNo" placeholder="请输入调整单号"></el-input>
                </el-form-item>
                <el-form-item label-width="80px" class="form-item" required label="制单日期">
                    <el-date-picker
                            :disabled="type == 2"
                            v-model="orderInfo.dateCreated"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label-width="80px" class="form-item remark" style="display: block;" label="制单备注">
                    <el-input type="textarea" v-model="orderInfo.remark" placeholder="选填"></el-input>
                </el-form-item>
            </el-form>
            <div class="content-form" v-if="type==3">
                <span>调整单号: {{adjustDetail.orderNo}}</span>
                <span>制单日期: {{adjustDetail.placeorderAt.substr(0,10)}}</span>
                <span>单据状态: {{handleStatus(adjustDetail.status)}}</span>
            </div>
            <div class="content-form" v-if="type==3">
                订单备注:<span v-html="adjustDetail.remark.replace(/\n/g,'<br/>')"></span>
                <span>审批备注: {{adjustDetail.statusRemark}}</span>
            </div>
        </base-box>

        <base-box style="margin-top: 8px;">
            <div class="yellow-border-title">
                <div class="title">订单信息</div>
            </div>
            <div class="content-form">
                <span>订单号: {{facPrdOrder.orderNo}}</span>
                <span>制单日期: {{facPrdOrder.placeorderAt.substr(0,10)}}</span>
                <span v-if="facPrdOrder.isOutsideFac">外发厂: {{facPrdOrder.commonOutsideFactoryName}}</span>
                <span>下单类型: {{facPrdOrder.type==0?'预下单':facPrdOrder.type==1?'生产订单':'调整单'}}</span>
            </div>
            <div class="content-form">
                <span>订单状态: {{handleStatus(facPrdOrder.status)}}</span>
                <span>订单备注: {{facPrdOrder.remark}}</span>
                <span>审批备注: {{facPrdOrder.statusRemark}}</span>
            </div>
        </base-box>

        <base-box v-for="(item,index) in facPrdOrder.facPrdOrderGoodsList" :key="index" style="margin-top: 8px;">
            <div class="yellow-border-title">
                <div class="title">调整商品： {{item.styleNo}}
                    <span v-if="item.styleName != null && item.styleName != ''">-{{item.styleName}}</span>
                    <!--<span v-if="type!=3" style="font-size: 12px;color: #A2ABB8">({{item.tabIndex?'增加订货数':'减少订货数'}})</span>-->
                </div>
                <!--<div class="tab" v-if="type!=3">-->
                    <!--<span v-for="(tabItem,i) in tab" :key="i" @click="toggleTab(index,i)"-->
                          <!--:class="['tab-select',{active:item.tabIndex==i}]">{{tabItem}}</span>-->
                <!--</div>-->
            </div>
            <div class="content-form">
                <!--<span>商品: {{item.styleNo}}</span>-->
                <span>厂商货号: {{item.plantArticleNumber}}</span>
                <span>货期: {{item.deliveryAt.substr(0,10)}}</span>
                <span v-if="facPrdOrder.isOutsideFac">单价: {{item.processUnitPrice}}元/件</span>
            </div>
            <div class="content-form" v-if="type!=3">
                <span>订货总数: {{item.totalNum}}</span>
                <span v-if="facPrdOrder.isOutsideFac">加工金额小计: ¥{{(item.totalNum * item.processUnitPrice).toFixed(2)}}</span>
            </div>
            <!--<div style="margin-top: 16px;padding-left: 10px;" v-if="item.commonBom&&item.commonBom.commonMaterialsMainSkuList&&item.commonBom.commonMaterialsMainSkuList.length">-->
            <div style="margin-top: 16px;padding-left: 10px;" v-if="item.commonBom">
                <p style="margin-bottom: 12px;">主物料：</p>
                <el-table
                        border
                        :data="item.commonBom.commonMaterialsMainSkuList"
                        style="width: 100%">
                    <el-table-column
                            prop="styleQuantity"
                            label="订货数"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="preActualNum"
                            label="预估实裁数"
                            width="120">
                        <template slot-scope="scope">
                            <span :style="{color:scope.row.preActualNum>0?'green':'red'}">{{scope.row.preActualNum}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="differenceValue"
                            label="预估差值"
                            width="100">
                        <template slot-scope="scope">
                            <span  :style="{color:scope.row.differenceValue>0?'green':'red'}">{{scope.row.differenceValue}}</span>

                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="adjustmentDifference"
                            label="调后差值"
                            width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.differenceValue&&scope.row.adjustmentDifference">{{scope.row.differenceValue-scope.row.adjustmentDifference}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column label="图片"  width="80">
                        <template slot-scope="scope">
                            <div>
                                <img style="width:25px;height: 25px;vertical-align: middle;cursor:pointer;"
                                     v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                     @click="imgList(scope.row)"
                                     :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                     alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="分类/物料款号/名称/颜色/规格"
                            width="240">
                        <template slot-scope="scope">
                            <span>{{scope.row.kindsName}}/{{scope.row.materialsNo}}/{{scope.row.materialsName}}/{{scope.row.colorName}}/{{scope.row.specificationsName}}/</span>

                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="styleColorNames"
                            label="用于货品颜色"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="styleSizeNames"
                            label="用于货品尺码"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            prop="styleStandardNames"
                            label="用于货品内长"
                            width="140">
                    </el-table-column>
                    <el-table-column
                            width="100"
                            prop="quantityPurchaseDemand"
                            label="物料需求">
                    </el-table-column>
                    <el-table-column
                            width="100"
                            prop="quantityArrived"
                            label="已到料">
                    </el-table-column>
                    <el-table-column
                            width="100"
                            prop="singleDosage"
                            label="单件用量">
                    </el-table-column>
                    <el-table-column
                            width="70"
                            prop="lossRate"
                            label="损耗">
                    </el-table-column>
                </el-table>
            </div>
            <div style="margin-top: 16px;">
                <span style="margin: 0px 100px 0 8px">调整总数: {{item.totalCount}}件</span>
                <span style="color: #999">提示：输入正数指按增加调整，如：10，输入负数指按减少调整，如：-10</span>
            </div>

            <nf-sku-table
                    :ref="`table${index}`"
                    :metadatas="item.skuList"
                    style="margin-top: 16px;margin-left: 8px;"
                    @change="(a,b,c) => { countTotalNum(a,b,c,item) }   "
                    :quantities="item.facPrdOrderGoodsDetailList"
                    showNum
                    :editable="!item.facPrdOrderGoodsCustomerList.length&&type!=3"
                    editableAndInitial
                    isAdjust
            ></nf-sku-table>

            <div v-if="item.facPrdOrderGoodsCustomerList.length" style="margin-top: 16px;cursor: pointer;"
                 @click="$set(item,'fold',!item.fold)">不同客户订货明细 <i class="icon"
                                                                   :class="[item.fold ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
            </div>
            <div v-show="item.fold" v-for="(cus,cusIndex) in item.facPrdOrderGoodsCustomerList" :key="cusIndex">
                <div style="margin: 8px 0;padding: 12px;border: 1px solid #DFE6EC;background: #FCFCFC;display: inline-block;">
                    <div>
                        <span>客户: {{cus.custName}}</span>
                        <span>调整合计: {{cus.totalCount}}件</span>
                    </div>

                    <nf-sku-table
                            :ref="`table${index}cus${cusIndex}`"
                            :metadatas="item.skuList"
                            style="margin-top: 16px;margin-left: 8px;"
                            pageAttributes="multiComponent"
                            @change="(a,b,c) => { customerGetNum(a,b,c,item,cus) }   "
                            :quantities="cus.facPrdOrderGoodsCustomerDetailList"
                            :skuListCustomerIndex="cusIndex"
                            showNum
                            :editable="type!=3"
                            editableAndInitial
                            isAdjust
                    ></nf-sku-table>
                </div>

            </div>
        </base-box>

        <!--驳回弹窗-->
        <el-dialog title="驳回单据" class="custom-dialog unpass-dialog" size="tiny" :visible.sync="taskUnPassDialog" >
            <div style="display: flex;">
                <p style="white-space: nowrap">驳回原因：</p>
                <el-input type="textarea" rows="6" v-model="reason" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="taskUnPassDialog = false">取消</nf-button>
                <nf-button type="warning" @click="taskPass(adjustDetail.taskId,false,reason)" :loading="btnLoading">确定</nf-button>
            </div>
        </el-dialog>
        <!--申请反审弹窗-->
        <el-dialog title="申请反审" class="custom-dialog unpass-dialog" size="tiny" :visible.sync="applyReviewDialog" >
            <div style="display: flex;">
                <p style="white-space: nowrap">申请反审原因：</p>
                <el-input type="textarea" rows="6" v-model="reason" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="applyReviewDialog = false">取消</nf-button>
                <nf-button type="warning" @click="handelAntiReview" :loading="btnLoading">确定</nf-button>
            </div>
        </el-dialog>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    </section>
</template>

<script>
    import {
        undoAdjustOrder,
        doAdjustOrder,
        adjustPrdOrderReview,
        facPrdOrderDetail,
        getGoodSkuList,
        addAdjustPrdOrder,
        updateAdjustOrder,
        adjustPrdOrderDetail,
        billReviewConfig,
        adjustPrdOrderUndo,
        adjustPrdOrderAntiReview,
        facPrdOrderCancel,
        materialGetDemands,
        adjustPrdOrderSubmit
    } from '@/api/api'
    import Utils from "../../../utils/format";
    import printTemplateBtn from '@/components/material/printTemplateBtn' //打印

    export default {
        props:['fromType'],
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                reason: '',
                taskUnPassDialog: false,//驳回弹窗
                applyReviewDialog: false,//申请反审弹窗
                btnLoading: false,
                test: false,
                billReviewConfig: false,
                hasPower: false,
                facPrdOrder: {placeorderAt: ''},
                loading: false,
                tabIndex: 0,
                tab: ['按减少订货数填数', '按增加订货数填数'],
                orderInfo: {
                    prdOrderAdjustNo: '',
                    dateCreated: new Date(),
                    remark: ''
                },
                adjustDetail: {}
            }
        },
        watch: {
            type(v) {
               if(v == 2){
                  this.orderInfo.prdOrderAdjustNo = this.adjustDetail.orderNo
                  this.orderInfo.dateCreated = this.adjustDetail.placeorderAt
                  this.orderInfo.remark = this.adjustDetail.remark
               }
            }
        },
        components: {printTemplateBtn},
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            type() {
                //  3 详情  2 编辑  1 新建
                if(this.fromType==='purchaseNeed'){
                    return 1
                }
                return this.$route.query.type
            },
            unitId: function () {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
        },
        methods: {
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if(row.commonMaterialsPictureList&&row.commonMaterialsPictureList.length>0){
                    if(row.commonMaterialsPictureList[0].path){
                        this.imgIndex = 0;
                        this.imgLists = row.commonMaterialsPictureList;
                    }else {
                        this.imgLists = []
                        row.commonMaterialsPictureList.forEach(item =>{
                            this.imgLists.push({path:item})
                        })
                    }
                }
                this.centerDialogVisible = true;
            },
            // 未配置审核台已通过状态驳回单据
            undoAdjustOrder() {
                this.btnLoading = true
                undoAdjustOrder({facPrdOrderId:this.$route.query.id}).then(res => {
                    this.btnLoading = false
                    if(res.data.code===0){
                        this.$message.success('操作成功')
                        this.changeStatusCallback()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 未配置审核台已驳回状态生成单据
            doAdjustOrder() {
                this.btnLoading = true
                doAdjustOrder({facPrdOrderId:this.$route.query.id}).then(res => {
                    this.btnLoading = false
                    if(res.data.code===0){
                        this.$message.success('操作成功')
                        this.changeStatusCallback()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //通过
            taskPass(taskId,type,message=''){
                this.btnLoading = true
                let obj = {
                    taskId,
                    message,
                    result:type,
                    userId:this.userId
                }
                adjustPrdOrderReview(obj).then(res=>{
                    this.btnLoading = false
                    if(res.data.code===0){
                        this.taskUnPassDialog = false
                        this.$message.success('操作成功')
                        this.changeStatusCallback()
                    }else {
                        this.$message({
                            type: 'error',
                            message: this.$createElement('p',{style: 'white-space: inherit'},res.data.msg)
                        })
                    }

                })
            },
            // 提报
            statusSubmit() {
                this.btnLoading = true
                adjustPrdOrderSubmit({facPrdOrderId:this.$route.query.id,userId:this.userId}).then(res => {
                    this.btnLoading = false
                    if(res.data.code===0){
                        this.changeStatusCallback()
                        this.$message({
                            type: 'success',
                            message: '提报成功!'
                        });
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 作废
            cancel() {
                this.btnLoading = true
                let para = {
                    facPrdOrderId: this.$route.query.id,
                    unitId: this.unitId,
                    userId: this.userId
                };
                facPrdOrderCancel(para).then(res=>{
                    this.btnLoading = false
                    if(res.data.code===0){
                        this.changeStatusCallback()
                        this.$message({
                            type: 'success',
                            message: '作废成功!'
                        });
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //申请反审
            handelAntiReview() {
                this.btnLoading = true
                const params = {
                    facPrdOrderId: this.$route.query.id,
                    message: this.reason,
                    userId: this.userId
                }
                adjustPrdOrderAntiReview(params).then(res => {
                    this.btnLoading = false
                    if(res.data.code==0){
                        this.applyReviewDialog = false;
                        this.$message.success('申请成功')
                        this.changeStatusCallback()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 撤回
            handleUndo() {
                this.btnLoading = true;
                let para = {
                    userId: this.userId,
                    facPrdOrderId: this.$route.query.id
                };
                adjustPrdOrderUndo(para).then(res => {
                    this.btnLoading = false
                    if(res.data.code==0){
                        this.$message.success('撤回成功')
                        this.changeStatusCallback()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //是否有审核台
            getBillReviewConfig(){
                billReviewConfig({unitId:this.unitId}).then(res=>{
                    if(res.data.data.configs && res.data.data.configs.length>0){
                        //是否有审核台
                        this.billReviewConfig = res.data.data.configs.some(v => v.billType === 'FAC_PRD_ORDER_ADJUST')
                    }
                })
            },
            handleStatus(status) {
                switch (status) {
                    case 0 : return '草稿';
                    case 1 : return '待审核';
                    case 2 : return '已通过';
                    case 3 : return '反审核待批准';
                    case 4 : return '已驳回';
                    case 5 : return '已作废';
                    case 6 : return '不可反审';
                }
            },
            handleCheckRequire() {
              if(this.orderInfo.prdOrderAdjustNo==='') {
                 this.$message.error('请输入调整单号')
                  return true
              }
              if(this.orderInfo.dateCreated==='') {
                  this.$message.error('请选择制单日期')
                  return true
              }
              return false
            },
            handleSubmit(submit) {
                if(this.handleCheckRequire()) return
                this.btnLoading = true
                let facPrdOrderAdjustGoods = this.facPrdOrder.facPrdOrderGoodsList.map((v, i) => {
                        let facPrdOrderGoodsDetailList = []
                        let facPrdOrderGoodsCustomerList = []
                        if (!v.facPrdOrderGoodsCustomerList.length) {
                            //无客户
                            const skuValue = this.$refs[`table${i}`][0].getSkuTableValue()
                            for (let k in skuValue) {
                                facPrdOrderGoodsDetailList.push({skuId: skuValue[k].skuId, num: skuValue[k].num})
                            }
                        } else {
                            v.facPrdOrderGoodsCustomerList.forEach((item, index) => {
                                const cusSkuValue = this.$refs[`table${i}cus${index}`][0].getSkuTableValue()
                                let facPrdOrderGoodsCustomerDetailList = []
                                for (let k in cusSkuValue) {
                                    facPrdOrderGoodsCustomerDetailList.push({
                                        skuId: cusSkuValue[k].skuId,
                                        num: cusSkuValue[k].num
                                    })
                                }
                                facPrdOrderGoodsCustomerList.push({
                                    facPrdOrderGoodsCustomerId: item.facPrdOrderGoodsCustomerId,
                                    commonCustomerId: item.commonCustomerId,
                                    facPrdOrderGoodsCustomerDetailList
                                })

                            })
                        }
                        return {
                            facPrdOrderGoodsId: v.facPrdOrderGoodsId,
                            adjustType: 1,
                            facPrdOrderGoodsCustomerList,
                            facPrdOrderGoodsDetailList
                        }
                    })

                let params = {
                    ...this.orderInfo,
                    dateCreated: this.type == 1? Utils.formatDate(this.orderInfo.dateCreated, "yyyy-MM-dd"):this.orderInfo.dateCreated.substr(0,10),
                    prdOrderId: this.$route.query.id,
                    unitId: this.unitId,
                    userId: this.userId,
                    facPrdOrderAdjustGoods,
                    submit,
                    adjustType:1,
                    inverseDemand:this.fromType==='purchaseNeed'
                }
                console.log(params,'参数');
                let api = this.type == 1?addAdjustPrdOrder:updateAdjustOrder
                api(params).then(res => {
                    this.btnLoading = false
                    if(res.data.code==0) {
                        this.$message.success(this.type == 1?'新建成功':'编辑成功')
                        if(this.type == 2) {
                            this.adjustDetail.remark = this.orderInfo.remark
                            // this.getAdjustDetail()
                        }
                        if(this.fromType==='purchaseNeed'){
                            this.$emit('toggle')
                        }else {
                            this.$router.go(-1)

                        }
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 修改客户的数量
            customerGetNum(val, totalQuality, skuListCustomerIndexSx, orderItem, cus) {
                this.$set(cus, 'totalCount', orderItem.tabIndex ? totalQuality : -totalQuality)
                // if (totalQuality == 0) return;
                if (JSON.stringify(val) == "{}") return;
                /*
                val 返回的id和num数据
                totalQuality  总数量
                skuListCustomerIndexSx 传过去的 index的值
                */
                orderItem.facPrdOrderGoodsCustomerList[skuListCustomerIndexSx].count = totalQuality;
                //客户的订货详情传值
                orderItem.facPrdOrderGoodsCustomerList[skuListCustomerIndexSx].facPrdOrderGoodsCustomerDetailList = [];
                for (var k in val) {
                    orderItem.facPrdOrderGoodsCustomerList[skuListCustomerIndexSx].facPrdOrderGoodsCustomerDetailList.push(val[k])
                }
                // orderItem.facPrdOrderGoodsDetailList=[];
                var num = 0;
                var ids = [];
                var data = [];
                orderItem.facPrdOrderGoodsCustomerList.forEach(item => {
                    item.facPrdOrderGoodsCustomerDetailList.forEach($item => {
                        ids.push($item.skuId)
                    })

                })
                //数组去重
                ids = Array.from(new Set(ids));
                ids.forEach(item => {
                    data.push({skuId: item, num: ''})
                });
                //id一样的时候就num相加 不一样就push另一条数据算法
                orderItem.facPrdOrderGoodsCustomerList.forEach(item => {
                    item.facPrdOrderGoodsCustomerDetailList.forEach($item => {
                        if ($item.num !== '') {
                            $item.num = Number($item.num)
                        }
                        data.forEach(dataItem => {
                            dataItem.num = Number(dataItem.num)
                            if ($item.skuId === dataItem.skuId) {
                                dataItem.num += Number($item.num)
                            }
                        });
                    })

                })
                orderItem.facPrdOrderGoodsDetailList = data

            },
            toggleTab(index, i) {
                if (this.facPrdOrder.facPrdOrderGoodsList[index].tabIndex == i) return
                this.facPrdOrder.facPrdOrderGoodsList[index].tabIndex = i;
                this.$refs[`table${index}`][0].toggleCurrentSkuVal();
                this.facPrdOrder.facPrdOrderGoodsList[index].facPrdOrderGoodsCustomerList.forEach((v, cusI) => {
                    this.$refs[`table${index}cus${cusI}`][0].toggleCurrentSkuVal();
                })
            },
            countTotalNum(a,total,c, item) {
                console.log(a);
                // commonBom.commonMaterialsMainSkuList   adjustmentDifference styleSkuIds
                //a是sku的值
                item.commonBom.commonMaterialsMainSkuList.forEach(mainItem=>{
                    mainItem.adjustmentDifference = 0;
                })
                for (let k in a){
                    item.commonBom.commonMaterialsMainSkuList.forEach(mainItem=>{
                        if(mainItem.styleSkuIds.indexOf(a[k].skuId)>-1){
                            mainItem.adjustmentDifference+=Number(a[k].num)
                        }
                    })

                }
                item.commonBom.commonMaterialsMainSkuList = [...item.commonBom.commonMaterialsMainSkuList]
                this.$set(item, 'totalCount', item.tabIndex ? total : -total)
            },
            // 获取详情
            getFacPrdOrderDetail() {
                let params = {
                    userId: this.userId,
                    facPrdOrderId: this.$route.query.id
                }
                this.loading = true
                facPrdOrderDetail(params).then(res => {
                    this.loading = false;
                    this.facPrdOrder = res.data.facPrdOrder;
                    if(this.type == 1) {
                        // 新建时将数字清0
                        this.facPrdOrder.facPrdOrderGoodsList.forEach(v => {
                            v.facPrdOrderGoodsDetailList.forEach(g => {
                                g.num = 0
                            })
                            v.facPrdOrderGoodsCustomerList.forEach(c => {
                                c.facPrdOrderGoodsCustomerDetailList.forEach(d => {
                                    d.num = 0
                                })
                            })
                        })
                    }
                    //根据货品获取sku表格内容
                    this.handleSkuValue()
                })
            },
            handleSkuValue() {
                this.facPrdOrder.facPrdOrderGoodsList.forEach(item => {
                    // let totalCount = item.facPrdOrderGoodsDetailList.reduce((total, v) => {
                    //     return total + v.num
                    // }, 0)
                    // this.$set(item, 'totalCount', item.adjustType?totalCount:-totalCount)
                    this.$set(item, 'tabIndex', this.type==3?item.adjustType:0)


                    // 获取skuList
                    getGoodSkuList({
                        goodsId: item.goodsUnitId
                    }).then(res => {
                        // item.skuList = res.data;
                        this.$set(item, 'skuList', res.data)
                    });
                })
            },
            //获取调整单详情
            getAdjustDetail() {
                adjustPrdOrderDetail({facPrdOrderId:this.$route.query.id,userId:this.userId}).then(res => {
                    if(res.data.code==0){
                        this.adjustDetail = res.data.data
                        this.hasPower = this.adjustDetail.leaderIds.find(v => v == this.userId)
                        this.facPrdOrder = res.data.data.oldOrderInfo
                        this.facPrdOrder.facPrdOrderGoodsList = res.data.data.facPrdOrderGoodsList

                        this.handleSkuValue()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            changeStatusCallback() {
                adjustPrdOrderDetail({facPrdOrderId:this.$route.query.id}).then(res => {
                    if(res.data.code==0){
                        this.adjustDetail = res.data.data
                        this.hasPower = this.adjustDetail.leaderIds.find(v => v == this.userId)
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        created() {
            this.getBillReviewConfig()
            if(this.type == 3) {
                this.getAdjustDetail()
                return
            }
            this.getFacPrdOrderDetail()

        }
    }
</script>

<style lang="scss" scoped>
    .adjust-order {
        &__form {
            margin-top: 16px;
            .form-item {
                display: inline-block;
                margin-right: 20px;
                white-space: nowrap;
            }
        }
        .tab {
            font-size: 12px;
            width: 224px;
            display: flex;
            border: 1px solid #939FB8;
            .tab-select {
                cursor: pointer;
                flex: 1;
                color: #939FB8;
                background: #fff;
                line-height: 28px;
                text-align: center;
                &.active {
                    background: #939FB8;
                    color: #fff;
                }
            }
        }
        .content-form {
            margin-top: 16px;
            padding-left: 8px;
            display: flex;
            width: 1200px;
            span {
                flex: 0 0 25%;
            }
        }
        .icon-disabled{
            position: absolute;
            right: 0;
            top: 0;
            width: 88px;
            height: 88px;
            background: url("../../../assets/images/disabled.png") no-repeat;
            background-size: 100% 100%;
        }
    }
    .rightMoveComponent{
        position: fixed;
        top: 0;
        right: 0;
        width: 1200px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #f0f2f5;
        z-index: 3000;
        padding: 20px;
    }
</style>
<style lang="scss">
    .adjust-order {
        &__form {
            .form-item {
                .el-form-item__content {
                    display: inline-block;
                    width: 320px;
                    margin-left: 0 !important;
                    .el-input {
                        width: 100%;
                    }
                }
                &.remark {
                    .el-form-item__content {
                        width: 744px;
                    }
                }
            }

        }
    }
</style>
