<template>
    <section class="stock">
        <el-row
                class="stock-sort"
                type="flex"
                justify="space-between"
                align="middle">
            <div class="stock-sort__right">
                <rich-filter style="display: inline-block;width:250px"
                             v-model="richFilterParams"
                             @filter="handleIconClick"
                             dialogType='STYLE'
                             placeholder="点击可筛选商品"
                             modelName="GOODS_STOCK"></rich-filter>
                <!--<el-input-->
                        <!--class="search-input"-->
                        <!--placeholder="输入货品款号搜索"-->
                        <!--icon="search"-->
                        <!--@input='handleIconClick'>-->
                <!--</el-input>-->
                <!-- <good-search></good-search> -->
                <el-select
                        @change='optionsSelect'
                        v-model="facSelectVal"
                        placeholder="请选择排序类型">
                    <el-option
                            v-for="(item, index) in options"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="stock-sort__left">
                <nf-button class="in-btn"
                           type="success"
                           size="medium"
                           @click="clickGet"
                >开入库单
                </nf-button>
                <nf-button class="in-btn btn2"
                           type="warning"
                           size="medium"
                           @click="clickStock">开出库单
                </nf-button>
                <nf-button class="in-btn btn4"
                           type="warning"
                           size="medium"
                           @click="clickSend">开发货单
                </nf-button>
                <nf-button class="in-btn btn5"
                           type="warning"
                           size="medium"
                           @click="clickReturn">开退货单
                </nf-button>
                <nf-button class="out-btn btn3"
                           type="warning"
                           size="medium"
                           @click="clickLoss">开调整单
                </nf-button>
            </div>
        </el-row>
        <!--<el-row>-->
            <!--<el-form label-width="80px" class="custom-filter-form">-->
                <!--<el-row>-->
                    <!--<el-col :span="6">-->
                        <!--<el-form-item label="商品属性">-->
                            <!--<goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset" modelName="GOODS_STOCK"></goods-attr-dialog>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<div class="btn-group">-->
                        <!--<el-button class="btn btn-submit" @click="handleFilter">筛选</el-button>-->
                    <!--</div>-->
                <!--</el-row>-->


            <!--</el-form>-->
            <!--&lt;!&ndash;<stock-filter  @on-filter-click="handleFilter"></stock-filter>&ndash;&gt;-->
        <!--</el-row>-->
        <el-row>
            <page-wrap>
                <el-row
                        class="total-bar"
                        type="flex">
                    <div class="total-bar__item total-bar__yellow">
                        <span class="total-bar__label">商品</span>
                        <p><strong>{{bigList.styleSum}} 款</strong></p>
                    </div>
                    <div class="total-bar__item total-bar__yellow">
                        <span class="total-bar__label">总库存</span>
                        <p><strong>{{bigList.stockSum}} 件</strong></p>
                    </div>
                    <div class="total-bar__item total-bar__yellow">
                        <span class="total-bar__label">总金额</span>
                        <p><strong>{{bigList.totalAmount}}
                            元</strong></p>
                    </div>
                </el-row>


                <!-- <stock-filter></stock-filter> -->
                <stock-table
                        v-loading="loading"
                        v-model="skuValue"
                        @getData='getData'
                        isRealStore
                        :standbyValue="standbyValue"
                        :tableData="inventoryItemList" :bigList="bigList"></stock-table>
                <el-row
                        class="pagination"
                        type="flex"
                        justify="end">
                    <el-pagination
                            :current-page.sync="pagination.currentPage"
                            :page-size="20"
                            @current-change="handleCurrentChange"
                            layout="total, prev, pager, next"
                            :total="pagination.totalCount">
                    </el-pagination>
                </el-row>
            </page-wrap>
        </el-row>
    </section>
</template>

