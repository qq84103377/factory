<template>
    <div class="node-list-table">
        <el-row class="node-table-title">
            <el-col :span="12" style="color: #555555;">
                <nf-button
                  v-if="!componentData.associateWYM"
                  style="margin-right:10px;"
                  class="report-btn"
                  type="success"
                  @click="reprot('finishNum', 'total')">上报完成数</nf-button>
                <!--关联唯一码和扎号不显示-->
                <nf-button
                        v-if="!isWYMOrLigation && componentData.header.allowBillAdjustNum"
                        style="margin-right:10px;"
                        class="report-btn"
                        type="warning"
                        @click="reprot('changeNum', 'total')">上报调整数</nf-button>
                <!--完成数-->
                <template v-if="skuRadio === 0">
                    <span>完成数：</span>
                    <span v-if="componentData">
                    <span style="color:#1ca1ff;">{{componentData.completed}}</span>
                    / {{componentData.target}}</span>
                    <!-- 实裁数为true时显示 -->
                    <span v-if="componentData.actualCutting" class="num-show">实裁数</span>
                    <span v-if="componentData.actualCutting" style="color:#ccc;">（订货数：{{componentData.amount}}）</span>
                </template>
                <!--未完成数-->
                <template v-if="skuRadio === 1">
                    <span>未完成数：</span>
                    <span>{{unDoneNum}} / {{componentData.target}}</span>
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
                <nf-button :loading="isLoadiing" v-if="componentData.associateWYM" style="color:#fff;background-color:#939fb8;" @click="wymStatus">查看唯一码状态</nf-button>
                <!--<view-record-btn v-if="!componentData.associateWYM" :component-data="componentData" type="quantitative"></view-record-btn>-->
                <!--<span class="gray-report outsideBtn" @click="openOutSide">{{isOutside? '收起完成工厂上报统计' : '展开完成工厂上报统计'}}</span>-->
            </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row class="node-list-content">
            <nf-sku-table
                ref="staticSkuTable"
                :metadatas="instanceWorkflow.metadatas"
                :quantities="instanceWorkflow.quantities"
                style="margin-top: 20px"></nf-sku-table>
              <!-- 完成工厂上报统计 -->
            <transition v-if="isOutside" class="node-list-content" name="out-in">
              <div>
                <div v-for="(el ,index) in outsideFactorySkuList" :key="index">
                  <div style="margin-top:20px;">{{el.outsideFactoryName}}：{{el.totalNum}}</div>
                  <nf-sku-table
                  ref="staticSkuTable"
                  :metadatas="instanceWorkflow.metadatas"
                  :quantities="el.outsideFactorySkuList"
                  style="margin-top: 20px" :showNum="true"></nf-sku-table>
                </div>
              </div>
            </transition>
            <!-- 查看扎号上报情况 -->
            <view-ligation-status
              v-if="isLigationNode"
              ref="viewLigationStatus"
              :component-data="componentData"
              @on-handle-item="handleEditReport"></view-ligation-status>
            <!-- 查看扎号上报情况--end -->
        </el-row>
        <!--查看全部上报单据-->
        <el-col :span="24">
            <view-bill-btn
                    type="quantitative"
                    :num="untreatedNum"
                    :missionId="instanceWorkflow.mission.missionId"
                    :missionPrcdNodeId="instanceWorkflow.components.information.header.missionNodeId">
            </view-bill-btn>
        </el-col>
        <!--单据表格-->
        <bill-table
                v-if="!isWYMOrLigation && tableData.length"
                type="quantitative"
                :tableData="tableData"
                @commit="billReport">
        </bill-table>
        <!--子矩阵-->
        <submatrixComponents
                v-if="showOutSideFacAndPrice"
                @reprot="reprot"
                :key="instanceWorkflow.components.information.header.missionNodeId"
                :missionNodeId="instanceWorkflow.components.information.header.missionNodeId"
                :allowBillAdjustNum="!isWYMOrLigation &&componentData.header.allowBillAdjustNum"
                :skuRadio="skuRadio"
                :metadatas="instanceWorkflow.metadatas">
        </submatrixComponents>

        <el-dialog
            custom-class="nf-dialog-common"
            :visible.sync="visible.addReportVisible"
            :title="reportDialogTitle">
            <div class="dialog-body">
                <dialog-form
                    ref="dialogForm"
                    :isShow="visible.addReportVisible"
                    :isSubmatrixComponents="isSubmatrixComponents"
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
                <template v-if="!isLigationNode">
                    <nf-sku-table
                        ref="nfskutable"
                        editable
                        @change="handleSkuValueChange"
                        :metadatas="instanceWorkflow.metadatas"
                        :quantities="instanceWorkflow.quantities"
                        style="margin-top: 20px">
                    </nf-sku-table>
                </template>
                <!-- 关联扎号上报列表 -->
                <ligation-report-list
                    v-if="isLigationNode && visible.addReportVisible"
                    ref="ligationReportList"
                    v-model="ligationParams"
                    :ligation-list="commonLigationReportList"
                    :editable="visible.ligationEditable"
                    :instanceWorkflow="instanceWorkflow"
                    :component-data="componentData"
                    @on-sku-change="handleSkuValueChange">
                </ligation-report-list>
                <div class="adjust-cause" v-if="reportDialogTitle === '上报调整数'">
                    <span class="adjust-text">调整原因：</span>
                    <el-input class="adjust-textarea" type="textarea" maxlength="100" v-model="reportFrom.adjustCause"></el-input>
                </div>
                <outsideFacAndStation
                        v-if="reportDialogTitle === '上报完成数' && !isWYMOrLigation && reportSendSelectUser"
                        :formModel="reportFrom"
                        :information="instanceWorkflow.components.information">
                </outsideFacAndStation>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="space-between" align="center">
                <div class="count-total">
                    数量合计：<strong>{{ isLigationNode ? ligationTotal : totalNum}}</strong>
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
    import submatrixComponents from './submatrixComponents'
