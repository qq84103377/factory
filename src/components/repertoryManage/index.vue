<template>
    <section class="repertory">
        <div class="repertory-btn">
            <nf-button type="warning" svg="icon-btn-add" @click="dialogRepertory = true">添加仓库</nf-button>
        </div>
        <page-wrap class="repertory_table">
            <el-table :data="tableData" border>
                <el-table-column v-for="(item, index) in tableConfig" :prop="item.prop" :label="item.label" :width="item.width" :key="index">
                </el-table-column>
                <el-table-column prop="address" label="操作" :width="400" align="center">
                    <template slot-scope="scope">
                        <div style="display: flex; justify-content: space-between">
                            <!--<icon-button type="icon-stock" @click="handleSee(scope.row)">查看库存</icon-button>-->
                            <icon-button type="icon-factory" @click="handleRelated(scope.row,'fac')">关联工厂</icon-button>
                            <icon-button type="icon-factory" @click="handleRelated(scope.row,'com')">关联店铺</icon-button>
                            <icon-button type="icon-edit" @click="handleEditName(scope.row)">编辑配置</icon-button>
                            <icon-button type="icon-delete" @click="handleDele(scope.row)">删除仓库</icon-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="repertory_footer fr">
                <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :current-page.sync="currentPage" :total="totalNum">
                </el-pagination>
            </div>
        </page-wrap>
        <!-- dialog -->
        <div>
            <!-- dialog_新建仓库 -->
            <el-dialog class="repertory_dialog repertory_dialog--newAdd" :visible.sync="dialogRepertory">
                <div class="title">新建仓库</div>
                <div class="body">
                    <el-input v-model="repertoryName" :maxlength="15" placeholder="请输入仓库名称"></el-input>
                </div>
                <div class="footer">
                    <nf-button @click="dialogRepertory = false">取消</nf-button>
                    <nf-button type="warning" @click="handleNext">下一步</nf-button>
                </div>
            </el-dialog>
            <!-- dialog_编辑仓库配置 -->
            <el-dialog class="repertory_dialog repertory_dialog--editName" :visible.sync="dialogEditName">
                <div class="title">编辑仓库配置</div>
                <div class="body">
                    <p>原仓库名称：{{repertoryNameOld}}</p>
                    <el-input v-model="params_editName.name" :maxlength="15" placeholder="请输入仓库新名称"></el-input>
                    <el-checkbox style="margin-top: 20px;" v-model="params_editName.notAllowNegative">成衣出库数不允许超过库存数</el-checkbox>
                </div>
                <div class="footer">
                    <nf-button @click="dialogEditName = false">取消</nf-button>
                    <nf-button type="warning" @click="AjaxupdateStorehouseName">确定</nf-button>
                </div>
            </el-dialog>
            <!-- dialog_删除仓库 -->
            <el-dialog class="repertory_dialog repertory_dialog--dele" :visible.sync="dialogDele">
                <div class="title">确认删除“{{repertoryNameOld}}”？</div>
                <div class="body">
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p>除仓库后，仓库里的所有货品库存数将被清空并无法恢复，并且原本关联到此仓库的工厂将变成无关联仓库。 如果确认要删除仓库，请在下方输入密码并点击“确认删除”按钮。
                    </p>
                    <div style="margin: 0 auto; width: 320px;">
                        <el-input name="repertory_dele" trigger-on-focus=false v-model="params_dele.password" type="password" placeholder="请输入密码"></el-input>
                    </div>
                </div>
                <div class="footer">
                    <nf-button @click="dialogDele = false">取消</nf-button>
                    <nf-button type="warning" @click="AjaxDeleteStorehouse">确定</nf-button>
                </div>
            </el-dialog>
            <!-- dialog_编辑关联工厂 -->
            <el-dialog class="repertory_dialog repertory_dialog--edit" :visible.sync="dialogEditRepertory">
                <div class="title">{{dialogEditRepertoryObj.name}}- <span v-if="editType==='fac'">关联工厂</span><span v-if="editType==='com'">关联店铺</span></div>
                <div class="body">
                    <div class="repertory_dialog-div" v-for="(item, index) in facs">
                        <span>{{item.name}}</span>
                        <el-select @visible-change="selChange" :disabled="item.disabled === 1" v-model="item.defaultRepertory" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="footer clearfix">
                    <div>
                        <nf-button class="fl" v-if="dialogEditRepertoryType" @click="handleNo">暂不关联</nf-button>
                        <div class="fr">
                            <nf-button v-if="!dialogEditRepertoryType" @click="dialogEditRepertory = false">取消</nf-button>
                            <nf-button type="warning" @click="handleEdit">确定</nf-button>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
    </section>
