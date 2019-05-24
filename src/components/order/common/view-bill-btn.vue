<template>
    <div class="view-bill-wrap">
        <icon-button @click="viewRecord" class="btn" type="icon-reported-record">查看全部上报单据</icon-button>
        <span class="tip" v-if="num > 0">{{num}}条待处理单据</span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                sign: '0'
            };
        },
        props: ['type', 'missionId','missionPrcdNodeId','num'],
        /*******************
         *
         * type:    节点类型
         * missionId:   工单id
         * missionPrcdNodeId:   工序节点id
         * num: 待处理单据数
         *
         *
         * **********************/
        methods: {
            viewRecord() {
                // 权限
                if(!this.powerJudgement.permissions("fac.mission.report.view")){
                    return
                }
                let type = this.type;
                let missionId = this.missionId;
                let missionPrcdNodeId = this.missionPrcdNodeId;
                this.$router.push({
                    path: "/allReportBill",
                    query: {
                        type,
                        missionId,
                        missionPrcdNodeId,
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .view-bill-wrap{
        margin-bottom: 20px;
        .btn {
            color: #808080;
            font-size: 14px;
        }
        .tip{
            text-indent: 10px;
            font-size: 13px;
            color: #f03535;
            display: inline-block;
        }
    }

</style>
