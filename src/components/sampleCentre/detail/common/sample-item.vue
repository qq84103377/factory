<template>
    <li class="sample-item">
        <div class="sample-item__header">
            <div class="sample-item__header--left">
                <img class="sample-item__pic" :src="sampleItem.path" v-errorLogo/>
                <div class="sample-status" v-show="isWaitSubmit || isWaitReview">
                    <span>{{ isWaitReview ? '待我审核' : '待我提交'}}</span>
                </div>
            </div>
            <el-row class="sample-item__content">
                <el-col :span="8">样衣信息：<strong>{{ sampleItem.sampleNo }} - {{ sampleItem.name }}</strong></el-col>
                <el-col :span="8">
                    版师：
                    <span :style="{'color': !sampleItem.designers.length ? '#A2ABB8' : ''}">
                        {{ sampleItem.designers | filterUserList }}
                    </span>
                </el-col>
                <el-col :span="8">状态：
                    <strong
                        class="color-blue"
                        :class="{
                            'color-green': sampleItem.status === 1,
                            'color-red': sampleItem.status === 2
                        }">
                        {{ renderStatusText(sampleItem.status) }}
                    </strong>
                </el-col>
                <el-col :span="8">设计款号：{{ sampleItem.splDesignStyleNo }}</el-col>
                <el-col :span="8">
                    样衣师：
                    <span :style="{'color': !sampleItem.samplers.length ? '#A2ABB8' : ''}">
                        {{ sampleItem.samplers | filterUserList }}
                    </span>
                </el-col>
                <el-col :span="8"><span class="time">创建时间：{{ sampleItem.dataCreated }}</span></el-col>
            </el-row>
            <div class="btn-wrapper">
                <nf-button class="btn btn--blue" :disabled="isDisabled" @click="viewDetail">查看详情</nf-button>
                <!-- 只有样衣评审和终审显示 -->
                <nf-button
                class="btn btn--blue"
                @click="handleEdit"
                :disabled="isDisabled"
                v-if="nodeTypeCode === 'LAST_REVIEW_SAMPLE' || nodeTypeCode === 'REVIEW_SAMPLE'">编辑样衣</nf-button>
                <nf-button
                    class="btn btn--danger"
                    :disabled="isDisabled"
                    @click="showDialog('delete')"
                    v-show="sampleItem.status !== 2">作废样衣</nf-button>
                <nf-button
                    class="btn"
                    :disabled="isDisabled"
                    @click="showDialog('cancel')"
                    v-show="sampleItem.status === 2">撤销作废</nf-button>
            </div>
            <div class="sample-item__arrow" v-if="isArrow" @click="isExpand = !isExpand">
                展开明细<i class="icon-arrow-down el-icon-arrow-down"></i>
            </div>
        </div>
        <div class="sample-item__collapse" v-show="isExpand && isArrow"
            :class="sampleItem.status === 2 ? 'is-cancel' : ''">
            <slot></slot>
        </div>
        <!-- 作废、撤销样衣--dialog -->
        <el-dialog
            custom-class="nf-dialog-common no-dialog-header"
            title="提示"
            size="tiny"
            :show-close="false"
            :visible.sync="dialogVisible">
            <div class="dialog-content">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="delete-tip">是否确定{{ handleType === 'cancel' ? '撤销作废' : '作废' }}当前样衣？</p>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="dialogVisible = false">取 消</nf-button>
                <nf-button
                    class="btn--submit"
                    type="warning"
                    :loading="btnLoading"
                    @click="handleSample">确 定</nf-button>
            </el-row>
        </el-dialog>
    </li>
</template>

