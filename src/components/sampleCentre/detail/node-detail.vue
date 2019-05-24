<template>
    <section class="node-detail" v-loading="visible.loading">
        <!-- 节点状态栏 -->
        <el-row class="info-head" type="flex" justify="space-between">
            <div class="item-node-info" :span="10">
                <div :span="4" class="node-icon">
                    <span style="position: relative;">
                        <icon
                            v-show="isAlert || isWarning"
                            :type="isAlert ? 'icon-gongdan_jiedianjingbao-xiao' : 'icon-early-warning'"
                            style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -12px;left: 20px;" />
                        <icon :type="icon" style="width: 32px;height: 32px;"></icon>
                    </span>
                </div>
                <div class="node-base">
                    <span class="node--name">{{ nodeDetailData.prcdNodeName }}</span>
                    <p class="node-type">{{ nodeDetailData.prcdNodeTypeName }} </p>
                </div>
            </div>
            <div class="change-node-status">
                <div class="status">
                        <!-- @click="updateStatus(item.status, nodeDetailData.id, statusData.typeId)" -->
                    <span class="text-color"
                        v-for="(item, index) of statusTabConf"
                        :key="index"
                        :class="{
                            'finish': nodeDetailData.status == item.status && nodeDetailData.status == 2,
                            'ongoing': nodeDetailData.status == item.status && nodeDetailData.status == 1,
                            'wait-start': nodeDetailData.status == item.status && nodeDetailData.status == 0
                        }"
                        @click="showEditStatusDialog(item.status)">
                        <icon w='14' h="14" :type="item.icon"></icon>
                        {{ item.label }}
                    </span>
                    <p class="status-tip" v-show="nodeDetailData.status !== 2">
                        {{ tipText }}
                    </p>
                </div>
            </div>

            <div class="btn-wrap">
                <nf-button class="back-btn" @click="backMissionDetail">
                    返回
                </nf-button>
            </div>
        </el-row>
        <!-- 节点提醒 -->
        <node-remind :node-detail-data="nodeDetailData" @on-update="fetchTaskInstanceWorkflow"></node-remind>
        <!-- 节点信息 -->
        <div class="info-wrapper">
            <el-row type="flex" justify="space-between">
                <span class="user-list">负责人：
                    {{ chargeList | filterUserList }}
                </span>
                <span class="user-list">提交人：
                    {{ submitList | filterUserList }}
                </span>
                <span class="user-list">审核人：
                    {{ reviewList | filterUserList }}
                </span>
                <span>计划结束日期：{{ nodeDetailData.dateEnd | formatDate }}</span>
                <icon-button
                    type="icon-edit1"
                    :disabled="nodeDetailData.status === 2"
                    @click="handleEditNode">修改节点信息</icon-button>
            </el-row>
        </div>
        <component
            :is="componentId"
            :node-detail-data="nodeDetailData"
            @on-update="fetchTaskInstanceWorkflow"></component>
        <!-- 节点动态 -->
        <div class="dynamics-wrapper" v-if="nodeDetailData.logs && nodeDetailData.logs[0]">
            <el-row class="dynamics__header" type="flex" justify="space-between">
                <h4 class="dynamics__title">最新节点动态</h4>
                <icon-button class="dynamics__btn" type="icon-all_dynamic" @click="viewDynamic">查看全部动态</icon-button>
            </el-row>
            <dynamics-item :log-item="nodeDetailData.logs[0]"></dynamics-item>
        </div>
        <!-- 修改节点信息--dialog -->
        <el-dialog
              custom-class="nf-dialog-common"
              title="修改节点信息"
              size="tiny"
              :show-close="false"
              :visible.sync="visible.editInfoVisible">
                <el-form class="edit-form" label-width="100px" :model="editFormData">
                    <el-form-item class="edit-form__item" label="负责人">
                        <el-select v-model="editFormData.chargerIds" filterable  multiple  placeholder="请选择负责人">
                            <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="edit-form__item" label="提交人">
                        <el-select multiple filterable v-model="editFormData.submitterIds" placeholder="请选择负责人">
                            <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item  class="edit-form__item" label="审核人">
                        <el-select multiple filterable  v-model="editFormData.reviewerIds" placeholder="请选择负责人">
                            <el-option v-for="userItem of options.userOptions" :key="userItem.id" :value="userItem.id" :label="userItem.userName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="edit-form__item" label="计划结束日期">
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            @change="handleDateChange"
                            v-model="editFormData.dateEnd"></el-date-picker>
                    </el-form-item>
                </el-form>
                <!-- footer -->
                <el-row type="flex" justify="center" slot="footer">
                    <nf-button @click="visible.editInfoVisible = false">取 消</nf-button>
                    <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="editNodeInfo">确 定</nf-button>
                </el-row>
        </el-dialog>
        <!-- 修改节点状态--dialog -->
        <el-dialog
              custom-class="nf-dialog-common"
              title="修改节点状态"
              size="tiny"
              :show-close="false"
              :visible.sync="visible.statusVisible">
                <el-row type="flex" justify="center" class="statu-text">是否设置为{{renderStatusText}}状态</el-row>
                <!-- footer -->
                <el-row type="flex" justify="center" slot="footer">
                    <nf-button @click="visible.statusVisible = false">取 消</nf-button>
                    <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="editNodeStatus">确 定</nf-button>
                </el-row>
        </el-dialog>
        <!-- 审核--Dialog -->
        <el-dialog
              custom-class="nf-dialog-common audit-dialog"
              title="审核"
              size="tiny"
              :show-close="false"
              :visible.sync="visible.auditVisible">
                <p class="audit-tip">
                    <icon type="icon-tips" w="11" h="11"/>
                    审核后系统会自动通知提交人
                </p>
                <el-row class="audit-select" type="flex" justify="center">
                </el-row>
                <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入审核意见（选填）"
                    v-model="textarea">
                </el-input>
                <!-- footer -->
                <el-row type="flex" justify="center" slot="footer">
                    <nf-button @click="visible.auditVisible = false">取 消</nf-button>
                    <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="visible.auditVisible = false">确 定</nf-button>
                </el-row>
        </el-dialog>
    </section>
