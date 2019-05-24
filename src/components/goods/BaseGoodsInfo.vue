<template>
  <section class="goods-boom-list">
    <el-tabs
      v-model="tabListValue"
      value="first"
      @tab-click="checkCanShowLength">
      <!--货品信息-->
      <el-tab-pane label="商品信息" name="first">
        <goods-info></goods-info>
      </el-tab-pane>
      <!--工艺信息-->
      <el-tab-pane label="工艺信息" name="process">
        <art-info
          v-if="tabListValue==='process'"
          :styleId="$route.query.id"
          :goodsStyleNo='goodsStyleNo'
          @addArt="addArt"
          @toggle='editArt'>
        </art-info>
      </el-tab-pane>
      <!--BOM表-->
      <el-tab-pane
        label="BOM表"
        name="second"
        @click="checkCanShowLength('bom')"
        v-if='disabled_sign'>
        <div class="tab-btns" v-if="isOperationRecord">
          <div class="tab-btn">
            <button :class="{'active':index == change}" v-for="(it,index) in boomAllData" :key="index" @click="changeChanel(index)"><span v-if="bomReviewConfig">
              ({{it.reviewStatusText}})</span>{{it.name}}
            </button>
          </div>
          <nf-button
            type="warning"
            class="new-table"
            svg="icon-btn-add"
            @click="chachCanNewBom">新建BOM表
          </nf-button>
          <nf-button
            class="new-table"
            style="margin-right: 10px;"
            @click="dynamicVisibleShow">设置BOM字段
          </nf-button>
        </div>
        <auto-bom
          v-if="goActiveBom"
          from="goodsFile"
          v-show="isVisible"
          :boomAllData="endBoomData"
          @theEditor="theEditor"
          @isOperationRecord="(flag)=>isOperationRecord=flag"
          @editor="editor">
        </auto-bom>
      </el-tab-pane>
      <!--样衣档案-->
      <el-tab-pane
        label="样衣档案"
        name="sample"
        @click="checkCanShowLength">
        <clothes-list
          v-if="tabListValue==='sample'"
          :styleId="$route.query.id"
          detailFrom="goods"
          :tableData="clothesList"></clothes-list>
      </el-tab-pane>
      <el-tab-pane
        label="工序模板"
        name="template"
        @click="checkCanShowLength('template')">
        <procedure detailFrom="goods" v-if="tabListValue==='template'"></procedure>
      </el-tab-pane>
      <el-tab-pane
        label="计划成本核算"
        name="costAccounting"
        @click="checkCanShowLength">
        <goodsCostAccounting detailFrom="goods" v-if="tabListValue==='template'"></goodsCostAccounting>
      </el-tab-pane>

    </el-tabs>
    <nf-button class="goBack" @click="routerGoBack">返回上级</nf-button>
    <!-- 新建BOM组件 -->
    <transition name="right-move">
      <create-bom-table
        from="goodsFile"
        v-if="createBomTableVisible"
        :title="title"
        :styleId="$route.query.id"
        :goodsStyleNo='goodsStyleNo'
        @cancel="cancel">
      </create-bom-table>
    </transition>
    <!--动态配置表头组件-->

    <dynamic-head
      v-if="dynamicVisible"
      source="bomConfig"
      title="配置表头显示内容"
      :dynamicVisible="dynamicVisible"
      :allSelectItem="dynamicAllItem"
      :checkedArr="dynamicCheckArr"
      :sortArr="dynamicSortArr"
      @dynamicCommit="dynamicCommit"
      @closeDynamicHead="dynamicVisible = false">

    </dynamic-head>
  </section>
</template>

