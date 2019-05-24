<template>
    <div>
        <div id="orderBom">
            <div class="table" id="orderBom_id">
                <div class="table-th">
                    <div class="table-td">
                        分类
                    </div>
                    <div class="table-td">
                        物料款号
                    </div>
                    <!--<div class="table-td">-->
                    <!--物料名称-->
                    <!--</div>-->
                    <div class="table-td">
                        供应商
                    </div>
                    <div class="table-td">
                        供应商款号
                    </div>
                    <div class="table-td">
                        供应商色号
                    </div>
                    <div class="table-td">
                        名称
                    </div>
                    <div class="table-td">
                        颜色
                    </div>
                    <div class="table-td">
                        规格
                    </div>
                    <div class="table-td">
                        用于货品颜色
                    </div>
                    <div class="table-td">
                        用于货品尺码
                    </div>
                    <div class="table-td">
                        用于货品内长
                    </div>
                    <div class="table-td">
                        单件用料
                    </div>
                    <div class="table-td">
                        损耗
                    </div>
                    <div class="table-td">
                        单位
                    </div>
                    <div class="table-td">
                        参考价
                    </div>
                </div>
                <div class="table-tr" v-for="(item,index) in orderBomList.facMissionBom">
                    <!--分类-->
                    <div class="table-td">
                        {{item.kindsName}}
                    </div>
                    <!--物料款号-->
                    <div class="table-td">
                        {{item.materialsNo}}
                    </div>
                    <!--&lt;!&ndash;物料名称&ndash;&gt;-->
                    <!--<div class="table-td">-->
                    <!--{{item.materialsName}}-->
                    <!--</div>-->
                    <!--供应商-->
                    <div class="table-td">
                        {{item.supplierName}}
                    </div>
                    <!--供应商款号-->
                    <div class="table-td">
                        {{item.supplierStyleNo}}
                    </div>
                    <!--供应商色号-->
                    <div class="table-td">
                        {{item.supplierColorNo}}
                    </div>
                    <!--名称-->
                    <div class="table-td">
                        {{item.materialsName}}
                    </div>
                    <!--颜色-->
                    <div class="table-td">
                        <span v-if="item.colorValue && item.colorName">
                            {{item.colorValue}}-{{item.colorName}}
                        </span>
                        <span v-else>
                            {{item.colorValue?item.colorValue:item.colorName}}
                        </span>

                    </div>
                    <!--规格-->
                    <div class="table-td">
                         <span v-if="item.specificationsNo && item.specificationsName">
                            {{item.specificationsNo}}-{{item.specificationsName}}
                        </span>
                        <span v-else>
                            {{item.specificationsNo?item.specificationsNo:item.specificationsName}}
                        </span>
                    </div>
                    <!--用于货品颜色-->
                    <div class="table-td">
                        {{item.styleSkuColors}}
                        <!--<span v-for="(v,index) in item.styleColorList">-->
                        <!--<i v-if="index>1">、</i>{{v.name}}-->
                        <!--</span>-->
                    </div>
                    <!--用于货品尺码-->
                    <div class="table-td">
                        {{item.styleSkuSizes}}
                        <!--<span v-for="(v,index) in item.styleSizeList">-->
                        <!--<i v-if="index>1">、</i>{{v.name}}-->
                        <!--</span>-->
                    </div>
                    <!--用于货品内长-->
                    <div class="table-td">
                        <span>
                            {{item.styleSkuLengths}}
                        </span>

                        <!--<span v-for="(v,index) in item.styleSizeList">-->
                        <!--<i v-if="index>1">、</i>{{v.name}}-->
                        <!--</span>-->
                    </div>
                    <!--单件用料-->
                    <div class="table-td">
                        {{item.singleDosage}}
                    </div>
                    <!--损耗-->
                    <div class="table-td">
                        {{item.lossRate}}
                    </div>
                    <!--单位-->
                    <div class="table-td">
                        {{item.stockUnitName}}
                    </div>
                    <!--参考价-->
                    <div class="table-td">
                        {{item.planCost}}
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                orderBomList: {}
            }
        },
        props: ['data'],
        methods: {
            async processHtml() {
                await (this.orderBomList = JSON.parse(this.data));
                console.log(this.orderBomList, "222222")
                let b = await document.querySelector("#orderBom");
                await this.$emit('orderBomHtml', b.innerHTML);
            },
        },
        watch: {
            data(val) {
                this.processHtml();
            }
        },
        mounted() {
            if (this.data.length > 0) {
                this.processHtml();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .table {
        .tips_font {
            color: #000 !important;
            width: 100%;
        }
        display: table;
        width: 100%;
        margin-top: 60px;
        font-size: 14px;
        border: 1px solid #000;
        border-bottom: none;
        .table-th,
        .table-tr {
            display: table-row;
            .table-td {
                text-align: center;
                width: 7%;
                border-right: 1px solid #000;
                &:last-child {
                    border-right: none;
                }
            }
        }
        .tbody {
            display: table;
            width: 100%;
        }
        .table-tr {
            &:hover {
                background-color: #fff;
            }
            .table-td {
                text-align: center;
                width: 7%;
                border-right: 1px solid #000;
                &:last-child {
                    border-right: none;
                }
            }
        }
        .table-th {
            color: #000;
            background: #fff;
        }
        .table-td {
            display: table-cell;
            height: 36px;
            // padding-left: 16px;
            vertical-align: middle;
            border-bottom: 1px solid #000;
            .tips_font {
                color: #000;
            }
        }
        .table-input {
            width: 30px;
            padding: 0 8px;
            border-bottom: 1px solid #000;
        }
        .tips_font {
            color: #000 !important;
        }
    }

</style>
