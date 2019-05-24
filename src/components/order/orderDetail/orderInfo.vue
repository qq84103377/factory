<template>
    <content-wrap
        class="order-info"
        :title="`工单信息：${orderTitle}`"
        type="big">
        <div class="order-info-cancel" v-if="orderData.cancel==1"></div>
        <div v-if="orderData.cancel==1">
            <img src="../../../../static/images/pic-cancel.png" class="undone">
        </div>
        <div class="order-info-title" slot="headRight">
            <div class="order-info-status order-status">
                <span class="order-status-finish null-color" v-if="!orderData.status">未填写</span>
                <span v-if="orderData.status">
                    <span class="order-status-ongoing"
                            v-if="orderData.status > 0">交货倒计时 {{ orderData.status }} 天</span>
                    <span class="order-status-finish" v-if="orderData.status == '已完成'">{{ orderData.status }}</span>
                    <span class="order-status-delay"
                        v-if="orderData.status < 0 && !orderData.delayNotify">延误 {{ Math.abs(orderData.status) }} 天</span>
                </span>
            </div>
        </div>
        <div class="order-info__content">
            <el-row type="flex">
                <img @click="handlePreviewImg" style="cursor: pointer;" class="good-img" :src="orderData.goodsPictureUrl" v-errorLogo alt="">
                <div class="info-detail">
                    <div class="info-detail-row">
                        <div class="info-detail-item">
                            <span class="label">商品</span>
                            <p :class="{'null-color': !orderData.styleNo}">{{ orderData.styleNo || '未填写' }}{{orderData.styleName !== '未填写' && orderData.styleName?'-'+orderData.styleName:''}}</p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">客户</span>
                            <p :class="{'null-color': !orderData.custName}">{{ orderData.custName || '未填写' }}</p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">制单日期</span>
                            <p :class="{'null-color': !orderData.placeorderAt}">{{ orderData.placeorderAt || '未填写' }}</p>
                        </div>
                        <div v-if="orderData.outSideFlag" class="info-detail-item">
                            <span class="label">外发厂</span>
                            <p :class="{'null-color': !orderData.outSideFactoryName}">{{ orderData.outSideFactoryName || '未填写' }}</p>
                        </div>
                        <div style="font-size:16px;display:flex;justify-content:flex-end;position: absolute;right: 0;" class="info-detail-item">
                           优先级：{{ getPriority }}
                           <icon @click="changeDatapriority" style="margin-left:6px;cursor:pointer;" w="16" h="16" type="icon-edit"></icon>
                        </div>
                    </div>
                    <div class="info-detail-row info-detail-row__last-child">
                        <div class="info-detail-item">
                            <span class="label">订货数量</span>
                            <p :class="{'null-color': !orderData.nums}">{{ orderData.nums || '未填写' }}</p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">负责人</span>
                            <p :class="{'null-color': !orderData.leaders}">{{ orderData.leaders | filterLeader}}</p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">交货日期</span>
                            <p :class="{'null-color': !orderData.deliveryAt}">{{ orderData.deliveryAt || '未填写' }}<span style="color:#f03535" v-if="orderData.updateDeliveryDateCount">（修改{{orderData.updateDeliveryDateCount}}次）</span></p>
                        </div>
                        <div v-if="orderData.outSideFlag" class="info-detail-item">
                            <span class="label">加工单价</span>
                            <p :class="{'null-color': !orderData.outSideFactoryName}">¥{{ orderData.machiningUnitPrice || '未填写' }}</p>
                        </div>
                    </div>
                    <div class="info-detail-row info-detail-row__last-child">
                        <div class="info-detail-item" v-if="orderData.lathes">
                            <span class="label">床次</span>
                            <p>{{ orderData.lathes }}</p>
                        </div>
                        <el-row type="flex" class="info-detail-item">
                            <span style="color:#a2abb8;margin-right: 16px;width: 80px;text-align: right" class="label">备注</span>
                            <p v-if="orderData.remark" style="color:red;display:inline-block;flex: 1">{{orderData.remark}}</p>
                            <p v-else class="null-color" style="display:inline-block;">未设置</p>
                        </el-row>
                        <div class="info-detail-item" style="white-space: nowrap">
                            <span class="label">供应商</span>
                            <p :class="{'issupplier': orderData.supplierName==null}">{{ orderData.supplierName?orderData.supplierName:"无" }}</p>
                        </div>
                        <div class="info-detail-item" v-if="orderData.facPrdOrderNo">
                            <span class="label">关联订单</span>
                            <p >{{ orderData.facPrdOrderNo}}</p>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
        <div  style="margin:16px 0 0 0;display:flex;justify-content:space-between;">
            <div >
                <nf-button v-if="orderData.missionWymNodeId" style="margin-right:15px;background:#939fb8;color:#fff;width:132px;"
                @click="$router.push(`/missionWym?instanceId=${orderData.missionWymNodeId}&missionId=${orderData.id}`)">
                    查看所有唯一码
                </nf-button>
                <nf-button style="margin-right:15px;background:#939fb8;color:#fff;width:132px;"
                           @click="allReportBill(orderData.id)">
                    查看所有单据
                </nf-button>
            </div>
            <div class="edit">
                <nf-button svg="icon-order-status" @click="handleOrderBtn" style="margin-right:12px;">工单状态</nf-button>
                <span class="btn-prints" style="margin-right:12px;position:relative;">
                    <span style="font-size:14px;" @click="defaultPrint"><icon style="margin-right:4px;" type="icon-print"></icon>打印工单</span>
                    <div class="printList">
                        <ul>
                            <li style="text-align:left;padding:0 12px 12px;font-size:14px;">选择工单打印模板</li>
                            <li class="print-list-li" v-for="(item1,index) of printList" :key="index">
                                <span :class="{'oldSelect':item1.oldSelect==1}">{{item1.name}}</span>
                                <span :class="{'oldSelect':item1.oldSelect==1}" class="el-icon-check"></span>
                                <div @click="printSelect(item1)" class="btn-li-print">按此模板打印</div>
                            </li>
                        </ul>
                    </div>
                </span>
                <nf-button svg="icon-edit1" v-if="orderData.cancel==0" @click="goToEdit()">编辑
                </nf-button>
                <div style="margin-left:12px;">
                    <nf-button style="cursor: pointer;" @click="isCollapse = !isCollapse">展开更多
                        <i class="el-icon-arrow-down" :class="{'rotate': isCollapse}"></i>
                    </nf-button>
                </div>
            </div>
        </div>
        <div class="order-info__content">
            <el-row class="table" v-show="isCollapse || orderData.cancel==1">
                <template v-if="metadatas && quantities">
                    <nf-sku-table
                        ref="nfskutable"
                        :show-num="true"
                        :metadatas="metadatas"
                        :quantities="quantities"
                        style="margin: 20px 0">
                    </nf-sku-table>
                </template>
                <div class="info-detail customer-detail">
                    <div class="info-detail-row">
                        <div class="info-detail-item">
                            <span class="label">客户款号</span>
                            <p :class="{'null-color': !orderData.customerSytleNo}">{{ orderData.customerSytleNo || '未填写' }}</p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">客户订单号</span>
                            <p :class="{'null-color': !orderData.customerOrderNo}">{{ orderData.customerOrderNo || '未填写' }}</p>
                        </div>
                    </div>
                </div>
                <div class="order-info__content">
                    <el-row class="table" v-show="true || orderData.cancel==1">
                        <div class="working-sheet" v-if="orderData.processForm && orderData.processForm.content">
                            <span style="font-size:16px;" :style="{color: !orderData.processForm.name && '#c4c6cc'}">工艺单: {{ orderData.processForm.name || '未填写' }}</span>
                            <nf-button @click="checkPdf">
                                <span v-if="!isLoading">查看工艺单</span>
                                <span v-if="isLoading">正在读取文件...</span>
                            </nf-button>
                        </div>
                        <div
                                class="working-sheet-detail"
                                v-if="orderData.processForm && orderData.processForm.content"
                                v-html="orderData.processForm.content">
                        </div>
                        <attachment
                                :attachData="orderData.processForm.attachments"
                                :isShowClose="false"></attachment>
                    </el-row>
                </div>
                <div class="recordRescheduling" v-if="orderData.deliveryDateLogs&&orderData.deliveryDateLogs.length">
                    <h4 style="margin: 20px 0;">改期记录</h4>
                    <el-table
                            border
                            :data="orderData.deliveryDateLogs"
                            style="width: 602px">
                        <el-table-column
                                prop="date"
                                label="序号"
                                width="60">
                            <template slot-scope="scope">
                                <span>{{scope.$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="updateDate"
                                label="修改时间"
                                width="100">
                            <template slot-scope="scope">
                                <span>{{filterTime(scope.row.updateDate)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="updaterName"
                                label="修改人">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="beforeUpdateDate"
                                label="修改前交期">
                            <template slot-scope="scope">
                                <span>{{filterTime(scope.row.beforeUpdateDate)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="140"
                                prop="beforeUpdateStatus"
                                label="修改前工单状态">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="afterUpdateDate"
                                label="修改后交期">
                            <template slot-scope="scope">
                                <span>{{filterTime(scope.row.afterUpdateDate)}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-row>
        </div>
        <el-dialog
        :visible.sync="priority"
        :show-close="false"
        size="tiny">
            <div style="text-align:center;font-size:20px;" slot="title">修改优先级</div>
            <div class="select-priority">
                优先级：
                <el-select v-model="priorityId">
                    <el-option v-for="item in priorityList" :key="item.value" :value="item.value" :label="item.label">
                    </el-option>
                </el-select>
            </div>
            <div align="center" slot="footer">
                <nf-button  @click="priority =false">取消
                </nf-button>
                <nf-button type="warning" @click="selectPriority">确定
                </nf-button>
            </div>
        </el-dialog>

        <el-dialog
                class="order-status-dialog"
                title="修改工单状态"
                :visible.sync="orderDialogVisible"
                size="tiny">
            <ul class="status-list">
                <li :class="{selected:orderStatus === 'WAIT_START' }">
                    <div class="img-wrap" @click="changeStatusClick('WAIT_START')">
                        <p class="status-b-icon"><icon type="icon-gongdan-jiedianweikaishi-da"></icon></p>
                        <p class="status-s-icon"><icon type="icon-trianglehook"></icon></p>
                    </div>
                    <p class="status-text">未开始</p>
                </li>
                <li :class="{selected:orderStatus === 'ONGOING' }">
                    <div class="img-wrap" @click="changeStatusClick('ONGOING')">
                        <p class="status-b-icon"><icon type="icon-gongdan-jiedianjinxingzhong-da"></icon></p>
                        <p class="status-s-icon"><icon type="icon-trianglehook"></icon></p>
                    </div>
                    <p class="status-text">进行中</p>
                </li>
                <li :class="{selected:orderStatus === 'FINISH'}">
                    <div class="img-wrap" @click="changeStatusClick('FINISH')">
                        <p class="status-b-icon"><icon type="icon-gongdan-jiedianyiwancheng-da"></icon></p>
                        <p class="status-s-icon"><icon type="icon-trianglehook"></icon></p>
                    </div>
                    <p class="status-text">已完成</p>
                </li>
            </ul>
            <p class="status-prompt" v-if="orderStatus === 'FINISH'">注意：工单设为已完成后，将自动完成工单下所有未完成节点，此操作不可逆。</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelOrderStatus">取 消</el-button>
                <el-button type="primary" :loading="isloading" @click="commitOrderStatus">确 定</el-button>
            </span>
        </el-dialog>

        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>


    </content-wrap>
</template>

<script>
import {
    getFacGoodsPictureList,
  getPrintTemplatesByType,
  templatePrinttig,
  previewCommonProcessForm,
  changePriority,
  changeOrderStatus,
  facTemplates
} from "@/api";
import Attachment from "../../goods/child/attachEdit";
import ServiceTable from "../../service/serviceTable";
export default {
  props: {
    orderData: {},
    quantities: [],
    metadatas: []
  },
  data() {
    return {
        previewList: [],
        orderTitle:'',
      printList: [],
      isCollapse: false,
      isLoading: false,
      userId: "",
      sign:'0',
      priority:false,
      priorityId:"",
      priorityList:[
          {
              value:"0",
              label:"普通"
          },
          {
              value:"1",
              label:"加急"
          },
          {
              value:"2",
              label:"特急"
          }
      ],
      orderDialogVisible:false,
      orderStatus:this.orderData.missionStatus,     //工单状态
      isloading: false,   //防止多次点击
    };
  },
    // 优先级
    computed:{
      getPriority: function(){
          if(this.orderData.priority === 0){
              return "普通"
          }else if(this.orderData.priority === 1){
              return "加急"
          }else if(this.orderData.priority === 2){
              return "特急"
          }
      },
    },
    watch:{
        //从orderData中获取工单状态
        orderData:function(val){
            this.orderStatus = val.missionStatus;
            this.orderTitle = val.orderNo;
        }
    },
  filters: {
    filterLeader(val) {
      // console.warn(val);
      if (val == "null") {
        return "未填写";
      } else {
        return val;
      }
    }
  },
  components: {
    Attachment,
    ServiceTable
  },
  created() {
    this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId;
    this.getPrintTemplatesByType();
  },
  methods: {
      filterTime(val){
          return val.slice(0,10)
      },
      // 预览图片
      handlePreviewImg() {
          getFacGoodsPictureList({
              facId: JSON.parse(sessionStorage.getItem("last_login")).id,
              goodsId: this.orderData.goodsId
          }).then(res => {
              if (!res.data.goodsPictureUrls.length) return;
              this.previewList = res.data.goodsPictureUrls.map(item => {
                  return {
                      path: item
                  }
              });
              this.$nextTick(() => {
                  this.$refs["previewer"].show(0);
              });
          });
      },
    //工单状态弹窗
    handleOrderBtn(){
        this.orderStatus = this.orderData.missionStatus;
        this.orderDialogVisible = true;
    },
    //工单状态弹窗改变状态
    changeStatusClick(val){
        this.orderStatus = val;
    },
    //关闭工单状态弹窗
    cancelOrderStatus(){
        this.orderDialogVisible = false;
    },
    //提交工单状态
    commitOrderStatus(){
        this.isloading = true;
        let orderId = '';
        if(this.orderData.id){
            orderId = this.orderData.id
        }
        let params = {
            missionId: orderId,
            missionStatus: this.orderStatus
        };
        changeOrderStatus(params).then(res => {
            if(res.data.code === 0){
                this.$message.success("提交成功");
                this.$emit("refreshAll");
            }else{
                this.$message.error(res.data.msg);
            }
            this.orderDialogVisible = false;
            this.isloading = false;
        });
    },
    selectPriority() {
        let params = {
            priorityId:this.priorityId,
            missionId: this.$route.query.missionId
        };
        changePriority(params).then(
            res=> {
                if(res.data.code==0) {
                    this.$message.success("修改成功");
                    this.$emit("updateInfo")
                    this.priority=false;
                }else{
                    this.$message.success(res.data.msg);
                }
            }
        )
    },
    changeDatapriority() {
        this.priority = true;
    },
    goToEdit() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.update") {
            this.sign = "1";
          }
        }
      }
      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.$store.dispatch('deleteVisitedLive', 'EditOrder');
      //编辑页面
      this.$nextTick(() => {
        this.$router.push(`/editOrder?missionId=${this.$route.query.missionId}`);
        })
    },
    defaultPrint() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.print") {
            this.sign = "1";
          }
        }
      }

      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }

      for (let i = 0; i < this.printList.length; i++) {
        if (this.printList[i].oldSelect == 1) {
          let params = {
            token: "",
            tempId: this.printList[i].id,
            missionId: this.$route.query.missionId,
            userId: this.userId
          };
          templatePrinttig(params).then(res => {
            localStorage.setItem(
              "printHtml",
              JSON.stringify(res.data.templateContent)
            );
          });
          window.open(
            "/#/printShow" +
              "?tempId=" +
              this.printList[i].id +
              "&missionId=" +
              this.$route.query.missionId +
              "&printType=missionPrint"
          );
        }
      }
    },
    printSelect(item) {

       var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist) {
        for (let i = 0; i < datalist.length; i++) {
          if (datalist[i] == "fac.mission.print") {
            this.sign = "1";
          }
        }
      }

      if (this.sign == "0" || !datalist) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
    console.log(this.$route.query.missionId,'this.$router.query.missionId')
      let params = {
        token: "",
        tempId: item.id,
        missionId: this.$route.query.missionId,
        userId: this.$store.state.userInfo.id
      };
      templatePrinttig(params).then(res => {
        localStorage.setItem(
          "printHtml",
          JSON.stringify(res.data.templateContent)
        );
      });
      window.open(
        "/#/printShow" +
          "?tempId=" +
          item.id +
          "&missionId=" +
          this.$route.query.missionId +
          "&printType=missionPrint"
      );
    },
    getPrintTemplatesByType() {
    //   let params = {
    //     token: "",
    //     facId: "",
    //     userId: this.userId,
    //     facId: JSON.parse(sessionStorage.getItem("user_login")).unitId,
    //     keyword: "",
    //     typeId: "12ff74aae4fe49eaa930934241b61f1e"
    //   };
    //   getPrintTemplatesByType(params).then(res => {
    //     this.printList = res.data;
    //   });
        let params = {
            userId: this.userId,
            unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
            type: 'mission',
            pageNo: 1,
            pageSize: 9999,
            using:true,
            typeId:''
        }
        facTemplates(params).then(res => {
            this.printList = res.data.data.list
        })
    },
    checkPdf() {
      this.isLoading = true;
      let params = {
        id: this.orderData.processForm.id,
        name: this.orderData.processForm.name,
        content: this.orderData.processForm.content,
        userId: this.userId,
        attachments: this.orderData.processForm.attachments
      };
      previewCommonProcessForm(params).then(res => {
        if (res.data.code == 0) {
          window.open(res.data.previewURL);
        }
        this.isLoading = false;
      });
    },
    allReportBill(id){
        // 权限
        if(!this.powerJudgement.permissions("fac.mission.report.view")){
            return
        }
        this.$router.push(`/allReportBill?missionId=${id}`)
    }
  }
};
</script>

