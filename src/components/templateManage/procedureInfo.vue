<template>
    <section class="create-section">
        <div class="header">
            <div class="title">模板信息</div>
            <div class="btn-wrap">
                <nf-button @click="$router.push('/nodeManage')">
                    <i class="el-icon-arrow-left"></i>返回上级</nf-button>
            </div>
        </div>
        <div class="create-main">
            <div class="main-title">
                <span style="display:flex;align-items:center;"><span style="display:inline-block;width:4px;height:20px;background:#ff9c38;margin-right:12px;"></span>基本信息</span>
                <nf-button type="warning" :plain="true" @click="click_isshow">编辑</nf-button>
            </div>
            <div class="procedure-name">
                <div class="form-wrap">
                    <div class="form-item">
                        <label class="form-label">工序名称：</label>
                        <span>{{nodeInfo.name}}</span>
                    </div>
                </div>
                <div class="form-wrap">
                    <div class="form-item">
                        <label class="form-label">默认负责人：</label>
                        <span v-for="(item, index) of nodeInfo.chargers">
                            {{item.name}}<i v-if="index !== nodeInfo.chargers.length - 1">、</i>
                        </span>
                    </div>
                </div>
                <div class="form-wrap">
                    <div class="form-item">
                        <label class="form-label">整单外发：</label>
                        <span>{{nodeInfo.defaultAllOrderOutside ? '是' : '否'}}</span>
                    </div>
                </div>
            </div>
            <div class="procedure-flow">
                <label class="form-label">
                    <span style="display:flex;align-items:center;font-size:20px;"><span style="display:inline-block;width:4px;height:20px;background:#ff9c38;margin-right:12px;"></span>工序流程</span>
                </label>
                <div class="table">
                    <div class="table-th">
                        <div class="table-td" style="width: 140px;">
                            节点名称
                        </div>
                        <div class="table-td" style="width: 140px;" v-popover:popover1>
                            节点类型
                            <el-popover ref="popover1" placement="top-start" width="200" :offset = "130" height="86" trigger="hover">
                                <div  style="color:#a2abb8">节点数据类型决定在工单里此节点的完成方式。</div>
                                <div  style="color:#a2abb8">逻辑型：是否完成</div>
                                <div  style="color:#a2abb8">数量型：已完成数量是否达到预设的数量</div>
                            </el-popover>
                            <icon type="icon-tongyong-tishi" style="width:14px;"></icon>
                        </div>
                        <div class="table-td" v-popover:popover2>
                            默认负责人
                            <icon type="icon-tongyong-tishi" style="width:14px;"></icon>
                            <el-popover ref="popover2" placement="top-start" width="200" :offset = "130" height="86" trigger="hover">
                                <div style="color:#a2abb8">在制单时选用节点后该工单这个节点的负责人会默认填入这里设置的负责人，但可以再修改</div>
                            </el-popover>
                        </div>
                        <div class="table-td" style="width: 140px" v-popover:popover4>
                            默认工价
                            <icon type="icon-tongyong-tishi" style="width:14px;"></icon>
                            <el-popover ref="popover4" placement="top-start" width="200" :offset = "130" height="86" trigger="hover">
                                <div style="color:#a2abb8">在制单时选用节点后该工单这个字段的数值会与上报数量参与运算，得出每个工位在一个时间段内的工资</div>
                            </el-popover>
                        </div>
                        <div class="table-td" style="text-align:center;width:140px;"  v-popover:popover3>
                            默认结束时间
                            <icon type="icon-tongyong-tishi" style="width:14px;"></icon>
                            <el-popover ref="popover3" placement="top-start" width="200" :offset = "0" height="86" trigger="hover">
                                <div style="color:#a2abb8">在新建工单时选用工序模板后，该工单每个节点会默认按照这里填写的时间和工单的交货时间自动推算结束日期，可再手动修改</div>
                            </el-popover>
                        </div>
                        <div class="table-td" style="width: 180px;">
                            预警提醒 (天)
                        </div>
                        <div class="table-td" style="width: 180px;">
                            差额提醒 (数量)
                        </div>
                        <div class="table-td" style="width: 140px;">
                            外发结算
                        </div>
                        <div class="table-td" style="width: 160px;">
                            上报为工单出货数
                        </div>
                        <div class="table-td" style="width: 180px;">
                            上游节点
                        </div>
                        <div class="table-td" style="width: 180px;">
                            审核配置
                        </div>
                    </div>
                    <div class="table-tr" v-for="item1 of nodeInfo.nodes">
                        <div class="table-td" style="width: 140px;">
                            {{item1.name}}
                        </div>
                        <div class="table-td" style="width: 140px;">
                            {{item1.typeName}}
                        </div>
                        <div class="table-td" style="width: 400px;">
                            <span v-if="item1.chargers == undefined || item1.chargers.length === 0">未设置</span>
                            <span v-for="(item2,index) of item1.chargers" :key="index">
                                {{item2.name}}<i v-if="index !== item1.chargers.length - 1">、</i>
                            </span>
                        </div>
                        <!-- 默认工价 -->
                        <div class="table-td" style="width: 140px;">
                            <span v-if="item1.ailc === false">-</span>
                            <span v-else>
                                <span v-if="!item1.dlc">未设置</span>
                                <span v-else>{{item1.dlc}}元／件</span>
                            </span>
                        </div>
                        <div class="table-td" style="width: 150px;text-align:center;">
                            <span v-if="!item1.dafd">未设置</span>
                            <span v-else>交货前{{item1.dafd}}天</span>
                        </div>
                        <div class="table-td" style="width: 180px;">
                               结束前 {{item1.delayWarningNum}} 天
                        </div>
                        <div class="table-td" style="width: 180px;">
                            【<span v-if="item1.differenceWarningMin>0">+</span>{{item1.differenceWarningMin}}】
                            -【<span v-if="item1.differenceWarningMax>0">+</span>{{item1.differenceWarningMax}}】
                        </div>
                        <!-- 外发结算 -->
                        <div class="table-td" style="width: 140px;">
                            <el-checkbox v-model="item1.allowOutsideBalance" disabled></el-checkbox>
                        </div>
                        <!-- 上报为工单出货数 -->
                        <div class="table-td" style="width: 160px;">
                            <el-checkbox v-if="item1.missionShipment" v-model="item1.missionShipment" disabled></el-checkbox>
                        </div>
                        <!-- 上游节点 -->
                        <div class="table-td" style="width: 180px;">
                            {{item1.upstreamNodeName}}
                        </div>
                        <!-- 审核配置 -->
                        <div class="table-td" style="width: 180px;">
                            <div v-if="showConfigBtn(item1)"
                                 class="config-btn"
                                 @click="handleConfig(item1.idFlag)">
                                <icon class="icon-size" type="icon-topbar-setting"></icon>
                                审核配置
                            </div>
                        </div>
                    </div>
                </div>
                <div class="procedure-config" style="margin-top: 20px;" v-if="nodeInfo.delayNotify">
                    <label class="form-label">
                        <span style="display:flex;align-items:center;font-size:20px;"><span style="display:inline-block;width:4px;height:20px;background:#ff9c38;margin-right:12px;"></span>自定义配置工单延误提醒</span>
                    </label>
                    <p style="color: #97a2be;font-size: 12px;margin: 6px 0 14px">当满足以下条件时，工单不再显示延误时间和延误状态。</p>
                    <div>
                        <span style="margin-right: 40px;">节点名称：{{nodeInfo.prcdNodeName}}</span>
                        <span>节点状态：{{nodeInfo.prcdNodeStatus==1?'进行中':'已完成'}}</span>
                    </div>
                </div>
                <nf-button class="del-btn" type="warningsimple" @click="click_delete">删除模板</nf-button>
                <el-dialog
                    title="是否删除当前模板"
                    align="center"
                    :show-close='false'
                    :visible.sync="dialogVisible"
                    size="tiny">
                    <span slot="footer" style="display:flex;justify-content:center;" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="deleteTemplate()">确 定</el-button>
                    </span>
                </el-dialog>
                <!--审核配置弹窗-->
                <audit-config
                        :isShow.sync="dialogVisibleAuditConfig"
                        :nodeId="nodeId">
                </audit-config>
            </div>

        </div>
    </section>
