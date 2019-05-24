<template>
    <div class="table-wrap">
        <!-- 表格右侧 -->
        <table class="table-fixed" cellspacing="0" cellpadding="0" border="0" v-if="tableData.colors">
            <thead>
                <tr>
                    <td class="table-blue">
                        <div class="table-fixed-header">
                            <div :class="{'rule':tableData.lengths.length>0,'rule-no':tableData.lengths.length<=0}">规格</div>
                            <!-- <div class="color">颜色</div> -->
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                    <td class="table-blue color-name"
                        :class="{'one-color-length':tableData.lengths.length>0 &&
                        tableData.colors.length==1,'one-color-no':tableData.lengths.length<=0 &&
                        tableData.colors.length==1}">
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
        <div class="table-content-wrap">
            <table class="table-content" cellspacing="0" cellpadding="0" border="0">
                <thead>
                    <tr>
                        <td class="table-blue" :class="{'table-length-have':tableData.lengths.length>0,'table-length-no':tableData.lengths.length<=0}" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex" :style="{'width': tableData.lengths.length * 80 + 'px'}">
                            <div class="content-header" :class="{'width80':tableData.lengths.length<=0}">
                                <div class="size">
                                    {{sizeItem.value}}
                                </div>
                                <!-- <div class="length" v-if="tableData.lengths.length">
                                    <span class="length-val" v-for="(lengthItem, lengthIndex) in tableData.lengths" :key="lengthIndex" :style="{'width': 80 + 'px'}">{{lengthItem.value}}</span>
                                </div> -->
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                        <td class="table-blue" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex">
                            <div class="sku-list" v-if="!isEdit">
                                <!-- 内长存在 -->
                                <span 
                                v-for="(lengthItem, lengthIndex) in tableData.lengths"     
                                v-if="tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`]"
                                :class="[
                                    (tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].finishNum >=
                                    tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].num) && !isChangeBg ? 'table-green' : '',
                                    (tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].finishNum < 
                                    tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].num) && !isChangeBg ? 'table-blue' : '',
                                    tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].finishNum === 0 ? 'table-white' : '',
                                    (tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].num == 0 && 
                                    tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].finishNum == 0) ? 'table-gray' : '',
                                    (tableData.colors.length && tableData.lengths.length)==1?'sku-val-length':'sku-val'
                                ]">
                                    <i>{{tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].finishNum}}</i><i v-if="!isNode">/{{tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].num}}</i>
                                </span>
                                <!-- 内长不存在 -->
                                <span 
                                :class="[
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].finishNum >=
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].num && !isChangeBg ? 'table-green' : '',
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].finishNum < 
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].num && !isChangeBg ? 'table-blue' : '',
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].finishNum === 0 && !isChangeBg ? 'table-white' : '',
                                    (tableVal[`${colorItem.id}-${sizeItem.id}`].num == 0 && 
                                    tableVal[`${colorItem.id}-${sizeItem.id}`].finishNum == 0) ? 'table-gray' : '',
                                    tableData.colors.length==1?'sku-val-no':'sku-val'
                                ]"          
                                v-if="!tableData.lengths.length && tableVal[`${colorItem.id}-${sizeItem.id}`]"
                                :style="{'width': 100 + '%'}" >
                                    <i>{{tableVal[`${colorItem.id}-${sizeItem.id}`].finishNum}}</i><i v-if="!isNode">/{{tableVal[`${colorItem.id}-${sizeItem.id}`].num}}</i>
                                </span>      
                            </div>
                            <div class="sku-list" v-if="isEdit">
                                <!-- 内长存在 -->
                                <input class="sku-val sku-input" type="text"
                                v-for="(lengthItem, lengthIndex) in tableData.lengths"
                                :key="lengthIndex"
                                v-model="tableVal[`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`].num"
                                @input="handleChange(`${colorItem.id}-${sizeItem.id}-${lengthItem.id}`)"
                                :style="{'width': (100 / tableData.lengths.length) + '%'}" />
                                <!-- 内长不存在 -->
                                <input class="sku-val sku-input" type="text"
                                @input="handleChange(`${colorItem.id}-${sizeItem.id}`)"
                                v-if="!tableData.lengths.length && tableVal[`${colorItem.id}-${sizeItem.id}`]"
                                v-model="tableVal[`${colorItem.id}-${sizeItem.id}`].num"
                                :style="{'width': 100 + '%'}" />
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
        isNode: false,
        isEdit: false,
        isChangeBg: false
    },
    data() {
        return {
            // tableVal: {}
        }
    },
    watch: {
        tableData(val) {
            // console.warn(val,'123313');
        }
    },
    computed: {
        tableVal() {
            return JSON.parse(JSON.stringify(this.skuVal))
        },
        copyVal() {
            return this.skuVal
        }
    },
    methods: {
        handleChange(skuId) {
            const opt = {
                skuId: skuId,
                tableVal: this.tableVal
            }
            // //console.log(this.copyVal, this.tableVal[skuId].num)
            // if (this.copyVal[skuId].num < this.tableVal[skuId].num) {
            //     this.$message.error('上报的数量不能大于该目标数');
            //     return
            // }
            this.$emit('setReportVal', opt);
        }
    }
}
</script>

