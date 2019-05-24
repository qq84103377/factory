<template>
    <div class="order-bom-table">
        <div class="bom-header" v-if="source!=='orderProduction'">
            <content-wrap title="BOM表" type="big">
            </content-wrap>
        </div>

        <div class="bom-select-watch">
            <div class="bom-select">
                <span class="bom-selcet-name" v-if="source!=='orderProduction'">BOM表名称</span>
                <span class="bom-selcet-name" v-else >商品BOM</span>
                <el-select v-model="bomData.commonBomId" placeholder="请选择BOM表" @change="getBomData" popper-class="bigSel" :disabled="source==='CreateOrder'||source==='editOrder'">
                    <template>
                        <el-option :value="''" disabled style="cursor:pointer;">
                            <span class="new_set" @click="newConstruction()">+ 新建</span>
                        </el-option>
                    </template>
                    <el-option
                            v-for="item in bomList"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
                <!--<span v-else>{{bomDataName}}svg="icon-edit1"</span>-->
            </div>
            <nf-button v-show="bomList&&bomList.length&&(['editMissionOrder','editProductionOrder'].indexOf(from)>-1)" class="fr" @click="editBom"><span class="fs12">编辑BOM</span></nf-button>
        </div>
        <!-- BOM表格 -->
            <goods-bom :bomData="bomData"></goods-bom>
            <!--<bom-table-->
                    <!--v-if="bomId"-->
                    <!--:source="source === 'orderProduction'?'orderProduction':false"-->
                    <!--:styleId="styleId"-->
                    <!--:bomData="bomData"-->
                    <!--@bomData="bomDatas">-->
            <!--</bom-table>-->
        <!-- BOM编辑组件 -->
        <transition name="right-move">
            <create-bom-table
                    :facMissionId="facMissionId"
                    :from="fromForCreateBomTable"
                    type="editor"
                    :bomData="bomDataForEdit"
                    :title="title"
                    v-if="createBomTableVisible"
                    :styleId="styleId"
                    :source="createBomTableVisible"
                    @success="getBomData"
                    @cancel="cancel">
            </create-bom-table>
        </transition>
    </div>
</template>

