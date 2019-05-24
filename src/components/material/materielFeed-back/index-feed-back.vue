<template>
  <div class="index-feed-back scroll-content">
    <page-title style="padding: 16px 24px;" title="余料入库单列表">
        <div class="filter-block">
            <el-input v-model="searchColumn" @change="purchaseList"  class="mgl8 mgr-4" style="width: 300px;font-size: 12px;"
                      placeholder="输入商品款号/生产单号/单号/物料/供应商/加工厂/仓库" icon="search"></el-input>
            <span style="padding:0 5px 0 10px;">筛选:</span>
            <list-filter
                    ref="purchaseListFilter"
                    :isSampleMaterial="true"
                    @submit="filterData">
            </list-filter>
            <!--<nf-button @click="excel" class="mgl8" fsize='12' >导出表格</nf-button>-->
        </div>
        <nf-button class="mgl8 mgr-4" v-if="purchaseSel" fsize='12' style="width: 120px;" @click="showNewPurchase(true)" type="warning">+ 一键采到送</nf-button>
        <nf-button class="mgl8" fsize='12' @click="newFeedBack" type="warning">+ 新建余料入库单</nf-button>
    </page-title>
    <!-- 表格 -->
    <div class="main-content" style="padding: 0 24px;" v-loading="loading" ref="feedBackTable">
      <el-table
            :height="tableHeight"
            :data="tableDate"
            border
            :row-class-name="tableRowClassName"
            key="mission"
            class="custom-table tiny-row"
            style="width: 100%">
          <el-table-column prop="orderNo" label="单号" width="180" align="center"></el-table-column>
          <el-table-column prop="commonOutsideFactroyName" label="加工厂" width="120" align="center"></el-table-column>
          <el-table-column prop="storehouseName" label="入库仓库" width="160" align="center"></el-table-column>
          <el-table-column prop="materialsKindName" label="分类" width="120" align="center"></el-table-column>
          <el-table-column label="图片" width="120" align="center">
              <template slot-scope="scope">
                  <img style="height: 24px;width: 24px;margin-top:2px"
                       @click="imgList(scope.row.commonMaterialsPictureList)"
                       v-if="scope.row.commonMaterialsPictureList"
                       :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0]:''">
              </template>
          </el-table-column>
          <el-table-column prop="materialsNo" label="物料款号" width="140" align="center"></el-table-column>
          <el-table-column prop="supplierName" label="供应商" width="120" align="center"></el-table-column>
          <el-table-column prop="" label="供应商款号/色号" width="200" align="center">
              <template slot-scope="scope">
                  <div>
                      {{scope.row.supplierStyleNo}}
                      <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo">/</span>
                      {{scope.row.supplierColorNo}}
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="materialsName" label="物料名称" width="200" align="center"></el-table-column>
          <el-table-column prop="colorName" label="颜色" width="120" align="center"></el-table-column>
          <el-table-column prop="specificationsRemark" label="规格" width="120" align="center"></el-table-column>
          <el-table-column prop="stockUnitName" label="单位" width="120" align="center"></el-table-column>
          <el-table-column prop="quantity" label="本次入库" width="120" align="center"></el-table-column>
          <el-table-column prop="facMissionNo" label="生产单号" width="120" align="center"></el-table-column>
          <el-table-column prop="styleNo" label="成衣款号" width="120" align="center"></el-table-column>
          <el-table-column prop="prcdNodeName" label="节点名称" width="120" align="center"></el-table-column>
          <el-table-column prop="totalQuantity" label="合计入库" width="120" align="center"></el-table-column>
          <el-table-column prop="operaterName" label="业务员" width="120" align="center"></el-table-column>
          <el-table-column prop="dateOperate" label="入库时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" fixed="right" width="120" align="center">
              <template slot-scope="scope">
                  <div class="blue" @click="goDetail(scope.row.id)">查看详情</div>
              </template>
          </el-table-column>
      </el-table>
    </div>
    <div class="page" style="padding: 0 24px;">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
        </el-pagination>
    </div>

    <!--//图片预览-->
    <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    <!--新建余料入库单-->
    <transition name="right-move">
      <newFeedBack
              v-if="newFeedBackDialog"
              source="createNewFeedBack"
              @cancel="hiddenNewFeedBackDialog"
              @addSucsess="addSucsess">
      </newFeedBack>
    </transition>
    <transition name="opcity">
      <div class="cover1"
           v-if="newFeedBackDialog"
           @click="hiddenNewFeedBackDialog">
      </div>
    </transition>

    </div>
</template>
<script>
import listFilter from './list-filter'
import newFeedBack from './new-feed-back/new-feed-back'
import {refundExcel} from '@/api'
import {
    remaindList,
} from '@/api/material.js'

