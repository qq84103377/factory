<template>
    <base-box class="wrapper">
        <el-form
                label-width="100px"
                :inline="true"
                :label-position="left"
                :model="filterFormData"
                class="filter-form">
            <el-row
                    class="filter-form__row"
                    justify="space-between">
                <el-form-item class="filter-form__item" label="商品档案">
                    <rich-filter style="width: 194px"
                                v-model="richFilterParams"
                                 dialogType='STYLE'
                                 placeholder="点击可筛选商品"
                                 modelName="FAC_PRD_ORDER"></rich-filter>
                    <!--<goods-select v-model="filterFormData.goodsUnitIdList" :multiple="true" modelName="FAC_PRD_ORDER"></goods-select>-->
                </el-form-item>
                <el-form-item class="filter-form__item" label="加工厂商">
                    <machining-select multiple v-model="filterFormData.outsideFactoryIdList"></machining-select>
                </el-form-item>
                <!--<el-form-item class="filter-form__item" label="厂商货号">-->
                    <!--<el-select-->
                            <!--v-model="filterFormData.styleIdList"-->
                            <!--filterable-->
                            <!--multiple-->
                            <!--clearable-->
                            <!--placeholder="全部">-->
                        <!--<el-option v-for="item in options.styleIdList" :key="item.styleId" :label="item.plantArticleNumber"-->
                                   <!--:value="item.styleId">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item class="filter-form__item" label="客户">
                    <el-select
                            v-model="filterFormData.commonCustomerIdList"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.customerList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-form__item" label="创建人">
                    <el-select multiple clearable :filter-method="getCreateLists" filterable v-model="filterFormData.createByIdsList" placeholder="请选择">
                        <el-option
                                v-for="item in options.createLists"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-row>
            <el-row
                    class="filter-form__row"
                    justify="space-between">
                <el-form-item class="filter-form__item" label="制单日期">
                    <el-date-picker
                            @change="orderDateChange"
                            v-model="orderDateRange"
                            type="daterange"
                            placeholder="选择制单日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="filter-form__item" label="交货日期">
                    <el-date-picker
                            @change="deliveryDateChange"
                            v-model="deliveryDateRange"
                            type="daterange"
                            placeholder="选择交货日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="filter-form__item" label="单据号">
                    <el-select
                            v-model="filterFormData.facPrdOrderIdList"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.facPrdOrderIdList" :key="item.facPrdOrderId" :label="item.orderNo"
                                   :value="item.facPrdOrderId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="filter-form__item" label="下单类型">
                    <el-select
                            v-model="filterFormData.placeOrderTypeList"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.placeOrderTypeList" :key="item.attrId" :label="item.attrVal"
                                   :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-row>
            <el-row
                    class="filter-form__row"
                    justify="space-between">
                <el-form-item class="filter-form__item el-select" label="采购单号">
                    <el-input placeholder="搜索采购单号" v-model="filterFormData.buyNo"></el-input>
                </el-form-item>

                <!--<el-form-item label="商品属性" class="filter-form__item">-->
                    <!--<goods-attr-dialog class="goods-attr" @confirm="getAllAttrId" modelName="FAC_PRD_ORDER" :isShowdevelop="true" :isReset="isReset"></goods-attr-dialog>-->
                <!--</el-form-item>-->
            </el-row>
            <el-row
                class="filter-form__row">
                <el-form-item  class="filter-form__item status-list" label="订单状态">
                    <filter-check-group multiple v-model="filterFormData.statusList">
                        <filter-check-item
                            :isCheckAll='true'
                            :options="options.orderStatusList"
                            value="all"
                            label="全部">
                        </filter-check-item>
                        <filter-check-item
                            v-for="item in options.orderStatusList"
                            :options="options.orderStatusList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
                <el-form-item  class="filter-form__item" label="预下单/订单">
                    <filter-check-group multiple v-model="filterFormData.typeList">
                        <filter-check-item
                            v-for="item in options.typeList"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
                <!-- 已转工单 -->
                <el-form-item  class="filter-form__item " label="已转/未转工单"  label-width="108px" >
                    <filter-check-group multiple v-model="filterFormData.transferFlagList">
                        <filter-check-item
                            v-for="item in options.orderStatuses"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
                <!-- 是否首单 -->
                <el-form-item  class="filter-form__item " label="是否首单" label-width="100px">
                    <filter-check-group multiple v-model="filterFormData.firstSingleList">
                        <filter-check-item
                            v-for="item in options.firstSingle"
                            :key="item.id"
                            :value="item.id"
                            :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
                <!-- <el-form-item class="filter-form__item" label="订单状态">
                    <el-select
                            v-model="filterFormData.statusList"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.orderStatusList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item class="filter-form__item" label="单据类型">
                    <el-select
                            v-model="filterFormData.typeList"
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.typeList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
            </el-row>
        </el-form>
        <div class="btn-group">
            <el-button class="btn btn-reset" @click="reset">重置</el-button>
            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
        </div>
    </base-box>
