<template>
    <div class="add-by-order-dialog">
        <el-dialog
                class="custom-dialog purchase-add-dialog"
                title="按单到料详情"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="$emit('update:visible',false)">
            <div class="purchase-add-dialog__body">
                <!--<div>{{newMaterialsSku}}</div>-->
                <div class="fs12">物料：
                    {{newMaterialsSku.kindName}}-
                    {{newMaterialsSku.kindNo}}-
                    {{newMaterialsSku.materialName}}-
                    {{newMaterialsSku.colorName}}-
                    {{newMaterialsSku.specificationsNumber}}-
                    {{newMaterialsSku.supplierName}}
                </div>
                <div class="search-area mgt16">
                    <div>
                        <span>搜索</span>
                        <el-input class="search-input" v-model="searchKeyWord" placeholder="采购单号/商品款号/生产单号/加工厂搜索"
                                  icon="search">
                        </el-input>
                    </div>
                </div>
                <div class="total-area mgt8">
                    <div>
                        <span class="font-bold">合计未到：</span>
                        <span class="font-bold orange">{{totalUnArrivedPurchaseQuantity}}</span>
                    </div>
                    <div>
                        <span>合计到料数(采购单位)：</span>
                        <span>{{newMaterialsSku.quantity}}{{newMaterialsSku.purchaseUnitName}}</span>
                    </div>
                    <div>
                        <span>合计到料(库存单位)：</span>
                        <span>{{newMaterialsSku.quantityArrive}}{{newMaterialsSku.unit}}</span>
                    </div>
                </div>

                <el-table
                        height="9999"
                        :data="filterSearchList"
                        border
                        class="custom-table tiny-row no-hover-highlight add-by-order-table"
                        style="width: 100%">
                    <el-table-column prop="purchaseDate" align="center" label="采购日期" min-width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.datePurchase">{{scope.row.datePurchase.substr(0,10)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMaterialPurchaseOrderNo" align="center" label="采购单号" width="160">
                    </el-table-column>
                    <el-table-column prop="styleNo" align="center" label="成衣款号" width="160">
                    </el-table-column>
                    <el-table-column prop="demandSourceBillNo" align="center" label="生产单号" width="160">
                    </el-table-column>
                    <el-table-column prop="outsideFactoryName" align="center" label="加工厂" width="160">
                    </el-table-column>
                    <el-table-column prop="purchaseConversionRate" align="center" label="采购转化率" width="160">
                    </el-table-column>
                    <el-table-column label="本次采购(库存单位)" align="center" width="160">
                        <template slot-scope="scope">
                            <div>{{scope.row.quantityStockUnitPurchase}}{{newMaterialsSku.unit}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" align="center" label="采购未到" width="160">
                        <template slot-scope="scope">
                            <div>{{(scope.row.quantityStockUnitPurchase-scope.row.quantityArrive).toFixed(2)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="到料单价" width="120" fixed="right">
                        <template slot-scope="scope">
                               <span>{{scope.row.priceUnit}}元/{{newMaterialsSku.purchaseUnitName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="到料数(采购单位)" width="120" fixed="right">
                        <template slot-scope="scope">
                               <span>{{scope.row.quantity}}{{newMaterialsSku.purchaseUnitName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="本次到料(库存单位)" width="130" fixed="right">
                        <template slot-scope="scope">
                               <span>{{scope.row.quantityArrive}}{{newMaterialsSku.stockUnitName}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32">已包含<span v-if="newMaterialsSku.billPurchaseList" class="orange">{{newMaterialsSku.billPurchaseList.length}}</span>
                    生产单需求
                </div>
                <el-button @click="$emit('update:visible',false)" type="primary">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "add-by-order-dialog",
        props: ['visible','materialsSku'],
        data() {
            return {
                searchKeyWord: '',      //搜索词
                newMaterialsSku: {billPurchaseList:[]},
            }
        },
        methods: {
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            filterSearchList() {
                if (this.searchKeyWord) {
                    return this.newMaterialsSku.billPurchaseList.filter(item => (item.billMaterialPurchaseOrderNo && item.billMaterialPurchaseOrderNo.indexOf(this.searchKeyWord) > -1) ||
                        (item.outsideFactoryName && item.outsideFactoryName.indexOf(this.searchKeyWord) > -1)||
                        (item.demandSourceBillNo && item.demandSourceBillNo.indexOf(this.searchKeyWord) > -1)  ||
                        (item.styleNo && item.styleNo.indexOf(this.searchKeyWord) > -1)  )
                } else {
                    return this.newMaterialsSku.billPurchaseList
                }
            },
            totalUnArrivedPurchaseQuantity() {
               return this.newMaterialsSku.billPurchaseList.reduce((total,v) => {
                    return (total + (v.quantityStockUnitPurchase - v.quantityArrive).toFixed(2) * 1).toFixed(2) * 1
                },0)
            }
        },
        watch: {
            visible(val) {
                if (val) {
                    this.newMaterialsSku = JSON.parse(JSON.stringify(this.materialsSku))
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    .add-by-order-dialog {
        .search-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .total-area {
            display: flex;
            align-items: center;
            font-size: 12px;
            padding: 8px;
            border: 1px solid #E6EAF0;
            border-bottom: none;
            background: rgb(238, 240, 246);
            & > div {
                margin-right: 40px;
                &:last-child {
                    margin-right: 0;
                }
            }

        }
        .orange-btn {
            color: #ff9c38;
            background: transparent;
            border: 1px solid #ff9c38;
        }
        .blue-btn {
            color: #1CA1FF;
            background: transparent;
            border: 1px solid #1CA1FF;
        }
    }
</style>
<style lang="scss">
    .add-by-order-dialog {
        .add-by-order-table{
            .edit-bg{
                .el-input__inner{
                    background: #FFF9ED;
                    height: 100%;
                    border: none;
                }
            }
        }
        .search-input {
            width: 330px;
            .el-input__inner {
                height: 32px;
            }

        }
        .total-input {
            width: 90px;
            .el-input__inner {
                height: 32px;
                background: #FFF9ED;
            }
        }
        .el-dialog--small {
            width: 1000px;
            margin-bottom: 0;
            .el-dialog__body {
                padding: 16px;
            }
        }

        td.yellow-bg {
            background-color: #FFF9ED !important;
            .el-textarea__inner,
            .el-input__inner {
                background-color: #FFF9ED !important;
            }
            .el-textarea__inner,
            .el-input__inner {
                font-size: 12px;
                min-height: 24px;
                height: 24px;
                border: none;
            }
        }

    }

</style>