<script>
    import {easyBomList, bomDetail, facMissionBomEditInfo,frdOrderBom} from "../../../api/api";
    import CreateBomTable from "@/components/goods/goodsBom/CreateBomTable.vue";
    // import bomTable from "@/components/goods/goodsBom/bomTable.vue";
    import goodsBom from "@/components/goods/goodsBom/goodsBom.vue"; //BOM表格组件

    export default {
        props: {
            commonBomId: String,
            styleId: String,
            editor: Boolean,//判断是否编辑进来请求数据
            orderId:String,//编辑获取工单id获取BOM数据
            showBom:Boolean,
            source:String,   //使用的该组件的父组件 CreateOrder是转工单的  orderProduction是生产订单的
            goodsIndex:String,
            from:String, //新建工单：addMissionOrder  编辑工单：editMissionOrder
        },
        data() {
            return {
                title: "",
                bomList: [],
                bomId: "",
                bomDataName: "",
                bomData:{
                    commonBomId:'',
                    commonBomName:'',
                    commonMaterialsSkuList:[]
                },
                sendData: {},
                commonBomName: "",
                createBomTableVisible: false,
                bomDataForEdit:{},
                facMissionId:'',    //生产工单id
            };
        },
        components: {
            CreateBomTable,
            goodsBom,
            // bomTable

        },
        computed: {
            fromForCreateBomTable(){
                let fromText = ''
                if(this.from ==='addMissionOrder'||this.from ==='editMissionOrder'){
                    fromText = 'missionOrder'
                }
                if(this.from ==='addProductionOrder'||this.from ==='editProductionOrder'){
                    fromText = 'productionOrder'
                }
                return fromText
            },
            bomListLength: function () {
                return this.bomList ? this.bomList.length : 0;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            // 编辑bom
            editBom(){
                this.title = '编辑BOM表'
                this.bomDataForEdit = JSON.parse(JSON.stringify(this.bomData))
                this.createBomTableVisible = true
            },
            // 新建BOM工单
            newConstruction() {
                //制造点击事件去除下拉框
                $(".bigSel").css('display','none')
                this.createBomTableVisible = true;
                this.title = "新建BOM表";
            },
            getCommonBomList(type) {
                let params = {
                    styleId: this.styleId,
                    userId: this.$store.state.userInfo.id,
                    name: ""
                };
                easyBomList(params).then(res => {
                    this.bomList = res.data.commonBomList;
                    // 改变this.bomId 的时候，会自动去执行select 的 change事件，所以当请求不到bomList的时候，得将bomId置空
                        if (this.bomList) {
                            if (type == "create") {
                                this.bomData.commonBomId  = this.bomList[this.bomList.length - 1].id;
                            } else {
                                this.bomData.commonBomId  = this.bomList[0].id;
                            }
                        } else{
                            this.bomData.commonBomId  = ''
                        }
                });
            },
             async getBomData(val,isConfig) {
                if(isConfig || !val) {
                    this.bomData.commonBomId = ''
                    this.bomData.commonMaterialsSkuList = []
                    return
                }
                if(this.bomList){
                    for (let i = 0; i < this.bomList.length; i++) {
                        if (val == this.bomList[i].id) {
                            this.commonBomName = this.bomList[i].name;
                        }
                    }
                }
                //转工单获取订单bom
                 if(this.source==='CreateOrder'){
                     let params = {
                        userId:this.userId,
                        orderId:this.orderId
                     }
                     frdOrderBom(params).then(res=>{
                         this.bomData.commonMaterialsSkuList = res.data.data.commonMaterialsSkuList
                         this.bomData.commonBomName = res.data.data.name
                         this.bomData.commonBomId = res.data.data.id
                     })
                     this.bomData.goodsIndex = this.goodsIndex
                     this.$emit("bomData",this.bomData);
                     return
                 }
                if (!this.showBom) {
                    let params = {
                        userId: this.userId,
                        commonBomId: val
                    };
                    await bomDetail(params).then(res => {
                         if(res.data.commonBom){
                            this.bomData.commonMaterialsSkuList = res.data.commonBom.commonMaterialsSkuList;
                            this.bomData.commonBomName = res.data.commonBom.name
                             this.bomData.commonBomId = res.data.commonBom.id
                             this.bomData.styleId = res.data.commonBom.styleId

                            // this.bomData[0].ids = 1;
                            // this.bomData[0].firstId = this.bomData[0].id;
                        }
                    });
                }
                // 编辑工单
                else {
                    let params = {
                        userId: this.userId,
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        missionId: this.orderId
                    };
                     await facMissionBomEditInfo(params).then(res => {
                        this.bomData = res.data.data;
                        this.facMissionId = this.bomData.facMissionId;
                         // this.bomData[0].ids = 1;
                        // this.bomData[0].firstId = this.bomData[0].id;
                        //新增一个属性存储bom的id,用于编辑bom保存物料
                         this.bomData.commonMaterialsSkuList.forEach(item => {
                             item.facMissionBomId = res.data.data.id;
                         })
                     });
                }
                 this.bomData.goodsIndex = this.goodsIndex
                 this.$emit("bomData",this.bomData);
             },
            async bomDatas(val) {
                this.sendData.commonBomId = this.bomData.commonBomId ;
                this.sendData.commonMaterialsSkuList = val;
                this.sendData.commonBomName = this.commonBomName;
                this.sendData.goodsIndex = this.goodsIndex;
                this.$emit("bomData", this.sendData);
            },
            // 取消弹框
            cancel() {
                this.createBomTableVisible = false;
                let params = {
                    styleId: this.styleId,
                    userId: this.$store.state.userInfo.id,
                    name: ""
                };
                easyBomList(params).then(res => {
                    this.bomList = res.data.commonBomList;
                });
            }
        },
        created() {
            this.getCommonBomList();
        },
        watch: {
            styleId: function (val) {
                this.getCommonBomList();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .new_set {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: #ff9c38;
    }
    .order-bom-table {
        .bom-table{
            margin-top: 16px;
            padding: 0 32px;
        }
        .bom-select-watch {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 32px;

            .bom-select {
                .bom-selcet-name {
                    margin-right: 14px;
                    font-size: 12px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .order-bom-table {
        .bom-select {
            .el-input .el-input__inner {
                width: 250px !important;
            }
        }
    }
</style>