</template>

<script>
import {
  getTemplate,
  deleteTemplate,
  templateInfo,
  deleteNodeTemplate
} from "../../api/api";
import auditConfig from "@/components/Common/dialog/auditConfig"
export default {
  data() {
    return {
      nodeInfo: {},
      sign: "0",
        dialogVisibleAuditConfig: false,
      dialogVisible: false,
      nodeId: '',   //点击审核配置时记录的节点id
    };
  },
  components: {
    auditConfig,
  },
  methods: {
      handleConfig(id){
          this.nodeId = id;
          this.dialogVisibleAuditConfig = true;
      },
      //表格行是否显示外发结算
      showConfigBtn(item){
          //（裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流、裁床-扎号型、裁床-唯一码型）   这些节点显示“审核配置”按钮
          if(item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
              || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking'
              || item.typeCode === 'actual-cutting-ligation' || item.typeCode === 'actual-cutting-wym'){
              return true
          }else{
              return false
          }
      },
    click_delete() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.node.operate") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.dialogVisible = true;
    },
    // 编辑模版权限
    click_isshow() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.node.operate") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.$router.push("editTemplateProcedure/?id=" + this.$route.query.id);
    },
    templateInfo() {
      let params = {
        templateId: this.$route.query.id
      };
      templateInfo(params).then(res => {
        console.log(res);
        this.nodeInfo = res.data.template;
      });
    },
    deleteTemplate() {
      let params = {
        templateId: this.$route.query.id
      };
      deleteNodeTemplate(params).then(res => {
        console.log(res);
        this.$message({
          message: "模板成功删除",
          duration: this.$globalConfig.elementUI.duration,
          type: "success"
        });
        this.$router.push("nodeManage/");
      });
    }
  },
  created() {
    this.templateInfo();
  }
};
</script>

