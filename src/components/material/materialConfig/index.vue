<template>
    <div class="field-config">
        <!--头部begin-->
        <page-title title="字段配置" bg></page-title>
        <div class="content">
            <ul class="config-lists">
                <li class="config-list">
                    <div class="title">
                        <h4>采购单字段配置</h4>
                        <nf-button
                                class="config-btn"
                                type="warning"
                                :loading="purchaseLoading"
                                @click="purchaseCommit('PURCHASE')">
                                保存
                        </nf-button>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="purchaseMaterialAll"
                                    label="物料字段:"
                                    @change="purchaseMaterialAllChange(purchaseMaterialAll, purchaseMaterialSelected, materialArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="purchaseMaterialSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of purchaseMaterialFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="purchaseMaterialItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="purchaseNeedAll"
                                    label="需求字段:"
                                    @change="purchaseNeedAllChange(purchaseNeedAll, purchaseNeedSelected, needArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="purchaseNeedSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of purchaseNeedFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="purchaseNeedItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <!--其他字段 -->
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="purchaseOtherAll"
                                    label="其他字段:"
                                    @change="purchaseOtherAllChange(purchaseOtherAll, purchaseOtherSelected, otherArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="purchaseOtherSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of purchaseOtherFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="purchaseOtherItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                </li>
                <li class="config-list">
                    <div class="title">
                        <h4>到料单字段配置</h4>
                        <nf-button
                                class="config-btn"
                                type="warning"
                                :loading="arriveLoading"
                                @click="arriveCommit('ARRIVE')">
                                保存
                        </nf-button>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="arriveMaterialAll"
                                    label="物料字段:"
                                    @change="arriveMaterialAllChange(arriveMaterialAll, arriveMaterialSelected, materialArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="arriveMaterialSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of arriveMaterialFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="arriveMaterialItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="arriveNeedAll"
                                    label="需求字段:"
                                    @change="arriveNeedAllChange(arriveNeedAll, arriveNeedSelected, needArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="arriveNeedSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of arriveNeedFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="arriveNeedItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="arrivePurchaseAll"
                                    label="采购/到料字段:"
                                    @change="arrivePurchaseAllChange(arrivePurchaseAll, arrivePurchaseSelected, purchaseArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="arrivePurchaseSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of arrivePurchaseFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="arrivePurchaseItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <!--到料其他-->
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="arriveOtherAll"
                                    label="其他字段:"
                                    @change="arriveOtherAllChange(arriveOtherAll, arriveOtherSelected, otherArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="arriveOtherSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of arriveOtherFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="arriveOtherItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                </li>
                <li class="config-list">
                    <div class="title">
                        <h4>送料单字段配置</h4>
                        <nf-button
                                class="config-btn"
                                type="warning"
                                :loading="deliverLoading"
                                @click="deliverCommit('DELIVER')">
                                保存
                        </nf-button>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="payoffMaterialAll"
                                    label="物料字段:"
                                    @change="payoffMaterialAllChange(payoffMaterialAll, payoffMaterialSelected, materialArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="payoffMaterialSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of payoffMaterialFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="payoffMaterialItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="payoffNeedAll"
                                    label="需求字段:"
                                    @change="payoffNeedAllChange(payoffNeedAll, payoffNeedSelected, needArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="payoffNeedSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of payoffNeedFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="payoffNeedItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                </li>
                <li class="config-list">
                    <div class="title">
                        <h4>退料单字段配置</h4>
                        <nf-button
                                class="config-btn"
                                type="warning"
                                :loading="returnLoading"
                                @click="returnCommit('RETURN')">
                                保存
                        </nf-button>
                    </div>
                    <div class="list-main">
                        <div class="select-all">
                            <el-checkbox
                                    v-model="returnMaterialAll"
                                    label="物料字段:"
                                    @change="returnMaterialAllChange(returnMaterialAll, returnMaterialSelected, materialArr)">
                            </el-checkbox>
                        </div>
                        <el-checkbox-group v-model="returnMaterialSelected">
                            <ul class="select-items">
                                <li class="select-item" v-for="(item, index) of returnMaterialFields">
                                    <el-checkbox
                                            :label="item.configName"
                                            :disabled="item.configDefault"
                                            :key="index"
                                            @change="returnMaterialItemChange()">
                                    </el-checkbox>
                                </li>
                            </ul>
                        </el-checkbox-group>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {
        getPrucahseFields,
        updateUnitFacField
    } from "@/api/material";

    export default {
        name: "index",
        data(){
            return{
                purchaseMaterialAll: false,        //采购-物料全选
                purchaseNeedAll: false,            //采购-需求全选
                purchaseOtherAll: false,            //采购-其他全选
                arriveMaterialAll: false,          //到料-物料全选
                arriveNeedAll: false,              //到料-需求全选
                arrivePurchaseAll: false,          //到料-采购全选
                arriveOtherAll: false,          //到料-其他全选
                payoffMaterialAll: false,          //送料-物料全选
                payoffNeedAll: false,              //送料-需求全选
                returnMaterialAll: false,          //退料-物料全选
                purchaseMaterialFields:[],          //采购-物料字段所有数据
                purchaseNeedFields:[],              //采购-需求字段所有数据
                purchaseOtherFields:[],              //采购-其他字段所有数据
                arriveMaterialFields:[],            //到料-物料字段所有数据
                arriveNeedFields:[],                //到料-需求字段所有数据
                arriveOtherFields:[],                //到料-其他字段所有数据
                arrivePurchaseFields:[],            //到料-采购字段所有数据
                payoffMaterialFields:[],            //送料-物料字段所有数据
                payoffNeedFields:[],                //送料-需求字段所有数据
                returnMaterialFields:[],            //退料-物料字段所有数据
                purchaseMaterialSelected:[],        //采购-物料字段已选
                purchaseNeedSelected:[],            //采购-需求字段已选
                purchaseOtherSelected:[],            //采购-其他字段已选
                arriveMaterialSelected:[],          //到料-物料字段已选
                arriveNeedSelected:[],              //到料-需求字段已选
                arrivePurchaseSelected:[],          //到料-采购字段已选
                arriveOtherSelected:[],              //到料-其他字段已选
                payoffMaterialSelected:[],          //送料-物料字段已选
                payoffNeedSelected:[],              //送料-需求字段已选
                returnMaterialSelected:[],          //退料-物料字段已选
                materialArr:[],                     //物料全部字段
                needArr:[],                         //需求全部字段
                otherArr:[],                         //其他全部字段
                purchaseArr:[],                     //采购全部字段
                materialDefaultArr:[],              //物料必选字段
                needDefaultArr:[],                  //需求必选字段
                purchaseDefaultArr:[],              //采购必选字段
                otherDefaultArr:[],              //其他必选字段
                purchaseLoading:false,              //防多次点击
                arriveLoading:false,                //防多次点击
                deliverLoading:false,               //防多次点击
                returnLoading:false,                //防多次点击
            }
        },
        computed:{
            //工厂id
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
        },
        methods:{
            //采购-物料单选
            purchaseMaterialItemChange(){
                if(this.purchaseMaterialSelected.length < this.materialArr.length){
                    this.purchaseMaterialAll = false
                }else{
                    this.purchaseMaterialAll = true
                }
            },
            //采购-需求单选
            purchaseNeedItemChange(){
                if(this.purchaseNeedSelected.length < this.needArr.length){
                    this.purchaseNeedAll = false
                }else{
                    this.purchaseNeedAll = true
                }
            },
            //采购-其他单选
            purchaseOtherItemChange(){
                if(this.purchaseOtherSelected.length < this.otherArr.length){
                    this.purchaseOtherAll = false
                }else{
                    this.purchaseOtherAll = true
                }
            },
            //到料-物料单选
            arriveMaterialItemChange(){
                if(this.arriveMaterialSelected.length < this.materialArr.length){
                    this.arriveMaterialAll = false
                }else{
                    this.arriveMaterialAll = true
                }
            },
            //到料-需求单选
            arriveNeedItemChange(){
                if(this.arriveNeedSelected.length < this.needArr.length){
                    this.arriveNeedAll = false
                }else{
                    this.arriveNeedAll = true
                }
            },
            //到料-采购单选
            arrivePurchaseItemChange(){
                if(this.arrivePurchaseSelected.length < this.purchaseArr.length){
                    this.arrivePurchaseAll = false
                }else{
                    this.arrivePurchaseAll = true
                }
            },
            //到料-其他单选
            arriveOtherItemChange(){
                if(this.arriveOtherSelected.length < this.otherArr.length){
                    this.arriveOtherAll = false
                }else{
                    this.arriveOtherAll = true
                }
            },
            //送料-物料单选
            payoffMaterialItemChange(){
                if(this.payoffMaterialSelected.length < this.materialArr.length){
                    this.payoffMaterialAll = false
                }else{
                    this.payoffMaterialAll = true
                }
            },
            //送料-需求单选
            payoffNeedItemChange(){
                if(this.payoffNeedSelected.length < this.needArr.length){
                    this.payoffNeedAll = false
                }else{
                    this.payoffNeedAll = true
                }
            },
            //退料-物料单选
            returnMaterialItemChange(){
                if(this.returnMaterialSelected.length < this.materialArr.length){
                    this.returnMaterialAll = false
                }else{
                    this.returnMaterialAll = true
                }
            },
            //采购-物料全选
            purchaseMaterialAllChange(){
                if(this.purchaseMaterialAll){
                    this.purchaseMaterialSelected = this.materialArr;
                }else{
                    this.purchaseMaterialSelected = this.materialDefaultArr;
                }
            },
            //采购-需求全选
            purchaseNeedAllChange(){
                if(this.purchaseNeedAll){
                    this.purchaseNeedSelected = this.needArr;
                }else{
                    this.purchaseNeedSelected = this.needDefaultArr;
                }
            },
            //采购-其他全选
            purchaseOtherAllChange(){
                if(this.purchaseOtherAll){
                    this.purchaseOtherSelected = this.otherArr;
                }else{
                    this.purchaseOtherSelected = this.otherDefaultArr;
                }
            },
            //到料-物料全选
            arriveMaterialAllChange(){
                if(this.arriveMaterialAll){
                    this.arriveMaterialSelected = this.materialArr;
                }else{
                    this.arriveMaterialSelected = this.materialDefaultArr;
                }
            },
            //到料-需求全选
            arriveNeedAllChange(){
                if(this.arriveNeedAll){
                    this.arriveNeedSelected = this.needArr;
                }else{
                    this.arriveNeedSelected = this.needDefaultArr;
                }
            },
            //到料-采购全选
            arrivePurchaseAllChange(){
                if(this.arrivePurchaseAll){
                    this.arrivePurchaseSelected = this.purchaseArr;
                }else{
                    this.arrivePurchaseSelected = this.purchaseDefaultArr;
                }
            },
            //到料-其他全选
            arriveOtherAllChange(){
                if(this.arriveOtherAll){
                    this.arriveOtherSelected = this.otherArr;
                }else{
                    this.arriveOtherSelected = this.otherDefaultArr;
                }
            },
            //送料-物料全选
            payoffMaterialAllChange(){
                if(this.payoffMaterialAll){
                    this.payoffMaterialSelected = this.materialArr;
                }else{
                    this.payoffMaterialSelected = this.materialDefaultArr;
                }
            },
            //送料-需求全选
            payoffNeedAllChange(){
                if(this.payoffNeedAll){
                    this.payoffNeedSelected = this.needArr;
                }else{
                    this.payoffNeedSelected = this.needDefaultArr;
                }
            },
            //退料-物料全选
            returnMaterialAllChange(){
                if(this.returnMaterialAll){
                    this.returnMaterialSelected = this.materialArr;
                }else{
                    this.returnMaterialSelected = this.materialDefaultArr;
                }
            },
            //获取全部字段列表
            getFields(){
                let params = {
                    unitId: this.unitId
                };
                getPrucahseFields(params).then(res => {
                    const fields = res.data.data;
                    if(fields.length){
                        fields.forEach(list =>{
                            if(list.code === 'PURCHASE'){
                                this.purchaseList(list);
                            }else if(list.code === 'ARRIVE'){
                                this.arriveList(list);
                            }else if(list.code === 'DELIVER'){
                                this.deliverList(list);
                            }else if(list.code === 'RETURN'){
                                this.returnList(list);
                            }
                        })
                    }
                });
            },
            //获取采购单字段列表
            purchaseList(list){
                list.fieldConfigModuleList.forEach(item => {
                    if(item.moduleName === '物料字段'){
                        this.purchaseMaterialFields = item.fieldConfigList;
                        this.purchaseMaterialFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.purchaseMaterialSelected.push(val.configName);
                            }
                            //获取物料必选字段
                            if(val.configDefault === true){
                                this.materialDefaultArr.push(val.configName);
                            }
                            //获取物料全部字段
                            this.materialArr.push(val.configName);
                        });
                        this.purchaseMaterialItemChange();
                    }else if(item.moduleName === '需求字段'){
                        this.purchaseNeedFields = item.fieldConfigList;
                        this.purchaseNeedFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.purchaseNeedSelected.push(val.configName);
                            }
                            //获取需求必选字段
                            if(val.configDefault === true){
                                this.needDefaultArr.push(val.configName);
                            }
                            //获取需求全部字段
                            this.needArr.push(val.configName);
                        });
                        this.purchaseNeedItemChange();
                    } else if (item.moduleName === '其他字段') {
                        this.purchaseOtherFields = item.fieldConfigList;
                        this.purchaseOtherFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.purchaseOtherSelected.push(val.configName);
                            }
                            //获取其他全部字段
                            this.otherArr.push(val.configName);
                        });
                        this.purchaseOtherItemChange();
                    }
                });
            },
            //获取到料单字段列表
            arriveList(list){
                list.fieldConfigModuleList.forEach(item => {
                    if(item.moduleName === '物料字段'){
                        this.arriveMaterialFields = item.fieldConfigList;
                        this.arriveMaterialFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.arriveMaterialSelected.push(val.configName);
                            }
                        });
                        this.arriveMaterialItemChange();
                    }else if(item.moduleName === '需求字段'){
                        this.arriveNeedFields = item.fieldConfigList;
                        this.arriveNeedFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.arriveNeedSelected.push(val.configName);
                            }
                        });
                        this.arriveNeedItemChange();
                    }else if(item.moduleName === '采购/到料字段'){
                        this.arrivePurchaseFields = item.fieldConfigList;
                        this.arrivePurchaseFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.arrivePurchaseSelected.push(val.configName);
                            }
                            //获取采购必选字段
                            if(val.configDefault === true){
                                this.purchaseDefaultArr.push(val.configName);
                            }
                            //获取采购全部字段
                            this.purchaseArr.push(val.configName);
                        });
                        this.arrivePurchaseItemChange();
                    } else if(item.moduleName === '其他字段') {
                        this.arriveOtherFields = item.fieldConfigList;
                        this.arriveOtherFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.arriveOtherSelected.push(val.configName);
                            }
                        });
                        this.arriveOtherItemChange();
                    }
                });
            },
            //获取送料单字段列表
            deliverList(list){
                list.fieldConfigModuleList.forEach(item => {
                    if(item.moduleName === '物料字段'){
                        this.payoffMaterialFields = item.fieldConfigList;
                        this.payoffMaterialFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.payoffMaterialSelected.push(val.configName);
                            }
                        });
                        this.payoffMaterialItemChange();
                    }else if(item.moduleName === '需求字段'){
                        this.payoffNeedFields = item.fieldConfigList;
                        this.payoffNeedFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.payoffNeedSelected.push(val.configName);
                            }
                        });
                        this.payoffNeedItemChange();
                    }
                });
            },
            //获取退料单字段列表
            returnList(list){
                list.fieldConfigModuleList.forEach(item => {
                    if(item.moduleName === '物料字段'){
                        this.returnMaterialFields = item.fieldConfigList;
                        this.returnMaterialFields.forEach(val => {
                            //将已选的放到数组中
                            if(val.configSelect === true){
                                this.returnMaterialSelected.push(val.configName);
                            }
                        })
                        this.returnMaterialItemChange();
                    }
                });
            },
            //封装采购提交的字段格式
            initPurchaseField(){
                let configList = [];
                this.purchaseMaterialSelected.forEach(item => {
                    this.purchaseMaterialFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.purchaseNeedSelected.forEach(item => {
                    this.purchaseNeedFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.purchaseOtherSelected.forEach(item => {
                    this.purchaseOtherFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                return configList
            },
            //封装到料提交的字段格式
            initArriveField(){
                let configList = [];
                this.arriveMaterialSelected.forEach(item => {
                    this.arriveMaterialFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.arriveNeedSelected.forEach(item => {
                    this.arriveNeedFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.arrivePurchaseSelected.forEach(item => {
                    this.arrivePurchaseFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.arriveOtherSelected.forEach(item => {
                    this.arriveOtherFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                return configList
            },
            //封装送料提交的字段格式
            initDeliverField(){
                let configList = [];
                this.payoffMaterialSelected.forEach(item => {
                    this.payoffMaterialFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                this.payoffNeedSelected.forEach(item => {
                    this.payoffNeedFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                return configList
            },
            //封装退料提交的字段格式
            initReturnField(){
                let configList = [];
                this.returnMaterialSelected.forEach(item => {
                    this.returnMaterialFields.forEach(val => {
                        if(item === val.configName){
                            configList.push(val);
                        }
                    })
                });
                return configList
            },
            //采购提交
            purchaseCommit(code){
                this.purchaseLoading = true;
                const configList = this.initPurchaseField();
                let params = {
                    unitId: this.unitId,
                    code: code,
                    fieldConfigList:configList
                };
                updateUnitFacField(params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.purchaseLoading = false;
                });
            },
            //到料提交
            arriveCommit(code){
                this.arriveLoading = true;
                const configList = this.initArriveField();
                let params = {
                    unitId: this.unitId,
                    code: code,
                    fieldConfigList:configList
                };
                updateUnitFacField(params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.arriveLoading = false;
                });
            },
            //送料提交
            deliverCommit(code){
                this.deliverLoading = true;
                const configList = this.initDeliverField();
                let params = {
                    unitId: this.unitId,
                    code: code,
                    fieldConfigList:configList
                };
                updateUnitFacField(params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.deliverLoading = false;
                });
            },
            //退料提交
            returnCommit(code){
                this.returnLoading = true;
                const configList = this.initReturnField();
                let params = {
                    unitId: this.unitId,
                    code: code,
                    fieldConfigList:configList
                };
                updateUnitFacField(params).then(res => {
                    if(res.data.code === 0){
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                    this.returnLoading = false;
                });
            }
        },
        created(){
            this.getFields();
        }
    }
</script>

<style lang="scss" scoped>
    .field-config{
        .config-list{
            margin-bottom: 10px;
            background-color: #fff;
            overflow: hidden;
            .title{
                line-height: 38px;
                padding:0 15px;
                margin-bottom: 15px;
                border-bottom: 1px solid #DFE6EC;
                h4{
                    display: inline-block;
                    font-weight: normal;
                    font-size: 14px;
                    color: #3b3b3b;
                }
                .config-btn{
                    float: right;
                    height: 28px;
                    font-size: 12px !important;
                    padding: 0 11px;
                    margin-top: 5px;
                }
            }
            .list-main{
                margin: 15px;
                overflow: hidden;
                .select-all{
                    float:left;
                }
                .el-checkbox-group{
                    overflow: hidden;
                    margin-left: 110px;
                }
                .select-items{
                    margin-bottom: -15px;
                    overflow: hidden;
                    .select-item{
                        float: left;
                        width: 120px;
                        margin-bottom: 15px;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .field-config{
        .el-checkbox__label{
            font-size: 12px;
        }
    }
</style>