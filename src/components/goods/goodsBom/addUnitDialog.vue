<template>
    <div class="add-unit-dialog">
        <!--新建库存单位-->
        <el-dialog
                :modal-append-to-body="false"
                class="custom-dialog"
                title="新建库存单位"
                :visible.sync="visible"
                @close="closeSingleForm('addStockUnitForm')"
                size="tiny">
            <el-form :model="addStockUnitForm" ref="addStockUnitForm" :rules="addStockUnitRules">
                <el-form-item prop="stockUnit" label="库存单位" label-width="90px">
                    <el-input
                            v-model.trim="addStockUnitForm.stockUnit"
                            auto-complete="off"
                            placeholder="请输入库存单位"
                            @keyup.enter.native="comfirmAddStockUnit('addStockUnitForm')">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeSingleForm('addStockUnitForm')">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="comfirmAddStockUnit('addStockUnitForm')">保 存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        addStockUnit, //提交新建库存新建单位接口
    } from "@/api/api";
    export default {
        name: "addUnitDialog",
        props:['visible'],
        data(){
            return{
                addStockUnitForm: {
                    stockUnit: ""
                },
                addStockUnitRules: {
                    stockUnit: [
                        {required: true, trigger: "blur", message: "请输入库存单位"}
                    ]
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
            // 提交新建库存单位
            comfirmAddStockUnit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.isSaving = true;
                        let params = {
                            name: this.addStockUnitForm.stockUnit,
                            userId: this.userId
                        };
                        addStockUnit(params).then(res => {
                            this.isSaving = false;
                            if (res.data.code == 0) {
                                let stockUnitId = res.data.data;
                                this.$refs[formName].resetFields();
                                this.$emit('update:visible', false);
                                this.$emit('updateUnit',stockUnitId);
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
            //关闭新建库存单位弹窗
            closeSingleForm(formName) {
                this.addStockUnitForm.stockUnit = '';
                this.$refs[formName].resetFields();
                this.$emit('update:visible', false);
            },
        }
    }
</script>

<style scoped>

</style>