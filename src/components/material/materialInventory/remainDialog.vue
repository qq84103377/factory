<template>
    <div class="remain-dialog">
        <el-dialog
                class="custom-dialog"
                title="生产参考余料详情"
                :visible.sync="visible"
                :modal-append-to-body="false"
                @close="cancel">
            <div class="main-wrap" v-loading="loading">
                <div class="yellow-border-title mgb20">
                    <h2 class="title">{{materialName}}</h2>
                </div>
               <div class="table-wrap">
                   <el-table
                           :data="tableData"
                           border
                           class="custom-table tiny-row mgt8">
                       <el-table-column prop="styleNo" label="成衣款号"  width="180"></el-table-column>
                       <el-table-column prop="facMissionNo" label="工单号"  width="180"></el-table-column>
                       <el-table-column prop="commonOutsideFactroyName" label="整单外发"  width="80"></el-table-column>
                       <el-table-column prop="dateComplete" label="完成日期"  width="140"></el-table-column>
                       <el-table-column prop="prcdNodeName" label="节点名称"  width="180"></el-table-column>
                       <el-table-column prop="quantityDelivered" label="已送料"  width="100"></el-table-column>
                       <el-table-column
                               prop="referenceUseQuantity"
                               label="参考送料"
                               :render-header="renderHeader1"
                               width="100">
                           <template slot-scope="scope">
                               <div>{{scope.row.referenceUseQuantity}}</div>
                           </template>
                       </el-table-column>
                       <el-table-column prop="inStoreQuantity" label="已余料入库"  width="120"></el-table-column>
                       <el-table-column
                               prop="referenceRemainQuantity"
                               label="生产参考余料"
                               :render-header="renderHeader2"
                               width="140">
                           <template slot-scope="scope">
                               <div>{{scope.row.referenceRemainQuantity}}</div>
                           </template>
                       </el-table-column>

                   </el-table>
               </div>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32" >合计：<span class="orange">{{orderNum}}</span>个生产工单，生产参考余料<span class="orange">{{remainNum}}</span>米</div>
                <el-button @click="cancel">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        queryRemaindDetail
    } from "@/api/material";
    export default {
        props: ['visible', 'skuId', 'materialName'],
        data() {
            return {
                loading:false,
                tableData: [],
                orderNum: 0,
                remainNum: 0,
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
            //获取表格数据
            getTableData() {
                this.loading = true;
                let params = {
                    commonMaterialsSkuId: this.skuId
                };
                queryRemaindDetail(params).then(res => {
                    if (res.data.code === 0) {
                        this.tableData = res.data.data;
                        this.computational(this.tableData);
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.loading = false;
                });
            },
            //计算工单数和余料数
            computational(data){
                if(data.length){
                    this.orderNum = 0;
                    this.remainNum = 0;
                    let arr = [];
                    data.forEach(item =>{
                        arr.push(item.facMissionNo);
                        this.remainNum += item.referenceRemainQuantity
                    });
                    //去重
                    arr = Array.from(new Set(arr));
                    this.orderNum = arr.length;
                    this.remainNum = this.remainNum.toFixed(2);     //四舍五入，保留两位
                }
            },
            renderHeader1(){
                return <div class="bom-rander-header"><span>参考用料</span><el-tooltip class="item" effect="light" content="参考用料数=工单出货数×单件用量×（1+损耗%）"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader2(){
                return <div class="bom-rander-header"><span>生产参考余料</span><el-tooltip class="item" effect="light" content="生产参考余料=已送料-参考用料-已余料入库"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
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
            /*top: 30px !important;*/
            /*width:80%;*/
            /*min-width: 1366px;*/
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
