<template>
<div class="node-info" :class="{ 'is-cancel': isCancel }">
    <content-wrap
        class="node-info__wrap"
        title="节点进度"
        type="big">
        <!-- 右上角三个状态 -->
        <div class="node-status" slot="headRight">
            <div class="node-status-item">
                <icon type="icon-gongdan-jiedianyiwancheng-da" w="14" h="14"></icon>
                已完成: {{nodeData.completed }}
            </div>
            <div class="node-status-item">
                <icon type="icon-gongdan-jiedianjinxingzhong-da" w="14" h="14"></icon>

                进行中: {{nodeData.processing }}
            </div>
            <div class="node-status-item">
                <icon type="icon-gongdan-jiedianweikaishi-da" w="14" h="14"></icon>
                未开始: {{nodeData.initial }}
            </div>
        </div>
        <el-row class="node-line">
            <el-col :span="24" class="node-line-info">
                <div class="steps" v-for="(k, index) in nodeList" :key="index">
                    <!--左边线-->
                    <!-- <div
                        class="step-line step-line-left"
                        :class="{'active-line-left': currentNodeInstanceId == k.id}"
                        v-show="(index != 0)">
                    </div> -->
                    <div class="step-item" style="cursor: pointer"
                            :class="{'active':currentNodeInstanceId == k.id}"
                            @click="toggleDisplay(k)">
                        <span style="position: relative;">
                             <div class="head-text">
                                <span v-if="k.notifys.length" :class="{
                                'difference-text': k.notifyTypes.indexOf('2') > -1,
                                'delay-text': (k.delay < 0 || k.alerted) && k.status !== 2,
                                'remain-text': k.notifyTypes.indexOf('0') > -1}">{{getText(k)}}</span>
                            </div>
                            <!--<icon-->
                                <!--v-if="(k.delay<0 && k.status!='2') || k.alerted"-->
                                <!--type="icon-gongdan_jiedianjingbao-xiao"-->
                                <!--style="vertical-align:-3px;width: 10px;height: 10px;position: absolute;top: -3px;left: 10px;"-->
                                <!--:class="{'active-alert':currentNodeInstanceId==k.id}"-->
                            <!--&gt;</icon>-->
                            <icon
                                v-if="k.status=='2'"
                                type="icon-gongdan-jiedianyiwancheng-da"
                                :class="{'active-icon': currentNodeInstanceId == k.id}"
                            ></icon>
                            <icon
                                v-if="k.status=='0'"
                                type="icon-gongdan-jiedianweikaishi-da"
                                :class="{'active-icon':currentNodeInstanceId == k.id}"
                            ></icon>
                            <icon
                                v-if="k.status=='1'"
                                type="icon-gongdan-jiedianjinxingzhong-da"
                                :class="{'active-icon':currentNodeInstanceId==k.id}"
                            ></icon>
                        </span>
                        <div class="steps-desc" :class="{'fz14':currentNodeInstanceId==k.id}">
                            {{k.name}}
                        </div>
                    </div>

                    <!--右边线-->
                    <div
                        class="step-line step-line-right"
                        :class="{'active-line-right':currentNodeInstanceId==k.id}"
                        v-show="(index!=nodeList.length-1)">
                    </div>
                </div>
            </el-col>
        </el-row>
    </content-wrap>
    <el-row v-loading="loading">
        <!-- <router-view
        @refreshMissionNodeInfoList="fetchFacMissionNodeInfoList"
        :nodeList="nodeList"
        :key="routerKey"
        ></router-view> -->
        <component
            :is="componentId"
            @refreshMissionNodeInfoList="fetchFacMissionNodeInfoList"
            v-bind="propData">
        </component>
        <!-- <node-list
        :nodeList="nodeList"
        v-show="!visible.showDetail"
        :visible.sync="visible.showDetail"></node-list> -->
        <!-- <slot name="nodeList"></slot> -->
        <!-- <node-detail :visible.sync="visible.showDetail"></node-detail> -->
    </el-row>

</div>
</template>