</template>

<script>
import {
        getDesignMissionNodeDetail,
        editDesignNodeInfo,
        editDesignNodeStatus, } from '@/api/sample-centre';
import { getPersonList } from '@/api';
import { formatDate } from '@/utils';
import { mapState } from 'vuex';
import NodeRemind from './node-remind';
import General from './node-components/general';
import SampleCreate from './node-components/sample-create';
import SampleReview from './node-components/sample-review';
import DynamicsItem from '../dynamic/dynamics-item';
export default {
    componentName: 'DesignNodeDetail',
    props: {
    },
    components: {
        NodeRemind,
        General,
        SampleCreate,
        SampleReview,
        DynamicsItem
    },
    data() {
        return {
            // nodeDetailData: {},
            editStatus: '',
            editFormData: {
                chargerIds: [],
                submitterIds: [],
                reviewerIds: [],
                dateEnd: '',
                userId: '',
                missionPrcdNodeId: ''
            },
            options: {
                userOptions: []
            },
            visible: {
                editInfoVisible: false,
                btnLoading: false,
                auditVisible: false,
                loading: false,
                statusVisible: false
            },
            statusTabConf: [
                {
                    label: '未开始',
                    icon: 'icon-notstar-little',
                    status: 0
                },
                {
                    label: '进行中',
                    icon: 'icon-ongoing-little',
                    status: 1
                },
                {
                    label: '已完成',
                    icon: 'icon-finish-little',
                    status: 2
                }
            ]
        }
    },
    computed: {
        ...mapState({
            nodeDetailData: state => state.DesignMission.nodeDetailData
        }),
        userId() {
            return JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        unitId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        missionId() {
            return this.$route.query['missionId'];
        },
        instanceWorkflowId() {
            return this.$route.query['instanceWorkflowId'];
        },
        componentId() {
            switch(this.nodeDetailData.prcdNodeTypeCode) {
                case 'NORMAL': return 'General'; // 一般
                case 'LAST_REVIEW': return 'General'; // 终审
                case 'REVIEW_SAMPLE': return 'SampleReview'; // 样衣评审
                case 'LAST_REVIEW_SAMPLE': return 'SampleReview';  // 样衣终审
                case 'GENERATE_SAMPLE': return 'SampleCreate'; // 样衣生成
            }
        },
        // type === 2， 负责人
        chargeList: {
            get() {
                return this.getUserListByType(2);
            },
            set(val) {

            }
        },
        // type === 1， 审核人
        reviewList: {
            get() {
                return this.getUserListByType(1);
            },
            set(val) {

            }
        },
        // type === 0， 提交人
        submitList: {
            get() {
                return this.getUserListByType(0);
            },
            set(val) {

            }
        },
        tipText() {
            const code = this.nodeDetailData.prcdNodeTypeCode;
            switch(code) {
                case 'NORMAL': return '一般流程型节点在审核人全部审核通后，系统自动设为已完成。';
                case 'GENERATE_SAMPLE': return '生成样衣型节点在添加全部样衣完成后需要手动操作设置为已完成。';
                case 'REVIEW_SAMPLE': return '样衣评审型节点在所有未作废样衣全部审核通过后，系统自动设为已完成。';
                case 'LAST_REVIEW_SAMPLE': return '样衣终审型节点在所有未作废样衣的状态为已成型后，系统自动设为已完成。 （未作废的样衣在所有审核通过后，状态自动更改为已成型）';
                case 'LAST_REVIEW': return '终审节型点在审核人全部审核通过且生成商品档案后，系统自动设为已完成。';
            }
        },
        renderStatusText() {
            switch(this.editStatus) {
                case 0: return '未完成';
                case 1: return '进行中';
                case 2: return '已完成'
            }
        },
        isAlert() {
            const { notify } = this.nodeDetailData;
            return notify && notify.notifies.some(item => item.type == 1);
        },
        isWarning() {
            const { notify } = this.nodeDetailData;
            return notify && notify.notifies.some(item => item.type == 0);
        },

        icon() {
            const status = this.nodeDetailData.status;
            switch(status) {
                case 0: return 'icon-gongdan-jiedianweikaishi-da';
                case 1: return 'icon-gongdan-jiedianjinxingzhong-da';
                case 2: return 'icon-gongdan-jiedianyiwancheng-da';
            }
        },
    },
    filters: {
        formatDate(val) {
            if (!val) return '未设置';
            const date = new Date(val.replace(/-/g, '/'));
            return formatDate(date, 'yyyy-MM-dd');
        },
        filterUserList(val) {
            if (!val || !val.length) return '未设置';
            let str;
            return val.map(item => item.participantsName).join('、');
        }
    },
    created() {
        this.fetchTaskInstanceWorkflow();
        this.fetchUserList();
        this.$on('update.node.detail', this.fetchTaskInstanceWorkflow);
        console.log(this.$store)
    },
    watch: {
        instanceWorkflowId(val) {
            this.fetchTaskInstanceWorkflow();
        },
        'visible.editInfoVisible'(val) {
            if (val) {
                this.initEditFormData(this.nodeDetailData);
            }
        }
    },
    methods: {
        //修改节点信息
        handleEditNode(){
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.edit")){
                return
            }
            this.visible.editInfoVisible = true
        },
        async fetchTaskInstanceWorkflow() {
            const params = {
                nodeId: this.instanceWorkflowId,
                userId: this.userId
            };
            this.visible.loading = true;
            const res = await this.$store.dispatch('fetchDesignNodeDetail', params);
            console.log(res, '节点详情');
            this.visible.loading = false;
        },
        //获取负责人接口
        fetchUserList() {
            let params = {
                userId: this.userId,
                unitId: this.unitId
            };
            getPersonList(params)
            .then(res => {
                console.log(res)
                this.options.userOptions = res.data;
            });
        },
        editNodeInfo() {
            this.visible.btnLoading = true;
            editDesignNodeInfo(this.editFormData)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.editInfoVisible = false;
                    this.fetchTaskInstanceWorkflow();
                    return this.$message.success('修改成功');
                }
                this.$message.error(res.data.msg || '修改失败');
            })
        },
        editNodeStatus() {
            this.visible.btnLoading = true;
            editDesignNodeStatus({
                missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                status: this.editStatus,
                userId: this.userId
            })
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.statusVisible = false;
                    this.fetchTaskInstanceWorkflow();
                    this.$emit('on-update');
                    return this.$message.success('修改成功');
                }
                this.$alert(res.data.msg || '修改失败', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                    }
                });
            })
        },
        initEditFormData(data) {
            let chargerIds, submitterIds, reviewerIds;
            chargerIds = this.getIdArrByProp(this.chargeList, 'participantsId');
            submitterIds = this.getIdArrByProp(this.submitList, 'participantsId');
            reviewerIds = this.getIdArrByProp(this.reviewList, 'participantsId');
            this.editFormData = {
                missionPrcdNodeId: data.missionPrcdNodeId,
                dateEnd: data.dateEnd,
                chargerIds,
                submitterIds,
                reviewerIds,
                userId: this.userId
            }
        },
        getIdArrByProp(arr = [], prop) {
            return arr.map(item => item[prop]);
        },
        // 根据类型获取负责人、提交人用户列表
        getUserListByType(type) {
            return this.nodeDetailData.participants && this.nodeDetailData.participants.filter(item => item.type === type)
        },
        handleDateChange(val) {
            this.editFormData.dateEnd = val;
        },
        showEditStatusDialog(status) {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.status")){
                return
            }
            this.editStatus = status;
            this.visible.statusVisible = true;
        },
        viewDynamic() {
            // 权限
            if(!this.powerJudgement.permissions("fac.spl.design.mission.node.show")){
                return
            }
            this.$router.push({
                path: '/sample/dynamic',
                query: {
                    missionPrcdNodeId: this.nodeDetailData.missionPrcdNodeId,
                    designMissionId: this.nodeDetailData.designMissionId
                }
            })
        },
        backMissionDetail() {
            this.$router.replace({
                path: '/sample/detail',
                query: {
                    missionId: this.missionId
                }
            })
        }
    }
}
</script>

