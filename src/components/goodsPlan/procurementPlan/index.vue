<template>
    <div class="procurement-planning">
        <div class="custom-tab-bar">
            <div class="bar-list">
                <router-link :class="['item', $route.path == '/procurementPlan/list' ? 'active' : '']" tag="span"
                             to="/procurementPlan/list">采购规划列表
                </router-link>
                <router-link :class="['item', $route.path == '/procurementPlan/template' ? 'active' : '']" tag="span"
                             to="/procurementPlan/template">模板配置
                </router-link>
            </div>
            <div>
                <nf-button v-show="$route.path == '/procurementPlan/list'" fsize='12'
                           @click="setPlanPanelVisible = true">企划看板配置
                </nf-button>
                <nf-button v-show="editFlag" fsize='12' type="warning"
                           @click="goTo('editFlag')">+新建采购规划</nf-button>
                <nf-button v-show="editTemplateFlag" fsize='12' type="warning"
                           @click="goTo('editTemplateFlag') ">+新建采购模板</nf-button>
            </div>
        </div>
        <div class="purchase">
            <keep-alive :include="keepAliveArr">
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
        <!--企划看板配置弹窗-->
        <set-plan-panel-dialog :visible.sync="setPlanPanelVisible"></set-plan-panel-dialog>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from "vuex";
    import SetPlanPanelDialog from "./list/components/setPlanPanelDialog";
    import PlanExecuteWorkPanel from "./list/components/planExecuteWorkPanel";

    export default {
        components: {
            PlanExecuteWorkPanel,
            SetPlanPanelDialog
        },
        data() {
            return {
                setPlanPanelVisible: false
            }
        },
        computed: {
            ...mapState({
                keepAliveArr: state => state.TabView.keepAliveArr
            }),
            editFlag(){
                return this.$route.path.indexOf('/procurementPlan/list')>-1;
            },
            editTemplateFlag(){
                return this.$route.path.indexOf('/procurementPlan/template')>-1;
            }

        },
        methods: {
            goTo(flag){
                // 权限
                if(!this.powerJudgement.permissions("fac.productPlanning.otb.add")||!this.powerJudgement.permissions("fac.productTemplate.add")){
                    return
                }
                if (flag =='editFlag') {
                    this. $router.push('/procurementPlan/edit');
                }
                else if(flag =='editTemplateFlag'){
                    this.$router.push('/procurementPlan/editTemplate')
                }
            }
        },
        created() {

        }
    }
</script>

<style lang="scss" scoped>
    .purchase-header {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgba(230, 234, 240, 1);
        box-sizing: border-box;
        margin-bottom: 16px;
        &_tab {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .tab_name {
                padding: 0 16px;
                font-size: 16px;
                color: #A2ABB8;
                height: 24px;
                position: relative;
                cursor: pointer;
                .line {
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background-color: rgba(255, 169, 20, 1);
                    bottom: -10px;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .is-active {
                color: #3B3B3B;
            }
        }
        &_btn {
            width: 102px;
            height: 32px;
            background-color: rgba(255, 169, 20, 1);
        }
    }
</style>