</template>

<script>
    import FilterCheckGroup from '../../order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '../../order/WorkOrders/filter-check-item.vue';
    import {
        selectFacGoodsStyleList
        , selectFacCustomer
        , getAllNodeList
        , getUnitUser
        , facPrdOrderList
        , outsideFactoryListForSelect
        , placeOrderTypeList
        , queryGoodsStyleByPlantArticleNumber
        , billReviewConfig,
        getSelfWorkList,
        getWorkbayList
    } from '@/api';
    export default {
        props: {
            attrsData: Object,
            selectPersonList: []
        },
        components: {
            FilterCheckGroup,
            FilterCheckItem
        },
        data() {
            return {
                richFilterParams:{},
                isCollapse: true,
                // isReset:false,
                orderDateRange: '',
                deliveryDateRange: '',
                endDateRange: '',
                filterFormData: {
                    outsideFactoryIdList: [],
                    // goodsUnitIdList: [],
                    commonCustomerIdList: [],
                    facPrdOrderIdList: [],
                    placeOrderTypeList: [],
                    typeList: [0,1,2],
                    // styleIdList: [],
                    // statusList: [1,2,3,4,5],
                    statusList: [2,4],
                    placeorderStartAt: '',
                    placeorderEndAt: '',
                    deliveryStartAt: '',
                    deliveryEndAt: '',
                    buyNo: '',
                    createByIdsList:[],//创建人列表
                    firstSingleList:[0,1],//是否首单列表
                    transferFlagList:[0,1],//是否已转工单列表
                    // attrIds:[],
                },
                options: {
                    placeOrderTypeList: [],
                    outsideFactoryList: [],
                    goodsList: [],
                    customerList: [],
                    facPrdOrderIdList: [],
                    // styleIdList: [],
                    orderStatusList: [
                        // {id:1,name:'草稿'},
                        // {id:2,name:'待审核'},
                        {id:2,name:'已通过'},
                        // {id:4,name:'待批准'},
                        {id:4,name:'已驳回'},
                        {id:5,name:'已作废'},
                    ],
                    typeList: [
                        {id:1,name:'正式订单'},
                        {id:0,name:'预下单'},
                        {id:2,name:'订单调整单'}
                    ],
                    createLists:[],//创建人列表
                    orderStatuses:[
                        {id:1,name:'已转工单'},
                        {id:0,name:'未转工单'}
                    ],//已转 1 、未转工单 0 列表
                    firstSingle:[
                        {id:0,name:'非首单'},
                        {id:1,name:'首单'}
                    ],  //0非首单，1首单
                }
            }
        },
        created() {
            this.getBillReviewConfig();
            this.getPlaceOrderTypeList();
            // this.getQueryGoodsStyle();
            // this.fetchGoodList();
            this.fetchCustomerList();
            this.getFacPrdOrderList();
            this.getCreateLists();
        },
        watch: {},
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            userInfo() {
                return JSON.parse(sessionStorage.getItem('user_info'));
            },
        },
        methods: {
            //获取是否配置审核台
            getBillReviewConfig(){
                billReviewConfig({unitId:this.facId}).then(res=>{
                    console.log(res);
                    if(res.data.data.billTypes && res.data.data.billTypes.length>0){
                        //有审核台
                        this.options.orderStatusList =[
                            // {id:'all',name:'全部'},
                            {id:0,name:'草稿'},
                            {id:1,name:'待审核'},
                            {id:2,name:'已通过'},
                            {id:3,name:'反审待批准'},
                            {id:4,name:'已驳回'},
                            {id:5,name:'已作废'},
                            {id:6,name:'不可反审'},
                            // {id:7,name:'已结束'},
                        ];
                        this.filterFormData.statusList = [0,1,2,3,4,6]
                    }
                    this.$emit('on-filter', {...this.richFilterParams,...this.filterFormData});
                })
            },
            submit() {
                this.$emit('on-filter', {...this.richFilterParams,...this.filterFormData});
            },
            getFilterParams() {
                return this.filterFormData;
            },
            reset() {
                this.richFilterParams = {}
                // this.isReset = true;
                Object.keys(this.filterFormData).forEach(key => {
                    const isArr = Array.isArray(this.filterFormData[key]);
                    if (isArr) {
                        this.filterFormData[key] = [];
                    }
                    else {
                        this.filterFormData[key] = '';
                    }
                });
                this.orderDateRange = '';
                this.deliveryDateRange = '';
                this.endDateRange = '';
                this.filterFormData.typeList= [0,1,2];
                this.filterFormData.firstSingleList= [0,1];
                this.filterFormData.transferFlagList= [0,1];
                this.getBillReviewConfig();
            },
            // 获取生产订单号
            getFacPrdOrderList(){
                let params = {
                    unitId: this.facId,
                    userId: this.userId,
                    modelName: 'FAC_PRD_ORDER',
                };
                facPrdOrderList(params).then(res =>{
                    console.log(res.data.facPrdOrderList);
                    this.options.facPrdOrderIdList = res.data.facPrdOrderList
                })
            },
            // 获取客户列表
            fetchCustomerList() {
                selectFacCustomer({
                    facId: this.facId,
                    pageNo: 1,
                    sortType: 0,
                    needAll:true
                }).then(res => {
                    this.options.customerList = res.data.goods;
                });
            },
            // 选取制单日期
            orderDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.placeorderStartAt = start;
                this.filterFormData.placeorderEndAt = end;
            },
            // 选取交货日期
            deliveryDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.deliveryStartAt = start;
                this.filterFormData.deliveryEndAt = end;
            },
            // 选取结束日期
            nodeEndDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.nodeEndStartAt = start;
                this.filterFormData.nodeEndEndAt = end;
            },
            filterDate(val) {
                return val.split(/\s-\s/g);
            },
            // 获取商品属性选中的选项
            // getAllAttrId(val, categorys,developerIds) {
            //     this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            //     this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            //     this.filterFormData.developerIds = developerIds&&developerIds.length > 0 ? developerIds : undefined;
            // },
            //获取下单类型
            getPlaceOrderTypeList(){
                let params = {
                    unitId: this.facId,
                    keyword: ''
                }
                placeOrderTypeList(params).then(res=>{
                    console.log(res, '下单类型')
                    if (res.data.code === 0) {
                        this.options.placeOrderTypeList = res.data.commonGoodsAttrs
                    }
                })
            },
            //货号
            // getQueryGoodsStyle(){
            //     let params = {
            //         unitId: this.facId,
            //         keyword: ''
            //     }
            //     queryGoodsStyleByPlantArticleNumber(params).then(res=>{
            //         console.log(res, '货号')
            //         if (res.data.code === 0) {
            //             this.options.styleIdList = res.data.data
            //         }
            //     })
            // },
            // 获取创建人列表
            getCreateLists(val){
                var params = {
                    "userId": this.userId,
                    "unitId":this.facId,
                    "keyword": val?val:'',
                    'pageNum': 1,
                    'pageSize':20,
                    'groupsFilter': []
                }
                getSelfWorkList(params).then(res => {
                    // if (res.data.code == 0) {
                        this.options.createLists = res.data.data.workBayList;
                        this.options.createLists.unshift(this.userInfo);
                        // if(
                        //     JSON.stringify(this.options.createLists).indexOf(this.userInfo.id)== -1
                        // ){
                        //     // console.log("不存在的：");
                        //     this.options.createLists.push({
                        //         id:this.userInfo.id,
                        //         user_name:this.userInfo.name
                        //     });
                        // }
                    // } else {
                    //     this.$message({
                    //         showClose: true,
                    //         message: res.data.msg,
                    //         type: "error",
                    //     });
                    // }
                });
            },
        }
    }
