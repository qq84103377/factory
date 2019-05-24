<template>
    <div class="workOrderCalculation">
        <page-title title="工单-反算物料">
            <div class="btns">
                <nf-button @click="$emit('toggle')">取消</nf-button>
                <nf-button type="warning" @click="workOrderCalculationSure">确定</nf-button>
            </div>
        </page-title>
        <div>
            <div class="workOrderCalculation-news">
                <content-wrap title="工单信息">

                </content-wrap>
                <div class="workOrderCalculation-news-ct">
                    <span>工单号：{{facPrdOrder.orderNo}}</span>
                    <span>制单日期：{{facPrdOrder.placeorderAt}}</span>
                    <span>优先级：{{facPrdOrder.priority==0?'正常':facPrdOrder.priority==1?'加急':'特级'}}</span>
                    <span> 交货日期:{{facPrdOrder.deliveryAt}}</span>
                    <span> 客户订单号:{{facPrdOrder.customerOrderNo}}</span>
                    <span> 客户款号:{{facPrdOrder.customerSytleNo}}</span>
                    <div class="remark">
                        <div>订单备注：</div>
                        <div v-if="facPrdOrder.remark" v-html="facPrdOrder.remark.replace(/\n/g,'<br/>')"></div>
                    </div>
                </div>
            </div>
            <div class="workOrderCalculation-news" style="margin-top: 16px;">
                <content-wrap title="订货信息">

                </content-wrap>
                <div class="workOrderCalculation-news-ct">
                    <span>商品款号：{{facPrdOrder.styleNo}}</span>
                    <span>客户名：{{facPrdOrder.custName}}</span>
                    <span>供应商：{{facPrdOrder.supplierName}}</span>

                </div>
                <div style="margin-top: 16px;padding-left: 10px;">
                    <p style="margin-bottom: 12px;">主物料：</p>
                    <el-table
                            border
                            :data="demands"
                            style="width: 100%">
                        <el-table-column
                                prop="styleQuantity"
                                label="订货数"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                prop="preActualNum"
                                label="预估实裁数"
                                width="120">
                            <template slot-scope="scope">
                                <span :style="{color:scope.row.preActualNum>0?'green':'red'}">{{scope.row.preActualNum}}</span>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="differenceValue"
                                label="预估差值"
                                width="100">
                            <template slot-scope="scope">
                                <span  :style="{color:scope.row.differenceValue>0?'green':'red'}">{{scope.row.differenceValue}}</span>

                            </template>
                        </el-table-column>

                        <el-table-column
                                prop="adjustmentDifference"
                                label="调后差值"
                                width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.differenceValue&&scope.row.adjustmentDifference">{{scope.row.differenceValue-scope.row.adjustmentDifference}}</span>

                            </template>
                        </el-table-column>
                        <el-table-column label="图片"  width="80">
                            <template slot-scope="scope">
                                <div>
                                    <img style="width:25px;height: 25px;vertical-align: middle;cursor:pointer;"
                                         v-if="scope.row.pictures&&scope.row.pictures.length"
                                         @click="imgList(scope.row)"
                                         :src="scope.row.pictures[0].path?scope.row.pictures[0].path:scope.row.pictures[0]"
                                         alt="">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="分类/物料款号/名称/颜色/规格"
                                width="240">
                            <template slot-scope="scope">
                                <span>{{scope.row.kindName}}/{{scope.row.materialNo}}/{{scope.row.materialName}}/{{scope.row.colorName}}/{{scope.row.specifications}}/</span>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="styleColorNames"
                                label="用于货品颜色"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="styleSizeNames"
                                label="用于货品尺码"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                prop="styleStandardNames"
                                label="用于货品内长"
                                width="140">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="demandQuantity"
                                label="物料需求">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="arriveQuantity"
                                label="已到料">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="singleDosage"
                                label="单件用量">
                        </el-table-column>
                        <el-table-column
                                width="70"
                                prop="lossRate"
                                label="损耗">
                            <template slot-scope="scope">
                                <span v-if="scope.row.singleDosage != null">{{scope.row.singleDosage}}%</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div style="margin-top: 16px;">
                    <span style="margin: 0px 100px 0 8px">调整总数: {{totalCount}}件</span>
                    <span style="color: #999">提示：输入正数指按增加调整，如：10，输入负数指按减少调整，如：-10</span>
                </div>

                <nf-sku-table
                        ref="skuTable"
                        :metadatas="facPrdOrder.sku"
                        style="margin-top: 16px;margin-left: 8px;"
                        @change="(a,b,c) => { countTotalNum(a,b,c,item) }   "
                        :quantities="facPrdOrder.sku"
                        showNum
                        editable
                        editableAndInitial
                        isAdjust
                ></nf-sku-table>
            </div>
        </div>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    </div>
