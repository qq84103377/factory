<template>
    <el-col :span="24" class="node-box">
        <el-col :span="24" class="node-list" v-for="(nodeItem, index) in orderData.nodes" :key="index" @click.native="viewDetail(nodeItem)">
            <el-col :span="24" class="node-list-detailed">
                <el-col :span="6">
                    <el-col :span="8" class="node-icon">
                        <span style="position: relative;">
                            <icon
                               v-show="isAlert(nodeItem) || isWarning(nodeItem)"
                                :type="isAlert(nodeItem) ? 'icon-gongdan_jiedianjingbao-xiao' : 'icon-early-warning'"
                                style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -20px;left: 20px;"></icon>
                            <icon :type="icon(nodeItem)" style="vertical-align:-3px;width: 32px;height: 32px;"/>          
                        </span>
                    </el-col>
                    <el-col :span="16">
                        <span class="fs-16">{{nodeItem.name}}</span>
                        <p class="desc-color" style="line-height: 20px;">
                            <span
                                v-for="(items, index) in nodeItem.chargers"
                                :key="index"
                                class="user-item"
                                :class="!nodeItem.chargers.length ? 'null-color' : ''">
                                    {{ items.name }}
                                </span>
                            {{ !nodeItem.chargers.length ? '未设置负责人' : ''}}
                        </p>
                    </el-col>
                </el-col>
                <el-col :span="7">
                    <div>
                         <span class="fs-16"
                            :class="[
                                isFinish(nodeItem) ? 'green' : '',
                                isDelay(nodeItem) ? 'red' : '',
                                isOngoing(nodeItem) || nodeItem.status == '1' && nodeItem.dateEnd ? 'blue' : '',
                            ]">{{ renderStatusText(nodeItem) }}</span>
                        <!-- <span v-if="k.typeId!=2"> {{k.finishNum}}/{{k.targetNum}}</span> -->
                        <p class="desc-color" style="line-height: 20px;">结束时间: {{nodeItem.dateEnd || '未设置' | filterEndTime}}</p>
                    </div>
                </el-col>
                <el-col :span="9" style="line-height: 18px;font-size: 12px;color: #A2ABB8;" v-if="nodeItem.message">
                    <p style="font-size: 14px;">{{nodeItem.message.content}}</p>
                    <p>
                        {{nodeItem.message.timestamp}}
                    </p>
                </el-col>
                <el-col :span="2" v-if="nodeItem.message" style="display: flex; justify-content: center;align-items: center;font-size: 16px;color: #cfd8e6;">
                    <i class="el-icon-arrow-right" style="cursor: pointer"></i>
                </el-col>
                <!--没有消息时偏移-->
                <el-col :span="2" :offset="9" v-if="!nodeItem.message" style="display: flex; justify-content: center;align-items: center;font-size: 16px;color: #cfd8e6;">
                    <i v-if="!isCancel" class="el-icon-arrow-right" style="cursor: pointer"></i>
                </el-col>
            </el-col>
        </el-col>
    </el-col>
</template>

<script>
export default {
    props: {
        orderData: Object
    },
    filters: {
        filterEndTime(val) {
            return val.slice(0, 11);
        }
    },
    computed: {
        isCancel() {
            return this.orderData['cancel'] === 1;
        },
    },
    mounted() {
    },
    methods: {
        isAlert(item) {
            return item.notifyTypes && item.notifyTypes.indexOf('1') > -1;
        },
        isWarning(item) {
            return item.notifyTypes && item.notifyTypes.indexOf('0') > -1;
        },
        icon(item) {
            const status = item.status;
            switch(status) {
                case 0: return 'icon-gongdan-jiedianweikaishi-da';
                case 1: return 'icon-gongdan-jiedianjinxingzhong-da';
                case 2: return 'icon-gongdan-jiedianyiwancheng-da';
            }
        },
        viewDetail(item) {
            this.$router.push({
                path: '/sample/detail',
                query: {
                    missionId: this.$route.query.missionId,
                    instanceWorkflowId: item.id
                }
            });
        },
        isFinish(k) {
            return k.status == 2
        },
        // 延误
        isDelay(k) {
            return k.delay < 0 && k.status != 2 && k.dateEnd;
        },
        // 进行中
        isOngoing(k) {
            return k.status == 1 && !k.dateEnd;
        },
        // 还剩
        isRemain(k) {
            return (k.delay > 0 && k.dateEnd && k.status != 2) && ( k.status == 0 || k.status == 1);
        },
        isWaitStart(k) {
            return (k.status == 0) && !k.dateEnd;
        },
        renderStatusText(k) {
            if (this.isFinish(k)) {
                return '已完成'
            }
            else if(this.isDelay(k)) {
                return `延误 ${Math.abs(k.delay)} 天`;
            }
            else if(this.isOngoing(k)) {
                return '进行中';
            }
            else if(this.isRemain(k)) {
                return `还剩 ${k.delay} 天`;
            }
            else if(this.isWaitStart(k)) {
                return '未开始';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.green {
    color: #37bd0e;
}

.red {
    color: #f03535;
}

.blue {
    color: #1f96ff;
}

.fs-16 {
    font-size: 16px;
}

.desc-color {
    color: rgb(162, 171, 184);
}
/*节点详细信息*/
.node-box {
    //节点列表
    background: #fff;
    .node-list {
        border-top: 1px solid #e6e8eb;
        height: 90px;
        padding: 29px 0px 29px 32px;
        text-align: left;
        cursor: pointer;
    }
    .node-date {
        text-align: right;
        color: #a2abb8;
        margin-right: 22px;
    }
    .node-type3 {
        line-height: 56px;
        box-sizing: border-box;
    }
    .user-item:not(:last-child)::after {
        content: '、'
    }
}
</style>

