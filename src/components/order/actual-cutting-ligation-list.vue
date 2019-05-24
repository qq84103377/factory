<template>
    <div class="list-container">
        <page-title>
            <span class="list-container__title" slot="title" v-if="ligationData.ligationInfo">
                已生成扎号：{{  ligationData.ligationInfo.ligationNumber }} 扎 / {{ ligationData.ligationInfo.total }} 件，
                床次：<i>{{ ligationData.ligationInfo.latheNames && ligationData.ligationInfo.latheNames.length }} </i>床
            </span>
            <nf-button @click="$router.back()">返回上一级</nf-button>
        </page-title>
        <mission-info class="list-container__header" :missionInfo="missionData.mission"></mission-info>
        <el-row type="flex" justify="space-between" class="list-container__filter">
            <el-col :span="18">
                <el-form ref="filterForm" :model="formData" label-width="80px">
                    <el-col :span="8">
                        <el-form-item class="list-container__form-item mgl30" label="床次" prop="lathes">
                            <el-select v-model="formData.lathes" multiple placeholder="请选择">
                                <el-option
                                        v-for="item in latheOptions"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="list-container__form-item" label="完成人员" prop="userIds">
                            <workerLeader  v-model="formData.userIds" :placeholder="'请选择完成人员'"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item class="list-container__form-item date-item" label="完成日期" prop="endDateRange">
                            <el-date-picker
                                    v-model="formData.endDateRange"
                                    type="daterange"
                                    align="right"
                                    placeholder="选择日期范围"
                                    @change="handleEndDateChange"
                                    range-separator="/"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-col>
            <div class="list-container__btn-group">
                <button class="btn btn--reset" @click="resetForm">重置</button>
                <button class="btn btn--filter" @click="fetchLigationList">筛选</button>

            </div>
        </el-row>
        <el-row class="list-container__filter">
            <div class="list-container__btn-group">
                <button class="btn btn--export" @click="exportExcel">导出表格</button>
                <button class="btn btn--print" @click="printGo('printCuttingRecord')">打印裁床记录</button>
                <button class="btn btn--print" @click="printGo('printBeginAll')">批量打印条码</button>
                <button class="btn btn--print fr" @click="chipConfigVisibleShow">裁片组配置</button>
            </div>

        </el-row>

        <!--裁床记录打印-->
        <div id="printCuttingRecord" style="display: none">
            <div class="printCuttingRecord">
                <h3 style="text-align: center;">裁床记录表</h3>
                <p style="overflow: hidden;margin: 20px 0;">
                    <span class="fl"><span style="margin-right: 20px;">制单日期：{{cuttingRecordPrint.deliveryAt}}</span><span style="margin-right: 20px;">款号：{{cuttingRecordPrint.styleNo}}</span><span style="margin-right: 20px;">总数：{{totalNum}}</span>床次：{{cuttingRecordPrint.latheStr}}    </span>
                    <span class="fr" style="margin-right: 10px;">打印时间：{{getNowFormatDate()}}</span>
                </p>
                <div style="display: flex;margin-bottom: 20px;">
                    <el-table
                            style="width: auto;"
                            :data="cuttingRecordPrint.header"
                    >
                        <el-table-column
                                prop="colorNoName"
                                label="规格"
                                width="180">
                            <template slot-scope="scope">
                                <el-row
                                        class="standard"
                                        type="flex">
                                    <div class="standard--left">
                                        {{ scope.row.colorNoName }}
                                    </div>
                                    <div class="standard--right">
                                        <p class="standard__length" v-for="lengthItem in scope.row.standardSizes" :key="lengthItem.standardId">{{ lengthItem.standardName}}</p>
                                    </div>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-for="(item,index) in cuttingRecordPrint.headerMetadata" :key="index"
                                :label="item"
                                width="70">
                            <template slot-scope="scope">
                                <div v-for="(lengthItem,lengthIndex) in scope.row.standardSizes" :key="lengthItem.standardId" >
                                    <span>{{scope.row.standardSizes[lengthIndex].data[index]}}</span>
                                </div>
                            </template>
                        </el-table-column>


                    </el-table>
                </div>

                <el-row :gutter="4" style="width: 770px;">
                    <el-col style="margin-bottom: 14px;" :span="8" v-for="(item,index) in cuttingRecordPrintDataFir" :key="index">
                        <div style="border: 1px solid #000;" class="cuttingRecordTable">
                            <div style="display: flex;">
                                <div style="width: 80px;">扎号</div>
                                <div>颜色</div>
                                <div>码数</div>
                                <div>数量</div>
                                <div>工号</div>
                            </div>
                            <div v-for="($item,$index) in item" :key="$index" style="display: flex;">
                                <div>{{$item.latheSerialNo}}</div>
                                <div>{{$item.colorName}}</div>
                                <div>{{$item.sizeName}}</div>
                                <div>{{$item.num}}</div>
                                <div></div>
                            </div>
                        </div>

                    </el-col>
                </el-row>
            </div>

        </div>

        <div class="list-container__table" v-show="!loading">
            <el-table
                    :data="ligationData.ligationList"
                    border
                    @sort-change="handleSort"
                    @select="selectLigationList"
                    @select-all="selectAllLigationList"
            >
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="床次"
                        prop="lathe"
                        width="94"
                        sortable="custom"></el-table-column>
                <el-table-column
                        label="扎号"
                        prop="ligationNo"
                        min-width="160"
                        sortable="custom"></el-table-column>
                <el-table-column
                        v-for="(item, index) in tableColumnConf"
                        :key="index"
                        :label="item.label"
                        :prop="item.prop"
                        v-if="showColumn(item)"
                        :min-width="item.width || ''"
                        :sortable="item.sort"></el-table-column>
                <el-table-column
                        label="操作"
                        width="100"
                >
                    <template slot-scope="scope">
                        <span style="cursor: pointer;color: #1CA1FF" @click="printGo(scope.row.ligationNo)">打印条码</span>
                        <printBarCoded :dataArr="fillter(scope.row)" :targetId="scope.row.ligationNo" :cutGroup="cutGroup" :numbers="num1"></printBarCoded>
                    </template>

                </el-table-column>
            </el-table>
            <el-row class="list-container__pagination" type="flex" justify="end">
                <el-pagination
                        style="padding: 0"
                        @current-change="handleCurrentChange"
                        :current-page.sync="formData.pageNo"
                        :page-size="formData.pageSize"
                        layout="total, prev, pager, next"
                        :total="pageTotal">
                </el-pagination>
            </el-row>
        </div>
        <div class="inline-loading" v-show="loading">
            <i class="el-icon-loading"></i>
        </div>
        <printBarCoded :dataArr="ligationDataPrint" :targetId="'printBeginAll'" :numbers="num1" :cutGroup="cutGroup"></printBarCoded>

        <!--//打印当前或者所有项弹窗-->
        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" :title="titleSel"
                   :visible.sync="operationVisible" :show-close="false" custom-class="custom-dialog" size="tiny">
            <div class="titleSelClass">
                <el-radio class="radio" v-model="radio" label="1" style="display: block">{{titleSelType}}当前页已选项
                </el-radio>
                <el-radio class="radio" v-model="radio" label="2" style="display: block">{{titleSelType}}所有匹配结果
                </el-radio>
                <p style="color: red">请选择其中一项后点击确定</p>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="operationVisible = false">取 消</el-button>
                <el-button type="primary" @click="determineOperation">确 认</el-button>
            </div>
        </el-dialog>
        <!--//打印份数弹窗-->
        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" title="打印条码"
                   :visible.sync="numbersVisible" :show-close="false" custom-class="custom-dialog numbersDialog" size="tiny">
            <div style="padding-left: 20px;display: flex">
                <div style="width: 80px;">裁片组：</div>
                <div style="width: 380px;">
                    <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox @change="handleCheckChange" v-model="item.check" v-for="item in chipConfigData" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
                    <span style="color: #FFA914;cursor: pointer;margin-bottom: 6px;display: inline-block" @click="chipConfigVisibleShow">+管理裁片组</span>
                </div>

            </div>
            <div>
                <span style="margin: 0 20px;">打印份数</span>
                <el-input-number v-model="num1" :min="1" :max="100"></el-input-number>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="numbersVisible = false">取 消</el-button>
                <el-button type="primary" @click="determinePrint">确 认</el-button>
            </div>
        </el-dialog>

        <chipConfig :chipConfigData="chipConfigData" :chipConfigVisible.sync="chipConfigVisible" :instanceId="instanceId"></chipConfig>

    </div>
