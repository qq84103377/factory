<template>
    <div class="factory-proces-detail">
        <page-title :title="`外发工厂加工结算-巨牛一分厂`">
            <nf-button type="warning" style="margin-right: 10px;" v-if="!cancel&&addType" @click="repeatEditPayOff">
                重编辑
            </nf-button>
            <nf-button style="width:98px;" @click="goBack">返回上级</nf-button>
        </page-title>
        <!-- 搜索 -->
        <div class="custom-filter-form box-shadow clearfix mgb8">
            <el-form :model="form" status-icon ref="ruleForm2" label-width="100px" class="demo-ruleForm"
                     style="margin-left:-40px">
                <el-col :span="8">
                    <el-form-item label="日期" prop="order">
                        <el-date-picker
                                @change="getDate"
                                placeholder="全部"
                                v-model="value7"
                                type="daterange"
                                align="right"
                                unlink-panels
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单据类型">
                        <el-select style="width: 100%"
                                   v-model="form.billType"
                                   clearable>
                            <el-option
                                    ref="addOption2"
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <div class="btn-group">
                        <el-button class="btn btn-reset" @click="reset">重置</el-button>
                        <el-button class="btn btn-submit" @click="getFactoryPayDetails">筛选</el-button>
                    </div>
                </el-col>
            </el-form>
        </div>
        <el-row class="mgb8">
            <el-col :span="12">
                <el-button class="btn btn-reset" @click="exportExcel">导出excel</el-button>
            </el-col>
            <el-col :span="12" style="text-align:right">
                <el-button class="btn btn-reset" @click="getPay" type="warning">付款</el-button>
            </el-col>
        </el-row>
        <!-- 表格 -->
        <div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column prop="dateCompleted" label="时间" align="center" width="180"></el-table-column>
                <el-table-column prop="orderNo" label="单据号" align="center" width="160"></el-table-column>
                <el-table-column prop="goodsName" label="商品" align="center" width="160"></el-table-column>
                <el-table-column prop="billTypeName" label="单据类型" align="center" width="100"></el-table-column>
                <el-table-column prop="nodeName" label="外发节点" align="center" width="100"></el-table-column>
                <el-table-column prop="charger" label="业务员" align="center"></el-table-column>
                <el-table-column prop="needPayAdd" label="应付增加" align="center" width="100"></el-table-column>
                <el-table-column prop="needPayReduce" label="应付减少" align="center" width="100">
                </el-table-column>
                <el-table-column prop="balance" label="累计欠款" align="center" width="100">
                    <!--<template slot-scope="scope">-->
                        <!--<span class="text-red">￥{{scope.row.needPayAdd - scope.row.needPayReduce}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="remark" label="收款账号/备注" align="center" min-width="180">
                    <template slot-scope="scope">
                    <span class="text-red">{{scope.row.remitMethodName}}/{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="工单制单数" align="center" width="120"></el-table-column>
                <el-table-column prop="actualCuttingQuantity" label="工单实裁数" align="center" width="120"></el-table-column>
                <el-table-column prop="sendOutNum" label="发出数" align="center"></el-table-column>
                <el-table-column prop="total" label="加工收回数" align="center" width="120"></el-table-column>
                <el-table-column prop="machiningUnitPrice" label="加工单价" align="center" width="100"></el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20"
                           layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 付款弹窗 -->
        <payment-dialog :isShow.sync="isShow" :outsideFactoryId="$route.query.id" @getSuccess="getFactoryPayDetails"></payment-dialog>
    </div>
</template>
<script>
    import paymentDialog from './component/paymentDialog'
    import {factoryPayDetails,factoryPayExportExcel} from '@/api/api'
    export default {
        components: {paymentDialog},
        data() {
            return {
                dateList: [
                    {value: '', label: '全部'},
                    {value: 1, label: '近一个月'},
                    {value: 2, label: '日历选择'}
                ],
                typeList: [
                    {value: 'ALL', label: '全部'},
                    {value: 'FACMISSION', label: '工单'},
                    {value: 'PAY', label: '付款'}
                ],
                value7: '',
                valueFilter: '',
                pickerOptions2: {
                    shortcuts: [{
                        text: '全部',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit('pick', ['', '']);
                        }

                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                form: {
                    date: '',
                    billType: 'ALL'
                },
                currentPage: 0,
                totalCount: 0,
                isShow: false,
                tableData: []
            }
        },
        created() {
            this.getFactoryPayDetails()

        },
        methods: {
            //获取详情
            getFactoryPayDetails(){
                let startDate = '';
                let endDate = '';
                console.log(this.valueFilter);
                if(this.valueFilter!==''){
                    startDate = this.valueFilter.substring(0,10)
                    endDate = this.valueFilter.substring(12,22)
                }
                let obj =   {
                    "outsideFactoryId":this.$route.query.id,    // 外发厂id  必传
                    "startDate":startDate,                     // 开始日期
                    "endDate":endDate,                       // 结束日期
                    "billType":this.form.billType,                             // 单据类型  ALL:全部; PAY:付款; FACMISSION:工单
                    pageNo:this.currentPage,
                    pageSize:20
                };
                factoryPayDetails(obj).then(res=>{
                    console.log(res);
                    if(!res.data.data) return;
                    this.tableData = res.data.data.list
                    this.totalCount = res.data.data.totalCount

                })

            },
            //导出表格
            exportExcel(){
                let startDate = '';
                let endDate = '';
                console.log(this.valueFilter);
                if(this.valueFilter!==''){
                    startDate = this.valueFilter.substring(0,10)
                    endDate = this.valueFilter.substring(12,22)
                }
                let obj =   {
                    "outsideFactoryId":this.$route.query.id,    // 外发厂id  必传
                    "startDate":startDate,                     // 开始日期
                    "endDate":endDate,                       // 结束日期
                    "billType":this.form.billType,                          // 单据类型  ALL:全部; PAY:付款; FACMISSION:工单
                };
                factoryPayExportExcel(obj).then(res=>{
                    console.log(res);
                    let blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','样表文件'+this.currentTime()+'.xls');
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
            getDate(val) {
                this.valueFilter=val
                console.log(val);
            },
            reset(){
                this.form.billType = 'ALL';
                this.value7 = ''
            },
            // 付款
            getPay(id) {
                this.isShow = true
            },
            // 分页
            handleCurrentChange() {
                this.getFactoryPayDetails()
            },
            // 返回
            goBack() {
                this.$router.back()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .page {
        margin: 20px 0;
        text-align: right;
        margin-right: 32px;
    }

    .text-green {
        color: #23C811;
    }

    .text-red {
        color: #FFA914;
    }
</style>


