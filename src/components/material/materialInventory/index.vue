<template>
    <section class="inventory">
        <el-row
                class="inventory-header"
                type="flex"
                justify="space-between"
                align="middle">
            <div class="inventory-tab">
                <div class="inventory-tab__pane"
                     @click="handleRouteChange('/materialInventory'+'?storehouseId='+ storehouseId)"
                     :class="{'active': $route.path === '/materialInventory'}">
                    物料库存
                </div>
                <div class="inventory-tab__pane"
                     @click="handleRouteChange('/materialInventory/matremaind'+ '?storehouseId='+ storehouseId)"
                     :class="{'active': $route.path === '/materialInventory/matremaind'}">
                    余料库存
                </div>
                <div class="inventory-tab__pane"
                     @click="handleRouteChange('/materialInventory/matrecord'+ '?storehouseId='+ storehouseId)"
                     :class="{'active': $route.path === '/materialInventory/matrecord'}">
                    库存变动记录
                </div>
            </div>
            <div class="inventory-facselect">
                <el-select
                        v-model="facSelectVal"
                        @change="handleChangeFac"
                        placeholder="请选择"
                >
                    <el-option
                            :disabled="isDisabled"
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </el-row>
        <div style="width:100%">
            <router-view :key="routerKey"></router-view>
        </div>
    </section>
</template>

<script>
    import {getStorehousesByUserId} from "@/api/api";

    export default {
        name: "index",
        data() {
            return {
                facSelectVal: "",     //仓库下拉列表
                options: [],          //仓库下拉列表选项
                isDisabled:false,//限制切换仓库权限
            }
        },
        watch:{
            "$route":"handleChangeFac" // 监听事件
        },
        computed: {
            routerKey() {
                return this.$route.name !== undefined
                    ? this.$route.name + +new Date()
                    : this.$route + +new Date();
            },
            //查仓库名要用的unitId
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            //查仓库名要用的userId
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            storehouseId() {
                return this.$route.query.storehouseId;
            }
        },
        methods: {
            handleRouteChange(route){
                //库存变动记录
                if(route === '/materialInventory/matrecord'){
                    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                        .permissionList;
                    if (datalist.indexOf("fac.stock.record.list") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                }
                this.$router.push(route);
                //这里延时执行，是为了保证路由跳转完成，否则fecthStockList函数route的判断否则会出错
                setTimeout(() => {
                    this.fecthStockList();
                },100);
            },
            handleChangeFac() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.stock.change") == -1) {
                    this.isDisabled = true
                    return;
                }
                this.isDisabled = false
                this.$router.replace(
                    `${this.$route.path}?storehouseId=${this.facSelectVal}`
                );
            },
            //获取仓库列表
            fecthStockList() {
                let route = this.$route.path;
                let params ={
                    facId: this.unitId,
                    userId: this.userId,
                };
                //物料库存
                if(route === '/materialInventory'){
                    params.kind = 1;
                }
                // 余料库存
                else if(route === '/materialInventory/matremaind'){
                    params.kind = 2;
                }
                getStorehousesByUserId(params).then(res => {
                    this.options = res.data.data;
                    let defaultStorehouseTag = [];
                    if(res.data.data){
                        defaultStorehouseTag = res.data.data.find(
                            item => item.defaultStorehouseTag === 1
                        );
                    }
                    if (defaultStorehouseTag) {
                        this.facSelectVal = defaultStorehouseTag.id;
                    } else {
                        if(this.$route.query.from === 'outsideFactory'){
                            this.facSelectVal = this.$route.query.storehouseId
                        }else{
                            this.facSelectVal = res.data.data[0].id;
                        }
                    }
                });
            }
        },
        mounted() {
            this.fecthStockList();
        }
    }
</script>

<style lang="scss" scoped>
    .inventory {
        width: 100%;
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
            .inventory-facselect {
                .el-select {
                    width: 280px;
                }
            }
        }
    }
</style>
