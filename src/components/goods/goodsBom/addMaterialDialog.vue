<template>
    <div class="add-material-dialog">
        <!--新建物料分类-->
        <el-dialog
                :modal-append-to-body="false"
                class="custom-dialog"
                title="新建物料分类"
                :visible.sync="visible"
                @close="closeSingleForm('addMaterialClassifyForm')"
                size="tiny">
            <el-form :model="addMaterialClassifyForm" ref="addMaterialClassifyForm" :rules="addMaterialClassifyRules">
                <el-form-item label="分类号" label-width="90px" prop="no">
                    <el-input v-model.trim="addMaterialClassifyForm.no" maxlength="8" auto-complete="off"
                              placeholder="请输入分类号"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" label-width="90px" prop="name">
                    <el-input v-model.trim="addMaterialClassifyForm.name"
                              auto-complete="off"
                              placeholder="请输入分类名称"
                              @keyup.enter.native="comfirmAddMaterialClassify('addMaterialClassifyForm')">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSingleForm('addMaterialClassifyForm')">取 消</el-button>
                <el-button :disabled="isSaving" type="primary"
                           @click="comfirmAddMaterialClassify('addMaterialClassifyForm')">保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        addOrUpdateMaterialsKinds, //提交新建物料分类
    } from "@/api/api";
    export default {
        name: "addMaterialDialog",
        props:['visible'],
        data(){
            // 检查分类号
            var validateMaterialClassifyNo = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("分类号不能为空"));
                } else {
                    let patt = /^[0-9a-zA-Z]{1,8}$/;
                    if (!patt.test(value)) {
                        callback(new Error("请输入8位以内数字或英文"));
                    }
                    // 分类号查重逻辑
                    callback();
                }
            };
            // 检查分类名称
            var validateMaterialClassifyName = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("分类名称不能为空"));
                } else {
                    // 分类名称查重逻辑
                    callback();
                }
            };
            return{
                addMaterialClassifyForm: {
                    no: "",
                    name: ""
                },
                addMaterialClassifyRules: {
                    no: [{validator: validateMaterialClassifyNo, trigger: "blur"}],
                    name: [{validator: validateMaterialClassifyName, trigger: "blur"}]
                },
                isSaving: false
            }
        },
        computed:{
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods:{
            // 提交新建物料分类
            comfirmAddMaterialClassify(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.isSaving = true;
                        let params = {
                            no: this.addMaterialClassifyForm.no,
                            name: this.addMaterialClassifyForm.name,
                            userId: this.userId
                        };
                        addOrUpdateMaterialsKinds(params).then(res => {
                            this.isSaving = false;
                            if (res.data.code == 0) {
                                let kindId = res.data.data;
                                this.$refs[formName].resetFields();
                                this.$emit('update:visible', false);
                                this.$emit('updateMaterial',kindId);
                                this.$message.success("新建成功");
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            //关闭新建物料弹窗
            closeSingleForm(formName) {
                this.addMaterialClassifyForm.no = '';
                this.addMaterialClassifyForm.name = '';
                this.$refs[formName].resetFields();
                this.$emit('update:visible', false);
            },
        }
    }
</script>

<style scoped>

</style>