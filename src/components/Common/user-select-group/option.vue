<template>
    <li class="user-select__option" >
        <slot></slot>
    </li>
</template>

<script>
    export default {
        props: {
            label: '',
            value: ''
        },
        methods: {
            
        },
        computed: {
            parent() {
                let parent = this.$parent;
                while(parent && parent.$options.componentName !== 'UserSelectGroup') {
                    parent = parent.$parent;
                }
                return parent;
            },
            // itemActive() {
            //     return this.parent.cacheOption.indexOf(this.value) > -1;
            // }
        }, 
        created() {
            this.parent.cacheOptions.push(this);
        }
    } 
</script>

<style lang="scss" scoped>
    
</style>
