<template>
    <div class="outside-filter">
        <div class="box-shadow custom-filter-form">
            <el-form style="margin-left: -25px" :model="filterSelected" label-width="100px">
                <el-row type="flex" justify="space-between" style="flex-wrap: wrap">
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="厂商评级">
                            <el-select
                                    v-model="filterSelected.factoryRateIds"
                                    placeholder="请选择"
                                    multiple
                                    clearable
                                    filterable
                                    @change="filterDataChange">
                                <el-option
                                        v-for="item in selectData.factoryRates"
                                        :key="item.id"
                                        :label="item.attributeValue"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="品牌">
                            <el-select
                                    v-model="filterSelected.attrIds"
                                    placeholder="请选择"
                                    multiple
                                    clearable
                                    filterable
                                    @change="filterDataChange">
                                <el-option
                                        v-for="item in selectData.brand"
                                        :key="item.id"
                                        :label="item.attributeValue"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="isDocumentReview?6:12">
                        <el-form-item label="停用状态">
                            <filter-check-group multiple v-model="filterSelected.statuses">
                                <filter-check-item
                                        v-for="item in selectData.statuses"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="!isDocumentReview" :xs="18" :sm="18" :md="18" :lg="12">
                        <el-form-item label="审核状态">
                            <filter-check-group multiple v-model="filterSelected.reviewStatusList">
                                <filter-check-item
                                        v-for="item in selectData.reviewStatusList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="6" :lg="6">
                        <div class="btn-group text-right">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        getFacCommonAttrs,
    } from '@/api/api';
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group'
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    export default {
        name: "outside-filter",
        props:['filterSelected','isDocumentReview'],
        model:{
            prop: 'filterSelected',
            event: 'filterSelectedChange'
        },
        components:{
            FilterCheckGroup,
            FilterCheckItem
        },
        data(){
            return{
                selectData:{
                    factoryRates:[],
                    brand:[],
                    statuses:[
                        {
                            value: 0,
                            label: '未停用'
                        },{
                            value: 1,
                            label: '已停用'
                        }
                    ],
                    reviewStatusList:[
                        {
                            value: 0,
                            label: '草稿'
                        },{
                            value: 1,
                            label: '待审核'
                        },{
                            value: 2,
                            label: '已通过'
                        },{
                            value: 3,
                            label: '已驳回'
                        },{
                            value: 4,
                            label: '反审待批准'
                        }
                    ],
                }
            }
        },
        computed:{
            userId(){
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            }
        },
        methods:{
            //获取下拉列表值
            getCommonInfoAttr(type, key) {
                let paramsCommonMsg = {
                    type: type,
                    userId: this.userId
                };
                getFacCommonAttrs(paramsCommonMsg).then(res => {
                    if(res.data.code === 0){
                        this.selectData[key] = res.data.data[key];
                        console.log(this.selectData);
                    }
                });
            },
            //重置
            reset() {
                this.$emit('reset');
                this.filterSelected.factoryRateIds = [];
                this.filterSelected.attrIds = [];
            },
            //筛选
            submit() {
                this.$emit('filterData');
            },
            //筛选区值改变时触发
            filterDataChange(){
                this.$emit('filterSelectedChange', this.filterSelected);
            },
        },
        created(){
            this.getCommonInfoAttr("factoryRate", "factoryRates");
            this.getCommonInfoAttr("brand", "brand");
        },
    }
</script>

<style lang="scss" scoped>
.outside-filter{
    margin-bottom: 10px;
}
</style>
