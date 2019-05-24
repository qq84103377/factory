<template>
    <div class="custom-filter-form box-shadow clearfix">
        <el-form style="margin-left: -35px"
                label-width="100px"
                :model="filterFormData">
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item  label="设计档案">
                    <rich-filter v-model="richFilterParams"
                                 dialogType='DESIGN_STYLE'
                                 placeholder="点击可筛选档案"
                                 modelName="SPL_DESIGN_STYLE"></rich-filter>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
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
            <el-col :xs="12" :sm="12" :md="8" :lg="6" style="margin-right: 10px;">
                <el-form-item  label="商品款号">
                    <design-goods-select  v-model="filterFormData.goodsStyleIds" :multiple="true" modelName="SPL_DESIGN_STYLE"></design-goods-select>

                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item  label="档案状态">
                    <filter-check-group multiple  v-model="filterFormData.styleStatus">
                        <filter-check-item
                                v-for="item in options.status"
                                :options="options.status"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item  label="打版状态">
                    <filter-check-group v-model="filterFormData.existAttachmentFile">
                        <filter-check-item
                                v-for="item in options.existAttachmentFile"
                                :options="options.existAttachmentFile"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>


                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="6">
                <el-form-item  label="样衣状态">
                    <filter-check-group v-model="filterFormData.existSample">
                        <filter-check-item
                                v-for="item in options.existSample"
                                :options="options.existSample"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="24">
                <div class="btn-group">
                    <el-button class="btn btn-reset" @click="reset">重置</el-button>
                    <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                </div>
            </el-col>
        </el-form>
    </div>
</template>

