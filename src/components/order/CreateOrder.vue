<template>
    <el-row id="add_order">
        <section class="nf-scroll-container">
            <page-title class="order-title" title="新建工单">
                <nf-button @click="delKeepAliveStatus(1)">取消</nf-button>
                <nf-button type="warning" :loading="isAddLoading" @click="handleAddMission">确认</nf-button>
            </page-title>
            <div class="nf-scroll-view">
                <el-col :span="24" class="create-order-info">
                    <content-wrap title="工单信息" type="big">
                        <el-col :span="24" class="info-list1">
                            <div class="info-item">
                                <span class="info-item__label">
                                    工单号
                                </span>
                                <el-input :disabled="openRule" :class="{'order-null':formVerification.orderName}" :maxlength="30"
                                          v-model.trim="addMissionInfo.orderNo" placeholder="工单号可不填自动生成"></el-input>
                                <span v-show="formVerification.orderName" class="form-tips">工单号不能为空</span>
                            </div>
                            <div class="info-item second-info-item">
                                <span class="info-item__label is-required">
                                    制单日期
                                </span>
                                <el-date-picker v-model="addMissionInfo.placeorderAt" @change="beginTime" type="date"
                                                format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label is-required">
                                    优先级
                                </span>
                                <el-select v-model="addMissionInfo.priority" placeholder="请选择">
                                    <el-option
                                            v-for="item in priorityList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-col>
                        <el-col :span="24" class="info-list1">
                            <div class="info-item">
                                <span class="info-item__label is-required">
                                    交货日期
                                </span>
                                <el-date-picker :class="{'order-date':formVerification.endTime}"
                                                v-model="addMissionInfo.deliveryAt" @change="endTime($event)"
                                                type="date" format="yyyy-MM-dd" placeholder="选择日期"
                                                :picker-options="pickerOptions1">
                                </el-date-picker>
                                <span class="form-tips" v-show="formVerification.endTime">交货日期不能为空</span>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label">
                                    客户款号
                                </span>
                                <el-input v-model="addMissionInfo.customerSytleNo" placeholder="请输入款号"></el-input>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label">
                                    客户订单号
                                </span>
                                <el-input :maxlength=15 v-model.trim="addMissionInfo.customerOrderNo"
                                          placeholder="请输入订单号"></el-input>
                            </div>
                        </el-col>
                        <el-col :span="24" class="info-list1" v-clickoutside="hideSelectCustomer">
                            <div class="info-remake">
                                <span class="info-item__label">
                                    备注
                                </span>
                                <el-input :maxlength=200 v-model.trim="addMissionInfo.remark"
                                          placeholder="请输入备注"></el-input>
                            </div>
                        </el-col>
                    </content-wrap>
                </el-col>
                <el-col :span="24" class="create-order-info">
                    <content-wrap class="create-order-content" title="订货信息" type="big">
                        <el-col :span="24" class="info-list1" v-clickoutside="hideSelectGood">

                            <div class="info-item">
                                <span class="info-item__label is-required">
                                    商品款号
                                </span>
                                <span v-if="$route.query.goFrom">{{goodsValue}}</span>
                                <div v-if="!$route.query.goFrom" :class="['customerSel',formVerification.goodsNo?'order-customer':'']"
                                     @click="selectGoods" style="display:flex;flex:1;">
                                    <div style="display:flex;flex:1;"
                                         :class="{'customerSelect': goodsValue,'customerS':!goodsValue}">
                                        <input  class="colorFont" type="text" placeholder="输入款号/名称/货号搜索" v-model="goodsValue"
                                               @keyup="seachGoodsInfo">
                                    </div>
                                    <i class="el-icon-caret-bottom" :class="{'down':downGoods}"></i>
                                    <div class="customer_table" :class="{'heightUl':downGoods}">
                                        <div class="setCustomer" @click="handleGoods('add')">
                                            <i class="el-icon-plus"></i>新建
                                        </div>
                                        <ul>
                                            <li v-for="(item,index) in info.goodsOptions" :key="index"
                                                @click="selecteGoods(item,index)">
                                                <img style="width: 30px;height:30px;margin:0 5px 0 10px;background-color:lightgray" :src="item.picture" v-errorLogo>
                                                <span>{{item.show}}</span>
                                                <!--<span>{{ item.styleNo }}{{item.styleName !== '未填写' && item.styleName?'-'+item.styleName:''}}</span>-->
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <span class="form-tips" v-show="formVerification.goodsNo">货品款号不能为空</span>
                            </div>
                            <div class="info-item" v-clickoutside="hideDownGoods">
                                <span class="info-item__label is-required">
                                    客户
                                </span>

                                <div v-if="$route.query.goFrom && fillType==='customer'" :class="['customerSel',formVerification.customerName?'order-customer':'']"
                                     @click="selectCustomer" style="display:flex;flex:1;">
                                    <div style="display:flex;flex:1;"
                                         :class="{'customerSelect':customerValue,'customerS':!customerValue}">
                                        <input class="colorFont" type="text" placeholder="请选择客户" v-model="customerValue"
                                               @keyup="seachCustomer">
                                    </div>
                                    <i class="el-icon-caret-bottom" :class="{'down':downCustomer}"></i>
                                    <div class="customer_table" :class="{'heightUl':downCustomer}">
                                        <div class="setCustomer" @click="customerDialog = true">+ 新建</div>
                                        <ul>
                                            <li v-for="(item,index) in customerList" :key="index"
                                                @click="selectedCustomer(item,index)">
                                                <span>{{item.name}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <customer v-else  single="single" v-model="addMissionInfo.customerId"></customer>
                                <!--<span class="form-tips" v-show="formVerification.customerName">客户不能为空</span>-->
                            </div>
                            <div class="info-item"></div>
                        </el-col>
                        <el-col :span="24" class="supplier" v-if="skuList&&skuList.length" >
                            <span class="label">供应商:</span>
                            <span :class="{'issupplier':skuList[0].supplierName==null}">{{ skuList[0].supplierName?skuList[0].supplierName:"无" }}</span>
                        </el-col>
                        <el-col :span="24" class="info-list1">
                            <span class="info-item" style="margin-left:78px;width: 60%">
                                <img v-if="addMissionInfo.goodsId" style="height:36px;width:36px;"
                                     :src="pic_itemGoods.picture ? pic_itemGoods.picture : staticImg">
                                <span class='checkGoodsPic' @click="checkGoodsPic(pic_itemGoods)"
                                      v-if="addMissionInfo.goodsId" style="font-size:14px;color:#636363;">查看货品图片</span>
                                <span class="goods-edit" @click="handleGoods('edit')" v-if="addMissionInfo.goodsId"><icon
                                        type="icon-edit"></icon> 编辑货品</span>
                                <span style="font-size:14px;color:#636363;">订货数量总计：</span>
                                <span style="color:#ff9c38;font-size:16px;">{{addMissionInfo.total ? addMissionInfo.total : 0}} </span> 件
                                <nf-button
                                  style="margin-left:16px;font-size:12px;"
                                  type="success" @click="getSkuCodeShow" v-if="addMissionInfo.goodsId">按码比填数</nf-button>
                            </span>
                        </el-col>

                        <!--表格开始-->
                        <el-col class="info-table" :span="24" v-if="skuList && skuList.length">
                            <nf-sku-table
                                    ref="nfskutable"
                                    editable
                                    editableAndInitial
                                    :metadatas="skuList"
                                    :quantities="skuListCount"
                                    showNum
                                    style="margin-top: 20px"
                                    @change="countTotalNum"
                            ></nf-sku-table>
                            <!-- <service-table :tableData="tableData3" :skuVal="skuVal" @setReportOnce="getOnce" :isEdit="true"></service-table> -->
                        </el-col>
                        <section class="info-section">
                            <el-col :span="24" class="info-list1">
                                <div class="info-item">
                                    <span class="info-item__label">
                                        工艺单
                                    </span>
                                    <el-select :disabled="!goodsValue" class="info-item__select"
                                               @change="handleWorkingSheetChange" v-model="addMissionInfo.workingSheet"
                                               :placeholder="!goodsValue ? '请选择货品' : '选填'">
                                        <el-option :label="'使用新的工艺单'" :value="'new'">
                                        </el-option>
                                        <el-option v-for="(item, index) in workingSheetOptions" :key="index"
                                                   :label="item.name || ' '" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="info-item">
                                    <el-checkbox v-model="value" v-show="false">修改后更新货品工艺单</el-checkbox>
                                </div>
                                <div class="info-item preview-btn__wrap">
                                    <nf-button @click="checkPdf" v-show="addMissionInfo.workingSheet">
                                        <span v-if="!isLoading">预览工艺单</span>
                                        <span v-if="isLoading">正在读取文件...</span>
                                    </nf-button>
                                </div>
                            </el-col>
                        </section>
                        <section v-show="visible.editorVisble" class="info-section">
                            <el-row class="ue-editor">
                                <ue :defaultMsg="addMissionInfo.processForm.content" :config="config" :id="'ue1'" ref="ue"></ue>
                            </el-row>
                            <attachment class="attachment-upload" :attachData="addMissionInfo.processForm.attachments"
                                        @attachD="getFileList"></attachment>
                        </section>
                    </content-wrap>
                </el-col>
                <section class="create-section">
                    <div class="header" style="width:0;height:0;">
                    </div>
                    <div class="create-main">
                        <div class="main-title">
                            工序节点
                        </div>
                        <div class="procedure-name">
                            <div class="form-wrap">
                                <div class="form-item">
                                    <label class="form-label is-require">工序模板</label>
                                    <el-select
                                            v-model="addMissionInfo.process.templateId"
                                            filterable
                                            placeholder="请选择">
                                        <el-option v-for="(item,index) in templateList" :key="index" :label="item.name"
                                                   :value="item.id" @click.native="getTemplateId(item)">
                                            <div>{{item.name}}</div>
                                            <!--<span>{{item.chargers}}</span>-->
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-wrap search-man ">
                                <div class="form-item selLeader">
                                    <label class="form-label is-require">负责人</label>
                                    <workerLeader
                                            style="width: 240px;"
                                            :placeholder="'请选择负责人'"
                                            :class="{'order-leader':formVerification.leaderSelected}"
                                            v-model="value10">
                                    </workerLeader>
                                </div>
                                <span v-show="formVerification.leaderSelected" class="form-tips">负责人不能为空</span>
                            </div>
                            <div class="form-wrap">
                                <div class="form-item">
                                    <span class="form-label">
                                        <el-checkbox v-model="addMissionInfo.outSideFlag" @change="getOutSideChange">整单外发</el-checkbox>
                                    </span>
                                    <el-select
                                            v-if="addMissionInfo.outSideFlag"
                                            filterable
                                            clearable
                                            v-model="addMissionInfo.outSideFactoryId"
                                            placeholder="请选择外发工厂">
                                        <template>
                                            <el-option value="" disabled style="cursor:pointer;">
                                                <span class="new_set" @click="addOutsideFactoryVisible = true">新建</span>
                                            </el-option>
                                        </template>
                                        <el-option
                                                v-for="item in outsideFactoryList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-wrap" v-if="addMissionInfo.outSideFlag">
                                <div class="form-item">
                                    <label class="form-label">加工单价</label>
                                    <el-input @blur="handleMachiningUnitPriceBlur(addMissionInfo.machiningUnitPrice)" type="number"  v-model.trim="addMissionInfo.machiningUnitPrice"
                                          placeholder="元/件"></el-input>
                                </div>
                            </div>
                        </div>
                        <div class="procedure-flow">
                            <div class="scroll-table">
                                <div class="table jn-table">
                                    <div class="table-th">
                                        <div class="table-td" style="width:240px;box-sizing:border-box;">
                                            节点名称
                                        </div>
                                        <div class="table-td" style="width:240px;box-sizing:border-box;">
                                            负责人
                                        </div>
                                        <div class="table-td" style="width:180px;box-sizing:border-box;">
                                            工价
                                            <icon type="icon-tongyong-tishi" style="width:14px;"></icon>
                                            <el-popover ref="popover2" placement="top-start" width="200" :offset="130"
                                                        height="86" trigger="hover">
                                                <div style="color:#a2abb8">
                                                    在制单时选用节点后该工单这个字段的数值会与 上报数量参与运算，得出每个工位在一个时间段 内的工资
                                                </div>
                                            </el-popover>
                                        </div>
                                        <div class="table-td" style="width:160px;box-sizing:border-box;">
                                            计划结束日期
                                        </div>
                                        <div class="table-td" style="width:160px;box-sizing:border-box;">
                                            预警提醒 (天)
                                        </div>
                                        <div class="table-td" style="width:180px;box-sizing:border-box;">
                                            差额提醒 (数量)
                                        </div>
                                        <div class="table-td" style="width:100px;box-sizing:border-box;">
                                            外发结算
                                        </div>
                                        <div class="table-td" :title="titleMsg" style="width:130px;box-sizing:border-box;">
                                            上报为工单出货数
                                        </div>
                                        <div class="table-td" style="width:240px;box-sizing:border-box;">
                                            上游节点
                                        </div>
                                        <div class="table-td" style="width: 160px;text-align: center;box-sizing:border-box;">
                                            操作
                                        </div>
                                    </div>
                                </div>
                                <draggable v-model="addMissionInfo.process.nodemsg" :options="{handle:'.draggable'}" @update="datadragEnd">
                                    <transition-group class="table">
                                        <div class="table-tr" v-for="(item, index) in addMissionInfo.process.nodemsg"
                                             :key="'Node'+index">
                                            <div class="table-td node_users" style="width: 240px;padding-left:0;box-sizing:border-box;">
                                                <template>
                                                    <el-select v-model="item.id" filterable placeholder="请选择节点"
                                                               @change="showNodeId(item.id, index, item.idFlag)">
                                                        <el-option disabled="true"
                                                                   style="color:#ff9c38;padding-left:10px;padding-top:5px;width:100%;cursor:pointer;">
                                                            <div @click="getNodeType(index)" class="new_node">
                                                                <span>+新建</span>
                                                            </div>
                                                        </el-option>
                                                        <el-option v-for="(nodeItem, index) in nodeList" :key="index"
                                                                   :label="nodeItem.name+'（'+nodeItem.typeName+'）'"
                                                                   :value="nodeItem.id">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </div>
                                            <div class="table-td node_user node_users node_usersUl" style="width:241px;box-sizing:border-box;"
                                                >
                                                <!--<template>-->
                                                <workerLeader
                                                        style="width: 240px;"
                                                        :placeholder="'请选择负责人'"
                                                        v-model="item.nodeUserIds"
                                                >
                                                </workerLeader>
                                                <!--<el-select v-model="item.nodeUserIds" multiple filterable remote-->
                                                           <!--placeholder="请选择负责人" :remote-method="keyworkLeader"-->
                                                           <!--@change="showSelect($event)"-->
                                                           <!--:popper-class="'peoListLeadNode'+index+' peoListLeadNode-down'"-->
                                                           <!--@visible-change="selShowNode($event)">-->
                                                    <!--<template v-for="(item,mIndex) in manList">-->
                                                        <!--<el-option v-show="mIndex == listIndexNode"-->
                                                                   <!--v-for="($item,$index) in item.facUserDTOS"-->
                                                                   <!--:key="$item"  :label="$item.loginName+'_'+$item.userName"-->
                                                                   <!--:value="$item.userId">-->
                                                        <!--</el-option>-->
                                                    <!--</template>-->
                                                <!--</el-select>-->
                                            </div>
                                            <div class="table-td" style="width:180px;box-sizing:border-box;">
                                                <div v-if="item.id" class="wages">
                                                    <span v-if="!item.typeAilc">————</span>
                                                    <el-tooltip v-if="item.typeAilc" content="请输入正确的工价(示例：29.888)"
                                                                placement="top">
                                                        <input @blur="handleWagesBlur(item)" type="number"
                                                               style="width:80px" v-model="item.wages"/>
                                                    </el-tooltip>
                                                    <span v-if="item.typeAilc">元／件</span>
                                                </div>
                                            </div>
                                            <div class="table-td" style="width:160px;box-sizing:border-box;">
                                                <nf-picker :beginTime='item' :timeSelect="'end'"
                                                           @endAt='nodeEnTime'></nf-picker>
                                            </div>
                                            <div class="table-td" style="width:160px;padding-left:12px;box-sizing:border-box;">
                                                <el-checkbox v-model="item.needDelayWarning"></el-checkbox>
                                                <span class="little-gap" v-show="item.needDelayWarning">结束前</span>
                                                <input @input="warning(index,item.delayWarningNum)"
                                                       v-model="item.delayWarningNum" v-show="item.needDelayWarning"
                                                       type="number" class="input-bg little-gap">
                                                <span v-show="item.needDelayWarning">天</span>
                                            </div>
                                            <div class="table-td" style="width:180px;padding-left:12px;box-sizing:border-box;">
                                                <div v-show="item.id&&item.allowDifferenceWarning">
                                                    <div v-show="item.isAllowDifferenceWarning!=false">
                                                        <el-checkbox v-model="item.needDifferenceWarning"></el-checkbox>
                                                        <input @input="small(index,item.differenceWarningMin)"
                                                               v-model="item.differenceWarningMin"
                                                               v-show="item.needDifferenceWarning" type="number"
                                                               class="input-bg little-gap">
                                                        <span v-show="item.needDifferenceWarning">-</span>
                                                        <input @input="big(index,item.differenceWarningMax)"
                                                               v-model="item.differenceWarningMax"
                                                               v-show="item.needDifferenceWarning" type="number"
                                                               class="input-bg little-gap">
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- 外发结算 -->
                                             <div class="table-td" style="width:100px;padding-left:12px;box-sizing:border-box;">
                                                 <div v-if="showOutsideBalance(item)">
                                                    <div>
                                                        <el-checkbox v-model="item.allowOutsideBalance" @change="changeCheck(item,item.allowOutsideBalance)"></el-checkbox>
                                                    </div>
                                                 </div>
                                            </div>
                                            <!--上报为工单出货数-->
                                            <div class="table-td" style="width:130px;padding-left:12px;box-sizing:border-box;">
                                                <div class="mission-shipment-radio">
                                                    <el-radio
                                                            v-if="showMissionShipment(item)"
                                                            :key="'radio'+index"
                                                            :label="item.labelId"
                                                            v-model="missionShipment">
                                                    </el-radio >
                                                </div>
                                            </div>
                                            <!-- 上游节点 -->
                                            <div class="table-td node_users" style="width: 240px;padding-left:0;box-sizing:border-box;">
                                                <template>
                                                    <el-select v-if="showUpstreamNode(item)"
                                                               v-model="item.upstreamNodeIdFlag"
                                                               filterable
                                                               clearable
                                                               placeholder="请选择节点">
                                                               <el-option v-for="items in upstreamNode"
                                                                       :disabled="item.idFlag === items.idFlag"
                                                                       :key="items.idFlag"
                                                                       :label="items.name"
                                                                       :value="items.idFlag">
                                                               </el-option>
                                                    </el-select>
                                                </template>
                                            </div>
                                            <div class="table-td" style="width: 160px;text-align: center;box-sizing:border-box;">
                                                <div class="handle">
                                                    <div class="draggable">
                                                        <i class="fa fa-bars"></i>拖动
                                                    </div>
                                                    <div v-if="!item.delayNotifyNode" @click="deleteNode(index, item.idFlag)">
                                                        <i class="fa fa-times"></i>删除
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                            <div class="add">
                                <el-button type="text" @click="addNode()">+添加节点</el-button>
                            </div>
                        </div>
                    </div>
                </section>
                <!--工单BOM表-->

                <section class="bom-contain" v-if="showBom">
                    <bom-table  @bomData="bomData"
                                from="addMissionOrder"
                                :showBom='false'
                                :orderId="facPrdOrderId"
                                :source="$route.query.goFrom"
                               :lengthTrue="tableData3.lengths.length>0"
                               v-if="this.addMissionInfo.styleId&&showBom"
                               :styleId="this.addMissionInfo.styleId"></bom-table>
                </section>
            </div>
        </section>
        <el-dialog :visible.sync="visible.showCancel" size="tiny" :show-close="false">
            <span style="font-size:20px;">&emsp;&emsp;&emsp;是否切换模板</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modelNull">取 消</el-button>
                <el-button type="primary" @click="successChangeTemplate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新建节点 -->
        <el-dialog size="tiny" :visible.sync="visible.createVisible" :show-close="false">
            <div class="dialog-title" slot="title">
                新增节点
            </div>
            <div class="dialog-form">
                <el-form label-position="top" :model="formLabelAlign" ref="ruleForm">
                    <el-form-item label="节点名称" prop="name">
                        <el-input v-model="formLabelAlign.nodename" placeholder="请输入节点名称"
                                  @change="nodeNameRepeat"></el-input>
                        <div class="text" v-if="nodeRepeat">此节点已存在，请检查后输入新的节点名称。</div>
                    </el-form-item>
                    <el-form-item label="节点类型" prop="region" v-popover:popover1>
                        <el-select v-model="formLabelAlign.id" placeholder="请选择数据类型" @change="NodeTypeValue($event)">
                            <el-option v-for="(item) in options" :key="item.id" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                        <div class="text" v-if="numberType">节点类型设置为“数量型”后，不可再修改。请慎重考虑。</div>
                        <el-popover ref="popover1" placement="top-start" width="200" :offset="180" height="86"
                                    trigger="hover">
                            <div style="color:#a2abb8">节点数据类型决定在工单里此节点的完成方式。</div>
                            <div style="color:#a2abb8">逻辑型：是否完成</div>
                            <div style="color:#a2abb8">数量型：已完成数量是否达到预设的数量</div>
                        </el-popover>
                    </el-form-item>
                </el-form>
            </div>
            <div class="submit">
                <button class="cancle-btn" @click="visible.createVisible = false">取消</button>
                <button class="submit-btn" @click="addNewNode()">确定</button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="visible.dialogSheetVisible" size="tiny" width="30%">
            <h3 class="color-title">
                是否将当前工艺单同步保存到“{{ goodsValue }}" 的工艺信息里？
            </h3>
            <div class="color-set sheet-set">
                <p class="grey">如需同步保存，请输入工艺单名称：</p>
                <div>
                    <el-input type="text" v-model="addMissionInfo.processForm.name" placeholder="请输入工艺单名称"/>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="handleSubmitWorkSheet('cancel')">不同步</nf-button>
                <nf-button type="warning" @click="handleSubmitWorkSheet('')">同步</nf-button>
            </span>
        </el-dialog>
        <div class='managements'>
            <el-dialog :visible.sync="centerDialogVisible" :show-close="true" width="100%" :modal="true" center>
                <div>
                    <i class="el-icon-arrow-left" @click="leftImg"></i>
                </div>
                <div class="imgs"><img :src="this.imgLists[i]"></div>
                <div>
                    <i class="el-icon-arrow-right" @click="rightImg"></i>
                </div>
            </el-dialog>
        </div>
        <node-dialog @hiddenShow="hiddenShow" @addNode="addNodes" :isShow="isShowNewNode"></node-dialog>
        <transition name="right-move">
            <customer-dialog v-if="customerDialog" @hidden="hiddenAddCustomerDialog" @updateName="updateName"></customer-dialog>
        </transition>
        <transition name="right-move">
            <goods-dialog
                    v-if="goodsDialog"
                    modelName="FACTORY_MISSION"
                    :handleType="handleType"
                    :goodsId="editGoodsId"
                    :styleId="editGoodsStyleId"
                    @hidden="hiddenAddGoodsDialog">
            </goods-dialog>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="customerDialog" @click="hiddenAddCustomerDialog">
            </div>
            <div class="cover1" v-if="goodsDialog" @click="hiddenAddGoodsDialog">
            </div>
        </transition>

        <transition name="right-move">
            <add-outside-factory v-if="addOutsideFactoryVisible" type="add" @hiddenWindow="addOutsideFactoryVisible=false" @hideCover="addOutsideFactoryVisible=false"
                 @addSuccess="addOutsideFactorySuccess"></add-outside-factory>
        </transition>
        <transition name="opcity">
            <div style="z-index: 2004" class="cover" v-if="addOutsideFactoryVisible" @click="addOutsideFactoryVisible=false">
            </div>
        </transition>
        <!--更新物料-->
        <!--<materialAndGoodsBomUpdate @updateMaterialBtn="updateMaterialBtn" :easyBomList="bomList" :updateMaterial="updateMaterial" :alterPurchaseDemand="false"></materialAndGoodsBomUpdate>-->
        <!-- 码比数 -->
        <sku-code-ratio :styleId="addMissionInfo.styleId" :metadatas="skuList" :totalsNum='totalsNum' :quantities="skuListCount" :isShow.sync="skuCodeShow"  @getCodeNumber="getCodeNumber"></sku-code-ratio>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import draggable from "vuedraggable";
    import CustomerDialog from './createChild/customer-dialog.vue'
    import GoodsDialog from './createChild/goods-dialog.vue'
    import nodeDialog from '../templateManage/children/newNodeDialog'
    import NfPicker from "./nf-picker";
    import Ue from "../ue/ue";
    import sizeSelect from '@/components/Common/size-select.vue'
    import skuCodeRatio from '@/components/Common/sku-table/sku-code-ratio.vue'
    import Attachment from "../goods/child/attachEdit";
    import bomTable from './createChild/bomTable'
    import addOutsideFactory from '@/components/outsideFactory/add.vue'

    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";
    import {
        getGoodSkuList, getWorkbayList, getEasyTemplateList, addTaskNode, getDicReportTypeList,
        queryTaskNodeList, checkTemplateName, getTemplate, updateTemplate, addMission, getFacCustomerList,
        getUploadToken, addFacGoodsStyle, getEasyCustomerList, getPersonList, easyBomList,
        selectFacGoodsStyleList, getCommonProcessForm, previewCommonProcessForm, getFacGoodsPictureList,
        getNodeTemplateList, templateInfo, getAllNodeList, getUnitUser,outsideFactoryListForSelect, ruleList
    } from "../../api/api";
    import ServiceTable from "../service/serviceTable";

    export default {
        name: 'CreateOrder',
        data() {
            return {
                fillType:'',
                facPrdOrderId:'',
                // updateMaterial:false,
                skuCodeShow: false, // 码比数按钮
                bomList:[],
                manList:[],
                skuListCount: [],
                leaderNodeShowIndex: 0,
                listIndexNode: 0,
                addSelGroupNode: 0,
                getGds: 0,
                defaultMsg: "",
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 450,
                    zIndex: 99
                },
                templateData: {
                    oldVal: "",
                    val: ""
                }, // 工序模版数据暂存
                // 数据
                obj: {}, //备份表格数据
                colorSetName: '',
                isLoading: false,
                isAddLoading: false,
                sameStyle: "",
                sameCustomer: {},
                info: {
                    goodsOptions: [] //货品下拉列表,
                },
                customerList: [],
                principalOptions: [],
                value: "",
                isTable: false,
                dialogVisible: false,
                dialogVisibleCustomer: false,
                goods: [],
                tableData3: [],
                skuVal: {},
                skuList: [],
                //拖动模块
                nodeList: [],
                //模板负责人
                value10: [],
                functionary: [],
                templateList: {},
                addMissionInfo: {
                    priority: 0,
                    remark: "",
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId: '',
                    orderNo: "",
                    total: "",
                    placeorderAt: "",
                    deliveryAt: "",
                    customerOrderNo: "",
                    customerSytleNo: "",
                    missionAttachment: [],
                    customerId: "",
                    goodsId: "",
                    styleId: "",
                    process: {
                        templateId: "",
                        leaderIds: [],
                        nodemsg: []
                    },
                    fileList: [],
                    sku: [],
                    processForm: {
                        attachments: [],
                        content: ''
                    },
                    workingSheet: "",
                    facMissionBomDTO: {},
                    // 外发工厂表单相关变量
                    outSideFlag:false, // 是否外发
                    outSideFactoryId:'', //外发工厂id
                    machiningUnitPrice:'', //加工单价
                    supplierName:'',//供应商名字
                },
                fileList: [],
                workingSheetOptions: [],
                downCustomer: false,
                //=======添加货品部分=========
                downGoods: false,
                goodsValue: "",
                //新建节点
                options: [],
                visible: {
                    createVisible: false,
                    editVisible: false,
                    showCancel: false,
                    editorVisble: false,
                    dialogSheetVisible: false
                },
                formLabelAlign: {
                    nodename: "",
                    region: "",
                    id: "",
                    type: "",
                    multiple: []
                },
                nodeRepeat: false,
                numberType: false,
                index_node: -1,
                customerNo: true,
                pickerOptions0: {
                    //下单时间不能大于交货时间
                    disabledDate: deliverytime => {
                        if (this.addMissionInfo.deliveryAt) {
                            const date = this.addMissionInfo.deliveryAt.replace(/-/g, "/");
                            return deliverytime.getTime() > +new Date(date) - 8.64e7;
                        }
                    }
                },
                pickerOptions1: {
                    disabledDate: placeordertime => {
                        if (this.addMissionInfo.placeorderAt) {
                            const date = this.addMissionInfo.placeorderAt.replace(/-/g, "/");
                            return placeordertime.getTime() <= +new Date(date) - 8.64e7;
                        }
                    }
                },
                pic_itemGoods: {},
                imgLists: [],
                centerDialogVisible: false,
                i: 0,
                picture: '',
                errorWages: false, // 工价错误信息
                colorSearch: false,
                searchData: [],
                isShowNewNode: false,
                commonBomMaterialsList: [],
                bomDatas: {},
                showBom: false,
                attachments: [],
                customerDialog: false,
                goodsDialog: false,
                imgList: [],
                priorityList: [
                    {
                        label: "普通",
                        value: 0
                    },
                    {
                        label: "加急",
                        value: 1
                    },
                    {
                        label: "特急",
                        value: 2
                    },
                ],
                formVerification: {
                    orderName: false,
                    customerName: false,
                    endTime: false,
                    goodsNo: false,
                    leaderSelected: false
                },
                handleType: '',      //货品操作类型：新建/编辑
                editGoodsId: '',      //编辑操作要用的goodsId
                editGoodsStyleId: '',  //编辑操作要用的styleId
                chargersArr:[],          //工序模板默认负责人
                staticImg:this.$globalConfig.qiniu.baseDefaultUrl,
                // 外发工厂列表
                outsideFactoryList:[],
                // 是否显示新建外发厂弹层
                addOutsideFactoryVisible:false,
                // 输入的加工单价是否错误
                errorMachiningUnitPrice:false,
                backupStyleId:'',
                upstreamNode: [],   //上游节点列表
                openRule: false, //是否开启自动编号
                totalsNum:'',//存储每个颜色额总数
                missionShipment: '',    //上报为工单出货数 单选值
                titleMsg: '设置某个节点后，在工单完成后将该节点上报的完成数视为工单出货数。若不选择，创建时系统自动取最后一个节点为上报出货数节点。',
            };
        },
        watch: {
            'addMissionInfo.process.nodemsg': {
                // 监听添加的节点中有没有到料型节点，有的话显示bom表
                handler(val, oldVal) {
                    this.showBom = false;
                    let newBomNeed = val.some(item => item.typeBomNeed == true)
                    if(newBomNeed && this.goodsValue){
                        this.showBom = true;
                    } else {
                        this.showBom = false;
                    }
                    this.getMissionShipment(val);
                },
                // 深度观察
                deep: true
            },
            'goodsValue': {
                // 监听商品款号有没有变
                handler(val, oldVal) {
                    this.showBom = false;
                    let newBomNeed = this.addMissionInfo.process.nodemsg.some(item => item.typeBomNeed == true)
                    if(newBomNeed && val){
                        this.showBom = true;
                    } else {
                        this.showBom = false;
                    }
                }
            },
            'addMissionInfo.orderNo': {
                handler(val) {
                    if (val) {
                        this.formVerification.orderName = false;
                    }
                }
            },
            'addMissionInfo.customerId': {
                handler(val) {
                    if (val) {
                        this.formVerification.customerName = false;
                    }
                }
            },
            'addMissionInfo.goodsId': {
                handler(val) {
                    if (val) {
                        this.formVerification.goodsNo = false;
                    }
                }
            },
            'addMissionInfo.deliveryAt': {
                handler(val) {
                    if (val) {
                        this.formVerification.endTime = false;
                    }
                }
            },
            'addMissionInfo.styleId': {
                handler(val) {
                    if (val) {
                       // h获取bom表列表
                        let params = {
                            styleId: this.addMissionInfo.styleId,
                            userId: this.$store.state.userInfo.id,
                        };
                        easyBomList(params).then(res => {
                            this.bomList = res.data.commonBomList;
                        });
                    }
                }
            },

            'value10': {
                handler(val) {
                    this.showSelects(val)
                    if (val.length > 0) {
                        this.formVerification.leaderSelected = false;
                    }
                }
            }
        },
        components: {
            ServiceTable,
            draggable,
            NfPicker,
            Ue,
            Attachment,
            nodeDialog,
            bomTable,
            sizeSelect,
            CustomerDialog,
            GoodsDialog,
            addOutsideFactory,
            skuCodeRatio
        },
        computed: {
            // 新的工艺单
            isNewSheet() {
                const {workingSheet} = this.addMissionInfo;
                const content = this.$refs["ue"].getUEContent();
                const {attachments} = this.addMissionInfo.processForm;
                return workingSheet === 'new' && (content || (attachments&&attachments.length));
            },
            // 没有工艺单
            isNullSheet() {
                const {workingSheet} = this.addMissionInfo;
                const content = this.$refs["ue"].getUEContent();
                const {attachments} = this.addMissionInfo.processForm;
                return (!workingSheet || workingSheet === 'new') && !content && attachments && !attachments.length;
            },
            // 已存在工艺单，但已修改
            isEditSheet() {
                const {workingSheet} = this.addMissionInfo; // 选中的工艺单id；
                if (!workingSheet || workingSheet === 'new') return false;
                const {attachments} = this.addMissionInfo.processForm;
                const newContent = this.$refs["ue"].getUEContent();
                let fItem = this.workingSheetOptions.find(item => item.id === workingSheet);
                if(!fItem){
                     fItem = {
                        attachments:[],
                        content:''
                    }
                }
                const isChangeAttachments = JSON.stringify(fItem.attachments) != JSON.stringify(attachments);

                return (fItem.content !== newContent || isChangeAttachments);
            },
            isExistSheet() {
                const {workingSheet} = this.addMissionInfo;
                return workingSheet && workingSheet !== 'new';
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        created() {
            // 生命周期实例化钩子函数
            this.getUnitUser();
            this.getNodeList();
            this.fetchCustomerList();
            this.getEasyTemplateList();
            this.getFacCustomerList();
            //获取是否开启自动编号
            this.getRuleList()
            //生产单跳转过来
            if(this.$route.query.goFrom){
                this.getOrderUrl();
            }else {
                this.getGoods();
                this.getOutsideFactoryList();
                this.getFacCustomerList();
            }

        },
        mounted(){

        },
        activated() {
            //生产单跳转过来
            if(this.$route.query.goFrom){
                this.getOrderUrl();
            }else {
                this.getGoods();
                this.getOutsideFactoryList();
                this.getFacCustomerList();
            }
        },
        methods: {
            getMissionShipment(data){
                data.forEach((item, index) =>{
                    item.labelId = index + 1;
                    // 注释默认选中'上报为工单出货数'
                    // if(item.missionShipment){
                    //     this.missionShipment = index + 1;
                    // }
                });
            },
            //表格行是否显示上报为工单出货数
            showMissionShipment(item){
                // 以下所有节点包括唯一码和扎号
                // 裁床型、总数型、数量明细型、尾部入库型、发货型、质检单件流节点、抽检型
                if(item.typeCode === 'actual-cutting' ||item.typeCode === 'actual-cutting-wym' ||item.typeCode === 'actual-cutting-ligation' ||
                    item.typeCode === 'totality' ||
                    item.typeCode === 'quantitative-detail' ||
                    item.typeCode === 'tail-in-store' ||
                    item.typeCode === 'tail-out-store' ||
                    item.typeCode === 'quality-checking' ||
                    item.typeCode === 'select-check' || item.typeCode === 'select-check-quantity'){
                    return true
                }else{
                    return false
                }
            },
            //给表格数据增加 '是否上报为工单出货数' 参数
            setMissionShipment(){
                // 用户有选值
                if(this.missionShipment){
                    this.addMissionInfo.process.nodemsg.forEach(item =>{
                        if(item.labelId === this.missionShipment){
                            item.missionShipment = true
                        }else{
                            item.missionShipment = false
                        }
                    });
                }
            },
            // 清空表格行以idFlag为"上游节点"的值   nodeList
            removeUpstreamNodeIdFlag(idFlag){
                let nodeDataList = this.addMissionInfo.process.nodemsg;
                nodeDataList.forEach(item => {
                    if(item.upstreamNodeIdFlag === idFlag) {
                        item.upstreamNodeIdFlag = ''
                    }
                })
            },
            // 获取上游节点下拉列表数据
            getUpstreamNodeList(){
                this.upstreamNode = [];
                let nodeDataList = this.addMissionInfo.process.nodemsg;
                nodeDataList.forEach(item => {
                    if(item.id){
                        let obj = {};
                        obj.name = item.name;
                        obj.idFlag = item.idFlag;
                        this.upstreamNode.push(obj);
                    }
                })
            },
            //生成uuid
            uuid() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                let uuid = s.join("");
                return uuid;
            },
            //表格行是否显示外发结算
            showOutsideBalance(item){
                // (裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流节点) && 未关联唯一码 && 未关联扎号 && 节点勾选了“外发”
                if((item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
                    || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking')
                    && item.associateWYM !== true && item.associateLigation !== true && item.associateOutside === true){
                    return true
                }else{
                    return false
                }
            },
            //表格行是否显示上游节点
            showUpstreamNode(item){
                // (裁床数量型、数量明细型、总数型、尾部入库型、发货型、质检单件流节点) && 未关联唯一码 && 未关联扎号
                if((item.typeCode === 'actual-cutting' || item.typeCode === 'quantitative-detail' || item.typeCode === 'totality'
                    || item.typeCode === 'tail-in-store' || item.typeCode === 'tail-out-store' || item.typeCode === 'quality-checking')
                    && item.associateWYM !== true && item.associateLigation !== true){
                    return true
                }else{
                    return false
                }
            },
            // 整单外发
            getOutSideChange(val) {
                if(val) {
                    this.addMissionInfo.process.nodemsg.forEach(i => {
                        this.$set(i, 'allowOutsideBalance',false)
                    })
                }
            },
            getRuleList() {
                ruleList({userId:JSON.parse(sessionStorage.getItem('user_login')).userId}).then(res => {
                    if(res.data.code === 0) {
                        const rule = res.data.data.find(v => v.modelType == 4)
                        if (rule) {
                            this.openRule = rule.openRule
                        }
                    }
                })
            },
             // 外发结算选择
            changeCheck(item,allowOutsideBalance) {
                if(this.addMissionInfo.outSideFlag){
                    this.addMissionInfo.process.nodemsg.forEach(i => {
                        this.$set(i, 'allowOutsideBalance',false)
                    })
                    this.$set(item,'allowOutsideBalance',allowOutsideBalance)
                }
            },
            // 码比数
            getSkuCodeShow() {
                this.totalsNum = this.$refs['nfskutable'].getToVal();
                this.skuCodeShow = true
            },
            // 设置码比数
            getCodeNumber(val) {
                this.$refs['nfskutable'].setCurrentSkuVal(val)
            },
            //判断跳转
            getOrderUrl(){
                var orderJumpData = JSON.parse(sessionStorage.getItem('orderJump'))
                this.getGoods();
                this.getOutsideFactoryList();
                this.getFacCustomerList();
                this.facPrdOrderId = orderJumpData.facPrdOrderId

                if(this.$route.query.goFrom){
                    this.addMissionInfo.deliveryAt = orderJumpData.deliveryAt.slice(0,10);
                    this.skuList= orderJumpData.skuList;


                    //是否按客户填数
                    if(orderJumpData.fillType==0){
                        this.skuListCount= orderJumpData.facPrdOrderGoodsDetailList;
                    }
                    var that= this;


                    //是否有点亮外发厂
                    if(orderJumpData.isOutsideFac==1){
                        this.addMissionInfo.outSideFlag= true;
                        this.addMissionInfo.outSideFactoryId= orderJumpData.commonOutsideFactoryId;
                        this.addMissionInfo.machiningUnitPrice= orderJumpData.processUnitPrice;
                    }else {
                        this.addMissionInfo.outSideFlag= false;
                    }
                    //sku表格
                    this.fetchSkuList(orderJumpData.goodsUnitId);

                }
            },

            //拖动
            datadragEnd(evt) {
                console.warn(this.addMissionInfo.process.nodemsg);
            },
            //新建客户时，更新当前选择客户
            updateName(name, id){
                this.customerValue = name;
                this.addMissionInfo.customerId = id;
            },
            // 货品操作
            handleGoods(type) {
                //清空货品输入内容
                // this.goodsValue = '';
                this.handleType = type;
                this.goodsDialog = true;
            },
            small(index, item) {
                if (item > 0) {
                    this.$set(this.addMissionInfo.process.nodemsg[index], 'differenceWarningMin',
                        -Number(this.addMissionInfo.process.nodemsg[index].differenceWarningMin));
                }
                console.warn(item);
            },
            big(index, item) {
                if (item < 0) {
                    this.$set(this.addMissionInfo.process.nodemsg[index], 'differenceWarningMax',
                        Math.abs(Number(this.addMissionInfo.process.nodemsg[index].differenceWarningMax)));
                }
                console.warn(item);
            },
            warning(index, item) {
                if (item < 0) {
                    this.$set(this.addMissionInfo.process.nodemsg[index], 'delayWarningNum',
                        Math.abs(Number(this.addMissionInfo.process.nodemsg[index].delayWarningNum)));
                }
            },
            /**隐藏侧拉新建客户 */
            hiddenAddCustomerDialog(val) {
                if (val == 1) {
                    this.getGds = 1;
                    this.getFacCustomerList();
                }
                this.customerDialog = false;
            },
            hiddenAddGoodsDialog(val, styleNo) {
                if (val == 1) {
                    this.getGds = 1;
                    this.getGoods(styleNo);
                }
                this.goodsDialog = false;
            },
            bomData(val) {
                this.addMissionInfo.facMissionBomDTO = val;
            },
            hiddenShow() {
                this.isShowNewNode = false;
            },
            addNodes() {
                this.hiddenShow();
                this.getNodeList();
            },
            //查看货品当前封面
            checkGoodsPic(row) {
                this.i = 0;
                this.picture = row.picture;
                this.centerDialogVisible = true;
                let params = {
                    "facId": JSON.parse(sessionStorage.getItem("last_login")).id,
                    "goodsId": row.goodsId
                };
                getFacGoodsPictureList(params).then(
                    res => {
                        this.imgLists = res.data.goodsPictureUrls;
                        this.picture = this.imgLists[this.i];
                    }
                )
            },
            showSelect(index) {
                this.show = index;
            },
            leftImg() {
                if (this.i == 0) {
                    return false;
                } else {
                    this.imgLists[this.i--];
                }
            },
            rightImg() {
                if (this.i >= this.imgLists.length - 1) {
                    return false;
                } else {
                    this.imgLists[this.i++];
                }
            },
            //nf-picker 接受值
            nodeBeTime(item, val) {
                item.beginAt = val;
            },
            nodeEnTime(item, val) {
                item.endAt = val;
            },
            getFileList(fileList) {
                this.addMissionInfo.processForm["attachments"] = fileList;
            },
            nodeNameRepeat(val) {
                if (val == "") {
                    this.nodeRepeat = false;
                }
            },
            addNewNode() {

                let params = {
                    token: "",
                    name: this.formLabelAlign.nodename,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    roleId: "",
                    targetId: this.formLabelAlign.id,
                    isClosed: false,
                    position: "",
                    defaultDoneRatio: "",
                    userId: this.userId
                };
                addTaskNode(params).then(res => {
                    if (res.data.code == 2) {
                        this.nodeRepeat = true;
                    } else {
                        this.visible.editVisible = false;
                        this.visible.createVisible = false;
                    }
                    this.getNodeList();
                });
            },
            getNodeType(index) {
                this.isShowNewNode = true;
                this.index_node = index;
            },
            NodeTypeValue(value) {
                if (value == "5a1a92ba06c94bc3a077129e4c919803") {
                    this.numberType = true;
                } else {
                    this.numberType = false;
                }
                this.formLabelAlign.id = value;
            },
            beginTime(val) {
                if (val) {
                    this.addMissionInfo.placeorderAt = val;
                } else {
                    this.addMissionInfo.placeorderAt = "";
                }
            },
            endTime(val) {
                this.addMissionInfo.deliveryAt = val;

                this.addMissionInfo.process.nodemsg = this.setNodeEndAt(
                    this.addMissionInfo.process.nodemsg,true
                );
            },
            nodeBeginTime(item, val) {
                item.beginAt = val;
            },
            nodeEndTime(item, val) {
                item.endAt = val;
            },
            getGoods(styleNo) {
                var _this = this;
                if (styleNo) {
                    this.goodsValue = styleNo;
                }
                if( _this.$route.query.goFrom&&!styleNo) {
                    this.goodsValue = ''
                }
                // 转工单 选中当前商品款号
                let orderJumpData = JSON.parse(sessionStorage.getItem('orderJump'))

                if( _this.$route.query.goFrom) {
                    this.goodsValue =orderJumpData.styleNo
                    let params = {
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        styleId: orderJumpData.styleId,
                        userId: this.userId,
                        modelName: 'FACTORY_MISSION',
                    };
                    selectFacGoodsStyleList(params).then(res => {
                        if (res.data.code == 0) {
                            this.info.goodsOptions = res.data.goods;
                            this.goods = res.data.goods;
                            _this.selecteGoods(this.goods[0])
                        }
                    });

                    return

                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.goodsValue,
                    userId: this.userId,
                    modelName: 'FACTORY_MISSION',
                };
                selectFacGoodsStyleList(params).then(res => {
                    if (res.data.code == 0) {
                        _this.info.goodsOptions = res.data.goods;
                        _this.goods = res.data.goods;

                        if (this.getGds == 1) {
                            //新建和编辑时，选中添加的货品
                            let goodsOpt = res.data.goods;
                            let selectVal = goodsOpt.find(function (item) {
                                return item.styleNo == styleNo;
                            });
                            if (selectVal) {
                                _this.selecteGoods(selectVal);
                            }
                            this.goodsValue = res.data.goods[0].styleNo;
                            this.editGoodsId = res.data.goods[0].goodsId;
                            this.editGoodsStyleId = res.data.goods[0].styleId;
                            this.addMissionInfo.styleId = res.data.goods[0].styleId;
                            let val = res.data.goods[0].goodsId + '-' + res.data.goods[0].styleId;
                            this.goodsChange(val);
                            this.getGds = 0;
                        }
                    }
                });
            },
            goodsChange(val) {
                var val = val.split("-");
                this.addMissionInfo.goodsId = val[0];
                var _this = this;
                _this.tableData3 = [];
                for (var i = 0; i < _this.goods.length; i++) {
                    if (_this.goods[i].styleId == val[1]) {
                        _this.fetchSkuList(_this.goods[i].goodsId);
                        _this.tableData3 = this.goods[i];
                    }
                }
            },
            // 获取skuList
            fetchSkuList(id) {
                getGoodSkuList({
                    goodsId: id
                }).then(res => {
                    this.skuList = res.data;

                });
            },
            getOnce(colorItem, tableVal, onceOptions) {
                /**
                 * 创建用户 dengshen
                 * 功能描述 新建货品工单时 , 新增一手功能 , 方便用户一次性填入相同的数据
                 */
                for (let key in this.skuVal) {
                    if (
                        onceOptions &&
                        key.includes(colorItem.id) &&
                        key.includes(onceOptions.id)
                    ) {
                        this.skuVal[key].num = onceOptions.target;
                    } else if (!onceOptions && key.includes(colorItem.id)) {
                        this.skuVal[key].num = colorItem.target;
                    }
                }
            },
            getSkuParams() {
                this.addMissionInfo.sku = [];
                const skus = this.$refs['nfskutable'].getSkuTableValue();
                Object.keys(skus).map(key => {
                    this.addMissionInfo.sku.push({
                        skuId: skus[key].skuId,
                        num: skus[key].num || 0
                    });
                });
            },
            countTotalNum() {
                const skus = this.$refs['nfskutable'].getSkuTableValue();
                this.addMissionInfo.total = Object.keys(skus).reduce((total, key) => {
                    total += Number(skus[key].num);
                    return total;
                }, 0);
            },
            // 获取客户列表
            fetchCustomerList() {
                var _this = this;
                var userLogin = JSON.parse(sessionStorage.getItem("user_login"));
                var lastLogin = JSON.parse(sessionStorage.getItem("last_login"));
                var params = {
                    userId:
                    this.userId,
                    token: "",
                    facIds: [lastLogin.id]
                };
                getWorkbayList(params).then(res => {
                    if (res.data.code == 0) {
                        _this.principalOptions = res.data.data; // 负责人
                    }
                });
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
            modelNull() {
                this.visible.showCancel = false;
                this.addMissionInfo.process.templateId = "";
            },
            successChangeTemplate() {
                this.visible.showCancel = false;
                if (!this.visible.showCancel) {
                    let params = {
                        templateId: this.addMissionInfo.process.templateId
                    };
                    templateInfo(params).then(res => {
                        this.value10 = [];
                        this.$nextTick(() => {
                            if(res.data.template.defaultAllOrderOutside){
                                this.$set(this.addMissionInfo, 'outSideFlag', res.data.template.defaultAllOrderOutside)
                            }
                        })
                        // this.addMissionInfo.outSideFlag = res.data.template.defaultAllOrderOutside
                        for (let i = 0; i < res.data.template.chargers.length; i++) {
                            this.value10.push(res.data.template.chargers[i].id);
                        }
                        this.addMissionInfo.process.leaderIds = this.value10;
                        this.addMissionInfo.process.nodemsg = this.setNodeEndAt(
                            res.data.template.nodes
                        );
                        this.getUpstreamNodeList();
                    });
                }
            },
            //切换模板后处理数据
            setNodeEndAt(nodeList,justSetTimeFlag) {
                console.warn(nodeList, 123);
                // this.addMissionInfo.machiningUnitPrice = ''
                // this.addMissionInfo.outSideFactoryId = ''
                for (let i = 0; i < nodeList.length; i++) {
                    if(!justSetTimeFlag){
                        if (nodeList[i].dlc != -1) {
                            this.$set(nodeList[i], 'wages', nodeList[i].dlc);
                        } else {
                            nodeList[i].wages = '';
                        }
                        nodeList[i].nodeId = nodeList[i].id;
                        nodeList[i].nodeUserIds = [];
                        if(nodeList[i].chargers && nodeList[i].chargers.length){
                            for (var j = 0; j < nodeList[i].chargers.length; j++) {
                                nodeList[i].nodeUserIds.push(nodeList[i].chargers[j].id);
                            }
                        }
                    }
                    if (this.addMissionInfo.deliveryAt) {
                        if (nodeList[i].dafd != null) {
                            var now = this.addMissionInfo.deliveryAt.split("-");
                            now = new Date(
                                Number(now["0"]),
                                Number(now["1"]) - 1,
                                Number(now["2"])
                            );
                            let planTime = now.setDate(now.getDate() - nodeList[i].dafd);
                            let Time = new Date(planTime);
                            let times = this.formatTime(Time);
                            nodeList[i].beginAt = "";
                            // nodeList[i].endAt = times;
                            this.$set(nodeList[i], 'endAt', times);
                            console.warn(nodeList[i].endAt);
                        } else {
                            nodeList[i].beginAt = "";
                            nodeList[i].endAt = "";
                        }
                    } else {
                        nodeList[i].beginAt = "";
                        nodeList[i].endAt = "";
                    }
                }
                return nodeList;
            },
            getTemplateId(item) {
                //获取工序模板默认负责人
                console.log(item);
                this.value10 = [];
                let arr = item.chargers;
                for(let i=0; i< arr.length; i++){
                    this.value10.push(arr[i].id);
                }
                this.successChangeTemplate();
            },
            formatTime(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1,
                    month = month < 10 ? "0" + month : month;
                var day = date.getDate(),
                    day = day < 10 ? "0" + day : day;
                return year + "-" + month + "-" + day;
            },
            //===========节点列表开始========
            //------修改节点接口---------
            //当前总负责人
            showSelects(val) {
                this.addMissionInfo.process.leaderIds = val;
            },
            //--------获取当前节点的列表-------
            getNodeList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getAllNodeList(params).then(res => {
                    this.nodeList = res.data.prcdNodes;
                    if (this.index_node != -1) {
                        this.$nextTick(
                            () => {
                                this.addMissionInfo.process.nodemsg[
                                    this.index_node
                                    ].id = this.nodeList[this.nodeList.length - 1].id;
                                this.addMissionInfo.process.nodemsg[
                                    this.index_node
                                    ].nodeUserIds = [];
                                this.addMissionInfo.process.nodemsg[
                                    this.index_node
                                    ].dlc = '';
                            }
                        )
                    }

                });
                let params1 = {
                    userId:
                    this.userId,
                    keyword: "",
                    token: "",
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                getPersonList(params1).then(res => {
                    this.functionary = res.data;
                });
            },
            //显示当前类型
            showNodeId(id, index, idFlag) {
                this.nodeId = id;
                this.addMissionInfo.process.nodemsg[index]['upstreamNodeId'] = ''
                for (let i = 0; i < this.nodeList.length; i++) {
                    if (this.nodeList[i].id == id) {
                        this.addMissionInfo.process.nodemsg[index].name = this.nodeList[i].name;
                        this.addMissionInfo.process.nodemsg[index].typeName = this.nodeList[i].typeName;
                        this.addMissionInfo.process.nodemsg[index].typeBomNeed = this.nodeList[i].typeBomNeed;
                        this.addMissionInfo.process.nodemsg[index].nodeId = this.nodeList[i].id;
                        this.$nextTick(() => {
                            this.$set(this.addMissionInfo.process.nodemsg[index], 'typeAilc', this.nodeList[i].typeAilc);
                            this.$set(this.addMissionInfo.process.nodemsg[index], "allowDifferenceWarning", this.nodeList[i].allowDifferenceWarning)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "associateInStore", this.nodeList[i].associateInStore)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "allowAssociateOutside", this.nodeList[i].allowAssociateOutside)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "typeCode", this.nodeList[i].typeCode)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "associateWYM", this.nodeList[i].associateWYM)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "associateLigation", this.nodeList[i].associateLigation)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "associateOutside", this.nodeList[i].associateOutside)
                            this.$set(this.addMissionInfo.process.nodemsg[index], "idFlag", this.uuid())
                            this.getUpstreamNodeList();
                        })
                    }
                    //如果当前节点已选了“上游节点”仍进行切换时，需要把表格中全部以此节点作为“上游节点”的值清空
                    this.removeUpstreamNodeIdFlag(idFlag);
                }
            },
            //删除当前列
            deleteNode(index, idFlag) {
                this.addMissionInfo.process.nodemsg.splice(index, 1);
                this.removeUpstreamNodeIdFlag(idFlag);
            },
            //添加节点
            addNode() {
                this.addMissionInfo.process.nodemsg.push({
                    nodeId: "",
                    typeName: "",
                    nodeUserIds: [],
                    beginAt: "",
                    endAt: "",
                    needDelayWarning: false,
                    needDifferenceWarning: false,
                    differenceWarningMin: "",
                    differenceWarningMax: "",
                    typeCode: '',
                    associateWYM: '',
                    associateLigation: '',
                    associateOutside:'',
                    idFlag:'',      // uuid
                    upstreamNodeIdFlag:'',      // 上游节点id
                    labelId: this.addMissionInfo.process.nodemsg.length + 1,
                });
            },
            getFacCustomerList() {

                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                getFacCustomerList(params).then(res => {

                    if(this.$route.query.goFrom&&JSON.parse(sessionStorage.getItem('orderJump')).fillType==1){
                        this.fillType = 'customer'
                        var ids=[];
                        var newIds=[];
                        JSON.parse(sessionStorage.getItem('orderJump')).facPrdOrderGoodsCustomerList.forEach(item=>{
                            ids.push(item.commonCustomerId)
                        });
                        res.data.forEach(item=>{
                            ids.forEach($item=>{
                                if($item===item.id){
                                    newIds.push(item)
                                }
                            })
                        })
                        this.customerList = newIds;
                    }else {
                        this.fillType = 'goods'
                        this.customerList = res.data;
                    }

                });
                let newDay = new Date();
                newDay = this.formatTime(newDay);
                this.addMissionInfo.placeorderAt = newDay;
            },
            customerIdGet(val) {
                this.addMissionInfo.customerId = val;
            },
            goodsIdGet(val) {
                this.addMissionInfo.goodsId = val;
            },
            //===========节点列表结束===========
            //点击完成的时候，完成新建工单
            handleAddMission() {
                this.backupStyleId = this.addMissionInfo.styleId
                if (this.errorWages) {
                    this.$message.error('工价最多只能输入三位小数')
                    return
                }
                if (!this.checkFormData()) return;
                // 使用新工艺单
                if (this.isNewSheet || this.isEditSheet) {
                    this.visible.dialogSheetVisible = true;
                    return;
                }
                // 没有工艺单
                if (this.isNullSheet) {
                    this.addMissionInfo.processForm = {};
                }
                // 没有送料节点时，不传bom
                if(!this.showBom) {
                    this.addMissionInfo.facMissionBomDTO = {}
                }
                if (this.isExistSheet) {
                    // 这句话不注释，会导致提示已存在工艺单，但是注释的话，会导致保存的时候bom表不见了
                    this.addMissionInfo.styleId = '';
                    this.addMissionInfo.processForm.content = this.$refs["ue"].getUEContent();
                }
                if (!this.checkUpload(this.imgList) || !this.checkUpload(this.fileList)) {
                    this.$confirm("文件未上传完整，是否取消上传?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "否",
                        type: "warning"
                    })
                        .then(() => {
                            this.addMission();
                        })
                        .catch(() => {
                        });
                }
                else {
                    this.addMission();
                }
            },
            addMission() {
                this.setMissionShipment();
                this.addMissionInfo.userId = this.$store.state.userInfo.id;
                this.getSkuParams();
                this.isAddLoading = true;
                if(this.$route.query.goFrom){
                    this.addMissionInfo.facPrdOrderId = JSON.parse(sessionStorage.getItem('orderJump')).facPrdOrderId
                }
                //有到料节点
                // if (this.showBom&&this.addMissionInfo.styleId){
                //     // this.updateMaterial = true
                //     return
                //
                // }
                addMission(this.addMissionInfo).then(res => {
                    this.addMissionSuccess(res.data);
                });
            },
            //更新物料
            // updateMaterialBtn(status,data){
            //     if(status==='sure'){
            //         if(data.updateMaterialRadio!=='noUpdateBom'){
            //             this.addMissionInfo.facMissionBomDTO.updateCommonBomId=data.updateMaterialRadio;
            //             this.addMissionInfo.facMissionBomDTO.saveAsCommonBomName=data.updateMaterialInput;
            //         }
            //
            //         this.addMissionInfo.userId=JSON.parse(sessionStorage.getItem("user_login")).userId;
            //     }
            //     addMission(this.addMissionInfo).then(res => {
            //         this.addMissionSuccess(res.data);
            //         this.updateMaterial = false
            //     });
            // },
            addMissionSuccess(res) {
                this.isAddLoading = false;
                if (res.code === 0) {
                    this.$message.success("新建成功");
                    this.visible["dialogSheetVisible"] = false;
                    this.delKeepAliveStatus();
                    return;
                }
                else {
                    this.addMissionInfo.styleId = this.backupStyleId
                    this.$message.error(res.msg);
                }
            },
            // 同步、不同步
            async handleSubmitWorkSheet(type) {
                const name = this.addMissionInfo.processForm.name;
                if (type === 'cancel' || (this.isEditSheet && type !== 'cancel')) {
                    // 新工艺单不同步、已存在工艺单有修改同步操作不需要传styleId;
                    this.addMissionInfo.styleId = "";
                }
                if (!type && (!name || name.length > 12)) {
                    // 同步操作工艺单名称校检
                    this.$message.error("请输入1到12个字符名称");
                    return;
                }
                this.addMissionInfo.processForm.content = this.$refs["ue"].getUEContent();
                const missionRes = await this.addMission();
                if (missionRes.code === 0) {
                    // 已存在工艺单有修改,同步需要调用修改接口
                    if ((this.isEditSheet && type !== 'cancel')) {
                        const updateRes = await this.updateCommonProcessForm({
                            ...this.addMissionInfo.processForm,
                            id: this.addMissionInfo.workingSheet
                        });
                        this.addMissionSuccess(updateRes.data);
                        return;
                    }
                }
                this.addMissionSuccess(missionRes);
            },
            // 工艺单选择控件变动
            handleWorkingSheetChange(val) {
                if (val === "new") {
                    this.visible["editorVisble"] = true;
                    this.addMissionInfo.processForm = {attachments: []};
                    this.$refs["ue"].setUEContent("");
                }
                else if (val) {
                    const contentItem = this.workingSheetOptions.find(
                        item => item.id === val
                    );
                    if (contentItem) {
                        this.$refs["ue"].setUEContent(contentItem.content || '');
                        this.addMissionInfo.processForm["content"] = contentItem.content || '';
                        this.addMissionInfo.processForm["attachments"] = [...contentItem.attachments];
                        this.addMissionInfo.processForm["name"] = contentItem.name;
                        this.visible["editorVisble"] = true;
                    }
                    !contentItem && this.$refs["ue"].setUEContent("");
                }
            },
            handleWagesBlur(item) {
                var pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;

                if (item.wages !== "" && !pattern.test(item.wages)) {
                    this.$message.error('工价最多只能输入三位小数');
                    this.errorWages = true;
                } else {
                    this.errorWages = false;
                }
            },
            handleMachiningUnitPriceBlur(machiningUnitPrice) {
                var pattern = /^([1-9]\d{0,11})(\.\d{1,2})?$|^0(\.\d{1,2})?$/;

                if (machiningUnitPrice !== "" && !pattern.test(machiningUnitPrice)) {
                    this.$message.error('加工单价最多只能输入两位小数');
                    this.errorMachiningUnitPrice = true;
                } else {
                    this.errorMachiningUnitPrice = false;
                }
            },
            checkUpload(fileArr) {
                if (!fileArr.length) return true;
                for (let item of fileArr) {
                    if (item.percent !== 100) {
                        return false;
                        break;
                    }
                }
                return true;
            },
            // 判断是否有填满必须填写的值
            checkFormData() {
                if (!this.addMissionInfo["deliveryAt"]) {
                    this.formVerification.endTime = true;
                    // this.showErrorTip("请选择交货日期！");
                } else {
                    this.formVerification.endTime = false;
                }
                if (!this.addMissionInfo["customerId"]) {
                    this.formVerification.customerName = true;
                    // this.showErrorTip("请选择客户！");
                    // return false;
                } else {
                    this.formVerification.customerName = false;
                }
                if (!this.addMissionInfo["goodsId"]) {
                    this.formVerification.goodsNo = true;
                    // this.showErrorTip("请选择货品！");
                    // return false;
                } else {
                    this.formVerification.goodsNo = false;
                }
                if (this.addMissionInfo.process.leaderIds.length <= 0) {
                    this.formVerification.leaderSelected = true;
                } else {
                    this.formVerification.leaderSelected = false;
                }
                for (let item in this.formVerification) {
                    console.warn(item, '===', this.formVerification[item]);
                    if (this.formVerification[item]) {
                        return false;
                    }
                }
                if (this.addMissionInfo["goodsId"]) {
                    if (!this.addMissionInfo.total) {
                        this.showErrorTip("货品订货数量不能为0！");
                        return false;
                    }
                }
                if (
                    +new Date(this.addMissionInfo["deliveryAt"]) <
                    +new Date(this.addMissionInfo["placeorderAt"])
                ) {
                    this.showErrorTip("交货日期不能小于下单日期！");
                    return false;
                }
                if (this.addMissionInfo.process.nodemsg.length == 0) {
                    this.$message.error('节点不能为空');
                    return false;
                }
                if (this.addMissionInfo.outSideFlag && !this.addMissionInfo.outSideFactoryId) {
                    this.$message.error('外发厂不能为空');
                    return false;
                }
                if (this.addMissionInfo.outSideFlag && !this.addMissionInfo.machiningUnitPrice) {
                    if(this.addMissionInfo.machiningUnitPrice!=0){
                        this.$message.error('加工单价不能为空');
                        return false;
                    }

                }
                let arrs = [];
                for (let item of this.addMissionInfo.process.nodemsg) {
                    if (item.nodeId == '') {
                        this.$message.error('节点不能为空');
                        return false;
                    }
                    arrs.push(item.typeName);
                    let nary = arrs.sort();
                    for (var i = 0; i < arrs.length; i++) {
                        if (nary[i] == nary[i + 1]) {
                            if (nary[i] == '裁床-数量型') {
                                this.$message.error('同一个工单中只能有一个裁床型节点！');
                                return;
                            }
                        }
                    }
                    if (item.endAt) {
                        if (
                            +new Date(this.addMissionInfo["deliveryAt"]) <
                            +new Date(item.endAt)
                        ) {
                            this.showErrorTip("节点结束日期不能大于工单交货日期");
                            return false;
                        }
                    }
                }

                // 判读BOM表是否填了必填信息
                if (this.showBom) {
                    if (this.addMissionInfo.facMissionBomDTO.commonMaterialsSkuList == undefined
                        || this.addMissionInfo.facMissionBomDTO.commonMaterialsSkuList == []) {
                        this.$message.error('未填写Bom表');
                        return;
                    }
                    var bomSkuList = this.addMissionInfo.facMissionBomDTO.commonMaterialsSkuList;
                    for (let i = 0; i < bomSkuList.length; i++) {
                        if (bomSkuList[i].lossRate == "") {
                            bomSkuList[i].lossRate == 0;
                        }
                        if (bomSkuList[i].lossRate < 0) {
                            this.$message.error('默认损耗率须大于等于0');
                            return false;
                        }
                        if (bomSkuList[i].styleColorIdList.length == 0) {
                            this.$message.error("请选择BOM表用于货品颜色");
                            return;
                        }
                        if (bomSkuList[i].styleSizeIdList.length == 0) {
                            this.$message.error("请选择BOM表用于货品尺码");
                            return;
                        }
                        if (bomSkuList[i].styleStandardIdList.length == 0) {
                            this.$message.error("请选择BOM表用于货品内长");
                            return;
                        }
                        if (!bomSkuList[i].singleDosage) {
                            this.$message.error("请填写单件用量");
                            return;
                        }
                    }
                }
                return true;
            },
            // 更新工艺单
            updateCommonProcessForm(params = {}) {
                let _params = {
                    userId: this.userId,
                    ...params
                };
                return updateCommonProcessForm(_params)
                    .then(res => {
                        return res;
                    });
            },
            showErrorTip(text) {
                this.$message.error(text);
            },
            hideDownGoods() {
                this.downCustomer = false;
            },
            //显示客户下拉
            selectCustomer() {
                this.downCustomer = !this.downCustomer;
                this.fetchCustomerList();
                if (this.downGoods == true) {
                    this.downGoods = false;
                }
            },
            //显示货品下拉
            selectGoods() {
                this.downGoods = !this.downGoods;
            },
            //点击隐藏下拉
            hideSelectCustomer() {
                this.downCustomer = false;
            },
            //点击隐藏货品
            hideSelectGood() {
                this.downGoods = false;
            },
            //选择客户
            selectedCustomer(item, index) {
                this.customerValue = item.name;
                this.addMissionInfo.customerId = item.id;
                //按客户填数
                if(this.$route.query.goFrom ){
                    var orderJumpData = JSON.parse(sessionStorage.getItem('orderJump'));
                    if(orderJumpData.fillType==1){
                        orderJumpData.facPrdOrderGoodsCustomerList.forEach($item=>{
                            if($item.commonCustomerId===item.id){
                                this.skuListCount = $item.facPrdOrderGoodsCustomerDetailList
                            }
                        })
                    }


                }

                this.downCustomer = true;
            },
            //搜索客户
            seachCustomer() {
                if (this.customerValue) {
                    this.downCustomer = true;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.customerValue
                };
                getEasyCustomerList(params).then(res => {
                    if(this.$route.query.fillType && this.$route.query.fillType==1){
                        var ids=[];
                        var newIds=[];
                        this.$route.query.facPrdOrderGoodsCustomerList.forEach(item=>{
                            ids.push(item.commonCustomerId)
                        });
                        res.data.forEach(item=>{
                            ids.forEach($item=>{
                                if($item===item.id){
                                    newIds.push(item)
                                }
                            })
                        })
                        this.customerList = newIds;
                    }else {
                        this.customerList = res.data.customerList;
                    }
                    // this.customerList = res.data.customerList;
                });
            },
            fetchCommonProcessForm(styleId) {
                // this.$refs["ue"].setUEContent('');
                getCommonProcessForm({styleId}).then(res => {
                    this.workingSheetOptions = res.data.data;
                    if (this.workingSheetOptions.length) {
                        this.addMissionInfo.workingSheet = this.workingSheetOptions[0].id;
                        this.addMissionInfo.processForm.attachments = [...this.workingSheetOptions[0].attachments];
                        this.attachments = [];
                        for (let item of this.addMissionInfo.processForm.attachments) {
                            this.attachments.push(item.id);
                        }
                        const content = this.workingSheetOptions[0].content;
                        if (content) {
                            this.$refs["ue"].setUEContent(content);
                            this.visible["editorVisble"] = true;
                        } else {
                            this.addMissionInfo["workingSheet"] = "new";
                        }
                    }
                });
            },
            //搜索更多货品款号
            seachGoodsInfo() {
                if (this.goodsValue) {
                    this.downGoods = true;
                }
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.goodsValue,
                    userId: this.userId,
                    modelName: 'FACTORY_MISSION',
                };
                selectFacGoodsStyleList(params).then(res => {
                    if (res.data.code == 0) {
                        this.info.goodsOptions = res.data.goods;
                        this.goods = res.data.goods;
                    }
                });
            },
            //选择货品
            selecteGoods(item, index) {
                //选择相同货品时return
                if(this.editGoodsStyleId === item.styleId && !this.$route.query.goFrom){
                    return;
                }
                this.pic_itemGoods = item;
                this.addMissionInfo.total = 0;
                this.addMissionInfo.sku = [];
                this.goodsValue = item.styleNo;
                this.addMissionInfo.goodsId = item.goodsId;
                this.editGoodsId = item.goodsId;
                this.editGoodsStyleId = item.styleId;
                var _this = this;
                _this.tableData3 = [];
                for (var i = 0; i < _this.goods.length; i++) {
                    if (_this.goods[i].styleId == item.styleId) {
                        const isHideLength = this.goods[i].lengths.length === 1 && this.goods[i].lengths[0].name === '无';
                        if (isHideLength) {
                            _this.goods[i].lengths = [];
                        }
                        this.goods[i].colors = this.mapColorName(this.goods[i].colors);
                        _this.tableData3 = this.goods[i];
                        _this.fetchSkuList(_this.goods[i].goodsId);
                    }
                }
                this.addMissionInfo.styleId = item.styleId;
                this.fetchCommonProcessForm(item.styleId);
            },
            // 拼接色名和色号，（表格）
            mapColorName(colorList = []) {
                return colorList.map(item => {
                    if (item.name) {
                        item.name = `${item.value}-${item.name}`
                    }
                    else {
                        item.name = item.value
                    }
                    return item
                })
            },
            //查看PDF
            checkPdf() {
                this.isLoading = true;
                let content = this.$refs.ue.getUEContent();
                let params = {
                    id: this.addMissionInfo.workingSheet,
                    name: this.addMissionInfo.processForm.name,
                    content: content,
                    userId: this.userId,
                    attachments: this.addMissionInfo.processForm.attachments
                };
                previewCommonProcessForm(params).then(res => {
                    if (res.data.code == 0) {
                        window.open(res.data.previewURL);
                    }
                    this.isLoading = false;
                });
            },

            // 工厂负责人
            getUnitUser() {
                getUnitUser({unitId: JSON.parse(sessionStorage.getItem('last_login')).id}).then(res => {
                    this.manList = res.data.data.facGroupDTOS
                })
            },

            getManId(arrId) {
                this.value10 = arrId;
                this.showSelects(arrId)
            },

            leaderNodeShow(index) {
                this.leaderNodeShowIndex = index
            },
            // 负责人下拉列表监听是否下拉
            selShowNode(val) {
                var that = this;
                var nodeEvent = $(".peoListLeadNode" + this.leaderNodeShowIndex);

                var $plamle = `<ul class="newSelUlNode"></ul>`;
                if (val && nodeEvent.find('.newSelUlNode').length == 0) {
                    nodeEvent.prepend($plamle);
                    if (this.manList && this.manList.length > 0) {
                        for (var i = 0; i < this.manList.length; i++) {
                            var li = document.createElement("li");
                            li.setAttribute('data-index', i);
                            li.innerHTML = this.manList[i].groupName;
                            $(".peoListLeadNode" + this.leaderNodeShowIndex + ' .newSelUlNode').append(li);
                        }
                    } else {
                        var li = document.createElement("li");
                        // li.setAttribute ( 'data-index' , i ) ;
                        li.innerHTML = '无搜索匹配';
                        $(".peoListLead>ul").append(li);
                    }
                }


                $(".peoListLeadNode" + this.leaderNodeShowIndex + ' .newSelUlNode')[0].addEventListener('click', function (ev) {
                    $(".peoListLeadNode" + that.leaderNodeShowIndex + ' .newSelUlNode>li').css({
                        background: '#fff'
                    })
                    if (ev.target.nodeName == 'LI') {
                        ev.target.style.background = 'rgb(228, 230, 241)';
                        that.listIndexNode = ev.target.getAttribute('data-index')
                    }

                }, true)
            },

            keyworkLeader(val) {
                // 远程搜索
                if (val != '') {
                    getUnitUser({
                        unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                        keyword: val
                    }).then(res => {
                        $(".peoListLeadNode" + this.leaderNodeShowIndex + ' .newSelUlNode').remove();
                        this.manList = [];
                        this.manList = JSON.parse(JSON.stringify(res.data.data.facGroupDTOS));
                        this.selShowNode(true);

                    })
                } else {
                    $(".peoListLeadNode" + this.leaderNodeShowIndex + ' .newSelUlNode').remove();
                    this.manList = [];
                    getUnitUser({unitId: JSON.parse(sessionStorage.getItem('last_login')).id}).then(res => {
                        this.manList = res.data.data.facGroupDTOS;
                        this.selShowNode(true);

                    })

                }

            },
            delKeepAliveStatus(type = 0) {
                // type 0表示保存成功，1表示取消按钮
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$store.dispatch('deleteVisitedLive', 'CreateOrder');
                if (type === 1) {
                    this.$router.go(-1);
                }
                else {
                    this.$router.push('/workorders');
                }
            },
            // 获取外发厂列表
             getOutsideFactoryList(){
                let params= {
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:this.userId
                }
                outsideFactoryListForSelect(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList=res.data.data
                    }
                })
            },
            // 新建外发厂成功
            addOutsideFactorySuccess(id){
                this.getOutsideFactoryList()
                this.addMissionInfo.outSideFactoryId = id

            }
        }
     };
