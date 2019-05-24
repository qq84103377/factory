<template>
    <div class="filter">
        <el-row class="filter-form">
            <div class="form-item"
            v-for="(item, index) in formOptions"
            :key="index">
                <label>{{item.label}}</label>
                <el-select 
                v-model="item.model"
                :multiple="item.multiple"
                placeholder="全部">
                    <el-option
                    v-for="options in item.options"
                    :key="options.id"
                    :label="options.value"
                    :value="options.id"></el-option>
                </el-select>
            </div>
            <div class="form-item btn-wrap">
                <button class="filter-btn" @click="handleFilter">筛选</button>
            </div>
        </el-row>
    </div>
</template>

<script>
    import { getFacUnitSettings } from '@/api/api'
    export default {
        data() {
            return {
                formOptions: [
                    {   
                        label: '品牌',
                        key: 'brand',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '设计师',
                        key: 'designer',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '分类',
                        key: 'kind',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '标签',
                        key: 'tag',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '年份',
                        key: 'year',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '季节',
                        key: 'season',
                        model: [],
                        options: [],
                        multiple: true
                    },
                    {   
                        label: '波段',
                        key: 'wave',
                        model: [],
                        options: [],
                        multiple: true
                    }
                ],
                filterForm: {
                    region: ''
                }
            }
        },
        created() {
            this.fetchFacUnitSettings();
        },
        methods: {
            fetchFacUnitSettings() {
                getFacUnitSettings({
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    type: 'all'
                })
                .then(res => {
                    // console.log(res.data)
                    const data = res.data.data;
                    for (let item of this.formOptions) {
                        // console.log(item);
                        if (data.hasOwnProperty(item.key)) {
                            item.options = data[item.key];
                            item.options.unshift(
                                {
                                    id:'NOTHING',
                                    value:'无'
                                }
                            )
                        }
                    }
                })
            },
            handleFilter() {
                this.$emit('on-filter-click', this.formOptions);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .filter-form {
        // padding-top: 24px;
        // padding-right: 32px;
        padding: 24px 32px 8px 0;
        margin-bottom: 16px;
        border-radius: 2px;
        background: #ffffff;
        box-shadow: 0 30px 20px -24px rgba(13, 51, 128, 0.1), 0 3px 10px -3px rgba(13, 51, 128, 0.1);
        // &__bottom {
        //     display: inline-block;
        // }
        .form-item {
            width: 25%;
            float: left;
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            label {
                display: inline-block;
                width: 60px;
                margin-right: 12px;
                color: #3b3b3b;
                text-align: right;
            }
            .el-select {
                flex: 1
            }
            &.btn-wrap {
                justify-content: flex-end
            }
            .filter-btn {
                width: 72px;
                height: 36px;
                color: #ffffff;
                font-size: 14px;
                border-radius: 2px;
                background-color: #54d1bc;
                &:hover {
                    background-color: #6cd9c7
                }
            }
        }
    }
    // .el-form-item {
    //     margin-right: 8px;
    //     &:last-child {
    //         margin: 0
    //     }
    // }
    // // .el-form-item
    // .el-select {
    //     width: 209px;
    // }
    // .btn-wrap {
    //     float: right;
    //     .filter-btn {
    //         width: 72px;
    //         height: 36px;
    //         color: #ffffff;
    //         font-size: 14px;
    //         border-radius: 2px;
    //         background-color: #54d1bc;
    //     }
    // }
</style>
