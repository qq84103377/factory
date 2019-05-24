<template>
    <div class="goods-info" id="goods-info" v-loading="loading" element-loading-text="拼命加载中">
        <div class="nf-scroll-container">
            <div class="nf-scroll-view">
                <div class="addStyle_content">
                    <div class="addStyle_content_header">
                        <div class="base">
                            <div class="line"></div>
                            基本信息
                        </div>
                        <div>
                            <nf-button type="warning" :plain="true" @click="clicksign">编辑</nf-button>
                        </div>
                    </div>
                    <el-form
                            class="goods-info-form"
                            label-width="85px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="商品款号" class="mgb0">
                                    <span style="color:#2c2c2c;">{{goodsInfo.styleNo}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="商品名称" class="mgb0">
                                    <span style="color:#2c2c2c;">{{goodsInfo.styleName}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="供应商" class="mgb0">
                                    <!--<span v-if="fieldRoles.find(v => v.code === 'commonOutsideFactoryName').visible" style="color:#2c2c2c;">{{(goodsInfo.outSideFactoryInfo&&goodsInfo.outSideFactoryInfo.commonOutsideFactoryName)? goodsInfo.outSideFactoryInfo.commonOutsideFactoryName : '无' }}</span>-->
                                    <span v-if="handlePowerVisible('commonOutsideFactoryName')" style="color:#2c2c2c;">{{(goodsInfo.outSideFactoryInfo&&goodsInfo.outSideFactoryInfo.commonOutsideFactoryName)? goodsInfo.outSideFactoryInfo.commonOutsideFactoryName : '无' }}</span>
                                    <span v-else style="color:#2c2c2c;">***</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="厂家货号" class="mgb0">
                                    <span style="color:#2c2c2c;">{{goodsInfo.plantArticleNumber}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="颜色" :required="true" class="mgb0">
                                    <span style="color:#2c2c2c;"
                                          v-for="(item,index) of goodsInfo.colors" :key="index">{{item.value+'-'+item.name}}
                                        <i v-if="index !==  goodsInfo.colors.length - 1">、</i>
                                    </span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="尺码" :required="true" class="mgb0">
                                    <span style="color:#2c2c2c;"
                                          v-for="(item,index) of goodsInfo.sizes" :key="index">{{item.value}}
                                        <i v-if="index !==  goodsInfo.sizes.length - 1">、</i>
                                    </span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="内长" :required="true" class="mgb0">
                                    <span style="color:#2c2c2c;"
                                          v-for="(item,index) of goodsInfo.lengths" :key="index">{{item.value}}
                                          <i v-if="index !==  goodsInfo.lengths.length - 1">、</i>
                                    </span>
                                    <span style="color:#2c2c2c;"
                                          v-if="goodsInfo.lengths && !goodsInfo.lengths.length">未设置</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <sku-dynamically-table
                                        type="see"
                                        :fieldRoles="fieldRoles"
                                        :titleAndSelect="skuTitleAndSelect"
                                        :editSkuTable="goodsInfo.skuBarcodes">
                                </sku-dynamically-table>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div style="font-size:20px;padding:18px 0;display:flex;content:flex-start;align-items:center;">
                        <div class="line"></div>
                        属性信息
                    </div>
                    <el-form
                            class="goods-info-form"
                            label-width="85px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="品牌" class="mgb0">
                                    <div v-if="handlePowerVisible('brand')">
                                         <span style="color:#2c2c2c;"
                                               v-for="(item,index) of goodsInfo.brand" :key="index">{{item.value}}
                                        <i v-if="index !==  goodsInfo.brand.length - 1">、</i>
                                    </span>
                                        <span class="gray"
                                              v-if="goodsInfo.brand && !goodsInfo.brand.length">无</span>
                                    </div>
                                   <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="品类" class="mgb0">
                                    <div v-if="handlePowerVisible('categoryInfo')">
                                        <span style="color:#2c2c2c;"
                                              v-if="goodsInfo.categoryInfo&&goodsInfo.categoryInfo.name">{{goodsInfo.categoryInfo&&goodsInfo.categoryInfo.name}}</span>
                                        <span class="gray" v-else>无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="风格" class="mgb0">
                                    <div v-if="handlePowerVisible('style')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.style" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.style.length - 1">、</i>
                                        </span>
                                        <span class="gray"
                                              v-if="goodsInfo.style && !goodsInfo.style.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设计师" class="mgb0">
                                    <div v-if="handlePowerVisible('designer')">
                                          <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.designer" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.designer.length - 1">、</i>
                                        </span>
                                        <span class="gray"
                                              v-if="goodsInfo.designer && !goodsInfo.designer.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="年份" class="mgb0">
                                    <div v-if="handlePowerVisible('year')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.year" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.year.length - 1">、</i>
                                        </span>
                                        <span class="gray" v-if="goodsInfo.year && !goodsInfo.year.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="季节" class="mgb0">
                                    <div v-if="handlePowerVisible('season')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.season" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.season.length - 1">、</i>
                                        </span>
                                        <span class="gray"
                                              v-if="goodsInfo.season && !goodsInfo.season.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="波段" class="mgb0">
                                    <div v-if="handlePowerVisible('wave')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.wave" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.wave.length - 1">、</i>
                                        </span>
                                        <span class="gray" v-if="goodsInfo.wave && !goodsInfo.wave.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="月份" class="mgb0">
                                    <div v-if="handlePowerVisible('month')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.month" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.month.length - 1">、</i>
                                        </span>
                                        <span class="gray"
                                              v-if="goodsInfo.month && !goodsInfo.month.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="分类" class="mgb0">
                                    <div v-if="handlePowerVisible('kind')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.kind" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.kind.length - 1">、</i>
                                        </span>
                                        <span class="gray" v-if="goodsInfo.kind && !goodsInfo.kind.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="标签" class="mgb0">
                                    <div v-if="handlePowerVisible('tag')">
                                        <span style="color:#2c2c2c;"
                                              v-for="(item,index) of goodsInfo.tag" :key="index">{{item.value}}
                                            <i v-if="index !==  goodsInfo.tag.length - 1">、</i>
                                        </span>
                                        <span class="gray"
                                              v-if="goodsInfo.tag && !goodsInfo.tag.length">无</span>
                                    </div>
                                    <div v-else style="color:#2c2c2c;">***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" v-for="(item,index) in customList" :key="index">
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 14">
                                    <template>
                                        <div v-if="handlePowerVisible('field1s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field1s" :key="index">{{item.value}}
                                            <i v-if="index !==  field1s.length - 1">、</i>
                                        </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field1s && !goodsInfo.field1s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 15">
                                    <template>
                                        <div v-if="handlePowerVisible('field2s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field2s" :key="index">{{item.value}}
                                                <i v-if="index !==  field2s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field2s && !goodsInfo.field2s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 16">
                                    <template>
                                        <div v-if="handlePowerVisible('field3s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field3s" :key="index">{{item.value}}
                                                <i v-if="index !==  field3s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field3s && !goodsInfo.field3s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 17">
                                    <template>
                                        <div v-if="handlePowerVisible('field4s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field4s" :key="index">{{item.value}}
                                                <i v-if="index !==  field4s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field4s && !goodsInfo.field4s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6" v-for="(item,index) in customList" :key="index">
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 18">
                                    <template>
                                        <div v-if="handlePowerVisible('field5s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field5s" :key="index">{{item.value}}
                                                <i v-if="index !== field5s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field5s && !goodsInfo.field5s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 27">
                                    <template>
                                        <div v-if="handlePowerVisible('field6s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field6s" :key="index">{{item.value}}
                                                <i v-if="index !== field6s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field6s && !goodsInfo.field6s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 28">
                                    <template>
                                        <div v-if="handlePowerVisible('field7s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field7s" :key="index">{{item.value}}
                                                <i v-if="index !== field7s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field7s && !goodsInfo.field7s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                                <el-form-item :label="item.name" class="mgb0" v-if="item.type == 29">
                                    <template>
                                        <div v-if="handlePowerVisible('field8s')">
                                            <span style="color:#2c2c2c;"
                                                  v-for="(item,index) of field8s" :key="index">{{item.value}}
                                                <i v-if="index !== field8s.length - 1">、</i>
                                            </span>
                                            <span class="gray"
                                                  v-if="goodsInfo.field8s && !goodsInfo.field8s.length">无</span>
                                        </div>
                                        <div v-else>***</div>
                                    </template>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div style="font-size:20px;padding:18px 0;display:flex;content:flex-start;align-items:center;">
                        <div class="line"></div>
                        描述信息
                    </div>
                    <div class="addStyle_content_thirdLine">
                        <p>
                            <span style="color:#636363;font-size:14px;margin-left:40px;">图片</span>
                            <span v-if="img_list.length<=0"
                                  style="color:#2c2c2c;font-size:14px;">未设置</span>
                        </p>
                        <ul v-if="img_list.length>0">
                            <li v-for="(item,index) of img_list" :key="index" @click="showImgs(index)">
                                <a class="face" @mouseenter="showSelect(index)" @mouseleave="showSelected(index)">
                                    <img :src="item">
                                </a>
                            </li>
                        </ul>
                    </div>
                    <el-form class="goods-info-form bd-bottom"
                             label-width="85px">
                        <el-row>
                            <el-form-item label="商品描述" class="mgb0">
                                <span class="des-ue-text" v-html="goodsInfo.remark"></span>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="模式" class="mgb0">
                                    <span style="color:#2c2c2c;">{{handlePowerVisible('model')?modelMap[goodsInfo.model]:'***'}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="上市日期" class="mgb0">
                                    <span style="color:#2c2c2c;">{{handlePowerVisible('dateListing')?goodsInfo.dateListing:'***'}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="国标码" class="mgb0">
                                    <span style="color:#2c2c2c;">{{handlePowerVisible('internationalCode')?goodsInfo.internationalCode:'***'}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="开发者" class="mgb0">
                                    <div v-if="handlePowerVisible('developers')">
                                        <span style="color:#2c2c2c;" v-for="(item,index) in  developersName"
                                              :key="index">{{item}}{{index < developersName.length-1 ? '、' : ''}}</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="开发部门" class="mgb0">
                                    <span style="color:#2c2c2c;">{{handlePowerVisible('developmentDepartment')?goodsInfo.developmentDepartment:'***'}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!--自定义字段-->
                    <el-form class="goods-info-form bd-bottom" label-width="100px">
                        <el-row style="margin-top:12px;">
                            <el-col :span="6" v-for="(item,index) in goodsInfo.customFieldList" :key="index">
                                <el-form-item class="mgb0" :label="item.customFieldName">
                                    <div v-if="handlePowerVisible('customField_'+item.customFieldId)">
                                        <div :class="{'gray':item.selectedOptions$&&!item.selectedOptions.length}" v-if="['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)">
                                        <span style="color: #2c2c2c" v-if="item.selectedOptions&&item.selectedOptions.length>0">
                                            {{item.selectedOptions.map(item =>item.optionName).join('、')}}</span>
                                            <span class="gray" v-else>未填写</span>
                                        </div>
                                        <div v-else-if="item.customFieldType ==='TEXT'">
                                            <div :title="item.textValue" class="ellipsis_1" style="color:#2c2c2c;max-width: 180px;"
                                                 v-if="item.textValue&&item.textValue.length>0">
                                                {{item.textValue}}
                                            </div>
                                            <span class="gray" v-else>未填写</span>
                                        </div>
                                        <div v-else>
                                        <span style="color: #2c2c2c" v-if="item.numberValue&&item.numberValue!=0">
                                            {{item.numberValue}}
                                        </span>
                                            <span class="gray" v-else>未填写</span>
                                        </div>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div style="font-size:20px;padding:18px 0;display:flex;content:flex-start;align-items:center;">
                        <div class="line"></div>
                        价格信息
                    </div>
                    <el-form class="goods-info-form"
                             :model="goodsInfo"
                             label-width="85px">
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="销售价" class="mgb0">
                                    <div v-if="handlePowerVisible('price')">
                                        <span v-if="goodsInfo.price||goodsInfo.price === 0">
                                       <span style="color:#2c2c2c;">¥{{goodsInfo.price}}</span>
                                    </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="吊牌价" class="mgb0">
                                    <div v-if="handlePowerVisible('retailPrice')">
                                        <span v-if="goodsInfo.retailPrice||goodsInfo.retailPrice === 0">
                                        <span style="color:#2c2c2c;">¥{{goodsInfo.retailPrice}}</span>
                                        </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="动销价" class="mgb0">
                                    <div v-if="handlePowerVisible('sellPrice')">
                                        <span v-if="goodsInfo.sellPrice||goodsInfo.sellPrice === 0">
                                        <span style="color:#2c2c2c;">¥{{goodsInfo.sellPrice}}</span>
                                        </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="动销价比" class="mgb0">
                                    <div v-if="handlePowerVisible('sellPricePop')">
                                        <span v-if="goodsInfo.sellPricePop||goodsInfo.sellPricePop === 0">
                                        <span style="color:#2c2c2c;">{{goodsInfo.sellPricePop}}</span>
                                        </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="物料成本" class="mgb0">
                                    <div v-if="handlePowerVisible('materialCost')">
                                        <span v-if="goodsInfo.materialCost||goodsInfo.materialCost === 0"><span style="color:#2c2c2c;">¥{{goodsInfo.materialCost}}</span></span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="加工成本" class="mgb0">
                                    <div v-if="handlePowerVisible('processingCost')">
                                        <span v-if="goodsInfo.processingCost||goodsInfo.processingCost === 0"><span style="color:#2c2c2c;">¥{{goodsInfo.processingCost}}</span></span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划成本价" class="mgb0">
                                    <div v-if="handlePowerVisible('cost')">
                                        <span v-if="goodsInfo.cost||goodsInfo.cost === 0"><span style="color:#2c2c2c;">¥{{goodsInfo.cost}}</span></span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="加价倍率/成本率" class="mgb0" label-width="115px">
                                    <div v-if="handlePowerVisible('pop')">
                                        <span style="color:#2c2c2c;">{{goodsInfo.pop?goodsInfo.pop : '无'}}</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="最初供货价" class="mgb0">
                                    <div v-if="handlePowerVisible('firstSupplyPrice')">
                                         <span v-if="goodsInfo.firstSupplyPrice||goodsInfo.firstSupplyPrice === 0">
                                      <span style="color:#2c2c2c;">¥{{goodsInfo.firstSupplyPrice}}</span>
                                  </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="我司核价" class="mgb0">
                                    <div v-if="handlePowerVisible('accountingPrice')">
                                        <span v-if="goodsInfo.accountingPrice||goodsInfo.accountingPrice === 0">
                                    <span style="color:#2c2c2c;">¥{{goodsInfo.accountingPrice}}</span>
                                    </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="最终供货价" class="mgb0">
                                    <div v-if="handlePowerVisible('lastSupplyPrice')">
                                            <span v-if="goodsInfo.lastSupplyPrice||goodsInfo.lastSupplyPrice === 0">
                                    <span style="color:#2c2c2c;">¥{{goodsInfo.lastSupplyPrice}}</span>
                                    </span>
                                        <span v-else style="color: #aaa">未填写</span>
                                    </div>
                                    <div v-else>***</div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <!-- 附件 -->
                    <div style="font-size:20px;padding:18px 0;display:flex;content:flex-start;align-items:center;">
                        <div class="line"></div>
                        附件
                    </div>
                    <upload-form isEdit="true" :tableData="attachmentLists" :fileList="attachments" :fieldRoles="fieldRoles"
                                 @getFileList="getFileList" @getAttachments="getAttachments"></upload-form>
                </div>
                <nf-button style="margin-top:16px;" type="warningsimple" @click="clickdelete">
                    删除货品
                </nf-button>
            </div>
        </div>

        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="deleteFac">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定删除当前货品？</p>
                <p style="color:#a2abb8;font-size:14px;">删除后数据不可恢复</p>
            </div>
            <div class="footer">
                <nf-button @click="deleteFac = false">取消</nf-button>
                <nf-button type="warning" @click="deleteGoods">确定</nf-button>
            </div>
        </el-dialog>

        <!-- 图片预览 -->
        <div class="goods_img">
            <el-dialog :visible.sync="centerDialogVisible" :show-close="true" width="100%" :modal="true" center>
                <div>
                    <i class="el-icon-arrow-left" @click="leftImg"></i>
                </div>
                <div class="imgs"><img :src="this.img_list[i]"></div>
                <div>
                    <i class="el-icon-arrow-right" @click="rightImg"></i>
                </div>
            </el-dialog>
        </div>

        <!--新建编辑商品组件-->
        <transition name="right-move">
            <goods-dialog
                    v-if="goodsDialog"
                    modelName="GOODS_STYLE"
                    :handleType="handleType"
                    :goodsId="editGoodsId"
                    :styleId="styleId"
                    @hidden="hiddenAddGoodsDialog">
            </goods-dialog>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="goodsDialog" @click="hiddenAddGoodsDialog">
            </div>
        </transition>

    </div>
</template>
<script>
    import GoodsDialog from '@/components/order/createChild/goods-dialog.vue';
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    import skuDynamicallyTable from '@/components/order/createChild/skuDynamicallyTable'; // sku动态表格
    //接口这边需要调用新增工厂那边的接口，然后获取图片需要调用和七牛base64不一样的上传接口
    import {
        getUploadToken,
        addFacGoodsStyle,
        upDetailImgs,
        addFacUnitSettings,
        addCommonSkuAttr,
        deleteFacUnitSettings,
        selectFacCommonSettings,
        checkFacGoodsStyle,
        getFacGoodsStyle,
        updateFacGoodsStyle,
        deleteFacGoods,
        judgeFacDelSku,
        updateMissionPreview,
        isExistGenerateStyleNoList,
        selectDifSettings,
        getTagName,
        getUnitUser,
        outsideFactoryListForSelect,
        commonStyleSkuAttrAll,
    } from "@/api";
    import sizeSelect from "@/components/Common/size-select.vue";

    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";

    const fun = require('@/components/Common/commonFun.js')

    export default {
        data() {
            return {
                updateGenerateStyleNo: false,
                updateParams: {},
                getFacCommonSettings: true,
                updateStyleNoPower: true, //更新商品款号权限
                updateDialoVisible: false,
                overLoading: false,
                autoNumberGood: false,
                loading: false,
                designHeadId: [],//设计负责人id
                colorSearch: false,
                i: "",
                colorSetName: "",
                centerDialogVisible: false,
                isLoading: false,
                sameStyle: {},
                img_name: {},
                img_list: [],
                show: "",
                img_list_send: [],
                colorArr: [],
                colors: [],
                colorSet: "",
                sizes: [],
                sizeArr: [],
                lengths: [],
                lengthArr: [],
                designers: [],
                designerArr: [],
                waves: [],
                waveArr: [],
                kinds: [],
                kindArr: [],
                seasons: [],
                seasonArr: [],
                years: [],
                yearArr: [],
                tags: [],
                tagArr: [],
                brands: [],
                brandArr: [],
                styles: [],
                styleArr: [],
                months: [],
                monthArr: [],
                facInfo: {},
                //货品编辑
                goodsInfo: {},
                skuVal: {},
                skuColor: [],
                isComponentsShow: false,
                artData: {},
                artOne: [],
                addData: [],
                deleteFac: false,
                isShow: false,
                searchData: [],
                colorsId: [],
                styleNo: '',
                orginStyleNo: '',
                defaultMsg: '',
                goodsRemark: '',
                type: null,
                outSideFactoryId: '', //供应商 outSideFactoryId
                plantArticleNumber: '', // 厂家货号
                model: '', // 模式
                dateListing: '', // 上市日期
                internationalCode: '', // 国标码
                developmentDepartment: '', // 开发部门
                firstSupplyPrice: '', // 最初供货价
                lastSupplyPrice: '', // 最终供货价
                accountingPrice: '', // 我司核价
                retailPrice: '', // 吊牌价
                developerIds: [],
                developersName: [], // 开发者
                categoryList: [],//品类分类
                categoryId: [],//品类分类
                field1s: [],
                field2s: [],
                field3s: [],
                field4s: [],
                field5s: [],
                field6s: [],
                field7s: [],
                field8s: [],
                fieldList1: [], // 自定义属性1列表
                fieldList2: [], // 自定义属性2列表
                fieldList3: [], // 自定义属性3列表
                fieldList4: [], // 自定义属性4列表
                fieldList5: [], // 自定义属性5列表
                attachmentLists: [], // 表格上传
                attachments: [], // 其他上传
                options: {groupOptions: []},// 开发者
                customList: [],
                patternList: [
                    {value: 0, label: '联营'},
                    {value: 1, label: '买断'},
                    {value: 2, label: '包销'}
                ],
                modelMap: {
                    0: '联营',
                    1: '买断',
                    2: '包销',
                },
                outsideFactoryList: [], // 供应商
                goodsDialog: false,     //编辑货品弹窗
                handleType: 'edit',      //货品操作类型：新建/编辑
                editGoodsId: '',      //编辑操作要用的goodsId
                editGoodsStyleId: '',  //编辑操作要用的styleId
                goodsColorArr: [],     //颜色数组
                goodsSizeArr: [],      //尺码数组
                goodsLengthArr: [],    //内长数组
                skuTitleAndSelect: {},      //sku表格表头和下拉数据
                fieldRoles: []
            };
        },
        components: {
            sizeSelect,
            uploadForm,
            GoodsDialog,
            skuDynamicallyTable,
        },
        computed: {
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            styleId() {
                return this.$route.query.id
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            }
        },
        methods: {
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
            //关闭新建商品弹窗
            hiddenAddGoodsDialog(val) {
                if (val == 1) {
                    this.getNowGoodsInfo();
                }
                this.goodsDialog = false;
            },
            // 供应商
            changeSupplierId(val) {
                this.goodsInfo.commonOutsideFactoryId = val.id
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
                        if (i.type == 14 || i.type == 15 || i.type == 16 || i.type == 17 || i.type == 18 || i.type == 27 || i.type == 28 || i.type == 29) {
                            this.customList.push(i)
                        }
                    })
                })
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
            //更新商品款号
            updateStyleNo(val) {
                console.log(val);
                if (!val) {
                    //取消勾选
                    this.goodsInfo.styleNo = this.orginStyleNo;
                    return
                }

                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    modelType: 2,
                    attrs: [],
                };
                let newAttr = [
                    {type: 2, attrId: this.designerArr[0] || ''},
                    {type: 3, attrId: this.waveArr[0] || ''},
                    {type: 5, attrId: this.seasonArr[0] || ''},
                    {type: 4, attrId: this.kindArr[0] || ''},
                    {type: 6, attrId: this.yearArr[0] || ''},
                    {type: 8, attrId: this.brandArr[0] || ''},
                    {type: 7, attrId: this.tagArr[0] || ''},
                    {type: 10, attrId: this.monthArr[0] || ''},
                    {type: 9, attrId: this.styleArr[0] || ''},
                    {type: 14, attrId: this.goodsInfo.field1s[0] || ''},
                    {type: 15, attrId: this.goodsInfo.field2s[0] || ''},
                    {type: 16, attrId: this.goodsInfo.field3s[0] || ''},
                    {type: 17, attrId: this.goodsInfo.field4s[0] || ''},
                    {type: 18, attrId: this.goodsInfo.field5s[0] || ''},
                ];
                this.categoryId.forEach((item, index) => {
                    params.attrs.push({type: 11 + index, attrId: item})
                });
                newAttr.forEach(item => {
                    if (item.attrId !== '') {
                        params.attrs.push(item)
                    }
                })

                updateMissionPreview(params).then(res => {
                    if (res.data.code === 0) {
                        this.goodsInfo.styleNo = res.data.data
                        this.$message.success('更新成功')
                    } else {
                        this.updateGenerateStyleNo = false
                        this.$message.error(res.data.msg)
                    }
                })
            },
            handleClose() {
                this.updateDialoVisible = false

            },
            updateDialoVisibleGo(status) {
                if (status === 'sure') {
                    //更新
                    this.updateParams.generateStyleNo = true
                } else {
                    this.updateParams.generateStyleNo = false
                }
                this.overLoading = true;
                updateFacGoodsStyle(this.updateParams).then(res => {
                    this.isLoading = false;
                    this.overLoading = false;
                    if (res.data.code === 0) {
                        this.getNowGoodsInfo();
                        this.$message({
                            showClose: true,
                            message: "修改成功",
                            type: "success",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.updateParams = {}
                        return;
                    }
                    this.$message.error("修改失败");
                });
                this.updateDialoVisible = false
            },
            // 设计负责人选中所有id
            getManId(arrId) {
                this.designHeadId = arrId//设计负责人下拉选中值
            },
            // 判断权限
            clicksign() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.goods.update") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.handleType = 'edit';
                this.goodsDialog = true;
            },
            // 点击删除判断权限
            clickdelete() {
                let datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                if (datalist.indexOf("fac.goods.delete") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.deleteFac = true
            },
            changeArtList() {
                this.isShow = !this.isShow;
            },
            showImgs(index) {
                this.i = index;
                this.centerDialogVisible = true;
            },
            leftImg() {
                if (this.i == 0) {
                    return false;
                } else {
                    this.img_list[this.i--];
                }
            },
            rightImg() {
                if (this.i >= this.img_list.length - 1) {
                    return false;
                } else {
                    this.img_list[this.i++];
                }
            },
            // 点击删除内长调接口
            deleteLength(val) {
                var sku = [];
                for (let colorItem of this.goodsInfo.colors) {
                    for (let sizeItem of this.goodsInfo.sizes) {
                        sku.push(colorItem.id + "_" + sizeItem.id + "_" + val.value);
                    }
                }
                let params = {
                    goodsId: this.$route.query.goodsId,
                    styleId: this.$route.query.id,
                    sku: sku
                };
                judgeFacDelSku(params).then(res => {
                    if (res.data.data == 1) {
                        this.lengthArr.push(val.value);
                        this.$message({
                            showClose: true,
                            message: "该内长被工单或BOM表引用，不可删除",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                    }
                });
            },
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
            // 内长列表
            remoteMethodLength(query) {
                if (query.length <= 0) {
                    this.lengths = this.facInfo.length;
                    return;
                }
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    token: "",
                    type: "length",
                    keyword: query
                };
                selectFacCommonSettings(params).then(res => {
                    this.lengths = res.data.data;
                    this.lengths.push({
                        value: "无",
                        id: "36fec3286377458bb445d0a287cd8e0e"
                    });
                    for (let i = 0; i < this.lengths.length; i++) {
                        for (let j = 0; j < this.goodsInfo.lengths.length; j++) {
                            if (this.goodsInfo.lengths[j].value == this.lengths[i].value) {
                                this.lengths[i].removeTag = this.goodsInfo.lengths[j].removeTag;
                            }
                        }
                    }
                });
            },
            // -----图片封面选择 ----------
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
            async imgUpload(e) {
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
                    await getUploadToken(params).then(res => {
                        this.img_name.token = res.data.uptoken;
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            const _imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
                            this.img_list.push(_imgUrl);
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
            // 过滤需要上传的sku参数
            getSkuParams() {
                let skuList = [];
                //判断内长是否打钩，否则为空
                console.warn(this.lengthArr.length);
                if (this.lengthArr.length != []) {
                    for (let colorItem of this.colorArr) {
                        for (let sizeItem of this.sizeArr) {
                            for (let lengthItem of this.lengthArr) {
                                let obj = {};
                                const idStr = `${colorItem}_${sizeItem}_${lengthItem}`;
                                if (this.skuVal.hasOwnProperty(idStr)) {
                                    obj = {
                                        skuId: this.skuVal[idStr].skuId,
                                        skuIdStr: idStr
                                    };
                                } else {
                                    obj = {
                                        skuId: "",
                                        skuIdStr: idStr
                                    };
                                }
                                skuList.push(obj);
                            }
                        }
                    }
                    return skuList;
                } else {
                    for (let colorItem of this.colorArr) {
                        for (let sizeItem of this.sizeArr) {
                            let obj = {};
                            const idStr = `${colorItem}_${sizeItem}_36fec3286377458bb445d0a287cd8e0e`;
                            if (this.skuVal.hasOwnProperty(idStr)) {
                                obj = {
                                    skuId: this.skuVal[idStr].skuId,
                                    skuIdStr: idStr
                                };
                            } else {
                                obj = {
                                    skuId: "",
                                    skuIdStr: idStr
                                };
                            }
                            skuList.push(obj);
                        }
                    }
                    return skuList;
                }
            },
            getNowGoodsInfo() {
                this.loading = true
                let params = {
                    token: "",
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    styleId: this.$route.query.id,
                    userId: this.userId
                };
                getFacGoodsStyle(params).then(res => {
                    if(res.data.code === 0){
                        this.loading = false
                        this.goodsInfo = res.data;
                        this.fieldRoles = res.data.fieldRoles
                        let nameList = []
                        let ids = []
                        if (this.goodsInfo.developers && this.goodsInfo.developers.length > 0) {
                            this.goodsInfo.developers.forEach(i => {
                                nameList.push(i.name)
                                ids.push(i.id)
                            })
                        }
                        this.goodsInfo.outSideFactory = {
                            id: this.goodsInfo.outSideFactoryInfo.commonOutsideFactoryId,
                            name: this.goodsInfo.outSideFactoryInfo.commonOutsideFactoryName
                        }
                        this.developersName = nameList
                        this.developerIds = ids
                        this.orginStyleNo = this.goodsInfo.styleNo
                        this.defaultMsg = this.goodsInfo.remark
                        this.attachmentLists = res.data.attachmentList;
                        this.attachments = res.data.attachments;
                        this.goodsInfo.commonOutsideFactoryId = this.goodsInfo.outSideFactoryInfo.commonOutsideFactoryId
                        if (this.goodsInfo.categoryInfo) {
                            this.categoryId = [this.goodsInfo.categoryInfo.firstId, this.goodsInfo.categoryInfo.secondId, this.goodsInfo.categoryInfo.thirdId]
                        }
                        this.field1s = this.goodsInfo.field1s
                        this.field2s = this.goodsInfo.field2s
                        this.field3s = this.goodsInfo.field3s
                        this.field4s = this.goodsInfo.field4s
                        this.field5s = this.goodsInfo.field5s
                        this.field6s = this.goodsInfo.field6s
                        this.field7s = this.goodsInfo.field7s
                        this.field8s = this.goodsInfo.field8s
                        this.styleNo = res.data.styleNo // 保存的时候对比
                        this.getSkuVal(res.data["sku"]);
                        if (this.goodsInfo.lengths.length == 1 && this.goodsInfo.lengths[0].id == "36fec3286377458bb445d0a287cd8e0e") {
                            window.sessionStorage.setItem("goodsLengths", 0);
                        } else {
                            window.sessionStorage.setItem("goodsLengths", 1);
                        }

                        var colors = [];
                        for (let i = 0; i < this.goodsInfo.colors.length; i++) {
                            colors.push(this.goodsInfo.colors[i].id);
                        }
                        this.colorArr = colors;
                        var sizes = [];
                        for (let i = 0; i < this.goodsInfo.sizes.length; i++) {
                            sizes.push(this.goodsInfo.sizes[i].id);
                        }
                        this.sizeArr = sizes;
                        console.warn(this.goodsInfo, "length");
                        if (this.goodsInfo.lengths) {
                            var lengths = [];
                            for (let i = 0; i < this.goodsInfo.lengths.length; i++) {
                                lengths.push(this.goodsInfo.lengths[i].id);
                            }
                            this.lengthArr = lengths;
                            console.warn(this.lengthArr, "1");
                        }
                        if (this.goodsInfo.pictures) {
                            var pictures = [];
                            for (let i = 0; i < this.goodsInfo.pictures.length; i++) {
                                pictures.push(this.goodsInfo.pictures[i].picPath);
                            }
                            this.img_list = pictures;
                        }
                        if (this.goodsInfo.designer) {
                            var designers = [];
                            for (let i = 0; i < this.goodsInfo.designer.length; i++) {
                                designers.push(this.goodsInfo.designer[i].id);
                            }
                            this.designerArr = designers;
                        }
                        if (this.goodsInfo.wave) {
                            var waves = [];
                            for (let i = 0; i < this.goodsInfo.wave.length; i++) {
                                waves.push(this.goodsInfo.wave[i].id);
                            }
                            this.waveArr = waves;
                        }
                        if (this.goodsInfo.kind) {
                            var kinds = [];
                            for (let i = 0; i < this.goodsInfo.kind.length; i++) {
                                kinds.push(this.goodsInfo.kind[i].id);
                            }
                            this.kindArr = kinds;
                        }
                        if (this.goodsInfo.season) {
                            var seasons = [];
                            for (let i = 0; i < this.goodsInfo.season.length; i++) {
                                seasons.push(this.goodsInfo.season[i].id);
                            }
                            this.seasonArr = seasons;
                        }
                        if (this.goodsInfo.year) {
                            var years = [];
                            for (let i = 0; i < this.goodsInfo.year.length; i++) {
                                years.push(this.goodsInfo.year[i].id);
                            }
                            this.yearArr = years;
                        }
                        if (this.goodsInfo.tag) {
                            var tags = [];
                            for (let i = 0; i < this.goodsInfo.tag.length; i++) {
                                tags.push(this.goodsInfo.tag[i].id);
                            }
                            this.tagArr = tags;
                        }
                        if (this.goodsInfo.brand) {
                            var brands = [];
                            for (let i = 0; i < this.goodsInfo.brand.length; i++) {
                                brands.push(this.goodsInfo.brand[i].id);
                            }
                            this.brandArr = brands;
                        }
                        if (this.goodsInfo.chargers) {
                            let chargers = [];
                            for (let i = 0; i < this.goodsInfo.chargers.length; i++) {
                                chargers.push(this.goodsInfo.chargers[i].id);
                            }
                            this.designHeadId = chargers;
                        }
                        if (this.goodsInfo.style) {
                            let style = [];
                            for (let i = 0; i < this.goodsInfo.style.length; i++) {
                                style.push(this.goodsInfo.style[i].id);
                            }
                            this.styleArr = style;
                        }
                        if (this.goodsInfo.month) {
                            let month = [];
                            for (let i = 0; i < this.goodsInfo.month.length; i++) {
                                month.push(this.goodsInfo.month[i].id);
                            }
                            this.monthArr = month;
                        }
                        if (this.goodsInfo.field1s) {
                            let field1s = [];
                            for (let i = 0; i < this.goodsInfo.field1s.length; i++) {
                                field1s.push(this.goodsInfo.field1s[i].id);
                            }
                            this.goodsInfo.field1s = field1s;
                        }
                        if (this.goodsInfo.field2s) {
                            let field2s = [];
                            for (let i = 0; i < this.goodsInfo.field2s.length; i++) {
                                field2s.push(this.goodsInfo.field2s[i].id);
                            }
                            this.goodsInfo.field2s = field2s;
                        }
                        if (this.goodsInfo.field3s) {
                            let field3s = [];
                            for (let i = 0; i < this.goodsInfo.field3s.length; i++) {
                                field3s.push(this.goodsInfo.field3s[i].id);
                            }
                            this.goodsInfo.field3s = field3s;
                        }
                        if (this.goodsInfo.field4s) {
                            let field4s = [];
                            for (let i = 0; i < this.goodsInfo.field4s.length; i++) {
                                field4s.push(this.goodsInfo.field4s[i].id);
                            }
                            this.goodsInfo.field4s = field4s;
                        }
                        if (this.goodsInfo.field5s) {
                            let field5s = [];
                            for (let i = 0; i < this.goodsInfo.field5s.length; i++) {
                                field5s.push(this.goodsInfo.field5s[i].id);
                            }
                            this.goodsInfo.field5s = field5s;
                        }
                        if (this.goodsInfo.field6s) {
                            let field6s = [];
                            for (let i = 0; i < this.goodsInfo.field6s.length; i++) {
                                field6s.push(this.goodsInfo.field6s[i].id);
                            }
                            this.goodsInfo.field6s = field6s;
                        }
                        if (this.goodsInfo.field7s) {
                            let field7s = [];
                            for (let i = 0; i < this.goodsInfo.field7s.length; i++) {
                                field7s.push(this.goodsInfo.field7s[i].id);
                            }
                            this.goodsInfo.field7s = field7s;
                        }
                        if (this.goodsInfo.field8s) {
                            let field8s = [];
                            for (let i = 0; i < this.goodsInfo.field8s.length; i++) {
                                field8s.push(this.goodsInfo.field8s[i].id);
                            }
                            this.goodsInfo.field8s = field8s;
                        }
                        //获取颜色id数组
                        if (this.goodsInfo.colors) {
                            this.goodsColorArr = [];
                            this.goodsInfo.colors.forEach(item => {
                                this.goodsColorArr.push(item.id)
                            })
                        }
                        //获取尺码id数组
                        if (this.goodsInfo.sizes) {
                            this.goodsSizeArr = [];
                            this.goodsInfo.sizes.forEach(item => {
                                this.goodsSizeArr.push(item.id)
                            })
                        }
                        //获取内长id数组
                        if (this.goodsInfo.lengths) {
                            this.goodsLengthArr = [];
                            this.goodsInfo.lengths.forEach(item => {
                                this.goodsLengthArr.push(item.id)
                            })
                        }
                        //sku表格号型无值默认显示‘-’
                        if (this.goodsInfo.skuBarcodes) {
                            this.goodsInfo.skuBarcodes.forEach(item => {
                                item.sizeTypeCategory = item.sizeTypeCategory ? item.sizeTypeCategory : '-'
                            })
                        }
                    }
                });
            },
            //删除货品
            deleteGoods() {
                let params = {
                    token: "",
                    goodsId: this.$route.query.goodsId,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                deleteFacGoods(params).then(res => {
                    if (res.data.code == 4) {
                        this.$message({
                            // showClose: true,
                            message: "货品关联正在进行的订单，不可删除!",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return;
                    } else {
                        this.deleteFac = false;
                        this.$message({
                            showClose: true,
                            message: "删除成功!",
                            type: "success",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.$router.push("/goodsMangement");
                    }
                });
            },
            // 获取上传列表
            getFileList(v) {
                this.attachmentLists = v
            },
            getAttachments(v) {
                this.attachments = v
            },
            getSkuVal(skuArr) {
                if(skuArr && skuArr.length){
                    for (let item of skuArr) {
                        const idStr = `${item.color_id}_${item.size_id}${
                            item.standard_id ? "_" + item.standard_id : ""
                            }`;
                        this.skuVal[idStr] = {
                            skuId: item.id
                        };
                    }
                }
            },
            get() {
                this.isComponentsShow = !this.isComponentsShow;
            },
        },
        async created() {
            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            //更新商品款号
            if (powerlist.indexOf('fac.spl.design.style.styleNo.editpreview') == -1) {
                this.updateStyleNoPower = false
            }
            await this.getNowGoodsInfo();
            await this.getTagName();
            await this.fetchUnitUser();
            await this.isExistGenerateStyleNoList();
            this.getTitleAndSelect();
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

    .gray {
        color: #cccccc;
    }

    .icon-left {
        font-size: 12px;
        margin-right: 5px;
    }

    .mgb0 {
        margin-bottom: 0 !important;
    }

    .form-select {
        width: 100% !important;
        .el-select {
            width: 100% !important;
        }
    }

    .goods-info {
        padding-bottom: 5px;
        border-radius: 4px;
        position: relative;
        height: 1200px;
        box-sizing: border-box;
        position: relative;
        .header_line {
            background-color: #fff;
            // position: fixed;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding: 0 32px;
            height: 68px;
            .header_right {
                font-size: 24px;
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
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            background-color: #fff;
            padding: 0 32px 20px;
            box-sizing: border-box;
            width: 100%;
            .addStyle_content_header {
                padding: 18px 0;
                .base {
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                //   width: 100%;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .addStyle_content_firstLine {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #636363;
                margin-bottom: 16px;
                margin-left: 14px;
                div {

                    &:first-child {
                        span {
                            color: red;
                        }
                    }
                }
                .nf-input {
                    width: 230px;
                    display: inline-block;
                }
                input {
                    display: inline-block;
                    border: 1px solid #d5d5d5;
                    font-size: 14px;
                    border-radius: 2px;
                    width: 260px;
                    height: 32px;
                    text-indent: 0.8em;
                }
            }
            .info-list2 {
                color: #636363;
                margin-bottom: 16px;
                .info-list-inner {
                    display: flex;
                    align-items: center;
                    .new_set {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 36px;
                        margin-left: 10px;
                        color: #ff9c38;
                    }
                }
            }
            .addStyle_content_secondLine {
                margin-left: 14px;
            }
            .addStyle_content_thirdLine {
                margin-left: 7px;
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
                        width: 60px;
                        height: 100%;

                        z-index: -999999;
                    }
                }
                ul {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                    padding-bottom: 4px;
                    padding: 10px;
                    padding-top: 0;
                    background-color: #f6f6f6;
                    width: 800px;
                    min-height: 120px;
                    margin-left: 14px;
                    li {
                        width: 114px;
                        height: 114px;
                        margin-right: 10px;
                        margin-top: 10px;
                        border-radius: 4px;
                        position: relative;
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
                            height: 100%;
                            border-radius: 4px;
                        }
                    }
                }
            }
            .addStyle_content_fourLine {
                padding-bottom: 20px;
                .info_four {
                    display: flex;
                    align-items: center;
                    margin-left: 16px;
                }
                .brand_four {
                    justify-content: flex-start;
                }
            }
            .goods-des-ue {
                width: 100%;
                margin: 16px 20px 30px;
                overflow: hidden;
                .des-ue-title {
                    float: left;
                    font-size: 14px;
                    color: #636363;
                }
                .des-ue-text {
                    color: rgb(44, 44, 44);
                    float: left;
                    margin-left: 5px;
                    width: 90%;
                }
                .des-ue-wrap {
                    float: left;
                    margin-left: 5px;
                    width: 90%;
                }
            }
            .info-list2 {
                color: #636363;
                margin-bottom: 16px;
                .info-list-inner {
                    display: flex;
                    align-items: center;
                    .new_set {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        height: 36px;
                        margin-left: 10px;
                        color: #ff9c38;
                    }
                }
            }
            .addStyle_content_secondLine {
                margin-left: 14px;
            }
            .addStyle_content_thirdLine {
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
                        height: 100%;
                        z-index: -999999;
                    }
                }
                ul {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                    padding-bottom: 4px;
                    padding: 10px;
                    padding-top: 0;
                    background-color: #f6f6f6;
                    width: 70%;
                    min-width: 620px;
                    min-height: 120px;
                    margin-left: 14px;
                    li {
                        width: 114px;
                        height: 114px;
                        margin-right: 10px;
                        margin-top: 10px;
                        border-radius: 4px;
                        position: relative;
                        .faceStyle {
                            position: absolute;
                            top: 0;
                            right: 0;
                            z-index: 777;
                            width: 0;
                            height: 0;
                            span {
                                position: absolute;
                                transform: rotate(45deg);
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
                            max-height: 114px;
                            border-radius: 4px;
                        }
                    }
                }
            }

        }
        .art-info {
            background-color: #fff;
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
                text-indent: 0.2em;
                font-size: 14px;
                &::-webkit-input-placeholder {
                    color: #636363;
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
        .repertory_dialog {
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
            }
            .title {
                width: 100%;
                height: 52px;
                text-align: center;
                line-height: 52px;
                font-size: 20px;
                color: #3b3b3b;
                border-bottom: 1px solid #e0e6ed;
            }
            .footer {
                padding: 0 32px 32px 36px;
                button {
                    margin: 0 6px;
                }
            }
        }
        .repertory_dialog--dele {
            .el-dialog {
                width: 766px;
            }
            .body {
                text-align: center;
                P {
                    margin: 32px 0;
                    font-size: 14px;
                    color: #3b3b3b;
                }
            }
            .footer {
                display: flex;
                justify-content: center;
                padding-top: 28px;
                border-top: 1px solid #e0e6ed;
            }
        }
        .color-lisearch {
            cursor: pointer;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 36px;
            padding-left: 12px;
            &:hover {
                background-color: #ccc;
            }
        }
        // 新增的12363的需求样式变动
        .el-form-item__label {
            padding: 6px 12px 6px 0;
        }
        .el-form-item__content {
            line-height: 26px;
        }
    }
</style>

<style lang="scss">
    @import "~scss_vars";

    .goods-info-form {
        .form-select {
            width: 100% !important;
            .el-select {
                width: 100% !important;
            }
        }
        .el-date-editor.el-input {
            width: 100% !important;
        }
    }

    #goods-info .goods_img {
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
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
        .el-icon-arrow-right {
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
    }

    #goods-info {
        width: 100%;
        height: 100%;
    }

    .colorSelectGroupSel {
        .el-select {
            width: 100%;
        }

    }

    #goods-info .addStyle_content_secondLine .el-input__inner {
        border-radius: 2px;
        // max-width: 770px;
        // min-width:600px;
        // min-width: 770px;
        min-width: 100%;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    #goods-info .addStyle_content_fourLine .el-input__inner {
        border-radius: 2px;
        width: 100%;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    #goods-info .addStyle_content_fourLine .info-list-inner .el-input__inner {
        border-radius: 2px;
        // min-width: 260px;
        width: 100%;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    #goods-info .el-tag--primary {
        background-color: #f2f5fa;
        border: none;
        border-radius: 2px;
        font-size: 14px;
        padding: 0 6px;
        color: #2c2c2c;
        height: 24px;
        .el-icon-close {
            color: #bcc1cc;
            &:hover {
                background-color: #bcc1cc;
                color: #fff;
            }
        }
    }

    #goods-info .el-dialog--small {
        width: 30%;
    }

    .new_set {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        color: #ff9c38;
        margin-top: -6px;
        cursor: pointer;
    }

    #goods-info .line {
        width: 6px;
        height: 20px;
        background-color: #ff9c38;
        margin-right: 10px;
    }

    .styleNoUpdateInput .el-input {
        width: calc(100% - 56px);
    }

    .styleNoUpdateInput .el-input__inner {
        width: 100%;
    }

    #goods-info {
        .newColorForm {
            .el-form-item {
                margin-bottom: 22px;
                .el-input .el-input__inner {
                    max-width: none;
                }
                &:last-child {
                    margin-bottom: 0;
                }
            }

        }
    }
</style>





