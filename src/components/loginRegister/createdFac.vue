<template>
    <section class="createdFac bg_pubilc">
        <div class="createdFac_wrap">
            <div class="createdFac_wrap--title">
                创建工厂
            </div>
            <div class="createdFac_wrap--content">
                <div class="left">
                    <el-form :model="params_createdFac" label-width="68px">
                        <el-form-item :class="isErr?'is-error':''" label="工厂名称" class="important" style="margin-right: 44px">
                            <el-input v-model="params_createdFac.name" @blur="AjaxCheckUnitName" placeholder="请输入工厂名称"></el-input>
                        </el-form-item>
                        <el-form-item label="座机号码">
                            <el-input v-model="params_createdFac.areaCode" placeholder="区号"></el-input>
                            &nbsp;-&nbsp;
                            <el-input v-model="params_createdFac.number" placeholder="座机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" style="margin-right: 44px">
                            <el-input v-model="params_createdFac.peopleName" placeholder="请输入联系人姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="params_createdFac.phone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="工厂地址">
                            <el-cascader show-all-levels :options="areaData" @active-item-change="handleItemChange" @change="handleChange" :props="props" placeholder="请选择地区"></el-cascader>
                        </el-form-item>
                        <el-input class="address" v-model="params_createdFac.address" placeholder="请输入详细的地址信息，如街道名称，门牌号码等"></el-input>
                    </el-form>
                    <nf-button type="warning" @click="AjaxCreateUnit" class="btn_submit">完成创建</nf-button>
                </div>
                <div class="right">
                    <div>
                        <img v-errorLogo :src="avatarImg">
                    </div>
                    <nf-button @click="isUpload = !isUpload" class="upload_btn">上传Logo</nf-button>
                </div>
            </div>
            <!--图片上传组件-->
            <uploadpic v-if="isUpload" :img="url" @getImg="handleGetImgUrl"></uploadpic>
        </div>
    </section>
</template>

