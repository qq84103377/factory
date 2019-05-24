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
                <el-col :span="12">
                    <el-form-item label="到料日期">
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
                    <el-form-item label="到料单号">
                        <material-various-order-select v-model="form.orderNo" :needOrderNo="true" type="arrive"
                                                       :module="isSampleMaterial?1:0"></material-various-order-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="到料仓库">
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
                    <el-form-item label="到料员">
                        <workerLeader v-model="form.creatorId" :single="'single'"
                                      :placeholder="'请选择或搜索'"></workerLeader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="供应商">
                        <supplier-select ref="supplierSelect" :single='true' :canAdd='false'
                                         @getSupplierId="getSupplierId"></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料筛选">
                        <materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'"
                                        @change="materialSelectSearch" :isMaterialNo="true"></materialSelect>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="商品筛选">
                        <rich-filter
                                key="purchaseListFilterStyle"
                                v-model="form.styleParam"
                                dialogType='STYLE'
                                placeholder="点击可筛选商品"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工单号">
                        <el-select v-model="form.demandSourceBillId" placeholder="请选择或搜索" clearable filterable>
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
                    <el-form-item label="标签筛选">
                        <label-select v-model="form.labelIds"></label-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="到料状态">
                        <div>
                            <filter-check-group multiple="true" v-model="form.arriveStatus">
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
            <el-row type="flex">
                <el-col :span="12">
                    <el-form-item label="到料单状态">
                        <div>
                            <filter-check-group multiple v-model="form.cancel">
                                <filter-check-item
                                        v-for="item in options2"
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
    const fun = require('../../Common/commonFun.js')
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    import {purchaseQueryListData} from '../../../api/material.js'
    import {storeList} from '@/api'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    // import {getDesignStyleList} from '@/api/sample-centre';
    // import DesignStyleNoSelect from "../../../Common/custom-select/designStyleNoSelect";
    import labelSelect from '@/components/material/components/labelSelect.vue'

    export default {
        components: {
            // DesignStyleNoSelect,
            FilterCheckGroup,
            FilterCheckItem,
            supplierSelect,
            labelSelect
        },
        props: ['isSampleMaterial'],
        data() {
            return {
                form: {
                    orderDate: '',
                    orderNo: '',
                    storehouseId: '',
                    creatorId: '',
                    supplierId: '',
                    materialsNo: '',
                    styleParam: {},
                    labelIds: [],
                    demandSourceBillId: '',
                    arriveStatus: [0, 1, 2],
                    cancel: [0],
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
                backupForm: {},
                store: []
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
            storeList() {
                let params = {
                    unitId: this.unitId
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses; // 仓库
                    // this.form.storeId = res.data.storehouses[0].id;
                });
            },
             // 获取供应商id
            getSupplierId(val) {
                if(val) {
                    this.form.supplierId = val.id;
                }
            },
            // 采购日期改变
            dateCreatedChange(date) {
                this.form.dateCreatedFrom = this.form.dateCreated.length > 0 ? fun.dateFormatter(this.form.dateCreated[0], false) : ''
                this.form.dateCreatedTo = this.form.dateCreated.length > 0 ? fun.dateFormatter(this.form.dateCreated[1], false) : ''
                console.log(this.form.dateCreatedFrom, this.form.dateCreatedTo)
            },
            // 预计货期改变
            expectDateChange(date) {
                this.form.expectDateEndFrom = this.form.expectDate.length > 0 ? fun.dateFormatter(this.form.expectDate[0], false) : ''
                this.form.expectDateEndTo = this.form.expectDate.length > 0 ? fun.dateFormatter(this.form.expectDate[1], false) : ''
                console.log(this.form.expectDateEndFrom, this.form.expectDateEndTo)
            },
            materialSelectSearch(val,valNo) {
                this.form.materialsNo = valNo
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
            cancel() {
                this.form = JSON.parse(JSON.stringify(this.backupForm))
            },
            reset() {
                this.form.styleParam = {},
                this.form.orderDate = '',
                this.form.orderNo = '',
                this.form.storehouseId = '',
                this.form.creatorId = '',
                this.form.supplierId = '',
                this.form.materialsNo = '',
                this.form.labelIds = [],
                this.form.demandSourceBillId = '',
                this.form.arriveStatus = [0,1,2],
                this.form.cancel = [0],
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
            this.storeList()
        }
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
</style>


<!--<template>-->

<!--<div class="box-shadow custom-filter-form  masterial-filter clearfix">-->
<!--<el-form style="margin-left: -40px" :model="form" label-width="100px">-->
<!--<el-row>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料单号">-->
<!--<material-various-order-select v-model="form.orderNo" :needOrderNo="true" type="arrive" :module="isSampleMaterial?1:0" ></material-various-order-select>-->
<!--&lt;!&ndash;<el-select v-model="form.orderNo" placeholder="请选择或搜索" clearable filterable>&ndash;&gt;-->
<!--&lt;!&ndash;<el-option&ndash;&gt;-->
<!--&lt;!&ndash;v-for="item in arriveOrderNoList"&ndash;&gt;-->
<!--&lt;!&ndash;:key="item"&ndash;&gt;-->
<!--&lt;!&ndash;:label="item"&ndash;&gt;-->
<!--&lt;!&ndash;:value="item">&ndash;&gt;-->
<!--&lt;!&ndash;</el-option>&ndash;&gt;-->
<!--&lt;!&ndash;</el-select>&ndash;&gt;-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料日期">-->
<!--<el-date-picker-->
<!--v-model="form.orderDate"-->
<!--type="daterange"-->
<!--placeholder="选择日期范围"-->
<!--start-placeholder="开始日期"-->
<!--end-placeholder="结束日期">-->
<!--</el-date-picker>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料员">-->
<!--<workerLeader v-model="form.creatorId" :single="'single'" :placeholder="'请选择或搜索'"></workerLeader>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料仓库">-->
<!--<el-select v-model="form.storehouseId" placeholder="请选择或搜索" clearable filterable>-->
<!--<el-option-->
<!--v-for="item in store"-->
<!--:key="item.id"-->
<!--:label="item.name"-->
<!--:value="item.id">-->
<!--</el-option>-->
<!--</el-select>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--</el-row>-->
<!--<el-row>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="供应商">-->
<!--<supplier-select ref="supplierSelect" :single='true' :canAdd='false' @getSupplierId="getSupplierId"></supplier-select>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="物料款号">-->
<!--<materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'"-->
<!--@change="materialSelectSearch" :isMaterialNo="true"></materialSelect>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col v-if="isSampleMaterial" :span="6">-->
<!--<el-form-item label="设计档案">-->
<!--<rich-filter key="DESIGN_STYLE" v-model="richFilterParams"-->
<!--dialogType='DESIGN_STYLE'-->
<!--placeholder="点击可筛选档案"></rich-filter>-->
<!--&lt;!&ndash;<design-style-no-select ref="designStyleNos" :multiple="true" v-model="form.designStyleNos"></design-style-no-select>&ndash;&gt;-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col v-if="isSampleMaterial" :span="6">-->
<!--<el-form-item label="采购员">-->
<!--<workerLeader v-model="form.purchaserIds" :single="'single'" :placeholder="'请选择或搜索'" :key="123"></workerLeader>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col v-if="!isSampleMaterial" :span="6">-->
<!--<el-form-item label="商品档案">-->
<!--<rich-filter key="STYLE" v-model="richFilterParams"-->
<!--dialogType='STYLE'-->
<!--placeholder="点击可筛选商品"></rich-filter>-->
<!--&lt;!&ndash;<goods-select v-model="form.styleNos" :needStyleNo="true" :multiple="true"></goods-select>&ndash;&gt;-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col v-if="!isSampleMaterial" :span="6">-->
<!--<el-form-item label="生产单号">-->
<!--<el-select v-model="form.demandSourceBillId" placeholder="请选择或搜索" clearable filterable>-->
<!--<el-option-->
<!--v-for="item in missionList"-->
<!--:key="item.id"-->
<!--:label="item.orderNo"-->
<!--:value="item.id">-->
<!--</el-option>-->
<!--</el-select>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--</el-row>-->
<!--<el-row>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="标签筛选">-->
<!--<label-select v-model="form.labelIds"></label-select>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料状态">-->
<!--<div>-->
<!--<filter-check-group multiple v-model="form.arriveStatus">-->
<!--<filter-check-item-->
<!--v-for="item in options"-->
<!--:key="item.value"-->
<!--:value="item.value"-->
<!--:label="item.label"></filter-check-item>-->
<!--</filter-check-group>-->
<!--</div>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--<el-col :span="6">-->
<!--<el-form-item label="到料单状态">-->
<!--<div>-->
<!--<filter-check-group multiple v-model="form.cancel">-->
<!--<filter-check-item-->
<!--v-for="item in options2"-->
<!--:key="item.value"-->
<!--:value="item.value"-->
<!--:label="item.label"></filter-check-item>-->
<!--</filter-check-group>-->
<!--</div>-->
<!--</el-form-item>-->
<!--</el-col>-->
<!--</el-row>-->
<!--<el-row>-->
<!--<el-col :span="24">-->
<!--<div class="btn-group">-->
<!--<el-button class="btn btn-reset" @click="excel">导出表格</el-button>-->
<!--<el-button v-if="isSampleMaterial&&!isPrint" class="btn btn-reset" @click="printBtn">打印送检单</el-button>-->
<!--<el-button v-if="isSampleMaterial&&isPrint" class="btn btn-reset" @click="printBtnCancel">取消</el-button>-->
<!--<el-button v-if="isSampleMaterial&&isPrint" class="btn btn-warning" @click="prtitSure">确定</el-button>-->
<!--<el-button class="btn btn-reset" @click="reset">重置</el-button>-->
<!--<el-button class="btn btn-submit" @click="submit">筛选</el-button>-->
<!--</div>-->
<!--</el-col>-->
<!--</el-row>-->

<!--</el-form>-->
<!--</div>-->
<!--</template>-->
<!--<script>-->
<!--import FilterCheckGroup from '../../order/WorkOrders/filter-check-group';-->
<!--import FilterCheckItem from '../../order/WorkOrders/filter-check-item';-->
<!--import {purchaseQueryListData} from '../../../api/material.js'-->
<!--import {storeList, getPersonList} from '../../../api/api.js'-->
<!--import supplierSelect from '@/components/Common/custom-select/supplier-select';-->
<!--import labelSelect from '@/components/material/components/labelSelect.vue'-->
<!--import { setTimeout } from 'timers';-->

<!--export default {-->
<!--props:['isSampleMaterial'],-->
<!--components: {-->
<!--FilterCheckGroup,-->
<!--FilterCheckItem,-->
<!--supplierSelect,-->
<!--labelSelect-->
<!--},-->
<!--data() {-->
<!--return {-->
<!--form: {-->
<!--orderDate: '',-->
<!--demandSourceBillId: '',-->
<!--supplierId: '',-->
<!--creatorId: '',-->
<!--purchaserIds:'',-->
<!--storehouseId: '',-->
<!--materialsNo: '',-->
<!--orderNo: '',-->
<!--// styleNos: [],-->
<!--arriveStatus: [0, 1, 2],-->
<!--cancel: [0],-->
<!--// designStyleNos:[],-->
<!--labelIds: []-->
<!--},-->
<!--missionList: [],-->
<!--// supplierList: [],-->
<!--purchaserList: [],-->
<!--// orderNoList: [],-->
<!--materialNoList: [],-->
<!--// arriveOrderNoList: [],-->
<!--materialsNoList: [],-->
<!--store: [],-->
<!--options: [-->
<!--{value: 0, label: '未到料'},-->
<!--{value: 1, label: '未到齐'},-->
<!--{value: 2, label: '已到齐'}-->
<!--],-->
<!--options2: [-->
<!--{label: '未撤销', value: 0},-->
<!--{label: '已撤销', value: 1},-->
<!--],-->
<!--isPrint:false, // 是否打印送检单-->
<!--}-->
<!--},-->
<!--computed: {-->
<!--userId() {-->
<!--return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);-->
<!--},-->
<!--unitId() {-->
<!--return JSON.parse(sessionStorage.getItem("last_login")).id-->
<!--}-->
<!--},-->
<!--watch: {-->
<!--// form: {-->
<!--//     handler(val, old) {-->
<!--//         // console.log(val);-->
<!--//         this.$emit('formData', this.form);-->
<!--//     },-->
<!--//     deep: true-->
<!--// }-->
<!--},-->
<!--methods: {-->
<!--// 打印送检单-->
<!--printBtn() {-->
<!--this.isPrint = true-->
<!--this.$emit('update:isPrint',true);-->
<!--},-->
<!--printBtnCancel() {-->
<!--this.isPrint = false-->
<!--this.$emit('update:isPrint',false);-->
<!--},-->
<!--prtitSure() {-->
<!--this.$emit('prtitSure');-->
<!--},-->
<!--//获取供应商id-->
<!--getSupplierId(val) {-->
<!--if (val) {-->
<!--this.form.supplierId = val.id;-->
<!--}-->
<!--},-->
<!--materialSelectSearch(val,valNo) {-->
<!--this.form.materialsNo = valNo-->
<!--},-->
<!--purchaseQueryListData() {-->
<!--let params = {-->
<!--userId: this.userId,-->
<!--factoryId: this.unitId-->
<!--};-->
<!--purchaseQueryListData(params).then(res => {-->
<!--console.log(res);-->
<!--this.missionList = res.data.data.missionList; // 工单号-->
<!--this.purchaserList = res.data.data.purchaserList; // 采购员-->
<!--// this.orderNoList = res.data.data.orderNoList; // 采购单号-->
<!--this.materialNoList = res.data.data.materialNoList; // 物料款号-->
<!--// this.arriveOrderNoList = res.data.data.arriveOrderNoList; // 到料单号-->
<!--this.materialsNoList = res.data.data.materialsNoList;-->
<!--this.$emit('purchaserList', this.purchaserList);-->
<!--})-->
<!--},-->
<!--storeList() {-->
<!--let params = {-->
<!--unitId: this.unitId-->
<!--};-->
<!--storeList(params).then(res => {-->
<!--this.store = res.data.storehouses; // 仓库-->
<!--// this.form.storeId = res.data.storehouses[0].id;-->
<!--});-->
<!--},-->
<!--reset() {-->
<!--this.richFilterParams = {}-->
<!--this.form = {-->
<!--orderDate: '',-->
<!--demandSourceBillId: '',-->
<!--supplierId: '',-->
<!--creatorId: '',-->
<!--purchaserIds:'',-->
<!--storehouseId: '',-->
<!--materialsNo: '',-->
<!--orderNo: '',-->
<!--// designStyleNos:[],-->
<!--// styleNos: [],-->
<!--arriveStatus:[0, 1, 2],-->
<!--cancel: [0],-->
<!--labelIds: []-->
<!--};-->
<!--this.$refs['materialSelect'].reset();-->
<!--// if(this.isSampleMaterial){-->
<!--//     this.$refs['designStyleNos'].reset();-->
<!--// }-->
<!--this.$refs['supplierSelect'].reset();-->
<!--setTimeout(() => {-->
<!--this.submit();-->
<!--}, 500);-->
<!--},-->
<!--excel() {-->
<!--this.$emit('excel')-->
<!--},-->
<!--submit() {-->
<!--this.$emit('filterData',{...this.richFilterParams,...this.form});-->
<!--},-->
<!--getManId(arrId) {-->
<!--console.log(arrId);-->
<!--this.form.creatorId = arrId-->
<!--},-->
<!--getPurchaserIds(arrId) {-->
<!--this.form.purchaserIds = arrId;-->
<!--},-->
<!--},-->
<!--created() {-->
<!--this.purchaseQueryListData()-->
<!--this.storeList()-->
<!--}-->
<!--}-->
<!--</script>-->
<!--<style lang="scss" scoped>-->
<!--.masterial-filter {-->
<!--background-color: #fff;-->
<!--}-->
<!--</style>-->

<!--<style lang="scss">-->
<!--.btn-warning{-->
<!--background-color: #ff9c38;-->
<!--border:1px solid #ff9c38;-->
<!--color:#fff;-->
<!--&:hover{-->
<!--background-color: #eb8f34;-->
<!--border:1px solid #eb8f34;-->
<!--color:#fff;-->
<!--}-->
<!--}-->
<!--</style>-->

