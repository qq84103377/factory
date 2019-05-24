<template>
    <div class="node-list-table">
        <el-row class="node-table-title">
            <el-col :span="12" style="color: #555555;">
                <nf-button
                        v-if="!componentData.associateWYM"
                        style="margin-right:10px;"
                        class="report-btn"
                        type="success"
                        @click="reprot('finishNum')">上报完成数</nf-button>
                <!--关联唯一码和扎号不显示-->
                <nf-button
                    v-if="!isWYMOrLigation && componentData.header.allowBillAdjustNum"
                    style="margin-right:10px;"
                    class="report-btn"
                    type="warning"
                    @click="reprot('changeNum')">上报调整数</nf-button>
                <!--完成数-->
                <template v-if="skuRadio === 0">
                    <span>完成数:</span>
                    <span>
                    <span :style="{'color':componentData.completed>
                    componentData.target?'#23c811':'#1ca1ff'}" style="color:#1ca1ff;">
                    {{componentData.completed}}</span>
                    / {{componentData.target}}</span>
                    <!-- 实裁数为true时显示 -->
                    <span v-if="componentData.actualCutting" class="num-show">实裁数</span>
                    <span v-if="componentData.actualCutting" style="color:#ccc;">（订货数：{{componentData.amount}}）</span>
                </template>
                <!--未完成数-->
                <template v-if="skuRadio === 1&&instanceWorkflow.components&&componentData.target">
                    <span>未完成数: </span>
                    <span>{{unDoneNum | filterNum}} / {{componentData.target}}</span>
                </template>
                <!--调整数-->
                <span class="adjust-num" v-if="!isWYMOrLigation && componentData.header.allowBillAdjustNum && componentData.adjustNum">（调{{componentData.adjustNum}}）</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
                <el-radio-group @change="handleFilterSkuData" v-model="skuRadio">
                    <el-radio :label="0">完成数</el-radio>
                    <el-radio :label="1">未完成数</el-radio>
                    <el-radio :label="2" v-if="!isWYMOrLigation && componentData.header.allowBillAdjustNum">调整数</el-radio>
                </el-radio-group>
                <nf-button :loading="isLoading" v-if="componentData.associateWYM" style="color:#fff;background-color:#939fb8;" @click="wymStatus">查看唯一码状态</nf-button>
                <!--<view-record-btn v-if="!componentData.associateWYM" :component-data="componentData" type="total"></view-record-btn>-->
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row class="node-list-content">
            <progress-success
                    v-if="skuRadio !== 2"
                    :report="false"
                    :sum="componentData.target"
                    :num="componentData.completed"
                    :label="label" >
            </progress-success>
            <!-- 查看扎号上报情况 -->
            <view-ligation-status
                v-if="isLigationNode"
                ref="viewLigationStatus"
                :component-data="componentData"
                @on-handle-item="handleEditReport">
            </view-ligation-status>
            <!-- 查看扎号上报情况--end -->
        </el-row>
        <!--查看全部上报单据-->
        <el-col :span="24">
            <view-bill-btn
                    type="total"
                    :num="untreatedNum"
                    :missionId="instanceWorkflow.mission.missionId"
                    :missionPrcdNodeId="instanceWorkflow.components.information.header.missionNodeId">
            </view-bill-btn>
        </el-col>
        <!--单据表格-->
        <bill-table
                v-if="!isWYMOrLigation && tableData.length"
                type="total"
                :tableData="tableData"
                @commit="billReport">
        </bill-table>

        <!--子矩阵-->
        <div class="submatrix" v-if="submatrixData.length">
            <div class="submatrix-title">外发明细</div>
            <el-table
                :data="submatrixData"
                border
                style="width: 50%">
                <el-table-column
                        prop="outsideFactoryName"
                        label="完成工厂"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="completed"
                        label="完成数">
                </el-table-column>
                <el-table-column
                        v-if="submatrixFlag"
                        prop="target"
                        label="目标数">
                </el-table-column>
                <el-table-column
                        label="调整数">
                    <template slot-scope="scope">
                        <span  class="adjust-num">{{scope.row.adjustNum}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
              custom-class="nf-dialog-common"
              :visible.sync="visible.addReportVisible"
              :title="reportDialogTitle">
            <div class="dialog-body">
                <dialog-form
                    ref="dialogForm"
                    :isShow="visible.addReportVisible"
                    isSubmatrixComponents="false"
                    :formModel="reportFrom"
                    :selectUserOptions="selectPersonList"
                    :outSideFactory="dialogOutsideFacId"
                    :isWYMOrLigation="isWYMOrLigation"
                    :information="instanceWorkflow.components.information">
                </dialog-form>
                <mission-info
                        class="dialog__mission-info"
                        :mission-info="instanceWorkflow.mission">
                </mission-info>
                <div v-if="componentData && !isWYMOrLigation && reportDialogTitle === '上报调整数'" class="change-num">
                    <span class="text">调整数：</span>
                    <el-input
                            v-model.trim="reportFrom.changeNum"
                            type="number"
                            step="1"
                            class="change-input">
                    </el-input>
                </div>
                <template v-if="!isLigationNode && reportDialogTitle === '上报完成数'">
                    <div class="totalNum">
                        <el-input placeholder="请输入上报的数量" @input="totalReport" v-model.trim="totalNum"></el-input>

                        <div style="margin:12px 0;">完成情况：{{componentData.completed}}/{{componentData.target}}</div>
                    </div>
                    <div style="padding: 0 120px;">
                        <progress-success :sum="componentData.target" :num="componentData.completed" :report="true" :reportNum="totalNum">
                        </progress-success>
                    </div>
                </template>
                <!-- 关联扎号上报列表 -->
                <ligation-report-list
                    v-if="isLigationNode && visible.addReportVisible"
                    ref="ligationReportList"
                    v-model="ligationParams"
                    :ligation-list="commonLigationReportList"
                    is-totality
                    :editable="visible.ligationEditable"
                    :instanceWorkflow="instanceWorkflow"
                    :component-data="componentData"
                    @on-sku-change="handleSkuValueChange">
                </ligation-report-list>
                <div class="adjust-cause" v-if="reportDialogTitle === '上报调整数'">
                    <span class="adjust-text">调整原因：</span>
                    <el-input class="adjust-textarea" type="textarea" maxlength="100" v-model="reportFrom.adjustCause"></el-input>
                </div>
                <div style="padding-top: 10px;">
                    <outsideFacAndStation
                            v-if="reportDialogTitle === '上报完成数' && !isWYMOrLigation && reportSendSelectUser"
                            :formModel="reportFrom"
                            :information="instanceWorkflow.components.information">
                    </outsideFacAndStation>
                </div>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="end" align="center">
                    <div class="count-total" v-if="isLigationNode">
                        数量合计：<strong>{{ ligationTotal }}</strong>
                    </div>
                    <div>
                    <nf-button @click="cancelAddReport">取 消</nf-button>
                    <nf-button :loading="visible.btnLoading1" type="warningsimple" @click="handleAddReport('DRAFT')">存草稿</nf-button>
                    <nf-button :loading="visible.btnLoading2" type="warning" @click="handleAddReport('REPORT')">提 报</nf-button>
                    </div>
                </el-row>
            </el-dialog>
    </div>
</template>

<script>
import progressSuccess from './progress-success'
import CommonMixin from './common-mixin';
import { formatDate } from '@/utils'
import {
    cancelReport,
    handReport,
    wymStatus,
    addReportDataDetail,
    getSkuBarcodeInfo,
    updateNumNode,
    updateBedNode,
    updateTotalNode,
    billReportList,
    getSubmatrixData,
    checkReportPermission,
} from '@/api'
import { mapState } from 'vuex';
import viewBillBtn from '@/components/order/common/view-bill-btn';
import billTable from '@/components/order/allReportBill/billTable.vue';
import outsideFacAndStation from '@/components/order/common/outsideFacAndStation';
export default {
    props: {
        instanceWorkflow: {},
        selectPersonList: []
    },
    mixins: [CommonMixin],
    data() {
        return {
            skuRadio: 0,
            currentNodeName: '',
            reportFrom: {
                leaders: [],
                endAt: '',
                finishUserId: '',
                adjustCause: "",    //调整原因
                changeNum:'',   //调整数
                outSideFactoryId: "",
                sendToFactoryId: "ourFactory",
                sendToUserId: "",
            },
            bedNum: '',
            totalNum: '',
            visible: {
                addReportVisible: false,
                wymDialogVisible:false,
                handReport:false,
                cancelReport:false,
                btnLoading1: false,
                btnLoading2: false,
                ligationEditable: false
            },
            latheSort:0,
            wymSort:0,
            orderStatus:"0",
            ywmData:[],
            handReportData:[],
            cancelReportData:[],
            isLoading:false,
            orderByLathe:"0",
            orderByWYM:"0",
            date_disabled:false,
            staff_disabled:false,
            label:0,
            reportDialogTitle:'',     //上报弹窗标题
            tableData: [],
            submatrixData: [],      //子矩阵数据
            submatrixFlag:'null',     //1.submatrixFlag==‘no_show_targets’的时候=>表示完成工厂子矩阵不显示目标数 2.submatrixFlag==‘show_targets’的时候=>表示完成工厂子矩阵显示目标数
            untreatedNum: 0,
        }
    },
    filters: {
        filterNum(val) {
            if(val<=0) {
                return 0;
            }else {
                return val;
            }
        },
        filterStatus(val) {
            if(val == 1) {
                return '已上报';
            }
            if(val == 4) {
                return '未上报';
            }
        },
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
        //节点关联唯一码或者扎号
        isWYMOrLigation(){
            if(this.componentData.associateWYM || this.componentData.associateLigation){
                return true
            }else{
                return false
            }
        },
        unDoneNum() {
            if (this.componentData.actualCutting) {
                return Number(this.componentData.target) - Number(this.componentData.completed);
            } else {
                return Number(this.componentData.amount) - Number(this.componentData.completed);
            }
        },
        componentData() {
            return this.instanceWorkflow.components.total
        },
        information(){
            return this.instanceWorkflow.components.information;
        },
        // 是否上报完成数的同时上报发往工厂、工位
        reportSendSelectUser(){
            return this.information.reportSendSelectUser;
        },
        // 是否发往工厂、工位默认取完成工厂、工位
        reportSendSelectUserDefComplete(){
            return this.information.reportSendSelectUserDefComplete;
        },
    },
    components: {
        progressSuccess,
        viewBillBtn,
        billTable,
        outsideFacAndStation,
    },
    watch:{
        'reportFrom.outSideFactoryId': {
            handler(val){
                //工单整单外发时，强制“发往工厂”跟随“完成工厂”
                if(this.reportSendSelectUserDefComplete || this.information.facMissionOutsideFactoryId){
                    if(val === ''){
                        this.reportFrom.sendToFactoryId = 'ourFactory';
                    }else{
                        this.reportFrom.sendToFactoryId = val;
                    }
                }
            },
            deep:true
        },
        'reportFrom.finishUserId': {
            handler(val){
                if(this.reportSendSelectUserDefComplete){
                    this.reportFrom.sendToUserId = val;
                }
            },
            deep:true
        },
        // 解决多个总数节点点击页面数据没有刷新额问题
        instanceWorkflow:function(newVal,oldVal){
            if(newVal){
                // console.log("数据发生变化：");
                this.getSubmatrixData();
            }
        }
    },
    created() {
        this.getBillTableData();
        this.getSubmatrixData();
    },
    methods: {
        //获取发往工厂id
        getSendToFactoryId(){
            let id = '';
            // 上报完成数的同时上报发往工厂、工位时
            if(this.reportSendSelectUser){
                id = this.reportFrom.sendToFactoryId === 'ourFactory' ? '' : this.reportFrom.sendToFactoryId;
            }
            // 上报弹窗不存在发往工厂、工位时，取完成工厂的id
            else{
                id = this.reportFrom.outSideFactoryId === 'ourFactory' ? '' : this.reportFrom.outSideFactoryId;
            }
            return id
        },
        //获取子矩阵数据
        getSubmatrixData(){
            let params= {
                missionPrcdNodeId: this.instanceWorkflow.components.information.header.missionNodeId,
            };
            getSubmatrixData(params).then(res=>{
                if(res.data.code ===0){
                    this.submatrixData = res.data.data;
                    if (this.submatrixData.length) {
                        // this.submatrixFlag = !(this.submatrixData[0].status)
                        if(!this.submatrixData[0].status){
                            //后台返回status==false的时候=>表示完成工厂子矩阵不显示目标数
                            this.submatrixFlag = "no_show_targets"
                        }
                        //唯一一种 完成工厂子矩阵 显示目标数成立的就是后台返回的 status==true
                        else {
                            this.submatrixFlag = "show_targets"
                        }
                    }
                    // 把完成工厂信息存储到状态
                    this.$store.dispatch("getOutsideFactoryList", this.submatrixData);
                }
            })
        },
        //单据表格操作成功后触发刷新
        billReport(){
            this.$emit("on-report");
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
                    this.tableData = res.data.data.list;
                    this.untreatedNum = res.data.data.sum;
                }
            })
        },
        sortTable(val) {
            console.log(val);
            let sort = val.order;
            if(val.prop == 'WYM') {
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
            if(val.prop == 'lathe') {
                if (sort == 'ascending') {
                    this.orderByLathe = "0";
                    this.orderByWYM = "0";
                    this.wymStatus();
                    return;
                } else {
                    this.orderByLathe = "1";
                    this.orderByWYM = "0";
                    this.wymStatus();
                    return;
                }
            }

        },
        renderHeader(createElement, { column,$index }) {
            return (
                <div>
                    <el-select class="test" onChange={this.showStatusSelect} v-model={this.orderStatus} placeholder="请选择">
                        <el-option label="全部状态" value="0">
                        </el-option>
                        <el-option label="已上报" value="1">
                        </el-option>
                        <el-option label="未上报" value="4">
                        </el-option>
                    </el-select>
                </div>
            );
        },
        showStatusSelect() {
            this.wymStatus();
        },
        // handReport() {
        //     let params = {
        //         instanceId: this.instanceWorkflow.components.status.id,
        //         userId: this.$store.state.userInfo.id,
        //         wymId:this.handReportData[0].uniqueId
        //     };
        //     this.visible.btnLoading = true;
        //     handReport(params).then(res => {
        //         console.log(res);
        //         if(res.data.code == 0) {
        //             this.$message.success('上报成功');
        //             this.wymStatus();
        //             this.visible.handReport = false;
        //             this.addReportSuccess();
        //         }else {
        //             this.$message.error(res.data.msg);
        //         }
        //         this.visible.btnLoading = false;
        //     })
        // },
        cancelReport() {
            let params = {
                instanceId: this.instanceWorkflow.components.status.id,
                userId: this.$store.state.userInfo.id,
                wymId:this.cancelReportData[0].uniqueId
            };
            cancelReport(params).then(res => {
                console.log(res);
                if(res.data.code == 0) {
                    this.$message.success('取消上报成功');
                    this.wymStatus();
                    this.$emit("on-report");
                    this.visible.cancelReport = false;
                }else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        reportOpera(row) {
            if(row.reportStatus == 4) {
                this.handReportData = [row];
                this.visible.handReport = true;
                this.visible.wymDialogVisible = true;
            }else {
                this.cancelReportData = [row];
                this.visible.cancelReport = true;
                this.visible.wymDialogVisible = true;
            }
        },
        wymStatus() {
            this.$router.push({
                path:'/missionWymStatus',
                query:{instanceId:this.instanceWorkflow.components.status.id,missionId:this.$route.query.missionId}
            })
        },
        totalReport(val) {
            console.log(val);
            if(val<0) {
                this.totalNum = 0;
            }
        },
        handleFilterSkuData(val) {
            this.label = val
        },
       async reprot(type) {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;

            if (datalist.indexOf("fac.mission.node.report") === -1) {
                this.$message.error("抱歉，您没有操作权限");
                return;
            }
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
            if(type === 'finishNum'){
                this.reportDialogTitle = '上报完成数';
            }else if(type === 'changeNum'){
                this.reportDialogTitle = '上报调整数';
            }
            if (this.isLigationNode) {
                // common-mixin.js的方法， 获取当前节点未上报的扎号列表
                this.visible.ligationEditable = false;
                this.fetchWithoutReportList();
                return;
            }
           this.initReportVal();
            this.visible.addReportVisible = true;
        },
        initReportVal(){
            //总矩阵在非整单外发时，每次弹窗前清空完成工厂
            if(!this.instanceWorkflow.components.information.facMissionOutsideFlag){
                this.reportFrom.outSideFactoryId = '';
            }
            // 完成人员取值逻辑：1.老板号登录，完成人员默认选节点负责人    2.员工号登录，完成人员默认选自己
            const chargers = this.instanceWorkflow.components.information.chargers;
            this.reportFrom['finishUserId'] = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
        },
        totalNode(actionType) {
            if( !this.reportFrom.endAt) {
                this.$message.error('完成日期不能为空');
                return;
            }
            //节点配置了“外发”
            if(this.showOutSideFacAndPrice){
                if (!this.reportFrom.outSideFactoryId) {
                    this.$message.error("完成工厂不能为空");
                    return;
                }
            }
            if (!this.reportFrom.finishUserId) {
                this.$message.error("请选择完成人员！");
                return;
            }
            if(this.reportDialogTitle === '上报完成数'){
                if(this.totalNum === '0' || this.totalNum === ''){
                    this.$message.error('请输入上报数量');
                    return;
                }
            }
            if(this.reportDialogTitle === '上报调整数'){
                if (!this.reportFrom.changeNum) {
                    this.$message.error("调整数不能为空");
                    return;
                }
                if(!this.reportFrom.adjustCause){
                    this.$message.error("调整原因不能为空");
                    return;
                }
            }
            let sendToFacId = this.getSendToFactoryId();
            let params = {
                dateCompleted: this.reportFrom.endAt,
                chargerId: this.reportFrom.finishUserId,
                instanceId: this.instanceWorkflow.components.status.id,
                userId: this.$store.state.userInfo.id,
                outsideFactoryId: this.reportFrom.outSideFactoryId === 'ourFactory' ? '' : this.reportFrom.outSideFactoryId,    //完成工厂
                sendToFactoryId:  sendToFacId,
                sendToUserId:  this.reportFrom.sendToUserId,  //发往工位
                quantity: this.reportFrom.changeNum ? this.reportFrom.changeNum : this.totalNum,       //调整数
                actionType: actionType,
            };
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = true;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = true;
            }
            if(this.reportDialogTitle === '上报完成数'){
                params.type = 'COMPLETE_NUM'
            }else if(this.reportDialogTitle === '上报调整数'){
                params.type = 'ADJUST_NUM';
                params.adjustReason = this.reportFrom.adjustCause;    //调整原因
            }
            updateTotalNode(params).then(
                res => {
                    if(actionType === 'DRAFT'){
                        this.visible.btnLoading1 = false;
                    }else if(actionType === 'REPORT'){
                        this.visible.btnLoading2 = false;
                    }
                    if (res.data.code == 0) {
                        this.addReportVisible = false;
                        this.$message.success("上报成功");
                        this.totalNum = '';
                        this.addReportSuccess();
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }
            )
        },
        async handleAddReport(actionType) {
            const valid = await this.$refs['dialogForm'].valid();
            if (!valid) return;
            if (this.isLigationNode) {
                this.reportLigationNode(actionType);
                return;
            }
            this.totalNode(actionType);
        },
        addReportSuccess() {
            this.visible.addReportVisible = false;
            this.$emit('on-report');
        },
        addReportDetail(params, val) {
            addReportDataDetail(params).then(res => {
                this.addReportVisible = false;
                if (res.data.code === 0) {
                    this.$message.success('成功');
                    this.addReportSuccess();
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        cancelAddReport() {
            this.visible.addReportVisible = false;
        },
        pickerReportEndAt(val) {
            this.reportFrom.endAt = val;
        },
    }
}
</script>

<style lang="scss" scoped>
    .node-list-table{
        overflow: hidden;
        .node-table-title{
            .adjust-num{
                color: #FF7F14;
            }
        }
        .nf-dialog-common{
            .adjust-cause{
                overflow: hidden;
                margin: 15px 0;
                .adjust-text{
                    width: 90px;
                    float: left;
                    &:before {
                        content: '*';
                        color: #ff4949;
                        margin-right: 4px
                    }
                }
                .adjust-textarea{
                    float:left;
                    width: calc(100% - 90px)
                }
            }
            .totalNum{
                margin-top: 15px;
            }
        }
        .submatrix{
            margin-top: 30px;
            .submatrix-title{
                margin: 15px 0;
            }
            .adjust-num{
                color: #FF7F14;
            }
        }
    }
.no-report {
    color:#3b3b3b;
}
.yes-report {
    color:#23c811;
}
.gray-report {
    text-decoration: underline;
    color:#808080;
    cursor: pointer;
}
.blue-report {
    text-decoration: underline;
    color:#1ca1ff;
    cursor: pointer;
}
.gray {
    color:#c4c6cc;
}
.green {
    color:#23c811;
}
.blue {
    color:skyblue;
}
.orange {
    color:orange;
}
.node-list-content {
    padding-bottom: 20px;
    box-sizing: border-box;
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
.dialog-footer > .count-total {
  strong {
    color: #FF7F14;
    font-weight: 500;
    font-size: 20px;
    vertical-align: -2px
  }
}

.dialog__mission-info {
  margin-top: 14px;
}
</style>
<style lang="scss">
    .node-list-table{
        .el-dialog--small {
            &.nf-dialog-common {
                width: 700px !important;
            }
            .change-num {
                margin: 15px 0;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .text{
                    display: inline-block;
                    width: 70px;
                }
                .el-input__inner {
                    width: 218px !important;
                }
            }
        }
    }
</style>