</template>

<script>
import {
    addStorehouse,
    queryStorehouseUnitDetail,
    queryStorehousePage,
    updateStorehouseName,
    deleteStorehouse,
    setUpStorehouseUnit
} from "@/api/api";
import md5 from "js-md5";
// table config
const tableConfig = [
    { prop: "name", label: "仓库", width: 180},
    { prop: "unitNames", label: "关联工厂"},
    { prop: "nwhsNames", label: "关联店铺"},
    { prop: "cyStylenoCount", label: "货品总数", width: 120 },
    { prop: "cyTotal", label: "库存总数", width: 120 }
];
export default {
    data() {
        return {
            editType:'fac',
            unitType:0,
            options: [{
                value: 1,
                label: '默认仓'
            }, {
                value: 0,
                label: '共用仓'
            }, {
                value: 2,
                label: '无关联'
            }],
            value: '',
            tableConfig: tableConfig, //列表项配置数据
            tableData: [
                { name: "-", unitNames: "-", cyStylenoCount: "-", cyTotal: "-" }
            ], // 列表数据
            nwhsList:[],   //全部店铺
            repertoryName: "", // dialog-新建仓库-名称
            dialogRepertory: false, // dialog-新建仓库
            dialogEditName: false, // dialog-修改仓库名称
            dialogDele: false, // dialog-删除仓库
            repertoryNameOld: "", // dialog-修改仓库名-原仓库名
            dialogEditRepertory: false, // dialog-编辑关联工厂
            dialogEditRepertoryObj: {}, // dialog-编辑关联工厂-info
            dialogEditRepertoryType: false, // dialog-编辑关联工厂-入口 true为新建进来
            repertoryListObject: [], // dialog-编辑关联工厂-label
            repertoryList: [], // 仓库与组织关联关系
            facs: [], // 体系下所有工厂
            totalNum: 0, // 列表总数量
            currentPage: 1, // el-pagination-当前页
            params_editName: {
                notAllowNegative: false,
                id: "",
                userId: "",
                name: ""
            }, // ajax-params-修改仓库名
            params_dele: {
                id: "",
                userId: "",
                password: ""
            }, // ajax-params-删除仓库
            params_edit: {
                userId: "",
                storehouseId: "",
                setUpStorehouseUnit: []
            } // 关联仓库／设置默认仓库
        };
    },
    async created() {
        // 列表数据
        await this.AjaxQueryStorehousePage();
    },
    methods: {
        // 查询仓库列表分页数据
        async AjaxQueryStorehousePage(num) {
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            let params = {
                pageNo: num || 1,
                pageSize: 10,
                userId: userInfo.userId,
                kind: 1,    //1-自用仓库，2-加工厂仓库
            };
            this.currentPage = params.pageNo;
            let data = await queryStorehousePage(params);
            this.tableData = data.data.commonStorehouseList;
            this.tableData.forEach(item => {
                item.unitNames = item.unitNames.join("，");
                item.nwhsNames = item.nwhsNames.join("，");
            });
            this.totalNum = data.data.recordCount;
        },
        // 查询体系下所有仓库及关联信息
        async AjaxQueryStorehouseUnitDetail(id) {
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            let params = {
                userId: userInfo.userId,
                storehouseId: id || ""
            };
            // 数据初始化
            this.facs = [];
            this.repertoryList = [];
            this.dialogEditRepertoryObj = {};
            this.params_edit.setUpStorehouseUnit = [];
            this.repertoryListObject = [];
            try {
                let data = (await queryStorehouseUnitDetail(params)).data;
                // 保存ajax获取到的数据

                (await data.code) === 0 && void 0, (this.dialogEditRepertoryObj = data.storehouse);
                if(this.editType ==='fac'){
                    (await data.code) === 0 && void 0, (this.facs = data.unitsList);
                    (await data.code) === 0 && void 0, (this.repertoryList = data.unitStorehouseRelation);
                }else if(this.editType ==='com'){
                    (await data.code) === 0 && void 0, (this.facs = data.nwhsList);
                    (await data.code) === 0 && void 0, (this.repertoryList = data.nwhsStorehouseRelation);
                }

                (await data.code) === 0 && void 0, (this.nwhsList = data.nwhsList);
                // console.log("data", data);
                // 筛选默认仓库和关联仓库
                await this.selectRepertory();
            } catch (err) {
                console.log(err);
            }
        },
        // 筛选默认仓库和关联仓库
        async selectRepertory() {
            // 筛选关联仓库
            this.repertoryList.forEach(item => {
                this.repertoryListObject.push(item.unitId);
            });
            console.log(this.repertoryList);
            console.log(this.repertoryListObject);
            // 筛选默认仓库并添加标识符
            for (var i = 0; i < this.facs.length; i++) {
               for(var j=0;j<this.repertoryList.length;j++){
                   if (this.facs[i].id === this.repertoryList[j].unitId) {
                       this.facs[i].defaultRepertory = this.repertoryList[j].defaultStorehouseTag;
                       this.facs[i].disabled = this.repertoryList[j].disabled;
                   }
               }
            }
            this.facs.forEach(item=>{
                if(!item.defaultRepertory&&item.defaultRepertory!==0){
                    item.defaultRepertory = 2
                }
            })
            var aaa=[...this.facs];
            this.facs = aaa
            console.log(this.facs);
        },
        // ajax_修改仓库名
        async AjaxupdateStorehouseName(id) {
            if (this.params_editName.name === "") {
                this.$message.error("请输入仓库新名称");
                return;
            }
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            this.params_editName.userId = userInfo.userId;
            try {
                let data = (await updateStorehouseName(this.params_editName))
                    .data;
                (await data.code) === 0
                    ? ((this.dialogEditName = false),
                      this.params_editName.name = "",
                      this.AjaxQueryStorehousePage(this.currentPage))
                    : this.$message.error(data.msg);
            } catch (err) {
                console.log(err);
            }
        },
        // ajax_删除仓库
        async AjaxDeleteStorehouse() {
            if (this.params_dele.password === "") {
                this.$message.error("请输入密码");
                return;
            }
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            this.params_dele.userId = userInfo.userId;
            this.params_dele.password = md5(this.params_dele.password);
            try {
                let data = (await deleteStorehouse(this.params_dele)).data;
                (await data.code) === 0
                    ? ((this.dialogDele = false),
                      this.$message.success(data.msg),
                      this.AjaxQueryStorehousePage(1))
                    : this.$message.error(data.msg);
            } catch (err) {
                console.log(err);
            }
            this.params_dele.password = "";
        },
        // ajax_批量修改工厂-仓库组织关联关系
        async AjaxSetUpStorehouseUnit() {
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            this.params_edit.userId = userInfo.userId;
            this.params_edit.unitType = this.unitType;
            // this.params_edit.storehouseId = id;
            try {
                let data = (await setUpStorehouseUnit(this.params_edit)).data;
                (await data.code) === 0 &&
                    (this.$message.success(data.msg),
                    (this.dialogEditRepertoryType = false),
                    (this.dialogEditRepertory = false),
                    this.AjaxQueryStorehousePage(this.currentPage));
                if((await data.code) === 400){
                    this.$message.error(data.msg);
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 设置关联仓库参数赋值
        handleChange() {

            // console.log("params_edit", this.params_edit);
        },
        // 设为默认仓库
        handleDefault(index) {
            //				this.facs[index]  工厂
            //				this.params_edit  参数
            //				console.log('params_edit', this.params_edit.setUpStorehouseUnit[index]);
            //				console.log('facs', this.facs[index]);
            this.$confirm(
                `“${this.dialogEditRepertoryObj.name}”已有其他的默认仓库，是否将其替换`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.$set(this.facs[index], "defaultRepertory", 1);
                    this.handleChange();
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    });
                });
        },
        // 设置关联仓库 - open dialog
        handleRelated(obj,type) {
            this.editType=type
            if(type==='fac'){
                this.options=[{
                    value: 1,
                    label: '默认仓'
                }, {
                    value: 0,
                    label: '共用仓'
                }, {
                    value: 2,
                    label: '无关联'
                }]
            }else {
                this.options=[{
                    value: 1,
                    label: '自建仓'
                }, {
                    value: 0,
                    label: '绑定仓'
                }, {
                    value: 2,
                    label: '无关联'
                }]
            }
            // 取得仓库ID
            this.params_edit.storehouseId = obj.id;

            this.dialogEditRepertory = true;
            this.dialogEditRepertoryType = false;
            this.AjaxQueryStorehouseUnitDetail(obj.id);
        },
        // 查看库存
        handleSee(e) {
            this.$router.push(`/home/stock?storehouseId=${e.id}`);
        },
        // 修改名称
        handleEditName(e) {
            this.dialogEditName = true;
            this.repertoryNameOld = e.name;
            this.params_editName.name = e.name;
            this.params_editName.notAllowNegative = e.notAllowNegative;
            this.params_editName.id = e.id;
        },
        // 删除仓库
        handleDele(e) {
            this.dialogDele = true;
            this.repertoryNameOld = e.name;
            this.params_dele.id = e.id;
        },
        // 分页
        handleCurrentChange(e) {
            this.AjaxQueryStorehousePage(e);
        },
        // dialog-添加仓库-下一步
        async handleNext() {
            if (this.repertoryName === "") {
                this.$message.error("请填写仓库名称");
                return;
            }
            let userInfo = JSON.parse(sessionStorage.getItem("user_login"));
            var params = {
                userId: userInfo.userId,
                name: this.repertoryName,
                kind: 1,    //1-自用仓库，2-加工厂仓库
            };
            try {
                let data = (await addStorehouse(params)).data;
                if (data.code === 1) {
                    this.$message.error(data.msg);
                    return;
                }
                // console.log(data.data, '添加成功');
                // 取得仓库ID
                (await data.code) === 0 && void 0,
                    (this.params_edit.storehouseId = data.data.id);

                (await data.code) === 0 && void 0,
                    this.$message.success(data.msg);
                (await data.code) === 0 && void 0,
                    this.AjaxQueryStorehouseUnitDetail(data.data.id);
                (await data.code) === 0 && void 0,
                    (this.dialogRepertory = false);
                (await data.code) === 0 && void 0,
                    (this.dialogEditRepertoryType = true);
                (await data.code) === 0 && void 0,
                    (this.dialogEditRepertory = true);
            } catch (err) {
                console.log(err);
            }
            this.repertoryName = "";
        },
        // 暂不关联
        handleNo() {
            this.dialogEditRepertoryType = false;
            this.dialogEditRepertory = false;
            this.handleCurrentChange(1);
        },
        // dialog-编辑关联工厂-确定
        handleEdit() {
            console.log(this.facs);
            // 初始化params_edit
            this.params_edit.setUpStorehouseUnit = [];

                this.facs.forEach(e => {
                    let data = {
                        storehouseId: this.dialogEditRepertoryObj.id,
                        unitId: '',
                        defaultStorehouseTag: 0
                    };
                    if (e.defaultRepertory !== 2 ) {
                        var setUpStorehouseUnit = this.params_edit.setUpStorehouseUnit
                        setUpStorehouseUnit.push(data);
                        setUpStorehouseUnit[setUpStorehouseUnit.length-1].defaultStorehouseTag = e.defaultRepertory;
                        setUpStorehouseUnit[setUpStorehouseUnit.length-1].unitId = e.id;
                        setUpStorehouseUnit[setUpStorehouseUnit.length-1].unitType = e.type;
                        this.unitType = e.type;
                    }

                });


            this.AjaxSetUpStorehouseUnit();
        },
        selChange(val){

            var aaa =[...this.facs]
            this.facs = aaa;


        },
    }
};
</script>

