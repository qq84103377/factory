<template>
    <div class="forms_statistics" id="forms_statistics">
        <header class="forms_header" v-if="false">
            <div class="header_left">
                <span v-if="noCheck">工单节点进度报表</span>
                <!-- 老板 -->
                <span v-if="!noCheck&&loginType!=0">暂无启用报表</span>
                <!-- 员工 -->
                <span v-if="!noCheck&&loginType==0">暂无权限查看报表</span>
            </div>
            <div class="header_right">
                <el-input v-if="noCheck" placeholder="请输入单号" icon="search" v-model="searchOrderNo"
                          @change="remoteSearch">
                </el-input>
                <nf-button v-if="loginType!=0" style="margin-left:32px;" type="warning"
                           @click="$router.push('/MyReport/reportmanage')">管理报表
                </nf-button>
            </div>
        </header>
        <!--头部begin-->
        <page-title title="工厂进度报表" bg>
            <div class="report-wrap">
                <nf-button class="go-back" @click="goBackClick">返回上级</nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <section class="select_container" v-if="noCheck">
            <div class="first_select">
                <div class="select_customer select_block" v-if="loginType!=0">
                    <template>
                        <span class="select_name">选择工厂</span>
                        <el-select v-model="facId" filterable @change="facGet" multiple placeholder="全部"
                                   :multiple-limit="12">
                            <template>
                                <el-option style="cursor:pointer;" :value="''" :label="'全部'">
                                </el-option>
                            </template>
                            <el-option v-for="item in facList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </div>
                <div class="select_order select_block">

                </div>
                <div class="select_man select_block">

                </div>
                <div class="select_status" :class="{'select_block':loginType==0}">

                </div>
                <div class="select_customer select_block" v-if="loginType==0">

                </div>
            </div>
            <div class="first_select">
                <div class="select_order select_block">
                    <template>
                        <span class="select_name">选择客户</span>
                        <el-select v-model="customerId" filterable @change="customerGet" multiple placeholder="全部"
                                   :multiple-limit="12">
                            <template>
                                <el-option style="cursor:pointer;" :value="''" :label="'全部'">
                                </el-option>
                            </template>
                            <el-option v-for="(item,index) of customerList" :key="index" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </div>
                <div class="select_man select_block">
                    <template>
                        <span class="select_name">货品款号</span>
                        <!--<el-select v-model="goodsOrderId" filterable-->
                                   <!--remote-->
                                   <!--:remote-method="remoteMethod"-->
                                   <!--@change="goodsGet" multiple placeholder="全部"-->
                                   <!--:multiple-limit="12">-->
                            <!--<template>-->
                                <!--<el-option style="cursor:pointer;" :value="''" :label="'全部'">-->
                                <!--</el-option>-->
                            <!--</template>-->
                            <!--<el-option v-for="(item,index) in goodsList" :key="index" :label="item.styleNo"-->
                                       <!--:value="item.styleId">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <design-goods-select style="display: inline-block;width: 82%;" :isForm="true" v-model="goodsOrderId" :multiple="true">
                        </design-goods-select>
                    </template>
                </div>
                <div class="select_status select_block">
                    <template>
                        <span class="select_name">负责人</span>
                        <workerLeader v-model="manId" :placeholder="'全部'"></workerLeader>
                    </template>
                </div>
                <div class="select_status">
                    <template>
                        <span class="select_name">工单状态</span>

                        <el-select v-model="orderStatusId" @change="orderStatusGet" multiple placeholder="全部"
                                   :multiple-limit="12">
                            <template>
                                <el-option style="cursor:pointer;" :value="''" :label="'全部'">
                                </el-option>
                            </template>
                            <el-option v-for="item in orderStatus" :key="item.id"
                                       :value="item.id" :label="item.value">
                            </el-option>
                        </el-select>
                    </template>
                </div>
            </div>
            <div class="first_select">
                <div class="select_order select_block" style="margin-right:16px;width:50%">
                    <span class="select_name">下单日期</span>
                    <template>
                        <el-date-picker @change="beginDate" editable v-model="value6" type="daterange" align="right"
                                        unlink-panels range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期"
                                        :picker-options="pickerOptions2">
                        </el-date-picker>
                    </template>
                </div>
                <div class="select_man" style="display:flex;justify-content:flex-end;align-items:center;width:50%">
                    <span class="select_name">交货日期</span>
                    <template>
                        <el-date-picker @change="endDate" v-model="value7" type="daterange" align="right" unlink-panels
                                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                        :picker-options="pickerOptions2">
                        </el-date-picker>
                    </template>
                </div>
            </div>
            <div class="second_select">
            <span @click="showTypeForm">
                <span v-if="showType">展开货品属性筛选</span>
                <span v-if="!showType">收起货品属性筛选</span>
                <i style="font-size:12px;margin-left:6px;" :class="{'el-icon-caret-bottom_show':!showType}"
                   class="el-icon-caret-bottom"></i>
            </span>
                <div style="display:flex;justify-content:flex-start;align-items:center;">
                    <template>
                        <div class="order_alert">
                            <el-checkbox style="color:#636363;" v-model="checked">只看异常工单(有延误或有警报)</el-checkbox>
                        </div>
                    </template>
                    <nf-button style="margin-left:12px;" type="warning" :plain="true" @click="searchForm">搜索筛选
                    </nf-button>
                </div>
            </div>
            <div class="third_select" v-if="!showType">
                <select-specific :facInfo='facInfo' @orderType='sel' :showType='showType'></select-specific>
            </div>
        </section>
        <!-- 表格 -->
        <section class="forms_container" v-loading="isLoading" v-if="noCheck">
            <template>
                <el-table @sort-change="sortTable" :data="formData" border fixed
                          :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%">
                    <el-table-column prop="facName" label="工厂" width="80">
                        <template slot-scope="scope">
                            <div style="over-flow:hidden;width:100%;">
                                <span>{{scope.row.facName}} </span>
                                <span v-if="scope.row.cancel==1"
                                      style="position: absolute;top: 30px;left: 50px;width: 55px;border: 1px solid rgb(160, 172, 189);padding: 0px 5px;color: rgb(187, 187, 187);z-index: 2;transform: rotate(15deg);">已撤销</span>
                                <span v-if="scope.row.cancel==1"
                                      style="over-flow:hidden;position: absolute;top: 0px;left: 0px;min-width: 1200px;height: 100%;background-color: #fff;opacity:.7;padding: 0px 5px;color: rgb(187, 187, 187);z-index: 1;"
                                >&emsp;</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNo" label="工单号" sortable width="100">
                    </el-table-column>
                    <el-table-column prop="custName" label="客户" width="80">
                    </el-table-column>
                    <el-table-column prop="styleNo" label="货品款号" sortable width="106">
                    </el-table-column>
                    <el-table-column prop="placeorderAt" label="下单日期" sortable width="108" v-if="selectTrue">
                    </el-table-column>
                    <el-table-column prop="deliveryAt" label="交货日期" sortable width="108" v-if="selectTrue">
                    </el-table-column>
                    <el-table-column prop="" label="负责人" width="80" v-if="selectTrue">
                        <template slot-scope="scope">
                            <ul>
                                <li v-for="(item,index) of scope.row.missionLeaders">
                        <span class="span">
                            {{item}}
                        </span>
                                </li>
                            </ul>
                            <div @mouseover="scope.row.isExpand=true" @mouseleave="scope.row.isExpand=false"
                                 style="width:30%;height:100%;position:absolute;right:0;top:0;background:transparent;">
                                &emsp;
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="工单状态" width="100" v-if="selectTrue">
                        <template slot-scope="scope">
                            <div class="node" :class="{'blue':scope.row.status=='进行中','green':scope.row.status=='已完成'}">
                                {{scope.row.status}}
                            </div>
                            <div class="node" :class="{'blue':scope.row.status=='进行中','green':scope.row.status=='已完成'}">
                                {{scope.row.missionStatusNodeName}}
                            </div>
                            <div class="node">
                                <span v-if="scope.row.expiryAt>=0"
                                      style="color:#a2abb8;">还剩{{scope.row.expiryAt}}天</span>
                                <span v-if="scope.row.expiryAt<0" style="color:red;">延误{{-scope.row.expiryAt}}天</span>
                                <span v-if="scope.row.status=='已完成'&&scope.row.expiryAt > 3" style="color:#a2abb8;">{{scope.row.expiryAt}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="zip" label="节点详情">
                        <template slot-scope="scope">
                            <div @mouseover="scope.row.isExpand=true" @mouseleave="scope.row.isExpand=false"
                                 style="width:4%;height:100%;position:absolute;left:0;top:0;background:transparent;">
                                <div @click="trueShow"
                                     style="position:relative;width:100%;height:100%;display:flex;align-items:center;left:-3px;">
                                    <img v-show="scope.row.isExpand&&selectTrue"
                                         src="../../assets/images/icon_pack up.png">
                                </div>
                            </div>
                            <div v-if="!selectTrue" @mouseover="scope.row.isExpand=true"
                                 @mouseleave="scope.row.isExpand=false"
                                 style="width:4%;height:100%;position:absolute;left:0;top:0;background:transparent;">
                                <div @click="falseShow"
                                     style="position:relative;width:100%;height:100%;display:flex;align-items:center;left:-3px;">
                                    <img v-show="scope.row.isExpand&&!selectTrue"
                                         src="../../assets/images/icon_expand.png">
                                </div>
                            </div>
                            <div class="node">
                                <ul class="ul">
                                    <li v-for="(item,indexNode) of scope.row.instanceWorkflowList">
                                        <div class="node_like">
                                            <!--<h1>{{item}}</h1>-->
                                            <div class="node_name">
                                                {{item.nodeName}}
                                            </div>
                                            <div class="node_time">
                                                <span v-if="item.nodeCode==='totality'" class="black">{{item.nodeSKUList.missionNum}}</span>
                                                <span v-if="item.status==='未开始'" class="black">{{item.status}}</span>
                                                <span v-if="item.status==='进行中'" class="blue">{{item.status}}</span>
                                                <span v-if="item.status==='已完成'" class="green">{{item.status}}</span>
                                                <template v-if="item.nodeType !== '逻辑型'">
                                                    <span>{{ item.finishTotal }}/{{ item.missionNum }}</span>
                                                </template>
                                                <!-- <br/> -->
                                                <span v-if="item.expiryAts>=0" style="color:#a2abb8;">还剩{{item.expiryAts}}天</span>
                                                <span v-if="item.expiryAts<0"
                                                      style="color:red;">延误{{-item.expiryAts}}天</span>
                                                <span style="color:#a2abb8;"
                                                      v-if="item.status==='已完成'&&scope.row.expiryAt">{{item.expiryAts}}</span>
                                            </div>
                                        </div>
                                        <div class="table_node" v-if="item.isExpand">
                                            <service-table :tableData="item.tableData" :skuVal="item.skuVal"
                                                           :isChangeBg="true"></service-table>
                                        </div>
                                        <div @click="checkNodeInfo(scope.row.goodsId,indexNode,scope.$index,item)"
                                             v-if="!item.isExpand && (
                                        (item.nodeCode === 'quantitative-detail') || (item.nodeCode === 'quality-checking') || 
                                        (item.nodeCode === 'tail-out-store') || (item.nodeCode === 'tail-in-store') || 
                                        (item.nodeCode === 'actual-cutting')
                                        )" class="targetNum">
                                            <div v-if="!item.isExpand ||  (item.nodeCode === 'quantitative-detail') || (item.nodeCode === 'quality-checking') ||
                                        (item.nodeCode === 'tail-out-store') || (item.nodeCode === 'tail-in-store') || 
                                        (item.nodeCode === 'actual-cutting')">>>
                                            </div>
                                        </div>
                                        <div @click="checkNodeInfo(scope.row.goodsId,indexNode,scope.$index,item)"
                                             v-if="item.isExpand && (
                                        (item.nodeCode === 'quantitative-detail') || (item.nodeCode === 'quality-checking') || 
                                        (item.nodeCode === 'tail-out-store') || (item.nodeCode === 'tail-in-store') || 
                                        (item.nodeCode === 'actual-cutting')
                                        )" class="targetNum">
                                            <div v-if="formData[scope.$index].isExpand&&showNode == indexNode&&item.isExpand">
                                                <<
                                            </div>
                                            <div v-else><<</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </section>
        <!-- 员工 -->
        <section v-if="!noCheck&&loginType==0" class="worker-check">
            <div class="img-worker">
                <img src="../../assets/images/pic_nounnothing.png" alt="">
            </div>
        </section>
        <!-- 老板 -->
        <section v-if="!noCheck&&loginType!=0" class="boss-check">
            <div class="img-boss">
                <img src="../../assets/images/pic_bossnothing.png">
            </div>
        </section>
        <el-dialog :show-close="false" :visible.sync="visible.deleVisible" size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <p style="font-size:24px;margin-bottom:24px;">没有权限</p>
                    <p>如需查看报表，请联系老板在报表管理中授予您查看权限！</P>
                </div>
                <div style="margin-top:24px;">
                    <nf-button type="warning" @click="closeDialog">知道了</nf-button>
                </div>
            </div>
        </el-dialog>
        <div class="page" v-if="noCheck">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-size="20"
                           layout="total, prev, pager, next" :total="orderCount">
            </el-pagination>
        </div>
    </div>

