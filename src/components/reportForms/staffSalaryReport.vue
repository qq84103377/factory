<template>
    <div class="staff-salary">
        <!--头部begin-->
        <page-title title="员工计件工资报表" bg>
            <div class="report-wrap">
                <nf-button class="go-back" @click="goBackClick">返回上级</nf-button>
            </div>
        </page-title>
        <!--头部end-->
        <div v-if="hasPermission">
            <div class="filter-bar">
                <div class="filter-row">
                    <div class="filter-item-wrap">
                        <div class="filter-title">上报时间</div>
                        <div class="filter-item">
                            <el-date-picker v-model="filterParams.dateRange" align="right" type="daterange" placeholder="请选择时间范围" :picker-options="dateRangeOption.pickerOptions" style="width:100%;" @change='formatDate'>
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="filter-item-wrap">
                        <div class="filter-title">选择工位</div>
                        <div class="filter-item">
                            <station-selector v-model="workIdArr"></station-selector>
                        </div>
                    </div>
                    <div class="filter-item-wrap">
                        <div class="filter-title">节点选择</div>
                        <div class="filter-item">
                            <el-select
                                    style="width: 250px;"
                                    v-model="filterParams.nodeIds"
                                    filterable
                                    multiple
                                    clearable
                                    placeholder="全部">
                                <el-option v-for="item in nodeList" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="filter-row">
                    <div class="filter-item-wrap">
                        <div class="filter-title">货品款号</div>
                        <div class="filter-item">
                            <el-select v-model="filterParams.goodsOrderId" filterable @change="goodsGet" multiple placeholder="全部" :multiple-limit="12" style="width:100%">
                                <template>
                                    <el-option style="cursor:pointer;" :value="''" :label="'全部'">
                                    </el-option>
                                </template>
                                <el-option v-for="(item,index) in goodsList" :key="index" :label="item.styleNo" :value="item.styleId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="filter-item-wrap">
                        <div class="filter-title">工单搜索</div>
                        <div class="filter-item">
                            <el-input placeholder="请输入工单号搜索" v-model="filterParams.missionId"></el-input>
                        </div>
                    </div>
                    <div class="filter-item-wrap space-between">
                        <nf-button type="filter" width='72' fsize='14' @click="getTableInfo()">筛选</nf-button>
                        <nf-button @click="isExportDialogShow = true">导出报表</nf-button>
                    </div>
                </div>
            </div>
            <div class="table">
                <div class="table-header">
                    <div class="header-left header-child">
                        <div class="header-item">
                            <div class="item-title">
                                员工总人数
                            </div>
                            <div class="item-content">
                                {{headerInfo[1]}} 人
                            </div>
                        </div>
                    </div>
                    <div class="header-right header-child">
                        <div class="header-item">
                            <div class="item-title">
                                总工资
                            </div>
                            <div class="item-content">
                                {{headerInfo[0]}} 元
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table-main" id="staffSalaryReport">
                    <el-table :data="tableInfo" style="width: 100%">
                        <el-table-column type="expand" width="38">
                            <template slot-scope="props">
                                <div class="inner-table" v-if="props.row.nodeNumList.length">
                                    <div class="inner-table-row">
                                        <div class="inner-table-item">工单号</div>
                                        <div class="inner-table-item">货品款号</div>
                                        <div class="inner-table-item">货品名称</div>
                                        <div class="inner-table-item">节点</div>
                                        <div class="inner-table-item">工价</div>
                                        <div class="inner-table-item">数量</div>
                                        <div class="inner-table-item">计件工资小计</div>
                                    </div>
                                    <div class="inner-table-row" v-for="(item,index) in props.row.nodeNumList" :key="index">
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.orderNo}}</div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.styleName}}</div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.goodName}}</div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.nodeName}}</div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.wages==''?'未设置':item.wages}}</div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.num}}
                                            <el-popover ref="popover1" placement="top-start" width="444" trigger="hover" popper-class='hover-table-wrap'>
                                                <svg class="icon" aria-hidden="true" slot="reference" @mouseover="item.isHover=true;" @mouseout="item.isHover=false">
                                                    <use :xlink:href="item.isHover?'#icon-amount-detail-select':'#icon-amount-detail'"></use>
                                                </svg>
                                                <div class="hover-table">
                                                    <div class="hover-table-row">
                                                        <div class="row-item">上报时间</div>
                                                        <div class="row-item">上报数量</div>
                                                        <div class="row-item">完成日期</div>
                                                    </div>
                                                    <div class="hover-table-row" v-for="(hoverItem,hoverIndex) of item.nodeReports">
                                                        <div class="row-item">
                                                            {{hoverItem.reportAt}}
                                                        </div>
                                                        <div class="row-item">
                                                            {{hoverItem.num}}
                                                        </div>
                                                        <div class="row-item">
                                                            {{hoverItem.finishAt}}
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-popover>
                                        </div>
                                        <div class="inner-table-item" :class="{'border-bottom-none':index==props.row.nodeNumList.length-1}">{{item.totalWages==''?'__':item.totalWages}}</div>
                                    </div>
                                </div>
                                <div class="inner-placeholder" v-else>暂无数据</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="工位号" prop="workbayCode">
                        </el-table-column>
                        <el-table-column label="工位姓名" prop="user_name">
                        </el-table-column>
                        <el-table-column label="计件工资" prop="userTotalWages">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="footer">
                <div class="pager">
                    <el-pagination :current-page="nowPage" layout="total, prev, pager, next" :page-count='totalPage' @current-change='nextPage'>
                    </el-pagination>
                </div>
            </div>
        </div>
        <export-dialog v-if="isExportDialogShow" @toggle='toggleExportDialog'></export-dialog>
        <el-dialog :show-close="false" :visible.sync="deleVisible" size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <p style="font-size:24px;margin-bottom:24px;">没有权限</p>
                    <p>如需查看报表，请联系老板在报表管理中授予您查看权限！</P>
                </div>
                <div style="margin-top:24px;">
                    <nf-button type="warning" @click="deleVisible = false">知道了</nf-button>
                </div>
            </div>
        </el-dialog>
        <section v-if="!hasPermission" class="worker-check">
            <div class="img-worker">
                <img src="../../assets/images/pic_nounnothing.png" alt="">
            </div>
        </section>
    </div>