<style lang="scss" scoped>
.repertory {
    .repertory-btn{
        margin-bottom: 8px;
        text-align: right;
    }
    &_footer {
        margin-top: 40px;
    }
}
</style>
<style lang="scss">
.repertory_dialog {
    .el-dialog__header {
        display: none;
    }
    .el-dialog__body {
        padding: 0;
    }
    .title {
        width: 100%;
        height: 52px;
        text-align: center;
        line-height: 52px;
        font-size: 20px;
        color: #3b3b3b;
        border-bottom: 1px solid #e0e6ed;
    }
    .body {
        padding: 32px;
    }
    .footer {
        padding: 0 32px 32px 36px;
        button {
            margin: 0 6px;
        }
    }
}
.repertory_dialog--newAdd,
.repertory_dialog--editName {
    min-height: 260px;
    .el-dialog {
        width: 400px;
    }
    .footer {
        display: flex;
        justify-content: center;
    }
}
.repertory_dialog--dele {
    .el-dialog {
        width: 766px;
    }
    .body {
        text-align: center;
        p {
            margin: 32px 0;
            font-size: 14px;
            color: #3b3b3b;
        }
    }
    .footer {
        display: flex;
        justify-content: center;
        padding-top: 28px;
        border-top: 1px solid #e0e6ed;
    }
}
.repertory_dialog--editName {
    .body {
        p {
            margin: 16px 0;
            font-size: 14px;
            color: #3b3b3b;
        }
    }
}
.repertory_dialog--edit {
    .el-dialog {
        width: 612px;
    }
    .body {
        padding: 20px 0;
        max-height: 395px;
        overflow-y: auto;
        .item {
            padding: 0 32px;
            height: 56px;
            line-height: 56px;
            border-bottom: 1px solid #e0e6ed;
            &:last-child {
                border: 0;
            }
            .btn {
                margin-top: 16px;
                width: 64px;
                height: 24px;
                text-align: center;
                line-height: 24px;
                font-size: 12px;
                color: #808080;
                border: 1px solid #dce0e6;
                border-radius: 2px;
                cursor: pointer;
                &:hover {
                    background: #fafafa;
                }
            }
        }
        .label {
            display: inline-block;
            color: #3b3b3b;
            font-size: 14px;
        }
        .tip {
            position: relative;
            top: 6px;
            display: inline-block;
            width: 68px;
            img {
                width: 100%;
            }
        }
        .button {
            display: none;
            position: relative;
            top: -2px;
            font-size: 14px;
            color: #1ca1ff;
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .repertory_dialog-div{

        /*margin: 6px 0;*/
        margin-left: 130px;
        width: 360px;
        display: flex;
        border: 1px solid rgba(230,234,240,1);
        border-bottom: none;
        &:last-child{
            border-bottom: 1px solid rgba(230,234,240,1);
        }
        span{
            display: inline-block;
            width: 180px;
            height: 36px;
            line-height: 36px;
            padding-left: 6px;
            /*border: 1px solid rgba(230,234,240,1);*/
            border-right: 1px solid rgba(230,234,240,1);
        }
        .el-input{

        }
        .el-input__inner{
            /*border: 1px solid rgba(230,234,240,1);*/
            border: none;
        }
    }
    .footer {
        padding-top: 16px;
        border-top: 1px solid #e0e6ed;
        .tips {
            margin: 0 0 16px 0;
            height: 28px;
            line-height: 28px;
            text-indent: 1em;
            font-size: 12px;
            color: #a2abb8;
            background-color: #f5f7fa;
        }
    }
}
.repertory_table {
    .el-table {
        color: #3b3b3b;
    }
    .el-table th.is-leaf {
        /*border: none !important;*/
    }
    .el-table th {
        background-color: #f5f7fa !important;
    }
    .el-table__footer-wrapper thead div,
    .el-table__header-wrapper thead div {
        background-color: #f5f7fa !important;
    }
    .el-table::after, .el-table::before {
        background-color: rgba(0,0,0,0) !important;
    }
}
</style>