<style lang="scss">
    .audit-dialog {
        .el-dialog__body {
            position: relative;
        }
    }
</style>

<style lang="scss" scoped>
    .node-detail {
        padding: 0 32px;
        padding-bottom: 24px;
        background: #fff;
    }
    .info-head {
        border-bottom: 1px solid #e6eaf0;
        .back-btn {
            width: 72px;
        }
        .item-node-info {
            height: 36px;
            display: flex;
            justify-content: center;
            align-items: center;
            .node-base {
                line-height: 18px;
                .node--name {
                    font-size: 14px;
                    color: #2c2c2c;
                }
                .node-type {
                    font-size: 12px;
                    color: #a2abb8;
                }
            }
            .node-icon {
                margin-right: 12px;
            }
        }
        .change-node-status {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 0;
            padding-bottom: 24px;
            .title {
                margin-right: 12px;
            }
            .status {
                display: flex;
                align-items: center;
                span {
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 12px;
                    width: 88px;
                    color: #a2abb8;
                    height: 32px;
                    border-radius: 24px;
                    border: solid 1px #e6eaf0;
                }
                //节点状态颜色
                .wait-start {
                    background-image: linear-gradient(-45deg, #dae2eb 0%, #d3d9e6 100%);
                    color: #fff;
                    border: none;
                }
                .ongoing {
                    background-image: linear-gradient(-45deg, #3dcfff 0%, #1ca1ff 100%);
                    color: #fff;
                    border: none;
                }
                .finish {
                    color: #fff;
                    background-image: linear-gradient(-45deg, #65e0b7 0%, #23c811 100%);
                    border: none;
                }
            }
            .status-tip {
                max-width: 450px;
                line-height:20px;
                color: #a2abb8;
                font-size: 12px;
            }
        }
    }
    .info-wrapper {
        padding: 16px 0;
        border-bottom: 1px solid #E6EAF0;
        .btn--edit {
            color: #1CA1FF
        }
    }
    // 节点信息编辑dialog
    .edit-form__item {
        margin-bottom: 10px
    }
    .btn--submit {
        margin-left: 12px;
    }
    // 节点动态
    .dynamics-wrapper {
        .dynamics__header {
            margin: 8px 0;
        }
        .dynamics__btn {
            font-size: 12px
        }
    }
    // 节点状态--dialog
    // 审核dialog
    .audit-tip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
        padding: 5px 16px;
        background: #F5F7FA
    }
    .audit-select {
        margin: 12px 0;
    }
</style>

