<template>
    <section class="sample-detail">
        <page-title title="设计工单详情">
            <nf-button class="btn" @click="$router.back()">
                返回上级
            </nf-button>
        </page-title>
        <!-- 工单信息 -->
        <mission-info :order-data="orderData" @on-update="fetchFacMissionDetail"></mission-info>
        <!-- 节点列表导航 -->

        <div class="component-wrap">
            <div class="cancel-mask" v-show="orderData.cancel"></div>
            <node-list-nav :order-data="orderData"></node-list-nav>
            <!-- 节点列表页或者节点详情页 -->
            <component
                :is="componentId"
                :order-data="orderData"
                @on-update="fetchFacMissionDetail"></component>
        </div>
    </section>
</template>

<script>
    import { getDesignMissionDetail } from '@/api/sample-centre';
    import MissionInfo from './mission-info';
    import NodeListNav from './node-list-nav';
    import NodeList from './node-list';
    import NodeDetail from './node-detail';
    export default {
        componentName: 'SampleMissionDetail',
        data() {
            return {
                orderData: {}
            };
        },
        components: {
            MissionInfo,
            NodeListNav,
            NodeList,
            NodeDetail
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            missionId() {
                return this.$route.query['missionId'];
            },
            componentId() {
                return this.$route.query.instanceWorkflowId ? 'NodeDetail' : 'NodeList'
            },
        },
        created() {
            this.fetchFacMissionDetail();
            this.$on('update.mission.detail', this.fetchFacMissionDetail);
        },
        methods: {
            // 获取工单详情
            fetchFacMissionDetail() {
                getDesignMissionDetail({
                    missionId: this.missionId
                }).then(res => {
                    console.log(res);
                    if (res.data.code === 0) {
                        this.orderData = res.data.data;
                    }
                    else {
                        this.$router.replace('/sample');
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .component-wrap {
        position: relative;
        overflow: hidden;
        .cancel-mask {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            z-index: 9;
            background: rgba(255, 255, 255, .6);
            pointer-events: none;
            cursor: default;
        }
    }
</style>

