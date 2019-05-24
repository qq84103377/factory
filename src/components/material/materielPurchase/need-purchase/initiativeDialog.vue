<template>
    <div class="remain-dialog">
        <el-dialog
                class="custom-dialog"
                title="占用可用库存"
                :visible.sync="visible"
                :modal-append-to-body="false"
                @close="cancel">
            <div class="main-wrap" v-loading="loading">
                <div class="yellow-border-title mgb10">
                    <h2 class="title">{{materialName}}</h2>
                </div>
                <div class="table-wrap">
                    <div style="text-align: right">主动占用：<span class="orange">{{total}}</span>米</div>
                    <el-table
                            :data="tableData"
                            border
                            class="custom-table tiny-row mgt8">
                        <el-table-column prop="storehouseName" label="仓库/加工厂仓库"></el-table-column>
                        <el-table-column prop="preuseQuantity" label="可用数"  width="180"></el-table-column>
                        <el-table-column prop="stock" label="库存数"  width="180"></el-table-column>
                        <el-table-column label="本次占用"  width="120">
                            <template slot-scope="scope">
                                <el-input
                                        @change="quantityChange"
                                        class="quantity-input"
                                        type="number"
                                        v-model="scope.row.quantity">
                                </el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="text-right">
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="confirm" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        initiativeList
    } from "@/api/material";
    import {
        stockActivePreuse
    } from "@/api";
    export default {
        props: ['visible', 'skuId', 'materialName','materialPurchaseDemandId'],
        data() {
            return {
                loading:false,
                tableData: [],
                orderNum: 0,
                remainNum: 0,
                total: 0,
            }
        },
        watch:{
            visible(val){
                if(val){
                    this.getTableData();
                }
            }
        },
        methods: {
            //合计
            quantityChange(){
                this.total = 0;
                this.tableData.forEach(item => {
                    item.quantity = item.quantity ? item.quantity : 0;
                    this.total += parseFloat(item.quantity);
                });
            },
            //获取表格数据
            getTableData() {
                this.loading = true;
                let params = {
                    materialsSkuId: this.skuId,
                };
                initiativeList(params).then(res => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data;
                        this.tableData.forEach(item => {
                            this.$set(item, 'quantity', '');
                            // item.quantity = ''
                        })
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
            },

            //提交
            confirm(){
                let storeArr = [];
                this.tableData.forEach(item => {
                    if(item.quantity === ''){
                        this.$message.error('请填写本次占用');
                        return
                    }
                    let obj = {};
                    obj.storehouseId = item.storehouseId;
                    obj.quantity = item.quantity;
                    storeArr.push(obj);
                });
                let params = {
                    materialPurchaseDemandId: this.materialPurchaseDemandId,
                    unitId: this.$common.unitId(),
                    userId: this.$common.unitId(),
                    stockQuantitys: storeArr
                };
                stockActivePreuse(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('success',this.tableData);
                        this.$emit('update:visible',false)
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            cancel(){
                this.$emit('update:visible',false)
            },
        },
    }
</script>
<style lang="scss" scoped>
    .remain-dialog{
        .orange-btn{
            color:#ff9c38 ;
            background: transparent;
            border: 1px solid #ff9c38;
        }
        i.magnifier {
            margin-left: 5px;
        }
        .table-wrap{

        }
    }
</style>
<style lang="scss">
    .remain-dialog {
        .search-input{
            width: 360px;
            .el-input__inner{
                height: 32px;
            }
        }
        .el-dialog--small{
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
