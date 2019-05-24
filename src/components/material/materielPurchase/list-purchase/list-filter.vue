<template>
    <slide-filter
            placeholder="按条件筛选"
            @cancel="cancel"
            @reset="reset"
            @filter="filter">
        <el-form
                :inline="true"
                label-width="90px"
                style="margin-left: -38px;">
            <el-row>
                <el-col v-if="isSampleMaterial" :span="12">
                    <el-form-item label="设计档案" >
                        <rich-filter
                                key="purchaseListFilterDesignStyle"
                                v-model="form.designStyleParam"
                                dialogType='DESIGN_STYLE'
                                placeholder="点击可筛选档案"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col v-if="!isSampleMaterial" :span="12">
                    <el-form-item label="商品档案">
                        <rich-filter
                                key="purchaseListFilterStyle"
                                v-model="form.styleParam"
                                dialogType='STYLE'
                                placeholder="点击可筛选商品"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="采购单号" >
                        <material-various-order-select v-model="form.orderNoList" :multiple="true" :needOrderNo="true"
                                                       type="purchase"
                                                       :module="isSampleMaterial?1:0"></material-various-order-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="采购员">
                        <workerLeader v-model="form.creatorIdList" :single="'noSingle'"
                                      :placeholder="'请选择或搜索采购员'"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="采购日期">
                        <el-date-picker
                                @change="dateCreatedChange"
                                v-model="form.dateCreated"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="!isSampleMaterial" type="flex">
                <el-col :span="12">
                    <el-form-item label="预计货期">
                        <el-date-picker
                                @change="expectDateChange"
                                v-model="form.expectDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生产单号">
                        <el-select v-model="form.demandSourceBillIdList" placeholder="请选择或搜索" multiple clearable filterable>
                            <el-option
                                    v-for="item in missionList"
                                    :key="item.id"
                                    :label="item.orderNo"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="供应商" >
                        <supplier-select ref="supplierSelect" v-model="form.supplierIdList" :multiple='true'
                                         :canAdd='false'></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <!--<el-form-item label="物料筛选">-->
                        <!--<rich-filter key="purchaseListFilterMaterial"-->
                                     <!--v-model="form.materialParam"-->
                                     <!--dialogType='MATERIAL'-->
                                     <!--placeholder="点击可筛选物料"></rich-filter>-->
                    <!--</el-form-item>-->
                    <el-form-item label="物料筛选">
                        <materialSelect ref="materialSelect" :multiple="true" :type="'searchMaterialStyleNoScreen'"
                                        @change="materialSelectSearch"></materialSelect>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="标签筛选">
                        <label-select v-model="form.labelIds"></label-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <template>
                    <el-form-item  label="到料状态">
                        <div>
                            <filter-check-group multiple="true" v-model="form.arriveStatus">
                                <filter-check-item
                                        v-for="item in options"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </div>
                    </el-form-item></template>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item  label="采购单状态">
                            <filter-check-group multiple v-model="form.cancel">
                                <filter-check-item
                                        v-for="item in options2"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                    </el-form-item>
                </el-col>
                <!--<el-col :md="isSampleMaterial?24:24" :lg="isSampleMaterial?18:24">-->
                    <!--<div class="btn-group">-->
                        <!--<el-button v-if="!isSampleMaterial" class="btn btn-reset" @click="excel">导出表格</el-button>-->
                        <!--<el-button class="btn btn-reset" @click="reset">重置</el-button>-->
                        <!--<el-button class="btn btn-submit" @click="submit">筛选</el-button>-->
                    <!--</div>-->
                <!--</el-col>-->
            </el-row>
        </el-form>
    </slide-filter>
