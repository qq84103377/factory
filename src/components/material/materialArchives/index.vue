/*
 * @Author: kuhn 
 * @Description: 物料档案
 * @Date: 2019-05-07 16:38:54 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-22 17:08:41
 */

<template>
  <div class="archives-index">
    <el-row class="material-archives">
      <page-title title="物料档案">
        <el-input
          @change="getMaterialsList(1)"
          class="search"
          v-model.trim="filterParams.keyword"
          placeholder="输入物料分类/名称/款号/供应商"
          icon="search">
        </el-input>
        <nf-button @click.native="exportMaterial">
          导出物料
        </nf-button>
        <nf-button @click.native="dialogVisibleExcel = true">
          从Excel导入
        </nf-button>
        <nf-button
          type="warning"
          svg="icon-btn-add"
          @click.native="clickskip">
          新建物料
        </nf-button>
      </page-title>
      <!--筛选区-->
      <div class="box-shadow custom-filter-form">
        <el-form
          style="margin-left: -40px"
          :model="form"
          label-width="100px">
          <el-row>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="物料分类">
                <el-select
                  v-model="filterParams.materialKindsFilters"
                  filterable
                  multiple
                  clearable
                  placeholder="全部">
                  <el-option
                    v-for="item in materialKindList"
                    :key="item.id"
                    :label="item.no+'-'+item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="物料款号">
                <materialSelect v-model="filterParams.materialId" :type="'searchMaterialStyleNoScreen'">
                </materialSelect>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="供应商">
                <supplier-select
                  ref="suppliersFilters"
                  :multiple='true'
                  :canAdd='false'
                  v-model="filterParams.suppliersFilters">
                </supplier-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="创建时间">
                <el-date-picker
                  placeholder="全部"
                  @change="changeCreateDate"
                  v-model="createTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions2">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <!-- 商品款号 -->
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="商品款号">
                <goods-select v-model="filterParams.styleIds" :multiple="true"></goods-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="是否为样料" label-width="110px">
                <filter-check-group v-model="filterParams.sampleMaterial">
                  <filter-check-item
                    v-for="item in sampleMaterialOptions"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></filter-check-item>
                </filter-check-group>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="6">
              <el-form-item label="审核状态" label-width="110px">
                <filter-check-group :multiple="true" v-model="filterParams.reviewStatus">
                  <filter-check-item
                    v-for="item in optionStatus"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"></filter-check-item>
                </filter-check-group>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :md="12"
              :lg="6">
              <div class="btn-group text-right">
                <el-button class="btn btn-reset" @click='renumberFn'>重编号</el-button>
                <el-button class="btn btn-reset" @click='resrtList()'>重置</el-button>
                <el-button class="btn btn-submit" @click="getMaterialsList()">筛选</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="box-shadow">
        <div class="mgt16" v-loading="isLoading">
          <el-table
            class="custom-table"
            border
            :data="materialsList"
            max-height="500"
            @row-click='form_click'
            @select="s => tableSelection = s"
            @select-all="s => tableSelection = s">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!--图片-->
            <el-table-column
              prop="commonMaterialsSkuPicture"
              label="图片"
              width="76">
              <template slot-scope="scope">
                <div v-if="scope.row.commonMaterialsPictureList">
                  <img class="material-img"
                      v-for="(item,index) in scope.row.commonMaterialsPictureList"
                      :key="index"
                      v-if="index==0"
                      @click.stop="imgList(scope.row)"
                      :src="item.path" alt="">
                </div>
              </template>
            </el-table-column>
            <!--物料分类-->
            <el-table-column
              :prop="kindsName?kindsName:kindsNo"
              label="物料分类"
              width="120">
              <template slot-scope="scope">
                <div>{{scope.row.kindsName?scope.row.kindsName:scope.row.kindsNo}}</div>
              </template>
            </el-table-column>
            <!--物料款号-->
            <el-table-column
              prop="materialsNo"
              label="物料款号"
              width="160">
            </el-table-column>
            <!--物料名称-->
            <el-table-column
              prop="materialsName"
              label="物料名称"
              width="250"
              show-overflow-tooltip>
            </el-table-column>
            <!--颜色-->
            <el-table-column
              class-name="multiple-row"
              :prop="colorName?colorName:colorValue"
              label="颜色"
              width="100">
              <template slot-scope="scope">
                <div>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</div>
              </template>
            </el-table-column>
            <!--规格-->
            <el-table-column
              class-name="multiple-row"
              label="规格"
              width="100">
              <template slot-scope="scope">
                <div>
                  {{scope.row.specificationsName?scope.row.specificationsName:scope.row.specificationsNo}}
                </div>
              </template>
            </el-table-column>
            <!--默认供应商-->
            <el-table-column
              prop="supplierName"
              label="默认供应商"
              width="160">
            </el-table-column>
            <!--供应商款号/色号-->
            <el-table-column label="供应商款号/色号" width="160">
              <template slot-scope="scope">
                <span>{{scope.row.supplierStyleNo}}</span>
                <span v-if="scope.row.supplierStyleNo || scope.row.supplierColorNo">/</span>
                <span>{{scope.row.supplierColorNo}}</span>
              </template>
            </el-table-column>
            <!--参考单价-->
            <el-table-column
              prop="planCost"
              :render-header="renderPlanCostHeader"
              width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.planCost">{{scope.row.planCost}}元/{{scope.row.purchaseUnitName}}</span>
              </template>
            </el-table-column>
            <!--不含税价-->
            <el-table-column
              prop="excludingTaxPrice"
              :render-header="renderExcludingTaxPriceHeader"
              width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.excludingTaxPrice">{{scope.row.excludingTaxPrice}}元/{{scope.row.purchaseUnitName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sampleMaterial"
              label="样料"
              width="80">
              <template slot-scope="scope">
                <span>{{scope.row.sampleMaterial?'样料':''}}</span>
              </template>
            </el-table-column>
            <!--库存单位-->
            <el-table-column
              prop="stockUnitName"
              label="库存单位"
              width="80">
            </el-table-column>
            <!--采购单位-->
            <el-table-column
              prop="purchaseUnitName"
              label="采购单位"
              width="80">
            </el-table-column>
            <!--备注-->
            <el-table-column
              prop="remark"
              label="备注"
              width="260">
              <template slot-scope="scope">
                <div :title="scope.row.remark">{{scope.row.remark}}</div>
              </template>
            </el-table-column>
            <!--标准用量-->
            <el-table-column
              prop="defaultDosage"
              label="标准用量"
              width="80">
            </el-table-column>
            <!--是否固定物料-->
            <el-table-column
              prop="fixedMaterials"
              label="固定物料"
              width="100">
              <template slot-scope="scope">
                <div>{{scope.row.fixedMaterials?'固定物料':''}}</div>
              </template>
            </el-table-column>
            <!--参考转化率-->
            <el-table-column
              prop="conversionRate"
              label="参考转化率"
              width="100">
              <template slot-scope="scope">
                <div>{{scope.row.conversionRate}}</div>
              </template>
            </el-table-column>
            <!--默认损耗-->
            <el-table-column
              prop="mlossRate"
              label="默认损耗"
              width="100">
              <template slot-scope="scope">
                <div>{{scope.row.mlossRate}}%</div>
              </template>
            </el-table-column>
            <!--商品款号-->
            <el-table-column label="关联商品款号" width="120">
              <template slot-scope="scope">
                <div class="styleNo-popover" style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;" :title="scope.row.styleNo">{{scope.row.styleNo}}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="styleNo"
              label="审核状态"
              width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.reviewStatusText.indexOf('\n')>-1">
                  <div>{{scope.row.reviewStatusText.split('\n')[0]}}</div>
                  <div>{{scope.row.reviewStatusText.split('\n')[1]}}</div>
                </div>
                <div v-else>{{scope.row.reviewStatusText}}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="styleNo"
              label="审批备注"
              width="120">
              <template slot-scope="scope">
                <div>{{scope.row.reviewRemark}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 暂无数据 -->
        <!--<div v-show="orderList.length>0" v-loading="isLoading"-->
        <!--style="background-color: #fff;margin-top: 16px;min-height: 450px;line-height: 450px;text-align: center;font-size: 36px;color: #ccc;">-->
        <!--暂无数据-->
        <!--</div>-->
      </div>

    </el-row>
    <!-- 左侧的侧窗 -->
    <!-- 遮罩层 -->
    <transition name="opcity">
      <div
        class="cover"
        @click='isShow1'
        v-if='isshow'>
      </div>
    </transition>
    <!-- 左侧的测弹窗 -->
    <transition name="right-move">
      <add-material
        v-if='isshow'
        @cancel='isshow = false'
        @confirm="confirmMaterial"
        :title="title"></add-material>
    </transition>
    <!--图片预览-->
    <imgPreview
      @dialogClose="centerDialogVisible=false"
      :centerDialogVisible="centerDialogVisible"
      :imgLists="imgLists"
      :imgIndex="imgIndex"></imgPreview>
    <!--上传物料表格弹窗-->
    <UploadExcelComponent
      :excelStatic="excelStatic"
      :excelDemoUrl="excelDemoUrl"
      @uploadFinish="uploadFinish"
      @commit="commitExcelData"
      @reset="closeUploadComponent"
      :dialogVisibleExcel="dialogVisibleExcel">
    </UploadExcelComponent>

    <!--重编号-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      title="全选-选项"
      :visible.sync="renumberShow"
      size="tiny">
      <div style="text-align: center;">
        <el-radio-group style="display: flex;align-items: center;justify-content: center;flex-direction: column" v-model="renumberRadio">
          <el-radio :label="1">当前页已选项</el-radio>
          <el-radio :label="2" style="margin: 10px 0;">所有匹配选项</el-radio>
        </el-radio-group>
        <el-checkbox
          v-model="updateMaterialsName"
          class="mgb8"
          :disabled="isDisabledMaterialName">重新生成物料名称</el-checkbox>
        <p style="color: red">请选择其中一项后点击确定，可勾选重新生成物料名称</p>
      </div>
      <div slot="footer">
        <el-button @click="renumberShow = false;renumberRadio = null;updateMaterialsName=false;">取 消
        </el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="renumberSubmit">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--重编号结果反馈-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      title="重编号结果反馈"
      :visible.sync="renumberResult"
      size="tiny">
      <div style="text-align: center;">
        <div style="font-size: 16px;margin-bottom: 10px;">{{result.successNum}}条物料SKU重编号成功</div>
        <div style="font-size: 16px;"><span style="color: red">{{result.faithNum}}条</span>物料SKU重编号<span style="color: red">失败</span></div>
        <div style="color: #aaa;font-size: 12px;margin: 10px 0;">可能失败原因：没填分类、颜色、规格、没配置编号规则等，请仔细检查</div>
        <div style="color: blue;cursor: pointer;text-decoration: underline" @click="downFailList">下载重编号失败列表</div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="renumberResult=false">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--分页-->
    <el-col class="pd15 text-right">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="total, prev, pager, next"
        :total="totalNum">
      </el-pagination>
    </el-col>
  </div>

</template>

<script>
import {
  archivesList, //物料档案列表与查询接口
  classification, //物料分类下拉列表接口

} from "@/api/material";
import {
  selectFacGoodsStyleList, //商品款号
  importMaterialsSkuExcel,
  isExistGenerateStyleNoList,
  updateMaterialsNos,
  exportErrorMaterialExcel,
  ruleList,
  materialExportExcel
} from "@/api/api";
import UploadExcelComponent from '@/components/Common/uploadExcel.vue';
import addMaterial from "./addMaterial.vue";
import supplierSelect from '@/components/Common/custom-select/supplier-select.vue';
import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group.vue';
import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';

export default {
  components: {
    addMaterial,
    UploadExcelComponent,
    supplierSelect,
    FilterCheckGroup,
    FilterCheckItem
  },
  data() {
    return {
      btnLoading: false,
      renumberRadio: null, //重编号选项
      renumberShow: false,
      renumberResult: false,
      userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
      unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
      testSure: false,
      dialogVisibleExcel: false,
      centerDialogVisible: false, //判断显示图片预览显示与隐藏
      imgLists: [],
      imgIndex: 0,
      title: "新建物料",
      isshow: false, //判断侧窗显示和隐藏
      filterParams: {
        keyword: "", //查询获取当前用户输入的查询关键字
        materialKindsFilters: [], //物料分类的下拉框选中的绑定数据
        suppliersFilters: [], //供应商的下拉框选中的绑定数据
        createStartTimeStampFilter: "", //开始时间
        createEndTimeStampFilter: "", //结束时间
        sampleMaterial: 2,
        styleIds: [], //商品款号
        materialId: '', //物料款号
        reviewStatus: [2]
      },
      createTime: [], //创建时间当前点击的数据
      pageCount: 0, //工单总数,页码需要显示
      isLoading: false, //工单列表loading
      orderList: [], //工单列表,
      materialsList: [], //工单列表数据
      materialKindList: [], //物料分类下拉数据
      totalNum: 0, // 列表总数量
      currentPage: 1, // el-pagination-当前页
      pickerOptions2: { // 日期数据
        shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      excelStatic: {
        loading: false,
        excelData: true,
        excelDataErr: 0,
        excelDataSucc: 0,
      },
      excelDemoUrl: 'https://image3.myjuniu.com/198057f416ce4ad1a11e1c7198e011b2_pro_282569cb42c7b5a98f02ddeab1b40106..xlsx?attname=物料导入模板.xlsx',
      sampleMaterialOptions: [{
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        },
        {
          label: '全部',
          value: 2
        },
      ],
      optionStatus: [{
          label: '草稿态',
          value: 0
        },
        {
          label: '待审核',
          value: 1
        },
        {
          label: '已通过',
          value: 2
        },
        {
          label: '已驳回',
          value: 3
        },
        {
          label: '反审待批',
          value: 4
        },
      ],
      tableSelection: [],
      goodStyleList: [], //商品款号
      autoNumberMaterial: false, //物料款号自动编号
      isExport: false,
      result: {}, // 重编号结果
      updateMaterialsName: false, // 重编号，是否选中重新生成物料名称
    };
  },

  created() {
    //列表渲染调用
    this.getMaterialsList(1);
    // 物料分类下拉接口调用
    this.getMaterielClassifyList();
    //检查是否设置自动编号
    this.getRuleList()
    // this.isExistGenerateStyleNoList()
    // 供应商下拉接口调用
    // this.getSupplierList();
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    isDisabledMaterialName() {
      return !this.renumberRadio
    }
  },
  methods: {
    downFailList() {
      exportErrorMaterialExcel({
        failureId: this.result.failureId
      }).then(res => {
        let blob = new Blob([JSON.stringify(res.data)], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        let url = window.URL.createObjectURL(res.data);
        let a = window.document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', '物料重编号失败列表' + '.xls');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    },
    exportMaterial() {
      this.renumberShow = true
      this.isExport = true
    },
    renumberSubmit() {
      if (!this.renumberRadio) return this.$message.error('请选择其中一项后点击确定')
      if (this.renumberRadio == 1 && this.tableSelection.length == 0) {
        return this.$message.error('请勾选物料档案')
      }
      this.btnLoading = true
      let params
      if (this.renumberRadio == 1) {
        // 当前页
        let ids = this.tableSelection.map(v => this.isExport ? v.id : v.commonMaterialsId)
        params = {
          ids,
          unitId: this.unitId,
          updateMaterialsName: this.updateMaterialsName // 是否自动生成物料名称
        }
      } else {
        // 全部
        params = {
          sampleMaterial: this.filterParams.sampleMaterial, //是否为样料
          keyword: this.filterParams.keyword, //查询用户输入的当前值
          materialKindsFilters: this.filterParams.materialKindsFilters, //物料分类下拉过滤数据
          suppliersFilters: this.filterParams.suppliersFilters, //供应商下拉过滤数据
          styleIds: this.filterParams.styleIds, //商品款号
          materialId: this.filterParams.materialId, //物料款号
          createStartTimeStampFilter: "", //开始时间？
          createEndTimeStampFilter: "", //结束时间？
          pageSize: 20, //每页条数
          unitId: JSON.parse(sessionStorage.getItem("last_login")).id, //当前用户id
          updateMaterialsName: this.updateMaterialsName // 是否自动生成物料名称
        };
        if (this.createTime.length && this.createTime[0] == null) {
          delete params.createStartTimeStampFilter;
          delete params.createEndTimeStampFilter;
        } else if (this.createTime.length && this.createTime[0]) {
          params.createStartTimeStampFilter =
            Date.parse(new Date(this.createTime[0] + " 00:00:00")) / 1000;
          params.createEndTimeStampFilter =
            Date.parse(new Date(this.createTime[1] + " 00:00:00")) / 1000 + 86399;
        }
      }

      if (this.isExport) {
        materialExportExcel(params).then(res => {
          this.btnLoading = false
          this.renumberShow = false;
          let blob = new Blob([JSON.stringify(res.data)], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          let url = window.URL.createObjectURL(res.data);
          let a = window.document.createElement('a');
          a.setAttribute('href', url);
          a.setAttribute('download', '导出物料列表' + '.xls');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
      } else {
        updateMaterialsNos(params).then(res => {
          this.btnLoading = false
          if (res.data.code == 0) {
            this.renumberShow = false;
            this.renumberResult = true;
            this.result = res.data.data
            this.$message.success(res.data.msg)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }

    },
    //检查获取 是否设置为自动编号
    // isExistGenerateStyleNoList(){
    // isExistGenerateStyleNoList({userId:this.userId}).then(res=>{
    //     res.data.data.forEach(item=>{
    //         if(item.modelType===1){
    //             this.autoNumberMaterial = item.userDefinedRule
    //         }
    //     })
    // })
    // },
    // 是否设置自动编号
    getRuleList() {
      ruleList({
        userId: this.userId
      }).then(res => {
        this.autoNumberMaterial = res.data.data.some(v => {
          return v.modelType == 6 && v.openRule && v.commonGenerateRuleDTOs.length
        })
      })
    },
    renumberFn() {
      if (!this.autoNumberMaterial) {
        return this.$message.error('未配置自动编号规则！')
      } else {
        this.renumberShow = true
        this.isExport = false
      }
    },
    //提交excel
    commitExcelData(form) {
      if (form) {
        this.excelStatic.loading = true;
        importMaterialsSkuExcel(form).then(res => {
          if (res.data.code === 0) {
            this.excelStatic.loading = false;
            this.excelStatic.excelData = false;
            this.excelStatic.excelDataErr = res.data.faithNum;
            this.excelStatic.excelDataSucc = res.data.successNum;
            this.uploadFinish();
          } else {
            this.excelStatic.loading = false;
            this.$message.error(res.data.message);
          }
        })
      }
    },
    //隐藏导入excel组件
    closeUploadComponent() {
      this.excelStatic.loading = false;
      this.excelStatic.excelData = true;
      this.excelStatic.excelDataErr = 0;
      this.excelStatic.excelDataSucc = 0;
      this.dialogVisibleExcel = false
    },
    uploadFinish() {
      //列表渲染调用
      this.getMaterialsList(1);
    },
    imgList(row) {
      this.imgIndex = 0;
      this.imgLists = row.commonMaterialsPictureList;
      this.centerDialogVisible = true;
    },
    // 点击每一行跳转详情
    form_click(row, event, column) {
      if (column.type === 'default') { //过滤点击多选框的情况
        this.$router.push({
          path: `/materialInfo/${row.commonMaterialsId}`
        });
      }
    },
    // 点击遮罩层左侧关闭
    isShow1() {
      this.isshow = false;
    },
    // 点击确定，隐藏物料编辑，刷新物料列表
    confirmMaterial() {
      this.isshow = false;
      this.getMaterialsList(); //点击取消，从新调用接口渲染数据
    },
    // 点击重置
    resrtList() {
      this.filterParams.sampleMaterial = 2;
      this.filterParams.materialKindsFilters = [];
      // 审核状态默认为已通过
      this.filterParams.reviewStatus = [2];
      this.filterParams.suppliersFilters = [];
      this.filterParams.styleIds = [];
      this.filterParams.materialId = '';
      this.$refs.suppliersFilters.supplierId = '';
      this.createTime = ""; //点击重置创建时间
      this.filterParams.materialId = ''
      this.getMaterialsList(1);
    },
    //   点击新建物料判断权限
    clickskip() {
      if (!this.powerJudgement.permissions("fac.materials.add")) {
        return
      }
      this.isshow = true;
    },
    // 列表数据渲染
    getMaterialsList(pageNum) {
      // 传过去的参数
      let params = {
        reviewStatus: this.filterParams.reviewStatus,
        sampleMaterial: this.filterParams.sampleMaterial, //是否为样料
        keyword: this.filterParams.keyword, //查询用户输入的当前值
        materialKindsFilters: this.filterParams.materialKindsFilters, //物料分类下拉过滤数据
        suppliersFilters: this.filterParams.suppliersFilters, //供应商下拉过滤数据
        styleIds: this.filterParams.styleIds, //商品款号
        materialId: this.filterParams.materialId, //物料款号
        createStartTimeStampFilter: "", //开始时间？
        createEndTimeStampFilter: "", //结束时间？
        pageNum: pageNum ? pageNum : 1, //当前页
        pageSize: 20, //每页条数
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id, //当前用户id
        userId: this.userId
      };
      if (this.createTime.length && this.createTime[0] == null) {
        delete params.createStartTimeStampFilter;
        delete params.createEndTimeStampFilter;
      } else if (this.createTime.length && this.createTime[0]) {
        params.createStartTimeStampFilter =
          Date.parse(new Date(this.createTime[0] + " 00:00:00")) / 1000;
        params.createEndTimeStampFilter =
          Date.parse(new Date(this.createTime[1] + " 00:00:00")) / 1000 + 86399;
      }
      // 列表渲染请求接口
      this.isLoading = true
      archivesList(params).then(res => {
        this.isLoading = false
        this.currentPage = params.pageNum; //当前页数
        this.materialsList = res.data.commonMaterialsSkuList; //物料档案列表数据
        this.totalNum = res.data.totalCount; //总条数
        this.filterParams.createStartTimeStampFilter = ""; //开始时间
        this.filterParams.createEndTimeStampFilter = ""; //结束时间
      });
    },
    // 点击创建时间的方法，获取当前点击的时间字符串
    changeCreateDate(filterDate) {
      this.createTime = []
      if (filterDate) {
        this.createTime = filterDate.split("至");
      }
    },
    // 查询物料分类下拉框赋值
    getMaterielClassifyList() {
      let params = {
        pageNum: 0,
        pageSize: 0,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      };
      // 请求查询物料分类下拉接口
      classification(params).then(res => {
        this.materialKindList = res.data.kindsList; //赋值查询列表物料分类下拉框
      });
    },
    // 分页
    handleCurrentChange(e) {
      this.getMaterialsList(e);
    },
    // 参考价列名
    renderPlanCostHeader() {
      return <div class = 'two-row-header' > < div > 参考价 < /div><div>【元/采购单位】 < /div></div >
    },
    // 不含税价列名
    renderExcludingTaxPriceHeader() {
      return <div class = 'two-row-header' > < div > 不含税价 < /div><div>【元/采购单位】 < /div></div >
    }

  }
};
</script>

<style lang="scss" scoped>
.two-row-header {
  line-height: 20px;
  padding: 2px 0;
  text-align: center;
}

.material-archives {
  width: 100%;
  height: 100%;

  .search {
    width: 260px;
    /*margin-right: 8px;*/
  }

  .material-img {
    width: 56px;
    height: 56px;
    vertical-align: bottom;
    margin: 4px 0;
  }
}
</style>
