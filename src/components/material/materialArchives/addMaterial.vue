/*
 * @Author: kuhn
 * @Description: 新增/编辑物料档案
 * @Date: 2019-05-09 17:20:22
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-23 15:27:13
 */

<template>
  <div class="addmaterial-info">
    <!-- 头部 -->
    <page-title class="pd24 bd-bottom" :title="title">
      <nf-button @click="cancel">取消</nf-button>
      <nf-button
        class="mgl12"
        @click="saveEdit('ruleForm',0)"
        :loading="isSubmitting"
        v-if="isConfig">存草稿
      </nf-button>
      <nf-button
        class="mgl12"
        type="warning"
        @click="saveEdit('ruleForm',isConfig?1:2)"
        :loading="isSubmitting">{{isConfig?'提报':'生成档案'}}
      </nf-button>
      <nf-button
        v-if="!isEdit"
        class="mgl12"
        type="warning"
        @click="saveEdit('ruleForm',isConfig?1:2,'continue')"
        :loading="isSubmitting">{{isConfig?'提报并继续新建':'生成并继续新建'}}
      </nf-button>
    </page-title>
    <!-- 内容区域 -->
    <div class="pd24" v-loading="loading">
      <div class="yellow-border-title mgb20">
        <h1 class="title">基本信息</h1>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px">
        <!--筛选条件-->
        <div class="custom-filter-form">
          <el-row>
            <!-- 物料分类 -->
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="8">
              <el-form-item label="物料分类" prop="kindId">
                <el-select
                  ref="kindSelect"
                  v-model="ruleForm.kindId"
                  filterable
                  @change="materialClassification"
                  filter-method="filterMaterailClassifyList"
                  placeholder="请选择物料分类">
                  <el-option
                    :value="''"
                    disabled
                    style="cursor:pointer;">
                    <div style="color: #ff9c38;" @click="classification">新建</div>
                  </el-option>
                  <el-option
                    v-for="item in materialKindList"
                    :value="item.id"
                    :label="formatLabel(item.no,item.name)"
                    :key="item.no">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 物料款号 -->
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="8">
              <el-form-item label="物料款号" :prop="materialNoProp ? 'no': ''">
                <el-input
                  @blur="checkMaterialNo"
                  v-model.trim="ruleForm.no"
                  :disabled="openRule"
                  :placeholder="`${openRule?'':'不填则'}自动生成款号`"></el-input>
              </el-form-item>
            </el-col>
            <!--关联商品款号-->
            <el-col
              :xs="12"
              :sm="12"
              :md="8"
              :lg="8">
              <el-form-item label="关联商品款号">
                <goods-select v-model="ruleForm.styleIds" :multiple="true"></goods-select>
              </el-form-item>
            </el-col>
            <!-- 物料名称 -->
            <el-col span="20">
              <el-form-item label="物料名称">
                <el-input
                  @change="handlerMaterialNameChange"
                  v-model.trim="ruleForm.name"
                  :maxlength="128"
                  placeholder="请输入物料名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item style="margin-left: -80px;">
                <el-checkbox v-model="isAutomaticMaterial" @change="handlerIsCheckedMaterialName">自动生成物料名称</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 数据表格 -->
        <div class='add-material-table'>
          <el-table
            class="custom-table no-hover-highlight no-cell-padding"
            :data="tableData4"
            @expand="expandRow"
            border
            style="width: 100%">
            <!-- 图片 -->
            <el-table-column
              class-name="no-padding"
              algin="center"
              label="图片"
              :render-header="labelHead">
              <template slot-scope="scope">
                <el-col :span="24" class="upload-img-content bd-bottom">
                  <el-form-item>
                    <ul v-if="scope.row.commonMaterialsPictureList">
                      <li
                        @click.stop="imgListAdd(scope.$index,index)"
                        v-for="(item,index) of scope.row.commonMaterialsPictureList"
                        :key="index">
                        <a class="face">
                          <i class="imgCancel" @click.stop="cancelImg(scope.$index,index)">
                          <img src="../../../../static/el-icon-close@3x.png" alt=""></i>
                          <img style="width: 48px;height: 48px;" :src="item.path">
                        </a>
                      </li>
                    </ul>
                    <p style='background:red;display: inline-block'>
                      <span class="add_photo">
                        <input type="file" accept="image/png,image/jpeg,image/jpg,image/gif" :id="'file-upload'+scope.$index" multiple @change="imgUpload($event, scope.$index)">
                        <label class="upload-file" :for="'file-upload'+scope.$index">点击上传</label>
                      </span>
                    </p>
                  </el-form-item>
                </el-col>
              </template>

            </el-table-column>
            <!-- 颜色 -->
            <el-table-column
              prop="colorId"
              class-name="no-padding"
              label="*颜色"
              width="160">
              <template slot-scope="scope">
                <colorSelectGroup
                  @colorChange="checkSku($event,scope.$index,'color')"
                  :SingleElection="true"
                  v-model="scope.row.colorId"
                  :groupData="colors">
                </colorSelectGroup>
              </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column
              class-name="no-padding"
              label="*规格"
              width="160">
              <template slot-scope="scope">
                <el-select
                  @change="checkSku($event,scope.$index,'specification')"
                  placeholder="请选择"
                  filterable
                  v-model.trim="scope.row.specificationsId">
                  <el-option
                    :value="''"
                    disabled
                    style="cursor:pointer;">
                    <div style="color: #ff9c38;" @click="specifications(scope.$index)">新建</div>
                  </el-option>
                  <el-option
                    v-for="item in materialSpecList"
                    :key="item.id"
                    :label="item.no?item.no:item.remark"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 样料 -->
            <el-table-column
              class-name="no-padding"
              prop="sampleMaterial"
              label="样料"
              width="60">
              <template slot-scope="scope">
                <el-checkbox class="mgl10" v-model="scope.row.sampleMaterial"></el-checkbox>
              </template>
            </el-table-column>
            <!-- 库存单位 -->
            <el-table-column
              class-name="no-padding"
              prop="stockUnitId"
              label="*库存单位"
              width="120">
              <template slot-scope="scope">
                <el-select
                  @change="handleSelect(scope.row)"
                  v-model.trim="scope.row.stockUnitId"
                  placeholder="请选择"
                  filterable>
                  <el-option
                    :value="''"
                    disabled
                    style="cursor:pointer;">
                    <div style="color: #ff9c38;" @click="newunit(scope.$index,'StockUnit')">新建</div>
                  </el-option>
                  <el-option
                    v-for="item in stockUnitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 采购单位 -->
            <el-table-column
              class-name="no-padding"
              prop="purchaseUnitId"
              label="采购单位"
              width="120">
              <template slot-scope="scope">
                <el-select
                  @change="handleSelect(scope.row)"
                  v-model.trim="scope.row.purchaseUnitId"
                  placeholder="请选择"
                  filterable>
                  <el-option
                    :value="''"
                    disabled
                    style="cursor:pointer;">
                    <div style="color: #ff9c38;" @click="newunit(scope.$index,'PurchaseUnit')">新建</div>
                  </el-option>
                  <el-option
                    v-for="item in stockUnitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!-- 备注 -->
            <el-table-column class-name="no-padding" label="备注">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.remark" placeholder="选填"></el-input>
              </template>
            </el-table-column>
            <!--标准用量-->
            <el-table-column
              class-name="no-padding"
              label="标准用量"
              width="100">
              <template slot-scope="scope">
                <div>
                  <el-input
                    type="number"
                    @blur="handleBlur($event,scope.row)"
                    v-model.number="scope.row.defaultDosage"></el-input>
                </div>
              </template>
            </el-table-column>
            <!--固定物料-->
            <el-table-column
              class-name="no-padding"
              label="固定物料"
              width="100">
              <template slot-scope="scope">
                <div>
                  <el-checkbox class="mgl10" v-model="scope.row.fixedMaterials"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <!--参考转化率-->
            <el-table-column
              class-name="no-padding"
              prop="conversionRate"
              label="参考转化率"
              width="100">
              <template slot-scope="scope">
                <div>
                  <el-input
                    :disabled="((scope.row.stockUnitId===scope.row.purchaseUnitId)||inputDisabled)&&scope.row.stockUnitId!=''&&scope.row.purchaseUnitId!=''"
                    type="number"
                    v-model.number="scope.row.conversionRate"
                    placeholder="0"></el-input>
                </div>
              </template>
            </el-table-column>
            <!-- 默认损耗 -->
            <el-table-column
              class-name="no-padding"
              label="默认损耗"
              width="80">
              <template slot-scope="scope">
                <div>
                  <el-input
                    style="width: 45px"
                    v-model.number="scope.row.mlossRate"
                    placeholder="0"></el-input>%
                </div>
              </template>
            </el-table-column>
            <!--属性库动态字段-->
            <div>
              <el-table-column
                class-name="no-padding"
                v-for="(v,index) in tableData11"
                :key="index"
                :prop="v.commonAttrstoreName"
                :label="v.commonAttrstoreName"
                width="160">
                <template slot-scope="scope">
                  <div v-if="v.type==2 && v.commonAttrstoreOptionsList">
                    <el-select
                      v-model.trim="scope.row[v.lable]"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item,i) in v.commonAttrstoreOptionsList"
                        :key="i"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                  <div v-else>
                    <template v-if="v.mandatory == 1">
                      <el-input v-model.trim="scope.row[v.lable]" placeholder="必填"></el-input>
                    </template>
                    <template v-else-if="v.lable === 'shrinkage'">
                      <el-input
                        class="input-shrinkage"
                        v-model.trim="scope.row[v.lable]"
                        type="number"
                        step="0.01"
                        placeholder="选填">
                      </el-input>
                      <span> %</span>
                    </template>
                    <template v-else>
                      <el-input v-model.trim="scope.row[v.lable]" placeholder="选填"></el-input>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </div>
            <!-- 新增自定义动态字段 -->
            <div>
              <el-table-column
                v-for="(DIY,index) in DIYTableColumnList"
                :key="index"
                class-name="no-padding"
                :label="DIY.customFieldName"
                width="180">
                <template slot-scope="scope">
                  <!-- <div v-for="(item,aindex) in scope.row.customFields" :key="aindex"> -->
                    <!-- 单选属性、SINGLE_SELECT -->
                    <el-select
                      v-if="DIY.customFieldType === 'SINGLE_SELECT'"
                      v-model.trim="scope.row[DIY.customFieldId]"
                      filterable
                      placeholder="请选择">
                      <el-option
                        v-for="(item,i) in DIY.commonAttrstoreOptionsList"
                        :key="i"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <!-- 多选属性、MULTI_SELECT -->
                    <el-select
                      v-else-if="DIY.customFieldType === 'MULTI_SELECT'"
                      v-model.trim="scope.row[DIY.customFieldId]"
                      filterable
                      multiple
                      placeholder="请选择">
                      <el-option
                        v-for="(item,i) in DIY.commonAttrstoreOptionsList"
                        :key="i"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <!-- 整数型、INTEGER -->
                    <div class="DIY_input" v-else-if="DIY.customFieldType === 'INTEGER'">
                      <input
                        type="text"
                        v-model="scope.row[DIY.customFieldId]"
                        maxlength="32"
                        @input="handlerDIYInterInput($event,scope.row.integerValue)"
                        placeholder="选填">
                    </div>
                      <!-- 小数型、DECIMAL -->
                      <div class="DIY_input" v-else-if="DIY.customFieldType === 'DECIMAL'">
                        <input
                          type="text"
                          maxlength="32"
                          v-model="scope.row[DIY.customFieldId]"
                          @input="handlerDIYDecimalInput($event,scope.row.decimalValue)"
                          placeholder="选填">
                      </div>
                        <!-- 单行文本 TEXT -->
                        <el-input
                          v-else-if="DIY.customFieldType === 'TEXT'"
                          v-model="scope.row[DIY.customFieldId]"
                          maxlength="100"
                          placeholder="选填">
                        </el-input>
                      <!-- </div> -->
                </template>
              </el-table-column>
            </div>

            <!--操作-->
            <el-table-column
              fixed="right"
              align="center"
              label="操作"
              class-name="no-padding"
              width="80">
              <template slot-scope="scope">
                <div class="action-list">
                  <el-button
                    class="item blue"
                    @click.native.prevent="handleCopy(scope.row)"
                    type="text"
                    size="small">
                    复制
                  </el-button>
                  <!-- <el-button
                    style="margin-left: 0"
                    class="item red"
                    :disabled="!scope.row.canDelete"
                    @click.native.prevent="deleteRow(scope.$index, tableData4)"
                    type="text"
                    size="small">
                    删除
                  </el-button> -->
                  <el-button
                    style="margin-left: 0"
                    class="item red"
                    @click.native.prevent="deleteRow(scope.$index, tableData4)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
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
                      width="200"
                      class-name="no-padding"
                      label="供应商">
                      <template slot-scope="scope">
                        <el-select
                          @visible-change="v => {if(!v)supplierInput=''}"
                          @change="changeSupplier($event,props.$index,scope.$index)"
                          v-model="scope.row.supplierId"
                          placeholder="请选择或搜索"
                          filterable
                          remote
                          :remote-method="remoteMethod"
                          :loading="loading">
                          <el-option
                            :value="''"
                            disabled
                            style="cursor:pointer">
                            <div style="width: 100%;height: 100%;" @click="addSupplierShowClick(props.$index,scope.$index)">
                              <span style="display: inline-block;width: 100%;color: #ff9c38;">+新建</span>
                            </div>
                          </el-option>
                          <el-option
                            v-if="item.name.indexOf(supplierKeyword) > -1"
                            v-for="item in supOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <!-- 供应商款号 -->
                    <el-table-column width="200" label="供应商款号">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.supplierStyleNo" placeholder="选填"></el-input>
                      </template>
                    </el-table-column>
                    <!-- 供应商色号 -->
                    <el-table-column
                      width="160"
                      class-name="no-padding"
                      label="供应商色号">
                      <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.supplierColorNo" placeholder="选填"></el-input>
                      </template>
                    </el-table-column>
                    <!-- 参考单价 (元) -->
                    <el-table-column
                      width="200"
                      class-name="no-padding"
                      label="参考价【元/库存单位】">
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.planCost" placeholder="选填"></el-input>
                      </template>
                    </el-table-column>
                    <!-- 不含税价 (元) -->
                    <el-table-column class-name="no-padding" label="不含税价【元/库存单位】">
                      <template slot-scope="scope">
                        <el-input v-model.number="scope.row.excludingTaxPrice" placeholder="选填"></el-input>
                      </template>
                    </el-table-column>
                    <!--操作-->
                    <el-table-column
                      fixed="right"
                      align="center"
                      label="操作"
                      class-name="no-padding"
                      width="175">
                      <template slot-scope="scope">
                        <div class="action-list">
                          <el-button
                            :disabled="scope.row.isDeleteing"
                            style="flex:inherit;width:65px;"
                            class=" red"
                            @click.native.prevent="deleteSupplierRow(props.$index,scope.$index)"
                            type="text"
                            size="small">
                            删除
                          </el-button>
                          <span v-if="scope.row.defaultFlag" class="item orange">默认供应商</span>
                          <el-button
                            v-else
                            class="item blue"
                            style="margin-left: 0;"
                            @click.native.prevent="setDefaultSupplier(props.$index,scope.$index)"
                            type="text"
                            size="small">
                            设为默认
                          </el-button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                  <span @click="addSupplierRow(props.$index)" class="orange add-suppler-btn">+添加供应商</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <nf-button
        @click="addArtOrder()"
        style="width:98px; background:#fff; color:#ff9c38;margin-top: 12px;padding:7px 0;"
        type="warning">
        +添加SKU
      </nf-button>

      <content-wrap style="margin-top: 20px;" title="附件">
        <upload-form
          from="material"
          :isMaterialEdit="isEdit"
          :tableData="attachmentLists"
          :fileList="attachments"
          @getFileList="getFileList"
          @getAttachments="getAttachments"></upload-form>
      </content-wrap>
    </div>
    <!-- 注：:modal-append-to-body="false"属性是控制是否插入至body元素上，若为false，则遮罩层会插入至Dialog的父元素上 -->
    <!--新建库存单位-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      title="新建库存单位"
      :visible.sync="addUnit.visible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <el-form
        :model="addUnit"
        ref="addUnit"
        :rules="addUnitRules">
        <el-form-item
          prop="unitValue"
          label="库存单位"
          label-width="90px">
          <el-input
            v-model.trim="addUnit.unitValue"
            auto-complete="off"
            placeholder="请输入库存单位"
            @keyup.enter.native="comfirmAddStockUnit">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSingleForm4('addUnit')">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="comfirmAddStockUnit">保 存
        </el-button>
      </div>
    </el-dialog>

    <!--新建物料规格-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      title="新建物料规格"
      :visible.sync="addMaterialSpecForm.visible"
      size="tiny">
      <el-form :model="addMaterialSpecForm" ref="addMaterialSpecForm">
        <el-form-item label="规格号" label-width="90px">
          <el-input
            v-model.trim="addMaterialSpecForm.no"
            @input="handleNoInput1"
            maxlength="8"
            auto-complete="off"
            placeholder="规格号不填则自动生成"></el-input>
        </el-form-item>
        <el-form-item label="规格描述" label-width="90px">
          <el-input
            v-to-focus="remarkInput1"
            v-model.trim="addMaterialSpecForm.remark"
            auto-complete="off"
            @keyup.enter.native="comfirmAddMaterialSpec('addMaterialSpecForm')"
            placeholder="请输入规格描述">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSingleForm3('addMaterialSpecForm')">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="comfirmAddMaterialSpec('addMaterialSpecForm')">保 存
        </el-button>
      </div>
    </el-dialog>

    <!--新建物料分类-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      title="新建物料分类"
      :visible.sync="addMaterialClassifyForm.visible"
      size="tiny">
      <el-form
        :model="addMaterialClassifyForm"
        ref="addMaterialClassifyForm"
        :rules="addMaterialClassifyRules">
        <el-form-item
          label="分类号"
          label-width="90px"
          prop="no">
          <el-input
            v-model.trim="addMaterialClassifyForm.no"
            maxlength="8"
            auto-complete="off"
            placeholder="请输入分类号"></el-input>
        </el-form-item>
        <el-form-item
          label="分类名称"
          label-width="90px"
          prop="name">
          <el-input
            v-model.trim="addMaterialClassifyForm.name"
            auto-complete="off"
            placeholder="请输入分类名称"
            @keyup.enter.native="confirmAddMaterialClassify('addMaterialClassifyForm')">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSingleForm1('addMaterialClassifyForm')">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="confirmAddMaterialClassify('addMaterialClassifyForm')">保 存
        </el-button>
      </div>
    </el-dialog>

    <!--导入物料提示框-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog tip-dialog"
      :visible.sync="isImportVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">此物料款号已存在，是否将其导入？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isImportVisible = false">取 消</el-button>
        <el-button
          :disabled="isSaving"
          type="primary"
          @click="confirmImport()">导入</el-button>
      </div>
    </el-dialog>
    <!--新建供应商-->
    <!--新增和编辑供应商，通用组件-->
    <transition name="right-move">
      <add
        v-if="addSupplierShow"
        type="add"
        :supplierName="supplierInput"
        @hiddenWindow="cancelAdd"
        @getName="getName"
        @hideCover="cancelAdd"
        @update="getNewSup">
      </add>
    </transition>
    <transition name="opcity">
      <div
        class="cover"
        v-if="addSupplierShow"
        @click="cancelAdd">
      </div>
    </transition>

    <!--图片预览-->
    <imgPreview
      @dialogClose="centerDialogVisibleAdd=false"
      :centerDialogVisible="centerDialogVisibleAdd"
      :imgLists="imgListsAdd"
      :imgIndex="imgIndexAdd"></imgPreview>

  </div>

