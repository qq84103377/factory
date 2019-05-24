<template>
  <div class="order-bom">
    <div class="nf-scroll-container">
      <header class="header_line">
        <div class="header_right">
         <span>工单BOM表</span>
        </div>
        <div class="header_left">
          <nf-button class="go-back" @click="$router.back(-1)">
            <i class="icon-left el-icon-arrow-left"></i>返回上级</nf-button>
        </div>
      </header>
      <div class="nf-scroll-view">
        <div class="order-info box-shadow">
            <img :src="$route.query.pictureURL" v-errorLogo />
            <div class="item">
                <div><span class="label">货品款号</span>{{ $route.query.styleNo}}</div>
                <div><span class="label">货品名称</span><span :class="{'gray':$route.query.goodsName=='未填写'}">{{ $route.query.goodsName}}</span></div>
            </div>
            <div class="item">
                <div><span class="label">工单号</span>{{ $route.query.missionNo}}</div>
                <div><span class="label">客户</span>{{ $route.query.customerName}}</div>
            </div>
        </div>
        <div class="bom-content box-shadow">
          <div class="yellow-border-title mgb20">
            <h1 class="title">{{facMissionBom.commonBomName}}</h1>
            <div>
                <button class="gray-btn-reverse mgl16" @click="showEditOrderBom">
                    <icon style="color:#808080;width:14px;height:14px;margin-right:4px;" type="icon-edit1"></icon>编辑
                </button>
                <button class="blue-btn-reverse" @click="showBomSku">按货品SKU查看 BOM</button>
            </div>
          </div>
          <!-- 工单BOM表的表格组件 -->
            <div>
                <goods-bom  :bomData="facMissionBom"></goods-bom>
            </div>
        </div>
      </div>
    </div>
      <sku-bom-detail :lengthShow="$route.query.lengthShow" :visible.sync="skuBomDetialVisible" :allSkuData="facMissionBomSku.commonStyleSkuDTOList"></sku-bom-detail>
      <!-- <transition name="right-move">
          <edit-order-bom :bomData="facMissionBom" @cancel="cancel" v-if="editOrderBomVisible" :visible.sync="editOrderBomVisible"></edit-order-bom>
      </transition> -->

       <!-- BOM编辑组件 -->
        <transition name="right-move">
          <create-bom-table
                  :facMissionId="facMissionId"
                  from="missionOrder"
                  @isdelete="abolish"
                  type="editor"
                  :bomData="facMissionBom"
                  :title="title"
                  v-if="editOrderBomVisible"
                  source="editOrderBomVisible"
                  :styleId="$route.query.styleId"
                  @cancel="cancel">
          </create-bom-table>
        </transition>
  </div>

</template>
<script>
import { facMissionBomEditInfo, facMissionBomSku } from "@/api";
import BomTableDetail from "@/components/order/orderBom/bomTableDetail";
import SkuBomDetail from "@/components/order/orderBom/skuBomDetail";
import EditOrderBom from "@/components/order/orderBom/editOrderBom";
import goodsBom from "@/components/goods/goodsBom/goodsBom";
import CreateBomTable from "@/components/goods/goodsBom/CreateBomTable";

export default {
  data() {
    return {
      facMissionBom: {},
      facMissionBomSku: {},
      skuBomDetialVisible: false,
      editOrderBomVisible: false,
      facMissionId:'',    //生产工单id
    };
  },
    computed:{
        userId() {
            return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
        },
    },
  components: {
    BomTableDetail,
    SkuBomDetail,
    EditOrderBom,
    goodsBom, //工单BOM表的表格组件
    CreateBomTable //编辑工单BOM组件
  },
  methods: {
    // 删除BOM表
    abolish(zhi) {
      this.$emit("theEditor", zhi);
    },
    // 取消关闭编辑侧窗
    cancel(is) {
      this.editOrderBomVisible = is;
      this.getFacMissionBom()
    },
    // 获取表格数据
    getFacMissionBom() {
      let params = {
        userId:this.userId,
        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
        missionId: this.$route.query.missionId
      };
      facMissionBomEditInfo(params).then(res => {
        this.facMissionBom = res.data.data;
        this.facMissionId = res.data.data.facMissionId;
          this.facMissionBom.commonMaterialsSkuList.forEach(item => {
              item.facMissionBomId = res.data.data.id;
          })
      });
    },
    // 获取查看sku数据
    getFacMissionBomSku() {
      let params = {
        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
        missionId: this.$route.query.missionId
      };
      facMissionBomSku(params).then(res => {
        this.facMissionBomSku = res.data.data;
      });
    },
    // 查看sku按钮
    showBomSku() {
      this.skuBomDetialVisible = true;
    },
    // 查看编辑按钮
    showEditOrderBom() {
        this.title = "编辑BOM表"
      this.editOrderBomVisible = true;
    }
  },
  created() {
    this.getFacMissionBom();
    this.getFacMissionBomSku();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
.yellow-border-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    border-left: 6px solid #ffa914;
    line-height: 20px;
    font-size: 20px;
    padding-left: 12px;
    font-weight: normal;
  }
}
.order-bom {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .header_line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    .header_right {
      font-size: 24px;
    }
  }

  .order-info {
    display: flex;
    padding: 20px 32px;
    display: flex;
    background-color: #fff;
    margin-bottom: 16px;
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
    }
    .item {
      line-height: 18px;
      margin-right: 70px;
      & > div:first-child {
        margin-bottom: 12px;
      }
      .label {
        display: inline-block;
        vertical-align: top;
        width: 56px;
        color: #a2abb8;
        text-align: right;
        padding-right: 12px;
      }
    }
  }

  .bom-content {
    padding: 32px;
  }
  .blue-btn-reverse {
    position: relative;
    padding: 0 12px;
    height: 36px;
    color: #1ca1ff;
    font-size: 14px;
    float: right;
    border: 1px solid #1ca1ff;
    border-radius: 2px;
  }
  .gray-btn-reverse {
    position: relative;
    padding: 0 12px;
    height: 36px;
    color: #808080;
    font-size: 14px;
    float: right;
    border: 1px solid #dce0e6;
    border-radius: 2px;
  }
}
</style>
<style lang="scss">
.right-move-enter-active,
.right-move-leave-active {
  transition: all 0.3s ease;
  transform: translateX(0);
}

.right-move-enter,
.right-move-leave-to {
  transform: translateX(100%);
}
</style>





