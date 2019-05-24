<template>
    <section>
        <page-title title="工单节点动态">
            <nf-button class="btn" @click="$router.back()">
                返回上级
            </nf-button>
        </page-title>
        <el-row>
            <el-select v-model="missionPrcdNodeId" @change="fetchDynamicList" placeholder="选择节点">
                <el-option
                    v-for="item of nodeOptions"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"></el-option>
            </el-select>
        </el-row>
        <div>
            <p class="empty-text" v-show="!listData.length">暂无数据</p>
            <dynamics-item style="margin-top: 12px;" v-for="item of listData" :key="item.id" :log-item="item"></dynamics-item>
        </div>
    </section>
</template>

<script>
import { getDesignMissionDetail, getDesignNodeDynamicList } from '@/api/sample-centre';
import DynamicsItem from './dynamics-item';
export default {
    data() {
        return {
            missionPrcdNodeId: '',
            designMissionId: '',
            nodeOptions: [],
            listData: []
        };
    },
    components: {
        DynamicsItem
    },
    computed: {
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        }
    },
    created() {
        const { designMissionId, missionPrcdNodeId } = this.$route.query;
        this.missionPrcdNodeId = missionPrcdNodeId;
        this.designMissionId = designMissionId;
        this.fetchFacMissionDetail();
        this.fetchDynamicList();
    },
    methods: {
        // 获取工单详情
        fetchFacMissionDetail() {
            getDesignMissionDetail({
                missionId: this.designMissionId
            }).then(res => {
                if (res.data.code === 0) {
                    this.nodeOptions = res.data.data.nodes;
                }
            });
        },
        fetchDynamicList() {
            const params = {
                missionPrcdNodeId: this.missionPrcdNodeId,
                designMissionId: this.designMissionId
            };
            getDesignNodeDynamicList(params)
            .then(res => {
                console.log(res);
                this.listData = res.data.data;
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .empty-text {
        padding: 20px 0;
        margin-top: 12px;
        text-align: center;
        color: #A2ABB8;
        font-size: 14px;
        background: #fff;
    }
</style>

