<template>
    <div class="dynamic-table" ref="dynamicTable">
        <el-table
                :key="activeIndex"
                class="custom-table"
                border
                :data="body"
                style="width: 100%"
                :max-height="offHeight?offHeight:766"
                :row-class-name="tableRowClassName">
            <template v-for="item in headers">
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
                            <span class="red" v-else-if="scope.row.status ==='REJECTED'">已驳回(驳回原因：{{scope.row.rejectReason}})</span>
                            <span class="green" v-else-if="scope.row.status ==='PASS'" >已通过</span>
                        </div>
                        <div v-else-if="item.key ==='branchStatus'">
                            <span class="gray" v-if="scope.row.branchStatus ==='NOT_REPORT'">未提报</span>
                            <span class="blue" v-else-if="scope.row.branchStatus ==='WAIT_AUDIT'">待审核</span>
                            <span class="red" v-else-if="scope.row.branchStatus ==='REJECTED'">已驳回(驳回原因:{{scope.row.rejectReason}})</span>
                            <span class="green" v-else-if="scope.row.branchStatus ==='PASS'" >已通过</span>
                        </div>
                        <div v-else>{{scope.row[item.key]}}</div>
                    </template>
                </el-table-column>
            </template>
            <!--<el-table-column v-if="hasNextLevel&&!isOriginal"-->
                    <!--class-name="no-padding"-->
                    <!--align="center"-->
                    <!--fixed="right"-->
                    <!--width="100"-->
                    <!--label="操作">-->
                <!--<template slot-scope="scope">-->
                   <!--<span @click="goNextLevelDetail(scope.row)" v-if="!scope.row.isTotal&&scope.row.isNextLeader" class="pointer blue">查看下级</span>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column v-if="isMiddlePage"
                             class-name="no-padding"
                             align="center"
                             fixed="right"
                             width="80"
                             label="操作">
                <template slot-scope="scope">
                    <span @click="goDetail(scope.row)" v-if="!scope.row.isTotal" class="pointer blue">查看</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        // hasNextLevel：是否有下一级
        // isMiddlePage：是否是中间页
        props:['headers','body','hasNextLevel','isMiddlePage','isOriginal'],
        data(){
            return {
                offHeight:0,//表格的最大高度
                levelnames:this.$route.query.levelName,
            }
        },
        computed: {
            level(){
                return this.$route.query.level
            },
            type(){
                return this.$route.query.type
            },
            activeIndex(){
                return this.$route.query.activeIndex
            },
            levelName(){
                return this.$route.query.levelName
            },
            branchesLength(){
                return this.$route.query.branchesLength

            }
        },
        methods: {
            tableRowClassName(row,index){
                if(row.isTotal){
                    return 'total-row'
                }
                return ''
            },
            // 前往当级拆解详情
            goDetail(row){
                let query = {
                    levelId:this.$route.query.levelId,
                    planId:row.planId,
                    level:this.level,
                    type:this.type,
                    activeIndex:this.activeIndex,
                    levelName:this.levelName,
                    baseAttrId:row.baseAttrId,
                    baseAttrIdsStr:row.baseAttrIdsStr,
                }
                this.$router.push({path:'/procurementPlan/levelDetail',
                    query: query
                })
            },
            // 前往下级拆解详情
            goNextLevelDetail(row){
                let query = {
                    levelId:row.nextLevelId, //去下一级的levelId,从后台返回
                    planId:row.planId,
                    level:parseInt(this.level)+1,
                    type:this.type, //支线没有详情，所以type一定为'level',所以可以直接取详情query的type
                    activeIndex:parseInt(this.activeIndex)+parseInt(this.branchesLength)+1,
                    levelName:row.nextLevelName,  //这里的levelName得从后台拿，不能拿$route.query的
                    // TODO 后台这里没有返回 baseAttrId，因为这个版本（v2.3）去除了"查看下级"的操作列，所以先不管
                    baseAttrId:row.baseAttrId
                }
                this.$router.push({path:'/procurementPlan/levelDetail',
                    query: query
                })
            },

        },
        created(){

        },
        mounted() {
            this.$nextTick(()=>{
                this.offHeight = $('.dynamic-table').height();
            });
        },
    }
</script>

<style lang="scss">
    .dynamic-table{
        height: 100%;
        .el-table tr.total-row{
            background-color: #F0F2F5;
        }
        /*控制table表格的横向滚动条在没有超出显示范围的时候出现的滚动条的bug*/
        .custom-table{
            .el-table__body-wrapper{
                .el-table__body{
                    border-collapse:unset !important;
                }
            }
        }
    }
</style>
