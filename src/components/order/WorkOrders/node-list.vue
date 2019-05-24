<template>
    <div class="node-list">
        <slot></slot>
    </div>
</template>

<script>
export default {
    componentName: 'missionNodeList',
    data() {
        return {
            nodeList: []
        }
    }
}
</script>

<style lang="scss" scoped>
    .node-list {
        display: flex;
    } 
</style>

