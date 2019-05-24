<template>
    <section class="mat-batch">
        <el-row>
            <page-title class="mat-batch__title">
                <div class="title" slot="title">
                    批量{{isInStorge ? '入库' : '出库'}}：
                    <span :class="[isInStorge ? 'green' : 'orange']">{{goodStyleNum}}款物料sku，合计数量{{totalNum}}</span>
                </div>
                <div class="btn-warp">
                    <nf-button @click="$router.go(-1)">取消</nf-button>
                    <nf-button type="warning" @click="submit" :loading="isloading">完成</nf-button>
                </div>
            </page-title>
        </el-row>
        <el-row>
            <div class="mat-batch__content">
                <el-table
                        :data="tableData4"
                        stripe
                        border
                        empty-text="暂无物料库存数据"
                        @row-click="getDetaile"
                >
                    <el-table-column
                            prop="kindsName"
                            label="分类"
                    >
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="120">
                        <template slot-scope="scope">
                            <div>
                                <img style="width: 80px;height: 40px;margin-top: 8px;"
                                     @click="imgList(scope.row)"
                                     v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                     :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0].path:''"
                                     alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="materialsNo"
                            label="物料款号">
                    </el-table-column>
                    <el-table-column
                            prop="supplierName"
                            label="供应商">
                    </el-table-column>
                    <el-table-column
                            prop="styleColor"
                            label="供应商款号/色号">
                    </el-table-column>
                    <el-table-column
                            prop="materialsName"
                            label="物料名称">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="specificationsName"
                            label="规格"
                    >
                        <template slot-scope="scope">
                            <div>{{scope.row.specificationsName?scope.row.specificationsName:scope.row.specificationsNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="stockUnitName"
                            label="库存单位"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="position"
                            label="仓位"
                    >
                        <template slot-scope="scope">
                            <div v-if="!scope.row.position" class="div_input_shu">
                                <el-input v-model.trim="scope.row.positionInput" placeholder="未填写"></el-input>
                            </div>
                            <span v-else>{{scope.row.position}}</span>
                        </template>
                    </el-table-column>
                    <template>
                        <el-table-column
                                prop="stock"
                                :label="isInStorge ? '入库数': '出库数'"
                                class="green"
                        >
                            <template slot-scope="scope">
                                <div :class="[isInStorge ? 'green' : 'origin', 'div_input_shu']">
                                    <template v-if="isInStorge">
                                        <el-input v-model.trim="scope.row.stockInput" @input="getStockNum"
                                                  placeholder="请输入" type="number" min="0"
                                                  step="0.01"></el-input>
                                    </template>
                                    <template v-else>
                                        <el-input v-model.trim="scope.row.stockInput" @input="getStockNum"
                                                  :placeholder="scope.row.stock" type="number" min="0"
                                                  step="0.01"></el-input>
                                    </template>

                                </div>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column
                            prop="cz"
                            label="操作"
                            fixed="right"
                            width="80">
                        <template slot-scope="scope">
                            <div class="batch-del" @click="deleteRow(scope.$index, tableData4)">删除</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-row>
        <el-row>
            <add-bom ref="addBomRef"
            @tableData4='tableData'
            @select-all="handleSelectAll"
            :storehouseId="storehouseId"
            :parentTableData="tableData4"></add-bom>
        </el-row>
        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </section>
</template>

<script>
    import config from "@/config/index";
    import {
        batchInStock,
        batchOutStock
    } from "@/api";

    import addBom from "@/components/goods/goodsBom/addBom.vue"; //悬浮添加组件
    export default {
        name: "mat-batch.vue",
        components: {
            addBom
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                goodStyleNum: 0,    //合计物料sku数量
                totalNum: 0,        //合计数量
                tableData4: [],   //组件返回的数据
                commitData: [],   //要提交的数据
                flag: true,      //是否允许提交
                isloading: false        //防止多次点击
            }
        },
        computed: {
            //是否为入库操作
            isInStorge() {
                return Number(this.$route.query['isIn'])
            },
            //工厂id
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            //用户id
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            //仓库id
            storehouseId() {
                return this.$route.query.storehouseId;
            }
        },
        methods: {
            // 图片预览
            imgList(row) {
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            //计算合计数
            getStockNum() {
                let sum = 0;
                for (let i = 0; i < this.tableData4.length; i++) {
                    let num = parseFloat(this.tableData4[i].stockInput);
                    // 如果num为NaN,则变为0
                    if (!num) {
                        num = 0;
                    }
                    sum += num;
                }
                //保留两位小数
                this.totalNum = sum.toFixed(2);
            },
            //组装提交的表格数据格式
            getCommitData(val) {
                this.commitData = [];
                for (let i = 0; i < val.length; i++) {
                    let commitList = {};
                    commitList.styleId = val[i].commonMaterialsId;
                    commitList.skuId = val[i].id;
                    commitList.colorId = val[i].colorId;
                    //根据是否有仓位值，传不同的值
                    if(val[i].positionInput){
                        commitList.position = val[i].positionInput;
                    }else{
                        commitList.position = val[i].position;
                    }
                    commitList.stock = val[i].stockInput;
                    this.commitData.push(commitList);
                }
            },
            //提交数据不能为空
            isNull() {
                if (this.tableData4.length === 0) {
                    this.$message({
                        type: "error",
                        duration: config.elementUI.duration,
                        showClose: true,
                        message: "请先添加数据"
                    });
                    return false;
                } else {
                    return true;
                }
            },
            //出入库数量不能为空
            getStockVal() {
                for (let i = 0; i < this.tableData4.length; i++) {
                    let stockVal = parseFloat(this.tableData4[i].stockInput);
                    if (!stockVal) {
                        stockVal = 0;
                    }
                    if (stockVal < 0) {
                        //入库
                        if (this.isInStorge) {
                            this.$message({
                                type: "error",
                                duration: config.elementUI.duration,
                                showClose: true,
                                message: "入库数必须大于0"
                            });
                        } else {
                            this.$message({
                                type: "error",
                                duration: config.elementUI.duration,
                                showClose: true,
                                message: "出库数必须大于0"
                            });
                        }
                        return false;
                    }
                }
                return true;
            },
            //入库提交数据
            inStockSubmit(params) {
                batchInStock(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            type: "error",
                            duration: config.elementUI.duration,
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                    this.isloading = false;
                });
            },
            //出库提交数据
            outStockSubmit(params) {
                batchOutStock(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$router.go(-1);
                    } else {
                        this.$message({
                            type: "error",
                            duration: config.elementUI.duration,
                            showClose: true,
                            message: res.data.msg
                        });
                    }
                    this.isloading = false;
                });
            },
            submit() {
                //提交数据不能为空
                if (this.isNull()) {
                    //出入库数量不能为空
                    if (this.getStockVal()) {
                        this.isloading = true;
                        this.getCommitData(this.tableData4);
                        let params = {
                            unitId: this.unitId,                    //工厂id （必须）
                            userId: this.userId,                    //用户id （必须）
                            storehouseId: this.storehouseId,        //仓库id （必须）
                            stockSkuDTOS: this.commitData
                        };
                        //判断出入库操作
                        if (this.isInStorge) {
                            this.inStockSubmit(params);
                        } else {
                            this.outStockSubmit(params);
                        }
                    }
                }
            },
            //删除一行数据
            deleteRow(index, rows) {
                this.$refs['addBomRef'].toggleSelectionFn(this.tableData4[index]);
                this.tableData4[index].stockInput = "";
                rows.splice(index, 1);
                this.goodStyleNum = this.tableData4.length;
                this.getStockNum();
            },
            // 子组件返回的数据
            tableData(val, row) {
                const index = this.tableData4.findIndex(item => item.id === row.id);
                if (index > -1) {
                    this.tableData4[index].stockInput = "";
                    this.tableData4.splice(index);
                    this.goodStyleNum = this.tableData4.length;
                    this.getStockNum();
                }
                if(val.length > 0) {
                    for (var i = 0; i < val.length; i++) {
                        if (!val[i].stockInput) {
                            val[i].stockInput = "";          //输入框绑定的入库数
                        }
                        val[i].positionInput = "";          //输入框绑定的仓位
                        //拼接 供应商款号/色号
                        if (val[i].supplierStyleNo && val[i].supplierColorNo) {
                            val[i].styleColor = val[i].supplierStyleNo + ' / ' + val[i].supplierColorNo;
                        } else if (val[i].supplierStyleNo) {
                            val[i].styleColor = val[i].supplierStyleNo;
                        } else if (val[i].supplierColorNo) {
                            val[i].styleColor = val[i].supplierColorNo;
                        } else {
                            val[i].styleColor = "";
                        }

                        var flag = true;
                        if(this.tableData4.length > 0){
                            for (var j = 0; j < this.tableData4.length; j++) {
                                if (val[i].id == this.tableData4[j].id) {
                                    flag = false;
                                }
                            }
                        }
                        //不重复的数据
                        if (flag) {
                            this.tableData4.push(val[i]);
                            this.goodStyleNum = this.tableData4.length;
                            this.getStockNum();
                        }
                    }
                }
            },
            handleSelectAll(val) {
                this.tableData4 = JSON.parse(JSON.stringify(val));
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .mat-batch {
        &__title {
            border-bottom: 1px solid #e0e6ed;
            .green {
                color: #23c811
            }
            .orange {
                color: #ffa914
            }
            button {
                margin-left: 12px;
            }
        }
        &__content {
            margin: 16px 0 0 0;
            .batch-del {
                color: #FA4150;
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .mat-batch {
        .div_input_shu .el-input__inner {
            border: none;
        }
        .el-table__body tr.hover-row > td .el-input__inner {
            background-color: rgb(238, 240, 246);
        }
        .green .el-input__inner {
            color: #23C811;
        }
        .origin .el-input__inner {
            color: #FF7F14;
        }
    }
</style>
