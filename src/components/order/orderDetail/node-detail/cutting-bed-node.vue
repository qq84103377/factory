<template>
    <el-row class="node-list-table">
        <el-col :span="24" class="node-table-title">
            <el-col :span="12" style="color: #555555;">
                <nf-button
                        style="margin-right:10px;"
                        class="report-btn"
                        type="success"
                        @click="reprot('finishNum', 'total')">上报完成数</nf-button>
                <nf-button
                        v-if="componentData.header.allowBillAdjustNum"
                        style="margin-right:10px;"
                        class="report-btn"
                        type="warning"
                        @click="reprot('changeNum', 'total')">上报调整数</nf-button>
                <!--完成数-->
                <template v-if="skuRadio === 0">
                    <span>完成数：</span>
                    <span v-if="!componentData">
                     <span style="color:#1ca1ff;">{{componentData.completed}}</span>
                 / {{componentData.target}}</span>
                    <span v-if="componentData">
                     <span :style="{'color':componentData.completed>
                         componentData.amount?'#23c811':'#1ca1ff'}" style="color:#1ca1ff;">{{componentData.completed}}</span>
                 / {{componentData.target}}</span>
                </template>
                <!--未完成数-->
                <template v-if="skuRadio === 1&&instanceWorkflow.components&&componentData.amount">
                    <span>未完成数：</span>
                    <span>{{unDoneNum}} / {{componentData.target}}</span>
                </template>
                <!--调整数-->
                <span class="adjust-num" v-if="componentData.header.allowBillAdjustNum && componentData.adjustNum">（调{{componentData.adjustNum}}）</span>
            </el-col>
            <el-col :span="12" style="text-align: right;">
                <el-radio-group
                    @change="handleFilterSkuData"
                    v-model="skuRadio">
                    <el-radio :label="0">完成数</el-radio>
                    <el-radio :label="1">未完成数</el-radio>
                    <el-radio :label="2" v-if="componentData.header.allowBillAdjustNum">调整数</el-radio>
                </el-radio-group>
                <!--<view-record-btn type="actual_cutting" :component-data="componentData"></view-record-btn>-->
            </el-col>
        </el-col>
        <!-- 表格 -->
        <el-col :span="24" class="node-list-content" v-if="instanceWorkflow.components.status.typeId!='totality'">
            <nf-sku-table
              ref="staticSkuTable"
              :metadatas="instanceWorkflow.metadatas"
              :quantities="instanceWorkflow.quantities"
              style="margin-top: 20px"></nf-sku-table>
        </el-col>
        <!--查看全部上报单据-->
        <el-col :span="24">
            <view-bill-btn
                    type="actual_cutting"
                    :num="untreatedNum"
                    :missionId="instanceWorkflow.mission.missionId"
                    :missionPrcdNodeId="instanceWorkflow.components.information.header.missionNodeId">
            </view-bill-btn>
        </el-col>
        <!--单据表格-->
        <bill-table
                v-if="tableData.length"
                type="actual_cutting"
                :tableData="tableData"
                @commit="billReport">
        </bill-table>

        <!--子矩阵-->
        <submatrixComponents
                v-if="showOutSideFacAndPrice"
                @reprot="reprot"
                :key="instanceWorkflow.components.information.header.missionNodeId"
                :missionNodeId="instanceWorkflow.components.information.header.missionNodeId"
                :allowBillAdjustNum="componentData.header.allowBillAdjustNum"
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
                        :isWYMOrLigation="false"
                        :information="instanceWorkflow.components.information">
                </dialog-form>
                <mission-info
                        class="dialog__mission-info"
                        :mission-info="instanceWorkflow.mission">
                </mission-info>
                <div v-if="componentData" class="bed-num">
                    <span class="text">床次</span>
                    <el-input v-model.trim="bedNum" @blur="handleBlur" class="bed-input"></el-input>
                </div>
                <div class="form-textarea" v-if="instanceWorkflow.components.status.typeId!='totality'">
                    <nf-sku-table
                        ref="nfskutable"
                        editable
                        @change="handleSkuValueChange"
                        :metadatas="instanceWorkflow.metadatas"
                        :quantities="instanceWorkflow.quantities"
                        style="margin-top: 20px">
                    </nf-sku-table>
                </div>
                <div class="adjust-cause" v-if="reportDialogTitle === '上报调整数'">
                    <span class="adjust-text">调整原因：</span>
                    <el-input class="adjust-textarea" type="textarea" maxlength="100" v-model="reportFrom.adjustCause"></el-input>
                </div>
                <outsideFacAndStation
                        v-if="reportDialogTitle === '上报完成数' && reportSendSelectUser"
                        :formModel="reportFrom"
                        :information="instanceWorkflow.components.information">
                </outsideFacAndStation>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="space-between" align="center">
                <div class="count-total">
                    数量合计：<strong>{{totalNums}}</strong>
                </div>
                <div>
                    <nf-button @click="cancelAddReport">取 消</nf-button>
                    <nf-button :loading="visible.btnLoading1" type="warningsimple" @click="handleAddReport('DRAFT')">存草稿</nf-button>
                    <nf-button :loading="visible.btnLoading2" type="warning" @click="handleAddReport('REPORT')">提 报</nf-button>
                </div>
            </el-row>
        </el-dialog>
    </el-row>
