<template>
    <div class="supplier-list">
        <!--头部begin-->
        <page-title title="物料供应商" bg>
            <div class="search-wrap">
                <el-input
                        placeholder="请输入名称/编号/电话搜索"
                        @input="searchListShow"
                        v-model.trim="input1"
                        icon="search">
                </el-input>
                <ul class="search-ul" v-show="codeSearchShow">
                    <li v-for="(item,index) in searchList" @click="searchTypeClick(index)" :key="index"
                        class="search-list">
                        {{item.value}}
                    </li>
                </ul>
                <nf-button @click.native="dialogVisibleExcel = true">
                    从Excel导入
                </nf-button>
                <nf-button type="warning" svg="icon-btn-add" @click="addSupplierClick()">新建供应商
                </nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <!--表格begin-->
        <div class="supplier-table" id="table">
            <el-table
                    :data="listInfo"
                    stripe
                    border
                    empty-text="暂无物料供应商数据"
                    @row-click="getDetaile"
            >
                <el-table-column
                        prop="name"
                        label="供应商名称"
                        sortable
                        min-width="10%">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="供应商编号"
                        sortable
                        min-width="12%">
                </el-table-column>
                <el-table-column
                prop="contacts"
                label="联系人"
                min-width="11%">
                </el-table-column>
                <el-table-column
                        prop="mobilePhone"
                        label=" 联系电话"
                        min-width="12%">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        min-width="25%">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="备注信息"
                        min-width="15%"
                >
                </el-table-column>
                <el-table-column
                        prop="dateCreated"
                        label="创建时间"
                        sortable
                        min-width="15%">
                </el-table-column>
            </el-table>

        </div>
        <!--表格end-->
        <!--分页begin-->
        <div class="supplier-page">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="listSum"
                    layout="total, prev, pager, next">
            </el-pagination>
        </div>
        <!--分页end-->
        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add v-if="addSupplierShow" type="add" @hiddenWindow="cancelAdd" @hideCover="cancelAdd"
                 @update="getList"></add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="cancelAdd">
            </div>
        </transition>
        <!--导入excel组件-->
        <UploadExcelComponent
                :excelStatic="excelStatic"
                :excelDemoUrl="excelDemoUrl"
                @uploadFinish="uploadFinish"
                @commit="commitExcelData"
                @reset="closeUploadComponent"
                :dialogVisibleExcel="dialogVisibleExcel">
        </UploadExcelComponent>
    </div>
</template>

<script>
    import {importMaterialSupExcel} from "@/api/api";
    import {materialSupList} from "@/api";
    import add from './add';
    import UploadExcelComponent from '@/components/Common/uploadExcel.vue';
    export default {
        name: "index",
        components: {
            add,
            UploadExcelComponent
        },
        data() {
            return {
                input1: '',
                codeSearchShow: false,  //搜索
                addSupplierShow: false, //侧滑栏
                dialogVisibleExcel: false,//导入excel弹窗
                searchList: [
                    {value: '搜索供应商名称'},
                    {value: '搜索供应商编号'},
                    {value: '搜索供应商联系电话或固话'}
                ],
                listInfo: [],
                searchParams: {},
                currentPage: 1,     //当前页
                pageSize: 20,       //每页显示数
                listSum: 0,          //总条数
                factoryId: '',       //工厂id
                excelStatic:{
                    loading: false,
                    excelData: true,
                    excelDataErr:0,
                    excelDataSucc:0,
                },
                excelDemoUrl: 'https://image3.myjuniu.com/bd5324d510034567bd1d353602183313_dev_28fcb3623242b7867326d8e06b71c3c4..xlsx?attname=物料供应商导入模板.xlsx',
            }
        },
        methods: {
            //提交excel
            commitExcelData(form){
                if(form){
                    this.excelStatic.loading = true;
                    importMaterialSupExcel(form).then(res =>{
                        if(res.data.code === 0){
                            this.excelStatic.loading = false;
                            this.excelStatic.excelData = false;
                            this.excelStatic.excelDataErr = res.data.faithNum;
                            this.excelStatic.excelDataSucc = res.data.successNum;
                            this.uploadFinish();
                        }else {
                            this.excelStatic.loading = false;
                            this.$message.error(res.data.message);
                        }
                    })
                }
            },
            //隐藏导入excel组件
            closeUploadComponent(){
                this.excelStatic.loading = false;
                this.excelStatic.excelData = true;
                this.excelStatic.excelDataErr = 0;
                this.excelStatic.excelDataSucc = 0;
                this.dialogVisibleExcel = false
            },
            uploadFinish() {
                this.getList();
            },
            //展示新增供应商组件
            addSupplierClick() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.supplier.add") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.addSupplierShow = true;
            },
            //展示搜索列表
            searchListShow() {
                if (this.input1) {
                    this.codeSearchShow = true;
                } else {
                    this.codeSearchShow = false;
                    this.getList();
                }
            },
            //跳转到详情页
            getDetaile(row) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.supplier.list") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                // console.log(row);
                this.$router.push({
                    path: `/materialSupplier/info/${row.id}`
                })
            },
            //关闭侧滑栏
            cancelAdd() {
                this.addSupplierShow = false;
            },
            //初始化数据
            getList() {
                let params = {      //初始搜索参数
                    factoryId: this.factoryId,
                    pageSize: this.pageSize,
                    pageNo: 1
                };
                materialSupList(params).then(res => {
                    // console.log(res);
                    if (res.data.code === 0) {
                        this.listInfo = res.data.data.list;
                        this.listSum = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //分页切换
            handleCurrentChange(val) {
                //val 当前页
                let params = {
                    factoryId: this.factoryId,
                    pageSize: this.pageSize,
                    pageNo: val,
                };
                //获取之前先清空之前的数据
                this.listInfo = [];
                materialSupList(params).then(res => {
                    if (res.data.code === 0) {
                        this.listInfo = res.data.data.list;
                        this.listSum = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //搜索参数
            searchTypeClick(index) {
                let params = {
                    factoryId: this.factoryId,
                    pageSize: this.pageSize,
                    pageNo: 1
                };
                if (index === 0) {
                    params.name = this.input1;
                } else if (index === 1) {
                    params.code = this.input1;
                } else if (index === 2) {
                    params.phone = this.input1;
                }
                this.remoteSearch(params);
                this.codeSearchShow = false;
            },
            //搜索
            remoteSearch(params) {
                this.listInfo = [];
                materialSupList(params).then(res => {
                    if (res.data.code === 0) {
                        this.listInfo = res.data.data.list;
                        this.listSum = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            }
        },
        mounted() {
            this.factoryId = JSON.parse(sessionStorage.getItem("last_login")).id;
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .supplier-list {
        .search-wrap {
            position: relative;
        }
        .el-input {
            width: 320px;
            /*margin-right: 8px;*/
        }
        .search-ul {
            position: absolute;
            z-Index: 2;
            height: 120px;
            width: 240px;
            background-color: #fff;
            border: solid 1px #dce0e6;
            box-sizing: border-box;
        }
        .search-ul li {
            width: 240px;
            height: 33.33%;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: start;
            justify-content: flex-start;
            -ms-flex-align: center;
            align-items: center;
            padding-left: 12px;
            box-sizing: border-box;
            cursor: pointer;
        }
        .supplier-table .el-table {
            width: 100%;
        }
        .supplier-page {
            padding-right: 30px;
            margin: 20px 0;
            text-align: right;
        }
    }
</style>
<style lang="scss">
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .detail-block {
        .group-name {
            padding: 12px 0 8px;
        }
    }
</style>
