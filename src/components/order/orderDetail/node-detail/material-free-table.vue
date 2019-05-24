<template>
    <el-table
            id="material-table"
            class="material-table no-cell-padding no-hover-highlight"
            stripe
            border
            :data="materialTableData">
        <el-table-column
                label="图片"
                width="120">
            <template slot-scope="scope">
                <p class="cell__row">
                    <img style="width: 80px;height: 40px;"
                         v-if="scope.row.commonMaterialsSkuPicture"
                         @click="imgList(scope.row.commonMaterialsPictureList)"
                         :src="scope.row.commonMaterialsSkuPicture">
                </p>
            </template>
        </el-table-column>
        <el-table-column label="分类">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.kindName }}</p>
            </template>
        </el-table-column>
        <el-table-column label="物料款号">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.materialsNo }}</p>
            </template>
        </el-table-column>
        <el-table-column label="供应商">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.supplierName }}</p>
            </template>
        </el-table-column>
        <el-table-column label="供应商款号/色号"width="130">
            <template slot-scope="scope">
                <p class="cell__row">
                    <span>{{scope.row.supplierStyleNo}}</span>
                    <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo">/</span>
                    <span>{{scope.row.supplierColorNo}}</span>
                </p>
            </template>
        </el-table-column>
        <el-table-column label="物料名称" prop="materialsName">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.materialsName }}</p>
            </template>
        </el-table-column>
        <el-table-column label="颜色" prop="colorName">
            <template slot-scope="scope">
                <p class="cell__row">
                    {{ scope.row.colorName }}
                </p>
            </template>
        </el-table-column>
        <el-table-column label="规格" width="120">
            <template slot-scope="scope">
                <p class="cell__row">
                    <span v-if="scope.row.specificationsNumber">{{scope.row.specificationsNumber}}</span>
                    <span v-else>{{scope.row.specificationsRemark}}</span>
                </p>
            </template>
        </el-table-column>
        <el-table-column label="单位" prop="unitName">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.unitName }}</p>
            </template>
        </el-table-column>
        <el-table-column label="已送料">
            <template slot-scope="scope">
                <p class="cell__row"
                   :class="{'gray': scope.row.quantityCompleted == 0,
                        'green':scope.row.quantityCompleted == scope.row.totalPlan,
                        'blue':scope.row.quantityCompleted != 0 && scope.row.quantityCompleted < scope.row.totalPlan}">
                    {{ scope.row.quantityCompleted }}
                </p>
            </template>
        </el-table-column>
        <el-table-column label="已退回物料" prop="quantityRefund">
            <template slot-scope="scope">
                <p class="cell__row">{{ scope.row.quantityRefund }}</p>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    created() {
    },
    props:['materialTableData'],
    computed: {
    },
    data(){
        return {
        }
    },
    methods:{
        // 图片预览
        imgList(row) {
            this.$emit('imgList',row);
        },
    }
}
</script>

<style scoped lang="scss">
    .cell__row {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        word-break: break-all;
        font-size:12px;
        &:not(:last-child) {
            border-bottom: 1px solid #E6EAF0
        }
    }
    .yellow {
        background:rgba(255,240,241,1);
    }
    .cell__input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        text-indent: 0;
        padding: 0 10px;
        font-size: 14px;
        &:focus {
            border: 1px solid #FFA914
        }
    }
    .cell__opera{
        display:flex;
        align-items: center;
        justify-content: space-between;
        text-decoration: underline;
        color:#808080;
    }
    .all {
        cursor:pointer;
        border-right:1px solid rgb(223, 228, 236);
        height:100%;
        width:50%;
        padding-right:6px;
    }
    .success {
        cursor:pointer;
        height:100%;
        width:50%;
        padding-left:6px;
    }
</style>
<style lang="scss">
    #material-table{
        .el-input__inner{
            border:none;
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
    }
</style>

