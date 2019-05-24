<template>
    <ul class="filter-check-group">
        <slot></slot>
    </ul>
</template>

<script>
export default {
    data(){
        return{
            flag:false,
        }
    },
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
            // console.log(this.currentValue);

        },
        handleAllItemClick(option,allList){
            let value = [].slice.call(this.currentValue);
            let len = 0;
            if(option.label =='全部'){
                if(this.currentValue.length===allList.length){
                    this.currentValue =[]
                }else{
                    allList.forEach(v => {
                        const index = value.indexOf(v.id);
                        if (index > -1) {
                            len++;
                        }
                        else {
                            value.push(v.id);
                        }
                    });
                    this.currentValue = value;
                }

            }
            // console.log("搞定之后已经选中的：",this.currentValue);

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
