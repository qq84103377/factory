<template>
    <div class="factory_set" id="factory_set">
        <header class="header">
            <span>添加工厂</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="handleClick">取消</nf-button>
                <nf-button style="width: 98px;" type="warning" @click="setFactory()">完成</nf-button>
            </span>
        </header>
        <div class="container_addFac facad">
            <!-- 基本信息 -->
            <div class="container_header">
                <span class="container_header_left">
                    <span class="line_yellow"></span>
                    <span class="container_header_left_text">工厂信息</span>
                </span>
            </div>
            <div class="container_baseInfoAdd clearfix">
                <div class="item">
                    <span class="label important">工厂名称</span>
                    <span class="inp">
                        <el-input v-model.trim="facName" type="text" placeholder="请输入工厂名称"></el-input>
                    </span>
                </div>
                <div class="item">
                    <span class="label">联系人</span>
                    <span class="inp">
                        <el-input v-model="contactName" type="text" placeholder="请输入联系人"></el-input>
                    </span>
                </div>
                <div class="item">
                    <span class="label">座机号码</span>
                    <span class="inp">
                        <span class="nf-input w100">
                            <el-input v-model="zoneDes" type="text" placeholder="区号"></el-input>
                        </span>
                        -
                        <span class="nf-input w140">
                            <el-input v-model="telephone" type="text" placeholder="座机号码"></el-input>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <span class="label">手机号码</span>
                    <span class="inp">
                        <el-input v-model="mobilePhone" type="text" placeholder="请输入手机号码"></el-input>
                    </span>
                </div>
                <div class="item">
                    <span class="label">所属地区</span>
                    <span class="inp">
                        <el-cascader style="width: 250px;" show-all-levels :options="options2" @change="handleChange" @active-item-change="handleItemChange" :props="props"></el-cascader>
                    </span>
                </div>
                <div class="item item_big">
                    <span class="label">详细地址</span>
                    <span class="inp">
                        <el-input v-model="address" type="text" placeholder="请输入详细的地址信息，如街道名称，门牌号码等"></el-input>
                    </span>
                </div>
                <div class="item item_logo">
                    <span class="label">工厂logo</span>
                    <img v-if="logos" style="height:80px;width:80px;margin-right:16px;" :src="logos">
                    <span v-else class="imgHead" @click="changeLogo">
                        <img src="../../assets/images/commom-plus.png" />
                    </span>
                </div>
            </div>
            <uploadpic v-if="isUpload" :img="logos" @getImg="handleGetImgUrl"></uploadpic>
        </div>
        <div class="container_relation">
            <content-wrap title="关联仓库" type="big">
                <el-checkbox-group v-model="storehouseIds">
                    <div class="wrap" v-for="item in repertorylist">
                        <el-checkbox :label="item.id" :disabled="item.id === defaultStorehouseId" style="margin: 8px 0;">
                            <span class="ellipsis_1">{{item.name}}</span>
                        </el-checkbox>
                        <span class="tip" v-if="defaultStorehouseId === item.id"><img src="../../assets/images/default_tip.png"></span>
                        <span class="button" v-else-if="storehouseIds.indexOf(item.id) > -1" @click="handleDefault(item.id)">设为默认</span>
                    </div>
                </el-checkbox-group>
            </content-wrap>
        </div>
        <!-- <div class="container_relation" style="margin-bottom: 100px">
            <content-wrap title="关联生产准备中心" type="big">
                <span v-if="proTips" style="color:#fa4150;" slot="titleDesc">请至少关联一个生产准备中心</span>
                <el-checkbox-group v-model="proIds">
                    <div class="wrap" v-for="item in proData">
                        <el-checkbox :label="item.id" style="margin: 8px 0;">
                            <span class="ellipsis_1">{{item.name}}</span>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </content-wrap>
        </div> -->
    </div>
</template>