<style lang="scss" scoped>
.order-info {
    padding: 24px 32px 14px;
    border-radius: 2px;
    background-color: #ffffff;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
    position: relative;
    &-title,
    &-status {
        display: inline-block;
    }
    &-title {
        vertical-align: bottom;
        font-size: 20px;
    }
    &-status {
        margin-left: 32px;
        font-size: 20px;
    }
    &__content {
        .good-img {
        width: 80px;
        height: 80px;
        }
        .info-detail {
        flex: 1;
        }
        .info-detail-row {
        display: flex;
        }
        .info-detail-row__last-child {
        margin-top: 12px;
        }
        .info-detail-item {
        width: 25%;
        .issupplier{
                color: #a2abb8;
            }
        &.collapse-item {
            width:110px;
            height:48px;
            border: 1px solid #dce0e6;
            text-align: right;
            font-size: 14px;
            color: #808080;
        }
        p {
            display: inline-block;
            color: #3b3b3b;
        }
        .null-color {
            color: #c4c6cc;
        }
        .label {
            display: inline-block;
            width: 80px;
            margin-right: 16px;
            text-align: right;
            font-size: 14px;
            color: #a2abb8;
        }
        }
        .table {
        .info-detail-row {
            margin-left: -25px;
        }
        .working-sheet {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 12px;
            padding: 12px 0;
            border-top: 1px solid #e6eaf0;
            span {
            font-size: 14px;
            }
        }
        .working-sheet-detail {
            padding: 16px;
            text-align: left;
            border: 1px solid #e6eaf0;
        }
        }
    }
    .order-info-cancel {
        z-index: 10;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: #fff;
        opacity: 0.6;
    }
    .undone {
        box-sizing: border-box;
        position: absolute;
        right: 4%;
        top: 10%;
        z-index: 11;
        text-align: center;
        line-height: 40px;
        display: inline;
        border-radius: 2px;
        font-family: MicrosoftYaHei;
        font-size: 20px;
        color: #a0acbd;
    }
    .order-status-ongoing {
        color: #ff8138;
    }
    .order-status-finish {
        color: #37bd0e;
    }
    .order-status-delay {
        color: #f03535;
    }
    .edit {
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        a {
        font-size: 14px;
        text-align: center;
        line-height: 36px;
        display: inline-block;
        width: 104px;
        height: 36px;
        border-radius: 2px;
        }
        .btn-prints {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border-radius: 2px;
        width: 130px;
        height: 34px;
        color: #808080;
        border: solid 1px #dce0e6;
        cursor: pointer;

        &:hover {
            border-color: #adafb3;
            background: #fafafa;
            .printList {
            display: block;
            }
        }
        .printList {
            background-color: pink;
            min-width: 290px;
            min-height: 110px;
            position: absolute;
            left: -163px;
            top: 40px;
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
            border: solid 1px #d0d2d6;
            border-radius: 2px;
            background-color: #ffffff;
            display: none;
            padding: 8px 0;
            z-index: 999;

            .el-icon-check {
            display: none;
            }
            ul {
            height: 196px;
            overflow-y: auto;
            background-color: #fff;
            }
        }
        .print-list-li {
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #2c2c2c;
            padding: 0 12px;
            position: relative;

            &:hover {
            background-color: #f5f7fa;
            }

            &:hover .btn-li-print {
            display: flex;
            }

            .oldSelect {
            display: inline-block;
            color: #ff8138;
            }

            .btn-li-print {
            width: 82px;
            height: 28px;
            font-size: 12px;
            border: 1px solid #d0d2d6;
            display: none;
            position: absolute;
            right: 12px;
            background-color: #fff;
            align-items: center;
            justify-content: center;
            color: #636363;
            cursor: pointer;
            }
        }
        }
    }
    .el-icon-arrow-down {
        transition: transform 0.3s;
    }
    .rotate {
        transform: rotate(180deg);
    }
    .select-priority {
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .order-status-dialog{
        .status-list{
            overflow: hidden;
            li{
                float: left;
                margin:25px;
                &.selected{
                    .img-wrap{
                        border: 1px solid #FFA914;
                        .status-s-icon{
                            display: block;
                        }
                    }
                }
                .img-wrap{
                    position: relative;
                    width: 98px;
                    line-height: 98px;
                    border-radius: 2px;
                    text-align: center;
                    border: 1px solid #DFE6EC;
                    cursor: pointer;
                    &:hover{
                        border: 1px solid #FFA914;
                    }
                    .status-b-icon{
                        width: 40px;
                        margin: 0 auto;
                        .icon{
                            width: 40px !important;
                            height: 40px !important;
                        }
                    }
                    .status-s-icon{
                        display: none;
                        position: absolute;
                        right: 0px;
                        bottom: -1px;
                        line-height: 35px;
                        .icon{
                            width: 35px !important;
                            height: 35px !important;
                        }
                    }
                }
                .status-text{
                    font-size: 14px;
                    color: #3B3B3B;
                    text-align: center;
                    margin-top: 12px;
                }
            }
        }
        .status-prompt{
            font-size: 12px;
            color: #FA4150;
            margin-bottom: 25px;
            text-align: center;
        }
    }
}
</style>
<style lang="scss">
    .working-sheet-detail {
        p {
            font-size:14px !important;
            line-height:18px;
            color:#3b3b3b;
        }
        span {
            font-size:14px !important;
            line-height:18px;
            color:#3b3b3b;
        }
        img{
            max-width:100%;
        }
    }
    .select-priority .el-input__inner {
        width:250px;
    }
    .order-info{
        .order-status-dialog{
            .el-dialog--tiny{
                width: 500px;
            }
            .el-dialog__header{
                padding:20px;
                text-align: center;
            }
            .el-dialog__body{
                padding: 0 25px;
                border-top: 1px solid #DFE6EC;
                border-bottom: 1px solid #DFE6EC;
            }
            .el-dialog__footer{
                padding: 15px;
                .el-button{
                    font-size: 12px;
                }
                text-align: center;
            }
        }
        .edit {
            .icon{
                width: 18px;
                height: 18px;
                vertical-align: text-bottom;
            }
        }
    }
</style>
