<template>
    <el-row id="report-manage">
        <!--头部begin-->
        <page-title title="本厂报表" bg>
            <div class="report-wrap">
                <el-col class="report-search">
                    <el-select v-model="checked" v-to-focus="toSelect" @click.native="rmChcked" placeholder="搜索与添加报表"
                               id="select-report" filterable clearable >
                        <el-option v-for="(item,index) in reportList" :key="index" :label="item.content"
                                   :value="item.enumId" v-if="item.enumCode != 'FACSCHEDULEFORM'">
                            <div style="display: flex;justify-content: space-between;align-items: center">
                                <span style="flex: 1;font-size: 12px;color: #2c2c2c;" @click="showReport(item,index)">
                                    {{ item.content }}
                                </span>
                                <span class="options-add" style="width: auto; color: #8492a6; font-size: 12px">
                                    <span v-if="item.formId==''" @click="addReport(item,index)"
                                          style="color: #ff9c38;">
                                        + 添加
                                    </span>
                                    <span v-else @click="hadAddReport">已添加</span>
                                </span>
                            </div>
                        </el-option>
                        <el-option label="货品生产进度报表" value="ded2255c12264ba9ab0d5993ad6bb04c">
                            <div style="display: flex;justify-content: space-between;align-items: center">
                                <span style="flex: 1;font-size: 12px;color: #2c2c2c;"
                                      @click="showOrtherReport">
                                    货品生产进度报表
                                </span>
                                <span class="options-add" style="width: auto; color: #8492a6; font-size: 12px">
                                <span @click="addOtherReport" style="color: #ff9c38;">
                                    + 添加
                                </span>
                        </span>
                            </div>
                        </el-option>
                    </el-select>
                </el-col>
                <nf-button type="warning" @click="toggleSelect">+ 添加报表
                </nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <el-col class="report-content" v-loading="loading">
            <el-col class="report-list" v-for="(item , index) in reportList" :key="index" v-if="item.formId!==''">
                <el-col class="report-head">
                    <div>
                        <el-col :span="12" class="report-type">
                            <div class="icon">
                                <icon w="20" h="26" type="icon-baobiaoguanli"></icon>
                            </div>
                            <div class="title">
                                <p>{{item.formsName}}</p>
                                <span>{{item.description}}</span>
                            </div>
                        </el-col>
                        <el-col :span="12" class="report-btns clearfix">
                            <nf-button width="105" v-if="item.isJumpToUrl===1" @click="reportClick(item)">查看报表 >></nf-button>
                            <nf-button width="105" v-else @click="reportLink(item)">查看报表 >></nf-button>
                            <nf-button width='105' @click="handleShowMore(item, index)" class="show-more-btn">
                                更多操作
                                <i v-if="item.isShow" class="el-icon-arrow-up"></i>
                                <i v-else class="el-icon-arrow-down"></i>
                            </nf-button>
                            <ul class="show-more-wrap" v-show="item.isShow">
                                <li v-if="item.enumCode=='FACSCHEDULEFORM'" @click="configureReport(item)"
                                    :class="item.status===1?'cancel-text-li':''">
                                    <icon type="icon-configuration"></icon>
                                    配置报表
                                </li>
                                <li @click.stop="checkPermission(item,index)"
                                    :class="item.status===1?'cancel-text-li':''">
                                    <icon type="icon-baobiao_quanxian"></icon>
                                    管理员工查看权限
                                </li>
                                <li @click.stop="deleteReport(item)">
                                    <icon type="icon-baobiao_shanchu"></icon>
                                    删除
                                </li>
                                <li v-if="item.status==0" @click.stop="subCancel(item,1)">
                                    <icon type="icon-baobiao_tingyong"></icon>
                                    停用
                                </li>
                                <li v-if="item.status==1" @click.stop="subCancel(item,0)">
                                    <icon type="icon-baobiao_qiyong"></icon>
                                    启用
                                </li>
                            </ul>
                        </el-col>
                    </div>
                    <el-col :span="24" v-if="item.status===1" class="cancel-text">
                        <span>已停用</span>
                    </el-col>
                </el-col>
            </el-col>
        </el-col>

        <!--权限管理-->
        <el-dialog top="8%" id="report-dialog" title="工厂进度报表-员工查看权限" custom-class="dialog"
                   :visible.sync="workerPermission" size="tiny" :showClose=false>
            <el-row>
                <el-col class="group-worker">
                    <el-col :span="12" class="text-des">
                        请勾选可以查看此报表的员工
                    </el-col>
                    <el-col :span="12" class="group-search">
                        <el-select v-model="workerIds" @remove-tag="changeGroup" @change="changeGroup"
                                   class="search-input" clearable multiple placeholder="所有分组">
                            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col class="worker-list">
                    <el-col class="list-head">
                        <el-checkbox @change="checkAll()" v-model="isCheckedAll">
                            <span>全选</span>
                            <!--<span v-show="isCheckedAll">取消全选</span>-->
                        </el-checkbox>
                    </el-col>
                    <el-col class="list-item">
                        <el-col :span="6" v-for="(item,index) in workerList" :key="index">
                            <el-checkbox-group v-model="checkList">
                                <el-checkbox @change="addWorkerToGroup(item)" :label="item.id" :key="index">
                                    {{item.userName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <nf-button @click="handleCancle" class="is-plain">取 消</nf-button>
                <nf-button type="warning" @click="addWorkerToPermission">确 定</nf-button>
            </span>
        </el-dialog>

        <!--报表类型图片-->
        <el-dialog id="img-dialog" title="报表介绍" custom-class="dialog" :visible.sync="imgDialog" size="tiny"
                   :showClose=false>
            <el-row>
                <el-col>
                    <span>报表介绍：可以查看每一张工单的信息以及工单所有节点当前的进度的报表</span>
                </el-col>

                <el-col class="img-content" @click.native="getBigImg(currentReport)">
                    <div class="img-box">
                        <img :src="currentReport.imgSrc" alt="">
                    </div>
                    <el-col class="big-img">
                        <span>
                            <icon style="width: 14px;height: 14px;position: relative;top: -2px;left: -6px;"
                                  type="icon-baobiao_fangda"></icon>点击查看大图
                        </span>
                    </el-col>
                </el-col>

                <el-col class="add-and-tart-btns">
                    <nf-button @click="imgDialog = false" class="is-plain">取 消</nf-button>
                    <nf-button type="warning" @click="addAndStart()">添加并启用</nf-button>
                </el-col>
            </el-row>

        </el-dialog>

        <!-- 货品生产进度报表-配置 -->
        <setting-dialog v-if="isSettingDialogShow" @passData='listenData' :formObj='progressReportObj'></setting-dialog>
    </el-row>

</template>

<script>
    import {
        getEasyGroups,
        getWorkbayList,
        selectFacForms,
        addFacForm,
        banFacForm,
        deleteFacForm,
        getFormRelation,
        getFormGroupsUsers,
        updateFormRelation,
        formsPermission
    } from '../../api/api';
    import settingDialog from './settingDialog/settingDialog';

    export default {
        data() {
            return {
                // 数据
                currentReport: {}, //当前点击的报表
                isCancel: false, //启用/停用
                imgDialog: false, //报表类型图片弹窗
                workerPermission: false, //权限弹窗
                checked: '', //当前搜索框选中的值
                isCheckedAll: false, //全选按钮样式
                searchData: [], //搜索数据
                groupList: [], //分组列表
                workerList: [], //工位列表
                workerIds: '', //下拉框选中的工位
                checkList: [], //复选框选中的工位名字
                checkListIds: [], //复选框选中的工位id
                isAll: false, //全选
                reportList: [], //报表列表
                imgType: '', //图片地址
                formId: '', //当前报表ID
                reportTypeImg: '', //报表类型图
                isSettingDialogShow: false,
                // 编辑货品生产进度报表时传递的对象
                progressReportObj: {},
                unitId: '',
                userId: '',
                showMore: [], //是否展示更多操作界面
                toSelect: false,
                prevMonthDate: '',   //上个月当天
                nowDate: '',         //当前日期
                loading:false
            };
        },
        directives: {
            "to-focus": function (el, binding) {
                if (binding.value) {
                    el.children[0].children[1].focus();
                }else{
                    el.children[0].children[1].blur();
                }
            }
        },
        computed: {
            // 计算属性
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        methods: {
            toggleSelect() {
                this.toSelect = !this.toSelect
            },
            getYYMMDD(date){
                var mon = date.getMonth() + 1;
                var day = date.getDate();
                let result = date.getFullYear() + "-" + (mon<10?"0"+mon:mon) + "-" +(day<10?"0"+day:day)
                return result
            },
            //获取当前月第1天
            getCurrentMonthFirst(){
                let date = new Date()
                date.setDate(1)
                return this.getYYMMDD(date)
            },
            //获取昨天日期
            getYesterday(){
                let date = new Date();
                date.setTime(date.getTime()-24*60*60*1000)
                return this.getYYMMDD(date)
            },
            // 获取一个星期前日期
            getBeforeWeek(){
                let date = new Date();
                date.setTime(date.getTime()-(24*60*60*1000*6))
                return this.getYYMMDD(date)
            },
            //获取上月当日
            getPrevMonth(dateStr){
                let now = new Date();
                if(dateStr){
                    now =new Date(dateStr)
                    console.log(now,898989)
                }
                let year = now.getFullYear();
                let month = now.getMonth() +1;
                let day = now.getDate();
                if(parseInt(month)<10){
                    month="0"+month;
                }
                if(parseInt(day)<10){
                    day="0"+day;
                }
                now =year + '-'+ month + '-' + day;

                this.nowDate = now;

                //如果是1月份，则取上一年的12月份
                if (parseInt(month) ==1) {
                    return (parseInt(year) - 1) + '-12-' + day;
                }

                let  preSize= new Date(year, parseInt(month)-1, 0).getDate();//上月总天数

                //上月天数是否小于本月
                if (preSize < parseInt(day)) {
                    return year + '-' + month + '-01';
                }
                if(parseInt(month) <=10){
                    return year + '-0' + (parseInt(month)-1) + '-' + day;
                }else{
                    return year + '-' + (parseInt(month)-1) + '-' + day;
                }
            },
            //报表链接
            reportLink(item) {
                formsPermission({userId:this.userId,formId:item.formId}).then(res => {
                    if(res.data.code == 0) {
                        if(item.isJumpToUrl===0){
                            let path = ''
                            if (item.enumCode === 'FACMISSIONFORM') { //工单节点进度报表
                                path = '/reportmanage/FormsStatistics?formId=' + item.formId;
                            } else if (item.enumCode === 'FACEMOLUMENTFORM') {  //员工计件工资报表
                                path = '/reportmanage/StaffSalaryReport?formId=' + item.formId;
                            } else if (item.enumCode === 'FACSCHEDULEFORM') {  //货品生产进度报表
                                path = '/reportmanage/GoodProcessReport?formId=' + item.formId;
                            } else if (item.enumCode === 'FACMISSIONLineReportFORM') {    //动线报表
                                path = '/lineReport?formId=' + item.formId;
                            }  else if (item.enumCode === 'STAFF_NODE_REPORT_STATISTICS') { //工位-节点上报统计报表
                                path = '/reportmanage/stationNodeProcessReport?formId=' + item.formId;
                            }  else if (item.enumCode === 'OUTSOURCED_PROCESSING_SETTLEMENT_FORM') { //外发厂加工结算
                                path = '/reportmanage/factoryProcesSettlement?formId=' + item.formId;
                            }  else if (item.enumCode === 'MACHINIST_PERFORMANCE') { // 0:版师绩效提成表
                                path = '/reportManage/typingAchievementsReport?type=0'
                            } else if (item.enumCode === 'SAMPLE_DESIGNER_PERFORMNANCE') { //1:样衣师,
                                path = '/reportManage/typingAchievementsReport?type=1'
                            }
                            this.$router.push(path)
                        }
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })

            },

            reportClick(item) {
                formsPermission({userId:this.userId,formId:item.formId}).then(res => {
                    if(res.data.code == 0) {
                        if(item.isJumpToUrl===1){
                            let url =''
                            if(item.enumCode === 'FAC_PRODUCE_SCHEDULE_ORDER_FORM'){
                                // 默认传一个月,从昨天开始往后算
                                this.prevMonthDate=this.getPrevMonth(this.getYesterday())
                                this.nowDate = this.getYesterday()
                            } else if(item.enumCode === 'FAC_PRODUCTION_CYCLE_TIME_FORM'
                                || item.enumCode ==='NODE_LIFE_CYCLE'
                                || item.enumCode ==='STYLE_DELIVER'
                                || item.enumCode ==='PRODUCTING_ANALYSIS'
                                || item.enumCode ==='MATERIAL_ACTUAL_FOLLOW'
                                || item.enumCode ==='GOODS_FOLLOW'
                                || item.enumCode ==='MATERIAL_COST'){
                                // 近一周
                                this.prevMonthDate = this.getBeforeWeek()
                                this.nowDate = this.getYYMMDD(new Date())
                            } else if(item.enumCode === 'WHOLESALE_FOLLOWORDER_PERFORMANCE'|| item.enumCode === 'WHOLESALE_FOLLOWORDER_PERFORMANCE_SIMPLE'){
                                // 从本月1号到今天
                                // 批发跟单绩效明细表、批发跟单绩效表
                                this.prevMonthDate = this.getCurrentMonthFirst()
                                this.nowDate = this.getYYMMDD(new Date())
                            }
                            // 默认都是近一个月的，从今天开始往后算
                            if(item.enumCode === 'FAC_PRODUCE_SCHEDULE_ORDER_FORM'||
                                item.enumCode === 'FAC_FORMS_TYPE_FORM'||
                                item.enumCode ==='FAC_PRODUCTION_CYCLE_TIME_FORM' ||
                                item.enumCode ==='NODE_LIFE_CYCLE'){
                                url= item.url + '?_u=' + item.filePath + '&unitId=' + this.unitId + '&startDate=' + this.prevMonthDate + '&endDate=' + this.nowDate;

                            } else if(item.enumCode === 'FAC_REALTIME_PROPABILITY_FORM'){
                                // 实时直通率
                                url= item.url + '?_u=' + item.filePath + '&unitId=' + this.unitId +'&dateType=0';

                    } else if(item.enumCode === 'FAC_DEFECTIVE_SUMMARY_FORM'){
                        // 次品汇总报表
                        url= item.url + '/' + item.filePath + '?unitId=' + this.unitId +'&dateType=0';
                    } else if( item.enumCode === 'STYLE_TRANSFER_TIME'
                        || item.enumCode === 'ACTUALCUTTING_MISSION'
                        || item.enumCode === 'MATERIAL_ACTUAL_FOLLOW'
                        || item.enumCode === 'GOODS_FOLLOW'
                        || item.enumCode === 'MATERIAL_COST'
                        || item.enumCode === 'PRODUCTION_EXECUTION_SCHEDULE'
                        || item.enumCode === 'SEW_FINISHED_PRODUCTS'
                        || item.enumCode === 'CUTBED_WORKSHOP'
                        || item.enumCode === 'NODE_UNFINISHED_NUMBER'
                        || item.enumCode === 'NODE_INTERVAL_PAUSE'
                        || item.enumCode === 'PAY_WORKSHOP'
                        || item.enumCode === 'FUR_COLLAR_FINISHED_PRODUCT'
                        || item.enumCode === 'PRODUCT_WORKSHOP_FINISHED_GOODS'
                        || item.enumCode === 'PRD_ORDER_PLAN'
                        || item.enumCode === 'BUY_SETTLEMENT'
                        || item.enumCode === 'REPORT_NOT_FINISH_MY'
                    ){
                        // 转款时间报表、裁床任务表
                        url= item.url + '/' + item.filePath + '?unitId=' + this.unitId + '&startDate=' + this.prevMonthDate + '&endDate=' + this.nowDate;
                    } else if(item.enumCode === 'PRODUCTING_ANALYSIS'){
                        url= item.url + '?_u=' + item.filePath + '&unitId=' + this.unitId + '&startDate='
                            + this.prevMonthDate + '&endDate=' + this.nowDate +'&userId='+this.userId;
                    } else if(item.enumCode === 'NODE_REPORT_AMOUNT'){
                        url= item.url + '/' + item.filePath + '?unitId=' + this.unitId + '&startDate=' + this.nowDate + '&endDate=' + this.nowDate;
                    } else if (item.enumCode === 'SUPPLY_CHAIN_OVERALL_SITUATION') {
                        url= item.url + '/' + item.filePath + '?unitId=' + this.unitId + '&startDate=' + this.prevMonthDate + '&endDate=' + this.nowDate + '&yearId=c0c7469d87354e6a9396d13f975990cc&seasonId=6b76f524833c4d518d7816d8f39d4eae,73b524f4ffeb4d2e942b6d431560bde5';
                    } else if (item.enumCode === 'ORDER_DETAIL') {
                        url= item.url + '/' + item.filePath + '?unitId=' + this.unitId + '&startDate=' + this.prevMonthDate + '&endDate=' + this.nowDate + '&yearIds=c0c7469d87354e6a9396d13f975990cc&seasonIds=6b76f524833c4d518d7816d8f39d4eae,73b524f4ffeb4d2e942b6d431560bde5';
                    }else if (item.enumCode === 'numberNodeReport'
                        || item.enumCode === 'priceSegmentAnalysis'
                        || item.enumCode === 'completedNumber'
                        || item.enumCode === 'executionReport'
                        || item.enumCode === 'categoryOrderFollowUp'
                        || item.enumCode === 'commodityOrderFollowUp'
                        || item.enumCode === 'commodityOrderDelivery'
                        || item.enumCode === 'supplierGlobalReport'
                        || item.enumCode === 'orderDetailReport'
                        || item.enumCode === 'warehouseInOut'
                        || item.enumCode === 'categoryOrderFollowUpHor'
                        || item.enumCode === 'inventoryChangeRecords'
                        || item.enumCode === 'realTimeInventory'
                        || item.enumCode === 'orderCostRate'
                        || item.enumCode === 'goodsFileReport'
                        || item.enumCode === 'nodeCapacitySchedule'
                        || item.enumCode === 'missionCompletedStatusReport'
                        || item.enumCode === 'workOrderFollowUp'
                        || item.enumCode === 'tailoringDetailed'
                    ){
                        url= item.url +  '?unitId=' + this.unitId +'&jumpTarget=true&userId=' + this.userId + '&bossUnitId=' + this.bossUnitId
                    }else {
                        url= item.url + '?_u=' + item.filePath + '&_i=1&_r=1&unitId=' + this.unitId + '&startDate=' + this.prevMonthDate + '&endDate=' + this.nowDate;
                    }
                    window.open(url)
                }
            }}
            )},
            //点击展示更多操作界面
            handleShowMore(item, index) {
                this.toSelect = false;
                item.isShow = !item.isShow;
                for(let i=0; i<this.reportList.length; i++){
                    if(i !== index){
                        this.reportList[i].isShow = false;
                    }
                }
            },
            // 实例方法
            handleIconClick() {
                //搜索框
            },
            showReport(item, index) {
                let that = this;
                that.toSelect = false;
                //搜索框的添加按钮
                setTimeout(function(){
                    that.currentReport = item;
                    if (item.enumCode != 'FACSCHEDULEFORM') {
                        that.imgDialog = true;
                    } else {
                        that.progressReportObj = {};
                        console.log(that.progressReportObj);
                        that.isSettingDialogShow = true;
                    }
                },100);
            },
            showOrtherReport(){
                let that = this;
                that.toSelect = false;
                setTimeout(function(){
                    that.progressReportObj = {};
                    that.isSettingDialogShow = true;
                },100);
            },
            async checkPermission(item, index) {
                // 权限
                if((!this.powerJudgement.permissions("fac.forms.managePermissionToView"))){
                    return
                }
                if (item.status === 1) {
                    return;
                }
                this.workerPermission = true;
                this.formId = item.formId;
                // 重置this.checkList
                this.checkList = [];
                let getWorkerFormParams = {
                    formId: item.formId,
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    token: ''
                };

                let getGroupParams = {
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    token: ''
                };
                try {
                    let data = await getEasyGroups(getGroupParams);
                    await (this.groupList = data.data);
                    let data_r = (await getFormRelation(getWorkerFormParams)).data;
                    (await data_r) === 0 && void 0,
                        (this.workerList = data_r.data.users);
                    // 把有权限的工位放入到checkList中去
                    await this.workerList.forEach(e => {
                        if (e.formId) {
                            this.$set(this.checkList, this.checkList.length, e.id);
                        }
                    });
                    // 当返回的数据中全部是选中状态时自动勾选全选按钮
                    (await this.workerList.length) === this.checkList.length ? (this.isCheckedAll = true) : (this.isCheckedAll = false);
                } catch (error) {
                    console.log(error);
                }
            },
            checkAll() {
                //全选
                if (this.isCheckedAll) {
                    this.checkList = [];
                    for (let i = 0; i < this.workerList.length; i++) {
                        this.checkList.push(this.workerList[i].id);
                    }
                }
                if (!this.isCheckedAll) {
                    this.checkList = [];
                }
            },
            addWorkerToGroup(item) {
                // console.log(this.checkList);
                //某个工位点击
                if (this.workerList.length === this.checkList.length) {
                    this.isCheckedAll = true;
                } else {
                    this.isCheckedAll = false;
                }
            },
            changeGroup() {
                //当有分组时调这个接口
                let getGroupParams = {
                    formId: this.formId,
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    groupIds: this.workerIds.length == 0 ? [] : this.workerIds,
                    token: ''
                };
                getFormGroupsUsers(getGroupParams).then(async res => {
                    await (this.workerList = res.data.data);

                    // 筛选checkList数据
                    // console.log(this.checkList, "checkList");
                    // console.log(this.workerList, "workerList");
                    // console.log(this.checkList, '22222');
                    let arr = [];
                    await this.workerList.forEach(item => arr.push(item.id));
                    await (this.checkList = this.checkList.filter(e =>
                        arr.includes(e)
                    ));
                    // 处理全选按钮的关联关系
                    await this.addWorkerToGroup();
                });
            },
            // 取消开启权限操作
            handleCancle() {
                this.workerPermission = false;
                this.workerIds = [];
            },
            addWorkerToPermission() {
                //添加工位到权限列表
                /*****
                 * @description 添加工位到权限列表
                 * @type {{userId: string, facId: string, groupId: string, workerId: Array, token: string}}
                 */
                    //				console.log(this);
                let updateWorkerIds = [];
                updateWorkerIds = this.checkList.concat([]);
                let permissionParams = {
                    formId: this.formId,
                    userIds: updateWorkerIds,
                    token: ''
                };
                // console.log(permissionParams, "权限更新参数");
                updateFormRelation(permissionParams).then(res => {
                    if (res.data.code == 0) {
                        this.workerPermission = false; //权限弹窗
                        //						this.getReportForms();//更新界面
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                            showClose: true,
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.checkList = [];
                    }
                });
            },
            subCancel(item, num) {
                //'0'-启用，'1'-停用

                let type = 0;
                if (num == 1) {
                    // 权限
                    if((!this.powerJudgement.permissions("fac.forms.Pause"))){
                        return
                    }
                    this.isCancel = true;
                    type = 1;
                } else {
                     // 权限
                    if((!this.powerJudgement.permissions("fac.forms.Start"))){
                        return
                    }
                    this.isCancel = false;
                    type = 0;
                }

                console.log(item, '当前报表');

                let startOrStopParams = {
                    userId: this.userId,
                    formId: item.formId,
                    token: '',
                    type: type
                };

                banFacForm(startOrStopParams).then(res => {
                    console.log(res, '启用/停用结果');
                    if (res.data.code == 0) {
                        //更新全部数据
                        this.getReportForms();
                    }
                });
            },
            getBigImg(item) {
                //新窗口查看大图
                console.log(item);
                window.open(item.imgSrc);
            },
            addAndStart(item) {
                // 权限
                if((!this.powerJudgement.permissions("fac.forms.add"))){
                    return
                }
                //添加并启用按钮
                this.imgDialog = false;
                let addFormParams = {
                    userId: this.userId,
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    enumId: this.currentReport.enumId,
                    token: ''
                };
                addFacForm(addFormParams).then(res => {
                    if (res.data.code === 0) {
                        this.getReportForms();
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            showClose: true
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '此类报表已存在',
                            duration: this.$globalConfig.elementUI.duration,
                            showClose: true
                        });
                    }
                });
            },
            deleteReport(item) {
                // 权限
                if((!this.powerJudgement.permissions("fac.forms.delete"))){
                    return
                }
                //删除报表操作
                this.$confirm(
                    '此操作将删除此报表的权限人员, 是否继续?',
                    '删除报表',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                )
                    .then(() => {
                        let deleteParams = {
                            userId: this.userId,
                            formId: item.formId,
                            token: ''
                        };
                        deleteFacForm(deleteParams).then(res => {
                            // console.log(res, "--------删除结果");
                            if (res.data.code == 0) {
                                this.getReportForms();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }

                            this.searchData = []; //搜索数据
                            this.groupList = []; //分组列表
                            this.workerList = []; //工位列表
                            this.workerIds = ''; //下拉框选中的工位
                            this.checkList = []; //复选框选中的工位名字
                            this.checkListIds = []; //复选框选中的工位idthis.
                            this.getReportForms();
                        });
                    })
                    .catch(() => {
                    });
            },
            getReportForms() {
                let _this = this;

                let getReportParams = {
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    keyword: '',
                    token: ''
                };
                console.log(JSON.stringify(getReportParams));
                this.loading = true
                selectFacForms(getReportParams).then(res => {
                    this.loading = false
                    // ok
                    console.log(res);
                    if (res.data.code == 0) {
                        for (let item of res.data.data) {
                            item.isShow = false;
                            switch (item.enumCode) {
                                case 'FACMISSIONFORM':
                                    item.imgSrc = 'https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_869eb628158de9c68be30ef557fc085f';
                                    break;
                                //以后继续加
                                case 'FACEMOLUMENTFORM':
                                    item.imgSrc =
                                        'https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_a8b51793f854c42cdc6918cb05ee1442';
                                    break;
                                case 'FACSCHEDULEFORM':
                                    item.imgSrc =
                                        'https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_a434ee570be9f52dc438969a1522b260';
                                    break;
                                case 'FACMISSIONLineReportFORM':
                                    item.imgSrc = 'https://image3.myjuniu.com/30fcafbd6b4345ba9deb1dee494011f1_dev_0299915d7aef7a69f3fa100eeb47bef0';
                                    break;
                                case 'STAFF_NODE_REPORT_STATISTICS':
                                    item.imgSrc = 'https://image3.myjuniu.com/513d03b1665344e9a629d96dfaae6f63_dev_39e978da65f27e63c291860c4ee0a8f4';
                                    break;
                            }
                        }
                        this.reportList = res.data.data;
                    } else {
                        this.$message.error('网络错误');
                    }
                });
            },
            rmChcked() {
                this.checked = '';
                this.toSelect = false;
            },
            hadAddReport(){
                this.toSelect = false;
            },
            addReport(item) {
                let that = this;
                that.toSelect = false;
                //	直接添加
                setTimeout(function(){
                    let addFormParams = {
                        userId: that.userId,
                        unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                        enumId: item.enumId,
                        token: ''
                    };
                    addFacForm(addFormParams).then(res => {
                        if (res.data.code === 0) {
                            that.getReportForms();
                            that.$message({
                                type: 'success',
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                showClose: true
                            });
                        } else {
                            that.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: this.$globalConfig.elementUI.duration,
                                showClose: true
                            });
                        }
                    });
                },100);
            },
            addOtherReport (){
                let that = this;
                that.toSelect = false;
                setTimeout(function(){
                    that.progressReportObj = {};
                    that.isSettingDialogShow = true;
                },100);
            },
            // 加入进度报表
            addProgressReport(val) {
                let params = {
                    enumId: 'ded2255c12264ba9ab0d5993ad6bb04c',
                    userId: this.userId,
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    token: '',
                    ...val
                };
                addFacForm(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            showClose: true
                        });
                        this.getReportForms();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            showClose: true
                        });
                    }
                });
            },
            goBack() {
                //返回上级
                this.$router.push('/MyReport/FormsStatistics');
            },
            // 监听货品生产进度报表-配置弹窗传递的数据
            listenData(val) {
                if (val) {
                    this.addProgressReport(val);
                }
                this.isSettingDialogShow = false;
            },
            // 配置货品生产进度报表
            configureReport(item) {
                if (item.status === 1) {
                    return;
                }
                console.log(JSON.stringify(item)+'------------------');
                this.progressReportObj = item;
                this.isSettingDialogShow = true;
            }
        },
        components: {
            settingDialog
        },
        mounted() {
            // 生命周期渲染后钩子函数
            this.getReportForms();
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            this.unitId = JSON.parse(sessionStorage.getItem('last_login')).id;
            this.prevMonthDate =  this.getPrevMonth(new Date());
        }
    };
