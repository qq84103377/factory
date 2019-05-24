<template>
<section>
    <div class="scroll-view">
        <div class="service-header">
            <div class="service-title">节点进度</div>
            <div class="detail-item">
                <p><icon type="icon-gongdan_jiedianyiwancheng-xiao" w="14" h="14"></icon> 已完成：{{nodeData.completed || 0}}</p>
                <p><icon type="icon-gongdan_jiedianjinhangzhong-xiao" w="14" h="14"></icon> 进行中：{{nodeData.processing || 0}}</p>
                <p><icon type="icon-gongdan_jiedianweikaishi-xiao" w="14" h="14"></icon> 未开始：{{nodeData.initial || 0}}</p>
            </div>
        </div>
        <div class="node-list">
            <div class="item"
            v-for="(nodeItem, nodeIndex) in nodeData.nodes"
            :key="nodeIndex"
            @click="goDetail(nodeItem)">
                <div class="status-icon">
                    <icon type="icon-gongdan_jiedianyiwancheng-xiao" w="32" h="32" v-if="nodeItem.status == '2'"></icon> 
                    <icon type="icon-gongdan_jiedianjinhangzhong-xiao" w="32" h="32" v-if="nodeItem.status == '1'"></icon> 
                    <icon type="icon-gongdan_jiedianweikaishi-xiao" w="32" h="32" v-if="nodeItem.status == '0'"></icon> 
                    <span class="icon-error" v-if="(nodeItem.delay < 0) && nodeItem.status != '2'">
                        <icon type="icon-gongdan-dongtaijingbao" w="15" h="15"></icon>
                    </span>
                    <!-- <i class="icon-error el-icon-information" ></i> -->
                    <jn-progress :percentage="(nodeItem.total/nodeData.num) * 100" v-if="nodeItem.status == '1'"></jn-progress>
                </div>
                <div class="item-info">
                    <p class="node-desc">
                        <span class="w100 fs-16">{{nodeItem.name}}</span>
                        <span class="status green mg-60"
                        v-if="nodeItem.status === '2'">已完成</span>
                        <!-- <span class="status green mg-60" v-if="nodeItem.status === 'ONGOING'">进行中</span> -->
                        <span class="status red mg-60" 
                        v-if="nodeItem.delay < 0 
                        && nodeItem.status !== '2'
                        && nodeItem.dateEnd">延误 {{Math.abs(nodeItem.delay)}} 天</span>
                        <span class="status blue mg-60" 
                        v-if="nodeItem.status === '1'
                        && !nodeItem.dateEnd">进行中</span>
                        <span class="status mg-60"
                        :class="[
                            nodeItem.status == '1' && nodeItem.dateEnd ? 'blue' : ''
                        ]"
                        v-if="(nodeItem.delay > 0
                        && nodeItem.dateEnd 
                        && nodeItem.status !== '2') && (
                        nodeItem.status == '0' ||
                        nodeItem.status == '1')
                        ">还剩 {{nodeItem.delay}} 天</span>
                        <span class="status mg-60" 
                        v-if="(nodeItem.status === '0') 
                        && !nodeItem.dateEnd">未开始</span>
                        <span class="rate"
                            v-if="nodeItem.status !== '2' && nodeItem.targetType === '数量型'">
                            {{nodeItem.total}}/{{nodeData.num}}
                        </span>
                    </p>
                    <p class="node-info">
                        <span class="w100 line-one" v-if="nodeItem.chargers.length!=0" v-for="(items,indexs) in nodeItem.leader" :key="indexs">
                            <span>{{items}}</span>
                        </span>
                        <span class="w100 line-one" v-if="nodeItem.chargers.length==0">未关联节点人员</span>
                        <span  class="mg-60">结束日期：{{nodeItem.dateEnd || '未设置'|filterEndTime}}</span>
                    </p>
                </div>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
    </div>
</section>
</template>

<script>
import JnProgress from "../Common/progress";
import { missionNodeInfo } from "../../api/api";
export default {
  data() {
    return {
      nodeList: [],
      nodeStatus: {},
      nodeData: {},
      missionId: "",
      sign:'0'
    };
  },
  mounted() {
    const missionId = this.$route.query.id;
    this.missionId = missionId;
    this.fetchNodeList(missionId);
  },
  watch: {
    $route(val) {
      const missionId = val.query.id;
      this.missionId = missionId;
      this.fetchNodeList(missionId);
    }
  },
  filters: {
    filterEndTime(val) {
      return val.slice(0, 11);
    },
    fileterLeader(val) {
      console.log(val);
      if (val == "") {
        return "未设置关联人员";
      } else {
        return val;
      }
    }
  },
  methods: {
    // 获取工单节点
    fetchNodeList(missionId) {
      const params = {
        missionId: missionId
      };
      missionNodeInfo(params).then(res => {
        this.nodeList = res.data.nodes;
        this.nodeData = res.data;
        for (let item of res.data.nodes) {
          this.$set(item, "leader", []);
          for (let leaders of item.chargers) {
            item.leader.push(leaders.name);
          }
        }
        for (let item of res.data.nodes) {
          this.nodeStatus[item.status] = item.status;
        }
        console.log("获取工单节点列表", this.nodeList);
      });
    },
    goDetail(item) {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.node.details") {
            this.sign = "1";
          }
        }
      }

      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.$router.push({
        path: 'OrderDetailed',
        query: {
          missionId: this.missionId,
          instanceWorkflowId: item.id
        }
      });
    }
  },
  components: {
    JnProgress
  }
};
</script>

<style scoped lang="scss">
.green {
  color: #37bd0e;
}
.red {
  color: #f03535;
}
.blue {
  color: #1f96ff;
}
.scroll-view {
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c2c2c2;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: #fff;
  }
}
.line-one {
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  // line-height: 10px;
  // white-space: nowrap;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.service-header {
  /*display: flex;*/
  justify-content: space-between;
  align-items: center;
  padding: 32px 16px;
  border-bottom: 1px solid #e6e8eb;
  .service-title {
    text-indent: 14px;
    font-size: 20px;
    border-left: 6px solid #ff9c38;
  }
  .detail-item {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
    p {
      margin-left: 15px;
      font-size: 12px;
    }
  }
}
.node-list {
  flex: 1;
}
.item {
  display: flex;
  align-items: center;
  padding: 26px 16px 16px 32px;
  border-bottom: 1px solid #e6e8eb;
  cursor: pointer;
  &:hover {
    background: #fcfbfa;
  }
  .status {
    margin-right: 6px;
    font-size: 16px;
  }
  .status-icon {
    position: relative;
  }
  .icon-error {
    position: absolute;
    right: -2px;
    top: -2px;
    z-index: 9;
    font-size: 16px;
    color: #f03535;
  }
  .item-info {
    flex: 1;
    margin: 0 12px;
  }
  .node-desc {
    font-size: 0;
  }
  span.w100 {
    display: inline-block;
    width: 100px;
  }
  .fs-16 {
    font-size: 16px;
  }
  .rate {
    font-size: 12px;
    color: #78818f;
  }
  .node-info {
    display: flex;
    // justify-content: space-between;
    margin-top: 6px;
    font-size: 12px;
    color: #555555;
  }
  .el-icon-arrow-right {
    color: #cfd8e6;
  }
}
</style>
