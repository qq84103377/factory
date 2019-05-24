<template>
    <p
        class="size__value"
        :class="{'is-ongoing': isOngoing, 'is-finish': isFinish}">
        {{renderText}}
        <i v-if="showExceedNum && excessNum" class="exceed-num">(超{{excessNum}})</i>
    </p>
</template>

<script>
export default {
    props: {
        skuVal: {},
        lengthItem: {},
        sizeItem: {},
        colorItem: {},
        showNum: Boolean,
        isShowLength: Boolean,
        submatrixFlag:String,
        showExceedNum:Boolean,
    },
    /****************
     *
     * submatrixFlag: 1.submatrixFlag==‘no_show_targets’的时候=>表示外发厂子矩阵不显示目标数 2.submatrixFlag==‘show_targets’的时候=>表示外发厂子矩阵显示目标数
     * showExceedNum: 超额标识，显示超额数
     *
     * ******************/
    computed: {
        _key() {
            let _key;
            if (!this.isShowLength) {
                // 无内长是key
                _key = `${this.colorItem.color_id}-${this.sizeItem.size_id}`;
            }
            else {
                // 有内长是key
                _key = `${this.colorItem.color_id}-${this.sizeItem.size_id}-${this.lengthItem.standard_id}`;
            }
            return _key;
        },
        //目标数
        currentNum() {
            return this.skuVal[this._key].num;
        },
        //完成数
        currentFinishNum() {
            return this.skuVal[this._key] && this.skuVal[this._key].finishNum;
        },
        //超额数
        excessNum(){
            return this.skuVal[this._key].excessNum;
        },
        renderText() {
            // 只显示目标数
            if (this.showNum) {
                return this.currentNum||0;
            }
            //submatrixFlag==‘show_targets’的时候=>表示外发厂子矩阵显示目标数
            else if(this.submatrixFlag ==='show_targets'){
                return `${this.currentFinishNum||0}/${this.currentNum||0}`;
            }
            //submatrixFlag==‘no_show_targets’的时候=>表示外发厂子矩阵不显示目标数
            else if (this.submatrixFlag ==='no_show_targets') {
                return `${this.currentFinishNum||0}`;
            }
            // 1.当非外发厂子矩阵中
            // 2.由于在节点正常上报也调用同个组件，所以只可以在条件成立的时候执行相对的操作，不要使用if/else
            // 上面两种情况  =>是要正常按照“完成数”/“目标数”
            return  `${this.currentFinishNum||0}/${this.currentNum||0}`;
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
    .exceed-num{
        color: #f03535;
    }
</style>

