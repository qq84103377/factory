<template>
    <div class="system-filter">
        <div class="box-shadow custom-filter-form">
            <el-form style="margin-left: -25px" :model="filterFormData" label-width="80px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品款号">
                            <goods-select
                                    v-model="filterFormData.styleIds"
                                    :multiple="true"
                                    systemFlag="true">
                            </goods-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品属性">
                            <goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset"></goods-attr-dialog>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="创建人">
                            <workerLeader  v-model="filterFormData.creatorIds" :isSystem="true" placeholder="请选择"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="创建组织">
                            <el-select
                                    v-model="filterFormData.unitIds"
                                    filterable
                                    multiple
                                    clearable
                                    placeholder="请选择或搜索">
                                <el-option v-for="item in organizeList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="创建日期">
                            <el-date-picker
                                    v-model="dateRange"
                                    @change="changeCreateDate"
                                    type="daterange"
                                    placeholder="选择日期范围"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="18">
                        <div class="btn-group">
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
    import GoodsDialog from '@/components/order/createChild/goods-dialog.vue';
    import {
        getUnitListByUserId,
    } from "@/api";
    export default {
        name: "system-filter",
        components:{
            GoodsDialog,
        },
        data(){
            return{
                isReset: false,             //是否重置
                filterFormData:{            //筛选区已选数据
                    styleIds: [],           //商品款号
                    categorys: [],          //商品属性
                    attrIds: [],
                    creatorIds: [],       //创建人
                    unitIds: [],           //创建组织
                    createDateStart: '',          //开始时间
                    createDataEnd:'',             //结束时间
                },
                dateRange: '',              //创建日期
                organizeList: [],           //创建组织下拉
            }
        },
        computed:{
            userId(){
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
        },
        methods:{
            //获取创建组织下拉列表数据
            getUnitListByUserId() {
                let params = {
                    userId: this.userId,
                    token: '',
                    facId: this.facId,
                    keyword: ''
                };
                getUnitListByUserId(params).then(res => {
                    if(res.data.code === 0){
                        this.organizeList = res.data.unitList;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 选取制单日期
            changeCreateDate(filterDate) {
                this.dateRange = filterDate.split("至");
                //返回开始时间、结束时间
                if (this.dateRange.length) {
                    this.filterFormData.createDateStart = this.dateRange[0];
                    this.filterFormData.createDataEnd = this.dateRange[1];
                }
            },
            // 获取弹窗的属性
            getAllAttrId(val,categorys) {
                this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined     //品类
                this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined     //品类以外的属性集合
            },
            //重置
            reset() {
                this.filterFormData = {
                    styleIds: [],
                    categorys: [],
                    attrIds: [],
                    creatorIds: [],
                    unitIds: [],
                    createDateStart: '',
                    createDataEnd:'',
                };
                this.dateRange = '';
                this.isReset = true;
            },
            //筛选
            submit() {
                this.isReset = false;
                this.$emit('filterData', this.filterFormData);
            },
        },
        created(){
            this.getUnitListByUserId();
        },
    }
</script>

<style lang="scss" scoped>
    .system-filter{
        margin-bottom: 10px;
    }
</style>