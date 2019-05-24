<template>
    <div class="material-add-table">
        <el-table key='3'
                  v-if="newTable && canShow"
                  :data="newTable"
                  border
                  style="width: 100%"
                  ref="multipleTable">
            <el-table-column label="分类" prop="kindName" width="60" align="center">
            </el-table-column>
            <el-table-column label="图片" width="60" align="center">
                <template slot-scope="scope">
                        <!--<img style="width:33px;height: 33px;margin-left: 10px;"-->
                             <!--v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"-->
                             <!--@click="imgList(scope.row)"-->
                             <!--:src="scope.row.commonMaterialsPictureList[0].path?item.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"-->
                             <!--alt="">-->
                        <img style="width:33px;height: 33px;margin-left: 10px;"
                             :src="scope.row.commonMaterialsSkuPicture" v-errorLogo
                             alt="">
                </template>
            </el-table-column>
            <el-table-column prop="materialsNo" label="物料款号" align="center">
            </el-table-column>
            <el-table-column prop="materialsName" label="物料名称" align="center">
            </el-table-column>
            <el-table-column prop="colorName" label="颜色" width="60" align="center">
            </el-table-column>
            <el-table-column prop="specificationsRemark" label="规格" width="60" align="center">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商" align="center" width="140">
            </el-table-column>
            <el-table-column prop="supplierStyleColor" label="供应商款号/色号" align="center" width="140">
            </el-table-column>
            <el-table-column prop="specificationsNo" label="合计未到" align="center" width="60">
                <template slot-scope="scope">
                    <div>{{scope.row.totalUnArrivedPurchaseQuantity}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="purchaserName" label="到料金额" width="60" align="center">
                <template slot-scope="scope">
                    <div>
                        {{handleTotalPrice(scope.row)}}
                        <!--{{((scope.row.priceUnit||0) * (scope.row.quantity||0)).toFixed(2)}}-->
                        <!--{{scope.row.totalPrice||0}}-->
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="purchaseMoney" fixed="right" label="合计到料数[采购单位]" width="120" align="center">
                <template slot-scope="scope">
                    <div class="now" style="display: flex;align-items: center;">
                        <el-input @input="handleQuantity(scope.row)" placeholder="请输入"
                                  v-model.number="scope.row.quantity"></el-input>
                        <span style="flex: 0 0 45px">{{scope.row.purchaseUnitName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="unit" label="合计到料[库存单位]" fixed="right" align="center" width="120">
                <template slot-scope="scope">
                    <div class="now" style="display: flex;align-items: center;">
                        <el-input @input="handleDeliveryQuantityNow(scope.row)" placeholder="请输入"
                                  v-model.number="scope.row.deliveryQuantityNow"></el-input>
                        <span style="flex: 0 0 45px">{{scope.row.stockUnitName}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" fixed="right">
                <template slot-scope="scope">
                    <div style="display: flex;align-items: center;padding: 0 5px;">
                        <div @click="$emit('addByOrder',scope.row,scope.$index)" style="color: #ff9c38;margin-right: 8px;text-decoration: underline;cursor: pointer;">按单到料</div>
                        <div class="cell__row-border"
                             @click="$emit('del',scope.row,scope.$index)" style="text-decoration: underline;font-size:12px;cursor:pointer;color:#808080">
                            删除
                        </div>
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
        MPRFieldConfigList
    } from '@/api/material.js'
    export default {
        name: "material-add-table",
        props:['tableData','isSelectTion','source','isSampleMaterial','deleteRowData'],
        /**
         * tableData: 表格数据
         * isSelectTion： 判断是否显示搜索框
         * source：重编辑
         * isSampleMaterial： 是否是样料模板
         * deleteRowData： 选中的删除行
         */
        data(){
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                searchMission:'',
                configArr:[],       //配置表头数组
                canShow: false      //控制是否显示表格
            }
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            newTable() {
                // JSON.parse(JSON.stringify(this.tableData))
                return this.tableData
            }
        },
        watch:{
            // deleteRowData(val) {
            //     console.log(val,'777')
            //     this.toggleSelection(val);
            // }
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                } else {
                    return "未设置"
                }
            }
        },
        updated(){
            if(this.isSelectTion && this.$route.query.id){
                if(this.source) return;
                this.newTable.forEach(item=>{
                    this.$refs.multipleTable.toggleRowSelection(item,true);
                    this.$emit('selectionChange',this.newTable,item)
                })
            }
        },
        methods:{
            //到料金额总计
            handleTotalPrice(row) {
                return row.sourceBillForArriveList.reduce((t,v) => {
                   return (t + (v.priceUnit * (v.quantity || 0)).toFixed(4) * 1).toFixed(4) * 1
                },0)
            },
            //输入合计到料数
            handleQuantity(row) {
                let total = row.quantity;
                let flag = false;
                let num = 0;
                for (let i = 0; i < row.sourceBillForArriveList.length; i++) {
                    let item = row.sourceBillForArriveList[i];
                    if(flag) {
                        item.quantity = 0
                        this.$set(item,'deliveryQuantityNow',0)
                        continue
                    }
                    if(((total*item.conversionRate).toFixed(4)*1) - item.unArrivedPurchaseQuantity>0) {
                        if(i==(row.sourceBillForArriveList.length-1)){
                            item.quantity = total
                            this.$set(item,'deliveryQuantityNow',(total*item.conversionRate).toFixed(4)*1)
                        }else {
                            item.quantity = item.unArrivedPurchaseQuantity
                            this.$set(item,'deliveryQuantityNow',(item.unArrivedPurchaseQuantity*item.conversionRate).toFixed(4)*1)
                            total = ((total*item.conversionRate).toFixed(4)*1) - item.unArrivedPurchaseQuantity
                        }
                    }else {
                        item.quantity = total || 0
                        this.$set(item,'deliveryQuantityNow',((total || 0)*item.conversionRate).toFixed(4)*1)
                        flag = true
                    }
                    num = (num + item.deliveryQuantityNow).toFixed(4) * 1
                }
                row.deliveryQuantityNow = num;
            },
            //输入合计到料数
            handleDeliveryQuantityNow(row) {
                let total = row.deliveryQuantityNow;
                let flag = false;
                let num = 0;
                for (let i = 0; i < row.sourceBillForArriveList.length; i++) {
                    let item = row.sourceBillForArriveList[i];
                    if(flag) {
                        item.deliveryQuantityNow = 0
                        this.$set(item,'quantity',0)
                        continue
                    }
                    if(total - item.unArrivedPurchaseQuantity>0) {
                        if(i==(row.sourceBillForArriveList.length-1)){
                            item.deliveryQuantityNow = total
                            this.$set(item,'quantity',item.conversionRate*1>0?(total/item.conversionRate).toFixed(4)*1:0)
                        }else {
                            item.deliveryQuantityNow = item.unArrivedPurchaseQuantity
                            this.$set(item,'quantity',item.conversionRate*1>0?(item.unArrivedPurchaseQuantity/item.conversionRate).toFixed(4)*1:0)
                            total = total - item.unArrivedPurchaseQuantity
                        }

                    }else {
                        item.deliveryQuantityNow = total || 0
                        this.$set(item,'quantity',item.conversionRate*1>0?((total || 0)/item.conversionRate).toFixed(4)*1:0)
                        flag = true
                    }
                    num = (num + item.quantity).toFixed(4) * 1
                }
                row.quantity = num;
            },
            // 取消勾选
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row, false);
                    });
                }
            },
            // 删除
            deleteTa(row,ind,val,index,item,key){
                if(row.meterialSkuSet&&row.meterialSkuSet.length>1) {
                    if(val.meterialPurchaseDetail&&val.meterialPurchaseDetail.length > 1) {
                        val.meterialPurchaseDetail.splice(key,1)
                    } else {
                        row.meterialSkuSet.splice(index,1);
                    }
                }else {
                    this.newTable.splice(ind,1);
                    console.log(row,'770')
                    this.$emit('deleteRow',row);
                }
            },
            //获取动态配置数组
            getConfigArr(code) {
                let params = {
                    unitId: this.unitId,
                    moduleCode: code
                };
                MPRFieldConfigList(params).then(res => {
                    this.configArr = res.data.data.fieldConfigList;
                    //解决直接渲染表格错乱的问题
                    this.$nextTick(function(){
                        this.canShow = true;
                    })
                })
            },
            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                if (row.commonMaterialsPictureList && row.commonMaterialsPictureList.length > 0) {
                    if (row.commonMaterialsPictureList[0].path) {
                        this.imgIndex = 0;
                        this.imgLists = row.commonMaterialsPictureList;
                    } else {
                        this.imgLists = []
                        row.commonMaterialsPictureList.forEach(item => {
                            this.imgLists.push({path: item})
                        })
                    }
                }
                this.centerDialogVisible = true;
            },
            //搜索
            searchMissionSku(){
                this.$emit('searchMissionSku',this.searchMission)
            },
            //选择
            // selectionChange(secData,row){
            //     this.$emit('selectionChange',secData,row)
            // },

            //手动到齐
            setArrive(val) {
                val.arriveStatus = 2;
                val.manualArriveComplete = true;
                val.deliveryQuantityNow = 0;
            },
            //填写本次到料
            compluteAllMoney(row, item,flag,items) {
                //到料数
                let sum = 0;
                item.meterialPurchaseDetail.forEach(els => {
                    if (els.deliveryQuantityNow == '-') {
                        els.deliveryQuantityNow = 0;
                    }
                    sum += els.deliveryQuantityNow;
                });
                item.priceAll = (item.priceUnit * sum).toFixed(2);
                // 当库存单位和采购单位一样时，新建到料单/样料到料单时，同一物料需求中若填写了【本次到料（库存单位）】【到料数（采购单位）】中的一个字段，则另一个字段就复制它的数据到输入框中
                if(item.unit === item.purchaseUnitName){
                    if(flag==1){
                        this.$set(items,'deliveryQuantityNow',items.quantity)
                    }else if(flag==2){
                        this.$set(items,'quantity',items.deliveryQuantityNow)
                    }
                }else if (item.unit=='米'&&item.purchaseUnitName=='码') {
                    if(flag==1){
                        this.$set(items,'deliveryQuantityNow',(items.quantity * 0.9144).toFixed(2)*1)
                    }else if(flag==2){
                        this.$set(items,'quantity',(items.deliveryQuantityNow / 0.9144).toFixed(2)*1)
                    }
                }

            },
            compluteDanJia(row, item) {
                let sum = 0;
                item.meterialPurchaseDetail.forEach(els => {
                    sum += els.deliveryQuantityNow;
                });
                if (sum !== 0) {
                    item.priceUnit = item.priceAll / sum;
                } else {
                    item.priceUnit = 0;
                }
            },
            // renderHeader(createElement, {column, $index}) {
            //     return <div class = "table-header" >{this.specific.map(item => {return <div > {item} </div>})}</div>
            //     },
        },
        created(){
            // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
            this.getConfigArr('ARRIVE');
        },
    }
