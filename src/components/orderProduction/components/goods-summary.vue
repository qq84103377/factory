<template>
    <div>
        <div class="goods-summary">
            <el-form ref="form" label-width="80px" style="">

                <el-form-item class="filter-form__item" v-clickoutside="hideSelectGood">
                    <div class="info-item">
                                <span class="info-item__label is-required">
                                    商品款号
                                </span>
                        <div :class="['customerSel',form.goodsUnitId===''&& isAddSure?'order-customer':'']"
                             @click="selectGoods" style="display:flex;flex:1;">
                            <div style="display:flex;flex:1;"
                                 :class="{'customerSelect': goodsValue,'customerS':!goodsValue}">
                                <input class="colorFont" type="text" placeholder="输入款号/名称/货号搜索" v-model="goodsValue"
                                       @keyup="seachGoodsInfo">
                            </div>
                            <i class="el-icon-caret-bottom" :class="{'down':downGoods}"></i>
                            <div class="customer_table" :class="{'heightUl':downGoods}">
                                <div v-if="isAllowAdd" class="setCustomer" @click="handleGoods('add')">
                                    <i class="el-icon-plus"></i>新建
                                </div>
                                <ul>
                                    <li v-for="(item,index) in info.goodsOptions" :key="index"
                                        @click.stop="selecteGoods(item,index)">
                                        <img style="width: 30px;height:30px;margin:0 5px 0 10px;background-color:lightgray" :src="item.picture" v-errorLogo>
                                        <span>{{item.show}}</span>
                                        <!--<span>{{ item.styleNo }}{{item.styleName !== '未填写' && item.styleName?'-'+item.styleName:''}}</span>-->
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <span class="form-tips" v-show="form.goodsUnitId===''&& isAddSure">商品款号不能为空</span>
                    </div>
                </el-form-item>

                <el-form-item class="filter-form__item is-required" label="交货日期" style="margin: 0 10px;" >
                    <div @click="checkPlaceorderAt">
                        <el-date-picker :class="{'order-date':form.deliveryAt===''&& isAddSure}"
                                        :disabled="placeorderAt ===''"
                                        v-model="form.deliveryAt"
                                        @change="endTime"
                                        type="date" format="yyyy-MM-dd" placeholder="选择日期"
                                        :picker-options="pickerOptions1">
                        </el-date-picker>
                        <span class="form-tips" style="left: 0px;" v-show="!form.deliveryAt&& isAddSure">交货日期不能为空</span>
                    </div>


                </el-form-item>
                <el-form-item class="filter-form__item" v-if="factoryCheck" label="单价" style="margin: 0 10px;">
                    <el-input v-model="form.processUnitPrice" type="number" placeholder="请输入单价"></el-input>
                </el-form-item>
            </el-form>
            <div class="selectedConfigListBigItem" v-if="skuList && skuList.length">
                    <div  v-for="$item in selectedConfigList" :key="$item.id" :class="{itemWidthBr:$item.fieldCode==='goodsPictures'||$item.fieldCode==='goodsDescribe'}" style="display: inline-block">

                        <div v-if="$item.fieldCode==='goodsPictures'" v-show="getVisibleGoodsInfoList.goodsFirstPicture" style="background: #f6f6f6;padding: 10px 0;">
                            {{$item.name}}：
                            <img v-for="(imgItem,indexImg) in getVisibleGoodsInfoList.goodsPictures" @click="imgList(getVisibleGoodsInfoList.goodsPictures,indexImg)"  style="width: 80px;vertical-align:middle;height: 80px;cursor: pointer;margin-right: 10px;" :src="imgItem" alt="" >
                        </div>
                        <div v-else-if="$item.fieldCode==='goodsDescribe'" style="margin: 10px 0;display: flex">
                            <span style="display: inline-block;width: 80px">{{$item.name}}：</span><span style="display: inline-block;flex: 1" v-html="getVisibleGoodsInfoList.goodsDescribe"> </span>
                        </div>
                            <span class="selectedConfigListItem" v-else-if="$item.fieldCode==='sumDropPrice'">{{$item.name}}：￥{{filterNumPrice(getVisibleGoodsInfoList.retailPrice)}}</span>
                            <span class="selectedConfigListItem" v-else-if="$item.fieldCode==='sumPrice'">{{$item.name}}：￥{{filterNumPrice(getVisibleGoodsInfoList.lastSupplyPrice)}}</span>
                            <span class="selectedConfigListItem" v-else-if="filterPrice.indexOf($item.fieldCode)>-1">{{$item.name}}：￥{{getVisibleGoodsInfoList[$item.fieldCode]}}</span>
                         <span class="selectedConfigListItem" v-else-if="$item.fieldCode.indexOf('customField')==-1">{{$item.name}}：{{getVisibleGoodsInfoList[$item.fieldCode]}}</span>
                    </div>
            </div>
            <el-col :span="24" class="info-list1" >


                <span class="info-item" style="margin-left:155px;margin-top: 10px;" v-if="skuList && skuList.length">
                    <span style="cursor: pointer" @click="checkGoodsPic(pic_itemGoods)">
                        <img v-if="addMissionInfo.goodsId" style="height:36px;width:36px;vertical-align: middle"
                             :src="pic_itemGoods.picture ? pic_itemGoods.picture : staticImg">
                                <span class='checkGoodsPic'
                                      v-if="addMissionInfo.goodsId" style="font-size:14px;color:#636363;">查看货品图片</span>
                    </span>

                                <span class="goods-edit" @click="handleGoods('edit')" v-if="addMissionInfo.goodsId"><icon
                                        type="icon-edit"></icon> 编辑货品</span>
                                <span style="font-size:14px;color:#636363;">数量总计：</span>
                                <span style="color:#ff9c38;font-size:16px;">{{addMissionInfo.total ? addMissionInfo.total : 0}}</span> 件
                            </span>
                <span class="info-item">
                            </span>
                <nf-button
                        style="margin-left:600px;font-size:12px;top: -30px;position: relative;"
                        type="success" @click="getSkuCodeShow('nfskutable')" v-if="skuList && skuList.length && $route.query.type==='formal'&&radio==='1'">按码比填数</nf-button>
            </el-col>
            <!--表格开始-->
            <el-col class="info-table" style="margin-bottom: 10px;margin-top: 10px;" :span="24"
                    v-if="skuList && skuList.length">
                <!--预下单-->
                <nf-sku-table
                        v-show="$route.query.type==='informal'"
                        ref="nfskutableSkc"
                        :metadatas="skuList"
                        style="margin-left: 153px;"
                        @skcChange="skcCountTotalNum"
                        showNum
                        editable
                        :quantities="form.facPrdOrderGoodsAdvanceDetailList"
                        skc
                ></nf-sku-table>
                <!--生产订单-->
                <div class="informalTable"  v-if="$route.query.jumpFrom==='informal'">
                    <p class="informalTable_p">预下单：</p>
                    <el-table
                            border
                            :data="[{}]"
                            :style="{'width':form.facPrdOrderGoodsAdvanceDetailList.length*120+2+'px'}">
                        <el-table-column
                                v-for="(item,index) in form.facPrdOrderGoodsAdvanceDetailList"
                                :key="index"
                                :prop="item.num"
                                :label="item.color_no_name"
                                align="center"
                                width="120">
                            <template slot-scope="scope">
                                <p>{{item.num}}</p>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>

                <nf-sku-table
                        v-show="$route.query.type==='formal'"
                        editableAndInitial
                        ref="nfskutable"
                        :metadatas="skuList"
                        style="margin-left: 153px;"
                        @change="countTotalNum"
                        :quantities="skuListCount"
                        showNum
                        :editable="radio==2?false:true"
                ></nf-sku-table>
                <!-- <service-table :tableData="tableData3" :skuVal="skuVal" @setReportOnce="getOnce" :isEdit="true"></service-table> -->
            </el-col>
            <div class="radio-goods-summary" v-if="skuList && skuList.length && $route.query.type!=='informal'">
                <el-radio v-model="radio" label="1">按商品填数</el-radio>
                <el-radio v-model="radio" label="2">分客户填数</el-radio>
            </div>

            <div class="radio-customer-summary" v-if="radio==='2'">
                <div class="radio-customer-summary-list" v-for="($item,$index) in customerSummaryList">
                    <div class="radio-customer-summary-top">
                        <div class="info-item customer-summary-value" v-clickoutside="hideDownGoods">
                                <span class="info-item__label is-required">
                                    客户
                                </span>
                            <customer  single="single" v-model="$item.commonCustomerId"></customer>
                            <!--<div :class="['customerSel',formVerification.customerName?'order-customer':'']"-->
                                 <!--@click="selectCustomer($index)" style="display:flex;flex:1;">-->
                                <!--<div style="display:flex;flex:1;"-->
                                     <!--:class="{'customerSelect':$item.customerValue,'customerS':!$item.customerValue}">-->
                                    <!--<input class="colorFont" type="text" placeholder="请选择客户" v-model="$item.customerValue"-->
                                           <!--@keyup="seachCustomer($index)">-->
                                <!--</div>-->
                                <!--<i class="el-icon-caret-bottom" :class="{'down':$item.downCustomer}"></i>-->
                                <!--<div class="customer_table" :class="{'heightUl':$item.downCustomer}">-->
                                    <!--<div class="setCustomer" @click="customerDialog = true">+ 新建</div>-->
                                    <!--<ul>-->
                                        <!--<li v-for="(item,index) in $item.customerList" :key="index"-->
                                            <!--@click="selectedCustomer(item,$index)">-->
                                            <!--<span>{{item.name}}</span>-->
                                        <!--</li>-->
                                    <!--</ul>-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<span class="form-tips" v-show="formVerification.customerName">客户不能为空</span>-->
                        </div>
                        <div class="customer-summary-count">
                            <span>数量合计：<span class="customer-summary-num">{{$item.count}}</span></span>
                            <span class="customer-summary-del" @click="customerDelete($index)"><i class="fa fa-times"></i>删除此客户</span>
                            <nf-button
                                    style="margin-left:16px;font-size:12px;"
                                    type="success" @click="getSkuCodeShow('nfskutableRef'+$index)" v-if="skuList && skuList.length && $route.query.type==='formal'">按码比填数</nf-button>
                        </div>
                    </div>
                    <nf-sku-table
                            :ref="'nfskutableRef'+$index"
                            editable
                            showNum
                            pageAttributes="multiComponent"
                            editableAndInitial
                            :skuListCustomerIndex="$index"
                            :metadatas="skuList"
                            :quantities='$item.facPrdOrderGoodsCustomerDetailList'
                            style="margin-left: 76px;margin-top: 10px;"
                            @change="customerGetNum"
                    ></nf-sku-table>
                    <div class="radio-customer-summary-line"></div>
                </div>
                <div class="radio-customer-summary-btn">
                    <el-button @click="addCustomer">
                        + 添加客户
                    </el-button>
                </div>


            </div>
        </div>
        <!--客户-->
        <transition name="right-move">
            <customer-dialog v-if="customerDialog" @hidden="hiddenAddCustomerDialog"
                             @updateName="updateName"></customer-dialog>
        </transition>
        <!--新建或者编辑货品-->
        <transition name="right-move">
            <goods-dialog
                    v-if="goodsDialog"
                    modelName="FAC_PRD_ORDER"
                    :handleType="handleType"
                    :goodsId="editGoodsId"
                    :styleId="editGoodsStyleId"
                    @hidden="hiddenAddGoodsDialog">
            </goods-dialog>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="customerDialog" @click="hiddenAddCustomerDialog">
            </div>
            <div class="cover1" v-if="goodsDialog" @click="hiddenAddGoodsDialog">
            </div>
        </transition>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <!--删除客户-->
        <el-dialog
                :show-close="false"
                :visible.sync="deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除此客户？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delGoodsSure">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
        <!--更新加工厂-->
        <el-dialog
                :show-close="false"
                :visible.sync="outSideFactoryVisible"
                :modal-append-to-body="false"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip" style="padding:30px 0;">{{outsideText}}</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="outSideFactoryVisible = false">不更新</nf-button>
                    <nf-button type="warning" @click="updateOutSideFactory">更 新</nf-button>
                </div>
            </div>
        </el-dialog>
        <!-- 码比数 -->
        <sku-code-ratio :styleId="editGoodsStyleId" :metadatas="skuList" :quantities="form.facPrdOrderGoodsAdvanceDetailList" :isShow.sync="skuCodeShow"  @getCodeNumber="getCodeNumber"></sku-code-ratio>
    </div>