</template>
<script>
import StationSelector from './stationSelector/stationSelector';
import { dateRangeOption } from '../../utils/date-options';
import { getGoodsListByUnitIds, getAllNodeList} from '../../api/api';
import { FacEmolumentReportList } from '../../api/myReport/myReportApi';
import ExportDialog from './exportDialog/exportDialog';
export default {
    data() {
        return {
            // 筛选条件
            filterParams: {
                dateRange: [
                    new Date(new Date().setDate(1))
                        .toLocaleDateString()
                        .replace(/\//g, '-'),
                    new Date().toLocaleDateString().replace(/\//g, '-')
                ],
                goodsOrderId: [],
                missionId: '',
                nodeIds:[], //节点选择
            },
            // 时间控件快捷选项
            dateRangeOption,
            goodsList: [],
            // 表格数据
            tableInfo: [],
            // 表头数据
            headerInfo: [],
            // 总页数
            totalPage: 1,
            // 当前页
            nowPage: 1,
            // 总条目数
            totalNum: 1,
            //导出弹窗显示条件
            isExportDialogShow: false,
            workIdArr: [],
            noCheck: false,
            loginType: '',
            // 无权限弹窗
            deleVisible: false,
            // 权限--页面显示条件
            hasPermission: true,
            // 本厂节点列表
            nodeList:[]
        };
    },
    computed:{
        facId() {
            return JSON.parse(sessionStorage.getItem('user_login')).unitId;
        },
    },
    methods: {
        //返回上一层
        goBackClick() {
            this.$router.push("/reportManage");
        },
        goodsGet() { },
        // 获取货品款号
        getGoodsList() {
            let params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                keyword: '',
                unitIds: [JSON.parse(sessionStorage.getItem('last_login')).id]
            };
            return getGoodsListByUnitIds(params).then(res => {
                this.goodsList = res.data.goodsList;
            });
        },
        // 获取表格信息
        getTableInfo() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                startDate: this.filterParams.dateRange[0],
                endDate: this.filterParams.dateRange[1],
                userIds: this.workIdArr,
                goodsIds: this.filterParams.goodsOrderId,
                pageNo: this.nowPage,
                missionId: this.filterParams.missionId,
                nodeIds:this.filterParams.nodeIds
            };
            return FacEmolumentReportList({ ...params })
                .then(res => {
                    if (this.$store.state.userInfo) {
                        /*
                        * login重构后，不再存储“”sessionStorage，
                        * 而是将之前所需数据存储在vuex中，以后需要用到用户信息的地方，
                        * 统一在store里取
                        *
                        */
                        this.loginType = this.$store.state.userInfo.type;
                    }
                    else {
                        this.loginType = '1';
                    }
                    if (res.data.code == 0) {
                        this.headerInfo = [
                            res.data.data.totalUserwages,
                            res.data.data.userNum
                        ];
                        this.tableInfo = res.data.data.workbayList;
                        this.tableInfo.forEach(item => {
                            item.nodeNumList.forEach(elm => {
                                elm.isHover = false;
                            });
                        });
                        this.totalPage = res.data.data.pageCount;
                    } else if (res.data.code == 4) {
                        this.noCheck = true;
                        this.$message.error(res.data.msg);
                    } else if (res.data.code == 6) {
                        this.deleVisible = true;
                        this.hasPermission = false;
                    }
                })
                .catch(err => {
                });
        },
        // 加载下一页
        nextPage(val) {
            this.nowPage = val;
            this.getTableInfo();
        },
        //格式化时间
        formatDate(val) {
            if (!val) {
                this.filterParams.dateRange = ['', ''];
            } else {
                this.filterParams.dateRange[0] = this.filterParams.dateRange[0]
                    .toLocaleDateString()
                    .replace(/\//g, '-');
                this.filterParams.dateRange[1] = this.filterParams.dateRange[1]
                    .toLocaleDateString()
                    .replace(/\//g, '-');
            }
        },
        // 显示隐藏导出弹窗
        toggleExportDialog() {
            this.isExportDialogShow = false;
        },
        // 监听传入的数组
        listenWorkId() { },
        // 获取本厂节点列表
        getNodeList(keyword = '') {
            const params = {
                unitId: this.facId,
                keyword: keyword
            }
            getAllNodeList(params)
                .then(res => {
                    this.nodeList = res.data.prcdNodes;
                });
        },
    },
    components: {
        StationSelector,
        ExportDialog
    },
    created() {
        this.getGoodsList();
        this.getTableInfo();
        this.getNodeList();
    }
};
</script>
<style lang="scss" scoped>
    .staff-salary{
        .filter-bar {
            padding: 24px 32px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
        }
        .filter-row {
            display: flex;
            margin-bottom: 16px;
            .filter-item-wrap {
                display: flex;
                align-items: center;
                margin-right: 32px;
                .filter-title {
                    color: #3b3b3b;
                    margin-right: 12px;
                    font-size: 12px;
                }
                .filter-item {
                    width: 250px;
                }
            }
        }
        .space-between {
            justify-content: space-between;
            flex: 1;
        }
        .table {
            margin-top: 16px;
        }
        .table-header {
            display: flex;
            .header-child {
                width: 50%;
                height: 114px;
                border-radius: 2px;
                background-color: #ffffff;
                box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                .header-item {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    .item-title {
                        width: 86px;
                        height: 28px;
                        border-radius: 2px;
                        text-align: center;
                        line-height: 28px;
                        font-size: 14px;
                        margin-bottom: 12px;
                    }
                    .item-content {
                        font-size: 26px;
                    }
                }
            }
            .header-left {
                margin-right: 12px;
                .header-item {
                    color: #23c811;
                }
                .item-title {
                    background-color: #e4f8e2;
                }
            }
            .header-right {
                .header-item {
                    color: #ff7f14;
                }
                .item-title {
                    background-color: #fff4e2;
                }
            }
        }
        .table-main {
            margin-top: 16px;
        }
        .footer {
            float: right;
            margin-top: 24px;
        }
        .inner-table {
            .inner-table-row {
                display: flex;
                .inner-table-item {
                    width: 15%;
                    height: 36px;
                    line-height: 36px;
                    padding-left: 32px;
                    background-color: #fcfcfc;
                    border-right: 1px solid #e6eaf0;
                    border-bottom: 1px solid #e6eaf0;
                    overflow: hidden;
                }
                .border-bottom-none {
                    border-bottom: none;
                }
            }
        }
        .inner-placeholder {
            text-align: center;
            color: #c4c6cc;
        }
        .hover-table {
            .hover-table-row {
                display: flex;
                border: solid 1px #ffffff;
                opacity: 0.3;
                border-bottom: none;
                .row-item {
                    width: 33.5%;
                    height: 24px;
                    text-indent: 10px;
                    line-height: 24px;
                    color: rgb(255, 255, 255);
                    border-right: solid 1px #ffffff;
                }
            }
            .hover-table-row:last-child {
                border-bottom: solid 1px #ffffff;
            }
        }
        .dialog-content-wrap {
            text-align: center;
        }
        .worker-check {
            background-color: #fff;
            min-height: 620px;
            .img-worker {
                width: 100%;
                display: flex;
                justify-content: center;
                img {
                    width: 406px;
                    height: 224px;
                    opacity: 0.6;
                    margin-top: 120px;
                }
            }
        }
    }
    .el-select-dropdown__item{
        font-size: 12px;
    }
</style>
<style lang="scss">
    .home_content .home_content--main {
        padding-top: 16px;
    }
    .el-select-dropdown__list{
        .el-select-dropdown__item{
            font-size: 12px;
        }
    }
    .staff-salary{
        .page_title--head {
            font-size: 16px;
            line-height: 32px;
        }
        .report-wrap {
            .nf-button{
                width: 72px;
                font-size: 12px !important;
            }
        }
        .el-input__inner{
            font-size: 12px;
        }
        .dialog-wrap{
            .dialog-header{
                .input-title{
                    font-size: 12px !important;
                }
            }
            .dialog-main{
                .list-header{
                    .list-header-title{
                        font-size: 12px !important;
                        line-height: 20px;
                    }
                }
            }
        }
        .el-checkbox__label{
            font-size: 12px;
        }
        .nf-button--default{
            width: 100px;
            font-size: 12px !important;
        }
        .nf-button--filter{
            font-size: 12px !important;
        }
    }
</style>
