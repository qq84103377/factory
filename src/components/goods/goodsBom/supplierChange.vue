<template>
    <div class="supplier-change">
        <el-dialog
                title="更换/新建供应商"
                :visible.sync="visible"
                class="custom-dialog supplier-dialog"
                size="tiny"
                :modal-append-to-body="false"
                @close="cancel">
            <el-table
                    class="custom-table"
                    border
                    max-height="200"
                    :data="supplierData">
                <el-table-column
                        width="160"
                        property="supplierName"
                        label="供应商">
                </el-table-column>
                <el-table-column
                        width="90"
                        property="supplierStyleNo"
                        label="供应商款号">
                </el-table-column>
                <el-table-column
                        width="90"
                        property="supplierColorNo"
                        label="供应商色号">
                </el-table-column>
                <el-table-column
                        sortable
                        property="planCost"
                        label="参考单价【元/采购单位】">
                    <template slot-scope="scope">
                        <div>{{scope.row.planCost}}<span v-show="scope.row.planCost">元/{{materialRow.purchaseUnitName}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        property="planCost"
                        label="不含税价【元/采购单位】">
                    <template slot-scope="scope">
                        <div>{{scope.row.excludingTaxPrice}}<span v-show="scope.row.excludingTaxPrice">元/{{materialRow.purchaseUnitName}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="50"
                        label="选择">
                    <template slot-scope="scope">
                        <el-radio v-model="selectedSupplierId" :label="scope.row.supplierId"><span></span></el-radio>
                    </template>
                </el-table-column>
            </el-table>
            <div class="tips">给此物料添加新供应商</div>
            <el-table
                    class="custom-table no-hover-highlight"
                    border
                    :data="newSupplierData">
                <el-table-column
                        width="160"
                        label="* 供应商">
                    <template slot-scope="scope">
                        <el-select
                                v-model="scope.row.supplierId"
                                placeholder="请选择或搜索"
                                filterable
                                remote
                                :remote-method="remoteMethod"
                                :loading="loading"
                                @change="getSupplierName">
                            <el-option :value="''" disabled style="cursor:pointer;">
                                <div style="color: #ff9c38;" @click="showAddSupplier">新建</div>
                            </el-option>
                            <el-option
                                    v-for="item in supOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                        width="90"
                        label="供应商款号">
                    <template slot-scope="scope">
                        <input placeholder="选填" v-model.trim="scope.row.supplierStyleNo">
                    </template>
                </el-table-column>
                <el-table-column
                        width="90"
                        label="供应商色号">
                    <template slot-scope="scope">
                        <input placeholder="选填" v-model.trim="scope.row.supplierColorNo">
                    </template>
                </el-table-column>
                <el-table-column
                        label="参考单价【元/采购单位】">
                    <template slot-scope="scope">
                        <input style="width: 80px;" placeholder="选填" v-model.trim="scope.row.planCost" type="number" step="0.01">
                        <span>元/{{materialRow.purchaseUnitName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="不含税价【元/采购单位】">
                    <template slot-scope="scope">
                        <input style="width: 80px;" placeholder="选填" v-model.trim="scope.row.excludingTaxPrice" type="number" step="0.01">
                        <span>元/{{materialRow.purchaseUnitName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="50">
                    <template slot-scope="scope">
                        <span class="supplier-btn" @click="addSupplier(scope.row)">添加</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer text-right">
                <el-button @click="cancel">取 消</el-button>
                <el-button   type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add-material-supplier
                    style="z-index:2050"
                    v-if="addSupplierVisible"
                    type="add"
                    :supplierName="remoteSupplierName"
                    @update="addSupplierSuccess"
                    @hiddenWindow="cancelAddSupplier"
                    @hideCover="cancelAddSupplier">
            </add-material-supplier>
        </transition>
        <transition name="opcity">
            <div class="cover" style="z-index:2049" v-if="addSupplierVisible" @click="cancelAddSupplier"></div>
        </transition>
    </div>
</template>

<script>
    import {
        searchSupplier,
        updateMaterialsSkuSupplier,
        getMaterialsSkuSupplierList,
    } from '@/api/material.js'
    import addMaterialSupplier from '@/components/material/materialSupplier/add.vue';

    export default {
        name: "supplierChange",
        props:['materialRow','visible'],
        /**********************************
            parentSupplier: 供应商数组
            materialRow: 选中的一条物料数据
            visible:弹窗是否可见
        ***********************************/
        data(){
            return{
                selectedSupplierId:'',
                supOptions: [],         //供应商列表
                supplierObj: {},        //所选供应商对象
                loading: false,
                supplierData:[],        //供应商表格数据
                newSupplierData:[
                    {
                        supplierId: '',
                        supplierName: '',
                        supplierStyleNo: '',
                        supplierColorNo: '',
                        planCost:'',
                        excludingTaxPrice:''
                    }
                ],
                addSupplierVisible:false,// 新建供应商弹窗是否可见
            }
        },
        computed:{
            unitId: function(){
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId: function(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            }
        },
        components: {
            addMaterialSupplier
        },
        watch:{
            visible(val){
                if(val){
                    console.log(this.materialRow,111)
                    this.selectedSupplierId = this.materialRow.supplierId
                    this.getTableData()
                }

            }
        },
        methods:{
            // 点击了新建供应商
            showAddSupplier(){
                this.addSupplierVisible = true
                $('.el-select-dropdown').hide()
            },
            // 取消添加供应商
            cancelAddSupplier(){
              this.addSupplierVisible = false
            },
            //供应商搜索
            remoteMethod(query) {
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let params = {
                            unitId: this.unitId,
                            keyword: query
                        };
                        searchSupplier(params).then(res => {
                            if (res.data.code === 0) {
                                this.supOptions = res.data.data;
                            }else{
                                this.supOptions = [];
                            }
                        });
                    }, 200);
                } else {
                    this.supOptions = [];
                }
            },
            //新建供应商成功
            addSupplierSuccess(val){
                this.supOptions.push(val)
                this.newSupplierData[0].supplierId = val.id;
            },
            //获取供应商列表数据
            getTableData(){
                let params = {
                    materialsSkuId:this.materialRow.materialsSkuId
                };
                getMaterialsSkuSupplierList(params).then(res => {
                    if (res.data.code === 0) {
                        this.supplierData = res.data.data;
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //获取select选择的供应商名称
            getSupplierName(){
                if(this.supOptions){
                    this.supOptions.forEach(item =>{
                        if(item.id === this.newSupplierData[0].supplierId){
                            this.newSupplierData[0].supplierName = item.name;
                        }
                    })
                }
            },
            //向该物料sku添加供应商
            addSupplier(row){
                if(row.supplierId === ''){
                    this.$message.error("供应商不能为空");
                    return
                }
                let isExist = this.supplierData.some(item => item.supplierId == row.supplierId)
                if(isExist){
                    this.$message.error("该物料sku已有此供应商");
                    return
                }
                let params = {
                    userId: this.userId,
                    materialsSkuId:this.materialRow.materialsSkuId,
                    supplierId: row.supplierId,
                    supplierStyleNo: row.supplierStyleNo,
                    supplierColorNo: row.supplierColorNo,
                    planCost: row.planCost,
                    excludingTaxPrice:row.excludingTaxPrice
                };
                updateMaterialsSkuSupplier(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success('添加成功');
                        this.newSupplierData=[
                            {
                                supplierId: '',
                                supplierName: '',
                                supplierStyleNo: '',
                                supplierColorNo: '',
                                planCost:'',
                                excludingTaxPrice:''
                            }
                        ],
                        this.selectedSupplierId = res.data.data.supplierId
                        this.supplierData.push(res.data.data)


                    }else{
                        this.$message.error(res.data.msg);
                    }
                });

            },
            // 点击取消
            cancel(){
                this.supplierData = []
                this.newSupplierData=[
                    {
                        supplierId: '',
                        supplierName: '',
                        supplierStyleNo: '',
                        supplierColorNo: '',
                        planCost:'',
                        excludingTaxPrice:''
                    }
                ]
                this.$emit('update:visible',false)
            },
            // 点击确定
            confirm(){
                if(!this.selectedSupplierId){
                    this.$message.error('请选择供应商')
                    return
                }
                this.$emit('update:visible',false)
                let supplierInfo = this.supplierData.find(item => item.supplierId == this.selectedSupplierId)
                this.$emit('confirm', supplierInfo);
            }
        },
        created(){
        }
    }
</script>

<style lang="scss">
    .supplier-change{
        .supplier-dialog{
            .el-dialog--tiny{
                width: 800px;
                .el-table__body-wrapper{
                    overflow-x: hidden;
                    .el-table__row{
                        .cell{
                            line-height: 32px;
                        }
                        .el-select{
                            .el-input{
                                input{
                                    border: none;
                                }
                            }
                        }
                        input{
                            width: 100%;
                            font-size: 12px;
                        }

                    }
                    .supplier-btn{
                        font-size: 12px;
                        color:#FFA914;
                        cursor: pointer;
                    }
                }
                .tips{
                    margin: 20px 0 10px;
                    font-size: 12px;
                    color: #A2ABB8;
                }
            }
        }
    }
</style>
