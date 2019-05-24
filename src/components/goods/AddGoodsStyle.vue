<template>
    <div class="addStyle" id="addStyles">
        <section class="nf-scroll-container">
            <!--头部-->
            <header class="header_line affix">
                <div class="header_right">
                    新建商品
                </div>
                <div class="header_left">
                    <nf-button class="is-plain" @click="$router.push('/goodsMangement')">取消</nf-button>
                    <nf-button type="warning" :loading="visible.btnLoading" @click="sureSend">完成</nf-button>
                </div>
            </header>
            <!--基本信息-->
            <!-- <div class="nf-scroll-view">
                <div class="addStyle_content">
                    <p class="addStyle_content_header"><span class="line"></span>基本信息</p>
                    <div class="addStyle_content_firstLine"> -->
                <base-box>
                    <content-wrap title="基本信息" class="base-border">
                        <el-form
                        ref="baseInfo"
                        label-width="85px">
                            <el-row >
                                <el-col :span="6">
                                    <el-form-item  label="商品款号">
                                        <el-input :class="{'goods-warn':goodRepeat}" :disabled="autoNumberGood" @blur.self.stop="checkGoods" :maxlength="30" v-model.trim="formData.styleNo"
                                                  :placeholder="!autoNumberGood?'请输入商品款号':'系统自动生成'"></el-input>
                                    </el-form-item>
                                    <span class="form-tips" v-show="goodRepeat">该商品款号已存在，请重新输入</span>

                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="商品名称" prop="name">
                                        <el-input :maxlength="30" v-model.trim="formData.name"
                                                placeholder="请输入商品名称"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="供应商" prop="name">
                                        <outside-supplier-select :canAdd="true" @getSupplierId="changeSupplierId"></outside-supplier-select>
                                        <!-- <el-select
                                            v-model="formData.outSideFactoryId"
                                            filterabl
                                            clearable
                                            placeholder="全部">
                                            <el-option v-for="item in outsideFactoryList" :key="item.id" :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select> -->
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="厂家货号" prop="name">
                                        <el-input :maxlength="30" v-model.trim="formData.plantArticleNumber"
                                                placeholder="请输入厂家货号"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="颜色" :required="true">
                                        <colorSelectGroup class="form-select" v-model="formData.colorIds" :groupData="colorList"></colorSelectGroup>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="尺码">
                                        <size-select  class="form-select" :selectedSizes="formData.sizeIds" ref="selectSize" :isGoodsAdd="true"></size-select>
                                    </el-form-item>
                                </el-col>

                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="内长">
                                        <el-select
                                                filterable
                                                multiple
                                                v-model="formData.lengthIds"
                                                @change="colorLength"
                                                placeholder="请选择内长"  class="form-select">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="add-attr"
                                                    @click="visible.dialogAdd = true;title='内长'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in lengthList" :key="item.id" :label="item.name"
                                                    :value="item.id">
                                                <!-- <div
                                                    style="position: absolute;left:0;right:0;top:0;padding:8px 10px;">
                                                    {{item.name}}
                                                </div> -->
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </content-wrap>
                </base-box>
                <base-box class="procedure">
                    <content-wrap title="属性信息" class="base-border">
                        <el-form
                                ref="cateInfo"
                                class="create-form"
                                :model="formData"
                                label-width="85px">
                            <el-row>
                                <el-col :span="6">
                                    <el-form-item  label="品牌">
                                        <el-select
                                                filterable
                                                multiple
                                                v-model="formData.brandIds"
                                                placeholder="请选择品牌">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="new_set"
                                                    @click="visible.dialogAdd = true;title='品牌'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in brandList" :key="item.id" :label="item.value"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item class="create-form__item" label="品类">
                                        <category-select :options="categoryList" v-model="categoryId" @success="getUnitSetting"></category-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="设计师">
                                        <el-select
                                                filterable
                                                multiple
                                                v-model="formData.designerIds"
                                                placeholder="请选择设计师">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="add-attr"
                                                    @click="visible.dialogAdd = true;title='设计师'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in designerList" :key="item.id" :label="item.value"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="年份">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.yearIds"
                                                placeholder="请选择年份">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="new_set"
                                                    @click="visible.dialogAdd = true;title='年份'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in yearList" :key="item.id" :label="item.value"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                
                            </el-row>

                            <el-row>
                                <el-col :span="6">
                                    <el-form-item class="create-form__item" label="月份">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.months"
                                                placeholder="请选择月份">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="new_set"
                                                        @click="visible.dialogAdd = true;title='月份'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in monthList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item class="create-form__item" label="季节">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.seasonIds"
                                                placeholder="请选择季节">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="new_set"
                                                        @click="visible.dialogAdd = true;title='季节'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in seasonList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="分类">
                                        <el-select
                                                filterable
                                                multiple
                                                v-model="formData.kindIds"
                                                placeholder="请选择分类">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="add-attr"
                                                        @click="visible.dialogAdd = true;title='分类'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in kindList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="标签">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.tagIds"
                                                placeholder="请选择标签">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="add-attr"
                                                        @click="visible.dialogAdd = true;title='标签'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in tagList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <el-row class="base-border">
                                <el-col :span="6">
                                    <el-form-item label="风格">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.styles"
                                                placeholder="请选择风格">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="add-attr"
                                                        @click="visible.dialogAdd = true;title='风格'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in styleList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item class="create-form__item" label="波段">
                                        <el-select
                                                multiple
                                                filterable
                                                v-model="formData.waveIds"
                                                placeholder="请选择波段">
                                            <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                                <div class="new_set"
                                                        @click="visible.dialogAdd = true;title='波段'">新建
                                                </div>
                                            </el-option>
                                            <el-option v-for="item in waveList" :key="item.id" :label="item.value"
                                                        :value="item.id">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>

                            <!-- 自定义属性 -->
                    <el-row style="margin-top:12px;">
                        <el-col :span="6" v-for="(item,index) in customList" :key="index" v-if="item.type != 18">
                            <el-form-item :label="item.name">
                                <el-select v-model="formData.field1Ids" multiple filterable :placeholder="`请选择${item.name}`" v-if="item.type=='14'">
                                    <template>
                                        <el-option :value="''" disabled style="cursor:pointer;">
                                            <span class="new_set" @click="visible.dialogAdd = true;title=`${item.name}`;type=`${item.type}`">新建</span>
                                        </el-option>
                                    </template>
                                    <el-option v-for="el in fieldList1" :key="el.id" :label="el.value"
                                                :value="el.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="formData.field2Ids" multiple filterable :placeholder="`请选择${item.name}`"  v-else-if="item.type=='15'">
                                    <template>
                                        <el-option :value="''" disabled style="cursor:pointer;">
                                            <span class="new_set" @click="visible.dialogAdd = true;title=`${item.name}`;type=`${item.type}`">新建</span>
                                        </el-option>
                                    </template>
                                    <el-option v-for="el in fieldList2" :key="el.id" :label="el.value"
                                                :value="el.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="formData.field3Ids" multiple filterable :placeholder="`请选择${item.name}`" v-else-if="item.type=='16'">
                                    <template>
                                        <el-option :value="''" disabled style="cursor:pointer;">
                                            <span class="new_set" @click="visible.dialogAdd = true;title=`${item.name}`;type=`${item.type}`">新建</span>
                                        </el-option>
                                    </template>
                                    <el-option v-for="el in fieldList3" :key="el.id" :label="el.value"
                                                :value="el.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="formData.field4Ids" multiple filterable :placeholder="`请选择${item.name}`" v-else-if="item.type=='17'">
                                    <template>
                                        <el-option :value="''" disabled style="cursor:pointer;">
                                            <span class="new_set" @click="visible.dialogAdd = true;title=`${item.name}`;type=`${item.type}`">新建</span>
                                        </el-option>
                                    </template>
                                    <el-option v-for="el in fieldList4" :key="el.id" :label="el.value"
                                                :value="el.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6" v-for="(item,index) in customList" :key="index" v-if="item.type == 18">
                            <el-form-item class="create-form__item" :label="item.name">
                                <el-select v-model="formData.field5Ids" multiple filterable :placeholder="`请选择${item.name}`">
                                    <template>
                                        <el-option :value="''" disabled style="cursor:pointer;">
                                            <span class="new_set" @click="visible.dialogAdd = true;title=`${item.name}`;type=`${item.type}`">新建</span>
                                        </el-option>
                                    </template>
                                    <el-option v-for="el in fieldList5" :key="el.id" :label="el.value"
                                                :value="el.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                        </el-form>
                    </content-wrap>
                </base-box>
                <base-box class="procedure">
            <content-wrap title="描述信息" class="base-border">
                <el-form
                        ref="goodsInfo"
                        class="create-form"
                        :model="formData"
                        label-width="100px">
                    <!-- <el-row class="create-form__row" type="flex">

                        <el-form-item class="create-form__item" label="商品名称">
                            <el-input v-model.trim="formData.styleName" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-row> -->

                    <!-- <el-row class="create-form__row" type="flex">
                        <el-form-item style="width: auto" class="create-form__item" label="图片">
                            <input type="file" style="display: none;" id="file-upload3"
                                   accept="image/png,image/jpeg,image/jpg,image/gif" multiple @change="imgUpload">
                            <label class="upload-file" for="file-upload3">添加图片</label>
                            <span style="font-size: 12px;color: #A2ABB8">只能上传 jpg/png 文件，且不超过 5m</span>
                            <pic-list :fileList="pic.pic"></pic-list>
                        </el-form-item>
                    </el-row> -->
                    <el-row>
                        <el-form-item style="width: auto" class="create-form__item" label="图片">
                            <input type="file" style="display: none;" id="file-upload3"
                                    accept="image/png,image/jpeg,image/jpg,image/gif" multiple @change="imgUpload">
                            <label class="upload-file" for="file-upload3">添加图片</label>
                            <span style="font-size: 12px;color: #A2ABB8">只能上传 jpg/png 文件，且不超过 5m</span>
                            <pic-list :fileList="formData.pictures"></pic-list>
                        </el-form-item>
                    </el-row>
                    <el-row class="create-form__row" type="flex">
                        <el-form-item style="width: auto" label="商品描述" v-show="!designList||designList&&designList.content">
                            <UE @htmlData="htmlChange" :defaultMsg=defaultMsg :config=config id="ueId-add-style" ref="ue"></UE>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item  label="模式">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="formData.model"
                                    placeholder="请选择">
                                    <el-option v-for="item in patternList" :key="item.value" :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="上市时间">
                                <el-date-picker
                                    v-model="formData.dateListing"
                                    type="date"
                                    @change="timeChage"
                                    placeholder="选择日期">
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="国标码">
                                <el-input v-model.trim="formData.internationalCode" placeholder="请输入" :maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="开发者">
                                <v-user-select v-model="formData.developerIds" :options="options.groupOptions" @remote="fetchUnitUser" placeholder="请选择"></v-user-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="开发部门">
                                <el-input v-model.trim="formData.developmentDepartment" :maxlength="20" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="最初供货价">
                                <el-input type="number" v-model.trim="formData.firstSupplyPrice" :maxlength="20" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="我司核价">
                                <el-input type="number" v-model.trim="formData.accountingPrice" :maxlength="20" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row >
                        <el-col :span="6">
                            <el-form-item label="最终供货价">
                                <el-input type="number" v-model.trim="formData.lastSupplyPrice" :maxlength="20" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="零售价">
                                <el-input type="number" v-model.trim="formData.retailPrice" :maxlength="20" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </content-wrap>
        </base-box>
        <!-- 附件 -->
        <base-box class="procedure">
            <content-wrap title="附件">
                <upload-form :tableData="attachmentLists" :fileList="attachments" @getFileList="getFileList" @getAttachments="getAttachments"></upload-form>
            </content-wrap>
        </base-box>
                    <!-- </div>
                </div> -->
                <!--工艺信息-->
                <!--<div class="art-order">-->
                    <!--<art-order ref='art' @getArtData ='getArtData'></art-order>-->
                <!--</div>-->
            <!-- </div> -->
        </section>
        <div class="setGoodsForOtherFac">
            <el-dialog id="require" :visible.sync="dialogVisible" :show-close="false" size="tiny">
                <p style="font-size:15px;">该款号的货品资料在其他分厂已经存在，是否要导入本厂？</p>

                <div slot="footer" align="center">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="checkS">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!--各种属性新建弹窗-->
        <attribute-dialog :title="title" :show.sync="visible.dialogAdd" @success="getUnitSetting" :type="type"></attribute-dialog>
    </div>
