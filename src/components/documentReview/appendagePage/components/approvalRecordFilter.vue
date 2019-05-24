<template>
  <slide-filter
    width="calc(100% - 300px)"
    placeholder="按条件筛选"
    @cancel="cancel"
    @reset="reset"
    @filter="filter"
  >
    <el-form :inline="true" label-width="90px" style="margin-left: -30px;">
      <el-row>
        <el-col :span="8">
          <el-form-item label="审核单类型">
            <el-select multiple clearable filterable v-model="form.billTypes" placeholder="请选择">
              <el-option
                v-for="item in options.auditLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作人">
            <!-- <customer type="filter" v-model="form.operatorIds"></customer> -->
            <workerLeader v-model="form.operatorIds" :placeholder="'请选择或搜索'"></workerLeader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作类型">
            <el-select multiple clearable filterable v-model="form.operateTypes" placeholder="请选择">
              <el-option
                v-for="item in options.optTypeLists"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作时间">
            <el-date-picker
              @change="dateChange"
              type="daterange"
              v-model="form.orderDateRange"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </slide-filter>
</template>
<script>
import { selectFacCustomer } from "@/api";
import FilterCheckGroup from "@/components/order/WorkOrders/filter-check-group.vue";
import FilterCheckItem from "@/components/order/WorkOrders/filter-check-item.vue";
export default {
  components: {
    FilterCheckGroup,
    FilterCheckItem
  },
  data() {
    return {
      form: {
        operatorIds: [], // 操作人
        billTypes: [], // 审核单类型
        operateTypes: [], // 操作类型
        dateEnd: "", // 结束时间
        dateStart: "", // 开始时间
        orderDateRange: "" // 操作时间
      },
      // 查询项
      options: {
        customerList: [],
        auditLists: [
          { id: 0, name: "生产订单" },
          { id: 1, name: "订单调整单" },
          { id: 2, name: "库存调整单" },
          { id: 3, name: "库存发货单" },
          { id: 4, name: "加工厂商档案" },
          { id: 5, name: "商品BOM" },
          { id: 6, name: "物料档案" },
          { id: 7, name: "工单完成单" },
          { id: 8, name: "工单调整单" },
          { id: 9, name: "工单次品单" },
          { id: 10, name: "工单废品单" }
        ],
        optTypeLists: [
          { id: 0, name: "提报" },
          { id: 1, name: "通过" },
          { id: 2, name: "驳回" },
          { id: 3, name: "申请反审" },
          { id: 4, name: "批准" },
          { id: 5, name: "不批准" },
          { id: 6, name: "撤回提报" },
          { id: 7, name: "撤回申请" }
        ]
      },
      backupForm: {
        operatorIds: [], // 操作人
        billTypes: [], // 审核单类型
        operateTypes: [], // 操作类型
        dateEnd: "", // 结束时间
        dateStart: "", // 开始时间
        orderDateRange: "" // 操作时间
      }
    };
  },
  watch: {},
  computed: {
    // unitId() {
    //   return JSON.parse(sessionStorage.getItem("last_login")).id;
    // }
  },
  methods: {
    // 获取操作人
    fetchCustomerList() {
      selectFacCustomer({
        facId: this.facId,
        pageNo: 1,
        sortType: 0,
        needAll: true
      }).then(res => {
        this.options.customerList = res.data.goods;
      });
    },
    // 选取操作时间
    dateChange(val) {
      const [start, end] = this.filterDate(val);
      this.form.dateStart = start;
      this.form.dateEnd = end;
    },
    // 选取交货日期
    deliveryDateChange(val) {
      const [start, end] = this.filterDate(val);
      this.form.deliveryStartAt = start;
      this.form.deliveryEndAt = end;
    },
    filterDate(val) {
      return val.split(/\s-\s/g);
    },
    cancel() {
      this.form = JSON.parse(JSON.stringify(this.backupForm));
    },
    // 重置
    reset() {
      Object.keys(this.form).forEach(key => {
        const isArr = Array.isArray(this.form[key]);
        if (isArr) {
          this.form[key] = [];
        } else {
          this.form[key] = "";
        }
      });
      this.$emit("submit", JSON.parse(JSON.stringify(this.form)));
    },

    // 筛选
    filter() {
      this.$emit("submit", JSON.parse(JSON.stringify(this.form)));
      this.backupForm = JSON.parse(JSON.stringify(this.form));
    }
  },
  mounted() {
    this.fetchCustomerList();
  }
};
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
</style>

