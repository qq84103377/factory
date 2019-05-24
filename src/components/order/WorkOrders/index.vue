<template>
    <el-row id="worker-orders" class="scroll-content" ref="viewBox">
        <div style="margin-bottom: 16px;">
            <div class="fixed-top">
                <div class="utils-tabbar">
                    <div class="utils-tabbar__item"
                         v-for="(item, index) in tabbarConf"
                         :key="index"
                         :class="{'is-active': activeIndex === index}"
                         @click="handleTabItemClick(item, index)">
                        {{ item.label }}
                    </div>
                </div>
                <div>
                    <span>筛选</span>
                    <nf-button style="margin:0 6px;" @click="filterFormDialog=true">按条件筛选</nf-button>
                    <el-input @change="remoteSearch" class="search-input" v-model="orderSearch"
                              placeholder="输入工单号/款号搜索"
                              icon="search">
                    </el-input>
                    <nf-button type="warning" svg="icon-btn-add" @click.native="clickskip">
                        新建工单
                    </nf-button>
                </div>
                <!--排序-->

                <!--排序end-->
            </div>
            <el-row class="utils-wrapper">
                <el-col :span="16" class="utils-wrapper--left">
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
                        <div class="utils-sort__item is-active" v-for="(item, index) in sortOptions"
                             :key="index">
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
                        <div class="utils-sort__item is-active" style="border: none;margin-left: 32px;">
                            <span class="switch-font">待我处理</span>
                            <el-switch
                                    v-model="switchVal"
                                    width="40"
                                    on-text=""
                                    off-text=""
                                    off-value="0"
                                    on-value="1"
                                    @change="fetchMissionList">
                            </el-switch>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8" class="utils-wrapper--right" style="margin-top: 8px;">
                    <icon-button @click="isShow">
                        <i class="el-icon-delete2"></i>已撤销工单
                    </icon-button>

                </el-col>

            </el-row>
         <div>
                <!--筛选区-->
             <transition name="right-move">
                 <filter-form
                         :filterFormDialog.sync="filterFormDialog"
                         v-show="filterFormDialog"
                         ref="filterForm"
                         :attrsData="attrsData"
                         :selectPersonList="selectPersonList"
                         @on-filter="handleFilterMission">
                 </filter-form>
             </transition>
             <transition name="opcity">
                 <div class="cover1" v-show="filterFormDialog" @click="filterFormDialog=false">
                 </div>
             </transition>
                <!--筛选区end-->
            </div>

        </div>
        <div class="main-content" style="padding-left: 24px;">
            <!--工单列表-->
            <keep-alive>
                <component
                        v-show="!orderListLoding"
                        :is="componentId"
                        :missionList="orderList"
                        :printList="printList"
                        :configure="{currentPage,componentId,scrollTop}"
                />
            </keep-alive>
            <p class="empty-content" v-show="orderListLoding">
                <i class="el-icon-loading"></i>
            </p>
            <!--工单列表 end-->

            <!--动态表头配置-->
            <template v-if="componentId === 'MissionTableList'">
                <div class="setting-table" @click="dynamicVisible = true">
                    <icon type="icon-topbar-setting"></icon>
                    <span class="setting-table-font">工单表头配置</span>
                </div>
            </template>


        </div>
        <!--分页-->
        <div class="top-page-wrap">
            <div class="page-pagination">
                <el-pagination @current-change="loadingMore" :page-size="20"
                               layout="total, prev, pager, next"
                               :total="pageCount" :current-page.sync="currentPage">
                </el-pagination>
            </div>
        </div>
        <!--</section>-->
        <!-- 备注添加修改弹窗 -->
        <el-dialog
                class="remark-dialog"
                :show-close="false"
                :visible.sync="remarkDialogVisible"
                size="tiny">
            <div class="remake__title" slot="title">
                {{ remark.type === 'new' ? '添加备注' : '修改备注' }}
            </div>
            <div class="remake__person">
                相关人员：
                <el-select v-model="remarkForm.remarkPerson" placeholder="请选择">
                    <el-option v-for="(leaderItem, leaderIndex) in selectPersonList" :key="leaderIndex"
                               :label="leaderItem.userName" :value="leaderItem.id">
                    </el-option>
                </el-select>
            </div>
            <div class="remake__content">
                <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="请输入备注信息"
                        v-model="remarkForm.remarkContent">
                </el-input>
            </div>
            <div class="upload-img">
                <div class="upload-mes">
                    <template v-if="labelDisable">
                        <label for="upload-input" class="upload-label">添加图片</label>
                    </template>
                    <template v-else>
                        <span class="span-gray">添加图片</span>
                    </template>
                    <span class="upload-font">只能上传 jpg / png 文件，且不超过5m，最多8张</span>
                </div>
                <ul class="upload-lists">
                    <li v-for="(item,index) of pictureList"
                        :key="index">
                        <i class="imgCancel"
                           @click.stop="cancelImg(index)">
                            <img src="../../../../static/el-icon-close@3x.png" class="img-cancel">
                        </i>
                        <img :src="item" class="img-lists">
                    </li>
                </ul>
                <div class="upload-hide">
                    <input type="file"
                           accept="image/png,image/jpeg,image/jpg,image/gif"
                           id="upload-input"
                           @change="imgUpload($event)">
                </div>
            </div>
            <div class="remake__footer">
                <nf-button style="margin-right:12px;" @click="closeRemarkDialog">取 消</nf-button>
                <nf-button type="warning" @click="remarkOpera">确 定</nf-button>
            </div>
        </el-dialog>
        <!-- 快速上报 -->
        <quick-report
                ref="quickReport"
                :nodeInfo="nodeInfo"
                :visible.sync="visible.reportVisible"
                @success="fetchMissionList"></quick-report>
        <!-- 快速上报end -->
        <!--动态配置表头组件-->
        <dynamic-head
                title="配置表头显示内容"
                :dynamicVisible="dynamicVisible"
                :allSelectItem="dynamicAllItem"
                :checkedArr="dynamicCheckArr"
                :sortArr="dynamicSortArr"
                @dynamicSearch="getAllItem"
                @dynamicReset="resetDefaultItem"
                @updateCheckedArr="updateCheckedArr"
                @updateSortArr="updateSortArr"
                @dynamicCommit="dynamicCommit"
                @closeDynamicHead="closeDynamicHead"
        >
        </dynamic-head>
    </el-row>
