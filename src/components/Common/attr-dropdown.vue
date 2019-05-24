<template>
    <div>
        <el-form
                ref="cateInfo"
                class="create-form"
                :model="attrSelect"
                :rules="toRules"
                label-width="85px">
            <el-row>
                <el-row>
                    <el-col :span="6" v-show="!designList ||　designList&&designList.brands">
                        <el-form-item class="create-form__item" prop="brand" label="品牌" :class="{'is-error':!attrSelect.brand.length && goodMustConfigCodeData.indexOf('brandIds')>-1,'checkCodeActive':checkCodeListData.indexOf('brands')>-1}">
                                <el-select
                                        v-if="handlePowerVisible('brand')"
                                        :disabled="!handlePowerEdit('brand')"
                                        filterable
                                        clearable
                                        ref="brand"
                                        :multiple="multiple"
                                        v-model="attrSelect.brand"
                                        placeholder="请选择品牌">
                                    <el-option :value="''" disabled style="cursor:pointer;"   v-if="getFacCommonSettings">
                                        <div class="add-attr"
                                             @click="handleAddAttr('brand','品牌')">新建
                                        </div>
                                    </el-option>
                                    <el-option v-for="item in formData.brandList" :key="item.id" :label="item.value"
                                               :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-else disabled placeholder="***">
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="!designList ||　designList&&designList.categorySmall">
                        <!-- :required="toRules?(JSON.stringify(toRules).indexOf('category')!=-1):false"
                                :error="categoryId?'':'请输入品类' " -->
                        <el-form
                            ref="categoryId"
                            class="create-form"
                            :model="categoryLists"
                            :rules="toRules"
                            label-width="80px"
                            :label-position="right">
                            <el-form-item class="create-form__item"
                                :required="toRules?(JSON.stringify(toRules).indexOf('categoryId')!=-1):false"
                                :class="{'is-error':!categoryId.length  && goodMustConfigCodeData.indexOf('categoryIds')>-1,'checkCodeActive':checkCodeListData.indexOf('categorySmall')>-1}"
                                label="品类" :error="categoryId.length!==3 ||(categoryId.length===3&& !categoryId[2]) && categoryErrorText?categoryErrorText:false">
                                <category-select v-if="handlePowerVisible('categoryInfo')" :disabled="!handlePowerEdit('categoryInfo')" @categorySelectChange="categorySelectChange" :options="formData.categoryList" v-model="categoryId" @success="getUnitSetting"></category-select>
                                <el-select v-else disabled placeholder="***">
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <!-- 检测品类是不是必填项 暂时只做*  :required="(JSON.stringify(toRules).indexOf('category')!=-1)" -->
                    </el-col>
                    <!-- 风格 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.styles">
                        <el-form-item class="create-form__item" prop='style' label="风格" :class="{'is-error':!attrSelect.style.length && goodMustConfigCodeData.indexOf('styles')>-1,'checkCodeActive':checkCodeListData.indexOf('styles')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('style')"
                                    :disabled="!handlePowerEdit('style')"
                                    filterable
                                    clearable
                                    ref="style"
                                    v-model="attrSelect.style"
                                    :multiple="multiple"
                                    placeholder="请选择风格">
                                <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('style','风格')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.styleList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="!designList ||　designList&&designList.designers">
                        <el-form-item class="create-form__item" prop='designer' label="设计师" :class="{'is-error':!attrSelect.designer.length && goodMustConfigCodeData.indexOf('designerIds')>-1,'checkCodeActive':checkCodeListData.indexOf('designers')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('designer')"
                                    :disabled="!handlePowerEdit('designer')"
                                    filterable
                                    clearable
                                    ref="designer"
                                    :multiple="multiple"
                                    v-model="attrSelect.designer"
                                    placeholder="请选择设计师">
                                <el-option :value="''" disabled style="cursor:pointer;" v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('designer','设计师')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.designerList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <!-- 年份 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.years">
                        <el-form-item class="create-form__item" prop="year" label="年份" :class="{'is-error':!attrSelect.year.length && goodMustConfigCodeData.indexOf('yearIds')>-1,'checkCodeActive':checkCodeListData.indexOf('years')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('year')"
                                    :disabled="!handlePowerEdit('year')"
                                    filterable
                                    clearable
                                    ref="year"
                                    :multiple="multiple"
                                    v-model="attrSelect.year"
                                    placeholder="请选择年份">
                                <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('year','年份')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.yearList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 季节 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.seasons">
                        <el-form-item class="create-form__item" prop="season" label="季节" :class="{'is-error':!attrSelect.season.length && goodMustConfigCodeData.indexOf('seasonIds')>-1,'checkCodeActive':checkCodeListData.indexOf('seasons')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('season')"
                                    :disabled="!handlePowerEdit('season')"
                                    filterable
                                    clearable
                                    ref="season"
                                    :multiple="multiple"
                                    v-model="attrSelect.season"
                                    placeholder="请选择季节">
                                <el-option :value="''" disabled style="cursor:pointer;"   v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('season','季节')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.seasonList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 波段 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.bands">
                        <el-form-item class="create-form__item" prop='wave' label="波段" :class="{'is-error':!attrSelect.wave.length && goodMustConfigCodeData.indexOf('waveIds')>-1,'checkCodeActive':checkCodeListData.indexOf('bands')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('wave')"
                                    :disabled="!handlePowerEdit('wave')"
                                    filterable
                                    clearable
                                    ref="wave"
                                    :multiple="multiple"
                                    v-model="attrSelect.wave"
                                    placeholder="请选择波段">
                                <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('wave','波段')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.waveList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-show="!designList ||　designList&&designList.months">
                        <el-form-item class="create-form__item" prop='month' label="月份" :class="{'is-error':!attrSelect.month.length && goodMustConfigCodeData.indexOf('months')>-1,'checkCodeActive':checkCodeListData.indexOf('months')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('month')"
                                    :disabled="!handlePowerEdit('month')"
                                    filterable
                                    clearable
                                    ref="month"
                                    :multiple="multiple"
                                    v-model="attrSelect.month"
                                    placeholder="请选择月份">
                                <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('month','月份')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.monthList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row class="base-border">
                    <!-- 分类 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.kinds">
                        <el-form-item class="create-form__item" prop="kind" label="分类" :class="{'is-error':!attrSelect.kind.length && goodMustConfigCodeData.indexOf('kindIds')>-1,'checkCodeActive':checkCodeListData.indexOf('kinds')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('kind')"
                                    :disabled="!handlePowerEdit('kind')"
                                    filterable
                                    clearable
                                    ref="kind"
                                    :multiple="multiple"
                                    v-model="attrSelect.kind"
                                    placeholder="请选择分类">
                                <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('kind','分类')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.kindList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 标签 -->
                    <el-col :span="6" v-show="!designList ||　designList&&designList.tags">
                        <el-form-item class="create-form__item" prop='tag' label="标签" :class="{'is-error':!attrSelect.tag.length && goodMustConfigCodeData.indexOf('tagIds')>-1,'checkCodeActive':checkCodeListData.indexOf('tags')>-1}">
                            <el-select
                                    v-if="handlePowerVisible('tag')"
                                    :disabled="!handlePowerEdit('tag')"
                                    filterable
                                    clearable
                                    ref="tag"
                                    :multiple="multiple"
                                    v-model="attrSelect.tag"
                                    placeholder="请选择标签">
                                <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                    <div class="add-attr"
                                         @click="handleAddAttr('tag','标签')">新建
                                    </div>
                                </el-option>
                                <el-option v-for="item in formData.tagList" :key="item.id" :label="item.value"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***">
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!-- 自定义属性 -->
                <el-form
                        ref="attrNewSelect"
                        :model="attrNewSelect"
                        class="create-form"
                        label-width="85px"
                        :rules="toRules">
                    <el-row style="margin-top:12px;" v-show="!designList ||　designList">
                        <el-col :span="6"  v-for="(item,index) in customList" :key="index" v-show="!designList ||　designList['field' + (index+1)]" v-if="index < 4">
                            <el-form-item class="create-form__item" :label="item.name" :prop="'field'+(index+1)+'s'" :class="{'is-error':!attrNewSelect['field'+(index+1)+'s'].length && goodMustConfigCodeData.indexOf('field'+(index+1)+'Ids')>-1,'checkCodeActive':checkCodeListData.indexOf('field'+(index+1))>-1}">
                                <el-select
                                        v-if="handlePowerVisible('field'+(index+1)+'s')"
                                        :disabled="!handlePowerEdit('field'+(index+1)+'s')"
                                        filterable
                                        clearable
                                        :ref="`'field'+${index+1}+'s'`"
                                        :multiple="multiple"
                                        v-model="attrNewSelect['field'+(index+1)+'s']"
                                        :placeholder="`请选择${item.name}`">
                                    <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                        <div class="add-attr"
                                             @click="handleAddAttr(`'field'+${index+1}+'s'`,`${item.name}`,`${item.type}`)">新建
                                        </div>
                                    </el-option>
                                    <el-option v-for="item in formData['fieldList'+(index+1)]" :key="item.id" :label="item.value"
                                               :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-else disabled placeholder="***">
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row v-show="!designList ||　designList">
                        <el-col :span="6"  v-for="(item,index) in customList" :key="index" v-show="!designList ||　designList['field' + (index+1)]"  v-if="index >= 4">
                            <el-form-item class="create-form__item" :label="item.name" :prop="'field'+(index+1)+'s'" :class="{'is-error':!attrNewSelect['field'+(index+1)+'s'].length && goodMustConfigCodeData.indexOf('field'+(index+1)+'Ids')>-1,'checkCodeActive':checkCodeListData.indexOf('field'+(index+1))>-1}">
                                <el-select
                                        v-if="handlePowerVisible('field'+(index+1)+'s')"
                                        :disabled="!handlePowerEdit('field'+(index+1)+'s')"
                                        filterable
                                        clearable
                                        :ref="`'field'+${index+1}+'s'`"
                                        :multiple="multiple"
                                        v-model="attrNewSelect['field'+(index+1)+'s']"
                                        :placeholder="`请选择${item.name}`">
                                    <el-option :value="''" disabled style="cursor:pointer;"  v-if="getFacCommonSettings">
                                        <div class="add-attr"
                                             @click="handleAddAttr(`'field'+${index+1}+'s'`,`${item.name}`,`${item.type}`)">新建
                                        </div>
                                    </el-option>
                                    <el-option v-for="item in formData['fieldList'+(index+1)]" :key="item.id" :label="item.value"
                                               :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-else disabled placeholder="***">
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>
                </el-form>

            </el-row>
        </el-form>
        <!--各种属性新建弹窗-->
        <attribute-dialog :title="title" :show.sync="dialogAdd" @success="getUnitSetting" :type="attrType"></attribute-dialog>
    </div>

