<template>
  <div class="bill-detail">
    <page-title v-if="detailData.billName" :title="detailData.billName +'详情'">
      <div class="btns">
        <nf-button @click="$router.go(-1)">返回上级</nf-button>
      </div>
    </page-title>
    <div class="bill-content">
      <!-- 按钮part start-->
      <div class="bill-btngroup">
        <div class="blue">
          <el-dropdown>
            <nf-button class="operate-btn" type="warning">打印</nf-button>
            <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
              <el-dropdown-item class="fs12" disabled>选择打印模板</el-dropdown-item>
              <el-dropdown-item
                :divided="index==0"
                :class="{active: item.defaultStatus ==1 ? true : false}"
                v-for="(item, index) in printList"
                :key="index"
                @click.native="go(item,detailData.billId)"
              >{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <template v-if="detailData.taskId && detailData.taskName === 'NORMAL_REVIEW'">
          <span class="bill-btn green" @click="review(detailData.taskId, true)">通过</span>
          <span class="bill-btn red" @click="review(detailData.taskId, false)">驳回</span>
        </template>
        <template v-if="detailData.taskId && detailData.taskName === 'ANTI_REVIEW'">
          <span class="bill-btn green" @click="review(detailData.taskId, true)">同意</span>
          <span class="bill-btn red" @click="review(detailData.taskId, false)">拒绝</span>
        </template>-->
        <!--状态 = 待审核 && 本人有此单据审核任务 && 审核-->
        <template
          v-if="detailData.status === 'AUDITING' && detailData.taskId && detailData.taskName === 'NORMAL_REVIEW'"
        >
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            type="success"
            @click="review(detailData.taskId, true)"
          >通过</nf-button>
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            type="danger"
            @click="review(detailData.taskId, false, 'reject')"
          >驳回</nf-button>
          <el-button :loading="btnLoading" class="operate-btn" @click="UndoStatus(scope.row.billId)">撤回提报</el-button>
        </template>
        <!--状态 = 反审待批准 && 本人有此单据审核任务 && 反审-->
        <template
          v-if="detailData.status === 'PENDING_APPROVAL' && detailData.taskId && detailData.taskName === 'ANTI_REVIEW'"
        >
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            type="success"
            @click="review(detailData.taskId, true)"
          >批准</nf-button>
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            type="danger"
            @click="review(detailData.taskId, false)"
          >不批准</nf-button>
           <el-button :loading="btnLoading" class="operate-btn" @click="UndoStatus(scope.row.billId, 0)">撤回申请</el-button>
        </template>
        <!--状态 = 已通过 && （数量大于0 || 调整单）-->
        <template
          v-if="detailData.status === 'PASS' && (detailData.reportTotal > 0 || detailData.billType === 'FAC_MISSION_ADJUST')"
        >
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            @click="showUnpassDialog(detailData)"
          >申请反审</nf-button>
        </template>
        <!--状态 = 反审待批准 && 当前userId等于登陆userId-->
        <!-- <template v-if="detailData.status === 'PENDING_APPROVAL' && detailData.userId === userId">
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            @click="UndoStatus(detailData.billId, 0)"
          >撤回申请</nf-button>
        </template> -->
        <!--状态 = 待审核 && 当前userId等于登陆userId-->
        <!-- <template v-if="detailData.status === 'AUDITING' && detailData.userId === userId">
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            @click="UndoStatus(detailData.billId)"
          >撤回提报</nf-button>
        </template> -->
        <!--状态 = (草稿 || 已驳回）&& (调整数量大于0 || 调整单)-->
        <template
          v-if="(detailData.status === 'DRAFT' || detailData.status === 'REJECT') && (detailData.reportTotal > 0 || detailData.billType === 'FAC_MISSION_ADJUST')"
        >
          <nf-button
            :loading="btnLoading"
            class="operate-btn"
            type="warning"
            @click="billReport(detailData.billId)"
          >提报</nf-button>
        </template>
        <!--状态 = (草稿 || 已驳回）&& 调整数量大于0 &&（数量明细型 || 裁床数量型）&& 节点类型不是（扎号 || 唯一码）-->
        <template
          v-if="(detailData.status === 'DRAFT' || detailData.status === 'REJECT') && detailData.reportTotal > 0 && (detailData.prcdNodeCode === 'quantitative-detail' || detailData.prcdNodeCode === 'actual-cutting') && !(detailData. associateLigation || detailData. associateWym)"
        >
          <nf-button :loading="btnLoading" class="operate-btn" @click="billReedit(detailData)">编辑</nf-button>
        </template>
      </div>
      <!-- 按钮part start-->
      <div class="content-wrap">
        <div class="yellow-border-title">
          <div class="title">单据信息</div>
        </div>
        <el-form class="bill-form" label-width="120px">
          <el-row>
            <el-col v-for="(item, index) in detailData.billInfo" :key="index" :span="6">
              <el-form-item :label="item.key + '：'" class="form-item">
                <span>{{item.value}}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="content-wrap">
        <div class="yellow-border-title">
          <div class="title">上报信息</div>
        </div>
        <el-form class="goods-form" label-width="120px">
          <el-row>
            <template v-for="(item, index) in detailData.styleInfo">
              <!--商品图片-->
              <el-col v-if="item.code === 'stylePicture'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <img class="img" :src="item.value">
                </div>
              </el-col>
              <!--次品上报明细-->
              <el-col v-else-if="item.code === 'defectiveReportDetail'" :span="24">
                <template v-if="item.value.associateWYM">
                  <el-form-item
                    class="table-title"
                    :label="item.key + '-关联唯一码：'"
                    label-width="190px"
                  ></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="substandardWym"
                      :tableData="item.value.defectiveds"
                    ></bill-detail-table>
                  </div>
                </template>
                <template v-else-if="item.value.associateLigation">
                  <el-form-item
                    class="table-title"
                    :label="item.key + '-关联扎号：'"
                    label-width="190px"
                  ></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="substandardLigation"
                      :tableData="item.value.defectiveds"
                    ></bill-detail-table>
                  </div>
                </template>
                <template v-else>
                  <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="substandard"
                      :tableData="item.value.defectiveds"
                    ></bill-detail-table>
                  </div>
                </template>
              </el-col>
              <!--废品上报明细-->
              <el-col v-else-if="item.code === 'wasteReportDetail'" :span="24">
                <template v-if="item.value.associateWYM">
                  <el-form-item
                    class="table-title"
                    :label="item.key + '-关联唯一码：'"
                    label-width="190px"
                  ></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="wasteWym"
                      :tableData="item.value.wasteds"
                    ></bill-detail-table>
                  </div>
                </template>
                <template v-else-if="item.value.associateLigation">
                  <el-form-item
                    class="table-title"
                    :label="item.key + '-关联扎号：'"
                    label-width="190px"
                  ></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="wasteLigation"
                      :tableData="item.value.wasteds"
                    ></bill-detail-table>
                  </div>
                </template>
                <template v-else>
                  <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                  <div class="table-bg">
                    <bill-detail-table
                      v-if="item.value"
                      type="waste"
                      :tableData="item.value.wasteds"
                    ></bill-detail-table>
                  </div>
                </template>
              </el-col>
              <!--外发上报明细-->
              <el-col v-else-if="item.code === 'outsideReportDetail'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <div class="table-text">
                    <span class="name">{{item.value.outsideFactoryName}}</span>
                    <span v-if="item.value.chargerName">- {{item.value.chargerName}}</span>
                    <span class="num">{{item.value.skus.quantity}}</span>
                  </div>
                  <nf-sku-table
                    v-if="item.value.skus"
                    ref="staticSkuTable"
                    showNum="true"
                    :metadatas="detailData.metadatas"
                    :quantities="item.value.skus"
                  ></nf-sku-table>
                </div>
              </el-col>
              <!--客户发货明细-->
              <el-col v-else-if="item.code === 'customerReportDetail'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <div class="table-text">
                    <span class="name">{{item.value.customerName}}</span>
                    <span class="num">{{item.value.skus.quantity}}</span>
                  </div>
                  <nf-sku-table
                    v-if="item.value.skus"
                    ref="staticSkuTable"
                    showNum="true"
                    :metadatas="detailData.metadatas"
                    :quantities="item.value.skus"
                  ></nf-sku-table>
                </div>
              </el-col>
              <!--上报明细-->
              <el-col v-else-if="item.code === 'reportDetail'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <nf-sku-table
                    v-if="item.value.skus"
                    ref="staticSkuTable"
                    showNum="true"
                    showExceedNum="true"
                    :metadatas="detailData.metadatas"
                    :quantities="item.value.skus"
                  ></nf-sku-table>
                </div>
              </el-col>
              <!--唯一码明细-->
              <el-col v-else-if="item.code === 'uniqueDetail'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <bill-detail-table v-if="item.value" type="wym" :tableData="item.value.uniques"></bill-detail-table>
                </div>
              </el-col>
              <!--扎号明细-->
              <el-col v-else-if="item.code === 'ligationDetail'" :span="24">
                <el-form-item class="table-title" :label="item.key + '：'" label-width="120px"></el-form-item>
                <div class="table-bg">
                  <!--不丢扎列表(如果为空或长度为0, 则整个表不显示)-->
                  <template v-if="item.value && item.value.ligationNotLosses.length">
                    <bill-detail-table type="ligation" :tableData="item.value.ligationNotLosses"></bill-detail-table>
                  </template>
                  <!--丢扎矩阵(如果为空或长度为0, 则整个表不显示)-->
                  <template v-if="item.value && item.value.ligationLosses.length">
                    <div class="table-text">
                      <span class="noLigationDetail">无扎上报</span>
                    </div>
                    <nf-sku-table
                      ref="staticSkuTable"
                      showNum="true"
                      :metadatas="detailData.metadatas"
                      :quantities="item.value.ligationLosses"
                    ></nf-sku-table>
                  </template>
                </div>
              </el-col>
              <!--除表格、图片之外的其他数据-->
              <el-col v-else :key="index" :span="6">
                <el-form-item :label="item.key + '：'" class="form-item">
                  <span>{{item.value}}</span>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </div>
    </div>

    <!--驳回弹窗 start-->
    <el-dialog
      :title="applyAntiReviewType === 'reject'?'驳回原因':'申请反审原因'"
      @close="applyAntiReviewDesc=''"
      class="custom-dialog unpass-dialog"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      :visible="taskUnPassDialog"
    >
      <div style="display: flex;">
        <el-input type="textarea" rows="6" v-model="applyAntiReviewDesc" placeholder="请输入原因"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <nf-button @click="handleCloseDialog">取消</nf-button>
        <nf-button type="warning" @click="antiReview(cancelId)" :loading="isloadingApply">确定</nf-button>
      </div>
    </el-dialog>
    <!--驳回弹窗 end-->

    <!--数量型节点上报单据编辑弹窗 start-->
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
      @reeditSuccess="updateTable"
    ></num-node-report>
    <!--数量型节点上报单据编辑弹窗 end-->
  </div>
</template>

<script>
import {
  billReportDetail,
  billReportReview,
  facTemplates,
  billReportUndoStatus,
  billReportAntiReview,
  billReportSubmit
} from "@/api";
import numNodeReport from "@/components/Common/dialog/numNodeReport.vue";
import billDetailTable from "@/components/order/allReportBill/billDetailTable.vue";
export default {
  name: "billDetail",
  data() {
    return {
      printList: [],
      detailData: {},
      billId: this.$route.query.billId, //单据id
      costShow: false, //是否显示查看工价

      // isConfig: false,
      btnLoading: false,
      taskUnPassDialog: false,
      applyAntiReviewType: "", //驳回原因
      applyAntiReviewDesc: "", //申请反审的原因
      cancelId: "", //申请反审id
      reportDialog: false,
      nodeType: "", //节点类型
      billType: "", //单据类型
      missionNodeId: "", //工单节点id
      isOutsideFacNode: false, //节点是否关联外发
      facMissionOutsideFlag: false, //工单是否整单外发
      sendToFactoryId: "", //发往工厂
      sendToUserId: "", //发往工位
      upstreamNodeId: "", //上游节点
      outsideNextFollowPre: false, // 本节点外发/分活明细跟随上游节点
      reportUserOptions: "", //上游节点发往工位
      reportSendSelectUser: false, // 是否上报完成数的同时上报发往工厂、工位
      reportSendSelectUserDefComplete: false // 是否发往工厂、工位默认取完成工厂、工位
    };
  },
  components: {
    numNodeReport,
    billDetailTable
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    unitId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    }
  },
  methods: {
    // 获取打印列表
    getFacTemplates() {
      let params = {
        userId: this.userId,
        unitId: this.unitId,
        type: "mission_report",
        pageNo: 1,
        pageSize: 9999,
        using: true,
        typeId: ""
      };
      facTemplates(params).then(res => {
        this.printList = res.data.data.list;
      });
    },
    // 打印跳转
    go(item, id) {
      // 权限
      // if (!this.powerJudgement.permissions("fac.prcmission.print")) {
      //     return
      // }
      window.open(
        `/#/printShow?templateId=${
          item.id
        }&businessId=${id}&printType=print&billType=mission_report`
      );
    },
    //审核"通过"，"驳回", "同意", "拒绝"
    // review(id, result) {
    //   let params = {
    //     taskId: id,
    //     result: result,
    //     userId: this.userId
    //   };
    //   billReportReview(params).then(res => {
    //     if (res.data.code === 0) {
    //       this.$message.success(res.data.msg);
    //       this.getDetailData();
    //     } else {
    //       this.$message.error(res.data.msg);
    //     }
    //   });
    // },

    //审核"通过"，"驳回", "同意", "拒绝"
    review(id, result, reject) {
      if (reject && reject === "reject") {
        //驳回
        this.cancelId = id;
        this.applyAntiReviewType = reject;
        this.taskUnPassDialog = true;
        return;
      }
      this.btnLoading = true;
      let params = {
        taskId: id,
        result: result,
        userId: this.userId
      };
      if (this.applyAntiReviewType === "reject") {
        params.message = this.applyAntiReviewDesc;
      }
      billReportReview(params).then(res => {
        this.btnLoading = false;
        if (res.data.code === 0) {
          this.taskUnPassDialog = false;
          this.$message.success(res.data.msg);
          this.getDetailData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //申请反审
    antiReview(id) {
      if (this.applyAntiReviewType === "reject") {
        this.review(id, false);
        return;
      }
      this.isloadingApply = true;
      this.btnLoading = true;
      let params = {
        billId: id,
        userId: this.userId,
        message: this.applyAntiReviewDesc
      };
      billReportAntiReview(params).then(res => {
        this.isloadingApply = false;
        this.btnLoading = false;
        if (res.data.code === 0) {
          this.applyAntiReviewDesc = "";
          this.taskUnPassDialog = false;
          this.$message.success(res.data.msg);
          this.getDetailData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //显示申请反审弹窗
    showUnpassDialog(row) {
      // 权限
      if (!this.powerJudgement.permissions("fac.mission.report.umpire.apply")) {
        return;
      }
      this.cancelId = row.billId;
      this.applyAntiReviewType = "antiReview";
      //节点有配“审核配置”
      if (row.isConfig) {
        this.taskUnPassDialog = true;
      } else {
        this.antiReview(this.cancelId);
      }
    },

    //关闭申请反审弹窗
    handleCloseDialog() {
      this.applyAntiReviewDesc = "";
      this.taskUnPassDialog = false;
    },

    //更新表格数据
    updateTable() {
      this.getDetailData();
    },

    //编辑按钮权限验证
    billReedit(row) {
      // 权限
      if (!this.powerJudgement.permissions("fac.mission.report.edit")) {
        return;
      }
      this.nodeType = row.prcdNodeCode;
      this.billId = row.billId;
      this.billType = row.billType;
      this.isOutsideFacNode = row.associateOutside;
      this.facMissionOutsideFlag = row.facMissionOutsideFlag;
      this.missionNodeId = row.facMissionPrcdNodeId;
      this.sendToFactoryId = row.sendToFactoryId;
      this.sendToUserId = row.sendToUserId;
      this.upstreamNodeId = row.upstreamNodeId;
      this.outsideNextFollowPre = row.outsideNextFollowPre;
      this.reportUserOptions = row.reportUserOptions;
      this.reportSendSelectUser = row.reportSendSelectUser;
      this.reportSendSelectUserDefComplete =
        row.reportSendSelectUserDefComplete;
      this.reportDialog = true;
    },

    //撤回
    UndoStatus(id, type) {
      //“撤回申请”需要做权限判断
      if (
        type === 0 &&
        !this.powerJudgement.permissions("fac.mission.report.revert.view")
      ) {
        return;
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
          this.getDetailData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

    //提报
    billReport(id) {
      this.btnLoading = true;
      let params = {
        billId: id,
        userId: this.userId
      };
      billReportSubmit(params).then(res => {
        this.btnLoading = false;
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.getDetailData();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取列表
    getDetailData() {
      let params = {
        userId: this.userId,
        billId: this.billId
      };
      billReportDetail(params).then(res => {
        if (res.data.code === 0) {
          this.detailData = res.data.data;
          if (!this.costShow) {
            this.detailData.styleInfo = this.detailData.styleInfo.filter(
              item => {
                return !(
                  item.code == "outsidePrice" || item.code == "processPrice"
                );
              }
            );
          }
          // console.log(this.costShow);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 判断查看工价权限
    checkCost() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist.indexOf("fac.mission.labour.cost.view") == -1) {
        this.costShow = false;
      } else {
        this.costShow = true;
      }
    }
  },
  created() {
    this.getDetailData();
    this.checkCost();
    this.getFacTemplates();
  }
};
</script>

<style lang="scss" scoped>
.bill-detail {
  .bill-content {
    padding: 25px;
    background-color: #fff;
    position: relative;
    .bill-btngroup {
      position: absolute;
      right: 20px;
      .bill-btn {
        display: inline-block;
        width: 64px;
        margin: 0 5px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        &.red {
          background-color: #fa4150;
        }
        &.green {
          background-color: #23c811;
        }
      }
    }
    .content-wrap {
      margin-bottom: 20px;
      .yellow-border-title {
        margin-bottom: 15px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .table-bg {
        display: inline-block;
        padding: 10px 20px;
        width: 90%;
        .table-text {
          line-height: 25px;
          .num {
            font-weight: bold;
            color: #ff7f14;
          }
          .noLigationDetail {
            text-align: right;
            vertical-align: middle;
            font-size: 14px;
            color: rgb(72, 82, 106);
            line-height: 1;
            padding: 11px 12px 11px 0;
            box-sizing: border-box;
            display: block;
            font-weight: bold;
            width: 90px;
          }
        }
        .img {
          max-width: 200px;
          max-height: 200px;
        }
      }
    }
  }
  .operate-btn {
    font-size: 12px !important;
  }
}
</style>
<style lang="scss">
.bill-detail {
  .bill-content {
    .table-title .el-form-item__label {
      font-weight: bold;
    }
  }
  .blue {
    display: inline-block;
    .el-dropdown {
      .nf-button--default {
        border: none !important;
        color: #1ca1ff;
        text-decoration: underline;
      }
    }
  }
  // 驳回弹窗
  .unpass-dialog {
    .el-dialog {
      width: 380px;
      .el-dialog__body {
        padding: 18px;
      }
      .el-dialog__footer {
        padding: 12px 0;
      }
    }
  }
}
</style>