</template>

<script type="text/ecmascript-6">
    import FilterForm from './filter-form';
    import MissionList from './mission-list';
    import MissionTableList from './mission-table-list';
    import QuickReport from '../quick-report';
    import DynamicHead from '@/components/Common/dynamicHead';
    import {mapState, mapActions} from 'vuex';
    import {debounce} from '@/utils';
    import {
        getUploadToken, //获取七牛云上传token
        upDetailImgs, //上传图片的接口
        queryFacMissionList,
        getFacUnitSettings,
        getPrintTemplatesByType,
        getPersonList,
        addNotifyRemake,
        updateNotifyRemake,
        allFacDefectiveLabel,
        fieldConfigList,
        chooseFieldConfigList,
        defaultFieldConfigList,
        updateChooseFacField,
        facTemplates
    } from '@/api';

    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";

    export default {
        name: 'WorkOrders',
        data() {
            return {
                filterFormDialog:false,
                scrollTop: 0,
                pageCount: 0, //工单总数,页码需要显示
                currentPage: 1,  // 工单当前页码，返回上级回到当前页码需要
                orderListLoding: false, //工单列表loading
                printList: [],
                orderList: [],
                sign: '',
                orderSearch: '',
                attrsData: {}, // 货品属性数据
                orderBy: '', //排序依据,默认降序 0 默认排序 1 制单日期升序 2 制单日期降序 3 交货日期升序 4 交货日期倒序 5 货品款号升序 6 货品款号倒序 7 工单号升序 8 工单号倒序
                selectPersonList: [],
                activeIndex: 0,
                componentId: 'MissionList',
                switchVal: '0',       //待我处理
                remarkForm: {
                    remarkContent: '',
                    remarkPerson: ''
                },
                visible: {
                    remarkVisible: false,
                    reportVisible: false
                },
                tabbarConf: [
                    {
                        label: '生产工单-图形列表',
                        componentId: 'MissionList'
                    },
                    {
                        label: '生产工单-表格列表',
                        componentId: 'MissionTableList'
                    }
                ],
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
                pictureList: [],    //备注图片
                dynamicVisible: false,   //动态配置表头组件
                dynamicAllItem: '', //动态配置表头全部字段
                dynamicDefaultItem: '', //动态配置表头默认字段
                dynamicCheckArr: [],     //动态配置表头已选数组
                dynamicSortArr: [],     //动态配置表头需要排序的对象数组
            };
        },
        components: {
            FilterForm,
            MissionList,
            QuickReport,
            MissionTableList,
            DynamicHead
        },
        computed: {
            // 计算属性
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            //当上传图片数超过8张时，改变按钮样式
            labelDisable() {
                if (this.pictureList.length >= 8) {
                    return false
                } else {
                    return true
                }
            },
            ...mapState({
                remarkDialogVisible: state => state.Mission.remarkDialogVisible,
                remark: state => state.Mission.remark,
                isShowReportDialog: state => state.Mission.isShowReportDialog,
                nodeInfo: state => state.Mission.nodeInfo
            })
        },
        filters: {
            filterEndTime(val) {
                return val.slice(0, 11);
            }
        },
        watch: {
            remark(val) {
                if (val.type === 'edit') {
                    this.getEditRemark(val);
                }
            },
            isShowReportDialog(val) {
                this.visible.reportVisible = val;
            },
            'visible.reportVisible'(val) {
                this.handleReportDialog(val);
            }
        },
        beforeDestroy() {
            this.handleReportDialog(false);
        },
        async mounted() {
            let timers;
            if (this.$route.query['scrollTop'] != undefined && this.$route.query['scrollTop']) {
                timers = 'fir';
                this.fetchMissionList({}, timers);
            } else {
                this.fetchMissionList();
            }
            if (this.$route.query['currentPage'] != 'NaN' && this.$route.query['currentPage'] != 'undefined' && this.$route.query['currentPage']) {
                this.currentPage = parseInt(this.$route.query['currentPage'])
            } else {
                this.currentPage = 1
            }
            this.fetchPersonList();
            this.fetchFacUnitSettings();
            this.getPrintTemplatesByType();
            await this.getAllItem();    //获取全部选项
            await this.getCheckedItem();      //获取选中选项

            window.addEventListener('scroll', this.scrollGo, true);
        },
        activated(){
            this.fetchMissionList();
            this.getPrintTemplatesByType();
        },
        methods: {
            // 抽检型快速上报
            cancel(v) {
                this.visible.reportVisible = v
                this.fetchMissionList()
            },
            //图片上传逻辑
            imgUpload(e) {
                const _this = this;
                let params = {
                    appId: this.$globalConfig.appId.appId
                };
                const file = e.target.files;
                for (let i = 0; i < file.length; i++) {
                    if (file[i].size > 5000000) {
                        _this.$message({
                            showClose: true,
                            message: "图片大小超过5M!,重新上传",
                            type: "error",
                            duration: config.elementUI.duration
                        });
                        return false;
                    }
                    getUploadToken(params).then(res => {
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            const _imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
                            _this.pictureList.push(_imgUrl);
                        });
                    });
                }
            },
            //md5图片上传Key的拼接
            setImgKey(name) {
                const storeId =
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId;
                const date = +new Date() + "";
                return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
            },
            //点击删除当前图片
            cancelImg(index) {
                this.pictureList.splice(index, 1);
            },

            //获取动态配置表头，可选字段列表
            async getAllItem(val) {
                if (!val) {
                    val = '';
                }
                await fieldConfigList({
                    userId: this.userId,
                    unitId: this.facId,
                    keyWord: val,
                    facFieldConfigModuleCodeList: ['facmission', 'goodsfiles', 'customerfiles']
                }).then(res => {
                    this.dynamicAllItem = res.data.facFieldConfigModuleList;
                });
                await this.getDefaultItem();      //获取默认选项
                this.setDefaultFlag();      //增加是否选中标识
            },
            //获取动态配置表头，已选字段列表
            async getCheckedItem() {
                await chooseFieldConfigList({
                    userId: this.userId,
                    unitId: this.facId,
                    targetType: 'FACMISSION',
                    facFieldConfigModuleCodeList: ['facmission', 'goodsfiles', 'customerfiles']
                }).then(res => {
                    this.dynamicSortArr = res.data.FacFieldConfigList;
                    // console.log(JSON.stringify(this.dynamicSortArr));
                    this.getNameArr(this.dynamicSortArr);
                    this.getDeleteFlag(this.dynamicSortArr);
                })
            },
            //获取动态配置表头，默认字段列表
            async getDefaultItem() {
                await defaultFieldConfigList({
                    userId: this.userId,
                    unitId: this.facId,
                    targetType: 'FACMISSION',
                    facFieldConfigModuleCodeList: ['facmission', 'goodsfiles', 'customerfiles']
                }).then(res => {
                    this.dynamicDefaultItem = res.data.FacFieldConfigList;
                })
            },
            //获取已选值，封装成名称数组
            getNameArr(val) {
                if (val) {
                    this.dynamicCheckArr = [];
                    val.forEach((item, index) => {
                        this.dynamicCheckArr.push(item.name);
                    });
                }
            },
            //非默认选项增加可删除标识
            getDeleteFlag(val) {
                if (val === this.dynamicSortArr) {
                    this.dynamicSortArr.forEach((item, index) => {
                        item.deleteFlag = true;
                        this.dynamicDefaultItem.forEach((val, i) => {
                            if (item.code === val.code) {
                                item.deleteFlag = false;
                            }
                        });
                    });
                } else if (val === this.dynamicDefaultItem) {
                    this.dynamicSortArr = this.dynamicDefaultItem;      //点击重置按钮后，让已选数据变成默认数据
                    this.dynamicSortArr.forEach((item, index) => {
                        item.deleteFlag = false;
                    });
                }
            },
            //已选字段列表对象，增加是否默认选择属性
            setDefaultFlag() {
                this.dynamicAllItem.forEach((item, index) => {
                    if (item.FacFieldConfigList) {
                        item.FacFieldConfigList.forEach((items, indexs) => {
                            items.defaultSelect = false;
                            this.dynamicDefaultItem.forEach((val, i) => {
                                if (items.code === val.code) {
                                    items.defaultSelect = true;
                                }
                            })
                        });
                    }
                });
                this.dynamicAllItem = [...this.dynamicAllItem];
            },

            //子组件勾选后，需要更新父组件勾选数据
            updateCheckedArr(val) {
                this.dynamicCheckArr = val
            },
            //子组件排序后，需要更新父组件排序数据
            updateSortArr(val) {
                this.dynamicSortArr = val
            },
            //恢复默认选项
            resetDefaultItem() {
                this.getDefaultItem();
                this.getNameArr(this.dynamicDefaultItem);
                this.getDeleteFlag(this.dynamicDefaultItem);
            },
            //提交动态表头组件排序数据
            dynamicCommit() {
                updateChooseFacField({
                    userId: this.userId,
                    unitId: this.facId,
                    targetType: 'FACMISSION',
                    facFieldConfigList: this.dynamicSortArr
                }).then(res => {
                    const result = res.data;
                    if (result.code === 0) {
                        this.$message.success(result.msg);
                    } else {
                        this.$message.error(result.msg);
                    }
                    this.dynamicVisible = false;

                    this.fetchMissionList();
                })
            },

            //关闭动态配置表头弹窗
            closeDynamicHead() {
                this.dynamicVisible = false;
            },


            scrollGo(e) {
                this.scrollTop = e.target.scrollTop
            },
            isShow() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.mission.manage") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push({path: '/cancelOrder', meta: {keepAlive: true}})
            },
            ...mapActions(['remarkAdd', 'handleDialog', 'handleReportDialog']),
            // 方法
            clickskip() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.mission.add") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$store.dispatch('deleteVisitedLive', 'CreateOrder');
                this.$nextTick(() => {
                    this.$router.push("/CreateOrder");
                })
            },
            // 获取工单列表数据
            fetchMissionList(params = {}, timers) {
                const _params = {
                    ...this.$refs['filterForm'].getFilterParams(),
                    ...params
                };
                const data = {
                    facId: this.facId,
                    userId: this.userId,
                    ..._params,
                    GTask: this.switchVal,  //待我处理
                    pageNo: this.currentPage,
                    modelName: 'FACTORY_MISSION',
                };
                this.orderListLoding = true;
                queryFacMissionList(data).then(res => {
                    this.orderListLoding = false;
                    if (res.data.code !== 0) {
                        this.$message.error(res.data.msg);
                        return;
                    }
                    this.orderList = res.data.facMissionList;
                    // console.log(JSON.stringify(this.orderList));
                    this.pageCount = res.data.pageCount;
                    if (timers === 'fir') {
                        var scrollTop = 0;
                        if (this.$route.query['scrollTop'] != undefined && this.$route.query['scrollTop']) {
                            scrollTop = this.$route.query['scrollTop']
                        }
                        let box = this.$refs.viewBox;
                        setTimeout(function () {
                            box.$el.scroll(0, scrollTop);
                        }, 100)
                    }
                });
            },

            // 分页
            loadingMore(page) {
                console.log(page);
                this.currentPage = page;
                this.fetchMissionList();
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
                this.fetchMissionList(params);
            },
            // 获取工单打印列表
            getPrintTemplatesByType() {
                let params = {
                    userId: this.userId,
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    type: 'mission',
                    pageNo: 1,
                    pageSize: 9999,
                    using: true,
                    typeId: ''
                };
                facTemplates(params).then(res => {
                    if (res) {
                        this.printList = res.data.data.list
                    }
                })
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
            closeRemarkDialog() {
                this.handleDialog({visible: false});
            },
            // 获取需要修改备注的数据到remarkForm
            getEditRemark(remark = {}) {
                console.log(remark);
                const fRemark = remark.data['nodeNotifys'].find(item => +item.notifyType === 3);
                const chargers = remark.data['chargers'].length ? remark.data['chargers'][0].id : '';
                const pictureLists = remark.data.nodeNotifys[0].notePictureList;
                this.pictureList = pictureLists;    //将节点中的图片数据赋值
                this.remarkForm = {
                    remarkPerson: chargers,
                    remarkContent: fRemark.notifyContent,
                    notifyId: fRemark.notifyId
                }
            },
            remarkOpera() {
                if (!this.validRemarkForm()) return;
                let params = {
                    content: this.remarkForm.remarkContent,
                    chargers: [this.remarkForm.remarkPerson],
                    instanceId: this.remark.data.instanceId,
                    notePictureList: this.pictureList
                };
                if (this.remark.type === 'new') {
                    // 添加
                    this.addRemark(params);
                    return;
                }
                // 修改
                params.id = this.remarkForm.notifyId;
                this.editRemark(params);
            },
            // 添加备注
            addRemark(params) {
                addNotifyRemake(params).then(res => {
                    if (res.data.code == 0) {
                        this.remark.instance && this.remark.instance.showPopover(true); // 重新获取节点信息
                        this.handleDialog({
                            visible: false
                        });
                        this.$message.success('添加成功');
                        this.remarkForm.remarkContent = '';
                        this.remarkForm.remarkPerson = '';
                        // this.fetchMissionList();
                    }
                    else {
                        this.$message.error(res.data.msg || '出错了');
                    }
                })
            },
            // 修改备注
            editRemark(params) {
                updateNotifyRemake(params).then(res => {
                    if (res.data.code == 0) {
                        // instance代表节点实例
                        this.remark.instance && this.remark.instance.showPopover(true); // 重新获取节点信息
                        this.handleDialog({
                            visible: false
                        });
                        this.remarkForm.remarkContent = '';
                        this.remarkForm.remarkPerson = '';
                        this.$message.success('修改成功');
                    }
                    else {
                        this.$message.error(res.data.msg || '出错了');
                    }
                })
            },
            validRemarkForm() {
                if (!this.remarkForm.remarkPerson) {
                    this.$message.error('相关人员不能为空');
                    return false;
                }
                if (!this.remarkForm.remarkContent) {
                    this.$message.error('内容不能为空');
                    return false;
                }
                return true;
            },
            handleTabItemClick(item = {}, index) {
                this.activeIndex = index;
                this.componentId = item.componentId;
            },

        }
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    .home_content--main {
        padding-right: 0 !important;
    }

    #worker-orders {
        margin: -24px;
        overflow-y: auto;
        width: calc(100% + 48px);
        min-width: 1010px;
        .fixed-top{
            display: flex;
            justify-content: space-between;
            background: #ffffff;
            padding-top: 10px;
            padding-right: 24px;
            .utils-tabbar {
                display: flex;
                box-sizing: border-box;
                margin-left: 25px;
                text-align: right;
                font-size: 0;
                margin-bottom: 10px;
                &__item {
                    display: inline-block;
                    box-sizing: border-box;
                    line-height: 32px;
                    text-align: center;
                    font-size: 16px;
                    color: #939FB8;
                    background: #fff;
                    cursor: pointer;
                    padding: 0 10px;
                    &:not(:last-child) {
                        margin-right: 20px;
                    }
                    &.is-active {
                        border-bottom: 2px solid #FFA914;
                        color: #3B3B3B;
                    }
                }
            }
        }
        .search-input {
            width: 260px;
            margin-right: 8px;
        }

        .utils-wrapper {
            padding: 12px 24px;
            background: #fff;
            /*padding-right: 30px;*/
            overflow: hidden;
            &--right {
                text-align: right;
            }
            .utils-sort {
                display: inline-block;
                /*border: 1px solid #e6eaf0;*/
                box-sizing: border-box;
                font-size: 0;
                &--text {
                    cursor: pointer;
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
                    border: 1px solid #e6eaf0;
                    &:not(:first-child) {
                        border-left: none;
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

            .switch-wrap {
                margin-top: -4px;
                display: inline-block;
                .switch-font {
                    vertical-align: middle;
                    font-size: 14px;
                    color: #3B3B3B;
                }
                .el-switch.is-checked .el-switch__core {
                    border-color: #FFA914;
                    background-color: #FFA914;
                }
            }
            .top-page-wrap {
                .page-pagination {
                    padding: 0;
                    margin-top: 15px;
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
            padding-bottom: 16px;
        }
        .remake__title {
            text-align: center;
            font-size: 20px;
        }
        .remake__footer {
            display: flex;
            justify-content: flex-end;
        }
        .remake__person {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .remake__content {
            margin: 12px 0;
            .remake__content--textarea {
                width: 100%;
                height: 160px;
                padding: 12px;
                box-sizing: border-box;
                border-radius: 2px;
                font-size: 14px;
                outline: none;
                resize: none;
                transition: border-color .3s;
            }
        }

        .upload-img {
            .upload-mes {
                margin-bottom: 10px;
                .upload-label {
                    display: inline-block;
                    width: 64px;
                    line-height: 28px;
                    font-size: 12px;
                    text-align: center;
                    color: #fff;
                    background-color: #1CA1FF;
                    border-radius: 2px;
                    margin-right: 7px;
                    cursor: pointer;
                }
                .span-gray {
                    display: inline-block;
                    width: 64px;
                    line-height: 28px;
                    font-size: 12px;
                    text-align: center;
                    color: #bfcbd9;
                    background-color: #eef1f6;
                    border-radius: 2px;
                    margin-right: 7px;
                }
                .upload-font {
                    font-size: 12px;
                }
            }
            .upload-lists {
                margin-right: -10px;
                max-height: 220px;
                overflow: hidden;
                li {
                    position: relative;
                    float: left;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    margin: 0 10px 10px 0;
                }
                .img-cancel {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 13px;
                    height: 13px;
                    padding: 2px;
                    cursor: pointer;
                    background-color: #fff;
                    opacity: .8;
                    &:hover {
                        opacity: 1;
                    }
                }
                .img-lists {
                    width: 100%;
                    max-height: 100%;
                    vertical-align: middle;
                }
            }
            .upload-hide {
                display: none;
            }
        }
        .setting-table {
            float: left;
            line-height: 32px;
            padding-top: 18px;
            padding-bottom: 30px;
            cursor: pointer;
            .setting-table-font {
                display: inline-block;
                font-size: 14px;
                color: #808080;
                vertical-align: middle;
            }
        }
    }
</style>
<style lang="scss">
    #worker-orders {
        .el-input {
            .el-input__inner {
                border-radius: 2px;
            }
        }
        .el-switch.is-checked .el-switch__core {
            border-color: #FFA914;
            background-color: #FFA914;
        }
        .remark-dialog {
            .el-dialog--tiny {
                width: 470px;
            }
        }
    }
</style>
