<template>
    <div class="procurement-plan-list" v-loading ='isLoading'>
        <div class="box-shadow mgt16">
            <el-table
                    class="custom-table"
                    border
                    :data="otbList"
                    style="width: 100%"
                    :row-class-name="tableRowClassName">
                <el-table-column
                        prop="name"
                        min-width="220"
                        label="名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                        <span v-if="scope.row.planStatus ==='DELETED'">（已作废）</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="规划时段"
                        width="180">
                    <template slot-scope="scope">
                        {{new Date(scope.row.startDate).getFullYear()+'年'+(parseInt(new Date(scope.row.startDate).getMonth())+1)+'月'}}
                        -
                        {{new Date(scope.row.endDate).getFullYear()+'年'+(parseInt(new Date(scope.row.endDate).getMonth())+1)+'月'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="leaderUserName"
                        width="130"
                        label="总负责人">
                </el-table-column>
                <el-table-column
                        prop="unit"
                        width="68"
                        label="单位">
                </el-table-column>
                <el-table-column
                        prop="originalOtbAmount"
                        width="118"
                        label="原始采购预算">
                </el-table-column>
                <el-table-column
                        prop="otbAmount"
                        width="118"
                        label="采购总预算OTB">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="98"
                        label="一级审核状态">
                    <template slot-scope="scope">
                        <span class="gray" v-if="scope.row.status ==='NOT_REPORT'">未提报</span>
                        <span class="blue" v-else-if="scope.row.status ==='WAIT_AUDIT'">待审核</span>
                        <span class="red" v-else-if="scope.row.status ==='REJECTED'">已驳回</span>
                        <span class="green" v-else-if="scope.row.status ==='PASS'" >已通过</span>
                    </template>
                </el-table-column>
                <!--<el-table-column-->
                        <!--prop="planStatus"-->
                        <!--width="98"-->
                        <!--label="企划状态">-->
                    <!--<template slot-scope="scope"><span>{{scope.row.planStatus}}</span>-->
                        <!--&lt;!&ndash;<span v-if="scope.row.planStatus ==='DELETED'">已作废</span>&ndash;&gt;-->
                        <!--<span v-if="scope.row.planStatus ==='ONGOING'">企划中</span>-->
                        <!--<span v-else-if="scope.row.planStatus ==='END'">已结束</span>-->
                        <!--<span v-else>已作废</span>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        prop="creatorName"
                        width="130"
                        label="创建人">
                </el-table-column>
                <el-table-column
                        prop="dateCreated"
                        width="150"
                        label="创建日期">
                </el-table-column>
                <el-table-column
                        class-name="no-padding"
                        align="center"
                        fixed="right"
                        prop="name"
                        width="136"
                        label="操作">
                    <template slot-scope="scope">
                        <div class="action-list">
                            <div class="item blue" v-if="scope.row.planStatus !=='DELETED'" @click="goDetail(scope.row)">查看</div>
                            <div class="item gray" v-else>查看</div>


                            <div v-if="scope.row.status === 'NOT_REPORT'&&scope.row.planStatus !=='DELETED'" class="item">
                                <el-dropdown>
                                      <span class="blue fs12">
                                        更多
                                      </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native='editTurn(scope.row.id)'>
                                            <span class="fs12" >编辑</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native ="showDelete(scope.row.id,'void')"><span class="fs12" >作废</span></el-dropdown-item>
                                        <el-dropdown-item v-if="scope.row.canDelete" @click.native ='showDelete(scope.row.id,"delete")'><span class="fs12" >删除</span></el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <div v-else class="item">
                                <div class="gray" v-if="!scope.row.canDelete">更多</div>
                                <div class="blue" v-else>
                                    <el-dropdown>
                                      <span class="blue fs12">
                                        更多
                                      </span>
                                        <el-dropdown-menu slot="dropdown">
                                         <el-dropdown-item  @click.native ='showDelete(scope.row.id,"delete")'><span class="fs12" >删除</span></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mgt16 text-right">
            <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next"
                           :total="total" :current-page.sync="pageNum">
            </el-pagination>
        </div>
        <el-dialog class="custom-dialog tip-dialog"
                   :visible.sync="deleteItem.visible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   :modal-append-to-body="false"
                   size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确定要{{deleteItem.type==='void'?'作废':'删除'}}该采购规划？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteItem.visible = false">取 消</el-button>
                <el-button  type="primary" @click="deleteOtb">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapMutations, mapGetters } from "vuex";
    import { getOtbList,deleteOtb } from '@/api/goodsPlan.js'
    import {deleteOtbActual} from '@/api'
    export default {
        data(){
            return {
                deleteItem:{
                    visible:false,
                    id:''
                },
                deleteVisible:false,
                isLoading:false,
                total: 1,
                pageNum: 1,
                otbList: []
            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },

        },
        methods: {
            getOtbList(){
                let params = {
                    pageSize:20,
                    pageNum:this.pageNum,
                    bossUnitId:this.bossUnitId
                }
                this.isLoading = true
                getOtbList(params).then(res =>{
                    this.isLoading = false
                    if(res.data.code === 0){
                        this.otbList = res.data.otbList
                        this.total = res.data.totalCount
                    }
                })
            },
            // 分页
            loadingMore(page) {
                console.log(page);
                this.pageNum = page;
                this.getOtbList()
            },
            // 显示作废弹窗
            showDelete(id,type){
                // 权限
                if(!this.powerJudgement.permissions("fac.productPlanning.otb.cancel")){
                    return
                }
                //删除权限
                if(type==='delete'&&!this.powerJudgement.permissions("fac.productPlanning.otb.delete")){
                    return
                }
                this.deleteItem.id = id
                this.deleteItem.type = type
                this.deleteItem.visible = true
            },
            deleteOtbActual(id){

            },
            // 作废
            deleteOtb(id){
                let api;
                let params = {
                    id: this.deleteItem.id
                };
                if(this.deleteItem.type==='void'){
                    api = deleteOtb

                }else {
                    api = deleteOtbActual;
                    params.planId=this.deleteItem.id
                }

                api(params).then(res =>{
                    if(res.data.code ===0){
                        this.deleteItem.visible = false
                        this.$message.success(res.data.msg)
                        this.getOtbList()
                    } else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 作废的行置灰
            tableRowClassName(row, index) {
                if (row.planStatus === 'DELETED') {
                    return 'gray';
                }
                return '';
            },
            goDetail(row){
                this.$router.push({path:'/procurementPlan/levelDetail',
                    query:{
                        level:1,
                        type:'level',
                        levelId:row.levelId,
                        activeIndex:0,
                        planId:row.id,
                }})
            },
            editTurn(id){
                // 权限
                if(!this.powerJudgement.permissions("fac.productPlanning.otb.edit")){
                    return
                }
                let nowId = id;
                this.$router.push({
                    path:'/procurementPlan/edit',
                    query:{id:nowId}
                });
            }
        },
        created(command){
            this.getOtbList()
        }
    }
</script>

<style lang="scss" scoped>
    .procurement-plan-list{
        min-height: 100px;
    }
</style>
