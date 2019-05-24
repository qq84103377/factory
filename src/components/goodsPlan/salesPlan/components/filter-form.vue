<!--销售计划详情的筛选和添加门店的筛选-->
<template>
    <div class="custom-filter-form clearfix mgt8" style="padding: 12px 12px 6px;background:rgb(238, 240, 246); border: 1px solid rgb(223, 228, 236);">
        <el-form :model="form" label-width="100px" style="margin-left:-35px;" >
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="品牌">
                    <el-select v-model="form.brands" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.brand.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="大区">
                    <el-select v-model="form.largeAreas" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.largeArea.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="所在地区">
                    <area-select v-model="form.area" placeholder="全部"></area-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="店铺名称">
                    <el-input v-model="form.keyword" placeholder="全部"></el-input>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="店铺评级">
                    <el-select v-model="form.levels" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.level.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item :label="customStoreAttr[0]">
                    <el-select v-model="form.attr1s" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.attr1.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item :label="customStoreAttr[1]">
                    <el-select v-model="form.attr2s" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.attr2.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item :label="customStoreAttr[2]">
                    <el-select v-model="form.attr3s" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.attr3.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item label="负责人">
                    <el-select :disabled="!isLeader"  v-model="form.leaders" multiple placeholder="全部" clearable filterable >
                        <el-option
                                v-for="item in storeAttrs.leader.allAttrs"
                                :key="item.attrId"
                                :label="item.attrVal"
                                :value="item.attrId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col v-if="hasStatus" :xs="16" :sm="16" :md="16" :lg="12">
                <el-form-item label="审核状态">
                    <div>
                        <filter-check-group multiple v-model="form.status">
                            <filter-check-item
                                    v-for="item in statusOptions"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </div>
                </el-form-item>
            </el-col>
            <el-col :sm="hasStatus?8:12" :md="hasStatus?8:24" :lg="hasStatus?6:18">
                <div class="btn-group">
                    <el-button class="btn btn-reset" @click="reset">重置</el-button>
                    <el-button class="btn btn-submit" @click="filter">筛选</el-button>
                </div>
            </el-col>
        </el-form>
    </div>
</template>

<script>
    import { getStoreAttrs } from '@/api/goodsPlan.js'

    import FilterCheckGroup from "@/components/order/WorkOrders/filter-check-group.vue";
    import FilterCheckItem from "@/components/order/WorkOrders/filter-check-item.vue";
    import AreaSelect from "@/components/Common/custom-select/areaSelect.vue";
    export default {
        // 是否有审核状态
        //是否是总负责人
        props: ['hasStatus','isLeader'],
        components: {
            AreaSelect,
            FilterCheckGroup,
            FilterCheckItem,
        },
        data() {
            return {
                form:{
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    keyword:'',
                    status:[],
                    levels:[],
                    largeAreas:[],
                    leaders:[],
                    brands:[],
                    attr1s:[],
                    attr2s:[],
                    attr3s:[],
                    area:[],
                    pageSize:20,
                    pageNum:1
                },
                customStoreAttr:[],
                //店铺需要用到的熟悉及其下拉
                storeAttrs:{
                    attr1:{},
                    attr2:{},
                    attr3:{},
                    brand:{},
                    largeArea:{},
                    keyword:'',
                    leader:{},
                    level:{},
                },
                statusOptions:[
                    {label:'未提报',value:'NOT_REPORT'},
                    {label:'待审核',value:'WAIT_AUDIT'},
                    {label:'已驳回',value:'REJECTED'},
                    {label:'已通过',value:'PASS'}
                ]

            }
        },
        watch:{
            'form.area'(val){
                console.log(val)
                this.form.provinceId = val[0]?val[0]:''
                this.form.cityId = val[1]?val[1]:''
                this.form.areaId = val[2]?val[2]:''
            },
            isLeader(val){
                if(!this.isLeader){
                    this.form.leaders = [this.userId]
                }
            }
        },
        computed: {
            unitId() {
                return  JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        methods: {
            reset(){
                this.form = {
                    status:[],
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    keyword:'',
                    levels:[],
                    largeAreas:[],
                    leaders:[],
                    brands:[],
                    attr1s:[],
                    attr2s:[],
                    attr3s:[],
                    area:[],
                    pageSize:20,
                    pageNum:1
                }
                if(!this.isLeader){
                    this.form.leaders = [this.userId]
                }
                this.$emit('filter',this.form)
            },
            // 筛选
            filter(){
                this.$emit('filter',this.form)
            },
            // 获取店铺相关字段库属性及其下拉数据
            getStoreAttrs(){
                let params ={
                    bossUnitId:this.bossUnitId
                }
                getStoreAttrs(params).then(res =>{
                    if(res.data.code ===0){
                        this.storeAttrs = res.data.data
                        this.customStoreAttr = [this.storeAttrs.attr1.typeName,this.storeAttrs.attr2.typeName,this.storeAttrs.attr3.typeName]
                    }
                })
            },
        },
        created() {
            this.getStoreAttrs()
        },
    }
</script>

<style lang="scss">
    .set-sales-target {
        .el-dialog--small {
            width: 1132px;
        }
        .el-dialog--small {
            width: 742px;
        }
        .el-select{
            width: 100%;
        }
        .no-padding .v-select .el-input__inner{
            background-color: #FFF9ED;
            border: none;
        }
        td.no-padding,
        td.no-padding:hover{
            background-color: #FFF9ED !important;
        }
    }

</style>


<style lang="scss" scoped>
    .set-sales-target {
        .header{
            display: flex;
            justify-content: space-between;
        }
    }

</style>
