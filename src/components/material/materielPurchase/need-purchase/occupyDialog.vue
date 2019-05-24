<template>
    <el-dialog :modal-append-to-body="false" class="custom-dialog occupy" title="主动占用"
               :visible.sync="visible" size="tiny" @close="$emit('update:visible',false)">
        <div style="display: flex;justify-content: center;">
            <span style="white-space: nowrap;line-height: 36px;">主动占用:</span>
            <div style="flex: 0 0 200px;margin-left: 8px;">
                <el-input type="number" placeholder="请输入" v-model="value"></el-input>
                <div style="color: red;font-size: 12px;margin-top: 8px;" v-if="tip">{{tip}}</div>
            </div>
        </div>
        <div slot="footer">
            <el-button
                    @click="$emit('update:visible',false)">取 消
            </el-button>
            <el-button type="primary" :loading="btnLoading"
                       @click="confirm">确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {stockActivePreuse} from '@/api'
    export default {
        name: "occupy-dialog",
        props: ['value','visible','tableItem'],
        data() {
            return {
                tip: '',
                btnLoading: false
            }
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch:{
            visible(v) {
                if(v) {
                    this.tip = ''
                }
            }
        },
        methods: {
            confirm() {
                console.log(this.tableItem);
                // const toplimit = 99    // 可用数+旧主动占用stockActivePreuse
                // const lowerlimit = 3 // 已送料+已退料quantityReturned-已到料quantityArrived
                const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
                // “修改后的主动占用不可大于xxx（可用数+旧主动占用）”、“修改后的主动占用不可小于xxx（已送料+已退料-已到料）”“请输入正数”
                if(this.value<0){
                    this.tip = `请输入正数`
                } else if (!reg.test(this.value)) {
                    this.tip = `请输入不超过两位的小数`
                }
                // else if(this.value>toplimit){
                //     this.tip = `修改后的主动占用不可大于${toplimit}`
                // }else if (this.value<lowerlimit) {
                //     this.tip = `修改后的主动占用不可小于${lowerlimit}`
                // }
                else {
                    this.btnLoading = true
                    const params = {
                        unitId: this.unitId,
                        materialPurchaseDemandId: this.tableItem.materialPurchaseDemandId,
                        quantity: this.value
                    }
                    stockActivePreuse(params).then(res => {
                        this.btnLoading = false
                        if(res.data.code==0) {
                            this.tip = ''
                            this.$emit('update:visible',false)
                            this.$emit('success',this.tableItem.materialPurchaseDemandId)
                        }else {
                            this.tip = res.data.msg
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>