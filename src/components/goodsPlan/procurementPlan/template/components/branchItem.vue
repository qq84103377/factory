<!--支线拆解组件-->
<template>
    <div class="branch-item">
        <div class="branch-name">
            <div>
                <span class="branch-no">{{level}}</span>
                <span>支线拆解</span>
                <div class="branch-type">
                    <span @click="changeBrancnType(false)" :class="{'active':!isCustom}">系统模板</span>
                    <span @click="changeBrancnType(true)"  :class="{'active':isCustom}">自定义</span>
                </div>
            </div>
            <div>
                <nf-button fsize='12'  @click="deleteBranch(level)">删除</nf-button>
            </div>

        </div>
        <div class="mgt12">
            <span  v-if="!isCustom">
                <span>拆解模板</span>
                <el-select style="width: 220px;margin-left:10px" clearable v-model="levelData.branchType" placeholder="请选择">
                    <el-option
                            :disabled="item.disabled"
                            v-for="item in branchDismantleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span  v-show="isCustom">
                <span>支线名称</span>
                <el-input style="width: 220px;margin-left:10px" v-model.trim="levelData.name" maxlength="20"  placeholder="请输入"></el-input>
            </span>

            <span  class="mgl30">
                <span>拆解标签依据</span>
                <el-select @change="baseTypeChange" clearable v-model="levelData.baseType" style="width: 160px;margin-left:10px" placeholder="请选择">
                    <el-option
                            v-for="item in baseTypeOptions"
                            :key="item.type"
                            :label="item.name"
                            :value="item.type">
                    </el-option>
                </el-select>
            </span>
            <nf-button @click="showSetNextDismantleMan" class="mgl30" size="small" type="warning" >设置拆解负责人</nf-button>
        </div>
        <multiple-tags
            ref="multipleTags"
            v-show="isCustom"
            from="branch"
            :parentLevel = "parentLevel"
            :levelData = "levelData"
            :selectTagOptions.sync="selectTagOptions"
            :level="level"
            :auditorId="auditorId"
            :levelId="levelData.levelId"></multiple-tags>
        <set-next-dismantle-man  @confirm="confirmSetNextDismantleMan" :list="JSON.parse(JSON.stringify(levelData.levelAttrChargers))" :visible.sync="setNextDismantleManVisible"></set-next-dismantle-man>
    </div>
</template>

