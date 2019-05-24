<template>
    <div class="custom-filter-form box-shadow filter-remove-right">
        <div class="filter-title">
            <div class="filter-title-name">筛选器</div>
            <div class="btn-group">
                <el-button class="btn btn-reset" @click="$emit('update:filterFormDialog',false)">取消</el-button>
                <el-button class="btn btn-reset" @click="reset">重置</el-button>
                <el-button class="btn btn-submit" @click="submit">筛选</el-button>
            </div>
        </div>
        <el-form class="clearfix"
                label-width="100px"
                :model="filterFormData" style="margin-left: -35px">
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="商品档案">
                    <rich-filter v-model="richFilterParams"
                                 dialogType='STYLE'
                                 placeholder="点击可筛选商品"
                                 modelName="FACTORY_MISSION"></rich-filter>
                    <!--<goods-select v-model="filterFormData.styleIds" :multiple="true" modelName="FACTORY_MISSION"></goods-select>-->
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item label="客户名称">
                    <customer type="filter"  v-model="filterFormData.customerIds"></customer>
                    <!--<el-select-->
                            <!--v-model="filterFormData.customerIds"-->
                            <!--filterable-->
                            <!--multiple-->
                            <!--clearable-->
                            <!--placeholder="全部">-->
                        <!--<el-option v-for="item in options.customerList" :key="item.id" :label="item.name"-->
                                   <!--:value="item.id">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item class="selLeader" label="工单负责人">
                    <workerLeader  v-model="filterFormData.chargerIds" :placeholder="'全部'"></workerLeader>
                </el-form-item>
            </el-col>
            <!--<el-col :xs="12" :sm="8" :md="8" :lg="6">-->
                <!--<el-form-item label="商品属性">-->
                    <!--<goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset" modelName="FACTORY_MISSION"></goods-attr-dialog>-->
                    <!--<el-popover-->
                            <!--ref="popover"-->
                            <!--placement="bottom-start"-->
                            <!--width="800"-->
                            <!--@show="isAttrSelectShow = true"-->
                            <!--@hide="isAttrSelectShow = false"-->
                            <!--trigger="click">-->
                        <!--<div class="popover-content" v-if="attrsData">-->
                            <!--<el-row-->
                                    <!--class="popover-content__row"-->
                                    <!--type="flex" v-for="(item, key) of currentAttrData" :key="key">-->
                                <!--<div class="popover-content&#45;&#45;left">-->
                                    <!--<span class="popover-content__title">{{ renderTitle(key) }}:</span>-->
                                    <!--<span-->
                                            <!--class="popover-content__btn"-->
                                            <!--:class="{'is-active': itemActive(key) }"-->
                                            <!--@click="handleSelectAll(key)">全部</span>-->
                                <!--</div>-->
                                <!--<div class="popover-content&#45;&#45;right">-->
                                    <!--<filter-check-group multiple v-model="attrFormData[key]"-->
                                                        <!--@change="handleChange(key)">-->
                                        <!--<filter-check-item-->
                                                <!--class="popover-content__check-item"-->
                                                <!--v-for="item in attrsData[key]"-->
                                                <!--:key="item.id"-->
                                                <!--:value="item.id"-->
                                                <!--:label="item.name"></filter-check-item>-->
                                    <!--</filter-check-group>-->
                                <!--</div>-->
                            <!--</el-row>-->
                        <!--</div>-->
                    <!--</el-popover>-->
                    <!--<div class="attrs-select" v-popover:popover>-->
                        <!--<span :style="{'color': isSelectedAttrs ? '#3b3b3b' : ''}">{{isSelectedAttrs ? '已选择' : '全部'}}</span>-->
                        <!--<i class="attrs-select__icon el-icon-caret-bottom"-->
                           <!--:style="{'transform': isAttrSelectShow ? `rotate(${180}deg)` : ''}"></i>-->
                    <!--</div>-->
                <!--</el-form-item>-->
            <!--</el-col>-->
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="制单日期">
                    <el-date-picker
                            @change="orderDateChange"
                            v-model="orderDateRange"
                            type="daterange"
                            placeholder="选择制单日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="交货日期">
                    <el-date-picker
                            @change="deliveryDateChange"
                            v-model="deliveryDateRange"
                            type="daterange"
                            placeholder="选择交货日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="整单外发厂">
                    <el-select
                            v-model="filterFormData.outSideFactoryIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option key="no" label="无"
                                   value="no">
                        </el-option>
                        <el-option v-for="item in outsideFactoryList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="床次">
                    <el-select
                            v-model="filterFormData.lathes"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.lathes" :key="item.index" :label="item"
                                   :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="关联订单">
                    <el-select
                            v-model="filterFormData.facPrdOrderIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.facPrdOrderIds" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="工序模板">
                    <el-select
                            v-model="filterFormData.facMissionTemplateIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option
                                v-for="item in options.facMissionTemplateIds"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-col :xs="12" :sm="8" :md="8" :lg="6">
                    <el-form-item  label="是否首单">
                        <filter-check-group v-model="filterFormData.firstSingle" @change="priority_click">
                            <filter-check-item
                                    v-for="item in options.firstSingle"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="6">
                    <el-form-item  label="是否改期">
                        <filter-check-group v-model="filterFormData.updateDeliveryDate" @change="priority_click">
                            <filter-check-item
                                    v-for="item in options.firstSingle"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="8" :md="8" :lg="6">
                    <el-form-item  label="是否延误">
                        <filter-check-group v-model="filterFormData.delayNotify" @change="priority_click">
                            <filter-check-item
                                    v-for="item in options.firstSingle"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                    </el-form-item>
                </el-col>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="优先级">
                    <filter-check-group v-model="filterFormData.priorities" @change="priority_click">
                        <filter-check-item
                                v-for="item in options.priorities"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"></filter-check-item>
                    </filter-check-group>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="工单状态">
                        <filter-check-group multiple v-model="filterFormData.statuses">
                            <filter-check-item
                                    v-for="item in options.statuses"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                </el-form-item>
            </el-col>

        </el-form>

        <section style="display: block;" class="border-top-1px clearfix">
            <el-form
                    label-width="100px"
                    :model="filterFormData" style="margin-left: -40px">
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="节点选择">
                    <el-select
                            v-model="filterFormData.nodeIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in options.nodeList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item label="节点负责人">
                    <el-select
                            v-model="filterFormData.nodeChargerIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in selectPersonList" :key="item.id" :label="item.userName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="节点外发厂">
                    <el-select
                            v-model="filterFormData.nodeOutSideFactoryIds"
                            filterable
                            multiple
                            clearable
                            placeholder="全部">
                        <el-option v-for="item in outsideFactoryList" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="6">
                <el-form-item  label="结束日期">
                    <el-date-picker
                            @change="nodeEndDateChange"
                            v-model="endDateRange"
                            type="daterange"
                            placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12">
                <el-form-item  label="节点提醒">
                        <filter-check-group multiple v-model="filterFormData.notifyTypes">
                            <filter-check-item

                                    v-for="item in options.notifyTypes"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-form-item  label="节点状态">
                        <filter-check-group multiple v-model="filterFormData.nodeStatuses">
                            <filter-check-item
                                    v-for="item in options.nodeStatuses"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"></filter-check-item>
                        </filter-check-group>
                </el-form-item>
            </el-col>
            <!--<el-col :xs="12" :sm="12" :md="12" :lg="6">-->
                <!--<div class="btn-group">-->
                    <!--<el-button type="text" @click="isCollapse = !isCollapse"><span class="fs12">节点筛选</span>-->
                        <!--<i class="icon" :class="[isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>-->
                    <!--</el-button>-->
                    <!--<el-button class="btn btn-reset" @click="reset">重置</el-button>-->
                    <!--<el-button class="btn btn-submit" @click="submit">筛选</el-button>-->
                <!--</div>-->
            <!--</el-col>-->
            </el-form>
        </section>

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
        getAllNodeList,
        getUnitUser,
        outsideFactoryListForSelect,
        facPrdOrderFilterList,
        getNodeTemplateList,
        selectFacLathes
    } from '@/api';
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
    //  priorities: [优先级, 优先级, ...], // 0正常, 1加急, 2特急
    //  firstSingle: [是否首单], // 0非首单, 1首单
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
            filterFormDialog:Boolean,
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
                manList: [],
                isCollapse: true,
                isAttrSelectShow: false,
                // isReset: false, // 是否重置
                orderDateRange: '',
                deliveryDateRange: '',
                endDateRange: '',
                filterFormData: {
                    // styleIds: [],
                    updateDeliveryDate: null,
                    delayNotify: null,
                    facPrdOrderIds: [],
                    facMissionTemplateIds: [],
                    customerIds: [],
                    chargerIds: [],
                    // attrIds: [],
                    orderStartAt: '',
                    orderEndAt: '',
                    deliveryStartAt: '',
                    deliveryEndAt: '',
                    statuses: ['WAIT_START', 'ONGOING'],  // 工单状态 WAIT_START 未开始 ONGOING 进行中 FINISH 已完成
                    nodeStatuses: [], // 节点状态 0 未开始 1 进行中 2 已完成
                    priorities: [], // 0正常, 1加急，2特急
                    firstSingle:[],  //0非首单，1首单
                    nodeIds: [],
                    nodeChargerIds: [],
                    nodeEndStartAt: '',
                    nodeEndEndAt: '',
                    notifyTypes: [], // -1无提醒, 0 延期提醒,  1 延误警报, 2 差额提醒, 3 节点备注
                    outSideFactoryIds:[],// 工单外发厂
                    nodeOutSideFactoryIds:[],// 列表外发厂
                    lathes: [],     //床次
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
                    facPrdOrderIds: [],
                    facMissionTemplateIds: [],
                    // goodsList: [],
                    customerList: [],
                    nodeList: [],
                    statuses: [
                        {label: '未开始', value: 'WAIT_START'},
                        {label: '进行中', value: 'ONGOING'},
                        {label: '已完成', value: 'FINISH'}
                    ],
                    nodeStatuses: [
                        {label: '未开始', value: 0},
                        {label: '进行中', value: 1},
                        {label: '已完成', value: 2}
                    ],
                    notifyTypes: [
                        {label: '延期预警', value: 0},
                        {label: '延误警报', value: 1},
                        {label: '差额提醒', value: 2},
                        {label: '节点备注', value: 3},
                        {label: '无提醒', value: -1}
                    ],
                    priorities: [
                        {
                            label: '普通',
                            value: 0
                        },
                        {
                            label: '加急',
                            value: 1
                        },
                        {
                            label: '特急',
                            value: 2
                        }
                    ],
                    firstSingle:[
                        {
                            label: '是',
                            value: 1
                        },
                        {
                            label: '否',
                            value: 0
                        }
                    ],
                    lathes: [],     //床次
                },
                outsideFactoryList:[]

            }
        },
        created() {
            this.fetchFacPrdOrderIds();
            this.getTemplateList();
            this.fetchCustomerList();
            this.getLathesList();
            this.fetctNodeList();
            this.getOutsideFactoryList();
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
            //获取关联订单列表
            fetchFacPrdOrderIds(){
                facPrdOrderFilterList({
                    unitId: this.facId,
                    like:''
                }).then(res=>{
                    if(res.data.code===0){
                        console.log(res);
                        this.options.facPrdOrderIds = res.data.data
                    }else {
                        this.$message.error('获取关联订单列表失败')
                    }

                })
            },
            // 获取工序模板下拉列表
            getTemplateList() {
                getNodeTemplateList({unitId: this.facId}).then(res => {
                    if(res.data.code===0){
                        this.options.facMissionTemplateIds = res.data.templates
                    }else {
                        this.$message.error('获取工序模板下拉列表失败')
                    }

                })
            },
            //获取床次下拉列表
            getLathesList() {
                selectFacLathes({
                    unitId: this.facId,
                }).then(res => {
                    console.log(res,'ppppp');
                    this.options.lathes = res.data.data;
                });
            },
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
                // console.log(this.filterFormData.attrIds,'9999')
                this.$emit('update:filterFormDialog',false)
                this.$emit('on-filter', {...this.richFilterParams,...this.filterFormData});
            },
            getFilterParams() {
                // this.filterFormData.attrIds = this.getAllAttrId();
                return  {...this.richFilterParams,...this.filterFormData}
            },
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
                this.filterFormData.updateDeliveryDate = null
                this.filterFormData.delayNotify = null
                this.filterFormData.statuses = ['WAIT_START', 'ONGOING']
                // Object.keys(this.attrFormData).forEach(key => {
                //     this.attrFormData[key] = [];
                // });
                this.orderDateRange = '';
                this.deliveryDateRange = '';
                this.endDateRange = '';
                // this.isReset = true
                this.submit()
            },
            // 获取客户列表
            fetchCustomerList() {
                selectFacCustomer({
                    facId: this.facId,
                    pageNo: 1,
                    sortType: 0,
                    needAll:true
                }).then(res => {
                    this.options.customerList = res.data.goods;
                });
            },
            // 获取负责人列表
            // fetchPersonList() {
            //     getPersonList({
            //         userId: this.userId,
            //         unitId: this.facId
            //     }).then(res => {
            //         this.selectPersonList = res.data;
            //     })
            // },
            // 获取本厂列表
            fetctNodeList(keyword = '') {
                const params = {
                    unitId: this.facId,
                    pageNo: 1,
                    pageSize: 20,
                    keyword: keyword
                }
                getAllNodeList(params)
                    .then(res => {
                        this.options.nodeList = res.data.prcdNodes;
                    });
            },
            // 选取制单日期
            orderDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.orderStartAt = start;
                this.filterFormData.orderEndAt = end;
            },
            // 选取交货日期
            deliveryDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.deliveryStartAt = start;
                this.filterFormData.deliveryEndAt = end;
            },
            // 选取结束日期
            nodeEndDateChange(val) {
                const [start, end] = this.filterDate(val);
                this.filterFormData.nodeEndStartAt = start;
                this.filterFormData.nodeEndEndAt = end;
            },
            filterDate(val) {
                return val.split(/\s-\s/g);
            },
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
            handleChange(key) {
                // console.log(this.attrFormData[key].length === this.attrsData[key].length)
                // if (this.attrsData[key].length === 1) {
                //     return;
                // };
                // console.log(this.attrFormData[key].length === this.attrsData[key].length)
                // if (this.attrFormData[key].length === this.attrsData[key].length) {
                //     this.attrFormData[key] = [];
                // }
            },
            // getAllAttrId(val, categorys) {
            //     this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            //     this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            // },


            // 负责人分组
            // getManId(arrId) {
            //     this.filterFormData.chargerIds = arrId
            // },
            getOutsideFactoryList(){
                let params= {
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:this.userId
                }
                console.log(params,1100)
                outsideFactoryListForSelect(params).then(res=>{
                    console.log(res,'外发工厂列表')
                    if(res.data.code ===0){
                        this.outsideFactoryList=res.data.data
                    }
                })
            }


        }
    }
</script>

<style lang="scss" scoped>
    .filter-remove-right{
        position: fixed;
        top: 0;
        right: 0;
        width: calc(100% - 300px) !important;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2000;
        padding-left: 20px;
        padding-right: 20px;
        .filter-title{
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #E6EAF0;
            margin-bottom: 20px;
            .filter-title-name{
                line-height: 46px;
                font-size: 18px;
            }

        }
    }

    .border-top-1px {
        padding-top: 10px;
        border-top: 1px solid #E6EAF0;
    }
    .filter-check-group{
        line-height: 37px;
    }
    .attrs-select {
        display: inline-block;
        box-sizing: border-box;
        width:100%;
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
        overflow: hidden;
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
<style lang="scss">

</style>

