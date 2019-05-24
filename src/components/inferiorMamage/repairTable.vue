<template>
    <div class="repair-table">
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    label="工单号"
                    width="180">
                <template slot-scope="scope">
                    <div v-if="scope.row.batchRow">
                        <span>批量选择</span>
                    </div>
                    <div v-else>
                        <span>{{scope.row.orderNo}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="款号"
                    width="140">
                <template slot-scope="scope">
                    <div v-if="scope.row.batchRow">
                        <span>-</span>
                    </div>
                    <div v-else>
                        <span>{{scope.row.styleNo}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="退回数量"
                    width="90">
                <template slot-scope="scope">
                    <div v-if="scope.row.batchRow">
                        <span>-</span>
                    </div>
                    <div v-else>
                        <span>{{scope.row.num}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="退回节点">
                <template slot-scope="scope">
                    <el-select
                            v-if="type === 'edit'"
                            placeholder="请选择"
                            filterable
                            clearable
                            @change="selectChange(scope.row, 'nodeId')"
                            v-model.trim="scope.row.nodeId">
                        <el-option
                                v-for="item in nodeList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-else-if="type === 'see'">{{scope.row.nodeName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="退回加工厂">
                <template slot-scope="scope">
                    <el-select
                            v-if="type === 'edit'"
                            placeholder="请选择"
                            filterable
                            clearable
                            @change="selectChange(scope.row, 'outsideFactoryId')"
                            v-model.trim="scope.row.outsideFactoryId">
                        <el-option
                                v-for="item in outsideFactoryList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-else-if="type === 'see'">{{scope.row.outsideFactoryName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="退回工位">
                <template slot-scope="scope">
                    <el-select
                            v-if="type === 'edit'"
                            placeholder="请搜索"
                            filterable
                            remote
                            clearable
                            :remote-method="remoteMethod"
                            @change="selectChange(scope.row, 'chargerId')"
                            v-model.trim="scope.row.chargerId">
                        <el-option
                                v-for="item in reportPeopleList"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                    <span v-else-if="type === 'see'">{{scope.row.chargerName}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {
        outsideFactoryListForSelect,
        workbays,
    } from '@/api';
    import {
        quantityDetails,
    } from '@/api/inferiorMamage';
    export default {
        name: "repairTable",
        props:['type','tableData'],
        /******************
         *
         * type: eidt 编辑状态
         *       see 查看状态
         *
         *
         * ********************/
        data(){
            return{
                batchRowData: {
                    orderNo: '',
                    styleNo: '',
                    num: '',
                    nodeId: '',
                    nodeName: '',
                    outsideFactoryId: '',
                    outsideFactoryName:'',
                    chargerId:'',
                    chargerName:'',
                    batchRow: true,
                },
                nodeList:[],                //退回节点下拉
                outsideFactoryList:[],      //退回工厂下拉
                reportPeopleList:[],             //退回工位下拉
                timer: '',
            }
        },
        watch:{
            tableData(arr){
                //编辑状态给表格最前面加批量操作行
                if(this.type === 'edit' && arr.length && !arr[0].batchRow){
                    arr.unshift(this.batchRowData);
                }
            }
        },
        methods:{
            //工位搜索
            remoteMethod(query) {
                if(this.timer){
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    let params = {
                        facId: this.$common.facId(),
                        groupIds: ['ALL'],
                        keyword: query,
                    };
                    workbays(params).then(res => {
                        if(res.data.code === 0){
                            this.reportPeopleList = res.data.data;
                        }else{
                            this.reportPeopleList = [];
                            this.$message.error(res.data.msg)
                        }
                    })
                }, 200);
            },
            //下拉选择
            selectChange(row, val){
                //批量行下拉选择后，给同列赋相同的值
                if(row.batchRow){
                    let batchRowValue = row[val];   //批量行选择的值
                    this.tableData.forEach(item => {
                        if(!item.batchRow){
                            item[val] = '';
                            item[val] = batchRowValue
                        }
                    })
                }
            },
            //外发厂下拉列表
            getOutsideFactoryList(){
                let params= {
                    userId: this.$common.userId(),        // 用户id
                    factoryId: this.$common.facId(),        // 当前所在工厂id
                };
                outsideFactoryListForSelect(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList = res.data.data;
                        //加一个本厂对象
                        let factory = {id: 'ALL', name: '本厂'};
                        this.outsideFactoryList.unshift(factory);
                    }
                })
            },
            // 节点下拉列表
            getNodeLIst(keyword = '') {
                const params = {
                    unitId: this.$common.facId(),
                    keyword: keyword
                };
                quantityDetails(params).then(res => {
                    if(res.data.code === 0){
                        this.nodeList = res.data.prcdNodes;
                    }
                });
            },

        },
        created(){
            this.getOutsideFactoryList();
            this.getNodeLIst();
            this.remoteMethod('');
        }
    }
</script>

<style lang="scss" scoped>
    .repair-table{
        .el-table--fit{
            border-right: 1px solid rgb(223, 228, 236);
            border-bottom: 1px solid rgb(223, 228, 236);
        }
        .el-select{
            .el-input__inner{
                border:none;
            }
        }
    }
</style>
<style lang="scss">
    .repair-table{
        .el-select{
            .el-input__inner{
                border:none;
            }
        }
    }
</style>