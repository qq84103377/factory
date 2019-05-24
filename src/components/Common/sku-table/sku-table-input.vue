<template>
        <input
                class="hand-input--inner"
                type="number"
                :placeholder="uncompleted"
                @input="handleInput"
                v-model="skuVal[_key].num"
        />
</template>

<script>
export default {
    props: {
        skuVal: {},
        lengthItem: {},
        sizeItem: {},
        colorItem: {},
        isShowLength: Boolean,
        isAdjust: Boolean
    },
    data(){
        return {
            uncompleted: ''     //未上报数量
        }
    },
    watch:{
        skuVal(){
            this.doComplete();
        }
    },
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
        }
    },
    methods: {
        handleInput() {
            const value = this.skuVal[this._key].num;
            if(!this.isAdjust){
                // this.skuVal[this._key].num = this.skuVal[this._key].num.replace(/^[0|-]/, '');
                this.skuVal[this._key].num = this.skuVal[this._key].num.replace(/[^(\-?)\d+]/, '');
            }
        },
        //计算未完成数
        doComplete() {
            let currentNum = this.skuVal[this._key].currentNum;
            let totalNum = this.skuVal[this._key].totalNum;
            if(totalNum >= 0){
                let num = totalNum - currentNum;
                if(num > 0){
                    this.uncompleted = `未报${num}`;
                }else{
                    this.uncompleted = "未报0";
                }
            }
        },
    },
    created(){
        this.doComplete();
    }
}
</script>

<style lang="scss" scoped>
    
</style>

