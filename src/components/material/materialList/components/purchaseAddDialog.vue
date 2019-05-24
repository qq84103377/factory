<template>
    <el-dialog
            size="large"
            class="purchase-add-dialog"
            :modal-append-to-body="false"
            :show-close="false"
            @close="$emit('update:visible',false)"
            :visible.sync="visible">
        <div slot="title" style="text-align: center;font-size: 16px;">按采购单添加</div>
        <div class="purchase-add-dialog__body">
            <div>
                <span style="margin-right: 8px;">搜索</span>
                <el-input icon="search" style="width: 360px;" @input="pageNum = 1;getList()" v-model="keyword" placeholder="输入采购单/采购员/供应商/生产单号/商品款号/商品名称"></el-input>
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
                <el-table-column
                        align="center"
                        label="采购单号"
                        prop="billPurchaseOrderNo">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="采购员"
                        prop="purchaserName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="采购日期"
                        prop="datePurchase">
                    <template slot-scope="scope">
                        <div v-if="scope.row.datePurchase">{{scope.row.datePurchase.substr(0,10)}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="供应商"
                        prop="supplierName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="生产单号"
                        prop="orderNo">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="商品款号"
                        prop="styleNo">
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: space-between;margin-top: 8px;">
                <div>已选 <span style="color: #ff8d37">{{selection.length}}</span> 条采购单</div>
                <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next"
                               :total="total" :current-page.sync="pageNum">
                </el-pagination>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="selection=purchaseSelectList;$emit('update:visible',false)">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
    import {purchaseList2} from '@/api/material.js'
    import {pagePurchase} from '@/api'
    export default {
        name: "purchase-add-dialog",
        props: ['visible','purchaseSelectList','supId','supplierId'],
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
        },
        data() {
            return {
                keyword: '',
                tableData: [],
                total: 0,
                pageNum: 1,
                loading: false,
                selection: []
            }
        },
        watch: {
          visible(v) {
              if(v) {
                  this.selection = JSON.parse(JSON.stringify(this.purchaseSelectList))
                  // this.keyword = ''
                  this.pageNum = 1
                  this.getList()
              }
          }
        },
        methods: {
            handleConfirm() {
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
                        if(!this.selection.some(v => v.billPurchaseId === item.billPurchaseId)){
                            this.selection.push(item)
                        }
                    })
                } else {
                    let deleteLineIds = this.tableData.map(item => item.billPurchaseId)
                    let tempList = []
                    this.selection.forEach(item =>{
                        if(!deleteLineIds.includes(item.billPurchaseId)){
                            tempList.push(item)
                        }
                    })
                    this.selection = tempList
                }
            },
            handleSelection(selection,row) {
                let selectedLineIds = selection.map(item => item.billPurchaseId)
                let isChecked = selectedLineIds.includes(row.billPurchaseId)
                if(isChecked){
                    this.selection.push(row)
                } else {
                    this.selection.splice(this.selection.findIndex(item => item.billPurchaseId == row.billPurchaseId),1)
                }
            },
            getList(pageNum=1) {
                this.loading = true
                let params = {
                    unitId: this.unitId,
                    keyword: this.keyword,
                    pageNo: pageNum,
                    pageSize: 20,
                    outsideFactoryId: this.supId,
                    supplierId: this.supplierId
                }
                pagePurchase(params).then(res => {
                    this.loading = false
                    this.tableData = res.data.data.list || []
                    this.total = res.data.data.totalCount
                    this.$nextTick(() => {
                        this.tableData.forEach(row => {
                            this.$refs.multipleTable.toggleRowSelection(row,this.selection.some(v => v.billPurchaseId==row.billPurchaseId))
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
    .purchase-add-dialog{
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
                .purchase-add-dialog__body{
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    .el-table{
                        overflow-y: auto;
                    }
                }
            }
        }
    }
</style>