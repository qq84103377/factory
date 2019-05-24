<template>
    <el-col :span="24" class="node-box">
        <el-col :span="24" class="node-list" v-for="(k, index) in nodeList" :key="index" @click.native="viewDetail(k)">
            <el-col :span="24" class="node-list-detailed">
                <el-col :span="10">
                    <el-col :span="2" class="node-icon">
                        <span style="position: relative;">
                            <icon v-if="(k.delay<0 && k.status!='2') || k.alerted" type="icon-gongdan_jiedianjingbao-xiao" style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -20px;left: 20px;"></icon>
                            <icon v-if="k.notifyTypes.indexOf('2') > -1" type="icon-margin" style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -20px;left: 20px;"></icon>
                            <icon v-if="k.notifyTypes.indexOf('0') > -1" type="icon-early-warning" style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -20px;left: 20px;"></icon>


                            <icon v-if="k.status=='2'" type="icon-gongdan-jiedianyiwancheng-da" style="vertical-align:-3px;width: 32px;height: 32px;"></icon>
                            <icon v-if="k.status=='0'" type="icon-gongdan-jiedianweikaishi-da" style="vertical-align:-3px;width: 32px;height: 32px;"></icon>
                            <icon v-if="k.status=='1'" type="icon-gongdan-jiedianjinxingzhong-da" style="vertical-align:-3px;width: 32px;height: 32px;"></icon>
                        </span>
                    </el-col>
                    <el-col :span="22">
                        <span class="fs-16">{{k.name}}</span>
                        <span :class="{'nodeListNodeTagName':true,'nodeListNodeTagNameFinish':k.status===2}"  v-for="(item,index) in k.prcdNodeTags" :key="index">{{item.tagName}}</span>
                        <p class="desc-color" style="line-height: 20px;">
                            <span v-if="k.leader" v-for="(items,index) in k.leader">{{items}}
                                <span v-if="index!==k.leader.length-1">、</span>
                            </span>
                            <span class="null-color" v-if="!k.leader">未设置负责人</span>
                        </p>
                    </el-col>
                </el-col>
                <el-col :span="3">
                    <div>
                        <!-- <span class="fs-16 node-status-color-finish green" v-if="k.status=='2'">已完成</span>
                        <span class="fs-16 red mg-60" v-if="isDelay(k)">
                            延误 {{Math.abs(k.delay)}} 天
                        </span>
                        <span class="blue fs-16" v-if="isOngoing(k)">进行中</span>
                        <span class="fs-16"
                            :class="[k.status == '1' && k.dateEnd ? 'blue' : '']"
                            v-if="isRemain(k)">还剩 {{k.delay}} 天</span>
                        <span class="fs-16" v-if="isWaitStart(k)">未开始</span> -->
                        <span class="fs-16"
                            :class="[
                                isFinish(k) ? 'green' : '',
                                isDelay(k) ? 'red' : '',
                                isOngoing(k) || k.status == '1' && k.dateEnd ? 'blue' : '',
                            ]">{{ renderStatusText(k) }}</span>
                        <span v-if="k.typeId!=2"> {{k.finishNum}}/{{k.targetNum}}</span>
                        <p class="desc-color" style="line-height: 20px;">结束时间: {{ k.dateEnd || '未设置' | filterEndTime }}</p>
                    </div>
                </el-col>
                <el-col :span="8" style="line-height: 18px;font-size: 12px;color: #A2ABB8;">
                    <p style="font-size: 14px;" v-if="k.message">{{k.message.content}}</p>
                    <p  v-if="k.message">
                        {{k.message.timestamp}}
                    </p>
                </el-col>
                <el-col :span="2" v-if="k.message" style="display: flex; justify-content: center;align-items: center;font-size: 30px;color: #cfd8e6;">
                    <i class="el-icon-arrow-right" style="cursor: pointer"></i>

                </el-col>
                <!--没有消息时偏移-->
                <el-col :span="2" :offset="9" v-if="!k.message" style="display: flex; justify-content: center;align-items: center;font-size: 30px;color: #cfd8e6;">
                    <i v-if="!isCancel" class="el-icon-arrow-right" style="cursor: pointer"></i>
                </el-col>
            </el-col>
        </el-col>
    </el-col>
</template>

<script>
export default {
    props: {
        nodeList: []
    },
    filters: {
        filterEndTime(val) {
            return val.slice(0, 11);
        }
    },
    computed: {
        parent() {
            let result = this.$parent;
            while (!(result.componentName === 'orderDetail')) {
                result = result.$parent;
            }
            return result;
        },
        orderData() {
            return this.parent.orderData
        },
        isCancel() {
            return this.parent.orderData['cancel'] === 1;
        }
    },
    mounted() {
        console.log(this.nodeList);
    },
    methods: {
        viewDetail(item) {
            console.log(item);
            const path = '/OrderDetailed' + `?missionId=${this.$route.query.missionId}` + `&instanceWorkflowId=${item.id}`;
            this.$router.push(path);
            this.$emit('update:visible', true)
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
    .node-list {
        border-top: 1px solid #e6e8eb;
        height: 90px;
        padding: 29px 0px 29px 32px;
        text-align: left;
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
    .nodeListNodeTagName {
        display: inline-block;
        /*width: 100%;*/
        padding: 0 4px;
        height: 26px;
        line-height: 26px;
        color: #fff;
        background: #ff9c38;
        text-align: center;
        margin: 0 6px;
        cursor: pointer;
    }
    .nodeListNodeTagNameFinish{
        background: #666;
    }
}

</style>

