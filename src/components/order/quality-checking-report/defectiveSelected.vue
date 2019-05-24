<template>
    <div class="defective-label" v-show="activeIndex === 1 && defectiveLabelList.length">
        <p class="defective-label-title">选择次品标签</p>
        <div class="defective-label-wrap">
            <!-- <item-base class="defective-label-item" @click.native="handleCancelSelect"> -->
                <!-- 不选择
            </item-base> -->
            <item-base class="defective-label-item"
            v-for="item in options"
            :key="item.id"
            :class="{'is-active': itemActive(item)}"
            @click.native="handleItemClick(item)">{{ item.labelName }}</item-base>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: '',
        options: {
            type: Array,
            default: []
        }
    },
    computed: {
        currentValue: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    methods: {
        handleItemClick(item) {
            const fIndex = this.currentValue.indexOf(item.id);
            if (fIndex > -1) {
                this.currentValue.splice(fIndex, 1);
                return
            }
            this.currentValue.push(item.id);
        },
        itemActive(item) {
            return this.value.indexOf(item.id) > -1;
        }
    }
}
</script>

<style lang="scss" scoped>
     .defective-label {
        width: 100%;
        margin-top: 24px;
        .defective-label-title {
            color: #a2abb8;
            font-size: 12px;
        }
        .defective-label-item {
            margin-top: 8px;
            margin-right: 8px;
            cursor: pointer;
            &.is-active {
                background: #fff;
                color: #ff7f14;
                border: 1px solid #ff7f14;
            }
        }
    }
</style>
