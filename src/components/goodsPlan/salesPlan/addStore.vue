<template>
    <div class="sales-add-store ">
        <page-title title="添加门店">
            <div class="btns">
                <nf-button fsize="12" @click="$router.go(-1)">取消</nf-button>
                <nf-button :loading="isSubmitting" class="mgl8" fsize="12" type="warning" @click="showCheckAllDialog">保存</nf-button>
            </div>
        </page-title>
        <div v-loading="loading" class="detail-content box-shadow mgt8">
            <!--筛选区域-->
            <filter-form  @filter="confirmFilter"  :hasStatus="false" :is-leader="true"></filter-form>
            <!--未添加到某个销售计划中的店铺-->
            <el-table
                    v-if="customStoreAttr.length"
                    @selection-change="handleSelectionChange"
                    class="custom-table mgt8"
                    :data="storeList" border
                    style="width: 100%">
                <el-table-column
                        fixed="left"
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column width="68"  prop="brandsStr" label="品牌">
                </el-table-column>
                <el-table-column width="68"  prop="largeAreaName" label="大区">
                </el-table-column>
                <el-table-column width="160"  prop="orderNo" label="所在地区">
                    <template slot-scope="scope">
                        <div v-if="scope.row.provinceName">{{scope.row.provinceName+
                            (scope.row.cityName?'/'+scope.row.cityName:'')+
                            (scope.row.areaName?''+scope.row.areaName:'')}}</div>

                    </template>
                </el-table-column>
                <el-table-column  prop="name" label="店铺名称">
                </el-table-column>
                <el-table-column width="80"  prop="levelName" label="店铺评级">
                </el-table-column>
                <el-table-column width="120"  prop="leaderName" label="销售计划负责人">
                </el-table-column>
                <el-table-column prop="attr1sStr" :label="customStoreAttr[0]" width="120">
                </el-table-column>
                <el-table-column prop="attr2sStr" :label="customStoreAttr[1]" width="120">
                </el-table-column>
                <el-table-column prop="attr3sStr" :label="customStoreAttr[2]" width="120">
                </el-table-column>
                <el-table-column width="100"  prop="planStart" label="计划开店时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.planStart?scope.row.planStart.slice(0,10):''}}</div>
                    </template>
                </el-table-column>
                <el-table-column width="100"  prop="planEnd" label="计划关店时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.planEnd?scope.row.planEnd.slice(0,10):''}}</div>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="customStoreAttr.length" class="text-right mgt8">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="form.pageNum" :page-size="form.pageSize"
                               layout="total, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <!--删除确认框-->
        <el-dialog :modal-append-to-body="false"  class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除该店铺？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="deleteStore">确 认</el-button>
            </div>
        </el-dialog>
        <!--全选弹出框-->
        <check-all-dialog v-model="checkAll.value"
                          :visible.sync="checkAll.visible"
                          title="选择添加店铺范围"
                          current-page-text="添加当前页已选店铺"
                          all-page-text="添加列表中所有店铺"
                          @confirm="save"></check-all-dialog>
    </div>
</template>

<script>
    import {getStoreAttrs,getStoreList,addStoreToSalesPlan} from '@/api/goodsPlan.js'
    import FilterForm from "./components/filter-form";

    export default {
        name:'storeFilesDetail',
        data() {
            return {
                loading:false,
                isSubmitting:false,
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
                checkAll:{
                    visible:false,
                    value:'allPage', //currentPage当前页  allPage 所有页
                    filterParams:{},
                    selection:[] ,// 表格选中的行
                },
                isDeleteVisible:false,
                customStoreAttr:[],
                storeList:[],
                total: 0,
            }
        },
        components: {
            FilterForm,
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            salesPlanId(){
                return this.$route.query.salesPlanId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        methods: {
            // 点击筛选
            confirmFilter(filterParams){
                this.form = filterParams
                this.getStoreList()
            },
            // 获取店铺列表
            async getStoreList(){
                let params = {
                    ...this.form,
                    bossUnitId:this.bossUnitId,
                    unitId:this.unitId,
                    planId:this.salesPlanId
                }
                // 只能有启用的店铺
                params.status = 1
                params.sortBy = ''
                params.sortType = ''
                await getStoreList(params).then(res =>{
                    this.loading = false
                    if(res.data.code ===0){
                        // 成功获取列表，将获取列表的参数保存起来
                        this.checkAll.filterParams = JSON.parse(JSON.stringify(params))

                        this.storeList = res.data.data.datas
                        this.total = res.data.data.totalCount
                    }
                })
            },
            // 点击页码
            handleCurrentChange(page) {
                this.form.pageNum = page;
                // this.purchaseList()
            },
            // 获取店铺相关字段库属性及其下拉数据
            async getStoreAttrs(){
                let params ={
                    bossUnitId:this.bossUnitId
                }
                this.loading = true
                await getStoreAttrs(params).then(res =>{
                    if(res.data.code ===0){
                        let storeAttrs = res.data.data
                        this.customStoreAttr = [storeAttrs.attr1.typeName,storeAttrs.attr2.typeName,storeAttrs.attr3.typeName]
                    }
                })
            },
            // 判断是否显示全选弹出框
            showCheckAllDialog(){
                if(this.checkAll.selection.length === this.storeList.length){
                    this.checkAll.visible = true
                } else {
                    this.save()
                }
            },
            // 保存选中的店铺
            save(checkAllValue){
                let storeIds = this.checkAll.selection.map(item =>{
                    return item.id
                })
                let params = {
                    planId:this.salesPlanId,
                    storeIds:storeIds
                }
                if(this.isCheckAll&&this.checkAll.value ==='allPage'){
                    params.storeParams = this.checkAll.filterParams
                    params.status =1
                }
                console.log(params,8989)
                this.isSubmitting = true
                addStoreToSalesPlan(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code === 0){
                        this.$message.success('添加成功')
                        this.$router.go(-1)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
                return
            },
            // 表格行选中状态发生改变
            handleSelectionChange(selection){
                this.checkAll.selection = selection
                console.log(selection)
            }
        },
        async created() {
            await this.getStoreAttrs()
            await this.getStoreList()
        },
    }
</script>

<style lang="scss" scoped>
    .sales-add-store{
        .detail-content{
            padding: 16px 24px 24px 24px;
        }
    }
</style>
<style lang="scss">
    .sales-add-store{
        .el-dialog--tiny{
            width: 365px;
        }
    }
</style>

