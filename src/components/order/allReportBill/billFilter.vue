<template>
    <div class="bill-filter custom-filter-form">
        <el-form :model="form" status-icon ref="ruleForm2" label-width="90px" style="margin-left: -30px">
            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="节点">
                        <el-select
                                v-model="filterData.missionPrcdNodeId"
                                placeholder="请选择"
                                clearable
                                filterable
                                @change="selectNodeId">
                            <el-option
                                    v-for="item in nodeList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="单据">
                        <el-select
                                v-model="filterData.billId"
                                placeholder="搜索单据"
                                clearable
                                filterable
                                remote
                                :loading="loading"
                                :remote-method="remoteMethod">
                            <el-option
                                    v-for="item in billList"
                                    :key="item.billId"
                                    :label="item.billName"
                                    :value="item.billId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="完成时间">
                        <el-date-picker
                                v-model="businessDataList"
                                @change="changeCreateDate"
                                type="daterange"
                                placeholder="选择日期范围"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="完成人员">
                        <el-select v-model="filterData.chargerId" placeholder="请选择" clearable filterable >
                            <el-option
                                    v-for="item in purchaserList"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="单据类型">
                        <el-select v-model="filterData.billTypes" placeholder="请选择" clearable filterable multiple>
                            <el-option
                                    v-for="(item, index) in billTypesList"
                                    :key="index"
                                    :label="item.alias"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item label="单据状态">
                        <el-select v-model="filterData.billStatus" placeholder="请选择" clearable filterable multiple>
                            <el-option
                                    v-for="(item, index) in billStatusList"
                                    :key="index"
                                    :label="item.alias"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="18" :lg="12">
                    <template>
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </template>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {
        billReportNodeList,
        purchaseQueryListData,
        billReportBillType,
        billReportBillList,
        billReportBillStatus,
    } from "@/api";
    export default {
        name:'billFilter',
        props:['missionId','missionPrcdNodeId'],
        /*******************
         *
         * missionId:   工单id
         * missionPrcdNodeId:   工序节点id
         *
         *
         *
         * **********************/
        data() {
            return {
                filterData: {
                    missionPrcdNodeId: "",  //工单工序节点ID
                    billId: "",     //单据ID
                    chargerId: "",     //完成人员ID
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,
                    billTypes: [],      //单据类型
                    billStatus:[],      //单据状态
                    dateStart: "",      //时间开始
                    dateEnd: "",        //时间结束
                },
                businessDataList: [],       //完成时间
                nodeList:[],    //节点列表
                billList:[],    //单据列表
                purchaserList:[],    //完成人员列表
                billTypesList:[],   //单据类型列表
                billStatusList:[],   //单据状态列表
                loading: false,
                nondeIdFlag: true,  //nodeId标识，用于第一次触发
            }
        },
        watch:{
        },
        computed:{
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        methods:{
            //触发第一次筛选
            selectNodeId(){
                if(this.nondeIdFlag){
                    this.nondeIdFlag = false;
                    this.$emit('filter',this.filterData);
                }
            },
            //设置节点id,如果传了missionPrcdNodeId就获取，否则拿节点列表的第一个id
            setNodeId(){
                if(this.missionPrcdNodeId){
                    this.filterData.missionPrcdNodeId = this.missionPrcdNodeId;
                }else{
                    this.filterData.missionPrcdNodeId = this.nodeList[0].id;
                }
            },
            //单据搜索
            remoteMethod(query) {
                if(!this.filterData.missionPrcdNodeId){
                    this.$message.error('请选择节点');
                    return
                }
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let params = {
                            missionPrcdNodeId: this.filterData.missionPrcdNodeId,
                            keyword: query
                        };
                        billReportBillList(params).then(res => {
                            if (res.data.code === 0) {
                                this.billList = res.data.data;
                            }else{
                                this.billList = [];
                            }
                        });
                    }, 200);
                } else {
                    this.billList = [];
                }
            },
            // 获取节点列表
            getNodeList() {
                let params = {
                    missionId: this.missionId,
                };
                billReportNodeList(params).then(res=>{
                    if(res.data.code === 0){
                        this.nodeList = res.data.nodes;
                        this.setNodeId();
                    }
                })
            },
            //获取完成人员列表
            getPurchaserList() {
                let params = {
                    userId: this.userId,
                    factoryId: this.unitId
                };
                purchaseQueryListData(params).then(res => {
                    this.purchaserList = res.data.data.purchaserList; // 完成人员
                })
            },
            // 获取单据类型列表
            getBillTypesList(){
                billReportBillType().then(res=>{
                    if(res.data.code === 0){
                        this.billTypesList = res.data.data;
                    }
                })
            },

            // 获取单据状态列表
            getBillStatusList(){
                billReportBillStatus().then(res=>{
                    if(res.data.code === 0){
                        this.billStatusList = res.data.data;
                    }
                })
            },

            // 完成时间处理
            changeCreateDate(filterDate) {
                this.operateDataList = filterDate.split("至");
                //返回开始时间、结束时间
                if (this.operateDataList.length) {
                    this.filterData.dateStart = this.operateDataList[0];
                    this.filterData.dateEnd = this.operateDataList[1];
                }
            },

            reset() {
                this.setNodeId();
                this.filterData.billId = '';
                this.filterData.billTypes = [];
                this.filterData.billStatus = [];
                this.filterData.dateStart = '';
                this.filterData.dateEnd = '';
                this.businessDataList = [];
                this.filterData.chargerId = '';
            },
            submit() {
                this.$emit('filter',this.filterData);
            },
        },
        created() {
            this.getNodeList();
            this.getPurchaserList();
            this.getBillTypesList();
            this.getBillStatusList();
        }
    }
</script>

<style lang="scss" scoped>
    .bill-filter{
        background-color: #fff;
    }
</style>


