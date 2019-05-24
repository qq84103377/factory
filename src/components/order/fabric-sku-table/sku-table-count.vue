<template>
    <p class="size__value">{{renderText}}</p>
</template>

<script>
export default {
    componentName: 'NfSkuTableOnceInput',
    props: {
        skuVal: {},
        lengthItem: {},
        colorItem: {},
        isShowLength: Boolean
    },
    data() {
        return {
            onceValue: ''
        }
    },
    computed: {
        renderText() {
            return Object.keys(this.skuVal).reduce((num, key) => {
                if (this.isShowLength && key.indexOf(this.color_id) > -1 && key.indexOf(this.standard_id) > -1) {
                    num += Number(this.skuVal[key].num);
                }
                if (!this.isShowLength && key.indexOf(this.color_id) > -1) {
                    num += Number(this.skuVal[key].num);
                }
                return num;
            }, 0);
        },
        color_id() {
            return this.colorItem && this.colorItem.color_id;
        },
        standard_id() {
            return this.lengthItem.standard_id;
        }
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
    p {
        background-color: #F5F7FA;
    }
</style>

