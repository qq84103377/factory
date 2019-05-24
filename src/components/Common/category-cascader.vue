<template>
    <div class="category">
        <el-cascader
                clearable
                change-on-select
                :options="options"
                v-model="category"
                class="group-cascader"
                @change="handleChange">
        </el-cascader>
    </div>
</template>

<script>
    export default {
        name: "category-cascader",
        props:['category','options'],
        /********
         *
         * category 品类值
         * options 品类下拉
         *
         * *******/
        data() {
            return{
                categoryCopy: [],
            }
        },
        watch:{
            category: {
                handler() {
                    this.backupsData();
                },
                deep: true
            },
        },
        methods:{
            handleChange(value) {
                this.$emit('update:category', value);
                this.$emit('categoryChange', value, this.categoryCopy);
                this.categoryCopy = value;
            },
            //备份品类数据
            backupsData(){
                this.categoryCopy = [...this.category];
            }
        },
        created(){
            this.backupsData();
        },
    }
</script>

<style lang="scss">
    .category{
        .group-cascader{
            .el-cascader__label{
                font-size: 12px;
            }
        }
    }
    .el-cascader-menu__item{
        font-size: 12px;
    }
</style>
