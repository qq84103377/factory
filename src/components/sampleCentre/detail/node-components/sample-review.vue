<template>
    <main class="detail-main">
        <ul class="sample-list">
            <sample-item
            v-for="(item,index) of samples"
            :sample-item="item"
            :key="item.sampleId"
            :node-detail-data="nodeDetailData"
            :item-index="index"
            is-arrow>
                <!-- 提交和审核表格 -->
                <detail-main-table
                    :participants="nodeDetailData.participants"
                    :submitters="item.submitters"
                    :reviewers="item.reviewers"></detail-main-table>
            </sample-item>
        </ul>
    </main>
</template>

<script>
import SampleItem from '../common/sample-item';
import DetailMainTable from '../common/detail-main-table';
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
        SampleItem,
        DetailMainTable
    }
}
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
