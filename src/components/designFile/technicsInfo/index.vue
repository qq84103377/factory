/*
 * @Author: kuhn 
 * @Description: 设计档案 - 工艺信息
 * @Date: 2019-05-14 13:26:36 
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-17 10:58:33
 */

<template>
  <div v-loading="loading" class="technics-info">
    <div class="tech-head">
      <div class="tech-tab">
        <div
          @click="artIndex = index"
          :class="{'is-active':artIndex==index}"
          v-for="(item,index) in artList"
          :key="index">{{item.name}}</div>
      </div>
      <nf-button
        @click="handleAdd"
        type="warning"
        svg="icon-btn-add"
        style="width: 94px;font-size: 12px;padding: 7px 0;">新建工艺单
      </nf-button>
    </div>
    <div v-if="!artList.length" style="font-size: 12px;color: #C4C6CC;text-align: center;">暂无工艺信息数据</div>
    <artDetail
      v-if="artList.length"
      @show="artData=artList[artIndex];isShow=true"
      :info="artList[artIndex]">
    </artDetail>
    <transition name="right-move">
      <add-art
        :artData='artData'
        :styleId='id'
        @toggle="changeArtList"
        v-show="isShow">
      </add-art>
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
import addArt from './addArt'
import artDetail from './artDetail'
import {
  processDetails
} from '@/api'

export default {
  components: {
    artDetail,
    addArt
  },
  computed: {
    id() {
      return this.$route.query.designStyleId
    },
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    }
  },
  data() {
    return {
      loading: false,
      artData: {},
      artIndex: 0,
      isShow: false,
      artList: []
    }
  },
  created() {
    this.getArtList()
  },
  methods: {
    //新建工艺单
    handleAdd() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.process.add")) {
        return
      }
      this.isShow = true;
      this.artData = {};
    },
    changeArtList(v) {
      if (v) {
        this.getArtList()
      }
      this.isShow = !this.isShow;
    },
    /**
     * 获取工艺信息列表数据
     */
    getArtList() {
      this.loading = true
      processDetails({
        designStyleId: this.id,
        userId:this.userId
      }).then(res => {
        this.loading = false
        console.log(res.data.data, '工艺信息');
        this.artList = res.data.data
      })
    }
  },
  watch: {
    isShow(v) {
      if (!v) {
        //弹窗关闭时替换artData 令addArt组件触发watch
        this.artData = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.technics-info {
  .tech-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    .tech-tab {
      display: flex;

      div {
        cursor: pointer;
        text-align: center;
        flex: 0 0 96px;
        line-height: 32px;
        border: 1px solid #939FB8;
        background: #fff;
        color: #939FB8;
        font-size: 12px;

        &.is-active {
          background: #939FB8;
          color: #fff;
        }
      }
    }
  }
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
  z-index: 1;
}
</style>