</script>

<style lang="scss" scoped>
    #report-manage {
        min-width: 1100px;
        font-family: MicrosoftYaHei;
        .report-search {
            width: 260px;
            margin-right: 10px;
            display: flex;
            justify-content: flex-start;
        }
        .report-content {
            /*内容区域*/
            min-height: 100px;
            background-color: #F0F2F5;
            margin-top: 16px;
            .report-list {
                /*全部报表列表*/
                margin-bottom: 10px;
                border-radius: 2px;
                background-color: #ffffff;
                box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
                .report-head {
                    box-sizing: border-box;
                    padding: 0 32px;
                    position: relative;
                    width: 100%;
                    .report-type {
                        /*各种报表类型*/
                        height: 80px;
                        padding-top: 16px;
                        padding-bottom: 16px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        justify-content: flex-start;
                        .icon {
                            width: 20px;
                            height: 26px;
                            margin-right: 8px;
                        }
                        p {
                            height: 24px;
                            line-height: 24px;
                            font-size: 14px;
                            color: #2c2c2c;
                        }
                        span {
                            margin-top: 5px;
                            height: 19px;
                            line-height: 19px;
                            display: inline-block;
                            font-size: 12px;
                            color: #a2abb8;
                        }
                    }
                    .cancel-text {
                        /*已停用蒙版*/
                        box-sizing: border-box;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 100;
                        background-color: #fff;
                        opacity: 0.6;
                        span {
                            display: inline-block;
                            width: 80px;
                            height: 32px;
                            line-height: 32px;
                            text-align: center;
                            border-radius: 2px;
                            border: solid 1px #a0acbd;
                            font-size: 16px;
                            color: #a0acbd;
                            position: absolute;
                            left: 50%;
                            top: 24px;
                            transform: rotate(17deg);
                        }
                    }
                    .report-btns {
                        /*操作按钮*/
                        height: 80px;
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        position: relative;
                        .abs {
                            position: absolute;
                            /*right: 64px;*/
                            z-index: 101;
                            &.r {
                                right: 0;
                            }
                        }
                        button {
                            margin: 0 6px;
                            height: 32px;
                            font-size: 12px !important;
                        }
                        .w160 {
                            width: 160px;
                            /*margin-right: 260px;*/
                        }
                        .w80 {
                            width: 80px;
                            /*margin-left: 16px;*/
                        }
                        .circle {
                            /*position: absolute;*/
                            /*right: 0;*/
                            float: right;
                            /*top: 24px;*/
                            cursor: pointer;
                            margin-left: 32px;
                            text-align: center;
                            height: 32px;
                            width: 32px;
                            .unfold {
                                width: 32px;
                                height: 32px;
                                border-radius: 50%;
                                background-color: #dfe1e6;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                transition: all 0.7s;
                                .el-icon-arrow-down,
                                .el-icon-arrow-up {
                                    /*position: absolute;*/
                                    /*top: 8px;*/
                                    /*left: 8px;*/
                                    text-align: center;
                                    color: #fff;
                                    font-weight: 700;
                                    font-size: 16px;
                                }
                            }
                        }
                        .show-more-btn {
                            z-index: 200;
                        }
                        .show-more-wrap {
                            position: absolute;
                            top: 60px;
                            right: 5px;
                            width: 139px;
                            font-size: 12px;
                            color: #3b3b3b;
                            background: white;
                            box-shadow: 0px 4px 10px 0px rgba(0, 17, 51, 0.1);
                            border-radius: 2px;
                            border: 1px solid #dce0e6;
                            z-index: 201;
                            li {
                                line-height: 32px;
                                padding: 0 10px;
                                cursor: pointer;
                                &:hover {
                                    background: rgba(240, 243, 247, 1);
                                }
                                .icon {
                                    width: 14px !important;
                                    height: 14px !important;
                                    margin-right: 5px;
                                }
                            }
                            .cancel-text-li {
                                opacity: 0.6;
                            }

                        }
                    }
                }
                .report-tail {
                    cursor: pointer;
                    border-top: 4px solid #f0f2f5;
                    padding: 24px 32px;
                    box-sizing: border-box;
                    border-radius: 2px;
                    background-color: #ffffff;
                    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
                    position: relative;
                    .img-box {
                        img {
                            cursor: pointer;
                            max-width: 100%;
                            max-height: 100%;
                        }
                    }
                    .big-img {
                        margin-top: 16px;
                        cursor: pointer;
                        text-align: center;
                        font-family: MicrosoftYaHei;
                        font-size: 12px;
                        color: #a2abb8;
                    }
                    .img-cancel {
                        /*图片蒙版撤销状态*/
                        background-color: #fff;
                        opacity: 0.6;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        span {
                            display: inline-block;
                            width: 80px;
                            height: 32px;
                            line-height: 32px;
                            text-align: center;
                            border-radius: 2px;
                            border: solid 1px #a0acbd;
                            font-size: 16px;
                            color: #a0acbd;
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: rotate(17deg);
                        }
                    }
                }
            }
        }
        #report-dialog {
            /*工位权限弹窗*/
            .group-worker {
                line-height: 36px;
                .text-des {
                    font-size: 14px;
                    color: #a2abb8;
                }
                .group-search {
                    text-align: right;
                }
            }
            .worker-list {
                margin-top: 12px;
                border: 1px solid #e6e8eb;
                box-sizing: border-box;
                .list-head {
                    height: 34px;
                    line-height: 34px;
                    padding: 0 16px;
                    border-bottom: 1px solid #e6e8eb;
                }
                .list-item {
                    overflow: hidden;
                    padding-left: 16px;
                    padding-top: 20px;
                    height: 400px;
                    overflow-y: auto;
                    .el-col {
                        margin-bottom: 15px;
                    }
                }
            }
        }
        #img-dialog {
            /*报表类型弹窗*/
            .img-content {
                margin-bottom: 16px;
                width: 100%;
                height: 249px;
                background-color: #ffffff;
                padding: 16px 0;
                cursor: pointer;
                .img-box {
                    width: 100%;
                    height: 100%;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .big-img {
                margin-top: 16px;
                font-size: 12px;
                color: #a2abb8;
                text-align: center;
                cursor: pointer;
            }
            .add-and-tart-btns {
                margin-top: 32px;
                text-align: right;
                button {
                    margin-left: 16px;
                }
            }
        }
    }
