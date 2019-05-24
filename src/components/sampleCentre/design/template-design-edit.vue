<template>
    <section class="template-design-create" v-loading="visible.loading">
        <page-title title="编辑设计工序模板">
            <nf-button @click="$router.back()">取消</nf-button>
            <nf-button type="warning" :loading="visible.btnLoading" @click="submit">确定</nf-button>
        </page-title>
        <base-box>
            <!-- 基本信息 -->
            <content-wrap class="create-form-wrapper" title="基本信息" type="big">
                <el-form class="create-form" ref="create-form" :model="formData" :rules="rules" label-width="100px">
                    <el-row type="flex">
                        <el-form-item class="create-form__item" label="工序名称" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入工序名称"></el-input>
                        </el-form-item>
                        <el-form-item class="create-form__item" label="默认负责人">
                            <el-select v-model="formData.chargerIds" multiple placeholder="请选择负责人">
                                <el-option
                                        v-for="item in options.userOptions"
                                        :key="item.id"
                                        :label="item.userName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap>
            <!-- 节点类型 -->
            <content-wrap class="flow" title="工序流程" type="big">
                <template-create-table
                        v-if="options.nodeOptions.length && nodeList.length"
                        ref="template-create-table"
                        editable
                        v-model="nodeList"
                        :options="options"
                        @on-edit="fetchNodeList"></template-create-table>
            </content-wrap>
        </base-box>
        <!-- 删除--dialog -->
        <el-dialog
                custom-class="nf-dialog-common no-dialog-header"
                title="提示"
                size="tiny"
                :show-close="false"
                :visible.sync="visible.confirmVisible">
            <div class="dialog-content">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="delete-tip">是否确定删除该工序模板？</p>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.confirmVisible = false">取 消</nf-button>
                <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="handleDelete">确 定
                </nf-button>
            </el-row>
        </el-dialog>
        <nf-button class="btn--delete" @click="permissionHas">删除模板</nf-button>
    </section>
</template>

<script>
    import TemplateCreateTable from './template-create-table';
    import {getPersonList} from '@/api';
    import {
        getDesignTemplateDetail,
        getDesignNodeList,
        editDesignTemplate,
        deleteDesignTemplate
    } from '@/api/sample-centre';

    export default {
        components: {
            TemplateCreateTable
        },
        data() {
            return {
                formData: {
                    name: '',
                    chargerIds: []
                },
                nodeList: [],
                visible: {
                    confirmVisible: false,
                    btnLoading: false,
                    loading: false
                },
                options: {
                    userOptions: [],
                    nodeOptions: []
                },
                rules: {
                    name: [
                        {
                            required: true, message: '请输入工序名称',
                        }
                    ]
                }
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        created() {
            this.fetchNodeList();
            this.fetchUserList();
            this.fetchTemplateDetail();
        },
        methods: {
            permissionHas() {
                // 权限
                if (!this.powerJudgement.permissions("fac.designNodeTemp.temp.delete")) {
                    return
                }
                this.visible.confirmVisible = true
            },
            fetchTemplateDetail() {
                this.visible.loading = true;
                getDesignTemplateDetail({templateId: this.$route.query.templateId})
                    .then(res => {
                        this.initFormData(res.data.data);
                        this.$nextTick(() => {
                            this.visible.loading = false;
                        });
                    });
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
            // 获取节点列表
            fetchNodeList() {
                const params = {
                    unitId: this.unitId
                }
                getDesignNodeList(params)
                    .then(res => {
                        const {data} = res.data;
                        this.options.nodeOptions = data;
                    });
            },
            // 初始化表单数据
            initFormData(data = {}) {
                const chargerIds = data.chargers.map(item => item.id);
                this.nodeList = data.nodes.map(item => {
                    return {
                        id: item.designPrcdNodeId,
                        designPrcdNodeTypeId: item.templateNodeTypeId,
                        nodeSubmitIds: this.getUserIds(item.submitters, 'id'),
                        nodeAuditingIds: this.getUserIds(item.reviewers, 'id'),
                        nodeUserIds: this.getUserIds(item.chargers, 'id'),
                        nodeGroupId: item.group?item.group.groupId:'',
                        daysAdvanced: item.dafd,
                        needDelayWarning: item.needDelayWarning,
                        delayWarningNum: item.delayWarningNum
                    }
                });
                this.formData = {
                    name: data.templateName,
                    templateId: data.templateId,
                    chargerIds
                }
            },
            getUserIds(arr, prop) {
                return arr.map(item => item[prop]);
            },
            submit() {
                this.$refs['create-form'].validate((valid) => {
                    if (valid) {
                        const nodes = this.$refs['template-create-table'].getNodeList();
                        if (nodes.some(item => !item.id)) {
                            return this.$message.error('请选择节点');
                        }
                        const params = {
                            ...this.formData,
                            unitId: this.unitId,
                            nodes
                        }
                        this.visible.btnLoading = true;
                        editDesignTemplate(params)
                            .then(res => {
                                this.visible.btnLoading = false;
                                if (res.data.code === 0) {
                                    this.$message.success('编辑成功');
                                    this.$router.back();
                                }
                                else {
                                    this.$message.error(res.data.msg || '编辑失败');
                                }
                            });
                    }
                });
            },
            handleDelete() {
                this.visible.btnLoading = true;
                deleteDesignTemplate({templateId: this.formData.templateId})
                    .then(res => {
                        this.visible.btnLoading = false;
                        if (res.data.code === 0) {
                            this.$message.success('删除成功');
                            this.$router.push('/design/template');
                        }
                        else {
                            this.$message.error(res.data.msg || '删除失败');
                        }
                    });
            }
        }
    }
</script>

<style lang="scss">
    .template-design-create {
        .el-select {
            width: 100%
        }
    }
</style>


<style lang="scss" scoped>
    .btn--delete {
        color: #FA4150;
        background: #fff;
        margin-top: 12px;
    }

    .create-form-wrapper {
        border-bottom: 1px solid #E6EAF0;
    }

    .create-form {
        margin-left: -20px;
    }

    .create-form__item {
        width: 33%;
        margin-bottom: 10px;
        margin-right: 20px;
    }

    .flow {
        margin-top: 16px;
    }

    .btn--submit {
        margin-left: 12px;
    }

    .dialog-content {
        text-align: center;
        p {
            margin-top: 24px;
        }
    }
</style>

