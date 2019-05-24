<template>
  <div class="sampling-node">
    <div class="mgb8">
        <nf-button style="margin-right:24px;" class="report-btn" type="success" @click="reprot()">抽检型上报</nf-button>
        <div class="lh35 mgr33 dis-block">外发厂编号-名称：{{select_check_quantity.header.fabricatingPlantCode?(select_check_quantity.header.fabricatingPlantCode + '-' + select_check_quantity.header.fabricatingPlantName) : '未填写'}}</div>
        <div class="lh35 dis-block">总合格率：<span style="color:#6edb58">{{totalPop}}</span></div>
    </div>
    <!-- 表格 -->
    <div class="mgb8">
      <el-table
              :row-class-name="handleRowClass"
              :data="select_check_quantity.skuInfos"
        border
        style="width: 100%">
        <el-table-column prop="colorName" label="颜色"></el-table-column>
        <el-table-column prop="sizeName" label="尺码"></el-table-column>
        <!--内长全部为无时不显示-->
        <el-table-column v-if="select_check_quantity.skuInfos.some(v => v.standardId !== '36fec3286377458bb445d0a287cd8e0e')" prop="standardName" label="内长"></el-table-column>
        <el-table-column prop="deliveryQuantity" label="总交货数量"></el-table-column>
        <el-table-column prop="selectCheckQuantity" label="总抽检数"></el-table-column>
        <el-table-column prop="qualified" label="总合格数"></el-table-column>
        <el-table-column prop="defectived" label="总次品数"></el-table-column>
        <el-table-column prop="wasted" label="总废品数"></el-table-column>
        <el-table-column prop="pop" label="总合格率">
          <template slot-scope="scope">
            <div>{{scope.row.pop * 100}}%</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 上报记录 -->
    <div>
      <div class="report">上报记录</div>
      <div v-if="reports.length == 0">无</div>
      <div v-else>
        <record-wrap
          v-for="item in reports"
          :key="item.logId"
          :logItem="item"
          :showArrow="false"
          :showRevocation="true"
          @on-cancel="handleDeleteReport">
        </record-wrap>
      </div>

    </div>
    <!-- 抽检上报弹窗 -->
    <el-dialog :modal-append-to-body="false" class="custom-dialog set-submit-person-dialog" title="抽检上报数量" :visible.sync="isVisible" style="min-width:800px;">
      <dialog-form
              ref="dialogForm"
              :formModel="form"
              :selectUserOptions="selectPersonList"
              :isWYMOrLigation="false"
              :information="instanceWorkflow.components.information">
      </dialog-form>
      <mission-info class="dialog__mission-info" :mission-info="mission"></mission-info>

      <el-row class="mgt8 mgb8">
        <div class="dis-block">外发厂编号-名称：{{select_check_quantity.header.fabricatingPlantCode?(select_check_quantity.header.fabricatingPlantCode + '-' + select_check_quantity.header.fabricatingPlantName) : '未填写'}}</div>
      </el-row>
      <div class="mgb8">
        <el-table
                :row-class-name="handleRowClass"
                :data="form.tableData"
                border
                style="width: 100%">
          <el-table-column
                  prop="colorName"
                  align="center"
                  label="颜色" class-name="column-name">
            <template slot-scope="scope">
              <span>{{scope.row.colorName}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="sizeName"
                  align="center"
                  label="尺码" class-name="column-name">
            <template slot-scope="scope">
              <span>{{scope.row.sizeName}}</span>
            </template>
          </el-table-column>
          <!--内长全部为无时不显示-->
          <el-table-column
                  v-if="select_check_quantity.skuInfos.some(v => v.standardId !== '36fec3286377458bb445d0a287cd8e0e')"
                  prop="standardName"
                  align="center"
                  label="内长" class-name="column-name">
            <template slot-scope="scope">
              <span>{{scope.row.standardName}}</span>
            </template>
          </el-table-column>
          <el-table-column
                  prop="deliveryQuantity"
                  align="center"
                  label="交货数量" class-name="column-name edit-bg" width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deliveryQuantity" :min="0" type="number" @change="changNum" :placeholder="scope.row.waitDeliveryQuantity > 0 ? `未报数${scope.row.waitDeliveryQuantity}` : `未报数0`"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  prop="selectCheckQuantity"
                  align="center"
                  label="抽检数" class-name="column-name edit-bg">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.selectCheckQuantity" :min="0" @change="changNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  prop="qualified"
                  align="center"
                  label="合格数" class-name="column-name edit-bg">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.qualified" :min="0" @change="changNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  prop="defectived"
                  align="center"
                  label="次品数" class-name="column-name edit-bg">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.defectived" :min="0" @change="changNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  prop="wasted"
                  align="center"
                  label="废品数" class-name="column-name edit-bg">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.wasted" :min="0" @change="changNum"></el-input>
            </template>
          </el-table-column>
          <el-table-column
                  class-name="column-name"
                  prop="address"
                  align="center"
                  label="合格率"
                  width="100">
            <template slot-scope="scope">
              <span>{{handlePop(scope.row)}}</span>
            </template>
          </el-table-column>
        </el-table>
    </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button :loading="isSubmitting"  type="primary" @click="confirm(false)">确定</el-button>
      </div>
    </el-dialog>

    <!-- 延误订单设置成完成时的弹窗操作 -->
    <el-dialog :modal-append-to-body="false" class="custom-dialog back-node-dialog" title="延误原因"
               :visible.sync="finishDialog" size="tiny">
      <p class="text-left pdb15">该节点处于已延误状态，本次操作将完成此节点，请填写延误原因</p>
      <el-form
              :model="backNode" ref="backNode">
        <!-- label="回退原因"  -->
        <el-form-item
                prop="message"
                :rules="[{ required: true, message: '请输入节点延误原因'}]"
                required>
          <el-input
                  type="textarea"
                  :rows="4"
                  :maxlength="50"
                  resize="none"
                  placeholder="请输入内容"
                  v-model.trim="backNode.message">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="finishDialog = false" >取 消</el-button>
        <el-button :loading="isSubmitting"  type="primary" @click="confirmBackNode">确定</el-button>
      </div>
    </el-dialog>
    <!-- <sampling-node-report :isVisible="isVisible" :form="form" @cancel="cancel"></sampling-node-report> -->
  </div>
</template>

<script>

import RecordWrap from '../../reportRecord/record-wrap'
import {getUnitUser, getReportRecord, commonNodeReport,deleteReport,checkReportPermission,nodeInfoEdit,nodeInfoReason} from '@/api'
import CommonMixin from './common-mixin';
    const fun  = require('@/components/Common/commonFun.js')
export default {
  mixins: [CommonMixin],
  props: ['instanceWorkflow'],
  data () {
    return {
        finishDialog: false,
        isVisible: false,
        isSubmitting: false,
        reports:[],
        options: {
          groupOptions: [], // 完成人员的下拉列表
        },
        form: {},
        // 设置延误原因
        backNode:{
            message:'',
            valFlag:false
        },
    }
  },
  components: {RecordWrap},
  computed: {
      //总合格率
      totalPop() {
          let qualified = 0, selectCheckQuantity = 0;
          this.instanceWorkflow.components.select_check_quantity.skuInfos.forEach(v => {
              qualified = (qualified + v.qualified).toFixed(2) * 1
              selectCheckQuantity = (selectCheckQuantity + v.selectCheckQuantity).toFixed(2) * 1
          })
        return (selectCheckQuantity&&qualified) ? (qualified / selectCheckQuantity * 100).toFixed(2) + '%' : '0%'
      },
    // 抽检数据
    select_check_quantity() {
      return this.instanceWorkflow.components.select_check_quantity
    },
    mission() {
      return this.instanceWorkflow.mission
    },
    userId() {
      return (
        this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId
      );
    },
  },
  methods:{
      // 延误操作结点提交原因--点击事件
      confirmBackNode(){
          let params = {
              editType: "status",
              status: 2,
              id: this.instanceWorkflow.components.status.id,
              userId: this.userId
          };
          let params_reason = {
              reasonDelay: this.backNode.message,
              nodeId: this.instanceWorkflow.components.status.id,
          };
          this.isSubmitting=true;
          this.$refs['backNode'].validate((valid) => {
              if (valid) {
                  nodeInfoEdit(params).then(res => {
                      if (res.data.code == 0) {
                          nodeInfoReason(params_reason).then(res => {
                              if (res.data.code == 0) {
                                  this.finishDialog = false;
                                  this.isSubmitting = false;
                                  this.$message({
                                      message: '节点延误原因保存成功',
                                      type: 'success'
                                  });
                                 this.confirm(true)
                              }
                              else{
                                  this.$message({
                                      message: '节点延误原因保存失败',
                                      type: 'error'
                                  });
                              }
                          });
                      }
                  });
              } else {
                  this.$message({
                      message: '请填写节点延误原因',
                      type: 'warning'
                  });
                  this.isSubmitting = false;
                  return false;
              }
          });
      },
      handleRowClass(r,i) {
          if(i>0) {
              if(r.colorId === this.select_check_quantity.skuInfos[i-1].colorId) {
                  this.$set(r,'bg',this.select_check_quantity.skuInfos[i-1].bg)
                  return this.select_check_quantity.skuInfos[i-1].bg?'divide-bg':''
              }else {
                  this.$set(r,'bg',!this.select_check_quantity.skuInfos[i-1].bg)
                  return this.select_check_quantity.skuInfos[i-1].bg?'':'divide-bg'
              }
          }else {
              this.$set(r,'bg',false)
              return ''
          }
      },
      handlePop(row) {
            if(row.qualified && row.selectCheckQuantity) {
              let sum = row.qualified*1 / row.selectCheckQuantity*1
              sum = (sum* 100).toFixed(2)
              return `${sum}%`
            } else {
              return `0%`
            }
      },
    // 上报弹窗取消
    cancel(val) {
      this.fetchRecord()
      this.isVisible = false
    },
    // 上报弹窗
   async reprot() {
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
      this.form = {
        endAt: new Date(), // 完成时间
        finishUserId: '', // 完成人员
        tableData: this.instanceWorkflow.components.select_check_quantity.skuInfos.map(v => {
            return {...v,
                deliveryQuantity: '',
                selectCheckQuantity: 0,
                qualified: 0,
                defectived:0,
                wasted: 0
            }
        })
      }
      this.isVisible = true
    },
    // 撤销
    handleDeleteReport(logItem) {
      this.$confirm('是否撤销该条上报记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteReport({ logId: logItem.logId, userId: this.userId })
          .then(res => {
            if (res.data.code === 0) {
                this.$emit('on-report')
                this.$message.success('撤销成功!');
                return;
            }
            if (res.data.code === 1){
                this.$message.error(res.data.msg);
                return
            }
            this.$message.error('该次上报的扎号在其他节点已上报');
          });
      })
    },
    // 获取负责人列表
    fetchUnitUser(keyword = '') {
        getUnitUser({
            keyword,
            unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
        }).then(res => {
            if (!res.data.data.facGroupDTOS) {
                return;
            }
            this.options.groupOptions = res.data.data.facGroupDTOS;
        });
    },
    // 质检上报
    confirm(flag=false) {
      let skuInfos = this.form.tableData.map(v => {
          return {...v,deliveryQuantity:v.deliveryQuantity||0}
      })
      const reg = /^[+]{0,1}(\d+)$/;  //正整数(可为0)
        if (!this.form.endAt) return this.$message.error('完成时间不能为空')
        if (!this.form.finishUserId) return this.$message.error('完成人不能为空')
        if(skuInfos.some(v => !reg.test(v.deliveryQuantity)) || this.form.tableData.every(v => v.deliveryQuantity === ''))return this.$message.error('交货数量不能为空且为正整数')
        if(skuInfos.some(v => !reg.test(v.selectCheckQuantity)))return this.$message.error('抽检数不能为空且为正整数')
        if(skuInfos.some(v => !reg.test(v.qualified)))return this.$message.error('合格数不能为空且为正整数')
        if(skuInfos.some(v => !reg.test(v.defectived)))return this.$message.error('次品数不能为空且为正整数')
        if(skuInfos.some(v => !reg.test(v.wasted)))return this.$message.error('废品数不能为空且为正整数')

        const isDone = skuInfos.every(v => v.deliveryQuantity >= v.waitDeliveryQuantity)

        if(isDone && !flag && this.instanceWorkflow.components.notify.notifies.length && this.instanceWorkflow.components.notify.notifies[0].type==1){
            this.backNode.message = '';
            this.finishDialog = true;
            return;
        }
        let params = {
            skuInfos,
            userId: this.userId,
            dateCompleted: this.form.endAt? fun.dateFormatter(this.form.endAt,false) : '',
            chargerId: this.form.finishUserId,
            missionNodeId: this.$route.query.instanceWorkflowId,
            instanceId: this.$route.query.instanceWorkflowId,
            typeCode: 'select_check_quantity'
        }
        this.isSubmitting = true
      commonNodeReport(params).then(res => {
        if(res.data.code == 0) {
          this.$message.success('上报成功！')
          this.isVisible = false
          this.$emit('on-report')
        } else {
          this.$message.error(res.data.msg)
        }

        this.isSubmitting = false
      })
    },
    // 只能输入正整数
    changNum (val) {
      let reg = /^[0-9]+$/
      if (!reg.test(val*1)) return this.$message.error('请输入正整数')
    },
    // 获取抽检型上报数据
    fetchRecord() {
      let params = {
        instanceId: this.$route.query.instanceWorkflowId,
        type: 'select_check_quantity'
      }
      getReportRecord(params).then(res => {
        this.reports = res.data.reports
      })
    }
  },
  created () {
    this.fetchRecord()
  }
}
</script>
<style lang="scss" scoped>
  .lh35{
    line-height: 35px;
  }
  .dis-block{
    display:inline-block;
  }
  .mgr33{
    margin-right:33px;
  }
  .report{
    padding:16px 0 9px 0;
    font-size:16px;
  }
  .border-line{
    height: 16px;
    background-color: #DFE6EC;
    width: 1px;
    margin:0 16px;
    vertical-align: middle;
    margin-top:-1px;
  }
</style>
<style lang="scss">
.sampling-node{
  .el-table__row.divide-bg{
    background: #fafafa;
  }
  .column-name{
    .cell {
      padding:0 !important;
      /*height: 36px;*/
    }
    &.edit-bg{
      /*background-color: #FFF9ED;*/
      .el-input__inner{
        background-color: #FFF9ED;
        border:none;
      }
    }
  }
}
</style>



