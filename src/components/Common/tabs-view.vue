<template>
    <div class="tabs-view">
        <div class="tabs-view__item">
            <span class="tabs-view__item--text" @click="closeAll">关闭全部</span>
            <i class="tabs-view__item-icon el-icon-close" @click.stop="closeSelectedTab(item)"></i>

        </div>
        <div class="tabs-view__item"
            v-for="(item, index) in visitedViews"
            :key="index"
            :class="isActive(item) ? 'is-active' : ''"
            @click="itemSelect(item)"
            @contextmenu.prevent="handleContext($event, item)">
                <span class="tabs-view__item--text">{{ item.name }}</span>
                <i class="tabs-view__item-icon el-icon-close" @click.stop="closeSelectedTab(item)"></i>
        </div>
        <transition name="el-zoom-in-top">
            <div class="tabs-view__context-menu" v-show="visible" :style="{'left': left + 'px', 'top': top + 'px'}">
                <ul>
                    <li @click="closeSelectedTab(selectTag)">关闭</li>
                    <li @click="closeOthers">关闭其他</li>
                    <li @click="closeAll">关闭全部</li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectTag: {},
                left: 0,
                top: 0,
                visible: false,
                isCurrentTab: false
            };
        },
        computed: {
            visitedViews() {
                return this.$store.state.TabView.visitedViews
            }
        },
        watch: {
            $route(val) {
                this.$store.dispatch('addVisitedView', val);
            },
            visible(value) {
                if (value) {
                    document.body.addEventListener('click', this.closeMenu)
                } else {
                    document.body.removeEventListener('click', this.closeMenu)
                }
            }
        },
        mounted() {
            this.$store.dispatch('addVisitedView', this.$route);
        },
        methods: {
            isActive(view) {
                return this.$route.path === view.path;
            },
            itemSelect(view) {
                const { path, query, params } = view;
                this.isCurrentTab = true;
                this.$router.push({
                    path,
                    query,
                    params
                });
            },
            handleContext(e, item) {
                this.selectTag = item;
                this.left = e.clientX;
                this.top = e.clientY;
                this.visible = true;
                console.log(e)
            },
            closeOthers() {
                const { path, query, params } = this.selectTag;
                this.$router.push({
                    path,
                    query,
                    params
                });
                this.$store.dispatch('deleteOthersView', this.selectTag);
            },
            closeAll() {
                this.$store.dispatch('deleteAllView');
                this.$router.push('/workorders');
            },
            async closeSelectedTab(view) {
                const list = await this.$store.dispatch('deleteVisitedView', view);
                if (this.isActive(view)) {
                    const last = list.slice(-1)[0];
                    if (last) {
                        this.$router.replace({...last});
                    }
                    else {
                        location.reload();
                    }
                }
            },
            closeMenu() {
                this.visible = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .tabs-view {
        // position: relative;
        display: inline-flex;
        align-items: center;
        flex-wrap: nowrap;
        height: 32px;
        white-space: nowrap;
        line-height: 1;
        padding: 0 24px;
        &__item {
            box-sizing: border-box;
            display: inline-block;
            padding: 4px 8px;
            margin-left: 4px;
            font-size: 12px;
            color: rgba(128, 128, 128, 1);
            border: 1px solid #DCE0E6;
            cursor: pointer;
            vertical-align: middle;
            &:hover {
                opacity: .8;
            }
            &-icon {
                transform: scale(.6);
                font-size: 12px;
                vertical-align: middle;
                color: rgba(128, 128, 128, 1);
            }
            &.is-active {
                border-color: #FFA914;
                color: #FFA914;
                background: rgba(255,246,231,1);
                .tabs-view__item-icon {
                    color: #FFA914;
                }
            }
        }
        &__context-menu {
            position: fixed;
            z-index: 100;
            ul {
                margin: 0;
                padding: 0;
                width: 110px;
                border-radius: 2px;
                box-shadow: 0px 5px 12px 0px rgba(13,51,128,0.07);
                background: #fff;
            }
            li {
                padding: 0 10px;
                line-height: 30px;
                font-size: 14px;
                color: rgba(128, 128, 128, 1);
                cursor: pointer;
                &:hover {
                    background: #eee;
                }
            }
        }
    }
</style>

