<template>
    <el-row class="record-item__content content">
        <div class="content__table">
            <div class="content__table-title"><span>床次：{{ logItem.lathe }}</span> <span class="count-total">数量总计：{{ logItem.total }}件</span></div>
            <div class="content__table-body">
                <nf-sku-table
                :metadatas="metadatas"
                :quantities="quantities"
                show-num>
                </nf-sku-table>
            </div>
        </div>
         <div class="content__table">
            <div class="content__table-title">生成扎号：{{ logItem.ligationTotal }}扎</div>
            <div class="content__table-body">
                <el-table :data="logItem.ligationList">
                    <el-table-column label="扎号" prop="ligationNo"></el-table-column>
                    <el-table-column label="颜色" prop="colorName"></el-table-column>
                    <el-table-column label="尺码" prop="sizeName"></el-table-column>
                    <el-table-column label="内长" prop="standardName"  v-if="tableData.lengths && tableData.lengths.length"></el-table-column>
                    <el-table-column label="数量" prop="num"></el-table-column>
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
            .count-total {
                margin-left: 24px;
            }
            &-title {
                margin-top: 12px;
                margin-bottom: 8px;
            }
        }
    }
</style>

