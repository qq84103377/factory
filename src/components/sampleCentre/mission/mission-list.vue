<template>
    <section>
        <mission-list-item
            v-for="missionItem in missionList"
            :key="missionItem.id"
            :missionItem="missionItem"
            @on-preview-click="handlePreviewImg"></mission-list-item>
            <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </section>
</template>

<script>
    import MissionListItem from './mission-list-item';
    export default {
        props: {
            missionList: []
        },
        data() {
            return {
                previewList: []
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        components: {
            MissionListItem
        },
        methods: {        
            // 预览图片
            handlePreviewImg({ goodsPictureUrls }) {
                if (!goodsPictureUrls.length) return;
                this.previewList = goodsPictureUrls.map(item => { return { path: item } });
                this.$nextTick(() => {
                    this.$refs["previewer"].show(0);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    section {
        margin-top: 16px;
    }
</style>
