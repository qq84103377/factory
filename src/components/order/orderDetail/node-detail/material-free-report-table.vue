<template>
  <div class="material-report-table">
    <template v-if="materialData.operationType === 6">
      <el-table
          :data="materialData.refundMaterials"
          key="refundMaterials"
          border
          empty-text="暂无数据">
          <el-table-column
            prop="kindName"
            label="分类">
        </el-table-column>
        <!--  图片 -->
        <el-table-column prop="commonMaterialsSkuPicture" label="图片" width="76">
          <template slot-scope="scope">
            <img style="width:40px;height:40px;margin: 3px 5px"
                  @click="imgList(scope.row.imgPath,'single')"
                  :src="scope.row.imgPath"
                  alt="">
          </template>
        </el-table-column>
        <el-table-column
            prop="materialNo"
            label="物料款号">
        </el-table-column>
        <el-table-column
            prop="supplierName"
            label="供应商">
        </el-table-column>
        <el-table-column
            label="供应商款号/色号">
          <template slot-scope="scope">
              <span>{{scope.row.supplierStyleNo}}</span>
              <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo">/</span>
              <span>{{scope.row.supplierColorNo}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="materialName"
            label="物料名称">
        </el-table-column>
        <el-table-column
            prop="colorName"
            label="颜色">
        </el-table-column>
        <el-table-column
            prop="specificationsRemark"
            label="规格">
        </el-table-column>
        <el-table-column
            prop="styleNo"
            label="商品款号">
        </el-table-column>
        <el-table-column
            prop="demandSourceNo"
            label="工单号">
        </el-table-column>
        <el-table-column
            prop="unit"
            label="单位">
        </el-table-column>
        <el-table-column
            prop="quantityRefund"
            label="本次回料">
        </el-table-column>
      </el-table>
    </template>
    <template v-else>
      <el-table
          :data="materialData.materials"
          key="materials"
          border
          empty-text="暂无数据">
        <!--  图片 -->
        <el-table-column prop="commonMaterialsSkuPicture" label="图片" width="76">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">
              <img style="width:40px;height:40px;margin: 3px 0"
                   v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                   @click="imgList(item)"
                   :src="item.commonMaterialsPictureList[0].path?item.commonMaterialsPictureList[0].path:item.commonMaterialsPictureList[0]"
                   alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="kindName"
            label="分类">
        </el-table-column>
        <el-table-column
            prop="number"
            label="物料款号">
        </el-table-column>
        <el-table-column
            label="供应商">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.supplierName }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="供应商款号/色号">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">
              <span>{{item.supplierStyleNo}}</span>
              <span v-if="item.supplierStyleNo && item.supplierColorNo">/</span>
              <span>{{item.supplierColorNo}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="物料名称">
        </el-table-column>
        <el-table-column
            label="颜色">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.colorName }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="规格">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.specificationsNumber }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="仓位">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.position }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="商品款号">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.styleNo }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="工单号">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.facMissionOrderNo }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="单位">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.unitName }}</div>
          </template>
        </el-table-column>
        <el-table-column
            label="本次送料">
          <template slot-scope="scope">
            <div class="cell__row" v-for="item in scope.row.materialSkus">{{item.quantityCompleted }}</div>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <!--//图片预览-->
    <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists"
                :imgIndex="imgIndex"></imgPreview>

  </div>
</template>

<script>
  export default {
    name: "material-report-table",
    props: ["materialData"],
    data() {
      return {
        centerDialogVisible: false, //判断显示图片预览显示与隐藏
        imgLists: [],
        imgIndex: 0,
      }
    },
    methods: {
      // 图片预览
      imgList(row, type) {
        if(type) {
          this.imgIndex = 0;
          this.imgLists = [{path: row}]
        } else {
          if (row.commonMaterialsPictureList[0].path) {
            this.imgIndex = 0;
            this.imgLists = row.commonMaterialsPictureList;
          } else {
            this.imgLists = []
            row.commonMaterialsPictureList.forEach(item => {
              this.imgLists.push({path: item})
            })
          }
        }
        this.centerDialogVisible = true;
      },
    },
    mounted() {
    }
  }
</script>

<style lang="scss" scoped>
  .material-report-table {

    .cell__row {
      flex: 1;
      line-height: 16px;
      padding: 0 10px;
      font-size: 12px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      &:not(:last-child) {
        border-bottom: 1px solid #E6EAF0
      }
    }
    margin: 15px 0;
  }
</style>
<style  lang="scss">
  .material-report-table {
    .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #fff;
    }
    .el-table td .cell{
      height: 100%;
      text-align: center;
      font-size: 12px;
      padding: 0;
      display: flex;
      flex-direction: column;
      line-height:12px;
      justify-content: center;
    }
  .el-input__inner {
    border: none;
  }


  }
</style>
