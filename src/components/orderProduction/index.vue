<template>
    <div class="orderProduction scroll-content" v-loading="loading" element-loading-text="拼命加载中">
        <div style="padding: 0 24px;">
            <page-title style="padding: 5px;" title="生产订单">
                <div class="btn-group">
                    <el-input v-model="keyWord" @input="handleSearch" style="width: 200px;margin-right: 10px;font-size: 12px;" placeholder="输入订单号/款号搜索"></el-input>
                    <div style="display: flex;align-items: center;margin-left: 5px;">
                        <span style="margin-right: 5px;">筛选:</span>
                        <order-filter type="orderList" @submit="handleOrderFilter"></order-filter>
                    </div>
                    <nf-button @click.native="excelStatic.dialogVisibleExcel = true">从Excel导入</nf-button>
                    <nf-button @click.native="orderProduction()">订单配置</nf-button>
                    <!--<nf-button @click.native="configOrderDialog = true">配置转工单必填</nf-button>-->
                    <nf-button type="warning" svg="icon-btn-add" @click.native="clickskip('informal')">
                        预下单
                    </nf-button>
                    <nf-button type="warning" svg="icon-btn-add" @click.native="clickskip('formal')">
                        新建生产订单
                    </nf-button>

                </div>
            </page-title>
            <plan-execute-work-panel @finishLoading="finishLoading" ref="planPanel" config-code="prd_order"></plan-execute-work-panel>
        </div>

        <div style="padding: 0 24px;" class="orderProduction-table" ref="orderTable">
            <el-table
                    :height="tableHeight"
                    ref="singleTable"
                    :data="facPrdOrderList.list"
                    border
                    highlight-current-row
                    @current-change="handleCurrentChanges"
                    class="mission "
                    key="mission"
                    style="width: 100%">
                <el-table-column sortable prop="orderNo" label="单据号" width="160" align="center">
                </el-table-column>
                <el-table-column prop="type" label="单据类型" width="160" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.type==0?'预下单':scope.row.type==1?'生产订单':'订单调整单'}}</span>
                    </template>
                </el-table-column>
                <el-table-column sortable prop="placeorderAt" label="制单日期" width="140" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.placeorderAt | filterTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="加工厂商" width="120" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.isOutsideFac==1">
                            {{scope.row.commonOutsideFactoryName}}
                        </div>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="chargerName" label="负责人" width="120" align="center">
                </el-table-column>
                <el-table-column label="商品款号" width="200" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                            {{item.styleNo}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="客户" width="120" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                            <span>{{item.custName?item.custName:'-'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="商品数量" width="100" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                            {{item.totalNum}}
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column label="单价" width="100" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">-->
                            <!--<span v-if="scope.row.isOutsideFac==1">{{item.goodsProcessUnitPrice}}</span>-->
                            <!--<span v-else>-</span>-->
                        <!--</div>-->

                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="货期" width="140" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                            {{item.goodsDeliveryAt| filterTime}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" prop="createByName" width="140" align="center">
                    <!-- <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                            {{item.createByName?item.createByName :'-'}}
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column :label="item.name" width="140" align="center" v-for="item in selectedConfigList" :key="item.id">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="$item in scope.row.facPrdOrderGoodsCustomerList">
                            <span v-if="item.fieldCode!=='goodsPictures' && item.fieldCode!=='goodsDescribe'">{{$item.facPrdOrderGoodsInfoDTO[item.fieldCode]}}</span>
                            <span v-if="item.fieldCode==='goodsDescribe'" v-html="$item.facPrdOrderGoodsInfoDTO.goodsDescribe"></span>
                            <img @click="imgList($item.facPrdOrderGoodsInfoDTO.goodsPictures)" v-if="item.fieldCode==='goodsPictures'&&$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" style="width: 32px;height: 32px;cursor: pointer;margin: 0 auto;" :src="$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" alt="" >
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column label="厂商货号" width="140" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">-->
                            <!--{{item.plantArticleNumber}}-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="buyNo" label="采购单号" width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.buyNo|| '无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="concatPrdOrderNo" label="关联订单号" width="140" align="center">
                </el-table-column>
                <!--<el-table-column prop="remark" label="单据备注" width="100" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<span>{{scope.row.remark?scope.row.remark:'-'}}</span>-->

                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column prop="remark" label="下单类型" width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.placeOrderType}}</span>

                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="状态" width="140" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.statusName}} <span
                                v-if="scope.row.statusRemark">({{scope.row.statusRemark}})</span></span>
                        <p>{{scope.row.auditorUsers}}</p>

                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="审批备注" width="100" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.lastReviewLog}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="zip" label="操作" fixed="right" width="120" class-name="cellHeight" align="center">
                    <template slot-scope="scope">
                        <div class="opera">
                            <div class="blue" @click="goDetail(scope.row.facPrdOrderId,scope.row.type)">查看</div>
                            <div class="blue">
                                <el-dropdown>
                                    <nf-button style="font-size:12px;">打印</nf-button>
                                    <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
                                        <el-dropdown-item class=" fs12" disabled>选择打印模板</el-dropdown-item>
                                        <el-dropdown-item :divided="index==0"
                                                          :class="{active: item.defaultStatus ==1 ? true : false}"
                                                          v-for="(item, index) in list" :key="index"
                                                          @click.native="go(item,scope.row.facPrdOrderId,scope.row.status)">{{item.name}}
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-row style="padding: 0 24px;" class="return-list__pagination" type="flex" justify="end">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="facPrdOrderList.totalCount">
            </el-pagination>
        </el-row>

        <!--<div class="setting-table" @click="dynamicVisibleShow">-->
            <!--<icon type="icon-topbar-setting"></icon>-->
            <!--<span class="setting-table-font">配置商品显示字段</span>-->
        <!--</div>-->
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!--导入excel组件-->
        <import-dialog
                :templateText="'下载样表文件'"
                :loading="excelStatic.loading"
                :title="'从Excel导入订单'"
                :visible.sync="excelStatic.dialogVisibleExcel"
                @downloadTemplate="downloadTemplate"
                @confirm="importExcel">
        </import-dialog>

        <!--导入结果反馈-->
        <el-dialog
                class="custom-dialog"
                title="导入结果反馈"
                :visible.sync="excelStatic.dialogResult"
                size="tiny">
            <div style="margin-bottom: 20px;">
                导入成功{{excelStatic.excelDataSucc}}行数据;导入失败{{excelStatic.excelDataErr}}行数据
            </div>
            <div v-if="excelStatic.failureId" style="margin-bottom: 20px;">
                <div>导入失败可能的原因有：</div>
                <div>1、行与行之间存在空行；</div>
                <div>2、单据号、商品款号、货期、颜色、尺码、数量填写为空；</div>
                <div>3、无法在系统商品档案中找到该行数据的商品款号；</div>
                <div>4、该行数据中的颜色、尺码、内长无法与商品档案中的相匹配；</div>
                <div>5、下单类型、加工厂商、客户与系统中的资料无法匹配；</div>
                <div>6、日期、单价、数量等不符合格式，</div>
                <div>日期：2018/10/01或2018-10-01</div>
                <div>单价：99.00</div>
                <div>数量：100</div>
            </div>
            <div v-if="excelStatic.failureId" @click="exportErrorExcel"
                 style="color: #1CA1FF;text-decoration: underline;cursor: pointer;text-align: center;">下载导入失败列表
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="excelStatic.dialogResult = false">确 定</el-button>
  </span>
        </el-dialog>

    </div>

