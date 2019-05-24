<template>
    <div id="customFieldForm" class="custom-field-from custom-filter-form">
        <el-form
                v-show="customFieldList.length>0"
                ref="customFieldForm"
                label-width="100px"
                :model="formModel"
                :rules="toRules">
            <el-row style="margin-top:12px;">
                <el-col :span="6" v-for="(item,index) in customFieldList" :key="index">
                    <el-form-item :label="item.customFieldName" :prop="'customField_'+item.customFieldId" :class="{
                    'checkCodeActive':modelName==='SPL_DESIGN_STYLE'&&checkCodeListData&&checkCodeListData.indexOf('customField_'+item.customFieldId)>-1,
                     'is-error':modelName==='GOODS_STYLE'&&(item.selected&&!item.selected.length) && checkCodeListData&&checkCodeListData.indexOf('customField_'+item.customFieldId)>-1}" >
                        <!--数值类型-->
                        <div v-if="['INTEGER','DECIMAL'].includes(item.customFieldType)">
                            <el-input @change="changeValue($event,item)" @blur="inputBlur(item)"  type="number"
                                      v-if="handlePowerVisible('customField_'+item.customFieldId)"
                                      :disabled="!handlePowerEdit('customField_'+item.customFieldId)"
                                      v-model="formModel['customField_'+item.customFieldId]" placeholder="请输入"></el-input>
                            <el-input v-else disabled placeholder="***"></el-input>
                        </div>
                        <!--文本类型-->
                        <div v-else-if="item.customFieldType ==='TEXT'">
                            <el-input @change="changeValue($event,item)" @blur="inputBlur(item)"
                                      :maxlength="100" type="text"
                                      v-if="handlePowerVisible('customField_'+item.customFieldId)"
                                      :disabled="!handlePowerEdit('customField_'+item.customFieldId)"
                                      v-model.trim="formModel['customField_'+item.customFieldId]" placeholder="请输入"></el-input>
                            <el-input v-else disabled placeholder="***"></el-input>
                        </div>
                        <!--下拉框类型-->
                        <div v-else-if="['SINGLE_SELECT','MULTI_SELECT'].includes(item.customFieldType)">
                            <el-select
                                    @change="changeValue($event,item)"
                                    v-if="handlePowerVisible('customField_'+item.customFieldId)"
                                    :disabled="!handlePowerEdit('customField_'+item.customFieldId)"
                                    v-model="formModel['customField_'+item.customFieldId]"
                                    clearable
                                    filterable
                                    :multiple="item.customFieldType == 'MULTI_SELECT'"
                                    placeholder="请选择">
                                <el-option  :value="''" style="cursor: pointer" disabled>
                                    <span class="orange" @click="showAddOption(item,index)">+新建</span>
                                </el-option>
                                <el-option
                                        v-if="item.options&&item.options.length"
                                        v-for="optionItem in item.options"
                                        :key="optionItem.optionId"
                                        :label="optionItem.optionName"
                                        :value="optionItem.optionId">
                                </el-option>
                            </el-select>
                            <el-select v-else disabled placeholder="***"></el-select>
                        </div>

                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog class="custom-dialog add-option-dialog"
                   :title="'新建【'+addOption.currentItem.customFieldName+'】'"
                   :visible.sync="addOption.visible"
                   @close="cancelAddOption"
                   :modal-append-to-body="false">
            <el-form  label-width="140px">
                <el-form-item
                        prop=""
                        :label="`【${addOption.currentItem.customFieldName}】编号`">
                    <el-input v-model.trim="addOption.optionCode" placeholder="不填则自动生成"></el-input>
                </el-form-item>
                <el-form-item
                        :label="`【${addOption.currentItem.customFieldName}】名称`"
                        :required="true">
                    <el-input v-model.trim="addOption.optionName" placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancelAddOption">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmAddOption">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>

    import {addCustomFieldOption,
        getCustomFieldList} from '@/api/selfFactory.js'
    export default {
        props: ['isEdit','detailCustomFieldsList','checkCodeListData','toRules','type','modelName','fieldRoles'], //fieldRoles 字段权限
        /*******************
         *
         *
         * modelName 模块名称对应的值（用于权限配置）
         *      ALL    全部模块
         *      GOODS_STYLE    商品档案
         *      SPL_DESIGN_STYLE    设计档案
         *      FAC_PRD_ORDER    生产订单
         *      FACTORY_MISSION    生产工单
         *      GOODS_STOCK    商品库存
         * * type    GOODS_STYLE 商品档案；DESIGN_STYLE 设计档案
         * ****************/
        components: {},
        data() {
            return {
                isSubmitting:false,
                formModel:{},
                customFieldList: [],
                addOption:{
                    visible:false,
                    currentItem:{},
                    currentIndex:'',
                    optionCode:'',
                    optionName:'',
                }
            }
        },
        computed: {
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
        },
        watch: {
            detailCustomFieldsList:{
                handler(val){
                    if(this.isEdit){
                        let formModel = {}
                        val.forEach(item =>{
                            if(['INTEGER','DECIMAL'].includes(item.customFieldType)){
                                formModel['customField_'+item.customFieldId] = item.selected+''
                            } else {
                                formModel['customField_'+item.customFieldId] = item.selected
                            }
                        })
                        this.formModel = JSON.parse(JSON.stringify(formModel))
                        this.customFieldList = JSON.parse(JSON.stringify(val))
                        this.inputCustomFields()
                    }
                },
                deep:true
            }
        },
        methods: {
            handlePowerEdit(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).editable
                }else {
                    return false
                }
            },
            handlePowerVisible(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).visible
                }else {
                    return false
                }
            },
            // 添加的时候，获取自定义字段
            getCustomFieldList() {
                let params = {
                    module: 'STYLE',
                    bossUnitId: this.bossUnitId
                }
                getCustomFieldList(params).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data

                        let formModel = {}
                        data.forEach(item =>{
                            if(['INTEGER','DECIMAL','SINGLE_SELECT'].includes(item.customFieldType)){
                                formModel['customField_'+item.customFieldId] = ''
                            } else {
                                formModel['customField_'+item.customFieldId] = []
                            }
                        })
                        this.formModel = JSON.parse(JSON.stringify(formModel))

                        data.forEach(item =>{
                            if(item.customFieldType === 'MULTI_SELECT'){
                                item.selected = []
                            }  else{
                                item.selected = ''
                            }
                        })
                        this.customFieldList = data
                    }
                })
            },
            changeValue($event,item){
                item.selected = $event
                this.inputCustomFields()
            },
            inputCustomFields(){
                let customFields = []
                this.customFieldList.forEach(item =>{
                    if(
                        (['INTEGER','DECIMAL'].includes(item.customFieldType)&&item.selected!=0)||
                        (['SINGLE_SELECT','MULTI_SELECT','TEXT'].includes(item.customFieldType)&&item.selected.length>0)
                    ){
                        let addItem = {
                            customFieldId:item.customFieldId,
                            customFieldName:item.customFieldName,
                            customFieldType:item.customFieldType,
                        }
                        if(item.customFieldType === 'TEXT'){
                            addItem.textValue = item.selected
                        } else if(item.customFieldType === 'SINGLE_SELECT'){
                            addItem.selectedOptions = [{optionId:item.selected}]
                        } else if(item.customFieldType === 'MULTI_SELECT'){
                            addItem.selectedOptions = []
                            item.selected.forEach(item =>{
                                addItem.selectedOptions.push({
                                    optionId:item
                                })
                            })
                        } else if(['INTEGER','DECIMAL'].includes(item.customFieldType)){
                            addItem.numberValue = item.selected
                        }
                        customFields.push(addItem)
                    }
                })
                this.$emit('input',customFields)
            },
            inputBlur(item){
                if(item.customFieldType === 'INTEGER'){
                    let pattern =/^(0|[1-9][0-9]*)$/
                    if (item.selected&&!pattern.test(item.selected)) {
                         this.$message.error('只能输入整数')
                        let deleteIndex = this.formModel['customField_'+item.customFieldId].indexOf('.')
                        if(deleteIndex>-1){
                            this.formModel['customField_'+item.customFieldId] = this.formModel['customField_'+item.customFieldId].substr(0,deleteIndex)
                        }
                    }
                } else if(item.customFieldType === 'DECIMAL'){
                    let pattern = /^([1-9]\d{0,11})(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                    if (item.selected&&!pattern.test(item.selected)) {
                        this.$message.error('最多只能输入两位小数');
                        this.formModel['customField_'+item.customFieldId] = parseFloat(this.formModel['customField_'+item.customFieldId]).toFixed(2)
                    }
                }
            },
            // 添加自定义字段选项
            showAddOption(item,index){
               $('.el-select-dropdown').hide()
                this.addOption.currentItem = item
                this.addOption.currentIndex = index
                this.addOption.visible = true
                this.addOption.optionCode =''
                this.addOption.optionName =''
            },
            cancelAddOption(){
                this.addOption.visible = false
            },
            confirmAddOption(){
                if(!this.addOption.optionName.length){
                    this.$message.error('请输入【'+this.addOption.currentItem.customFieldName+'】名称')
                    return
                }
                let params = {
                    customFieldId:this.addOption.currentItem.customFieldId,
                    optionCode:this.addOption.optionCode,
                    optionName:this.addOption.optionName,
                }

                this.isSubmitting = true
                addCustomFieldOption(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code == 0){
                        this.$message.success('新建成功')
                        this.addOption.currentItem.options.unshift({
                            optionId : res.data.data.id,
                            optionCode : res.data.data.optionCode,
                            optionName : res.data.data.optionName
                        })
                        if(this.addOption.currentItem.customFieldType === 'MULTI_SELECT' ){
                            this.formModel['customField_'+this.addOption.currentItem.customFieldId].push(res.data.data.id)
                            // this.addOption.currentItem.selected.push(res.data.data.id)
                        } else {
                            this.formModel['customField_'+this.addOption.currentItem.customFieldId] =res.data.data.id
                            // this.addOption.currentItem.selected = res.data.data.id
                        }
                        this.addOption.visible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        created() {
            if(!this.isEdit){
                this.getCustomFieldList()
            }
        }
    }
</script>

<style lang="scss" >
.custom-field-from{
    .el-form-item{
        margin-bottom: 22px!important;
    }
    .checkCodeActive{
        .el-form-item__label{
            color: #ff9c38;
        }
        .el-input__inner{
            border: 1px solid #ff9c38;
            border-color:#ff9c38 !important;
        }
    }
    .el-form-item.is-error .el-input__inner{
        border-color: #ff4949 !important;
    }
    .add-option-dialog{
        .el-dialog{
            width: 460px;
        }
    }
}
</style>
