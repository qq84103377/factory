<template>
    <input class="hand-input--inner" type="number" v-model="onceValue" @input="handleInput" />
</template>

<script>
export default {
    componentName: 'NfSkuTableOnceInput',
    props: {
        skuVal: {},
        lengthItem: {},
        colorItem: {},
        isShowLength: Boolean,
        isAdjust: Boolean
    },
    data() {
        return {
            onceValue: ''
        }
    },
    computed: {
        color_id() {
            return this.colorItem && this.colorItem.color_id;
        },
        standard_id() {
            return this.lengthItem.standard_id;
        }
    },
    created() {
        this.$on('sku.table.once.input.initFn', this.initInput);
    },
    beforeDestroy() {
        this.$off('sku.table.once.input.initFn');
    },
    methods: {
        handleInput() {
            if(!this.isAdjust) {
                // this.onceValue = this.onceValue.replace(/^[0|-]/, '');
                this.onceValue = this.onceValue.replace(/[^(\-?)\d+]/, '');
            }
            this.setSkuData(this.onceValue);
        },
        setSkuData(value) {
            Object.keys(this.skuVal).forEach(key => {
                if (this.isShowLength && key.indexOf(this.color_id) > -1 && key.indexOf(this.standard_id) > -1) {
                    this.skuVal[key].num = value;
                    return;
                }
                if (!this.isShowLength && key.indexOf(this.color_id) > -1) {
                    this.skuVal[key].num = value;
                }
            });
        },
        initInput() {
            this.onceValue = ''
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>

