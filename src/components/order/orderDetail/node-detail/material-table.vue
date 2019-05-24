<template>
    <div>
        <el-table
                id="material-table"
                class="material-table no-cell-padding no-hover-highlight"
                :maxHeight="700"
                stripe
                border :data="tableData">
            <el-table-column
                    label="图片"
                    align="center"
                    width="120"
            >
                <template slot-scope="scope">
                    <div v-for="item in scope.row.materialSkus" :key="item.materialSkuId">
                        <img style="width: 80px;height: 40px;"
                             v-if="item.imagePaths && item.imagePaths.length>0"
                             @click="imgList(item)"
                             :src="item.imagePaths[0].path?item.imagePaths[0].path:item.imagePaths[0]"
                             alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="kindName">
                <template slot-scope="scope">
                    <p class="cell__row">{{ scope.row.kindName }}</p>
                </template>
            </el-table-column>
            <el-table-column label="物料款号" prop="number">
                <template slot-scope="scope">
                    <p class="cell__row">{{ scope.row.number }}</p>
                </template>
            </el-table-column>
            <el-table-column label="物料名称" prop="name">
                <template slot-scope="scope">
                    <div style="font-size:12px;padding:0 10px;">{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="颜色">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">
                        {{ item.colorNoName }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="规格" width="120" align="center">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">
                        <span v-if="!item.specificationsRemark">{{ item.specificationsNumber}} </span>{{ item.specificationsRemark ? item.specificationsRemark : '' }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="供应商" prop="supplierName">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.supplierName }}</p>
                </template>
            </el-table-column>
            <el-table-column label="供应商款号/色号" prop="supplierStyleNo" width="130" align="center">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{item.supplierStyleNo}}/{{item.supplierColorNo}}</p>
                </template>
            </el-table-column>
            <el-table-column v-if="isReport" label="仓位" width="120" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">
                        {{ item.storehouseLabel|filterhouseLabel }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="单件用料">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.singleDosage }}</p>
                </template>
            </el-table-column>
            <el-table-column label="下单数">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.skuQuantity }}</p>
                </template>
            </el-table-column>
            <el-table-column label="实裁数">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.actualCuttingQuantity?item.actualCuttingQuantity:'-' }}</p>
                </template>
            </el-table-column>
            <el-table-column label="损耗">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.lossRate+'%' }}</p>
                </template>
            </el-table-column>
            <el-table-column label="库存单位">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.unitName }}</p>
                </template>
            </el-table-column>
            <el-table-column label="物料需求">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.totalPlan }}</p>
                </template>
            </el-table-column>
            <el-table-column label="本单总占用" width="100" v-if="isReport">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{item.selfPreuseTotal}}</p>
                </template>
            </el-table-column>
            <el-table-column label="待送料">
                <template slot-scope="scope">
                    <p class="cell__row" :class="{'yellow':item.quantityUnCompleted>0}" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.quantityUnCompleted}}</p>
                </template>
            </el-table-column>
            <el-table-column label="已送料">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId"
                       :class="{'gray':item.quantityCompleted == 0,
                    'green':item.quantityCompleted == item.totalPlan,
                    'blue':item.quantityCompleted != 0 && item.quantityCompleted<item.totalPlan}">
                        {{ item.quantityCompleted }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column :label="storeId?'可用数':'可用库存'" v-if="isReport">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.availableStock}}</p>
                </template>
            </el-table-column>
            <el-table-column :label="storeId?'库存数':'总库存'" v-if="isReport">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.materialSkuStock}}</p>
                </template>
            </el-table-column>
            <el-table-column label="本次送料" v-if="isReport">
                <template slot-scope="scope">
                    <div class="cell__row gray" v-for="(item,index) in scope.row.materialSkus" :key="item.materialSkuId">
                        <!--<input type="text">-->
                        <input style="width: 100%;height: 100%;" placeholder="请输入" v-model="item.quantity" type="number" :min="0.01" step="0.01" @blur="inputNumLimit(scope.$index,index,item.quantity)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="余料入库" width="110" v-if="!isReport">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.inStoreQuantity }}</p>
                </template>
            </el-table-column>
            <el-table-column label="实裁单耗" v-if="!isReport">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">{{ item.actualSingleLoss }}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="!isReport" fixed="right">
                <template slot-scope="scope">
                    <p class="cell__row" v-for="item in scope.row.materialSkus" :key="item.materialSkuId">
                        <span @click="changeStatus(item.bomId, 'pageTable')" class="gray" style="text-decoration: underline;cursor: pointer;" v-if="item.status===0">标为送齐</span>
                        <span class="green" v-if="item.status===1">已送齐</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="isReport" width="146" align="center" fixed="right">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="(item,index) in scope.row.materialSkus" :key="item.materialSkuId">
                        <span class="green" v-if="item.status">已送齐</span>
                        <div class="cell__opera" v-if="!item.status">
                            <div @click="addMaterialValue(scope.row.materialSkus,index)" class="all">一键填齐</div>
                            <div @click="changeStatus(item.bomId)" class="success">标为送齐</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>

</template>

<script>
    export default {
        created(){},
        props: {
            storeId: '',
            materials: [],
            isReport: Boolean
        },
        computed: {
            tableData() {
                return this.materials;
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
        data(){
            return {
                // centerDialogVisible: false, //判断显示图片预览显示与隐藏
                // imgLists: [],
                // imgIndex: 0,
            }
        },
        methods:{
            inputNumLimit(bigIndex,index,quantity){
                //上报数量为空或者0的时候，将输入值清空
                if(quantity == '0' || quantity == '' || quantity < 0){
                    this.$message.error('送料数必须大于0');
                    this.$set(this.tableData[bigIndex].materialSkus[index],'quantity','')
                }
                // else if (quantity > 213) {
                //     // 大于本单总占用
                //     this.$message.error('不可大于xx(本单总占用)')
                //     this.$set(this.tableData[bigIndex].materialSkus[index],'quantity','')
                // }
                else{
                    quantity = Number(quantity)
                }
            },
            // // 图片预览
            imgList(row) {
                this.$emit('imgList',row);
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
            changeStatus(id, type) {
                this.$emit('changeStatus',[id],type);
            },
            addMaterialValue(obj,index) {
                this.$set(obj[index],'quantity',obj[index].quantityUnCompleted);
                console.log(obj);
            }
        }
    }
</script>

<style scoped lang="scss">
    .cell__row {
        height: 40px;
        line-height: 40px;
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
        text-decoration: underline;
        color:#808080;
    }
    .all {
        cursor:pointer;
        border-right:1px solid rgb(223, 228, 236);
        height:100%;
        width:50%;
        padding-right:6px;
    }
    .success {
        cursor:pointer;
        height:100%;
        width:50%;
        padding-left:6px;
    }
</style>
<style lang="scss">
    #material-table{
        .el-input__inner{
            border:none;
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
    }
</style>

