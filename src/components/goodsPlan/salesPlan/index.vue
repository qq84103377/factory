<template>
    <div class="sales-plan-index">
        <page-title title="历史销售计划列表">
            <div class="btns">
                <nf-button class="mgl8" type="warning" @click="addSalesPlan">+ 新建销售计划</nf-button>
            </div>
        </page-title>

        <div class="mgt8" v-loading="loading" style="min-height: 100px">
            <el-table
                    class="custom-table"
                    :row-class-name="tableRowClassName" empty-text="暂无数据"
                    :data="tableData" border style="width: 100%">
                <el-table-column sortable prop="name" label="名称">
                </el-table-column>
                <el-table-column label="计划时段" width="160">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.beginDate}} - {{scope.row.endDate}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="leaderName" label="总负责人" width="120">
                </el-table-column>
                <el-table-column prop="auditorName" label="总审核人" width="120">
                </el-table-column>
                <el-table-column prop="amount" label="销售计划总额" width="120">
                </el-table-column>
                <el-table-column prop="unit" label="单位" width="120">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <div :class="{'gray':['NOT_REPORT','DELETED'].includes(scope.row.status),
                                        'blue':scope.row.status === 'WAIT_AUDIT',
                                        'red':scope.row.status === 'REJECTED'}">
                            {{getStatusText(scope.row.status)}}
                            <span v-if="scope.row.status === 'REJECTED'">（驳回原因：{{scope.row.rejectReason}}）</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="creatorName" label="创建人" width="120">
                </el-table-column>
                <el-table-column prop="createAt" label="创建日期" width="160">
                </el-table-column>
                <el-table-column class-name="no-padding"
                                 align="center"
                                 fixed="right" label="操作" width="160">
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div class="item blue cursor" @click="goDetail(scope.row.id)">查看</div>
                            <div v-if="['NOT_REPORT','REJECTED'].includes(scope.row.status)" class="item cursor">
                                <el-dropdown>
                                      <span class="blue fs12">
                                        更多
                                      </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native ='showDeleteSalesPlan(scope.row.id)'><span class="fs12" >作废</span></el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <div v-else class="item gray">更多</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="text-right mgt8">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="form.pageNum" :page-size="20"
                           layout="total, prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <!--删除确认框-->
        <el-dialog :modal-append-to-body="false"  class="custom-dialog tip-dialog"
                   :visible.sync="deleteSalesPlan.visible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否作废该销售计划？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteSalesPlan.visible = false">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmDeleteSalesPlan">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getSalesPlanList,deleteSalesPlan} from '@/api/goodsPlan.js'

    import PageTitle from "@/components/Common/page-title.vue";

    export default {
        name:'salesPlanIndex',
        data() {
            return {
                loading:false,
                isSubmitting:false,
                deleteSalesPlan:{
                  visible:false,
                  currentSalesPlanId:''
                },
                isDeleteVisible:false,

                form:{
                    pageNum:1,
                    pageSize:20,
                },
                total: 0,
                tableData: [],

            }
        },
        components: {
            PageTitle,
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            statusText(){

                return 'gray'
            }
        },
        methods: {
            handleCurrentChange(page) {
                this.form.pageNum = page;
                // this.purchaseList()
            },
            addSalesPlan(){
                 // 权限
                if(!this.powerJudgement.permissions("fac.marketPlan.add")){
                    return
                }
                this.$router.push({path:'/salesPlan/edit',query:{type:'add'}})
            },
            // 导入店铺
            confirmImport(){
                console.log("导入店铺")

            },
            //下载导入模板
            downloadTemplate(){
                console.log("下载导入模板")
            },
            // 作废销售计划
            showDelete(){

            },
            getSalesPlanList(){
                let params = {
                    ...this.form,
                    unitId:this.unitId
                }
                this.loading = true
                getSalesPlanList(params).then(res => {
                    this.loading = false
                    if(res.data.code ===0 ){
                        this.tableData = res.data.data.datas
                        this.total = res.data.data.totalCount
                    }
                })
            },
            //进入详情
            goDetail(id){
                this.$router.push({path:'/salesPlan/detail',query:{salesPlanId:id}})
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
            // 已作废的行变灰
            tableRowClassName(row,index){
                if(row.status === 'DELETED'){
                    return 'gray'
                }
                return ''
            },
            // 作废销售计划
            showDeleteSalesPlan(salesPlanId){
                 // 权限
                if(!this.powerJudgement.permissions("fac.marketPlan.cancel")){
                    return
                }
                this.deleteSalesPlan.visible = true
                this.deleteSalesPlan.currentSalesPlanId = salesPlanId
            },
            confirmDeleteSalesPlan(){
                let params = {
                    id:this.deleteSalesPlan.currentSalesPlanId
                }
                this.isSubmitting = true
                deleteSalesPlan(params).then(res => {
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.getSalesPlanList()
                        this.deleteSalesPlan.visible = false
                        this.$message.success('作废成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        created() {
            this.getSalesPlanList()
        },
    }
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">

</style>

