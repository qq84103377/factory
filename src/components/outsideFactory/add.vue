<template>
    <div class="add-outside-factory">
        <div class="add-header">
            <span>{{ title }}</span>
            <span class="btns">
                <nf-button @click="cancelClick">取消</nf-button>
                <!--原来是确认-->
                <!--<nf-button type="warning" @click="outsideMesCommit('ruleForm')" :loading="isloading">确认</nf-button>-->
                <nf-button type="warning" v-if="isConfig" @click="outsideMesCommit('ruleForm',0)" :loading="isloading">存草稿</nf-button>
                <nf-button type="warning" v-if="isConfig" @click="outsideMesCommit('ruleForm',1)" :loading="isloading">提报</nf-button>
                <nf-button type="warning" v-if="!isConfig" @click="outsideMesCommit('ruleForm',2)" :loading="isloading">生成档案</nf-button>
            </span>
        </div>
        <div class="add-content">
            <base-box class="base-message">
                <content-wrap title="基本信息" type="big">
                    <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="100px"
                            class="rule-form">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="加工厂商名称" prop="name">
                                    <el-input v-model.trim="ruleForm.name" maxlength="20" placeholder="请输入名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="加工厂商编号" prop="code">
                                    <el-input v-model.trim="ruleForm.code" placeholder="加工厂商编号不填则自动生成" maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="厂商评级">
                                    <el-select
                                            v-model="ruleForm.factoryRateIds"
                                            placeholder="请选择"
                                            multiple
                                            clearable
                                            filterable
                                            @change="filterDataChange">
                                        <el-option
                                            v-for="item in selectData.factoryRates"
                                            :key="item.id"
                                            :label="item.attributeValue"
                                            :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="品牌">
                                    <el-select
                                            v-model="ruleForm.attrIds"
                                            placeholder="请选择"
                                            multiple
                                            clearable
                                            filterable
                                            @change="filterDataChange">
                                        <el-option
                                                v-for="item in selectData.brand"
                                                :key="item.id"
                                                :label="item.attributeValue"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
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
                                    <el-input v-model.trim="ruleForm.telephone" placeholder="请输入固定电话" maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="手机">
                                    <el-input v-model.trim="ruleForm.mobilePhone" maxlength="11" placeholder="请输入手机号码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="关联加工厂">
                                    <el-select
                                            v-model="ruleForm.outsideFactoryIds"
                                            placeholder="请选择"
                                            multiple
                                            clearable
                                            filterable
                                            @change="filterDataChange">
                                        <el-option
                                                v-for="item in selectData.outsideFactoryList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
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
                                    <el-input class="detailed-address" v-model.trim="ruleForm.address" type="text" maxlength="50" placeholder="请输入详细地址"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </content-wrap>
            </base-box>
            <base-box class="base-message">
                <content-wrap title="加工厂仓库" type="big">
                    <el-col :span="12">
                        <el-form
                                label-width="100px"
                                class="rule-form">
                            <el-form-item label="关联仓库">
                                <el-select
                                        placeholder="请选择"
                                        filterable
                                        clearable
                                        v-model="relevanceStoreId">
                                    <el-option :value="''" disabled style="cursor:pointer;">
                                        <div style="color: #ff9c38;" @click="handleAddStore">新建</div>
                                    </el-option>
                                    <el-option
                                            v-for="item in storeList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </content-wrap>
            </base-box>
            <!-- 附件 -->
            <base-box>
                <content-wrap title="附件" type="big">
                    <upload-form
                            :isEdit="false"
                            :tableData="ruleForm.attachmentLists"
                            :fileList="ruleForm.attachments"
                            from="outside"
                            @getFileList="getFileList"
                            @getAttachments="getAttachments"></upload-form>
                </content-wrap>
            </base-box>
        </div>
        <!--加工厂商重名弹窗-->
        <el-dialog
                class="repertory_dialog repertory_dialog--dele"
                :visible.sync="dialogVisible"
                :modal-append-to-body="false">
            <div class="body">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p style="color:#3b3b3b;font-size:16px;">{{ dialogMsg }}</p>
            </div>
            <div class="footer">
                <nf-button @click="cancelBtn()">取消</nf-button>
                <nf-button type="warning" @click="importMes()">导入</nf-button>
            </div>
        </el-dialog>

        <!-- 新建仓库 -->
        <el-dialog
                class="repertory_dialog repertory_dialog--newAdd"
                :modal-append-to-body="false"
                :visible.sync="dialogRepertory">
            <div class="title">新建仓库</div>
            <div class="body">
                <el-input v-model="repertoryName" :maxlength="15" placeholder="请输入仓库名称"></el-input>
            </div>
            <div class="footer">
                <nf-button @click="dialogRepertory = false">取消</nf-button>
                <nf-button type="warning" @click="handleNext">创建</nf-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getPosition,
        getStorehousesByUserId,
        addStorehouse,
    } from "@/api/api";
    import config from "@/config/index";
    import {
        billReviewConfig,
        getoutsideFactoryForm,
        outsideFactoryInsert,
        outsideFactoryUpdate,
        checkOutsideName,
        checkOutsideCode,
        importOutsideMes,
        getFacCommonAttrs,
        outsideFactoryListForSelect,
    } from "@/api";
    import uploadForm from '@/components/Common/uploadForm'; // 上传表格
    export default {
        name: "addOutSide",
        props: {
            type: String,
            outsideId: String,
            storeData: Object,
        },
        components: {
            uploadForm
        },
        data() {
            //自定义加工厂商名称校验
            var validateName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('加工厂商名称不能为空'));
                } else {
                    //检查是否重名
                    if (this.type === 'edit' && this.ruleForm.name === this.beforEditName) {
                        callback();
                    } else {
                        let params = {
                            factoryId: this.unitId,
                            userId: this.userId,
                            name: this.ruleForm.name
                        };
                        checkOutsideName(params).then(res => {
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
                                this.dialogMsg = '此加工厂商名称已经存在，是否将其导入？';
                                this.dialogVisible = true;
                                callback();
                            } else if (res.data.code === 3) {
                                //本厂已存在相同名字
                                callback(new Error('本厂已存在相同加工厂商名称'));
                            }
                        });
                    }
                }
            };
            //自定义加工厂商编号校验
            var validateCode = (rule, value, callback) => {
                if (this.type === 'edit' && !value) {
                    callback(new Error('加工厂商编号不能为空'));
                } else {
                    //检查是否重名
                    if (!value || this.type === 'edit' && this.ruleForm.code === this.beforEditCode) {
                        callback();
                    } else {
                        let params = {
                            factoryId: this.unitId,
                            userId: this.userId,
                            code: this.ruleForm.code
                        };
                        checkOutsideCode(params).then(res => {
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
                                this.dialogMsg = '此加工厂商编号已经存在，是否将其导入？';
                                this.dialogVisible = true;
                                callback();
                            } else if (res.data.code === 3) {
                                //本厂已存在相同编号
                                callback(new Error('本厂已存在相同加工厂商编号'));
                            }
                        });
                    }
                }
            };
            return {
                ruleForm: {
                    name:'',
                    code:'',
                    factoryRateIds:[],
                    attrIds:[],
                    contacts:'',
                    telephone:'',
                    mobilePhone:'',
                    outsideFactoryIds:[],
                    provinceName:'',
                    address:'',
                    attachmentLists:[],
                    attachments:[]
                },
                options2: [],
                props: {
                    value: "code",
                    label: "label",
                    children: "cities"
                },
                dialogVisible: false,    //重名验证弹窗
                rules: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    code: [
                        { validator: validateCode, trigger: 'blur' }
                    ]
                },
                beforEditName: '',  //编辑之前的名字，用于查重
                beforEditCode: '',  //编辑之前的编号，用于查重
                version: '',        //版本号
                provinceId: '',     //省id
                cityId: '',         //市id
                areaId: '',         //区id
                cityFlag: true,     //是否显示地区信息div
                importId: '',        //导入时候需要使用的加工厂商id
                isloading: false,   //防止多次点击
                arr:[],
                dialogMsg:'',         //导入提示信息
                selectData:{
                    factoryRates:[],
                    brand:[],
                    outsideFactoryList:[]
                },
                isConfig: false,       //是否配置审核台
                relevanceStoreId:'',    //关联仓库id
                relevanceStoreName:'',    //关联仓库id
                storeList:[],   //关联仓库列表
                dialogRepertory: false, //新建仓库弹窗
                repertoryName: '',  //新建仓库名
            }
        },
        computed: {
            title: function () {
                if (this.type === 'add') {
                    return "新建加工厂商";
                } else if (this.type === 'edit') {
                    return "编辑加工厂商";
                }
            },
            //拼接所属地区
            detailedAddress() {
                let address = '';
                if (this.ruleForm.provinceName && this.ruleForm.cityName && this.ruleForm.areaName) {
                    address = this.ruleForm.provinceName + ' / ' + this.ruleForm.cityName + ' / ' + this.ruleForm.areaName;
                }
                return address;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
        },
        methods: {
            // 创建仓库
            handleNext(){
                if (this.repertoryName === "") {
                    this.$message.error("请填写仓库名称");
                    return;
                }
                let params = {
                    unitId: this.unitId,
                    userId: this.userId,
                    name: this.repertoryName,
                    kind: 2,    //1-自用仓库，2-加工厂仓库
                };
                addStorehouse(params).then(res => {
                    if(res.data.code === 0){
                        this.relevanceStoreId = res.data.data.id;
                        this.relevanceStoreName = res.data.data.name;
                        this.getStorehousesList();
                        this.repertoryName = '';
                        this.dialogRepertory = false;
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            // 仓库列表
            getStorehousesList(){
                getStorehousesByUserId({facId:this.unitId,userId:this.userId,kind: 1}).then(res => {
                    if(res.data.code === 0){
                        this.storeList = res.data.data;
                        if(this.storeData.id){
                            //把已关联的仓库放回下拉列表中
                            this.storeList.push(this.storeData);
                        }
                    }
                })
            },
            //新建仓库
            handleAddStore(){
                $(".el-select-dropdown").css('display','none');
                this.dialogRepertory = true;
                if(this.ruleForm.name){
                    this.repertoryName = `${this.ruleForm.name}仓库`;
                }else{
                    this.repertoryName = '';
                }
            },
            //是否有审核台
            getBillReviewConfig(){
                billReviewConfig({unitId:this.unitId}).then(res=>{
                    if(res.data.data.configs && res.data.data.configs.length>0){
                        //是否有审核台
                        this.isConfig = res.data.data.configs.some(v => v.billType == 'OUTSIDE_FACTORY')
                    }
                })
            },
            // 获取关联加工厂列表
            getOutsideFactoryList(){
                let params= {
                    factoryId: this.unitId,
                    userId:this.userId
                };
                outsideFactoryListForSelect(params).then(res=>{
                    if(res.data.code ===0){
                        this.selectData.outsideFactoryList = res.data.data;
                    }
                })
            },
            //获取供应商评级，品牌下拉列表值
            getCommonInfoAttr(type, key) {
                let paramsCommonMsg = {
                    type: type,
                    userId: this.userId
                };
                getFacCommonAttrs(paramsCommonMsg).then(res => {
                    if(res.data.code === 0){
                        this.selectData[key] = res.data.data[key];
                        console.log(this.selectData);
                    }
                });
            },
            // 获取上传列表
            getFileList(v) {
                let list = v;
                // 增加附件标签和附件名称两个属性，给后台判断用
                list.forEach(item =>{
                    item.attachmentTag = item.tag;      //附件标签
                    item.attachmentName = item.fileName;    //附件名称
                    item.attachmentCode = item.code;
                    item.attachmentNumber = item.attachmentNumber; // 附件编号
                    item.dateCompleted = item.dateCompleted; // 附件日期
                });
                this.ruleForm.attachmentLists = list;

            },
            getAttachments(v) {
                this.ruleForm.attachments = v
            },
            //隐藏组件
            cancelClick() {
                this.$emit('hideCover');
            },
            //更新父组件数据
            updateSupData() {
                this.$emit('update');
            },
            //取消导入加工厂商名称
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
            //导入加工厂商名称
            importMes() {
                this.isloading = true;
                let params = {
                    id: this.importId,
                    factoryId: this.unitId,
                };
                importOutsideMes(params).then(res => {
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
                let params = {
                    id: this.outsideId,
                    userId: this.userId
                };
                getoutsideFactoryForm(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //封装品牌和关联加工厂的显示格式
                        let brandArr = [];
                        let factoryRelaArr = [];
                        let f_id = [];
                        data.attrIds.forEach(v => {
                            brandArr.push(v.id);
                        });
                        data.amongRelas.forEach(v => {
                            factoryRelaArr.push(v.id);
                        });
                        // 进行厂商评级的id提取
                        data.factoryRateIds.forEach( vm => {
                            f_id.push(vm.id);
                        });
                        data.attrIds = brandArr;
                        data.outsideFactoryIds = factoryRelaArr;
                        data.factoryRateIds = f_id;
                        //封装表格附件格式
                        data.attachmentLists.forEach(item => {
                            item.fileName = item.attachmentName;
                            item.tag = item.attachmentTag;
                            item.code = item.attachmentCode;
                            item.attachmentNumber = item.attachmentNumber;
                            item.dateCompleted = item.dateCompleted;
                        });
                        this.ruleForm = data;
                        this.relevanceStoreId = data.commonStorehouseId;
                        this.relevanceStoreName = data.commonStorehouseName;
                        this.version = data.version;
                        this.provinceId = data.provinceId;
                        this.cityId = data.cityId;
                        this.areaId = data.areaId;
                        this.beforEditName = data.name;
                        this.beforEditCode = data.code;
                    }else{
                        //失败提示
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //物料加工厂商新增和编辑提交
            outsideMesCommit(formName,addType) {
                //检测必填项
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //验证手机号码
                        const supplierPhone = this.ruleForm.mobilePhone;
                        if(supplierPhone){
                            if(/^1\d{10}$/.test(supplierPhone)){
                            }else{
                                this.$message({
                                    type: "error",
                                    duration: config.elementUI.duration,
                                    showClose: true,
                                    message: "手机号码格式错误"
                                });
                                return false;
                            }
                        }
                        //验证加工厂商编号
                        const supplierCode = this.ruleForm.code;
                        if(supplierCode){
                            if(/^[0-9a-zA-Z-]*$/g.test(supplierCode)){
                            }else{
                                this.$message({
                                    type: "error",
                                    duration: config.elementUI.duration,
                                    showClose: true,
                                    message: "加工厂商编号只能为字母、数字或 “-”"
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
                        //新增加工厂商
                        this.isloading = true;
                        if (this.type === 'add') {
                            let params = {
                                factoryId: this.unitId,
                                userId: this.userId,
                                name: this.ruleForm.name,
                                code: this.ruleForm.code,
                                telephone: this.ruleForm.telephone,
                                mobilePhone: this.ruleForm.mobilePhone,
                                address: this.ruleForm.address,
                                provinceId: this.provinceId,
                                cityId: this.cityId,
                                areaId: this.areaId,
                                factoryRateIds: this.ruleForm.factoryRateIds,     //厂商评级id
                                attrIds: this.ruleForm.attrIds,     //品牌属性id
                                contacts: this.ruleForm.contacts,       //联系人
                                outsideFactoryIds: this.ruleForm.outsideFactoryIds,     //关联加工厂
                                attachmentLists: this.ruleForm.attachmentLists,     //附件表格
                                attachments: this.ruleForm.attachments,     //其他附件
                                commonStorehouseId: this.relevanceStoreId, //关联仓库
                                addType
                            };
                            outsideFactoryInsert(params).then(res => {
                                if(res.data.code === 0){
                                    console.log(res,'新建加工厂商成功')
                                    this.$emit("getName",this.ruleForm.name)
                                    this.$emit('addSuccess',res.data.data)
                                    this.updateSupData();
                                    this.cancelClick();
                                }else{
                                    //失败提示
                                    this.$message.error(res.data.msg);
                                }
                                this.isloading = false;
                            });
                        }
                        //编辑加工厂商
                        else if (this.type === 'edit') {
                            let params = {
                                factoryId: this.unitId,
                                id: this.outsideId,
                                userId: this.userId,
                                version: this.version,
                                name: this.ruleForm.name,
                                code: this.ruleForm.code,
                                telephone: this.ruleForm.telephone,
                                mobilePhone: this.ruleForm.mobilePhone,
                                address: this.ruleForm.address,
                                provinceId: this.provinceId,
                                cityId: this.cityId,
                                areaId: this.areaId,
                                factoryRateIds: this.ruleForm.factoryRateIds,     //厂商评级id
                                attrIds: this.ruleForm.attrIds,     //品牌属性id
                                contacts: this.ruleForm.contacts,       //联系人
                                outsideFactoryIds: this.ruleForm.outsideFactoryIds,     //关联加工厂
                                attachmentLists: this.ruleForm.attachmentLists,     //附件表格
                                attachments: this.ruleForm.attachments,     //其他附件
                                commonStorehouseId: this.relevanceStoreId, //关联仓库
                                addType
                            };
                            outsideFactoryUpdate(params).then(res => {
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
        created() {
            this.getStorehousesList();
            this.getBillReviewConfig()
            this.cityData();
            this.getCommonInfoAttr("factoryRate", "factoryRates");
            this.getCommonInfoAttr("brand", "brand");
            this.getOutsideFactoryList();
            if (this.type === 'edit') {
                this.initTableMes();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~scss_vars";
    .add-outside-factory {
        position: fixed;
        top: 0;
        right: 0;
        width: 1000px !important;
        height: 100%;
        overflow-y: auto;
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
            overflow: hidden;
            .base-message .content_wrap{
                overflow: hidden;
                border-bottom: 1px solid #EDEFF2;
            }
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
    }
</style>
<style lang="scss">
    //解决下拉列表被隐藏，等待很久才出现的bug
    .el-select-dropdown,.el-cascader-menus{
        z-index: 3000 !important;
    }
    .add-outside-factory{
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
        .rule-form{
            .el-input{
                width: 250px;
                &.detailed-address{
                    width: 623px;
                }
            }
        }
        .repertory_dialog--newAdd{
            min-height: 260px;
            .el-dialog {
                width: 400px;
            }
            .el-dialog__body{
                padding: 0 20px;
                .body{
                    padding:30px 0;
                }
            }
            .footer {
                display: flex;
                justify-content: center;
                padding: 0 20px 20px;
            }
        }
    }

</style>