<script>
import config from "@/config";
import { getPosition, createUnit } from "@/api/api";
import uploadpic from "../Common/UpdatePic.vue";
export default {
    data() {
        return {
            avatarImg: "",
            areaData: [],
            logo: "",
            params_createdFac: {
                name: "",
                areaCode: "",
                number: "",
                peopleName: "",
                phone: "",
                address: ""
            },
            isUpload: false,
            props: {
                value: "id",
                label: "name",
                children: "cities"
            },
            provinceId: "", // 省
            cityId: "", // 市
            areaId: "", // 区
            isErr: false
        };
    },
    components: {
        uploadpic
    },
    methods: {
        // 提交表单
        async AjaxCreateUnit() {
            // console.log(this.$store.state.userInfo.id, "222");
            let str = await this.AjaxCheckUnitName();
            if (str) {
                this.$message.error(str);
                return;
            }
            if (this.params_createdFac.phone&&!/^[1][3,4,5,6,7,8][0-9]{9}$/.test(this.params_createdFac.phone)) {
                this.$message.error('手机号格式有误，请检查');
                return;
            }
            let param = {
                appId: config.appId.appId,
                name: this.params_createdFac.name,
                logo: this.logo,
                areaCode: this.params_createdFac.areaCode,
                telephone: this.params_createdFac.number,
                contactName: this.params_createdFac.peopleName,
                mobilePhone: this.params_createdFac.phone,
                provinceId: this.provinceId,
                cityId: this.cityId,
                areaId: this.areaId,
                address: this.params_createdFac.address,
                userId: this.$store.state.userInfo.id,
                productPrepareCenterIds: []
            };
            try {
                const {data} = await createUnit(param);
                if (data.code === 0) {
                    sessionStorage.setItem("last_login", JSON.stringify({id:data.data}));                    
                    this.storeUnitId(data.data);
                    this.$router.push('/home/service');
                } else {
                    this.$message.error(data.msg)
                }
            } catch (error) {
                console.log(error)
            }
        },
        storeUnitId(unitId) {
            const oldLoginData = JSON.parse(sessionStorage.getItem('user_login'));
            oldLoginData.unitId = unitId;
            const newLoginData = JSON.stringify(oldLoginData);
            sessionStorage.setItem('user_login', newLoginData);
        },
        // 检查名字合法性
        async AjaxCheckUnitName() {
            this.isErr = false;
            if (!this.params_createdFac.name) {
                this.$message.error("请输入工厂名称");
                this.isErr = true;
                return "请输入工厂名称";
            }
            return "";
        },
        // 获取地区信息
        async AjaxAreaData(id) {
            let param = { id: "" || id };
            try {
                const { data } = await getPosition(param);
                if (data.code === 0) {
                    return data.positionList;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 获取行政区号
        handleChange(arr) {
            if (arr instanceof Array) {
                this.provinceId = arr[0];
                this.cityId = arr[1];
                this.areaId = arr[2];
            }
        },
        // 省市区联动
        async handleItemChange(arr) {
            let id = arr[arr.length - 1];
            let data = await this.AjaxAreaData(id);
            if (arr.length === 1) {
                let index;
                this.areaData.forEach((e, n) => {
                    if (e.id === arr[0]) {
                        index = n;
                    }
                });
                data.forEach(item => {
                    item.cities = [];
                });
                this.$set(this.areaData[index], "cities", data);
            } else if (arr.length === 2) {
                let index;
                this.areaData.forEach((e, n) => {
                    if (e.id === arr[0]) {
                        index = n;
                    }
                });
                let index1;
                this.areaData[index].cities.forEach((e, n) => {
                    if (e.id === arr[1]) {
                        index1 = n;
                    }
                });
                this.$set(this.areaData[index].cities[index1], "cities", data);
            }
        },
        // 上传图片
        handleGetImgUrl(url) {
            this.logo = url;
            this.avatarImg = this.$globalConfig.qiniu.baseUrl + url || "";
        }
    },
    async created() {
        // ID
        if (this.$store.state.userInfo.id === void 0) {
            await this.$store.dispatch("getUserInfo");
        }
        let data = await this.AjaxAreaData();
        data.forEach(e => {
            e.cities = [];
        });
        this.areaData = data;
    }
};
</script>

<style lang="scss" scpoed>
.createdFac {
    &_wrap {
        box-sizing: border-box;
        width: 920px;
        height: 385px;
        background-color: #fff;
        border-radius: 2px;
        &--title {
            height: 56px;
            text-align: center;
            line-height: 56px;
            font-size: 18px;
            border-bottom: 1px solid #e6e8eb;
        }
        &--content {
            padding: 32px;
            display: flex;
            justify-content: space-between;
            .left {
                width: 704px;
            }
            .right {
                img {
                    margin-bottom: 8px;
                    width: 104px;
                    height: 104px;
                }
                .upload_btn {
                    width: 104px;
                    height: 36px;
                    border: 1px solid #ff9c38;
                    color: #ff9c38;
                    &:hover {
                        background-color: #fff;
                    }
                }
            }
        }
        .important {
            position: relative;
            &::before {
                content: "*";
                color: red;
                position: absolute;
                top: 7px;
                left: -5px;
            }
        }
        .btn_submit {
            width: 180px;
            height: 36px;
            margin: 32px 0 0 336px;
        }
    }
}
</style>
<style lang="scss">
.createdFac_wrap--content {
    .el-form-item {
        margin-bottom: 20px;
        width: 328px;
        display: inline-block;
    }
    .el-form-item__content {
        display: flex;
        &::before {
            display: inline !important;
        }
        &::after {
            display: inline !important;
        }
    }
    .el-input__inner {
        border-radius: 2px;
        // &:hover {
        //     border-color: rgb(191, 200, 217);
        // }
        &:focus {
            border-color: #ff9c38;
        }
    }
    .address.el-input {
        box-sizing: border-box;
        display: block;
        padding-left: 68px;
    }
    .el-cascader {
        width: 100%;
    }
}
</style>
