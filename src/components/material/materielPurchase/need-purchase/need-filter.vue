<template>
    <slide-filter
            v-model="form"
            placeholder="按条件筛选"
            @cancel="cancel"
            @reset="reset"
            @filter="filter">
        <el-form
                :inline="true"
                label-width="90px"
                style="margin-left: -30px;">
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="生产单号">
                        <el-select v-model="form.orderNoIdList" placeholder="请选择" clearable multiple filterable remote :remote-method="deliveryPageQueryListOrderNo">
                            <el-option
                                    v-for="item in formList.missionList"
                                    :key="item.id"
                                    :label="item.orderNo"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="商品筛选">
                        <rich-filter key="needfilterStyle"
                                     v-model="form.styleParam"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"></rich-filter>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="制单日期">
                        <el-date-picker
                                @change="touchingDateChange"
                                v-model="form.touchingDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="货期">
                        <el-date-picker
                                @change="deliveryDateChange"
                                v-model="form.deliveryDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物料分类">
                        <el-select v-model="form.materialsKindIdList" placeholder="请选择" :multiple="true" clearable filterable >
                            <el-option
                                    v-for="item in formList.materialKindsList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!--<el-form-item label="物料筛选">-->
                        <!--<rich-filter key="needfilterMaterial"-->
                                     <!--v-model="form.materialParam"-->
                                     <!--dialogType='MATERIAL'-->
                                     <!--placeholder="点击可筛选物料"></rich-filter>-->
                    <!--</el-form-item>-->
                    <el-form-item label="物料筛选">
                        <materialSelect ref="materialSelect" :type="'materialSelectSearch'" @change="materialSelectSearch" :multiple="true"></materialSelect>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="供应商">
                        <supplier-select ref="supplierSelect" v-model="form.supplierIdList" :multiple='true' :canAdd = 'false' ></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="标签筛选">
                        <label-select v-model="form.labelIds"></label-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="采购员">
                        <workerLeader  v-model="form.purchaserIds"
                                      :placeholder="'请选择'"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分配状态">
                        <filter-check-group multiple v-model="form.allocationStatus">
                            <filter-check-item
                                    v-for="item in options.allocationStatusList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="采购状态">
                        <filter-check-group multiple v-model="form.purchaseStatus">
                            <filter-check-item
                                    v-for="item in options.purchaseStatusList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </slide-filter>
</template>
<script>
const fun = require('../../../Common/commonFun.js')
import { deliveryBoardQueryListData } from '../../../../api/material.js'
import {deliveryPageQueryListOrderNo} from '@/api'
import supplierSelect from '@/components/Common/custom-select/supplier-select';
import labelSelect from '@/components/material/components/labelSelect.vue'
import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
export default {
    data() {
        return {
            time: null,
            form:{
                styleParam:{},
                materialParam:{},
                orderNoIdList:[],
                deliveryDate:'',
                deliveryStartDate:'',
                deliveryEndDate:'',
                touchingDate:'',
                touchingStartDate:'',
                touchingEndDate:'',
                labelIds: [],
                materialsKindIdList:[],
                supplierIdList:[],
                purchaseStatus: [0,1],
                materialIds:[],
                allocationStatus:[],
                purchaserIds:[]
            },
            formList:{
                missionList:[],
                materialKindsList:[],
                materialsNoList:[]
            },
            options: {
                purchaseStatusList:[
                    {label: '未采购', value: 0},
                    {label: '已采购', value: 1},
                    {label: '已完成', value: 2},
                ],
                allocationStatusList:[
                    {label: '未分配', value: 1},
                    {label: '已分配', value: 2}
                ]
            },
            backupForm:{},
        }
    },
    components: {
        FilterCheckGroup,
        FilterCheckItem,
        supplierSelect,
        labelSelect
    },
    watch:{

    },
    computed:{
        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        },
        facId() {
            return JSON.parse(sessionStorage.getItem("last_login")).id
        },
    },
    methods:{
        materialSelectSearch(val){
            this.form.materialIds = val
        },
        // 制单日期改变
        touchingDateChange(date){
            this.form.touchingStartDate = this.form.touchingDate.length>0?fun.dateFormatter(this.form.touchingDate[0], false):''
            this.form.touchingEndDate = this.form.touchingDate.length>0?fun.dateFormatter(this.form.touchingDate[1], false):''
            console.log(this.form.touchingStartDate,this.form.touchingEndDate)
        },
        // 货期改变
        deliveryDateChange(date){
            this.form.deliveryStartDate = this.form.deliveryDate.length>0?fun.dateFormatter(this.form.deliveryDate[0], false):''
            this.form.deliveryEndDate = this.form.deliveryDate.length>0?fun.dateFormatter(this.form.deliveryDate[1], false):''
            console.log(this.form.deliveryStartDate,this.form.deliveryEndDate)
        },
        deliveryBoardQueryListData() {
            let params = {
                factoryId:this.facId,
                userId:this.userId
            }
            deliveryBoardQueryListData(params).then(res=>{
                // this.formList.missionList = res.data.data.missionList;
                this.formList.materialKindsList = res.data.data.materialKindsList;
                // this.formList.materialsNoList = res.data.data.materialsNoList;
            })
        },
        // 下拉数据
        deliveryPageQueryListOrderNo(keyword='') {
            // 下拉框为多选才需要防抖 单选则组件自带防抖
            clearTimeout(this.time);
           this.time = setTimeout(() => {
                let params = {
                    unitId: this.facId,
                    userId: this.userId,
                    keyword
                };
                deliveryPageQueryListOrderNo(params).then(res => {
                    this.formList.missionList = res.data.data;
                })
            }, 300);
        },
        cancel(){
            this.form = JSON.parse(JSON.stringify(this.backupForm))
        },
        reset() {
            this.form.styleParam = {},
            this.form.materialParam = {},
            this.form.orderNoIdList = [];
            this.form.deliveryDate = '';
            this.form.deliveryStartDate = '';
            this.form.deliveryEndDate = '';
            this.form.touchingDate = '';
            this.form.touchingStartDate = ''
            this.form.touchingEndDate = ''
            this.form.labelIds = []
            this.form.materialsKindIdList = [];
            this.form.supplierIdList = [];
            this.form.purchaseStatus = [0,1]
            this.form.materialIds = [];
            this.$refs['materialSelect'].reset()
            this.$refs['supplierSelect'].reset()
            this.form.allocationStatus = this.powerJudgement.hasPermission("fac.purchaseOrder.allocationPurchaser")?[1]:[1,2]
            this.form.purchaserIds = []
            this.$emit('filterData',JSON.parse(JSON.stringify(this.form)));
            this.backupForm = JSON.parse(JSON.stringify(this.form))

        },
        filter() {
            this.$emit('filterData',JSON.parse(JSON.stringify(this.form)));
            this.backupForm = JSON.parse(JSON.stringify(this.form))
        },
    },
    created() {
        this.form.allocationStatus = this.powerJudgement.hasPermission("fac.purchaseOrder.allocationPurchaser")?[1]:[1,2]
        this.deliveryBoardQueryListData();
        this.deliveryPageQueryListOrderNo();
    }
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">

</style>


