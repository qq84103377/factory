<template>
    <section class="mat-record">
        <filter-tab typeName="record" @filterClick="getDataList"></filter-tab>
        <el-row
                class="mat-middle"
                type="flex"
                justify="space-between"
                align="middle">
            <div class="middle__left">
                <el-input
                        class="search-input"
                        placeholder="输入物料款号/名称、供应商名称/款号搜索"
                        icon="search"
                        v-model.trim="input1"
                        @input='getDataList'>
                </el-input>
            </div>
            <div class="middle__right">
                <nf-button class="report-btn" @click="exportExcel" :loading="isloading">导出记录</nf-button>
            </div>
        </el-row>
        <div v-loading ='loading'>
            <record-table :listInfo="tableData" :pageInfo="pageSetting" @pageChange="pageChange"></record-table>
        </div>
    </section>
</template>

<script>
    import {
        getChangeSotckList,
        exportStockExcel
    } from "@/api";
    import filterTab from './filter';
    import recordTable from './record-table.vue';
    export default {
        components: {
            filterTab,
            recordTable,
        },
        data() {
            return {
                input1: '',                      //搜索值
                tableData: [],                   //表格数据
                pageSetting: {                   //分页设置
                    pageNo: 1,                   //第几页
                    pageSize: 20,                //每页条数
                    totalCount: 0                //总条数
                },
                filterData: {},                  //筛选组件返回的数据
                isloading: false,                //防止多次点击
                loading:false,                   //请求列表时
            }
        },
        computed: {
            //仓库id
            storehouseId() {
                return this.$route.query.storehouseId;
            }
        },
        methods: {
            //搜索、筛选
            getDataList(msg) {
                //避免搜索框输入时清空filterData的值
                if (typeof(msg) != "string") {
                    this.filterData = msg;
                }
                let params = {
                    sampleMaterial:msg.sampleMaterial, //是否为样料
                    storehouseId: this.storehouseId,         //仓库id （必须）
                    materialType: msg.type,                  //物料分类
                    supplierId: msg.supplier,                //供应商
                    inventoryType: msg.changeType,           //变动类型
                    startOpAt: msg.startOpAt,                //开始时间
                    endOpAt: msg.endOpAt,                    //结束时间
                    opBy: msg.operatePersonnel,               //操作人
                    unitId: msg.operateFactory,               //操作工厂
                    queryColumn: this.input1,                //搜索关键字
                    pageNo: this.pageSetting.pageNo,         //第几页
                    pageSize: this.pageSetting.pageSize      //每页条数
                };
                this.loading = true
                getChangeSotckList(params).then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.list;
                        this.getStyleColor(this.tableData);
                        this.pageSetting.totalCount = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //分页切换
            pageChange(val) {
                let params = {
                    storehouseId: this.storehouseId,                     //仓库id （必须）
                    materialType: this.filterData.type,                  //物料分类
                    supplierId: this.filterData.supplier,                //供应商
                    inventoryType: this.filterData.changeType,           //变动类型
                    startOpAt: this.filterData.startOpAt,                //开始时间
                    endOpAt: this.filterData.endOpAt,                    //结束时间
                    opBy: this.filterData.operatePersonnel,               //操作人
                    unitId: this.filterData.operateFactory,               //操作工厂
                    queryColumn: this.input1,                             //搜索关键字
                    pageNo: val,                                          //第几页
                    pageSize: this.pageSetting.pageSize                   //每页条数
                };
                //获取之前先清空之前的数据
                this.tableData = [];
                this.loading = true
                getChangeSotckList(params).then(res => {
                    this.loading = false
                    if (res.data.code === 0) {
                        this.tableData = res.data.data.list;
                        this.getStyleColor(this.tableData);
                        this.pageSetting.totalCount = res.data.data.totalCount;
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //导出excel
            exportExcel() {
                this.isloading = true;
                let params = {
                    storehouseId: this.storehouseId,             //仓库id （必须）
                    materialType: this.filterData.type,          //物料分类
                    supplierId: this.filterData.supplier,        //供应商
                    inventoryType: this.filterData.changeType,   //变动类型
                    startOpAt: this.filterData.startOpAt,        //开始时间
                    endOpAt: this.filterData.endOpAt,            //结束时间
                    opBy: this.filterData.operatePersonnel,      //操作人
                    unitId: this.filterData.operateFactory,      //操作工厂
                    queryColumn: this.input1                     //搜索关键字
                };
                exportStockExcel(params).then(res => {
                    // this.fileData =res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','库存变动记录报表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.isloading = false;
                });

            },
            //拼接供应商款号/色号
            getStyleColor(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i].supplierStyleNo && val[i].supplierColorNo) {
                        val[i].styleColor = val[i].supplierStyleNo + ' / ' + val[i].supplierColorNo;
                    } else if (val[i].supplierStyleNo) {
                        val[i].styleColor = val[i].supplierStyleNo;
                    } else if (val[i].supplierColorNo) {
                        val[i].styleColor = val[i].supplierColorNo;
                    } else {
                        val[i].styleColor = "";
                    }
                }
            }
        },

        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .mat-record {
        width: 100%;
        .mat-middle {
            margin-bottom: 16px;
            .search-input {
                width: 320px;
            }
            .in-btn {
                margin-right: 14px;
                color: #23c811;
                border: 1px solid #23c811;
                background: #e4f8e2;
                &:hover {
                    background: #c7f1c3;
                    border-color: #23c811;
                }
            }
            .out-btn {
                color: #ffa914;
                border: 1px solid #ffa914;
                background: #fff4e2;
                &:hover {
                    background: #ffe9c4;
                    border-color: #ffa914;
                }
            }
            .middle__right {
                background-color: #fff;
            }
        }
    }
</style>
