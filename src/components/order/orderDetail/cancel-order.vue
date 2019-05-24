<template>
    <el-row id="worker-orders">
        <section style="display:flex;width:100%;height:100%;flex-direction:column;">
            <page-title title="已撤销工单">
                <div>
                    <el-input @change="remoteSearch" class="search-input" v-model="orderSearch" placeholder="输入工单号搜索" icon="search">
                    </el-input>
                    <nf-button  @click="$router.go(-1)">
                        返回上级
                    </nf-button>
                </div>
            </page-title>
            <div>
                <!--工单列表-->
                <mission-list
                    v-show="!orderListLoding"
                    :missionList="orderList"
                    :printList="printList"></mission-list>
                <p class="empty-content" v-show="orderListLoding">
                    <i class="el-icon-loading"></i>
                </p>
                <!--工单列表 end-->
                <!--分页-->
                <div class="page-pagination">
                    <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next" :total="pageCount">
                    </el-pagination>
                </div>
            </div>
        </section>
    </el-row>

</template>

<script type="text/ecmascript-6">
import FilterForm from "../WorkOrders/filter-form";
import MissionList from "../WorkOrders/mission-list.vue";
import {
  selectFacCustomer,
  selectFacGoodsStyle,
  queryFacMissionList,
  getFacUnitSettings,
  getWorkbayListByFacId,
  getFacGoodsPictureList,
  getPrintTemplatesByType,
  templatePrinttig,
  queryMissionLeadersByUnitIds,
  getPersonList,
  selectFacGoodsStyleList
} from "@/api";

export default {
    data() {
        return {
            pageCount: 0, //工单总数,页码需要显示
            orderListLoding: false, //工单列表loading
            printList: [],
            sign: '',
            orderSearch: '',
            attrsData: {}, // 货品属性数据
            // orderBy: 排序依据, // 0 默认排序 1 制单日期升序 2 制单日期降序 3 交货日期升序 4 交货日期倒序 5 货品款号升序 6 货品款号倒序 7 工单号升序 8 工单号倒序
            // 默认降序
            orderBy: '',
            orderList: [],
            sortOptions: [
                {
                    label: '制单日期',
                    sortValue: 2,
                    byUpValue: 1
                },
                {
                    label: '交货日期',
                    sortValue: 4,
                    byUpValue: 3
                },
                {
                    label: '货品款号',
                    sortValue: 6,
                    byUpValue: 5
                },
                {
                    label: '工单号',
                    sortValue: 8,
                    byUpValue: 7
                }
            ],
        };
    },
    components: {
        FilterForm,
        MissionList
    },
    computed: {
        // 计算属性
        userId() {
            return JSON.parse(sessionStorage.getItem("user_login")).userId;
        },
        facId() {
            return JSON.parse(sessionStorage.getItem("user_login")).unitId;
        }
    },
    filters: {
        filterEndTime(val) {
            return val.slice(0, 11);
        }
    },
    created() {
        this.fetchFacUnitSettings();
        this.fetchMissionList({ pageNo: 1,isCancel:1 });
        this.getPrintTemplatesByType();
    },
    methods: {
        // 获取工单列表数据
        fetchMissionList(params = {}) {
            const data = {
                facId: this.facId,
                userId: this.userId,
                ...params
            }
            this.orderListLoding = true;
            queryFacMissionList(data)
            .then(res => {
                this.orderListLoding = false;
                if (res.data.code !== 0) {
                    this.$message.error(res.data.msg);
                    return;
                }
                this.orderList = res.data.facMissionList;
                this.pageCount = res.data.pageCount;
            });
        },
        // 分页
        loadingMore(page) {
            this.fetchMissionList({ pageNo: page,isCancel:1 });
        },
        // 获取货品属性
        fetchFacUnitSettings() {
            const params = {
                facId: this.facId,
                type: 'all'
            };
            getFacUnitSettings(params)
            .then(res => {
                this.attrsData = res.data.data;
            });
        },
        getPrintTemplatesByType() {
            let params = {
                userId: this.userId,
                facId: this.facId,
                typeId: '12ff74aae4fe49eaa930934241b61f1e'
            };
            getPrintTemplatesByType(params).then(res => {
                this.printList = res.data;
            });
        },
        remoteSearch(orderNo) {
            this.fetchMissionList({ orderNo: this.orderSearch,isCancel:1 });
        },
    }
};
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    #worker-orders {
        min-width: 1010px;

        .search-input {
            width: 260px;
            margin-right: 8px;
        }

        .utils-wrapper {
            padding-top: 16px;
            overflow: hidden;
            &--right {
                text-align: right;
            }
            .utils-sort {
                display: inline-block;
                border: 1px solid #e6eaf0;
                box-sizing: border-box;
                font-size: 0;
                &--text {
                    color: #a2abb8;
                }
                &__item {
                    box-sizing: border-box;
                    display: inline-block;
                    width: 96px;
                    line-height: 32px;
                    text-align: center;
                    font-size: 12px;
                    background: #fff;
                    &:not(:last-child) {
                        border-right: 1px solid #e6eaf0;
                    }
                }
                &--caret {
                    position: relative;
                    display: inline-block;
                    width: 16px;
                    height: 32px;
                    vertical-align: middle;
                    .icon {
                        cursor: pointer;
                        position: absolute;
                        left: 3px;
                        display: inline-block;
                        width: 0;
                        height: 0;
                        font-size: 12px;
                        border-right: 5px solid transparent;
                        border-left: 5px solid transparent;
                    }
                    .icon-top {
                        top: 10px;
                        border-top: none;
                        border-bottom: 5px solid #E6EAF0;
                    }
                    .icon-bottom {
                        bottom: 10px;
                        border-bottom: none;
                        border-top: 5px solid #E6EAF0;
                    }
                }
            }
            .utils-tabbar {
                display: inline-block;
                box-sizing: border-box;
                margin-left: 25px;
                text-align: right;
                border: 1px solid #939FB8;
                font-size: 0;
                &__item {
                    display: inline-block;
                    box-sizing: border-box;
                    width: 80px;
                    line-height: 32px;
                    text-align: center;
                    font-size: 12px;
                    color: #939FB8;
                    background: #fff;
                    cursor: pointer;
                    &:not(:last-child) {
                        border-right: 1px solid #939FB8;
                    }
                    &.is-active {
                        background: #939FB8;
                        color: #fff;
                    }
                }
            }
        }

        .empty-content {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 16px;
            height: 186px;
            background: #fff;
        }

        .page-pagination {
            display: flex;
            justify-content: flex-end;
            padding-top: 18px;
            padding-bottom: 30px;
        }
    }
</style>
<style lang="scss">
#worker-orders {
    width: 100%;
    height: 100%;
    // overflow: hidden;
    .el-input {
        /*min-width: 50%;*/
        /*max-width: 190%;*/
        .el-input__inner {
            border-radius: 2px;
        }
    }
}
</style>
