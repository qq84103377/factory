<template>
    <slide-filter
            placeholder="按条件筛选"
            @cancel="cancel"
            @reset="reset"
            @filter="filter">
        <!--<div><input type="text" debounce="1000" @input></div>-->
        <el-form
                :inline="true"
                label-width="90px"
                style="margin-left: -38px;">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="工单号" >
                        <el-select v-model="form.order" placeholder="请选择工单号搜索" clearable filterable remote :remote-method="deliveryPageQueryListOrderNo">
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
                    <el-form-item label="商品档案" >
                        <rich-filter v-model="richFilterParams"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"></rich-filter>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="制单日期" >
                        <el-date-picker
                                v-model="form.orderDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计划完成送料" >
                        <el-date-picker
                                v-model="form.planDay"
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
                    <el-form-item label="物料分类" >
                        <el-select v-model="form.materielCategory" placeholder="请选择" clearable filterable>
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
                    <el-form-item label="物料筛选" >
                        <materialSelect ref="materialSelect" :type="'materialSelectSearch'" @change="materialSelectSearch" :isQuery="false"></materialSelect>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="供应商" >
                        <supplier-select ref="supplierSelect"  :single="true" :canAdd='false' @getSupplierId="getSupplierId"></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="整单外发" >
                        <el-select v-model="form.outsideFactoryIds" placeholder="请选择或搜索" multiple filterable>
                            <el-option
                                    v-for="item in formList.facList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                      </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="送料状态" >
                        <filter-check-group multiple v-model="form.status">
                            <filter-check-item
                                    v-for="item in options"
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
    import {deliveryBoardQueryListData, searchMaterialScreen} from '../../../../api/material.js';
    import {getFactorys, deliveryPageQueryListOrderNo} from '@/api';

    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    export default {
        data() {
            return {
                richFilterParams:{},
                form: {
                    order: '',
                    planDay: '',
                    orderDate: '',
                    materielCategory: '',
                    materialIds: '',
                    supplier: '',
                    status: [0,1],
                    outsideFactoryIds:[]
                },
                formList: {
                    missionList: [],
                    materialKindsList: [],
                    supplierList: [],
                    materialsNoList: [],
                    facList:[]
                },
                options: [
                    {label: '未送料', value: 0},
                    {label: '未送齐', value: 1},
                    {label: '已送齐', value: 2},
                ],
                backup:{
                    form:{},
                    richFilterParams:{}
                }
            }
        },
        components: {
            supplierSelect,
            FilterCheckGroup,
            FilterCheckItem
        },
        watch: {
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        methods: {
            // 送料工厂下拉
            getFactorys(key = "") {
                let params = {
                    userId: this.userId,
                    key: key
                }
                getFactorys(params).then(res => {
                    this.formList.facList = res.data.data
                })
            },
            //获取供应商id
            getSupplierId(val) {
                if (val) {
                    this.form.supplier = val.id;
                }
            },
            materialSelectSearch(val) {
                this.form.materialIds = val
            },
            deliveryBoardQueryListData() {
                let params = {
                    factoryId: this.facId,
                    userId: this.userId
                }
                deliveryBoardQueryListData(params).then(res => {
                    // this.formList.missionList = res.data.data.missionList;
                    this.formList.materialKindsList = res.data.data.materialKindsList;
                })
            },
            // 下拉数据
            deliveryPageQueryListOrderNo(keyword='') {
                    let params = {
                        unitId: this.facId,
                        userId: this.userId,
                        keyword
                    };
                    deliveryPageQueryListOrderNo(params).then(res => {
                        this.formList.missionList = res.data.data;
                    })
            },
            // 取消
            cancel(){
                this.form = JSON.parse(JSON.stringify(this.backup.form))
                this.richFilterParams = JSON.parse(JSON.stringify(this.backup.richFilterParams))
            },
            // 重置
            reset() {
                this.richFilterParams={}
                this.form.order = '';
                this.form.planDay = '';
                this.form.orderDate = '';
                this.form.materielCategory = '';
                this.form.materialIds = '';
                this.form.outsideFactoryIds = [];
                this.form.supplier = '';
                this.form.status = [];
                this.$refs['materialSelect'].reset()
                this.$refs['supplierSelect'].reset()
                this.$emit('filter',{...this.richFilterParams,...this.form});
            },
            // 筛选
            filter() {
                this.$emit('filter',{...this.richFilterParams,...this.form});
                this.backup.form = JSON.parse(JSON.stringify(this.form))
                this.backup.richFilterParams = JSON.parse(JSON.stringify(this.richFilterParams))
            },

        },
        created() {
            this.deliveryBoardQueryListData()
            this.deliveryPageQueryListOrderNo()
            this.getFactorys()
        }
    }
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">

</style>


