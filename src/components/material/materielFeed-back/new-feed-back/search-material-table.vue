<template>
    <div class="search-material-table">
        <!--这下面就是搜索表格-->
        <el-table key="1" ref="multipleTable" :data="searchTable" border tooltip-effect="dark" max-height="350"
                  @select="handleSelectionChange"
                  @select-all="handleSelectAll">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- 物料分类 -->
            <el-table-column prop="facMissionPrcdNodeName" label="节点名" v-if="isShowNodeName"></el-table-column>
            <el-table-column prop="kindName" label="分类"></el-table-column>
            <el-table-column
                    label="图片"
                    width="120">
                <template slot-scope="scope">
                    <img style="height: 30px;width: 80px;margin-top:2px"
                            @click="imgList(scope.row.imgPath)"
                            v-if="scope.row.imgPath"
                            :src="scope.row.imgPath?scope.row.imgPath:''"
                            alt="">
                </template>
            </el-table-column>
            <!-- 物料款号 -->
            <el-table-column prop="materialNo" label="物料款号" width="100">
                <template slot-scope="scope">
                    <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialNo"
                        :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <el-table-column label="供应商" align="center" width="140" prop="supplierName">
                <template slot-scope="scope">
                    <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierName"
                        :key="i">{{item}}</span>
                </template>
            </el-table-column>

            <el-table-column label="供应商款号/色号" width="160">
                <template slot-scope="scope">
                    <div class="cell__row">{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                </template>
            </el-table-column>
            <!-- 物料名称 -->
            <el-table-column prop="materialName" label="物料名称" width="100">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialName"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 颜色 -->
            <el-table-column prop="colorName" label="颜色" show-overflow-tooltip></el-table-column>
            <!-- 规格 -->
            <el-table-column prop="specificationsRemark" label="规格" show-overflow-tooltip></el-table-column>
            <el-table-column prop="quantityDelivered" label="已送料" show-overflow-tooltip></el-table-column>
        </el-table>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>
</template>

<script>
    export default {
        props: ['searchTable', 'input', 'deleteRowData','facMissionId'],
        /**
         * searchTable: 表格数据
         * input：搜索值
         * deleteRowData： 删除的行
         * facMissionId:是否选择工单，选择了工单，则显示节点名，否则隐藏
         * 
         */
        watch: {
            searchTable(val) {
                console.log(val,'999')
            },
            deleteRowData(val) {
                this.toggleSelection(val);
            },
            facMissionId(val) {
                if(val) {
                    this.$nextTick(() => {
                         this.isShowNodeName =true
                    })
                   
                } else {
                    this.$nextTick(() => {
                         this.isShowNodeName = false
                    })
                }

            }
        },
        data() {
            return {
                isShowNodeName:false,// 节点名列是否显示
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
            }
        },
        methods: {
            // 图片预览
            imgList(imgUrl) {
                this.imgLists = [{path:imgUrl}]

                this.centerDialogVisible = true;
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row, false);
                    });
                }
            },
            handleSelectionChange(sec,val) {
                this.$emit('searchData',sec, val);
            },
            handleSelectAll(val) {
                this.$emit('searchData', val);
            }
        }
    }
</script>

<style lang="scss">
    .search-material-table {
        .el-table__header-wrapper {
            .el-checkbox {
                display: none;
            }
        }
    }
</style>