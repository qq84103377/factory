<template>
  <section class="detail">
    <el-row
        class="inventory-header"
        type="flex"
        justify="space-between"
        align="middle">
      <div class="inventory-tab">
        <div class="inventory-tab__pane" v-for="(item,index) in tabList" :key="index"
             @click="$router.replace(item.route)"
             :class="{'active': $route.path === item.route.split('?')[0]}">
          {{item.name}}
        </div>
      </div>
      <div class="inventory-facselect">
        <nf-button style="width: 72px;font-size: 12px;padding: 7px 0;" class="btn" @click="$router.go(-1)">
          返回上级
        </nf-button>
      </div>
    </el-row>
    <div style="margin-top: 12px;">
      <router-view></router-view>
    </div>
  </section>
</template>

<script>
  export default {
    name: "detail",
    data() {
      return {
        tabList: [
          {
            name: '样衣档案信息',
            route: `/goodsClothesDetail?id=${this.$route.query.id}&styleId=${this.$route.query.styleId}`
          },
          {
            name: '样衣工艺信息',
            route: `/goodsClothesDetail/art?id=${this.$route.query.id}&styleId=${this.$route.query.styleId}`
          },
          // {
          //   name: '样衣BOM表',
          //   route: `/goodsClothesDetail/bom?id=${this.$route.query.id}&styleId=${this.$route.query.styleId}`
          // },
          {
            name: '计划成本核算',
            route: `/goodsClothesDetail/cost?id=${this.$route.query.id}&styleId=${this.$route.query.styleId}&designStyleId=${this.$route.query.designStyleId}&bomId=${this.$route.query.bomId}&type=goodsSample`
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .detail {
    .inventory-header {
      line-height: 50px;
      border-bottom: 1px solid #e0e6ed;
      .inventory-tab {
        flex: 1;
        margin-bottom: -1px;
        &__pane {
          display: inline-block;
          padding: 0 16px;
          font-size: 20px;
          color: #a2abb8;
          cursor: pointer;
        }
        .active {
          border-bottom: 4px solid #ffa914;
          color: #3b3b3b;
        }
      }
    }
  }

</style>
