<template>
    <input class="hand-input--inner" type="number" @input="handleInput" v-model="skuVal[_key].num" />
</template>

<script>
export default {
    props: {
        skuVal: {},
        lengthItem: {},
        sizeItem: {},
        colorItem: {},
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
        }
    },
    methods: {
        handleInput() {
            const value = this.skuVal[this._key].num;
            this.skuVal[this._key].num = this.skuVal[this._key].num.replace(/^[0|-]/, '');
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>

