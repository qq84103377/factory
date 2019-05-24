<template>
    <div class="procurement-plan-template-edit" v-loading="isLoading">
        <page-title :title="isEdit?'编辑采购规划模板':'新建采购规划模板'">
            <div>
                <nf-button @click="$router.go(-1)">取消</nf-button>
                <nf-button :loading="isSubmitting"  type="warning" @click="confirm">确定</nf-button>
            </div>
        </page-title>
        <base-box>
            <div class="yellow-border-title"><div class="title">采购规划单字段</div></div>
            <el-form class="custom-filter-form" style="margin-left: -45px"  label-width="100px" :inline="true" :model="formInline">
                <el-form-item label="模板名称">
                    <el-input v-model.trim="form.name" style="width: 220px" maxlength="20" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="默认总负责人">
                    <worker-leader @change="changeLeaderUserId" v-model="form.leaderUserId" style="width: 180px" single="single" placeholder="请选择" ></worker-leader>
                </el-form-item>
                <el-form-item label="默认总审核人">
                    <worker-leader v-model="form.auditorUserId" style="width: 180px" single="single" placeholder="请选择" ></worker-leader>
                </el-form-item>
            </el-form>
            <plan-tags level="0" :list.sync="form.templatePlanTagTypes" :selectTagOptions.sync="selectTagOptions"></plan-tags>
        </base-box>
        <base-box class="mgt8">
            <div class="yellow-border-title"><div class="title">采购规划拆解层级</div></div>
            <!--deleteLevel删除层级-->
            <!--auditorId 设置下级拆解审核人默认值-->
            <level-item v-for="(item,index) in form.levels" :key="index" :level="index+1"
                        @deleteLevel="deleteLevel"
                        @setBaseTypeOptions="setBaseTypeOptions"
                        :selectTagOptions.sync="selectTagOptions"
                        :levelData="item"
                        :branchDismantleOptions.sync="branchDismantleOptions"
                        :auditorId="form.leaderUserId"
                        :baseTypeOptions="item.baseTypeOptions"></level-item>
            <div v-if="form.levels.length<5" class="add-level mgt8">
                <span class="level-no">{{form.levels.length+1}}</span>
                <span @click="addLevel" class="orange pointer">+增加拆解层级</span>
            </div>
        </base-box>
    </div>
</template>

