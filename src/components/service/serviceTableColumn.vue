<template>
    <div class="cell">
        <!-- 内长存在 -->
        <span class="sku-val"
        v-if="tableVal[skuIdStr] && !isEdit && !isShowNum">
            <i>{{ currentFinishNum }}</i><i v-if="!isNode">/{{ currentNum }}</i>
        </span>
        <span class="sku-val"
        v-if="tableVal[skuIdStr] && isShowNum && !isEdit">
            <i>{{ currentNum }}</i>
        </span>
        <input type="number"
        v-if="tableVal[skuIdStr] && isEdit"
        v-model="tableVal[skuIdStr].num"
        @input="handleChange"/>
    </div>
</template>

<script>
export default {
    props: {
        colorItem: {},
        sizeItem: {},
        lengthItem: {},
    },
    computed: {
        currentNum() {
            return this.tableVal[this.skuIdStr].num;
        },
        currentFinishNum() {
            return this.tableVal[this.skuIdStr].finishNum;
        },
        skuIdStr() {
            return this.isLengths ? `${this.colorItem.id}-${this.sizeItem.id}-${this.lengthItem.id}` : `${this.colorItem.id}-${this.sizeItem.id}`
        },
        isLengths() {
            return this.lengthItem;
        },
        isShowNum() {
            return this.parent.isShowNum
        },
        isEdit() {
            return this.parent.isEdit
        },
        isNode() {
            return this.parent.isNode;
        },
        tableVal: {
            get() {
                return this.parent.tableVal;
            },
            set() {

            }
        },
        parent() {
            const result = this.$parent;
            return result;
        }
    },
    methods: {
        handleChange() {
            if (this.tableVal[this.skuIdStr].num < 0) this.tableVal[this.skuIdStr].num = 0;
            this.$emit('on-input', this.skuIdStr)
        }
    }
}
</script>

<style lang="scss" scoped>
    .sku-val,
    input {
        display: block;
        width: 100%;
        height: 36px;
        line-height: 36px;
    }
    input {
        display: block;
        width: 90px;
        padding: 0;
        text-align: center;
        font-size: 14px;
        border: none;
        // box-sizing: border-box;
        // border: 1px solid transparent;
        &:focus {
            border: 1px solid #ff8d37;
            box-sizing: border-box;
            // box-shadow: 0 0px 1px 0px #ff8d37 inset;
        }
    }
</style>

