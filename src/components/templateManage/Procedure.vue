<template>
    <section class="procedure-section">
        <div class="btn-wrap">
            <el-checkbox @change="updatePrcdNodeReportStatus" v-model="checked" class="mgt20 mgl30">跨节点上报</el-checkbox>
            <nf-button type="warning" class="btn" @click="click_isshow">
                <i class="el-icon-plus"></i>新建生产模板
            </nf-button>
        </div>
        <div class="procedure-list" v-for="(item, index) in templateList" :key="index">
            <div class="item">
                <div class="item-header">
                    <div class="item-header-left">
                        <div class="title">
                            {{item.name}}
                        </div>
                        <div class="person-charge">
                            <span class="number">{{item.nodes.length}}&nbsp;节点</span>
                            默认负责人：
                            <span class="man" v-for="(item1,index1) of item.chargers" :key="index">{{item1.name}}
                                <span v-if="item.chargers.length!=1&&(index1+1)!=item.chargers.length">、</span>
                            </span>
                        </div>
                    </div>
                    <nf-button class="btn-detail" @click="$router.push('/procedureInfo'+'?id='+item.id)">
                        模板详情
                        <i class="el-icon-arrow-right"></i>
                    </nf-button>
                </div>
                <div class="item-content">
                    <div class="steps" v-for="(item2, index) in item.nodes" :key="index">
                        <el-popover placement="bottom" width="210" trigger="hover">
                            <div class="popover-content">
                                <div class="node first-node">
                                    <div class="node_name">{{item2.name}}</div>
                                    <div class="node_type">{{item2.typeName}}</div>
                                </div>
                                <div class="node">
                                    <span class="title">默认负责人</span>
                                    <div class="desc">
                                        <span v-if="item2.chargers == undefined || item2.chargers.length === 0">未设置</span>
                                        <span v-for="item3 of item2.chargers">{{item3.name}}&emsp;</span>
                                    </div>
                                </div>
                                <div class="node">
                                    <span class="title">默认结束时间</span>
                                    <div class="desc">{{item2.dafd===null?'未设置':item2.dafd+'天'}}</div>
                                </div>
                                <!-- 默认工价 -->
                                <div v-if="item2.dlc!=-1" class="node">
                                    <span class="title">默认工价</span>
                                    <div class="desc">{{item2.dlc | noSet}}
                                        <span v-if="item2.dlc">元／件</span>
                                    </div>
                                </div>
                                <div class="node">
                                    <span class="title">节点提醒</span>
                                    <div class="desc">
                                        <span v-if="item2.delayWarningNum!==null">延期预警：结束前 {{item2.delayWarningNum | noSet}} 天</span><br>
                                        <span v-if="item2.delayWarningNum!==null">差额提醒：容差 [<span v-if="item2.differenceWarningMin>0">+</span>{{item2.differenceWarningMin }}]
                                         - [<span v-if="item2.differenceWarningMax>0">+</span>{{item2.differenceWarningMax}}]   </span>
                                    </div>
                                </div>
                            </div>
                            <div class="steps-radius" slot="reference">
                            </div>
                        </el-popover>

                        <div class="steps-desc" :title="item2.name">
                            {{item2.name}}
                        </div>
                        <div class="step-line step-line-left" v-if="index != 0">
                        </div>
                        <div class="step-line step-line-right" v-if="index != 20">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
//getTemplateList
import { getNodeTemplateList ,getPrcdNodeReportStatus,updatePrcdNodeReportStatus} from "../../api/api";
export default {
  data() {
    return {
        checked:true,
      templateList: [],
      nodeInfo: {},
      targetName: "",
      sign:'0'
    };
  },
  filters: {
    noSet(val) {
      if (!val || val === null || val < 0) {
        return "未设置";
      } else {
        return val;
      }
    }
  },
  methods: {
      //跨节点上报
      getPrcdNodeReportStatus(){
          getPrcdNodeReportStatus({unitId:JSON.parse(sessionStorage.getItem("user_login")).unitId}).then(res=>{
              if(res.data.code===0){
                  this.checked = res.data.data
              }else {
                  this.$message.error(res.data.msg)
              }

          })
      },
      updatePrcdNodeReportStatus(val){
          updatePrcdNodeReportStatus({unitId:JSON.parse(sessionStorage.getItem("user_login")).unitId,isOpen:this.checked,}).then(res=>{
              if(res.data.code===0){
                  this.$message.success(res.data.msg)
              }else {
                  this.checked = !this.checked
                  this.$message.error(res.data.msg)
              }

          })
      },
    //   添加模版权限
    click_isshow() {
      this.sign = '0'
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
      this.$router.push("/createProcedure");
    },
    getTemplateList() {
      let params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      };
      getNodeTemplateList(params).then(res => {
        console.log(res);
        this.templateList = res.data.templates;
      });
    }
  },
  computed: {
    point() {}
  },
  created() {
    this.getPrcdNodeReportStatus();
    this.getTemplateList();
  }
};
</script>

<style scoped lang="scss">
.btn-wrap {
  overflow: hidden;
  .btn {
    float: right;
    margin: 14px 32px 14px 0;
  }
}

.procedure-list {
  margin-bottom: 10px;
  .item {
    padding: 16px 0;
    border-radius: 2px;
    background-color: #ffffff;
    &:hover {
      box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
    }
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px 15px;
    border-bottom: 1px solid #e6e8eb;
  }
  .item-header-left {
    flex: 1;
    .title {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .person-charge {
      font-size: 14px;
      color: #a2abb8;
    }
    .number {
      margin-right: 32px;
    }
  }
  .el-icon-arrow-right {
    font-size: 12px;
  }
  .item-content {
    padding-top: 32px;
    .steps {
      position: relative;
      width: 130px;
      margin-bottom: 26px;
      text-align: center;
      &:last-child .step-line-right {
        width: 0;
      }
    }
    .steps,
    .steps-radius {
      display: inline-block;
    }
    .steps-desc {
      margin-top: 5px;
    }
    .steps-radius {
      width: 12px;
      height: 12px;
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 50%;
      border: 4px solid #1ca1ff;
    }
    .steps-desc {
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .step-line {
      position: absolute;
      top: 5px;
      width: 52px;
      height: 2px;
      background: #1e96ff;
      opacity: 0.4;
    }
    .step-line-left {
      left: 0;
    }
    .step-line-right {
      right: 0;
    }
  }
}

.popover-content {
  padding: 16px 12px;
  .node {
    margin-bottom: 16px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .title {
      font-size: 14px;
      color: #a2abb8;
    }
    .desc {
      margin-top: 4px;
      color: #2c2c2c;
      font-size: 14px;
      span {
        color: #2c2c2c;
      }
    }
    .node_name {
      margin-bottom: 4px;
      font-size: 16px;
    }
    .node_type {
      font-size: 14px;
      color: #3b3b3b;
    }
  }
}
</style>