<script>
    import {getOtbCommonTag,createOtbTemplate,getOtbTemplateDetail,editOtbTemplate} from '@/api/goodsPlan.js'

    import { mapState, mapMutations, mapGetters } from "vuex";
    import ContentWrap from "../../../Common/content-wrap";
    import PageTitle from "../../../Common/page-title";
    import PlanTags from "./components/planTags";
    import LevelItem from "./components/levelItem";
    export default {
        components: {
            LevelItem,
            PlanTags,
            PageTitle,
            ContentWrap},
        data(){
            return {
                isLoading:false,
                isSubmitting:false,
                // 选项标签下拉
                selectTagOptions: [
                    {
                        name: '商品字段',
                        type: 0,
                        children: []
                    },
                    {
                        name: '订单字段',
                        type: 1,
                        children: []
                    }
                ],
                // 支线拆解下拉
                branchDismantleOptions:[
                    {
                        value:"SUPPLIER",
                        label:"供应商规划",
                        disabled:false
                    }
                ],
                form:{
                    bossUnitId:this.bossUnitId,
                    name:'',
                    leaderUserId:'',
                    auditorUserId:'',
                    templatePlanTagTypes:[],
                    levels:[{
                        name:'',
                        keyTags:[],
                        supportTags:[],
                        acrossTags:[],
                        levelAttrChargers:[],
                        baseType:'', //拆解依据
                        branches:[],
                        baseTypeOptionsForNext:[],
                        baseTypeOptions:[]
                    }],
                }

            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            isEdit() {
                return this.$route.query.templateId?true:false
            }
        },
        watch:{

        },
        methods: {
            //默认总负责人改变时，设置默认的下级拆解审核人(新建的时候)
            changeLeaderUserId(val){
                if(!this.isEdit){
                    this.form.levels.forEach((item,index) =>{
                        if(item.levelAttrChargers&&item.levelAttrChargers.length){
                            item.levelAttrChargers.forEach((attrItem,attrIndex) =>{
                                if(!attrItem.auditorIds.length){
                                    attrItem.auditorIds.push(val)
                                }
                            })
                        }

                    })
                }
            },
            // 设置选项标签组件下拉数据
            async getSelectTagOptions(){
                let params = {
                    bossUnitId:this.bossUnitId
                }
                await getOtbCommonTag(params).then(res =>{
                    if(res.data.code === 0){
                        this.selectTagOptions[0].children = res.data.goodsFields
                        this.selectTagOptions[1].children = res.data.orderFields
                        this.selectTagOptions.forEach(item =>{
                            item.children.forEach(item =>{
                                item.level = ''
                            })
                        })
                    }
                })
            },
            // 添加层级
            addLevel(){
                this.form.levels.push({
                    name:'',
                    keyTags:[],
                    supportTags:[],
                    acrossTags:[],
                    levelAttrChargers:[],
                    baseType:'', //拆解依据
                    branches:[],
                    baseTypeOptionsForNext:[],
                    baseTypeOptions:this.form.levels[this.form.levels.length-1].baseTypeOptionsForNext
                })
            },
            // 删除层级
            deleteLevel(level){
                let index = level - 1
                this.form.levels.splice(index,this.form.levels.length-index)
                //删除层级后，更新被删除的层级引用的选项标签
                this.selectTagOptions.forEach((item,index) =>{
                    item.children.forEach((childItem,childIndex) =>{
                        if(childItem.level>=level){
                            this.$set(this.selectTagOptions[index].children[childIndex],'disabled',false)
                            this.$set(this.selectTagOptions[index].children[childIndex],'level','')
                            this.$set(this.selectTagOptions[index].children[childIndex],'from','')
                        }
                    })
                })
            },
            // 确定新建、编辑
            confirm(){
                // 备份企划标签，编辑失败时回西显示
                let backupTemplatePlanTagTypes = this.form.templatePlanTagTypes
                // 基础数据字段校验
                if(!this.form.name){
                    this.$message.error('请填写模板名称')
                    return
                }
                if(!this.form.leaderUserId){
                    this.$message.error('请选择默认总负责人')
                    return
                }
                if(!this.form.auditorUserId){
                    this.$message.error('请选择默认总审核人')
                    return
                }

                let templatePlanTagTypes = []
                this.form.templatePlanTagTypes.forEach(item =>{
                    if(item.attrType){
                        templatePlanTagTypes.push(item.attrType)
                    }
                })
                if(templatePlanTagTypes.length===0){
                    this.$message.error('请添加企划标签')
                    return
                }
                // 层级数据校验
                for(let i=0;i<this.form.levels.length;i++){
                    let item = this.form.levels[i]
                    let levelChinese = this.changeChineseNumber(i+1)
                    if(!item.name){
                        this.$message.error('请填写第'+levelChinese+'层级名称')
                        return
                    }
                    // 校验拆解标签依据
                    if(!item.baseType&&i!=0){
                        this.$message.error('请填写第'+levelChinese+'层级的拆解标签依据')
                        return
                    }
                    // 校验关键拆解标签
                    if(!item.keyTags.length){
                        this.$message.error('请添加第'+levelChinese+'层级的关键拆解标签')
                        return
                    } else{
                        for(let i=0;i<item.keyTags.length;i++){
                            let keyTag = item.keyTags[i]
                            if (!keyTag.attrType){
                                this.$message.error('请选择第'+levelChinese+'层级的关键标签')
                                return
                            }
                            // 关键拆解标签的最后一条需要填写关键数据
                            if(item.keyTags.length ===1){
                                if (keyTag.keyData.length===0){
                                    this.$message.error('请选择第'+levelChinese+'层级的关键数据')
                                    return
                                }
                            }
                            if(item.keyTags.length>1 && i ==item.keyTags.length-1){
                                if (keyTag.keyData.length===0){
                                    this.$message.error('请选择第'+levelChinese+'层级的关键数据')
                                    return
                                }
                            }


                        }
                    }
                    //检验辅助标签
                    if(item.supportTags.length){
                        for(let i=0;i<item.supportTags.length;i++){
                            let supportTag = item.supportTags[i]
                            if (!supportTag.attrType){
                                this.$message.error('请选择第'+levelChinese+'层级的辅助标签')
                                return
                            }
                        }
                    }
                    //检验横向标签
                    if(item.acrossTags.length){
                        for(let i=0;i<item.acrossTags.length;i++){
                            let acrossTag = item.acrossTags[i]
                            if (!acrossTag.attrType){
                                this.$message.error('请选择第'+levelChinese+'层级的横向标签')
                                return
                            }
                            if (acrossTag.keyData.length ===0){
                                this.$message.error('请选择第'+levelChinese+'层级的填写关键数据')
                                return
                            }
                            if (acrossTag.acrossTagAttrs.length ===0){
                                this.$message.error('请选择第'+levelChinese+'层级的使用标签项')
                                return
                            }
                        }
                    }
                    // 支线校验
                    let mainItem= item
                    for(let i=0;i<mainItem.branches.length;i++){
                        let item = mainItem.branches[i]
                        // 如果是自定义支线，检验同层级校验一样
                        if(item.branchType === 'NORMAL'){
                            if(!item.name){
                                this.$message.error('请填写第'+levelChinese+'层级第'+(i+1)+'条支线名称')
                                return
                            }
                            // 校验拆解标签依据
                            if(!item.baseType){
                                this.$message.error('请填写第'+levelChinese+'层级第'+(i+1)+'条支线的拆解标签依据')
                                return
                            }
                            // 校验关键拆解标签
                            if(!item.keyTags.length){
                                this.$message.error('请添加第'+levelChinese+'层级第'+(i+1)+'条支线的关键拆解标签')
                                return
                            } else{
                                for(let i=0;i<item.keyTags.length;i++){
                                    let keyTag = item.keyTags[i]
                                    if (!keyTag.attrType){
                                        this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的关键标签')
                                        return
                                    }
                                    // 关键拆解标签的最后一条需要填写关键数据
                                    if(item.keyTags.length ===1){
                                        if (keyTag.keyData.length===0){
                                            this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的关键数据')
                                            return
                                        }
                                    }
                                    if(item.keyTags.length>1 && i ==item.keyTags.length-1){
                                        if (keyTag.keyData.length===0){
                                            this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的关键数据')
                                            return
                                        }
                                    }


                                }
                            }
                            //检验辅助标签
                            if(item.supportTags.length){
                                for(let i=0;i<item.supportTags.length;i++){
                                    let supportTag = item.supportTags[i]
                                    if (!supportTag.attrType){
                                        this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的辅助标签')
                                        return
                                    }
                                }
                            }
                            //检验横向标签
                            if(item.acrossTags.length){
                                for(let i=0;i<item.acrossTags.length;i++){
                                    let acrossTag = item.acrossTags[i]
                                    if (!acrossTag.attrType){
                                        this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的横向标签')
                                        return
                                    }
                                    if (acrossTag.keyData.length ===0){
                                        this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的填写关键数据')
                                        return
                                    }
                                    if (acrossTag.acrossTagAttrs.length ===0){
                                        this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的使用标签项')
                                        return
                                    }
                                }
                            }
                        } else{
                            // 如果支线拆解选择了系统模板，判断系统模板是否有填
                            if (!item.branchType){
                                this.$message.error('请选择第'+levelChinese+'层级第'+(i+1)+'条支线的拆解模板')
                                return
                            }
                            // 校验拆解标签依据
                            if(!item.baseType){
                                this.$message.error('请填写第'+levelChinese+'层级第'+(i+1)+'条支线的拆解标签依据')
                                return
                            }
                        }
                    }
                }
                // 发起请求
                this.form.templatePlanTagTypes = templatePlanTagTypes
                let params = {
                    ...this.form,
                    bossUnitId:this.bossUnitId,
                }
                let api = createOtbTemplate
                if(this.isEdit){
                    api = editOtbTemplate
                    params = {
                        ...params,
                        templateId:this.$route.query.templateId
                    }
                }
                console.log(this.form,'发起请求前')
                this.isSubmitting = true
                api(params).then(res=>{
                    this.isSubmitting = false
                    if(res.data.code ===0){
                        this.$message.success(this.isEdit?'编辑成功':'新建成功')
                        // if(this.isEdit){
                        //     this.getOtbTemplateDetail()
                        // } else{
                            this.$router.go(-1)
                        // }
                    } else {
                        this.form.templatePlanTagTypes = backupTemplatePlanTagTypes
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 转换数字为中文
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
            // 获取模板详情
            async getOtbTemplateDetail(){
                let params = {
                    templateId:this.$route.query.templateId
                }
                this.isLoading = true
                await getOtbTemplateDetail(params).then(res =>{
                    this.isLoading = false
                    if(res.data.code ===0){
                        this.form = res.data.template
                        this.form.bossUnitId = this.bossUnitId
                        this.form.levels.forEach((item,index)=>{
                            // 设置关键拆解标签里面关键数据选中的值
                            item.keyTags.forEach(item =>{
                                this.$set(item,'keyData',this.convertToKeyData(item))
                            })

                            // // 根据关键拆解标签，算出横向标签里面关键数据的下拉选项
                            // let lastKeyTags = item.keyTags[item.keyTags.length-1]
                            // item.keyDataOptionsForAcrossTags = this.convertToKeyDataOptions(lastKeyTags)

                            // 设置横向标签里面关键数据选中的值
                            item.acrossTags.forEach(item =>{
                                this.$set(item,'keyData',this.convertToKeyData(item))
                            })

                            // 支线对应数据也要做转换(支线类型为"自定义")
                            item.branches.forEach(item =>{
                                if(item.branchType === 'NORMAL'){
                                    // 设置关键拆解标签里面关键数据选中的值
                                    item.keyTags.forEach(item =>{
                                        this.$set(item,'keyData',this.convertToKeyData(item))
                                    })

                                    // // 根据关键拆解标签，算出横向标签里面关键数据的下拉选项
                                    // let lastKeyTags = item.keyTags[item.keyTags.length-1]
                                    // item.keyDataOptionsForAcrossTags = this.convertToKeyDataOptions(lastKeyTags)

                                    // 设置横向标签里面关键数据选中的值
                                    item.acrossTags.forEach(item =>{
                                        this.$set(item,'keyData',this.convertToKeyData(item))
                                    })
                                }

                            })
                        })
                    }
                })
            },
            // 将关键数据选中的值转换成数组（keyData）
            convertToKeyData(item){
                let keyData = []
                if(item.skuQuantityFlag){
                    keyData.push('skuQuantityFlag')
                }
                if(item.purchaseQuantityFlag){
                    keyData.push('purchaseQuantityFlag')
                }
                if(item.purchaseAmountFlag){
                    keyData.push('purchaseAmountFlag')
                }
                return keyData
            },
            // 根据选中的关键拆解标签，算出对应层级的横向标签的关键数据下拉选项
            // convertToKeyDataOptions(lastKeyTags){
            //     let keyDataOptions =[]
            //     if(lastKeyTags.skuQuantityFlag){
            //         keyDataOptions.push({
            //             label:'SKU数',
            //             value:'skuQuantityFlag'
            //         })
            //     }
            //     if(lastKeyTags.purchaseQuantityFlag){
            //         keyDataOptions.push({
            //             label:'采购数量',
            //             value:'purchaseQuantityFlag'
            //         })
            //     }
            //     if(lastKeyTags.purchaseAmountFlag){
            //         keyDataOptions.push({
            //             label:'采购金额',
            //             value:'purchaseAmountFlag'
            //         })
            //     }
            //     return keyDataOptions
            // },
            // 更新下一层级拆解标签依据的下拉选项
            setBaseTypeOptions(baseTypeOptions,index){
                // baseTypeOptions:改变后的关键标签
                // index 当前层级在this.form.levels里的索引

                // 更新当前层级的baseTypeOptionsForNext（用于增加拆解层级的时候，给要增加的层级的baseTypeOptions默认值）
                this.$set(this.form.levels[index],'baseTypeOptionsForNext',baseTypeOptions)
                let  baseTypeOptionsValues = baseTypeOptions.map(item =>{return item.type})

                // 如果有下一层级的话
                if(this.form.levels.length-1>index){
                    // 当前层级的关键标签改变时，及时更新下一层级的baseTypeOptions的值
                    this.$set(this.form.levels[index+1],'baseTypeOptions',baseTypeOptions)
                    // 删除下一层级 的 '拆解标签依据'选中但是下拉选项中没有的值（因为关键拆解标签的关键标签可能随时被删除）
                    if(!baseTypeOptionsValues.includes(this.form.levels[index+1].baseType)){
                        this.$set(this.form.levels[index+1],'baseType','')
                    }
                }
                if(this.form.levels.length&&this.form.levels[index].branches&&this.form.levels[index].branches.length){
                    // 删除 所有支线'拆解标签依据'选中但是下拉选项中没有的值（因为关键拆解标签的关键标签可能随时被删除）
                    this.form.levels[index].branches.forEach((branchItem,branchIndex) =>{
                        if(!baseTypeOptionsValues.includes(branchItem.baseType)){
                            this.$set(this.form.levels[index].branches[branchIndex],'baseType','')
                        }
                    })
                }
            }
        },
        async created(){
            await this.getSelectTagOptions()
            if(this.isEdit){
                await this.getOtbTemplateDetail()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .procurement-plan-template-edit{
        min-width: 1068px;
        .add-level{
            padding: 12px;
            font-size: 12px;
            background-color:#FAFBFC;
            border: 1px solid #EBEFF5;
            .level-no{
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right:4px;
                text-align: center;
                line-height: 16px;
                border-radius: 2px;
                color: #fff;
                background-color: #FFA914;
            }
        }
    }
</style>