</template>
<script>
    // import artOrder from './child/artOrder.vue'//工艺单组件
    import picList from '../designFile/designFileInfo/pic-list'
    import sizeSelect from '../Common/size-select.vue'
    import attributeDialog from '../Common/attributeDialog'
    import supplierSelect from '@/components/Common/custom-select/supplier-select'; // 供应商
    import categorySelect from '@/components/Common/category-select-group.vue'; // 品类
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    import UE from '../ue/ue';
    const fun  = require('@/components/Common/commonFun.js')
    //接口这边需要调用新增工厂那边的接口，然后获取图片需要调用和七牛base64不一样的上传接口
    import {
        getUploadToken,
        addFacGoodsStyle,
        upDetailImgs,
        addFacUnitSettings,
        deleteFacUnitSettings,
        getFacUnitSettings,
        selectFacCommonSettings,
        checkFacGoodsStyle,
        selectDifSettings,
        isExistGenerateStyleNoList,
        getTagName,
        getUnitUser,
        outsideFactoryListForSelect
    } from "@/api";

    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";

    export default {
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        data() {
            return {
                goodRepeat:false,
                getFacCommonSettings:true,
                autoNumberGood:false,
                attrSelect: {
                    designer: [],
                    wave: [],
                    kind: [],
                    season: [],
                    year: [],
                    tag: [],
                    brand: [],
                    style: [],
                    month: [],
                },
                title: '', //新建弹窗的标题
                colorName: '', //新建颜色名称
                attrName: '', //
                formData: {
                    styleNo: '',
                    name: '',
                    styleId: '',
                    pictures: [],
                    colorIds: [],
                    sizeIds: [],
                    lengthIds: [],
                    designerIds: [],
                    waveIds: [],
                    seasonIds: [],
                    kindIds: [],
                    yearIds: [],
                    brandIds: [],
                    tagIds: [],
                    styles: [],
                    months: [],
                    designHeadIds: [],
                    supplierId:'', // 供应商
                    content: '', // 富文本
                    outSideFactoryId: '', //供应商 outSideFactoryId
                    plantArticleNumber: '', // 厂家货号
                    model: '', // 模式
                    dateListing: '', // 上市日期
                    internationalCode: '', // 国标码
                    developmentDepartment: '', // 开发部门
                    firstSupplyPrice: '', // 最初供货价
                    lastSupplyPrice: '', // 最终供货价
                    accountingPrice: '', // 我司核价
                    retailPrice: '', // 零售价
                    developerIds: [],
                    field1Ids: [], // 自定义属性1
                    field2Ids: [], // 自定义属性2
                    field3Ids: [], // 自定义属性3
                    field4Ids: [], // 自定义属性4
                    field5Ids: [], // 自定义属性5
                },
                outsideFactoryList: [],
                visible: {
                    cancelVisible: false,
                    dialogAdd: false,
                    btnLoading: false,
                    addLoading: false
                },
                dialogVisible: false,
                colorList: [],
                brandList: [],
                seasonList: [],
                waveList: [],
                designerList: [],
                kindList: [],
                lengthList: [],
                yearList: [],
                tagList: [],
                styleList: [],
                monthList: [],
                designHeadId: [],//多选设计负责人的id
                categoryList: [],//品类分类
                categoryId: [],//品类分类
                fieldList1: [], // 自定义属性1列表
                fieldList2: [], // 自定义属性2列表
                fieldList3: [], // 自定义属性3列表
                fieldList4: [], // 自定义属性4列表
                fieldList5: [], // 自定义属性5列表
                attachmentLists:[], // 表格上传
                attachments: [], // 其他上传
                customList: [], // 自定义属性名称
                sameStyle: {},
                img_name: {
                    token:''
                },
                checkRes: {
                    code: 4,
                    msg: ''
                },
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 164,
                    zIndex: 99
                }, // 富文本框
                options: {groupOptions:[]},// 开发者
                type: null,
                patternList: [
                    {value: 0, label: '联营'},
                    {value: 1, label: '买断'},
                    {value: 2, label: '包销'}
                ],
            }
        },
        components: {
            // artOrder,
            sizeSelect,
            picList,
            attributeDialog,
            supplierSelect,
            categorySelect,
            uploadForm,
            UE
        },
        methods: {
            //获取供应商
            changeSupplierId(val) {
                this.formData.supplierId = val.id
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
                // 获取自定义属性名称
            getTagName() {
                let params = {
                    bossUnitId: this.bossUnitId
                }
                getTagName(params).then(res => {
                    let data = res.data.goodsFields
                    data.forEach(i => {
                        if(i.type ==14 || i.type ==15 || i.type ==16 || i.type ==17 || i.type ==18) {
                            this.customList.push(i)
                        }
                    })
                })
            },
            //检查获取 是否设置为自动编号
            isExistGenerateStyleNoList(){
                isExistGenerateStyleNoList({userId:this.userId}).then(res=>{
                    console.log(res);
                    res.data.data.forEach(item=>{
                        if(item.modelType===2){
                            this.autoNumberGood = item.userDefinedRule
                        }
                    })
                })
            },
            checkS() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    token: "",
                    styleId: this.sameStyle.id
                };
                addFacGoodsStyle(params).then(res => {
                    this.$router.push("/goodsMangement");
                });
            },
            checkGoods() {
                if (this.formData.styleNo.trim()==='') { // 款号为空的时候不发请求
                    return
                }
                let params = {
                    styleNo: this.formData.styleNo,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                checkFacGoodsStyle(params).then(res => {
                    this.checkRes = res.data
                    console.log(this.checkRes)
                    if (res.data.code == 0) {
                        this.goodRepeat = false
                        this.dialogVisible = true;
                        this.sameStyle = res.data.data;
                    } else if (res.data.code == 5) {
                        this.goodRepeat = true
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }else {
                        this.goodRepeat = false
                    }

                });
            },
            //获取属性下拉框列表
            getUnitSetting(id, firstParent, twoParent) {
                let params = {
                    facId: this.facId,
                    type: 'all'
                }
                getFacUnitSettings(params).then(res => {
                    console.log(res.data.data, '属性下拉');
                    this.colorList = res.data.data.color
                    this.lengthList = res.data.data.length
                    this.brandList = res.data.data.brand
                    this.designerList = res.data.data.designer
                    this.kindList = res.data.data.kind
                    this.tagList = res.data.data.tag
                    this.styleList = res.data.data.style
                    this.yearList = res.data.data.year
                    this.monthList = res.data.data.month
                    this.seasonList = res.data.data.season
                    this.waveList = res.data.data.wave

                    this.fieldList1 = res.data.data.field1
                    this.fieldList2 = res.data.data.field2
                    this.fieldList3 = res.data.data.field3
                    this.fieldList4 = res.data.data.field4
                    this.fieldList5 = res.data.data.field5
                    this.categoryList = res.data.data.category
                    console.log(id)
                    if (id) {
                        if (this.title == '颜色' && this.formData.colorIds.length < 12) {
                            this.formData.colorIds.push(id)
                        } else if (this.title == '内长' && this.formData.lengthIds.length < 12) {
                            this.formData.lengthIds.push(id)
                        } else if (this.title == '品牌' && this.formData.brandIds.length < 12) {
                            this.formData.brandIds.push(id)
                        } else if (this.title == '设计师' && this.formData.designerIds.length < 12) {
                            this.formData.designerIds.push(id)
                        } else if (this.title == '分类' && this.formData.kindIds.length < 12) {
                            this.formData.kindIds.push(id)
                        } else if (this.title == '风格' && this.formData.styles.length < 12) {
                            this.formData.styles.push(id)
                        } else if (this.title == '标签' && this.formData.tagIds.length < 12) {
                            this.formData.tagIds.push(id)
                        }else if (this.title == '年份' && this.formData.yearIds.length < 12) {
                            this.formData.yearIds.push(id)
                        } else if (this.title == '季节' && this.formData.seasonIds.length < 12) {
                            this.formData.seasonIds.push(id)
                        } else if (this.title == '月份' && this.formData.months.length < 12) {
                            this.formData.months.push(id)
                        }  else if (this.title == '波段' && this.formData.waveIds.length < 12) {
                            this.formData.waveIds.push(id)
                        }  else if (this.type == 14 && this.formData.field1Ids.length < 12) {
                            this.formData.field1Ids.push(id)
                        } else if (this.type == 15 && this.formData.field2Ids.length < 12) {
                            this.formData.field2Ids.push(id)
                        } else if (this.type == 16 && this.formData.field3Ids.length < 12) {
                            this.formData.field3Ids.push(id)
                        } else if (this.type == 17 && this.formData.field4Ids.length < 12) {
                            this.formData.field4Ids.push(id)
                        } else if (this.type == 18 && this.formData.field5Ids.length < 12) {
                            this.formData.field5Ids.push(id)
                        } else {
                            if (firstParent&&twoParent) {
                                this.categoryId = [firstParent,twoParent,id]
                            } else if (firstParent) {
                                this.categoryId = [firstParent,id]
                            } else {
                                this.categoryId = [id]
                            }

                        }
                        // this.attrValue = ''
                        // this.attrName = ''
                        // this.colorName = ''
                    }
                })
            },
            // 设计负责人下拉数据
            getManId(arrId) {
                this.formData.designHeadIds = arrId//设计负责人下拉选中值
            },
            // -----图片封面选择 ----------
            showSelect(index) {
                this.show = index;
            },
            showSelected(index) {
                this.show = !index;
            },
            faceing(index) {
                this.formData.pictures.unshift(this.formData.pictures[index]);
                this.formData.pictures.splice(index + 1, 1);
                //console.log(this.img_list, "设置封面的时候");
            },
            cancelImg(index) {
                this.formData.pictures.splice(index, 1);
            },
            //图片上传逻辑
            async imgUpload(e) {
                let params = {
                    appId: this.$globalConfig.appId.appId
                };
                const file = e.target.files;
                console.log(file);
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
                    await getUploadToken(params).then(res => {
                        this.img_name.token = res.data.uptoken;
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            const _imgUrl =
                                this.$globalConfig.qiniu.baseUrl + result.data.key;
                            this.formData.pictures.push(_imgUrl);
                        });
                    });
                }
            },
            //md5图片上传Key的拼接
            setImgKey(name) {
                const storeId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
                const date = +new Date() + "";
                return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
            },
            timeChage(val) {
                this.formData.dateListing = fun.dateFormatter(val,false);
            },
            // 获取上传列表
            getFileList(v) {
                this.attachmentLists = v
            },
            getAttachments(v) {
                this.attachments = v
            },
            //点击完成,确定添加
            sureSend() {
                this.visible.btnLoading = true;
                this.formData.remark = this.$refs['ue'].getUEContent()
                // 判断工艺单是否有填写
                // if(this.$refs.art.processForms.length>0) {
                //     for(let i=0;i<this.$refs.art.processForms.length;i++) {
                //         if(this.$refs.art.processForms[i].name=='') {
                //             this.$message({
                //                 showClose: true,
                //                 message: '有工艺单名称为空',
                //                 type: "error",
                //                 duration: this.$globalConfig.elementUI.duration
                //             });
                //             this.isLoading = false;
                //             return;
                //         }else if(this.$refs.art.processForms[i].name.length<=1){
                //             this.$message({
                //                 showClose: true,
                //                 message: '有工艺单名称长度小于2',
                //                 type: "error",
                //                 duration: this.$globalConfig.elementUI.duration
                //             });
                //             this.isLoading = false;
                //             return;
                //         }
                //     }
                // }
                // console.log(this.$refs.art.processForms);
                let params = {
                    styleNo: this.add_kuanhao,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                if (this.checkRes.code===4) {
                    this.visible.btnLoading = false;
                    if (!this.formData.colorIds.length) {
                        this.$message({
                            showClose: true,
                            message: "颜色输入为空!",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }
                    this.formData.sizeIds=this.$refs.selectSize.getSizeIdArr();
                    if (this.formData.sizeIds.length < 1) {
                        this.$message({
                            showClose: true,
                            message: "尺码输入为空!",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }
                    let reg = /^\d+(\.\d+)?$/
                    if(this.formData.firstSupplyPrice&&!reg.test(this.formData.firstSupplyPrice)) return this.$message.error('最初供货价不能小于0')
                    if(this.formData.lastSupplyPrice&&!reg.test(this.formData.lastSupplyPrice)) return this.$message.error('最终供货价不能小于0')
                    if(this.formData.accountingPrice&&!reg.test(this.formData.accountingPrice)) return this.$message.error('我司核价不能小于0')
                    if(this.formData.retailPrice&&!reg.test(this.formData.retailPrice)) return this.$message.error('零售价不能小于0')
                    let img_list_send = [];
                    for (let i = 0; i < this.formData.pictures.length; i++) {
                        img_list_send.push(
                            this.formData.pictures[i].slice(1 + this.formData.pictures[i].lastIndexOf("/"))
                        );
                    }
                    if(this.formData.lengthIds.length==0) {
                        this.formData.lengthIds = ['36fec3286377458bb445d0a287cd8e0e'];
                    }
                    let params = {
                        token: "",
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                        styleNo: this.formData.styleNo, // 款号
                        name: this.formData.name|| '未填写',  // 名称
                        styleId: "",
                        pictures: img_list_send, // 图片
                        colorIds: this.formData.colorIds,
                        sizeIds: this.formData.sizeIds,
                        lengthIds: this.formData.lengthIds,
                        designerIds: this.formData.designerIds,
                        waveIds: this.formData.waveIds,
                        seasonIds: this.formData.seasonIds,
                        kindIds: this.formData.kindIds,
                        yearIds: this.formData.yearIds,
                        brandIds: this.formData.brandIds,
                        tagIds: this.formData.tagIds,
                        designHeadIds:this.formData.designHeadIds,//设计师下拉数据id
                        styles:this.formData.styles,//设计师下拉数据id
                        months:this.formData.months,//设计师下拉数据id
                        // processForms:this.$refs.art.processForms,//工艺单内容
                        // categorySmallId: this.categoryId[2],
                        categoryIds: this.categoryId, //品类
                        attachmentLists: this.attachmentLists,
                        attachments: this.attachments,
                        field1Ids: this.formData.field1Ids,
                        field2Ids: this.formData.field2Ids,
                        field3Ids: this.formData.field3Ids,
                        field4Ids: this.formData.field4Ids,
                        field5Ids: this.formData.field5Ids,

                        outSideFactoryId: this.formData.supplierId, //供应商
                        plantArticleNumber: this.formData.plantArticleNumber, // 厂家货号
                        model: this.formData.model, // 模式
                        dateListing: this.formData.dateListing, // 上市日期
                        internationalCode: this.formData.internationalCode, // 上市日期
                        developmentDepartment: this.formData.developmentDepartment, // 开发部门
                        firstSupplyPrice: this.formData.firstSupplyPrice, // 最初供货价
                        lastSupplyPrice: this.formData.lastSupplyPrice, // 最终供货价
                        accountingPrice: this.formData.accountingPrice, // 我司核价
                        retailPrice: this.formData.retailPrice, // 零售价
                        developerIds: this.formData.developerIds,
                        remark: this.formData.remark
                    };
                    console.log(params,'5588585858');
                    if(!this.autoNumberGood && !this.formData.styleNo){
                        this.$message.error('没设定自定义规则时商品款号不能为空')
                        return
                    }
                    addFacGoodsStyle(params).then(res => {
                        this.visible.btnLoading = false;
                        console.log(res);
                        if (res.data.code == 0) {
                            this.$message.success('添加成功');
                            this.$router.push({
                                path: "/goodsMangement"
                            });
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
                    this.visible.btnLoading = false;
                    if (!this.formData.colorIds.length) {
                        this.$message({
                            showClose: true,
                            message: this.checkRes.msg,
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return false;
                    }
                }
                // checkFacGoodsStyle(params).then(res => {
                //     this.visible.btnLoading = false;
                //     if (res.data.code == 0) {
                //         this.dialogVisible = true;
                //         this.sameStyle = res.data.data;
                //     } else if(res.data.code == 4) {
                //             // if (!this.formData.styleNo) {
                //             //     this.$message({
                //             //         showClose: true,
                //             //         message: "款号不能为空!",
                //             //         type: "error",
                //             //         duration: this.$globalConfig.elementUI.duration
                //             //     });
                //             //     return false;
                //             // }
                //             if (!this.formData.colorIds.length) {
                //                 this.$message({
                //                     showClose: true,
                //                     message: "颜色输入为空!",
                //                     type: "error",
                //                     duration: this.$globalConfig.elementUI.duration
                //                 });
                //                 return false;
                //             }
                //             this.formData.sizeIds=this.$refs.selectSize.getSizeIdArr();
                //             if (this.formData.sizeIds.length < 1) {
                //                 this.$message({
                //                     showClose: true,
                //                     message: "尺码输入为空!",
                //                     type: "error",
                //                     duration: this.$globalConfig.elementUI.duration
                //                 });
                //                 return false;
                //             }
                //             let img_list_send = [];
                //             for (let i = 0; i < this.formData.pictures.length; i++) {
                //                 img_list_send.push(
                //                     this.formData.pictures[i].slice(1 + this.formData.pictures[i].lastIndexOf("/"))
                //                 );
                //             }
                //             if(this.formData.lengthIds.length==0) {
                //                 this.formData.lengthIds = ['36fec3286377458bb445d0a287cd8e0e'];
                //             }
                //             let params = {
                //                 token: "",
                //                 facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                //                 userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                //                 styleNo: this.formData.styleNo, // 款号
                //                 name: this.formData.name|| '未填写',  // 名称
                //                 styleId: "",
                //                 pictures: img_list_send, // 图片
                //                 colorIds: this.formData.colorIds,
                //                 sizeIds: this.formData.sizeIds,
                //                 lengthIds: this.formData.lengthIds,
                //                 designerIds: this.formData.designerIds,
                //                 waveIds: this.formData.waveIds,
                //                 seasonIds: this.formData.seasonIds,
                //                 kindIds: this.formData.kindIds,
                //                 yearIds: this.formData.yearIds,
                //                 brandIds: this.formData.brandIds,
                //                 tagIds: this.formData.tagIds,
                //                 designHeadIds:this.formData.designHeadIds,//设计师下拉数据id
                //                 styles:this.formData.styles,//设计师下拉数据id
                //                 months:this.formData.months,//设计师下拉数据id
                //                 // processForms:this.$refs.art.processForms,//工艺单内容
                //             };
                //             console.log(params,'5588585858');
                //             addFacGoodsStyle(params).then(res => {
                //                 this.visible.btnLoading = false;
                //                 console.log(res);
                //                 if (res.data.code == 0) {
                //                     this.$message.success('添加成功');
                //                     this.$router.push({
                //                         path: "/goodsMangement"
                //                     });
                //                 } else {
                //                     this.$message({
                //                         showClose: true,
                //                         message: res.data.msg,
                //                         type: "error",
                //                         duration: this.$globalConfig.elementUI.duration
                //                     });
                //                 }
                //             });
                //     } else {
                //         this.$message({
                //             showClose: true,
                //             message: res.data.msg,
                //             type: "error",
                //             duration: this.$globalConfig.elementUI.duration
                //         });
                //         return false;
                //     }
                // });
            }
        },
        async created() {
            // this.getNowDataFac();
            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            await this.getUnitSetting()
            await this.getTagName()
            await this.fetchUnitUser()
            await this.isExistGenerateStyleNoList()
        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    a:link {
        color: $color-btn;
    }

    a:visited {
        color: $color-btn;
    }

    a:active {
        color: $color-btn;
    }
    .line{
        display:inline-block;
        width:6px;
        height: 20px;
        background-color: #ff9c38;
        margin-right: 10px;
    }
    .upload-file {
        width: 64px;
        line-height: 28px;
        background: #1CA1FF;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        margin-bottom: 8px;
    }
    .addStyle {
        font-size:12px !important;
        // padding-bottom: 5px;
        border-radius: 4px;
        // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);
        position: relative;
        // height: 1000px;
        box-sizing: border-box;
        position: relative;
        .form-tips {
            font-size: 12px;
            position: absolute;
            bottom:8px;
            left: 90px;
            color: #FA4150;
        }
        .base-border{
            border-bottom: 1px solid #E6EAF0;
        }
        .header_line {
            z-index: 2;
            top: 80px;
            left: 224px;
            margin-bottom: 60px;
            // background-color: #fff; // position: fixed;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 32px;
            // height: 68px;
            .header_right {
                font-size: 24px;
            }
            .header_left {
                // margin-left: 80%;
                .nf-button--default {
                    margin-right: 14px;
                }
            }
        }
        .header-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 72px;
        }
        .header_name {
            font-size: 16px;
            span {
                border-bottom: 2px solid #000;
                display: flex;
                align-items: center;
                height: 100%;
            }
        }
        .btn_header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 72px;
            width: 100%;
            .cancel_header {
                width: 64px;
                height: 28px;
                border: 1px solid $color-btn;
                border-radius: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: $color-btn;
                margin: 0 20px 0 40px;
                font-size: 12px;
            }
            .affirm_header {
                width: 64px;
                height: 29px;
                background-color: $color-btn;
                border-radius: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                cursor: pointer;
            }
        }
        //添加基本信息内容样式开始
        .addStyle_content {
            background-color: #fff;
            padding: 0 32px;
            margin-bottom: 16px;
            .addStyle_content_header {
                display: flex;
                align-items: center;
                padding: 32px 0 30px;
                font-size: 20px;
            }
            .addStyle_content_firstLine {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #636363;
                margin-bottom: 20px;
                margin-left: 14px;
                input {
                    display: inline-block;
                    border: 1px solid #d5d5d5;
                    font-size: 14px;
                    border-radius: 2px;
                    width: 260px;
                    height: 32px;
                    text-indent: 0.8em;
                    &::-webkit-input-placeholder {
                        color: #babdc2;
                    }
                }
            }
            .info-list-s {
                color: #636363;
                margin-bottom: 20px;
                .info-list-inner {
                    display: flex;
                    align-items: center;
                    position: relative;
                    .new_set {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 36px;
                        margin-left: 10px;
                        color: #ff9c38;
                    }
                    .el-icon-caret-bottom{
                        position: absolute;
                        right: -666px;
                        top: 2px;
                        z-index: 1;
                        font-size: 12px;
                        color: rgb(191, 200, 217);
                        transition: all .5s;
                    }
                    .caret{
                        transition: all .5s;
                        transform: rotate(180deg);
                    }
                }
            }
            .addStyle_content_secondLine {
                height: 130px;
                margin-left: 14px;
            }
            .addStyle_content_thirdLine {
                margin-top: 30px;
                position: relative;
                margin-bottom: 30px;
                margin-left: 14px;
                p {
                    margin-bottom: 12px;
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
                    .upload-file {
                        display: inline-block;
                        width: 80px;
                        height: 36px;
                        line-height: 34px;
                        font-size: 14px;
                        text-align: center;
                        cursor: pointer;
                        border-radius: 2px;
                        background-color: #f7fafc;
                        border: solid 1px #1ca1ff;
                        &:hover {
                            background: #f0f6fa;
                            border: solid 1px #1ca1ff;
                        }
                    }
                    input {
                        opacity: 0;
                        position: absolute;
                        width: 60px;
                        height: 100%; // opacity
                        z-index: -999999;
                        &::-webkit-input-placeholder {
                            color: #babdc2;
                        }
                    }
                }
            }
            .addStyle_content_fourLine {
                // min-height: 500px;
                .info_four {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .brand_four {
                    justify-content: flex-start;
                }
            }
        }
        .art-order{
            background-color: #fff;
            min-height:140px;

        }
        .color-title {
            display: flex;
            justify-content: center;
            color: #2c2c2c;
        }
        .color-set {
            display: flex;
            justify-content: center;
            font-size: 14px;
            margin-top: 16px;
            input {
                width: 260px;
                border: 1px solid #d5d5d5;
                height: 34px;
                border-radius: 2px;
                text-indent: .2em;
                font-size: 14px;
                &::-webkit-input-placeholder {
                    color: #babdc2;
                }
            }
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            .cancel {
                margin-right: 16px;
            }
        }
        .color-lisearch {
            cursor:pointer;
            display:flex;
            justify-content:flex-start;
            align-items:center;
            height:36px;
            padding-left:12px;
            box-sizing: border-box;
            &:hover {
                background-color: #ccc;
            }
        }
        .form-select{
            // width:50% !important;
            .el-select{
                width:100% !important;
            }
        }
        // .el-select-dropdown__item.is-disabled{color: #ff9c38 !important;}
    }
</style>
<style lang="scss">
    @import "~scss_vars";
    .form-select{
        .el-select{width:100% !important;}
    }
    .el-scrollbar{
        .el-select-dropdown__item.is-disabled{color: #ff9c38 !important;}
    }
    .addStyle{
        .el-select{width:100% !important;}
        .el-date-editor.el-input{
            width: 100% !important;
        }
        .el-input__icon + .el-input__inner{
            font-size:12px;
        }
        .goods-warn {
            .el-input__inner {
                border: 1px solid red !important;
            }
        }
    }
</style>
