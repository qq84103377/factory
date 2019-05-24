<template>
    <div :class="{'material-new-remove-right':source=='detailReturnPurchase','new-return':true}" v-loading="loading">
        <page-title :title="source=='detailReturnPurchase'?'退料单重编辑':'新建退料单'">
            <div class="btns">
                <nf-button style="width:94px;font-size:12px;" @click="cancelAdd">取消</nf-button>
                <nf-button style="width:94px;font-size:12px;" type="warning" @click="handleSubmit" :loading="btnLoading">确定</nf-button>
            </div>
        </page-title>

        <base-box>
            <el-form
                    ref="returnForm"
                    label-width="100px"
                    class="new-return-form"
                    :rules="rules"
                    :model="formData">
                <el-row class="new-return-form--row" type="flex">

                    <el-form-item class="new-return-form__item red-star" label="物料供应商">
                        <!--<el-select-->
                                <!--@change="handleSelectSupplier"-->
                                <!--:style="styleObj"-->
                                <!--v-model="formData.supplierId"-->
                                <!--placeholder="请选择供应商">-->
                            <!--<el-option v-for="item of options.supplierList" :key="item.id" :value="item.id"-->
                                       <!--:label="item.name"></el-option>-->
                        <!--</el-select>-->
                        <supplier-select :canAdd = 'true' :parentSupplier="supplierIdArr" @getSupplierId="getSupplierId"></supplier-select>
                    </el-form-item>
                    <el-form-item class="new-return-form__item" label="退料单号">
                        <el-input :style="styleObj" v-model="formData.orderNo" placeholder="不填则自动生成流水号">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="new-return-form__item" label="退料员" required>
                        <workerLeader v-model="formData.creatorId" :style="styleObj"
                                      :single="'single'"
                                      :placeholder="'请选择或搜索'"></workerLeader>
                    </el-form-item>
                    <el-form-item class="new-return-form__item" required label="退料日期">
                        <el-date-picker
                                :style="styleObj"
                                v-model="formData.dateReturn"
                                type="date"
                                placeholder="请选择退料日期"
                                :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>

                </el-row>
                <el-row class="new-return-form--row" type="flex">
                    <el-form-item class="new-return-form__item" prop="storehouseId" label="退料仓库">
                        <el-select :style="styleObj" v-model="formData.storehouseId" placeholder="请选择仓库">
                            <el-option v-for="item of options.storeList" :key="item.id" :value="item.id"
                                       :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item class="new-return-form__item" label="收到退款">-->
                    <!--<el-input :style="styleObj" v-model="formData.amountRefund" placeholder="请输入金额">-->
                    <!--<template slot="prepend">￥</template>-->
                    <!--</el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item style="width: 50%" class="new-return-form__item" label="备注信息">
                        <el-input :style="styleObj" v-model="formData.remark" placeholder="请输入备注">
                        </el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="new-return__content">
                <div class="new-return__table">
                    <el-row class="new-return__table--title" type="flex">
                        <p class="return-num">本次退料：<strong>{{selectedList.length}} 款</strong></p>
                        <p class="return-money">退料金额：<strong>¥{{money}}</strong></p>
                    </el-row>
                    <el-table
                            v-if="canShow"
                            :data="selectedList"
                            border>
                        <el-table-column label="分类" v-if="configArr.includes('分类')" width="100" prop="kindName"></el-table-column>
                        <el-table-column label="图片" v-if="configArr.includes('图片')" width="80">
                            <template slot-scope="scope">
                                <div>
                                    <img style="width:25px;height: 25px;vertical-align: middle;cursor:pointer;"
                                         v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                         @click="imgList(scope.row)"
                                         :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                         alt="">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="物料款号" v-if="configArr.includes('物料款号')" width="140" prop="materialsNo"></el-table-column>
                        <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="130" prop="supplierStyleNo"></el-table-column>
                        <el-table-column label="物料名称" v-if="configArr.includes('物料名称')" width="140" prop="materialsName"></el-table-column>
                        <el-table-column label="颜色" v-if="configArr.includes('颜色')" width="70" prop="colorName">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="规格" v-if="configArr.includes('规格')" width="70" prop="specificationsRemark"></el-table-column>
                        <el-table-column label="库存单位" v-if="configArr.includes('单位')" width="80" prop="unit">
                            <template slot-scope="scope">
                                <div>
                                    {{scope.row.unit||scope.row.stockUnitName}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购单位" width="80" prop="purchaseUnitName"></el-table-column>
                        <el-table-column class-name="no-padding-column" align="center" label="到料单号" width="200"
                                         prop="orderNo">
                        </el-table-column>
                        <el-table-column class-name="no-padding-column date-dao" align="center" label="到料日期" width="200"
                                         prop="dateArrive">
                            <template slot-scope="scope">
                                <span class="inner-text">{{ scope.row.dateArrive |filterTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" align="center" label="采购单号" width="200"
                                         prop="billMaterialPurchaseNo">
                        </el-table-column>
                        <!--<el-table-column label="商品款号" align="center" :render-header="renderHeader" width="260">-->
                            <!--<template slot-scope="scope">-->
                                <!--<div>-->
                                    <!--<div style="margin-bottom:-1px;" v-if="scope.row.type!==1"-->
                                        <!--:class="{'specific-table': true, 'border-bottom': true}">-->
                                    <!--&lt;!&ndash; 商品款号','工单号','采购计划 &ndash;&gt;-->
                                    <!--<div>{{scope.row.styleNo}}</div>-->
                                    <!--<div>{{scope.row.demandSourceBillNo}}</div>-->
                                    <!--<div>{{scope.row.planBuyQuantity}}</div>-->
                                    <!--</div>-->
                                    <!--<div v-else>-->
                                    <!--计划外采购（无采购需求）-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column label="商品款号" align="center" width="120">
                            <template slot-scope="scope">
                                <div>
                                    <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                         :class="{'specific-table': true, 'border-bottom': true}">
                                        <div>{{scope.row.styleNo}}</div>
                                    </div>
                                    <div v-else></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="生产单号" align="center" width="160">
                            <template slot-scope="scope">
                                <div>
                                    <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                         :class="{'specific-table': true, 'border-bottom': true}">
                                        <div>{{scope.row.demandSourceBillNo}}</div>
                                    </div>
                                    <div v-else>
                                        计划外采购
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="计划采购" align="center" width="120">
                            <template slot-scope="scope">
                                <div>
                                    <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                         :class="{'specific-table': true, 'border-bottom': true}">
                                        <div>{{scope.row.planBuyQuantity}}</div>
                                    </div>
                                    <div v-else></div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="本次采购[库存单位]" width="140"
                                         prop="purchaseQuantityNow">
                            <template slot-scope="scope">
                               <div style="text-align: center;line-height: 32px;">{{scope.row.purchaseStockUnitQuantityNow}}{{scope.row.unit||scope.row.stockUnitName}}</div>
                                <!--<table-cell-list :list="scope.row.subRows" prop="purchaseQuantityNow"></table-cell-list>-->
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="到料数[采购单位]" width="120"
                                         prop="purchaseQuantityNow">
                            <template slot-scope="scope">
                                <div style="text-align: center;line-height: 32px;">{{scope.row.deliveryQuantityNow}}{{scope.row.purchaseUnitName}}</div>
                            </template>
                        </el-table-column>
                        <!--<el-table-column class-name="no-padding-column" label="采购单价" width="70" align="center" prop="unitCost">-->
                        <!--</el-table-column>-->
                        <el-table-column class-name="no-padding-column" label="本单到料[库存单位]" min-width="140" align="center" prop="deliveryQuantityNow">
                            <template slot-scope="scope">
                                <!--<table-cell-list :list="scope.row" prop="deliveryQuantityNow"></table-cell-list>-->
                                <div style="text-align: center;line-height: 32px;">{{scope.row.deliveryStockUnitQuantityNow}}{{scope.row.unit||scope.row.stockUnitName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="到料单价" width="70"
                                         prop="unitCost">
                            <template slot-scope="scope">
                                <!--<table-cell-list :list="scope.row" prop="deliveryQuantityNow"></table-cell-list>-->
                                <div style="text-align: center;line-height: 32px;">{{scope.row.unitCost||scope.row.planCost}}元/{{scope.row.purchaseUnitName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="退料数[采购单位]" width="120" fixed="right"
                                         prop="a">
                            <template slot-scope="scope">
                                <div class="this center-block" >
                                    <el-input :maxlength="inputMaxL" @change="quantityChange(scope.row,1)" type="number"
                                              placeholder="请输入" v-model="scope.row.quantity"></el-input>
                                    <span style="flex: 0 0 20%;white-space: nowrap">{{scope.row.purchaseUnitName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="本次退料[库存单位]" width="140" fixed="right">
                            <template slot-scope="scope">
                                <div class="this center-block" >
                                    <el-input :maxlength="inputMaxL" @change="quantityChange(scope.row,2)" type="number"
                                              placeholder="请输入" v-model="scope.row.quantityReturn"></el-input>
                                    <span style="flex: 0 0 20%;white-space: nowrap">{{scope.row.unit||scope.row.stockUnitName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="退料转化率" width="90" fixed="right">
                            <template slot-scope="scope">
                                <div class="this center-block" >
                                    <el-input :disabled="((scope.row.unit||scope.row.stockUnitName)===scope.row.purchaseUnitName)||((scope.row.unit||scope.row.stockUnitName)=='米'&&scope.row.purchaseUnitName=='码')" :maxlength="inputMaxL" @change="quantityChange(scope.row,3)" type="number"
                                              placeholder="请输入" v-model="scope.row.conversionRate"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="退料单价" width="140" fixed="right">
                            <template slot-scope="scope">
                                <div class="this">
                                    <span>￥</span>
                                    <el-input type="number" @input="priceUnitChange(scope.row)"
                                              placeholder="请输入" v-model.number="scope.row.priceUnit"></el-input>
                                    <span style="flex: 0 0 20%;white-space: nowrap">元/{{scope.row.purchaseUnitName}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="no-padding-column" label="退料金额" width="90" fixed="right">
                            <template slot-scope="scope">
                                <div style="text-align: center;line-height: 32px;">
                                    <span>￥</span>
                                    <span>{{((scope.row.quantity||0) * (scope.row.priceUnit||0)).toFixed(4)}}</span>
                                    <!--<el-input type="number" @change="sumChange(scope.row)"-->
                                              <!--placeholder="请输入" v-model="scope.row.sum"></el-input>-->

                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="table-search-btns">
                    <el-button :class="{'table-search-active':status==1}" @click="status = 1">+ 添加物料(按到料单)</el-button>
                    <el-button :class="{'table-search-active':status==2}" @click="status = 2">+ 添加物料(计划外退料)</el-button>
                </div>
                <div  v-if="status==1">
                    <!--这下面就是搜索表格-->
                    <el-row class="new-return__search">
                        <input type="text" v-model="searchKeyWordIn" @input="handleSearchIn"
                               placeholder="输入物料款号/物料名称/供应商款号/商品款号搜索添加">
                    </el-row>
                    <div class="new-return__table" >
                        <el-row class="new-return__table--title" type="flex">
                            <p>此供应商到料历史</p>
                        </el-row>
                        <el-table
                            v-if="canShow"
                            :data="arriveList"
                            class="tabless"
                            ref="multipleTable"
                            border
                            max-height="500">
                            <el-table-column class-name="table-column-row" label="选择" fixed="left" width="60" prop="deliveryQuantityNow" align="center">
                                <template slot-scope="scope">
                                    <el-checkbox
                                            @change="handleTableSelectionChange(scope.row.checked,scope.row)"
                                            v-model="scope.row.checked">
                                    </el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column label="供应商" v-if="configArr.includes('供应商')" width="150" prop="supplierName" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.supplierName?scope.row.supplierName:scope.row.supplierNo}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="分类" v-if="configArr.includes('分类')" width="100" prop="kindName" align="center">
                                <template slot-scope="scope">
                                    <span> {{scope.row.kindName?scope.row.kindName:scope.row.kindNo}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="图片" v-if="configArr.includes('图片')" width="120" prop="materialsNo" align="center">
                                <template slot-scope="scope">
                                    <div >
                                            <img style="width:auto;height: 32px;margin:0 10px"
                                                 v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                                 @click="imgList(scope.row)"
                                                 :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                                 alt="">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="物料款号" v-if="configArr.includes('物料款号')" width="140" prop="materialsNo" align="center">
                                <template slot-scope="scope">
                                    <div >
                                            {{scope.row.materialsNo}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="130" prop="supplierStyleNo" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="物料名称" v-if="configArr.includes('物料名称')" width="140" prop="materialsName" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.materialsName}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="颜色" v-if="configArr.includes('颜色')" width="70" prop="colorName" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="规格" v-if="configArr.includes('规格')" width="70" prop="specificationsRemark" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.specificationsRemark?scope.row.specificationsRemark:scope.row.specificationsNo}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="单位"  v-if="configArr.includes('单位')"width="50" prop="unit" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.unit}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="到料单号" width="140" align="center" prop="orderNo"></el-table-column>
                            <el-table-column label="到料日期" width="100" prop="dateArrive" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.dateArrive | filterTime}}
                                    </div>
                                </template>
                            </el-table-column>
                            <!--<el-table-column label="商品款号" align="center" :render-header="renderHeader" width="260">-->
                                <!--<template slot-scope="scope">-->
                                    <!--<div>-->
                                        <!--<div style="margin-bottom:-1px;" v-if="scope.row.type!==1"-->
                                            <!--:class="{'specific-table': true, 'border-bottom': true}">-->
                                        <!--&lt;!&ndash; 商品款号','工单号','采购计划 &ndash;&gt;-->
                                        <!--<div>{{scope.row.styleNo}}</div>-->
                                        <!--<div>{{scope.row.demandSourceBillNo}}</div>-->
                                        <!--<div>{{scope.row.planBuyQuantity}}</div>-->
                                        <!--</div>-->
                                        <!--<div v-else>-->
                                        <!--计划外采购（无采购需求）-->
                                        <!--</div>-->
                                    <!--</div>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <el-table-column label="商品款号" align="center" width="120">
                                <template slot-scope="scope">
                                    <div>
                                        <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                             :class="{'specific-table': true, 'border-bottom': true}">
                                            <div>{{scope.row.styleNo}}</div>
                                        </div>
                                        <div v-else>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="生产单号" align="center" width="160">
                                <template slot-scope="scope">
                                    <div>
                                        <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                             :class="{'specific-table': true, 'border-bottom': true}">
                                            <div>{{scope.row.demandSourceBillNo}}</div>
                                        </div>
                                        <div v-else>
                                            计划外采购
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="计划采购" align="center" width="120">
                                <template slot-scope="scope">
                                    <div>
                                        <div style="margin-bottom:-1px;" v-if="scope.row.type!==1"
                                             :class="{'specific-table': true, 'border-bottom': true}">
                                            <div>{{scope.row.planBuyQuantity}}</div>
                                        </div>
                                        <div v-else>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column label="本次采购" width="70" prop="purchaseQuantityNow" align="center">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.purchaseQuantityNow}}{{scope.row.unit}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="到料单价" width="70" prop="unitCost" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.unitCost}}元/{{scope.row.purchaseUnitName}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="本次到料" min-width="70" prop="deliveryQuantityNow" align="center">
                                <template slot-scope="scope">
                                    <div >
                                        {{scope.row.deliveryQuantityNow}}{{scope.row.unit}}
                                    </div>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div>
                    <!--<el-row class="new-return__pagination" type="flex" justify="end">-->
                        <!--<el-pagination-->
                                <!--style="padding: 0"-->
                                <!--@current-change="handleCurrentChange"-->
                                <!--:current-page.sync="pageConf.pageNum"-->
                                <!--:page-size="pageConf.pageSize"-->
                                <!--layout="total, prev, pager, next"-->
                                <!--:total="pageConf.pageTotal">-->
                        <!--</el-pagination>-->
                    <!--</el-row>-->
                </div>
                <div v-if="status==2" class="new-return__table" >
                    <!--这下面就是搜索表格-->
                    <el-row class="new-return__search" style="overflow: hidden;margin-bottom: 10px;">
                        <input type="text" v-model="searchKeyWord" @input="handleSearch"
                               placeholder="输入物料款号/物料名称/供应商款号/商品款号搜索添加">
                        <span class="table-search-span" @click="newMaterial">+ 新建物料</span>
                    </el-row>
                    <!--此表格数据全部都是动态配置，当用户取消全部字段时，不作显示-->
                    <el-table
                            v-if="canShow && configArr.length > 0"
                            :data="materielSkuList"
                            border
                            max-height="500">
                        <el-table-column class-name="table-column-row" width="60" label="选择" fixed="left" prop="deliveryQuantityNow" align="center">
                            <template slot-scope="scope">
                                <el-checkbox
                                        @change="handleTableSelectionChange(scope.row.checked,scope.row)"
                                        v-model="scope.row.checked">
                                </el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column prop="supplierName" v-if="configArr.includes('供应商')" label="供应商">
                            <template slot-scope="scope">
                                <span :style="{'color':item == searchKeyWord? '#FF7F14':''}"
                                      v-for="(item,i) in scope.row.supplierName"
                                      :key="i">{{item}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="kindsName" v-if="configArr.includes('分类')" label="分类">
                            <template slot-scope="scope">
                                <span>{{scope.row.kindsName?scope.row.kindsName:scope.row.kindsNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="commonMaterialsSkuPicture" v-if="configArr.includes('图片')" label="图片" width="76">
                            <template slot-scope="scope">
                                <div style="width:40px;height:40px;">
                                    <img style="width: 40px;height: 40px;"
                                         v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                         @click="imgList(scope.row)"
                                         :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:''"
                                         alt="">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialsNo" v-if="configArr.includes('物料款号')" label="物料款号">
                            <template slot-scope="scope">
                                <span :style="{'color':item == searchKeyWord? '#FF7F14':''}"
                                      v-for="(item,i) in scope.row.materialsNo"
                                      :key="i">{{item}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="supplierStyleNo" v-if="configArr.includes('供应商款号/色号')" label="供应商款号" width="120">
                            <template slot-scope="scope">
                                <span :style="{'color':item == searchKeyWord? '#FF7F14':''}"
                                      v-for="(item,i) in scope.row.supplierStyleNo"
                                      :key="i">{{item}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="supplierColorNo" v-if="configArr.includes('供应商款号/色号')" label="供应商色号" width="120">
                        </el-table-column>
                        <el-table-column prop="materialsName" v-if="configArr.includes('物料名称')" label="物料名称">
                            <template slot-scope="scope">
                                <span :style="{'color':item == searchKeyWord? '#FF7F14':''}"
                                      v-for="(item,i) in scope.row.materialsName"
                                      :key="i">{{item}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="colorName" v-if="configArr.includes('颜色')" label="颜色">
                            <template slot-scope="scope">
                                <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="specificationsName" v-if="configArr.includes('规格')" label="规格">
                            <template slot-scope="scope">
                                <span>{{scope.row.specificationsRemark}}</span>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </div>

            <!--财务收支-->
            <div class="materialListFinancial" v-if="addtype">
                <material-list-financial
                        ref="materialList"
                        :title="'应收退款'"
                        :money="money"
                        :supplier="formData.supplierId"
                        :supplierName="supplierName">
                </material-list-financial>
            </div>
        </base-box>
        <!-- 新建物料测窗 -->
        <!-- 遮罩层 -->
        <transition name="opcity">
            <div class="cover" @click='isShow1' v-if='isshow'>
            </div>
        </transition>
        <!-- 左侧的测弹窗 -->
        <transition name="right-move">
                <add-material
                        v-if='isshow'
                        title="新建物料"
                        @cancel='isshow= false'
                        @confirm='isshow= false'
                        @updateBoMTable = 'getDatalist'
                ></add-material>
        </transition>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>
</template>

<script>
    const fun = require('../../Common/commonFun.js')
    import TableCellList from './table-cell-list';
    import {supplierList, storeList, getPersonList, arriveList, materielSku, addReturn,createReturnOnArrive,updateReturn} from '@/api';
    import {
        MPRFieldConfigList
    } from '@/api/material.js';
    import {debounce} from '@/utils';
    import materialListFinancial from '../materialList/materialList-financial.vue'
    import supplierSelect from '@/components/Common/custom-select/supplier-select';
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件
    export default {
        props:['source','detailReturnPurchasedata'],
        data() {
            return {
                btnLoading: false,
                isshow: false,
                status:0,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                loading: false,
                searchKeyWord: '',
                searchKeyWordIn: '',
                styleObj: {
                    width: '100%'
                },
                options: {
                    supplierList: [],
                    storeList: [],
                    selectPersonList: []
                },
                pageConf: {
                    pageTotal: 0,
                    pageNum: 1,
                    pageSize: 20
                },
                supplierIdArr:[],
                formData: {
                    supplierId: '',
                    orderNo: '',
                    dateReturn: new Date(),
                    creatorId: '',
                    storehouseId: '',
                    amountRefund: '',
                    remark: ''
                },
                arriveList: [],
                selectedList: [],
                materielSkuList: [],
                searchSelection: [],
                arriveSelection: [],
                inputMaxL: 12,
                // specific: ['商品款号', '生产单号', '计划采购'],
                rules: {
                    supplierId: [
                        {
                            required: true, message: '请选择物料供应商'
                        }
                    ],
                    dateReturn: [
                        {
                            required: true, message: '请选择退料日期'
                        }
                    ],
                    creatorId: [
                        {
                            required: true, message: '请选择退料员', trigger: 'blur'
                        }
                    ],
                    storehouseId: [
                        {
                            required: true, message: '退料仓库'
                        }
                    ]

                },
                money: 0,
                sku: [],
                arriveListLine: [],
                selectList: [],
                addtype: false,
                configArr:[],       //配置表头数组
                canShow: false      //控制是否显示表格
            };
        },
        watch: {
            selectedList: {
                handler(val) {
                    this.money = 0;
                    val.forEach(el => {
                        if (el.sum == undefined) {
                            el.sum = 0;
                        }
                        this.money = (this.money + Number(el.sum)).toFixed(4) * 1;
                    })
                },
                deep: true
            }
        },
        components: {
            TableCellList,
            materialListFinancial,
            addMaterial,
            supplierSelect
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
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        created() {
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('RETURN');
            if(this.$route.query.addtype == 'false'){
                this.addtype = false
            }else {
                this.addtype = true
            }
            console.log(this.$route.query.addtype);
            // this.fetchSupplierList();
            this.fetchPersonList();
            this.fetchStoreList();
        },
        mounted(){
            //重编辑
            if(this.detailReturnPurchasedata){
                this.formData.supplierId = this.detailReturnPurchasedata.supplierId
                this.supplierIdArr = [{id:this.detailReturnPurchasedata.supplierId,name:this.detailReturnPurchasedata.supplierName}]
                this.formData.orderNo = this.detailReturnPurchasedata.billReturnNo
                this.formData.dateReturn = this.detailReturnPurchasedata.dateReturn
                this.formData.creatorId = this.detailReturnPurchasedata.creatorId
                this.formData.storehouseId = this.detailReturnPurchasedata.storehouseId
                this.formData.remark = this.detailReturnPurchasedata.remark
                let newArr = [];
                this.detailReturnPurchasedata.skus.forEach(item=>{
                    item.materialsSkuId = item.materialSkuId
                    item.specificationsNo = item.specificationsNumber
                    item.materialsName = item.materialName
                    item.materialsNo = item.materialNo
                    item.skuDetails.forEach($item=>{
                        for (let k in $item){
                            item[k]=$item[k]
                            if(k==='billArriveNo'){
                                $item.orderNo = $item[k]
                            }else if(k==='materialNo'){
                                $item.materialsNo = $item[k]
                            }else if(k==='arrivePriceUnit'){
                                $item.unitCost = $item[k]
                            }else if(k==='arriveQuantity'){
                                $item.deliveryQuantityNow = $item[k]
                            }else if(k==='returnQuantity'){
                                $item.quantity = $item[k]
                            }else if(k==='returnPriceUnit'){
                                $item.priceUnit = $item[k]
                            }
                        }
                        $item.sum = ($item.returnQuantity * $item.returnPriceUnit).toFixed(4);
                        let obj = {
                            ...item,
                            ...$item
                        }
                        newArr.push(obj)

                        // this.selectedList.push(item)

                    })

                })
                console.log(newArr);
                this.selectedList = newArr
                console.log(this.detailReturnPurchasedata);
            }
        },
        methods: {
            //获取动态配置数组
            getConfigArr(code) {
                let params = {
                    unitId: this.unitId,
                    moduleCode: code
                };
                MPRFieldConfigList(params).then(res => {
                    this.configArr = res.data.data.fieldConfigList;
                    //解决直接渲染表格错乱的问题
                    this.$nextTick(function(){
                        this.canShow = true;
                    })
                })
            },
            cancelAdd(){
                if (this.source){
                    this.$emit('editAgainSucc')
                }else {
                    this.$router.go(-1)
                }
            },
            // 行合并
            // renderHeader(createElement, {column, $index}) {
            //    return <div class = "table-header" >{this.specific.map(item => {return <div > {item} </div>})}</div>
            // },
            //退料加搜索
            handleSearchIn(){

                if (!this.formData.supplierId) {
                    this.$message.error('请选择供应商');
                    return;
                }
                this.handleSelectSupplier(this.formData.supplierId);
            },
            //获取供应商id
            getSupplierId(val){
                if(val){
                    this.formData.supplierId = val.id;
                    this.supplierName = val.name;
                    this.handleSelectSupplier(val.id);
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
            sumChange(val) {
                if(val.sum<0){
                    val.sum =0
                }
                val.priceUnit = val.sum / Number(val.quantity);
                val.priceUnit = val.priceUnit.toFixed(4);
            },
            async quantityChange(val,type) {
                if(type==1||type==2){
                    if((val.unit||val.stockUnitName)===val.purchaseUnitName) {
                        if(type==1){
                            val.quantityReturn = val.quantity
                        }else {
                            val.quantity = val.quantityReturn
                        }
                    }else if ((val.unit||val.stockUnitName)=='米'&&val.purchaseUnitName=='码') {
                        if(type==1){
                            val.quantityReturn = (val.quantity * 0.9144).toFixed(4)
                        }else {
                            val.quantity = (val.quantityReturn / 0.9144).toFixed(4)
                        }
                    }else {
                        val.conversionRate = val.quantity==0?0:((val.quantityReturn||0) / (val.quantity)).toFixed(4)
                    }
                }else {
                    val.quantityReturn = ((val.conversionRate||0) * (val.quantity||0)).toFixed(4)
                }
                if (val.priceUnit !== undefined) {
                    val.sum = (val.quantity * val.priceUnit).toFixed(4);
                }
            },
            priceUnitChange(val) {
                if(val.priceUnit<0){
                    this.$set(val,'priceUnit',0)
                }
                console.log(val);
                // this.sum(val);
                val.sum = (Number(val.quantity) * val.priceUnit).toFixed(4);
            },
            // sum(val) {
            //     var sum = 0;
            //     for (let item of val) {
            //         sum += Number(item.quantity);
            //     }
            //     if (isNaN(sum)) {
            //         return 0;
            //     } else {
            //         return sum;
            //     }
            // },
            handleSubmit() {
                // console.log(this.$refs.materialList.form, '9999999');
                if (!this.formData.supplierId) {
                    this.$message.error('请选择供应商');
                    return;
                }
                if (!this.formData.dateReturn) {
                    this.$message.error('请选择退料日期');
                    return;
                }
                if (!this.formData.creatorId) {
                    this.$message.error('请选择退料员');
                    return;
                }
                if (this.selectedList.length == 0) {
                    this.$message.error('请选择退料单');
                    return;
                }
                let sku = [];
                for (let item of this.selectedList) {
                    // for (let val of item.subRows) {  billMaterialArriveId quantityArriveReturn deliveryStockUnitQuantityNow quantityReturn
                        if(item.quantityReturn===''||item.quantityReturn==undefined){
                            this.$message.error('本次退料不能为空');
                            return;
                        }
                        if(item.billMaterialArriveId&&(item.quantityReturn*1 > (item.deliveryStockUnitQuantityNow*1-item.quantityArriveReturn*1))) {
                            this.$message.error(`本次退料不能大于${item.deliveryStockUnitQuantityNow*1-item.quantityArriveReturn*1}(已到料-已退料)`);
                            return;
                        }
                        if(item.quantity===''||item.quantity==undefined){
                            this.$message.error('退料数不能为空');
                            return;
                        }
                        if(item.priceUnit===''||item.priceUnit==undefined){
                            this.$message.error('退料单价不能为空');
                            return;
                        }
                        if(item.conversionRate===''||item.conversionRate==undefined){
                            this.$message.error('退料转化率不能为空');
                            return;
                        }
                        let obj = {};
                        obj.actionMaterialArriveId = item.actionMaterialArriveId;
                        obj.demandSourceBillId = item.demandSourceBillId;
                        obj.materialsSkuId = item.materialsSkuId;
                        obj.priceUnit = item.priceUnit; //退料单价
                        obj.quantity = item.quantity; //退料数
                        obj.quantityReturn = item.quantityReturn; //本次退料
                        obj.stockUnitName = item.unit||item.stockUnitName; //库存单位
                        obj.purchaseUnitName = item.purchaseUnitName; //采购单位
                        obj.conversionRate = item.conversionRate; //退料转化率
                        obj.type = item.type;
                        sku.push(obj);
                    // }
                }
                let params = {
                    "amountRefund": this.formData.amountRefund,
                    "creatorId": this.formData.creatorId,
                    "orderNo": this.formData.orderNo,
                    "remark": this.formData.remark,
                    "dateReturn": this.formData.dateReturn ? fun.dateFormatter(this.formData.dateReturn, false) : '',
                    "storehouseId": this.formData.storehouseId,
                    "supplierId": this.formData.supplierId,
                    "unitId": this.facId,
                    "userId": this.userId,
                    "materialsSkus": sku,
                };
                console.log(params,'=3=3=3=');
                // 财务收支字段
                if(this.addtype){
                    params = {
                        ...params,
                        remitMethodId: this.$refs.materialList.form.remitMethodId,//银行卡id
                        journalAccountAmount: this.$refs.materialList.form.journalAccountAmount,//收支金额
                        payOrReceiveAmount: this.money,//应付或应收金额
                        remitMethodName: this.$refs.materialList.form.remitMethodName,//银行卡名称
                        journalAccountCode: this.$refs.materialList.form.journalAccountCode,//流水单号
                        journalAccountDateCreated: this.$refs.materialList.form.dateCreatedBegin ? fun.dateFormatter(this.$refs.materialList.form.dateCreatedBegin, false) : '',//流水时间
                        salesmanName: this.$refs.materialList.form.salesmanName ? this.$refs.materialList.form.salesmanName:JSON.parse(sessionStorage.getItem("user_info")).userName,//业务员名称
                        salesmanId: this.$refs.materialList.form.salesmanId ? this.$refs.materialList.form.salesmanId:JSON.parse(sessionStorage.getItem("user_login")).userId, //业务员id
                    }
                }
                this.btnLoading = true
                if(this.source){
                    //重编辑
                    params.returnId = this.$route.query.id;
                    updateReturn(params).then(res => {
                        this.btnLoading = false
                        if (res.data.code == 0) {
                            this.$router.push('/return/detail?id='+res.data.data+'&supplierId='+this.formData.supplierId+'&supplierName='+this.supplierName);
                            this.$message.success('编辑成功');
                            this.$emit('editAgainSucc')
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }else {
                    addReturn(params).then(res => {
                        this.btnLoading = false
                        if (res.data.code == 0) {
                            this.$message.success('新建成功');
                            this.$router.push('/returnMarteriel')
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }

            },
            // 获取退料员下拉列表
            fetchPersonList() {
                getPersonList({
                    userId: this.userId,
                    unitId: this.facId
                }).then(res => {
                    this.options.selectPersonList = res.data;
                    if(this.source) return;
                    this.formData.creatorId=this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                });
            },
            // 获取退仓库下拉列表
            fetchStoreList() {
                const params = {
                    unitId: this.facId
                };
                storeList(params).then(res => {
                    this.options.storeList = res.data.storehouses;

                    this.options.storeList.forEach(item =>{
                        if(item.isDefault == true){
                            this.formData.storehouseId = item.id
                        }
                    })
                    if(this.source) return;
                    this.formData.storehouseId = res.data.storehouses[0].id;
                });
            },
            fetchArriveList() {
                let params = {
                    unitId: this.facId,
                    pageNum: this.pageConf.pageNum,
                    pageSize: this.pageConf.pageSize,
                    supplierId: this.formData.supplierId,
                    queryColumn:this.searchKeyWordIn
                }
                this.loading = true;
                createReturnOnArrive(params)
                    .then(res => {
                        let data = res.data.data;
                        this.pageConf = {
                            // pageNum: data.pageNum,
                            pageTotal: data.total,
                            pageSize: data.pageSize
                        };
                        // this.selectedList = [];
                        // this.selectList = [];
                        // this.arriveListLine = this.mapArriveList(data.list);
                        //自动勾选
                        if(!data.returnList) {
                            this.arriveList = []
                            this.loading = false;
                            return
                        };
                        data.returnList.forEach(item=>{
                            item.quantity=''
                        })
                        this.arriveList = data.returnList;
                        console.log(this.selectedList);
                        this.$nextTick(() => {
                            this.loading = false;
                            //自动勾选
                            if(!this.arriveList) {
                                this.arriveList = []
                                return
                            };
                            this.arriveList.forEach(item=>{
                                 const index = this.selectedList.findIndex($selItem=>$selItem.actionMaterialArriveId===item.actionMaterialArriveId)
                                 if(index>-1){
                                     this.$set(item,'checked',true)
                                     // $$$item.checked = true
                                 }
                            })
                        });
                        console.log(res.data, '-=======');
                    });
            },
            mapArriveList(list = []) {
                let arr = [];
                if(list.length===0) return
                list.forEach(listItem => {
                    listItem.materialPurchaseListDTOSet.forEach(materialItem => {
                        materialItem.meterialSkuSet.forEach(meterialSkuSetItem => {
                            meterialSkuSetItem.meterialPurchaseDetail.forEach(detailItem => {
                                let obj = {isRowSpan: true, ...listItem, priceUnit: '', quantity: '', totalMoney: ''};
                                obj = {...obj, ...materialItem};
                                obj = {...obj, ...meterialSkuSetItem};
                                obj = {...obj, ...detailItem};
                                obj.subRows = [JSON.parse(JSON.stringify(obj))];
                                arr.push(obj);
                            });

                        });
                    });
                });
                return arr;
            },
            fetchSearchList() {
                let params = {
                    keyWord: this.searchKeyWord,
                    userId: this.userId
                };
                materielSku(params).then(res => {
                    res.data.commonMaterialsSkuList = res.data.commonMaterialsSkuList.map(item => {
                        const obj = {
                            ...item,
                            kindName: item.kindsName,
                            unit: item.stockUnitName,
                            materialsSkuId: item.id,
                            orderNo: '直接退料'
                        }
                        obj.subRows = [JSON.parse(JSON.stringify(obj))];
                        return obj;
                    });
                    this.materielSkuList = res.data.commonMaterialsSkuList;
                    console.log(this.selectedList);
                    console.log(this.materielSkuList);
                    this.$nextTick(() => {
                        //自动勾选
                        this.materielSkuList.forEach(item=>{
                            const index = this.selectedList.findIndex($selItem=>!$selItem.actionMaterialArriveId && $selItem.materialsSkuId===item.materialsSkuId)
                            if(index>-1){
                                this.$set(item,'checked',true)
                                // $$$item.checked = true
                            }
                        })
                    });
                });
            },
            handleSelectSupplier(val) {
                this.pageConf.pageNum = 1;
                this.searchKeyWord = ''
                this.fetchArriveList();
            },
            // 分页
            handleCurrentChange(val) {
                this.pageConf.pageNum = val;
                this.fetchArriveList();
            },
            handleSearch() {
                if(!this.formData.supplierId){
                    this.$message.error('请选择物料供应商')
                    return
                }
                debounce(this.fetchSearchList)();
            },
            uniqueArriveList(list = []) {
                if (!list.length) return [];
                const arr = [];
                list = JSON.parse(JSON.stringify(list));
                list.forEach(item => {
                    const fItem = arr.find(arrItem => arrItem.materialsSkuId === item.materialsSkuId);
                    if (fItem) {
                        let bol = fItem.subRows.some(row => row.billMaterialArriveId === item.billMaterialArriveId
                            && row.actionMaterialArriveId === item.actionMaterialArriveId);
                        !bol && fItem.subRows.push(item);
                    }
                    else {
                        arr.push(item);
                    }
                });
                console.warn(arr);
                return arr;
            },
            getSelectList() {
                const uniqueArriveList = this.uniqueArriveList(this.arriveSelection);
                for (let item of this.searchSelection) {
                    const fItem = uniqueArriveList.find(arrItem => arrItem.materialsSkuId === item.materialsSkuId);
                    if (fItem) {
                        let bol = fItem.subRows.some(row => !row.billMaterialArriveId && row.materialsSkuId === fItem.materialsSkuId);
                        !bol && fItem.subRows.push(item);
                    }
                    else {
                        uniqueArriveList.push(item);
                    }
                }
                this.selectedList = uniqueArriveList;
            },
            handleTableSelectionChange(selection, row) {
                if (selection) {
                    //勾选
                    //  <el-input :disabled="(scope.row.unit===scope.row.purchaseUnitName)||(scope.row.unit=='米'&&scope.row.purchaseUnitName=='码')" :maxlength="inputMaxL" @change="quantityChange(scope.row,3)" type="number"
                    // placeholder="请输入" v-model="scope.row.conversionRate"></el-input>
                    this.$set(row,'priceUnit',row.purchaseUnitCost) //采购单价需要带到退料单价上
                    let num;
                    if((row.unit||row.stockUnitName)===row.purchaseUnitName) {
                        num = 1
                    }else if ((row.unit||row.stockUnitName)=='米'&&row.purchaseUnitName=='码') {
                        num = 0.9144
                    }
                    this.$set(row,'conversionRate',this.status==2?row.conversionRate:num) //按到料单添加物料需要前端算转化率
                    this.selectList.push(row)
                }else {
                    this.selectList.forEach((it, index) => {
                        if (it.actionMaterialArriveId == row.actionMaterialArriveId) {
                            this.selectList.splice(index, 1);
                        }
                    });
                }
                // this.arriveSelection = this.selectList;
                this.selectedList = this.selectList;
            },
            handleSearchTableChange(selection,row) {
                // this.searchSelection = selection;
                // this.getSelectList();
            },
            // 筛选倒料员
            getManId(arrId) {
                console.log(arrId);
                this.formData.creatorId = arrId
            },
            //新建物料
            isclick() {
                this.isShow = true;
            },
            // 点击遮罩层左侧关闭
            isShow1() {
                this.isshow = false;
            },
            getDatalist(val){
                console.log(val);
                // this.form.supplier = val;
            },
            // 新建物料显示
            newMaterial() {
                console.log(111);
                this.isshow = true;
            },
        }
    }
</script>


<style lang="scss">
    /* common */
    .new-return-form {
        .el-input__inner {
            height: 32px;
        }
    }

    .new-return__table .el-table {
        thead th {
            height: 28px;
            background: #F7F9FC;
            font-size: 12px;
            font-weight: bold;
            color: #808080;
        }

        tbody tr td {
            font-size: 12px;
            height: 32px;
            color: #3b3b3b;
            background-color: #fff !important;
        }
        .cell {
            position: relative;
            padding: 0 10px;
            background-color: #fff;
        }
        td.no-padding-column .cell {
            height: 100%;
            padding: 0;
        }
        .el-table__header-wrapper thead div {
            background-color: #F7F9FC;
            color: #808080;
        }
        .el-table__fixed-header-wrapper thead div {
            color: #808080;
            background-color: #F7F9FC;
        }
        .el-checkbox__inner {
            width: 14px;
            height: 14px;
            border-radius: 2px;
            &::after {
                border-width: 1px;
                height: 8px;
                left: 4px;
                top: 0
            }
        }
    }

    .this .el-input__inner {
        border: none;
        font-size: 12px;
        height: 32px;
        width: 100%;
        background-color: #F5F7FA;
    }

    .tabless {
        .el-table th > .cell {
            padding: 0;
        }
        .el-table__body {
            .cell,
            td {
                padding: 0;
            }
        }
        .el-table .cell {
            line-height: 12px;
        }
    }
    .popperClass{
        max-width: calc(100% - 300px);
    }

</style>

<style lang="scss" scoped>
    .material-new-remove-right{
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 300px) !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
        .page_title{
            padding: 16px;
        }

    }
    .new-return {
         .table-header {
            display: flex;
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 600;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                height: 28px;
                &:nth-child(1) {
                    padding: 0 6px;
                    width: 80px;
                    box-sizing: border-box;
                }
                &:nth-child(2) {
                    padding: 0 6px;
                    width: 140px;
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    width: 80px;
                    padding: 0 6px;
                    border: none;
                    box-sizing: border-box;
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
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
        .materialListFinancial {
            margin-top: 25px;
        }
        .red-star:before{
            position: absolute;
            top: 12px;
            left: 7px;
            content: '*';
            color: #ff4949;
            margin-right: 4px;
            font-size: 14px;
        }
        .table-search-btns{
            /*padding-left: 16px;*/
            margin: 10px 0;
            button:hover{
                color: #eb8f34;
                border: 1px solid #eb8f34;
            }
            .table-search-active{
                color: #eb8f34;
                border: 1px solid #eb8f34;
                margin-right: 10px;
            }

        }
    }

    .new-return-form {
        margin-left: -20px;
        &--row:last-child {
            padding-bottom: -10px
        }
        &__item {
            width: 25%;
            margin-right: 0;
            margin-bottom: 18px;
        }
    }

    .new-return__search {
        border: 1px solid #E6EAF0;
        line-height: 32px;
        height: 32px;
        .table-search-span{
            float: right;
            position: relative;
            top: -33px;
            right: 20px;
            cursor: pointer;
            color: #eb8f34;
        }
        input {
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px
        }
    }

    .new-return__table {
        margin-top: 16px;
        &--title {
            padding: 0 10px;
            font-size: 12px;
            line-height: 32px;
            background: #F7F9FC;
            border: 1px solid #E6EAF0;
            border-bottom: none;
            strong {
                color: #FF7F14;
                font-weight: 500
            }
            .return-num,
            .return-money {
                font-weight: 600
            }
            .return-money {
                margin-left: 24px;
            }
        }
    }

    .this {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #F5F7FA;
    }

    .cell__row {
        height: 32px;
        line-height: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        word-break: break-all;
        border-bottom: 1px solid #E6EAF0;
        box-sizing: border-box;
        margin-bottom: -1px;
    }

    .date-dao {
        ul {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            li {
                position: relative;
                display: flex;
                text-align: center;
                line-height: 32px;
                height: 32px;
                font-size: 12px;
                &:not(:last-child) {
                    border-bottom: 1px solid #E6EAF0;
                }
                .inner-text {
                    flex: 1
                }
                input {
                    width: 100%;
                    padding: 0 10px;
                    display: block;
                    font-size: 12px;
                    box-sizing: border-box;
                    background: #F7F9FC
                }
                .input-icon {
                    padding-left: 10px;
                    background: #F7F9FC;
                }
            }
        }
    }
</style>
