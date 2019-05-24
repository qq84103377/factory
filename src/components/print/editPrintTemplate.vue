<template>
    <div class="edti-print-template">
        <page-title :title="(isEditTemplate?'编辑':'新建')+'打印模板'">
            <nf-button style="width:98px;" @click="$router.push({path:'/printList',query:{type:templateType}})">取消</nf-button>
            <nf-button :loading="isSubmitting" style="width:98px;margin-left:12px;" type="warning" @click="saveTempDetails">完成</nf-button>
        </page-title>
        <!--
        changeTemplate 模板内容改变的时候触发
        showOperaDesc 显示操作说明弹窗
        showChildTemplateConfig 显示模板的二级模板配置弹窗
        printPreview  打印预览
        -->
        <template-config  :templateData="templateData" :templateType="templateType"
                          ref="templateConfig"
                          @printPreview="printPreview"
                          @changeTemplateContent="changeTemplateContent"
                          @showChildTemplateConfig="showChildTemplateConfig"
                          @setPictureSize="setPictureSize"
                          @showOperaDesc="showOperaDesc"></template-config>
        <!--changeChildTemplate 改变当前二级模板内容-->
        <template-config-dialog  :templateData="childTemplateData" :templateType="templateType" :visible.sync="configDialogVisible" :isPrimaryTemplate="false"
                                 @changeChildTemplate="changeChildTemplate"
                                 @showOperaDesc="showOperaDesc" @setThreePictureSize="setPictureSize"></template-config-dialog>
        <!--操作说明弹窗-->
        <opera-desc-dialog  :visible.sync="operaDescVisible"></opera-desc-dialog>
        <!--调整图片尺寸-->
        <set-picture-size :visible.sync="setPictureSizeVisible" :currentSecTemplate="currentSecTemplate"></set-picture-size>
    </div>
