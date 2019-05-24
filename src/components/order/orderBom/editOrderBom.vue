<template>
    <div class="mask-layer">
        <div class="edit-bom">
            <page-title class="page-title" title="编辑BOM表">
                <span class="header_right">
                  <nf-button @click="cancel">取消
                  </nf-button>&nbsp;&nbsp;&nbsp;
                  <nf-button type="warning" @click="saveBom">确定
                  </nf-button>
                </span>
            </page-title>
            <page-wrap class="bom-content">
                <div class="content-header clearfix">
                    <span>BOM表名称</span>&nbsp;
                    <el-input placeholder="请输入BOM表名称" v-model="bomData.commonBomName">
                    </el-input>
                    <!--<el-button type="primary" class="chk-bom" :plain="true" @click="centerDialogVisible = true">按货品SKU查看BOM</el-button>-->
                </div>
                <div id="table" class="mgt15">
                    <bom :lengthShow="this.$route.query.lengthShow" :styleId="this.$route.query.styleId" :editBom="true" :bomData="bomEditData" @bomData="bomDatas"></bom>
                </div>
            </page-wrap>
        </div>
    </div>

</template>

<script>
    let commonFun = require('../../Common/commonFun');
    import {editFacMissionBom} from "../../../api/api";
    import Bom from "@/components/order/createChild/bom"
    export default {
        props:['isNew','visible','bomData',],
        data() {
            return {
                bomEditDatas:[],
            }
        },
        computed: {
            bomEditData() {
                return JSON.parse(JSON.stringify(this.bomData.commonBomMaterialsDTOList));
            }
        },
        methods: {
            cancel() {
                this.$emit("cancel");
            },
            saveBom() {
                var bomSkuList = this.bomEditData;
                for(let skuItem of  bomSkuList) {
                    for(let item of skuItem.commonBomMaterialsSkuList) {
                        console.log(item.styleStandardIdList);
                        if(item.lossRate=='') {
                            item.lossRate=0;
                        }
                        if(item.lossRate<0) {
                            this.$message.error('默认损耗率须大于等于0');   
                            return false;
                        }
                        if(item.styleColorIdList.length==0 || item.styleSizeIdList.length==0|| (this.$route.query.lengthShow&&item.styleStandardIdList.length==0) || item.singleDosage=='') {
                            this.$message.error('bom表填写不完整');   
                            return false;                        
                        }
                    }
                }
                for(let i = 0;i<this.bomEditData.length;i++) {
                    console.log(this.bomEditData[i]);
                    for(let j = 0;j<this.bomEditData[i].commonBomMaterialsSkuList.length;j++) {
                        this.bomEditData[i].commonBomMaterialsSkuList[j].facMissionBomStyleSkuDTOList = [];
                        if (this.bomEditData[i].commonBomMaterialsSkuList[j].styleStandardIdList.length != []) {
                            for (let colorItem of this.bomEditData[i].commonBomMaterialsSkuList[j].styleColorIdList) {
                                for (let sizeItem of this.bomEditData[i].commonBomMaterialsSkuList[j].styleSizeIdList) {
                                    for (let lengthItem of this.bomEditData[i].commonBomMaterialsSkuList[j].styleStandardIdList) {
                            
                                        let obj = {
                                            colorId:colorItem,
                                            sizeId:sizeItem,
                                            standardId:lengthItem
                                        }
                                        this.bomEditData[i].commonBomMaterialsSkuList[j].facMissionBomStyleSkuDTOList.push(obj);
                                    }
                                }
                            }
                        } else {
                            for (let colorItem of this.bomEditData[i].commonBomMaterialsSkuList[j].styleColorIdList) {
                                for (let sizeItem of this.bomEditData[i].commonBomMaterialsSkuList[j].styleSizeIdList) {                               
                                        let obj = {
                                            colorId:colorItem,
                                            sizeId:sizeItem,
                                            standardId:'36fec3286377458bb445d0a287cd8e0e'
                                        }
                                    this.bomEditData[i].commonBomMaterialsSkuList[j].facMissionBomStyleSkuDTOList.push(obj);
                                }
                            }
                        }
                    }
                }
                let params = {
                    facMissionPrcdNodeId:this.$route.query.instanceId,
                    facMissionId:this.$route.query.missionId,
                    id:this.bomData.id,
                    commonBomId:this.bomData.commonBomId,
                    commonBomName:this.bomData.commonBomName,
                    commonBomMaterialsDTOList:this.bomEditData
                }
                console.log(params);
                editFacMissionBom(params).then(res =>{
                    console.log(res);
                    if(res.data.code == 0) {
                        this.$message.success('修改成功');
                        this.cancel();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            bomDatas(val) {
                this.bomEditDatas = val;
                console.warn(val,'ooo');
            }
        },
        components:{
            Bom
        },
        watch:{

        },
        created() {
        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";
    .mask-layer{
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: rgba(0,0,0,.5);
        z-index: 100;
        top: 0;
        left: 0;
    }
    .edit-bom {
        position: fixed;
        top: 0;
        right: 0;
        left: 200px;
        /*width: 86% !important;*/
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 101;
        box-sizing: border-box;
        padding: 10px 0;
        min-width: 560px;
    .bom-content {
        padding: 0 32px 32px;
        .el-input {
            width: 250px;
            height: 36px;
            border-radius: 2px;
            background-color: #ffffff;
            border: solid 1px #dce0e6;
        }
        .chk-bom {
            width: 160px;
            height: 36px;
            border-radius: 2px;
            border: solid 1px #1ca1ff;
            font-size: 14px;
            color: #1ca1ff;
            float: right;
        }
    }
    }
</style>
<style lang="scss">
    .edit-bom{
        .page-title {
            padding: 0 32px;
            border-bottom: 1px solid #e0e6ed;
        }
    }
</style>

