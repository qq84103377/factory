<template>
    <section class="template-list">
        <div class="template-item" v-for="(item, index) of listData" :key="index">
            <el-row
                class="template-item__header"
                type="flex">
                <icon type="icon-nodetemplate" w="24" h="18"></icon>
                <div class="template-item__header--center">
                    <h4>{{ item.templateName }}</h4>
                    <div class="template-item__header__info">
                        <span>节点：{{ item.nodes.length }}</span>
                        <span class="template-item__header__user">
                            默认负责人:
                            <i class="user-item" v-for="user of item.chargers" :key="user.id">{{ user.name }}</i>
                        </span>
                    </div>
                </div>
                <nf-button @click="viewDetail(item)">模板详情 ></nf-button>
            </el-row>
            <el-row
                class="template-item__body">
                <ul class="steps">
                    <li class="step-item" v-for="(nodeItem, nodeIndex) of item.nodes" :key="nodeItem.templateNodeId">
                        <el-popover
                            placement="bottom"
                            width="220"
                            trigger="hover">
                            <!-- slot-content -->
                            <div class="popver-content">
                                <div class="popver-content__header">
                                    <h4>{{ nodeItem.templateNodeName }}</h4>
                                    <p class="node-type">{{ nodeItem.templateNodeTypeName }}</p>
                                </div>
                                <el-row class="popver-content__detail">
                                    <el-col :span="24" class="popver-content__detail__wrap">
                                        <el-col :span="12">
                                            <p class="popver-content__detail--label">默认负责人</p>
                                            <p class="user-list">
                                                <i 
                                                    class="user-list__item"
                                                    v-for="user of nodeItem.chargers"
                                                    :key="user.id">{{ user.name }}</i>
                                                {{ renderEmptyText(nodeItem.chargers) }}
                                            </p>
                                        </el-col>
                                        <!--<el-col :span="12">-->
                                            <!--<p class="popver-content__detail&#45;&#45;label">提交人</p>-->
                                            <!--<p class="user-list">-->
                                                <!--<i -->
                                                    <!--class="user-list__item"-->
                                                    <!--v-for="user of nodeItem.submitters"-->
                                                    <!--:key="user.id">{{ user.name }}</i>-->
                                                <!--{{ renderEmptyText(nodeItem.submitters) }}-->
                                            <!--</p>-->
                                        <!--</el-col>-->
                                        <el-col :span="12">
                                            <p class="popver-content__detail--label">默认负责组</p>
                                            <p class="user-list">

                                                {{ nodeItem.group?nodeItem.group.groupName:'未设置' }}
                                            </p>
                                        </el-col>
                                    </el-col>
                                    <el-col :span="24" class="popver-content__detail__wrap">
                                        <el-col :span="12">
                                            <p class="popver-content__detail--label">默认结束时间</p>
                                            <p>{{nodeItem.dafd ? `交货前  ${nodeItem.dafd} 天` : '未设置' }}</p>
                                        </el-col>
                                        <el-col :span="12">
                                            <p class="popver-content__detail--label">评审人</p>
                                            <p class="user-list">
                                                <i 
                                                    class="user-list__item"
                                                    v-for="user of nodeItem.reviewers"
                                                    :key="user.id">{{ user.name }}</i>
                                                {{ renderEmptyText(nodeItem.reviewers) }}
                                            </p>
                                        </el-col>
                                    </el-col>
                                    <el-col :span="24" class="popver-content__detail__wrap">
                                        <p class="popver-content__detail--label">节点提醒</p>
                                        <p>{{nodeItem.delayWarningNum ? `延期预警：结束前   ${nodeItem.delayWarningNum} 天` : '未设置' }}</p>
                                        <!-- <p>延期预警：结束前 {{ nodeItem.delayWarningNum }} 天</p> -->
                                    </el-col>
                                </el-row>
                            </div>
                             <!-- slot-content--end -->
                            <div slot="reference">
                                <div class="step-item__header">
                                    <icon type="icon-gongxu_jiedian" w="20" h="20" />
                                </div>
                                <div class="step-item__text">
                                    <p>{{ nodeItem.templateNodeName }}</p>
                                </div>
                            </div>
                        </el-popover>
                    </li>
                </ul>
            </el-row>
        </div>
    </section>
</template>

<script>
    import { getDesignTemplateList } from '@/api/sample-centre';
    export default {
        data() {
            return {
                listData: []
            };
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId
            }
        },
        created() {
            this.fetchTemplateList();
        },
        methods: {
            fetchTemplateList() {
                getDesignTemplateList({ unitId: this.unitId })
                .then(res => {
                    this.listData = res.data.data;
                });
            },
            viewDetail(item) {
                this.$router.push({
                    path: '/design/template/detail',
                    query: {
                        templateId: item.templateId
                    }
                })
            },
            renderEmptyText(arr) {
                return arr.length ? '' : '未设置'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .template-list {
        margin-top: 12px;
    }
    .template-item {
        margin-bottom: 12px;
        background: #fff;
        border-radius: 2px;
        box-shadow:0px 6px 10px -3px rgba(13, 51, 128, .05);
        &__header {
            padding: 18px;
            border-bottom: 1px solid #E6EAF0;
            &--center {
                flex: 1;
                margin: 0 8px;
            }
            &__info {
                margin-top: 8px;
                font-size: 12px;
                color: #A2ABB8
            }
            &__user {
                margin-left: 16px;
                .user-item:not(:last-child)::after {
                    content: '、'
                }
            }
        }
        &__body {
            padding: 18px;
        }
    }
    .steps {
        font-size: 0;
        .step-item {
            display: inline-block;
            font-size: 12px;
            width: 140px;
            text-align: center;
            cursor: pointer;
            &__header {
                position: relative;
                padding: 0 16px;
                &::before,
                &::after {
                    position: absolute;
                    top: 50%;
                    display: block;
                    content: '';
                    height: 2px;
                    opacity: .1;
                    background: #1CA1FF;
                    transform: translateY(-50%);
                }
                &::before {
                    right: 50%;
                    left: 0;
                }
                &::after {
                    left: 50%;
                    right: 0%;
                }
            }
            &:first-child .step-item__header::before {
                display: none;
            }
            &:last-child .step-item__header::after {
                display: none;
            }
            &__text {
                padding: 0 16px;
                margin-top: 4px;
                font-size: 12px;
            }
        }
    }
    .popver-content {
        line-height: 18px;
        h4 {
            font-size: 14px;
        }
        &__detail {
            font-size: 12px;
            &__wrap {
                margin: 8px 0;
            }
            &--label {
                color: #A2ABB8;
            }
            .user-list > .user-list__item:not(:last-child)::after {
                content: '、'
            }
        }
    }
</style>
