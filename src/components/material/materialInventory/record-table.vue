<template>
    <div class="record-table">
        <el-row>
            <el-table class="custom-table"
                    :data="listInfo"
                    stripe
                    border
                    empty-text="暂无库存变动记录数据"
                    @row-click="getDetaile"
            >
                <el-table-column
                        prop="materialKindName"
                        label="分类"
                >
                </el-table-column>
                <el-table-column
                        prop="materialNo"
                        label="物料款号">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="supplierName"-->
                        <!--label="供应商"-->
                        <!--width="120">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="sampleMaterial"
                        label="样料"
                        width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.sampleMaterial?'样料':''}}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="styleColor"-->
                        <!--label="供应商款号/色号"-->
                        <!--width="140">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="materialName"
                        label="物料名称"
                        width="110">
                </el-table-column>
                <el-table-column
                        prop="materialColor"
                        label="颜色"
                >
                </el-table-column>
                <el-table-column
                        prop="specificationsNo"
                        label="规格"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.specificationsRemark&&scope.row.specificationsRemark!==''">{{scope.row.specificationsRemark}}</span>
                        <span v-else>{{scope.row.specificationsNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="inventoryUnit"
                        label="库存单位"
                >
                </el-table-column>
                <el-table-column
                        prop="position"
                        label="仓位"
                >
                </el-table-column>
                <el-table-column
                        prop="inventoryTypeText"
                        label="变动类型"
                >
                    <template slot-scope="scope">
                        <div>
                            <span :class="changeTypeClass(scope.row.inventoryTypeText)">{{scope.row.inventoryTypeText}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="changeNum"
                        label="变动数量"
                >
                </el-table-column>
                <el-table-column
                        prop="opByPerson"
                        label="操作人"
                >
                </el-table-column>
                <el-table-column
                        prop="opByUnit"
                        label="操作工厂"
                >
                </el-table-column>
                <el-table-column
                        prop="opAt"
                        label="变动时间"
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="70"
                >
                    <template slot-scope="scope" v-if="cancelShow(scope.row)">
                        <div class="change-msg-cancel" @click="cancelRow(scope.row.stockChangeId)">撤销</div>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <div class="supplier-page">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageInfo.currentPage"
                        :page-size="pageInfo.pageSize"
                        :total="pageInfo.totalCount"
                        layout="total, prev, pager, next">
                </el-pagination>
            </div>
        </el-row>
        <!--撤销弹窗-->
        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="cancelDialog" modal="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定撤销此库存变动记录？</p>
            </div>
            <div class="footer">
                <nf-button @click="handleCancel">取消</nf-button>
                <nf-button type="warning" @click="handleCommit" :loading="isloading">确定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        cancelChangeStock
    } from "@/api";
    export default {
        name: "record-table",
        props: ['listInfo', 'pageInfo'],
        data() {
            return {
                cancelDialog: false,    //撤销弹窗
                cancelId: '',        //撤销记录id
                currentPage: 1      //当前页
            }
        },
        methods: {
            //是否显示撤销按钮
            cancelShow(row){
                if(row.opType === 'HAND' && (row.inventoryType === "1" || row.inventoryType === "2" || row.inventoryType === "3")){
                    return true
                }else{
                    return false
                }
            },
            //点击撤销
            cancelRow(id){
                this.cancelDialog = true;
                this.cancelId = id;
            },
            //取消撤销弹窗
            handleCancel(){
                this.cancelDialog = false;
            },
            //确认撤销库存记录
            handleCommit(){
                let params ={
                    id : this.cancelId      //库存变动记录Id
                };
                cancelChangeStock(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.handleCurrentChange(this.currentPage);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.cancelDialog = false;
                });
            },
            //根据变动记录返回对应的class名
            changeTypeClass(val){
                if(val === '入库'){
                    return 'color-rk';
                }else if(val === '出库'){
                    return 'color-ck';
                }else if(val === '调整'){
                    return 'color-tz';
                }else if(val === '退货'){
                    return 'color-th';
                }else if(val === '发货'){
                    return 'color-fh';
                }else if(val === '代发货'){
                    return 'color-dfh';
                }else if(val === '代退货'){
                    return 'color-dth';
                }else if(val === '送料'){
                    return 'color-sl';
                }else if(val === '到料'){
                    return 'color-dl';
                }else if(val === '验布'){
                    return 'color-yb';
                }else if(val === '缩布'){
                    return 'color-sb';
                }else if(val === '退料'){
                    return 'color-tl';
                }
            },
            //分页切换
            handleCurrentChange(val) {
                this.currentPage = val;
                this.$emit("pageChange", this.currentPage);
            }
        },
        created(){
        }
    }
</script>

<style lang="scss" scoped>
    .record-table {
        .supplier-page {
            padding-right: 30px;
            margin: 20px 0;
            text-align: right;
        }
        .change-msg-cancel{
            text-decoration: underline;
            color: #808080;
            cursor: pointer;
            &:hover{
                color: #3B3B3B;
            }
        }
        .repertory_dialog {
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 20px 20px 0 20px;
            }
            .title {
                width: 100%;
                height: 52px;
                text-align: center;
                line-height: 52px;
                font-size: 20px;
                color: #3b3b3b;
                border-bottom: 1px solid #e0e6ed;
            }
            .footer {
                padding: 0 32px 32px 36px;
                button {
                    margin: 0 6px;
                }
            }
        }
        .repertory_dialog--dele {
            .el-dialog {
                width: 766px;
            }
            .body {
                text-align: center;
                P {
                    margin: 32px 0;
                    font-size: 14px;
                    color: #3b3b3b;
                }
            }
            .footer {
                display: flex;
                justify-content: center;
                padding-top: 28px;
                border-top: 1px solid #e0e6ed;
            }
        }
        .color-rk {
            color: #23C811;
        }
        .color-ck {
            color: #FF7F14;
        }
        .color-tz {
            color: #FA4150;
        }
        .color-sl {
            color: #5C67E6;
        }
        .color-th{
            color:#009482;
        }
        .color-fh{
            color:#808080;
        }
        .color-dfh{
            color:#808080;
        }
        .color-dth{
            color:#009482;
        }
        .color-dl{
            color:#C240DC;
        }
        .color-yb{
            color:#1CA1FF;
        }
        .color-sb{
            color:#1CA1FF;
        }
        .color-tl{
            color:#009482;
        }

    }
</style>
<style lang="scss">
    .record-table{
        .el-dialog{
            width: auto;
        }
        .el-dialog__body{
            padding: 20px 20px 0 20px;
        }
    }
</style>
