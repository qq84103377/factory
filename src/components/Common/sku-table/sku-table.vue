<template>
    <div class="nf-sku-table">
        <el-table
            :data="colorArr"
            border
            style="width: 100%;font-size: 12px;">
                <el-table-column
                    class-name="nf-sku-table__standard--column"
                    width="200"
                    align="center"
                    fixed
                    label="规格">
                    <template slot-scope="scope">
                        <el-row
                            class="standard"
                            type="flex">
                            <div class="standard--left">
                                {{ scope.row.color_no_name }}
                            </div>
                            <div class="standard--right" v-if="isShowLength&&!skc">
                                <p class="standard__length" v-for="lengthItem in lengthArr" :key="lengthItem.standard_id">{{ lengthItem.standard_value }}</p>
                            </div>
                            <div class="standard--right" v-if="isShowLength&&skcCode">
                                <p class="standard__length" v-for="lengthItem in lengthArr" :key="lengthItem.standard_id">{{ lengthItem.standard_value }}</p>
                            </div>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="skc"
                    class-name="nf-sku-table__standard--column"
                    width="120"
                    align="center"
                    label="数量">
                    <template slot-scope="scope">
                        <input @input="handleInputSkc(scope.row.num,scope.$index)" v-if="editable&&!skcCode ||　lengthArr.length === 0&&editable" style="width: 100%;padding-left: 14px;box-sizing: border-box;"  type="number" class="text-center" v-model="scope.row.num" >
                        <p v-if="!editable">{{scope.row.num}}</p>
                        <div style="border-bottom:1px solid #dfe4ec" v-if="lengthArr.length>0&&skcCode&&editable"  v-for="lengthItem in scope.row.lengthArr" :key="lengthItem.standard_id">
                            <div>
                                <input  style="width: 100%;padding-left: 14px;box-sizing: border-box;"  type="number" v-model="lengthItem.num">
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="90"
                    v-if="editable&&!skc&&!sizeConfig"
                    align="center"
                    label="一手">
                    <template slot-scope="scope">
                        <!--不显示内长-->
                        <div class="hand-input" v-if="!isShowLength">
                            <nf-sku-table-once-input
                                v-bind="{
                                    skuVal: currentSkuVal,
                                    colorItem: scope.row,
                                    isShowLength: isShowLength,
                                    isAdjust: isAdjust,
                                }">
                            </nf-sku-table-once-input>
                        </div>
                        <!--显示内长-->
                        <div class="hand-input" v-if="isShowLength">
                            <nf-sku-table-once-input
                                ref="skuTableOnceInput"
                                v-for="lengthItem in lengthArr"
                                :key="lengthItem.standard_id"
                                v-bind="{
                                    skuVal: currentSkuVal,
                                    lengthItem: lengthItem,
                                    colorItem: scope.row,
                                    isShowLength: isShowLength,
                                    isAdjust: isAdjust,
                                }">
                            </nf-sku-table-once-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="90"
                    v-if="sizeConfig"
                    align="center"
                    label="数量">
                    <template slot-scope="scope">

                        <div class="hand-input" v-if="!isShowLength">
                             <input v-model="scope.row.codeConfigNum" @input="codeRatioConfigSelChange(scope.row,scope.$index)" class="hand-input--inner" type="number"  />
                        </div>
                        <div class="hand-input" v-if="isShowLength">
                            <input v-model="lengthItem.codeConfigNum[scope.$index]" @input="codeRatioConfigSelChange(lengthItem,scope.$index)"   v-for="(lengthItem,index) in lengthArr" :key="lengthItem.standard_id" class="hand-input--inner" type="number"  />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    width="160"
                    v-if="sizeConfig"
                    align="center"
                    label="码比组">
                    <template slot-scope="scope">

                        <div class="hand-input" v-if="!isShowLength">
                            <el-select @change="codeRatioConfigSelChange(scope.row,scope.$index)" v-model="scope.row.codeConfigSelId"  placeholder="请选择">
                                <el-option :disabled="!codeRatioConfigSel || !codeRatioConfigSel.length"
                                           v-for="codeConfigItem in codeRatioConfigSel"
                                           :key="codeConfigItem.id"
                                           :label="codeConfigItem.name"
                                           :value="codeConfigItem.id"
                                        >
                                </el-option>
                            </el-select>
                        </div>
                        <div class="hand-input" v-if="isShowLength">
                            <el-select @change="codeRatioConfigSelChange(lengthItem,scope.$index)" v-model="lengthItem.codeConfigSelId[scope.$index]" v-for="lengthItem in lengthArr" :key="lengthItem.standard_id"  placeholder="请选择">
                                <el-option :disabled="!codeRatioConfigSel || !codeRatioConfigSel.length"
                                           v-for="codeConfigItem in codeRatioConfigSel"
                                           :key="codeConfigItem.id"
                                           :label="codeConfigItem.name"
                                           :value="codeConfigItem.id"
                                       >
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <!-- 渲染尺码列 -->
                <el-table-column
                    v-if="!skc"
                    width="90"
                    align="center"
                    :label="sizeItem.sizeTypeCategory?sizeItem.size_value+'-'+sizeItem.sizeTypeCategory:sizeItem.size_value "
                    v-for="sizeItem in sizeArr"
                    :key="sizeItem.size_id" >
                    <template slot-scope="scope">
                        <!--不显示内长-->
                        <template v-if="!isShowLength">
                            <div class="hand-input" v-if="editable">
                                <nf-sku-table-input
                                        :skuVal.sync="currentSkuVal"
                                    :isAdjust="isAdjust"
                                    v-bind="{
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        showNum: showNum,
                                        isShowLength: isShowLength
                                    }">
                                </nf-sku-table-input>
                            </div>
                            <nf-sku-table-text
                                v-if="!editable"
                                :skuVal.sync="currentSkuVal"
                                v-bind="{
                                    sizeItem: sizeItem,
                                    colorItem: scope.row,
                                    showNum: showNum,
                                    submatrixFlag: submatrixFlag,
                                    showExceedNum: showExceedNum,
                                    isShowLength: isShowLength
                                }">
                            </nf-sku-table-text>
                        </template>
                        <!--显示内长-->
                        <template v-if="isShowLength">
                            <div class="hand-input" v-if="editable">
                                <nf-sku-table-input
                                        :isAdjust="isAdjust"
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }">
                                </nf-sku-table-input>
                            </div>
                            <div class="size" v-if="!editable">
                                <nf-sku-table-text
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        submatrixFlag:submatrixFlag,
                                        showExceedNum:showExceedNum,
                                        lengthItem: lengthItem,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        showNum: showNum,
                                        isShowLength: isShowLength
                                    }">
                                </nf-sku-table-text>
                            </div>
                        </template>

                    </template>
                </el-table-column>
                <!-- 渲染尺码列---end -->
                <el-table-column
                    class-name="nf-sku-table__standard--column"
                    label="合计"
                    width="90"
                    align="center"
                    v-if="(editable || noEditButCount)&&!skc">
                        <template slot-scope="scope">
                            <div class="size" v-if="!isShowLength">
                                <nf-sku-table-count
                                    @getMessage="getVal"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-count>
                            </div>
                            <div class="size" v-if="isShowLength">
                                <nf-sku-table-count
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    @getMessage="getVal"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-count>
                            </div>
                        </template>
                </el-table-column>
        </el-table>
    </div>
