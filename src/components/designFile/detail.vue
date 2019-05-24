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
                     :class="{'active': $route.path === item.route}">
                    {{item.name}}
                </div>
            </div>
            <div class="inventory-facselect">
                <nf-button style="width: 72px;font-size: 12px;padding: 7px 0;" class="btn" @click="routerGoBack">
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
        computed: {
          isWorkBench() {
              return this.$route.query.isWorkBench
          }
        },
        methods: {
            routerGoBack(){
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$router.back();
            },
            toggleTab(item) {
                if(item.name === '工艺信息' || item.name === '样衣档案'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.process.view")){
                        return
                    }
                }else if(item.name === 'BOM表'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.bom.view")){
                        return
                    }
                }else if(item.name === '工序模板'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.template.view")){
                        return
                    }
                }else if(item.name === '计划成本核算'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.cost.view")){
                        return
                    }
                }else if(item.name === '打版文件'){
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.style.templete.list")&&!this.isWorkBench){
                        return
                    }
                    // 权限
                    if(!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.list")&&this.isWorkBench){
                        return
                    }
                }
                this.$router.push({
                    path: item.route,
                    query: {designStyleId: this.$route.query.designStyleId}
                })
            }
        },
        data() {
            return {
                tabList: [
                    {name: '设计档案信息', route: '/designFile/designFileDetail'},
                    {name: '工艺信息', route: '/designFile/designFileDetail/technicsInfo'},
                    {name: '打版文件', route: '/designFile/designFileDetail/patternMakingFile'},
                    {name: 'BOM表', route: '/designFile/designFileDetail/bom'},
                    {name: '样衣档案', route: '/designFile/designFileDetail/clothesFile'},
                    {name: '工序模板', route: '/designFile/designFileDetail/procedure'},
                    {name: '计划成本核算', route: '/designFile/designFileDetail/costAccounting'},
                ]
            }
        }
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
