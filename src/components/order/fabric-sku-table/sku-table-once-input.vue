<template>
    <input class="hand-input--inner" type="number" v-model="onceModel[modelKey].storeyQuantity" @input="handleInput" />
</template>

<script>
export default {
    componentName: 'NfSkuTableOnceInput',
    props: {
        skuVal: {},
        lengthItem: {},
        colorItem: {},
        onceModel: {},
        isShowLength: Boolean
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
        },
        uid() {
            return this.colorItem && this.colorItem.uid;
        },
        modelKey() {
            return this.isShowLength ? `${this.color_id}-${this.standard_id}-${this.uid}` : `${this.color_id}-${this.uid}`;
        }
    },
    created() {
        this.$on('sku.table.once.input.initFn', this.initInput);
    },
    methods: {
        handleInput() {
            const reg = /\D/g;
            // if (reg.test(this.onceValue)) {
            //     this.$message.error('输入数据必须为整数');
            //     return;
            // }
            this.onceModel[this.modelKey].storeyQuantity = this.onceModel[this.modelKey].storeyQuantity.replace(/^[0|-]/, '');
            this.setSkuData(this.onceModel[this.modelKey].storeyQuantity);
        },
        setSkuData(value) {
            Object.keys(this.skuVal).forEach(key => {
                const uid = key.substr(key.lastIndexOf('-') + 1);
                if (this.isShowLength && key.indexOf(this.color_id) > -1 && key.indexOf(this.standard_id) > -1 && this.uid == uid) {
                    this.skuVal[key].storeyQuantity = value; // 记录层数
                    return;
                }
                if (!this.isShowLength && key.indexOf(`${this.color_id}`) > -1 && this.uid == uid) {
                    this.skuVal[key].storeyQuantity = value;
                }
            });
        },
        initInput() {
            this.currentValue = ''
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>

