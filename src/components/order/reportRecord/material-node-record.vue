<template>
    <div class="meterial">
         <el-table
            class="meterial__table no-cell-padding"
            :data="logItem.materials"
            border>
            <el-table-column
            prop="date"
            label="分类">
                <template slot-scope="scope">
                    <div class="meterial__table-cell" :style="{'line-height': scope.row.materialSkus.length * 40 + scope.row.materialSkus.length - 1 + 'px'}">
                        <p class="meterial__table-text">{{ scope.row.kindName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="物料号">
                <template slot-scope="scope">
                    <div class="meterial__table-cell" :style="{'line-height': scope.row.materialSkus.length * 40 + scope.row.materialSkus.length - 1 + 'px'}">
                        <p class="meterial__table-text">{{ scope.row.number }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="供应商">
                <template slot-scope="scope">
                    <div class="meterial__table-cell" :style="{'line-height': scope.row.materialSkus.length * 40 + scope.row.materialSkus.length - 1 + 'px'}">
                        <div class="meterial__table-text">{{ scope.row.supplierName }}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            prop="name"
            label="供应商款号/色号"
            width="140"
            align="center">
                <template slot-scope="scope">
                    <div class="meterial__table-cell" :style="{'line-height': scope.row.materialSkus.length * 40 + scope.row.materialSkus.length - 1 + 'px'}">
                        <p class="meterial__table-text">{{ scope.row.supplierStyleNo }}/{{scope.row.supplierColorNo}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            prop="address"
            label="物料名称">
                <template slot-scope="scope">
                    <div class="meterial__table-cell" :style="{'line-height': scope.row.materialSkus.length * 40 + scope.row.materialSkus.length - 1 + 'px'}">
                        <p class="meterial__table-text">{{ scope.row.name }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="颜色">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.colorName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="规格" width="120" align="center">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">
                            {{ item.specificationsNumber }}
                            <i v-show="item.specificationsRemark">-</i>
                            {{ item.specificationsRemark }}
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="仓位">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.storehouseLabel }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="商品款号">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.styleNo }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="工单号">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.facMissionOrderNo }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="单间用料">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.singleDosage }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="用料货品数">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.skuQuantity }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="损耗">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.lossRate }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="单位">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.unitName }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="物料需求">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.totalPlan }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
            label="本次到料">
                <template slot-scope="scope">
                    <div class="meterial__table-cell">
                        <p class="meterial__table-text" v-for="item in scope.row.materialSkus" :key="item">{{ item.reportQuantity }}</p>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props: {
            logItem: Object
        },
        data() {
            return {
                tableData: []
            };
        },
        created() {
        }
    }
</script>

<style lang="scss" scoped>
    .meterial {
        margin-top: 16px;
        &__table-cell {
            font-size: 12px;
            // border-bottom: 1px solid #e6eaf0;
            line-height: 40px;
            p {
                padding: 0 10px;
                box-sizing: border-box;
                &:not(:last-child) {
                    border-bottom: 1px solid #e6eaf0;
                }
            }
        }
    }
</style>
