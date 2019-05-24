<template>
    <p class="size__value" :class="{'is-ongoing': isOngoing, 'is-finish': isFinish}">{{renderText}}</p>
</template>

<script>
export default {
    props: {
        skuVal: {},
        lengthItem: {},
        sizeItem: {},
        colorItem: {},
        showNum: Boolean,
        isShowLength: Boolean
    },
    computed: {
        _key() {
            let _key;
            if (!this.isShowLength) {
                // 无内长是key
                _key = `${this.colorItem.color_id}-${this.sizeItem.size_id}-${this.colorItem.uid}`;
            }
            else {
                // 有内长是key
                _key = `${this.colorItem.color_id}-${this.sizeItem.size_id}-${this.lengthItem.standard_id}-${this.colorItem.uid}`;
            }
            return _key;
        },
        currentNum() {
            return this.skuVal[this._key].num;
        },
        currentFinishNum() {
            return this.skuVal[this._key] && this.skuVal[this._key].finishNum;
        },
        renderText() {
            if (this.showNum) {
                return this.currentNum||0;
            }
            return `${this.currentFinishNum||0}/${this.currentNum||0}`;
        },
        isOngoing() {
            return this.currentNum >= 0 && this.currentFinishNum > 0 && this.currentFinishNum < this.currentNum;
        },
        isFinish() {
            return this.currentNum > 0 && this.currentFinishNum > 0 && (this.currentFinishNum === this.currentNum || this.currentFinishNum > this.currentNum);
        }
    }
}
</script>

<style lang="scss" scoped>
    .is-ongoing {
        background: #f0f6fc;
    }
    .is-finish {
        background: #eefceb;
    }
</style>

