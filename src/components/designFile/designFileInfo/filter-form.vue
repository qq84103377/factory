<template>
    <div class="custom-filter-form box-shadow clearfix">
        <el-form :model="form" status-icon ref="ruleForm2" label-width="100px"
                 style="margin-left:-40px;position: relative;overflow: hidden;">
            <div class="clearfix">

                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="设计档案">
                        <rich-filter v-model="richFilterParams"
                                     dialogType='DESIGN_STYLE'
                                     placeholder="点击可筛选档案"
                                     modelName="SPL_DESIGN_STYLE"></rich-filter>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="设计款号">
                        <el-select
                                v-model="filterFormData.styleIds"
                                remote
                                reserve-keyword
                                filterable
                                multiple
                                :remote-method="getStylesName"
                                clearable
                                placeholder="请选择或搜索">
                            <el-option v-for="item in options.styleNos" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6" style="margin-right: 10px;">
                    <el-form-item label="商品款号">
                        <design-goods-select v-model="filterFormData.goodsStyleIds" :multiple="true"
                                             modelName="SPL_DESIGN_STYLE"></design-goods-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="档案状态">
                        <filter-check-group multiple v-model="filterFormData.styleStatus">
                            <filter-check-item
                                    v-for="item in options.status"
                                    :options="options.status"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.styleStatus"-->
                        <!--filterable-->
                        <!--multiple-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.status" :key="item.value" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>

                <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<el-form-item label="创建日期">-->
                <!--<el-date-picker-->
                <!--@change="orderDateChange"-->
                <!--v-model="orderDateRange"-->
                <!--type="daterange"-->
                <!--placeholder="请选择日期范围">-->
                <!--</el-date-picker>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<el-form-item label="创建人">-->
                <!--<workerLeader  v-model="filterFormData.creatorIds" placeholder="请选择创建人"></workerLeader>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<el-form-item label="版师">-->
                <!--<workerLeader  v-model="filterFormData.sampleMachinistIds" placeholder="请选择版师"></workerLeader>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="打版状态">
                        <filter-check-group v-model="filterFormData.existAttachmentFile">
                            <filter-check-item
                                    v-for="item in options.existAttachmentFile"
                                    :options="options.existAttachmentFile"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.existAttachmentFile"-->
                        <!--filterable-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.existAttachmentFile" :key="item.label" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<el-form-item label="样衣师">-->
                <!--<workerLeader  v-model="filterFormData.sampleDesignerIds" placeholder="请选择样衣师"></workerLeader>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="样衣状态">
                        <filter-check-group v-model="filterFormData.existSample">
                            <filter-check-item
                                    v-for="item in options.existSample"
                                    :options="options.existSample"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.existSample"-->
                        <!--filterable-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.existSample" :key="item.label" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<el-form-item label="商品属性">-->
                <!--<goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset" modelName="SPL_DESIGN_STYLE"></goods-attr-dialog>-->
                <!--</el-form-item>-->
                <!--</el-col>-->
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="商品描述">
                        <filter-check-group v-model="filterFormData.existGoodsRemark">
                            <filter-check-item
                                    v-for="item in options.existGoodsRemark"
                                    :options="options.existGoodsRemark"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.existGoodsRemark"-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.existGoodsRemark" :key="item.value" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="被驳回">
                        <filter-check-group v-model="filterFormData.hasReject">
                            <filter-check-item
                                    v-for="item in options.reject"
                                    :options="options.reject"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.hasReject"-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.reject" :key="item.value" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="商品状态">
                        <filter-check-group v-model="filterFormData.generateGoods">
                            <filter-check-item
                                    v-for="item in options.generateGoods"
                                    :options="options.generateGoods"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label">
                            </filter-check-item>
                        </filter-check-group>
                        <!--<el-select-->
                        <!--v-model="filterFormData.generateGoods"-->
                        <!--clearable-->
                        <!--placeholder="全部">-->
                        <!--<el-option v-for="item in options.generateGoods" :key="item.value" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :md="24" :lg="24" style="border-top: 1px solid #E6EAF0;padding-top: 10px;" v-show="isCollapse">
                    <el-col :xs="12" :sm="12" :md="12" :lg="6" v-for="(item,index) in checkDataList" :key="index">
                        <!--<el-form-item label="样衣档案">-->
                        <!--<el-select-->
                        <!--v-model="filterFormData.existGoodsRemark"-->
                        <!--clearable-->
                        <!--placeholder="请选择或搜索">-->
                        <!--<el-option v-for="item in options.existGoodsRemark" :key="item.value" :label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->

                        <el-form-item :label="item.attrName">
                            <el-select
                                    v-model="item.check"
                                    clearable
                                    placeholder="请选择">
                                <el-option v-for="item in options.check" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
            </div>
            <div class="btn-group">
                <el-button style="font-size: 12px;color: #808080" type="text" @click="isCollapse = !isCollapse">检查项筛选
                    <i class="icon" :class="[isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
                </el-button>
                <el-button class="btn btn-reset" @click="reset">重置</el-button>
                <el-button class="btn btn-submit" @click="submit">筛选</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import FilterCheckGroup from './filter-check-group';
    import FilterCheckItem from './filter-check-item';
    import {
        selectFacGoodsStyleList,
        selectFacCustomer,
        getPersonList,
        getNodeLists,
        getUnitUser,
        designstyleQueryListData,
        stylesName
    } from '@/api';

    export default {
        props: {
            attrsData: Object,
            selectPersonList: Array,
            checkDataList: []
        },
        components: {
            FilterCheckGroup,
            FilterCheckItem
        },
        data() {
            return {
                isCollapse: false,
                manList: [],
                isAttrSelectShow: false,
                // orderDateRange: '',
                richFilterParams: {}, //设计档案富筛选参数
                filterFormData: {
                    // creatorIds: [],
                    generateGoods: null,
                    // styleIds: [],
                    styleStatus: [],
                    // attrIds: [],
                    // sampleDesignerIds: [],
                    // sampleMachinistIds: [],
                    // goodsStyleIds:[],
                    status: [],
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    pageNo: 1,
                    // dateCreatedStart: '',
                    // dateCreatedEnd: '',
                    existSample: null, // 样衣状态
                    existGoodsRemark: null, // 商品描述
                    existAttachmentFile: null,
                    hasReject: ''
                },
                attrFormData: { // 货品属性
                    designer: [],
                    wave: [],
                    kind: [],
                    season: [],
                    year: [],
                    tag: [],
                    brand: [],
                },
                options: {
                    generateGoods: [
                        {
                            label: '全部',
                            value: null
                        },
                        {
                            label: '未生成商品',
                            value: 0
                        },
                        {
                            label: '已生成商品',
                            value: 1
                        },
                    ],
                    check: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '已填写',
                            value: 1
                        },
                        {
                            label: '未填写',
                            value: 2
                        },
                    ],
                    reject: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '被驳回',
                            value: 1
                        }
                    ],
                    styleNos: [],
                    groupOptions: [],
                    existSample: [
                        {
                            label: '全部',
                            value: null
                        },
                        {
                            label: '无样衣',
                            value: false
                        },
                        {
                            label: '有样衣',
                            value: true
                        }
                    ],
                    existAttachmentFile: [
                        {
                            label: '全部',
                            alue: null
                        },
                        {
                            label: '无打版文件',
                            value: false
                        },
                        {
                            label: '有打版文件',
                            value: true
                        }
                    ],
                    existGoodsRemark: [
                        {
                            label: '全部',
                            alue: null
                        },
                        {
                            label: '未填写',
                            value: false
                        },
                        {
                            label: '有填写',
                            value: true
                        }
                    ],
                    status: [
                        {
                            label: '设计中',
                            value: 0
                        },
                        {
                            label: '已作废',
                            value: 1
                        },
                        {
                            label: '已完成',
                            value: 2
                        },
                        {
                            label: '未提报',
                            value: 3
                        }
                    ],
                    // isReset: false, // 是否重置
                }
            }
        },
        created() {
            this.getStylesName()
            // this.fetchUnitUser()
        },
        watch: {},
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        methods: {
            priority_click() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.mission.level.change") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    this.filterFormData.priorities = ''
                    return;
                }
            },
            submit() {
                this.filterFormData.existSample = this.filterFormData.existSample === '' ? null : this.filterFormData.existSample, // 样衣状态
                    this.filterFormData.existGoodsRemark = this.filterFormData.existGoodsRemark === '' ? null : this.filterFormData.existGoodsRemark, // 样衣状态
                    this.filterFormData.existAttachmentFile = this.filterFormData.existAttachmentFile === '' ? null : this.filterFormData.existAttachmentFile,
                    this.checkDataList.forEach(v => {
                        this.filterFormData[v.code] = v.check
                    })
                this.$emit('on-filter', {...this.richFilterParams, ...this.filterFormData});
            },
            getFilterParams() {
                // this.filterFormData.attrIds = this.getAllAttrId();
                return {...this.richFilterParams, ...this.filterFormData}
            },
            reset() {
                //设计档案富筛选框参数
                this.richFilterParams = {}
                this.checkDataList.forEach(v => {
                    v.check = ''
                })
                Object.keys(this.filterFormData).forEach(key => {
                    if (key != 'unitId' && key != 'pageNo') {
                        const isArr = Array.isArray(this.filterFormData[key]);
                        if (isArr) {
                            this.filterFormData[key] = [];
                        }
                        else {
                            this.filterFormData[key] = null;
                        }
                    }
                });
                Object.keys(this.attrFormData).forEach(key => {
                    this.attrFormData[key] = [];
                });
                // this.filterFormData.dateCreatedStart = ''
                // this.filterFormData.dateCreatedEnd = ''
                // this.orderDateRange = '';
                // this.isReset = true
                // this.deliveryDateRange = '';
                // this.endDateRange = '';
            },
            // 版师，样衣师
            // fetchUnitUser(keyword = '') {
            //     getUnitUser({
            //         unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
            //         keyword
            //     }).then(res => {
            //         this.options.groupOptions = res.data.data.facGroupDTOS;
            //         console.log(res);
            //     });
            // },
            // // 设计款号
            getStylesName(key) {
                stylesName({
                    unitId: this.facId,
                    key: key,
                    userId: this.userId,
                    modelName: 'SPL_DESIGN_STYLE',
                }).then(res => {
                    console.log(res, '设计款号');
                    this.options.styleNos = res.data.data
                });
            },
            // remoteSearch(val) {
            //     this.fetchGoodList({keyword: val});
            // },
            // // 选取制单日期
            // orderDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.dateCreatedStart = start;
            //     this.filterFormData.dateCreatedEnd = end;
            // },
            // filterDate(val) {
            //     return val.split(/\s-\s/g);
            // },
            // getAllAttrId(val, categorys) {
            //     this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            //     this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            // },
        }
    }
