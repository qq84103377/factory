<template>
    <div class="look-wym-status" v-loading="bigLoadiing">
        <page-title title="唯一码状态">
            <nf-button @click="$router.go('-1')">返回上级</nf-button>
        </page-title>
        <div class="base-info-mission">
            <div class="base-info-list">
                <div class="second-info">
                    <div>
                        <span class="gray">货品款号</span>
                        <span>{{wymInfo.styleNo}}</span>
                    </div>
                    <div>
                        <span class="gray">货品名称</span>
                        <span>{{wymInfo.goodsName}}</span>
                    </div>
                    <div>
                        <span class="gray">工单号</span>
                        <span>{{wymInfo.orderNo}}</span>
                    </div>
                    <div>
                        <span class="gray">&emsp;客户</span>
                        <span>{{wymInfo.customerName}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="select-mission">
            <div class="select-mission-wym">
                <div class="bed-num">
                    <span class="select-name">状态</span>
                    <el-select v-model="orderStatus" placeholder="全部">
                        <el-option v-for="(item,index) in orderStatusList" :key="index" :label="item.name"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="bed-num">
                    <span class="select-name">床次</span>
                    <el-select v-model="bedNum" multiple placeholder="全部">
                        <el-option v-for="(item,index) in wymInfo.latheNames" :key="index" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div class="bed-num">
                    <span class="select-name">唯一码</span>
                    <el-input v-model="WYMLikeColumn" placeholder="请输入"></el-input>
                </div>

            </div>
            <div>
                <nf-button style="width:72px;" @click="wymStatusReset">重置</nf-button>
                <nf-button style="width:72px;" @click="exportGo">导出</nf-button>
                <nf-button style="background:#54d1bc;width:72px;color:#fff;" @click="wymStatus">筛选</nf-button>
            </div>
        </div>
        <template>
            <el-table ref="multipleTable" @selection-change="handleSelectionChange" @select-all="handleSelectionAll"
                       :data="ywmData" border
                      style="overflow-x:hidden;width: 100%;margin-bottom:24px;">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column prop="lathe" label="床次" :sortable="true" width="100">
                </el-table-column>
                <el-table-column prop="latheNo" label="本次序号" :sortable="true" width="120">
                </el-table-column>
                <el-table-column prop="WYM" label="唯一码" :sortable="true" width="140">
                </el-table-column>
                <el-table-column prop="orderNo" label="工单号"  width="160">
                </el-table-column>
                <el-table-column prop="styleNo" label="货品款号" width="140">
                </el-table-column>
                <el-table-column prop="outSideFactoryName" label="外发厂" width="100" v-if="wymInfo.outSideFlag">
                </el-table-column>
                <el-table-column prop="colorName" label="颜色" width="140">
                </el-table-column>
                <el-table-column prop="sizeName" label="尺码" width="80">
                </el-table-column>
                <el-table-column prop="standardName" label="内长" width="80">
                </el-table-column>
                <el-table-column prop="reportStatus" label="状态"
                                 align="center"
                                 width="140">
                    <template slot-scope="scope">
                                <span v-if="!$route.query.quality" :class="{'gray':scope.row.reportStatus == 4,'blue':scope.row.reportStatus == 3,
                                'orange':scope.row.reportStatus == 2,'green':scope.row.reportStatus == 1,}">
                                    {{scope.row.reportStatus | filterStatus}}
                                </span>
                        <span v-if="$route.query.quality" :class="{'gray':scope.row.reportStatus == 4, 'waste-color':scope.row.reportStatus == 3,
                        'defective-color':scope.row.reportStatus == 2,'qualified-color':scope.row.reportStatus == 1,}">
                            {{getStatusText(scope.row.reportStatus)}}{{(scope.row.reportStatus == 2 && scope.row.repairTimes > 0) ? `(返修${scope.row.repairTimes}次)` : ''}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="standardName" label="操作" width="100">
                    <template slot-scope="scope">
                                <span v-if="!$route.query.quality" @click="reportOpera(scope.row)"
                                      :class="{'blue-report':scope.row.reportStatus==4,'gray-report':scope.row.reportStatus!=4,}">{{scope.row.reportStatus!=4?'取消上报':'手动上报'}}</span>
                        <icon-button v-if="$route.query.quality && (scope.row.reportStatus===2||scope.row.reportStatus===4)" class="color-blue" @click="handleEdit(scope.row)">
                            {{scope.row.reportStatus!=4?'修改':'手动上报'}}
                        </icon-button>
                    </template>
                </el-table-column>
                <el-table-column prop="finishUserName" label="完成人员" width="100">
                </el-table-column>
                <el-table-column prop="finishDate" label="完成日期" width="120">
                </el-table-column>
                <el-table-column prop="oldFinishUserName" label="上次操作人" width="130">
                </el-table-column>
                <el-table-column prop="oldFinishDate" label="上次操作时间" width="140">
                </el-table-column>

            </el-table>
        </template>
        <div class="page" style="float: right;">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="pageTotal">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="visible.handReport" :size="full" :show-close="false">
            <span v-if="handReportData.length!=0" slot="title"
                  class="title-report">{{handReportData[0].WYM}}-手动上报</span>
            <div class="bed-num" style="margin-bottom: 10px;">
                <span style="display:inline-block;width:80px;">入库仓库：</span>
                <el-select
                        v-model="storeId"
                        @change="storeChange"
                        placeholder="请选择入库仓库">
                    <el-option
                            v-for="(storeItem, storeIndex) in store"
                            :key="storeIndex" :label="storeItem.name"
                            :value="storeItem.id">
                    </el-option>
                </el-select>
            </div>
            <template>
                <el-table :data="handReportData" border max-height="420"
                          style="overflow-x:hidden;width: 100%;margin-bottom:24px;">
                    <el-table-column prop="lathe" label="床次" width="100">
                    </el-table-column>
                    <el-table-column prop="latheNo" label="本次序号" width="120">
                    </el-table-column>
                    <el-table-column prop="WYM" label="唯一码" width="140">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="工单号">
                    </el-table-column>
                    <el-table-column prop="styleNo" label="货品款号" width="100">
                    </el-table-column>
                    <el-table-column prop="colorName" label="颜色" width="140">
                    </el-table-column>
                    <el-table-column prop="sizeName" label="尺码" width="80">
                    </el-table-column>
                    <el-table-column prop="standardName" label="内长" width="80">
                    </el-table-column>
                    <el-table-column prop="reportStatus" label="状态" width="100">
                        <template slot-scope="scope">
                                <span style="text-decoration:none;"
                                      :class="{'no-report':scope.row.reportStatus==4,'yes-report':scope.row.reportStatus!=4}">
                                    {{scope.row.reportStatus | filterStatus}}
                                </span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div style="color:#fa4150;margin:24px 0;text-align:center;">
                是否确定上报这条唯一码对应的货品吗？
            </div>
            <span slot="footer" style="display:flex;justify-content:flex-end;align-items:center;">
                    <nf-button style="margin-right:24px;" class="report-btn"
                               @click="visible.handReport = false">取消</nf-button>
                    <nf-button class="report-btn" type="warning" :loading="visible.btnLoading"
                               @click="handReport">确定</nf-button>
                </span>
        </el-dialog>
        <el-dialog :visible.sync="visible.cancelReport" :size="full" :show-close="false">
            <span v-if="cancelReportData.length!=0" slot="title"
                  class="title-report">{{cancelReportData[0].WYM}}-取消上报</span>
            <template>
                <el-table :data="cancelReportData" border max-height="420"
                          style="overflow-x:hidden;width: 100%;margin-bottom:24px;">
                    <el-table-column prop="lathe" label="床次" width="100">
                    </el-table-column>
                    <el-table-column prop="latheNo" label="本次序号" width="120">
                    </el-table-column>
                    <el-table-column prop="WYM" label="唯一码" width="140">
                    </el-table-column>
                    <el-table-column prop="orderNo" label="工单号">
                    </el-table-column>
                    <el-table-column prop="styleNo" label="货品款号" width="100">
                    </el-table-column>
                    <el-table-column prop="colorName" label="颜色" width="140">
                    </el-table-column>
                    <el-table-column prop="sizeName" label="尺码" width="80">
                    </el-table-column>
                    <el-table-column prop="standardName" label="内长" width="80">
                    </el-table-column>
                    <el-table-column prop="reportStatus" label="状态" width="100">
                        <template slot-scope="scope">
                                <span style="text-decoration:normal;"
                                      :class="{'no-report':scope.row.reportStatus==4,'yes-report':scope.row.reportStatus!=4}">
                                    {{scope.row.reportStatus | filterStatus}}
                                </span>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div style="color:#fa4150;margin:24px 0;text-align:center;">
                是否确定取消上报这条唯一码对应的货品吗？
            </div>
            <span slot="footer" style="display:flex;justify-content:flex-end;align-items:center;">
                    <nf-button style="margin-right:24px;" class="report-btn"
                               @click="visible.cancelReport = false">取消</nf-button>
                    <nf-button class="report-btn" type="warning" :loading="visible.btnLoading"
                               @click="cancelReport">确定</nf-button>
                </span>
        </el-dialog>
        <!--全选操作-->
        <el-dialog class="custom-dialog"
                   :visible.sync="exportAllDialog"
                   :show-close="false"
                   title="全选操作"
                   :close-on-click-modal="false"
                   size="tiny">
            <div style="padding-left: 100px;">
                <el-radio class="radio" v-model="radio" label="filterAll">选择筛选条件下所有数据</el-radio>
                <br>
                <el-radio class="radio" v-model="radio" label="curPageAll">选择当前页数据</el-radio>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="visible.btnLoading" @click="exportWYMStatus">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle"  size="large" custom-class="nf-dialog-common" :visible.sync="visibleReport" :show-close="false" :close-on-click-modal="false">
            <div v-loading="isLoadiing">
                <div style="display: flex;align-items: center;margin-bottom: 8px;">
                    <span style="margin-right: 10px;">入库仓库</span>
                    <el-select v-show="activeIndex==0&&associateInStore" v-model="storehouseId" placeholder="请选择">
                        <el-option
                                v-for="item in storehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <detail-list style="margin-bottom: 0" :tableData="reportingData"></detail-list>
                <div style="margin: 16px 0">
                    <el-button type="text" v-show="status !== 4" @click="handleCancelReport">改为未上报</el-button>
                </div>
                <div class="dialog-content">
                    <good-type :activeIndex="activeIndex" :status="status" :reportingData="reportingData" @on-item-click="handleSelectType"></good-type>
                    <defective-select v-show="(activeIndex === 1 && defectiveLabelList.length) || reportingData[0] && reportingData[0].reportStatus === 2" :options="defectiveLabelList" v-model="selectDefectiveIds"></defective-select>
                </div>
                <el-row class="dialog-footer" slot="footer" type="flex" justify="center" align="center" v-show="activeIndex === 1">
                    <div>
                        <nf-button type="warning" @click="handleSubmitDefective">确 定</nf-button>
                    </div>
                </el-row>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    import {
        wyMList, wymStatus, cancelReport,getStorehousesByUserId,
        handReport, exportWYMStatus, storeList,prcdNodeReports,facDefectiveLabels,repairedReport
    } from '../../../api/api'
    import DetailList from '@/components/order/quality-checking-report/detailList'
    import GoodType from '@/components/order/quality-checking-report/goodType'
    import DefectiveSelect from '@/components/order/quality-checking-report/defectiveSelected'
    let Base64 = require('js-base64').Base64;
    export default {
        data() {
            return {
                storehouseId: '',
                storehouseList: [],
                bigLoadiing: false,
                isLoadiing: false,
                exportAllDialog: false,
                radio: 'filterAll',
                visible: {
                    btnLoading: false,
                    handReport: false,
                    cancelReport: false,
                },
                orderStatus: '0',
                handReportData: [],
                cancelReportData: [],
                bedNum: [],
                man: [],
                options: [
                    {
                        value: 1,
                        label: 1,
                    }
                ],
                orderStatusList: [
                    {value: '0', name: '全部'},
                    {value: '1', name: '已上报'},
                    {value: '4', name: '未上报'},
                ],
                WYMLikeColumn: '',
                currentPage: 1,
                pageTotal: 1,
                bedCount: 0,
                ywmData: [],
                wymInfo: {},
                orderByLathe: "0",
                orderByWYM: "0",
                section: [],
                sectionAll: [],
                store: [],
                storeId: '',

                visibleReport:false,
                dialogTitle: '',
                selectDefectiveIds: [],
                activeIndex: '',
                reportingData:[],
                defectiveLabelList: [],

                filterAllSelParams:'',
                toggleRowSelection:true,
                filterAllSel:false,
                ywmDataLengthAllSel:0,

            }
        },
        components: {
            DetailList,
            GoodType,
            DefectiveSelect,
        },
        computed:{
            associateInStore() {
              return this.$route.query.associateInStore == 1
            },
            dialogTitle() {
                const wym = this.reportingData[0] && this.reportingData[0].WYM
                const title = this.getStatusText(this.status);
                return `${wym}-${title}`;
            },
            status() {
                const reportStatus = this.reportingData[0] && this.reportingData[0].reportStatus;
                return reportStatus;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        filters: {
            filterStatus(val) {
                if (val == 1) {
                    return "已上报";
                }
                if (val == 4) {
                    return "未上报";
                }
            }
        },
        methods: {
            getStorehousesList(){
                getStorehousesByUserId({facId:this.facId,userId:this.userId,kind: 1}).then(res => {
                    this.storehouseList = res.data.data
                    const defaultStorehouseTag = res.data.data.find(
                        item => item.defaultStorehouseTag === 1
                    );
                    if (defaultStorehouseTag) {
                        this.storehouseId = defaultStorehouseTag.id;
                    }
                    else {
                        this.storehouseId = res.data.data[0].id;
                    }
                })
            },
            storeList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses;
                    this.storeId = res.data.storehouses[0].id;
                    // this.storeName = res.data.storehouses[0].name;
                });
            },
            //重置
            wymStatusReset() {
                this.orderStatus = '0';
                this.WYMLikeColumn = '';
                this.lathes = '';
                this.bedNum = [];
            },
            //获取列表
            wymStatus() {
                this.bigLoadiing = true;
                let params = {
                    missionNodeId: this.$route.query.instanceId,
                    orderByLathe: this.orderByLathe,
                    orderByWYM: this.orderByWYM,
                    status: this.orderStatus,
                    WYMLikeColumn: this.WYMLikeColumn,
                    lathes: this.bedNum,
                    pageNo: this.currentPage,
                    "pageSize": 20
                };
                wymStatus(params).then(res => {
                    console.log(res);
                    this.bigLoadiing = false;
                    if (res.data.code == 0) {
                        this.ywmData = res.data.data.list;
                        this.pageTotal = res.data.data.totalCount
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //获取信息
            getwyMList() {
                let params = {
                    lathes: this.bedNum,
                    missionId: this.$route.query.missionId,
                    missionNodeId: this.$route.query.instanceId,
                    finishStartDate: this.placeorderStartAt,
                    finishEndDate: this.placeorderEndAt,
                    userIds: this.man,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    orderByLathe: this.orderByLathe,
                    orderByWYM: this.orderByWYM
                };
                wyMList(params).then(res => {
                    this.wymInfo = res.data.wymInfo;
                })
            },
            // 导出
            exportGo() {
                if(this.filterAllSel){
                    this.exportAllDialog = true
                    return
                }
                //有勾选项
                let params = {};
                let sec = this.section
                if (sec.length) {
                    // if(this.filterAllSel){
                    //     //勾选筛选下的全部
                    //     params = JSON.parse(this.filterAllSelParams)
                    // }else {
                        let uniques = []
                        sec.forEach(item => {
                            uniques.push(item.uniqueId)
                        });
                        params = {uniques}
                    // }

                } else {
                    params = {
                        orderByLathe: this.orderByLathe,
                        orderByWYM: this.orderByWYM,
                        status: this.orderStatus,
                        WYMLikeColumn: this.WYMLikeColumn,
                        lathes: this.bedNum,
                    };
                }
                params.missionNodeId = this.$route.query.instanceId
                exportWYMStatus(params).then(res => {
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '样表文件' + this.currentTime() + '.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            handleSelectionChange(sec) {
                console.log(sec);
                if(!this.toggleRowSelection){
                    return
                }
                if(sec.length!==this.ywmData.length){
                    this.filterAllSel = false
                }
                this.section = JSON.parse(JSON.stringify(sec))

            },
            handleSelectionAll(sec) {
                // this.sectionAll = JSON.parse(JSON.stringify(sec))
                console.log(sec);
                if(sec.length){
                    this.filterAllSel = true
                }else {
                    this.filterAllSel = false
                }
                // this.exportAllDialog = true
            },
            exportWYMStatus() {
                let params = {
                    missionNodeId: this.$route.query.instanceId,
                    orderByLathe: this.orderByLathe,
                    orderByWYM: this.orderByWYM,
                    status: this.orderStatus,
                    WYMLikeColumn: this.WYMLikeColumn,
                    lathes: this.bedNum,
                };
                if(this.radio === 'filterAll'){
                    //全选筛选条件下的数据
                    this.filterAllSel = true;
                    this.ywmDataLengthAllSel = this.ywmData.length
                    this.filterAllSelParams = JSON.stringify(params)
                }
                // this.exportAllDialog = false
                if (this.radio === 'curPageAll') {
                    params.pageNo = this.currentPage;
                    params.pageSize = 20;
                }
                this.visible.btnLoading = true;
                exportWYMStatus(params).then(res => {
                    this.visible.btnLoading = false;
                    this.exportAllDialog = false

                    this.ywmData.forEach(row => {
                        console.log(row);
                        this.$refs.multipleTable.toggleRowSelection(row, false);
                    });

                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '样表文件' + this.currentTime() + '.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);


                })
            },
            // 获取当前时间
            currentTime() {
                let now = new Date()
                let year = now.getFullYear()
                let month = now.getMonth() + 1
                let day = now.getDate()

                let hh = now.getHours()
                let mm = now.getMinutes()
                let ss = now.getSeconds()

                var clock = year

                if (month < 10)
                    clock += '0'

                clock += month

                if (day < 10)
                    clock += '0'

                clock += day

                if (hh < 10)
                    clock += '0'

                clock += hh
                if (mm < 10) clock += '0'
                clock += mm

                if (ss < 10) clock += '0'
                clock += ss
                return clock
            },
            //页码
            handleCurrentChange(val) {
                this.wymStatus();
                // if(this.filterAllSel){
                //     this.bigLoadiing = true;
                //
                //     let params = JSON.parse(this.filterAllSelParams);
                //     params.pageNo = this.currentPage;
                //     params.pageSize = 20;
                //     wymStatus(params).then(res => {
                //         console.log(res);
                //         this.bigLoadiing = false;
                //         if (res.data.code == 0) {
                //             this.ywmData = res.data.data.list;
                //             this.pageTotal = res.data.data.totalCount;
                //             this.toggleRowSelection = false
                //             this.$nextTick(function () {
                //                 this.ywmData.forEach(item=>{
                //                     this.$refs.multipleTable.toggleRowSelection(item,true);
                //                 })
                //
                //                 this.toggleRowSelection = true
                //             })
                //
                //         } else {
                //             this.$message.error(res.data.msg);
                //         }
                //     });
                // }else {
                //     this.wymStatus();
                // }

            },
            reportOpera(row) {
                console.log(row);
                if (row.reportStatus == 4) {
                    this.handReportData = [row];
                    this.visible.handReport = true;
                    // this.visible.wymDialogVisible = true;
                } else {
                    this.cancelReportData = [row];
                    this.visible.cancelReport = true;
                    // this.visible.wymDialogVisible = true;
                }
            },

            //单件流
            fetchFacDefectiveLabels() {
                facDefectiveLabels({
                    userId: this.userId,
                    facId: JSON.parse(sessionStorage.getItem('user_login')).unitId
                })
                    .then(res => {
                        this.defectiveLabelList = res.data.data;
                    })
            },
            handleSubmitDefective() {
                if (this.status !== 2) {
                    this.reportByType(1);
                    return;
                }
                // 再修
                this.isLoadiing = true
                repairedReport({
                    defectiveLabelIds : this.selectDefectiveIds,
                    instanceId: this.$route.query.instanceId,
                    wymId: this.reportingData[0].uniqueId,
                    userId: this.userId
                })
                    .then(res => {
                        this.isLoadiing = false
                        if (res.data.code === 0) {
                            this.$message.success(res.data.msg);
                            this.visibleReport = false;
                            this.wymStatus();
                            return;
                        }else {
                            this.$message.error(res.data.msg);
                        }

                    })
            },
            getStatusText(val) {
                switch (val) {
                    case 1: return '合格品';
                    case 2: return '次品';
                    case 3: return '废品';
                    default: return '未上报'
                }
            },
            handleCancelReport() {
                const { missionNodeId, uniqueId } = this.reportingData[0];
                cancelReport({
                    userId: this.userId,
                    instanceId: missionNodeId,
                    wymId: uniqueId
                })
                    .then(res => {
                        if (res.data.code === 0) {
                            this.$message.success('修改成功');
                            this.wymStatus();
                            this.visibleReport = false;
                            return
                        }
                        this.$message.error(res.data.msg);
                    });
            },
            handleSelectType(index) {
                this.activeIndex = index;
                const status = index + 1;
                if (index === 1) return;
                if (index === 0 && this.associateInStore && !this.storehouseId) return this.$message.error('请选择入库仓库');
                if (this.status !== 0 || this.status !== 4) {
                    this.reportByType(index);
                }
            },
            reportByType(index) {
                if (index === 0) {
                    this.reportAPi('qualified', index);
                }
                else if (index === 1) {
                    this.reportAPi('defectived', index);
                }
                else if (index === 2) {
                    this.reportAPi('wasted', index);
                }
            },
            reportAPi(type) {
                const params = {
                    type,
                    instanceId: this.$route.query.instanceId,
                    wymId: this.reportingData[0].uniqueId,
                    userId: this.userId,
                    storehouseId: (this.associateInStore&&type=='qualified')?this.storehouseId:''
                }
                this.isLoadiing = true
                if (type === 'defectived') {
                    params.defectiveLabelIds = this.selectDefectiveIds;
                }
                prcdNodeReports(params)
                    .then(res => {
                        this.isLoadiing = false
                        if (res.data.code === 0) {
                            this.$message.success('操作成功')
                            this.visibleReport = false;
                            this.wymStatus();
                            return
                        }else {
                            this.$message.error(res.data.msg)
                        }

                    });
            },
            handleEdit(row) {
                console.log(row);
                this.reportingData = [row];
                this.activeIndex = '';
                this.selectDefectiveIds = [];
                if (row.reportStatus === 2 && row.defectiveIds) {
                    this.selectDefectiveIds = row.defectiveIds;
                    this.activeIndex = 1;
                }
                if (row.reportStatus === 1 && row.defectiveIds) {
                    this.activeIndex = 0;
                }
                if (row.reportStatus === 3 && row.defectiveIds) {
                    this.activeIndex = 2;
                }
                this.$nextTick(() => {
                    this.visibleReport = true;
                });
            },
            //上报
            handReport() {
                let params = {
                    instanceId: this.$route.query.instanceId,
                    userId: this.$store.state.userInfo.id,
                    wymId: this.handReportData[0].uniqueId,

                };
                if (this.$route.query.store) {
                    params.storehouseId = this.storeId
                }

                this.visible.btnLoading = true;
                handReport(params).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$message.success("上报成功");
                        this.visible.handReport = false;
                        this.wymStatus();
                        // this.addReportSuccess();
                        // this.outsideFactorySku()
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.visible.btnLoading = false;
                });
            },
            cancelReport() {
                let params = {
                    instanceId: this.$route.query.instanceId,
                    userId: this.$store.state.userInfo.id,
                    wymId: this.cancelReportData[0].uniqueId
                };
                this.visible.btnLoading = true;
                cancelReport(params).then(res => {
                    console.log(res);
                    if (res.data.code == 0) {
                        this.$message.success("取消上报成功");
                        this.wymStatus();
                        this.visible.cancelReport = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.visible.btnLoading = false;
                });
            },
        },
        created() {
            this.userId = this.$store.state.userInfo.id ||
                JSON.parse(sessionStorage.getItem("user_login")).userId;
            this.getwyMList();
            this.wymStatus();
            this.storeList();
            this.fetchFacDefectiveLabels();
            this.getStorehousesList();
        }
    }
</script>

<style lang="scss" scoped>
    .look-wym-status {

        .gray-report {
            text-decoration: underline;
            color: #808080;
            cursor: pointer;
        }
        .outsideBtn {
            margin-left: 5px;
            &:hover {
                color: #3b3b3b;
            }
        }
        .qualified-color {
            color: #23c811;
        }
        .defective-color {
            color: #ff7f14;
        }
        .waste-color {
            color: #fa4150;
        }
        .desc-color {
            color: #808080;
        }
        .color-blue {
            color: #1ca1ff;
        }
        .blue-report {
            text-decoration: underline;
            color: #1ca1ff;
            cursor: pointer;
        }
        .base-info-mission {
            width: 100%;
            height: 80px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            padding: 16px 32px;
            box-sizing: border-box;
            display: flex;
            justify-content: flex-start;
            margin-bottom: 16px;
            .img {
                width: 48px;
                height: 48px;
                border: 1px solid #f0f2f5;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .base-info-list {
                display: flex;
                justify-content: flex-start;
                width: 100%;
                padding: 0 32px;
                height: 100%;
                .second-info {
                    /*height: 100%;*/
                    display: flex;
                    line-height: 48px;
                    /*justify-content: space-between;*/
                    /*align-items: stretch;*/
                    /*flex-direction: column;*/
                    margin-right: 80px;
                    & > div {
                        margin-right: 50px;
                    }
                }
                .third-info {
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    flex-direction: column;
                }
                .gray {
                    color: #a2abb8;
                    margin-right: 12px;
                }
            }
        }
        .select-mission {
            width: 100%;
            height: 76px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            box-sizing: border-box;
            padding: 16px 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .select-mission-wym {
            display: flex;
            justify-content: flex-start;
            .bed-num {
                margin-right: 32px;
            }
            .select-name {
                display: inline-block;
                margin-right: 12px;
                color: #000;
            }
            .el-input__inner {
                width: 200px;
            }
        }
        .wym-download {
            margin: 16px 0;
            height: 36px;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .icon-tip {
                margin-right: 12px;
            }
        }
        .bed-list {
            box-sizing: border-box;
            background-color: #fff;
            padding-bottom: 24px;
            .page {
                margin: 20px 0;
                text-align: right;
                margin-right: 32px;
            }
        }
    }
</style>
<style lang="scss">
    .look-wym-status {
        .bed-num {
            .el-input, .el-input__inner {
                width: 200px;
            }
        }
        /*.select-name,.bed-num input::-webkit-input-placeholder{*/
        /*color: #ccc;*/
        /*}*/

    }

    .backgroundPopover {
        color: #fff;
        background: #939fb8;
        border: 1px solid #939fb8;
    }

    .popper__arrow::after {
        border-left-color: #939fb8 !important;
    }

    .look-wym-status thead tr th {
        height: 36px;
        background-color: #fff;
        .cell {
            color: #a2abb8;
            background-color: #fff;

        }
    }
</style>