<script>
    import FilterCheckGroup from './filter-check-group';
    import FilterCheckItem from './filter-check-item';
    import {
        selectFacCustomer
        , getPersonList
        , getUnitUser,
        stylesName
    } from '@/api';
    import { getDesignNodeList, getDesignStyleList } from '@/api/sample-centre';
    // {
    //  orderNo: 工单号,
    //  facId: 本厂ID,
    //  userId: 操作人ID,
    //  styleIds: [款号ID, 款号ID, 款号ID, ...],
    //   customerIds: [客户ID, 客户ID, 客户ID, ...],
    //  chargerIds: [工单负责人ID, 工单负责人ID, ...]
    //  attrIds: [货品属性ID, 货品属性ID, ...],
    //  orderStartAt: 制单日期开始,
    //  orderEndAt: 制单日期结束,
    //  deliveryStartAt: 交货日期开始,
    //  deliveryEndAt: 交货日期结束,
    //  statuses: [状态, 状态, ...],  // 0全部, 1未开始, 2进行中, 3已完成, 4已撤销
    //  priorities: [优先级, 优先级, ...], // 0正常, 1加急
    //  nodeChargerIds: [节点负责人ID, 节点负责人ID, ...],
    //   nodeEndStartAt: 节点结束日期开始,
    //  nodeEndEndAt: 节点结束日期结束,
    //  notifyTypes: [节点提醒类型, 节点提醒类型, ...], // -1无提醒, 0 延期提醒,  1 延误警报, 2 差额提醒, 3 节点备注
    //  orderBy: 排序依据, // 0 默认排序 1 制单日期升序 2 制单日期降序 3 交货日期升序 4 交货日期倒序 5 货品款号升序 6 货品款号倒序 7 工单号升序 8 工单号倒序
    //  pageSize: 每页最大数量,
    //  pageNo: 页码
    // }
    export default {
        props: {
            attrsData: Object,
            selectPersonList: []
        },
        components: {
            FilterCheckGroup,
            FilterCheckItem
        },
        data() {
            return {
                richFilterParams:{},
                // manList: [],
                // isCollapse: true,
                // isAttrSelectShow: false,
                // isReset: false, // 是否是重置
                // orderDateRange: '',
                // deliveryDateRange: '',
                // endDateRange: '',
                filterFormData: {
                    styleIds: [],
                    styleStatus: [],
                    // dateCreatedStart: '',
                    // dateCreatedEnd: '',
                    // attrIds: [],
                    // sampleDesignerIds: [],
                    // sampleMachinistIds: [],
                    // goodsStyleNos: [],
                    status: [],
                    existSample: null, // 样衣状态
                    // existGoodsRemark: null , // 商品描述
                    existAttachmentFile: null,
                    goodsStyleIds:[],
                },
                // attrFormData: { // 货品属性
                //     brand: [],
                //     designer: [],
                //     wave: [],
                //     kind: [],
                //     season: [],
                //     year: [],
                //     tag: []
                // },
                options: {
                    styleNos: [],
                    // groupOptions: [],
                    // goodsStyleNos: [],
                    existSample: [
                        {
                            label: '全部',
                            alue: null
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
                    ]
                }
            }
        },
        created() {
            // this.fetchGoodList();
            // this.fetchCustomerList();
            // this.fetchPersonList();
            // this.fetchNodeList();
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
            // currentAttrData() {
            //     const obj = {};
            //     Object.keys(this.attrsData).forEach(key => {
            //         if (this.attrFormData.hasOwnProperty(key)) {
            //             obj[key] = this.attrsData[key];
            //         }
            //     });
            //     return obj;
            // },
            // isSelectedAttrs() {
            //     return Object.keys(this.attrFormData).some(key => {
            //         return this.attrFormData[key].length;
            //     });
            // }
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
                // this.filterFormData.attrIds = this.getAllAttrId();
                // console.log(this.filterFormData)
                this.$emit('on-filter', {...this.richFilterParams,...this.filterFormData});
            },
            // getFilterParams() {
            //     // this.filterFormData.attrIds = this.getAllAttrId();
            //     return this.filterFormData;
            // },
            reset() {
                this.richFilterParams = {}
                Object.keys(this.filterFormData).forEach(key => {
                    const isArr = Array.isArray(this.filterFormData[key]);
                    if (isArr) {
                        this.filterFormData[key] = [];
                    }
                    else {
                        this.filterFormData[key] = '';
                    }
                });
                // Object.keys(this.attrFormData).forEach(key => {
                //     this.attrFormData[key] = [];
                // });
                // this.filterFormData.dateCreatedStart = ''
                // this.filterFormData.dateCreatedEnd = ''
                this.filterFormData.existAttachmentFile = null
                this.filterFormData.existSample = null
                // this.orderDateRange = '';
                // this.isReset = true
                // console.log(this.isReset, '555')
            },
            // 获取货品款号
            // fetchGoodList(params = {}) {
            //     getDesignStyleList({
            //         unitId: this.facId
            //     }).then(res => {
            //         this.options.goodsList = res.data.data;
            //     });
            // },
            // 获取客户列表
            // fetchCustomerList() {
            //     selectFacCustomer({
            //         facId: this.facId,
            //         pageNo: 1,
            //         sortType: 0
            //     }).then(res => {
            //         this.options.customerList = res.data.goods;
            //     });
            // },
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
            // 设计款号
            getStylesName(key) {
                stylesName({
                    unitId: this.facId,
                    key: key,
                    userId: this.userId,
                    modelName: 'SPL_DESIGN_STYLE',
                }).then(res => {
                    console.log(res,'设计款号');
                    this.options.styleNos = res.data.data
                });
            },
            // 选取创建日期
            // creatDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.dateCreatedStart  = start;
            //     this.filterFormData.dateCreatedEnd = end;
            // },
            // 获取本厂列表
            // fetchNodeList() {
            //     const params = {
            //         unitId: this.facId
            //     }
            //     getDesignNodeList(params)
            //     .then(res => {
            //         const { data } = res.data;
            //         this.options.nodeList = data;
            //     });
            // },
            // // 选取制单日期
            // orderDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.orderStartAt = start;
            //     this.filterFormData.orderEndAt = end;
            // },
            // 选取交货日期
            // deliveryDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.deliveryStartAt = start;
            //     this.filterFormData.deliveryEndAt = end;
            // },
            // 选取结束日期
            // nodeEndDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.nodeEndStartAt = start;
            //     this.filterFormData.nodeEndEndAt = end;
            // },
            // filterDate(val) {
            //     return val.split(/\s-\s/g);
            // },
            // renderTitle(key) {
            //     const conf = {
            //         brand: '品牌',
            //         designer: '设计师',
            //         wave: '波段',
            //         kind: '分类',
            //         season: '季节',
            //         year: '年份',
            //         tag: '标签'
            //     }
            //     return conf[key];
            // },
            // itemActive(key) {
            //     return !this.attrFormData[key].length
            // },
            // handleSelectAll(key) {
            //     if (this.attrFormData[key].length !== this.currentAttrData[key].length) {
            //         this.attrFormData[key] = this.currentAttrData[key].map(item => {
            //             return item.id;
            //         });
            //     }
            //     else {
            //         this.attrFormData[key] = [];
            //     }
            // },
            // 获取某个属性的id列表
            // getAttrIds(key) {
            //     return this.attrsData[key].map(item => {
            //         return item.id;
            //     });
            // },
            // getAllAttrId(val,categorys) {
            //     this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            //     this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            // },


            // // 负责人分组
            // getManId(arrId) {
            //     this.filterFormData.chargerIds = arrId
            // },


        }
    }
</script>

<style lang="scss">

</style>


<style lang="scss" scoped>

</style>