import CommonMixin from './common-mixin';
import {
  cancelReport,
  handReport,
  wymStatus,
  addReportDataDetail,
  getSkuBarcodeInfo,
  updateNumNode,
  updateBedNode,
  updateTotalNode,
  getoutsideFactorySku,
  billReportList,
    checkReportPermission,
} from "@/api";
import { mapState } from "vuex";
import viewBillBtn from '@/components/order/common/view-bill-btn';
import billTable from '@/components/order/allReportBill/billTable.vue';
import outsideFacAndStation from '@/components/order/common/outsideFacAndStation';

export default {
  inject: ['homeRouterReload'],     //注入全局刷新方法
  props: {
    instanceWorkflow: {},
    selectPersonList: []
  },
  mixins: [CommonMixin],
  data() {
    return {
      finishFlag:false,//上报成功时完成额标志位
      skuRadio: 0,
      unDoneNum: 0,
      currentNodeName: "",
      reportFrom: {
        leaders: [],
        endAt: "",
        finishUserId: "",
        outsideFactoryId: "",
        adjustCause: "",    //调整原因
        outSideFactoryId: "",
        sendToFactoryId: "ourFactory",
        sendToUserId: "",
      },
      bedNum: "",
      totalNum: 0,
      visible: {
        addReportVisible: false,
        wymDialogVisible: false,
        handReport: false,
        cancelReport: false,
        btnLoading1: false,
        btnLoading2: false,
        ligationEditable: false,
      },
      latheSort: 0,
      wymSort: 0,
      orderStatus: "0",
      ywmData: [],
      handReportData: [],
      cancelReportData: [],
      // outsideFactoryList: [], // 完成工厂列表
      orderByLathe: "0",
      orderByWYM: "0",
      sign: "0",
      staff_disabled: false, //人员禁用
      date_disabled: false, //完成日期禁用
      totalNum:'',
      isOutside: false, // 加工厂上报展示
      outsideFactorySkuList: [], // 完成工厂sku数据展示
      isLoading:false,
        reportDialogTitle:'',     //上报弹窗标题
        tableData: [],
        dialogOutsideFacId: '',     //上报弹窗要显示的默认完成工厂
        untreatedNum: 0,
        isSubmatrixComponents: false,   //是否子矩阵上报
    }
  },
    components:{
        viewBillBtn,
        billTable,
        submatrixComponents,
        outsideFacAndStation,
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
    componentData() {
      return this.instanceWorkflow.components.quantitative;
    },
    outsideFactoryList() {
      let list = []
      if (this.instanceWorkflow.components.information.facMissionOutsideFlag) {
        this.reportFrom.outsideFactoryId = this.instanceWorkflow.components.information.facMissionOutsideFactoryId
        list = [{outsideFactoryName: this.instanceWorkflow.components.information.facMissionOutsideFactoryName,outsideFactoryId: this.instanceWorkflow.components.information.facMissionOutsideFactoryId}]
      } else {
        list = this.instanceWorkflow.components.information.facMissionPrcdNodeOutsideFactoryList
        if(this.instanceWorkflow.components.information.facMissionPrcdNodeOutsideFactoryList.length === 1) {
          this.reportFrom.outsideFactoryId = this.instanceWorkflow.components.information.facMissionPrcdNodeOutsideFactoryList[0].outsideFactoryId
        } else {
          this.reportFrom.outsideFactoryId = ''
        }
      }
      return list
    },
    //节点关联唯一码或者扎号
    isWYMOrLigation(){
        if(this.componentData.associateWYM || this.componentData.associateLigation){
            return true
        }else{
            return false
        }
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
  mounted() {
    this.outsideFactorySku()
  },
  created(){
      this.getBillTableData();
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
    // 获取完成工厂上报sku
    outsideFactorySku(){
      getoutsideFactorySku({missionNodeId:this.$route.query.instanceWorkflowId}).then(res =>{
        this.outsideFactorySkuList = res.data.data
      })
    },
    // 获取完成工厂id
    changeSupplierId(val) {
      this.reportFrom.outsideFactoryId = val.id
    },
    // 完成工厂上报统计展开
    openOutSide() {
      this.isOutside = !this.isOutside
    },
    //全局刷新方法
    refreshAll(){
        this.homeRouterReload();
    },
    handleSkuValueChange(val, total) {
      this.totalNum = total;
    },
    sortTable(val) {
      console.log(val);
      let sort = val.order;
      if (val.prop == "WYM") {
        if (sort == "ascending") {
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
      if (val.prop == "lathe") {
        if (sort == "ascending") {
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
    renderHeader(createElement, { column, $index }) {
      return (
        <div>
          <el-select
            class="test"
            onChange={this.showStatusSelect}
            v-model={this.orderStatus}
            placeholder="请选择"
          >
            <el-option label="全部状态" value="0" />
            <el-option label="已上报" value="1" />
            <el-option label="未上报" value="4" />
          </el-select>
        </div>
      );
    },
    showStatusSelect() {
      this.wymStatus();
    },
    // handReport() {
    //   let params = {
    //     instanceId: this.instanceWorkflow.components.status.id,
    //     userId: this.$store.state.userInfo.id,
    //     wymId: this.handReportData[0].uniqueId
    //   };
    //   this.visible.btnLoading = true;
    //   handReport(params).then(res => {
    //     if (res.data.code == 0) {
    //       this.$message.success("上报成功");
    //       this.visible.handReport = false;
    //       this.wymStatus();
    //       this.addReportSuccess();
    //       this.outsideFactorySku()
    //     } else {
    //       this.$message.error(res.data.msg);
    //     }
    //       this.visible.btnLoading = false;
    //   });
    // },
    cancelReport() {
      let params = {
        instanceId: this.instanceWorkflow.components.status.id,
        userId: this.$store.state.userInfo.id,
        wymId: this.cancelReportData[0].uniqueId
      };
      cancelReport(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$message.success("取消上报成功");
          this.wymStatus();
          this.$emit("on-report");
          this.visible.cancelReport = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // reportOpera(row) {
    //   console.log(row);
    //   if (row.reportStatus == 4) {
    //     this.handReportData = [row];
    //     this.visible.handReport = true;
    //     this.visible.wymDialogVisible = true;
    //   } else {
    //     this.cancelReportData = [row];
    //     this.visible.cancelReport = true;
    //     this.visible.wymDialogVisible = true;
    //   }
    // },
    // filterTag(value, row) {
    //   this.orderStatus = value;
    //   if (this.orderStatus == 0) {
    //     this.wymStatus();
    //     return;
    //   }
    //   return row.reportStatus == value;
    // },
    wymStatus() {
        this.$router.push({
            path:'/missionWymStatus',
            query:{instanceId:this.instanceWorkflow.components.status.id,missionId:this.$route.query.missionId}
        })
      //   return
      // this.isLoadiing = true;
      // let params = {
      //   missionNodeId: this.instanceWorkflow.components.status.id,
      //   orderByLathe: this.orderByLathe,
      //   orderByWYM: this.orderByWYM,
      //   status: this.orderStatus
      // };
      // wymStatus(params).then(res => {
      //   console.log(res);
      //   this.isLoadiing = false;
      //   if (res.data.code == 0) {
      //     this.ywmData = res.data.status;
      //     this.visible.wymDialogVisible = true;
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
    },
    handleFilterSkuData(val) {
        let _skuVal = this.$refs['staticSkuTable'].getBackUpSkuTableValue();
        let skuVal = JSON.parse(JSON.stringify(_skuVal));
        //未完成数
        if (val === 1) {
          this.unDoneNum = Object.keys(skuVal).reduce((total, key) => {
            const { num, finishNum } = skuVal[key];
            if (finishNum < num) {
              skuVal[key].finishNum = num - finishNum;
            }
            else if(finishNum > num || finishNum === num) {
              skuVal[key].finishNum = 0;
            }
            total += Number(skuVal[key].finishNum);
            return total;
          }, 0);
        }
        //调整数
        else if(val === 2){
            Object.keys(skuVal).reduce((total, key) => {
                const { adjustNum } = skuVal[key];
                skuVal[key].finishNum = adjustNum;
            }, 0);
        }
        this.$refs['staticSkuTable'].setCurrentSkuVal(skuVal);
    },
   async reprot(type, from, facAndFinishId) {
      // 上报数量权限
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
      this.initReportVal(from, facAndFinishId);
      this.visible.addReportVisible = true;
    },
    initReportVal(from, facAndFinishId) {
      //总矩阵
      if(from === 'total'){
          //非整单外发时，每次弹窗前清空完成工厂
          if(!this.instanceWorkflow.components.information.facMissionOutsideFlag){
              this.reportFrom.outSideFactoryId = '';
          }
          // 完成人员取值逻辑：1.老板号登录，完成人员默认选节点负责人    2.员工号登录，完成人员默认选自己
          const chargers = this.instanceWorkflow.components.information.chargers;
          this.reportFrom['finishUserId'] = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
          this.isSubmatrixComponents = false
      }
      //子矩阵
      else if(from === 'part'){
          // 每次弹窗对完成工厂和完成人员赋值
          if(facAndFinishId.facId === ''){
              this.reportFrom.outSideFactoryId = 'ourFactory';  //本厂
          }else{
              this.reportFrom.outSideFactoryId = facAndFinishId.facId;
          }
          this.reportFrom.finishUserId = facAndFinishId.finishId;
          this.dialogOutsideFacId = facAndFinishId.facId;
          this.isSubmatrixComponents = true
      }
    },
    cuttingBed(actionType) {
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
        if (!this.checkAddReportSku()) {
          this.$message.error("上报数量不能全部为0！");
          return;
        }
        if(this.reportDialogTitle === '上报调整数'){
            if(!this.reportFrom.adjustCause){
                this.$message.error("调整原因不能为空");
                return;
            }
        }
        if(actionType === 'DRAFT'){
            this.visible.btnLoading1 = true;
        }else if(actionType === 'REPORT'){
            this.visible.btnLoading2 = true;
        }
        let sendToFacId = this.getSendToFactoryId();
        let params = {
            dateCompleted: this.reportFrom.endAt,
            chargerId: this.reportFrom.finishUserId,
            skus: this.getSkuParams(),
            instanceId: this.instanceWorkflow.components.status.id,
            userId: this.$store.state.userInfo.id,
            outsideFactoryId: this.reportFrom.outSideFactoryId === 'ourFactory' ? '' : this.reportFrom.outSideFactoryId,    //完成工厂
            sendToFactoryId:  sendToFacId,
            sendToUserId:  this.reportFrom.sendToUserId,  //发往工位
            actionType: actionType,
        };
        if(this.reportDialogTitle === '上报完成数'){
            params.type = 'COMPLETE_NUM'
        }else if(this.reportDialogTitle === '上报调整数'){
            params.type = 'ADJUST_NUM';
            params.adjustReason = this.reportFrom.adjustCause;    //调整原因
        }
        updateNumNode(params).then(res => {
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = false;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = false;
            }
            if (res.data.code == 0) {
                this.$message.success("上报成功");
                this.finishFlag = res.data.data;
                this.$emit("getFlagVal",this.finishFlag);
                this.visible.addReportVisible = false;
                // this.addReportSuccess();
            } else {
                this.$message.error(res.data.msg)
            }
        });
    },
    async handleAddReport(actionType) {
      const valid = await this.$refs['dialogForm'].valid();
      if (!valid) return;
      //扎号上报
      if (this.isLigationNode) {
        this.reportLigationNode();
        return;
      }
      this.cuttingBed(actionType);
    },
    checkAddReportSku() {
      const sku = this.getSkuParams();
      return !!sku.length;
    },
    getSkuParams() {
      const skuValObj = this.$refs['nfskutable'].getSkuTableValue();
      return Object.keys(skuValObj).reduce((arr, key) => {
        if (skuValObj[key].num) {
          const obj = {
            skuId: skuValObj[key].skuId,
            quantity: skuValObj[key].num
          };
          arr.push(obj);
        }
        return arr;
      }, []);
    },
    addReportSuccess() {
      this.visible.addReportVisible = false;
      this.$emit("on-report");
      //上报成功刷新工单详情，解决上报弹窗操作错位的bug
      this.refreshAll();
    },
    cancelAddReport() {
      this.visible.addReportVisible = false;
    },
    pickerReportEndAt(val) {
      this.reportFrom.endAt = val;
    }
  }
};
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
        }
    }
.no-report {
  color: #3b3b3b;
}
.yes-report {
  color: #23c811;
}
.gray-report {
  text-decoration: underline;
  color: #808080;
  cursor: pointer;
}
.outsideBtn{
  margin-left:5px;
  &:hover{
    color: #3b3b3b;
  }
}
.blue-report {
  text-decoration: underline;
  color: #1ca1ff;
  cursor: pointer;
}
.gray {
  color: #c4c6cc;
}
.green {
  color: #23c811;
}
.blue {
  color: skyblue;
}
.orange {
  color: orange;
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
            .bed-num {
                margin: 15px 0 0;
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
    .node-list-table{
        .mission-info__row-item{
            width: 40% !important;
        }
    }
</style>

