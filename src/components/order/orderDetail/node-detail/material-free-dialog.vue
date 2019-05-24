<template>
    <div class="free-dialog">
        <el-dialog
                custom-class="nf-dialog-common"
                title="送料上报"
                size="large"
                :visible.sync="dialogVisible"
                @close="closeDialog">
            <el-row
                    class="free-form-inline"
                    type="flex">
                <div class="form-item">
                    <span class="form-label">完成日期</span>
                    <div class="input-wrap">
                        <el-date-picker
                                :disabled="date_disabled"
                                type="date"
                                format="yyyy-MM-dd"
                                v-model="reportForm.dateCompleted"
                                @change="pickerReportEndAt"
                                placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="form-item">
                    <span class="form-label">完成人员</span>
                    <div class="input-wrap">
                        <el-select
                                :disabled="staff_disabled"
                                v-model="reportForm.chargerId"
                                placeholder="请选择完成人员">
                            <el-option
                                    v-for="(leaderItem, leaderIndex) in selectPersonList"
                                    :key="leaderIndex" :label="leaderItem.userName"
                                    :value="leaderItem.id">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="bed-num">
                    <span style="display:inline-block;width:80px;">送料仓库：</span>
                    <el-select
                            v-model="storeId"
                            @change="storeChange"
                            placeholder="请选择送料仓库">
                        <el-option
                                v-for="(storeItem, storeIndex) in store"
                                :key="storeIndex" :label="storeItem.name"
                                :value="storeItem.id">
                        </el-option>
                    </el-select>
                </div>
            </el-row>
            <div class="base-info">
                <div class="img-info">
                    <img :src="missionData.pictureURL" v-errorLogo></div>
                <div style="display:flex;justify-content:space-between;width:100%;height:100%;padding:0 32px;">
                    <div class="second-info">
                        <div>
                            <span class="gray">货品款号</span>
                            <span>{{missionData.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">货品名称</span>
                            <span>{{missionData.goodsName}}</span>
                        </div>
                    </div>
                    <div class="third-info">
                        <div>
                            <span class="gray">工单号</span>
                            <span>{{missionData.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">&emsp;客户</span>
                            <span>{{missionData.customerName}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin:12px 0;">
                <material-free-dialog-table
                        :storeId="storeId"
                        ref="materialTable"
                        @addNewMaterial="addMaterial">
                </material-free-dialog-table>
            </div>
            <el-row class="dialog-footer" slot="footer" type="flex" justify="end" align="center">
                <div>
                    <nf-button @click="closeDialog">取 消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="report">确 定</nf-button>
                </div>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    import {
        storeList,
        materialFreeReport,
    } from "@/api";
    import {formatDate} from "@/utils";
    import  materialFreeDialogTable  from "@/components/material/materielPay-off/new-pay-off/free-report-material";
    export default {
        name: "material-free-dialog",
        props:['dialogVisible','missionData','selectPersonList'],
        data(){
            return{
                store: [],      //仓库下拉数据
                storeId: "",
                reportForm: {
                    chargerId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    dateCompleted: "",
                    materialSkus: [],
                },
            }
        },
        computed:{
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            unitId(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            date_disabled() {
                const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
                return datalist.indexOf('fac.mission.node.finishDate.update') === -1;
            },
            staff_disabled() {
                const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
                return datalist.indexOf('fac.mission.node.finishBy.update') === -1;
            }
        },
        components:{
            materialFreeDialogTable
        },
        methods:{
            //新建物料
            addMaterial(){
                this.$emit('addMaterial');
            },
            //关闭弹窗
            closeDialog(){
                this.$emit('update:dialogVisible', false);
            },
            //获取仓库下拉数据
            storeList() {
                let params = {
                    unitId: this.unitId
                };
                storeList(params).then(res => {
                    this.store = res.data.storehouses;
                    this.storeId = res.data.storehouses[0].id;
                });
            },
            getMaterialSkus(){
                this.reportForm.materialSkus = [];
                let tableData = this.$refs.materialTable.materielData[0].list;
                if(tableData.length){
                    tableData.forEach(item =>{
                        let skuObj ={};
                        skuObj.materialSkuId = item.id;
                        skuObj.quantity = item.quantity;
                        this.reportForm.materialSkus.push(skuObj);
                    })
                }
            },
            report() {
                if (!this.reportForm.chargerId) {
                    this.$message.error("请选择完成人员！");
                    return;
                } else if (!this.reportForm.dateCompleted) {
                    this.$message.error("请选择完成日期！");
                    return;
                }
                this.getMaterialSkus();
                console.log(this.$refs.materialTable.materielData[0].list);
                if(this.$refs.materialTable.materielData[0].list.some(v => ((v.quantity*1) <= 0) || ((v.quantity*1) > v.availableStock))) {
                    return this.$message.error(`本次送料请输入正数且不可大于可用库存`)
                }
                const params = this.reportForm;
                params.userId = this.userId;
                params.unitId = this.unitId;
                params.storehouseId = this.storeId;
                params.instanceId = this.$route.query.instanceWorkflowId;
                this.btnLoading = true;
                materialFreeReport(params).then(res => {
                    this.btnLoading = false;
                    if (res.data.code === 0) {
                        this.$message.success("上报成功");
                        this.$emit('update:dialogVisible', false);
                        this.$emit('reportSubmit');
                    }else{
                        this.$message.error(res.data.msg || "失败！");
                    }
                });
            },
        },
        created(){
            this.storeList();
            this.reportForm.dateCompleted = formatDate(new Date(), "yyyy-MM-dd");
        },
    }
</script>

<style lang="scss" scoped>
.free-dialog{
    .free-form-inline {
        justify-content: space-between;
        .form-item {
            display: inline-block;
        }
        .input-wrap {
            display: inline-block;
            width: 194px;
        }
    }
    .base-info {
        height: 72px;
        border: 1px solid #e6eaf0;
        margin: 14px 0;
        box-sizing: border-box;
        padding: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .img-info {
            width: 60px;
            height: 48px;
            border: 1px solid #ccc;
            margin-right: 24px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .second-info {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            flex-direction: column;
        }
        .third-info {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            flex-direction: column;
        }
        .gray {
            color: #a2abb8;
            margin-right: 12px;
        }
    }
}
</style>
