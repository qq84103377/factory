<template>
    <ul class="filter-check-group">
        <slot></slot>
    </ul>
</template>

<script>
export default {
    props: {
        value: '',
        multiple: Boolean
    },
    computed: {
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
                this.$emit('change', val);
            }
        }
    },
    methods: {
        handleItemClick(option) {
            if (this.multiple) {
                let value = [].slice.call(this.currentValue);
                const index = value.indexOf(option.value);
                if (index > -1) {
                    value.splice(index, 1);
                }
                else {
                    value.push(option.value);
                }
                this.currentValue = value;
            }
            else {
                this.currentValue = option.value;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .filter-check-group {
        margin: 0;
        padding: 0;
        margin-left: -8px;
        margin-bottom: 1px;
        display: inline-block;
        vertical-align: middle;
    }
</style>
