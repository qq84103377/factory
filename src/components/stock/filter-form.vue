<template>

    <div class="masterial-filter">
        <!--<div class="tab">-->
        <!--<div class="tab__select">-->
        <!--<div v-for="(item,index) in options" :key="index"-->
        <!--@click="changeTab(index)"-->
        <!--:class="['tab__default-style',tabIndex==index?'tab__gray-style':'']">{{item.name}}-->
        <!--</div>-->
        <!--&lt;!&ndash;<div @click="" :class="['tab__default-style',dataType===0?'tab__gray-style':'']">按供应商查看</div>&ndash;&gt;-->
        <!--</div>-->
        <!--</div>-->

        <div class="custom-filter-form box-shadow">
            <el-form style="margin-left: -38px" :model="form" status-icon ref="ruleForm2" label-width="100px"
                     class="demo-ruleForm">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="单据号">
                            <stockNoSelect :selectType="isSelect?'send':'stock'" :storehouseId="storehouseId" v-model="form.billIds"></stockNoSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="开单人">
                            <workerLeader v-model="form.operaterIds" :single="'single'"
                                          :placeholder="'请选择或搜索开单人'"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="开单日期">
                            <el-date-picker
                                    v-model="form.orderDate"
                                    type="datetimerange"
                                    placeholder="选择日期范围"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品档案">
                            <rich-filter style="margin-bottom: 1px" v-model="richFilterParams"
                                         dialogType='STYLE'
                                         placeholder="点击可筛选商品"
                                         modelName="GOODS_STOCK"></rich-filter>
                            <!--<goods-select v-model="form.styleIds" :multiple="false"></goods-select>-->
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="工单号">
                            <el-select v-model="form.facMissionIds" placeholder="请选择或搜索" clearable filterable >
                                <el-option
                                        v-for="item in missionList"
                                        :key="item.id"
                                        :label="item.orderNo"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="客户">
                            <client-select v-model="form.customerIds"></client-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="供应商">
                            <outsideSupplierSelect ref="supplier" :canAdd = 'false' :parentSupplier="supplier" @getSupplierId="getSupplierId">
                            </outsideSupplierSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="备注">
                            <el-select
                                    v-model="form.remarksList"
                                    filterable
                                    remote
                                    clearable
                                    reserve-keyword
                                    placeholder="请输入关键词"
                                    :remote-method="remoteMethod"
                                    :loading="loading">
                                <el-option
                                        v-for="item in remarkList"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="是否调拨">
                            <div>
                                <filter-check-group multiple v-model="form.allotList">
                                    <filter-check-item
                                            v-for="item in options3"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label"></filter-check-item>
                                </filter-check-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="单据类型">
                            <div>
                                <filter-check-group @change="handleChange" multiple v-model="form.operateTypes">
                                    <filter-check-item
                                            v-for="item in options"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label"></filter-check-item>
                                </filter-check-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="审核状态">
                            <div>
                                <filter-check-group multiple v-model="form.reviewStatuslist">
                                    <filter-check-item
                                            v-for="item in options2"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label"></filter-check-item>
                                </filter-check-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <div class="btn-group">
                            <el-button :loading="isSubmitting" class="btn btn-reset" @click="exportExcel">导出</el-button>
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
                <!--<el-row type="flex" justify="space-between">-->
                <!--<div style="display: flex;flex: 0 0 28%">-->
                <!--<el-form-item class="filter-item" label="单据类型">-->
                <!--<div>-->
                <!--<filter-check-group multiple v-model="form.operateTypes">-->
                <!--<filter-check-item-->
                <!--v-for="item in options"-->
                <!--:key="item.value"-->
                <!--:value="item.value"-->
                <!--:label="item.label"></filter-check-item>-->
                <!--</filter-check-group>-->
                <!--</div>-->
                <!--</el-form-item>-->
                <!--</div>-->
                <!--<div style="display: flex;flex: 0 0 72%;justify-content: space-between;">-->
                <!--<el-form-item label-width="60px" class="filter-item" label="审核状态">-->
                <!--<div>-->
                <!--<filter-check-group multiple v-model="form.reviewStatuslist">-->
                <!--<filter-check-item-->
                <!--v-for="item in options2"-->
                <!--:key="item.value"-->
                <!--:value="item.value"-->
                <!--:label="item.label"></filter-check-item>-->
                <!--</filter-check-group>-->
                <!--</div>-->
                <!--</el-form-item>-->
                <!--<div class="btn-group">-->
                <!--<el-button :loading="isSubmitting" class="btn btn-reset" @click="exportExcel">导出</el-button>-->
                <!--<el-button class="btn btn-reset" @click="reset">重置</el-button>-->
                <!--<el-button class="btn btn-submit" @click="submit">筛选</el-button>-->
                <!--</div>-->
                <!--</div>-->
                <!--</el-row>-->
            </el-form>
        </div>
    </div>
