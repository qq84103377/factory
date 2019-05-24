<template>
  <div>
    <div class="selector-wrap">
      <div
        class="selector-main"
        @click="isListShow = !isListShow"
      >
        <span class="employee-name">
          {{factoryName==''?'工厂':factoryName}}
          <span v-if="factoryId.length>1">+{{factoryId.length}}</span>
        </span>
        <div :class="['arrow',!isListShow?'rotate':'']"></div>
      </div>
      <div
        class="selector-list"
        v-if="isListShow"
      >
        <div
          class="list-item"
          @click="factoryName='全部工厂';factoryId=[];$emit('passId',factoryId)"
        >
          <div class="text">全部工厂</div>
          <div
            class="icon"
            v-show="factoryId===[]"
          ></div>
        </div>
        <!-- <div
          class="list-item"
          @click="factoryName='本厂';factoryId='';$emit('passId',factoryId)"
        >
          <div class="text">本厂</div>
          <div
            class="icon"
            v-show="factoryId===''"
          ></div>
        </div> -->
        <div
          class="list-item"
          v-for="(item,index) of factoryList"
          :key="index"
          @click="saveId(item)"
        >
          <div class="text">{{item.name}}

          </div>
          <div
            class="icon"
            v-show="factoryId.includes(item.id)"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="selector-mask"
      v-if="isListShow"
      @click="isListShow =false"
    ></div>
  </div>
</template>
<script>
import { outsideFactoryListForSelect } from '@/api/api'
export default {
  data() {
    return {
      isListShow: false,
      factoryId: [],
      factoryName: '',
      factoryList: []
    }
  },
  props: ['value'],
  watch: {
    isListShow(val) {
      if (val) {
        document.querySelector('.root-wrap').style.overflow = 'hidden'
      } else {
        document.querySelector('.root-wrap').style.overflow = 'scroll'
      }
    }
  },
  methods: {
    saveId(item) {
      let index = this.factoryId.findIndex(idItem => item.id == idItem);
      if (index == -1) {
        this.factoryId.push(item.id)
      } else {
        this.factoryId.splice(index, 1)
      }
      let obj = this.factoryList.find(factoryItem => factoryItem.id == this.factoryId[0]);
      this.factoryName = obj ? obj.name : '全部工厂'
      this.$emit('passId', this.factoryId)
      //   this.isListShow = false;
    },
    // 获取工位
    async getFactoryList() {
      try {
        let params = {
          factoryId: JSON.parse(sessionStorage.getItem("last_login")).id,
          userId: JSON.parse(sessionStorage.getItem('user_login')).userId
        }
        let res = await outsideFactoryListForSelect(params)
        this.factoryList = res.data.data
        this.factoryList.unshift({ name: "本厂", id: '' })
      } catch (error) {
        throw Error(error)
      }
    }
  },
  created() {
    this.getFactoryList()
  }
}
</script>
<style lang="scss" scoped>
@function pxTovw($px) {
  @return $px / 1440 * 100 + vw;
}
.selector-wrap {
  position: relative;
  color: rgb(125, 134, 222);
  user-select: none;
}
.selector-main {
  width: pxTovw(111);
  height: pxTovw(12);
  border-radius: 16px;
  background-color: rgb(27, 24, 73);
  line-height: pxTovw(12);
  padding: pxTovw(6) pxTovw(12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: pxTovw(12);
  .arrow {
    border-style: solid;
    border-width: 0px 5px 5px 5px;
    border-color: transparent transparent rgb(104, 98, 169) transparent;
    width: 0px;
    height: 0px;
  }
}
.selector-list {
  position: absolute;
  max-height: 148px;
  border-radius: 6px;
  background-color: rgb(43, 39, 98);
  z-index: 101;
  top: 40px;
  box-shadow: 0 4px 6px 0 rgb(11, 9, 52);
  overflow-y: scroll;
  .list-item {
    width: 116px;
    height: 14px;
    padding: 9px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px rgb(51, 50, 114);
    .icon {
      width: 14px;
      height: 14px;
      border: solid 1px rgb(118, 211, 252);
      border-radius: 50%;
      &:after {
        content: "\00a0";
        display: inline-block;
        border: 1px solid rgb(118, 211, 252);
        border-top-width: 0;
        border-right-width: 0;
        width: 8px;
        height: 4px;
        transform: rotate(-50deg) translate(-1px, 4px);
      }
    }
  }
}
.selector-mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 100;
  overflow: hidden;
}
.rotate {
  transform: rotate(180deg);
}
</style>


