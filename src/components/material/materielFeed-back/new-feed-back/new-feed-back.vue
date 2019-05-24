<template>
    <div style="display: flex;flex-direction: column;width: 100% !important;" :class="{'material-new-remove-right':source == 'detailNewFeedBack' || source == 'createNewFeedBack', 'return-matertial':source == 'returnMatertial'}">
        <page-title :title="source=='detailNewFeedBack'?'余料入库单重编辑':'新建余料入库单'" style="padding: 16px">
        <div class="btns">
            <nf-button style="width:64px;font-size:12px;margin-right:4px;" @click="cancelAdd">取消</nf-button>
            <nf-button :loading="btnLoading" style="width:64px;font-size:12px;" type="warning" @click="sureAdd">确定</nf-button>
        </div>
        </page-title>
        <section class="new-pay-off">
            <!-- 筛选 -->
            <el-form :model="form" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="单号">
                            <el-input :maxlength="50" v-model.trim="form.orderNo" @blur="checkInput" placeholder="不填则自动生成流水号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库仓库" class="filter-item" required>
                            <el-select v-model="form.storehouseId" placeholder="请选择或搜索入库仓库" clearable filterable >
                                <el-option
                                    v-for="item in options.storeHouses"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库日期" required>
                            <el-date-picker
                                @change="placeorderAtChange"
                                v-model="form.dateRefund"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="业务员" required>
                            <workerLeader v-model="form.creatorId"   single="single" :placeholder="'请选择或搜索业务员'"></workerLeader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="加工厂" class="filter-item">
                            <el-select v-model="form.outsideFactoryId" placeholder="请选择或搜索"  filterable clearable>
                                <el-option
                                v-for="item in facList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="备注">
                            <el-input v-model.trim="form.remark" placeholder="选填"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 表格 -->
            <div class="btns-wrap">
                <el-button @click="handleShowDialog('order')" class="orange-btn" size="small">+ 按工单添加</el-button>
                <el-button @click="handleShowDialog('materiel')" class="orange-btn" size="small">+ 按物料添加</el-button>
                <el-button @click="oneKey" class="blue-btn" size="small">按参考余料一键填齐</el-button>
            </div>
            <div>
                <remaind-edit-table
                        :materials="materielData"
                        @deleteRow="deleteRow">
                </remaind-edit-table>
            </div>
            <!-- 按工单添加弹窗 -->
            <add-order-dialog
                    :visible.sync="orderDialog"
                    :selectedIdArr = "selectedOrderArr"
                    :outsideFactoryId="form.outsideFactoryId"
                    @confirm="confirmAddMaterial">
            </add-order-dialog>

            <!-- 按物料添加弹窗 -->
            <add-materiel-dialog
                    :visible.sync="materielDialog"
                    :selectedIdArr = "selectedMaterielArr"
                    @confirm="confirmAddMaterial">
            </add-materiel-dialog>

        </section>
    </div>
</template>

