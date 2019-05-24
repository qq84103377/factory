<template>
    <div class="orderProduction-table" style="height: 100%;" ref="orderProTable">
        <el-table
            ref="singleTable"
            :data="facPrdOrderList"
            border
            :max-height="tableHeight"
            class="mission"
            style="width: 100%">
            <el-table-column sortable prop="orderNo" label="单据号" width="160" align="center">
            </el-table-column>
            <el-table-column prop="type" label="单据类型" width="160" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.type==0?'预下单':scope.row.type==1?'正式订单':'订单调整单'}}</span>
                </template>
            </el-table-column>
            <el-table-column sortable prop="placeorderAt" label="制单日期" width="140" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.placeorderAt | filterTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="加工厂商" width="120" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.isOutsideFac==1">
                        {{scope.row.commonOutsideFactoryName}}
                    </div>
                    <span v-else>-</span>
                </template>
            </el-table-column>
            <el-table-column label="商品款号" width="200" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                        {{item.styleNo}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="客户" width="120" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                        <span>{{item.custName?item.custName:'-'}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品数量" width="100" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                        {{item.totalNum}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="货期" width="140" align="center">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="item in scope.row.facPrdOrderGoodsCustomerList">
                        {{item.goodsDeliveryAt| filterTime}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建人" prop="createByName" width="140" align="center">
            </el-table-column>
            <el-table-column :label="item.name" width="140" align="center" v-for="item in selectedConfigList" :key="item.id">
                <template slot-scope="scope">
                    <div class="cell__row" v-for="$item in scope.row.facPrdOrderGoodsCustomerList">
                        <span v-if="item.fieldCode!=='goodsPictures' && item.fieldCode!=='goodsDescribe'">{{$item.facPrdOrderGoodsInfoDTO[item.fieldCode]}}</span>
                        <span v-if="item.fieldCode==='goodsDescribe'" v-html="$item.facPrdOrderGoodsInfoDTO.goodsDescribe"></span>
                        <img @click="imgList($item.facPrdOrderGoodsInfoDTO.goodsPictures)" v-if="item.fieldCode==='goodsPictures'&&$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" style="width: 32px;height: 32px;cursor: pointer;margin: 0 auto" :src="$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" alt="" >
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="buyNo" label="采购单号" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.buyNo|| '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="concatPrdOrderNo" label="关联订单号" width="140" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="下单类型" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.placeOrderType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="状态" width="140" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.statusName}} <span
                            v-if="scope.row.statusRemark">({{scope.row.statusRemark}})</span></span>
                    <p>{{scope.row.auditorUsers}}</p>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="审批备注" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.lastReviewLog}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="zip" label="操作" fixed="right" width="180" class-name="cellHeight" align="center">
                <template slot-scope="scope">
                    <div class="opera">
                        <el-button class="blue" @click="goDetail(scope.row.facPrdOrderId)">查看</el-button>
                        <!-- <div class="blue" @click="check(scope.row)">转工单</div> -->
                        <div @click="taskPass(scope.row.taskId,true,scope.row)">
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'">通过</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='ANTI_REVIEW'">批准</el-button>
                        </div>
                        <div>
                            <el-button :loading="scope.row.btnLoading" class="blue" v-if="scope.row.taskName==='NORMAL_REVIEW'" @click="taskUnPassDialogGo(scope.row.taskId)">驳回</el-button>
                            <el-button :loading="scope.row.btnLoading" class="blue" @click="taskPass(scope.row.taskId,false,scope.row)" v-if="scope.row.taskName==='ANTI_REVIEW'">不批准</el-button>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {billReviewConfigStatus,getFieldConfig} from '@/api'
    export default {
        name: "orderTable",
        props:{
            facPrdOrderList:Array,
        },
        data(){
            return{
                selectedConfigList:[],
                tableHeight: 300,
            }
        },
        created(){
            this.getSelectedConfigList()
        },
        mounted() {
            this.$nextTick(() => {
                let self = this;
                this.tableHeight = this.$refs.orderProTable.offsetHeight
                // 通过捕获系统的onresize事件触发去改变原有的高度
                window.onresize = function() {
                    self.tableHeight = self.$refs.orderProTable.offsetHeight
                }
            })
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
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
        methods:{
            //跳转详情页面
            goDetail(id){
                this.$emit('goDetail',id)
                // let type='formal';
                // this.$router.push({
                //     path:'/orderProductioDetail',
                //     query:{id,type},
                //
                // })
            },
             getSelectedConfigList(){
                getFieldConfig({unitId:this.facId}).then(res=>{
                    if(res.data.code === 0){
                        this.selectedConfigList = res.data.data.selectedConfigList;
                    }
                })
            },
            //通过
            taskPass(taskId,type,row){
                this.$emit('taskPass',taskId,type,row)
                // let obj = {
                //     taskId,
                //     message:'',
                //     result:type,
                //     userId:this.userId
                //
                // }
                // billReviewConfigStatus(obj).then(res=>{
                //     console.log(res);
                //     if(res.data.code===0){
                //         this.$emit('getNewData');
                //         this.$message.success('操作成功')
                //     }else {
                //         this.$message.error(res.data.msg)
                //     }
                //
                // })
            },
            //驳回
            taskUnPassDialogGo(taskId){
                this.$emit('taskUnPassDialogGo',taskId)
            },
        }
    }
</script>

<style scoped lang="scss">
    .orderProduction-table {
    .opera {
        display: flex;
        justify-content: space-between;
        /*justify-content: center;*/
        align-items: center;
        /*padding: 0 24px;*/
        box-sizing: border-box;
        height: 100%;
    }
    .line {
        height: 32px;
        width: 1px;
        background-color: rgba(230, 234, 240, 1);
    }
    .blue {
        font-size: 12px;
        display: flex;
        /*justify-content: space-between;*/
        justify-content: center;
        align-items: center;
        color: #1CA1FF;
        text-decoration: underline;
        cursor: pointer;
        text-align: center;
        height: 100%;
        border: none;
        background-color: transparent;
        padding: 10px;
    }
        .cell__row {
            height: 32px;
            line-height: 32px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
            &:last-child {
                border: none;
            }
        }
    }
</style>
<style lang="scss">
    @import '../../../assets/style/el-table.scss';
    .orderProduction-table {
        .el-table td .cell {
            line-height: 18px;
            padding: 0;
        }
    }
    .cellHeight .cell{
        height: 100%;
    }
</style>