<style scoped lang="scss">
.color {
  color: #ff9c38 !important;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  line-height: 64px;
  background: #ffffff;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
  .title {
    font-size: 24px;
    color: #2c2c2c;
  }
  .btn-wrap {
    display: inline-block;
    text-align: center;
    i {
      font-size: 12px;
      margin-right: 5px;
    }
  }
}

.del-btn {
  margin-top: 64px;
}

.create-main {
  padding: 32px;
  margin-top: 15px;
  background: #ffffff;
  .main-title {
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .main-title-right {
      color: #ff9c38;
      display: flex;
      justify-content: center;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      border: 1px solid #ff9c38;
      width: 64px;
      height: 32px;
      text-indent: 0;
      cursor: pointer;
    }
  }
  .procedure-name {
    padding: 32px 0;
    border-bottom: 1px solid rgba(230,234,240,1);
  }
  .form-wrap {
    display: inline-block;
    margin-right: 57px;
  }
  .form-item {
    display: flex;
    align-items: center; // width: 250px;
  }
  .form-label {
    font-size: 14px;
    padding-right: 10px;
  }
}

.table {
  .tips_font {
    color: #a2abb8 !important;
  }
  display: table;
  width: 100%;
  margin-top: 16px;
  font-size: 14px;
  border: 1px solid #e6e8eb;
  border-bottom: none;
  .table-th,
  .table-tr {
    display: table-row;
  }
  .tbody {
    display: table;
    width: 100%;
  }
  .table-tr {
    &:hover {
      background-color: #fcfbfa;
    }
    .table-td {
      border-right: 1px solid #e6e8eb;
      &:last-child {
        border-right: none;
      }
        .config-btn{
            cursor: pointer;
        }
    }
  }
  .table-th {
    color: #62758c;
    background: #f8f9fd;
  }
  .table-td {
    display: table-cell;
    height: 48px;
    padding-left: 16px;
    vertical-align: middle;
    border-bottom: 1px solid #e6e8eb;
    .tips_font {
      color: #a2abb8;
    }
  }
  .table-input {
    width: 30px;
    padding: 0 8px;
    border-bottom: 1px solid #d2d4d7;
  }
  .tips_font {
    color: #a2abb8 !important;
  }
}
</style>
