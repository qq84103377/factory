<template>
    <div class="customer-spec">
        <div class="customer-spec-header">
            <span>添加客户</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="handleClick">取消</nf-button>
                <nf-button style="width: 98px;" type="warning" @click="addCustomerSuccess">确认</nf-button>
            </span>
        </div>
        <div class="container_customer">
            <div class="container_customer_header">
                <i class="line"></i>
                <span class="customer_title">基本信息</span>
            </div>
            <div class="container_customer_info">
                <div class="first_info">
                    <div class="first_info_left">
                        <span class="must">*</span>
                        <span style="width:59px;">客户姓名</span>
                        <input :class="{'input-border':customerNameTips}" type="text" placeholder="请输入姓名" v-model="customerName" @blur="checkCustomer">
                        <span v-show="customerNameTips" class="name-tips">客户姓名不能为空</span>
                    </div>
                    <div class="first_info_right">
                        <span style="width:59px;" class="phone">手机号码</span>
                        <input type="text" placeholder="请输入手机号码" v-model="custoemrPhone">
                    </div>
                </div>
                <div class="second_info">
                    <span class="customer_address">
                        客户地址
                    </span>
                    <span>
                        <el-cascader show-all-levels :options="options2" @change="handleChange" @active-item-change="handleItemChange" :props="props"></el-cascader>
                    </span>
                </div>
                <div class="third_info">
                    <input type="text" placeholder="请输入详细的地址信息，如街道名称，门牌号码等" v-model="customerAddress">
                </div>
                <div class="fourth_info">
                    <span class="remark">备注信息</span>
                    <el-input type="textarea" :rows="5" :maxlength=200 v-model="custoemrRemark" placeholder="输入内容200字以内"></el-input>
                </div>
            </div>
        </div>
        <el-dialog :modal="false" :visible.sync="dialogVisibleCustomer" :show-close="false" size="tiny">
            <p class="p-description" slot="title">该客户在其他分厂已经存在，是否要导入本厂？</p>
            <div slot="footer" class="btn">
                <nf-button style="margin-right:12px;" @click="dialogVisibleCustomer = false">取 消</nf-button>
                <nf-button type="warning" @click="checkC">确 定</nf-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { checkFacCustomerName,addFacCustomer,getPosition } from '../../../api/api.js'
