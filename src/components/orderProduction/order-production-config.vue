<template>
    <div class="orderProductionConfig">
        <page-title title="订单配置">
            <div>
                <nf-button @click.native="$router.go(-1)">返回</nf-button>

            </div>
        </page-title>
        <div class="orderProductionConfig-item" >
            <nf-button type="warning" @click="configOrderDialogGo">
                配置订单提报必填字段
            </nf-button>
        </div>
        <div class="orderProductionConfig-item">
            <nf-button type="warning" @click="configOrderDialog = true">
                配置转工单必填字段
            </nf-button>
        </div>
        <div class="orderProductionConfig-item">
            <nf-button type="warning" @click="dynamicVisibleShow">
                配置商品显示字段
            </nf-button>
        </div>
        <!--配置订单提报必填字段-->
        <el-dialog
                class="custom-dialog"
                title="配置订单提报必填字段"
                :visible.sync="reportOrderDialog"
               >
            <div>
                <div style="border: 1px solid #e5e5e5;">
                    <div class="reportDialog-order">
                        <el-checkbox v-model="orderIsAllChecked" @change="allCheckedChange(1)">生产订单</el-checkbox>
                        <i class="collapse-item__arrow icon-triangular"  :class="!isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="isExpand = !isExpand"></i>

                    </div>
                    <div style="padding-left: 20px;padding-bottom: 10px;" v-show="!isExpand">
                        <el-checkbox style="width: 25%;margin-top: 10px;" @change="orderItemCheckedChange(item.required)" v-model="item.required" :disabled="item.defaultRequired" v-for="item in reportOrderData" v-if="item.kind===1" :key="item.id">{{item.name}}</el-checkbox>

                    </div>
                </div>
                <div style="border: 1px solid #e5e5e5">
                    <div class="reportDialog-order">
                        <el-checkbox v-model="goodsIsAllChecked" @change="allCheckedChange(2)">商品档案</el-checkbox>
                        <i class="collapse-item__arrow icon-triangular"  :class="!isExpandGoods ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="isExpandGoods = !isExpandGoods"></i>

                    </div>
                    <div style="padding-left: 20px;" v-show="!isExpandGoods">
                        <div class="checkboxItem" :class="{'isParent':!item.parentId}" v-for="item in reportOrderData" v-if="item.kind===2" :key="item.id" v-show="!item.isExpandGoodsItem||!item.parentId">
                            <el-checkbox   @change="goodsItemCheckedChange(item.required,item.parentId,item.id)"   v-model="item.required" :disabled="item.defaultRequired" >{{item.name}}</el-checkbox>
                            <i class="collapse-item__arrow icon-triangular" v-if="!item.parentId"  :class="!item.isExpandGoodsItem ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="isExpandGoodsItemShowGo(item.id)"></i>
                        </div>

                    </div>
                </div>

            </div>
            <span slot="footer" style="display: flex;justify-content: space-between;">
                <el-button @click="configOrderDialogGo">重置</el-button>
                <div>
                    <el-button @click="reportOrderDialog = false">取消</el-button>
                    <el-button :loading="reportBtnLoading" type="primary" @click="orderCreateConfig">确定</el-button>
                </div>

            </span>
        </el-dialog>
        <!--动态配置表头组件-->

        <dynamic-head
                v-if="dynamicVisible"
                source="orderProductionList"
                title="配置表头显示内容"
                :dynamicVisible="dynamicVisible"
                :allSelectItem="dynamicAllItem"
                :checkedArr="dynamicCheckArr"
                :sortArr="dynamicSortArr"
                @dynamicReset="resetDefaultItem"
                @dynamicCommit="dynamicCommit"
                @closeDynamicHead="dynamicVisible = false"
        >

        </dynamic-head>

        <!--配置转工单必填-->
        <el-dialog
                class="custom-dialog"
                title="配置转工单必填"
                :visible.sync="configOrderDialog"
                size="tiny">
            <div>
                <div style="margin-bottom: 15px;">商品档案附件</div>
                <div>
                    <el-checkbox-group  style="display: flex;flex-wrap: wrap;" v-model="checkList">
                        <el-checkbox @change="e => handleChangeConfig(e,item)" v-for="(item,index) in configList" :key="index" style="margin: 0 15px 8px 0;" :label="item.name"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="configOrderDialog = false">取消</el-button>
                <el-button :loading="btnLoading" type="primary" @click="updateAttachmentFieldConfig">确定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import DynamicHead from '@/components/Common/dynamicHead';
    import {updateAttachmentFieldConfig,getAttachmentFieldConfig,getFieldConfig,updateFieldConfig,orderReportGetConfig,orderCreateConfig} from '@/api'
    export default {
        name: "order-production-config",
        data(){
            return {
                isExpandGoodsItem: false,
                isExpandGoods: false,
                isExpand: false,
                reportBtnLoading: false,
                orderIsAllChecked: false,
                goodsIsAllChecked: false,
                reportOrderDialog: false,
                reportOrderData:[],

                btnLoading: false,
                trueConfigList: [], //配置转工单提交的参数
                configList: [], //配置转工单列表
                checkList: [], //配置转工单v-model
                configOrderDialog: false,

                dynamicVisible:false,
                dynamicAllItem:[],
                dynamicCheckArr:[],
                dynamicSortArr:[],
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            }
        },
        created() {
            this.getAttachmentFieldConfig()

        },
        components:{
            DynamicHead
        },
        methods:{
            isExpandGoodsItemShowGo(id){
                this.reportOrderData.forEach(item=>{
                    if(item.parentId===id || item.id===id){
                        this.$set(item,'isExpandGoodsItem',!item.isExpandGoodsItem)
                    }
                })
            },
        //全选操作
            allCheckedChange(type){
                this.reportOrderData.forEach(item=>{
                    if(item.kind===type && !item.defaultRequired){
                        this.$set(item,'required',type===1?this.orderIsAllChecked:this.goodsIsAllChecked)
                    }
                })
            },
            //生产订单勾选操作
            orderItemCheckedChange(){
                let orderIsAllChecked= true;
                this.reportOrderData.forEach(item=>{
                    if(item.kind===1 && !item.defaultRequired && !item.required){
                        orderIsAllChecked= false
                    }
                });
                this.orderIsAllChecked = orderIsAllChecked
            },
            //商品档案勾选操作
            goodsItemCheckedChange(value,parentId,id){
                let goodsIsAllChecked= true;
                if(!parentId){
                    //父级勾选
                    this.reportOrderData.forEach(item=>{
                        if(item.kind===2 && !item.defaultRequired && item.parentId===id){
                            this.$set(item,'required',value)
                        }
                    })

                }else {
                    //子级
                    let goodsIsItemChecked= true;
                    this.reportOrderData.forEach(item=>{
                        if(item.parentId === parentId && !item.required){
                            //父级
                            goodsIsItemChecked= false
                        }
                    });
                    this.reportOrderData.forEach(item=>{
                        if(item.id === parentId ){
                            //父级
                            this.$set(item,'required',goodsIsItemChecked)
                        }
                    });

                }
                this.reportOrderData.forEach(item=>{
                    if(item.kind===2 && !item.defaultRequired && !item.required){
                        goodsIsAllChecked= false
                    }
                });

                this.goodsIsAllChecked = goodsIsAllChecked
            },
            //获取提报必填配置
            configOrderDialogGo(){
                orderReportGetConfig({unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.reportOrderData = res.data.data
                        this.reportOrderDialog = true

                    }
                })
            },
            //修改提报必填配置
            orderCreateConfig(){
                let configs = [];
                this.reportOrderData.forEach(item=>{
                    if( item.required){
                        let obj = {
                            facPrdOrderTargetFieldId:item.id,
                            required:true
                        };
                        configs.push(obj)
                    }

                });
                let obj = {
                    unitId:this.unitId,
                    configs
                };
                this.reportBtnLoading = true
                orderCreateConfig(obj).then(res=>{
                    this.reportBtnLoading = false
                    if(res.data.code===0){
                        this.$message.success('配置成功')
                        this.reportOrderDialog = false
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })

            },
            handleChangeConfig(e,item) {
                if(e.target.checked){
                    this.trueConfigList.push(item.id)
                }else {
                    this.trueConfigList.splice(this.trueConfigList.indexOf(item.id),1)
                }
            },

            //获取配置转工单必填列表
            getAttachmentFieldConfig() {
                getAttachmentFieldConfig({unitId:this.unitId}).then(res => {
                    this.configList = res.data.data || []
                    this.configList.forEach(v => {
                        if(v.selected){
                            this.checkList.push(v.name)
                            this.trueConfigList.push(v.id)
                        }
                    })
                })
            },
            //修改配置转工单必填
            updateAttachmentFieldConfig() {
                this.btnLoading = true;
                let params = {
                    fieldIds: this.trueConfigList,
                    unitId:this.unitId
                }
                updateAttachmentFieldConfig(params).then(res => {
                    this.btnLoading = false;
                    if(res.data.code==0){
                        this.$message.success('配置成功')
                        this.configOrderDialog = false
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //表头配置
            dynamicVisibleShow(){
                getFieldConfig({unitId:this.unitId}).then(res=>{
                    this.dynamicAllItem = res.data.data.configAllList;
                    let dynamicCheckArr = res.data.data.selectedConfigList;
                    this.dynamicCheckArr = JSON.parse(JSON.stringify(dynamicCheckArr)).map(item=>item.id);
                    this.dynamicSortArr = JSON.parse(JSON.stringify(dynamicCheckArr));
                    this.dynamicVisible = true
                })
            },
            dynamicCommit(val){
                let fieldIds = val.map(item=>item.id);
                updateFieldConfig({fieldIds,unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.$message.success('配置成功');
                        this.$store.dispatch('deleteVisitedLive', 'orderProductionIndex'); // 重新执行订单列表active
                    }else {
                        this.$message.error(res.data.msg)
                    }
                    this.dynamicVisible = false
                })
            },
            resetDefaultItem(){
                this.dynamicCheckArr = [];
                this.dynamicSortArr = [];
            },
            //表头配置结束
        }
    }
</script>

<style scoped lang="scss">
    .orderProductionConfig{
        .orderProductionConfig-item{
            height: 80px;
            line-height: 80px;
            padding-left: 30px;
            margin-bottom: 10px;
            border: 1px solid rgba(228, 228, 228, 1);
        }
        .checkboxItem{
            display: inline-block;
            width: 25%;
            margin-bottom: 10px;
        }
        .isParent{
            width: calc(100% + 20px);
            display: block;
            height: 36px;
            line-height: 36px;
            position: relative;
            left: -20px;
            padding-left: 20px;
            box-sizing: border-box;
            border: 1px solid #e5e5e5;
            border-left: none;
            border-right: none;
        }
    }
    .reportDialog-order{
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        background: #f2f2f2;
    }

</style>
<style lang="scss">
    .orderProductionConfig{
        .el-checkbox + .el-checkbox{
            margin-left: 0;
        }
        .icon-triangular{
            float: right;
            margin-top: 14px;
            margin-right: 10px;
            cursor: pointer
        }
    }


</style>
