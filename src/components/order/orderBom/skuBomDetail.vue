<template>
    <div class="sku-bom-detail">

        <el-dialog custom-class="bom-detail" :close-on-click-modal="false" title="按货品SKU查看BOM" :visible.sync="visible"
                   align="center"
                   size="small">
            <div class="sku-bom" v-if="allSkuData.length">
                <ul class="sku-ul">
                    <li class="sku-li" v-for="(item,index) in allSkuData" :key="index">
                        <div class="header" @click="toggleDetail(item,index)">
                            <div class="left">
                                <span>{{item.colorValue?item.colorValue+'-'+item.colorName:item.colorValue}}</span>
                                <span>{{item.sizeName}}</span>
                                <span>{{item.standardName}}</span>
                            </div>
                            <div class="right">
                                <span v-if="item.commonMaterialsSkuList">{{item.commonMaterialsSkuList.length}}款物料</span>
                                <span v-if="item.materialsSkus">{{item.materialsSkus.length}}款物料</span>
                                <i class="sku-i"
                                   :class="{'el-icon-caret-bottom':item.isShowDetail,'el-icon-caret-top':!item.isShowDetail}"></i>
                            </div>
                        </div>
                        <div v-if="item.isShowDetail">
                            <table class="sku-table">
                                <thead>
                                <tr>
                                    <th style="width:120px">图片</th>
                                    <th style="width:100px">物料分类</th>
                                    <th style="width:100px">物料款号</th>
                                    <th style="width:50px">物料名称</th>
                                    <th style="width:50px">颜色</th>
                                    <th style="width:50px">规格</th>
                                    <th style="width:100px">单间用量</th>
                                    <th style="width:50px">损耗</th>
                                    <th style="width:100px">单位</th>
                                    <th style="width:120px">供应商</th>
                                    <th style="width:100px">供应商款号</th>
                                    <th style="width:80px">供应商色号</th>
                                    <th style="width:80px">参考单价</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-if="item.commonMaterialsSkuList" v-for="(ls,index) in item.commonMaterialsSkuList"
                                    :key="index">
                                    <td><img style="width: 80px;height: 40px;"
                                             @click="imgList(ls)"
                                             :src="ls.commonMaterialsPictureList?ls.commonMaterialsPictureList[0].path:''"
                                             alt=""></td>
                                    <td>{{ls.kindsName?ls.kindsName:ls.kindsNo}}</td>
                                    <td>{{ls.materialsNo}}</td>
                                    <td>{{ls.materialsName}}</td>
                                    <td>{{ls.colorName?ls.colorName:ls.colorValue}}</td>
                                    <td>{{ls.specificationsName?ls.specificationsName:ls.specificationsNo}}</td>
                                    <td>{{ls.singleDosage}}</td>
                                    <td>{{ls.lossRate}}%</td>
                                    <td>{{ls.stockUnitName}}</td>
                                    <td>{{ls.supplierName}}</td>
                                    <td>{{ls.supplierStyleNo}}</td>
                                    <td>{{ls.supplierColorNo}}</td>
                                    <td>{{ls.planCost}}</td>

                                </tr>

                                <tr v-if="item.materialsSkus" v-for="(ls,index) in item.materialsSkus" :key="index">
                                    <td><img style="width: 80px;height: 40px;"
                                             @click="imgList(ls)"
                                             :src="ls.commonMaterialsPictureList?ls.commonMaterialsPictureList[0].path:ls.commonMaterialsSkuPicture"
                                             alt=""></td>
                                    <td>{{ls.kindName||ls.kindNo}}</td>
                                    <td>{{ls.materialsNo}}</td>
                                    <td>{{ls.materialsName}}</td>
                                    <td>{{ls.colorName||ls.colorValue}}</td>
                                    <td>{{ls.specificationsName||ls.specificationsNo}}</td>
                                    <td>{{ls.singleDosage}}</td>
                                    <td>{{ls.lossRate}}%</td>
                                    <td>{{ls.unit}}</td>
                                    <td>{{ls.supplierName}}</td>
                                    <td>{{ls.supplierStyleNo}}</td>
                                    <td>{{ls.supplierColorNo}}</td>
                                    <td>{{ls.planCost}}</td>

                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>
                </ul>
            </div>
            <div v-else>暂无数据</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="hideDialog">确 定</el-button>
            </div>
        </el-dialog>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>

</template>

<script>
    export default {
        props: {
            allSkuData: {
                type: Array,
                default: []
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                skuTable: false,
                allSkuData: this.allSkuData
            };
        },
        computed: {
            designStyleId(){
                return this.$route.query.designStyleId
            }
        },
        watch: {
            allSkuData(v) {
                console.log(v, 'SKU弹窗');

            }
        },
        methods: {
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList || [{path:row.commonMaterialsSkuPicture}];
                this.centerDialogVisible = true;
            },
            hideDialog() {
                console.log(this.allSkuData, "6666666");
                this.$emit("update:visible", false);
            },
            toggleDetail(item) {
                this.$set(item, "isShowDetail", !item.isShowDetail);
            }
        },
        created() {
            // console.log('allSkuData',this.allSkuData);
            //  if(this.allSkuData.length>0){
            //     this.canShowTable = true;
            //  }
        },
    };
</script>
<style lang="scss" scoped>
    @import "~scss_vars";

    .sku-bom {
        overflow: auto;
        border: 1px solid #e6eaf0;
        border-bottom: none;
        .sku-ul {
            width: 100%;
            .sku-li {
                .header {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #e6eaf0;
                    line-height: 48px;
                    cursor: pointer;
                    &:hover {
                        background-color: #f5f7fa;
                    }
                    .left {
                        display: inline-block;
                        span {
                            display: inline-block;
                            width: 120px;
                            padding: 0 12px;
                            display: inline-block;
                            text-align: left;
                        }
                    }
                    i {
                        display: inline-block;
                        cursor: pointer;
                        padding: 10px 16px;
                    }
                }
                .sku-table {
                    width: 100%;
                    text-align: left;
                    background-color: #fcfcfc;
                    th {
                        color: #a2abb8;
                        font-weight: normal;
                    }
                    th,
                    td {
                        padding: 10px 12px;
                        border-bottom: 1px solid #e6eaf0;
                        border-left: 1px solid #e6eaf0;
                    }
                    tr > th:first-child,
                    tr > td:first-child {
                        border-left: none;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .bom-detail {
        width: 80% !important;
        .el-dialog__header .el-dialog__headerbtn {
            display: none;
        }
        .el-dialog__body {
            border-top: 1px solid #e6eaf0;
            margin-top: 16px;
            max-height: 300px;
            overflow: auto;
            padding-bottom: 10px;
        }
        .el-dialog__footer {
            text-align: center;
        }
        .el-dialog__footer button {
            width: 130px;
            height: 40px;
            border-radius: 2px;
            background-color: #ffa914;
        }
        .el-dialog--small {
            width: 80% !important;
            overflow: auto;
        }
    }
</style>

