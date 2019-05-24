<template>
    <div class="bill-detail-table">
        <div class="table-wrap">
            <!--唯一码明细-->
            <template v-if="type === 'wym'">
                <el-table
                        :data="tableData"
                        :max-height="300"
                        border
                       >
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="latheNo"
                            label="本次序号">
                    </el-table-column>
                    <el-table-column
                            prop="uniqueNo"
                            label="内部唯一码"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="facMissionNo"
                            label="工单号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="styleNo"
                            label="货品">
                    </el-table-column>
                    <el-table-column
                            label="外发厂"
                            width="180">
                        <template slot-scope="scope">
                                <span v-if="scope.row.outsideFactoryId">
                                    {{scope.row.outsideFactoryName}}
                                </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                </el-table>
            </template>
            <!--扎号明细-->
            <template v-if="type === 'ligation'">
                <el-table
                        :data="tableData"
                        :max-height="300"
                        border>
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="ligationNo"
                            label="扎号">
                    </el-table-column>
                    <el-table-column
                            prop="facMissionNo"
                            label="工单号">
                    </el-table-column>
                    <el-table-column
                            prop="styleNo"
                            label="货品"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            label="外发厂"
                            width="180">
                            <template slot-scope="scope">
                                <span v-if="scope.row.outsideFactoryId">
                                    {{scope.row.outsideFactoryName}}
                                </span>
                            </template>
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="quantityLigation"
                            label="数量">
                    </el-table-column>
                    <el-table-column
                            prop="quantityReport"
                            label="上报数量">
                    </el-table-column>
                </el-table>
            </template>
            <!--次品上报明细-->
            <template v-if="type === 'substandard'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="styleNo"
                            label="货品款号">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="defectiveLabelNames"
                            label="次品标签">
                    </el-table-column>
                </el-table>
            </template>
            <!--次品关联唯一码-->
            <template v-if="type === 'substandardWym'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="uniqueNo"
                            label="唯一码">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="defectiveLabelNames"
                            label="次品标签">
                    </el-table-column>
                </el-table>
            </template>
            <!--次品关联扎号-->
            <template v-if="type === 'substandardLigation'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="ligationNo"
                            label="所属扎号">
                    </el-table-column>
                    <el-table-column
                            prop="styleNo"
                            label="货品款号">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="defectiveLabelNames"
                            label="次品标签">
                    </el-table-column>
                </el-table>
            </template>
            <!--废品上报明细-->
            <template v-if="type === 'waste'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="styleNo"
                            label="货品款号">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="reason"
                            label="报废原因">
                    </el-table-column>
                </el-table>
            </template>
            <!--废品关联唯一码-->
            <template v-if="type === 'wasteWym'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="uniqueNo"
                            label="唯一码">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="reason"
                            label="报废原因">
                    </el-table-column>
                </el-table>
            </template>
            <!--废品关联扎号-->
            <template v-if="type === 'wasteLigation'">
                <el-table
                        :data="tableData"
                        border>
                    <el-table-column
                            prop="lathe"
                            label="床次"
                            width="80">
                    </el-table-column>
                    <el-table-column
                            prop="ligationNo"
                            label="所属扎号">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="standardName"
                            label="内长">
                    </el-table-column>
                    <el-table-column
                            prop="sizeName"
                            label="尺码">
                    </el-table-column>
                    <el-table-column
                            prop="reason"
                            label="报废原因">
                    </el-table-column>
                </el-table>
            </template>
        </div>

    </div>
</template>

<script>
    export default {
        name: "billDetailTable",
        props:['type','tableData'],
        /**************************
         *  type 表格类型，有以下几种
         *          wym 唯一码
         *          ligation 扎号
         *          substandard 次品
         *          substandardWym 次品-关联唯一码
         *          substandardLigation 次品-关联扎号
         *          waste 废品
         *          wasteWym 废品-关联唯一码
         *          wasteLigation 废品-关联扎号
         *
         *
         * ***********************/
        data(){
            return {
            }
        }
    }
</script>

<style lang="scss">

</style>