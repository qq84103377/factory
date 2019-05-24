<template>
    <section class="stock-bill">
        <filter-form @submit="submit"></filter-form>
        <el-table
                v-loading="loading"
                border
                highlight-current-row
                @current-change="handleCurrentChange"
                :data="stockBillList"
                style="width: 100%;margin-top: 8px;font-size: 12px;">
            <el-table-column
                    prop="orderNo"
                    label="单据号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operateTypeText"
                    label="单据类型">
            </el-table-column>
            <el-table-column
                    prop="operaterName"
                    label="操作人">
            </el-table-column>
            <el-table-column
                    prop="dateOperate"
                    label="操作日期">
                <template slot-scope="scope">
                   <div>{{scope.row.dateOperate}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="facMissionNo"
                    label="工单号">
            </el-table-column>
            <el-table-column
                    prop="commonOutsideFactoryName"
                    label="供应商">
            </el-table-column>
            <el-table-column
                    prop="customerName"
                    label="客户">
            </el-table-column>
            <el-table-column
                    label="总计数量">
                <template slot-scope="scope">
                    <div v-if="scope.row.addNum&&scope.row.subtractNum">
                        +{{scope.row.addNum}}/-{{scope.row.subtractNum}}
                    </div>
                    <div v-else>{{scope.row.addNum?'+'+scope.row.addNum:'-'+scope.row.subtractNum}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    label="总计金额">
                <template slot-scope="scope">
                    <div v-if="scope.row.addNum&&scope.row.subtractNum">¥{{scope.row.amount}}</div>
                    <div v-else>¥{{scope.row.addAmount||scope.row.subtractAmount}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
            <el-table-column
            prop="reviewStatusText"
            label="审核状态">
            </el-table-column>
            <el-table-column
            prop="reviewRemark"
            label="审批备注">
            </el-table-column>
            <el-table-column
                prop="printCount"
                label="打印次数">
            </el-table-column>
            <el-table-column
                align="center"
                    label="操作">
                <template slot-scope="scope">
                    <div style="display: flex;flex-wrap:wrap;justify-content:center; color: #1CA1FF;white-space: nowrap">
                        <!--<span @click="print" style="cursor: pointer;">打印</span>-->
                        <el-dropdown v-if="scope.row.operateTypeText!='调整'" trigger="click">
                            <span style="color: #1CA1FF;font-size: 12px;cursor: pointer;" class="el-dropdown-link">打印</span>
                            <el-dropdown-menu slot="dropdown" v-loading="listLoading">
                                <el-dropdown-item style="font-size: 12px;line-height: 20px;" disabled>选择库存单打印模板</el-dropdown-item>
                                <el-dropdown-item style="font-size: 12px;line-height: 20px;" :divided="index==0" :class="{active: item.defaultStatus ==1 ? true : false}" v-for="(item, index) in printList" :key="index" @click.native="go(item,scope.row.id)">{{item.name}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!--<printTemplateBtn type="stock" :id="scope.row.id"></printTemplateBtn>-->
                        <span style="margin-left: 15px;cursor: pointer;"
                              @click="viewDetail(scope.row)">查看详情</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div style="overflow: hidden;margin-top: 8px;">
            <el-pagination
                    style="float: right;"
                    layout="total, prev, pager, next"
                    :page-size="20"
                    :current-page="pageNo"
                    :total="totalCount"
            @current-change="handlePageChange">
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import filterForm from './filter-form'
    import {billList,facTemplates} from '@/api'
    import printTemplateBtn from '../material/printTemplateBtn'


    export default {
        components: {
            filterForm,
            printTemplateBtn
        },
        data() {
            return {
                listLoading: false,
                stockBillList: [],
                printList: [],
                pageNo: 1,
                totalCount: 0,
                formParams: {},
                loading: false,
                currentRow:'',
            }
        },
        computed: {
            storehouseId() {
                return this.$route.query.storehouseId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
        },
        watch: {
            $route(v) {
                if(v.path === '/home/stock/bill'){
                    this.pageNo = 1
                    this.formParams.pageNo = 1
                    this.formParams.storehouseId = this.storehouseId
                    this.getStockList()
                }
            }
        },
        methods: {
            viewDetail(row) {
                let type = this.handleType(row.operateTypeText);
                if(type == 0 || type == 1 || type == 5) {
                    this.$router.push(`/stockDetailNew?id=${row.id}&type=${type}&storehouseId=${this.storehouseId}`)
                }else {
                    this.$router.push(`/stockDetail?id=${row.id}&type=${type}&storehouseId=${this.storehouseId}`)
                }
            },
            // 获取组织层列表
            getFacTemplates () {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    type: 'stock',
                    pageNo: 1,
                    pageSize: 9999,
                    using:true,
                    typeId:''
                }
                this.listLoading = true
                facTemplates(params).then(res => {
                    this.listLoading = false
                    this.printList = res.data.data.list || []
                })
            },
            go(item,id) {
                    // // 权限
                    // if (!this.powerJudgement.permissions("fac.prcmission.print")) {
                    //     return
                    // }

                    window.open(`/#/printShow?templateId=${item.id}&businessId=${id}&printType=print`)
            },
            //
            handleCurrentChange(val) {
                this.currentRow = val;
            },
            handlePageChange(v) {
                this.pageNo = v
                this.formParams.pageNo = v
                this.getStockList()

            },
            handleType(text) {
                switch(text) {
                    case '出库':
                        return 0
                    case '入库':
                        return 1
                    case '调整':
                        return 2
                    case '发货':
                        return 3
                    case '退货':
                        return 4
                }
            },
            submit(form) {
                this.pageNo = 1
                this.formParams = {
                    ...form,
                    pageNo: this.pageNo,
                    pageSize: 20
                }
                this.getStockList()
            },
            getStockList() {
                this.loading = true
                billList(this.formParams).then(res => {
                    this.loading = false
                    this.stockBillList = res.data.data?res.data.data.list:[]
                    this.totalCount = res.data.data?res.data.data.totalCount:0
                })
            }
        },
        created() {
            this.getFacTemplates();
        },
        activated() {
            this.getFacTemplates()
            if (this.$route.query.isUpdate) {
                //如果是新建库存单据之后返回列表页面的话需要刷新
                this.getStockList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .stock-bill {
        margin-top: 8px;
    }
</style>
<style lang="scss">
    .stock-bill {
        tr.current-row > td{
            background: #F1FAFF;
        }
    }
</style>

