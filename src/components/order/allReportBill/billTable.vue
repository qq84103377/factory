<template>
    <div class="bill-table">
        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                border
                style="width: 100%">
            <el-table-column
                    prop="billName"
                    label="单据"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="billNo"
                    label="单号"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    width="110"
                    label="状态">
                <template slot-scope="scope">
                    <div
                        :class="{
                        'blue-text': renderStatus(scope.row) === 'blue',
                        'green-text': renderStatus(scope.row) === 'green',}">
                        <span>{{scope.row.billStatusName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dateBusiness"
                    label="完成时间"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    width="120"
                    label="完成人员">
            </el-table-column>
            <el-table-column
                    v-if="type === 'actual_cutting'"
                    prop="lathe"
                    label="床次">
            </el-table-column>
            <el-table-column
                    prop="outsideFactoryName"
                    label="完成工厂"
                    width="180">
            </el-table-column>
            <el-table-column
                    v-if="type === 'tail_in_store' || type === 'quality_checking'"
                    prop="storehouseName"
                    label="入库仓库">
            </el-table-column>
            <el-table-column
                    v-if="type === 'tail_out_store'"
                    prop="customerName"
                    label="客户">
            </el-table-column>
            <el-table-column
                    v-if="type === 'tail_out_store'"
                    prop="storehouseName"
                    label="发货仓库">
            </el-table-column>
            <el-table-column
                    prop="reportTotal"
                    width="120"
                    label="完成数量">
                <template slot-scope="scope">
                    <!--单据类型只要不是调整单时，显示完成数-->
                    <span v-if="scope.row.billType !== 'FAC_MISSION_ADJUST'">{{scope.row.reportTotal}}
                        <i v-if="scope.row.excessNum" class="exceed-num">(超{{scope.row.excessNum}})</i>
                    </span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="type === 'quality_checking'"
                    prop="defectiveLabels"
                    label="次品标签">
            </el-table-column>
            <el-table-column
                    v-if="type !== 'quality_checking'"
                    width="100"
                    label="调整数量">
                <template slot-scope="scope">
                    <!--单据类型是调整单时显示调整数-->
                    <span
                        :class="{'orange-text': scope.row.reportTotal}"
                        v-if="scope.row.billType === 'FAC_MISSION_ADJUST'">
                        {{scope.row.reportTotal}}
                    </span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="type !== 'quality_checking'"
                    label="调整原因" width="200">
                <template slot-scope="scope">
                    <span
                        :class="{'orange-text': scope.row.adjustReason}">
                        {{scope.row.adjustReason}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="type !== 'quality_checking'"
                    prop="lastReviewLog"
                    label="审核备注" width="200">
            </el-table-column>
            <el-table-column
                    label="操作"
                    fixed="right"
                    width="300">
                <template slot-scope="scope">
                    <el-button class="operate-btn" @click="goDetail(scope.row)">查看详情</el-button>
                    <div class="blue">
                    <el-dropdown>
                        <nf-button style="font-size:12px;">打印</nf-button>
                        <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
                            <el-dropdown-item class=" fs12" disabled>选择打印模板</el-dropdown-item>
                            <el-dropdown-item :divided="index==0"
                                              :class="{active: item.defaultStatus ==1 ? true : false}"
                                              v-for="(item, index) in printList" :key="index"
                                              @click.native="go(item,scope.row.billId)">{{item.name}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    </div>
                    <!--状态 = 待审核 && 本人有此单据审核任务 && 审核-->
                    <template v-if="scope.row.status === 'AUDITING' && scope.row.taskId && scope.row.taskName === 'NORMAL_REVIEW'">
                        <el-button :loading="btnLoading" class="operate-btn" @click="review(scope.row.taskId, true)">通过</el-button>
                        <el-button :loading="btnLoading" class="operate-btn" @click="review(scope.row.taskId, false, 'reject')">驳回</el-button>
                        <el-button :loading="btnLoading" class="operate-btn" @click="UndoStatus(scope.row.billId)">撤回提报</el-button>
                    </template>
                    <!--状态 = 反审待批准 && 本人有此单据审核任务 && 反审-->
                    <template v-if="scope.row.status === 'PENDING_APPROVAL' && scope.row.taskId && scope.row.taskName === 'ANTI_REVIEW'">
                        <el-button :loading="btnLoading" class="operate-btn agree-btn" @click="review(scope.row.taskId, true)">批准</el-button>
                        <el-button :loading="btnLoading" class="operate-btn refuse-btn" @click="review(scope.row.taskId, false)">不批准</el-button>
                         <el-button :loading="btnLoading" class="operate-btn" @click="UndoStatus(scope.row.billId, 0)">撤回申请</el-button>
                    </template>
                    <!--状态 = 已通过 && （数量大于0 || 调整单）-->
                    <template v-if="scope.row.status === 'PASS' && (scope.row.reportTotal > 0 || scope.row.billType === 'FAC_MISSION_ADJUST')">
                        <el-button class="operate-btn" @click="showUnpassDialog(scope.row)">申请反审</el-button>
                    </template>
                    <!--状态 = 反审待批准 && 当前userId等于登陆userId-->
                    <!-- <template v-if="scope.row.status === 'PENDING_APPROVAL' && scope.row.taskId && scope.row.taskName === 'ANTI_REVIEW'">
                       
                    </template> -->
                    <!--状态 = 待审核 && 当前userId等于登陆userId-->
                    <!-- <template v-if="scope.row.status === 'AUDITING' && scope.row.taskId && scope.row.taskName === 'NORMAL_REVIEW'">
                        
                    </template> -->
                    <!--状态 = (草稿 || 已驳回）&& (调整数量大于0 || 调整单)-->
                    <template v-if="(scope.row.status === 'DRAFT' || scope.row.status === 'REJECT') && (scope.row.reportTotal > 0 || scope.row.billType === 'FAC_MISSION_ADJUST')">
                        <el-button :loading="btnLoading" class="operate-btn" @click="billReport(scope.row.billId)">提报</el-button>
                    </template>
                    <!--状态 = (草稿 || 已驳回）&& 调整数量大于0 &&（数量明细型 || 裁床数量型）&& 节点类型不是（扎号 || 唯一码）-->
                    <template v-if="(scope.row.status === 'DRAFT' || scope.row.status === 'REJECT') && scope.row.reportTotal > 0 && (scope.row.prcdNodeCode === 'quantitative-detail' || scope.row.prcdNodeCode === 'actual-cutting') && !(scope.row. associateLigation || scope.row. associateWym)">
                        <el-button :loading="btnLoading" class="operate-btn" @click="billReedit(scope.row)">编辑</el-button>
                    </template>
                </template>
            </el-table-column>

        </el-table>

        <!--驳回弹窗-->
        <el-dialog :title="applyAntiReviewType === 'reject'?'驳回原因':'申请反审原因'"
                   @close="applyAntiReviewDesc=''"
                   class="custom-dialog unpass-dialog"
                   :modal-append-to-body="false"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :visible="taskUnPassDialog">
            <div style="display: flex;">
                <el-input type="textarea" rows="6" v-model="applyAntiReviewDesc" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="handleCloseDialog">取消</nf-button>
                <nf-button type="warning" @click="antiReview(cancelId)" :loading="isloadingApply">确定</nf-button>
            </div>
        </el-dialog>

        <!--数量型节点上报单据编辑弹窗-->
        <num-node-report
            :isShow.sync="reportDialog"
            :nodeType="nodeType"
            :billId="billId"
            :billType="billType"
            :missionNodeId="missionNodeId"
            :facMissionOutsideFlag="facMissionOutsideFlag"
            :isOutsideFacNode="isOutsideFacNode"
            :sendToFactoryId="sendToFactoryId"
            :sendToUserId="sendToUserId"
            :upstreamNodeId="upstreamNodeId"
            :outsideNextFollowPre="outsideNextFollowPre"
            :reportUserOptions="reportUserOptions"
            :reportSendSelectUser="reportSendSelectUser"
            :reportSendSelectUserDefComplete="reportSendSelectUserDefComplete"
            @reeditSuccess="updateTable">
        </num-node-report>
    </div>
</template>

<script>
    import {
        billReviewConfig,
        billReportReview,
        billReportUndo,
        billReportAntiReview,
        billReportUndoStatus,
        billReportSubmit,
        facTemplates,
    } from "@/api";
    import numNodeReport from '@/components/Common/dialog/numNodeReport.vue';
    export default {
        name: "billTable",
        props:['type','tableData'],
        /******************
         *
         * type: 表格类型，分为以下几种
         *          ‘actual_cutting’ 裁床数量型
         *          'quantitative'  数量明细型
         *          'total' 总数型
         *          'tail_in_store' 入库型
         *          'tail_out_store'  发货型
         *          'quality_checking'    质检型
         *
         * ******************/
        data(){
            return {
                // isConfig: false,
                printList:[],
                btnLoading: false,
                taskUnPassDialog: false,
                applyAntiReviewType: '',    //驳回原因
                applyAntiReviewDesc: '',    //申请反审的原因
                cancelId: '',   //申请反审id
                reportDialog: false,
                nodeType: '', //节点类型
                billId: '', //单据id
                billType: '', //单据类型
                missionNodeId: '',  //工单节点id
                isOutsideFacNode: false, //节点是否关联外发
                facMissionOutsideFlag: false,   //工单是否整单外发
                sendToFactoryId: "",    //发往工厂
                sendToUserId: "",   //发往工位
                upstreamNodeId: "",     //上游节点
                outsideNextFollowPre: false,    // 本节点外发/分活明细跟随上游节点
                reportUserOptions: "",  //上游节点发往工位
                reportSendSelectUser: false,   // 是否上报完成数的同时上报发往工厂、工位
                reportSendSelectUserDefComplete: false, // 是否发往工厂、工位默认取完成工厂、工位
            }
        },
        components:{
            numNodeReport,
        },
        computed:{
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        created() {
          // this.getBillReviewConfig()
            this.getFacTemplates()
        },
        methods:{
            // 获取打印列表
            getFacTemplates() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    type: 'mission_report',
                    pageNo: 1,
                    pageSize: 9999,
                    using: true,
                    typeId: ''
                }
                facTemplates(params).then(res => {
                    this.printList = res.data.data.list
                })
            },
            // 打印跳转
            go(item, id) {
                // 权限
                // if (!this.powerJudgement.permissions("fac.prcmission.print")) {
                //     return
                // }
                window.open(`/#/printShow?templateId=${item.id}&businessId=${id}&printType=print&billType=mission_report`)
            },
            //更新表格数据
            updateTable(){
                this.$emit('commit');
            },
            //编辑按钮权限验证
            billReedit(row){
                // 权限
                if((!this.powerJudgement.permissions("fac.mission.report.edit"))){
                    return
                }
                this.nodeType = row.prcdNodeCode;
                this.billId = row.billId;
                this.billType = row.billType;
                this.isOutsideFacNode = row.associateOutside;
                this.facMissionOutsideFlag = row.facMissionOutsideFlag;
                this.missionNodeId = row.facMissionPrcdNodeId;
                this.sendToFactoryId =  row.sendToFactoryId,
                this.sendToUserId = row.sendToUserId,
                this.upstreamNodeId= row.upstreamNodeId;
                this.outsideNextFollowPre= row.outsideNextFollowPre;
                this.reportUserOptions= row.reportUserOptions;
                this.reportSendSelectUser= row.reportSendSelectUser;
                this.reportSendSelectUserDefComplete= row.reportSendSelectUserDefComplete;
                this.reportDialog = true;
            },
            //是否有审核台
            // getBillReviewConfig(){
            //         billReviewConfig({unitId:this.unitId}).then(res=>{
            //             if(res.data.data.configs && res.data.data.configs.length>0){
            //                 //是否有审核台
            //                 this.isConfig = res.data.data.configs.some(v => v.billType == 'FAC_MISSION_ADJUST')
            //             }
            //         })
            // },
            //审核"通过"，"驳回", "同意", "拒绝"
            review(id, result, reject){
                if(reject && reject==='reject'){
                    //驳回
                    this.cancelId = id;
                    this.applyAntiReviewType = reject;
                    this.taskUnPassDialog = true
                    return
                }
                this.btnLoading = true;
                let params = {
                    taskId: id,
                    result: result,
                    userId: this.userId,
                };
                if(this.applyAntiReviewType === 'reject'){
                    params.message=this.applyAntiReviewDesc
                }
                billReportReview(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.taskUnPassDialog = false;
                        this.$message.success(res.data.msg);
                        this.$emit('commit');
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //撤销
            undoReport(id){
                // 权限
                if(!this.powerJudgement.permissions(" fac.mission.report.revert.view")){
                    return
                }
                this.btnLoading = true;
                let params = {
                    billId: id,
                    userId: this.userId
                };
                billReportUndo(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('commit');
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //申请反审
            antiReview(id){
                if(this.applyAntiReviewType === 'reject'){
                    this.review(id, false);
                    return
                }
                this.isloadingApply = true;
                let params = {
                    billId: id,
                    userId: this.userId,
                    message: this.applyAntiReviewDesc,
                };
                billReportAntiReview(params).then(res => {
                    this.isloadingApply = false;
                    if (res.data.code === 0) {
                        this.applyAntiReviewDesc = '';
                        this.taskUnPassDialog = false;
                        this.$message.success(res.data.msg);
                        this.$emit('commit');
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //撤回
            UndoStatus(id, type){
                //“撤回申请”需要做权限判断
                if(type === 0 && (!this.powerJudgement.permissions("fac.mission.report.revert.view"))){
                    return
                }
                this.btnLoading = true;
                let params = {
                    billId: id,
                    userId: this.userId
                };
                billReportUndoStatus(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('commit');
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //提报
            billReport(id){
                this.btnLoading = true;
                let params = {
                    billId: id,
                    userId: this.userId,
                };
                billReportSubmit(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        this.$emit('commit');
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //跳转详情
            goDetail(row){
                this.$router.push({
                    path:'/allReportBillDetail',
                    query:{
                        billId: row.billId,
                        missionId: this.$route.query.missionId,
                    }
                })
            },
            //显示申请反审弹窗
            showUnpassDialog(row){
                // 权限
                if((!this.powerJudgement.permissions("fac.mission.report.umpire.apply"))){
                    return
                }
                this.cancelId = row.billId;
                this.applyAntiReviewType = 'antiReview'
                //节点有配“审核配置”
                if(row.isConfig){
                    this.taskUnPassDialog = true
                }else{
                    this.antiReview(this.cancelId);
                }
            },
            //关闭申请反审弹窗
            handleCloseDialog(){
                this.applyAntiReviewDesc = '';
                this.taskUnPassDialog = false
            },
            //“已撤销”行 显示样式
            tableRowClassName(row){
                if(row.status === 'REJECT'){
                    return 'cancel-line'
                }
            },
            //状态列 显示样式
            renderStatus(row) {
                if (row.status) {
                    if (row.status === 'AUDITING' || row.status === 'PENDING_APPROVAL') {
                        return 'blue'
                    }else if(row.status === 'PASS'){
                        return 'green'
                    }
                }
                return null;
            },

        }
    }
</script>

<style lang="scss" scoped>
    .bill-table{
        .blue-text{
            color: #438DF1;
        }
        .green-text{
            color: #23C811;
        }
        .orange-text{
            color: #FF7F14;
        }
        .operate-btn{
            font-size: 12px;
            padding: 0;
            color: #1CA1FF;
            cursor: pointer;
            background-color: transparent;
            border: none;
            position: relative;
            text-decoration: underline;
            &:before{
                position:absolute;
                top:0;
                left: -10px;
                content:'';
                height:100%;
                width:1px;
                border-left:1px solid rgb(223, 228, 236);
            }
            &:first-child:before{
                border:none;
            }
            &.agree-btn{
                color: #23C811;
            }
            &.refuse-btn{
                color: #FA4150;
            }
            &.cancel-btn{
                 color: #808080;
             }
        }
        .el-button + .el-button{
            margin-left: 15px;
        }
        .exceed-num{
            font-style: normal;
            font-size: 12px;
            color: #f03535;
        }
    }
</style>
<style lang="scss">
    .bill-table{
        .cancel-line {
            color: #A2ABB8;
        }
        .unpass-dialog{
            .el-dialog{
                width: 380px;
                .el-dialog__body{
                    padding: 18px;
                }
                .el-dialog__footer{
                    padding: 12px 0;
                }
            }
        }
        .blue {
            display: inline-block;
            .el-dropdown {
                .nf-button--default {
                    border: none !important;
                    color: #1CA1FF;
                    text-decoration: underline;
                }
            }
        }
    }

</style>
