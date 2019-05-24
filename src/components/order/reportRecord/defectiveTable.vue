<template>
    <el-table
            v-if="[1,2,3,7].indexOf(defectiveItem.operationType) != -1"
            border
            style="margin-top: 16px;width: auto;"
            :data="defectiveItem.defectiveds">
        <el-table-column
                label="货品款号"
                width="180">
            <template slot-scope="scope">
                <span>{{styleNo}}</span>
            </template>
        </el-table-column>
        <el-table-column
                prop="colorName"
                label="颜色"
                width="180">
        </el-table-column>
        <el-table-column
                prop="standardName"
                label="内长"
                width="180">
        </el-table-column>
        <el-table-column
                prop="sizeName"
                label="尺码"
                width="180">
        </el-table-column>
        <el-table-column
                prop="date"
                label="次品标签"
                width="180">
            <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.defectiveLabelNames" :key="index">{{item+(scope.row.defectiveLabelNames.length-1>index?'、':'')}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        props: ['styleNo','defectiveItem']
    }
</script>

<style scoped>

</style>