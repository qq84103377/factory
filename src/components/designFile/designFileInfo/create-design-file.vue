<template>
    <section :class="{'create-design-file':true,'width':!editable}" id="createDesignFileBox">
        <page-title :title="isEdit?'编辑设计档案':'新建设计档案'">
            <nf-button class="btn" @click="cancel">
                取消
            </nf-button>
            <nf-button :loading="visible.btnLoading" @click="addFile(0)" class="btn save-btn">
                保存
            </nf-button>
            <nf-button @click="submit('formData')" class="btn" type="warning" v-if="!editable&&isEdit&&formData.status == 3 || !editable&&!isEdit">
                提报
            </nf-button>
            <!--<nf-button @click="submit('formData')" class="btn" type="warning" v-if="!editable&&!isEdit">-->
            <!--提报-->
            <!--</nf-button>-->
        </page-title>
        <base-box id="baseNews">
            <content-wrap title="基本信息" type="big" class="base-border">
                <el-form
                        ref="formData"
                        class="create-form"
                        :model="formData"
                        :rules="rules"
                        label-width="90px">
                    <el-row class="create-form__row" type="flex" >
                        <el-col :xs="24" :sm="12" :md="12" :lg="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('designStyleNo')>-1}" class="create-form__item style-no-input" label="设计款号" :required="rules?(JSON.stringify(rules).indexOf('designStyleNo')!=-1):false" v-show="!designList||designList.designStyleNo" :error="designStyleNoError">
                                <el-input :disabled="autoNumberDesign||!handlePowerEdit('designStyleNo')"  @blur="checkDesignRepeat" :maxlength="20" v-model.trim="formData.designStyleNo"
                                          :placeholder="!autoNumberDesign?'请输入设计款号':'系统自动生成'" @change="designNoChange"></el-input>
                            </el-form-item>
                            <el-checkbox :disabled="!handlePowerEdit('designStyleNo')" v-show="!designList||designList.designStyleNo" v-if="isEdit && autoNumberDesign && designStyleNoPower" style="margin-top: 8px;margin-left: 8px;" v-model="formData.generateDesignStyleNo" @change="checkUpdateDesignStyle(formData.generateDesignStyleNo,1,3)">更新</el-checkbox>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('styleNo')>-1}" class="create-form__item style-no-input" label="商品款号" v-if="!designList || designList.styleNo" :required="rules?(JSON.stringify(rules).indexOf('styleNo')!=-1):false"  :error="styleNoError">
                                <el-input :disabled="autoNumberGood||!handlePowerEdit('styleNo')" @blur="checkGoodsRepeat" v-model.trim="formData.styleNo"
                                          :placeholder="!autoNumberGood?'请输入商品款号':'系统自动生成'" style="width:100%;" @change="styleNoChange"></el-input>
                            </el-form-item>
                            <el-checkbox :disabled="!handlePowerEdit('styleNo')" v-show="!designList || designList.styleNo" v-if="autoNumberGood && isEdit && updateStyleNoPower" style="margin-top: 8px;margin-left: 8px;" v-model="formData.generateStyleNo" @change="checkUpdateDesignStyle(formData.generateStyleNo,2,2)">更新</el-checkbox>
                            <el-checkbox :disabled="!handlePowerEdit('styleNo')" v-show="!designList || designList.styleNo" v-if="autoNumberGood && !isEdit && newStyleNoPower" style="margin-top: 8px;margin-left: 8px;" v-model="formData.generateStyleNo" @change="checkUpdateDesignStyle(formData.generateStyleNo,2,1)">生成</el-checkbox>
                        </el-col>
                        <!--<el-button style="height: 36px;margin-left:5px" @click="updateDesignStyle(2)" v-if="isEdit&&autoNumberGood&&!formData.generateStyleNo">更新商品款号</el-button>-->
                        <!--<el-button style="height: 36px;background: #ffa914;color: #fff;margin-left:5px" disabled v-if="formData.generateStyleNo">更新商品款号</el-button>-->
                        <el-col :xs="24" :sm="12" :md="12" :lg="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('styleName')>-1}" class="create-form__item" prop="styleName"   label="商品名称"  v-show="!designList||designList.styleName">
                                <el-input :disabled="!handlePowerEdit('styleName')" @blur="checkDesignRepeat" :maxlength="20" v-model.trim="formData.styleName"
                                          placeholder="请输入商品名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form
                            ref="upload"
                            class="create-form-upload"
                            :model="pic"
                            :rules="rules"
                    >
                        <el-row class="create-form__row" type="flex">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('design_picture')>-1}" prop="designPic" class="create-form__item" label="设计图" v-show="!designList ||designList&&designList.design_picture">
                                <input type="file" style="display: none;" id="file-upload1" :disabled="!handlePowerEdit('designStylePic')"
                                       accept="image/png,image/jpeg,image/jpg,image/gif" multiple @change="imgUpload">
                                <label class="upload-file" for="file-upload1" :class="{'disabled-btn':!handlePowerEdit('designStylePic')}">添加图片</label>
                                <span style="font-size: 12px;color: #A2ABB8">只能上传 jpg/png 文件，且不超过 5m</span>
                                <pic-list :isEdit="handlePowerEdit('designStylePic')" :style="{'border':checkCodeListData.indexOf('design_picture')>-1?'1px solid #ff9c38':'none','min-height':'50px'}" :fileList="pic.designPic"></pic-list>
                            </el-form-item>
                        </el-row>
                        <el-row class="create-form__row" type="flex">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('design_picture_inspiration')>-1}" prop="createPic" class="create-form__item" label="灵感图" v-show="!designList || designList&&designList.design_picture_inspiration">
                                <input type="file" style="display: none;" id="file-upload2" :disabled="!handlePowerEdit('lgt')"
                                       accept="image/png,image/jpeg,image/jpg,image/gif" multiple @change="imgUpload">
                                <label class="upload-file" for="file-upload2" :class="{'disabled-btn':!handlePowerEdit('lgt')}">添加图片</label>
                                <span style="font-size: 12px;color: #A2ABB8">只能上传 jpg/png 文件，且不超过 5m</span>
                                <pic-list :isEdit="handlePowerEdit('lgt')" :style="{'border':checkCodeListData.indexOf('design_picture_inspiration')>-1?'1px solid #ff9c38':'none','min-height':'50px'}" :fileList="pic.createPic"></pic-list>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <el-row class="create-form__row"  type="flex">
                        <el-form-item label="供应商" class="create-form__item"  prop='commonOutsideFactoryId' :class="{'checkCodeActive':checkCodeListData.indexOf('commonOutsideFactoryId')>-1}"  v-show="!designList||designList.commonOutsideFactoryId">
                            <machining-select v-if="handlePowerVisible('commonOutsideFactoryName')" :disabled="!handlePowerEdit('commonOutsideFactoryName')" :canAdd="true" v-model="formData.commonOutsideFactoryId"></machining-select>
                            <el-select v-else disabled placeholder="***"></el-select>
                        </el-form-item>
                        <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('plantArticleNumber')>-1}" class="create-form__item" prop='plantArticleNumber' label="厂家货号"  v-show="!designList||designList.plantArticleNumber">
                            <el-input @blur="checkDesignRepeat" v-model.trim="formData.plantArticleNumber" :disabled="!handlePowerEdit('plantArticleNumber')"
                                      placeholder="请输入厂家货号"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row class="create-form__row" type="flex">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('colors')>-1}" class="create-form__item" prop="colors" label="颜色" v-show="!designList||designList&&designList.colors">
                                <colorSelectGroup :disabled="!handlePowerEdit('colorName')" v-model="formData.colors" :groupData="colorList" @isAddAttr="getAddAttr"></colorSelectGroup>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('sizes')>-1}" class="create-form__item" prop='sizes' label="尺码" v-show="designList&&designList.sizes || !designList">
                                <size-select :disabled="!handlePowerEdit('sizeName')" :selectedSizes="formData.sizes" @sizeArr="sizeArrFn" ref="selectSize" :isGoodsAdd="true" @isAddAttr="getAddAttr"></size-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row class="create-form__row" type="flex">
                        <el-col :xs="24" :sm="12" :md="12" :lg="12">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('standards')>-1}" class="create-form__item" prop='standards' label="内长" v-show="!designList||designList&&designList.standards">
                                <el-select
                                        :disabled="!handlePowerEdit('standardName')"
                                        @remove-tag='delLengthFn'
                                        filterable
                                        multiple
                                        ref="length"
                                        v-model="formData.standards"
                                        placeholder="请选择内长">
                                    <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                        <div class="add-attr"
                                             @click="handleAddAttr('length','内长')">新建
                                        </div>
                                    </el-option>
                                    <el-option v-for="item in lengthList" :key="item.id" :label="item.name"
                                               :value="item.id">
                                        <div @click="deleteLengthSku({value:item.id})"
                                             style="position: absolute;left:0;right:0;top:0;padding:8px 10px;">
                                            <!-- {{item.value+'-'+item.name}} -->
                                            {{item.name}}
                                        </div>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-show="!designList ||designList&&designList.colors&&designList.sizes">
                        <div class="sku-table-wrap">
                            <sku-dynamically-table
                                    :fieldRoles="fieldRoles"
                                    ref="skuTable"
                                    :type="handleType"
                                    from="design"
                                    :styleNo="formData.styleNo"
                                    :autoNumberGood="autoNumberGood"
                                    :colorArr="formData.colors"
                                    :sizeArr="formData.sizes"
                                    :lengthArr="formData.standards"
                                    :titleAndSelect="skuTitleAndSelect"
                                    :editSkuTable="editSkuTable">
                            </sku-dynamically-table>
                        </div>
                    </el-row>
                </el-form>
            </content-wrap>
        </base-box>
        <base-box class="procedure" id="attribute">
            <content-wrap title="属性信息" type="big" class="base-border">
                <attr-dropdown
                        :facInfo="facInfo"
                        :fieldRoles="fieldRoles"
                        @sizeChangeByCategory="sizeChangeByCategory"
                        type="DESIGN_STYLE"
                        modelName="SPL_DESIGN_STYLE"
                        :designList="designList"
                        :toRules="rules"
                        ref="contentInfo"
                        :checkCodeListDataProp="checkCodeListData"
                        @attrData="getAttrData"
                        :attrSelect="attrSelect"
                        :attrNewSelect="attrNewSelect"
                        :categoryId="categoryId"
                        :categoryErrorText="categoryErrorText"
                        :designStyleId="designStyleId">
                </attr-dropdown>
            </content-wrap>
        </base-box>
        <!-- 描述信息 -->
        <base-box id="descriptive" class="procedure">
            <content-wrap title="描述信息" type="big" class="base-border">
                <el-form
                        ref="goodsInfo"
                        class="create-form"
                        :model="formData"
                        :rules="rules"
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
                    <el-row class="create-form__row" type="flex">
                        <el-form-item style="width: auto" class="create-form__item" label="商品描述" v-show="!designList||designList&&designList.content" prop="content" :class="{'ueCheckActive':checkCodeListData.indexOf('content')>-1}">
                            <div style="position: relative;">
                                <div class="ue-mask" v-if="!handlePowerEdit('goodsRemark')"></div>
                                <myUE :defaultMsg=defaultMsg :config=config ref="ue"></myUE>
                            </div>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('model')>-1}" class="create-form__item" prop="model" label="模式" v-show="!designList ||　designList&&designList.model">
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
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('dateListing')>-1}" class="create-form__item" prop="dateListing" label="上市时间" v-show="!designList ||　designList&&designList.dateListing">
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
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('internationalCode')>-1}" class="create-form__item" prop="internationalCode" label="国标码" v-show="!designList ||　designList&&designList.internationalCode">
                                <el-input
                                        v-if="handlePowerVisible('internationalCode')"
                                        :disabled="!handlePowerEdit('internationalCode')"
                                        v-model.trim="formData.internationalCode" placeholder="请输入" :maxlength="20">
                                </el-input>
                                <el-input v-else disabled placeholder="***"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('developerIds')>-1}" class="create-form__item" prop="developerIds" label="开发者" v-show="!designList ||　designList&&designList.developerIds">
                                <workerLeader  v-if="handlePowerVisible('developers')"
                                               :isDisabled="!handlePowerEdit('developers')"
                                               @groupChange="groupChange"
                                               @input="developerChange"
                                               :single="'single'"
                                               v-model="formData.developerIds[0]" placeholder="请选择"></workerLeader>
                                <el-select v-else disabled placeholder="***"></el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('developmentDepartment')>-1}" class="create-form__item" prop="developmentDepartment" label="开发部门" v-show="!designList ||　designList&&designList.developmentDepartment">
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
                <custom-field-from
                        :fieldRoles="fieldRoles"
                        ref="customFieldForm"
                        v-model="formData.customFields"
                        modelName="SPL_DESIGN_STYLE"
                       :toRules="rules"
                       :checkCodeListData="checkCodeListData"
                       :isEdit="isEdit"
                       :detailCustomFieldsList="detailCustomFieldsList">
                </custom-field-from>
            </content-wrap>
        </base-box>
        <!-- 价格信息 -->
        <base-box id="priceNews" class="procedure">
            <content-wrap title="价格信息" type="big" class="base-border">
                <el-form
                        ref="priceFormData"
                        class="price-table"
                        :model="priceFormData"
                        :rules="rules"
                        label-width="100px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('price')>-1}" label="销售价" prop="price" v-show="!designList ||　designList&&designList.price">
                                <el-input
                                        v-if="handlePowerVisible('price')"
                                        :disabled="!handlePowerEdit('price')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim="priceFormData.price" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('retailPrice')>-1}" class="create-form__item" prop="retailPrice" label="吊牌价" v-show="!designList ||　designList&&designList.retailPrice">
                                <el-input
                                        v-if="handlePowerVisible('retailPrice')"
                                        :disabled="!handlePowerEdit('retailPrice')"
                                        @blur="retailPriceSellPricePopChange"
                                        type="number"
                                        v-model.trim="priceFormData.retailPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('sellPrice')>-1}"
                                          class="create-form__item"
                                          prop="sellPrice"
                                          label="动销价"
                                          v-show="!designList ||　designList&&designList.sellPrice">
                                <el-input
                                        v-if="handlePowerVisible('sellPrice')"
                                        :disabled="!handlePowerEdit('sellPrice')"
                                        @blur="sellPriceChange"
                                        type="number"
                                        v-model.trim="priceFormData.sellPrice"
                                        :maxlength="10"
                                        placeholder="请输入"
                                        min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item
                                    :class="{'checkCodeActive':checkCodeListData.indexOf('sellPricePop')>-1}"
                                    class="create-form__item"
                                    prop="sellPricePop"
                                    label="动销价比"
                                    v-show="!designList ||　designList&&designList.sellPricePop">
                                <el-input
                                        v-if="handlePowerVisible('sellPricePop')"
                                        :disabled="!handlePowerEdit('sellPricePop')"
                                        @blur="retailPriceSellPricePopChange"
                                        v-model.trim="priceFormData.sellPricePop"
                                        placeholder="请输入"
                                        :maxlength="10">
                                </el-input>
                                <el-input v-else disabled placeholder="***"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item
                                    :class="{'checkCodeActive':checkCodeListData.indexOf('materialCost')>-1}"
                                    label="物料成本"
                                    prop="materialCost"
                                    v-show="!designList ||　designList&&designList.materialCost">
                                <el-input
                                        v-if="handlePowerVisible('materialCost')"
                                        :disabled="!handlePowerEdit('materialCost')"
                                        type="number"
                                        :maxlength="10"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim="priceFormData.materialCost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                    :class="{'checkCodeActive':checkCodeListData.indexOf('processingCost')>-1}"
                                    label="加工成本"
                                    prop="processingCost"
                                    v-show="!designList ||　designList&&designList.processingCost">
                                <el-input
                                        v-if="handlePowerVisible('processingCost')"
                                        :disabled="!handlePowerEdit('processingCost')"
                                        type="number"
                                        :maxlength="10"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim="priceFormData.processingCost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('cost')>-1}" label="计划成本价" prop="cost" v-show="!designList ||　designList&&designList.cost">
                                <el-input
                                        v-if="handlePowerVisible('cost')"
                                        :disabled="!handlePowerEdit('cost')"
                                        type="number"
                                        :maxlength="9"
                                        step="0.01"
                                        min="0"
                                        placeholder="请输入"
                                        v-model.trim="priceFormData.cost" >
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('firstSupplyPrice')>-1}" class="create-form__item" prop="firstSupplyPrice" label="最初供货价" v-show="!designList ||　designList&&designList.firstSupplyPrice">
                                <el-input
                                        v-if="handlePowerVisible('firstSupplyPrice')"
                                        :disabled="!handlePowerEdit('firstSupplyPrice')"
                                        type="number"
                                        v-model.trim="priceFormData.firstSupplyPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('accountingPrice')>-1}" class="create-form__item" prop="accountingPrice" label="我司核价" v-show="!designList ||　designList&&designList.accountingPrice">
                                <el-input
                                        v-if="handlePowerVisible('accountingPrice')"
                                        :disabled="!handlePowerEdit('accountingPrice')"
                                        type="number"
                                        v-model.trim="priceFormData.accountingPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        min="0">
                                    <template slot="prepend">¥</template>
                                </el-input>
                                <el-input v-else disabled placeholder="***"><template slot="prepend">¥</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item :class="{'checkCodeActive':checkCodeListData.indexOf('lastSupplyPrice')>-1}" class="create-form__item" prop="lastSupplyPrice" label="最终供货价" v-show="!designList ||　designList&&designList.lastSupplyPrice">
                                <el-input
                                        v-if="handlePowerVisible('lastSupplyPrice')"
                                        :disabled="!handlePowerEdit('lastSupplyPrice')"
                                        type="number"
                                        v-model.trim="priceFormData.lastSupplyPrice"
                                        :maxlength="20"
                                        placeholder="请输入"
                                        min="0">
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
        <base-box class="procedure" id="attachment">
            <content-wrap title="附件" type="big">
                <upload-form :fieldRoles="fieldRoles" :checkCodeListDataProp="checkCodeListData" ref="uploadFormRef" :tableData="formData.attachmentLists" :fileList="formData.attachments" @getFileList="getFileList" @getAttachments="getAttachments" :designList="designList"  :toRules="rules"></upload-form>
            </content-wrap>
        </base-box>
        <!--各种属性新建弹窗-->
        <attribute-dialog :title="title" :show.sync="visible.dialogAdd" @success="getUnitSetting" :type="attrType"></attribute-dialog>

        <!-- 提报的弹窗 -->
        <select-design-dialog :show.sync="selectDesignDialog" @save="addFile" :loading.sync="visible.saveBtnLoading" :formData="formData.process"></select-design-dialog>

        <!--配置可编辑字段提示弹窗-->
        <el-dialog class="custom-dialog tip-dialog is-submit-dialog" :visible.sync="designFieldVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny" :modal-append-to-body="false">
            <div class="text-center">
                <icon w="56" h="56" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">有未填写的必填信息，无法提报！请完善设计档案。</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="designFieldVisible = false">好 的</el-button>
            </div>
        </el-dialog>
        <!--更新商品弹窗-->
        <el-dialog title='更新商品' class="custom-dialog dailogUpdateGoods" :visible.sync="dailogUpdateGoods" :show-close="false"
                   :close-on-click-modal="false" size="tiny" :modal-append-to-body="false">
            <div class="text-center" style="height: 100px;line-height: 100px;">
                <p class="tip-text">是否将设计档案更新到商品档案中？</p>
            </div>
            <div slot="footer" class="dialog-footer" style="text-align: right">
                <el-button @click="dailogUpdateGoods = false;visible.btnLoading=false">取消</el-button>
                <el-button  @click="isUpdateGoods(false)">不更新</el-button>
                <el-button type="warning" @click="isUpdateGoods(true)" >更新</el-button>
            </div>
        </el-dialog>

        <!--提示弹窗-->
        <warn-dialog
                :visible.sync="warnVisible"
                :message="warnMessage"
                type="2"
                @confirm="warnDialogCancel">
        </warn-dialog>
        <!--生成商品弹窗-->
        <general-goods v-if="updateGoods" @updateNode="updateNode" :dialogVisible.sync="updateGoods" :missionPrcd="designPrcdNodeId"></general-goods>

        <!--&lt;!&ndash; 商品款号的勾选弹窗 &ndash;&gt;-->
        <!--<el-dialog class="custom-dialog tip-dialog" :visible.sync="updateDialoVisible" :before-close="handleClose" :modal-append-to-body="false"-->
        <!--size="tiny" :close-on-click-modal="false">-->
        <!--<div class="text-center">-->
        <!--<icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>-->
        <!--<p class="remark">是否更新设计款号和商品款号！</p>-->
        <!--</div>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="updateDialoVisibleGo('cancel')">不更新</el-button>-->
        <!--<el-button  type="primary" @click="updateDialoVisibleGo('sure')">更新</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
    </section>
