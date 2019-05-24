<template>
<section>
    <div class="work-header">
        <el-row type="flex" align="middle" justify="space-between">
            <div class="tabbar">
                <div  :class="['tab-item', $route.path == '/design' ? 'is-active' : '']"
                @click="handleTab('/design')">
                    设计节点管理
                </div>
                <div  :class="['tab-item', $route.path == '/design/template' ? 'is-active' : '']"
                @click="handleTab('/design/template')">
                    设计工序模板
                </div>
            </div>
            <div class="work-header--right">
                <div class="work-header__search" v-if="$route.path == '/design'">
                    <el-input
                        @change="remoteSearch"
                        v-model="keyWord"
                        placeholder="输入节点名称搜索"
                        icon="search">
                    </el-input>
                </div>
                <nf-button v-if="$route.path == '/design'" type="warning" @click="handleCreate">+ 新建设计节点</nf-button>
                <nf-button v-else type="warning" @click="$router.push('/design/template/create')">+ 新建设计模板</nf-button>
            </div> 
        </el-row>
    </div>
    <div class="wort-view">
        <router-view ref="router-view">
        </router-view>
    </div>
</section>
</template>

<script>
export default {
    data() {
        return {
            keyWord: ''
        };
    },
    mounted() {
    },
    methods: {
        handleTab(path) {
            this.$router.push(path)
        },
        remoteSearch(val) {
            this.$refs['router-view'].$emit('node.design.search', val)
        },
        handleCreate() {
            // 权限
            if (!this.powerJudgement.permissions("fac.designNodeTemp.node.add")) {
                return
            }
            this.$router.push('/design/node/create')
        }
    }
}
</script>

<style scoped lang="scss">
.work-header {
    border-bottom: 1px solid #e6eaf0;
    .tabbar {
        display: flex;
        justify-content: flex-start;
        .tab-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 18px 0;
	        color: #b3bcc7;
            font-size: 16px;
            cursor: pointer;
            width: 128px;
        }
        .is-active {
            color: #2c2c2c;
            &::after {
                position: absolute;
                bottom: 0;
                left: 0;
                display: block;
                width: 100%;
                height: 4px;
                content: '';
                background-color: #ff9c38;
            }
        }
    }
    &__search {
        display: inline-block;
    }
    
}
</style>
