<template>

    <div class="box-shadow custom-filter-form  masterial-filter">
        <el-form style="margin-left: -40px" :model="form" label-width="100px">
            <el-row>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="回料单号">
                        <material-various-order-select v-model="form.billId" type="refund" module="0" ></material-various-order-select>
                        <!--<el-select v-model="form.billId" placeholder="请选择或搜索" clearable filterable>-->
                            <!--<el-option-->
                                    <!--v-for="item in billIdList"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.name"-->
                                    <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="回料时间">
                        <el-date-picker
                                v-model="form.orderDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
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
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="回料员">
                        <workerLeader v-model="form.creatorId" :single="'single'" :placeholder="'请选择或搜索'"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="物料款号">
                        <materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'"
                                        @change="materialSelectSearch"></materialSelect>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="供应商">
                        <supplier-select ref="supplierSelect" :single="true" :canAdd='false' @getSupplierId="getSupplierId" ></supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="商品档案">
                        <rich-filter v-model="richFilterParams"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"></rich-filter>
                        <!--<goods-select v-model="form.styleIds" :multiple="true"></goods-select>-->
                    </el-form-item>
                </el-col>
                <el-col  :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="生产单号">
                        <el-select v-model="form.demandSourceId" placeholder="请选择或搜索" clearable filterable remote :remote-method="getMissionIdAndNameList">
                            <el-option
                                    v-for="item in missionOrderNoList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col  :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="回料工厂">
                        <outside-supplier-select ref="OutsideFactoryId" @getSupplierId="getOutsideFactoryId"></outside-supplier-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="回料单状态">
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
                <el-col :xs="12" :sm="24" :md="16" :lg="12">
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="excel">导出表格</el-button>
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import FilterCheckGroup from '../../order/WorkOrders/filter-check-group';
    import FilterCheckItem from '../../order/WorkOrders/filter-check-item';
    import {storeList, getPersonList, billIdAndNameList,missionIdAndNameList} from '@/api'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';

    export default {
        props:['isSampleMaterial'],
        components: {
            FilterCheckGroup,
            FilterCheckItem,
            supplierSelect
        },
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
                    supplierId: '',
                    demandSourceId: '',
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
        watch: {
            // form: {
            //     handler(val, old) {
            //         console.log(val);
            //         this.$emit('formData', this.form);
            //     },
            //     deep: true
            // }
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
            // 获取回料单号
            // getBillIdAndNameList(key="") {
            //     let params = {
            //         unitId: this.unitId,
            //         key:key
            //     }
            //     billIdAndNameList(params).then(res => {
            //         this.billIdList = res.data.data
            //     })
            // },
            //获取供应商id
            getSupplierId(val) {
                if (val) {
                    this.form.supplierId = val.id;
                } else {
                    this.form.supplierId = ''
                }
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
                    // this.form.storeId = res.data.storehouses[0].id;
                });
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
                    supplierId: '',
                    demandSourceId: '',
                    outsideFactoryId: '',
                    status: [0]
                }
                this.$refs['materialSelect'].reset()
                this.$refs['OutsideFactoryId'].reset()
                this.$refs['supplierSelect'].reset()
                setTimeout(() => {
                    this.submit();
                }, 500);
            },
            excel() {
                this.$emit('excel')
            },
            submit() {
                this.$emit('filterData',{...this.richFilterParams,...this.form});
            },
            getManId(arrId) {
                console.log(arrId);
                this.form.creatorId = arrId
            },
            getPurchaserIds(arrId) {
                this.form.purchaserIds = arrId;
            },
        },
        created() {
            this.storeList()
            // this.getBillIdAndNameList()
            this.getMissionIdAndNameList()
        }
    }
</script>
<style lang="scss" scoped>
    .masterial-filter {
        background-color: #fff;
    }

</style>
<style lang="scss">
    .btn-warning{
        background-color: #ff9c38;
        border:1px solid #ff9c38;
        color:#fff;
        &:hover{
            background-color: #eb8f34;
            border:1px solid #eb8f34;
            color:#fff;
        }
    }
</style>

