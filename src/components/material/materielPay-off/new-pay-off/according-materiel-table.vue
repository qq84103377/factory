<template>
    <div>

        <el-table
                v-if="canShow"
                id="material-table"
                class="material-table no-cell-padding no-hover-highlight"
                border :data="tableData">
                <!-- 计划外物料 -->
                <template v-if="type == 'outside'">
                    <el-table-column label="商品款号" align="center" v-if="!isSampleMaterial" width="140">
                        <template slot-scope="scope">
                            <p>{{styleNo}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="送料工厂" align="center" v-if="type == 'outside'&&!isSampleMaterial" >
                        <template slot-scope="scope">
                            <el-select v-model="factoryId" placeholder="请选择" @change="select" :disabled="outsideFactoryId!=='init'">
                                <el-option
                                v-for="item in facList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="分类" prop="kindName" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{ item.kindName ||　item.kindsName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="120" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">
                                <img style="height: 28px;width: 80px;margin-top:2px"
                                     @click="imgList(item)"
                                     v-if="item.commonMaterialsPictureList && item.commonMaterialsPictureList.length"
                                     :src="item.commonMaterialsPictureList[0].path || item.commonMaterialsPictureList[0]"
                                     alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="物料款号" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{ item.materialsNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商" align="center" width="140" prop="supplierName">
                        <template slot-scope="scope">
                            <div class="cell__row"  v-for="(item,index) in scope.row.list" :key="index">{{ item.supplierName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商款号/色号" prop="supplierStyleNo" width="130" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{item.supplierStyleNo}}/{{item.supplierColorNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="物料名称" prop="name" align="center">
                        <template slot-scope="scope">
                            <div  class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{ item.materialsName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="颜色" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row"  v-for="(item,index) in scope.row.list" :key="index">
                                {{ item.colorName }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格" width="120" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row"  v-for="(item,index) in scope.row.list" :key="index">
                                <span>{{ item.specificationsName?item.specificationsName:item.specificationsNo}} </span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="仓位" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">
                                {{ item.position }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="样料" align="center" width="140" prop="supplierName" v-if="isSampleMaterial && !noSampleMaterial">
                        <template slot-scope="scope">
                            <div class="cell__row"  v-for="(item,index) in scope.row.list" :key="index">{{ item.sampleMaterial? '样料': '' }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存单位" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{ item.unit ||　item.stockUnitName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="storeId?'可用数':'可用库存'" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">{{item.availableStock}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="storeId?'库存数':'总库存'" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row" :class="{'green':item.stock>item.waitDeliveryQuantity,'red':item.stock<item.waitDeliveryQuantity}"  v-for="(item,index) in scope.row.list" :key="index">{{ item.stock }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="本次送料" fixed="right" align="center">
                        <template slot-scope="scope">
                            <div class="cell__row gray" :class="{'bg-yellow':type == 'outside'}" v-for="(item,index) in scope.row.list" :key="index">
                                <el-input @blur="checkInput" type="number" placeholder="请输入" v-model="item.quantity" :class="{'bg-yellow':type == 'outside'}"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" :width="type =='outside'? '100' :'300'" align="center" fixed="right">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="(item,index) in scope.row.list" :key="index">
                                <div class="cell__opera">
                                    <div class="cell__opera-right deleted" style="width: auto" v-if="item.status!==1" @click="deleteTa(scope.row,scope.$index,item,index)">
                                        删除
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </template>
            <template v-else>
                <!-- 按需物料 -->
                <el-table-column label="商品款号" v-if="configArr.includes('商品款号')" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.styleNo }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="生产单号" v-if="configArr.includes('生产单号')" width="160" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.facMissionNo }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="送料工厂" width="160" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.factoryName || '-'   }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="分类" v-if="configArr.includes('分类')" prop="kindName" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">{{ scope.row.kindName }}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="configArr.includes('图片')" label="图片"  width="80" align="center">
                    <template slot-scope="scope">
                        <img style="height: 30px;width: 80px;margin-top:2px"
                             @click="imgList(scope.row)"
                             v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                             :src="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length?scope.row.commonMaterialsPictureList[0].path:''"
                             alt="">
                    </template>
                </el-table-column>
                <el-table-column label="物料款号" v-if="configArr.includes('物料款号')" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">{{ scope.row.materialsNo }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" v-if="configArr.includes('供应商')" align="center" width="140" prop="supplierName">
                    <template slot-scope="scope">
                        <div class="cell__row" >{{ scope.row.supplierName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="供应商款号/色号" v-if="configArr.includes('供应商款号/色号')" prop="supplierStyleNo" width="130" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="物料名称" v-if="configArr.includes('物料名称')" prop="name" align="center">
                    <template slot-scope="scope">
                        <div style="font-size:12px;padding:0 10px;">{{ scope.row.materialsName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="颜色" v-if="configArr.includes('颜色')" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">
                            {{ scope.row.colorName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="规格" v-if="configArr.includes('规格')" width="120" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">
                            <span>{{ scope.row.specificationsRemark?scope.row.specificationsRemark:scope.row.specificationsNo}} </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="仓位" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">{{ scope.row.position }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库存单位" v-if="configArr.includes('单位')" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row">{{ scope.row.unit }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="物料需求" v-if="configArr.includes('物料需求')" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.planBuyQuantity }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="主动占用" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.stockActivePreuse }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="本单总占用" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.selfPreuseTotal }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已采购" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.quantityPurchased }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已到料" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.quantityArrived }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已送料" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" :class="{'yellow':item.quantityDelivered>0}" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.quantityDelivered }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="待送料" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" :class="{'yellow':item.waitDeliveryQuantity>0}" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.waitDeliveryQuantity }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="可用库存" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.availableStock }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="总库存" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row" :class="{'green':item.stock>item.waitDeliveryQuantity,'red':item.stock<item.waitDeliveryQuantity}" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.stock }}</div>
                    </template>
                </el-table-column>
                <!--<el-table-column label="单件用料" v-if="configArr.includes('单件用料')" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.singleDosage }}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="用料货品数" v-if="!source && configArr.includes('用料货品数')" width="140" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.skuQuantity }}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="损耗率" v-if="configArr.includes('损耗率')" align="center">-->
                    <!--<template slot-scope="scope">-->
                        <!--<div class="cell__row" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">{{ item.lossRate+'%' }}</div>-->
                    <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="本次送料" align="center">
                    <template slot-scope="scope">
                        <div class="cell__row gray" v-for="item in scope.row.missionBoms" :key="item.materialSkuId">
                            <el-input placeholder="请输入" v-model="item.quantity" type="number"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div class="cell__row" v-for="(item,index) in scope.row.missionBoms" :key="item.materialSkuId">
                            <div class="cell__opera">
                                <div class="cell__opera-left" v-if="item.status!==1">
                                    <div style="width:50%;text-decoration: underline;"  @click="addMaterialValue(scope.row.missionBoms,index)">
                                        一键填齐
                                    </div>
                                    <div style="width:50%;text-decoration: underline;"@click="changeStatus(scope.row.missionBoms,index)">
                                        标为完成
                                    </div>
                                </div>
                                <div class="cell__opera-left green" v-if="item.status===1">
                                    已完成
                                </div>
                                <div class="cell__opera-right deleted" v-if="item.status!==1" @click="deleteTa(scope.row,scope.$index,scope.row.missionBoms,index)">
                                    删除
                                </div>
                                <div class="cell__opera-right deleted" v-if="item.status===1" @click="change0(scope.row.missionBoms,index)">
                                    撤销
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </template>

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
import {getFactorys} from '@/api';
export default {
    created(){
        this.getFactorys()
        // PURCHASE 采购单, ARRIVE 到料单, DELIVER 送料单, RETURN 退料单
        this.getConfigArr('DELIVER');
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
            canShow: false      //控制是否显示表格
        }
    },
    props: ['materials','source','type','factoryIdOutSide','isSampleMaterial','outsideFactoryId','noSampleMaterial','styleNo','storeId'],
        // source:'', 重编辑
        // type:'', 区分是否是 3：计划外还是 :2：按需
        // factoryIdOutSide: '', 送料工厂id
        // isSampleMaterial: false 是否是样料
        // outsideFactoryId: 外发厂id
    //storeId : 送料仓库ID
    watch: {
        factoryIdOutSide(v) {
            console.log(v,'878')
            this.factoryId = v
        },
        //生产单号选中后送料工厂不能改变
        outsideFactoryId(v) {
            console.log(v);
            if(v!=='init'){
                this.factoryId = v
            }
        },
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
        checkInput(e) {
            if(e.target.valueAsNumber<0){
                this.$message.error('请输入正数')
            }
            // else if (e.target.valueAsNumber>123&&this.canShow){
            //     // 大于可用库存
            //     this.$message.error('不可大于xx(可用库存)')
            // }else if (e.target.valueAsNumber>123&&!this.canShow){
            //     // 大于可用库存
            //     this.$message.error('不可大于xx(可用库存)')
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
        // 工厂改变
        select(v) {
            console.log(88888)
            this.$emit('factoryIdChange', this.factoryId)
        },
        //判断送料输入值
        quantityChange(quantity,stock) {
            if (quantity*1 > stock*1) {
                this.$message.error('本次送料数量不可大于库存数量')
            }
            quantity = 0
        },
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
        imgList(row) {
            console.log(row.commonMaterialsPictureList);
            if(row.commonMaterialsPictureList[0].path){
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList;
            }else {
                this.imgLists = []
                row.commonMaterialsPictureList.forEach(item =>{
                    this.imgLists.push({path:item})
                })
            }

            this.centerDialogVisible = true;
        },
        filterNums(val) {
            if((/(^[1-9]([0-9]+)?(\.[0-9]{1,3})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/).test(val.quantity)) {
            }else {
                // console.log(1);
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
        },
        deleteTa(row,ind,val,index) {
            if(this.type == 'outside') {
                if (row&&row.list.length>1) {
                    row.list.splice(index,1);
                } else {
                    this.tableData.splice(ind,1)
                }
                this.$emit('deleteRow',val,'outside');
            } else {
                if(row.missionBoms&&row.missionBoms.length>1) {
                    val.splice(index,1);
                }else {
                    this.tableData.splice(ind,1);
                    this.$emit('deleteRow',row);
                }
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
</style>
<style lang="scss">
@import '../../../../assets/style/el-table.scss';
    #material-table{
        .el-input__inner{
            border:none;
        }
        .gray {
            .el-input__inner{
                width:80px;
            }
            .bg-yellow{
                .el-input__inner{
                    background-color: #FFF9ED;
                }
            }
        }
        .el-table .cell {
            text-align: center;
            font-size: 12px;
        }
    }
</style>

