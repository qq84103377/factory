<template>
    <slide-filter
            placeholder="按条件筛选"
            @cancel="cancel"
            @reset="reset"
            @filter="filter">
        <el-form
                :inline="true"
                label-width="90px"
                style="margin-left: -38px;"
                :model="form">
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="单号">
                        <material-various-order-select v-model="form.billId" type="refund" module="0" ></material-various-order-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入库时间">
                        <el-date-picker
                                v-model="form.orderDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="入库仓库">
                        <el-select v-model="form.storehouseId" placeholder="请选择或搜索" clearable filterable>
                            <el-option
                                    v-for="item in store"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="操作员">
                        <workerLeader v-model="form.creatorId" :single="'single'" :placeholder="'请选择或搜索'"></workerLeader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="物料款号">
                        <materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'"
                                        @change="materialSelectSearch"></materialSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="供应商">
                        <supplier-select ref="supplierSelect" :single="true" :canAdd='false':multiple='true' v-model="form.supplierId"></supplier-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="成衣款号">
                        <rich-filter v-model="richFilterParams"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"></rich-filter>
                        <!--<goods-select v-model="form.styleIds" :multiple="true"></goods-select>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生产单号">
                        <el-select v-model="form.demandSourceId" placeholder="请选择或搜索" multiple clearable filterable remote :remote-method="getMissionIdAndNameList">
                            <el-option
                                    v-for="item in missionOrderNoList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="加工厂">
                        <outside-supplier-select ref="OutsideFactoryId" @getSupplierId="getOutsideFactoryId"></outside-supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="余料单状态">
                        <div>
                            <filter-check-group multiple v-model="form.status">
                                <filter-check-item
                                        v-for="item in options"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </slide-filter>
</template>
<script>
    const fun = require('@/components/Common/commonFun.js')
    import {purchaseQueryListData} from '@/api/material.js'
    import {getDesignStyleList} from '@/api/sample-centre';
    import MaterialVariousOrderSelect from "@/components/Common/custom-select/materialVariousOrderSelect";
    import FilterCheckGroup from '../../order/WorkOrders/filter-check-group';
    import FilterCheckItem from '../../order/WorkOrders/filter-check-item';
    import {
        storeList,
        getPersonList,
        billIdAndNameList,
        missionIdAndNameList,
    } from '@/api'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';

    export default {
        components: {
            FilterCheckGroup,
            FilterCheckItem,
            supplierSelect,
            MaterialVariousOrderSelect,
        },
        props: ['isSampleMaterial'],
        data() {
            return {
                richFilterParams:{},
                form: {
                    orderDate: null,
                    billId: '',
                    storehouseId: '',
                    creatorId: '',
                    materialId:'',
                    // styleIds: [],
                    materialsNo: '',
                    supplierId: [],
                    demandSourceId: [],
                    outsideFactoryId: '',
                    status: [0]

                },
                store: [],
                // billIdList: [], //回料单下拉
                missionOrderNoList: [], //生产单下拉
                options: [
                    {value: 0, label: '未撤销'},
                    {value: 1, label: '已撤销'}
                ],
                pageNo:1,
            }
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        methods: {
            //生产单号
            getMissionIdAndNameList(key=""){
                let obj = {
                    unitId:this.unitId,
                    key:key
                }
                missionIdAndNameList(obj).then(res=>{
                    console.log(res);
                    this.missionOrderNoList = res.data.data
                })
            },
            // 回料工厂
            getOutsideFactoryId(val){
                if (val) {
                    this.form.outsideFactoryId = val.id;
                } else {
                    this.form.outsideFactoryId = ''
                }
            },
            // 物料款号
            materialSelectSearch(val) {
                this.form.materialId = val
            },
            storeList() {
                let params = {
                    unitId: this.unitId
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses; // 仓库
                });
            },
            cancel(){
                this.form = JSON.parse(JSON.stringify(this.backupForm))
            },
            reset() {
                this.richFilterParams = {}
                this.form = {
                    orderDate: null,
                    billId: '',
                    storehouseId: '',
                    creatorId: '',
                    materialId:'',
                    // styleIds: [],
                    materialsNo: '',
                    supplierId: [],
                    demandSourceId: [],
                    outsideFactoryId: '',
                    status: [0]
                }
                this.$refs['materialSelect'].reset()
                this.$refs['OutsideFactoryId'].reset()
                this.$refs['supplierSelect'].reset()
                this.$emit('submit', {...this.richFilterParams,...this.form});
            },
            filter() {
                this.$emit('submit', {...this.richFilterParams,...this.form});
                this.backupForm = JSON.parse(JSON.stringify(this.form))
            },
        },
        created() {
            this.storeList()
            this.getMissionIdAndNameList()
        }
    }
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
</style>

