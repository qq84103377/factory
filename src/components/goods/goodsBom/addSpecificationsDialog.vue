<template>
    <div class="add-specifications-dialog">
        <!--新建物料规格-->
        <el-dialog
                :modal-append-to-body="false"
                class="custom-dialog"
                title="新建物料规格"
                :visible.sync="visible"
                @close="closeSingleForm('addMaterialSpecForm')"
                size="tiny">
            <el-form :model="addMaterialSpecForm" ref="addMaterialSpecForm">
                <el-form-item label="规格号" label-width="90px">
                    <el-input v-model.trim="addMaterialSpecForm.no" @input="handleNoInput" maxlength="8"
                              auto-complete="off"
                              placeholder="规格号不填则自动生成"></el-input>
                </el-form-item>
                <el-form-item label="规格描述" label-width="90px">
                    <el-input v-to-focus="remarkInput"
                              v-model.trim="addMaterialSpecForm.remark"
                              auto-complete="off"
                              @keyup.enter.native="comfirmAddMaterialSpec('addMaterialSpecForm')"
                              placeholder="请输入规格描述">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSingleForm('addMaterialSpecForm')">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="comfirmAddMaterialSpec('addMaterialSpecForm')">保
                    存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        addOrUpdateCommonMaterialsSpecifications, //提交新建物料规格接口
    } from "@/api/api";
    export default {
        name: "addSpecificationsDialog",
        props:['visible'],
        data(){
            return{
                // 规格新建
                addMaterialSpecForm: {
                    no: "",
                    remark: ""
                },
                remarkInput: true,    //规格input是否选中
                isSaving: false
            }
        },
        directives: {
            "to-focus": function (el, binding) {
                if (binding.value) {
                    window.setTimeout(function () {
                        el.children[0].focus();
                    }, 100)
                }
            }
        },
        computed:{
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods:{
            //新建物料规格弹窗色号input输入
            handleNoInput() {
                this.remarkInput = false;
            },
            // 提交新建物料规格
            comfirmAddMaterialSpec() {
                this.isSaving = true;
                let params = {
                    userId: this.userId,
                    no: this.addMaterialSpecForm.no,
                    remark: this.addMaterialSpecForm.remark
                };
                addOrUpdateCommonMaterialsSpecifications(params).then(res => {
                    this.isSaving = false;
                    if (res.data.code == 0) {
                        let specificationsId = res.data.data;
                        this.$emit('update:visible', false);
                        this.$emit('updateSpecifications',specificationsId);
                        this.$message.success("新建成功");
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //关闭新建规格弹窗
            closeSingleForm() {
                this.addMaterialSpecForm.no = '';
                this.addMaterialSpecForm.remark = '';
                this.$emit('update:visible', false);
            },
        }
    }
</script>

<style scoped>

</style>