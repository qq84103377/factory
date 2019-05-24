<template>
    <section>
        <page-title :title="isSample==0?'版师绩效提成表' : '样衣师绩效提成表'" bg>
            <div class="report-wrap">
                <nf-button class="go-back" @click="goBackClick">返回上级</nf-button>
            </div>
        </page-title>

        <div class="custom-filter-form box-shadow clearfix">
            <el-form :model="form" status-icon ref="ruleForm2" label-width="100px"
                     style="margin-left:-40px;position: relative;overflow: hidden;">
                <div class="clearfix">
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                        <el-form-item label="提报时间">
                            <el-date-picker
                                    v-model="date"
                                    type="datetimerange"
                                    placeholder="选择时间范围">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                        <el-form-item label="分配时间">
                            <el-date-picker
                                    v-model="dateComplete"
                                    type="datetimerange"
                                    placeholder="选择时间范围">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                        <el-form-item label="节点">
                        <el-select
                                v-model="form.nodeIds"
                                remote
                                reserve-keyword
                                filterable
                                multiple
                                :remote-method="getNodesNames"
                                clearable
                                placeholder="请选择或搜索">
                            <el-option v-for="item in nodeList" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                        <el-form-item label="工位">
                            <v-user-select v-model="form.userIds" :options="options.groupOptions"
                                           @remote="fetchUnitUser" placeholder="请选择工位"></v-user-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                        <el-form-item label="设计款号">
                        <el-select
                                v-model="form.designStyleNo"
                                remote
                                reserve-keyword
                                filterable
                                :remote-method="getStylesName"
                                clearable
                                placeholder="请选择或搜索">
                            <el-option v-for="item in options.styleNos" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="商品款号">
                        <el-select
                                v-model="form.styleNo"
                                remote
                                reserve-keyword
                                :remote-method="getGoodsStyleNos"
                                filterable
                                clearable
                                placeholder="请选择或搜索">
                            <el-option v-for="item in options.goodsStyleNos" :key="item.id" :label="item.name"
                                       :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="9" style="float: right;">
                        <div class="btn-group">
                            <div style="display: inline-block;padding-right: 15px;border-right: 1px solid #DFE6EC;"><el-button class="btn btn-reset" @click="exportExcelDialog=true">导出报表</el-button></div>
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="getData">筛选</el-button>
                        </div>
                    </el-col>
                </div>
            </el-form>
        </div>


        <el-table
                class="custom-table"
                :data="tableData"
                border
                style="width: 100%;margin-top: 8px;">
            <el-table-column label="工位" header-align="center">
                <el-table-column
                        prop="loginName"
                        label="工位号">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="工位姓名">
                </el-table-column>
            </el-table-column>
            <el-table-column label="总计" header-align="center">
                <el-table-column
                        prop="total"
                        label="件数">
                </el-table-column>
                <el-table-column
                        prop="totalPerformance"
                        label="提成">
                </el-table-column>
            </el-table-column>
            <!-- 分类 -->
            <template v-for="(item,index) in tableheader">
                <el-table-column :label="`${item.difficultyName}${item.patternStyleName ? '-' :''}${item.patternStyleName}`" header-align="center">
                    <el-table-column
                        prop="total"
                        label="件数">
                        <template slot-scope="scope">
                            {{scope.row.patternDetail[index].total}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="totalPerformance"
                            label="提成">
                        <template slot-scope="scope">
                            {{scope.row.patternDetail[index].totalPerformance}}
                        </template>
                    </el-table-column>
                </el-table-column>
            </template>
        </el-table>

        <!--导出报表-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog export-excel-dialog" title="检查项详情"
                   :visible.sync="exportExcelDialog" size="tiny">
            <div class="export-excel-dialog__body">
                    <el-radio v-model="radio" label="0" style="margin-bottom: 32px;">按员工总计提成导出</el-radio>
                    <el-radio v-model="radio" label="1" style="margin-left: 0;">按员工难度分类提成导出</el-radio>
            </div>

            <div slot="footer">
                <el-button @click="exportExcelDialog = false">取 消</el-button>
                <el-button type="primary"
                           @click="getExcel(radio)">确 定
                </el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import {
        getUnitUser,
        stylesName,
        goodsStyleNos
    } from '@/api'
    import {getReportType,getNodesNames,getReportExcel} from '@/api/sample-centre.js'
    const fun  = require('@/components/Common/commonFun.js')
    export default {
        name: "typing-achievements-report",
        data() {
            return {
                radio: '0',
                exportExcelDialog: false,
                tableData: [],
                select: [],
                ruleForm2: {},
                arr: [],
                time: '',
                time1: '',
                value1: '',
                options: {
                    groupOptions: [],
                    styleNos: [],
                    goodsStyleNos: []
                },
                date: [],
                dateComplete: [],
                nodeList: [],
                tableheader: [], // 动态表头
                form: {
                    dateStart: '',
                    dateEnd: '',
                    dateStartComplete: '',
                    dateEndComplete: '',
                    nodeIds: [],
                    userIds: [],
                    styleNo: '',
                    designStyleNo: '',
                },
                filterParams:{}
            }
        },
        computed: {

            // 计算属性
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('last_login')).id
            },
            isSample() {
                return this.$route.query.type
            }
        },
        methods: {
            // 返回
            goBackClick() {
                this.$router.back()
            },
            // 节点下拉
            getNodesNames(){
                let params = {
                    type: 4,
                    unitId: this.facId
                }
                getNodesNames(params).then(res => {
                    this.nodeList = res.data.data
                })
            },
            reset(){
                this.form = {
                    dateStart: '',
                    dateEnd: '',
                    dateStartComplete: '',
                    dateEndComplete: '',
                    nodeIds: [],
                    userIds: [],
                    styleNo: '',
                    designStyleNo: '',
                }
                this.date = []
                this.dateComplete = []
            },
            orderDateChange() {


            },
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: this.facId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;
                });
            },
            // 设计款号
            getStylesName(key) {
                stylesName({
                    unitId: this.facId,
                    key: key
                }).then(res => {
                    this.options.styleNos = res.data.data
                });
            },
            // 商品款号
            getGoodsStyleNos(key) {
                goodsStyleNos({
                    unitId: this.facId,
                    key: key
                }).then(res => {
                    this.options.goodsStyleNos = res.data.data
                });
            },
            // 获取数据
            getData() {
                this.filterParams = {
                    exportType: '',
                    type: this.isSample == 0 ? 0 : 1,
                    unitId:this.unitId,
                    dateStart: this.date&&this.date[0] != null ? fun.dateFormatter(this.date[0]) : '',
                    dateEnd: this.date&&this.date[1] != null ? fun.dateFormatter(this.date[1]) : '',
                    dateStartComplete: this.dateComplete&&this.dateComplete[0] != null ? fun.dateFormatter(this.dateComplete[0]) : '',
                    dateEndComplete: this.dateComplete&&this.dateComplete[1] != null ? fun.dateFormatter(this.dateComplete[1]) : '',
                    nodeIds: this.form.nodeIds,
                    userIds: this.form.userIds,
                    styleNo: this.form.styleNo,
                    designStyleNo: this.form.designStyleNo,
                    reportType: this.isSample == 0 ? 'machinistPaymentReport' : 'sampleDesignerPaymentReport'
                }
                // 获取列表数据
                getReportType(this.filterParams).then(res => {
                    this.tableData = res.data.data || []
                    this.tableheader = this.tableData.length > 0 ? this.tableData[0].patternDetail : []
                })
            },
            // 导出
            getExcel(type) {
                this.filterParams.exportType = type
                getReportExcel(this.filterParams).then(res => {
                    this.fileData = res.data;
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', `${this.isSample == 0 ? "版师列表.xls" : "样衣师列表.xls"}`);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.exportExcelDialog = false
                })
            }
        },
        created(){
            let start = new Date().setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
            this.date = [start,new Date()]
            this.getData()
            this.fetchUnitUser()
            this.getStylesName()
            this.getGoodsStyleNos()
            this.getNodesNames()
        }
    }
</script>
<style lang="scss">
    .export-excel-dialog{
        .el-dialog{
            width: 360px;
        }
    }
</style>
<style lang="scss" scoped>
    .export-excel-dialog{

        &__body{
            margin: 0 auto;
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }
</style>
