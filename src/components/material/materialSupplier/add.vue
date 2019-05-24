<template>
    <div class="add-supplier">
        <div class="add-header">
            <span>{{ title }}</span>
            <span class="btns">
                <nf-button @click="cancelClick">取消</nf-button>
                <nf-button type="warning" @click="supplierMesCommit('ruleForm')" :loading="isloading">保存</nf-button>
            </span>
        </div>
        <div class="add-content">
            <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="供应商名称" prop="name">
                            <el-input v-model.trim="ruleForm.name" maxlength="20" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商编号" prop="code">
                            <el-input v-model.trim="ruleForm.code" placeholder="供应商编号不填则自动生成" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="联系人">
                            <el-input v-model.trim="ruleForm.contacts" placeholder="请输入联系人" maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话">
                            <el-input v-model.trim="ruleForm.mobilePhone" maxlength="20" placeholder="请输入联系电话"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="银行账号">
                            <el-input v-model.trim="ruleForm.bankAccount" placeholder="请输入银行账号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开户行">
                            <el-input v-model.trim="ruleForm.bankName" maxlength="11" placeholder="请输入开户行"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="所属地区">
                            <div
                                    v-if="ruleForm.provinceName && cityFlag"
                                    class="selected-address"
                                    :title="detailedAddress"
                            >
                                {{ detailedAddress }}
                            </div>
                            <el-cascader
                                    style="width: 250px"
                                    placeholder="请选择地区"
                                    show-all-levels
                                    :options="options2"
                                    @change="handleChange"
                                    @active-item-change="handleItemChange"
                                    :props="props"
                            >
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="详细地址">
                            <el-input v-model.trim="ruleForm.address" type="text" maxlength="50" placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注信息">
                            <el-input
                                    class="remark-textarea"
                                    v-model.trim="ruleForm.remark"
                                    type="textarea"
                                    :rows="3"
                                    placeholder="请输入备注信息"
                                    maxlength="200"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--供应商重名弹窗-->
        <el-dialog
                class="repertory_dialog repertory_dialog--dele"
                :visible.sync="dialogVisible"
                :modal-append-to-body="false"
        >
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">{{ dialogMsg }}</p>
            </div>
            <div class="footer">
                <nf-button @click="cancelBtn()">取消</nf-button>
                <nf-button type="warning" @click="importMes()">导入</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getPosition} from "@/api/api";
    import config from "@/config/index";
    import {
        getMaterialSupForm,
        materialSupInsert,
        materialSupUpdate,
        checkMaterialSupName,
        checkMaterialSupCode,
        importMaterialSupMes
    } from "@/api";

    export default {
        name: "addSupplier",
        props: {
            type: String,
            supplierId: String,
            supplierName: String,
        },
        data() {
            //自定义供应商名称校验
            var validateName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('供应商名称不能为空'));
                } else {
                    //检查是否重名
                    if (this.type === 'edit' && this.ruleForm.name === this.beforEditName) {
                        callback();
                    } else {
                        let params = {
                            factoryId: this.factoryId,
                            userId: this.userId,
                            name: this.ruleForm.name
                        };
                        checkMaterialSupName(params).then(res => {
                            // console.log(res);
                            if (res.data.code === 0) {
                                //可以使用
                                callback();
                            } else if (res.data.code === 1) {
                                //失败提示
                                this.$message.error(res.data.msg);
                                callback();
                            } else if (res.data.code === 2) {
                                //询问是否导入
                                this.importId = res.data.data.id;
                                this.dialogMsg = '此供应商名称已经存在，是否将其导入？';
                                this.dialogVisible = true;
                                callback();
                            } else if (res.data.code === 3) {
                                //本厂已存在相同名字
                                callback(new Error('本厂已存在相同供应商名称'));
                            }
                        });
                    }
                }
            };
            //自定义供应商编号校验
            var validateCode = (rule, value, callback) => {
                if (this.type === 'edit' && !value) {
                    callback(new Error('供应商编号不能为空'));
                } else {
                    //检查是否重名
                    if (!value || this.type === 'edit' && this.ruleForm.code === this.beforEditCode) {
                        callback();
                    } else {
                        let params = {
                            factoryId: this.factoryId,
                            userId: this.userId,
                            code: this.ruleForm.code
                        };
                        checkMaterialSupCode(params).then(res => {
                            if (res.data.code === 0) {
                                //可以使用
                                callback();
                            } else if (res.data.code === 1) {
                                //失败提示
                                this.$message.error(res.data.msg);
                                callback();
                            } else if (res.data.code === 2) {
                                //询问是否导入
                                this.importId = res.data.data.id;
                                this.dialogMsg = '此供应商编号已经存在，是否将其导入？';
                                this.dialogVisible = true;
                                callback();
                            } else if (res.data.code === 3) {
                                //本厂已存在相同编号
                                callback(new Error('本厂已存在相同供应商编号'));
                            }
                        });
                    }
                }
            };
            return {
                userId: '',
                ruleForm: {},
                options2: [],
                props: {
                    value: "code",
                    label: "label",
                    children: "cities"
                },
                dialogVisible: false,    //重名验证弹窗
                rules: {
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    code: [
                        {validator: validateCode, trigger: 'blur'}
                    ]
                },
                beforEditName: '',  //编辑之前的名字，用于查重
                beforEditCode: '',  //编辑之前的编号，用于查重
                version: '',        //版本号
                provinceId: '',     //省id
                cityId: '',         //市id
                areaId: '',         //区id
                cityFlag: true,     //是否显示地区信息div
                factoryId: '',       //工厂id
                importId: '',        //导入时候需要使用的供应商id
                isloading: false,   //防止多次点击
                arr:[],
                dialogMsg:''         //导入提示信息
            }
        },
        computed: {
            title: function () {
                if (this.type === 'add') {
                    return "新建物料供应商";
                } else if (this.type === 'edit') {
                    return "编辑物料供应商";
                }
            },
            //拼接所属地区
            detailedAddress() {
                let address = '';
                if (this.ruleForm.provinceName && this.ruleForm.cityName && this.ruleForm.areaName) {
                    address = this.ruleForm.provinceName + ' / ' + this.ruleForm.cityName + ' / ' + this.ruleForm.areaName;
                }
                return address;
            }
        },
        methods: {
            //隐藏组件
            cancelClick() {
                this.$emit('hideCover');
            },
            //更新父组件数据
            updateSupData(newSupObj) {
                this.$emit('update', newSupObj);
            },
            //取消导入供应商名称
            cancelBtn() {
                this.dialogVisible = false;
            },
            //用于判断是否存在于当前数组
            contains(arr, obj) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] == obj) {
                        return true;
                    }
                }
                return false;
            },
            //导入供应商名称
            importMes() {
                this.isloading = true;
                let params = {
                    id: this.importId,
                    factoryId: this.factoryId
                };
                importMaterialSupMes(params).then(res => {
                    if(res.data.code === 0){
                        this.updateSupData();
                        this.cancelClick();
                    }else{
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                    this.isloading = false;
                });
            },
            //获取地区接口数据
            cityData() {
                getPosition({}).then(res => {
                    // console.log(res, "地区");
                    for (let i = 0; i < res.data.positionList.length; i++) {
                        let obj = {};
                        obj.label = res.data.positionList[i].name;
                        obj.code = res.data.positionList[i].id;
                        obj.cities = [];
                        this.options2.push(obj);
                    }
                    // console.log(this.options2);
                });
            },
            //输出省、市、区对于的id
            handleChange(val) {
                // console.log(val);
                this.provinceId = val[0];
                this.cityId = val[1];
                this.areaId = val[2] || "";
                this.cityFlag = false;
            },
            //根据父级，查找子级城市名
            handleItemChange(val) {
                // console.log(val);
                if (val.length == 1) {
                    var v = val[0];
                } else {
                    v = val[1];
                }
                let params = {
                    id: v
                };
                if(this.contains(this.arr,v)){
                    return false;
                }
                this.arr.push(v);
                getPosition(params).then(res => {
                    // console.log(res, "地区");
                    let city = [];
                    if (val.length == 1) {
                        for (let i = 0; i < res.data.positionList.length; i++) {
                            let obj = {};
                            obj.label = res.data.positionList[i].name;
                            obj.value = res.data.positionList[i].id;
                            obj.code = res.data.positionList[i].id;
                            obj.cities = [];
                            city.push(obj);
                            setTimeout(_ => {
                                for (let i = 0; i < this.options2.length; i++) {
                                    if (this.options2[i].code == v) {
                                        this.options2[i].cities.push(obj);
                                    }
                                }
                            }, 100);
                        }
                    } else {
                        let areas = [];
                        for (let i = 0; i < res.data.positionList.length; i++) {
                            let obj = {};
                            obj.label = res.data.positionList[i].name;
                            obj.value = res.data.positionList[i].id;
                            obj.code = res.data.positionList[i].id;
                            obj.areas = [];
                            obj.areas.push(obj);
                            setTimeout(_ => {
                                for (let i = 0; i < this.options2.length; i++) {
                                    if (this.options2[i].code == val[0]) {
                                        // console.log(this.options2[i].code);
                                        let arr = this.options2[i];
                                        for (
                                            let j = 0;
                                            j < arr.cities.length;
                                            j++
                                        ) {
                                            // console.log(arr.cities[j].code, val[1]);
                                            if (arr.cities[j].code == val[1]) {
                                                // console.log(arr.cities[j].code);
                                                arr.cities[j].cities.push(obj);
                                            }
                                        }
                                    }
                                }
                            }, 100);
                        }
                    }
                });
            },
            //初始化表格数据
            initTableMes() {
                if (this.type === 'edit') {
                    let params = {
                        id: this.supplierId
                    };
                    getMaterialSupForm(params).then(res => {
                        // console.log(res);
                        if(res.data.code === 0){
                            this.ruleForm = res.data.data;
                            this.version = res.data.data.version;
                            this.provinceId = res.data.data.provinceId;
                            this.cityId = res.data.data.cityId;
                            this.areaId = res.data.data.areaId;
                            this.beforEditName = res.data.data.name;
                            this.beforEditCode = res.data.data.code;
                        }else{
                            //失败提示
                            this.$message.error(res.data.msg);
                        }
                    });
                }
            },
            //物料供应商新增和编辑提交
            supplierMesCommit(formName) {
                //检测必填项
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //验证手机号码
                        const supplierPhone = this.ruleForm.mobilePhone;
                        // if(supplierPhone){
                        //     if(/^1\d{10}$/.test(supplierPhone)){
                        //     }else{
                        //         this.$message({
                        //             type: "error",
                        //             duration: config.elementUI.duration,
                        //             showClose: true,
                        //             message: "手机号码格式错误"
                        //         });
                        //         return false;
                        //     }
                        // }
                        //验证供应商编号
                        const supplierCode = this.ruleForm.code;
                        if(supplierCode){
                            if(/^[0-9a-zA-Z]*$/g.test(supplierCode)){
                            }else{
                                this.$message({
                                    type: "error",
                                    duration: config.elementUI.duration,
                                    showClose: true,
                                    message: "供应商编号只能为字母、数字"
                                });
                                return false;
                            }
                        }
                        //验证固定电话
                        const supplierTel = this.ruleForm.telephone;
                        if(supplierTel){
                            if(/^[\d\-]+$/.test(supplierTel)){
                            }else{
                                this.$message({
                                    type: "error",
                                    duration: config.elementUI.duration,
                                    showClose: true,
                                    message: "固定电话格式错误"
                                });
                                return false;
                            }
                        }
                        //新增供应商
                        this.isloading = true;
                        if (this.type === 'add') {
                            let params = {
                                factoryId: this.factoryId,
                                userId: this.userId,
                                name: this.ruleForm.name,
                                code: this.ruleForm.code,
                                telephone: this.ruleForm.telephone,
                                contacts: this.ruleForm.contacts,
                                bankAccount: this.ruleForm.bankAccount,
                                bankName: this.ruleForm.bankName,
                                mobilePhone: this.ruleForm.mobilePhone,
                                address: this.ruleForm.address,
                                provinceId: this.provinceId,
                                cityId: this.cityId,
                                areaId: this.areaId,
                                remark: this.ruleForm.remark
                            };
                            materialSupInsert(params).then(res => {
                                if(res.data.code === 0){
                                    let newSupObj = {
                                        "id": res.data.data,
                                        "name": this.ruleForm.name
                                    };
                                    this.$emit("getName",this.ruleForm.name);
                                    this.updateSupData(newSupObj);
                                    this.cancelClick();
                                    this.$message.success("新建成功");
                                }else{
                                    //失败提示
                                    this.$message.error(res.data.msg);
                                }
                                this.isloading = false;
                            });
                        }
                        //编辑供应商
                        else if (this.type === 'edit') {
                            let params = {
                                factoryId: this.factoryId,
                                id: this.supplierId,
                                userId: this.userId,
                                version: this.version,
                                name: this.ruleForm.name,
                                code: this.ruleForm.code,
                                contacts: this.ruleForm.contacts,
                                bankAccount: this.ruleForm.bankAccount,
                                bankName: this.ruleForm.bankName,
                                telephone: this.ruleForm.telephone,
                                mobilePhone: this.ruleForm.mobilePhone,
                                address: this.ruleForm.address,
                                provinceId: this.provinceId,
                                cityId: this.cityId,
                                areaId: this.areaId,
                                remark: this.ruleForm.remark
                            };
                            materialSupUpdate(params).then(res => {
                                if(res.data.code === 0){
                                    this.updateSupData();
                                    this.cancelClick();
                                }else{
                                    //失败提示
                                    this.$message.error(res.data.msg);
                                }
                                this.isloading = false;
                            });
                        }
                    } else {
                        return false;
                    }
                });
            }
        },
        mounted() {
            this.factoryId = JSON.parse(sessionStorage.getItem("last_login")).id;
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            this.cityData();
            this.initTableMes();

            //父组件传了供应商名称时进行赋值
            if(this.supplierName){
                this.ruleForm.name = this.supplierName;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    .add-supplier {
        position: fixed;
        top: 0;
        right: 0;
        width: 750px !important;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2005;
        .add-header {
            width: 100%;
            height: 88px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -ms-flex-align: center;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 2;
        }
        .add-content {
            padding: 30px 30px 30px 20px;
            overflow: hidden;
            .selected-address {
                max-width: 210px;
                height: 33px;
                position: absolute;
                top: 2px;
                left: 10px;
                z-index: 10;
                background-color: #fff;
                overflow: hidden;
            }
            .el-form-item {
                margin-bottom: 22px !important;
            }
        }
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
            .footer {
                padding: 0 32px 32px 36px;
                button {
                    margin: 0 6px;
                }
            }
        }
        .repertory_dialog--dele {
            .el-dialog {
                width: 766px;
            }
            .body {
                text-align: center;
                P {
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
        .el-form-item {
            margin-bottom: 22px !important;
        }

    }
</style>
<style lang="scss">
    .el-textarea__inner{
        resize: none;
    }
    .repertory_dialog .el-dialog--small {
        width: 420px;
    }
    .el-textarea__inner {
        font-family: Arial;
        padding: 7px 10px;
    }
</style>