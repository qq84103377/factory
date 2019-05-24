<template>
    <section class="material-table">
        <el-table
                :data="facPrdOrderList"
                border
                style="width: 100%">
            <el-table-column
                    align="center"
                    prop="billName"
                    label="图片"
                    width="80">
                <template slot-scope="scope">
                    <div class="cell-item" style="height: 32px;" v-for="(sku,index) in scope.row.skuList" :key="index">
                        <!--<img class="material-img"-->
                             <!--v-if="i==0"-->
                             <!--v-for="(item,i) in sku.commonMaterialsPictureList"-->
                             <!--:src="item.path" alt="">-->
                        <img style="max-width: 100%;max-height: 100%" :src="sku.commonMaterialsSkuPicture" alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="billName"
                    label="物料分类"
                    width="120">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.kindsName||sku.kindsNo}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="materialsNo" align="center" label="物料款号" width="160">
                <template slot-scope="scope">
                   <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">
                       {{sku.materialsNo}}
                   </div>
                </template>
            </el-table-column>
            <el-table-column prop="materialsName" align="center" label="物料名称" width="160">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.materialsName}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="颜色" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.colorName||sku.colorValue}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="规格" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.specificationsName||sku.specificationsNo}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="supplierName" label="默认供应商" width="160">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.supplierName}}</div>
                </template>
            </el-table-column>
            <!--供应商款号/色号-->
            <el-table-column align="center" label="供应商款号/色号" width="160">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">
                        <span>{{sku.supplierStyleNo}}</span>
                        <span v-if="sku.supplierStyleNo || sku.supplierColorNo">/</span>
                        <span>{{sku.supplierColorNo}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="planCost"
                    label="参考价【元/采购单位】"
                    width="180">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">
                        <span v-if="sku.planCost">{{sku.planCost}}元/{{sku.purchaseUnitName}}</span>
                        <span v-else style="height: 32px;"></span>
                    </div>
                </template>
            </el-table-column>
            <!--不含税价-->
            <el-table-column
                    align="center"
                    prop="excludingTaxPrice"
                    label="不含税价【元/采购单位】"
                    width="180">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">
                        <span v-if="sku.excludingTaxPrice">{{sku.excludingTaxPrice}}元/{{sku.purchaseUnitName}}</span>
                        <span v-else style="height: 32px;"></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sampleMaterial" label="样料" width="80">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.sampleMaterial?'样料':''}}</div>
                </template>
            </el-table-column>
            <!--库存单位-->
            <el-table-column align="center" prop="stockUnitName" label="库存单位" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.stockUnitName}}</div>
                </template>
            </el-table-column>
            <!--采购单位-->
            <el-table-column align="center" prop="purchaseUnitName" label="采购单位" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.purchaseUnitName}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="remark" label="备注" width="260">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.remark}}</div>
                </template>
            </el-table-column>
            <!--标准用量-->
            <el-table-column align="center" prop="defaultDosage" label="标准用量" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.defaultDosage}}</div>
                </template>
            </el-table-column>
            <!--是否固定物料-->
            <el-table-column align="center" prop="fixedMaterials" label="固定物料" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.fixedMaterials?'固定物料':''}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="conversionRate" label="参考转化率" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.conversionRate}}</div>
                </template>
            </el-table-column>
            <!--默认损耗-->
            <el-table-column align="center" prop="mlossRate" label="默认损耗" width="100">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.mlossRate}}%</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="styleNo" label="关联商品款号" width="120">
                <template slot-scope="scope">
                    <div class="cell-item" v-for="(sku,index) in scope.row.skuList" :key="index">{{sku.styleNo}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="styleNo" label="审核状态" width="120">
                <template slot-scope="scope">
                    <div v-if="scope.row.reviewStatusText.indexOf('\n')>-1">
                        <div>{{scope.row.reviewStatusText.split('\n')[0]}}</div>
                        <div>{{scope.row.reviewStatusText.split('\n')[1]}}</div>
                    </div>
                    <div v-else>{{scope.row.reviewStatusText}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="styleNo" label="审批备注" width="120">
                <template slot-scope="scope">
                    <div>{{scope.row.reviewRemark}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="220" align="center">
                <template slot-scope="scope">
                    <div class="opera">
                        <el-button class="blue" @click="$router.push(`/materialInfo/${scope.row.commonMaterialsId}`)">查看</el-button>
                        <div @click="$emit('taskPass',scope.row.taskId,true,scope.row)">
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'">通过</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='ANTI_REVIEW'">批准</el-button>
                        </div>
                        <div>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'" @click="$emit('taskUnPassDialogGo',scope.row.taskId,scope.row,1)">驳回</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" @click="$emit('taskUnPassDialogGo',scope.row.taskId,scope.row,2)" v-if="scope.row.taskName==='ANTI_REVIEW'">不批准</el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<script>
    export default {
        name: "material-table",
        props: ['facPrdOrderList']
    }
</script>

<style lang="scss" scoped>
    .material-table{
        .cell-item{
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
            min-height: 32px;
            border-bottom: 1px solid rgb(223, 228, 236);
            &:last-child{
                border-bottom: none;
            }
        }
        .opera{
            display: flex;
            justify-content: space-between;
            .blue {
                font-size: 12px;
                display: flex;
                /*justify-content: space-between;*/
                justify-content: center;
                align-items: center;
                color: #1CA1FF;
                text-decoration: underline;
                cursor: pointer;
                text-align: center;
                height: 100%;
                border: none;
                background-color: transparent
            }
        }
    }
</style>