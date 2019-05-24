<template>
    <div>
        <el-table
                v-if="canShow"
                id="material-table"
                class="material-table no-cell-padding no-hover-highlight"
                border :data="tableData">
            <el-table-column label="商品款号" v-if="configArr.includes('商品款号')" align="center" min-width="80">
                <template slot-scope="scope">
                    <div class="cell__row">{{ scope.row.styleNo }}</div>
                </template>
            </el-table-column>
            <el-table-column label="生产单号" v-if="configArr.includes('生产单号')" align="center" min-width="160">
                <template slot-scope="scope" >
                    <div class="cell__row">{{ scope.row.facMissionNo }}</div>
                </template>
            </el-table-column>
            <el-table-column label="送料工厂" align="center" min-width="160">
                <template slot-scope="scope" >
                    <div class="cell__row">{{ scope.row.factoryName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="分类" v-if="configArr.includes('分类')" prop="kindName" align="center" min-width="120">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.kindName?item.kindName:item.kindNo }}</div>
                </template>
            </el-table-column>
            <el-table-column v-if="configArr.includes('图片')" label="图片"  align="center" width="80">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">
                        <img style="width: 40px;height: 28px;margin-top: 2px;margin-left: 20px;"
                             @click="imgList(item)"
                             v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                             :src="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length?item.commonMaterialsPictureList[0].path:''"
                             alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="物料款号" v-if="configArr.includes('物料款号')" align="center" min-width="160">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.materialsNo }}</div>
                </template>
            </el-table-column>
            <el-table-column label="供应商" v-if="configArr.includes('供应商')" prop="supplierName" align="center" width="140">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.supplierName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" prop="supplierStyleNo" width="130" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{item.supplierStyleNo}}/{{item.supplierColorNo}}</div>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" v-if="configArr.includes('物料名称')" prop="name" min-width="140" align="center">
                <template slot-scope="scope">
                    <div  class="cell__row"  style="font-size:12px;padding:0 10px;" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.materialsName }}</div>
                </template>
            </el-table-column>
            <el-table-column label="颜色" v-if="configArr.includes('颜色')" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">
                        {{ item.colorName?item.colorName:item.colorValue }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" v-if="configArr.includes('规格')" width="120" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">
                        <span>{{ item.specificationsRemark?item.specificationsRemark:item.specificationsNo}} </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="仓位" width="120" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">
                        <span>{{ item.position}} </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="库存单位" v-if="configArr.includes('单位')" align="center" min-width="120">
                <template slot-scope="scope" >
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.unit }}</div>
                </template>
            </el-table-column>
            <el-table-column label="物料需求" v-if="configArr.includes('物料需求')" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.planBuyQuantity }}</div>
                </template>
            </el-table-column>
            <el-table-column label="主动占用" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{item.stockActivePreuse}}</div>
                </template>
            </el-table-column>
            <el-table-column label="本单总占用" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{item.selfPreuseTotal}}</div>
                </template>
            </el-table-column>
            <el-table-column label="已采购" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{item.quantityPurchased}}</div>
                </template>
            </el-table-column>
            <el-table-column label="已到料" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{item.quantityArrived}}</div>
                </template>
            </el-table-column>
            <el-table-column label="已送料" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.quantityDelivered }}</div>
                </template>
            </el-table-column>
            <el-table-column label="待送料" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" :class="{'yellow':item.waitDeliveryQuantity>0}" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.waitDeliveryQuantity }}</div>
                </template>
            </el-table-column>
            <el-table-column label="可用库存" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" :class="{'yellow':item.waitDeliveryQuantity>0}" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.availableStock }}</div>
                </template>
            </el-table-column>
            <el-table-column label="总库存" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" :class="{'green':item.stock>item.waitDeliveryQuantity,'red':item.stock<item.waitDeliveryQuantity}" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">{{ item.stock }}</div>
                </template>
            </el-table-column>
            <el-table-column label="本次送料" fixed="right" align="center">
                <template slot-scope="scope">
                    <div class="cell__row gray" v-for="item in scope.row.materialsSkus" :key="item.materialSkuId">
                        <el-input placeholder="请输入" v-model="item.quantity" type="number" @blur="checkInput"></el-input>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center" fixed="right">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.materialsSkus" :key="item.materialSkuId">
                        <div class="cell__opera">
                            <div class="cell__opera-left" v-if="item.status!==1">
                                <div style="width:50%;text-decoration: underline;"  @click="addMaterialValue(scope.row.materialsSkus,index)">
                                    一键填齐
                                </div>
                                <div style="width:50%;text-decoration: underline;"@click="changeStatus(scope.row.materialsSkus,index)">
                                    标为完成
                                </div>
                            </div>
                            <div class="cell__opera-left green" v-if="item.status===1">
                                已完成
                            </div>
                            <div class="cell__opera-right deleted" v-if="item.status!==1" @click="deleteTa(scope.row,scope.$index,scope.row.materialsSkus,index)">
                                删除
                            </div>
                            <div class="cell__opera-right deleted" v-if="item.status===1" @click="change0(scope.row.materialsSkus,index)">
                                撤销
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

    </div>

</template>

<script>
    import {
        MPRFieldConfigList
    } from '@/api/material.js'
export default {
    created(){
        // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
        this.getConfigArr('DELIVER');
    },
    mounted() {
    },
    data(){
        return {
            centerDialogVisible: false, //判断显示图片预览显示与隐藏
            imgLists: [],
            imgIndex: 0,
            configArr:[],       //配置表头数组
            canShow: false      //控制是否显示表格
        }
    },
    props: {
        tableData: [],
        facMissionVal:'',
    },
    computed: {
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
    watch:{
        facMissionVal(val) {

        }
    },
    methods:{
        checkInput(e) {
            if(e.target.valueAsNumber<0){
                this.$message.error('请输入正数')
            }
            // else if (e.target.valueAsNumber>123){
            //     // 大于本单总占用
            //     this.$message.error('不可大于xx(本单总占用)')
            // }
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
        imgList(item) {
            console.log(item);
            this.imgIndex = 0;
            this.imgLists = [];
            // item.forEach($item =>{
            //     this.imgLists.push({path:$item})
            // })
            this.imgLists = item.commonMaterialsPictureList;
            this.centerDialogVisible = true;
        },
        filterNums(val) {
            if((/(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/).test(val.quantity)) {
            }else {
                console.log(1);
                this.$nextTick(()=> {
                    this.$set(val,'quantity','');
                })
            }
        },
        changeStatus(obj,index) {
            this.$set(obj[index],'status',1);
        },
        change0(obj,index) {
            this.$set(obj[index],'status',0);
        },
        addMaterialValue(obj,index) {
            this.$set(obj[index],'quantity',obj[index].waitDeliveryQuantity);
            console.log(obj);
        },
        deleteTa(row,ind,val,index) {
            if(row.materialsSkus.length!==1) {
                val.splice(index,1);
            }else {
                this.tableData.splice(ind,1);
                this.$emit('deleteMissionRow',row);
            }
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
        text-decoration: none !important;
    }
    .red {
        color: red;
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
</style>
<style lang="scss">
@import '../../../../assets/style/el-table.scss';
    #material-table{
        .el-table td .cell {
            line-height: 18px;
            padding: 0;
        }
        .el-input__inner{
            border:none;
        }
        .gray {
            .el-input__inner{
                width:80px;
            }
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
    }
</style>

