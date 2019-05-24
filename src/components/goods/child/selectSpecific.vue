<template>
          <div class="third_select" v-show="!showType">
            <div class="type_list">
                <div class="span_type">品牌:</div>
                <div>
                    <ul>
                        <li @click="selectBrandAll"  :class="{'select_now':orderType.brandAll}">全部</li>
                        <li @click="selectBrandIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.brand" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">设计师:</div>
                <div>
                     <ul>
                        <li @click="selectDesignerAll"  :class="{'select_now':orderType.designerAll}">全部</li>
                        <li @click="selectDesignerIndex(index1)" :class="{'select_index':item1.isExpand}" v-for="(item1,index1) of facInfo.designer" :key="index1">{{item1.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">波段:</div>
                <div>
                   <ul>
                        <li @click="selectWaveAll"  :class="{'select_now':orderType.waveAll}">全部</li>
                        <li @click="selectWaveIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.wave" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">分类:</div>
                <div>
                     <ul>
                        <li @click="selectKindAll"  :class="{'select_now':orderType.kindAll}">全部</li>
                        <li @click="selectKindIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.kind" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">季节:</div>
                <div>
                    <ul>
                        <li @click="selectSeasonAll"  :class="{'select_now':orderType.seasonAll}">全部</li>
                        <li @click="selectSeasonIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.season" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">年份:</div>
                <div>
                    <ul>
                        <li @click="selectYearAll"  :class="{'select_now':orderType.yearAll}">全部</li>
                        <li @click="selectYearIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.year" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
            <div class="type_list">
                <div class="span_type">标签:</div>
                <div>
                    <ul>
                        <li @click="selectTagAll"  :class="{'select_now':orderType.tagAll}">全部</li>
                        <li @click="selectTagIndex(index)" :class="{'select_index':item.isExpand}" v-for="(item,index) of facInfo.tag" :key="index">{{item.value}}</li>
                    </ul>
                </div>
            </div>
        </div>
</template>

<script>
let commonFun = require('../../Common/commonFun')
export default {
  props: ["facInfo","showType"],
  data() {
    return {
        orderType: {
            brandAll: true,
            designerAll: true,
            waveAll: true,
            kindAll: true,
            seasonAll: true,
            yearAll: true,
            tagAll: true
        },
        typeArr: {
            brandArr: ["ALL"],
            designerArr: ["ALL"],
            waveArr: ["ALL"],
            kindArr: ["ALL"],
            seasonArr: ["ALL"],
            yearArr: ["ALL"],
            tagArr: ["ALL"]
        }
    };
  },
  methods: {
    //--------- 七个属性的方法，待优化 ------------
    selectBrandAll() {
      this.orderType.brandAll = true;
      this.typeArr.brandArr = ["ALL"];
      for (let i = 0; i < this.facInfo.brand.length; i++) {
        this.facInfo.brand[i].isExpand = false;
      }
    },
    selectBrandIndex(index) {
      if (commonFun.contains(this.typeArr.brandArr, "ALL")) {
        this.orderType.brandAll = false;
        this.typeArr.brandArr = [];
      }
      this.facInfo.brand[index].isExpand = !this.facInfo.brand[index].isExpand;
      if (this.facInfo.brand[index].isExpand) {
        this.typeArr.brandArr.push(this.facInfo.brand[index].id);
      } else {
        if (
          commonFun.contains(this.typeArr.brandArr, this.facInfo.brand[index].id)
        ) {
          commonFun.removeByValue(
            this.typeArr.brandArr,
            this.facInfo.brand[index].id
          );
        }
      }
      if (this.typeArr.brandArr.length == this.facInfo.brand.length) {
        this.typeArr.brandArr = ["ALL"];
        this.orderType.brandAll = true;
        for (let i = 0; i < this.facInfo.brand.length; i++) {
          this.facInfo.brand[i].isExpand = false;
        }
      }
      if(this.typeArr.brandArr.length==0) {
        this.typeArr.brandArr.push('ALL');
        this.orderType.brandAll = true;
      }
    },
    //设计师
    selectDesignerAll() {
      this.orderType.designerAll = true;
      this.typeArr.designerArr = ["ALL"];
      for (let i = 0; i < this.facInfo.designer.length; i++) {
        this.facInfo.designer[i].isExpand = false;
      }
    },
    selectDesignerIndex(index) {
      if (commonFun.contains(this.typeArr.designerArr, "ALL")) {
        this.orderType.designerAll = false;
        this.typeArr.designerArr = [];
      }
      this.facInfo.designer[index].isExpand = !this.facInfo.designer[index].isExpand;
      if (this.facInfo.designer[index].isExpand) {
        this.typeArr.designerArr.push(this.facInfo.designer[index].id);
      } else {
        if (commonFun.contains(this.typeArr.designerArr,this.facInfo.designer[index].id)
        ) {
          commonFun.removeByValue(this.typeArr.designerArr,this.facInfo.designer[index].id
          );
        }
      }
      if (this.typeArr.designerArr.length == this.facInfo.designer.length) {
        this.typeArr.designerArr = ["ALL"];
        this.orderType.designerAll = true;
        for (let i = 0; i < this.facInfo.designer.length; i++) {
          this.facInfo.designer[i].isExpand = false;
        }
      }
      if(this.typeArr.designerArr.length==0) {
        this.typeArr.designerArr.push('ALL');
        this.orderType.designerAll = true;
      }
    },
    //波段
    selectWaveAll() {
      this.orderType.waveAll = true;
      this.typeArr.waveArr = ["ALL"];
      for (let i = 0; i < this.facInfo.wave.length; i++) {
        this.facInfo.wave[i].isExpand = false;
      }
    },
    selectWaveIndex(index) {
      if (commonFun.contains(this.typeArr.waveArr, "ALL")) {
        this.orderType.waveAll = false;
        this.typeArr.waveArr = [];
      }
      this.facInfo.wave[index].isExpand = !this.facInfo.wave[index].isExpand;
      if (this.facInfo.wave[index].isExpand) {
        this.typeArr.waveArr.push(this.facInfo.wave[index].id);
      } else {
        if (commonFun.contains(this.typeArr.waveArr, this.facInfo.wave[index].id)) {
          commonFun.removeByValue(this.typeArr.waveArr, this.facInfo.wave[index].id);
        }
      }
      if (this.typeArr.waveArr.length == this.facInfo.wave.length) {
        this.typeArr.waveArr = ["ALL"];
        this.orderType.waveAll = true;
        for (let i = 0; i < this.facInfo.wave.length; i++) {
          this.facInfo.wave[i].isExpand = false;
        }
      }
      if(this.typeArr.waveArr.length==0) {
        this.typeArr.waveArr.push('ALL');
        this.orderType.waveAll = true;
      }
    },
    //分类
    selectKindAll() {
      this.orderType.kindAll = true;
      this.typeArr.kindArr = ["ALL"];
      for (let i = 0; i < this.facInfo.kind.length; i++) {
        this.facInfo.kind[i].isExpand = false;
      }
    },
    selectKindIndex(index) {
      if (commonFun.contains(this.typeArr.kindArr, "ALL")) {
        this.orderType.kindAll = false;
        this.typeArr.kindArr = [];
      }
      this.facInfo.kind[index].isExpand = !this.facInfo.kind[index].isExpand;
      if (this.facInfo.kind[index].isExpand) {
        this.typeArr.kindArr.push(this.facInfo.kind[index].id);
      } else {
        if (commonFun.contains(this.typeArr.kindArr, this.facInfo.kind[index].id)) {
          commonFun.removeByValue(this.typeArr.kindArr, this.facInfo.kind[index].id);
        }
      }
      if (this.typeArr.kindArr.length == this.facInfo.kind.length) {
        this.typeArr.kindArr = ["ALL"];
        this.orderType.kindAll = true;
        for (let i = 0; i < this.facInfo.kind.length; i++) {
          this.facInfo.kind[i].isExpand = false;
        }
      }
      if(this.typeArr.kindArr.length==0) {
        this.typeArr.kindArr.push('ALL');
        this.orderType.kindAll = true;
      }
    },
    //季节
    selectSeasonAll() {
      this.orderType.seasonAll = true;
      this.typeArr.seasonArr = ["ALL"];
      for (let i = 0; i < this.facInfo.season.length; i++) {
        this.facInfo.season[i].isExpand = false;
      }
    },
    selectSeasonIndex(index) {
      if (commonFun.contains(this.typeArr.seasonArr, "ALL")) {
        this.orderType.seasonAll = false;
        this.typeArr.seasonArr = [];
      }
      this.facInfo.season[index].isExpand = !this.facInfo.season[index]
        .isExpand;
      if (this.facInfo.season[index].isExpand) {
        this.typeArr.seasonArr.push(this.facInfo.season[index].id);
      } else {
        if (
          commonFun.contains(this.typeArr.seasonArr, this.facInfo.season[index].id)
        ) {
          commonFun.removeByValue(
            this.typeArr.seasonArr,
            this.facInfo.season[index].id
          );
        }
      }
      if (this.typeArr.seasonArr.length == this.facInfo.season.length) {
        this.typeArr.seasonArr = ["ALL"];
        this.orderType.seasonAll = true;
        for (let i = 0; i < this.facInfo.season.length; i++) {
          this.facInfo.season[i].isExpand = false;
        }
      }
      if(this.typeArr.seasonArr.length==0) {
        this.typeArr.seasonArr.push('ALL');
        this.orderType.seasonAll = true;
      }
    },
    //年份
    selectYearAll() {
      this.orderType.yearAll = true;
      this.typeArr.yearArr = ["ALL"];
      for (let i = 0; i < this.facInfo.year.length; i++) {
        this.facInfo.year[i].isExpand = false;
      }
    },
    selectYearIndex(index) {
      if (commonFun.contains(this.typeArr.yearArr, "ALL")) {
        this.orderType.yearAll = false;
        this.typeArr.yearArr = [];
      }
      this.facInfo.year[index].isExpand = !this.facInfo.year[index].isExpand;
      if (this.facInfo.year[index].isExpand) {
        this.typeArr.yearArr.push(this.facInfo.year[index].id);
      } else {
        if (commonFun.contains(this.typeArr.yearArr, this.facInfo.year[index].id)) {
          commonFun.removeByValue(this.typeArr.yearArr, this.facInfo.year[index].id);
        }
      }
      if (this.typeArr.yearArr.length == this.facInfo.year.length) {
        this.typeArr.yearArr = ["ALL"];
        this.orderType.yearAll = true;
        for (let i = 0; i < this.facInfo.year.length; i++) {
          this.facInfo.year[i].isExpand = false;
        }
      }
      if(this.typeArr.yearArr.length==0) {
        this.typeArr.yearArr.push('ALL');
        this.orderType.yearAll = true;
      }
    },
    //标签
    selectTagAll() {
      this.orderType.tagAll = true;
      this.typeArr.tagArr = ["ALL"];
      for (let i = 0; i < this.facInfo.tag.length; i++) {
        this.facInfo.tag[i].isExpand = false;
      }
    },
    selectTagIndex(index) {
      if (commonFun.contains(this.typeArr.tagArr, "ALL")) {
        this.orderType.tagAll = false;
        this.typeArr.tagArr = [];
      }
      this.facInfo.tag[index].isExpand = !this.facInfo.tag[index].isExpand;
      if (this.facInfo.tag[index].isExpand) {
        this.typeArr.tagArr.push(this.facInfo.tag[index].id);
      } else {
        if (commonFun.contains(this.typeArr.tagArr, this.facInfo.tag[index].id)) {
          commonFun.removeByValue(this.typeArr.tagArr, this.facInfo.tag[index].id);
        }
      }
      if (this.typeArr.tagArr.length == this.facInfo.tag.length) {
        this.typeArr.tagArr = ["ALL"];
        this.orderType.tagAll = true;
        for (let i = 0; i < this.facInfo.tag.length; i++) {
          this.facInfo.tag[i].isExpand = false;
        }
      }
      if(this.typeArr.tagArr.length==0) {
        this.typeArr.tagArr.push('ALL');
        this.orderType.tagAll = true;
      }
    }
  },
  updated() {
      this.$emit('orderType',this.typeArr);
  },
};
</script>

<style lang="scss" scoped>
.third_select {
  font-size: 14px;
  margin-top: 20px;
  .type_list {
    display: flex;
    justify-content: flex-start;
    color: #636363;
    ul {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 1030px;
      flex-wrap: wrap;
      li {
        min-width: 48px;
        height: 24px;
        border: 1px solid #e6e8eb;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        padding: 0 10px;
        margin-bottom: 10px;
        font-size: 12px;
        cursor: pointer;
        box-sizing: border-box;
      }
      .select_now {
        border: 1px solid #ff9c38;
        color: #ff9c38;
      }
      .select_index {
        border: 1px solid #ff9c38;
        color: #ff9c38;
      }
    }
    .span_type {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 24px;
      width: 58px;
      color: #aaaaaa;
    }
  }
}
</style>