</template>

<script>
import NfSkuTableText from './sku-table-text';
import NfSkuTableInput from './sku-table-input';
import NfSkuTableOnceInput from './sku-table-once-input';
import NfSkuTableCount from './sku-table-count';
import mixin from './sku-table-mixin';
import { log } from 'util';
export default {
    componentName: 'NfSkuTable',
    props: {
        // sku数组
        metadatas: {
            type: Array,
            default: (() => [])
        },
        // 带有上报过数据的sku列表
        quantities:Array,
        skc: Boolean,     //按照颜色填数  生产订单预下单界面
        noEditButCount: Boolean,
        sizeConfig: Boolean,
        editableAndInitial: Boolean,
        editable: Boolean,
        showNum: Boolean, // 是否只显示单个字段num，不显示finisNum
        skuListCustomerIndex: String, // 是否只显示单个字段num，不显示finisNum
        pageAttributes: String, // 页面属性（一个页面用多次用这个组件时候为multiComponent 生产订单编辑
        skcCode: Boolean, // 码比数使用
        isAdjust: Boolean, //是否调整单页面
        totalsNum:Array,//存储颜色对应的总数
        codeRatioConfigSel:Array,//存储码比配置码比组
        skcTotal:Boolean,
        submatrixFlag:String,  //子矩阵标识，没有目标数时不显示目标数
        showExceedNum:Boolean,  //超额标识，显示超额数
    },
    mixins: [mixin],
    components: {
        NfSkuTableText,
        NfSkuTableInput,
        NfSkuTableOnceInput,
        NfSkuTableCount
    },
    data() {
        return {
            totalNums:[],//存储总的数量
            quantities:[],
            tableData: {},
            currentSkuVal: {},
            backupCurrentSkuVal: {} // sku数据备份，方便currentSkuVal改变后可以回退数据
        }
    },
    computed: {
        // 多客户的时候点击的index
        skuListCustomerIndexSx() {
            return this.skuListCustomerIndex;
        },
        colorArr() {
            return this.tableData['colorArr'];
        },
        lengthArr() {
            return this.tableData['lengthArr'];
        },
        sizeArr() {
            return this.tableData['sizeArr'];
        },
        isShowLength() {
            return this.lengthArr.length;
        },
        // 总
        quantitiesNew() {
            return this.quantities;
        },
        // 总数
        totalQuality() {
            return Object.keys(this.currentSkuVal).reduce((num, key) => {
                num += Number(this.currentSkuVal[key].num);
                return num;
            }, 0);
        }
    },
    watch: {
        // 客户填数后重新  quantities值变化后，给skyVal重新赋值
        'quantitiesNew':function(val) {
            //一个页面引入多次这个组件
            if(this.pageAttributes === 'multiComponent'){
                if(JSON.stringify(this.quantitiesNew)===JSON.stringify(val)) return
            }
            this.initSkuValData();
            this.backupCurrentSkuVal = JSON.parse(JSON.stringify(this.currentSkuVal));
            this.addEditNums();
        },
        'currentSkuVal': {
            handler(val) {
                 // this.$emit('change', val, this.totalQuality,this.skuListCustomerIndexSx);
                this.$emit('change', val, this.totalQuality,this.skuListCustomerIndexSx,this.skuKey);
            },
            deep: true
        },
        'colorArr': {
            handler(val) {
                if(this.skc){
                    this.$emit('skcChange', val);
                }
            },
            deep: true
        },
        // 上报成功后重新
        'metadatas'(val) {
            this.tableData = this.getTableData(this.metadatas);
            this.currentSkuVal = this.tableData['skuVal'];
            if (!this.editable || this.editableAndInitial) {
                this.initSkuValData();
                this.backupCurrentSkuVal = JSON.parse(JSON.stringify(this.currentSkuVal));
            }
        },
    },
    created() {
        let data;
        if(this.skc){
            data = this.quantities
        }
        this.tableData = this.getTableData(this.metadatas,data);
        if(this.skcTotal){
            this.colorArr.forEach(v =>{
                if (this.totalsNum){
                    this.totalsNum.forEach(vl =>{
                        if(v.color_id==vl.color_id){
                            v['num'] = vl.num;
                        }
                    });
                }

            });
            // console.log("表格数据：",this.totalsNum);
        }
        this.currentSkuVal = this.tableData['skuVal'];
        //当组件处于编辑状态时，给skyVal增加“实裁数/目标数”和“完成数”两个值，用于计算弹窗上报未完成数
        if(this.editable){
            this.addEditNums();
        }
        if (!this.editable || this.editableAndInitial) {
            this.initSkuValData();
            this.backupCurrentSkuVal = JSON.parse(JSON.stringify(this.currentSkuVal));
        }
    },
    methods: {
        //码比配置填数
        codeRatioConfigSelChange(lengthItem,rowIndex){
            console.log(lengthItem);
            let sizeConfigArr ={};
            console.log(this.codeRatioConfigSel);
            this.codeRatioConfigSel.forEach(item=>{
                if(this.isShowLength){
                    if(item.id===lengthItem.codeConfigSelId[rowIndex]){
                        sizeConfigArr = item
                    }
                }else {
                    if(item.id===lengthItem.codeConfigSelId){
                        sizeConfigArr = item
                    }
                }

            });
            //获取总数
            let sizeSum = 0;
            if(sizeConfigArr.sizeCodeRatioCateList){
                sizeConfigArr.sizeCodeRatioCateList.forEach(item=>{
                    sizeSum+=item.sizeRatio?Number(item.sizeRatio):0
                });
            }
            // // 备份颜色和内长id
            // this.metadatas.forEach(item=>{
            //     this.quantities.forEach($item=>{
            //         if($item.skuId===item.id){
            //             $item.color_id = item.color_id
            //             $item.standard_id = item.standard_id
            //         }
            //     })
            // });

            //给quantities赋值当前的值

            this.quantities.forEach(item=>{
                for (let k in this.currentSkuVal){
                    if(item.skuId===this.currentSkuVal[k].skuId){
                        item.num = this.currentSkuVal[k].num
                    }
                }
            })

            this.metadatas.forEach(item=>{
                if(sizeConfigArr.sizeCodeRatioCateList){
                    sizeConfigArr.sizeCodeRatioCateList.forEach(sizeItem=>{
                        if((!this.isShowLength || item.standard_id===lengthItem.standard_id)&&sizeItem.sizeId===item.size_id){

                            this.quantities.forEach(codeRatioConfigQuantitiesItem=>{
                                if(codeRatioConfigQuantitiesItem.skuId===item.id && (!this.isShowLength || codeRatioConfigQuantitiesItem.standard_id===lengthItem.standard_id )&& codeRatioConfigQuantitiesItem.rowIndex==rowIndex){
                                    if(this.isShowLength){
                                        if(sizeSum && lengthItem.codeConfigNum[rowIndex]){
                                            this.$set(codeRatioConfigQuantitiesItem,'num',Math.round(Number(lengthItem.codeConfigNum[rowIndex])*(sizeItem.sizeRatio/sizeSum)))

                                        }else {
                                            this.$set(codeRatioConfigQuantitiesItem,'num',0)

                                        }
                                    }else {
                                        if(sizeSum && lengthItem.codeConfigNum){
                                            this.$set(codeRatioConfigQuantitiesItem,'num',Math.round(Number(lengthItem.codeConfigNum)*(sizeItem.sizeRatio/sizeSum)))

                                        }else {
                                            this.$set(codeRatioConfigQuantitiesItem,'num',0)

                                        }
                                    }


                                }
                            })
                        }
                    })
                }

            })
            // this.$emit('codeRatioConfigSelIsChange',lengthItem.codeConfigSelId)
            this.initSkuValData();
        },

        getVal(val){
            // console.log("组件传回来的参数：",val);
            if(JSON.stringify(this.totalNums).indexOf(val.color_id)==-1 ){
                this.totalNums.push(val);
            }
        },
        // 父组件通过这个方法拿到这个页面的总数的对象
        getToVal(){
            return this.totalNums;
        },
        toggleCurrentSkuVal() {
            for(let item in this.currentSkuVal) {
                this.currentSkuVal[item].num = this.currentSkuVal[item].num !== ''?-this.currentSkuVal[item].num:''
            }
        },
        handleInputSkc(val,index){
            if(val<1){
                this.$set(this.colorArr[index],'num',0)
            }
        },
        //触发一手的值
        skuTableOnceInputGo(){
            this.$refs['skuTableOnceInput'].forEach(item=>{
                item.handleInput()
            })
            // this.$refs['skuTableOnceInput'].handleInput()
        },
        // 当不是编辑状态时，获取值
        initSkuValData() {
            if(this.quantities){
                this.quantities.forEach(item => {
                    Object.keys(this.currentSkuVal).forEach(key => {
                        if (this.currentSkuVal[key].skuId === item.skuId) {
                            this.currentSkuVal[key] = { ...item };
                        }
                    });
                });
            }

        },
        addEditNums(){
            if(this.quantities){
                this.quantities.forEach(item => {
                    Object.keys(this.currentSkuVal).forEach(key => {
                        if (this.currentSkuVal[key].skuId === item.skuId) {
                            //有调整数的时，currentNum = 完成数 - 调整数
                            if(item.adjustNum){
                                this.currentSkuVal[key].currentNum = item.finishNum - item.adjustNum;
                            }
                            //无调整数的时，currentNum = 完成数
                            else{
                                this.currentSkuVal[key].currentNum = item.finishNum;
                            }
                            this.currentSkuVal[key].totalNum = item.num;
                        }
                    });
                });
            }
        },
        resetSkuTableData() {
            // 输入框值
            Object.keys(this.currentSkuVal).forEach(key => {
                this.currentSkuVal[key].num = '';
            });
            // reset一手子组件的输入框值
            this.broadcast('NfSkuTableOnceInput', 'sku.table.once.input.initFn');
        },
        // 给父组件获取currentSkuVal数据
        getSkuTableValue() {
            return this.currentSkuVal;
        },
        getBackUpSkuTableValue() {
            return this.backupCurrentSkuVal;
        },
        // 主要提供给外部需要修改currentSkuVal值时调用
        setColorArr(arr) {
            this.colorArr = arr;
        },
        setCurrentSkuVal(value) {
            this.currentSkuVal = value;
        },
        getColorArr() {
            return this.colorArr
        }
    }
}
</script>

