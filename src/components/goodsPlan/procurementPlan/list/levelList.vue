<template>
    <div class="box-shadow" v-loading="loading" style="min-height: 66px;height: 100%">
        <dynamic-table v-if="dynamicTable.headers.length"
                       :hasNextLevel="false"
                       :isMiddlePage="true"
                       :headers="dynamicTable.headers"
                       :body="dynamicTable.body"></dynamic-table>
    </div>
</template>

<script>
    import DynamicTable from '@/components/goodsPlan/procurementPlan/list/components/dynamicTable';
    import {getMiddlePageList,getBranchMiddlePageList} from '@/api/goodsPlan.js'
    export default {
        components: {
            DynamicTable
        },
        data() {
            return {
                loading:false,
                dynamicTable:{
                    headers:[],
                    body:[]
                }
            }
        },
        computed: {
            levelId(){
                return this.$route.query.levelId
            },
            type(){
                return this.$route.query.type
            },
            planId(){
                return this.$route.query.planId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            // 获取列表数据
            getList(){
                let params={
                    levelId:this.levelId,
                    userId:this.userId,
                    planId:this.planId
                }
                let api = getMiddlePageList
                if(this.type === 'branch'&&this.levelId ==='SUPPLIER'){
                    api = getBranchMiddlePageList
                }
                this.loading = true
                api(params).then(res =>{
                    this.loading = false
                    if(res.data.code ===0){
                        this.dynamicTable.headers = res.data.headers
                        this.dynamicTable.body = res.data.body
                    }
                })
            }
        },
        created() {
            this.getList()
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
                    .icon-workbench {
                        display: inline-block;
                        vertical-align: middle;
                        width: 16px;
                        height: 16px;
                        margin-top: -2px;
                        margin-right: 4px;
                    }
                    color: #3b3b3b;
                    background-color: #fff;
                    line-height: 32px;
                    font-size: 12px;
                    border-bottom: 1px solid #E6EAF0;
                    padding: 0 3px 0 10px;
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
                overflow-y: auto;
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
