<template>
    <div class="audit-config">
        <el-dialog
                class="custom-dialog documentReview_dialog"
                title="审核配置"
                :visible.sync="isShow"
                @close="handleClose">
            <el-table
                    border
                    align="center"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        label="单据类型"
                        width="125">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.billType"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.billType"
                                    :label="item.billTypeName"
                                    :value="item.billType">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        label="审核上报人"
                        width="160">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.reporter"
                                multiple
                                filterable
                                placeholder="请选择"
                                @change="selectChange($event, scope.$index)">
                            <el-option
                                    v-for="item in reportPeopleList"
                                    :key="item.id"
                                    :label="item.userName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        label="审核操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.auditOperation"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in handleList"
                                    :key="item.type"
                                    :label="item.name"
                                    :value="item.type">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        label="审核单据类型"
                        width="130">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.auditBillType"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in documentTypeList"
                                    :key="item.type"
                                    :label="item.name"
                                    :value="item.type">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        label="审核人"
                        width="160">
                    <template slot-scope="scope">
                        <workerLeader
                                :manListProps="manListProps"
                                v-model="scope.row.normalReviewer"
                                placeholder="搜索选择">
                        </workerLeader>
                    </template>
                </el-table-column>
                <el-table-column
                        label="反审批准人"
                        width="160">
                    <template slot-scope="scope">
                        <workerLeader
                                single="single"
                                :manListProps="manListProps"
                                v-model="scope.row.antiReviewer[0]"
                                placeholder="搜索选择">
                        </workerLeader>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <span
                                class="del-btn"
                                @click="tableDataDel(scope.row,scope.$index)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <p class="dialogDataAdd" @click="dialogDataAddGo">+ 添加</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import{
        billReviewConfigMission,
        getReviewConfigMission,
        getUnitUser,
        delReviewConfigMission,
        workbays,
    } from '@/api'
    export default {
        name: "auditConfig",
        props:['isShow','nodeId'],
        /**************
         *
         * isShow: 是否显示
         * nodeId: 节点id
         *
         *
         * ***************/
        data(){
            return{
                manListProps:[],    //负责人组件数据
                tableData:[],
                //单据类型下拉
                typeList: [
                    {
                        "billType": "FAC_MISSION_COMPLETE",
                        "billTypeName": "工单完成单"
                    },
                    {
                        "billType": "FAC_MISSION_ADJUST",
                        "billTypeName": "工单调整单"
                    },
                    {
                        "billType": "FAC_MISSION_DEFECTIVE",
                        "billTypeName": "工单次品单"
                    },
                    {
                        "billType": "FAC_MISSION_WASTE",
                        "billTypeName": "工单废品单"
                    }
                ],
                //审核上报人列表
                reportPeopleList:[],
                //审核操作下拉
                handleList:[
                    {
                        "type": "ALL",
                        "name": "全部"
                    },
                    {
                        "type": "REEDIT",
                        "name": "重编辑"
                    }
                ],
                //审核单据类型下拉
                documentTypeList:[
                    {
                        "type": "ALL",
                        "name": "全部"
                    },
                    {
                        "type": "UNEXCEEDED",
                        "name": "未超额单据"
                    },
                    {
                        "type": "EXCEEDED",
                        "name": "超额单据"
                    }
                ],
                dataInit: {
                    billType: '',       //单据类型
                    reporter: [],        //审核上报人
                    auditOperation: '',        //审核操作
                    auditBillType: '',    //审核单据类型
                    normalReviewer: [],     //审核人
                    antiReviewer: [],       //反审批准人
                }
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
        },
        watch:{
            isShow(val){
                if(val){
                    this.tableData = [];
                    this.getDialogData()
                }
            }
        },
        methods:{
            // 选择全部时候的操作
            selectChange(item, index){
                if(item.length > 1 && item.includes('ALL')){
                    //第一个值是“所有”，后面再选值时需要把“所有”删除
                    if(item[0] === 'ALL'){
                        item.splice(0,1);
                    }
                    //第一个选了其他值，那最后一个肯定是‘ALL’,此时只需要把其他值删除
                    else{
                        item = ['ALL'];
                    }
                    this.tableData[index].reporter = item;
                }
            },
            // 获取审核上报人列表
            getReportPeopleList() {
                let params = {
                    facId: this.facId,
                    groupIds: ['ALL'],
                    keyword: '',
                };
                workbays(params).then(res => {
                    if(res.data.code === 0){
                        this.reportPeopleList = res.data.data;
                        let factory = {id: 'ALL', userName: '全部'};
                        this.reportPeopleList.unshift(factory);
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 获取负责人列表
            fetchUnitUser() {
                let params = {
                    unitId: this.facId
                };
                getUnitUser(params).then(res => {
                    if(res.data.code === 0){
                        this.manListProps = res.data.data.facGroupDTOS;
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //关闭弹窗
            handleClose(){
                this.$emit("update:isShow", false);
            },
            //添加
            dialogDataAddGo() {
                this.tableData.push(JSON.parse(JSON.stringify(this.dataInit)));
            },
            //删除
            tableDataDel(data, index) {
                if (data.relConfigId) {
                    let params = {
                        unitId: this.facId,
                        userId: this.userId,
                        relConfigId: data.relConfigId
                    };
                    delReviewConfigMission(params).then(res =>{
                        if (res.data.code==0) {
                            this.tableData.splice(index, 1)
                        }
                        else{
                            this.$message.error(res.data.msg);
                        }
                    })
                }else{
                    this.tableData.splice(index, 1)
                }
            },
            //提交
            confirm() {
                let flag = true;
                this.tableData.forEach(item => {
                    if (!item.billType) {
                        flag = false;
                        this.$message.error('单据类型不能为空');
                    }else if(!item.reporter.length){
                        flag = false;
                        this.$message.error('审核上报人不能为空');
                    }else if(!item.auditOperation){
                        flag = false;
                        this.$message.error('审核操作不能为空');
                    }else if(!item.auditBillType){
                        flag = false;
                        this.$message.error('审核单据类型不能为空');
                    }else if(!item.normalReviewer.length){
                        flag = false;
                        this.$message.error('审核人不能为空');
                    }else if(!item.antiReviewer[0]){
                        flag = false;
                        this.$message.error('反审批准人不能为空');
                    }
                });
                if(flag){
                    let params = {
                        unitId: this.facId,
                        prcdTemplateNodeId: this.nodeId,
                        configs: this.tableData
                    };
                    billReviewConfigMission(params).then(res => {
                        if (res.data.code === 0) {
                            this.$emit("update:isShow", false);
                            this.$message.success('更新成功');
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    });
                }
            },
            //获取弹窗数据
            getDialogData(){
                let params = {
                    unitId: this.facId,
                    userId: this.userId,
                    prcdTemplateNodeId: this.nodeId
                };
                getReviewConfigMission(params).then(res => {
                    if(res.data.code === 0){
                        if(res.data.data.configs.length){
                            this.tableData = res.data.data.configs;
                        }else{
                            this.tableData.push(JSON.parse(JSON.stringify(this.dataInit)));
                        }
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        created(){
            this.fetchUnitUser();
            this.getReportPeopleList();
        }
    }
</script>

<style lang="scss" scoped>
    .audit-config{
        .dialogDataAdd {
            height: 32px;
            line-height: 32px;
            text-align: center;
            border: 1px solid #e0e6ed;
            border-top: none;
            cursor: pointer;
            color: #ff8d37;
        }
        .del-btn{
            font-size: 12px;
            color: #666;
            cursor: pointer;
        }
    }
</style>
<style lang="scss">
    .audit-config{
        .el-table td .cell {
            padding:0 8px;
        }
    }
</style>