<template>
    <el-row id="add_order">
        <div class="nf-scroll-container">
            <page-title title="编辑工单">
                <div class="create-order-btns">
                    <nf-button @click="delKeepAliveStatus(1)">取消</nf-button>
                    <nf-button type="warning" :loading="isLoading" @click="handleChangeMission()">确认</nf-button>
                </div>
            </page-title>
            <div class="nf-scroll-view">
                <el-col :span="24" class="create-order-info">
                    <content-wrap title="工单信息" type="big">
                        <el-col :span="24" class="info-list1">
                            <div class="info-item">
                                <span class="info-item__label is-required">工单号</span>
                                <el-input v-model="addMissionInfo.orderNo" placeholder="请输入工单号"></el-input>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label is-required">制单日期</span>
                                <el-date-picker v-model="addMissionInfo.placeorderAt" @change="beginTime($event)"
                                                type="date" format="yyyy-MM-dd" placeholder="选择日期"
                                                :picker-options="pickerOptions0">
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
                                <span class="info-item__label is-required">交货日期</span>
                                <el-date-picker v-model="addMissionInfo.deliveryAt" @change="endTime($event)"
                                                type="date"
                                                format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerOptions0">
                                </el-date-picker>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label">客户款号</span>
                                <el-input v-model="addMissionInfo.customerSytleNo" placeholder="请输入款号"></el-input>
                            </div>
                            <div class="info-item">
                                <span class="info-item__label">客户订单号</span>
                                <el-input v-model="addMissionInfo.customerOrderNo" placeholder="请输入订单号"></el-input>
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
                    <content-wrap title="订货信息" type="big">
                        <el-col :span="24" class="info-list1">
                            <div class="info-item" style="box-sizing: border-box;">
                                <span class="info-item__label is-required">商品款号</span>
                                <el-select style="display:flex;flex:1;" v-model="value8" placeholder="请选择货品" disabled
                                           class="input_for_goods">
                                    <el-option v-for="(item, index) in info.goodsOptions" :key="item.styleId"
                                               :label="item.styleNo" :value="item.goodsId+'-'+item.styleId">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="info-item" v-clickoutside="hideSelectCustomer">
                                <span class="info-item__label is-required">客户</span>
                                <customer  single="single" v-model="addMissionInfo.customerId"></customer>
                                <!--<div class="customerSel" style="display:flex;flex:1;" @click="selectCustomer">-->
                                    <!--<div style="display:flex;flex:1;"-->
                                         <!--:class="{'customerSelect':customerValue,'customerS':!customerValue}">-->
                                        <!--<input class="colorFont" type="text" placeholder="请选择客户" v-model="customerValue"-->
                                               <!--@keyup="seachCustomer">-->
                                    <!--</div>-->
                                    <!--<i class="el-icon-caret-bottom" :class="{'down':downCustomer}"></i>-->
                                    <!--<div class="customer_table" :class="{'heightUl':downCustomer}">-->
                                        <!--<div class="setCustomer" @click="newCustomer"><i class="el-icon-plus"></i>新建-->
                                        <!--</div>-->
                                        <!--<ul>-->
                                            <!--<li v-for="(item,index) in customerList" :key="item.id"-->
                                                <!--@click="selectedCustomer(item,index)"><span>{{item.name}}</span></li>-->
                                        <!--</ul>-->
                                    <!--</div>-->
                                <!--</div>-->
                            </div>
                            <div class="info-item"></div>
                        </el-col>
                        <el-col :span="24" class="supplier">
                            <span class="label">供应商:</span>
                            <span :class="{'issupplier':addMissionInfo.supplierName==null}">{{ addMissionInfo.supplierName?addMissionInfo.supplierName:"无" }}</span>
                        </el-col>
                        <el-col :span="24" class="info-list1" style="display:flex;justify-content:flex-start;">
                            <span class="info-item handle-item">
                                <span class="goods-edit" @click="handleGoods('edit')"><icon
                                        type="icon-edit"></icon> 编辑货品</span>
                                <span style="font-size:14px;color:#636363;">订货数量总计：</span>
                                <span style="color:#ff9c38;font-size:16px;">{{ addMissionInfo.nums }}</span> 件
                                <nf-button
                                  style="margin-left:16px;font-size:12px;"
                                  type="success" @click="getSkuCodeShow" >按码比填数</nf-button>
                            </span>
                        </el-col>
                        <!--表格开始-->
                        <el-col class="info-table" :span="24" v-if="value8">
                            <service-table
                                    ref="reportTable"
                                    :tableData="tableData3"
                                    :skuVal="skuVal"
                                    @setReportOnce="setOnce"
                                    @setReportVal="setSkuVal"
                                    :isEdit="true">
                            </service-table>
                        </el-col>
                        <!-- 文件上传 -->
                        <el-col :span="24" class="info-list1">
                            <div class="info-item">
                                <span class="info-item__label">
                                    工艺单
                                </span>
                                <el-select
                                        class="info-item__select"
                                        @change="handleWorkingSheetChange"
                                        v-model="addMissionInfo.workingSheet" placeholder="未填写">
                                    <el-option
                                            :label="'使用新的工艺单'"
                                            :value="'new'">
                                    </el-option>
                                    <el-option
                                            v-for="(item, index) in workingSheetOptions"
                                            :key="index"
                                            :label="item.name || ' '"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div class="info-item"
                                 v-show="addMissionInfo.workingSheet !== 'new' && visible.editorVisble">
                                <el-checkbox v-model="isUpdataRadio">修改后更新货品工艺单</el-checkbox>
                            </div>
                            <div class="info-item preview-btn__wrap">
                                <nf-button @click="checkPdf" v-show="visible.editorVisble">
                                    <span v-if="!isLoading">预览工艺单</span>
                                    <span v-if="isLoading">正在读取文件...</span>
                                </nf-button>
                            </div>
                        </el-col>
                        <el-col :span="24" class="ue-editor" v-show="visible.editorVisble">
                            <ue :defaultMsg="defaultMsg" :config="config" :id="'ue1'" ref="ue"></ue>
                        </el-col>
                        <!-- 文件上传 -->
                        <attachment v-show="visible.editorVisble" class="attachment-upload" @attachD="getUploadFileList"
                                    :attachData="addMissionInfo.processForm.attachments"></attachment>
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
                                    <el-select v-model="templateId" disabled filterable placeholder="请选择">
                                        <el-option v-for="(item,index) in templateList"
                                                   :key="item.id"
                                                   :label="item.name"
                                                   :value="item.id"
                                                   @click.native="getTemplateId(item)">
                                            <div>{{item.name}}</div>
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                            <div class="form-wrap search-man">
                                <div class="form-item">
                                    <label class="form-label is-require">负责人</label>
                                    <template>
                                        <workerLeader
                                                v-if="manList.length"
                                                style="width: 240px;"
                                                :manListProps="manList"
                                                v-model="templateInfoLeaderIds"
                                                placeholder="请选择负责人">
                                        </workerLeader>
                                    </template>
                                </div>
                            </div>
                            <div class="form-wrap">
                                <div class="info-item">
                                    <span class="info-item__label">
                                       <el-checkbox v-model="addMissionInfo.outSideFlag">整单外发</el-checkbox>
                                    </span>
                                    <el-select
                                            v-if="addMissionInfo.outSideFlag"
                                            filterable
                                            clearable
                                            v-model="addMissionInfo.outSideFactoryId"
                                            placeholder="请选择外发工厂">
                                        <template>
                                            <el-option value="" disabled style="cursor:pointer;">
                                                <span style=" color: #ff9c38;" @click="addOutsideFactoryVisible = true">新建</span>
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
                                    <span class="form-label">
                                        加工单价
                                    </span>
                                    <el-input
                                            @blur="handleMachiningUnitPriceBlur(addMissionInfo.machiningUnitPrice)"
                                            type="number"
                                            v-model.trim="addMissionInfo.machiningUnitPrice"
                                            placeholder="元/件">
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <!-- 切换模板显示 -->
                        <!-- 展示显示 -->
                        <div class="procedure-flow" v-if="!showData">
                            <div class="scroll-table">
                                <div class="table jn-table">
                                    <div class="table-th">
                                        <div class="table-td" style="width:250px;">
                                            节点名称
                                        </div>
                                        <div class="table-td" style="width:240px;">
                                            负责人
                                        </div>
                                        <div class="table-td" style="width:190px;">
                                            工价
                                        </div>
                                        <div class="table-td" style="width:160px;">
                                            计划结束日期
                                        </div>
                                        <div class="table-td" style="width:180px;">
                                            预警提醒 (天)
                                        </div>
                                        <div class="table-td" style="width:170px;">
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
                                        <!--<div class="table-td" style="width: 160px;text-align: center">-->
                                            <!--操作-->
                                        <!--</div>-->
                                    </div>
                                </div>
                                <draggable v-model="showNodeData" :options="{handle:'.draggable'}">
                                    <transition-group class="table">
                                        <div class="table-tr node_users" v-for="(item, index) in showNodeData"
                                             :key="item.nodeId + item.id">
                                            <div class="table-td" style="width: 240px;padding-left:0">
                                                <template>
                                                    <el-select v-model="item.nodeId" :disabled="item.disabledFlag" filterable placeholder="请选择节点"
                                                               @change="showNodeIdE(item.nodeId, index, item.idFlag)">
                                                        <template>
                                                            <div @click="getNodeType(index)"
                                                                 style="width:100%;height:36px;color:#ff9c38;cursor:pointer;
                                                             display:flex;align-items:center;padding-left:10px;">
                                                                <i class="el-icon-plus"
                                                                   style="font-size:12px;padding-right:2px;"></i>
                                                                <span>新建</span>
                                                            </div>
                                                        </template>
                                                        <el-option
                                                                v-for="item in nodeList"
                                                                :key="item.id"
                                                                :label="item.name+'（'+item.typeName+'）'"
                                                                :value="item.id">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </div>
                                            <div class="table-td node_users node_usersUl"
                                                 style="width:240px;">
                                                <template>
                                                    <workerLeader
                                                            v-if="manList.length"
                                                            :manListProps="manList"
                                                            v-model="item.nodeLeaderIds"
                                                            placeholder="请选择负责人">
                                                    </workerLeader>
                                                </template>
                                            </div>
                                            <div class="table-td" style="width:190px;">
                                                <span v-if="item.labourCost==-1">———————</span>
                                                <el-tooltip v-if="item.labourCost!==-1" content="请输入正确的工价(示例：29.888)"
                                                            placement="top">
                                                    <input
                                                            @input="handleWagesChange(item)"
                                                            @blur="handleWagesBlur(item)"
                                                            type="number"
                                                            style="width: 80px"
                                                            v-model="item.wages"/>
                                                </el-tooltip>
                                                <span v-if="item.labourCost!==-1">元／件</span>
                                            </div>
                                            <div class="table-td" style="width:180px;">
                                                <el-date-picker v-model="item.endAt" @change="nodeEndTime(item,$event)"
                                                                type="date" format="yyyy-MM-dd" :label="item.endAt"
                                                                :value="item.endAt" placeholder="选择日期">
                                                </el-date-picker>
                                            </div>
                                            <div class="table-td" style="width:180px;padding-left:12px;">
                                                <div @click="item.needDelayWarning=!item.needDelayWarning"
                                                     class="btn-tab" :class="{'btn-no-select':!item.needDelayWarning}">
                                                    <div class="el-icon" :class="{'select-btn':item.needDelayWarning}">
                                                        <i class="el-icon-check"></i>
                                                    </div>
                                                </div>
                                                <span class="little-gap" v-show="item.needDelayWarning">结束前</span>
                                                <input @input="warning(index,item.delayWarningNum)"
                                                       v-model="item.delayWarningNum" v-show="item.needDelayWarning"
                                                       type="number" class="input-bg little-gap">
                                                <span v-show="item.needDelayWarning">天</span>
                                            </div>
                                            <div class="table-td" style="width:180px;padding-left:12px;">
                                                <div v-show="item.id&&item.allowDifferenceWarning">
                                                    <div v-if="item.isAllowDifferenceWarning!=false">
                                                        <div @click="item.needDifferenceWarning=!item.needDifferenceWarning"
                                                             class="btn-tab"
                                                             :class="{'btn-no-select':!item.needDifferenceWarning}">
                                                            <div class="el-icon"
                                                                 :class="{'select-btn':item.needDifferenceWarning}">
                                                                <i class="el-icon-check"></i>
                                                            </div>
                                                        </div>
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
                                                    <span v-else>-</span>
                                                </div>
                                            </div>
                                            <!-- 外发结算 -->
                                            <div class="table-td" style="width:100px;padding-left:12px;box-sizing:border-box;">
                                                <div v-if="showOutsideBalance(item)">
                                                    <div>
                                                        <el-checkbox v-model="item.outsideBalance" @change="changeCheck(item,item.outsideBalance)"></el-checkbox>
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
                                                    <el-select
                                                            v-if="showUpstreamNode(item)"
                                                            :disabled="item.disabledFlag"
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
                                            <!--<div class="table-td" style="width: 140px;text-align: center">-->
                                                <!--<div class="handle">-->
                                                    <!--<div class="draggable">-->
                                                        <!--<i class="fa fa-bars"></i>拖动-->
                                                    <!--</div>-->
                                                    <!--<div @click="deleteNodeEdit(index,item)">-->
                                                        <!--<i class="fa fa-times"></i>删除-->
                                                    <!--</div>-->
                                                <!--</div>-->
                                            <!--</div>-->
                                        </div>
                                    </transition-group>
                                </draggable>
                            </div>
                            <div class="add">
                                <el-button type="text" @click="addNodeEdit()">+添加节点</el-button>
                            </div>
                        </div>
                        <nf-button class="cancel-mission" type="warningsimple" @click="visible.cancel=true">撤销工单</nf-button>
                    </div>
                    <!--工单BOM表-->
                    <section class="bom-contain" v-if="showBom">
                        <bom-table
                            from="editMissionOrder"
                            v-if="showBom"
                            :showBom ='ifBom'
                            :editor="true"
                            source="editOrder"
                            :styleId="this.$route.query.styleId"
                            :orderId="this.addMissionInfo.id"
                            @bomData="bomData">
                        </bom-table>
                    </section>
                </section>
            </div>
        </div>
        <el-dialog :visible.sync="visible.showCancel" size="tiny" :show-close="false">
            <span style="font-size:20px;">&emsp;&emsp;&emsp;是否切换模板</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modelNull">取 消</el-button>
                <el-button type="primary" @click="successChangeTemplate">确 定</el-button>
            </span>
        </el-dialog>
        <div :class="{'customer_dialog':show_add_customer,'customer_dialog_nochange':!show_add_customer}">
            <div :class="{'customer_show_out':add_customer,'customer_show':!add_customer}">
                <div class="customer_header">
                    <div class="customer_header_left">
                        <span>添加客户</span>
                    </div>
                    <div class="customer_header_right">
                        <div class="customer_header_right_btn_cancel" @click="cancelCustomerAdd">
                            <span>取消</span>
                        </div>
                        <div class="customer_header_right_btn_success" @click="addCustomerSuccess">
                            <span>确认</span>
                        </div>
                    </div>
                </div>
                <div class="container_customer">
                    <div class="container_customer_header">
                        <i class="line"></i>
                        <span class="customer_title">基本信息</span>
                    </div>
                    <div class="container_customer_info">
                        <div class="first_info">
                            <div class="first_info_left">
                                <span class="must">*</span>
                                <span>客户姓名</span>
                                <input type="text" placeholder="请输入姓名" v-model="customerName">
                            </div>
                            <div class="first_info_right">
                                <span class="phone">手机号码</span>
                                <input type="text" placeholder="请输入手机号码" v-model="custoemrPhone">
                            </div>
                        </div>
                        <div class="second_info">
                      <span class="customer_address">
                        客户地址
                      </span>
                            <span>
                          <el-cascader placeholder="请选择地区" :options="options" v-model="selectedOptions"
                                       @change="handleChange"></el-cascader>
                      </span>
                        </div>
                        <div class="third_info">
                            <input type="text" placeholder="请输入详细的地址信息，如街道名称，门牌号码等" v-model="customerAddress">
                        </div>
                        <div class="fourth_info">
                            <span class="remark">备注信息</span>
                            <textarea :maxlength="200" v-model="custoemrRemark"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
                            <el-option v-for="(item, index) in options" :key="item.id" :label="item.name"
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
                <nf-button @click="visible.createVisible = false">取消</nf-button>
                <nf-button type="warning" @click="addNewNode()">确定</nf-button>
            </div>
        </el-dialog>
        <el-dialog
                :show-close="false"
                :visible.sync="visible.deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否要删除该节点？</p>
                    <p>删除节点后不可恢复，该节点的上报数据、警报、节点动态都将被清除。</P>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="handleDelete">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="visible.cancel" size="tiny" :show-close="false">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定撤销当前工单？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="modelNull">取 消</nf-button>
                    <nf-button type="warning" @click="cancelOrder">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="visible.dialogSheetVisible" size="tiny" width="30%">
            <h3 class="color-title">
                是否将刚新建的工艺单同步保存到“{{ goodsValue }}"的工艺信息里？
            </h3>
            <div class="color-set sheet-set">
                <p style="margin:16px 0;" class="grey">如需同步保存，请输入工艺单名称：</p>
                <div>
                    <el-input type="text" v-model="addMissionInfo.processForm.name" placeholder="请输入工艺单名称"/>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="handleSubmitWorkSheet('cancel')">不同步</nf-button>
                <nf-button type="warning" @click="handleSubmitWorkSheet('')">同步</nf-button>
            </span>
        </el-dialog>
        <node-dialog @hiddenShow="hiddenShow" @addNode="addNodes" :isShow="isShowNewNode"></node-dialog>
        <transition name="right-move">
            <goods-dialog
                v-if="goodsDialog"
                modelName="FACTORY_MISSION"
                :handleType="handleType"
                :goodsId="editGoodsId"
                :styleId="editGoodsStyleId"
                @hidden="hiddenAddGoodsDialog"
                @update="getFacMission">
            </goods-dialog>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="goodsDialog" @click="hiddenAddGoodsDialog">
            </div>
        </transition>
        <!--新建外发厂-->
        <transition name="right-move">
            <add-outside-factory v-if="addOutsideFactoryVisible" type="add" @hiddenWindow="addOutsideFactoryVisible=false" @hideCover="addOutsideFactoryVisible=false"
                                 @addSuccess="addOutsideFactorySuccess"></add-outside-factory>
        </transition>
        <transition name="opcity">
            <div style="z-index: 2004" class="cover" v-if="addOutsideFactoryVisible" @click="addOutsideFactoryVisible=false">
            </div>
        </transition>
        <!--物料更新-->
        <!--<materialAndGoodsBomUpdate  @updateMaterialBtn="updateMaterialBtn" :easyBomList="bomList" :updateMaterial="updateMaterial" :alterPurchaseDemand="addMissionInfo.alterPurchaseDemand"></materialAndGoodsBomUpdate>-->
        <!-- 码比数 -->
        <sku-code-ratio :metadatas="skuList" :isShow.sync="skuCodeShow" :skuVal="skuVal" @getCodeNumber="getCodeNumber"></sku-code-ratio>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import draggable from "vuedraggable";
    import nodeDialog from '../templateManage/children/newNodeDialog.vue'
    import {dropdowndData} from "../../config/city.js";
    import {looseEqual} from "../../utils/format";
    import {
        selectFacGoodsStyle,
        getGoodSkuList,
        getWorkbayList,
        getFacMission,
        getEasyTemplateList,
        addTaskNode,
        getDicReportTypeList,
        addTemplate,
        queryTaskNodeList,
        checkTemplateName,
        getTemplate,
        updateTemplate,
        addMission,
        getFacCustomerList,
        cancelMission,
        getFacMissionNodeInfoListById,
        updateMission,
        addFacCustomer,
        getEasyCustomerList,
        getPersonList,
        getEasyTaskNodeList,
        getUploadToken,
        getCommonProcessForm,
        previewCommonProcessForm,
        deleteCheckTaskInstanceWorkflow,
        editMissionNodeInfo,
        getNodeTemplateList,
        getAllNodeList,
        getUnitUser,
        outsideFactoryListForSelect,
        easyBomList,
    } from "@/api";
    import ServiceTable from "../service/serviceTable";
    import Ue from '../ue/ue'
    import Attachment from "../goods/child/attachEdit"
    import md5 from "js-md5";
    import mixins from "./orderDetail/mixin";
    import GoodsDialog from './createChild/goods-dialog.vue';
    import addOutsideFactory from '@/components/outsideFactory/add.vue'
    import skuCodeRatio from '@/components/Common/sku-table/sku-code-ratio.vue'


    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import bomTable from './createChild/bomTable'

    export default {
        name: 'EditOrder',
        data() {
            return {
                // updateMaterial: false,
                templateInfoLeaderIds:[],
                bomList:[],
                showBom: false,//BOM表显示与隐藏
                isShowNewNode: false,
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 450,
                    zIndex: 99
                },
                backupSkuVal: {},//备份sku
                isLoading: false,
                info: {
                    goodsOptions: [] //货品下拉列表,
                },
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
                imgList: [],
                fileList: [],
                imgData: {},
                fileData: {},
                upLoadUrl: this.$globalConfig.qiniu.upUrl,
                customerList: [],
                principalOptions: [],
                value: "",
                isTable: false,
                goods: [],
                tableData3: [],
                skuVal: {},
                copySkuVal: {},
                //拖动模块
                nodeList: [],
                //模板负责人
                value10: [],
                goodsValue: "",
                functionary: [],
                templateList: [],
                addMissionInfo: {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    missionId: this.$route.query.missionId,
                    orderNo: "",
                    placeorderAt: "",
                    deliveryAt: "",
                    customerOrderNo: "",
                    customerSytleNo: "",
                    remark: "",
                    customerId: "",
                    goodsId: "",
                    styleId: "",
                    nums: "",
                    priority: "",
                    isModifySKU: "0",
                    process: {
                        templateId: "",
                        instanceId: "",
                        leaderIds: [],
                        nodemsg: []
                    },
                    workingSheet: '',
                    processForm: {
                        id: '',
                        name: '',
                        content: '',
                        attachments: []
                    },
                    orderdetail: [],
                    // 外发工厂表单相关变量
                    outSideFlag:false, // 是否外发
                    outSideFactoryId:'', //外发工厂id
                    machiningUnitPrice:'' ,//加工单价,
                    alterPurchaseDemand:false, //是否修改采购需求
                    supplierName:'',//供应商名字
                },
                //工单bom 数据备份，用于保存工单的时候，跟addMissionInfo.facMissionBomDTO对比，看看有没有改动，
                // 有改动的话给出提示，询问物料需求已发生变更，是否同步更新MRP的计划采购与物料需求？
                backupFacMissionBomDTO:[],

                isUpdataRadio: false,
                workingSheetOptions: [],
                value8: "",
                templateInfo: [],
                showData: false,
                showNodeData: [
                    {
                        id: "",
                        name: "",
                        typeName: "",
                        typeBomNeed: "",
                        allowDifferenceWarning: "",
                        labourCost: "",
                        typeCode: "",
                        associateWYM: "",
                        associateLigation: "",
                        associateOutside: "",
                        idFlag: "",
                        upstreamNodeIdFlag:'',
                        labelId: 1,
                        outsideBalance: false,
                    }
                ],
                templateIds: "",
                templateId: "",
                defineId: "",
                downCustomer: false,
                show_add_customer: false,
                add_customer: false,
                show_add_goods: false,
                add_goods: false,
                //=======添加客户部分========
                selectedOptions: [],
                provinceName: "",
                cityName: "",
                areaName: "",
                customerName: "",
                customerAddress: "",
                custoemrRemark: "",
                custoemrPhone: "",
                customerValue: "",
                //新建节点
                options: [],
                visible: {
                    createVisible: false,
                    editVisible: false,
                    deleVisible: false,
                    cancel: false,
                    showCancel: false,
                    editorVisble: false,
                    dialogSheetVisible: false
                },
                deleteNodeIndex: "",
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
                deleteNodeId: '',
                userId: '',
                manList: [],
                leaderNodeShowIndex: 0,
                listIndexNode: 0,
                goodsDialog: false,     //编辑货品弹窗
                handleType: '',      //货品操作类型：新建/编辑
                editGoodsId: '',      //编辑操作要用的goodsId
                editGoodsStyleId: '',  //编辑操作要用的styleId
                ifBom:false,
                // 外发工厂列表
                outsideFactoryList:[],
                // 是否显示新建外发厂弹层
                addOutsideFactoryVisible:false,
                // 输入的加工单价是否错误
                errorMachiningUnitPrice:false,
                skuCodeShow: false, // 码比数
                upstreamNode: [],   //上游节点列表
                deleteNodeIdFlag: '',   //删除行的id标识
                outSideFlagCopy: '',    //是否整单外发标识备份
                outSideFactoryIdCopy: '',   //整单外发厂备份
                machiningUnitPriceCopy: '', //整单外发加工单价备份
                missionShipment: '',    //上报为工单出货数 单选值
                titleMsg: '设置某个节点后，在工单完成后将该节点上报的完成数视为工单出货数。若不选择，创建时系统自动取最后一个节点为上报出货数节点。',
            };
        },
        mixins: [mixins],
        watch: {
            'showNodeData': {
                // 监听添加的节点中有没有到料型节点，有的话显示bom表
                handler(val, oldVal) {
                    for (let i = 0; i < val.length; i++) {
                        if (val[i].typeBomNeed || val[i].typeCode === 'material') {
                            this.showBom = true;
                            return;
                        } else {
                            this.showBom = false;
                        }
                    }
                    this.getUpstreamNodeList();
                },
                // 深度观察
                deep: true
            },
            skuVal: {
                handler(val) {
                    //更新总数
                    this.addMissionInfo.nums = this.countTotalNum();
                },
                deep: true
            },
            tableData3(val) {
                this.addMissionInfo.isModifySKU = "1";
            },
            // "templateInfo.leaderIds":{
            //     handler(val) {
            //         // if (val.length > 0) {
            //         this.templateInfoLeaderIds = val
            //         this.addMissionInfo.process.leaderIds = val
            //
            //     },
            //     deep:true
            // },
            templateInfoLeaderIds(val){

                    // this.templateInfoLeaderIds = val
                    this.addMissionInfo.process.leaderIds = val
            },
        },
        components: {
            ServiceTable,
            draggable,
            Ue,
            Attachment,
            nodeDialog,
            bomTable,   //BOM表组件
            GoodsDialog,    // 新增/编辑货品组件
            addOutsideFactory, //新建外发厂组件
            skuCodeRatio, //码比数
        },
        methods: {
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
                    this.showNodeData.forEach(item =>{
                        if(item.labelId === this.missionShipment){
                            item.missionShipment = true
                        }else{
                            item.missionShipment = false
                        }
                    });
                }
            },
            //检查整单外发、整单外发厂、整单外发工价是否有改动,有改动返回true,无改动返回false
            checkOutsideMsgChange(){
                if((this.addMissionInfo.outSideFlag !== this.outSideFlagCopy) ||
                    (this.addMissionInfo.outSideFactoryId !== this.outSideFactoryIdCopy) ||
                    (this.addMissionInfo.machiningUnitPrice !== this.machiningUnitPriceCopy)){
                    return true
                }else{
                    return false
                }
            },
            //检查节点列表是否包含外发节点
            checkNodeListHasOutsideFlag(){
                let _outsideFlag = false;
                this.showNodeData.forEach(item => {
                    if(item.associateOutside){
                        _outsideFlag = true;
                    }
                });
                return _outsideFlag;
            },
            // 清空表格行以idFlag为"上游节点"的值   nodeList
            removeUpstreamNodeIdFlag(idFlag){
                this.showNodeData.forEach(item => {
                    if(item.upstreamNodeIdFlag === idFlag) {
                        item.upstreamNodeIdFlag = ''
                    }
                })
            },
            // 获取上游节点下拉列表数据
            getUpstreamNodeList(){
                this.upstreamNode = [];
                this.showNodeData.forEach((item,index) => {
                    if(item.nodeId){
                        let obj = {};
                        obj.name = item.name ? item.name : item.nodeName;
                        obj.idFlag = item.idFlag;
                        this.upstreamNode.push(obj);
                    }
                    item.labelId = index + 1;
                    if(item.missionShipment){
                        this.missionShipment = index + 1;
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
            // 外发结算选择
            changeCheck(item,outsideBalance) {
                if(this.addMissionInfo.outSideFlag){
                    this.showNodeData.forEach(i => {
                        this.$set(i, 'outsideBalance',false)
                    });
                    this.$set(item,'outsideBalance',outsideBalance)
                }
            },
            // 码比数
            getSkuCodeShow() {
                this.skuCodeShow = true
            },
            // 设置码比数
            getCodeNumber(val) {
                console.log(val, '777')
                for (let valKey in val) {
                    for (let key in this.skuVal) {
                        if (valKey == key) {
                            this.skuVal[key].num = val[valKey].num
                        }
                    }
                }
            },
            //展开编辑货品组件
            handleGoods(type) {
                this.handleType = type;
                this.goodsDialog = true;
            },
            //关闭编辑货品组件
            hiddenAddGoodsDialog() {
                this.goodsDialog = false;
            },
            // BOM表接收
            bomData(val) {
                this.addMissionInfo.facMissionBomDTO = val;
                // 页面进来后，第一次初始化bom数据的时候，备份到backupFacMissionBomDTO
                if(!this.backupFacMissionBomDTO.length){
                    this.backupFacMissionBomDTO = JSON.stringify(val)
                }
            },
            small(index, item) {
                if (item > 0) {
                    this.$set(this.showNodeData[index], 'differenceWarningMin',
                        -Number(this.showNodeData[index].differenceWarningMin));
                }
                console.warn(item);
            },
            big(index, item) {
                if (item < 0) {
                    this.$set(this.showNodeData[index], 'differenceWarningMax',
                        Math.abs(Number(this.showNodeData[index].differenceWarningMax)));
                }
                console.warn(item);
            },
            warning(index, item) {
                if (item < 0) {
                    this.$set(this.showNodeData[index], 'delayWarningNum',
                        Math.abs(Number(this.showNodeData[index].delayWarningNum)));
                }
            },
            hiddenShow() {
                this.isShowNewNode = false;
            },
            addNodes() {
                this.hiddenShow();
                this.getNodeList();
            },
            getUploadFileList(fileList) {
                this.addMissionInfo.processForm['attachments'] = fileList;
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
            //获取可选的节点类型
            getNodeType(index) {
                this.index_node = index;
                this.isShowNewNode = true;
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
                this.addMissionInfo.placeorderAt = val;
            },
            endTime(val) {
                this.addMissionInfo.deliveryAt = val;
                this.addMissionInfo.process.nodemsg = this.setNodeEndAt(this.addMissionInfo.process.nodemsg);
            },
            nodeBeginTime(item, val) {
                item.beginAt = val;
            },
            nodeEndTime(item, val) {
                item.endAt = val;
            },
            pickerOptions0() {
            },
            goodsGet() {
                var userInfo = JSON.parse(sessionStorage.getItem("last_login"));
                var params = {
                    facId: userInfo.id,
                    keyword: "",
                    pageNo: 1,
                    token: ""
                };
                selectFacGoodsStyle(params).then(res => {
                    if (res.data.code == 0) {
                        this.goods = res.data.goods;
                    }
                });
            },
            //一手
            setOnce(colorItem, tableVal, onceOptions) {
                /**
                 * @description
                 * 一手输入功能
                 */
                for (let key in this.skuVal) {
                    if (onceOptions && key.includes(colorItem.id) && key.includes(onceOptions.id)) {
                        this.skuVal[key].num = onceOptions.target;
                    }
                    else if (!onceOptions && key.includes(colorItem.id)) {
                        this.skuVal[key].num = colorItem.target;
                    }

                }
                //判断是否修改过
                if (looseEqual(this.copySkuVal, this.skuVal)) {
                    this.addMissionInfo.isModifySKU = "0";
                } else {
                    this.addMissionInfo.isModifySKU = "1";
                }
            },
            countTotalNum() {
                let num = 0;
                for (let key in this.skuVal) {
                    num += Number(this.skuVal[key].num);
                }
                return num;
            },
            // 获取客户列表
            fetchCustomerList() {
                var _this = this;
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
                this.addMissionInfo.process.templateId = "";
                this.visible.showCancel = false;
                this.visible.cancel = false;
            },
            successChangeTemplate() {
                this.visible.showCancel = false;
                if (!this.visible.showCancel) {
                    if (this.templateIds == this.defineId) {
                        this.showData = false;
                        this.addMissionInfo.process.templateId = this.defineId;
                    } else {
                        this.showData = true;
                        this.defineId = this.templateIds;
                        this.addMissionInfo.process.templateId = this.defineId;
                    }
                    let params = {
                        token: "",
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        templateId: this.addMissionInfo.process.templateId
                    };
                    //console.log(params, "切换的参数");
                    getTemplate(params).then(res => {
                        console.log(res, "模板");
                        this.value10 = [];
                        for (let i = 0; i < res.data.data.leaders.length; i++) {
                            this.value10.push(res.data.data.leaders[i].id);
                        }
                        this.addMissionInfo.process.leaderIds = this.value10;
                        for (var i = 0; i < res.data.data.nodes.length; i++) {
                            res.data.data.nodes[i].nodeUserIds = [];
                            for (var j = 0; j < res.data.data.nodes[i].leaders.length; j++) {
                                res.data.data.nodes[i].nodeUserIds.push(
                                    res.data.data.nodes[i].leaders[j].id
                                );
                            }
                            for (var j = 0; j < res.data.data.nodes[i].leaders.length; j++) {
                                res.data.data.nodes[i].nodeUserIds.push(
                                    res.data.data.nodes[i].leaders[j].id
                                );
                            }
                            const nodeList = res.data.data.nodes;
                            if (this.addMissionInfo.deliveryAt) {
                                if (nodeList[i].planDay != '') {
                                    var now = this.addMissionInfo.deliveryAt.split("-");
                                    now = new Date(
                                        Number(now["0"]),
                                        Number(now["1"]) - 1,
                                        Number(now["2"])
                                    );
                                    let planTime = now.setDate(now.getDate() - nodeList[i].planDay);
                                    let Time = new Date(planTime);
                                    let times = this.formatTime(Time);
                                    nodeList[i].beginAt = "";
                                    nodeList[i].endAt = times;
                                } else {
                                    nodeList[i].beginAt = "";
                                    nodeList[i].endAt = "";
                                }
                            } else {
                                nodeList[i].beginAt = "";
                                nodeList[i].endAt = "";
                            }
                            res.data.data.nodes[i].workflowId = "";
                        }
                        this.addMissionInfo.process.nodemsg = this.setNodeEndAt(res.data.data.nodes);
                        this.getUpstreamNodeList();
                    });
                }
            },
            formatTime(date) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1,
                    month = month < 10 ? "0" + month : month;
                var day = date.getDate(),
                    day = day < 10 ? "0" + day : day;
                return year + "-" + month + "-" + day;
            },
            setNodeEndAt(nodeList) {
                for (var i = 0; i < nodeList.length; i++) {
                    nodeList[i].nodeUserIds = [];
                    for (var j = 0; j < nodeList[i].leaders.length; j++) {
                        nodeList[i].nodeUserIds.push(nodeList[i].leaders[j].id);
                    }
                    for (var j = 0; j < nodeList[i].leaders.length; j++) {
                        nodeList[i].nodeUserIds.push(nodeList[i].leaders[j].id);
                    }

                    if (this.addMissionInfo.deliveryAt) {
                        if (nodeList[i].planDay != '') {
                            var now = this.addMissionInfo.deliveryAt.split("-");
                            now = new Date(
                                Number(now["0"]),
                                Number(now["1"]) - 1,
                                Number(now["2"])
                            );
                            let planTime = now.setDate(now.getDate() - nodeList[i].planDay);
                            let Time = new Date(planTime);
                            let times = this.formatTime(Time);
                            nodeList[i].beginAt = "";
                            nodeList[i].endAt = times;
                        } else {
                            nodeList[i].beginAt = "";
                            nodeList[i].endAt = "";
                        }
                    } else {
                        nodeList[i].beginAt = "";
                        nodeList[i].endAt = "";
                    }
                    nodeList[i].workflowId = "";
                }
                return nodeList;
            },
            //根据id修改模板
            getTemplateId(val) {
                this.visible.showCancel = true;
                this.templateIds = val.id;
            },
            //===========节点列表开始===========
            //------修改节点接口---------
            getManId(val) {
                this.templateInfo.leaderIds = val;
                this.addMissionInfo.process.leaderIds = val;
            },
            //当前总负责人
            showSelect(val) {
                //console.log(val, "dffas;ddd");
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
                        if (this.showData) {
                            this.addMissionInfo.process.nodemsg[
                                this.index_node
                                ].id = this.nodeList[this.nodeList.length - 1].id;
                        } else {
                            this.showNodeData[this.index_node].nodeId = this.nodeList[
                            this.nodeList.length - 1
                                ].id;
                            this.showNodeData[
                                this.index_node
                                ].nodeLeaderIds = [];
                            this.showNodeData[
                                this.index_node
                                ].wages = '';
                        }
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
            showNodeId(id, index) {
                this.nodeId = id;
                for (let i = 0; i < this.nodeList.length; i++) {
                    if (this.nodeList[i].id == id) {
                        this.addMissionInfo.process.nodemsg[index].typeName = this.nodeList[
                            i
                            ].typeName;
                    } else {
                    }
                }
                //console.log(this.addMissionInfo.process.nodemsg);
            },
            //显示当前类型
            showNodeIdE(id, index, idFlag) {
                this.nodeId = id;
                for (let i = 0; i < this.nodeList.length; i++) {
                    if (this.nodeList[i].id == id) {
                        this.showNodeData[index].name = this.nodeList[i].name;
                        this.showNodeData[index].typeName = this.nodeList[i].typeName;
                        this.showNodeData[index].typeBomNeed = this.nodeList[i].typeBomNeed;
                        this.$set(this.showNodeData[index], "allowDifferenceWarning",
                            this.nodeList[i].allowDifferenceWarning)
                        this.$nextTick(() => {
                            if (!this.nodeList[i].typeAilc) {
                                this.$set(this.showNodeData[index], 'labourCost', -1);
                            } else {
                                this.$set(this.showNodeData[index], 'labourCost', 1);
                            }
                            this.$set(this.showNodeData[index], "typeCode", this.nodeList[i].typeCode)
                            this.$set(this.showNodeData[index], "associateWYM", this.nodeList[i].associateWYM)
                            this.$set(this.showNodeData[index], "associateLigation", this.nodeList[i].associateLigation)
                            this.$set(this.showNodeData[index], "associateOutside", this.nodeList[i].associateOutside)
                            this.$set(this.showNodeData[index], "idFlag", this.uuid())
                            this.getUpstreamNodeList();
                        })
                        //如果当前节点已选了“上游节点”仍进行切换时，需要把表格中全部以此节点作为“上游节点”的值清空
                        this.removeUpstreamNodeIdFlag(idFlag);
                    }
                }
            },
            //删除当前列
            deleteNode(index) {
                this.addMissionInfo.process.nodemsg.splice(index, 1);
            },
            handleDelete() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:
                    this.userId,
                    instanceWorkflowId: this.deleteNodeId,
                }
                deleteCheckTaskInstanceWorkflow(params).then(
                    res => {
                        console.log(res);
                        if (res.data.status == 0) {
                            this.showNodeData.splice(this.deleteNodeIndex, 1);
                            this.removeUpstreamNodeIdFlag(this.deleteNodeIdFlag);
                            this.$message.success("删除成功");
                            this.visible["deleVisible"] = false;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            },
            deleteNodeEdit(index, item) {
                this.deleteNodeId = item.instanceWorkflowId;
                this.visible["deleVisible"] = true;
                this.deleteNodeIndex = index;
                this.deleteNodeIdFlag = item.idFlag;
            },
            //添加节点
            // addNode() {
            //     this.addMissionInfo.process.nodemsg.push({
            //         nodeId: "",
            //         typeName: "",
            //         targetType: '',
            //         nodeUserIds: [],
            //         beginAt: "",
            //         endAt: "",
            //         needDelayWarning: false,
            //         needDifferenceWarning: false,
            //         differenceWarningMin: "",
            //         differenceWarningMax: ""
            //     });
            //     //console.log(this.addMissionInfo.process.nodemsg);
            // },
            addNodeEdit() {
                this.showNodeData.push({
                    id:'',
                    nodeId: "",
                    typeName: "",
                    targetType: '',
                    nodeLeaderIds: [],
                    beginAt: "",
                    endAt: "",
                    workflowId: "",
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
                //console.log(this.addMissionInfo.process.nodemsg);
            },
            //获取工厂客户列表
            getFacCustomerList() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: ""
                };
                getFacCustomerList(params).then(res => {
                    this.customerList = res.data;
                });
            },
            goodsIdGet(val) {
                this.addMissionInfo.goodsId = val;
            },
            //===========节点列表结束===========
            //撤销工单
            cancelOrder() {
                let params = {
                    userId:
                    this.userId,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    missionId: this.$route.query.missionId
                };
                cancelMission(params).then(res => {
                    if(res.data.code === 0){
                        this.visible.cancel = false;
                        this.$router.push("workorders");
                        this.$message.success(res.data.msg);
                    }else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //获取当前工单信息
            getFacMission() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    missionId: this.$route.query.missionId
                };
                getFacMission(params).then(async res => {
                    // console.log(res,'获取工单详情')
                    const skuList = await this.fetchGoodSku(res.data.goodsId);
                    const mixinData = this.regroupTaleData(skuList); // mixins方法
                    this.skuList = skuList;
                    this.tableData3 = mixinData;
                    const isHideLength = mixinData.lengths.length > 0 ? false : true;
                    const skuVal = {};
                    for (let skuItem of skuList) {
                        const id = `${skuItem.color_id}-${skuItem.size_id}${(!isHideLength && skuItem.standard_id)
                            ? "-" + skuItem.standard_id
                            : ""}`;
                        skuVal[id] = {
                            colorId: skuItem.color_id,
                            skuId: skuItem.id,
                            num: 0
                        };
                        this.copySkuVal[id] = {
                            num: 0
                        };
                        for (let nodeItem of res.data.missionDetailsList) {
                            if (nodeItem.skuId === skuItem.id) {
                                const id = `${skuItem.color_id}-${skuItem.size_id}${!isHideLength && skuItem.standard_id
                                    ? "-" + skuItem.standard_id
                                    : ""}`;
                                skuVal[id] = {
                                    colorId: skuItem.color_id,
                                    detailId: nodeItem.id,
                                    skuId: nodeItem.skuId,
                                    num: nodeItem.num
                                };
                                this.copySkuVal[id] = {
                                    num: nodeItem.num
                                };
                            }
                        }
                    }
                    this.skuVal = skuVal;
                    const fileObj = this.getFileList(res.data.missionAttachment);
                    this.imgList = fileObj.imgList;
                    this.fileList = fileObj.fileList;
                    this.changeInfo = res.data;
                    this.setMissionInfo(res);
                    if (res.data.styleName !== '未填写' && res.data.styleName) {
                        res.data.styleName = '-' + res.data.styleName
                    }
                    this.info.goodsOptions = [{
                        goodsId: res.data.goodsId,
                        styleId: res.data.styleId,
                        styleNo: res.data.styleNo + res.data.styleName
                    }];
                    this.value8 = res.data.goodsId + "-" + res.data.styleId;
                    this.editGoodsId = res.data.goodsId;
                    this.editGoodsStyleId = res.data.styleId;
                    //获取bom列表
                    let params = {
                        styleId: res.data.styleId,
                        userId: this.$store.state.userInfo.id,
                    };
                    easyBomList(params).then(res => {
                        this.bomList = res.data.commonBomList;
                    });
                });
            },
            setMissionInfo(res) {
                console.log(res,'设置vvv')

                this.addMissionInfo.id = res.data.id;//编辑保存工单ID获取新建保存BOM表的数据
                this.addMissionInfo.nums = res.data.nums;
                this.addMissionInfo.orderNo = res.data.orderNo;
                this.addMissionInfo.placeorderAt = res.data.placeorderAt;
                this.addMissionInfo.deliveryAt = res.data.deliveryAt;
                this.addMissionInfo.customerId = res.data.customerId;
                this.customerValue = res.data.custName;
                this.addMissionInfo.priority = res.data.priority;
                this.addMissionInfo.customerOrderNo = res.data.customerOrderNo;
                this.addMissionInfo.customerSytleNo = res.data.customerSytleNo;
                this.addMissionInfo.goodsId = res.data.goodsId;
                this.addMissionInfo.remark = res.data.remark;
                this.addMissionInfo.styleId = res.data.styleId;
                this.$route.query.styleId = res.data.styleId;
                this.addMissionInfo.processForm = res.data['processForm'];
                this.fetchCommonProcessForm(res.data.styleId);
                // 设置整单外发相关变量
                this.addMissionInfo.outSideFlag = res.data.outSideFlag
                this.addMissionInfo.outSideFactoryId = res.data.outSideFactoryId
                this.addMissionInfo.machiningUnitPrice = res.data.machiningUnitPrice
                //备份整单外发数据
                this.outSideFlagCopy = res.data.outSideFlag;
                this.outSideFactoryIdCopy = res.data.outSideFactoryId;
                this.machiningUnitPriceCopy = res.data.machiningUnitPrice;
                this.addMissionInfo.supplierName = res.data.supplierName;
                },

            // 获取工艺单列表
            fetchCommonProcessForm(styleId) {
                getCommonProcessForm({styleId})
                    .then(res => {
                        this.workingSheetOptions = res.data.data;
                        if (!this.addMissionInfo['processForm'].id) {
                            this.visible['editorVisble'] = false;
                            return
                        }
                        if (!this.addMissionInfo['processForm'].commonProcessFormId) {
                            this.visible['editorVisble'] = true;
                            this.$refs['ue'].setUEContent(this.addMissionInfo['processForm'].content);
                            this.workingSheetOptions.push({
                                styleId: this.addMissionInfo.styleId,
                                ...this.addMissionInfo['processForm'],
                            });
                            this.addMissionInfo.workingSheet = this.addMissionInfo['processForm'].id;
                            return
                        }
                        const item = this.workingSheetOptions.find(item => item.name === this.addMissionInfo['processForm'].name);
                        this.$refs['ue'].setUEContent(this.addMissionInfo['processForm'].content);
                        this.addMissionInfo.workingSheet = this.addMissionInfo['processForm'].commonProcessFormId;
                        if (item && !this.addMissionInfo.workingSheet) {
                            this.addMissionInfo.workingSheet = item.id;

                        }
                        this.visible['editorVisble'] = true;
                    })
            },
            handleWorkingSheetChange(val) {
                if (val === 'new') {
                    this.visible['editorVisble'] = true;
                    this.addMissionInfo.processForm = {attachments: []};
                    this.$refs['ue'].setUEContent('');
                }
                else {
                    const contentItem = this.workingSheetOptions.find(item => item.id === val);
                    if (contentItem) {
                        this.$refs['ue'].setUEContent(contentItem.content);
                        this.visible['editorVisble'] = true;
                        this.addMissionInfo.processForm = contentItem;
                    }
                    !contentItem && this.$refs['ue'].setUEContent(this.addMissionInfo.processForm.content || '');
                }
            },
            handleSubmitWorkSheet(type) {
                // 不同步不传styleId
                const name = this.addMissionInfo.processForm.name;
                if (type) this.addMissionInfo.styleId = '';
                if (!type && (!name || name.length > 12)) {
                    this.$message.error('请输入1到12个字符名称');
                    return;
                }
                console.log(this.addMissionInfo.styleId)
                this.changeMission();
                this.$nextTick(() => {
                    this.visible['dialogSheetVisible'] = false;
                })
            },
            handleWagesChange(item) {
                // const reg = /^\d+(\.\d{1,3})?/g;
                // item.wages = item.wages && reg.exec(item.wages)[0];
                var pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;

                if (!pattern.test(item.wages)) {
                    this.$message.error('请输入正确的工价，如29.888');
                    return
                }
            },
            handleWagesBlur(item) {

            },
            getFileList(_fileList) {
                const imgList = [];
                const fileList = [];
                for (let item of _fileList) {
                    const splitArr = item.filePath.split("/");
                    item.url = item.filePath;
                    item.percent = 100;
                    item.path = splitArr[splitArr.length - 1];
                    if (item.type === 0) {
                        imgList.push(item);
                    } else {
                        fileList.push(item);
                    }
                }
                return {
                    imgList,
                    fileList
                };
            },
            fetchGoodSku(goodsId) {
                const params = {
                    goodsId: goodsId
                };
                return getGoodSkuList(params).then(res => {
                    console.log(res.data, 'skulist');
                    return res.data;
                });
            },
            //获取节点模板的信息
            async getFacMissionNodeInfoListById() {
                let params = {
                    missionId: this.$route.query.missionId,
                };
                await editMissionNodeInfo(params).then(res => {
                    this.templateInfoLeaderIds = [];
                    this.value10 = [];
                    this.addMissionInfo.process.leaders = [];
                    for (let i = 0; i < res.data.chargers.length; i++) {
                        this.templateInfoLeaderIds.push(res.data.chargers[i].id);
                        this.value10.push(res.data.chargers[i].id);
                        this.addMissionInfo.process.leaders.push(res.data.chargers[i].id);
                    }
                    this.addMissionInfo.process.instanceId = res.data.templateId;
                    const templateId = res.data.templateId;
                    this.templateId = templateId;
                    this.defineId = templateId;
                    this.addMissionInfo.process.templateId = this.defineId;
                    this.showNodeData = res.data.nodes;
                    let nodes = JSON.parse(JSON.stringify(res.data.nodes));
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].typeBomNeed || nodes[i].typeName.indexOf("送料型") >-1  || nodes[i].typeName === "到料型") {
                            this.ifBom = true;
                            break;
                        } else {
                            this.ifBom = false;
                        }
                    }
                    for (let k = 0; k < res.data.nodes.length; k++) {
                        this.$set(res.data.nodes[k], 'nodeLeaderIds', []);
                    }
                    for (let j = 0; j < this.showNodeData.length; j++) {
                        this.$nextTick(() => {
                            this.showNodeData[j].beginAt = this.showNodeData[j].dateStart;
                            this.showNodeData[j].endAt = this.showNodeData[j].dateEnd;
                            this.showNodeData[j].wages = this.showNodeData[j].labourCost;

                            //默认工序模板加一个标识，不允许修改（只有新增加的节点才可以修改）
                            this.showNodeData[j].disabledFlag = true;
                        })
                        for (let k = 0; k < this.showNodeData[j].chargers.length; k++) {
                            this.showNodeData[j].nodeLeaderIds.push(this.showNodeData[j].chargers[k].id);
                        }
                    }
                    this.getUpstreamNodeList();
                });
            },
            changeMission() {
                this.isLoading = true;
                if (!this.showData) {
                    this.setMissionShipment();
                    this.addMissionInfo.process.nodemsg = this.showNodeData;
                    for (let i = 0; i < this.addMissionInfo.process.nodemsg.length; i++) {
                        for (let item in this.addMissionInfo.process.nodemsg[i]) {
                            if (item == "nodeLeaderIds") {
                                this.addMissionInfo.process.nodemsg[i][
                                    "nodeUserIds"
                                    ] = this.addMissionInfo.process.nodemsg[i][item];
                                this.addMissionInfo.process.nodemsg[i].nodeUserIds;
                            }
                            if (item == "instanceWorkflowId") {
                                this.addMissionInfo.process.nodemsg[i][
                                    "workflowId"
                                    ] = this.addMissionInfo.process.nodemsg[i][item];
                                this.addMissionInfo.process.nodemsg[i].workflowId;
                            }
                        }
                    }
                } else {
                }
                const arr = [];
                for (let i = 0; i < this.addMissionInfo.process.nodemsg.length; i++) {
                    if (this.addMissionInfo.process.nodemsg[i].nodeId) {
                        arr.push(this.addMissionInfo.process.nodemsg[i]);
                    }
                }
                console.log(arr);
                if (this.addMissionInfo.outSideFlag && !this.addMissionInfo.outSideFactoryId) {
                    this.$message.error('外发厂不能为空');
                    return false;
                }
                if (!arr.length) {
                    this.showErrorTip("请设置工序节点!");
                    return;
                }
                this.addMissionInfo.process.nodemsg = arr;
                const missionAttachment = [
                    ...this.getImgListParams(this.imgList),
                    ...this.getImgListParams(this.fileList)
                ];


                /**
                 * @description
                 * 提交的sku数据重组
                 */
                // 避免单号重复，重新多传
                this.addMissionInfo.orderdetail = []
                for (var o in this.skuVal) {
                    let obj = {}
                    obj.num = this.skuVal[o].num || 0;
                    obj.skuId = this.skuVal[o].skuId;
                    obj.detailId = this.skuVal[o].detailId;
                    this.addMissionInfo.orderdetail.push(obj);
                }
                this.addMissionInfo.total = this.addMissionInfo.nums;
                const params = {...this.addMissionInfo, missionAttachment};
                console.log(params);
                // return;
                updateMission(params).then(res => {
                    this.isLoading = false;
                    // this.updateMaterial = false
                    if (res.data.code === 0) {
                        this.$message.success("编辑成功！");
                        this.delKeepAliveStatus(1);
                        return;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 检查bom表的数据是否有改动过，有的话提示是否同步更新MRP的计划采购与物料需求？
            // checkBomChange(){
                //bom表数据有改动
                // this.updateMaterial = true
                // if(JSON.stringify(this.addMissionInfo.facMissionBomDTO)!==this.backupFacMissionBomDTO){
                //     this.$confirm("物料需求已发生变更，是否同步更新MRP的计划采购与物料需求？", {
                //         confirmButtonText: "是",
                //         cancelButtonText: "否",
                //         type: "warning"
                //     })
                //     .then(() => {
                //         this.addMissionInfo.alterPurchaseDemand = true
                //         this.changeMission();
                //     })
                //     .catch(() => {
                //         this.addMissionInfo.alterPurchaseDemand = false
                //         this.changeMission();
                //     });
                // } else {
                //     this.changeMission();
                // }
            // },
            //更新物料
            // updateMaterialBtn(status,data){
            //     if(status==='sure'){
            //         this.addMissionInfo.alterPurchaseDemand=this.bomData.alterPurchaseDemand?data.updateMaterialChecked:false;
            //         if(data.updateMaterialRadio!=='noUpdateBom') {
            //             this.addMissionInfo.facMissionBomDTO.updateCommonBomId = data.updateMaterialRadio;
            //             this.addMissionInfo.facMissionBomDTO.saveAsCommonBomName = data.updateMaterialInput;
            //         }
            //     }
            //
            //     this.changeMission();
            //
            // },
            //点击完成的时候，完成新建工单
            handleChangeMission() {
                if (!this.checkFormData()) return;
                if (!this.checkUpload(this.imgList) || !this.checkUpload(this.fileList)) {
                    this.$confirm("如果此时点“继续”，未完成上传的附件将丢失，是否继续？", "您有附件正在上传中！", {
                        confirmButtonText: "继续",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            if (!this.checkIsNewSheet()) return;
                            // 设置是否修改采购需求并发起修改工单请求
                            this.changeMission();
                            // this.checkBomChange()
                        })
                        .catch(() => {
                        });
                } else {
                    if (!this.checkIsNewSheet()) return;
                    this.changeMission();
                    // 设置是否修改采购需求并发起修改工单请求
                    // this.checkBomChange()
                }
            },
            checkIsNewSheet() {
                this.addMissionInfo.processForm['content'] = this.$refs['ue'].getUEContent();
                const newSheet = (this.addMissionInfo['workingSheet'] === 'new' &&
                    this.addMissionInfo.processForm['content']) ||
                    //  this.addMissionInfo.processForm["attachments"].length ||
                    (!this.addMissionInfo.processForm['name'] && this.isUpdataRadio);
                if (newSheet) {
                    this.visible.dialogSheetVisible = true;
                    return false;
                }
                this.addMissionInfo.processForm = this.addMissionInfo.processForm;
                // if(this.isUpdataRadio || newSheet){
                this.addMissionInfo.styleId = (this.isUpdataRadio || newSheet) ? this.addMissionInfo.styleId : '';
                // }
                return true;
            },
            checkFormData() {
                if (!this.addMissionInfo.orderNo) {
                    this.showErrorTip("请输入工单号！");
                    return false;
                }
                if (!this.addMissionInfo.deliveryAt) {
                    this.showErrorTip("请选择交货日期！");
                    return false;
                }
                if (
                    +new Date(this.addMissionInfo["deliveryAt"]) <
                    +new Date(this.addMissionInfo["placeorderAt"])
                ) {
                    this.showErrorTip("交货日期不能小于下单日期！");
                    return false;
                }
                if (!this.addMissionInfo.customerId) {
                    this.showErrorTip("请选择客户！");
                    return false;
                }
                if (!this.addMissionInfo.goodsId) {
                    this.showErrorTip("请选择货品！");
                    return false;
                }
                if (!this.addMissionInfo.nums) {
                    this.showErrorTip("货品订货数量不能为0！");
                    return false
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
                //整单外发数据有修改 && 节点列表包含外发节点时，不允许提交
                if(this.checkOutsideMsgChange() && this.checkNodeListHasOutsideFlag()){
                    this.$message.error("工单存在节点外发，不允许修改整单外发厂");
                    return false
                }
                return true;
            },
            showErrorTip(text) {
                this.$message({
                    message: text,
                    duration: this.$globalConfig.elementUI.duration,
                    type: "error"
                });
            },
            getImgListParams(fileList) {
                const missionAttachment = [];
                for (let item of fileList) {
                    if (item.percent === 100) {
                        missionAttachment.push(item);
                    }
                }
                return missionAttachment;
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
            hideSelectCustomer() {
                this.downCustomer = false;
            },
            selectCustomer() {
                this.downCustomer = !this.downCustomer;
            },
            newCustomer() {
                this.downCustomer = false;
                this.show_add_customer = true;
                this.add_customer = true;
            },
            cancelCustomerAdd() {
                this.show_add_customer = false;
                this.add_customer = false;
            },
            cityData() {
                let arr = ["澳门", "香港", "上海市", "天津市", "北京市", "重庆市"];
                for (let i = 0; i < dropdowndData.length; i++) {
                    var obj = {};
                    let a = dropdowndData[i];
                    if (a.name) {
                        obj.value = a.name;
                        obj.label = a.name;
                    }
                    obj.children = [];
                    if (arr.indexOf(obj.value) == -1) {
                        for (let j = 0; j < a.city.length; j++) {
                            obj.children[j] = {};
                            obj.children[j].value = a.city[j].name;
                            obj.children[j].label = a.city[j].name;
                            obj.children[j].children = [];
                            for (let k = 0; k < a.city[j].area.length; k++) {
                                obj.children[j].children[k] = {};
                                obj.children[j].children[k].value = a.city[j].area[k];
                                obj.children[j].children[k].label = a.city[j].area[k];
                            }
                        }
                    } else {
                        obj.children = a.city[0].area;
                        obj.children = obj.children.map(function (item) {
                            return {value: item, label: item};
                        });
                    }
                    this.options.push(obj);
                }
            },
            handleChange() {
                this.provinceName = this.selectedOptions[0];
                this.cityName = this.selectedOptions[1];
                this.areaName = this.selectedOptions[2] || "";
            },
            addCustomerSuccess() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    name: this.customerName,
                    address: this.customerAddress,
                    phone: this.custoemrPhone,
                    remark: this.custoemrRemark,
                    provinceName: this.provinceName,
                    cityName: this.cityName,
                    areaName: this.areaName,
                    token: ""
                };
                //console.log(params);
                addFacCustomer(params).then(res => {
                    //console.log(res);
                    if (res.data.code == 0) {
                        this.getFacCustomerList();
                        this.show_add_customer = false;
                        this.add_customer = false;
                    } else {
                        if (this.customerName == "") {
                            this.$message({
                                message: "客户名为空",
                                duration: this.$globalConfig.elementUI.duration,
                                type: "success"
                            });
                        }
                    }
                });
            },
            selectedCustomer(item, index) {
                this.customerValue = item.name;
                this.addMissionInfo.customerId = item.id;
            },
            //搜索
            seachCustomer() {
                let params = {
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    keyword: this.customerValue
                };
                getEasyCustomerList(params).then(res => {
                    this.customerList = res.data.customerList;
                });
            },
            checkPdf() {
                this.isLoading = true;
                let content = this.$refs.ue.getUEContent();
                let params = {
                    id: this.addMissionInfo.workingSheet,
                    name: this.addMissionInfo.processForm.name,
                    content: content,
                    userId: this.userId,
                    attachments: this.addMissionInfo.processForm.attachments,
                };
                console.log(params);
                previewCommonProcessForm(params).then(
                    res => {
                        console.log(res);
                        if (res.data.code == 0) {
                            console.log(res.data.previewURL.slice(27));
                            // window.open('/#/showPDF?key='+res.data.previewURL.slice(27));
                            window.open(res.data.previewURL);
                        }
                        this.isLoading = false;
                    }
                )
            },
            // 获取负责人列表
            async getUnitUser() {
                await getUnitUser({unitId: JSON.parse(sessionStorage.getItem('last_login')).id}).then(res => {
                    this.manList = res.data.data.facGroupDTOS
                })
            },

            delKeepAliveStatus(type = 0) {
                // type 0表示保存成功，1表示取消按钮反回上一层
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$store.dispatch('deleteVisitedLive', 'EditOrder');
                if (type === 1) {
                    this.$router.go(-1);
                }
            },
            // 获取外发厂列表
            getOutsideFactoryList(){
                let params= {
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId:this.userId
                }
                outsideFactoryListForSelect(params).then(res=>{
                    console.log(res,'外发工厂列表')
                    if(res.data.code ===0){
                        this.outsideFactoryList=res.data.data
                    }
                })
            },
            // 新建外发厂成功
            addOutsideFactorySuccess(id){
                this.getOutsideFactoryList()
                this.addMissionInfo.outSideFactoryId = id

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
        },
        async created () {
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            await this.getUnitUser();  // 获取工单负责人
            await this.getFacMissionNodeInfoListById();//获取节点名称
            // 生命周期实例化钩子函数
            this.getNodeList();//获取工序节点保存的值
            this.fetchCustomerList();//获取客户列表
            this.getEasyTemplateList();//获取工序模板下拉数据
            this.getFacCustomerList();//获取客户列表
            this.getFacMission();//获取当前新建保存的工单信息
            this.goodsGet();//获取货品下拉数据
            this.cityData();
            this.getOutsideFactoryList();
        },

    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";
#add_order{
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

    .start {
        margin-right: 3px;
    }

    .draggable {
        &:hover {
            color: #2c2c2c;
        }
    }

    .name-order {
        margin-right: 12px;
        color: #636363;
    }

    .create-order-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        height: 64px;
        margin-bottom: 16px;
        padding: 0 32px;
        line-height: 64px;
        border-radius: 2px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
        .create-order-title {
            font-family: MicrosoftYaHei;
            font-size: 18px;
            color: #2c2c2c;
        }
        .create-order-btns {
            height: 64px;
            line-height: 64px;
            .el-button {
                width: 72px;
                height: 32px;
                border-radius: 2px;
                background-color: $color-btn;
                border: none;
                color: #fff;
                &:first-child {
                    color: $color-btn;
                    background-color: #fff;
                    border: 1px solid $color-btn;
                }
            }
        }
    }

    .create-order-info {
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
        margin-bottom: 16px;
        padding: 36px 32px;
        .info-title {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-family: MicrosoftYaHei;
            font-size: 20px;
            color: #2c2c2c;
            i {
                display: inline-block;
                width: 6px;
                height: 20px;
                background-color: #ff9c38;
            }
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
            float: none;
            .info-item {
                width: 30%;
                display: flex;
                align-items: center;
                margin-left: -15px;
                line-height: 36px;
                &.handle-item{
                    display:inline-block;
                    width:400px;
                    margin-left:100px;
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
                    // text-align: right;
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
        }
        .info-list3 {
            margin-top: 16px;
            .el-select {
                width: 180px;
            }
        }
        .info-list4 {
            margin-top: 16px;
            .el-input {
                width: 964px;
            }
            .img_list_remark {
                min-height: 80px;
                width: 93%;
                background-color: #f7f9fc;
                margin-top: -16px;
                margin-left: 50px;
                padding: 12px 12px 0 0;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .img_list_remark_img {
                    display: inline-block;
                    position: relative;
                    margin-left: 12px;
                    margin-bottom: 12px;
                    .i_del {
                        position: absolute;
                        right: 0;
                        top: 0;
                        display: none;
                        width: 12px;
                        height: 12px;
                        padding: 2px;
                        font-size: 12px;
                        color: #fff;
                        z-index: 99;
                        cursor: pointer;
                        &:hover {
                            background-color: #fff;
                            color: #2c2c2c;
                        }
                    }
                    .mark_remark {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        display: none;
                        cursor: pointer;
                        background-color: rgba(0, 0, 0, 0.7);
                    }
                    .progress {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        transition: height 0.2s;
                        height: 0;
                        // height: 100%;
                        background-color: rgba(0, 0, 0, 0.7);
                    }
                    &:hover {
                        .mark_remark {
                            display: block;
                        }
                        .i_del {
                            display: inline-block;
                        }
                    }
                }
                .upload_img {
                    height: 80px;
                    width: 80px;
                    display: inline-block;
                    margin-left: 10px;
                    border: 1px solid #cccccc;
                    box-sizing: border-box;
                    margin-top: -12px;
                    .upload_img_in {
                        width: 70px;
                        height: 70px;
                        border: 1px dashed #ccc;
                        margin-left: 3px;
                        margin-top: 3px;
                        position: relative;
                        .el-icon-plus {
                            width: 100%;
                            height: 100%;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #c8cacc;
                        }
                        .upload_input {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            opacity: 0;
                        }
                    }
                    &:hover {
                        color: #1ca1ff;
                        border: 1px solid #1ca1ff;
                        .upload_img_in {
                            border: 1px dashed #1ca1ff;
                            .el-icon-plus {
                                color: #1ca1ff;
                            }
                        }
                    }
                }
            }
            .upload-wrap {
                margin-left: 50px;
            }
            .upload-item {
                display: inline-block;
                margin-right: 24px;
                position: relative;
                cursor: pointer;
                .upoad-desc {
                    margin-left: 5px;
                    color: #929aa6;
                    font-size: 14px;
                }
            }
            .img_list_remark {
                img {
                    height: 80px;
                    width: 80px;
                }
            }
            .upload-file {
                margin: 0 16px;
                display: flex;
                justify-content: flex-start;
                .file-item {
                    width: 241px;
                    display: flex;
                    justify-content: flex-start;
                    position: relative;
                    // margin-top: 8px;
                    margin-left: 12px;
                    padding: 8px;
                    background: #f0f1f2;
                    &:first-child {
                        margin-left: 34px;
                    }
                }
                .file-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    background-color: #1f96ff;
                }
                .file {
                    flex: 1;
                }
                i {
                    margin-right: 8px;
                }
                a {
                    color: #2c2c2c;
                    font-size: 12px;
                }
                span {
                    text-decoration: underline;
                }
                .icon-close {
                    float: right;
                    color: #bcbec2;
                    cursor: pointer;
                }
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
                transition: all 0.5s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
                .setCustomer {
                    padding-left: 24px;
                    cursor: pointer;
                    display: flex;
                    justify-content: flex-start;
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
                    // overflow: auto;
                    height: 220px;
                    li {
                        height: 34px;
                        display: flex;
                        align-items: center;
                        text-indent: 2em;
                        color: rgb(72, 82, 106);
                        transition: all 0s;
                        &:hover {
                            background: rgb(228, 230, 241);
                        }
                    }
                }
            }
            .heightUl {
                height: 250px;
                transition: height 0.5s;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
            }
        }
        .table1 {
            margin-top: 16px;
            padding-right: 32px;
        }
        .table123 {
            table,
            tr,
            th,
            td {
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
            .btn-wrap {
                display: inline-block;
                text-align: center;
                button {
                    width: 72px;
                    height: 36px;
                    font-size: 14px;
                    background: none;
                    border-radius: 2px;
                    border: solid 1px #ff9c38;
                }
                .cancle-btn {
                    a {
                        color: #ff9c38;
                    }
                }
                .submit-btn {
                    color: #ffffff;
                    background: #ff9c38;
                }
            }
        }
        .cancel-mission {
            margin-top: 32px;
            float: right;
        }
        .create-main {
            padding: 32px;
            padding-bottom: 120px;
            background: #ffffff;
            .main-title {
                font-size: 20px;
                border-left: 6px solid #ff9c38;
                text-indent: 12px;
            }
            .procedure-name {
                margin: 32px 0;
            }
            .form-wrap {
                display: inline-block;
                margin-right: 57px;
            }
            .form-item {
                display: flex;
                align-items: center;
                .el-input {
                    width: 180px;
                }
            }
            .form-label {
                font-size: 14px;
                padding-right: 10px;
                color: #636363;
                &.is-require::before {
                    content: "*";
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
                overflow-x: auto;
                overflow-y: auto;
            }
        }

        .table {
            display: table;
            table-layout: fixed;
            width: 99%;
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
            }
            .table-td {
                display: table-cell;
                height: 48px;
                padding-left: 16px;
                vertical-align: middle;
                border-bottom: 1px solid #e6e8eb;
            }
            .table-input {
                width: 30px;
                padding: 0 8px;
                border-bottom: 1px solid #d2d4d7;
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
            width: 100%;
            padding: 6px 0;
            text-indent: 16px;
            border: 1px solid #e6e8eb;
            border-top: none;
            .el-button--text {
                color: #ff9c38;
            }
        }
        .cancel {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: #aaa;
            position: relative;
            left: 90%;
            top: 48px;
            border-radius: 4px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: center;
        button {
            margin-right: 16px;
        }
    }

    .customer_dialog_nochange {
        position: absolute;
        top: 0;
        right: 1000000px;
    }

    .customer_dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 200;
        transition: all 2s;
        .customer_show {
            background-color: #fff;
            position: absolute;
            right: -50%;
            top: 0;
            width: 0;
            height: 1000px;
            overflow: auto;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
            transition: all 0.4s;
        }
        .customer_show_out {
            background-color: #fff;
            position: absolute;
            right: -50%;
            top: 0;
            width: 0;
            overflow: auto;
            height: 1000px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
            right: 0;
            width: 48%;
            padding: 0 32px;
            transition: all 0.4s;
            .customer_header {
                height: 108px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #e6e8eb;
                .customer_header_left {
                    font-size: 24px;
                    color: #2c2c2c;
                }
                .customer_header_right {
                    cursor: pointer;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .customer_header_right_btn_cancel {
                        width: 104px;
                        height: 36px;
                        border: 1px solid $color-btn;
                        display: flex;
                        color: $color-btn;
                        justify-content: center;
                        align-items: center;
                        margin-right: 16px;
                    }
                    .customer_header_right_btn_success {
                        width: 104px;
                        height: 36px;
                        background-color: $color-btn;
                        border-radius: 2px;
                        color: #fff;
                        border: 1px solid $color-btn;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            .container_customer {
                .container_customer_header {
                    height: 82px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    .line {
                        width: 6px;
                        height: 20px;
                        background-color: $color-btn;
                        margin-right: 10px;
                    }
                    .customer_title {
                        font-size: 20px;
                        color: #2c2c2c;
                    }
                }
                .container_customer_info {
                    .first_info {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        .first_info_left {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            width: 50%;
                            span {
                                color: #636363;
                                font-size: 14px;
                                margin-right: 10px;
                            }
                            .must {
                                color: red;
                                margin-right: 5px;
                            }
                            input {
                                height: 36px;
                                box-sizing: border-box;
                                width: 260px;
                                border-radius: 2px;
                                border: 1px solid #d0d2d6;
                                text-indent: 0.8em;
                                font-size: 14px;
                            }
                        }
                        .first_info_right {
                            display: flex;
                            justify-content: flex-start;
                            align-items: center;
                            margin-left: 15px;
                            .phone {
                                color: #636363;
                                margin-right: 10px;
                            }
                            input {
                                height: 36px;
                                box-sizing: border-box;
                                width: 260px;
                                border-radius: 2px;
                                border: 1px solid #d0d2d6;
                                text-indent: 0.8em;
                                font-size: 14px;
                            }
                        }
                    }
                    .first {
                        margin-bottom: 30px;
                    }
                    .second_info {
                        margin-top: 20px;
                        .customer_address {
                            color: #636363;
                            margin-left: 10px;
                            margin-right: 5px;
                        }
                    }
                    .third_info {
                        margin-left: 75px;
                        margin-top: 20px;
                        input {
                            background-color: #fafafa;
                            width: 612px;
                            box-sizing: border-box;
                            height: 36px;
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            border: 1px solid #d0d2d6;
                            text-indent: 0.8em;
                            font-size: 14px;
                        }
                    }
                    .fourth_info {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-start;
                        .remark {
                            color: #636363;
                            margin-left: 10px;
                            margin-right: 8px;
                        }
                        textarea {
                            width: 610px;
                            height: 75px;
                            border: 1px solid #d0d2d6;
                            font-size: 14px;
                            resize: none;
                            &:focus {
                                border: 1px solid #d0d2d6;
                            }
                        }
                    }
                    .addStyle_content_secondLine {
                        margin-top: 20px;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        color: #636363;
                        div {
                            span {
                                color: red;
                                padding-right: 4px;
                            }
                        }
                        .div {
                            display: inline-block;
                            border: 1px solid #d5d5d5;
                            border-radius: 2px;
                            position: relative;
                            top: -10px;
                            box-shadow: 0 0.5px #d5d5d5;
                            width: 258px;
                            height: 34px;
                            text-indent: 1em;

                            span {
                                color: #636363;
                                position: relative;
                                top: 10px;
                            }
                            &::-webkit-input-placeholder {
                                font-size: 14px;
                            }
                        }
                        .addStyle_content_secondLine_color {
                            position: relative;
                            &:first-child {
                                margin-right: 30px;
                            }
                        }
                        .el-icon-caret-bottom {
                            position: absolute;
                            right: 10px;
                            top: 2px;
                            transition: all 0.6s;
                            color: rgb(191, 200, 217);
                            font-size: 12px;
                        }
                        .arrow-down {
                            transform: rotate(180deg);
                        }
                        .show_on_style {
                            background-color: #fff;
                            width: 230px;
                            display: flex;
                            flex-wrap: wrap;
                            box-sizing: border-box;
                            overflow: hidden;
                            position: absolute;
                            top: -6px;
                            right: 22px;
                            .el-icon-close {
                                font-size: 12px;
                                font-weight: 100;
                            }
                            span {
                                color: $color-btn;
                                display: flex;
                                align-items: center; // justify-content: space-around;
                                min-width: 49px;
                                max-width: 95px; // padding: 0 2px;
                                height: 24px;
                                border: 1px solid $color-btn;
                                border-radius: 2px;
                                margin: 2px 2px 2px 2px;
                                background-color: rgba(255, 141, 55, 0.1);
                                font-size: 12px;
                                text-indent: 0.5em;
                                &:last-child {
                                    position: relative;
                                    &::after {
                                        content: "...";
                                        font-size: 24px;
                                        display: inline-block;
                                        position: absolute;
                                        top: 0;
                                        right: -30px;
                                    }
                                }
                            }
                        }
                        .addStyle_addColor {
                            width: 362px;
                            border: 1px solid $color-btn;
                            position: absolute;
                            z-index: 999;
                            background-color: #fff;
                            top: 50px;
                            right: -30px;
                            border-radius: 2px;
                            transition: all 2s;
                            scrollbar[orient="vertical"] {
                                min-width: 15px;
                            }
                            .addStyle_addColor_top {
                                border-bottom: 1px solid $color-btn;
                                width: 100%;
                                display: flex;
                                flex-wrap: wrap;
                                padding: 4px 2px 4px 3px;
                                box-sizing: border-box;
                                overflow: hidden;
                                margin-bottom: 4px;
                                .el-icon-close {
                                    font-size: 12px;
                                    font-weight: 100;
                                }
                                span {
                                    color: $color-btn;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-around;
                                    min-width: 49px;
                                    max-width: 95px;
                                    padding: 0 2px;
                                    height: 24px;
                                    border: 1px solid $color-btn;
                                    border-radius: 2px;
                                    margin: 2px 2px 2px 2px;
                                    background-color: rgba(255, 141, 55, 0.1);
                                    font-size: 12px;
                                    text-indent: 0.5em;
                                    i {
                                        font-size: 14px;
                                        cursor: pointer;
                                    }
                                    &:last-child {
                                        position: relative;
                                        &::after {
                                            content: "...";
                                            font-size: 24px;
                                            display: inline-block;
                                            position: absolute;
                                            top: 0;
                                            right: -30px;
                                        }
                                    }
                                }
                            }

                            .addStyle_addColor_top_des {
                                text-indent: 1em;
                                height: 39px;
                                font-size: 12px;
                                color: #c8c8c8;
                                padding-top: 10px;
                                box-sizing: border-box;
                            }
                            .addStyle_addColor_bottom {
                                margin: 0;
                                padding-top: 8px;
                                .addStyle_addColor_bottom_firstLine {
                                    margin: 0;
                                    display: flex;
                                    justify-content: space-around;
                                    align-items: center;
                                    position: relative;
                                    input {
                                        border: none;
                                        border-bottom: 1px solid #d6d6d6;
                                        border-radius: 0;
                                        position: relative;
                                        width: 214px;
                                    }
                                    .el-icon-circle-close {
                                        position: absolute;
                                        right: 143px;
                                        top: 3px;
                                        font-size: 14px;
                                        color: #ccc;
                                    }
                                    span {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        border: 1px solid $color-btn;
                                        font-size: 12px;
                                        width: 50px;
                                        height: 22px;
                                        border-radius: 100px;
                                        color: $color-btn;
                                        cursor: pointer;
                                        &:last-child {
                                            color: #fff;
                                            background-color: $color-btn;
                                        }
                                    }
                                }
                                .color_list {
                                    overflow: auto;
                                    margin: 10px 10px 10px 10px;
                                    display: flex;
                                    flex-wrap: wrap;
                                    height: 200px;
                                    justify-content: flex-start;

                                    div {
                                        margin: 0;
                                        margin-right: 10px;
                                        width: 100px;
                                        height: 24px;
                                        text-align: center;
                                        display: flex;
                                        justify-content: flex-start;
                                        align-items: center;
                                        margin-bottom: 10px;
                                        border: 1px solid $color-btn;
                                        border-radius: 2px;
                                        position: relative;
                                        font-size: 13px;
                                        cursor: pointer;
                                        span {
                                            position: relative;
                                            left: 0;
                                            top: 0;
                                            display: inline-block;
                                            border-radius: 2px 0 0 2px;
                                            width: 24px;
                                            height: 24px;
                                            margin-right: 15%;
                                        }
                                        .span {
                                            width: 0;
                                            margin: 0;
                                        }
                                    }
                                    .customer_add {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                    }
                                    .customer_select {
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        color: #000;
                                    }
                                }
                                .color_list_height {
                                    height: auto;
                                    text-indent: 1em;
                                }
                            }
                        }
                    }
                    .addStyle_content_thirdLine {
                        margin-top: 30px;
                        position: relative;
                        // margin-bottom: 30px;
                        p {
                            span {
                                position: relative;
                                color: #8492a6;
                                font-size: 12px;
                                span {
                                    position: relative;
                                    top: 8px;
                                    left: 10px;
                                    color: #fff;
                                }
                            }
                            .add_photo {
                                width: 68px;
                                height: 28px;
                                background-color: $color-btn;
                                border-radius: 4px;
                                display: inline-block;
                                color: #fff;
                                position: relative;
                                top: -10px;
                            }
                            input {
                                opacity: 0;
                                position: absolute;
                                width: 60px;
                                height: 100%;
                                top: 5px;
                                left: 4px;
                                z-index: 888;
                            }
                        }
                        ul {
                            display: flex;
                            justify-content: flex-start;
                            padding-bottom: 4px;
                            padding-top: 10px;
                            background-color: #f6f6f6;
                            width: 700px;
                            min-height: 120px;
                            li {
                                width: 114px;
                                height: 114px;
                                border: 1px solid #ccc;
                                margin-right: 10px;
                                border-radius: 4px;
                                position: relative;
                                &:first-child {
                                    margin-left: 15px;
                                }
                                .faceStyle {
                                    position: absolute;
                                    top: 0;
                                    right: 0;
                                    z-index: 777;
                                    width: 0;
                                    height: 0;
                                    border-top: 40px solid $color_btn;
                                    border-left: 40px solid transparent;
                                    span {
                                        position: absolute;
                                        transform: rotate(45deg);
                                        top: -30px;
                                        left: -26px;
                                        color: #fff;
                                        font-size: 12px;
                                    }
                                }
                                a {
                                    position: relative;
                                    display: inline-block;
                                    height: 100%;
                                    width: 100%;
                                    .imgCancel {
                                        position: absolute;
                                        top: 3px;
                                        right: 5px;
                                        cursor: pointer;
                                        display: inline-block;
                                        height: 12px;
                                        width: 12px;
                                    }
                                    .faceSelect {
                                        position: absolute;
                                        bottom: 0;
                                        height: 26px;
                                        width: 100%;
                                        background-color: rgba(0, 0, 0, 0.7);
                                        color: #fff;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        cursor: pointer;
                                    }
                                }
                                img {
                                    width: 100%;
                                    border-radius: 4px;
                                }
                            }
                        }
                    }
                    .addStyle_content_fourthLine {
                        p {
                            font-size: 24px;
                        }
                        .msg_classify {
                            display: flex;
                            flex-wrap: wrap;
                            width: 850px;
                            div {
                                display: flex;
                                align-items: center;
                                margin-top: 20px;
                                position: relative;
                                .selcet_designer_data_before {
                                    height: 0;
                                    transition: height 0.6s;
                                }
                                .selcet_designer_data {
                                    height: 230px;
                                    width: 250px;
                                    border-radius: 4px;
                                    background-color: #fff;
                                    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.07);
                                    border: 1px solid rgba(0, 0, 0, 0.2);
                                    position: absolute;
                                    top: 40px;
                                    left: 52px;
                                    z-index: 666;
                                    display: inline-block;
                                    transition: height 0.8s;
                                    .search_add_designer {
                                        border-bottom: 1px solid #d5d5d5;
                                        padding-bottom: 3px;
                                        margin-left: 3px;
                                        margin-right: 2px;
                                        height: 30px;
                                        margin-top: 5px;
                                        input {
                                            border-right: 1px solid #d5d5d5;
                                            text-indent: 0.6em;
                                            width: 78%;
                                        }
                                        span {
                                            font-size: 12px;
                                            display: flex;
                                            width: 48px;
                                            height: 22px;
                                            text-indent: 0.35em;
                                            color: $color-btn;
                                            cursor: pointer;
                                        }
                                    }
                                    ul {
                                        margin-top: 10px;
                                        height: 180px;
                                        overflow: scroll;
                                        li {
                                            display: flex;
                                            justify-content: flex-start;
                                            height: 36px;
                                            padding: 0 10px;
                                            &:hover {
                                                background-color: #ddd;
                                            }
                                        }
                                    }
                                }
                                span {
                                    position: relative;
                                    top: 20%;
                                    color: #636363;
                                }
                                .selectDesigner {
                                    width: 250px;
                                    height: 36px; // background-color: skyblue;
                                    display: flex;
                                    align-items: center;
                                    text-indent: 0.5em;
                                    border: 1px solid #d5d5d5;
                                    border-radius: 4px;
                                    position: relative;
                                    margin-right: 43px;
                                    i {
                                        font-style: normal;
                                        color: #c8c8c8;
                                    }
                                    .black {
                                        color: #000;
                                    }
                                    .el-icon-caret-bottom {
                                        position: absolute;
                                        right: 10px;
                                        top: 12px;
                                        transition: all 0.5s;
                                        color: rgb(191, 200, 217);
                                        font-size: 12px;
                                    }
                                    .arrow-down {
                                        transform: rotateX(180deg);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 定义bom表的UI
    .bom-contain {
        margin: 32px 0;
        background-color: #fff;
        width: 100%;
        padding: 32px;
        box-sizing: border-box;
    }
}
</style>
<style lang="scss">
    @import "~scss_vars";

    #add_order{
    width: 100%;
    height: 100%;

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

    .table .el-input__inner {
        border: none;
        border-radius: 0;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    .table .node_user .el-input__inner {
        border: none;
        border-radius: 0;
        font-size: 14px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
    }

    .table .node_user .el-tag--primary {
        background-color: #fff;
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

    .search-man .el-input__inner {
        &::-webkit-input-placeholder {
            color: #636363;
        }
        &:focus {
            outline: 0;
            border-color: #ff9c38;
        }
    }

    .search-maned .el-input__inner {
        width: 490px;
        &::-webkit-input-placeholder {
            color: #636363;
        }
        &:focus {
            outline: 0;
            border-color: #ff9c38;
        }
    }

    .el-input__icon + .el-input__inner {
        padding-right: 20px;
    }

    .search-man .el-tag--primary {
        background-color: #fff;
        border: none;
        color: #2c2c2c;
        .el-icon-close {
            color: #d7d7d7;
        }
    }

    .search-man .el-icon-close {
        &:hover {
            color: #d7d7d7;
        }
    }

    .el-select .el-tag {
        margin: 0 0 0 3px;
    }

    .info-list1 .el-date-editor.el-input {
        width: 180px;
    }

    .table-td .el-date-editor.el-input {
        width: auto;
    }

    .el-input__inner:focus {
        outline: 0;
        border-color: #ff9c38;
    }

    .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }

    .handle-delete {
        margin-top: 34px;
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
            min-height: 36px !important;
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

    .el-icon {
        position: absolute;
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
    .goods-edit {
        display: inline-block;
        padding-left: 5px;
        padding-right: 32px;
        cursor: pointer;
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
    .mission-shipment-radio{
        text-align: center;
        .el-radio__label{
            display: none;
        }
    }
</style>
