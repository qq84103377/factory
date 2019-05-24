<template>
    <div class="scroll-content" v-loading="showLoading">
        <page-title title="工单节点动态">
            <nf-button fsize="12" @click="$router.go(-1)">返回上级</nf-button>
        </page-title>
        <el-select
                style="width: 250px;margin-bottom: 8px;"
                v-model="selectNodeId" placeholder="请选择"
                @change="handleChange">
            <el-option
                    v-for="item in options.nodeOptions"
                    :key="item.instanceWorkflowId"
                    :label="item.name"
                    :value="item.instanceWorkflowId">
            </el-option>
        </el-select>
        <div class="main-content">
            <dynamics
                    :showTitle="false"
                    ref="dynamics"
                    v-if="showDynamics"
                    :instanceWorkflow="instanceWorkflow.components"
                    :reportTableData="reportTableData"
                    :personOptions="options.personOptions"
                    :nodeReportTableVal="dynamiceSkuVal"
                    :log="log"></dynamics>
        </div>
        <div class="pdtb16 text-right">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.pageNo"
                           :page-size="page.pageSize"
                           layout="total, prev, pager, next" :total="page.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import dynamics from './dynamics'
    import {instanceMissionNodeInfo, getPersonList, getNodeList, queryFactoryMissionOpLogPage} from '@/api'
    import mixin from './mixin'

    export default {
        data() {
            return {
                options: [{
                    value: '全部节点',
                    label: '全部节点'
                }],
                showDynamics: false,
                showLoading: false,
                selectNodeId: 'ALL',
                instanceWorkflow: {
                    components: {}
                },
                log: {
                    logs: []
                },
                reportTableData: {},
                dynamiceSkuVal: {},
                options: {
                    personOptions: [],
                    nodeOptions: []
                },
                page: {
                    pageSize: 20,
                    pageNo: 1,
                    totalCount: 0
                }
            }
        },
        mixins: [mixin],
        components: {
            dynamics
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            missionId() {
                return this.$route.query['missionId'];
            },
            instanceWorkflowId() {
                return this.$route.query['instanceWorkflowId'];
            }
        },
        created() {
            this.fetchTaskInstanceWorkflow({instanceWorkflowId: this.instanceWorkflowId});
            // this.fetchDynamicList();
            this.fetchPersonList();
            this.fetchNodeList();

            this.selectNodeId = this.instanceWorkflowId;
        },
        methods: {
           // 获取节点动态列表
            fetchDynamicList(instanceWorkflowId) {
                const params = {
                    missionId: this.missionId,
                    pageNo: this.page.pageNo,
                    pageSize: this.page.pageSize,
                }

                if (instanceWorkflowId!== 'ALL') {
                    params.instanceWorkflowId = instanceWorkflowId;
                }
                this.showLoading = true;
                queryFactoryMissionOpLogPage(params)
                    .then(res => {
                        this.showLoading = false
                        this.page.totalCount = res.data.recordCount
                        this.log = {logs: res.data.factoryMissionOpLogList}
                    });
            },
            fetchTaskInstanceWorkflow(params) {
                params.userId = this.userId;
                this.showLoading = true;
                instanceMissionNodeInfo(params)
                    .then(async res => {
                        //获取SKU外壳，让所有的都拿同一个壳，直接在数量型的对象里面拿
                        let log = res.data.components.log;
                        const skuList = res.data.metadatas;
                        if (skuList && res.data.quantities) {
                            this.getReportSkuVal(skuList);
                        }
                        const factoryMissionOpLogList = await this.fetchDynamicList(this.instanceWorkflowId);
                        log = {logs: factoryMissionOpLogList};
                        this.log = log;
                        this.instanceWorkflow = res.data;
                        this.$nextTick(() => {
                            this.showDynamics = true;
                            this.showLoading = false;
                        });
                    });
            },
            // 获取关联人员列表
            fetchPersonList() {
                const params = {
                    unitId: this.facId
                };
                getPersonList(params)
                    .then(res => {
                        this.options['personOptions'] = res.data;
                    });
            },
            fetchNodeList() {
                const params = {
                    facId: this.facId,
                    missionId: this.missionId
                };
                getNodeList(params)
                    .then(res => {
                        res.data.unshift({
                            name: '全部节点',
                            instanceWorkflowId: 'ALL'
                        });
                        this.options['nodeOptions'] = res.data;
                    });
            },
            getReportSkuVal(skuList) {
                let data = this.regroupTaleData(skuList, true);
                const skuVal = JSON.parse(JSON.stringify(data['skuVal']));
                // this.staticSkuVal = this.setReportSkuVal(nodeSKUList, data['skuVal']);
                // this.copySkuVal = JSON.parse(JSON.stringify(this.staticSkuVal));
                // this.reportSkuVal = skuVal;
                this.getDynamiceSkuVal(skuVal);
                this.reportTableData = data;
            },
            // 节点动态sku表的空数据
            getDynamiceSkuVal(skuVal) {
                skuVal = JSON.parse(JSON.stringify(skuVal));
                Object.keys(skuVal).map(key => {
                    skuVal[key].finishNum = '';
                    skuVal[key].num = '';
                });
                this.dynamiceSkuVal = skuVal;
            },
            setReportSkuVal(nodeSKUList, staticSkuVal) {
                if (!nodeSKUList) return;
                Object.keys(staticSkuVal).map(key => {
                    const findItem = nodeSKUList.find(item => item.skuId === staticSkuVal[key]['skuId']);
                    if (findItem) {
                        staticSkuVal[key] = {...findItem}
                    }
                });
                return staticSkuVal
            },
            // 改变节点时
            handleChange(val) {
                this.page.pageNo = 1
                this.fetchDynamicList(val)
            },
            handleCurrentChange(pageNo) {
                this.page.pageNo = pageNo
                this.fetchDynamicList(this.selectNodeId)
            },
        }
    }
</script>

<style lang="scss" scoped>
    .scroll-content {
        height: 100%;
        margin: 0;
    }
</style>
