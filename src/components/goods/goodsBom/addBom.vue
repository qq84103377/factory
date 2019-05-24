<template>
    <div class="bom-table-content">
        <!--新建编辑BOM不显示搜索栏-->
        <div class="div_input" v-if="from != 'createBomTable'">
            <el-input
                    class="input-search"
                    v-model.trim="searchWord"
                    @input="searchWordChange"
                    placeholder="输入物料号/名称/供应商/供应商款号搜索/关联商品款号">
            </el-input>
        </div>
        <div class="bom-table-content-content" style="width:100%;">
            <!--这下面就是搜索表格-->
            <el-table ref="multipleTable"
                      :data="tableData3"
                      tooltip-effect="dark"
                      height="325"
                      v-loading="loading"
                      border
                      stripe
                      @select="handleSelectionChange"
                      @select-all="handleSelectAll">
                <el-table-column
                        type="selection"
                        width="38"
                        :selectable="selectAble">
                </el-table-column>
                <!--  图片 -->
                <el-table-column prop="commonMaterialsSkuPicture" label="图片" width="76">
                    <template slot-scope="scope">
                        <div>
                            <img v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                 @click="imgList(scope.row)"
                                 :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                 alt="">
                        </div>
                    </template>
                </el-table-column>
                <!-- 物料分类 -->
                <el-table-column prop="kindsName" label="物料分类">
                    <template slot-scope="scope">
                        <span>{{scope.row.kindsName?scope.row.kindsName:scope.row.kindsNo}}</span>
                    </template>
                </el-table-column>
                <!-- 物料款号 -->
                <el-table-column prop="materialsNo" label="物料款号">
                    <template slot-scope="scope">
                        <span>{{scope.row.materialsNo}}</span>
                        <!--<span v-if="!searchWord">{{scope.row.materialsNo}}</span>-->
                        <!--<span v-else :style="{'color':item == searchWord? '#FF7F14':''}" v-for="(item,i) in scope.row.materialsNo2"-->
                              <!--:key="i">{{item}}</span>-->
                    </template>
                </el-table-column>
                <!-- 物料名称 -->
                <el-table-column prop="materialsName" label="物料名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.materialsName}}</span>
                        <!--<span v-if="!searchWord">{{scope.row.materialsName}}</span>-->
                        <!--<span :style="{'color':item == searchWord ? '#FF7F14':''}"-->
                              <!--v-for="(item,i) in scope.row.materialsName2"-->
                              <!--:key="i">{{item}}</span>-->
                    </template>
                </el-table-column>
                <!-- 供应商 -->
                <el-table-column prop="supplierName" label="供应商" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supplierName}}</span>
                        <!--<span v-if="!searchWord">{{scope.row.supplierName}}</span>-->
                        <!--<span :style="{'color':item == searchWord ? '#FF7F14':''}" v-for="(item,i) in scope.row.supplierName2"-->
                              <!--:key="i">{{item}}</span>-->
                    </template>
                </el-table-column>
                <!-- 供应商款号/色号 -->
                <el-table-column prop="supplierStyleNo" label="供应商款号/色号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.supplierStyleNo}}</span>
                        <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo"> / </span>
                        <span>{{scope.row.supplierColorNo}}</span>
                        <!--<span v-if="!searchWord">{{scope.row.supplierStyleNo}}</span>-->
                        <!--<span :style="{'color':item == searchWord ? '#FF7F14':''}"-->
                              <!--v-for="(item,i) in scope.row.supplierStyleNo2"-->
                              <!--:key="i">{{item}}</span>-->
                        <!--<span v-if="scope.row.supplierStyleNo || scope.row.supplierColorNo">/</span>-->
                        <!--<span>{{scope.row.supplierColorNo}}</span>-->
                    </template>
                </el-table-column>
                <!-- 颜色 -->
                <el-table-column prop="colorName" label="颜色" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                    </template>
                </el-table-column>
                <!-- 规格 -->
                <el-table-column prop="specificationsName" label="规格" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.specificationsName?scope.row.specificationsName:scope.row.specificationsNo}}</span>
                    </template>
                </el-table-column>
                <!-- 商品款号 -->
                <el-table-column prop="styleNo" label="关联商品款号">
                    <template slot-scope="scope">
                        <div class="styleNo-popover" :title="scope.row.styleNo">{{scope.row.styleNo}}</div>
                        <!--<el-popover-->
                            <!--placement="top"-->
                            <!--trigger="hover"-->
                            <!--width="500"-->
                            <!--:content="scope.row.styleNo">-->
                        <!--<div class="styleNo-popover" slot="reference">{{scope.row.styleNo}}</div>-->
                        <!--</el-popover>-->
                    </template>
                </el-table-column>
                <!-- 参考单价 -->
                <el-table-column prop="planCost" label="参考单价" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.planCost}}</span>
                        <span v-if="scope.row.planCost">元 / {{scope.row.stockUnitName}}</span>
                    </template>
                </el-table-column>
                <!-- 不含税价 -->
                <el-table-column prop="excludingTaxPrice" label="不含税价" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.excludingTaxPrice}}</span>
                        <span v-if="scope.row.excludingTaxPrice">元 / {{scope.row.stockUnitName}}</span>
                    </template>
                </el-table-column>
                <!-- 缩率 -->
                <el-table-column prop="shrinkage" label="缩率" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.shrinkage}}</span>
                        <span v-if="scope.row.shrinkage"> %</span>
                    </template>
                </el-table-column>
                <!-- 净幅宽 -->
                <el-table-column prop="netWidth" label="净幅宽" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.netWidth}}</span>
                    </template>
                </el-table-column>
                <!-- 克重 -->
                <el-table-column prop="gweight" label="克重" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.gweight}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>