<style scoped lang="scss">
.width80{
    width:80px;
}
.table-blue {
    background: #fff;
}
.color-name {
    &:last-child {
        border-bottom: transparent;
    }
}
.one-color-length{
    // height: 53px !important;
    &:last-child {
        border-bottom: transparent;
    }
}
.one-color-no{
    height: 52px !important;
    &:last-child {
        border-bottom: transparent;
    }
}
.table-green {
    background: #fff;
}
.table-white {
    background: #ffffff
}
.table-gray {
    color: #cccccc
}
.table-wrap {
    position: relative;
    text-align: center;
    // box-shadow: inset 0 -1px 6px 0 rgba(0, 0, 0, 0.06), inset 0 1px 6px 0 rgba(0, 0, 0, 0.06);
    // margin: 16px 0;
    .table-fixed {
        position: absolute;
        top: 1px;
        left: 0;
        width: 80px;
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
            border-left: 1px solid #e6eaf0;
        }
        .length-val {
            display: block;
            line-height: 26px;      
        }
        .length-val {
            &:not(:last-child) {
                border-bottom: 1px solid #e6eaf0;
            }
        }
        tbody>tr>td {
            // font-size: 14px;
            color: #62758c;
        }
    }
    .table-fixed-header {
        position: relative;
        text-align: center;
        .rule{
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .rule-no {
            height: 26px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .table-content-wrap {
        padding-left: 80px;
        // overflow-x: scroll;
    }
    .table-content {
        min-width: 120px;
        max-width:2000px;
        // width: 100%;
        table-layout: fixed;
        border-right: 1px solid #e6e8eb;
        position: relative;
        top: 1px;
        .content-header {
            div {
                line-height: 26px;
                height: 26px;
                // width:80px;
            }
            .length {
                display: flex;
                border-top: 1px solid #e6e8eb;
                box-sizing: border-box;
            }
        }
        span,
        .sku-input {
            display: inline-block;
            // border-right: 1px solid #e6e8eb;
            // &:last-child {
            //     border: none;
            // }
        }
        .sku-list {
            display: flex;
            text-align: center;
            flex-wrap: wrap;
            // span {
            //     flex: 1;
            //     text-align: center
            // }
            span {
                display: block;
                width: 100%;
                border-bottom: 1px solid #e6e8eb;
                &:last-child {
                    border-bottom: none;
                }
            }
            .sku-val {
                display: block;
                width: 80px;
                height: 26px;
                line-height: 26px;
            }
            .sku-val-no {
                display: inline-block;
                height: 51px !important;
                line-height: 51px !important;
            }
            .sku-val-length {
                display: inline-block;
                height: 26px !important;
                line-height: 26px !important;
            }
        }
        .sku-input {
            padding: 0;
            font-size: 14px;
            text-align: center;
            &:focus {
                border: 1px solid #ff8d37;
                box-sizing: border-box;
                // box-shadow: 0 0px 1px 0px #ff8d37 inset;
            }
        }
    }
    //有内长
    // thead>tr>td {
    //     height: 53px;
    //     box-sizing: border-box;
    //     color: #6381a6;
    //     font-size: 14px;
    //     // font-weight: bold;
    // }
    .table-length-have{
        height: 27px;
        box-sizing: border-box;
        color: #6381a6;
        font-size: 12px;
        // font-weight: bold;    
    }
    .table-length-no{
        height: 27px;
        box-sizing: border-box;
        color: #6381a6;
        font-size: 12px;
    }
    tr>td {
        height: 27px;
        overflow: hidden;
        vertical-align: middle;
    }
}
</style>
