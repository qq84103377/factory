<template>
    <el-row class="sample-centre"  ref="viewBox">
        <section style="display:flex;width:100%;height:100%;flex-direction:column;">
            <page-title title="设计工单">
                <!-- <div>
                    <el-input @change="remoteSearch" class="search-input" v-model="orderSearch" placeholder="输入工单号搜索"
                              icon="search">
                    </el-input>
                    <nf-button type="warning" svg="icon-btn-add" @click.native="clickskip">
                        新建设计工单
                    </nf-button>
                </div> -->
            </page-title>
            <div>
                <!--筛选区-->
                <filter-form
                        ref="filterForm"
                        :attrsData="attrsData"
                        :selectPersonList="selectPersonList"
                        @on-filter="handleFilterMission">
                </filter-form>
                <!-- 表格视图 -->
                <mission-table-list @editNodeGo="editNodeGo" :tableData="orderList" :loading="orderListLoding"></mission-table-list>
                <!--筛选区end-->
                <!--排序-->
                <!-- <el-row class="utils-wrapper" type="flex" align="middle">
                    <el-col :span="12" class="utils-wrapper--left">
                        <div class="utils-sort">
                            <div class="utils-sort__item is-active">
                                <span class="utils-sort--text"
                                      :style="{
                                        'cursor': 'pointer',
                                        'color': orderBy === '' ? '#3b3b3b' : ''
                                    }"
                                      @click="handleSort(item)">
                                        默认排序
                                </span>
                            </div>
                            <div class="utils-sort__item is-active" v-for="(item, index) in sortOptions" :key="index">
                                <span @click="handleSortText(item)" class="utils-sort--text"
                                      :style="{
                                        'cursor': item.type == 'static' ? 'pointer' : '',
                                        'color': (sortUpIconActive(item) || sortDownIconActive(item)) ?'#3b3b3b' : ''
                                    }">
                                        {{ item.label }}
                                </span>
                                <span class="utils-sort--caret" v-show="item.icon !== false">
                                    <i class="icon icon-top"
                                       :style="{'borderBottomColor': sortUpIconActive(item) ? '#939FB8' : ''}"
                                       @click="handleSortUp(item)"></i>
                                    <i class="icon icon-bottom"
                                       :style="{'borderTopColor': sortDownIconActive(item) ? '#939FB8' : ''}"
                                       @click="handleSortDown(item)"></i>
                                </span>
                            </div>
                        </div>
                        <div class="utils-switch">
                            <span>待我处理</span>
                            <el-switch
                                    v-model="waitHanlde"
                                    on-color="#FFA914"
                                    on-text=""
                                    off-text=""
                                    width="40"
                                    off-value="0"
                                    on-value="1"
                                    @change="fetchMissionList">
                            </el-switch>
                        </div>
                    </el-col>
                    <el-col :span="12" class="utils-wrapper--right">
                        <icon-button class="btn--cancel" @click="viewCancel">
                            <i class="el-icon-delete2"></i>已撤销工单
                        </icon-button>
                    </el-col>
                </el-row> -->
                <!--排序end-->
                <!--工单列表-->
                <!-- <mission-list
                    v-show="!orderListLoding"
                    :missionList="orderList"
                />
                <p class="empty-content" v-show="orderListLoding">
                    <i class="el-icon-loading"></i>
                </p> -->
                <!--工单列表 end-->
                <!--分页-->
                <!--<div id="test" style="height: 1000px;">sdflsf;lsl;fl;</div>-->
                <div class="page-pagination">
                    <el-pagination @current-change="loadingMore" :page-size="pageSize" layout="total, prev, pager, next"
                                   :total="pageCount" :current-page.sync="currentPage">
                    </el-pagination>
                </div>
            </div>

            <!-- 编辑节点的弹窗 -->
            <select-design-dialog :show.sync="selectDesignDialog" source="missionIndex" @save="missionUpdateNodes" :loading.sync="saveBtnLoading" :formData="editNodeList" :missionDisabled="missionDisabled"></select-design-dialog>

            <!-- 备注添加修改弹窗 -->
            <!-- <el-dialog
                custom-class="nf-dialog-common"
                :title="nodeItemData.type === 'new' ? '添加备注' : '修改备注'"
                :show-close="false"
                :visible.sync="visible.remarkVisible"
                size="tiny">
                <el-row type="flex" justify="end" align="middle">
                    相关人员：
                    <el-select v-model="remarkForm.chargers" multiple placeholder="请选择">
                        <el-option v-for="(leaderItem, leaderIndex) in selectPersonList" :key="leaderIndex"
                                :label="leaderItem.userName" :value="leaderItem.id">
                        </el-option>
                    </el-select>
                </el-row>
                <div class="remake__content">
                    <el-input
                        type="textarea"
                        :rows="6"
                        placeholder="请输入备注信息（必填）"
                        v-model="remarkForm.content">
                    </el-input>
                </div>
                <el-row type="flex" justify="center" slot="footer">
                    <nf-button @click="visible.remarkVisible = false">取 消</nf-button>
                    <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="handleRemark">确 定</nf-button>
                </el-row>
        </el-dialog> -->
        </section>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import FilterForm from './filter-form';
    import MissionList from './mission-list';
    import MissionTableList from './mission-table-list';
    import {mapState, mapActions} from 'vuex';
    import { debounce } from '@/utils';
    import {
        queryFacMissionList,
        getFacUnitSettings,
        getPersonList,
        getEditNode,
        missionUpdateNodes,
        allFacDefectiveLabel
    } from '@/api';
    import { getDesignMissionList, addDesignNodeRemark, editDesignNodeRemark, getDesignNodeRemarkInfo, getDesignMissionTableList } from '@/api/sample-centre';
    import selectDesignDialog from '@/components/designFile/designFileInfo/selectDesignDialog'

    export default {
        componentName: 'SampleMission',
        name: 'SampleMission',
        data() {
            return {
                filterParams: {},
                selectDesignDialog:false,
                saveBtnLoading:false,
                missionId:'',
                editNodeList:[],
                waitHanlde: '1',
                scrollTop: 0,
                pageCount: 0, //工单总数,页码需要显示
                currentPage: 1,  // 工单当前页码，返回上级回到当前页码需要
                pageSize: 10,
                orderListLoding: false, //工单列表loading
                orderList: [],
                sign: '',
                orderSearch: '',
                attrsData: {}, // 货品属性数据
                // orderBy: 排序依据, // 0 默认排序 1 制单日期升序 2 制单日期降序 3 交货日期升序 4 交货日期倒序 5 货品款号升序 6 货品款号倒序 7 工单号升序 8 工单号倒序
                // 默认降序
                orderBy: '',
                selectPersonList: [],
                activeIndex: 0,
                visible: {
                    remarkVisible: false,
                    btnLoading: false
                },
                remarkForm: {
                    chargers: [],
                    content: ''
                },
                nodeItemData: {}, // 添加、编辑备注的节点数据
                sortOptions: [
                    {
                        label: '制单日期',
                        sortValue: 2,
                        byUpValue: 1
                    },
                    {
                        label: '预计完成日期',
                        sortValue: 4,
                        byUpValue: 3
                    },
                    {
                        label: '设计款号',
                        sortValue: 6,
                        byUpValue: 5
                    },
                    {
                        label: '工单号',
                        sortValue: 8,
                        byUpValue: 7
                    }
                ],
                missionDisabled: false, //改工单是否完成的状态
            };
        },
        components: {
            FilterForm,
            MissionList,
            selectDesignDialog,
            MissionTableList
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
        activated() {
            // this.fetchMissionList();
            this.getDesignMissionTableList()
        },
        created() {
            if (this.$route.query['currentPage'] != 'NaN' && this.$route.query['currentPage'] != 'undefined' && this.$route.query['currentPage']) {
                this.currentPage = parseInt(this.$route.query['currentPage'])
            } else {
                this.currentPage = 1
            }
            this.$on('node.item.add.remark', this.showRemarkDialog); // 监听事件，在node-list-item中触发
            this.fetchPersonList();
            this.fetchFacUnitSettings();
        },
        mounted() {
            // this.fetchMissionList();
            this.getDesignMissionTableList()
        },
        methods: {
            //编辑节点
            editNodeGo(missionId,status){
                console.log(status,'8798')
                if(status == 2) {
                    this.missionDisabled = true
                } else {
                    this.missionDisabled = false
                }
                this.missionId = missionId
                getEditNode({missionId:missionId}).then(res=>{
                    let ids=[]
                    if(res.data.data.leadersIds){
                        res.data.data.leadersIds.forEach(item=>{
                            ids.push(item.id)
                        })
                    }

                    this.editNodeList = res.data.data
                    this.editNodeList.leadersIds = ids
                    let that = this
                    setTimeout(function () {
                        that.selectDesignDialog = true

                    },20)

                })
            },
            missionUpdateNodes(process){
                let obj = {
                    process:process,
                    missionId:this.missionId
                }
                missionUpdateNodes(obj).then(res=>{
                    console.log(res);
                    if(res.data.code===0){
                        this.$message.success('编辑成功')
                        this.getDesignMissionTableList()
                        this.selectDesignDialog = false
                    }else {
                        this.$message.error(res.data.msg);
                    }

                })
            },
            viewCancel() {
                // 权限
                if(this.powerJudgement.permissions("fac.spl.design.mission.list")){
                    return
                }
                this.$router.push({path: '/sample/cancel'})
            },
            // 方法
            clickskip() {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.mission.add")){
                    return
                }
                this.$store.dispatch('deleteVisitedLive', 'SampleMissionCreate');
                this.$store.dispatch('setFormData', {
                    designStyleNo: ''
                });
                this.$nextTick(() => {
                    this.$router.push('/sample/create');
                });
            },
            // 获取工单table列表数据
            getDesignMissionTableList() {
                const data = {
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    unitId: this.facId,
                    userId: this.userId,
                    modelName: 'SPL_DESIGN_STYLE',
                    ...this.filterParams
                }
                this.orderListLoding = true;
                getDesignMissionTableList(data)
                .then(res => {
                    this.orderListLoding = false;
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.orderList = res.data.data.list;
                    this.pageCount = res.data.data.totalCount;
                });
            },
            // 获取工单列表数据
            fetchMissionList(params = {}) {
                const data = {
                    facId: this.facId,
                    userId: this.userId,
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    GTask: this.waitHanlde,
                    ...params
                }
                this.orderListLoding = true;
                getDesignMissionList(data)
                .then(res => {
                    this.orderListLoding = false;
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.orderList = res.data.data.list;
                    this.pageCount = res.data.data.totalCount;
                });
            },
            // 分页
            loadingMore(page) {
                this.currentPage = page;
                this.getDesignMissionTableList();
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
            // 获取负责人列表
            fetchPersonList() {
                getPersonList({
                    userId: this.userId,
                    unitId: this.facId
                }).then(res => {
                    this.selectPersonList = res.data;
                })
            },
            handleFilterMission(params) {
                this.currentPage = 1;
                this.filterParams = params;
                this.getDesignMissionTableList()
            },
            remoteSearch(orderNo) {
                debounce(this.fetchMissionList)({orderNo: this.orderSearch});
            },
            sortUpIconActive(item) {
                return item.byUpValue === this.orderBy;
            },
            sortDownIconActive(item) {
                return item.sortValue === this.orderBy;
            },
            // 默认排序
            handleSort() {
                this.orderBy = '';
                this.fetchMissionList();
            },
            handleSortText(item) {
                if (this.sortUpIconActive(item)) {
                    this.handleSortDown(item)
                } else if (this.sortDownIconActive(item)) {
                    this.handleSortUp(item);
                } else {
                    this.handleSortUp(item);
                }
            },
            // 升序
            handleSortUp(item) {
                this.orderBy = item.byUpValue;
                this.fetchMissionList({orderBy: this.orderBy});
            },
            // 降序
            handleSortDown(item) {
                this.orderBy = item.sortValue;
                this.fetchMissionList({orderBy: this.orderBy})
            },
            // 显示备注弹窗
            showRemarkDialog(opt) {
                console.log(opt)
                this.nodeItemData = opt;
                if (opt.type === 'edit') {
                    const fItem = opt.notifys.find(item => item.type == 2)
                    return this.fetchEditRemarkInfo(fItem.id);
                };
                this.initRemarkForm(opt);
                this.visible.remarkVisible = true;
            },
            handleRemark() {
                if (this.nodeItemData.type == 'new') {
                    return this.addRemark();
                }
                return this.editRemark();
            },
            fetchEditRemarkInfo(id) {
                getDesignNodeRemarkInfo({ notifyId: id })
                .then(res => {
                    const data = res.data.data;
                    this.remarkForm = {
                        notifyId: data.id,
                        content: data.content,
                        chargers: data.chargers.map(item => item.id)
                    };
                    this.$nextTick(() => {
                        this.visible.remarkVisible = true;
                    })
                });
            },
            // 添加备注
            addRemark() {
                if (!this.validRemarkForm()) return;
                const params = {
                    ...this.remarkForm,
                    userId: this.userId,
                    missionPrcdNodeId: this.nodeItemData.nodeId
                };
                this.visible.btnLoading = true;
                addDesignNodeRemark(params)
                .then(res => {
                    this.visible.btnLoading = false;
                    if (res.data.code === 0) {
                        this.visible.remarkVisible = false;
                        this.fetchMissionList();
                        return this.$message.success('添加备注成功');
                    }
                    this.$message.error('添加备注失败');
                });
            },
            // 添加备注
            editRemark() {
                if (!this.validRemarkForm()) return;
                const params = {
                    ...this.remarkForm,
                    userId: this.userId,
                    missionPrcdNodeId: this.nodeItemData.nodeId
                };
                this.visible.btnLoading = true;
                editDesignNodeRemark(params)
                .then(res => {
                    this.visible.btnLoading = false;
                    if (res.data.code === 0) {
                        this.visible.remarkVisible = false;
                        this.fetchMissionList();
                        return this.$message.success('修改备注成功');
                    }
                    this.$message.error(res.data.msg || '修改备注失败');
                });
            },
            initRemarkForm(opt) {
                this.remarkForm = {
                    content: '',
                    chargers: []
                };
            },
            validRemarkForm() {
                if (!this.remarkForm.chargers.length) {
                    this.$message.error('相关人员不能为空');
                    return false;
                }
                if (!this.remarkForm.content || this.remarkForm.content > 50) {
                    this.$message.error('请输入50个字符内备注');
                    return false;
                }
                return true;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";
    .home_content--main{
        padding-right: 0 !important;
    }
    .sample-centre {
        min-width: 1010px;

        .search-input {
            width: 260px;
            margin-right: 8px;
        }

        .utils-wrapper {
            padding-top: 16px;
            overflow: hidden;
            &--right {
                line-height: 32px;
                .utils-switch {
                    display: inline-block;
                }
                .btn--cancel {
                    float: right
                }
            }
            .utils-sort {
                display: inline-block;
                border: 1px solid #e6eaf0;
                box-sizing: border-box;
                font-size: 0;
                &--text {
                    cursor: pointer;
                    color: #a2abb8;
                }
                &__item {
                    box-sizing: border-box;
                    display: inline-block;
                    // width: 96px;
                    padding-left: 10px;
                    padding-right: 6px;
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
            .utils-switch{
                display: inline-block;
                margin-left: 30px;
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
        .remake__content {
            margin: 12px 0;
        }
        .btn--submit {
            margin-left: 12px;
        }
    }
</style>
<style lang="scss">
    .remark-form {
        margin-left: -20px;
        .el-select {
            width: 100%
        }
    }
    .sample-centre {
        .el-input__inner {
            border-radius: 2px;
        }
    }
</style>
