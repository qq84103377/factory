<template>
    <!--子矩阵-->
    <div class="submatrix">
        <div class="submatrix-bg">
            <div class="submatrix-item" v-for="item in submatrixData" :key="item.outsideFactoryId">
                <el-col :span="24" class="node-table-title">
                    <el-col :span="12" style="color: #555555;">
                        <nf-button
                                style="margin-right:10px;"
                                class="report-btn"
                                type="success"
                                @click="reprot('finishNum', 'part', item)">上报完成数
                        </nf-button>
                        <nf-button
                                v-if="allowBillAdjustNum"
                                style="margin-right:10px;"
                                class="report-btn"
                                type="warning"
                                @click="reprot('changeNum', 'part', item)">上报调整数
                        </nf-button>
                        <span>{{item.outsideFactoryName}}</span>
                        <span v-if="!item.username">：</span>
                        <span v-else> - {{item.username}}：</span>
                        <!--完成数-->
                        <template v-if="skuRadio === 0">
                            <span>完成数：</span>
                            <span style="color:#1ca1ff;">{{item.completed}}</span>
                             <!--通过上游节点和节点选中外发节点   判断是否显示目标数  -->
                            <span v-if="!submatrixFlag">/ {{item.target}}</span>
                        </template>
                        <!--未完成数-->
                        <template v-if="skuRadio === 1">
                            <span>未完成数：</span>
                            <span>{{(item.target-item.completed)>0?(item.target-item.completed):0}}</span>
                            <!--通过上游节点和节点选中外发节点   判断是否显示目标数  -->
                            <span v-if="!submatrixFlag">/ {{item.target}}</span>
                        </template>
                        <!--调整数-->
                        <span class="adjust-num" v-if="item.adjustNum">（调{{item.adjustNum}}）</span>
                    </el-col>

                </el-col>
                <!-- 表格 -->
                <el-col :span="24" class="node-list-content">
                    <nf-sku-table
                            ref="staticSkuTable1"
                            :submatrixFlag='submatrixFlag'
                            :metadatas="metadatas"
                            :quantities="item.quantities"
                            style="margin-top: 20px">
                    </nf-sku-table>
                </el-col>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getSubmatrixData,
    } from "@/api";

    export default {
        props: {
            skuRadio: Number,      // 类型
            missionNodeId: String,
            allowBillAdjustNum: Boolean,    //是否调整数
            metadatas: {            // 物料sku
                type: Array,
                default: []
            }
        },
        name: "submatrixComponents",
        data() {
            return {
                submatrixData: [],      //子矩阵数据
                submatrixDataBf: [],      //子矩阵数据备份
                submatrixFlag:'null',     //1.submatrixFlag==‘no_show_targets’的时候=>表示外发厂子矩阵不显示目标数 2.submatrixFlag==‘show_targets’的时候=>表示外发厂子矩阵显示目标数
            }
        },
        created() {
            this.getSubmatrixData()
        },
        watch: {
            skuRadio(val) {
                this.handleFilterSkuData(val)
            }
        },
        methods: {
            //获取子矩阵数据
            getSubmatrixData() {
                let params = {
                    missionPrcdNodeId: this.missionNodeId,
                };
                getSubmatrixData(params).then(res => {
                    if (res.data.code === 0) {
                        this.submatrixData = res.data.data;
                        if (this.submatrixData.length) {
                            // this.submatrixFlag = !(this.submatrixData[0].status);
                            if(!this.submatrixData[0].status){
                                //后台返回status==false的时候=>表示外发厂子矩阵不显示目标数
                                this.submatrixFlag = "no_show_targets"
                            }
                            //唯一一种 外发厂子矩阵 显示目标数成立的就是后台返回的 status==true
                            else {
                                this.submatrixFlag = "show_targets"
                            }
                        }
                        // 把外发厂信息存储到状态
                        this.$store.dispatch("getOutsideFactoryList", this.submatrixData);
                        this.submatrixDataBf = JSON.parse(JSON.stringify(res.data.data));
                    }
                })
            },
            handleFilterSkuData(val) {
                let submatrixDataBf = JSON.parse(JSON.stringify(this.submatrixDataBf));
                //未完成数需要计算
                if (val === 1) {
                    submatrixDataBf.forEach(item => {
                        item.quantities.forEach($item => {
                            $item.finishNum = ($item.num - $item.finishNum)>0?($item.num - $item.finishNum):0
                        })
                    })
                } else if (val === 2) {
                    submatrixDataBf.forEach(item => {
                        item.quantities.forEach($item => {
                            $item.finishNum = $item.adjustNum
                        })
                    })
                }
                this.submatrixData = submatrixDataBf
            },
            reprot(type, from, item) {
                let facAndFinishId = {
                    facId: item.outsideFactoryId,
                    finishId: item.userId,
                };
                this.$emit('reprot', type, from, facAndFinishId)
            }
        }
    }
</script>

<style scoped lang="scss">
    .submatrix {
        width: 100%;
        margin-top: 15px;
        clear: both;
        .adjust-num {
            color: #FF7F14;
        }
        .submatrix-bg {
            padding:0 15px;
            background-color: #fafcff;
            overflow: hidden;
            .submatrix-item{
                overflow: hidden;
                margin: 15px 0;
            }
        }
    }
</style>