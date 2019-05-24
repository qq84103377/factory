<template>
    <div class="sales-plan-detail">
        <page-title :title="detailInfo.name">
            <div class="btns">
                <nf-button fsize="12" @click="$router.go(-1)">历史销售计划</nf-button>
            </div>
        </page-title>
        <div v-loading="loading">
            <!--基本信息-->
            <div class="box-shadow detail-content mgt8">
                <div class="yellow-border-title">
                    <div class="title mgt8">
                        <span>基本信息</span>
                        <span style="margin-left: 290px;">状态：{{getStatusText(detailInfo.status)}}</span>
                        <span class="red" v-if="detailInfo.status ==='REJECTED'">(驳回原因：{{ detailInfo.rejectReason}})</span>
                    </div>
                    <div v-if="detailInfo.isLeader || detailInfo.isAuditor">
                        <nf-button v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)"
                                   @click="$router.push({path:'/salesPlan/edit',query:{type:'edit',salesPlanId:detailInfo.id}})"
                                   class="mgr5" fsize="12">编辑</nf-button>
                        <nf-button :loading="isSubmitting" @click="changePlanStatus('report')"
                                   v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)&&(detailInfo.isLeader || detailInfo.isAuditor)"
                                   class="mgr5" fsize="12" style="color:#FFA914;border:1px solid #FFA914;" >提报</nf-button>
                        <nf-button :loading="isSubmitting" @click="changePlanStatus('pass')"
                                   v-if="detailInfo.status ==='WAIT_AUDIT'&&(detailInfo.isLeader || detailInfo.isAuditor)"
                                   class="mgr5" fsize="12" style="color:#7BDE70;border:1px solid #7BDE70;" >审核通过</nf-button>
                        <nf-button :loading="isSubmitting" @click="beforePlanReject"
                                   v-if="detailInfo.status ==='WAIT_AUDIT'&&(detailInfo.isLeader || detailInfo.isAuditor)"
                                   class="mgr5" fsize="12" style="color:#FA4150;border:1px solid #FA4150;" >审核驳回</nf-button>
                        <nf-button :loading="isSubmitting" @click="beforePlanReAudit"
                                   v-if="detailInfo.status ==='PASS'&&(detailInfo.isLeader || detailInfo.isAuditor)"
                                   class="mgr5" fsize="12" style="color:#FA4150;border:1px solid #FA4150;" >反审核</nf-button>
                    </div>
                </div>
                <div class="detail-item mgt8">
                    <el-row>
                        <el-col :span="8"><div><span>计划单名称：</span><span>{{detailInfo.name}}</span></div></el-col>
                        <el-col :span="8">
                            <div style="position: relative" >
                                <span>计划时段：</span>
                                <span>{{detailInfo.beginDate}} - {{detailInfo.endDate}}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8"><div><span>总负责人：</span><span>{{detailInfo.leaderName}}</span></div></el-col>
                        <el-col :span="8"><div><span>总审核人：</span><span>{{detailInfo.auditorName}}</span></div></el-col>
                        <el-col :span="8"><div><span>单位：</span><span>{{detailInfo.unit}}</span></div></el-col>
                    </el-row>
                </div>
            </div>

            <div class="box-shadow detail-content mgt8">
                <div class="yellow-border-title">
                    <div class="title mgt8">销售门店销售计划</div>
                    <div v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)&&(detailInfo.isLeader || detailInfo.isAuditor)">
                        <nf-button style="color:#FFA914;border:1px solid #FFA914;" fsize="12" @click="$router.push({path:'/salesPlan/addStore',query:{salesPlanId:detailInfo.id}})">增加销售门店</nf-button>
                        <nf-button style="color:#1ca1ff;border:1px solid #1ca1ff;" class="mgl8"  fsize="12" @click="importSalesPlan.visible = true">EXCEL导入</nf-button>
                    </div>
                </div>
                <!--筛选区域-->
                <filter-form  :hasStatus="true" @filter="confirmFilter" :is-leader="detailInfo.isLeader"></filter-form>
                <!--统计表格-->
                <el-table
                        class="custom-table mgt8"
                        :data="[summary]" border>
                    <el-table-column label="统计">
                        <template slot-scope="scope">
                            <span>TTL：{{scope.row.storeCount}}家店铺</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item,index) in tableHeader" :key="index" width="136" align="center"   :label="item.mainTitle">
                        <el-table-column width="68"  prop="lastYearNum" label="去年">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthDatas[index].lastYearNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="68"  prop="thisYearNum" label="今年">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthDatas[index].thisYearNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
                <!--批量操作区域-->
                <div v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)" class="mgt8">
                    <el-dropdown>
                        <nf-button class="mgr5" fsize="12">批量操作</nf-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="beforeRecordBatch('report')"><span class="fs12" >批量提报</span></el-dropdown-item>
                            <el-dropdown-item v-if="detailInfo.isAuditor" @click.native="beforeRecordBatch('pass')"><span class="fs12" >批量通过</span></el-dropdown-item>
                            <el-dropdown-item v-if="detailInfo.isAuditor" @click.native="beforeRecordReject"><span class="fs12" >批量驳回</span></el-dropdown-item>
                            <el-dropdown-item v-if="detailInfo.isAuditor" @click.native="beforeRecordReAduit"><span class="fs12" >批量反审核</span></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <nf-button v-if="detailInfo.isLeader || detailInfo.isAuditor" @click="beforeSetLeader" class="mgr5" fsize="12">设置负责人</nf-button>
                    <nf-button v-if="detailInfo.isLeader || detailInfo.isAuditor" @click="beforeDelete" fsize="12">批量删除</nf-button>
                </div>
                <!--加入该销售计划的店铺-->
                <el-table
                        @selection-change="handleSelectionChange"
                        v-if="customStoreAttr.length"
                        class="custom-table sales-plan-table mgt8"
                        :data="storeList" border
                        style="width: 100%">
                    <tempalte v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)" >
                        <el-table-column fixed="left"
                                type="selection"
                                width="55">
                        </el-table-column>
                    </tempalte>
                    <el-table-column  label="序号" width="50">
                        <template slot-scope="scope">
                            <span>{{scope.$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="68"  prop="brands" label="品牌">
                    </el-table-column>
                    <el-table-column width="68"  prop="largeArea" label="大区">
                    </el-table-column>
                    <el-table-column width="160"  prop="area" label="所在地区">
                    </el-table-column>
                    <el-table-column min-width="160"  prop="name" label="店铺名称">
                    </el-table-column>
                    <el-table-column width="80"  prop="level" label="店铺评级">
                    </el-table-column>
                    <el-table-column prop="attr1s" :label="customStoreAttr[0]" width="120">
                    </el-table-column>
                    <el-table-column prop="attr2s" :label="customStoreAttr[1]" width="120">
                    </el-table-column>
                    <el-table-column prop="attr3s" :label="customStoreAttr[2]" width="120">
                    </el-table-column>
                    <el-table-column width="100"  prop="planStart" label="计划开店时间">
                    </el-table-column>
                    <el-table-column width="100"  prop="planEnd" label="计划关店时间">
                    </el-table-column>

                    <el-table-column v-for="(item,index) in tableHeader" :key="index" width="136" align="center"   :label="item.mainTitle">
                        <el-table-column width="68"  prop="lastYearNum" label="去年">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthDatas[index].lastYearNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column width="68"  prop="thisYearNum" label="今年">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthDatas[index].thisYearNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column width="100"  prop="remark" label="备注">
                    </el-table-column>
                    <el-table-column width="120"  prop="leaderName" label="负责人">
                    </el-table-column>
                    <el-table-column width="160"  prop="reportAt" label="提报时间">
                    </el-table-column>
                    <el-table-column width="130"  prop="status" label="状态">
                        <template slot-scope="scope">
                            <div :class="{'gray':['NOT_REPORT','DELETED'].includes(scope.row.status),
                                            'blue':scope.row.status === 'WAIT_AUDIT',
                                            'red':scope.row.status === 'REJECTED'}">
                                {{getStatusText(scope.row.status)}}
                                <span v-if="scope.row.status === 'REJECTED'">（驳回原因：{{scope.row.rejectReason}}）</span>
                            </div>
                        </template>
                    </el-table-column>
                    <tempalte v-if="['NOT_REPORT','REJECTED'].includes(detailInfo.status)" >
                        <el-table-column class-name="no-padding"
                                         align="center" fixed="right"  label="操作">
                            <template slot-scope="scope">
                                <div class="action-list pointer">
                                    <div @click="beforeSetSalesTarget(scope.row)"
                                         v-if="['NOT_REPORT','REJECTED'].includes(scope.row.status)" class="item blue ">编辑</div>
                                    <div @click="confirmRecordBacth('report',[scope.row.id])"
                                         v-if="['NOT_REPORT','REJECTED'].includes(scope.row.status)"
                                         class="item blue">提报</div>
                                    <div @click="confirmRecordBacth('pass',[scope.row.id])"
                                         v-if="scope.row.status === 'WAIT_AUDIT'&&detailInfo.isAuditor" class="item green">通过</div>
                                    <div @click="beforeRecordReject([scope.row.id])"
                                         v-if="scope.row.status === 'WAIT_AUDIT'&&detailInfo.isAuditor"  class="item red">驳回</div>
                                    <div @click="beforeRecordReAduit([scope.row.id])"
                                         v-if="scope.row.status === 'PASS'&& detailInfo.isAuditor" class="item blue">反审核</div>
                                </div>
                            </template>
                        </el-table-column>
                    </tempalte>
                </el-table>
                <div class="text-right mgt8">
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="form.pageNum" :page-size="form.pageSize"
                                   layout="total, prev, pager, next" :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--filter 触发筛选-->
        <set-sales-target @setSuccess='getSalesPlanRecordDetail'
                          :visible.sync="setSalesTarget.visible"
                          :row-data="setSalesTarget.editRow"
                          :custom-store-attr="customStoreAttr"
                          :is-leader="detailInfo.isLeader"


        ></set-sales-target>

        <!--全选弹出框-->
        <check-all-dialog v-model="checkAll.value"
                          :visible.sync="checkAll.visible"
                          title="选择操作范围"
                          current-page-text="对当前页已选店铺进行操作"
                          all-page-text="对列表中所有店铺进行操作"
                          @confirm="confirmCheckAll"></check-all-dialog>

        <!--删除确认框-->
        <el-dialog :modal-append-to-body="false"  class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除勾选的门店？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmDelete">确 认</el-button>
            </div>
        </el-dialog>

        <!--设置负责人-->
        <el-dialog title="设置店铺负责人" :modal-append-to-body="false"  class="custom-dialog set-leader-dialog"
                   :visible.sync="setLeader.visible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                负责人 <worker-leader style="width: 200px;margin-left: 5px" v-model="setLeader.leaderId"
                                   single="single" placeholder="请选择" ></worker-leader>
            </div>
            <div slot="footer">
                <el-button @click="setLeader.visible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmSetLeader">确 认</el-button>
            </div>
        </el-dialog>

        <!--驳回原因弹窗-->
        <el-dialog title="驳回" class="custom-dialog" :visible.sync="auditReject.visible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div>
                <el-input
                        type="textarea"
                        resize = "none"
                        :rows = "6"
                        placeholder="请输入驳回原因"
                        v-model.trim="auditReject.reason">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditReject.visible = false">取 消</el-button>
                <el-button v-if="auditReject.type==='record'" :loading="isSubmitting" type="primary" @click="confirmRecordReject">确认</el-button>
                <el-button v-if="auditReject.type==='plan'" :loading="isSubmitting" type="primary" @click="changePlanStatus('reject')">确认</el-button>
            </div>
        </el-dialog>

        <!--反审核-->
        <el-dialog title="反审核" class="custom-dialog" :visible.sync="reAudit.visible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div>
                <el-input type="textarea"
                          resize = "none"
                          :rows = "6"
                          placeholder="请填写驳回原因"
                          v-model.trim="reAudit.reason">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reAudit.visible = false">取 消</el-button>
                <el-button v-if="reAudit.type==='record'" :loading="isSubmitting" type="primary" @click="confirmRecordReAudit">确认</el-button>
                <el-button v-if="reAudit.type==='plan'" :loading="isSubmitting" type="primary" @click="changePlanStatus('reAudit')">确认</el-button>
            </div>
        </el-dialog>

        <import-dialog title="从Excel导入销售计划" :visible.sync="importSalesPlan.visible" :loading="importSalesPlan.loading" templateText="下载样表文件"
                       @confirm="confirmImport" @downloadTemplate="downloadTemplate"></import-dialog>
        <!--导入失败弹窗-->
        <el-dialog
                title="导入失败"
                :visible.sync="importSalesPlan.resultVisible"
                custom-class="custom-dialog import-result"
                :show-close="false"
                @close="resultVisible = false">
            <div class="text-center">
                <div style="width: 250px;display: inline-block;text-align: left;line-height: 22px;">
                    <p>很遗憾导入失败了，失败原因可能是：</p>
                    <p>1、表头与样表不一致；</p>
                    <p>2、表格中有系统不存在的标签项值；</p>
                    <p>3、表格中有不符合要求的数字格式；</p>
                    <p>4、其他未知原因</p>
                    <p>请重新检查excel表格内容或完善系统基础信息后，再尝试导入！</p>
                </div>
                <p v-if="importSalesPlan.failCount>0" class="mgt26"><span @click="exportErrorExcel" class="pointer blue">下载导入失败列表</span></p>
            </div>
            <div slot="footer" class="text-center">
                <el-button  type="primary" @click="closeResultDialog">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import {getSalesPlanRecordDetail,getStoreAttrs,doRecordBatchDelete,doRecordBatchLeader,
        doRecordBatchReport,doRecordBatchPass,doRecordBatchReject,doRecordBatchReAudit,
        doPlanReport,doPlanAudit,doPlanReAudit,importSalesPlanFromExcel,exportSalesPlanExcelTemplate,exportErrorExcel
    } from '@/api/goodsPlan.js'
    import PageTitle from "@/components/Common/page-title.vue";
    import FilterCheckGroup from "@/components/order/WorkOrders/filter-check-group.vue";
    import FilterCheckItem from "@/components/order/WorkOrders/filter-check-item.vue";
    import FilterForm from "./components/filter-form";
    import SetSalesTarget from "./components/setSalesTarget";
    import ImportDialog from "@/components/Common/importDialog.vue";

    export default {
        name:'storeFilesDetail',
        data() {
            return {
                loading:false,
                detailInfo:{}, //基本信息
                tableHeader:[], //summary和storeList都要用到的动态表头
                summary:{}, //汇总信息
                storeList:[], // 已经添加的店铺信息
                storeListTableHeader:[], //已经添加的店铺动态表头
                isSubmitting:false, //是否处于调用接口中。。。
                form:{
                    provinceId:'',
                    cityId:'',
                    areaId:'',
                    keyword:'',
                    status:[],
                    levels:[],
                    largeAreas:[],
                    leaders:[],
                    brands:[],
                    attr1s:[],
                    attr2s:[],
                    attr3s:[],
                    area:[],
                    pageSize:20,
                    pageNum:1
                },
                customStoreAttr:[], //店铺属性名称
                total:0,
                checkAll:{
                    visible:false,
                    value:'allPage', //currentPage当前页  allPage 所有页
                    filterParams:{},
                    selection:[] ,// 表格选中的行
                    action:'', //弹出全选窗的时候是要进行什么操作  delete：删除店铺 setLeader:设置负责人
                },
                recordIds:[], //选中的店铺的记录id
                // 设置销售目标相关参数
                setSalesTarget:{
                    visible:false,
                    editRow:{} //要设置的行
                },
                isDeleteVisible:false, //删除弹窗是否可见
                // 设置负责人相关参数
                setLeader:{
                    visible:false,
                    leaderId:''
                },
                // 驳回相关参数
                auditReject:{
                    type:'',  //record记录驳回   plan销售计划驳回
                    visible:false,
                    reason:'',
                    recordIds:[]
                },
                // 反审核相关参数
                reAudit:{ //反审核
                    type:'',  //record记录驳回   plan销售计划驳回
                    visible:false,
                    reason:'',
                    recordIds:[]
                },
                // 导入销售计划相关参数
                importSalesPlan:{
                    importId:'', //
                    visible:false, //导入弹出框是否可见
                    loading:false, // 是否导入中
                    resultVisible:false, //导入结果弹出框是否可见
                    failCount:'', //导入失败条数
                    successCount:'', //导入成功条数
                },
            }
        },
        components: {
            SetSalesTarget,
            FilterForm,
            PageTitle,
            FilterCheckGroup,
            FilterCheckItem,
            ImportDialog
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            salesPlanId(){
                return this.$route.query.salesPlanId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            isCheckAll(){
                return this.checkAll.selection.length === this.storeList.length
            }
        },

        methods: {
            confirmFilter(filterParams){
                this.form = filterParams
                this.getSalesPlanRecordDetail()
            },
            // 获取销售计划状态对应的文本
            getStatusText(status){
                let statusText = ''
                switch (status){
                    case 'NOT_REPORT': statusText = '未提报';break;
                    case 'WAIT_AUDIT': statusText = '待审核';break;
                    case 'REJECTED': statusText = '已驳回';break;
                    case 'PASS': statusText = '已通过';break;
                    case 'DELETED': statusText = '已作废';break;

                }
                return statusText
            },
            // 获取销售计划详情
            getSalesPlanRecordDetail(){
                let params = {
                    ...this.form,
                    planId:this.salesPlanId,
                    userId:this.userId
                }
                this.loading = true
                getSalesPlanRecordDetail(params).then(res => {
                    this.loading = false
                    if(res.data.code ===0){
                        // 成功获取列表，将获取列表的参数保存起来
                        this.checkAll.filterParams = JSON.parse(JSON.stringify(params))

                        this.detailInfo = res.data.data.basic

                        this.summary = res.data.data.summary
                        this.tableHeader = this.summary.monthDatas?this.summary.monthDatas:[]
                        this.storeList = res.data.data.list.datas
                        this.total = res.data.data.list.totalCount
                    }
                })
            },
            // 监听页码点击
            handleCurrentChange(page) {
                this.form.pageNum = page
                this.getSalesPlanRecordDetail()
            },
            // 点击筛选
            confirmFilter(filterParams){
                this.form = filterParams
                this.getSalesPlanRecordDetail()
            },
            // 获取店铺相关字段库属性及其下拉数据
            getStoreAttrs(){
                let params ={
                    bossUnitId:this.bossUnitId
                }
                getStoreAttrs(params).then(res =>{
                    if(res.data.code ===0){
                        let storeAttrs = res.data.data
                        this.customStoreAttr = [storeAttrs.attr1.typeName,storeAttrs.attr2.typeName,storeAttrs.attr3.typeName]
                        console.log(this.customStoreAttr,909090)
                    }
                })
            },
            // 表格行选中状态发生改变
            handleSelectionChange(selection){
                this.checkAll.selection = selection
                this.recordIds = this.checkAll.selection.map(item =>{
                    return item.id
                })
            },
            // 点击了全选弹窗的确定按钮
            confirmCheckAll(){
                // 删除店铺
                if(this.checkAll.action === 'delete'){
                    this.isDeleteVisible = true
                }
                //设置负责人
                if(this.checkAll.action === 'setLeader'){
                    this.setLeader.visible = true
                }
                // 提报
                if(this.checkAll.action === 'report'){
                    this.loading = true
                    this.confirmRecordBacth('report',this.recordIds)
                }
                // 审核通过
                if(this.checkAll.action === 'pass'){
                    this.loading = true
                    this.confirmRecordBacth('pass',this.recordIds)
                }
                // 审核驳回
                if(this.checkAll.action === 'reject'){
                    this.auditReject.type = 'record'
                    this.auditReject.visible = true
                    // this.confirmRecordBacth('reject',this.recordIds)
                }
                //反审核
                if(this.checkAll.action === 'reAudit'){
                    this.reAudit.type = 'record'
                    this.reAudit.visible = true
                    // this.confirmRecordBacth('reAudit',this.recordIds)
                }
            },
            // 点击批量删除销售计划记录按钮的时候
            beforeDelete(){
                if(!this.recordIds.length){
                    this.$message.error('请选择要删除的店铺')
                    return
                }
                if(this.isCheckAll){
                    this.checkAll.action = 'delete'
                    this.checkAll.visible = true
                } else {
                    this.isDeleteVisible = true
                }
            },
            // 确认删除销售计划记录
            confirmDelete(){
                let params = {
                    recordIds:this.recordIds
                }
                if(this.isCheckAll&&this.checkAll.value === 'allPage'){
                    params.recordParams =this.checkAll.filterParams
                }
                this.isSubmitting = true
                doRecordBatchDelete(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.$message.success('删除成功')
                        this.getSalesPlanRecordDetail()
                        this.isDeleteVisible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //点击设置销售计划记录负责人按钮的时候
            beforeSetLeader(){
                if(!this.recordIds.length){
                    this.$message.error('请选择要设置负责人的店铺')
                    return
                }
                if(this.isCheckAll){
                    this.checkAll.action = 'setLeader'
                    this.checkAll.visible = true
                } else {
                    this.setLeader.visible = true
                }
            },
            // 确认设置销售计划记录负责人
            confirmSetLeader(){
                if(!this.setLeader.leaderId){
                    this.$message.error('请选择负责人')
                    return
                }

                let params = {
                    recordIds:this.recordIds,
                    leaderId:this.setLeader.leaderId
                }
                if(this.isCheckAll&&this.checkAll.value === 'allPage'){
                    params.recordParams =this.checkAll.filterParams
                }
                this.isSubmitting = true
                doRecordBatchLeader(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.setLeader.leaderId = ''
                        this.$message.success('设置成功')
                        this.getSalesPlanRecordDetail()
                        this.setLeader.visible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 点击销售计划记录驳回按钮的时候
            beforeRecordReject(recordIds){
                // 没有传recordIds的话，就是点击批量驳回，此时要校验有没有选中店铺
                if(!recordIds.length&&!this.recordIds.length){
                    this.$message.error('请选择要驳回的店铺')
                    return
                }
                if(recordIds.length){
                    this.auditReject.recordIds = recordIds
                } else {
                    this.auditReject.recordIds = this.recordIds
                }
                if(this.isCheckAll){
                    this.checkAll.action = 'reject'
                    this.checkAll.visible = true
                } else {
                    this.auditReject.type = 'record'
                    this.auditReject.visible = true
                }
            },
            // 确认销售计划记录驳回
            confirmRecordReject(){
                if(!this.auditReject.reason){
                    this.$message.error('请填写驳回原因')
                    return
                }
                let params = {
                    recordIds:this.auditReject.recordIds ,
                    reason:this.auditReject.reason
                }
                if(this.isCheckAll&&this.checkAll.value === 'allPage'){
                    params.recordParams =this.checkAll.filterParams
                }
                this.isSubmitting = true
                doRecordBatchReject(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.auditReject.visible = false
                        this.auditReject.reason = ''
                        this.$message.success('驳回成功')
                        this.getSalesPlanRecordDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 点击销售计划记录反审核按钮的时候
            beforeRecordReAduit(recordIds){
                // 没有传recordIds的话，就是点击批量驳回，此时要校验有没有选中店铺
                if(!recordIds.length&&!this.recordIds.length){
                    this.$message.error('请选择要反审核的店铺')
                    return
                }
                if(recordIds.length){
                    this.reAudit.recordIds = recordIds
                } else {
                    this.reAudit.recordIds = this.recordIds
                }
                if(this.isCheckAll){
                    this.checkAll.action = 'reAudit'
                    this.checkAll.visible = true
                } else {
                    this.reAudit.type = 'record'
                    this.reAudit.visible = true
                }
            },
            // 确认销售计划记录反审核
            confirmRecordReAudit(){
                if(!this.reAudit.reason){
                    this.$message.error('请填写驳回原因')
                    return
                }
                let params = {
                    recordIds:this.reAudit.recordIds ,
                    reason:this.reAudit.reason
                }
                if(this.isCheckAll&&this.checkAll.value === 'allPage'){
                    params.recordParams =this.checkAll.filterParams
                }
                this.isSubmitting = true
                doRecordBatchReAudit(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.reAudit.visible = false
                        this.reAudit.reason = ''
                        this.$message.success('反审核成功')
                        this.getSalesPlanRecordDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 点击销售计划记录 批量提报、批量通过
            beforeRecordBatch(action){
                let requiredText = ''
                if(action ==='report'){
                    requiredText = '请选择要提报的店铺'
                }

                if(action ==='pass'){
                    requiredText = '请选择要通过的店铺'
                }

                // if(action ==='reject'){
                //     requiredText = '请选择要驳回的店铺'
                // }

                if(action ==='reAudit'){
                    requiredText = '请选择反审核的店铺'
                }


                if(!this.recordIds.length){
                    this.$message.error(requiredText)
                    return
                }
                if(this.isCheckAll){
                    this.checkAll.action = action
                    this.checkAll.visible = true
                } else {
                    this.confirmRecordBacth(action,this.recordIds)
                }
            },
            confirmRecordBacth(action,recordIds){
                let api = ''
                let successText = ''
                if(action ==='report'){
                    successText = '提报成功'
                    api = doRecordBatchReport
                }

                if(action ==='pass'){
                    successText = '通过成功'
                    api = doRecordBatchPass
                }

                let params = {
                    recordIds:recordIds
                }
                if(this.isCheckAll&&this.checkAll.value === 'allPage'){
                    params.recordParams =this.checkAll.filterParams
                }
                this.isSubmitting = true
                api(params).then(res =>{
                    this.loading = false
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.$message.success(successText)
                        this.getSalesPlanRecordDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 点击销售计划记录 行的编辑
            beforeSetSalesTarget(row){
                this.setSalesTarget.editRow = row
                this.setSalesTarget.visible = true
            },
            // 点击销售计划的审核驳回
            beforePlanReject(){
                this.auditReject.type = 'plan'
                this.auditReject.visible = true
            },
            // 点击销售计划的反审核
            beforePlanReAudit(){
                this.reAudit.type = 'plan'
                this.reAudit.visible = true
            },
            // 点击销售计划的提报、审核通过、反审核
            changePlanStatus(action){
                let params = {
                    planId:this.salesPlanId
                }

                let api = ''
                let successText = ''
                if(action ==='report'){
                    successText = '提报成功'
                    api = doPlanReport
                }

                if(action ==='pass'){
                    successText = '通过成功'
                    api = doPlanAudit
                    params.type ='PASS'
                }

                if(action ==='reject'){
                    if(!this.auditReject.reason){
                        this.$message.error('请填写驳回原因')
                        return
                    }
                    successText = '驳回成功'
                    api = doPlanAudit
                    params.type ='REJECT'
                    params.reason = this.auditReject.reason
                }

                if(action ==='reAudit'){
                    if(!this.reAudit.reason){
                        this.$message.error('请填写驳回原因')
                        return
                    }
                    successText = '反审核成功'
                    api = doPlanReAudit
                    params.reason = this.reAudit.reason
                }
                this.isSubmitting = true
                api(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.auditReject.visible = false
                        this.reAudit.visible = false
                        this.$message.success(successText)
                        this.getSalesPlanRecordDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })


            },
            // 导入销售计划
            confirmImport(file){
                let form = new FormData();
                // 文件对象
                form.append("file", file);
                // 其他参数
                form.append("planId", this.salesPlanId);
                form.append("bossUnitId", this.bossUnitId);
                this.importSalesPlan.loading = true
                importSalesPlanFromExcel(form).then(res =>{
                    this.importSalesPlan.loading = false
                    this.importSalesPlan.visible = false
                    if(res.data.code ===0){
                        this.importSalesPlan.importId = res.data.data.importId
                        this.importSalesPlan.successCount = res.data.data.successCount
                        this.importSalesPlan.failCount = res.data.data.failCount
                        if(res.data.data.failCount == 0){
                            this.getSalesPlanRecordDetail()
                            this.$message.success('导入成功')
                        } else{
                            this.importSalesPlan.resultVisible = true
                        }
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //下载导入模板
            downloadTemplate(){
                let params ={
                    planId:this.salesPlanId,
                    bossUnitId:this.bossUnitId
                }
                exportSalesPlanExcelTemplate(params).then(res =>{
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','样表文件'+'.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            //导出 导入失败的列表
            exportErrorExcel(){
                let params ={
                    importId:this.importSalesPlan.importId
                }
                exportErrorExcel(params).then(res =>{
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','导入失败列表'+'.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            // 关闭导入失败弹窗
            closeResultDialog(){
                this.getSalesPlanRecordDetail()
                this.importSalesPlan.resultVisible = false
            }

        },
        created() {
            this.getStoreAttrs()
            this.getSalesPlanRecordDetail()
        },
    }
</script>

<style lang="scss" scoped>
    .sales-plan-detail{
        .detail-content{
            position: relative;
            padding:12px 24px 12px;
            min-height: 100px;
            background-color: #fff;
            .stopuse-img{
                position: absolute;
                top: 20px;
                right: 50px;
            }
            .detail-item{
                font-size:12px ;
                line-height: 24px;
                max-width: 1070px;
            }
        }
    }


</style>
<style lang="scss">
    .sales-plan-detail{
        .el-dialog--tiny{
            width: 365px;
        }
        .set-leader-dialog{
            .el-dialog--tiny{
                width: 365px;
            }
        }
        .custom-dialog.import-result.el-dialog--small{
            width: 450px;
        }

        .sales-plan-table .el-table__body,
        .sales-plan-table .el-table__header{
            width: 100% !important;
        }
    }
</style>

