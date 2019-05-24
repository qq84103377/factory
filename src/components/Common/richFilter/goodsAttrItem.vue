<template>
        <el-form class="goods-attr-item"  label-width="90px">

            <el-form-item label="品牌">
                {{selected}}
                <el-select v-model="form.brand"
                           filterable
                           multiple
                           @change="selectChange(form.brand,'brand')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in brandList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="品类">
                <category-select @change="selectChange" v-model="category" modelName="GOODS_STYLE"></category-select>
                <!--<category-select @categorySelectChange="selectChange" :options="categoryList" v-model="category"  :isAdd="false"></category-select>-->
            </el-form-item>

            <el-form-item label="设计师">
                <el-select v-model="form.designer"
                           filterable
                           multiple
                           @change="selectChange(form.designer,'designer')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in designerList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="年份">
                <el-select v-model="form.year"
                           filterable
                           multiple
                           @change="selectChange(form.year,'year')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in yearList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="月份">
                <el-select v-model="form.month"
                           filterable
                           multiple
                           @change="selectChange(form.month,'month')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in monthList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="季节">
                <el-select v-model="form.season"
                           filterable
                           multiple
                           @change="selectChange(form.season,'season')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in seasonList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分类">
                <el-select v-model="form.kind"
                           filterable
                           multiple
                           @change="selectChange(form.kind,'kind')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in kindList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="标签">
                <el-select v-model="form.tag"
                           filterable
                           multiple
                           @change="selectChange(form.tag,'tag')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in tagList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="风格">
                <el-select v-model="form.style"
                           filterable
                           multiple
                           @change="selectChange(form.style,'style')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in styleList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="波段">
                <el-select v-model="form.wave"
                           filterable
                           multiple
                           @change="selectChange(form.wave,'wave')"
                           placeholder="全部" >
                    <el-option
                            v-for="item in waveList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-for="(item,index) in customList" :key="index" :label="item.name">
                    <el-select v-model="form.field1"
                               v-if="item.type == 14"
                               filterable
                               multiple
                               @change="selectChange(form.field1,'field1')"
                               placeholder="全部" >
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
                                v-for="item in fieldList8"
                                :key="item.id"
                                :label="item.value"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
        </el-form>
</template>
<script>
    // import categorySelect from '@/components/Common/category-select-group.vue'; // 品类
    import {getFacUnitSettings,getTagName} from "@/api"
    import TemplateConfig from "../../print/template-config/template-config";
    export default {
        props: ['isReset','modelName'],
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
         * ****************/
        components: {
            TemplateConfig,
        },
        data () {
            return {
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
                category: {},
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
            reset(){
                this.form = JSON.parse(JSON.stringify(this.formBack))
                this.category = {};
                this.developerIds=[];
            },
            // 选择全部时候的操作
            selectChange(item,type) {
                let arr = Object.keys(this.form).reduce((arr, key) => {
                    if (this.form[key].length) {
                        arr.push(this.form[key]);
                    }
                    return arr;
                }, []);
                let selectedObject = {
                    attrIds:arr,
                    category:this.category,
                }
                this.$emit('input', selectedObject)

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
    .goods-attr-item{
        width: 100%;
    }
</style>
<style lang="scss">
    .goods-attr-item{
        margin-top: 0 !important;
        .el-form-item{
            margin-bottom: 12px;
            .el-select,.category-select{
                width: 100%;
            }

        }
    }
</style>
