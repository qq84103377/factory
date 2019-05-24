<template>
    <el-dialog
            :modal-append-to-body="false"
            title="物料需求/商品档案更新"
            custom-class="custom-dialog updateMateriaDialog"
            :visible.sync="newUpdateMaterial"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            size="tiny">
        <div class="dialog-content-update">
            <div class="updateMaterialChecked" v-if="alterPurchaseDemand">
                <el-checkbox v-model="dataArr.updateMaterialChecked" >同步更新物料采购的物料需求数和计划采购数</el-checkbox>
            </div>
            <div>
                <el-radio-group v-model="dataArr.updateMaterialRadio">
                    <el-radio :label="'noUpdateBom'">不更新商品BOM表</el-radio>
                    <el-radio :label="item.id" v-for="item in newEasyBomList" :key="item.id">{{item.name}}</el-radio>
                    <el-radio :label="''">另存为
                        <el-input v-model.trim="dataArr.updateMaterialInput" placeholder="请输入内容"></el-input>
                        <p style="margin-left: 80px;margin-top: 6px;color: red;font-size: 12px;" v-show="bomListRepeat">BOM表名称重复，请重新输入</p>
                    </el-radio>

                </el-radio-group>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <nf-button @click="cancel" style="margin-right: 10px;">取消</nf-button>
            <nf-button type="warning" @click="updateMaterialBtn" :loading="btnLoading">确定</nf-button>
        </div>

    </el-dialog>
</template>

<script>
    export default {
        name: "materialAndGoodsBomUpdate",
        props:['easyBomList','alterPurchaseDemand','updateMaterial','updateMaterialData'],
        computed:{
            newUpdateMaterial(){
                if(this.updateMaterial){
                    this.btnLoading=false
                }

                return this.updateMaterial
            },
            newEasyBomList(){
                console.log(this.easyBomList);
                return JSON.parse(JSON.stringify(this.easyBomList))
            }
        },
        watch:{
            updateMaterial(val){
                if(val){
                    this.dataArr = JSON.parse(JSON.stringify(this.updateMaterialData))
                }
            }
        },
        data(){
            return {
                bomListRepeat:false,
                btnLoading:false,
                dataArr:{
                    updateMaterialChecked: true,
                    updateMaterialRadio: 'noUpdateBom',
                    updateMaterialInput: '',
                }

            }
        },
        methods:{
            cancel(){
                this.dataArr={
                    updateMaterialChecked: true,
                        updateMaterialRadio: 'noUpdateBom',
                        updateMaterialInput: '',
                }
                this.$emit('update:updateMaterial',false)
            },
            updateMaterialBtn(){
                if(this.dataArr.updateMaterialRadio===''){
                    if(!this.dataArr.updateMaterialInput){
                        this.$message.error('商品bom表名字不能为空')
                        return
                    }else {
                        let flag = true
                        if(this.newEasyBomList){
                            this.newEasyBomList.forEach(item=>{
                                if(this.dataArr.updateMaterialInput===item.name){
                                    flag = false
                                }
                            })
                        }

                        if(!flag){
                            this.bomListRepeat = true;
                            return
                        }
                    }

                }
                this.$emit('updateMaterialBtn',this.dataArr)
            }
        }
    }
</script>
<style lang="scss">

    .updateMateriaDialog {
        .el-dialog__body {
            padding: 17px 0;
        }
        .dialog-content-update {
            padding:0 25px;
        }
        .updateMaterialChecked {
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid rgba(223, 230, 236, 1);
        }
        .el-radio-group .el-radio{
            display: block;
            margin-bottom: 4px;
        }
        .el-radio + .el-radio{
            margin-left: 0;
        }
        .el-input__inner{
            height: 32px;
        }
        .dialog-footer-update {
            border-top: 1px solid rgba(223, 230, 236, 1);
            margin-top: 20px;
            padding-top: 14px;

        }
    }
</style>
<style scoped>

</style>
