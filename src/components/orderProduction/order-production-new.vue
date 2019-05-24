<template>
    <div :class="{'material-new-remove-right':source=='orderProductionDetail','orderProductionNew':true}">
        <page-title :title="title">
            <div class="btns">
                <div>
                    <nf-button @click="goBack">取消</nf-button>
                    <nf-button v-if="$route.query.type==='informal'" :loading="addSureSumit" type="warning"
                               @click="addSure(2)">确定
                    </nf-button>
                    <nf-button v-if="!billReviewConfig && $route.query.type==='formal'" :loading="addSureSumit"
                               type="warning" @click="addSure(2)">生成订单
                    </nf-button>
                    <nf-button v-if="billReviewConfig && $route.query.type==='formal'" :loading="addSureSumit"
                               type="warning" @click="addSure(0)">存草稿
                    </nf-button>
                    <nf-button v-if="billReviewConfig && $route.query.type==='formal'" :loading="addSureSumit"
                               type="warning" @click="addSure(1)">提报
                    </nf-button>


                </div>
                <!--<nf-button  @click="$router.go(-1)">返回上级</nf-button>-->
            </div>
        </page-title>
        <div class="orderProductionNew-news">
            <content-wrap title="订单信息"></content-wrap>
            <el-form ref="form" :model="form" label-width="80px">
                <el-row>
                    <el-form-item class="filter-form__item" label="生产单号">
                        <el-input :disabled="openRule" style="width: 220px" v-model="form.orderNo"
                                  placeholder="不填则系统自动生成"></el-input>
                    </el-form-item>
                    <el-form-item class="filter-form__item is-required" label="制单日期" style="margin: 0 10px;">
                        <el-date-picker style="width: 220px;" v-model="form.placeorderAt" @change="beginTime" type="date"
                                        format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="filter-form__item" label="下单类型" style="margin: 0 10px;">
                        <el-select
                                v-model="form.placeOrderTypeId"
                                filterable
                                clearable
                                placeholder="请选择">
                            <el-option v-for="item in placeOrderTypeList" :key="item.attrId" :label="item.attrVal"
                                       :value="item.attrId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>

                <el-row>
                    <el-form-item class="filter-form__item" label="采购单号">
                        <el-input v-model="form.buyNo" style="width: 220px;" placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item class="filter-form__item" label="负责人"  style="margin: 0 10px;">
                        <workerLeader style="width: 220px;" v-model="form.chargerIds"  placeholder="请选择"></workerLeader>
                    </el-form-item>
                    <el-form-item style="margin-left: 7px;" class="orderProductionNew-news-checkbox filter-form__item">
                        <el-checkbox v-model="form.checked" @change="checkChange(form.checked)">加工厂商</el-checkbox>
                        <machining-select style="width: 220px;display: inline-block;" v-show="form.checked" :canAdd="true" v-model="form.commonOutsideFactoryId" @input="factoryChange"></machining-select>
                    </el-form-item>
                </el-row>
                <el-row>
                <el-form-item label="订单备注" style="display: block">
                    <el-input style="width: 534px;" type="textarea" v-model="form.remark" placeholder="选填"></el-input>
                </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="orderProductionNew-goods">
            <div class="orderProductionNew-goodsList" v-for="(item,index) in goodsList" :key="item"
                 v-if="goodsList.length">
                <content-wrap title="订货商品" class="goods-order">
                    <el-button @click="goodsDelete(index)">删除本条</el-button>
                </content-wrap>
                <div style="display: flex;">
                    <goods-summary
                                :ref="'goodsSummaryCon'+index"
                                @getStyleId="getStyleId"
                                modelName="FAC_PRD_ORDER"
                                :editData="item"
                                :isEdit="detailData ? true : false"
                                :isAddGood = "isAddGood"
                                :commonOutsideFactoryId="form.commonOutsideFactoryId"
                                :outsideFactoryCheck="form.checked" :placeorderAtTime="form.placeorderAt"
                                @updateOutSideFactory="val => form.commonOutsideFactoryId = val"
                                @updateFactoryCheck ="val => form.checked = val"
                                :goodsIndex="index">
                    </goods-summary>

                </div>


                <content-wrap v-if="$route.query.type !== 'informal'"
                              title="物料需求" class="need-tittle"
                                style="border-top: 1px solid rgba(230,234,240,1);padding-top: 16px;">
                    <el-checkbox v-model="item.materialChecked"
                                 :disabled="!item.commonBom.styleId || $route.query.type==='informal'"></el-checkbox>
                    <!--<el-checkbox v-if="item.materialChecked && orderSelect" v-model="item.materialBuyChecked"-->
                    <!--style="position: absolute;right: 0;top: 70px;">提交订单的同时生成采购计划-->
                    <!--</el-checkbox>-->
                </content-wrap>
                <bom-table from="addProductionOrder"
                           @bomData="bomData"
                           :showBom='false'
                           v-if="item.materialChecked"
                           :source="'orderProduction'"
                           :goodsIndex="index"
                           :styleId="item.commonBom.styleId"></bom-table>
            </div>
            <div class="orderProductionNew-goodsAdd" @click="addGoods">+ 添加订货商品</div>
        </div>
        <div class="orderProductionNew-file" v-if="$route.query.type == 'formal'">
            <content-wrap title="关联附件" class="goods-order">
            </content-wrap>
            <!--附件-->
            <upload-from
                    isEdit
                    from="order"
                    :outsideFactoryId="form.commonOutsideFactoryId"
                    :orderCode="form.attachmentCode"
                    @selectRow="getSelectRow"
            ></upload-from>
        </div>
        <!--多货品关闭-->
        <el-dialog
                :show-close="false"
                :visible.sync="deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除此订货商品？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delGoodsSure">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
        <!--<materialAndGoodsBomUpdate @updateMaterialBtn="updateMaterialBtn" :easyBomList="easyBomList"-->
                                   <!--:updateMaterial="updateMaterial"-->
                                   <!--:alterPurchaseDemand="bomData.alterPurchaseDemand"></materialAndGoodsBomUpdate>-->

    </div>
