<template>
<div class="wrapper">
    <!-- 提交区 -->
    <div class="detail-main-table">
        <div class="detail-main-table__title">
            <icon type="icon-tijiaoqu" w="68" h="24" />
        </div>
        <div class="detail-main-table__wrapper">
            <el-table
                :data="submitters"
                border
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table
                            class="expand-table"
                            :data="scope.row.submitLogs"
                            border
                            :show-header="false"
                            style="width: 100%">
                            <el-table-column width="48">
                                <template slot-scope="scope">
                                    
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="提交人"
                                prop="submitterName">
                            </el-table-column>
                            <el-table-column
                                label="提交备注"
                                prop="message">
                            </el-table-column>
                            <el-table-column
                                width="130"
                                label="提交状态"
                                prop="submitStatus">
                                <template slot-scope="scope">
                                    {{ scope.row.submitStatus == 0 ? '未提交' : '已提交' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="提交时间"
                                prop="dateSubmit">
                            </el-table-column>
                            <el-table-column
                                width="130"
                                label="操作">
                                <template slot-scope="scope">
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交人"
                    prop="submitterName">
                </el-table-column>
                <el-table-column
                    label="提交备注"
                    prop="message">
                </el-table-column>
                <el-table-column
                    width="130"
                    label="提交状态"
                    prop="submitStatus">
                    <template slot-scope="scope">
                        {{ scope.row.submitStatus == 0 ? '未提交' : '已提交' }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交时间"
                    prop="dateSubmit">
                </el-table-column>
                <el-table-column
                    width="130"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                        class="btn--review"
                        type="text"
                        @click="showAuditDialog(scope.row)"
                        v-show="isShowHandleBtn(scope.row.submitterId)">
                            {{scope.row.submitStatus == 0 ? '提交审核' : '再次提交审核'}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 审核区 -->
    <div class="detail-main-table">
        <div class="detail-main-table__title">
            <icon type="icon-shenhequ" w="68" h="24" />
        </div>
        <div class="detail-main-table__wrapper">
            <el-table
                :data="reviewers"
                border
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-table
                            class="expand-table"
                            :data="scope.row.reviewLogs"
                            border
                            :show-header="false"
                            style="width: 100%">
                            <el-table-column width="48">
                                <template slot-scope="scope">
                                    
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="审核人"
                                prop="reviewerName">
                            </el-table-column>
                            <el-table-column
                                label="审核意见"
                                prop="message">
                            </el-table-column>
                            <el-table-column
                                width="130"
                                label="审核状态"
                                prop="reviewStatus">
                                 <template slot-scope="scope">
                                    {{ renderReviewStatus(scope.row.reviewStatus) }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="审核时间"
                                prop="dateReview">
                            </el-table-column>
                            <el-table-column
                                width="130"
                                label="操作">
                                <template slot-scope="scope">
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核人"
                    prop="reviewerName">
                </el-table-column>
                <el-table-column
                    label="审核意见"
                    prop="message">
                </el-table-column>
                <el-table-column
                    width="130"
                    label="审核状态"
                    prop="reviewStatus">
                    <template slot-scope="scope">
                        {{ renderReviewStatus(scope.row.reviewStatus) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核时间"
                    prop="dateReview">
                </el-table-column>
                <el-table-column
                    width="130"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button
                            class="btn--review"
                            type="text"
                            @click="showReviewDialog(scope.row)"
                            v-show="isShowHandleBtn(scope.row.reviewerId)">
                            {{scope.row.reviewStatus == 0 ? '审核' : '再次审核'}}</el-button>
                        <!-- <el-button class="btn--review" type="text">再次审核</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <!-- 提交审核--Dialog -->
    <el-dialog
        custom-class="nf-dialog-common audit-dialog"
        title="提交审核"
        size="tiny"
        :show-close="false"
        :visible.sync="visible.auditVisible">
        <p class="audit-tip">
            <icon type="icon-tips" w="11" h="11"/>
            提交审核后系统会自动通知审批人审批
        </p>
        <el-input
            class="audit-textarea"
            type="textarea"
            :rows="4"
            placeholder="请输入提交备注（必填）"
            v-model="message">
        </el-input>
        <!-- footer -->
        <el-row type="flex" justify="center" slot="footer">
            <nf-button @click="visible.auditVisible = false">取 消</nf-button>
            <nf-button
                class="btn--submit"
                type="warning"
                :loading="visible.btnLoading"
                @click="nodeSubmit">确 定</nf-button>
        </el-row>
    </el-dialog>
    <!--审核--Dialog -->
    <el-dialog
        custom-class="nf-dialog-common audit-dialog"
        title="审核"
        size="tiny"
        :show-close="false"
        :visible.sync="visible.reviewVisible">
        <p class="audit-tip">
            <icon type="icon-tips" w="11" h="11"/>
            审核后系统会自动通知提交人
        </p>
        <el-row type="flex" justify="center">
            <div class="selected">
                <div
                    class="selected__item"
                    v-for="item of selectedConf"
                    :key="item.status"
                    @click="activeStatus = item.status"
                    :style="{
                        'color': activeStatus === item.status ? item.fill : '',
                        'borderColor': activeStatus === item.status ? item.fill : '',
                    }">
                    <span 
                    v-show="activeStatus === item.status"
                    class="triangle"
                        :style="{
                            'borderBottomColor': activeStatus === item.status ? item.fill : '',
                        }"></span>
                    {{ item.label }}
                </div>
            </div>
        </el-row>
        <el-input
            class="audit-textarea"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
            v-model="message">
        </el-input>
        <!-- footer -->
        <el-row type="flex" justify="center" slot="footer">
            <nf-button @click="visible.reviewVisible = false">取 消</nf-button>
            <nf-button
                class="btn--submit"
                type="warning"
                :loading="visible.btnLoading"
                @click="nodeReview">确 定</nf-button>
        </el-row>
    </el-dialog>
</div>
</template>


<script>
import {
        designNodeSubmit,
        designNodeReview } from '@/api/sample-centre';
import DispatchMixin from '@/components/stock/mixins';
import { mapState } from 'vuex';
export default {
    props: {
        participants: Array,
        submitters: Array,
        reviewers: Array
    },
    mixins: [DispatchMixin],
    data() {
        return {
            message: '',
            auditData: {},
            visible: {
                auditVisible: false,
                reviewVisible: false,
                btnLoading: false,
            },
            activeStatus: 0,
            selectedConf: [
                {
                    label: '通过',
                    fill: '#23C811',
                    status: 1
                },
                {
                    label: '驳回',
                    fill: '#FA4150',
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
        }
    },
    watch: {
    },
    methods: {
        renderReviewStatus(status) {
            switch(status) {
                case 0: return '未审核';
                case 1: return '通过';
                case 2: return '驳回';
            }
        },
        isShowHandleBtn(id) {
            // “提交人”为当前用户／节点／工单负责人时，才可显示且操作当前行数据的“提交审核”功能
            // participants为参与人列表
            return this.userId === id && this.participants.some(item => item.participantsId === id) && this.nodeDetailData.status !== 2;
        },
        showAuditDialog(row) {
            console.log(row)
            this.auditData = row;
            this.message = '';
            this.visible.auditVisible = true;
        },
        showReviewDialog(row) {
            console.log(row)
            this.auditData = row;
            this.message = '';
            this.visible.reviewVisible = true;
        },
        // 提交审核
        nodeSubmit() {
            if (!this.message) {
                return this.$message.error('请填写提交审核备注');
            }
            const params = {
                targetId: this.auditData.submitTargetId,
                userId: this.userId,
                missionPrcdNodeId: this.auditData.missionPrcdNodeId,
                message: this.message
            }
            this.visible.btnLoading = true;
            designNodeSubmit(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.auditVisible = false;
                    this.dispatch('DesignNodeDetail', 'update.node.detail'); // node-detail.vue created中$on的方法
                    this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                    return this.$message.success('提交审核成功');
                }
                this.$message.error(res.data.msg || '提交审核失败');
            });
        },
        // 审核
        nodeReview() {
            if (!this.activeStatus) {
                return this.$message.error('请选择审核结果');
            }
            if(this.activeStatus === 2 && !this.message) {
                return this.$message.error('请填写审核内容');
            }
            const params = {
                targetId: this.auditData.reviewTargetId,
                userId: this.userId,
                reviewStatus: this.activeStatus,
                missionPrcdNodeId: this.auditData.missionPrcdNodeId,
                message: this.message
            }
            this.visible.btnLoading = true;
            designNodeReview(params)
            .then(res => {
                this.visible.btnLoading = false;
                if (res.data.code === 0) {
                    this.visible.reviewVisible = false;
                     this.dispatch('DesignNodeDetail', 'update.node.detail'); // node-detail.vue created中$on的方法
                     this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                    return this.$message.success('审核成功');
                }
                this.$message.error(res.data.msg || '审核失败');
            });
        }
    }
}
</script>

<style lang="scss">
    .detail-main-table .el-table {
        thead th,
        .el-table__expand-column {
            height: 28px;
            background: #F7F9FC;
            font-size: 12px;
            font-weight: bold;
            color: #808080;
        }
        .el-table__header-wrapper thead div {
            background-color: #F7F9FC;
            color: #808080;
        }
        .el-table__expanded-cell {
            padding: 0
        }
        tbody td {
            font-size: 12px;
            height: 32px;
            color: #3b3b3b;
            background-color: #fff;
            .cell {
                position: relative;
                padding: 0 10px;
                background-color: #fff;
            }
        }
        .el-table__body tr:hover > td {
            background-color: #fff;
        }
        &.expand-table {
            tbody td {
                background-color: #FAFAFA;
                .cell {
                    background-color: #FAFAFA;
                }   
            }    
        }
    }
    .btn--submit {
        margin-left: 12px;
    }
    .audit-dialog {
        .el-dialog__body {
            position: relative;
        }
    }
</style>

<style lang="scss" scoped>
    .detail-main-table {
        &__title {
            margin: 8px 0;
        }
        .btn--review {
            font-size: 12px;
            color: #1CA1FF
        }
    }
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
    .selected {
        margin-left: -12px;
        margin-top: 16px;
        &__item {
            position: relative;
            display: inline-block;
            padding: 10px 28px;
            margin-left: 12px;
            cursor: pointer;
            box-sizing: border-box;
            font-size: 14px;
            border-radius: 2px;
            border: 1px solid #DCE0E6;
            .triangle {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 0;
                height: 0;
                border-bottom: 16px solid #23C811;
                border-left: 16px solid transparent;
                &::after {
                    position: absolute;
                    top: 5px;
                    right: 2px;
                    display: inline-block;
                    content: '';
                    width: 4px;
                    height: 8px;
                    border-right: 1px solid #fff;
                    border-bottom: 1px solid #fff;
                    transform: rotate(45deg)
                }
            }
        }
    }
    .audit-textarea {
        margin-top: 20px;
    }
</style>
