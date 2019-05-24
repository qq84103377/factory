<template>
    <div>
        <el-dialog
                size="large"
                class="prod-add-dialog"
                :modal-append-to-body="false"
                :show-close="false"
                @close="$emit('update:visible',false)"
                :visible.sync="visible">
            <div slot="title" style="text-align: center;font-size: 16px;">按生产单添加</div>
            <div class="prod-add-dialog__body">
                <div>
                    <span style="margin-right: 8px;">搜索</span>
                    <el-input icon="search" style="width: 360px;" @input="pageNum = 1;getList()" v-model="keyword" placeholder="输入采购单号/物料款号/名称/供应商/供应商款号/供应商色号/商品款号/生产单号/整单外发添加"></el-input>
                </div>
                <el-table
                        height="9999"
                        v-loading="loading"
                        ref="multipleTable"
                        :data="tableData"
                        border
                        tooltip-effect="dark"
                        style="width: 100%;margin-top: 8px;"
                        @select="handleSelection"
                        @select-all="handleCheckAllChange">
                    <el-table-column
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="采购单号" align="center" width="120">
                    </el-table-column>
                    <el-table-column v-if="isSampleMaterial" prop="designStyleNo" label="设计款号" align="center" width="120">
                        <template slot-scope="scope">
                            <div>{{scope.row.designStyleNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseDate" label="采购日期" align="center" width="120">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.purchaseDate| filterTime}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="分类" width="140" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row"
                                 v-for="item in  scope.row.meterialSkuSet">
                                {{item.kindName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="图片" width="140" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}" class="cell__row"
                                 v-for="item in  scope.row.meterialSkuSet">
                                <!--<img style="width:70px;height: 100%;margin-left: 10px;"-->
                                     <!--v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"-->
                                     <!--@click="imgList(item)"-->
                                     <!--:src="item.commonMaterialsPictureList[0].path?item.commonMaterialsPictureList[0].path:item.commonMaterialsPictureList[0]"-->
                                     <!--alt="">-->

                                <img @click="previewImg(item)" v-errorLogo style="display:inline-block;vertical-align: middle;width: 32px;height: 32px;margin: 0 auto;"
                                :src="item.commonMaterialsPictureList[0]"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="colorName" label="物料款号" align="center" width="120">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.materialsNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="colorName" label="物料名称" align="center" width="120">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.materialsName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unArrivedPurchaseQuantity" label="颜色" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.colorName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="规格" width="120" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.specificationsRemark}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="isSampleMaterial" prop="colorName" label="样料" align="center" width="120">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.sampleMaterial?'样料':''}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="供应商" align="center" width="140">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.supplierName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="供应商款号/色号" align="center" width="140">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.specificationsNo}}/{{item.supplierColorNo}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" label="库存单位" width="100" align="center">
                        <template slot-scope="scope">
                            <div :style="{'height':item.meterialPurchaseDetail.length * 32+'px'}"
                                 class="cell__row" v-for="item in  scope.row.meterialSkuSet">
                                {{item.unit}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!isSampleMaterial" prop="waitPurchaseQuantity" label="商品款号" align="center" width="120">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div v-if="items.type===0" :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     class="cell__row-border"
                                     v-for="(items,indexs) in item.meterialPurchaseDetail" :key="indexs">
                                    <div>{{items.styleNo}}</div>
                                </div>
                                <div v-else
                                     :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     style="height:32px;line-height:32px;padding-left:12px;border-bottom:1px solid rgb(223, 228, 236);">
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" label="生产单号" align="center" v-if="!isSampleMaterial" min-width="180">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div v-if="items.type===0" :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     class="cell__row-border"
                                     v-for="(items,indexs) in item.meterialPurchaseDetail" :key="indexs">
                                    <div>{{items.demandSourceBillNo}}</div>
                                </div>
                                <div v-else
                                     :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     style="height:32px;line-height:32px;padding-left:12px;border-bottom:1px solid rgb(223, 228, 236);">
                                    计划外采购
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" label="整单外发" align="center" min-width="180">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div v-if="items.type===0" :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     class="cell__row-border"
                                     v-for="(items,indexs) in item.meterialPurchaseDetail" :key="indexs">
                                    <div>{{items.outsideFactoryName}}</div>
                                </div>
                                <div v-else
                                     :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     style="height:32px;line-height:32px;padding-left:12px;border-bottom:1px solid rgb(223, 228, 236);">
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="waitPurchaseQuantity" label="计划采购" align="center" v-if="!isSampleMaterial" width="120">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div v-if="items.type===0" :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     class="cell__row-border"
                                     v-for="(items,indexs) in item.meterialPurchaseDetail" :key="indexs">
                                    <div>{{items.planBuyQuantity}}</div>
                                </div>
                                <div v-else
                                     :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                     style="height:32px;line-height:32px;padding-left:12px;border-bottom:1px solid rgb(223, 228, 236);">
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column prop="waitPurchaseQuantity" label="本次采购" width="120" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    {{items.purchaseQuantityNow}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="采购未到" align="center" width="120">
                        <template slot-scope="scope">
                            <div v-for="(item,indexsku) in scope.row.meterialSkuSet" :key="indexsku">
                                <div
                                        :class="{'boder-none':scope.row.meterialSkuSet&&indexsku==scope.row.meterialSkuSet.length-1&&indexs==item.meterialPurchaseDetail.length-1}"
                                        class="cell__row-border" v-for="(items,indexs) in item.meterialPurchaseDetail"
                                        :key="indexs">
                                    {{items.unArrivedPurchaseQuantity}}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="display: flex;justify-content: space-between;margin-top: 8px;">
                    <div>已选 <span style="color: #ff8d37">{{selection.length}}</span> 条生产单</div>
                    <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next"
                                   :total="total" :current-page.sync="pageNum">
                    </el-pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="selection=prodSelectList;$emit('update:visible',false)">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </span>
        </el-dialog>

        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </div>
</template>

<script>
    import {purchaseList} from '@/api/material.js'
    export default {
        name: "purchase-add-dialog",
        props: ['visible','prodSelectList','supId','supplierId'],
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            isSampleMaterial() {
                return this.$route.path === '/samplePurchaseList'|| this.$route.path === '/sampleMaterialDetail'|| this.$route.path === '/sampleMaterialList'
            },
        },
        data() {
            return {
                keyword: '',
                tableData: [],
                total: 0,
                pageNum: 1,
                loading: false,
                selection: [],
                previewList:[],
            }
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        watch: {
          visible(v) {
              if(v) {
                  this.selection = JSON.parse(JSON.stringify(this.prodSelectList))
                  // this.keyword = ''
                  this.pageNum = 1
                  this.getList()
              }
          }
        },
        methods: {
            // 预览图片
            previewImg(row){
                if (!row.commonMaterialsPictureList.length) return;
                this.previewList = row.commonMaterialsPictureList.map(item => {
                    return {
                        path: item
                    }
                });
                this.$nextTick(() => {
                    this.$refs["previewer"].show(0)
                });
            },
            handleConfirm() {
              console.log('生产单选择信息',this.selection)
              this.$emit('update:visible',false)
              this.$emit('confirm',this.selection)
            },
            loadingMore(page) {
                this.pageNum = page
                this.getList(this.pageNum)
            },
            // 全选/取消全选操作
            handleCheckAllChange(selection) {
                let isCheckAll = selection.length>0
                if(isCheckAll){
                    selection.forEach(item => {
                        if(!this.selection.some(v => v.orderNoId === item.orderNoId)){
                            this.selection.push(item)
                        }
                    })
                } else {
                    let deleteLineIds = this.tableData.map(item => item.orderNoId)
                    let tempList = []
                    this.selection.forEach(item =>{
                        if(!deleteLineIds.includes(item.orderNoId)){
                            tempList.push(item)
                        }
                    })
                    this.selection = tempList
                }
            },
            handleSelection(selection,row) {
                let selectedLineIds = selection.map(item => item.orderNoId)
                let isChecked = selectedLineIds.includes(row.orderNoId)
                if(isChecked){
                    this.selection.push(row)
                } else {
                    this.selection.splice(this.selection.findIndex(item => item.orderNoId == row.orderNoId),1)
                }
            },
            getList(pageNum=1) {
                this.loading = true
                let params = {
                    arriveStatus: [0, 1],
                    belongModule: this.isSampleMaterial?1:0,
                    cancel: 0,
                    searchColumn: this.keyword,
                    pageNum,
                    pageSize: 20,
                    outsideFactoryId: this.supId,
                    supplierIdList: this.supplierId?[this.supplierId]:[],
                    unitId: this.unitId
                }
                purchaseList(params).then(res => {
                    this.loading = false
                    this.tableData = res.data.data.list || []
                    this.total = res.data.data.total
                    this.$nextTick(() => {
                        this.tableData.forEach(row => {
                            this.$refs.multipleTable.toggleRowSelection(row,this.selection.some(v => v.orderNoId==row.orderNoId))
                        });
                    })
                })
            }
        },
        created() {
            // this.getList()
        }
    }
</script>

<style lang="scss">
    .prod-add-dialog{
        .el-dialog {
            display: flex;
            flex-direction: column;
            height: 80%;
            top: 50% !important;
            transform: translate(-50%,-50%);
            &__body{
                display: flex;
                flex-direction: column;
                flex: 1;
                .prod-add-dialog__body{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .el-table{
                        overflow-y: auto;
                        .cell {
                            padding: 0;
                        }
                    }
                }
            }
        }
    }
</style>
<style lang="scss" scoped>
    .prod-add-dialog{
        .boder-none{
            border:none!important;
        }
        .cell__row {
            height: 32px;
            /*line-height: 32px;*/
            display: flex;
            flex-direction: column;
            justify-content: center;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child {
                border: none;
            }
        }
        .cell__row-border {
            height: 32px;
            /*line-height: 32px;*/
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
        }
    }
</style>