</template>

<script>
import viewRecordBtn from "../../common/view-record-btn";
import { formatDate } from "@/utils";
import {
  addReportDataDetail,
  getSkuBarcodeInfo,
  updateNumNode,
  updateBedNode,
  updateTotalNode,
  billReportList,
    checkReportPermission,
} from "@/api";
import viewBillBtn from '@/components/order/common/view-bill-btn';
import MissionInfo from '@/components/order/common/mission-info';
import DialogForm from '@/components/order/common/dialog-form';
import outsideFacAndStation from '@/components/order/common/outsideFacAndStation';
import billTable from '@/components/order/allReportBill/billTable.vue';
import submatrixComponents from './submatrixComponents'
import { mapState } from "vuex";
export default {
  props: {
    instanceWorkflow: {},
    selectPersonList: []
  },
  data() {
    return {
      skuRadio: 0,
      unDoneNum: 0,
      currentNodeName: "",
      reportFrom: {
        leaders: [],
        endAt: "",
        finishUserId: "",
        adjustCause: "",    //调整原因
        outSideFactoryId: "",
        sendToFactoryId: "ourFactory",
        sendToUserId: "",
      },
      bedNum: "",
      totalNum: 0,
      visible: {
        addReportVisible: false,
        btnLoading1: false,
        btnLoading2: false,
      },
      staff_disabled:false,
      date_disabled :false,
      totalNums:'',
        reportDialogTitle:'',     //上报弹窗标题
        tableData: [],
        dialogOutsideFacId: '',     //上报弹窗要显示的默认完成工厂
        untreatedNum: 0,
        isSubmatrixComponents: false,   //是否子矩阵上报
    };
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
    isBoss() {
      const info = sessionStorage.getItem("user_login");
      return JSON.parse(info).role === 1;
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    componentData() {
      return this.instanceWorkflow.components.actual_cutting;
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
  watch: {
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
    "visible.addReportVisible"(val) {
      if (val) {
        // 老板号去做上报操作的话，就默认选节点负责人，节点负责人再没有的话就为空
        // this.initReportVal();
        // const chargers = this.instanceWorkflow.components.information.chargers;
        // if (this.isBoss && chargers.length) {
        //   this.reportFrom["finishUserId"] = chargers[0].id;
        // } else if (!this.isBoss) {
        //   this.reportFrom["finishUserId"] = this.userId;
        // }
        this.reportFrom.endAt = formatDate(new Date(), "yyyy-MM-dd");
        this.$refs["nfskutable"] && this.$refs["nfskutable"].resetSkuTableData();
      }
    }
  },
  components: {
    viewRecordBtn,
    viewBillBtn,
    MissionInfo,
    DialogForm,
    outsideFacAndStation,
    billTable,
      submatrixComponents,
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
    handleSkuValueChange(val, total) {
      this.totalNums = total;
      console.log(total);
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
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;

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
      if (datalist.indexOf("fac.mission.node.finishDate.update") === -1) {
        this.date_disabled = true;
      }
      if (datalist.indexOf("fac.mission.node.finishBy.update") === -1) {
        this.staff_disabled = true;
      }
      //上报数量
      this.bedNum = this.componentData.nextLathe;
      if(type === 'finishNum'){
          this.reportDialogTitle = '上报完成数';
      }else if(type === 'changeNum'){
          this.reportDialogTitle = '上报调整数';
      }
      this.initReportVal(from, facAndFinishId);
      this.visible.addReportVisible = true;
    },
    bedNode(actionType) {
      if (this.bedNum == 0) {
        this.$message.error("床次不能为空");
        return;
      }
      if (this.reportFrom.endAt == "") {
        this.$message.error("完成日期不能为空");
        return;
      }
      //节点配置了“外发”
      if(this.showOutSideFacAndPrice){
        if (!this.reportFrom.outSideFactoryId) {
            this.$message.error("完成工厂不能为空");
            return;
        }
      }
      if(this.reportDialogTitle === '上报调整数'){
        if(!this.reportFrom.adjustCause){
            this.$message.error("调整原因不能为空");
            return;
        }
      }
      let sendToFacId = this.getSendToFactoryId();
        let params = {
        dateCompleted: this.reportFrom.endAt,
        chargerId: this.reportFrom.finishUserId,
        skus: this.getSkuParams(),
        instanceId: this.instanceWorkflow.components.status.id,
        lathe: this.bedNum,
        userId: this.$store.state.userInfo.id,
        outsideFactoryId: this.reportFrom.outSideFactoryId === 'ourFactory' ? '' : this.reportFrom.outSideFactoryId,    //完成工厂
        sendToFactoryId:  sendToFacId,
        sendToUserId:  this.reportFrom.sendToUserId,  //发往工位
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
        updateBedNode(params).then(res => {
            if(actionType === 'DRAFT'){
                this.visible.btnLoading1 = false;
            }else if(actionType === 'REPORT'){
                this.visible.btnLoading2 = false;
            }
            if (res.data.code == 0) {
                this.addReportVisible = false;
                this.$message.success("上报成功");
                this.addReportSuccess();
            } else {
                this.$message.error(res.data.msg);
            }
        });
    },
    handleAddReport(actionType) {
      if (!this.reportFrom.finishUserId) {
        this.$message.error("请选择完成人员！");
        return;
      }
      if (this.componentData) {
        if (!this.checkAddReportSku()) {
          this.$message.error("上报数量不能全部为0！");
          return;
        }
        this.bedNode(actionType);
      }
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
    cancelAddReport() {
      this.visible.addReportVisible = false;
    },
    pickerReportEndAt(val) {
      this.reportFrom.endAt = val;
    },
    handleBlur() {
        const reg = /\W+/gi;
        if (reg.test(this.bedNum)) {
            this.bedNum = this.componentData.nextLathe;
            return this.$message.error('只能输入字母和数字');
        }
    }
  },
  created(){
      this.getBillTableData();
  },
};
</script>

<style lang="scss" scoped>
    .node-list-table{
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
        .submatrix{
            .submatrix-bg{
                background-color: #fafcff;
                overflow: hidden;
            }
        }
    }
    .dialog-footer > .count-total {
        strong {
            color: #FF7F14;
            font-weight: 500;
            font-size: 20px;
            vertical-align: -2px
        }
    }
.node-list-content {
  padding-bottom: 20px;
  box-sizing: border-box;
}
.dialog-title {
  padding-bottom: 24px;
  text-align: center;
  font-size: 18px;
  color: #626b7a;
  border-bottom: 1px solid #e6e8eb;
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
.form-inline {
  display: flex;
  justify-content: space-between;
  .form-item {
    display: inline-block;
  }
  .input-wrap {
    display: inline-block;
    width: 194px;
  }
}

.form-btn {
  margin-top: 32px;
  text-align: right;
}
.base-info {
  height: 72px;
  border: 1px solid #e6eaf0;
  margin: 14px 0;
  box-sizing: border-box;
  padding: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .img-info {
    width: 60px;
    height: 48px;
    border: 1px solid #ccc;
    margin-right: 24px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .second-info {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-direction: column;
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
.form-inline .el-date-editor.el-input {
  width: 128px;
}
.form-inline .el-input__inner {
  border: none;
}
.form-inline .input-wrap {
  width: 140px;
}
.totalNum .el-input__inner {
  height: 72px;
  font-size: 40px;
  text-align: center;
  border: 1px solid #dce0e6;
}
</style>

