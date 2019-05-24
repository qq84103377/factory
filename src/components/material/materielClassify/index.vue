<template>
    <section class="materiel-classify">
        <page-title title="物料分类">
            <nf-button type="warning" svg="icon-btn-add" @click="showEditDialog('new')">新建分类</nf-button>
        </page-title>
        <div class="box-shadow">
            <el-table :row-class-name="tableRowClassName" :data="tableData" empty-text="暂无物料分类数据">
                <el-table-column v-for="(item, index) in tableConfig" :prop="item.prop" :label="item.label" :width="item.width" :key="index">
                </el-table-column>
                <el-table-column prop="address" label="操作" :width="240" >
                    <template slot-scope="scope">
                        <div>
                            <icon-button type="icon-edit" @click="showEditDialog('edit',scope.row)">编辑分类</icon-button>
                            <icon-button v-if="scope.row.count == 0" class="mgl30" type="icon-delete" @click="deleteClassify(scope.row)">删除</icon-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-content">
                <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :current-page.sync="currentPage" :total="totalNum">
                </el-pagination>
            </div>
        </div>
        <!--新建/编辑分类-->
        <el-dialog class="custom-dialog"
            :title="editType =='new'?'新建分类':'编辑分类'"
            :visible.sync="editDialogvisible"
            :show-close="false"
            :close-on-click-modal="false"
            size="tiny">
            <el-form :model="form" ref="form" :rules="rules">
                <el-form-item label="分类号" label-width="90px" prop="classsifyNumber">
                    <el-input v-model.trim="form.classsifyNumber" auto-complete="off" placeholder="请输入分类号"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" label-width="90px" prop="classsifyName">
                    <el-input v-model.trim="form.classsifyName" auto-complete="off" placeholder="请输入分类名称"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEditClassify('form')">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="editClassify('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!--删除确认框-->
        <el-dialog class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible"
                   :show-close="false"
                   :close-on-click-modal="false"
                   size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除该分类？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="comfirmDelete()">确认</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
    queryStorehousePage,
    listMaterialsKinds,
    addOrUpdateMaterialsKinds,
    deleteMaterialsKinds
} from "@/api/api";

// table config
const tableConfig = [
    { prop: "no", label: "物料分类号"},
    { prop: "name", label: "分类名称"},
    { prop: "count", label: "物料sku数量" },
];
export default {
    data() {
        // 检验分类号
         var validateClasssifyNumber = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('分类号不能为空'));
            } else {
                let patt=/^[0-9a-zA-Z]{1,8}$/
                if(!patt.test(value)){
                    callback(new Error('请输入8位以内数字或英文'));
                }
                // 分类号查重逻辑

                callback();
            }
        };
        // 检验分类名称
        var validateClasssifyName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('分类名称不能为空'));
            } else {
                // 分类名称查重逻辑

                callback();
            }
        };
        return {
            isDeleteVisible:false,
            deleteClassifyId:'',
            tableConfig: tableConfig, //列表项配置数据
            tableData: [], // 列表数据

            editDialogvisible: false, // dialog-新建分类
            totalNum: 0, // 列表总数量
            currentPage: 1, // el-pagination-当前页
            form: {
                classsifyNumber: '',
                classsifyName: ''
            },
            rules:{
                classsifyNumber:[
                    { validator: validateClasssifyNumber, trigger: 'blur' }
                ],
                classsifyName:[
                    { validator: validateClasssifyName, trigger: 'blur' }
                ]
            },
            // new代表新建 edit代表编辑
            editType:'new',
            editClassifyItem:'',
            isSaving: false
        };
    },
    async created() {
        // 列表数据
        await this.getMaterielClassifyList();
    },
    methods: {
        // 保存编辑
         editClassify(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.editClassifyItem.name == this.form.classsifyName && this.editClassifyItem.no == this.form.classsifyNumber){
                        this.editDialogvisible = false
                    } else{
                        this.isSaving = true
                        let params ={
                            no:this.form.classsifyNumber,
                            name:this.form.classsifyName,
                            userId: JSON.parse(sessionStorage.getItem("user_login")).userId
                        }
                        if(this.editType == 'edit'){
                            params.id = this.editClassifyItem.id
                        }
                        addOrUpdateMaterialsKinds(params).then(res =>{
                            this.isSaving = false
                            if(res.data.code == 0){
                                this.getMaterielClassifyList(this.currentPage)
                                this.editDialogvisible = false
                            } else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "error",
                                    duration: this.$globalConfig.elementUI.duration
                                });
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 取消编辑
        cancelEditClassify(formName) {
            this.editDialogvisible = false
            this.$refs[formName].resetFields()
        },
        // 弹出编辑弹层
        showEditDialog(type,row) {
            this.editDialogvisible = true
            this.editType = type
            console.log(this.editType)
            if(this.editType =='new'){
                this.form.classsifyNumber=''
                this.form.classsifyName=''
            } else {
                this.editClassifyItem = row
                this.form.classsifyNumber = row.no
                this.form.classsifyName = row.name
            }

        },
        // 弹出删除提示框
        deleteClassify(row) {
           this.deleteClassifyId =row.id
           this.isDeleteVisible = true
        },
        comfirmDelete() {
            let params = {
                id: this.deleteClassifyId
            }
            deleteMaterialsKinds(params).then(res =>{
                if( res.data.code == 0){
                    this.getMaterielClassifyList(this.currentPage)
                    this.isDeleteVisible = false
                }
            })
        },
        // 查询物料分类列表
        async getMaterielClassifyList(num) {
            let params = {
                pageNum: num || 1,
                pageSize: 10,
                userId: JSON.parse(sessionStorage.getItem("user_login")).userId
            };
            this.currentPage = params.pageNum;
            let data = await listMaterialsKinds(params);
            this.tableData = data.data.kindsList;
            this.totalNum = data.data.totalCount
        },
        // 分页
        handleCurrentChange(e) {
            this.getMaterielClassifyList(e);
        },
        // 修改表格底色
        tableRowClassName(row, index) {
            if (index%2 === 0) {
                return 'dark-row';
            }
            return '';
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
    .materiel-classify{
        .el-table{
            border: none;
        }
        .el-table::after{
            background-color:transparent;
        }
        .el-table th,
        .el-table__footer-wrapper thead div,
        .el-table__header-wrapper thead div{
            background-color: #fff;
        }
        .el-table th{
            border-bottom:1px solid rgb(223, 228, 236);
        }
        .el-table tr.dark-row{
            background-color: #f7f9fc;
        }
        .el-table td{
            border-bottom: none;
            height: 48px;
        }
    }
</style>