<template>
    <div class="add-by-order-dialog">
        <el-dialog
                class="custom-dialog purchase-add-dialog"
                title="按单到料"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="$emit('update:visible',false)">
            <div class="purchase-add-dialog__body">
                <!--<div>{{newMaterialsSku}}</div>-->
                <div class="fs12">物料：
                    {{newMaterialsSku.kindName}}-
                    {{newMaterialsSku.materialsNo}}-
                    {{newMaterialsSku.materialsName}}-
                    {{newMaterialsSku.colorName}}-
                    {{newMaterialsSku.specificationsNo}}-
                    {{newMaterialsSku.supplierName}}
                </div>
                <div class="search-area mgt16">
                    <div>
                        <span>搜索</span>
                        <el-input class="search-input" v-model="searchKeyWord" placeholder="采购单号/商品款号/生产单号/加工厂搜索"
                                  icon="search">
                        </el-input>
                    </div>
                    <el-button @click="fillAllPurchases" size="small" class="blue-btn">按采购未到一键填齐</el-button>
                </div>
                <div class="total-area mgt8">
                    <div>
                        <span class="font-bold">合计未到：</span>
                        <span class="font-bold orange">{{newMaterialsSku.totalUnArrivedPurchaseQuantity}}</span>
                    </div>
                    <div>
                        <span>合计到料数(采购单位)：</span>
                        <el-input @input="handleTotalQuantity" class="total-input" type="number"
                                  v-model="newMaterialsSku.quantity">
                        </el-input>
                        <span>{{newMaterialsSku.purchaseUnitName}}</span>
                    </div>
                    <div>
                        <span>合计到料(库存单位)：</span>
                        <el-input @input="handleTotalDelivery" class="total-input" type="number"
                                  v-model="newMaterialsSku.deliveryQuantityNow">
                        </el-input>
                        <span>{{newMaterialsSku.stockUnitName}}</span>
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
                            <div v-if="scope.row.purchaseDate">{{scope.row.purchaseDate.substr(0,10)}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billMaterialPurchaseNo" align="center" label="采购单号" width="160">
                    </el-table-column>
                    <el-table-column prop="supplierName" align="center" label="供应商" width="160">
                    </el-table-column>
                    <el-table-column prop="styleNo" align="center" label="成衣款号" width="160">
                    </el-table-column>
                    <el-table-column prop="sourceBillNo" align="center" label="生产单号" width="160">
                    </el-table-column>
                    <el-table-column prop="outsideFactoryName" align="center" label="加工厂" width="160">
                    </el-table-column>
                    <el-table-column prop="conversionRate" align="center" label="采购转化率" width="160">
                    </el-table-column>
                    <el-table-column align="center" label="本次采购(库存单位)" width="160">
                        <template slot-scope="scope">
                            <div>{{scope.row.purchaseQuantityStockUnitNow}}{{scope.row.stockUnitName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" align="center" label="采购未到" width="160">
                    </el-table-column>
                    <el-table-column align="center" label="是否到齐" width="160">
                        <template slot-scope="scope">
                            <span v-if="scope.row.arriveStatus==2">已到齐</span>
                            <span style="text-decoration:underline;cursor:pointer;color:#808080;"
                                  v-else @click="setArrive(scope.row)">手动到齐</span>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-bg" align="center" label="到料单价" width="120" fixed="right">
                        <template slot-scope="scope">
                           <div style="display: flex;justify-content: space-between;align-items: center;">
                               <el-input v-model="scope.row.priceUnit" type="number" placeholder="请输入"></el-input>
                               <span style="white-space: nowrap">元/{{scope.row.purchaseUnitName}}</span>
                           </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-bg" align="center" label="到料数(采购单位)" width="120" fixed="right">
                        <template slot-scope="scope">
                           <div style="display: flex;justify-content: space-between;align-items: center;">
                               <el-input @input="handleRowQuantity($event,scope.row)" v-model="scope.row.quantity" type="number" placeholder="请输入"></el-input>
                               <span>{{scope.row.purchaseUnitName}}</span>
                           </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="edit-bg" align="center" label="本次到料(库存单位)" width="130" fixed="right">
                        <template slot-scope="scope">
                           <div style="display: flex;justify-content: space-between;align-items: center;">
                               <el-input @input="handleRowDelivery($event,scope.row)" v-model="scope.row.deliveryQuantityNow" type="number" placeholder="请输入"></el-input>
                               <span>{{scope.row.stockUnitName}}</span>
                           </div>
                        </template>
                    </el-table-column>
                    <el-table-column class-name="no-padding" label="操作" fixed="right" width="80" align="center">
                        <template slot-scope="scope">
                            <div @click="deleteRow(scope.$index)" class="item red pointer">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32">已包含<span v-if="newMaterialsSku.sourceBillForArriveList" class="orange">{{newMaterialsSku.sourceBillForArriveList.length}}</span>
                    生产单需求
                </div>
                <el-button @click="$emit('update:visible',false)">取 消</el-button>
                <el-button @click="confirm" type="primary">确 定</el-button>
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
                newMaterialsSku: {},
            }
        },
        methods: {
            // 删除采购需求
            deleteRow(index) {
                this.newMaterialsSku.sourceBillForArriveList.splice(index, 1)
                let quantity = 0, deliveryQuantityNow = 0, totalUnArrivedPurchaseQuantity = 0;
                this.newMaterialsSku.sourceBillForArriveList.forEach(v => {
                    quantity = (quantity + (v.quantity || 0)).toFixed(2) * 1
                    totalUnArrivedPurchaseQuantity = (totalUnArrivedPurchaseQuantity + (v.unArrivedPurchaseQuantity || 0)).toFixed(2) * 1
                    deliveryQuantityNow = (deliveryQuantityNow + (v.deliveryQuantityNow || 0)).toFixed(2) * 1
                })
                this.$set(this.newMaterialsSku,'deliveryQuantityNow',deliveryQuantityNow)
                this.$set(this.newMaterialsSku,'quantity',quantity)
                this.$set(this.newMaterialsSku,'totalUnArrivedPurchaseQuantity',totalUnArrivedPurchaseQuantity)
            },
            fillAllPurchases() {
                let num = 0;
                this.newMaterialsSku.sourceBillForArriveList.forEach(v => {
                    num += v.unArrivedPurchaseQuantity
                    this.$set(v,'deliveryQuantityNow',v.unArrivedPurchaseQuantity)
                    this.handleRowQuantity(v.conversionRate*1>0?(v.unArrivedPurchaseQuantity/v.conversionRate).toFixed(2)*1:0,v,1)
                })
                this.$set(this.newMaterialsSku,'deliveryQuantityNow',num)
            },
            handleRowQuantity(e,row,type) {
                this.$set(row,'quantity',e)
                if(!type) this.handleRowDelivery((e*row.conversionRate).toFixed(2)*1,row,1)
                let total = this.newMaterialsSku.sourceBillForArriveList.reduce((t,v) => {
                    return (t + (v.quantity||0) * 1).toFixed(2) * 1
                },0)
                this.$set(this.newMaterialsSku,'quantity',total)
            },
            handleRowDelivery(e,row,type) {
                this.$set(row,'deliveryQuantityNow',e)
                if(!type) this.handleRowQuantity(row.conversionRate*1>0?(e/row.conversionRate).toFixed(2)*1:0,row,1)
                let total = this.newMaterialsSku.sourceBillForArriveList.reduce((t,v) => {
                    return (t + (v.deliveryQuantityNow||0) * 1).toFixed(2) * 1
                },0)
                this.$set(this.newMaterialsSku,'deliveryQuantityNow',total)
            },
            handleTotalQuantity() {
                let total = this.newMaterialsSku.quantity;
                let flag = false;
                for (let i = 0; i < this.newMaterialsSku.sourceBillForArriveList.length; i++) {
                    let item = this.newMaterialsSku.sourceBillForArriveList[i];
                    if(flag) {
                        this.$set(item,'quantity',0)
                        this.handleRowDelivery(0,item,1)
                        continue
                    }
                    if(((total*item.conversionRate).toFixed(2)*1) - item.unArrivedPurchaseQuantity>0) {
                        if(i==(this.newMaterialsSku.sourceBillForArriveList.length-1)){
                            this.$set(item,'quantity',total)
                            this.handleRowDelivery((total*item.conversionRate).toFixed(2)*1,item,1)
                        }else {
                            this.$set(item,'quantity',item.unArrivedPurchaseQuantity)
                            this.handleRowDelivery((item.unArrivedPurchaseQuantity*item.conversionRate).toFixed(2)*1,item,1)
                            total = ((total*item.conversionRate).toFixed(2)*1) - item.unArrivedPurchaseQuantity
                        }
                    }else {
                        this.$set(item,'quantity',total || 0)
                        this.handleRowDelivery(((total || 0)*item.conversionRate).toFixed(2)*1,item,1)
                        flag = true
                    }

                }
            },
            handleTotalDelivery(v) {
                let total = this.newMaterialsSku.deliveryQuantityNow
                // if(total>this.totalUnArrivedPurchaseQuantity){
                //     this.newMaterialsSku.deliveryQuantityNow = 0
                //     this.newMaterialsSku.sourceBillForArriveList.forEach(v => {
                //         v.deliveryQuantityNow = 0
                //     })
                //    return this.$message.error('输入的合计到料数超过合计采购未到！')
                // }
                let flag = false;
                for (let i = 0; i < this.newMaterialsSku.sourceBillForArriveList.length; i++) {
                    let item = this.newMaterialsSku.sourceBillForArriveList[i];
                    if(flag) {
                        this.$set(item,'deliveryQuantityNow',0)
                        this.handleRowQuantity(0,item,1)
                        continue
                    }
                    if(total - item.unArrivedPurchaseQuantity>0) {
                        if(i==(this.newMaterialsSku.sourceBillForArriveList.length-1)){
                            this.$set(item,'deliveryQuantityNow',total)
                            this.handleRowQuantity(item.conversionRate*1>0?(total/item.conversionRate).toFixed(2)*1:0,item,1)
                        }else {
                            this.$set(item,'deliveryQuantityNow',item.unArrivedPurchaseQuantity)
                            this.handleRowQuantity(item.conversionRate*1>0?(item.unArrivedPurchaseQuantity/item.conversionRate).toFixed(2)*1:0,item,1)
                            total = total - item.unArrivedPurchaseQuantity
                        }
                    }else {
                        this.$set(item,'deliveryQuantityNow',total || 0)
                        this.handleRowQuantity(item.conversionRate*1>0?((total || 0)/item.conversionRate).toFixed(2)*1:0,item,1)
                        flag = true
                    }

                }
            },
            confirm() {
                this.$emit('update:visible', false)
                this.$emit('confirm', this.newMaterialsSku)
            },
            //手动到齐
            setArrive(val) {
                val.arriveStatus = 2;
                val.manualArriveComplete = true;
            },
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            filterSearchList() {
                if (this.searchKeyWord) {
                    return this.newMaterialsSku.sourceBillForArriveList.filter(item => (item.billMaterialPurchaseNo && item.billMaterialPurchaseNo.indexOf(this.searchKeyWord) > -1) ||
                        (item.outsideFactoryName && item.outsideFactoryName.indexOf(this.searchKeyWord) > -1)||
                        (item.sourceBillNo && item.sourceBillNo.indexOf(this.searchKeyWord) > -1)  ||
                        (item.styleNo && item.styleNo.indexOf(this.searchKeyWord) > -1)  )
                } else {
                    return this.newMaterialsSku.sourceBillForArriveList
                }
            },
            totalUnArrivedPurchaseQuantity() {
               return this.newMaterialsSku.sourceBillForArriveList.reduce((total,v) => {
                    return (total + v.unArrivedPurchaseQuantity).toFixed(2) * 1
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