</template>

<script>
    import {
        ruleList,
        selectFacCustomer,
        selectFacGoodsStyleList,
        getGoodSkuList,
        getCommonProcessForm,
        facPrdOrderAdd,
        outsideFactoryListForSelect,
        facPrdOrderConfig,
        placeOrderTypeList,
        addAdvanceOrder,
        updateAdvanceOrder,
        updateFacPrdOrder,
        billReviewConfig,
        easyBomList
    } from '@/api';
    import bomTable from '../order/createChild/bomTable'
    import goodsSummary from './components/goods-summary'
    import uploadFrom from '@/components/Common/uploadForm.vue'

    export default {
        name: 'orderProductionNew',
        props: ['source', 'detailData'],
        data() {
            return {
                title: '',
                // addOutsideFactoryVisible: false,
                billReviewConfig: false,
                updateMaterial: false,
                updateMaterialChecked: true,
                updateMaterialRadio: '',
                updateMaterialInput: '',
                easyBomList: [],
                userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                outsideFactoryList: [],
                placeOrderTypeList: [],    //下单类型
                form: {
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    orderNo: '',
                    checked: false,
                    placeorderAt: '',
                    remark: '',
                    isOutsideFac: 0,
                    commonOutsideFactoryId: '',
                    facPrdOrderGoodsList: [],           //生产单货品列表
                    placeOrderTypeId: '',           //下单类型
                    attachmentCode: '', // 附件code
                    chargerIds:[]//负责人
                },
                pickerOptions0: {
                    //下单时间不能大于交货时间
                    disabledDate: deliverytime => {
                        if (this.form.deliveryAt) {
                            const date = this.form.deliveryAt.replace(/-/g, "/");
                            return deliverytime.getTime() > +new Date(date) - 8.64e7;
                        }
                    }
                },

                orderSelect: false,
                orderPlan: false,
                addSureSumit: false,
                deleVisible: false,
                goodsListIndex: 0,
                goodsList: [
                    {'materialChecked': false, 'goodSelHave': false, materialBuyChecked: false, commonBom: {}}
                ],

                orderDateRange: '',
                deliveryDateRange: '',

                tableData3: {
                    lengths: [1]
                },
                openRule: false, //是否开启自动编号
                isNeedRefresh:true, //是否需要刷新生产订单列表页
                selectRow: {}, // 选中的附件
                isAddGood: false, // 是否添加订货商品
            }
        },
        components: {
            goodsSummary,
            uploadFrom,
            bomTable
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
        beforeRouteLeave(to,from,next) {
            // 新增、编辑
            if (from.path == '/orderProductionNew'&&this.isNeedRefresh) {
                to.meta.keepAlive = false
            } else{
                to.meta.keepAlive = true
            }
            next()
        },
        async created() {
            this.title =(this.source?'编辑':'新建')+ (this.$route.query.type === 'informal'?'预下单':'生产订单')
            this.getBillReviewConfig();
            this.getOutsideFactoryList();
            this.getFacPrdOrderConfig();
            this.getPlaceOrderTypeList();
            await this.getRuleList()
            // console.log(this.detailData);
            if (this.$route.query.jumpFrom === 'informal') {
                this.detailData = this.$route.query.data
            }
            //编辑
            if (this.detailData) {
                this.form = JSON.parse(JSON.stringify(this.detailData))
                if (this.form.isOutsideFac === 1) {
                    this.form.checked = true
                }
                this.goodsList = this.detailData.facPrdOrderGoodsList
                this.goodsList.forEach(item => {
                    if (!item.commonBom) {
                        item.commonBom = {}
                    } else {
                        item.materialChecked = true
                    }
                })

            }
        },
        methods: {
            // 加工厂商勾选
            checkChange(val) {
                if (!val) {
                    this.form.commonOutsideFactoryId = ''
                }
            },
            // 获取勾选的附件
            getSelectRow(row) {
                this.selectRow = row
            },
            getRuleList() {
                ruleList({userId: this.userId}).then(res => {
                    if(res.data.code === 0) {
                        const rule = res.data.data.find(v => v.modelType == (this.$route.query.type === 'informal'?5:3))
                        if (rule) {
                            this.openRule = rule.openRule
                            if (this.openRule && this.$route.query.jumpFrom === 'informal') {
                                this.form.orderNo = ''
                            }
                        }
                    }
                })
            },
            getBillReviewConfig() {
                billReviewConfig({unitId: this.facId}).then(res => {
                    if (res.data.data.configs && res.data.data.configs.length > 0) {
                        //有审核台
                        this.billReviewConfig = res.data.data.configs.some(v => v.billType == 'FAC_PRD_ORDER')
                    }
                })
            },
            //获取下单类型
            getPlaceOrderTypeList() {
                let params = {
                    unitId: this.form.unitId,
                    keyword: ''
                }
                placeOrderTypeList(params).then(res => {
                    if (res.data.code === 0) {
                        this.placeOrderTypeList = res.data.commonGoodsAttrs
                    }
                })
            },
            //选择bom是默认是否勾选物料采购计划
            getFacPrdOrderConfig() {
                facPrdOrderConfig({unitId: this.form.unitId}).then(res => {
                    this.orderSelect = res.data.data.select;
                    this.goodsList.forEach(item => {
                        item.materialBuyChecked = res.data.data.plan
                    })

                })
            },
            // addOutsideFactoryVisibleGo() {
            //     $('.bigSelShowNone').css('display', 'none')
            //     this.addOutsideFactoryVisible = true;
            //
            // },
            // 新建外发厂成功
            addOutsideFactorySuccess(id) {
                this.getOutsideFactoryList()
                this.form.commonOutsideFactoryId = id

            },
            // 新增生产单
            addSure(status) {
                 // 权限
                if(!this.powerJudgement.permissions("fac.prcmission.report")&&status ==1){
                    return
                }
                if (!this.goodsList.length) {
                    this.$message.error("请选择商品");
                    return
                }
                //是否有外发厂
                if (this.form.checked) {
                    this.form.isOutsideFac = 1
                } else {
                    this.form.isOutsideFac = 0
                }
                let commonCustomerIdIsRepeat = true

                //绒错处理
                for (let i = 0; i < this.goodsList.length; i++) {
                    // console.log(this.goodsList[i].commonBom);
                    if (this.goodsList[i].commonBom.commonMaterialsSkuList) {
                        this.goodsList[i].commonBom.commonMaterialsSkuList.forEach(item => {
                            // var commonMaterialsSkuList = item
                            if (item.styleStandardIdList.length == 0) {
                                this.$message.error("请选择bom表用于货品内长");
                                return;
                            }
                            if (!item.singleDosage) {
                                this.$message.error("请填写bom表单件用量");
                                return;
                            }

                        })
                    }
                }
                // 获取货品数据
                if (this.goodsList.length) {
                    this.form.facPrdOrderGoodsList = []
                    this.goodsList.forEach((item, index) => {
                        var sendFormData = this.$refs['goodsSummaryCon' + index][0].sendFormData();
                        //是否按客户
                        if (sendFormData.fillType == 1) {


                            //判断是否有重复的客户
                            let ary = [];
                            sendFormData.facPrdOrderGoodsCustomerList.forEach(item => {
                                if (item.commonCustomerId) {
                                    ary.push(item.commonCustomerId)
                                }
                            });
                            let nary = ary.sort();
                            // console.log(ary);
                            if (ary.length == 0) {
                                this.$message.error('请选择客户');
                                commonCustomerIdIsRepeat = false
                                return
                            }
                            for (let i = 0; i < ary.length; i++) {
                                if (nary[i] == nary[i + 1]) {
                                    //有重复
                                    this.$message.error('不能选择两个相同的客户');
                                    commonCustomerIdIsRepeat = false
                                    return
                                }
                            }

                        }
                        // 勾选物料
                        if (item.materialChecked) {
                            sendFormData.isMaterials = 1;
                            sendFormData.commonBom = this.goodsList[index].commonBom;
                        } else {
                            sendFormData.isMaterials = 0;
                            sendFormData.commonBom = {};
                        }
                        //生产采购计划勾选
                        if (item.materialBuyChecked && this.orderSelect) {
                            sendFormData.isPurchaseOrder = 1
                        } else {
                            sendFormData.isPurchaseOrder = 0
                        }
                        this.form.facPrdOrderGoodsList.push(sendFormData)

                        if (item.materialChecked) {
                            let obj = {
                                styleId: this.goodsList[index].commonBom.styleId,
                                userId: this.userId
                            };
                            easyBomList(obj).then(res => {
                                this.easyBomList = res.data.commonBomList
                            });
                            //更新bom表关闭
                            // this.$nextTick(function () {
                            //     this.updateMaterial = true
                            // });
                            //
                            // console.log(this.form);
                            // return
                        }

                    })
                    //请求接口
                    //
                    if (!commonCustomerIdIsRepeat) return;

                    // if(status!==2){
                    this.form.actionStatus = status
                    // }

                    this.facPrdOrderAdd(status)
                }


            },

            //更新物料  //更新bom表关闭
            // updateMaterialBtn( data) {
            //     this.form.facPrdOrderGoodsList[0].alterPurchaseDemand = this.bomData.alterPurchaseDemand ? data.updateMaterialChecked : false;
            //     if (data.updateMaterialRadio !== 'noUpdateBom') {
            //
            //         this.form.facPrdOrderGoodsList[0].updateCommonBomId = data.updateMaterialRadio;
            //         this.form.facPrdOrderGoodsList[0].saveAsCommonBomName = data.updateMaterialInput;
            //     }
            //     this.facPrdOrderAdd()
            // },
            //新建接口
            facPrdOrderAdd(status) {

                //不能选着两个相同的货品
                let goodsUnitIds = [];
                let flag = true;
                this.form.facPrdOrderGoodsList.forEach(item => {
                    goodsUnitIds.push(item.goodsUnitId)
                });
                let newGoodsUnitIds = goodsUnitIds.sort()
                for (let i = 0; i < goodsUnitIds.length; i++) {
                    if (newGoodsUnitIds[i] == newGoodsUnitIds[i + 1]) {
                        // console.log(newGoodsUnitIds[i]);
                        this.$message.error('不能选择两个相同的货品');
                        flag = false
                        return
                    }

                }
                if (!flag) return;

                this.addSureSumit = true
                this.form.userId = this.userId;
                // console.log(this.form);
                let newApi;
                if (this.$route.query.type === 'formal') {
                    // 是否关联附件
                    console.log(this.selectRow, 'this.selectRow');
                    this.form.attachmentCode = this.selectRow.checked ? (this.selectRow.attachmentCode || this.selectRow.code) : ''
                    console.log(this.form.attachmentCode,'this.form.attachmentCode');
                    // console.log(this.$route.query.id);
                    //由详情进入
                    if (this.$route.query.id && this.$route.query.jumpFrom) {
                        this.form.submit = status?true:false;
                        newApi = updateFacPrdOrder
                    } else {
                        //新建
                        newApi = facPrdOrderAdd
                    }

                } else {
                    if (this.$route.query.id) {
                        //编辑
                        newApi = updateAdvanceOrder
                    } else {
                        //新建
                        newApi = addAdvanceOrder
                    }

                }
                // console.log(newApi);

                newApi(this.form).then(res => {
                    // console.log(res);
                    let that = this;
                    let message = '';
                    if (this.$route.query.id) {
                        message = '编辑成功'
                    } else {
                        message = '新建成功'
                    }
                    if (res.data.code === 0) {
                        this.$message({
                            message: message,
                            type: 'success',
                            duration: this.$globalConfig.elementUI.duration,
                            onClose: function () {
                                that.$store.dispatch('deleteVisitedView', that.$route);
                                that.$store.dispatch('deleteVisitedLive', 'orderProductionNew');
                                that.$router.push('/orderProduction')


                            }
                        });
                    } else {
                        this.addSureSumit = false
                        this.form.facPrdOrderGoodsList = []
                        this.$message.error(res.data.msg);
                    }
                    this.updateMaterial = false
                })
            },
            // 添加货品
            addGoods() {
                this.isAddGood = true
                if (this.form.placeorderAt === '') {
                    this.$message.error('请先选择制单日期');
                }
                ;
                let materialBuyChecked;
                if (this.orderSelect) {
                    materialBuyChecked = true
                } else {
                    materialBuyChecked = false
                }
                this.goodsList.push({
                    'materialChecked': false,
                    'goodSelHave': false,
                    materialBuyChecked: materialBuyChecked,
                    commonBom: {}
                })
            },
            //删除货品
            goodsDelete(index) {
                // console.log(121);
                if (this.goodsList[index].goodSelHave) {
                    //已经选择了货品的就出个弹框让用户确认是否删除
                    this.goodsListIndex = index;
                    this.deleVisible = true
                } else {
                    this.goodsList.splice(index, 1)
                }


            },
            //有货品的确认删除
            delGoodsSure() {
                this.deleVisible = false
                this.goodsList.splice(this.goodsListIndex, 1)
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            },
            onSubmit() {
                // console.log('submit!');
            },

            // 选取制单日期
            beginTime(val) {
                if (val) {
                    this.form.placeorderAt = val;
                } else {
                    this.form.placeorderAt = "";
                }
            },
            formatTime(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1,
                    month = month < 10 ? "0" + month : month;
                var day = date.getDate(),
                    day = day < 10 ? "0" + day : day;
                return year + "-" + month + "-" + day;
            },
            // 获取外发厂列表 和今天的默认制单时间
            getOutsideFactoryList() {
                let params = {
                    factoryId: this.form.unitId,
                    userId: this.userId
                }
                let newDay = new Date();
                newDay = this.formatTime(newDay);
                this.form.placeorderAt = newDay;
                outsideFactoryListForSelect(params).then(res => {
                    // console.log(res, '外发工厂列表')
                    if (res.data.code === 0) {
                        this.outsideFactoryList = res.data.data
                    }
                })
            },
            // 选择货品后获取getStyleId 组件传来的
            getStyleId(val) {
                // console.log(val);
                this.goodsList[val.goodsIndex].goodSelHave = true;
                this.$set(this.goodsList[val.goodsIndex].commonBom, 'styleId', val.editGoodsStyleId)
                // this.goodsList[val.goodsIndex].commonBom.styleId = val.editGoodsStyleId;
                // this.goodsList[val.goodsIndex].addMissionInfo.styleId = val.editGoodsStyleId;
            },
            bomData(val) {
                this.goodsList[val.goodsIndex].commonBom.commonMaterialsSkuList = val.commonMaterialsSkuList;
                this.goodsList[val.goodsIndex].commonBom.id = val.commonBomId;
                // this.addMissionInfo.facMissionBomDTO = val;
            },
            // 取消并返回生产订单列表
            goBack(){
                this.isNeedRefresh = false
                this.$router.go(-1)
            }


        }
    }
</script>
<style lang="scss">

    .orderProductionNew {
        .orderProductionNew-news-checkbox {
            .el-form-item__content {
                margin-left: 0 !important;
            }
        }
        .filter-form__item {
            display: inline-block;
            margin-bottom: 18px;
        }
        .goods-order {
            display: flex;
            justify-content: space-between;

        }
        .need-tittle {
            .content_wrap--content {
                position: relative;
                top: -3px;
                left: 10px;
                width: 90%;
                width: calc(100% - 100px);
            }
        }
        .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                font-size: 16px;
            }
            p {
                line-height: 26px;
            }
        }
    }