</style>

<!--全局样式-->
<style lang="scss" scoped>
    .home_content {
        .home_content--main {
            padding-top: 16px;
        }
    }
    .el-select-dropdown__item.selected span{
        color:#fff !important;
    }
    #report-manage {
        .dialog-wrap{
            left:50% !important;
        }
        .page_title {
            padding-bottom: 0;
        }
        .page_title--head {
            font-size: 16px;
            line-height: 32px;
        }
        .el-input {
            font-size: 12px;
        }
        .el-input__inner {
            height: 32px;
        }
        .nf-button span {
            font-size: 12px;
            a {
                display: block;
                color: #808080;
            }
            i {
                position: relative;
                top: 2px;
            }
        }
        .options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: red;
            font-size: 14px;
            .options-item {
                flex: 1;
                color: #2c2c2c;
                background-color: red;
            }
            .options-add {
                width: auto;
            }
        }
        #select-report {
            min-width: 260px;
            .el-select-dropdown {
                top: 130px !important;
                .el-scrollbar {
                    .el-select-dropdown__wrap {
                        //最大高度
                        max-height: 100px !important;
                        .el-select-dropdown__list {
                            .el-select-dropdown__item .selected {
                                background-color: red !important;
                            }
                            .el-select-dropdown__item .selected .hover {
                                background-color: red !important;
                            }
                        }
                    }
                }
            }
        }
        /*权限弹窗样式*/
        #report-dialog {
            .el-dialog--tiny {
                width: 624px;
            }
            .el-dialog__header {
                padding: 0;
                line-height: 50px;
                text-align: center;
                height: 50px;
                font-family: MicrosoftYaHei;
                font-size: 18px;
                color: #2c2c2c;
                border-bottom: 1px solid #e6e8eb;
                box-sizing: border-box;
                .el-dialog__title {
                    font-size: 18px;
                    font-weight: normal;
                }
            }
            .el-dialog__body {
                padding: 24px 32px;
                .search-input {
                    input::-webkit-input-placeholder {
                        color: #2c2c2c;
                    }
                    input:-ms-input-placeholder {
                        color: #2c2c2c;
                    }
                    input::-moz-placeholder {
                        color: #2c2c2c;
                    }
                    input:-moz-placeholder {
                        color: #2c2c2c;
                    }
                }
                /*复选框*/
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    border: 1px solid #fff;
                }
            }
            .dialog-footer {
                padding-right: 12px;
                display: flex;
                justify-content: flex-end;
                button {
                    margin-left: 16px;
                }
            }
        }
        /*图片弹窗样式*/
        #img-dialog {
            .el-dialog--tiny {
                width: 1000px;
            }
            .el-dialog__header {
                padding: 0;
                line-height: 50px;
                text-align: center;
                height: 50px;
                font-family: MicrosoftYaHei;
                font-size: 18px;
                color: #2c2c2c;
                border-bottom: 1px solid #e6e8eb;
                box-sizing: border-box;
                .el-dialog__title {
                    font-size: 18px;
                    font-weight: normal;
                }
            }
            .el-dialog__body {
                padding: 24px 32px;
                /*复选框*/
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    border: 1px solid #fff;
                }
            }
            .dialog-footer {
                padding-right: 12px;
                display: flex;
                justify-content: flex-end;
                button {
                    margin-left: 16px;
                }
            }
        }
    }
</style>
