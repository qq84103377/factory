<template>
    <div class="print-template-config-dialog">
        <el-dialog  @close="cancel"   class="custom-dialog" :title="templateData.name+'编辑'"
                   :visible.sync="visible">
            <div class="main-content">
                <template-config :templateData="templateData" :templateType="templateType" @showOperaDesc="showOperaDesc"
                                  ref="printTemplateConfig" :isPrimaryTemplate="isPrimaryTemplate" @setPictureSize="setPictureSize"></template-config>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button  type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import templateConfig from './template-config.vue'

    export default {
        props:['isPrimaryTemplate','templateType','templateData','visible'],
        components: {templateConfig},
        data() {
            return {
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            //显示操作说明弹窗
            showOperaDesc(){
                this.$emit('showOperaDesc')
            },
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.templateData.content =this.$refs['printTemplateConfig'].$refs['ue'].getUEContent()
                this.$emit('update:visible',false)
                this.$emit('changeChildTemplate')
            },
            // 三级图片弹窗
            setPictureSize(row) {
                this.$emit('setThreePictureSize',row, '3')
            }
        },
        created() {
        },
    }
</script>
<style lang="scss" scoped>
</style>
<style lang="scss">
.print-template-config-dialog{
    .el-dialog--small{
        width: 1136px;
    }
}
</style>



