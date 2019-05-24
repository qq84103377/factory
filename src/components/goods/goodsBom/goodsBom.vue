<template>
    <div class="bom-table-content bom-table">
        <el-table
                class="custom-table no-hover-highlight"
                :data="tableData"
                stripe
                :maxHeight="tableHeight"
                :border="true">
            <!--可配置-->
            <el-table-column
                    v-for="item in listTitle" :key="item.fieldId"
                    :label="item.fieldName"
                    :min-width="getColumnWidth(item.fieldName)">
                    <template slot-scope="scope">
                        <div v-if="item.fieldName === '图片'">
                            <img @click="imgList(scope.row)"
                                 v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                 :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                 alt="">
                        </div>
                        <div v-else-if="item.fieldName === '物料分类'">
                            <span>{{scope.row.kindsName||scope.row.kindName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '物料款号'">
                            <span>{{scope.row.materialsNo}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '物料名称'">
                            <span>{{scope.row.materialsName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '供应商'">
                            <span>{{scope.row.supplierName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '供应商款号'">
                            <span>{{scope.row.supplierStyleNo}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '供应商色号'">
                            <span>{{scope.row.supplierColorNo}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '颜色'">
                            <span>{{scope.row.colorName?scope.row.colorName:(scope.row.colorValue)}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '规格'">
                            <span>{{scope.row.specificationsName||scope.row.specificationsRemark}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '单位'">
                            <span>{{scope.row.stockUnitName||scope.row.unit}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '单件用量'">
                            <span>{{scope.row.singleDosage}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '损耗'">
                            <span>{{scope.row.lossRate}}%</span>
                        </div>
                        <div v-else-if="item.fieldName === '用于货品颜色'">
                            <span v-if="scope.row.styleColorList" v-for="(item,index) in scope.row.styleColorList"
                                  v-model="item.id"><i v-if="index != 0">，</i>{{item.name?item.name:item.value}}</span>
                            <span v-if="!scope.row.styleColorList">{{scope.row.goodsColorName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '用于货品尺码'">
                            <span v-if="scope.row.styleSizeList" v-for="(item,index) in scope.row.styleSizeList"
                                  v-model="item.id"><i v-if="index != 0">，</i>{{item.name}}</span>
                            <span v-if="!scope.row.styleSizeList">{{scope.row.goodsSizeName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '用于货品内长'">
                            <span v-if="scope.row.styleStandardList" v-for="(item,index) in scope.row.styleStandardList"
                                  v-model="item.id"><i v-if="index != 0">，</i>{{item.name}}</span>
                            <span v-if="!scope.row.styleStandardList">{{scope.row.goodsStandardName}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '主料'">
                            <span v-if="scope.row.main">主料</span>
                        </div>
                        <div v-else-if="item.fieldName === '净幅宽'">
                            <span>{{scope.row.netWidth}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '克重'">
                            <span>{{scope.row.gweight}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '首单实际单耗' && flag === 'firstOrder' && !designStyleId">
                            <span>{{scope.row.firstActualSingleLoss}}</span>
                        </div>
                        <div v-else-if="item.fieldName === '参考单价' && designStyleId">
                            <span>{{scope.row.planCost}}</span>
                        </div>
                    </template>
            </el-table-column>
            <!--用料货品数-->
            <el-table-column
                    v-if="flag == 'purchasePlan' && bomConfigFieldName.indexOf('用料货品数')>-1"
                    prop="styleQuantity"
                    label="用料货品数"
                    width="100">
            </el-table-column>
            <!--合计数量-->
            <el-table-column
                    v-if="flag == 'purchasePlan' && bomConfigFieldName.indexOf('合计数量')>-1"
                    prop="unLossQuantityMaterials"
                    label=" 合计数量">
            </el-table-column>
            <!--实际单耗-->
            <el-table-column v-if="flag != 'firstOrder'&&flag != 'purchasePlan' && !designStyleId && bomConfigFieldName.indexOf('实际单耗')>-1"
                             prop="actualSingleLoss"
                             label="实际单耗">
            </el-table-column>
            <el-table-column
                    v-if="flag == 'purchasePlan'"
                    v-for="item in purchasePlan1"
                    :key="item.label"
                    :prop="item.prop"
                    :label="item.label">
            </el-table-column>
            <!--采购计划-->
            <el-table-column
                    v-if="flag == 'purchasePlan' && facPrdOrderConfigSel"
                    width="120"
                    prop="purchasePlanStatus"
                    label="计划采购">
                <template slot-scope="scope">
                    <div  v-if="scope.row.purchasePlanStatus==0" style="text-align: center;">
                          <span
                                  v-if="orderStatus == 2 || orderStatus == 6"
                                  style="color:rgba(28,161,255,1);cursor: pointer;text-decoration: underline"
                                  @click="updatePurchasePlan(scope.row.id)">生成采购计划</span>
                          <span v-else style="color:#999;">生成采购计划</span>
                    </div>

                    <div v-else style="cursor: pointer;text-align: center;" @click="canclePurchaseShow(scope.row.id)">
                        <p>已生成</p>
                        <p style="color:rgba(28,161,255,1);cursor: pointer;text-decoration: underline">（ 撤销计划 )</p>
                    </div>

                </template>
            </el-table-column>
            <!--待采购生产订单-->
            <el-table-column
                    v-if="flag == 'purchasePlan'"
                    width="120"
                    prop="quantityWaitPurchaseDemand"
                    label="待采购">
            </el-table-column>
            <!--已采购-->
            <el-table-column
                    v-if="flag == 'purchasePlan'"
                    label="已采购">
                <template slot-scope="scope">
                    <span v-if="scope.row.purchasePlanStatus==1">{{scope.row.quantityPurchased}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <!--已到料-->
            <el-table-column
                    v-if="flag == 'purchasePlan'"
                    label="已到料">
                <template slot-scope="scope">
                    <span v-if="scope.row.purchasePlanStatus==1" >{{scope.row.quantityArrived}}</span>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <!--完成状态-->
            <el-table-column
                    v-if="flag == 'purchasePlan'"
                    prop="purchaseStatus"
                    width="90"
                    label="完成状态">
                <template slot-scope="scope">
                    <div v-if="scope.row.purchaseStatus==2">
                        <span style="color:#23C811;cursor: pointer;">已完成</span>
                    </div>
                    <div v-else>
                        <span :class="[{'handle-disabled': !canHandleFinish}, 'handle-finish']"
                              @click="updatePurchaseStatusGo(scope.row.id)">手动完成</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>
</template>

<script>
    import {
        getCommonBomConfig,
        facPrdOrderConfig
    } from "../../../api/api";

    export default {
        props: ["bomData", "flag", "canHandleFinish",'bigIndex','orderStatus','facPrdOrderGoodsId'],
        /**********************************
         canHandleFinish: 订单详情传过来的值，用来控制是否可以点击手动完成
         facPrdOrderGoodsId: 订单详情的facPrdOrderGoodsId（只有订单页面用到）用来撤销采购计划
         ***********************************/
        components: {},
        created() {
            this.getFacPrdOrderConfig()
            this.dynamicbomConfigGet()
        },
        mounted() {
          if(this.$route.path === '/designFile/designFileDetail/bom'){
            const windowHeight = window.innerHeight
            this.tableHeight = windowHeight - 350
          }
          if(this.$route.path ==='/baseGoodsInfo'){
            const windowHeight = window.innerHeight
            this.tableHeight = windowHeight - 440
          }
        },
        data() {
            return {
                listTitle:[],
                bomConfigFieldName:[],
                facPrdOrderConfigSel:false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                purchasePlan1: [
                    {prop: 'quantityPurchaseDemand', label: '物料需求'},
                    {prop: 'stock', label: '实时库存'},
                ],
                purchasePlan2: [
                    // {prop: 'quantityWaitPurchaseDemand', label: '待采购'},
                    {prop: 'quantityPurchased', label: '已采购'},
                    {prop: 'quantityArrived', label: '已到料'},
                    // {prop: 'quantityCheck', label: '验布'},
                    // {prop: 'quantityShrinkage', label: '缩布'},
                ],
                tableHeight:700
            };
        },
        computed: {
            tableData() {
                return this.tableData = this.bomData.commonMaterialsSkuList || this.bomData.skus
            },
            designStyleId() {
                return this.$route.query.designStyleId
            }
        },
        methods: {
            getColumnWidth(columnName){
                let width = 120
                switch (columnName){
                    case '图片' :width = 70; break;
                    case '物料分类' :width = 120; break;
                    case '物料款号' :width = 160; break;
                    case '物料名称' :width = 160; break;
                    case '供应商' :width = 180; break;
                    case '供应商款号' :width = 90; break;
                    case '供应商色号' :width = 90; break;
                    case '颜色' :width = 80; break;
                    case '规格' :width = 120; break;
                    case '单位' :width = 70; break;
                    case '单件用量' :width = 70; break;
                    case '损耗' :width = 80; break;
                    case '用于货品颜色' :width = 150; break;
                    case '用于货品尺码' :width = 150; break;
                    case '用于货品内长' :width = 150; break;
                    case '主料' :width = 80; break;
                    case '净幅宽' :width = 100; break;
                    case '克重' :width = 80; break;
                    case '首单实际单耗' :width = 100; break;
                    case '参考单价' :width = 70; break;
                }
                return width
            },
            //bom字段配置
            dynamicbomConfigGet(){
                getCommonBomConfig({ userId: JSON.parse(sessionStorage.getItem("user_login")).userId}).then(res=>{
                    let dynamicAllItem = res.data.data.fields.filter(item=>item.required);
                    this.bomConfigFieldName = dynamicAllItem.map(item=>item.fieldName)
                    this.listTitle = res.data.data.configs;
                })
            },
            //选择bom是默认是否勾选物料采购计划
            getFacPrdOrderConfig(){
                facPrdOrderConfig({unitId:JSON.parse(sessionStorage.getItem("last_login")).id}).then(res=>{
                    // console.log(res);
                    this.facPrdOrderConfigSel = res.data.data.select;
                })
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList;
                // this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            updatePurchaseStatusGo(skuId) {
                //不能点击手动完成
                if(!this.canHandleFinish){
                    return
                }
                this.$emit('changePurchaseStatus', skuId)
            },
            updatePurchasePlan(skuId) {
                console.log(skuId);
                this.$emit('updatePurchasePlan', skuId,this.bigIndex)
            },
            canclePurchaseShow(skuId) {
                this.$emit('canclePurchaseShow', skuId, this.facPrdOrderGoodsId);
            },
        }
    };
</script>
<style lang="scss">
    .bom-table {
        .el-table__body-wrapper {
            overflow: auto !important;
        }
    }
</style>
<style lang="scss" scoped>
    .bom-table-content {
        .el-table {
            border-top: 1px solid rgb(223, 228, 236);
            border-left: 1px solid rgb(223, 228, 236);
            .cell {
                padding:0 10px;
                img{
                    width: 56px;
                    height: 56px;
                    vertical-align: bottom;
                    margin: 4px 0;
                }
            }
        }
        .handle-finish{
            cursor: pointer;
            color:rgba(28,161,255,1);
            text-decoration: underline;
        }
        .handle-disabled{
            color:#999;
        }

    }
</style>