</template>
<script>
    import selectSpecific from '../goods/child/selectSpecific.vue'
    import {
        queryFacMissionReportList,
        getGoodSkuList,
        getEasyCustomerListByUnitIds,
        getUnitListByUserId,
        getEasyGoodsList,
        getFacCommonSettings,
        getFacUnitSettings,
        getGoodsListByUnitIds,
        queryMissionLeadersByUnitIds
    } from '../../api/api';
    import ServiceTable from './formTable';
    import mixins from '@/components/order/orderDetail/mixin'

    export default {
        data() {
            return {
                isLoading: false,
                formData: [],
                showNode: '',
                show: {},
                skuList: [],
                customerList: [],
                customerId: [],
                goodsList: [],
                goodsOrderId: [],
                checked: false,
                facList: [],
                facId: [],
                manList: [],
                manId: [],
                showType: true,
                facInfo: {},
                noCheck: true,
                selectTrue: true,
                visible: {
                    deleVisible: false
                },
                orderStatus: [
                    {
                        value: '未开始',
                        id: 'WAIT_START'
                    },
                    {
                        value: '进行中',
                        id: 'ONGOING'
                    },
                    {
                        value: '已完成',
                        id: 'FINISH'
                    },
                    {
                        value: '已撤销',
                        id: 'CANCEL'
                    }
                ],
                orderStatusId: ['WAIT_START', 'ONGOING'],
                beginAt: '',
                endAt: '',
                searchOrderNo: '',
                typeArr: {
                    brandArr: ['ALL'],
                    designerArr: ['ALL'],
                    waveArr: ['ALL'],
                    kindArr: ['ALL'],
                    seasonArr: ['ALL'],
                    yearArr: ['ALL'],
                    tagArr: ['ALL']
                },
                currentPage1: 1,
                orderCount: 0,
                loginType: '',
                pickerOptions2: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 7
                                );
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 30
                                );
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '最近三个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(
                                    start.getTime() - 3600 * 1000 * 24 * 90
                                );
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },
                value6: '',
                value7: '',
                placeorderStartAt: '',
                placeorderEndAt: '',
                deliveryStartAt: '',
                deliveryEndAt: ''
            };
        },
        mixins: [mixins],
        components: {
            ServiceTable,
            selectSpecific
        },
        methods: {
            // remoteMethod(v) {
            //     if(v !== '') {
            //         this.getGoodsListByUnitIds(v)
            //     }
            // },
            //返回上一层
            goBackClick() {
                this.$router.push("/reportManage");
            },
            //获取规格选中
            sel(val) {
                this.typeArr.brandArr = val.brandArr;
                this.typeArr.designerArr = val.designerArr;
                this.typeArr.waveArr = val.waveArr;
                this.typeArr.seasonArr = val.seasonArr;
                this.typeArr.tagArr = val.tagArr;
                this.typeArr.kindArr = val.kindArr;
                this.typeArr.yearArr = val.yearArr;
            },
            trueShow() {
                this.selectTrue = false;
            },
            falseShow() {
                this.selectTrue = true;
            },
            //------- 搜索单号 -------
            remoteSearch(val) {
                this.searchForm('', '', '', val);
            },
            //-------- 客户筛选 ------
            getEasyCustomerListByUnitIds() {
                if (this.facId.length <= 0) {
                    var facId = ['ALL'];
                } else {
                    facId = this.facId;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    userId: this.userId,
                    token: '',
                    unitIds: facId,
                    keyword: ''
                };

                getEasyCustomerListByUnitIds(params).then(res => {
                    this.customerList = res.data.customerList;
                });
            },
            customerGet(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i] == '') {
                        this.customerId = [];
                    }
                }
            },
            // ----- 工厂筛选 ------
            getUnitListByUserId() {
                let params = {
                    userId: this.userId,
                    token: '',
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    keyword: ''
                };
                getUnitListByUserId(params).then(res => {
                    this.facList = res.data.unitList;
                });
            },
            facGet(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i] == '') {
                        this.facId = [];
                    }
                }
                this.getGoodsListByUnitIds();
                this.queryMissionLeadersByUnitIds();
                this.getEasyCustomerListByUnitIds();
            },
            // ------ 货品筛选 -------
            getGoodsListByUnitIds(keyword='') {
                if (this.facId.length <= 0) {
                    var facId = ['ALL'];
                } else {
                    facId = this.facId;
                }
                let params = {
                    userId: this.userId,
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    keyword,
                    unitIds: facId
                };
                getGoodsListByUnitIds(params).then(res => {
                    this.goodsList = res.data.goodsList;
                });
            },
            // goodsGet(val) {
            //     for (let i = 0; i < val.length; i++) {
            //         if (val[i] == '') {
            //             this.goodsOrderId = [];
            //         }
            //     }
            // },
            // ------负责人筛选 ----------
            queryMissionLeadersByUnitIds() {
                if (this.facId.length <= 0) {
                    var facId = ['ALL'];
                } else {
                    facId = this.facId;
                }
                let params = {
                    userId: this.userId,
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    keyword: '',
                    unitIds: facId,
                    token: ''
                };
                queryMissionLeadersByUnitIds(params).then(res => {
                    this.manList = res.data.missionLeaders;
                });
            },
            manGet(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i] == '') {
                        this.manId = [];
                    }
                }
            },
            // ------------ 工单状态 -----------
            orderStatusGet(val) {
                for (let i = 0; i < val.length; i++) {
                    if (val[i] == '') {
                        this.orderStatusId = [];
                    }
                }
            },
            // ------ 日期 ------
            beginDate(val) {
                console.log(val);
                val.split('至');
                console.log(val.split('至'));
                this.placeorderStartAt = val.split('至')[0];
                this.placeorderEndAt = val.split('至')[1];
            },
            endDate(val) {
                console.log(val);
                val.split('至');
                console.log(val.split('至'));
                this.deliveryStartAt = val.split('至')[0];
                this.deliveryEndAt = val.split('至')[1];
            },
            // ----- 员工和老板的数据调用 -----
            showTypeForm() {
                this.showType = !this.showType;
                if (!this.showType) {
                    if (this.loginType == '1') {
                        this.getFacCommonSettings();
                    } else {
                        this.getFacUnitSettings();
                    }
                }
            },
            sortTable(val) {
                var sort = val.order;
                if (sort == 'ascending') {
                    sort = 0;
                    this.searchForm(val.prop, sort, this.currentPage1, '');
                    return;
                } else {
                    sort = 1;
                    this.searchForm(val.prop, sort, this.currentPage1, '');
                    return;
                }
            },
            //判断是否为字符串
            isString(str) {
                return typeof str == 'string' && str.constructor == String;
            },
            //关闭dialog
            closeDialog() {
                this.visible.deleVisible = false;
            },
            //获取表格
            formReport() {
                if (this.$store.state.userInfo) {
                    // console.log(this.$store.state.userInfo, 'this.$store.state.userInfo');
                    this.loginType = this.$store.state.userInfo.type;
                }
                else {
                    this.loginType = '1';
                }
                if (this.loginType == '0') {
                    var unitIds = [
                        JSON.parse(sessionStorage.getItem('last_login')).id
                    ];
                } else {
                    unitIds = ['ALL'];
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    userId: this.userId,
                    orderNo: '',
                    customerId: ['ALL'],
                    styleId: ['ALL'],
                    leaders: ['ALL'],
                    status: this.orderStatusId,
                    pageNo: 1,
                    placeorderAt: '',
                    deliveryAt: '',
                    goodsFilter: [],
                    unitIds: unitIds
                };
                queryFacMissionReportList(params).then(async res => {
                    if (res.data.code == 4 || res.data.code == 6) {
                        // if(true){
                        this.noCheck = false;
                        if (this.loginType == 0) {
                            this.visible.deleVisible = true;
                        }
                        return;
                    }
                    this.formData = res.data.missionReport;
                    this.orderCount = res.data.pageCount;
                    for (let i = 0; i < this.formData.length; i++) {
                        this.$set(this.formData[i], 'isExpand', false);
                        if (this.formData[i].status == 'WAIT_START') {
                            this.formData[i].status = '未开始';
                        }
                        if (this.formData[i].status == 'ONGOING') {
                            this.formData[i].status = '进行中';
                        }
                        if (this.formData[i].status == 'FINISH') {
                            this.formData[i].status = '已完成';
                        }
                        let a = this.formData[i];
                        for (let j = 0; j < a.instanceWorkflowList.length; j++) {
                            this.$set(a.instanceWorkflowList[j], 'isExpand', false);
                            a.instanceWorkflowList[j].skuVal = {};
                            a.instanceWorkflowList[j].copySkuVal = {};
                            this.$set(this.formData[i].instanceWorkflowList[j],
                                'tableData',
                                {});
                            if (a.instanceWorkflowList[j].STATUS == '0') {
                                a.instanceWorkflowList[j].status = '未开始';
                            }
                            if (a.instanceWorkflowList[j].STATUS == '1') {
                                a.instanceWorkflowList[j].status = '进行中';
                            }
                            if (
                                ((a.instanceWorkflowList[j].nodeCode == 'quantitative-detail') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'tail-in-store') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'tail-out-store') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'actual-cutting') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'quality-checking')
                                )
                                && a.instanceWorkflowList[j].status == '进行中' && this.formData[i].cancel == '0') {
                                a.instanceWorkflowList[j]['isExpand'] = true;
                                const skuList = await this.fetchGoodSku(this.formData[i].goodsId);
                                const nodeSKUList = this.formData[i].instanceWorkflowList[j]['nodeSKUList'];
                                const skuVal = {};
                                const mixinData = this.regroupTaleData(skuList);
                                this.formData[i].instanceWorkflowList[j]['tableData'] = mixinData;
                                // console.warn(mixinData);
                                const isHideLength = !mixinData.lengths.length;
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'skuVal',
                                    this.getItemSkuVal(skuList, nodeSKUList, isHideLength)['skuVal']);
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'copySkuVal',
                                    this.getItemSkuVal(skuList, nodeSKUList, isHideLength)['copySkuVal']);
                            } else {
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'skuVal',
                                    {});
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'copySkuVal',
                                    {});
                            }
                            if (a.instanceWorkflowList[j].STATUS == '2') {
                                a.instanceWorkflowList[j].status = '已完成';
                            }
                            if (a.instanceWorkflowList[j].hasOwnProperty('expiryAt') && a.instanceWorkflowList[j].expiryAt) {
                                if (a.instanceWorkflowList[j].expiryAt.length > 0) {
                                    a.instanceWorkflowList[j].expiryAts = a.instanceWorkflowList[j].expiryAt;
                                }
                            }
                        }
                    }
                    this.isLoading = false;
                });
            },
            //点击打开table
            async checkNodeInfo(goodsId, index, nowIndex, item) {
                this.show = {};
                const skuList = await this.fetchGoodSku(goodsId);
                const mixinData = this.regroupTaleData(skuList);
                this.formData[nowIndex].instanceWorkflowList[index][
                    'tableData'
                    ] = mixinData;
                const isHideLength = !mixinData.lengths.length;
                for (let skuItem of skuList) {
                    const id = `${skuItem.color_id}-${skuItem.size_id}${
                        (!isHideLength && skuItem.standard_id) ? '-' + skuItem.standard_id : ''
                        }`;
                    this.formData[nowIndex].instanceWorkflowList[index].skuVal[
                        id
                        ] = {
                        ...skuItem,
                        num: '0',
                        finishNum: '0'
                    };
                    this.formData[nowIndex].instanceWorkflowList[index].copySkuVal[
                        id
                        ] = {
                        ...skuItem,
                        num: '0',
                        finishNum: '0'
                    };
                    for (let nodeItem of this.formData[nowIndex].instanceWorkflowList[index]['nodeSKUList']) {
                        if (nodeItem.skuId === skuItem.id) {
                            const id = `${skuItem.color_id}-${skuItem.size_id}${
                                (!isHideLength && skuItem.standard_id) ? '-' + skuItem.standard_id : ''
                                }`;
                            this.formData[nowIndex].instanceWorkflowList[
                                index
                                ].skuVal[id] = {
                                ...nodeItem
                            };
                            this.formData[nowIndex].instanceWorkflowList[
                                index
                                ].copySkuVal[id] = {
                                ...nodeItem
                            };
                        }
                    }
                }
                this.handleFilterSkuData(nowIndex, index, 0);
                this.show = this.formData[nowIndex].instanceWorkflowList[
                    index
                    ].tableData;
                item.isExpand = !item.isExpand;
                this.formData[nowIndex].isExpand = !this.formData[nowIndex]
                    .isExpand;
                this.showNode = index;
            },
            getItemSkuVal(skuList, nodeSKUList, isHideLength) {
                const skuVal = {},
                    copySkuVal = {};
                for (let skuItem of skuList) {
                    const id = `${skuItem.color_id}-${skuItem.size_id}${
                        (!isHideLength && skuItem.standard_id) ? '-' + skuItem.standard_id : ''
                        }`;
                    skuVal[id] = {
                        ...skuItem,
                        num: '0',
                        finishNum: '0'
                    };
                    copySkuVal[id] = {
                        ...skuItem,
                        num: '0',
                        finishNum: '0'
                    };
                    for (let nodeItem of nodeSKUList) {
                        if (nodeItem.skuId === skuItem.id) {
                            const id = `${skuItem.color_id}-${skuItem.size_id}${
                                (!isHideLength && skuItem.standard_id) ? '-' + skuItem.standard_id : ''
                                }`;
                            skuVal[id] = {
                                ...nodeItem
                            };
                            copySkuVal[id] = {
                                ...nodeItem
                            };
                        }
                    }
                }
                return {
                    skuVal,
                    copySkuVal
                };
            },
            //获取sku
            handleFilterSkuData(nowIndex, index, val) {
                this.$set(
                    this.formData[nowIndex].instanceWorkflowList[index],
                    'skuVal',
                    {
                        ...this.filterSkuVal(nowIndex, index, val)
                    }
                );
            },
            filterSkuVal(nowIndex, index, type) {
                let newSkuVal = {};
                if (type === 'all') {
                    return this.formData[nowIndex].instanceWorkflowList[index]
                        .copySkuVal;
                }
                for (let key in this.formData[nowIndex].instanceWorkflowList[index]
                    .copySkuVal) {
                    const finishNum = this.formData[nowIndex].instanceWorkflowList[
                        index
                        ].copySkuVal[key].finishNum;
                    const num = this.formData[nowIndex].instanceWorkflowList[index]
                        .copySkuVal[key].num;
                    if (!type) {
                        return this.formData[nowIndex].instanceWorkflowList[index]
                            .copySkuVal;
                    } else {
                        if (
                            finishNum < num ||
                            this.formData[nowIndex].instanceWorkflowList[index]
                                .copySkuVal[key].num -
                            this.formData[nowIndex].instanceWorkflowList[index]
                                .copySkuVal[key].finishNum <
                            0 ||
                            this.formData[nowIndex].instanceWorkflowList[index]
                                .copySkuVal[key].num ==
                            this.formData[nowIndex].instanceWorkflowList[index]
                                .copySkuVal[key].finishNum
                        ) {
                            const _finishNum =
                                this.formData[nowIndex].instanceWorkflowList[index]
                                    .copySkuVal[key].num -
                                this.formData[nowIndex].instanceWorkflowList[
                                    index
                                    ].copySkuVal[key].finishNum <
                                0
                                    ? 0
                                    : this.copySkuVal[key].num -
                                    this.copySkuVal[key].finishNum;
                            newSkuVal[key] = {
                                num: this.formData[nowIndex].instanceWorkflowList[
                                    index
                                    ].copySkuVal[key].num,
                                finishNum: _finishNum
                            };
                        } else {
                            newSkuVal[key] = {
                                num: this.formData[nowIndex].instanceWorkflowList[
                                    index
                                    ].copySkuVal[key].num,
                                finishNum: this.formData[nowIndex]
                                    .instanceWorkflowList[index].copySkuVal[key]
                                    .finishNum
                            };
                        }
                    }
                }
                return newSkuVal;
            },
            fetchGoodSku(goodsId) {
                const params = {
                    goodsId: goodsId
                };
                return getGoodSkuList(params).then(res => {
                    return res.data;
                });
            },
            //老板获取
            getFacCommonSettings() {
                let params = {
                    userId: this.userId,
                    token: '',
                    type: 'all'
                };
                getFacCommonSettings(params).then(res => {
                    // console.log(res, "111");
                    res.data.data.brand.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.designer.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.wave.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.season.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.tag.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.kind.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.year.unshift({value: '无', id: 'NOTHING'});
                    for (let i = 0; i < res.data.data.brand.length; i++) {
                        res.data.data.brand[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.designer.length; i++) {
                        res.data.data.designer[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.wave.length; i++) {
                        res.data.data.wave[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.season.length; i++) {
                        res.data.data.season[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.tag.length; i++) {
                        res.data.data.tag[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.kind.length; i++) {
                        res.data.data.kind[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.year.length; i++) {
                        res.data.data.year[i].isExpand = false;
                    }
                    this.facInfo = res.data.data;
                });
            },
            //员工获取
            getFacUnitSettings() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    token: '',
                    type: 'all'
                };
                getFacUnitSettings(params).then(res => {
                    // console.log(res, "222");
                    res.data.data.brand.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.designer.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.wave.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.season.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.tag.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.kind.unshift({value: '无', id: 'NOTHING'});
                    res.data.data.year.unshift({value: '无', id: 'NOTHING'});
                    for (let i = 0; i < res.data.data.brand.length; i++) {
                        res.data.data.brand[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.designer.length; i++) {
                        res.data.data.designer[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.wave.length; i++) {
                        res.data.data.wave[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.season.length; i++) {
                        res.data.data.season[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.tag.length; i++) {
                        res.data.data.tag[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.kind.length; i++) {
                        res.data.data.kind[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.year.length; i++) {
                        res.data.data.year[i].isExpand = false;
                    }
                    this.facInfo = res.data.data;
                });
            },
            //筛选
            searchForm(props, sort, pageNo, orderNo) {
                //状态(WAIT_START:未开始 ONGOING:进行中 FINISH:已完成 CANCEL:已撤销) 数组 全部传["ALL"]
                if (!this.isString(props)) {
                    props = '';
                }
                if (this.$store.state.userInfo) {
                    this.loginType = this.$store.state.userInfo.type;
                }
                else {
                    this.loginType = '1';
                }
                if (this.loginType == '1') {
                    if (this.facId.length <= 0) {
                        var facId = ['ALL'];
                    } else {
                        facId = this.facId;
                    }
                } else {
                    facId = [JSON.parse(sessionStorage.getItem('last_login')).id];
                }
                if (this.checked) {
                    var checked = 1;
                } else {
                    checked = 0;
                }
                if (this.orderStatusId.length == 0) {
                    var orderStatusId = ['ALL'];
                } else {
                    orderStatusId = this.orderStatusId;
                }
                if (this.customerId.length == 0) {
                    var customerId = ['ALL'];
                } else {
                    customerId = this.customerId;
                }
                if (this.goodsOrderId.length == 0|| (this.goodsOrderId.length == 1 && this.goodsOrderId[0] == '')) {
                    var goodsOrderId = ['ALL'];
                } else {
                    goodsOrderId = this.goodsOrderId;
                }
                if (this.manId.length == 0) {
                    var manId = ['ALL'];
                } else {
                    manId = this.manId;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    userId: this.userId,
                    unitIds: facId,
                    customerId: customerId,
                    styleId: goodsOrderId,
                    status: orderStatusId,
                    placeorderAt: this.beginAt,
                    deliveryAt: this.endAt,
                    alert: checked,
                    leaders: manId,
                    goodsFilter: [
                        {keyType: 2, valueType: this.typeArr.designerArr}, //设计师
                        {keyType: 3, valueType: this.typeArr.waveArr}, //波段
                        {keyType: 4, valueType: this.typeArr.kindArr}, //分类
                        {keyType: 5, valueType: this.typeArr.seasonArr}, //季节
                        {keyType: 6, valueType: this.typeArr.yearArr}, //年份
                        {keyType: 7, valueType: this.typeArr.tagArr}, //标签
                        {keyType: 8, valueType: this.typeArr.brandArr} //品牌
                    ],
                    pageNo: pageNo || 1,
                    sortBy: props || '',
                    sortNo: sort,
                    orderNo: orderNo || '',
                    placeorderStartAt: this.placeorderStartAt || '',
                    placeorderEndAt: this.placeorderEndAt || '',
                    deliveryStartAt: this.deliveryStartAt || '',
                    deliveryEndAt: this.deliveryEndAt || ''
                };
                console.log(JSON.stringify(params));
                this.isLoading = true;
                queryFacMissionReportList(params).then(async res => {
                    this.isLoading = false;
                    this.formData = res.data.missionReport;
                    this.orderCount = res.data.pageCount;
                    for (let i = 0; i < this.formData.length; i++) {
                        this.formData[i].isExpand = false;
                        if (this.formData[i].status == 'WAIT_START') {
                            this.formData[i].status = '未开始';
                        }
                        if (this.formData[i].status == 'ONGOING') {
                            this.formData[i].status = '进行中';
                        }
                        if (this.formData[i].status == 'FINISH') {
                            this.formData[i].status = '已完成';
                        }
                        let a = this.formData[i];
                        // if (this.formData[i].hasOwnProperty('expiryAt')) {
                        //     if (this.formData[i].expiryAt.length > 0) {
                        //     }
                        // }
                        console.log(this.formData[i].expiryAt);
                        for (let j = 0; j < a.instanceWorkflowList.length; j++) {
                            this.$set(a.instanceWorkflowList[j], 'isExpand', false);
                            a.instanceWorkflowList[j].skuVal = {};
                            a.instanceWorkflowList[j].copySkuVal = {};
                            this.$set(this.formData[i].instanceWorkflowList[j],
                                'tableData',
                                {});
                            if (a.instanceWorkflowList[j].STATUS == '0') {
                                a.instanceWorkflowList[j].status = '未开始';
                            }
                            if (a.instanceWorkflowList[j].STATUS == '1') {
                                a.instanceWorkflowList[j].status = '进行中';
                            }
                            if (
                                ((a.instanceWorkflowList[j].nodeCode == 'quantitative-detail') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'tail-in-store') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'tail-out-store') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'actual-cutting') ||
                                    (a.instanceWorkflowList[j].nodeCode == 'quality-checking')
                                )
                                && a.instanceWorkflowList[j].status == '进行中' && this.formData[i].cancel == '0') {
                                a.instanceWorkflowList[j]['isExpand'] = true;
                                const skuList = await this.fetchGoodSku(
                                    this.formData[i].goodsId
                                );
                                const nodeSKUList = this.formData[i]
                                    .instanceWorkflowList[j]['nodeSKUList'];
                                const skuVal = {};
                                const mixinData = this.regroupTaleData(skuList);
                                this.formData[i].instanceWorkflowList[j][
                                    'tableData'
                                    ] = mixinData;
                                const isHideLength = !mixinData.lengths.length;
                                this.$set(
                                    this.formData[i].instanceWorkflowList[j],
                                    'skuVal',
                                    this.getItemSkuVal(skuList, nodeSKUList, isHideLength)[
                                        'skuVal'
                                        ]
                                );
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'copySkuVal',
                                    this.getItemSkuVal(skuList, nodeSKUList, isHideLength)['copySkuVal']);
                            } else {
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'skuVal',
                                    {});
                                this.$set(this.formData[i].instanceWorkflowList[j],
                                    'copySkuVal',
                                    {});
                            }
                            if (a.instanceWorkflowList[j].STATUS == '2') {
                                a.instanceWorkflowList[j].status = '已完成';
                            }
                            if (
                                a.instanceWorkflowList[j].hasOwnProperty('expiryAt')
                            ) {
                                if (a.instanceWorkflowList[j].expiryAt) {
                                    if (a.instanceWorkflowList[j].expiryAt.length > 0) {
                                        a.instanceWorkflowList[j].expiryAts =
                                            a.instanceWorkflowList[j].expiryAt;
                                    }
                                }
                            }
                        }
                    }
                });
            },
            handleCurrentChange(val) {
                this.searchForm('', '', val, '');
            },
            // 通过子组件获取manid
            getManId(manId) {
                this.manId = manId
            }
        },
        created() {
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId;
            this.isLoading = true;
            this.formReport();
            this.getEasyCustomerListByUnitIds();
            this.getUnitListByUserId();
            this.getGoodsListByUnitIds();
            this.queryMissionLeadersByUnitIds();
        }
    };
</script>
<style lang="scss" scoped>
    .el-select-dropdown__item {
        font-size: 12px;
    }

    .forms_statistics {
        min-width: 1100px;
        height: 100%;
        .green {
            color: #23c811;
        }
        .blue {
            color: #1ca1ff;
        }
        .black {
            color: #2c2c2c;
        }
        .forms_header {
            height: 68px;
            background-color: #fff;
            padding: 0 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            .header_left {
                font-size: 24px;
                color: #2c2c2c;
            }
            .header_right {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .el-input__icon {
                    right: 25px;
                }
            }
        }
        .select_container {
            background-color: #fff;
            padding: 24px 32px;
            margin-bottom: 16px;
            .first_select {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #636363;
                font-size: 12px;
                margin-bottom: 16px;
                width: 100%;
                .select_block {
                    margin-right: 22px;
                    width: 25%;
                }
                .select_status {
                    width: 25%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .select_name {
                    margin-right: 10px;
                }
                .order_alert {
                    width: 257px;
                }
            }
            .second_select {
                display: flex;
                justify-content: space-between;
                align-items: center;
                span {
                    color: #636363;
                    cursor: pointer;
                    font-size: 12px;
                }
                .el-icon-caret-bottom {
                    transition: all 0.5s;
                }
                .el-icon-caret-bottom_show {
                    transform: rotate(180deg);
                    transition: all 0.5s;
                }
            }
            .third_select {
                font-size: 12px;
                margin-top: 8px;
            }
        }
        .forms_container {
            width: 100%;
            display: flex;
            .node {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                width: 100%;
                .ul {
                    display: flex;
                    justify-content: flex-start;
                    li {
                        display: flex;
                        justify-content: flex-start;
                        .targetNum {
                            cursor: pointer;
                            min-width: 24px;
                            min-height: 52px;
                            box-sizing: border-box;
                            background-color: #f7f7f7;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #a2abb8;
                            font-size: 12px;
                            border-right: 1px solid #e6e8eb;
                            &:hover {
                                background-color: #efefef;
                            }
                        }
                        .node_name {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-width: 80px;
                            height: 28px;
                            background-color: #fff;
                            font-weight: bold;
                            border-bottom: 1px solid #e6e8eb;
                            &:last-child {
                                border-right: transparent;
                            }
                        }
                        .node_time {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            box-sizing: border-box;
                            min-width: 80px;
                            background-color: #fff;
                            flex: 1;
                            height: 60%;
                        }
                        .table_node {
                            display: flex;
                            justify-content: flex-start;
                            .success_time {
                                width: 80px;
                                height: 100%;
                                .header_time {
                                    height: 50%;
                                    width: 100%;
                                    background-color: #f2f7ff;
                                    font-size: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #6381a6;
                                    border-bottom: 1px solid #e6e8eb;
                                    border-right: 1px solid #e6e8eb;
                                }
                                .success_time_easy {
                                    height: 50%;
                                    width: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    color: #a2abb8;
                                    border-right: 1px solid #e6e8eb;
                                }
                            }
                        }
                        .node_like {
                            border-right: 1px solid #e6e8eb;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
        .worker-check {
            background-color: #fff;
            min-height: 620px;
            .img-worker {
                width: 100%;
                display: flex;
                justify-content: center;
                img {
                    width: 406px;
                    height: 224px;
                    opacity: 0.6;
                    margin-top: 120px;
                }
            }
        }
        .boss-check {
            background-color: #fff;
            min-height: 620px;
            .img-boss {
                width: 100%;
                display: flex;
                justify-content: center;
                img {
                    width: 279px;
                    height: 222px;
                    opacity: 0.6;
                    margin-top: 120px;
                }
            }
        }
        .page {
            margin: 20px 0;
            text-align: right;
            margin-right: 32px;
        }
    }
</style>
<style lang="scss">
    .home_content .home_content--main {
        padding-top: 16px;
    }

    #forms_statistics {
        .page_title--head {
            font-size: 16px;
            line-height: 32px;
        }
        .report-wrap {
            .nf-button--default {
                width: 72px;
                font-size: 12px !important;
            }
        }
        .el-checkbox__label {
            font-size: 12px;
        }
        .is-plain.nf-button--warning {
            width: 90px;
            font-size: 12px !important;
        }
        .el-table {
            border: 1px solid #e6e8eb;
        }
        .el-table td {
            border-right: 1px solid #e6e8eb;
            border-bottom: 1px solid #e6e8eb;
            background-color: #fff;
            padding: 0;
        }
        .el-table td .cell {
            line-height: 18px;
            background-color: #fff;
            padding: 0;
        }
        .el-table td, .el-table th.is-leaf {
            padding: 0;
        }
        thead tr th {
            background-color: #f7f7f7;
            height: 32px;
        }
        .el-table__fixed-header-wrapper thead div {
            background-color: #f7f7f7;
            color: #81868c;
        }
        .el-table__header-wrapper thead .cell {
            background-color: #f7f7f7;
            color: #81868c;
            padding: 0 12px;
        }
        .el-table_1_column_9.is-leaf {
            .cell {
                text-align: left;
            }
        }
        tr {
            height: 27px;
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
        .el-table tbody td {
            padding: 0;
        }
        .el-table__body tbody .el-table__row .el-table_1_column_8 {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
                padding: 0;
            }
        }
        .el-table__body tbody .el-table__row .el-table_1_column_16 {
            padding-top: 0;
            padding-bottom: 0;
            .cell {
                padding: 0;
            }
        }
        .first_select .el-input__inner {
            font-size: 12px;
            &::-webkit-input-placeholder {
                color: #2c2c2c;
            }
        }
        .el-checkbox__inner {
            width: 16px;
            height: 16px;
            border-radius: 2px;
            border: solid 1px #dce0e6;
            &::after {
                top: 0;
                left: 4px;
            }
        }
        header .el-input {
            width: 200px;
            &::-webkit-input-placeholder {
                color: #2c2c2c;
            }
        }
        .first_select .select_block .times .el-input__inner {
            &::-webkit-input-placeholder {
                color: #babdc2;
            }
        }
        .header_right {
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        .el-select {
            width: 72%;
        }
        .el-date-editor.el-input {
            width: 86.7%;
        }
        .dialog-content-wrap {
            text-align: center;
        }
    }
</style>
