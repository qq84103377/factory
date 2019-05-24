<template>
    <div class="store-files-index">
        <page-title title="店铺档案">
            <div class="btns">
                <el-input @change="" style='width: 260px' v-model="form.keyword" placeholder="输入店铺编号/名称搜索"
                          icon="search">
                </el-input>
                <nf-button type="warning" @click="importStore.visible = true">从Excel导入</nf-button>
                <!--<nf-button class="mgl8" type="warning" @click="addStore">+ 新建店铺</nf-button>-->
            </div>
        </page-title>
        <div class="box-shadow custom-filter-form clearfix">
            <el-form :model="form" label-width="100px" style="margin-left:0px">
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
                       <area-select v-model="form.area" multiple placeholder="全部"></area-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="销售计划负责人">
                        <el-select v-model="form.leaders" multiple placeholder="全部" clearable filterable >
                            <el-option
                                    v-for="item in storeAttrs.leader.allAttrs"
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
                    <el-form-item label="停用状态">
                        <div>
                            <filter-check-group multiple  v-model="form.status">
                                <filter-check-item
                                        v-for="item in options.stopStatus"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                            </filter-check-group>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="24" :lg="18">
                    <div class="btn-group">
                        <el-button class="btn btn-reset" @click="reset">重置</el-button>
                        <el-button class="btn btn-submit" @click="getStoreList">筛选</el-button>
                    </div>
                </el-col>
            </el-form>
        </div>
        <div class="mgt16" v-loading="loading" style="min-height: 100px;">
            <el-table v-if="customStoreAttr.length"
                class="custom-table"
                @sort-change="sortChange"
                @row-click="goDetail"
                :row-class-name="tableRowClassName" empty-text="暂无数据"
                :data="tableData" border style="width: 100%">
                <el-table-column sortable prop="code" label="店铺编号" width="120">
                </el-table-column>
                <el-table-column sortable prop="name" label="店铺名称">
                </el-table-column>
                <el-table-column prop="levelName" label="店铺评级" width="120">
                </el-table-column>
                <el-table-column prop="brandsStr" label="品牌" width="120">
                </el-table-column>
                <el-table-column prop="leaderName" label="销售计划负责人" width="120">
                </el-table-column>
                <el-table-column prop="largeAreaName" label="大区" width="120">
                </el-table-column>
                <el-table-column prop="provinceName" label="所在地区" width="120">
                    <template slot-scope="scope">
                       <div v-if="scope.row.provinceName">{{scope.row.provinceName+
                           (scope.row.cityName?'/'+scope.row.cityName:'')+
                           (scope.row.areaName?''+scope.row.areaName:'')}}</div>

                    </template>
                </el-table-column>
                <el-table-column prop="address" label="详细地址" width="120">
                </el-table-column>
                <el-table-column prop="attr1sStr" :label="customStoreAttr[0]" width="120">
                </el-table-column>
                <el-table-column prop="attr2sStr" :label="customStoreAttr[1]" width="120">
                </el-table-column>
                <el-table-column prop="attr3sStr" :label="customStoreAttr[2]" width="120">
                </el-table-column>
                <el-table-column prop="status" label="停用状态" width="120">
                    <template slot-scope="scope">
                        <div>{{scope.row.status == 1?"未停用":"已停用"}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createAt" label="创建时间" width="160">
                </el-table-column>
                <!--<el-table-column fixed="right" label="操作" width="80" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span @click="$router.push({path:'/storeFiles/detail',query:{storeId:scope.row.id}})" class="blue pointer">查看详情</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
            </el-table>
            <div v-if="customStoreAttr.length" class="text-right mgt8">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="form.pageNum" :page-size="form.pageSize"
                               layout="total, prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>

        <import-dialog title="从Excel导入店铺" :visible.sync="importStore.visible" :loading="importStore.loading" templateText="下载样表文件"
                       @confirm="confirmImport" @downloadTemplate="downloadTemplate"></import-dialog>
        <!--导入结果弹出框-->
        <el-dialog
                title="导出结果反馈"
                :visible.sync="importStore.resultVisible"
                custom-class="custom-dialog import-result"
                :show-close="false"
                @close="resultVisible = false">
            <div class="text-center">
                <!--v-if="importStore.failCount>0"-->
                <p>
                    <icon class="mgr5" w="16" h="16" type="icon-check-circle"></icon>
                    <span>成功导入{{importStore.successCount}}个店铺</span>
                </p>
                <p v-if="importStore.failCount>0" class="mgt20">
                    <icon class="mgr5" style="margin-top: -2px;" w="16" h="16" type="icon-close-circle"></icon>
                    <span>导入失败{{importStore.failCount}}个店铺</span>
                </p>
                <p v-if="importStore.failCount>0" class="mgt26"><span @click="exportErrorExcel" class="pointer blue">下载导入失败列表</span></p>
                <p class="gray fs12 mgt12">可能失败原因：名称没填、编号、名称已存在等，请仔细核对导入表格</p>
            </div>
            <div slot="footer" class="text-center">
                <el-button  type="primary" @click="importStore.resultVisible = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getStoreAttrs,importStoreExcel,exportStoreExcelTemplate,exportErrorExcel,getStoreList} from '@/api/goodsPlan.js'
    import PageTitle from "@/components/Common/page-title.vue";
    import FilterCheckGroup from "@/components/order/WorkOrders/filter-check-group.vue";
    import FilterCheckItem from "@/components/order/WorkOrders/filter-check-item.vue";
    import ImportDialog from "@/components/Common/importDialog.vue";
    import AreaSelect from "../Common/custom-select/areaSelect";

    export default {
        name:'storeFilesIndex',
        data() {
            return {
                form:{
                    keyword:'',
                    status:[1],
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    levels:[],
                    largeAreas:[],
                    leaders:[],
                    brands:[],
                    attr1s:[],
                    attr2s:[],
                    attr3s:[],
                    area:[],
                    pageSize:20,
                    pageNum:1,
                    sortBy:'',
                    sortType:''
                },
                customStoreAttr:[],
                options:{
                    stopStatus:[{label:'未停用',value:1},{label:'已停用',value:0}],
                },
                total: 0,
                tableData: [],
                // 导入店铺相关参数
                importStore:{
                    importId:'', //
                    visible:false, //导入弹出框是否可见
                    loading:false, // 是否导入中
                    resultVisible:false, //导入结果弹出框是否可见
                    failCount:'', //导入失败条数
                    successCount:'', //导入成功条数
                },
                //店铺需要用到的熟悉及其下拉
                storeAttrs:{
                    attr1:{},
                    attr2:{},
                    attr3:{},
                    brand:{},
                    largeArea:{},
                    leader:{},
                    level:{},
                },
            }
        },

        components: {
            AreaSelect,
            PageTitle,
            FilterCheckGroup,
            FilterCheckItem,
            ImportDialog
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        watch:{
            'form.area'(val){
                console.log(val)
                this.form.provinceId = val[0]?val[0]:''
                this.form.cityId = val[1]?val[1]:''
                this.form.areaId = val[2]?val[2]:''
            }
        },
        methods: {
            reset(){
                this.form = {
                    keyword:'',
                    status:[1],
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    levels:[],
                    largeAreas:[],
                    leaders:[],
                    brands:[],
                    attr1s:[],
                    attr2s:[],
                    attr3s:[],
                    area:[],
                    pageSize:20,
                    pageNum:1,
                    sortBy:'',
                    sortType:''
                }
                this.getStoreList()
            },
            handleCurrentChange(page) {
                this.form.pageNum = page;
                this.getStoreList()
            },
            // addStore(){
            //     console.log("新建店铺")
            // },
            // 导入店铺
            confirmImport(file){
                let form = new FormData();
                // 文件对象
                form.append("file", file);
                // 其他参数
                form.append("unitId", this.unitId);
                form.append("userId", this.userId);
                form.append("bossUnitId", this.bossUnitId);
                this.importStore.loading = true
                importStoreExcel(form).then(res =>{
                    this.importStore.loading = false
                    this.importStore.visible = false
                    if(res.data.code ===0){
                        this.importStore.importId = res.data.data.importId
                        this.importStore.successCount = res.data.data.successCount
                        this.importStore.failCount = res.data.data.failCount
                        this.importStore.resultVisible = true
                        this.getStoreList()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //下载导入模板
            downloadTemplate(){
                let params ={
                    bossUnitId:this.bossUnitId
                }
                exportStoreExcelTemplate(params).then(res =>{
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','样表文件'+'.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            //导出 导入失败的列表
            exportErrorExcel(){
                let params ={
                    importId:this.importStore.importId
                }
                exportErrorExcel(params).then(res =>{
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','导入失败列表'+'.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
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
            // 获取店铺列表
            getStoreList(){
                let params = {
                    ...this.form,
                    bossUnitId:this.bossUnitId,
                    unitId:this.unitId,
                }
                // 前端是多选，但是后台全选的话要传""

                if(params.status.length==1){
                    params.status = params.status[0]
                } else {
                    params.status = ''
                }
                this.loading = true
                getStoreList(params).then(res =>{
                    this.loading = false
                    if(res.data.code ===0){
                        this.tableData = res.data.data.datas
                        this.total = res.data.data.totalCount
                    }
                })
            },
            // 是否变灰行
            tableRowClassName(row,index){
                if(row.status == 0){
                    return 'gray'
                }
                return ''
            },
            // 排序改变
            sortChange(obj){
                this.form.sortBy = obj.prop?obj.prop:''
                this.form.sortType = obj.order === 'ascending'?0:1
                console.log(this.form.sortBy,this.form.sortType)
                this.getStoreList()
            },
            // 跳转到详情页
            goDetail(row){
                this.$router.push({path:'/storeFiles/detail',query:{storeId:row.id}})
            }
        },
        created() {
            this.getStoreAttrs()
            this.getStoreList()

        },
    }
</script>

<style lang="scss" scoped>


</style>
<style lang="scss">
    .store-files-index{
        tr{
            cursor: pointer;
        }
        .custom-dialog.import-result.el-dialog--small{
                width: 450px;
        }
    }
</style>

