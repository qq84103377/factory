<template>

    <div class="filter">
        <div v-if="isInventory" class="box-shadow custom-filter-form">
            <el-form  style="margin-left: -40px"  :model="filter"  label-width="110px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="物料分类">
                            <el-select v-model="filter.type" placeholder="全部">
                                <el-option
                                        v-for="item in typeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="首次入库时间">
                            <el-date-picker
                                    @change="changeCreateDate1"
                                    v-model="firstDateList"
                                    type="daterange"
                                    align="right"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    placeholder="选择日期范围"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="物料款号">
                            <materialSelect ref="materialSelect" :type="'searchMaterialStyleNoScreen'" v-model="filter.code"></materialSelect>

                            <!--<el-select v-model="filter.code" filterable placeholder="请选择或搜索">-->
                                <!--<el-option-->
                                        <!--v-for="item in materialNoList"-->
                                        <!--:key="item.id"-->
                                        <!--:label="item.no"-->
                                        <!--:value="item.id">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="关联商品款号">
                            <goods-select v-model="filter.associatedProduct" :multiple="true"></goods-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12"  :sm="12">
                        <el-form-item label="是否为样料" label-width="110px">
                            <filter-check-group  v-model="filter.sampleMaterial">
                                <filter-check-item
                                        v-for="item in sampleMaterialOptions"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12"   :sm="12">
                        <div class="btn-group text-right">
                            <el-button class="btn btn-reset" @click='filterReset'>重置</el-button>
                            <el-button class="btn btn-submit" @click="filterSubmit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div v-else class="box-shadow custom-filter-form">
            <el-form  style="margin-left: -40px"  :model="filter"  label-width="110px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="物料分类">
                            <el-select v-model="filter.type" placeholder="全部">
                                <el-option
                                        v-for="item in typeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="变动类型">
                            <el-select v-model="filter.changeType" filterable placeholder="请选择或搜索">
                                <el-option
                                        v-for="(item, index) in changeTypeList"
                                        :key="index"
                                        :label="item.inventoryTypeText"
                                        :value="item.inventoryType">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="操作时间">
                            <el-date-picker
                                    @change="changeCreateDate2"
                                    v-model="operateDataList"
                                    type="daterange"
                                    align="right"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    placeholder="选择日期范围"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="操作人">
                            <workerLeader
                                    v-model="filter.operatePersonnel"
                                    :placeholder="'请选择或搜索'"
                                    :single="'single'">
                            </workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="操作工厂">
                            <el-select v-model="filter.operateFactory" placeholder="请选择">
                                <el-option
                                        v-for="item in factoryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="10">
                        <el-form-item label="是否为样料" label-width="110px">
                            <filter-check-group  v-model="filter.sampleMaterial">
                                <filter-check-item
                                        v-for="item in sampleMaterialOptions"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12"   :sm="12" :md="12" :lg="8">
                        <div class="btn-group text-right">
                            <el-button class="btn btn-reset" @click='filterReset'>重置</el-button>
                            <el-button class="btn btn-submit" @click="filterSubmit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        materialTypeSelect,
        materialSupSelect,
        materialNoSelect,
        changeTypeSelect,
        operatePersonnelSelect,
        operateFactorySelect
    } from "@/api/material";
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    export default {
        name: "filter",
        props: {
            typeName: String
        },
        components:{
            FilterCheckGroup,
            FilterCheckItem
        },
        data() {
            return {
                filter: {
                    type: '',                   //物料分类
                    supplier: '',               //供应商
                    firstStartTime: '',         //首次入库开始时间
                    firstEndTime: '',            //首次入库结束时间
                    code: '',                   //物料款号
                    changeType: '',             //变动类型
                    startOpAt: '',              //操作开始时间
                    endOpAt: '',                 //操作结束时间
                    operatePersonnel: '',       //操作人
                    operateFactory: '',         //操作工厂
                    sampleMaterial:2,
                    associatedProduct:[],//关联商品款号关键字
                },
                loading:false,
                type1: '',
                productList:'',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                typeList: [],       //物料分类下拉数据
                supplierList: [],     //供应商下拉数据
                materialNoList: [],      //物料款号下拉数据
                firstDateList: [],     //首次入库时间下拉数据
                changeTypeList: [],       //变动类型下拉数据
                operateDataList: [],       //操作时间
                personneleList: [],       //操作人下拉数据
                factoryList: [],         //操作工厂下拉数据
                sampleMaterialOptions:[
                    {label: '是', value: 1},
                    {label: '否', value: 0},
                    {label: '全部', value: 2},
                ]
            }
        },
        computed: {
            //是否物料库存页面引用
            isInventory() {
                if (this.typeName === 'inventory') {
                    return true;
                } else {
                    return false;
                }
            },
            //工厂id
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            //用户id
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            //仓库id
            storehouseId() {
                return this.$route.query.storehouseId;
            }
        },
        methods: {
            //重置筛选
            filterReset() {
                this.filter.type = '';
                this.filter.supplier = '';
                
                this.filter.sampleMaterial = 2
                if (this.isInventory) {
                    this.$refs.materialSelect.materialSelectId = ''
                    this.firstDateList = [];
                    this.filter.code = '';
                    this.filter.associatedProduct = [];
                } else {
                    this.filter.changeType = '';
                    this.operateDataList = [];
                    this.filter.operatePersonnel = '';
                    this.filter.operateFactory = '';
                }
                this.$emit("filterClick", this.filter);
            },
            filterSubmit() {
                this.$emit("filterClick", this.filter);
            },
            // 获取物料分类下拉数据
            getMaterielClassifyList() {
                let params = {
                    storehouseId: this.storehouseId
                };
                materialTypeSelect(params).then(res => {
                    this.typeList = res.data.data;
                });
            },
            // 获取供应商下拉数据
            getSupplierList() {
                let params = {
                    storehouseId: this.storehouseId
                };
                materialSupSelect(params).then(res => {
                    this.supplierList = res.data.data;
                });
            },
            //关联商品款号的搜索 
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let params = {
                            'storehouseId':this.storehouseId,
                            'keyWord':query,
                        };
                        selectAssociatedProduct(params).then(res => {
                            this.productList = res.data.data ;
                        });
                    }, 200);
                } else {
                    this.productList = [];
                }
            },
            // 获取物料款号下拉数据
            // getMaterialNoList() {
            //     let params = {
            //         storehouseId: this.storehouseId
            //     };
            //     materialNoSelect(params).then(res => {
            //         this.materialNoList = res.data.data;
            //     });
            // },
            // 获取变动类型下拉数据
            getChangeTypeList() {
                let params = {
                    userId: this.userId
                };
                changeTypeSelect(params).then(res => {
                    this.changeTypeList = res.data.data;
                });
            },
            // 获取操作人下拉数据
            getPersonneleList() {
                let params = {
                    userId: this.userId
                };
                operatePersonnelSelect(params).then(res => {
                    this.personneleList = res.data.data;
                });
            },
            // 获取工厂下拉数据
            getFactoryList() {
                let params = {
                    storehouseId: this.storehouseId
                };
                operateFactorySelect(params).then(res => {
                    this.factoryList = res.data.data;
                    this.selectFactory(this.factoryList);
                });
            },
            //选择工厂
            selectFactory(val){
                for(var i=0; i<val.length; i++){
                    if(val[i].id === this.unitId){
                        this.filter.operateFactory = val[i].id;
                        return;
                    }
                }
            },
            // 首次入库时间
            changeCreateDate1(filterDate) {
                this.firstDateList = filterDate.split("至");
                //返回开始时间、结束时间
                if (this.firstDateList.length) {
                    this.filter.firstStartTime = this.firstDateList[0];
                    this.filter.firstEndTime = this.firstDateList[1];
                }
            },
            // 操作时间
            changeCreateDate2(filterDate) {
                this.operateDataList = filterDate.split("至");
                //返回开始时间、结束时间
                if (this.operateDataList.length) {
                    this.filter.startOpAt = this.operateDataList[0];
                    this.filter.endOpAt = this.operateDataList[1];
                }
            },
            //操作人
            getManId(val){
                this.filter.operatePersonnel = val
            }
        },
        mounted() {
            //物料分类
            this.getMaterielClassifyList();
            //供应商
            this.getSupplierList();
            if (this.isInventory) {
                //物料款号
                // this.getMaterialNoList();
            } else {
                //变动类型
                this.getChangeTypeList();
                //操作人
                this.getPersonneleList();
                //操作工厂
                this.getFactoryList();
            }
            //发送数据给父组件,渲染父组件列表数据
            this.filterSubmit();
        }
    }
</script>

<style lang="scss" scoped>
    .filter {
        margin: 16px 0;
    }
</style>
