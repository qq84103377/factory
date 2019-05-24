<template>
  <div>
    <section>
      <div v-if="from==='clothesFileBom'">
        <nf-button style="width: 94px;height: 36px;padding: 0;" @click="addEditBomNeedData">编辑BOM表
        </nf-button>
      </div>
      <div v-else>
        <div
          v-if="boomAllData"
          class="auto-bom"
          id="goods-bom">
          <div v-if="!isOperationRecord">
            <div class="title-btns">
              <p class="base-info">
                <span class="line"></span>{{boomAllData.name}}
                <span v-if="bomReviewConfig && from === 'goodsFile'">({{boomAllData.reviewStatusText}})</span>
                <span v-if="bomReviewConfig && from === 'goodsFile'" style="margin-left: 200px;">审核备注：{{boomAllData.reviewRemark}}</span>
              </p>
              <div>
                <!--审核状态(0:草稿，1：待审核，2：审核通过，3：已驳回，4：反审待审批)-->
                <!-- 按货品SKU查看BOM按钮 -->
                <el-button
                  type="primary"
                  class="chk-bom"
                  :plain="true"
                  @click="onLoadeSkuBoomData">按货品SKU查看BOM
                </el-button>&nbsp;&nbsp;&nbsp;
                <!-- 编辑按钮 -->
                <nf-button
                  svg="icon-copy"
                  style="width: 98px;height: 36px;padding: 0;margin:0 2px;"
                  @click="copyBomNeedData">复制BOM
                </nf-button>
                <!-- 编辑按钮 -->
                <!--草稿和驳回-->
                <nf-button
                  v-if="from === 'designFile' || !bomReviewConfig || [0,3].indexOf(boomAllData.reviewStatus)>-1"
                  svg="icon-edit1"
                  style="width: 64px;height: 36px;padding: 0;"
                  @click="addEditBomNeedData">编辑
                </nf-button>
                <section v-if="bomReviewConfig" style="display: inline-block">
                  <nf-button
                    v-if="[0,3].indexOf(boomAllData.reviewStatus)>-1"
                    type="warning"
                    style="width: 64px;height: 36px;padding: 0;"
                    @click="bomTaskSubmit">提报
                  </nf-button>
                  <!--待审核 反审核待批准-->
                  <nf-button v-if="[1,4].indexOf(boomAllData.reviewStatus)>-1"  style="width: 64px;height: 36px;padding: 0;"
                    @click="bomTaskUndoStatus">
                    <span v-if="boomAllData.reviewStatus==1">撤回提报</span>
                    <span v-if="boomAllData.reviewStatus==4">撤回申请</span>
                  </nf-button>
                  <nf-button
                    v-if="[1,4].indexOf(boomAllData.reviewStatus)>-1 && boomAllData.assigneeIds.indexOf(userId)>-1"
                    type="warning"
                    style="width: 64px;height: 36px;padding: 0;"
                    @click="bomTaskReview(true)">{{boomAllData.reviewStatus===1?'通过':'批准'}}
                  </nf-button>
                  <nf-button
                    v-if="[1,4].indexOf(boomAllData.reviewStatus)>-1 && boomAllData.assigneeIds.indexOf(userId)>-1"
                    type="danger"
                    style="width: 64px;height: 36px;padding: 0;"
                    @click="bomTaskUnReview(boomAllData.reviewStatus)">{{boomAllData.reviewStatus===1?'驳回':'不批准'}}
                  </nf-button>
                  <!--已通过-->
                  <nf-button
                    v-if="boomAllData.reviewStatus===2"
                    type="warning"
                    style="width: 64px;height: 36px;padding: 0;"
                    @click="bomTaskUnReview(boomAllData.reviewStatus)">申请反审
                  </nf-button>
                </section>

              </div>
            </div>

            <!-- BOM表格组件 这个就是那个表格组件-->
            <goods-bom :bomData="boomAllData" flag="firstOrder" ></goods-bom>
            <!-- 按货品SKU查看BOM组件 -->
            <sku-bom-detail
              :allSkuData="allSkuData"
              :visible.sync='centerDialogVisibleBom'
              v-if="centerDialogVisibleBom">
            </sku-bom-detail>
            <div class="bomRecord" v-if="from === 'goodsFile'">
              <span class="fl">{{boomAllData.logTitle}}</span>
              <span class="fr" style="color: #1ca1ff;margin-left: 20px;cursor: pointer;text-decoration: underline"
                                  @click="isOperationRecordChange(true)">查看全部操作记录</span>
              <span class="fr">操作时间：{{boomAllData.opDate}}</span>
            </div>
          </div>
          <div v-else>
            <div>
              <span style="background-color: #666;color: #ffffff;padding: 10px;display: inline-block">{{boomAllData.name}}</span>
              <nf-button class="fr" @click="isOperationRecordChange(false)">返回</nf-button>
            </div>
            <content-wrap title="操作记录" style="margin: 14px 14px 0 14px;font-size: 16px;">
            </content-wrap>
            <div
              class="bomRecord"
              style="margin-top: 10px;margin-left: 26px;"
              v-for="item in bomTaskLogListData"
              :key="item.id">
              <span class="fl">{{item.logTitle}}</span>
              <span v-if="item.opType==='EDIT'" class="fr" style="color: #1ca1ff;margin-left: 20px;cursor: pointer;text-decoration: underline"
                                  @click="bomTaskLogDetail(item.id)">查看详情</span>
              <span class="fr">操作时间：{{item.dateCreated}}</span>
            </div>
            <el-row
              class="return-list__pagination"
              type="flex"
              justify="end"
              style="margin-top: 20px;">
              <el-pagination
                @current-change="isOperationRecordChange(true)"
                :current-page.sync="currentPage"
                :page-size="20"
                layout="total, prev, pager, next"
                :total="totalCount">
              </el-pagination>
            </el-row>
          </div>

        </div>
        <div v-else class="no-data">
          暂无 BOM表数据，请新建 BOM表
        </div>
        <!--bom操作记录详情-->
        <el-dialog
          class="custom-dialog"
          title="查看详情"
          :visible.sync="isRecordDetail"
          :close-on-click-modal="false"
          size="large">
          <!--<div class="text-center">-->
          <!-- BOM表格组件 这个就是那个表格组件-->
          <span class="beforeEdit">修改前的BOM</span>
          <div class="bomEditDiv">
            <content-wrap :title="bomDataEditBefore.name" style="margin-top: 10px;font-size: 16px;">
            </content-wrap>
            <div style="padding: 0 10px;margin-top: -10px;">
              <goods-bom :bomData="bomDataEditBefore" flag="firstOrder"></goods-bom>

            </div>
          </div>

          <span class="afterEdit">修改后的BOM</span>
          <div class="bomEditDiv">
            <content-wrap :title="bomDataEditAfter.name" style="margin-top: 10px;font-size: 16px;">
            </content-wrap>
            <div style="padding: 0 10px;margin-top: -10px;">
              <goods-bom :bomData="bomDataEditAfter" flag="firstOrder"></goods-bom>

            </div>
          </div>
          <!--</div>-->
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="isRecordDetail = false">关闭</el-button>
          </div>
        </el-dialog>
        <!--驳回弹窗-->
        <el-dialog
          :title="taskUnPassDialogTitle+'原因'"
          :close-on-click-modal="false"
          @close="applyAntiReviewDesc=''"
          class="custom-dialog unpass-dialog"
          :visible.sync="taskUnPassDialog">
          <div style="display: flex;">
            <el-input
              type="textarea"
              rows="6"
              v-model="applyAntiReviewDesc"
              :placeholder="'请输入'+taskUnPassDialogTitle+'原因'"></el-input>
          </div>
          <div slot="footer" class="dialog-footer">
            <nf-button @click="taskUnPassDialog = false">取消</nf-button>
            <nf-button
              type="warning"
              @click="taskUnPassSure"
              :loading="isloadingApply">确定</nf-button>
          </div>
        </el-dialog>

      </div>
      <!-- BOM编辑组件 -->
      <transition name="right-move">
        <create-bom-table
          :from="from"
          type="editor1"
          v-if="createBomTableVisible"
          :bomData="boomAllData"
          :title="title"
          :styleId="$route.query.id"
          @onSample="id => $emit('onSample',id)"
          :sampleId="sampleId"
          @isdelete="abolish"
          @cancel="cancel">
        </create-bom-table>
      </transition>
      <transition name="opcity">
        <div
          class="cover"
          v-if="createBomTableVisible"
          @click="cancel"></div>
      </transition>
    </section>
  </div>
