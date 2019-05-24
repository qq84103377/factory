<template>
    <div class="review-opinions-dialog">

        <el-dialog
                :visible.sync="visible"
                title="评审意见"
                custom-class="custom-dialog"
                @close="hideDialog"
                :modal-append-to-body="false"
                center="true">
            <!--<review-opinions-table -->
            <!--:tableData="tableData"-->
            <!--:editItemIndex.sync="editItemIndex"-->
            <!--@cancelEdit="handleCancelEdit"-->
            <!--@deleteItem="handleDeleteItem"-->
            <!--@addItem="handleAddItem"-->
            <!--@sureAdd="handleSureAdd"-->
            <!--&gt;-->
            <!--</review-opinions-table>-->
            <div class="review-opinions-table">
                <el-table
                        v-loading="loading"
                        border
                        :data="tableData"
                        empty-text=" "
                        style="width: 100%">
                    <el-table-column width="60" label="评审人" prop="reviewerName">
                    </el-table-column>
                    <el-table-column width="80" label="评审操作" prop="reviewStatusName">
                    </el-table-column>
                    <el-table-column label="评审意见" class-name='no-padding'>
                        <template slot-scope="scope">
                            <div v-if="scope.row.isEdit">
                                <el-input :id="scope.$index" v-model.trim="scope.row.message" placeholder="请输入"></el-input>
                            </div>
                            <div class="input-read" v-else>{{scope.row.message}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="180" label="节点名称" prop="nodeName" v-if="designStyleId">
                    </el-table-column>
                    <el-table-column width="180" label="最后更新时间" prop="dateUpdated">
                    </el-table-column>
                    <el-table-column width="140" label="最后更新人" prop="lastUpdateName">
                    </el-table-column>
                    <el-table-column
                            width="88"
                            class-name=operations-cell
                            label="操作">
                        <template slot-scope="scope">
                            <div class="action-btn">
                                <div class="blue" v-if="!scope.row.isEdit" @click="editItem(scope.$index)">编辑</div>
                                <div class="gray" v-else @click="cancelItem(scope.$index)">取消</div>
                                <div class="red" v-if="!scope.row.isEdit" @click="deleteItem(scope.$index)">删除</div>
                                <div class="orange" v-if=" scope.row.isEdit" @click="saveItem(scope.$index)">确定</div>
                            </div>
                        </template>
                    </el-table-column>
                    <template slot="append">
                        <div @click="addRow" class="orange pdtb15 pdl15">+添加</div>
                    </template>
                </el-table>
            </div>
        </el-dialog>
    </div>

</template>
<script>
    import {
        designWorkbenchReviewOpninoinsList,
        designWorkbenchReviewOpninoinsUpdate,
        designWorkbenchReviewOpninoinsDelete
    } from '@/api/sample-centre';

    export default {
        props: ['missionPrcdNodeId', 'visible','designStyleId','nodeType'],
        components: {
        },
        data() {
            return {
                tempMsg: '',
                tableData: [],
                newRow: {
                    message: '',
                    dateUpdated: '',
                    reviewerName: '',
                    isEdit: true
                },
                // 记录最新的评审意见，回传到列表
                lastMessage:'',
                editingItem:{}
            }
        },
        methods: {
            // 获取列表数据
            async initData() {
                let params =  {
                    id: this.designStyleId,
                    type: this.nodeType
                }
               await designWorkbenchReviewOpninoinsList(params).then(res => {
                    if (res.data.code == 0) {
                        this.tableData = res.data.data
                    }
                })
            },
            // 添加行
            addRow(){
                this.tableData.push( {
                    message: '',
                    dateUpdated: '',
                    reviewerName: '',
                    isEdit: true
                })
            },
            editItem(index){
                this.$set(this.tableData[index],'isEdit',true)
                this.editingItem = this.tableData[index]
                this.tempMsg = this.tableData[index].message
                console.log(this.editItem,555555)
            },
            cancelItem(index){
                // 新建的空白行直接删除
                if(!this.tableData[index].reviewerId){
                    this.tableData.splice(index,1)
                } else{
                    this.$set(this.tableData[index],'isEdit',false)
                    this.$set(this.tableData[index],'message',this.tempMsg)
                }
            },
            deleteItem(index){
                if(this.tableData[index].reviewStatusName) {
                    return this.$message.error('无法删除有评审操作的记录')
                }
                let params = {
                    reviewLogId: this.tableData[index].reviewLogId
                }
                designWorkbenchReviewOpninoinsDelete(params).then(res => {
                    if (res.data.code == 0) {
                        this.tableData.splice(index,1)
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            saveItem(index){
                let params = {
                    reviewStatus: this.tableData[index].reviewStatus,
                    message: this.tableData[index].message,
                    reviewLogId: this.tableData[index].reviewLogId,
                    missionPrcdNodeId: [this.missionPrcdNodeId],
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                }
                designWorkbenchReviewOpninoinsUpdate(params).then(res => {
                    if (res.data.code == 0) {
                        this.$set(this.tableData[index],'dateUpdated',res.data.data[0].dateUpdated)
                        this.$set(this.tableData[index],'isEdit',false)
                        this.$set(this.tableData[index],'reviewLogId',res.data.data[0].id)
                        this.$set(this.tableData[index],'reviewerName',res.data.data[0].reviewerName)
                        this.$set(this.tableData[index],'nodeName',res.data.data[0].nodeName)
                        this.$set(this.tableData[index],'lastUpdateName',res.data.data[0].lastUpdateName)
                        this.$message.success('编辑成功')

                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 关闭弹窗前，获取一次评审意见列表，取出最新对一条数据对message回传给列表
            async hideDialog(){
                await this.initData()
                let lastMessage = this.tableData.length?this.tableData[this.tableData.length-1].message:''
                this.$emit('update:visible',false)
                this.$emit('hideDialog',this.missionPrcdNodeId,lastMessage)
            }
        },
        created(){
            this.initData()
        }
    }
</script>
<style lang="scss">
    .review-opinions-dialog{
        .el-table__empty-block {
            min-height: 0;
        }
        .el-table{
            font-size: 12px;
            .cell{
                padding: 0 8px;
            }
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td{
            background-color: #fff;
        }
        td.no-padding,
        td.operations-cell{
            .cell{
                padding: 0 ;
            }
        }
        td.operations-cell{
            .cell{
                height: 100%;
                line-height: 100%;
            }
        }
        .el-input__inner{
            border: none;
            background-color: #F5F7FA;
        }
    }
</style>
<style lang="scss" scoped>
 .review-opinions-dialog{

     .input-read{
         padding: 0 8px;
     }
     .action-btn{
         display: flex;
         width: 100%;
         height: 100%;
         font-size: 12px;
         div{
             display: flex;
             height: 100%;
             flex: 1;
             cursor: pointer;
             align-items: center;
             justify-content: center;
             text-align: center;
             &:first-child{
                 border-right: 1px solid #E6EAF0;
             }
         }
     }
 }
</style>
