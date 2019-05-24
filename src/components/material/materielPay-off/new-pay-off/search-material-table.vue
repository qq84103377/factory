<template>
    <div class="search-material-table">
        <!--这下面就是搜索表格-->
        <el-table key="1" ref="multipleTable" :data="searchTable" border tooltip-effect="dark" max-height="350"
                  @select="handleSelectionChange"
                  @select-all="handleSelectAll">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- 物料分类 -->
            <el-table-column prop="kindsName" label="物料分类">
                <template slot-scope="scope">
                    <span>{{scope.row.kindName?(scope.row.kindName || scope.row.kindsName):(scope.row.kindNo || scope.row.kindsNo)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="图片"
                    width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length ">
                        <img style="height: 40px;width: 80px;"
                            @click="imgList(scope.row)"
                            v-if="type =='outside'"
                            :src="scope.row.commonMaterialsPictureList[0].path"
                            alt="">
                        <img style="height: 40px;width: 80px;"
                            @click="imgList(scope.row)"
                            v-else
                            :src="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length?scope.row.commonMaterialsPictureList[0].path:''"
                            alt="">
                    </div>
                </template>
            </el-table-column>
            <!-- 物料款号 -->
            <el-table-column prop="materialsNo" label="物料款号">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialsNo"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 物料名称 -->
            <el-table-column prop="materialsName" label="物料名称">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialsName"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 颜色 -->
            <el-table-column prop="colorName" label="颜色" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column prop="specificationsName" label="规格" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.specificationsName?scope.row.specificationsName:scope.row.specificationsNo}}</span>
                </template>
            </el-table-column>
            <!-- 供应商 -->
            <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip>
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierName"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 供应商款号 -->
            <el-table-column prop="supplierStyleNo" label="供应商款号" show-overflow-tooltip>
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierStyleNo"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 供应商色号 -->
            <el-table-column prop="supplierColorNo" label="供应商色号" width="120">
            </el-table-column>
        </el-table>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>
</template>

<script>
    export default {
        props: ['searchTable', 'input', 'deleteRowData','type'],
        watch: {
            deleteRowData(val) {
                this.toggleSelection(val);
            }
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
            }
        },
        methods: {
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if(row.commonMaterialsPictureList[0].path){
                    this.imgIndex = 0;
                    this.imgLists = row.commonMaterialsPictureList;
                }else {
                    this.imgLists = []
                    row.commonMaterialsPictureList.forEach(item =>{
                        this.imgLists.push({path:item})
                    })
                }

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
