/*
 * @Author: kuhn 
 * @Description: 样板中心-设计工作台-设计档案 
 * @Date: 2019-05-21 09:48:01 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-21 16:47:27
 */

<template>
  <div class="design-file-info-index">
    <!-- 左侧检查必填的测弹窗 -->
    <transition name="right-move">
      <div class="check-detail" v-if="addDesignFileVisible">
        <!--<div class="mask" v-if="!item.required"></div>-->
        <div class="check-detail-item" style="padding-bottom: 12px;">检查项</div>
        <div
          class="check-detail-item"
          v-for="(item,index) in checkDetailList"
          :key="index">
          <div v-if="checkComponetList.indexOf(item.code)>-1">
            <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
            <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
          </div>
          <div
            :class="{'codeActive':checkCodeListData.indexOf(item.code)>-1}"
            @click="checkCodeListDataPush(item.code,row)"
            v-else
            style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</div>
          <div class="status">
            <icon
              style="margin-right: 4px;"
              w="20"
              h="20"
              :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
          </div>
        </div>
      </div>
    </transition>
    <plan-execute-work-panel v-if="$route.path=='/designWorkbench'" config-code="design_style"></plan-execute-work-panel>

    <section style="display:flex;width:100%;height:100%;flex-direction:column;">
      <page-title title="设计档案">
        <!--<nf-button-->
        <!--@click.native="openConfigFieldDialog">-->
        <!--配置提报必填-->
        <!--</nf-button>-->
        <nf-button @click.native="exportExcel">
          导出档案
        </nf-button>
        <nf-button @click.native="dialogVisibleExcel = true">
          从Excel导入
        </nf-button>
        <nf-button
          type="warning"
          svg="icon-btn-add"
          @click.native="clickskip">
          新建
        </nf-button>
      </page-title>
      <div>
        <!--筛选区-->
        <filter-form
          ref="filterForm"
          :checkDataList="checkDataList"
          :attrsData="attrsData"
          :selectPersonList="selectPersonList"
          @on-filter="handleFilterMission">
        </filter-form>
        <!-- 批量提报、作废、恢复 -->
        <div style="margin:8px 0;">
          <nf-button
            class="action-btn"
            v-for="(item,index) in btnList"
            :key="index"
            @click="openStatusDialog(item.type)">{{item.name}}
          </nf-button>
          <nf-button class="action-btn" @click="printDesign">打印</nf-button>
          <nf-button class="action-btn" @click="renumber">重编号</nf-button>
        </div>
        <el-table
          class="custom-table"
          @sort-change="sortChange"
          v-loading="loading"
          :data="tableData"
          border
          ref="tableContent"
          @select="select"
          @select-all="selectAll"
          style="width: 100%;">
          <el-table-column type="selection" width="55px">
          </el-table-column>
          <el-table-column
            :prop="title.code"
            :sortable="['商品款号','设计款号','商品名称'].indexOf(title.name) > -1?'custom':false"
            min-width="120px"
            v-for="title in listTitle"
            :key="title.name"
            :label="title.name">
            <template slot-scope="scope">
              <div v-if="title.name === '设计状态'">
                <span :class="{
                                  'txt-color':scope.row.styleStatus == 3,
                                  'txt-green':scope.row.styleStatus == 2,
                                  'txt-red':scope.row.styleStatus == 1,
                                  'txt-blue':scope.row.styleStatus == 0
                              }">{{styleStatusMap[scope.row.styleStatus]}}</span>
              </div>
              <div v-else-if="title.name === '检查项'">
                <div style="display: flex;align-items: center;">
                  {{scope.row.alreadyRequiredNum}}/{{scope.row.requiredNum}}
                  <icon
                    @click="showCheckDetail(scope.row)"
                    style="cursor: pointer !important;margin-left: 4px;"
                    w="12"
                    h="12"
                    type="icon-details"></icon>
                </div>
              </div>
              <div v-else-if="title.name === '商品状态'">
                <div>{{scope.row.goodsStatus.split('\n')[0]}}</div>
                <div>{{scope.row.goodsStatus.split('\n')[1]}}</div>
              </div>
              <div v-else-if="title.name === '设计图'">
                <div style="display: flex;padding: 5px 0;align-items: flex-end;">
                  <img @click="previewPic(scope.row.designPics)"
                                         style="width: 48px;height: 48px;cursor: pointer; display:block;"
                                         v-if="scope.row.designPics.length"
                                         :src="scope.row.designPics[0]" alt="">
                  <div v-else>
                    <input type="file" style="display: none;" :id="`file-upload1${scope.$index}`"
                                               accept="image/png,image/jpeg,image/jpg,image/gif"
                                               @change="imgUpload($event,scope.row,'designPics')">
                    <label class="upload-file" :for="`file-upload1${scope.$index}`">点击上传</label>
                  </div>
                </div>
              </div>
              <div v-else-if="title.name === '样衣图'">
                <div style="display: flex;padding: 5px 0;align-items: flex-end;">
                  <img @click="previewPic(scope.row.samplePics)"
                                         style="width: 48px;height: 48px;cursor: pointer;"
                                         v-if="scope.row.samplePics.length"
                                         :src="scope.row.samplePics[0]" alt="">
                  <div v-else>
                    <input type="file" style="display: none;" :id="`file-upload2${scope.$index}`"
                                               accept="image/png,image/jpeg,image/jpg,image/gif"
                                               @change="imgUpload($event,scope.row,'samplePics')">
                    <label class="upload-file" :for="`file-upload2${scope.$index}`">点击上传</label>
                  </div>
                </div>
              </div>
              <div v-else-if="title.name === '版师'">
                <span :class="[scope.row.machinist&&scope.row.machinist.name ? '': 'txt-color']">{{scope.row.machinist&&scope.row.machinist.name || '未分配'}}</span>
              </div>
              <div v-else-if="title.name === '打版状态'">
                <span :class="[scope.row.existAttachmentFile ? '': 'txt-color']">{{scope.row.existAttachmentFile? '有打版文件': '无打版文件'}}</span>
              </div>
              <div v-else-if="title.name === '样衣师'">
                <span :class="[scope.row.sampleDesigner&&scope.row.sampleDesigner.name ? '': 'txt-color']">{{scope.row.sampleDesigner&&scope.row.sampleDesigner.name || '未分配'}}</span>
              </div>
              <div v-else-if="title.name === '样衣状态'">
                <span :class="[scope.row.existSample ? '': 'txt-color']">{{scope.row.existSample? '有样衣': '无样衣'}}</span>
              </div>
              <div v-else-if="title.name === '商品描述'">
                <span :class="[scope.row.existGoodsDescribe ? '' : 'txt-color']">{{scope.row.existGoodsDescribe? '已填写' : '未填写'}}</span>
              </div>
              <div v-else-if="title.name === '被驳回'">
                <div v-if="scope.row.backName">
                  <div>{{scope.row.backName}}:{{scope.row.backRemark}}</div>
                  <div>{{scope.row.backDate}}</div>
                </div>
              </div>
              <div v-else-if="title.code&&title.code.indexOf('customField_')>-1">
                <div>{{scope.row.customFields[title.id]?scope.row.customFields[title.id].cloumnText:''}}</div>
              </div>
              <div v-else>
                <span>{{scope.row[title.code]}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="125px">
            <template slot-scope="scope">
              <div style="display:flex;justify-content:space-between;">
                <el-dropdown>
                  <el-button style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">
                    编辑
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item,index) in editComponetList"
                      :key="index"
                      @click.native="editOpenDialog(item.type, scope.row)">
                      {{item.name}}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div @click="handleInfoClick(scope.row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;">
                  查看详情
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="page-pagination">
          <el-pagination
            :total="totalCount"
            @current-change="loadingMore"
            :page-size="20"
            layout="total, prev, pager, next">
          </el-pagination>
        </div>
      </div>
      <!--//图片预览-->
      <imgPreview
        @dialogClose="picView=false"
        :centerDialogVisible="picView"
        :imgLists="picList"
        :imgIndex="i"></imgPreview>
      <!--上传表格弹窗-->
      <UploadExcelComponent
        :excelStatic="excelStatic"
        excelDemoUrl="designFileTemplate"
        @uploadFinish="uploadFinish"
        @commit="commitExcelData"
        @reset="closeUploadComponent"
        :dialogVisibleExcel="dialogVisibleExcel">
      </UploadExcelComponent>
    </section>

    <!--新建弹窗-->
    <!-- <sideslip :addDesignFileVisible.sync="addDesignFileVisible" @success="getDesignList"></sideslip> -->
    <transition name="right-move">

      <component
        :is="currentTabComponent"
        v-if="addDesignFileVisible"
        :show.sync="addDesignFileVisible"
        @success="getDesignList"
        :isEdit="isEdit"
        :designStyleId="designStyleId"
        :title="bomTitle"
        :styleId="styleId"
        ref="currentComponentForCheck"
        :checkDetailLists="checkDetailLists"
        :checkDesignDetailList='checkDesignDetailList'
        :designId="designStyleId"
        :type="type"
        :checkCodeListData="checkCodeListData"
        @cancel="changeArtList"
        @toggle="changeArtList"
        :artData.sync='artData'
        :editId="editId"
        :sampleId="sampleId"
        :designNo="designStyleNo">
      </component>

    </transition>
    <transition name="opcity">
      <div
        style="z-index:10 !important;"
        class="cover"
        v-if="addDesignFileVisible"
        @click="addDesignFileVisible = false"></div>
    </transition>
    <!-- 提报的弹窗 -->
    <select-design-dialog
      :show.sync="selectDesignDialogVisible"
      @save="saveForward"
      :loading.sync="saveBtnLoading"></select-design-dialog>
    <!-- 提报、作废、恢复弹窗 -->
    <el-dialog
      class="custom-dialog tip-dialog"
      :visible.sync="selectDialoVisible"
      :show-close="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="remark">{{text}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDialoVisible = false" v-if="tipshow">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="confirm"
          v-if="tipshow">确认</el-button>
        <el-button @click="selectDialoVisible = false" v-else>好的</el-button>
      </div>
    </el-dialog>
    <!-- 编辑列表弹窗 -->
    <el-dialog
      class="tip-dialog edit-dialog"
      :visible.sync="editListShow"
      :show-close="false"
      @close="editListShowNone"
      width="50%"
      :modal-append-to-body="false">
      <div slot="title">{{editTitle}}</div>
      <ul class="content" v-if="selectType != 'attachment'&&selectType != 'planCostAccounting'">
        <li @click="selectEditDiolog('add')">+新建</li>
        <li v-for="(item,index) in list" :key="index">
          <div>{{item.name}}</div>
          <div @click="selectEditDiolog('edit', item)">
            <icon type="icon-edit"></icon>
            编辑
          </div>
        </li>
      </ul>
      <div v-else>
        <patternTable
          v-if="selectType === 'attachment'"
          :dialogVisiblePMFile.sync="dialogVisiblePMFile"
          :dialogVisibleDelete.sync="dialogVisibleDelete"
          :loading="fileLoading"
          :tableData="list"
          @commit="uploadPMFile"
          :deleteFileId.sync="deleteFileId"
          :reUploadFile.sync="reUploadFile"></patternTable>
        <costAccounting
          @rowDelete="rowDelete"
          @rowSampleSetDefault="rowSampleSetDefault"
          @dialogOperationUpdatePrice="dialogOperationUpdatePrice"
          @dialogOperation="isUpdateDefaultVisible=false"
          ref="costAccountingRef"
          v-if="selectType === 'planCostAccounting'"
          :designId="designStyleId"></costAccounting>
        <!-- 左侧检查必填的测弹窗 -->
        <transition name="right-move">
          <div class="check-detail" style="left: -150px;">
            <!--<div class="mask" v-if="!item.required"></div>-->
            <div class="check-detail-item" style="padding-bottom: 12px;">检查项</div>
            <div
              class="check-detail-item"
              v-for="(item,index) in checkDetailList"
              :key="index">
              <div v-if="checkComponetList.indexOf(item.code)>-1">
                <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
                <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
              </div>
              <div
                :class="{'codeActive':checkCodeListData.indexOf(item.code)>-1}"
                @click="checkCodeListDataPush(item.code,row)"
                v-else
                style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</div>
              <div class="status">
                <icon
                  style="margin-right: 4px;"
                  w="20"
                  h="20"
                  :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </el-dialog>
    <!-- 上传图片 -->
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="dialogVisibleDelete"
      :before-close="handleClose">
      <span>确定要删除文件？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDelete = false">取 消</el-button>
                <el-button type="primary" @click="deletePMFile">确 定</el-button>
            </span>
    </el-dialog>

    <!--配置可编辑字段弹窗-->
    <!--<node-dialog-->
    <!--ref="nodeDialog"-->
    <!--:show.sync="configFieldShow"-->
    <!--:list.sync="editList"-->
    <!--from="designIndex"-->
    <!--:selectedArr="selectedArr"-->
    <!--@commitList="commitList">-->
    <!--</node-dialog>-->
    <!--配置可编辑字段提示弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog is-submit-dialog"
      :visible.sync="designFieldVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">有未填写的必填信息，无法提报！请完善设计档案。</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="designFieldVisible = false">好 的</el-button>
      </div>
    </el-dialog>
    <!--检查项详情-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog check-detail-dialog"
      title="检查项详情"
      :visible.sync="checkDetailVisible"
      size="tiny">
      <div
        class="check-detail-dialog__body"
        v-for="(item,index) in checkDetailList"
        :key="index">
        <!--<div class="mask" v-if="!item.required"></div>-->
        <!--<div>-->
        <span v-if="checkComponetList.indexOf(item.code)>-1" >
                       <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
        <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
        </span>
        <span @click="designEditOpenDialog(item.code, row)" v-else style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</span>
        <span class="status">
                        <icon
                          style="margin-right: 4px;"
                          w="20"
                          h="20"
                          :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
                    </span>
        <!--</div>-->
      </div>

      <div slot="footer">
        <el-button type="primary" @click="checkDetailVisible = false">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--重编号失败弹窗-->
    <div class="dialog-wrap">
      <el-dialog
        :modal-append-to-body="false"
        class="custom-dialog check-detail-dialog"
        title="重编号"
        :close-on-click-modal="false"
        :visible.sync="tipTextShow"
        width="30%">
        <div
          class="renumber-detail-dialog__body"
          v-for="(item,index) in tipTextList"
          :key="index">
          <div class="number">编号失败！</div>
          <div>
            {{item.split(';')[0]}}:
            <span style="color:rgb(28, 161, 255);text-decoration: underline;cursor: pointer;" @click="goDesignDetail(item.split(';')[item.split(';').length - 1])">{{item.split(';')[1]}}</span>
          </div>
          <div>{{item.split(';')[2]}}</div>
        </div>
        <div slot="footer">
          <el-button type="primary" @click="tipTextShow = false">确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--重编号选择弹窗-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog check-detail-dialog"
      title="全选-选项"
      :visible.sync="renumberShow"
      size="tiny">
      <div class="titleSelClass">
        <el-radio-group v-model="radio" @change="currentPageChange">
          <el-radio :label="1" style="display: block">当前页已选项</el-radio>
          <el-radio :label="2" style="display: block">所有匹配选项</el-radio>
        </el-radio-group>
        <p style="color: red">请选择其中一项后点击确定</p>
      </div>
      <div slot="footer">
        <el-button @click="renumberShow = false;radio = null">取 消
        </el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="reNumberCommit">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--侧滑窗数据改变弹窗-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      :show-close="false"
      :visible.sync="checkCodeDataChangeDialog"
      size="tiny">
      <div class="dialog-content-wrap">
        <div style="text-align: center;">
          <icon
            w="80"
            h="80"
            type="icon-gongdan-jiedianjingbao-da"></icon>
          <p style="margin-top: 10px;">是否要保存当前修改的信息？</p>
        </div>

      </div>
      <div slot="footer">
        <nf-button @click="cancelUpdateCheckData">取 消</nf-button>
        <nf-button type="warning" @click="sureUpdateCheckData">确 定</nf-button>
      </div>
    </el-dialog>
    <!-- 设为默认窗口 -->
    <el-dialog
      class="custom-dialog"
      :title="dialogTitle"
      :visible.sync="isUpdateDefaultVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text" style="margin-top: 10px;">{{dialogText}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="dialogType !== 'updatePrice'">
          <el-button @click="isUpdateDefaultVisible = false">取 消</el-button>
          <el-button type="primary" @click="$refs['costAccountingRef'].dialogSureGo()">确认</el-button>
        </div>
        <div v-if="dialogType === 'updatePrice'">
          <el-button @click="isUpdateDefaultVisible = false;$refs['costAccountingRef'].getList()">不更新</el-button>
          <el-button type="primary" @click="$refs['costAccountingRef'].dialogSureUpdateGo">更新</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
import UploadExcelComponent from '@/components/Common/uploadExcel.vue';
import FilterForm from './filter-form';
import CreateDesignFile from '@/components/designFile/designFileInfo/create-design-file.vue';
import config from "@/config/index";
import selectDesignDialog from './selectDesignDialog'
import CreateBomTable from "../../goods/goodsBom/CreateBomTable.vue";
import addClothes from '../clothesFile/addClothes'
import addArt from '../technicsInfo/addArt'
import procedureCreate from '../procedure/create'
import patternTable from '../patternMakingFile/components/patternTable'
import PMFileUpload from '../patternMakingFile/components/PMFileUpload'
import PlanExecuteWorkPanel from "@/components/goodsPlan/procurementPlan/list/components/planExecuteWorkPanel.vue";
import {
  getFacUnitSettings,
  designstylePage,
  importDesignFileSupExcel,
  getUploadToken,
  upDetailImgs,
  sampleCreatePicture,
  addDesignPicture,
  forward,
  designstyleListEdit,
  patternMakingUpdate,
  patternMakingDelete,
  patternMakingUpload,
  facTemplates,
  getCheckData,
  getRequiredDetail,
  isExistGenerateStyleNoList,
  updateDesignStyleNos,
  getRequireDesignCode,
  getTitleShowConfig,
} from '@/api'

import {
  // targetField,
  getDesignDialogFields,
  // updateDesignDialogFields,
  checkOnForward,
} from '@/api/sample-centre';

import {
  exportExcelSplDesignStyle,
} from "@/api/material.js";
import costAccounting from "@/components/designFile/costAccounting"
// import nodeDialog from "@/components/sampleCentre/design/component/nodeDialog";

export default {
  name: "index",
  props: [],
  data() {
    return {
      sampleSetDefaultId: '',
      sampleSetDefaultName: '',
      dialogType: '',
      dialogTitle: '',
      dialogText: '',
      isUpdateDefaultVisible: false,

      positionCode: '',
      willGoType: '',
      willGoRow: {},
      checkCodeDataChangeDialog: false,
      addDesignFileVisibleAttachment: false,
      checkCodeListData: [], //检查项点击列表
      btnLoading: false,
      checkDataList: [], //检查项筛选列表
      checkDetailList: [], //检查项详情列表
      checkDetailLists: [], //检查项详情列表,然后传过去给编辑页面
      checkDesignDetailList: {}, //设计款号必填项
      checkDetailVisible: false,
      picList: [{
        path: ''
      }], //预览图片的数组
      i: 0, //预览图片的index
      picView: false,
      loading: false,
      saveBtnLoading: false,
      isSaving: false,
      totalCount: 0,
      attrsData: {},
      tableData: [],
      selectPersonList: [],
      selectData: [], // 勾选的数据
      filterParams: {
        orderBy: 0,
        generateGoods: null,
        // styleIds: [],
        styleStatus: [],
        // attrIds: [],
        // sampleDesignerIds: [],
        // sampleMachinistIds: [],
        // goodsStyleNos: [],
        status: [],
        unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
        pageNo: 1,
        // dateCreatedStart: '',
        // dateCreatedEnd: '',
        existSample: null, // 样衣状态
        existGoodsRemark: null, // 商品描述
        existAttachmentFile: null
      },
      dialogVisibleExcel: false,
      excelStatic: {
        loading: false,
        excelData: true,
        excelDataErr: 0,
        excelDataSucc: 0,
        failureId: ''
      },
      styleStatusMap: {
        0: '设计中',
        1: '已作废',
        2: '已完成',
        3: '未提报'
      },
      excelDemoUrl: "https://image3.myjuniu.com/50ffcf88a78942e3845024e89980b73e_dev_38ac744e77b76b3a4ce7471444d6a50f.xlsx?attname=设计档案导入模板.xlsx",
      addDesignFileVisible: false,
      isEdit: false,
      designStyleId: '',
      btnList: [{
        name: '提报',
        type: 'forward'
      }, {
        name: '作废',
        type: 'eliminate'
      }, {
        name: '恢复',
        type: 'regain'
      }],
      editOpenDialogCode: '',
      checkComponetList: ['bom', 'typing_file', 'sample_info', 'process_form', 'default_prcd_template', 'planCostAccounting'], //检查项是BOM 打板文件 样衣信息 工艺信息 工序模板时
      editComponetList: [{
          name: '编辑设计信息',
          type: 'design'
        },
        {
          name: '编辑BOM信息',
          type: 'bom'
        },
        {
          name: '编辑打版文件',
          type: 'attachment'
        },
        {
          name: '编辑样衣档案',
          type: 'sample'
        },
        {
          name: '编辑工艺信息',
          type: 'pdf'
        },
        {
          name: '编辑工序模板',
          type: 'template'
        }
      ],
      curType: '',
      selectDialoVisible: false,
      selectDesignDialogVisible: false, // 提报弹窗
      tipshow: true,
      text: '',
      currentTabComponent: '',
      list: [], // 编辑的列表
      editListShow: false,
      editTitle: '',
      artData: {}, // 样衣
      bomTitle: '',
      editId: '', // 工艺id
      sampleId: '', //样衣id
      styleId: '',
      selectType: '',
      type: '', //bom编辑的标示
      dialogVisiblePMFile: false,
      dialogVisibleDelete: false,
      deleteFileId: '',
      reUploadFile: '',
      fileLoading: false,
      row: {},
      designStyleNo: '',
      defaultTemplateId: '',
      // configFieldShow: false,
      editList: [], //可配置必填信息
      designFieldVisible: false, //配置可编辑字段提示弹窗
      forwardNeed: false, //提报必填校验是否通过
      autoNumberDesign: false, // 是否配置了自定义规则
      renumberShow: false, // 重编号弹窗
      radio: null, // 重编号
      tipTextList: [], // 重编号失败提示语
      tipTextShow: false, // 重编号失败提示弹窗
      listTitle: [],
      static: true, //页面加载初始状态
    }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    facId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    },
    permissionList() {
      return JSON.parse(sessionStorage.getItem("user_login")).permissionList
    },
    isWorkBench() {
      return this.$route.path == '/designWorkbench'
    },
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    },
  },
  watch: {
    'addDesignFileVisible'(val) {
      if (val) {
        this.checkDetailVisible = false;
        this.addDesignFileVisibleAttachment = false;
        this.editListShow = false
      } else {
        this.currentTabComponent = '';
        this.checkCodeListData = [];

      }
    }
  },
  components: {
    FilterForm,
    UploadExcelComponent,
    CreateDesignFile,
    selectDesignDialog,
    CreateBomTable, // bom
    addClothes, // 样衣
    addArt, // 工艺
    procedureCreate, // 工序
    patternTable, // 打版文件
    costAccounting, // 计划核算
    PMFileUpload,
    PlanExecuteWorkPanel,

  },
  async mounted() {
    if (this.static) {
      this.static = false
      this.fetchFacUnitSettings();
      await this.getTitle()
      await this.getCheckDataList()
      this.$refs.filterForm.submit()
    }
    this.getRequiredDetail()
    // this.$refs.filterForm.submit()
    this.getFacTemplates()
    this.isExistGenerateStyleNoList()

  },
  async created() {

  },
  async activated() {
    // this.fetchFacUnitSettings();
    // await this.getTitle()
    // this.getDesignList()
    // this.getCheckDataList()
    if (this.static) {
      this.fetchFacUnitSettings();
      await this.getTitle()
      this.getDesignList()
      this.getCheckDataList()
    } else {
      this.static = true
    }
  },
  methods: {
    //计划核算子组件触发事件
    rowDelete(row) {
      this.isUpdateDefaultVisible = true;
      this.dialogType = 'delete';
      this.dialogTitle = '删除核算单';
      this.dialogText = '是否确认删除该核算单' + row.name;
    },
    dialogOperationUpdatePrice(name) {
      this.dialogType = 'updatePrice';
      this.dialogTitle = '更新成本信息';
      this.dialogText = '是否将' + name + '的总成本，更新到设计档案的计划成本价？';
    },
    rowSampleSetDefault(id, name) {
      this.isUpdateDefaultVisible = true;
      this.sampleSetDefaultId = id;
      this.sampleSetDefaultName = name;
      this.dialogType = 'default';
      this.dialogTitle = '设为默认';
      this.dialogText = '是否将' + name + '设置为默认核算单？';
    },
    // 获取设计档案表头
    getTitle() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        const params = {
          userId: this.userId,
          splDesignPrcdNodeId: 'style',
          unitId: this.facId,
        }
        return getTitleShowConfig(params).then(res => {
          if (res.data.code == 0) {
            this.listTitle = res.data.data.config
            this.$nextTick(() => {
              console.log('重新布局???')
              this.$refs.tableContent.doLayout()
            })
            resolve()
          }
        })
      })

    },
    //导出档案
    exportExcel() {
      let params = {
        ...this.filterParams
      };
      exportExcelSplDesignStyle(params).then(res => {
        this.fileData = res.data;
        //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
        //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        let url = window.URL.createObjectURL(res.data);
        let a = window.document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', '设计档案.xls');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    },
    // 设计档案新建和编辑
    getSuccess() {
      this.getDesignList()
      // this.getTargetField()
    },
    sortChange(obj) {
      if (obj.prop == 'designStyleNo') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 1
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 4
        }
      } else if (obj.prop == 'goodsName') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 2
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 5
        }
      } else if (obj.prop == 'goodsStyleNo') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 3
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 6
        }
      } else {
        this.filterParams.orderBy = 0
      }
      this.getDesignList()
    },
    //获取检查项筛选
    getCheckDataList() {
      return new Promise((resolve, reject) => {
        getCheckData({
          unitId: this.facId
        }).then(res => {
          this.checkDataList = res.data.data
          resolve()
        })
      })
    },
    //查看检查项详情
    showCheckDetail(item, notOpenDialog) {
      this.designStyleId = item.id;
      this.styleId = item.id;
      this.row = item;
      const params = {
        designStyleId: item.id,
        unitId: this.facId
      }
      getRequiredDetail(params).then(res => {
        this.checkDetailList = res.data.data
      })
      if (notOpenDialog) return;
      this.checkDetailVisible = true
    },
    //提报检测必填
    async checkForwardNeed(data) {
      let styleIds = [];
      data.forEach(item => {
        styleIds.push(item.id)
      });
      const params = {
        unitId: this.facId,
        styleIds: styleIds
      };
      await checkOnForward(params).then(res => {
        if (res.data.code == 0) {
          this.forwardNeed = true;
        } else {
          this.designFieldVisible = true;
          this.forwardNeed = false;
        }
      })
    },

    // 取消弹窗
    cancel(res) {
      this.addDesignFileVisible = res;
      this.getDesignList()
    },
    // 打版文件 上传和删除
    uploadPMFile(fileList) {
      let params = {
        fileFullName: fileList[0].fileFullName,
        fileName: fileList[0].fileName,
        path: fileList[0].filePath,
        suffix: fileList[0].suffix,
      }
      if (this.reUploadFile) {
        params.id = this.reUploadFile.id
        params.fileCode = this.reUploadFile.fileCode
        params.version = this.reUploadFile.version
      } else {
        params.designStyleId = this.row.id
      }
      params.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
      if (this.reUploadFile) {
        patternMakingUpdate(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            // this.getList()
            this.designstyleListEdit('attachment', this.row)
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }

        })
      } else {
        patternMakingUpload(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            this.designstyleListEdit('attachment', this.row)
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    deletePMFile() {
      patternMakingDelete(this.deleteFileId).then(res => {
        this.dialogVisibleDelete = false
        this.reUploadFile = ''
        this.deleteFileId = ''
        if (res.data.code === 0) {
          this.designstyleListEdit('attachment', this.row)
          this.$message.info(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 打板文件弹窗关闭检测必填项
    editListShowNone() {
      if (this.selectType === 'attachment') {
        this.showCheckDetail(this.row, true)
      }
    },

    //取消更新
    cancelUpdateCheckData() {
      this.checkCodeDataChangeDialog = false;
      if (this.willGoRow.id) {
        this.editOpenDialog(this.willGoType, this.willGoRow)
      } else {
        this.$message.error('请先新建设计档案')
      }
    },
    //确定更新
    async sureUpdateCheckData() {
      let value = false;
      this.checkCodeDataChangeDialog = false;
      //更新检查项
      if (this.currentTabComponent === 'CreateBomTable') {
        //bom表确定更新
        value = await this.$refs['currentComponentForCheck'].determine();

      } else if (this.currentTabComponent === 'addArt') {
        //工艺单确定更新
        value = await this.$refs['currentComponentForCheck'].updateCommonProcessForm();

      } else if (this.currentTabComponent === 'addClothes') {
        //样衣
        value = await this.$refs['currentComponentForCheck'].updateCommonProcessForm();
      } else if (this.currentTabComponent === 'procedureCreate') {
        //工序模板
        value = await this.$refs['currentComponentForCheck'].submit();
      } else if (this.currentTabComponent === 'CreateDesignFile') {
        //设计档案
        value = await this.$refs['currentComponentForCheck'].addFile(0);
        console.log(typeof (value));
        if (value.id) {
          this.editOpenDialog(this.willGoType, value)
          return
        }

      }
      if (!value) return;
      if (this.willGoType === 'attachment') {
        this.addDesignFileVisibleAttachment = true;
      }
      this.editOpenDialog(this.willGoType, this.willGoRow)
    },
    // 编辑
    async notDesignEditOpenDialog(type, row) {
      if (type === 'planCostAccounting') {
        if (!row.designStyleNo) {
          this.willGoType = type;
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
          return
        }
        this.$route.query.designStyleId = row.designStyleId;
        this.selectType = 'planCostAccounting';
        this.editTitle = `编辑【${row.designStyleNo}】计划成本核算`;
        this.editListShow = true
        return
      }
      switch (type) {
        case 'typing_file':
          type = 'attachment';
          break;
        case 'sample_info':
          type = 'sample';
          break;
        case 'process_form':
          type = 'pdf';
          break;
        case 'default_prcd_template':
          type = 'template';
          break;

      }
      if ((this.currentTabComponent === 'CreateDesignFile' && type !== 'attachment') || (type !== 'bom' && this.currentTabComponent === 'CreateBomTable') || (type !== 'sample' && this.currentTabComponent === 'addClothes') || (type !== 'pdf' && this.currentTabComponent === 'addArt') || (type !== 'template' && this.currentTabComponent === 'procedureCreate')) {
        //侧滑窗离开bom
        let flag = await this.$refs['currentComponentForCheck'].checkIsChange();
        console.log(flag);
        if (!flag) {
          //数值没改变过
          this.editOpenDialog(type, row)
        } else {
          this.willGoType = type;
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
          return
        }

      } else if ((type === 'bom' && this.currentTabComponent === 'CreateBomTable') || (type === 'sample' && this.currentTabComponent === 'addClothes') || (type === 'pdf' && this.currentTabComponent === 'addArt') || (type === 'template' && this.currentTabComponent === 'procedureCreate')) {
        //点击相同侧滑窗
        return
      } else {
        //新建设计档案的时候切换到打板文件
        if (this.currentTabComponent === 'CreateDesignFile' && type === 'attachment') {
          this.willGoType = type;
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
          return
        }
        //第一次进入侧滑窗
        this.editOpenDialog(type, row)
      }

    },
    //设计信息点击
    designEditOpenDialog(code, row) {
      // this.editOpenDialogCode = code
      this.checkCodeListData.push(code)
      this.positionCode = code;
      this.editOpenDialog('design', row)
    },
    //设计信息点击（切换
    async checkCodeListDataPush(code, row) {
      if (this.checkCodeListData.indexOf(code) === -1) {
        this.checkCodeListData.push(code)
      }
      this.positionCode = code;

      if (this.editListShow && this.selectType === 'attachment') {
        this.editOpenDialog('design', row)
        return
      }

      if (this.currentTabComponent !== 'CreateDesignFile') {
        //侧滑窗切换到CreateDesignFile
        let flag = await this.$refs['currentComponentForCheck'].checkIsChange();
        console.log(flag);
        if (!flag) {
          //数值没改变过
          this.currentTabComponent = 'CreateDesignFile'
          this.$nextTick(function () {
            this.$refs['currentComponentForCheck'].goPosition(this.positionCode);

          })
        } else {
          this.willGoType = 'design';
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
        }
      } else {
        this.$refs['currentComponentForCheck'].goPosition(code);
      }
    },
    async editOpenDialog(type, row) {
      //获取检查项
      await this.showCheckDetail(row, true)
      // 获取设计款号必填项
      this.designStyleId = row.id
      await this.getRequireDesignCode()

      if (type != 'design') {
        await this.designstyleListEdit(type, row)
      }
      if (type == 'design') {
        // 权限
        if (!this.powerJudgement.permissions("fac.spl.design.style.edit")) {
          return
        }
        this.isEdit = true
        this.addDesignFileVisible = true
        this.currentTabComponent = 'CreateDesignFile'

        this.$nextTick(function () {
          this.$refs['currentComponentForCheck'].goPosition(this.positionCode);

        })
      }
    },
    // 获取编辑列表
    designstyleListEdit(type, row) {
      this.row = row
      let params = {
        userId: this.userId,
        type: type,
        designStyleId: row.id
      }
      this.fileLoading = true
      designstyleListEdit(params).then(res => {
        this.list = res.data.data
        // console.log(this.list);
        this.designStyleId = row.id
        if (type == 'attachment') {
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.style.templete.list") && !this.isWorkBench) {
            return
          }
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.list") && this.isWorkBench) {
            return
          }
          this.selectType = type
          this.editTitle = `编辑【${row.designStyleNo}】打版文件`
          this.editListShow = true
        } else if (type === 'planCostAccounting') {

          this.selectType = 'planCostAccounting';
          this.editTitle = `编辑【${row.designStyleNo}】计划成本核算`;
          this.editListShow = true
          return
        } else {
          if (this.list.length == 0) {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")) {
                  return
                }
                this.bomTitle = '新建BOM表'
                this.styleId = '2c1f2e0fd03448ea8a9a86d5d7984f1f'
                this.type = ''
                this.currentTabComponent = 'CreateBomTable'
                break;
              case 'sample': // 样衣
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
                  return
                }
                this.artData = {}
                // console.log(row.sampleId, 'row.designStyleNo')
                this.designStyleNo = row.designStyleNo
                this.sampleId = ''
                this.currentTabComponent = 'addClothes'
                break;
              case 'pdf': // 工艺
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.add")) {
                  return
                }
                this.artData = {}
                this.styleId = this.designStyleId
                this.currentTabComponent = 'addArt'
                break;
              case 'template': // 工序
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.add")) {
                  return
                }
                this.editId = ''
                this.currentTabComponent = 'procedureCreate'
                break;
            }
            this.addDesignFileVisible = true
          } else if (this.list.length == 1) {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
                  return
                }
                this.bomTitle = '编辑BOM表'
                this.type = 'editor1'
                this.editId = this.list[0].id
                this.styleId = this.designStyleId
                this.currentTabComponent = 'CreateBomTable'
                break;
              case 'sample': // 样衣
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
                  return
                }
                this.sampleId = this.list[0].id
                this.styleId = this.designStyleId
                this.designStyleNo = this.list[0].name
                this.currentTabComponent = 'addClothes'
                break;
              case 'pdf': // 工艺
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
                  return
                }
                this.artData = {
                  id: this.list[0].id
                }
                this.currentTabComponent = 'addArt'
                break;
              case 'template': // 工序
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
                  return
                }
                this.editId = this.list[0].id
                this.currentTabComponent = 'procedureCreate'
                break;
            }
            this.addDesignFileVisible = true
          } else {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】BOM表`
                break;
              case 'sample':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】样衣档案`
                break;
              case 'pdf':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】工艺单信息`
                break;
              case 'template':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】工序模板`
                break;
            }
            this.selectType = type
            this.editListShow = true
          }
        }
        this.fileLoading = false
      })
    },
    // 弹窗的新建、编辑
    selectEditDiolog(status, row) {
      if (status == 'add') {
        switch (this.selectType) {
          case 'bom':
            // 权限
            if (!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")) {
              return
            }
            this.bomTitle = '新建BOM表'
            this.styleId = '2c1f2e0fd03448ea8a9a86d5d7984f1f'
            this.type = ''
            this.currentTabComponent = 'CreateBomTable'
            break;
          case 'sample':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
              return
            }
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
              return
            }
            this.artData = {}
            this.sampleId = ''
            this.designStyleNo = this.row.designStyleNo
            this.currentTabComponent = 'addClothes'
            break;
          case 'pdf':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.process.add")) {
              return
            }
            this.artData = {}
            this.styleId = this.designStyleId
            this.currentTabComponent = 'addArt'
            break;
          case 'template':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.template.add")) {
              return
            }
            this.editId = ''
            this.currentTabComponent = 'procedureCreate'
            break;
        }
        this.addDesignFileVisible = true
      } else {
        switch (this.selectType) {
          case 'bom':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
              return
            }
            this.bomTitle = '编辑BOM表'
            this.type = 'editor1'
            this.editId = row.id
            this.styleId = this.designStyleId
            this.currentTabComponent = 'CreateBomTable'
            break;
          case 'sample':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
              return
            }
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
              return
            }
            this.sampleId = row.id
            this.designStyleNo = row.designStyleNo
            this.styleId = this.designStyleId
            this.currentTabComponent = 'addClothes'
            break;
          case 'pdf':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
              return
            }
            this.artData = {
              id: row.id
            }
            this.currentTabComponent = 'addArt'
            break;
          case 'template':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
              return
            }
            this.editId = row.id
            this.currentTabComponent = 'procedureCreate'
            break;
        }
        this.addDesignFileVisible = true
      }
      this.editListShow = false
    },
    changeArtList() {
      this.addDesignFileVisible = !this.addDesignFileVisible
      // console.log(this.tipTextList,'this.tipTextList')
      // if (this.tipTextList.length) {
      //     this.tipTextShow = true
      // }
      this.getDesignList()
    },
    // 勾选
    select(selection, row) {
      this.selectData = selection
    },
    selectAll(selection) {
      this.selectData = selection
    },
    async openStatusDialog(type) {
      switch (type) {
        case 'forward':
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.style.submit")) {
            return
          }
          break;
        case 'eliminate':
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.style.eliminate") && !this.isWorkBench) {
            return
          }
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.eliminate") && this.isWorkBench) {
            return
          }
          break;
        case 'regain':
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.style.regain")) {
            return
          }
          break;
      }
      if (this.selectData.length === 0) return this.$message.error('请选择需要操作的数据')
      this.curType = type
      let notReported = !this.selectData.some(item => item.styleStatus != 3) // 判断是否存在未提报数据
      let notToVoid = !this.selectData.some(item => item.styleStatus == 1) // 判断是否存在不作废数据
      let toVoid = !this.selectData.some(item => item.styleStatus != 1) // 判断是否存在作废数据
      if (type === 'forward') { // 提报
        await this.checkForwardNeed(this.selectData);
        if (this.forwardNeed) {
          if (notReported) {
            this.tipshow = true
            this.selectDesignDialogVisible = true
          } else {
            this.selectDialoVisible = true
            this.tipshow = false
            this.text = '请选择处于未提报状态的设计档案！'
          }
        }
      }
      if (type == 'eliminate') { // 作废
        if (notToVoid) {
          this.tipshow = true
          this.text = '是否要将选中的设计档案全部淘汰？'
        } else {
          this.tipshow = false
          this.text = '请选择还未淘汰的设计档案！'
        }
        this.selectDialoVisible = true
      }
      if (type == 'regain') { // 恢复
        if (toVoid) {
          this.tipshow = true
          this.text = '是否要恢复选中的设计档案？'
        } else {
          this.tipshow = false
          this.text = '请选择已淘汰的设计档案！'
        }
        this.selectDialoVisible = true
      }
    },
    // 批量淘汰和恢复
    confirm() {
      let styleIds = []
      this.selectData.forEach(i => {
        styleIds.push(i.id)
      })
      let params = {
        styleIds: styleIds,
        type: this.curType
      }
      forward(params).then(res => {
        if (res.data.code == 0) {
          this.getDesignList()
          this.$message.success(res.data.msg)
          this.selectDialoVisible = false
          this.selectData = []
        } else {
          this.$message.success(res.data.msg)
        }
      })
    },
    // 批量提报
    saveForward(type, process) {
      let styleIds = []
      this.selectData.forEach(i => {
        styleIds.push(i.id)
      })
      let params = {
        type: this.curType,
        userId: this.userId,
        unitId: this.facId,
        styleIds: styleIds,
        process: process
      }
      this.saveBtnLoading = true
      this.isSaving = true
      forward(params).then(res => {
        if (res.data.code == 0) {
          this.getDesignList()
          this.$message.success(res.data.msg)
          this.selectDesignDialogVisible = false
          this.selectData = []
          this.saveBtnLoading = false
          this.isSaving = false
        } else {
          this.$message.error(res.data.msg)
          this.saveBtnLoading = false
          this.isSaving = false
        }
      })
    },
    //提交excel
    commitExcelData(form) {
      if (form) {
        this.excelStatic.loading = true;
        importDesignFileSupExcel(form).then(res => {
          if (res.data.code === 0) {
            this.excelStatic.loading = false;
            this.excelStatic.excelData = false;
            this.excelStatic.excelDataErr = res.data.faithNum;
            this.excelStatic.excelDataSucc = res.data.successNum;
            this.excelStatic.failureId = res.data.failureId;
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
      this.excelStatic.failureId = '';
      this.dialogVisibleExcel = false
    },
    uploadFinish() {
      //列表渲染调用
      this.getDesignList();
    },
    //查看详情
    handleInfoClick(val) {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.view")) {
        return
      }
      this.$store.dispatch('setDesignStyleNo', val.designStyleNo);
      sessionStorage.setItem("setDesignStyleNo", val.designStyleNo);

      this.$router.push(`/designFile/designFileDetail?designStyleId=${val.id}`)
    },
    leftImg() {
      if (this.i == 0) {
        return false;
      } else {
        this.picList[this.i--];
      }
    },
    rightImg() {
      if (this.i >= this.picList.length - 1) {
        return false;
      } else {
        this.picList[this.i++];
      }
    },
    //预览图片
    previewPic(scope) {
      this.i = 0
      this.picView = true
      this.picList = []
      scope.forEach(i => {
        this.picList.push({
          path: i
        })
      })
    },
    //搜索
    handleFilterMission(v) {
      // console.log(v);
      this.filterParams = { ...v,
        orderBy: this.filterParams.orderBy
      }
      this.getDesignList()
    },
    // 获取设计档案列表
    getDesignList() {
      this.loading = true;
      this.filterParams.userId = this.userId;
      let params = {
        modelName: 'SPL_DESIGN_STYLE',
        ...this.filterParams
      };
      designstylePage(params).then(res => {
        // console.log('设计档案列表数据执行', res.data);
        this.loading = false
        let tempList = res.data.data.list
        tempList.forEach(item => {
          let customFieldsObj = {}
          item.customFields.forEach(customItem => {
            customItem.cloumnText = ''
            if (customItem.customFieldType === 'TEXT') {
              customItem.cloumnText = customItem.textValue
            } else if (['SINGLE_SELECT', 'MULTI_SELECT'].includes(customItem.customFieldType)) {
              customItem.cloumnText = customItem.selectedOptions && customItem.selectedOptions.length > 0 ?
                customItem.selectedOptions.map(selectedItem => selectedItem.optionName).join('、') : ''
            } else if (['INTEGER', 'DECIMAL'].includes(customItem.customFieldType)) {
              customItem.cloumnText = customItem.numberValue
            }
            customFieldsObj[customItem.customFieldId] = customItem
          })
          item.customFields = customFieldsObj
        })
        this.tableData = tempList
        this.totalCount = res.data.data.totalCount
      })
    },
    // 获取货品属性
    fetchFacUnitSettings() {
      const params = {
        facId: this.facId,
        type: 'goodsAttrs'
      };
      getFacUnitSettings(params)
        .then(res => {
          this.attrsData = res.data.data;
        });
    },
    loadingMore(page) {
      this.filterParams.pageNo = page
      this.getDesignList()
    },
    // 设计款号必填
    async getRequireDesignCode() {
      // 获取设计款号必填项
      let paramR = {
        userId: this.userId,
        unitId: this.facId,
      };
      await getRequireDesignCode(paramR).then(res => {
        if (res.data.code === 0) {
          console.log('必填项', res.data.data)
          this.checkDesignDetailList = res.data.data;
        } else {
          this.$message.error(res.data.msg)
        }
      });
    },
    // 获取配置提报必填字段
    async getRequiredDetail() {
      const param = {
        designStyleId: '',
        unitId: this.facId,
      };
      await getRequiredDetail(param).then(res => {
        this.checkDetailLists = res.data.data
        this.checkDetailList = res.data.data
      });
    },
    async clickskip() {
      this.row = {};
      // 获取配置提报必填的字段
      await this.getRequiredDetail()
      // 获取设计款号必填项
      await this.getRequireDesignCode()
      // console.log("这里就是设计款号必填的内容",this.checkDesignDetailList);
      let datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
      if (datalist.indexOf("fac.spl.design.style.add") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.isEdit = false
      this.addDesignFileVisible = true
      console.log(this.addDesignFileVisible)
      this.currentTabComponent = 'CreateDesignFile'
      this.designStyleId = ''
      // this.$router.push("/designFile/createDesignFile");
    },
    imgUpload(e, row, type) {
      let params = {
        appId: this.$globalConfig.appId.appId
      };
      const file = e.target.files[0];
      if (file.size > 5000000) {
        this.$message({
          showClose: true,
          message: "图片大小超过5M!,重新上传",
          type: "error",
        });
        return false;
      }
      getUploadToken(params).then(res => {
        var params2 = new FormData();
        params2.append("file", file);
        params2.append("token", res.data.uptoken);
        params2.append("key", this.setImgKey(file.name));
        upDetailImgs(params2, {}).then(result => {
          const _imgUrl =
            config.qiniu.baseUrl + result.data.key;
          // row.push(_imgUrl)
          // 设计稿
          if (type == 'designPics') {
            let params = {
              designStyleId: row.id,
              path: _imgUrl
            }
            addDesignPicture(params).then(res => {
              if (res.data.code == 0) {
                row.designPics.push(_imgUrl)
                this.$message.success(' 上传成功')
              }

            })
          } else {
            let params = {
              userId: this.userId,
              unitId: this.facId,
              designNo: row.designStyleNo,
              designId: row.id,
              picturePath: _imgUrl
            }
            sampleCreatePicture(params).then(res => {
              if (res.data.code == 0) {
                row.samplePics.push(_imgUrl)
                this.$message.success(' 上传成功')
              }

            })
          }
        });
      });
    },
    //md5图片上传Key的拼接
    setImgKey(name) {
      const storeId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
      const date = +new Date() + "";
      return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
    },
    // 获取设计单打印模板列表
    getFacTemplates(id) {
      let params = {
        userId: this.userId,
        unitId: this.facId,
        type: 'designStyle',
        pageNo: 1,
        pageSize: 9999,
        using: true,
        typeId: ''
      }
      this.listLoading = true
      facTemplates(params).then(res => {
        if (res.data.code === 0) {
          let item = res.data.data.list.find(item => item.defaultStatus == 1);
          this.defaultTemplateId = item ? item.id : ''
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    printDesign() {
      if (this.selectData.length === 0) return this.$message.error('选择需要打印的设计档案')
      let styleIds = []
      this.selectData.forEach(item => {
        styleIds.push(item.id)
      })
      window.open(`/#/printShow?templateId=${this.defaultTemplateId}&businessId=${styleIds}&printType=print&billType=designStyle`)
    },
    //检查获取 是否设置为自动编号
    isExistGenerateStyleNoList() {
      isExistGenerateStyleNoList({
        userId: this.userId
      }).then(res => {
        res.data.data.forEach(item => {
          if (item.modelType === 1) {
            this.autoNumberDesign = item.userDefinedRule
          }
        })
      })
    },
    // 自动编号
    renumber() {
      if (!this.autoNumberDesign) {
        return this.$message.error('未配置自动编号规则！')
      }
      this.renumberShow = true
    },
    currentPageChange(val) {
      if (val == 1) {
        if (this.selectData.length === 0) {
          this.$message.error('请选择设计档案')
          this.renumberShow = false
          this.radio = null
          return
        }
      }
    },
    // 自动编号提交
    reNumberCommit() {
      if (!this.radio) return this.$message.error('请选择其中一项后点击确定')
      this.btnLoading = true;
      let params = {}
      if (this.radio == 1) {
        let designStyleNo = []
        this.selectData.forEach(i => {
          designStyleNo.push(i.id)
        })
        params = {
          styleIds: designStyleNo,
          unitId: this.facId,
          userId: this.userId
        }
      } else {
        params = JSON.parse(JSON.stringify(this.filterParams))
        params.userId = this.userId
        params.pageNo = 1
        params.pageSize = 99999
      }
      updateDesignStyleNos(params).then(res => {
        this.btnLoading = false;
        if (res.data.code == 0) {
          this.getDesignList()
          if (!res.data.data.length) {
            this.$message.success('重编号成功')
          } else {
            this.tipTextList = res.data.data
            this.tipTextShow = true
          }
          this.radio = null
          this.renumberShow = false
        }
      })
    },
    // 点击重编号失败的设计款号进入编辑页面
    goDesignDetail(id) {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.edit")) {
        return
      }
      // this.showCheckDetail('',true)
      const params = {
        designStyleId: id,
        unitId: this.facId
      }
      getRequiredDetail(params).then(res => {
        this.checkDetailList = res.data.data
      })
      this.isEdit = true
      this.addDesignFileVisible = true
      this.currentTabComponent = 'CreateDesignFile'
      this.designStyleId = id
      // this.tipTextShow = false
    },
  }
}
</script>

<style lang="scss" scoped>
.titleSelClass {
  text-align: center;

  .el-radio {
    margin-left: 0;
    margin-bottom: 8px;
  }

  .el-radio+.el-radio {
    margin-bottom: 20px;
  }

}

.codeActive {
  color: #ff9c38 !important;
}

.page-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 18px;
  padding-bottom: 30px;
}

.check-detail {

  position: fixed;
  z-index: 2000;
  top: 0;
  /*right: 1200px;*/
  left: 0;
  width: 150px;
  max-height: 500px;
  padding-top: 20px;
  border-left: 1px solid #E6EAF0;
  background: #fff;
  overflow-y: auto;

  .check-detail-item {
    padding-bottom: 2px;
    padding-left: 10px;
    padding-top: 10px;
    display: flex;
    border-bottom: 1px solid #E6EAF0;
    justify-content: space-between;
  }
}

.check-detail-dialog {
  &__body {
    position: relative;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    color: #3b3b3b;
    margin-bottom: 16px;

    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, .7);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .status {
      display: flex;
      align-items: center;
    }
  }
}

.renumber-detail-dialog {
  &__body {
    font-size: 12px;
    display: flex;
    /*justify-content: space-between;*/
    color: #3b3b3b;
    margin-bottom: 16px;

    .number {
      color: red;
      width: 70px;
    }

    span {
      display: inline-block;
      min-width: 100px;
      text-align: left;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .status {
      display: flex;
      align-items: center;
    }
  }
}

.upload-file {
  text-decoration: underline;
  // color:#808080;
  font-size: 12px;
  cursor: pointer;
}

.txt-color {
  color: #C4C6CC
}

.txt-green {
  color: #23C811
}

.txt-red {
  color: #FA4150
}

.txt-blue {
  color: #1CA1FF
}

.dialog-wrap {
  .check-detail-dialog {
    z-index: 9 !important;
  }

}
</style><style lang="scss">
.design-file-info-index {
  .dialog-wrap {
    .v-modal {
      z-index: 8 !important;
    }
  }

  .action-btn {
    padding: 5px 16px;
    margin-right: 4px;
    background: #fff;
    font-size: 12px !important;
  }

  .edit-dialog {
    .el-dialog__header {
      padding: 0;
      border-bottom: 1px solid #E6EAF0;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    ul {
      border: 1px solid #E6EAF0;
      line-height: 32px;

      li {
        height: 32px;
        padding: 0 12px;
        border-bottom: 1px solid #E6EAF0;
        display: flex;
        justify-content: space-between;

        &:hover {
          cursor: pointer;
        }

        &:first-child {
          background-color: #F5F7FA;
          color: #FFA914;
        }

        &:last-child {
          border: none;
        }
      }
    }
  }

  .check-detail-dialog {
    .el-dialog--tiny {
      width: 360px;
    }
  }
}
</style>

