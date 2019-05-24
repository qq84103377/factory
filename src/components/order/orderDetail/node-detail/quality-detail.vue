<template>
    <div class="quality-detail">
        <div style="line-height: 36px;">
            <nf-button v-if="!componentData.associateWYM" class="report-btn" type="success" @click="goToReport('total')">上报数量</nf-button>
            <!-- 查看扎号上报状态 -->
            <view-ligation-status v-if="componentData.associateLigation" is-quality-checking :component-data="componentData" @on-handle-item="handleItem" style="display: inline-block;"></view-ligation-status>
            <!--<view-record-btn v-if="!componentData.associateWYM" :component-data="componentData" type="quality_checking" style="float: right"></view-record-btn>-->
        </div>
        <div class="quality-detail__title">
            <div>
                <i class="icon icon-qualified"></i>
                <div class="quality-detail__title-con">
                    合格品：
                    <strong class="qualified-color">{{ componentData.completed }}</strong><span>/{{ componentData.target }}</span>
                    <!-- <icon-button class="view-btn">查看全部</icon-button> -->
                    <span v-if="componentData.actualCutting" class="num-show">实裁数</span>
                    <span v-if="componentData.actualCutting" style="color:#ccc;">（订货数：{{componentData.amount}}）</span>
                </div>
            </div>
            <div style="text-align: right;flex: 1">
                <nf-button :loading="isLoading" v-if="componentData.associateWYM" style="color:#fff;background-color:#939fb8;" @click="wymStatus()">查看唯一码状态</nf-button>
            </div>
        </div>
        <div class="quality-detail__content">
            <nf-sku-table ref="staticSkuTable" :metadatas="instanceWorkflow.metadatas" :quantities="instanceWorkflow.quantities" style="margin: 20px 0"></nf-sku-table>
        </div>
        <!--查看全部上报单据-->
        <el-col :span="24" style="margin-top: 20px;">
            <view-bill-btn
                    type="quality_checking"
                    :num="untreatedNum"
                    :missionId="$route.query.missionId"
                    :missionPrcdNodeId="$route.query.instanceWorkflowId">
            </view-bill-btn>
        </el-col>
        <!--子矩阵-->
        <div class="submatrix" v-if="instanceWorkflow.metadatas && submatrixData.length && showOutSideFacAndPrice">
            <div class="submatrix-bg">
                <div class="submatrixItem" v-for="item in submatrixData" :key="item.outsideFactoryId">
                    <div>
                        <nf-button v-if="!componentData.associateWYM" class="report-btn" type="success" @click="goToReport('part', item)">上报数量</nf-button>
                        <span>{{item.outsideFactoryName}}</span>
                        <span v-if="!item.username">：</span>
                        <span v-else> - {{item.username}}：</span>
                        <strong class="qualified-color">{{ item.completed }}</strong><span v-if="!submatrixFlag">/{{ item.target }}</span>
                    </div>
                    <nf-sku-table  :metadatas="instanceWorkflow.metadatas" :submatrixFlag='submatrixFlag' :quantities="item.quantities" style="margin-bottom: 10px;"></nf-sku-table>
                </div>
            </div>
        </div>

        <div class="quality-detail__title" style="display: block">
            <i class="icon icon-defective"></i>
            <div class="quality-detail__title-con">
                次品：<strong class="defective-color">{{ qcDefectiveInfoList.length }}</strong><span>件返修中，总计 {{componentData.defectivedLogs.length }} 件</span>
                <icon-button class="view-btn" @click.native="defectiveVisible = true">查看全部</icon-button>
            </div>
        </div>
        <div class="batch-btns" v-if="!componentData.associateWYM">
            <nf-button class="batch-btn-green" @click="handlePass(true,1)" :loading="btnLoading">
                批量合格
            </nf-button>
            <nf-button class="batch-btn-orange" @click="handleUpdateState('',2,true)" :loading="btnLoading">
                批量再修
            </nf-button>
            <nf-button class="batch-btn-gray" @click="handlePass(true,3)" :loading="btnLoading">
                批量报废
            </nf-button>
            <nf-button
                    v-if="!componentData.associateLigation"
                    class="batch-btn-black"
                    @click="handleBatchTeturn">
                批量退回返修
            </nf-button>
        </div>
        <div class="defecitves-filter-warpper" v-if="!componentData.associateWYM">
            <div class="filter-item-group">
                <div class="filter-item" v-if="componentData.associateLigation">
                    <div class="title">
                        床次
                    </div>
                    <el-select v-model="latheIdList" multiple placeholder="请选择">
                        <el-option v-for="(item,index) in latheList" :key="index" :label="item.lathe" :value="item.lathe">
                        </el-option>
                    </el-select>
                </div>
                <div class="filter-item" v-if="componentData.associateLigation">
                    <div class="title">
                        扎号
                    </div>
                    <el-select v-model="ligationIdList" multiple placeholder="请选择">
                        <el-option v-for="item in ligationList" :key="item.ligationId" :label="item.ligationNo" :value="item.ligationId">
                        </el-option>
                    </el-select>
                </div>
                <div class="filter-item">
                    <div class="title">
                        次品标签
                    </div>
                    <el-select v-model="labelIdList" multiple placeholder="请选择">
                        <el-option v-for="item in defectiveLabelList" :key="item.id" :label="item.labelName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="btn-group">
                <nf-button @click="resetDefectiveFilterParams">重置 </nf-button>
                <nf-button style="color:#fff;background:#54D1BC;" @click="getDefectiveList">筛选 </nf-button>
            </div>
        </div>
        <!--次品-->
        <div class="quality-detail__content">
            <defective-table
                    :defectiveList="defectiveList"
                    :componentData="componentData"
                    @seletctList="defectiveSelect"
                    @handleDefective="handleDefective"
                    @handleUpdateState="handleUpdateState"
                    @handleReturn="handleReturn"
                    :associateOutside="instanceWorkflow.components.information.associateOutside">
            </defective-table>
        </div>
        <!--废品-->
        <div class="quality-detail__title">
            <i class="icon icon-waste"></i>
            <div class="quality-detail__title-con">
                废品：<strong class="waste-color">{{ componentData.wasteds.length }}</strong><span>件</span>

                <nf-button style="color:#23C811;border-color:#7BDE70;" @click="goInstorage" :loading="btnLoading" v-if="instanceWorkflow.components.information.associateInStore&&!componentData.associateWYM&&!componentData.associateLigation">
                    开库存调整单
                </nf-button>
                <!-- <icon-button class="view-btn" @click="wasteVisible = true">查看明细</icon-button> -->
            </div>
        </div>
        <div class="quality-detail__content">
            <waste-table @handleSelectionWasteChange="handleSelectionWasteChange" :componentData="componentData" :instanceWorkflow="instanceWorkflow" :lengthShow="lengthShow"></waste-table>
        </div>
        <!--库存调整单-->
        <div class="quality-detail__title" v-if="!componentData.associateWYM&&!componentData.associateLigation&&instanceWorkflow.components.information.associateInStore">
            <div class="quality-detail__title-con">库存调整单</div>
        </div>
        <div class="quality-detail__content" v-if="!componentData.associateWYM&&!componentData.associateLigation&&instanceWorkflow.components.information.associateInStore">
            <el-table
                    border
                    :data="billList"
                    style="width: 100%;margin-top: 8px;font-size: 12px;">
                <el-table-column
                        prop="orderNo"
                        label="单据号"
                        width="180">
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="storehouseName"-->
                        <!--label="仓库"-->
                        <!--width="180">-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="operateTypeText"
                        label="单据类型" width="110">
                </el-table-column>
                <el-table-column
                        prop="operaterName"
                        label="操作人" width="100">
                </el-table-column>
                <el-table-column
                        prop="dateOperate"
                        label="操作日期"  width="110">
                    <template slot-scope="scope">
                        {{scope.row.dateOperate.split(' ')[0]}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="facMissionNo"
                        label="工单号" width="110">
                </el-table-column>
                <el-table-column
                        prop="commonOutsideFactoryName"
                        label="供应商" min-width="120">
                </el-table-column>
                <el-table-column
                        prop="customerName"
                        label="客户">
                </el-table-column>
                <el-table-column
                        label="总计数量" min-width="110">
                    <template slot-scope="scope">
                        <div v-if="scope.row.addNum&&scope.row.subtractNum">
                            +{{scope.row.addNum}}/-{{scope.row.subtractNum}}
                        </div>
                        <div v-else>{{scope.row.addNum?'+'+scope.row.addNum:scope.row.subtractNum}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="总计金额" min-width="110">
                    <template slot-scope="scope">
                        <div v-if="scope.row.addNum&&scope.row.subtractNum">¥{{scope.row.amount}}</div>
                        <div v-else>¥{{scope.row.addAmount||scope.row.subtractAmount}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="reviewStatusText"
                        label="审核状态" width="110">
                </el-table-column>
                <el-table-column
                        prop="remark"
                        label="审批备注" min-width="110">
                </el-table-column>
                <el-table-column
                        label="操作" width="150">
                    <template slot-scope="scope">
                        <div style="display: flex;color: #1CA1FF;white-space: nowrap">
                            <span style="margin-left: 15px;cursor: pointer;"
                                  @click="$router.push(`/stockDetail?id=${scope.row.id}&type=2&storehouseId=${wasteStorehouseId}`)">查看详情</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
                custom-class="nf-dialog-common substandard-dialog"
                title="次品返修记录"
                size="large"
                :visible.sync="defectiveVisible">
            <el-row class="table-count" type="flex" justify="space-between">
                <p>次品合计：{{ componentData.defectivedLogs.length }} 件</p>
                <p class="gray">返修中：{{ qcDefectiveInfoList.length }} 件 | 总返修次数：{{ totalRepaireNums }} 次</p>
            </el-row>
            <el-table
                    class="quality-detail__content-table is-fixed-header report-table"
                    :data="componentData.defectivedLogs"
                    border
                    style="width: 100%">
                <el-table-column prop="repairTimes" label="所在仓库" width="100">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            {{ scope.row.storehouseName ? scope.row.storehouseName : '无'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="颜色" width="100">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            <i class="dot" v-show="scope.row.status === 0 || scope.row.status == 2"></i>{{ scope.row.colorName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="lengthShow" prop="standardName" label="内长" width="100">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            {{ scope.row.standardName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sizeName" label="尺码" width="100">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            {{ scope.row.sizeName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="defectiveLabelName" label="次品标签">
                    <template slot-scope="scope">
                        <div class="defective-labels" :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            <span v-for="(item, index) in scope.row.defectiveLabelName" :key="index">{{ item }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="repairTimes" label="返修次数" width="100">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3}">
                            {{ scope.row.repairTimes }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="状态" width="120">
                    <template slot-scope="scope">
                        <div :class="{'gray': scope.row.status === 1 || scope.row.status === 3 }">
                            <span v-if="(scope.row.status == 0 || scope.row.status == 2)">返修中</span>
                            <span v-else-if="scope.row.status == 1">已修复合格</span>
                            <span v-else-if="scope.row.status == 3">已报废</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" width="130">
                    <template slot-scope="scope">
                        <div class="btn-group">
                            <div v-if="scope.row.status === 0 || scope.row.status === 2">
                                <icon-button class="btn qualified-color" @click="handlePass(false,scope.row, 1)">合格</icon-button>
                                <icon-button class="btn defective-color" @click="handleUpdateState(scope.row, 2)">再修</icon-button>
                                <icon-button class="btn desc-color" @click="handlePass(false,scope.row, 3)">报废</icon-button>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="end" align="center">
                <div>
                     <nf-button @click="defectiveVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="defectiveVisible = false">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
        <el-dialog custom-class="nf-dialog-common" :visible.sync="wymDialogVisible" title="货品唯一码状态" size="large" :show-close="false">
            <el-table @sort-change="sortTable" :data="ywmData" border max-height="420" style="overflow-x:hidden;width: 100%;">
                <el-table-column prop="lathe" label="床次" sortable="custom" width="100">
                </el-table-column>
                <el-table-column prop="latheNo" label="本次序号" width="120">
                </el-table-column>
                <el-table-column prop="WYM" label="唯一码" sortable="custom" width="140">
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
                <el-table-column prop="reportStatus" :render-header="renderHeader" align="center" fixed="right" width="120">
                    <template slot-scope="scope">
                        <span :class="{'gray':scope.row.reportStatus == 4, 'waste-color':scope.row.reportStatus == 3,
                        'defective-color':scope.row.reportStatus == 2,'qualified-color':scope.row.reportStatus == 1,}">
                            {{getStatusText(scope.row.reportStatus)}}{{(scope.row.reportStatus == 2 && scope.row.repairTimes > 0) ? `(${scope.row.repairTimes})` : ''}}
                        </span>
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
                <el-table-column prop="standardName" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <icon-button class="color-blue" @click="handleEdit(scope.row)">{{scope.row.reportStatus!=4?'修改':'手动上报'}}</icon-button>
                        <!-- <span @click="reportOpera(scope.row)"
                              ></span> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="center" align="center">
                <div>
                    <!-- <nf-button @click="defectiveVisible = false">取 消</nf-button> -->
                    <nf-button type="warning" @click="closeWymDialog">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
        <el-dialog :title="dialogTitle" size="large" custom-class="nf-dialog-common" :visible.sync="visibleReport" :show-close="false" :close-on-click-modal="false">
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
        </el-dialog>

        <el-dialog
                 class="custom-dialog"
                title="选择入库仓库"
                :visible.sync="inStorageVisible"
                size="tiny">
            <div style="display: flex;align-items: center;">
                <span style="margin-right: 10px;">入库仓库</span>
                <el-select v-model="storehouseId" placeholder="请选择">
                    <el-option
                            v-for="item in storehouseList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="storage-cause">
                <span class="storage-text">入库备注</span>
                <el-input class="adjust-textarea" :rows="3" type="textarea" placeholder="请输入20字以内的备注" maxlength="20" v-model="OrderCause"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="inStorageVisible = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
  </span>
        </el-dialog>

        <!--退回返修 侧滑窗-->
        <transition name="right-move">
            <return-repair
                    style="z-index: 1000"
                    v-if="moduleShow"
                    :defectivedArr="defectivedArr"
                    @handleClose="returnRepairClose"
                    @commit="returnRepairCommit">
            </return-repair>
        </transition>
        <transition name="opcity">
            <div style="z-index: 100" class="cover" v-if="moduleShow" @click="cancelModule">
            </div>
        </transition>
    </div>
</template>

<script>
import viewRecordBtn from '../../common/view-record-btn'
import DetailList from '@/components/order/quality-checking-report/detailList'
import GoodType from '@/components/order/quality-checking-report/goodType'
import DefectiveSelect from '@/components/order/quality-checking-report/defectiveSelected'
import returnRepair from '@/components/inferiorMamage/returnRepair.vue'
import ViewLigationStatus from '../../common/view-ligation-status';
import defectiveTable from './quality-detail-defective-table';
import wasteTable from './quality-detail-waste-table';
import {
    qualityCheckingWaste,
    qualityCheckingRepair,
    qualityCheckingQualify,
    wymStatus,
    facDefectiveLabels,
    prcdNodeReports,
    repairedReport,
    cancelReport,
    getStorehousesByUserId,
    billList,
    getSubmatrixData,
    billReportList,
    checkReportPermission,
} from '@/api';
import viewBillBtn from '@/components/order/common/view-bill-btn';
import { defectivesListReq, defectiveLatheList, defectiveLigationList, getDefectiveoutsides } from '@/api/node-detail'
export default {
    props: {
        skuVal: {},
        tableData: {},
        instanceWorkflow: {}
    },
    components: {
        viewRecordBtn,
        DetailList,
        GoodType,
        DefectiveSelect,
        ViewLigationStatus,
        defectiveTable,
        wasteTable,
        viewBillBtn,
        returnRepair,
    },
    data() {
        return {
            isBatch: false,
            storehouseId: '',
            storehouseList: [],
            failGood: {},
            inStorageVisible: false,
            wasteVisible: false,
            defectiveVisible: false,
            wymDialogVisible: false,
            visibleReport: false,
            lengthShow: false,
            btnLoading: false,
            activeIndex: '',
            defectiveLabelList: [],
            ywmData: [],
            reportingData: [],
            selectDefectiveIds: [],
            orderStatus: "0",
            isLoading: false,
            orderByLathe: "0",
            orderByWYM: "0",
            OrderCause:'',//入库备注
            options: [
            ],
            value5: '',
            // 次品list
            defectiveList: [],
            // 扎号列表
            ligationList: [],
            // 扎号ID列表
            ligationIdList: [],
            // 床次列表
            latheList: [],
            // 床次ID列表
            latheIdList: [],
            labelIdList: [],
            defectiveSelectedList: [],
            type: null, // 批量合格和批量报废
            selectWasteList: [], // 勾选废品列表
            wasteStorehouseId: '', //废品仓库id
            billList: [], //损益单列表
            storehouseListBackup: [], // 仓库备份
            waste: {}, // 废品仓库数据
            defaultStorehouseTag: {}, // 默认仓库数据
            submatrixData:[] ,  //子矩阵
            submatrixFlag:'null',   //1.submatrixFlag==‘no_show_targets’的时候=>表示外发厂子矩阵不显示目标数 2.submatrixFlag==‘show_targets’的时候=>表示外发厂子矩阵显示目标数
            untreatedNum: 0,
            moduleShow: false,     //是否显示退回返修侧滑窗
            defectivedArr: [],      //已选次品id数组
            batchdefectivedArr: [],      //批量选择的次品id数组
        }
    },
    computed: {
        //是否关联外发标识
        showOutSideFacAndPrice(){
            if(this.instanceWorkflow.components.information.outSideFlag){
                return true
            }else{
                return false
            }
        },
        qcDefectiveInfoList() {
            return this.componentData.defectivedLogs.filter(item => item.status === 0 || item.status === 2)
        },
        totalRepaireNums() {
            let num = 0;
            for (let item of this.componentData.defectivedLogs) {
                num += item.repairTimes
            }
            return num
        },
        facId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        userId() {
            return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        status() {
            const reportStatus = this.reportingData[0] && this.reportingData[0].reportStatus;
            return reportStatus;
        },
        dialogTitle() {
            const wym = this.reportingData[0] && this.reportingData[0].WYM;
            const title = this.getStatusText(this.status);
            return `${wym}-${title}`;
        },
        componentData() {
            return this.instanceWorkflow.components.quality_checking
        },
    },
    watch: {
        instanceWorkflow(val) {
            if (val) {
                this.getDefectiveList();
                this.getSubmatrixData();
            }
        }
    },
    async created() {
        this.fetchFacDefectiveLabels();
        this.getDefectiveLigationList();
        this.getDefectiveLatheList();
        await this.getDefectiveList();
        await this.getStorehousesList();
        this.getBillList();
        this.getSubmatrixData();
        this.getBillTableData();
    },
    mounted() {
        this.lengthShow = this.$refs['staticSkuTable'] && this.$refs.staticSkuTable.isShowLength;
    },
    methods: {
        //侧滑窗关闭
        returnRepairClose(){
            this.moduleShow = false;
        },
        //退回返修组件提交成功回调
        returnRepairCommit(){
            this.moduleShow = false;
            this.getDefectiveList();    //更新次品列表
        },
        //退回返修按钮点击
        handleReturn(id){
            this.defectivedArr = [];
            this.defectivedArr.push(id);
            this.moduleShow = true;
        },
        //批量退回返修按钮点击
        handleBatchTeturn(){
            this.defectivedArr = this.batchdefectivedArr;
            if(!this.defectivedArr.length){
                this.$message.error('请先勾选要操作的数据');
                return
            }
            this.moduleShow = true;
        },
        //关闭侧滑栏
        cancelModule() {
            this.moduleShow = false;
        },
        getBillTableData(){
            let params= {
                missionPrcdNodeId: this.instanceWorkflow.components.information.header.missionNodeId,
                billTypes: ["FAC_MISSION_ADJUST"],    //调整单
                pageNo: "1",
                pageSize: "99999",
            };
            billReportList(params).then(res=>{
                if(res.data.code ===0){
                    this.untreatedNum = res.data.data.sum;
                }
            })
        },
        //获取子矩阵数据
        getSubmatrixData() {
            let params = {
                missionPrcdNodeId: this.$route.query.instanceWorkflowId,
            };
            getSubmatrixData(params).then(res => {
                if (res.data.code === 0) {
                    this.submatrixData = res.data.data;
                    if (this.submatrixData.length) {
                        // this.submatrixFlag = !(this.submatrixData[0].status)
                        if(!this.submatrixData[0].status){
                            //后台返回status==false的时候=>表示外发厂子矩阵不显示目标数
                            this.submatrixFlag = "no_show_targets"
                        }
                        //唯一一种 外发厂子矩阵 显示目标数成立的就是后台返回的 status==true
                        else {
                            this.submatrixFlag = "show_targets"
                        }
                    }
                    // 把外发厂信息存储到状态
                    this.$store.dispatch("getOutsideFactoryList", this.submatrixData);
                }
            })
        },
        // 次品操作
        handleDefective(val, row, type) {
            this.isBatch = val;
            this.handlePass(val,row, type)
        },
        // 获取库存调整单数据
        getBillList() {
            let params = {
                facMissionPrcdNodeIds: [this.$route.query.instanceWorkflowId],
                operateTypes: ['STOCK_ADJUST'],
                storehouseId: this.wasteStorehouseId,
                pageNo:1,
                pageSize: 10000,
            };
            billList(params).then(res => {
                if(res.data.code === 0){
                    this.billList = res.data.data.list
                }
            })
        },
        // 开库存调整单
        goInstorage() {
            if(!this.selectWasteList.length) return this.$message.error('请勾选要开调整单的废品');
            let item  = this.selectWasteList.some(i => i.storehouseId == null || i.storehouseId == '');
            if (item) return this.$message.error('请勾选有废品仓库的废品');
            window.localStorage.setItem('selectWasteSkuList',JSON.stringify(this.selectWasteList));
            this.$router.push(`/home/instorage?type=2&formType=node&storehouseId=${this.wasteStorehouseId}&facMissionId=${this.$route.query.missionId}&facMissionPrcdNodeId=${this.$route.query.instanceWorkflowId}`)
        },
        getDuplicateDel(arr) {
            let obj = {};
            arr = arr.reduce((cur,next) => { obj[next.skuId] ? "" : obj[next.skuId] = true && cur.push(next); return cur; },[]);
            return arr
        },
        // 勾选废品
        handleSelectionWasteChange(selection) {
            let data = this.getDuplicateDel(selection);
            data.forEach(i => {
                i.num = 0;
                selection.forEach(item => {
                    if(item.skuId == i.skuId) {
                        i.num ++
                    }
                })
            });
            this.selectWasteList = data
        },
        // 入库仓库确认
        handleConfirm() {
          if(this.storehouseId === null) return this.$message.error('请选择入库仓库');
            if(this.isBatch){
                this.handleUpdateState('',this.type,true)
            }else{
                this.handleUpdateState(this.failGood, this.type, false)
            }
        },
        // 获取仓库列表
        async getStorehousesList(){
            await getStorehousesByUserId({facId:this.facId,userId:this.userId,kind: 1}).then(res => {
                this.storehouseList = res.data.data;
                this.storehouseListBackup = res.data.data;
                this.storehouseList.push({id: '', name: '无'});
                this.defaultStorehouseTag = res.data.data.find(
                    item => item.defaultStorehouseTag === 1
                );
                this.waste = res.data.data.find(
                    item => item.type === 'WASTE'
                );
                if (this.waste) {
                    this.wasteStorehouseId = this.waste.id;
                }
                if(this.instanceWorkflow.components.information.selectDefaultStore){
                    this.storehouseId = this.defaultStorehouseTag?this.defaultStorehouseTag.id:res.data.data[0].id;
                }else {
                    this.storehouseId = null;
                }
            })
        },
        handlePass(val,row, type) {
            this.isBatch = val;
            console.log(this.isBatch,'this.isBatch');
            if(!this.defectiveSelectedList.length&&this.isBatch) return this.$message.error('请先勾选要操作的数据');
            if(this.instanceWorkflow.components.information.associateInStore){
                //可以入库
                this.OrderCause ='';
                this.inStorageVisible = true;
                if (this.isBatch) {
                    this.type = row
                } else {
                    this.type = type;
                    this.failGood = row
                }
                if (this.type == 3) {
                    let storehouseList = [];
                    this.storehouseList.forEach(i => {
                        if(i.type === 'WASTE' || i.name == '无') {
                            storehouseList.push(i)
                        }
                    });
                    if (this.waste) {
                        this.storehouseId = this.waste.id;
                    }
                    this.storehouseList = storehouseList
                } else {
                    this.storehouseList = JSON.parse(JSON.stringify(this.storehouseListBackup));
                    if(this.instanceWorkflow.components.information.selectDefaultStore){
                        this.storehouseId = this.defaultStorehouseTag?this.defaultStorehouseTag.id:this.storehouseList[0].id;
                    }else {
                        this.storehouseId = null;
                    }
                }
            }else {
                if (this.isBatch) {
                    this.handleUpdateState(this.defectiveSelectedList, row, true)
                } else {
                    this.handleUpdateState(row, type, false)
                }
            }

        },
        sortTable(val) {
            let sort = val.order;
            if (val.prop == 'WYM') {
                if (sort == 'ascending') {
                    this.orderByWYM = "0";
                    this.orderByLathe = "0";
                    this.wymStatus();
                    return;
                } else {
                    this.orderByWYM = "1";
                    this.orderByLathe = "0";
                    this.wymStatus();
                    return;
                }
            }
            if (val.prop == 'lathe') {
                if (sort == 'ascending') {
                    this.orderByLathe = "0";
                    this.orderByWYM = "0";
                    this.wymStatus();

                } else {
                    this.orderByLathe = "1";
                    this.orderByWYM = "0";
                    this.wymStatus();

                }
            }

        },
        getStatusText(val) {
            switch (val) {
                case 1: return '合格品';
                case 2: return '次品';
                case 3: return '废品';
                default: return '未上报'
            }
        },
        showStatusSelect() {
            this.wymStatus();
        },
       async goToReport(from, item) {
            let obj={
                facMissionPrcdNodeId:this.$route.query.instanceWorkflowId,
                userId: this.userId
            };
            let flag = await checkReportPermission(obj).then(res=>{
                if(res.data.code!==0){
                    this.$message.error(res.data.msg)
                    return false
                }else {
                    return true
                }
            });
            if(!flag) return
           let facId = '';
           if(item){
               if(item.outsideFactoryId === ''){
                   facId = 'ourFactory';
               }else{
                   facId = item.outsideFactoryId;
               }
           }
            this.$router.push({
                path: `/reporting`,
                query: {
                    missionId: this.$route.query.missionId,
                    instanceWorkflowId: this.$route.query.instanceWorkflowId || this.$route.query.id,
                    outsideFacId: facId,
                    finishId: item ? item.userId : '',
                    associateInStore:this.instanceWorkflow.components.information.associateInStore
                }
            });
        },
        // 扎号质检跳转
        handleItem(item) {
            this.$store.dispatch('setEditRow', item); // vuex/modules/quality-checking.js;
            this.$router.push({
                path: `/reporting`,
                query: {
                    missionId: this.$route.query.missionId,
                    instanceWorkflowId: this.$route.query.instanceWorkflowId || this.$route.query.id,
                    skuId: item.skuID
                }
            });
        },
        fetchFacDefectiveLabels() {
            facDefectiveLabels({
                userId: this.userId,
                facId: this.facId
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
            repairedReport({
                instanceId: this.$route.query.instanceWorkflowId,
                wymId: this.reportingData[0].uniqueId,
                userId: this.userId
            })
                .then(res => {
                    if (res.data.code === 0) {
                        this.visibleReport = false;
                        this.wymDialogVisible = false;
                        this.wymStatus();
                        this.$emit('on-report');
                        return;
                    }
                    this.$message.error(res.data.msg);
                })
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
                instanceId: this.$route.query.instanceWorkflowId,
                wymId: this.reportingData[0].uniqueId,
                userId: this.userId
            };
            if (type === 'defectived') {
                params.defectiveLabelIds = this.selectDefectiveIds;
            }
            prcdNodeReports(params)
                .then(res => {
                    if (res.data.code === 0) {
                        this.visibleReport = false;
                        this.wymStatus();
                        this.$emit('on-report');
                        return
                    }
                    this.$message.error(res.data.msg)
                });
        },
        handleUpdateState(row, sign, isbatch) {
            if(!this.defectiveSelectedList.length && isbatch){
                this.$message.error('请先勾选要操作的数据');
                return
            }
            if (this.btnLoading ) return;
            const params = {
                instanceId: this.$route.query.instanceWorkflowId,
                defectivedId: row && !isbatch ? row.id : '',
                updateList: isbatch ? this.defectiveSelectedList : [],
                defectivedStorehouseId: row.storehouseId
            };
            if (this.componentData.associateLigation) {
                params.ligationId = row.ligationId;
            }
            this.btnLoading = true;
            if (sign === 1) {
                if(this.instanceWorkflow.components.information.associateInStore){
                    //可以入库
                    params.storehouseId = this.storehouseId;
                    params.remark = this.OrderCause;//备注
                }
                qualityCheckingQualify(params)
                    .then(res => {
                        this.updateSuccessCb(res);
                    });
            }
            else if (sign === 2) {
                qualityCheckingRepair(params)
                    .then(res => {
                        this.updateSuccessCb(res);
                    });
            }
            else if (sign ==3){
                if(this.instanceWorkflow.components.information.associateInStore){
                    //可以入库
                    params.storehouseId = this.storehouseId;
                    params.remark = this.OrderCause;//备注
                }
                qualityCheckingWaste(params)
                    .then(res => {
                        this.updateSuccessCb(res);
                    });
            }
        },
        updateSuccessCb(res) {
            this.btnLoading = false;
            this.inStorageVisible = false;
            if (res.data.code === 0) {
                this.$message.success('修改成功');
                this.getDefectiveList().then(res => {
                    this.$emit('on-report');
                }).catch(err => {
                    this.$message.error(res.data.msg);
                    throw Error(err)
                });

            }
        },
        // 获取唯一码数据
        wymStatus() {
            this.$router.push({
                path:'/missionWymStatus',
                query:{instanceId:this.instanceWorkflow.components.status.id,missionId:this.$route.query.missionId,quality:true,associateInStore:this.instanceWorkflow.components.information.associateInStore?1:0}
            })
            // this.isLoading = true;
            // let params = {
            //     missionNodeId: this.instanceWorkflow.components.status.id,
            //     orderByLathe: this.orderByLathe,
            //     orderByWYM: this.orderByWYM,
            //     status: this.orderStatus,
            // };
            // wymStatus(params).then(res => {
            //     this.isLoading = false;
            //     if (res.data.code == 0) {
            //         this.wymDialogVisible = true;
            //         this.ywmData = res.data.data.list;
            //     }
            //     else {
            //         this.$message.error(res.data.msg);
            //     }
            // })
        },
        closeWymDialog() {
            this.wymDialogVisible = false;
        },
        handleEdit(row) {
            this.reportingData = [row];
            this.activeIndex = '';
            this.selectDefectiveIds = [];
            if (row.reportStatus === 2 && row.defectiveIds) {
                this.selectDefectiveIds = row.defectiveIds;
            }
            this.$nextTick(() => {
                this.visibleReport = true;
            });
        },
        handleSelectType(index) {
            this.activeIndex = index;
            const status = index + 1;
            if (index === 1) return;
            if (this.status !== 0 || this.status !== 4) {
                this.reportByType(index);

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
                        this.$emit('on-report');
                        this.wymStatus();
                        this.visibleReport = false;
                        return
                    }
                    this.$message.error(res.data.msg);
                });
        },
        // 获取次品列表
        async getDefectiveList() {
            let params = {
                missionNodeId: this.$route.query.instanceWorkflowId,
                lathes: this.latheIdList,
                defectiveLabelIds: this.labelIdList,
                ligationIds: this.ligationIdList
            };
            if (this.instanceWorkflow.components.information.associateOutside) {
                // 获取外发节点次品列表
                return await getDefectiveoutsides(params).then(res => {
                    if (res.data.code == 0) {
                        this.defectiveList = res.data.data
                    }
                    return res
                }).catch(err => {
                    throw Error(err)
                })
            } else {
                return await defectivesListReq(params).then(res => {
                    if (res.data.code == 0) {
                        this.defectiveList = res.data.data
                    }
                    return res
                }).catch(err => {
                    throw Error(err)
                })
            }
        },
        // 重置次品筛选条件
        resetDefectiveFilterParams() {
            this.latheIdList = [];
            this.ligationIdList = [];
            this.labelIdList = [];
        },
        // 获取床次列表
        getDefectiveLatheList() {
            return defectiveLatheList({ missionNodeId: this.$route.query.instanceWorkflowId }).then(res => {
                if (res.data.code == 0) {
                    this.latheList = res.data.data
                }
                return res
            }).catch(err => {
                throw Error(err)
            })
        },
        // 获取扎号列表
        getDefectiveLigationList() {
            return defectiveLigationList({ missionNodeId: this.$route.query.instanceWorkflowId }).then(res => {
                if (res.data.code == 0) {
                    this.ligationList = res.data.data
                }
            }).catch(err => {
                throw Error(err)
            })
        },
        // 次品批量选择
        defectiveSelect(val) {
            this.defectiveSelectedList = val;
            this.batchdefectivedArr = val.map(item => item.defectivedId);
        },
        // 动态表头
        renderHeader(createElement, { column, $index }) {
            return (
                <div>
                    <el-select class="test" onChange={this.showStatusSelect} v-model={this.orderStatus} placeholder="请选择"><el-option label="全部状态" value="0"> </el-option>
                        <el-option label="合格" value="1"></el-option>
                        <el-option label="次品" value="2"></el-option>
                        <el-option label="废品" value="3"></el-option>
                        <el-option label="未上报" value="4"></el-option>
                    </el-select>
                </div>
            );
        },
    }
}
</script>

<style lang="scss" scoped>
.storage-cause{
    display: flex;
    margin-top: 10px;
    .storage-text{
        flex-basis: 81px;
    }
}
.qualified-color {
    color: #23c811;
}
.link-color {
    color: #1CA1FF;
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
.gray {
    color: #a2abb8;
}
.btn {
    text-decoration: underline;
}
.dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 6px;
    vertical-align: middle;
    background-color: #ff7f14;
    border-radius: 50%;
}
.red-dot {
    background-color: #fa4150;
}
.quality-detail {
    margin: 16px 0;
    .report-btn {
        margin-bottom: 16px;
    }
    &__title {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        font-size: 14px;
        margin-bottom: 4px;
        &-con {
            display: inline-block;
            font-weight: 500;
            margin-left: 4px;
            .view-btn {
                font-weight: 400;
                margin-left: 12px;
                color: #1ca1ff;
                text-decoration: underline;
            }
        }
        .icon {
            display: inline-block;
            vertical-align: middle;
            width: 38px;
            height: 20px;
            background-repeat: no-repeat;
            &-qualified {
                background: url(../../../../assets/images/pic_qualified.png);
                background-size: cover;
            }
            &-defective {
                background: url(../../../../assets/images/pic_defective.png);
                background-size: cover;
            }
            &-waste {
                background: url(../../../../assets/images/pic_waste.png);
                background-size: cover;
            }
        }
    }
    .num-show {
        font-size: 12px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 48px;
        height: 22px;
        background: #ffe433;
        color: red;
    }
    &__content {
        // display: inline-block;
        &-table {
            margin: 15px 0;
        }
    }
    .defective-labels {
        span:not(:last-child) {
            &::after {
                content: '、';
            }
        }
    }
    .submatrix {
        margin:15px 0;
        width: 100%;
        .adjust-num {
            color: #FF7F14;
        }
        .submatrix-bg {
            padding: 15px;
            background-color: #fafcff;
            overflow: hidden;
            .submatrix-item{
                overflow: hidden;
                margin: 15px 0;
            }
        }
    }
    .substandard-dialog{
        .btn-group{
            .icon_button{
                padding-right: 5px;
                font-size: 12px;
            }
        }
    }
    .batch-btns{
        .batch-btn-green{
            color:#23C811;
            border-color:#7BDE70;
        }
        .batch-btn-orange{
            color:#FF7F14;
            border-color:#FFBF89;
        }
        .batch-btn-gray{
            color:#999;
            border-color:#ddd;
        }
        .batch-btn-black{
            color:#333;
            border-color:#666;
        }
    }
}
.defecitves-filter-warpper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    border: 1px solid rgba(223, 230, 236, 1);
    padding: 12px;
    .filter-item-group {
        flex: 1;
        display: flex;
        .filter-item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            .title {
                margin-right: 10px;
            }
        }
    }
}
</style>
<style lang="scss">
.quality-detail {
    .substandard-dialog{
        width: 900px;
    }
    .test .el-input__inner {
        width: 100px;
        background: #eef0f6;
        border: none !important;
        color: #97a5bd;
    }
}
</style>