export default {
    data() {
        return {
            customerName:'',
            custoemrPhone:'',
            customerAddress:'',
            custoemrRemark:'',
            options2: [],
            props: {
                value: "code",
                label: "label",
                children: "cities"
            },
            dialogVisibleCustomer:false,
            /**其他厂已有的客户 */
            sameCustomer:'',
            provinceName:"",
            cityName:'',
            areaName:"",
            customerNameTips:false
        }
    },
    watch:{
        customerName(val) {
            if(val!=="") {
                this.customerNameTips = false;
            }
        }
    },
    methods:{
        handleClick() {
            //取消返回2则不会去选中客户填入
            this.$emit('hidden',0)
        },
        //检查客户姓名
        checkCustomer() {
            if (this.customerName == "") {
                return;
            }
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                token: "",
                name: this.customerName
            };
            checkFacCustomerName(params).then(res => {
                if (res.data.code == 0) {
                    this.dialogVisibleCustomer = true;
                    this.sameCustomer = res.data.data;
                } else if (res.data.code == 2) {
                    if (this.show_add_customer == true && this.add_customer == true) {
                        this.$message.error(res.data.msg);
                    }
                    return false;
                }
            });
        },
        //添加客户
        addCustomerSuccess() {
            let param = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                token: "",
                name: this.customerName
            };
            checkFacCustomerName(param).then(res => {
                if (res.data.code == 0) {
                    this.dialogVisibleCustomer = true;
                    this.sameCustomer = res.data.data;
                    this.customerNameTips = false;
                } else if (res.data.code == 2) {
                    this.customerNameTips = true;
                    // this.$message.error(res.data.msg);
                    return false;
                } else if (res.data.code == 4) {
                    this.customerNameTips = false;
                    let params = {
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                        name: this.customerName,
                        address: this.customerAddress,
                        phone: this.custoemrPhone,
                        remark: this.custoemrRemark,
                        provinceId: this.provinceName,
                        cityId: this.cityName,
                        areaId: this.areaName,
                        token: ""
                    };
                    if (!/^1[34578]\d{9}$/.test(params.phone) && params.phone) {
                        this.$message.error("填写的手机号码有误");
                        return;
                    }
                    addFacCustomer(params).then(res => {
                        if (res.data.code == 0) {
                            //添加成功默认选中
                            let customerId = res.data.data.id;
                            this.$emit('updateName', this.customerName, customerId);
                            this.$emit('hidden',1);
                        } else {
                            if (this.customerName == "") {
                                this.$message.error(res.data.msg );
                           }
                        }
                    });
                }
            });
        },
        /*点击确定导入其他厂的客户，此时成功后将该导入的客户作为选中的客户**/
        checkC() {
            let params = {
                token: "",
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                customerId: this.sameCustomer
            };
            addFacCustomer(params).then(res => {
                if (res.data.code == 0) {
                    //添加成功默认选中
                    this.dialogVisibleCustomer = false;
                    // this.$emit('hidden',1);
                    // let customerId = res.data.data.id;
                    this.$emit('updateName', this.customerName, this.sameCustomer);
                    this.$emit('hidden',1);
                } else {
                    this.dialogVisibleCustomer = true;
                    this.$message.error(res.data.msg );
                }
            });
        },
        handleItemChange(val) {
            if (val.length == 1) {
                var v = val[0];
            } else {
                v = val[1];
            }
            let params = {
                id: v
            };
            getPosition(params).then(res => {
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
                                    let arr = this.options2[i];
                                    for (let j = 0; j < arr.cities.length; j++) {
                                        if (arr.cities[j].code == val[1]) {
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
        handleChange(val) {
            this.provinceName = val[0];
            this.cityName = val[1];
            this.areaName = val[2] || "";
        },
        cityData() {
            getPosition({}).then(res => {
                for (let i = 0; i < res.data.positionList.length; i++) {
                    let obj = {};
                    obj.label = res.data.positionList[i].name;
                    obj.code = res.data.positionList[i].id;
                    obj.cities = [];
                    this.options2.push(obj);
                }
            });
        },
    },
    created(){
        this.cityData();
    }
}
</script>
<style lang="scss" scoped>
.customer-spec {
    position: fixed;
    top: 0;
    right: 0;
    width: 850px !important;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background-color: #fff;
    z-index: 101;
    .customer-spec-header {
        width: 850px;
        height: 88px;
        color: #3b3b3b;
        font-size: 24px;
        padding: 16px 32px 20px 32px;
        box-sizing: border-box;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e0e6ed;
        z-index: 2;
    }
    .container_customer {
        padding: 0  20px 20px;
        box-sizing: border-box;
        .container_customer_header {
            height: 82px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .line {
                width: 6px;
                height: 20px;
                background-color: #ff9c38;
                margin-right: 10px;
            }
            .customer_title {
                font-size: 20px;
                color: #2c2c2c;
            }
        }
        .container_customer_info {
            .first_info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .first_info_left {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 50%;
                    position: relative;
                    span {
                        color: #636363;
                        font-size: 14px;
                        margin-right: 11px;
                    }
                    .must {
                        color: red;
                        margin-right: 3px;
                        font-size: 14px;
                    }
                    input {
                        height: 36px;
                        box-sizing: border-box;
                        width: 260px;
                        border-radius: 2px;
                        border: 1px solid #d0d2d6;
                        text-indent: 0.8em;
                        font-size: 14px;
                    }
                    .input-border {
                        border:1px solid #FA4150;
                    }
                    .name-tips {
                        position: absolute;
                        bottom: -14px;
                        left: 78px;
                        font-size: 12px;
                        color: #FA4150;
                    }
                }
                .first_info_right {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-left: 15px;
                    width: 50%;
                    .phone {
                        color: #636363;
                        margin-right: 10px;
                    }
                    input {
                        height: 36px;
                        box-sizing: border-box;
                        width: 260px;
                        border-radius: 2px;
                        border: 1px solid #d0d2d6;
                        text-indent: 0.8em;
                        font-size: 14px;
                    }
                }
            }
            .first {
                margin-bottom: 24px;
            }
            .second_info {
                margin-top: 20px;
                .customer_address {
                    color: #636363;
                    margin-left: 10px;
                    margin-right: 5px;
                }
            }
            .third_info {
                margin-left: 75px;
                margin-top: 20px;
                input {
                    background-color: #fafafa;
                    width: 612px;
                    box-sizing: border-box;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    border: 1px solid #d0d2d6;
                    text-indent: 0.8em;
                    font-size: 14px;
                }
            }
            .fourth_info {
                margin-top: 20px;
                display: flex;
                justify-content: flex-start;
                .remark {
                    display: inline-block;
                    width: 65px;
                    color: #636363;
                    margin-left: 10px;
                    margin-right: 8px;
                }
                textarea {
                    width: 610px;
                    height: 75px;
                    border: 1px solid #d0d2d6;
                    font-size: 14px;
                    resize: none;
                    &:focus {
                        border: 1px solid #d0d2d6;
                    }
                }
            }
        }
    }
}
.p-description {
    font-size:20px;
    text-align: center;
}
.btn {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>