const fun = require('@/components/Common/commonFun.js')
export default {
    components: {
        listFilter,
        newFeedBack,
    },
    name: 'marterielFeedback',
    data () {
        return {
            loading: false,
            centerDialogVisible:false, // 图片预览
            imgIndex: 0,
            imgLists: [],
            tableDate: [],
            currentPage: 1,
            totalCount: 0,
            form: {},
            filterParams: {},
            newFeedBackDialog: false,
            searchColumn: '', //模糊查询字段
            tableHeight: 736,
        }
    },
    filters:{
        filterTime(val) {
            if(val) {
                return val.slice(0, 11);
            }else {
                return "未设置"
            }
        }
    },
    computed: {
        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        }
    },
    methods:{
        //新建余料入库单
        addSucsess(){
            this.newFeedBackDialog = false
            this.getData()
        },
        hiddenNewFeedBackDialog(){
            this.newFeedBackDialog = false
        },
        // 图片预览
        imgList(imgUrl) {
            this.imgLists = [{path:imgUrl}]
            this.centerDialogVisible = true;
        },
        // 分页
        handleCurrentChange(page){
            this.currentPage = page
            this.getData()
        },
        // 撤销状态的样式
        tableRowClassName(row, index) {
            if (row.status) {
                return 'cancel-row';
            }else {
                return '';
            }
        },
        // 查询
        filterData(val) {
            this.form = val;
            this.getData();
        },
        // 查询表信息
        formData(val) {
            this.form = val;
        },
        // 表格数据
        getData(){
            // 权限
            if(!this.powerJudgement.permissions("fac.backOrder.query")){
                return
            }
            this.filterParams = {
                unitId:this.unitId,
                ids:this.form.billId,       //余料单据ids
                startDate:this.form.orderDate&&this.form.orderDate[0] != null?fun.dateFormatter(this.form.orderDate[0],false): '',
                endDate:this.form.orderDate&&this.form.orderDate[1] != null?fun.dateFormatter(this.form.orderDate[1],false): '',
                storehouseId:this.form.storehouseId,    //"仓库id",
                operaterId:this.form.creatorId,     //操作人
                materialsId:this.form.materialId,   //物料id
                supplierIds:this.form.supplierId,   //供应商ids
                facMissionIds:this.form.demandSourceId, //工单ids
                commonOutsideFactoryIds:this.form.outsideFactoryId, //加工厂商ids
                cancel:this.form.status || [0], //是否撤销 0：否，1：是
                likeColumn: this.searchColumn, //模糊查询字段
                operateType: 'IN_REMAIND',  //单据类型：IN_REMAIND-余料入库单,OUT_REMAIND-余料出库单
                styleIds: this.form.ids,    //商品ids
                pageNo:this.currentPage,
                pageSize:20,
            };
            remaindList(this.filterParams).then(res=>{
                if(res.data.code ===0){
                    this.tableDate = res.data.data.list
                    this.totalCount = res.data.data.totalCount
                }else{
                    this.$message.error(res.data.msg)
                }
            })

            // this.filterParams = {
            //     ids:this.form.ids,
            //     searchParam:this.form.searchParam,
            //     searchType:this.form.searchType,
            //     unitId:this.unitId,
            //     billId:this.form.billId,
            //     dateStart:this.form.orderDate&&this.form.orderDate[0] != null?fun.dateFormatter(this.form.orderDate[0],false): '',
            //     dateEnd:this.form.orderDate&&this.form.orderDate[1] != null?fun.dateFormatter(this.form.orderDate[1],false): '',
            //     storehouseId:this.form.storehouseId,
            //     creatorId:this.form.creatorId,
            //     materialId:this.form.materialId,
            //     // styleIds:this.form.styleIds,
            //     supplierId:this.form.supplierId,
            //     demandSourceId:this.form.demandSourceId,
            //     outsideFactoryId:this.form.outsideFactoryId,
            //     status:this.form.status || [0],
            //     pageNo:this.currentPage,
            //     pageSize:20
            // }
            // refundList(this.filterParams).then(res=>{
            //     this.tableDate = res.data.data.list
            //     this.totalCount = res.data.data.totalCount
            // })

        },
        // 导出
        excel() {
            delete this.filterParams.pageNum;
            delete this.filterParams.pageSize;
            refundExcel(this.filterParams).then(res => {
                this.fileData = res.data;
                let url = window.URL.createObjectURL(res.data);
                let a = window.document.createElement('a');
                a.setAttribute('href', url);
                a.setAttribute('download', '余料入库单列表.xls');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        },
        // 新建页面
        newFeedBack(){
            // 权限
            if(!this.powerJudgement.permissions("fac.backOrder.add")){
                return
            }
            this.newFeedBackDialog = true
        },
        // 详情页
        goDetail(id){
            this.$router.push(`/feedbackDetail?id=${id}`)
        }
    },
    created(){
        this.getData()
    },
    mounted () {
        this.$nextTick(() => {
            let self = this;
            this.tableHeight = this.$refs.feedBackTable.offsetHeight
            // 通过捕获系统的onresize事件触发去改变原有的高度
            window.onresize = function() {
                self.tableHeight = self.$refs.feedBackTable.offsetHeight
            }
        })
    },
}
</script>
<style scoped lang="scss">
.index-feed-back{
    .blue {
      cursor: pointer;
    }
    .page {
      margin: 20px 0;
      text-align: right;
    }
    .cell__row {
        height: 32px;
        line-height: 32px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        word-break: break-all;
        border-bottom: 1px solid #E6EAF0;
        box-sizing: border-box;
        &:last-child{
            border:none;
        }
        .small-img{
            height: 80%;
            width: 90%;
            margin: 5%;
            box-sizing: border-box;
        }
    }
}

</style>

<style lang="scss">
  .index-feed-back{
    .el-table .cancel-row {
        td {
            color:#A2ABB8;
        }
    }
    .filter-block{
      display: inline-block;
      font-size: 12px;
      padding-right: 8px;
      border-right: 1px solid #DFE6EC;
    }
  }

</style>


