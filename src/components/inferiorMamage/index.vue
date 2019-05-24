<template>
    <div class="inferior-mamage">
        <!--头部begin-->
        <page-title title="次品管理" bg></page-title>
        <!--头部end-->
        <!--筛选区begin-->
        <inferior-mamage-filter
                ref="filter"
                @filterData="getFilterData">
        </inferior-mamage-filter>
        <!--筛选区end-->

        <div class="content-wrap">
            <!--按钮区域begin-->
            <div class="batch-btns">
                <nf-button
                        class="batch-btn-green"
                        @click="handlePass(defectiveSelectedList, 1, true)">
                    批量合格
                </nf-button>
                <nf-button
                        class="batch-btn-orange"
                        @click="handleUpdateState(defectiveSelectedList, 2, true)">
                    批量再修
                </nf-button>
                <nf-button
                        class="batch-btn-gray"
                        @click="handlePass(defectiveSelectedList, 3, true)">
                    批量报废
                </nf-button>
                <nf-button
                        class="batch-btn-black"
                        @click="handleBatchTeturn">
                    批量退回返修
                </nf-button>
                <span
                        class="check-all-bill"
                        @click="handleAllBillBtn">
                    查看全部单据
                </span>
            </div>
            <!--按钮区域end-->
            <!--表格begin-->
            <div v-loading="loading" class="content" id="goods_content">
                <inferior-mamage-table
                    ref="inferiorMamageTable"
                    :defectiveList="listInfo"
                    :demandArr="defectiveSelectedList"
                    @seletctList="defectiveSelect"
                    @handleDefective="handleDefective"
                    @handleUpdateState="handleUpdateState"
                    @handleReturn="handleReturn">
                </inferior-mamage-table>
            </div>
            <div class="page" v-if="totalNumber > 0">
                <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="totalNumber">
                </el-pagination>
            </div>
            <!--表格end-->
        </div>

        <!--全选弹窗begin-->
        <el-dialog
                title="全选操作"
                :modal-append-to-body="false"
                class="custom-dialog tip-dialog"
                :visible.sync="selectAllVisible"
                size="tiny">
            <ul class="msg-center">
                <li class="tip-text">
                    <el-radio class="radio" v-model="selectAllFlag" label="0">批量操作当前页数据</el-radio>
                </li>
                <li class="tip-text">
                    <el-radio class="radio" v-model="selectAllFlag" label="1">批量操作筛选条件下所有数据</el-radio>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancelSelect">取 消</el-button>
                <el-button type="primary" @click="handleConfirmSelect">确 定</el-button>
            </div>
        </el-dialog>
        <!--全选弹窗end-->

        <!--入库仓库弹窗-->
        <el-dialog
                class="custom-dialog in-storehouse"
                title="选择入库仓库"
                :visible.sync="inStorageVisible"
                size="tiny">
            <div class="storage-name">
                <span>入库仓库</span>
                <el-select v-model="storehouseId" placeholder="请选择">
                    <el-option
                            v-for="item in storehouseList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="storage-cause">
                <span class="storage-text">入库备注</span>
                <el-input class="adjust-textarea" placeholder="请输入20字以内的备注" maxlength="20" v-model="OrderCause"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="inStorageVisible = false">取 消</el-button>
                <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!--退回返修 侧滑窗-->
        <transition name="right-move">
            <return-repair
                    style="z-index: 1000"
                    v-if="moduleShow"
                    :defectivedArr="defectivedArr"
                    :selectAllFlag="selectAllFlag"
                    :filterData="filterData"
                    @handleClose="returnRepairClose"
                    @commit="returnRepairCommit">
            </return-repair>
        </transition>
        <transition name="opcity">
            <div style="z-index: 100" class="cover" v-if="moduleShow" @click="cancelModule">
            </div>
        </transition>

    </div>
</template>

