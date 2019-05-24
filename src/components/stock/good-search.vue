<template>
    <div class="good-search" v-clickoutside="closeList">
        <!-- <el-popover
            popper-class="no-padding"
            ref="search-popover"
            placement="bottom"
            width="318"
            :visible-arrow="false"
            v-model="popoverVisble"> -->
        <transition name="el-zoom-in-top">
            <ul class="search-con--list" v-show="popoverVisble">
                <li
                v-for="(item, index) in listData"
                :key="index"
                @click="handleItemclick(item)">
                    <div>
                        <img :src="(item.pictureUrl || defaultImg)" alt="">
                        <span>{{ item.styleNo }}</span>
                    </div>
                    <span class="add-num" v-show="item.addNum">已添加（{{ item.addNum }}件）</span>
                </li>
            </ul>
        </transition>
        <!-- </el-popover> -->
        <el-input
            class="search-input"
            placeholder="输入货品款号搜索"
            icon="search"
            v-model="currentValue"
            @input="handleChange"
            :on-icon-click="handleIconClick">
            </el-input>
            
    </div>
</template>

<script>
    import { findCommonGoodsStyleListEasy } from '@/api/api'
    import { mapState } from 'vuex'
    import { debounce } from '@/utils'
    export default {
        props: {
            value: '',
            isSelect: Boolean,
        },
        data() {
            return {
                popoverVisble: false,
                defaultImg: this.$globalConfig.qiniu.baseDefaultUrl,
                listData: [],
                currentValue:'',
            }
        },
        computed: {
            ...mapState({
                goodList: state => state.Stock.goodList
            }),
            // currentValue: {
            //     get() {
            //         return this.value
            //     },
            //     set(val) {
            //         this.$emit('input', val);
            //     }
            // },
            storehouseId() {
                return this.$route.query.storehouseId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('last_login')).id
            },
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            }
        },
        watch: {
            listData(val) {
                if (val.length && this.goodList.length) {
                    for (let listItem of this.listData) {
                        const index = this.goodList.findIndex(_item => _item.id === listItem.id);
                        if (index > -1) {
                            listItem.addNum = this.goodList[index].num;
                        }
                    }
                }
            }
        },
        created () {

        },
        methods: {
            handleIconClick() {
                this.$emit('on-icon-click', this.currentValue);
            },
            handleChange() {
                // if (!this.isSelect) {
                //     this.$emit('change', this.currentValue)
                //     return;
                // }
                const params = {
                    facId: this.unitId,
                    userId: this.userId,
                    storehouseId: this.storehouseId,
                    keyword: this.currentValue,
                    modelName: 'GOODS_STOCK'
                };
                debounce(this.fetchSearchList)(params);
            },
            closeList() {
                this.popoverVisble = false;
                this.currentValue = '';
            },
            handleItemclick(item) {
                this.$emit('on-item-click', item)
            },
            // 获取搜索列表数据
            fetchSearchList(params) {
                findCommonGoodsStyleListEasy(params)
                .then(res => {
                    res.data['commonGoodsStyleList'].map(item => {
                        item.addNum = 0;
                    });
                    // console.log(res)
                    // if (this.isSelect && res.data['commonGoodsStyleList'].length) {
                    //     this.listData = res.data['commonGoodsStyleList']
                    //     this.popoverVisble = true
                    // }
                    if (this.isSelect) {
                        this.listData = res.data['commonGoodsStyleList']
                        this.popoverVisble = true
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.good-search {
    width: 320px;
    position: relative;
    display: inline-block;
    margin-right: 16px;
}
.search-input {
        width: 100%;
    }
.search-con--list {
    position: absolute;
    width: 100%;
    left: 0;
    top: 45px;
    max-height: 300px;
    z-index: 999;
    overflow-y: auto;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    background: #ffffff;
    li {
        display: flex;
        padding: 0 12px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        &:hover {
            background: #ebeff5
        }
    }
    div {
        flex: 1
    }
    img {
        width: 36px;
        height: 36px;
        margin-right: 12px;
        vertical-align: middle
    }
    .add-num {
        color: #a2abb8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 150px;
    }
}
</style>

