<template>
    <div class="factoy-proces">
        <!-- 搜索 -->
        <div class="custom-filter-form box-shadow clearfix mgb8">
            <el-form :model="form" status-icon ref="ruleForm2" label-width="100px" class="demo-ruleForm"
                     style="margin-left:-40px">
                <el-col :span="8">
                    <el-form-item label="外发厂">
                        <el-select style="width: 100%"
                            v-model="form.outsideFactoryIds"
                            placeholder="请选择或搜索"
                            filterable
                            clearable
                            multiple>
                            <el-option
                                    v-for="item in supOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="欠款">
                        <el-select style="width: 100%"
                                   v-model="form.debt"
                                   clearable>
                            <el-option
                                    ref="addOption2"
                                    v-for="item in arrearsList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select> 
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <div class="btn-group">
                        <el-button class="btn btn-reset" @click="reset">重置</el-button>
                        <el-button class="btn btn-submit" @click="getFactoryPayList">筛选</el-button>
                    </div>
                </el-col>
            </el-form>
        </div>
        <!-- 表格 -->
        <div>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column prop="outsideFactoryName" label="外发厂" align="center"></el-table-column>
                <el-table-column prop="missionQuantity" label="总加工单数" align="center"></el-table-column>
                <el-table-column prop="goodsQuantity" label="总加工货品数" align="center"></el-table-column>
                <el-table-column prop="payable" label="累计应付" align="center"></el-table-column>
                <el-table-column prop="paid" label="已付" align="center"></el-table-column>
                <el-table-column prop="debt" label="欠款" align="center"></el-table-column>
                <el-table-column prop="dateEndPlan" label="操作" align="center" class-name="cellHeight">
                    <template slot-scope="scope">
                        <div class="opera">
                            <div class="blue" @click="getPay(scope.row.outsideFactoryId)">付款</div>
                            <div class="blue" @click="goDetail(scope.row.outsideFactoryId)">查看</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="form.pageNo" :page-size="20"
                           layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 付款弹窗 -->
        <payment-dialog :isShow.sync="isShow" :outsideFactoryId="outsideFactoryId" @getSuccess="getFactoryPayList"></payment-dialog>
    </div>
</template>
<script>
    import paymentDialog from './component/paymentDialog'
    import {factoryPayList,outsideFactoryListForSelect} from '@/api'

    export default {
        components: {paymentDialog},
        data() {
            return {
                outsideFactoryId:'',
                form: {
                    pageNo:1,
                    pageSize:20,
                    outsideFactoryIds: [],
                    debt: 0
                },
                arrearsList: [
                    {value: 0, label: '全部'},
                    {value: 1, label: '欠款为正'},
                    {value: 2, label: '欠款为0'},
                    {value: 3, label: '欠款为负'},
                ],
                tableData: [],
                currentPage: 0,
                totalCount: 0,
                isShow: false,
                supOptions:[]
            }
        },
        created() {
            this.getFactoryPayList()
            this.remoteMethod()
        },
        methods: {
            //供应商搜索
            remoteMethod() {
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    factoryId:JSON.parse(sessionStorage.getItem("last_login")).id,
                };
                outsideFactoryListForSelect(params).then(res => {
                    if (res.data.code === 0) {
                        this.supOptions = res.data.data;
                    }else{
                        this.supOptions = [];
                    }
                });
            },
            getFactoryPayList(){
                let obj = {
                    userId:JSON.parse(sessionStorage.getItem('user_login')).userId,
                    ...this.form
                }
                factoryPayList(obj).then(res=>{
                    this.tableData = res.data.data.list
                    this.totalCount = res.data.data.totalCount
                    console.log(res);
                })
            },
            reset(){
                this.form =  {
                    outsideFactoryIds: [],
                    debt: 0,
                    pageSize:20,
                }
            },
            // 分页
            handleCurrentChange() {
                this.getFactoryPayList()
            },
            // 付款
            getPay(id) {
                this.outsideFactoryId = id
                this.isShow = true
            },
            // 查看明细
            goDetail(id) {
                this.$router.push(`/reportManage/factoryProcesDetail?id=${id}`)
            }
        }
    }
</script>
<style lang="scss">
    .btn-group {
        text-align: right;
    }

    .cellHeight .cell {
        height: 100%;
        padding: 0;
    }

    .blue {
        .el-dropdown {
            .nf-button--default {
                border: none !important;
                color: #1CA1FF;
                text-decoration: underline;
            }
        }
    }
</style>
<style lang="scss" scoped>

    .factoy-proces {
        .opera {
            display: flex;
            /*justify-content: space-between;*/
            justify-content: center;
            align-items: center;
            /*padding: 0 24px;*/
            box-sizing: border-box;
            height: 100%;
        }
        .line {
            height: 32px;
            width: 1px;
            background-color: rgba(230, 234, 240, 1);
        }
        .blue {
            display: flex;
            /*justify-content: space-between;*/
            justify-content: center;
            align-items: center;
            color: #1CA1FF;
            text-decoration: underline;
            cursor: pointer;
            text-align: center;
            width: 100%;
            height: 100%;
            border-right: 1px solid #E6EAF0;
        }
        .page {
            margin: 20px 0;
            text-align: right;
            margin-right: 32px;
        }
    }
</style>