</template>

<script>
    import FilterForm from './components/filter-form';
    import {facPrdOrderPage, facTemplates, facPrdOrderImportExcel, exportErrorExcel,getFieldConfig,updateFieldConfig} from '@/api/api'
    import importDialog from '@/components/Common/importDialog.vue';
    import PlanExecuteWorkPanel from "@/components/goodsPlan/procurementPlan/list/components/planExecuteWorkPanel.vue";
    import orderFilter from '../documentReview/components/orderFilter'

    export default {
        name: "orderProductionIndex",
        components: {FilterForm, importDialog,PlanExecuteWorkPanel,orderFilter},
        data() {
            return {
                tableHeight: 0,
                form: {},
                keyWord: '',
                value9:'',
                options4:[],
                selectedConfigList:[],

                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,

                facPrdOrderList: {},
                currentPage: 1,
                loading: false,
                list: [],
                excelStatic: {
                    dialogResult: false,
                    dialogVisibleExcel: false,
                    loading: false,
                    excelData: true,
                    excelDataErr: 0,
                    excelDataSucc: 0,
                    failureId: ''
                },
                currentRow:'',//存储当前选中的状态
                excelDemoUrl: 'https://image3.myjuniu.com/50ffcf88a78942e3845024e89980b73e_pro_251ea876fdaf51933ac0e6e775aa137c.xlsx?attname=生产订单模板.xlsx',
            }
        },
        created() {
            this.getFacPrdOrderPage()
            this.getFacTemplates()
            this.getSelectedConfigList()

        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
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
        methods: {
            finishLoading() {
                this.$nextTick(() => {
                    let self = this;
                    this.tableHeight = this.$refs.orderTable.offsetHeight
                    // 通过捕获系统的onresize事件触发去改变原有的高度
                    window.onresize = function() {
                        self.tableHeight = self.$refs.orderTable.offsetHeight
                    }
                })
            },
            handleSearch(v) {
                this.currentPage = 1
                this.getFacPrdOrderPage(this.form)
            },
            handleOrderFilter(form) {
                this.form = form
                this.currentPage = 1
                this.getFacPrdOrderPage(form)
            },
            // 订单配置跳转
            orderProduction(){
                 // 权限
                if(!this.powerJudgement.permissions("fac.prcmission.deploy")){
                    return
                }
                this.$router.push('/orderProductionConfig');
            },
            // 图片预览
            imgList(row) {
                this.imgIndex = 0;
                this.imgLists = row
                // this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            getSelectedConfigList(){
                getFieldConfig({unitId:this.unitId}).then(res=>{
                    if(res.data.code === 0){
                        this.selectedConfigList = res.data.data.selectedConfigList;
                    }
                })
            },


            downloadTemplate() {
                window.open(this.excelDemoUrl)
            },
            exportErrorExcel() {
                //导出 导入失败的列表
                let params = {
                    importId: this.excelStatic.failureId
                }
                exportErrorExcel(params).then(res => {
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '导入失败列表' + '.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
                this.excelStatic.dialogResult = false
            },
            importExcel(v) {
                this.excelStatic.loading = true
                let form = new FormData()
                form.append("uploadfile", v);
                // 其他参数
                form.append("userId", this.userId);
                form.append("unitId", this.unitId);
                facPrdOrderImportExcel(form).then(res => {
                    this.excelStatic.loading = false
                    if (res.data.code == 0) {
                        this.getFacPrdOrderPage(this.form)
                        this.excelStatic.dialogVisibleExcel = false
                        this.excelStatic.dialogResult = true
                        this.excelStatic.excelDataErr = res.data.faithNum
                        this.excelStatic.excelDataSucc = res.data.successNum

                        this.excelStatic.failureId = res.data.failureId
                        // this.$message.success('导入成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //隐藏导入excel组件
            // closeUploadComponent(){
            //     this.excelStatic.loading = false;
            //     this.excelStatic.excelData = true;
            //     this.excelStatic.excelDataErr = 0;
            //     this.excelStatic.excelDataSucc = 0;
            //     this.dialogVisibleExcel = false
            // },
            //提交excel
            commitExcelData(form) {
                if (form) {
                    this.excelStatic.loading = true;
                    // importGoodsExcel(form).then(res =>{
                    //     if(res.data.code === 0){
                    //         this.excelStatic.loading = false;
                    //         this.excelStatic.excelData = false;
                    //         this.excelStatic.excelDataErr = res.data.faithNum;
                    //         this.excelStatic.excelDataSucc = res.data.successNum;
                    //         this.uploadFinish();
                    //     }else {
                    //         this.excelStatic.loading = false;
                    //         this.$message.error(res.data.message);
                    //     }
                    // })
                }
            },
            // 获取打印列表
            getFacTemplates() {
                let params = {
                    userId: this.userId,
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    type: 'order',
                    pageNo: 1,
                    pageSize: 9999,
                    using: true,
                    typeId: ''
                }
                facTemplates(params).then(res => {
                    this.list = res.data.data.list
                })
            },
            // 打印跳转
            go(item, id,status) {

                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.print")) {
                    return
                }

                if([0,1,3,4,5,].includes(status)){
                    this.$confirm("订单未正式通过，是否确定打印?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                    .then(() => {
                        window.open(`/#/printShow?templateId=${item.id}&businessId=${id}&printType=print&billType=order`)
                    })
                    .catch(() => {});
                } else {
                    window.open(`/#/printShow?templateId=${item.id}&businessId=${id}&printType=print&billType=order`)
                }
            },
            handleCurrentChange() {

                this.getFacPrdOrderPage(this.form)
            },
            // 表格单选改变查阅后的状态
            handleCurrentChanges(val){
                 this.currentRow = val;
            },
            // 获取生产订单列表
            getFacPrdOrderPage(val) {
                this.loading = true
                let obj = {
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyWord: this.keyWord,
                    pageNo: this.currentPage,
                    pageSize: 20,
                    userId: this.userId,
                    modelName: 'FAC_PRD_ORDER',
                    statusList: [0,1,2,3,4,6],
                    ...val
                };
                facPrdOrderPage(obj).then(res => {
                    this.loading = false
                    this.facPrdOrderList = res.data.data
                })
            },
            // 新建生产订单
            clickskip(type) {
                // 权限
                if (type=='informal'&&!this.powerJudgement.permissions("fac.prcmission.advance")) {
                    return
                }
                if (type=='formal'&&!this.powerJudgement.permissions("fac.prcmission.add")) {
                    return
                }

                this.$store.dispatch('deleteVisitedLive', 'orderProductionNew');
                this.$store.dispatch('deleteVisitedView', {path: '/orderProductionNew'});

                //
                let that = this
                setTimeout(function () {
                    that.$router.push({
                        path: '/orderProductionNew',
                        query: {type}
                    })
                }, 200)

            },
            //跳转详情页面
            goDetail(id, status) {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.query")) {
                    return
                }

                let type = '';
                if (status === 0) {
                    //预下单
                    type = 'informal'
                } else if(status === 1){
                    type = 'formal'
                }else {
                    type = 3
                }
                console.log(id);
                this.$router.push({
                    path: status===2?`/adjustOrder`:'/orderProductioDetail',
                    query: {id, type,jumpFrom:true},
                })
            }

        }
    }
</script>
<style lang="scss">
    @import '../../assets/style/el-table.scss';

    .orderProduction-table{
        tr.current-row > td{
            background: #F1FAFF !important;
        }
    }
    .orderProduction .orderProduction-table {
        .el-table td .cell {
            line-height: 18px;
            padding: 0;
        }
    }

    .cellHeight .cell {
        height: 100%;
    }

    .blue {
        .el-dropdown {
            .nf-button--default {
                border: none !important;
                color: #1CA1FF;
                text-decoration: underline;
            }
        }
    }
</style>
<style scoped lang="scss">
    .orderProduction {
        .btn-group{
            display: flex;
            justify-content: flex-end;
            >button{
                margin-left: 5px;
            }
        }
        .return-list__pagination {
            margin-top: 16px;
        }
        .orderProduction-table {
            flex: 1;
            overflow-y: auto;
            margin-top: 16px;
            .opera {
                display: flex;
                /*justify-content: space-between;*/
                justify-content: center;
                align-items: center;
                /*padding: 0 24px;*/
                box-sizing: border-box;
                height: 100%;
            }
            .line {
                height: 32px;
                width: 1px;
                background-color: rgba(230, 234, 240, 1);
            }
            .blue {
                display: flex;
                /*justify-content: space-between;*/
                justify-content: center;
                align-items: center;
                color: #1CA1FF;
                text-decoration: underline;
                cursor: pointer;
                text-align: center;
                width: 100%;
                height: 100%;
                border-right: 1px solid #E6EAF0;
            }
        }
        .setting-table {
            float: left;
            line-height: 32px;
            padding-top: 18px;
            padding-bottom: 30px;
            cursor: pointer;
            .setting-table-font {
                display: inline-block;
                font-size: 14px;
                color: #808080;
                vertical-align: middle;
            }
        }
        .mission {
            .cell__row {
                height: 32px;
                line-height: 32px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                word-break: break-all;
                border-bottom: 1px solid #E6EAF0;
                box-sizing: border-box;
                &:last-child {
                    border: none;
                }
                &>span{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

</style>