<script>
import uploadpic from "./UpdatePic.vue";
import {
    createUnit,
    getUploadToken,
    upDetailImg,
    checkUnitName,
    getMyInfo,
    getEasyFactorys,
    getBossStorehouses,
    getPosition,
    queryProductPrepareCenterListEasy
} from "../../api/api";
import md5 from "js-md5";
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
export default {
    data() {
        return {
            isLoading: false,
            selectedOptions: [],
            options: [],
            facName: "",
            logo: "",
            zoneDes: "",
            telephone: "",
            contactName: "",
            mobilePhone: "",
            // 省名称
            provinceName: "",
            // 城市名称
            cityName: "",
            // 区域
            areaName: "",
            // 具体地址
            address: "",
            //图片地址
            _imgUrl: "",
            facNewId: "",
            isUpload: false,
            logos: "",
            options2: [],
            props: {
                value: "code",
                label: "label",
                children: "cities"
            },
            repertorylist: [{ name: "-", id: "-" }], // 仓库集合
            storehouseIds: [], // 需要关联的仓库ID集合
            defaultStorehouseId: "", // 默认仓库ID,
            proData:[],
            proIds:[],
            proTips:false,
            userId: '',
            arr:[]
        };
    },
    components: {
        uploadpic
    },
    methods: {
        // 获取体系下所有仓库
        async AjaxGetBossStorehouses() {
            let params = {
                userId: this.userId
            };
            console.log(params,'============');
            try {
                let data = (await getBossStorehouses(params)).data;
                (await data.code) === 0 && (this.repertorylist = data.data);
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        },
        // async queryProductPrepareCenterListEasy() {
        //     let params = {
        //         facId:JSON.parse(sessionStorage.getItem('last_login')).id,
        //         userId: this.userId,
        //         keyword:'',
        //     };
        //     await queryProductPrepareCenterListEasy(params).then(
        //         res => {
        //             console.log(res);
        //             this.proData = res.data.productPrepareCenterList;
        //         }
        //     )
        // },
        // 设为默认仓库
        handleDefault(id) {
            this.defaultStorehouseId = id;
        },
        // 显示隐藏
        handleClick() {
            this.$emit("toggle");
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
        handleChange(val) {
            // console.log(val);
            this.provinceName = val[0];
            this.cityName = val[1];
            this.areaName = val[2] || "";
        },
        isNotANumber(inputData) {
            //isNaN(inputData)不能判断空串或一个空格
            //如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
            if (parseFloat(inputData).toString() == "NaN") {
                //alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
                return false;
            } else {
                return true;
            }
        },
        setFactory() {
            var _this = this;
            // if (this.isLoading) {
            //   return;
            // }
            // this.isLoading = true;
            //判断工厂名字是否书写正确
            if (this.facName.length < 2 || this.facName.length > 20) {
                this.$message({
                    type: "error",
                    duration: this.$globalConfig.elementUI.duration,
                    showClose: true,
                    message: "名字长度为2到20个长度"
                });
                return false;
            }
            // else if(this.proIds.length===0) {
            //     this.$message({
            //         type: "error",
            //         duration: this.$globalConfig.elementUI.duration,
            //         showClose: true,
            //         message: "请至少关联一个生产准备中心"
            //     });
            //     this.proTips = true;
            //     return false;
            // }
            //判断座机号码是否正确
            var shortphone = this.zoneDes + this.telephone;
            //console.log(shortphone);
            if (shortphone) {
                if (/^0\d{2,3}-?\d{7,8}$/.test(shortphone)) {
                } else {
                    this.$message({
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration,
                        showClose: true,
                        message: "座机号码填写错误"
                    });
                    return false;
                }
            }
            //联系人姓名做长度限制
            if (this.contactName.length > 50) {
                this.$message({
                    type: "error",
                    duration: this.$globalConfig.elementUI.duration,
                    showClose: true,
                    message: "联系人姓名过长"
                });
                return false;
            }
            //联系人电话做限制
            if (this.mobilePhone) {
                if (/^1\d{10}$/.test(this.mobilePhone)) {
                } else {
                    this.$message({
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration,
                        showClose: true,
                        message: "联系人手机号码输入错误"
                    });
                    return false;
                }
            }
            //限制具体地址
            if (this.address.length > 300) {
                this.$message({
                    type: "error",
                    duration: this.$globalConfig.elementUI.duration,
                    showClose: true,
                    message: "输入地址过长"
                });
                return false;
            }
            let checkUnitNameParams = {
                name: this.facName,
                userId: this.user_Ids,
                token: ""
            };
            checkUnitName(checkUnitNameParams).then(res => {
                // this.isLoading = false;
                if (res.data.code == 3) {
                    this.$message({
                        type: "error",
                        duration: this.$globalConfig.elementUI.duration,
                        showClose: true,
                        message: res.data.msg
                    });
                } else {
                    let logos = this.logos.slice(
                        1 + this.logos.lastIndexOf("/")
                    );
                    let params = {
                        appId: this.$globalConfig.appId.appId,
                        name: this.facName,
                        logo:
                            logos ||
                            "513d03b1665344e9a629d96dfaae6f63_dev_895aed29a938aaa65e83b0ea308feeea",
                        telephone: this.telephone,
                        contactName: this.contactName,
                        mobilePhone: this.mobilePhone,
                        provinceId: this.provinceName,
                        cityId: this.cityName,
                        areaId: this.areaName,
                        address: this.address,
                        userId: this.user_Ids,
                        areaCode: this.zoneDes,
                        defaultStorehouseId: this.defaultStorehouseId,
                        storehouseIds: this.storehouseIds,
                        productPrepareCenterIds:this.proIds,
                    };
                    //console.log(params,"参数");
                    createUnit(params).then(res => {
                        //console.log(res);
                        this.facNewId = res.data.data;
                        if (res.data.code == 0) {
                            this.$message({
                                type: "success",
                                duration: this.$globalConfig.elementUI.duration,
                                showClose: true,
                                message: res.data.msg
                            });
                            // let obUserOld = JSON.parse(sessionStorage.getItem('user_login'));
                            // obUserOld.unitId = res.data.data; 
                            // let o = JSON.parse(JSON.stringify(obUserOld)) 
                            // sessionStorage.setItem("user_login",JSON.stringify(o) );                
                            this.handleClick();
                            this.$store.dispatch("getFacs");
                            let params1 = {
                                appId: this.$globalConfig.appId.appId,
                                token: "",
                                userId: this.userId
                            };
                            getMyInfo(params1).then(function(res) {
                                //console.log(res, 'getMyInfo老板登录后的信息');
                                if (res.data.code == 0) {
                                    //console.log(res,"这个什么鸡腿")
                                    sessionStorage.setItem(
                                        "user_info",
                                        JSON.stringify(res.data.data)
                                    );
                                    _this.$store.commit("UPDATAPWD");
                                    _this.$router.push({
                                        path: "/factoryMangement"
                                    });
                                }
                            });
                            let paramsFac = {
                                token: "",
                                userId: this.userId
                            };
                            // getEasyFactorys(paramsFac).then(res => {
                            //     let user_login = JSON.parse(
                            //         sessionStorage.getItem("user_login")
                            //     );
                            //     user_login.data.unitId = res.data[0].id;
                            //     sessionStorage.removeItem("user_login");
                            //     sessionStorage.setItem(
                            //         "user_login",
                            //         JSON.stringify(user_login)
                            //     );
                            // });
                            sessionStorage.removeItem("user_pic");
                            sessionStorage.setItem("user_pic", this._imgUrl);
                            this.$router.push(
                                "/editFacInfo?id=" + this.facNewId
                            );
                        }
                    });
                }
            });
        },
        changeLogo() {
            this.isUpload = !this.isUpload;
        },
        //获取子组件的logo
        handleGetImgUrl(url) {
            this.logos = this.$globalConfig.qiniu.baseUrl + url || "";
            // console.log(this.logos);
        }
    },
    computed: {
        user_Ids() {
            return this.userId;
        }
    },
    created() {
        this.cityData();
        this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        this.AjaxGetBossStorehouses(); // 获取体系下所有仓库
        // this.queryProductPrepareCenterListEasy();// 获取准备中心的列表
    }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
.nf-input {
    display: inline-block;
    width: auto;
}
.w100 {
    width: 80px;
}
.w140 {
    width: 156px;
}
.factory_set {
    position: absolute;
    top: 0;
    right: 0;
    padding-top: 96px;
    padding-bottom: 200px;
    width: 750px !important;
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;
    z-index: 101;
    box-sizing: border-box;
    .header {
        position: fixed;
        top: 0;
        width: 750px;
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
        z-index: 20;
    }
    .container_addFac {
        box-sizing: border-box;
        padding: 32px;
        .container_header {
            display: flex;
            justify-content: space-between;
            .container_header_left {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .line_yellow {
                    height: 20px;
                    width: 6px;
                    display: inline-block;
                    background-color: $color-btn;
                }
                .container_header_left_text {
                    font-size: 20px;
                    margin-left: 10px;
                }
            }
        }
        .container_baseInfoAdd {
            padding-left: 16px;
            padding-top: 32px;
            .item {
                float: left;
                margin-right: 30px;
                margin-bottom: 18px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                color: #3b3b3b;
                font-size: 14px;
                width: 318px;
                &:nth-of-type(2n) {
                    margin-right: 0;
                }
                .label {
                    margin-right: 12px;
                    float: left;
                    width: 56px;
                    text-align: right;
                    line-height: 36px;
                }
                .inp {
                    float: left;
                    width: 250px;
                }
                .imgHead {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                    background: #f5f7fa;
                    text-align: center;
                    line-height: 80px;
                    cursor: pointer;
                    &:hover {
                        box-shadow: 0 4px 6px 0 #dce0e6;
                    }
                    img {
                        width: 16px;
                        height: 16px;
                    }
                }
            }
            .item_big {
                width: 100%;
                .inp {
                    width: 602px;
                }
            }
            .item_logo {
                margin-bottom: 0;
                padding-bottom: 32px;
                width: 100%;
                border-bottom: 1px solid #e0e6ed;
            }
        }
    }
    .container_relation {
        padding: 0 32px 32px 46px;
        .wrap {
            display: inline-block;
            width: 50%;
            &:hover .button {
                display: inline-block;
            }
        }
        .tip {
            position: relative;
            top: 3px;
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
    .important {
        position: relative;
        &::before {
            position: absolute;
            left: -5px;
            top: -1px;
            content: "*";
            color: #ff0000;
        }
    }
}
</style>
<style lang="scss">
#factory_set .el-input__inner {
    height: 34px;
    padding-left: 0.6em;
    &::-webkit-input-placeholder {
        color: #636363;
    }
}
</style>





