<template>
    <section class="service-section" v-loading="loading" v-if="firstMenus.length">
        <div class="service-left">
            <div class="scroll-view" ref="left-scroll">
                <div class="service-header left-header">
                    <div class="service-title">工单消息</div>
                    <div class="search-bar">
                        <el-input
                            placeholder="输入工单号/客户名/款号"
                            icon="search"
                            v-model="keyWord"
                            :on-icon-click="handleIconClick">
                            </el-input>
                    </div>
                </div>
                <div class="list">
                    <div class="list-item"
                    v-for="(item, index) in missionMessageList" :key="index"
                    @click="fetchMessageList(item.missionId, index, item)"
                    :class="{ 'is-active': activeIndex === index }">
                        <left-item :messageItem="item" @imgShow="handlePreview"></left-item>
                    </div>
                    <div class="no-more-data" v-show="isNoMore">
                        没有更多数据了
                    </div>
                </div>
            </div>
        </div>
        <div class="service-center" :class="[isCancelMsg ? 'gray' : '']" v-if="$route.query.id && msgContentShow">
            <div class="service-header center-header">
                <div class="service-title">相关消息</div>
                <div style="width:100px">
                    <el-select
                    v-model="taskInstanceWorkFlowIds"
                    @change="handleSeclectNodeId" placeholder="节点名">
                        <el-option
                        :label='all'
                        :value='allType'
                        ></el-option>
                        <el-option
                        v-for="item in nodeOptions"
                        :key="item.instanceWorkflowId"
                        :label="item.name"
                        :value="item.instanceWorkflowId">
                        </el-option>

                    </el-select>
                </div>
                <div class="filter">
                    <el-checkbox
                    v-model="isMe"
                    true-label="1"
                    false-label="0"
                    @change="handleCheck">只看与我有关</el-checkbox>
                    <el-checkbox
                    v-model="isAlert"
                    true-label="1"
                    false-label="0"
                    @change="handleCheck">警报</el-checkbox>
                    <el-checkbox
                    v-model="isImg_File"
                    true-label="1"
                    false-label="0"
                    @change="handleCheck">有图片或附件</el-checkbox>
                </div>
            </div>
            <div class="scroll-view" ref="center-scroll" id="chatContainer">
                <div class="no-more-data" v-show="isNoMessagaMore">
                    没有更多数据了
                </div>
                <div
                    v-for="(msgItem, msgIndex) in messageList"
                    :key="msgIndex"
                    class="center-msg"
                    :class="[
                    msgItem.alertStatus && msgItem.flag ? 'warning-msg' : '',
                    viewDetailIndex === msgIndex && msgItem.alertStatus ? 'isActive' : '',
                    viewDetailIndex === msgIndex && !msgItem.alertStatus ? 'is-default-active' : '',
                    msgItem.isFirst ? 'firsr-child' : ''
                    ]"
                    @click="viewNodeDetail(msgItem, msgIndex)">
                        <center-item
                        :msgItem="msgItem"
                        :isMission="true"
                        @deleteMsg="deleteMsg"
                        @getMsgItem="getMsgItem"
                        @preview="handlePreview"></center-item>
                </div>

            </div>
            <send-form v-if="true"
            @handleReplyMessage="handleReplyMessage"
            @changeNode="handleSelectNode"
            :personList="personList"
            :nodeList="nodeList"
            :staticPersonIds="staticPersonIds"
            :staticNodeIds="staticNodeIds"
            :resplyMsg="resplyMsgItem"
            :isSubmit="isSubmit"
            :textFocus="textFocus"></send-form>
        </div>
        <div v-show='isShow' class="service-right" :class="[isCancelMsg ? 'gray' : '']" v-if="$route.query.id && msgContentShow">
            <div class="service-header right-header">
                <div class="service-title">工单：{{missionInfo.orderNo}}</div>
                <div>
                    <p class="count-down" v-if="missionInfo.status>0">交货倒计时:{{missionInfo.status}}天</p>
                    <p class="count-down green" v-if="missionInfo.status === 'FINISH'">已完成</p>
                    <p class="count-down red" v-if="missionInfo.status < 0">延误{{missionInfo.status.replace(/-/, '')}}天</p>
                </div>
                <div class="detail-item">
                    <p><span>客　户：</span>{{missionInfo.custName}}</p>
                    <p><span>交货日期：</span>{{missionInfo.deliveryAt}}</p>
                    <p class="good-name"><span>货　品：</span><span class="name-detail">{{missionInfo.goodsName}}</span></p>
                    <p><span>订货数量：</span>{{missionInfo.nums}} 件</p>
                </div>
            </div>
            <router-view :key="routerKey"></router-view>
        </div>
        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </section>
