<template>
    <section>
        <page-title title="新建设计工单">
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
                    label-width="110px">
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
                            <el-form-item class="create-form__item" label="预期完成日期" prop="deliveryAt">
                                <el-date-picker
                                    @change="finishDateChange"
                                    v-model="formData.deliveryAt"
                                    type="date"
                                    placeholder="预期完成日期">
                            </el-date-picker>
                            </el-form-item>
                        </el-row>
                        <el-row class="create-form__row" type="flex">
                            <el-form-item class="create-form__item" label="设计款号" prop="designStyleNo">
                                <el-input v-model="formData.designStyleNo" placeholder="请输入新的设计款号"></el-input>
                            </el-form-item>
                            <el-button
                                class="create-form__edit-btn"
                                type="text"
                                v-show="formData.designStyleNo && visible.showEditBtn"
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
                            <el-form-item class="create-form__item" label="工序模板" prop="templateId">
                                <el-select
                                    v-model="formData.templateId"
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
                                <v-user-select v-model="formData.leaderIds" :options="options.groupOptions" @remote="fetchUnitUser" placeholder="请选择负责人"></v-user-select>
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
                <procedure-table v-if="formData.templateId" :options="options" v-model="procedureList"></procedure-table>
            </content-wrap>
        </base-box>
        <!-- <nf-button class="btn--cancel" @click="visible.cancelVisible = true">撤销工单</nf-button> -->
        <el-dialog :visible.sync="visible.cancelVisible" size="tiny" :show-close="false">
            <div>
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定撤销当前工单？</p>
                </div>
            </div>
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.cancelVisible = false">取 消</nf-button>
                <nf-button type="warning" style="margin-left: 12px">确 定</nf-button>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
    import { formatDate } from '@/utils';
    import ProcedureTable from './procedure-table';
    import { getPersonList, getUnitUser } from '@/api';
    import { queryDesignStyleNoRepeat
            , getDesignTemplateList
            , getDesignTemplateDetail
            , addDesignMission } from '@/api/sample-centre';
    import { mapState } from 'vuex';
    export default {
        name: 'SampleMissionCreate',
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
                        { max: 20, message: '请输入20个字符以内',trigger: 'blur' },
                        { validator: this.validStyleNO, trigger: 'blur'}
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
            }
        },
        created() {
            this.fetchTemplateList();
            this.fetchUserList();
            this.fetchUnitUser();
            this.formData.placeorderAt = formatDate(new Date(), 'yyyy-MM-dd');
        },
        activated() {
            this.fileFormData = this.editFormData;
            this.formData.designStyleNo = this.editFormData.designStyleNo;
            console.log(this.fileFormData);
        },
        methods: {
            ...mapState({
                editFormData: (state) => state.DesignMission.formData
            }),
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;

                    console.log(res);
                });
            },
            fetchTemplateList() {
                getDesignTemplateList({ unitId: this.unitId })
                .then(res => {
                    this.options.templateOptions = res.data.data;
                });
            },
            fetchTemplateDetail(templateId) {
                getDesignTemplateDetail({ templateId })
                .then(res => {
                    this.initProcedureList(res.data.data);
                });
            },
            // 初始化procedureList数据
            initProcedureList(data = {}) {
                console.log(data, '-=========')
                const chargerIds = data.chargers.map(item => item.id);
                this.procedureList = data.nodes.map(item => {
                    return {
                        nodeId: item.designPrcdNodeId,
                        designPrcdNodeTypeId: item.templateNodeTypeId,
                        nodeSubmitIds: this.getUserIds(item.submitters, 'id'),
                        nodeAuditingIds: this.getUserIds(item.reviewers, 'id'),
                        nodeUserIds: this.getUserIds(item.chargers, 'id'),
                        daysAdvanced: item.dafd,
                        endAt: '',
                        needDelayWarning: item.needDelayWarning,
                        delayWarningNum: item.delayWarningNum
                    }
                });
                this.setItemEndAt();
                this.formData.leaderIds = chargerIds;
            },
            setItemEndAt() {
                if (!this.formData.deliveryAt) return;
                const date = new Date(this.formData.deliveryAt.replace(/-/g, '/'));
                this.procedureList.forEach(item => {
                    const newDate = date.setDate(date.getDate() + item.daysAdvanced || 0);
                    item.endAt = formatDate(new Date(newDate), 'yyyy-MM-dd');
                });
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
                            // if (!this.fileFormData.chargers || !this.fileFormData.chargers.length) {
                            //     // 编辑设计档案中，设计款号和设计负责人为必填
                            //     return this.$message.error('请编辑设计档案');
                            // }
                            const params = {
                                ...this.formData,
                                designStyle: this.fileFormData,
                                process: {
                                    leaderIds: this.formData.leaderIds,
                                    templateId: this.formData.templateId,
                                    nodemsg: this.procedureList
                                },
                                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId,
                              unitId: JSON.parse(sessionStorage.getItem('last_login')).id
                            };
                            this.visible.btnLoading = true;
                            addDesignMission(params)
                            .then(res => {
                                this.visible.btnLoading = false;
                                if (res.data.code === 0) {
                                    this.$message.success('新建成功');
                                    this.delKeepAliveStatus();
                                }
                                else {
                                    this.$message.error(res.data.msg || '新建失败');
                                }
                            });
                        })
                    }
                });
            },
            delKeepAliveStatus() {
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$store.dispatch('deleteVisitedLive', 'SampleMissionCreate');
                this.$store.dispatch('setFormData', {
                    designStyleNo: ''
                });
                this.$nextTick(() => {
                    this.$router.push('/sample');
                });
            },
            placeorderAtChange(val) {
                this.formData.placeorderAt = val;
            },
            finishDateChange(val) {
                this.formData.deliveryAt = val;
                this.setItemEndAt();
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
                this.$store.dispatch('setFormData', {
                    ...this.editFormData,
                    designStyleNo: this.formData.designStyleNo
                });
                this.$router.push({
                    path: '/designFile/createDesignFile',
                    query: {
                        editable: 1 // 标记是从设计工单页跳转
                    }
                })
            },
            handleSelectTemplate(val) {
                this.fetchTemplateDetail(val)
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