<style lang="scss">
    .nf-sku-table {
        max-width:100%;
        display: inline-block;
        -webkit-user-select: none;
        .hand-input--inner{
            background-color: #FFF9ED;
        }
        &__standard--column {
            color: #A2ABB8;
        }
        th {
            background-color: #F5F7FA;
        }
        th > .cell {
            font-weight: normal;
            color: #A2ABB8;
            background-color: #F5F7FA;
        }
        .el-table__body {
            .cell,
            td {
                padding: 0;
                line-height: 40px;
                background: #fff;
            }
        }
        .standard {
            background-color: #F5F7FA;
            &--left {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            &--right {
                display: flex;
                flex-direction: column;
                width: 50%;
                border-left: 1px solid rgb(223, 228, 236);
                .standard__length {
                    flex: 1;
                    /*height: 40px;*/
                    box-sizing: border-box;
                    &:not(:last-child) {
                        border-bottom: 1px solid rgb(223, 228, 236);
                    }
                }
            }
        }

        .hand-input {
            &--inner {
                display: block;
                height: 40px;
                width: 100%;
                box-sizing: border-box;
                cursor: pointer;
                padding-left: 15%;
            }
            & > div {
                border-bottom: 1px solid rgb(223, 228, 236);
                &:last-child {
                        border-bottom: none;
                }
            }
            & > input {
                border-bottom: 1px solid rgb(223, 228, 236);
                &:last-child {
                    border-bottom: none;
                }
            }
        }

        .size {
            &__value {
                 height: 40px;
                box-sizing: border-box;
                &:not(:last-child) {
                    border-bottom: 1px solid rgb(223, 228, 236);
                }
            }
        }

        .el-table::after, .el-table::before{
            background-color:transparent;
        }
    }
</style>


