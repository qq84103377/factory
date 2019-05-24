<!--"设置店铺销售目标"组件-->
<template>
    <div class="set-sales-target">
        <el-dialog :close-on-click-modal="false" :modal-append-to-body="false" class="custom-dialog " title="店铺销售目标"
                   :visible.sync="visible" size="small" @close="cancel">
            <div class="mgt16">
                <el-table
                        class="custom-table no-hover-highlight"
                        border
                        :data="[rowData]">
                    <el-table-column width="68" prop="brands" label="品牌">
                    </el-table-column>
                    <el-table-column width="68" prop="largeArea" label="大区">
                    </el-table-column>
                    <el-table-column width="160" prop="area" label="所在地区">
                        <!--<template slot-scope="scope">-->
                        <!--<div v-if="scope.row.provinceName">{{scope.row.provinceName+-->
                        <!--(scope.row.cityName?'/'+scope.row.cityName:'')+-->
                        <!--(scope.row.areaName?''+scope.row.areaName:'')}}</div>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column prop="name" label="店铺名称">
                    </el-table-column>
                    <el-table-column width="80" prop="level" label="店铺评级">
                    </el-table-column>
                    <el-table-column prop="attr1s" :label="customStoreAttr[0]" width="120">
                    </el-table-column>
                    <el-table-column prop="attr2s" :label="customStoreAttr[1]" width="120">
                    </el-table-column>
                    <el-table-column prop="attr3s" :label="customStoreAttr[2]" width="120">
                    </el-table-column>
                    <el-table-column width="100" prop="planStart" label="计划开店时间">
                    </el-table-column>
                    <el-table-column width="100" prop="planEnd" label="计划关店时间">
                    </el-table-column>
                    <el-table-column class-name="no-padding" width="160" prop="leaderName" label="负责人">
                        <template slot-scope="scope">
                            <worker-leader v-if="isLeader" v-model="form.leaderId" single="single" placeholder="请选择"></worker-leader>
                            <div v-else class='white-bg' v-else> {{scope.row.leaderName}}</div>
                        </template>
                    </el-table-column>
                </el-table>

                <el-table
                        class="custom-table no-hover-highlight mgt16"
                        border
                        :data="rowData.monthDatas"
                        style="width: 480px">
                    <el-table-column width="160" prop="month" label="月份">
                        <template slot-scope="scope">{{scope.$index ==0 ?'总计':parseInt(scope.row.month)+'月'}}</template>
                    </el-table-column>
                    <el-table-column width="160" prop="lastYearNum" label="去年销售额">
                    </el-table-column>
                    <el-table-column class-name="no-padding" width="160" prop="thisYearNum" label="今年目标">
                        <template slot-scope="scope">
                            <div class="white-bg" v-if="scope.$index ==0">{{thisYearNum}}</div>
                            <el-input @blur="handleThisYearNum($event,scope.row)" @change="setThisYearNum" type="number" v-else v-model="scope.row.thisYearNum" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mgt16">
                    <span class="fs12">备注</span>
                    <el-input v-model="form.remark" style="width: 665px;margin-left: 5px" placeholder="请输入"></el-input>
                </div>
            </div>
            <div slot="footer" class="text-right">
                <el-button @click="cancel">取 消</el-button>
                <el-button :disabled="reporting" :loading="saving" type="primary" @click="save">保存</el-button>
                <el-button :disabled="saving" :loading="reporting" type="primary" @click="report">提报</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {doRecordBatchReport, editSalesPlanRecord} from '@/api/goodsPlan.js'

    export default {
        // rowData:要编辑的行的数据
        // customStoreAttr 自定义店铺属性名
        // isLeader 是否是总负责人
        props: ['visible', 'rowData', 'customStoreAttr', 'isLeader'],
        components: {},
        data() {
            return {
                saving: false,
                reporting: false,
                form: {
                    leaderId: '',
                    remark: ''
                },
                tableData: [],
                thisYearNum:0
            }
        },
        created() {

        },
        watch: {
            visible(val) {
                if (val) {
                    this.form.leaderId = this.rowData.leaderId
                    this.form.remark = this.rowData.remark
                    this.thisYearNum = this.rowData.monthDatas[0].thisYearNum
                }
            },

        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            salesPlanId() {
                return this.$route.query.salesPlanId;
            },
        },
        methods: {
            // 获取销售计划状态对应的文本
            getStatusText(status) {
                let statusText = ''
                switch (status) {
                    case 'NOT_REPORT':
                        statusText = '未提报';
                        break;
                    case 'WAIT_AUDIT':
                        statusText = '待审核';
                        break;
                    case 'REJECTED':
                        statusText = '已驳回';
                        break;
                    case 'PASS':
                        statusText = '已通过';
                        break;
                    case 'DELETED':
                        statusText = '已作废';
                        break;

                }
                return statusText
            },
            cancel() {
                this.$emit('update:visible', false)
            },
            async save() {
                let monthDatas = []
                for (let i = 1; i < this.rowData.monthDatas.length; i++) {
                    let item = this.rowData.monthDatas[i]
                    monthDatas.push({
                        year: item.year,
                        month: item.month,
                        thisYearNum: item.thisYearNum ? item.thisYearNum : 0
                    })
                }
                let params = {
                    ...this.form,
                    recordId: this.rowData.id,
                    monthDatas: monthDatas
                }
                this.saving = true
                await editSalesPlanRecord(params).then(res => {
                    this.saving = false
                    if (res.data.code === 0) {
                        this.$message.success('保存成功')
                        if(!this.reporting){
                            this.$emit('update:visible', false)
                            this.$emit('setSuccess')
                        }
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            async report() {
                this.reporting = true
                await this.save()
                // 提报
                let params = {
                    recordIds: [this.rowData.id]
                }
                if (this.isCheckAll && this.checkAll.value === 'allPage') {
                    params.recordParams = this.checkAll.filterParams
                }
                doRecordBatchReport(params).then(res => {
                    this.reporting = false
                    if (res.data.code === 0) {
                        this.$message.success('提报成功')
                        this.$emit('update:visible', false)
                        this.$emit('setSuccess')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 输入框失去焦点时校验输入是否合法
            handleThisYearNum($event,row) {
                console.log(row.thisYearNum,9999)
                let pattern = /^([1-9]\d{0,11})(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                if (row.thisYearNum !== "" && !pattern.test(row.thisYearNum)) {
                    this.$message.error('目标数只能输入两位小数');
                    row.thisYearNum = 0
                }
            },
            // 计算总目标数
            setThisYearNum(){
                let sum = 0
                for (let i = 1; i < this.rowData.monthDatas.length; i++) {
                    let item = this.rowData.monthDatas[i]
                    sum = sum+ parseFloat(item.thisYearNum?item.thisYearNum:0)
                }
                this.thisYearNum = sum.toFixed(2)
            }

        }
    }
</script>

<style lang="scss">
    .set-sales-target {
        .el-dialog--small {
            width: 1132px;
        }
        .el-dialog--small {
            width: 742px;
        }
        .el-select,
        .el-input {
            width: 100%;
        }
        .no-padding .el-input__inner {
            background-color: #FFF9ED;
            border: none;
        }
        td.no-padding,
        td.no-padding:hover {
            background-color: #FFF9ED !important;
        }
        td.no-padding .white-bg,
        td.no-padding:hover .white-bg {
            padding: 3px 10px;
            background-color: #fff !important;
        }
    }

</style>


<style lang="scss" scoped>
    .set-sales-target {
        .header {
            display: flex;
            justify-content: space-between;
        }
    }

</style>
