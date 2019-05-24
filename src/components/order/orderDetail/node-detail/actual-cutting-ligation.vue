<template>
    <el-row class="node-list-table">
        <el-col :span="24" class="node-table-title">
            <el-col v-show="!skuRadio" :span="12" style="color: #555555;">
                <nf-button style="margin-right:24px;" class="report-btn" type="success" @click="reprot()">上报扎号</nf-button>
                <span>实裁数：</span>
                <span>
                    <i style="color:#1ca1ff;">{{componentDetail.completed}}</i>
                    <i>/ {{ !componentDetail.actualCutting ? componentDetail.target : componentDetail.amount }}</i>
                </span>
            </el-col>
            <el-col v-show="skuRadio && componentDetail.amount" :span="12" style="color: #555555;">
                未完成数: {{unDoneNum}} / {{componentDetail.target}}
            </el-col>
            <el-col :span="12" style="text-align: right;">
                <el-radio-group
                    @change="handleFilterSkuData"
                    v-model="skuRadio">
                    <el-radio :label="0">完成数</el-radio>
                    <el-radio :label="1">未完成数</el-radio>
                </el-radio-group>
                <!--<view-record-btn :componentData="componentDetail" type="actual_cutting_ligation"></view-record-btn>-->
            </el-col>
        </el-col>
        <!-- 表格 -->
        <el-col :span="24" class="node-list-content">
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

        <el-col :span="24" class="node-list-content">
          <div class="stick">
            <button class="stick__btn" type="button" @click="viewList">扎号列表</button>
            <span>已生成扎号：{{ componentDetail.ligationCount }} 扎 / {{ componentDetail.completed }} 件</span>
              <nf-button class="btn btn--print fr" type="warning" @click="chipConfigVisibleShow">裁片组配置</nf-button>

          </div>
        </el-col>
        <!-- <nf-dialog
        :visible.sync="visible.addReportVisible"
        :title="instanceWorkflow.components.status.nodeName + '上报数量'"
        :onCancel="cancelAddReport"
        :onSuccess="handleAddReport"
        :is-loadiing="visible.btnLoading">
            <div class="dialog-body">
                <div class="form-inline">
                    <div class="form-item">
                        <span class="form-label">完成日期</span>
                        <div class="input-wrap">
                            <el-date-picker
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
                <div class="form-textarea">
                    <nf-sku-table
                      ref="nfskutable"
                      editable
                      :metadatas="instanceWorkflow.metadatas"
                      :quantities="instanceWorkflow.quantities"
                      style="margin-top: 20px"></nf-sku-table>
                </div>
            </div>
        </nf-dialog> -->
        <chipConfig :chipConfigData="chipConfigData" :chipConfigVisible.sync="chipConfigVisible" :instanceId="instanceId"></chipConfig>

    </el-row>
</template>

<script>
    import chipConfig from '../../common/chipConfig.vue';
    import viewRecordBtn from "../../common/view-record-btn";
import viewBillBtn from '@/components/order/common/view-bill-btn';
import { formatDate } from "@/utils";
import {cbsgcGetList,checkReportPermission} from '@/api'
import { mapState } from "vuex";
import {
    billReportList,
} from "@/api";
export default {
  props: {
    instanceWorkflow: {},
    selectPersonList: []
  },
  data() {
    return {
        chipConfigData:[],
        chipConfigVisible:false,
      skuRadio: 0,
      unDoneNum: 0,
      currentNodeName: "",
      reportFrom: {
        leaders: [],
        endAt: "",
        finishUserId: ""
      },
      bedNum: "",
      totalNum: 0,
      visible: {
        addReportVisible: false,
        btnLoading: false
      },
      staff_disabled:false,
        date_disabled :false,
        untreatedNum: 0,
    };
  },
  computed: {
      instanceId() {
          return this.$route.query['instanceWorkflowId'];
      },
    isBoss() {
      const info = sessionStorage.getItem("user_login");
      return JSON.parse(info).role === 1;
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    componentDetail() {
      return this.instanceWorkflow.components.actual_cutting_ligation;
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
        this.$refs["nfskutable"] && this.$refs["nfskutable"].resetSkuTableData();
      }
    }
  },
  components: {
    viewRecordBtn,
    viewBillBtn,
      chipConfig,
  },
  created() {
      this.getBillTableData();
  },
  methods: {
      // 获取裁片组列表
      cbsgcGetList(){
          cbsgcGetList({facMissionPrcdNodeId:this.instanceId}).then(res=>{
              if(res.data.code===0){
                  console.log(res);
                  this.chipConfigData = res.data.data

              }else {
                  this.$message.error(res.data.msg)
              }
          })
      },
      chipConfigVisibleShow(){
          this.chipConfigVisible=true;
          this.cbsgcGetList();
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
        this.date_disabled = true;
      }
      if (datalist.indexOf("fac.mission.node.finishBy.update") === -1) {
        this.staff_disabled = true;
      }
      this.$router.push({
        path: '/cutting/report',
        query: {
          ...this.$route.query
        }
      });
      //上报数量
      // this.bedNum = this.componentDetail.nextLathe;
      // this.visible.addReportVisible = true;
    },
    viewList() {
      const { missionId, instanceWorkflowId } = this.$route.query;
      this.$router.push({
        path: '/ligation/list',
        query: {
          missionId,
          instanceWorkflowId
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.node-list-content {
  padding-bottom: 20px;
  box-sizing: border-box;
  .stick {
    padding-top: 20px;
    .stick__btn {
      width:98px;
      height:36px;
      margin-right: 20px;
      font-size: 14px;
      color: rgba(28,161,255,1);
      border-radius:2px;
      border:1px solid rgba(28,161,255,1);
      &:hover {
        opacity: .7;
      }
    }
  }
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
.bed-num {
  width: 300px;
  margin: 24px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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
</style>

