<template>
    <div class="table-wrap">
        <!-- 表格右侧 -->
        <table class="table-fixed" cellspacing="0" cellpadding="0" border="0">
            <thead>
            <tr>
                <td>
                    <div class="table-fixed-header">
                        <div class="rule">规格</div>
                        <!-- <div class="color">颜色</div> -->
                    </div>
                </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                <td>
                    <div class="rule-wrap">
                        <div class="rule-left">
                            <span style="display: inline-block">{{colorItem.name}}</span>
                        </div>
                        <div class="rule-right" v-if="tableData.lengths.length">
                            <span class="length-val"
                            v-for="(lengthItem, lengthIndex) in tableData.lengths"
                            :key="lengthIndex">{{lengthItem.value}}</span>
                        </div>
                    </div>
                    <!-- {{colorItem.name}} -->
                </td>
            </tr>
            </tbody>
        </table>
        <!-- 表格内容 -->


        <div class="table-content-wrap" :class="{'pl70':isEdit}">
            <table class="table-content" cellspacing="0" cellpadding="0" border="0">
                <thead>
                <tr>
                    <td class="sku-td" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex">
                        <div class="content-header">
                            <div class="size">
                                {{sizeItem.value}}
                            </div>
                        </div>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                    <td class="sku-td" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex">
                        <div class="sku-list">
                            <!-- <span class="sku-val"
                                            v-for="(lengthItem, lengthIndex) in tableData.lengths" :key="lengthIndex"
                                            :style="{'width': (100 / tableData.lengths.length) + '%'}">
                                            </span> -->
                            <span class="sku-val sku-input" type="text"
                                  v-for="(lengthItem, lengthIndex) in tableData.lengths"
                                  :key="lengthIndex"
                                  v-if="tableVal[`${colorItem.id}-${sizeItem.id}${lengthItem.id ? '-' + lengthItem.id : ''}`]"
                                  style="width: 100%;padding:0 2px;"
                                  :class="[
                                tableVal[`${colorItem.id}-${sizeItem.id}${lengthItem.id ? '-' + lengthItem.id : ''}`].quantity == 0 ? 'table-gray' : ''
                                ]">
                                {{tableVal[`${colorItem.id}-${sizeItem.id}${lengthItem.id ? '-' + lengthItem.id : ''}`].quantity}}
                            </span>


                            <span class="sku-val sku-input" type="text"
                                  v-if="!tableData.lengths.length && tableVal[`${colorItem.id}-${sizeItem.id}`]"
                                  style="width: 100%;padding:0 2px;"
                                  :class="[
                                tableVal[`${colorItem.id}-${sizeItem.id}`].quantity == 0 ? 'table-gray' : ''
                                ]">
                                {{tableVal[`${colorItem.id}-${sizeItem.id}`].quantity}}
                            </span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            tableData: {},
            skuVal: {},
            isEdit: false
        },
        data() {
            return {
                // tableVal: {}
                onceNum: 0
            }
        },
        watch: {
            // skuVal(val) {
            //     console.warn(val, '--------');
            //     this.tableVal = val;
            // }
        },
        computed: {
            tableVal() {
                return this.skuVal
            }
        },
        methods: {
            handleChange(color_id, size_id, length_id) {
                const opt = {
                    color_id: color_id,
                    size_id: size_id,
                    length_id: length_id,
                    tableVal: this.tableVal
                }
                this.$emit('setSkuVal', opt);
            },
            once(colorItem) {
                this.$emit('setOnce', colorItem);
            }
        }
    }
</script>

<style scoped lang="scss">
    .table-gray {
        color: #000;
    }
    td {
        border:1px solid #000;
        padding:0;
    }
    .table-wrap {
        position: relative;
        text-align: center;
        // margin: 16px 0;
        .table-fixed {
            position: absolute;
            top: 0;
            left: 0;
            width: 60px !important;
            border-left: 1px solid #000;
            border-top: 1px solid #000;
            .table-fixed-header {
                position: relative;
                text-align: center;
                width: 100px;
            }
            .rule-wrap {
                display: flex;
            }
            .rule-left {
                flex: 1;
                span {
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%)
                }
            }
            .rule-right {
                width: 50%;
                border-left: 1px solid #000;
            }
            .length-val {
                display: block;
                line-height: 36px;      
            }
            .length-val {
                &:not(:last-child) {
                    border-bottom: 1px solid #000;
                }
            }
            tbody > tr > td {
                // font-size: 14px;
                color: #000;
                background: #fff
            }
        }
        .pl70{
            padding-left: 170px;
        }     
        thead > tr > td {
            /*height: 61px;*/
            width:144.5px;
            color: #000;
            font-size: 12px;
            background: #fff;
        }
        tr > td {
            font-size:12px;
            height: 36px;
            overflow: hidden;
            vertical-align: middle;
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
        }
    }
    .table-content-wrap {
        overflow-x: auto;
        padding-left: 100px;
        .table-content {
            width: auto!important;
            table-layout: fixed;
            border-right: 1px solid #000;
            border-top: 1px solid #000;
            .content-header {
                div {
                    line-height: 36px;
                    height: 36px;
                }
            }
            span {
                display: inline-block;
                &:last-child {
                    border: none;
                }
            }
            .sku-td {
                width: 80px;
            }
            .sku-list {
                display: flex;
                text-align: center;
                flex-wrap: wrap;
                .sku-val {
                    display: block;
                    width: 100%;
                    height: 36px;
                    line-height: 36px;
                }
                span {
                    display: block;
                    border-bottom: 1px solid #000;
                    &:last-child {
                        border-bottom: none;
                    }
                }
            }
        }
    }
</style>
