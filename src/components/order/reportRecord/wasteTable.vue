<template>
    <el-table
            v-if="wasteItem.operationType==8"
            border
            style="margin-top: 16px;width: auto;"
            :data="wasteItem.wasteds">
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
                prop="reason"
                label="报废原因"
                width="180">
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        props: ['styleNo','wasteItem']
    }
</script>

<style scoped>

</style>