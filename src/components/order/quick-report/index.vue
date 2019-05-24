<template>
    <el-dialog
        custom-class="node-report__dialog"
        :title="dialogTitle"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="currentVisible"
        size="large">
        <!-- content -->
        <div class="node-report__content">
            <el-form
                :model="formData"
                :inline="true"
                :rules="rules"
                ref="reportForm">
                    <el-form-item label="完成日期" prop="dateCompleted">
                        <el-date-picker
                                :disabled="finishtimeSet"
                                v-model="formData.dateCompleted"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            @change="handlePickDate"
                            :picker-options="pickerOptions"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="完成人员" prop="chargerId" style="margin-left: 50px">
                        <workerLeader ref="refWorkerLeader" :isDisabled="finishpeopleSet"  :single="'single'" v-model="formData.chargerId"  :placeholder="'选择完成人员'" style="width: 245px;"></workerLeader>
                    </el-form-item>
                    <el-form-item v-if="isMaterial" label="送料仓库" prop="storehouseId" style="margin-left: 50px">
                        <el-select @change="storeChange" v-model="formData.storehouseId" placeholder="选择送料仓库">
                            <el-option
                                v-for="item in storehouseList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
            </el-form>
            <main v-show="!loading">
                <!-- 工单信息 -->
                <mission-info :missionInfo="missionInfo" v-if="showMissionInfo"></mission-info>
                <!-- 工单信息 end-->
                <!-- 裁床床次input -->
                <template v-if="isCuttingNode">
                    <el-form
                        style="margin-top: 16px"
                        :model="formData"
                        :inline="true"
                        :rules="rules"
                        ref="latheForm">
                        <el-form-item label="床次" prop="lathe" style="margin-bottom: 0">
                            <el-input v-model="formData.lathe" placeholder="请输入床次"></el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <!-- 裁床床次input end-->

                <!-- 出、入库 start-->
                <template v-if="isStoreType">
                    <el-form
                        style="margin-top: 16px"
                        :model="formData"
                        :inline="true"
                        :rules="rules"
                        ref="storeForm">
                        <el-form-item
                            :label="nodeInfo.typeCode === 'tail-in-store' ? '入库仓库' : '出库仓库'"
                            prop="storehouseId"
                            style="margin-bottom: 0">
                                <el-select v-model="formData.storehouseId" placeholder="请选择仓库">
                                    <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                        </el-form-item>
                    </el-form>
                </template>
                <!-- 出、入库 end-->
                <!-- 总数型 -->
                <template v-if="isTotalNode">
                    <el-input
                        type="number"
                        class="total-node__input"
                        v-model="formData.quantity"
                        placeholder="请输入上报数量"
                        @change="handleSkuValChange"></el-input>
                    <p class="total-node__status">
                        完成情况：{{ fastReportData.completed }}/{{ fastReportData.target }}
                    </p>

                    <!-- 总数型进度 -->
                    <div class="total-node__progress">
                        <progress-success
                        :sum="fastReportData.target"
                        :num="fastReportData.completed"
                        :report="true"
                        :reportNum="formData.quantity"/>
                    </div>
                    <!-- <progress-success :sum="instanceWorkflow.components.total.target" :num="instanceWorkflow.components.total.completed" :report="true" :reportNum="totalNum">
                    </progress-success> -->
                </template>
                <!-- 总数型 end-->
                <!-- 到料型 -->
                <template v-if="isMaterial">
                    <material-table style="margin-top: 20px;" :is-report="true" :materials="fastReportData.materials" @changeStatus="changeStatus"></material-table>
                </template>
                <!-- 到料型end -->
                <!-- sku 表格 -->
                <div v-if="fastReportData.metadatas">
                    <nf-sku-table
                        ref="nfskutable"
                        editable
                        :metadatas="fastReportData.metadatas"
                        :quantities="quantities"
                        style="margin-top: 20px"
                        @change="handleSkuValChange"></nf-sku-table>
                </div>
                <!-- sku 表格 end -->
                <!-- 抽检型 -->
                <template  v-if="isSelectCheck" style="width:100%">
                    <sampling-report-table :formData="selectCheckData"></sampling-report-table>
                </template>
                
            </main>
            <p class="empty-content" v-show="loading">
                <i class="el-icon-loading"></i>
            </p>
        </div>
        <!-- content end -->
        <!-- footer start -->
        <div class="node-report__footer" slot="footer">
            <nf-button class="btn-cancel" @click="cancel">取消</nf-button>
            <nf-button type="warning" @click="submit" :loading="btnLoading">确定</nf-button>
        </div>
        <!-- footer end -->
    </el-dialog>
