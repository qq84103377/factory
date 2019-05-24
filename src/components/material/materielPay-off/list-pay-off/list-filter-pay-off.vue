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
                    <el-form-item :label="belongModule==2?'通知单号':'送料单号'" prop="order">
                        <material-various-order-select v-model="form.order" :needOrderNo="true" type="delivery"
                                                       :module="belongModule"></material-various-order-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="belongModule==2?'操作日期':'送料日期'">
                        <el-date-picker
                                v-model="form.date"
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
                    <el-form-item :label="belongModule==2?'操作员':'送料员'">
                        <workerLeader v-model="form.deliveryer" :single="'single'"
                                      :placeholder="'请选择或搜索'"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="送料仓库">
                        <el-select v-model="form.storeId" placeholder="请选择或搜索" clearable filterable>
                            <el-option
                                    v-for="item in formList.storehouseList"
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
                    <el-form-item label="物料筛选">
                        <materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'"
                                        @change="materialSelectSearch" :isMaterialNo="true"></materialSelect>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="供应商">
                        <supplier-select ref="supplierSelect" :single="true" :canAdd='false'
                                         @getSupplierId="getSupplierId"></supplier-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="belongModule!=1">
                <el-col :span="12">
                    <el-form-item label="商品档案">
                        <rich-filter key="STYLE" v-model="richFilterParams"
                                     dialogType='STYLE'
                                     placeholder="点击可筛选商品"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生产单号">
                        <el-select v-model="form.missionNo" placeholder="请选择或搜索" clearable filterable remote :remote-method="deliveryPageQueryListData">
                            <el-option
                                    v-for="item in formList.missionOrderNoList"
                                    :key="item.id"
                                    :label="item.orderNo"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col v-if="belongModule!=1" :span="12">
                    <el-form-item label="加工厂">
                        <el-select v-model="form.factoryIds" placeholder="请选择或搜索" multiple filterable remote
                                   :remote-method="getFactorys">
                            <el-option
                                    v-for="item in formList.facList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="belongModule==1" :span="12">
                    <el-form-item label="设计档案" class="filter-item">
                        <rich-filter key="DESIGN_STYLE" v-model="richFilterParams"
                                     dialogType='DESIGN_STYLE'
                                     placeholder="点击可筛选档案"></rich-filter>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item :label="belongModule==2?'单据状态':'送料单状态'">
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
            <el-row v-if="belongModule==2">
                <el-col :span="12">
                    <el-form-item label="送料状态">
                        <div>
                            <filter-check-group multiple v-model="form.status">
                                <filter-check-item
                                        v-for="item in formList.notifyList"
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
    import {deliveryPageQueryListData, getFactorys, getfreedomMissions, getStorehousesByUserId, deliveryPageQueryListOrderNo} from '@/api';
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import FilterCheckGroup from '../../../order/WorkOrders/filter-check-group';
    import FilterCheckItem from '../../../order/WorkOrders/filter-check-item';
    import DesignStyleNoSelect from "@/components/Common/custom-select/designStyleNoSelect";
    // belongModule:
    // 0:送料单
    // 1:样料送料单
    // 2:送料通知单
    export default {
        props: ['belongModule'],
        components: {
            supplierSelect,
            FilterCheckGroup,
            FilterCheckItem,
            DesignStyleNoSelect
        },
        data() {
            return {
                richFilterParams: {},
                form: {
                    facMissionId: '',
                    order: '',
                    date: '',
                    missionNo: '',
                    supplier: '',
                    deliveryer: '',
                    cancel: [0],
                    storeId: '',
                    factoryIds: [],
                    materialsNo: '',
                    status:['WAIT_START']
                },
                options: {
                    freedomMissions: [],
                },
                options2: [
                    {label: '未撤销', value: 0},
                    {label: '已撤销', value: 1},
                ],
                formList: {
                    missionOrderNoList: [],
                    materialsNoList: [],
                    storehouseList: [],
                    deliveryerList: [],
                    facList: [],
                    notifyList:[
                        {label: '未送料', value: 'WAIT_START'},
                        {label: '已送齐', value: 'FINISH'},
                        {label: '未送齐', value: 'ONGOING'},
                    ]
                },

                backup:{
                    form:{},
                    richFilterParams:{}
                }
            }
        },
        watch: {


        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            }
        },
        methods: {
            //生产单号
            getfreedomMissions(val) {
                let key = '';
                if (val) {
                    key = val
                }
                let obj = {
                    unitId: this.facId,
                    likeColumn: key
                }
                getfreedomMissions(obj).then(res => {
                    console.log(res);
                    this.options.freedomMissions = res.data.data
                })
            },
            remoteFacMissionId(val) {
                this.getfreedomMissions(val)
            },
            //获取供应商id
            getSupplierId(val) {
                if (val) {
                    this.form.supplier = val.id;
                }
            },
            // 物料筛选
            materialSelectSearch(val, valNo) {
                this.form.materialsNo = valNo
            },
            // 下拉数据
            deliveryPageQueryListData(keyword='') {
                    let params = {
                        unitId: this.facId,
                        userId: this.userId,
                        keyword
                    };
                    deliveryPageQueryListOrderNo(params).then(res => {
                        this.formList.missionOrderNoList = res.data.data;
                    })
            },
            // 加工厂工厂下拉
            getFactorys(key = "") {
                let params = {
                    userId: this.userId,
                    key: key
                }
                getFactorys(params).then(res => {
                    this.formList.facList = res.data.data
                })
            },
            // 取消
            cancel(){
                this.form = JSON.parse(JSON.stringify(this.backup.form))
                this.richFilterParams = JSON.parse(JSON.stringify(this.backup.richFilterParams))
            },
            // 重置
            reset() {
                this.richFilterParams = {}
                this.form.order = ''
                this.form.date = '';
                this.form.missionNo = '';
                this.form.supplier = '';
                this.form.deliveryer = '';
                this.form.storeId = '';
                this.form.cancel = [0];
                this.form.status=['WAIT_START']
                this.form.factoryIds = [];
                this.$refs['materialSelect'].reset()
                this.$refs['supplierSelect'].reset()
                this.$emit('filter', {...this.richFilterParams, ...this.form});
            },
            filter() {
                this.$emit('filter', {...this.richFilterParams, ...this.form});
                this.backup.form = JSON.parse(JSON.stringify(this.form))
                this.backup.richFilterParams = JSON.parse(JSON.stringify(this.richFilterParams))
            },
            // 筛选倒料员
            getManId(arrId) {
                this.form.deliveryer = arrId
            },
            getStoreList() {
                getStorehousesByUserId({facId: this.facId, userId: this.userId,kind: 1}).then(res => {
                    this.formList.storehouseList = res.data.data;
                })
            }
        },

        created() {
            this.getStoreList()
            this.getfreedomMissions();
            this.deliveryPageQueryListData();
            this.getFactorys()
        }
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">

</style>