</template>
<script>
    import attributeDialog from '@/components/Common/attributeDialog'
    import categorySelect from '@/components/Common/category-select-group.vue'; // 品类
    import {getFacUnitSettings,getTagName,codeRatioConfigInfo,getSizeInfoByCategoryMediumId} from '@/api'
    export default {
        props:['type','multiple','designList','attrSelect', 'attrNewSelect','categoryId','goodMustConfigCodeDataProp','toRules','categoryErrorText','styleId','designStyleId','checkCodeListDataProp','modelName','fieldRoles','facInfo'],
        /*******************
         *
         * styleId    商品档案id
         * designStyleId    设计档案id
         * modelName 模块名称对应的值（用于权限配置）
         *      ALL	全部模块
         *      GOODS_STYLE	商品档案
         *      SPL_DESIGN_STYLE	设计档案
         *      FAC_PRD_ORDER	生产订单
         *      FACTORY_MISSION	生产工单
         *      GOODS_STOCK	商品库存
         * * type    GOODS_STYLE 商品档案；DESIGN_STYLE 设计档案
         * facInfo 各属性下拉
         * ****************/
        components:{attributeDialog,categorySelect},
        data () {
            return {
                enabled:false,
                formData:{
                    fieldList1: [],
                    fieldList2: [],
                    fieldList3: [],
                    fieldList4: [],
                    fieldList5: [],
                    fieldList6: [],
                    fieldList7: [],
                    fieldList8: [],
                    categoryList: [],
                    brandList: [],
                    seasonList: [],
                    waveList: [],
                    designerList: [],
                    kindList: [],
                    yearList: [],
                    tagList: [],
                    styleList: [],
                    monthList: [],
                },
                // categoryId: [],
                attrType: null, // 自定义属性type
                customList: [], // 自定义属性tag
                getFacCommonSettings: true, // 属性新建的权限
                dialogAdd:false,
                title: '', // 新建属性的名称
                categoryLists:{
                    categoryId:[]
                }
            }
        },
        computed:{
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId(){
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            goodMustConfigCodeData(){
                if(!this.goodMustConfigCodeDataProp){
                    this.goodMustConfigCodeDataProp = []
                }
                return this.goodMustConfigCodeDataProp
            },
            checkCodeListData(){
                if(!this.checkCodeListDataProp){
                    this.checkCodeListDataProp = []
                }
                return this.checkCodeListDataProp
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
        },
        watch:{
            categoryId(val, oldVal){
                if(val){
                    this.categoryLists.categoryId = this.categoryId;
                    if (val.length == 3) {
                        this.categoryErrorText = ''
                    }
                }
            },
            facInfo: {
                handler() {
                    this.handleData(this.facInfo)
                },
                deep: true
            }
        },
        methods: {
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
            //码比配置启用，停用
            getCodeRatioConfigInfo(){
                codeRatioConfigInfo({userId:this.userId,facId:this.facId}).then(res=>{
                    if(res.data.code===0){
                        this.enabled = res.data.data.enabled
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //品类改变
            categorySelectChange(val){
                // val是上级品类改变的值
                if(!this.enabled || !val[1]) return;   //没有配置码比和没选中分类时候不做改变
                // GOODS_STYLE 商品档案；DESIGN_STYLE 设计档案
                let obj = {
                    styleId:this.type === 'GOODS_STYLE'?this.styleId:this.designStyleId,
                    userId:this.userId,
                    type:this.type,
                    attrId:val[1]
                }
                getSizeInfoByCategoryMediumId(obj).then(res=>{
                    if(res.data.code===0){
                        if(res.data.data && res.data.data.length){
                            let sizeArr = res.data.data.map(item=>item.id)

                            this.$message.success('尺码已更新为中分类的对应尺码');
                            this.$emit('sizeChangeByCategory',sizeArr)
                        }

                    }else {
                        this.$message.error(res.data.msg)
                    }
                })

            },
            //新建时隐藏下拉列表
            handleAddAttr(refName, title, attrType){
                this.dialogAdd = true;
                console.log(this.dialogAdd)
                this.title = title;
                if(attrType){
                    this.attrType = attrType;
                    this.$refs[refName][0].handleClose();
                }else {
                    this.$refs[refName].handleClose();
                }
            },
            // 获取自定义属性名称
            getTagName() {
                let params = {
                    bossUnitId: this.bossUnitId
                }
                getTagName(params).then(res => {
                    let data = res.data.goodsFields
                    data.forEach(i => {
                        if(i.type ==14 || i.type ==15 || i.type ==16 || i.type ==17 || i.type ==18 || i.type == 27 || i.type == 28 || i.type == 29) {
                            this.customList.push(i)
                        }
                    })
                })
            },
            handleData(data) {
                this.formData.brandList = data.brand;
                this.formData.designerList = data.designer;
                this.formData.kindList = data.kind;
                this.formData.tagList = data.tag;
                this.formData.styleList = data.style;
                this.formData.yearList = data.year;
                this.formData.monthList = data.month;
                this.formData.seasonList = data.season;
                this.formData.waveList = data.wave;
                this.formData.categoryList = data.category;
                this.formData.fieldList1 = data.field1;
                this.formData.fieldList2 = data.field2;
                this.formData.fieldList3 = data.field3;
                this.formData.fieldList4 = data.field4;
                this.formData.fieldList5 = data.field5;
                this.formData.fieldList6 = data.field6;
                this.formData.fieldList7 = data.field7;
                this.formData.fieldList8 = data.field8;
            },
            //获取属性下拉框列表
            getUnitSetting(id,firstParent,twoParent) {
                let params = {
                    facId: this.facId,
                    type: 'all',
                    styleId: this.styleId,
                    designStyleId: this.designStyleId,
                    userId: this.userId,
                    modelName: this.modelName,
                }
                getFacUnitSettings(params).then(res => {
                    this.handleData(res.data.data)
                    if (id) {
                        if (this.title == '品牌') {
                            if(this.multiple) {
                                this.attrSelect.brand.push(id)
                            } else {
                                // 单选
                                this.attrSelect.brand = id
                            }
                        } else if (this.title == '设计师') {
                            if(this.multiple) {
                                this.attrSelect.designer.push(id)
                            } else {
                                // 单选
                                this.attrSelect.designer = id
                            }
                        } else if (this.title == '分类') {
                            if(this.multiple) {
                                this.attrSelect.kind.push(id)
                            } else {
                                // 单选
                                this.attrSelect.kind = id
                            }
                        } else if (this.title == '风格') {
                            if(this.multiple) {
                                this.attrSelect.style.push(id)
                            } else {
                                // 单选
                                this.attrSelect.style = id
                            }
                        } else if (this.title == '标签') {
                            if(this.multiple) {
                                this.attrSelect.tag.push(id)
                            } else {
                                // 单选
                                this.attrSelect.tag = id
                            }
                        }else if (this.title == '年份') {
                            if(this.multiple) {
                                this.attrSelect.year.push(id)
                            } else {
                                // 单选
                                this.attrSelect.year = id
                            }
                        } else if (this.title == '季节') {
                            if(this.multiple) {
                                this.attrSelect.season.push(id)
                            } else {
                                // 单选
                                this.attrSelect.season = id
                            }
                        } else if (this.title == '月份') {
                            if(this.multiple) {
                                this.attrSelect.month.push(id)
                            } else {
                                // 单选
                                this.attrSelect.month = id
                            }
                        }  else if (this.title == '波段') {
                            if(this.multiple) {
                                this.attrSelect.wave.push(id)
                            } else {
                                // 单选
                                this.attrSelect.wave = id
                            }
                        }  else if (this.attrType == 14) {
                            if(this.multiple) {
                                this.attrNewSelect.field1s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field1s = id
                            }
                        } else if (this.attrType == 15) {
                            if(this.multiple) {
                                this.attrNewSelect.field2s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field2s = id
                            }
                        } else if (this.attrType == 16) {
                            if(this.multiple) {
                                this.attrNewSelect.field3s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field3s = id
                            }
                        } else if (this.attrType == 17) {
                            if(this.multiple) {
                                this.attrNewSelect.field4s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field4s = id
                            }
                        } else if (this.attrType == 18) {
                            if(this.multiple) {
                                this.attrNewSelect.field5s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field5s = id
                            }
                        }  else if (this.attrType == 27) {
                            if(this.multiple) {
                                this.attrNewSelect.field6s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field6s = id
                            }
                        }  else if (this.attrType == 28) {
                            if(this.multiple) {
                                this.attrNewSelect.field7s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field7s = id
                            }
                        }  else if (this.attrType == 29) {
                            if(this.multiple) {
                                this.attrNewSelect.field8s.push(id)
                            } else {
                                // 单选
                                this.attrNewSelect.field8s = id
                            }
                        } else {
                            if (firstParent&&twoParent) {
                                this.categoryId = [firstParent,twoParent,id]
                            } else if (firstParent) {
                                this.categoryId = [firstParent,id]
                            } else {
                                this.categoryId = [id]
                            }
                        }
                        this.title = ''
                        this.attrType = null
                    }
                })
            },
        },
        updated () {
            this.$emit('attrData',this.attrSelect, this.attrNewSelect, this.categoryId);
        },
        async created() {
            this.getCodeRatioConfigInfo()


            // console.log('看看当前拿到对的规则',this.toRules);

            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            await this.getTagName()
            // this.getUnitSetting()
        }
    }
</script>
<style scoped>
    .base-border{
        border-bottom: 1px solid #E6EAF0;
    }
    .add-attr{
        color:#FFA914 !important;
    }
</style>