</template>

<script>
import MissionInfo from './mission-info';
// import SkuTable from '../../service/serviceTable';
import ProgressSuccess from '../orderDetail/node-detail/progress-success';
import MaterialTable from '../orderDetail/node-detail/material-table';
import samplingReportTable from '../reportRecord/sampling-report-table'
import { formatDate } from '@/utils';
import { getReportData, commonNodeReport, storeList, materialChangeSuccess } from '@/api';
import Mixin from '../orderDetail/mixin';
export default {
    props: {
        visible: Boolean,
        nodeInfo: Object
    },
    components: {
        MissionInfo,
        // SkuTable,
        ProgressSuccess,
        MaterialTable,
        samplingReportTable
    },
    mixins: [Mixin],
    data() {
        return {
            loading: false,
            btnLoading: false,
            tableData: {
                colors: []
            },
            missionInfo: {},
            fastReportData: {},
            storehouseList: [], // 仓库列表
            formData: {
                chargerId: '',
                dateCompleted: '',
                storehouseId:'',
                storehouseName:'',
                quantity: ''
            },
            rules: {
                chargerId: [
                    {
                        required: true,
                        message: '请选择完成人员！'
                    }
                ],
                dateCompleted: [
                    {
                        required: true,
                        message: '请选择完成日期！'
                    }
                ],
                lathe: [
                    {
                        required: true,
                        message: '请输入床次！'
                    }
                ],
                storehouseId: [
                    {
                        required: true,
                        message: '请选择仓库！'
                    }
                ]
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            quantities: [],     //上报弹窗表格数据

        }
    },
    computed: {
        currentVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('update:visible', val);
            }
        },
        dialogTitle() {
            return `${this.nodeInfo.nodeName}-快速上报`
        },
        isBoss() {
            const info = sessionStorage.getItem('user_login');
            return JSON.parse(info).role === 1;
        },
        facId() {
            return JSON.parse(sessionStorage.getItem("user_login")).unitId;
        },
        userId() {
            return JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        // 裁床数量型、裁床唯一码型
        isCuttingNode() {
            return [ 'actual-cutting-wym', 'actual-cutting' ].indexOf(this.nodeInfo.typeCode) > -1;
        },
        // 总数型
        isTotalNode() {
            return this.nodeInfo.typeCode === 'totality';
        },
        // 到料型
        isMaterial() {
            return this.nodeInfo.typeCode === 'material';
        },
        // 抽检型
        isSelectCheck() {
            return this.nodeInfo.typeCode === 'select-check';
        },
        // 出库、入库型
        isStoreType() {
            return [ 'tail-in-store', 'tail-out-store' ].indexOf(this.nodeInfo.typeCode) > -1;
        },
        showMissionInfo() {
            return !this.isTotalNode;
        },
        // 抽检型数据
        selectCheckData() {
           let selectCheckData = {
                fabricatingPlantName: this.nodeInfo.fabricatingPlantName,
                fabricatingPlantCode: this.nodeInfo.fabricatingPlantCode,
                waitDeliveryQuantity: this.nodeInfo.waitDeliveryQuantity,
                tableData: [
                    {
                        deliveryQuantity: '',
                        selectCheckQuantity: 0,
                        qualified: 0,
                        defectived: 0,
                        wasted: 0,
                        pop: 0,
                    }
                ]
            }
            return selectCheckData
        },
        reportTotalNum() {
            if (this.isTotalNode) {
                return this.formData.quantity;
            }
            else if(this.isMaterial) {
                return this.getMaterialSkus().length;
            }
            else if(!this.isSelectCheck) {
                const val = this.$refs['nfskutable'].getSkuTableValue();
                return Object.keys(val).reduce((num, key) => {
                    return num += Number(val[key].num);
                }, 0);
            }
            return 0;
        },
        finishtimeSet() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.node.finishDate.update")=== -1) {
                return true;
            }else {
                return false;
            }
        },
        finishpeopleSet() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (datalist.indexOf("fac.mission.node.finishBy.update")=== -1) {
                return true;
            }else {
                return false;
            }
        },
    },
    watch: {
        currentVisible(val) {
            if (val) {
                console.log(this.nodeInfo)
                this.resetFields();
                this.fetchReportData({
                    typeCode: this.nodeInfo.typeCode,
                    instanceId: this.nodeInfo.instanceId
                });
            }
        }
    },
    methods: {
        showDialog() {
            this.currentVisible = true;
        },
        closeDialog() {
            this.currentVisible = false;
        },
        // 初始化表单数据
        resetFields() {
            this.$refs['reportForm'] && this.$refs['reportForm'].resetFields();
            this.formData.dateCompleted = formatDate(new Date(), 'yyyy-MM-dd');
            this.$refs['nfskutable'] && this.$refs["nfskutable"].resetSkuTableData();
        },
        handlePickDate(val) {
            this.formData.dateCompleted = val;
        },
        // //送料仓库改变
        storeChange(val) {
            for (let materialItem of this.fastReportData.materials) {
                for (let skuItem of materialItem.materialSkus) {
                    for(let i = 0;i<skuItem.stockInfoList.length;i++) {
                        if(val == skuItem.stockInfoList[i].storehouseId) {
                            skuItem.storehouseLabel = skuItem.stockInfoList[i].storehouseLabel;
                            skuItem.materialSkuStock = skuItem.stockInfoList[i].materialSkuStock;
                        }else {
                            skuItem.storehouseLabel = "-";
                            skuItem.materialSkuStock = "-";
                        }
                    }
                }
            }
        },
        handleSkuValChange(val) {
            // let total;
            // if (this.isTotalNode) {
            //     total = this.formData.quantity;
            // }
            // else {
            //     total = Object.keys(val).reduce((num, key) => {
            //         return num += Number(val[key].num);
            //     }, 0);
            // }
            // this.reportTotalNum = total;
        },
        submit() {
            if (!this.reportTotalNum&&!this.isSelectCheck) {
                this.$message.error('请输入上报数量！');
                return;
            }
            this.$refs['reportForm'].validate((valid) => {
                if (valid) {
                    console.log(this.isCuttingNode)
                    if (this.isCuttingNode) {
                        this.$refs['latheForm'].validate((validLathe) => {
                            if (validLathe) {
                                this.report();
                            }
                        });
                        return;
                    }
                    else if(this.isStoreType) {
                        this.$refs['storeForm'].validate((validLathe) => {
                            if (validLathe) {
                                this.report();
                            }
                        });
                        return;
                    }
                    this.report();
                }
            });
        },
        // 上报接口
        report() {
            let params = {
                ...this.formData,
                instanceId: this.nodeInfo.instanceId,
                userId: this.userId,
                typeCode: this.nodeInfo.typeReportCode
            };
            if (!this.isTotalNode && !this.isMaterial &&!this.isSelectCheck) {
                let skus = this.getParamsOfSku();
                params.skus = skus;
            }
            if (this.isMaterial) {
                params.materialSkus = this.getMaterialSkus();
            }
            if (this.isSelectCheck) {
                params = {
                    ...this.selectCheckData.tableData[0],
                    userId: this.userId,
                    dateCompleted: this.formData.dateCompleted,
                    chargerId: this.formData.chargerId,
                    instanceId: this.nodeInfo.instanceId,
                    missionNodeId: this.nodeInfo.instanceId,
                    typeCode: 'select_check'
                }
                if (this.selectCheckData.tableData[0].deliveryQuantity === '') return this.$message.error('交货数量不能为空')
                if (this.selectCheckData.tableData[0].selectCheckQuantity === '') return this.$message.error('抽检数不能为空')
                if (this.selectCheckData.tableData[0].qualified === '') return this.$message.error('合格数不能为空')
                if (this.selectCheckData.tableData[0].defectived === '') return this.$message.error('次品数不能为空')
                if (this.selectCheckData.tableData[0].wasted === '') return this.$message.error('废品数不能为空')
            }
            this.btnLoading = true;
            commonNodeReport(params)
            .then(res => {
                this.btnLoading = false;
                if (res.data.code === 0) {
                    this.closeDialog();
                    this.formData.quantity = '';
                    this.$message.success('上报成功');
                    this.$emit('success');
                    return;
                }
                this.$refs.refWorkerLeader.manId = ''
                this.$message.error(res.data.msg);
            });
        },
        fetchReportData(params) {
            this.loading = true;
            getReportData(params)
            .then(res => {
                this.missionInfo = res.data.header;
                this.quantities = res.data.quantities;      //获取上报数量表格数据
                console.log(this.isBoss,'this.isBoss')
                console.log(res.data.header.chargers.length,'res.data.header.chargers.length')
                console.log(this.nodeInfo.chargers[0],'this.nodeInfo.chargers[0]')

                // this.formData.chargerId = !this.isBoss ? this.userId : res.data.header.chargers.length ? this.nodeInfo.chargers[0].id : '';
                // 上报时存在以下情形：
                // 1、节点有负责人，默认选择“节点负责人”
                // 2、节点没有负责人，当前操作人不是老板号，默认选择当前操作人
                // 3、节点没有负责人，当前操作人为老板号，置空
                // 4、必填项，允许修改。
                this.formData.chargerId =this.nodeInfo.chargers.length ? this.nodeInfo.chargers[0].id:!this.isBoss ? this.userId:''
                console.log(this.formData.chargerId,191919191919191)

                if (!res.data.fastReport.metadatas) {
                }
                else {
                    // 裁床床次获取
                    this.getLathe(res.data.header);
                };
                // 获取仓库列表
                this.$nextTick(() => {
                    this.loading = false;
                    this.fastReportData = res.data.fastReport;
                    (this.isStoreType || this.isMaterial) && this.fetchStoreList();
                });
            })
        },
        //打开仓库更新仓位
        getStoreData() {
            if (!this.fastReportData.materials) return;
            for (let materialItem of this.fastReportData.materials) {
                for (let skuItem of materialItem.materialSkus) {
                    for(let i = 0;i<skuItem.stockInfoList.length;i++) {
                        if(this.formData.storehouseId == skuItem.stockInfoList[i].storehouseId) {
                            skuItem.storehouseLabel = skuItem.stockInfoList[i].storehouseLabel;
                            skuItem.materialSkuStock = skuItem.stockInfoList[i].materialSkuStock;
                        }else {
                            skuItem.storehouseLabel = "-";
                            skuItem.materialSkuStock = "-";
                        }
                    }
                }
            }
        },
        // 当节点为出入库是获取仓库列表
        fetchStoreList() {
            storeList({
                unitId: this.facId
            }).then(res => {
                const { storehouses } = res.data;
                this.storehouseList = storehouses;
                if (!storehouses.length) return;
                this.formData.storehouseId = storehouses[0].id;
                this.formData.storehouseName = storehouses[0].name;
                this.getStoreData();
            });
        },
        // 裁床数量获取
        getLathe(header) {
            if (this.isCuttingNode) {
                this.formData.lathe = header.lathe;
            }
        },
        getParamsOfSku() {
            const skuValObj = this.$refs['nfskutable'].getSkuTableValue();
            return Object.keys(skuValObj).reduce((arr, key) => {
                if (skuValObj[key].num) {
                    arr.push({
                        skuId: skuValObj[key].skuId,
                        quantity: skuValObj[key].num
                    });
                }
                return arr;
            }, []);
        },
        // 到料标记完成操作
        changeStatus(id) {
            let params = {
                bomIds: id,
                instanceId: this.nodeInfo.instanceId
            }
            materialChangeSuccess(params).then(res=>{
                if(res.data.code == 0) {
                    this.$message.success('修改成功');
                    this.fetchReportData({
                        typeCode: this.nodeInfo.typeCode,
                        instanceId: this.nodeInfo.instanceId
                    });
                    this.$emit('success');
                }
                else {
                    this.$message.error('修改失败');
                }
            });
        },
        // 当为到料型节点获取参数
        getMaterialSkus() {
            const arr = [];
            for (let materialItem of this.fastReportData.materials) {
                for (let skuItem of materialItem.materialSkus) {
                    if ('quantity' in skuItem && skuItem.quantity) {
                        arr.push({
                            materialSkuId: skuItem.materialSkuId,
                            quantity: skuItem.quantity,
                            storehouseLabel: skuItem.storehouseLabel
                        });
                    }
                }
            }
            console.log(arr);
            return arr;
        },
        getManId(val){
            this.formData.chargerId=val
        },
        // 取消弹窗
        cancel(){
            this.$refs.refWorkerLeader.manId = ''
            this.currentVisible = false
        }
    }
}
</script>

<style lang="scss">
    .node-report__dialog {
        -webkit-user-select: none;
        .el-dialog__header {
            padding-bottom: 20px;
            text-align: center;
            border-bottom: 1px solid #e6eaf0;
        }
        .el-dialog__title {
            font-size: 20px;
        }
        .el-dialog__footer {
            padding-top: 15px;
            border-top: 1px solid #e6eaf0;
        }
        .btn-cancel {
            margin-right: 12px;
        }
        .empty-content {
            padding: 100px 0;
            text-align: center;
        }
        // 总数型样式--start
        .total-node__input {
            height: 72px;
            .el-input__inner {
                height: 100%;
                text-align: center;
                font-size: 30px;
            }
        }
        .total-node__status {
            margin-top: 16px;
        }
        .total-node__progress {
            padding: 0 26px;
        }
        // 总数型样式--end
    }
</style>