<script>
    import {
        getStorehousesByUserId,
    } from "@/api/api";
    import {
        defectivedList,
        inferiorRepairQualifyBatch,
        inferiorRepairRepairBatch,
        inferiorRepairWasteBatch,
    } from "@/api/inferiorMamage"
    import inferiorMamageFilter from '@/components/inferiorMamage/inferiorMamageFilter.vue';
    import inferiorMamageTable from '@/components/inferiorMamage/inferiorMamageTable.vue';
    import returnRepair from '@/components/inferiorMamage/returnRepair.vue'
    export default {
        name: "inferiorMamage.vue",
        data(){
            return {
                loading:false,
                listInfo: [],               //表格数据
                selectAllVisible: false,       //全选弹窗
                currentPage: 1,             //当前页
                pageSize: 20,               //每页条数
                totalNumber: 0,             //总条数
                sumPage: 0,                 //总页数
                lastPageNum: 0,             //最后一页的条数
                radio: "1",                 //1当前页，0全部
                filterData: {},              // 筛选数据
                isBatch: false,
                inStorageVisible: false,    //入库弹窗
                storehouseId: null,           //入库仓库
                storehouseList: [],         //仓库下拉
                storehouseListBackup: [], // 仓库备份
                OrderCause:'',
                btnLoading: false,
                moduleShow: false,     //是否显示退回返修侧滑窗
                defectivedArr: [],      //已选次品id数组
                batchdefectivedArr: [],      //批量选择的次品id数组
                defectiveSelectedList: [],  //次品表格已选数据
                selectAllFlag: "0",       //是否选取所有数据
                defaultStorehouseTag: {}, // 默认仓库数据
                waste: {}, // 废品仓库数据
                wasteStorehouseId: '', //废品仓库id
                failGood: {},
                associateInStore: false,    //筛选条件下所有数据是否关联仓库
            }
        },
        components:{
            inferiorMamageFilter,
            inferiorMamageTable,
            returnRepair,
        },
        computed:{
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods:{
            //侧滑窗关闭
            returnRepairClose(){
                this.moduleShow = false;
            },

            //已选数据，是否存在节点关联入库，如果有就需要弹出入库弹窗
            nodeAssociateInStore(data){
                let flag = false;
                //选取了所有数据，返回associateInStore（筛选条件下所有数据是否关联仓库）
                if(this.selectAllFlag === '1'){
                    return this.associateInStore;
                }
                //单条数据或本页数据，需要前端校验
                else{
                    data.forEach(item => {
                        if(item.associateInStore){
                            flag = true;
                            return
                        }
                    })
                }
                return flag;
            },

            //批量操作
            handlePass(row, type, flag) {
                this.isBatch = flag;
                if(!this.defectiveSelectedList.length && this.isBatch){
                    this.$message.error('请先勾选要操作的数据');
                    return
                }
                //节点是否勾选入库判断
                let isAssociate = this.nodeAssociateInStore(row);
                if(isAssociate){
                    //可以入库
                    this.OrderCause = '';
                    this.inStorageVisible = true;
                    this.type = type;
                    this.failGood = row;        //保存已选的次品数据
                    if (this.type == 3) {
                        let storehouseList = [];
                        this.storehouseList.forEach(i => {
                            if(i.type === 'WASTE' || i.name == '无') {
                                storehouseList.push(i)
                            }
                        });
                        if (this.waste) {
                            this.storehouseId = this.waste.id;
                        }
                        this.storehouseList = storehouseList
                    } else {
                        this.storehouseList = JSON.parse(JSON.stringify(this.storehouseListBackup));
                    }
                }else {
                    this.handleUpdateState(row, type, this.isBatch)
                }
            },
            // 单个次品操作
            handleDefective(row, type, flag, ) {
                this.isBatch = flag;
                this.handlePass(row, type, flag)
            },

            // 入库仓库确认
            handleConfirm() {
                if(this.storehouseId === null) return this.$message.error('请选择入库仓库');
                if(this.isBatch){
                    this.handleUpdateState(this.failGood, this.type, true);
                }else{
                    this.handleUpdateState(this.failGood, this.type, false);
                }

            },

            //合格，再修，报废统一提交接口
            handleUpdateState(data, type, flag) {
                this.isBatch = flag;
                if(!this.defectiveSelectedList.length && this.isBatch){
                    this.$message.error('请先勾选要操作的数据');
                    return
                }
                if (this.btnLoading ) return;
                const params = {
                    selectAllFlag:this.selectAllFlag,
                    query: {...this.filterData},
                    userId: this.$common.userId(),
                    defectivedList: data,
                    storehouseId: this.storehouseId,
                    remark: this.OrderCause,
                    unitId: this.unitId,
                };
                params.query.unitId = this.unitId;
                this.btnLoading = true;
                //合格
                if (type === 1) {
                    inferiorRepairQualifyBatch(params).then(res => {
                        this.updateSuccessCb(res);
                    });
                }
                //再修
                else if (type === 2) {
                    inferiorRepairRepairBatch(params).then(res => {
                        this.updateSuccessCb(res);
                    });
                }
                //报废
                else if (type === 3){
                    inferiorRepairWasteBatch(params).then(res => {
                        this.updateSuccessCb(res);
                    });
                }
                this.selectAllFlag = '0'
            },

            //数据提交后处理
            updateSuccessCb(res) {
                this.btnLoading = false;
                this.inStorageVisible = false;
                if(res.data.code === 0){
                    this.$message.success(res.data.msg);
                    this.getTableData();
                }else{
                    this.$message.error(res.data.msg);
                }
            },

            // 获取仓库列表
            getStorehousesList() {
                let params = {
                    facId: this.$common.facId(),
                    userId:this.$common.userId(),
                    kind: 1
                };
                getStorehousesByUserId(params).then(res => {
                    if(res.data.code === 0){
                        this.storehouseList = res.data.data;
                        this.storehouseListBackup = res.data.data;
                        this.storehouseList.push({id: '', name: '无'});
                        this.defaultStorehouseTag = res.data.data.find(
                            item => item.defaultStorehouseTag === 1
                        );
                        this.waste = res.data.data.find(
                            item => item.type === 'WASTE'
                        );
                        if (this.waste) {
                            this.wasteStorehouseId = this.waste.id;
                        }
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 次品批量选择
            defectiveSelect(val, selectAll) {
                this.defectiveSelectedList = val;

                if(this.listInfo.length!==val.length){
                    this.selectAllFlag = '0';
                }
                this.batchdefectivedArr = val.map(item => item.id);
                //总页数大于1（有分页） && 勾选了全选
                if(this.sumPage > 1 && selectAll){
                    this.selectAllVisible = true;
                }
            },
            //退回返修按钮点击
            handleReturn(id){
                this.defectivedArr = [];
                this.defectivedArr.push(id);
                this.moduleShow = true;
            },
            //批量退回返修按钮点击
            handleBatchTeturn(){
                this.defectivedArr = this.batchdefectivedArr;
                if(!this.defectivedArr.length){
                    this.$message.error('请先勾选要操作的数据');
                    return
                }
                //勾选了本页数据，需要校验所选数据是否存在返修状态，如果有就报错
                if(this.selectAllFlag === '0'){
                    let status = true;
                    this.listInfo.forEach((item) =>{
                        item.defectivedList.forEach((styleItem) =>{
                            //非返修中状态
                            if(styleItem.status === 4){
                                status = false;
                                this.$message.error("已返厂不允许再次返厂");
                                return
                            }
                        })
                    });
                    if(status){
                        this.moduleShow = true;
                    }
                }else{
                    this.moduleShow = true;
                }
            },
            //关闭侧滑栏
            cancelModule() {
                this.moduleShow = false;
            },
            //查看全部单据
            handleAllBillBtn() {
                this.$router.push({
                    path: '/allInferiorBill',
                })
            },
            //分页切换
            handleCurrentChange(val){
                this.currentPage = val;
                this.getTableData();
            },
            // 筛选数据
            getFilterData (val) {
                this.filterData = val;
                this.getTableData()
            },
            //获取表格数据
            getTableData() {
                let params = {
                    unitId: this.$common.unitId(),
                    pageSize: this.pageSize,
                    pageNo: this.currentPage,
                    ...this.filterData,
                };
                this.loading = true;
                defectivedList(params).then(res => {
                    this.loading = false;
                    if(res.data.code === 0){
                        this.defectiveSelectedList = [];
                        let data = res.data.data;
                        this.associateInStore = data.associateInStore;
                        this.listInfo = data.list;
                        this.totalNumber = data.totalCount;     //总条数
                        this.sumPage = data.totalPage;   //总页数
                        this.lastPageNum = this.totalNumber % this.pageSize;     //最后一页的条数
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //弹窗导入
            handleConfirmSelect(){
                this.selectAllVisible = false;
            },
            //关闭弹窗
            handleCancelSelect(){
                this.selectAllFlag = '0';
                this.selectAllVisible = false;
            },
            //退回返修组件提交成功回调
            returnRepairCommit(){
                this.moduleShow = false;
                this.getTableData();
            }
        },
        created(){
            this.getStorehousesList();
        },
        mounted(){
            this.filterData = this.$refs.filter.filterFormData;
            this.getTableData();
        }
    }
</script>

<style lang="scss" scoped>
    .inferior-mamage{
        .page{
            margin: 20px 0;
            text-align: right;
        }
        .tip-dialog{
            .msg-center{
                margin: 0 50px;
               .tip-text{
                   margin: 15px 0;
               }
            }
        }
        .content-wrap{
            padding:20px;
            background-color: #fff;
            .batch-btns{
                margin-bottom: 20px;
                overflow: hidden;
                .batch-btn-green{
                    color:#23C811;
                    border-color:#7BDE70;
                }
                .batch-btn-orange{
                    color:#FF7F14;
                    border-color:#FFBF89;
                }
                .batch-btn-gray{
                    color:#999;
                    border-color:#ddd;
                }
                .batch-btn-black{
                    color:#333;
                    border-color:#666;
                }
                .check-all-bill{
                    float: right;
                    line-height: 35px;
                    cursor: pointer;
                }
            }
        }
        .in-storehouse{
            .storage-name{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                span{
                    margin-right: 15px;
                }
            }
            .storage-cause{
                display: flex;
                margin-top: 10px;
                .storage-text{
                    flex-basis: 81px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .inferior-mamage{
        .custom-dialog.tip-dialog{
            .el-dialog--tiny{
                width: 500px;
            }
            .el-dialog__body{
                padding:15px 30px;
            }
        }
        .tip-dialog{
            .el-dialog__header{
                border-bottom: 1px solid #e6eaf0;
            }
        }
    }
</style>
