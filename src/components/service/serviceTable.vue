<template>
    <div class="table-wrap">
        <!-- 表格右侧 -->
        <table class="table-fixed" cellspacing="0" cellpadding="0" border="0" v-if="tableData.colors">
            <thead>
                <tr>
                    <td class="table-blue">
                        <div class="table-fixed-header">
                            <div class="rule">规格</div>
                        </div>
                    </td>
                    <td class="table-blue" v-if="isEdit">
                        <div class="rule once-header">一手</div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                    <td class="table-blue">
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
                    </td>
                    <td class="table-blue" v-if="isEdit">
                        <input type="number"
                            v-if="tableData.lengths.length &&
                            onceInputVal[`${colorItem.id}-${lengthItem.id}`]"
                            v-for="(lengthItem, lengthIndex) in tableData.lengths"
                            :key="lengthIndex"
                            class="once-input"
                            @input="once(colorItem, lengthItem)"
                            v-model="onceInputVal[`${colorItem.id}-${lengthItem.id}`].target">
                        <input type="number"
                            v-if="!tableData.lengths.length"
                            class="once-input"
                            @input="once(colorItem)" v-model="colorItem.target">
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 表格内容 -->
        <div class="table-content-wrap" :class="{'pl180':isEdit}">
            <table class="table-content" cellspacing="0" cellpadding="0" border="0">
                <thead>
                    <tr>
                        <td class="table-blue" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex" :style="{'width': '90px'}">
                            <div class="content-header">
                                <div class="size">
                                    {{sizeItem.sizeTypeCategory?sizeItem.value+'-'+sizeItem.sizeTypeCategory:sizeItem.value}}
                                </div>
                            </div>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(colorItem, colorIndex) in tableData.colors" :key="colorIndex">
                        <td class="table-blue sku-wrap" v-for="(sizeItem, sizeIndex) in tableData.sizes" :key="sizeIndex">
                            <table-columm
                            class="sku-item"
                            v-if="tableData.lengths.length"
                            v-for="lengthItem in tableData.lengths"
                            :key="lengthItem.id"
                            :colorItem="colorItem"
                            :sizeItem="sizeItem"
                            :lengthItem="lengthItem"
                            @on-input="handleChange"></table-columm>
                            <!--  有内长是编辑 -->
                            <table-columm
                            class="sku-item"
                            v-if="!tableData.lengths.length"
                            :colorItem="colorItem"
                            :sizeItem="sizeItem"
                            @on-input="handleChange"></table-columm>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import tableColumm from './serviceTableColumn'
export default {
    props: {
        tableData: {},
        skuVal: {},
        isNode: false,
        isEdit: false,
        isShowNum: Boolean,
        isChangeBg: false
    },
    data() {
        return {
            // tableVal: {}
            onceInputVal: {}
        }
    },
    components: {
        tableColumm
    },
    computed: {
        tableVal() {
            return this.skuVal
        },
        // 当有内长时用来记录一手输入框值，没有用colorItem中target记录
        // onceInputVal: {
        //     get() {
        //         return this.mapOnceInputVal();
        //     },
        //     set(val) {

        //     }
        // }
    },
    watch: {
        tableData(val) {
            // console.log(val)
            this.mapOnceInputVal();
            this.initTartget()
        }
    },
    created() {
        this.mapOnceInputVal();
        console.log("这边的数据非常重要：",this.tableData);
        
    },
    methods: {
        mapOnceInputVal() {
            const obj = {};
            for (let colorItem of this.tableData['colors']) {
                for (let lengthItem of this.tableData['lengths']) {
                    const key = `${colorItem.id}-${lengthItem.id}`;
                    obj[key] = {
                        target: ''
                    };
                }
            }
            this.onceInputVal = obj
        },
        // 该方法在父组件调用 this.$refs['reportTable'].initOnceInputVal();
        initOnceInputVal() {
            for (let key in this.onceInputVal) {
                this.onceInputVal[key].target = '';
            }
        },
        // 清除没有内长的输入框的值target
        initTartget() {
            for (let colorItem of this.tableData['colors']) {
                colorItem.target = '';
            }
        },
        handleChange(skuIdStr) {
            // if (this.tableVal[skuIdStr].num < 0) this.tableVal[skuIdStr].num = 0;
            // const opt = {
            //     skuId: skuId,
            //     tableVal: this.tableVal
            // }
            // console.log(opt)
            // this.$emit('setReportVal', opt);
        },
        once(colorItem, lengthItem){
            const target = lengthItem ? this.onceInputVal[`${colorItem.id}-${lengthItem.id}`].target : colorItem.target;
            if (target < 0) {
                lengthItem ? this.onceInputVal[`${colorItem.id}-${lengthItem.id}`].target = 0 : colorItem.target = 0;
                return
            }
            if (lengthItem) {
                const onceOptions = {
                    ...lengthItem,
                    target: target
                }
                this.$emit('setReportOnce', colorItem, this.tableVal, onceOptions);
                return
            }
            this.$emit('setReportOnce', colorItem, this.tableVal);
        }
    }
}
</script>

<style scoped lang="scss">
.table-blue {
    background: #f7f9fc
}
.table-green {
    background: #f6fff3
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
    margin: 16px 0;
    .table-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
        border-left: 1px solid #e6e8eb;
        border-top: 1px solid #e6e8eb;
        /*box-shadow: 4px 0 8px -4px #d3d4d6;*/
        tbody>tr>td {
            // font-size: 14px;
            color: #62758c;
        }
        .once-header {
            width: 90px;
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
            border-left: 1px solid #e6eaf0;
        }
        .length-val {
            display: block;
            line-height: 36px;      
        }       
        .once-input {
            width: 90px;
            height: 34px;
            text-align: center;
        }
        .length-val,
        .once-input {
            &:not(:last-child) {
                border-bottom: 1px solid #e6eaf0;
            }
        }
    }
    .table-fixed-header {
        width: 120px;
        position: relative;
        text-align: center;
    }
    .w80 {
        width: 80px;
    }
    .table-content-wrap {
        overflow-x: auto;
        padding-left: 120px;
    }
    .pl180{
        padding-left: 215px;
    }
    .table-content {
        /*width: 100%;*/
        min-width: 80px;
        table-layout: fixed;
        border-right: 1px solid #e6e8eb;
        border-top: 1px solid #e6e8eb;
        tbody td {
            background: #ffffff
        }
        .content-header {
            div {
                line-height: 36px;
                height: 36px;
            }
            .length {
                display: flex;
                border-top: 1px solid #e6e8eb;
                box-sizing: border-box;
            }
            .size {
                min-width: 80px;
                text-align: center;
            }
        }
        span {
            display: block;
            border-right: 1px solid #e6e8eb;
            &:last-child {
                border-right: none;
            }
        }
        .sku-item {
            display: flex;
            width: 90px;
            flex-wrap: wrap;
            text-align: center;
        }
    }
    thead > tr > td {
        min-height: 36px;
        color: #6381a6;
        font-size: 14px;
        /*font-weight: bold;*/
    }
    tr > td {
        height: 36px;
        overflow: hidden;
        vertical-align: middle;
        border-bottom: 1px solid #e6e8eb;
        border-right: 1px solid #e6e8eb;
    }
}
.sku-wrap {
    .sku-item:not(:last-child) {
        border-bottom: 1px solid #e6e8eb;
    }
}
</style>
