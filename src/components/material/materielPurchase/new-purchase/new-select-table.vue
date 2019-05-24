<template>
<div>
    <el-table class="custom-table purchase-new-select-table" ref="multipleTable" :data="table" border tooltip-effect="dark"
        style="width: 100%" @select-all="selectAll" @select="select">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="kindName" label="分类" v-if="configArr.includes('分类')" align="center">
        </el-table-column>
        <el-table-column prop="commonMaterialsSkuPicture" label="图片" v-if="configArr.includes('图片')" width="76" align="center">
            <template slot-scope="scope">
                <div style="width:40px;height:40px;">
                    <img style="height: 32px;padding: 4px;"
                         @click="imgList(scope.row.commonMaterialsPictureList)"
                         v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                         :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]">
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="materialsNo" label="物料款号" v-if="configArr.includes('物料款号')" width="100" align="center">
        </el-table-column>
        <!--<el-table-column prop="supplierName" label="gys" width="100" align="center">-->
        <!--</el-table-column>-->
        <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140" align="center">
            <template  slot-scope="scope">
                {{scope.row.supplierStyleNo}}/
                {{scope.row.supplierColorNo}}
            </template>
        </el-table-column>
        <el-table-column prop="materialsName" label="参考单价[元/采购单位]" width="100" align="center">
            <template slot-scope="scope">
                {{scope.row.planCost}}元/{{scope.row.purchaseUnitName}}
            </template>
        </el-table-column>
        <el-table-column prop="materialsName" label="不含税价[元/采购单位]" width="100" align="center">
            <template slot-scope="scope">
                {{scope.row.excludingTaxPrice }}元/{{scope.row.purchaseUnitName}}
            </template>
        </el-table-column>
        <el-table-column prop="materialsRemark" label="备注" width="100" align="center">
        </el-table-column>
        <el-table-column prop="materialsName" label="物料名称" v-if="configArr.includes('物料名称')" width="100" align="center">
        </el-table-column>
        <el-table-column prop="colorName" label="颜色" v-if="configArr.includes('颜色')" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="specificationsNo" label="规格" v-if="configArr.includes('规格')" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.specificationsRemark?scope.row.specificationsRemark:scope.row.specificationsNo}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="unit" label="库存单位" v-if="configArr.includes('单位')" align="center" width="100">
        </el-table-column>
        <el-table-column prop="styleNo" label="商品款号" v-if="configArr.includes('商品款号')" width="120" align="center">
        </el-table-column>
        <el-table-column prop="demandSourceBillNo" label="生产单号" v-if="configArr.includes('生产单号')" width="200" align="center">
        </el-table-column>
        <el-table-column prop="singleDosage" label="单件用料" v-if="configArr.includes('单件用料')" width="90" align="center">
        </el-table-column>
        <el-table-column prop="skuQuantity" label="用料货品数" v-if="configArr.includes('用料货品数')" width="100" align="center">
        </el-table-column>
        <el-table-column prop="lossRate" label="损耗率" v-if="configArr.includes('损耗率')" align="center">
            <template  slot-scope="scope">
                {{scope.row.lossRate}}
            </template>
        </el-table-column>
        <el-table-column prop="planBuyQuantity" label="计划采购" v-if="configArr.includes('计划采购')" width="90" align="center">
        </el-table-column>
        <!-- <el-table-column prop="waitDeliveryQuantity" label="待送料" align="center">
        </el-table-column> -->
        <el-table-column prop="unArrivedPurchaseQuantity" label="采购未到" width="90" align="center">
        </el-table-column>
        <el-table-column prop="stock" label="总库存" align="center">
        </el-table-column>
        <el-table-column prop="waitPurchaseQuantity" label="待采购" align="center">
            <template slot-scope="scope">
                <div class="red">
                    {{scope.row.waitPurchaseQuantity}}
                </div>
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
    props:['table','configArr','delSelRowFacId','delSelRowSkuId','demandSourceBillNo'],
    data() {
        return {
            centerDialogVisible: false, //判断显示图片预览显示与隐藏
            imgLists: [],
            imgIndex: 0,
            delSelRowFacId:'',
            delSelRowSkuId:'',
            selectArr:[]
        }
    },

    computed:{
        delSelRowId:function () {
            return this.delSelRowFacId+this.delSelRowSkuId
        }
    },
    watch:{
      'delSelRowId':function (val) {
          this.table.forEach((item,index) => {
              if(item.facMissionId == this.delSelRowFacId && item.materialsSkuId == this.delSelRowSkuId){
                  this.$refs.multipleTable.toggleRowSelection(this.table[index],false)
              }
          })
      },
        'table':function () {
            this.selectEqualOrder();
        },

    },
    methods:{
        // 图片预览
        imgList(item) {
            console.log(item);
            this.imgIndex = 0;
            this.imgLists = [];
            item.forEach($item =>{
                this.imgLists.push({path:$item})
            })
            // this.imgLists = item.commonMaterialsPictureList;
            this.centerDialogVisible = true;
        },
        selectAll(sec) {
            if(sec.length>0){
                sec.forEach(item=>{
                    this.$emit('selectedData',sec,item);
                })
            }else {
                this.$emit('selectedData',[],{});
            }

        },
        select(sec,val) {
            // let index = sec.findIndex(item =>item==val )
            // if(index>-1){
                // 选中的
            this.$emit('selectedData',sec,val);
            // }else {
                //取消选中
                // this.$emit('selectedDataDel',val);
            // }


        },
        //勾选相同工单号的数据
        selectEqualOrder(){
            this.selectArr = [];
            let orderNo = this.demandSourceBillNo;
            if(this.table.length) {
                if (this.demandSourceBillNo === 'allFacMissionNo') {
                    this.selectArr = this.table;
                } else {
                    this.table.forEach(item => {
                        if (item.demandSourceBillNo === orderNo) {
                            this.selectArr.push(item);
                        }
                    });
                }
                if(this.selectArr){
                    let that = this;
                    window.setTimeout(function () {
                        that.selectArr.forEach(row =>{
                            that.$refs.multipleTable.toggleRowSelection(row, true);   //勾选对应数据
                        });
                        that.select(that.selectArr);    ////更新父组件数据
                    },100);
                }
            }
        }
    },
    mounted() {
    }

}
</script>

<style lang="scss" scoped>
.red {
    color: #FA4150;
}
</style>

<style lang="scss">
    .purchase-new-select-table .el-table__body,
    .purchase-new-select-table .el-table__header{
        width: 100% !important;
    }
</style>

