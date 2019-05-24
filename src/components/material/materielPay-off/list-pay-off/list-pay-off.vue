<template>
    <div :class="['pay-off-list-index', 'scroll-content',{'sample':isSampleMaterial}]">
        <page-title style="background: #fff;padding: 7px 24px;margin:0 -24px;" v-if="isSampleMaterial" title="样料送料单列表">
            <div class="btns">
                <el-input @change="handleCurrentChange" v-model="queryColumn" class="mgr8" style="width: 260px;font-size: 12px;" placeholder="输入送料单/送料员/商品款号/生产单号/物料/供应商"
                          icon="search"></el-input>
                <span>筛选</span>
                <list-filter
                             @filter="submit"
                             ref="payOffFilter"
                             :belongModule="belongModule"></list-filter>
                <nf-button  fsize='12' type="warning" @click="newPayoffOrder(1)">+ 新建样料送料</nf-button>
            </div>
        </page-title>
        <!--送料单筛选条件-->
        <div v-else class="pay-off-filter">
            <div class="filter-block">
                <el-input @change="handleCurrentChange" v-model="queryColumn" class="mgr8" style="width: 280px;font-size: 12px;" :placeholder="belongModule==0?'输入送料单/送料员/商品款号/生产单号/物料/供应商':'输入送料通知单/操作员/商品款号/生产单号/物料/供应商'"
                          icon="search"></el-input>
                <span>筛选</span>
                <list-filter  @filter="submit"
                              ref="payOffFilter"
                              :belongModule="belongModule"></list-filter>
                <nf-button @click="exportDeliveryListExcel" class="mgl8" fsize='12'>导出表格</nf-button>
            </div>
            <nf-button v-if="belongModule==0" class="mgl8"  fsize='12' @click="newPayoffOrder(0)" type="warning">+新建送料单</nf-button>
            <nf-button v-if="belongModule==2" class="mgl8" fsize='12' @click="newPayoffOrder(2)" type="warning">+送料通知单</nf-button>
        </div>
        <div ref="payOffListContent" class="main-content payofflist-table mgt16" v-loading="loading">
            <el-table class="custom-table tiny-row pay-off-list-table"
                      v-if="canShow"
                      :data="tableData"
                      stripe
                      border
                      :height="tableHeight"
                      :row-class-name="tableRowClassName"
                      :key="'payofflist'+belongModule"
                      style="width: 100%">
                <el-table-column prop="billDeliveryNo" :label="belongModule==2?'送料通知单':'送料单号'" width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row">
                        <div>{{scope.row.billDeliveryNo}}</div>
                            <div v-if="scope.row.cancel">(已撤销)</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="outsideFactoryName" label="加工厂" width="120" >
                </el-table-column>
                <template v-if="isSampleMaterial">
                    <el-table-column prop="zip" label="送料员" width="120" >
                        <template slot-scope="scope">
                            <div class="cell__row">
                                {{scope.row.deliveryerName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="zip" label="送料时间" width="120" >
                        <template slot-scope="scope">
                            <div class="cell__row">
                                {{scope.row.deliveryDate|filterTime}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column class-name="no-padding" prop="styleNo" label="商品款号" v-if="configArr.includes('商品款号')&&!isSampleMaterial"
                                 width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="(item,index) in scope.row.mainSet" :key="index"
                             :style="{'height': getHeight(item.detailList.length), 'line-height': getHeight(item.detailList.length)}">
                            {{item.styleNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  class-name="no-padding" prop="facMissionNo" label="生产单号" v-if="configArr.includes('生产单号')&&belongModule!=1"
                                 width="160" >
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="(item,index) in scope.row.mainSet" :key="index"
                             :style="{'height': getHeight(item.detailList.length), 'line-height': getHeight(item.detailList.length)}">
                            {{item.facMissionNo}}
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="facMissionNo" label="送料工厂" width="160"  v-if="!isSampleMaterial">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="(item,index) in scope.row.mainSet" :key="index"-->
                             <!--:style="{'height': getHeight(item.detailList.length), 'line-height': getHeight(item.detailList.length)}">-->
                            <!--{{item.factoryName}}-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column class-name="no-padding" prop="city" label="分类" v-if="configArr.includes('分类')" width="120" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="index"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row border-bottom" v-for="items in item.detailList" :key="items">
                                {{items.kindName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" prop="commonMaterialsSkuPicture" label="图片" v-if="configArr.includes('图片')" width="60">
                    <template slot-scope="scope">
                        <div style="width:100%;" v-for="(items,index) in scope.row.mainSet" :key="items"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="item in items.detailList" :key="item">
                                <img style="display:inline-block;vertical-align:middle;width: 24px;height: 24px;"
                                    v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                                    @click="imgList(item)"
                                    :src="item.commonMaterialsPictureList[0].path?item.commonMaterialsPictureList[0].path:item.commonMaterialsPictureList[0]"
                                    alt="">
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" prop="address" label="物料款号" v-if="configArr.includes('物料款号')" width="120"
                                 >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.materialsNo}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="物料名称" v-if="configArr.includes('物料名称')" width="120" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.materialsName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="颜色" v-if="configArr.includes('颜色')" width="120" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.colorName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="规格" v-if="configArr.includes('规格')" width="120" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.specificationsRemark?items.specificationsRemark:items.specificationsNo}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="供应商" v-if="configArr.includes('供应商')" width="120" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.supplierName}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" width="140"
                                 >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.supplierStyleNo}}/{{items.supplierColorNo}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="样料" width="120"  v-if="isSampleMaterial">
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.sampleMaterial?'样料':''}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="库存单位" v-if="configArr.includes('单位')" width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.unit}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="物料需求"
                                 v-if="configArr.includes('物料需求')&&!isSampleMaterial"
                                 width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.planBuyQuantity}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-if="belongModule==2" class-name="no-padding"  label="本次通知"  width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.notifyQuantity}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  label="本次送料" width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.deliveryNowQuantity}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="送料仓库" min-width="120" >
                    <template slot-scope="scope">
                        <div class="cell__row">
                            {{scope.row.deliveryStorehouseName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  v-if="belongModule!=1" prop="totalNotify" label="合计送料" min-width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.totalDelivery}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding"  v-if="belongModule==2" prop="totalNotify" label="合计通知" min-width="70" >
                    <template slot-scope="scope">
                        <div v-for="(item,index) in scope.row.mainSet" :key="item"
                             :class="{'border-bottom': index!==scope.row.mainSet.length - 1}">
                            <div class="cell__row" v-for="items in item.detailList" :key="items">
                                {{items.totalNotify}}
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <template v-if="!isSampleMaterial">
                    <el-table-column :label="belongModule==2?'操作员':'送料员'" width="120" >
                        <template slot-scope="scope">
                            <div class="cell__row">
                                {{scope.row.deliveryerName}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="belongModule==2?'操作日期':'送料日期'" min-width="120" >
                        <template slot-scope="scope">
                            <div class="cell__row">
                                {{scope.row.deliveryDate|filterTime}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column v-if="belongModule==2" prop="deliveryStatus" label="状态" min-width="80" >
                    <template slot-scope="scope">
                        <div :class="['cell__row',scope.row.deliveryStatus==='FINISH'?'green':'red']" >
                            {{scope.row.deliveryStatus=='WAIT_START'?'未送料':scope.row.deliveryStatus==='ONGOING'?'未送齐':'已送齐'}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column class-name="no-padding" prop="zip" label="操作" fixed="right" :width="belongModule==2?160:80" >
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div class="item blue pointer" @click="checkDetail(scope.row,scope.$index)">查看详情</div>
                            <div v-if="belongModule==2" :class="['item','pointer',scope.row.deliveryIdForNotify?'gray':'blue']" @click="goPayOff(scope.row,scope.$index,0)">去送料</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <!--新建送料单-->
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
                    :billDeliveryNotify="newPayOff.billDeliveryNotify"
                    @cancel="cancelNewPayOff"
                    @success="successNewPayOff"
            ></new-pay-off>
        </transition>
    </div>
</template>

<script>
    import NewPayOff from "../new-pay-off/new-pay-off";

    const fun = require('../../../Common/commonFun.js')
    import listFilter from './list-filter-pay-off'
    import {payOffPage, exportDeliveryListExcel} from '@/api'
    import {
        MPRFieldConfigList
    } from '@/api/material.js'

    export default {
        name: 'materialPayOffList',
        components: {
            NewPayOff,
            listFilter
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                form: {},
                total: 0,
                currentPage: 1,
                tableData: [],
                configArr: [],       //配置表头数组
                canShow: false,      //控制是否显示表格
                queryColumn:'',
                tableHeight:300,
                newPayOff:{
                    visible:false,
                    belongModule:0,
                    billDeliveryNotify:{}, //选中的通知单
                }
            }
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            isSampleMaterial() {
                return this.$route.path === '/sampleMarterielPayoffList'
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            belongModule(){
                return this.isSampleMaterial?1:this.$route.query.belongModule
            }
        },
        mounted () {
            this.$refs.payOffFilter.filter()
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.payOffListContent.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function() {
                    self.tableHeight = self.$refs.payOffListContent.offsetHeight
                }
            })
        },
        watch: {
        },
        methods: {
            // 取消新建送料单
            cancelNewPayOff(){
                this.newPayOff.billDeliveryNotify = {}
            },
            // 新建送料单成功
            async successNewPayOff(isEdit,query){
                this.newPayOff.billDeliveryNotify = {}
                if(!isEdit){
                    await this.getList()
                    this.$nextTick(()=>{
                        let pathInfo = {
                            path: this.isSampleMaterial ? '/samplePayoffDetail' : '/payoffDetail',
                            query:query
                        }
                        this.$router.push(pathInfo)
                    })
                }
            },
            // 去送料
            goPayOff(row,index,belongModule){
                if(row.deliveryIdForNotify)
                    return
                this.newPayOff.belongModule = belongModule
                this.newPayOff.billDeliveryNotify = {
                    billDeliveryNotifyId:row.billDeliveryId, //列表的样料单id和样料通知单id公用，所以取样料单id
                    billDeliveryNotifyNo:row.billDeliveryNo//列表的样料单No和样料通知单id公用，所以取样料单No
                }
                this.newPayOff.visible = true
            },
            // 设置高度
            getHeight(length) {
                let height = ''
                if (length == 0) {
                    height = '24px'
                } else {
                    height = 24 * length + 'px'
                }
                return height
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
                    this.$nextTick(function () {
                        this.canShow = true;
                    })
                })
            },
            // 新建
            newPayoffOrder(belongModule) {
                if(belongModule==1){
                    // 样料送料权限
                    if (!this.powerJudgement.permissions("fac.sampleDeliveryOrder.add")) {
                        return
                    }
                    this.newPayOff.belongModule = belongModule
                    this.newPayOff.visible = true
                } else{
                    // 送料权限
                    if(!this.powerJudgement.permissions("fac.deliveryOrder.add")){
                        return
                    }
                    this.newPayOff.belongModule = belongModule
                    this.newPayOff.visible = true
                }
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if (row.commonMaterialsPictureList[0].path) {
                    this.imgIndex = 0;
                    this.imgLists = row.commonMaterialsPictureList;
                } else {
                    this.imgLists = []
                    row.commonMaterialsPictureList.forEach(item => {
                        this.imgLists.push({path: item})
                    })
                }

                this.centerDialogVisible = true;
            },
            tableRowClassName(row, index) {
                if (row.cancel) {
                    return 'cancel-row';
                } else {
                    return '';
                }
            },
            submit(val) {
                this.form = val
                this.getList()
            },
            async getList() {
                let cancel;
                if (this.form.cancel) {
                    if (this.form.cancel.length > 1) {
                        cancel = null
                    } else {
                        cancel = this.form.cancel[0]
                    }
                } else {
                    cancel = 0
                }

                let params = {
                    queryColumn:this.queryColumn,
                    ids: this.form.ids,
                    searchParam: this.form.searchParam,
                    searchType: this.form.searchType,
                    unitId: this.facId,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    deliveryOrderNo: this.form.order ? this.form.order : '',
                    deliveryStartDate: this.form.date ? fun.dateFormatter(this.form.date[0], false) : '',
                    deliveryEndDate: this.form.date ? fun.dateFormatter(this.form.date[1], false) : '',
                    storehouseId: this.form.storeId ? this.form.storeId : '',
                    deliveryerId: this.form.deliveryer ? this.form.deliveryer : '',
                    supplierId: this.form.supplier ? this.form.supplier : '',
                    facMissionId: this.form.missionNo ? this.form.missionNo : '',
                    cancel: cancel,
                    factoryIds: this.form.factoryIds ? this.form.factoryIds : [],
                    belongModule: this.belongModule,
                    materialsNo: this.form.materialsNo
                };
                if (this.belongModule!=2) {
                    params.addTypes =[1,2,3,4]
                } else{
                    params.status = this.form.status
                }
                this.loading = true
                await payOffPage(params).then(res => {
                    this.loading = false
                    console.log(res);
                    this.tableData = res.data.data.orderNoSet;
                    this.total = res.data.data.total;
                })
            },
            handleCurrentChange() {
                this.getList();
            },
            exportDeliveryListExcel() {
                let params = {
                    queryColumn:this.queryColumn,
                    ids: this.form.ids,
                    searchParam: this.form.searchParam,
                    searchType: this.form.searchType,
                    unitId: this.facId,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    deliveryOrderNo: this.form.order ? this.form.order : '',
                    deliveryStartDate: this.form.date ? fun.dateFormatter(this.form.date[0], false) : '',
                    deliveryEndDate: this.form.date ? fun.dateFormatter(this.form.date[1], false) : '',
                    storehouseId: this.form.storeId ? this.form.storeId : '',
                    deliveryerId: this.form.deliveryer ? this.form.deliveryer : '',
                    supplierId: this.form.supplier ? this.form.supplier : '',
                    // styleNos:this.form.styleNos,
                    facMissionId: this.form.missionNo ? this.form.missionNo : '',
                    factoryIds: this.form.factoryIds ? this.form.factoryIds : [],
                    // designStyleNos: this.isSampleMaterial ? this.form.designStyleNos : undefined,
                    belongModule: this.belongModule,
                };
                if (this.belongModule!=2) {
                    params.addTypes =[1,2,3,4]
                } else{
                    params.status = this.form.status
                }
                exportDeliveryListExcel(params).then(res => {
                    console.log(res);
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '送料单列表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            checkDetail(val, index) {
                if (this.isSampleMaterial) {
                    this.$router.push({path:'/samplePayoffDetail',query:{id:val.billDeliveryId,belongModule:this.belongModule}})
                } else {
                    this.$router.push({path:'/payoffDetail',query:{id:val.billDeliveryId,belongModule:this.belongModule}})
                }
            }
        },
        created() {
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('DELIVER');
            // this.getList();
            console.log('送料单created')
        },

    }
</script>

<style lang="scss" scoped>
    .pay-off-list-index{
        &.scroll-content{
            margin:0 24px 0;
            height: 100%;
        }
        &.scroll-content.sample{
            margin:-24px 0;
            height: calc(100% + 48px);
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
    }
    .blue {
        cursor: pointer;
    }

    .pay-off-list-table {
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
            &:last-child {
                border: none;
            }
        }
    }

    .border-bottom {
        border-bottom: 1px solid #E6EAF0;
    }

    .page {
        margin: 20px 0;
        text-align: right;
        margin-right: 32px;
    }
</style>
<style lang="scss">
    @import '../../../../assets/style/el-table.scss';

    .pay-off-list-index {
        .pay-off-list-table .el-table__body,
        .pay-off-list-table .el-table__header {
            width: 100% !important;
        }
        .payofflist-table{
            .el-table__body {
                .cell,
                td {
                    padding: 0;
                }
            }
            .el-table .cancel-row {
                td {
                    color: #A2ABB8;
                }
            }
        }

        /*.el-table .cell {*/
        /*line-height :12px;*/
        /*}*/

    }
</style>

