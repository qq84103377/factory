<!--层级拆解组件-->
<template>
    <div class="level-item">
        <div class="level-name">
            <div>
                <span class="level-no">{{level}}</span>
                <span>第{{changeChineseNumber(level)}}层级名称</span>
                <el-input style="width: 220px;margin-left:10px" v-model.trim="levelData.name"
                          placeholder="请输入"></el-input>
                <span class="mgl30" v-if="level>1">
                    <span>拆解标签依据</span>
                    <el-select @change="baseTypeChange" clearable v-model="levelData.baseType" style="width: 160px;margin-left:10px"  placeholder="请选择">
                        <el-option
                                v-for="item in baseTypeOptions"
                                :key="item.type "
                                :label="item.name"
                                :value="item.type">
                        </el-option>
                    </el-select>
                </span>
                <nf-button v-if="level>1" @click="showSetNextDismantleMan" class="mgl30" size="small" type="warning">设置拆解负责人</nf-button>
            </div>
            <div>
                <nf-button v-if="level>1" fsize='12' @click="deleteLevel(level)">删除</nf-button>
            </div>
        </div>
        <multiple-tags
                from="main"
                :levelData="levelData"
                :selectTagOptions.sync="selectTagOptions"
                :level="level"
                :auditorId="auditorId"
                :levelId="levelData.levelId"></multiple-tags>

        <!--auditorId 设置下级拆解审核人默认值-->
        <branch-item v-if="levelData.branches" v-for="(item,index) in levelData.branches" :key="'branch'+level+(index+1)"
                     @deleteBranch="deleteBranch"
                     :parentLevel="level"
                     :level="index+1"
                     :auditorId="auditorId"
                     :selectTagOptions.sync="selectTagOptions"
                     :levelData="item"
                     :branchDismantleOptions.sync="branchDismantleOptions"
                     :baseTypeOptions="baseTypeOptionsForBranch"></branch-item>
        <div v-if="levelData.branches&&levelData.branches.length<5" class="add-branch mgt8">
            <span class="branch-no">{{levelData.branches.length+1}}</span>
            <span @click="addBranch" class="orange pointer">+增加支线拆解</span>
        </div>
        <set-next-dismantle-man v-if="level>1" @confirm="confirmSetNextDismantleMan" :list="JSON.parse(JSON.stringify(levelData.levelAttrChargers))" :visible.sync="setNextDismantleManVisible"></set-next-dismantle-man>

    </div>
</template>

<script>
    import {getCommonGoodsAttr,getGoodsAttrForUpdate} from '@/api/goodsPlan.js'
    import SetNextDismantleMan from "./setNextDismantleMan";

    import MultipleTags from "./multipleTags";
    import BranchItem from "./branchItem";

    export default {
        // level:层级
        // selectTagOptions:选择标签数据源
        //levelData 层级相关数据
        //支线拆解下拉数据
        // 当前层级总负责人
        props: ['level', 'selectTagOptions', 'branchDismantleOptions', 'levelData', 'auditorId', 'baseTypeOptions'],
        components: {
            BranchItem,
            MultipleTags,
            SetNextDismantleMan
        },
        data() {
            return {
                baseTypeOptionsForBranch: [],
                options: {
                    branchDismantleOption: [
                        {
                            value: "SUPPLIER",
                            label: "供应商规划"
                        }
                    ]
                },
                setNextDismantleManVisible:false,// 设置拆解负责人弹窗是否可见
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
            changeChineseNumber(number) {
                let chineseNumber = ''
                switch (number) {
                    case 1:
                        chineseNumber = '一';
                        break;
                    case 2:
                        chineseNumber = '二';
                        break;
                    case 3:
                        chineseNumber = '三';
                        break;
                    case 4:
                        chineseNumber = '四';
                        break;
                    case 5:
                        chineseNumber = '五';
                        break;
                }
                return chineseNumber
            },
            // 删除层级
            deleteLevel(level) {
                this.$confirm('删除本层级后，本层级及后面的层级的所有已填写数据都将被清空，是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('deleteLevel', level)
                }).catch(() => {
                });
            },
            // 删除支线
            deleteBranch(level,branchLevel) {
                this.levelData.branches.splice(branchLevel - 1, 1)
                //删除层级后，更新被删除的层级引用的选项标签
                this.selectTagOptions.forEach((item,index) =>{
                    item.children.forEach((childItem,childIndex) =>{
                        if(childItem.level==level&&childItem.branchLevel == branchLevel){
                            this.$set(this.selectTagOptions[index].children[childIndex],'disabled',false)
                            this.$set(this.selectTagOptions[index].children[childIndex],'level','')
                            this.$set(this.selectTagOptions[index].children[childIndex],'from','')

                        }
                    })
                })
            },
            // 添加层级
            addBranch() {
                this.levelData.branches.push({
                    name: '',
                    keyTags: [],
                    supportTags: [],
                    acrossTags: [],
                    levelAttrChargers: [],
                    baseType: '', //拆解依据
                    branchType: '', //支线类型
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
            baseTypeChange(){
                if(this.levelData.levelAttrChargers.length){
                    this.$message.error('拆解负责人已清空，请重新设置')
                }
                this.levelData.levelAttrChargers = []
                // 拆解依据被清空时，将上一次点击"设置拆解负责人"时保存当前选中的"拆解标签依据"清空
                if(!val){
                    this.currentBaseType = ''
                }
            },
        },
        watch: {
            selectTagOptions: {
                handler(val) {
                    // 更新上一级selectTagOptions
                    this.$emit('update:selectTagOptions', val)
                },
                deep: true
            },
            // 关键标签改变时，更新支线以及下一层级的拆解标签依据的下拉选项
            'levelData.keyTags': {
                handler(val) {
                    this.baseTypeOptionsForBranch = []
                    // 拿出该层级选中的关键拆解标签
                    val.forEach(item => {
                        if (item.attrType) {
                            for (let i = 0; i < this.selectTagOptions.length; i++) {
                                let option = this.selectTagOptions[i].children.find(optionItem => optionItem.type === item.attrType)
                                if (option) {
                                    this.baseTypeOptionsForBranch.push(option)
                                    break;
                                }
                            }
                        }
                    })
                    this.$emit('setBaseTypeOptions', this.baseTypeOptionsForBranch, this.level - 1)
                },
                deep: true
            }
        },
        created() {
        }
    }
</script>

<style lang="scss" scoped>
    .level-item {
        margin-top: 16px;
        padding: 12px 12px 12px 36px;
        font-size: 12px;
        background-color: #FAFBFC;
        border: 1px solid #EBEFF5;
        .level-no {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin: 0 4px 0 -24px;
            text-align: center;
            line-height: 16px;
            border-radius: 2px;
            color: #fff;
            background-color: #FFA914;
        }
        .tags-title {
            margin: 8px 0;
        }
        .branch-dismantle {
            padding: 12px;
            background-color: #F5F7FA;
            border: 1px solid #DFE6EC;
        }
        .level-name {
            display: flex;
            justify-content: space-between;
        }
        .add-branch {
            padding: 12px;
            font-size: 12px;
            background-color: #F5F7FA;
            border: 1px solid #DFE6EC;
            .branch-no {
                display: inline-block;
                width: 16px;
                height: 16px;
                margin-right: 4px;
                text-align: center;
                line-height: 16px;
                border-radius: 50%;
                color: #fff;
                background-color: #FFA914;
            }
        }
    }

</style>

