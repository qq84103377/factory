<template>
    <main class="detail-main">
        <el-row class="btn-wrapper">
            <nf-button type="warning" :disabled="nodeDetailData.status === 2" plain @click="addSampleFile">新建样衣档案</nf-button>
        </el-row>
        <ul class="sample-list">
            <sample-item
            v-for="(item,index) of samples"
            :sample-item="item"
            :item-index="index"
            :node-detail-data="nodeDetailData"
            :key="item.sampleId"></sample-item>
        </ul>
    </main>
</template>

<script>
import SampleItem from '../common/sample-item';
export default {
    props: {
        nodeDetailData: Object
    },
    data() {
        return {
        }
    },
    computed: {
        samples() {
            return this.nodeDetailData.functionData && this.nodeDetailData.functionData.samples;
        }
    },
    components: {
        SampleItem
    },
    methods: {
        addSampleFile() {
            // 新建样衣单页面重vuex获取designStyleNo
            this.$store.dispatch('setDesignStyleNo', this.nodeDetailData.designStyleNo);
            sessionStorage.setItem("setDesignStyleNo", this.nodeDetailData.designStyleNo);
            this.$router.push({
                path: '/designFile/designFileDetail/clothesFile',
                query: {
                    designStyleId: this.nodeDetailData.designStyleId,
                    isCreate: 1,
                    missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './common.scss';

</style>