</script>
<style lang="scss">
// 订单状态新的样式
.status-list{
    width: 50% !important;
    // height: 80px;
    .el-form-item__content{
        // width: 72% !important;
    }
}

.order-list{
    width: 20% !important ;
}
.goods-attr{
    .el-form-item{
        margin-bottom: 10px;
        display: block;
        margin-right: 0px;
    }
}
</style>

<style lang="scss" scoped>

    .wrapper {
        position: relative;
        padding: 16px 24px 6px;

    }
    .noMargin{
        margin-bottom:0px !important;
        display: flex;
        align-items:center;
    }
    .filter-form {
        &__item {
            margin-bottom: 10px;
            margin-right: 0;
           /* margin-left: -30px;*/
            width: 24.6%;
            .el-select{
                width:100% !important;
            }
            .attrs-select {
                display: inline-block;
                box-sizing: border-box;
                max-width: 245px;
                width:217px;
                padding: 3px 35px 3px 10px;
                line-height: 30px;
                height: 36px;
                border-radius: 2px;
                color: #bec9d8;
                cursor: pointer;
                border: 1px solid rgb(191, 200, 217);
                transition: border-color .3s;
                &:hover {
                    border-color: rgb(131, 140, 165);
                }
                &__icon {
                    display: inline-block;
                    width: 35px;
                    height: 36px;
                    line-height: 38px;
                    box-sizing: border-box;
                    text-align: center;
                    position: absolute;
                    right: 0;
                    top: 0;
                    font-size: 12px;
                    transition: transform .3s;
                }
            }
        }
        &__checker {
            max-width: 245px;
            width:217px;
        }
        &__row {
            overflow: hidden;
        }
        .border-top-1px {
            padding-top: 10px;
            border-top: 1px solid #E6EAF0;
        }
    }

    .btn-group {
        position: absolute;
        right: 24px;
        bottom: 16px;
        display: flex;
        justify-content: flex-end;
        width: 245px;
        button {
            color: #808080;
            font-size: 14px;
        }
        .icon {
            font-size: 12px;
            margin-left: 3px;
        }
        .btn {
            width: 72px;
            height: 36px;
            box-sizing: border-box;
            border-width: 1px;
            border-style: solid;
            border-radius: 2px;
            margin-left: 12px;
            &:hover {
                opacity: .7;
            }
        }
        .btn-reset {
            border-color: #DCE0E6;
            background: #ffffff;
        }
        .btn-submit {
            border-color: #54D1BC;
            background: #54D1BC;
            color: #fff;
        }
    }

    .popover-content {
        font-size: 14px;
        overflow: hidden;
        -webkit-user-select: none;
        &__row {
            margin-bottom: 4px;
        }
        &__btn {
            display: inline-block;
            margin-left: 16px;
            margin-right: 16px;
            color: #808080;
            cursor: pointer;
            &.is-active {
                color: #FFA914;
            }
        }
        &__title {
            display: inline-block;
            width: 80px;
            margin-left: -20px;
            text-align: right;
        }
        &--left {
            line-height: 28px;
        }
        &--right {
            flex: 1;
        }
        &__check-item {
            margin-bottom: 8px;
        }
    }
</style>
<style lang="scss">
.wrapper{
    .el-date-editor--daterange.el-input{
        width:100%;
    }
}
/*@media screen and (max-width: 1562px) {*/
    /*.width{*/
        /*.el-form-item__content{*/
            /*margin-left:30px;*/
        /*}*/
    /*}*/

/*}*/
</style>

