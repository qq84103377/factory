<template>
    <div class="material-list scroll-content">
      <page-title style="padding: 16px 24px 8px;" :title="isSampleMaterial?'样料到料单列表':'到料单列表'">
        <div class="btns">
          <el-input @input="getData" v-model="queryColumn" class="mgl8" style="width: 300px;font-size: 12px;margin-right: 6px;"
                    placeholder="输入到料单号/采购员/供应商/物料/生产单号" icon="search"></el-input>
          <span>筛选</span>
          <material-filter ref="purchaseListFilter"  :isSampleMaterial="isSampleMaterial"  @submit="filterData"></material-filter>
          <el-button @click="excel">导出表格</el-button>
          <nf-button v-if="isSampleMaterial&&!isPrint" class="btn btn-reset" @click="handlerClickPrtitSure">打印送检单</nf-button>
          <nf-button class="btn btn-reset" v-if="isSampleMaterial&&isPrint" @click="handlerClickPrtitSure">取消</nf-button>
          <nf-button  type="warning" v-if="isSampleMaterial&&isPrint" @click="prtitSure">确定</nf-button>
          <nf-button type="warning" @click="addMaterial">+ 新建到料单</nf-button>
        </div>
      </page-title>
      <!-- 查询条件 -->
      <!--<masterial-filter :isSampleMaterial="isSampleMaterial" @formData="formData" @filterData="filterData" @excel="excel" :isPrint.sync="isPrint" @prtitSure="prtitSure"></masterial-filter>-->
      <el-row style="padding: 0 24px;" ref="materialListContent" class="main-content mgt12">
        <el-table class="material-list-table"
                  :key="isSampleMaterial?'sampleMaterialTable':'materialTable'"
                  :data="tableData"
                  :height="tableHeight"
                  :row-class-name="tableRowClassName"
                  border
                  @select-all="selectAll"
                  v-loading = 'loading'
                  style="width: 100% ">
          <!-- <el-table-column
            v-if="isPrint"
            align="center"
            type="selection"
            width="55">
          </el-table-column>   -->
          <el-table-column
                  v-if="isPrint"
                  align="center"
                  :render-header="renderHeaderCheck"
                  width="55">

            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, index1) in item.meterialSkuSet" :key="index1"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div style="margin-bottom:-1px;" :key="index2"
                       v-for="(k, index2) in e.meterialPurchaseDetail"
                       :class="{'specific-table': true, 'border-bottom': true}">
                    <div><el-checkbox v-model="k.checked"></el-checkbox></div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="标签" align="center" min-width="120" v-if="configArr.includes('标签')">
            <template slot-scope="scope">
              <div class="tag" v-for="(el,elIndex) in scope.row.billLabelList" :key="elIndex"><span class="color-text" :class="{'cancel-tag':scope.row.cancel}">{{el.commonBillLabelName}}</span></div>
              <select-tag v-if="!scope.row.cancel&&isTagShow" :selectTagList="scope.row.billLabelList" :tagList="tagList" @addSuccess="addSuccess" :orderId="scope.row.billMaterialArriveId"  @selectItem="selectItem"></select-tag>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="到料单号" align="center" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.orderNo}}</div>
              <div v-if="scope.row.cancel">(已撤销)</div>
            </template>
          </el-table-column>
          <el-table-column prop="dateArrive" label="到料日期" align="center" width="90">
            <template slot-scope="scope">
              {{scope.row.dateArrive | filterTime}}
            </template>
          </el-table-column>
          <el-table-column prop="supplierName" label="供应商" v-if="configArr.includes('供应商')" align="center" width="90"></el-table-column>
          <el-table-column prop="orderNo" label="采购单号" v-if="configArr.includes('采购单号')" align="center" min-width="140">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index" class="specific-table border-bottom"
                   :style="{'height': getHeight(item.meterialSkuSet)}">
                <div>{{item.orderNo}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="isSampleMaterial" label="采购员" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index" class="specific-table border-bottom"
                   :style="{'height': getHeight(item.meterialSkuSet)}">
                <div>{{item.purchaserName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="isSampleMaterial" prop="orderNo" label="设计款号" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index" class="specific-table border-bottom"
                   :style="{'height': getHeight(item.meterialSkuSet)}">
                <div>{{item.designStyleNo}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分类" v-if="configArr.includes('分类')" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.kindName}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" v-if="configArr.includes('图片')" label="图片" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div><img style="width:70px;height: 100%;margin-left: 10px;"
                            v-if="e.commonMaterialsPictureList && e.commonMaterialsPictureList.length"
                            @click="imgList(e)"
                            :src="e.commonMaterialsPictureList[0].path?e.commonMaterialsPictureList[0].path:e.commonMaterialsPictureList[0]"
                            alt=""></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="物料款号" v-if="configArr.includes('物料款号')" align="center" min-width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.materialsNo}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="isSampleMaterial" prop="orderNo" label="样料" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.sampleMaterial?'样料':''}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="物料名称" v-if="configArr.includes('物料名称')" align="center" min-width="200">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div :title="e.materialsName"><span style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{e.materialsName}}</span></div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="颜色" v-if="configArr.includes('颜色')" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.colorName?e.colorName:e.colorValue}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="规格" v-if="configArr.includes('规格')" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.specificationsRemark?e.specificationsRemark:e.specificationsNo}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" align="center" width="110">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key" class="specific-table border-bottom"
                     :style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">
                  <div>{{e.supplierStyleNo}}/{{e.supplierColorNo}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="库存单位" v-if="configArr.includes('单位')" align="center" width="90">-->
          <!--<template slot-scope="scope">-->
          <!--<div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">-->
          <!--<div v-for="(e, key) in item.meterialSkuSet" :key="key" class="cell__row"-->
          <!--:style="{'height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':'',-->
          <!--'line-height':e.meterialPurchaseDetail.length?e.meterialPurchaseDetail.length * 24+'px !important':''}">-->
          <!--{{e.unit}}-->
          <!--</div>-->
          <!--</div>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="商品款号" align="center" :render-header="renderHeader" width="260">-->
          <!--<template slot-scope="scope">-->
          <!--<div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">-->
          <!--<div v-for="(e, index1) in item.meterialSkuSet" :key="index1"-->
          <!--:class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">-->
          <!--<div style="margin-bottom:-1px;" v-if="k.type!==1" :key="index2"-->
          <!--v-for="(k, index2) in e.meterialPurchaseDetail"-->
          <!--:class="{'specific-table': true, 'border-bottom': true}">-->
          <!--&lt;!&ndash; 商品款号','工单号','采购计划 &ndash;&gt;-->
          <!--<div>{{k.styleNo}}</div>-->
          <!--<div>{{k.demandSourceBillNo}}</div>-->
          <!--<div>{{k.planBuyQuantity}}</div>-->
          <!--</div>-->
          <!--<div v-else style="height:24px;line-height:24px;padding-left:12px;margin-bottom:-1px;"-->
          <!--:style="{'border-bottom':e.meterialPurchaseDetail.length!==index2?'1px solid rgb(223, 228, 236)':''}">-->
          <!--计划外采购（无采购需求）-->
          <!--</div>-->
          <!--</div>-->
          <!--</div>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="商品款号" v-if="configArr.includes('商品款号')&&!isSampleMaterial" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, index1) in item.meterialSkuSet" :key="index1"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div style="margin-bottom:-1px;" v-if="k.type!==1" :key="index2"
                       v-for="(k, index2) in e.meterialPurchaseDetail"
                       :class="{'specific-table': true, 'border-bottom': true}">
                    <div>{{k.styleNo}}</div>
                  </div>
                  <div v-else style="height:24px;padding-left:12px;margin-bottom:-1px;"
                       :style="{'border-bottom':e.meterialPurchaseDetail.length!==index2?'1px solid rgb(223, 228, 236)':''}">
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="生产单号" v-if="configArr.includes('生产单号')&&!isSampleMaterial" align="center" width="180">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, index1) in item.meterialSkuSet" :key="index1"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div style="margin-bottom:-1px;" v-if="k.type!==1" :key="index2"
                       v-for="(k, index2) in e.meterialPurchaseDetail"
                       :class="{'specific-table': true, 'border-bottom': true}">
                    <div>{{k.demandSourceBillNo}}</div>
                  </div>
                  <div v-else style="height:24px;padding-left:12px;margin-bottom:-1px;"
                       :style="{'border-bottom':e.meterialPurchaseDetail.length!==index2?'1px solid rgb(223, 228, 236)':''}">
                    计划外采购
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="计划采购" v-if="configArr.includes('计划采购')&&!isSampleMaterial" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, index1) in item.meterialSkuSet" :key="index1"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div style="margin-bottom:-1px;" v-if="k.type!==1" :key="index2"
                       v-for="(k, index2) in e.meterialPurchaseDetail"
                       :class="{'specific-table': true, 'border-bottom': true}">
                    <div>{{k.planBuyQuantity}}</div>
                  </div>
                  <div v-else style="height:24px;padding-left:12px;margin-bottom:-1px;"
                       :style="{'border-bottom':e.meterialPurchaseDetail.length!==index2?'1px solid rgb(223, 228, 236)':''}">
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!--<el-table-column label="采购数[采购单位]" align="center" width="90">-->
            <!--<template slot-scope="scope">-->
              <!--<div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">-->
                <!--<div v-for="(e, key) in item.meterialSkuSet" :key="key"-->
                     <!--:class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">-->
                  <!--<div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"-->
                       <!--:class="{'specific-table':true, 'border-bottom': true}">-->
                    <!--<div>{{k.purchaseQuantityNow}}{{e.purchaseUnitName}}</div>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column label="到料数[采购单位]" align="center" min-width="110">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.deliveryQuantityNow}}{{e.purchaseUnitName}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="本次采购[库存单位]" v-if="configArr.includes('本次采购')" align="center" min-width="110">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.purchaseQuantityStockUnitNow}}{{e.unit}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="本次到料[库存单位]" align="center" min-width="110">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.deliveryStockUnitQuantityNow}}{{e.unit}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="合计采购数" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.purchaseQuantityNowTotal}}{{e.purchaseUnitName}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="合计采购" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.purchaseQuantityStockUnitNowTotal}}{{e.unit}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="合计到料数" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.deliveryQuantityNowTotal}}{{e.purchaseUnitName}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="合计到料" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.deliveryStockUnitQuantityNowTotal}}{{e.unit}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="到料转化率" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.conversionRate}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="到料单价" v-if="configArr.includes('到料单价')" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>{{k.priceUnit}}元/{{e.purchaseUnitName}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="到料金额" align="center" width="90">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.materialPurchaseListDTOSet" :key="index">
                <div v-for="(e, key) in item.meterialSkuSet" :key="key"
                     :class="{'border-bottom':item.meterialSkuSet.length == 1&&index !=scope.row.materialPurchaseListDTOSet.length- 1}">
                  <div v-for="(k,index1) in e.meterialPurchaseDetail" :key="index1"
                       :class="{'specific-table':true, 'border-bottom': true}">
                    <div>¥{{k.priceTotal}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="到料总额" align="center" width="90">
            <template slot-scope="scope">
              <span>￥{{scope.row.arriveAmount || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="到料仓库" prop="storehouseName" align="center" min-width="90"></el-table-column>
          <el-table-column label="到料员" prop="creatorName" align="center" width="90"></el-table-column>
          <el-table-column v-if="addtype" label="应付款" prop="payOrReceiveAmount" align="center" width="90"></el-table-column>
          <el-table-column v-if="addtype" label="已支付" prop="verificationOffAmount" align="center" width="90"></el-table-column>
          <el-table-column v-if="addtype" label="结欠" prop="balanceDueAmount" align="center" width="90"></el-table-column>
          <el-table-column
                  fixed="right"
                  label="操作"
                  width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="blue-text"
                         @click="toPrint(scope.row)" style="padding:10px;border-right:1px solid #E6EAF0;" v-show="!isSampleMaterial">
                打印
              </el-button>
              <el-button type="text" size="small" class="blue-text"
                         @click="toCheck(scope.row)">
                查看详情
              </el-button>
              <!-- <div class="cell__opera">
                <div class="cell__opera-left green">
                          打印
                      </div>
                      <div class="cell__opera-right deleted" @click="toCheck(scope.row)">
                          查看详情
                      </div>
              </div> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div style="padding: 8px 24px;" class="page-pagination">
        <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next"
                       :total="total" :current-page.sync="pageNum">
        </el-pagination>
      </div>
      <!--//图片预览-->
      <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                  :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

      <!-- 遮罩层 -->
      <transition name="opcity">
        <div style="z-index: 999" class="cover" @click='materialAddVisible =false' v-if='materialAddVisible'>
        </div>
      </transition>
      <!-- 新建物料 -->
      <transition name="right-move">
        <material-add
                @successCb="getData"
                @close="materialAddVisible = false"
                type="add"
                style="z-index: 1000;position: fixed;right: 0;top: 0;width: 100%;height: 100%;background: #fff;overflow-y: auto"
                v-if='materialAddVisible'
        ></material-add>
      </transition>
    </div>
</template>
<script>
    import materialFilter from './masterial-filter.vue';
    import {
        arriveList,
        arriveExcel,
        sampleMaterialExcel,
        getFinanceConfigByUserId,
        MPRFieldConfigList,
    } from '../../../api/material.js'
    import selectTag from '@/components/material/components/selectTag.vue'
    import {queryAllBillLabel,allocationBillLabel} from '@/api'
    import materialAdd from './material-add'

    const fun = require('../../Common/commonFun.js')
    export default {
        name:'materialList',
        components: {
            materialFilter,
            selectTag,
            materialAdd
        },
        data() {
            return {
                queryColumn: '',
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                isPrint: false, //显示打印选择框
                imgLists: [],
                imgIndex: 0,
                tableData: [],
                form: {},
                loading: false,
                pageCount: 0,
                total: 1,
                pageNum: 1,
                specific: ['商品款号', '生产单号', '计划采购'],
                addtype: false,
                printId: '',
                configArr:[],       //配置表头数组
                selection:[],       //配置表头数组
                checked:false,
                filterParams:{},
                tagList: [], // 标签的下拉列表
                isTagShow: true, // 标签权限
                materialAddVisible: false,
                tableHeight: 300,
                isPrint:false
            }
        },
        mounted () {
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.materialListContent.$el.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function() {
                    self.tableHeight = self.$refs.materialListContent.$el.offsetHeight
                }
            })
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            isSampleMaterial() {
                return this.$route.path === '/sampleMaterialList'
            }
        },
        watch: {
          isPrint (v) {
            if (!v) {
              this.selection = []
              this.tableData.forEach(item => {
                item.materialPurchaseListDTOSet.forEach(i => {
                  i.meterialSkuSet.forEach(v => {
                    v.meterialPurchaseDetail.forEach(j => {
                      this.$set(j, 'checked', false)
                    })
                  })
                })
              })
            }
          }
        },
        methods: {
          /**
           * 打印送检单
           */
          handlerClickPrtitSure(){
            this.isPrint = !this.isPrint
          },
            // 获取选择标签的下拉列表
            getQueryAllBillLabel() {
                let params = {
                    keyword: "",
                    userId: this.userId
                }
                queryAllBillLabel(params).then(res => {
                    this.tagList = res.data.data
                })
            },
            // 标签新建成功
            addSuccess() {
                this.getQueryAllBillLabel()
            },
            // 标签选择
            selectItem(billLabelList, orderId) {
                let params = {
                    orderId: orderId,
                    unitId: this.unitId,
                    billLabelList
                }
                allocationBillLabel(params).then(res => {
                    if (res.data.code == 0) {
                        this.getData()
                    }
                })
            },
            //获取动态配置数组
            getConfigArr(code) {
                let params = {
                    unitId: this.unitId,
                    moduleCode: code
                };
                MPRFieldConfigList(params).then(res => {
                    this.configArr = res.data.data.fieldConfigList;
                })
            },
            // 送检单打印
          prtitSure() {
            let flag = this.tableData.some(item => item.materialPurchaseListDTOSet.some(i => i.meterialSkuSet.some(v => v.meterialPurchaseDetail.some(j =>j.checked)))) // 有没有勾选数据
            if (!flag) return this.$message.error('请选择需打印的物料')
            let actionMaterialArriveIds = []
            this.tableData.forEach(item => {
              item.materialPurchaseListDTOSet.forEach(i => {
                i.meterialSkuSet.forEach(v => {
                  v.meterialPurchaseDetail.forEach(j => {
                    if(j.checked) {
                      actionMaterialArriveIds.push(j.actionMaterialArriveId)
                    }
                  })
                })
              })
            })
            window.localStorage.setItem('actionMaterialArriveIds', JSON.stringify(actionMaterialArriveIds))
            window.open(`/#/printShow?printType=inspection`)
          },
          // 全选
          selectAll(val) {
            this.tableData.forEach(item => {
              item.materialPurchaseListDTOSet.forEach(i => {
                i.meterialSkuSet.forEach(v => {
                  v.meterialPurchaseDetail.forEach(j => {
                    val.srcElement.checked > 0 ? this.$set(j, 'checked', true) : this.$set(j, 'checked', false)
                    // selection.length > 0 ? this.$set(j, 'checked', true) : this.$set(j, 'checked', false)
                  })
                })
              })
            })
          },
          // 样料到料单打印
          toPrint(row) {
            window.open(`/#/printShow?&businessId=${row.billMaterialArriveId}&printType=materialPrint&billType=arrive`)
          },
            //查看详情url传参
            toCheck(row){
                if(this.isSampleMaterial){
                    this.$router.push(`/sampleMaterialDetail?id=${row.billMaterialArriveId}&supplierId=${row.supplierId}&supplierName=${row.supplierName}`);

                } else {
                    this.$router.push(`/materialDetail?id=${row.billMaterialArriveId}&supplierId=${row.supplierId}&supplierName=${row.supplierName}`);
                }
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if(row.commonMaterialsPictureList&&row.commonMaterialsPictureList.length>0){
                    if(row.commonMaterialsPictureList[0].path){
                        this.imgIndex = 0;
                        this.imgLists = row.commonMaterialsPictureList;
                    }else {
                        this.imgLists = []
                        row.commonMaterialsPictureList.forEach(item =>{
                            this.imgLists.push({path:item})
                        })
                    }
                }
                this.centerDialogVisible = true;
            },
            // 新建倒料单
            addMaterial() {
                if(this.isSampleMaterial){
                    // 新建样料到料单   --权限
                    if(!(this.powerJudgement.permissions("fac.sampleArriveOrder.add"))){
                      return
                    }
                    // 跳到新建样料到料单
                    // this.$router.push('/sampleMaterialAdd?type=add&addtype='+ this.addtype)
                    this.materialAddVisible = true

                }else{
                    // 新建到料单 --权限
                    if(!(this.powerJudgement.permissions("fac.arriveOrder.add"))){
                      return
                    }
                    // 跳到新建到料单
                    // this.$router.push('/materialAdd?type=add&addtype='+ this.addtype)
                    this.materialAddVisible = true

                }
            },
            getFinanceConfigByUserId() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                }
                getFinanceConfigByUserId(params).then(res => {
                    if (res.data.code == 0) {
                        res.data.data.forEach((v, i) => {
                            if (v == 'ARRIVE_ORDER') {
                                this.addtype = true
                            }
                        })
                    }
                })
            },
            // 设置高度
            getHeight(arr) {
                let num = 0
                arr.forEach(v => {
                   num += v.meterialPurchaseDetail.length
                })
                let height = ''
                if (num == 0) {
                    height = '24px'
                } else {
                    height = 24 * num + 'px'
                }
                return height
            },
            // renderHeader(createElement, {column, $index}) {
            //     return <div class = "table-header" >
            //         {
            //             this.specific.map(item => {
            //             return <div> {item} </div>
            //         })
            // }
            // </div>;
            // },
            filterData(val) {
                this.form = val;
                this.getData()
            },
            // 分页
            loadingMore(page) {
                console.log(page);
                this.pageNum = page;

                this.getData('pageTurn')
                // this.fetchMissionList({ pageNo: page });
            },
            //封装到料单、样料到料单筛选和导出excel共用参数filterParams
            getFilterParams(){
                this.filterParams = {};
                let cancel;
                if(this.form.cancel){
                    if(this.form.cancel.length>1){
                        cancel = null
                    }else {
                        cancel = this.form.cancel[0]
                    }
                }else {
                    cancel = 0
                }
                this.filterParams = {
                    ids:this.form.ids,
                    searchParam:this.form.searchParam,
                    searchType:this.form.searchType,
                    unitId: this.unitId,
                    pageNum: this.pageNum,
                    pageSize:20,
                    dateArriveStart: this.form.orderDate && this.form.orderDate[0] != null ? fun.dateFormatter(this.form.orderDate[0], false) : undefined,
                    dateArriveEnd: this.form.orderDate && this.form.orderDate[1] != null ? fun.dateFormatter(this.form.orderDate[1], false) : undefined,
                    demandSourceBillId: this.form.demandSourceBillId || undefined,
                    supplierId: this.form.supplierId || undefined,
                    creatorId: this.form.creatorId || undefined,
                    purchaserIds: this.form.purchaserIds ? [this.form.purchaserIds] : undefined,    //采购员
                    storehouseId: this.form.storehouseId || undefined,
                    materialsNo: this.form.materialsNo || undefined,
                    orderNo: this.form.orderNo || undefined,
                    // styleNos: this.form.styleNos,
                    arriveStatus: this.form.arriveStatus && this.form.arriveStatus.length > 0 ? this.form.arriveStatus : undefined,
                    cancel:cancel,
                    belongModule:this.isSampleMaterial?1:0,
                    // designStyleNos:this.form.designStyleNos,
                    labelIds:this.form.labelIds,
                    queryColumn: this.queryColumn,
                };
            },
            getData(pageTurn) {
                this.getFilterParams();
                this.loading = true;
                arriveList(this.filterParams).then(res => {
                    if(res.data.code === 0){
                        this.tableData = res.data.data.list || [];
                        this.total = res.data.data.total;
                        this.cancel = res.data.cancel;
                        this.loading = false;
                        if(!pageTurn) return;
                        this.$nextTick(function () {
                            this.tableData.forEach(item => {
                                item.materialPurchaseListDTOSet.forEach(i => {
                                    i.meterialSkuSet.forEach(v => {
                                        v.meterialPurchaseDetail.forEach(j => {
                                            this.$set(j, 'checked', false)
                                        })
                                    })
                                })
                            })
                        })
                    }
                })
            },
            excel() {
                this.getFilterParams();
                //到料单、样料到料单导出excel不需要以下参数
                delete this.filterParams.pageNum;
                delete this.filterParams.pageSize;

                //样料到料单
                if(this.isSampleMaterial){
                    sampleMaterialExcel(this.filterParams).then(res => {
                        this.fileData = res.data;
                        let url = window.URL.createObjectURL(res.data);
                        let a = window.document.createElement('a');
                        a.setAttribute('href', url);
                        a.setAttribute('download', '样料到料单列表.xls');
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    })
                }
                //到料单
                else{
                    arriveExcel(this.filterParams).then(res => {
                        this.fileData = res.data;
                        let url = window.URL.createObjectURL(res.data);
                        let a = window.document.createElement('a');
                        a.setAttribute('href', url);
                        a.setAttribute('download', '到料单列表.xls');
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    })
                }

            },
            tableRowClassName(row, index) {
                if (row.cancel) {
                    return 'cancel-row'
                }else {
                    return '';
                }
            },
            renderHeaderCheck(createElement, { column, $index }) {
                return <div class="materiel-header">{<el-checkbox onChange={this.selectAll} vModel="checked"></el-checkbox>}</div>;
            },
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        // watch: {
        //     // 监听 是不是在样料到料单和到料单之间切换，是的话刷新列表，因为在样料到料单和到料单之间切换不会触发activated
        //     '$route'(to, from) {
        //         if((to.path ==='/sampleMaterialList'&&from.path ==='/materialList')||
        //             (from.path ==='/sampleMaterialList'&&to.path ==='/materialList')) {
        //             // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
        //             this.getConfigArr('ARRIVE');
        //             this.getData()
        //             this.getFinanceConfigByUserId()
        //         }
        //     }
        // },
        // activated(){
        //     this.getConfigArr('ARRIVE');
        //     this.getData()
        //     this.getFinanceConfigByUserId()
        // },
        created() {
            // 标签权限问题
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.defectiveLabel.queryAllDefectiveLabel') == -1) {
                this.isTagShow = false
            }
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('ARRIVE');
            this.getData()
            this.getQueryAllBillLabel()
            this.getFinanceConfigByUserId()
        }
    }
