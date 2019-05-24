<template>
    <div class="new-bom">
        <!--头-->
        <div class="header">
            <page-title :title="title">
                <span class="header_right">
                  <nf-button @click="cancel">取消
                  </nf-button>
                  <nf-button v-if="!bomReviewConfig || from !== 'goodsFile'" type="warning" :loading="btnLoading" @click="determine(2)">保存
                  </nf-button>
                  <nf-button v-if="bomReviewConfig && from === 'goodsFile'"  :loading="btnLoading" @click="determine(0)">存草稿
                  </nf-button>
                  <nf-button v-if="bomReviewConfig && from === 'goodsFile'" type="warning" :loading="btnLoading" @click="determine(1)">提报
                  </nf-button>
                </span>
            </page-title>
        </div>
        <!--头部end-->
        <!-- 主体 -->
        <div class="content">
            <div class="content-header clearfix">
                <span><i style="color: red">*</i> BOM表名称 </span>
                <el-input
                        @blur="checkRepeat"
                        class="bom-name-input"
                        :disabled="source=='orderProduction'|| source==='editOrderBomVisible' || (from ==='missionOrder'&&title==='编辑BOM表')"
                        v-model.trim="inputBom"
                        placeholder="请输入BOM表名称">
                </el-input>
                <!--工单编辑BOM和订单编辑BOM才显示此checkbox-->
                <span v-if="title === '编辑BOM表' && (from === 'missionOrder' || from === 'productionOrder')"
                      class="checkbox-update">
                    <nf-button type="warning" plain  @click="updateMaterial = true">商品档案BOM / 物料需求更新</nf-button>
                    <!--<el-checkbox v-model="checkboxUpdateBom">商品档案BOM / 物料需求更新</el-checkbox>-->
                </span>

            </div>
            <!-- 数据表格 -->
            <div class="isTable">
                <el-table
                        :data="tableData4"
                        border
                        stripe
                        :maxHeight="isTableHeight"
                        style="width: 100%"
                        :row-class-name="tableRowClassName">
                    <el-table-column
                            v-for="item in listTitle" :key="item.fieldId"
                            :label="columnName(item)"
                            :class-name="columnClass(item.fieldName)"
                            :min-width="getColumnWidth(item.fieldName)">
                        <template slot-scope="scope">
                            <div v-if="item.fieldName === '图片'">
                                <div class="upload-img-content" v-if="scope.row.editFlag">
                                    <ul v-if="scope.row.commonMaterialsPictureList">
                                        <li @click.stop="imgListAdd(scope.$index,index)"
                                            v-for="(item,index) of scope.row.commonMaterialsPictureList"
                                            :key="index">
                                            <a class="face">
                                                <i class="imgCancel"
                                                   @click.stop="cancelImg(scope.$index,index)">
                                                    <img src="../../../../static/el-icon-close@3x.png">
                                                </i>
                                                <img style="width: 48px;height: 48px;" :src="item.path">
                                            </a>
                                        </li>
                                    </ul>
                                    <p style='display: inline-block'>
                                    <span class="add_photo">
                                        <input type="file"
                                               accept="image/png,image/jpeg,image/jpg,image/gif"
                                               :id="'file-upload'+scope.$index" multiple
                                               @change="imgUpload($event, scope.$index)">
                                        <label class="upload-file" :for="'file-upload'+scope.$index">点击上传</label>
                                    </span>
                                    </p>
                                </div>
                                <div v-else>
                                    <img v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                         @click="imgList(scope.row)"
                                         :src="scope.row.commonMaterialsPictureList[0].path">
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '物料分类'">
                                <div v-if="scope.row.editFlag">
                                    <el-select
                                            popper-class="kindSelect"
                                            v-model="scope.row.commonMaterialsKindsId"
                                            filterable
                                            clearable
                                            @change="changeKinds(scope.$index)"
                                            placeholder="请选择物料分类">
                                        <p
                                                v-if="addMaterialPower"
                                                class="create-new-item"
                                                @click="showAddMaterialDialog(scope.$index)">新建</p>
                                        <el-option v-for="item in materialKindList" :value="item.id"
                                                   :label="formatLabel(item.no,item.name)" :key="item.no">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.kindsName || scope.row.kindsNo}}</span>
                                    <span>{{scope.row.kindName|| scope.row.kindNo}}</span>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '物料款号'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="不填则自动生成"
                                       @input="changeMaterialsNo(scope.$index)"
                                       v-model.trim="scope.row.materialsNo">
                                <span v-else>{{scope.row.materialsNo}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '物料名称'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       @input="changeMaterialsName(scope.$index)"
                                       v-model.trim="scope.row.materialsName">
                                <span v-else>{{scope.row.materialsName}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '供应商'">
                                <div v-if="scope.row.editFlag">
                                    <el-select
                                            @visible-change="v => {if(!v)remoteSupplierName=''}"
                                            popper-class="supplierSelect"
                                            v-model.trim="scope.row.supplierName"
                                            placeholder="请选择或搜索"
                                            filterable
                                            clearable
                                            remote
                                            :remote-method="remoteMethod"
                                            :loading="loading"
                                            @change="supSelectChange(scope.$index)">
                                        <el-option
                                                v-if="addSupplierPower"
                                                :value="''"
                                                disabled
                                                style="cursor:pointer;">
                                            <div style="width: 100%;height: 100%;"
                                                 @click="showAddSupplierDialog(scope.$index)">
                                                <span style="display: inline-block;width: 100%;color: #ff9c38;">新建</span>
                                            </div>
                                        </el-option>
                                        <el-option
                                                v-for="item in supOptions"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.name">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.supplierName}}</span>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '供应商款号'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       @input="changeSupplierStyleNo(scope.$index)"
                                       v-model.trim="scope.row.supplierStyleNo">
                                <span v-else>{{scope.row.supplierStyleNo}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '供应商色号'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       @input="changeSupplierColorNo(scope.$index)"
                                       v-model.trim="scope.row.supplierColorNo">
                                <span v-else>{{scope.row.supplierColorNo}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '颜色'">
                                <div v-if="scope.row.editFlag">
                                    <colorSelectGroup
                                            :SingleElection="true"
                                            v-model="scope.row.colorId"
                                            @colorChange="colorChange($event, scope.$index)"
                                            :groupData="colors">
                                    </colorSelectGroup>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '规格'">
                                <div v-if="scope.row.editFlag">
                                    <el-select
                                            popper-class="specificationsSelect"
                                            placeholder="请选择"
                                            filterable
                                            clearable
                                            @change="specificationsIdChange(scope.$index)"
                                            v-model.trim="scope.row.specificationsId">
                                        <el-option
                                                v-if="addSpecificationsPower"
                                                class="create-new-item"
                                                @click.native="showAddSpecificationsDialog(scope.$index)">新建</el-option>
                                        <el-option
                                                v-for="item in materialSpecList"
                                                :key="item.id"
                                                :label="item.no?item.no:item.remark"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div v-else>
                                    <span>{{scope.row.specificationsRemark || scope.row.specificationsName}}</span>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '单位'">
                                <el-select
                                        popper-class="unitSelect"
                                        v-if="scope.row.editFlag"
                                        clearable
                                        v-model="scope.row.stockUnitId"
                                        @change="changeUnit(scope.$index)"
                                        placeholder="请选择">
                                    <el-option class="create-new-item"
                                               @click.native="showAddUnitDialog(scope.$index)">新建</el-option>
                                    <el-option
                                            v-for="item in unitList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                                <span v-else>{{scope.row.stockUnitName || scope.row.unit}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '单件用量'">
                                <div class="div_input_shu single">
                                    <el-input
                                            :disabled="scope.row.authStatus === 1 || scope.row.hasBillPurchase"
                                            v-model.trim="scope.row.singleDosage"
                                            type="number"
                                            step="0.01"
                                            placeholder="请输入">
                                    </el-input>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '损耗'">
                                <div class="div_input_shu loss">
                                    <el-input
                                            :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase"
                                            v-model.trim="scope.row.lossRate"
                                            placeholder="0">
                                    </el-input>
                                    <span>%</span>
                                </div>
                            </div>
                            <div v-else-if="item.fieldName === '用于货品颜色'">
                                <el-select
                                        :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase"
                                        @change="colorM(scope.row.styleColorIdList,scope.$index,tableData4[scope.$index].styleColorIdList)"
                                        v-model="scope.row.styleColorIdList" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in ColorList"
                                            :key="item.id"
                                            :label="item.name?item.name:item.value"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="item.fieldName === '用于货品尺码'">
                                <el-select
                                        :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase"
                                        @change="colorM(scope.row.styleSizeIdList,scope.$index,tableData4[scope.$index].styleSizeIdList)"
                                        v-model="scope.row.styleSizeIdList" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in SizeList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="item.fieldName === '用于货品内长'">
                                <el-select
                                        :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase"
                                        @change="colorM(scope.row.styleStandardIdList,scope.$index,tableData4[scope.$index].styleStandardIdList)"
                                        v-model="scope.row.styleStandardIdList" multiple placeholder="请选择">
                                    <el-option
                                            v-for="item in StandardList"
                                            :key="item.value"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-else-if="item.fieldName === '主料'">
                                <input style="width: 20px;height: 15px;background: #fff;" type="checkbox" v-model="scope.row.main">
                            </div>
                            <div v-else-if="item.fieldName === '参考单价'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       v-model.trim="scope.row.planCost">
                                <span v-else>{{scope.row.planCost}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '净幅宽'">
                                <input
                                        v-if="scope.row.editFlag"
                                        placeholder="请输入"
                                        v-model.trim="scope.row.netWidth">
                                <span v-else>{{scope.row.netWidth ? scope.row.netWidth : '-'}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '克重'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       v-model.trim="scope.row.gweight">
                                <span v-else>{{scope.row.gweight ? scope.row.gweight : '-'}}</span>
                            </div>
                            <div v-else-if="item.fieldName === '备注'">
                                <input v-if="scope.row.editFlag"
                                       placeholder="请输入"
                                       v-model.trim="scope.row.remark">
                                <span v-else :title="scope.row.remark" style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap">{{scope.row.remark}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!--操作-->
                    <el-table-column
                            label="操作"
                            fixed="right"
                            width="200">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.isSearchLine">
                                <div v-if="!scope.row.editFlag">
                                    <template v-if="scope.$index !== 0">
                                        <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="shiftUp(scope.$index)">上移</el-button>
                                        <span class="operate-line">|</span>
                                    </template>
                                    <template v-if="scope.$index !== tableData4.length - 2">
                                        <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="shiftDown(scope.$index)">下移</el-button>
                                        <span class="operate-line">|</span>
                                    </template>
                                    <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="editRow(scope.$index)">编辑</el-button>
                                    <span class="operate-line">|</span>
                                    <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="handleChangeSupplier(scope.row, scope.$index)">换供应商</el-button>
                                    <span class="operate-line">|</span>
                                    <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn operate-btn-del" @click="deleteRow(scope.row,scope.$index)">删除</el-button>
                                </div>
                                <div v-else>
                                    <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="cancelEdit(scope.$index)">取消</el-button>
                                    <span class="operate-line">|</span>
                                    <el-button :disabled="scope.row.authStatus === 1 || isCommiting || scope.row.hasBillPurchase" class="operate-btn operate-btn-save" @click="saveRow(scope.$index)">保存</el-button>
                                </div>
                            </div>
                            <div v-else>
                                <el-button :disabled="scope.row.authStatus === 1|| scope.row.hasBillPurchase" class="operate-btn" @click="emptySearchLine(scope.$index)">清空</el-button>
                                <span class="operate-line">|</span>
                                <el-button :disabled="scope.row.authStatus === 1 || isCommiting || scope.row.hasBillPurchase" class="operate-btn operate-btn-save" @click="saveRow(scope.$index)">保存</el-button>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 悬浮添加组件 -->
            <add-bom ref="addBomRef"
                     from="createBomTable"
                     :facMissionId="facMissionId"
                     :facPreOrderId="facPreOrderId"
                     :keyword="searchLineKeyword"
                     :parentTableData="tableData4"
                     :styleId="styleId_id"
                     @tableData4='handleSelectOne'
                     @select-all="handleSelectAll">
            </add-bom>
        </div>

        <nf-button v-if="isBomData &&source!=='orderProduction' && $route.query.type!=='goodsSample'" class="delete-btn"  @click="comfirmDelete">删除BOM表</nf-button>

        <!--删除确认框-->
        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除该物料？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :loading="delLoading" type="primary" @click="determineDelete()">确 认</el-button>
            </div>
        </el-dialog>
        <materialAndGoodsBomUpdate
                ref="BomUpdateRef"
                @updateMaterialBtn="updateMaterialBtn"
                :easyBomList="bomList"
                :updateMaterial.sync="updateMaterial"
                :updateMaterialData="updateMaterialData"
                :alterPurchaseDemand="bomData && bomData.alterPurchaseDemand">
        </materialAndGoodsBomUpdate>

        <!--供应商选择组件-->
        <supplier-change
                :visible.sync="changeSupplierShow"
                :materialRow="materialRow"
                @confirm="updateSupplierData">
        </supplier-change>

        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add
                    v-if="addSupplierShow"
                    type="add"
                    :supplierName="remoteSupplierName"
                    @update="getNewSup"
                    @hiddenWindow="cancelAdd"
                    @hideCover="cancelAdd">
            </add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="cancelAdd"></div>
        </transition>

        <!--保存物料弹窗-->
        <el-dialog
                title="保存物料"
                class="save-material-dialog"
                :visible.sync="saveMaterialDialogVisible"
                :modal-append-to-body="false"
                size="tiny">
            <div class="save-main">
                <p class="save-text">已存在该物料sku，你可以选择：</p>
                <ul class="save-items">
                    <li><el-radio class="radio" v-model="saveMaterialRadio" label="0">直接使用已存在的物料</el-radio></li>
                    <li><el-radio class="radio" v-model="saveMaterialRadio" label="1">将当前填写的信息保存到原有物料上</el-radio></li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSaveMaterial">取 消</el-button>
                <el-button type="primary" @click="commitSaveMaterial">确 定</el-button>
            </span>
        </el-dialog>

        <!--BOM表存在编辑态行，提示弹窗-->
        <warn-dialog
                :visible.sync="warnVisible"
                :message="warnMessage"
                type="3"
                :loading="btnLoading"
                @cancel="warnDialogCancel"
                @confirm="warnDialogConfirm">
        </warn-dialog>

        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!--新建物料弹窗-->
        <add-material-dialog
                :visible.sync="addMaterialDialog"
                @updateMaterial="updateMaterialSelect">
        </add-material-dialog>

        <!--新建规格弹窗-->
        <add-specifications-dialog
                :visible.sync="addSpecificationsDialog"
                @updateSpecifications="updateSpecificationsSelect">
        </add-specifications-dialog>

        <!--新建单位弹窗-->
        <add-unit-dialog
                :visible.sync="addUnitDialog"
                @updateUnit="updateUnitSelect">
        </add-unit-dialog>

    </div>
</template>

<script>
    import {
        defaultMaterialsSkus, //新建BOM时检查所有的固定用料
        bomQueryRepeatName, //设计档案bom名称查重
        sampleDeleteBom, //样衣档案删除BOM
        bomDelete, //设计档案删除BOM
        designStyleSkuList, //设计档案添加BOM下拉接口
        bomCreate, //设计档案添加BOM
        bomUpadate, //设计档案编辑bom
        toAddBoomData, //新建提交数据接口
        searchSkuType, //sku下拉值接口
        updataBoomData, //编辑接口
        delectBomData, //删除接口
        editFacMissionBom, //工单BOM表编辑接口
        deleteGoodsClothesBom, //删除商品里面的样衣详情里面的bom
        easyBomList,
        bomMaterialsList, // 设计列表编辑bom
        listCommonMaterialsAttr, //单位下拉数据接口
        updateBomMaterialsSku,  //商品档案bom表保存编辑后的物料
        updateSplDesignBomMaterialsSku,  //设计档案bom表保存编辑后的物料
        updateMissionBomMaterialsSku,  //工单bom表保存编辑后的物料
        updatePrdOrderBomMaterialsSku,  //订单bom表保存编辑后的物料
        bomDetail,
        canDeleteBomSku, // 检查生产订单bom的sku能不能删除
        getUploadToken, //获取七牛云上传token
        upDetailImgs, //上传图片的接口
        listMaterialsKinds, //物料分类下拉接口
        listCommonMaterialsSpecifications, //规格下拉数据接口
        addMaterialsLine,   //物料行新增
        getFacUnitSettings, //获取全部sku
        billReviewConfig, //审核配置
        getCommonBomConfig, //bom字段审核配置
        getCommonSkuAttrList,
    } from "@/api/api";
    import { searchSupplier, materialsSkulistByStyle } from '@/api/material.js'
    import warnDialog from '@/components/Common/dialog/warnDialog';
    import addBom from "./addBom.vue"; //悬浮添加组件
    import supplierChange from "@/components/goods/goodsBom/supplierChange.vue"; //换供应商组件
    import addMaterialDialog from "@/components/goods/goodsBom/addMaterialDialog.vue"; //新建物料组件
    import addSpecificationsDialog from "@/components/goods/goodsBom/addSpecificationsDialog.vue"; //新建规格组件
    import addUnitDialog from "@/components/goods/goodsBom/addUnitDialog.vue"; //新建单位组件
    import add from '@/components/material/materialSupplier/add.vue';
    import md5 from "js-md5";
    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    export default {
        props: ["bomData", "title", "styleId", "type", 'sampleId', 'goodsStyleNo','source','designId','editId','from','facMissionId','facPreOrderId'],
        /**********************************
         facMissionId: 生产工单id
         facPreOrderId: 生产订单id
         designId: 计算属性后变为designStyleId,设计档案标识
         source: 'orderProduction'一个值，生产订单标识
         title: 有三个值，分别代表不同的操作场景
         1.'新建BOM表'
         2.'复制BOM表'
         3.'编辑BOM表'
         type:   1.editor 工单编辑
         2.editor1 其他编辑
         from: 调用此组件的所有标识
         1.生产工单：missionOrder
         2.生产订单：productionOrder
         3.设计档案：designFile
         4.样衣档案：clothesFile
         5.商品档案：goodsFile
         （...以后新增在此继续补充）
         ***********************************/
        components: {
            addBom,
            add,
            supplierChange,
            warnDialog,
            addMaterialDialog,
            addSpecificationsDialog,
            addUnitDialog,
        },
        data() {
            return {
                listTitle:[],
                bomConfigFieldName:[],
                bomReviewConfig:false,
                bomDataBf:[],
                checkBomDataSkus:'',
                checkBomName:'',
                // visibleChangeStatus: false,
                updateMaterial: false,
                delLoading: false,
                btnLoading: false,
                centerDialogVisible: false,     //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                isBomData: false,               //判读删除BOM表显示与隐藏
                inputBom: "",                    //BOM名称
                StandardList: [],                //内长下拉值
                styleColorIdList: [],            //颜色下拉所有值
                styleSizeIdList: [],             //尺码下拉所有值
                isDeleteVisible: false,         //确定删除的弹框显示和隐藏
                tableData4: [],                 //表格列表数据
                //搜索行初始值
                searchStartVal:{
                    "specificationsId": "",
                    "specificationsNo":"",
                    "specificationsName":"",
                    "stockUnitId": "",
                    "planCost": "",
                    "colorId": "",
                    "colorName":"",
                    "commonMaterialsPictureList": [],
                    "supplierId": "",
                    "supplierName": "",
                    "supplierStyleNo": "",
                    "supplierColorNo": "",
                    "gweight": "",
                    "netWidth": "",
                    "remark": "",
                    "stockUnitName": "",
                    "materialsNo": "",
                    "materialsName": "",
                    "commonMaterialsKindsId": "",
                    "kindsNo": "",
                    "kindsName": "",
                    "singleDosage": null,
                    "lossRate": "",
                    "styleColorIdList": [ "ALL" ],
                    "styleSizeIdList": [ "ALL" ],
                    "styleStandardIdList": [ "ALL" ],
                    "isSearchLine": true,
                    "editFlag": true
                },
                //搜索行选择的搜索值
                searchLineKeyword:{},
                //搜索行初始值
                startKeyword:{
                    "materialsKindsId":"",
                    "materialsNo": "",
                    "materialsName": "",
                    "supplierId": "",
                    "supplierStyleNo": "",
                    "supplierColorNo": "",
                    "colorId": "",
                    "specificationsId": ""
                },
                searchCurrentVal:{},             //搜索行当前值
                ColorList: [],                   //颜色下拉数据
                SizeList: [],                    //尺码下拉数据
                id: "",                          //编辑保存BOM的id
                styleId_id: "",                  //BOM表所属款号id（必须）
                commonBomId: '',                 //工单表编辑名称id
                facMissionId: '',                //工单编辑默认传的id
                isRepeat: false,
                bomName: '',
                bomId:'',                        //生产订单的下拉框的bomId
                bomList:[],                      //生产订单的下拉框的bomId列表
                styleId:[],                      //生产订单的styleId
                singleFocus: false,             //单件用量是否选中
                backupCommonMaterialsSkuList:[], //备份工单bom未修改的数据，用于编辑工单bom，保存时判断是否有修改
                addSupplierShow: false,         //新建供应商组件
                changeSupplierShow: false,      //修改供应商弹窗组件
                unitList: [],                   //单位下拉数据
                newSupplierArr:[],              //新建供应商成功后返回的供应商数据
                materialRow:{},                 //换供应商选中的某条物料数据
                editStorages:[],                //临时保存编辑的数据
                changeSupplierIndex:'',         //记录修改供应商信息数据所在的下标
                materialKindList: [],           //物料分类下拉数据
                supOptions: [],                 //供应商下拉数组
                colors: [], //颜色下拉数据
                materialSpecList: [], //规格下拉数据
                saveMaterialDialogVisible: false,    //保存物料弹窗
                warnVisible: false,
                warnMessage:'BOM表还未保存，请问是否要保存？',
                saveMaterialRadio:'0',              //保存物料弹窗值类型，0:不处理； 1:更新物料sku
                materialSaveCurrentParams:{},       //临时存储，用于物料保存接口的参数
                checkboxUpdateBom: true,               //工单、订单编辑是否更新bom选项
                isCommiting: false,             //提交状态
                materialsData:[],    //弹窗是否更新物料时候的sku备份
                centerDialogVisibleAdd: false, //判断显示图片预览显示与隐藏
                imgListsAdd: [],
                imgIndexAdd: 0,
                rowIndex: '',               //记录选中的行，新建物料，供应商，规格，单位，颜色时使用
                addMaterialDialog: false,   //新建物料弹窗
                addSpecificationsDialog: false,   //新建规格弹窗
                handleAddSupplierFlag: false,   //用来标识是否点击了供应商按钮
                addUnitDialog: false,   //新建单位弹窗
                remoteSupplierName:'',        //远程搜索组件输入的供应商名称
                updateMaterialData:{
                    updateMaterialChecked: true,
                    updateMaterialRadio: 'noUpdateBom',
                    updateMaterialInput: '',
                },
                timer: '',
                loading: false,
                isTableHeight:700
            };
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            sessionObj(){
                return JSON.parse(sessionStorage.getItem("user_login"));
            },
            designStyleId() {
                let designStyleId = this.$route.query.designStyleId ? this.$route.query.designStyleId : this.designId
                return designStyleId
            },
            //bom表超过8个就不给新建
            bomListLength: function () {
                return this.bomList ? this.bomList.length : 0;
            },
            userId: function(){
                return this.sessionObj.userId;
            },
            unitId(){
                return this.sessionObj.unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            addMaterialPower(){
                let datalist = this.sessionObj.permissionList;
                if (datalist.indexOf("fac.materials.add") == -1) {
                    return false
                }else{
                    return true
                }
            },
            addSupplierPower(){
                let datalist = this.sessionObj.permissionList;
                if (datalist.indexOf("fac.supplier.add") == -1) {
                    return false
                }else{
                    return true
                }
            },
            addSpecificationsPower(){
                let datalist = this.sessionObj.permissionList;
                if (datalist.indexOf("fac.common.settings.getFacCommonSettings") == -1) {
                    return false
                }else{
                    return true
                }
            },
        },
        directives: {
            // focus: {
            //     inserted: (el, {value}) => {
            //         if (value) {
            //             //由于是饿了么的el-input，需要拿到父元素下面的input
            //             el.firstElementChild.focus();
            //         }
            //     }
            // }
        },
        watch: {
            goodsStyleNo() {
                this.getBomName();

            },
            'styleId': function (val) {
                this.getCommonBomList();
            },
            // bomId(val){
            //     if(this.source==='editOrderBomVisible' || (this.from ==='missionOrder'&&this.title==='编辑BOM表')){
            //         this.getBomData(val)
            //     }
            // }
        },
        methods: {
            //返回列名
            columnName(item){
                if(item.fieldName === '单件用量' ||
                    item.fieldName === '损耗' ||
                    item.fieldName === '用于货品颜色' ||
                    item.fieldName === '用于货品尺码' ||
                    item.fieldName === '用于货品内长'){
                    return `* ${item.fieldName}`
                }else{
                    return item.fieldName
                }
            },
            //指定列加class
            columnClass(columnName){
                if(columnName === '单件用量' ||
                    columnName === '损耗' ||
                    columnName === '用于货品颜色' ||
                    columnName === '用于货品尺码' ||
                    columnName === '用于货品内长'){
                    return 'edit-bg'
                }else{
                    return ''
                }
            },
            // 指定列设置宽度
            getColumnWidth(columnName){
                let width = 110
                switch (columnName){
                    case '图片' :width = 80; break;
                    case '物料分类' :width = 110; break;
                    case '物料款号' :width = 110; break;
                    case '物料名称' :width = 110; break;
                    case '供应商' :width = 110; break;
                    case '供应商款号' :width = 110; break;
                    case '供应商色号' :width = 110; break;
                    case '颜色' :width = 110; break;
                    case '规格' :width = 110; break;
                    case '单位' :width = 110; break;
                    case '单件用量' :width = 70; break;
                    case '损耗' :width = 60; break;
                    case '用于货品颜色' :width = 150; break;
                    case '用于货品尺码' :width = 150; break;
                    case '用于货品内长' :width = 150; break;
                    case '主料' :width = 40; break;
                    case '净幅宽' :width = 60; break;
                    case '克重' :width = 60; break;
                    case '首单实际单耗' :width = 100; break;
                    case '参考单价' :width = 100; break;
                    case '备注' :width = 120; break;
                }
                return width
            },
            //搜索颜色
            colorRemoteMethod(query) {
                if(this.timer){
                    clearTimeout(this.timer)
                }
                if (query !== '') {
                    this.loading = true;
                    this.timer = setTimeout(() => {
                        this.loading = false;
                        let params = {
                            facId: this.facId,
                            type: "color",         //all:全部属性 color：颜色  size:尺码  length：内长
                            keyword: query,
                        };
                        getCommonSkuAttrList(params).then(res => {
                            if (res.data.code === 0) {
                                this.colors = res.data.data.color;
                            }
                        });
                    }, 500);
                } else {
                    this.colors = [];
                }
            },
            handleFilter(row) {
                console.log(row,'==3=3=3=3');
                if (!row.styleColorIdList) {
                    row.styleColorIdList = ['ALL']; //颜色
                }
                if (!row.styleSizeIdList) {
                    row.styleSizeIdList = ['ALL']; //尺码
                }
                if (!row.styleStandardIdList) {
                    row.styleStandardIdList = ['ALL']; //内长
                }
                row.singleDosage = row.defaultDosage  // 标准用量复值给单件用量
                let flag = true;
                for (var j = 0; j < this.tableData4.length; j++) {
                    if ((row.id == this.tableData4[j].id) || (row.id == this.tableData4[j].materialsSkuId)) {
                        flag = false;
                    }
                }
                if (flag) {
                    //每行增加光标选中标识
                    this.singleFocus = true;

                    //每行增加编辑标识
                    row.editFlag = false;

                    this.tableData4.splice(this.tableData4.length-1, 0, row);
                }
            },
            //bom字段配置
            dynamicbomConfigGet(){
                getCommonBomConfig({ userId: JSON.parse(sessionStorage.getItem("user_login")).userId}).then(res=>{
                    let dynamicAllItem = res.data.data.fields.filter(item=>item.required);
                    this.bomConfigFieldName = dynamicAllItem.map(item=>item.fieldName)
                    this.listTitle = res.data.data.configs.filter(item => item.name !== '首单实际单耗');
                })
            },
            //是否有审核台
            getBillReviewConfig(){
                billReviewConfig({unitId:JSON.parse(sessionStorage.getItem("last_login")).id}).then(res=>{
                    console.log(res);
                    if(res.data.code === 0) {
                        if (res.data.data.configs && res.data.data.configs.length > 0) {
                            //是否有审核台
                            this.bomReviewConfig = res.data.data.configs.some(v => v.billType == 'COMMON_BOM')

                        }
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            checkIsChange(){
                //验证值是否有改变 工作台有用到 value = false就是没改变
                let value = false;
                if(this.title === '新建BOM表'){
                    if(this.inputBom || this.tableData4.length>1){
                        value = true
                    }
                }else {
                    //编辑bom
                    //要提交的物料数据
                    let materialsData = JSON.parse(JSON.stringify(this.tableData4));
                    //删除搜索行
                    materialsData.splice(materialsData.length - 1, 1);
                    materialsData.forEach(item=>{
                        delete item.editFlag
                    });
                    let checkBomDataSkus = JSON.parse(this.checkBomDataSkus);
                    if(materialsData.length!==checkBomDataSkus.length) {
                        //长度不一样直接判定有变化
                        return true
                    }
                    //数据处理。因为匹配的数据前台的可能是空数组但是后台的有时候是null 和空数组所以统一转null
                    checkBomDataSkus.forEach(item=>{
                        for (let k in item){
                            if(item[k]instanceof Array && !item[k].length){
                                item[k] = null;
                            }
                        }
                    });
                    materialsData.forEach(item=>{
                        for (let k in item){
                            if(item[k]instanceof Array && !item[k].length){
                                item[k] = null;
                            }
                        }
                    });
                    if(JSON.stringify(checkBomDataSkus)!==JSON.stringify(materialsData) || this.checkBomName !== this.inputBom ){
                        value = true
                    }
                }
                return value

            },
            //新建物料
            showAddMaterialDialog(index){
                this.rowIndex = index;
                $(".kindSelect").css('display','none');
                this.addMaterialDialog = true
            },
            //更新物料
            updateMaterialSelect(data){
                this.tableData4[this.rowIndex].commonMaterialsKindsId = data;
                this.getMaterielClassifyList();
            },
            //新建供应商
            showAddSupplierDialog(index) {
                this.rowIndex = index;
                $(".supplierSelect").css('display','none');
                this.handleAddSupplierFlag = true;
                this.addSupplierShow = true;
            },
            // 新建规格
            showAddSpecificationsDialog(index) {
                this.rowIndex = index;
                $(".specificationsSelect").css('display','none');
                this.addSpecificationsDialog = true;
            },
            //更新规格
            updateSpecificationsSelect(data){
                this.tableData4[this.rowIndex].specificationsId = data;
                this.getMaterialSpecList();
            },
            // 新建库存单位
            showAddUnitDialog(index) {
                this.rowIndex = index;
                $(".unitSelect").css('display','none');
                this.addUnitDialog = true
            },
            //更新库存单位
            updateUnitSelect(data){
                this.tableData4[this.rowIndex].stockUnitId = data;
                this.getStockUnitList();
            },
            //隐藏保存物料弹窗
            cancelSaveMaterial(){
                this.saveMaterialDialogVisible = false;
            },
            //确定保存物料
            commitSaveMaterial(){
                this.isCommiting = true;
                this.saveMaterialDialogVisible = false;
                let params = {
                    opType: this.saveMaterialRadio,
                    ...this.materialSaveCurrentParams
                };
                addMaterialsLine(params).then(res => {
                    this.isCommiting = false;
                    if(res.data.code === 0){
                        //初始化返回的物料数据
                        let resData = res.data.commonMaterialsSkuList[0];
                        resData.styleColorIdList = ['ALL'];
                        resData.styleSizeIdList = ['ALL'];
                        resData.styleStandardIdList = ['ALL'];
                        resData.editFlag = false;
                        //先判断提交的物料是否已存在bom表中
                        let rowIndex = this.tableData4.findIndex((item) =>{
                            return item.id === resData.id;
                        });
                        //已存在
                        if(rowIndex > -1){
                            // 不做任何处理
                            if(this.saveMaterialRadio === "0"){
                                //普通行
                                if(!params.isSearchLine){
                                    let cancelRow = this.tableData4[params.index];
                                    this.editStorages.forEach((item, i) =>{
                                        if(item.id === cancelRow.id){
                                            this.tableData4.splice(params.index, 1 ,item);
                                            //重新给bom表增加搜索行和清空搜索值
                                            this.setSearchLine();
                                            //数据还原后，删除此条数据
                                            this.editStorages.splice(i, 1);
                                        }
                                    });
                                }
                            }
                            //信息插入到匹配相同物料sku的行内
                            else{
                                //如果没有编辑物料权限，直接退出
                                if (!this.powerJudgement.permissions("fac.materials.update")) {
                                    return
                                }
                                //搜索行
                                if(params.isSearchLine){
                                    delete resData.isSearchLine;
                                    this.tableData4.splice(rowIndex, 1, resData);
                                }
                                //普通行
                                else{
                                    this.tableData4.splice(rowIndex, 1, resData);
                                    //重新给bom表增加搜索行和清空搜索值
                                    this.setSearchLine();
                                }
                            }
                        }
                        //不存在
                        else{
                            //如果没有新增物料权限，直接退出
                            if (!this.powerJudgement.permissions("fac.materials.add")) {
                                return
                            }
                            // 编辑行保存成功后，插入到搜索行的前一行
                            if(params.isSearchLine){
                                delete resData.isSearchLine;
                                this.tableData4.splice(this.tableData4.length - 1, 0 ,resData);
                            }
                            // 普通行保存成功后，变为展示态
                            else{
                                this.tableData4.splice(params.index, 1 ,resData);
                                //重新给bom表增加搜索行和清空搜索值
                                this.setSearchLine();
                            }
                        }
                        //还原接口临时参数和弹窗单选默认值
                        this.materialSaveCurrentParams = {};
                        this.saveMaterialRadio = "0";
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg)
                    }
                });
            },
            //给bom表增加搜索行
            setSearchLine(){
                let searchItem = JSON.parse(JSON.stringify(this.searchStartVal));
                this.tableData4.push(searchItem);
                //设置搜索行的初始搜索值
                this.searchLineKeyword = {...this.startKeyword};
            },
            //根据已选供应商id，获取供应商name
            supSelectChange(index){
                let row = this.tableData4[index];
                const supplierName = row.supplierName;
                this.supOptions.forEach(item => {
                    if(item.name === supplierName){
                        row.supplierId = item.id;
                    }
                });
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.supplierId = this.tableData4[this.tableData4.length - 1].supplierId;
                }
            },
            //获取供应商数组
            getSupArr(){
                if(this.tableData4.length){
                    this.tableData4.forEach(item => {
                        let supObj = {};
                        supObj.id = item.supplierId;
                        supObj.name = item.supplierName;
                        if(!this.supOptions.some(v => v.id === item.supplierId)) {
                            this.supOptions.push(supObj);
                        }
                    });
                }
            },
            //根据已选物料分类id，获取物料分类name
            changeKinds(index){
                let row = this.tableData4[index];
                const kindsId = row.commonMaterialsKindsId;
                this.materialKindList.forEach(item => {
                    if(item.id === kindsId){
                        row.kindsNo = item.no;
                        row.kindsName = item.name;
                    }
                });
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.materialsKindsId = this.tableData4[this.tableData4.length - 1].commonMaterialsKindsId;
                }
            },
            //物料款号
            changeMaterialsNo(index){
                let row = this.tableData4[index];
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.materialsNo = this.tableData4[this.tableData4.length - 1].materialsNo;
                }
            },
            //物料名称
            changeMaterialsName(index){
                let row = this.tableData4[index];
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.materialsName = this.tableData4[this.tableData4.length - 1].materialsName;
                }
            },
            //供应商款号
            changeSupplierStyleNo(index){
                let row = this.tableData4[index];
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.supplierStyleNo = this.tableData4[this.tableData4.length - 1].supplierStyleNo;
                }
            },
            //供应商色号
            changeSupplierColorNo(index){
                let row = this.tableData4[index];
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.supplierColorNo = this.tableData4[this.tableData4.length - 1].supplierColorNo;
                }
            },
            //颜色
            colorChange(colorData, index){
                this.colors = colorData;
                let row = this.tableData4[index];
                const colorId = row.colorId;
                this.colors.forEach(item =>{
                    item.colorList.forEach(items => {
                        if(items.id === colorId){
                            row.colorName = items.name;
                        }
                    });
                });
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.colorId = this.tableData4[this.tableData4.length - 1].colorId;
                }
            },
            //规格
            specificationsIdChange(index){
                let row = this.tableData4[index];
                const specificationsId = row.specificationsId;
                this.materialSpecList.forEach(item => {
                    if(item.id === specificationsId){
                        row.specificationsNo = item.noName;
                        row.specificationsName = item.remark;
                    }
                });
                //判断是否是搜索行
                if(row.isSearchLine){
                    this.searchLineKeyword.specificationsId = this.tableData4[this.tableData4.length - 1].specificationsId;
                }
            },
            // 获取体系层物料规格列表
            getMaterialSpecList() {
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
                });
            },
            // 获取颜色列表
            getColors() {
                let params = {
                    facId: this.facId,
                    type: 'all',
                };
                //设计档案用designStyleId
                if(this.designId){
                    params.designStyleId = this.designStyleId
                }
                //其他用styleId
                else{
                    params.styleId = this.styleId
                }
                getFacUnitSettings(params).then(res => {
                    if(res.data.code == 0){
                        this.colors = res.data.data.color
                    }
                })
            },
            //供应商搜索
            remoteMethod(query) {
                // if (query !== '') {
                    //保存搜索的值，当调用新建供应商组件时赋值给供应商名称
                    this.loading = true;
                    setTimeout(() => {
                        this.handleSupplierData(query)
                    }, 200);
                // }else {
                //     this.supOptions = [];
                // }
            },
            async handleSupplierData(query) {
                let params = {
                    unitId: this.unitId,
                    keyword: query
                };
               await searchSupplier(params).then(res => {
                    this.loading = false;
                    if (res.data.code === 0) {
                        this.supOptions = res.data.data;
                        if(res.data.data.some(v => v.name === query)) {
                            this.remoteSupplierName = '';
                        }else {
                            this.remoteSupplierName = query;
                        }
                    }else{
                        this.supOptions = [];
                        this.remoteSupplierName = query;
                    }
                });
            },
            // 查询物料分类下拉列表
            getMaterielClassifyList() {
                let params = {
                    pageNum: 0,
                    pageSize: 0,
                    userId: this.userId
                };
                listMaterialsKinds(params).then(res => {
                    this.materialKindList = res.data.kindsList;
                });
            },
            // 拼接文字
            formatLabel(start, end) {
                if(!start){
                    return end;
                }else if(!end) {
                    return start;
                }else{
                    return start + " - " + end;
                }
            },
            //图片预览
            imgListAdd(rowIndex, index) {
                this.imgIndexAdd = index;
                this.imgListsAdd = this.tableData4[rowIndex].commonMaterialsPictureList;
                this.centerDialogVisibleAdd = true;
            },
            // 点击删除当前图片
            cancelImg(index, index2) {
                this.tableData4[index].commonMaterialsPictureList.splice(index2, 1);
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
                            };
                            _this.tableData4[index].commonMaterialsPictureList.push(palams);
                        });
                    });
                }
            },
            //md5图片上传Key的拼接
            setImgKey(name) {
                const storeId = this.$store.state.userInfo.id || this.userId;
                const date = +new Date() + "";
                return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
            },
            getBomData(val){
                // if(!this.visibleChangeStatus) return;
                let params = {
                    userId: this.$store.state.userInfo.id,
                    commonBomId: val
                };
                bomDetail(params).then(res => {
                    if(res.data.commonBom){
                        this.tableData4 = res.data.commonBom.commonMaterialsSkuList;
                    }
                });
            },
            // visibleChange(val){
            //     if(val){
            //         this.visibleChangeStatus=true
            //     }
            // },
            //单位选择
            changeUnit(index){
                let row = this.tableData4[index];
                const unitId = row.stockUnitId;
                this.unitList.forEach(item => {
                    if(item.id === unitId){
                        row.stockUnitName = item.name;
                    }
                });
            },
            //增加编辑标识符
            setEditFlag(){
                this.tableData4.forEach((item, index) =>{
                    // if(index === this.tableData4.length - 1){
                    //     item.editFlag = true;
                    // }else{
                    //     item.editFlag = false;
                    // }
                    item.editFlag = false;
                })
            },
            //获取库存单位列表
            getStockUnitList() {
                let params = {
                    userId: this.userId,
                    type: 1
                };
                listCommonMaterialsAttr(params).then(res => {
                    if (res.data.length) {
                        this.unitList = res.data;
                    }
                });
            },
            //打开供应商侧滑栏
            showAdd(){
                this.addSupplierShow = true;
            },
            //关闭供应商侧滑栏
            cancelAdd() {
                this.addSupplierShow = false;
            },
            //获取新建的供应商
            getNewSup(val){
                //点击了物料行的新建供应商按钮触发
                if(this.handleAddSupplierFlag){
                    this.supOptions.push(val);
                    this.tableData4[this.rowIndex].supplierName = val.name;
                    this.handleAddSupplierFlag = false;
                }
                //换供应商触发
                else{
                    this.newSupplierArr.push(val);
                }
            },
            //更新供应商信息
            updateSupplierData(data){
                const row = this.tableData4[this.changeSupplierIndex];
                row.supplierId = data.supplierId;
                row.supplierName = data.supplierName;
                row.supplierStyleNo = data.supplierStyleNo;
                row.supplierColorNo = data.supplierColorNo;
                row.planCost = data.planCost;
                row.excludingTaxPrice = data.excludingTaxPrice;
            },

            //生产订单
            getCommonBomList(type) {
                let params = {
                    styleId: this.styleId,
                    userId: this.$store.state.userInfo.id,
                    name: ""
                };
                easyBomList(params).then(res => {
                    this.bomList = res.data.commonBomList;
                    if (this.bomList) {
                        if (type == "create") {
                            this.bomId = this.bomList[this.bomList.length - 1].id;
                        } else {
                            if(this.source==='editOrderBomVisible'){
                                this.bomId = this.bomData.commonBomId;
                            }else {
                                this.bomId = this.bomList[0].id;
                            }

                        }
                    }
                });
            },
            //设计档案BOM名称查重
            async checkRepeat(){
                if(this.designStyleId) {
                    if ((this.inputBom == '' || this.bomName == this.inputBom) && this.title != '复制BOM表') {
                        this.isRepeat = false
                        return
                    }
                    await bomQueryRepeatName(
                        {
                            designStyleId: this.designStyleId,
                            name: this.inputBom
                        }).then(res => {
                        if(res.data.code==1){
                            this.isRepeat = true
                            this.$message.error(res.data.msg)
                        }else {
                            this.isRepeat = false
                        }
                    })
                }
            },
            getBomName() {
                if (this.goodsStyleNo && this.title != '复制BOM表') {
                    this.inputBom = this.goodsStyleNo;
                } else {
                    this.inputBom = "";
                }
            },
            // 图片预览
            imgList(row) {
                this.imgIndex = 0;
                this.imgLists=row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            // 判断选中全部颜色或者未选中全部颜色的方法,第一个值是你传的当前点击数据，第二个是索引，第三个是你表格原数据
            colorM(item, index, arr) {
                if (item.length > 1 && arr[0] == "ALL") {
                    for (let i = 0; i < item.length; i++) {
                        if (item[i] == "ALL") {
                            item.splice(i, 1);
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j] == "ALL") {
                                    arr.splice(j, 1);
                                }
                            }
                        }
                    }
                    return;
                }
                for (let i = 0; i < item.length; i++) {
                    if (item[i] == "ALL") {
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j] != "ALL") {
                                arr.splice(j, 1);
                            }
                        }
                    }
                }
            },
            // 处理提交的参数结构
            handlerParams(arr, _arr) {
                if (arr.length) {
                    if (arr[0] == 'ALL') {
                        let temp = _arr.map(v => {
                            return v.id
                        })
                        temp.splice(0, 1)
                        //设计档案颜色，内长，尺码选全部的时候返回“ALL”,暂时不用，先注释
                        // let temp = [];
                        // temp.push('ALL');
                        return temp
                    } else {
                        return arr
                    }
                } else {
                    return []
                }
            },
            checkSkuEmpty(obj) {
                if (obj.styleSizeIdList.length && !obj.styleColorIdList.length) {
                    return true
                }
                if (!obj.styleSizeIdList.length && obj.styleColorIdList.length) {
                    return true
                }
                if (!obj.styleStandardIdList.every(item => (item == '36fec3286377458bb445d0a287cd8e0e')) &&
                    (!obj.styleColorIdList.length || !obj.styleSizeIdList.length)) {
                    //内长有选中除'无'之外的内长 并且颜色或者尺码为空
                    return true
                }
                if((obj.styleSizeIdList.length && obj.styleColorIdList.length)&&!obj.styleStandardIdList.length&&!this.StandardList.some(v => (v.id=='36fec3286377458bb445d0a287cd8e0e'))){
                    return true
                }
            },
            //判断bom表物料数据是否都为展示态
            allCommmitMaterialsShow(data){
                //所有物料都为展示态时，返回true否则为false
                let status = data.every(item =>{
                    return item.editFlag === false
                });
                return status
            },
            // 数据提交
            async determine(addType) {
                if(!addType){
                    //节点和设计工作台的时候没有这个字段
                    if(this.bomReviewConfig){
                        //配置了审核台
                        addType = 0
                    }else {
                        addType = 2
                    }
                }
                //要提交的物料数据
                let materialsData = JSON.parse(JSON.stringify(this.tableData4));
                //删除搜索行
                if(materialsData[materialsData.length - 1].isSearchLine){
                    materialsData.splice(materialsData.length - 1, 1);
                }
                //需要保存bom的物料数据条数
                let materialsNum = materialsData.length;
                //bom表只有搜索行时，不允许提交
                if(materialsNum === 0){
                    this.$message.error("请添加物料");
                    return
                }
                //有多条物料
                else{
                    let isAllShow = this.allCommmitMaterialsShow(materialsData);
                    //有物料行处于编辑态，不允许提交
                    if(!isAllShow){
                        this.$message.error("请先保存物料");
                        return
                    }
                    //所有物料行都为展示态
                    else{
                        if (!this.inputBom) {
                            this.$message.error("请填写BOM表名称");
                            return;
                        }
                        if(this.isRepeat){
                            this.$message.error("BOM名称重复");
                            return;
                        }
                        await this.checkRepeat()
                        for (let i = 0; i < materialsData.length; i++) {
                            if (!materialsData[i].lossRate) {
                                materialsData[i].lossRate = 0
                            }
                            if(this.designStyleId){
                                if(this.checkSkuEmpty(materialsData[i])){
                                    this.$message.error((materialsData[i].styleColorIdList.length?(materialsData[i].styleSizeIdList.length?'内长':'尺码'):'颜色')+'不能为空')
                                    return
                                }
                            }else{
                                if (materialsData[i].styleColorIdList.length == 0) {
                                    this.$message.error("请选择用于货品颜色");
                                    return;
                                }
                                if (materialsData[i].styleSizeIdList.length == 0) {
                                    this.$message.error("请选择用于货品尺码");
                                    return;
                                }
                                if (materialsData[i].styleStandardIdList.length == 0) {
                                    this.$message.error("请选择用于货品内长");
                                    return;
                                }
                                if (!materialsData[i].singleDosage) {
                                    this.$message.error("请填写单件用量");
                                    return;
                                }
                            }
                        }
                        let flag= false;
                        this.btnLoading = true
                        // 新建BOM和复制BOM
                        if (this.title == "新建BOM表" || this.title == "复制BOM表") {
                            //设计档案页面
                            if (this.designStyleId) {
                                let skus = materialsData.map(v => {
                                    return {
                                        main: v.main,
                                        singleDosage: v.singleDosage || '',
                                        lossRate: v.lossRate || 0,
                                        materialsId: v.commonMaterialsId || v.materialsId,
                                        supplierId: v.supplierId ,
                                        materialsSkuId: v.id || v.materialsSkuId,
                                        colorIds: this.handlerParams(v.styleColorIdList, this.ColorList),
                                        sizeIds: this.handlerParams(v.styleSizeIdList, this.SizeList),
                                        standardIds: this.handlerParams(v.styleStandardIdList, this.StandardList).length ? this.handlerParams(v.styleStandardIdList, this.StandardList) : ["36fec3286377458bb445d0a287cd8e0e"]
                                    }
                                })
                                let params = {
                                    addType,     ////v2.4新增添加类型参数 0-存为草稿,1-提报审核,2-保存
                                    unitId: this.unitId,
                                    skus: skus,
                                    userId: this.userId,
                                    designStyleId: this.designStyleId, //设计档案id（必须）
                                    name: this.inputBom //Bom名称
                                };
                                if (this.$route.query.id) {
                                    //样衣档案页面需要多加样衣ID
                                    params.sampleId = this.$route.query.id
                                }
                                await  bomCreate(params).then(res => {
                                    this.btnLoading = false;
                                    this.warnVisible = false;
                                    if (res.data.code == 0) {
                                        flag = true
                                        this.$message.success("新建成功");
                                        this.$emit("cancel", false);
                                        this.$emit('onSample', res.data.data)
                                    } else {
                                        this.$message.error(res.data.msg);
                                    }
                                })
                            }
                            else {
                                let params = {
                                    addType,     ////v2.4新增添加类型参数 0-存为草稿,1-提报审核,2-保存
                                    unitId: this.unitId,
                                    commonMaterialsSkuList: materialsData,
                                    userId: this.userId,
                                    styleId: this.styleId_id,
                                    name: this.inputBom
                                };
                                if (this.sampleId) {
                                    params.sampleId = this.sampleId
                                }
                                toAddBoomData(params).then(res => {
                                    this.btnLoading = false;
                                    this.warnVisible = false;
                                    if (res.data && res.data.code == 0) {
                                        flag = true
                                        this.$message.success("新建成功");
                                        this.$emit("cancel", false);
                                        this.$emit('success', res.data.commonBom.id,this.bomReviewConfig);
                                    } else {
                                        this.$message.error(res.data.msg);
                                    }
                                });
                            }
                            return flag
                        }
                        // 生产订单编辑BOM
                        if(this.source=='orderProduction'){
                            let params = {
                                addType,     ////v2.4新增添加类型参数 0-存为草稿,1-提报审核,2-保存
                                unitId: this.unitId,
                                commonMaterialsSkuList: materialsData,
                                name: this.inputBom, //Bom名称
                                id: this.id, //BOM表id（必须）
                                bomList : this.bomList, //此订单包含的全部bom列表名称
                            };
                            //勾选了商品档案BOM更新checkbox才显示弹窗
                            this.$emit('orderProductionTableEdit',params,this.updateMaterialData);
                            return
                        }
                        // 设计档案编辑BOM
                        if ((this.type == "editor1" && this.designStyleId) && this.title != "复制BOM表") {
                            let skus = materialsData.map(v => {
                                return {
                                    main: v.main,
                                    supplierId: v.supplierId,
                                    singleDosage: v.singleDosage || '',
                                    lossRate: v.lossRate || 0,
                                    materialsId: v.commonMaterialsId || v.materialsId,
                                    materialsSkuId: v.id || v.materialsSkuId,
                                    colorIds: this.handlerParams(v.styleColorIdList, this.ColorList),
                                    sizeIds: this.handlerParams(v.styleSizeIdList, this.SizeList),
                                    standardIds: this.handlerParams(v.styleStandardIdList, this.StandardList).length?this.handlerParams(v.styleStandardIdList, this.StandardList):["36fec3286377458bb445d0a287cd8e0e"]
                                }
                            })
                            let params = {
                                addType,     ////v2.4新增添加类型参数 0-存为草稿,1-提报审核,2-保存
                                unitId: this.unitId,
                                id: this.bomData.id,
                                designStyleId: this.designStyleId,
                                name: this.inputBom,
                                userId: this.userId,
                                version: this.bomData.version,
                                skus: skus
                            }
                            if (this.$route.query.id) {
                                //样衣档案页面需要多加样衣ID
                                params.sampleId = this.$route.query.id
                            }
                            await bomUpadate(params).then(res => {
                                this.btnLoading = false;
                                this.warnVisible = false;
                                if (res.data.code == 0) {
                                    flag = true
                                    this.$message.success("编辑成功");
                                    this.$emit('onSample', res.data.data)
                                    this.$emit("cancel", false);
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                            return flag
                        }
                        // 商品档案编辑BOM
                        if (this.title == "编辑BOM表"&& this.type == "editor1" ||this.title == "启用BOM表"   && this.type == "editor1") {
                            let params = {
                                addType,     ////v2.4新增添加类型参数 0-存为草稿,1-提报审核,2-保存
                                unitId: this.unitId,
                                commonMaterialsSkuList: materialsData,
                                userId: this.userId,
                                styleId: this.styleId_id,
                                name: this.inputBom,
                                id: this.id
                            };
                            await  updataBoomData(params).then(ret => {
                                this.btnLoading = false;
                                this.warnVisible = false;
                                if (ret.data && ret.data.code == 0) {
                                    this.$message.success("编辑成功");
                                    this.$emit("cancel", false);
                                } else {
                                    this.$message.error(ret.data.msg);
                                }
                            });
                            return flag
                        }
                        // 工单编辑BOM表
                        if (this.type == "editor") {
                            //全局指针
                            this.materialsData = materialsData;
                            //更新物料
                            let params = {
                                facMissionId: this.facMissionId,
                                commonMaterialsSkuList: this.materialsData,
                                userId: this.userId,
                                styleId: this.styleId_id, //BOM表所属款号id（必须）
                                commonBomName: this.inputBom, //Bom名称
                                commonBomId: this.commonBomId,//BOM表名称的id
                                id: this.id, //BOM表id（必须）
                                alterPurchaseDemand:false
                            };
                            params.alterPurchaseDemand=this.bomData.alterPurchaseDemand?this.updateMaterialData.updateMaterialChecked:false;
                            if(this.updateMaterialData.updateMaterialRadio!=='noUpdateBom'){
                                params.updateCommonBomId=this.updateMaterialData.updateMaterialRadio;
                                params.saveAsCommonBomName=this.updateMaterialData.updateMaterialInput;
                            }
                            this.editFacMissionBom(params);

                        }

                        // return flag是给调用这个方法弹窗的时候用的

                    }
                }
            },

            //更新物料
            updateMaterialBtn(data){
                this.updateMaterialData = data
                this.updateMaterial = false
            },
            // 修改工单bom
            editFacMissionBom(params){
                editFacMissionBom(params).then(ret => {
                    this.btnLoading = false
                    if (ret.data && ret.data.code == 0) {
                        this.$message.success("编辑成功");
                        this.$emit("cancel", false);
                        this.$emit('success',params.commonBomId,this.bomReviewConfig)
                        // this.$emit('success')
                    } else {
                        this.$message.error(ret.data.msg);
                    }
                    // this.$refs.BomUpdateRef.btnLoading = false
                    this.updateMaterial = false
                });
            },
            // 单选
            handleSelectOne(val, row) {
                console.log(val,row);
                let index = this.tableData4.findIndex(item => (item.materialsSkuId === row.id) || (item.id === row.id));
                //取消勾选的时候，5个必选项恢复默认值
                if (index > -1) {
                    this.tableData4[index].styleColorIdList = ['ALL'];
                    this.tableData4[index].styleSizeIdList = ['ALL'];
                    this.tableData4[index].styleStandardIdList = ['ALL'];  //内长
                    // if (!this.styleStandardIdList && !this.designStyleId) {
                    //     this.tableData4[index].styleStandardIdList = ["36fec3286377458bb445d0a287cd8e0e"]; //内长
                    // } else {
                    //     this.tableData4[index].styleStandardIdList = []
                    // }
                    this.tableData4[index].singleDosage = '';
                    this.tableData4[index].lossRate = '';
                    this.tableData4.splice(index, 1);
                }
                row.lossRate = row.mlossRate;
                for (var i = 0; i < val.length; i++) {
                    if (!val[i].styleColorIdList) {
                        val[i].styleColorIdList = ['ALL']; //颜色
                    }
                    if (!val[i].styleSizeIdList) {
                        val[i].styleSizeIdList = ['ALL']; //尺码
                    }
                    if (!val[i].styleStandardIdList) {
                        val[i].styleStandardIdList = ['ALL']; //内长
                    }
                    // if (!this.styleStandardIdList && !this.designStyleId) {
                    //     val[i].styleStandardIdList = ['ALL']; //内长
                    // }
                    // else {
                    //     if (!val[i].styleStandardIdList) {
                    //         //设计档案新建时，内长默认 all
                    //         val[i].styleStandardIdList = ['ALL'];
                    //     } defaultDosage val[i].fixedMaterials   singleDosage
                    // }
                    val[i].singleDosage = val[i].defaultDosage  // 标准用量复值给单件用量
                    let flag = true;
                    for (var j = 0; j < this.tableData4.length; j++) {
                        if ((val[i].id == this.tableData4[j].id) || (val[i].id == this.tableData4[j].materialsSkuId)) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        //每行增加光标选中标识
                        this.singleFocus = true;

                        //每行增加编辑标识
                        val[i].editFlag = false;

                        this.tableData4.splice(this.tableData4.length-1, 0, val[i]);
                    }
                }
            },
            // 全选传值
            handleSelectAll(val,selData) {
                console.log(val);
                console.log(selData);
                for (let i = 0; i < val.length; i++) {
                    val[i].lossRate = val[i].mlossRate;
                    if (!val[i].styleColorIdList) {
                        val[i].styleColorIdList = ['ALL']; //颜色
                    }
                    if (!val[i].styleSizeIdList) {
                        val[i].styleSizeIdList = ['ALL']; //尺码
                    }
                    if (!val[i].styleStandardIdList) {
                        val[i].styleStandardIdList = ['ALL']; //内长
                    }
                    //每行增加编辑标识
                    val[i].editFlag = false;
                    val[i].singleDosage = val[i].defaultDosage  // 标准用量复值给单件用量
                }
                let dataArr = JSON.parse(JSON.stringify(val));
                let bomIds = [];

                let materialsData = JSON.parse(JSON.stringify(this.tableData4));
                val = val.filter(item => item.purchasePlanStatus !== 1);
                selData = selData.filter(item => item.purchasePlanStatus !== 1);

                materialsData.forEach(item=>{
                    if(item.id){
                        bomIds.push(item.id)
                    }

                });
                if(!val.length && selData.length){
                    //去除全选  删除目前的数据
                    selData.forEach(item=>{
                        if(bomIds.indexOf(item.id) !== -1){
                            materialsData.forEach(($item,index)=>{
                                if($item.id === item.id){
                                    materialsData.splice(index,1)
                                }
                            });
                        }
                    });
                }else {

                    //全选操作
                    dataArr.forEach(item=>{
                        if(bomIds.indexOf(item.id) === -1){
                            materialsData.push(item)
                        }
                    });

                }
                //搜索行换位置
                materialsData.forEach((item,index)=>{
                    if(!item.id){
                        materialsData.splice(index,1)
                        materialsData.push(item)
                    }
                })
                this.tableData4 = materialsData
                console.log(this.tableData4);
                // this.tableData4 = JSON.parse(JSON.stringify(val));
                //在最后一行增加搜索行
                // this.setSearchLine();
            },
            //  删除BOM表弹窗
            comfirmDelete() {
                // 权限
                if (!(this.powerJudgement.permissions("fac.goods.bom.delete")||this.powerJudgement.permissions("fac.spl.design.style.bom.delete"))){
                    return
                }
                this.isDeleteVisible = true;
            },
            // 确定删除
            determineDelete() {
                this.delLoading = true
                if (!this.designStyleId) {
                    // 删除商品里面的bom
                    if (!this.sampleId) {
                        let params = {
                            userId: this.userId,
                            commonBomId: this.id
                        };

                        delectBomData(params).then(ret => {
                            this.delLoading = false
                            this.isDeleteVisible = false;
                            if (ret.data && ret.data.code == 0) {
                                this.$message.success("删除成功");
                                this.$emit("isdelete", true);
                                this.$emit("cancel", false);
                            } else {
                                this.$message.error(ret.data.msg);
                            }
                        });
                    }
                    // 删除商品里面的样衣详情里面的bom的关联关系
                    else {
                        let params = {
                            sampleId: this.sampleId,
                            bomId: this.id
                        }
                        deleteGoodsClothesBom(params).then(res => {
                            this.delLoading = false
                            this.isDeleteVisible = false;
                            if (res.data && res.data.code == 0) {
                                this.$message.success("删除成功");
                                this.$emit("isdelete", true);
                                this.$emit("cancel", false);
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    }
                } else {
                    // 设计档案里面
                    if(this.$route.query.type==='designFile'){
                        //设计档案的核算单
                        this.$emit("isdelete", true);
                        return
                    }
                    if (this.$route.query.id) {
                        // 样衣档案里面
                        sampleDeleteBom({sampleId: this.$route.query.id, bomId: this.$route.query.bomId}).then(res => {
                            this.delLoading = false
                            this.isDeleteVisible = false;
                            if (res.data.code == 0) {
                                this.$message.success("删除成功");
                                this.$emit("isdelete", true);
                                this.$emit("cancel", false);
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    } else {
                        bomDelete({id: this.bomData.id}).then(res => {
                            this.delLoading = false
                            this.isDeleteVisible = false;
                            if (res.data.code == 0) {
                                this.$message.success("删除成功");
                                this.$emit("isdelete", true);
                                this.$emit("cancel", false);
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    }
                }
            },
            cancel() {
                //要提交的物料数据
                let materialsData = JSON.parse(JSON.stringify(this.tableData4));
                //删除搜索行
                if(materialsData[materialsData.length - 1].isSearchLine){
                    materialsData.splice(materialsData.length - 1, 1);
                }
                //需要保存bom的物料数据条数
                let materialsNum = materialsData.length;
                if(materialsNum === 0){
                    this.$emit("cancel", false);
                }else{
                    this.warnVisible = true;
                }
            },
            //不保存bom
            warnDialogCancel(){
                this.hideSearchLine();
                this.$emit("cancel", false);
            },
            //弹窗提示bom表有未保存行，确认保存
            warnDialogConfirm(){
                this.determine();
            },

            //隐藏搜索行
            hideSearchLine(){
                let data = this.tableData4;
                let lastIndex = data.length - 1;    //最后一行的下标值
                //判断最后一行是否为搜索行
                if(data[lastIndex].isSearchLine){
                    this.searchCurrentVal = data.splice(lastIndex, 1)[0];
                }
            },
            //显示搜索行
            showSearchLine(){
                let result = this.tableData4.every(item =>{
                    return item.editFlag === false
                });
                if(result){
                    this.tableData4.push({...this.searchCurrentVal});
                }
                //获取颜色下拉数据
                this.colorRemoteMethod(this.searchCurrentVal.colorName)
            },
            //上移
            shiftUp(index){
                let row = this.tableData4[index];
                let rowData = JSON.parse(JSON.stringify(row));
                this.tableData4.splice(index, 1);
                this.tableData4.splice(index - 1, 0 ,rowData);
            },
            //下移
            shiftDown(index){
                let row = this.tableData4[index];
                let rowData = JSON.parse(JSON.stringify(row));
                this.tableData4.splice(index, 1);
                this.tableData4.splice(index + 1, 0 ,rowData);
            },
            // 编辑行
            editRow(index){
                //点击任意编辑行的按钮，让搜索行隐藏
                this.hideSearchLine();

                let row = this.tableData4[index];
                let rowData = JSON.parse(JSON.stringify(row));  //保存编辑前的数据，用于取消编辑
                this.editStorages.push(rowData);
                row.editFlag = true;
                this.tableData4.splice(index, 1 ,row);
                //获取颜色下拉数据
                this.colorRemoteMethod(row.colorName)
            },
            // 取消编辑行
            cancelEdit(index){
                let cancelRow = this.tableData4[index];
                this.editStorages.forEach((item, i) =>{
                    if(item.id === cancelRow.id){
                        this.tableData4.splice(index, 1 ,item);
                        //数据还原后，删除此条数据
                        this.editStorages.splice(i, 1);
                    }
                });
                // 点击任意取消按钮,遍历整个bom表,只有全部行都为展示态时才显示搜索行
                this.showSearchLine();
            },
            // 删除行
            async deleteRow(row,index) {
                //生产订单校验是否生成采购计划
                if(this.source=='orderProduction'){
                    // 删除前判断是否生产采购计划
                    let params = {
                        orderId: this.$route.query.id,
                        skuId: row.id
                    };
                    await canDeleteBomSku(params).then(res => {
                        if (!res.data.data) {
                            return this.$message.error('已经生成采购计划,不允许删除！')
                        } else {
                            this.$refs['addBomRef'].toggleSelectionFn(this.tableData4[index]);
                            this.tableData4.splice(index, 1);
                        }
                    })
                }
                //其他直接删除
                else{
                    this.$refs['addBomRef'].toggleSelectionFn(this.tableData4[index]);
                    this.tableData4.splice(index, 1);
                }

            },
            //清空搜索行
            emptySearchLine(index){
                let searchItem = JSON.parse(JSON.stringify(this.searchStartVal));
                this.tableData4.splice(index, 1 ,searchItem);
                //搜索行还原初始搜索值
                this.searchLineKeyword = {...this.startKeyword};
            },
            /** 
            * 保存物料
            */
            saveRow(index){
              // 针对七个半环境供应商需必填
              if(this.bossUnitId === 'd7fd1f7f3f6948d7ac9021873a38d09e'){
                const tableInfo = this.tableData4[index]
                // console.log('列表数据',tableInfo)
                if(!tableInfo.supplierId){
                  return this.$message.error('请填写供应商')
                }
              }
              
                this.isCommiting = true;
                let row = this.tableData4[index];
                let params = {...row};
                params.index = index;
                params.userId = this.userId;
                params.unitId = this.unitId;
                params.styleId = this.styleId;
                params.bossUnitId = this.bossUnitId;
                //损耗率不填默认为0
                if(!params.lossRate){
                    params.lossRate = 0;
                }
                addMaterialsLine(params).then(res => {
                    this.isCommiting = false;
                    if(res.data.code === 0){
                        //如果没有新增物料权限，直接退出
                        if (!this.powerJudgement.permissions("fac.materials.add")) {
                            return
                        }
                        // 返回的物料数据
                        let resData = res.data.commonMaterialsSkuList[0];
                        //初始化数据
                        resData.styleColorIdList = ['ALL'];
                        resData.styleSizeIdList = ['ALL'];
                        resData.styleStandardIdList = ['ALL'];
                        resData.editFlag = false;
                        // 编辑行保存成功后，插入到搜索行的前一行
                        if(params.isSearchLine){
                            delete resData.isSearchLine;
                            this.tableData4.splice(this.tableData4.length - 1, 0 ,resData);
                        }
                        // 普通行保存成功后，变为展示态
                        else{
                            this.tableData4.splice(params.index, 1 ,resData);
                            //重新给bom表增加搜索行和清空搜索值
                            this.setSearchLine();
                        }
                        this.$message.success(res.data.msg);
                    }
                    //存在相同的物料
                    else if(res.data.code === 3){
                        //将请求参数保存起来，在物料弹窗的确认按钮请求会用到
                        this.materialSaveCurrentParams = {...params};
                        this.saveMaterialDialogVisible = true;
                    }else{
                        this.$message.error(res.data.msg)
                    }
                });
            },
            // 保存行(旧版物料保存，暂时没用)
            // saveRow1(index) {
            //     let row = this.tableData4[index];
            //     let params = {...row};
            //     params.userId = this.userId;
            //     params.materialsSkuId = params.materialsSkuId;
            //     //工单
            //     if(this.type === 'editor'){
            //         params.facMissionBomId = this.bomData ? this.bomData.id : '';  //新建的时候bom id为空
            //         updateMissionBomMaterialsSku(params).then(res => {
            //             this.updateMaterialsRow(res, row, index);
            //         });
            //     }
            //     //订单
            //     else if(this.source === 'orderProduction'){
            //         params.facPrdOrderGoodsId = this.bomData ? this.bomData.facPrdOrderGoodsId : '';  //新建的时候bom facPrdOrderGoodsId为空
            //         updatePrdOrderBomMaterialsSku(params).then(res => {
            //             this.updateMaterialsRow(res, row, index);
            //         });
            //
            //     }
            //     //设计档案
            //     else if(this.designStyleId){
            //         params.designStyleBomId = this.bomData ? this.bomData.id : '';  //新建的时候bom id为空
            //         updateSplDesignBomMaterialsSku(params).then(res => {
            //             this.updateMaterialsRow(res, row, index);
            //         });
            //     }
            //     //商品档案
            //     else{
            //         params.commonBomId = this.bomData ? this.bomData.id : '';  //新建的时候bom id为空
            //         updateBomMaterialsSku(params).then(res => {
            //             this.updateMaterialsRow(res, row, index);
            //         });
            //     }
            // },
            //保存行，更新物料数据(旧版物料保存，暂时没用)
            // updateMaterialsRow(res, row, index){
            //     if (res.data.code === 0) {
            //         let item = {...row};
            //         item.editFlag = false;
            //         this.tableData4.splice(index, 1 ,item);
            //         this.$message.success('保存成功');
            //
            //         // 保存成功后,遍历整个bom表,只有全部行都为展示态时才显示搜索行
            //         this.showSearchLine();
            //     }else{
            //         this.$message.error(res.data.msg);
            //     }
            // },
            //展开换供应商弹窗
            handleChangeSupplier(row, index){
                this.materialRow = row;
                this.changeSupplierIndex = index;
                this.changeSupplierShow = true;
            },
            //设计档案新建BOM表的下拉数据
            getDesignSkuList() {
                designStyleSkuList({designStyleId: this.designStyleId}).then(res => {
                    let objColor = {
                        id: "ALL",
                        name: "全部颜色",
                        value: ""
                    };
                    let objSize = {
                        id: "ALL",
                        name: "全部尺码",
                        value: ""
                    };
                    let objStandard = {
                        id: "ALL",
                        name: "全部内长",
                        value: ""
                    };
                    if (res.data.data.colors.length) {
                        res.data.data.colors.unshift(objColor)
                    }
                    //设计档案颜色，内长，尺码选全部的时候返回“ALL”,暂时不用，先注释
                    // else{
                    //     res.data.data.colors.unshift(objColor);
                    // }
                    if (res.data.data.sizes.length) {
                        res.data.data.sizes.unshift(objSize)
                    }
                    //设计档案颜色，内长，尺码选全部的时候返回“ALL”,暂时不用，先注释
                    // else{
                    //     res.data.data.sizes.unshift(objSize);
                    // }
                    if (res.data.data.standards.length) {
                        res.data.data.standards.unshift(objStandard)
                    }
                    //设计档案颜色，内长，尺码选全部的时候返回“ALL”,暂时不用，先注释
                    // else{
                    //     res.data.data.standards.unshift(objStandard)
                    // }
                    this.ColorList = res.data.data.colors;
                    this.SizeList = res.data.data.sizes;
                    this.StandardList = res.data.data.standards
                })
            },
            // 获取款号对应的下拉数据
            searchSkuType() {
                let paramsCommonMsg = {
                    userId: this.userId,
                    styleId: this.styleId_id
                };
                searchSkuType(paramsCommonMsg).then(res => {
                    var objColor = {
                        id: "ALL",
                        name: "全部颜色",
                        value: ""
                    };
                    var objSize = {
                        id: "ALL",
                        name: "全部尺码",
                        value: ""
                    };
                    var objStandard = {
                        id: "ALL",
                        name: "全部内长",
                        value: ""
                    };
                    //无内长时显示“全部内长”
                    if (res.data.commonSkuAttrStandardList&&res.data.commonSkuAttrStandardList[0].name == "无" && res.data.commonSkuAttrStandardList.length <= 1) {
                        this.StandardList.push(objStandard);
                    } else {
                        if(!res.data.commonSkuAttrStandardList){
                            res.data.commonSkuAttrStandardList =[]
                        }
                        res.data.commonSkuAttrStandardList.unshift(objStandard);
                        this.StandardList = res.data.commonSkuAttrStandardList; //内长下拉数据
                    }
                    // 控制色名为空的情况
                    for (let i = 0; i < res.data.commonSkuAttrColorList.length; i++) {
                        if (res.data.commonSkuAttrColorList[i].name) {
                            res.data.commonSkuAttrColorList[i].name = res.data.commonSkuAttrColorList[i].value + '-' + res.data.commonSkuAttrColorList[i].name
                        }
                    }
                    res.data.commonSkuAttrColorList.unshift(objColor);
                    res.data.commonSkuAttrSizeList.unshift(objSize);
                    this.ColorList = res.data.commonSkuAttrColorList; //颜色下拉数据
                    this.SizeList = res.data.commonSkuAttrSizeList; //尺码下拉数据
                });
            },

            renderHeader1(){
                return <div class="bom-rander-header"><span>物料分类</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader2(){
                return <div class="bom-rander-header"><span>物料款号</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader3(){
                return <div class="bom-rander-header"><span>物料名称</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader4(){
                return <div class="bom-rander-header"><span>供应商</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader5(){
                return <div class="bom-rander-header"><span>供应商款号</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader6(){
                return <div class="bom-rander-header"><span>供应商色号</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader7(){
                return <div class="bom-rander-header"><span>颜色</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader8(){
                return <div class="bom-rander-header"><span>规格</span><el-tooltip class="item" effect="light" content="该字段输入内容时下方列表将实时搜索相关物料"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },
            renderHeader9(){
                return <div class="bom-rander-header"><span>参考单价</span><el-tooltip class="item" effect="light" content="参考单价【元/采购单位】"  placement="top"><i class='el-icon-information magnifier'></i></el-tooltip></div>
            },

            tableRowClassName(row, index) {
                // 给用户没有权限的行加no-auth
                if(row.authStatus === 1 || row.hasBillPurchase){
                    return 'no-auth';
                }
                // 编辑状态的行加edit-row-bg
                else if(row.editFlag){
                    return 'edit-row-bg'
                }
            }
        },
        updated(){
            // 设计档案列表获取dom列表
            if (this.designStyleId && this.type == "editor1" && this.designId && !this.bomData) {
                this.bomData = this.bomDataBf;
            }
        },
        mounted (){
          console.log(this.$route)
          if(this.$route.path === '/designFile/designFileDetail/bom' || this.$route.path ==='/baseGoodsInfo'){
            const windowHeight = window.innerHeight
            this.isTableHeight = windowHeight - 550
          }
        },
        async created() {
            //审核台是否配置商品bom
            this.dynamicbomConfigGet()
            this.getBillReviewConfig()

            //规格下拉数据
            this.getMaterialSpecList();
            //物料分类下拉数据
            this.getMaterielClassifyList();
            //颜色下拉数据
            this.getColors();
            //获取单位下拉列表
            this.getStockUnitList();
            //生产订单获取bom列表名称下拉框
            this.getCommonBomList();
            //获取BOM表名称
            this.getBomName();
            // 设计档案编辑BOM
            if (this.designStyleId && this.type == "editor1") {
                // 设计档案列表获取dom列表
                if (this.designId) {
                    await bomMaterialsList({userId:this.userId,designStyleId: this.designId}).then(res => {
                        let selectList = {}
                        let data = res.data.data
                        data.forEach(i => {
                            if(this.editId == i.id) {
                                selectList = i
                            }
                        })
                        this.bomData = selectList;
                        this.bomDataBf = JSON.parse(JSON.stringify(selectList));
                    })
                }
                //复制bom页面bom表名称默认为空
                if(this.title != '复制BOM表'){
                    this.inputBom = this.bomData.name;//赋值BOM标题
                }else{
                    this.inputBom = ''
                }
                this.checkBomDataSkus = JSON.stringify(this.bomData.skus);      //检查是否有修改的备份
                this.checkBomName = this.bomData.name;                            //检查是否有修改的备份
                this.isBomData = true;
                this.bomName = this.bomData.name;
                this.tableData4 = this.bomData.skus;
                this.getDesignSkuList()
            }
            // 这个是工单编辑数据
            if (this.bomData && this.type == "editor" && !this.designStyleId) {
                //复制bom页面bom表名称默认为空
                if(this.title != '复制BOM表'){
                    this.inputBom = this.bomData.commonBomName; //赋值BOM标题
                }else{
                    this.inputBom = ''
                }
                this.facMissionId = this.bomData.facMissionId;//工单编辑默认传的
                this.id = this.bomData.id; //赋值BOM表整条数据的id
                this.commonBomId = this.bomData.commonBomId; //表格名称的id
                this.styleId_id = this.styleId; //BOM表所属款号id（必须）
                if (this.bomData.commonMaterialsSkuList) {
                    this.tableData4 = this.bomData.commonMaterialsSkuList; //表格数据
                    // 工单bom的备份数据
                    this.backupCommonMaterialsSkuList = JSON.parse(JSON.stringify(this.tableData4))
                    this.backupCommonMaterialsSkuList.forEach(item=>{
                        item.singleDosage = item.singleDosage.toString()
                    })
                    this.backupCommonMaterialsSkuList = JSON.stringify(this.backupCommonMaterialsSkuList)
                }
            }
            // 这个是货品BOM编辑数据
            if (this.bomData && this.type == 'editor1') {
                //复制bom页面bom表名称默认为空
                if(this.title != '复制BOM表'){
                    this.inputBom = this.bomData.name; //赋值BOM标题
                }else{
                    this.inputBom = ''
                }
                this.isBomData = true;//显示删除bom按钮
                this.id = this.bomData.id; //赋值BOM表的id
                this.styleId_id = this.bomData.styleId; //BOM表所属款号id（必须）
                if (this.bomData.commonMaterialsSkuList) {
                    this.tableData4 = this.bomData.commonMaterialsSkuList; //表格数据
                }
            } else {
                this.styleId_id = this.styleId; //BOM表所属款号id（必须）
            }


            if(this.title == '新建BOM表'&&!this.designStyleId) {
                //自动添加固定物料
                defaultMaterialsSkus({userId:this.userId,unitId:this.unitId}).then(res => {
                        res.data.commonMaterialsSkuList.forEach(v => {
                            this.handleFilter(v)
                        })
                })
            }

            if (this.designStyleId || this.designId) {
                this.getDesignSkuList()
            } else {
                this.searchSkuType()
            }
            //获取供应商下拉数据
            await this.handleSupplierData();
            this.getSupArr();
            //给tableData4每行都增加一个编辑标识，编辑操作会用到
            this.setEditFlag();
            //给tableData4表格最后一行增加搜索行
            this.setSearchLine();
        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    .mask-layer {
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
        top: 0;
        left: 0;
    }

    .header {
        padding: 0 32px;
        border-bottom: 1px solid #e0e6ed;
    }

    .new-bom {
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 150px) !important;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 101;
        box-sizing: border-box;
        padding: 10px 0;
        min-width: 560px;
        font-size: 12px;
        .operate-btn{
            font-size: 12px;
            padding: 0;
            color: #808080;
            cursor: pointer;
            background-color: transparent;
            border: none;
            &:hover{
                color:#3B3B3B;
            }
        }
        .operate-line{
            font-size: 16px;
            color:rgb(223, 228, 236);
        }
        .operate-btn-del{
            color: #FA4150;
            &:hover{
                color:#FB6773;
            }
        }
        .operate-btn-save{
            color: #FF7F14;
            &:hover{
                color: #FF9843;
            }
        }
        .upload-img-content {
            position: relative;
            z-index: 1;
            p {
                margin: 4px 0;
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
                    width: 60px;
                    height: 22px;
                    line-height: 22px;
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
                            img{
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
        .add_photo {
            .upload-file {
                background-color: #fff !important;
                color: #1ca1ff !important;
            }
        }
        .save-material-dialog{
            .el-dialog__body{
                padding:20px 40px 0 40px;
                .save-text{
                    font-size: 15px;
                }
                .save-items li{
                    font-size: 13px;
                    margin: 15px 0;
                }
            }
        }
    }
    .new_set {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        margin-left: 10px;
        color: #ff9c38;
    }
    .content {
        padding: 20px 32px 0;
        .el-input {
            width: 250px;
            height: 32px;
            border-radius: 2px;
            background-color: #ffffff;
        }
        .content-header {
            margin-bottom: 15px;
            .checkbox-update{
                margin-left: 50px;
            }
        }
        .el-input__inner {
            border: none;
        }
        .div_input_shu {
            .el-input {
                .el-input__inner {
                    border: none;
                }
            }
        }
    }

    .div_input {
        padding-left: 32px;
        padding-right: 32px;
        div {
            width: 100%;
        }
    }

    .delete-btn {
        margin-left: 32px;
        color: #fa4150;
        background-color: #fff;
        margin-top: 16px;
    }
</style>

<style lang="scss">
    .new-bom {
        .isTable {
            margin-bottom: 25px;
            .el-input__inner {
                border: none;
                background-color: #FFF9ED;
            }
            .div_input .el-input__inner {
                border: 1px solid rgb(191, 200, 217);
            }
            .el-table__body tr.hover-row > td .el-input__inner {
                background-color: rgb(238, 240, 246);
            }
            .single{
                .el-input {
                    width: 100%;
                }
            }
            .loss {
                display: flex;
                align-items: center;
                .el-input {
                    width: 45px;
                }
            }
            .edit-bg{
                background-color: #FFF9ED !important;
            }
            .no-auth .el-tag,
            .no-auth .edit-bg,
            .no-auth .operate-btn,
            .no-auth td,
            .no-auth input{
                cursor: not-allowed;
                color: #C4C6CC;
                background-color: #FAFAFA !important;
            }
            .edit-row-bg{
                td{
                    background-color: #FFF9ED !important;
                }
                &.hover-row > td{
                    background-color: #FFF9ED !important;
                }
            }
            input{
                background-color: #FFF9ED !important;
                padding: 0 2px;
            }
            .bom-rander-header{
                i.magnifier{
                    margin-left: 5px;
                }
            }
            .newColorForm{
                .el-form-item__content{
                    border: 1px solid #BFCBD9;
                    .el-select{
                        width: 100%;
                    }
                    .el-input{
                        input{
                            width: 100%;
                            max-width: 100%;
                            background-color: #fff !important;
                        }
                    }
                }
            }
        }
        .el-input__inner{
            font-size: 12px;
            height: 32px;
        }
        .el-input{
            &.bom-name-input{
                width: 200px;
                height: 32px;
            }
        }
        .el-table{
            td{
                height: auto;
                position: relative;
            }
            th{
                height: auto;
            }
            font-size: 12px;
            .cell{
                padding-left: 3px;
                padding-right: 3px;
                img{
                    width: 56px;
                    height: 56px;
                    vertical-align: bottom;
                    margin: 4px 0;
                }
            }
            th > div{
                padding-left: 10px;
                padding-right: 10px;
            }
        }
        .el-tag{
            background-color: #FFF9ED;
        }
        .el-table__header-wrapper thead div{
            background-color: transparent;
        }
        .save-material-dialog{
            .el-dialog__header{
                text-align: center;
            }
            .el-dialog__body{
                padding:35px 40px 0;
            }
        }
        .checkbox-update{
            .el-checkbox__label{
                font-size: 12px;
            }
        }
    }
    .create-new-item{
        padding: 8px 10px;
        color: rgb(255, 156, 56);
        cursor: pointer;
    }
</style>
<style lang="scss">
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
        z-index: 2004;
    }
</style>

