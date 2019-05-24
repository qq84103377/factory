/*
 * @Author: kuhn 
 * @Description: 新建/编辑采购单
 * @Date: 2019-05-22 10:35:41 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-24 11:31:28
 */

<template>
  <div class="new-purchase">
    <div class="scroll-content">
      <page-title class="pdlr24 pdtb16 bd-bottom" :title="isPickUpDelivery?'一键采到送':isEdit?(isSampleMaterial?'样料采购单重编辑':'采购单重编辑'):(isSampleMaterial?'样料新建采购单':'新建采购单')">
        <div>
          <nf-button fsize="12" @click="cancel">
            取消
          </nf-button>
          <nf-button
            fsize="12"
            :loading="isSubmitting"
            type="warning"
            @click="confirm">
            确定
          </nf-button>
        </div>
      </page-title>
      <div class="custom-filter-form" style="padding-right: 24px;">
        <el-form
          style="margin-left: -20px"
          :model="form"
          status-icon
          ref="form"
          label-width="100px">
          <el-row>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item :label="isPickUpDelivery?'业务员':'采购员'" required>
                <workerLeader
                  :single="'single'"
                  v-model="form.purchaserId"
                  :placeholder="'请选择或搜索采购员'"></workerLeader>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="采购日期" required>
                <el-date-picker
                  @change="datePurchaseChange"
                  format="yyyy-MM-dd"
                  v-model="form.datePurchase"
                  type="date"
                  placeholder="请选择日期"
                  :picker-options="pickerOptions0">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item v-if="!isSampleMaterial" label="预计货期">
                <el-date-picker
                  @change="expectDateEndChange"
                  format="yyyy-MM-dd"
                  v-model="form.expectDateEnd"
                  type="date"
                  placeholder="请选择日期"
                  :picker-options="pickerOptions0">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              v-if="isPickUpDelivery">
              <el-form-item label="物料仓库">
                <el-select v-model="form.storehouseId" placeholder="请选择仓库">
                  <el-option
                    v-for="item in store"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              v-if="isPickUpDelivery">
              <el-form-item label="送料工厂" required>
                <el-select
                  v-model="form.outsideFactoryId"
                  placeholder="请选择或搜索"
                  clearable
                  filterable
                  remote
                  :remote-method="getFactorys">
                  <el-option
                    key="self"
                    value="self"
                    label="本厂"></el-option>
                  <el-option
                    v-for="item in facList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6"
              v-if="!isPickUpDelivery">

              <el-form-item label="直接到料">
                <el-checkbox v-model="form.directArrive" style="position: absolute;margin-left: -82px;margin-top: -2px;"></el-checkbox>
                <el-select
                  v-model="form.storehouseId"
                  v-show="form.directArrive"
                  placeholder="请选择到料仓库"
                  clearable
                  filterable>
                  <el-option
                    v-for="item in store"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="total-area">
        <div>
          <span>本次采购：<span class="orange">{{newPurchase.materialsSkus.length}}款物料</span></span>
          <span class="mgl12">采购金额：<span class="orange">{{purchaseMoneys}}</span></span>
        </div>
        <div v-if="!isEdit">
          <el-button
            v-if="!isSampleMaterial"
            @click="showSearchMaterial(0)"
            class="orange-btn"
            size="small">+ 按需采购</el-button>
          <el-button
            @click="showSearchMaterial(1)"
            class="orange-btn"
            size="small">
            {{isSampleMaterial?'+ 添加物料':'+ 添加物料(计划外采购)'}}
          </el-button>
          <el-button
            v-if="!isSampleMaterial"
            @click="fillAllPurchases"
            class="blue-btn"
            size="small">一键填齐合计采购</el-button>
        </div>
      </div>
      <div ref="newPurchaseContent" class="main-content pdlr24">
        <el-table
          v-if="newPurchase.fieldConfigList.length>0"
          :height="tableHeight"
          :data="newPurchase.materialsSkus"
          border
          class="custom-table tiny-row no-hover-highlight"
          style="width: 100%">
          <el-table-column
            v-for="column in newPurchase.fieldConfigList"
            :key="column.code"
            :prop="column.code"
            :label="column.name"
            :render-header="()=>renderHeader(column.name)"
            :min-width="getColumnWidth(column.name)"
            :fixed="newPurchase.fixedLeft.includes(column.name)?'left':newPurchase.fixedRight.includes(column.name)?'right':undefined"
            :class-name="newPurchase.yellowBg.includes(column.name)?'yellow-bg no-padding':'no-padding'">
            <template slot-scope="scope">
              <div class="custom-cell pdlr10">
                <div v-if="column.name ==='采购单号'">
                  <el-input
                    :disabled="isEdit"
                    @change="changeOrderNo($event,scope.row)"
                    placeholder="不填自动生产"
                    :maxlength="150"
                    type="text"
                    v-model="scope.row[column.code]"></el-input>
                </div>
                <div v-else-if="column.name ==='备注信息'">
                  <el-input
                    @change="changeRemark($event,scope.row,scope.$index)"
                    type="textarea"
                    :autosize="{ minRows: 1}"
                    v-model="scope.row[column.code]"
                    :maxlength="150"
                    placeholder="请输入"></el-input>
                </div>
                <img @click="previewImg(scope.row)" v-else-if="column.name ==='图片'" v-errorLogo
                                     style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                     :src="scope.row[column.code]"/>
                <div
                  @click="showChangeSupplier(scope.$index,scope.row)"
                  v-else-if="column.name ==='供应商'"
                  style="height: 24px;width: 100%;line-height: 24px">
                  {{scope.row[column.code]}}
                </div>
                <div v-else-if="column.name ==='供应商款号/色号'">
                  {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                </div>
                <div v-else-if="column.name ==='合计待采'" class="red">
                  {{scope.row[column.code]}}
                </div>
                <div v-else-if="column.name ==='合计采购数'">
                  <el-input
                    @change="totalPurchaseQuantityChange($event,scope.row,scope.$index)"
                    style="width: 80px;"
                    placeholder="请输入"
                    type="number"
                    v-model="scope.row[column.code]"></el-input>
                  <span>{{scope.row.purchaseUnitName}}</span>
                </div>
                <div v-else-if="column.name ==='合计采购'">
                  {{scope.row[column.code]}}{{scope.row.unit}}
                </div>
                <div v-else-if="column.name ==='采购金额'">
                  <!-- <span v-if="scope.row[column.code]">¥{{scope.row[column.code]}}</span> -->
                  <span>￥</span>
                  <el-input
                    @change="handlerChangePurchaseMoney($event,scope.row,scope.$index)"
                    style="width: 80px;"
                    placeholder="请输入"
                    type="number"
                    v-model="scope.row[column.code]"></el-input>

                </div>
                <div v-else-if="column.name ==='采购单价'">
                  <el-input
                    style="width:60px;"
                    @change="changePurchaseMoney($event,scope.row,scope.$index)"
                    placeholder="请输入"
                    type="number"
                    v-model="scope.row[column.code]"></el-input>
                  <span>元/{{scope.row.purchaseUnitName}}</span>
                </div>
                <div v-else-if="column.name ==='转化率'">
                  <span class="gray" v-if="(scope.row.unit===scope.row.purchaseUnitName)||(scope.row.unit==='米'&&scope.row.purchaseUnitName=='码')">{{scope.row[column.code]}}</span>
                  <el-input
                    v-else
                    @change="conversionRateChange($event,scope.row,scope.$index)"
                    placeholder="请输入"
                    v-model="scope.row[column.code]"
                    type="number"></el-input>
                </div>
                <!--样料特有-->
                <design-style-no-select
                  style="width: 100%;"
                  @change="changeDesignStyleNoSelect($event,scope.row,scope.$index)"
                  v-else-if="column.name ==='设计款号'"
                  v-model="scope.row[column.code]"></design-style-no-select>

                <span v-else-if="column.name ==='样料'">
                                    {{scope.row[column.code]?'样料':''}}
                                </span>
                <span v-else>{{scope.row[column.code]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            class-name="no-padding"
            label="操作"
            fixed="right"
            :width="isSampleMaterial?60:120"
            align="center">
            <template slot-scope="scope">
              <div class="action-list">
                <div
                  v-if="!isSampleMaterial"
                  @click="showEditByOrder(scope.row,scope.$index)"
                  class="item blue pointer">按单编辑</div>
                <div
                  style="flex: 0.5"
                  @click="deleteMaterialsSku(scope.row,scope.$index)"
                  class="item red pointer">删除</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pdlr24 pdtb16 text-right">
        <nf-button
          @click="columnConfigVisible = true"
          class="mgl8 fl"
          fsize='12'>表头配置</nf-button>
      </div>
    </div>

    <!--表头配置-->
    <dynamic-column-config
      :visible.sync="columnConfigVisible"
      :title="isSampleMaterial?(isEdit?'编辑':'新建')+'样料采购单表头配置':(isEdit?'编辑':'新建')+'采购单表头配置'"
      :targetType="isSampleMaterial?'SAMPLE_PURCHASE_CREATE':'PURCHASE_CREATE'"
      @confirm="getFieldConfigCodeAndNameList"></dynamic-column-config>
    <!--点击按需采购、计划外添加时出现的弹窗-->
    <search-material-dialog
      :supplierId="form.supplierId"
      :visible.sync="searchMaterial.visible"
      :type="searchMaterial.type"
      :selectedList="searchMaterial.type==0?searchMaterial.demandSelectedList:searchMaterial.unplannedSelectedList"
      @confirm="confirmAddMaterial"></search-material-dialog>
    <!--按单编辑-->
    <edit-by-order-dialog
      v-if="editByOrder.visible"
      :isPickUpDelivery="isPickUpDelivery"
      :visible.sync="editByOrder.visible"
      :materialsSku="editByOrder.materialsSku"
      @confirm="editByOrderConfirm"></edit-by-order-dialog>
    <!--供应商选择组件-->
    <supplier-change
      :visible.sync="changeSupplier.visible"
      :materialRow="changeSupplier.materialRow"
      @confirm="changeSupplierInfo">
    </supplier-change>
    <!--图片预览-->
    <nf-previewer
      ref="previewer"
      value="path"
      :list="previewList"></nf-previewer>
  </div>
</template>

<script>
import {
  supplierList,
  storeList,
  getUnitUser,
  queryList,
  getPersonList,
  getFactorys
} from '@/api';
import {
  purchaseFacFieldConfigCodeAndNameList,
  updateMaterialPurchaseDemanSupplier,
  updateMaterielPurchase,
  batchNewMaterielPurchase
} from '@/api/material.js'
// import NewPurchaseFilter from './new-purchase-filter'
import DynamicColumnConfig from "../dynamicColumnConfig";
import SearchMaterialDialog from "./searchMaterialDialog";
import EditByOrderDialog from "./editByOrderDialog";
import SupplierChange from "@/components/goods/goodsBom/supplierChange.vue"; //换供应商组件
import DesignStyleNoSelect from "@/components/Common/custom-select/designStyleNoSelect.vue";
const fun = require('../../../Common/commonFun.js')

export default {
  //detailPurchasedata：采购单详情
  // isEdit：编辑还说新建
  // isPickUpDelivery:是否一键采送达
  // isSampleMaterial 是否是样料新建、编辑
  props: ['visible', 'detailPurchasedata', 'isEdit', 'isPickUpDelivery', 'isSampleMaterial', 'demandSelectedList'],
  data() {
    return {
      form: {
        directArrive: false,
        storehouseId: '',
        outsideFactoryId: '',
        datePurchase: fun.dateFormatter(new Date(), false),
        expectDateEnd: '',
        purchaserId: '',
      },
      facList: [],
      store: [],
      storeName: '',
      columnConfigVisible: false, //表头配置弹窗是否可见
      tableHeight: 300, //选中的物料表格的高度
      newPurchase: {
        materialsSkus: [],
        fieldConfigList: [], //按生产单查看动态列
        yellowBg: ['供应商', '合计采购数', '采购单价', '转化率'], //要黄色底的列
        fixedLeft: [],
        fixedRight: ['合计采购数', '采购单价', '转化率', '合计采购']
      },
      searchMaterial: {
        visible: false,
        type: 0,
        unplannedSelectedList: [], //计划外选中的物料
        demandSelectedList: [], //按需采购选中的物料
      },
      editByOrder: {
        visible: false,
        materialsSku: [], //采购需求列表
        materialsSkuIndex: ''
      },
      changeSupplier: {
        visible: false,
        materialIndex: '', //  物料sku所有，
        materialRow: {}, //当前要更换供应商单行单物料sku相关信息
      },
      // 图片预览
      previewList: [],
      isSubmitting: false,
      purchaseMoneys: 0
    }
  },
  components: {
    EditByOrderDialog,
    SearchMaterialDialog,
    // NewPurchaseFilter,
    DynamicColumnConfig,
    SupplierChange,
    DesignStyleNoSelect
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
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    },
    selectedMaterialsSkuIds() {
      return this.newPurchase.materialsSkus.map(item => item.materialsSkuId)
    }

  },
  watch: {
    // 设置合计采购金额
    'newPurchase.materialsSkus': {
      handler: function (list) {
        let purchaseMoneyInfo = {}
        this.newPurchase.fieldConfigList.forEach(item => {
          if (item.name === '采购金额') {
            purchaseMoneyInfo = item
          }
        })
        let purchaseMoneys = []
        if (purchaseMoneyInfo) {
          purchaseMoneys = list.map(item => item[purchaseMoneyInfo.code])
        }
        const purchaseMoney = purchaseMoneys.filter(item => item)
        // 设置总采购金额
        if (purchaseMoney.length > 0) {
          const money = purchaseMoney.reduce((p, v, i, a) => {
            return fun.add(Number(p), Number(v))
          })
          this.purchaseMoneys = parseFloat(Number(money).toFixed(4))
        } else {
          this.purchaseMoneys = 0
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 采购金额change事件
     * 采购金额 = 合计采购数 * 采购单价
     */
    handlerChangePurchaseMoney(e, info, index) {
      // console.log('采购金额',e,info,index)
      // 合计采购数
      let totalPurchaseNums = 0
      let totalPurchaseName = ''
      // 采购单价
      let purchasePrice = 0
      let purchaseName = ''
      this.newPurchase.fieldConfigList.forEach(item => {
        if (item.name === '合计采购数') {
          totalPurchaseNums = info[item.code]
          totalPurchaseName = item.code
        } else if (item.name === '采购单价') {
          purchasePrice = info[item.code]
          purchaseName = item.code
        }
      });
      // console.log('合计采购数',totalPurchaseName)
      if (totalPurchaseNums) {
        const countNums = parseFloat(fun.div(e, totalPurchaseNums).toFixed(4))
        // console.log('计算后采购单价',countNums)
        return this.$set(this.newPurchase.materialsSkus[index], purchaseName, countNums)
      }
      if (purchasePrice) {
        const countNums = parseFloat(fun.div(e, purchasePrice).toFixed(4))
        // console.log('计算后合计采购数',countNums)
        return this.$set(this.newPurchase.materialsSkus[index], totalPurchaseName, countNums)
      }
    },
    getColumnWidth(columnName) {
      let width = 120
      switch (columnName) {
        case '设计款号':
          width = 180;
          break;
        case '生产单号':
          width = 160;
          break;
        case '图片':
          width = 60;
          break;
        case '物料需求':
          width = 70;
          break;
        case '制单日期':
          width = 90;
          break;
        case '货期':
          width = 90;
          break;
        case '单位':
          width = 55;
          break;
        case '参考价':
          width = 90;
          break;
        case '计划采购':
          width = 70;
          break;
        case '单件用量':
          width = 70;
          break;
        case '用料货品数':
          width = 90;
          break;
        case '损耗率':
          width = 60;
          break;
        case '主动占用':
          width = 70;
          break;
        case '可用库存':
          width = 70;
          break;
        case '本单总占用':
          width = 90;
          break;
        case '已采购':
          width = 60;
          break;
        case '本单总占用':
          width = 90;
          break;
        case '采购未到':
          width = 70;
          break;
        case '已到料':
          width = 60;
          break;
        case '已退料':
          width = 60;
          break;
        case '总库存':
          width = 60;
          break;
        case '物料反算':
          width = 70;
          break;
        case '总库存':
          width = 80;
          break;
        case '合计待采':
          width = 70;
          break;
        case '采购金额':
          width = 120;
          break;
        case '采购单价':
          width = 120;
          break;
        case '合计采购数':
          width = 120;
          break;
        case '转化率':
          width = 60;
          break;
        case '合计采购':
          width = 90;
          break;
      }
      return width
    },
    // 送料工厂下拉
    getFactorys(key = "") {
      let params = {
        userId: this.userId,
        key: key
      }
      getFactorys(params).then(res => {
        this.facList = res.data.data
      })
    },
    //采购员默认选择当前登录用户
    getPurchasePersionId() {
      this.form.purchaserId = this.userId;
    },
    // 预计货期改变
    expectDateEndChange(val) {
      this.form.expectDateEnd = val ? fun.dateFormatter(val, false) : ''
    },
    // 采购日期改变
    datePurchaseChange(val) {
      this.form.datePurchase = val ? fun.dateFormatter(val, false) : ''
    },
    // 获取参考列表
    storeList() {
      let params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      };
      storeList(params).then(res => {
        if (res.data.code == 0) {
          this.store = res.data.storehouses || [];
          this.store.forEach(i => {
            if (i.defaultTag) {
              this.form.storehouseId = i.id;
              this.storeName = i.name;
            }
          })
          if (this.store.length === 1) {
            this.form.storehouseId = res.data.storehouses[0].id;
            this.storeName = res.data.storehouses[0].name;
          }
        }

      });
    },
    // 备注信息改变时
    changeRemark(val, row, index) {
      if (row.orderNo) {
        this.newPurchase.materialsSkus.forEach(item => {
          if (item.orderNo == row.orderNo && item.lineId != row.lineId) {
            item.remark = val
          }
        })
      }
    },
    // 设计款号改变时
    changeDesignStyleNoSelect(val, row, index) {
      if (row.orderNo) {
        this.newPurchase.materialsSkus.forEach(item => {
          if (item.orderNo == row.orderNo && item.lineId != row.lineId) {
            item.designStyleNo = val
          }
        })
      }
      if (row.supplierId) {
        this.newPurchase.materialsSkus.forEach(item => {
          if (item.supplierId == row.supplierId && item.lineId != row.lineId) {
            item.designStyleNo = val
          }
        })
      }
    },

    // 预览图片
    previewImg(row) {
      if (!row.commonMaterialsPictureList.length) return;
      this.previewList = row.commonMaterialsPictureList.map(item => {
        return {
          path: item
        }
      });
      this.$nextTick(() => {
        this.$refs["previewer"].show(0)
      });
    },
    // 修改采购金额
    changePurchaseMoney(val, row, index) {
      this.$set(row, 'purchaseMoney', row.priceUnit && row.totalPurchaseQuantity ? Number((row.priceUnit * row.totalPurchaseQuantity).toFixed(4)) : '')
    },
    // 显示更新供应商弹窗
    showChangeSupplier(materialIndex, materialRow) {
      // 编辑状态不能改供应商
      if (this.isEdit)
        return
      if (materialRow.quantityPurchased > 0 && status == 1) {
        this.$message.error('该物料需求已开采购单')
        return
      }
      this.changeSupplier.materialIndex = materialIndex
      this.changeSupplier.materialRow = materialRow
      this.changeSupplier.visible = true
    },
    // 更新供应商相关信息
    changeSupplierInfo(data) {
      let row = this.newPurchase.materialsSkus[this.changeSupplier.materialIndex]
      this.$set(row, 'supplierId', data.supplierId)
      this.$set(row, 'supplierName', data.supplierName)
      this.$set(row, 'supplierStyleNo', data.supplierStyleNo)
      this.$set(row, 'supplierColorNo', data.supplierColorNo)
      this.$set(row, 'planCost', data.planCost)
      this.$set(row, 'excludingTaxPrice', data.excludingTaxPrice)
      this.$set(row, 'orderNo', '')
      let tempMaterialsSkus = this.newPurchase.materialsSkus.find(item => item.supplierId === data.supplierId && item.lineId != row.lineId)
      if (tempMaterialsSkus) {
        this.$set(row, 'orderNo', tempMaterialsSkus.orderNo)
      }
    },
    // 采购单号改变时
    changeOrderNo(val, row) {
      this.newPurchase.materialsSkus.forEach(item => {
        if (row.supplierId && item.supplierId === row.supplierId && item.lineId != row.lineId) {
          item.orderNo = val
        }
      })
    },
    // 合计采购数改变时
    totalPurchaseQuantityChange(val, row, index) {
      if (val && !row.conversionRate) {
        this.$set(row, 'totalPurchaseQuantity', '')
        this.$message.error('请先填写转化率')
        return
      }
      this.computedQuantity(val, row.conversionRate, index)
      this.changePurchaseMoney(val, row, index)
    },
    // 转化率改变时
    conversionRateChange(val, row, index) {
      const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/;

      if (val && !reg.test(val)) {
        this.$message.error('转化率不能超过4位小数')
      }

      this.computedQuantity(row.totalPurchaseQuantity, val, index)
    },
    // 计算从上往下每个本次采购的值
    computedQuantity(totalPurchaseQuantity, conversionRate, index) {
      let currentMaterialsSku = this.newPurchase.materialsSkus[index]
      if (totalPurchaseQuantity && conversionRate) {
        // 合计采购=（合计采购数）*转化率
        let totalPurchase = Number(Number(totalPurchaseQuantity) * Number(conversionRate).toFixed(4))

        this.$set(this.newPurchase.materialsSkus[index], 'totalPurchase', Number(totalPurchase.toFixed(4)))
        // console.log('不知道是什么东西', totalPurchase)

        for (let i = 0; i < currentMaterialsSku.materialsSkus.length; i++) {
          let item = currentMaterialsSku.materialsSkus[i]
          if (totalPurchase > 0) {
            if (item.waitPurchaseQuantity >= totalPurchase) {
              // console.log('不知道是什么东西233', item.waitPurchaseQuantity)
              this.$set(item, 'quantity', item.waitPurchaseQuantity > totalPurchase ? totalPurchase : item.waitPurchaseQuantity)
              totalPurchase = 0
            } else {
              this.$set(item, 'quantity', item.waitPurchaseQuantity)

              totalPurchase = Number((totalPurchase - item.waitPurchaseQuantity).toFixed(4))
            }
          } else {
            this.$set(item, 'quantity', 0)
          }
          this.$set(item, 'quantityArrive', item.quantity)
          this.$set(item, 'quantityDelivery', item.quantity)
        }
        // 如果有剩余
        if (totalPurchase > 0) {
          let lastPurchaseDemand = currentMaterialsSku.materialsSkus[currentMaterialsSku.materialsSkus.length - 1]
          if (lastPurchaseDemand.type == 1) {
            this.$set(lastPurchaseDemand, 'quantity', lastPurchaseDemand.quantity ? lastPurchaseDemand.quantity + totalPurchase : totalPurchase)
            this.$set(lastPurchaseDemand, 'quantityArrive', lastPurchaseDemand.quantity)
            this.$set(lastPurchaseDemand, 'quantityDelivery', lastPurchaseDemand.quantity)
          } else {
            let lastPurchaseDemand = {
              type: 1,
              materialsSkuId: currentMaterialsSku.materialsSkuId,
              demandSourceBillId: "",
              styleNo: "", //成衣款号
              orderNo: "", //生产单号
              planBuyQuantity: 0, //计划采购
              stockActivePreuse: 0, //主动占用
              stock: "", //库存
              waitPurchaseQuantity: 0, //待采购
              quantity: totalPurchase, //本次采购
              quantityArrive: totalPurchase, //本次到料
              quantityDelivery: totalPurchase, //本次送料
            }
            currentMaterialsSku.materialsSkus.push(lastPurchaseDemand)
          }
        }
      } else {
        currentMaterialsSku.materialsSkus.forEach(item => {
          this.$set(item, 'quantity', 0)
          this.$set(item, 'quantityArrive', item.quantity)
          this.$set(item, 'quantityDelivery', item.quantity)
        })
      }
    },
    // 一键填齐合计采购
    fillAllPurchases() {
      let flag = this.newPurchase.materialsSkus.some(item => !item.conversionRate)
      if (flag) {
        this.$message.error('请填写完善转化率！')
        return
      }
      this.newPurchase.materialsSkus.forEach(item => {
        let totalPurchase = 0
        item.materialsSkus.forEach(item => {
          // 按需采购才有带采购数
          if (item.type == 0) {
            this.$set(item, 'quantity', item.waitPurchaseQuantity)
            this.$set(item, 'quantityArrive', item.waitPurchaseQuantity)
            this.$set(item, 'quantityDelivery', item.waitPurchaseQuantity)
            totalPurchase = totalPurchase + Number(item.waitPurchaseQuantity ? item.waitPurchaseQuantity : 0)
          } else {
            totalPurchase = totalPurchase + Number(item.quantity ? item.quantity : 0)
          }
        })
        this.$set(item, 'totalPurchase', Number(totalPurchase.toFixed(4)))
        this.$set(item, 'totalPurchaseQuantity', Number((totalPurchase / item.conversionRate).toFixed(4)))
      })
    },
    // 点击按单编辑确认
    editByOrderConfirm(newMaterialsSku) {
      this.$set(this.newPurchase.materialsSkus, this.editByOrder.materialsSkuIndex, newMaterialsSku)
      const allInfo = this.newPurchase.fieldConfigList.filter(item => {
        return item.name === '合计采购数'
      })
      const index = this.editByOrder.materialsSkuIndex
      const row = this.newPurchase.materialsSkus[index]
      let value = 0
      if (allInfo[0]) {
        value = row[allInfo[0].code]
      }
      this.totalPurchaseQuantityChange(Number(value), row, index)
    },
    // 显示按单编辑弹窗
    showEditByOrder(row, index) {
      this.editByOrder.materialsSku = row
      console.log('列数据',row)
      this.editByOrder.materialsSkuIndex = index
      this.editByOrder.visible = true
    },
    // 删除物料
    deleteMaterialsSku(row, index) {
      // materialsSkuId
      this.newPurchase.materialsSkus.splice(index, 1)
      this.searchMaterial.unplannedSelectedList.splice(this.searchMaterial.unplannedSelectedList.findIndex(item => item.materialsSkuId === row.materialsSkuId), 1)
      let tempList = []
      this.searchMaterial.demandSelectedList.forEach(item => {
        if (item.materialsSkuId !== row.materialsSkuId) {
          tempList.push(item)
        }
      })
      this.searchMaterial.demandSelectedList = tempList
    },
    // 显示搜索物料弹窗
    showSearchMaterial(type) {
      this.searchMaterial.type = type
      this.searchMaterial.visible = true
    },
    // 获取表格要显示的列
    getFieldConfigCodeAndNameList() {
      return new Promise((resolve, reject) => {
        let params = {
          unitId: this.unitId,
          targetType: this.isSampleMaterial ? 'SAMPLE_PURCHASE_CREATE' : 'PURCHASE_CREATE'
        }
        this.newPurchase.fieldConfigList = []
        purchaseFacFieldConfigCodeAndNameList(params).then(res => {
          if (res.data.code === 0) {
            this.newPurchase.fieldConfigList = res.data.data
            resolve()
          }
        })
      })
    },
    // 输入转化率校验
    //  handleConversionRate(item) {
    //     console.log(item)
    //     const reg = /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/;
    //     if(!reg.test(item.conversionRate)) {
    //         this.$message.error('转化率不能超过4位小数')
    //     }
    // },
    // 添加物料
    confirmAddMaterial(newSelectedList) {
      let tempList = JSON.parse(JSON.stringify(newSelectedList))
      this.searchMaterial.type == 0 ?
        this.searchMaterial.demandSelectedList = tempList :
        this.searchMaterial.unplannedSelectedList = tempList
      // 拼接出新的所有选择的materialsSkus
      let materialsSkus = []
      this.searchMaterial.unplannedSelectedList.forEach(item => {
        let purchaseDemand = {
          type: 1,
          materialsSkuId: item.materialsSkuId,
          demandSourceBillId: "",
          materialPurchaseDemandId: "",
          styleNo: "", //成衣款号
          demandSourceBillNo: "", //生产单号
          planBuyQuantity: item.planBuyQuantity ? item.planBuyQuantity : 0, //计划采购
          stockActivePreuse: item.stockActivePreuse ? item.stockActivePreuse : 0, //主动占用
          stock: item.stock ? item.stock : 0, //库存
          waitPurchaseQuantity: item.waitPurchaseQuantity ? item.waitPurchaseQuantity : 0, //待采购
          quantity: item.quantity || 0, //本次采购
          quantityDelivery: item.quantityDelivery || 0, //本次送料
          quantityArrive: item.quantityArrive || 0, //本次到料
          totalPurchase: item.totalPurchase ? item.totalPurchase : ''
        }
        let materialsSku = JSON.parse(JSON.stringify(item))
        materialsSku.materialsSkus = [purchaseDemand]

        materialsSkus.push(materialsSku)
      })
      this.searchMaterial.demandSelectedList.forEach(item => {
        let purchaseDemand = {
          type: 0,
          lineId: item.lineId,
          materialsSkuId: item.materialsSkuId,
          demandSourceBillId: item.demandSourceBillId,
          materialPurchaseDemandId: item.materialPurchaseDemandId,
          styleNo: item.styleNo, //成衣款号
          demandSourceBillNo: item.demandSourceBillNo, //生产单号
          planBuyQuantity: item.planBuyQuantity ? item.planBuyQuantity : 0, //计划采购
          stockActivePreuse: item.stockActivePreuse ? item.stockActivePreuse : 0, //主动占用
          stock: item.stock ? item.stock : 0, //库存
          waitPurchaseQuantity: item.waitPurchaseQuantity ? item.waitPurchaseQuantity : 0, //待采购
          quantity: this.isEdit ? item.quantity ? item.quantity : 0 : item.waitPurchaseQuantity ? item.waitPurchaseQuantity : 0, //本次采购
          quantityDelivery: this.isEdit ? (item.quantityDelivery || 0) : (item.waitPurchaseQuantity || 0), //本次送料
          quantityArrive: this.isEdit ? (item.quantityArrive || 0) : (item.waitPurchaseQuantity || 0), //本次到料
          totalPurchase: item.totalPurchase ? item.totalPurchase : ''
        }
        let findIndex = materialsSkus.findIndex(skuItem => skuItem.materialsSkuId == item.materialsSkuId)
        if (findIndex > -1) {
          materialsSkus[findIndex].materialsSkus.push(purchaseDemand)
        } else {
          let materialsSku = JSON.parse(JSON.stringify(item))
          materialsSku.materialsSkus = [purchaseDemand]
          materialsSkus.push(materialsSku)
        }
      })
      // 为了保持原来已选的行位置，不能直接用materialsSkus替换newPurchase.materialsSkus再做purchaseDemands的微调
      // 将newPurchase.materialsSkus中有的，而materialsSkus没有的剔除
      let newMaterialsSkuIds = materialsSkus.map(item => item.materialsSkuId)
      let temMaterialsSkus = []
      this.newPurchase.materialsSkus.forEach(item => {
        if (newMaterialsSkuIds.includes(item.materialsSkuId)) {
          temMaterialsSkus.push(item)
        }
      })
      this.newPurchase.materialsSkus = temMaterialsSkus

      // 更新newPurchase.materialsSkus
      materialsSkus.forEach(skuItem => {
        // 如果原来没有选中改物料,直接push进去
        if (!this.selectedMaterialsSkuIds.includes(skuItem.materialsSkuId)) {
          skuItem.priceUnit = skuItem.planCost //如果采购单价默认没有值，取参考单价
          this.newPurchase.materialsSkus.push(skuItem)
        } else {
          // 将newPurchase.materialsSkus的purchaseDemands中有的，而materialsSkus的purchaseDemands中没有的生产单剔除
          let newLineIds = skuItem.materialsSkus.map(item => item.lineId)
          let tempPurchaseDemands = []
          let oldMaterialsSku = this.newPurchase.materialsSkus.find(item => item.materialsSkuId == skuItem.materialsSkuId)
          oldMaterialsSku.materialsSkus.forEach(demandItem => {
            if (newLineIds.includes(demandItem.lineId)) {
              tempPurchaseDemands.push(demandItem)
            }
          })
          oldMaterialsSku.materialsSkus = tempPurchaseDemands
          // 将新加的purchaseDemands追加进去
          let oldLineIds = oldMaterialsSku.materialsSkus.map(item => item.lineId)
          skuItem.materialsSkus.forEach(item => {
            if (!oldLineIds.includes(item.lineId)) {
              oldMaterialsSku.materialsSkus.push(item)
            }
          })
        }
      })

      this.newPurchase.materialsSkus.forEach(skuItem => {
        let totalWaitPurchaseQuantity = 0
        let totalPurchase = 0
        let unplannedMaterialsSkus = []
        let plannedMaterialsSkus = []
        skuItem.materialsSkus.forEach(item => {
          totalWaitPurchaseQuantity = totalWaitPurchaseQuantity + Number(item.waitPurchaseQuantity ? item.waitPurchaseQuantity : 0)
          totalPurchase = totalPurchase + Number((item.quantity ? item.quantity : 0).toFixed(4))
          if (item.type == 0) {
            plannedMaterialsSkus.push(item)
          } else {
            unplannedMaterialsSkus.push(item)
          }
        })
        // 计划外采购的要放在最后面
        skuItem.materialsSkus = [...plannedMaterialsSkus, ...unplannedMaterialsSkus]
        // 更新总待采购列、合计采购、合计采购数的值
        skuItem.totalWaitPurchaseQuantity = Number(totalWaitPurchaseQuantity.toFixed(4))
        skuItem.totalPurchase = totalPurchase
        skuItem.totalPurchaseQuantity = skuItem.totalPurchase && skuItem.conversionRate ?
          Number((skuItem.totalPurchase / skuItem.conversionRate).toFixed(4)) : ''

      })
    },
    // 取消
    cancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    //确定
    confirm() {
      if (!this.form.purchaserId) {
        this.$message.error(this.isPickUpDelivery ? '请选择业务员' : '请选择采购员')
        return
      }
      if (!this.form.datePurchase) {
        this.$message.error('请选择采购日期')
        return
      }
      if (this.isPickUpDelivery && !this.form.outsideFactoryId) {
        this.$message.error('请选择送料工厂')
        return
      }
      if (!this.newPurchase.materialsSkus.length) {
        this.$message.error('请选择物料')
        return
      }
      if (this.newPurchase.materialsSkus.some(item => !item.supplierId)) {
        this.$message.error('供应商未填')
        return
      }
      if (this.newPurchase.materialsSkus.some(item => !item.totalPurchaseQuantity)) {
        this.$message.error('合计采购数未填')
        return
      }
      if (this.newPurchase.materialsSkus.some(item => !item.priceUnit)) {
        this.$message.error('采购单价未填')
        return
      }
      if (this.newPurchase.materialsSkus.some(item => !item.conversionRate)) {
        this.$message.error('转化率未填')
        return
      }
      // 将conversionRate、priceUnit放到里层，为了兼容原来后台的老接口
      let billPurchases = JSON.parse(JSON.stringify(this.newPurchase.materialsSkus))
      billPurchases.forEach(skuItem => {
        skuItem.materialsSkus.forEach(item => {
          item.conversionRate = skuItem.conversionRate
          item.priceUnit = skuItem.priceUnit
          item.quantityStockUnitPurchase = item.quantity
        })

      })
      let params = {
        ...this.form,
        belongModule: this.isSampleMaterial ? 1 : 0,
        userId: this.userId,
        unitId: this.unitId,
        bossUnitId: this.bossUnitId,
      }
      if (this.isEdit) {
        params.materialsSkus = billPurchases[0].materialsSkus
        params.supplierId = billPurchases[0].supplierId
        params.remark = billPurchases[0].remark
      } else {
        params.billPurchases = billPurchases
      }
      let api = this.isEdit ? updateMaterielPurchase : batchNewMaterielPurchase

      if (this.isPickUpDelivery) {
        params.directArriveAndDelivery = true;
      }

      this.isSubmitting = true
      api(params).then(res => {
        this.isSubmitting = false
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.$emit('update:visible', false)
          // 新建、编辑成功
          this.$emit('success')
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    renderHeader(columnName) {
      let title = ''
      switch(columnName){
          case '本次采购':title ='本次采购/库存单位';break;
          case '合计采购':title ='合计采购/库存单位';break;
          case '合计采购数':title ='合计采购数/采购单位';break;
      }
      if(title){
          return <div class="custom-header">
          <span>{columnName}</span>
          <el-tooltip effect="light" content={title}  placement="top"><i style='padding-left:5px' class='el-icon-information'></i></el-tooltip>
          </div>
      } else {
          return <div><span>{columnName}</span></div>

      }
    },
    /**
     * 页面初始化
     */
    async init() {
      this.getFactorys();
      this.storeList();
      this.getPurchasePersionId();
      await this.getFieldConfigCodeAndNameList()
      if (this.isEdit) {
        let form = this.detailPurchasedata.form
        this.form = {
            purchaseId: form.id,
            directArrive: false,
            storehouseId: '',
            outsideFactoryId: '',
            supplierId: form.supplierId,
            datePurchase: form.datePurchase ? fun.dateFormatter(form.datePurchase, false) : '',
            expectDateEnd: form.expectDateEnd ? fun.dateFormatter(form.expectDateEnd, false) : '',
            purchaserId: form.creatorId,
          },
          this.newPurchase.materialsSkus = this.detailPurchasedata.materialsSkus
        this.searchMaterial.demandSelectedList = []
        this.searchMaterial.unplannedSelectedList = []
        this.newPurchase.materialsSkus.forEach(skuItem => {
          skuItem.materialsSkus.forEach(item => {
            item.quantity = item.quantityStockUnitPurchase
            item.waitPurchaseQuantity = item.waitPurchaseQuantity || 0

            let tempItem = {
              lineId: item.type == 0 ? item.materialPurchaseDemandId : item.materialsSkuId,
              ...skuItem,
              ...item
            }
            item.type == 0 ? this.searchMaterial.demandSelectedList.push(tempItem) :
              this.searchMaterial.unplannedSelectedList.push(tempItem)
          })
        })
      }

      this.$nextTick(() => {
        let self = this;
        this.tableHeight = this.$refs.newPurchaseContent.offsetHeight
        // 通过捕获系统的onresize事件触发去改变原有的高度
        window.onresize = function () {
          self.tableHeight = self.$refs.newPurchaseContent.offsetHeight
        }
        // 从采购需求看板勾选，进来新建时默认勾选中
        if (this.demandSelectedList) {
          // this.searchMaterial.unplannedSelectedList = this.unplannedSelectedList?this.unplannedSelectedList:[]
          this.searchMaterial.demandSelectedList = this.demandSelectedList
          let selectedList = this.demandSelectedList
          selectedList.forEach(item => {
            item.totalPurchase = item.totalPurchase || ''
            item.totalPurchaseQuantity = item.totalPurchaseQuantity || ''
          })
          this.confirmAddMaterial(selectedList)
          // 设置采购金额
          let purchaseMoneyInfo = {}
          let totalPurchaseInfo = {}
          let purchaseInfo = {}
          this.newPurchase.fieldConfigList.forEach(item => {
            if (item.name === '采购金额') {
              purchaseMoneyInfo = item
            } else if (item.name === '合计采购数') {
              totalPurchaseInfo = item
            } else if (item.name === '采购单价') {
              purchaseInfo = item
            }
          })
          // 设置采购金额
          this.newPurchase.materialsSkus.forEach((item, index) => {
            if (item[totalPurchaseInfo.code] && item[purchaseInfo.code]) {
              const countValue = fun.mul(Number(item[totalPurchaseInfo.code]), Number(item[purchaseInfo.code]))
              console.log('计算金额', countValue)
              this.$set(this.newPurchase.materialsSkus[index], purchaseMoneyInfo.code, countValue)
            }
          })

        }
      })

    }
  },

  created() {
    this.init()
  },
}
</script>

<style lang="scss" scoped>
.new-purchase {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 1000;

  .scroll-content {
    height: 100%;
    margin: 0;
  }

  .total-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(238, 240, 246);
    border: 1px solid #E6EAF0;
    border-bottom: none;
    font-size: 12px;
    margin: 0 24px;
    padding: 12px;

    .orange {
      font-weight: bold;
    }

    .orange-btn {
      color: #ff9c38;
      background: transparent;
      border: 1px solid #ff9c38;
    }

    .blue-btn {
      color: #1CA1FF;
      background: transparent;
      border: 1px solid #1CA1FF;
    }
  }

}
</style><style lang="scss">
.new-purchase {
  td.yellow-bg {
    background-color: #FFF9ED !important;

    .el-textarea__inner,
    .el-input__inner {
      background-color: #FFF9ED !important;
    }
  }

  .custom-cell {

    .el-textarea__inner,
    .el-input__inner {
      font-size: 12px;
      min-height: 24px;
      padding: 3px 0;
      height: 24px;
      border: none;
    }
  }
}
</style>