</template>

<script>
import {
  skuCheakBoom,
  bomGoodsList,
  sampleDetailGoodsSkuBom,
  billReviewConfig,
  bomTaskSubmit,
  bomTaskReview,
  bomTaskApplyReview,
  bomTaskLogList,
  bomTaskLogDetail,
  bomTaskUndoStatus
} from "../../../api/api";
// import EditBomTable from "./EditBomTable.vue";
import SkuBomDetail from "@/components/order/orderBom/skuBomDetail.vue"; //按货品SKU查看BOM组件
import CreateBomTable from "./CreateBomTable.vue";
import goodsBom from "./goodsBom.vue"; //BOM表格组件
export default {
  props: ["boomAllData", "sampleId", 'from'],
  data() {
    return {
      currentPage: 1,
      totalCount: 1,
      bomTaskLogListData: [],
      bomDataEditBefore: [],
      bomDataEditAfter: [],
      taskUnPassDialog: false,
      isloadingApply: false,
      taskUnPassDialogTitle: '驳回',
      bomTaskUnReviewStatus: '',
      applyAntiReviewDesc: '',
      bomReviewConfig: false,
      isOperationRecord: false, //bom操作记录
      isRecordDetail: false, //bom操作记录详情
      createBomTableVisible: false, //判断编辑显示和隐藏
      title: '', //传入编辑组件表头文字
      centerDialogVisibleBom: false,
      allSkuData: [],
      materialsData: [],
      bomEditData: {}
    };
  },
  components: {
    SkuBomDetail, //按货品SKU查看BOM组件
    // EditBomTable,
    goodsBom, //BOM表格
    CreateBomTable, //编辑组件
  },
  watch: {
    h(val) {
      if (!this.timer) {
        this.h = val;
        this.timer = true;
        let that = this;
        setTimeout(() => {
          that.timer = false;
        }, 400);
      }
    }
  },
  methods: {
    bomTaskLogDetail(logId) {
      bomTaskLogDetail({
        logId
      }).then(res => {
        if (res.data.code === 0) {
          // console.log(res);
          this.isRecordDetail = true;
          this.bomDataEditBefore = res.data.data.editBefore;
          this.bomDataEditAfter = res.data.data.editAfter;
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //是否有审核台
    getBillReviewConfig() {
      billReviewConfig({
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      }).then(res => {
        // console.log(res);
        if (res.data.code === 0) {
          if (res.data.data.configs && res.data.data.configs.length > 0) {
            //是否有审核台
            this.bomReviewConfig = res.data.data.configs.some(v => v.billType == 'COMMON_BOM')

          }
        }
      })
    },
    //提报
    bomTaskSubmit() {
      let obj = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        id: this.boomAllData.id
      };
      bomTaskSubmit(obj).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg)
          // 成功重新渲染数据
          this.$emit('editor')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //撤回
    bomTaskUndoStatus() {
      let para = {
        id: this.boomAllData.id,
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      };
      bomTaskUndoStatus(para).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          // 成功重新渲染数据
          this.$emit('editor')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 通过和同意
    bomTaskReview(flag) {
      let obj = {
        id: this.boomAllData.id,
        taskId: this.boomAllData.taskId,
        result: flag, //通过(true)/驳回(false)
        message: "",
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      };
      bomTaskReview(obj).then(res => {
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          // 成功重新渲染数据
          this.$emit('editor')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    //驳回和拒绝
    bomTaskUnReview(status) {
      // 权限
      if (!this.powerJudgement.permissions("fac.goods.apply.umpire")) {
        return
      }
      this.bomTaskUnReviewStatus = status;

      if (status === 1) {
        this.taskUnPassDialogTitle = '驳回';
        this.taskUnPassDialog = true;
      } else if (status === 4) {
        this.bomTaskReview(false)
      } else {
        this.taskUnPassDialogTitle = '反审核申请';
        this.taskUnPassDialog = true;
      }

    },
    taskUnPassSure() {
      let obj = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        id: this.boomAllData.id,
        taskId: this.boomAllData.taskId,
        result: false, //通过(true)/驳回(false)
        message: this.applyAntiReviewDesc,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      };
      this.isloadingApply = true;
      let bomTaskReviewGo;
      if (this.bomTaskUnReviewStatus === 1) {
        bomTaskReviewGo = bomTaskReview
      } else if (this.bomTaskUnReviewStatus === 2) {
        bomTaskReviewGo = bomTaskApplyReview
      }
      bomTaskReviewGo(obj).then(res => {
        this.isloadingApply = false;
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          // 成功重新渲染数据
          this.$emit('editor')
        } else {
          this.$message.error(res.data.msg)
        }
        this.taskUnPassDialog = false
      })
    },
    isOperationRecordChange(flag) {
      this.isOperationRecord = flag;
      this.$emit("isOperationRecord", !flag)
      if (!flag) return;
      let obj = {
        commonBomId: this.boomAllData.id,
        pageNo: this.currentPage,
        pageSize: 20
      };
      bomTaskLogList(obj).then(res => {
        // console.log(res);
        if (res.data.code === 0) {
          this.totalCount = res.data.data.totalCount;
          this.bomTaskLogListData = res.data.data.list;

        } else {
          this.$message.error(res.data.msg)
        }

      })
    },
    // 删除BOM表
    abolish(zhi) {
      this.$emit("theEditor", zhi)
    },
    // 取消关闭编辑侧窗
    cancel(is) {
      this.createBomTableVisible = is
      // 编辑成功重新渲染数据
      this.$emit('editor')
    },
    // BOM编辑
    addEditBomNeedData() {
      // 权限
      if (!this.powerJudgement.permissions("fac.goods.bom.update") && !this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
        return
      }
      this.title = "编辑BOM表";
      this.createBomTableVisible = true
    },
    //复制BOM表
    copyBomNeedData() {
      this.title = "复制BOM表";
      this.createBomTableVisible = true
    },
    // 查看SKU信息
    onLoadeSkuBoomData() {
      let commonBomId = "";
      if (this.boomAllData) {
        if (this.designStyleId) {
          //设计档案页面
          if (this.$route.query.bomId) {
            //样衣档案里面
            sampleDetailGoodsSkuBom({
              sampleId: this.$route.query.id,
              bomId: this.$route.query.bomId
            }).then(res => {
              console.log(res.data, '按货品查看');
              this.allSkuData = res.data.data
            })
          } else {
            bomGoodsList({
              id: this.boomAllData.id
            }).then(res => {
              console.log(res);
              this.allSkuData = res.data.data
            })
          }
        } else {
          commonBomId = this.boomAllData.id;
          let params = {
            userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
            commonBomId: commonBomId
          };
          skuCheakBoom(params).then(res => {
            if (res.data.code == 0) {
              // this.allSkuData = res.data.commonBom.commonStyleSkuList;
              this.$set(this, 'allSkuData', res.data.commonBom.commonStyleSkuList);
              console.log(this.allSkuData, '00000')
            }
          });
        }
      }
      if (this.centerDialogVisibleBom) {
        this.centerDialogVisibleBom = false;
      } else {
        this.centerDialogVisibleBom = true;
      }
    }
  },

  mounted() {
    this.h =
      document.documentElement.clientHeight || document.body.clientHeight;
    //用onresize这个方法来监听高度变化
    window.onresize = () => {
      return (() => {
        this.h =
          document.documentElement.clientHeight || document.body.clientHeight;
        // console.log(this.h);
      })();
    };
  },
  computed: {
    designStyleId() {
      return this.$route.query.designStyleId
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId
    }
  },
  created() {
    // console.log(this.boomAllData);
    // console.log(999999999999);
    this.getBillReviewConfig();
    if (this.boomAllData && this.boomAllData.commonBomMaterialsList) {
      this.materialsData = this.boomAllData.commonBomMaterialsList;
    }
    // console.log(this.endBoomData, 89)
    //this.onloadeBoomListData();
    //this.onloadeBoomData();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.auto-bom {
  padding: 32px;
  background-color: #fff;

  .title-btns {
    display: flex;
    justify-content: space-between;

    .base-info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-family: MicrosoftYaHei;
      font-size: 20px;
      color: #2c2c2c;

      .line {
        display: inline-block;
        width: 6px;
        height: 20px;
        background-color: $color-btn;
        margin-right: 10px;
      }
    }

    .chk-bom {
      width: 160px;
      height: 36px;
      border-radius: 2px;
      border: solid 1px #1ca1ff;
      font-size: 14px;
      color: #1ca1ff;
    }

    .chk-bom:hover {
      border: 1px solid #000;
      color: #000;
    }

    padding-bottom: 14px;
  }

  .bomRecord {
    overflow: hidden;
    border: solid 1px #dce0e6;
    padding: 20px;
    margin-top: 20px;
  }

}

.beforeEdit {
  background: #fd7b2f;
  padding: 6px 10px;
  color: #fff;
  display: inline-block
}

.afterEdit {
  background: #00cc00;
  padding: 6px 10px;
  color: #fff;
  margin-top: 10px;
  display: inline-block;
}

.bomEditDiv {
  border: 1px solid #e6eaf0;
  padding: 0 10px 10px;
  margin-top: 10px;
}

.no-data {
  text-align: center;
  color: #c4c6cc;
  line-height: 40px;
}

.right-move-enter-active,
.right-move-leave-active {
  transition: all 0.3s ease;
  transform: translateX(0);
}

.right-move-enter,
.right-move-leave-to {
  transform: translateX(100%);
}

.opcity-enter-active,
.opcity-leave-active {
  transition: all 0.5s ease;
  opacity: 0.5;
}

.opcity-enter,
.opcity-leave-to {
  opacity: 0;
}

.cover {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.5;
  top: 0;
  left: 0;
  z-index: 100;
}
</style><style lang="scss">
.auto-bom {
  .title-btns {
    .icon {
      width: 12px;
      height: 12px;
      transform: scale(1);
      vertical-align: -1px;
    }
  }
}
</style>