<script>
    import GoodSearch from "./good-search";
    import StockFilter from "./filter";
    import StockTable from "./table";
    import {queryInventoryItemList} from "@/api/api";
    import {debounce} from "@/utils";

    export default {
        componentName: "RealStock",
        data() {
            return {
                isRealStore: true,
                loading: false,
                facSelectVal: "",
                inventoryItemList: [],
                bigList: {},
                pagination: {
                    currentPage: 1,
                    totalCount: 0
                    // totalPages: 0
                },
                skuValue: {},
                standbyValue: {},
                activeIndex: 0,
                options: [
                    {
                        label: "智能排序",
                        value: ""
                    },
                    {
                        label: "按款号A-Z",
                        value: "styleNo"
                    },
                    {
                        label: "按库存数从多到少",
                        value: "num-1"
                    },
                    {
                        label: "按库存数从少到多",
                        value: "num-0"
                    },
                    {
                        label: "按创建时间从近到远",
                        value: "createAt-1"
                    },
                    {
                        label: "按创建时间从远到近",
                        value: "createAt-0"
                    }
                ],
                filterData: [],
                richFilterParams:{},
            };
        },
        components: {
            GoodSearch,
            StockFilter,
            StockTable
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            storehouseId() {
                return this.$route.query.storehouseId||'';
            }
        },
        watch: {
            '$route'(v) {
                if(v.path === '/home/stock' && this.$route.query.storehouseId) {
                    this.fetchStockList({
                        storehouseId: this.storehouseId,
                        facId: this.unitId,
                        userId: this.userId
                    })
                }
            }
        },
        created() {
            if (!this.$route.query.storehouseId) return;
            this.fetchStockList({
                storehouseId: this.storehouseId,
                facId: this.unitId,
                userId: this.userId
            });
            this.$on("updataStock", this.updataStock);
        },
        methods: {
            //点击开退货单
            clickReturn() {
                 // 权限
                if(!this.powerJudgement.permissions("fac.inventory.addReturn")){
                    return
                }
                this.$router.push(
                    "/home/instorage?type=4&storehouseId=" + this.storehouseId
                );
            },
            //点击开发货单
            clickSend() {
                 // 权限
                if(!this.powerJudgement.permissions("fac.inventory.addDispatch")){
                    return
                }
                this.$router.push(
                    "/home/instorage?type=3&storehouseId=" + this.storehouseId
                );
            },
            //点击开损益单
            clickLoss() {
                 // 权限
                if(!this.powerJudgement.permissions("fac.inventory.addAdjust")){
                    return
                }
                this.$router.push(
                    "/home/instorage?type=2&storehouseId=" + this.storehouseId
                );
            },
            //   点击开入库单
            clickGet() {
                // this.sign = "0";
                // var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                //     .permissionList;
                // if (datalist) {
                //     for (let i = 0; i < datalist.length; i++) {
                //         if (datalist[i] == "fac.inventory.batch.inStorage") {
                //             this.sign = "1";
                //         }
                //     }
                // }
                // if (this.sign != "1" || !datalist) {
                //     this.$message.error("抱歉，您没有操作权限");
                //     return;
                // }
                // 权限
                if(!this.powerJudgement.permissions("fac.inventory.batch.inStorage")){
                    return
                }
                this.$router.push(
                    "/home/instorage?type=1&storehouseId=" + this.storehouseId
                );
            },
            // 点击开出库单
            clickStock() {
                // this.sign = "0";
                // var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                //     .permissionList;
                // if (datalist) {
                //     for (let i = 0; i < datalist.length; i++) {
                //         if (datalist[i] == "fac.inventory.batch.outStorage") {
                //             this.sign = "1";
                //         }
                //     }
                // }
                // if (this.sign != "1" || !datalist) {
                //     this.$message.error("抱歉，您没有操作权限");
                //     return;
                // }
                 // 权限
                if(!this.powerJudgement.permissions("fac.inventory.batch.outStorage")){
                    return
                }
                this.$router.push('/home/instorage?type=0&storehouseId=' + this.storehouseId)
            },
            getData() {
                this.handleCurrentChange(this.pagination.currentPage);
            },
            handleIconClick(val) {
                this.richFilterParams = val;
                let params = {
                    ...this.richFilterParams,
                    storehouseId: this.storehouseId,
                    facId: this.unitId,
                    userId: this.userId,
                };
                debounce(this.fetchStockList)(params);
            },
            //当前方法为搜索排序列表
            optionsSelect(val) {
                let sortBy, sortNo;
                if (val.includes("-")) {
                    sortBy = val.split("-")[0];
                    sortNo = val.split("-")[1];
                } else {
                    sortBy = val;
                    sortNo = "";
                }
                let params = {
                    storehouseId: this.storehouseId,
                    facId: this.unitId,
                    userId: this.userId,
                    sortBy: sortBy,
                    sortNo: sortNo
                };
                this.fetchStockList(params);
            },
            // 筛选
            // 获取弹窗的属性
            // getAllAttrId(val, categorys) {
            //     this.filterData.categorys = categorys && categorys.length > 0 ? categorys : undefined
            //     this.filterData.attrIds = val && val.length > 0 ? val : undefined
            // },
            handleFilter() {
                // this.filterData = val;
                // let goodsFilter = [
                //   {
                //     keyType: 2,
                //     valueType: val[1].model.length > 0 ? val[1].model : ["ALL"]
                //   }, //设计师
                //   {
                //     keyType: 3,
                //     valueType: val[6].model.length > 0 ? val[6].model : ["ALL"]
                //   }, //波段
                //   {
                //     keyType: 4,
                //     valueType: val[2].model.length > 0 ? val[2].model : ["ALL"]
                //   }, //分类
                //   {
                //     keyType: 5,
                //     valueType: val[5].model.length > 0 ? val[5].model : ["ALL"]
                //   }, //季节
                //   {
                //     keyType: 6,
                //     valueType: val[4].model.length > 0 ? val[4].model : ["ALL"]
                //   }, //年份
                //   {
                //     keyType: 7,
                //     valueType: val[3].model.length > 0 ? val[3].model : ["ALL"]
                //   }, //标签
                //   {
                //     keyType: 8,
                //     valueType: val[0].model.length > 0 ? val[0].model : ["ALL"]
                //   } //品牌
                // ];
                let params = {
                    ...this.richFilterParams,
                    storehouseId: this.storehouseId,
                    facId: this.unitId,
                    userId: this.userId,
                    pageNo: this.pagination.currentPage,
                    pageNo: 1
                };
                this.fetchStockList(params);
            },
            // 获取列表
            fetchStockList(params) {
                this.loading = true;
                params.modelName = 'GOODS_STOCK';
                queryInventoryItemList(params).then(res => {
                    // console.warn(res.data)

                    this.bigList = res.data;
                    this.pagination.totalCount = res.data.pageCount;
                    this.inventoryItemList = this.setRowCommonStyleSkuList(
                        res.data.inventoryItemList
                    );
                    this.$nextTick(() => {
                        this.loading = false;
                    });
                });
            },
            //
            setRowCommonStyleSkuList(inventoryItemList = []) {
                return (inventoryItemList = inventoryItemList.map(item => {
                    const data = this.setTableData(item);
                    this.skuValue = {
                        ...this.skuValue,
                        ...data["skuValue"]
                    };
                    this.standbyValue = {
                        ...this.standbyValue,
                        ...data["standbyValue"]
                    };
                    this.setSkuValueNum(item["inventoryItemStockList"]);
                    item.commonStyleSkuList = data["skuList"];
                    item.sizes = data["sizes"];
                    item.lengths = data["lengths"];
                    return item;
                }));
            },
            setTableData(data = {}) {
                const commonStyleSkuList = data["commonStyleSkuList"];
                let skuList = [],
                    colors = [],
                    sizes = [],
                    lengths = [],
                    json = {},
                    skuValue = {},
                    standbyValue = {};
                const lengthData = this.getLengths(commonStyleSkuList); // 用来判断是否显示‘无’内长
                const isHideLength =
                    lengthData.length === 1 && lengthData[0].value === "无";
                for (let item of commonStyleSkuList) {
                    const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/${
                        !isHideLength && item.standardId ? item.standardId : ""
                        }`;
                    skuValue[skuIdStr] = {
                        num: "",
                        skuId: item.id,
                        styleId: item.styleId,
                        colorName: item.colorName,
                        sizeValue: item.sizeValue,
                        standardValue: item.standardValue || ""
                    };
                    standbyValue[skuIdStr] = {
                        num: "",
                        skuId: item.id,
                        styleId: item.styleId
                    };
                    if (!json[item.colorId]) {
                        colors.push({
                            stockNum: "",
                            colorName: item.colorNoName || item.colorName,
                            colorId: item.colorId,
                            ...data,
                            id: item.styleId
                        });
                        json[item.colorId] = item.colorId;
                    }
                    if (item.standardId && !json[item.standardId]) {
                        lengths.push({
                            standardValue: item.standardValue || "无",
                            standardId: item.standardId,
                            ...data,
                            id: item.styleId
                        });
                        json[item.standardId] = item.standardId;
                    }
                    // const idStr = item.sizeValue + (item.standardId ? '/' + item.standardValue : '')
                    if (!json[item.sizeId]) {
                        sizes.push({
                            ...item,
                            sizeNum: "",
                            sizeValue: item.sizeValue,
                            sizeId: item.sizeId
                        });
                        json[item.sizeId] = item.sizeId;
                    }
                }
                if (isHideLength) lengths = [];
                for (let colorItem of colors) {
                    const sizeObj = {
                        ...colorItem,
                        lengths
                    };
                    skuList.push(sizeObj);
                }
                for (let sizeItem of sizes) {
                    sizeItem.lengths = lengths;
                }
                return {
                    skuList,
                    sizes,
                    lengths,
                    skuValue,
                    standbyValue
                };
            },
            getLengths(skuList) {
                let arr = [];
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.id === skuItem.standardId);
                    !had &&
                    arr.push({
                        value: skuItem.standardValue || "无",
                        id: skuItem.standardId
                    });
                }
                return arr;
            },
            setSkuValueNum(inventoryItemStockList = []) {
                for (let item of inventoryItemStockList) {
                    Object.keys(this.skuValue).map(idStr => {
                        if (this.skuValue[idStr].skuId === item.styleSkuId) {
                            this.skuValue[idStr].num = item.num;
                        }
                    });
                }
                // console.log(this.skuValue)
            },
            //点击分页
            handleCurrentChange(val) {
                // let goodsFilter;
                // if (this.filterData.model != undefined) {
                //   goodsFilter = [
                //     {
                //       keyType: 2,
                //       valueType:
                //         this.filterData[1].model.length > 0
                //           ? this.filterData[1].model
                //           : ["ALL"]
                //     }, //设计师
                //     {
                //       keyType: 3,
                //       valueType:
                //         this.filterData[6].model.length > 0
                //           ? this.filterData[6].model
                //           : ["ALL"]
                //     }, //波段
                //     {
                //       keyType: 4,
                //       valueType:
                //         this.filterData[2].model.length > 0
                //           ? this.filterData[2].model
                //           : ["ALL"]
                //     }, //分类
                //     {
                //       keyType: 5,
                //       valueType:
                //         this.filterData[5].model.length > 0
                //           ? this.filterData[5].model
                //           : ["ALL"]
                //     }, //季节
                //     {
                //       keyType: 6,
                //       valueType:
                //         this.filterData[4].model.length > 0
                //           ? this.filterData[4].model
                //           : ["ALL"]
                //     }, //年份
                //     {
                //       keyType: 7,
                //       valueType:
                //         this.filterData[3].model.length > 0
                //           ? this.filterData[3].model
                //           : ["ALL"]
                //     }, //标签
                //     {
                //       keyType: 8,
                //       valueType:
                //         this.filterData[0].model.length > 0
                //           ? this.filterData[0].model
                //           : ["ALL"]
                //     } //品牌
                //   ];
                // } else {
                //   goodsFilter = [];
                // }
                let params = {
                    ...this.richFilterParams,
                    storehouseId: this.storehouseId,
                    facId: this.unitId,
                    userId: this.userId,
                    pageNo: val || 1,
                    categorys: this.filterData.categorys,
                    attrIds: this.filterData.attrIds,
                };
                this.fetchStockList(params);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .stock-sort {
        margin: 16px 0;
        &__right {
            flex: 1;
            .search-input {
                width: 320px;
                margin-right: 14px;
            }
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
        .out-btn, .btn2 {
            color: #ffa914;
            border: 1px solid #ffa914;
            background: #fff4e2;
            &:hover {
                background: #ffe9c4;
                border-color: #ffa914;
            }
        }
        .btn3 {
            color: #FA4150;
            border: 1px solid #FA4150;
            background: #ffe0d7;
            &:hover {
            background: #FFC3BC;
            border-color: #FA4150;
            }
        }
        .btn4 {
            color: #438DF1;
            border: 1px solid #438DF1;
            background: #ECF3FD;
                    &:hover {
                    background: #D9DEFD;
                    border-color: #438DF1;
                    }
        }
        .btn5 {
            color: #5C6973;
            border: 1px solid #5C6973;
            background: #F2F4F5;
            &:hover {
                background: #dcdedf;
                border-color: #5C6973;
            }
        }
    }

    .total-bar {
        padding-bottom: 24px;
        &__item {
            width: 33.3333%;
            text-align: center;
            strong {
                font-weight: normal
            }
        }
        &__label {
            display: inline-block;
            margin-bottom: 12px;
            padding: 7px 22px;
            border-radius: 2px;
        }
        &__yellow {
            .total-bar__label {
                background: #FFF2E7;
            }
            color: #FF7F14
        }
        strong {
            font-size: 26px;
        }
    }

    .custom-filter-form {
        padding: 20px 20px 10px 0;
        margin-bottom: 16px;
        background-color: #fff;
    }

    .pagination {
        margin-top: 25px;
    }
</style>

