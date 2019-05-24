<template>
    <ul>
        <li v-for="(item, index) in list" :key="index">
            <span class="inner-text" v-if="!editable">{{ renderText(item)}}</span>
            <span v-if="icon" class="input-icon">￥</span>
            <input
                v-if="editable"
                class="inner-text"
                :style="{'padding-left': icon ? '0' : '10px'}"
                type="number"
                v-model="item[prop]"
                placeholder="请输入">
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        prop: '',
        list: [],
        icon: Boolean,
        editable: Boolean
    },
    filters:{
    },
    watch:{
        list:{
            handler(val,old) {
                // console.log(val);
                let sum = 0;
                for(let i = 0;i<val.length;i++){
                    sum+=val[i].quantity;
                }
                this.$emit('listChange',sum);
            },
            deep:true
        }
    },
    methods: {
        renderText(item) {
            return item[this.prop] || '';
        }
    }
}
</script>

<style scoped lang="scss">
    ul {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        li {
            position: relative;
            display: flex;
            text-align: center;
            line-height: 32px;
            height: 32px;
            font-size: 12px;
            &:not(:last-child) {
                border-bottom: 1px solid #E6EAF0;
            }
            .inner-text {
                flex: 1
            }
            input {
                width: 100%;
                padding: 0 10px;
                display: block;
                font-size: 12px;
                box-sizing: border-box;
                background: #F7F9FC
            }
            .input-icon {
                padding-left: 10px;
                background: #F7F9FC;
            }
        }
    }
</style>
