<template>
    <div class="materialList-financial">
        <content-wrap title="财务收支">
            <span>{{title}}：<span :style="{'color':title == '应付金额'? '#438DF1':'#FA4150'}">￥{{(money*1).toFixed(2)}}</span></span>
        </content-wrap>
        <!--表格-->
        <div class="materialList-financial-table">
            <el-table
                    :data="tableData3"
                    border
                    >
                <!--流水号-->
                <el-table-column
                        align="center"
                        prop="date"
                        label="流水号"
                        width="180">
                    <template slot-scope="scope">
                        <div>
                            <el-input v-model="form.journalAccountCode" placeholder="不填则自动生成"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <!--流水时间-->
                <el-table-column
                        align="center"
                        prop="name"
                        label="流水时间"
                        width="180">
                    <template slot-scope="scope">
                        <div>
                            <el-date-picker
                                    v-model="form.dateCreatedBegin"
                                    type="date"
                                    placeholder="不填则自动生成"
                                    :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                    </template>

                </el-table-column>
                <!--收支类型-->
                <el-table-column
                        align="center"
                        width="100"
                        label="收支类型">
                    <template slot-scope="scope">
                        <div>
                            <span>{{title=='应付金额'?'付款':'收款'}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--供应商-->
                <el-table-column
                        align="center"
                        min-width="120"
                        label="供应商">
                    <template slot-scope="scope">
                        <div>
                            <span>{{supplierNameWatch}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--账户-->
                <el-table-column
                        align="center"
                        width="160"
                        label="账户">
                    <template slot-scope="scope">
                        <div>
                            <el-select v-model="form.remitMethodId" placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in options"
                                        :key="index"
                                        :label="item.remitMethodName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <!--收支金额-->
                <el-table-column
                        align="center"
                        width="100"
                        label="收支金额">
                    <template slot-scope="scope">
                        <div>
                            <el-input v-model="form.journalAccountAmount" placeholder="请输入"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <!--业务员-->
                <el-table-column
                        align="center"
                        width="160"
                        label="业务员">
                    <template slot-scope="scope">
                        <div class="block">
                            <el-cascader
                                    v-model="salesmanValue"
                                    @change="isChange"
                                    filterable
                                    :placeholder="'搜索试试'"
                                    :options="remitMethod"
                                    :show-all-levels="false"
                            ></el-cascader>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {getUnitsUsers, queryList,getNeedPayNeedReceiveOrderByMaterialArriveOrderId} from '../../../api/api.js'

    export default {
        name: "materialList-financial",
        props: {
            // 财务收支应付或应收的标题
            title: {
                type: String,
                default: ''
            },
            // 财务收支应付或应收的金额
            money: {
                type: Number,
                default: ''
            },
            // 供应商名字
            supplierName: {
                type: String,
                default: ''
            },

        },
        computed:{
            // 供应商名字
            supplierNameWatch(){
                console.log(this.supplierName);
                console.log(2222);
                return this.supplierName
            }
        },
        watch: {
            // 获取当前点击选中的供应商名称
            form: {//深度监听，可监听到对象、数组的变化
                handler(val) {
                    console.log(val,'ttt')
                    this.options.forEach((v, i) => {
                        if (v.id == val.remitMethodId) {
                            this.form.remitMethodName = v.remitMethodName
                        }
                    })
                    this.$emit('financial', this.form)
                },
                deep: true
            },

        },
        data() {
            return {
                supplierName: '',//供应商名称
                form: {
                    supplierId: this.supplier,//供应商id
                    remitMethodId: "",//银行卡id
                    journalAccountAmount: "",//收支金额
                    payOrReceiveAmount: this.money,//应付或应收金额
                    remitMethodName: "",//银行卡名称
                    journalAccountCode: "",//流水单号
                    dateCreatedBegin: "",//流水时间
                    salesmanName: '',//业务员名称
                    salesmanId: '',//业务员id
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                remitMethod: [],//业务员数据
                options: [],//账户下拉数据
                tableData3: [{
                    date: '',
                    name: '',
                    address: ''
                }],
                salesmanValue: [],//业务员默认选中
            }
        },
        created() {
            this.queryList();//账户下拉数据
            this.remitMethods();//本厂业务员下拉数据
            // this.getNeedPayNeedReceiveOrderByMaterialArriveOrderId(); 重编辑需不需要选中收支先注释
        },
        methods: {
            //倒料、退料、采购详情对冲核销详情数据
            getNeedPayNeedReceiveOrderByMaterialArriveOrderId() {
                let params = {
                    billMaterialArriveId: this.$route.query.id
                };
                getNeedPayNeedReceiveOrderByMaterialArriveOrderId(params).then(res => {
                    if (res.data.code == 0) {
                        if (res.data.data) {
                            if(res.data.data.journalAccountDTOList&&res.data.data.journalAccountDTOList[0]){
                                let data =  res.data.data.journalAccountDTOList[0]
                                this.form.journalAccountCode= data.journalAccountCode
                                this.form.dateCreatedBegin= data.dateCreated
                                this.form.journalAccountAmount= data.journalAccountAmount
                                // 循环选中当前的操作人
                                let userId = data.createrId;//当前业务的id
                                console.log(this.remitMethod);
                                this.remitMethod.forEach((v, index) => {
                                    v.facUserDTOS.forEach((v1, i) => {
                                        if (v1.userId == userId) {
                                            this.salesmanValue.push(v.value, v.children[i].value)
                                            this.form.salesmanId = v1.userId
                                            this.form.salesmanName = v1.userName
                                        }
                                    })
                                })
                                this.form.salesmanName= data.creater
                                this.form.remitMethodId= data.remitMethodId
                            }

                        }
                    }
                })
            },
            // 业务员选中的id和值
            isChange(val) {
                console.log(val);
                this.form.salesmanId = this.remitMethod[val[0]].facUserDTOS[val[1]].userId;//业务员id
                this.form.salesmanName = this.remitMethod[val[0]].facUserDTOS[val[1]].userName;//业务员名称
            },
            // 业务员下拉数据
            remitMethods() {
                let params = {
                    unitIds: [JSON.parse(sessionStorage.getItem("last_login")).id],//当前工厂id
                    facId: JSON.parse(sessionStorage.getItem("last_login")).id,//登录工厂id
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                };
                getUnitsUsers(params).then(res => {
                    if (res.data.code === 0) {
                        this.remitMethod = res.data.data.facGroupDTOS
                        this.remitMethod.forEach((v, index) => {
                            v.children = []
                            v.value = index
                            v.label = v.groupName
                            v.facUserDTOS.forEach((v2, i) => {
                                let dataList = {
                                    label: v2.userName,
                                    value: i
                                }
                                v.children.push(dataList)
                            })
                        })

                        // 循环选中当前的操作人
                        // if(!this.$route.query.id ||this.$route.query.type){  重编辑需不需要选中收支先注释
                            let userId = JSON.parse(sessionStorage.getItem("user_login")).userId;//当前业务的id
                            this.remitMethod.forEach((v, index) => {
                                v.facUserDTOS.forEach((v1, i) => {
                                    if (v1.userId == userId) {
                                        this.salesmanValue.push(v.value, v.children[i].value)
                                        this.form.salesmanId = v1.userId
                                        this.form.salesmanName = v1.userName
                                    }
                                })
                            })
                        // }

                        console.log(this.salesmanValue,'!!!!!');
                    }
                })
            },
            // 账户下拉数据
            queryList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,//当前工厂id
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId,//用户id
                };
                queryList(params).then(res => {
                    if (res.data.code === 0) {
                        this.options = res.data.data
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .materialList-financial {

    }
</style>
<style lang="scss">
    .materialList-financial {
        .content_wrap--head, .content_wrap--content {
            display: inline-block;
        }
        .content_wrap--head {
            margin-right: 32px;
        }
        .el-input__inner {
            border: none;
        }
        .el-input__inner:hover {
            background-color: rgb(238, 240, 246);
        }
        .el-table--enable-row-hover .el-table__body tr:hover > td .el-input__inner {
            background-color: rgb(238, 240, 246);
        }
    }
</style>
