<template>
    <!--{id:0,name:'草稿'},-->
    <!--{id:1,name:'待审核'},-->
    <!--{id:2,name:'已通过'},-->
    <!--{id:3,name:'反审待批准'},-->
    <!--{id:4,name:'已驳回'},-->
    <!--{id:5,name:'已作废'},-->
    <!--{id:6,name:'不可反审'},-->
    <div class="orderProductionDetail">
        <page-title :title="$route.query.type === 'informal'?'生产订单：预下单详情':'生产订单详情'">
            <div class="btns">
                <nf-button @click="$router.go(-1)">返回上级</nf-button>
            </div>
        </page-title>
        <div v-loading="loading">
            <div class="orderProductionDetail-news">
                <content-wrap title="订单信息">
                    <!--是否作废-->
                    <div v-if="facPrdOrder.status!==5">
                        <!--是否有审核台-->
                        <!--<div v-if="billReviewConfig">-->

                        <!--</div>-->
                        <div v-if="facPrdOrder.status==1&&billReviewConfig" style="float: right;margin-left: 10px;">
                            <nf-button @click="taskPass(facPrdOrder.taskId,true)" type="success"
                                       style="font-size: 12px;">通过
                            </nf-button>
                            <nf-button @click="reason='';taskId=facPrdOrder.taskId;taskUnPassDialog=true" type="danger"
                                       style="font-size: 12px;">驳回
                            </nf-button>
                        </div>
                        <div v-if="facPrdOrder.status==3&&billReviewConfig" style="float: right;margin-left: 10px;">
                            <nf-button @click="taskPass(facPrdOrder.taskId,true)" type="success"
                                       style="font-size: 12px;">批准
                            </nf-button>
                            <nf-button @click="taskPass(facPrdOrder.taskId,false)" type="danger"
                                       style="font-size: 12px;">不批准
                            </nf-button>
                        </div>
                        <nf-button type="warning" v-if="facPrdOrder.status===2"
                                   style="float: right;font-size:12px;margin-left: 10px;"
                                   @click="$router.push(`/adjustOrder?id=${$route.query.id}&type=1`)">开调整单
                        </nf-button>
                        <nf-button type="warning"
                                   v-if="(facPrdOrder.status===0 || facPrdOrder.status===4) && billReviewConfigNewStatus"
                                   style="float: right;font-size:12px;" @click="billReviewConfigSubmit">提报
                        </nf-button>
                        <nf-button type="warning" v-if="facPrdOrder.type===0" style="float: right;font-size:12px;"
                                   @click="turnFormalOrder">转订单
                        </nf-button>
                        <nf-button type="warning"
                                   v-if="facPrdOrder.status===2 ||facPrdOrder.status===6||facPrdOrder.status===7"
                                   style="float: right;font-size:12px;" @click="dialogTableVisibleT"
                                   :loading="btnLoading">一键转工单
                        </nf-button>
                        <nf-button type="warning" v-if="facPrdOrder.status===4 && !billReviewConfigNewStatus"
                                   style="float: right;font-size:12px;" @click="facPrdOrderPass">生成订单
                        </nf-button>
                        <!-- status：1【待审核状态】3【反审核待批准】 -->
                        <nf-button type="warning" v-if="facPrdOrder.status===1 || facPrdOrder.status===3"
                                   style="float: right;font-size:12px;" @click="orderUndoStatus">
                                   <span v-if="facPrdOrder.status===1">撤回提报</span>
                                   <span v-if="facPrdOrder.status===3">撤回申请</span>
                        </nf-button>
                        <el-button style="float: right;margin-right: 10px;"
                                   v-if="facPrdOrder.status===2 && !billReviewConfigNewStatus"
                                   @click="facPrdOrderReject">申请驳回
                        </el-button>
                        <el-button style="float: right;margin-right: 10px;"
                                   v-if="facPrdOrder.status===2 && billReviewConfigNewStatus"
                                   @click="applyAntiReview_to()">申请反审
                        </el-button>

                    </div>

                    <p class="abandoned" v-if="facPrdOrder.status===5">已作废</p>
                    <el-popover
                            trigger="hover"
                            ref="popover5"
                            placement="bottom"
                            width="120">
                        <p class="editOrderP" @click="editOrder">修改订单</p>
                        <p class="editOrderP" @click="orderCancel">作废订单</p>

                    </el-popover>
                    <!--<p v-popover:popover5>dfdffdf</p>-->
                    <div v-show="(facPrdOrder.status===0||facPrdOrder.status===4||facPrdOrder.type===0)&&facPrdOrder.status!==5">
                        <nf-button v-popover:popover5  style="float: right;margin-right: 10px;font-size:12px;">更多
                        </nf-button>
                    </div>
                    <!-- 打印按钮 -->
                    <div v-if="facPrdOrder.status!==5" style="float: right;margin-right: 10px;">
                        <el-dropdown>
                            <nf-button style="font-size:12px;">打印</nf-button>
                            <el-dropdown-menu slot="dropdown" class="fs12" v-loading="listLoading">
                                <el-dropdown-item class=" fs12" disabled>选择打印模板</el-dropdown-item>
                                <el-dropdown-item :divided="index==0"
                                                  :class="{active: item.defaultStatus ==1 ? true : false}"
                                                  v-for="(item, index) in list" :key="index"
                                                  @click.native="go(item,facPrdOrder)">{{item.name}}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!--<print-template-btn :special="special" name="" type="order"-->
                                            <!--:id="$route.query.id"></print-template-btn>-->
                    </div>
                </content-wrap>
                <div class="orderProductionDetail-news-ct">
                    <span>生产单号：{{facPrdOrder.orderNo}}</span>
                    <span>制单日期：{{facPrdOrder.placeorderAt | filterTime}}</span>
                    <span v-if="facPrdOrder.commonOutsideFactoryName">外发厂：{{facPrdOrder.commonOutsideFactoryName}}</span>
                    <span>下单类型：{{facPrdOrder.placeOrderType}}</span>
                    <span>创建人:{{facPrdOrder.createByName?facPrdOrder.createByName:"无"}}</span>
                    <span>负责人:{{facPrdOrder.chargerNames?facPrdOrder.chargerNames.join('、'):"无"}}</span>

                    <div>
                        <span>订单状态：{{facPrdOrder.statusName}}</span>
                        <span>采购单号：{{facPrdOrder.buyNo}}</span>
                    </div>
                    <div class="remark">
                        <div>订单备注：</div>
                        <div v-if="facPrdOrder.remark" v-html="facPrdOrder.remark.replace(/\n/g,'<br/>')"></div>
                    </div>
                </div>
                <div v-if="$route.query.type !== 'informal'&&facPrdOrder.simpleGoodsList&&facPrdOrder.simpleGoodsList.length"
                     style="margin:14px;padding: 12px; background-color: #FCFCFC;border: 1px solid #DFE6EC;" >
                    <div class="mgb8">
                        <span>订货合计:</span>
                        <span class="orange">{{facPrdOrder.simpleGoodsList.length +'款'+facPrdOrder.orderNum+'件'}}</span>
                    </div>
                    <el-table
                            :data="facPrdOrder.simpleGoodsList"
                            border
                            class="custom-table">
                        <el-table-column prop="styleNo" label="商品款号" width="120" align="center">
                        </el-table-column>
                        <el-table-column prop="styleName" label="商品名称" min-width="120" align="center">
                        </el-table-column>
                        <el-table-column prop="customerName" label="客户" width="120" align="center">
                        </el-table-column>
                        <el-table-column prop="deliveryAt" label="货期" width="120" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.deliveryAt | filterTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNum" label="订货数量" width="120" align="center">
                        </el-table-column>
                        <el-table-column v-if="facPrdOrder.isOutsideFac ==1" prop="priceUnit" label="单价" width="120" align="center">
                            <template slot-scope="scope">
                             <span>{{scope.row.priceUnit?(scope.row.priceUnit+'元/件'):''}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="facPrdOrder.isOutsideFac ==1"  prop="total" label="加工金额小计" width="120" align="center">
                            <template slot-scope="scope">
                                <span>{{scope.row.total?('¥'+scope.row.total):''}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="missionNum" label="转工单数量" width="120" align="center">
                            <template slot-scope="scope">
                            <span :class="{'red':scope.row.purchaseDemand==0,'orange':scope.row.purchaseDemand==1,'green':scope.row.purchaseDemand==2}">
                                {{scope.row.missionNum}}
                            </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="orderNo" label="计划采购" width="120" align="center">
                            <template slot-scope="scope">
                            <span :class="{'red':scope.row.purchaseDemand==0,'orange':scope.row.purchaseDemand==1,'green':scope.row.purchaseDemand==2}">
                                {{scope.row.purchaseDemand==0?'全部未完成':scope.row.purchaseDemand==1?'部分未生成':'已全部生成'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" class-name="no-padding" label="操作" width="160" align="center">
                            <template slot-scope="scope">
                                <div class="action-list">
                                    <a class="item blue pointer" href="javascript:void(0)" v-anchor="scope.row">查看详情</a>
                                    <span class="item blue pointer" @click="dialogTableVisibleT(scope.row)">一键转工单</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>


            <div class="orderProductionDetail-goods"
                 :id="'GoodDetail'+item.styleId"
                 v-for="(item,bigIndex) in facPrdOrder.facPrdOrderGoodsList">
                <div class="orderProductionDetail-news orderProductionDetail-goods-news">
                    <content-wrap :title="'订货商品:'+item.styleNo+(item.styleName?('-'+item.styleName):'')">
                    </content-wrap>
                    <div class="orderProductionDetail-news-ct">
                        <!--<span>商品款号：{{item.styleNo}}</span>-->
                        <span>货期：{{item.deliveryAt | filterTime}}</span>
                        <div v-if="facPrdOrder.isOutsideFac===1">
                            <span>加工单价：{{item.processUnitPrice}}</span>
                            <span>订货总数：{{item.totalNum}}</span>
                            <span>加工金额小计：{{(item.processUnitPrice*item.totalNum).toFixed(2)}}</span>
                        </div>
                        <span v-else>订货总数：{{item.totalNum}}</span>
                        <!--<el-row :gutter="10">-->
                        <div v-for="$item in selectedConfigList" :key="$item.id"
                             :class="{itemWidthBr:$item.fieldCode==='goodsPictures'||$item.fieldCode==='goodsDescribe'}"
                             style="margin-bottom: 8px;display: inline-block;">
                            <div style="overflow: hidden;width: 300px;display: inline-block;margin-right: 10px;"
                                 v-if="$item.fieldCode!=='goodsPictures' && $item.fieldCode!=='goodsDescribe'&&$item.fieldCode.indexOf('customField')==-1">
                                <div class="fl" :style="{'width':($item.name.length+1)*14+'px'}">{{$item.name}}：</div>
                                <div class="fl" :style="{'width':280-($item.name.length+1)*14+'px'}"
                                     v-if="$item.fieldCode!=='goodsPictures'">
                                    {{item.facPrdOrderGoodsInfoDTO[$item.fieldCode]}}
                                </div>
                                <img @click="imgList(item.facPrdOrderGoodsInfoDTO.goodsPictures)"
                                     v-if="$item.fieldCode==='goodsPictures'&&item.facPrdOrderGoodsInfoDTO.goodsFirstPicture"
                                     style="width: 80px;vertical-align:middle;height: 40px;cursor: pointer"
                                     :src="item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" alt="">
                            </div>
                            <div v-if="$item.fieldCode==='goodsPictures'"
                                 v-show="item.facPrdOrderGoodsInfoDTO.goodsFirstPicture"
                                 style="background: #f6f6f6;padding: 10px 0;width: 100%;">
                                {{$item.name}}：
                                <img v-for="(imgItem,indexImg) in item.facPrdOrderGoodsInfoDTO.goodsPictures"
                                     @click="imgList(item.facPrdOrderGoodsInfoDTO.goodsPictures,indexImg)"
                                     style="width: 80px;vertical-align:middle;height: 80px;cursor: pointer;margin-right: 10px;"
                                     :src="imgItem" alt="">
                            </div>
                            <div v-if="$item.fieldCode==='goodsDescribe'"
                                 style="margin: 10px 0;display: flex;width: 100%;">
                                <span style="display: inline-block;width: 80px">{{$item.name}}：</span><span
                                    style="display: inline-block;flex: 1"
                                    v-html="item.facPrdOrderGoodsInfoDTO.goodsDescribe"> </span>
                            </div>
                        </div>

                        <!--表格开始-->
                        <div style="margin-bottom: 10px;margin-top: 10px;"
                             v-if="item.skuList && item.skuList.length">
                            <!--预下单-->
                            <nf-sku-table
                                    v-if="facPrdOrder.type===0"
                                    ref="nfskutable"
                                    :metadatas="item.skuList"
                                    style="margin-left: 0px;"
                                    :quantities="item.facPrdOrderGoodsAdvanceDetailList"
                                    showNum
                                    skc
                            ></nf-sku-table>
                            <!--订单-->
                            <nf-sku-table
                                    v-if="facPrdOrder.type===1"
                                    ref="nfskutable"
                                    :metadatas="item.skuList"
                                    style="margin-left: 0px;"
                                    @change="countTotalNum"
                                    :quantities="item.facPrdOrderGoodsDetailList"
                                    showNum
                            ></nf-sku-table>
                            <!-- <service-table :tableData="tableData3" :skuVal="skuVal" @setReportOnce="getOnce" :isEdit="true"></service-table> -->
                        </div>
                        <p style="cursor: pointer" v-if="item.fillType===1&&!item.slideCustomerList"
                           @click="slideCustomerListSet(item,true)">收起不同客户订货明细</p>
                        <p style="cursor: pointer" v-if="item.fillType===1&&item.slideCustomerList"
                           @click="slideCustomerListSet(item,false)">展开不同客户订货明细</p>
                        <div class="orderProductionDetail-news-customer"
                             v-if="item.fillType===1&&!item.slideCustomerList">

                            <div class="orderProductionDetail-news-customerList"
                                 v-for="($item,index) in item.facPrdOrderGoodsCustomerList">
                                <p>
                                    <span>客户：{{$item.custName}}</span>
                                    <span>数量合计：{{$item.totalNum}}</span>
                                </p>
                                <div style="margin-bottom: 10px;margin-top: 10px;"
                                     v-if="item.skuList && item.skuList.length">
                                    <nf-sku-table
                                            ref="nfskutable"
                                            :metadatas="item.skuList"
                                            style="margin-left: 0px;"
                                            @change="countTotalNum"
                                            :quantities="$item.facPrdOrderGoodsCustomerDetailList"
                                            showNum
                                    ></nf-sku-table>
                                </div>
                                <div class="orderProductionDetail-line"
                                     v-if="index!==item.facPrdOrderGoodsCustomerList.length-1"></div>
                            </div>
                        </div>

                    </div>
                    <div class="orderProductionDetail-line" style="margin-top: 10px;"></div>
                </div>
                <div v-if="$route.query.type !== 'informal'"
                     class="orderProductionDetail-goods-material">
                    <content-wrap title="物料需求">
                    </content-wrap>
                    <div v-if="item.isMaterials===0">
                        <nf-button type="warning"
                                   :disabled="(facPrdOrder.status!==0 && facPrdOrder.status!==4)||facPrdOrder.status===5"
                                   @click="editOrderBomVisibleGo(item.styleId,item.facPrdOrderGoodsId,'启用',item.commonBom)">
                            启用
                        </nf-button>
                    </div>
                    <!-- BOM表格组件 这个就是那个表格组件-->
                    <div v-else>
                        <p style="margin-bottom: 8px;overflow: hidden;line-height: 36px;">
                            商品BOM：{{item.commonBom.name}}
                            <nf-button style="float: right;border-radius:2px;border: 1px solid #1CA1FF;color: #1CA1FF"
                                       @click="editOrderBomVisibleGo(item.styleId,item.facPrdOrderGoodsId,'编辑',item.commonBom)">
                                编辑 BOM
                            </nf-button>
                            <nf-button :loading="btnLoading" v-if="isPurchaseConfig && (facPrdOrder.status==2||facPrdOrder.status==6)" style="float: right;border-radius:2px;border: 1px solid #1CA1FF;color: #1CA1FF;margin-right: 20px"
                                       @click="updateAllPurchasePlan(item.commonBom,item.facPrdOrderGoodsId)">
                                一键生成采购计划
                            </nf-button>
                            <nf-button  v-if="item.inverseDemand" style="float: right;border-radius:2px;border: 1px solid #1CA1FF;color: #1CA1FF;margin-right: 20px"
                                       @click="MaterialBackCalculation()">
                                物料反算
                            </nf-button>
                        </p>
                        <goods-bom
                                @changePurchaseStatus="changePurchaseStatus"
                                @updatePurchasePlan="updatePurchasePlan"
                                :facPrdOrderGoodsId="item.facPrdOrderGoodsId"
                                :orderStatus="facPrdOrder.status"
                                :bigIndex="bigIndex"
                                @canclePurchaseShow="canclePurchaseShow"
                                :bomData="item.commonBom"
                                :canHandleFinish="canHandleFinish"
                                flag="purchasePlan">
                        </goods-bom>
                    </div>
                    <div class="orderProductionDetail-line" style="margin-top: 10px;"></div>
                </div>

                <div v-if="$route.query.type !== 'informal'" class="orderProductionDetail-goods-order">
                    <content-wrap title="关联工单">
                    </content-wrap>
                    <MissionTableList :missionList="item.facMissionList"></MissionTableList>
                    <nf-button :loading="btnLoading" type="warning" @click="creatOrderGo(bigIndex)"
                               :disabled="facPrdOrder.type===0||facPrdOrder.status===5||facPrdOrder.status===4||facPrdOrder.status===0||facPrdOrder.status===1">
                        转工单
                    </nf-button>
                </div>

            </div>

            <!--历史单据列表-->
            <div class="adjust-list" style="padding: 24px;background: #fff;">
                <content-wrap title="历史单据列表">
                </content-wrap>
                <!--<adjust-table :list="facPrdOrder.adjustOrderList"></adjust-table>-->
                <el-table
                        :data="facPrdOrder.adjustOrderList"
                        border
                        class="mission"
                        key="mission"
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
                                {{item.goodsDeliveryAt | filterTime}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="item.name" width="140" align="center" v-for="item in selectedConfigList"
                                     :key="item.id">
                        <template slot-scope="scope">
                            <div class="cell__row" v-for="$item in scope.row.facPrdOrderGoodsCustomerList">
                                <span v-if="item.fieldCode!=='goodsPictures'">{{$item.facPrdOrderGoodsInfoDTO[item.fieldCode]}}</span>
                                <img @click="imgList($item.facPrdOrderGoodsInfoDTO.goodsPictures)"
                                     v-if="item.fieldCode==='goodsPictures'&&$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture"
                                     style="width: 140px;height: 40px;cursor: pointer"
                                     :src="$item.facPrdOrderGoodsInfoDTO.goodsFirstPicture" alt="">
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
                    <el-table-column prop="remark" label="单据备注" width="100" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.remark||'-'}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="下单类型" width="100" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.placeOrderType}}</span>

                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="状态" width="100" align="center">
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

                    <el-table-column prop="zip" label="操作" width="280" fixed="right" class-name="cellHeight"
                                     align="center">
                        <template slot-scope="scope">
                            <div class="opera">
                                <div class="blue" @click="goDetail(scope.row)">查看</div>
                                <div class="blue" @click="statusSubmit(scope.row.facPrdOrderId)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&(scope.row.status==0||scope.row.status==4)">
                                    提报
                                </div>
                                <div class="blue" @click="taskPass(scope.row.taskId,true)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&scope.row.status==1&&isConfig">通过
                                </div>
                                <div class="blue" @click="reason='';taskId=scope.row.taskId;taskUnPassDialog=true"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&scope.row.status==1&&isConfig">驳回
                                </div>
                                <div class="blue" @click="handelAntiReview(scope.row.facPrdOrderId)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&scope.row.status==2">申请反审
                                </div>
                                <div class="blue" @click="taskPass(scope.row.taskId,true)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&scope.row.status==3&&isConfig">同意
                                </div>
                                <div class="blue" @click="taskPass(scope.row.taskId,false)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&scope.row.status==3&&isConfig">拒绝
                                </div>
                                <div class="blue" @click="handleUndo(scope.row.facPrdOrderId)"
                                     v-if="scope.row.leaderIds.find(v => v == userId)&&(scope.row.status==1||scope.row.status==3)">
                                    撤回
                                </div>
                                <div class="blue">
                                    <el-dropdown>
                                        <div class="blue" style="border-right: none;font-size: 12px;">打印</div>
                                        <el-dropdown-menu slot="dropdown" class="fs12">
                                            <el-dropdown-item class=" fs12" disabled>选择打印模板</el-dropdown-item>
                                            <el-dropdown-item :divided="index==0"
                                                              :class="{active: item.defaultStatus ==1 ? true : false}"
                                                              v-for="(item, index) in list" :key="index"
                                                              @click.native="go(item,scope.row)">{{item.name}}
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--附件-->
            <div class="orderProductionNew-file" v-if="$route.query.type == 'formal'">
                <content-wrap title="关联附件" class="goods-order">
                </content-wrap>
                <!--附件-->
                <upload-from
                        isEdit
                        from="order"
                        :editData="fileData"
                ></upload-from>
            </div>
        </div>

        <transition name="opcity">
            <div style="z-index: 999" @click="adjustOrderRightMove=false;" class="cover" v-if='adjustOrderRightMove'>
            </div>
        </transition>
        <transition name="right-move">
            <adjustOrder @toggle="adjustOrderRightMove=false" fromType="purchaseNeed" v-if="adjustOrderRightMove"></adjustOrder>
        </transition>
        <!-- BOM编辑组件 -->
        <transition name="right-move">
            <div class="orderProductionDetail-bom" v-if="editOrderBomVisible && styleId!==''&& title==='启用BOM表'">
                <!--头-->
                <div v-if="title==='启用BOM表'" class="header" ref="newBomTitle">
                    <page-title :title="title">
                        <span class="header_right">
                        <nf-button @click="cancel">取消
                        </nf-button>
                        <nf-button type="warning" :loading="btnLoading" @click="determine(styleId)">确定
                        </nf-button>
                        </span>
                    </page-title>
                </div>
                <!--头部end-->
                <bom-table from="editProductionOrder" class="mgt16" v-if="title==='启用BOM表'" @bomData="bomData"
                           :showBom='false'
                           :source="'orderProduction'"
                           :styleId="styleId"
                           :commonBomId="commonBomId"
                ></bom-table>
            </div>

        </transition>
        <create-bom-table
                :facPreOrderId="facPreOrderId"
                from="productionOrder"
                @orderProductionTableEdit="orderProductionTableEdit"
                type="editor1"
                v-if="editOrderBomVisible&& title==='编辑BOM表'"
                :bomData="commonBomId"
                :title="title"
                :styleId="styleId"
                source='orderProduction'
                @isdelete="abolish"
                @cancel="cancel">
        </create-bom-table>
        <transition name="opcity">
            <div class="coverBomTable" v-if="editOrderBomVisible" @click="editOrderBomVisible = false">
            </div>
        </transition>

        <el-dialog title="一键转工单" :visible.sync="dialogTableVisible" custom-class="dialogTable">
            <el-table
                    class="one-key-table"
                    :data="facPrdOrderGoodsCustomerList"
                    border
                    @select="orderSel"
                    @select-all="orderSelAll"
                    ref="multipleTable">
                <el-table-column type="selection" width="55" :selectable="(r,i) => i!=0"></el-table-column>
                <el-table-column class="ffff" property="missionOrderNo" label="工单号" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.$index==0">批量操作</span>
                        <el-input v-else :disabled="!scope.row.selTable" v-model="scope.row.missionOrderNo"
                                  placeholder="选填"></el-input>
                    </template>
                </el-table-column>
                <el-table-column property="styleNo" label="商品" width="150"></el-table-column>
                <el-table-column label="客户" width="200">
                    <template slot-scope="scope">
                        <el-select @change="selectCustomer($event,scope.$index)" :disabled="scope.row.customerFlag || !scope.row.selTable"
                                   v-model="scope.row.customerId" placeholder="请选择">
                            <el-option v-for="(item,index) in customerList" :key="index" :label="item.name"
                                       :value="item.id">
                                <div>{{item.name}}</div>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column property="totalNum" label="订货数" width="120"></el-table-column>
                <el-table-column property="goodsDeliveryAt" label="交期" width="200">
                    <template slot-scope="scope">
                        <el-date-picker
                                :disabled="!scope.row.selTable"
                                v-model="scope.row.goodsDeliveryAt"
                                @change="endTime($event,scope.$index)"
                                type="date" format="yyyy-MM-dd" placeholder="选择日期"
                        >
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="工序模板" width="150">
                    <template slot-scope="scope">
                        <el-select @change="selectTemplate($event,scope.$index)" :disabled="!scope.row.selTable" v-model="scope.row.prcdTemplateId" placeholder="请选择">
                            <el-option v-for="(item,index) in templateList" :key="index" :label="item.name"
                                       :value="item.id">
                                <div>{{item.name}}</div>
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="负责人" width="150">
                    <template slot-scope="scope">
                        <workerLeader @input="selectCharger($event,scope.$index)" v-model="scope.row.operaterId"
                                      :isDisabled="!scope.row.selTable"
                                      :manListProps="manList"
                                      :placeholder="'请选择'"></workerLeader>
                    </template>
                </el-table-column>
                <el-table-column property="commonOutsideFactoryName" label="整单外发" width="150"></el-table-column>
                <el-table-column property="processUnitPrice" label="加工单价" width="100">
                    <template slot-scope="scope">
                        <el-input @input="handleInput($event,scope.$index)" :disabled="(!scope.row.selTable||!scope.row.commonOutsideFactoryId) && scope.$index!=0"
                                 type="number" v-model="scope.row.goodsProcessUnitPrice" placeholder="请输入内容"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="dialogTable-btns">
                <nf-button @click="dialogTableVisible = false">取消</nf-button>
                <el-button type="warning" :loading="creatOrderLoading" @click="orderToFacSaveSure">确定</el-button>
            </div>
        </el-dialog>
        <!--撤销弹窗-->
        <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="dialogTableVisibleCX" modal="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">是否确定撤销当前采购计划？</p>
            </div>
            <div class="footer">
                <nf-button @click="dialogTableVisibleCX = false">取消</nf-button>
                <nf-button type="warning" @click="canclePurchase" :loading="isloading">确定</nf-button>
            </div>
        </el-dialog>

        <el-dialog title="反审核申请原因" class="custom-dialog" :visible.sync="applyAntiReviewDialog">
            <div class="body">
                <el-input type="textarea" rows="6" v-model="applyAntiReviewDesc" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="applyAntiReviewDialog = false">取消</nf-button>
                <nf-button type="warning" @click="applyAntiReview" :loading="isloadingApply">确定</nf-button>
            </div>
        </el-dialog>
        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
        <!--订单新建编辑-->
        <transition name="right-move">
            <!--@editAgainSucc="editAgainSucc" ref="newMaterialGet" :detailMaterialdata="form"-->
            <orderProductionNew v-if="orderProductionNewDialog" source="orderProductionDetail"
                                :detailData="facPrdOrder"></orderProductionNew>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="orderProductionNewDialog" @click="orderProductionNewDialog=false">
            </div>
        </transition>
        <!--物料更新-->
        <!--<materialAndGoodsBomUpdate @updateMaterialBtn="updateMaterialBtn" :easyBomList="bomList"-->
                                   <!--:updateMaterial="updateMaterial"-->
                                   <!--:alterPurchaseDemand="facPrdOrder.alterPurchaseDemand"></materialAndGoodsBomUpdate>-->

        <!--驳回弹窗-->
        <el-dialog title="驳回单据" class="custom-dialog unpass-dialog" :visible.sync="taskUnPassDialog">
            <div style="display: flex;">
                <p style="white-space: nowrap">驳回原因：</p>
                <el-input type="textarea" rows="6" v-model="reason" placeholder="请输入原因"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button @click="taskUnPassDialog = false">取消</nf-button>
                <nf-button type="warning" @click="taskPass(taskId,false,reason)" :loading="btnLoading">确定</nf-button>
            </div>
        </el-dialog>

        <!--配置转工单必填检查-->
        <el-dialog size="tiny" title="商品档案未填写完整" class="custom-dialog" :visible.sync="checkConfigDialog">
            <div style="text-align: center;">
                <i style="color: red;font-size: 56px;margin-bottom: 16px;" class="el-icon-warning"></i>
                <div style="margin-bottom: 8px;">请完善:</div>
                <div style="margin-bottom: 8px;" v-for="(item,index) in checkConfigList" :key="index"><span
                        @click="$router.push(`/baseGoodsInfo?id=${item.styleId}`)" title="点击进入商品档案"
                        style="color: #1CA1FF;cursor: pointer;text-decoration: underline">{{item.styleName}}</span>{{item.content}}
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <nf-button type="warning" @click="checkConfigDialog = false">确定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>
    import {
        getUnitUser,
        facTemplates,
        adjustPrdOrderUndo,
        adjustPrdOrderSubmit,
        adjustPrdOrderAntiReview,
        adjustPrdOrderReview,
        facPrdOrderDetail,
        getGoodSkuList,
        goodManageBoomAllData,
        editFacPrdOrderGoodsMaterialSku,
        orderToFacList,
        orderToFacSave,
        getNodeTemplateList,
        getEasyCustomerList,
        updatePurchaseStatus,
        updatePurchasePlan,
        easyBomList,
        facPrdOrderCancel,
        facPrdOrderReject,
        facPrdOrderPass,
        billReviewConfigSubmit,
        billReviewConfig,
        applyAntiReview,
        orderUndoStatus,
        getFieldConfig,
        updateCanclePurchase,
        checkAttachment
    } from '@/api/api'
    import bomTable from '../order/createChild/bomTable'
    import CreateBomTable from "@/components/goods/goodsBom/CreateBomTable";
    import goodsBom from "@/components/goods/goodsBom/goodsBom.vue"; //BOM表格组件
    import MissionTableList from '../order/WorkOrders/mission-table-list';
    import orderProductionNew from './order-production-new'
    import printTemplateBtn from '@/components/material/printTemplateBtn' //打印
    import uploadFrom from '@/components/Common/uploadForm.vue'
    import {purchaseConfig} from '@/api/material.js'
    import adjustOrder from './adjustOrder/index'
    export default {
        name: "order-production-detail",
        inject: ['homeRouterReload'],     //注入全局刷新方法
        data() {
            return {
                adjustOrderRightMove: false,
                isConfig: false,
                checkConfigList: [],
                checkConfigDialog: false,
                taskId: '',
                reason: '',
                taskUnPassDialog: false, //驳回弹窗
                btnLoading: false,
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                selectedConfigList: [],
                isloading: false,
                billReviewConfig: false,
                billReviewConfigNewStatus: false,    //驳回和反审状态的新建字段
                applyAntiReviewDialog: false,
                isloadingApply: false,
                applyAntiReviewDesc: '',
                orderProductionNewDialog: false,
                bomType: '',
                updateMaterial: false,
                loading: false,
                bomList: [],
                editBomParams: {},
                dialogTableVisibleCX: false,
                creatOrderLoading: false,
                dialogTableVisible: false,
                editOrderBomVisible: false,
                title: '启用BOM表',
                facMissionBom: {},
                addMaterialBom: {commonBom: {}, isMaterials: 1},
                facPrdOrder: {remark: ''},
                boomAllData: [],
                skuList: [],
                skuListCount: [],
                styleId: '',
                facPrdOrderGoodsId: '',
                commonBomId: '',
                canclePurchaseSkuId: '',
                facPrdOrderGoodsCustomerList: [],
                templateList: [],
                customerList: [],
                backupCommonMaterialsSkuList: [], //备份订单bom未修改的数据，用于编辑bom，保存时判断是否有修改
                canHandleFinish: false,     //bom表编辑时是否可以手动完成
                facPreOrderId: '',        //生产订单id
                cancelFacPrdOrderGoodsId: '',
                list: [], //打印模板列表
                fileData: [], // 附件列表数据
                isPurchaseConfig: false, // 采购需求来源是否生产订单
                // updateAllPurchasePlanFlag:false,//一键生成是否能点击标志
                manList: [], //负责人下拉列表
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            special() {
                return this.$route.query.special
            }
        },

        components: {
            adjustOrder,
            bomTable,
            CreateBomTable,
            goodsBom,
            MissionTableList,
            orderProductionNew,
            uploadFrom,
            printTemplateBtn
        },
        directives: {
            anchor: {
                inserted: (el,binding) => {
                    el.onclick = function(){
                        document.getElementsByClassName('home_content--main')[0].scrollTop = $('#GoodDetail'+binding.value.styleId).offset().top-45
                    }
                }
            }
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
        // watch: {
        //     '$route'() {
        //         this.getFacPrdOrderDetail()
        //     }
        // },
        async created() {
            this.getUnitUser()
            this.getSelectedConfigList()
            this.getPurchaseConfig()
            this.getEasyTemplateList()
            this.selectedCustomer();
            await this.getFacPrdOrderDetail()
            this.getBillReviewConfig();
            this.getFacTemplates()

        },
        methods: {
            //物料反算
            MaterialBackCalculation(){

                //权限
                if (!this.powerJudgement.permissions("fac.purchaseOrder.inverseDemand")) {
                    return
                }

                this.adjustOrderRightMove = true;
            },
            // 获取负责人列表
            getUnitUser() {
                getUnitUser({unitId: this.unitId}).then(res => {
                    this.manList = res.data.data.facGroupDTOS
                })
            },
            handleInput(e,index) {
                if(index==0) {
                    this.facPrdOrderGoodsCustomerList.forEach(v => {
                        if(v.commonOutsideFactoryId) {
                            v.goodsProcessUnitPrice = e
                        }
                    })
                }
            },
            selectCustomer(e,index) {
                if(index==0) {
                    this.facPrdOrderGoodsCustomerList.forEach(v => {
                        if(!v.customerFlag) {
                            v.customerId = e
                        }
                    })
                }
            },
            selectTemplate(e,index) {
                if(!e) return
                const chargers = this.templateList.find(t => t.id === e).chargers
                if(index==0) {
                    this.facPrdOrderGoodsCustomerList.forEach(v => {
                        v.prcdTemplateId = e
                    })
                    this.selectCharger(chargers.map(item => item.id),0)
                }else {
                    this.$set(this.facPrdOrderGoodsCustomerList[index],'operaterId',chargers.map(item => item.id))
                }

            },
            selectCharger(e,index) {
                if(index==0) {
                    this.facPrdOrderGoodsCustomerList.forEach(v => {
                        v.operaterId = e
                    })
                }
            },
            // 获取采购来源
            getPurchaseConfig() {
                purchaseConfig({id:this.unitId}).then(res => {
                    this.isPurchaseConfig = res.data.data.find(v => v.code=='order_mission_materail').select
                })
            },
            // 申请反审
            applyAntiReview_to(){
                // 权限
                if(!this.powerJudgement.permissions("fac.prcmission.apply.umpire")){
                    return
                }
                this.applyAntiReviewDialog = true;
            },
            // 打印跳转
            go(item, row) {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.print")) {
                    return
                }
                if([0,1,3,4,5,].includes(row.status)){
                    this.$confirm("订单未正式通过，是否确定打印?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            window.open(`/#/printShow?templateId=${item.id}&businessId=${row.facPrdOrderId}&printType=print&billType=order&special=${row.special}`)
                        })
                        .catch(() => {});
                } else {
                    window.open(`/#/printShow?templateId=${item.id}&businessId=${row.facPrdOrderId}&printType=print&billType=order&special=${row.special}`)
                }
            },
            // 获取打印列表
            getFacTemplates() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    type: 'order',
                    pageNo: 1,
                    pageSize: 9999,
                    using: true,
                    typeId: ''
                }
                facTemplates(params).then(res => {
                    this.list = res.data.data.list
                })
            },
            // 提报
            statusSubmit(facPrdOrderId) {
                this.btnLoading = true
                adjustPrdOrderSubmit({facPrdOrderId, userId: this.userId}).then(res => {
                    this.btnLoading = false
                    if (res.data.code === 0) {
                        this.getFacPrdOrderDetail()
                        this.$message({
                            type: 'success',
                            message: '提报成功!'
                        });
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 撤回
            handleUndo(facPrdOrderId) {
                this.btnLoading = true;
                let para = {
                    facPrdOrderId,
                    userId: this.userId
                };
                adjustPrdOrderUndo(para).then(res => {
                    this.btnLoading = false
                    if (res.data.code == 0) {
                        this.$message.success('撤回成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 申请反审
            handelAntiReview(facPrdOrderId) {
                this.btnLoading = true
                const params = {
                    facPrdOrderId,
                    message: '',
                    userId: this.userId
                }
                adjustPrdOrderAntiReview(params).then(res => {
                    this.btnLoading = false
                    if (res.data.code == 0) {
                        this.$message.success('申请成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //通过
            taskPass(taskId, type, message = '') {
                this.btnLoading = true
                let obj = {
                    taskId,
                    message,
                    result: type,
                    userId: this.userId
                }
                adjustPrdOrderReview(obj).then(res => {
                    this.btnLoading = false
                    if (res.data.code === 0) {
                        this.taskUnPassDialog = false
                        this.$message.success('操作成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            //跳转详情页面
            goDetail(row) {
                // 权限 facPrdOrderId
                if (!this.powerJudgement.permissions("fac.prcmission.query")) {
                    return
                }
                if (row.type == 2) {
                    this.$router.push({
                        path: `/adjustOrder`,
                        query: {id: row.facPrdOrderId, type: 3},
                    })
                } else {
                    this.$router.replace({
                        path: `/orderProductioDetail`,
                        query: {id: row.facPrdOrderId, type: 'formal', special: row.special},
                    })
                    this.homeRouterReload()
                }

            },
            // 图片预览
            imgList(row, index) {
                this.imgIndex = index ? index : 0;
                this.imgLists = row
                // this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            //配置
            getSelectedConfigList() {
                getFieldConfig({unitId: this.unitId}).then(res => {
                    console.log(res);
                    this.selectedConfigList = res.data.data.selectedConfigList;


                })
            },
            editOrder() {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.update")) {
                    return
                }
                this.orderProductionNewDialog = true
            },
            //是否有审核台
            getBillReviewConfig() {
                billReviewConfig({unitId: JSON.parse(sessionStorage.getItem("last_login")).id}).then(res => {
                    console.log(res);
                    if (res.data.data.configs && res.data.data.configs.length > 0) {
                        //是否有审核台
                        this.isConfig = res.data.data.configs.some(v => v.billType == 'FAC_PRD_ORDER')
                        this.billReviewConfig = res.data.data.configs.some(v => v.billType == 'FAC_PRD_ORDER') && this.facPrdOrder.leaderIds.some(v => v == this.userId)
                        this.billReviewConfigNewStatus = res.data.data.configs.some(v => v.billType == 'FAC_PRD_ORDER')
                    }
                })
            },
            // 获取详情
            async getFacPrdOrderDetail() {
                let params = {
                    userId: this.userId,
                    facPrdOrderId: this.$route.query.id,
                    special: this.special
                }
                this.loading = true
                await facPrdOrderDetail(params).then(res => {
                    this.loading = false;
                    this.facPrdOrder = res.data.facPrdOrder;
                    this.facPreOrderId = this.facPrdOrder.facPrdOrderId;
                    this.canHandleFinish = res.data.facPrdOrder.alterPurchaseDemand;
                    this.fileData = this.facPrdOrder.concatAttachment
                    console.log(this.fileData, 'this.tableData');
                    //根据货品获取sku表格内容
                    this.facPrdOrder.facPrdOrderGoodsList.forEach(item => {
                        item.slideCustomerList = true
                        let params = {
                            userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                            styleId: item.styleId
                        };

                        goodManageBoomAllData(params).then(ret => {
                            if (ret.data && ret.data.code == 0) {
                                // this.boomAllData = ret.data.commonBomList[0];
                                this.$set(item, 'boomAllData', ret.data.commonBomList[0])
                                console.log(ret.data.commonBomList);
                            } else {
                                this.$message.error(ret.data.msg);
                            }
                        });
                        // 获取skuList
                        getGoodSkuList({
                            goodsId: item.goodsUnitId
                        }).then(res => {
                            console.log(res.data, '-----')
                            // item.skuList = res.data;
                            this.$set(item, 'skuList', res.data)
                        });
                    })
                    console.log(this.facPrdOrder.facPrdOrderGoodsList, '=3=3=3=');
                })
            },
            //获取一键转工单详情
            async getOrderToFacList(row) {
                await orderToFacList({facPrdOrderId: this.$route.query.id,goodsUnitId:row.goodsId,customerId:row.customerId}).then(res => {
                    console.log(res);
                    // return val.slice(0, 11);
                    if (res.data.facPrdOrderGoodsCustomerList) {
                        res.data.facPrdOrderGoodsCustomerList.forEach(item => {
                            item.goodsDeliveryAt = item.goodsDeliveryAt.slice(0, 10)
                            // item.goodsDeliveryAt = item.goodsDeliveryAt.slice(0, 10)
                        })
                    }

                    this.facPrdOrderGoodsCustomerList = res.data.facPrdOrderGoodsCustomerList.map(v => {
                        return {
                            ...v,
                            operaterId: [],
                        }
                    })
                    this.facPrdOrderGoodsCustomerList.unshift({})
                })
            },
            //提报接口
            billReviewConfigSubmit() {
                // 权限
                if(!this.powerJudgement.permissions("fac.prcmission.report")){
                    return
                }
                let obj = {
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    facPrdOrderId: this.$route.query.id
                }
                billReviewConfigSubmit(obj).then(res => {
                    if (res.data.code === 0) {
                        this.getFacPrdOrderDetail()
                        this.$message({
                            type: 'success',
                            message: '提报成功!'
                        });
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //预下单转订单
            turnFormalOrder() {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.turn")) {
                    return
                }


                this.$store.dispatch('deleteVisitedLive', 'orderProductionNew');
                this.$store.dispatch('deleteVisitedView', {path: '/orderProductionNew'});

                //
                let that = this
                setTimeout(function () {
                    that.$router.push({
                        path: '/orderProductionNew',
                        query: {type: 'formal', data: that.facPrdOrder, jumpFrom: 'informal'}
                    })
                }, 200)

            },
            //作废订单
            orderCancel() {
                //权限
                if (!this.powerJudgement.permissions("fac.prcmission.cancel")) {
                    return
                }

                this.$confirm('此操作将永久作废该订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let para = {
                        facPrdOrderId: this.$route.query.id,
                        userId: this.userId,
                        unitId: this.unitId
                    };
                    facPrdOrderCancel(para).then(res => {
                        if (res.data.code === 0) {
                            this.getFacPrdOrderDetail()
                            this.$message({
                                type: 'success',
                                message: '作废成功!'
                            });
                        }
                    })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //驳回
            facPrdOrderReject() {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.advance.reject")) {
                    return
                }
                let para = {
                    facPrdOrderId: this.$route.query.id,
                    userId: this.userId,
                    unitId: this.unitId
                };
                facPrdOrderReject(para).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('操作成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //撤回
            orderUndoStatus() {
                let para = {
                    facPrdOrderId: this.$route.query.id,
                    userId: this.userId
                };
                orderUndoStatus(para).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('操作成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //反审
            applyAntiReview() {
                let obj = {
                    facPrdOrderId: this.$route.query.id,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    message: this.applyAntiReviewDesc
                }
                this.isloadingApply = true
                applyAntiReview(obj).then(res => {
                    this.isloadingApply = false
                    this.applyAntiReviewDialog = false
                    if (res.data.code === 0) {
                        this.$message.success('操作成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //通过
            facPrdOrderPass() {
                let para = {
                    facPrdOrderId: this.$route.query.id,
                    userId: this.userId,
                    unitId: this.unitId
                };
                facPrdOrderPass(para).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('操作成功')
                        this.getFacPrdOrderDetail()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            countTotalNum() {

            },
            //启用物料
            editOrderBomVisibleGo(styleId, facPrdOrderGoodsId, title, commonBomId) {
                this.title = title + 'BOM表'
                console.log(styleId);
                this.styleId = styleId;
                if (title === '启用') {
                    this.commonBomId = ''
                } else {
                    //编辑bom
                    this.commonBomId = commonBomId;
                    this.backupCommonMaterialsSkuList = JSON.parse(JSON.stringify(this.commonBomId.commonMaterialsSkuList))
                    this.backupCommonMaterialsSkuList.forEach(item => {
                        item.singleDosage = item.singleDosage.toString()
                    })
                    this.backupCommonMaterialsSkuList = JSON.stringify(this.backupCommonMaterialsSkuList)
                    console.log(this.backupCommonMaterialsSkuList, '生产订单bom的备份数据')
                }
                this.facPrdOrderGoodsId = facPrdOrderGoodsId;
                this.editOrderBomVisible = true
            },
            bomData(val) {
                console.log(val);
                this.addMaterialBom.commonBom.id = val.commonBomId
                this.addMaterialBom.commonBom.name = val.commonBomName
                this.addMaterialBom.commonBom.commonMaterialsSkuList = val.commonMaterialsSkuList
            },

            //更新物料
            bomVisibleUpdateGo(styleId, facPrdOrderGoodsId, title, commonBomId) {
                this.bomType = '编辑'
                this.facPrdOrderGoodsId = facPrdOrderGoodsId;
                this.commonBomId = commonBomId;
                //获取bom列表
                let obj = {
                    styleId: styleId,
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                };
                easyBomList(obj).then(res => {
                    this.bomList = res.data.commonBomList;
                    this.updateMaterial = true
                });
            },

            // 取消关闭编辑侧窗
            cancel() {
                this.editOrderBomVisible = false;
                this.getFacPrdOrderDetail()
            },
            // 确定启用物料
            determine(styleId) {
                this.bomType = '启用'
                //获取bom列表
                let obj = {
                    styleId: styleId,
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                };
                easyBomList(obj).then(res => {
                    this.bomList = res.data.commonBomList;
                    this.addMaterialBom.facPrdOrderGoodsId = this.facPrdOrderGoodsId
                    this.editFacPrdOrderGoodsMaterialSku(this.addMaterialBom);
                    // this.updateMaterial = true
                });


            },
            orderProductionTableEdit(bomData, data) {
                // 统一将单件用量转成字符串
                bomData.commonMaterialsSkuList.forEach(item => {
                    item.singleDosage = item.singleDosage.toString()
                })
                let params = {
                    facPrdOrderGoodsId: this.facPrdOrderGoodsId,
                    isMaterials: 1,
                    commonBom: bomData,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    alterPurchaseDemand: false
                };
                this.editBomParams = params;
                this.bomType = '编辑';
                this.updateMaterialForEdit(data)
            },
            // 编辑生产订单详情时的更新物料
            updateMaterialForEdit(data) {
                let skuList = this.commonBomId.commonMaterialsSkuList;
                //删除搜索行
                if (skuList[skuList.length - 1].isSearchLine) {
                    skuList.splice(skuList.length - 1, 1);
                }
                let params = {
                    facPrdOrderGoodsId: this.facPrdOrderGoodsId,
                    isMaterials: 1,
                    commonBom: this.commonBomId,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    alterPurchaseDemand: data.updateMaterialChecked
                };
                this.title = '更新物料bom'
                this.editBomParams = params
                if (data.updateMaterialRadio !== 'noUpdateBom') {
                    this.editBomParams.updateCommonBomId = data.updateMaterialRadio;
                    this.editBomParams.saveAsCommonBomName = data.updateMaterialInput;
                }
                this.editFacPrdOrderGoodsMaterialSku(this.editBomParams);
            },
            //更新物料
            // updateMaterialBtn(data) {
            //     if (this.bomType === '编辑') {
            //         this.updateMaterialForEdit(data)
            //     } else {
            //         // if(status==='sure'){
            //         // this.editBomParams.alterPurchaseDemand=this.bomData.alterPurchaseDemand?data.updateMaterialChecked:false;
            //         if (data.updateMaterialRadio !== 'noUpdateBom') {
            //             this.addMaterialBom.updateCommonBomId = data.updateMaterialRadio;
            //             this.addMaterialBom.saveAsCommonBomName = data.updateMaterialInput;
            //         }
            //         // }
            //         this.addMaterialBom.facPrdOrderGoodsId = this.facPrdOrderGoodsId
            //         this.editFacPrdOrderGoodsMaterialSku(this.addMaterialBom)
            //     }
            // },
            // 编辑bom
            editFacPrdOrderGoodsMaterialSku(params) {
                params.userId = JSON.parse(sessionStorage.getItem("user_login")).userId
                params.unitId = JSON.parse(sessionStorage.getItem("last_login")).id
                editFacPrdOrderGoodsMaterialSku(params).then(res => {
                    console.log(res);
                    let that = this
                    if (res.data.code === 0) {
                        this.getFacPrdOrderDetail()
                        this.$message({
                            message: that.title + '成功',
                            type: 'success',
                            duration: this.$globalConfig.elementUI.duration,
                            onClose: function () {
                                that.editOrderBomVisible = false;
                            }
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.updateMaterial = false
                })
            },
            //creatOrderGo转工单
            creatOrderGo(bigIndex) {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.toMission")) {
                    return
                }
                this.btnLoading = true;
                checkAttachment({
                    unitId: this.unitId,
                    styleId: this.facPrdOrder.facPrdOrderGoodsList[bigIndex].styleId
                }).then(res => {
                    this.btnLoading = false;
                    if (res.data.code == 5007001) {
                        this.checkConfigDialog = true
                        this.checkConfigList = res.data.list || []
                    } else {
                        let facPrdOrderGoodsList = this.facPrdOrder.facPrdOrderGoodsList[bigIndex]
                        facPrdOrderGoodsList.commonBom = {};
                        facPrdOrderGoodsList.boomAllData = {};
                        facPrdOrderGoodsList.placeorderAt = this.facPrdOrder.placeorderAt;
                        facPrdOrderGoodsList.isOutsideFac = this.facPrdOrder.isOutsideFac;
                        facPrdOrderGoodsList.commonOutsideFactoryId = this.facPrdOrder.commonOutsideFactoryId;
                        if (sessionStorage.getItem('orderJump')) {
                            // console.log(sessionStorage.getItem('orderJump'));
                            sessionStorage.removeItem('orderJump')
                            // console.log(sessionStorage.getItem('orderJump'))
                            // sessionStorage.clear()
                        }
                        sessionStorage.setItem('orderJump', JSON.stringify(this.facPrdOrder.facPrdOrderGoodsList[bigIndex]))
                        this.$router.push({
                            path: '/CreateOrder',
                            query: {goFrom: 'CreateOrder'}
                        })
                    }
                })
            },
            //工序模板列表
            getEasyTemplateList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getNodeTemplateList(params).then(res => {
                    this.templateList = res.data.templates;
                });
            },
            endTime(val,index) {
                if(index==0) {
                    this.facPrdOrderGoodsCustomerList.forEach(v => {
                        v.goodsDeliveryAt = val ? val.trim() : ''
                    })
                }else {
                    if (val) {
                        this.$set(this.facPrdOrderGoodsCustomerList[index], 'goodsDeliveryAt', val.trim())
                    } else {
                        this.facPrdOrderGoodsCustomerList[index].goodsDeliveryAt = "";
                    }
                }
            },
            // 全部客户
            selectedCustomer() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: ''
                };
                getEasyCustomerList(params).then(res => {
                    this.customerList = res.data.customerList;
                });
            },
            //客户收起或展开
            slideCustomerListSet(item, type) {
                this.$set(item, 'slideCustomerList', type)

            },

            //一键转工单保存
            // 默认选中多选
            async dialogTableVisibleT(row) {
                // 权限
                if (!this.powerJudgement.permissions("fac.prcmission.toMission")) {
                    return
                }
                this.btnLoading = true;
                await this.getOrderToFacList(row)
                checkAttachment({unitId: this.unitId, facPrdOrderId: this.$route.query.id,goodsUnitId:row.goodsId}).then(res => {
                    this.btnLoading = false;
                    if (res.data.code == 5007001) {
                        this.checkConfigDialog = true
                        this.checkConfigList = res.data.list || []
                    } else {
                        this.dialogTableVisible = true;
                        let that = this;
                        setTimeout(function () {
                            console.log(that.$refs['multipleTable']);
                            that.facPrdOrderGoodsCustomerList.forEach(item => {
                                if (item.customerId) {
                                    item.customerFlag = true
                                } else {
                                    item.customerFlag = false
                                }
                                item.selTable = true;
                                that.$refs.multipleTable.toggleRowSelection(item, true)
                            })
                        }, 100)
                    }
                })
            },
            orderSel(sel, row) {
                if (row.selTable) {
                    this.$set(row, 'selTable', false)
                } else {
                    this.$set(row, 'selTable', true)
                }
            },
            orderSelAll(sel) {
                console.log(sel);
                this.facPrdOrderGoodsCustomerList.forEach((item,i) => {
                    if(i!=0){
                        item.selTable = sel.length>1
                    }
                })
            },
            // toggleAllSelection(){},
            orderToFacSaveSure() {

                const facPrdOrderGoodsCustomerList = []
                this.facPrdOrderGoodsCustomerList.forEach((v,i) => {
                    if(v.selTable&&i!=0){
                        facPrdOrderGoodsCustomerList.push({...v,deliveryAt:v.goodsDeliveryAt,processUnitPrice:v.goodsProcessUnitPrice})
                    }
                })
                if (facPrdOrderGoodsCustomerList.length == 0) {
                    this.$message.error('请勾选要转的工单')
                    return
                }

                if(facPrdOrderGoodsCustomerList.some(item =>!item.operaterId.length)){
                    this.$message.error('请选择负责人')
                    return
                }
               // return console.log(facPrdOrderGoodsCustomerList,'facPrdOrderGoodsCustomerList');
                this.creatOrderLoading = true
                orderToFacSave({
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    facPrdOrderGoodsCustomerList
                }).then(res => {
                    var that = this

                    if (res.data.code === 0) {

                        this.getFacPrdOrderDetail()
                        this.$message({
                            message: '转工单成功',
                            type: 'success',
                            duration: this.$globalConfig.elementUI.duration,
                            onClose: function () {
                                that.dialogTableVisible = false;
                                that.getFacPrdOrderDetail();
                                that.getOrderToFacList();
                                that.creatOrderLoading = false
                            }
                        });

                    } else {
                        this.creatOrderLoading = false
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //物料标记手动完成操作
            changePurchaseStatus(skuId) {
                let obj = {
                    facPrdOrderId: this.facPrdOrder.facPrdOrderId,
                    commonMaterialsSkuId: skuId,
                    purchaseStatus: 2,
                }
                updatePurchaseStatus(obj).then(res => {
                    console.log(res);
                    this.getFacPrdOrderDetail()

                })
            },
            canclePurchaseShow(skuId, goodsId) {
                this.dialogTableVisibleCX = true;
                this.canclePurchaseSkuId = skuId;
                this.cancelFacPrdOrderGoodsId = goodsId;
            },
            // 物料撤销采购计划
            canclePurchase() {
                this.isloading = true
                updateCanclePurchase({
                    facPrdOrderGoodsId: this.cancelFacPrdOrderGoodsId,
                    commonMaterialsSkuId: this.canclePurchaseSkuId,
                }).then(res => {
                    this.isloading = false
                    let that = this;
                    if (res.data.code === 0) {
                        this.getFacPrdOrderDetail()
                        this.$message({
                            message: '撤销成功',
                            type: 'success',
                            duration: this.$globalConfig.elementUI.duration,
                            onClose: function () {
                                that.dialogTableVisibleCX = false;
                            }
                        });
                    } else {
                        this.$message.error(res.data.msg);
                    }

                })
            },
            // 物料生成采购计划
            updatePurchasePlan(skuId, bigIndex) {
                // 目前只有一个商品所以就写死是第0个，后期加多商品就要改下
                let commonMaterialsSkuIds=[];
                commonMaterialsSkuIds.push(skuId);
                let obj = {
                    facPrdOrderGoodsId: this.facPrdOrder.facPrdOrderGoodsList[bigIndex].facPrdOrderGoodsId,
                    commonMaterialsSkuIds,
                };
                updatePurchasePlan(obj).then(res => {
                    console.log(res);
                    this.getFacPrdOrderDetail()

                })
            },
            //一键生成物料采购计划
            updateAllPurchasePlan(bomData,nowFacPrdOrderGoodsId){
                let data = bomData.commonMaterialsSkuList.length>0?bomData.commonMaterialsSkuList: bomData.skus;
                if(data.every(v => v.purchasePlanStatus!=0)) {
                    // 全部已生成则不发请求
                   return this.$message.success('已全部生成采购计划')
                }
                this.btnLoading = true
                let commonMaterialsSkuIds = data.map(v => {
                    return v.id
                })
                let obj = {
                    facPrdOrderGoodsId:nowFacPrdOrderGoodsId,
                    commonMaterialsSkuIds
                };
                updatePurchasePlan(obj).then(res => {
                    this.btnLoading = false
                    if(res.data.code==0) {
                        this.$message.success('已全部生成采购计划')
                        this.getFacPrdOrderDetail()
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },

        }
    }
</script>
<style lang="scss">
    .dialogTable {
        width: 80%;
        .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid rgba(230, 234, 240, 1);
            padding-bottom: 12px;
        }
        .el-input__inner {
            border: none;
        }
        .el-date-editor.el-input {
            width: 160px;
        }
        .dialogTable-btns {
            button {
                margin-right: 10px;
            }
            border-top: 1px solid rgba(230, 234, 240, 1);
            padding-top: 12px;
            margin-top: 30px;
            text-align: right;
        }
    }

    .repertory_dialog {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 20px 20px 0 20px;
        }
        .title {
            width: 100%;
            height: 52px;
            text-align: center;
            line-height: 52px;
            font-size: 20px;
            color: #3b3b3b;
            border-bottom: 1px solid #e0e6ed;
        }
        .footer {
            padding: 0 32px 32px 36px;
            button {
                margin: 0 6px;
            }
        }
    }

    .repertory_dialog--dele {
        .el-dialog {
            width: 766px;
        }
        .body {
            text-align: center;
            P {
                margin: 32px 0;
                font-size: 14px;
                color: #3b3b3b;
            }
        }
        .footer {
            display: flex;
            justify-content: center;
            padding-top: 28px;
            border-top: 1px solid #e0e6ed;
        }
    }

    //侧拉动画
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .coverBomTable {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .orderProductionDetail {
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

    .orderProductionDetail-bom {
        .page_title--head {
            font-size: 16px;
            margin-top: 15px;
        }
    }

    .adjust-list {
        .el-table td .cell {
            line-height: 18px;
            padding: 0;
        }
    }
</style>
<style scoped lang="scss">

    .editOrderP {
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        border-bottom: 1px solid rgba(13, 51, 128, 0.25);
    }

    .orderProductionDetail {
        min-height: 100%;
        .itemWidthBr {
            width: 100%;
        }
        .header {
            padding: 0 32px;
            border-bottom: 1px solid #e0e6ed;
        }

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
        .orderProductionDetail-bom {
            position: fixed;
            top: 0;
            right: 0;
            left: 200px;
            /*width: 86% !important;*/
            height: 100%;
            overflow-y: hidden;
            overflow-x: hidden;
            background-color: #fff;
            z-index: 101;
            box-sizing: border-box;
            padding: 10px 0;
            min-width: 560px;
        }
        .orderProductionDetail-line {
            height: 1px;
            background: rgba(230, 234, 240, 1);

        }
        .orderProductionDetail-news {
            padding: 24px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
            border-radius: 2px;

            .orderProductionDetail-news-ct {
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
        .orderProductionDetail-goods {
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
            border-radius: 2px;
            margin-top: 12px;
            .orderProductionDetail-goods-news {
                padding-bottom: 0;

            }
            .orderProductionDetail-goods-material {
                background: rgba(255, 255, 255, 1);
                border-radius: 2px;
            }
            .orderProductionDetail-news-customer {
                background: rgba(252, 253, 255, 1);
                border: 1px solid rgba(230, 234, 240, 1);
                width: 900px;
                margin-top: 8px;
                .orderProductionDetail-news-customerList {
                    padding: 16px;
                    padding-bottom: 0;
                }
            }
        }
        .orderProductionDetail-goods-material {
            padding: 24px;
        }
        .orderProductionDetail-goods-order {
            padding: 24px;
            padding-top: 0;
        }
        .orderProductionNew-file {
            width: 100%;
            min-height: 200px;
            padding: 24px;
            overflow: hidden;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
            border-radius: 2px;
            margin-top: 8px;
        }

        .adjust-list {
            margin-top: 16px;
            .opera {
                font-size: 12px;
                display: flex;
                /*justify-content: space-between;*/
                justify-content: center;
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
                white-space: nowrap;
                display: flex;
                /*justify-content: space-between;*/
                justify-content: center;
                align-items: center;
                color: #1CA1FF;
                text-decoration: underline;
                cursor: pointer;
                text-align: center;
                width: 100%;
                height: 100%;
                border-right: 1px solid #E6EAF0;
            }
        }

        .mission {
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
    }
</style>