</template>
<script>
    import templateConfig from "@/components/print/template-config/template-config";
    import templateConfigDialog from "@/components/print/template-config/template-config-dialog";
    import operaDescDialog from '@/components/print/template-config/opera-desc-dialog';
    import setPictureSize from '@/components/print/childForPrint/setPictureSize.vue';

    import {addOrUpdateTemplate,getPrintTempDetails,addPrintTemp,updatePrintTemp,billPreview} from '../../api/api'

    export default {
        components: {templateConfig,templateConfigDialog,operaDescDialog,setPictureSize},
        data() {
            return {
                configDialogVisible:false, //模板配置弹窗是否可见
                operaDescVisible:false, // 模板配置说明弹窗是否可见
                // 传给配置模板
                templateData:{
                    name:'', //模板名称
                    wildcards:[],// 通配符列表
                    content:'', //模板内容
                    systemTemplate:'' // 预设模板
                },
                //传给配置子模板弹窗
                childTemplateData:{
                    name:'', //模板名称
                    wildcards:[],// 通配符列表
                    content:'', //模板内容
                },
                secTemplates:[], // 新建或者编辑的时候传给后台的二级模板
                currentSecTemplate:{}, //当前在配置的二级模板
                thiTemplates:{}, // 新建或者编辑的时候传给后台的三级模板
                isSubmitting:false, //是否提交中
                setPictureSizeVisible:false, //是否显示调整图片尺寸弹窗
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            templateType(){
                return this.$route.query.type
            },
            isEditTemplate(){
                return this.$route.query.tempId?true:false
            }
        },
        methods: {
            // 编辑模板
            addOrUpdateTemplate() {
                if (this.printName == '') {
                    this.$message({
                        showClose: false,
                        message: "未填写打印模板名称",
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    return;
                } else {
                    if (this.printName.length > 12) {
                        this.$message({
                            showClose: false,
                            message: "模板名称不能超过12位",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return;
                    }
                }
                let html = this.$refs.ue.getUEContent();
                this.html = html;
                let params = {
                    token: '',
                    tempId: this.$route.query.tempId,
                    typeId: this.$route.query.typeId,
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    userId: this.userId,
                    temContent: this.html,
                    temName: this.printName,
                }
                addOrUpdateTemplate(params).then(
                    res => {
                        if (res.data.code == 4) {
                            this.$router.push('./printList')
                        } else {
                            this.$message({
                                showClose: false,
                                message: res.data.msg,
                                type: "error",
                                duration: this.$globalConfig.elementUI.duration
                            });
                        }
                    }
                )
            },
            // 显示操作说明
            showOperaDesc(){
               this.operaDescVisible = true
            },
            // 弹出子模板配置弹窗
            showChildTemplateConfig(row){
                this.childTemplateData.wildcards = row.childWildcards
                //新建的时候, 直接取二级预设模板，编辑的时候，将预设模板的内容替换成二级模板内容（secTemplates.content）
                this.currentSecTemplate = this.secTemplates.find(item => item.wildcardId == row.id)
                this.childTemplateData.name = row.name
                this.childTemplateData.content = this.currentSecTemplate.content
                this.configDialogVisible = true
            },
            // 设置图片字段对应的宽和高
            setPictureSize(row, level){
                console.log(row,7770)
                if(row.type ===2){
                    //新建的时候, 直接取二级预设模板，编辑的时候，将预设模板的内容替换成二级模板内容（secTemplates.content）
                    if(level) {
                        this.currentSecTemplate = this.thiTemplates.find(item => item.wildcardId == row.id)
                    } else{
                        this.currentSecTemplate = this.secTemplates.find(item => item.wildcardId == row.id)
                    }

                    console.log(this.currentSecTemplate,'00998')
                    this.setPictureSizeVisible = true
                    console.log('调整图片大小')
                }
            },
            // 获取打印模板详情
            getPrintTempDetails(){
                let params = {
                    tempId:this.$route.query.tempId,
                    type:this.templateType,
                    userId:this.userId
                }
                getPrintTempDetails(params).then(res =>{
                    if(res.data.code ===0){
                        this.templateData.wildcards = res.data.wildcards
                        this.templateData.systemTemplate = res.data.systemTemplate

                        // 新建的时候，二级模板直接取二级预设模板（systemSecTemplate）
                        this.secTemplates = res.data.systemSecTemplates
                        // 新建的时候。三级模板直接取二级预设模板
                        this.thiTemplates = res.data.systemThiTemplates
                        if(this.isEditTemplate){
                            this.templateData.name = res.data.firstTemplate.name
                            this.templateData.content = res.data.firstTemplate.content
                            // 如果是在编辑模板，二级模板直接取二级模板（secTemplates）
                            this.secTemplates = res.data.secTemplates
                            // 新建的时候。三级模板直接取二级预设模板
                            this.thiTemplates = res.data.thiTemplates
                        }
                        //如果是在新建模板，
                    }
                    console.log('传给编辑模板组件的数据',this.templateData)
                })
            },
            // 新建或者编辑模板
            saveTempDetails(){
                if (this.templateData.name == '') {
                    this.$message({
                        showClose: false,
                        message: "请输入打印模板名称",
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration
                    });
                    return;
                } else {
                    if (this.templateData.name.length > 12) {
                        this.$message({
                            showClose: false,
                            message: "打印模板名称不能超过12位",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        return;
                    }
                }
                let html =this.$refs['templateConfig'].$refs['ue'].getUEContent()

                this.templateData.content = html
                let params = {
                    unitId:this.unitId,
                    name:this.templateData.name,
                    content:this.templateData.content,
                    secTemps:this.secTemplates,
                    type:this.templateType,
                    thiTemps: this.thiTemplates
                }
                let api = addPrintTemp
                if(this.isEditTemplate){
                    api = updatePrintTemp
                    params ={
                        id:this.$route.query.tempId,
                        ...params
                    }
                }
                this.isSubmitting = true
                api(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code === 0){
                        this.$message.success((this.isEditTemplate?'编辑':'新建') + '成功')
                        this.$router.push({path:'/printList',query:{type:this.templateType}})
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 改变正在编辑的二级模板内容
            changeChildTemplate(){
                // currentSecTemplate指向了secTemplates里的一个对象，所以直接修改currentSecTemplate.content即可
                this.currentSecTemplate.content = this.childTemplateData.content
            },
            // 打印预览
            async printPreview(){
                // 工单预览（传id过去，在打印页面拼接html）
                if(this.templateType === 'mission'){
                    localStorage.setItem('printHtml', JSON.stringify(this.templateData.content));
                    window.open('/#/printShow' + '?showId=' + this.$route.query.typeId + '&printType=missionPreview' + '&tempId=' + this.$route.query.tempId);
                }
                //其他单据调用后台接口直接获取html
                else {
                    let previewHtml = await this.getPreviewHtml()
                    localStorage.setItem('printHtml',JSON.stringify(previewHtml) );
                    window.open('/#/printShow' + '?printType=preview');

                }
            },
            // 获取要预览的html
            async getPreviewHtml(){
                let previewHtml = ''
                let params ={
                    type:this.templateType,
                    userId:this.userId,
                    printTempCreate:{
                        unitId:this.unitId,
                        content:this.templateData.content,
                        secTemps: this.secTemplates
                    }
                }
                console.log(params)
                await billPreview(params).then(res =>{
                    if(res.data.code ===0){
                        previewHtml = res.data.data
                    }
                })
                return previewHtml

            }
        },
        created() {
            this.getPrintTempDetails()
        },
    }
</script>
<style lang="scss" scoped>

</style>
<style lang="scss">

</style>



