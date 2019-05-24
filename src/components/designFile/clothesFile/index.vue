/*
 * @Author: kuhn 
 * @Description: 设计档案详情 - 样衣档案
 * @Date: 2019-05-14 14:21:47 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-14 15:42:28
 */

<template>
  <div v-loading="loading" class="clothes-file">
    <div class="clearfix" style="margin-bottom: 12px;">
      <nf-button
        @click="handleAdd"
        type="warning"
        svg="icon-btn-add"
        style="float: right;width: 94px;font-size: 12px;padding: 7px 0;">
        新建样衣单
      </nf-button>
    </div>
    <div v-if="!tableData.length" style="font-size: 12px;text-align: center;color: #C4C6CC">暂无样衣档案数据</div>
    <clothes-list
      detailFrom="design"
      v-if="tableData.length"
      :tableData="tableData"
      @toggle="getList">
    </clothes-list>
    <transition name="right-move">
      <add-clothes
        :artData='{}'
        :isShow="isShow"
        @toggle="changeArtList"
        v-show="isShow">
      </add-clothes>
    </transition>
    <transition name="opcity">
      <div
        class="cover"
        v-show="isShow"
        @click="isShow = false">
      </div>
    </transition>
  </div>
</template>

<script>
import {
  sampleList
} from '@/api/api'
import addClothes from './addClothes'
import clothesList from './clothesList'

export default {
  name: "index",
  components: {
    addClothes,
    clothesList
  },
  data() {
    return {
      loading: false,
      isShow: false,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  computed: {
    isWorkBench() {
      return this.$route.path == '/designWorkbench'
    },
    userId(){
      return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
    }
  },
  methods: {
    //新建样衣
    handleAdd() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
        return
      }
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
        return
      }
      this.isShow = true;
    },
    getList() {
      this.loading = true
      sampleList({
        styleId: this.$route.query.designStyleId,
        type: 0,
        userId: this.userId
      }).then(res => {
        this.loading = false
        console.log(res.data.data, '样衣列表');
        this.tableData = res.data.data;
        this.$nextTick(() => {
          if (this.$route.query.isCreate) {
            // 其他页面进来新建
            this.isShow = true;
          }
        })
      })
    },
    changeArtList(v) {
      if (v) {
        if (this.$route.query.isCreate) {
          // 从节点详情跳转进来新建成功后
          return this.$router.back();
        }
        this.getList()
      }
      this.isShow = !this.isShow;
    },
  }
}
</script>

<style lang="scss" scoped>
.clothes-file {

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
    z-index: 1;
  }
}
</style>
