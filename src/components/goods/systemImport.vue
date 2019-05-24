<template>
    <div class="system-import">
        <!--头部begin-->
        <page-title title="从体系导入" bg>
            <div class="search-wrap">
                <nf-button @click.native="handleCancel">取消</nf-button>
                <nf-button type="warning" @click.native="handleImportClick">导入</nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <!--筛选区begin-->
        <system-import-filter
                ref="filter"
                @filterData="getFilterData">
        </system-import-filter>
        <!--筛选区end-->
        <!--表格begin-->
        <div v-loading="loading" class="content" id="goods_content">
            <template>
                <el-table
                        class="custom-table"
                        :data="listInfo"
                        :border="true" style="width: 100%"
                        :default-sort="{prop: 'date', order: 'descending'}"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="styleNo" label="款号" sortable width="200">
                        <template slot-scope="scope">
                            <div class="style-content">
                                <img class="goods-picture" :src="scope.row.picture?scope.row.picture:$globalConfig.qiniu.baseDefaultUrl"
                                     @click.stop="imgList(scope.row)">
                                <span class="style_no">
                                    {{scope.row.styleNo}}
                                </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleName" label="名称" sortable width="150">
                    </el-table-column>
                    <el-table-column label="规格">
                        <template slot-scope="scope">
                            <ul>
                                <li>
                                    <span>颜色：</span>
                                    <span>{{scope.row.colorNames}}</span>
                                </li>
                                <li>
                                    <span>尺码：</span>
                                    <span>{{scope.row.sizeNames}}</span>
                                </li>
                                <li>
                                    <span>内长：</span>
                                    <span>{{scope.row.standardNames}}</span>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unitName" label="创建组织" width="150">
                    </el-table-column>
                    <el-table-column prop="createBy" label="创建人" width='130'>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable width='175'>
                    </el-table-column>
                    <el-table-column prop="opBy" label="最后更新人" width='130'>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后更新时间" width='175'>
                    </el-table-column>
                </el-table>
            </template>
        </div>
        <div class="page" v-if="totalNumber > 0">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="currentPage"
                           :page-size="pageSize"
                           layout="total, prev, pager, next"
                           :total="totalNumber">
            </el-pagination>
        </div>
        <!--表格end-->

        <!--导入弹窗begin-->
        <el-dialog
                title="选择档案导入范围"
                :modal-append-to-body="false"
                class="custom-dialog tip-dialog"
                :visible.sync="importVisible"
                size="tiny">
            <ul class="text-center">
                <li class="tip-text">
                    <el-radio class="radio" v-model="radio" label="1">导入当前页已选档案</el-radio>
                </li>
                <li class="tip-text">
                    <el-radio class="radio" v-model="radio" label="0">导入列表中所有档案</el-radio>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeImport">取 消</el-button>
                <el-button type="primary" @click="confirmImport">添 加</el-button>
            </div>
        </el-dialog>
        <!--导入弹窗end-->

        <!--//图片预览-->
        <imgPreview
                @dialogClose="centerDialogVisible=false"
                :centerDialogVisible="centerDialogVisible"
                :imgLists="imgLists"
                :imgIndex="imgIndex">
        </imgPreview>
    </div>
</template>

