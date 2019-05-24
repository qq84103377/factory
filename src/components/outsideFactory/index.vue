<template>
    <div class="outside-list">
        <!--头部begin-->
        <page-title title="加工厂商档案" bg>
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
                <nf-button type="warning" svg="icon-btn-add" @click="handleAddClick()">新建加工厂商
                </nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <!--筛选区begin-->
        <outside-filter
                v-model="filterSelected"
                @reset="filterReset"
                @filterData="filterData">
        </outside-filter>
        <!--筛选区end-->
        <!--表格begin-->
        <div class="outside-table" id="table" v-loading="isLoadiing">
            <outside-table :facPrdOrderList="listInfo"></outside-table>
        </div>
        <!--表格end-->
        <!--分页begin-->
        <div class="outside-page">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    :total="listSum"
                    layout="total, prev, pager, next">
            </el-pagination>
        </div>
        <!--分页end-->
        <!--新增和编辑外发厂档案，通用组件-->
        <transition name="right-move">
            <add style="z-index: 1000" v-if="addModuleShow" type="add" @hiddenWindow="cancelAdd" @hideCover="cancelAdd"
                 @update="getList"></add>
        </transition>
        <transition name="opcity">
            <div style="z-index: 100" class="cover" v-if="addModuleShow" @click="cancelAdd">
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
    import outsideTable from './table'
    import {importOutsideExcel} from "@/api/api";
    import { outsideFactoryList } from "@/api";
    import add from './add';
    import outsideFilter from './outside-filter';
    import UploadExcelComponent from '@/components/Common/uploadExcel.vue';
    export default {
        name: "index",
        components: {
            outsideTable,
            add,
            outsideFilter,
            UploadExcelComponent,
        },
        data() {
            return {
                input1: '',
                codeSearchShow: false,  //搜索
                addModuleShow: false,   //侧滑栏
                searchList: [
                    {value: '搜索外发厂名称'},
                    {value: '搜索外发厂编号'},
                    {value: '搜索外发厂手机号码或固话'}
                ],
                listInfo: [],
                searchParams: {},
                currentPage: 1,     //当前页
                pageSize: 20,       //每页显示数
                listSum: 0,         //总条数
                searchIndex: '',    //搜索类型  0:名称  1:编号  2:电话
                filterSelected:{              //筛选区已选数据
                    factoryRateIds: [],
                    attrIds: [],
                    statuses: [0],
                    reviewStatusList:[0,1,2,3,4]
                },
                dialogVisibleExcel: false,//导入excel弹窗
                excelStatic:{
                    loading: false,
                    excelData: true,
                    excelDataErr:0,
                    excelDataSucc:0,
                },
                excelDemoUrl: 'https://image3.myjuniu.com/ccacba44c74241be967209307489652b_dev_3f05037906aec0bc75f9f94db1f0696f..xlsx?attname=加工厂商导入模板.xlsx',
                isLoadiing:false
            }
        },
        computed:{
            factoryId(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            //提交excel
            commitExcelData(form){
                if(form){
                    this.excelStatic.loading = true;
                    importOutsideExcel(form).then(res =>{
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
                this.getData(1);
            },
            //重置
            filterReset(){
                this.filterSelected.factoryRateIds = [];
                this.filterSelected.attrIds = [];
                this.filterSelected.statuses = [0];
                this.filterSelected.reviewStatusList = [0,1,2,3,4];

                this.input1 = '';
            },

            //展示新增外发厂组件
            handleAddClick() {
                // 权限
                if(!this.powerJudgement.permissions("fac.outFac.add")){
                    return
                }
                this.addModuleShow = true;
            },
            //展示搜索列表
            searchListShow() {
                if (this.input1) {
                    this.codeSearchShow = true;
                } else {
                    this.codeSearchShow = false;
                    this.currentPage = 1;
                    this.searchIndex = '';
                    this.getList();
                }
            },
            //关闭侧滑栏
            cancelAdd() {
                this.addModuleShow = false;
            },

            //获取列表数据
            getData(page){
                let params = {
                    factoryId: this.factoryId,
                    pageSize: this.pageSize,
                    pageNo: page,
                    factoryRateIds: this.filterSelected.factoryRateIds,
                    attrIds: this.filterSelected.attrIds,
                    reviewStatusList:this.filterSelected.reviewStatusList,
                    userId: this.userId
                };

                //停用状态参数
                let statLength = this.filterSelected.statuses.length;
                //statuses为[0,1]的时候表示全选，此时不用传参
                if(statLength === 1){
                    params.stopuse = this.filterSelected.statuses[0];
                }

                //搜索的参数
                if (this.searchIndex === 0) {
                    params.name = this.input1;
                } else if (this.searchIndex === 1) {
                    params.code = this.input1;
                } else if (this.searchIndex === 2) {
                    params.phone = this.input1;
                }

                this.listInfo = [];
                this.isLoadiing = true
                outsideFactoryList(params).then(res => {
                    this.isLoadiing = false
                    if (res.data.code === 0) {
                        let data = res.data.data.list;
                        data.forEach(item => {
                            //封装品牌的显示格式
                            let brandArr = [];
                            item.attrIds.forEach(v => {
                                brandArr.push(v.name);
                            });
                            item.attrName = brandArr.join(',');
                            //封装厂商评级
                            let f_name = [];
                            item.factoryRateName ='';
                            if(item.factoryRateIds!=null){
                                item.factoryRateIds.forEach(vs =>{
                                    f_name.push(vs.name);
                                });
                                item.factoryRateName = f_name.join(',');
                            }
                            //封装停用状态
                            if(item.stopuse){
                                item.statuses = '已停用'
                            }else{
                                item.statuses = '未停用'
                            }
                        });
                        // console.log("表格的数据是什么：",data);

                        this.listInfo = data;
                        this.listSum = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },

            //初始化数据
            getList() {
                this.getData(1);
            },
            //分页切换
            handleCurrentChange(page) {
                this.getData(page);
            },
            //搜索
            searchTypeClick(index) {
                this.searchIndex = index;
                this.getData(1);
                this.codeSearchShow = false;
            },
            //筛选
            filterData(){
                this.getData(1);
            },
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style lang="scss" scoped>
    .outside-list {
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
        .outside-table .el-table {
            width: 100%;
        }
        .outside-page {
            padding-right: 30px;
            margin: 20px 0;
            text-align: right;
        }
    }
</style>
<style lang="scss">
    .detail-block {
        .group-name {
            padding: 12px 0 8px;
        }
    }
</style>
