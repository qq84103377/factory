<template>
    <li
        class="filter-check__item"
        :class="{'is-active': itemActive}"
        @click="itemClick">{{ label }}</li>
</template>

<script>
export default {
    props: {
        label: '',
        value: ''
    },
    computed: {
        itemActive() {
            if (this.isMultiple) {
                return this.$parent.currentValue.indexOf(this.value) > -1;
            }
            return this.$parent.currentValue === this.value;
        },
        isMultiple() {
            return this.$parent.multiple;
        }
    },
    methods: {
        itemClick() {
            this.$parent.handleItemClick(this)
        }
    }
}
</script>

<style lang="scss" scoped>
    .filter-check__item {
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        width: 64px;
        height: 28px;
        margin-left: 8px;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px dashed #E6EAF0;
        &.is-active {
            color: #FFA914;
            border-color: #FFA914;
            border-style: solid;
        }
    }
</style>
