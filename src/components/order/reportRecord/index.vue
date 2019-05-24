<template>
    <section class="record" v-loading="loading">
        <div class="record__header">
            <page-title :title="title">
                <nf-button @click="$router.go(-1)">返回上级</nf-button>
            </page-title>
            <mission-info :missionInfo="missionInfo" style="border: none"></mission-info>
        </div>
        <div class="record__content">
            <base-box>
                <p class="record--empty" v-show="recordData.reports && !recordData.reports.length">暂无记录</p>
                <!-- 到料start -->
                <div v-if="type === 'material'">
                    <record-wrap
                        v-for="item in recordData.reports"
                        :key="item.logId"
                        :logItem="item"
                        @on-cancel="handleDeleteReport">
                        <div class="record__footer">
                            <span>完成人员：{{ item.chargerName }}</span>
                            <span class="record__time">完成日期：{{ item.dateCreated }}</span>
                            <span class="record__user record--cancel" v-if="item.status">撤销人：{{ item.undoerName }}</span>
                        </div>
                        <div slot="table">
                            <material-report-table :materialData="item"></material-report-table>
                        </div>
                    </record-wrap>
                </div>
                <!-- 到料end -->

                <!-- 自由送料型start -->
                <div v-if="type === 'freedom_material'">
                    <record-wrap
                            v-for="item in recordData.reports"
                            :key="item.logId"
                            :logItem="item"
                            @on-cancel="handleDeleteReport">
                        <div slot="table" class="mgt15">
                            <material-free-report-table :materialData="item"></material-free-report-table>
                        </div>
                    </record-wrap>
                </div>
                <!-- 自由送料型end -->

                <!-- 质检型start -->
                <div v-if="type === 'quality_checking'">
                    <record-wrap
                        v-for="item in recordData.reports"
                        :key="item.logId"
                        :logItem="item"
                        @on-cancel="handleDeleteReport">
                        <div class="record__footer">
                            <span>完成人员：{{ item.chargerName }}</span>
                            <span v-if="item.storehouseName" class="record__time">入库仓库：{{item.storehouseName}}</span>
                            <span class="record__time">完成日期：{{ item.dateCompleted }}</span>
                            <span class="record__user record--cancel" v-if="item.status">撤销人：{{ item.undoerName }}</span>
                            <div v-if="!recordData.associateLigation">
                                <!--合格品-->
                                <nf-sku-table
                                        v-if="item.operationType==0"
                                        style="margin-top: 16px;"
                                        :metadatas="recordData.metadatas"
                                        :quantities="item.qualifieds"
                                        show-num>
                                </nf-sku-table>

                                <!--次品-->
                                <div style="display: flex;">
                                    <defective-table :defectiveItem="item" :styleNo="missionInfo.styleNo"></defective-table>
                                </div>

                                <!--废品-->
                                <div style="display: flex;">
                                    <waste-table :wasteItem="item" :styleNo="missionInfo.styleNo"></waste-table>
                                </div>

                            </div>

                        </div>
                        <div slot="table">
                            <check-report-table :nodeAllData="recordData" :checkData="item"></check-report-table>
                        </div>
                    </record-wrap>
                </div>
                <!-- 质检型end -->
                <!-- 数量明细、尾部出入库、裁床start -->
                <div v-if="hadSkuTable">
                    <record-wrap
                        v-for="item in recordData.reports"
                        :key="item.logId"
                        :logItem="item"
                        @on-cancel="handleDeleteReport">
                        <p class="mg-top16" v-if="type === 'actual_cutting'">床次：{{ item.lathe }}</p>
                        <p class="mg-top16" v-else-if="type === 'actual_cutting_wym'">床次：{{ item.lathe }}</p>
                        <p class="mg-top16" v-else-if="type === 'tail_in_store'">入库仓库：{{ item.storehouseName }}</p>
                        <p class="mg-top16" v-else-if="type === 'quantitative'"></p>
                        <p class="mg-top16" v-else-if="type === 'tail_out_store'">出库仓库：{{ item.storehouseName }}</p>
                        <!-- ="type === 'tail_out_store'" -->
                        <num-node-record
                            :logItem="item"
                            :tableData="tableData"
                            :metadatas="instanceWorkflow.metadatas"
                            :quantities="item.skus"></num-node-record>
                        <div class="record__footer">
                            <span>完成人员：{{ item.chargerName }}</span>
                            <span class="record__time">完成日期：{{ item.dateCompleted }}</span>
                            <span class="record__user record--cancel" v-if="item.status">撤销人：{{ item.undoerName }}</span>

                        </div>
                        <!--数量明细型，出/入库型关联扎号-->
                        <template v-if="type === 'quantitative' || type === 'tail_in_store' || type === 'tail_out_store'">
                            <div slot="table">
                                <ligation-report-table :nodeAllData="recordData" :ligationData="item"></ligation-report-table>
                            </div>
                        </template>
                    </record-wrap>
                </div>
                <!-- 数量明细、尾部出入库、裁床end -->
                <!-- 总数型start -->
                <div v-if="type === 'total'">
                    <record-wrap
                        v-for="totalItem in recordData.reports"
                        :key="totalItem.logId"
                        :logItem="totalItem"
                        @on-cancel="handleDeleteReport">
                        <div slot="table">
                            <ligation-report-table :nodeAllData="recordData" :ligationData="totalItem"></ligation-report-table>
                        </div>
                    </record-wrap>
                </div>
                <!-- 总数型end -->
                <!-- 裁床扎号--start -->
                <div v-if="type === 'actual_cutting_ligation'">
                    <record-wrap
                        v-for="item in recordData.reports"
                        :key="item.logId"
                        :logItem="item"
                        @on-cancel="handleDeleteReport">
                        <ligation-node-record
                            :logItem="item"
                            :tableData="tableData"
                            :metadatas="instanceWorkflow.metadatas"
                            :quantities="item.skus"></ligation-node-record>
                    </record-wrap>
                </div>

                <!-- 裁床扎号--end -->
                <div v-if="type === 'actual_cutting_ligation_correlation'">
                    <record-wrap
                        v-for="ligationItem in recordData.reports"
                        :key="ligationItem.logId"
                        :logItem="ligationItem"
                        :showArrow="false"
                        @on-cancel="handleDeleteReport">
                    </record-wrap>
                </div>
                <!-- 唯一码开始 -->
                <!-- <div v-if="type === 'actual_cutting_wym'">
                    <record-wrap
                        v-for="totalItem in recordData.reports"
                        :key="totalItem.logId"
                        :logItem="totalItem"
                        :showArrow="false"
                        @on-cancel="handleDeleteReport">
                    </record-wrap>
                </div> -->
                <!-- 唯一码结束 -->
            </base-box>
        </div>
    </section>
