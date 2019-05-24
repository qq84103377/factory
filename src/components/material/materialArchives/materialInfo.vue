<template>
  <div class="material-info">
    <div class="nf-scroll-container">
      <!-- 物料详情头部 -->
      <page-title title="物料信息">
        <nf-button class="go-back" @click="listGo">
          <i class="icon-left el-icon-arrow-left"></i>返回上级
        </nf-button>
      </page-title>
      <!-- 物料详情基本信息 -->
      <div class="nf-scroll-view">
        <div class="pd24 box-shadow">
          <div class="yellow-border-title mgb20">
            <h1 class="title">基本信息</h1>
            <div>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==0||detailInfo.reviewStatus==3"
                type="warning"
                :plain="true"
                @click="enterEdit">编辑</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="(detailInfo.reviewStatus==0||detailInfo.reviewStatus==3)&&isConfig"
                type="warning"
                @click="submit">提报</nf-button>
                <!-- reviewStatus：1【待审核状态】 4【反审待批准状态】-->
              <nf-button :loading="btnLoading" v-if="(detailInfo.reviewStatus==1||detailInfo.reviewStatus==4)&&isConfig" type="warning" @click="undo">
                  <span v-if="detailInfo.reviewStatus==1">撤回提报</span>
                    <span v-if="detailInfo.reviewStatus==4">撤回申请</span>
              </nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==1&&isConfig&&detailInfo.assigneeIds.some(v => v === userId)"
                type="success"
                @click="taskReview(true)">通过</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==1&&isConfig&&detailInfo.assigneeIds.some(v => v === userId)"
                type="danger"
                @click="reasonDialog=true">驳回</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==2&&isConfig"
                type="warning"
                @click="reasonDialog=true">申请反审</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==4&&isConfig&&detailInfo.assigneeIds.some(v => v === userId)"
                type="success"
                @click="taskReview(true)">批准</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==4&&isConfig&&detailInfo.assigneeIds.some(v => v === userId)"
                type="danger"
                @click="taskReview(false)">不批准</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==2&&!isConfig"
                type="warning"
                @click="materialTaskUndoReview(false)">申请驳回</nf-button>
              <nf-button
                :loading="btnLoading"
                v-if="detailInfo.reviewStatus==3&&!isConfig"
                type="warning"
                @click="materialTaskUndoReview(true)">生成档案</nf-button>
            </div>
          </div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="60px">
            <el-row>
              <!-- 物料分类 -->
              <el-col :span="8">
                <el-form-item
                  label="物料分类"
                  prop="kindId"
                  label-width="100px">
                  <span>{{ruleForm.kindId}}</span>
                </el-form-item>
              </el-col>
              <!-- 物料款号 -->
              <el-col :span="8">
                <el-form-item
                  label="物料款号"
                  prop="no"
                  label-width="100px">
                  <span>{{ruleForm.no}}</span>
                </el-form-item>
              </el-col>
              <!-- 审核状态 -->
              <el-col :span="8">
                <el-form-item label="审核状态" label-width="100px">
                  <span>{{ruleForm.reviewStatusText}}</span>
                </el-form-item>
              </el-col>
              <!-- 审批备注 -->
              <el-col :span="8">
                <el-form-item label="审批备注" label-width="100px">
                  <span>{{ruleForm.reviewRemark}}</span>
                </el-form-item>
              </el-col>
              <!-- 物料名称 -->
              <el-col :span="24">
                <el-form-item
                  label="物料名称"
                  prop="name"
                  label-width="100px">
                  <span>{{ruleForm.name}}</span>
                </el-form-item>
              </el-col>
              <!-- 数据表格 -->
              <el-col :span="24" class='add-material-table'>
                <!--详情table-->
                <el-table
                  class="custom-table no-hover-highlight "
                  :row-class-name="tableRowClassName"
                  :data="tableData4"
                  border
                  style="width: 100%"
                  max-height="500">
                  <!-- 图片 -->
                  <el-table-column
                    prop="city"
                    label="图片"
                    width="100">
                    <template slot-scope="scope">
                      <div style="text-align: center;padding-top: 5px;" @click="imgList(scope.row)">
                        <img style="width: 48px;height: 48px;"
                                                     v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                                     :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0].path:''"
                                                     alt="">
                                            </div>
                    </template>

                  </el-table-column>
                  <!-- 颜色 -->
                  <el-table-column
                    prop="colorName"
                    label="*颜色"
                    width="120">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 规格 -->
                  <el-table-column
                    prop="province"
                    label="*规格"
                    width="160">
                    <template slot-scope="scope">
                      <div>
                        <span>{{scope.row.no?scope.row.specificationsNo:scope.row.specificationsName}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!--样料-->
                  <el-table-column
                    prop="sampleMaterial"
                    label="样料"
                    width="80">
                    <template slot-scope="scope">
                      <div class="loss">
                        <span>{{scope.row.sampleMaterial?'样料':''}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 库存单位 -->
                  <el-table-column
                    prop="stockUnitName"
                    label="*库存单位"
                    width="100">
                  </el-table-column>
                  <!-- 采购单位 -->
                  <el-table-column
                    prop="purchaseUnitName"
                    label="采购单位"
                    width="100">
                  </el-table-column>
                  <!-- 备注 -->
                  <el-table-column prop="remark" label="备注">
                    <template slot-scope="scope">
                      <div>
                        <span :title="scope.row.remark">{{scope.row.remark}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 标准用量 -->
                  <el-table-column
                    width="100"
                    prop="defaultDosage"
                    label="标准用量">
                  </el-table-column>
                  <!-- 固定物料 -->
                  <el-table-column
                    width="100"
                    prop="fixedMaterials"
                    label="固定物料">
                    <template slot-scope="scope">
                      <div>{{scope.row.fixedMaterials?'固定物料':''}}</div>
                    </template>
                  </el-table-column>
                  <!-- 参考转化率 -->
                  <el-table-column
                    width="100"
                    prop="conversionRate"
                    label="参考转化率">
                  </el-table-column>
                  <!-- 默认损耗 -->
                  <el-table-column
                    prop="mlossRate"
                    label="默认损耗"
                    width="100">
                    <template slot-scope="scope">
                      <div class="loss">
                        <span>{{scope.row.mlossRate}}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!--关联商品款号-->
                  <el-table-column label="关联商品款号" width="160">
                    <template slot-scope="scope">
                      <div>{{styleNos}}
                      </div>
                    </template>
                  </el-table-column>
                  <!--这里就是循环动态添加的数据-->
                  <!--属性库动态字段-->
                  <el-table-column
                    v-for="(v,index) in tableData11"
                    :key="index"
                    :prop="v.prop"
                    :label="v.name"
                    width="100">
                    <template slot-scope="scope">
                      <p v-if="v.name === '缩率'">
                        <span>{{scope.row[v.prop]}}</span>
                        <span> %</span>
                      </p>
                      <p v-else>
                        <span>{{scope.row[v.prop]}}</span>
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    fixed="right"
                    width="95"
                    type="expand">
                    <template slot-scope="props">
                      <div>
                        <el-table
                          class="custom-table no-hover-highlight no-cell-padding"
                          :data="props.row.suppliers"
                          style="width: 100%">
                          <!-- 供应商 -->
                          <el-table-column
                            prop="supplierName"
                            width="200"
                            label="供应商">
                          </el-table-column>
                          <!-- 供应商款号 -->
                          <el-table-column
                            prop="supplierStyleNo"
                            width="200"
                            label="供应商款号">
                          </el-table-column>
                          <!-- 供应商色号 -->
                          <el-table-column
                            prop="supplierColorNo"
                            width="160"
                            label="供应商色号">
                          </el-table-column>
                          <!-- 参考单价 (元) -->
                          <el-table-column
                            prop="planCost"
                            width="200"
                            label="参考价【元/库存单位】">
                            <template slot-scope="scope">
                              <span v-if="scope.row.planCost">{{scope.row.planCost}}元/{{props.row.stockUnitName}}</span>
                            </template>
                          </el-table-column>
                          <!-- 不含税价 (元) -->
                          <el-table-column prop="excludingTaxPrice" label="不含税价【元/采购单位】">
                            <template slot-scope="scope">
                              <span v-if="scope.row.excludingTaxPrice">{{scope.row.excludingTaxPrice}}元/{{props.row.stockUnitName}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            fixed="right"
                            width="95"
                            prop="defaultFlag"
                            label="默认供应商">
                            <template slot-scope="scope">
                              <div><span class="orange" v-if="scope.row.defaultFlag">默认供应商</span></div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="pd24 box-shadow">
          <content-wrap title="附件">
            <upload-form
              from="material"
              :isMaterialEdit="true"
              :isEdit="true"
              :tableData="attachmentLists"
              :fileList="attachments"></upload-form>
          </content-wrap>
        </div>

        <nf-button class="delete-btn" @click="clickDelete">删除物料</nf-button>
      </div>
    </div>
    <!--删除确认框-->
    <el-dialog
      class="custom-dialog tip-dialog"
      :visible.sync="isDeleteVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">是否确认删除该物料？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDeleteVisible = false">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="comfirmDelete()">确认</el-button>
      </div>
    </el-dialog>
    <!--不能删除确认框-->
    <el-dialog
      class="custom-dialog tip-dialog"
      :visible.sync="canNotDeleteVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">{{delTip}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canNotDeleteVisible = false">确认</el-button>
      </div>
    </el-dialog>
    <!-- 编辑侧窗 -->
    <transition name="opcity">
      <div
        class="cover"
        @click='isShow1'
        v-if='isshow'>
      </div>
    </transition>

    <transition name="right-move">
      <add-material
        v-if='isshow'
        @cancel='cancel'
        @confirm="confirmMaterial"
        :title="title">
      </add-material>
    </transition>

    <!--//图片预览-->
    <imgPreview
      @dialogClose="centerDialogVisible=false"
      :centerDialogVisible="centerDialogVisible"
      :imgLists="imgLists"
      :imgIndex="imgIndex"></imgPreview>

    <!--驳回/反审核申请原因-->
    <el-dialog
      :title="detailInfo.reviewStatus==1?'驳回原因':'反审核申请原因'"
      class="custom-dialog tip-dialog"
      :visible.sync="reasonDialog"
      size="tiny">
      <div class="text-center">
        <el-input
          type="textarea"
          :rows="4"
          :placeholder="`请填写${detailInfo.reviewStatus==1?'驳回原因':'反审核申请原因'}`"
          v-model="reason">
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reasonDialog = false;reason = ''">取 消</el-button>
        <el-button
          :loading="btnLoading"
          type="warning"
          @click="taskReview(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  attachmentListNames,
  materialTaskUndoReview,
  materialsReview,
  materialTaskUndoStatus,
  materialTaskSubmit,
  materialsAntiReview,
  billReviewConfig,
  deleteMaterial //删除物料
} from "@/api/api";
import {
  materialDetails, //获取当前详情信息
} from "@/api/material";
import addMaterial from "./addMaterial.vue";
import uploadForm from '@/components/Common/uploadForm'; // 上传表格
export default {
  data() {
    return {
      delTip: '', //禁止删除提示
      attachments: [], // 其他上传
      attachmentLists: [],
      reason: '',
      reasonDialog: false,
      centerDialogVisible: false, //判断显示图片预览显示与隐藏
      imgLists: [],
      imgIndex: 0,
      title: "编辑物料",
      isshow: false, //判断侧窗显示和隐藏
      //   表格假数据
      tableData4: [], //表格数据
      tableData11: [], //动态表格数据
      isSaving: false, //删除确定按钮disabled禁用
      isDeleteVisible: false, //确定删除的弹框显示和隐藏
      canNotDeleteVisible: false, //不可删除的弹框显示和隐藏
      ruleForm: {
        kindId: "物料分类", //物料分类
        no: "物料款号", //物料款号
        name: "物料名称", //物料名称
      },
      detailsId: "", //详情必须的id
      // tableData_editor: [],//详情点击编辑传过去的数据
      styleNos: [], //显示在表格里的成衣服款号
      isConfig: false, //配置审核台
      detailInfo: {},
      btnLoading: false,
    };
  },
  created() {
    this.detailsId = this.$route.params.id; //保存物料档案详情id
    this.materialDetails(); //获取当前点击的详情信息
    this.getBillReviewConfig();
  },
  components: {
    uploadForm,
    addMaterial //侧窗组件
  },
  computed: {
    facId() {
      return JSON.parse(sessionStorage.getItem('user_login')).unitId;
    },
    userId() {
      return JSON.parse(sessionStorage.getItem('user_login')).userId;
    },
    unitId() {
      return JSON.parse(sessionStorage.getItem('last_login')).id
    },
  },
  methods: {
    materialTaskUndoReview(result) {
      this.btnLoading = true
      materialTaskUndoReview({
        result,
        id: this.detailInfo.id
      }).then(res => {
        this.btnLoading = false
        if (res.data.code === 0) {
          this.$message.success(res.data.msg)
          // 成功重新渲染数据
          this.materialDetails()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    taskReview(result) {
      // 同意 拒绝
      this.btnLoading = true
      const params = {
        taskId: this.detailInfo.taskId,
        message: this.reason,
        result,
        userId: this.userId,
        id: this.detailInfo.id,
        unitId: this.unitId
      }
      let api;
      if (this.detailInfo.reviewStatus == 2) {
        api = materialsAntiReview
        params.unitId = this.unitId
      } else {
        api = materialsReview
      }
      api(params).then(res => {
        this.btnLoading = false
        if (res.data.code === 0) {
          this.reasonDialog = false
          this.reason = ''
          this.$message.success(res.data.msg)
          // 成功重新渲染数据
          this.materialDetails()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    undo() {
      //撤回
      this.btnLoading = true;
      let para = {
        id: this.detailInfo.id,
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      };
      materialTaskUndoStatus(para).then(res => {
        this.btnLoading = false;
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          // 成功重新渲染数据
          this.materialDetails();
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    submit() {
      this.btnLoading = true
      //提报
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        id: this.detailInfo.id
      }
      materialTaskSubmit(params).then(res => {
        this.btnLoading = false
        if (res.data.code === 0) {
          this.$message.success(res.data.msg)
          // 成功重新渲染数据
          this.materialDetails()
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //是否有审核台
    getBillReviewConfig() {
      billReviewConfig({
        unitId: this.unitId
      }).then(res => {
        if (res.data.data.configs && res.data.data.configs.length > 0) {
          //是否有审核台
          this.isConfig = res.data.data.configs.some(v => v.billType == 'COMMON_MATERIALS')
        }
      })
    },
    listGo() {
      this.$store.dispatch('deleteVisitedView', this.$route);
      this.$router.back()
    },
    // 图片预览
    imgList(row) {
      this.imgIndex = 0;
      this.imgLists = row.commonMaterialsPictureList;
      this.centerDialogVisible = true;
    },
    // 点击遮罩层左侧关闭
    isShow1() {
      this.isshow = false;
    },
    // 取消侧窗遮罩
    cancel() {
      // this.tableData_editor = []
      this.tableData11 = []
      this.isshow = false;
    },
    // 点击确定，更新物料详情
    confirmMaterial() {
      // this.tableData_editor = []
      this.tableData11 = []
      this.isshow = false;
      this.materialDetails(); //点击取消从新获取当前点击的详情信息
    },
    // 进入编辑模式
    enterEdit() {
      // 判断是否有权限
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist.indexOf("fac.materials.update") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.isshow = true; //显示侧窗
    },
    // 确认删除物料
    comfirmDelete() {
      let params = {
        id: this.detailsId, //体系物料id（必须）
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id //当前用户id
      };
      deleteMaterial(params).then(res => {
        if (res.data.code == 0) {
          this.$message.success("删除成功");
          this.$router.push("/materialArchives");
        } else {
          this.delTip = res.data.msg;
          this.canNotDeleteVisible = true;
          this.isDeleteVisible = false;
        }
      });
    },
    //  判断删除物料是否有权限
    clickDelete() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist.indexOf("fac.materials.delete") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.isDeleteVisible = true;
    },
    // 获取当前点击详情信息
    materialDetails() {
      let params = {
        id: this.detailsId, //当前点击的物料id
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id //当前用户id
      };
      materialDetails(params).then(res => {
        this.$route.query.id = res.data.commonMaterials.commonMaterialsKindsId
        if (!res.data.commonMaterials.kindsName) {
          this.ruleForm.kindId = res.data.commonMaterials.kindsNo; //物料分类
        } else {
          this.ruleForm.kindId = res.data.commonMaterials.kindsName; //物料分类
        }
        this.detailInfo = res.data.commonMaterials
        if (res.data.commonMaterials.attachmentList.length) {
          this.attachmentLists = res.data.commonMaterials.attachmentList
        } else {
          let params = {
            userId: this.userId,
            type: 2
          }
          attachmentListNames(params).then(res => {
            if (res.data.code == 0) {
              let arr = []
              res.data.data.forEach(v => {
                if (v.code !== 'attachments') {
                  arr.push({
                    fileName: v.name,
                    code: v.code,
                    tag: v.tag
                  })
                }
              })
              this.attachmentLists = arr
            }
          })
        }

        this.attachments = res.data.commonMaterials.attachments
        this.ruleForm.no = res.data.commonMaterials.materialsNo; //物料款号
        this.ruleForm.name = res.data.commonMaterials.name; //物料名称
        this.ruleForm.reviewStatusText = res.data.commonMaterials.reviewStatusText; //审核状态
        this.ruleForm.reviewRemark = res.data.commonMaterials.reviewRemark; //审批备注
        for (let i = 0; i < res.data.commonMaterials.commonMaterialsSkuList.length; i++) {
          res.data.commonMaterials.commonMaterialsSkuList[i].mlossRate += "%"
          if (!res.data.commonMaterials.commonMaterialsSkuList[i].colorName) {
            res.data.commonMaterials.commonMaterialsSkuList[i].colorName = res.data.commonMaterials.commonMaterialsSkuList[i].colorValue
          }
          if (!res.data.commonMaterials.commonMaterialsSkuList[i].specificationsName) {
            res.data.commonMaterials.commonMaterialsSkuList[i].specificationsName = res.data.commonMaterials.commonMaterialsSkuList[i].specificationsNo
          }
        }
        // 详情数据代码
        this.tableData4 = res.data.commonMaterials.commonMaterialsSkuList;
        this.styleNos = res.data.commonMaterials.goodsStyleList.map((value, key, arr) => {
          return value.styleNo
        }).join('、')
        // 循环获取属性库的表头和值,最好把值传过编辑侧窗页面
        let index_List = 0
        this.tableData4.forEach((v, index) => {
          if (v.commonAttrstoreList) {
            v.commonAttrstoreList.forEach((v2, i) => {
              if (index_List == i) {
                v[v2.lable] = v2.attrValue
              }
              index_List++
            })
          }
          // 自定义字段处理
          if (v.customFieldList && v.commonAttrstoreList) {
            v.customFieldList.forEach(item => {
              v.commonAttrstoreList.forEach(info => {
                if (item.customFieldName === info.name) {
                  switch (item.customFieldType) {
                    case 'SINGLE_SELECT':
                      const arr1 = []
                      item.selectedOptions.forEach(info => {
                        arr1.push(info.optionName)
                      })
                      info.attrValue = arr1.join(',')
                      info.attrValueName = info.attrValue
                      break;
                    case 'MULTI_SELECT':
                      const arr2 = []
                      item.selectedOptions.forEach(info => {
                        arr2.push(info.optionName)
                      })
                      info.attrValue = arr2.join(',')
                      info.attrValueName = info.attrValue
                      break;
                    case 'INTEGER':
                      info.attrValue = item.numberValue
                      info.attrValueName = info.attrValue
                      break
                    case 'DECIMAL':
                      info.attrValue = item.numberValue
                      info.attrValueName = info.attrValue
                      break
                    case 'TEXT':
                      info.attrValue = item.textValue
                      info.attrValueName = info.attrValue
                      break
                  }
                }
              })
            })
          }
        })

        // 动态表格添加的方法
        let index = 0
        this.tableData4.forEach((el, i) => {
          if (el.commonAttrstoreList) {
            el.commonAttrstoreList.forEach((el2, j) => {
              if (index == j) {
                this.tableData11.push({
                  name: el2.name,
                  prop: 'propname' + j
                })
              }
              index++
              if (el2.type == 2) {
                el['propname' + j] = el.commonAttrstoreList[j].attrValueName;
              } else {
                el['propname' + j] = el.commonAttrstoreList[j].attrValue;
              }
            })
          }
        })
      });
    },
    tableRowClassName(row, index) {
      if (!row.suppliers.length) {
        return 'has-suppliers'
      } else {
        return ''
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.material-info {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .delete-btn {
    color: #fa4150;
    background-color: #fff;
    margin-top: 16px;
  }
}
</style><style lang="scss">
.material-info {
  .add-material-table {
    .el-table__expand-icon--expanded {
      transform: rotate(0);

      &.el-table__expand-icon:before {
        content: '收起供应商';
      }

      .el-icon {
        transform: rotate(90deg);
      }
    }

    .has-suppliers .el-table__expand-column .cell {
      display: none;
    }

    .el-table__expand-icon>.el-icon {
      left: 70px;
    }

    .el-table__expand-icon:before {
      content: '展开供应商';
      position: absolute;
      left: 0;
      top: 9px;
    }

    .el-table__expanded-cell {
      height: auto;
      overflow: hidden;
      padding: 0;
      background-color: #FAFBFC;

      .el-table__body-wrapper {
        padding-bottom: 12px;
      }

      .el-table {
        border: none;

        th .cell {
          background-color: #EBEFF5;
        }

        .el-table__row,
        .el-input__inner {
          background-color: #FAFBFC;
        }

      }
    }

    .el-table__body-wrapper {
      border: none;

      &>table>tbody>tr:last-child .el-table__expanded-cell {
        padding-bottom: 15px;
      }
    }
  }

}
</style>
