<template>
    <div class="payment-dialog">
        <el-dialog :modal-append-to-body="false" class="custom-dialog back-node-dialog" title="付款"
                   :visible.sync="isShow" size="tiny" @close="cancel">
            <el-form>
                <el-form-item label="付款金额" label-width="80px">
                    <el-input
                            type="number"
                            placeholder="￥"
                            v-model.trim="form.payAmount">
                    </el-input>
                </el-form-item>
                <el-form-item label="财务账号" label-width="80px">
                    <el-select v-model="form.remitMethodId" placeholder="请选择" popper-class="paymentBigSel">
                        <p class="paymentLiNew" @click="dialogNew">新建</p>
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.remitMethodName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款时间" label-width="80px">
                    <el-date-picker
                            v-model="form.payDate"
                            type="date"
                            @change="payDateChange"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" label-width="80px">
                    <el-input
                            placeholder="选填"
                            v-model.trim="form.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="save">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="新建财务账户"
                :visible.sync="dialogVisible"
                custom-class="financialAccount-dialog"
        >
            <div class="financialAccount-dialog-div">
                <span>财务账户</span>
                <el-input v-model="inputName" placeholder="请输入内容"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogSure">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
    import {financialAccountQueryList, financialAccountAdd,factoryPayAdd} from '@/api/api'

    export default {
        props: ['isShow','outsideFactoryId'],
        data() {
            return {
                isSubmitting:false,
                userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                dialogVisible: false,
                inputName: '',
                form: {
                    outsideFactoryId: '',
                    payAmount: '',
                    remitMethodId: '',
                    payDate: '',
                    remark: ''
                },
                options: []
            }
        },
        created() {
            this.getFinancialAccountQueryList()

        },
        methods: {
            // 获取财务账户列表
            getFinancialAccountQueryList() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    pageNum: 1,
                    pageSize: 25550,
                };
                financialAccountQueryList(params).then(res => {
                    let data = res.data.data;
                    this.options = data.list;


                })
            },
            dialogNew(){
                //制造点击事件去除下拉框
                $(".paymentBigSel").css('display','none')
                this.dialogVisible = true;
            },
            //确实按钮
            dialogSure() {
                financialAccountAdd({
                    remitMethodName: this.inputName,
                    userId: this.userId,
                    unitId: this.unitId,
                }).then(res => {
                    this.$message({
                        message: '添加成功',
                        type: 'success',
                    });
                    // 重新获取数据
                    this.form.remitMethodId = res.data.data.id
                    this.dialogVisible = false;
                    this.getFinancialAccountQueryList()
                })


            },
            cancel() {
                this.$emit('update:isShow', false)
            },
            payDateChange(val){
                console.log(val);
                this.form.payDate = val
            },
            save() {
                if(!this.form.payAmount) return this.$message.error('付款金额不能为空')
                if(!this.form.remitMethodId) return this.$message.error('财务账号不能为空')
                this.form.outsideFactoryId = this.outsideFactoryId
                this.isSubmitting = true
                factoryPayAdd(this.form).then(res=>{
                    console.log(res);
                    this.isSubmitting = false
                    this.getFinancialAccountQueryList()
                    this.$emit('getSuccess')
                    this.$emit('update:isShow', false)
                })

            }
        }
    }
</script>
<style lang="scss">
    .payment-dialog {
        .el-select, .el-date-editor.el-input {
            width: 100%;
        }

    }

    .paymentLiNew {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        color: #ffa914;
        cursor: pointer;
    }
    .financialAccount-dialog {
        width: 560px;
        .el-dialog__header {
            text-align: center;
            border-bottom: 1px solid #808080;
            padding-bottom: 20px;
        }
        .financialAccount-dialog-div {
            padding-left: 100px;
        }
        .el-input, .el-input__inner {
            width: 78%;
        }
        .el-dialog__footer {
            border-top: 1px solid #808080;
            padding-top: 20px;
            margin-top: 20px;
        }
    }

</style>


