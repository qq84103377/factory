<template>
        <el-select
                @change="handleChange"
                v-model="value"
                filterable
                clearable
                placeholder="全部">
            <el-option v-for="item in customerList" :key="item.id" :label="item.name"
                       :value="item.id">
            </el-option>
        </el-select>
</template>

<script>
    import {selectFacCustomer} from '@/api'
    export default {
        props: ['value'],
        data() {
            return {
                customerList: [],
            }
        },
        created() {
            this.fetchCustomerList()
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        methods: {
            handleChange() {
                this.$emit('input', this.value) //默认只回传商品styleId给v-model
            },
            // 获取客户列表
            fetchCustomerList() {
                selectFacCustomer({
                    facId: this.facId,
                    pageNo: 1,
                    sortType: 0,
                    needAll: true
                }).then(res => {
                    this.customerList = res.data.goods || [];
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>