</template>

<script>
import LeftItem from "./left-item";
import CenterItem from "./center-item";
import SendForm from "./form";
import { mapState, mapMutations } from "vuex";
import previewImg from "./preview-img";
import Utils from "../../utils/format";

import {
  getRongYunToken,
  getMissionMessageList,
  getMessageList,
  addMessage,
  editMessage,
  deleteMessage,
  getPersonList,
  queryTaskNodeList,
  getNodeList,
  getFacMissionNodeInfoListById,
  getFacMission,
  getLeadersOfNode
} from "../../api/api";
export default {
  data() {
    return {
      firstMenus:JSON.parse(sessionStorage.getItem('user_login')).firstMenus,
      loading: false,
      tableVal: {},
      isAlert: "0",
      isMe: "0",
      isImg_File: "0",
      loadIndex: 1,
      loadMessageIndex: 1,
      pageSize: 20,
      isNoMore: false,
      isNoMessagaMore: false,
      msgContentShow: false,
      textFocus: false,
      showCenter: false,
      showRight: false,
      activeIndex: null,
      isCancelMsg: false,
      viewDetailIndex: null,
      isSubmit: false,
      isEdit: false,
      keyWord: "",

      missionId: "",
      // center
      previewImgPath: "",
      replyMessageId: "",
      nodeOptions: [],
      taskInstanceWorkFlowIds: "",
      resplyMsgItem: {},
      personList: [],
      nodeList: [],
      staticPersonIds: [],
      staticNodeIds: [],
      // center
      // right
      missionInfo: {},
      // right
      missionMessageList: [], // 工单消息列表
      messageList: [],
      imgshowon: "",
      centerDialogVisible: false,
      all: "全部",
      allType: 0,
      previewList: [],
      sign:'0',
      isShow:true
    };
  },
  mounted() {
      this.fetchMissionMessageList();
    // this.fetchToken().then(token => {
    //     RongYunInit({
    //         token: token,
    //         appKey: 'kj7swf8okiu42'
    //         // qd46yzrfqhb0f  / uwd1c0sxuvmj1 /kj7swf8okiu42

    //     }, {
    //         getMessage: this.getRongYunRes
    //     });
    // });
    this.$refs["left-scroll"].addEventListener("scroll", () => {
        const leftScroll = this.$refs["left-scroll"];
        if (
          leftScroll.scrollTop >=
          leftScroll.scrollHeight - leftScroll.clientHeight
        ) {
          this.loadMoreMissionMessage();
        }
      },
      false
    );
  },
  computed: {
    ...mapState({
      rongYunRes: state => state.rongYunRes
    }),
    routerKey() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    }
  },
  watch: {
    rongYunRes(val) {
      this.getMessage(val);
      this.fetchMissionMessageList();
    },
    msgContentShow(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs['center-scroll'].addEventListener("scroll", () => {
              const centerScroll = this.$el.querySelector("#chatContainer");
              if (!this.loading && centerScroll.scrollTop === 0) {
                this.loadMoreMessage();
              }
            },
            false
          );
        });
      }
    }
    //监听数据变化后在最后
    // messageList(val) {
    //     this.$nextTick(() => {
    //         var container = this.$el.querySelector("#chatContainer");
    //         // console.log(container);
    //         container.scrollTop = 0;
    //     })
    // }
  },
  methods: {
    ...mapMutations(["getRongYunRes"]),
    handleIconClick() {
      this.fetchMissionMessageList();
    },
    handlePreview(imgList, index) {
      this.previewList = JSON.parse(JSON.stringify(imgList));
      this.$nextTick(() => {
        this.$refs["previewer"].show(0);
      });
    },
    // 获取融云返回消息
    getMessage(msg) {
      if (msg.content.data === this.missionId) {
        this.fetchMessageList(this.missionId, this.activeIndex);
      }
    },
    // 获取融云token
    fetchToken() {
      return getRongYunToken({
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      }).then(res => {
        return res.data;
      });
    },
    // 获取工单消息列表
    fetchMissionMessageList(params = { pageNo: 1, pageSize: this.pageSize }) {
      // this.loading = true;
      const _params = {
        unitId: JSON.parse(sessionStorage.getItem("user_login")).unitId,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        ...params
      };
      if (this.keyWord) {
        _params.likeKeyword = this.keyWord;
      }
      return getMissionMessageList(_params).then(res => {
        if (res.data.code == 1) {
          this.$message.error(res.data.msg);
          this.loading = false;
          return;
        }
        if (_params.pageNo === 1) this.missionMessageList = [];
        if (!res.data.length || res.data.length < this.pageSize) {
          this.isNoMore = true;
        }
        this.missionMessageList = this.missionMessageList.concat(res.data);
        this.loading = false;
        return res;
      });
    },
    loadMoreMissionMessage() {
      let isLoading = false;
      if (isLoading || this.isNoMore) return;
      isLoading = true;
      this.loadIndex++;
      this.fetchMissionMessageList({
        pageSize: this.pageSize,
        pageNo: this.loadIndex
      }).then(res => {
        isLoading = false;
      });
    },
    loadMoreMessage() {
      let isLoading = false;
      if (isLoading || this.isNoMessagaMore) return;
      isLoading = true;
      this.loadMessageIndex++;
      // this.loading = true;
      // const unitId = JSON.parse(sessionStorage.getItem('last_login')).id;
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("user_login")).unitId,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        missionId: this.missionId,
        taskInstanceWorkFlowIds: this.taskInstanceWorkFlowIds
          ? [this.taskInstanceWorkFlowIds]
          : [],
        isAlert: this.isAlert,
        isMe: this.isMe,
        hasPic: this.isImg_File,
        pageNo: this.loadMessageIndex,
        pageSize: this.pageSize
      };
      getMessageList(params).then(res => {
        this.loading = false;
        isLoading = false;
        const oldHeight = this.$el.querySelector("#chatContainer").scrollHeight;
        if (!res.data.length || res.data.length < this.pageSize) {
          this.isNoMessagaMore = true;
        }
        res.data = res.data.reverse();
        this.messageList = res.data.concat(this.messageList);
        this.$nextTick(() => {
          if (res.data.length) {
            const newHeight = this.$el.querySelector("#chatContainer")
              .scrollHeight;
            this.$el.querySelector("#chatContainer").scrollTop =
              newHeight - oldHeight;
          }
        });
      });
    },
    // 回复添加消息
    handleReplyMessage(options) {
      this.isSubmit = false;
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        missionId: this.missionId,
        ...options,
        taskInstanceWorkFlowId:
          options.taskInstanceWorkFlowId || this.taskInstanceWorkFlowIds,
        replyMessageId: this.replyMessageId || ""
      };
      if (this.isEdit) {
        params.messageId = options.id;
        this.handleEditMessage(params);
        return;
      }
      addMessage(params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("发送消息成功");
          this.isSubmit = true;
          this.resplyMsgItem = {};
          this.replyMessageId = "";
        }
      });
    },
    // 修改消息
    handleEditMessage(params) {
      editMessage(params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("修改消息成功");
          this.isEdit = false;
          this.isSubmit = true;
          this.resplyMsgItem = {};
          this.replyMessageId = "";
        }
      });
    },
    // deleteMsg
    deleteMsg(item) {
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
            missionId: this.missionId,
            messageId: item.id,
            userId: JSON.parse(sessionStorage.getItem("user_login")).userId
          };
          deleteMessage(params).then(res => {
            if (res.data.code === 0) {
              const index = this.messageList.findIndex(Item => {
                return Item.id === item.id;
              });
              // //console.log(index)
              this.messageList.splice(index, 1);
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {});
    },
    // 获取消息列表
    fetchMessageList(missionId, index, item) {
      // 判断权限
       var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.list") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.isShow= false;
        // this.$message.error("抱歉，您没有操作权限");
      }

      if (item && item.cancel === 1) {
        return;
      }
      // this.loading = true;
      this.isSubmit = false;
      this.isNoMessagaMore = false;
      if (item && item.cancel === 1) {
        this.isCancelMsg = true;
      } else {
        this.isCancelMsg = false;
      }
      const taskInstanceWorkFlowIdArr = [];
      if (typeof index === "number") {
        this.activeIndex = index;
        this.missionMessageList[index].unReadCount = 0;
      }
      if (missionId && missionId !== "object") {
        this.missionId = missionId;
      }
      // for (let item of this.missionMessageList[index]['taskInstanceWorkflows']) {
      //     taskInstanceWorkFlowIdArr.push(item.id);
      // }
      const unitId = JSON.parse(sessionStorage.getItem("last_login")).id;
      const params = {
        unitId: unitId,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        missionId: this.missionId,
        taskInstanceWorkFlowIds: this.taskInstanceWorkFlowIds
          ? [this.taskInstanceWorkFlowIds]
          : [],
        isAlert: this.isAlert,
        isMe: this.isMe,
        pageNo: 1,
        pageSize: this.pageSize,
        hasPic: this.isImg_File
      };
      getMessageList(params).then(res => {
        // res.data.map(item => {
        //     item.userName = this.filterSenderName(item.senderName);
        // })
        this.loadMessageIndex = 1;
        this.showCenter = true;
        this.showRight = true;
        res.data = res.data.reverse();
        if (res.data.length) res.data[0].isFirst = true; // 记录每条数据第一条
        this.messageList = res.data;
        this.msgContentShow = true;
        this.resplyMsgItem = {};
        this.replyMessageId = "";
        this.fetchNodeList(this.missionId);
        this.fetchPersonList();
        this.fetchFacMission(unitId, this.missionId);
        this.loading = false;
        this.$nextTick(() => {
          var container = this.$el.querySelector("#chatContainer");
          // console.log(container);
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
        if (
          this.$route.query.missionId &&
          this.missionId === this.$route.query.missionId
        ) {
          this.$router.push({
            path: "/DataNodeDetail",
            query: {
              id: this.$route.query.id,
              missionId: this.$route.query.missionId
            }
          });
          return;
        }
        this.$router.push("/serviceMission?id=" + this.missionId);
      });
    },
    // filterSenderName(name) {
    //     if (name) {
    //         if (name.length > 2) {
    //             name = name.substr(name.length - 2);
    //         }
    //         return name
    //     }
    // },
    handleCheck(val) {
      this.fetchMessageList();
    },
    handleSeclectNodeId(val) {
      // this.taskInstanceWorkFlowIds = val;
      this.staticNodeIds = [];
      this.staticPersonIds = [];
      this.staticNodeIds.push(val);
      this.fetchPersonListByNodeId(val).then(res => {
        this.staticPersonIds = res.data;
      });
      this.fetchMessageList(this.missionId, this.activeIndex);
    },
    handleSelectNode(item) {
      this.fetchPersonListByNodeId(item.instanceWorkflowId).then(res => {
        for (let idItem of res.data) {
          const has = this.staticPersonIds.some(item => {
            return item === idItem;
          });
          if (!has) {
            this.staticPersonIds.push(idItem);
          }
        }
      });
    },
    // 根据节点id获取关联人员
    fetchPersonListByNodeId(taskInstanceWorkflowId) {
      const params = {
        taskInstanceWorkflowId: taskInstanceWorkflowId
      };
      return getLeadersOfNode(params).then(res => {
        return res;
      });
    },
    // 任务信息查询
    fetchFacMission(facId, missionId) {
      const params = {
        facId: facId,
        missionId: missionId
      };
      getFacMission(params).then(res => {
        //console.log('任务信息查询', res.data)
        this.missionInfo = res.data;
      });
    },
    // 获取关联人员列表
    fetchPersonList() {
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      };
      getPersonList(params).then(res => {
        //console.log('获取关联人员列表', res.data);
        this.personList = res.data;
      });
    },
    // 获取关联节点
    fetchNodeList(missionId) {
      const params = {
        missionId: missionId
      };
      getNodeList(params).then(res => {
        //console.log('获取关联关联节点', res.data)
        this.nodeList = res.data;
        this.nodeOptions = res.data;
      });
    },
    viewNodeDetail(item, index) {
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
      this.viewDetailIndex = index;
      this.$router.push(
        `OrderDetailed?missionId=${this.missionId}&instanceWorkflowId=${
          item.nodeId
        }`
      );
    },
    getMsgItem(item, isEdit) {
      //console.log(item);
      if (isEdit) {
        item.isEdit = true;
        this.isEdit = true;
      } else {
        this.staticPersonIds = [];
        //console.log(item.notifyUsers, item.senderId)
        for (let user of item.notifyUsers) {
          if (!this.staticPersonIds.includes(user.id)) {
            this.staticPersonIds.push(user.id);
          }
        }
        if (!this.staticPersonIds.includes(item.senderId)) {
          this.staticPersonIds.push(item.senderId);
        }
      }
      this.resplyMsgItem = item;
      this.replyMessageId = item.id;
      this.textFocus = !this.textFocus;
    }
  },
  components: {
    LeftItem: LeftItem,
    CenterItem: CenterItem,
    SendForm,
    previewImg
  }
};
</script>