</script>
<style lang="scss" scoped>
    .attrs-select {
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        padding: 3px 35px 3px 10px;
        line-height: 30px;
        height: 36px;
        border-radius: 2px;
        color: #bec9d8;
        cursor: pointer;
        border: 1px solid rgb(191, 200, 217);
        transition: border-color .3s;
        &:hover {
            border-color: rgb(131, 140, 165);
        }
        &__icon {
            display: inline-block;
            width: 35px;
            height: 36px;
            line-height: 38px;
            box-sizing: border-box;
            text-align: center;
            position: absolute;
            right: 0;
            top: 0;
            font-size: 12px;
            transition: transform .3s;
        }
    }

    .popover-content {
        font-size: 14px;
        max-height: 400px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-user-select: none;
        &__row {
            margin-bottom: 4px;
        }
        &__btn {
            display: inline-block;
            margin-left: 16px;
            margin-right: 16px;
            color: #808080;
            cursor: pointer;
            &.is-active {
                color: #FFA914;
            }
        }
        &__title {
            display: inline-block;
            width: 80px;
            margin-left: -20px;
            text-align: right;
        }
        &--left {
            line-height: 28px;
        }
        &--right {
            flex: 1;
        }
        &__check-item {
            margin-bottom: 8px;
        }
    }
</style>
