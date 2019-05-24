/*
 * @Author: kuhn 
 * @Description: 新建/编辑采购单 - 按单编辑
 * @Date: 2019-05-24 10:29:51 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-24 13:07:24
 */

<template>
    <!-- 按单编辑 -->
    <div class="edit-by-order-dialog">
        <el-dialog
                class="custom-dialog"
                title="按单编辑"
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
                    <el-button @click="fillAllPurchases" size="small" class="blue-btn">一键填齐本次采购</el-button>
                </div>
                <div class="total-area mgt8">
                    <div>
                        <span class="font-bold">合计待采：</span>
                        <span class="font-bold orange">{{newMaterialsSku.totalWaitPurchaseQuantity}}</span>
                    </div>
                    <div>
                        <span>合计采购数：</span>
                        <el-input @change="totalPurchaseQuantityChange" class="total-input" type="number"
                                  v-model="newMaterialsSku.totalPurchaseQuantity">
                        </el-input>
                        <span>{{newMaterialsSku.purchaseUnitName}}</span>
                    </div>
                    <div>
                        <span>转化率：</span>
                        <span class="gray" v-if="(newMaterialsSku.unit===newMaterialsSku.purchaseUnitName)||(newMaterialsSku.unit==='米'&&newMaterialsSku.purchaseUnitName=='码')">{{newMaterialsSku.conversionRate}}</span>

                        <el-input v-else @change="conversionRateChange" class="total-input" type="number"
                                  v-model="newMaterialsSku.conversionRate">
                        </el-input>
                    </div>
                    <div>
                        <span class="font-bold">合计采购：</span>
                        <span class="font-bold orange">{{newMaterialsSku.totalPurchase}}{{newMaterialsSku.unit}}</span>
                    </div>
                </div>

                <el-table
                        height="500"
                        :data="filterSearchList"
                        border
                        class="custom-table tiny-row no-hover-highlight"
                        style="width: 100%">
                    <el-table-column prop="styleNo" label="商品款号" min-width="100">
                    </el-table-column>
                    <el-table-column prop="demandSourceBillNo" label="生产单号" width="160">
                        <template slot-scope="scope">
                            {{scope.row.demandSourceBillNo&&scope.row.demandSourceBillNo.length?scope.row.demandSourceBillNo :' 计划外采购'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="planBuyQuantity" label="计划采购" min-width="80">
                    </el-table-column>
                    <el-table-column class-name="yellow-bg" prop="stockActivePreuse" label="主动占用" min-width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.row.materialsSkuId && scope.row.demandSourceBillId"
                                 @click="showOccupy(scope.row,scope.$index)">
                                {{scope.row.stockActivePreuse}}
                            </div>
                            <div v-else></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="可用库存" min-width="80">
                        <template slot-scope="scope">
                            <div class="green">{{scope.row.stock}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialsNo" label="待采购" min-width="80">
                        <template slot-scope="scope">
                            <div class="red">{{scope.row.waitPurchaseQuantity}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            :render-header="renderHeader"
                            fixed="right" class-name="yellow-bg no-padding" label="本次采购" min-width="90">
                        <template slot-scope="scope">
                            <div>
                                <el-input style="width: 75px" @change="quantityChange($event,scope.row,scope.$index)" placeholder="请输入" type="number"
                                          v-model="scope.row.quantity"></el-input>
                                <span>{{newMaterialsSku.unit}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="isPickUpDelivery"  fixed="right" label="本次到料" width="80" class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div class="custom-cell pdlr10">
                                <el-input  @blur="checkInput" v-model="scope.row.quantityArrive"
                                           placeholder="请输入"  type="number" ></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="isPickUpDelivery"  fixed="right" label="本次送料" width="80"  class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div class="custom-cell pdlr10">
                                <el-input  @blur="checkInput" v-model="scope.row.quantityDelivery"
                                           placeholder="请输入"  type="number" ></el-input>
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
                <div class="fl lh32">已选生产单需求：<span v-if="newMaterialsSku.materialsSkus" class="orange">{{newMaterialsSku.materialsSkus.length}}条</span>
                </div>
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="confirm" type="primary">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改占用库存数 -->
        <!-- <occupyDialog @success="occupySuccess" v-model="occupy.occupyNum" :visible.sync="occupy.visible" :tableItem="occupy.tableItem"></occupyDialog> -->
        <initiativeDialong 
          :visible.sync="occupy.visible"  
          :skuId="skuId" 
          :materialPurchaseDemandId="materialPurchaseDemandId"
          :materialName="materialName"
          @success="occupySuccess" />
    </div>
</template>
<script>
    import {
        purchaseFacFieldConfigTargetView,
        updateUnitFacField
    } from '@/api/material.js'
    import OccupyDialog from '../../materielPurchase/need-purchase/occupyDialog'
    // 修改占用库存弹窗
    import initiativeDialong from '../../materielPurchase/need-purchase/initiativeDialog'
    const fun = require('../../../Common/commonFun.js')

    export default {
        props: ['visible', 'title', 'materialsSku','isPickUpDelivery'],

        data() {
            return {
                searchKeyWord: '',      //搜索词
                newMaterialsSku: [],
                occupy:{
                    visible:false,
                    occupyNum:'',
                    tableItem:{}
                },
                skuId:'',
                materialPurchaseDemandId:'',
                materialName:'',
                purchaseIndex:0
            }
        },
        created() {
          this.newMaterialsSku = JSON.parse(JSON.stringify(this.materialsSku))
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            filterSearchList() {
              let tableList = []
              if (this.searchKeyWord) {
                  tableList =  this.newMaterialsSku.materialsSkus.filter(item => (item.orderNo && item.orderNo.indexOf(this.searchKeyWord) > -1) ||
                      (item.styleNo && item.styleNo.indexOf(this.searchKeyWord) > -1))
              } else {
                  tableList =  this.newMaterialsSku.materialsSkus
              }
              console.log('列表数据',tableList)
              return tableList
            },
        },
        watch: {

        },
        components: {
            OccupyDialog,
            initiativeDialong
        },
        methods: {
            // 检查到料数、送料数合法性
            checkInput(e) {
                if(e.target.valueAsNumber<0){
                    this.$message.error('请输入正数')
                }
            },
            // 主动占用事件
            showOccupy(item,index){
                // 权限
                if(!this.powerJudgement.permissions("fac.purchaseOrder.occupy")){
                    return
                }
                this.purchaseIndex = index
                // console.log('可用库存数',item)
                // 标题栏：生产单号-商品款号-物料分类-物料款号-物料名称-颜色-规格-供应商
                this.materialName = `生产单号(DD00001)-商品款号(${item.styleNo})-物料信息（${this.newMaterialsSku.kindName}-${this.newMaterialsSku.materialsNo}-${this.newMaterialsSku.materialsName}-${this.newMaterialsSku.colorName}-${this.newMaterialsSku.unit}）`
                this.skuId = item.materialsSkuId
                this.materialPurchaseDemandId = item.materialPurchaseDemandId
                this.occupy.visible = true;
                // this.occupy.tableItem=item;
                // this.occupy.occupyNum=item.stockActivePreuse
            },
            /**
             * 修改占用库存
             */
            occupySuccess(list) {
              // console.log('修改占用库存',list)
              const editNums = list.map(item => item.quantity) || []
              let editPurchases = this.filterSearchList[this.purchaseIndex].stockActivePreuse
              if(editNums.length>0) {
                editPurchases = editNums.reduce((p,v,i,a)=>{
                  return fun.add(Number(p), Number(v))
                })
              }
              // console.log('主动占用数',editPurchases)
              this.$set(this.filterSearchList[this.purchaseIndex],'stockActivePreuse',editPurchases)
                // this.selected.forEach(v => {
                //     v.materialsSkus.forEach((_v,i) => {
                //         this.arriveSelection.forEach(s => {
                //             if(s.materialPurchaseDemandId === _v.materialPurchaseDemandId) {
                //                 this.$set(v.materialsSkus,i,s)
                //             }
                //         })
                //     })
                // })
            },
            // 本次采购改变时
            quantityChange(val,row,index) {
                if (val && !this.newMaterialsSku.conversionRate) {
                    this.$message.error('请先填写转化率')
                    this.$nextTick(function (e) {
                        this.$set(this.newMaterialsSku.materialsSkus[index], 'quantity',0)
                    })
                    return
                }
                this.$set(this.newMaterialsSku.materialsSkus[index], 'quantityArrive',val)
                this.$set(this.newMaterialsSku.materialsSkus[index], 'quantityDelivery',val)
                this.$nextTick(function (e) {
                    let totalPurchase = 0
                    if (this.newMaterialsSku.materialsSkus) {
                        this.newMaterialsSku.materialsSkus.forEach(item => {
                            totalPurchase = totalPurchase + Number(item.quantity ? item.quantity : 0)
                        })
                    }
                    this.$set(this.newMaterialsSku, 'totalPurchase', Number(totalPurchase.toFixed(4)))

                    let totalPurchaseQuantity = (this.newMaterialsSku.totalPurchase / this.newMaterialsSku.conversionRate).toFixed(4)
                    if (this.newMaterialsSku.totalPurchaseQuantity != totalPurchaseQuantity) {
                        this.$set(this.newMaterialsSku, 'totalPurchaseQuantity', Number(totalPurchaseQuantity))

                    }
                })
            },
            // 合计采购数改变时
            totalPurchaseQuantityChange(val) {
                if (val && !this.newMaterialsSku.conversionRate) {
                    this.$message.error('请先填写转化率')
                    this.$nextTick(function (e) {
                        this.$set(this.newMaterialsSku, 'totalPurchaseQuantity', '')
                    })
                    return
                }
                this.computedQuantity(val, this.newMaterialsSku.conversionRate)
            },
            // 转化率改变时
            conversionRateChange(val) {
                this.computedQuantity(this.newMaterialsSku.totalPurchaseQuantity, val)
            },
            // 计算从上往下每个本次采购的值
            computedQuantity(totalPurchaseQuantity, conversionRate) {
                if (totalPurchaseQuantity && conversionRate) {
                    // 合计采购=（合计采购数）*转化率
                    let totalQuantity = Number(Number(totalPurchaseQuantity) * Number(conversionRate).toFixed(4))
                    this.$set(this.newMaterialsSku, 'totalPurchase', Number(totalQuantity.toFixed(4)))
                    // console.log('合计采购数',totalQuantity)
                    for (let i = 0; i < this.newMaterialsSku.materialsSkus.length; i++) {
                        let item = this.newMaterialsSku.materialsSkus[i]
                        if (totalQuantity > 0) {
                            if (item.waitPurchaseQuantity >= totalQuantity) {
                                this.$set(item, 'quantity', item.waitPurchaseQuantity > totalQuantity ? totalQuantity : item.waitPurchaseQuantity)
                                totalQuantity = 0
                            } else {
                                this.$set(item, 'quantity', item.waitPurchaseQuantity)

                                totalQuantity = Number((totalQuantity - item.waitPurchaseQuantity).toFixed(4))
                            }
                        } else {
                            this.$set(item,'quantity',0)
                        }
                        this.$set(item, 'quantityArrive', item.quantity)
                        this.$set(item, 'quantityDelivery', item.quantity)

                    }
                    // 如果有剩余
                    if (totalQuantity > 0) {
                        let lastPurchaseDemand = this.newMaterialsSku.materialsSkus[this.newMaterialsSku.materialsSkus.length - 1]
                        if (lastPurchaseDemand.type == 1) {
                            this.$set(lastPurchaseDemand, 'quantity', lastPurchaseDemand.quantity ? lastPurchaseDemand.quantity + totalQuantity : totalQuantity)
                            this.$set(lastPurchaseDemand, 'quantityArrive',lastPurchaseDemand.quantity)
                            this.$set(lastPurchaseDemand, 'quantityDelivery',lastPurchaseDemand.quantity)
                        } else {
                            // console.log('计划外采购',this.newMaterialsSku)
                            let lastPurchaseDemand = {
                                type: 1,
                                materialsSkuId: this.newMaterialsSku.materialsSkuId,
                                demandSourceBillId: "",
                                materialPurchaseDemandId: "",
                                styleNo: "", //成衣款号
                                demandSourceBillNo: "", //生产单号
                                planBuyQuantity: 0, //计划采购
                                stockActivePreuse: 0, //主动占用
                                stock: this.newMaterialsSku.stock, //库存
                                waitPurchaseQuantity: 0,//待采购
                                quantity: totalQuantity, //本次采购
                                quantityArrive:totalQuantity,
                                quantityDelivery:totalQuantity
                            }
                            this.newMaterialsSku.materialsSkus.push(lastPurchaseDemand)
                        }
                    }
                } else {
                    this.newMaterialsSku.materialsSkus.forEach(item => {
                        this.$set(item,'quantity',0)
                        this.$set(item, 'quantityArrive', item.quantity)
                        this.$set(item, 'quantityDelivery', item.quantity)
                    })
                }
            },
            // 一键填齐本次采购
            fillAllPurchases() {
                if (!this.newMaterialsSku.conversionRate) {
                    this.$message.error('请先填写转化率')
                    return
                }
                let totalPurchase = 0
                this.newMaterialsSku.materialsSkus.forEach(item => {
                    // 按需采购才有带采购数
                    if (item.type == 0) {
                        this.$set(item, 'quantity', item.waitPurchaseQuantity)
                        this.$set(item, 'quantityArrive', item.waitPurchaseQuantity)
                        this.$set(item, 'quantityDelivery', item.waitPurchaseQuantity)
                        totalPurchase = totalPurchase + Number(item.waitPurchaseQuantity?item.waitPurchaseQuantity:0)
                    } else {
                        totalPurchase = totalPurchase + Number(item.quantity?item.quantity:0)

                    }
                })

                this.newMaterialsSku.totalPurchase = Number(totalPurchase.toFixed(4))
                this.newMaterialsSku.totalPurchaseQuantity = Number((this.newMaterialsSku.totalPurchase / this.newMaterialsSku.conversionRate).toFixed(4))
                // 合计采购/转化率

            },
            // 删除采购需求
            deleteRow(index) {
                this.newMaterialsSku.materialsSkus.splice(index, 1)
            },
            cancel() {
                this.$emit('update:visible', false)
            },
            confirm() {
                this.$emit('update:visible', false)
                this.$emit('confirm', this.newMaterialsSku)

            },
            renderHeader(){
                return <div class="custom-header">
                    <span>本次采购</span>
                    <el-tooltip effect="light" content="本次采购/库存单位"  placement="top"><i class='el-icon-information' style='padding-left:5px'></i></el-tooltip>
                </div>


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
