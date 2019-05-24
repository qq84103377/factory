/*
 * @Author: kuhn
 * @Description: 设计档案详情 - BOM表
 * @Date: 2019-05-14 13:48:12
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-22 14:52:31
 */

<template>
  <div v-loading="loading" class="bom">
    <div class="bom-head">
      <div class="tab-btn">
        <button :class="{'active':index == change}" v-for="(it,index) in boomAllData" :key="index" @click="changeChanel(index)">{{it.name}}</button>
      </div>
      <div>
        <nf-button
          class="new-table"
          style="margin-right: 10px;"
          @click="dynamicVisibleShow">设置BOM字段
        </nf-button>
        <nf-button
          type="warning"
          svg="icon-btn-add"
          @click="chachCanNewBom">新建BOM表
        </nf-button>
      </div>
    </div>
    <auto-bom
      from="designFile"
      :boomAllData="endBoomData"
      v-if="goActiveBom"
      @theEditor="theEditor"
      @editor="editor">
    </auto-bom>

    <!-- 新建BOM组件 -->
    <transition name="right-move">
      <create-bom-table
        from="designFile"
        v-if="createBomTableVisible"
        title="新建BOM表"
        :styleId="'2c1f2e0fd03448ea8a9a86d5d7984f1f'"
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
  </div>
</template>

<script>
import DynamicHead from '@/components/Common/dynamicHead';
import autoBom from '../../goods/goodsBom/autoBom'
import CreateBomTable from "../../goods/goodsBom/CreateBomTable.vue";
import {
  bomGoodsList,
  bomMaterialsList,
  getCommonBomConfig,
  updateCommonBomConfig,
  getFacCommonSettings,
  selectFacGoodsStyle,
  getFacGoodsPictureList,
  getFacUnitSettings,
} from "../../../api/api";
export default {
  name: "index",
  components: {
    autoBom,
    CreateBomTable,
    DynamicHead
  },
  data() {
    return {
      goActiveBom: true,
      dynamicVisible: false,
      dynamicAllItem: [],
      dynamicCheckArr: [],
      dynamicSortArr: [],

      loading: false,
      change: 0,
      createBomTableVisible: false,
      boomAllData: [],
      endBoomData: {},
    }
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
  },
  created() {
    this.onloadeBoomListData()
  },
  methods: {
    //bom字段配置
    dynamicVisibleShow() {
      // getCommonBomConfig({
      //   userId: JSON.parse(sessionStorage.getItem("user_login")).userId
      // }).then(res => {
      //   this.dynamicAllItem = res.data.data;
      //   res.data.data.forEach(item => {
      //     item.name = item.fieldName
      //   });
      //   let dynamicCheckArr = res.data.data.filter(item => item.required);
      //   this.dynamicCheckArr = JSON.parse(JSON.stringify(dynamicCheckArr)).map(item => item.fieldId);
      //   this.dynamicSortArr = JSON.parse(JSON.stringify(dynamicCheckArr));
      //   this.dynamicVisible = true
      // })
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
      // console.log(val);
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
          this.goActiveBom = false;
          this.$nextTick(function () {
            this.goActiveBom = true;
          })

        } else {
          this.$message.error(res.data.msg)
        }
        this.dynamicVisible = false
      })
    },

    //bom字段配置结束
    // 取消弹窗
    cancel(res) {
      this.createBomTableVisible = res;
      this.onloadeBoomListData()
    },
    // 点击选中哪个传值
    changeChanel(index) {
      this.change = index;
      this.endBoomData = this.boomAllData[this.change];
    },
    // 新建BOM表
    chachCanNewBom() {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.bom.add")) {
        return
      }
      if (this.boomAllData.length > 8) {
        this.$message({
          showClose: true,
          message: "最多只能创建8个BOM表",
          type: "error"
        });
      } else {
        this.createBomTableVisible = true;
      }
    },
    // 当编辑删除BOM表成功后调用重新渲染数据
    theEditor(zhi) {
      this.onloadeBoomListData(zhi)
    },
    // 当编辑BOM表成功后调用重新渲染数据
    editor() {
      this.onloadeBoomListData()
    },
    /**
     * 获取bom表格数据
     */
    onloadeBoomListData() {
      this.loading = true;
      bomMaterialsList({
        userId: this.userId,
        designStyleId: this.$route.query.designStyleId
      }).then(res => {
        this.loading = false;
        this.boomAllData = res.data.data;
        console.log('bom列表数据', res.data.data)
        this.endBoomData = this.boomAllData[this.change];
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.bom-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  .tab-btn {
    button {
      max-width: 150px;
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 25px;
      border: none;
      font-size: 16px;
      color: #939fb8;
      border: 1px solid #939fb8;
      border-left: none;
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

}
</style>
