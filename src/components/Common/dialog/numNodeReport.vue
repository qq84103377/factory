<template>
    <div class="report-dialog">
        <el-dialog
                custom-class="nf-dialog-common"
                :visible.sync="isShow"
                title="编辑上报单据"
                @close="handleClose">
            <div class="dialog-body">
                <el-form
                        :model="formData"
                        label-width="80px"
                        inline>
                    <div class="form-wrap">
                        <el-col :span="12">
                            <el-form-item class="dialog__form-item is-required" label="完成日期" prop="endAt">
                                <el-date-picker
                                        :disabled="finishtimeSet"
                                        v-model="formData.dateCompleted"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        @change="handlePickDate">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="text-right" v-if="isOutsideFacNode">
                            <el-form-item
                                    class="dialog__form-item is-required"
                                    label="完成工厂">
                                <el-select
                                        v-model="formData.outsideFactoryId"
                                        :disabled="facMissionOutsideFlag"
                                        filterable
                                        placeholder="请选择完成工厂">
                                    <el-option
                                            v-for="item in outsideFactoryList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" :class="{'text-right' : !isOutsideFacNode}">
                            <el-form-item class="dialog__form-item is-required" label="完成人员">
                                <template v-if="nextFollowOtherFinishUserSelect">
                                    <el-select
                                            v-model="formData.chargerId"
                                            :disabled="finishpeopleSet"
                                            placeholder="选择完成人员">
                                        <el-option
                                                v-for="item in reportUserOptions"
                                                :key="item.id"
                                                :value="item.id"
                                                :label="item.name"></el-option>
                                    </el-select>
                                </template>
                                <template v-else>
                                    <workerLeader :single="'single'" :isDisabled="finishpeopleSet" v-model="formData.chargerId" :placeholder="'请选择完成人员'" ></workerLeader>
                                </template>

                            </el-form-item>
                        </el-col>
                    </div>
                    <el-row style="margin-bottom: 15px;">
                        <mission-info
                                class="dialog__mission-info"
                                :mission-info="missionData">
                        </mission-info>
                    </el-row>

                    <el-row>
                        <!--裁床数量型节点才显示“床次”-->
                        <el-col :span="12" v-if="nodeType === 'actual-cutting'">
                            <el-form-item
                                    class="dialog__form-item is-required"
                                    label="床次">
                                <el-input v-model.trim="formData.lathe" @blur="handleBlur" class="bed-input"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <nf-sku-table
                            ref="nfskutable"
                            editable
                            :showNum="true"
                            :editableAndInitial="true"
                            @change="handleSkuValueChange"
                            :metadatas="skuTableData.metadatas"
                            :quantities="skuTableData.quantities"
                            style="margin-top: 20px">
                    </nf-sku-table>
                    <el-row>
                        <outsideFacAndStation
                                v-if="billType ==='FAC_MISSION_COMPLETE' && reportSendSelectUser"
                                :formModel="formData"
                                :information="information">
                        </outsideFacAndStation>
                    </el-row>

                    <div class="adjust-cause" v-if="billType ==='FAC_MISSION_ADJUST'">
                        <span class="adjust-text">调整原因：</span>
                        <el-input class="adjust-textarea" type="textarea" maxlength="100" v-model="formData.adjustReason"></el-input>
                    </div>
                </el-form>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="space-between" align="center">
                <div class="count-total">
                    数量合计：<strong>{{totalNum}}</strong>
                </div>
                <div>
                    <nf-button @click="handleClose">取 消</nf-button>
                    <nf-button :loading="btnLoading1" type="warningsimple" @click="handleAddReport('DRAFT')">存为草稿</nf-button>
                    <nf-button :loading="btnLoading2" type="warning" @click="handleAddReport('REPORT')">提 报</nf-button>
                </div>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {
        nodeReportOutsideFactoryList,
        updateNumNode,
        updateBedNode,
        billReportDetail,
    } from "@/api";
    import outsideFacAndPrice from '@/components/order/common/outsideFacAndPrice';
    import MissionInfo from '@/components/order/common/mission-info';
    import outsideFacAndStation from '@/components/order/common/outsideFacAndStation';
    export default {
        name: "numNodeReport",
        props:['isShow','nodeType','billId','billType','isOutsideFacNode','facMissionOutsideFlag','missionNodeId','sendToFactoryId','sendToUserId',
            'upstreamNodeId','outsideNextFollowPre','reportUserOptions','reportSendSelectUser','reportSendSelectUserDefComplete'],
        /***************
         *
         * nodeType: 节点类型
         *          actual-cutting      //裁床-数量型
         *          actual-cutting-ligation     //裁床-扎号型
         *          select-check        //抽检型
         *          freedom_material        //自由送料型
         *          logical     //逻辑型
         *          material        //送料型
         *          quality-checking        //质检-单件流
         *          quantitative-detail     //数量明细型
         *          totality        //总数型
         *          tail-in-store       //尾部入库型
         *          tail-out-store      //发货型
         *          actual-cutting-wym      //裁床-唯一码型

         * billId: 单据id
         *
         * billType: 单据类型
         *          FAC_MISSION_COMPLETE("完成数单"),
         *          FAC_MISSION_DEFECTIVE("次品数单"),
         *          FAC_MISSION_WASTE("废品数单"),
         *          FAC_MISSION_ADJUST("调整数单"),
         *          FAC_RETURN_REPAIR("退回返修单");
         *
         * isOutsideFacNode: 节点关联外发
         * facMissionOutsideFlag: 整单外发
         * missionNodeId： 工单节点id
         *
         * sendToFactoryId      //发往工厂
         * sendToUserId         //发往工位
         * upstreamNodeId     //上游节点
         * outsideNextFollowPre    // 本节点外发/分活明细跟随上游节点
         * reportUserOptions  //上游节点发往工位
         * reportSendSelectUser   // 是否上报完成数的同时上报发往工厂、工位
         * reportSendSelectUserDefComplete // 是否发往工厂、工位默认取完成工厂、工位
         *
         * ***************/
        data(){
            return {
                formData: {
                    dateCompleted: "",      //完成日期
                    chargerId: "",   //完成人员
                    outsideFactoryId: "",   //完成工厂
                    lathe: "",              //床次
                    adjustReason: "",    //调整原因
                    sendToFactoryId: "ourFactory",
                    sendToUserId: "",
                },
                skuTableData:{
                    metadatas:[],
                    quantities:[],
                },
                missionData:[],
                selectPersonList: [],
                dialogOutsideFacId: '',     //上报弹窗要显示的默认完成工厂
                outsideFactoryList: [], // 完成工厂列表
                btnLoading1: false,
                btnLoading2: false,
                totalNum: 0,    //总数
                information:{
                    facMissionOutsideFlag: false
                }
            }
        },
        components:{
            outsideFacAndPrice,
            MissionInfo,
            outsideFacAndStation,
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId() {
                return (
                    this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId
                )
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
                let datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                if (datalist.indexOf("fac.mission.node.finishBy.update")=== -1) {
                    return true;
                }else {
                    return false;
                }
            },
            // 本节点有上游节点 && 本节点外发/分活明细跟随上游节点 && 上游节点的发往工位不为空
            nextFollowOtherFinishUserSelect(){
                if(this.upstreamNodeId && this.outsideNextFollowPre && (this.reportUserOptions && this.reportUserOptions.length)){
                    return true
                }else{
                    return false
                }
            },
        },
        watch:{
            isShow(val){
                if(val){
                    //节点关联外发，需要显示完成工厂
                    if(this.isOutsideFacNode){
                        this.getOutsideFactoryList();
                    }
                    //清空sku表格“一手”值
                    this.$refs["nfskutable"] && this.$refs["nfskutable"].resetSkuTableData();
                    this.getReportDialogData();
                }
            },
            facMissionOutsideFlag(val){
                this.information.facMissionOutsideFlag = val
            },
            'formData.outsideFactoryId': {
                handler(val){
                    //工单整单外发时，强制“发往工厂”跟随“完成工厂”
                    if(this.reportSendSelectUserDefComplete || this.facMissionOutsideFlag){
                        this.formData.sendToFactoryId = val;
                    }else{
                        this.formData.sendToFactoryId = this.sendToFactoryId;
                    }
                },
                deep:true
            },
            'formData.chargerId': {
                handler(val){
                    if(this.reportSendSelectUserDefComplete){
                        this.formData.sendToUserId = val;
                    }else{
                        this.formData.sendToUserId = this.sendToUserId;
                    }
                },
                deep:true
            },
        },
        methods:{
            //修改sku表格上报数量时，更新上报总数
            handleSkuValueChange(val, total) {
                this.totalNum = total;
            },
            //关闭弹窗
            handleClose(){
                this.$emit("update:isShow", false);
            },
            //完成日期选择
            handlePickDate(val) {
                this.formData.dateCompleted = val;
            },
            //完成工厂下拉列表
            getOutsideFactoryList(){
                let params= {
                    missionNodeId: this.missionNodeId,  // 工单节点id
                    userId: this.userId,        // 用户id
                    unitId: this.facId,        // 当前所在工厂id
                };
                nodeReportOutsideFactoryList(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList = res.data.data;
                        this.outsideFactoryList.forEach(item => {
                            if(item.name === '本厂'){
                                item.id = 'ourFactory'
                            }
                        })
                    }
                })
            },
            //获取弹窗数据
            getReportDialogData(){
                let params = {
                    userId: this.userId,
                    billId: this.billId,
                };
                billReportDetail(params).then(res=>{
                    if(res.data.code===0){
                        let data = res.data.data;
                        this.missionData = data.mission;    //工单表格数据
                        this.skuTableData.metadatas = data.metadatas;   //sku表格数据
                        this.skuTableData.quantities = data.quantities.skus; //sku表格已填值
                        this.formData.dateCompleted = data.reportInfo.dateCompletedStr;//完成日期
                        this.formData.chargerId = data.reportInfo.chargerId; //完成人员
                        this.formData.outsideFactoryId = data.reportInfo.outSideFactoryId ? data.reportInfo.outSideFactoryId : 'ourFactory'; //完成工厂
                        this.formData.lathe = data.reportInfo.lathe; //床次
                        this.formData.adjustReason = data.reportInfo.adjustReason;  //调整原因
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //床次输入验证
            handleBlur() {
                const reg = /\W+/gi;
                if (reg.test(this.formData.lathe)) {
                    this.$set(this.formData, "lathe", '');
                    return this.$message.error('只能输入字母和数字');
                }
            },
            //必填校验
            checkFormData(){
                if(!this.formData.dateCompleted){
                    this.$message.error("完成日期不能为空");
                    return false;
                }
                if(!this.formData.chargerId){
                    this.$message.error("完成人员不能为空");
                    return false;
                }
                //节点配置了“外发”（ps: 完成工厂肯定是有值的，所以注释）
                // if(this.isOutsideFacNode){
                //     if (!this.formData.outsideFactoryId) {
                //         this.$message.error("完成工厂不能为空");
                //         return false;
                //     }
                // }
                // 裁床数量型节点，床次必填
                if(this.nodeType === 'actual-cutting'){
                    if(!this.formData.lathe){
                        this.$message.error("床次不能为空");
                        return false;
                    }
                }
                //日期和完成人员判断
                if (!this.checkAddReportSku()) {
                    this.$message.error("上报数量不能全部为0！");
                    return false;
                }
                //调整数上报
                if(this.billType === 'FAC_MISSION_ADJUST'){
                    if(!this.formData.adjustReason){
                        this.$message.error("调整原因不能为空");
                        return false;
                    }
                }
                return true;
            },
            handleAddReport(actionType) {
                if(this.checkFormData()){
                    if(actionType === 'DRAFT'){
                        this.btnLoading1 = true;
                    }else if(actionType === 'REPORT'){
                        this.btnLoading2 = true;
                    }
                    this.formData.outsideFactoryId = this.formData.outsideFactoryId === 'ourFactory' ? '' : this.formData.outsideFactoryId;
                    this.formData.sendToFactoryId =this.formData.sendToFactoryId === 'ourFactory' ? '' : this.formData.sendToFactoryId;
                    let params = {
                        billId: this.billId,
                        skus: this.getSkuParams(),
                        instanceId: this.missionNodeId,     //工单节点id
                        userId: this.userId,
                        actionType: actionType,
                        ...this.formData,
                    };
                    //完成数上报
                    if(this.billType === 'FAC_MISSION_COMPLETE'){
                        params.type = 'COMPLETE_NUM'
                    }
                    //调整数上报
                    else if(this.billType === 'FAC_MISSION_ADJUST'){
                        params.type = 'ADJUST_NUM';
                    }
                    //数量明细型重编辑提交
                    if(this.nodeType === 'quantitative-detail'){
                        updateNumNode(params).then(res => {
                            this.reportResult(res, actionType);
                        });
                    }
                    // 裁床数量型重编辑提交
                    else if(this.nodeType === 'actual-cutting'){
                        updateBedNode(params).then(res => {
                            this.reportResult(res, actionType);
                        });
                    }
                }
            },
            //重编辑提交后的处理逻辑
            reportResult(res, actionType){
                if(actionType === 'DRAFT'){
                    this.btnLoading1 = false;
                }else if(actionType === 'REPORT'){
                    this.btnLoading2 = false;
                }
                if (res.data.code == 0) {
                    this.$emit("update:isShow", false);
                    this.$emit("reeditSuccess");
                    this.$message.success(res.data.msg);
                } else {
                    this.$message.error(res.data.msg)
                }
            },
            //获取上报sku组件数据
            getSkuParams() {
                const skuValObj = this.$refs['nfskutable'].getSkuTableValue();
                return Object.keys(skuValObj).reduce((arr, key) => {
                    if (skuValObj[key].num) {
                        const obj = {
                            skuId: skuValObj[key].skuId,
                            quantity: skuValObj[key].num
                        };
                        arr.push(obj);
                    }
                    return arr;
                }, []);
            },
            //检查上报sku组件数据是否有值
            checkAddReportSku() {
                const sku = this.getSkuParams();
                return !!sku.length;
            },
        },
        created(){
        }
    }
</script>

<style lang="scss" scoped>
    .report-dialog{
        .form-wrap{
            overflow: hidden;
        }
        .adjust-cause{
            overflow: hidden;
            margin: 15px 0;
            .adjust-text{
                width: 90px;
                float: left;
                &:before {
                    content: '*';
                    color: #ff4949;
                    margin-right: 4px
                }
            }
            .adjust-textarea{
                float:left;
                width: calc(100% - 90px);
            }
        }
        .text-right{
            text-align: right;
        }
        .el-form--inline .el-form-item{
            margin: 0 0 15px 0;
        }
        .dialog-footer > .count-total {
            strong {
                color: #FF7F14;
                font-weight: 500;
                font-size: 20px;
                vertical-align: -2px
            }
        }
        .nf-sku-table{
            margin-top: 0 !important;
        }

    }
</style>
<style lang="scss">
    .report-dialog{
        .el-dialog--small{
            width: 800px;
        }
        .el-form-item__label{
            text-align: left;
        }
        .el-input__inner{
            width: 193px;
        }
        .el-textarea__inner{
            resize: none;
        }
    }

</style>