<template>
    <section class="mission-list">
        <div class="mission-list__wrapper"
             v-for="(missionItem, index) in missionList"
             :key="missionItem.id">
            <div class="mission-list__row">
                <div class="mission-list__row--left" :ref="'missionListLeft' + index">
                    <list-item
                            title="序号"
                            :columnStyle="{'width': '48px'}">
                        <span class="mission-list__number" slot="value">{{ index + 1}}</span>
                    </list-item>
                    <template v-for="(item, i) in missionItem.titleList" v-if="item.name!=='采购单号'">
                        <list-item v-if="item.name === '工单号'"
                                :title="item.name"
                                :value="item.value + (missionItem.outSideFlag?'(外发)':'')"
                                :key="i"
                                @click.native="viewMissionDetail(missionItem)"
                                :columnStyle="{'cursor': 'pointer'}">
                        </list-item>
                        <list-item v-else-if="item.name === '交货日期'"
                                   :title="item.name"
                                   :key="i">
                            <span slot="value">{{ item.value | filterDate }}</span>
                        </list-item>
                        <list-item v-else
                                   :title="item.name"
                                   :value="item.value"
                                   :key="i">
                        </list-item>
                    </template>
                </div>
                <div class="mission-list__row--right" :style="{'paddingLeft': missionItem.rightPaddingSize + 'px'}">
                    <list-item
                            v-for="nodeItem in missionItem.nodes"
                            :key="nodeItem.id"
                            :missionId="missionItem.id"
                            :configure="configure"
                            :item-class="{
                            'is-finish-bg': nodeItem.status === 2 && !renderNotify(nodeItem),
                            'is-ongoing-bg': nodeItem.status === 1 && !renderNotify(nodeItem) && !isDelay(nodeItem),
                            'is-remind-bg': renderNotify(nodeItem) === '差额',
                            'is-warning-bg': renderNotify(nodeItem) === '预警',
                            'is-delay-bg': renderNotify(nodeItem) === '警报' || isDelay(nodeItem),
                        }"
                            :nodeItem="nodeItem"
                            @showImgPreview="showImgPreview">
                        <div slot="title">
                            <span>{{ nodeItem.nodeName }}{{renderNotify(nodeItem) ? ' -' : ''}}</span>
                            <span
                                    v-if="renderNotify(nodeItem)"
                                    :class="{
                                'is-warning': renderNotify(nodeItem) === '预警',
                                'is-delay': renderNotify(nodeItem) === '警报',
                                'is-remind': renderNotify(nodeItem) === '差额',
                            }"> {{ renderNotify(nodeItem) }}</span>
                        </div>
                        <div slot="value">
                            <template v-if="nodeItem.status === 0">
                                <span>未开始</span>
                            </template>
                            <template v-else-if="nodeItem.status === 1">
                                <span>进行中</span>
                            </template>
                            <template v-else="nodeItem.status === 2">
                                <span>已完成</span>
                            </template>
                            <template v-if="nodeItem.typeId !=='2'">
                                <span>{{nodeItem.finishNum}}/{{nodeItem.targetNum}}</span>
                            </template>
                            <span class="adjust-num" v-if="nodeItem.adjustNum">(调{{nodeItem.adjustNum}})</span>
                        </div>
                    </list-item>
                </div>
            </div>
        </div>
        <!--展示大图-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    </section>
</template>

<script>
    import ListItem from './mission-table-list-item';
    import {formatDate} from '@/utils';

    export default {
        props: {
            missionList: [],
            configure: {}
        },
        components: {
            ListItem
        },
        data() {
            return {
                missionDataList: [],
                rightPaddingSize: '',
                centerDialogVisible: false, //是否显示大图弹窗
                imgLists: [],    //大图数组
                imgIndex: 0     //大图数组下标
            }
        },
        computed: {},
        filters: {
            filterDate(val) {
                if (!val) return '未填写';
                val = val.split(' ')[0];
                return val;
            }
        },
        updated(){
            this.computedOffset();
        },
        methods: {
            //计算rightPaddingSize属性
            computedOffset() {
                // 分别设置每行的rightPaddingSize
                if(this.$refs){
                    Object.keys(this.$refs).forEach((item,index) =>{
                        this.$set(this.missionList[index],'rightPaddingSize',this.$refs[item][0].offsetWidth)
                    })
                }

                // if(this.$refs.missionListLeft){
                //     this.rightPaddingSize = this.$refs.missionListLeft[0].offsetWidth;
                // }
            },
            //展示大图
            showImgPreview(item, index) {
                console.log(item);
                this.imgLists = item;
                this.imgIndex = index;
                this.centerDialogVisible = true;
            },
            renderValue(nodeItem) {
                const {status, typeId} = nodeItem;
                // 非逻辑型节点并且进行中；
                if (typeId != 2 && status === 1) return `${nodeItem.finishNum}/${nodeItem.targetNum}`;
                switch (status) {
                    case 0:
                        return '未开始';
                    case 1:
                        return '进行中';
                    case 2:
                        return '已完成';
                }
            },
            renderNotify(item) {
                const {delay, status, dateEnd, notifyTypes, alerted} = item;
                if (notifyTypes) {
                    if (notifyTypes.indexOf(2) > -1) {
                        // 差额
                        return '差额';
                    }
                    if (notifyTypes.indexOf(0) > -1) {
                        return '预警';
                    }
                    if (notifyTypes.indexOf(1) > -1 || (delay < 0 && status !== 2) || alerted) {
                        return '警报';
                    }
                }
                return null;
            },
            isDelay(item) {
                const {delay, status, dateEnd} = item;
                return dateEnd && delay < 0 && status !== 2;
            },
            viewMissionDetail(missionItem) {
                this.$router.push({
                    path: '/OrderDetailed',
                    query: {
                        missionId: missionItem.id,
                        currentPage: this.configure.currentPage,
                        scrollTop: this.configure.scrollTop,
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    $--font-warning-color: #FF7F14;
    $--font-success-color: #23C811;
    $--font-error-color: #FA4150;
    $--font-remind-color: #5C67E6;
    .mission-list {
        &__wrapper {
            position: relative;
            width: 100%;
            min-height: 58px;
            margin-bottom: 4px;
        }
        &__row {
            overflow-x: auto;
            &--left,
            &--right {
                display: inline-flex;
                flex-wrap: nowrap;
                white-space: nowrap;
            }
            &--left {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
            }
        }
        &__number {
            display: inline-block;
            width: 24px;
            height: 16px;
            line-height: 16px;
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            background: #939FB8;
        }
        .is-remind {
            color: $--font-remind-color;
        }
        .is-warning {
            color: $--font-warning-color
        }
        .is-delay {
            color: $--font-error-color;
        }
        .adjust-num{
            color: #FF7F14;
        }
    }
</style>

