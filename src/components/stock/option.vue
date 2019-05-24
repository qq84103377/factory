<template>
    <li class="nf-select__item"
    @click="handleClick"
    :class="{'nf-select__active': itemActive}">
        <span>{{ label || value }}</span>
    </li>
</template>

<script>
    import Emitter from './mixins'
    export default {
        mixins: [Emitter],
        props: {
            value: {},
            label: {}
        },
        computed: {
            itemActive() {
                return this.parent.value.indexOf(this.value) > -1
            },
            parent() {
                let result = this.$parent;
                while (!result.isSelect) {
                result = result.$parent;
                }
                return result;
            },
        },
        methods: {
           handleClick() {
               this.dispatch('FilterSelect', 'handleOptionClick', this)
           } 
        }
    }
</script>

<style lang="scss" scoped>
    
</style>

