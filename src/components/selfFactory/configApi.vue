<template>
  <div class="config-api" v-loading="fullLoading">
    <page-title title="中台API配置">
      <div class="btns">
        <nf-button type="warning" @click="linkToQuery()">查看API推送日志</nf-button>
      </div>
    </page-title>
    <!-- 推送API -->
    <div class="common-block">
      <content-wrap title="推送API" type="big">
        <div class="mgt16" v-loading="loading" style="min-height: 100px;">
          <el-table empty-text="暂无数据" :data="sendTableData" border style="width: 500px;">
            <el-table-column prop="sendName" label="接收内容">
              <template slot-scope="scope">{{scope.row.sendName}}→{{scope.row.receivedName}}</template>
            </el-table-column>
            <el-table-column label="是否启用" width="120">
              <template slot-scope="scope">
                <el-checkbox @change="sendOpen(scope.row)" v-model="scope.row.enabled">启用</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template
                slot-scope="scope"
                v-if="scope.row.full === true && scope.row.enabled === true"
              >
                <el-button
                  class="edit-btn"
                  type="text"
                  size="small"
                  @click="sendKey(scope.row)"
                >一键全量推送</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </content-wrap>
    </div>
    <!-- 接收API -->
    <div class="common-block">
      <content-wrap title="接收API" type="big">
        <div class="mgt16" v-loading="loading" style="min-height: 100px;">
          <el-table empty-text="暂无数据" :data="receiveTableData" border style="width: 500px;">
            <el-table-column prop="sendName" label="接收内容">
              <template slot-scope="scope">{{scope.row.sendName}}→{{scope.row.receivedName}}</template>
            </el-table-column>
            <el-table-column label="是否启用" width="120">
              <template slot-scope="scope">
                <el-checkbox @change="receiveOpen(scope.row)" v-model="scope.row.enabled">启用</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template
                slot-scope="scope"
                v-if="scope.row.full === true && scope.row.enabled === true"
              >
                <el-button
                  class="edit-btn"
                  type="text"
                  size="small"
                  @click="receiveKey(scope.row)"
                >一键全量获取</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </content-wrap>
    </div>
    <!-- 弹窗：一键推送/获取结果 -->
    <el-dialog class="tips-box" :title="popTit" :visible.sync="popShow" size="tiny">
      <span class="tips-content">
        成功更新{{successNum}}条
        <br>
        推送失败{{failNum}}条
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="queryLog()">点击查看推送日志</el-button>
        <el-button type="primary" size="small" @click="popShow = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  facRegentCentralConfigList,
  facRegentCentralConfigEnabled,
  facRegentCentralConfigFullPush,
  facRegentCentralConfigFullReceived
} from "@/api/selfFactory.js";
export default {
  data() {
    return {
      loading: false,
      fullLoading: false,
      sendTableData: [], // 推送api表格数据
      receiveTableData: [], // 接收api表格数据
      unitId: "", // 工厂id
      popShow: false, // 弹窗显示与否
      successNum: null, // 成功更新条数
      failNum: null, // 推送/获取失败条数
      popTit: "", // 一键推送/获取结果标题
      linkUrl: "" // 点击查看推送/获取日志跳转地址
    };
  },
  computed: {},
  methods: {
    // 查看api推送日志
    linkToQuery() {
      window.open(this.linkUrl);
    },

    // 点击查看推送/获取日志
    queryLog() {
      this.popShow = false;
      window.open(this.linkUrl);
    },

    // 推送/获取API是否启用方法
    commonOpen(row) {
      let params = {
        unitId: this.unitId, // 工厂id
        configId: row.configId, // 配置id
        sendCoded: row.sendCode, // 推送模块编码
        receivedCode: row.receivedCode, // 接收模块编码
        enabled: row.enabled // 启用状态
      };
      facRegentCentralConfigEnabled(params).then(res => {
        if (res.data.code === 0) {
          this.sendGetList();
        } else {
          this.$message.error(res.data.msg); // 失败提示
        }
      });
    },

    // 推送API是否启用
    sendOpen(row) {
      this.commonOpen(row);
    },

    // 接收API是否启用
    receiveOpen(row) {
      this.commonOpen(row);
    },

    // 一键全量推送/获取方法
    commonBatch(row, key) {
      let message = "";
      if (key === "send") {
        message = "全量推送在数据量大时可能需要加载很久，是否继续？";
      }
      if (key === "receive") {
        message = "全量获取在数据量大时可能需要加载很久，是否继续？";
      }
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fullLoading = true;
          let params = {
            unitId: this.unitId, // 工厂id
            configId: row.configId, // 配置id
            sendCoded: row.sendCode, // 推送模块编码
            receivedCode: row.receivedCode // 接收模块编码
          };
          if (key === "send") {
            facRegentCentralConfigFullPush(params).then(res => {
              this.fullLoading = false;
              if (res.data.code === 0) {
                this.popTit = "一键推送结果";
                this.successNum = res.data.successNum;
                this.failNum = res.data.faithNum;
                this.popShow = true;
              } else {
                this.$message.error(res.data.msg); // 失败提示
              }
            });
          }
          if (key === "receive") {
            facRegentCentralConfigFullReceived(params).then(res => {
              this.fullLoading = false;
              if (res.data.code === 0) {
                this.popTit = "一键获取结果";
                this.successNum = res.data.successNum;
                this.failNum = res.data.faithNum;
                this.popShow = true;
              } else {
                this.$message.error(res.data.msg); // 失败提示
              }
            });
          }
        })
        .catch(() => {});
    },

    // 一键全量推送
    sendKey(row) {
      this.commonBatch(row, "send");
    },

    // 一键全量获取
    receiveKey(row) {
      this.commonBatch(row, "receive");
    },

    // 推送api数据初始化
    sendGetList() {
      this.loading = true;
      let params = {
        // 初始搜索参数
        unitId: this.unitId
      };
      facRegentCentralConfigList(params).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          const data = res.data.data;
          this.sendTableData = data.sendList; // 推送api数据
          this.receiveTableData = data.receivedList; // 接收api数据
          this.linkUrl = data.logUrl;
        } else {
          // 失败提示
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.unitId = JSON.parse(sessionStorage.getItem("user_login")).unitId;
    this.sendGetList();
  }
};
</script>
<style lang="scss" scoped>
.config-api {
  .common-block {
    background-color: #fff;
    min-height: 136px;
    padding: 32px 32px 24px 32px;
    box-sizing: border-box;
    margin-bottom: 16px;
  }
  .i-warn {
    margin-right: 3px;
    color: #ff8d37;
  }
}
</style>
<style lang="scss">
.config-api {
  // 弹窗样式修改
  .tips-box {
    .tips-content {
      padding: 0 50px;
      display: inline-block;
      line-height: 24px;
      font-weight: bold;
    }
    .el-dialog__header {
      padding-bottom: 10px;
      border-bottom: 1px solid #e6eaf0;
    }
    .el-dialog__body {
      text-align: center;
    }
    .el-dialog__footer {
      border-top: 1px solid #e6eaf0;
    }
  }
  // 操作按钮样式修改
  .edit-btn {
    text-decoration: underline;
    color: #ff9c38;
  }
  .content_wrap--head {
    margin-bottom: 0;
  }
  .content_wrap--content {
    padding: 0;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>