</template>

<script>
    import MissionInfo from './common/mission-info';
    import printBarCoded from './common/printBarCoded.vue';
    import chipConfig from './common/chipConfig.vue';
    import {instanceMissionNodeInfo, ligationList, exportExcelLigation, printLigation,cbsgcGetList,cbsgcGetUpdate} from '@/api';

    export default {
        data() {
            return {
                chipConfigData:[],
                checkAll: false,
                cutGroup: [],
                chipConfigAddName:'',
                chipConfigAddVisible:false,
                chipConfigVisible:false,
                cuttingRecordPrint: {},
                cuttingRecordPrintDataFir: [],
                totalNum:0,
                titleSel: '导出表格选项',
                titleSelType: '导出',
                operationVisible: false,
                radio: '1',
                operationType: '',
                operationId: '',
                num1: 1,
                numbersVisible: false,
                loading: false,
                ligationDataPrint: [],
                missionData: {},
                ligationData: {},
                pageTotal: 1,
                formData: {
                    pageNo: 1,
                    pageSize: 20,
                    lathes: [],
                    userIds: [],
                    orderByLathe: 0,
                    orderByLigationNo: 0,
                    finishStartDate: '',
                    finishEndDate: '',
                    endDateRange: ''
                },
                tableColumnConf: [
                    {
                        width: 160,
                        prop: 'orderNo',
                        label: '工单号'
                    },
                    {
                        prop: 'styleNo',
                        label: '货品'
                    },
                    {
                        prop: 'colorNoName',
                        label: '颜色'
                    },
                    {
                        prop: 'sizeName',
                        label: '尺码'
                    },
                    {
                        prop: 'standardName',
                        label: '内长'
                    },
                    {
                        prop: 'num',
                        label: '数量'
                    },
                    {
                        prop: 'remark',
                        label: '扎号备注'
                    },
                    {
                        prop: 'finishUserName',
                        label: '完成人员'
                    },
                    {
                        prop: 'finishDate',
                        label: '完成日期'
                    }
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            };
        },
        components: {
            printBarCoded,
            MissionInfo,
            chipConfig,
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            missionId() {
                return this.$route.query['missionId'];
            },
            instanceId() {
                return this.$route.query['instanceWorkflowId'];
            },
            selectUserOptions() {
                return this.missionData.header && this.missionData.header.facUser;
            },
            latheOptions() {
                return this.ligationData.ligationInfo && this.ligationData.ligationInfo.latheNames
            },
            isShowLength() {
                return this.missionData.components && this.missionData.components.actual_cutting_ligation.goodsWithoutStandard;
            }
        },
        created() {
            this.fecthMissionInfo();
            this.fetchLigationList();
            this.cbsgcGetList();

        },
        methods: {

            // 获取裁片组列表
            cbsgcGetList(){
                cbsgcGetList({facMissionPrcdNodeId:this.instanceId}).then(res=>{
                    if(res.data.code===0){
                        console.log(res);
                        this.chipConfigData = res.data.data

                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            chipConfigVisibleShow(){
                this.chipConfigVisible=true;
                this.cbsgcGetList();
            },
            //全选
            handleCheckAllChange(val) {
                this.chipConfigData.forEach(item=>{
                    item.check=this.checkAll
                })
                // this.isIndeterminate = false;
            },
            handleCheckChange(){
                let flag = true;
                this.chipConfigData.forEach(item=>{
                    if(!item.check){
                        flag = false
                    }
                });
                this.checkAll = flag
            },
            getNowFormatDate() {
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            fillter(row) {
                let newArr = [];
                newArr.push(row)
                return newArr
            },
            showColumn(row) {
                if (row.prop === 'standardName') {
                    return this.isShowLength;
                }
                else {
                    return true;
                }
            },
            fecthMissionInfo() {
                const params = {
                    userId: this.userId,
                    instanceWorkflowId: this.instanceId,
                    facId: this.facId,
                    missionId: this.missionId
                };
                instanceMissionNodeInfo(params)
                    .then(res => {
                        if (res.data.code !== 0) {
                            return this.$message.error(res.data.msg);
                        }
                        this.missionData = res.data;
                    });
            },
            fetchLigationList(params = {}) {
                const baseParams = {
                    missionId: this.missionId,
                    missionNodeId: this.instanceId,
                    ...this.formData,
                    ...params
                };
                this.loading = true;
                ligationList(baseParams)
                    .then(res => {
                        this.ligationData = res.data;
                        this.ligationDataPrint = [];
                        this.pageTotal = res.data.ligationInfo.pageTotal;
                        this.$nextTick(() => {
                            this.loading = false;
                        });
                    })
            },
            resetForm() {
                this.endDateRange = '';
                this.$refs['filterForm'].resetFields();
                this.fetchLigationList()
                console.log(this.formData)
            },
            handleSort({order, prop}) {
                const params = {
                    orderByLathe: 0,
                    orderByLigationNo: 0
                };
                this.formData.pageNo = 1;
                if (prop === 'lathe' && order === 'descending') {
                    params.orderByLathe = 1;
                }
                if (prop === 'ligationNo' && order === 'descending') {
                    params.orderByLigationNo = 1;
                }
                this.formData.orderByLathe = params.orderByLathe;
                this.formData.orderByLigationNo = params.orderByLigationNo;
                this.fetchLigationList();
            },
            handleEndDateChange(val) {
                const [start, end] = val.split('/');
                this.formData.finishStartDate = start;
                this.formData.finishEndDate = end;
                console.log(this.formData)
            },
            handleCurrentChange(val) {
                this.formData.pageNo = val;
                this.fetchLigationList();
            },
            exportExcel() {
                this.operationType = 'export';
                this.titleSel = '导出表格选项';
                this.titleSelType = '导出';
                this.operationVisible = true;


            },
            //人员分组
            getManId(arr) {
                this.formData.userIds = arr
            },


            // 打印条码
            printGo(id) {

                if (id == 'printBeginAll') {
                    // this.numbersVisible = true
                    this.operationType = 'print';
                    this.titleSel = '批量打印选项';
                    this.titleSelType = '打印';
                    this.operationVisible = true;
                    return
                }else if (id == 'printCuttingRecord') {
                    this.operationType = 'printCuttingRecord';
                    if(this.ligationDataPrint.length===this.ligationData.ligationList.length){

                        this.titleSel = '批量打印裁床记录选项';
                        this.titleSelType = '打印';
                        this.operationVisible = true;

                    }else {
                        this.determineOperation()
                    }
                    return
                }else {
                    this.operationType = 'printOne';
                    this.operationId = id;
                    this.numbersVisible = true
                }


            },
            determinePrint() {
                this.cutGroup = this.chipConfigData.filter(item=>item.check);
                if(!this.cutGroup.length){
                    this.cutGroup.push({})
                }
                if(this.operationType==='print'){
                    //批量打印
                    //打印的筛选下的所有
                    if (this.radio == 2) {
                        this.formData.pageSize = 99999;
                        this.formData.pageNo = 1;
                        const baseParams = {
                            missionId: this.missionId,
                            missionNodeId: this.instanceId,
                            ...this.formData,
                        };
                        ligationList(baseParams)
                            .then(res => {
                                this.ligationDataPrint = res.data.ligationList;
                                this.$nextTick(() => {
                                    // 1.设置要打印的区域 div的className 批量打印
                                    this.printOperationGo('printBeginAll')
                                });
                            })
                    } else {
                        this.$nextTick(() => {
                            // 1.设置要打印的区域 div的className 批量打印
                            this.printOperationGo('printBeginAll')
                        });
                    }
                }else {
                    // 1.设置要打印的区域 div的className

                    this.$nextTick(function () {
                        let newstr = document.getElementById(this.operationId).innerHTML;
                        console.log(newstr);
                        // 2. 复制给body，并执行window.print打印功能
                        document.body.innerHTML = newstr;
                        // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
                        let oldstr = document.body.innerHTML;
                        window.print();
                        window.location.reload();
                        document.body.innerHTML = oldstr;
                        return false
                    })

                }


            },
            //批量打印方法封装
            printOperationGo(id) {
                let newstr = document.getElementById(id).innerHTML;

                // 2. 复制给body，并执行window.print打印功能
                document.body.innerHTML = newstr
                // document.getElementById('app').innerHTML = newstr;
                // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
                let oldstr = document.body.innerHTML;
                window.print();
                window.location.reload();
                document.body.innerHTML = oldstr;
                document.getElementById('app').innerHTML = oldstr;
                return false
            },
            //多选框选择打印
            selectLigationList(checkData) {
                this.ligationDataPrint = checkData
            },
            selectAllLigationList(checkData) {
                this.ligationDataPrint = checkData;
            },
            //操作弹窗确定
            determineOperation() {
                // 批量打印裁床记录选项
                if (this.ligationDataPrint.length == 0 && this.radio == 1) {
                    this.$message.error('请勾选要导出的数据')
                    this.operationVisible = false;
                    return
                }
                if (this.operationType === 'print') {
                    //打印的扎号列表
                    this.numbersVisible = true
                } else if (this.operationType === 'printCuttingRecord') {
                    //打印的裁床
                    let ligationSerialNums = []
                    const baseParams = {
                        missionId: this.missionId,
                        missionNodeId: this.instanceId,
                        ...this.formData,
                    };
                    if (this.radio == 2) {
                        delete baseParams.pageNo;
                        delete baseParams.pageSize;
                    } else {
                        this.ligationDataPrint.forEach(item => {
                            ligationSerialNums.push(item.ligationSerialNum)
                        });
                        baseParams.ligationSerialNums = ligationSerialNums
                    }
                    printLigation(baseParams).then(res => {
                        console.log(res);
                        if (res.data.code === 0) {
                            this.cuttingRecordPrint = res.data.data;
                            //总数列
                            let num = 0;
                            this.cuttingRecordPrint.body.forEach(item=>{
                                if(item.num){
                                    num+=item.num
                                }
                            });
                            console.log(num);
                            this.totalNum = num;

                            let cuttingRecordPrintDataFir = [];
                            const length = Math.ceil(res.data.data.body.length / 10);
                            for (let i = 0; i < length; i++) {
                                cuttingRecordPrintDataFir.push(res.data.data.body.splice(0, 10))
                            }
                            this.cuttingRecordPrint.headerMetadata.push('合计');


                            this.cuttingRecordPrintDataFir = cuttingRecordPrintDataFir;

                            // return
                            this.$nextTick(() => {
                                // 1.设置要打印的区域 div的className 批量打印
                                this.printOperationGo('printCuttingRecord')
                            });
                        } else {
                            this.$message.error(res.data.msg)
                        }
                        this.operationVisible = false;
                    })
                } else {
                    //导出表格的
                    let ligationSerialNums = []

                    if (this.radio == 1) {
                        this.ligationDataPrint.forEach(item => {
                            ligationSerialNums.push(item.ligationSerialNum)
                        })
                        this.formData.pageSize = 20
                    } else {
                        this.formData.pageSize = 99999
                        this.formData.pageNo = 1
                    }
                    const baseParams = {
                        ligationSerialNums: ligationSerialNums,
                        missionId: this.missionId,
                        missionNodeId: this.instanceId,
                        ...this.formData,
                        excelType: Number(this.isShowLength)
                    };
                    exportExcelLigation(baseParams)
                        .then(res => {
                            this.operationVisible = false;
                            const fileData = res.data;
                            let url = window.URL.createObjectURL(fileData);
                            let a = document.createElement('a');
                            a.setAttribute('href', url);
                            a.setAttribute('download', '扎号列表.xls');
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .inline-loading {
        text-align: center;
        line-height: 100px;
        background: #fff;
    }

    .list-container {
        .mgl30 {
            margin-left: -30px;
        }
        &__title {
            font-size: 16px;
        }
        &__header {
            background: #fff;
            border: none;
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
        }
        &__filter {
            margin: 12px 0;
            padding: 12px;
            background: #fff;
            box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
        }
        &__form-item {
            margin-bottom: 0;
            margin-right: 22px;
        }
        &__btn-group {
            /*text-align: right;*/
            font-size: 0;
            overflow: hidden;
            .btn {
                box-sizing: border-box;
                line-height: 1;
                padding: 10px 12px;
                margin-left: 8px;
                font-size: 12px;
                color: #808088;
                border-radius: 2px;
                border: 1px solid rgba(220, 224, 230, 1);
                &:hover {
                    opacity: .7;
                }
            }
            .btn--filter {
                color: #fff;
                border: 1px solid #54D1BC;;
                background: #54D1BC;
            }
            .btn--print {
                color: #fff;
                border: 1px solid #FFA914;;
                background: #FFA914;
            }
        }
        &__pagination {
            margin-top: 16px;
        }

    }

</style>

<style lang="scss">
    .numbersDialog{
        width: 540px;
        .el-checkbox + .el-checkbox{
            margin-left: 0;

        }
        .el-checkbox{
            margin-bottom: 6px;
            width: 33%;
            display: inline-block;
            float: left;
        }
    }
    .list-container__table {
        th {
            background-color: #F5F7FA;

        }
        th>div{
            padding: 0;
        }
        th > .cell {
            font-size: 12px;
            font-weight: normal;
            color: #A2ABB8;
            background-color: #F5F7FA;
        }
        .el-table__body {
            .cell,
            td {
                background: #fff;
            }
            .cell {
                color: #3b3b3b;
                height: 100%;
                line-height: 28px;
            }
        }
        td,
        th {
            height: 28px;
            line-height: 28px;
        }
        .el-select__tags {
            max-width: 100% !important;
            width: 100%;
        }
    }

    .list-container {
        .el-date-editor.el-input.el-date-editor--daterange {
            width: 100% !important;
        }

    }

    .customClass {
        .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid rgb(223, 228, 236);
            padding-bottom: 10px;
        }
    }

    .titleSelClass {
        text-align: center;
        .el-radio {
            margin-left: 0;
            margin-bottom: 8px;
        }
        .el-radio + .el-radio {
            margin-bottom: 20px;
        }
    }

    .cuttingRecordTable > div {
        display: flex;
        /*height: 20px;*/
        line-height: 20px;
        div {
            flex: 1;
            /*height: 20px;*/
            line-height: 20px;
            border: 1px solid #000;
            text-align: center;
        }
        div:first-child{
            flex: 1.8;
        }
        div:nth-child(2){
            flex: 1.4;
        }
        div:nth-child(3){
            flex: 1.2;
        }
    }
    .printCuttingRecord{
        .el-table{
            width: auto;
            border-bottom: 2px solid #000;
            border-right: 2px solid #000;
            th>div{
                padding: 0;
                text-align: center;
            }
        }
        .el-table__body td .cell {
            padding: 0;
            line-height: 30px;
            background: #fff;
            text-align: center;
        }
        .standard {
            background-color: #F5F7FA;
            &--left {
                flex: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            &--right {
                text-align: center;
                flex: 1;
                border-left: 2px solid #000;
                .standard__length {
                    line-height: 30px;
                    box-sizing: border-box;
                    &:not(:last-child) {
                        border-bottom: 1px solid #000;
                    }
                }
            }
        }
        .borderBottom{
            border-bottom: 2px solid #000;

        }
        .el-table td, .el-table th.is-leaf{
            height: auto;
            border: 2px solid #000;
            border-bottom: none;
            border-right: none;
        }
    }

</style>
