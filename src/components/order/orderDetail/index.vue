<template>
    <section class="order-detail">
        <page-title class="order-detail__header" title="工单详情">
            <nf-button @click="goBack">
                <i class="el-icon-arrow-left"></i>返回上级</nf-button>
        </page-title>
        <order-info
                @updateInfo="fetchFacMissionInfo()"
                @refreshAll="refreshAll"
                :orderData="orderData"
                :quantities="quantities"
                :metadatas="metadatas">
        </order-info>
        <div class="order-detail__content">
            <node-process :isCancel="orderData.cancel == 1"></node-process>
        </div>
    </section>
</template>

<script>
import orderInfo from "./orderInfo";
import nodeProcess from "./nodeProcess";
import { getFacMission, getGoodSkuList } from "@/api";
export default {
    inject: ['homeRouterReload'],     //注入全局刷新方法
    data() {
        return {
            componentName: "orderDetail",
            orderData: {
                processForm: {
                    attachments: []
                }
            },
            metadatas: [],
            quantities: []
        };
    },
    computed: {
        facId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        missionId() {
            return this.$route.query["missionId"];
        }
    },
    components: {
        orderInfo,
        nodeProcess,
        // nodeMessage
    },
    activated() {
        this.fetchFacMissionInfo();
    },
    created() {
        this.fetchFacMissionInfo();

    },
    methods: {
        //刷新所有组件
        refreshAll(){
            this.homeRouterReload();
        },
        goBack() {
            this.$store.dispatch('deleteVisitedView', this.$route);
            this.$router.push(`/workorders?currentPage=${this.$route.query['currentPage']}&scrollTop=${this.$route.query['scrollTop']}`);

        },
        fetchFacMissionInfo() {
            getFacMission({
                facId: this.facId,
                missionId: this.missionId
            }).then(async res => {
                if (res.data.code === 0) {
                    this.orderData = res.data;
                    this.$store.dispatch("getOutSideFlag", this.orderData.outSideFlag);
                    this.metadatas = await this.fetchGoodSku(res.data.goodsId);
                    this.quantities = res.data["missionDetailsList"];
                } else {
                    this.$router.replace('workorders');
                }
            });
        },
        fetchGoodSku(goodsId) {
            const params = {
                goodsId: goodsId
            };
            return getGoodSkuList(params).then(res => {
                return res.data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.order-detail {
    &__header {
        margin-bottom: 0;
    }
    &__content {
        display: flex;
        margin-top: 16px;
        justify-content: space-between;
    }
}
</style>

