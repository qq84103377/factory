<template>
    <section class="template-design-create">
        <page-title title="设计工序模板详情">
            <nf-button @click="$router.back()">返回上级</nf-button>
        </page-title>
        <base-box>
            <!-- 基本信息 -->
            <content-wrap class="create-form-wrapper" title="基本信息" type="big">
                <nf-button slot="headRight" svg="icon-edit1" @click="handleEdit">编辑</nf-button>
                <el-form class="create-form" label-width="100px">
                    <el-row type="flex">
                        <el-form-item class="create-form__item" label="工序名称:" prop="name">
                            {{ detailData.templateName }}
                        </el-form-item>
                        <el-form-item class="create-form__item" label="默认负责人:">
                            <i
                                class="user-item"
                                v-for="user of detailData.chargers"
                                :key="user.id">{{ user.name }}</i>
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap>
            <!-- 节点类型 -->
            <content-wrap class="flow" title="工序流程" type="big">
                <el-table
                    class="flow-table"
                    border
                    :data="detailData.nodes">
                    <el-table-column label="节点名称">
                        <template slot-scope="scope">
                            {{ scope.row.templateNodeName }}<span class="node-type">({{ scope.row.templateNodeTypeName }})</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column label="提交人">-->
                        <!--<template slot-scope="scope">-->
                            <!--<p class="user-list">-->
                                <!--<i -->
                                    <!--class="user-list__item"-->
                                    <!--v-for="user of scope.row.submitters"-->
                                    <!--:key="user.id">{{ user.name }}</i>-->
                                <!--{{ renderEmptyText(scope.row.submitters) }}-->
                            <!--</p>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column label="默认负责人">
                        <template slot-scope="scope">
                            <p class="user-list">
                                <i
                                        class="user-list__item"
                                        v-for="user of scope.row.chargers"
                                        :key="user.id">{{ user.name }}</i>
                                {{ renderEmptyText(scope.row.chargers) }}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="默认负责组">
                        <template slot-scope="scope">
                            <p v-if="scope.row.group" class="user-list">
                                {{scope.row.group.groupName}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="评审人">
                        <template slot-scope="scope">
                            <p class="user-list">
                                <i 
                                    class="user-list__item"
                                    v-for="user of scope.row.reviewers"
                                    :key="user.id">{{ user.name }}</i>
                                {{ renderEmptyText(scope.row.reviewers) }}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column label="默认结束时间 (天)">
                        <template slot-scope="scope">
                            预计完成前 {{ scope.row.dafd }} 天
                        </template>
                    </el-table-column>
                    <el-table-column label="预警提醒 (天)">
                        <template slot-scope="scope">
                            {{ scope.row.delayWarningNum ? `结束前 ${scope.row.delayWarningNum} 天` : '' }}
                        </template>
                    </el-table-column>
                </el-table>
            </content-wrap>
        </base-box>
    </section>
</template>

<script>
    import { getDesignTemplateDetail } from '@/api/sample-centre';
    export default {
        components: {
        },
        data() {
            return {
                detailData: {
                    nodes: []
                }
            }
        },
        created() {
            this.fetchTemplateDetail()
        },
        methods: {
            fetchTemplateDetail() {
                getDesignTemplateDetail({ templateId: this.$route.query.templateId })
                .then(res => {
                    this.detailData = res.data.data
                });
            },
            renderEmptyText(arr) {
                return arr.length ? '' : '未设置'
            },
            handleEdit() {
                  // 权限
                  if(!this.powerJudgement.permissions("fac.designNodeTemp.temp.update")){
                      return
                  }
                this.$router.push({
                    path: '/design/template/edit',
                    query: {
                        templateId: this.detailData.templateId
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
    .flow-table {
        input {
            height: 30px;
            font-size: 12px;
            border: none
        }
        &.el-table {
            thead th {
                height: 28px;
                background: #F7F9FC;
                font-size: 12px;
                font-weight: bold;
                color: #808080;
            }

            tbody tr td {
                font-size: 12px;
                height: 32px;
                color: #3b3b3b;
                background-color: #fff !important;
            }
            .cell {
                position: relative;
                padding: 0 10px;
                background-color: #fff;
            }
            .el-table__header-wrapper thead div {
                background-color: #F7F9FC;
                color: #808080;
            }
            .el-checkbox__inner {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                &::after {
                    border-width: 1px;
                    height: 8px;
                    left: 4px;
                    top: 0
                }
            }
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
        .user-item:not(:last-child)::after {
            content: '、'
        }
    }
    .flow {
        margin-top: 16px;
        .node-type {
            font-size: 12px;
            color: #A2ABB8
        }
        .user-list > .user-list__item:not(:last-child)::after {
            content: '、'
        }
    }
</style>

