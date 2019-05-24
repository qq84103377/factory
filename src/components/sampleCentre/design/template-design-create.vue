<template>
    <section class="template-design-create">
        <page-title title="新建设计工序模板">
            <nf-button  @click="$router.back()">取消</nf-button>
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
                            <!-- <el-select v-model="formData.chargerIds" multiple  placeholder="请选择负责人">
                                <el-option
                                    v-for="item in options.userOptions"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                                </el-option>
                            </el-select> -->
                            <v-user-select v-model="formData.chargerIds" :options="options.groupOptions" @remote="fetchUnitUser"></v-user-select>
                            <!-- <workerLeader v-model="formData.chargerIds" :placeholder="'请选择负责人'" ></workerLeader> -->
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap>
            <!-- 节点类型 -->
            <content-wrap class="flow" title="工序流程" type="big">
                <template-create-table
                    v-if="options.nodeOptions.length"
                    ref="template-create-table"
                    :options="options"
                    v-model="nodeList"
                    @on-edit="fetchNodeList"></template-create-table>
            </content-wrap>
        </base-box>
    </section>
</template>

<script>
    import { getPersonList, getUnitUser } from '@/api';
    import { addDesignTemplate, getDesignNodeList } from '@/api/sample-centre';
    import TemplateCreateTable from './template-create-table';
    export default {
        components: {
            TemplateCreateTable
        },
        data() {
            return {
                visible: {
                    btnLoading: false
                },
                nodeList: [],
                formData: {
                    name: '',
                    chargerIds: []
                },
                options: {
                    userOptions: [],
                    nodeOptions: [],
                    groupOptions: []
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
            this.fetchUnitUser();
        },
        methods: {
            getChargerIds(val) {
                this.formData.chargerIds = val;
                console.log(val)
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
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;

                    console.log(res);
                });
            },
            // 获取节点列表
            fetchNodeList() {
                const params = {
                    unitId: this.unitId
                }
                getDesignNodeList(params)
                .then(res => {
                    const { data } = res.data;
                    this.options.nodeOptions = data;
                });
            },
            submit() {
                this.$refs['create-form'].validate((valid) => {
                    if (valid) {
                        const nodes = this.nodeList;
                        if (nodes.some(item => !item.id)) {
                            return this.$message.error('请选择节点');
                        }
                        const params = {
                            ...this.formData,
                            unitId: this.unitId,
                            nodes
                        }
                        this.visible.btnLoading = true;
                        addDesignTemplate(params)
                        .then(res => {
                            if (res.data.code === 0) {
                                this.$message.success('新建成功');
                                this.$router.back();
                            }
                            else {
                                this.$message.error(res.data.msg || '新建失败');
                            }
                            this.visible.btnLoading = false;
                        });
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
    .create-form-wrapper {
        border-bottom: 1px solid #E6EAF0;
    }
    .create-form__item {
        width: 33%;
        margin-bottom: 10px;
        margin-right: 20px;
    }
    .flow {
        margin-top: 16px;
        .input-wrap {
            flex: 1;
            margin-left: 3px;
            .input-inner {
                width: 100%;
                height: 100%;
                padding: 0 3px;
                font-size: 12px;
                background: #F5F7FA;
            }
        }
    }
</style>

