<template>
  <div>
    <div class="selector-wrap">
      <div
        class="selector-main"
        @click="isListShow = !isListShow"
      >
        <span class="employee-name">
          {{employeeName==''?'工位':employeeName}}
          <span v-if="employeeId.length>1">+{{employeeId.length}}</span>
        </span>
        <div :class="['arrow',!isListShow?'rotate':'']"></div>
      </div>
      <div
        class="selector-list"
        v-if="isListShow"
      >
        <div
          class="list-item"
          @click="employeeName='全部工位';employeeId=[];$emit('passId',employeeId)"
        >
          <div class="text">全部工位</div>
          <div
            class="icon"
            v-show="employeeId==''"
          ></div>
        </div>
        <div
          class="list-item"
          v-for="(item,index) of employeeList"
          :key="index"
          @click="saveId(item)"
        >
          <div class="text">{{item.user_name}}</div>
          <div
            class="icon"
            v-show="employeeId.includes(item.id)"
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
import { workbayListByFactoryId } from '@/api/lineReport/lineReportApi'
export default {
  data() {
    return {
      isListShow: false,
      employeeId: [],
      employeeName: '',
      employeeList: []
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
      //   this.employeeId = item.id;
      //   this.employeeName = item.user_name;
      let index = this.employeeId.findIndex(idItem => item.id == idItem);
      if (index == -1) {
        this.employeeId.push(item.id)
      } else {
        this.employeeId.splice(index, 1)
      }
      let obj = this.employeeList.find(employeeItem => employeeItem.id == this.employeeId[0]);
      this.employeeName = obj ? obj.user_name : '工位';
      this.$emit('passId', this.employeeId)
    },
    // 获取工位
    async getWorkBay() {
      try {
        let params = {
          facId: JSON.parse(sessionStorage.getItem("last_login")).id
        }
        let res = await workbayListByFactoryId(params)
        this.employeeList = res.data.data
      } catch (error) {
        throw Error(error)
      }
    }
  },
  created() {
    this.getWorkBay()
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


