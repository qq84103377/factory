<template>
    <div class="procurement-plan-template" v-loading="isLoading">
        <div class="template-item" v-for="(item,index) in otbTemplateList" :key="item.templateId">
            <div class="yellow-border-title">
                <div class="title">{{item.name}}</div>
                <div>
                    <nf-button fsize='12'  @click="editTurn(item.templateId)">编辑</nf-button>
                </div>
            </div>
            <div class="item-msg">
                <span><span>默认总负责人：</span><span class="pdr32">{{item.leaderUserName}}</span></span>
                <span><span>默认总审核人：</span><span class="pdr32">{{item.auditorUserName}}</span></span>

                <span>
                    <span>企划标签：</span>
                    <span class="pdr32">
                        <template v-for="(planTagItem,planTagIndex) in item.templatePlanTagTypes">
                            {{planTagItem.attrTypeName}}
                            {{planTagIndex === item.templatePlanTagTypes.length-1?'':'、'  }}
                        </template>
                    </span>
                </span>
            </div>
            <table class="item-table">
                <tr v-for="(levelItem,levelIndex) in item.levels" :key="levelIndex">
                    <td class="label">拆解层级{{changeChineseNumber(levelIndex+1)}}</td>
                    <td>{{levelItem.name}}</td>
                    <td class="label">分支拆解</td>
                    <td><span :class="{'gray':!levelItem.branchType}">{{levelItem.branchType||'无'}}</span></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import {getOtbTemplateList} from '@/api/goodsPlan.js'
    import { mapState, mapMutations, mapGetters } from "vuex";
    export default {
        data(){
            return {
                otbTemplateList:[],
                isLoading:false
            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            }
        },
        methods: {
            // 编辑的事件跳转
            editTurn(templateId){
                 // 权限
                if(!this.powerJudgement.permissions("fac.productTemplate.edit")){
                    return
                }
                this.$router.push({
                    path:'/procurementPlan/editTemplate',
                    query:{templateId:templateId}
                });
            },
            getOtbTemplateList(){
                let params={
                    bossUnitId:this.bossUnitId
                }
                this.isLoading = true
                getOtbTemplateList(params).then(res =>{
                    this.isLoading = false
                    if(res.data.code===0){
                        this.otbTemplateList = res.data.templates
                    }
                })
            },
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
        },
        created(){
            this.getOtbTemplateList()
        }
    }
</script>

<style lang="scss" scoped>
    .procurement-plan-template{
        margin-top: 16px;
        min-height: 100px;
        .template-item{
            margin: 8px 0;
            padding:14px 24px 24px;
            background-color: #fff;
            &:first-child{
                margin-top: 16px;
            }
            .item-msg{
                font-size: 12px;
                margin-top: 10px;
                color:#808080 ;
            }
            .item-table{
                min-width: 480px;
                margin-top: 8px;
                border-top: 1px solid #dfe4ec;
                border-right: 1px solid #dfe4ec;
                td{
                    font-size: 12px;
                    padding: 10px;
                    border-left: 1px solid #dfe4ec;
                    border-bottom: 1px solid #dfe4ec;
                    &.label{
                        width: 60px;
                        background-color:#F5F7FA ;
                    }
                }
            }
        }
    }

</style>