<script>
    import {
        commonStyleListNoUnit,
        commonStyleImport,
    } from "@/api/api";
    import systemImportFilter from '@/components/goods/systemImportFilter.vue';
    export default {
        name: "systemImport.vue",
        data(){
            return {
                loading:false,
                listInfo: [],               //表格数据
                importVisible: false,       //导入弹窗
                centerDialogVisible: false,//图片预览弹窗
                imgLists: [],               //图片集合
                imgIndex: 0,                //图片下标
                currentPage: 1,             //当前页
                pageSize: 20,               //每页条数
                totalNumber: 0,             //总条数
                sumPage: 0,                 //总页数
                lastPageNum: 0,             //最后一页的条数
                styleIds:[],                //勾选的商品款号id集合
                allSelectFlag: false,       //全选标识
                radio: "1",                 //1当前页，0全部
                filterDta: {},              // 筛选数据
            }
        },
        components:{
            systemImportFilter,
        },
        computed:{
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods:{
            //导入按钮
            handleImportClick(){
                //勾选了商品
                if(this.styleIds.length){
                    //总页数大于1（有分页） && 勾选了全选
                    if(this.sumPage > 1 && this.allSelectFlag){
                        //导入弹窗
                        this.importVisible = true
                    }else{
                        this.sumbitImportData();
                    }
                }else{
                    this.$message.error('请先勾选商品')
                }
            },
            //勾选
            handleSelectionChange(val) {
                this.styleIds = [];
                if(val.length){
                    val.forEach(item => {
                        this.styleIds.push(item.styleId);
                    });
                    this.allSelectFlag = this.judgeAllSelect(val);
                }
            },
            // 判断是否全选
            judgeAllSelect(val){
                //当前页是最后一页
                if(this.currentPage === this.sumPage){
                    // 勾选条数等于最后一页的条数
                    if(val.length === this.lastPageNum){
                        return true
                    }else{
                        return false
                    }
                }else{
                    // 勾选条数等于pageSize的条数
                    if(val.length === this.pageSize){
                        return true
                    }else{
                        return false
                    }
                }
            },
            //分页切换
            handleCurrentChange(val){
                this.currentPage = val;
                this.getTableData();
            },
            //提交导入数据
            sumbitImportData(){
                let filter = this.$refs.filter.filterFormData;
                let params = {
                    unitId: this.unitId,
                    userId: this.userId,
                    styleIds: this.styleIds,        // 商品款id集合
                    type: parseInt(this.radio),     // 1导入当前页 0导入所有
                    commonGoodsStyleQuery:{
                        ...filter
                    }
                };
                commonStyleImport(params).then(res => {
                    if(res.data.code === 0){
                        this.importVisible = false;
                        this.$message.success(res.data.msg);
                        this.getTableData();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 筛选数据
            getFilterData (val) {
                this.filterDta = val
                this.getTableData()
            },
            //获取表格数据
            getTableData() {
                this.isReset = false;
                let params = {};
                let paramsBase = {
                    unitId: this.unitId,            // 工厂体系id
                    pageNum: this.currentPage,      // 第几页
                    pageSize: this.pageSize,        // 每页条数
                };
                params = {
                    ...this.filterDta,
                    ...paramsBase
                }
                // if(val){
                //     params = {
                //         ...val,
                //         ...paramsBase
                //     };
                // }else{
                //     params = {
                //         styleIds: [],               // 商品款id
                //         categorys: [],              // 属性id
                //         attrIds: [],                // 属性id集合
                //         creatorIds: [],             // 创建者id
                //         unitIds: [],                // 组织id
                //         createDateStart: "",        // 创建开始时间
                //         createDataEnd: "",          // 创建结束时间
                //         ...paramsBase
                //     };
                // }
                this.loading = true;
                commonStyleListNoUnit(params).then(res => {
                    this.loading = false;
                    if(res.data.code === 0){
                        this.listInfo = res.data.data.list;
                        this.totalNumber = res.data.data.pagination.total;
                        this.sumPage = parseInt(this.totalNumber / this.pageSize) + 1;   //总页数
                        this.lastPageNum = this.totalNumber % this.pageSize;     //最后一页的条数
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //取消导入
            handleCancel(){
                this.$router.push("/goodsMangement");
            },
            //弹窗导入
            confirmImport(){
                this.sumbitImportData();
            },
            //关闭弹窗
            closeImport(){
                this.importVisible = false;
            },
            // 图片预览
            imgList(row) {
                this.imgIndex = 0;
                this.imgLists = row.pictureList;
                this.centerDialogVisible = true;
            },
        },
        created(){
            this.getTableData();
        },
    }
</script>

<style lang="scss" scoped>
    .system-import{
        .custom-table{
            .style-content{
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                .style_no{
                    margin-left: 12px;
                }
                .goods-picture{
                    height: 53px;
                    width: 53px;
                    border-radius: 4px;
                }
            }
        }
        .page{
            margin: 20px 0;
            text-align: right;
        }
        .tip-dialog{
            .text-center{
               .tip-text{
                   margin: 15px 0;
               }
            }
        }
    }
</style>
<style lang="scss">
    .system-import{
        .custom-dialog.tip-dialog{
            .el-dialog--tiny{
                width: 500px;
            }
            .el-dialog__body{
                padding:15px 30px;
            }
        }
        .tip-dialog{
            .el-dialog__header{
                border-bottom: 1px solid #e6eaf0;
            }
        }
    }
</style>