</script>


<style lang="scss" scoped>
    @import '~scss_vars';

    .little-gap {
        display: inline-block;
        margin: 0 3px;
    }

    .input-bg {
        text-align: center;
        width: 48px;
        height: 32px;
        background: #dbe6f7;
        border-radius: 2px;
    }

    .checkGoodsPic {
        padding-left: 5px;
        padding-right: 32px;
        &:hover {
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .grey {
        color: #a2abb8;
    }

    #add_order {
        width: 100%;
        height: 100%;
        .order-title {
            margin-bottom: 0;
        }
    }

    .draggable {
        &:hover {
            color: #2c2c2c;
        }
    }

    .start {
        margin-right: 3px;
    }

    .create-order-info {
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
        margin-bottom: 16px;
        padding: 36px 32px 32px;
        .create-order-content {
            overflow: initial;
        }
        .info-list1,
        .info-list2 {
            display: flex;
            justify-content: flex-start;
        }
        .info-list1 {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 16px;
            .info-item {
                width: 30%;
                display: flex;
                align-items: center;
                margin-left: -15px;
                position: relative;
                .goods-edit {
                    display: inline-block;
                    padding-left: 5px;
                    padding-right: 32px;
                    cursor: pointer;
                }
                .el-input {
                    flex: 1;
                    display: flex;
                }
                .el-select {
                    display: flex;
                    flex: 1;
                }
                &__label {
                    display: inline-block;
                    width: 80px;
                    margin-right: 12px;
                    text-align: right;
                    vertical-align: middle;
                    color: #3b3b3b;
                    &.is-required {
                        &::before {
                            content: '*';
                            vertical-align: middle;
                            color: #fa3c3c;
                        }
                    }
                }
                &.preview-btn__wrap {
                    flex-direction: row-reverse;
                }
                .form-tips {
                    font-size: 12px;
                    position: absolute;
                    bottom: -14px;
                    left: 90px;
                    color: #FA4150;
                }
            }
            .info-remake {
                width: 65.4%;
                display: flex;
                align-items: center;
                margin-left: -15px;
                .el-input {
                    flex: 1;
                    display: flex;
                }
            }
        }
        .ue-editor {
            margin: 12px 0;
            padding-left: 78px;
        }
        .attachment-upload {
            margin-left: 78px;
        }
        .info-table {
            padding-left: 78px;
        }
        .info-list2 {
            margin-top: 16px;
            .el-input {
                width: 180px;
            }
            .info-list-inner {
                display: flex;
                align-items: center;
            }
        }
        .customerSel {
            width: 100%;
            border: 1px solid rgb(191, 200, 217);
            height: 34px;
            border-radius: 2px;
            display: inline-block;
            position: relative;
            &:hover {
                border: 1px solid $color-btn;
            }
            .customerSelect {
                position: absolute;
                left: 8px;
                top: 30%;
            }
            .customerS {
                color: rgb(148, 158, 186);
                position: absolute;
                left: 8px;
                top: 30%;
            }
            .colorFont {
                color: #2c2c2c;
                font-size: 14px;
                &::-webkit-input-placeholder {
                    color: rgb(148, 158, 186);
                }
            }

            .el-icon-caret-bottom {
                position: absolute;
                right: 8px;
                top: 11px;
                font-size: 12px;
                color: rgb(191, 200, 217);
                transition: all 0.5s;
            }
            .down {
                transform: rotate(180deg);
                transition: height 0.5s;
            }
            .customer_table {
                width: 100%;
                height: 0;
                overflow: auto;
                position: absolute;
                top: 38px;
                right: 0;
                z-index: 100;
                background-color: #fff;
                border-radius: 2px;
                transition: all 0.3s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                0 0 6px rgba(0, 0, 0, 0.04);
                .setCustomer {
                    cursor: pointer;
                    display: flex;
                    text-indent: 2em;
                    align-items: center;
                    height: 34px;
                    color: $color-btn;
                    border-bottom: 1px solid #fafafa;
                    font-weight: 400;
                    .el-icon-plus {
                        font-weight: 100;
                        font-size: 12px;
                        margin-right: 4px;
                    }
                }
                ul {
                    height: 220px;
                    li {
                        min-height: 34px;
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        line-height: 18px;
                        /*text-indent: 2em;*/
                        color: rgb(72, 82, 106);
                        transition: all 0s;
                        padding: 0 10px;
                        cursor: pointer;
                        &:hover {
                            background: rgb(228, 230, 241);
                        }
                    }
                }
            }
            .heightUl {
                height: 250px;
                transition: height 0.5s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                0 0 6px rgba(0, 0, 0, 0.04);
            }
        }
        .order-customer {
            border: 1px solid #FA4150;
        }
        .table1 {
            margin-top: 16px;
            padding-right: 32px;
        }
        .table123 {
            table, tr, th, td {
                margin: 12px;
                border: 1px solid #000;
            }
        }
        .supplier{
            margin-top: 12px;
            padding-left: 76px;
            .issupplier{
                color: #a2abb8;
            }
        }
    }

    .info-section {
        overflow: hidden;
        width: 100%;
    }

    .create-section {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 32px;
            .title {
                font-size: 18px;
                color: #2c2c2c;
            }
        }
        .create-main {
            padding: 32px;
            background: #ffffff;
            .main-title {
                font-size: 20px;
                border-left: 6px solid #ff9c38;
                text-indent: 12px;
            }
            .procedure-name {
                margin: 32px 0 10px;
            }
            .form-wrap {
                display: inline-block;
                position: relative;
                // margin-right: 57px;
                margin-right:25px;
                margin-bottom:22px;
                .form-tips {
                    position: absolute;
                    bottom: -14px;
                    left: 60px;
                    font-size: 12px;
                    color: #FA4150;
                }
            }
            .form-item {
                display: flex;
                align-items: center;
                .el-input {
                    width: 260px;
                }
            }
            .form-label {
                font-size: 14px;
                // padding-right: 10px;
                min-width:89px;
                color: #636363;
                &.is-require::before {
                    content: '*';
                    color: #ff0000;
                    margin-right: 4px;
                }
            }
        }
        .procedure-flow {
            width: 100%;
            .form-label {
                display: inline-block;
                margin-bottom: 16px;
            }
            .scroll-table {
                width: 100%;
                overflow-x: auto;
            }
        }

        .table {
            display: table;
            table-layout: fixed;
            width:100%;
            font-size: 14px;
            border: 1px solid #e6e8eb;
            border-bottom: none;
            .table-th,
            .table-tr {
                display: table-row;
            }
            .tbody {
                display: table;
                width: 100%;
            }
            .table-tr {
                .table-td {
                    border-right: 1px solid #e6e8eb;
                    &:last-child {
                        border-right: none;
                    }
                }
            }
            .table-th {
                color: #62758c;
                background: #f8f9fd;
                .table-td {
                    padding-left: 12px;
                }
            }
            .table-td {
                display: table-cell;
                height: 48px;
                vertical-align: middle;
                border-bottom: 1px solid #e6e8eb;
            }
            .table-input {
                width: 30px;
                padding: 0 8px;
                border-bottom: 1px solid #d2d4d7;
            }
            .wages {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px;
            }
            .handle {
                color: #929aa6;
                div {
                    display: inline-block;
                    cursor: pointer;
                    margin: 0 8px;
                }
                .el-icon-edit {
                    color: #1e96ff;
                    margin-right: 5px;
                }
                i.fa {
                    vertical-align: middle;
                    font-size: 18px;
                    margin-right: 6px;
                }
                .fa-pencil-square-o {
                    color: #1e96ff;
                }
                .fa-times {
                    color: #f03535;
                }
            }
        }
        .add {
            width: 99.8%;
            padding: 6px 0;
            text-indent: 16px;
            border: 1px solid #e6e8eb;
            border-top: none;
            .el-button--text {
                color: #ff9c38;
            }
        }
    }

    // 定义bom表的UI
    .bom-contain {
        margin: 32px 0;
        background-color: #fff;
        min-height: 480px;
        width: 100%;
        padding: 32px;
        box-sizing: border-box;
    }
