<template>
    <section>
        <mission-list-item
            v-for="missionItem in missionList"
            :key="missionItem.id"
            :missionItem="missionItem"
            :printList="printList"
            :configure="configure"
            @on-preview-click="handlePreviewImg"
            @on-print-click="handlePrint"></mission-list-item>
            <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </section>
</template>

<script>
    import MissionListItem from './mission-list-item';
    import { templatePrinttig, getFacGoodsPictureList } from '@/api';
    export default {
        props: {
            missionList: [],
            printList: [], //打印模板列表
            configure:{}
        },
        data() {
            return {
                previewList: []
            }
        },
        computed: {
            isAuthPrint() {
                const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
                let isAuthPrint;
                if (datalist) {
                    isAuthPrint = datalist.includes('fac.mission.print');
                }
                return datalist && isAuthPrint;
            },
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
            handlePreviewImg(missionItem) {
                console.log('handlePreviewImg',missionItem)
                // this.previewList = [{path: missionItem.goodsPictureUrl}];
                getFacGoodsPictureList({
                    facId: this.facId,
                    goodsId: missionItem.goodsId
                }).then(res => {
                    if (!res.data.goodsPictureUrls.length) return;
                    this.previewList = res.data.goodsPictureUrls.map(item => {
                        return {
                            path: item
                        }
                    });
                    this.$nextTick(() => {
                        this.$refs["previewer"].show(0);
                    });
                    console.log(res.data)
                });
            },
            handlePrint(missionItem, printItem) {
                if (!this.isAuthPrint) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                const fPrintItem = this.printList.find(item => {
                    return item.oldSelect === 1;
                });
                let params = {
                        missionId: missionItem.id,
                        userId: this.userId
                    };
                // printItem为选择模板是打印方式，不存在直接点击打印按钮；
                console.log(missionItem.id ,'777')
                params.tempId = printItem ? printItem.id : fPrintItem.id;
                templatePrinttig(params).then(res => {
                    const path = `/#/printShow?tempId=${params.tempId}&missionId=${missionItem.id}&printType=missionPrint`;
                    localStorage.setItem('printHtml', JSON.stringify(res.data.templateContent));
                    window.open(path);
                });
            }
        }
    }
</script>

