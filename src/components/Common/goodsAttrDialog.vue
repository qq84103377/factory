<template>
    <div class="goods-attr-dialog">
        <el-input v-model="value" placeholder="全部" @focus="getDialogShow" icon="caret-bottom"></el-input>
        <el-dialog :modal-append-to-body="false" class="custom-dialog check-detail-dialog" title="商品属性筛选"
                   :visible.sync="selectDialoVisible" size="small">
            <el-form :model="form" label-width="110px">
                <el-row class="form-base">
                    <el-col :span="12">
                        <el-form-item label="品牌">
                            <el-select v-model="form.brand"
                                       filterable
                                       multiple
                                       @change="selectChange(form.brand,'brand')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in brandList"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品类">
                            <category-select :options="categoryList" v-model="category" @success="getUnitSetting" :isAdd="false"></category-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设计师">
                            <el-select v-model="form.designer"
                                       filterable
                                       multiple
                                       @change="selectChange(form.designer,'designer')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in designerList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.year,'year')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in yearList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.month,'month')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in monthList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.season,'season')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in seasonList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.kind,'kind')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in kindList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.tag,'tag')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in tagList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.style,'style')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in styleList"
                                        :key="item.id"
                                        :label="item.value"
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
                                       @change="selectChange(form.wave,'wave')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in waveList"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isShowdevelop" >
                        <el-form-item label="开发者">
                            <workerLeader :isRemote='true'  v-model="developerIds" placeholder="请选择"></workerLeader>
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
                                       @change="selectChange(form.field1,'field1')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList1"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field2"
                                       v-if="item.type == 15"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field2,'field2')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList2"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field3"
                                       v-if="item.type == 16"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field3,'field3')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList3"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field4"
                                       v-if="item.type == 17"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field4,'field4')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList4"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field5"
                                       v-if="item.type == 18"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field5,'field5')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList5"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field6"
                                       v-if="item.type == 27"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field6,'field6')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList6"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field7"
                                       v-if="item.type == 28"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field7,'field7')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList7"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            <el-select v-model="form.field8"
                                       v-if="item.type == 29"
                                       filterable
                                       multiple
                                       @change="selectChange(form.field8,'field8')"
                                       placeholder="全部" >
                                <el-option
                                        key="all"
                                        label="全部"
                                        value="all">
                                </el-option>
                                <el-option
                                        v-for="item in fieldList8"
                                        :key="item.id"
                                        :label="item.value"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="confirm">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import categorySelect from '@/components/Common/category-select-group.vue'; // 品类
    import {getFacUnitSettings,getTagName} from "@/api"
    export default {
        props: ['isReset','isShowdevelop','modelName'],
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
        components: {categorySelect},
        data () {
            return {
                selectDialoVisible:false,
                value:'',
                formBack: {},
                form: {
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
                category: [],
                developerIds:[],//开发者
                brandList: [],
                designerList: [],
                kindList: [],
                tagList: [],
                styleList: [],
                yearList: [],
                monthList: [],
                seasonList: [],
                waveList: [],
                categoryList: [],
                fieldList1: [],
                fieldList2: [],
                fieldList3: [],
                fieldList4: [],
                fieldList5: [],
                fieldList6: [],
                fieldList7: [],
                fieldList8: [],
                customList:[]
            }
        },
        watch: {
            isReset(val){
                if(val) {
                    console.log(this.formBack)
                    this.form = JSON.parse(JSON.stringify(this.formBack))
                    this.category = [];
                    this.developerIds=[];
                    this.value = ''
                }
            }
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            // 取消
            cancel() {
                this.selectDialoVisible = false
                // this.form = JSON.parse(JSON.stringify(this.formBack))
                // this.category = []
                // this.value = ''
            },
            // 确定时保存数据
            confirm() {
                let arr = Object.keys(this.form).reduce((arr, key) => {
                    if (this.form[key].length&&this.form[key][0] != 'all') {
                        arr.push(this.form[key]);
                    }
                    return arr;
                }, []);
               this.$emit('confirm', arr, this.category,this.developerIds)//添加开发者id数组
                let flag = Object.keys(this.form).some(key => {
                    return this.form[key].length;
                });
                this.value = flag ? '已选择' : (this.category.length > 0||this.developerIds.length > 0 ? '已选择': '');
                this.selectDialoVisible = false
                this.isReset = false
            },
            // 选择全部时候的操作
            selectChange(item,type) {
                let arr ;
                switch(type) {
                    case 'brand':
                        arr = this.form.brand
                        break;
                    case 'designer':
                        arr = this.form.designer
                        break;
                    case 'kind':
                        arr = this.form.kind
                        break;
                    case 'tag':
                        arr = this.form.tag
                        break;
                    case 'style':
                        arr = this.form.style
                        break;
                    case 'year':
                        arr = this.form.year
                        break;
                    case 'month':
                        arr = this.form.month
                        break;
                    case 'season':
                        arr = this.form.season
                        break;
                    case 'wave':
                        arr = this.form.wave
                        break;
                    case 'field1':
                        arr = this.form.field1
                        break;
                    case 'field2':
                        arr = this.form.field2
                        break;
                    case 'field3':
                        arr = this.form.field3
                        break;
                    case 'field4':
                        arr = this.form.field4
                        break;
                    case 'field5':
                        arr = this.form.field5
                        break;
                    case 'field6':
                        arr = this.form.field6
                        break;
                    case 'field7':
                        arr = this.form.field7
                        break;
                    case 'field8':
                        arr = this.form.field8
                        break;
                }
                if (item.length > 1 && arr[0] == "all") {
                    for (let i = 0; i < item.length; i++) {
                        if (item[i] == "all") {
                            item.splice(i, 1);
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j] == "all") {
                                    arr.splice(j, 1);
                                }
                            }
                        }
                    }
                    return;
                }
                for (let i = 0; i < item.length; i++) {
                    if (item[i] == "all") {
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j] != "all") {
                                arr.splice(j, 1);
                            }
                        }
                    }
                }
            },
            // 弹窗显示
            getDialogShow() {
                this.selectDialoVisible = true
            },
            // 获取属性下拉列表
            getUnitSetting() {
                let params = {
                    facId: this.facId,
                    type: 'goodsAttrs',
                    userId: this.userId,
                    modelName: this.modelName,
                }
                getFacUnitSettings(params).then(res => {
                    this.brandList = res.data.data.brand
                    this.designerList = res.data.data.designer
                    this.kindList = res.data.data.kind
                    this.tagList = res.data.data.tag
                    this.styleList = res.data.data.style
                    this.yearList = res.data.data.year
                    this.monthList = res.data.data.month
                    this.seasonList = res.data.data.season
                    this.waveList = res.data.data.wave
                    this.categoryList = res.data.data.category
                    this.fieldList1 = res.data.data.field1
                    this.fieldList2 = res.data.data.field2
                    this.fieldList3 = res.data.data.field3
                    this.fieldList4 = res.data.data.field4
                    this.fieldList5 = res.data.data.field5
                    this.fieldList6 = res.data.data.field6
                    this.fieldList7 = res.data.data.field7
                    this.fieldList8 = res.data.data.field8
                })
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
            this.formBack = JSON.parse(JSON.stringify(this.form))
            this.getUnitSetting()
            this.getTagName()
        }
    }
</script>
<style lang="scss" scoped>
    .goods-attr-dialog{
        .form-base{
            padding-bottom: 10px;border-bottom:1px solid #DFE6EC;
        }
    }
</style>
<style lang="scss">
    .goods-attr-dialog{
        .el-dialog{
            width: 800px;
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
    }

</style>