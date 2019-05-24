<template>
    <div class="relate-order-select">
        <el-select
                :loading="loading"
                @change="handleChange"
                v-model="value"
                filterable
                clearable
                :multiple="multiple"
                placeholder="">
            <el-option v-for="item in orderList" :key="item.id" :label="item.name"
                       :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import {orderNosByStyleId} from '@/api'
    export default {
        props: ['value','multiple','goodsId'],
        data() {
            return {
                orderList: [],
                loading: false
            }
        },
        created() {
            this.getOrderList()
        },
        watch: {
            goodsId() {
                this.getOrderList()
            }
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem('last_login')).id
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        methods: {
            handleChange() {
                this.$emit('input', this.value) //默认只回传商品styleId给v-model
            },
            // 获取单据号下拉列表
            getOrderList() {
                this.loading = true
                orderNosByStyleId({styleId:this.goodsId}).then(res => {
                    this.loading = false
                    this.orderList = res.data.data
                    if(this.orderList.length===1) {
                        this.value = this.orderList[0].id
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
    .relate-order-select{
        .el-input__inner{
            border: none;
        }
    }
</style>