<script>
import AddOrderDialog from "./addOrderDialog";
import AddMaterielDialog from "./addMaterielDialog";
import {
    queryRemaindDetails,
    materialsqueryRemaindDetailsOnMission,
    remaindAdd,
    remaindEdit,
    remaindDetail,
    remaindQueryRepeat,
} from '@/api/material.js';
const fun = require('../../../Common/commonFun.js')
import {getStoreAndDeliveriers,getFactorys,missionIdAndNameList,feedBackAdd,missionMaterials,refundUpdate} from '@/api'
import remaindEditTable from './remaind-edit-table.vue'
import searchMaterialTable from './search-material-table'
import DesignStyleNoSelect from "@/components/Common/custom-select/designStyleNoSelect"
export default {
    props:['source','mission','materialSkuIds'],
    /**
     * source == detailNewFeedBack 重编辑  returnMatertial:送料节点、自由送料的余料回退  createNewFeedBack: 新建
     * mission:工单传过来的节点信息
     * materialSkuIds 选择的skuId数组， 这个属性有值时，相当于点击了（“+按物料添加”）按钮
     */
    data() {
        return {
            options: {
                freedomMissions: [],
                storeHouses: [],
                deliveriers: []
            },
            form:{
                orderNo:'',
                storehouseId:'',
                dateRefund: this.$common.getNowDate(),
                creatorId:'',
                outsideFactoryId:'',
                remark:''
            },
            searchMateriel:'',
            searchMaterialTable:[],
            materielData:[],
            deleteRowData:[],
            searchMaterialTableOutSide:[], // 物料
            materialRefundSkus:[], // 回料的物料数据
            btnLoading: false,
            isShow: false,
            materielDatabask: [], //物料备份
            billMaterialPurchaseId:null, // 计划外按采购单采购id
            styleNo:'',
            facList:[],
            selectFacMissionId: '', //选中的工单id
            facListBack: [], // 加工厂下拉备份
            isClear: false, // 是否是触发了工单的change方法
            orderDialog: false,
            materielDialog: false,
            planOutside:{
                facMissionId: '',
                facMissionPrcdNodeId: '',
                prcdNodeName: '',
                facMissionNo: '',
                quantityDelivered: '',
                referenceUseQuantity: '',
                inStoreQuantity: '',
                referenceRemainQuantity: '',
                styleNo: '',
                quantity: 0,
                type: 1,
            },
            selectedMaterielArr:[],
            selectedOrderArr:[],
        }
    },
    components: {
        remaindEditTable,
        AddMaterielDialog,
        AddOrderDialog,
        searchMaterialTable,
        DesignStyleNoSelect
    },
    computed: {
        facMissionId() {
            return this.$route.query.facMissionId;
        },
        facId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
        userId() {
            return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
        }
    },
    created() {
       this.fetchOptions();
       this.getFactorys();
       //重编辑
        if(this.source === 'detailNewFeedBack'){
            this.getEditData();
        }
        //物料库存，新建余料入库单
        if(this.materialSkuIds && this.materialSkuIds.length){
            let params = {
                commonMaterialsSkuIds: this.materialSkuIds,
            };
            queryRemaindDetails(params).then(res => {
                this.getRenainEditTableData(res);
            });
        }
    },
    methods: {
        //单号查重
        checkInput(e) {
            let val = e.target._value;
            if(val){
                let params ={
                    unitId: this.$common.unitId(),
                    orderNo: val,
                    operateType: 'IN_REMAIND',
                };
                remaindQueryRepeat(params).then(res =>{
                    if(res.data.code !== 0){
                        this.$message.error(res.data.msg);
                    }
                })
            }
        },
        //重编辑获取页面数据
        getEditData(){
            let params ={
                id:this.$route.query.id
            };
            remaindDetail(params).then(res =>{
                if(res.data.code === 0){
                    let detail = res.data.data;
                    this.form = {
                        orderNo: detail.orderNo,
                        storehouseId: detail.storehouseId,
                        dateRefund: detail.dateOperate,
                        creatorId: detail.operaterId,
                        outsideFactoryId: detail.commonOutsideFactoryId,
                        remark: detail.remark,
                    };
                    this.materielData = detail.skuDetails;
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 一键填齐
        oneKey(){
            if(!this.materielData.length){
                this.$message.error('请添加物料');
                return
            }else{
                this.materielData.forEach(item => {
                    this.$set(item, 'totalQuantity', item.totalReferenceRemaind);
                    item.skuDeepDetails.forEach(items => {
                        this.$set(items, 'quantity', items.referenceRemainQuantity ? items.referenceRemainQuantity : 0);
                    })
                })
            }
        },
        //日期选择
        placeorderAtChange(val) {
            this.form.dateRefund = val;
        },
        // 添加物料
        confirmAddMaterial(newSelectedList, type){
            // 已勾选的数据组成的id数组
            let idArr = [];
            newSelectedList.forEach(item =>{
                if(type === 'material'){
                    idArr.push(item.materialsSkuId)
                }
                else if(type === 'order'){
                    idArr.push(item.facMissionId)
                }
            });
            //按物料添加
            if(type === 'material'){
                let params = {
                    commonMaterialsSkuIds: idArr,
                };
                queryRemaindDetails(params).then(res => {
                    this.getRenainEditTableData(res);
                })
            }
            //按工单添加
            else if(type === 'order'){
                let params = {
                    facMissionIds: idArr,
                };
                materialsqueryRemaindDetailsOnMission(params).then(res => {
                    this.getRenainEditTableData(res);
                })
            }
        },
        //获取表格数据
        getRenainEditTableData(res){
            if(res.data.code === 0){
                let data = res.data.data;
                if(data.length){
                    data.forEach(d => {
                        d.skuDeepDetails.push(this.planOutside);
                    });
                    let tableSkuId = this.materielData.map(item => item.commonMaterialsSkuId);
                    //判断物料是否已存在
                    data.forEach(item => {
                        //不存在此物料,直接添加
                        if(!tableSkuId.includes(item.commonMaterialsSkuId)){
                            this.materielData.push(item)
                        }
                        //此物料已存在
                        else{
                            // 判断二级数据是否在该物料的“按单入库”数据里面
                            this.materielData.forEach(val =>{
                                if(val.commonMaterialsSkuId === item.commonMaterialsSkuId){
                                    let detailId = val.skuDeepDetails.map(vals => {
                                        //过滤计划外
                                        if(vals.facMissionPrcdNodeId){
                                            return vals.facMissionPrcdNodeId
                                        }
                                    });
                                    item.skuDeepDetails.forEach(items => {
                                        //二级数据不在“按单入库”数据里面
                                        if(!detailId.includes(items.facMissionPrcdNodeId) && items.type !==1){
                                            //倒数第二的位置插入
                                            val.skuDeepDetails.splice(val.skuDeepDetails.length -1, 0, items);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }else{
                this.$message.error(res.data.msg)
            }
        },
        //按“工单添加”和“按物料添加”
        handleShowDialog(type){
            if(type === 'order'){
                this.orderDialog = true;
                this.selectedOrderArr = [];
                this.materielData.forEach(item => {
                    if(item.skuDeepDetails.length){
                        item.skuDeepDetails.forEach(val => {
                            if(val.facMissionId){
                                this.selectedOrderArr.push(val.facMissionId);
                            }
                        })
                    }
                });
                //去重
                this.selectedOrderArr = Array.from(new Set(this.selectedOrderArr));
            }else if(type === 'materiel'){
                this.selectedMaterielArr = this.materielData.map(item => item.commonMaterialsSkuId);
                this.materielDialog = true;
            }
        },
        // 送料工厂下拉
        getFactorys(key = "") {
          let params = {
            userId: this.userId,
            key: key
          }
          getFactorys(params).then(res => {
            this.facList = res.data.data
            this.facListBack = JSON.parse(JSON.stringify(res.data.data))
          })
        },
        // 取消按钮
        cancelAdd(){
            this.$emit('cancel', false)
        },
        // 检查必填
        checkParams(){
            let status = true;
            if(!this.form.storehouseId) {
                this.$message.error('请选择入库仓库');
                status = false;
                return;
            }
            if(!this.form.creatorId) {
                this.$message.error('请选择业务员');
                status = false;
                return;
            }
            if(!this.form.dateRefund) {
                this.$message.error('请选择入库日期');
                status = false;
                return;
            }
            if(!this.materielData.length){
                this.$message.error('请添加物料');
                status = false;
                return;
            }else{
                this.materielData.forEach(item => {
                    if(!item.totalQuantity){
                        this.$message.error('请填写合计入库');
                        status = false;
                        return;
                    }
                });
            }
            return status;
        },
        // 封装skus提交参数
        getSkusParams(){
            let arr = [];
            this.materielData.forEach(item => {
                let obj = {};
                if(item.id){
                    obj.id = item.id;
                }
                obj.commonMaterialsSkuId = item.commonMaterialsSkuId;
                obj.quantity = item.totalQuantity;
                obj.skuDetails = [...item.skuDeepDetails];
                arr.push(obj);
            });
            return arr
        },
        // 确定
        sureAdd(){
            if(this.checkParams()){
                let skuData = this.getSkusParams();
                let params = {
                    unitId: this.$common.unitId(),
                    userId:this.userId,
                    storehouseId: this.form.storehouseId,
                    orderNo: this.form.orderNo,
                    operateType: "IN_REMAIND",      // IN_REMAIND 余料入库单, OUT_REMAIND 余料出库单
                    operaterId: this.form.creatorId,
                    dateOperate: this.form.dateRefund,
                    commonOutsideFactoryId: this.form.outsideFactoryId,
                    remark: this.form.remark,
                    skus: skuData,
                };
                //重编辑
                if(this.source === 'detailNewFeedBack'){
                    params.id = this.$route.query.id;
                    remaindEdit(params).then(res => {
                        this.handleSuccess(res);
                    })
                }
                //新建
                else{
                    remaindAdd(params).then(res => {
                        this.handleSuccess(res);
                    })
                }
            }
        },
        //新建或重编辑成功后的回调
        handleSuccess(res){
            if(res.data.code === 0){
                this.$message.success(res.data.msg);
                this.$emit('addSucsess');
            }else{
                this.$message.error(res.data.msg);
            }
        },
        // 获取新建送料单时的送料仓库和送料员下拉列表
        fetchOptions() {
            const params = {
                unitId: this.facId
            };
            if (this.facMissionId) {
                params.facMissionId = this.facMissionId;
            }
            getStoreAndDeliveriers(params)
            .then(res => {
                const { deliveriers, storeHouses } = res.data.data;
                this.options.storeHouses = storeHouses;
                this.form.storehouseId = this.options.storeHouses[0].id;
                this.options.deliveriers = deliveriers;
                if(this.source == 'detailNewFeedBack')return;
                this.form.creatorId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            });
        },
        // 物料删除并取消勾选
        deleteRow(val) {
            let _key = `${val.demandSourceId}-${val.facMissionPrcdNodeId}-${val.materialSkuId}` 
            let index =0
            this.searchMaterialTableOutSide.forEach((item,k) => {
                let key = `${item.demandSourceId}-${item.facMissionPrcdNodeId}-${item.materialSkuId}` 
                if(_key == key) {
                    index = k
                }
            })
            this.deleteRowData = [this.searchMaterialTableOutSide[index]]
        },
    }
}
</script>

<style lang="scss" scoped>
.return-matertial{
    z-index: 200;
    position: fixed;
    top: 0;
    width: 1000px;
    right: 0;
    height: 100%;
    background: #fff;
}
.new-pay-off {
    .btns-wrap{
        float: right;
        overflow: hidden;
        margin-bottom: 15px;
        .orange-btn{
            color:#ff9c38 ;
            background: transparent;
            border: 1px solid #ff9c38;
        }
        .blue-btn{
            color:#1CA1FF ;
            background: transparent;
            border: 1px solid #1CA1FF;
        }
    }
    overflow-y: auto;
    overflow-x: hidden;
    padding: 24px;
    background-color: #fff;
    .el-row {
        margin-left: -32px;
    }
    .tab {
        width:100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &__select{
        display:flex;
        justify-content: flex-start;
        margin: 8px 0;
        cursor: pointer;
        font-size: 12px;
            .tab__default-style {
                display:flex;
                justify-content: center;
                align-items: center;
                width:80px;
                height:32px;
                background-color: #fff;
                border: 1px solid #939FB8;
                box-sizing: border-box;
                color: #939FB8;
                &:last-child{
                    margin-left:-1px;
                }
            }
            .tab__gray-style{
                background-color: #939FB8;
                color: #fff;
            }
        }
    }
    .table-search {
        height:32px;
        border-right:1px solid rgb(223, 228, 236);
        border-left:1px solid rgb(223, 228, 236);
        border-bottom:1px solid rgb(223, 228, 236);
    }
    .search-material {
        margin-top:12px;
    }
    .new-return__search {
        border: 1px solid #E6EAF0;
        line-height: 32px;
        height: 32px;
        .table-search-span{
            float: right;
            padding:0 10px;
            background-color: #ff9c38;
            position: relative;
            top: -33px;
            right: 0px;
            cursor: pointer;
            color: #fff;
            font-size:12px;
        }
        input {
            width: 100%;
            box-sizing: border-box;
            padding: 0 10px
        }
    }
    .table-search-btns{
        /*padding-left: 16px;*/
        margin: 10px 0;
        button:hover{
            color: #eb8f34;
            border: 1px solid #eb8f34;
        }
        .table-search-active{
            color: #eb8f34;
            border: 1px solid #eb8f34;
        }

    }
}
    .div_bottom_content {
        position: fixed;
        top: 0;
        left: 200px;
        right: 0;
        bottom: 0;
        z-index: 101;
    }
</style>
<style lang="scss">
@import '../../../../assets/style/el-table.scss';
.new-pay-off {
    .el-date-editor.el-input{
        width:100% !important;
    }
    .el-select{
        width:100% !important;
    }
    .el-form-item{
        margin-bottom:10px !important;
    }
    .el-input__inner {
        height:32px !important;
    }
    .table-search .el-input__inner {
        border:none;
        height:32px;
    }
}
</style>

