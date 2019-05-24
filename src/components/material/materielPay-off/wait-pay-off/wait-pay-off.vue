<template>
    <div class="scroll-content wait-pay-off-list">
        <div class="pay-off-filter">
            <div class="filter-block">
                <el-input @change="handleCurrentChange" v-model="queryColumn" class="mgr8" style="width: 240px;font-size: 12px;" placeholder="输入送料单/送料员/商品款号/生产单号/物料/供应商"
                          icon="search"></el-input>
                <span>筛选</span>
                <wait-filter ref="waitPayOffFilter" @filter="filterData"></wait-filter>
                <nf-button @click="excel" class="mgl8" fsize='12'>导出表格</nf-button>
            </div>
            <nf-button class="mgl8" fsize='12' @click="newPayoffOrder(0)" type="warning">+新建送料单</nf-button>
            <nf-button class="mgl8" fsize='12' @click="newPayoffOrder(2)" type="warning">+送料通知单</nf-button>
        </div>
        <div ref="waitPayOffListContent" class="main-content pay-off-list-content " v-loading="loading">
            <el-table
                    v-if="canShow"
                    :data="missionTable"
                    border
                    stripe
                    :height="tableHeight"
                    class="custom-table tiny-row mission"
                    key="mission"
                    style="width: 100%">
                <el-table-column prop="styleNo" label="商品款号" v-if="configArr.includes('商品款号')" width="120" >
                </el-table-column>
                <el-table-column prop="facMissionNo" label="生产单号" v-if="configArr.includes('生产单号')" width="160" >
                </el-table-column>
                <el-table-column prop="outsideFactoryName" label="整单外发"  width="160" >
                </el-table-column>
                <el-table-column prop="dateEndPlan" label="计划完成送料" width="100" >
                    <template slot-scope="scope">
                        {{scope.row.dateEndPlan | filterTime}}
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" prop="city" label="分类" v-if="configArr.includes('分类')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.kindName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="图片" v-if="configArr.includes('图片')" width="60">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            <img style="display: inline-block;vertical-align: middle; width: 24px;height: 24px;"
                                 @click="imgList(item)"
                                 v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                                 :src="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length?item.commonMaterialsPictureList[0].path:''"
                                 alt="">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" prop="address" label="物料款号" v-if="configArr.includes('物料款号')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.materialsNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="供应商" v-if="configArr.includes('供应商')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.supplierName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.supplierStyleNo}}/{{item.supplierColorNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="物料名称" v-if="configArr.includes('物料名称')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.materialsName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="颜色" v-if="configArr.includes('颜色')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.colorName?item.colorName:item.colorValue}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="规格" v-if="configArr.includes('规格')" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.specificationsRemark?item.specificationsRemark:item.specificationsNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="库存单位" v-if="configArr.includes('单位')" width="70" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.stockUnitName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="物料需求" width="70" v-if="configArr.includes('物料需求')" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.planBuyQuantity}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="主动占用" width="70" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.stockActivePreuse}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="可用库存" width="70" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.availableStock}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="本单总占用" width="90" >
                    <template slot-scope="scope">
                        <div class="cell__row" style="background: #F2FAFF" v-for="item in scope.row.materialsSkus">
                            {{item.selfPreuseTotal}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="已采购" width="60" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.quantityPurchased}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="已到料" width="60" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.quantityArrived}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="已送料" width="60" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.quantityDelivered}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="已退料" width="60" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.quantityReturned}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="总库存" min-width="80" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.materialsSkus">
                            {{item.stock}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" label="待送料" fixed="right" width="60" >
                    <template slot-scope="scope">
                        <div class="cell__row" :class="{'red':item.waitDeliveryQuantity!=0}" v-for="item in scope.row.materialsSkus">
                            {{item.waitDeliveryQuantity}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  class-name="no-padding" prop="zip" label="操作" fixed="right" width="160" >
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div class="item blue" @click="openPayoffOrder(scope.row,scope.$index,2)">开通知单</div>
                            <div class="item blue" @click="openPayoffOrder(scope.row,scope.$index,0)">开送料单</div>
                        </div>

                    </template>
                </el-table-column>　
            </el-table>
        </div>
        <div  class="pdlr24 pdtb16 text-right">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="total">
            </el-pagination>
            <!--<textarea id="contents" style="position:absolute;height:0;width:0;opacity: 0;" rows="10" cols="10" >{{copyData}}</textarea>-->
        </div>
        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <transition name="opcity">
            <div style="z-index: 999" class="cover" v-show='newPayOff.visible'>
            </div>
        </transition>
        <!--新建送料单-->
        <transition name="right-move">
            <new-pay-off
                    v-if="newPayOff.visible"
                    :visible.sync="newPayOff.visible"
                    :belongModule="newPayOff.belongModule"
                    :facMissionIds="newPayOff.facMissionIds"
                    @cancel="cancelNewPayOff"
                    @success="successNewPayOff"
            ></new-pay-off>
        </transition>

    </div>
</template>

<script>
import {
    purchaseMissionPage,
    purchaseSupplierPage,
    exportWaitDelivery,
    MPRFieldConfigList,
} from '../../../../api/material.js'
const fun = require('../../../Common/commonFun.js')
import waitFilter from './wait-pay-off-filter'
import NewPayOff from "../new-pay-off/new-pay-off";
export default {
    data() {
        return {
            centerDialogVisible: false, //判断显示图片预览显示与隐藏
            imgLists: [],
            imgIndex: 0,
            dataType:1,
            currentPage:1,
            form:{},
            total:'',
            supplierTable:[],
            missionTable:[],
            copyData:'',
            configArr:[],       //配置表头数组
            canShow: false,      //控制是否显示表格
            loading: false,
            tableHeight:300,
            queryColumn:'', // 关键字搜索的值
            newPayOff:{
                visible:false,
                belongModule:0,
                facMissionIds:[], //按工单选中的
            }
        }
    },
    components: {
        NewPayOff,
        waitFilter
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
    computed:{
        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem("last_login")).id
        },
        facId() {
            return JSON.parse(sessionStorage.getItem("last_login")).id
        }
    },
    mounted () {
        this.$refs.waitPayOffFilter.filter()
        this.$nextTick(() => {
            let self = this;
            this.tableHeight = this.$refs.waitPayOffListContent.offsetHeight
            // 通过捕获系统的onresize事件触发去改变原有的高度
            window.onresize = function() {
                self.tableHeight = self.$refs.waitPayOffListContent.offsetHeight
            }
        })
    },
    methods:{
        // 取消新建送料单
        cancelNewPayOff(){
            this.newPayOff.facMissionIds = []
        },
        // 新建送料单成功
        async successNewPayOff(isEdit,query){
            this.newPayOff.facMissionIds = []
            if(!isEdit){
                await this.purchaseMissionPage()
                this.$nextTick(()=>{
                    let pathInfo = {
                        path: this.isSampleMaterial ? '/samplePayoffDetail' : '/payoffDetail',
                        query:query
                    }
                    this.$router.push(pathInfo)
                })
            }

        },
        // 新建送料单
        newPayoffOrder(belongModule){
            // 权限
            if(!this.powerJudgement.permissions("fac.deliveryOrder.add")){
                return
            }
            this.newPayOff.belongModule = belongModule
            this.newPayOff.visible = true

        },
        //获取动态配置数组
        getConfigArr(code) {
            let params = {
                unitId: this.unitId,
                moduleCode: code
            };
            MPRFieldConfigList(params).then(res => {
                this.configArr = res.data.data.fieldConfigList;
                //解决直接渲染表格错乱的问题
                this.$nextTick(function(){
                    this.canShow = true;
                })
            })
        },
        // 图片预览
        imgList(item) {
            this.imgIndex = 0;
            // this.imgLists = [];
            // item.forEach($item =>{
            //     this.imgLists.push({path:$item})
            // })
            this.imgLists = item.commonMaterialsPictureList;
            this.centerDialogVisible = true;
        },
        formData(val) {
            this.form = val;
            console.warn(this.form);
        },
        //待送料看板
        async purchaseMissionPage() {
            let params = {
                queryColumn:this.queryColumn,
                ids:this.form.ids,
                searchParam:this.form.searchParam,
                searchType:this.form.searchType,
                factoryId:this.facId,
                pageNo:this.currentPage,
                pageSize:20,
                orderNoId:this.form.order?this.form.order:'',
                materialsKindId:this.form.materielCategory?this.form.materielCategory:'',
                supplierId:this.form.supplier?this.form.supplier:'',
                status:this.form.status?this.form.status:'',
                deliveryStartDate:this.form.planDay?fun.dateFormatter(this.form.planDay[0],false):'',
                deliveryEndDate:this.form.planDay?fun.dateFormatter(this.form.planDay[1],false):'',
                touchingStartDate:this.form.orderDate?fun.dateFormatter(this.form.orderDate[0],false):'',
                touchingEndDate:this.form.orderDate?fun.dateFormatter(this.form.orderDate[1],false):'',
                materialIds: this.form.materialIds?[this.form.materialIds]:[],
                outsideFactoryIds:this.form.outsideFactoryIds,
            };
            this.loading = true
            await purchaseMissionPage(params).then(res=>{
                this.loading = false
                console.log(res);
                this.missionTable = res.data.data.list;
                this.total = res.data.data.totalCount;
            })
        },
        handleCurrentChange() {
            this.purchaseMissionPage();
        },
        filterData(val) {
            this.form = val
            this.purchaseMissionPage();
        },
        openPayoffOrder(row,index,belongModule) {
            this.newPayOff.belongModule = belongModule
            this.newPayOff.facMissionIds = [row.facMissionId]
            this.newPayOff.visible = true
        },
        //导出待送料看板
        exportExcelOnMission() {
            let params = {
                queryColumn:this.queryColumn,
                ids:this.form.ids,
                searchParam:this.form.searchParam,
                searchType:this.form.searchType,
                factoryId:this.facId,
                pageNo:this.currentPage,
                pageSize:20,
                orderNoId:this.form.order?this.form.order:'',
                styleIds:this.form.styleIds,
                materialsKindId:this.form.materielCategory?this.form.materielCategory:'',
                supplierId:this.form.supplier?this.form.supplier:'',
                deliveryStartDate:this.form.planDay?fun.dateFormatter(this.form.planDay[0],false):'',
                deliveryEndDate:this.form.planDay?fun.dateFormatter(this.form.planDay[1],false):'',
                touchingStartDate:this.form.orderDate?fun.dateFormatter(this.form.orderDate[0],false):'',
                touchingEndDate:this.form.orderDate?fun.dateFormatter(this.form.orderDate[1],false):'',
                materialIds: this.form.materialIds?[this.form.materialIds]:[],
                outsideFactoryIds:this.form.outsideFactoryIds,
                status:this.form.status?this.form.status:'',
            };
            exportWaitDelivery(params).then(res=>{
                console.log(res);
                this.fileData =res.data;
                //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                let url = window.URL.createObjectURL(res.data);
                console.log(url);
                let a = window.document.createElement('a');
                a.setAttribute('href',url);
                a.setAttribute('download','待送料看板.xls');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        },
        excel() {
            this.exportExcelOnMission();
        }
    },
    created() {
        // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
        this.getConfigArr('DELIVER');
    }
}
</script>

<style lang="scss" scoped>
.wait-pay-off-list {
    &.scroll-content{
        margin:16px 24px 0;
        height: calc(100% - 16px);
    }
    .pay-off-filter{
        position: absolute;
        top: 6px;
        right: 24px;
        .filter-block {
            display: inline-block;
            font-size: 12px;
            padding-right: 8px;
            border-right: 1px solid #DFE6EC;
        }
    }

    &-filter {
        margin-top:12px;
    }
    &-tab {
        margin:12px 0 8px 0;
        display:flex;
        justify-content: space-between;
        align-items: center;
    }
    .tab {
        width:100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &__select{
        display:flex;
        justify-content: flex-start;
        margin: 16px 0;
        cursor: pointer;
        font-size: 12px;
            .tab__default-style {
                display:flex;
                justify-content: center;
                align-items: center;
                width:80px;
                height:32px;
                background-color: #fff;
                border: 1px solid #939FB8;
                box-sizing: border-box;
                color: #939FB8;
                &:last-child{
                    margin-left:-1px;
                }
            }
            .tab__gray-style{
                background-color: #939FB8;
                color: #fff;
            }
        }
    }
    .pay-off-list-content {
        flex: 1;
        .line {
            height:32px;
            width:1px;
            background-color: rgba(230,234,240,1);
        }
        .blue {
            color:#1CA1FF;
            text-decoration:underline;
            cursor: pointer;
        }
    }
    .mission {
        .cell__row {
            height: 24px;
            line-height: 24px;
            padding: 0 10px;

            display: flex;
            flex-direction: column;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child{
                border:none;
            }
        }
    }
    .supplier {
         .cell__row {
            height: 24px;
            line-height: 24px;
             padding: 0 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
        }
    }
    .boder-none {
        border: none;
    }
    .red {
        color: red;
    }
    .page {
        margin: 20px 0;
        text-align: right;
        margin-right: 32px;
    }
}
</style>
<style lang="scss">
@import '../../../../assets/style/el-table.scss';
.wait-pay-off-list .pay-off-list-content{
    .el-table td .cell {
        line-height: 18px;
    }
}
</style>