</template>
<script>
    import defectiveTable from '@/components/order/reportRecord/defectiveTable'
    import wasteTable from '@/components/order/reportRecord/wasteTable'
    import missionInfo from '../common/mission-info'
    import NumNodeRecord from './num-node-record'
    import LigationNodeRecord from './ligation-node-record'
    import RecordWrap from './record-wrap'
    import MaterialNodeRecord from './material-node-record'
    import mixin from '../orderDetail/mixin'
    import materialReportTable from './material-report-table'
    import ligationReportTable from './ligation-report-table'
    import checkReportTable from './check-report-table'
    import materialFreeReportTable from "@/components/order/orderDetail/node-detail/material-free-report-table";
    import { getReportRecord, deleteReport, deleteMateriel, undoLigationNodeReport } from '@/api'
    export default {
        data() {
            return {
                tableData: {},
                skuVal: {},
                instanceWorkflow: {},
                defectiveList: [],
                wastedList: [],
                missionInfo: {},
                recordData: {},
                loading: false,
                isAssociateLigation: false
            };
        },
        mixins: [mixin],
        components: {
            wasteTable,
            defectiveTable,
            missionInfo,
            RecordWrap,
            NumNodeRecord,
            MaterialNodeRecord,
            LigationNodeRecord,
            materialReportTable,
            ligationReportTable,
            checkReportTable,
            materialFreeReportTable,
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            missionId() {
                return this.$route.query.missionId;
            },
            instanceWorkflowId() {
                return this.$route.query.instanceWorkflowId;
            },
            type() {
                return this.$route.query.type
            },
            title() {
                return (this.recordData.nodeName || '节点') + '-上报记录';
            },
            hadSkuTable() {
                return (this.type === 'actual_cutting'
                        || this.type === 'quantitative'
                        || this.type === 'tail_in_store'
                        || this.type === 'tail_out_store'
                        || this.type === 'actual_cutting_wym'
                        )
            }
        },
        created() {
            // this.fetchMissionInfo();
            this.fetchRecord();
        },
        methods: {
            fetchRecord() {
                const params = {
                    instanceId: this.instanceWorkflowId,
                    type: this.type
                };
                this.loading = true;
                getReportRecord(params)
                .then(res => {
                    this.isAssociateLigation = res.data.associateLigation;
                    this.missionInfo = res.data.mission;
                    this.instanceWorkflow = res.data;
                    if (res.data.metadatas) {
                        const data = this.regroupTaleData(res.data.metadatas);
                        this.tableData = data;
                        res.data.reports = this.mapRecordDataReports(res.data.reports);
                    }
                    console.log(JSON.stringify(res.data));
                    this.recordData = res.data;
                    this.loading = false;
                });
            },
            mapRecordDataReports(reports) {
                return reports.map(item => {
                    if (this.type === 'quality_checking') {
                        item.qualifieds = item.qualifieds.map(qualified => {
                            qualified.num = qualified.quantity;
                            return qualified;
                        });
                    }
                    else {
                        if (item.skus) {
                            item.skus = item.skus.map(qualified => {
                                qualified.num = qualified.quantity;
                                return qualified;
                            });
                        }
                    }
                    return item;
                });
                // return reports.map(item => {
                //     if (this.type === 'quality_checking') {
                //         item.skuVal = this.getSkuVal(this.skuVal, item.qualifieds);
                //     }
                //     else {
                //         if (item.skus) {
                //             item.skuVal = this.getSkuVal(this.skuVal, item.skus);
                //         }
                //     }
                //     return item;
                // });
            },
            // 撤销上报
            handleDeleteReport(logItem) {
                this.$confirm('是否撤销该条上报记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // if(this.type === 'actual_cutting_ligation_correlation') {
                    //     undoLigationNodeReport({ userId: this.userId, logId: logItem.logId })
                    //     .then(res => {
                    //         this.fetchRecord();
                    //         this.$message.success('撤销成功!');
                    //     });
                    //     return;
                    // }
                    if(logItem.operationType!==5) {
                        deleteReport({ logId: logItem.logId, userId: this.userId })
                        .then(res => {
                            if (res.data.code === 0) {
                                this.fetchRecord();
                                this.$message.success('撤销成功!');
                                return;
                            }
                            if (res.data.code === 1){
                                this.$message.error(res.data.msg);
                                return
                            }
                            this.$message.error('该次上报的扎号在其他节点已上报');
                        });
                    }
                    else {
                        deleteMateriel({ userId: this.userId, logId: logItem.logId }).then(res => {
                            this.fetchRecord();
                            this.$message.success('撤销成功!');
                        })
                    }

                }).catch(() => {
                });
            },
            // getSkuVal(skuVal = {}, quantities = []) {
            //     skuVal = JSON.parse(JSON.stringify(skuVal));
            //     Object.keys(skuVal).map(key => {
            //         const detailItem = quantities.find(item => item['skuId'] === skuVal[key]['skuId']);
            //         if (detailItem) {
            //             skuVal[key]['finishNum'] = detailItem.quantity;
            //         }
            //     });
            //     return skuVal;
            // }
        }
    }
</script>

<style lang="scss" scoped>
    $color-desc: #a2abb8;
    .record {
        .mg-top16 {
            margin-top: 16px;
        }
        &__content {
            margin-top: 16px;
        }
        &--empty {
            text-align: center;
            font-size: 16px;
            color: $color-desc
        }
        &-item {
            font-size: 14px;
        }
        &__footer {
            color: #808080;
            margin-top: 16px;
        }
        &__time,
        &--cancel {
            margin-left: 32px;
        }
        &--cancel {
            color: #fa4150;
        }
    }
</style>
