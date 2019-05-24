<template>
        <el-select
                :loading="loading"
                @change="handleChange"
                v-model="value"
                filterable
                clearable
                :multiple="multiple"
                placeholder="全部">
            <el-option v-for="item in stockNoList" :key="selectType=='notice'?item.stockInformId:item.id" :label="item.orderNo"
                       :value="selectType=='notice'?item.stockInformId:item.id">
            </el-option>
        </el-select>
</template>

<script>
    import {getOrderNos,stockInformListId} from '@/api'
    export default {
        props: ['value','storehouseId','multiple','selectType'], // selectType 搜索类型    send档口发货单 notice库存通知单
        data() {
            return {
                stockNoList: [],
                loading: false
            }
        },
        activated() {
            if(this.storehouseId) this.fetchstockOrderList()
        },
        created() {
            if(this.storehouseId) this.fetchstockOrderList()
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        watch: {
            storehouseId(v) {
                if(v) this.fetchstockOrderList()
            },
            selectType() {
                if(this.storehouseId) this.fetchstockOrderList()
            }
        },
        methods: {
            handleChange() {
                this.$emit('input', this.value) //默认只回传商品styleId给v-model
            },
            // 获取单据号下拉列表
            fetchstockOrderList() {
                    this.loading = true
                if(this.selectType=='notice') {
                    stockInformListId({storehouseId:this.storehouseId}).then(res => {
                        this.loading = false
                        this.stockNoList = res.data.stockInformDTOList || []
                    })
                }else {
                    getOrderNos({
                        storehouseId: this.storehouseId,
                        likeColumn: '',
                        centralBillDelivery: this.selectType == 'send',
                        size:50
                    }).then(res => {
                        this.loading = false
                        this.stockNoList = res.data.data || [];
                    });
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>