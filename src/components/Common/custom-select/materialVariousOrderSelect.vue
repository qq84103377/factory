<!--采购单号、退料单号、送料单号、到料单号、回料单号select组件-->
<template>
    <div class="material-various-order-select">
        <el-select
                v-model="orderIds"
                remote
                filterable
                clearable
                :placeholder="placeholder"
                :laoding="loading"
                :multiple='multiple'
                :remote-method="getMaterialVariousOrder"
                @change="handleChange">
            <!--<el-option :value="''" disabled style="cursor:pointer;"  v-if="isShowAdd">-->
                <!--<div class="orange" @click="addGoods">新建-->
                <!--</div>-->
            <!--</el-option>-->
            <el-option v-for="item in optionList" :key="item.id" :label="item.columnValue"
                       :value="needOrderNo?item.columnValue:item.id">
            </el-option>
        </el-select>

    </div>
</template>
<script>
    import {getMaterialVariousOrder} from '@/api/material.js';

    export default {
        name: "materialVariousOrderSelect",
        // multiple 是否支持多选 （单选的时候返回字符串，多选返回数组）
        // type:单据类型（purchase:采购单 arrive:到料单 delivery:送料单 return:退料单 refund:回料单）
        // module:所属模块(0:物料采购模块 1：样料中心模块,2:样料通知单)
        props: ['value', 'multiple','type','module','needOrderNo'],
        data() {
            return {
                loading: false,
                orderIds:[],
                optionList: [], //下拉列表
                timer: ''
            }
        },
        watch: {
            value(val){
                if(val!= this.orderIds){
                    this.orderIds = val
                }
            }
        },
        components: {},
        methods: {
            // 获取单号列表
            getMaterialVariousOrder(key) {
                if(this.timer){
                    clearTimeout(this.timer)
                }
                if (key) {
                    let params = {
                        unitId: this.facId,
                        key: key,
                        type:this.type,
                        module:this.module
                    }
                    this.loading = true
                    this.timer=setTimeout(() => {
                        this.loading = false;
                        getMaterialVariousOrder(params).then(res => {
                            this.loading = false
                            this.optionList = res.data.data;
                        });
                    }, 500);

                }

            },
            handleChange(val) {
                let orderNos = []

                this.$emit('input',val)
            },
        },

        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            placeholder(){
                let text = '请选择或者搜索'
                switch (this.type){
                    case 'purchase' : text  += '采购单号';break;
                    case 'arrive' : text  += '到料单号';break;
                    case 'delivery' : text  += '送料单号';break;
                    case 'return' : text  += '退料单号';break;
                    case 'refund' : text  += '回料单号';break;
                }
                return text
            }
        },
        created() {
        },
    }
</script>

<style lang="scss" scoped>
</style>
