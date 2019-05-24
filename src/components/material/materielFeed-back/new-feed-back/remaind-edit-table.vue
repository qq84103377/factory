<template>
    <div class="edit-table">
        <el-table
                id="material-table"
                class="material-table no-cell-padding no-hover-highlight"
                border
                :data="tableData">
            <!-- 按需物料 -->
            <el-table-column label="分类" prop="materialsKindName" align="center">
            </el-table-column>
            <el-table-column label="图片" width="120" align="center">
                <template slot-scope="scope">
                    <img style="height: 30px;width: 80px;margin-top:2px"
                         @click="imgList(scope.row.commonMaterialsPictureList)"
                         v-if="scope.row.commonMaterialsPictureList"
                         :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0]:''">
                </template>
            </el-table-column>
            <el-table-column label="物料款号" align="center" prop="materialsNo"></el-table-column>
            <el-table-column label="供应商" align="center" width="140" prop="supplierName"></el-table-column>
            <el-table-column label="供应商款号/色号" prop="supplierStyleNo" width="130" align="center">
                <template slot-scope="scope">
                    <div class="cell__row">{{scope.row.supplierStyleNo}}
                        <span v-if="scope.row.supplierStyleNo && scope.row.supplierColorNo">/</span>
                        {{scope.row.supplierColorNo}}</div>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="materialsName" align="center" ></el-table-column>
            <el-table-column label="颜色" align="center" prop="colorName"></el-table-column>
            <el-table-column label="规格" width="120" align="center" prop="specificationsRemark"></el-table-column>
            <el-table-column label="库存单位" align="center"  prop="stockUnitName"></el-table-column>
            <el-table-column label="生产参考余料合计" align="center" prop="totalReferenceRemaind"></el-table-column>
            <el-table-column label="合计入库" align="center" class-name="column-name">
                <template slot-scope="scope">
                    <el-input placeholder="请输入" v-model="scope.row.totalQuantity" @change="totalQuantityChange(scope.row)" type="number"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center">
                <template slot-scope="scope">
                    <span class="handle-order-btn blue" @click="handleDialogShow(scope.row, scope.$index)" style="cursor: pointer;">按单入库</span>
                    <span @click="deleteTa(scope.row,scope.$index)" style="cursor: pointer;">删除</span>
                </template>
            </el-table-column>
        </el-table>

        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <!--按单编辑-->
        <edit-by-remaind-dialog
                :visible.sync="dialogShow"
                title="按单编辑"
                :materialsSku="dialogData"
                handle="edit"
                @confirm="editByOrderConfirm">
        </edit-by-remaind-dialog>
    </div>

</template>

<script>
    import {
        MPRFieldConfigList
    } from '@/api/material.js'
    import {getFactorys} from '@/api';
    import editByRemaindDialog from './editByRemaindDialog';
    export default {
        created(){
            this.getFactorys()
        },
        mounted() {
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                facList:[],
                factoryId: '',
                configArr:[],       //配置表头数组
                canShow: false,      //控制是否显示表格
                dialogShow: false,
                dialogData: [],
                materialsSkuIndex: 0,
            }
        },
        props: ['materials'],
        /**
         * materials：表格数据
         * source:'', 重编辑
         *
         *  */
        watch: {
        },
        components:{
            editByRemaindDialog,
        },
        computed: {
            tableData() {
                return this.materials;
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        filters:{
            filterNum(val) {
                if(val<=0) {
                    return 0;
                }else {
                    return val;
                }
            },
            filterhouseLabel(val) {
                if(!val) {
                    return "-";
                }else {
                    return val;
                }
            }
        },
        methods:{
            //合计入库计算
            totalQuantityChange(row){
                let total = row.totalQuantity;
                let datails = row.skuDeepDetails;
                datails.forEach(item =>{
                    //计划内
                    if(item.referenceRemainQuantity){
                        if(total >= item.referenceRemainQuantity){
                            item.quantity = item.referenceRemainQuantity;
                            total -= item.referenceRemainQuantity;
                        }else{
                            item.quantity = total;
                            total = 0;
                        }
                    }
                    //计划外
                    else{
                        item.quantity = total;
                    }
                })
            },
            //按单入库
            handleDialogShow(row, index){
                this.dialogData = row;
                this.materialsSkuIndex = index;
                this.dialogShow = true;
            },
            // 点击按单编辑确认
            editByOrderConfirm(newMaterialsSku){
                this.$set(this.materials, this.materialsSkuIndex, newMaterialsSku);
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
            //判断送料输入值
            // quantityChange(quantity,quantityCanRefund,row) {
            //     if(quantityCanRefund||quantityCanRefund==0) {
            //         if (quantity*1 > quantityCanRefund*1) {
            //             this.$message.error(`输入数值不可大于${quantityCanRefund}(已送料-已回料)`)
            //         }
            //     }
            // },
            // 获取送料工厂
            getFactorys(key="") {
                let params = {
                    userId: this.userId,
                    key: key
                }
                getFactorys(params).then(res => {
                    this.facList = res.data.data
                })
            },
            // 图片预览
            imgList(imgUrl) {
                this.imgLists = [{path:imgUrl}]
                this.centerDialogVisible = true;
            },
            deleteTa(row,ind) {
                this.tableData.splice(ind,1);
                this.$emit('deleteRow',row);
            }
        }
    }
</script>

<style scoped lang="scss">
    .cell__row {
        height: 32px;
        padding: 0 10px;
        word-break: break-all;
        font-size:12px;
        &:not(:last-child) {
            border-bottom: 1px solid #E6EAF0
        }
    }
    .yellow {
        background:rgba(255,240,241,1);
    }
    .green{
        color: #23C811;
    }
    .red {
        color: red;
    }
    .bg-yellow{
        background-color: #FFF9ED;
    }
    .cell__input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        text-indent: 0;
        padding: 0 10px;
        font-size: 14px;
        &:focus {
            border: 1px solid #FFA914
        }
    }
    .cell__opera{
        display:flex;
        align-items: center;
        justify-content: space-between;
        color:#808080;
        &-left {
            width:66.6%;
            height:32px;
            border-right:1px solid #E6EAF0;
            display:flex;
            justify-content: space-around;
            div{
                padding:0 20px;
                cursor: pointer;
                &:first-child{
                    border-right:1px solid #E6EAF0;
                }
            }
        }
        &-right{
            text-decoration: underline;
            cursor: pointer;
            width:33.3%;
            height:32px;
        }
    }
    .handle-order-btn{
        display: inline-block;
        margin-right: 15px;
    }
</style>
<style lang="scss">
    @import '../../../../assets/style/el-table.scss';
    #material-table{
        .column-name{
            .cell{
                padding: 0;
                .el-input__inner{
                    border:none;
                    background-color: #FFF9ED;
                    height: 40px !important;
                }
            }
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
    }
</style>

