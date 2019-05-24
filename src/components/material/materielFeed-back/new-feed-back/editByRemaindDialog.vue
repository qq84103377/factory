<template>
    <!-- 按单编辑 -->
    <div class="edit-by-remaind">
        <el-dialog
                class="custom-dialog"
                :title="title"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="cancel">
            <div>
                <div class="yellow-border-title" style="margin-bottom: 15px;">
                    <h2 class="title">物料：
                        {{newMaterialsSku.materialsKindName}}-
                        {{newMaterialsSku.materialsNo}}-
                        {{newMaterialsSku.materialsName}}-
                        {{newMaterialsSku.colorName}}-
                        {{newMaterialsSku.specificationsNo}}-
                        {{newMaterialsSku.supplierName}}
                    </h2>
                </div>
                <div class="search-area" v-if="handle === 'edit'">
                    <el-button @click="oneKey" size="small" class="blue-btn">按参考余料一键填齐</el-button>
                </div>
                <div class="total-area mgt8" v-if="handle === 'edit'">
                    <span class="total-num">
                        <span class="font-bold">总参考余料：</span>
                        <span class="font-bold orange">{{remaindSum}}</span>
                    </span>
                    <span class="total-input">
                        <span>合计入库：</span>
                        <el-input @change="totalQuantityChange" class="total-input" type="number"
                                  v-model="newMaterialsSku.totalQuantity">
                        </el-input>
                    </span>
                </div>

                <el-table
                        :data="newMaterialsSku.skuDeepDetails"
                        border
                        class="custom-table tiny-row no-hover-highlight"
                        style="width: 100%">
                    <el-table-column
                            prop="styleNo"
                            label="成衣款号"
                            width="120">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.type === 1">计划外余料入库</span>
                                <span v-else>{{scope.row.styleNo}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="facMissionNo" label="生产单号" width="180"></el-table-column>
                    <el-table-column prop="commonOutsideFactroyName" label="整单外发" width="100"></el-table-column>
                    <el-table-column prop="dateComplete" label="完成日期" width="120"></el-table-column>
                    <el-table-column prop="prcdNodeName" label="节点类型" width="100"></el-table-column>
                    <el-table-column prop="quantityDelivered" label="已送料" width="80"></el-table-column>
                    <el-table-column
                            :render-header="renderHeader1"
                            prop="referenceUseQuantity"
                            label="参考用料"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="inStoreQuantity"
                            label="已余料入库"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            :render-header="renderHeader2"
                            prop="referenceRemainQuantity"
                            label="生产参考余料"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            v-if="handle === 'edit'"
                            fixed="right"
                            class-name="yellow-bg no-padding"
                            label="本次入库"
                            width="100">
                        <template slot-scope="scope">
                            <div>
                                <el-input
                                        style="width: 80px"
                                        @change="handleInStore(scope.row, scope.$index)"
                                        placeholder="请输入"
                                        type="number"
                                        v-model="scope.row.quantity">
                                </el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-else
                            fixed="right"
                            label="本次入库"
                            width="100">
                        <template slot-scope="scope">
                            <div>
                                <span>{{scope.row.quantity}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="handle === 'edit'"
                            class-name="no-padding"
                            label="操作"
                            fixed="right"
                            width="80"
                            align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type !== 1" @click="deleteRow(scope.$index)" class="item red pointer">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="text-right">
                <div class="fl lh32" v-if="handle === 'edit' && newMaterialsSku.skuDeepDetails">
                    已包含 <span class="orange">{{newMaterialsSku.skuDeepDetails.length - 1}}</span> 个生产单需求
                </div>
                <template v-if="handle === 'edit'">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button @click="confirm" type="primary">确 定</el-button>
                </template>
                <template v-else>
                    <el-button @click="cancel">关 闭</el-button>
                </template>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ['visible', 'title', 'materialsSku', 'handle'],
        /******
         * handle 操作类型： 默认值为edit;
         *                  ‘edit’编辑    ‘see’查看
         *
         *
         * *******/

        data() {
            return {
                newMaterialsSku: [],
            }
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch: {
            visible(val) {
                if (val) {
                    this.initTableData();
                }
            }
        },
        methods: {
            //本次入库
            handleInStore(){
                this.newMaterialsSku.totalQuantity = 0;
                this.newMaterialsSku.skuDeepDetails.forEach(item => {
                    this.newMaterialsSku.totalQuantity += parseFloat(item.quantity); //计算“合计入库”
                });
            },
            // 一键填齐
            oneKey(){
                this.newMaterialsSku.totalQuantity = 0;
                this.newMaterialsSku.skuDeepDetails.forEach(item => {
                    this.$set(item, 'quantity', item.referenceRemainQuantity);
                    this.newMaterialsSku.totalQuantity += item.referenceRemainQuantity; //计算“合计入库”
                })
            },
            //合计入库计算
            totalQuantityChange(val){
                let total = val;
                let datails = this.newMaterialsSku.skuDeepDetails;
                datails.forEach(item =>{
                    //计划内
                    if(item.referenceRemainQuantity){
                        if(total >= item.referenceRemainQuantity){
                            item.quantity = item.referenceRemainQuantity;
                            total -= item.referenceRemainQuantity;
                        }else{
                            item.quantity = total;
                            total = 0;
                        }
                    }
                    //计划外
                    else{
                        item.quantity = total;
                    }
                })
            },
            //初始化表格数据
            initTableData(){
                this.remaindSum = 0;
                this.materialsSku.skuDeepDetails.forEach(item => {
                    this.remaindSum += item.referenceRemainQuantity; //计算“总参考余料”
                });
                this.newMaterialsSku = JSON.parse(JSON.stringify(this.materialsSku));  //备份数据
            },
            // 删除采购需求
            deleteRow(index) {
                this.newMaterialsSku.materialsSkus.splice(index, 1)
            },
            cancel() {
                this.$emit('update:visible', false)
            },
            confirm() {
                this.$emit('update:visible', false);
                this.$emit('confirm', this.newMaterialsSku)

            },
            renderHeader1(){
                return <div class="bom-rander-header"><span>参考用料</span><el-tooltip class="item" effect="light" content="参考用料数=工单出货数×单件用量×（1+损耗%）"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader2(){
                return <div class="bom-rander-header"><span>生产参考余料</span><el-tooltip class="item" effect="light" content="生产参考余料=已送料-参考用料-已余料入库，小于0时取0"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
        },
    }
</script>
<style lang="scss" scoped>
    .edit-by-remaind {
        .search-area {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .total-area {
            font-size: 12px;
            padding: 8px;
            border: 1px solid #E6EAF0;
            border-bottom: none;
            background: rgb(238, 240, 246);
            overflow: hidden;
            text-align: right;
            .total-num{
                display: inline-block;
                margin-right: 20px;
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
            margin-left: auto;
        }
        .total-wtap{
            float: right;
            overflow: hidden;
        }
        i.magnifier{
            margin-left: 5px;
        }
    }
</style>
<style lang="scss">
    .edit-by-remaind {
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
                padding: 20px;
            }
            .el-dialog__footer {
                padding: 15px 20px;
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
