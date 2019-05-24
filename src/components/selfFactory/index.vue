/*
 * @Author: kuhn 
 * @Description: 规格属性库
 * @Date: 2019-05-07 16:39:29 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-08 15:29:15
 */

<template>
  <div class="purchase">
    <div class="purchase-header">
      <div class="purchase-header_tab">
        <div :class="['tab_name', $route.path == '/home/setting/selfFacSetting/customField' ? 'is-active' : '']" @click="handleTab('/home/setting/selfFacSetting/customField',3)">自定义字段
          <div :class="[ $route.path == '/home/setting/selfFacSetting/customField' ? 'line' : '']"></div>
        </div>
        <div :class="['tab_name', $route.path == '/home/setting/selfFacSetting' ? 'is-active' : '']" @click="handleTab('/home/setting/selfFacSetting',1)">规格库
          <div :class="[ $route.path == '/home/setting/selfFacSetting' ? 'line' : '']"></div>
        </div>
        <div :class="['tab_name', $route.path == '/selfField' ? 'is-active' : '']" @click="handleTab('/selfField',2)">商品属性库
          <div :class="[ $route.path == '/selfField' ? 'line' : '']"></div>
        </div>
        <div :class="['tab_name', $route.path == '/materialWare' ? 'is-active' : '']" @click="handleTab('/materialWare',4)">物料属性库
          <div :class="[ $route.path == '/materialWare' ? 'line' : '']"></div>
        </div>
      </div>
    </div>
    <div class="purchase">
      <keep-alive :include="keepAliveArr">
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import {
  getFinanceConfigByUserId
} from '@/api/material.js'
import {
  mapState,
  mapMutations,
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      addtype: false
    }
  },
  computed: {
    ...mapState({
      keepAliveArr: state => state.TabView.keepAliveArr
    }),

  },
  methods: {
    handleTab(path, type) {
      if (type === 1) {
        // 权限
        // if(!this.powerJudgement.permissions("fac.purchaseOrder.queryKanban")){
        //     return
        // }
      } else {
        // 权限
        // if(!this.powerJudgement.permissions("fac.purchaseOrder.queryList")){
        //     return
        // }
      }
      this.$router.push(path)
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.purchase {
  .purchase-header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(230, 234, 240, 1);
    box-sizing: border-box;
    margin-bottom: 16px;

    &_tab {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .tab_name {
        padding: 0 16px;
        font-size: 16px;
        color: #A2ABB8;
        height: 24px;
        position: relative;
        cursor: pointer;

        .line {
          position: absolute;
          width: 100%;
          height: 3px;
          background-color: rgba(255, 169, 20, 1);
          bottom: -10px;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .is-active {
        color: #3B3B3B;
      }
    }

    &_btn {
      width: 102px;
      height: 32px;
      background-color: rgba(255, 169, 20, 1);
    }
  }
}
</style>
