<template>
    <div class="inventory">
        <div class="inventory-table">
            <el-row>
                <el-table class="custom-table"
                        :data="listInfo"
                        stripe
                        border
                        empty-text="暂无物料库存数据"
                        @selection-change="handleSelectionChange"
                        @row-click="getDetaile">
                    <el-table-column
                            prop="materialsKindName"
                            label="分类">
                    </el-table-column>
                    <el-table-column
                            label="图片"
                            width="120">
                        <template slot-scope="scope">
                            <div>
                                <img style="width: 80px;height: 40px;margin-top: 8px;"
                                     v-if="scope.row.commonMaterialsPictureList && scope.row.commonMaterialsPictureList.length"
                                     @click="imgList(scope.row)"
                                     :src="scope.row.commonMaterialsPictureList?scope.row.commonMaterialsPictureList[0].path:''"
                                     alt="">
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="materialsNo"
                            label="物料款号"
                            width="100">
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--prop="supplierName"-->
                            <!--label="供应商"-->
                            <!--width="120">-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="supplierName"
                            label="样料"
                            width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.sampleMaterial?'样料':''}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--prop="styleColor"-->
                            <!--label="供应商款号/色号"-->
                            <!--width="140">-->
                    <!--</el-table-column>-->
                    <el-table-column
                            prop="materialsName"
                            label="物料名称"
                            width="110">
                    </el-table-column>
                    <el-table-column
                            prop="colorName"
                            label="颜色">
                    </el-table-column>
                    <el-table-column
                            prop="specificationsNo"
                            label="规格"
                    >
                        <template slot-scope="scope">
                          <span v-if="scope.row.specificationsRemark&&scope.row.specificationsRemark.length>0">{{scope.row.specificationsRemark}}</span>
                          <span v-else>{{scope.row.specificationsNo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="300px"
                            show-overflow-tooltip
                            prop="styleNo"
                            label="关联商品款号"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="stockUnitName"
                            label="库存单位"
                    >
                    </el-table-column>
                    <el-table-column
                            prop="position"
                            label="仓位"
                    >
                    </el-table-column>
                    <el-table-column
                            label="生产参考余料">
                        <template slot-scope="scope">
                            <div class="reference-remain">
                                <span @click="handleDialogShow(scope.row)">{{scope.row.referenceRemainQuantity}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            prop="stock"
                            label="库存数"
                    >
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="cz"
                            label="操作"
                            fixed="right"
                            width="360">
                        <template slot-scope="scope">
                            <div class="btn-wrap fs12">
                                <el-button type="text" @click="handleSingleStock(scope.row,'1')">
                                    <icon type="icon-storage"></icon>
                                    入库
                                </el-button>
                                <el-button type="text" @click="handleSingleStock(scope.row,'2')">
                                    <icon type="icon-outroom"></icon>
                                    出库
                                </el-button>
                                <el-button type="text" @click="handleSingleStock(scope.row,'3')">
                                    <icon type="icon-adjust"></icon>
                                    调整
                                </el-button>
                                <el-button type="text" @click="handleEditStock(scope.row)">
                                    <icon type="icon-edit"></icon>
                                    编辑仓位
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                </el-table>
                <!--入库、出库、调整通用弹窗-->
                <el-dialog :title="title" :visible.sync="dialogForm1" @close="closeSingleForm1('ruleForm')">
                    <el-form
                            :model="formChange"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="100px"
                    >
                        <template v-if="this.type === '3'">
                            <p class="form3-title">当前库存数 {{listData.stock}}</p>
                        </template>

                        <el-form-item :label="labelNumber" prop="number">
                            <el-input v-model.trim="formChange.number" :placeholder="placeholder"></el-input>
                        </el-form-item>
                        <el-form-item :label="labelDate" prop="date">
                            <el-date-picker
                                    @change="changeCreateDate"
                                    v-model="formChange.date"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="labelRemarks">
                            <el-input
                                    type="textarea"
                                    :rows="3"
                                    placeholder="选填"
                                    v-model.trim="formChange.remarks">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="closeSingleForm1('ruleForm')">取 消</el-button>
                        <el-button type="primary" @click="singleChange('ruleForm')" :loading="isloading">确 定</el-button>
                    </div>
                </el-dialog>
                <!--编辑弹窗-->
                <el-dialog :title="title" :visible.sync="dialogForm2">
                    <el-form
                            :model="formEdit"
                            label-width="90px"
                    >
                        <el-form-item label="仓位">
                            <el-input v-model.trim="formEdit.position" placeholder="选填"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="closeSingleForm2">取 消</el-button>
                        <el-button type="primary" @click="singleEdit" :loading="isloading">确 定</el-button>
                    </div>
                </el-dialog>
            </el-row>
            <el-row>
                <div class="supplier-page">
                    <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page.sync="pageInfo.currentPage"
                            :page-size="pageInfo.pageSize"
                            :total="pageInfo.totalCount"
                            layout="total, prev, pager, next">
                    </el-pagination>
                </div>
            </el-row>

        </div>
        <!--//图片预览-->
        <imgPreview  @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible" :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>

        <remain-dialog
                :visible.sync="showDialog"
                :skuId="skuId"
                :materialName="materialName">
        </remain-dialog>

    </div>

</template>

<script>
    import {
        singleChangeStock,
        singleEditStock
    } from "@/api";
    import remainDialog from "@/components/material/materialInventory/remainDialog";
    export default {
        name: "inventory-table",
        components: {
            remainDialog,
        },
        props: ['listInfo', 'pageInfo', 'filterData'],
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                dialogForm1: false,
                dialogForm2: false,
                type: '',                //当前显示的弹窗 1入库，2出库，3调整
                listData: {},            //点击操作时，当行的数据
                formChange: {},          //入库、出库、调整共用的数据
                formEdit: {},            //编辑仓位的数据
                rules: {
                    number: [
                        {required: true, message: '请输入数量', trigger: 'blur'},
                    ],
                    date: [
                        {required: true, message: '请选择日期', trigger: 'blur'},
                    ]
                },
                isloading: false,       //防止多次点击
                showDialog: false,
                skuId: '',
                materialName: '',
                selectSkuIdArr:[],  //勾选的skuId集合
            }
        },
        computed: {
            //工厂id
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            //用户id
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            //弹窗标题
            title() {
                let name = '[ ' + this.listData.materialsNo + '-' + this.listData.colorName + '-' + this.listData.specificationsNo + ' ] ';
                if (this.type === '1') {
                    return name + '入库';
                } else if (this.type === '2') {
                    return name + '出库';
                } else if (this.type === '3') {
                    return name + '库存调整';
                } else {
                    return '编辑 ' + name + '仓位';
                }
            },
            //弹窗数量label
            labelNumber() {
                if (this.type === '1') {
                    return "本次入库数"
                } else if (this.type === '2') {
                    return "本次出库数"
                } else if (this.type === '3') {
                    return "库存调整为"
                }
            },
            //弹窗input框提示文字
            placeholder() {
                if (this.type === '1') {
                    return "请输入入库数量"
                } else if (this.type === '2') {
                    return "请输入出库数量"
                } else if (this.type === '3') {
                    return "请输入库存调整数量"
                }
            },
            //弹窗日期label
            labelDate() {
                if (this.type === '1') {
                    return "入库日期"
                } else if (this.type === '2') {
                    return "出库日期"
                } else if (this.type === '3') {
                    return "调整日期"
                }
            },
            //弹窗备注label
            labelRemarks() {
                if (this.type === '1') {
                    return "入库备注"
                } else if (this.type === '2') {
                    return "出库备注"
                } else if (this.type === '3') {
                    return "调整原因"
                }
            }
        },
        methods: {
            //勾选
            handleSelectionChange(val){
                if(val.length){
                    this.selectSkuIdArr = val.map(item => item.skuId);
                }else{
                    this.selectSkuIdArr = [];
                }
                this.$emit('select', this.selectSkuIdArr);
            },
            handleDialogShow(row){
                //物料名称判空
                if(row.materialsName){
                    this.materialName = row.materialsKindName+'-'+row.materialsNo+'-'+row.materialsName+'-'+row.colorName+'-'+row.specificationsNo;
                }else{
                    this.materialName = row.materialsKindName+'-'+row.materialsNo+'-'+row.colorName+'-'+row.specificationsNo;
                }
                this.skuId = row.skuId;
                this.showDialog = true;
            },
            // 图片预览
            imgList(row) {
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList;
                this.centerDialogVisible = true;
            },
            handleSingleStock(val, type) {
                if(type === '1'){
                    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                        .permissionList;
                    if (datalist.indexOf("fac.stock.add") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                }else if(type === '2'){
                    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                        .permissionList;
                    if (datalist.indexOf("fac.stock.delete") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                }else if(type === '3'){
                    var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                        .permissionList;
                    if (datalist.indexOf("fac.stock.adjust") == -1) {
                        this.$message.error("抱歉，您没有操作权限");
                        return;
                    }
                }
                this.listData = val;
                this.type = type;
                this.dialogForm1 = true;
            },
            handleEditStock(val) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.stock.edit") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.listData = val;
                this.dialogForm2 = true;
            },
            //入库，出库，调整操作
            singleChange(formName) {
                //检测必填项
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.formChange.number*1<0) {
                            return this.$message.error('请输入正数')
                        }
                        this.isloading = true;
                        let params = {
                            id: this.listData.id,                       //仓库id
                            unitId: this.unitId,                         //工厂id
                            userId: this.userId,                         //用户id
                            inventoryType: this.type,                    //操作类型
                            materialsNo: this.listData.materialsNo,      //物料款号
                            colorName: this.listData.colorName,          //物料颜色
                            stock: this.formChange.number,               //入库、出库、调整数
                            opDate: this.formChange.date,                //入库、出库、调整日期
                            remark: this.formChange.remarks              //备注
                        };
                        singleChangeStock(params).then(res => {
                            if (res.data.code === 0) {
                                this.formChange = {};
                                this.$emit('updateTable', this.filterData);
                                this.$message.success(res.data.msg);
                            } else {
                                //失败提示
                                this.$message.error(res.data.msg);
                            }
                            this.dialogForm1 = false;
                            this.isloading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            //编辑操作
            singleEdit() {
                this.isloading = true;
                let params = {
                    id: this.listData.id,         //仓库id （必须）
                    position: this.formEdit.position
                };
                singleEditStock(params).then(res => {
                    if (res.data.code === 0) {
                        this.formEdit = {};
                        this.$emit('updateTable', this.filterData);
                        this.$message.success(res.data.msg);
                    } else {
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.dialogForm2 = false;
                    this.isloading = false;
                });
            },
            // 操作时间
            changeCreateDate(filterDate) {
                this.formChange.date = filterDate;
            },
            //关闭通用弹窗
            closeSingleForm1(formName) {
                this.formChange = {};
                this.$refs[formName].resetFields();
                this.dialogForm1 = false;
            },
            //关闭编辑弹窗
            closeSingleForm2() {
                this.formEdit = {};
                this.dialogForm2 = false;
            },
            //分页切换
            handleCurrentChange(val) {
                this.$emit("pageChange", val);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .inventory-table {
        .reference-remain{
            color: #1CA1FF;
            cursor: pointer;
        }
        .icon {
            margin-right: 2px;
            vertical-align: bottom;
        }
        .el-button {
            padding: 0px 10px;
            border-radius: inherit;
        }
        .el-button + .el-button {
            margin-left: 0;
            border-left: 1px solid rgb(223, 228, 236)
        }
        .form3-title {
            margin-bottom: 25px;
            font-size: 14px;
            text-align: center;
        }
        .supplier-page {
            padding-right: 30px;
            margin: 20px 0;
            text-align: right;

        }

    }
</style>
<style lang="scss">
    .inventory-table {
        .el-dialog {
            width: 560px !important;
            .el-dialog__header {
                padding-bottom: 18px;
                border-bottom: 1px solid rgba(230, 234, 240, 1);
                text-align: center;
            }
            .el-dialog__body {
                width: 350px;
                margin: 0 auto;
                padding: 30px 20px 8px 20px;
                .el-input {
                    width: 250px;
                }
                .el-date-editor.el-input {
                    width: 250px;
                }
                .el-textarea {
                    width: 250px;
                    .el-textarea__inner {
                        font-family: Arial;
                    }
                }
            }
            .el-dialog__footer {
                padding: 25px 20px;
                border-top: 1px solid rgba(230, 234, 240, 1);
                text-align: center;
                .el-button {
                    width: 130px;
                    line-height: 40px;
                    margin: 0 3px;
                }
            }
        }
        .el-textarea__inner {
            resize: none;
        }
        .el-table__fixed-header-wrapper thead div {
            color: #97a5bd;
        }
        .el-table .cell, .el-table th > div {
            padding-left: 12px;
            padding-right: 12px;
        }
        .btn-wrap .el-button{
            font-size: 12px;
        }
    }
</style>
