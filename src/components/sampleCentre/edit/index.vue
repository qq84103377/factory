<template>
    <section>
        <page-title title="编辑设计工单">
            <nf-button class="btn" @click="delKeepAliveStatus">
                取消
            </nf-button>
            <nf-button class="btn" type="warning" :loading="visible.btnLoading" @click="submit">
                确定
            </nf-button>
        </page-title>
        <base-box>
            <content-wrap title="工单信息" type="big">
                <el-form
                    ref="create-form"
                    class="create-form"
                    :model="formData"
                    :rules="rules"
                    label-width="100px">
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="工单号" prop="orderNo">
                                <el-input v-model="formData.orderNo" placeholder="不填则系统自动生成"></el-input>
                            </el-form-item>
                            <el-form-item class="create-form__item" label="优先级" prop="priorities">
                                <el-select
                                    v-model="formData.priority"
                                    placeholder="全部">
                                    <el-option v-for="item in options.priorities" :key="item.value" :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="制单日期" prop="placeorderAt">
                                <el-date-picker
                                    @change="placeorderAtChange"
                                    v-model="formData.placeorderAt"
                                    type="date"
                                    placeholder="选择制单日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item class="create-form__item" label="预完成日期" prop="deliveryAt">
                                <el-date-picker
                                    @change="finishDateChange"
                                    v-model="formData.deliveryAt"
                                    type="date"
                                    placeholder="预完成日期">
                            </el-date-picker>
                            </el-form-item>
                        </el-row>
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="设计款号" prop="designStyleNo">
                                <el-input v-model="formData.designStyleNo" disabled placeholder="请输入新的设计款号"></el-input>
                            </el-form-item>
                            <el-button 
                                class="create-form__edit-btn"
                                type="text"
                                @click="handleEditFile">编辑设计档案</el-button>
                        </el-row>
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="备注信息" prop="remark" style="width: calc(60% + 32px)">
                                <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注信息"></el-input>
                            </el-form-item>
                        </el-row>
                </el-form>
            </content-wrap>
        </base-box>
        <base-box class="procedure">
            <content-wrap title="工序节点" type="big">
                <el-form
                    ref="procedure-form"
                    class="create-form"
                    :model="formData"
                    :rules="rules"
                    label-width="100px">
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="工单号" prop="templateId">
                                <el-select
                                    v-model="formData.templateId"
                                    disabled
                                    @change="handleSelectTemplate"
                                    placeholder="请选择工序模板">
                                    <el-option
                                        v-for="item in options.templateOptions"
                                        :key="item.templateId"
                                        :label="item.templateName"
                                        :value="item.templateId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="create-form__item" label="负责人" prop="leaderIds">
                                <v-user-select v-model="formData.leaderIds" :options="options.groupOptions" placeholder="请选择负责人" @remote="fetchUnitUser"></v-user-select>
                                <!-- <el-select
                                    v-model="formData.leaderIds"
                                    multiple
                                    placeholder="请选择负责人">
                                    <el-option
                                        v-for="item in options.userOptions"
                                        :key="item.id"
                                        :label="item.userName"
                                        :value="item.id">
                                    </el-option>
                                </el-select> -->
                            </el-form-item>
                        </el-row>
                </el-form>
                <!-- 工序模板表格 -->
                <procedure-table v-show="formData.templateId" :options="options" v-model="procedureList"></procedure-table>
            </content-wrap>
        </base-box>
        <nf-button class="btn--cancel" @click="handleCancelClick">撤销工单</nf-button>
        <el-dialog :visible.sync="visible.cancelVisible" size="tiny" :show-close="false">
            <div>
                <div class="dialog-content-wrap">
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定撤销当前工单？</p>
                </div>
            </div>
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.cancelVisible = false">取 消</nf-button>
                <nf-button type="warning" style="margin-left: 12px" :loading="visible.btnLoading" @click="handleCancelMission">确 定</nf-button>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
    import { formatDate } from '@/utils';
    import ProcedureTable from '../create/procedure-table';
    import { getPersonList, getUnitUser } from '@/api';
    import { queryDesignStyleNoRepeat
            , getDesignTemplateList
            , getDesignNodeList
            , getDesignTemplateDetail
            , editDesignMission
            , getDesignMissionDetail
            , cancelDesignMission
            , getEditDesignMissionNodeInfo } from '@/api/sample-centre';
    import { mapState } from 'vuex';
    export default {
        name: 'SampleMissionEdit',
        data() {
            return {
                formData: {
                    orderNo: '',
                    priority: 0,
                    placeorderAt: '',
                    deliveryAt: '',
                    designStyleNo: '',
                    remark: '',
                    leaderIds: [],
                    templateId: ''
                },
                editNodeInfo: {},
                missionDetailData: {},
                procedureList: [],
                fileFormData: {}, // 保存设计档案数据
                rules: {
                    orderNo: [
                        {
                            validator: this.validByLength, trigger: 'blur'
                        }
                    ],
                    priority: [
                        { required: true, message: '请选择优先级' }
                    ],
                    placeorderAt: [
                        { required: true, message: '请选择制单日期' }
                    ],
                    deliveryAt: [
                        { required: true, message: '请选择预完成日期' },
                        { validator: this.validDate, trigger: 'change' }
                    ],
                    designStyleNo: [
                        { required: true, message: '请输入新的设计款号' },
                        { max: 20, message: '请输入20个字符以内',trigger: 'blur' }
                    ],
                    remark: [
                        { max: 200, message: '200个字符以内', trigger: 'blur' }
                    ],
                    templateId: [
                        { required: true, message: '请选择工序模板' }
                    ],
                    leaderIds: [
                        { type: 'array', required: true, message: '请选择负责人' }
                    ]
                },
                visible: {
                    cancelVisible: false,
                    btnLoading: false,
                    showEditBtn: false
                },
                options: {
                    userOptions: [],
                    groupOptions: [],
                    templateOptions: [],
                    priorities: [
                        {
                            label: '普通',
                            value: 0
                        },
                        {
                            label: '加急',
                            value: 1
                        }
                    ]
                }
            };
        },
        components: {
            ProcedureTable
        },
        computed: {
             ...mapState({
                editFormData: (state) => state.DesignMission.formData
            }),
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            missionId() {
                return this.$route.query.missionId
            }
        },
        created() {
            this.fetchTemplateList();
            this.fetchUserList();
            this.fetchUnitUser();
            this.fetchFacMissionDetail();
            // this.formData.placeorderAt = formatDate(new Date(), 'yyyy-MM-dd');
        },
        activated() {
            // 编辑设计档案时重新获取新的designStyleNo
            getDesignMissionDetail({
                missionId: this.missionId
            }).then(res => {
                this.formData.designStyleNo = res.data.data.designStyleNo;
            });
        },
        methods: {
            //撤销工单
            handleCancelClick(){
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.mission.cancel")){
                    return
                }
                this.visible.cancelVisible = true
            },
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;

                    console.log(res);
                });
            },
            // 获取编辑工序模板数据
            fetchEditNodeInfo() {
                getEditDesignMissionNodeInfo({ missionId: this.missionId })
                .then(res => {
                    console.log(res, 'fetchEditNodeInfo')
                    this.formData.templateId = res.data.templateId;
                    this.formData.leaderIds = res.data.chargers.map(item => item.id);
                    this.editNodeInfo = res.data;
                });
            },
             // 获取工单详情
            fetchFacMissionDetail() {
                getDesignMissionDetail({
                    missionId: this.missionId
                }).then(res => {
                    if (res.data.code === 0) {
                        const { data } = res.data;
                        this.missionDetailData = data;
                        Object.keys(this.formData).forEach(key => {
                            if (key in data) {
                                this.formData[key] = data[key];
                            }
                        })
                        this.fetchEditNodeInfo();
                    }
                    else {
                        this.$router.replace('/sample');
                    }
                });
            },
            fetchTemplateList() {
                getDesignTemplateList({ unitId: this.unitId })
                .then(res => {
                    this.options.templateOptions = res.data.data;
                });
            },
            fetchTemplateDetail(templateId) {
                if (templateId === this.editNodeInfo.templateId) {
                    return this.initProcedureList(this.editNodeInfo);
                }
                getDesignTemplateDetail({ templateId })
                .then(res => {
                    this.initProcedureList(res.data.data);
                });
            },
            // 初始化procedureList数据
            initProcedureList(data = {}) {
                const chargerIds = data.chargers.map(item => item.id);
                this.procedureList = data.nodes.map(item => {
                    return {
                        id: item.id || '',
                        endAt: item.dateEnd,
                        nodeId: item.designPrcdNodeId,
                        designPrcdNodeTypeId: item.templateNodeTypeId,
                        nodeSubmitIds: this.getUserIds(item.submitters, 'id'),
                        nodeAuditingIds: this.getUserIds(item.reviewers, 'id'),
                        nodeUserIds: this.getUserIds(item.chargers, 'id'),
                        daysAdvanced: item.dafd,
                        needDelayWarning: item.needDelayWarning,
                        delayWarningNum: item.delayWarningNum
                    }
                });
                this.formData.leaderIds = chargerIds;
            },
            getUserIds(arr, prop) {
                return arr.map(item => item[prop]);
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
            
            submit() {
                this.$refs['create-form'].validate((valid) => {
                    if (valid) {
                        this.$refs['procedure-form'].validate((procedureValid) => {
                            if (!procedureValid) return;
                            const params = {
                                ...this.formData,
                                missionId: this.missionId,
                                process: {
                                    leaderIds: this.formData.leaderIds,
                                    templateId: this.formData.templateId,
                                    nodemsg: this.procedureList
                                }
                            };
                            this.visible.btnLoading = true;
                            editDesignMission(params)
                            .then(res => {
                                this.visible.btnLoading = false;
                                if (res.data.code === 0) {
                                    this.$message.success('编辑成功');
                                    this.delKeepAliveStatus();
                                }
                                else {
                                    this.$message.error(res.data.msg || '编辑失败');
                                }
                            });
                        })
                    }
                });
            },
            delKeepAliveStatus() {
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$store.dispatch('deleteVisitedLive', 'SampleMissionEdit');
                this.$nextTick(() => {
                    this.$router.back();
                });
            },
            placeorderAtChange(val) {
                this.formData.placeorderAt = val;
            },
            finishDateChange(val) {
                this.formData.deliveryAt = val;
            },
            validDate(rule, value, callback) {
                const placeorderAt = new Date(this.formData.placeorderAt.replace('-', '/')).getTime();
                const end = new Date(this.formData.deliveryAt.replace('-', '/')).getTime();
                if (end < placeorderAt) {
                    callback(new Error('预计完成日期不能早于制单日期'))
                }
                else {
                    callback();
                }
            },
            validStyleNO(rule, value, callback) {
                const params = {
                    userId: this.userId,
                    designStyleNo: this.formData.designStyleNo
                };
                queryDesignStyleNoRepeat(params)
                .then(res => {
                    if (res.data.code === 0) {
                        this.visible.showEditBtn = true;
                        callback();
                        return;
                    }
                    this.visible.showEditBtn = false;
                    callback(new Error('不可使用，已存在该设计款号'));
                })
            },
            // 跳转到编辑档案
            handleEditFile() {
                // this.$store.dispatch('setFormData', {
                //     designStyleNo: this.formData.designStyleNo
                // });
                this.$router.push({
                    path: '/designFile/createDesignFile',
                    query: {
                        designStyleId: this.missionDetailData.designStyleId
                    }
                })
            },
            handleSelectTemplate(val) {
                if (!val) return;
                this.fetchTemplateDetail(val)
            },
            handleCancelMission() {
                this.visible.btnLoading = true;
                cancelDesignMission({ missionId: this.missionId })
                .then(res => {
                    this.visible.btnLoading = false;
                    if (res.data.code === 0) {
                        this.visible.cancelVisible = false;
                        this.$router.back();
                        return this.$message.success('撤销工单成功');
                    }
                    this.$message.error(res.data.msg || '撤销工单成功')
                });
            }
        }
    }
</script>

<style lang="scss">
    .create-form {
        .el-date-editor {
            width: 100%
        }
        .el-select {
            width: 100%
        }
        
    }
</style>

<style lang="scss" scoped>
    .btn--cancel {
        margin-top: 12px;
        font-size: 12px!important;
        background: #fff;
        color: #FA4150
    }
    .create-form__row {
        margin-left: -20px;
        .create-form__item {
            width: 30%;
            margin-right: 32px;
            margin-bottom: 20px;
        }
        &:last-child .create-form__item {
            margin-bottom: 0
        }
        .create-form__edit-btn {
            text-decoration: underline;
            color: #1CA1FF;
        }
    }
    .procedure {
        margin-top: 12px;
        &__label {
            padding-right: 12px;
            &::before {
                content: '*';
                color: #FA4150
            }
        }
        &-form__item {
            margin-right: 56px;
        }
        &-list {
            margin-top: 12px;
        }
    }
    .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }
</style>