<script>
import { cancelDesignNodeSample, deleteDesignNodeSample } from '@/api/sample-centre';
import DispatchMixin from '@/components/stock/mixins';
export default {
    props: {
        missionNodeId: '',
        nodeDetailData: '',
        sampleItem: Object,
        isArrow: Boolean,
        itemIndex:''
    },
    mixins: [DispatchMixin],
    data() {
        return {
            dialogVisible: false,
            btnLoading: false,
            isExpand: false,
            handleType: 'cancel'
        }
    },
    filters: {
        filterUserList(val) {
            if (!val || !val.length) return '未设置';
            let str;
            return val.map(item => item.name).join('、');
        }
    },
    computed: {
        userId() {
            return JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        missionPrcdNodeId() {
            return this.$route.query.instanceWorkflowId
        },
        isDisabled() {
            return this.nodeDetailData.status === 2;
        },
        nodeTypeCode() {
            return this.nodeDetailData.prcdNodeTypeCode
        },
        isShow() {
             return this.nodeTypeCode === 'LAST_REVIEW_SAMPLE' || this.nodeTypeCode === 'REVIEW_SAMPLE';
        },
        isWaitSubmit() {
            return this.isShow && this.sampleItem.backlogSubmit;
        },
        isWaitReview() {
            return this.isShow && this.sampleItem.backlogReview;
        },
        isWorkBench() {
            return this.$route.path == '/designWorkbench'
        }
    },
    methods: {
        renderStatusText(status) {
            switch(status) {
                case 0: return '打版中';
                case 1: return '已成型';
                case 2: return '已作废'
            }
        },
        viewDetail() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.style.sample.view")){
                return
            }
            console.log(this.nodeDetailData)
            console.log(this.itemIndex,'ddd')
            this.$router.push({
                path: '/designFile/clothesDetail',
                query: {
                    id: this.sampleItem.sampleId,
                    bomId: this.nodeDetailData.functionData.samples[this.itemIndex].bomIds[0],
                    processFormId: this.nodeDetailData.functionData.samples[this.itemIndex].processFormIds[0],
                    designStyleId:this.nodeDetailData.designStyleId,
                    missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId
                }
            });
        },

        handleEdit() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.style.sample.edit")&&!this.isWorkBench){
                return
            }
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit")&&this.isWorkBench){
                return
            }
            this.$router.push({
                path: '/designFile/clothesDetail',
                query: {
                    id: this.sampleItem.sampleId,
                    bomId: this.nodeDetailData.functionData.samples[this.itemIndex].bomIds[0],
                    processFormId: this.nodeDetailData.functionData.samples[this.itemIndex].processFormIds[0],
                    designStyleId:this.nodeDetailData.designStyleId,
                    missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                    isEdit: 1
                }
            });
        },
        showDialog(type) {
            //作废
            if(type === 'delete'){
                // 权限
                // if(!this.powerJudgement.permissions("fac.spl.design.style.sample.nullify")){
                //     return
                // }
            //撤销
            }else if(type === 'cancel'){
                // 权限
                // if(!this.powerJudgement.permissions("fac.spl.design.style.sample.cancel")){
                //     return
                // }
            }
            console.log(this.sampleItem)
            this.handleType = type;
            this.dialogVisible = true;
        },
        handleSample() {
            if (this.handleType === 'cancel') {
                return this.cancelSample();
            }
            this.deleteSample();
        },
        // 撤销作废样版
        cancelSample() {
            const params = {
                missionPrcdNodeId: this.missionPrcdNodeId,
                userId: this.userId,
                sampleId: this.sampleItem.sampleId
            };
            this.btnLoading = true;
            cancelDesignNodeSample(params)
            .then(res => {
                this.btnLoading = false;
                if (res.data.code === 0) {
                    this.dialogVisible = false;
                    this.dispatch('DesignNodeDetail', 'update.node.detail');
                    this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                    return this.$message.success('撤销作废成功');
                }
                this.$message.error(res.data.msg || '撤销作废失败');
            });
        },
        // 删除样版
        deleteSample() {
            const params = {
                missionPrcdNodeId: this.missionPrcdNodeId,
                userId: this.userId,
                sampleId: this.sampleItem.sampleId
            };
            this.btnLoading = true;
            deleteDesignNodeSample(params)
            .then(res => {
                this.btnLoading = false;
                if (res.data.code === 0) {
                    this.dialogVisible = false;
                    this.dispatch('DesignNodeDetail', 'update.node.detail');
                    this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                    return this.$message.success('作废成功');
                }
                this.$message.error(res.data.msg || '作废失败');
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.sample-item {
    margin-bottom: 8px;
    border: 1px solid #E6EAF0;
    &__header {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        background: #F7F9FC;
        font-size: 12px;
        overflow: hidden;
        &--left {
            position: relative;
            width: 48px;
            height: 48px;
            border: 1px solid rgba(240,242,245,1);
            .sample-status {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 16px;
                width: 100%;
                line-height: 16px;
                text-align: center;
                color: #fff;
                font-size: 12px;
                background: #FFA914;
                span {
                    display: inline-block;
                    transform: scale(.8);
                }
            }
        }
    }
    &__pic {
        width: 100%;
        height: 100%;
    }
    &__content {
        flex: 1;
        margin: 0 12px;
        line-height: 22px;
        .color-blue {
            color: #1CA1FF
        }
        .color-red {
            color: #FA4150
        }
        .color-green {
            color: #23C811
        }
        .time {
            color: #A2ABB8
        }
        .user-list {
            display: inline-block;
            vertical-align: middle;
            .user-item:not(:last-child)::after {
                content: '、'
            }
        }
    }
    &__collapse {
        padding: 16px;
        background: #F2F4F7
    }
    .is-cancel {
        position: relative;
        cursor: not-allowed;
        pointer-events: none;
        &::after {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            content: '';
            width: 100%;
            height: 100%;
            z-index: 9;
            background:rgba(250, 250, 250, .5);
        }
    }
    &__arrow {
        color: #808080;
        margin-left: 40px;
        cursor: pointer;
        .icon-arrow-down {
            margin-left: 5px;
        }
    }
    .btn--blue {
        border-color: #68BFFD;
        color: #1CA1FF;
    }
    .btn--danger {
        border-color: #F89DA5;
        color: #FA4150;
    }
}
.dialog-content {
    text-align: center;
    p {
        margin-top: 24px;
    }
}
.btn--submit {
    margin-left: 12px;
}
</style>

