<template>
    <section class="procurement-plan-detail">
        <page-title :title="'采购规划：'+planName">
            <div><nf-button fsize='12'  @click="$router.push('/procurementPlan/list')">采购规划列表</nf-button></div>
        </page-title>
        <div class="main-content">
            <div class="level-list">
                <ul>
                    <li :title="item.levelName" v-for=" (item,index) in levelList" :key="index" @click="changeLevel(item,index)"
                        :class="{'active':currentLevel.activeIndex== index}">
                        <span v-if="item.type ==='level'" class="level-icon">{{item.level}}</span>
                        <span :class="{'pdl15':item.type =='branch'}">{{item.levelName}}</span>
                    </li>
                </ul>
            </div>
            <div class="detail">
                <!--:key="routerKey"解决路由相同，只改变query时，视图不更新的问题-->
                <router-view :key="routerKey"></router-view>
            </div>
        </div>
    </section>
</template>

<script>
    import { getOtbActualOverview } from '@/api/goodsPlan.js'

    export default {
        components: {

        },
        data() {
            return {
                levelList:[],
                currentLevel:{
                    level:1,
                    type:'level', //level：层级  branch：支线
                    activeIndex:'0',
                    levelId:'',
                },
                planName:''
            }
        },
        computed: {
            routerKey() {
                return this.$route.name !== undefined
                    ? this.$route.name + +new Date()
                    : this.$route + +new Date();
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            planId(){
                return this.$route.query.planId
            }
        },
        watch:{
            "$route.query.activeIndex": {
                handler: function(val, oldVal){
                    this.currentLevel.activeIndex = val
                    this.currentLevel.level = this.$route.query.level

                }
            },
        },
        methods: {
            changeLevel(item,index){
                // 使用注释掉的这段代码时，会导致在中间页直接切换时，路由和参数都没有变化，并且视图无法更新
                // this.currentLevel.level = item.level
                // this.currentLevel.type = item.type
                // this.currentLevel.levelId =item.levelId
                // this.currentLevel.levelName = item.name
                // this.currentLevel.activeIndex = index
                // this.currentLevel.planId =this.planId
                // this.currentLevel.ddd = +new Date()
                if(item.type ==='level'){
                    if(item.level===1){
                        // 拆解详情
                        this.$router.push({path:'/procurementPlan/levelDetail',
                            query:{
                                ...item,
                                activeIndex:index,
                                planId:this.planId
                            }
                        })
                    } else {
                        // 中间页（非支线）
                        this.$router.push({path:'/procurementPlan/levelList',
                            query: {
                                ...item,
                                activeIndex:index,
                                planId:this.planId
                            }
                        })
                    }
                } else {
                    // 中间页（支线）
                    this.$router.push({path:'/procurementPlan/levelList',
                        query: {
                            ...item,
                            activeIndex:index,
                            planId:this.planId
                        }
                    })
                }

            },
            getLevelList(){
                let params = {
                    planId:this.planId
                }
                getOtbActualOverview(params).then(res =>{
                    if(res.data.code ===0){
                        this.planName = res.data.plan.name
                        this.levelList = []
                        res.data.plan.levels.forEach((item,index) =>{
                            //level：层级  branch：支线
                            this.levelList.push({
                                levelId:item.levelId,
                                levelName:item.name,
                                type:'level',
                                level:index+1,
                                branchesLength:item.branches.length?item.branches.length:0
                            })
                            item.branches.forEach(branchItem =>{
                                this.levelList.push({
                                    levelName:branchItem.name,
                                    type:'branch',
                                    levelId:branchItem.levelId,
                                    level:index+1
                                })
                            })
                            // if(item.branchType == 'SUPPLIER'){
                            //     this.levelList.push({
                            //         levelName:'供应商下单计划',
                            //         type:'branch',
                            //         levelId:item.levelId,
                            //         level:index+1
                            //     })
                            // }
                        })
                        this.changeLevel(this.levelList[0],0)
                    }
                })
            }
        },
         created() {
            this.getLevelList()
        },


    }
</script>

<style lang="scss">
    .procurement-plan-detail {}


</style>
<style lang="scss" scoped>

    .procurement-plan-detail {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: row;
            overflow-y: hidden;
            .level-list {
                width: 125px;
                margin-right: 10px;
                background: #fff;
                overflow-y: auto;
                ul > li {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    .level-icon{
                        background-color: #939FB8;
                        line-height: 100%;
                        font-size: 12px;
                        padding: 0px 3px;
                        border-radius: 3px;
                        color: #fff;
                    }
                    color: #3b3b3b;
                    background-color: #fff;
                    line-height: 32px;
                    font-size: 12px;
                    border-bottom: 1px solid #E6EAF0;
                    padding: 0 2px 0 8px;
                    cursor: pointer;
                    &.active {
                        background-color: #E6EAF0;
                    }

                    /*&:first-child {*/
                        /*font-weight: bold;*/
                    /*}*/
                }
            }
            .detail {
                flex: 1;
                overflow-y: hidden;
                .design-img{
                    display:inline-block;
                    vertical-align: middle;
                    width: 56px;
                    height: 56px;
                    padding: 3px 0;
                }
            }
        }
    }
</style>