<script>
import {
  goodManageBoomAllData,
  getGoodsSampleList,
  billReviewConfig,
  getCommonBomConfig,
  updateCommonBomConfig,
  getCommonBomDefaultConfig,
  getFacGoodsStyle
} from "../../api/api";
import DynamicHead from '@/components/Common/dynamicHead';
import goodsInfo from "../../components/goods/goodsInfo.vue";
import autoBom from "./goodsBom/autoBom.vue";
import CreateBomTable from "./goodsBom/CreateBomTable.vue";
import artInfo from "./child/artInfo";
import ClothesList from "../designFile/clothesFile/clothesList";
import procedure from "../designFile/procedure/index";
import goodsCostAccounting from "./goodsCostAccounting";
export default {
  data() {
    return {
      goActiveBom: true,
      dynamicVisible: false,
      dynamicAllItem: [],
      dynamicCheckArr: [],
      dynamicSortArr: [],

      tabListValue: 'first',
      isOperationRecord: true,
      bomReviewConfig: false,
      title: "新建BOM表",
      isVisible: true,
      createBomTableVisible: false,
      boomAllData: [], //表格所有数据
      boomName: [],
      change: 0, //判断选中的值
      endBoomData: "",
      sign: "0", //判断权限
      disabled_sign: true,
      clothesList: [],
      goodsStyleNo: '' //款号名称
    };
  },
  computed: {
    userId() {
      return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
    }
  },
  components: {
    goodsCostAccounting,
    procedure,
    ClothesList,
    artInfo,
    goodsInfo,
    autoBom,
    CreateBomTable,
    DynamicHead,
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
    //bom字段配置
    dynamicVisibleShow() {
      getCommonBomConfig({
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      }).then(res => {
        this.dynamicAllItem = res.data.data.fields;
        res.data.data.fields.forEach(item => {
          item.name = item.fieldName
        });
        let dynamicCheckArr = res.data.data.fields.filter(item => item.required);
        this.dynamicCheckArr = JSON.parse(JSON.stringify(dynamicCheckArr)).map(item => item.fieldId);
        this.dynamicSortArr = JSON.parse(JSON.stringify(res.data.data.configs));
        this.dynamicVisible = true
      })
    },
    dynamicCommit(val) {
      console.log(val);
      let fieldIds = val.map(item => {
        return {
          fieldId: item.fieldId
        }
      });
      updateCommonBomConfig({
        fieldIds,
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      }).then(res => {
        if (res.data.code === 0) {
          this.$message.success('配置成功');
          this.goActiveBom = false
          this.$nextTick(function () {
            this.goActiveBom = true
          })
        } else {
          this.$message.error(res.data.msg)
        }
        this.dynamicVisible = false
      })
    },

    //bom字段配置结束
    //是否有审核台
    getBillReviewConfig() {
      billReviewConfig({
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          if (res.data.data.configs && res.data.data.configs.length > 0) {
            //是否有审核台
            this.bomReviewConfig = res.data.data.configs.some(v => v.billType == 'COMMON_BOM')

          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    routerGoBack() {
      this.$store.dispatch('deleteVisitedView', this.$route);
      this.$router.push('/goodsMangement')
    },
    //获取款号
    geyStyleNo() {
      let params = {
        token: "",
        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
        styleId: this.$route.query.id,
        userId: this.userId
      };
      getFacGoodsStyle(params).then(res => {
        this.goodsStyleNo = res.data.styleNo;
      });
    },

    // 当编辑BOM表成功后调用重新渲染数据
    editor() {
      this.onloadeBoomListData()
    },
    // 当编辑删除BOM表成功后调用重新渲染数据
    theEditor(zhi) {
      this.onloadeBoomListData(zhi)
    },
    // 取消弹窗
    cancel(res) {
      this.createBomTableVisible = res;
      this.onloadeBoomListData()
    },
    // 新建BOM表
    chachCanNewBom() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist.indexOf("fac.goods.bom.add") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      if (this.boomAllData.length > 8) {
        this.$message({
          showClose: true,
          message: "最多只能创建8个BOM表",
          type: "error"
        });
      } else {
        this.createBomTableVisible = true;
        // this.checkCanShowLength();
      }
    },

    checkCanShowLength(e) {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;
      if (datalist.indexOf("fac.goods.bom.list") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      if (datalist.indexOf("fac.goods.style.list") == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      if (e === 'bom') {
        this.onloadeBoomListData();
      }
      // if (e === 'bom') {
      //   this.onloadeBoomListData();
      // }
    },
    // 点击选中哪个传值
    changeChanel(index) {
      this.change = index;
      this.endBoomData = this.boomAllData[this.change];
    },
    // 获取表格数据
    async onloadeBoomListData(zhi) {
      let params = {
        userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
        styleId: this.$route.query.id
      };
      await goodManageBoomAllData(params).then(ret => {
        if (ret.data && ret.data.code == 0) {
          if (zhi) {
            this.boomAllData = ret.data.commonBomList;
            this.endBoomData = this.boomAllData[0];
            this.change = 0
            return;
          }
          this.boomAllData = ret.data.commonBomList;
          this.endBoomData = this.boomAllData[this.change];

        } else {
          this.$message.error(ret.data.msg);
        }
      });
    },
    getGoodsSampleList() {
      let params = {
        styleId: this.$route.query.id,
        type: 1,
        userId: this.userId
      }
      getGoodsSampleList(params).then(res => {
        if (res.data.code === 0) {
          this.clothesList = res.data.data
        }
      })
    }
  },
  mounted() {
    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
      .permissionList;
    if (datalist) {
      for (let i = 0; i < datalist.length; i++) {
        if (datalist[i] == "fac.goods.bom.list") {
          this.sign = "1";
        }
      }
    }
    if (this.sign == "0" || !datalist) {
      this.disabled_sign = false;
      return;
    }
    this.h =
      document.documentElement.clientHeight || document.body.clientHeight;
    //用onresize这个方法来监听高度变化
    window.onresize = () => {
      return (() => {
        this.h =
          document.documentElement.clientHeight || document.body.clientHeight;
      })();
    };
  },
  async created() {
    this.getGoodsSampleList();
    this.geyStyleNo();
    this.getBillReviewConfig();
    await this.onloadeBoomListData();
    if (this.$route.query && this.$route.query.type === 'bom') {
      this.tabListValue = 'second'
      this.endBoomData = this.boomAllData.find(item => item.id === this.$route.query.bomId)
      this.change = this.boomAllData.findIndex(item => item.id === this.$route.query.bomId);
    }

  }
};
</script>

<style lang="scss">
.goods-boom-list {
  position: relative;

  .el-tabs__item {
    font-size: 24px;
  }

  .el-tabs__item.is-active {
    font-size: 24px;
  }

  .el-tabs__active-bar {
    width: 110px;
    height: 4px;
    background-color: #ffa914;
  }
}
</style><style lang="scss" scoped>
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

.goods-boom {
  position: relative;
}

.goBack {
  position: absolute;
  right: 0;
  top: 0;
}

.tab-btns {
  padding-bottom: 16px;
  min-height: 40px;
  overflow: hidden;

  .tab-btn {
    display: inline-block;

    button {
      max-width: 300px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 25px;
      border: none;
      font-size: 16px;
      color: #939fb8;
      border: 1px solid #939fb8;
      border-left: none;
      background-color: #f3f6fa;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:first-child {
        border-left: 1px solid #939fb8;
        border-radius: 2px 0 0 2px;
      }

      &:last-child {
        border-radius: 0 2px 2px 0;
      }
    }

    button.active {
      background-color: #939fb8;
      color: #ffffff;
    }
  }

  .new-table {
    float: right;
  }
}
</style>
