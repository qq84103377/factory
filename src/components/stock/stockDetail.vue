<template>
    <section class="stock-detail">
        <page-title class="stock-detail__title">
            <div class="title" slot="title">{{text}}单详情</div>
            <div class="btn-warp">
                <nf-button @click="toList()">返回上一级</nf-button>
            </div>
        </page-title>
        <div v-loading="loading">
        <div class="stock-detail__info">
            <div class="stock-detail__info-tag">
               <span :class="[{green:type==1},{orange:type==0},{red:type==2},{blue:type==3},{grey:type==4}]"> ● {{text}}单</span>
               <span v-if="type==5">待入库</span>
            </div>
            <el-form style="font-size: 12px;">
                <div style="display: flex;">
                    <!--<el-form-item v-if="type != 2" class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"-->
                                  <!--label-width="80px" label="仓库:">-->
                        <!--<span>{{detailInfo.storehouseName}}</span>-->
                    <!--</el-form-item>-->
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px" label="单据号:">
                        <span>{{detailInfo.orderNo}}</span>
                    </el-form-item>
                    <!--<el-form-item class="form-item" style="width: 192px;margin-bottom: 0;margin-right: 32px;" label-width="80px" :label="`${type==2?'调整':text}人:`">-->
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap" label-width="80px" label="开单人:">
                        <span>{{detailInfo.operaterName}}</span>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;white-space: nowrap" label-width="80px"
                                  label="开单日期:">
                        <span>{{detailInfo.operateDate}}</span>
                    </el-form-item>
                </div>
                <div style="display: flex;">
                    <el-form-item v-if="type!=3&&type!=4" class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px" label="供应商:">
                        <span>{{detailInfo.commonOutsideFactoryName}}</span>
                    </el-form-item>
                    <el-form-item v-if="type==3||type==4" class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px"
                                  label="客户:">
                        <span>{{detailInfo.customerName}}</span>
                    </el-form-item>
                    <el-form-item v-if="type==2" class="form-item"
                                  style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px" label="审核状态:">
                        <span>{{handleStatus(detailInfo.reviewStatus)}}</span>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px" label="备注:">
                        <span>{{detailInfo.remark}}</span>
                    </el-form-item>
                    <el-form-item v-if="type==1||type==3" class="form-item"
                                  style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap" label-width="80px"
                                  label="关联单号:">
                        <span>{{detailInfo.facMissionNo}}</span>
                    </el-form-item>
                </div>
                <div v-if="type!=5" style="display: flex;">
                    <el-form-item v-if="type==0||type==1" class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="116px" label="关联入库通知单:">
                        <div v-if="detailInfo.informOrderNo" style="word-break: break-all"><span style="cursor: pointer;text-decoration: underline">{{detailInfo.informOrderNo}}</span><span v-if="type==0">（{{detailInfo.informStorehouseName}}：{{handleInStockStatus(detailInfo.informStockStatus)}}）</span></div>
                        <div v-else>无</div>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="80px" label="总计数量:">
                        <span v-if="type==2">-{{detailInfo.subtractNum}}/+{{detailInfo.addNum}}</span>
                        <span v-else>{{(type==1||type==4)?detailInfo.addNum:detailInfo.subtractNum}}</span>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;" label-width="80px"
                                  :label="`${type==2?text:'总计'}金额:`">
                        <!--<span>{{// type==1?'+¥'+detailInfo.addAmount:(type==2? '¥' :'-¥'+detailInfo.subtractAmount)}}</span>-->
                        <span><span v-if="type==2&&detailInfo.amount!==0">{{detailInfo.amount>0?'+':'-'}}</span>¥{{Math.abs(detailInfo.amount)}}</span>
                    </el-form-item>
                    <el-form-item v-if="type==3||type==4" class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;white-space: nowrap"
                                  label-width="80px" label="供应商:">
                        <span>{{detailInfo.commonOutsideFactoryName}}</span>
                    </el-form-item>
                </div>
                <div v-if="type==5" style="display: flex;">
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="86px" label="关联出库单:">
                        <div style="word-break: break-all"><span style="cursor: pointer;text-decoration: underline">CK181114001</span>（巨牛一工厂仓：待入库）</div>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="86px" label="入库通知数:">
                        <span></span>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;" label-width="116px"
                                  label="入库通知金额:">
                        <span>¥</span>
                    </el-form-item>
                </div>
                <div v-if="type==5" style="display: flex;">
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="86px" label="关联入库单:">
                        <div style="word-break: break-all"><span style="cursor: pointer;text-decoration: underline">CK181114001</span></div>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;margin-right: 32px;"
                                  label-width="86px" label="实际入库数:">
                        <span></span>
                    </el-form-item>
                    <el-form-item class="form-item" style="width: 280px;margin-bottom: 0;" label-width="116px"
                                  label="实际入库金额:">
                        <span>¥</span>
                    </el-form-item>
                </div>
            </el-form>

            <el-popover
                    @hide="isFold=true"
                    ref="popover2"
                    placement="bottom"
                    width="98"
                    trigger="click">
                <div>
                    <div @click="edit" v-if="(detailInfo.reviewStatus==0||detailInfo.reviewStatus==3)&&!detailInfo.facMissionId"
                         style="cursor: pointer;line-height: 32px;border-bottom: 1px solid #E4E8F1;">修改单据
                    </div>
                    <div v-if="detailInfo.reviewStatus==2" @click="$refs['popover2'].doClose();cancelDialog=true" style="cursor: pointer;line-height: 32px;">申请反审</div>
                </div>
            </el-popover>
            <div class="btn-group">
                <i class="icon-cancel" v-if="detailInfo.cancel"></i>
                <nf-button v-if="type==5" type="success" @click="edit">确认入库</nf-button>
                <printTemplateBtn v-if="type!=2&&type!=5" type="stock" :id="id"></printTemplateBtn>
                <nf-button :loading="btnLoading" v-if="(type==2||type==3)&&(detailInfo.reviewStatus==0||detailInfo.reviewStatus==3)&&isConfig" width='105' @click="changeStatus(1)" class="show-more-btn">提报审核</nf-button>
                <nf-button :loading="btnLoading" v-if="(type==2||type==3)&&detailInfo.reviewStatus==1&&isConfig" width='105' @click="changeStatus(2)" class="show-more-btn">撤回提报</nf-button>
                <nf-button :loading="btnLoading" v-if="(type==2||type==3)&&detailInfo.reviewStatus==4&&isConfig" width='105' @click="changeStatus(2)" class="show-more-btn">撤回反审</nf-button>
                <nf-button v-show="type!=5&&(((detailInfo.reviewStatus==0||detailInfo.reviewStatus==3)&&!detailInfo.facMissionId) || detailInfo.reviewStatus==2)" v-popover:popover2 width='105' @click="isFold=!isFold" class="show-more-btn">
                    更多操作
                    <i v-if="isFold" class="el-icon-arrow-up"></i>
                    <i v-else class="el-icon-arrow-down"></i>
                </nf-button>
            </div>
        </div>
        <div class="stock-detail__table">
            <div class="yellow-border-title" style="margin-bottom: 8px;">
                <div class="title">
                    <span>{{type==2?(isAdjustIn?'入库':'出库'):text}}{{type!=5?'合计':''}}: {{type==2?(isAdjustIn?'+':'-'):''}}{{detailInfo.stockIn.goodsDetails.length}}款/{{(type==1||type==4||(type==2&&isAdjustIn))?detailInfo.addNum:detailInfo.subtractNum}}件 金额: {{type==2?(isAdjustIn?'+':'-'):''}}¥{{(type==1||type==4||(type==2&&isAdjustIn))?detailInfo.addAmount:detailInfo.subtractAmount}}</span>
                </div>
                <div><span v-if="type==2">{{isAdjustIn?'入库':'出库'}}</span>仓库: {{detailInfo.storehouseName}}</div>
            </div>
            <storage-table
                    :hasRelateOrder="detailInfo.informOrderNo"
                    :type="type==2?(isAdjustIn?1:0):type"
                    v-model="skuValue"
                    isStorage
                    :standbyValue="standbyValue"
                    :isShowAction="false"
                    :tableData="tableData">
            </storage-table>
            <nf-button v-if="type==5" style="margin-top: 8px;">关闭</nf-button>

            <div style="margin-top: 16px;cursor: pointer;color: #00a0e9" v-if="type==2" @click="viewOtherAdjust">查看关联调整单</div>
        </div>
        <!--<div v-if="type==2" class="stock-detail__table">-->
            <!--<div class="yellow-border-title" style="margin-bottom: 8px;">-->
                <!--<div class="title">入库合计: +{{detailInfo.stockIn.goodsDetails.length}}款/{{detailInfo.addNum}}件 金额: +¥{{detailInfo.addAmount}}</div>-->
            <!--</div>-->
            <!--<storage-table-->
                    <!--:type="1"-->
                    <!--v-model="inSkuValue"-->
                    <!--isStorage-->
                    <!--:standbyValue="standbyValue"-->
                    <!--:isShowAction="false"-->
                    <!--:tableData="inTableData">-->
            <!--</storage-table>-->
        <!--</div>-->
        </div>
        <!--撤销单据弹窗-->
        <el-dialog
                @close="cancelReason=''"
                class="custom-dialog cancel-dialog"
                title="撤销单据原因"
                :visible.sync="cancelDialog"
                size="tiny">
            <div>
                <el-input
                        maxlength="50"
                        type="textarea"
                        :rows="5"
                        placeholder="请输入撤销原因，50个字符以内"
                        v-model="cancelReason">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDialog = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="stockUndo">确 定</el-button>
  </span>
        </el-dialog>


        <!--修改单据侧滑窗-->
        <transition name="right-move">
            <div v-if="editDialog" style="position: fixed;top: 0;right: 0;z-index: 11;padding: 24px 36px;background: #fff;height: 100%;width: 85%;
    overflow-y: scroll;">
                <in-storage @success="editCallBack" @cancel="editDialog=false" :isEditNotice="false" :isEdit="true" :editInfo="editInfo" ref="inStorage"></in-storage>
            </div>
        </transition>
        <transition name="opcity">
            <div style="z-index: 10" class="cover" v-show="editDialog" @click="editDialog = false"></div>
        </transition>
    </section>
</template>

<script>
    import storageTable from './table'
    import inStorage from './in-storage'
    import {stockBillUndo,stockChangeDetail,stockUndo,reviewBillStock,stockBillSubmit,billReviewConfig,centralStockDetail} from '@/api'
    import printTemplateBtn from '../material/printTemplateBtn'

    export default {
        name: "stock-detail",
        components: {storageTable, inStorage, printTemplateBtn},
        computed: {
            type() {
                return this.$route.query.type
            },
            text() {
                switch (Number(this.$route.query.type)) {
                    case 0 :
                        return '出库';
                    case 1 :
                        return '入库';
                    case 2 :
                        return '调整';
                    case 3 :
                        return '发货';
                    case 4 :
                        return '退货';
                    case 5 :
                        return '入库通知';
                }
            },
            id() {
                return this.$route.query.id
            },
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        data() {
            return {
                isConfig: false,
                btnLoading: false,
                loading: false,
                cancelReason: '',
                cancelDialog: false,
                editDialog: false,
                isFold: true,
                skuValue: {},
                // inSkuValue: {},
                // outSkuValue: {},
                standbyValue: {},
                detailInfo: {stockIn:{goodsDetails:[]},operateDate:''},
                // inTableData: [],
                // outTableData: [],
                tableData: [],
                editInfo: {},
                isAdjustIn: false, //是否为调整单-入库
                oldUrl:'',//存储上一个页面的url
                otherSkuValue: {},   // 编辑调整单用
                otherTableData: [],  // 编辑调整单用
            }
        },
        beforeRouteEnter (to, from, next){
            next(vm => {
                // 通过 `vm` 访问组件实例,将值传入oldUrl
                vm.oldUrl = from.path;
            })
        },
        methods: {
            handleInStockStatus(status) {
                switch (status) {
                    case 0 : return '待入库';
                    case 1 : return '已完成,有差异';
                    case 2 : return '已完成,无差异';
                    case 3 : return '已关闭';
                }
            },
            //是否有审核台
            getBillReviewConfig(){
                if(this.type == 3 || this.type == 2){
                    billReviewConfig({unitId:this.unitId}).then(res=>{
                        if(res.data.data.configs && res.data.data.configs.length>0){
                            //是否有审核台
                            this.isConfig = res.data.data.configs.some(v => v.billType == (this.type == 3?'STOCK_DELIVERY':'STOCK_ADJUST'))
                        }
                    })
                }

            },
            changeStatus(reviewStatus) {
                // type   1  提报  2 撤回提报/撤回反审
                this.btnLoading = true

                if(this.isConfig) {
                    if(reviewStatus==1){
                        stockBillSubmit({id:this.id,unitId:this.unitId,userId:this.userId,operateType:this.type==3?'STOCK_DELIVERY':'STOCK_ADJUST'}).then(res => {
                            this.btnLoading = false
                            if(res.data.code==0){
                                this.getDetail()
                                this.$message.success('操作成功')
                            }else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }else if (reviewStatus==2) {
                        stockBillUndo({id:this.id,userId:this.userId}).then(res => {
                            this.btnLoading = false
                            if(res.data.code==0){
                                this.getDetail()
                                this.$message.success('操作成功')
                            }else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    }

                }else {
                    reviewBillStock({id:this.id,reviewStatus}).then(res => {
                        this.btnLoading = false
                        if(res.data.code==0){
                            this.getDetail()
                            this.$message.success('操作成功')
                        }else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }

            },
            handleStatus(status) {
                switch (status) {
                    case 0 :
                        return '草稿';
                        break;
                    case 1 :
                        return '待审核';
                        break;
                    case 2 :
                        return '审核通过';
                        break;
                    case 3 :
                        return '已驳回';
                        break;
                    case 4 :
                        return '反审待审批';
                        break;
                }
            },
            stockUndo() {
                this.btnLoading = true;
                let reviewBillType = ''
                switch (this.type) {
                    case '0' :
                        reviewBillType = 'STOCK_OUT';
                        break;
                    case '1' :
                        reviewBillType = 'STOCK_IN';
                        break;
                    case '2' :
                        reviewBillType = 'STOCK_ADJUST';
                        break;
                    case '3' :
                        reviewBillType = 'STOCK_DELIVERY';
                        break;
                    case '4' :
                        reviewBillType = 'STOCK_SALE_RETURN';
                }


                stockUndo({id:this.id,cancelRemark:this.cancelReason,userId:this.userId,unitId:this.unitId,reviewBillType}).then(res => {
                    this.btnLoading = false;
                    if(res.data.code==0){
                        this.cancelDialog = false;
                        this.$message.success('操作成功')
                        this.getDetail()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            editCallBack() {
              this.editDialog=false;
              this.getDetail()
            },
            viewOtherAdjust() {
              this.$router.replace(`/stockDetail?id=${this.isAdjustIn?this.detailInfo.adjustOutBillId:this.detailInfo.adjustInBillId}&type=2&storehouseId=${this.$route.query.storehouseId}`);
              this.getDetail()
            },
            toList(){
                if(this.oldUrl.indexOf("/instorage")>-1){
                    this.$router.push(`/home/stock/bill?isUpdate=true&storehouseId=${this.$route.query.storehouseId}` );
                }else{
                    this.$router.push(`/home/stock/bill?storehouseId=${this.$route.query.storehouseId}` );
                }

            },
            getLengths(skuList) {
                let arr = [];
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.id === skuItem.standardId);
                    !had && arr.push({value: skuItem.standardValue || '无', id: skuItem.standardId});
                }
                return arr;
            },
            setTableData(data = {}) {
                const commonStyleSkuList = data['commonStyleSkuList'];
                // const commonStyleSkuList = data['skuDTOList'];
                let skuList = []
                    , colors = []
                    , sizes = []
                    , lengths = []
                    , json = {}
                    , skuValue = {}
                    , standbyValue = {};
                const lengthData = this.getLengths(commonStyleSkuList); // 用来半段是否显示‘无’内长
                const isHideLength = (lengthData.length === 1 && lengthData[0].value === '无');
                for (let item of commonStyleSkuList) {
                    item.styleId = item.styleId || data.id;
                    const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/${(!isHideLength && item.standardId) ? item.standardId : ''}`
                    skuValue[skuIdStr] = {
                        num: item.quantity,
                        skuId: item.id,
                        styleId: item.styleId
                    }
                    standbyValue[skuIdStr] = {
                        num: item.quantity,
                        skuId: item.id,
                        styleId: item.styleId
                    }
                    if (!json[item.colorId]) {
                        colors.push({
                            stockNum: '',
                            colorName: item.colorNoName || item.colorName,
                            colorId: item.colorId,
                            ...data,
                            id: item.styleId || item.id
                        });
                        json[item.colorId] = item.colorId;
                    }
                    if (item.standardId && !json[item.standardId]) {
                        lengths.push({
                            standardValue: item.standardValue || '无',
                            standardId: item.standardId,
                            ...data,
                            id: item.styleId
                        });
                        json[item.standardId] = item.standardId;
                    }
                    // const idStr = item.sizeValue + (item.standardId ? '/' + item.standardValue : '')
                    if (!json[item.sizeId]) {
                        sizes.push({
                            ...item,
                            sizeNum: '',
                            sizeValue: item.sizeValue,
                            sizeId: item.sizeId
                        });
                        json[item.sizeId] = item.sizeId;
                    }
                }
                if (isHideLength) lengths = [];
                for (let colorItem of colors) {
                    const sizeObj = {
                        ...colorItem,
                        lengths
                    };
                    skuList.push(sizeObj)
                }
                return {
                    skuList,
                    sizes,
                    skuValue,
                    standbyValue
                }
            },
            getTableDataAndSkuValue(data, v, isOther) { // isOther  调整单编辑标识
                // if(type==2&&isIn){
                if(isOther){
                    this.otherSkuValue = {
                        ...this.otherSkuValue,
                        ...data['skuValue']
                    }
                }else {
                    this.skuValue = {
                        ...this.skuValue,
                        ...data['skuValue']
                    };
                }


                // }else {
                    // this.outSkuValue = {
                    //     ...this.outSkuValue,
                    //     ...data['skuValue']
                    // };
                // }

                this.standbyValue = {
                    ...this.standbyValue,
                    ...data['standbyValue']
                }; // 用来做弹窗备用
                let stockNum = v.commonStyleSkuList.reduce((total,curV) => {
                    return total + curV.quantity
                },0)
                // let stockNum = v.skuDTOList.reduce((total,curV) => {
                //     return total + curV.quantity
                // },0)
                // if(type==2&&isIn) {

                if(isOther) {
                    this.otherTableData = this.otherTableData.concat([
                        {
                            ...data,
                            ...v,
                            commonStyleSkuList: data['skuList'],
                            sizes: data['sizes'],
                            num: stockNum,
                            stockNum,
                            totalPrice: stockNum * Number(v.cost)
                        }
                    ]);
                }else {
                    this.tableData = this.tableData.concat([
                        {
                            ...data,
                            ...v,
                            commonStyleSkuList: data['skuList'],
                            sizes: data['sizes'],
                            num: stockNum,
                            stockNum,
                            totalPrice: stockNum * Number(v.cost)
                        }
                    ]);
                }
            },
            async edit() {
                // 权限
                if(!this.powerJudgement.permissions("fac.stock.change.bill.update")){
                    return
                }

                this.$refs['popover2'].doClose();
                this.editDialog = true;
                this.$set(this.editInfo,'skuValue',this.skuValue)
                this.$set(this.editInfo,'tableData',this.tableData)
                this.$set(this.editInfo,'detail',this.detailInfo)
                if(this.type == 2) {
                    this.otherTableData = []
                    this.standbyValue = {}
                    this.otherSkuValue = {}
                   await stockChangeDetail({id:this.isAdjustIn?this.detailInfo.adjustOutBillId:this.detailInfo.adjustInBillId}).then(res => {
                        res.data.data.stockIn.goodsDetails.forEach(v => {
                            const data = this.setTableData(v);
                            this.getTableDataAndSkuValue(data, v, 1);
                        })
                        this.$set(this.editInfo,'otherSkuValue',this.otherSkuValue)
                       this.$set(this.editInfo,'otherTableData',this.otherTableData)
                        this.$set(this.editInfo,'otherFlag',this.isAdjustIn)
                       this.$set(this.editInfo,'otherDetail',res.data.data)
                   })
                }
                this.$nextTick(() => {
                    this.$refs['inStorage'].getEditInfo();
                })
            },
            getDetail() {
                this.tableData = []
                this.standbyValue = {}
                this.skuValue = {}
               this.loading = true
                stockChangeDetail({id:this.id}).then(res => {
                    this.detailInfo = res.data.data
                    this.isAdjustIn = res.data.data.adjustInBillId === this.id

                    this.detailInfo.stockIn.goodsDetails.forEach(v => {
                        const data = this.setTableData(v);
                        this.getTableDataAndSkuValue(data, v);

                    })
                    this.loading = false
                })
                // centralStockDetail({stockId:this.id}).then(res => {
                //     this.detailInfo = res.data.centralBillStockInfoDTO
                //     this.isAdjustIn = res.data.centralBillStockInfoDTO.adjustInBillId === this.id
                //
                //     this.detailInfo.styleDTOList.forEach(v => {
                //         const data = this.setTableData(v);
                //         this.getTableDataAndSkuValue(data, v, this.type, 1);
                //
                //     })
                //     this.loading = false
                // })
            }
        },
        created() {
            this.getDetail()
            this.getBillReviewConfig()
            // centralStockDetail({stockId:this.id})
        }
    }
</script>
<style lang="scss">
    .cancel-dialog {
        .el-dialog--tiny {
            width: 360px;
        }
    }
</style>
<style lang="scss" scoped>
    .stock-detail {
        &__info {
            padding: 16px 24px;
            background: #fff;
            position: relative;
            &-tag {
                font-size: 14px;
                font-weight: bold;
                line-height: 24px;
                display: flex;
                justify-content: space-between;
                &.green {
                    color: #23C811;
                    background: #F2FCF1;
                    border: 2px solid #23C811;
                }
                &.orange {
                    color: #FFA914;
                    background: #FFF3E0;
                    border: 2px solid #FFA914;
                }
                &.red {
                    color: #FA4150;
                    background: #FFF0F1;
                    border: 2px solid #FA4150;
                }
                &.blue {
                    color: #438DF1;
                    background: #ECF3FD;
                    border: 2px solid #438DF1;
                }
                &.grey {
                    color: #5C6973;
                    background: #F2F4F5;
                    border: 2px solid #5C6973;
                }
            }
            .btn-group{
                position: absolute;
                right: 24px;
                bottom: 24px;
                .icon-cancel{
                    display: block;
                    margin-bottom: 10px;
                    width: 80px;
                    height: 80px;
                    background: url("../../assets/images/cancel.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
            .show-more-btn {
                width: 98px !important;
                font-size: 12px !important;
            }
            .popover-more {
                width: 98px;
                font-size: 12px;
            }
        }
        &__table {
            margin-top: 8px;
            padding: 16px 24px;
            background: #fff;
        }
    }
</style>
