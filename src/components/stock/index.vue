<template>
    <section class="stock">
        <el-row
        class="stock-header"
        type="flex"
        justify="space-between"
        align="middle">
            <div class="stock-tab">
                <div class="stock-tab__pane"
                :class="{'active': $route.path === '/home/stock'}"
                @click="$router.push('/home/stock?storehouseId=' + storehouseId)">
                    实时库存
                </div>
                <div class="stock-tab__pane"
                     :class="{'active': $route.path === '/home/stock/bill'}"
                     @click="jumpInventory()">
                    库存单据
                </div>
                <div class="stock-tab__pane"
                     :class="{'active': $route.path === '/home/stock/notice'}"
                     @click="$router.push('/home/stock/notice?storehouseId=' + storehouseId + '&type=5')">
                    库存通知
                    <span class="noticeNum" v-if="noticeNum">{{noticeNum}}</span>
                </div>
                <div class="stock-tab__pane" v-if='isshow'
                :class="{'active': $route.path === '/home/stock/stockrecord'}"
                @click="$router.push('/home/stock/stockrecord?storehouseId=' + storehouseId)">
                    库存变动记录
                </div>
            </div>
            <div class="stock-facselect">
                <el-select
                v-model="facSelectVal"
                :disabled="loginType"
                @change="handleChangeFac"
                placeholder="请选择"
                >
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </el-row>
        <div style="width:100%">
            <!--<router-view :key="routerKey"></router-view>-->


            <keep-alive>
                <router-view></router-view>
            </keep-alive>
            <!--<router-view v-if="!$route.meta.keepAlive"></router-view>-->
        </div>
        <!-- <el-row
        class="stock-sort"
        type="flex"
        justify="space-between"
        align="middle">
            <div class="stock-sort__right">
                <el-input
                class="search-input"
                placeholder="输入货品款号搜索"
                icon="search"
                :on-icon-click="handleIconClick">
                </el-input>
                <el-select
                v-model="facSelectVal"
                placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="stock-sort__left">
                <nf-button class="in-btn" type="success" size="medium">批量入库</nf-button>
                <nf-button class="out-btn" type="warning" size="medium">批量出库</nf-button>
            </div>
        </el-row>
        <el-row>
            <stock-filter></stock-filter>
        </el-row>
        <el-row>
            <page-wrap>
                <stock-table></stock-table>
                <el-row
                class="pagination"
                type="flex"
                justify="end">
                  <el-pagination
                    :current-page.sync="currentPage"
                    :page-size="100"
                    layout="total, prev, pager, next"
                    :total="1000">
                    </el-pagination>
                </el-row>
            </page-wrap>
        </el-row> -->
    </section>
</template>

<script>
// import StockFilter from './filter'
import {mapMutations} from "vuex";
import StockTable from "./table";
import { getStorehousesByUserId, stockInformCount } from "@/api/api";
export default {
  data() {
    return {
      facSelectVal: "",
      currentPage: 1,
      activeIndex: 0,
      options: [],
      loginType: true,
      sign: "0",
      sign_kc:'0',
      isshow:true,
    };
  },
  components: {
    // StockFilter,
    StockTable
  },
  computed: {
    routerKey() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    unitId() {
      return JSON.parse(sessionStorage.getItem("last_login")).id;
    },
    userId() {
      return (
        this.$store.state.userInfo.id ||
        JSON.parse(sessionStorage.getItem("user_login")).userId
      );
    },
    storehouseId() {
      return this.$route.query.storehouseId|| '';
    },
    noticeNum() {
        return this.$store.state.Stock.noticeNum
    }
  },
  created() {
      this.fecthStockList();
    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
      .permissionList;
    if (datalist) {
      for (let i = 0; i < datalist.length; i++) {
        if (datalist[i] == "fac.inventory.switch.storage") {
          this.sign = "1";
        }
      }
    }

    if (this.sign == "0" || !datalist) {
      this.loginType = true;
    }

    if (datalist) {
      for (let i = 0; i < datalist.length; i++) {
        if (datalist[i] == "fac.inventory.record.list") {
          this.sign_kc = "1";
        }
      }
    }
    if (this.sign_kc == "0" || !datalist) {
      this.isshow = false;
    }
  },
    watch: {
      '$route'(v) {
          if(v.path.indexOf('/home/stock')>-1) {
              this.fecthStockList()
          }
      }
    },
    beforeRouteEnter (to, from, next){
        next(vm => {
            if(vm.storehouseId){
                vm.getNoticeNum(vm.storehouseId)
            }
        })
    },
  methods: {
    ...mapMutations(["setNoticeNum"]),
      getNoticeNum(storehouseId) {
          stockInformCount({storehouseId}).then(res => {
              this.setNoticeNum(res.data.data||0)
          })
      },
      //库存单据跳转
      jumpInventory(){
          // 权限
          if((!this.powerJudgement.permissions("fac.inventory.queryStorage"))){
              return
          }
          this.$router.push('/home/stock/bill?storehouseId=' + this.storehouseId)
      },
    handleTabClick(index) {
      this.activeIndex = index;
    },
    handleChangeFac() {
        if(this.$route.path.includes('/home/stock')&&this.facSelectVal) {
            // 防止切换仓库后点击tab-view进入库存单据详情页面时清掉参数
                this.$router.replace(
                    `${this.$route.path}?storehouseId=${this.facSelectVal}${this.$route.path.includes('/home/stock/notice')?'&type=5':''}`
                );
            this.getNoticeNum(this.facSelectVal)
        }
    },
    handleIconClick() {},
    // 获取仓库列表
    fecthStockList() {
      getStorehousesByUserId({
        facId: this.unitId,
        userId: this.userId,
        kind: 1
      }).then(res => {
        this.options = res.data.data;
        if (this.storehouseId) {
          // 判断是否从批量出入库跳回
          this.facSelectVal = this.storehouseId;
          return;
        };
        const defaultStorehouseTag = res.data.data.find(
          item => item.defaultStorehouseTag === 1
        );
        if (defaultStorehouseTag) {
          this.facSelectVal = defaultStorehouseTag.id;
        }
        else {
          this.facSelectVal = res.data.data[0].id;
        }
      });
      this.loginType = this.$store.state.userInfo === 1 ? true : false;
    }
  }
};
</script>

<style lang="scss" scoped>
.stock {
  width: 100%;
}
.stock-header {
  line-height: 50px;
  border-bottom: 1px solid #e0e6ed;
  .stock-tab {
    flex: 1;
    margin-bottom: -1px;
    &__pane {
      display: inline-block;
      padding: 0 16px;
      font-size: 20px;
      color: #a2abb8;
      cursor: pointer;
      position: relative;
        .noticeNum{
            position: absolute;
            right: 0;
            top: 8px;
            background: red;
            color: #fff;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            text-align: center;
            line-height: 18px;
            font-size: 14px;
        }
    }
    .active {
      border-bottom: 4px solid #ffa914;
      color: #3b3b3b;
    }
  }
  .stock-facselect {
    .el-select {
      width: 280px;
    }
  }
}
.stock-sort {
  margin: 16px 0;
  &__right {
    flex: 1;
    .search-input {
      width: 320px;
      margin-right: 14px;
    }
  }
  .in-btn {
    margin-right: 14px;
  }
}

.pagination {
  margin-top: 25px;
}
</style>

