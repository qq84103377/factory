<template>
    <el-row class="record-item__content content">
        <!-- <div class="content__head">
            <span>完成人员：张晓峰</span><span>完成日期：2016-04-21</span>
        </div> -->
        <div class="content__table">
            <p class="content__table-title">
                合格品：{{ qualityNum }} 件
            </p>
            <div class="content__table-body">
                <nf-sku-table
                :metadatas="metadatas"
                :quantities="quantities"
                show-num>
                </nf-sku-table>
                <!-- <service-table
                    v-if="tableData.colors && tableData.colors.length"
                    :tableData="tableData"
                    :isNode="true"
                    :skuVal="skuVal"></service-table> -->
            </div>
        </div>
        <div class="content__table">
            <p class="content__table-title">次品：{{ defectiveds.length }}件</p>
            <div class="content__table-body">
                <el-table
                class="is-fixed-header report-table"
                :data="defectiveds"
                border
                style="width: 100%">
                    <el-table-column
                        label="颜色"
                        width="100">
                        <template slot-scope="scope">
                            {{ scope.row.colorName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableData.lengths && tableData.lengths.length"
                        prop="standardName"
                        label="内长"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="sizeName"
                        label="尺码"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="defectiveLabelName"
                        label="次品标签">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="content__table">
            <p class="content__table-title">废品：{{ logItem.wasteds.length }} 件</p>
            <div class="content__table-body">
                <el-table
                class="is-fixed-header report-table"
                :data="logItem.wasteds"
                border
                style="width: 100%">
                    <el-table-column
                        label="颜色"
                        width="100">
                        <template slot-scope="scope">
                            {{ scope.row.colorName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="tableData.lengths && tableData.lengths.length"
                        prop="standardName"
                        label="内长"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="sizeName"
                        label="尺码"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="defectiveLabelName"
                        label="报废原因">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </el-row>
</template>

<script>
    export default {
        props: {
            metadatas: [],
            quantities: [],
            tableData: {},
            logItem: {}
        },
        data() {
            return {
                defectiveList: [],
                wastedList: []
            }
        },
        computed: {
            defectiveds() {
                return this.logItem && this.logItem.defectiveds;
            },
            qualityNum() {
                let num = 0;
                this.logItem.qualifieds.forEach(item => {
                    num += item.quantity;
                });
                return num > 0 ? num : 0;
            }
        },
        components: {
        }
    }
</script>

<style lang="scss" scoped>

    .record-item__content {
        padding-top: 20px;
    }
    .content {
        &__head {
            color: #808080
        }
        &__table {
            &-title {
                margin-top: 12px;
                margin-bottom: 8px;
            }
        }
    }
</style>
