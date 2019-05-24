<template>
  <div class="approval-record-box" v-loading="loading">
    <page-title title="历史审批记录" class="tit-box">
      <div class="btn-group">
        <el-input
          v-model="keyWord"
          @input="handleSearch"
          style="width: 200px;margin-right: 10px;font-size: 12px;"
          placeholder="输入单据编号/名称搜索"
        ></el-input>
        <div style="display: flex;align-items: center;margin-left: 5px;">
          <span style="margin-right: 5px;">筛选:</span>
          <filter-form type="orderList" @submit="handleOrderFilter"></filter-form>
        </div>
        <nf-button tyle="display: flex;align-items: center;margin-left: 5px;" @click="goBack()">返回</nf-button>
      </div>
    </page-title>
    <!--表格begin-->
    <div class="approval-record-list box-shadow mgt20" ref="approvalTable">
      <el-table :height="tableHeight" border :data="dataList" style="width: 100%">
        <el-table-column sortable width="120" label="审核单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.billType === 'FAC_PRD_ORDER'">生产订单</span>
            <span v-if="scope.row.billType === 'FAC_PRD_ORDER_ADJUST'">订单调整单</span>
            <span v-if="scope.row.billType === 'STOCK_ADJUST'">库存调整单</span>
            <span v-if="scope.row.billType === 'STOCK_DELIVERY'">库存发货单</span>
            <span v-if="scope.row.billType === 'OUTSIDE_FACTORY'">加工厂商档案</span>
            <span v-if="scope.row.billType === 'COMMON_BOM'">商品BOM</span>
            <span v-if="scope.row.billType === 'COMMON_MATERIALS'">物料档案</span>
            <span v-if="scope.row.billType === 'FAC_MISSION_COMPLETE'">工单完成单</span>
            <span v-if="scope.row.billType === 'FAC_MISSION_ADJUST'">工单调整单</span>
            <span v-if="scope.row.billType === 'FAC_MISSION_DEFECTIVE'">工单次品单</span>
            <span v-if="scope.row.billType === 'FAC_MISSION_WASTE'">工单废品单</span>
          </template>
        </el-table-column>
        <el-table-column prop="billNo" sortable label="单据"></el-table-column>
        <el-table-column prop="username" width="120" label="操作人"></el-table-column>
        <el-table-column width="120" label="操作类型">
          <template slot-scope="scope">
            <span v-if="scope.row.operateType === 'SUBMIT'">提报</span>
            <span v-if="scope.row.operateType === 'PASS'">通过</span>
            <span v-if="scope.row.operateType === 'REJECT'">驳回</span>
            <span v-if="scope.row.operateType === 'APPLY_ANTI_REVIEW'">申请反审</span>
            <span v-if="scope.row.operateType === 'APPLY_ANTI_REVIEW_PASS'">批准</span>
            <span v-if="scope.row.operateType === 'APPLY_ANTI_REVIEW_REJECT'">不批准</span>
            <span v-if="scope.row.operateType === 'UNDO_SUBMIT'">撤回提报</span>
            <span v-if="scope.row.operateType === 'UNDO_ANTI_REVIEW'">撤回申请</span>
          </template>
        </el-table-column>
        <el-table-column prop="message" width="200" label="审批备注"></el-table-column>
        <el-table-column prop="dateOperate" sortable width="180" label="操作时间"></el-table-column>
        <el-table-column align="center" fixed="right" width="80" label="操作">
          <template slot-scope="scope">
            <div class="blue query-link" @click="queryLink(scope.row)">查看</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--表格end-->
    <!--分页begin-->
    <div class="pg-box text-right">
      <el-pagination
        @current-change="currentRange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        :current-page.sync="pageNum"
      ></el-pagination>
    </div>
    <!--分页end-->
  </div>
