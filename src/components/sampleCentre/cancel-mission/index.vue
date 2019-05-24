<template>
    <section>
        <page-title title="已撤销的设计工单">
            <el-row>
                <el-input
                    style="width: 260px;"
                    @change="remoteSearch"
                    class="search-input"
                    v-model="orderSearch"
                    placeholder="输入工单号搜索"
                    icon="search">
                </el-input>
                <nf-button @click.native="$router.back()">
                    返回上级
                </nf-button>
            </el-row>
        </page-title>
        <div class="mission-wrap">
            <!--工单列表-->
            <mission-list
                :missionList="orderList" />
        </div>
        <!--分页-->
        <div class="page-pagination">
            <el-pagination
                @current-change="loadingMore"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="pageCount"
                :current-page.sync="currentPage">
            </el-pagination>
        </div>
    </section>
</template>

<script>
    import MissionList from '../mission/mission-list';
    import { debounce } from '@/utils';
    import { getDesignMissionList } from '@/api/sample-centre';
    export default {
        componentName: 'SampleMission',
        name: 'SampleMission',
        data() {
            return {
                pageCount: 0, //工单总数,页码需要显示
                currentPage: 1,  // 工单当前页码，返回上级回到当前页码需要
                pageSize: 10,
                orderList: [],
                orderSearch: ''
            };
        },
        components: {
            MissionList
        },
        computed: {
            // 计算属性
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
        },
        created() {
            this.fetchMissionList();
        },
        mounted() {
        },
        methods: {   
            // 获取工单列表数据
            fetchMissionList(params = {}) {
                const data = {
                    facId: this.facId,
                    userId: this.userId,
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    isCancel: true,
                    ...params
                };
                getDesignMissionList(data)
                .then(res => {
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.orderList = res.data.data.list;
                    this.pageCount = res.data.data.totalCount;
                });
            },
            // 分页
            loadingMore(page) {
                this.currentPage = page;
                this.fetchMissionList({pageNo: page});
            },
            remoteSearch(orderNo) {
                debounce(this.fetchMissionList)({orderNo: this.orderSearch});
            },
        }
    };
</script>

<style lang="scss" scoped>
    .page-pagination {
        display: flex;
        justify-content: flex-end;
        padding-top: 18px;
        padding-bottom: 30px;
    }

</style>
