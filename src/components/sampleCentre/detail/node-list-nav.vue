<template>
    <section class="node-info">
        <content-wrap
            class="node-info__wrap"
            title="节点进度"
            type="big">
            <!-- 右上角三个状态 -->
            <div class="node-status" slot="headRight">
                <div class="node-status-item" v-for="(item, index) of statusConf" :key="index">
                    <icon :type="item.icon" w="14" h="14"></icon>
                    {{ item.label }}: {{ orderData[item.prop] }}
                </div>
            </div>
            <el-row class="node-line">
                <el-col :span="24" class="node-line-info">
                    <div class="steps" v-for="(nodeItem, index) in nodeList" :key="index">
                        <div class="step-item"
                            style="cursor: pointer"
                            :class="{'active': itemActive(nodeItem)}"
                            @click="viewNodeDetail(nodeItem)">
                            <span style="position: relative;">
                                <icon 
                                    v-show="isAlert(nodeItem) || isWarning(nodeItem)"
                                    :type="isAlert(nodeItem) ? 'icon-gongdan_jiedianjingbao-xiao' : 'icon-early-warning'"
                                    style="vertical-align:-3px;width: 10px;height: 10px;position: absolute;top: -3px;left: 10px;"
                                    :class="{'active-alert': itemActive(nodeItem)}" />
                                <icon
                                    :type="icon(nodeItem)"
                                    :class="{'active-icon': itemActive(nodeItem)}" />
                            </span>
                            <div class="steps-desc" :class="{'fz14': itemActive(nodeItem)}">
                                {{nodeItem.name}}
                            </div>
                        </div>
                        <!--右边线-->
                        <div 
                            class="step-line step-line-right"
                            :class="{'active-line-right': itemActive(nodeItem)}"
                            v-show="(index!=nodeList.length-1)">
                        </div>
                    </div>
                </el-col>
            </el-row>
        </content-wrap>
    </section>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        props: {
            orderData: Object
        },
        data() {
            return {
                statusConf: [
                    {
                        label: '已完成',
                        icon: 'icon-gongdan-jiedianyiwancheng-da',
                        prop: 'completed'
                    },
                    {
                        label: '进行中',
                        icon: 'icon-gongdan-jiedianjinxingzhong-da',
                        prop: 'processing'
                    },
                    {
                        label: '未开始',
                        icon: 'icon-gongdan-jiedianweikaishi-da',
                        prop: 'initial'
                    }
                ]
            };
        },
        computed: {
            nodeList() {
                return  this.orderData && this.orderData.nodes
            },
            currentNodeInstanceId() {
                return this.$route.query.instanceWorkflowId;
            }
        },
        methods: {
            icon(item) {
                const status = item.status;
                switch(status) {
                    case 0: return 'icon-gongdan-jiedianweikaishi-da';
                    case 1: return 'icon-gongdan-jiedianjinxingzhong-da';
                    case 2: return 'icon-gongdan-jiedianyiwancheng-da';
                }
            },
            itemActive(item) {
                return this.currentNodeInstanceId === item.id;
            },
            isAlert(item) {
                return item.notifyTypes && item.notifyTypes.indexOf('1') > -1;
            },
            isWarning(item) {
                return item.notifyTypes && item.notifyTypes.indexOf('0') > -1;
            },
            viewNodeDetail(item) {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.mission.node.detail")){
                    return
                }
                this.$router.push({
                   path: '/sample/detail',
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
    position: relative;
    width: 100%;
    margin-top: 12px;
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
                top: 32px !important;
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
                top: 32px;
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