</script>

<style lang="scss">
    .material-add-table{
        .el-table__header-wrapper{
            .el-checkbox{
                display: none;
            }
        }
    .el-input__inner {
        height:32px !important;
    }
    .table-search .el-input__inner {
        border:none;
        height:32px;
    }
    }
</style>
<style scoped lang="scss">
    .material-add-table{
        .boder-none{
            border:none!important;
        }
        .table-header {
            display: flex;
            justify-content: flex-start;
            font-size: 12px;
            font-weight: 600;
            div {
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid rgb(223, 228, 236);
                height: 28px;
                &:nth-child(1) {
                    padding: 0 6px;
                    width: 80px;
                    box-sizing: border-box;
                }
                &:nth-child(2) {
                    padding: 0 6px;
                    width: 140px;
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    width: 80px;
                    padding: 0 6px;
                    border: none;
                    box-sizing: border-box;
                }
            }
        }
        .specific-table {
            padding: 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid rgb(223, 228, 236);
            &:last-child {
                border: none;
            }
            div {
                height: 32px;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: -1px;
                &:nth-child(1) {
                    box-sizing: border-box;
                }
                &:nth-child(2) {
                    box-sizing: border-box;
                }
                &:nth-child(3) {
                    border-right: none;
                }
            }
        }
        .this {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            background-color: #E6EAF0;
        }
        .footer {
            margin-top: 12px;
        }
        .cell__row {
            height: 32px;
            line-height: 32px;
            display: flex;
            justify-content: center;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child {
                border: none;
            }
        }
        .cell__row-border {
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
        }
        .table-search {
            height:32px;
            border-right:1px solid rgb(223, 228, 236);
            border-left:1px solid rgb(223, 228, 236);
            border-bottom:1px solid rgb(223, 228, 236);
        }

    }

</style>
