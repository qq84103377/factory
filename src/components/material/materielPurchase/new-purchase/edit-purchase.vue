<template>
    <div :class="{'purchase-new-remove-right':source=='detailPurchase'}" class="purchase-new">
        <page-title :class="{'mgt16 pdlr16':source}" :title="source?(isSampleMaterial?'样料采购单重编辑':'采购单重编辑'):(isSampleMaterial?'样料新建采购单':'新建采购单')">
            <div>
                <nf-button style="width:72px;" @click="cancelAdd">
                    取消
                </nf-button>
                <nf-button :loading="btnLoading" type="warning" @click="newMaterielPurchase">
                    确定
                </nf-button>
            </div>
        </page-title>
        <!-- 这里作为筛选的部分，时刻监听拿到最新的数据，而当供应商变化的时候，则需要重置表格的数据，获取一个勾选列表的新数据 -->
        <new-filter
                :isSampleMaterial="isSampleMaterial"
                ref="detailPurchase"
                :urlSupplier="urlSupplier"
                @supplierChange="supplierChange"
                @formData="getFormData">
        </new-filter>
        <div class="new-conent">
            <div class="table-census">
                <span style="font-weight: bold;color: #808080">本次采购：<span class="king">{{selected.length}} 款</span></span>
                <span style="font-weight: bold;color: #808080" class="last-span">采购金额：<span class="king">￥{{money.toFixed(2)}}</span></span>
            </div>
            <div id="select-table" class="select-table">
                <el-table :data="selected" border style="width: 100%">
                    <el-table-column label="采购单号"
                                     align="center"
                                     width="120"
                                     class-name="rowspan">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.orderNo" class="fs12" :maxlength="150"  placeholder="不填则自动生成"></el-input>
                        </template>
                    </el-table-column >
                    <el-table-column label="设计款号"
                                     align="center"
                                     width="120"
                                     class-name="rowspan">
                        <template slot-scope="scope">
                            <design-style-no-select v-model="scope.row.designStyleNo"></design-style-no-select>
                        </template>
                    </el-table-column >
                    <el-table-column label="到料仓库"
                                     align="center"
                                     width="160"
                                     class-name="rowspan">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.arriveStorehouseId"  placeholder="请选择">
                                <el-option
                                        v-for="item in store"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column >
                    <el-table-column label="备注信息"
                                     align="center"
                                     width="160"
                                     class-name="rowspan no-padding">
                        <template slot-scope="scope">
                            <el-input type="textarea" :autosize="{ minRows: 1}" v-model="scope.row.remark" class="fs12" :maxlength="150"  placeholder="请输入"></el-input>
                        </template>
                    </el-table-column >
                    <el-table-column prop="supplierName" label="供应商"  width="140" align="center" class-name="no-padding yellow-bg pointer">
                        <template slot-scope="scope">
                            <div> {{scope.row.supplierName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140" align="center">
                        <template slot-scope="scope">
                            {{scope.row.supplierStyleNo}}/
                            {{scope.row.supplierColorNo}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="kindsName" label="分类" v-if="configArr.includes('分类')" align="center">
                        <template slot-scope="scope">
                            {{scope.row.kindsName?scope.row.kindsName:scope.row.kindName}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="commonMaterialsSkuPicture" label="图片" v-if="configArr.includes('图片')" width="76"
                                     align="center">
                        <template slot-scope="scope">
                            <div style="width:40px;height:40px;display: inline-block;">
                                <img style="width:40px;height:40px;"
                                     :src="scope.row.commonMaterialsSkuPicture||''"
                                     alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialsNo" label="物料款号" v-if="configArr.includes('物料款号')" width="90"
                                     align="center">
                    </el-table-column>
                    <el-table-column prop="materialsName" width="120" label="物料名称" v-if="configArr.includes('物料名称')"
                                     align="center">
                    </el-table-column>
                    <el-table-column prop="colorName" label="颜色" v-if="configArr.includes('颜色')" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="specificationsNo" label="规格" v-if="configArr.includes('规格')" align="center">
                        <template slot-scope="scope">
                            <span>{{(scope.row.specificationsRemark || scope.row.specificationsName)?(scope.row.specificationsRemark || scope.row.specificationsName) :scope.row.specificationsNo}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column prop="sampleMaterial" label="样料" v-if="isSampleMaterial" width="90"
                                     align="center">
                        <template slot-scope="scope">
                            {{scope.row.sampleMaterial?'样料':''}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialsRemark" label="备注" v-if="configArr.includes('备注')" align="center">
                    </el-table-column>
                    <!--<el-table-column prop="styleNo" label="商品款号" :render-header="renderHeader" width="640">-->
                    <!--<template slot-scope="scope">-->
                    <!--<div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"-->
                    <!--v-for="(item,index) in scope.row.materialsSkus" :key="index">-->
                    <!--<div>{{item.styleNo}}</div>-->
                    <!--<div>{{item.demandSourceBillNo}}</div>-->
                    <!--<div>{{item.singleDosage}}</div>-->
                    <!--<div>{{item.skuQuantity}}</div>-->
                    <!--<div>{{item.lossRate?`${item.lossRate}%`: ''}}</div>-->
                    <!--<div>{{item.planBuyQuantity}}</div>-->
                    <!--<div>{{item.waitDeliveryQuantity}}</div>-->
                    <!--</div>-->
                    <!--<div v-else style="height:32px;line-height:32px;padding-left:12px;">-->
                    <!--计划外采购（无采购需求）-->
                    <!--</div>-->
                    <!--</template>-->
                    <!--</el-table-column>-->

                    <!--<el-table-column prop="unit" label="单位" v-if="configArr.includes('单位')" align="center">-->
                        <!--<template slot-scope="scope">-->
                            <!--{{scope.row.stockUnitName?scope.row.stockUnitName:scope.row.unit}}-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column label="商品款号" v-if="configArr.includes('商品款号')&&!isSampleMaterial" width="120" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.styleNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产单号" v-if="configArr.includes('生产单号')&&!isSampleMaterial" width="180" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.demandSourceBillNo}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;">计划外采购</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="单件用料" v-if="configArr.includes('单件用料')&&!isSampleMaterial" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.singleDosage}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="用料货品数" v-if="configArr.includes('用料货品数')&&!isSampleMaterial" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.skuQuantity}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="损耗率" v-if="configArr.includes('损耗率') &&!isSampleMaterial" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.lossRate?`${item.lossRate}`: ''}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="计划采购" v-if="configArr.includes('计划采购')&&!isSampleMaterial" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.planBuyQuantity}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="待送料" align="center">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo" class="specific-table"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <div>{{item.waitDeliveryQuantity}}</div>
                            </div>
                            <div v-else style="height:32px;line-height:32px;padding-left:12px;"></div>
                        </template>
                    </el-table-column> -->

                    <el-table-column label="主动占用" v-if="!isSampleMaterial"
                                     align="center"
                                     width="100"
                                     class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div v-if="item.materialsSkuId && item.demandSourceBillNo"
                                 @click="occupyShow=true;tableItem=item;occupyNum=item.stockActivePreuse" class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.stockActivePreuse}}
                            </div>
                            <div v-else></div>
                        </template>
                    </el-table-column >

                    <el-table-column label="可用库存"
                                     align="center"
                                     width="100"
                                     class-name="no-padding blue-bg">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.availableStock}}
                            </div>
                        </template>
                    </el-table-column >
                    <el-table-column label="本单总占用" v-if="!isSampleMaterial"
                                     align="center"
                                     width="100">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.selfPreuseTotal}}
                            </div>
                        </template>
                    </el-table-column >
                    <el-table-column prop="unArrivedPurchaseQuantity" label="采购未到" width="90" align="center">
                        <template slot-scope="scope">
                            <div v-if="scope.row.materialsSkus" class="center-block"
                                 v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.unArrivedPurchaseQuantity?item.unArrivedPurchaseQuantity:'-'}}
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="总库存" width="90" align="center">
                        <template slot-scope="scope">
                            <div class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.stock?item.stock:0}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="总待采购" v-if="!isSampleMaterial" width="90" align="center" class-name="no-padding">
                        <template slot-scope="scope">
                            <div class="center-block" :class="{'red':waitPurchaseSum(scope.row)>0}">
                                {{waitPurchaseSum(scope.row)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!isSampleMaterial" prop="waitPurchaseQuantity" label="待采购" width="90" align="center">
                        <template slot-scope="scope">
                            <div class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index"
                                 :class="{'red':item.waitPurchaseQuantity>0}">
                                {{item.waitPurchaseQuantity?item.waitPurchaseQuantity:'-'}}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="!isSampleMaterial" prop="waitPurchaseQuantity" label="手动标完成" width="120" align="center">
                        <template slot-scope="scope">
                            <div class="materiel-header center-block" v-for="(item,index) in scope.row.materialsSkus"
                                 :key="index">
                                <el-checkbox v-model="item.manualComplete"></el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity"  :render-header="renderHeaderCheck" label="直接到料" width="120"
                                     align="center">
                        <template slot-scope="scope">
                            <div class="materiel-header center-block" v-for="(item,index) in scope.row.materialsSkus"
                                 :key="index">
                                <el-checkbox v-model="item.directArrive"></el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="!isSampleMaterial" prop="waitPurchaseQuantity" label="合计采购" width="90" align="center">
                        <template slot-scope="scope">
                            <div class="center-block">
                                {{totalPurchase(scope.row)}}
                            </div>
                        </template>
                    </el-table-column>
                    <!--<el-table-column prop="waitPurchaseQuantity" label="金额小计" width="90" align="center">-->
                        <!--<template slot-scope="scope">-->
                            <!--<div class="this">-->
                                <!--<span>￥</span>-->
                                <!--<el-input @input="sumChange(scope.row)" :style="{'height':scope.row.materialsSkus&&scope.row.materialsSkus.length>=1?32 * scope.row.materialsSkus.length+ 'px !important':'',-->
                                    <!--'line-height':scope.row.materialsSkus&&scope.row.materialsSkus.length>=1?32 * scope.row.materialsSkus.length+ 'px !important':''}"-->
                                          <!--type="number"    placeholder="请输入" v-model="scope.row.sum"></el-input>-->
                            <!--</div>-->
                        <!--</template>-->
                    <!--</el-table-column>-->

                    <el-table-column prop="waitPurchaseQuantity" label="金额小计" width="90" align="center" class-name="no-padding">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{item.sum}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" fixed="right" label="采购单价" width="140" align="center" class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <!--数值+元/采购单位-->
                                <!--<span>￥</span>-->
                                <el-input style="width: 60px;" @input="priceUnitChange(item)"
                                          placeholder="请输入"  type="number" v-model="item.priceUnit"></el-input>
                                <span style="width:50px;">元/{{scope.row.purchaseUnit||scope.row.purchaseUnitName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" fixed="right" label="采购数【采购单位】" width="120" align="center" class-name=" no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <!--数值+采购单位-->
                                <el-input @input="priceUnitChange(item)" @blur="checkInput" v-model="item.quantity"
                                          placeholder="请输入"  type="number" ></el-input>
                                <span style="width:30px;">{{scope.row.purchaseUnit||scope.row.purchaseUnitName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="waitPurchaseQuantity" fixed="right" label="采购转化率" width="120" align="center" class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <el-input @input="handleConversionRate(item)" :disabled="((scope.row.stockUnitName||scope.row.unit)===(scope.row.purchaseUnit||scope.row.purchaseUnitName))||((scope.row.stockUnitName||scope.row.unit)=='米'&&(scope.row.purchaseUnit||scope.row.purchaseUnitName)=='码')" placeholder="请输入" v-model="item.conversionRate" type="number" ></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  prop="waitPurchaseQuantity" fixed="right" label="本次采购【库存单位】" width="130" align="center" class-name="no-padding yellow-bg">
                        <template slot-scope="scope">
                            <div  class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                {{((item.quantity||0) * (item.conversionRate||0)).toFixed(2)}} {{scope.row.stockUnitName||scope.row.unit}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="90" align="center" fixed="right">
                        <template slot-scope="scope">
                            <div class="center-block" v-for="(item,index) in scope.row.materialsSkus" :key="index">
                                <!--<span style="cursor: pointer" @click="delSkuGo(item, scope.$index, index)">删除</span>-->
                                <span style="cursor: pointer" @click="delSkuGo(scope.row,item,index)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="table-search-btns">
                <el-button v-if="!isSampleMaterial" :class="{'table-search-active':status==1}" @click="statusChange(1)">+ 添加物料(按需采购)</el-button>
                <el-button :class="{'table-search-active':status==2}" @click="statusChange(2)">+ 添加物料<span v-if="!isSampleMaterial">(计划外采购)</span></el-button>
            </div>
            <div v-show="status==1">
                <div class="table-search">
                    <el-input placeholder="输入物料款号/物料名称/供应商款号搜索添加" @input="searchSkuIn" v-model="searchMoreIn"></el-input>
                </div>
                <div class="add-table">
                    <!-- 负责将勾选的数据传回来，然后当供应商切换的时候更新选择的数据 -->
                    <!--ref="select-table"-->
                    <new-select-table
                            ref="selectInTable"
                            @selectedData="selectData"
                            :table="selectedTable"
                            :configArr="configArr"
                            :demandSourceBillNo="demandSourceBillNo"
                            :delSelRowFacId="delSelRowId.demandSourceBillId"
                            :delSelRowSkuId="delSelRowId.materialsSkuId">
                    </new-select-table>
                </div>
            </div>
            <div v-show="status==2">
                <div class="table-search">
                    <el-input placeholder="输入物料款号/物料名称/供应商款号搜索添加" @input="searchSku" v-model="searchMore"></el-input>
                    <span class="table-search-span" @click="newMaterial">+ 新建物料</span>
                </div>
                <div class="search-table">
                    <new-search-table
                            :isSampleMaterial="isSampleMaterial"
                            ref="searchTable"
                            @searchData="searchData"
                            :input="searchMore"
                            :configArr="configArr"
                            :searchTable="searchTable">
                    </new-search-table>
                </div>
            </div>
            <!--财务收支-->
            <div class="materialListFinancial" v-if="addtype">
                <material-list-financial @financial="financialChange" ref="materialList" :title="'应付金额'" :money="money"
                                         :supplierName="supplierName"
                ></material-list-financial>
            </div>
        </div>
        <!-- 新建物料测窗 -->
        <!-- 遮罩层 -->
        <transition name="opcity">
            <div class="div_top" @click='isShow1' v-if='isshow'>
            </div>
        </transition>
        <!-- 左侧的测弹窗 -->
        <transition name="right-move">
            <div class="div_bottom_content" v-if='isshow'>
                <add-material
                        title="新建物料"
                        @cancel-return='cancel'
                        @updateBoMTable='getDatalist'
                ></add-material>
            </div>
        </transition>

        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <occupyDialog @success="successCb" v-model="occupyNum" :visible.sync="occupyShow" :tableItem="tableItem"></occupyDialog>

    </div>
</template>

<script>
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件
    const fun = require('../../../Common/commonFun.js')
    const stringify = require('json-stringify-safe');
    import newFilter from './new-purchase-filter'
    import newSelectTable from './new-select-table'
    import newSearchTable from './new-search-table'
    import materialListFinancial from '@/components/material/materialList/materialList-financial.vue'
    import {supplierList,storeList} from '@/api';
    import {
        updateMaterielPurchase,
        MPRFieldConfigList,
        materielSelectAdd,
        materielSku,
        newMaterielPurchase,
        getFinanceConfigByUserId,
        purchaseDetail
    } from '../../../../api/material.js'
    import occupyDialog from '../../materielPurchase/need-purchase/occupyDialog'

    export default {
        props: ['source', 'detailPurchasedata'],
        data() {
            return {
                tableItem: {},
                occupyShow: false,
                occupyNum: '',
                billId: this.$route.query.billId||'',
                status: 0,
                isshow: false,
                btnLoading: false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                form: {},
                supplierName: '',
                selectedTable: [], //到料单列表
                selected: [], //本次采购已选中的
                specific: ['商品款号', '生产单号', '单件用料', '用料货品数', '损耗率', '计划采购', '待送料'],
                searchMore: '',
                searchMoreIn: '',
                checked: false,
                searchTable: [], //计划外采购列表
                arr: [],
                materialsSkus: [],
                money: 0,
                inputMaxL: 12,
                arriveSelection: [], //到料单列表选中的
                searchSelection: [], //计划外采购选中的
                delSelRowId: {
                    materialsSkuId: '',
                    demandSourceBillId: '',
                },
                store:[],//到料仓库列表
                addtype: false,
                supplierList: [],
                financialData: {},
                urlSupplier: [],//从url获取的供应商信息
                supplierChangeTime: 1, //判断是编辑第一次供应商改变
                configArr: [],       //配置表头数组
                selectedCopy: [],
                inputSearch:false,
                materialPurchaseDemandId: [] //详情带过来的本次采购
            }
        },
        components: {
            newFilter,
            newSelectTable,
            newSearchTable,
            materialListFinancial,
            addMaterial,
            occupyDialog
        },
        filters: {},
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            isSampleMaterial() {
                return this.$route.path === '/newSamplePurchase'|| this.$route.path === '/detailSamplePurchase'
            }
        },
        watch: {
            selected: {
                handler(val) {
                    this.money = 0;
                    val.forEach(el => {
                        if (el.sum == undefined) {
                            el.sum = 0;
                        }
                        this.money += Number(el.sum);
                    })
                },
                deep: true
            },
            arriveSelection: function (val) {
                console.log(val);
            }
        },
        methods: {
            async successCb(id) {
                this.inputSearch = true;
                console.log(this.materialPurchaseDemandId,id,'上面');
                if(this.materialPurchaseDemandId.some(v => v === id)) {
                    // 主动占用设置的属于原本默认选择上的(即详情里带过来)
                    let row
                    await purchaseDetail({billMaterialPurchaseId: this.$route.query.id}).then(res => {
                        res.data.data.purchase.purchases.forEach(v => {
                            //在详情接口内找到被修改主动占用的物料
                            v.materialsSkus.forEach(_v => {
                                if(_v.materialPurchaseDemandId===id){
                                    row = _v
                                }
                            })
                        })
                        this.selected.forEach(s => {
                            //在已选中物料内找到被修改主动占用的物料
                            s.materialsSkus.forEach((_s,i) => {
                                if(_s.materialPurchaseDemandId===id) {
                                    this.$set(s.materialsSkus,i,row)
                                }
                            })
                        })
                    })
                }
                //设置主动占用的物料不属于从详情带过去的也要更新数据
                    await this.materielSelectAdd(this.form.supplier);
                    this.selected.forEach(v => {
                        v.materialsSkus.forEach((_v,i) => {
                            this.arriveSelection.forEach(s => {
                                if(s.materialPurchaseDemandId === _v.materialPurchaseDemandId) {
                                    this.$set(v.materialsSkus,i,s)
                                }
                            })
                        })
                    })
                    console.log(this.selected,this.arriveSelection,'下面');
            },
            totalPurchase(row) {
                return row.materialsSkus.reduce((total,v) => {
                    return (total + ((v.quantity||0) * (v.conversionRate||0)).toFixed(2)*1).toFixed(2)*1
                },0)
            },
            waitPurchaseSum(row) {
                return row.materialsSkus.reduce((total,v) => {
                    return total + (v.waitPurchaseQuantity||0)
                },0)
            },
            handleConversionRate(item) {
                const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/;
                if(!reg.test(item.conversionRate)) {
                    this.$message.error('转化率不能超过4位小数')
                    this.$set(item,'conversionRate','')
                }
            },
            storeList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                storeList(params).then(res => {
                    if (res.data.code == 0) {
                        this.store = res.data.storehouses || [];
                    }

                });
            },
            cancelAdd(){
                if(this.source){
                    this.$emit('editAgainCancel')
                }else {
                    this.$store.dispatch('deleteVisitedView', this.$route);
                    this.$router.go(-1)
                }
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
            //从url获取供应商对象
            urlGetSupplier() {
                const urlVal = this.$route.query;
                if (urlVal.supplierId) {
                    const supMes = {};
                    supMes.id = urlVal.supplierId;
                    if (urlVal.supplierName) {
                        supMes.name = urlVal.supplierName;
                    } else {
                        supMes.name = '';
                    }
                    this.urlSupplier.push(supMes);
                }
            },
            // 图片预览
            imgList(row) {
                if (row.commonMaterialsPictureList && row.commonMaterialsPictureList.length > 0) {
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

            statusChange(status) {
                this.status = status


            },
            // 监听本次采购值的变化
            quan(item, index, row) {
                // 备份一个输入的值带过去selectedTable 再带回来
                this.selectedTable.forEach((selTableItem, bigIndex) => {
                    selTableItem.materialsSkus.forEach(itemMat => {
                        if (itemMat.demandSourceBillId === item.demandSourceBillId && itemMat.materialsId === item.materialsId) {
                            itemMat.quantityRecord = item.quantity;
                        }
                    })

                })
            },
            sumChange(val) {
                if (this.sum(val.materialsSkus) !== 0) {
                    let priceUnit = val.sum / this.sum(val.materialsSkus)
                    // val.priceUnit = val.sum / this.sum(val.materialsSkus);
                    // val.priceUnit = val.priceUnit.toFixed(2);
                    console.log(val.priceUnit);
                    this.$set(val,'priceUnit',priceUnit.toFixed(2))
                }
            },
            priceUnitChange(item) {
                this.$set(item,'sum',((item.quantity||0) * (item.priceUnit||0)).toFixed(2));
            },
            async quantityChange(val, row) {
                // 不能让用户输入超过两位小数 本次采购
                this.inputMaxL = /^\d+\.?\d{0,1}$/.test(val.quantity) ? null : val.quantity.length - 1
                this.sum(row.materialsSkus);
                row.sum =row.priceUnit? (this.sum(row.materialsSkus) * row.priceUnit).toFixed(2):0;
                // row.numMount = await this.sum(row.materialsSkus);
                await this.sumChange(val)
            },
            sum(val) {
                var sum = 0;
                if (val) {
                    console.log(val);
                    for (let item of val) {
                        if (item.quantity == null || item.quantity == undefined) {
                            item.quantity = 0;
                        }
                        sum += Number(item.quantity);
                    }
                }

                if (isNaN(sum)) {
                    return 0;
                } else {
                    return sum.toFixed(2);
                }
            },
            //验证
            judge() {
                if (!this.form.supplier) {
                    this.$message.error('请选择供应商');
                    return;
                }
                if (!this.form.purchasePersion) {
                    this.$message.error('请选择采购员');
                    return;
                }

                this.materialsSkus = [];
                for (let item of this.selected) {
                    for (let items of item.materialsSkus) {
                        let obj = {};
                        if (items.hasOwnProperty('materialsSkuId')) {
                            obj.type = 0;
                            obj.materialsSkuId = items.materialsSkuId;
                        } else {
                            obj.type = 1;
                            obj.materialsSkuId = items.commonMaterialsSkuId;
                        }
                        if (items.hasOwnProperty('demandSourceBillId')) {
                            obj.demandSourceBillId = items.demandSourceBillId;
                        } else {
                            obj.demandSourceBillId = '';
                        }
                        obj.directArrive = items.directArrive ? items.directArrive : false;
                        obj.manualComplete = items.manualComplete ? items.manualComplete : false;
                        // if (items.hasOwnProperty('directArrive')) {
                        //     obj.directArrive = true;
                        // } else {
                        //     obj.directArrive = false;
                        // }
                        // if (items.hasOwnProperty('manualComplete')) {
                        //     obj.manualComplete = true;
                        // } else {
                        //     obj.manualComplete = false;
                        // }
                        obj.quantity = items.quantity;
                        obj.conversionRate = items.conversionRate;
                        obj.stockUnitName = item.stockUnitName||item.unit;
                        obj.purchaseUnitName = item.purchaseUnit||item.purchaseUnitName;
                        obj.priceUnit = items.priceUnit;
                        this.materialsSkus.push(obj);
                    }
                }

                //当勾选本次到料时 到料仓库才是必选
                if (!this.form.storeId&&!this.isSampleMaterial) {
                    for (let i = 0; i < this.materialsSkus.length; i++) {
                        if (this.materialsSkus[i].directArrive) {
                            this.$message.error('请选择到料仓库');
                            return
                        }
                    }

                }

                return true;
            },
            judgeSku() {
                if (this.materialsSkus.length == 0) {
                    this.$message.error('请选择采购单');
                    return;
                }
                for (let item of this.selected) {
                    for (let i of item.materialsSkus) {
                        if (!i.priceUnit||i.priceUnit<0) {
                            this.$message.error('采购单中有单价未填写或单价小于等于0');
                            return;
                        }
                        if (!i.conversionRate||i.conversionRate<0) {
                            this.$message.error('采购单中采购转化率需填写且大于0');
                            return;
                        }
                    }
                }
                return true;
            },
            //新建物料采购
            async newMaterielPurchase() {
                this.btnLoading = true
                if (await !this.judge()) {
                    this.btnLoading = false
                    return;
                } else {
                    if (await !this.judgeSku()) {
                        this.btnLoading = false
                        return;
                    } else {
                        let params = {
                            unitId: this.unitId,
                            userId: this.userId,
                            orderNo: this.form.goodsNo || '',
                            expectDateEnd: this.form.planGoodsDate ? fun.dateFormatter(this.form.planGoodsDate, false) : '',
                            datePurchase: this.form.goodsDate ? fun.dateFormatter(this.form.goodsDate, false) : '',
                            arriveStorehouseId: this.form.storeId,
                            purchaserId: this.form.purchasePersion,
                            amountPay: this.form.payMoney,
                            remark: this.form.remark,
                            supplierId: this.form.supplier,
                            materialsSkus: this.materialsSkus,
                            designStyleNo:this.form.designStyleNo,
                            belongModule:this.isSampleMaterial?1:0,
                            // 财务收支字段
                            payOrReceiveAmount: this.money, //应付金额
                            journalAccountAmount: this.financialData.journalAccountAmount, //收支金额
                            journalAccountCode: this.financialData.journalAccountCode, //流水号
                            remitMethodId: this.financialData.remitMethodId, //账户id
                            remitMethodName: this.financialData.remitMethodName, //账户名
                            journalAccountDateCreated: this.financialData.dateCreatedBegin ? fun.dateFormatter(this.financialData.dateCreatedBegin, true) : '', //流水时间
                            salesmanName: this.financialData.salesmanName, //业务员名称
                            salesmanId: this.financialData.salesmanId, //业务员id

                        }
                        //重编辑
                        if (this.source) {
                            params.purchaseId = this.$route.query.id;
                            updateMaterielPurchase(params).then(res => {
                                this.btnLoading = false;
                                this.$emit('editAgainSucc', res.data.data, this.form.supplier, this.supplierName)
                            })
                        } else {
                            newMaterielPurchase(params).then(res => {
                                this.btnLoading = false
                                if (res.data.code == 0) {
                                    this.$store.dispatch('deleteVisitedView', this.$route);
                                    this.$store.dispatch('deleteVisitedLive', 'purchaseList');
                                    this.$router.go(-1)
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                        }

                    }
                }
                ;
            },
            //搜索计划外（样料中心）
            searchSku() {
                //搜索不触发选择变化
                this.inputSearch = true;
                if (!this.form.supplier) {
                    this.$message.error('请先选择供应商')
                    return
                }
                let params = {
                    keyWord: this.searchMore,
                    userId: this.userId,
                    supplierId: this.form.supplier,
                    sampleMaterial:this.isSampleMaterial?true:false
                };
                materielSku(params).then(res => {
                    if (res.data.commonMaterialsSkuList) {
                        res.data.commonMaterialsSkuList = res.data.commonMaterialsSkuList.map(item => {
                            const obj = {
                                ...item,
                                demandSourceBillId: '',
                                kindName: item.kindsName,
                                unit: item.stockUnitName,
                                materialsSkuId: item.id,
                                styleNo: '无采购需求'

                            }
                            obj.materialsSkus = [JSON.parse(JSON.stringify(obj))];
                            return obj;
                        });
                        this.searchTable = res.data.commonMaterialsSkuList;
                        console.log(this.searchTable);
                        this.selected.forEach(($item, indexItem) => {
                            $item.materialsSkus.forEach((sku, skuIndex) => {
                                // 计划外采购
                                if (!sku.demandSourceBillId) {
                                    this.$nextTick(() => {
                                        this.searchTable.forEach((_v, _index) => {
                                            if (_v.materialsSkuId == sku.materialsSkuId) {
                                                // 自动勾选
                                                this.$refs['searchTable'].$refs['multipleTable'].toggleRowSelection(this.searchTable[_index], true)
                                            }
                                        })
                                    })
                                }
                            })

                        });
                    }

                })
            },

            checkMateriel(val) {
                for (let item of this.selected) {
                    for (let items of item.materialsSkus) {
                        if (val.srcElement.checked) {
                            this.$set(items, 'directArrive', true);
                        } else {
                            items.directArrive = false;
                        }
                    }
                }
            },
            getFormData(val) {
                this.form = val;
            },
            //监听到供应商变化时调用
            supplierChange(val, supplierName) {
                this.form.supplier = val;
                this.supplierName = supplierName;
                this.materielSelectAdd(val);
                //详情重编辑不初始化
                if (!this.source || this.supplierChangeTime !== 1) {
                    this.selected = [];
                    this.searchSelection = [];
                    this.arriveSelection = [];
                    this.searchTable = [];
                    this.searchMore = ''
                }
                this.supplierChangeTime = 2

            },
            async materielSelectAdd(val = this.form.supplier) {
                let params = {
                    supplierId: val,
                    unitId: this.unitId,
                    queryColumn: this.searchMoreIn,
                    billId: this.billId
                }
                await materielSelectAdd(params).then(res => {
                    this.billId = '';
                    res.data.data = res.data.data.map(item => {
                        item.materialsSkus = [JSON.parse(JSON.stringify(item))];
                        return item;
                    });
                    this.selectedTable = res.data.data;
                    console.log(this.arriveSelection);
                    console.log(this.selected,this.selectedTable,'=====');
                    this.arriveSelection = []
                    this.selected.forEach(($item, indexItem) => {
                        $item.materialsSkus.forEach((sku, skuIndex) => {
                            if (sku.demandSourceBillId) {
                                // 计划内采购
                                console.log(this.selectedTable,'this.selectedTablethis.selectedTable');
                                console.log(sku);
                                this.$nextTick(() => {
                                    this.selectedTable.forEach((_v, _index) => {
                                        if (_v.demandSourceBillId == sku.demandSourceBillId && _v.materialsSkuId == sku.materialsSkuId) {
                                            // 自动勾选
                                            this.arriveSelection.push(this.selectedTable[_index])
                                            this.$refs['selectInTable'].$refs['multipleTable'].toggleRowSelection(this.selectedTable[_index], true)
                                        }
                                    })
                                })
                                // }
                            }
                        })

                    });
                })
            },
            //搜索按需采购
            searchSkuIn() {
                if (!this.form.supplier) {
                    this.$message.error('请先选择供应商')
                    return
                }
                //搜索不触发选择变化
                this.inputSearch = true;
                this.materielSelectAdd(this.form.supplier);
            },
            //计划外和计划内采购选择方法封装

            //判断相同的然后添加一个新的数组来存放
            selectData(sec, row) {
                //详情重编辑不初始化
                // let newArriveSelection = [...this.arriveSelection]

                // this.purchasrSelGo(sec, row,this.arriveSelection,1)
                //搜索不触发选择变化
                if(this.inputSearch){
                    this.inputSearch = false
                    return
                } ;
                if (!this.source || this.status === 1) {
                    if (this.arriveSelection.length > 0) {
                        if (row) {
                            //判断是选择还是取消选择
                            let index = sec.findIndex(item => item == row)
                            console.log(index);
                            if (index === -1) {
                                //取消选择
                                this.arriveSelection.forEach((item, arriveSelectionIndex) => {
                                    item.materialsSkus.forEach($item => {
                                        let rowIndex = row.materialsSkus.findIndex(item => item.materialsSkuId === $item.materialsSkuId && item.demandSourceBillId === $item.demandSourceBillId)
                                        if (rowIndex > -1) {
                                            if(item.materialsSkus.length>1){
                                                item.materialsSkus.splice(rowIndex, 1)
                                            }else {
                                                this.arriveSelection.splice(arriveSelectionIndex, 1)
                                            }
                                        }
                                    })
                                })
                            } else {
                                // 选择勾上

                                this.arriveSelection.forEach(($item, $index) => {
                                    $item.materialsSkus.forEach(($itemSku, skuIndex) => {
                                        let flag = true
                                        for (let j = 0; j < row.materialsSkus.length; j++) {
                                            if (row.materialsSkus[j].materialsSkuId === $itemSku.materialsSkuId && row.materialsSkus[j].demandSourceBillId === $itemSku.demandSourceBillId) {
                                                flag = false
                                            }
                                        }
                                        if (flag) {
                                            console.log(row);
                                            let indexNew = this.arriveSelection.findIndex(item => item == row);
                                            if (indexNew === -1) {
                                                this.arriveSelection.push(row)

                                            }
                                        }
                                    })

                                });
                            }
                        }


                    } else {
                        this.arriveSelection = sec;

                    }
                    this.getSelectList(1);
                }


            },
            searchData(sec, row) {
                console.log(this.searchSelection);
                // this.purchasrSelGo(sec, row,this.searchSelection,2)
                //搜索不触发选择变化
                // if(this.inputSearch){
                //     this.inputSearch = false
                //     return
                // } ;
                if (!this.source || this.status === 2) {
                    if (this.searchSelection.length > 0) {
                        if (row) {
                            //判断是选择还是取消选择
                            let index = sec.findIndex(item => item == row)
                            console.log(index);
                            if (index === -1) {
                                //取消选择
                                this.searchSelection.forEach((item, arriveSelectionIndex) => {
                                    item.materialsSkus.forEach($item => {
                                        let rowIndex = row.materialsSkus.findIndex(item => item.materialsSkuId === $item.materialsSkuId && item.demandSourceBillId === $item.demandSourceBillId)
                                        if (rowIndex > -1) {
                                            if(item.materialsSkus.length>1){
                                                item.materialsSkus.splice(rowIndex, 1)
                                            }else {
                                                this.searchSelection.splice(arriveSelectionIndex, 1)
                                            }
                                        }
                                    })
                                })
                            } else {
                                // 选择勾上
                                this.searchSelection.forEach(($item, $index) => {
                                    $item.materialsSkus.forEach(($itemSku, skuIndex) => {
                                        let flag = true
                                        for (let j = 0; j < row.materialsSkus.length; j++) {
                                            if (row.materialsSkus[j].materialsSkuId === $itemSku.materialsSkuId && row.materialsSkus[j].demandSourceBillId === $itemSku.demandSourceBillId) {
                                                flag = false
                                            }
                                        }
                                        if (flag) {
                                            console.log(row);
                                            let indexNew = this.searchSelection.findIndex(item => item == row);
                                            if (indexNew === -1) {
                                                this.searchSelection.push(row)

                                            }
                                        }
                                    })

                                });
                            }
                        }
                    } else {
                        this.searchSelection = sec;

                    }
                    console.log(this.searchSelection);
                    this.getSelectList(2);
                }

            },
            uniqueArriveList(list = []) {
                if (!list.length) return [];
                const arr = [];
                list = JSON.parse(JSON.stringify(list));
                list.forEach((item, $index) => {
                    const fItem = arr.find(arrItem => arrItem.materialsSkuId === item.materialsSkuId);
                    if (fItem) {
                        const uniqueKey = `${item.materialsSkuId}-${item.demandSourceBillNo}`; // 物料id + 工单号 = 唯一
                        const bol = fItem.materialsSkus.some(skuItem => {
                            return uniqueKey === `${skuItem.materialsSkuId}-${skuItem.demandSourceBillNo}`;
                        });
                        // 判断有相同物料是否有materialsSkus
                        if (item.quantityRecord) {
                            item.quantity = item.quantityRecord

                        } else {
                            if (item.materialsSkus) {
                                item.materialsSkus.forEach(skuItem => {
                                    if (skuItem.quantityRecord) {
                                        item.quantity = skuItem.quantityRecord

                                    } else {
                                        item.quantity = Number(((skuItem.waitPurchaseQuantity||0) / (skuItem.conversionRate||0)).toFixed(2))
                                    }
                                })
                            } else {
                                item.quantity = Number(((item.waitPurchaseQuantity||0) / (item.conversionRate||0)).toFixed(2))
                            }

                        }

                        !bol && fItem.materialsSkus.push(item);
                    }
                    else {
                        //  把代采购的值直接带过去给本次采购
                        item.materialsSkus.forEach((el, index) => {
                            if (el.quantityRecord) {
                                el.quantity = el.quantityRecord
                            } else {
                                el.quantity = Number(((el.waitPurchaseQuantity||0) / (el.conversionRate||0)).toFixed(2))
                            }
                        })
                        arr.push(item);
                    }
                });
                return arr;
            },
            async getSelectList(vas) {
                const uniqueArriveList = await this.uniqueArriveList(this.arriveSelection);
                for (let item of this.searchSelection) {
                    const fItem = uniqueArriveList.find(arrItem => arrItem.materialsSkuId === item.materialsSkuId);
                    if (fItem) {
                        let bol = fItem.materialsSkus.some(row => !row.demandSourceBillNo && row.materialsSkuId === fItem.materialsSkuId);
                        !bol && fItem.materialsSkus.push(item);
                    }
                    else {
                        uniqueArriveList.push(item);
                    }
                }
                // if (vas == 1) {
                //     for (let item of uniqueArriveList) {
                //
                //         item.numMount = await this.sum(item.materialsSkus);
                //     }
                // }
                for (let item of uniqueArriveList) {
                    item.materialsSkus.forEach(v => {
                        if(!v.priceUnit) {
                            v.priceUnit = v.planCost
                        }
                        v.sum = ((v.quantity||0) * (v.priceUnit||0)).toFixed(2)
                    })
                }
                this.selected = uniqueArriveList;
                this.selected.forEach((item,index)=>{
                    if(item.materialsSkus.length===0){
                        this.selected.splice(index,1)
                    }
                })
            },
            // 联动删除
            delSkuGo(row, item, index) { // index：内index
                console.log(item);
                this.delSelRowId.materialsSkuId = item.materialsSkuId
                this.delSelRowId.demandSourceBillId = item.demandSourceBillId
                this.selected.forEach(($item, indexItem) => {
                    $item.materialsSkus.forEach((sku, skuIndex) => {
                        console.log(sku);

                        if (item.demandSourceBillId) {
                            // 计划内采购
                            //删除选中的物料单  唯一是demandSourceBillId+materialsSkuId
                            if (sku.demandSourceBillId === item.demandSourceBillId &&sku.materialsSkuId === item.materialsSkuId) {
                                if (row.materialsSkus.length === 1) {
                                    this.selected.splice(indexItem, 1)
                                    this.arriveSelection.splice(indexItem, 1)
                                } else if (row.materialsSkus.length > 1) {
                                    this.selected[indexItem].materialsSkus.splice(skuIndex, 1)
                                    this.arriveSelection[indexItem].materialsSkus.splice(skuIndex, 1)
                                }
                                this.selectedTable.forEach((_v, _index) => {
                                    if (_v.demandSourceBillId == item.demandSourceBillId && _v.materialsSkuId == item.materialsSkuId) {
                                        //唯一性去除勾选
                                        this.$refs['selectInTable'].$refs['multipleTable'].toggleRowSelection(this.selectedTable[_index], false)

                                    }
                                })
                            }
                        }
                        if (!item.demandSourceBillId) {
                            // 计划外采购
                            if (sku.materialsSkuId === item.materialsSkuId) {
                                if (row.materialsSkus.length === 1) {
                                    this.selected.splice(indexItem, 1)
                                    this.searchSelection.splice(indexItem, 1)
                                } else if (row.materialsSkus.length > 1) {
                                    this.selected[indexItem].materialsSkus.splice(index, 1)
                                    this.searchSelection[indexItem].materialsSkus.splice(index, 1)
                                }
                                this.searchTable.forEach((_v, _index) => {
                                    if (_v.materialsSkuId == item.materialsSkuId) {
                                        this.$refs['searchTable'].$refs['multipleTable'].toggleRowSelection(this.searchTable[_index], false)
                                    }
                                })
                            }
                        }
                    })

                });
            },

            // 请求供应商下拉数据
            fetchSupplierList() {
                const params = {
                    factoryId: this.facId
                }
                supplierList(params).then(res => {
                    this.supplierList = res.data.data;
                    // this.formData.supplierId =
                })
            },
            financialChange(financialData) {
                this.financialData = financialData
            },
            getFinanceConfigByUserId() {
                let params = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                }
                getFinanceConfigByUserId(params).then(res => {
                    if (res.data.code == 0) {
                        res.data.data.forEach((v, i) => {
                            if (v == 'PURCHASE_ORDER') {
                                this.addtype = true
                                if (this.addtype) {
                                    this.fetchSupplierList()
                                }
                            }
                        })
                    }
                })
            },
            //新建物料
            isclick() {
                this.isShow = true;
            },
            // 点击遮罩层左侧关闭
            isShow1() {
                this.isshow = false;
            },
            // 取消侧窗遮罩
            cancel(judge) {
                this.isshow = judge;
            },
            getDatalist(val) {
                // this.form.supplier = val;
                this.materielSelectAdd(this.form.supplier);
            },
            // 新建物料显示
            newMaterial() {
                document.querySelector("#app").click()
                this.isshow = true;
            },
            renderHeader(createElement, { column, $index }) {
                return <div class="table-header">{this.specific.map(item =>{return <div >{item}</div>})}</div>;
                    },
                    renderHeaderCheck(createElement, { column, $index }) {
                    return <div class="materiel-header">{<el-checkbox onChange={this.checkMateriel} vModel="checked">直接到料</el-checkbox>}</div>;
                },
                },
                created() {
                    this.urlGetSupplier();
                    // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
                    this.getConfigArr('PURCHASE');
                    //如果供应商有值调用
                    this.getFinanceConfigByUserId();
                    this.$route.query.supplierId ? this.form.supplier = this.$route.query.supplierId : '';
                    this.demandSourceBillNo = this.$route.query.facMissionNo;
                    // if (this.form.supplier) {
                    //     this.materielSelectAdd();
                    // }
                },
                mounted() {

                    if (this.detailPurchasedata) {
                        var form = this.$refs.detailPurchase.form
                        console.log(this.detailPurchasedata.creatorId);
                        form.supplier = this.detailPurchasedata.supplierId;  //供应商
                        form.remark = this.detailPurchasedata.remark;
                        form.purchasePersion = this.detailPurchasedata.creatorId;  //采购员
                        form.goodsNo = this.detailPurchasedata.orderNo;     //采购单号
                        form.goodsDate = this.detailPurchasedata.datePurchase;    //采购日期
                        form.planGoodsDate = this.detailPurchasedata.expectDateEnd;       //预计货期
                        // 修改字段
                        this.detailPurchasedata.purchase.purchases.forEach(item => {
                            item.sum = item.purchasePrice;
                            // item.numMount = this.sum(item.materialsSkus);
                            item.materialsSkus.forEach(v => {
                                v.sum = ((v.quantity||0) * (v.priceUnit||0)).toFixed(2)
                            })
                        })
                        this.materialPurchaseDemandId = []
                        this.selected = this.detailPurchasedata.purchase.purchases;        //物料勾选
                        console.log(this.selected,'selectedselected');
                        this.selected.forEach(v => {
                            v.materialsSkus.forEach(_v => {
                                this.materialPurchaseDemandId.push(_v.materialPurchaseDemandId)
                            })
                        })
                        sessionStorage.setItem('purchasesEdit', JSON.stringify(this.detailPurchasedata.purchase.purchases))
                        let selectedKindsIn = JSON.parse(sessionStorage.getItem('purchasesEdit'));        //物料勾选计划内
                        let selectedKindsOut = JSON.parse(sessionStorage.getItem('purchasesEdit'));
                        ;        //物料勾选计划外

                        // 计划内物料默认值筛选
                        selectedKindsIn.forEach((itemIn, index) => {
                            let newSkusIn = [...itemIn.materialsSkus]
                            itemIn.materialsSkus = []
                            newSkusIn.filter($itemIn => $itemIn.type === 0).forEach(filterDataIn => {
                                itemIn.materialsSkus.push(filterDataIn)
                            })
                            if (itemIn.materialsSkus.length === 0) {
                                selectedKindsIn.splice(index, 1)
                            }

                        })
                        // 计划外物料默认值筛选
                        selectedKindsOut.forEach((item, index) => {
                            let newSkus = [...item.materialsSkus]
                            item.materialsSkus = []
                            newSkus.filter($item => $item.type === 1).forEach(filterData => {
                                item.materialsSkus.push(filterData)
                            })
                            if (item.materialsSkus.length === 0) {
                                selectedKindsOut.splice(index, 1)
                            }
                        })
                        this.arriveSelection = selectedKindsIn
                        this.searchSelection = selectedKindsOut
                        // console.log(selectedKindsIn);
                        // console.log(selectedKindsOut);
                    }
                },
            }
</script>

<style lang="scss" scoped>
    .new-conent{
        background: #fff;
        padding-bottom:12px;
    }
    .purchase-new-remove-right {
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 300px) !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
    }

    .purchase-new {
        min-height: 800px;
        width: 100%;
        .div_top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 12;
        }
        .div_bottom_content {
            position: fixed;
            top: 0;
            left: 200px;
            right: 0;
            bottom: 0;
            z-index: 12;
        }
    }

    .select-table {
        padding: 0 16px;
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
        .this {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #F5F7FA;
        }
    }

    .materialListFinancial {
        margin: 0 20px 16px;
    }

    .table-census {
        font-weight: 500;
        height: 32px;
        background-color: #f7f9fc;
        margin: 0 16px;
        border-right: 1px solid rgb(223, 228, 236);
        border-left: 1px solid rgb(223, 228, 236);
        border-top: 1px solid rgb(223, 228, 236);
        display: flex;
        align-items: center;
        padding-left: 14px;
        .last-span {
            display: inline-block;
            margin-left: 20px;
        }
    }

    .table-search-btns {
        padding-left: 16px;
        margin: 10px 0;
        button:hover {
            color: #eb8f34;
            border: 1px solid #eb8f34;
        }
        .table-search-active {
            color: #eb8f34;
            border: 1px solid #eb8f34;
            margin-right: 10px;
        }

    }

    .table-search {
        height: 32px;
        line-height: 32px;
        margin: 0 16px;
        border: 1px solid rgb(223, 228, 236);

        .table-search-span {
            float: right;
            padding:0 10px;
            background-color: #ff9c38;
            position: relative;
            top: -33px;
            right: 0px;
            cursor: pointer;
            color: #fff;
            font-size:12px;
        }
    }

    .add-table {
        padding: 20px 16px 10px;
        /*width: calc(100% - 300px)*/
    }

    .search-table {
        padding: 20px 16px;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 600;
        div {
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
            border-right: 1px solid rgb(223, 228, 236);
            height: 28px;
            &:nth-child(1) {
                width: 90px;
            }
            &:nth-child(2) {
                width: 120px;
            }
            &:nth-child(3) {
                width: 120px;
            }
            &:nth-child(4) {
                width: 100px;
            }
            &:nth-child(5) {
                width: 70px;
            }
            &:nth-child(6) {
                width: 70px;
            }
            &:nth-child(7) {
                width: 70px;
                border: none;
            }
        }
    }

    .center-block {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 32px;
        border-bottom: 1px solid rgb(223, 228, 236);
        &:last-child {
            border: none;
        }
    }

    .king {
        color: #FF7F14;
    }

    .red {
        color: red;
    }
</style>

<style lang="scss">
    @import '../../../../assets/style/el-table.scss';
    .occupy{
        .el-dialog__header{
            padding: 16px !important;
        }
    }
    .table-search .el-input__inner {
        border: none;
        height: 32px;
    }

    .this .el-input__inner {
        border: none;
        height: 32px;
        width: 100%;
        background-color: #F5F7FA;
    }

    .materiel-header {
        .el-checkbox__inner {
            height: 16px;
            width: 16px;
        }
        .el-checkbox__label {
            font-size: 12px;
            font-weight: 500;
            color: #808080;
        }
    }

    .select-table {
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

    .popperClass {
        max-width: calc(100% - 300px);
    }

    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }

</style>

