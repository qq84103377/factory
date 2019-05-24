<template>
    <!-- 按单编辑 -->
    <div class="edit-by-order-dialog">
        <el-dialog
                class="custom-dialog"
                :title="belongModule==2?'按单通知':'按单送料'"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="cancel">
            <div>
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
                        <el-input class="search-input" v-model="searchKeyWord" placeholder="输入搜索"
                                  icon="search">
                        </el-input>
                    </div>
                    <el-button @click="fillAll" size="small" class="blue-btn">按待送料一键填齐</el-button>
                </div>
                <div class="total-area mgt8">
                    <div v-if="belongModule!=1">
                        <span class="font-bold">合计待送：</span>
                        <span class="font-bold orange">{{newMaterialsSku.totalWaitPayOff}}</span>
                    </div>
                    <div>
                        <span>{{belongModule==2?'合计通知：':'合计送料'}}</span>
                        <el-input v-if="belongModule==2" @change="notifyTotalChange" class="total-input" type="number"
                                  v-model="newMaterialsSku.notifyTotal">
                        </el-input>
                        <el-input v-else @change="notifyTotalChange" class="total-input" type="number"
                                  v-model="newMaterialsSku.totalPayOff">
                        </el-input>
                    </div>
                </div>

                <el-table
                        height="400"
                        :data="filterSearchList"
                        border
                        class="custom-table tiny-row no-hover-highlight"
                        style="width: 100%">
                    <el-table-column prop="styleNo" label="成衣款号" min-width="140">
                    </el-table-column>
                    <el-table-column prop="sourceBillNo" label="生产单号" width="160">
                        <template slot-scope="scope">
                            {{scope.row.sourceBillNo?scope.row.sourceBillNo :' 计划外送料'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="outsideFactoryName" label="整单外发" min-width="120">
                    </el-table-column>
                    <el-table-column prop="totalDemand" label="物料需求" min-width="80">
                    </el-table-column>
                    <el-table-column v-if="belongModule==1" prop="stockActivePreuse" label="主动占用" min-width="80">
                    </el-table-column>
                    <el-table-column prop="selfPreuseTotal" label="本单总占用" min-width="100">
                    </el-table-column>
                    <el-table-column prop="waitDeliveryQuantity" label="待送料" min-width="80">
                    </el-table-column>
                    <el-table-column v-if="belongModule==0 || belongModule==2" prop="quantityDelivered" label="已送料" min-width="80">
                    </el-table-column>
                    <el-table-column prop="availableStock" :label="storehouseId?'可用数':'可用库存'" min-width="80">
                        <template slot-scope="scope">
                            {{handleRowData(scope.row,'availableStock')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" :label="storehouseId?'库存数':'总库存'" min-width="80">
                        <template slot-scope="scope">
                            {{handleRowData(scope.row,'stock')}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right" :class-name="[belongModule==2?'yellow-bg no-padding':''] " label="本次通知" min-width="80">
                        <template slot-scope="scope">
                            <div>
                                <el-input v-if="belongModule==2" @change="quantityChange($event,scope.row,scope.$index)" placeholder="请输入" type="number"
                                          v-model="scope.row.notifyQuantity"></el-input>
                                <span v-else>{{scope.row.notifyQuantity}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="belongModule!=2"
                            fixed="right" class-name="yellow-bg no-padding" label="本次送料" min-width="80">
                        <template slot-scope="scope">
                            <div>
                                <el-input @change="quantityChange($event,scope.row,scope.$index)" placeholder="请输入" type="number"
                                          v-model="scope.row.deliveryQuantity"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!billDeliveryNotify.billDeliveryNotifyId" class-name="no-padding" label="操作" fixed="right" :width="belongModule==0?140:80" align="center">
                        <template slot-scope="scope">
                            <div class="action-list">
                                <div v-if="belongModule==0&&scope.row.status!=1" @click="setSourceBillStatus(scope.row,scope.$index,1)" class="item blue pointer">标为完成</div>
                                <div v-if="belongModule==0&&scope.row.status ==1" @click="setSourceBillStatus(scope.row,scope.$index,0)" class="item gray pointer">撤销完成</div>
                                <div class="item ">
                                    <span @click="deleteRow(scope.$index)" v-if="scope.row.sourceBillId" class="red" pointer>删除</span>
                                </div>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32">已选生产单需求：<span v-if="newMaterialsSku.sourceBills" class="orange">{{newMaterialsSku.sourceBills.length}}条</span>
                </div>
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="confirm" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        purchaseFacFieldConfigTargetView,
        updateUnitFacField
    } from '@/api/material.js'
    // billDeliveryNotify选中的通知单
    export default {
        props: ['visible', 'title', 'materialsSku','belongModule','billDeliveryNotify', 'storehouseId'],

        data() {
            return {
                searchKeyWord: '',      //搜索词
                newMaterialsSku: [],

            }
        },
        created() {
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            filterSearchList() {
                if (this.searchKeyWord) {
                    return this.newMaterialsSku.sourceBills.filter(item => (item.sourceBillNo && item.sourceBillNo.indexOf(this.searchKeyWord) > -1) ||
                        (item.styleNo && item.styleNo.indexOf(this.searchKeyWord) > -1))
                } else {
                    return this.newMaterialsSku.sourceBills
                }
            },
        },
        watch: {
            visible(val) {
                if (val) {
                    console.log(this.materialsSku,'进来的时候有吗？')
                    this.newMaterialsSku = JSON.parse(JSON.stringify(this.materialsSku))
                }
            }
        },
        components: {
        },
        methods: {
            handleRowData(row,key) {
                if(this.storehouseId) {
                    let availableStock = 0, totalStock = 0;
                    if(this.newMaterialsSku.stocks) {
                        this.newMaterialsSku.stocks.forEach(v => {
                            if(v.skuId === this.newMaterialsSku.materialsSkuId && v.storehouseId === this.storehouseId) {
                                availableStock = v.availableStock
                                totalStock = v.totalStock
                            }
                        })
                    }

                    if(key == 'availableStock') {
                        return availableStock
                    }else if(key == 'stock'){
                        return totalStock
                    }
                }else {
                    return row[key]
                }
            },
            setSourceBillStatus(row,index,status){
                this.$set(row,'status',status)
            },
            // 本次合计、本次通知改变时
            quantityChange(val,row,index) {
                this.$nextTick(function (e) {
                    let total = 0
                    if (this.newMaterialsSku.sourceBills) {
                        this.newMaterialsSku.sourceBills.forEach(item => {
                            this.belongModule==2?
                                total = total + Number(item.notifyQuantity ? item.notifyQuantity : 0):
                                total = total + Number(item.deliveryQuantity ? item.deliveryQuantity : 0)
                        })
                    }
                    this.$set(this.newMaterialsSku, (this.belongModule==2?'notifyTotal':'totalPayOff'), Number(total.toFixed(2)))
                })
            },
            // 合计通知改变时
            notifyTotalChange(val) {
                if (val) {
                    let total = Number(val)
                    for (let i = 0; i < this.newMaterialsSku.sourceBills.length; i++) {
                        let item = this.newMaterialsSku.sourceBills[i]
                        if (total > 0) {
                            if (item.waitDeliveryQuantity >= total) {
                                this.$set(item,(this.belongModule==2?'notifyQuantity':'deliveryQuantity'), item.waitDeliveryQuantity > total ? total : item.waitDeliveryQuantity)
                                total = 0
                            } else {
                                this.$set(item, (this.belongModule==2?'notifyQuantity':'deliveryQuantity'), item.waitDeliveryQuantity)

                                total = Number((total - (item.waitDeliveryQuantity?item.waitDeliveryQuantity:0)).toFixed(2))
                            }
                        } else {
                            this.belongModule==2?item.notifyQuantity = 0:item.deliveryQuantity = 0
                        }
                    }
                    // 如果有剩余
                    if (total > 0) {
                        let lastPurchaseDemand = this.newMaterialsSku.sourceBills[this.newMaterialsSku.sourceBills.length - 1]
                        if (!lastPurchaseDemand.sourceBillId) {
                            if(this.belongModule==2){
                                this.$set(lastPurchaseDemand, 'notifyQuantity', lastPurchaseDemand.notifyQuantity ? (lastPurchaseDemand.notifyQuantity + total) : total)
                            } else {
                                this.$set(lastPurchaseDemand, 'deliveryQuantity', lastPurchaseDemand.deliveryQuantity ? (lastPurchaseDemand.deliveryQuantity + total) : total)

                            }
                        } else {
                            let lastPurchaseDemand = {
                                sourceBillId: '',
                                materialsSkuId: this.newMaterialsSku.materialsSkuId,
                                styleNo: "", //成衣款号
                            }
                            this.belongModule==2?lastPurchaseDemand.notifyQuantity = total:lastPurchaseDemand.deliveryQuantity = total
                            this.newMaterialsSku.sourceBills.push(lastPurchaseDemand)
                        }
                    }
                } else {
                    this.newMaterialsSku.sourceBills.forEach(item => {
                        this.belongModule==2?item.notifyQuantity = 0:item.deliveryQuantity = 0
                    })
                }
            },
            // 一键填齐
            fillAll() {
                let total = 0
                this.newMaterialsSku.sourceBills.forEach(item => {
                    // 非计划外才有待送料
                    if (item.sourceBillId) {
                        this.$set(item, this.belongModule==2?'notifyQuantity':'deliveryQuantity', item.waitDeliveryQuantity)
                        total = total + (item.waitDeliveryQuantity?item.waitDeliveryQuantity:0)
                    } else {
                        if(this.belongModule==2){
                            total = total + (item.notifyQuantity?item.notifyQuantity:0)
                        } else {
                            total = total + (item.deliveryQuantity?item.deliveryQuantity:0)
                        }

                    }
                })
                this.$set(this.newMaterialsSku, (this.belongModule==2?'notifyTotal':'totalPayOff'), Number(total.toFixed(2)))
            },
            // 删除送料需求
            deleteRow(index) {
                this.newMaterialsSku.sourceBills.splice(index, 1)
                this.$nextTick(()=>{
                    let total = 0
                    this.newMaterialsSku.sourceBills.forEach(item => {
                        if(this.belongModule==2){
                            total = total + (item.notifyQuantity?item.notifyQuantity:0)
                        } else {
                            total = total + (item.deliveryQuantity?item.deliveryQuantity:0)
                        }
                    })
                    this.$set(this.newMaterialsSku, (this.belongModule==2?'notifyTotal':'totalPayOff'), Number(total.toFixed(2)))
                })

            },
            cancel() {
                this.$emit('update:visible', false)
            },
            confirm() {
                this.$emit('update:visible', false)
                this.$emit('confirm', this.newMaterialsSku)

            },
        },
    }
</script>
<style lang="scss" scoped>
    .edit-by-order-dialog {
        .search-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .total-area {
            display: flex;
            align-items: center;
            justify-content: flex-end;
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
    .edit-by-order-dialog {

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
