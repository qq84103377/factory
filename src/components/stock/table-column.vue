<template>
    <div class="input-wrap" 
        :style="{ 'borderWidth': !isStorage ? '0' : '1px'}">
        <!--<span>{{currentValue}}</span>-->

        <span
        :class="{'grey': currentNum == 0}"
        v-if="(!isStorage||!isShowAction) && currentValue[skuIdStr]">
            {{ currentNum || 0 }}{{isShowInformNum?'/':''}}<span v-if="isShowInformNum" :class="{'red': (informedQuantity||informedQuantity===0) && (informedQuantity != currentNum)}">{{informedQuantity}}</span>
        </span>
        <input
        v-if="isStorage && isShowAction && currentValue[skuIdStr]"
        class="column-input"
        type="text"
        @input="handleInputValue"
        v-model="currentValue[skuIdStr].num" />
    </div>
</template>

<script>
export default {
    props: {
        lengthItem: {},
        scope: {},
        sizeItem: {},
        skuVal: {},
        isStorage: Boolean,
        isShowAction: {
            type: Boolean,
            default: true
        },
        isShowInformNum: { //是否显示实际数
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    computed: {
        currentValue() {
            return this.skuVal;
        },
        currentNum() {
            return this.currentValue[this.skuIdStr].num;
        },
        informedQuantity() {
            return this.currentValue[this.skuIdStr].informedQuantity;
        },
        skuIdStr() {
            return this.isLength ?
                `${ this.scope.row.id || this.scope.row.styleId}/${this.scope.row.colorId}/${this.sizeItem.sizeId}/${this.lengthItem.standardId}`
                : `${this.scope.row.id || this.scope.row.styleId}/${this.scope.row.colorId}/${this.sizeItem.sizeId}/`;
        },
        isLength() {
            return this.lengthItem
        }
    },
    watch: {
        currentValue(val) {
        }
    },
    methods: {
        handleInputValue() {
            console.log(this.skuIdStr, this.scope.row, this.lengthItem)
            this.$emit('on-input', this.skuIdStr, this.scope.row, this.lengthItem);
        }
    }
}
</script>

<style lang="scss" scoped>
    .input-wrap{
        min-height: 38px;
    }
    .grey {
        color: #c4c6cc
    }
    .red {
        color: red
    }
    input {
        display: block;
        width: 100%;
        padding: 0;
        text-align: center;
        background: transparent;
        box-sizing: border-box;
        height: 38px;
        &:focus {
            // box-sizing: border-box;
            // height: 34px;
            border: 1px solid #ffa914 /*box-shadow: inset 0 -1px 0 0 #e0e6ed; */
            // box-shadow: inset 0 -1px 0 0 #e0e6ed
        }
    }
</style>

