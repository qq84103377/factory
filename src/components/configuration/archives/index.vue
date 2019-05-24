<template>
    <div class="archives_List">
        <!--属性库标题-->
        <section class="inventory">
            <el-row
                    class="inventory-header"
                    type="flex"
                    justify="space-between"
                    align="middle">
                <div class="inventory-tab">
                    <div class="inventory-tab__pane" :class="{'active': $route.path === '/archives'}">
                        属性库
                    </div>
                </div>
            </el-row>
        </section>
        <!--搜索框-->
        <div class="archives_content">
            <section class="mat-inventory">
                <el-row
                        class="mat-middle"
                        justify="space-between"
                        align="middle">
                    <div class="middle__left">
                        <span class="archives_span">
                            <icon type="icon-tips"></icon>
                            属性库作为基础属性数据，可用于配置资料档案中不同对象的属性。
                        </span>
                    </div>
                    <div class="middle__right">
                        <el-input
                                class="search-input_right"
                                placeholder="输入属性名称搜索"
                                icon="search"
                                v-model.trim="input"
                                @input='getDataList'>
                        </el-input>
                    </div>
                </el-row>
            </section>
        </div>
        <!--表格-->
        <archives-table :input="input"></archives-table>
    </div>
</template>

<script>
    import archivesTable from './archives-table';

    export default {
        name: "index",
        data() {
            return {
                input: '',//输入属性名称搜索
            }
        },
        created() {

        },
        components: {
            archivesTable,
        },
        methods: {}
    }
</script>

<style lang="scss" scoped>
    .archives_List {
        font-size: 12px;
        .inventory {
            width: 100%;
            .inventory-header {
                line-height: 50px;
                border-bottom: 1px solid #e0e6ed;
                .inventory-tab {
                    flex: 1;
                    margin-bottom: -1px;
                    &__pane {
                        display: inline-block;
                        padding: 0 16px;
                        font-size: 20px;
                        color: #a2abb8;
                        cursor: pointer;
                    }
                    .active {
                        border-bottom: 4px solid #ffa914;
                        color: #3b3b3b;
                    }
                }
            }
        }
        .archives_content {
            height: 52px;
            padding-top: 14px;
            padding-bottom: 10px;
        }

        .mat-inventory {
            width: 100%;
            .mat-middle {
                margin-bottom: 16px;
                .archives_span {
                    width: 400px;
                    height: 28px;
                    float: left;
                    display: inline-block;
                    color: #A2ABB8;
                    background-color: #fff;
                    line-height: 28px;
                }
                .search-input_right {
                    float: right;
                    width: 320px;
                }
                .in-btn {
                    margin-right: 14px;
                    color: #23c811;
                    border: 1px solid #23c811;
                    background: #e4f8e2;
                    &:hover {
                        background: #c7f1c3;
                        border-color: #23c811;
                    }
                }
                .out-btn {
                    color: #ffa914;
                    border: 1px solid #ffa914;
                    background: #fff4e2;
                    &:hover {
                        background: #ffe9c4;
                        border-color: #ffa914;
                    }
                }
            }
        }

    }
</style>
<style lang="scss">
    .archives_List {
        .el-table th {
            font-size: 12px;
            height: 28px;
            line-height: 28px;
            .cell {
                color: #808080;
            }
        }
        .el-table td {
            padding: 0;
            font-size: 12px;
            height: 26px;
            line-height: 26px;
            .cell {
                color: #3B3B3B;
            }

        }
        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #f7f9fc;
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td .archives_tr
        .el-table .cell, .el-table th > div {
            padding-left: 10px;
        }
        .search-input_right {
            .el-input__icon {
                cursor: pointer;
            }
        }
    }

</style>