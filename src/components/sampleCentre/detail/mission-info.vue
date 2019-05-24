<template>
    <content-wrap
        class="order-info"
        :title="`工单信息：${orderData.orderNo}`"
        type="big">
        <div class="order-info-cancel" v-if="orderData.cancel==1"></div>
        <div v-if="orderData.cancel==1">
            <img src="../../../../static/images/pic-cancel.png" class="undone">
        </div>
        <div class="order-info-title" slot="headRight">
            <div class="order-info-status order-status">
                <span class="order-status-finish null-color" v-if="!orderData.status">未填写</span>
                <span v-if="orderData.status">
                    <span class="order-status-ongoing"
                            v-if="orderData.status > 0">交货倒计时 {{ orderData.status }} 天</span>
                    <span class="order-status-finish" v-if="orderData.status == '已完成'">{{ orderData.status }}</span>
                    <span class="order-status-delay"
                        v-if="orderData.status < 0">延误 {{ Math.abs(orderData.status) }} 天</span>
                </span>
            </div>
        </div>
        <div class="order-info__content">
            <el-row type="flex">
                <img class="good-img" :src="orderData.goodsPictureUrl" v-errorLogo alt="">
                <div class="info-detail">
                    <div class="info-detail-row">
                        <div class="info-detail-item">
                            <span class="label">设计款号：</span>
                            <p
                                class="style-no"
                                :class="{'null-color': !orderData.designStyleNo}"
                                @click="viewDesignDetail">
                                {{ orderData.designStyleNo || '未填写' }}
                            </p>
                        </div>
                        <div class="info-detail-item">
                            <span class="label">工单负责人：</span>
                            <p :class="{'null-color': !orderData.leaders}">{{ orderData.leaders | filterLeader}}</p>
                        </div>
                        <div style="font-size:16px;display:flex;justify-content:flex-end;position: absolute;right: 0;" class="info-detail-item">
                            <icon-button :disabled="orderData.status === '已完成'" style="margin-left:6px;cursor:pointer;" @click="showDialog">
                                优先级：{{ priorityText }}
                                <icon style="margin-left:6px;margin-top: -5px;cursor:pointer;" w="16" h="16" type="icon-edit" />
                            </icon-button>
                           <!-- -->
                        </div>
                    </div>
                    <div class="info-detail-row info-detail-row__last-child">
                        <div class="info-detail-item">
                            <span class="label">制单日期：</span>
                            <p :class="{'null-color': !orderData.placeorderAt}">{{ orderData.placeorderAt || '未填写' }}</p>
                        </div>

                        <div class="info-detail-item">
                            <span class="label">预期完成日期：</span>
                            <p :class="{'null-color': !orderData.deliveryAt}">{{ orderData.deliveryAt || '未填写' }}</p>
                        </div>
                    </div>
                    <div class="info-detail-row info-detail-row__last-child">
                        <el-row type="flex">
                            <span style="width: 100px;text-align: right" class="label">备注信息：</span>
                            <p style="flex: 1" :style="{'color': orderData.remark ? 'red' : '#c4c6cc'}">{{orderData.remark || '未填写'}}</p>
                        </el-row>
                    </div>               
                </div>
            </el-row>
            <nf-button class="btn--edit" :disabled="orderData.status === '已完成'" svg="icon-edit1" @click="goEdit">编辑工单</nf-button>
        </div>
        <el-dialog
        :visible.sync="visible.priorityVisible"
        :show-close="false"
        size="tiny">
            <div style="text-align:center;font-size:20px;" slot="title">修改优先级</div>
            <div class="select-priority">
                优先级：
                <el-select v-model="priorityId">
                    <el-option v-for="item in priorityOptions" :key="item.value" :value="item.value" :label="item.label">
                    </el-option>
                </el-select>
            </div>
            <div align="center" slot="footer">
                <nf-button  @click="visible.priorityVisible = false">取消
                </nf-button> 
                <nf-button type="warning" @click="submit">确定
                </nf-button>                               
            </div>
        </el-dialog>     
    </content-wrap>
</template>

<script>
import { updateDesignMissionPriority } from '@/api/sample-centre';

export default {
    props: {
        orderData: {}
    },
    data() {
        return {
            visible: {
                priorityVisible: false
            },
            priorityId: '',
            priorityOptions:[
                {
                    value: 0,
                    label: '普通'
                },
                {
                    value: 1,
                    label: '加急'
                }
            ]
        }
    },
    computed: {
        priorityText(){
            const priority = this.orderData.priority;
            switch(priority) {
                case 0: return '普通';
                case 1: return '加急';
            }
      }
    },
    methods: {
        viewDesignDetail() {
            this.$router.push({
                path: '/designFile/designFileDetail',
                query: {
                    designStyleId: this.orderData.designStyleId
                }
            });
        },
        goEdit() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.update")){
                return
            }
            this.$store.dispatch('deleteVisitedLive', 'SampleMissionEdit');
            this.$nextTick(() => {
                this.$router.push({
                    path: '/sample/edit',
                    query: {
                        missionId: this.orderData.id
                    }
                });
            })
        },
        showDialog() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.priority")){
                return
            }
            this.priorityId = this.orderData.priority;
            this.visible.priorityVisible = true;
        },
        submit() {
            let params = {
                priority: this.priorityId,
                missionId: this.$route.query.missionId            
            };
            updateDesignMissionPriority(params)
            .then(res=> {
                if (res.data.code==0) {
                    this.$message.success('修改成功');
                    this.$emit('on-update');
                    this.visible.priorityVisible = false;
                }
                else{
                    this.$message.success(res.data.msg);                    
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>
    .order-info {
        padding: 24px 32px 14px;
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
        position: relative;
        &-title,
        &-status {
            display: inline-block;
        }
        &-title {
            vertical-align: bottom;
            font-size: 20px;
        }
        &-status {
            margin-left: 32px;
            font-size: 20px;
        }
        &__content {
            position: relative;
            .good-img {
                width: 80px;
                height: 80px;
            }
            .info-detail {
                flex: 1;
            }
            .info-detail-row {
                display: flex;
            }
            .info-detail-row__last-child {
                margin-top: 18px;
            }
            .info-detail-item {
                width: 30%;
                p {
                    display: inline-block;
                    color: #3b3b3b;
                }
                .style-no {
                    cursor: pointer;
                    color: #1CA1FF;
                    text-decoration: underline
                }
                .null-color {
                    color: #c4c6cc;
                }
                .label {
                    display: inline-block;
                    width: 100px;
                    text-align: right;
                    font-size: 14px;
                }
            }
            .btn--edit {
                position: absolute;
                bottom: 0;
                right: 0
            }
        }
        .order-info-cancel {
            z-index: 10;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #fff;
            opacity: 0.6;
        }
        .undone {
            box-sizing: border-box;
            position: absolute;
            right: 4%;
            top: 10%;
            z-index: 11;
            text-align: center;
            line-height: 40px;
            display: inline;
            border-radius: 2px;
            font-family: MicrosoftYaHei;
            font-size: 20px;
            color: #a0acbd;
        }
        .order-status-ongoing {
            color: #ff8138;
        }
        .order-status-finish {
            color: #37bd0e;
        }
        .order-status-delay {
            color: #f03535;
        }
        .select-priority {
            display:flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>

