<template>
    <div class="goods-spec">
        <div class="customer-spec-header">
            <template>
                <span>{{handleType === 'edit'? '编辑货品' : '添加货品'}}</span>
            </template>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="hiddenGoods">取消</nf-button>
                <nf-button style="width: 98px;" :loading="btnLoading" type="warning" @click="sureSend">确认</nf-button>
            </span>
        </div>
        <base-box>
            <content-wrap title="基本信息" class="base-border">
                <el-form
                        ref="baseInfo"
                        label-width="85px">
                        <el-row >
                            <el-col :span="6">
                                <el-form-item class="style-no-item" :required="true" label="商品款号">
                                    <el-input
                                            class="style-no-input"
                                            :class="{'input-border':tips.kuanhaoTips}"
                                            type="text"
                                            :disabled="!handlePowerEdit('styleNo')||autoNumberGood"
                                            :placeholder="!autoNumberGood?'请输入商品款号':'系统自动生成'"
                                            v-model="add_kuanhao"
                                            @blur="checkGoods">
                                    </el-input>
                                    <!--autoNumberGood-->
                                    <el-checkbox :disabled="!handlePowerEdit('styleNo')" v-if="autoNumberGood  && updateStyleNoPower"
                                                 v-model="updateGenerateStyleNo"
                                                 @change="updateStyleNo(updateGenerateStyleNo)">更新
                                    </el-checkbox>
                                    <span v-show="tips.kuanhaoTips" class="item-tips">款号不能为空</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商品名称" prop="name" :class="{'is-error':!add_name && goodMustConfigCodeData.indexOf('name')>-1}">
                                    <el-input :disabled="!handlePowerEdit('styleName')" type="text" placeholder="请输入商品名称" v-model="add_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="供应商" prop="outSideFactoryId" :class="{'is-error':!formData.outSideFactoryId.length && goodMustConfigCodeData.indexOf('outSideFactoryId')>-1}">
                                    <machining-select v-if="handlePowerVisible('commonOutsideFactoryName')" :disabled="!handlePowerEdit('commonOutsideFactoryName')" :canAdd="true" v-model="formData.outSideFactoryId"></machining-select>
                                    <el-select v-else disabled placeholder="***"></el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="厂家货号" prop="plantArticleNumber" :class="{'is-error':!formData.plantArticleNumber && goodMustConfigCodeData.indexOf('plantArticleNumber')>-1}">
                                    <el-input type="text" :disabled="!handlePowerEdit('plantArticleNumber')" placeholder="请输入厂家货号" v-model="formData.plantArticleNumber"></el-input>
                                </el-form-item>
                            </el-col>
                        <!-- <el-col :span="8">

                        </el-col> -->
                    </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                                <el-form-item class="color-item" label="颜色" :required="true">
                                    <colorSelectGroup :disabled="!handlePowerEdit('colorName')" class="isDisabledSku" v-model="colorArr" :colorArrItem="colorArrItem" :groupData="colorList"  @isAddAttr="getAddAttr"></colorSelectGroup>
                                    <span v-show="tips.colorTips" class="item-tips">颜色不能为空</span>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                                <el-form-item class="size-item" label="尺码" :required="true">
                                    <size-select :disabled="!handlePowerEdit('sizeName')" class="isDisabledSku" :selectedSizes="sizeArr" :sizeArrItem="sizeArrItem" @sizeArr="sizeArrFn" :sizeTips="tips.sizeTips"
                                                 ref="selectSize"  @isAddAttr="getAddAttr"></size-select>
                                    <span v-show="tips.sizeTips" class="item-tips">尺码不能为空</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :xs="24" :sm="12" :md="12" :lg="12">
                                <el-form-item label="内长" prop="standardName" :class="{'is-error':!lengthArr.length && goodMustConfigCodeData.indexOf('lengthIds')>-1}">
                                    <el-select
                                            :disabled="!handlePowerEdit('standardName')"
                                            ref="length"
                                            class="isDisabledSku"
                                            v-model="lengthArr" multiple filterable remote @visible-change="lengthTri"
                                            :remote-method="remoteMethodLength" reserve-keyword placeholder="请选择内长"
                                            @change="colorLength" :multiple-limit="12" @remove-tag="deleteLength">
                                        <el-option :value="''" disabled style="cursor:pointer;color:#FFA914 !important;" v-if="getFacCommonSettings">
                                            <!--dialogAdd = true;title='内长'-->
                                            <span class="new_set" @click="handleAddAttr('length','内长')">新建</span>
                                        </el-option>
                                        <el-option
                                                v-for="(item, index) in lengths"
                                                :disabled="isLengthDisabled(item.id)"
                                                :target="item.removeTag"
                                                :key="index"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <div class="sku-table-wrap">
                                <sku-dynamically-table
                                        :fieldRoles="fieldRoles"
                                        ref="skuTable"
                                        :type="handleType"
                                        :styleNo="add_kuanhao"
                                        :autoNumberGood="autoNumberGood"
                                        :colorArr="colorArr"
                                        :sizeArr="sizeArr"
                                        :lengthArr="lengthArr"
                                        :titleAndSelect="skuTitleAndSelect"
                                        :editSkuTable="editSkuTable">
                                </sku-dynamically-table>
                            </div>
                        </el-row>
                </el-form>
            </content-wrap>
        </base-box>
        <base-box class="procedure">
            <content-wrap title="属性信息" class="base-border">
                <attr-dropdown
                        :facInfo="facInfo"
                        :fieldRoles="fieldRoles"
                        :modelName="modelName"
                        type="GOODS_STYLE"
                        @sizeChangeByCategory="sizeChangeByCategory"
                        :goodMustConfigCodeDataProp="goodMustConfigCodeData"
                        @attrData="getAttrData"
                        :attrSelect="attrSelect"
                        :attrNewSelect="attrNewSelect"
                        :categoryId="categoryId"
                        :multiple="true"
                        :styleId="styleId">
                </attr-dropdown>
            </content-wrap>
        </base-box>
        <base-box class="procedure">
            <content-wrap title="描述信息" class="base-border">
                <el-form
                        ref="goodsInfo"
                        class="create-form bd-bottom"
                        :model="formData"
                        label-width="100px">
                    <el-row>
                        <!-- <el-form-item style="width: auto" class="create-form__item" label="图片"> -->
                            <div class="addStyle_content_thirdLine">
                                <p> 图片&emsp;&emsp;
                                    <span class="add_photo" :class="{'disabled-bg':!handlePowerEdit('pictures')}"><input :disabled="!handlePowerEdit('pictures')" type="file" multiple @change="imgUpload" accept="image/jpeg,image/jpg,image/png">
                                    <span>添加图片</span>&emsp;</span>
                                    <span>只能上传 jpg/png 文件,且不超过 5m</span>
                                </p>
                                <ul :class="{'error-border':!img_list.length && goodMustConfigCodeData.indexOf('pictures')>-1}">
                                    <li v-for="(item,index) of img_list" :key="index">
                                        <div class="faceStyle" v-if="index==0">
                                            <span>封面</span>
                                        </div>
                                        <a class="face" @mouseenter="showSelect(index)" @mouseleave="showSelected(index)">
                                            <i :class="{'imgCancel':show == index}" v-if="show == index && handlePowerEdit('pictures')"
                                            @click="cancelImg(index)"><img src="../../../../static/el-icon-close@3x.png" alt=""></i>
                                            <img :src="item" style="height: 100%;">
                                            <div :class="{'faceSelect': show == index}" v-if="show ==index&&show!=0"
                                                @click="faceing(index)">设置封面
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                        <!-- </el-form-item> -->
                    </el-row>
                    <el-row class="create-form__row" type="flex">
                        <el-form-item style="width: auto" label="商品描述" :class="{'ue-is-error':!configRemarkMsg && goodMustConfigCodeData.indexOf('remark')>-1}">
                            <div style="position: relative;">
                                <UE @htmlData="htmlChange" :defaultMsg=defaultMsg :config=config id="ueId-add-style" ref="ue"></UE>
                                <div class="ue-mask" v-if="!handlePowerEdit('goodsRemark')"></div>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="模式" :class="{'is-error':(!formData.model) && goodMustConfigCodeData.indexOf('model')>-1}">
                                <el-select
                                        v-if="handlePowerVisible('model')"
                                        :disabled="!handlePowerEdit('model')"
                                        filterable
                                        clearable
                                        v-model="formData.model"
                                        placeholder="请选择">
                                    <el-option v-for="item in patternList" :key="item.value" :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-select v-else disabled placeholder="***"></el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="上市时间" :class="{'is-error':!formData.dateListing && goodMustConfigCodeData.indexOf('dateListing')>-1}">
                                <el-date-picker
                                        v-if="handlePowerVisible('dateListing')"
                                        :disabled="!handlePowerEdit('dateListing')"
                                    v-model="formData.dateListing"
                                    type="date"
                                    @change="timeChage"
                                    placeholder="选择日期">
                                    </el-date-picker>
                                <el-date-picker v-else disabled placeholder="***"></el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="国标码" :class="{'is-error':!formData.internationalCode && goodMustConfigCodeData.indexOf('internationalCode')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('internationalCode')"
                                        :disabled="!handlePowerEdit('internationalCode')"
                                        v-model.trim="formData.internationalCode"
                                        placeholder="请输入"
                                        :maxlength="20">
                                </el-input>
                                <el-input v-else disabled placeholder="***"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="开发者" :class="{'is-error':!formData.developerIds.length && goodMustConfigCodeData.indexOf('developerIds')>-1}">
                                <workerLeader v-if="handlePowerVisible('developers')"
                                              :isDisabled="!handlePowerEdit('developers')"
                                              @groupChange="groupChange"
                                              @input="developerChange"
                                              :single="'single'"
                                              v-model="formData.developerIds[0]" placeholder="请选择"></workerLeader>
                                <el-select v-else disabled placeholder="***"></el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="开发部门" :class="{'is-error':!formData.developmentDepartment && goodMustConfigCodeData.indexOf('developmentDepartment')>-1}">
                                <el-select v-if="handlePowerVisible('developmentDepartment')"
                                           :disabled="!handlePowerEdit('developmentDepartment')"
                                           v-model.trim="formData.developmentDepartmentId"
                                           placeholder="请选择分组">
                                    <el-option v-for="item in groups" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-else disabled placeholder="***"></el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <custom-field-from v-model="formData.customFields"
                                   :fieldRoles="fieldRoles"
                                   :isEdit="handleType === 'edit'"
                                   modelName="GOODS_STYLE"
                                   :detailCustomFieldsList="detailCustomFieldsList"
                                   :checkCodeListData="goodMustConfigCodeData"
                ></custom-field-from>

            </content-wrap>
        </base-box>
        <!-- 价格信息 -->
        <base-box class="procedure">
            <content-wrap title="价格信息">
                <el-form
                        class="price-table"
                        :model="priceFormData"
                        label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="销售价" :class="{'is-error':!priceFormData.price && goodMustConfigCodeData.indexOf('price')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('price')"
                                        :disabled="!handlePowerEdit('price')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim.number="priceFormData.price" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="吊牌价" :class="{'is-error':!formData.retailPrice && goodMustConfigCodeData.indexOf('retailPrice')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('retailPrice')"
                                        :disabled="!handlePowerEdit('retailPrice')"
                                        @blur="retailPriceSellPricePopChange"
                                        type="number"
                                        v-model.trim.number="formData.retailPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        :min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="动销价" :class="{'is-error':!formData.sellPrice && goodMustConfigCodeData.indexOf('sellPrice')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('sellPrice')"
                                        :disabled="!handlePowerEdit('sellPrice')"
                                        @blur="sellPriceChange"
                                        type="number"
                                        v-model.trim.number="formData.sellPrice"
                                        :maxlength="10"
                                        placeholder="请输入"
                                        :min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="动销价比" :class="{'is-error':!formData.sellPricePop && goodMustConfigCodeData.indexOf('sellPricePop')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('sellPricePop')"
                                        :disabled="!handlePowerEdit('sellPricePop')"
                                        @blur="retailPriceSellPricePopChange"
                                        v-model.trim="formData.sellPricePop"
                                        placeholder="请输入"
                                        :maxlength="10">
                                </el-input>
                                <el-input v-else disabled placeholder="***"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="物料成本" :class="{'is-error':!priceFormData.materialCost && goodMustConfigCodeData.indexOf('materialCost')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('materialCost')"
                                        :disabled="!handlePowerEdit('materialCost')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim.number="priceFormData.materialCost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="加工成本" :class="{'is-error':!priceFormData.processingCost && goodMustConfigCodeData.indexOf('processingCost')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('processingCost')"
                                        :disabled="!handlePowerEdit('processingCost')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim.number="priceFormData.processingCost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="计划成本价" :class="{'is-error':!priceFormData.cost && goodMustConfigCodeData.indexOf('cost')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('cost')"
                                        :disabled="!handlePowerEdit('cost')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim.number="priceFormData.cost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="6">
                            <el-form-item label="最初供货价" :class="{'is-error':!formData.firstSupplyPrice && goodMustConfigCodeData.indexOf('firstSupplyPrice')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('firstSupplyPrice')"
                                        :disabled="!handlePowerEdit('firstSupplyPrice')"
                                        type="number"
                                        v-model.trim.number="formData.firstSupplyPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        :min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="我司核价" :class="{'is-error':!formData.accountingPrice && goodMustConfigCodeData.indexOf('accountingPrice')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('accountingPrice')"
                                        :disabled="!handlePowerEdit('accountingPrice')"
                                        type="number"
                                        v-model.trim.number="formData.accountingPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        :min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="最终供货价" :class="{'is-error':!formData.lastSupplyPrice && goodMustConfigCodeData.indexOf('lastSupplyPrice')>-1}">
                                <el-input
                                        v-if="handlePowerVisible('lastSupplyPrice')"
                                        :disabled="!handlePowerEdit('lastSupplyPrice')"
                                        @input="handleInput"
                                        type="number"
                                        v-model.trim.number="formData.lastSupplyPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        :min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </content-wrap>
        </base-box>
        <!-- 附件 -->
        <base-box class="procedure">
            <content-wrap title="附件">
                <upload-form :fieldRoles="fieldRoles" :tableData="attachmentLists" :fileList="attachments" @getFileList="getFileList" @getAttachments="getAttachments"></upload-form>
            </content-wrap>
        </base-box>
        <el-dialog :modal-append-to-body="false" :visible.sync="dialogVisible" size="tiny">
            <div class="error">
                <icon type="icon-gongdan-dongtaijingbao" w="72" h="72"></icon>
                <p class="error-title">该款号的货品资料在其他分厂已经存在，是否要导入本厂？</p>
            </div>
            <span slot="footer" center class="dialog-footer">
                <nf-button @click="closeDialog = false" class="cancel is-plain">取消</nf-button>
                <nf-button style="margin:0;" @click="checkS" type="warning">确定</nf-button>
            </span>
        </el-dialog>
        <!--各种属性新建弹窗-->
        <attribute-dialog :title="title" :show.sync="dialogAdd" @success="getNowDataFac" :type="type"></attribute-dialog>

        <!--提示弹窗-->
        <warn-dialog
                :visible.sync="warnVisible"
                :message="warnMessage"
                type="2"
                @confirm="warnDialogCancel">
        </warn-dialog>
        <el-dialog
                class="custom-dialog"
                :modal-append-to-body="false"
                title="提示"
                :visible.sync="configDialogVisible"
                size="tiny"
                >
            <span>{{configDialogContent}}</span>
            <span slot="footer" class="dialog-footer" style="text-align: center;display: block;">
                <el-button @click="configDialogVisible = false">好的</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>

    import sizeSelect from '@/components/Common/size-select.vue'
    import attributeDialog from '@/components/Common/attributeDialog'
    import md5 from "js-md5";
    import supplierSelect from '@/components/Common/custom-select/supplier-select'; // 供应商
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    import skuDynamicallyTable from '@/components/order/createChild/skuDynamicallyTable'; // sku动态表格
    import warnDialog from '@/components/Common/dialog/warnDialog'; //提示弹窗
    import UE from '../../ue/ue';
    const fun  = require('@/components/Common/commonFun.js')
    import attrDropdown from '@/components/Common/attr-dropdown.vue'; // 属性下拉
    import CustomFieldFrom from '@/components/Common/customFieldFrom.vue';

    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import {
        getUploadToken,
        addFacGoodsStyle,
        upDetailImgs,
        addFacUnitSettings,
        addCommonSkuAttr,
        deleteFacUnitSettings,
        getFacUnitSettings,
        selectFacCommonSettings,
        checkFacGoodsStyle,
        getFacGoodsStyle,
        judgeFacDelSku,
        updateFacGoodsStyle,
        getUnitUser,
        outsideFactoryListForSelect,
        isExistGenerateStyleNoList,
        updateMissionPreview,
        goodCheckOnForward,
        commonStyleSkuAttrAll,
        getGoodsRole,
        getEasyGroups,
    } from '@/api'

    export default {
        props: {
            handleType: 'String',
            goodsId: 'String',
            styleId: 'String',
            modelName: 'String',
        },
        /****************
         *
         * modelName 模块名称对应的值（用于权限配置）
         *      ALL	全部模块
         *      GOODS_STYLE	商品档案
         *      SPL_DESIGN_STYLE	设计档案
         *      FAC_PRD_ORDER	生产订单
         *      FACTORY_MISSION	生产工单
         *      GOODS_STOCK	商品库存
         *
         *
         * ****************/
        data() {
            return {
                btnLoading: false,
                configDialogContent:'',
                configDialogVisible:false,
                configRemarkMsg:false,
                baseInfo:{},
                goodMustConfigCodeData:[],     //必填配置
                goodConfigRules:{},     //必填配置
                dialogAdd:false,
                title: '',
                type: '',
                load:{
                    brandLoading:false
                },
                downGoods: false,
                goodsValue: "",
                //新建节点
                options: [],
                visible: {
                    createVisible: false,
                    editVisible: false,
                    showCancel: false,
                    editorVisble: false,
                    dialogSheetVisible: false
                },
                formLabelAlign: {
                    nodename: "",
                    region: "",
                    id: "",
                    type: "",
                    multiple: []
                },
                nodeRepeat: false,
                numberType: false,
                index_node: -1,
                customerNo: true,
                img_list_remark: [],
                imgData: {},
                imgList: [],
                show: "",
                img_name: {},
                upLoadUrl: this.$globalConfig.qiniu.upUrl,
                fileData: {},
                fileList: [],
                fileProgress: 0,
                //货品添加
                attrSelect: {
                    designer: [],
                    wave: [],
                    kind: [],
                    season: [],
                    year: [],
                    tag: [],
                    brand: [],
                    style: [],
                    month: []
                },
                attrNewSelect: {
                    field1s: [],
                    field2s: [],
                    field3s: [],
                    field4s: [],
                    field5s: [],
                    field6s: [],
                    field7s: [],
                    field8s: [],
                },
                categoryId: [],
                colorArr: [],
                colorArrItem: [],
                colorList: [],
                colorSet: "",
                sizes: [],
                sizeArr: [],
                sizeArrItem: [],
                sizeSet: "",
                lengths: [],
                lengthArr: [],
                lengthArrItem: [],
                lengthSet: "",
                facInfo: {},
                add_kuanhao: "",
                add_name: "",
                img_list: [],
                dialogVisible: false,
                colorRotate: false,
                lengthRotate: false,
                tips: {
                    kuanhaoTips: false,
                    colorTips: false,
                    sizeTips: false
                },
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId:JSON.parse(sessionStorage.getItem("user_login")).unitId,
                editGoodsInfo: {},
                skuVal: {},
                categoryList: [], // 品类列表
                formData: {
                    outSideFactoryId: '', //供应商 outSideFactoryId
                    plantArticleNumber: '', // 厂家货号
                    model: '', // 模式
                    dateListing: '', // 上市日期
                    internationalCode: '', // 国标码
                    developmentDepartmentId: '', // 开发部门id
                    developmentDepartment: '', // 开发部门
                    firstSupplyPrice: '', // 最初供货价
                    lastSupplyPrice: '', // 最终供货价
                    accountingPrice: '', // 我司核价
                    retailPrice: '', // 吊牌价
                    sellPrice: null, //动销价
                    sellPricePop: null, //动销价比
                    developerIds: [],
                    customFields:[]
                },
                attachmentLists:[], // 表格上传
                attachments: [], // 其他上传
                defaultMsg: "",
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 164,
                    zIndex: 99
                },
                patternList: [
                    {value: 0, label: '联营'},
                    {value: 1, label: '买断'},
                    {value: 2, label: '包销'}
                ],
                options: {groupOptions:[]}, // 开发者
                outsideFactoryList: [], // 外发厂
                getFacCommonSettings:true, //十个属性新建按钮权限
                autoNumberGood: false,
                updateStyleNoPower: true, //更新商品款号权限
                updateGenerateStyleNo: false,
                orginStyleNo:'',        //款号备份
                editSkuTable: [],
                priceFormData: {
                    materialCost: '', //物料成本
                    processingCost: '', //加工成本
                    price: '',  // 销售价
                    cost: '',   // 计划成本价
                },
                warnVisible: false,
                warnMessage: '',
                skuTitleAndSelect: {},      //sku表格表头和下拉数据
                detailCustomFieldsList:[],  //货品详情的自定义字段部分的数据
                fieldRoles: [],
                groups:[],
                groupId: '',
            }
        },
        watch: {
            add_kuanhao(val) {
                if (val) {
                    this.tips.kuanhaoTips = false;
                }
            },
            colorArr(val) {
                if (val.length) {
                    this.tips.colorTips = false;
                }
            },
            sizeArr(val) {
                if (val.length) {
                    this.tips.sizeTips = false;
                }
            },
        },
        components: {
            sizeSelect,
            attributeDialog,
            supplierSelect,
            uploadForm,
            UE,
            skuDynamicallyTable,
            attrDropdown,
            warnDialog,
            CustomFieldFrom
        },
        computed:{
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        methods: {
            //“吊牌价”或“动销价比”修改：动销价 = 吊牌价*动销价比； sellPricePop
            retailPriceSellPricePopChange(){
                let data = this.formData;
                if(data.retailPrice > 0 && data.sellPricePop > 0){
                    data.sellPrice = (data.retailPrice * data.sellPricePop).toFixed(2)
                }
            },
            //动销价修改：动销价比 = 动销价/吊牌价；
            sellPriceChange(){
                let data = this.formData;
                if(data.sellPrice > 0 && data.retailPrice > 0){
                    data.sellPricePop = (data.sellPrice / data.retailPrice).toFixed(2)
                }
            },
            //获取分组id
            groupChange(id){
                this.groupId = id;
            },
            //开发者存在分组时，赋值给开发部门
            developerChange(id){
                if(id && this.groupId){
                    this.formData.developmentDepartmentId = this.groupId;
                    this.$message.success("开发部门已更新")
                }
            },
            //开发部门下拉
            getAllGroup() {
                let params = {
                    facId: this.$common.facId(),
                };
                this.groups = [];//清空分组
                getEasyGroups(params).then(res => {
                    if(res.data){
                        this.groups = res.data
                    }
                })
            },
            //获取开发部门名称
            getdevelopmentName(){
                if(this.groups.length){
                    let arr = this.groups.filter(item => item.id === this.formData.developmentDepartmentId);
                    if(arr.length){
                        this.formData.developmentDepartment = arr[0].name
                    }
                }
            },
            handlePowerEdit(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).editable
                }else {
                    return false
                }
            },
            handlePowerVisible(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).visible
                }else {
                    return false
                }
            },
            getGoodsRole() {
                getGoodsRole({userId:this.userId,unitId:this.unitId,type:'style'}).then(res => {
                    this.fieldRoles = res.data.data
                    if(!this.handlePowerEdit('goodsRemark')){
                        this.$nextTick(() => {
                            this.$refs['ue'].setDisabled()
                        })
                    }
                })
            },
            sizeChangeByCategory(val){
                this.sizeArr = val
            },
            //sku自定义属性表头和下拉
            getTitleAndSelect(){
                let params = {
                    unitId: this.unitId
                };
                commonStyleSkuAttrAll(params).then(res => {
                    if(res.data.code === 0){
                        this.skuTitleAndSelect = res.data.data;
                    }
                });
            },
            handleInput(v) {
                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                console.log(reg.test(v));
                if(!reg.test(v)){
                    this.formData.lastSupplyPrice
                }
            },
             // 颜色和尺码新建的时候触发
            getAddAttr() {
                this.$refs['skuTable'].getFacCommonSettingsSku()
            },
            isLengthDisabled(id){
                let flag = false;
                if(!this.lengthArrItem || !this.lengthArrItem.length){
                    return false
                }
                this.lengthArrItem.forEach($item=>{
                    if($item.id===id && $item.removeTag===0){
                        flag = true
                    }
                });
                return flag
            },
            // 关闭提示弹窗
            warnDialogCancel(){
                this.warnVisible = false;
            },
            //更新商品款号
            updateStyleNo(val) {
                if (!val) {
                    //取消勾选
                    this.add_kuanhao = this.orginStyleNo;
                    return
                }
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    modelType: 2,
                    attrs: [],
                };
                let newAttr = [
                    {type: 2, attrId: this.attrSelect.designer[0] || ''},
                    {type: 3, attrId: this.attrSelect.wave[0] || ''},
                    {type: 5, attrId: this.attrSelect.season[0] || ''},
                    {type: 4, attrId: this.attrSelect.kind[0] || ''},
                    {type: 6, attrId: this.attrSelect.year[0] || ''},
                    {type: 8, attrId: this.attrSelect.brand[0] || ''},
                    {type: 7, attrId: this.attrSelect.tag[0] || ''},
                    {type: 10, attrId: this.attrSelect.month[0] || ''},
                    {type: 9, attrId: this.attrSelect.style[0] || ''},
                    {type: 14, attrId: this.attrNewSelect.field1s[0] || ''},
                    {type: 15, attrId: this.attrNewSelect.field2s[0] || ''},
                    {type: 16, attrId: this.attrNewSelect.field3s[0] || ''},
                    {type: 17, attrId: this.attrNewSelect.field4s[0] || ''},
                    {type: 18, attrId: this.attrNewSelect.field5s[0] || ''},
                    {type: 27, attrId: this.attrNewSelect.field6s[0] || ''},
                    {type: 28, attrId: this.attrNewSelect.field7s[0] || ''},
                    {type: 29, attrId: this.attrNewSelect.field8s[0] || ''},
                ];
                this.categoryId.forEach((item, index) => {
                    params.attrs.push({type: 11 + index, attrId: item})
                });
                newAttr.forEach(item => {
                    if (item.attrId !== '') {
                        params.attrs.push(item)
                    }
                });

                updateMissionPreview(params).then(res => {
                    if (res.data.code === 0) {
                        this.add_kuanhao = res.data.data;
                        this.$message.success('更新成功')
                    } else {
                        this.updateGenerateStyleNo = false;
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //获取更新商品款号权限
            getUpdateStyleNoPower(){
                let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                if (powerlist.indexOf('fac.spl.design.style.styleNo.editpreview') == -1) {
                    this.updateStyleNoPower = false
                }
            },
            //检查获取 是否设置为自动编号
            isExistGenerateStyleNoList() {
                isExistGenerateStyleNoList({userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId}).then(res => {
                    console.log(res);
                    res.data.data.forEach(item => {
                        if (item.modelType === 2) {
                            this.autoNumberGood = item.userDefinedRule
                        }
                    })
                })
            },
            //新建时隐藏下拉列表
            handleAddAttr(refName, title, attrType){
                this.dialogAdd = true;
                this.title = title;
                if(attrType){
                    this.type = attrType;
                    this.$refs[refName][0].handleClose();
                }else {
                    this.$refs[refName].handleClose();
                }
            },
            // 开发者
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;
                });
            },
            // 供应商
            getOutsideFactoryList(){
                let params= {
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                }
                console.log(params,1100)
                outsideFactoryListForSelect(params).then(res=>{
                    console.log(res,'外发工厂列表')
                    if(res.data.code ===0){
                        this.outsideFactoryList=res.data.data
                    }
                })
            },
            //获取编辑状态时的数据
            getEditMes() {
                if (this.styleId) {
                    let params = {
                        token: "",
                        facId: this.facId,
                        styleId: this.styleId,
                        userId: this.userId
                    };
                    getFacGoodsStyle(params).then(res => {
                        this.editGoodsInfo = res.data;
                        this.getSkuVal(res.data["sku"]);
                        this.defaultMsg = this.editGoodsInfo.remark || ''
                        this.add_kuanhao = this.editGoodsInfo.styleNo;      //款号
                        this.orginStyleNo = this.editGoodsInfo.styleNo;     //款号备份
                        this.add_name = this.editGoodsInfo.styleName;       //名称
                        this.formData = {
                            outSideFactoryId: this.editGoodsInfo.outSideFactoryInfo.commonOutsideFactoryId || '', //供应商
                            plantArticleNumber: this.editGoodsInfo.plantArticleNumber, // 厂家货号
                            model: this.editGoodsInfo.model, // 模式
                            dateListing: this.editGoodsInfo.dateListing, // 上市日期
                            internationalCode: this.editGoodsInfo.internationalCode,
                            developmentDepartmentId: this.editGoodsInfo.developmentDepartmentId, // 开发部门id
                            developmentDepartment: this.editGoodsInfo.developmentDepartment, // 开发部门
                            firstSupplyPrice: this.editGoodsInfo.firstSupplyPrice, // 最初供货价
                            lastSupplyPrice: this.editGoodsInfo.lastSupplyPrice, // 最终供货价
                            accountingPrice: this.editGoodsInfo.accountingPrice, // 我司核价
                            retailPrice: this.editGoodsInfo.retailPrice, // 吊牌价
                            sellPrice: this.editGoodsInfo.sellPrice, // 动销价
                            sellPricePop: this.editGoodsInfo.sellPricePop, // 动销价比
                            developerIds: this.editGoodsInfo.developers
                        }
                        if(this.editGoodsInfo.developers.length) {
                            let developerIds = []
                            this.editGoodsInfo.developers.forEach(i => {
                                developerIds.push(i.id)
                            })
                            this.formData.developerIds = developerIds
                        }
                        this.attachmentLists = this.editGoodsInfo.attachmentList
                        this.attachments = this.editGoodsInfo.attachments

                        if (this.editGoodsInfo.categoryInfo &&this.editGoodsInfo.categoryInfo.firstId) {
                            this.categoryId = [this.editGoodsInfo.categoryInfo.firstId,this.editGoodsInfo.categoryInfo.secondId,this.editGoodsInfo.categoryInfo.thirdId]
                        }else {
                            this.categoryId = []
                        }
                        console.log(this.editGoodsInfo.categoryInfo,'07767')
                        let colors = [];
                        for (let i = 0; i < this.editGoodsInfo.colors.length; i++) {
                            colors.push(this.editGoodsInfo.colors[i].id);
                        }
                        this.colorArr = colors;                              //颜色
                        this.colorArrItem = this.editGoodsInfo.colors;                              //颜色

                        let sizes = [];
                        for (let i = 0; i < this.editGoodsInfo.sizes.length; i++) {
                            sizes.push(this.editGoodsInfo.sizes[i].id);
                        }
                        this.sizeArr = sizes;                             //尺码
                        this.sizeArrItem = this.editGoodsInfo.sizes;                             //尺码

                        if (this.editGoodsInfo.lengths) {
                            let lengths = [];
                            for (let i = 0; i < this.editGoodsInfo.lengths.length; i++) {
                                lengths.push(this.editGoodsInfo.lengths[i].id);
                            }
                            this.lengthArr = lengths;                    //内长
                            this.lengthArrItem = this.editGoodsInfo.lengths;                    //内长
                        }
                        if (this.editGoodsInfo.pictures) {
                            let pictures = [];
                            for (let i = 0; i < this.editGoodsInfo.pictures.length; i++) {
                                pictures.push(this.editGoodsInfo.pictures[i].picPath);
                            }
                            this.img_list = pictures;                    //图片
                        }

                        if (this.editGoodsInfo.brand) {
                            let brands = [];
                            for (let i = 0; i < this.editGoodsInfo.brand.length; i++) {
                                brands.push(this.editGoodsInfo.brand[i].id);
                            }
                            this.attrSelect.brand = brands;                     //品牌
                        }
                        if (this.editGoodsInfo.designer) {
                            let designers = [];
                            for (let i = 0; i < this.editGoodsInfo.designer.length; i++) {
                                designers.push(this.editGoodsInfo.designer[i].id);
                            }
                            this.attrSelect.designer = designers;               //设计师
                        }
                        if (this.editGoodsInfo.kind) {
                            let kinds = [];
                            for (let i = 0; i < this.editGoodsInfo.kind.length; i++) {
                                kinds.push(this.editGoodsInfo.kind[i].id);
                            }
                            this.attrSelect.kind = kinds;                       //分类
                        }
                        if (this.editGoodsInfo.tag) {
                            let tags = [];
                            for (let i = 0; i < this.editGoodsInfo.tag.length; i++) {
                                tags.push(this.editGoodsInfo.tag[i].id);
                            }
                            this.attrSelect.tag = tags;                         //标签
                        }
                        if (this.editGoodsInfo.year) {
                            let years = [];
                            for (let i = 0; i < this.editGoodsInfo.year.length; i++) {
                                years.push(this.editGoodsInfo.year[i].id);
                            }
                            this.attrSelect.year = years;                       //年份
                        }
                        if (this.editGoodsInfo.season) {
                            let seasons = [];
                            for (let i = 0; i < this.editGoodsInfo.season.length; i++) {
                                seasons.push(this.editGoodsInfo.season[i].id);
                            }
                            this.attrSelect.season = seasons;                   //季节
                        }
                        if (this.editGoodsInfo.wave) {
                            let waves = [];
                            for (let i = 0; i < this.editGoodsInfo.wave.length; i++) {
                                waves.push(this.editGoodsInfo.wave[i].id);
                            }
                            this.attrSelect.wave = waves;                       //波段
                        }
                        if (this.editGoodsInfo.style) {
                            let styles = [];
                            for (let i = 0; i < this.editGoodsInfo.style.length; i++) {
                                styles.push(this.editGoodsInfo.style[i].id);
                            }
                            this.attrSelect.style = styles;                       //风格
                        }
                        if (this.editGoodsInfo.month) {
                            let months = [];
                            for (let i = 0; i < this.editGoodsInfo.month.length; i++) {
                                months.push(this.editGoodsInfo.month[i].id);
                            }
                            this.attrSelect.month = months;                       //月份
                        }
                        if (this.editGoodsInfo.field1s) {
                            let field1s = [];
                            for (let i = 0; i < this.editGoodsInfo.field1s.length; i++) {
                                field1s.push(this.editGoodsInfo.field1s[i].id);
                            }
                            this.attrNewSelect.field1s = field1s;
                        }
                        if (this.editGoodsInfo.field1s) {
                            let field2s = [];
                            for (let i = 0; i < this.editGoodsInfo.field2s.length; i++) {
                                field2s.push(this.editGoodsInfo.field2s[i].id);
                            }
                            this.attrNewSelect.field2s = field2s;
                        }
                        if (this.editGoodsInfo.field3s) {
                            let field3s = [];
                            for (let i = 0; i < this.editGoodsInfo.field3s.length; i++) {
                                field3s.push(this.editGoodsInfo.field3s[i].id);
                            }
                            this.attrNewSelect.field3s = field3s;
                        }
                        if (this.editGoodsInfo.field4s) {
                            let field4s = [];
                            for (let i = 0; i < this.editGoodsInfo.field4s.length; i++) {
                                field4s.push(this.editGoodsInfo.field4s[i].id);
                            }
                            this.attrNewSelect.field4s = field4s;
                        }
                        if (this.editGoodsInfo.field5s) {
                            let field5s = [];
                            for (let i = 0; i < this.editGoodsInfo.field5s.length; i++) {
                                field5s.push(this.editGoodsInfo.field5s[i].id);
                            }
                            this.attrNewSelect.field5s = field5s;
                        }
                        if (this.editGoodsInfo.field6s) {
                            let field6s = [];
                            for (let i = 0; i < this.editGoodsInfo.field6s.length; i++) {
                                field6s.push(this.editGoodsInfo.field6s[i].id);
                            }
                            this.attrNewSelect.field6s = field6s;
                        }
                        if (this.editGoodsInfo.field7s) {
                            let field7s = [];
                            for (let i = 0; i < this.editGoodsInfo.field7s.length; i++) {
                                field7s.push(this.editGoodsInfo.field7s[i].id);
                            }
                            this.attrNewSelect.field7s = field7s;
                        }
                        if (this.editGoodsInfo.field8s) {
                            let field8s = [];
                            for (let i = 0; i < this.editGoodsInfo.field8s.length; i++) {
                                field8s.push(this.editGoodsInfo.field8s[i].id);
                            }
                            this.attrNewSelect.field8s = field8s;
                        }
                        this.priceFormData = {
                            price: this.editGoodsInfo.price, // 吊牌价
                            cost: this.editGoodsInfo.cost,   // 计划成本价
                            materialCost: this.editGoodsInfo.materialCost,   // 物料成本
                            processingCost: this.editGoodsInfo.processingCost   // 加工成本
                        };
                        if(this.editGoodsInfo.skuBarcodes.length){
                            this.editGoodsInfo.skuBarcodes.forEach((item) => {
                                item.skuIdStr = item.colorId + '_' + item.sizeId + '_' + item.standardId;
                                item.sizeTypeCategory = item.sizeTypeCategory ? item.sizeTypeCategory : '-'
                            });
                            this.editSkuTable = this.editGoodsInfo.skuBarcodes;
                        }
                        // 组装自定义字段需要的数据
                        this.detailCustomFieldsList = []
                        if(this.editGoodsInfo.customFieldList.length){
                            let data = this.editGoodsInfo.customFieldList
                            data.forEach(item =>{
                                if(item.customFieldType ==='SINGLE_SELECT'){
                                    item.selected = item.selectedOptions&&item.selectedOptions.length?item.selectedOptions[0].optionId:''
                                } else if(item.customFieldType ==='MULTI_SELECT'){
                                    item.selected = item.selectedOptions&&item.selectedOptions.length?item.selectedOptions.map(item =>item.optionId):[]
                                } else if(item.customFieldType ==='TEXT'){
                                    item.selected = item.textValue?item.textValue:''
                                } else {
                                    item.selected = item.numberValue?item.numberValue:''
                                }
                                this.detailCustomFieldsList.push(JSON.parse(JSON.stringify(item)))
                            })
                        }
                    })
                }
            },
            //获取skuId
            getSkuVal(skuArr) {
                for (let item of skuArr) {
                    const idStr = `${item.color_id}_${item.size_id}${
                        item.standard_id ? "_" + item.standard_id : ""
                        }`;
                    this.skuVal[idStr] = {
                        skuId: item.id
                    };
                }
            },
            // 点击删除颜色调接口
            deleteColor(val) {
                this.skuColor = [];
                if (this.editGoodsInfo.lengths.length > 0) {
                    for (let sizeItem of this.editGoodsInfo.sizes) {
                        for (let lengthItem of this.editGoodsInfo.lengths) {
                            this.skuColor.push(
                                val.value + "_" + sizeItem.id + "_" + lengthItem.id
                            );
                        }
                    }
                } else {
                    this.skuColor = [];
                    for (let sizeItem of this.editGoodsInfo.sizes) {
                        this.skuColor.push(val.value + "_" + sizeItem.id);
                    }
                }
                let params = {
                    goodsId: this.goodsId,
                    styleId: this.styleId,
                    sku: this.skuColor
                };

                judgeFacDelSku(params).then(res => {
                    if (res.data.data == 1) {
                        this.colorArr.push(val.value);
                        this.$message({
                            showClose: true,
                            message: "该颜色在工单引用，不可删除",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                });
            },
            // 点击删除内长调接口
            deleteLength(val) {
                var sku = [];
                for (let colorItem of this.editGoodsInfo.colors) {
                    for (let sizeItem of this.editGoodsInfo.sizes) {
                        sku.push(colorItem.id + "_" + sizeItem.id + "_" + val.value);
                    }
                }
                let params = {
                    goodsId: this.goodsId,
                    styleId: this.styleId,
                    sku: sku
                };
                judgeFacDelSku(params).then(res => {
                    if (res.data.data == 1) {
                        //通过removeTag删除时，要把值还原回去，而通过下拉列表取消勾选的操作则不需要
                        if(!val.flag){
                            this.lengthArr.push(val.value);
                        }
                        this.$message.error("该内长被工单或BOM表引用，不可删除");
                    }
                });
            },
            sizeArrFn(val) {
                this.sizeArr = val;
            },
            colorTri() {
                this.colorRotate = !this.colorRotate;
            },
            lengthTri() {
                this.lengthRotate = !this.lengthRotate;
            },
            hiddenGoods() {
                this.$emit('hidden', 0)
            },
            //搜索更多货品款号
            // seachGoodsInfo() {
            //     if (this.goodsValue) {
            //         this.downGoods = true;
            //     }
            //     let params = {
            //         facId: JSON.parse(sessionStorage.getItem("last_login")).id,
            //         keyword: this.goodsValue
            //     };
            //     selectFacGoodsStyleList(params).then(res => {
            //         if (res.data.code == 0) {
            //             console.log(res,'|||');
            //             this.info.goodsOptions = res.data.goods;
            //             this.goods = res.data.goods;
            //         }
            //     });
            // },
            colorLength(val) {
                if (val.length >= 13) {
                    this.$message({
                        showClose: true,
                        message: "选中不得超过12个",
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    return false;
                }
            },
            remoteMethodLength(query) {
                if (query.length <= 0) {
                    this.lengths = this.facInfo.length;
                    return;
                }
                let params = {
                    userId: this.userId,
                    token: "",
                    type: "length",
                    keyword: query
                };
                selectFacCommonSettings(params).then(res => {
                    this.lengths = res.data.data;
                });
            },
            timeChage(val) {
                this.formData.dateListing = val?fun.dateFormatter(val,false):'';
            },
            // 获取上传列表
            getFileList(v) {
                this.attachmentLists = v
            },
            getAttachments(v) {
                this.attachments = v
            },
            getAttrData(attrSelect,attrNewSelect,categoryId){
                this.attrSelect = attrSelect
                this.attrNewSelect = attrNewSelect
                this.categoryId = categoryId
            },
            //点击完成,确定添加
            sureSend() {
                if (!this.add_kuanhao && !this.autoNumberGood) {
                    this.tips.kuanhaoTips = true;
                } else {
                    this.tips.kuanhaoTips = false;
                }
                if (!this.colorArr.length) {
                    this.tips.colorTips = true;
                } else {
                    this.tips.colorTips = false;
                }
                if (!this.sizeArr.length) {
                    this.tips.sizeTips = true;
                } else {
                    this.tips.sizeTips = false;
                }
                for (let item in this.tips) {
                    if (this.tips[item]) {
                        return false;
                    }
                }
                let reg = /^\d+(\.\d+)?$/
                let rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(this.formData.firstSupplyPrice&&!reg.test(this.formData.firstSupplyPrice)) return this.$message.error('最初供货价不能小于0')
                if(this.formData.lastSupplyPrice&&!reg.test(this.formData.lastSupplyPrice)) return this.$message.error('最终供货价不能小于0')
                if(this.formData.accountingPrice&&!reg.test(this.formData.accountingPrice)) return this.$message.error('我司核价不能小于0')
                if(this.formData.retailPrice&&!reg.test(this.formData.retailPrice)) return this.$message.error('吊牌价不能小于0')
                if(this.priceFormData.price&&!reg.test(this.priceFormData.price)) return this.$message.error('销售价不能小于0')
                if(this.priceFormData.cost&&!reg.test(this.priceFormData.cost)) return this.$message.error('计划成本价不能小于0')
                if(this.priceFormData.materialCost&&!rule.test(this.priceFormData.materialCost)) return this.$message.error('物料成本不能小于0且最多两位小数')
                if(this.priceFormData.processingCost&&!rule.test(this.priceFormData.processingCost)) return this.$message.error('加工成本不能小于0且最多两位小数')
                if(this.formData.sellPrice&&!rule.test(this.formData.sellPrice)) return this.$message.error('动销价不能小于0且最多两位小数')
                if(this.formData.sellPricePop&&!rule.test(this.formData.sellPricePop)) return this.$message.error('动销价比不能小于0且最多两位小数')

                // 物料成本有填 && 加工成本有填 && 计划成本价没填
                if((this.priceFormData.processingCost||this.priceFormData.processingCost===0)&&(this.priceFormData.materialCost||this.priceFormData.materialCost===0)&&(!this.priceFormData.cost&&this.priceFormData.cost!==0)){
                    this.priceFormData.cost = this.priceFormData.processingCost + this.priceFormData.materialCost
                }

                let img_list_send = [];
                for (let i = 0; i < this.img_list.length; i++) {
                    img_list_send.push(
                        this.img_list[i].slice(1 + this.img_list[i].lastIndexOf("/"))
                    );
                }
                if (this.lengthArr.length == 0) {
                    var lengthArr = ['36fec3286377458bb445d0a287cd8e0e'];
                } else {
                    var lengthArr = this.lengthArr;
                }
                //获取开发部门名称
                this.getdevelopmentName();
                let params = {
                    ...this.formData,
                    token: "",
                    facId: this.facId,
                    userId: this.userId,
                    styleNo: this.add_kuanhao,
                    name: this.add_name,
                    styleId: this.styleId,
                    pictures: img_list_send,
                    colorIds: this.colorArr,
                    designerIds: this.attrSelect.designer,
                    waveIds: this.attrSelect.wave,
                    seasonIds: this.attrSelect.season,
                    kindIds: this.attrSelect.kind,
                    yearIds: this.attrSelect.year,
                    brandIds: this.attrSelect.brand,
                    tagIds: this.attrSelect.tag,
                    sizeIds: this.sizeArr,
                    categoryIds:this.categoryId,
                    attachmentLists: this.attachmentLists,
                    attachments: this.attachments,
                    field1Ids: this.attrNewSelect.field1s,
                    field2Ids: this.attrNewSelect.field2s,
                    field3Ids: this.attrNewSelect.field3s,
                    field4Ids: this.attrNewSelect.field4s,
                    field5Ids: this.attrNewSelect.field5s,
                    field6Ids: this.attrNewSelect.field6s,
                    field7Ids: this.attrNewSelect.field7s,
                    field8Ids: this.attrNewSelect.field8s,
                    remark: this.$refs['ue'].getUEContent(),
                    ...this.priceFormData,
                };
                if(!this.$refs['ue'].getUEContent()){
                    this.configRemarkMsg = false
                }else {
                    this.configRemarkMsg = true
                }
                //判断是否是编辑状态
                this.btnLoading = true;
                if(this.handleType === 'edit'){
                    let skuList = this.getSkuList();
                    let editParams = {
                        ...params,
                        goodsId: this.goodsId,
                        SkuList: skuList,
                        monthIds: this.attrSelect.month,
                        styleIds: this.attrSelect.style,
                    };
                    goodCheckOnForward(editParams).then(res=>{
                        if(res.data.code===0){
                            updateFacGoodsStyle(editParams).then(res => {
                                this.btnLoading = false;
                                if (res.data.code === 0) {
                                    let resultText = []
                                    if(res.data.successNum>0){
                                        resultText.push('成功生成'+res.data.successNum+'条条形码')
                                    }
                                    if(res.data.failNum>0){
                                        resultText.push(res.data.failNum+'条条形码生成失败')
                                    }
                                    if(resultText.length){
                                        this.$message(resultText.join(','));
                                    }
                                    this.$emit('update');
                                    this.$emit('hidden', 1, this.add_kuanhao);
                                }
                                //条形码重复
                                else if(res.data.code === 5){
                                    this.warnMessage = res.data.msg;
                                    this.warnVisible = true;
                                }else{

                                    this.$message.error(res.data.msg);
                                }
                            });
                        }else {
                            this.btnLoading = false;
                            this.goodMustConfigCodeData = res.data.data.map(item=>{
                                return item.fieldCode.trim()
                            })
                            this.configDialogVisible = true;
                            this.configDialogContent = res.data.msg;
                        }
                    })

                }else{
                    let addParams = {
                        ...params,
                        sizeIds: this.sizeArr,
                        lengthIds: lengthArr,
                        months: this.attrSelect.month,
                        styles: this.attrSelect.style,
                        styleSkuDetails: this.$refs.skuTable.skuTableData
                    };
                    addParams.styleId = '';
                    goodCheckOnForward(addParams).then(res=>{
                        if(res.data.code===0){
                            addFacGoodsStyle(addParams).then(res => {
                                this.btnLoading = false;
                                if (res.data.code === 0) {
                                    let resultText = []
                                    if(res.data.successNum>0){
                                        resultText.push('成功生成'+res.data.successNum+'条条形码')
                                    }
                                    if(res.data.failNum>0){
                                        resultText.push(res.data.failNum+'条条形码生成失败')
                                    }
                                    if(resultText.length){
                                        this.$message(resultText.join(','));
                                    }
                                    this.$emit('hidden', 1, this.add_kuanhao);
                                    this.$refs.selectSize.resetFields();
                                }
                                //条形码重复
                                else if(res.data.code === 5){
                                    this.warnMessage = res.data.msg;
                                    this.warnVisible = true;
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            });
                        }else {
                            this.btnLoading = false;
                            this.goodMustConfigCodeData = res.data.data.map(item=>{
                                return item.fieldCode.trim()
                            })
                            this.configDialogVisible = true;
                            this.configDialogContent = res.data.msg;
                        }
                    })

                }

            },
            //获取提交的sku数据格式
            getSkuList(){
                let data = this.$refs.skuTable.skuTableData;
                let sku = [];
                data.forEach(item => {
                    let obj = {};
                    obj.skuId = item.id ? item.id : '';
                    obj.skuIdStr = item.skuIdStr ? item.skuIdStr : '';
                    obj.factoryColorNo = item.factoryColorNo ? item.factoryColorNo : '';
                    obj.factoryColorName = item.factoryColorName ? item.factoryColorName : '';
                    obj.skuAttrId1 = item.skuAttrId1 ? item.skuAttrId1 : '';
                    obj.skuAttrId2 = item.skuAttrId2 ? item.skuAttrId2 : '';
                    obj.skuAttrId3 = item.skuAttrId3 ? item.skuAttrId3 : '';
                    obj.remark = item.remark ? item.remark : '';
                    obj.barcode = item.barcode ? item.barcode : '';
                    obj.skcFlag = item.skcFlag;
                    obj.cofNo = item.skcFlag?'':item.cofNo;
                    sku.push(obj);
                });
                return sku
            },
            //检查货品款号是否重复
            checkGoods() {
                let params = {
                    styleNo: this.add_kuanhao,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                checkFacGoodsStyle(params).then(res => {
                    if (res.data.code == 0) {
                        this.dialogVisible = true;
                        this.sameStyle = res.data.data;
                    } else if (res.data.code == 5) {
                        this.goodsNo = false;
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }
                });
            },
            //导入该货品弹窗
            checkS() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:
                    this.userId,
                    token: "",
                    styleId: this.sameStyle.id
                };
                addFacGoodsStyle(params).then(res => {
                    this.dialogVisible = false;
                    this.closeDialog = false;
                    this.$emit('hidden', 1)
                });
            },
            //获取当前工厂信息
            getNowDataFac(id, firstParent, twoParent) { //** 黄小帆 18/8/23 增加一个addId值用于匹配添加的内长*/
                let params = {
                    facId: this.facIds || JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: "",
                    type: "all",
                    styleId: this.styleId,
                    userId: this.userId,
                    modelName: this.modelName,
                };
                getFacUnitSettings(params).then(res => {
                    this.facInfo = res.data.data;
                    //编辑商品的时候，颜色下拉取接口数据，新建时颜色下拉为空
                    if(this.handleType === 'edit'){
                        this.colorList = res.data.data.color;
                    }else{
                        this.colorList = []
                    }
                    this.sizes = res.data.data.size;
                    this.lengths = res.data.data.length;
                    this.colorsId = [];
                    for (let i = 0; i < this.colorList.length; i++) {
                        this.colorsId.push(this.colorList[i].id);
                    }
                    if (id) {
                        if (this.title == '内长' && this.lengthArr.length < 12) {
                            this.lengthArr.push(id)
                        }
                    }
                });
            },
            // -- 图片封面选择 --
            showSelect(index) {
                this.show = index;
            },
            showSelected(index) {
                this.show = !index;
            },
            faceing(index) {
                this.img_list.unshift(this.img_list[index]);
                this.img_list.splice(index + 1, 1);
            },
            cancelImg(index) {
                this.img_list.splice(index, 1);
            },
            //图片上传逻辑
            imgUpload(e) {
                let params = {
                    appId: this.$globalConfig.appId.appId
                };
                const file = e.target.files;
                for (let i = 0; i < file.length; i++) {
                    if (file[i].size > 5000000) {
                        this.$message({
                            showClose: true,
                            message: "图片大小超过5M!,重新上传",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }
                    getUploadToken(params).then(res => {
                        this.img_name.token = res.data.uptoken;
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            var _imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
                            this.img_list.push(_imgUrl);
                        });
                    });
                }
            },
            //md5图片上传Key的拼接
            setImgKey(name) {
                const storeId = this.userId;
                const date = +new Date() + "";
                return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            listClick(item) {
                this.colorSearch = false;
                this.colorSet = item.value;
                this.colorSetName = item.name;
            },
            //货品色号部分的
            searchColorList() {
                if ((/^[A-Za-z0-9]{1,12}$/).test(this.colorSet)) {
                } else {
                    this.colorSet = '';
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    namekeyword: '',
                    valuekeyword: this.colorSet,
                    type: "color",
                    selectIds: this.colorsId,
                };
                selectDifSettings(params).then(res => {
                    this.colorSearch = true;
                    this.searchData = res.data.data.result;
                });
            },
            hideSelectSearch() {
                this.colorSearch = false;
            },
        },
        async created() {
            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            this.getAllGroup();
            this.getGoodsRole();
            this.isExistGenerateStyleNoList();
            this.getUpdateStyleNoPower();
            this.getNowDataFac();
            this.fetchUnitUser()
            this.getOutsideFactoryList()
            this.getTitleAndSelect();
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            if (this.handleType === 'edit') {
                this.getEditMes();
            }
        },

    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";

    .goods-spec {
        .el-form-item{
            width: 100%;
            margin-top:0 !important;
            margin-bottom: 20px !important;
        }
        .base_box{
            padding:10px 24px;
        }
        position: fixed;
        top: 0;
        right: 0;
        width: 1300px !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
        .customer-spec-header {
            height: 88px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 2;
        }
        .style-no-input{
            width: calc(100% - 56px);
        }
        .sku-table-wrap{
            margin-left: 85px;
        }
        .style-no-item,
        .color-item,
        .size-item {
            position: relative;
            .item-tips{
                font-size: 12px;
                position: absolute;
                top: 30px;
                left: 10px;
                color: #ff4949;
            }
        }
        .addStyle_content_thirdLine {
            margin: 15px 0;
            left:46px;
            position: relative;
            p {
                span {
                    position: relative;
                    color: #8492a6;
                    font-size: 12px;
                    span {
                        position: relative;
                        top: 8px;
                        left: 10px;
                        color: #fff;
                    }
                }
                .add_photo {
                    width: 68px;
                    height: 28px;
                    background-color: $color-btn;
                    border-radius: 4px;
                    display: inline-block;
                    color: #fff;
                    position: relative;
                    top: -10px;
                    &.disabled-bg {
                        background-color: #ccc;
                        color: #999;
                        &:hover{
                            cursor: not-allowed;
                        }

                    }
                }
                input {
                    opacity: 0;
                    position: absolute;
                    width: 60px;
                    height: 100%;
                    top: 5px;
                    left: 4px;
                    z-index: 888;
                }
            }
            ul {
                display: flex;
                justify-content: flex-start;
                padding-bottom: 4px;
                padding-top: 10px;
                background-color: #f6f6f6;
                width: 1135px;
                min-height: 120px;
                margin-left:54px;
                li {
                    width: 114px;
                    height: 114px;
                    border: 1px solid #ccc;
                    margin-right: 10px;
                    border-radius: 4px;
                    position: relative;
                    &:first-child {
                        margin-left: 15px;
                    }
                    .faceStyle {
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 777;
                        width: 0;
                        height: 0;
                        border-top: 40px solid $color_btn;
                        border-right: 40px solid transparent;
                        span {
                            position: absolute;
                            transform: rotate(45deg);
                            top: -39px;
                            left: 8px;
                            color: #fff;
                            font-size: 12px;
                        }
                    }
                    a {
                        position: relative;
                        display: inline-block;
                        height: 100%;
                        width: 100%;
                        .imgCancel {
                            position: absolute;
                            top: 3px;
                            right: 5px;
                            cursor: pointer;
                            display: inline-block;
                            height: 12px;
                            width: 12px;
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
                        border-radius: 4px;
                    }
                }
            }
        }
        .ue-mask{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 100;
            background: rgba(204,204,204,.2);
        }
    }
</style>
<style lang="scss">
    .goods-spec {
        .el-select{
            width: 100% !important;
        }
        .el-date-editor.el-input{width:100% !important;}
        .input-border .el-input__inner {
            border: 1px solid rgb(191, 200, 217);
        }

    }
    .el-select-dropdown__item.is-disabled{
        color: rgb(191, 200, 217) !important;
    }
    .el-form-item.is-error .el-input__inner{
        border-color: #ff4949;
    }
    .error-border{
        border: 1px solid #ff4949;
    }
    .ue-is-error .el-form-item__content{
        border: 1px solid #ff4949;
    }
</style>