</template>
<script>
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    import {selectFacCustomer,getFacMissionNos,selectRemarks} from '@/api'
    import Utils from '@/utils/format'
    import clientSelect from '@/components/Common/custom-select/clientSelect.vue'
    import stockNoSelect from '@/components/Common/custom-select/stockNoSelect.vue'
    import outsideSupplierSelect from '@/components/Common/custom-select/outside-supplier-select';
    // import supplierSelect from '@/components/Common/custom-select/supplier-select';
    // import { getDesignStyleList } from '@/api/sample-centre';
    // import DesignStyleNoSelect from "../../../Common/custom-select/designStyleNoSelect";
    import {exportExcelBillList} from '@/api'
    export default {
        components: {
            // DesignStyleNoSelect,
            FilterCheckGroup,
            FilterCheckItem,
            clientSelect,
            outsideSupplierSelect,
            stockNoSelect,
            // supplierSelect
        },
        data() {
            return {
                supplier: [],
                customerList: [],
                remarkList:[],
                /**
                 *  storehouseId: this.storehouseId,
                 billIds: [],
                 operaterIds: [],
                 operateDateStart: '',
                 operateDateEnd: '',
                 styleIds: [],
                 facMissionIds: [],
                 customerIds: [],
                 operateTypes: [] 入库单-STOCK_IN，出库单-STOCK_OUT，损益单-STOCK_ADJUST'  发货 STOCK_DELIVERY
                 */
                richFilterParams:{},
                form: {
                    commonOutsideFactoryIds: '',
                    reviewStatuslist: [],
                    billIds: '',
                    operaterIds: '',
                    operateDateStart: '',
                    operateDateEnd: '',
                    // styleIds: this.$route.query.styleId || '',
                    facMissionIds: '',
                    customerIds: '',
                    operateTypes: [],
                    remarksList:'',
                    allotList:[true,false],
                    orderDate: [new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59))]
                },
                options: [{label: '入库单', value: 'STOCK_IN'}, {label: '出库单', value: 'STOCK_OUT'}, {label: '工厂发货单', value: 'STOCK_DELIVERY'} ,{label: '调整单', value: 'STOCK_ADJUST'},{label: '退货入库单', value: 'STOCK_SALE_RETURN'},{label: '档口发货单', value: 'centralBillDelivery'}],
                options2: [
                    {label: '草稿', value: 0},
                    {label: '待审核', value: 1},
                    {label: '已通过', value: 2},
                    {label: '已驳回', value: 3},
                    {label: '反审待审批', value: 4},
                ],
                options3: [
                    {label: '是', value: true},
                    {label: '否', value: false},
                ],
                missionList: [],
                goodStyleList: [],
                materialsList: [],
                purchaserList: [],
                orderNoList: [],
                materialNoList: [],
                designStyleList: [], //设计款号列表
                isSubmitting:false,
                loading:false,
            }
        },
        watch: {
            // form: {
            //     handler(val, old) {
            //         this.$emit('formData', this.form);
            //     },
            //     deep: true
            // },
            storehouseId() {
                this.getFacMissionNos()
            },
        },
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
            storehouseId() {
                return this.$route.query.storehouseId
            },
            isSelect() {
               return this.form.operateTypes.length === 1 && this.form.operateTypes[0] === 'centralBillDelivery'
            }
        },
        activated() {
            if(this.$route.query.styleId) {
                this.reset()
            }
            // this.form.styleIds = this.$route.query.styleId || ''
            this.getFacMissionNos();
            this.fetchCustomerList();
            // this.submit()
        },
        methods: {
            handleChange(arr) {
                let index = arr.findIndex(v => v === 'centralBillDelivery')

                if(index>-1) {
                    if(index === arr.length-1) {
                        this.form.operateTypes = ['centralBillDelivery']
                    }else {
                        this.form.operateTypes.splice(index,1)
                    }
                }
            },
            getSupplierId(item) {
                this.form.commonOutsideFactoryIds = item.id
            },
            // changeTab(index) {
            //   this.tabIndex=index;
            //   this.form.operateTypes=[this.options[index].value];
            //   this.submit()
            // },
            // 获取客户列表
            fetchCustomerList() {
                selectFacCustomer({
                    facId: this.facId,
                    pageNo: 1,
                    sortType: 0,
                    needAll: true
                }).then(res => {
                    this.customerList = res.data.goods || [];
                });
            },
            materialSelectSearch(val) {
                this.form.materialsNo = val
            },
            //获取工单号下拉列表
            getFacMissionNos() {
                getFacMissionNos({storehouseId:this.storehouseId}).then(res=> {
                    this.missionList = res.data.data || [];
                })
            },
            // 导出
            exportExcel(){
                let params = {
                    ...this.richFilterParams,
                    ...this.form,
                    billIds: this.form.billIds ? [this.form.billIds] : [],
                    commonOutsideFactoryIds: this.form.commonOutsideFactoryIds ? [this.form.commonOutsideFactoryIds] : [],
                    operaterIds: this.form.operaterIds ? [this.form.operaterIds] : [],
                    customerIds: this.form.customerIds ? [this.form.customerIds] : [],
                    facMissionIds: this.form.facMissionIds ? [this.form.facMissionIds] : [],
                    // styleIds: this.form.styleIds ? [this.form.styleIds] : [],
                    operateDateStart: this.form.orderDate&&this.form.orderDate[0] ? Utils.formatDate(this.form.orderDate[0], 'yyyy-MM-dd hh:mm:ss') : '',
                    operateDateEnd: this.form.orderDate&&this.form.orderDate[1] ? Utils.formatDate(this.form.orderDate[1], 'yyyy-MM-dd hh:mm:ss') : '',
                    storehouseId: this.storehouseId,
                    pageNo: 1,
                    pageSize: 99999
                }
                this.isSubmitting = true
                exportExcelBillList(params).then(res => {
                    this.isSubmitting = false
                    console.log(res);
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','库存单据'+this.currentTime()+'.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            // 获取当前时间
            currentTime() {
                let now = new Date()
                let year = now.getFullYear()
                let month = now.getMonth() + 1
                let day = now.getDate()

                let hh = now.getHours()
                let mm = now.getMinutes()
                let ss = now.getSeconds()

                var clock = year

                if (month < 10)
                    clock += '0'

                clock += month

                if (day < 10)
                    clock += '0'

                clock += day

                if (hh < 10)
                    clock += '0'

                clock += hh
                if (mm < 10) clock += '0'
                clock += mm

                if (ss < 10) clock += '0'
                clock += ss
                return clock
            },
            // 重置
            reset() {
                this.richFilterParams = {}
                this.form.commonOutsideFactoryIds = '';
                this.form.reviewStatuslist = [];
                this.form.billIds = '';
                this.form.operaterIds = '';
                this.form.orderDate = [new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59))];
                // this.form.styleNo = '';
                // this.form.styleIds = '';
                this.form.facMissionIds = '';
                // this.form.materialsNo = '';
                // this.form.nodeStatus = [];
                this.form.customerIds = '';
                this.form.operateTypes = [];
                this.form.allotList = [];
                this.form.remarksList ='',
                    this.$refs['supplier'].reset()
                this.submit()
            },
            // 搜索
            submit() {
                let form = {
                    ...this.richFilterParams,
                    ...this.form,
                    billIds: this.form.billIds ? [this.form.billIds] : [],
                    commonOutsideFactoryIds: this.form.commonOutsideFactoryIds ? [this.form.commonOutsideFactoryIds] : [],
                    operaterIds: this.form.operaterIds ? [this.form.operaterIds] : [],
                    customerIds: this.form.customerIds ? [this.form.customerIds] : [],
                    facMissionIds: this.form.facMissionIds ? [this.form.facMissionIds] : [],
                    // styleIds: this.form.styleIds ? [this.form.styleIds] : [],
                    operateDateStart: this.form.orderDate&&this.form.orderDate[0] ? Utils.formatDate(this.form.orderDate[0], 'yyyy-MM-dd hh:mm:ss') : '',
                    operateDateEnd: this.form.orderDate&&this.form.orderDate[1] ? Utils.formatDate(this.form.orderDate[1], 'yyyy-MM-dd hh:mm:ss') : '',
                    storehouseId: this.storehouseId,
                    // storehouseId: '7a1b206876d64ca39b7f0bd230a08304',
                    remarkList:this.form.remarksList?[this.form.remarksList]:[],//备注
                    operateTypes: this.isSelect ? [] : this.form.operateTypes,
                    centralBillDelivery: this.isSelect
                }
                this.$emit('submit', form)
            },
            // 人员id选择
            getManId(arrId) {
                this.form.operaterIds = arrId
            },
            // 获取设计款号
            fetchGoodList(key) {
                // getDesignStyleList({
                //     unitId: this.facId,
                //     key: key
                // }).then(res => {
                //     this.designStyleList = res.data.data;
                // });
            },
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let params = {
                            'storehouseId':this.storehouseId,
                            'keyWord':query,
                        };
                        selectRemarks(params).then(res => {
                            this.remarkList = res.data.data ;
                        });
                    }, 200);
                } else {
                    this.remarkList = [];
                }
            }
        },
        created() {
            this.getFacMissionNos();
            this.fetchCustomerList();
            this.submit()
        }
    }
</script>
<style lang="scss" scoped>
    .masterial-filter {
        .need-filter {
            background-color: #fff;
            width: 100%;
            padding: 12px 16px 4px;
            box-sizing: border-box;
            box-shadow: 0 30px 20px -24px rgba(13, 51, 128, 0.1), 0 3px 10px -3px rgba(13, 51, 128, 0.1);
        }
        .tab {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            &__select {
                display: flex;
                justify-content: flex-start;
                margin: 16px 0;
                cursor: pointer;
                font-size: 12px;
                .tab__default-style {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /*width: 80px;*/
                    height: 32px;
                    padding: 0 10px;
                    background-color: #fff;
                    border: 1px solid #939FB8;
                    box-sizing: border-box;
                    color: #939FB8;
                    &:not(:first-child) {
                        border-left: none;
                    }
                }
                .tab__gray-style {
                    background-color: #939FB8;
                    color: #fff;
                }
            }
        }
    }

</style>
<style lang="scss">
</style>

