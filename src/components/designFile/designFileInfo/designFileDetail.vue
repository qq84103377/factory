<template>
    <div v-loading="loading">
        <section class="design-file-detail design-files">
            <base-box>
                <content-wrap style="position: relative;" class="content-wrap" title="基本信息">
                    <div style="position: absolute;right: 0;top: 0;">
                        <print-template-btn name="" type="designStyle" :id="$route.query.designStyleId"></print-template-btn>
                        <nf-button svg="icon-edit1" @click="detailEdit" style="width: 64px;height: 32px;padding: 0;">编辑</nf-button>
                        <nf-button svg="icon-edit1" @click="submit" style="width: 64px;height: 32px;padding: 0;" v-show="formData.status == 3">提报</nf-button>
                    </div>

                    <!-- $router.push(`/designFile/createDesignFile?designStyleId=${$route.query.designStyleId}`) -->
                    <div class="stauts-img" v-show="formData.status == 3"><img :src="statusImg" alt=""></div>
                    <div class="stauts-img" v-show="formData.status == 1"><img :src="eliminateImg" alt=""></div>
                    <el-form
                            ref="baseInfo"
                            class="detail-form"
                            :model="formData"
                            label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="设计款号:">
                                    <span :class="{'is-nodata':!formData.designStyleNo}">{{formData.designStyleNo?formData.designStyleNo:"无"}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="商品款号:">
                                    <span :class="{'is-nodata':!formData.styleNo}">{{formData.styleNo?formData.styleNo:"无"}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="商品名称:">
                                    <span :class="{'is-nodata':!formData.styleName}">{{formData.styleName?formData.styleName:"无"}}</span>
                                </el-form-item>
                            </el-col>
                            <!-- <el-form-item class="detail-form__item" label="设计师:">
                                <span v-for="(item,index) in formData.chargers">{{(index==0?'':'/')+item.name}}</span>
                            </el-form-item> -->
                            <!-- <el-form-item class="detail-form__item" label="设计总监:">
                                <span v-for="(item,index) in formData.inspectors">{{(index==0?'':'/')+item.name}}</span>
                            </el-form-item> -->
                        </el-row>
                        <el-row>
                            <el-form-item style="width: auto;" class="detail-form__item" label="设计图:">
                                <pic-list :isEdit="false" :fileList="getPicList('designManuscripts')" v-if="getPicList('designManuscripts').length>0" ></pic-list>
                                <span class="is-nodata" v-else>无</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-form-item style="width: auto;" class="detail-form__item" label="创意图:">
                                <pic-list :isEdit="false" :fileList="getPicList('creativeDrawings')" v-if="getPicList('creativeDrawings').length>0" ></pic-list>
                                <span class="is-nodata" v-else>无</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="供应商:">
                                    <span v-if="handlePowerVisible('commonOutsideFactoryName')" :class="{'is-nodata':!formData.commonOutsideFactoryName}">{{formData.commonOutsideFactoryName||"无"}}</span>
                                    <span v-else>***</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="厂家货号:">
                                    <span :class="{'is-nodata':!formData.plantArticleNumber}">{{formData.plantArticleNumber?formData.plantArticleNumber:"无"}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="版师:">
                                    <span v-for="(item,index) in formData.machinists" :key="index" >{{item.name}}{{index < formData.machinists.length-1? '、': ''}} </span>
                                    <span class="is-nodata" v-if="!formData.machinists || formData.machinists.length==0" >无</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="样衣师:">
                                    <span v-for="(item,index) in formData.sampleDesigners" :key="index">{{item.name}}{{index < formData.sampleDesigners.length-1? '、': ''}}</span>
                                    <span class="is-nodata" v-if="!formData.sampleDesigners || formData.sampleDesigners.length==0">无</span>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="颜色:">
                                    <span v-for="(item,index) in formData.colors" :key="index">{{item.value}}-{{item.name}}{{index < formData.colors.length-1? '、': ''}}</span>
                                    <span class="is-nodata" v-if="!formData.colors || formData.colors.length==0">无</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="尺码:">
                                    <span v-for="(item,index) in formData.sizes" :key="index">{{item.name}}{{index < formData.sizes.length-1?'、':''}}</span>
                                    <span class="is-nodata" v-if="!formData.sizes || formData.sizes.length==0">无</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="内长:">
                                    <span v-for="(item,index) in formData.standards" :key="index">{{item.name}}{{index < formData.standards.length-1?'、':''}}</span>
                                    <span class="is-nodata" v-if="!formData.standards || formData.standards.length==0">无</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <sku-dynamically-table
                                        type="see"
                                        from="design"
                                        :fieldRoles="fieldRoles"
                                        :titleAndSelect="skuTitleAndSelect"
                                        :editSkuTable="formData.skuBarcodes">
                                </sku-dynamically-table>
                            </el-col>
                        </el-row>
                    </el-form>
                </content-wrap>
                <content-wrap class="content-wrap" title="属性信息">
                    <el-form
                            ref="cateInfo"
                            class="detail-form"
                            :model="formData"
                            label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="品牌:">
                                    <div v-if="handlePowerVisible('brand')">
                                        <span v-for="(item,index) in formData.brands" :key="index">{{item.name}}{{index < formData.brands.length-1 ? '、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.brands || formData.brands.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="品类:">
                                    <div v-if="handlePowerVisible('categoryInfo')">
                                        <span >{{formData.categoryInfo&&formData.categoryInfo.name}}</span>
                                        <span class="is-nodata" v-if="formData.categoryInfo&&!formData.categoryInfo.name">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="风格:">
                                    <div v-if="handlePowerVisible('style')">
                                        <span v-for="(item,index) in formData.styles" :key="index">{{item.name}}{{index < formData.styles.length-1 ?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.styles || formData.styles.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="设计师:">
                                    <div v-if="handlePowerVisible('designer')">
                                        <span v-for="(item,index) in formData.designers" :key="index">{{item.name}}{{index < formData.designers.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.designers || formData.designers.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row >
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="年份:">
                                    <div v-if="handlePowerVisible('year')">
                                        <span v-for="(item,index) in formData.years" :key="index">{{item.name}}{{index < formData.years.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.years || formData.years.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="季节:">
                                    <div v-if="handlePowerVisible('season')">
                                        <span v-for="(item,index) in formData.seasons" :key="index">{{item.name}}{{index < formData.seasons.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.seasons || formData.seasons.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="波段:">
                                    <div v-if="handlePowerVisible('wave')">
                                        <span v-for="(item,index) in formData.bands" :key="index">{{item.name}}{{index < formData.bands.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.bands || formData.bands.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="月份:">
                                    <div v-if="handlePowerVisible('month')">
                                        <span v-for="(item,index) in formData.months" :key="index">{{item.name}}{{index < formData.months.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.months || formData.months.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="分类:">
                                    <div v-if="handlePowerVisible('kind')">
                                        <span v-for="(item,index) in formData.kinds" :key="index">{{item.name}}{{index < formData.kinds.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.kinds || formData.kinds.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item class="detail-form__item" label="标签:">
                                    <div v-if="handlePowerVisible('tag')">
                                             <span v-for="(item,index) in formData.tags" :key="index">{{item.name}}{{index < formData.tags.length-1?'、':''}}</span>
                                             <span class="is-nodata" v-if="!formData.tags || formData.tags.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" v-for="(item,index) in customList" :key="index">
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 14">
                                    <div v-if="handlePowerVisible('field1s')">
                                        <span v-for="(item,index) in formData.field1s" :key="index">{{item.name}}{{index < formData.field1s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field1s || formData.field1s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 15">
                                    <div v-if="handlePowerVisible('field2s')">
                                        <span v-for="(item,index) in formData.field2s" :key="index">{{item.name}}{{index < formData.field2s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field2s || formData.field2s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 16">
                                    <div v-if="handlePowerVisible('field3s')">
                                        <span v-for="(item,index) in formData.field3s" :key="index">{{item.name}}{{index < formData.field3s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field3s || formData.field3s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 17">
                                    <div v-if="handlePowerVisible('field4s')">
                                        <span v-for="(item,index) in formData.field4s" :key="index">{{item.name}}{{index < formData.field4s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field4s || formData.field4s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 18">
                                    <div v-if="handlePowerVisible('field5s')">
                                        <span v-for="(item,index) in formData.field5s" :key="index">{{item.name}}{{index < formData.field5s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field5s || formData.field5s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 27">
                                    <div v-if="handlePowerVisible('field6s')">
                                        <span v-for="(item,index) in formData.field6s" :key="index">{{item.name}}{{index < formData.field6s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field6s || formData.field6s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 28">
                                    <div v-if="handlePowerVisible('field7s')">
                                        <span v-for="(item,index) in formData.field7s" :key="index">{{item.name}}{{index < formData.field7s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field7s || formData.field7s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                                <el-form-item class="detail-form__item" :label="`${item.name}:`" v-if="item.type == 29">
                                    <div v-if="handlePowerVisible('field8s')">
                                        <span v-for="(item,index) in formData.field8s" :key="index">{{item.name}}{{index < formData.field8s.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.field8s || formData.field8s.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </content-wrap>
                <content-wrap class="content-wrap" title="描述信息">
                    <el-form
                            ref="goodsInfo"
                            class="detail-form"
                            :model="formData"
                            label-width="100px">
                        <el-row type="flex">
                            <el-form-item style="width: auto;" class="detail-form__item" label="商品描述:">
                                <div v-if="formData.content" class="design-content" style="border: 1px solid #E6EAF0;padding: 10px;line-height: normal;font-size: 12px;color: #3B3B3B" v-html="formData.content"></div>
                                <span class="is-nodata" v-else>无</span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="模式:">
                                    <div v-if="handlePowerVisible('model')">
                                        <span v-if="modelMap[formData.model]">{{modelMap[formData.model]}}</span>
                                        <span class="is-nodata" v-else>无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="上市日期:">
                                    <div v-if="handlePowerVisible('dateListing')">
                                        <span v-if="formData.dateListing">{{formData.dateListing&&formData.dateListing.split(' ')[0]}}</span>
                                        <span class="is-nodata" v-else>无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="国标码:">
                                    <div v-if="handlePowerVisible('internationalCode')">
                                        <span v-if="formData.internationalCode">{{formData.internationalCode}}</span>
                                        <span class="is-nodata" v-else>无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="开发者:">
                                    <div v-if="handlePowerVisible('developers')">
                                        <span v-for="(item,index) in formData.developers" :key="index">{{item.name}}{{index < formData.developers.length-1?'、':''}}</span>
                                        <span class="is-nodata" v-if="!formData.developers || formData.developers.length==0">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="开发部门:">
                                    <div v-if="handlePowerVisible('developmentDepartment')">
                                        <span v-if="formData.developmentDepartment">{{formData.developmentDepartment}}</span>
                                        <span class="is-nodata" v-else>无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!--自定义字段-->
                    <el-form class="detail-form bd-bottom" label-width="100px">
                        <el-row style="margin-top:12px;">
                            <el-col :span="6" v-for="(item,index) in formData.customFieldList" :key="index">
                                <el-form-item class="mgb0" :label="item.customFieldName">
                                    <div v-if="handlePowerVisible('customField_'+item.customFieldId)">
                                        <div :class="{'gray':item.selectedOptions$&&!item.selectedOptions.length}" v-if="['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)">
                                            <span style="color: #2c2c2c" v-if="item.selectedOptions&&item.selectedOptions.length>0">
                                                {{item.selectedOptions.map(item =>item.optionName).join('、')}}</span>
                                            <span  v-else>无</span>
                                        </div>
                                        <div v-else-if="item.customFieldType ==='TEXT'">
                                            <div :title="item.textValue" class="ellipsis_1" style="color:#2c2c2c;max-width: 180px;"
                                                 v-if="item.textValue&&item.textValue.length>0">
                                                {{item.textValue}}
                                            </div>
                                            <span v-else>无</span>
                                        </div>
                                        <div v-else>
                                            <span style="color: #2c2c2c" v-if="item.numberValue&&item.numberValue!=0">
                                                {{item.numberValue}}
                                            </span>
                                            <span v-else>无</span>
                                        </div>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </content-wrap>
                <!--价格信息-->
                <content-wrap class="content-wrap" title="价格信息">
                    <el-form class="detail-form"
                             :model="formData"
                             label-width="100px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="销售价:" class="mgb0">
                                    <div v-if="handlePowerVisible('price')">
                                        <span v-if="formData.price">¥</span>
                                        <span style="color:#2c2c2c;" v-if="formData.price" >{{formData.price}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="吊牌价:">
                                    <div v-if="handlePowerVisible('retailPrice')">
                                        <span v-if="formData.retailPrice">¥</span>
                                        <span v-if="formData.retailPrice">{{formData.retailPrice}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="动销价:">
                                    <div v-if="handlePowerVisible('sellPrice')">
                                        <span v-if="formData.sellPrice">¥</span>
                                        <span v-if="formData.sellPrice">{{formData.sellPrice}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="动销价比:">
                                    <div v-if="handlePowerVisible('sellPricePop')">
                                        <span v-if="formData.sellPricePop">{{formData.sellPricePop}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物料成本:" class="mgb0">
                                    <div v-if="handlePowerVisible('materialCost')">
                                        <span v-if="formData.materialCost">¥</span>
                                        <span style="color:#2c2c2c;" v-if="formData.materialCost" >{{formData.materialCost}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="加工成本:" class="mgb0">
                                    <div v-if="handlePowerVisible('processingCost')">
                                        <span v-if="formData.processingCost">¥</span>
                                        <span style="color:#2c2c2c;" v-if="formData.processingCost" >{{formData.processingCost}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划成本价:" class="mgb0">
                                    <div v-if="handlePowerVisible('cost')">
                                        <span v-if="formData.cost">¥</span>
                                        <span style="color:#2c2c2c;" v-if="formData.cost" >{{formData.cost}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label-width="115px" label="加价倍率/成本率">
                                    <div v-if="handlePowerVisible('cost')">
                                        <span>{{formData.pop}}</span>
                                    </div>
                                    <div v-else>
                                        <span>***</span>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="最初供货价:">
                                    <div v-if="handlePowerVisible('firstSupplyPrice')">
                                        <span v-if="formData.firstSupplyPrice">¥</span>
                                        <span v-if="formData.firstSupplyPrice">{{formData.firstSupplyPrice}}</span>
                                        <span v-else class="is-nodata" >无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="我司核价:">
                                    <div v-if="handlePowerVisible('accountingPrice')">
                                        <span v-if="formData.accountingPrice">¥</span>
                                        <span v-if="formData.accountingPrice">{{formData.accountingPrice}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="width: auto;" class="detail-form__item" label="最终供货价:">
                                    <div v-if="handlePowerVisible('lastSupplyPrice')">
                                        <span v-if="formData.lastSupplyPrice">¥</span>
                                        <span v-if="formData.lastSupplyPrice" >{{formData.lastSupplyPrice}}</span>
                                        <span v-else class="is-nodata">无</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </content-wrap>
            </base-box>

            <!-- 附件 -->
            <base-box class="procedure">
            <content-wrap title="附件" type="big">
                <upload-form :tableData="formData.attachmentLists" :fieldRoles="fieldRoles" :fileList="formData.attachments" :isEdit="true"></upload-form>
            </content-wrap>
        </base-box>
        </section>
        <base-box class="mgt8">
            <content-wrap class="content-wrap" title="审批意见">
                <el-table
                    border
                    v-if="formData.reviewOpinions&&formData.reviewOpinions.length > 0"
                    :data="formData.reviewOpinions"
                    style="width: 100%">
                    <el-table-column prop="reviewerName" label="评审人"></el-table-column>
                    <el-table-column prop="reviewStatusName" label="评审操作"></el-table-column>
                    <el-table-column prop="message" label="评审意见"></el-table-column>
                    <el-table-column prop="nodeName" label="节点名称"></el-table-column>
                    <el-table-column prop="dateUpdated" label="最后更新时间"></el-table-column>
                    <el-table-column prop="lastUpdateName" label="最后更新人"></el-table-column>
                </el-table>
                <div v-else class="nothing fs12">暂无评审意见</div>
            </content-wrap>
        </base-box>
        <el-button class="del-btn" @click="delOpen">删除档案</el-button>

        <!--编辑弹窗-->
        <transition name="right-move">
            <create-design-file v-if="editDesignFileVisible" :show.sync="editDesignFileVisible" :designStyleId="$route.query.designStyleId" @success="getDetail"></create-design-file>
        </transition>
        <transition name="opcity">
            <div class="cover" style="z-index:10 !important;" v-if="editDesignFileVisible" @click="editDesignFileVisible = false"></div>
        </transition>

        <!-- 提报的弹窗 -->
        <select-design-dialog :show.sync="selectDesignDialogVisible" @save="addFile" :loading.sync="saveBtnLoading" :formData="formData.process"></select-design-dialog>
        <!-- 删除弹窗 -->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="delOpenDialog" :show-close="false"
                 size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <div style="font-size:14px;color:#3B3B3B;">{{`是否删除【${formData.designStyleNo}】设计档案？`}}</div>
                <p class="remark" style="font-size:12px;color:#A2ABB8;margin-top:7px;line-height:18px;">删除后，本设计档案以及关联的BOM表、打版文件、样衣信息、工艺单、设计工单都将被删除，且不可恢复，请谨慎操作！</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="delOpenDialog = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="del">删除</el-button>
            </div>
        </el-dialog>
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
    </div>
</template>

<script>
    import {
        checkOnForward,
    } from '@/api/sample-centre';
    import {
        designstyleEditAndDetail,
        forward,
        designstyleDelete,
        getTagName,
        commonStyleSkuAttrAll,
    } from '@/api'
    import { getDesignTemplateList } from '@/api/sample-centre';
    import picList from './pic-list'
    import CreateDesignFile from '@/components/designFile/designFileInfo/create-design-file.vue';
    import selectDesignDialog from './selectDesignDialog'
    import skuDynamicallyTable from '@/components/order/createChild/skuDynamicallyTable'; // sku动态表格
    import printTemplateBtn from '@/components/material/printTemplateBtn.vue'
    import PrintTemplateBtn from "../../material/printTemplateBtn";
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格

    export default {
        name: "design-file-detail",
        data(){
            return{
                loading: false,
                editDesignFileVisible:false,
                selectDesignDialogVisible:false,
                saveBtnLoading:false,
                delOpenDialog:false,
                isSaving:false,
                formData:{designManuscripts:[],creativeDrawings:[],goodsPictures:[],standards:[],process:{templateId: '',leaderIds: []}},
                templateInfo: [],
                statusImg: require('../../../assets/images/caogao.png'),
                eliminateImg: require('../../../assets/images/eliminate.png'),
                createPic: [require('../../../assets/images/girl.jpg'),require('../../../assets/images/background.jpg')],
                pic: [require('../../../assets/images/girl.jpg'),require('../../../assets/images/background.jpg')],
                designPic: [require('../../../assets/images/girl.jpg'),require('../../../assets/images/background.jpg')],
                designFieldVisible: false,  //配置可编辑字段提示弹窗
                customList: [],
                modelMap: {
                    0: '联营',
                    1: '买断',
                    2: '包销',
                },
                goodsColorArr:[],     //颜色数组
                goodsSizeArr:[],      //尺码数组
                goodsLengthArr:[],    //内长数组
                skuTitleAndSelect: {},      //sku表格表头和下拉数据
                fieldRoles: [],  //字段权限
            }
        },
        components:{
            PrintTemplateBtn,
            picList,
            CreateDesignFile,
            selectDesignDialog,
            uploadForm,
            skuDynamicallyTable,
        },
        async created(){
          await this.getTagName();
          this.getTitleAndSelect();
          this.getDetail()
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            prcdNodeId() {
                return this.$route.query.prcdNodeId;
            },
            designStyleId(){
                return this.$route.query.designStyleId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        methods:{
            handlePowerVisible(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => {
                        if(v.code === key){
                            return v.visible
                        }else{
                            return false
                        }
                    })
                }else {
                    return false
                }
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
            // 获取自定义属性名称
            getTagName() {
                let params = {
                    bossUnitId: this.bossUnitId
                }
                getTagName(params).then(res => {
                    let data = res.data.goodsFields
                    data.forEach(i => {
                        if(i.type ==14 || i.type ==15 || i.type ==16 || i.type ==17 || i.type ==18 || i.type ==27 || i.type ==28 || i.type ==29) {
                            this.customList.push(i)
                        }
                    })
                })
            },
            // 删除
            delOpen() {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.delete")){
                    return
                }
                this.delOpenDialog = true
            },
            del() {
                this.isSaving = true
                designstyleDelete({designStyleId:this.$route.query.designStyleId}).then(res => {
                    if(res.data.code == 0) {
                        this.delOpenDialog = false
                        this.$message.success('删除成功')
                        this.$router.go(-1)
                    } else {
                        this.$message.error(res.data.msg)
                    }
                    this.isSaving = false
                })
            },
            detailEdit() {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.edit")){
                    return
                }
                this.editDesignFileVisible = true
            },
            submit() {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.submit")){
                    return
                }
                this.checkForwardNeed();

            },
            //提报检测必填
            checkForwardNeed() {
                let styleIds = [];
                styleIds.push(this.designStyleId);
                const params = {
                    unitId: this.unitId,
                    userId: this.userId,
                    styleIds: styleIds
                };
                checkOnForward(params).then(res => {
                    if (res.data.code == 0) {
                        this.selectDesignDialogVisible = true
                    }else{
                        this.designFieldVisible = true;
                    }
                })
            },
            getManId(val) {
                this.formData.process.leaderIds= val;
            },
            //提报
            async addFile(type, process) {
                let params = {
                    unitId:this.unitId,
                    type: 'forward',
                    styleIds: [this.formData.id],
                    process: process
                }
                this.saveBtnLoading = true
                forward(params).then(res => {
                    if (res.data.code == 0) {
                        this.getDetail()
                        this.$message.success(res.data.msg)
                        this.saveBtnLoading = false
                        this.selectDesignDialogVisible = false
                    } else {
                        this.$message.error(res.data.msg)
                        this.selectDesignDialogVisible = false
                    }
                })
            },
            selectDesign () {
                this.selectDesignDialogVisible = true
                this.formData.process = {
                    leadersIds: this.formData.process.leadersIds,
                    templateId: this.formData.process.templateId
                }
                console.log(this.formData.process, 'this.formData.process ')
            },
            getPicList(key){
                let arr = []
                this.formData[key].forEach(v => {
                    arr.push(v.path)
                })
                return arr
            },
            getDetail(){
                this.loading = true
                let params = {
                    userId:this.userId,
                    id: this.$route.query.designStyleId,
                    prcdNodeId: this.prcdNodeId
                }
                designstyleEditAndDetail(params).then(res => {
                    if(res.data.code === 0){
                        this.loading = false;

                        this.formData = res.data.data;
                        this.fieldRoles = res.data.data.fieldRoles;
                        //获取颜色id数组
                        if(this.formData.colors){
                            this.goodsColorArr = [];
                            this.formData.colors.forEach(item => {
                                this.goodsColorArr.push(item.id)
                            })
                        }
                        //获取尺码id数组
                        if(this.formData.sizes){
                            this.goodsSizeArr = [];
                            this.formData.sizes.forEach(item => {
                                this.goodsSizeArr.push(item.id)
                            })
                        }
                        //获取内长id数组
                        if(this.formData.standards){
                            this.goodsLengthArr = [];
                            this.formData.standards.forEach(item => {
                                this.goodsLengthArr.push(item.id)
                            })
                        }
                        //sku表格号型无值默认显示‘-’
                        if(this.formData.skuBarcodes){
                            this.formData.skuBarcodes.forEach(item => {
                                item.sizeTypeCategory = item.sizeTypeCategory ? item.sizeTypeCategory : '-'
                            })
                        }
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .design-file-detail{
        .design-content{
            img{
                max-width: 750px !important;
            }
        }

    }
    .design-files{
        .el-form-item{
            margin-bottom: 12px;
            .el-form-item__label{
                padding: 2px 12px 2px 0;
            }
            .el-form-item__content{
                line-height: 16px;
            }
        }
        .is-nodata{
            color: #333
        }
    }
</style>
<style lang="scss" scoped>
    .design-file-detail{
        position: relative;
        .content-wrap{
            margin-bottom: 24px;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .detail-form__row {
            margin-left: -20px;
            margin-bottom: 12px;
            .detail-form__item {
                width: 25%;
                margin-right: 32px;
                margin-bottom: 0 !important;
            }
            &:last-child .detail-form__item {
                margin-bottom: 0
            }
            .detail-form__edit-btn {
                text-decoration: underline;
                color: #1CA1FF;
            }
        }
        .pic-item{
            width: 80px;
            height: 80px;
            margin-right: 8px;
            padding-top: 11px;
        }
        .stauts-img{
            position: absolute;
            right: 0;
            top:80px;
        }
    }
    .del-btn{
        margin-top:8px;
        color:#FA4150;
        font-size:12px;
    }
    .nothing{
        color:#C4C6CC;
    }
</style>