</template>

<script>
import {
  billReviewConfig, //是否有配置审核台
  ruleList, //是否开启物料款号自动编号
  listMaterialsKinds, //物料分类下拉接口
  getMaterialDetail, //组织层物料规格-删除规格
  getUploadToken, //获取七牛云上传token
  upDetailImgs, //上传图片的接口
  selectFacCommonSettings, //搜索公共体系下的信息
  getFacCommonSettings, //颜色下拉数据接口
  listCommonMaterialsSpecifications, //规格下拉数据接口
  listCommonMaterialsAttr, //单位下拉数据接口
  addStockUnit, //提交新建库存新建单位接口
  addOrUpdateCommonMaterialsSpecifications, //提交新建物料规格接口
  addOrUpdateMaterialsKinds, //提交新建物料分类
  addCommonSkuAttr, //新建颜色接口
  judgeMaterialSkuAttrDelete, //删除颜色与规格
  addMaterials, //物料保存接口
  judgeRepeatMaterialNo, //物料判重
  importMaterial, //导入
  selectFacGoodsStyleList, //商品款号
  attachmentListNames
} from "@/api/api";

import {
  savedMaterials, //物料保存接口
  materialDetails, //物料编辑
  editMaterials, //物料编辑提交接口
  searchSupplier,
  checkDeleteSupplier, //删除物料sku供应商前置检查
  automaticCreateMaterialName // 自动生成物料名称
} from '@/api/material.js'
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
import add from "../materialSupplier/add";
import supplierSelect from "@/components/Common/custom-select/supplier-select.vue";
import uploadForm from '@/components/Common/uploadForm'; // 上传表格

