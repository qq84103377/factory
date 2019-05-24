<template>
    <slide-filter
            width="calc(100% - 300px)"
            placeholder="按条件筛选"
            @cancel="cancel"
            @reset="reset"
            @filter="filter">
        <el-form
                :inline="true"
                label-width="90px"
                style="margin-left: -38px;">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="商品档案">
                        <rich-filter v-model="richFilterParams"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"
                                     modelName="FAC_PRD_ORDER"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="加工厂商">
                        <machining-select multiple v-model="form.outsideFactoryIdList"></machining-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="客户">
                        <customer type="filter"  v-model="form.commonCustomerIdList"></customer>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="创建人">
                        <el-select multiple clearable :filter-method="getCreateLists" filterable
                                   v-model="form.createByIdsList" placeholder="请选择">
                            <el-option
                                    v-for="item in options.createLists"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="负责人">
                        <workerLeader v-model="form.chargerIds"  placeholder="请选择"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="制单日期">
                        <el-date-picker
                                @change="orderDateChange"
                                v-model="form.orderDateRange"
                                type="daterange"
                                placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="交货日期">
                        <el-date-picker
                                @change="deliveryDateChange"
                                v-model="form.deliveryDateRange"
                                type="daterange"
                                placeholder="选择交货日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="单据号">
                        <el-select
                                v-model="form.facPrdOrderIdList"
                                filterable
                                multiple
                                clearable
                                :remote="true"
                                :remote-method="billNoRemoteMethod"
                                placeholder="全部">
                            <el-option v-for="item in options.billNos" :key="item.value" :label="item.name"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="下单类型">
                        <el-select
                                v-model="form.placeOrderTypeList"
                                filterable
                                multiple
                                clearable
                                placeholder="全部">
                            <el-option v-for="item in options.placeOrderTypeList" :key="item.attrId" :label="item.attrVal"
                                       :value="item.attrId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="采购单号">
                        <el-input placeholder="搜索采购单号" v-model="form.buyNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="attachmentConfigList.some(v => v.selected)" style="padding: 10px 28px;border-top: 1px solid #e6eaf0;">转工单必填筛选</div>
            <el-row style="padding-left: 10px;">
                <el-col :span="6" v-for="(item,index) in attachmentConfigList" :key="index">
                    <el-form-item style="white-space: nowrap" :label="item.name">
                        <el-select
                                v-if="item.id!=6"
                            v-model="form['attachment' + item.id]"
                            multiple
                            placeholder="全部">
                            <el-option v-for="item in options.attachementOption" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select
                                v-else
                            v-model="form['attachments']"
                            multiple
                            placeholder="全部">
                            <el-option v-for="item in options.attachementOption" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="orderConfigList.length&&type=='orderList'" style="padding: 10px 28px;border-top: 1px solid #e6eaf0;">订单提报必填筛选</div>
            <el-row style="padding-left: 10px;" v-if="type=='orderList'">
                <el-col :span="6" v-for="(item,index) in orderConfigList" :key="index">
                    <el-form-item style="white-space: nowrap" :label="item.name">
                        <el-select
                            v-model="form.configs[index].checkValue"
                            multiple
                            placeholder="全部">
                            <el-option v-for="item in options.attachementOption" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row v-if="type=='orderList'" style="border-top: 1px solid #e6eaf0;">
                <el-col :span="6">
                    <el-form-item label="订单状态">
                        <filter-check-group multiple v-model="form.statusList">
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
                </el-col>
                <el-col :span="6">
                    <el-form-item label="单据类型">
                            <filter-check-group multiple v-model="form.typeList">
                                <filter-check-item
                                        v-for="item in options.typeList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.name">
                                </filter-check-item>
                            </filter-check-group>
                    </el-form-item>
                </el-col><el-col :span="6">
                <el-form-item style="padding-left: 24px;" label="已转/未转工单">
                    <filter-check-group multiple v-model="form.transferFlagList">
                        <filter-check-item
                                v-for="item in options.orderStatuses"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
            </el-col>
                <el-col :span="6">
                    <el-form-item label="是否首单">
                        <filter-check-group multiple v-model="form.firstSingleList">
                            <filter-check-item
                                    v-for="item in options.firstSingle"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.name">
                            </filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </slide-filter>
