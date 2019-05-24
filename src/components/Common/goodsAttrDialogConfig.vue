<template>
    <div class="goods-attr-dialog">
        <el-dialog
                class="custom-dialog check-detail-dialog"
                title="配置数据权限"
                size="small"
                :modal-append-to-body="false"
                :visible.sync="isShow"
                @close="handleClose">
            <div class="content">
                <div class="left-area">
                    <div class="module-select">
                        <el-radio-group v-model="parentRadio"  @change="parentModelChange(parentRadio)">
                            <el-radio class="radio" label="0" :disabled="!isCanAllConfig">全部</el-radio>
                            <el-radio class="radio" label="1" :disabled="!isCanSplitConfig">分模块配置</el-radio>
                        </el-radio-group>
                    </div>
                    <div class="radio-group">
                        <div class="title">模块</div>
                        <el-radio-group v-model="childRadio" @change="childModelChange(childRadio)">
                            <el-radio-button v-for="(item, index) in moduleArr" :key="index" :disabled="parentRadio === '0'" :label="item.modelType">{{item.modelName}}</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="right-area">
                    <el-form :model="form" label-width="110px">
                        <el-row class="form-base">
                            <el-col :span="12">
                                <el-form-item label="品牌">
                                    <el-select v-model="form.brand"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.brand)"
                                               @change="selectChange(form.brand,'brand',brandList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in brandList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.brand, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="品类">
                                    <category-select style="width: 100%;"  @change="categoryChange" v-model="category"></category-select>

                                    <!--<category-cascader-->
                                            <!--:options="categoryList"-->
                                            <!--:category.sync="category"-->
                                            <!--@categoryChange="categoryChange">-->
                                    <!--</category-cascader>-->
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="设计师">
                                    <el-select v-model="form.designer"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.designer)"
                                               @change="selectChange(form.designer,'designer',designerList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in designerList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.designer, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="年份">
                                    <el-select v-model="form.year"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.year)"
                                               @change="selectChange(form.year,'year',yearList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in yearList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.year, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="月份">
                                    <el-select v-model="form.month"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.month)"
                                               @change="selectChange(form.month,'month',monthList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in monthList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.month, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="季节">
                                    <el-select v-model="form.season"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.season)"
                                               @change="selectChange(form.season,'season',seasonList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in seasonList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.season, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="分类">
                                    <el-select v-model="form.kind"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.kind)"
                                               @change="selectChange(form.kind,'kind',kindList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in kindList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.kind, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="标签">
                                    <el-select v-model="form.tag"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.tag)"
                                               @change="selectChange(form.tag,'tag',tagList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in tagList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.tag, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="风格">
                                    <el-select v-model="form.style"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.style)"
                                               @change="selectChange(form.style,'style',styleList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in styleList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.style, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="波段">
                                    <el-select v-model="form.wave"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.wave)"
                                               @change="selectChange(form.wave,'wave',waveList)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in waveList"
                                                :key="item.id"
                                                :disabled="isDisabled(form.wave, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="margin-top:20px;">
                            <el-col :span="12" v-for="(item,index) in customList" :key="index">
                                <el-form-item :label="item.name">
                                    <el-select v-model="form.field1"
                                               v-if="item.type == 14"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field1)"
                                               @change="selectChange(form.field1,'field1',fieldList1)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList1"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field1, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field2"
                                               v-if="item.type == 15"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field2)"
                                               @change="selectChange(form.field2,'field2',fieldList2)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList2"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field2, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field3"
                                               v-if="item.type == 16"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field3)"
                                               @change="selectChange(form.field3,'field3',fieldList3)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList3"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field3, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field4"
                                               v-if="item.type == 17"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field4)"
                                               @change="selectChange(form.field4,'field4',fieldList4)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList4"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field4, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field5"
                                               v-if="item.type == 18"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field5)"
                                               @change="selectChange(form.field5,'field5',fieldList5)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList5"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field5, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field6"
                                               v-if="item.type == 27"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field6)"
                                               @change="selectChange(form.field6,'field6',fieldList6)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList6"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field6, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field7"
                                               v-if="item.type == 28"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field7)"
                                               @change="selectChange(form.field7,'field7',fieldList7)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList7"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field7, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="form.field8"
                                               v-if="item.type == 29"
                                               filterable
                                               multiple
                                               @remove-tag="removeTag($event, form.field8)"
                                               @change="selectChange(form.field8,'field8',fieldList8)"
                                               placeholder="全部" >
                                        <el-option
                                                key="all"
                                                label="全部"
                                                value="all">
                                        </el-option>
                                        <el-option
                                                v-for="item in fieldList8"
                                                :key="item.id"
                                                :disabled="isDisabled(form.field8, item)"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="cancel" style="margin-right: 30px">取 消</nf-button>
                <nf-button
                        :disabled="commitStatus"
                        :loading="loading"
                        type="warning"
                        @click="confirm">确 定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import categoryCascader from '@/components/Common/category-cascader.vue'; // 品类
    import {
        getTagName,
        updateGoodsAttrConfigInfo,
        removeGoodsAttr,
        removeCategoryAttr,
    } from "@/api"
    export default {
        props: ['isReset','isShow','factoryGroupId','goodsAttrConfigInfo'],
        /********
         *
         * isReset  重置
         * isShow   显示弹窗
         * factoryGroupId   权限分组id
         * goodsAttrConfigInfo  弹窗全部数据
         *
         *
         * *******/
        components: {
            categoryCascader,
        },
        data () {
            return {
                formBack: {},
                form: {},
                copyForm: {
                    brand: [],
                    designer: [],
                    kind: [],
                    tag: [],
                    style: [],
                    year: [],
                    month: [],
                    season: [],
                    wave: [],
                    field1: [],
                    field2: [],
                    field3: [],
                    field4: [],
                    field5: [],
                    field6: [],
                    field7: [],
                    field8: [],
                },
                category: {
                    big:[],
                    middle:[],
                    small:[],
                },
                brandList: [],
                designerList: [],
                kindList: [],
                tagList: [],
                styleList: [],
                yearList: [],
                monthList: [],
                seasonList: [],
                waveList: [],
                // categoryList: [],
                fieldList1: [],
                fieldList2: [],
                fieldList3: [],
                fieldList4: [],
                fieldList5: [],
                fieldList6: [],
                fieldList7: [],
                fieldList8: [],
                customList:[],
                parentRadio: '0',   //0全部，1分模块
                childRadio: '',
                moduleArr: [],      //模块名
                allModuleData:[],   //所有模块数据集合
                prevModelType: 0,   //记录上一次所选的模块id
                modelType: 0,
                goodsAttrConfigIdList:[],   //所有模块的下拉已选数据集合
                loading: false,
                isCanAllConfig: true,    // 是否可以按全部模块配置
                isCanSplitConfig: true,     // 是否可以按分模块配置
                backupCategory:[]
            }
        },
        watch: {
            'isReset'(val){
                if(val) {
                    this.form = JSON.parse(JSON.stringify(this.formBack));
                    this.category = {
                        big:[],
                        middle:[],
                        small:[],
                    }
                }
            },
            isShow(){
                if(this.isShow){
                    this.parentRadio = '0';
                    this.prevModelType = 0;
                    this.modelType = 0;
                    this.form = JSON.parse(JSON.stringify(this.copyForm));
                    this.category ={ big:[],
                        middle:[],
                        small:[],
                    };
                    this.getUnitSetting();
                }
            },
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            commitStatus(){
                //全部模块不可选且没有选“分模块配置”时禁用确定按钮
                if(this.parentRadio ==='0' && !this.isCanAllConfig){
                    return true;
                }else{
                    return false;
                }
            },
        },
        methods: {
            //"品类"是否可以删除
            categoryChange(newValue, oldValue){
                if(!oldValue)
                    return
                console.log(newValue,oldValue)
                if(JSON.stringify(this.backupCategory) === JSON.stringify(newValue) ||JSON.stringify(newValue) ==JSON.stringify(oldValue))
                    return
                let params = {
                    factoryGroupId: this.factoryGroupId,
                    category: newValue,
                    modelType: this.modelType
                };
                removeCategoryAttr(params).then(res => {
                    if (res.data.code === 1) {
                        //已被下级分组引用时，要把值还原回去
                        this.category = oldValue;
                        this.backupCategory = oldValue
                        this.$message.error(res.data.msg);
                    }
                });
            },

            //处理品类下拉数据格式
            // getCateforyOptions(data){
            //     //替换属性
            //     data = JSON.parse(JSON.stringify(data).replace(/id/g,"value"));
            //     data = JSON.parse(JSON.stringify(data).replace(/name/g,"label"));
            //     data = JSON.parse(JSON.stringify(data).replace(/childAttrs/g,"children"));
            //     data = JSON.parse(JSON.stringify(data).replace(/\,\"children\"\:\[\]/g, ''));
            //     this.categoryList = data;
            // },

            //下拉数据“不可取消”状态
            isDisabled(arr, obj){
                let flag = false;
                if(arr.length){
                    flag = arr.some(item=>{
                        return item === obj.id && obj.removeTag !== 0
                    });
                }
                return flag
            },

            // removeTag删除
            removeTag(event, arr) {
                let params = {
                    factoryGroupId: this.factoryGroupId,
                    attrId: event.currentValue,
                    modelType: this.modelType
                };
                removeGoodsAttr(params).then(res => {
                    if (res.data.code === 1) {
                        //通过removeTag删除时，要把值还原回去
                        arr.push(event.currentValue);
                        this.$message.error(res.data.msg);
                    }
                });
            },

            //按“全部模块”或“分模块配置”
            parentModelChange(val){
                //切换“分模块配置”时，选择第一个模块
                if(val === '1'){
                    this.childRadio = this.moduleArr[0].modelType;
                    this.childModelChange(1);
                    return;
                }
                this.prevModelType = this.modelType;
                if(this.prevModelType !== 0){
                    //将上个模块的修改保存起来
                    this.saveModelData(this.prevModelType);
                }
                let index = parseInt(val);
                this.modelType = index;
                this.findModuleSelect(index);
                this.findModukeSelectVal(index);
            },

            //子模块切换
            childModelChange(val){
                //避免分模块配置的第一项重复触发
                if(val === this.modelType){
                    return
                }
                //将上个模块的修改保存起来
                this.prevModelType = this.modelType;
                this.saveModelData(this.prevModelType);
                let index = parseInt(val);
                this.modelType = index;
                this.findModuleSelect(index);
                this.findModukeSelectVal(index);
            },
            //保存对应模块的“属性”和“品类”修改
            saveModelData(index){
                this.goodsAttrConfigIdList[index].attrIds = {...this.form};
                this.goodsAttrConfigIdList[index].category=this.category
            },

            handleClose(){
                this.$emit("update:isShow", false);
            },
            // 取消
            cancel() {
                this.getGoodsAttrConfigIdList();
                this.$emit("update:isShow", false);
            },
            // 确定时保存数据
            confirm() {
                this.loading = true;
                let params = {
                    facId: this.facId,
                    userId: this.userId,
                    factoryGroupId: this.factoryGroupId
                };
                //全部模块
                if(this.modelType === 0){
                    this.saveModelData(0);
                    let arr = [];
                    arr = this.goodsAttrConfigIdList.splice(0, 1);
                    params.goodsAttrConfigIdList = arr;
                }
                //选择分模块配置时，需要把各个模块的值传给后台
                else{
                    this.saveModelData(this.modelType);
                    let arr = [];
                    arr = this.goodsAttrConfigIdList.splice(1, this.goodsAttrConfigIdList.length);
                    params.goodsAttrConfigIdList = arr;
                }
                updateGoodsAttrConfigInfo(params).then(res => {
                    this.loading = false;
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg);
                        this.$emit("update:isShow", false);
                        this.isReset = false
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 选择全部时候的操作
            selectChange(item,type,list){
                if(item.length > 1 && item.includes('all')){
                    //第一个值是“所有”，后面再选值时需要把“所有”删除
                    if(item[0] === 'all'){
                        item.splice(0,1);
                    }
                    //第一个选了其他值，那最后一个肯定是‘all’,此时只需要把其他值删除
                    else{
                        item = ['all'];
                    }
                    this.form[type] = item;
                }

                //当选择了一个非“全部”值时，需要勾选下级已选值（避免通过选“全部”再选其他值，绕过下拉是否可以选验证的bug）
                if(item.length && item.length === 1 && item[0] !== 'all'){
                    let selectedArr = [];
                    list.forEach(val =>{
                        if(val.removeTag !== 0){
                            selectedArr.push(val.id);
                        }
                    });
                    if(selectedArr.length){
                        let arr = [...item]
                        arr=arr.concat(selectedArr)
                        //去重
                        arr = Array.from(new Set(arr));
                        //如果下拉框选中的值item  和 arr一样的话，不要给this.form[type]赋值，防止change事件重复触发
                        if([...item].toString()!=arr.toString()){
                            this.form[type] = arr;
                        }
                    }
                }
            },
            getUnitSetting() {
                this.moduleArr = this.goodsAttrConfigInfo.ConfigModelList; //获取模块列表
                this.allModuleData = this.goodsAttrConfigInfo.factoryGroupGoodsAttrConfigList;     //所有模块数据
                this.isCanAllConfig = this.goodsAttrConfigInfo.isCanAllConfig;
                this.isCanSplitConfig = this.goodsAttrConfigInfo.isCanSplitConfig;
                this.getGoodsAttrConfigIdList();
                //获取“全部”模块的所有商品属性下拉和已选
                this.findModuleSelect(0);
                this.findModukeSelectVal(0);
            },
            //获取所有模块“已选”属性集合
            getGoodsAttrConfigIdList(){
                if(this.allModuleData.length){
                    this.goodsAttrConfigIdList = [];
                    this.allModuleData.forEach(item => {
                        let arr = {};
                        arr.modelType = item.modelType;     //模板id
                        arr.category = item.categoryDTO;    //品类
                        arr.attrIds = {};                   //属性集合
                        arr.attrIds.brand = item.selectBrand;
                        arr.attrIds.designer = item.selectDesigner;
                        arr.attrIds.kind = item.selectKind;
                        arr.attrIds.tag = item.selectTag;
                        arr.attrIds.style = item.selectStyle;
                        arr.attrIds.year = item.selectYear;
                        arr.attrIds.month = item.selectMonth;
                        arr.attrIds.season = item.selectSeason;
                        arr.attrIds.wave = item.selectWave;
                        arr.attrIds.field1 = item.selectField1;
                        arr.attrIds.field2 = item.selectField2;
                        arr.attrIds.field3 = item.selectField3;
                        arr.attrIds.field4 = item.selectField4;
                        arr.attrIds.field5 = item.selectField5;
                        arr.attrIds.field6 = item.selectField6;
                        arr.attrIds.field7 = item.selectField7;
                        arr.attrIds.field8 = item.selectField8;
                        this.goodsAttrConfigIdList.push(arr);
                    });
                }
            },

            //查找模块对应的下拉数据的值
            findModuleSelect(index){
                let data = this.allModuleData[index];
                this.brandList = data.brand;
                this.designerList = data.designer;
                this.kindList = data.kind;
                this.tagList = data.tag;
                this.styleList = data.style;
                this.yearList = data.year;
                this.monthList = data.month;
                this.seasonList = data.season;
                this.waveList = data.wave;
                this.fieldList1 = data.field1;
                this.fieldList2 = data.field2;
                this.fieldList3 = data.field3;
                this.fieldList4 = data.field4;
                this.fieldList5 = data.field5;
                this.fieldList6 = data.field6;
                this.fieldList7 = data.field7;
                this.fieldList8 = data.field8;
                // this.getCateforyOptions(data.category);
            },
            //配置数据权限默认选中的值
            findModukeSelectVal(index){
                let data = this.goodsAttrConfigIdList[index].attrIds;
                this.category = this.goodsAttrConfigIdList[index].category;  //品类
                this.form.brand = data.brand;
                this.form.designer = data.designer;
                this.form.kind = data.kind;
                this.form.tag = data.tag;
                this.form.style = data.style;
                this.form.year = data.year;
                this.form.month = data.month;
                this.form.season = data.season;
                this.form.wave = data.wave;
                this.form.field1 = data.field1;
                this.form.field2 = data.field2;
                this.form.field3 = data.field3;
                this.form.field4 = data.field4;
                this.form.field5 = data.field5;
                this.form.field6 = data.field6;
                this.form.field7 = data.field7;
                this.form.field8 = data.field8;
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
        },
        created(){
            this.formBack = JSON.parse(JSON.stringify(this.form));
            this.getTagName()
        }
    }
</script>
<style lang="scss" scoped>
    .goods-attr-dialog{
        .content{
            overflow: hidden;
            .left-area{
                width: 160px;
                height: 100%;
                float: left;
                .module-select{
                    line-height: 32px;
                }
                .radio-group{
                    height: 450px;
                    border: 1px solid #DFE6EC;
                    .title{
                        line-height: 30px;
                        padding: 0 15px;
                        font-weight: bold;
                        background-color: #EBEFF5;
                        border-bottom: 1px solid #DFE6EC;
                    }
                }
            }
            .right-area{
                float: left;
                width: 590px;
                margin-left: 25px;
            }
        }
        .form-base{
            padding-bottom: 10px;border-bottom:1px solid #DFE6EC;
        }
    }
</style>
<style lang="scss">
    .goods-attr-dialog{
        .el-dialog{
            width: 825px;
            .el-dialog__body{
                padding: 25px;
            }
        }
        .el-form-item{
            margin-bottom: 15px;
        }
        .el-form-item__label{
            float:left !important;
        }
        .el-form-item__content{
            display:flex !important;
        }
        .el-form-item__content{
            >div{
                width:100% !important;
            }
        }
        .custom-filter-form .el-form-item{
            width:100% !important;
        }
        .el-radio__label{
            font-size: 12px;
        }
        .el-radio-button__inner{
            text-align: left;
            border: none;
            border-bottom: 1px solid #DFE6EC;
        }
        .el-radio-button, .el-radio-button__inner{
            width: 100%;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner{
            box-shadow: none;
            color: #3B3B3B;
            background-color: #F5F7FA;
            border-color: #DFE6EC;
        }
        .el-radio-button:first-child .el-radio-button__inner{
            border-left:none;
            border-radius: 0px;
        }
        .el-radio-button:last-child .el-radio-button__inner{
            border-radius: 0px;
        }
        .el-radio-button__orig-radio:disabled + .el-radio-button__inner{
            box-shadow: none;
            color: #3B3B3B;
            background-color: #F5F7FA;
            border-color: #DFE6EC;
        }
    }
</style>
