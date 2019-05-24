<template>
    <div class="procurement-plan-edit" v-loading="isLoading">
        <page-title :title="isEdit?'编辑采购规划':'新建采购规划'">
            <div>
                <nf-button @click="$router.go(-1)">取消</nf-button>
                <nf-button :loading="isSubmitting"  type="warning" @click="confirm">确定</nf-button>
            </div>
        </page-title>
        <div class="base-info">
            <div class="yellow-border-title">
                <div class="title">基本信息</div>
            </div>
            <div class="custom-filter-form mgt8">
                <el-form style="margin-left: -18px" :inline="true" label-width="85px">
                    <el-form-item label="规划单名称">
                        <el-input maxlength="20" v-model.trim="form.name"  placeholder="请填写"></el-input>
                    </el-form-item>
                    <el-form-item label="计划时段">
                        <el-date-picker
                                v-model="form.dateRange"
                                type="daterange"
                                placeholder="请选择"
                                @change="dateRangeChange">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="单位">
                        <el-select v-model.trim="form.unit"  placeholder="请选择">
                            <el-option label="元" value="元"></el-option>
                            <el-option label="万元" value="万元"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="采购总预算">
                        <el-input :disabled="detailInfo.status =='PASS'"  type="number" v-model="form.otbAmount"  placeholder="请填写"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="template-item">
            <div class="yellow-border-title">
                <div class="title">配置模板</div>
            </div>
            <div class="custom-filter-form mgt8">
                <el-form style="margin-left: -7px" :inline="true" label-width="85px">
                    <el-form-item label="采购规划模板">
                        <el-select @change="changeTemplateId" :disabled="isEdit" v-model="form.templateId" filterable  placeholder="请选择">
                            <el-option v-for="item in otbTemplateList"
                                       :label="item.name"
                                       :value="item.templateId"
                                       :key="item.templateId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="总负责人">
                        <worker-leader v-model="form.leaderUserId"  single="single" placeholder="请选择" ></worker-leader>
                    </el-form-item>
                    <el-form-item label="总审核人">
                        <worker-leader v-model="form.auditorUserId"  single="single" placeholder="请选择" ></worker-leader>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="form.templateId.length" class="custom-filter-form" style="border-top: 1px solid #DFE6EC">
                <el-form class="plan-tags-list" :inline="true">
                    <el-form-item v-for="(item,index) in planTagsList" :key="index" :label="item.typeName" >
                        <el-select  value-key="attrId"  v-model="item.selected" filterable multiple  placeholder="请选择">
                            <template v-if="!([11,12,13].indexOf(item.type)>-1)">
                                <el-option :value="''" disabled style="cursor:pointer;">
                                    <div class="orange" v-if="getFacCommonSettings" @click="showAddAttr(item.type,item.typeName,index)">新建</div>
                                </el-option>
                            </template>
                            <el-option v-for="attrItem in item.allAttrs"
                                       :label="attrItem.attrVal"
                                       :value="attrItem"
                                       :key="attrItem.attrId"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </div>
            <table v-if="form.templateId.length" class="item-table">
                <tr v-for="(levelItem,levelIndex) in levels" :key="levelIndex">
                    <td class="label">拆解层级{{changeChineseNumber(levelIndex+1)}}</td>
                    <td>{{levelItem.name}}</td>
                    <td class="label">分支拆解</td>
                    <td><span :class="{'gray':!levelItem.branchType}">{{levelItem.branchType}}</span></td>
                </tr>
            </table>
        </div>
        <!--各种属性新建弹窗-->
        <attribute-dialog :title="addAttr.title" :show.sync="addAttr.visible" @success="addAttrSuccess" :type="addAttr.type"></attribute-dialog>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from "vuex";
    import {getOtbTemplateList,createOtb,updateOtb,getOtbListAttrsByTemplateId,getOtbDetail} from '@/api/goodsPlan.js'
    import attributeDialog from '@/components/Common/attributeDialog'

    export default {
        components: {attributeDialog},
        data() {
            return {
                isSubmitting:false,
                isLoading:false,
                otbTemplateList:[],
                form:{
                    name:'',
                    startDate:'',
                    endDate:'',
                    dateRange:'',
                    unit:'',
                    otbAmount:'',
                    templateId:'',
                    leaderUserId:'',
                    auditorUserId:'',
                    planTags:[]
                },
                planTagsList:[],
                levels:[],
                detailInfo:{},
                addAttr:{
                    visible:false,
                    title:'',
                    type:'',
                    index:'',//当前新建的企划标签的在planTagsList里的索引

                },
                getFacCommonSettings:true, //是否有全选新建企划标签

            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            isEdit() {
                return this.$route.query.id?true:false
            }
        },
        methods: {
            async getOtbTemplateList(){
                let params={
                    bossUnitId:this.bossUnitId
                }
                await getOtbTemplateList(params).then(res =>{
                    if(res.data.code===0){
                        this.otbTemplateList = res.data.templates
                    }
                })
            },
            dateRangeChange(val){
                if(val){
                    const [start, end] = val.split(/\s-\s/g)
                    this.form.startDate = new Date(start.replace(/\-/g,"/")).getTime()/1000
                    this.form.endDate = new Date(end.replace(/\-/g,"/")).getTime()/1000
                }
            },
            confirm(){
                if(!this.form.name){
                    return this.$message.error('请填写规划单名称')
                }
                if(!this.form.dateRange){
                    return this.$message.error('请填写计划时段')
                }
                if(!this.form.unit){
                    return this.$message.error('请选择单位')
                }
                if(!this.form.otbAmount){
                    return this.$message.error('请填写采购预算')
                } else {
                    let pattern = /^([1-9]\d{0,11})(\.\d{1,2})?$|^0(\.\d{1,2})?$/;
                    if ( !pattern.test(this.form.otbAmount)) {
                        this.$message.error('采购预算最多只能输入两位小数');
                        return
                    }
                }
                if(!this.form.templateId){
                    return this.$message.error('请选择采购规划模板')
                }
                if(!this.form.leaderUserId){
                    return this.$message.error('请选择总负责人')
                }
                if(!this.form.auditorUserId){
                    return this.$message.error('请选择总审核人')
                }
                for(let i=0;i<this.planTagsList.length;i++){
                    let item = this.planTagsList[i]
                    if(!item.selected.length){
                        return this.$message.error('请选择'+item.typeName)
                    }

                }
                this.saving()
            },
            //新增、保存
            saving(){
                let api = createOtb
                this.form.planTags = []
                // 拼接选中的企划标签选中的值
                this.planTagsList.forEach(item =>{
                    item.allAttrs.forEach(planItem =>{
                        planItem.type = item.type
                        planItem.attrValue = planItem.attrVal //后台下拉返回的是attrVal，但是新增和编辑需要的是attrValue
                    })
                })
                this.planTagsList.forEach(item =>{
                    if(item.selected.length){
                        this.form.planTags = [...this.form.planTags,...item.selected]
                    }
                })
                let params = {
                    ...this.form,
                    userId:this.userId,
                    bossUnitId:this.bossUnitId
                }
                if(this.isEdit){
                    api = updateOtb
                    params.id = this.$route.query.id
                }
                this.isSubmitting = true
                api(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.$message.success(this.isEdit?'编辑成功':'新建成功')
                        //新建和编辑成功后都跳转到采购规划列表页面
                        this.$router.go(-1)
                        // if(this.isEdit){
                        //     this.getOtbDetail()
                        // } else {
                        //     this.$router.go(-1)
                        // }
                    } else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 采购模板改变
            changeTemplateId(val){
                if(!this.isEdit){
                    let params ={
                        bossUnitId:this.bossUnitId,
                        templateId:val
                    }
                    getOtbListAttrsByTemplateId(params).then(res =>{
                        if(res.data.code === 0){
                            this.form.leaderUserId = res.data.leaderUserId
                            this.form.auditorUserId = res.data.auditorUserId
                            let planTagsList = res.data.attrs
                            planTagsList.forEach(item =>{
                                item.selected = []
                            })
                            this.planTagsList = planTagsList
                        }
                    })

                    let currentOtbTemplate = this.otbTemplateList.find(item => item.templateId == val)
                    this.levels = currentOtbTemplate.levels
                }
        },
            // 转换成中文数字
            changeChineseNumber(number){
                let chineseNumber =''
                switch(number){
                    case 1:chineseNumber='一';break;
                    case 2:chineseNumber='二';break;
                    case 3:chineseNumber='三';break;
                    case 4:chineseNumber='四';break;
                    case 5:chineseNumber='五';break;
                }
                return chineseNumber
            },
            // 获取采购规划详情
            async getOtbDetail(){
                let params ={
                    id:this.$route.query.id
                }
                this.isLoading = true
                await getOtbDetail(params).then(res =>{
                    this.isLoading = false
                    if(res.data.code ===0){
                        this.detailInfo = res.data

                        this.form.name = this.detailInfo.name
                        this.form.dateRange = [new Date(this.detailInfo.startDate),new Date(this.detailInfo.endDate)]
                        this.form.unit = this.detailInfo.unit
                        this.form.otbAmount = this.detailInfo.otbAmount
                        this.form.templateId = this.detailInfo.templateId
                        this.form.leaderUserId = this.detailInfo.leaderUserId
                        this.form.auditorUserId = this.detailInfo.auditorUserId
                        this.levels = this.detailInfo.levels

                        this.planTagsList = this.detailInfo.attrTypes
                        this.form.planTags = []
                        if(this.detailInfo.attrTypes){
                            for(let i=0;i<this.detailInfo.attrTypes.length;i++){
                                let selected = this.detailInfo.attrTypes[i].allAttrs.filter(item => item.hasChoose ==1)
                                this.$set(this.detailInfo.attrTypes[i],'selected',selected)
                            }
                        }
                    }
                })
            },
            // 显示新建企划标签弹窗
            showAddAttr(type,title,index){
                this.addAttr.type = type
                this.addAttr.title = title
                this.addAttr.index = index
                this.addAttr.visible = true
            },
            addAttrSuccess(attrId,attrVal){
                let newAttrItem ={
                    type:this.addAttr.type,
                    attrId:attrId,
                    attrVal:attrVal
                }
                this.planTagsList[this.addAttr.index].selected.push(newAttrItem)
                this.planTagsList[this.addAttr.index].allAttrs.unshift(newAttrItem)
                this.addattr.visible = false
            }
        },
        async created() {
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            if(this.isEdit){
                await this.getOtbDetail()
            }
            await this.getOtbTemplateList()

        }
    }
</script>
<style lang="scss">
    .procurement-plan-edit{
        .el-input__inner{
            width: 220px;
        }
        .plan-tags-list{
             .el-form-item__label{
                 min-width: 60px;
             }
            .el-form-item__content{
                margin-right: 20px;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .base-info{
        padding:24px 24px 12px 24px ;
        background-color: #fff;
    }
    .template-item {
        margin: 8px 0;
        padding: 24px;
        background-color: #fff;
        &:first-child {
            margin-top: 16px;
        }
        .item-msg {
            font-size: 12px;
            margin-top: 10px;
            color: #808080;
        }
        .item-table {
            min-width: 480px;
            margin-top: 8px;
            border-top: 1px solid #dfe4ec;
            border-right: 1px solid #dfe4ec;
            td {
                font-size: 12px;
                padding: 10px;
                border-left: 1px solid #dfe4ec;
                border-bottom: 1px solid #dfe4ec;
                &.label {
                    width: 60px;
                    background-color: #F5F7FA;
                }
            }
        }
    }
</style>