</template>
<script>
    import {
        selectFacCustomer,
        selectFacGoodsStyleList,
        getGoodSkuList,
        getCommonProcessForm,
        getFacGoodsPictureList,
        getWorkbayList,
        getEasyCustomerList,
        getGoodsLastLastSupplyPrice,
        getVisibleGoodsInfoByStyleId,
        getFieldConfig,
        getFacCustomerList
    } from '@/api';
    import skuCodeRatio from '@/components/Common/sku-table/sku-code-ratio.vue'
    import GoodsDialog from '../../order/createChild/goods-dialog.vue'
    import CustomerDialog from '../../order/createChild/customer-dialog.vue'

    export default {
        props: ['goodsIndex','placeorderAtTime','outsideFactoryCheck','editData', 'commonOutsideFactoryId', 'isEdit', 'isAddGood', 'modelName'],
        /***************************
         *
         * commonOutsideFactoryId: 加工厂id // 用来判断是否与商品供应商一致
         * isEdit: 是否是编辑状态
         * isAddGood: 是否添加订货商品
         * modelName 模块名称对应的值（用于权限配置）
         *      ALL	全部模块
         *      GOODS_STYLE	商品档案
         *      SPL_DESIGN_STYLE	设计档案
         *      FAC_PRD_ORDER	生产订单
         *      FACTORY_MISSION	生产工单
         *      GOODS_STOCK	商品库存
         *
         *
         * ****************************/

        computed:{
            factoryCheck:function () {
                return this.outsideFactoryCheck
            },
            outSidefactoryId:function () {
                return this.commonOutsideFactoryId
            },
            placeorderAt:function () {
                return this.placeorderAtTime
            },
            isAllowAdd() {
                let datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                return datalist.indexOf("fac.goods.add") != -1
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            editFlag () { // 首次编辑的时候不触发
                let editFlag = false
                if(this.isEdit && this.$route.query.type =="formal" && !this.isAddGood) { // 订单编辑状态
                    editFlag = true
                } else if (this.isEdit && this.$route.query.type =="formal" && this.isAddGood){
                    editFlag = false
                }
                return  editFlag
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        data() {
            return {
                filterPrice:['firstSupplyPrice','accountingPrice','lastSupplyPrice','retailPrice','price','cost'],
                selectedConfigList:[],
                getVisibleGoodsInfoList:{},
                skuCodeShow:false,
                customerSummaryList:[{count:0,downCustomer:false,facPrdOrderGoodsCustomerDetailList:[],commonCustomerId:''}],
                skuListCount:[],
                isAddSure:false,
                form:{
                    deliveryAt:"",         //货期
                    "processUnitPrice":"",   //加工单价
                    "fillType":0,       //0按货品填数  1按客户填数
                    "isMaterials":0,      //0不选择物料需求 1选择物料需求
                    "isPurchaseOrder":0,  //0不是提交订单的同时生成采购计划 1提交订单的同时生成采购计划
                    "goodsUnitId":"",     //货品id
                    "facPrdOrderGoodsDetailList":[],     //生产单订货详情
                    "facPrdOrderGoodsCustomerList":[],     //生产单-货品-客户组合列表
                    "facPrdOrderGoodsAdvanceDetailList":[],     //预下单的skc
                },
                pickerOptions1: {
                    disabledDate: placeordertime => {
                        if (this.placeorderAt) {
                            const date = this.placeorderAt.replace(/-/g, "/");
                            return placeordertime.getTime() <= +new Date(date) - 8.64e7;
                        }
                    }
                },
                options: {
                    goodsList: [],
                },
                addMissionInfo: {
                    facMissionBomDTO: {},
                    styleId: "",
                    goodsId: "",
                    total: "",
                },  // BOM表
                tableData3: {},
                skuList: [],
                goods: [],
                goodsValue: '',
                getGds: 1,
                info: {
                    goodsOptions: [] //货品下拉列表,
                },
                downGoods: false,
                centerDialogVisible: false,   //图片预览
                imgLists: [],
                imgIndex: 0,
                pic_itemGoods: {},
                staticImg: this.$globalConfig.qiniu.baseDefaultUrl,  //图片预览
                formVerification: {
                    orderName: false,
                    customerName: false,
                    endTime: false,
                    goodsNo: false,
                    leaderSelected: false
                },

                handleType: '',  //货品
                editGoodsId: '',  //货品id
                editGoodsStyleId: '',
                goodsDialog: false,

                radio: '1',   //单选货品或客户
                downCustomer: false,   // 客户
                customerDialog: false,   // 客户
                deleVisible: false,   // 客户
                customerListIndex:0,
                editCustomerIndex:0,
                customerValue: '',
                customerList: [],
                customerSummaryListAll: [],
                ratioCodeDom:'',
                outSideFactoryVisible: false, // 更新弹窗
                outsideText: '',
            }
        },
        components: {
            CustomerDialog,
            skuCodeRatio,
            GoodsDialog
        },
        watch:{
            '$route':function (val) {
                // console.log(212121);
            },
        },
       async created() {
            // 获取所有客户下拉列表
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                keyword:  ''
            };
           await getEasyCustomerList(params).then(res => {
                this.customerSummaryListAll=res.data.customerList
            });
            //订单编辑
           if(this.editData){
                this.form =JSON.parse(JSON.stringify(this.editData)) ;
                if(this.editData.fillType===1){
                    this.radio='2';
                    this.customerSummaryList = this.editData.facPrdOrderGoodsCustomerList
                    this.customerSummaryList.forEach(item=>{
                        item.customerValue = item.custName
                        item.count = item.totalNum
                        item.customerList = JSON.parse(JSON.stringify(this.customerSummaryListAll))
                        item.downCustomer = false
                    })
                }
                // this.form.fillType = this.editData.fillType;    //0按货品填数 1按客户填数
                // this.form.isMaterials = this.editData.isMaterials;    //1有物料
                // this.form.processUnitPrice = this.editData.processUnitPrice;    //单价
                //根据商品名称获取信息
                this.getGoods(this.editData.styleNo);
                this.skuListCount = this.editData.facPrdOrderGoodsDetailList
            }else {
                //获取货品下拉列表信息
                this.getGoods();
            }
            this.getSelectedConfigList()


        },
        methods: {
            filterNumPrice(val){
                // console.log(val);
                return Number(val)*this.addMissionInfo.total
            },
            // 图片预览
            imgList(row,index) {
                this.imgIndex = index;
                this.imgLists = row
                // this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            //配置
            getSelectedConfigList(){
                getFieldConfig({unitId:this.unitId}).then(res=>{
                    // console.log(res);
                    this.selectedConfigList = res.data.data.selectedConfigList;


                })
            },
            // 配置显示的内容
            getVisibleGoodsInfoByStyleId(styleId){
                getVisibleGoodsInfoByStyleId({styleId,unitId:JSON.parse(sessionStorage.getItem('user_login')).unitId}).then(res=>{
                    // console.log(res,'getVisibleGoodsInfoList');
                    this.getVisibleGoodsInfoList = res.data.data;
                    // 订单判断加工厂跟选择的商品的供应商是否一致
                    if (this.factoryCheck&&this.$route.query.type==='formal'&& !this.editFlag) {
                        //　加工厂和商品供应商同时存在
                        if (this.getVisibleGoodsInfoList.commonOutsideFactoryId && this.outSidefactoryId != this.getVisibleGoodsInfoList.commonOutsideFactoryId&&this.outSidefactoryId) {
                            this.outsideText = `是否将加工厂商更新为商品的供应商：${this.getVisibleGoodsInfoList.supplierName}`
                            this.outSideFactoryVisible = true
                        } else if(this.getVisibleGoodsInfoList.commonOutsideFactoryId && !this.outSidefactoryId){
                            this.$emit('updateOutSideFactory', this.getVisibleGoodsInfoList.commonOutsideFactoryId)
                        }
                    } else if (this.getVisibleGoodsInfoList.commonOutsideFactoryId && !this.factoryCheck){ // 没有勾选加工厂，选择了商品供应商
                        this.$emit('updateFactoryCheck', true)
                        this.$emit('updateOutSideFactory', this.getVisibleGoodsInfoList.commonOutsideFactoryId)
                    }
                    this.editFlag = false
                })
            },
            // g更新工厂
            updateOutSideFactory() {
                this.$emit('updateOutSideFactory', this.getVisibleGoodsInfoList.commonOutsideFactoryId)
                this.outSideFactoryVisible = false
            },
            // 码比数
            getSkuCodeShow(name) {
                this.ratioCodeDom= name
                this.skuCodeShow = true
            },
            // 设置码比数
            getCodeNumber(val) {
                if(this.radio==2){
                    this.$refs[this.ratioCodeDom][0].setCurrentSkuVal(JSON.parse(JSON.stringify(val)))
                }else {
                    this.$refs[this.ratioCodeDom].setCurrentSkuVal(JSON.parse(JSON.stringify(val)))

                }
            },
            //给父级发送数据
            sendFormData(){
                this.isAddSure = true;
                //是否是分客户填数
                if(this.radio==1){
                    this.form.fillType=0
                }else {
                    this.form.fillType=1
                }
                // // 删除没用的数据
                // if(this.customerSummaryList.length){
                //     this.customerSummaryList.forEach(item=>{
                //         item.customerList = []
                //     })
                // }
                this.form.facPrdOrderGoodsCustomerList = this.customerSummaryList
                return this.form
            },
            // 选取交货日期
            endTime(val) {
                if (val) {
                    this.form.deliveryAt = val;
                } else {
                    this.form.deliveryAt = "";
                }
            },
            checkPlaceorderAt() {
                if (this.placeorderAt ===''){
                    this.$message.error('请先选择制单日期');
                }
            },
            // 获取货品款号
            getGoods(styleNo) {
                var _this = this;
                if (styleNo) {
                    this.goodsValue = styleNo;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: styleNo?styleNo:'',
                    userId: this.userId,
                    modelName: 'FAC_PRD_ORDER',
                };
                selectFacGoodsStyleList(params).then(res => {
                    // console.log(res);
                    if (res.data.code == 0) {
                        _this.info.goodsOptions = res.data.goods;
                        _this.goods = res.data.goods;
                        // if (this.getGds == 1) {
                        if (styleNo) {
                            //新建和编辑时，选中添加的货品
                            let goodsOpt = res.data.goods;
                            let selectVal = goodsOpt.find(function (item) {
                                return item.styleNo == styleNo;
                            });
                            if (selectVal) {
                                _this.selecteGoods(selectVal);
                            }
                            // this.goodsValue = res.data.goods[0].styleNo;
                            // this.editGoodsId = res.data.goods[0].goodsId;
                            // this.editGoodsStyleId = res.data.goods[0].styleId;
                            // this.addMissionInfo.styleId = res.data.goods[0].styleId;
                            // let val = res.data.goods[0].goodsId + '-' + res.data.goods[0].styleId;
                            // this.goodsChange(val);
                            // this.getGds = 0;
                        }
                    }
                });
            },
            goodsChange(val) {
                var val = val.split("-");
                this.addMissionInfo.goodsId = val[0];
                var _this = this;
                _this.tableData3 = [];
                for (var i = 0; i < _this.goods.length; i++) {
                    if (_this.goods[i].styleId == val[1]) {
                        _this.fetchSkuList(_this.goods[i].goodsId);
                        _this.tableData3 = this.goods[i];
                    }
                }
            },
            // 获取skuList
            fetchSkuList(id) {
                getGoodSkuList({
                    goodsId: id
                }).then(res => {
                    // console.log(res.data, '-----')
                    this.skuList = res.data;
                });
            },

            //点击隐藏货品
            hideSelectGood() {
                this.downGoods = false;
            },
            //显示货品下拉
            selectGoods() {
                // console.log(12);
                this.downGoods = true;
            },
            countTotalNum() {
                if(this.$route.query.type==='formal'){
                    //生产订单
                    const skus = this.$refs['nfskutable'].getSkuTableValue();
                    // console.log(skus);
                    ///生产单订货详情
                    this.form.facPrdOrderGoodsDetailList = []
                    for (var k in skus){
                        this.form.facPrdOrderGoodsDetailList.push(skus[k])
                    }
                    this.addMissionInfo.total = Object.keys(skus).reduce((total, key) => {
                        total += Number(skus[key].num);
                        return total;
                    }, 0);
                }
            },
            //预下单的sku组件传的数据
            skcCountTotalNum(val){
                // if(this.$route.query.type==='informal'){
                    // console.log("传的数据是什么：",val);
                    let sum = 0
                    val.forEach(item=>{
                        item.colorId=item.color_id;
                        if(item.num){
                            sum+= Number(item.num)
                        }
                    })
                    this.addMissionInfo.total = sum
                    this.form.facPrdOrderGoodsAdvanceDetailList = val
                // }

            },




            //搜索更多货品款号
            seachGoodsInfo() {
                if (this.goodsValue) {
                    this.downGoods = true;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.goodsValue,
                    userId: this.userId,
                    modelName: 'FAC_PRD_ORDER',
                };
                selectFacGoodsStyleList(params).then(res => {
                    if (res.data.code == 0) {
                        this.info.goodsOptions = res.data.goods;
                        this.goods = res.data.goods;
                    }
                });
            },
            //选择货品
            selecteGoods(item, index) {

                // console.log(item, index, this.goodsValue);
                //选择相同货品时return
                // if (this.editGoodsStyleId === item.styleId) {
                //     return;
                // }
                this.getVisibleGoodsInfoByStyleId(item.styleId)
                getGoodsLastLastSupplyPrice({styleId:item.styleId}).then(res=>{
                    // console.log(res);
                    this.form.processUnitPrice = res.data.data.lastSupplyPrice
                })
                this.pic_itemGoods = item;
                this.addMissionInfo.total = 0;
                this.addMissionInfo.sku = [];
                this.goodsValue = item.styleNo;
                this.form.goodsUnitId = item.goodsId;  //货品id
                this.addMissionInfo.goodsId = item.goodsId;  //货品id
                this.editGoodsId = item.goodsId;
                this.editGoodsStyleId = item.styleId;
                let obj = {
                    goodsIndex: this.goodsIndex,
                    editGoodsStyleId: this.editGoodsStyleId,
                }
                this.$emit('getStyleId', obj)
                let _this = this;
                _this.tableData3 = [];
                for (let i = 0; i < _this.goods.length; i++) {
                    if (_this.goods[i].styleId == item.styleId) {
                        const isHideLength = this.goods[i].lengths.length === 1 && this.goods[i].lengths[0].name === '无';
                        if (isHideLength) {
                            _this.goods[i].lengths = [];
                        }
                        this.goods[i].colors = this.mapColorName(this.goods[i].colors);
                        _this.tableData3 = this.goods[i];
                        _this.fetchSkuList(_this.goods[i].goodsId);
                    }
                }
                // console.log( _this.tableData3)
                this.addMissionInfo.styleId = item.styleId;
                this.downGoods = false;
                // this.fetchCommonProcessForm(item.styleId);
            },
            // 拼接色名和色号，（表格）
            mapColorName(colorList = []) {
                return colorList.map(item => {
                    if (item.name) {
                        item.name = `${item.value}-${item.name}`
                    }
                    else {
                        item.name = item.value
                    }
                    return item
                })
            },

            //查看货品当前封面
            checkGoodsPic(row) {
                // console.log(row);

                this.centerDialogVisible = true;
                let params = {
                    "facId": JSON.parse(sessionStorage.getItem("last_login")).id,
                    "goodsId": row.goodsId
                };
                getFacGoodsPictureList(params).then(
                    res => {
                        this.imgLists = []
                        res.data.goodsPictureUrls.forEach(item => {
                            this.imgLists.push({path: item})
                        })
                    }
                )
            },
            // 货品操作
            handleGoods(type) {

                //清空货品输入内容
                // this.goodsValue = '';
                this.handleType = type;
                this.goodsDialog = true;
            },
            hiddenAddGoodsDialog(val, styleNo) {
                if (val == 1) {
                    this.getGds = 1;
                    this.getGoods(styleNo);
                }
                this.goodsDialog = false;
            },

            //客户
            //添加客户
            addCustomer(){
                this.customerSummaryList.push({count:0,downCustomer:false,facPrdOrderGoodsCustomerDetailList:[]})
                this.seachCustomer(this.customerSummaryList.length-1);
            },
            // 获取客户列表
            fetchCustomerList() {
                var _this = this;
                var userLogin = JSON.parse(sessionStorage.getItem("user_login"));
                var lastLogin = JSON.parse(sessionStorage.getItem("last_login"));
                var params = {
                    userId: this.userId,
                    token: "",
                    facIds: [lastLogin.id]
                };
                getWorkbayList(params).then(res => {
                    if (res.data.code == 0) {
                        _this.principalOptions = res.data.data; // 负责人
                    }
                });
            },
            hideDownGoods() {
                // this.customerSummaryList[0].downCustomer = false;
                this.customerSummaryList.forEach((item,index)=>{
                    item.downCustomer = false;
                })

            },
            //显示客户下拉
            selectCustomer(index) {
                // console.log('*******');
                // console.log(this.customerSummaryList[index].downCustomer);
                this.editCustomerIndex = index;

                this.customerSummaryList[index].downCustomer = !this.customerSummaryList[index].downCustomer;
                // this.$set(this.customerSummaryList[index],'downCustomer',!this.customerSummaryList[index].downCustomer)
                this.seachCustomer(index)
                // this.fetchCustomerList();
                if (this.downGoods == true) {
                    this.downGoods = false;
                }
                this.customerSummaryList = JSON.parse(JSON.stringify(this.customerSummaryList))
            },
            //搜索客户
            seachCustomer(index) {
                if (this.customerSummaryList[index].customerValue) {
                    // this.customerSummaryList[index].downCustomer = true;
                    this.$set(this.customerSummaryList[index],'downCustomer',true)

                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.customerSummaryList[index].customerValue || ''
                };
                getEasyCustomerList(params).then(res => {
                    // this.customerSummaryList[index].customerList = res.data.customerList;
                    this.$set(this.customerSummaryList[index],'customerList',res.data.customerList)
                });
            },
            //选择客户
            selectedCustomer(item, index) {
                this.customerSummaryList[index].customerValue = item.name;
                this.customerSummaryList[index].commonCustomerId = item.id;
                // this.addMissionInfo.customerId = item.id;
                this.customerSummaryList[index].downCustomer = true;
                this.customerSummaryList = JSON.parse(JSON.stringify(this.customerSummaryList))
            },
            // 修改客户的数量
            customerGetNum(val, totalQuality,skuListCustomerIndexSx){
                // console.log(val);
                // console.log(totalQuality);
                // console.log(skuListCustomerIndexSx);
                if(totalQuality==0) return;
                /*
                val 返回的id和num数据
                totalQuality  总数量
                skuListCustomerIndexSx 传过去的 index的值
                */
                this.customerSummaryList[skuListCustomerIndexSx].count=totalQuality;
                //客户的订货详情传值
                this.customerSummaryList[skuListCustomerIndexSx].facPrdOrderGoodsCustomerDetailList=[];
                for (var k in val){
                    this.customerSummaryList[skuListCustomerIndexSx].facPrdOrderGoodsCustomerDetailList.push(val[k])
                }
                this.skuListCount=[];
                var num=0;
                var ids=[];
                var data=[];
                this.customerSummaryList.forEach(item=>{
                    item.facPrdOrderGoodsCustomerDetailList.forEach($item=>{
                        ids.push($item.skuId)
                    })

                })
                console.log(ids);
                //数组去重
                ids = Array.from(new Set(ids));
                ids.forEach(item=>{
                    data.push({skuId:item,num:''})
                });
                //id一样的时候就num相加 不一样就push另一条数据算法
                this.customerSummaryList.forEach(item=>{
                    item.facPrdOrderGoodsCustomerDetailList.forEach($item=>{
                        if($item.num!==''){
                            $item.num=Number($item.num)
                        }
                        data.forEach(dataItem=>{
                            dataItem.num=Number(dataItem.num)
                            if($item.skuId===dataItem.skuId){
                                dataItem.num+=Number($item.num)
                            }
                        });
                    })

                })
                this.skuListCount=data

            },
            //删除客户
            customerDelete(index){
                console.log(121);
                if(this.customerSummaryList[index].commonCustomerId){
                    //已经选择了货品的就出个弹框让用户确认是否删除
                    this.customerListIndex = index;
                    this.deleVisible = true
                }else {
                    this.customerSummaryList.splice(index,1)
                }


            },

            //有客户的确认删除
            delGoodsSure(){
                this.deleVisible = false
                this.customerSummaryList.splice(this.customerListIndex,1)
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            },
            /**隐藏侧拉新建客户 */
            hiddenAddCustomerDialog(val) {
                if (val == 1) {
                    this.getGds = 1;
                    this.getFacCustomerList();
                }
                this.customerDialog = false;
            },
            getFacCustomerList() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                getFacCustomerList(params).then(res => {
                    this.customerList = res.data;
                });
                let newDay = new Date();
                newDay = this.formatTime(newDay);
                this.addMissionInfo.placeorderAt = newDay;
            },
            formatTime(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1,
                    month = month < 10 ? "0" + month : month;
                var day = date.getDate(),
                    day = day < 10 ? "0" + day : day;
                return year + "-" + month + "-" + day;
            },
            //新建客户时，更新当前选择客户
            updateName(name, id) {
                this.customerSummaryList[this.editCustomerIndex].customerValue = name;
                this.customerSummaryList[this.editCustomerIndex].commonCustomerId = id;
                // this.addMissionInfo.customerId = id;
            },

        }

    }
</script>

<style lang="scss">
    .goods_img_arch {
        min-width: 200px;

    }
    .goods-summary {
        .order-date {
            .el-input__inner {
                border: 1px solid red !important;
            }
        }
    }

    .el-radio__label {
        color: #3B3B3B;
    }

    //侧拉动画
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover1 {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }
    .radio-customer-summary-btn{
        .el-button{
            color: #FFA914;
            border: 1px solid #FFA914;
        }
    }

</style>
<style scoped lang="scss">
    @import '~scss_vars';

    .goods-summary {
        position: relative;
        left: -70px;
        .goods_img_arch {
            min-width: 200px;
        }
        .itemWidthBr{
            width: 100%;
        }
        .form-tips {
            font-size: 12px;
            position: absolute;
            bottom: -28px;
            left: 90px;
            color: #FA4150;
        }
        .selectedConfigListBigItem{
            margin-left: 160px;
            .selectedConfigListItem{
                display: inline-block;
                width: 300px;
                margin-bottom: 14px;
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
                        min-height: 34px;
                        display: flex;
                        align-items: center;
                        /*text-indent: 2em;*/
                        font-size: 12px;
                        line-height: 18px;
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
        .order-customer {
            border: 1px solid #FA4150;
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
                    min-height: 34px;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    line-height: 18px;
                    /*text-indent: 2em;*/
                    color: rgb(72, 82, 106);
                    transition: all 0s;
                    &:hover {
                        background: rgb(228, 230, 241);
                    }
                }
            }
        }
        .radio-goods-summary {
            margin-left: 152px;
        }
        .informalTable{
            margin-left: 153px;
            margin-bottom: 10px;
            .informalTable_p{
                margin-bottom: 10px;
                color: #1ca1ff;
            }

        }

        .radio-customer-summary {
            width: 840px;
            padding: 16px 0 0;
            margin-left: 150px;
            background: rgba(252, 253, 255, 1);
            border: 1px solid rgba(230, 234, 240, 1);
            margin-top: 10px;
            .radio-customer-summary-list {
                margin-bottom: 10px;
                .radio-customer-summary-top {
                    display: flex;
                    .customer-summary-value {

                    }
                    .customer-summary-count {
                        margin-left: 16px;
                        line-height: 40px;
                        flex: 1;
                        .customer-summary-num {
                            color: #FF7F14;
                        }
                        .customer-summary-del {
                            float: right;
                            margin-right: 16px;
                            color: #808080;
                            cursor: pointer;
                            i {
                                color: #FA4150;
                                margin-right: 2px;
                            }
                        }
                        .customer-summary-del:hover {
                            color: #3B3B3B;
                        }
                    }
                }
                .radio-customer-summary-line{
                    height: 1px;
                    background:rgba(230,234,240,1);
                    margin-left: 76px;
                    margin-top: 10px;
                    margin-right: 16px;
                }
            }
            .radio-customer-summary-btn{
                margin-left: 76px;
                margin-bottom: 16px;

            }

        }

    }

</style>
