<template>
    <el-table class="detail-list no-hover-highlight" :data="tableData" border :row-class-name="tableRowClassName">
        <el-table-column align="center" label="床次" prop="lathe">
        </el-table-column>
        <el-table-column align="center" label="本次序号" prop="latheNo">
        </el-table-column>
        <el-table-column align="center" label="唯一码" width="150" prop="WYM">
        </el-table-column>
        <el-table-column align="center" label="工单号" width="140" prop="orderNo">
        </el-table-column>
        <el-table-column align="center" label="货品款号" prop="styleNo">
        </el-table-column>
        <el-table-column align="center" label="颜色" prop="colorName">
        </el-table-column>
        <el-table-column align="center" label="尺码" prop="sizeName">
        </el-table-column>
        <el-table-column align="center" label="内长" prop="standardName">
        </el-table-column>
        <el-table-column align="center" label="状态" width="140">
            <template slot-scope="scope">
                <span :style="{
                    'color': statusColor(scope.row.reportStatus)
                }">{{ statusText(scope.row.reportStatus) }}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    props: {
        tableData: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
        }
    },
    methods: {
        statusColor(reportStatus) {
            switch(reportStatus) {
                case 1: return '#23c811'; // 合格品颜色  绿色
                case 2: return '#ff7f14'; // 次品颜色 橙色
                case 3: return '#fa4150'; // 废品颜色 红色
                default: return '#c4c6cc' // 灰色
            }
        },
        statusText(reportStatus) {
            switch(reportStatus) {
                case 1: return '合格品';
                case 2: return '次品';
                case 3: return '废品';
                default: return '未上报'
            }
        },
        tableRowClassName(row, index) {
            switch(row.reportStatus) {
                case 1: return 'is-quality';
                case 2: return 'is-defective';
                case 3: return 'is-wasted';
                default: return ''
            }
        }
    }
}
</script>

<style lang="scss">
    .detail-list {
        margin-bottom: 50px;
        .is-quality {
            background-color: #effbee !important;
        }
        .is-defective {
            background-color: #fff2e7 !important;
        }
        .is-wasted {
            background-color: #feeeef !important;
        }
    }
</style>