const DIYParamsList = ['singleSelectValue','mulitSelectValue','integerValue','decimalValue','textValue']

export default {
  components: {
    add,
    supplierSelect,
    uploadForm
  },
  props: ['title'],
  directives: {
    "to-focus": function (el, binding) {
      if (binding.value) {
        window.setTimeout(function () {
          el.children[0].focus();
        }, 100)
      }
    }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    unitId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    },
    isEdit() {
      return this.title == "编辑物料"
    },
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    },
    //是否校验物料款号
    materialNoProp() {
      if (this.isEdit) {
        return true
      } else {
        return false
      }
    },
  },
  data() {
    // 检查分类号
    var validateMaterialClassifyNo = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("分类号不能为空"));
      } else {
        let patt = /^[0-9a-zA-Z]{1,8}$/;
        if (!patt.test(value)) {
          callback(new Error("请输入8位以内数字或英文"));
        }
        // 分类号查重逻辑

        callback();
      }
    };
    // 检查分类名称
    var validateMaterialClassifyName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("分类名称不能为空"));
      } else {
        // 分类名称查重逻辑
        callback();
      }
    };
    return {
      attachmentLists: [], // 表格上传
      attachments: [], // 其他上传
      inputDisabled: false, //转化率输入框是否禁用
      centerDialogVisibleAdd: false, //判断显示图片预览显示与隐藏
      imgListsAdd: [],
      imgIndexAdd: 0,
      addSupplierShow: false, //判断显示新建供应商
      tableData4: [{
        colorId: "", //物料sku的颜色id(必须)
        specificationsId: "", //物料sku的规格id(之前必填，现在改成选填)
        remark: "", //备注
        stockUnitId: "", //物料sku的库存单位id(必须)
        mlossRate: "", //物料sku的损耗率(必须)
        picturesPaths: [], //图片数组
        commonMaterialsPictureList: [], //图片的url
        sampleMaterial: true,
        purchaseUnitId: '', //采购单位
        conversionRate: '', //参考转化率
        canDelete: true,
        suppliers: [], //供应商数组
        loading: false,
        customFields: []
      }],
      // tableData12: [], //添加属性库对应的循环数据
      tableData11: [], //动态变化的数据
      tableDataList: [], //数据表格保存转换数据
      ruleForm: {
        kindId: "", //物料分类
        no: "", //物料款号
        name: "", //物料名称
        styleIds: [], //商品款号
      },
      isSaving: false,
      isImportVisible: false,
      // 库存单位
      addUnit: {
        visible: false,
        unitValue: "",
        type: ""
      },
      // 供应商
      addSupplierForm: {
        visible: false,
        Supplier: ""
      },
      addUnitRules: {
        unitValue: [{
          required: true,
          trigger: "blur",
          message: "请输入库存单位"
        }]
      },
      // 规格新建
      addMaterialSpecForm: {
        visible: false,
        no: "",
        remark: ""
      },
      // 新建物料分类
      addMaterialClassifyForm: {
        visible: false,
        no: "",
        name: ""
      },
      addMaterialClassifyRules: {
        no: [{
          validator: validateMaterialClassifyNo,
          trigger: "blur"
        }],
        name: [{
          validator: validateMaterialClassifyName,
          trigger: "blur"
        }]
      },
      colors: [], //颜色下拉数据
      materialKindList: [], //物料分类下拉数据
      backupMaterialKindList: [],
      materialSpecList: [], //规格下拉数据
      stockUnitList: [], //库存单位下拉数据
      // 验证填写是否空
      rules: {
        // 验证物料分类
        kindId: [{
          required: true,
          message: "物料分类不能为空",
          trigger: "change"
        }],
        no: [{
          required: true,
          message: "物料款号不能为空",
          trigger: "change"
        }],
        // 验证颜色
        colorIds: [{
          required: true,
          type: "array",
          message: "颜色不能为空",
          trigger: "change"
        }],
        // 验证库存单位
        stockUnitId: [{
          required: true,
          message: "库存单位不能为空",
          trigger: "change"
        }]
      },
      commonMaterialId: "", //体系层物料id（编辑物料场景下传参）
      theImport: '', //导入体系层物料id（必须）
      index: '', //选中的索引（物料sku行的index）
      childIndex: '', //某个物料sku行的供应商操作行的index）
      supplierName: "", //新建的供应商名字
      label: [], //新建和编辑保存数据匹配值
      commonMaterialsKindsId: '', //编辑进来获取下拉数据
      imgArrLength: [0], // 上传图片的个数
      remarkInput1: false, //规格input是否选中
      isSubmitting: false, //防止重复点击
      // continueLoading: false,//防止重复点击
      supOptions: [],
      supOptionsHaveSel: [],
      loading: false,
      supplierInput: '', //供应商下拉列表的输入值
      openRule: false, //物料款号自动编号
      isConfig: false, //配置审核台
      supplierKeyword: '', // 供应商下拉列表搜索的关键字
      DIYTableColumnList: [], // 物料档案自定义字段参数列表
      isAutomaticMaterial: false, // 是否自动生成物料名称
      automaticMterialName: '', //自动生成的物料名称
      materialValueCopy: ''
    };
  },
  methods: {
    handleBlur(e, row) {
      //保留小数点后两位
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]
      this.$set(row, 'defaultDosage', e.target.value.match(/^\d*(\.?\d{0,2})/g)[0])
    },
    /**
     * 自定义字段整数型输入框限制
     */
    handlerDIYInterInput(e, info) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '').replace(/[^\d]/g, '')
      info = e.target.value
    },
    /**
     * 自定义字段小数型输入限制
     */
    handlerDIYDecimalInput(e, info) {
      let value = e.target.value
                   .replace(/[^\d.]/g, '')
                   .replace(/^\./g, '')
                   .replace(/\.{2,}/g, '.')
                   .replace('.', '$#$')
                   .replace(/\./g, '')
                   .replace('$#$', '.')
                   .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
      e.target.value = value
      info = e.target.value
    },
    getAttachments(v) {
      this.attachments = v
    },
    // 获取上传列表
    getFileList(v) {
      this.attachmentLists = v
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
    getRuleList() {
      return new Promise((resolve,reject)=>{
        ruleList({
          userId: this.userId
        }).then(res => {
          const rule = res.data.data.find(v => v.modelType === 6)
          this.openRule = rule.commonGenerateRuleDTOs.length > 0 && rule.openRule //有开启并且有配置规则
          resolve()
        })
      })
      
    },
    handleSelect(row) {
      let stockUnitName, purchaseUnitName;
      if (row.stockUnitId) {
        stockUnitName = this.stockUnitList.find(v => row.stockUnitId === v.id).name
      }
      if (row.purchaseUnitId) {
        purchaseUnitName = this.stockUnitList.find(v => row.purchaseUnitId === v.id).name
      }
      // stockUnitId purchaseUnitId
      if (row.stockUnitId && row.purchaseUnitId && (row.stockUnitId === row.purchaseUnitId)) {
        this.$set(row, 'conversionRate', 1)
        this.inputDisabled = true
      } else if (stockUnitName == '米' && purchaseUnitName == '码') {
        this.$set(row, 'conversionRate', 0.9144)
        this.inputDisabled = true
      } else {
        // this.$set(row,'conversionRate','')
        this.inputDisabled = false
      }
    },
    //供应商搜索
    remoteMethod(query) {
      let nextFlag = true
      this.supOptions.forEach(item => {
        if (item.name === query) {
          nextFlag = false
        }
      })
      if (!nextFlag) return;
      // if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
            this.supplierKeyword = query;
            this.getSupplierSelect(query)
        }, 200);
      // } else {
      //   this.supOptions = [];
      // }
    },
      getSupplierSelect(query) {
          let params = {
              unitId: this.unitId,
              keyword: query
          };
          searchSupplier(params).then(res => {
              if (res.data.code === 0) {
                  if(res.data.data.some(v => v.name === query)) {
                      this.supplierInput = '';
                  }else {
                      this.supplierInput = query;
                  }
                  this.supOptions = res.data.data.concat(this.supOptionsHaveSel);
                  this.$nextTick(function () {
                      let newSel = [];
                      this.supOptions.forEach(item => {
                          let flag = true;
                          newSel.forEach($item => {
                              if ($item.id === item.id) {
                                  flag = false
                              }

                          })
                          if (flag) {
                              newSel.push(item)
                          }
                      })
                      this.supOptions = newSel
                  })

              } else {
                  this.supOptions = [];
                  this.supplierInput = '';
              }
          });
      },
    //获取新建的供应商
    getNewSup(val) {
      this.supOptions.push(val);
      this.$set(this.tableData4[this.index].suppliers[this.childIndex], 'supplierId', val.id)
    },
    // 添加供应商行
    addSupplierRow(index) {
      this.tableData4[index].suppliers.push({
        supplierId: '',
        supplierStyleNo: '',
        supplierColorNo: '',
        planCost: '',
        excludingTaxPrice: '',
        defaultFlag: !this.tableData4[index].suppliers.length, //新建如果是第一个供应商，设置为默认
      })
    },
    // 删除供应商行
    async deleteSupplierRow(index, childIndex) {
      if (this.isEdit) {
        let params = {
          materialsSkuId: this.tableData4[index].materialsSkuId,
          supplierId: this.tableData4[index].suppliers[childIndex].supplierId
        }
        this.$set(this.tableData4[index].suppliers[childIndex], 'isDeleteing', true)
        await checkDeleteSupplier(params).then(res => {
          this.$set(this.tableData4[index].suppliers[childIndex], 'isDeleteing', false)
          if (res.data.code === 0) {
            if (res.data.data) {
              this.tableData4[index].suppliers.splice(childIndex, 1)
            } else {
              this.$message.error('该供应商已被引用，不可删')
            }
          }
        })
      } else {
        this.tableData4[index].suppliers.splice(childIndex, 1)
      }
    },
    // 设置默认供应商
    setDefaultSupplier(index, childIndex) {
      this.tableData4[index].suppliers.forEach(($item, $index) => {
        $item.defaultFlag = $index === childIndex
      })
    },
    // 供应商改变时查重
    changeSupplier(supplierId, index, chilidIndex) {
        this.supplierInput = ''
      if (supplierId) {
        let currentSuppliers = this.tableData4[index].suppliers
        let suppliers = currentSuppliers.filter(item => item.supplierId === supplierId)
        if (suppliers.length > 1) {
          this.$message.error('同sku下的供应商不能相同')
          this.$set(currentSuppliers[chilidIndex], 'supplierId', '')
          return
        } else {
          let item = this.supOptions.find(item => item.id === supplierId)

          let ids = this.supOptionsHaveSel.map(item => item.id);
          if (ids.indexOf(item.id) === -1) {
            this.supOptionsHaveSel.push(item)

          }
        }
      }
    },
    // 颜色或者规格改变时查重
    checkSku(id, index, type) {
      if (id) {
        let currentSku = this.tableData4[index]
        let filterSkus = this.tableData4.filter(item => item.specificationsId === currentSku.specificationsId && item.colorId === currentSku.colorId)
        if (filterSkus.length > 1) {
          this.$message.error('不能存在两个相同的物料sku')
          if (type === 'color') {
            currentSku.colorId = ''
          } else {
            currentSku.specificationsId = ''
          }
          return
        }
      }
    },
    //获取供应商数组
    getSupArr() {
      if (this.tableData4.length) {
        this.tableData4.forEach(item => {
          item.suppliers.forEach(supplierItem => {
            let supObj = {};
            supObj.id = supplierItem.supplierId;
            supObj.name = supplierItem.supplierName;
            this.supOptions.push(supObj);
          })
        });
      }
    },
    //图片预览
    imgListAdd(rowIndex, index) {
      this.imgIndexAdd = index;
      this.imgListsAdd = this.tableData4[rowIndex].commonMaterialsPictureList;
      this.centerDialogVisibleAdd = true;
    },
    //新建物料规格弹窗色号input输入
    handleNoInput1() {
      this.remarkInput1 = false;
    },
    /**
     * 物料分类change事件,获取动态表格的表头和下拉数据
     */
    materialClassification(val) {
      // console.log('物料分类changse事件')
      // 自定义属性字段列表数据
      const attributeDIY = this.materialKindList.filter(item => {
        return item.id === val
      })
      const attributeDIYList = attributeDIY && attributeDIY[0].commonMaterialsKindsAttrsList ? attributeDIY[0].commonMaterialsKindsAttrsList : []
      // 属性字段列表数据
      const attributeList = attributeDIYList.filter(item => {
        return item.customField === false
      })
      attributeList.forEach(item => {
        this.label.push(item.lable)
      })
      this.tableData11 = attributeList || []
      // 自定义字段列表数据
      const DIYList = attributeDIYList.filter(item => {
        return item.customField
      })
      const DIYTableColumnList = []
      DIYList.forEach(item => {
        const params = {
          customFieldId: item.commonAttrstoreId, // 自定义字段id
          customFieldName: item.commonAttrstoreName, // 自定义字段名称
          //自定义字段类型：SINGLE_SELECT 单选属性、MULTI_SELECT 多选属性、INTEGER 整数型、DECIMAL 小数型、TEXT 单行文本
          customFieldType: item.customFieldType,
          textValue: '', //文本类型值
          numberValue: '', // 数值类型值
          //已选择的下拉列表（只有customFieldType是SINGLE_SELECT 或是MULTI_SELECT的时候才有值,SINGLE_SELECT 只会有一个值，MULTI_SELECT会有多个值）
          selectedOptions: '',
          commonAttrstoreOptionsList: item.commonAttrstoreOptionsList
        }
        params.customFieldType === 'MULTI_SELECT' ? params.selectedOptions = [] : console.log()
        DIYTableColumnList.push(params)
      })
      this.tableData4.forEach(item=>{
        DIYTableColumnList.forEach(info=>{
          if(info.customFieldType === 'MULTI_SELECT'){
            this.$set(item,info.customFieldId,[])
            // item[info.customFieldId] = []
          }else{
            //item[info.customFieldId] = ''
            this.$set(item,info.customFieldId,'')
          }
        })
      })

      this.DIYTableColumnList = DIYTableColumnList
      // console.log('自定义参数信息',DIYTableColumnList)

      // for (let i = 0; i < this.materialKindList.length; i++) {
      //   if (this.materialKindList[i].id === val) {
      //     var materialKindList = this.materialKindList[i].commonMaterialsKindsAttrsList
      //     if (materialKindList) {
      //       materialKindList.forEach((key, index) => {
      //         const label = materialKindList[index].lable;
      //         this.label.push(label)
      //         this.$set(materialKindList[index], label, '')
      //       })
      //     }
      //     this.tableData11 = materialKindList ? materialKindList : [];
      //   }
      // }
    },
    // 获取子组件的新建供应商名称
    getName(val) {
      this.supplierName = val
    },
    //关闭新建物料弹窗
    closeSingleForm1(formName) {
      this.addMaterialClassifyForm.no = '';
      this.addMaterialClassifyForm.name = '';
      this.$refs[formName].resetFields();
      this.addMaterialClassifyForm.visible = false;
    },
    //关闭新建规格弹窗
    closeSingleForm3() {
      this.addMaterialSpecForm.no = '';
      this.addMaterialSpecForm.remark = '';
      this.addMaterialSpecForm.visible = false;
    },
    //关闭新建库存单位弹窗
    closeSingleForm4(formName) {
      this.addUnit.unitValue = '';
      this.$refs[formName].resetFields();
      this.addUnit.visible = false;
    },
    // 新建单位
    newunit(index, type) {
      $('.el-select-dropdown').hide()
      this.index = index; //保存当前选中的索引值
      this.addUnit.type = type
      this.addUnit.unitValue = "";
      this.addUnit.visible = true
    },
    // 新建物料分类
    classification() {
      $('.el-select-dropdown').hide()
      this.ruleForm.kindId = "";
      this.addMaterialClassifyForm.visible = true
    },
    // 新建规格
    specifications(index) {
      $('.el-select-dropdown').hide()
      this.index = index; //保存当前选中的索引值
      this.addMaterialSpecForm.no = "";
      this.addMaterialSpecForm.remark = "";
      this.addMaterialSpecForm.visible = true;
      this.remarkInput1 = true;
    },
    //关闭侧滑栏
    cancelAdd() {
      this.addSupplierShow = false;
      // this.getSupplierList()
    },
    // 显示与隐藏供应商新建
    addSupplierShowClick(index, childIndex) {
      $('.el-select-dropdown').hide()
      this.index = index
      this.childIndex = childIndex
      this.addSupplierShow = true;
    },
    // 物料详情
    async materialDetails() {
      let params = {
        id: this.$route.params.id, //当前点击的物料id
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id //当前用户id
      };
      this.loading = true
      await materialDetails(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          // console.log('编辑查询数据')
          // console.log(res.data)
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
          this.commonMaterialsKindsId = res.data.commonMaterials.commonMaterialsKindsId; //编辑保存物料下拉id
          this.ruleForm.kindId = res.data.commonMaterials.commonMaterialsKindsId; //物料分类
          this.ruleForm.no = res.data.commonMaterials.materialsNo; //物料款号
          this.ruleForm.name = res.data.commonMaterials.name; //物料名称
          this.materialValueCopy = this.ruleForm.name // 自动生成物料名称
          let goodsStyleList = res.data.commonMaterials.goodsStyleList;
          //封装商品款号和商品款号下拉数据
          if (goodsStyleList.length) {
            goodsStyleList.forEach(item => {
              this.ruleForm.styleIds.push(item.id)
            });
          }
          let commonMaterialsSkuList = res.data.commonMaterials.commonMaterialsSkuList;
          for (let i = 0; i < commonMaterialsSkuList.length; i++) {
            if (commonMaterialsSkuList[i].commonMaterialsPictureList) {
              this.imgArrLength.push(commonMaterialsSkuList[i].commonMaterialsPictureList.length)
            }
          }
          this.tableData4 = commonMaterialsSkuList;
          console.log('列表数据',this.tableData4)
          this.getSupArr();
        }
      });
    },
    /**
     * 设置自定义属性值
     */
    setDIYTypeValue() {
      // 循环获取属性库的表头和值
      this.tableData4.forEach((v, index) => {
        if (v.commonAttrstoreList) {
          v.commonAttrstoreList.forEach((v2, i) => {
            if (v2.attrValue) {
              v[v2.lable] = v2.attrValue;
            } else {
              v[v2.lable] = '';
            }
          })
        }
        if (v.customFieldList) {
          v.customFields = []
          v.customFieldList.forEach(item => {
            // console.log('请求回来的参数',item)
            const params = {...item}
            const idList = []
            if(params.selectedOptions){
              params.selectedOptions.forEach(item=>{
                idList.push(item.optionId)
              })
            }
            switch(params.customFieldType){
              case 'SINGLE_SELECT':
                v[params.customFieldId] = idList.toString()
                break;
              case 'MULTI_SELECT':
                v[params.customFieldId] = idList
                break;
              case 'INTEGER':
                v[params.customFieldId] = params.numberValue
                break;
              case 'DECIMAL':
                v[params.customFieldId] = params.numberValue
                break;
              case 'TEXT':
                v[params.customFieldId] = params.textValue
                break
            }
          })
        }
      });
    },
    // 点击添加行
    addArtOrder() {
      let item = {
        colorId: "", //物料sku的颜色id(必须)
        specificationsId: "", //物料sku的规格id(之前必填，现在改成选填)
        remark: "", //备注
        stockUnitId: "", //物料sku的库存单位id(必须)
        mlossRate: "", //物料sku的损耗率(必须)
        picturesPaths: [], //图片数组
        commonMaterialsPictureList: [], //图片的url
        sampleMaterial: true,
        purchaseUnitId: '', //采购单位
        conversionRate: '', //参考转化率
        canDelete: true,
        suppliers: [], //供应商数组
      };
      if(this.tableData4[0]) {
        const tableInfo = JSON.parse(JSON.stringify(this.tableData4[0]))
        Object.keys(tableInfo).forEach(item=>{
          if(tableInfo[item] instanceof Array){
            tableInfo[item] = []
          }else if(tableInfo[item] instanceof Object){
            tableInfo[item] = {}
          } else {
            tableInfo[item] = ''
          }
        })
        item = {...tableInfo}
        // console.log('添加SKU',item)
      }
      this.tableData4.push(item)
    },
    // 点击删除行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 复制
    handleCopy(item) {
      let copyItem = JSON.parse(JSON.stringify(item))
      copyItem.id = ''; //复制的对象id设为空
      this.tableData4.push(copyItem);
    },
    // 点击取消返回
    cancel() {
      this.$emit("cancel");
    },
    /**
     * 新建、编辑 物料
     */
    saveEdit(formName, addType, operate) {
      // 七个半私有云环境需增加对供应商必填的校验
      // console.log('bossUnitId',this.bossUnitId)
      // console.log(this.tableData4)
      if(this.bossUnitId === 'd7fd1f7f3f6948d7ac9021873a38d09e'){
        const supplierList = this.tableData4.map(item=>{
          return item.suppliers
        })
        const checkSupplier = supplierList.some(item=>{
          if(item[0]){
            return item[0].supplierId
          }
        })
        // console.log('供应商信息',supplierList,checkSupplier)
        if(!checkSupplier){
          return this.$message.error('请填写供应商')
        }
      }
      
      if (this.isAutomaticMaterial) {
        this.handlerIsCheckedMaterialName().then(() => {
          this.updateedPage(formName, addType, operate)
        })
      } else {
        this.updateedPage(formName, addType, operate)
      }
    },
    /**
     * 新建、编辑 物料 更新页面
     */
    updateedPage(formName, addType, operate) {
      // 提交前检查数据
      for (let i = 0; i < this.tableData4.length; i++) {
        // 检查默认损耗率
        if (this.tableData4[i].mlossRate == "") {
          this.tableData4[i].mlossRate = 0
        }
        if (this.tableData4[i].mlossRate && this.tableData4[i].mlossRate * 1 < 0) {
          this.$message.error('第' + (i + 1) + '行物料sku的默认损耗不能为负数')
          return
        }
        if (!this.tableData4[i].colorId) {
          this.$message.error('请选择第' + (i + 1) + '行物料sku的颜色')
          return
        }

        if (!this.tableData4[i].specificationsId) {
          this.$message.error('请选择第' + (i + 1) + '行物料sku的规格')
          return
        }

        if (!this.tableData4[i].stockUnitId) {
          this.$message.error('请选择第' + (i + 1) + '行物料sku的库存单位')
          return
        }
        let currentSuppliers = this.tableData4[i].suppliers
        for (let j = 0; j < currentSuppliers.length; j++) {
          if (!currentSuppliers[j].supplierId) {
            this.$message.error('第' + (i + 1) + '行物料sku的第' + (j + 1) + '个供应商不能为空')
            return
          }
        }
      }

      // 确定提交数据转格式
      for (let i = 0; i < this.tableData4.length; i++) {
        this.tableData4[i].commonAttrstoreList = []
        let dataList = { ...this.tableData4[i]
        }
        // 获取每个lable的key
        this.tableData11.forEach((v, index1) => {
          let dataLabel = {
            lable: v.lable,
          }
          this.tableData4[i].commonAttrstoreList.push(dataLabel)
        })
        // 获取每个值
        for (let key in dataList) {
          for (let j = 0; j < this.label.length; j++) {
            if (key == this.label[j]) {
              if (this.tableData4[i].commonAttrstoreList[j]) {
                this.tableData4[i].commonAttrstoreList[j].attrValue = this.tableData4[i][this.label[j]]
              }
            }
          }
        }
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          const tableListParams = JSON.parse(JSON.stringify(this.tableData4))
          //处理自定义属性中自定义字段
          tableListParams.forEach(item => {
            item.customFields = []
            this.DIYTableColumnList.forEach(info=>{
              if(item[info.customFieldId]){
                const listInfo = {...info}
                switch(info.customFieldType){
                  // 单选属性
                  case 'SINGLE_SELECT':
                    listInfo.selectedOptions = []
                    listInfo.selectedOptions.push({optionId: item[info.customFieldId]})
                    item.customFields.push({...info})
                    break;
                  // 多选属性
                  case 'MULTI_SELECT':
                    listInfo.selectedOptions = []
                    item[info.customFieldId].forEach(ele=>{
                      listInfo.selectedOptions.push({optionId: ele})
                    })
                    item.customFields.push({...info})
                    break
                  //整数型
                  case 'INTEGER':
                    listInfo.numberValue = item[info.customFieldId]
                    break
                  // 小数型
                  case 'DECIMAL':
                    listInfo.numberValue = item[info.customFieldId]
                    break
                  // 单行文本
                  case 'TEXT':
                    listInfo.textValue = item[info.customFieldId]
                    break
                }
                item.customFields.push({...listInfo})
              }
            })

          })
          // console.log('表格提交参数')
          // console.log('表格提交参数',tableListParams)
          this.tableDataList = tableListParams;
          this.ruleForm.commonMaterialsSkuList = this.tableDataList;
          let api = savedMaterials
          let params = {
            ...this.ruleForm,
            userId: this.userId,
            unitId: this.unitId,
            addType,
            attachmentList: this.attachmentLists,
            attachments: this.attachments
          };
          if (this.isEdit) {
            api = editMaterials
            params.id = this.$route.params.id //当前点击的物料id
          }
          this.isSubmitting = true
          // 点击确定保存
          api(params).then(res => {
            //保存并继续按钮防重复提交
            this.isSubmitting = false
            if (res.data.code == 0) {
              if (this.isEdit) {
                this.$emit("confirm");
                this.$message.success("编辑成功");
              } else {
                //新增的物料数组
                const newMaterialsArr = res.data.commonMaterials.commonMaterialsSkuList;
                this.$emit("updateBoMTable", newMaterialsArr);
                this.$emit("success", newMaterialsArr, this.isConfig);

                this.$message.success("新建成功");
                //保存并继续
                if (operate === 'continue') {
                  this.$refs['ruleForm'].resetFields();
                  this.ruleForm.kindId = '';
                  this.ruleForm.no = '';
                  this.ruleForm.name = '';
                  this.materialValueCopy = ''
                  this.ruleForm.styleIds = [];
                  // console.log('保存继续',this.tableData4[0])
                  const tableInfo = JSON.parse(JSON.stringify(this.tableData4[0]))
                  Object.keys(tableInfo).forEach(item=>{
                    if(tableInfo[item] instanceof Array){
                      tableInfo[item] = []
                    }else if(tableInfo[item] instanceof Object){
                      tableInfo[item] = {}
                    } else {
                      tableInfo[item] = ''
                    }
                  })
                  this.tableData4 = [{...tableInfo}]
                }
                //保存
                else {
                  this.$emit("confirm");
                }
              }

            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          this.$message.error("请填写必填字段");
          return false;
        }
      });
    },
    // 查询物料分类下拉列表
    async getMaterielClassifyList() {
      let params = {
        pageNum: 0,
        pageSize: 0,
        userId: this.userId
      };
      await listMaterialsKinds(params).then(res => {
        this.materialKindList = res.data.kindsList;
        // 编辑获取下拉数据  ====>看来看去没发现有什么作用，暂时注释
        // this.materialKindList.forEach((v, index) => {
        //     if (v.id == this.$route.query.id) {
        //         if (v.commonMaterialsKindsAttrsList) {
        //             v.commonMaterialsKindsAttrsList.forEach((v2, y) => {
        //                 let lable = v2.lable
        //                 this.label.push(lable)//保存lable是为了当数据保存提交添加key，为了解决保存数据格式，格式值对应
        //                 this.tableData12.forEach((v3, i) => {
        //                     if (y == i) {
        //                         if (v2.lable == v3.lable) {
        //                             this.tableData12[i].mandatory = v2.mandatory//保存必填或选填的字段
        //                             if (v2.commonAttrstoreOptionsList) {
        //                                 this.tableData12[i].commonAttrstoreOptionsList = []
        //                                 this.tableData12[i].commonAttrstoreOptionsList.push(...v2.commonAttrstoreOptionsList)
        //                             }
        //                         }
        //                     }
        //
        //                 })
        //             })
        //         }
        //     }
        // })
        // this.tableData11 = this.tableData12
      });
    },
    //图片上传逻辑
    imgUpload(e, index) {
      const _this = this;
      let params = {
        appId: this.$globalConfig.appId.appId
      };
      const file = e.target.files;
      for (let i = 0; i < file.length; i++) {
        if (file[i].size > 5000000) {
          _this.$message({
            showClose: true,
            message: "图片大小超过5M!,重新上传",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
          return false;
        }
        getUploadToken(params).then(res => {
          var params2 = new FormData();
          params2.append("file", file[i]);
          params2.append("token", res.data.uptoken);
          params2.append("key", this.setImgKey(file[i].name));
          upDetailImgs(params2, {}).then(result => {
            const _imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
            var palams = {
              path: _imgUrl
            }
            if (!_this.tableData4[index].commonMaterialsPictureList) {
              _this.tableData4[index].commonMaterialsPictureList = []
            }
            _this.tableData4[index].commonMaterialsPictureList.push(palams);
            // console.log(_this.tableData4[index].commonMaterialsPictureList);
            _this.imgArrLength.push(_this.tableData4[index].commonMaterialsPictureList.length)
            _this.tableData4[index].commonMaterialsSkuPicture = _imgUrl;
          });
        });
      }
    },
    //md5图片上传Key的拼接
    setImgKey(name) {
      const storeId =
        this.$store.state.userInfo.id || this.userId;
      const date = +new Date() + "";
      return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
    },
    // 获取颜色列表
    getColors() {
      let params = {
        userId: this.userId,
        type: "color"
      };
      getFacCommonSettings(params).then(res => {
        for (let i = 0; i < res.data.data.color.length; i++) {
          if (res.data.data.color[i].name != "" && res.data.data.color[i].value != "") {
            res.data.data.color[i].name = res.data.data.color[i].value + "-" + res.data.data.color[i].name
          }
        }
        this.colors = res.data.data.color;
      });
    },
    // 筛选物料分类
    filterMaterailClassifyList(val) {
      if (val) {
        //val存在
        this.materialKindList = this.backupMaterialKindList.filter(item => {
          if (
            !!~item.no.toLowerCase().indexOf(val.toLowerCase()) ||
            !!~item.name.toLowerCase().indexOf(val.toLowerCase())
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.materialKindList = this.backupMaterialKindList;
      }
    },
    // 获取体系层物料规格列表
    getMaterialSpecList() {
      return new Promise((resolve,reject)=>{
        let params = {
          userId: this.userId
        };
        listCommonMaterialsSpecifications(params).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].no != "" && res.data[i].remark != "") {
              res.data[i].no = res.data[i].no + "-" + res.data[i].remark
            }
          }
          this.materialSpecList = res.data;
          resolve()
        });
      })
      
    },
    // 获取库存单位列表
    getStockUnitList() {
      return new Promise((resolve,reject)=>{
        let params = {
          userId: this.userId,
          type: 1
        };
        listCommonMaterialsAttr(params).then(res => {
          if (res.data.length) {
            this.stockUnitList = res.data;
            resolve()
          }
        });
      })
    },
    // 提交新建库存单位
    comfirmAddStockUnit() {
      let type = this.addUnit.type
      this.$refs['addUnit'].validate(valid => {
        if (valid) {
          this.isSaving = true;
          let params = {
            name: this.addUnit.unitValue,
            userId: this.userId
          };
          addStockUnit(params).then(res => {
            this.isSaving = false;
            if (res.data.code == 0) {
              if (type === 'StockUnit') {
                this.tableData4[this.index].stockUnitId = res.data.data
                if (this.tableData4[this.index].purchaseUnitId) {
                  let name = this.stockUnitList.find(v => this.tableData4[this.index].purchaseUnitId === v.id).name
                  if (name == '码' && this.addUnit.unitValue == '米') {
                    this.tableData4[this.index].conversionRate = 0.9144
                    this.inputDisabled = true
                  } else {
                    this.tableData4[this.index].conversionRate = ''
                    this.inputDisabled = false
                  }
                }
              }
              if (type === 'PurchaseUnit') {
                this.tableData4[this.index].purchaseUnitId = res.data.data
                if (this.tableData4[this.index].stockUnitId) {
                  let name = this.stockUnitList.find(v => this.tableData4[this.index].stockUnitId === v.id).name
                  if (name == '米' && this.addUnit.unitValue == '码') {
                    this.tableData4[this.index].conversionRate = 0.9144
                    this.inputDisabled = true
                  } else {
                    this.tableData4[this.index].conversionRate = ''
                    this.inputDisabled = false
                  }
                }
              }
              // this.ruleForm.stockUnitId = res.data.data;
              this.getStockUnitList();
              this.addUnit.visible = false;
              this.$refs['addUnit'].resetFields();
              this.$message.success("新建成功");
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error",
                duration: this.$globalConfig.elementUI.duration
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 提交新建物料规格
    comfirmAddMaterialSpec() {
      this.isSaving = true;
      let params = {
        userId: this.userId,
        no: this.addMaterialSpecForm.no,
        remark: this.addMaterialSpecForm.remark
      };
      addOrUpdateCommonMaterialsSpecifications(params).then(res => {
        this.isSaving = false;
        if (res.data.code == 0) {
          this.tableData4[this.index].specificationsId = res.data.data
          this.getMaterialSpecList();
          this.addMaterialSpecForm.visible = false;
          this.$message.success("新建成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 提交新建物料分类
    confirmAddMaterialClassify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isSaving = true;
          let params = {
            no: this.addMaterialClassifyForm.no,
            name: this.addMaterialClassifyForm.name,
            userId: this.userId
          };
          addOrUpdateMaterialsKinds(params).then(res => {
            this.isSaving = false;
            if (res.data.code == 0) {
              this.ruleForm.kindId = res.data.data;
              this.addMaterialClassifyForm.visible = false;
              this.getMaterielClassifyList();
              this.$refs[formName].resetFields();
              this.$message.success("新建成功");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
                duration: this.$globalConfig.elementUI.duration
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 点击删除当前图片
    cancelImg(index, imgIndex) {
      this.tableData4[index].commonMaterialsPictureList.splice(imgIndex, 1);
    },
    // 拼接文字
    formatLabel(start, end) {
      if (!end) {
        return start;
      } else {
        return start + "-" + end;
      }
    },
    // 检查体系层是否有此物料款号
    checkMaterialNo() {
      let params = {
        no: this.ruleForm.no, //当前物料输入值
        userId: this.userId,
        unitId: this.unitId,
        commonMaterialId: this.$route.params.id, //体系层物料id（编辑物料场景下传参）
      };
      judgeRepeatMaterialNo(params).then(res => {
        if (res.data.code == 1) {
          this.theImport = res.data.data;
          this.isImportVisible = true;
        } else if (res.data.code == 2) {
          this.ruleForm.no = "";
          this.$message({
            showClose: true,
            message: "本厂已有该物料款号",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
        }
      });
    },
    // 导入
    confirmImport() {
      let params = {
        commonMaterialId: this.theImport,
        userId: this.userId,
        unitId: this.unitId
      };
      importMaterial(params).then(res => {
        if (res.data.code == 0) {
          this.$message.success("导入成功");
          this.$emit("confirm");
        }
      });
    },
    //  动态修改上传图片框的宽度
    labelHead(h, {
      column,
      index
    }) {
      var maxLength = 0;
      for (let i = 0; i < this.imgArrLength.length; i++) {
        if (this.imgArrLength[i] > maxLength) {
          maxLength = this.imgArrLength[i]
        }

      }
      column.minWidth = 220 + (maxLength - 1) * 100 //注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
      //然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
      return h('div', {
        class: 'table-head',
        style: {
          width: '100%'
        }
      }, [column.label])

    },
    // 展开折叠触发的事件
    expandRow(row, expanded) {
      if (expanded) {
        // this.getSupArr()
      }
      row.expanded = expanded
      // console.log(row, expanded)
    },
    /**
     * 是否自动生成物料名称
     */
    handlerIsCheckedMaterialName(value) {
      return new Promise((resolve, reject) => {
        //自动生成
        if (this.isAutomaticMaterial) {
          const params = {
            bossUnitId: this.bossUnitId,
          }
          // 设置颜色参数
          const colorID = this.tableData4[0].colorId
          this.colors.forEach(item => {
            const colorList = item.colorList.filter(info => {
              return info.id === colorID
            })
            if (colorList.length > 0) {
              params[25] = colorList[0].id
            }
          })
          // 设置规格参数
          const specID = this.tableData4[0].specificationsId
          const selectSpec = this.materialSpecList.filter(item => {
            return item.id === specID
          })
          if (selectSpec[0]) {
            params[26] = selectSpec[0].id
          }
          if (this.ruleForm.kindId) {
            // 设置物料分类参数
            const selectKind = this.materialKindList.filter(item => {
              return item.id === this.ruleForm.kindId
            })[0] || {}
            params[24] = selectKind.id
            // 设置自定字段单选属性参数
            const singInfo = this.DIYTableColumnList.filter(item=>{
              return item.customFieldType === 'SINGLE_SELECT'
            })
            singInfo[0]?params[singInfo[0].customFieldId] = this.tableData4[0][singInfo[0].customFieldId]:''
          }
          // 设置物料名称
          automaticCreateMaterialName(params).then(res => {
            if (res.data.code === 0) {
              this.automaticMterialName = res.data.data
              this.$set(this.ruleForm, 'name', res.data.data)
              resolve()
            } else {
              this.$message.error(res.date.msg)
            }
          })
        } else {
          // console.log('不自动生成')
          if (this.ruleForm.name !== this.materialValueCopy) {
            this.$set(this.ruleForm, 'name', this.materialValueCopy)
            resolve()
          }
        }
      })

    },
    /**
     * 物料名称change事件
     */
    handlerMaterialNameChange(value) {
      // console.log('物料change触发')
      // console.log(value)
      this.materialValueCopy = value
    }
  },
  async created() {
    this.getSupplierSelect()
    this.getBillReviewConfig()
    await this.getColors(); //颜色下拉数据
    await this.getMaterialSpecList(); //请求规格下拉数据
    await this.getStockUnitList(); //库存列表下拉数据
    await this.getRuleList() //检查是否开启自动编号
    await this.getMaterielClassifyList(); //物料分类下拉数据
    // 物料编辑从新调接口
    if (this.isEdit) {
      await this.materialDetails();
      this.setDIYTypeValue()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.DIY_input {
  width: 100%;

  input {
    font-size: 12px;
    width: 100%;
    padding: 3px 10px;
    outline: 0;
    box-sizing: border-box;
  }

  input::-webkit-input-placeholder {
    color: rgb(158, 168, 194);
  }

}

.addmaterial-info {
  position: fixed;
  height: 100%;
  left: 200px;
  right: 0;
  top: 0;
  z-index: 2005;
  overflow-y: auto;
  background-color: #fff;
}

.upload-img-content {
  p {
    margin-bottom: 12px;

    span {
      position: relative;
      color: #8492a6;
      font-size: 14px;

      span {
        position: relative;
        top: 8px;
        left: 10px;
        color: #fff;
      }
    }

    .upload-file {
      display: inline-block;
      width: 70px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      color: #fff;
      background-color: #1ca1ff;
      border: solid 1px #1ca1ff;

      &:hover {
        background: #1ca1ff;
        border: solid 1px #1ca1ff;
      }
    }

    input {
      opacity: 0;
      position: absolute;
      width: 60px;
      height: 100%;
      z-index: -999999;
    }
  }

  ul {
    display: inline-block;
    padding: 4px 0 0 4px;
    max-width: 800px;

    li {
      width: 48px;
      height: 48px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 4px;
      position: relative;

      &:hover {
        .face .imgCancel {
          display: inline-block;
        }
      }

      .face {
        position: relative;
        display: inline-block;
        height: 100%;
        width: 100%;

        .imgCancel {
          position: absolute;
          display: none;
          top: -5px;
          right: -5px;
          cursor: pointer;
          height: 12px;
          width: 12px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .faceSelect {
          position: absolute;
          bottom: 0;
          height: 26px;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }

      img {
        width: 100%;
        max-height: 80px;
        border-radius: 2px;
      }
    }
  }
}
</style><style lang="scss">
.addmaterial-info {
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

  .add-suppler-btn {
    line-height: 32px;
    margin: 4px 10px;
    cursor: pointer;
  }

  // 图片预览
  .pre-img {
    min-width: 1010px;
    padding-bottom: 5px;
    border-radius: 4px;
    position: relative;

    .el-dialog {
      box-shadow: none;
    }

    .el-dialog--small {
      background-color: transparent;
      width: 100%;
      top: 5% !important;
    }

    .el-dialog__body {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .el-dialog__headerbtn .el-dialog__close {
      font-size: 24px;
      position: absolute;
      right: 60px;
      top: -18px;
      z-index: -1;
    }

    .imgs {
      height: 600px;
      display: flex;
      transition: all 1s;
      justify-content: center;
      align-items: center;
      user-select: none;

      img {
        max-width: 700px;
        max-height: 700px;
      }
    }

    .el-icon-arrow-left {
      cursor: pointer;
      font-size: 48px;
      color: #ccc;

      &:hover {
        color: #fff;
      }
    }

    .el-icon-arrow-right {
      cursor: pointer;
      font-size: 48px;
      color: #ccc;

      &:hover {
        color: #fff;
      }
    }
  }
}

// 控制默认样式修改
.addmaterial-info {
  .add-material-table {
    .el-table {
      .el-input__inner {
        border: none;
      }

      .bd-bottom {
        border-bottom: none;

        .el-form-item {
          margin-bottom: 0;

          .el-form-item__content {
            margin-left: 0 !important;
            line-height: 0;

            >p {
              margin-bottom: 0;

              .add_photo {
                .upload-file {
                  background-color: #fff !important;
                  border: none !important;
                  color: #1ca1ff !important;
                }
              }
            }
          }
        }
      }
    }

    .el-table__empty-text {
      left: 25%;
    }

    .input-shrinkage {
      display: inline-block;
      width: 50px;

      .el-input__inner {
        padding: 0;
        width: 100%;
      }
    }
  }

  .custom-filter-form {
    .el-form-item {
      margin-bottom: 22px;
    }
  }
}
</style>
