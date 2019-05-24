<template>
    <!--此表格数据全部都是动态配置，当用户取消全部字段时，不作显示，2表示采购有两个必填但与此表无关-->
    <div v-if="configArr.length > 2">
        <!--这下面就是搜索表格-->
        <el-table class="custom-table" ref="multipleTable" :data="searchTable" border tooltip-effect="dark" max-height="350"
                    @select="handleSelectionChange"
                    @select-all="handleSelectAll">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- 供应商 -->
            <el-table-column prop="supplierName" label="默认供应商" v-if="configArr.includes('供应商')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierName"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 分类 -->
            <el-table-column prop="kindsName" label="分类" v-if="configArr.includes('分类')" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.kindsName?scope.row.kindsName:scope.row.kindsNo}}</span>
                </template>
            </el-table-column>
            <!--  图片 -->
            <el-table-column prop="commonMaterialsSkuPicture" label="图片" v-if="configArr.includes('图片')" width="76" align="center">
                <template slot-scope="scope">
                    <div style="width:40px;height:40px;">
                        <img style="width: 40px;height: 100%;"
                             @click="imgList(scope.row.commonMaterialsPictureList)"
                             v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                             :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                             alt="">
                    </div>
                </template>
            </el-table-column>
            <!-- 物料款号 -->
            <el-table-column prop="materialsNo" label="物料款号" v-if="configArr.includes('物料款号')" align="center">
                <template slot-scope="scope">
                    <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialsNo":key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 样料 -->
            <el-table-column prop="sampleMaterial" label="样料" v-if="isSampleMaterial" align="center">
                <template slot-scope="scope">
                    {{scope.row.sampleMaterial?'样料':''}}
                </template>
            </el-table-column>
            <!-- 供应商款号 -->
            <el-table-column prop="supplierStyleNo" label="供应商款号" v-if="configArr.includes('供应商款号/色号')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierStyleNo"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 供应商色号 -->
            <el-table-column prop="supplierColorNo" label="供应商色号" v-if="configArr.includes('供应商款号/色号')" width="120" align="center">
            </el-table-column>
            <el-table-column prop="supplierColorNo" label="参考价[元/采购单位]" width="120" align="center">
                <template slot-scope="scope">
                    {{scope.row.planCost}}元/{{scope.row.purchaseUnit||scope.row.purchaseUnitName}}
                </template>
            </el-table-column>
            <el-table-column prop="supplierColorNo" label="不含税价[元/采购单位]" width="120" align="center">
                <template slot-scope="scope">
                    {{scope.row.excludingTaxPrice }}元/{{scope.row.purchaseUnit||scope.row.purchaseUnitName}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="120" align="center">
            </el-table-column>
            <!-- 物料名称 -->
            <el-table-column prop="materialsName" label="物料名称" v-if="configArr.includes('物料名称')" align="center">
                <template slot-scope="scope">
                <span :style="{'color':item == input? '#FF7F14':''}" v-for="(item,i) in scope.row.materialsName"
                      :key="i">{{item}}</span>
                </template>
            </el-table-column>
            <!-- 颜色 -->
            <el-table-column prop="colorName" label="颜色" v-if="configArr.includes('颜色')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column prop="specificationsName" label="规格" v-if="configArr.includes('规格')" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.specificationsName?scope.row.specificationsName:scope.row.specificationsNo}}</span>
                </template>
            </el-table-column>

        </el-table>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    </div>
</template>

<script>
export default {
    props:['searchTable','configArr','input','isSampleMaterial'],
        data(){
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
            }
        },
        methods:{
            // 图片预览
            imgList(item) {
                this.imgIndex = 0;
                this.imgLists = [];
                item.forEach($item =>{
                    this.imgLists.push($item)
                });
                this.centerDialogVisible = true;
            },
            handleSelectionChange(sec,val) {
                this.$emit('searchData',sec,val);
            },
            handleSelectAll(sec) {
                if(sec.length>0){
                    sec.forEach(item=>{
                        this.$emit('searchData',sec,item);
                    })
                }else {
                    this.$emit('searchData',[],{});
                }
            }
        },
        mounted(){
            // console.log(this.input);
        }
    }
</script>

<style>

</style>