</script>
<style lang="scss" scoped>
  .material-list {
    .tag{
      padding:3px 5px;
      word-wrap: break-word;
      word-break: normal;
      box-sizing: border-box;
      height: 24px;
      line-height: 24px;
    }
    .color-text{
      background-color: #ff9c38;
      color:#fff;
      display:inline-block;
      height: 100%;
      width: 100%;
    }
    .cancel-tag{
      background-color: #666 !important;
    }
    .mgt12 {
      margin-top: 12px;
    }
    .blue-text {
      color: #1CA1FF;
      text-decoration: underline;
    }
    .page-pagination {
      display: flex;
      justify-content: flex-end;
      padding-top: 18px;
      padding-bottom: 30px;
    }
    .table-header {
      display: flex;
      // justify-content:space-between;
      font-size: 12px;
      font-weight: 600;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgb(223, 228, 236);
        height: 28px;
        &:nth-child(1) {
          width: 72px;
        }
        &:nth-child(2) {
          width: 120px;
        }
        &:nth-child(3) {
          width: 68px;
          border: none;
        }
      }
    }
    .border-bottom {
      border-bottom: 1px solid rgb(223, 228, 236) !important;
      margin-bottom: -1px;
    }
    .specific-table {
      padding: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 1px solid rgb(223, 228, 236);
      &:last-child {
        border: none;
      }
      div {
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:nth-child(1) {
          width: 100%;
        }
        &:nth-child(2) {
          width: 120px;
        }
        &:nth-child(3) {
          width: 68px;
          border: none;
        }
      }
    }
    .cell__row, .row-border {
      height: 24px;
      line-height: 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      word-break: break-all;
      border-bottom: 1px solid #E6EAF0;
      box-sizing: border-box;
      margin-bottom: -1px;
      // &:last-child {
      //   border: none;
      // }
    }
  }

</style>
<style lang="scss">
  @import '../../../assets/style/el-table.scss';

  .material-list {
      .material-list-table  .el-table__body,
      .material-list-table .el-table__header{
          width: 100% !important;
      }
    .el-table__body {
      .cell,
      td {
        padding: 0;
      }
    }
    .el-table tbody tr td {
      font-size: 12px;
      height: 24px;
      color: #3b3b3b;
    }
    .el-table .cell {
      line-height: 12px;
    }
    .el-table .cell, .el-table th > div{padding: 0}
    .el-table .cancel-row {
        td {
            color:#A2ABB8;
        }
    }
}
</style>