<script>
    import NodeList from './nodeList'
    import NodeDetail from './node-detail'
    import { getFacMissionNodeInfoListById,missionNodeInfo } from '@/api'
    export default {

        props: {
            isCancel: Boolean
        },
        data() {
            return {
                componentName: 'nodeProcess',
                nodeStatus: {},
                nodeList: [],
                nodeData:{},
                loading: false,
                firstLoading: false,
                visible: {
                    showDetail: false
                }
            }
        },
        components: {
            NodeList,
            NodeDetail
        },
        computed: {
            componentId() {
                return this.currentNodeInstanceId ? 'NodeDetail' : 'NodeList'
            },
            propData() {
                return this.currentNodeInstanceId ? '' : { nodeList: this.nodeList };
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            missionId() {
                return this.$route.query['missionId']
            },
            routerKey() {
                return this.$route.name ? this.$route.name + +new Date() : this.$route + +new Date();
            },
            currentNodeInstanceId() {
                return this.$route.query.instanceWorkflowId;
            }
        },
        created() {
            this.fetchFacMissionNodeInfoList();
        },
         //利用这个钩子函数是因为当前的router用了keep-alive
        activated() {
            this.fetchFacMissionNodeInfoList();
        },
        methods: {
            // 提示语显示
            getText(k) {
                const { delay, alerted, notifys, notifyTypes } = k
                if ((delay < 0 || alerted) && status !== 2) {
                    return `延误${notifys[0].notifyNum}天`;
                }
                console.log(notifyTypes.indexOf('2'))
                if (notifyTypes.indexOf('2') > -1) {
                    return `差额${notifys[0].notifyNum}件`;
                }
                if (notifyTypes.indexOf('0') > -1) {
                    return `还剩${notifys[0].notifyNum}天`
                }
                return null;
            },
            fetchFacMissionNodeInfoList() {

                if (!this.firstLoading) {
                    this.loading = true;
                    this.firstLoading = true;
                }
                missionNodeInfo({
                    missionId: this.missionId
                })
                .then(res => {
                    this.getNodeList(res);
                    this.loading = false;
                })
            },
            getNodeList(res) {
                for (let item of res.data.nodes) {
                    item.leader = [];
                    for(let leaders of  item.chargers) {
                        item.leader.push(leaders.name);
                    }
                }
                this.nodeList = res.data.nodes;
                this.nodeData = res.data;
            },
            viewDetail(item) {
                const path = '/OrderDetailed/detail'+ `?missionId=${this.$route.query.missionId}` + `&instanceWorkflowId=${item.instanceWorkflowId}`;
                this.$router.replace(path);
                this.$emit('update:visible', true);
            },
            toggleDisplay(item) {
                // this.currentNodeInstanceId = item.instanceWorkflowId;
                // const path = '/OrderDetailed/detail'+ `?missionId=${this.$route.query.missionId}` + `&instanceWorkflowId=${item.id}`;
                this.$router.push({
                   path: '/OrderDetailed',
                   query: {
                       missionId: this.$route.query.missionId,
                       instanceWorkflowId: item.id
                   }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .node-info {
        .head-text{
            margin-bottom:5px;
            text-align: center;
            height: 15px;
            span{
                padding:1px 5px;
                border-radius: 9px;
                color:#fff;
                font-size:12px;
            }
        }
        .difference-text{
            background-color: #5C67E6;
        }
        .delay-text{
            background-color: #FA4150;
        }
        .remain-text{
            background-color: #FF7F14;
        }
        position: relative;
        width: 100%;
        background: #fff;
        &.is-cancel::after {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            content: '';
            display: block;
            background: rgba(255, 255, 255, .8);
        }
        .order-content-cancel {
            width: 100%;
            height: 100%;
            background-color: #fff;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0.6;
            z-index: 10;
        }
        // padding: 32px;
        &__wrap {
            padding: 32px;
            padding-bottom: 0;
        }
        .node-status {
            &-item {
                display: inline-block;
                margin-left: 24px;
                font-size: 12px;
            }
        }

        /*进度*/
        .node-line-info {
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            padding-bottom: 32px;
            border: 1px solid #e6eefa;
            margin-bottom: 16px;
            background-color: #fafcff;

            .steps {
                width: 90px;
                position: relative;
                display: inline-block;
                text-align: center;
                // width: 90px;

                .step-item {
                    margin-top: 24px;
                    // padding-left: 40px;
                    position: relative;
                    z-index: 9;
                }

                .active {
                    //当前查看的节点
                    color: #ff9c38;
                    position: relative;
                    margin-top: 18px;

                    .active-icon {
                        width: 22px !important;
                        height: 22px !important;
                        position: relative;
                        left: -3px;
                        top: 2px;
                    }

                    .active-alert {
                        //警报icon
                        width: 14px !important;
                        height: 14px !important;
                        top: -4px !important;
                        left: 10px !important;
                        z-index: 2;
                    }
                }

                .active-line-left,
                .active-line-right {
                    top: 50px !important;
                }
                .steps-desc {
                    text-align: center;
                    margin-top: 8px;
                    font-size: 12px;
                }
                .fz14 {
                    //当前节点字体大小
                    font-size: 14px;

                }
                .step-line {
                    margin-left: 2px;
                    margin-right: 2px;
                    position: absolute;
                    top: 50px;
                    height: 2px;
                    background: #f5f5f5;
                }
                .step-line-left {
                    // left: 50%;
                }
                .step-line-right {
                    left: 50%;
                    right: -50%;
                }
            }
        }
    }
</style>

