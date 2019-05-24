<template>
    <section class="detail">
        <el-row
                class="inventory-header"
                type="flex"
                justify="space-between"
                align="middle">
            <div class="inventory-tab">
                <div class="inventory-tab__pane" v-for="(item,index) in tabList" :key="index"
                     @click="toggleTab(item)"
                     :class="{'active': $route.path === item.route.split('?')[0]}">
                    {{item.name}}
                </div>
            </div>
            <div class="inventory-facselect">
                <nf-button style="width: 72px;font-size: 12px;padding: 7px 0;" class="btn" @click="handleToBack">
                    返回上级
                </nf-button>
            </div>
        </el-row>
        <div style="margin-top: 12px;">
            <router-view></router-view>
        </div>
    </section>
</template>

<script>
    export default {
        name: "detail",
        data() {
            return {
                tabList: [
                    {
                        name: '样衣档案信息',
                        route: `/designFile/clothesDetail`
                    },
                    {
                        name: '样衣工艺信息',
                        route: `/designFile/clothesDetail/art`
                    },
                    // {
                    //     name: '样衣BOM表',
                    //     route: `/designFile/clothesDetail/bom`
                    // },
                    {
                        name: '计划成本核算',
                        route: `/designFile/clothesDetail/cost`
                    }
                ]
            }
        },
        methods:{
            //返回
            handleToBack(){
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$router.go(-1);
            },
            toggleTab(item){
                if(item.name === '样衣BOM表'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.process.delete")){
                        return
                    }
                }else if(item.name === '计划成本核算'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.cost.view")){
                        return
                    }
                }
                let query = this.$route.query
                this.$router.replace({
                    path: item.route,
                    query
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .detail {
        .inventory-header {
            line-height: 50px;
            border-bottom: 1px solid #e0e6ed;
            .inventory-tab {
                flex: 1;
                margin-bottom: -1px;
                &__pane {
                    display: inline-block;
                    padding: 0 16px;
                    font-size: 20px;
                    color: #a2abb8;
                    cursor: pointer;
                }
                .active {
                    border-bottom: 4px solid #ffa914;
                    color: #3b3b3b;
                }
            }
        }
    }

</style>