</template>
<script>
    import {selectFacCustomer,getSelfWorkList,placeOrderTypeList,getAttachmentFieldConfig,orderReportGetConfig,facPrdOrderList,commonFilterRemoteSearchForReview} from '@/api'
    import FilterCheckGroup from '../../order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '../../order/WorkOrders/filter-check-item.vue';
    export default {
        components: {
            FilterCheckGroup,
            FilterCheckItem
        },
        props: ['type'],  // type 区分审核台和订单列表
        data() {
            return {
                form: {
                    facPrdOrderIdList: [],
                    buyNo: "",
                    commonCustomerIdList: [],
                    createByIdsList: [],
                    dateEnd: "",
                    dateStart: "",
                    deliveryStartAt: '',
                    deliveryEndAt: '',
                    deliveryDateRange: "",
                    ids: [],
                    orderDateRange: "",
                    outsideFactoryIdList: [],
                    placeOrderTypeList: [],
                    statusList: [],
                    typeList: [],
                    transferFlagList: [],
                    firstSingleList: [],
                    chargerIds:[] //负责人

                },
                options: {
                    customerList: [],
                    createLists: [],
                    billNos: [],
                    placeOrderTypeList: [],
                    attachementOption: [
                        {label:'全部',value: ''},
                        {label:'已填齐',value: 'check'},
                        {label:'未填齐',value: 'uncheck'},
                    ],
                    orderStatusList: [
                        {id:0,name:'草稿'},
                        {id:1,name:'待审核'},
                        {id:2,name:'已通过'},
                        {id:3,name:'反审待批准'},
                        {id:4,name:'已驳回'},
                        {id:6,name:'不可反审'},
                        {id:5,name:'已作废'},
                    ],
                    typeList: [
                        {id:1,name:'正式订单'},
                        {id:0,name:'预下单'},
                        {id:2,name:'订单调整单'}
                    ],
                    orderStatuses:[
                        {id:1,name:'已转工单'},
                        {id:0,name:'未转工单'}
                    ],
                    firstSingle:[
                        {id:0,name:'非首单'},
                        {id:1,name:'首单'}
                    ],
                },
                missionList: [],
                materialsList: [],
                purchaserList: [],
                materialNoList: [],
                backupForm: {
                    billNos: [],
                    buyNo: "",
                    commonCustomerIdList: [],
                    createByIdsList: [],
                    dateEnd: "",
                    dateStart: "",
                    deliveryStartAt: '',
                    deliveryEndAt: '',
                    deliveryDateRange: "",
                    ids: [],
                    orderDateRange: "",
                    outsideFactoryIdList: [],
                    placeOrderTypeList: [],
                    statusList: [],
                    typeList: [],
                    transferFlagList: [],
                    firstSingleList: [],
                },
                richFilterParams: {},
                attachmentConfigList: [],  // 配置转工单必填列表
                orderConfigList: [],  // 配置订单提报必填列表
            }
        },
        watch: {},
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            user_info(){
                return JSON.parse(sessionStorage.getItem('user_info'));
            }
        },
        methods: {
            // 获取配置订单提报必填列表
            orderReportGetConfig() {
                orderReportGetConfig({unitId:this.unitId}).then(res => {
                    this.orderConfigList = res.data.data.filter(v => v.required && (v.kind==1||v.parentId))
                    this.form.configs = []
                    this.backupForm.configs = []
                    this.orderConfigList.forEach(v => {
                        this.form.configs.push({facPrdOrderTargetFieldId:v.id,checkValue:[]})
                        this.backupForm.configs.push({facPrdOrderTargetFieldId:v.id,checkValue:[]})
                    })
                })
            },
            // 获取配置转工单必填列表
            getAttachmentFieldConfig() {
                getAttachmentFieldConfig({unitId:this.unitId}).then(res => {
                    this.attachmentConfigList = res.data.data.filter(v => v.selected)
                    this.attachmentConfigList.forEach(v => {
                        this.$set(this.form,`${'attachment'+ (v.id==6?'s':v.id)}`,[])
                        this.$set(this.backupForm,`${'attachment'+ (v.id==6?'s':v.id)}`,[])
                    })
                })
            },
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
                    if (res.data.code == 0) {
                        if ( res.data){
                            this.options.createLists = res.data.data.workBayList;
                            this.options.createLists.unshift(this.user_info);
                        }
                    }

                });
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
            // 选取交货日期
            deliveryDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.form.deliveryStartAt = start;
                this.form.deliveryEndAt = end;
            },
            // 选取创建日期
            orderDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.form.dateStart = start;
                this.form.dateEnd = end;
            },
            filterDate(val) {
                return val.split(/\s-\s/g);
            },
            cancel() {
                this.form = JSON.parse(JSON.stringify(this.backupForm))
            },
            reset() {
                Object.keys(this.form).forEach(key => {
                    const isArr = Array.isArray(this.form[key]);
                    if (isArr) {
                        this.form[key] = [];
                    }
                    else {
                        this.form[key] = '';
                    }
                });
                // this.form.ids = []
                // this.form.billNos = []
                // this.form.buyNo = ""
                // this.form.commonCustomerIdList = []
                // this.form.createByIdsList = []
                // this.form.dateEnd = ""
                // this.form.dateStart = ""
                // this.form.deliveryStartAt = ""
                // this.form.deliveryEndAt = ""
                // this.form.deliveryDateRange = ""
                // this.form.ids = []
                // this.form.orderDateRange = ""
                // this.form.outsideFactoryIdList = []
                // this.form.placeOrderTypeList = []
                // this.form.statusList = []
                // this.form.typeList = []
                // this.form.transferFlagList = []
                // this.form.firstSingleList = []
                this.$emit('submit', JSON.parse(JSON.stringify(this.form)));
            },
            filter() {
                this.form.ids = this.richFilterParams.ids || []
                this.$emit('submit', JSON.parse(JSON.stringify(this.form)));
                this.backupForm = JSON.parse(JSON.stringify(this.form))
            },

            //单据号远程搜索
            billNoRemoteMethod(value){
                    let params = {
                        unitId:this.unitId,
                        key:value,
                        modelName:'FAC_PRD_ORDER',
                        userId:this.userId,
                        billType:'FAC_PRD_ORDER'
                    }
                    commonFilterRemoteSearchForReview(params).then(res =>{
                        this.options.billNos = res.data.data
                    })
            },

        },
        created() {
            if(this.type=='orderList') {
                this.form = {
                    ...this.form,
                    statusList: [0,1,2,3,4,6],
                    typeList: [0,1,2],
                    transferFlagList: [0,1],
                    firstSingleList: [0,1],
                    configs: []
                }
                this.backupForm = JSON.parse(JSON.stringify(this.form))
                this.orderReportGetConfig()
            }
            this.fetchCustomerList()
            this.getCreateLists()
            this.getPlaceOrderTypeList()
            this.getAttachmentFieldConfig()
            this.billNoRemoteMethod('')
        },
        activated() {
            if(this.type=='orderList') {
                this.orderReportGetConfig()
            }
            this.getAttachmentFieldConfig()
        }
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
</style>

