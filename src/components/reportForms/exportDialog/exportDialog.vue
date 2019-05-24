<template>
  <div id="Salary-report-export-dialog">
      <div class="dialog-wrap">
          <div class="header">导出报表</div>
          <div class="content">
            <div>
                <el-radio label="1" v-model="radio">按员工总计件工资导出</el-radio>
            </div>              
            <div>
                <el-radio label="2" v-model="radio">按员工每张工单每个上报节点导出</el-radio>
            </div>
          </div>
          <div class="footer">
              <div class="btn-group">
                  <nf-button width='130' height='40' @click="emitEvent">取消</nf-button>
                  <nf-button width='130' height='40' type='warning' @click="exportReportHandler">确定</nf-button>
              </div>
          </div>
      </div>
      <div class="mask" @click="emitEvent"></div>
  </div>
</template>
<script>
import { exportReport } from '../../../api/myReport/myReportApi';
export default {
    data() {
        return {
            radio: '1'
        };
    },
    methods: {
        // 响应事件
        emitEvent() {
            this.$emit('toggle');
        },
        // 导出报表，
        exportReportHandler() {
            let params = {
                type: this.radio == '1' ? 1 : 2
            };
            console.log(exportReport(params))
            window.open(exportReport(params));
        }
    }
};
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background: rgba(0, 0, 0, 0.5);
}
.dialog-wrap {
    width: 520px;
    height: 258px;
    border-radius: 2px;
    background-color: #ffffff;
    box-shadow: 0 26px 12px -15px rgba(0, 0, 0, 0.25);
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 101;
    transform: translate(-50%, -50%);
    .header {
        text-align: center;
        font-size: 20px;
        padding: 16px 0;
        border-bottom: 1px solid #e6eaf0;
    }
    .content {
        padding: 33px 0px 33px 32px;
        border-bottom: 1px solid #e6eaf0;
        div:first-child {
            margin-bottom: 20px;
        }
    }
    .btn-group {
        float: right;
        margin-right: 32px;
        margin-top: 24px;
    }
}
</style>