</style>
<style lang="scss">
    @import '~scss_vars';
    .peoListLeadNode-down{
        margin-left: 200px;
        width: 200px;
        min-width: 200px !important;
        .el-select-dropdown__item{
            max-width: 200px;
        }
    }
    .newSelUlNode {
        position: absolute;
        top: 0px;
        left: -200px;
        z-index: 999;
        width: 100%;
        background: #fff;
        max-height: 258px;
        border: 1px solid rgb(209, 216, 229);
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        overflow-y: auto;
        /*padding: 10px 0;*/
        box-sizing: border-box;
        border-radius: 4px;
        /*滚动条样式*/
        &::-webkit-scrollbar { /*滚动条整体样式*/
            width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 4px;
            margin-right: 2px;
        }
        &::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
            border-radius: 4px;
            /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
            background: rgba(151, 168, 190, .26);
        }
        &::-webkit-scrollbar-track { /*滚动条里面轨道*/
            /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
            border-radius: 0;
            background: rgba(255, 255, 255, 1);
        }

        & li {
            line-height: 32px;
            padding-left: 10px;
            color: rgb(72, 82, 106);
            cursor: pointer;
        }
        & li:first-child {
            background: rgb(228, 230, 241);
        }
        /*.peoListLead {*/
        /*margin-left: 200px;*/

        /*}*/
    }

    #add_order .table .el-input__inner {
        border: none;
        border-radius: 0;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    #add_order .table .node_user .el-input__inner {
        border: none;
        border-radius: 0;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    .node_users {
        .el-select {
            display: flex;
            flex: 1;
            .el-select__tags {
                width: 100% !important;
                justify-content: flex-start;
            }
        }
        .el-input__inner {
            border: none;
        }
    }

    #add_order .table .node_user .el-tag--primary {
        border: none;
        color: #2c2c2c;
        font-size: 14px;
        .el-icon-close {
            color: #d7d7d7;
            &:hover {
                color: #ccc;
            }
        }
    }

    #add_order .search-man .el-input__inner {
        &::-webkit-input-placeholder {
            color: #636363;
        }
        &:focus {
            outline: 0;
            border-color: #ff9c38;
        }
    }

    #add_order .search-maned .el-input__inner {
        width: 490px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
        &:focus {
            outline: 0;
            border-color: #ff9c38;
        }
    }

    #add_order .el-input__icon + .el-input__inner {
        padding-right: 20px;
    }

    #add_order .search-man .el-tag--primary {
        background-color: #fff;
        border: none;
        color: #2c2c2c;
        .el-icon-close {
            color: #d7d7d7;
        }
    }

    #add_order .search-man .el-icon-close {
        &:hover {
            color: #d7d7d7;
        }
    }

    #add_order .info-list1 .el-date-editor.el-input {
        display: flex;
        flex: 1;
    }

    #add_order .table-td .el-date-editor.el-input {
        width: auto;
        display: flex;
    }

    .el-input__inner:focus {
        outline: 0;
        border-color: #ff9c38;
    }

    .dialog-title {
        padding-bottom: 24px;
        text-align: center;
        font-size: 18px;
        color: #626b7a;
        border-bottom: 1px solid #e6e8eb;
    }

    .dialog-form {
        padding: 48px 60px;
        border-radius: 2px;
        background-color: #f8f9fa;
        .el-input__inner {
            border-radius: 2px;
        }
        .el-select {
            width: 100%;
        }
        .text {
            line-height: 1;
            color: red;
            font-size: 12px;
        }
    }

    #add_order .el-form-item {
        &:last-child {
            margin-top: 48px;
        }
    }

    .submit {
        padding-top: 24px;
        margin-top: 24px;
        text-align: center;
        border-top: 1px solid #e6e8eb;
        button {
            width: 112px;
            height: 36px;
            font-size: 14px;
            background: none;
            border-radius: 2px;
            border: solid 1px #ff9c38;
        }
        .cancle-btn {
            color: #ff9c38;
        }
        .submit-btn {
            color: #ffffff;
            background: #ff9c38;
        }
    }

    .new_set {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 36px;
        color: #ff9c38;
        margin-top: -6px;
        cursor: pointer;
    }

    .color-title {
        display: flex;
        justify-content: center;
        color: #2c2c2c;
    }

    .color-set {
        display: flex;
        justify-content: center;
        font-size: 14px;
        margin-top: 16px;
        input {
            width: 260px;
            border: 1px solid #d5d5d5;
            height: 34px;
            border-radius: 2px;
            text-indent: 0.8em;
            font-size: 14px;
            &::-webkit-input-placeholder {
                color: #636363;
            }
        }
    }

    .sheet-set {
        display: block;
        text-align: center;
        p {
            margin-bottom: 12px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
        .cancel {
            margin-right: 16px;
        }
    }

    .error {
        text-align: center;
        &-title {
            margin-top: 32px;
            margin-bottom: 8px;
            font-size: 16px;
        }
        &-desc {
            color: #a2abb8;
        }
    }

    #add_order .form-item .el-input {
        width: 260px;
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
        background: $color-btn;
        font-size: 14px !important;
    }

    //图片预览
    .managements {
        .el-dialog {
            box-shadow: none;
        }
        .el-dialog--small {
            background-color: transparent;
            width: 100%;
            top: 5% !important;
        }
        .el-dialog__body {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .el-dialog__headerbtn .el-dialog__close {
            font-size: 24px;
            position: absolute;
            right: 60px;
            top: -18px;
            z-index: -1;
        }
        .imgs {
            height: 600px;
            display: flex;
            transition: all 1s;
            justify-content: center;
            align-items: center;
            user-select: none;
            width: 800px;
            img {
                max-width: 700px;
                max-height: 700px;
            }
        }
        .el-icon-arrow-left {
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
        .el-icon-arrow-right {
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
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

    .cover1 {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 100;
    }

    .detail-block {
        .group-name {
            padding: 12px 0 8px;
        }
    }

    .order-null {
        .el-input__inner {
            border: 1px solid red !important;
        }
    }

    .order-date {
        .el-input__inner {
            border: 1px solid red !important;
        }
    }

    .order-leader {
        .el-input__inner {
            border: 1px solid red !important;
        }
    }

    .btn-tab {
        position: relative;
        width: 16px;
        height: 16px;
        border: solid 1px #ffa914;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .btn-no-select {
        position: relative;
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid rgb(191, 200, 217);
    }
    #add_order .el-icon {
        /*position: absolute;*/
        border-bottom: 16px solid #fff;
        border-left: 16px solid #fff;
        height: 0;
        width: 0;
        bottom: 0;
        right: 0;
        border-radius: 4px;
        .el-icon-check {
            color: #fff;
            font-size: 12px;
            position: absolute;
            bottom: -16px;
            right: 1px;
            z-index: 1;
        }
    }

    .select-btn {
        border-radius: 4px;
        position: absolute;
        border-bottom: 16px solid $color-btn;
        border-left: 16px solid $color-btn;
        height: 0;
        width: 0;
        bottom: 0;
        right: 0;
    }
    .mission-shipment-radio{
        text-align: center;
        .el-radio__label{
            display: none;
        }
    }
</style>
