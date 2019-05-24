<template>
    <!--调整图片尺寸-->
    <div class="set-picture-size">
        <el-dialog @close="cancel" title="调整图片尺寸" class="custom-dialog" :modal-append-to-body="false" :show-close="false" :visible.sync="visible" size="tiny">
            <div class="dialog-content-wrap">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="水平（H）">
                        <el-input type="number" :min="1" v-model="form.width"></el-input>
                    </el-form-item>
                    <el-form-item label="垂直（V）">
                        <el-input :disabled="form.isKeepScale" type="number" :min="1" v-model="form.height"></el-input>
                    </el-form-item>
                    <el-form-item label-width="30" label=" ">
                        <el-checkbox label="保持纵横比（M）" v-model="form.isKeepScale"></el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button  type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props:['visible','currentSecTemplate'],
        data() {
            return {
                form:{
                    width:'',
                    height:'',
                    isKeepScale:false
                }
            }
        },
        computed: {
        },
        methods: {
            cancel(){
                this.form={
                    width:'',
                    height:'',
                    isKeepScale:false
                }
                this.$emit('update:visible',false)
            },
            confirm(){
                if((this.form.width!=''&&this.form.width<=0)||(this.form.height!=''&&this.form.height<=0)){
                    this.$message.error('图片尺寸必须大于0')
                    return
                }
                this.currentSecTemplate.width = !this.form.width?0:this.form.width
                this.currentSecTemplate.height = !this.form.height?0:this.form.height
                this.currentSecTemplate.isKeepScale = this.form.isKeepScale
                this.$emit('update:visible',false)
            }
        },
        watch:{
            visible:{
                handler(val){
                    this.form.width = this.currentSecTemplate.width == 0?'':this.currentSecTemplate.width
                    this.form.height = this.currentSecTemplate.height == 0?'':this.currentSecTemplate.height
                    this.form.isKeepScale = this.currentSecTemplate.isKeepScale
                },
                deep:true
            },
            'form.isKeepScale'(val){
                if(val){
                    this.form.height = ''
                }
            }
        },
        created() {
        },
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">
    .set-picture-size{
        .el-dialog--tiny{
            width: 350px;
        }
    }
</style>