</template>

<script>
    import {
        materialsSkulistByStyle
    } from "../../../api/material";
    export default {
        props: ["storehouseId", "parentTableData","styleId","keyword","facMissionId","facPreOrderId","from"],
        /**********************************
         facMissionId: 生产工单id
         facPreOrderId: 生产订单id
         from: createBomTable  新建编辑BOM组件标识
         ***********************************/
        watch: {
            keyword:{
                handler(){
                    this.getDatalist();
                },
                deep:true
            },
        },
        computed:{
            designStyleId(){
                return this.$route.query.designStyleId
            },
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        created() {
            //createBomTable 的时候不需要首次调用了 因为会传入keyword触发watch
            if(this.from !== 'createBomTable') {
                this.getDatalist();
            }
        },
        data() {
            return {
                loading: false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                isShow: false,
                tableData3: [], //表格数据
                isshow: false, //判断显示与隐藏左侧新建物料弹窗
                searchWord: "",
                tableMaxHeight: 0,
                timer: "",
            };
        },
        methods: {
            //关键词搜索
            searchWordChange(){
                if(this.timer){
                    clearTimeout(this.timer);
                }
                if(this.searchWord){
                    this.timer = setTimeout(() => {
                        this.getDatalist();
                    }, 300)
                }else{
                    // 输入框中的内容被删为空时触发，此时会清除之前展示的搜索结果
                    this.getDatalist();
                }
            },
            selectAble(row){
                //已生成采购计划的物料不允许操作
                return row.purchasePlanStatus !== 1
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            // 防抖
            throttle(callback, time) {
                clearTimeout(callback.timer);
                callback.timer = setTimeout(() => {
                    callback();
                }, time);
            },
            // 获取表格数据，这里就是获取表格数据的请求
            getDatalist() {
                this.loading = true;
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    storehouseId: this.storehouseId,
                    styleId: this.styleId,
                    facMissionId: this.facMissionId,
                    facPreOrderId: this.facPreOrderId,
                    keyWord: this.searchWord,
                    ...this.keyword,
                };
                materialsSkulistByStyle(params).then(res => {
                    this.loading = false
                    this.tableData3 = res.data.commonMaterialsSkuList || [];
                    // console.log(this.tableData3,'this.tableData3this.tableData3');
                    // this.tableData3.forEach(v => {
                    //     if(v.fixedMaterials) {
                    //         this.$emit("filterCb", v);
                    //     }
                    // })
                    // 匹配关键字高亮显示
                    // if (this.searchWord) {
                    //     this.tableData3.forEach((v, i) => {
                    //         v.rowIndex = 'row' + i;
                    //         v.materialsNo2 = [v.materialsNo || ""];//物料款号
                    //         v.materialsName2 = [v.materialsName || ""];//物料名称
                    //         v.supplierName2 = [v.supplierName || ""];//供应商
                    //         v.supplierStyleNo2 = [v.supplierStyleNo || ""];//供应商款号
                    //         for (let key in v) {//循环每个key
                    //             if (v[key] instanceof Array) {//判断是否是数组
                    //                 v[key].forEach((v2, k) => {
                    //                     if (typeof (v2) == "string") {//判断类型是否为字符串
                    //                         if (v2.indexOf(this.searchWord) !== -1) {//如果关键字匹配，说明找到
                    //                             v[key] = v[key].join().split(this.searchWord);//把数据分割成新的数组
                    //                             if (!v[key][0]) {//如果头部为空，说明在第一位
                    //                                 v[key][0] = this.searchWord;
                    //                             } else if (!v[key][v[key].length - 1]) {//如果尾部为空，说明在最后一位
                    //                                 v[key][v[key].length - 1] = this.searchWord;
                    //                             } else {//说明在中间
                    //                                 v[key].splice(1, 0, this.searchWord);
                    //                             }
                    //                         }
                    //                     }
                    //                 });
                    //             }
                    //         }
                    //     });
                    // }
                    // 编辑判断是否有某条数据，有就勾选有的
                    this.$nextTick(() => {
                        if (this.parentTableData.length && this.tableData3) {
                            this.parentTableData.forEach(row => {
                                this.toggleSelectionFn(row, true);
                            });
                        }
                    });
                });
            },
            // 点击勾选款的值
            handleSelectionChange(val, row) {
                this.$emit("tableData4", val, row);
            },
            // 提供给父组件切换选中状态
            toggleSelectionFn(row, bol = false) {
                // console.log(row);
                const delArr = this.tableData3.filter(item => {
                        return (row.materialsSkuId === item.id) || (row.id === item.id)
                });
                if (delArr.length) {
                    delArr.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row, bol);
                    });
                }
            },
            handleSelectAll(val) {
                this.$emit("select-all", val,this.tableData3);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .bom-table-content {
        .bom-table-content-content {
            width: 100%;
            background-color: #fff;
            border: 1px solid rgba(230, 234, 240, 1);
            border-bottom: none;
            .bom-table-content-buttom {
                float: right;
                padding:0 15px;
                line-height: 35px;
                color:rgba(255,169,20,1);
                cursor: pointer;
            }
        }
    }
</style>

<style lang="scss">
    .detail-block {
        .group-name {
            padding: 12px 0 8px;
        }
    }
</style>
<style lang="scss">
    .bom-table-content {
        .div_input {
            margin-bottom: 4px;
            .input-search{
                .el-input__inner {
                    border: 1px solid rgb(223, 228, 236);
                    border-top: none;
                    &:focus{
                        border-color: #dfe4ec !important;
                    }
                }
            }
        }
        .el-table{
            border: none;
            td{
                height: auto;
            }
            th{
                height: auto;
            }
            font-size: 12px;
            .cell{
                padding-left: 10px;
                padding-right: 10px;
                line-height: 32px;
                img{
                    width: 56px;
                    height: 56px;
                    vertical-align: bottom;
                    margin: 4px 0;
                }
            }
            th > div{
                padding-left: 10px;
                padding-right: 10px;
            }
        }
        .el-table__body-wrapper {
            overflow: auto;
        }
        .el-table__header {
            width: 100% !important;
        }
        .el-table__body {
            width: 100% !important;
        }
        .styleNo-popover{
            cursor: pointer;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
    }
</style>
