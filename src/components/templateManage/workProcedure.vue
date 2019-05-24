<template>
    <div class="work-header">
        <div class="tabbar">
            <div  :class="['tab-item', $route.path == '/workingProcedure' ? 'is-active' : '']"
            @click="handleTab('/workingProcedure')">
                生产节点管理
            </div>
            <div  :class="['tab-item', $route.path == '/nodeManage' ? 'is-active' : '']"
            @click="handleTab('/nodeManage')">
                生产工序模板
            </div>
        </div>
        <div class="wort-view">
            <router-view>
            </router-view>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
    },
    methods: {
        handleTab(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style scoped lang="scss">
    .tabbar {
        // padding: 0 32px;
        display: flex;
        justify-content: flex-start;
        border-radius: 2px;
        border-bottom:1px solid #e6eaf0;
        .tab-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            // margin-right: 32px;
            line-height: 64px;
	        color: #b3bcc7;
            font-size: 24px;
            cursor: pointer;
            padding: 0 10px;
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
</style>
