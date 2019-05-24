<template>
    <div class="custom-filter-form">
        <el-form style="margin-left: -20px" :model="form" status-icon ref="form" label-width="100px"
                 class="demo-ruleForm">
            <el-row>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item :label="$route.query.type==='pickUpDelivery'?'业务员':'采购员'" required>
                        <workerLeader :single="'single'" v-model="form.purchaserId"
                                      :placeholder="'请选择或搜索采购员'"></workerLeader>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item label="采购日期" required>
                        <el-date-picker  @change="datePurchaseChange" format="yyyy-MM-dd" v-model="form.datePurchase" type="date" placeholder="请选择日期"
                                        :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6">
                    <el-form-item v-if="!isSampleMaterial" label="预计货期">
                        <el-date-picker @change="expectDateEndChange" format="yyyy-MM-dd" v-model="form.expectDateEnd"
                                        type="date" placeholder="请选择日期" :picker-options="pickerOptions0">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6" v-if="$route.query.type==='pickUpDelivery'">
                    <el-form-item label="物料仓库">
                        <el-select v-model="form.storehouseId" placeholder="请选择仓库">
                            <el-option
                                    v-for="item in store"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6" v-if="$route.query.type==='pickUpDelivery'">
                    <el-form-item label="送料工厂">
                        <el-select v-model="form.outsideFactoryId" placeholder="请选择或搜索"  filterable remote :remote-method="getFactorys">
                            <el-option
                                    v-for="item in facList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="12" :md="8" :lg="6" v-if="$route.query.type!=='pickUpDelivery'">

                    <el-form-item label="直接到料">
                        <el-checkbox v-model="form.directArrive"
                                     style="position: absolute;margin-left: -82px;margin-top: -2px;"></el-checkbox>
                        <el-select v-model="form.storehouseId" v-show="form.directArrive" placeholder="请选择到料仓库" clearable filterable>
                            <el-option
                                    v-for="item in store"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
    import {storeList, getPersonList,getFactorys} from '../../../../api/api.js'
    import DesignStyleNoSelect from "../../../Common/custom-select/designStyleNoSelect";

    const fun = require('../../../Common/commonFun.js')
    export default {
        props: ['isSampleMaterial'],
        data() {
            return {

                form: {
                    directArrive: false,
                    storehouseId: '',
                    outsideFactoryId: '',
                    datePurchase: fun.dateFormatter(new Date(), false),
                    expectDateEnd: '',
                    purchaserId: '',
                },
                facList: [],
                store: [],
                storeName: '',
            }
        },
        components: {
            DesignStyleNoSelect,
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch: {
            form: {
                handler(val, old) {
                    this.$emit('formData', this.form);
                },
                deep: true
            },
        },
        methods: {
            // 送料工厂下拉
            getFactorys(key = "") {
                let params = {
                    userId: this.userId,
                    key: key
                }
                getFactorys(params).then(res => {
                    this.facList = res.data.data
                })
            },
            //采购员默认选择当前登录用户
            getPurchasePersionId() {
                this.form.purchaserId = this.userId;
            },
            // 预计货期改变
            expectDateEndChange(val) {
                this.form.expectDateEnd =val? fun.dateFormatter(val, false):''
            },
            // 采购日期改变
            datePurchaseChange(val) {
                this.form.datePurchase =val? fun.dateFormatter(val, false):''
            },
            // 获取参考列表
            storeList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id
                };
                storeList(params).then(res => {
                    if (res.data.code == 0) {
                        this.store = res.data.storehouses || [];
                        this.store.forEach(i => {
                            if (i.defaultTag) {
                                this.form.storehouseId = i.id;
                                this.storeName = i.name;
                            }
                        })
                        if (this.store.length === 1) {
                            this.form.storehouseId = res.data.storehouses[0].id;
                            this.storeName = res.data.storehouses[0].name;
                        }
                    }

                });
            },
        },
        mounted() {

        },
        created() {
            this.getFactorys();
            this.storeList();
            this.getPurchasePersionId();
        }
    }
</script>

<style lang="scss" scoped>
    .custom-filter-form {
        padding: 24px 24px 0;
        background-color: #fff;
        .red-star:before {
            position: absolute;
            top: 12px;
            left: -11px;
            content: '*';
            color: #ff4949;
            margin-right: 4px;
            font-size: 14px;
        }
    }
</style>
<style lang="scss">
</style>


