<template>
    <div class="collapse">
        <el-row
            class="record-item__head"
            type="flex"
            justify="space-between">
            <div class="record-item__head-right">
                <icon w="24" h="24" type="icon-gongdan-caozuo" />
                <p class="record-item__head-con">{{ logItem.message }}</p>
            </div>
            <div class="record-item__head-left">
                <div class="is-hover">
                    <span class="record-item__head-time">{{ logItem.dateCreated }}</span>
                    <div class="record-item__head-handle">
                        <!-- <icon-button>取消</icon-button> -->
                        <icon-button class="btn-cancel" @click.stop="handleCancel">撤销</icon-button>
                    </div>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        logItem: {}
    },
    data() {
        return {
            isCollapse: true
        }
    },
    methods: {
        handleCancel() {
            this.$emit('on-cancel', this.logItem.logId);
        }
    }
}
</script>

<style lang="scss" scoped>
$color-desc: #a2abb8;
.collapse {
    padding: 20px 16px;
    margin-bottom: 8px;
    background: #fcfcfc;
    border: solid 1px #f2f2f2
}
.record-item {
    &__head {
        line-height: 24px;
        &-con {
            display: inline-block;
            margin-left: 4px;
        }
        &-time {
            color: $color-desc;
            margin-right: 5px;
        }
        &-handle {
            display: none;
            margin-right: 5px;
        }
        &-left {
            flex-shrink: 1;
            .is-hover {
                display: inline-block;
                min-width: 140px;
                text-align: right;
                &:hover {
                    .record-item__head-handle {
                        display: inline-block;
                    }
                    .record-item__head-time {
                        display: none;
                    }
                }
            }
            .btn-cancel {
                color: #1ca1ff;
            }
        }
    }
}
</style>