</template>
<script>
    const fun = require('../../../Common/commonFun.js')
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    import {purchaseQueryListData} from '../../../../api/material.js'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import {getDesignStyleList} from '@/api/sample-centre';
    import DesignStyleNoSelect from "../../../Common/custom-select/designStyleNoSelect";
    import MaterialVariousOrderSelect from "../../../Common/custom-select/materialVariousOrderSelect";
    import labelSelect from '@/components/material/components/labelSelect.vue'

    export default {
        components: {
            MaterialVariousOrderSelect,
            DesignStyleNoSelect,
            FilterCheckGroup,
            FilterCheckItem,
            supplierSelect,
            labelSelect
        },
        props: ['isSampleMaterial'],
        data() {
            return {
                form: {
                    styleParam:{},
                    designStyleParam:{},
                    materialParam:{},
                    creatorIdList: [],
                    demandSourceBillIdList: '',
                    orderNoList: [],
                    materialsNoList: [],
                    supplierIdList: [],
                    arriveStatus: [0, 1],
                    cancel: [0],
                    labelIds: [],
                    dateCreated: [],
                    dateCreatedFrom:'',
                    dateCreatedTo:'',
                    expectDate: [],
                    expectDateEndFrom:'',
                    expectDateEndTo:''
                },
                options: [
                    {label: '未到料', value: 0},
                    {label: '未到齐', value: 1},
                    {label: '已到齐', value: 2}
                ],
                options2: [
                    {label: '未撤销', value: 0},
                    {label: '已撤销', value: 1},
                ],
                missionList: [],
                materialsList: [],
                purchaserList: [],
                materialNoList: [],
                backupForm:{}
            }
        },
        watch: {},
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        methods: {
            // 采购日期改变
            dateCreatedChange(date){
                this.form.dateCreatedFrom = this.form.dateCreated.length>0?fun.dateFormatter(this.form.dateCreated[0], false):''
                this.form.dateCreatedTo = this.form.dateCreated.length>0?fun.dateFormatter(this.form.dateCreated[1], false):''
                console.log(this.form.dateCreatedFrom,this.form.dateCreatedTo)
            },
            // 预计货期改变
            expectDateChange(date){
                this.form.expectDateEndFrom = this.form.expectDate.length>0?fun.dateFormatter(this.form.expectDate[0], false):''
                this.form.expectDateEndTo = this.form.expectDate.length>0?fun.dateFormatter(this.form.expectDate[1], false):''
                console.log(this.form.expectDateEndFrom,this.form.expectDateEndTo)
            },
            materialSelectSearch(val){
                this.form.materialsNoList = val
            },
            purchaseQueryListData() {
                let params = {
                    userId: this.userId,
                    factoryId: this.unitId
                };
                purchaseQueryListData(params).then(res => {
                    this.missionList = res.data.data.missionList;
                    this.purchaserList = res.data.data.purchaserList;
                    this.materialNoList = res.data.data.materialsList;
                    this.$emit('purchaserList', this.purchaserList);
                })
            },
            cancel(){
                this.form = JSON.parse(JSON.stringify(this.backupForm))
            },
            reset() {
                this.form.styleParam = {},
                this.form.designStyleParam = {},
                this.form.materialParam = {},

                this.form.creatorIdList = [];
                this.form.demandSourceBillIdList = '';
                this.form.orderNoList = [];
                this.form.supplierIdList = [];
                this.form.arriveStatus = [0, 1];

                this.form.dateCreated = [];
                this.form.dateCreatedFrom = '';
                this.form.dateCreatedTo = '';

                this.form.expectDate = [];
                this.form.expectDateEndFrom = '';
                this.form.expectDateEndTo = '';

                this.form.cancel = [0];
                this.form.labelIds = [];
                this.form.materialsNoList = [];
                this.$refs['materialSelect'].reset()
                this.$refs['supplierSelect'].reset();
                this.$emit('submit', JSON.parse(JSON.stringify(this.form)));
            },
            filter() {
                this.$emit('submit', JSON.parse(JSON.stringify(this.form)));
                this.backupForm = JSON.parse(JSON.stringify(this.form))
            },

        },
        created() {
            this.purchaseQueryListData();
        }
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
</style>

