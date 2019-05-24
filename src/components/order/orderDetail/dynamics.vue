<template>
    <!--节点动态-->
    <el-row class="node-state">
        <el-col :span="24" class="node-state-title" v-if="showTitle">
            <span class="fz16">节点动态</span>
            <span class="fz17" @click="click_isshow">
            <icon w='14' h='14' style="margin-right:4px;" type="icon-all_dynamic"></icon>查看全部动态</span>
        </el-col>
        <el-col 
        :span="24"
        v-for="(item, index) in factoryMissionOpLogList"
        :key="index">
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-jiedianjingbao-da"></icon>
                            <span>{{item.newRecord}}</span>
                        </div>
                        <div class="list-right">
                            <span class="node-date">{{item.opAt | filterDate}}</span>
                        </div>
                    </div>
                </el-col>
            </el-col>
            <!--1数据型上报二维矩阵-->
            <el-col :span="24" class="node-state-list" v-if="item.type==1">
                <!--最新记录-->

                <el-col :span="24" @mouseover.native="showEdit(item)"
                        @mouseout.native="showEdit(item)">
                    <div class="list-header">
                        <!---->
                        <div class="list-left">
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <span class="text-color1">{{item.userName}}：</span>
                            <p class="appear-num">
                                <!-- 上报数量 {{item.newRecord.nowReportData.totalNum}} -->
                                {{item.newRecord}}
                                <span v-if="item.reportDelFlag"
                                        style="padding: 2px 8px;border: 1px solid #A0ACBD;color: #A0ACBD;">已撤销</span>
                            </p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="!item.reportDelFlag"
                                    v-show="!item.isExpand">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>
                            <!--撤销-->
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="item.reportDelFlag == true">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>

                            <!-- <div class="list-handle"
                                    v-if="!item.reportDelFlag"
                                    style="color: #a2abb8;text-align: right;"
                                    v-show="item.isExpand">
                                    <span style="cursor: pointer;" @click="deleteTeble(item)">撤销</span>
                                <span style="color: #1f96ff; font-size: 14px;cursor: pointer;margin-left: 20px;" @click="editReport(item)">修改</span>
                            </div>
                            <i class="el-icon-arrow-down" @click="toggleDisplayAll(item)"
                                :class="{'rotate': item.allCollapse}"></i> -->
                        </div>
                    </div>


                </el-col>
                <!-- item.allCollapse -->
                <section v-if="false">
                    <!--上报表格-->
                    <el-col :span="24" style="line-height: 26px;margin-top: 15px">
                        <div class="list-header report-header">
                            <!-- <div class="gray">关联人员: <span
                                    v-for="(p,index) in item.newRecord.nowReportData.relateUserNames">{{p}}&nbsp;&nbsp;</span>
                            </div> -->
                            <div class="gray">完成人员： <span>{{ item.newRecord.nowReportData.finishUsername }}</span>
                            </div>
                            
                            <div class="node-date">
                                完成日期:{{item.finishAt | filterDate}}
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24" :class="{'opacity5':item.reportDelFlag}">
                        <service-table
                                class="table-cancel"
                                v-if="reportTableData.colors && reportTableData.colors.length"
                                :tableData="reportTableData"
                                :isNode="true"
                                :skuVal="item.reportTableVal"></service-table>
                    </el-col>
                    <el-col :span="24" v-if="item.newRecord.historyReportData[0]"
                            :class="{'opacity5':item.reportDelFlag}"
                            style="line-height: 26px;border-top: 1px solid #e1e5eb;padding-top: 16px;">
                        <el-col class="collapse gray">修改记录
                            <i class="el-icon-arrow-down"
                                @click="toggleRecordTable(index)"
                                :class="{'rotate': item.isRecordExpand}"></i>
                        </el-col>
                        <!-- <el-col class="collapse">修改记录
                        </el-col> -->
                        <el-col :span="24" v-if="item.newRecord.historyReportData[0]"
                                v-show="item.isRecordExpand">
                            <div class="gray">
                                第一次上报数量：{{item.newRecord.historyReportData[0].totalNum}}
                            </div>
                            <service-table
                                    v-if="reportTableData.colors && reportTableData.colors.length"
                                    :tableData="reportTableData"
                                    :isNode="true"
                                    :skuVal="item.newRecord.historyReportData[0].reportTableVal"></service-table>
                        </el-col>
                        <!--修改记录-->
                        <el-col :span="24"
                                v-if="item.newRecord.compareReportData.length"
                                v-for="(compareItem, compareIndex) in item.newRecord.compareReportData"
                                :key="compareIndex"
                                v-show="item.isRecordExpand"
                                style="line-height: 26px;border-top: 1px solid #e1e5eb;padding-top: 16px;">
                            <!-- <el-col class="collapse">修改记录
                            </el-col> -->
                            <!-- <el-col class="collapse">修改记录<i class="el-icon-arrow-down" @click="toggleRecordTable(index, compareIndex)" :class="{'rotate': compareItem.isExpand}"></i>
                            </el-col> -->
                            <!-- <el-col>修改记录</el-col> -->
                            <el-col :span="24">
                                <div style="overflow: hidden">
                                    <el-col :span="18" class="gray">
                                        {{compareItem.username}}: 将此上报记录数量修改为
                                        {{compareItem.totalNum}}
                                    </el-col>
                                    <el-col :span="6"
                                            style="color: #a2abb8;text-align: right">
                                        {{compareItem.reportAt | filterDate}}
                                    </el-col>
                                </div>
                                <service-table
                                        v-if="reportTableData.colors && reportTableData.colors.length"
                                        :tableData="reportTableData"
                                        :isNode="true"
                                        :skuVal="compareItem.reportTableVal"></service-table>
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <span style="white-space:nowrap;" class="text-color1">{{item.userName}}：</span>
                            <p>将工单订货数量从 {{item.oldRecord.total}} 修改为
                                {{item.newRecord.total}}，节点目标数量随之变化</p>
                        </div>
                        <div class="list-right" style="color: #a2abb8;">
                            <div class="list-handle">
                                {{item.createAt | filterDate}}
                            </div>
                            <i class="el-icon-arrow-down" :class="{'rotate': item.isExpand}"
                                @click="item.isExpand = !item.isExpand"></i>
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
                        <service-table
                                v-if="reportTableData.colors && reportTableData.colors.length"
                                :tableData="reportTableData"
                                :isNode="true"
                                :skuVal="item.oldReportTableVal"></service-table>
                    </el-col>
                    <el-col class="edit-status" :span="24">
                        修改后数量：{{item.newRecord.total}}
                    </el-col>
                    <el-col :span="24">
                        <service-table
                                v-if="reportTableData.colors && reportTableData.colors.length"
                                :tableData="reportTableData"
                                :isNode="true"
                                :skuVal="item.newReportTableVal"></service-table>

                    </el-col>
                </section>
            </el-col>
            <!-- 3节点字段修改-->
            <el-col :span="24" class="node-state-list" v-if="item.type==3">
                <el-col :span="24" class="list-content">
                    <!---->
                    <div class="list-header">
                        <div class="list-left">
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
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
                                {{item.opAt | filterDate}}
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-jiechujingbao"></icon>
                            <p class="text-color1">{{item.userName}}：解除警报</p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle">
                                <span class="node-date">{{item.opAt | filterDate}}</span>
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-dongtaijingbao"></icon>
                            <p class="text-color1">{{item.userName}}：添加警报</p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle node-date">
                                {{item.opAt | filterDate}}
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <p class="text-color1">{{item.userName}}:{{item.field}}
                            </p>
                            <p>{{item.newRecord}}</p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle node-date">
                                {{item.opAt | filterDate}}
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
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <span class="text-color1">{{item.userName}}： {{item.field}}</span>

                        </div>
                        <div class="list-right">
                            <div class="list-headle node-date">{{item.opAt | filterDate}}</div>
                        </div>
                    </div>
                </el-col>
                <el-col class="edit-detail pd-28 gray" :span="24" style="line-height: 28px">
                    <span v-html="item.newRecord"></span>
                </el-col>
            </el-col>
            <!--8质检点上报二维矩阵-->
            <el-col :span="24" class="node-state-list" v-if="item.type==8">
                <!--最新记录-->
                <el-col :span="24" @mouseover.native="showEdit(item)"
                        @mouseout.native="showEdit(item)">
                    <div class="list-header">
                        <!---->
                        <div class="list-left">
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <span class="text-color1">{{item.userName}}：</span>
                            <p class="appear-num">
                                上报合格品 
                                {{ item.newRecord.nowReportData.qualifiedNum }} 件
                                次品 {{ item.newRecord.nowReportData.defectiveNum }} 件,
                                废品 {{ item.newRecord.nowReportData.wastedNum }} 件
                                <span v-if="item.reportDelFlag"
                                        style="padding: 2px 8px;border: 1px solid #A0ACBD;color: #A0ACBD;">已撤销</span>
                            </p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="!item.reportDelFlag"
                                    v-show="!item.isExpand">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>
                            <!--撤销-->
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="item.reportDelFlag == true">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>

                            <div class="list-handle"
                                    v-if="!item.reportDelFlag"
                                    style="color: #a2abb8;text-align: right;"
                                    v-show="item.isExpand">
                                <span style="cursor: pointer;"
                                    @click="deleteTeble(item)">撤销</span>
                                <span style="color: #1f96ff; font-size: 14px;cursor: pointer;margin-left: 20px;"
                                        @click="editReport(item)">修改</span>
                            </div>
                            <i class="el-icon-arrow-down" @click="toggleDisplayAll(item)"
                                :class="{'rotate': item.allCollapse}"></i>
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
                            <div class="gray">完成人员： <span>{{ item.newRecord.nowReportData.finishUsername }}</span>
                            </div>
                            
                            <div class="node-date">
                                完成日期:{{ item.newRecord.nowReportData.finishAt | filterDate}}
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24" :class="{'opacity5': item.reportDelFlag}">
                        <div class="table-title">
                            合格品：{{ item.newRecord.nowReportData.qualifiedNum }} 件
                        </div>
                        <!-- <div class="table-wrap"> -->
                            <service-table
                                    class="table-cancel"
                                    v-if="reportTableData.colors && reportTableData.colors.length"
                                    :tableData="reportTableData"
                                    :isNode="true"
                                    :skuVal="item.reportTableVal"></service-table>
                        <!-- </div> -->
                    </el-col>
                    <el-col :span="24"
                            :class="{'opacity5': item.reportDelFlag}">
                        <el-col :span="24">
                            <div class="table-title">
                                次品：{{ item.newRecord.nowReportData.defectiveNum }} 件
                            </div>
                            <div class="table-wrap">
                                <el-table
                                class="quality-detail__content-table is-fixed-header report-table"
                                :data="item.newRecord.nowReportData.defectiveJsonlog"
                                border
                                style="width: 100%">
                                    <el-table-column
                                        label="颜色"
                                        width="100">
                                        <template slot-scope="scope">
                                            {{ scope.row.colorName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        v-if="reportTableData.lengths && reportTableData.lengths.length"
                                        prop="standardName"
                                        label="内长"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="sizeName"
                                        label="尺码"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="defectiveLabelName"
                                        label="次品标签">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <div class="table-title">
                                废品：{{ item.newRecord.nowReportData.wastedNum }} 件
                            </div>
                            <div class="table-wrap">
                                <el-table
                                class="quality-detail__content-table is-fixed-header report-table"
                                :data="item.newRecord.nowReportData.wastedJsonlog"
                                border
                                style="width: 100%">
                                    <el-table-column
                                        label="颜色"
                                        width="100">
                                        <template slot-scope="scope">
                                            {{ scope.row.colorName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        v-if="reportTableData.lengths && reportTableData.lengths.length"
                                        prop="standardName"
                                        label="内长"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="sizeName"
                                        label="尺码"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="defectiveLabelName"
                                        label="报废原因">
                                    </el-table-column>
                                </el-table>
                                <p class="cancel-user" v-if="item.reportDelFlag">撤销人：{{ item.userName }}</p>
                            </div>
                        </el-col>
                    </el-col>

                </section>

            </el-col>

            <!--9质检点次品修改-->
            <el-col :span="24" class="node-state-list" v-if="item.type==9">
                <!--最新记录-->
                <el-col :span="24" @mouseover.native="showEdit(item)"
                        @mouseout.native="showEdit(item)">
                    <div class="list-header">
                        <!---->
                        <div class="list-left">
                            <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                            <span class="text-color1">{{item.userName}}：</span>
                            <p class="appear-num">
                                {{ item.newRecord.message }}
                                <span v-if="item.reportDelFlag"
                                        style="padding: 2px 8px;border: 1px solid #A0ACBD;color: #A0ACBD;">已撤销</span>
                            </p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="!item.reportDelFlag"
                                    v-show="!item.isExpand">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>
                            <!--撤销-->
                            <div class="list-handle"
                                    style="color: #a2abb8;text-align: right;"
                                    v-if="item.reportDelFlag == true">
                                <span style="cursor: pointer;">{{item.createAt | filterDate}}</span>
                            </div>

                            <div class="list-handle"
                                    v-if="!item.reportDelFlag"
                                    style="color: #a2abb8;text-align: right;"
                                    v-show="item.isExpand">
                                <span style="cursor: pointer;"
                                    @click="deleteTeble(item)">撤销</span>
                            </div>
                            <i class="el-icon-arrow-down" @click="toggleDisplayAll(item)"
                                :class="{'rotate': item.allCollapse}"></i>
                        </div>
                    </div>


                </el-col>
                <section v-show="item.allCollapse">
                    <el-col :span="24"
                            :class="{'opacity5': item.reportDelFlag}">
                        <el-col :span="24">
                            <div class="table-wrap">
                                <el-table
                                class="quality-detail__content-table is-fixed-header report-table"
                                :data="item.tableData"
                                border
                                style="width: 100%">
                                    <el-table-column
                                        label="颜色"
                                        width="100">
                                        <template slot-scope="scope">
                                            {{ scope.row.colorName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        v-if="reportTableData.lengths && reportTableData.lengths.length"
                                        prop="standardName"
                                        label="内长"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="sizeName"
                                        label="尺码"
                                        width="100">
                                    </el-table-column>
                                    <el-table-column
                                        prop="defectiveLabelName"
                                        label="次品标签">
                                    </el-table-column>
                                    <el-table-column
                                        label="状态">
                                        <template slot-scope="scope">
                                            <span v-if="(scope.row.status == 0 || scope.row.status == 2)">返修中</span>
                                            <span v-else-if="scope.row.status == 1">已修复合格</span>
                                            <span v-else-if="scope.row.status == 3">已报废</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </el-col>

                </section>

            </el-col>
            <el-col :span="24" class="node-state-list" v-if="item.type==10">
                <el-col :span="24">
                    <!---->
                    <div class="list-header">
                         <icon style="width: 24px;height: 24px;"
                                    type="icon-gongdan-caozuo"></icon>
                        <div class="list-left baseic-show">
                           
                            <p><span class="text-color1" v-if="item.userName!=null">{{item.userName}}:</span>
                            {{item.newRecord.content}}</p>
                            <p class="message-type10" v-for="(message,index) in item.newRecord.others" :key="index">
                                {{message}}
                            </p>
                        </div>
                        <div class="list-right">
                            <div class="list-handle node-date">
                                {{item.opAt | filterDate}}
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-col>
        </el-col>
        <el-dialog
            :visible.sync="visible.addReportVisible"
            :show-close="false"
            size="small">
            <div class="dialog-title" slot="title">
                {{ instanceWorkflow.status.nodeName }}修改上报数量
            </div>
            <div class="dialog-body">
                <div class="form-inline">
                    <div class="form-item">
                        <span class="form-label">完成日期</span>
                        <div class="input-wrap">
                            <el-date-picker
                                    type="date"
                                    format="yyyy-MM-dd"
                                    v-model="reportFrom.endAt"
                                    @change="pickerReportEndAt"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-item">
                        <span class="form-label">完成人员</span>
                        <div class="input-wrap">
                            <el-select
                                v-model="reportFrom.finishUserId"
                                placeholder="请选择完成人员">
                                <el-option
                                    v-for="(leaderItem, leaderIndex) in personOptions"
                                    :key="leaderIndex" :label="leaderItem.userName"
                                    :value="leaderItem.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="form-textarea">
                    <service-table
                        ref="reportTable"
                        v-if="reportTableData.colors && reportTableData.colors.length"
                        :tableData="reportTableData"
                        :skuVal="reportSkuVal"
                        @setReportOnce="setReportOnce"
                        :isEdit="true"></service-table>
                </div>
                <div class="form-btn">
                    <nf-button @click="visible.addReportVisible = false">取消</nf-button>
                    <nf-button type="warning" @click="handleAddReport">确定</nf-button>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import ServiceTable from "../../service/serviceTable";
import { formatDate } from "@/utils";
import {
  updateReportDataDetail,
  deleteReportDataDetail,
  qcReportInfoCancel,
  qcDefectiveDetailCancel
} from "@/api";
export default {
  props: {
    reportTableData: {},
    instanceWorkflow: {},
    nodeReportTableVal: {},
    personOptions: [],
    showTitle: Boolean,
    log: Object // 节点动态
  },
  data() {
    return {
      // factoryMissionOpLogList: [],
      visible: {
        addReportVisible: false
      },
      reportSkuVal: {},
      updataOptions: {},
      reportFrom: {
        leaders: [],
        endAt: "",
        finishUserId: ""
      },
      sign:"0"
    };
  },
  components: {
    ServiceTable
  },
  computed: {
    isBoss() {
      const info = sessionStorage.getItem("user_info");
      return JSON.parse(info).type === 1;
    },
    userId() {
      return (
        this.$store.state.userInfo.id ||
        JSON.parse(sessionStorage.getItem("user_login")).userId
      );
    },
    factoryMissionOpLogList() {
      console.log(this.log);
      return this.fetchListData(this.log.logs);
    }
  },
  watch: {
    "visible.addReportVisible"(val) {
      // this.initReportVal();
      this.reportFrom["finishUserId"] = val && this.isBoss ? "" : this.userId;
      this.reportFrom.endAt = formatDate(new Date());
      this.$refs["reportTable"] && this.$refs["reportTable"].initOnceInputVal();
    }
  },
  created() {
    // this.fetchListData();
  },
  filters: {
    filterDate(value) {
      if (!value) {
        return "未设置";
      }
      const _date = new Date(value.replace(/-/g, "/"));
      return formatDate(_date, "yyyy.MM.dd hh:mm");
    },
  },
  methods: {
    click_isshow() {
      var datalist = JSON.parse(sessionStorage.getItem("user_login"))
        .permissionList || [];
      // if (datalist) {
      //   for (let i = 0; i < datalist.length; i++) {
      //     if (datalist[i] == "fac.mission.node.dynamic.list") {
      //       this.sign = "1";
      //     }
      //   }
      // }

      if (datalist.indexOf('fac.mission.node.dynamic.list') == -1) {
        this.$message.error("抱歉，您没有操作权限");
        return;
      }
      this.$router.push({ path: "/allNodeMessage", query: this.$route.query });
    },
    fetchListData(logs) {
      let log;
      if (this.showTitle) {
        log = [logs[0]]; // 默认显示一条
      } else {
        log = logs || []; // 用于总的页面
      }
      const factoryMissionOpLogList = this.regroupFactoryMissionOpLogList(log);
      return factoryMissionOpLogList;
    },
    regroupFactoryMissionOpLogList(factoryMissionOpLogList) {
      factoryMissionOpLogList.map(item => {
        if (item.newRecord && item.newRecord.indexOf("nowReportData") > -1 && item.type === 1) {
          this.$set(item, "isExpand", false);
          this.$set(item, "allCollapse", false);
          this.$set(item, "delExpand", false);
          this.$set(item, "isRecordExpand", false);
          item.newRecord = JSON.parse(item.newRecord);
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
        } else if (item.newRecord && item.newRecord.indexOf("sku") > -1 && item.type === 2) {
          this.$set(item, "isExpand", false);
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
        } else if (
         item.newRecor &&
          item.newRecord.includes("nowReportData") &&
          item.type === 8
        ) {
          item = this.mapQualityData(item);
        } else if (item.type === 9) {
          item = this.mapDefectiveData(item);
        }else if (item.type === 10) {
          item = this.mapDefectiveData(item);
        }
      });
      console.log(factoryMissionOpLogList);
      return factoryMissionOpLogList;
    },
    mapQualityData(item) {
      item.newRecord = JSON.parse(item.newRecord);
      item.reportTableVal = this.setNodeTableVal(
        this.nodeReportTableVal,
        item.newRecord.nowReportData.qualifiedJsonlog
      );
      item.isExpand = false;
      item.allCollapse = false;
      return item;
    },
    mapDefectiveData(item) {
      item.newRecord = JSON.parse(item.newRecord);
      item.tableData = [item.newRecord.nowReportData];
      this.$set(item, "isExpand", false);
      this.$set(item, "allCollapse", false);
      console.warn(item);
      return item;
    },
    setNodeTableVal(obj, sku, objName) {
      obj = JSON.parse(JSON.stringify(obj));
      for (let skuItem of sku) {
        for (let key in obj) {
          if (obj[key].skuId === skuItem.skuId && skuItem.quantity != 0) {
            obj[key].finishNum = skuItem.quantity;
            if (objName === "compareReportData") {
              obj[key].finishNum =
                skuItem.quantity > 0
                  ? "+" + skuItem.quantity
                  : skuItem.quantity;
            }
          }
        }
      }
      return obj;
    },
    showEdit(item) {
      item.isExpand = !item.isExpand;
    },
    toggleDisplayAll(item) {
      item.allCollapse = !item.allCollapse;
    },
    toggleRecordTable(index, compareIndex) {
      const item = this.factoryMissionOpLogList[index];
      //console.log()
      if (typeof compareIndex === "number") {
        item["newRecord"]["compareReportData"][compareIndex].isExpand = !item[
          "newRecord"
        ]["compareReportData"][compareIndex].isExpand;
        return;
      }
      item.isRecordExpand = !item.isRecordExpand;
    },
    // 修改数量型动态节点table
    editReport(item) {
      //console.log(item)
      if (item.type === 8) {
        this.$router.push({
          path: "/reporting/edit",
          query: {
            goodsId: this.instanceWorkflow.goodsId,
            missionId: this.$route.query.missionId,
            instanceWorkflowId: this.$route.query.instanceWorkflowId,
            targetId: item.targetId
          }
        });
        return;
      }
      this.updataOptions = {
        targetId: item.targetId,
        id: item.id
      };
      this.setEditReportVal(item.reportTableVal);
    },
    setEditReportVal(obj) {
      let objVal = { ...this.nodeReportTableVal };
      for (let key in objVal) {
        if (obj.hasOwnProperty(key)) {
          objVal[key].num = obj[key].finishNum;
        }
      }
      this.reportSkuVal = objVal;

      this.$nextTick(() => {
        this.visible.addReportVisible = true;
      });
    },
    setReportOnce(colorItem, tableVal, onceOptions) {
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
      }
    },
    handleAddReport(val) {
      if (!this.checkAddReportSku()) {
        this.$message.error("修改上报数量不能全部为0！");
        return;
      }
      if (!this.reportFrom.finishUserId) {
        this.$message.error("请选择完成人员！");
        return;
      }
      const params = {
        userId: this.userId,
        instanceWorkflowId: this.instanceWorkflow["id"],
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
    },
    updataReportDetail(params) {
      updateReportDataDetail(params).then(res => {
        if (res.data.code === 0) {
          this.visible.addReportVisible = false;
          this.$message.success("修改成功");
          this.$emit("on-success");
          this.fetchListData();
          //  this.$router.replace({
          //     path: this.$route.path,
          //     query: {
          //         ...this.$route.query,
          //         hash: new Date().getTime()
          //     }
          // });
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    deleteTeble(item) {
      if (item.type === 8) {
        qcReportInfoCancel({ id: item.targetId, missionOpLogId: item.id }).then(
          res => {
            if (res.data.code == 0) {
              this.$emit("on-success");
              this.fetchListData();
              this.$message.success("撤销成功");
            }
          }
        );
        return;
      }
      if (item.type === 9) {
        qcDefectiveDetailCancel({
          id: item.targetId,
          missionOpLogId: item.id
        }).then(res => {
          if (res.data.code == 0) {
            this.$emit("on-success");
            this.fetchListData();
            this.$message.success("撤销成功");
            return;
          }
          this.$message.error("该次上报的唯一码在其他节点已上报，不允许进行撤销！");
        });
        return;
      }
      deleteReportDataDetail({
        userId: JSON.parse(sessionStorage.getItem("user_info")).id,
        id: item.targetId
      }).then(res => {
        if (res.data.code == 0) {
          this.$emit("on-success");
          this.fetchListData();
          this.$message.success("撤销成功");
        }
      });
    },
    checkAddReportSku() {
      const sku = this.getSkuParams(this.reportSkuVal);
      const isNoNull = sku.some(item => {
        return item.num > 0;
      });
      if (isNoNull) return true;
      return false;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.node-date {
  text-align: right;
  color: #a2abb8;
  margin-right: 22px;
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
//节点动态
.node-state {
  .node-state-title {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    margin-bottom: 16px;
    .fz16 {
      font-size: 16px;
      color: #2c2c2c;
    }
    .fz17 {
      color: #808080;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
        color: #3b3b3b;
      }
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
      .message-type10 {
          margin-top:12px;color:#A2ABB8;font-size:12px;
      }
    }
    .baseic-show {
        display:block;
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
    .collapse {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
    }
  }
  .text-color1 {
    color: #2c2c2c;
  }
  .pd-28 {
    padding-left: 28px;
  }
  .table-title {
    padding-left: 25px;
    margin-top: 12px;
    margin-bottom: 6px;
  }
  .table-wrap {
    margin-left: 25px;
  }
  .gray {
    padding-left: 25px;
    color: #808080;
  }
  .cancel-user {
    color: #fa4150;
    margin: 15px 0;
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
}
</style>