</template>


<script>
    import {getMissionIfoAndMetadata,adjustMission} from '@/api'

    export default {
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                totalCount:0,
                facPrdOrder: {},
                demands: [],
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId: function () {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
        },
        created(){
            this.getMissionIfoAndMetadata()
        },
        methods:{
            // 图片预览
            imgList(row) {

                if(row.pictures&&row.pictures.length>0){
                    if(row.pictures[0].path){
                        this.imgIndex = 0;
                        this.imgLists = row.pictures;
                    }else {
                        this.imgLists = []
                        row.pictures.forEach(item =>{
                            this.imgLists.push({path:item})
                        })
                    }
                }
                this.centerDialogVisible = true;
            },
            getMissionIfoAndMetadata(){
                getMissionIfoAndMetadata({unitId:this.unitId,facMissionId:this.$route.query.id}).then(res=>{
                    console.log(res);
                    if(res.data.code===0){
                        this.facPrdOrder=res.data.data.missionInfo
                        this.demands=res.data.data.demands
                    }else {
                        this.$message.error()
                    }

                })
            },
            countTotalNum(a,total,c, item) {
                //a是sku的值
                this.demands.forEach(mainItem=>{
                    mainItem.adjustmentDifference = 0;
                })
                for (let k in a){
                    this.demands.forEach(mainItem=>{
                        if(mainItem.styleSkuIds.indexOf(a[k].skuId)>-1){
                            mainItem.adjustmentDifference+=Number(a[k].num)
                        }
                    })

                }
                this.demands = [...this.demands];
                this.totalCount = total;

            },
            workOrderCalculationSure(){
                const skuValue = this.$refs['skuTable'].getSkuTableValue();
                let sku = [];
                for (let k in skuValue) {
                    sku.push({skuId: skuValue[k].skuId, quantity: skuValue[k].num})
                }
                adjustMission({factoryMissionId:this.$route.query.id,sku}).then(res=>{
                    if(res.data.code===0){
                        this.$message.success(res.data.msg)
                        this.$emit('toggle')
                    }else {
                        this.$message.error()
                    }

                })
            },
        }
    }
</script>
<style lang="scss">
    .workOrderCalculation {
        .one-key-table th .cell:before {
            content: '*';
            color: #ff4949;
            margin-right: 4px;
        }
        .one-key-table th:nth-child(1) .cell:before {
            content: '';
        }
        .one-key-table th:nth-child(9) .cell:before {
            content: '';
        }
        .one-key-table th:nth-child(10) .cell:before {
            content: '';
        }
    }


</style>
<style scoped lang="scss">
    .workOrderCalculation {
        position: fixed;
        top: 0;
        right: 0;
        width: 1200px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #f0f2f5;
        z-index: 3000;
        padding: 20px;

        .header_right .nf-button {
            width: 98px;
            height: 40px;
            border-radius: 2px;
        }
        .abandoned {
            transform: rotate(30deg) scale(2, 2);
            color: #ccc;
            border: 1px solid #ccc;
            width: 60px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            margin-right: 40px;
            float: right;
        }

        .workOrderCalculation-line {
            height: 1px;
            background: rgba(230, 234, 240, 1);

        }
        .workOrderCalculation-news {
            padding: 24px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
            border-radius: 2px;

            .workOrderCalculation-news-ct {
                padding-left: 14px;
                color: #3B3B3B;
                span {
                    display: inline-block;
                    width: 300px;
                    margin-bottom: 14px;
                }
                .remark {
                    display: flex;
                    width: 900px;
                    div:first-child {
                        min-width: 80px;
                    }
                }
            }
        }
    }
</style>