</template>

<script>
    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";
    import picList from './pic-list'
    import {formatDate} from '@/utils';
    import Ue from "../../ue/ue";
    import {
        designstyleIsRefrancedSkuId,
        designstyleUpdate,
        designstyleEditAndDetail,
        designstyleFormUser,
        getFacUnitSettings,
        addFacUnitSettings,
        getUploadToken,
        upDetailImgs,
        queryGoodStyleNoRepeat,
        queryDesignStyleNoRepeat,
        designstyleCreate,
        isExistGenerateStyleNoList,
        updateMissionPreview,
        isExistGenerateStyleNo,
        getUnitUser,
        outsideFactoryListForSelect,
        commonStyleSkuAttrAll,
        getGoodsRole,
        getEasyGroups,
    } from "@/api";
    import {
        getNodeDesignDialogFields,
        checkOnForward,
        createDesignstyleCheckOnForward
    } from '@/api/sample-centre';

    import sizeSelect from '../../../components/Common/size-select'
    import attributeDialog from '../../../components/Common/attributeDialog'
    import selectDesignDialog from './selectDesignDialog'
    import categorySelect from '@/components/Common/category-select-group.vue'; // 品类
    import GeneralGoods from "@/components/designWorkbench/general-goods/index";
    import attrDropdown from '@/components/Common/attr-dropdown.vue'; // 属性下拉
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    import {mapState} from 'vuex';
    import myUE from './myUE'
    import skuDynamicallyTable from '@/components/order/createChild/skuDynamicallyTable'; // sku动态表格
    import warnDialog from '@/components/Common/dialog/warnDialog'; //提示弹窗
    import CustomFieldFrom from '@/components/Common/customFieldFrom.vue';

    import { log } from 'util';
    const fun  = require('@/components/Common/commonFun.js')

    export default {
        computed: {
            ...mapState({
                editFormData: (state) => state.DesignMission.formData
            }),
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            editable() {
                this.show = true
                return this.$route.query.editable;
            },
            isEdit() {
                // return this.$route.query.designStyleId
                return this.designStyleId
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            isWorkBench() {
                // 是否在设计工作台页面
                return this.$route.path == '/designWorkbench'
            },
            isFromWorkBench() {
                // 是否从设计工作台页面跳转
                return this.$route.query.isWorkBench == 1
            },
            handleType(){
                if(this.isEdit){
                    return 'edit'
                }else{
                    return 'add'
                }
            },
        },
        props: ['from','goodsStatus','designPrcdNodeId','designStyleId', 'show', 'isEdit','designList','checkDetailLists','checkDesignDetailList','checkCodeListData','nodeId'],

        /***********
         *
         * isEdit: false表示新建，true表示编辑
         * checkCodeListData 是检查必填项的点击的值
         * nodeId 判断是否在设计工作台选择了设计档案节点
         *
         * ***********/

        data() {
            return {
                facInfo: {},
                editParams:{},
                updateGoods:false,
                dailogUpdateGoods:false,
                checkIsChangeFlag:false,
                need_check:[],//存储需要检测的code值
                updateDialoVisible:false,
                addcheckDetail:[],//点击保存的时候添加检测项
                getFacCommonSettings:true, //十个属性新建按钮权限
                designStyleNoPower:true, //更新设计款号权限
                newStyleNoPower:true, //生成商品款号权限
                updateStyleNoPower:true, //更新商品款号权限
                autoNumberDesign:false,   //设计款号是否有自动编号
                autoNumberGood:false,
                checkSku: {   //检查已有的值能否删除
                    color: [],
                    length: [],
                    sizes: []
                },
                designStyleNo: '', //编辑时需要先记录原本的设计款号 相同时则不需要查重
                styleNo: '', //编辑时需要先记录原本的货品款号 相同时则不需要查重
                attrSelect: {
                    designer: '',
                    wave: '',
                    kind: '',
                    season: '',
                    year: '',
                    tag: '',
                    brand: '',
                    style: '',
                    month: ''
                },
                attrNewSelect: {
                    field1s:'',
                    field2s:'',
                    field3s:'',
                    field4s:'',
                    field5s:'',
                    field6s:'',
                    field7s:'',
                    field8s:'',
                },
                categoryId: [],
                chargersList: [], //设计负责人
                title: '', //新建弹窗的标题
                colorName: '', //新建颜色名称
                attrName: '', //新建属性弹窗输入框的值
                attrValue: '', //新建属性弹窗输入框的值
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
                pic: {
                    pic: [], //图片
                    designPic: [], //设计手稿
                    createPic: [], //创意图
                },
                defaultMsg: "",
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 164,
                    zIndex: 99
                },
                formData: {
                    styleNo: '',
                    designStyleNo: '',
                    styleName: '',
                    content: '',
                    generateStyleNo: false,
                    generateDesignStyleNo: false,
                    chargers: [],
                    inspectors: [],
                    attrs: [],
                    colors: [],
                    sizes: [],
                    standards: [],
                    pictures: [],
                    commonOutsideFactoryId: '',
                    plantArticleNumber: '',
                    model: '',
                    dateListing: '',
                    internationalCode: '',
                    developmentDepartmentId: '', // 开发部门id
                    developmentDepartment: '',
                    // firstSupplyPrice: '',
                    // lastSupplyPrice: '',
                    // accountingPrice: '',
                    // retailPrice: '',
                    developerIds: [],
                    attachmentLists: [],
                    attachments: [],
                    customFields:[],
                    // sellPrice: null, //动销价
                    // sellPricePop: null, //动销价比
                },
                process: {
                    templateId: '',
                    leaderIds: []
                },
                rules: {
                    designStyleNo: [
                        {required: true , message: '请输入设计款号', trigger: 'blur'},
                        // {validator: this.validByLength, trigger: 'blur'}
                    ],
                    plantArticleNumber:[
                        {required: false , message: '请输入changjjiahv', trigger: 'blur'},
                    ],
                    // styleName:[
                    //     {required:true, message: '请输入商品名称', trigger: 'blur'}
                    //     // {required: true, message: '请输入商品名称', trigger: 'blur'},
                    // ],
                    // finishDate: [
                    //     {required: true, message: '请选择预完成日期'},
                    //     {validator: this.validDate, trigger: 'change'}
                    // ],
                    // remark: [
                    //     {validator: this.validRemark, trigger: 'blur'}
                    // ]
                },
                visible: {
                    cancelVisible: false,
                    dialogAdd: false,
                    btnLoading: false,
                    addLoading: false,
                    saveBtnLoading: false
                },
                isDesignRepeat: false,
                isGoodsRepeat: false,
                flag: true,
                selectDesignDialog:false,
                selectDialoVisible:false,
                options: {
                    templateOptions: [], // 工序模板
                    groupOptions: []
                },
                options1: {
                    groupOptions: [] // 开发者
                },
                designFieldVisible: false,  //配置可编辑字段提示弹窗
                patternList: [
                    {value: 0, label: '联营'},
                    {value: 1, label: '买断'},
                    {value: 2, label: '包销'}
                ],
                attrType: null, // 自定义属性type
                customList: [], // 自定义属性tag
                outsideFactoryList: [], //供应商
                developerIds: [], //开发者
                priceFormData: {
                    price: '',  // 销售价
                    cost: '',   // 计划成本价
                },
                warnVisible: false,
                warnMessage: '',
                reportRules:{},//配置提报必填过来的规则
                designRules:{},//设计款号过来的规则
                goodRules:{},//商品款号过来的规则
                designStyleNoError: '', // 设计款号的必填提示
                styleNoError: '', // 商品款号的必填提示
                categoryErrorText: '', // 品类必填提示
                skuTitleAndSelect: {},      //sku表格表头和下拉数据
                detailCustomFieldsList:[],  //设计档案详情的自定义字段部分的数据
                fieldRoles: [],
                groups:[],
                groupId: '',
            };
        },
        components: {
            GeneralGoods,
            Ue,
            picList,
            sizeSelect,
            myUE,
            attributeDialog,
            selectDesignDialog,
            categorySelect,
            uploadForm,
            attrDropdown,
            skuDynamicallyTable,
            warnDialog,
            CustomFieldFrom
        },
        async created() {
            if(!this.checkCodeListData){
                this.checkCodeListData = []
            }
            this.getAllGroup();
            this.getTitleAndSelect();
            this.getGoodsRole();
            let typeIsArr = ['colors','sizes','standards','createPic','designPic','categoryId','developerIds'];

            if (this.checkDetailLists && this.checkDetailLists.length) {
                this.checkDetailLists.forEach(v =>{
                    v.code = this.setCode(v.code)
                    if(!this.reportRules.hasOwnProperty(v.code)){
                        this.reportRules[v.code] =
                            {
                                required:true,
                                message: "请输入"+v.attrName,
                                trigger: 'blur',
                            }
                        if(typeIsArr.indexOf(v.code)>-1 || v.fieldType === 'MULTI_SELECT'){
                            this.reportRules[v.code].type ='array'
                        }
                    }
                });
            }
            // 设计款号必填
            if (this.checkDesignDetailList) {
                if (this.checkDesignDetailList.designCodeAndName&&this.checkDesignDetailList.designCodeAndName.length) {
                    // 设计款号自定义规则
                    this.checkDesignDetailList.designCodeAndName.forEach(v =>{
                        v.code = this.setCode(v.code)
                        if(!this.designRules.hasOwnProperty(v.code)){
                            this.designRules[v.code] =
                                {
                                    required:true,
                                    message: "请输入"+v.attrName,
                                    trigger: 'blur',
                                }
                            if(typeIsArr.indexOf(v.code)>-1){
                                this.designRules[v.code].type ='array'
                            }
                        }
                    });
                }
                if (this.checkDesignDetailList.productCodeAndName&&this.checkDesignDetailList.productCodeAndName.length) {
                    // 商品款号自定义规则
                    this.checkDesignDetailList.productCodeAndName.forEach(v =>{
                        v.code = this.setCode(v.code)
                        if(!this.goodRules.hasOwnProperty(v.code)){
                            this.goodRules[v.code] =
                                {
                                    required:true,
                                    message: "请输入"+v.attrName,
                                    trigger: 'blur',
                                }
                            if(typeIsArr.indexOf(v.code)>-1){
                                this.goodRules[v.code].type ='array'
                            }
                        }
                    });
                }
            }
            // 综合必填项
            this.rules = {...this.reportRules,...this.designRules, ...this.goodRules};//把配置提报时必填额选项给到rules里面
            console.log(this.rules,'this.rules');
            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            if((this.isWorkBench&&this.nodeId) || this.isFromWorkBench) {
                // 生成商品款号权限
                if (powerlist.indexOf('fac.spl.design.mission.workspace.styleNo.addpreview') == -1) {
                    this.newStyleNoPower = false
                }
                //更新商品款号
                if (powerlist.indexOf('fac.spl.design.mission.workspace.styleNo.editpreview') == -1) {
                    this.updateStyleNoPower = false
                }
                //更新设计款号
                if (powerlist.indexOf('fac.spl.design.mission.workspace.designStyleNo.editpreview') == -1) {
                    this.designStyleNoPower = false
                }
            }else {
                // 生成商品款号权限
                if (powerlist.indexOf('fac.spl.design.style.styleNo.addpreview') == -1) {
                    this.newStyleNoPower = false
                }
                //更新商品款号
                if (powerlist.indexOf('fac.spl.design.style.styleNo.editpreview') == -1) {
                    this.updateStyleNoPower = false
                }
                //更新设计款号
                if (powerlist.indexOf('fac.spl.design.style.designStyleNo.editpreview') == -1) {
                    this.designStyleNoPower = false
                }
            }
            if (this.editable) {
                // 从设计工单页跳转
                if(this.$route.query.editable) this.show = true
                console.log(this.show)
                this.setDetail()
            }
            if (this.isEdit) {
                // 从设计档案详情跳转
                await this.getDetail()
            }
            await this.fetchUnitUser()
            this.getUnitSetting()
            this.getUserList()
            this.isExistGenerateStyleNoList()
        },
        watch: {
            'formData.generateStyleNo': {
                handler(newValue, oldValue) {
                    // this.permissionList.fi
                },
                deep: true
            }
        },
        methods: {
            //“吊牌价”或“动销价比”修改：动销价 = 吊牌价*动销价比； sellPricePop
            retailPriceSellPricePopChange(){
                let data = this.priceFormData;
                if(data.retailPrice > 0 && data.sellPricePop > 0){
                    data.sellPrice = (data.retailPrice * data.sellPricePop).toFixed(2)
                }
            },
            //动销价修改：动销价比 = 动销价/吊牌价；
            sellPriceChange(){
                let data = this.priceFormData;
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
                getGoodsRole({userId:this.userId,unitId:this.facId,type:'designStyle'}).then(res => {
                    this.fieldRoles = res.data.data
                    if(!this.handlePowerEdit('goodsRemark')){
                        this.$nextTick(() => {
                            this.$refs['ue'].setDisabled()
                        })
                    }
                })
            },
            sizeChangeByCategory(val){
                this.formData.sizes = val

            },
            //sku自定义属性表头和下拉
            getTitleAndSelect(){
                let params = {
                    unitId: this.facId
                };
                commonStyleSkuAttrAll(params).then(res => {
                    if(res.data.code === 0){
                        this.skuTitleAndSelect = res.data.data;
                    }
                });
            },
            goPosition(code){
                // baseNews基本信息  procedure属性信息 descriptive描述信息 priceNews价格信息 attachment附件
                let baseNews = ["designStyleNo", "styleNo", "styleName", "design_picture", "design_picture_inspiration", "commonOutsideFactoryId", "plantArticleNumber", "colors", "sizes", "standards", "factoryColorNo", "factoryColorName" ]
                let attribute = ["brands", "categorySmall", "designers", "years", "months", "seasons", "kinds", "tags", "styles", "bands", "field1", "field2", "field3", "field4", "field5", "field7", "field6", "field8" ];
                let descriptive = ["content", "model", "dateListing", "internationalCode", "developmentDepartment", "developerIds", "firstSupplyPrice", "accountingPrice", "retailPrice" ];
                let priceNews = ["price", "cost"];
                let attachment = [ "attachmentLists1", "attachmentLists2", "attachmentLists3", "attachmentLists4", "attachmentLists5", "attachments" ];
                let positionData = [baseNews,attribute,descriptive,priceNews,attachment];
                let positionIds = ['baseNews','attribute','descriptive','priceNews','attachment'];
                if(code.indexOf('customField_')>-1){
                    document.getElementById('createDesignFileBox').scrollTop=document.getElementById('customFieldForm').offsetTop
                    return
                }
                positionData.forEach((item,index)=>{
                    if(item.indexOf(code)>-1){

                        document.getElementById('createDesignFileBox').scrollTop=document.getElementById(positionIds[index]).offsetTop
                    }
                })
            },
            checkIsChange(){
                //验证数据是否改变 工作台的切换用到
                // 因为数据太多太杂目前先每次切换都不做校验都弹窗
                return true
            },
            // 设计、商品款号change
            designNoChange(val) {
                if (val) {
                    this.designStyleNoError = ''
                }
            },
            styleNoChange(val) {
                if (val) {
                    this.styleNoError = ''
                }
            },
            // 自定义规则设置
            setCode(code) {
                if(code =="designers"){code ="designer"}
                if(code =="seasons"){code ="season"}
                if(code =="kinds"){code ="kind"}
                if(code =="styles"){code ="style"}
                if(code =="tags"){code ="tag"}
                if(code =="years"){code ="year"}
                if(code =="months"){code ="month"}
                if(code =="bands"){code ="wave"}
                if(code =="brands"){code ="brand"}
                if(code =='design_picture'){code ='designPic'}
                if(code =='design_picture_inspiration'){code ='createPic'}
                let file = ['field1','field2','field3','field4','field5','field6','field7','field8']
                file.forEach(i => {
                    if (i == code) {
                        code = i + 's'
                    }
                })
                if(code.indexOf('category')>-1 || code.indexOf('categorySmall')>-1){code ='categoryId'}
                return code
            },
             // 颜色和尺码新建的时候触发
            getAddAttr() {
                this.$refs['skuTable'].getFacCommonSettingsSku()
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
            // 关闭提示弹窗
            warnDialogCancel(){
                this.warnVisible = false;
            },
            //获取尺码
            sizeArrFn(val) {
                this.formData.sizes = val;
            },
            //新建时隐藏下拉列表
            handleAddAttr(refName, title, attrType){
                this.visible.dialogAdd = true;
                this.title = title;
                if(attrType){
                    this.attrType = attrType;
                    this.$refs[refName][0].handleClose();
                }else {
                    this.$refs[refName].handleClose();
                }
            },
            // 供应商
            changeSupplierId(val) {
                this.formData.commonOutsideFactoryId = val.id
            },
            // 开发者
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyword
                }).then(res => {
                    this.options1.groupOptions = res.data.data.facGroupDTOS;
                });
            },
            //提报检测必填
            checkForwardNeed() {
                // //新建设计档案检测必填
                const params = {
                    unitId: this.facId,
                    ...this.formData,
                    ...this.priceFormData,
                    SkuList: this.getSkuList()
                };
                createDesignstyleCheckOnForward(params).then(res => {
                    if (res.data.code == 0) {
                        this.selectDesignDialog = true
                    }else{
                        this.designFieldVisible = true;
                        console.log(this.designFieldVisible)
                    }
                })
            },
            //检查获取 是否设置为自动编号
            isExistGenerateStyleNoList(){
                isExistGenerateStyleNoList({userId:this.userId}).then(res=>{
                    console.log(res);
                    res.data.data.forEach(item=>{
                        if(item.modelType===1){
                            console.log(item);
                            this.autoNumberDesign = item.userDefinedRule
                        }
                        if(item.modelType===2){
                            this.autoNumberGood = item.userDefinedRule
                        }
                    })
                })
            },
            // 属性必填信息验证
            getAttrCheck(type) {
                // type // 区分是提报的还是保存的
                let submitFlag, submitFlag1,submitFlag2
                this.$refs['contentInfo'].$refs['cateInfo'].validate((valid) => {
                    if (valid) {
                        submitFlag =true;
                    } else {
                        submitFlag = false;
                        return false;
                    }
                });
                this.$refs['contentInfo'].$refs['attrNewSelect'].validate((valid) => {
                    if (valid) {
                        submitFlag1 = true;
                    } else {
                        submitFlag1 = false;
                        return false;
                    }
                });
                // this.$refs['contentInfo'].$refs['categoryId'].validate((valid) => {
                //     if (valid) {
                //         submitFlag2 = true;
                //     } else {
                //         submitFlag2 = false;
                //         return false;
                //     }
                // });
                //
                console.log(this.categoryId,this.categoryId.length, 'this.categoryId&&this.categoryId.length');
                let list = []
                if (this.categoryId.length) {
                    this.categoryId.forEach((i => {
                        if(i) {
                            list.push(i)
                        }
                    }))
                }
                if(this.rules.hasOwnProperty('categoryId')){
                    if (this.categoryId && list.length === 3 && list[2]) {
                        submitFlag2 = true
                        this.categoryErrorText = ''
                    } else {
                        submitFlag2 = false;
                        // this.categoryErrorText = type == 0 ? '请输入品类' : '品类必须要选到细小分类'
                        this.categoryErrorText = type == 0 ? '请输入品类' : '品类必须要选到细小分类'

                    }
                }else {
                    submitFlag2 = true
                    this.categoryErrorText = ''
                }

                console.log(submitFlag2, 'submitFlag2 ');
                if (submitFlag&&submitFlag1&&submitFlag2) {
                    return true
                }
                return false
            },
            // 提交
            submit(formdata) {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.submit")){
                    return
                }
                let flag = true;
                this.$refs['uploadFormRef'].defaultTable.forEach(item=>{
                    if(item.isShow){
                        flag = false
                        this.$message.error('请先保存附件栏的资料')
                    }
                });
                if(!flag) return;
                let submitFlag,submitFlag1,submitFlag2,submitFlag3,submitFlag4,submitFlag5;
                if(this.formData.generateStyleNo) {
                    this.rules = {...this.reportRules,...this.designRules,...this.goodRules}
                } else {
                    this.rules = {...this.reportRules,...this.designRules};
                }
                if (this.rules.hasOwnProperty('designStyleNo')) {
                    !this.autoNumberDesign&&this.formData.designStyleNo == '' ?  this.designStyleNoError = '设计款号不能为空' : ''
                }
                if (this.rules.hasOwnProperty('styleNo')) {
                    !this.autoNumberGood&&this.formData.styleNo == '' ?  this.styleNoError = '商品款号不能为空' : ''
                }

                console.log(this.rules,'8768');
                if (Object.keys(this.rules).length === 0) {
                    this.$nextTick(function () {
                        this.addFile('checkForwardNeed')
                    })
                    return
                }
                this.$nextTick(function () {
                    this.$refs['formData'].validate((valid) => {
                        if (valid) {
                            submitFlag = true;
                        } else {
                            submitFlag = false;
                            return false;
                        }
                    });
                    this.$refs['goodsInfo'].validate((valid) => {
                        if (valid) {
                            submitFlag1 = true;
                        } else {
                            submitFlag1 = false;
                            return false;
                        }
                    });
                    this.$refs['priceFormData'].validate((valid) => {
                        if (valid) {
                            submitFlag2 = true;
                        } else {
                            submitFlag2 = false;
                            return false;
                        }
                    });
                    this.$refs['upload'].validate((valid) => {
                        if (valid) {
                            submitFlag3 = true;
                        } else {
                            submitFlag3 = false
                            return false;
                        }
                    });

                    submitFlag4 = this.getAttrCheck()

                    this.$refs['customFieldForm'].$refs['customFieldForm'].validate((valid) => {
                        if (valid) {
                            submitFlag5 = true;
                        } else {
                            submitFlag5 = false;
                            return false;
                        }
                    });
                    if (submitFlag && submitFlag1 && submitFlag2 && submitFlag3 && submitFlag4&& submitFlag5) {
                        this.addFile('checkForwardNeed');
                    }
                })
            },
            // 移除表单的验证
            clearValidate(form) {
                form.forEach(i => {
                    this.$refs[i].clearValidate();
                })
            },
            // 判断是否可勾选
            isCheck () {
                if (this.formData.generateStyleNo) {
                    return this.formData.generateStyleNo = false
                }
                let params = {
                    userId: this.userId
                }
                isExistGenerateStyleNo(params).then(res => {
                    if(res.data.data) {
                        this.formData.generateStyleNo = true
                    } else {
                        this.selectDialoVisible = true
                        this.formData.generateStyleNo = false
                    }
                })
            },
            selectClose () {
                this.selectDesignDialog = false
            },
            // 取消
            cancel (){
                if (this.editable) return this.$router.back()
                this.$emit('update:show', false)
            },
            //删除颜色进行验证
            deleteColorSku(v) {
                if (this.isEdit) {
                    if (this.formData.colors.some(item => (item == v.value)) && this.checkSku.color.some(item => (item.id == v.value))) {
                        this.delColorFn(v)
                    }
                }
            },
            //删除颜色接口
            delColorFn(v) {
                if (this.isEdit && this.checkSku.color.some(item => (item.id == v.value))) {
                    designstyleIsRefrancedSkuId({designStyleId: this.designStyleId, id: v.value}).then(res => {
                        console.log(res);
                        if (res.data.code == 1) {
                            this.formData.colors.push(v.value);
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            },
            //删除内长进行验证
            deleteLengthSku(v) {
                if (this.isEdit) {
                    if (this.formData.standards.some(item => (item == v.value)) && this.checkSku.length.some(item => (item.id == v.value))) {
                        this.delLengthFn(v)
                    }

                }
            },
            //删除内长接口
            delLengthFn(v) {
                if (this.isEdit && this.checkSku.length.some(item => (item.id == v.value))) {
                    designstyleIsRefrancedSkuId({designStyleId: this.designStyleId, id: v.value}).then(res => {
                        console.log(res);
                        if (res.data.code == 1) {
                            this.formData.standards.push(v.value);
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            },
            //设计工单进入新建设计档案需要读取本次添加过的值
            setDetail() {
                this.formData = this.editFormData
                this.defaultMsg = this.formData.content || '';
                if (this.formData.chargers) {
                    this.formData.chargers = this.formData.chargers.map(v => {
                        return v.userId
                    }) || []
                }
                if (this.formData.sizes) {
                    this.formData.sizes = this.formData.sizes.map(v => ({id: v})) || []
                }
                if (this.formData.inspectors) {
                    this.formData.inspectors = this.formData.inspectors.map(v => {
                        return v.userId
                    }) || []
                }
                if (this.formData.pictures) {
                    this.formData.pictures.forEach(v => {
                        if (v.type == 1) {
                            this.pic.designPic.push(v.path)
                        } else if (v.type == 2) {
                            this.pic.createPic.push(v.path)
                        } else if (v.type == 0) {
                            this.pic.pic.push(v.path)
                        }
                    })
                }
                if (this.formData.attrs) {
                    this.formData.attrs.forEach(v => {
                        if (v.type == 8) {
                            // this.attrSelect.brand.push(v.attrId)
                            this.attrSelect.brand = v.attrId
                        } else if (v.type == 7) {
                            // this.attrSelect.tag.push(v.attrId)
                            this.attrSelect.tag = v.attrId
                        } else if (v.type == 6) {
                            // this.attrSelect.year.push(v.attrId)
                            this.attrSelect.year = v.attrId
                        } else if (v.type == 5) {
                            // this.attrSelect.season.push(v.attrId)
                            this.attrSelect.season = v.attrId
                        } else if (v.type == 4) {
                            // this.attrSelect.kind.push(v.attrId)
                            this.attrSelect.kind = v.attrId
                        } else if (v.type == 3) {
                            // this.attrSelect.wave.push(v.attrId)
                            this.attrSelect.wave = v.attrId
                        } else if (v.type == 2) {
                            // this.attrSelect.designer.push(v.attrId)
                            this.attrSelect.designer = v.attrId
                        } else if (v.type == 9) {
                            // this.attrSelect.style.push(v.attrId)
                            this.attrSelect.style = v.attrId
                        } else if (v.type == 10) {
                            // this.attrSelect.month.push(v.attrId)
                            this.attrSelect.month = v.attrId
                        }
                    })
                }
            },

            //编辑设计档案获取详情
            getDetail() {
                designstyleEditAndDetail({
                    userId:this.userId,
                    prcdNodeId: this.$route.query.prcdNodeId,
                    id: this.designStyleId
                }).then(res => {
                    for(let k in res.data.data){
                        this.formData[k] = res.data.data[k]
                    }
                    for(let k in res.data.data){
                        if(['lastSupplyPrice','accountingPrice','firstSupplyPrice','cost','processingCost','materialCost','sellPricePop','sellPrice','retailPrice','price'].indexOf(k)>-1) {
                            this.priceFormData[k] = res.data.data[k]
                        }
                    }
                    // this.formData = res.data.data
                    this.checkSku.color = res.data.data.colors
                    this.checkSku.length = res.data.data.standards
                    this.formData.outSideFactory = {
                        id: res.data.data.commonOutsideFactoryId,
                        name: res.data.data.commonOutsideFactoryName
                    }
                    this.formData.commonOutsideFactoryId = res.data.data.commonOutsideFactoryId

                    this.defaultMsg = this.formData.content || ''

                    //编辑时先记录款号 1
                    this.designStyleNo = res.data.data.designStyleNo
                    this.styleNo = this.formData.styleNo
                    //添加两个空数组  提交时需要的参数
                    this.formData.attrs = []
                    this.formData.pictures = []
                    // 单选
                    this.attrSelect.brand = this.formData.brands.length > 0 ? this.formData.brands[0].id : ''
                    this.attrSelect.designer = this.formData.designers.length > 0 ? this.formData.designers[0].id : ''
                    this.attrSelect.kind = this.formData.kinds.length > 0 ? this.formData.kinds[0].id : ''
                    this.attrSelect.tag = this.formData.tags.length > 0 ? this.formData.tags[0].id : ''
                    this.attrSelect.year = this.formData.years.length > 0 ? this.formData.years[0].id : ''
                    this.attrSelect.season = this.formData.seasons.length > 0 ? this.formData.seasons[0].id : ''
                    this.attrSelect.wave = this.formData.bands.length > 0 ? this.formData.bands[0].id : ''
                    this.attrSelect.style = this.formData.styles.length > 0 ? this.formData.styles[0].id : ''
                    this.attrSelect.month = this.formData.months.length > 0 ? this.formData.months[0].id : ''

                    this.attrNewSelect.field1s = this.formData.field1s.length > 0 ? this.formData.field1s[0].id : '' // 14
                    this.attrNewSelect.field2s = this.formData.field2s.length > 0 ? this.formData.field2s[0].id : '' // 15
                    this.attrNewSelect.field3s = this.formData.field3s.length > 0 ? this.formData.field3s[0].id : ''
                    this.attrNewSelect.field4s = this.formData.field4s.length > 0 ? this.formData.field4s[0].id : ''
                    this.attrNewSelect.field5s = this.formData.field5s.length > 0 ? this.formData.field5s[0].id : ''
                    this.attrNewSelect.field6s = this.formData.field6s.length > 0 ? this.formData.field6s[0].id : ''
                    this.attrNewSelect.field7s = this.formData.field7s.length > 0 ? this.formData.field7s[0].id : ''
                    this.attrNewSelect.field8s = this.formData.field8s.length > 0 ? this.formData.field8s[0].id : ''

                    // this.attrSelect.categoryId = this.formData.categoryInfo ? this.formData.categoryInfo.thirdId : '' //13
                    this.categoryId = this.formData.categoryInfo.firstId ? [this.formData.categoryInfo.firstId,this.formData.categoryInfo.secondId,this.formData.categoryInfo.thirdId] : []

                    this.formData.chargers = this.formData.chargers.length > 0 ? this.formData.chargers.map(v => {
                        return v.id
                    }) : []
                    this.formData.inspectors = this.formData.inspectors.length > 0 ? this.formData.inspectors.map(v => {
                        return v.id
                    }) : []
                    this.pic.designPic = this.formData.designManuscripts.length > 0 ? this.formData.designManuscripts.map(v => {
                        return v.path
                    }) : []
                    this.pic.createPic = this.formData.creativeDrawings.length > 0 ? this.formData.creativeDrawings.map(v => {
                        return v.path
                    }) : []
                    this.pic.pic = this.formData.goodsPictures.length > 0 ? this.formData.goodsPictures.map(v => {
                        return v.path
                    }) : []
                    this.formData.colors = this.formData.colors.length > 0 ? this.formData.colors.map(v => {
                        return v.id
                    }) : []
                    this.formData.sizes = this.formData.sizes.length > 0 ? this.formData.sizes.map(v => {
                        return v.id
                    }) : []
                    this.formData.standards = this.formData.standards.length > 0 ? this.formData.standards.map(v => {
                        return v.id
                    }) : []
                    console.log(this.formData,'this.formData');
                    // 开发者
                    if (this.formData.developers.length > 0) {
                        this.formData.developers.map(v => {
                            this.developerIds.push(v.id)
                            this.formData.developerIds[0] = v.id;
                        })
                    }
                    // this.priceFormData = {
                    //     price: this.formData.price ? this.formData.price : '', // 吊牌价
                    //     cost: this.formData.cost ? this.formData.cost : ''  // 计划成本价
                    // };
                    // 处理数据，防止编辑的时候验证数据
                    // this.formData.model = this.formData.model ? this.formData.model : ''
                    this.priceFormData.firstSupplyPrice = this.priceFormData.firstSupplyPrice ? this.priceFormData.firstSupplyPrice : ''
                    this.priceFormData.lastSupplyPrice = this.priceFormData.lastSupplyPrice ? this.priceFormData.lastSupplyPrice : ''
                    this.priceFormData.accountingPrice = this.priceFormData.accountingPrice ? this.priceFormData.accountingPrice : ''
                    this.priceFormData.retailPrice = this.priceFormData.retailPrice ? this.priceFormData.retailPrice : ''
                    this.priceFormData.sellPrice = this.priceFormData.sellPrice ? this.priceFormData.sellPrice : ''
                    this.priceFormData.sellPricePop = this.priceFormData.sellPricePop ? this.priceFormData.sellPricePop : ''
                    this.priceFormData.materialCost = this.priceFormData.materialCost ? this.priceFormData.materialCost : ''
                    this.priceFormData.processingCost = this.priceFormData.processingCost ? this.priceFormData.processingCost : ''
                    if(this.formData.skuBarcodes.length){
                        this.formData.skuBarcodes.forEach((item) => {
                            item.skuIdStr = item.colorId + '_' + item.sizeId + '_' + item.standardId;
                            item.sizeTypeCategory = item.sizeTypeCategory ? item.sizeTypeCategory : '-'
                        });
                        console.log(this.formData.skuBarcodes);
                        this.editSkuTable = JSON.parse(JSON.stringify(this.formData.skuBarcodes));
                    }
                    // 组装自定义字段需要的数据
                    this.detailCustomFieldsList = []
                    if(res.data.data.customFieldList.length){
                        let data = res.data.data.customFieldList
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
            },
            //设计款号查重
            async checkDesignRepeat() {
                if (this.formData.designStyleNo == '') {
                    this.isDesignRepeat = false
                    return
                }
                if (this.designStyleNo == this.formData.designStyleNo) {
                    this.isDesignRepeat = false
                    return
                }
                let params = {
                    designStyleNo: this.formData.designStyleNo,
                    userId: this.userId
                }
                await queryDesignStyleNoRepeat(params).then(res => {
                    if (res.data.code == 1) {
                        this.isDesignRepeat = true
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                        // return true
                    } else {
                        this.isDesignRepeat = false
                        // return false
                    }
                })
            },
            //商品款号查重
            async checkGoodsRepeat() {
                if (this.formData.styleNo == '') {
                    this.isGoodsRepeat = false
                    return
                }
                if (this.styleNo == this.formData.styleNo) {
                    this.isGoodsRepeat = false
                    return
                }
                let params = {
                    goodStyleNo: this.formData.styleNo,
                    userId: this.userId
                }
                await queryGoodStyleNoRepeat(params).then(res => {
                    if (res.data.code == 1) {
                        this.isGoodsRepeat = true
                        this.$message({
                            message: '不能关联已有商品款号',
                            type: 'error'
                        });
                    } else {
                        this.isGoodsRepeat = false
                    }
                })
            },
            // 时间处理
            timeChage(val) {
                this.formData.dateListing = val?fun.dateFormatter(val,false):'';
            },
            // 获取上传列表
            getFileList(v) {
                this.formData.attachmentLists = v
            },
            getAttachments(v) {
                this.formData.attachments = v
            },
            getAttrData(attrSelect,attrNewSelect,categoryId) {
                this.attrSelect = attrSelect
                this.attrNewSelect = attrNewSelect
                this.categoryId = categoryId
            },
            //确定新建/编辑
            async addFile(type, process) {
                let flag = true;
                this.$refs['uploadFormRef'].defaultTable.forEach(item=>{
                    if(item.isShow){
                        flag = false
                        this.$message.error('请先保存附件栏的资料')
                    }
                });
                if(!flag) return;
                await this.checkDesignRepeat()
                await this.checkGoodsRepeat()
                let reg = /^\d+(\.\d+)?$/
                let rule = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if(this.priceFormData.firstSupplyPrice&&!reg.test(this.priceFormData.firstSupplyPrice)) return this.$message.error('最初供货价不能小于0')
                if(this.priceFormData.lastSupplyPrice&&!reg.test(this.priceFormData.lastSupplyPrice)) return this.$message.error('最终供货价不能小于0')
                if(this.priceFormData.accountingPrice&&!reg.test(this.priceFormData.accountingPrice)) return this.$message.error('我司核价不能小于0')
                if(this.priceFormData.retailPrice&&!reg.test(this.priceFormData.retailPrice)) return this.$message.error('吊牌价不能小于0')
                if(this.priceFormData.price&&!reg.test(this.priceFormData.price)) return this.$message.error('销售价不能小于0')
                if(this.priceFormData.cost&&!reg.test(this.priceFormData.cost)) return this.$message.error('计划成本价不能小于0')
                if(this.priceFormData.materialCost&&!rule.test(this.priceFormData.materialCost)) return this.$message.error('物料成本不能小于0且最多两位小数')
                if(this.priceFormData.processingCost&&!rule.test(this.priceFormData.processingCost)) return this.$message.error('加工成本不能小于0且最多两位小数')
                if(this.priceFormData.sellPrice&&!rule.test(this.priceFormData.sellPrice)) return this.$message.error('动销价不能小于0且最多两位小数')
                if(this.priceFormData.sellPricePop&&!rule.test(this.priceFormData.sellPricePop)) return this.$message.error('动销价比不能小于0且最多两位小数')
                if (this.isGoodsRepeat) {
                    this.$message({
                        message: '不能关联已有商品款号',
                        type: 'error'
                    })
                    return
                }
                if (this.isDesignRepeat) {
                    this.$message({
                        message: '设计款号重复',
                        type: 'error'
                    })
                    return
                }
                // 设计款号和商品款号自动编号规则,保存的时候判断
                if (this.checkDesignDetailList) {
                    if(this.formData.generateStyleNo) {
                        this.rules = {...this.designRules,...this.goodRules}
                    } else {
                        this.rules = this.designRules
                    }
                    this.$nextTick(function () {
                        let designFlag = this.getAttrCheck(type)
                        if (!designFlag) return
                    })
                }

                if (!this.autoNumberDesign && this.formData.designStyleNo == '') {
                    this.$message({
                        message: '设计款号不能为空',
                        type: 'error'
                    })
                    return
                }
                if (type == '1' && process.templateId == '') {
                    this.$message({
                        message: '工序模板不能为空',
                        type: 'error'
                    })
                    return
                }
                if (type == '1' && process.leaderIds.length == 0) {
                    this.$message({
                        message: '负责人不能为空',
                        type: 'error'
                    })
                    return
                }
                if (this.checkSkuEmpty()) {
                    this.$message.error((this.formData.colors.length ? '尺码' : '颜色') + '不能为空')
                    return
                }
                if(type === 0){
                    this.visible.btnLoading = true
                }else if(type !== 'checkForwardNeed'){
                    this.visible.saveBtnLoading = true
                }
                this.formData.content = this.$refs.ue.getUEContent()
                this.formData.unitId = this.facId
                this.formData.userId = this.userId
                // this.formData.developerIds = this.developerIds || []
                this.formData.categoryIds = this.categoryId
                if (this.formData.chargers&&!this.formData.chargers.length) {
                    //没有选设计负责人就默认当前用户
                    this.formData.chargers.push(this.userId)
                }
                if (this.formData.standards.length == 0) {
                    this.formData.standards = ['36fec3286377458bb445d0a287cd8e0e'] //没有选内长的时候默认加上'无'的ID
                }
                if (this.$route.query.prcdNodeId) {
                    // 节点详情过来需要传节点id
                    this.formData.prcdNodeId = this.$route.query.prcdNodeId;
                }
                let chargerArr = [],
                    inspectorsArr = [],
                    attrCount = 2,
                    attrNewCount = 14, // 5个自定义属性
                    count = 22, // 6，7,8自定义属性
                    picCount = 0
                if (this.formData.chargers) {
                    this.formData.chargers.forEach(v => {
                        chargerArr.push({userId: v})
                    })
                }

                this.formData.chargers = chargerArr
                if (this.formData.inspectors) {
                    this.formData.inspectors.forEach(v => {
                        inspectorsArr.push({userId: v})
                    })
                }
                this.formData.inspectors = inspectorsArr
                this.formData.attrs = []
                this.formData.pictures = []
                for (let k in this.attrSelect) {
                    if (this.attrSelect[k] != '') {
                        this.formData.attrs.push({type: attrCount, attrId: this.attrSelect[k]})
                    }
                    attrCount++;
                }
                for (let k in this.attrNewSelect) {
                    if (this.attrNewSelect[k] != '') {
                        if (k != 'field6s'&&k != 'field7s'&&k != 'field8s') {
                            this.formData.attrs.push({type: attrNewCount, attrId: this.attrNewSelect[k]})
                        } else {
                            this.formData.attrs.push({type: count, attrId: this.attrNewSelect[k]})
                        }

                    }
                    attrNewCount++;
                    count++;
                }
                for (let k in this.pic) {
                    this.pic[k].forEach(v => {
                        this.formData.pictures.push({type: picCount, path: v})
                    })
                    picCount++;
                }
                if (this.editable) {
                    // 设计工单页面过来不触发
                    this.$store.dispatch('setFormData', this.formData);
                    this.$nextTick(() => {
                        this.$router.back();
                    });
                    return;
                }
                if(type === 'checkForwardNeed'){
                    this.checkForwardNeed();
                    return
                }
                //获取开发部门名称
                this.getdevelopmentName();
                 flag = false;
                //编辑设计档案
                if (this.isEdit) {
                    if (this.formData.designStyleNo != this.designStyleNo) {
                        this.formData.userDefinedVersion = 0
                    }
                    this.formData.id = this.designStyleId
                    this.formData.process = process ? process : this.process
                    this.formData.type = type;
                    let skuList =await this.getSkuList();
                    let editParams = {
                        ...this.formData,
                        ...this.priceFormData,
                        SkuList: skuList,
                    };
                    let flagUpdateGoods=false;
                    if(this.from==='designWorkbench' && this.goodsStatus){
                        //来自工作台并且已经生成商品了
                        //勾选弹窗已选字段
                        const params = {
                            prcdNodeId: this.designPrcdNodeId,
                            type: 2
                        };
                     await   getNodeDesignDialogFields(params).then(res => {
                            if (res.data.code == 0) {
                                //有配置更新商品提示
                                flagUpdateGoods = res.data.data.some(item =>item.fieldId=='00')
                            }
                        })

                    }
                    this.editParams = editParams
                    if(flagUpdateGoods) {
                        this.dailogUpdateGoods = true

                        return
                    }
                   await this.goodsDesignstyleUpdate().then(res=>{
                       flag = res
                    });
                    return flag
                }
                // 新建设计档案
                else {
                    //将sku表格数据和价格信息放在一个对象里面
                    let designData = {
                        ...this.formData,
                        ...this.priceFormData,
                        styleSkuDetails: this.$refs.skuTable.skuTableData
                    };
                    let params = {
                        designStyle: designData,
                        process: process ? process : this.process,
                        type: type,
                    };
                    await  designstyleCreate(params).then(res => {
                        type == 0 ? this.visible.btnLoading = false : this.visible.saveBtnLoading = false
                        if (res.data.code == 0) {
                            flag = res.data.data
                            this.$message.success(res.data.msg);
                            this.$emit('success');
                            this.$emit('update:show', false);
                            this.selectDesignDialog = false
                        }
                        //条形码重复
                        else if(res.data.code === 5){
                            this.warnMessage = res.data.msg;
                            this.warnVisible = true;
                        } else {
                            this.rules = this.designRules;
                            this.$refs['formData'].validate((valid) => {
                                if (valid) {
                                } else {
                                    this.$message.error(res.data.msg);
                                    return false;
                                }
                            });
                            this.$refs['contentInfo'].$refs['cateInfo'].validate((valid) => {
                                if (valid) {
                                } else {
                                    this.$message.error(res.data.msg);
                                    return false;
                                }
                            });
                            this.$message.error(res.data.msg);
                        }

                    })
                    return flag
                }
            },
            goodsDesignstyleUpdate(){
                return new Promise((resolve,reject)=>{
                     designstyleUpdate(this.editParams).then(res => {
                        this.visible.btnLoading = false;
                        this.visible.saveBtnLoading = false
                        if (res.data.code == 0) {
                            resolve(true);
                            this.$message.success(res.data.msg);
                            this.$emit('success')
                            this.$emit('update:show', false)
                        }
                        //条形码重复
                        else if(res.data.code === 5){
                            this.warnMessage = res.data.msg;
                            this.warnVisible = true;
                        }
                        else {
                            resolve(false);
                            this.$message.error(res.data.msg || '编辑失败')
                        }

                    });
                })
            },
            isUpdateGoods(flag){
                if(!flag){
                    //不更新
                    this.goodsDesignstyleUpdate()
                }else {
                    //更新
                    // this.updateGoods = true;
                    this.$emit('updateGoodsGo')
                }
            },
            //更新设计款号
            checkUpdateDesignStyle(val,type,permission){
                // if(permission==1&&!this.powerJudgement.permissions("fac.spl.design.style.styleNo.addpreview")){
                //     //生成商品款号
                //     this.formData.generateStyleNo = !val
                //     return
                // }
                // if(permission==2&&!this.powerJudgement.permissions("fac.spl.design.style.styleNo.editpreview")){
                //     //更新商品款号
                //     this.formData.generateStyleNo = !val
                //     return
                // }
                // if(permission==3&&!this.powerJudgement.permissions("fac.spl.design.style.designStyleNo.editpreview")){
                //     //更新设计款号
                //     this.formData.generateDesignStyleNo = !val
                //     return
                // }
                // type 1为设计款号 2是商品款号
                console.log(type);
                console.log(this.formData.generateStyleNo);
                if(val){
                    this.updateDesignStyle(type)
                }else {
                    if(type==2){
                        this.formData.styleNo = this.styleNo
                    }else {
                        this.formData.designStyleNo = this.designStyleNo
                    }
                    this.$message.success('更新成功')
                }

            },
            updateDesignStyle(type){
                let attrCount = 2;
                let attrCountPinLei = 11;
                let newAttrCount = 14;
                this.formData.attrs = [];
                let dataSelArr = {...this.attrSelect};
                console.log(dataSelArr);
                console.log(this.categoryId);
                // this.categoryId = this.formData.categoryInfo.firstId ? [this.formData.categoryInfo.firstId,this.formData.categoryInfo.secondId,this.formData.categoryInfo.thirdId] : []

                for (let k in dataSelArr) {
                    if (dataSelArr[k] != '') {
                        this.formData.attrs.push({type: attrCount, attrId: dataSelArr[k]})
                    }

                    attrCount++;
                }
                for (let k in this.categoryId) {
                    if (this.categoryId[k] != '') {
                        this.formData.attrs.push({type: attrCountPinLei, attrId: this.categoryId[k]})
                    }

                    attrCountPinLei++;
                }
                for (let k in this.attrNewSelect) {
                    if (this.attrNewSelect[k] != '') {
                        this.formData.attrs.push({type: newAttrCount, attrId: this.attrNewSelect[k]})
                    }

                    newAttrCount++;
                }
                let params = {
                    userId:this.userId,
                    attrs: this.formData.attrs,
                    modelType: type
                }
                updateMissionPreview(params).then(res=>{
                    if(res.data.code===0){
                        if(type===1){
                            // this.formData.generateDesignStyleNo = true
                            this.formData.designStyleNo = res.data.data
                        }
                        if(type===2){
                            // this.formData.generateStyleNo = true
                            this.formData.styleNo = res.data.data
                        }
                        this.$message.success('更新成功')
                    }else {
                        if(type===1){
                            this.formData.generateDesignStyleNo = false

                        }
                        if(type===2){
                            this.formData.generateStyleNo = false
                        }
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleClose(){
                this.updateDialoVisible = false
                this.visible.btnLoading = false;
                this.visible.saveBtnLoading = false
            },
            updateDialoVisibleGo(status){
                if(status==='sure'){
                    //更新
                    this.formData.generateStyleNo = true
                }else {
                    this.formData.generateStyleNo = false
                }
                this.editDesignstyleUpdate();
                this.updateDialoVisible = false
            },
            //编辑设计档案
            editDesignstyleUpdate(){
                let skuList = this.getSkuList();
                let editParams = {
                    ...this.formData,
                    ...this.priceFormData,
                    SkuList: skuList,
                };
                designstyleUpdate(editParams).then(res => {
                    this.visible.btnLoading = false;
                    this.visible.saveBtnLoading = false
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('success')
                        this.$emit('update:show', false)
                    }
                    //条形码重复
                    else if(res.data.code === 5){
                        this.warnMessage = res.data.msg;
                        this.warnVisible = true;
                    }
                    else {
                        this.$message.error(res.data.msg || '编辑失败')
                    }
                })
            },
            checkSkuEmpty() {
                if (this.$refs.selectSize.getSizeIdArr().length && !this.formData.colors.length) {
                    return true
                }
                if (!this.$refs.selectSize.getSizeIdArr().length && this.formData.colors.length) {
                    return true
                }
                if (!this.formData.standards.every(item => (item == '36fec3286377458bb445d0a287cd8e0e')) &&
                    (!this.formData.colors.length || !this.$refs.selectSize.getSizeIdArr().length)) {
                    return true
                }
            },
            //获取设计人和设计总监下拉列表
            getUserList() {
                let params = {
                    unitId: this.facId,
                    userId: this.userId
                }
                designstyleFormUser(params).then(res => {
                    console.log(res.data, '设计人下拉');
                    this.chargersList = res.data.data
                })
            },
            //获取属性下拉框列表
            getUnitSetting(id,firstParent,twoParent) {
                let params = {
                    facId: this.facId,
                    type: 'all',
                    designStyleId: this.designStyleId,
                    userId: this.userId,
                    modelName: 'SPL_DESIGN_STYLE',
                };
                getFacUnitSettings(params).then(res => {
                    this.facInfo = res.data.data
                    //编辑设计档案，颜色下拉取接口数据，新建设计档案颜色下拉为空
                    if(this.isEdit){
                        this.colorList = res.data.data.color;
                    }else{
                        this.colorList = []
                    }
                    this.lengthList = res.data.data.length
                    if (id) {
                        if (this.title == '内长' && this.formData.standards.length < 12) {
                            this.formData.standards.push(id)
                        }
                    }
                })
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
                        });
                        return false;
                    }
                    await getUploadToken(params).then(res => {
                        // this.img_name.token = res.data.uptoken;
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            const _imgUrl =
                                this.$globalConfig.qiniu.baseUrl + result.data.key;
                            if (e.target.id == 'file-upload1') {
                                this.pic.designPic.push(_imgUrl);
                            } else if (e.target.id == 'file-upload2') {
                                this.pic.createPic.push(_imgUrl)
                            } else {
                                this.pic.pic.push(_imgUrl)
                            }
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
        }
    }
</script>

<style lang="scss">
    .create-design-file {
        .create-form {
            .el-date-editor {
                width: 100%
            }
            .el-select {
                width: 100%
            }
            &-upload{
                padding: 0px 27px;
                .create-form__row:last-child {
                    .create-form__item{
                        margin-bottom: 20px !important;
                    }
                }
            }
        }
        .el-dialog {
            // width: 30% !important;
        }
        .el-select .el-input__inner{
            padding-right:10px !important;
        }
    }
    .checkCodeActive{
        /*#ff9c38*/
        .el-form-item__label{
            color: #ff9c38;
        }
        .el-input__inner{
            border: 1px solid #ff9c38;
            border-color:#ff9c38 !important;
        }
    }
    .ueCheckActive{
        .el-form-item__label{
            color: #ff9c38;
        }
        .el-form-item__content{
            border: 1px solid #ff9c38;
        }
    }
    .add-attr {
        color: #ff9c38 !important;
        cursor: pointer;
    }
    .v-modal{
        z-index: 2000;
    }
.dailogUpdateGoods{
    background: rgba(0,0,0,.5);
}
</style>

<style lang="scss" scoped>
    .width {
        border-left: 1px solid #ccc;
        position: fixed;
        top: 0;
        right: 0;
        width: 1200px !important;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 2000;
    }

    .create-design-file{
        background-color: #fff;
        .base-border{
            border-bottom: 1px solid #E6EAF0;
        }
        .page_title{
            padding: 24px 32px;
            border-bottom: 1px solid #E6EAF0;
        }

        .save-btn {
            background-color: #fff;
            color:#ff9c38;
            border-color:#ff9c38;
            &:hover{
                color:#eb8f34;
                border-color:#eb8f34;
            }
        }

        .btn-add {
            background: #1CA1FF;
            color: #fff;
            font-size: 12px !important;
            width: 64px;
            height: 28px;
            padding: 0;
            &:hover {
                background: #1CA1FF;
            }
        }

        .btn--cancel {
            width: 72px;
            margin-top: 12px;
            font-size: 12px !important;
            background: #fff;
            color: #FA4150
        }

        .create-form__row {
            margin-left: -20px;
            .create-form__item {
                width: 100%;
                margin-bottom: 20px;
            }
            &:last-child .create-form__item {
                margin-bottom: 0
            }
            .create-form__edit-btn {
                text-decoration: underline;
                color: #1CA1FF;
            }
            .style-no-input{
                display: inline-block;
                width: calc(100% - 65px);
            }
        }
        .sku-table-wrap{
            margin-left: 70px;
        }
        .procedure {
            &__label {
                padding-right: 12px;
                &::before {
                    content: '*';
                    color: #FA4150
                }
            }
            &-form__item {
                margin-right: 56px;
            }
            &-list {
                margin-top: 12px;
            }
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
            &.disabled-btn{
                cursor: not-allowed;
                background: #ccc;
            }
        }

        .dialog-content-wrap {
            text-align: center;
            .delete-tip {
                font-size: 16px;
            }
            p {
                line-height: 26px;
            }
        }
        .base_box{
            padding:24px 32px 0;
        }
        .content_wrap--content{
            padding:16px 0 0 !important;
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
