<template>
    <section class="procurement-plan-level-detail" v-loading="summaryLoading">
        <div v-if="hasAuth" class="hasAuth">
            <!--汇总信息-->
            <base-box ref="base_box" class="baseBox">
                <div class="yellow-border-title">
                    <div class="title">汇总信息</div>
                    <div>
                        <nf-button v-if="showApartBtn&&!isOriginal" plain style="color:#1ca1ff;border-color: #1ca1ff;"
                                   fsize='12' @click="importApart.visible = true">EXCEL导入拆解
                        </nf-button>
                        <!--不是原始拆解详情，并且已通过审核，才显示原始拆解按钮-->
                        <!--<nf-button v-if="!isOriginal&&(summary&&summary[0]&&summary[0].status ==='PASS')"  fsize='12'  @click="goOriginalDetail">原始拆解表</nf-button>-->
                        <nf-button class="mgl10" v-if="level != 1 || type !=='level'" fsize='12'
                                   @click="$router.go(-1)">返回
                        </nf-button>
                    </div>
                </div>
                <!--第一层级的汇总-->
                <el-table :key="new Date().getTime()" v-if="level == 1&&type!=='branch'"
                          class="custom-table summary-table mgt8"
                          :data="summary"
                          border
                          style="width: 100%;">
                    <el-table-column
                            min-width="220"
                            prop="planName"
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            width="220"
                            label="企划时段">
                        <template slot-scope="scope">
                            {{new Date(scope.row.startDate).getFullYear()+'年'+(parseInt(new
                            Date(scope.row.startDate).getMonth())+1)+'月'}}
                            -
                            {{new Date(scope.row.endDate).getFullYear()+'年'+(parseInt(new
                            Date(scope.row.endDate).getMonth())+1)+'月'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="68"
                            prop="unit"
                            label="单位">
                    </el-table-column>
                    <el-table-column
                            v-if="(summary&&summary[0]&&summary[0].status ==='PASS')&&!isOriginal"
                            width="110"
                            prop="originalOtbAmount"
                            label="原始采购预算">
                    </el-table-column>
                    <el-table-column
                            width="110"
                            prop="otbAmount"
                            label="采购预算">
                    </el-table-column>
                    <el-table-column
                            v-if="!isOriginal"
                            width="110"
                            prop="level1PurchaseAmount"
                            label="已拆解">
                    </el-table-column>
                    <el-table-column
                            v-if="(summary&&summary[0]&&summary[0].status !=='PASS')&&!isOriginal"
                            width="110"
                            prop="dValue"
                            label="差值">
                    </el-table-column>
                    <el-table-column
                            width="80"
                            prop="leaderUserName"
                            label="总负责人">
                    </el-table-column>
                    <el-table-column
                            width="80"
                            prop="auditorUserName"
                            label="总审核人">
                    </el-table-column>
                    <!--动态列-->
                    <template v-for="(item,index) in dynamicColumns">
                        <el-table-column
                                :width="[11,12,13].indexOf(item.attrType)>-1?'180':'80'"
                                :key="index"
                                :label="item.attrTypeName">
                            <template slot-scope="scope">
                                {{item.attrValues&&item.attrValues.length?item.attrValues.join('、'):''}}
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column
                            v-if="!isOriginal"
                            width="120"
                            prop="status"
                            label="本级审核状态">
                        <template slot-scope="scope">
                            <span class="gray" v-if="scope.row.status ==='NOT_REPORT'">未提报</span>
                            <span class="blue" v-else-if="scope.row.status ==='WAIT_AUDIT'">待审核</span>
                            <span class="red" v-else-if="scope.row.status ==='REJECTED'">已驳回(驳回原因:{{scope.row.rejectReason}})</span>
                            <span class="green" v-else-if="scope.row.status ==='PASS'">已通过</span>
                        </template>
                    </el-table-column>
                    <!--不是原始拆解表，并且有一个操作按钮要显示，才显示该列-->
                    <el-table-column v-if="!isOriginal&&(showReportBtn||showAuditBtn||showReAuditBtn)"
                                     class-name="no-padding"
                                     align="center"
                                     fixed="right"
                                     label="操作">
                        <template slot-scope="scope">
                            <div class="action-list">
                                <!--<div v-if="scope.row.showApartBtn" class="item blue">拆解</div>-->
                                <div @click="isReportVisible = true" v-if="showReportBtn" class="item blue">提报</div>
                                <div @click="isAuditPassVisible = true" v-if="showAuditBtn" class="item blue">通过</div>
                                <div @click="auditReject.visible = true" v-if="showAuditBtn" class="item blue">驳回</div>
                                <div @click="reAudit.visible = true" v-if="showReAuditBtn" class="item blue">反审核</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!--其他层级汇总信息-->
                <el-table :key="new Date().getTime()" v-else class="custom-table mgt8"
                          :data="summary"
                          border
                          style="width: 100%;">
                    <template v-for="item in dynamicColumns">
                        <el-table-column v-if="item.child&&item.child.length" :label="item.title">
                            <template v-for="childItem in item.child">
                                <el-table-column
                                        :prop="childItem.key"
                                        :label="childItem.title">
                                </el-table-column>
                            </template>
                        </el-table-column>
                        <el-table-column v-else :label="item.title"
                                         min-width="120"
                                         :prop="item.key">
                            <template slot-scope="scope">
                                <div v-if="item.key ==='status'">
                                    <span class="gray" v-if="scope.row.status ==='NOT_REPORT'">未提报</span>
                                    <span class="blue" v-else-if="scope.row.status ==='WAIT_AUDIT'">待审核</span>
                                    <span class="red" v-else-if="scope.row.status ==='REJECTED'">已驳回(驳回原因:{{scope.row.rejectReason}})</span>
                                    <span class="green" v-else-if="scope.row.status ==='PASS'">已通过</span>
                                </div>
                                <div v-else-if="item.key ==='branchStatus'">
                                    <span class="gray" v-if="scope.row.branchStatus ==='NOT_REPORT'">未提报</span>
                                    <span class="blue" v-else-if="scope.row.branchStatus ==='WAIT_AUDIT'">待审核</span>
                                    <span class="red" v-else-if="scope.row.branchStatus ==='REJECTED'">已驳回(驳回原因:{{scope.row.rejectReason}})</span>
                                    <span class="green" v-else-if="scope.row.branchStatus ==='PASS'">已通过</span>
                                </div>
                                <div v-else>{{scope.row[item.key]}}</div>
                            </template>
                        </el-table-column>
                    </template>
                    <!--不是原始拆解表，并且有一个操作按钮要显示，才显示该列-->
                    <el-table-column v-if="!isOriginal&&(showReportBtn||showAuditBtn||showReAuditBtn)"
                                     class-name="no-padding"
                                     align="center"
                                     fixed="right"
                                     label="操作">
                        <template slot-scope="scope">
                            <div class="action-list">
                                <!--<div v-if="scope.row.showApartBtn" class="item blue">拆解</div>-->
                                <div @click="isReportVisible = true" v-if="showReportBtn" class="item blue">提报</div>
                                <div @click="isAuditPassVisible = true" v-if="showAuditBtn" class="item blue">通过</div>
                                <div @click="auditReject.visible = true" v-if="showAuditBtn" class="item blue">驳回</div>
                                <div @click="reAudit.visible = true" v-if="showReAuditBtn" class="item blue">反审核</div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </base-box>
            <div v-if="summary.length" class="detail-content" v-loading="detailLoading">
                <!--筛选区-->
                <base-box v-if="this.level ==1&&type !=='branch'" class="custom-filter-form mgt8 clearfix">
                    <el-form :model="form" status-icon  label-width="140px" style="margin-left:-40px">
                        <el-row>
                            <el-col v-for="(item,index) in queryData" :key="index" :xs="12" :sm="12" :md="12" :lg="8">
                                <el-form-item :label="item.attrTypeName">
                                    <el-select v-model="item.value" placeholder="请选择" multiple clearable filterable>
                                        <el-option
                                                v-for="attrItem in item.attrs"
                                                :key="attrItem.attrId"
                                                :label="attrItem.attrVal"
                                                :value="attrItem.attrId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <!--<el-col :xs="12" :sm="12" :md="12" :lg="8">-->
                            <!--<el-form-item label="下级负责人">-->
                            <!--<worker-leader v-model="form.chargerIds" placeholder="请选择" ></worker-leader>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--<el-col :xs="12" :sm="12" :md="12" :lg="8">-->
                            <!--<el-form-item label="下级审核人">-->
                            <!--<worker-leader v-model="form.auditorIds" placeholder="请选择" ></worker-leader>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <!--</el-row>-->
                            <!--<el-row>-->
                            <!--<el-col  :md="16" :lg="12">-->
                            <!--<el-form-item label="下级审核状态">-->
                            <!--<filter-check-group multiple v-model="form.status">-->
                            <!--<filter-check-item-->
                            <!--v-for="item in statusOptions"-->
                            <!--:key="item.value"-->
                            <!--:value="item.value"-->
                            <!--:label="item.label"></filter-check-item>-->
                            <!--</filter-check-group>-->
                            <!--</el-form-item>-->
                            <!--</el-col>-->
                            <el-col :xs="12" :sm="12" :md="12" :lg="8">
                                <div class="btn-group">
                                    <el-button class="btn btn-reset" @click="reset">重置</el-button>
                                    <el-button class="btn btn-submit" @click="getOtbActualDetail">筛选</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </base-box>
                <div class="box-shadow mgt8" style="min-height: 100px">
                    <dynamic-table v-if="dynamicTable.headers.length"
                                   :isOriginal="isOriginal"
                                   :hasNextLevel="summary[0].hasNextLevel && summary[0].status ==='PASS'"
                                   :headers="dynamicTable.headers"
                                   :body="dynamicTable.body"></dynamic-table>
                </div>
            </div>
        </div>
        <div v-else class="box-shadow no-auth">
            没有查看权限
        </div>
        <!--confirm 导入操作-->
        <!--downloadTemplate 下载模板-->
        <import-dialog title="从Excel导入拆解" :visible.sync="importApart.visible" :loading="importApart.loading"
                       templateText="下载样表文件"
                       @confirm="confirmImport" @downloadTemplate="downloadTemplate"></import-dialog>
        <!--导入拆解失败提示-->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="importApart.failVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">{{importApart.failText}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importApart.failVisible = false">取 消</el-button>
                <el-button type="primary" @click="importApart.visible = true;importApart.failVisible = false;">重新上传
                </el-button>
            </div>
        </el-dialog>
        <!--提报-->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isReportVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认要提报？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isReportVisible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmReport">确认</el-button>
            </div>
        </el-dialog>
        <!--通过审核-->
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="isAuditPassVisible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认通过【{{$route.query.levelName}}】的规划拆解？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isAuditPassVisible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmAudit('PASS')">确认</el-button>
            </div>
        </el-dialog>
        <!--驳回审核-->
        <el-dialog title="驳回" class="custom-dialog" :visible.sync="auditReject.visible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div>
                <el-input
                        type="textarea"
                        resize="none"
                        :rows="6"
                        placeholder="请输入驳回原因"
                        v-model.trim="auditReject.reason">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="auditReject.visible = false;auditReject.reason =''">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmAudit('REJECT')">确认</el-button>
            </div>
        </el-dialog>
        <!--反审核-->
        <el-dialog title="反审核" class="custom-dialog" :visible.sync="reAudit.visible" :show-close="false"
                   :close-on-click-modal="false" size="tiny">
            <div>
                <p class="text-center">是否确认将【{{$route.query.levelName}}】的规划拆解改成已驳回状态？</p>
                <el-input class="mgt16"
                          type="textarea"
                          resize="none"
                          :rows="6"
                          placeholder="请填写驳回原因"
                          v-model.trim="reAudit.reason">
                </el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reAudit.visible = false;reAudit.reason = ''">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmReAudit">确认</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    import DynamicTable from '@/components/goodsPlan/procurementPlan/list/components/dynamicTable';
    import ImportDialog from '@/components/Common/importDialog';

    import {
        getOtbActualSummaryFirst, getOtbActualSummary, getOtbActualBranchSummary, getOtbActualDetail,
        exportApartExcelTemplate, importApartFromExcel, importBranchApartFromExcel,
        getOtActualBranchDetail, otbDoReport, otbDoAudit, otbDoReAudit
    } from '@/api/goodsPlan.js'

    export default {

        components: {
            ImportDialog,
            FilterCheckGroup,
            FilterCheckItem,
            DynamicTable,

        },
        data() {
            return {
                importApart: {
                    visible: false,
                    loading: false,
                    failVisible: false,
                    failText: ''
                },
                summaryLoading: false,
                detailLoading: false,
                summary: [],
                dynamicColumns: [],
                // form:{
                //     chargerIds:[],
                //     auditorIds:[],
                //     status:[]
                // },
                statusOptions: [
                    {
                        label: '未提报',
                        value: 'NOT_REPORT'
                    },
                    {
                        label: '待审核',
                        value: 'WAIT_AUDIT'
                    },
                    {
                        label: '已驳回',
                        value: 'REJECTED'
                    },
                    {
                        label: '已通过',
                        value: 'PASS'
                    }
                ],
                queryData: [],// 动态的查询条件
                dynamicTable: {
                    headers: [],
                    body: []
                },
                // 汇总信息按钮是否显示
                showApartBtn: false,
                showReportBtn: false,
                showAuditBtn: false,
                showReAuditBtn: false,
                isReportVisible: false, //是否提报可见性
                isAuditPassVisible: false, //审核通过可见性
                auditReject: {  //审核拒绝
                    visible: false,
                    reason: ''
                },
                reAudit: { //反审核
                    visible: false,
                    reason: ''
                },
                isSubmitting: false,
                hasAuth: true,

            }
        },
        computed: {
            planId() {
                return this.$route.query.planId
            },
            level() {
                return this.$route.query.level
            },
            levelId() {
                return this.$route.query.levelId
            },
            type() {
                return this.$route.query.type
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            isOriginal() { //是否是原始拆解
                return this.$route.query.isOriginal ? true : false
            },
            baseAttrId() {
                return this.$route.query.baseAttrId ? this.$route.query.baseAttrId : ''
            },
            baseAttrIdsStr() {
                return this.$route.query.baseAttrIdsStr ? this.$route.query.baseAttrIdsStr : ''
            }
        },
        watch: {
            "$route.query.levelId": {
                handler: function (val, oldVal) {
                    this.initPage()
                }
            },
            "$route.query.isOriginal": {
                handler: function (val, oldVal) {
                    this.initPage()
                }
            },
            "$route.query.type": {
                handler: function (val, oldVal) {
                    this.initPage()
                }
            }
        },
        methods: {
            // 重置筛选区
            reset() {
                // this.form = {
                //     chargerIds:[],
                //     auditorIds:[],
                //     status:[]
                // }
                if (this.queryData.length) {
                    this.queryData.forEach(item => {
                        item.value = []
                    })

                }
                this.getOtbActualDetail()
            },
            // 获取第一层级的汇总数据
            async getOtbActualSummaryFirst() {
                let params = {
                    planId: this.planId,
                    userId: this.userId,
                    isOriginal: this.isOriginal,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                this.summaryLoading = true
                await getOtbActualSummaryFirst(params).then(res => {
                    this.summaryLoading = false
                    if (res.data.code === 0) {
                        this.dynamicColumns = res.data.summary.attrTypes
                        this.showApartBtn = res.data.showApartBtn
                        this.showReportBtn = res.data.showReportBtn
                        this.showAuditBtn = res.data.showAuditBtn
                        this.showReAuditBtn = res.data.showReAuditBtn
                        this.summary = [res.data.summary]
                        this.hasAuth = res.data.hasAuth
                    }
                })
            },
            // 获取其他层级、支线的汇总数据
            async getOtbActualSummary() {
                // 普通层级和普通支线的api
                let api = getOtbActualSummary
                let params = {
                    baseAttrId: this.baseAttrId,
                    levelId: this.levelId,
                    userId: this.userId,
                    planId: this.planId,
                    isOriginal: this.isOriginal,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                // 供应商分支的api
                if (this.type === 'branch' && this.levelId === 'SUPPLIER') {
                    api = getOtbActualBranchSummary
                }
                this.summaryLoading = true
                await api(params).then(res => {
                    this.summaryLoading = false
                    if (res.data.code === 0) {
                        this.dynamicColumns = res.data.headers
                        this.showApartBtn = res.data.showApartBtn
                        this.showReportBtn = res.data.showReportBtn
                        this.showAuditBtn = res.data.showAuditBtn
                        this.showReAuditBtn = res.data.showReAuditBtn
                        this.summary = [res.data.body]
                    }
                })
            },
            // 获取拆解数据详情（普通主线和普通分支）
            async getOtbActualDetail() {
                let params = {
                    baseAttrId: this.baseAttrId,
                    levelId: this.levelId,
                    userId: this.userId,
                    isOriginal: this.isOriginal,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                // 第一层级的拆解详情才有筛选区
                if (this.level == 1) {
                    // params = {
                    //     ...params,
                    //     ...this.form,
                    // }
                    if (this.queryData.length) {
                        this.queryData.forEach(item => {
                            params[item.key] = item.value
                        })
                        console.log(params, 909090)
                    }
                }
                this.detailLoading = true
                await getOtbActualDetail(params).then(res => {
                    this.detailLoading = false
                    if (res.data.code === 0) {
                        if (!this.queryData.length) {
                            res.data.queryData.forEach(item =>{
                                item.value = []
                            })
                            this.queryData = res.data.queryData
                        }
                        this.dynamicTable.headers = res.data.headers
                        this.dynamicTable.body = res.data.body
                        console.log(this.dynamicTable)
                    }
                })
            },
            // 获取拆解数据详情(供应商支线)
            async getOtbActualBranchDetail() {
                let params = {
                    levelId: this.levelId,
                    baseAttrId: this.baseAttrId,
                    planId: this.planId,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                this.detailLoading = true
                await getOtActualBranchDetail(params).then(res => {
                    this.detailLoading = false
                    if (res.data.code === 0) {
                        if (!this.queryData.length) {
                            this.queryData = res.data.queryData
                        }
                        this.dynamicTable.headers = res.data.headers
                        this.dynamicTable.body = res.data.body
                        console.log(this.dynamicTable)
                    }
                })
            },
            // 导入拆解
            confirmImport(file) {
                var form = new FormData();
                // 文件对象
                form.append("file", file);
                // 其他参数
                form.append("planId", this.planId);
                form.append("bossUnitId", this.bossUnitId);
                form.append("baseAttrId", this.baseAttrId);
                form.append("baseAttrIdsStr", this.baseAttrIdsStr);
                let api = importApartFromExcel
                if (this.type === 'branch' && this.levelId === 'SUPPLIER') {
                    api = importBranchApartFromExcel
                } else {
                    form.append("levelId", this.levelId);
                }
                this.importApart.loading = true
                api(form).then(res => {
                    this.importApart.loading = false
                    this.importApart.visible = false
                    if (res.data.code === 0) {
                        this.initPage()
                        this.$message.success('导入成功')
                    } else {
                        this.importApart.failText = res.data.msg
                        this.importApart.failVisible = true
                    }
                })
            },
            // 下载模板
            downloadTemplate() {
                let params = {
                    planId: this.planId,
                    levelId: this.levelId,
                    bossUnitId: this.bossUnitId
                }
                exportApartExcelTemplate(params).then(res => {
                    var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '样表文件' + this.currentTime() + '.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })

            },
            // 获取当前时间
            currentTime() {
                let now = new Date()
                let year = now.getFullYear()
                let month = now.getMonth() + 1
                let day = now.getDate()

                let hh = now.getHours()
                let mm = now.getMinutes()
                let ss = now.getSeconds()

                var clock = year

                if (month < 10)
                    clock += '0'

                clock += month

                if (day < 10)
                    clock += '0'

                clock += day

                if (hh < 10)
                    clock += '0'

                clock += hh
                if (mm < 10) clock += '0'
                clock += mm

                if (ss < 10) clock += '0'
                clock += ss
                return clock
            },
            async initPage() {
                // 层级
                if (this.type === 'level') {
                    // 第一层级汇总信息
                    if (this.level == 1) {
                        await this.getOtbActualSummaryFirst()
                    }
                    // 其他层级的汇总信息
                    else {
                        await this.getOtbActualSummary()
                    }
                    // 获取拆解详情
                    await this.getOtbActualDetail()
                }
                // 分支
                else {
                    // 支线拆解的汇总信息
                    await  this.getOtbActualSummary()
                    // 获取拆解详情
                    if (this.levelId === 'SUPPLIER') {
                        await this.getOtbActualBranchDetail()
                    } else {
                        await this.getOtbActualDetail()
                    }
                }
            },
            // 查看原始拆解表
            goOriginalDetail() {
                let query = {
                    ...this.$route.query,
                    isOriginal: true
                }
                this.$router.push({
                    path: '/procurementPlan/levelDetail',
                    query: query
                })
            },
            //提报
            confirmReport() {
                let params = {
                    planId: this.planId,
                    levelId: this.levelId,
                    baseAttrId: this.baseAttrId,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                this.isSubmitting = true
                otbDoReport(params).then(res => {
                    this.isSubmitting = false
                    this.isReportVisible = false
                    if (res.data.code === 0) {
                        this.$message.success('提报成功')
                        this.initPage()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //通过、驳回
            // type: PASS:审核通过 REJECT:审核驳回
            confirmAudit(type) {
                if (type === 'REJECT' && !this.auditReject.reason) {
                    this.$message.error('请填写驳回原因')
                    return
                }
                let params = {
                    planId: this.planId,
                    levelId: this.levelId,
                    type: type,
                    baseAttrId: this.baseAttrId,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                if (type === 'REJECT') {
                    params.rejectReason = this.auditReject.reason
                }
                this.isSubmitting = true
                otbDoAudit(params).then(res => {
                    this.isSubmitting = false
                    this.isAuditPassVisible = false
                    this.auditReject.visible = false
                    this.auditReject.reason = ''
                    if (res.data.code === 0) {
                        this.$message.success(type === 'PASS' ? '通过成功' : '驳回成功')
                        this.initPage()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //反审核
            confirmReAudit() {
                if (!this.reAudit.reason) {
                    this.$message.error('请填写驳回原因')
                    return
                }
                let params = {
                    planId: this.planId,
                    levelId: this.levelId,
                    reAuditReason: this.reAudit.reason,
                    baseAttrId: this.baseAttrId,
                    baseAttrIdsStr: this.baseAttrIdsStr
                }
                this.isSubmitting = true
                otbDoReAudit(params).then(res => {
                    this.isSubmitting = false
                    this.reAudit.visible = false
                    this.reAudit.reason = ''
                    if (res.data.code === 0) {
                        this.$message.success('反审核成功')
                        this.initPage()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        created() {
            this.initPage()
        },


    }
</script>
<style lang="scss">
    .procurement-plan-detail {
        .custom-filter-form.base_box {
            padding-bottom: 10px;
        }
        .el-dialog--tiny {
            width: 400px;
        }
        .summary-table {
            .el-table__body,
            .el-table__footer,
            .el-table__header {
                width: 100% !important;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .procurement-plan-level-detail{
        height: 100%;
        .hasAuth{
            height: 100%;
            display: flex;
            flex-direction: column;
            .detail-content{
                flex: 1;
                display: flex;
                flex-direction: column;
                .box-shadow{
                    flex: 1;
                }
            }
        }
    }
    .procurement-plan-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: row;
            overflow-y: hidden;
            .level-list {
                width: 125px;
                margin-right: 10px;
                background: #fff;
                overflow-y: auto;
                ul > li {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    .icon-workbench {
                        display: inline-block;
                        vertical-align: middle;
                        width: 16px;
                        height: 16px;
                        margin-top: -2px;
                        margin-right: 4px;
                    }
                    color: #3b3b3b;
                    background-color: #fff;
                    line-height: 32px;
                    font-size: 12px;
                    border-bottom: 1px solid #E6EAF0;
                    padding: 0 3px 0 10px;
                    cursor: pointer;
                    &.active {
                        background-color: #E6EAF0;
                    }
                }
            }
            .detail {
                flex: 1;
                overflow-y: auto;
                .design-img {
                    display: inline-block;
                    vertical-align: middle;
                    width: 56px;
                    height: 56px;
                    padding: 3px 0;
                }
            }
        }
        .no-auth {
            padding: 100px 0;
            text-align: center;
            color: #5e7382;
            background-color: #fff;
        }
    }
</style>
