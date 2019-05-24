<template>
    <el-row class="node-list-table">
        <el-col :span="24" class="node-table-title">
            <el-col v-show="!skuRadio" :span="12" style="color: #555555;">
                <nf-button style="margin-right:24px;width:98px;" class="report-btn" type="success" @click="reprot()">上报数量</nf-button>
                <nf-button style="margin-right:24px;background:#939fb8;color:#fff;width:132px;" @click="$router.push(`/missionWym?instanceId=${instanceWorkflow.components.status.id}&missionId=${instanceWorkflow.mission.missionId}`)" class="report-btn">查看所有唯一码</nf-button>
                <span>实裁数：</span>
                 <span v-if="!componentData">
                     <span style="color:#1ca1ff;">{{componentData.completed}}</span>
                 / {{componentData.target}}</span>
                 <span v-if="componentData">
                     <span :style="{'color':componentData.completed>
                         componentData.amount?'#23c811':'#1ca1ff'}" style="color:#1ca1ff;">{{componentData.completed}}</span>
                 / {{componentData.amount}}</span>
            </el-col>
            <el-col v-show="skuRadio&&instanceWorkflow.components&&componentData.amount" :span="12" style="color: #555555;">
                未完成数: {{unDoneNum}} / {{componentData.target}}
            </el-col>
            <el-col :span="12" style="text-align: right;">
                <el-radio-group
                    @change="handleFilterSkuData"
                    v-model="skuRadio">
                    <el-radio :label="0">完成数</el-radio>
                    <el-radio :label="1">未完成数</el-radio>
                </el-radio-group>
                <!--<view-record-btn v-if="!componentData.associateWYM" :component-data="componentData" type="actual_cutting_wym"></view-record-btn>-->
            </el-col>
        </el-col>
        <el-col class="wym-count">
            已生成唯一码：{{componentData.wymCount}} 个
        </el-col>
        <!-- 表格 -->
        <el-col :span="24" class="node-list-content" v-if="instanceWorkflow.components.status.typeId!='totality'">
            <!-- <service-table
                v-if="tableData.colors && tableData.colors.length"
                :tableData="tableData"
                :skuVal="skuVal"
                :isChangeBg="false"></service-table> -->
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

        <el-dialog
        custom-class="nf-dialog-common"
        :visible.sync="visible.addReportVisible"
        :title="instanceWorkflow.components.status.nodeName + '上报数量'">
            <div class="dialog-body">
                <div class="form-inline">
                    <div class="form-item">
                        <span class="form-label">完成日期</span>
                        <div class="input-wrap">
                            <el-date-picker
                                    class="cutting-wym-date-picker"
                                    :disabled="date_disabled"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    v-model="reportFrom.endAt"
                                    @change="pickerReportEndAt"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-item">
                        <span class="form-label">完成人员</span>
                        <div class="input-wrap">
                            <el-select
                                class="cutting-wym-select"
                                :disabled="staff_disabled"
                                v-model="reportFrom.finishUserId"
                                placeholder="请选择完成人员">
                                <el-option
                                    v-for="(leaderItem, leaderIndex) in selectPersonList"
                                    :key="leaderIndex" :label="leaderItem.userName"
                                    :value="leaderItem.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="base-info">
                    <div class="img-info"><img :src="instanceWorkflow.mission.pictureURL" v-errorLogo></div>
                    <div style="display:flex;justify-content:space-between;width:100%;padding:0 32px;height:100%;">
                        <div class="second-info">
                        <div>
                            <span class="gray">货品款号</span>
                            <span>{{instanceWorkflow.mission.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">货品名称</span>
                            <span>{{instanceWorkflow.mission.goodsName}}</span>
                        </div>
                    </div>
                    <div class="third-info">
                        <div>
                            <span class="gray">工单号</span>
                            <span>{{instanceWorkflow.mission.missionNo}}</span>
                        </div>
                        <div>
                            <span class="gray">&emsp;客户</span>
                            <span>{{instanceWorkflow.mission.customerName}}</span>
                        </div>
                    </div>
                    </div>
                </div>
                <div v-if="componentData" class="bed-num">
                    <span style="display:inline-block;width:60px;">床次：</span>
                    <el-input v-model.trim="bedNum" @blur="handleBlur"></el-input>
                    <span style="display:inline-block;width:160px;margin-left:14px;">本次生成唯一码：{{wymNum}} 个</span>
                </div>
                <div class="form-textarea" v-if="instanceWorkflow.components.status.typeId!='totality'">
                    <!-- <service-table
                        ref="reportTable"
                        v-if="tableData.colors && tableData.colors.length"
                        :tableData="tableData"
                        :skuVal="reportSkuVal"
                        @setReportOnce="setReportOnce"
                        :isEdit="true"></service-table> -->
                    <nf-sku-table
                            v-if="updateReport"
                      ref="nfskutable"
                      editable
                      :metadatas="instanceWorkflow.metadatas"
                      :quantities="instanceWorkflow.quantities"
                      style="margin-top: 20px"
                      @change="handleSkuValChange"></nf-sku-table>
                </div>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="end" align="center">
                <div>
                  <nf-button @click="cancelAddReport">取 消</nf-button>
                  <nf-button :loading="visible.btnLoading1" type="warningsimple" @click="handleAddReport('DRAFT')">存为草稿</nf-button>
                  <nf-button :loading="visible.btnLoading2" type="warning" @click="handleAddReport('REPORT')">提 报</nf-button>
                </div>
            </el-row>
        </el-dialog>
        <div class="wym-dialog">
            <el-dialog :visible.sync="visible.wymDialogVisible" width="50%" :show-close="false">
                <span slot="title" class="dialog-header">本次生成唯一码：{{ywmData.numbers}} 个</span>
                <template>
                    <el-table :data="ywmData.WYMs" border max-height="420" style="overflow-x:hidden;width: 100%;margin-bottom:24px;">
                        <el-table-column  prop="lathe" label="床次" width="80">
                        </el-table-column>
                        <el-table-column  prop="sequence" label="本次序号"  width="100">
                        </el-table-column>
                        <el-table-column  prop="WYM" label="唯一码">
                        </el-table-column>
                        <el-table-column  prop="orderNo" label="工单号">
                        </el-table-column>
                        <el-table-column  prop="styleNo" label="货品款号">
                        </el-table-column>
                        <el-table-column  prop="colorNo" label="色号" width="140">
                        </el-table-column>
                        <el-table-column  prop="colorName" label="色名" width="140">
                        </el-table-column>
                        <el-table-column  prop="sizeName" label="尺码" width="80">
                        </el-table-column>
                        <el-table-column  prop="standardName" label="内长" width="80">
                        </el-table-column>
                    </el-table>
                </template>
                <span slot="footer" style="display:flex;justify-content:space-between;">
                    <div><nf-button @click="goOld" style="width:130px;margin-right:12px;">返回上一步</nf-button></div>
                    <div>
                        <nf-button  @click="sureSaveDownload" style="width:130px;margin-right:12px;background-color:#fff;color:#ffa914;">确定并下载</nf-button>
                        <nf-button style="width:130px;background-color:#ffa914;color:#fff;" @click="bedNode" type="warning">确定</nf-button>
                    </div>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="visible.repeatBedNum" width="50%" size="tiny" :show-close="false">
                <span slot="title" class="dialog-header">唯一码已存在！</span>
                <div style="font-size:14px;line-height:1.5;">
                    出现此情况的原因可能是有多个人同时上报相同床次。请你取消本次上报，和相关人员核实情况后再重新上报。
                </div>
                <span slot="footer" style="display:flex;justify-content:flex-end;">
                  <nf-button style="width:98px;background-color:#ffa914;color:#fff;" @click="repeatReport" type="warning">确定</nf-button>
                </span>
            </el-dialog>
        </div>
    </el-row>
</template>

<script>
import viewRecordBtn from "../../common/view-record-btn";
import { formatDate } from "@/utils";
import viewBillBtn from '@/components/order/common/view-bill-btn';
import {
  generateExcelWym,
  addReportDataDetail,
  getSkuBarcodeInfo,
  updateNumNode,
  updateBedNode,
  updateTotalNode,
  actualCuttingWym,
  previewWYM,
  billReportList,
    checkReportPermission,
} from "@/api";
export default {
  props: {
    instanceWorkflow: {},
    selectPersonList: []
  },
  data() {
    return {
        updateReport:true,
      skuRadio: 0,
      currentNodeName: "",
      reportFrom: {
        leaders: [],
        endAt: "",
        finishUserId: ""
      },
      bedNum: "",
      totalNum: 0,
      unDoneNum: 0,
      visible: {
        addReportVisible: false,
        wymDialogVisible: false,
        repeatBedNum: false,
        btnLoading1: false,
        btnLoading2: false
      },
      ywmData: {},
      fileData: "",
      firstWym: "",
      date_disabled:false,
      staff_disabled:false,
      wymNum: 0,
      untreatedNum:0,
      actionType: '',   //上报的类型 “存为草稿”或“提报”
    };
  },
  computed: {
    isBoss() {
      const info = sessionStorage.getItem("user_login");
      return JSON.parse(info).role === 1;
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    componentData() {
      return this.instanceWorkflow.components.actual_cutting_wym
    }
  },
  watch: {
    "visible.addReportVisible"(val) {
      if (val) {
        // 老板号去做上报操作的话，就默认选节点负责人，节点负责人再没有的话就为空
        this.initReportVal();
        const chargers = this.instanceWorkflow.components.information.chargers;
        if (this.isBoss && chargers.length) {
          this.reportFrom["finishUserId"] = chargers[0].id;
        } else if (!this.isBoss) {
          this.reportFrom["finishUserId"] = this.userId;
        }
        this.reportFrom.endAt = formatDate(new Date(), "yyyy-MM-dd");
        this.$refs["nfskutable"] &&
          this.$refs["nfskutable"].resetSkuTableData();
          this.updateReport = val
      }
    },
  },
  components: {
    viewRecordBtn,
    viewBillBtn,
  },
  created() {
      this.getBillTableData();
  },
  methods: {
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
    handleSkuValChange(val) {
      this.wymNum = Object.keys(val).reduce((total, key) => {
          total += Number(val[key].num);
          return total;
      }, 0);
    },
    repeatReport() {
      this.visible.repeatBedNum = false;
      this.visible.addReportVisible = true;
      this.visible.wymDialogVisible = false;
      this.bedNum = "";
    },
    goOld() {
      this.visible.addReportVisible = true;
      this.visible.wymDialogVisible = false;
    },
    downLoad() {
      let params = {
        missionNodeId: this.instanceWorkflow.components.status.id,
        lathes: [this.bedNum]
      };
      generateExcelWym(params).then(res => {
        console.log(res);
        this.fileData = res.data;
        var blob = new Blob([JSON.stringify(res.data)], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        let url = window.URL.createObjectURL(res.data);
        console.log(url);
        let a = window.document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "生成唯一码文件.xls");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    sureSaveDownload() {
      this.visible.addReportVisible = false;
      let params = {
        dateCompleted: this.reportFrom.endAt,
        chargerId: this.reportFrom.finishUserId,
        skus: this.getSkuParams(),
        instanceId: this.instanceWorkflow.components.status.id,
        lathe: this.bedNum,
        userId: this.$store.state.userInfo.id
      };
      actualCuttingWym(params).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.addReportVisible = false;
          this.downLoad();
          this.addReportSuccess();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleFilterSkuData(val) {
        let _skuVal = this.$refs['staticSkuTable'].getBackUpSkuTableValue();
        let skuVal = JSON.parse(JSON.stringify(_skuVal));
        if (val === 0) {
          // 完成数筛选
        }
        else {
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
          console.log(this.unDoneNum)
        }
        this.$refs['staticSkuTable'].setCurrentSkuVal(skuVal);
    },
    async reportBedNum(actionType) {
      let params = {
        skus: this.getSkuParams(),
        missionNodeId: this.instanceWorkflow.components.status.id,
        lathe: this.bedNum,
        actionType: actionType,
      };
      if(actionType === 'DRAFT'){
            this.visible.btnLoading1 = true;
      }else if(actionType === 'REPORT'){
            this.visible.btnLoading2 = true;
      }
      await previewWYM(params).then(res => {
        if(actionType === 'DRAFT'){
          this.visible.btnLoading1 = false;
        }else if(actionType === 'REPORT'){
          this.visible.btnLoading2 = false;
        }
        if (res.data.code == 0) {
          this.ywmData = res.data;
          this.firstWym = res.data.firstWYM;
          this.visible.addReportVisible = false;
          this.visible.wymDialogVisible = true;

        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    async reprot() {
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
        this.date_disabled = true
      }
       if (datalist.indexOf("fac.mission.node.finishBy.update") === -1) {
        this.staff_disabled = true
      }

      //上报数量
      this.bedNum = this.componentData.nextLathe;
      this.visible.addReportVisible = true;
    },
    bedNode() {
      this.visible.addReportVisible = false;
      let params = {
        dateCompleted: this.reportFrom.endAt,
        chargerId: this.reportFrom.finishUserId,
        skus: this.getSkuParams(),
        instanceId: this.instanceWorkflow.components.status.id,
        lathe: this.bedNum,
        userId: this.$store.state.userInfo.id,
        firstWYM: this.firstWYM,
        actionType: this.actionType,
      };
      actualCuttingWym(params).then(res => {
        if (res.data.code == 0) {
          this.addReportVisible = false;
          this.$message.success("上报成功");
          this.addReportSuccess();
        } else {
          this.visible.repeatBedNum = true;
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
      }
      if (this.bedNum == 0) {
        this.$message.error("床次不能为空");
        return;
      }
      if (this.reportFrom.endAt == "") {
        this.$message.error("完成日期不能为空");
        return;
      }
      this.actionType = actionType;
      this.reportBedNum(actionType);
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
      this.visible.wymDialogVisible = false;
      this.updateReport = false;
      this.$emit("on-report");
    },
    initReportVal() {
      this.reportFrom["endAt"] = "";
      this.reportFrom["finishUserId"] = "";
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
  }
};
</script>

<style lang="scss" scoped>
.wym-count {
  margin: 20px 0 0;
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
  .cutting-wym-date-picker,.cutting-wym-select{
      border: 1px solid rgb(191, 200, 217);
  }
}

.form-btn {
  margin-top: 32px;
  text-align: right;
}
.bed-num {
  width: 100%;
  margin: 24px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .el-input {
    width: 250px;
  }
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
.bed-num .el-input__inner {
  width: 250px;
}
.dialog-header {
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-bottom: 1px solid #e6eaf0;
  padding-bottom: 16px;
}
.node-list-table .el-dialog--small {
  width: 60%;
}
</style>