</style>
<style scoped lang="scss">
    @import '~scss_vars';

    .material-new-remove-right {
        padding-left: 20px;
    }

    .orderProductionNew {
        background: #F0F2F5;
        .orderProductionNew-news,.orderProductionNew-file {
            width: 100%;
            min-height: 200px;
            padding: 24px;
            overflow: hidden;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
            border-radius: 2px;
        }
        .orderProductionNew-file{
            margin-top: 8px;
        }
        .orderProductionNew-goods {
            margin-top: 12px;
            .orderProductionNew-goodsList {
                padding: 24px;
                box-sizing: border-box;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
                border-radius: 2px;
                margin-bottom: 8px;
                .need-tittle {
                    margin-top: 16px;
                    display: flex;
                    .content_wrap--content {
                        position: relative;
                        top: -3px;
                    }
                }
                .info-item {
                    width: 360px;
                    display: flex;
                    align-items: center;
                    margin-left: -15px;
                    position: relative;
                    .goods-edit {
                        display: inline-block;
                        padding-left: 5px;
                        padding-right: 32px;
                        cursor: pointer;
                    }
                    .el-input {
                        flex: 1;
                        display: flex;
                    }
                    .el-select {
                        display: flex;
                        flex: 1;
                    }
                    &__label {
                        display: inline-block;
                        width: 80px;
                        margin-right: 12px;
                        text-align: right;
                        vertical-align: middle;
                        color: #3b3b3b;
                        &.is-required {
                            &::before {
                                content: '*';
                                vertical-align: middle;
                                color: #fa3c3c;
                            }
                        }
                    }
                    &.preview-btn__wrap {
                        flex-direction: row-reverse;
                    }
                    .form-tips {
                        font-size: 12px;
                        position: absolute;
                        bottom: -14px;
                        left: 90px;
                        color: #FA4150;
                    }
                }
                .customerSel {
                    width: 230px;
                    border: 1px solid rgb(191, 200, 217);
                    height: 34px;
                    border-radius: 2px;
                    display: inline-block;
                    position: relative;
                    &:hover {
                        /* border: 1px solid $color-btn;*/
                    }
                    .customerSelect {
                        position: absolute;
                        left: 8px;
                        top: 30%;
                    }
                    .customerS {
                        color: rgb(148, 158, 186);
                        position: absolute;
                        left: 8px;
                        top: 30%;
                    }
                    .colorFont {
                        color: #2c2c2c;
                        font-size: 14px;
                        &::-webkit-input-placeholder {
                            color: rgb(148, 158, 186);
                        }
                    }

                    .el-icon-caret-bottom {
                        position: absolute;
                        right: 8px;
                        top: 11px;
                        font-size: 12px;
                        color: rgb(191, 200, 217);
                        transition: all 0.5s;
                    }
                    .down {
                        transform: rotate(180deg);
                        transition: height 0.5s;
                    }
                    .customer_table {
                        width: 100%;
                        height: 0;
                        overflow: auto;
                        position: absolute;
                        top: 38px;
                        right: 0;
                        z-index: 100;
                        background-color: #fff;
                        border-radius: 2px;
                        transition: all 0.3s;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                        0 0 6px rgba(0, 0, 0, 0.04);
                        .setCustomer {
                            cursor: pointer;
                            display: flex;
                            text-indent: 2em;
                            align-items: center;
                            height: 34px;

                            border-bottom: 1px solid #fafafa;
                            font-weight: 400;
                            .el-icon-plus {
                                font-weight: 100;
                                font-size: 12px;
                                margin-right: 4px;
                            }
                        }
                        ul {
                            height: 220px;
                            li {
                                height: 34px;
                                display: flex;
                                align-items: center;
                                text-indent: 2em;
                                color: rgb(72, 82, 106);
                                transition: all 0s;
                                &:hover {
                                    background: rgb(228, 230, 241);
                                }
                            }
                        }
                    }
                    .heightUl {
                        height: 250px;
                        transition: height 0.5s;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                        0 0 6px rgba(0, 0, 0, 0.04);
                    }
                }
                .customer_table {
                    width: 100%;
                    height: 0;
                    overflow: auto;
                    position: absolute;
                    top: 38px;
                    right: 0;
                    z-index: 100;
                    background-color: #fff;
                    border-radius: 2px;
                    transition: all 0.3s;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                    0 0 6px rgba(0, 0, 0, 0.04);
                    .setCustomer {
                        cursor: pointer;
                        display: flex;
                        text-indent: 2em;
                        align-items: center;
                        height: 34px;
                        color: $color-btn;
                        border-bottom: 1px solid #fafafa;
                        font-weight: 400;
                        .el-icon-plus {
                            font-weight: 100;
                            font-size: 12px;
                            margin-right: 4px;
                        }
                    }
                    ul {
                        height: 220px;
                        li {
                            height: 34px;
                            display: flex;
                            align-items: center;
                            text-indent: 2em;
                            color: rgb(72, 82, 106);
                            transition: all 0s;
                            &:hover {
                                background: rgb(228, 230, 241);
                            }
                        }
                    }
                }
            }
            .orderProductionNew-goodsAdd {
                cursor: pointer;
                margin-top: 8px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
                border-radius: 2px;
                height: 46px;
                line-height: 46px;
                padding-left: 24px;
                color: #FFA914;
            }
        }

    }

</style>
