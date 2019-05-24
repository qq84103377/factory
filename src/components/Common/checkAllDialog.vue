<template>
    <div class="check-all-dialog">
        <!--全选提示框-->
        <el-dialog :title="title" :modal-append-to-body="false"  class="custom-dialog"
                   :visible.sync="visible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <div><el-radio class="radio" v-model="checkAllValue" label="currentPage">{{currentPageText}}</el-radio></div>
                <div class="mgt20"><el-radio class="radio" v-model="checkAllValue" label="allPage">{{allPageText}}</el-radio></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirm">确 认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        // *****props***** //
        // title：弹出框标题
        // visible：可见性
        // currentPageText：选中当前页的文本
        // allPageText：选中所有页的文本
        props: ['value','title','visible','currentPageText','allPageText'],
        data() {
            return {
                checkAllValue:''
            }
        },
        watch:{
            value(val){
                if(this.value !== this.checkAllValue){
                    this.checkAllValue = val
                }
            }
        },
        methods: {
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.$emit('input',this.checkAllValue)
                this.$emit('update:visible',false)
                this.$emit('confirm',this.checkAllValue)
            }
        },
        created(){
            if(this.value){
                this.checkAllValue = this.value
            }
        }
    }
</script>

<style lang="scss" scoped>


</style>
<style lang="scss">
    .check-all-dialog{
        .el-dialog--small{
            width: 365px;
        }
    }
</style>
