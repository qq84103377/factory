<template>
    <div class="addCustomer">
        <div class="customer-header">
            <div class="customer-title">
                <div class="title-block">
                    <span>添加客户</span>
                </div>

                <div class="title-btns">
                    <nf-button @click="addCustomer(false)">取消</nf-button>
                    <nf-button type="warning"  @click="addCustomer(true)">确定</nf-button>
                </div>
            </div>
        </div>
        <div class="customer-content">
            <div class="base-info">
                <title-line background></title-line>
                基本信息
            </div>
            <div class="customer-info">
                <div class="input-info">
                    <div class="input-info-name">
                        <span class="start pos">*</span>客户姓名
                        <div class="nf-input w260">
                            <el-input type="text" :maxlength="19" @blur="checkName(customer.name)"
                                      v-model="customer.name"></el-input>
                        </div>
                    </div>

                    <div class="input-info-phone" style="margin: 20px 0">
                        客户分组
                        <div class="nf-input w260">
                            <el-select style="width: 260px;" clearable popper-class="popperClass"  v-model="customer.groupId" placeholder="请选择">
                                <el-option value="dfd" style="display: none"></el-option>
                                <p @click="addGroupVisibleGo" style="color: #eb8d2f;padding-left: 16px;cursor: pointer">+新建</p>
                                <el-option
                                        v-for="item in groupLists"
                                        :key="item.groupId"
                                        :label="item.groupName"
                                        :value="item.groupId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="input-info-phone">
                        手机号码
                        <div class="nf-input w260">
                            <el-input type="text" @blur="checkPhone(customer.phone)"
                                      v-model="customer.phone"></el-input>
                        </div>
                    </div>
                </div>


                <div class="customerAddr">
                    客户地址
                    <div class="nf-input w700">
                        <el-input type="text" v-model="customer.addr" placeholder="请输入地址信息"></el-input>
                    </div>
                </div>

                <div class="remark">
                    <span class="remark-lebel">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</span>
                    <div class="nf-input w700">
                        <!-- <textarea v-model="customer.remark" placeholder="请输入备注信息" cols=50         rows=4></textarea> -->
                        <el-input
                                type="textarea"
                                :rows="4"
                                placeholder="请输入备注信息"
                                v-model="customer.remark">
                        </el-input>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
                id="require"
                title=""
                :visible.sync="dialogVisible"
                :show-close="false"
                size="tiny">
            <p>该客户的资料在其他分厂已经存在，是否要导入本厂？</p>

            <div class="btn">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="checked()">确 定</el-button>
            </div>

        </el-dialog>
        <!--新建分组-->
        <el-dialog  class="custom-dialog" title="新建客户分组" style="background: rgba(0,0,0,0.5)"
                   :visible.sync="addGroupVisible" size="tiny">
            <div style="text-align: center;">
                <el-input v-model.trim="groupName" style="width: 260px;" auto-complete="off"
                          placeholder="请输入分类号"></el-input>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addGroupVisible = false">取 消</el-button>
                <el-button  type="primary" @click="addCustomerGroup">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import {addFacCustomer, checkFacCustomerName,addCustomerGroup,getCustomerGroupLists} from '../../api/api'

    export default {
        props:['customerEdit','selGroupId'],
        data() {
            return {
                groupLists:[],
                addGroupVisible:false,
                // 数据
                customer: {
                    groupId: '',
                    name: '',
                    addr: '',
                    remark: '',
                    phone: ''
                },
                dialogVisible: false,
                isLoading: false,
            }
        },
        computed: {
            // 计算属性
            unitId(){
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
        },
        methods: {
            getCustomerGroupLists(){
                getCustomerGroupLists({unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.groupLists = res.data.data
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            addGroupVisibleGo(){
                this.addGroupVisible=true;
                this.groupName = '';
                $('.popperClass').css('display','none')
            },
            addCustomerGroup(){
                addCustomerGroup({groupName:this.groupName,unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.getCustomerGroupLists()
                        this.customer.groupId = res.data.data
                        this.addGroupVisible = false
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            // 方法
            checkPhone(phone) {
                /**
                 *  检查手机号
                 */
                if(phone){
                    let reg = /^[1][0-9]{10}$/;
                    if(!reg.test(phone)){
                        this.customer.phone = '';
                        return this.$message({
                            type: "error",
                            message: '格式不正确,此项可以不填',
                            showClose: true,
                            duration: this.$globalConfig.elementUI.duration
                        })
                    }
                }
            },
            checkName(name) {
                //客户查重
                if (name.length > 26) {
                    return this.$message({
                        type: "error",
                        message: '内容太长',
                        showClose: true,
                        duration: this.$globalConfig.elementUI.duration
                    })
                }
                checkFacCustomerName({
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "name": name,
                    "token": ""
                }).then(res => {
                    if (res.data.code == 0) {
                        this.dialogVisible = true;
                        this.customerId = res.data.data;
                    }else{
                        if(res.data.code!=4) {
                            return this.$message({
                                type: "error",
                                message: res.data.msg,
                                showClose: true,
                                duration: this.$globalConfig.elementUI.duration
                            })
                        }
                    }
                })

            },
            checked() {
                let _this = this;
                let params = {
                    "token": '',
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "customerId": this.customerId
                }
                _this.dialogVisible = false
                addFacCustomer(params).then(function (res) {
                    _this.$router.go(-1)
                    _this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: "success",
                    });
                })
            },
            addCustomer(type) {
                var _this = this
                // if (_this.isLoading) {
                //     return
                // }
                if (type) {
                    // _this.isLoading = true;
                    if (_this.customer.name.length > 26) {
                        return this.$message({
                            type: "error",
                            message: '名字太长',
                            showClose: true,
                        })
                    }
                    if(_this.customer.phone){
                        let reg = /^[1][0-9]{10}$/;
                        if(!reg.test(_this.customer.phone)){
                            _this.customer.phone = '';
                            return this.$message({
                                type: "error",
                                message: '格式不正确,此项可以不填',
                                showClose: true,
                            })
                        }
                    }
                    if(_this.customer.addr){
                        if(_this.customer.addr.length>120){
                            return this.$message({
                                type: "error",
                                message: '格式不正确,此项可以不填',
                                showClose: true,
                            })
                        }
                    }
                    if(_this.customer.remark){
                        if(_this.customer.addr.length>120){
                            return this.$message({
                                type: "error",
                                message: '格式不正确,此项可以不填',
                                showClose: true,
                            })
                        }
                    }

                    if (_this.customer.name) {
//                        var reg = /^1(3|4|5|8)[0-9]{9}$/
//                        if (_this.customer.phone) {
//                            if (!reg.test(_this.customer.phone)) {
//                                return _this.$message({
//                                    showClose: true,
//                                    message: '请填写正确的手机号',
//                                    type: "error",
//                                });
//                            }
//                        }
                        //添加客户 , 先查重
                        let params = {
                            "token": "",
                            "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                            "name": _this.customer.name
                        }
                        checkFacCustomerName(params).then(res => {
                            //*(res, '查重结果');
                            if(res.data.code ==0) {
                                this.$message.error(res.data.msg);
                                return;
                            };
                            if (res.data.code == 4) {
                                let params = {
                                    "token": '',
                                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                                    "name": _this.customer.name || '',
                                    "customerId": '',
                                    "address": _this.customer.addr || '',
                                    "groupId": _this.customer.groupId || '',
                                    "phone": _this.customer.phone || '',
                                    "remark": _this.customer.remark || ''
                                }
                                ////console.log(params, '-----');

                                addFacCustomer(params).then(function (res) {
                                    ////console.log(res, '创建状态!!!');
                                    _this.$message({
                                        showClose: true,
                                        message: res.data.msg,
                                        type: "success",
                                    });
                                    // _this.isLoading = false;
                                    _this.$emit('toggle',true,res.data.data)
                                })
                            } else if (res.data.code == 2) {
                                // _this.dialogVisible = true
                                // _this.isLoading = false;

                                _this.$message({
                                    showClose: true,
                                    message: res.data.msg,
                                    type: "error",
                                });
                            }
                            else if (res.data.code == 0 && res.data.data != "") {
                                // _this.isLoading = false;

                                // _this.dialogVisible = true;
                                _this.customerId = res.data.data;
                            }
                        })

                    } else {
                        _this.$message({
                            showClose: true,
                            message: '必须输入姓名',
                            type: "error",
                        });
                        _this.isLoading = false;
                    }
                }
                else {
                    _this.$message({
                        showClose: true,
                        message: '已取消',
                        type: "warning",
                    });
                    _this.isLoading = false;
                    // _this.$router.push("/customer")
                    _this.$emit('toggle',false)

                }

            }
        },
        created: function () {
            this.getCustomerGroupLists()
            if(this.customerEdit){
                //编辑
                this.customer = this.customerEdit
            }
            if(this.selGroupId){

                this.customer.groupId = this.selGroupId
            }
            // 生命周期实例化钩子函数
        },
        mounted: function () {
            // 生命周期渲染后钩子函数
        },
        watch: {
            // 监听属性变化
        }
    }
</script>

<style lang="scss" scoped>
    @import '~scss_vars';

    .addCustomer {
        height: 100%;
        position: fixed;
        right: 0;
        top: 0;
        z-index: 3000;
        width: 1000px;
        background: #fff;
        overflow-y: auto;
        .customer-header {
            padding-left: 32px;
            padding-right: 32px;
            line-height: 68px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06);
            background-color: #fff;
            .customer-title {
                display: flex;
                justify-content: space-between;
                .title-block {
                    color: #2c2c2c;
                    /*border-bottom: 2px solid #000;*/
                    position: relative;
                    /*top: 2px;*/
                    font-size: 24px;
                }
                .title-btns {
                    button {
                        display: inline-block;
                        border-radius: 2px;
                        width: 104px;
                        height: 36px;
                        /*margin-left: 12px;*/
                    }
                }
            }
        }
        .customer-content {
            height: 80%;
            padding: 32px;
            background-color: #fff;
            margin-top: 16px;
            .w260 {
                width: 260px;
                margin-left: 12px;
            }
            .w700 {
                width: 700px;
                margin-left: 12px;
            }
            .nf-input {
                display: inline-block;
            }
            .base-info {
                display: flex;
                align-items: center;
                font-family: MicrosoftYaHei;
                font-size: 22px;
                color: #2c2c2c;
            }
            .customer-info {
                margin-top: 30px;
                .input-info {
                    /*display: flex;*/
                    /*justify-content: flex-start;*/
                    position: relative;
                    .input-info-name {
                        margin-right: 108px;
                    }
                    .pos {
                        position: absolute;
                        left: -8px;
                        top: 14px;
                    }
                    input {
                        margin-left: 5px;
                        width: 180px;
                        height: 36px;
                        border: 1px solid #d5d5d5;
                        border-radius: 4px;
                    }
                }
                .customerAddr, .remark {
                    margin-top: 28px;
                    input, textarea {
                        padding-left: 5px;
                        margin-left: 5px;
                        width: 483px;
                        height: 36px;
                        border-radius: 4px;
                        border: solid 1px #d5d5d5;
                    }
                    textarea {
                        height: 66px;
                        width: 483px;
                        resize: none;
                        outline: none;
                    }
                }
                .remark {
                    display: flex;
                    align-items: center;
                    span {
                        margin-right: 5px;
                    }
                    .remark-lebel {
                        align-self: flex-start;
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    #require {
        p {
            font-size: 16px;
            color: #2c2c2c;
        }
        .btn {
            margin-top: 83px;
            text-align: center;
            button {
                width: 104px;
                height: 36px;
                border-radius: 2px;
                border: solid 1px #ff9c38;
                &:first-child {
                    color: #ff9c38;
                }
            }
        }
    }


</style>