<script>
    import MultipleTags from "./multipleTags";
    import SetNextDismantleMan from "./setNextDismantleMan";

    import {getCommonGoodsAttr,getGoodsAttrForUpdate} from '@/api/goodsPlan.js'
    export default {
        // level:层级
        // selectTagOptions:选择标签数据源
        // levelData 层级相关数据
        // 支线拆解下拉数据
        // 当前层级总负责人
        // parentLevel :父层级
        props:['parentLevel','level','selectTagOptions','branchDismantleOptions','levelData','auditorId','baseTypeOptions'],
        components: {
            MultipleTags,
            SetNextDismantleMan
        },
        data(){
            return {
                isCustom:false,
                setNextDismantleManVisible:false,
                currentBaseType:'',//点击"设置拆解负责人"时保存当前选中的"拆解标签依据"，下一次点击"设置拆解负责人"的时候，
                // 根据保存的"拆解标签依据"判断需不需要重新请求接口，从而达到不切换""关键数据""时，保存原来已经设置的数据
            }
        },
        computed: {
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            isEdit() {
                return this.$route.query.templateId?true:false
            }
        },
        methods: {
            // 删除层级
            deleteBranch(level){
                this.$confirm('删除该支线后，该支线所有已填写数据都将被清空，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('deleteBranch',this.parentLevel,level)
                }).catch(() => {
                });
            },
            //更新横向标签 填写关键数据的下拉数据
            keyDataOptionsChange(options){
                this.$set(this.levelData,'keyDataOptions',options)
            },
            // 支线拆解改变时设置该模板是否已经被占用
            changeBranchDismantle(val,isDisabled){
                this.branchDismantleOptions.forEach((item,index) =>{
                    if(item.value === val){
                        this.$set(this.branchDismantleOptions[index], 'disabled', isDisabled)
                    }
                })
            },
            // 显示设置下级拆解负责人弹窗
            async showSetNextDismantleMan(){
                if(!this.levelData.baseType){
                    this.$message.error('请先选择拆解依据标签')
                    return
                }
                if(this.currentBaseType !== this.levelData.baseType){
                    this.currentBaseType = this.levelData.baseType
                    await this.getAcrossTagAttrsList(this.levelData.baseType)
                }
                this.setNextDismantleManVisible =  true
            },
            // 根据关键标签获取设置下级拆解负责人用到到标签
            async getAcrossTagAttrsList(type){
                let api = getCommonGoodsAttr
                let params = {}

                if(this.isEdit){
                    api = getGoodsAttrForUpdate
                    params ={
                        bossUnitId:this.bossUnitId,
                        levelId:this.levelData.levelId,
                        attrType:type,
                        templateId:this.$route.query.templateId
                    }

                } else {
                    params = {
                        bossUnitId:this.bossUnitId,
                        type:type
                    }
                }
                await api(params).then(res =>{
                    if(res.data.code ===0){
                        if(this.isEdit){
                            this.levelData.levelAttrChargers = res.data.attrs
                        } else {
                            // 新建的时候要塞chargerIds、auditorIds进去
                            let levelAttrChargers = []
                            res.data.commonGoodsAttrs.forEach(item =>{
                                levelAttrChargers.push({
                                    ...item,
                                    chargerIds:[],
                                    auditorIds:this.auditorId?[this.auditorId]:[]
                                })
                            })
                            this.levelData.levelAttrChargers = levelAttrChargers

                        }

                    }
                })
            },
            // 设置拆解负责人
            confirmSetNextDismantleMan(val){
                this.levelData.levelAttrChargers = val
            },
            // 拆解依据改变时提示（拆解负责人已清空，请重新设置）
            baseTypeChange(val){
                if(this.levelData.levelAttrChargers.length){
                    this.$message.error('拆解负责人已清空，请重新设置')
                }
                this.levelData.levelAttrChargers = []
                // 拆解依据被清空时，将上一次点击"设置拆解负责人"时保存当前选中的"拆解标签依据"清空
                if(!val){
                    this.currentBaseType = ''
                }
            },
            // 点击 系统模板和自定义的时候
            changeBrancnType(isCustom){
                if(this.hasEditData(isCustom)){
                    this.$confirm('切换将清除该支线所有已填数据，是否继续切换？', '提示', {
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        type: 'warning'
                    }).then(() => {
                        this.isCustom = isCustom
                        this.clearData(isCustom)
                    }).catch(() => {
                    });
                } else{
                    this.isCustom = isCustom
                    this.clearData(isCustom)
                }

            },
            // 清除当前已经填写的数据
            clearData(isCustom){
                // 清除已选中的 "拆解依据"、"拆解负责人"
                this.levelData.baseType = ''
                this.levelData.levelAttrChargers = []

                // 如果是切换到"自定义"
                if(isCustom){
                    // 设置branchType = 'NORMAL'
                    this.levelData.branchType = 'NORMAL'
                }
                // 如果是切换到"系统模板"（供应商规划）,清除"自定义"要填写的内容
                else{
                    this.levelData.branchType = ''
                    this.levelData.name = ''
                    // 将原本占用的关键拆解标签设置为可用，并删除选中的关键拆解标签
                    this.levelData.keyTags.forEach((item,index)=>{
                        this.$refs.multipleTags.deleteRow('KEY',index)
                    })
                    this.levelData.keyTags = []

                    // 将原本占用的辅助标签设置为可用，并删除选中的辅助标签
                    this.levelData.supportTags.forEach((item,index)=>{
                        this.$refs.multipleTags.deleteRow('SUPPORT',index)
                    })
                    this.levelData.supportTags = []

                    // 删除选中的横向标签（横向标签没有占用关系）
                    this.levelData.acrossTags = []
                }
            },
            // 检查当前支线是否已经有已填数据
            hasEditData(isCustom){
                let hasEditData = false
                // 要切换到"系统模板"，检查"自定义"
                if(!isCustom){
                    if(this.levelData.name || this.levelData.baseType || this.levelData.levelAttrChargers.length ||
                        this.levelData.keyTags.length || this.levelData.supportTags.length ||
                        this.levelData.acrossTags.length){
                        hasEditData = true
                    }
                }
                // 要切换到"自定义"，检查"系统模板"
                else {
                    if(this.levelData.branchType || this.levelData.baseType || this.levelData.levelAttrChargers.length){
                        hasEditData = true
                    }
                }
                return hasEditData
            }
        },
        watch:{
            selectTagOptions:{
                handler(val){
                    // 更新上一级selectTagOptions
                    this.$emit('update:selectTagOptions', val)
                },
                deep:true
            },
            'levelData.branchType'(newValue, oldValue){
                this.isCustom = newValue==='NORMAL'?true:false
                this.changeBranchDismantle(newValue, true)
                if (oldValue) {
                    this.changeBranchDismantle(oldValue, false)
                }
            }
        },
        created(){
            // 编辑进来的时候，设置支线拆解是否为自定义类型
            this.isCustom = this.levelData.branchType==='NORMAL'?true:false
            if(this.levelData.branchType){
                this.changeBranchDismantle(this.levelData.branchType,true)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .branch-item{
        margin-top: 16px;
        padding: 12px 12px 12px 36px;
        font-size: 12px;
        background-color:#F5F7FA ;
        border: 1px solid #DFE6EC;
        .branch-type{
            display: inline-block;
            font-size: 12px;
            margin-left: 10px;
            color: #C4C6CC;
            cursor: pointer;
            &>span{
                padding: 4px 10px;
                background-color:#F0F2FA;
                margin-left: -3px;
                &.active{
                    color: #fff;
                    background-color: #ff9c38;
                }
            }
        }
        .branch-no{
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            margin:0 4px 0 -24px;
            text-align: center;
            line-height: 16px;
            color: #fff;
            background-color: #FFA914;
        }
        .tags-title{
            margin: 8px 0;
        }
        .branch-dismantle{
            padding: 12px;
            background-color:#F5F7FA ;
            border: 1px solid #DFE6EC;
        }
        .branch-name{
            display: flex;
            justify-content: space-between;
        }
    }

</style>