</template>
<script>
import { billReviewLogList, billReviewLogBomStyle } from "@/api/api.js";
import FilterForm from "./components/approvalRecordFilter";
export default {
  components: {
    FilterForm
  },
  data() {
    return {
      loading: false,
      tableHeight: 0,
      keyWord: "", // 输入单据编号/名称搜索
      dataList: [],
      total: 1,
      pageNum: 1,
      pageSize: 30,
      form: {}
    };
  },
  computed: {
    unitId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId; // 组织ID
    }
  },
  methods: {
    // 查看
    queryLink(row) {
      let type, path;
      // 生产订单
      if (row.billType == "FAC_PRD_ORDER") {
        this.$router.push({
          path: "/orderProductioDetail",
          query: {
            id: row.billId,
            type: "formal"
          }
        });
      }
      // 订单调整单
      if (row.billType == "FAC_PRD_ORDER_ADJUST") {
        this.$router.push({
          path: "/adjustOrder",
          query: {
            id: row.billId,
            type: 3
          }
        });
      }
      // 库存调整单 STOCK_ADJUST
      if (row.billType == "STOCK_ADJUST") {
        this.$router.push({
          path: "/stockDetail",
          query: {
            id: row.billId,
            // storehouseId: row.billId, //*
            type: 2
          }
        });
      }
      // 库存发货单 STOCK_DELIVERY
      if (row.billType == "STOCK_DELIVERY") {
        this.$router.push({
          path: "/stockDetail",
          query: {
            id: row.billId,
            // storehouseId: row.billId, //*
            type: 3
          }
        });
      }
      // 加工厂商档案
      if (row.billType == "OUTSIDE_FACTORY") {
        this.$router.push({
          path: `/outsideFactory/info/${row.billId}`
        });
      }
      // 商品BOM COMMON_BOM
      if (row.billType == "COMMON_BOM") {
        let params = {
          unitId: this.unitId, // 组织ID
          bomId: row.billId
        };
        // 接口获取goodsId、styleId参数
        billReviewLogBomStyle(params).then(res => {
          if (res.data.code === 0) {
            const data = res.data.data;
            this.$router.push({
              path: "/baseGoodsInfo",
              query: {
                id: data.styleId,
                goodsId: data.goodsId,
                bomId: row.billId ,
                type: "bom"
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
      // 物料档案 COMMON_MATERIALS
      if (row.billType == "COMMON_MATERIALS") {
        this.$router.push({
          path: `/materialInfo/${row.billId}`
        });
      }
      /**
       * 工单次品单 FAC_MISSION_DEFECTIVE
       * 工单废品单 FAC_MISSION_WASTE
       * 工单完成单 FAC_MISSION_COMPLETE
       * 工单调整单 FAC_MISSION_ADJUST
       */
      if (
        row.billType == "FAC_MISSION_DEFECTIVE" ||
        row.billType == "FAC_MISSION_WASTE" ||
        row.billType == "FAC_MISSION_COMPLETE" ||
        row.billType == "FAC_MISSION_ADJUST"
      ) {
        this.$router.push({
          path: "/allReportBillDetail",
          query: {
            billId: row.billId
          }
        });
      }
    },

    // 输入单据编号/名称搜索过滤查询
    handleSearch(v) {
      this.currentPage = 1;
      this.getdataList(this.form);
    },

    // 按条件筛选过滤查询
    handleOrderFilter(form) {
      this.form = form;
      this.currentPage = 1;
      this.getdataList(form);
    },
    // 列表数据
    getdataList(val) {
      let params = {
        unitId: this.unitId, // 组织ID
        queryColumn: this.keyWord, // 查询关键字
        billTypes: "", // 审核单类型
        operatorIds: "", // 操作人列表
        operateTypes: "", // 操作类型列表
        dateStart: "", // 开始时间
        dateEnd: "", // 结束时间
        order: "0", // 排序
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...val
      };
      this.loading = true;
      billReviewLogList(params).then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          const data = res.data.data;
          this.dataList = data.list;
          this.total = data.totalCount;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 分页
    currentRange(page) {
      this.pageNum = page;
      this.getdataList(this.form);
    },
    // 返回上一级
    goBack() {
      this.$router.push("/documentReview");
    }
  },
  created() {
    this.getdataList();
  },
  mounted() {
    this.$nextTick(() => {
      let self = this;
      self.tableHeight = window.innerHeight - 175;
      // 通过捕获系统的onresize事件触发去改变原有的高度
      window.onresize = function() {
        self.tableHeight = window.innerHeight - 175;
      };
    });
  }
};
</script>
<style lang="scss" scoped>
.approval-record-box {
  .tit-box {
    margin-top: -15px;
    margin-bottom: -20px;
  }
  .query-link {
    cursor: pointer;
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    > button {
      margin-left: 5px;
    }
  }
}
</style>
<style lang="scss">
.approval-record-box {
  .el-table {
    font-size: 12px;
    td {
      height: 32px;
      line-height: 32px;
    }
  }
  .pg-box {
    margin-top: 10px;
    .el-pagination {
      padding: 0;
    }
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
</style>