<style scoped lang="scss">
.gray * {
  opacity: 0.5;
}
.service-section {
  display: flex;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // div.scroll {
  //     // width: 30%;
  //     flex: 1;
  //     background: #fff;
  //     overflow-y: auto;
  //     &::-webkit-scrollbar {
  //         width: 6px;
  //         height: 6px;
  //     }
  //     &::-webkit-scrollbar-thumb {
  //         background-color: #c2c2c2;
  //         background-clip: padding-box;
  //         min-height: 28px;
  //     }
  //     &::-webkit-scrollbar-track-piece {
  //         background-color: #FFF;
  //     }
  // }
  .service-left {
    width: 320px;
    display: flex;
    flex-direction: column;
    // overflow-y: auto;
    background: #fff;
  }
  .is-active {
    background: #faf6f0;
  }
  .is-default-active {
    background: #fcfbfa;
  }
  .no-more-data {
    line-height: 50px;
    color: #cccccc;
    text-align: center;
    font-size: 14px;
  }
  .service-center {
    // flex: 1;
    display: flex;
    flex-direction: column;
    width: 360px;
    margin: 0 15px;
    background: #fff;
  }
  .service-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    overflow: hidden;
    section {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
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
}
.left-header,
.right-header,
.center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.service-header {
  padding: 18px 16px;
  // overflow: hidden;
  border-bottom: 1px solid #e6e8eb;
}
.service-title {
  text-indent: 14px;
  font-size: 20px;
  border-left: 6px solid #ff9c38;
}
.search-bar {
  width: 180px;
}
.filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
}
.count-down {
  font-size: 16px;
  color: #ff8138;
  &.green {
    color: #37bd0e;
  }
  &.red {
    color: #f03535;
  }
}
.detail-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 20px;
  p {
    width: 50%;
    margin-top: 16px;
    font-size: 14px;
    line-height: 18px;
    color: #636363;
  }
  .good-name {
    display: flex;
    .name-detail {
      flex: 1;
    }
    // justify-content:
  }
}
.modal,
.preview-img {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.modal {
  position: fixed;
  z-index: 999999;
  .preview-img {
    position: absolute;
    display: flex;
    background: rgba(0, 0, 0, 0.8);
    img {
      max-width: 90%;
      max-height: 90%;
      margin: auto;
    }
  }
}
</style>
<style lang="scss">
.service-section {
  .index {
    .el-dialog--small {
      background-color: transparent;
      width: 100%;
      top: 5% !important;
    }
    .el-dialog__body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-dialog__headerbtn .el-dialog__close {
      font-size: 24px;
      position: absolute;
      right: 60px;
      top: -18px;
      z-index: -1;
    }
    .imgs {
      height: 600px;
      display: flex;
      transition: all 1s;
      justify-content: center;
      align-items: center;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
      width: 800px;
      img {
        max-width: 700px;
        max-height: 700px;
      }
    }
    .el-icon-arrow-left {
      font-size: 48px;
      color: #ccc;
      &:hover {
        color: #fff;
      }
    }
    .el-icon-arrow-right {
      font-size: 48px;
      color: #ccc;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.img-show {
  .el-dialog--small {
    background-color: transparent;
    width: 100%;
    top: 5% !important;
  }
  .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
    position: absolute;
    right: 60px;
    z-index: -1;
    top: -18px;
  }
  .imgs {
    height: 600px;
    display: flex;
    transition: all 1s;
    justify-content: center;
    align-items: center;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    width: 800px;
    img {
      max-width: 700px;
      max-height: 700px;
    }
  }
  .el-icon-arrow-left {
    font-size: 48px;
    color: #ccc;
    &:hover {
      color: #fff;
    }
  }
  .el-icon-arrow-right {
    font-size: 48px;
    color: #ccc;
    &:hover {
      color: #fff;
    }
  }
  // .el-dialog__wrapper{
  //     z-index: 9999 !important;
  // }
}
</style>
