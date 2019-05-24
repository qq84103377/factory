<template>
    <el-row class="order-detailed">
        <section>
            <page-title class="order-header" title="工单详情">
                <nf-button @click="back()">
                    <i class="el-icon-arrow-left"></i>返回上级</nf-button>
            </page-title>
            <!--工单头部区域-->
            <order-info :orderData="orderData" :tableData="tableData3" :skuVal="skuVal">
            </order-info>
            <!--浮层-->
        </section>
        <!--工单内容区域-->
        <el-col :span="24" class="order-content" id="order-content">
            <node-process :nodeStatus="nodeStatus" :nodeList="nodeList" :isCancel="orderData.cancel"></node-process>
            <!--工单左侧节点进度-->
            <div class="node-info" v-if="false" v-loading="nodeDetailLoding">

                <div class="order-content-cancel" v-if="orderData.cancel==1">
                    <!--浮层-->
                </div>

                <div class="node-header">
                    <div class="node-title">
                        <i class="line-weith6"></i>
                        节点进度
                    </div>
                    <div class="node-status">
                        <el-col :offset="8" :span="16">
                            <el-col :span="8">
                                <icon type="icon-gongdan-jiedianyiwancheng-da"></icon>
                                已完成: {{nodeStatus['FINISH']}}
                                <!--已完成: {{nodeStatus.number}}-->
                            </el-col>

                            <el-col :span="8">
                                <icon type="icon-gongdan-jiedianjinxingzhong-da"></icon>

                                进行中: {{nodeStatus['ONGOING']}}
                            </el-col>

                            <el-col :span="8">
                                <icon type="icon-gongdan-jiedianweikaishi-da"></icon>

                                未开始: {{nodeStatus['WAIT_START']}}
                            </el-col>

                        </el-col>
                    </div>
                </div>
                <!--节点图标带线-->
                <el-col :span="24" class="node-line">
                    <el-col :span="24" class="node-line-info">
                        <div class="steps" v-for="(k, index) in nodeList" :key="index">
                            <!--左边线-->
                            <div class="step-line step-line-left" :class="{'active-line-left':currentNodeInstanceId==k.instanceWorkflowId}" v-show="(index!=0)"></div>

                            <div class="step-item" style="cursor: pointer" :class="{'active':currentNodeInstanceId==k.instanceWorkflowId}" @click="toggleDisplay('go',k.instanceWorkflowId)">
                                <span style="position: relative;">
                                    <icon v-if="k.nodeAlert && k.status!='FINISH'" type="icon-gongdan_jiedianjingbao-xiao" style="vertical-align:-3px;width: 10px;height: 10px;position: absolute;top: -3px;left: 10px;" :class="{'active-alert':currentNodeInstanceId==k.instanceWorkflowId}"></icon>
                                    <icon v-if="k.status=='FINISH'" type="icon-gongdan-jiedianyiwancheng-da" :class="{'active-icon':currentNodeInstanceId==k.instanceWorkflowId}"></icon>
                                    <icon v-if="k.status=='WAIT_START'" type="icon-gongdan-jiedianweikaishi-da" :class="{'active-icon':currentNodeInstanceId==k.instanceWorkflowId}"></icon>
                                    <icon v-if="k.status=='ONGOING'" type="icon-gongdan-jiedianjinxingzhong-da" :class="{'active-icon':currentNodeInstanceId==k.instanceWorkflowId}"></icon>
                                </span>
                                <div class="steps-desc" :class="{'fz14':currentNodeInstanceId==k.instanceWorkflowId}">
                                    {{k.name}}
                                </div>
                            </div>
                            <!--右边线-->
                            <div class="step-line step-line-right" :class="{'active-line-right':currentNodeInstanceId==k.instanceWorkflowId}" v-show="(index!=nodeList.length-1)"></div>
                        </div>
                    </el-col>
                </el-col>

                <!--节点的列表-->
                <el-col :span="24" class="node-box">
                    <!-------------------------------逻辑型-------------------------------->
                    <!--节点的详情-->
                    <el-col :span="24" class="node-list-detailed" v-show="!detailed">

                        <!--<el-col :span="24" class="node-list-detailed" v-show="true">-->
                        <!--节点信息-->
                        <el-col class="node-list-info">
                            <!--头部-->
                            <el-col class="info-head1" :span="24">
                                <div class="item-node-info" :span="10">
                                    <div :span="4" class="node-icon">
                                        <span style="position: relative;">
                                            <icon type="icon-gongdan_jiedianjingbao-xiao" v-if="instanceWorkflow.nodeAlert==1&&instanceWorkflow.status!='FINISH'" style="vertical-align:-3px;width: 17px;height: 17px;position: absolute;top: -12px;left: 20px;"></icon>
                                            <icon v-if="instanceWorkflow.status=='FINISH'" type="icon-gongdan-jiedianyiwancheng-da" style="width: 32px;height: 32px;"></icon>
                                            <icon v-if="instanceWorkflow.status=='WAIT_START'" type="icon-gongdan-jiedianweikaishi-da" style="width: 32px;height: 32px;"></icon>
                                            <icon v-if="instanceWorkflow.status=='ONGOING'" type="icon-gongdan-jiedianjinxingzhong-da" style="width: 32px;height: 32px;"></icon>
                                        </span>
                                    </div>

                                    <div :span="16" class="node-name">
                                        <span class="node--name">{{instanceWorkflow.nodeName}}</span>
                                        <p class="node-type">{{instanceWorkflow.nodeType}} </p>
                                    </div>

                                </div>

                                <div :span="14" class="back-btn">
                                    <nf-button @click="toggleDisplay('back',null)">
                                        <i class="el-icon-arrow-left color63"></i>
                                        返回
                                    </nf-button>
                                </div>
                            </el-col>

                            <el-col class="info-head1 change-node-status" :span="24">
                                <span class="title status-color">节点状态</span>
                                <div class="status">
                                    <span class="text-color" @click="changeStatus('WAIT_START')" :class="{'wait_start':instanceWorkflow.status=='WAIT_START'}">未开始</span>
                                    <span class="text-color" @click="changeStatus('ONGOING')" :class="{'ongoing':instanceWorkflow.status=='ONGOING'}">进行中</span>
                                    <span class="text-color" @click="changeStatus('FINISH')" :class="{'finish':instanceWorkflow.status=='FINISH'}">已完成</span>

                                    <p style="color: #a2abb8;">（请为节点选择对应的状态）</p>

                                </div>

                            </el-col>

                            <el-col>

                                <!--编辑状态-->
                                <div class="node-list-edit" v-if="isEditNodeInfo">

                                    <div class="enter-update-btn">
                                        <a class="cancel-btn" @click="cancelUpdate()">取消</a>
                                        <a class="enter-btn" @click="updteData(instanceWorkflow)">确认</a>
                                    </div>
                                    <div class="info-head2">
                                        <div class="title status-color">负责人</div>
                                        <div class="select">
                                            <el-select v-model="leaderIds" multiple placeholder="请选择">
                                                <el-option v-for="(item,index) in workerList" :key="item.id" :label="item.userName" :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </div>
                                    </div>

                                    <div class="info-head2 info-data-item">
                                        <div class="info-data" :span="12">
                                            <div class="title status-color">开始日期</div>
                                            <div class="content">

                                                <!-- <el-date-picker v-model="instanceWorkflow.beginAt" type="date"
                                                                :picker-options="pickerOptions0"
                                                                @change='getBenginDate'
                                                                placeholder="选择日期"></el-date-picker> -->
                                                <nf-picker :beginTime='instanceWorkflow' :timeSelect="'begin'" @beginAt='nodeBeTime'></nf-picker>

                                            </div>
                                        </div>

                                        <div class="info-data" :span="12">
                                            <div class="title status-color">结束日期</div>
                                            <div class="content">

                                                <nf-picker :beginTime='instanceWorkflow' :timeSelect="'end'" @endAt='nodeEnTime'></nf-picker>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="info-head2">
                                        <div class="title status-color">备注信息</div>
                                        <div class="select">
                                            <el-input v-model="instanceWorkflow.remark" :maxlength="50" @input="handleInputRemark"></el-input>
                                        </div>
                                    </div>

                                    <!--筛选end-->
                                </div>

                                <!--查看状态-->
                                <div class="node-list-view" v-if="!isEditNodeInfo" :class="{'is-data':instanceWorkflow.nodeType=='数量型'}">
                                    <!--查看状态-->
                                    <!--筛选begin-->
                                    <el-col class="info-head-view">

                                        <el-col :span="24" class="view-right">
                                            <span class="edit-node-info"  @click="isEditNodeInfo=!isEditNodeInfo">修改节点信息</span>
                                        </el-col>
                                    </el-col>
                                    <el-col class="info-head-view">
                                        <el-col :span="24" class="view-left">
                                            <div class="view-title text-color-63">负责人：</div>
                                            <div class="view-content text-color-2c">
                                                <span v-for="(item,index) in leadersName" v-if="leadersName.length>0">
                                                    {{item.userName}}
                                                    <span v-if="index!=leadersName.length-1">、</span>
                                                </span>

                                                <span class="null-text" v-if="leadersName.length===0">未填写</span>

                                            </div>
                                        </el-col>
                                    </el-col>
                                    <el-col class="info-head-view">
                                        <el-col :span="12" class="view-left">
                                            <div class="view-title text-color-63" :span="6">开始日期：</div>
                                            <div class="view-content text-color-2c" v-if="instanceWorkflow.beginAt" :span="18">
                                                {{instanceWorkflow.beginAt}}
                                            </div>
                                            <div class="view-content null-text" v-else :span="18">未填写</div>

                                        </el-col>

                                        <el-col :span="12" class="view-left">
                                            <div class="view-title text-color-63" :span="6">结束日期：</div>
                                            <div class="view-content text-color-2c" v-if="instanceWorkflow.endAt" :span="18">
                                                {{instanceWorkflow.endAt}}
                                            </div>
                                            <div class="view-content null-text" v-else :span="18">未填写</div>
                                        </el-col>
                                    </el-col>
                                    <el-col class="info-head-view">
                                        <el-col :span="24" class="view-left">
                                            <div class="view-title text-color-63" :span="6">备注信息：</div>
                                            <div class="view-content text-color-2c" v-if="instanceWorkflow.remark" :span="18">
                                                {{instanceWorkflow.remark}}
                                            </div>
                                            <div class="view-content null-text" v-else :span="18">未填写</div>
                                        </el-col>
                                    </el-col>
                                    <!--筛选end-->
                                </div>

                                <!--数量型的表格 逻辑型时不显示-->
                                <el-col class="node-list-table" v-if="instanceWorkflow.nodeCode=='DATA'">
                                    <el-col :span="24" class="node-table-title">
                                        <el-col v-show="!skuRadio" :span="12" style="color: #555555;">
                                            完成情况: {{instanceWorkflow.finishTotal}} / {{instanceWorkflow.missionNum}}
                                        </el-col>
                                        <el-col v-show="skuRadio" :span="12" style="color: #555555;">
                                            未完成数: {{unDoneNum}} / {{instanceWorkflow.missionNum}}
                                        </el-col>
                                        <el-col :span="12" style="text-align: right;">
                                            <el-radio-group @change="handleFilterSkuData" v-model="skuRadio">
                                                <el-radio :label="0">完成数</el-radio>
                                                <el-radio :label="1">未完成数</el-radio>
                                            </el-radio-group>
                                        </el-col>
                                    </el-col>
                                    <!-- 表格 -->
                                    <el-col :span="24" class="node-list-content">
                                        <!-- <nf-table v-if="instanceWorkflow.nodeCode=='DATA'" :tableData="tableData3"
                                                  :skuVal="skuVal" @setSkuVal="setSkuVal"></nf-table> -->
                                        <service-table v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :skuVal="reportTableVal" :isChangeBg="false"></service-table>
                                        <!--<p style="color: #a2abb8;">表格内颜色表示：绿色为已完成项，蓝色为进行中项，白色为未开始项。</p>-->
                                        <nf-button class="report-btn" type="success" @click="reprot()">上报数量</nf-button>
                                        <!-- <a class="report" >上报数量</a> -->
                                    </el-col>
                                </el-col>

                                <!--警报-->
                                <el-col class="warning">

                                    <!--系统警报-->
                                    <el-col class="warn-list" v-for="(msg,index) in MessageByMission.sysList" :key="index" @mouseenter.native="rmWarning(1)" @mouseleave.native="rmWarning(0)">
                                        <el-col :span="24">
                                            <el-col :span="1">
                                                <icon style="width:22px;height: 17px" type="icon-gongdan-jingbao"></icon>
                                            </el-col>

                                            <el-col :span="23" class="warn-title">
                                                <!--警报类型-->
                                                <span>{{msg.messageType}}</span>
                                                <!--警报内容-->
                                                {{msg.message}}
                                            </el-col>
                                        </el-col>
                                        <el-col :span="24">
                                            <el-col :span="11" :offset="1" class="warn-member">
                                                关联人员: {{msg.relater}}
                                            </el-col>

                                            <el-col :span="12" class="warn-tip">
                                                <span v-show="true">只有完成节点才能解除警报</span>
                                                <!--<span v-show="rmWarn" @click="clearWaring(msg.id)"-->
                                                <!--style="color: #1f96ff;cursor: pointer;">解除警报</span>-->
                                            </el-col>
                                        </el-col>

                                    </el-col>

                                    <!--用户警报-->
                                    <el-col class="warn-list" v-for="(msg,index) in MessageByMission.addList" :key="index" @mouseenter.native="rmWarning(1)" @mouseleave.native="rmWarning(0)">
                                        <el-col :span="24">
                                            <el-col :span="1">
                                                <icon style="width:22px;height: 17px" type="icon-gongdan-jingbao"></icon>
                                            </el-col>

                                            <el-col :span="23" class="warn-title">
                                                <span> {{msg.messageType}}</span> :
                                                <span>{{msg.message}}</span>

                                            </el-col>
                                        </el-col>

                                        <el-col :span="24">
                                            <el-col :span="20" :offset="1" class="warn-member">
                                                关联人员: {{msg.relater}}
                                            </el-col>
                                            <el-col :span="20" :offset="1" class="warn-member">
                                                关联节点: {{msg.relateNode}}
                                            </el-col>

                                            <el-col :span="3" class="warn-tip">
                                                <!--<span v-show="!rmWarn">只有完成节点才能解除警报</span>-->
                                                <span v-show="true" @click="clearWaring(msg.id)" style="color: #1f96ff;cursor: pointer;">解除警报</span>
                                            </el-col>
                                        </el-col>

                                    </el-col>

                                    <nf-button class="create-warn" type="danger" @click="userAddAlert()">添加警报
                                    </nf-button>
                                    <!-- <el-col :span="24" class="create-warn" >添加警报</el-col> -->

                                </el-col>

                                <!--节点动态-->
                                <el-col class="node-state" v-show="true">
                                    <el-col :span="24" class="node-state-title">
                                        <span class="fz16">节点动态</span>
                                    </el-col>

                                    <el-col :span="24" v-for="(item,index) in factoryMissionOpLogList.factoryMissionOpLogList" :key="index">

                                        <!--类型
                                        0系统警报
                                        1数据型上报二维矩阵
                                        -->
                                        <!--0系统警报-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==0">
                                            <el-col :span="24">

                                                <!---->
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-jiedianjingbao-da"></icon>
                                                        <span>{{item.newRecord}}</span>
                                                    </div>
                                                    <div class="list-right">
                                                        <span class="node-date">{{item.opAt}}</span>
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-col>

                                        <!--1数据型上报二维矩阵-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==1">
                                            <!--最新记录-->

                                            <el-col :span="24" @mouseover.native="showEdit(index)" @mouseout.native="showEdit(index)">
                                                <div class="list-header">
                                                    <!---->
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-caozuo"></icon>
                                                        <span class="text-color1">{{item.userName}}：</span>
                                                        <p class="appear-num">
                                                            上报数量 {{item.newRecord.nowReportData.totalNum}}
                                                            <span v-if="item.reportDelFlag" style="padding: 2px 8px;border: 1px solid #A0ACBD;color: #A0ACBD;">已撤销</span>
                                                        </p>
                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-handle" style="color: #a2abb8;text-align: right;" v-if="item.reportDelFlag == false" v-show="!item.isExpand">
                                                            <span style="cursor: pointer;">{{item.createAt}}</span>
                                                        </div>
                                                        <!--撤销-->
                                                        <div class="list-handle" style="color: #a2abb8;text-align: right;" v-if="item.reportDelFlag == true">
                                                            <span style="cursor: pointer;">{{item.createAt}}</span>
                                                        </div>

                                                        <div class="list-handle" v-if="item.reportDelFlag == false" style="color: #a2abb8;text-align: right;" v-show="item.isExpand">
                                                            <span style="cursor: pointer;" @click="deleteTeble(item)">撤销</span>
                                                            <span style="color: #1f96ff; font-size: 14px;cursor: pointer;margin-left: 20px;" @click="editReport(item)">修改</span>
                                                        </div>
                                                        <i class="el-icon-arrow-down" @click="toggleDisplayAll(index)" :class="{'rotate': item.allCollapse}"></i>
                                                    </div>
                                                </div>

                                            </el-col>
                                            <section v-show="item.allCollapse">
                                                <!--上报表格-->
                                                <el-col :span="24" style="line-height: 26px;margin-top: 15px">
                                                    <div class="list-header report-header">
                                                        <!-- <div class="gray">关联人员: <span
                                                                v-for="(p,index) in item.newRecord.nowReportData.relateUserNames">{{p}}&nbsp;&nbsp;</span>
                                                        </div> -->
                                                        <div class="gray">完成人员：
                                                            <span>{{ item.newRecord.nowReportData.finishUsername }}</span>
                                                        </div>

                                                        <div class="node-date">
                                                            完成日期:{{item.finishAt || '未设置'}}
                                                        </div>
                                                    </div>
                                                </el-col>
                                                <el-col :span="24" :class="{'opacity5':item.reportDelFlag}">
                                                    <service-table class="table-cancel" v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :isNode="true" :skuVal="item.reportTableVal"></service-table>
                                                </el-col>
                                                <el-col :span="24" v-if="item.newRecord.historyReportData[0]" :class="{'opacity5':item.reportDelFlag}" style="line-height: 26px;border-top: 1px solid #e1e5eb;padding-top: 16px;">
                                                    <el-col class="collapse gray">修改记录
                                                        <i class="el-icon-arrow-down" @click="toggleRecordTable(index)" :class="{'rotate': item.isRecordExpand}"></i>
                                                    </el-col>
                                                    <!-- <el-col class="collapse">修改记录
                                                    </el-col> -->
                                                    <el-col :span="24" v-if="item.newRecord.historyReportData[0]" v-show="item.isRecordExpand">
                                                        <div class="gray">
                                                            第一次上报数量：{{item.newRecord.historyReportData[0].totalNum}}
                                                        </div>
                                                        <service-table v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :isNode="true" :skuVal="item.newRecord.historyReportData[0].reportTableVal"></service-table>
                                                    </el-col>
                                                    <!--修改记录-->
                                                    <el-col :span="24" v-if="item.newRecord.compareReportData.length" v-for="(compareItem, compareIndex) in item.newRecord.compareReportData" :key="compareIndex" v-show="item.isRecordExpand" style="line-height: 26px;border-top: 1px solid #e1e5eb;padding-top: 16px;">
                                                        <!-- <el-col class="collapse">修改记录
                                                        </el-col> -->
                                                        <!-- <el-col class="collapse">修改记录<i class="el-icon-arrow-down" @click="toggleRecordTable(index, compareIndex)" :class="{'rotate': compareItem.isExpand}"></i>
                                                        </el-col> -->
                                                        <!-- <el-col>修改记录</el-col> -->
                                                        <el-col :span="24">
                                                            <div style="overflow: hidden">
                                                                <el-col :span="18" class="gray">
                                                                    {{compareItem.username}}: 将此上报记录数量修改为 {{compareItem.totalNum}}
                                                                </el-col>
                                                                <el-col :span="6" style="color: #a2abb8;text-align: right">
                                                                    {{compareItem.reportAt}}
                                                                </el-col>
                                                            </div>
                                                            <service-table v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :isNode="true" :skuVal="compareItem.reportTableVal"></service-table>
                                                        </el-col>
                                                    </el-col>
                                                </el-col>

                                            </section>

                                        </el-col>

                                        <!--2工单sku二维矩阵-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==2">
                                            <el-col :span="24">
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-caozuo"></icon>
                                                        <span style="white-space:nowrap;" class="text-color1">{{item.userName}}：</span>
                                                        <p>将工单订货数量从 {{item.oldRecord.total}} 修改为 {{item.newRecord.total}}，节点目标数量随之变化
                                                        </p>
                                                    </div>
                                                    <div class="list-right" style="color: #a2abb8;">
                                                        <div class="list-handle">
                                                            {{item.createAt}}
                                                        </div>
                                                        <i class="el-icon-arrow-down" :class="{'rotate': item.isExpand}" @click="toggleTable(index)"></i>
                                                    </div>
                                                </div>
                                                <!-- <el-col :span="6" style="color: #a2abb8;text-align:right">
                                                    {{item.opAt}} -->
                                            </el-col>
                                            <section v-show="item.isExpand">
                                                <el-col class="edit-status" :span="24">
                                                    修改前数量：{{item.oldRecord.total}}
                                                </el-col>
                                                <el-col :span="24">
                                                    <service-table v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :isNode="true" :skuVal="item.oldReportTableVal"></service-table>
                                                </el-col>
                                                <el-col class="edit-status" :span="24">
                                                    修改后数量：{{item.newRecord.total}}
                                                </el-col>
                                                <el-col :span="24">
                                                    <service-table v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :isNode="true" :skuVal="item.newReportTableVal"></service-table>

                                                </el-col>
                                            </section>
                                        </el-col>
                                        <!-- 3节点字段修改-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==3">
                                            <el-col :span="24" class="list-content">
                                                <!---->
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-caozuo"></icon>
                                                        <span class="text-color1">{{item.userName}}：</span>
                                                        <p>
                                                            {{item.field}}从
                                                            <span class="text-color1">{{item.oldRecord}}</span>
                                                            修改为
                                                            <span class="text-color1">{{item.newRecord}}</span>
                                                        </p>
                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-hanle node-date">
                                                            {{item.opAt}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-col>
                                        </el-col>

                                        <!--  4警报解除 ok-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==4">
                                            <el-col :span="24">
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-jiechujingbao"></icon>
                                                        <p class="text-color1">{{item.userName}}：解除警报</p>
                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-handle">
                                                            <span class="node-date">{{item.opAt}}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-col>

                                            <el-col class="gray edit-detail pd-28" style="line-height: 24px;">
                                                <!--{{.slice('<br/>')}}-->

                                                <el-col>{{JSON.parse(item.newRecord).alertmsg}}</el-col>
                                                <el-col>{{JSON.parse(item.newRecord).alertpeople}}</el-col>
                                                <el-col>{{JSON.parse(item.newRecord).reason}}
                                                </el-col>
                                            </el-col>
                                        </el-col>

                                        <!-- 5添加警报--相关人员字段未知! 其他ok-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==5">
                                            <el-col :span="24">
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-dongtaijingbao"></icon>
                                                        <p class="text-color1">{{item.userName}}：添加警报</p>
                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-handle node-date">
                                                            {{item.opAt}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-col>

                                            <el-col class="pd-28 gray">
                                                <el-col class="edit-detail"> {{JSON.parse(item.newRecord).alertmsg}}
                                                </el-col>

                                                <el-col class="edit-detail">
                                                    {{JSON.parse(item.newRecord).alerttaskInstanceWorkFlows}}
                                                </el-col>

                                                <el-col class="edit-detail"> {{JSON.parse(item.newRecord).alertpeople}}
                                                </el-col>
                                                <!--<p style="color: #2c2c2c;margin-bottom: 8px;padding-left: 26px;">-->
                                                <!--警报内容: {{item.newRecord}}</p>-->
                                                <!--<P style="color: #2c2c2c;margin-bottom: 8px;padding-left: 26px;">-->
                                                <!--相关人员: TODO添加人员null~~~</P>-->

                                            </el-col>

                                        </el-col>

                                        <!-- 6系统提醒或一行提示-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==6">

                                            <el-col :span="24">
                                                <!---->
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-caozuo"></icon>
                                                        <p class="text-color1">{{item.userName}}:{{item.field}}
                                                        </p>
                                                        <p>{{item.newRecord}}</p>
                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-handle node-date">
                                                            {{item.opAt}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-col>

                                        </el-col>
                                        <!--7多行动态-->
                                        <el-col :span="24" class="node-state-list" v-if="item.type==7">
                                            <el-col :span="24">
                                                <!---->
                                                <div class="list-header">
                                                    <div class="list-left">
                                                        <icon style="width: 24px;height: 24px;" type="icon-gongdan-caozuo"></icon>
                                                        <span class="text-color1">{{item.userName}}： {{item.field}}</span>

                                                    </div>
                                                    <div class="list-right">
                                                        <div class="list-headle node-date">{{item.opAt}}</div>
                                                    </div>
                                                </div>
                                            </el-col>
                                            <el-col class="edit-detail pd-28 gray" :span="24" style="line-height: 28px">
                                                <span v-html="item.newRecord"></span>
                                            </el-col>
                                        </el-col>
                                    </el-col>

                                </el-col>

                            </el-col>

                        </el-col>
                    </el-col>

                    <!----------------------------数量型-------------------------------->
                </el-col>
            </div>

            <!--工单右侧相关消息-->
            <section id="about-msg" v-loading="msgLoading">
                <div class="service-center scroll">
                    <div class="scroll-view">
                        <div class="service-header">
                            <div class="service-title">相关消息</div>
                            <div class="filter">
                                <el-checkbox v-model="isMe" true-label="1" false-label="0" @change="fetchMessageList">只看与我有关
                                </el-checkbox>
                                <el-checkbox v-model="isAlert" true-label="1" false-label="0" @change="fetchMessageList">警报
                                </el-checkbox>
                                <el-checkbox v-model="isImg_File" true-label="1" false-label="0" @change="fetchMessageList">有图片或附件
                                </el-checkbox>
                                <div style="width:100px">
                                    <el-select v-model="taskInstanceWorkFlowIds" @change="handleSeclectNodeId" placeholder="节点名">
                                        <el-option label='全部' :value='0'></el-option>
                                        <el-option v-for="item in selectNodeList" :key="item.instanceWorkflowId" :label="item.name" :value="item.instanceWorkflowId">
                                        </el-option>
                                    </el-select>
                                </div>
                            </div>
                        </div>
                        <div class="content" id="chatContainerOrder" ref="scroll-view" style="height:80%;">
                            <div class="no-more-data" v-show="isNoMessagaMore">
                                没有更多数据了
                            </div>
                            <div v-for="(msgItem, msgIndex) in messageList" :key="msgIndex" :class="[
                                    msgItem.alertStatus && msgItem.flag ? 'warning-msg' : '',
                                    msgItem.isFirst ? 'first-child' : ''
                                    ]">
                                <center-item :msgItem="msgItem" :isMission="false" @deleteMsg="deleteMsg" @getMsgItem="getMsgItem" @preview="handlePreview" @viewDetail="viewNodeDetail"></center-item>
                            </div>
                        </div>
                        <send-form @handleReplyMessage="handleReplyMessage" @changeNode="handleSelectNode" :personList="selectPersonList" :nodeList="selectNodeList" :staticPersonIds="staticPersonIds" :staticNodeIds="staticNodeIds" :resplyMsg="resplyMsgItem" :isSubmit="isSubmit" :isMission="true" :textFocus="textFocus"></send-form>
                    </div>
                </div>
            </section>
            <!--添加和删除警报弹窗-->
            <el-dialog id="cancel-dialog" title="" :visible.sync="dialogVisible" :show-close="false" size="small">

                <!--解除警报-->
                <el-row class="cancel-alert" v-if="!isAddAlert">
                    <el-col class="cancel-alert-title">
                        解除警报
                    </el-col>

                    <el-col class="cancel-content">
                        <el-col>
                            <i class="start">*</i>解除原因</el-col>
                        <el-col>
                            <el-input v-model="textarea1" type="textarea"></el-input>
                        </el-col>
                    </el-col>

                    <el-col class="cancel-btns">

                        <nf-button @click="saveAlert(0)">取消</nf-button>
                        <nf-button type="warning" @click="saveAlert(1)">确认</nf-button>
                    </el-col>
                </el-row>

                <!--添加警报-->

                <el-row class="add-alert" v-if="isAddAlert">
                    <el-col class="add-alert-title">
                        添加警报
                    </el-col>

                    <el-col class="add-cancel-content">
                        <el-col class="content-flex">
                            <el-col :span="12">
                                关联节点
                                <el-select @change="rmTag" v-model="missionNodes" multiple placeholder="请选择" id="alertInput1">
                                    <el-option v-for="(item, index) in missionNodeList" :key="index" :label="item.name" :value="item.instanceWorkflowId" :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="12">
                                关联人员
                                <el-select v-model="leaderIdsAlert" multiple placeholder="请选择" id="alertInput2">
                                    <el-option v-for="(item, index) in workerList" :key="index" :label="item.userName" :value="item.id">
                                    </el-option>
                                </el-select>

                            </el-col>
                        </el-col>
                    </el-col>

                    <el-col class="add-alert-foot">
                        <el-col style="margin-bottom: 8px;">
                            <i class="start">*</i>警报内容</el-col>
                        <el-col>
                            <el-input v-model="textarea1" type="textarea"></el-input>
                        </el-col>
                        <el-col class="add-alert-btns">
                            <nf-button @click="addAlert(0)">取消</nf-button>
                            <nf-button type="warning" @click="addAlert(1)">确定</nf-button>
                            <!-- <button class="btns" @click="addAlert(0)">取消</button>
                            <button class="btns" @click="addAlert(1)">确认</button> -->
                        </el-col>
                    </el-col>
                </el-row>
            </el-dialog>
            <el-dialog :visible.sync="addReportVisible" :show-close="false" size="small">
                <div class="dialog-title" slot="title">
                    {{currentNodeName}}上报数量
                </div>
                <div class="dialog-body">
                    <div class="form-inline">
                        <div class="form-item">
                            <span class="form-label">完成日期</span>
                            <div class="input-wrap">
                                <el-date-picker :disabled="date_disabled" type="date" format="yyyy-MM-dd" v-model="reportFrom.endAt" @change="pickerReportEndAt" :picker-options="pickerOptions0" placeholder="选择日期">
                                </el-date-picker>
                            </div>
                        </div>
                        <div class="form-item">
                            <span class="form-label">完成人员</span>
                            <div class="input-wrap">
                                <el-select :disabled="staff_disabled" v-model="reportFrom.finishUserId" placeholder="请选择完成人员">
                                    <el-option v-for="(leaderItem, leaderIndex) in selectPersonList" :key="leaderIndex" :label="leaderItem.userName" :value="leaderItem.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <div class="form-textarea">
                        <service-table ref="reportTable" v-if="reportTableData && reportTableData.colors.length" :tableData="reportTableData" :skuVal="reportSkuVal" @setReportOnce="setReportOnce" @setReportVal="setReportVal" :isEdit="true"></service-table>
                    </div>
                    <div class="form-btn">
                        <nf-button @click="cancelAddReport">取消</nf-button>
                        <nf-button type="warning" @click="handleAddReport(instanceWorkflow)">确定</nf-button>
                        <!-- <button class="cancle" @click="addReportVisible=false">取消</button>
                        <button class="sure" @click="handleAddReport">确定</button> -->
                    </div>
                </div>
            </el-dialog>
        </el-col>
        <!-- <transition name="fade">
            <div class="modal" v-show="previewImgVisble">
                <div class="preview-img" @click.stop="previewImgVisble = false">
                    <img :src="previewImgPath">
                </div>
            </div>
        </transition> -->
        <div class="index">
            <el-dialog :visible.sync="centerDialogVisible1" :show-close="true" :modal="true" center>
                <div>
                    <i class="el-icon-arrow-left" @click="leftImg_info"></i>
                </div>
                <div class="imgs"><img :src="this.img_info_img[imgIndex] && this.img_info_img[imgIndex].filePath"></div>
                <div>
                    <i class="el-icon-arrow-right" @click="rightImg_info"></i>
                </div>
            </el-dialog>
        </div>
    </el-row>
</template>

<script type="text/ecmascript-6">
import Table from "../Common/table.vue";
import ServiceTable from "../service/serviceTable";
import CenterItem from "../service/center-item";
import SendForm from "../service/form";
import Utils from "../../utils/format";
import NfPicker from "./nf-picker";
import Attachment from "../goods/child/attachEdit";
import OrderInfo from "./orderDetail/orderInfo";
import NodeProcess from "./orderDetail/nodeProcess";
import { mapState, mapGetters } from "vuex";
import {
  getFacMission,
  getGoodSkuList,
  getFacMissionNodeInfoListById,
  selectFacGoodsStyle,
  getTaskInstanceWorkflow,
  getMessageByMissionId,
  cancelNodeAlert,
  getEasyTaskNodeList,
  getWorkbayList,
  queryFactoryMissionOpLogPage,
  updateTaskInstanceWorkflow,
  addNodeWarning,
  getMessageList,
  queryTaskNodeList,
  getPersonList,
  getNodeList,
  addMessage,
  addReportDataDetail,
  updateReportDataDetail,
  deleteMessage,
  editMessage,
  getLeadersOfNode,
  deleteReportDataDetail,
  templatePrinttig,
  getPrintTemplatesByType,
  previewCommonProcessForm
} from "../../api/api";

export default {
  componentName: "orderDetail",
  data() {
    return {
      //日期范围
      componentName: "orderDetail",
      pickerOptions0: {
        //开始日期
        // disabledDate: time => {
        // 	return time.getTime() < Date.now() - 8.64e7;
        // }
      },
      pickerOptions1: {
        //结束日期
        disabledDate: time => {
          if (this.instanceWorkflow.beginAt) {
            const date = this.instanceWorkflow.beginAt.replace(/-/g, "/");
            return time.getTime() < +new Date(date) + 8.64e7;
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      currentNodeInstanceId: "", //当前节点的实例ID 非普通的节点ID
      nodeDetailLoding: false, //节点详情loading
      orderDataLoading: true, //工单节点进度loading
      leaderNames: [], //负责人的name数组
      isEditNodeInfo: false,
      //  添加警报
      missionNodeList: [], //警报可选节点
      missionNodes: [], //警报选中的节点
      isLoading: true,
      isDown: false, //删除线的表格
      isEnter: false, //hover
      //警报相关
      isAddAlert: false,
      textarea1: "",
      dialogVisible: false,
      centerDialogVisible1: false,
      img_info_img: [],
      imgIndex: 0,
      // 数据
      info: {
        goodsOptions: [] //货品下拉列表,
      },
      reportFrom: {
        leaders: [],
        endAt: "",
        copyLeaders: [],
        finishUserId: ""
      },
      nodeStatus: {},
      isOrderInfo: false, //订单表格
      orderData: {
        imgList: [],
        fileList: []
      }, //某个工单的详情
      leaderIds: [],
      leaderIdsAlert: [],
      checked1: "",
      checked2: "",
      textarea: "",
      tableData3: [], //表格的数据
      skuVal: {},
      skuList: [],
      nodeList: [],
      k: {
        status: "FINISH"
      }, //测试数据
      options: [{ value: "哈哈", leble: "我是负责人" }],
      // detailed:this.$store.state.detailed, //某个节点的详情
      value5: "", //负责人
      value1: "", //开始日期
      value2: "", //结束日期
      value11: "", //详情的开始日期
      value22: "", //详情的结束日期
      radio: "1", //详情单选框//已完成/未完成
      goods: "",
      remark: "", //备注

      instanceWorkflow: {}, //节点的详细信息
      statusList: [], //进度的状态
      MessageByMission: "", //警报消息
      rmWarn: true, //解除警报信息的显示/隐藏
      currentMessageId: "", //当前的报警id

      workerList: [], //当前工厂的所有工位

      isLog: false, //节点动态显示/隐藏
      factoryMissionOpLogList: [], //全部节点动态数据
      nodesList: [], //选中的关联节点
      workersList: [], //选中的关联工位
      nodeOptions: [], //添加警报节点下拉
      workerOptions: [], //添加警报工位下拉
      // 消息
      isAlert: "0",
      isMe: "0",
      isImg_File: "0",
      skuRadio: 0,
      unDoneNum: 0,
      reportTableData: {
        colors: [],
        lengths: [],
        sizes: []
      },
      copySkuVal: {},
      reportSkuVal: {},
      reportTableVal: {},
      nodeReportTableVal: {},
      addReportVisible: false,
      isSubmit: false,
      isEdit: false,
      textFocus: false,
      msgLoading: false,
      previewImgVisble: false,
      previewImgPath: "",
      staticPersonIds: [],
      staticNodeIds: [],
      updataOptions: {},
      routeInstanceWorkflowId: "", // 路由跳转的
      routeMissionId: "",
      taskInstanceWorkFlowIds: "",
      resplyMsgItem: {},
      selectPersonList: [],
      selectNodeList: [],
      messageList: [],
      isNoMessagaMore: false,
      loadMessageIndex: 1,
      TaskInstanceWorkflow: {}, //获取节点详情所需的参数
      getWorkerListParams: {}, //获取工位的参数
      getPersonListParams: {}, //获取节点详情负责人的参数
      getMessageParams: {}, //获取消息的参数
      currentNodeName: "", //当前节点的name
      printList: [],
      leadersName: [],
      processForm: {},
      userId: "",
      date_disabled:false,
        staff_disabled:false
    };
  },
  computed: {
    ...mapState(["rongYunRes"]),
    detailed() {
      return this.$store.state.detailed;
    }, //某个节点的详情
    userId() {
      return (
        this.$store.state.userInfo.id ||
        JSON.parse(sessionStorage.getItem("user_login")).userId
      );
    },
    isBoss() {
      const info = sessionStorage.getItem("loginman_info");
      return JSON.parse(info).type === 1;
    }
  },
  watch: {
    rongYunRes: {
      handler: function(val, oldVal) {
        this.getMessage(val);
      },
      deep: true
    },
    // 每次打开数据还原
    dialogVisible(val) {
      if (val) {
        const leaders = this.instanceWorkflow.leaders,
          newArr = [];
        if (leaders) {
          for (let i = 0; i < leaders.length; i++) {
            if (!newArr.includes(leaders[i].userId)) {
              newArr.push(leaders[i].userId);
            }
          }
          this.leaderIdsAlert = newArr;
          console.log(this.leaderIdsAlert);
        }
        this.leaderIdsAlert.push(this.userId);
        this.textarea1 = "";
      }
    },
    addReportVisible(val) {
      console.log(this.isBoss);
      this.reportFrom["finishUserId"] = val && this.isBoss ? "" : this.userId;
      this.$refs["reportTable"] && this.$refs["reportTable"].initOnceInputVal();
    }
    //监听数据变化后在最后
    // messageList(val) {
    // 	this.$nextTick(() => {
    // 		var container = this.$el.querySelector("#chatContainerOrder");
    // 		container.scrollTop = container.scrollHeight;
    // 	})
    // }
  },

  created: function() {
    const missionId = this.$route.query.missionId;
    this.routeMissionId = missionId;
    this.routeInstanceWorkflowId = this.$route.query.instanceWorkflowId;
    // 生命周期实例化钩子函数
    this.getOrderData(missionId);
    // this.getGoods();
    if (!this.routeInstanceWorkflowId) {
      this.fetchMessageList();
    }
    // this.fetchSkuList();

    this.toggleDisplay("goToDetailed", "");
    // this.getPrintTemplatesByType();

    this.userId =
      this.$store.state.userInfo.id ||
      JSON.parse(sessionStorage.getItem("user_login")).userId;
  },
  mounted() {
    const scrollView = this.$refs["scroll-view"];
    scrollView.addEventListener(
      "scroll",
      () => {
        if (scrollView.scrollTop === 0 && !this.loading) {
          this.loadMoreMessage();
        }
      },
      false
    );
    // 生命周期渲染后钩子函数
  },
  components: {
    NfTable: Table,
    NfPicker,
    CenterItem,
    SendForm,
    Attachment,
    ServiceTable,
    OrderInfo,
    NodeProcess
  },
  methods: {
    //开始和结束日期
    nodeBeTime(item, val) {
      console.log(val, "begin");
      this.instanceWorkflow.beginAt = val;
      item.beginAt = val;
      console.warn(item);
    },
    nodeEnTime(item, val) {
      this.instanceWorkflow.endAt = val;
      console.log(val, "end");
      item.endAt = val;
    },
    cancelUpdate() {
      /**
       * @description
       * 编辑状态取消时会有残留的数据 , 刷新清空
       */
      this.isEditNodeInfo = false;
      this.refresh();
      this.init();
    },
    init() {
      //清空负责人
      this.leaderIds = [];
    },
    handleInputRemark() {
      // if (this.instanceWorkflow.remark.length > 50) {
      //     this.$message.error('备注最多为50个字符！');
      //     this.instanceWorkflow.remark = this.instanceWorkflow.remark.substr(0, 50);
      // }
    },
    leadersIdToName() {
      /**
       * 文件名称 OrderDetailed.vue
       * 当前行号 1392
       * 创建用户 dengshen
       * 创建时间 2017-39-27 05:39:55
       * 功能描述 把ID转换为name作为展示
       * 添加之前先清空
       */

      this.leaderNames = [];
      //				console.log(this.leaderIds)
      //				workerList 所有工位
      for (let obj of this.workerList) {
        //					this.leaderNames.push(obj.userName)
        for (let i = 0; i < this.leaderIds.length; i++) {
          if (this.leaderIds[i] == obj.id) {
            //							this.leaderNames.push(this.leaderIds[i])
            this.leaderNames.push(obj.userName);
          }
        }
      }

      this.nodeDetailLoding = false;
    },
    rmTag() {
      // 多选模式删除tag
      if (!this.missionNodes.includes(this.nodeID)) {
        this.missionNodes.unshift(this.nodeID);
      }
    },
    handlePreviewInfoImg(imgList, index) {
      this.centerDialogVisible1 = true;
      this.img_info_img = imgList;
      console.log(this.img_info_img);
      this.imgIndex = index;
    },
    leftImg_info() {
      if (this.imgIndex == 0) {
        return false;
      } else {
        this.img_info_img[this.imgIndex--];
      }
    },
    rightImg_info() {
      if (this.imgIndex >= this.img_info_img.length - 1) {
        return false;
      } else {
        this.img_info_img[this.imgIndex++];
      }
    },
    refresh() {
      //实时刷新数据
      // alert('开始刷新')
      console.log("---------开始刷新--------");
      let _this = this;
      _this.isLoading = true;
      let facInfo = JSON.parse(sessionStorage.getItem("last_login")).id;
      let missionId = JSON.parse(sessionStorage.getItem("order_detailed"))
        .missionId;

      let last_login = JSON.parse(sessionStorage.getItem("last_login"));
      /**
       *
       * @type {{facId, missionId, instanceWorkflowId: *}}
       */
      const userId = this.userId;
      if (_this.TaskInstanceWorkflow.instanceWorkflowId) {
        console.warn("131231");
        getTaskInstanceWorkflow(_this.TaskInstanceWorkflow).then(async res => {
          console.log(res, "某个节点的详细情况");
          _this.isLoading = false;
          _this.instanceWorkflow = res.data;
          _this.staticPersonIds = [];
          _this.staticNodeIds = [];
          _this.leadersName = res.data.leaders;
          _this.nodesList.push({
            nodeName: res.data.nodeName,
            nodeId: res.data.nodeId,
            status: res.data.status
          });
          if (!this.routeInstanceWorkflowId) {
            this.fetchMessageList(_this.nodeID);
          }
          for (let i = 0; i < res.data.leaders.length; i++) {
            if (!_this.leaderIds.includes(res.data.leaders[i].userId)) {
              _this.leaderIds.push(res.data.leaders[i].userId);
            }
            if (!_this.leaderIdsAlert.includes(res.data.leaders[i].userId)) {
              _this.leaderIdsAlert.push(res.data.leaders[i].userId);
            }
            _this.staticPersonIds.push(res.data.leaders[i].userId);
          }
          if (!_this.leaderIdsAlert.includes(userId)) {
            _this.leaderIdsAlert.push(userId);
          }
          _this.reportFrom["finishUserId"] = userId;
          if (res.data["nodeSKUList"]) {
            const skuList = await this.fetchGoodSku(res.data.goodsId);
            this.reportTableData = this.regroupTaleData(skuList);
            const reportSkuVal = {};
            for (let skuItem of skuList) {
              const id = `${skuItem.color_id}-${skuItem.size_id}${
                skuItem.standard_id ? "-" + skuItem.standard_id : ""
              }`;
              // this.skuVal[id] = {
              //     ...nodeItem
              // }
              this.reportTableVal[id] = {
                ...skuItem
                // num:'0',
                // finishNum: "0"
              };
              reportSkuVal[id] = {
                ...skuItem
                // num: "0",
                // finishNum: "0"
              };
              this.nodeReportTableVal[id] = {
                ...skuItem,
                num: "0",
                finishNum: "0"
              };
              this.copySkuVal[id] = {
                ...skuItem,
                num: "0",
                finishNum: "0"
              };
              for (let nodeItem of res.data["nodeSKUList"]) {
                if (nodeItem.skuId === skuItem.id) {
                  const id = `${skuItem.color_id}-${skuItem.size_id}${
                    skuItem.standard_id ? "-" + skuItem.standard_id : ""
                  }`;
                  // this.skuVal[id] = {
                  //     ...nodeItem
                  // }
                  this.reportTableVal[id] = {
                    ...nodeItem
                  };
                  reportSkuVal[id] = {
                    ...nodeItem,
                    num: ""
                  };
                  this.nodeReportTableVal[id] = {
                    ...nodeItem,
                    num: "",
                    finishNum: ""
                  };
                  this.copySkuVal[id] = {
                    ...nodeItem
                  };
                }
              }
            }
            this.reportSkuVal = reportSkuVal;
          }

          _this.leaderIdsAlert = JSON.parse(JSON.stringify(_this.leaderIds));
          this.handleFilterSkuData(this.skuRadio);
          this.fetchFactoryMissionOpLogPage(missionId, _this.nodeID);
          _this.staticNodeIds.push(res.data.nodeId);
          this.routeInstanceWorkflowId = "";
        });
      }
      //获取所有的工位列表
      let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
      let lastLogin = JSON.parse(sessionStorage.getItem("last_login"));

      let getWorkerList = {
        facIds: [],
        keyword: "",
        token: "",
        userId: this.userId
      };
      getWorkerList.facIds.push(lastLogin.id);

      getWorkbayList(_this.getWorkerListParams).then(res => {
        _this.workerOptions = res.data.data;
        //_this.workerList = res.data.data
        //console.log(res, '---------所有的工位');
      });
      this.leadersIdToName();

      // getPersonList(_this.getPersonListParams).then(res => {
      //     //console.log(res, '-------新列表');
      //     _this.workerList = res.data;
      // });
      /**
       *
       * @type {{facId: 必须, missionId: 必须, taskInstanceWorkflowId: 节点ID警报/工单警报}}
       */

      let getMessageParams = {
        taskInstanceWorkflowId: _this.nodeID,
        missionId: missionId,
        facId: facInfo
      };
      console.log(getMessageParams, "警报消息参数");

      getMessageByMissionId(getMessageParams).then(res => {
        console.log(res, "自动刷新 - 全部的警报信息");
        _this.MessageByMission = res.data;
      });

      this.getOrderData(missionId);
    },
    handlePreview(imgList, index) {
      console.log(imgList);
      imgList.map(item => {
        item.filePath = item.path;
      });
      this.centerDialogVisible1 = true;
      this.img_info_img = imgList;
      this.imgIndex = index;
    },
    goToDetailed() {
      //                alert(1)
    },
    toggleDelTable(index) {
      const item = this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ];
      item.delExpand = !item.delExpand;
    },
    toggleDisplayAll(index) {
      const item = this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ];
      item.allCollapse = !item.allCollapse;
    },
    toggleRecordTable(index, compareIndex) {
      const item = this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ];
      //console.log()
      if (typeof compareIndex === "number") {
        item["newRecord"]["compareReportData"][compareIndex].isExpand = !item[
          "newRecord"
        ]["compareReportData"][compareIndex].isExpand;
        return;
      }
      item.isRecordExpand = !item.isRecordExpand;
    },
    toggleTable(index) {
      this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ].isExpand = !this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ].isExpand;
      // this.isDown = !this.isDown;
    },
    showEdit(index) {
      this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ].isExpand = !this.factoryMissionOpLogList["factoryMissionOpLogList"][
        index
      ].isExpand;
    },
    deleteTeble(item) {
      //console.log(item, '---------------撤销');
      deleteReportDataDetail({
        userId: JSON.parse(sessionStorage.getItem("user_info")).id,
        id: item.targetId
      }).then(res => {
        if (res.data.code == 0) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
            duration: this.$globalConfig.elementUI.duration
          });
          this.refresh();
        }
      });
    },
    reprot() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList;

      if (datalist.indexOf("fac.mission.node.report") === -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      if (datalist.indexOf("fac.mission.node.finishDate.update") === -1) {
        this.date_disabled = true;
      }
      if (datalist.indexOf("fac.mission.node.finishBy.update") === -1) {
        this.staff_disabled = true;
      }
      //上报数量
      this.addReportVisible = true;
      this.updataOptions = {};
      this.reportFrom.endAt = this.formatTime(new Date());
    },
    formatTime(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1,
        month = month < 10 ? "0" + month : month;
      var day = date.getDate(),
        day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    getBenginDate(value) {
      this.instanceWorkflow.beginAt = value;
    },
    getEndDate(value) {
      console.warn(value);
      this.instanceWorkflow.endAt = value;
    },
    // 获取融云返回消息
    getMessage(msg) {
      if (msg.content.data === this.missionId) {
        this.fetchMessageList();
      }
    },
    addAlert(type) {
      //添加警报
      let _this = this;
      if (type == 1) {
        //确认添加
        //console.log(_this.leaderIdsAlert, '添加警报时选择的工位负责人');
        let userId = this.userId; //用户
        let unitId = JSON.parse(sessionStorage.getItem("user_login"))
          ? JSON.parse(sessionStorage.getItem("user_login")).unitId
          : JSON.parse(sessionStorage.getItem("last_login")).id; //工厂ID
        let order_detailed = JSON.parse(
          sessionStorage.getItem("order_detailed")
        );
        let leaderIdArr = []; //通过姓名获取ID
        for (let i = 0; i < _this.workerList.length; i++) {
          //  //console.log(_this.workerList[i],'所有的可选');
          for (let j = 0; j < _this.leaderIdsAlert.length; j++) {
            //console.log(_this.leaderIdsAlert[i], '++选中的警报人员++');
            if (
              _this.workerList[i].userName == _this.leaderIdsAlert[j] ||
              _this.workerList[i].id == _this.leaderIdsAlert[j]
            ) {
              //console.log(_this.workerList[i].userName, '找到了');
              leaderIdArr.push(_this.workerList[i].id);
            }
          }
        }

        //                    let instanceWorkflowIdArr = [];
        //                    for (var i = 0; i < _this.missionNodes.length; i++) {
        //                        for (var j = 0; j < _this.missionNodeList.length; j++) {
        //                            console.log(_this.missionNodes[i], '<----->', _this.missionNodeList[j].id);
        //                            if (_this.missionNodes[i] == _this.missionNodeList[j].id) {
        //
        //                                instanceWorkflowIdArr.push(_this.missionNodeList[j].instanceWorkflowId)
        //                            }
        //                        }
        //                    }

        let addAlertParams = {
          unitId: unitId,
          userId: userId,
          missionId: order_detailed.missionId,
          taskInstanceWorkFlowId: _this.nodeID,
          //"notifyTaskInstanceWorkFlowIdIds": [_this.nodesList[0].nodeId],
          notifyTaskInstanceWorkFlowIdIds: this.missionNodes,
          //                        "notifyUserIds": _this.leaderIdsAlert,
          notifyUserIds: leaderIdArr,
          messageSpecialType: "ALERT",
          message: _this.textarea1
        };
        //console.log(addAlertParams, '----添加警报参数');
        if (_this.textarea1 && _this.leaderIdsAlert.length > 0) {
          addNodeWarning(addAlertParams).then(res => {
            _this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
              duration: this.$globalConfig.elementUI.duration
            });

            _this.dialogVisible = false;
            _this.refresh(); //动态获取数据
            _this.textarea1 = "";
            _this.missionNodes = []; //清空节点
            //                            return setTimeout(function () {
            //                                _this.$router.go(0)
            //                            }, 300)
          });
        } else {
          _this.$message({
            showClose: true,
            message: "信息填写不完整",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
        }
      } else {
        _this.dialogVisible = false;
      }
    },
    userAddAlert() {
      let _this = this;
      _this.dialogVisible = true;
      _this.isAddAlert = true;
      let params = {
        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
        missionId: JSON.parse(sessionStorage.getItem("order_detailed"))
          .missionId
      };
      getNodeList({
        missionId: JSON.parse(sessionStorage.getItem("order_detailed"))
          .missionId
      }).then(res => {
        _this.missionNodes = []; //先清空在赋值
        for (let item of res.data) {
          if (item.instanceWorkflowId == _this.nodeID) {
            item.disabled = true;
            _this.missionNodes.push(item.instanceWorkflowId);
          }
        }
        _this.missionNodeList = res.data;
        console.log(res.data, "------------missionNodeList----------------");
      });
      //任务节点下拉列表
      getEasyTaskNodeList(params).then(res => {
        //console.log(res, '任务节点下拉列表');

        _this.nodeOptions = res.data.data.taskNodes;
      });
    },

    saveAlert(type) {
      let _this = this;
      if (type) {
        if (_this.textarea1) {
          let unitId = JSON.parse(sessionStorage.getItem("last_login")).id;
          let userId = this.userId;
          let missionId = JSON.parse(sessionStorage.getItem("order_detailed"));

          let params = {
            unitId: unitId,
            userId: userId,
            missionId: missionId.missionId,
            messageId: _this.currentMessageId,
            reason: _this.textarea1
          };
          //console.log(params);
          // return
          cancelNodeAlert(params).then(res => {
            //console.log(res, '返回解除警告状态!!');
            _this.dialogVisible = false;
            _this.refresh();
            _this.textarea1 = "";

            _this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success",
              duration: this.$globalConfig.elementUI.duration
            });
            //                            return setTimeout(function () {
            //                                _this.$router.go(0)
            //                            }, 300)
          });
        } else {
          return _this.$message({
            showClose: true,
            message: "请输入解除警报内容",
            type: "warning",
            duration: this.$globalConfig.elementUI.duration
          });
        }
      } else {
        _this.dialogVisible = false;
        _this.$message({
          showClose: true,
          message: "已取消",
          type: "warning",
          duration: this.$globalConfig.elementUI.duration
        });
      }
    },
    rmWarning(type) {
      //警报消息显示/隐藏
      if (type) {
        this.rmWarn = true;
      } else {
        this.rmWarn = false;
      }
    },
    clearWaring(id) {
      //解除警报
      let _this = this;
      //用户警报
      _this.dialogVisible = true;
      _this.currentMessageId = id;
      _this.isAddAlert = false;
    },
    changeStatus(type) {
      //节点进度更改状态
      let _this = this;

      _this.instanceWorkflow.status = type;

      this.updteData(_this.instanceWorkflow);
    },
    updteData(val) {
      //更新节点详情信息
      let _this = this;
      _this.isLoading = true;
      /**
       * 文件名称 OrderDetailed.vue
       * 当前行号 1968
       * 创建用户 dengshen
       * 创建时间 2017-32-28 12:32:30
       * 功能描述 更新数据时节点详情的loading
       */
      _this.nodeDetailLoding = true;

      _this.isEditNodeInfo = false;
      //console.log(_this.leaderIds, '---负责人!!!--');
      let userLogin = JSON.parse(sessionStorage.getItem("user_login"));

      let leaderIdArr = []; //通过姓名获取ID
      for (let i = 0; i < _this.workerList.length; i++) {
        for (let j = 0; j < _this.leaderIds.length; j++) {
          if (
            _this.workerList[i].userName == _this.leaderIds[j] ||
            _this.workerList[i].id == _this.leaderIds[j]
          ) {
            //console.log(_this.workerList[i].userName, '找到了id', _this.workerList[i].id);
            leaderIdArr.push(_this.workerList[i].id);
          }
        }
      }

      let updateTaskInstanceWorkflowParams = {
        userId: userLogin ? userLogin.userId : this.userId,
        id: val.id,
        status: _this.instanceWorkflow.status,
        remark: _this.instanceWorkflow.remark,
        beginAt: _this.instanceWorkflow.beginAt,
        endAt: _this.instanceWorkflow.endAt,
        leaderIds: leaderIdArr
      };
      //console.log(updateTaskInstanceWorkflowParams, '更新节点参数');

      console.log("当前在 OrderDetailed 第 2019 行", val, _this.nodeID);

      updateTaskInstanceWorkflow(updateTaskInstanceWorkflowParams).then(res => {
        //console.log(res, '更新数据');

        if (res.data.code == 0) {
          // this.detailed = !this.detailed;
          _this.textarea1 = "";
          _this.isLoading = false;
          _this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
            duration: this.$globalConfig.elementUI.duration
          });
          this.$nextTick(() => {
            _this.refresh(); //调用刷新函数
          });
          /**
           * 文件名称 OrderDetailed.vue
           * 当前行号 2030
           * 创建用户 dengshen
           * 创建时间 2017-25-28 12:25:49
           * 功能描述 更新节点详情成功后返回节点列表 , 并且把节点详情的loading取消
           */
          _this.nodeDetailLoding = false;
          // _this.toggleDisplay('back')
          // _this.toggleDisplay('go', val.id)
        } else {
          _this.$message({
            showClose: true,
            message: "目标数量上报未完成，节点无法完成",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
          _this.isLoading = false;
          _this.nodeDetailLoding = false;
        }
      });
    },
    // 方法
    toggleDisplay(type, val) {
      // this.getGoods();
      //默认隐藏编辑状态
      /**
       * @description 控制显示列表还是详情 true显示列表
       * @param true/详情  false/列表
       *                 this.detailed = this.$store.state.detailed
       * */
      this.isEditNodeInfo = false;

      let _this = this;
      if (val) {
        _this.nodeID = val;
      } else {
        _this.nodeID = JSON.parse(sessionStorage.getItem("node_workflowId"))
          ? JSON.parse(sessionStorage.getItem("node_workflowId")).id
          : "";
      }

      const userId = this.userId;

      if (type == "back") {
        this.$store.dispatch("changeNodeDetailed", true);
        this.fetchMessageList("");
        // this.detailed = true;
        /**
         * 文件名称 OrderDetailed.vue
         * 当前行号 1875
         * 创建用户 dengshen
         * 创建时间 2017-40-27 02:40:28
         * 功能描述 用户点击返回按钮时情况当前节点的名字
         */
        _this.currentNodeName = "";
        _this.currentNodeInstanceId = "";

        const missionId = this.$route.query.missionId;
        this.getOrderData(missionId);
      } else if (type == "go") {
        this.$store.dispatch("changeNodeDetailed", false);
        // this.detailed = false; //显示节点详情
        _this.isLoading = true;
        _this.nodeDetailLoding = true;

        let facInfo =
          JSON.parse(sessionStorage.getItem("user_login")) ||
          JSON.parse(sessionStorage.getItem("last_login")).id;
        let missionId = JSON.parse(sessionStorage.getItem("order_detailed"))
          .missionId;

        let last_login = JSON.parse(sessionStorage.getItem("last_login"));
        /**
         *
         * @type {{facId, missionId, instanceWorkflowId: *}}
         */
        let params = {
          facId: last_login.id,
          missionId: missionId,
          instanceWorkflowId: val
        };
        console.warn(params);
        /**
         * @description
         * 保存当前的节点参数 , 给后面刷新时提供参数
         */
        _this.TaskInstanceWorkflow = params;
        getTaskInstanceWorkflow(params).then(async res => {
          console.log(res, "某个节点的详细情况");
          _this.currentNodeName = res.data.nodeName;
          _this.currentNodeInstanceId = res.data.id;
          _this.isLoading = false;
          _this.instanceWorkflow = res.data;
          _this.staticPersonIds = [];
          _this.staticNodeIds = [];
          _this.leaderIds = [];
          _this.nodesList.push({
            nodeName: res.data.nodeName,
            nodeId: res.data.nodeId
          });
          if (!this.routeInstanceWorkflowId) {
            this.fetchMessageList(_this.nodeID);
          }
          _this.taskInstanceWorkFlowIds = val;
          // 直接赋值给leadersName
          _this.leadersName = res.data.leaders;
          for (let i = 0; i < res.data.leaders.length; i++) {
            // _this.leaderIds.push(res.data.leaders[i].userName)
            if (!_this.leaderIds.includes(res.data.leaders[i].userId)) {
              _this.leaderIds.push(res.data.leaders[i].userId);
            }
            if (!_this.leaderIdsAlert.includes(res.data.leaders[i].userId)) {
              _this.leaderIdsAlert.push(res.data.leaders[i].userId);
            }
            // _this.reportFrom['leaders'].push(res.data.leaders[i].userId);
            _this.staticPersonIds.push(res.data.leaders[i].userId);
          }
          if (!_this.leaderIdsAlert.includes(userId)) {
            _this.leaderIdsAlert.push(userId);
          }
          if (res.data["nodeSKUList"]) {
            const skuList = await this.fetchGoodSku(res.data.goodsId);
            this.reportTableData = this.regroupTaleData(skuList);
            const reportSkuVal = {};
            for (let skuItem of skuList) {
              const id = `${skuItem.color_id}-${skuItem.size_id}${
                skuItem.standard_id ? "-" + skuItem.standard_id : ""
              }`;
              // this.skuVal[id] = {
              //     ...nodeItem
              // }
              this.reportTableVal[id] = {
                ...skuItem
                // num:'0',
                // finishNum: "0"
              };
              reportSkuVal[id] = {
                ...skuItem
                // num: "0",
                // finishNum: "0"
              };
              this.nodeReportTableVal[id] = {
                ...skuItem,
                num: "0",
                finishNum: "0"
              };
              this.copySkuVal[id] = {
                ...skuItem,
                num: "0",
                finishNum: "0"
              };
              for (let nodeItem of res.data["nodeSKUList"]) {
                if (nodeItem.skuId === skuItem.id) {
                  const id = `${skuItem.color_id}-${skuItem.size_id}${
                    skuItem.standard_id ? "-" + skuItem.standard_id : ""
                  }`;
                  // this.skuVal[id] = {
                  //     ...nodeItem
                  // }
                  this.reportTableVal[id] = {
                    ...nodeItem
                  };
                  reportSkuVal[id] = {
                    ...nodeItem,
                    num: ""
                  };
                  this.nodeReportTableVal[id] = {
                    ...nodeItem,
                    num: "",
                    finishNum: ""
                  };
                  this.copySkuVal[id] = {
                    ...nodeItem
                  };
                }
              }
            }
            this.reportSkuVal = reportSkuVal;
          }
          /**
           * 文件名称 OrderDetailed.vue
           * 当前行号 2053
           * 创建用户 dengshen
           * 创建时间 2017-38-27 05:38:45
           * 功能描述 获取数据完成后把ID转换为name
           */
          _this.leadersIdToName();

          // _this.leaderIdsAlert = JSON.parse(JSON.stringify(_this.leaderIds))
          // this.handleFilterSkuData(0);
          this.fetchFactoryMissionOpLogPage(missionId, _this.nodeID);
          _this.staticNodeIds.push(res.data.nodeId);
          this.routeInstanceWorkflowId = "";
        });
        //获取所有的工位列表
        let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
        let lastLogin = JSON.parse(sessionStorage.getItem("last_login"));

        let getWorkerList = {
          facIds: [],
          keyword: "",
          token: "",
          userId: this.userId
        };
        getWorkerList.facIds.push(lastLogin.id);
        _this.getWorkerListParams = getWorkerList;
        getWorkbayList(getWorkerList).then(res => {
          _this.workerOptions = res.data.data;
          //_this.workerList = res.data.data
          //console.log(res, '---------所有的工位');
        });
        let PersonListParams = {
          unitId: JSON.parse(sessionStorage.getItem("last_login")).id
        };
        _this.getPersonListParams = PersonListParams;
        getPersonList(PersonListParams).then(res => {
          //console.log(res, '-------新列表');
          _this.workerList = res.data;
        });
        /**
         *
         * @type {{facId: 必须, missionId: 必须, taskInstanceWorkflowId: 节点ID警报/工单警报}}
         */
        let getMessageParams = {
          facId: last_login.id,
          missionId: missionId,
          taskInstanceWorkflowId: val
        };
        _this.getMessageParams = getMessageParams;
        getMessageByMissionId(getMessageParams).then(res => {
          console.log(res, "全部的警报信息");
          _this.MessageByMission = res.data;
        });
      } else if (type == "goToDetailed") {
        console.log(
          "当前在 OrderDetailed 第 2244 行 instanceWorkflowId->",
          val
        );

        _this.isEditNodeInfo = false; //每次点击首先展示节点查看状态

        let instanceWorkflowId = val
          ? val
          : JSON.parse(sessionStorage.getItem("node_workflowId"))
            ? JSON.parse(sessionStorage.getItem("node_workflowId")).id
            : "";

        _this.currentNodeName = "";
        _this.currentNodeInstanceId = "";
        _this.nodeDetailLoding = true;
        // this.detailed = false; //显示节点详情
        let facInfo = JSON.parse(sessionStorage.getItem("last_login")).id;
        let missionId = JSON.parse(sessionStorage.getItem("order_detailed"))
          .missionId;
        let last_login = JSON.parse(sessionStorage.getItem("last_login"));
        /**
         *
         * @type {{facId, missionId, instanceWorkflowId: *}}
         */
        let params = {
          facId: last_login.id,
          missionId: missionId,
          instanceWorkflowId: instanceWorkflowId
        };
        /**
         * @description
         * 保存当前的节点参数 , 给后面刷新时提供参数
         */
        _this.TaskInstanceWorkflow = params;
        console.log("当前在 OrderDetailed 第 2298 行 获取节点 的参数", params);
        if (params.instanceWorkflowId) {
          getTaskInstanceWorkflow(params).then(async res => {
            console.log(res, "某个节点的详细情况11111");
            _this.currentNodeName = res.data.nodeName;
            _this.currentNodeInstanceId = res.data.id;
            _this.instanceWorkflow = res.data;
            _this.staticPersonIds = [];
            _this.staticNodeIds = [];
            _this.leaderIds = [];
            _this.nodesList.push({
              nodeName: res.data.nodeName,
              nodeId: res.data.nodeId
            });
            if (!this.routeInstanceWorkflowId) {
              this.fetchMessageList(_this.nodeID);
            }
            _this.taskInstanceWorkFlowIds = val;
            for (let i = 0; i < res.data.leaders.length; i++) {
              if (!_this.leaderIds.includes(res.data.leaders[i].userId)) {
                _this.leaderIds.push(res.data.leaders[i].userId);
              }
              // _this.leaderIds.push(res.data.leaders[i].userName)
              if (!_this.leaderIdsAlert.includes(res.data.leaders[i].userId)) {
                _this.leaderIdsAlert.push(res.data.leaders[i].userId);
              }
              // _this.leaderIdsAlert.push(res.data.leaders[i].userName)
              // _this.reportFrom['leaders'].push(res.data.leaders[i].userId);
              _this.staticPersonIds.push(res.data.leaders[i].userId);
            }
            // _this.reportFrom['leaders'].push(userId);
            if (!_this.leaderIdsAlert.includes(userId)) {
              _this.leaderIdsAlert.push(userId);
            }
            if (res.data["nodeSKUList"]) {
              const skuList = await this.fetchGoodSku(res.data.goodsId);
              this.reportTableData = this.regroupTaleData(skuList);
              const reportSkuVal = {};
              for (let nodeItem of res.data["nodeSKUList"]) {
                for (let skuItem of skuList) {
                  if (nodeItem.skuId === skuItem.id) {
                    const id = `${skuItem.color_id}-${skuItem.size_id}${
                      skuItem.standard_id ? "-" + skuItem.standard_id : ""
                    }`;
                    // this.skuVal[id] = {
                    //     ...nodeItem
                    // }
                    this.reportTableVal[id] = {
                      ...nodeItem
                    };
                    reportSkuVal[id] = {
                      ...nodeItem,
                      num: ""
                    };
                    this.nodeReportTableVal[id] = {
                      ...nodeItem,
                      num: "",
                      finishNum: ""
                    };
                    this.copySkuVal[id] = {
                      ...nodeItem
                    };
                  }
                }
              }
              this.reportSkuVal = reportSkuVal;
            }
            /**
             * 文件名称 OrderDetailed.vue
             * 当前行号 2317
             * 创建用户 dengshen
             * 创建时间 2017-39-28 11:39:22
             * 功能描述 点击小图标时也需要调用ID转换为name
             */

            _this.leadersIdToName();
            //                        console.log(_this.currentNodeName);
            // _this.leaderIdsAlert = JSON.parse(JSON.stringify(_this.leaderIds))
            this.handleFilterSkuData(0);
            this.fetchFactoryMissionOpLogPage(missionId, _this.nodeID);
            _this.staticNodeIds.push(res.data.nodeId);
            this.routeInstanceWorkflowId = "";
          });
        }
        //获取所有的工位列表
        let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
        let lastLogin = JSON.parse(sessionStorage.getItem("last_login"));

        let getWorkerList = {
          facIds: [],
          keyword: "",
          token: "",
          userId: this.userId
        };
        getWorkerList.facIds.push(lastLogin.id);
        getWorkbayList(getWorkerList).then(res => {
          _this.workerOptions = res.data.data;
          //_this.workerList = res.data.data
          //console.log(res, '---------所有的工位');
        });
        getPersonList({ unitId: lastLogin.id }).then(res => {
          //console.log(res, '-------新列表');
          _this.workerList = res.data;
        });
        /**
         *
         * @type {{facId: 必须, missionId: 必须, taskInstanceWorkflowId: 节点ID警报/工单警报}}
         */
        let getMessageParams = {
          facId: facInfo.unitId,
          missionId: missionId,
          taskInstanceWorkflowId: val
        };
        getMessageByMissionId(getMessageParams).then(res => {
          //console.log(res, '全部的警报信息');
          _this.MessageByMission = res.data;
        });

        if (val) {
          sessionStorage.setItem(
            "node_workflowId",
            JSON.stringify({ id: val })
          );
        }

        this.refresh(); //刷新
      }
    },
    // 获取动态节点
    fetchFactoryMissionOpLogPage(missionId, instanceWorkflowId) {
      let getMissonNodeLog = {
        missionId: missionId,
        instanceWorkflowId: instanceWorkflowId,
        pageNo: 1,
        pageSize: 20
      };
      queryFactoryMissionOpLogPage(getMissonNodeLog).then(res => {
        if (res.data.recordCount > 0) {
          this.isLog = true;
          res = this.regroupFactoryMissionOpLogList(res);
          this.factoryMissionOpLogList = res.data;
        }
      });
    },
    regroupFactoryMissionOpLogList(res) {
      res.data["factoryMissionOpLogList"].map(item => {
        const _date = new Date(item.opAt.replace(/-/g, "/"));
        const creatAt = new Date(item.createAt.replace(/-/g, "/"));
        item.opAt = Utils.formatDate(_date, "yyyy.MM.dd hh:mm");
        item.createAt = Utils.formatDate(creatAt, "yyyy.MM.dd hh:mm");
        if (item.newRecord.includes("nowReportData") && item.type === 1) {
          item.isExpand = false;
          item.allCollapse = false;
          item.delExpand = false;
          item.isRecordExpand = false;
          item.newRecord = JSON.parse(item.newRecord + "");
          //console.log(item.newRecord)
          const finishAt = new Date(
            item.newRecord["nowReportData"].finishAt &&
              item.newRecord["nowReportData"].finishAt.replace(/-/g, "/")
          );
          item.finishAt =
            item.newRecord["nowReportData"].finishAt &&
            Utils.formatDate(finishAt, "yyyy-MM-dd");
          const nowSku = item.newRecord.nowReportData.sku;
          item.reportTableVal = this.setNodeTableVal(
            this.nodeReportTableVal,
            nowSku
          );
          if (item.newRecord.historyReportData.length) {
            item.newRecord.historyReportData.map(historyItem => {
              const historySku = historyItem["sku"];
              historyItem.reportTableVal = this.setNodeTableVal(
                this.nodeReportTableVal,
                historySku
              );
            });
          }
          if (item.newRecord.compareReportData.length) {
            item.newRecord.compareReportData.map(compareItem => {
              compareItem.isExpand = false;
              const compareSku = compareItem["sku"];
              compareItem.reportTableVal = this.setNodeTableVal(
                this.nodeReportTableVal,
                compareSku,
                "compareReportData"
              );
            });
          }
        } else if (item.newRecord.includes("sku") && item.type === 2) {
          item.isExpand = false;
          item.newRecord = JSON.parse(item.newRecord);
          item.oldRecord =
            item.oldRecord.includes("sku") && JSON.parse(item.oldRecord);
          const nowSku = item.newRecord.sku;
          const oldSku = item.oldRecord.sku;
          item.newReportTableVal = this.setNodeTableVal(
            this.nodeReportTableVal,
            nowSku
          );
          item.oldReportTableVal = this.setNodeTableVal(
            this.nodeReportTableVal,
            oldSku
          );
        }
      });
      //console.log(res)
      return res;
    },
    setNodeTableVal(obj, sku, objName) {
      obj = JSON.parse(JSON.stringify(obj));
      for (let skuItem of sku) {
        for (let key in obj) {
          if (obj[key].skuId === skuItem.skuId && skuItem.num != 0) {
            obj[key].finishNum = skuItem.num;
            if (objName === "compareReportData") {
              obj[key].finishNum =
                skuItem.num > 0 ? "+" + skuItem.num : skuItem.num;
            }
          }
        }
      }
      return obj;
    },
    countAddReportNum(sku) {
      let num = 0;
      for (let skuItem of sku) {
        num += Number(skuItem.num);
      }
      return num;
    },
    regroupTaleData(skuList) {
      let colors = [],
        lengths = [],
        sizes = [],
        json = {};
      for (let item of skuList) {
        if (!json[item.color_name]) {
          colors.push({
            name: item.color_name,
            id: item.color_id
          });
          json[item.color_name] = item.color_name;
        }
        if (!json[item.size_value]) {
          sizes.push({
            value: item.size_value,
            id: item.size_id
          });
          //console.log(sizes)
          json[item.size_value] = item.size_value;
        }
        if (item.standard_id && !json[item.standard_id]) {
          lengths.push({
            value: item.standard_value || "无",
            id: item.standard_id
          });
          json[item.standard_id] = item.standard_id;
        }
      }
      return {
        colors: colors,
        lengths: lengths,
        sizes: sizes
      };
    },
    back() {
      this.$router.push("/workorders");
    },
    getOrderData(missionId) {
      var _this = this;
      _this.isLoading = true;
      _this.orderDataLoading = true;
      _this.nodeDetailLoding = true;
      const params = {
        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
        missionId:
          missionId ||
          JSON.parse(sessionStorage.getItem("order_detailed")).missionId,
        // "missionId": JSON.parse(sessionStorage.getItem('order_detailed')).missionId,
        opType: ""
      };
      getFacMissionNodeInfoListById(params).then(res => {
        console.log(
          "当前在 OrderDetailed 第 2565 行 nodeList 主要的数据",
          res.data.missionNodeList
        );

        if (res.data.code == 0) {
          _this.nodeList = res.data.missionNodeList;
          _this.statusList = res.data.workflowStatusNumList;
          for (let item of res.data.workflowStatusNumList) {
            this.nodeStatus[item.status] = item.number;
          }
          if (this.routeInstanceWorkflowId) {
            this.toggleDisplay("go", this.routeInstanceWorkflowId);
          }
          // this.getGoods(res.data.instanceId);
          //console.log(this.nodeStatus, '节点实例的详细信息');
          //console.log(res, '单个工单的信息');
        } else {
          _this.$message({
            showClose: true,
            message: "后台返回数据有误",
            type: "error",
            duration: this.$globalConfig.elementUI.duration
          });
        }
      });
      getFacMission(params).then(async res => {
        //console.log(res, '工单的详细信息');
        res = this.getFileList(res);
        _this.isLoading = false;
        _this.orderDataLoading = false;
        _this.nodeDetailLoding = false;
        _this.orderData = res.data;
        _this.missionDetailsList = res.data.missionDetailsList;
        const params1 = {
          goodsId: res.data.goodsId,
          token: ""
        };
        const skuList = await this.fetchGoodSku(res.data.goodsId);
        this.tableData3 = this.regroupTaleData(skuList);
        //console.log(this.tableData3);
        const obj = { ...this.skuVal };

        /**
         * @description 编辑货品新增属性赋值
         * @author 我帮泽浩贴的代码
         */
        for (let skuItem of skuList) {
          const obj = { ...this.skuVal };
          const id = `${skuItem.color_id}-${skuItem.size_id}${
            skuItem.standard_id ? "-" + skuItem.standard_id : ""
          }`;
          this.skuVal[id] = {
            num: 0
          };
          for (let nodeItem of _this.missionDetailsList) {
            if (nodeItem.skuId === skuItem.id) {
              const id = `${skuItem.color_id}-${skuItem.size_id}${
                skuItem.standard_id ? "-" + skuItem.standard_id : ""
              }`;
              this.skuVal[id] = {
                num: nodeItem.num
              };
            }
          }
        }
        // getGoodSkuList(params1).then(res => {
        //     //console.log('sku', res);
        //     this.skuList = res.data;
        //     //console.log(this.skuList, "skuList");
        //     // this.skuVal = {};
        //     this.skuList.map(item => {
        //         const _idStr = `${item.color_id}-${item.size_id}${item.standard_id ? '-' + item.standard_id : ''}`
        //         this.skuVal[_idStr] = {
        //             quantity: ''
        //         }
        //     });
        // });
      });
    },
    getFileList(res) {
      res.data.imgList = [];
      res.data.fileList = [];
      res.data["missionAttachment"].map(item => {
        if (item.type === 0) {
          res.data.imgList.push(item);
        } else {
          res.data.fileList.push(item);
        }
      });
      return res;
    },
    // getGoods(instanceWorkflowId) {
    //     var userInfo = JSON.parse(sessionStorage.getItem('last_login'))
    //     let params = {
    //             "facId": userInfo.id,
    //             "missionId": JSON.parse(sessionStorage.getItem('order_detailed')).missionId,
    //             "instanceWorkflowId": instanceWorkflowId
    //         }
    //         getTaskInstanceWorkflow(params).then(async res => {
    //             //console.log(res, '===============')
    //             if (res.data['nodeSKUList']) {
    //                 const skuList = await this.fetchGoodSku(res.data.goodsId);
    //                 this.tableData3 = this.regroupTaleData(skuList);
    //                 for (let nodeItem of res.data['nodeSKUList']) {
    //                     for (let skuItem of skuList) {
    //                         if (nodeItem.skuId === skuItem.id) {
    //                             const id = `${skuItem.color_id}-${skuItem.size_id}${skuItem.standard_id ? '-' + skuItem.standard_id : ''}`;
    //                             this.skuVal[id] = {
    //                                 ...nodeItem
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    // },
    setSkuVal(obj) {
      const idStr = `${obj.color_id}-${obj.size_id}${
        obj.length_id ? "-" + obj.length_id : ""
      }`;
      this.skuVal = obj.tableVal;
    },
    // 修改数量型动态节点table
    editReport(item) {
      //console.log(item)
      this.addReportVisible = true;
      this.updataOptions = {
        targetId: item.targetId,
        id: item.id
      };
      this.setEditReportVal(item.reportTableVal);
    },
    setEditReportVal(obj) {
      let objVal = { ...this.reportSkuVal };
      for (let key in objVal) {
        if (obj.hasOwnProperty(key)) {
          objVal[key].num = obj[key].finishNum;
        }
      }
      this.reportSkuVal = objVal;
    },
    cancelAddReport() {
      this.addReportVisible = false;
      this.initReportVal();
      this.refresh();
    },
    handleAddReport(val) {
      if (!this.checkAddReportSku()) {
        this.$message.error("上报数量不能全部为0！");
        return;
      }
      if (!this.reportFrom.finishUserId) {
        this.$message.error("请选择完成人员！");
        return;
      }
      const params = {
        userId: this.userId,
        instanceWorkflowId: this.nodeID,
        reportDetail: {
          finishAt: this.reportFrom.endAt,
          relateUserIds: this.reportFrom.leaders,
          sku: this.getSkuParams(this.reportSkuVal),
          finishUserId: this.reportFrom.finishUserId
        }
      };
      if (this.updataOptions.targetId) {
        params.targetId = this.updataOptions["targetId"];
        params.id = this.updataOptions["id"];
        this.updataReportDetail(params);
        return;
      }
      this.addReportDetail(params, val);
      /**
       * @description
       * 编辑状态点击上报清空负责人
       */
      this.init();
    },
    checkAddReportSku() {
      const sku = this.getSkuParams(this.reportSkuVal);
      const isNoNull = sku.some(item => {
        return item.num > 0;
      });
      if (isNoNull) return true;
      return false;
    },
    initReportVal() {
      const obj = { ...this.reportSkuVal };
      for (let key in obj) {
        obj[key].num = "";
      }
      this.reportSkuVal = obj;
      this.reportFrom["endAt"] = "";
      this.reportFrom["finishUserId"] = "";
    },
    getSkuParams(skuValObj) {
      const arr = [];
      for (let key in skuValObj) {
        if (skuValObj[key].num) {
          const obj = {
            skuId: skuValObj[key].skuId,
            num: skuValObj[key].num
          };
          arr.push(obj);
        }
      }
      return arr;
    },
    pickerReportEndAt(val) {
      this.reportFrom.endAt = val;
    },
    setReportVal(opt) {
      if (opt.tableVal[opt.skuId].num < 0) opt.tableVal[opt.skuId].num = 0;
      this.reportSkuVal[opt.skuId].num = opt.tableVal[opt.skuId].num;
    },
    setReportOnce(colorItem, tableVal, onceOptions) {
      /**
       * 文件名称 OrderDetailed.vue
       * 当前行号 2705
       * 创建用户 dengshen
       * 创建时间 2017-43-02 01:43:53
       * 功能描述 一手功能 , 当输入一手时给当前颜色的所有规格都填上和一手相同的数量
       */

      /**
       * reportTableData 需要提交的数据?
       * reportSkuVal  赋值?
       */

      for (let key in this.reportSkuVal) {
        if (
          onceOptions &&
          key.includes(colorItem.id) &&
          key.includes(onceOptions.id)
        ) {
          this.reportSkuVal[key].num = onceOptions.target;
        } else if (!onceOptions && key.includes(colorItem.id)) {
          this.reportSkuVal[key].num = colorItem.target;
        }
        // if (obj.includes(colorItem.id)) {
        //赋值成功
        // 	this.reportSkuVal[obj].num = colorItem.target;
        // }
      }

      // for (let sku in tableVal) {
      // 	if (sku.includes(colorItem.id)) {
      // 		tableVal[sku].num = colorItem.target;
      // 	}
      // }
    },
    addReportSuccess() {
      const obj = { ...this.copySkuVal };
      for (let reportKey in this.reportSkuVal) {
        obj[reportKey].finishNum += Number(this.reportSkuVal[reportKey].num);
      }
      // obj = this.reportTableVal;
      // this.reportTableVal = {};
      this.copySkuVal = obj;
      this.reportTableVal = { ...this.copySkuVal };
      // this.handleFilterSkuData(this.skuRadio);
      this.initReportVal();
    },
    addReportDetail(params, val) {
      addReportDataDetail(params).then(res => {
        this.addReportVisible = false;
        // this.skuVal = this.reportSkuVal;
        if (res.data.code === 0) {
          // this.$message.success("上报成功");
          this.addReportSuccess();
          this.refresh();
          //二次刷新
          //this.updteData(val);
        } else {
          this.$message.error("上报失败");
        }
      });
    },
    updataReportDetail(params) {
      updateReportDataDetail(params).then(res => {
        // this.skuVal = this.reportSkuVal;
        this.updataReportTargetId = "";
        if (res.data.code === 0) {
          this.addReportVisible = false;
          //this.toggleDisplay("go", this.nodeID);
          this.$message.success("修改成功");
          this.refresh();
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    handleFilterSkuData(val) {
      this.reportTableVal = { ...this.filterSkuVal(val) };
      this.unDoneNum = this.countUnDone(this.reportTableVal);
    },
    countUnDone(obj) {
      let num = 0;
      for (let key in obj) {
        num += obj[key].finishNum;
      }
      return num;
    },
    filterSkuVal(type) {
      let newSkuVal = {};
      if (type === "all") {
        return this.copySkuVal;
      }
      for (let key in this.copySkuVal) {
        const finishNum = this.copySkuVal[key].finishNum;
        const num = this.copySkuVal[key].num;
        if (!type) {
          return this.copySkuVal;
        } else {
          if (
            finishNum < num ||
            this.copySkuVal[key].num - this.copySkuVal[key].finishNum < 0 ||
            this.copySkuVal[key].num == this.copySkuVal[key].finishNum
          ) {
            const _finishNum =
              this.copySkuVal[key].num - this.copySkuVal[key].finishNum < 0
                ? 0
                : this.copySkuVal[key].num - this.copySkuVal[key].finishNum;
            newSkuVal[key] = {
              num: this.copySkuVal[key].num,
              finishNum: _finishNum
            };
          } else {
            newSkuVal[key] = {
              num: this.copySkuVal[key].num,
              finishNum: this.copySkuVal[key].finishNum
            };
          }
        }
      }
      return newSkuVal;
    },
    handleSelectNode(item) {
      this.fetchPersonListByNodeId(item.instanceWorkflowId).then(res => {
        for (let idItem of res.data) {
          const has = this.staticPersonIds.some(item => {
            return item === idItem;
          });
          if (!has) {
            this.staticPersonIds.push(idItem);
          }
        }
      });
    },
    // 根据节点id获取关联人员
    fetchPersonListByNodeId(taskInstanceWorkflowId) {
      const params = {
        taskInstanceWorkflowId: taskInstanceWorkflowId
      };
      return getLeadersOfNode(params).then(res => {
        return res;
      });
    },
    fetchGoodSku(goodsId) {
      const params = {
        goodsId: goodsId
      };
      return getGoodSkuList(params).then(res => {
        return res.data;
      });
    },
    async fetchSkuList() {
      this.skuList = await this.fetchGoodSku(this.orderData.goodsId);
      this.skuVal = {};
      this.skuList.map(item => {
        const _idStr = `${item.color_id}-${item.size_id}${
          item.standard_id ? "-" + item.standard_id : ""
        }`;
        this.skuVal[_idStr] = {
          num: ""
        };
      });
      //  this.addMissionInfo.orderdetail = []
      for (var i = 0; i < this.missionDetailsList.length; i++) {
        for (var j = 0; j < this.skuList.length; j++) {
          if (this.missionDetailsList[i].skuId == this.skuList[j].id) {
            for (let item in this.skuVal) {
              var skuSplit = item.split("-");
              if (this.skuList[0].standard_id) {
                if (this.skuList[j].color_id == skuSplit[0]) {
                  if (this.skuList[j].size_id == skuSplit[1]) {
                    if (this.skuList[j].standard_id) {
                      if (this.skuList[j].standard_id == skuSplit[2]) {
                        this.skuVal[item].num = this.missionDetailsList[i].num;
                      }
                    } else {
                    }
                  }
                }
              } else {
                if (this.skuList[j].color_id == skuSplit[0]) {
                  if (this.skuList[j].size_id == skuSplit[1]) {
                    this.skuVal[item].num = this.missionDetailsList[i].num;
                  }
                }
              }
            }
          }
        }
      }
    },
    handleSeclectNodeId(val) {
      this.fetchMessageList(val);
    },
    loadMoreMessage() {
      let isLoading = false;
      if (isLoading || this.isNoMessagaMore) return;
      isLoading = true;
      this.loadMessageIndex++;
      this.loading = true;
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: this.userId,
        missionId: this.missionId,
        taskInstanceWorkFlowIds: this.taskInstanceWorkFlowIds
          ? [this.taskInstanceWorkFlowIds]
          : [],
        isAlert: this.isAlert,
        isMe: this.isMe,
        hasPic: this.isImg_File,
        pageNo: this.loadMessageIndex,
        pageSize: 30
      };
      getMessageList(params).then(res => {
        isLoading = false;
        this.loading = false;
        const oldHeight = this.$refs["scroll-view"].scrollHeight;
        // this.msgLoading = false;
        if (!res.length || res.length < 30) {
          this.isNoMessagaMore = true;
        }
        res.data = res.data.reverse();
        this.messageList = res.data.concat(this.messageList);
        this.$nextTick(() => {
          if (res.data.length) {
            const newHeight = this.$refs["scroll-view"].scrollHeight;
            this.$refs["scroll-view"].scrollTop = newHeight - oldHeight;
          }
        });
      });
    },
    initScrollTop() {
      let container = this.$el.querySelector("#chatContainerOrder");
      container.scrollTop = container.scrollHeight;
    },
    // 获取消息列表
    fetchMessageList(taskInstanceWorkFlowIds) {
      this.msgLoading = true;
      this.isNoMessagaMore = false;
      this.missionId = JSON.parse(
        sessionStorage.getItem("order_detailed")
      ).missionId;
      let FlowIds = "";
      if (
        taskInstanceWorkFlowIds &&
        typeof taskInstanceWorkFlowIds !== "object"
      ) {
        FlowIds = taskInstanceWorkFlowIds;
      }
      const unitId = JSON.parse(sessionStorage.getItem("last_login")).id;
      const params = {
        unitId: unitId,
        userId: this.userId,
        missionId: this.missionId,
        taskInstanceWorkFlowIds: FlowIds ? [FlowIds] : [],
        isAlert: this.isAlert,
        isMe: this.isMe,
        hasPic: this.isImg_File,
        pageNo: 1,
        pageSize: 30
      };
      getMessageList(params).then(res => {
        // this.showCenter = true;
        // this.showRight = true;
        this.messageList = [];
        this.msgLoading = false;
        res.data = res.data.reverse();
        if (res.data.length) res.data[0].isFirst = true;
        this.messageList = res.data.concat(this.messageList);
        // this.msgContentShow = true;
        // this.$router.push('/serviceMission?id='+ this.missionId)
        this.fetchNodeList(this.missionId);
        this.fetchPersonList();
        this.$nextTick(() => {
          this.initScrollTop();
        });
        // this.fetchFacMission(unitId, this.missionId);
      });
    },
    // 获取关联人员列表
    fetchPersonList() {
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id
      };
      getPersonList(params).then(res => {
        //console.log('获取关联人员列表', res.data);
        this.selectPersonList = res.data;
        this.selectPersonList.splice(0, 1);
      });
    },
    fetchNodeList() {
      const missionId =
        this.routeMissionId ||
        JSON.parse(sessionStorage.getItem("order_detailed")).missionId;
      const params = {
        missionId: missionId
      };
      getNodeList(params).then(res => {
        // //console.log('获取关联关联节点', res.data)
        this.selectNodeList = res.data;
        this.nodeOptions = res.data;
      });
    },
    // 回复添加消息
    handleReplyMessage(options) {
      this.isSubmit = false;
      const params = {
        unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
        userId: this.userId,
        missionId: JSON.parse(sessionStorage.getItem("order_detailed"))
          .missionId,
        taskInstanceWorkFlowId: "",
        ...options,
        replyMessageId: this.replyMessageId || ""
      };
      if (this.isEdit) {
        params.messageId = options.id;
        this.handleEditMessage(params);
        return;
      }
      addMessage(params).then(res => {
        if (res.data.code === 0) {
          // this.fetchMessageList(this.nodeID);
          this.$message.success("发送消息成功");
          this.isSubmit = true;
          this.resplyMsgItem = {};
          this.replyMessageId = "";
          this.fetchMessageList();
        }
      });
    },
    // 修改消息
    handleEditMessage(params) {
      editMessage(params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("修改消息成功");
          this.isEdit = false;
          this.isSubmit = true;
          this.resplyMsgItem = {};
          this.replyMessageId = "";
        }
      });
    },
    // 查看节点详情
    viewNodeDetail(item) {
      if (!item.nodeId) {
        this.$message.error("该消息未关联节点");
        return;
      }
      this.toggleDisplay("go", item.nodeId);
    },
    getMsgItem(item, isEdit) {
      if (isEdit) {
        item.isEdit = true;
        this.isEdit = true;
      }
      this.resplyMsgItem = item;
      this.replyMessageId = item.id;
      this.textFocus = !this.textFocus;
    },
    // deleteMsg
    deleteMsg(item) {
      this.$confirm("此操作将永久删除该消息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
            missionId: this.missionId,
            messageId: item.id,
            userId: this.userId
          };
          deleteMessage(params).then(res => {
            if (res.data.code === 0) {
              const index = this.messageList.findIndex(Item => {
                return Item.id === item.id;
              });
              // //console.log(index)
              this.messageList.splice(index, 1);
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.order-detailed {
  min-width: 1010px;
}

//公共颜色
.text-color-63 {
  //筛选标题
  color: #636363;
}

.text-color-2c {
  color: #2c2c2c;
}

//节点状态颜色
.wait_start {
  background-color: #f0f0f0;
  color: #2c2c2c;
  border: 1px solid #f0f0f0;
}

.ongoing {
  background-color: #1ca1ff;
  color: #fff;
  border: 1px solid #1ca1ff;
}

.finish {
  color: #fff;
  background-color: #5dd438;
  margin-right: 0;
  border: 1px solid #5dd438;
}

/*未填写样式*/
.null-color {
  color: #babdc2 !important;
}

.green {
  color: #37bd0e;
}

.red {
  color: #f03535;
}

.blue {
  color: #1f96ff;
}

.fs-16 {
  font-size: 16px;
}

.desc-color {
  color: rgb(162, 171, 184);
}

.collapse {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.node-header {
  display: flex;
  .line-weith6 {
    width: 6px;
    display: inline-block;
    height: 20px;
    background: #ff9c38;
    position: relative;
    top: 3px;
  }
}

.el-icon-arrow-down {
  color: #a2abb8;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.3s;
  &.rotate {
    transform: rotate(180deg);
  }
}

.info-list4 {
  margin-top: 16px;
  clear: both;
  .el-input {
    width: 964px;
  }
  .img_list_remark {
    min-height: 80px;
    width: 93%;
    background-color: #f7f9fc;
    margin-top: -16px;
    // margin-left: 50px;
    padding: 12px 12px 0 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .img_list_remark_img {
      display: inline-block;
      position: relative;
      margin-left: 12px;
      margin-bottom: 12px;
      .preview-mask {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.5);
        i {
          margin: auto;
          font-size: 14px;
          color: #ffffff;
        }
      }
      &:hover {
        .preview-mask {
          display: flex;
          display: -webkit-flex;
          display: -ms-flexbox;
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
    // input {
    //   position: absolute;
    //   width: 140px;
    //   left: -55px;
    //   opacity: 0;
    //   font-size: 0;
    //   cursor: pointer;
    // }
  }
  .img_list_remark {
    img {
      height: 80px;
      width: 80px;
    }
  }
  .upload-file {
    display: flex;
    justify-content: flex-start;
    .file-item {
      width: 241px;
      display: flex;
      justify-content: flex-start;
      position: relative;
      // margin-top: 8px;
      // margin-left: 12px;
      padding: 8px;
      background: #f0f1f2;
      &:first-child {
        margin-right: 32px;
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
  }
}

#order-detailed {
  .cancel {
    position: relative;
    .undone {
      text-align: center;
      width: 120px;
      height: 40px;
      line-height: 40px;
      position: absolute;
      font-size: 20px;
      right: 20px;
      top: 40px;
      transform: rotate(27deg);
      color: #666;
      padding: 0 10px;
      border: 1px solid #e0e0e0;
    }
  }
  #order-info {
    opacity: 0.8;
    color: #ccc;
    position: relative;

    .order-status {
      font-size: 16px;
      .order-status-ongoing {
        color: #ccc;
      }
      .order-status-finish {
        color: #ccc;
      }
      .order-status-delay {
        color: #ccc;
      }
    }

    .remark {
      color: #ccc !important;
    }
  }
  .order-title-title {
    color: #2c2c2c;
    font-size: 24px;
  }
  .order-num {
    color: #ccc;
  }

  .step-line {
    margin-left: 2px;
    margin-right: 2px;
    position: absolute;
    top: 30px;
    width: 70px;
    height: 2px;
    background: #ccc;
    opacity: 0.6;
  }
}

.order-detailed {
  .order-header {
    margin-bottom: 0;
  }
  .order-content {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;

    .node-info {
      margin-right: 16px;
      width: 60%;
      min-width: 550px;
      height: 1000px;
      overflow-y: auto;
      position: relative;
      .order-content-cancel {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.6;
        z-index: 10;
      }
    }
    .msg-info {
      width: 40%;
      min-width: 364px;
      height: 720px;
      overflow-y: auto;
    }

    /*头部公共样式*/
    .node-info,
    .msg-info {
      font-family: MicrosoftYaHei;
      color: #2c2c2c;
      background-color: #fff;
      box-sizing: border-box;
      .node-title,
      .msg-title {
        font-size: 20px;
        padding: 0 32px;
      }
    }
    .msg-info {
      padding: 32px 0 0 0;
    }

    /*节点详细信息*/
    .node-box {
      //节点列表
      .node-list {
        border-top: 1px solid #e6e8eb;
        height: 90px;
        padding: 29px 0px 29px 32px;
        text-align: left;
      }
      .node-date {
        text-align: right;
        color: #a2abb8;
        margin-right: 22px;
      }
      .node-type3 {
        line-height: 56px;
        box-sizing: border-box;
      }
      //节点详情
      .node-list-detailed {
        padding: 27px 32px 0 32px;

        border-top: 1px solid #e6e8eb;
        .dib {
          display: inline-block;
          margin-right: 10px;
        }
        .w60 {
          width: 56px;
        }
        .w100 {
          width: 100%;
        }
        .node-list-info {
          .el-date-editor {
            width: 240px;
          }
          .status-color {
            color: #636363;
          }
          .list-edit {
            color: #1f96ff;
            margin-left: 8px;
          }
          .text-color {
            color: #2c2c2c;
            border: 1px solid #ccc;
          }

          .change-node-status {
            display: flex;
            justify-content: flex-start;
            border-bottom: 1px solid #e6e8eb;
            margin-bottom: 0;
            padding-bottom: 24px;
            .title {
              margin-right: 12px;
            }
            .status {
              display: flex;
              span {
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 12px;
                width: 66px;
                height: 36px;
                border-radius: 2px;
                border: solid 1px #d0d2d6;
              }

              //节点状态颜色
              .wait_start {
                background-color: #f0f0f0;
                color: #2c2c2c;
                border: 1px solid #f0f0f0;
              }

              .ongoing {
                background-color: #1ca1ff;
                color: #fff;
                border: 1px solid #1ca1ff;
              }

              .finish {
                color: #fff;
                background-color: #5dd438;
                margin-right: 0;
                border: 1px solid #5dd438;
              }
            }
          }

          //编辑状态

          .node-list-edit {
            border-bottom: 1px solid #e6e8eb;
            padding-bottom: 8px;
            margin-bottom: 24px;
            //节点状态
            .info-head2 {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .title {
                width: 56px;
                margin-right: 12px;
                text-align: right;
              }

              //节点状态样式
              .content {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;

                //三个状态
                .status {
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  span {
                    display: inline-block;
                    width: 66px;
                    height: 36px;
                    line-height: 36px;
                    text-align: center;
                    border-radius: 2px;
                    margin-right: 12px;
                    &:nth-of-type(3) {
                      margin-right: 8px;
                    }
                  }
                }
              }

              //负责人和备注的样式
              .select {
                flex: 1;
                .el-select {
                  width: 100%;
                }
              }

              //开始/结束日期
              .info-data {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .content {
                  min-width: 240px;
                }
              }
            }

            //取消确认按钮
            .enter-update-btn {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 16px;
              margin-top: 8px;
              font-family: MicrosoftYaHei;
              .cancel-btn {
                font-size: 14px;
                color: #636363;
                cursor: pointer;
              }
              .enter-btn {
                font-size: 14px;
                color: #1ca1ff;
                cursor: pointer;
                margin-left: 12px;
              }
            }

            .info-data-item {
              display: flex;
              justify-content: space-between;
            }

            /*.info-head2 {*/
            /*span {*/
            /*display: inline-block;*/
            /*text-align: center;*/
            /*width: 62px;*/
            /*height: 36px;*/
            /*line-height: 36px;*/
            /*border-radius: 2px;*/
            /*margin-right: 10px;*/
            /*}*/
            /*.enter-update-btn {*/
            /*text-align: right;*/
            /*font-size: 14px;*/
            /*a {*/
            /*cursor: pointer;*/
            /*}*/
            /*.cancel-btn {*/
            /*color: #636363;*/
            /*}*/
            /*.enter-btn {*/
            /*margin-left: 16px;*/
            /*color: #1ca1ff;;*/
            /*}*/
            /*}*/
            /*}*/
            .wait_start {
              background-color: #f0f0f0;
              color: #2c2c2c;
              border: 1px solid #f0f0f0;
            }
            .ongoing {
              background-color: #1ca1ff;
              color: #fff;
              border: 1px solid #1ca1ff;
            }
            .finish {
              color: #fff;
              background-color: #5dd438;
              margin-right: 0;
              border: 1px solid #5dd438;
            }
          }
          /*.info-head3{*/

          /*.begin,.end{*/
          /*margin-right: 0;*/
          /*}*/
          /*}*/
          /*.info-head4-remark{*/
          /*display: flex;*/
          /*justify-content: flex-start;*/
          /*.w60{*/
          /*margin-right: 12px;*/
          /*}*/
          /*.remark{*/
          /*flex: 1;*/
          /*}*/
          /*}*/

          //数量型时需要和逻辑型保持一致
          .is-data {
            margin-bottom: 24px !important;
          }
          .node-list-view {
            margin-top: 8px;
            overflow: hidden;
            padding-bottom: 8px;
            border-bottom: 1px solid #e6e8eb;
            /*margin-bottom: 24px;*/

            .info-head-view {
              margin-bottom: 16px;
              .view-left {
                .view-title {
                  display: inline-block;
                  width: 70px;
                  text-align: right;
                  white-space: nowrap;
                }
                .view-content {
                  display: inline-block;
                }
              }

              .view-right {
                text-align: right;
                .edit-node-info {
                  font-size: 14px;
                  color: #1ca1ff;
                  cursor: pointer;
                }
              }

              //未填写样式
              .null-text {
                font-family: MicrosoftYaHei;
                font-size: 14px;
                color: #babdc2;
              }
            }
          }

          //警报按钮
          .warning {
            border-bottom: 1px solid #e6e8eb;
            padding-top: 24px;
            padding-bottom: 24px;
            button {
              width: 104px;
              height: 36px;
              background-color: #f55d5d;
              margin-top: 0;
            }
            .warn-list {
              margin-bottom: 10px;
              font-size: 12px;
              padding: 16px;
              // background-color: #fff5f5;
              border: solid 1px #ffd6d6;
              .warn-title {
                padding-left: 4px;
                font-size: 14px;
                color: #2c2c2c;
              }

              .warn-member {
                color: #aaaaaa;
                line-height: 24px;
              }

              .warn-tip {
                color: #e0b4b4;
                line-height: 24px;
                text-align: right;
              }
            }
          }
          .create-warn {
            margin-top: 8px;
          }
          //数量型表格
          .node-list-table {
            /*margin-bottom: 32px;*/
            .node-table-title {
              margin-bottom: -8px;
              color: #2c2c2c;
            }
            .node-list-content {
              .report-btn {
                margin-top: -6px;
              }
            }
          }
        }
      }
      //节点动态
      .node-state {
        .node-state-title {
          margin-top: 24px;
          margin-bottom: 16px;
          .fz16 {
            font-size: 16px;
            color: #2c2c2c;
          }
        }
        //动态列表
        .node-state-list {
          background-color: #fcfcfc;
          border-radius: 2px;
          margin-bottom: 10px;
          // line-height: 56px;
          padding: 16px 16px;
          border: 1px solid #e1e5eb;
          position: relative;
          .text-color {
            color: #2c2c2c;
          }
          .table-wrap {
            line-height: 16px;
          }
          svg {
            margin-right: 8px;
          }
          .list-header {
            display: flex;
            i {
              margin-left: 10px;
            }
          }
          .report-header {
            justify-content: space-between;
          }
          .list-left,
          .list-right {
            display: flex;
            align-items: center;
          }
          .list-right {
            flex: 1;
            justify-content: flex-end;
          }
          .list-handle {
            min-width: 120px;
            text-align: right;
          }
          .edit-status {
            margin-top: 13px;
          }
          .edit-detail {
            margin-top: 15px;
          }
          .opacity5 {
            opacity: 0.5;
          }
        }
        .text-color1 {
          color: #2c2c2c;
        }
        .pd-28 {
          padding-left: 28px;
        }
        .gray {
          padding-left: 25px;
          color: #808080;
        }
      }
    }

    /*消息*/
    .msg-info {
      & > .el-col {
        padding-left: 32px;
      }
      .msg-filter {
        margin-top: 14px;
        margin-bottom: 26px;
      }
      .msg-list {
        padding-right: 32px;
        border-top: 1px solid #e6e8eb;
        border-bottom: 1px solid #e6e8eb;
        padding-top: 24px;
        padding-bottom: 24px;
        .msg-head {
          .time {
            text-align: right;
            color: #a2abb8;
          }
        }
        .msg-content {
          margin-top: 8px;
        }
        .msg-foot {
          margin-top: 12px;
        }
      }
      .msg-box {
        padding: 10px;
      }
    }
  }
  /*解除警报*/
}

#about-msg {
  flex: 1;
  background: #fff;
  max-height: 1000px;
  .service-center {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .scroll-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .service-header {
    padding: 30px 16px 30px 32px;
    overflow: hidden;
    border-bottom: 1px solid #e6e8eb;
  }
  .no-more-data {
    line-height: 50px;
    color: #cccccc;
    text-align: center;
    font-size: 14px;
  }
  .content {
    flex: 1;
    overflow-y: auto;
  }
  .service-title {
    text-indent: 16px;
    font-size: 20px;
    border-left: 6px solid #ff9c38;
  }
  .filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
  }
}
</style>

<style lang="scss">
@import "~scss_vars";

.node-info {
  position: relative;
  #node-dialog {
    /*loading浮层*/
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    .loading {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        display: flex;
        flex: 0 1 auto;
        flex-direction: column;
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 25%;
        max-width: 25%;
        height: 200px;
        align-items: center;
        justify-content: center;
        .line-scale > div {
          background-color: $color-btn;
          width: 4px;
          height: 35px;
          border-radius: 2px;
          margin: 2px;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
          display: inline-block;
        }
        .line-scale > div:nth-child(1) {
          animation: line-scale 1s 0.1s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          -webkit-animation: line-scale 1s 0.1s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
        .line-scale > div:nth-child(2) {
          -webkit-animation: line-scale 1s 0.2s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          animation: line-scale 1s 0.2s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
        .line-scale > div:nth-child(3) {
          -webkit-animation: line-scale 1s 0.3s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          animation: line-scale 1s 0.3s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
        .line-scale > div:nth-child(4) {
          -webkit-animation: line-scale 1s 0.4s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          animation: line-scale 1s 0.4s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
        .line-scale > div:nth-child(5) {
          -webkit-animation: line-scale 1s 0.5s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
          animation: line-scale 1s 0.5s infinite
            cubic-bezier(0.2, 0.68, 0.18, 1.08);
        }
        @keyframes line-scale {
          0% {
            -webkit-transform: scaley(1);
            transform: scaley(1);
          }
          50% {
            -webkit-transform: scaley(0.4);
            transform: scaley(0.4);
          }
          100% {
            -webkit-transform: scaley(1);
            transform: scaley(1);
          }
        }
      }
    }
  }
}

#cancel-dialog {
  padding: 0;

  .el-dialog__header {
    padding: 0;
    height: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  /*解除*/
  .cancel-alert {
    .cancel-alert-title {
      font-size: 18px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      border-bottom: 1px solid #e6e8eb;
    }
    .cancel-content {
      font-size: 14px;
      margin-top: 32px;
      padding: 0 32px;
      textarea {
        font-size: 12px;
        height: 100px !important;
        margin-top: 4px;
        resize: none;
      }
    }

    .cancel-btns {
      // display: flex;
      // justify-content: flex-end;
      padding: 0 32px;
      margin-top: 32px;
      margin-bottom: 32px;
      text-align: right;
    }
  }
  /*添加*/
  .add-alert {
    .add-alert-title {
      font-size: 18px;
      height: 56px;
      line-height: 56px;
      text-align: center;
      border-bottom: 1px solid #e6e8eb;
    }
    .add-cancel-content {
      padding: 0 32px;
      margin-top: 32px;
      .content-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 32px;
        margin-bottom: 32px;
      }
      /*.el-col {*/
      /*display: flex;*/
      /**/
      /*}*/
    }

    .add-alert-foot {
      padding: 0 32px;
      textarea {
        resize: none;
        height: 100px;
      }
      .add-alert-btns {
        margin-top: 32px;
        text-align: right;
        padding-bottom: 30px;
        // display: flex;
        // justify-content: flex-end;
      }
    }
  }
}

.dialog-title {
  padding-bottom: 24px;
  text-align: center;
  font-size: 18px;
  color: #626b7a;
  border-bottom: 1px solid #e6e8eb;
}

.form-inline {
  display: flex;
  justify-content: space-between;
  .form-item {
    display: inline-block;
  }
  .input-wrap {
    display: inline-block;
    width: 194px;
  }
}

.form-btn {
  margin-top: 32px;
  text-align: right;
  // button {
  //     width: 72px;
  //     height: 32px;
  //     background: none;
  //     border-radius: 2px;
  //     border: solid 1px #ff9c38;
  // }
  // .cancle {
  //     color: #ff9c38
  // }
  // .sure {
  //     color: #ffffff;
  //     background: #ff9c38
  // }
}
</style>
<style lang="scss">
.order-detailed {
  .index {
    .el-dialog--small {
      background-color: transparent;
      width: 100%;
      top: 5% !important;
    }
    .el-dialog__body {
      display: flex;
      align-items: center;
      justify-content: center;
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
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Chrome/Safari/Opera */
      -khtml-user-select: none; /* Konqueror */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      user-select: none;
      width: 800px;
      img {
        max-width: 700px;
        max-height: 700px;
      }
    }
    i {
      cursor: pointer;
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
}

#alertInput1,
#alertInput2 {
  /*添加警报的输入框*/
  .el-input {
    min-width: 260px;
  }
}
</style>
