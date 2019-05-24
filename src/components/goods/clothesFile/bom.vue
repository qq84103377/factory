<template>
  <div>
    <div class="clearfix" v-if="!endBoomData">
      <el-popover
          ref="popover2"
          placement="bottom"
          width="200"
          trigger="click">
        <div class="popover-content">
          <div @click="chachCanNewBom" class="popover-item" style="color: #FFA914;border-bottom: 1px solid #DCE0E6;">
            +新建BOM表
          </div>
          <div v-for="(item,index) in bomList" :key="index" @click="addBom(item.id)" class="popover-item">{{item.name}}
          </div>
        </div>
      </el-popover>
      <nf-button v-popover:popover2 type="warning" svg="icon-btn-add"
                 style="float: right;width: 94px;font-size: 12px;padding: 7px 0;">添加BOM表
      </nf-button>
    </div>
    <!--<div v-if="!endBoomData"  style="font-size: 12px;color: #C4C6CC;text-align: center;">暂无BOM表数据</div>-->

    <auto-bom from="clothesFile" v-if="endBoomData" :sampleId="$route.query.id" :boomAllData="endBoomData"
              @theEditor="theEditor" @editor="editor"></auto-bom>
    <div v-else class="text-center gray mgt15">暂无BOM表数据</div>


    <!-- 新建BOM组件 -->
    <transition name="right-move">
      <create-bom-table
          from="clothesFile"
          v-if="createBomTableVisible"
          :title="'新建BOM表'"
          :styleId="$route.query.styleId"
          :sampleId="$route.query.id"
          @cancel="cancel">
      </create-bom-table>
    </transition>
  </div>
</template>

<script>
  import autoBom from '../../goods/goodsBom/autoBom'
  import CreateBomTable from "../../goods/goodsBom/CreateBomTable.vue";
  import {
    getGoodsBomList,
    getBomSkuForClothesInGoods,
    setGoodsClothesBom
  } from "../../../api/api";

  export default {
    name: "bom",
    components: {
      autoBom, CreateBomTable
    },
    computed: {
      userId() {
        return JSON.parse(sessionStorage.getItem("user_login")).userId;
      }
    },
    data() {
      return {
        createBomTableVisible: false,
        endBoomData: {},
        bomList: []
      }
    },
    created() {
      this.getBomList()
      this.onloadeBoomListData()
    },
    methods: {
      addBom(id) {
        setGoodsClothesBom({sampleId: this.$route.query.id, bomId: id}).then(res => {
          if(res.data.code ===0){
            this.onloadeBoomListData()
          }
        })
      },
      getBomList() {
        getGoodsBomList({id: this.$route.query.id}).then(res => {
          this.bomList = res.data.data
        })
      },
      // 取消弹窗
      cancel(res) {
        this.createBomTableVisible = res;
        this.onloadeBoomListData()
      },
      // 当编辑删除BOM表成功后调用重新渲染数据
      theEditor() {
        this.createBomTableVisible = false
        this.onloadeBoomListData()
      },
      // 当编辑BOM表成功后调用重新渲染数据
      editor() {
        this.createBomTableVisible = false
        this.onloadeBoomListData()
      },
      // 获取bom表格数据
      onloadeBoomListData() {
        let params = {
          userId:this.userId,
          sampleId: this.$route.query.id
        };
        getBomSkuForClothesInGoods(params).then(res => {
          if (res.data.code == 0) {
            console.log(res, '获取样衣bom')
            // this.boomAllData = res.data.commonBomList;
            this.endBoomData = res.data.data;
            console.log(this.endBoomData, '样衣bom表。。。。')
          } else {
            this.$message.error(res.data.msg);
          }
        });
      },
      // 新建BOM表
      chachCanNewBom() {
        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
          .permissionList;
        if (datalist.indexOf("fac.goods.bom.add") == -1) {
          this.$message.error("抱歉，您没有操作权限");
          return;
        }
        this.createBomTableVisible = true;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .popover-content{
    max-height: 280px;
    overflow-y: auto;
  }
  .popover-item {
    cursor: pointer;
    color: #3B3B3B;
    font-size: 12px;
    line-height: 32px;
  }
</style>
