<template>
  <div class="sampling-node">
    <div class="mgb8">
        <nf-button style="margin-right:24px;" class="report-btn" type="success" @click="reprot()">抽检型上报</nf-button>
        <div class="lh35 mgr33 dis-block">外发厂：{{select_check.header.fabricatingPlantName?select_check.header.fabricatingPlantName : '未填写'}}</div>
        <div class="lh35 dis-block mgr33">外发厂编号：{{select_check.header.fabricatingPlantCode?select_check.header.fabricatingPlantCode : '未填写'}}</div>
        <div class="lh35 dis-block">总合格率：<span style="color:#6edb58">{{select_check.pop}}</span></div>
    </div>
    <!-- 表格 -->
    <div class="mgb8">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="deliveryQuantity" label="总计已生产数量"></el-table-column>
        <el-table-column prop="selectCheckQuantity" label="总抽检数"></el-table-column>
        <el-table-column prop="qualified" label="总合格数"></el-table-column>
        <el-table-column prop="defectived" label="总次品数"></el-table-column>
        <el-table-column prop="wasted" label="总废品数"></el-table-column>
        <el-table-column prop="pop" label="总合格率"></el-table-column>
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
        <div class="dis-block">外发厂：{{select_check.header.fabricatingPlantName?select_check.header.fabricatingPlantName : '未填写'}}</div>
        <div class="dis-block border-line"></div>
        <div class="dis-block">外发厂编号：{{select_check.header.fabricatingPlantCode?select_check.header.fabricatingPlantCode : '未填写'}}</div>
      </el-row>
      <div class="mgb8">
      <el-table
        :data="form.tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="deliveryQuantity"
          align="center"
          label="已生产数量" class-name="column-name edit-bg">
          <template slot-scope="scope">
            <el-input v-model="scope.row.deliveryQuantity" :min="0" type="number" @change="changNum" :placeholder="form.waitDeliveryQuantity > 0 ? `未报数${form.waitDeliveryQuantity}` : `未报数0`"></el-input>
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
            <span>{{qualification}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="isVisible = false">取 消</el-button>
          <el-button :loading="isSubmitting"  type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <!-- <sampling-node-report :isVisible="isVisible" :form="form" @cancel="cancel"></sampling-node-report> -->
  </div>
</template>

<script>

import RecordWrap from '../../reportRecord/record-wrap'
import {getUnitUser, getReportRecord, commonNodeReport,deleteReport,checkReportPermission} from '@/api'
import CommonMixin from './common-mixin';
    const fun  = require('@/components/Common/commonFun.js')
export default {
  mixins: [CommonMixin],
  props: ['instanceWorkflow'],
  data () {
    return {
      isVisible: false,
      isSubmitting: false,
      reports:[],
      options: {
        groupOptions: [], // 完成人员的下拉列表
      },
      form: {}
    }
  },
  components: {RecordWrap},
  computed: {
    // 抽检数据
    select_check() {
      return this.instanceWorkflow.components.select_check
    },
    // 抽检表格数据
    tableData() {
      let data = [
        {
          deliveryQuantity: this.select_check.deliveryQuantity,
          selectCheckQuantity: this.select_check.selectCheckQuantity,
          qualified: this.select_check.qualified,
          defectived: this.select_check.defectived,
          wasted: this.select_check.wasted,
          pop: this.select_check.pop,
        }
      ]
      return data
    },
    mission() {
      return this.instanceWorkflow.mission
    },
    qualification() {
      if(this.form.tableData[0].qualified && this.form.tableData[0].selectCheckQuantity) {
        let sum = this.form.tableData[0].qualified*1 / this.form.tableData[0].selectCheckQuantity*1
        sum = (sum* 100).toFixed(2)
        return `${sum}%`
      } else {
        return `0%`
      }
    },
    userId() {
      return (
        this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId
      );
    },
  },
  methods:{
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
        waitDeliveryQuantity:this.select_check.waitDeliveryQuantity,
        tableData: [
          {
            deliveryQuantity: '',
            selectCheckQuantity: 0,
            qualified: 0,
            defectived:0,
            wasted: 0
          }
        ]
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
    confirm() {
      let params = {
        ...this.form.tableData[0],
        userId: this.userId,
        dateCompleted: this.form.endAt? fun.dateFormatter(this.form.endAt,false) : '',
        chargerId: this.form.finishUserId,
        missionNodeId: this.$route.query.instanceWorkflowId,
        instanceId: this.$route.query.instanceWorkflowId,
        typeCode: 'select_check'
      }
      const reg = /^[+]{0,1}(\d+)$/;  //正整数(可为0)
        if (!this.form.endAt) return this.$message.error('完成时间不能为空')
        if (!this.form.finishUserId) return this.$message.error('完成人不能为空')
        if(this.form.tableData.some(v => !reg.test(v.deliveryQuantity)))return this.$message.error('交货数量不能为空且为正整数')
        if(this.form.tableData.some(v => !reg.test(v.selectCheckQuantity)))return this.$message.error('抽检数不能为空且为正整数')
        if(this.form.tableData.some(v => !reg.test(v.qualified)))return this.$message.error('合格数不能为空且为正整数')
        if(this.form.tableData.some(v => !reg.test(v.defectived)))return this.$message.error('次品数不能为空且为正整数')
        if(this.form.tableData.some(v => !reg.test(v.wasted)))return this.$message.error('废品数不能为空且为正整数')
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
        type: 'select_check'
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
  .column-name{
    .cell {
      padding:0 !important;
      /*height: 36px;*/
    }
    &.edit-bg{
      background-color: #FFF9ED;
      .el-input__inner{
        background-color: #FFF9ED;
        border:none;
      }
    }
  }
}
</style>



