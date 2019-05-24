<template>
    <el-row class="record-item__content content">
        <div class="content__table">
            <!-- <p class="content__table-title">合格品：40 件</p> -->
            <div class="content__table-body">
                <nf-sku-table
                    style="margin-top: 16px;"
                    :metadatas="metadatas"
                    :quantities="quantities"
                    show-num>
                </nf-sku-table>
                <!-- <service-table
                    v-if="tableData.colors && tableData.colors.length"
                    :tableData="tableData"
                    :isNode="true"
                    :skuVal="skuVal"></service-table> -->
            </div>
        </div>
        <!-- <div class="content__head">
            <span>完成人员：{{ logItem.chargerName }}</span>
            <span class="content__time">完成日期：{{ logItem.dateCompleted }}</span>
            <span class="content__user--cancel" v-if="logItem.status">{{ logItem.undoerName }}</span>
        </div> -->
        <!-- <el-row
        style="display: none"
        class="edit-record"
        type="flex"
        justify="space-between">
            <span>修改记录</span>
            <i class="el-icon-arrow-down"
            :class="{'is-rotate': !isCollapse}"
            @click="isCollapse = !isCollapse"></i>
        </el-row>
        <div v-show="!isCollapse">
            <div class="content__table">
                <div class="content__table-body">
                    <service-table
                        v-if="tableData.colors && tableData.colors.length"
                        :tableData="tableData"
                        :isNode="true"
                        :skuVal="skuVal"></service-table>
                </div>
            </div>
            <div class="content__table">
                <el-row
                type="flex"
                align="center"
                justify="space-between">
                    <p class="content__table-title">刘伟：将此上报记录数量修改为 1200</p>
                    <p class="content__table-title time">2016.04.24  17:32</p>
                </el-row>
                <div class="content__table-body">
                    <service-table
                        v-if="tableData.colors && tableData.colors.length"
                        :tableData="tableData"
                        :isNode="true"
                        :skuVal="skuVal"></service-table>
                </div>
            </div>
        </div> -->
    </el-row>
</template>

<script>
    export default {
        props: {
            metadatas: [],
            quantities: [],
            logItem: {}
        },
        data() {
            return {
                isCollapse: true
            }
        },
        components: {
        }
    }
</script>

<style lang="scss" scoped>
    .edit-record {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e1e5eb;
        .el-icon-arrow-down {
            color: #a2abb8;
            transition: transform .3s;
            &.is-rotate {
                transform: rotate(-180deg);
            }
        }
    }
    .content {
        &__head {
            color: #808080
        }
        &__time,
        &__user--cancel {
            margin-left: 32px;
        }
        &__user--cancel {
            color: #fa4150;
        }
        &__table {
            &-title {
                color: #808080;
                margin-top: 12px;
                margin-bottom: 8px;
            }
        }
    }
</style>
