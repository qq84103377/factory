<template>
    <section class="edit">
        <div class="edit_header">
            <p>{{title}}</p>
            <div class="edit_header--btns">
                <nf-button class="btn_w98" style="margin-right: 8px" @click="handleCancle">取消</nf-button>
                <nf-button class="btn_w98" type="warning" @click="handleSubmit">确定</nf-button>
            </div>
        </div>
        <div class="edit_content">
            <content-wrap class="edit_content--wrap" title="基本信息" type="big">
                <div style="position: relative">
                    <span class="label">名称</span>
                    <el-input :maxlength="12" :class="['el-form-item', 'inp', {'is-error': isError.name}]" v-model.trim="name"></el-input>
                    <p class="error tips" v-show="isError.name">{{errorMsg.name}}</p>
                </div>
            </content-wrap>
            <content-wrap class="edit_content--wrap" title="关联工厂" type="big">
                <p slot="headRight" class="tips" v-if="isError.fac">请至少关联一个工厂</p>
                <el-checkbox-group class="clearfix" v-model="checkListFac">
                    <div class="check_item fl" v-for="(item,index) in facList">
                        <el-checkbox :label="item.id">
                            <span class="w200 ellipsis_1">{{item.name}}</span>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </content-wrap>
            <content-wrap class="edit_content--wrap" title="关联仓库" type="big">
                <p slot="headRight" class="tips" v-if="isError.rep">请至少关联一个仓库</p>
                <el-checkbox-group class="clearfix" v-model="checkListReper">
                    <div class="check_item fl" v-for="(item,index) in reperList">
                        <el-checkbox :label="item.id">
                            <span class="w200 ellipsis_1">{{item.name}}</span>
                        </el-checkbox>
                    </div>
                </el-checkbox-group>
            </content-wrap>
        </div>
    </section>
</template>

<script>
import {
    getEasyFactorys,
    getBossStorehouses,
    createProductPrepareCenter,
    queryProductPrepareCenterInfo,
    updateProductPrepareCenter,
    checkProductPrepareCenter
} from "@/api/api";
export default {
    data() {
        return {
            isError: {
                name: false, // 名称
                fac: false, // 工厂
                rep: false // 仓库
            },
            errorMsg: {
                name: ''
            },
            name: "", //  生产准备中心名称
            userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            facList: [], // 所有工厂
            reperList: [], // 所有仓库
            checkListFac: [], // 关联工厂
            checkListReper: [] // 关联仓库
        };
    },
    props: {
        objId: {
            type: String
        }
    },
    computed: {
        title() {
            return this.objId?'编辑生产准备中心':'新建生产准备中心';
        }
    },
    methods: {
        // submit
        async handleSubmit() {
            let validate = await this.handleValidate();
            if (!validate) {
                return;
            }
            if (this.objId) {
                this.AjaxUpdateProductPrepareCenter();
            } else {
                this.AjaxCreateProductPrepareCenter();
            }
        },
        // edit_ajax
        async AjaxUpdateProductPrepareCenter() {
            let params = {
                id: this.objId,
                name: this.name,
                userId: this.userId,
                unitIds: this.checkListFac,
                storehouseIds: this.checkListReper
            };
            try {
                let { data } = await updateProductPrepareCenter(params);
                (await data.code) === 0 && this.$message.success(data.msg);
                (await data.code) === 0 && this.handleToggle(1);
                (await data.code) !== 0 && this.$message.error(data.msg);
                // console.log(data);
            } catch (error) {
                console.log(error);
            }
        },
        // 名称查重
        async AjaxCheckProductPrepareCenter() {
            if (this.name.length === 0) {
                console.log('未输入有效字符串');
                return;
            }
            let params = {
                userId: this.userId,
                name: this.name,
                id: this.objId || ''
            };
            try {
                let {data} = await checkProductPrepareCenter(params);
                (await data.code === 0) && data.data.status===1?(this.$set(this.isError, "name", true),
                this.$set(this.errorMsg, "name", "该名称已存在")):(void 0);
            } catch (error) {
                console.log(error)
            }
        },
        // add_ajax
        async AjaxCreateProductPrepareCenter() {
            let params = {
                name: this.name,
                userId: this.userId,
                token: "",
                unitIds: this.checkListFac,
                storehouseIds: this.checkListReper
            };
            try {
                let { data } = await createProductPrepareCenter(params);
                (await data.code) === 0 && this.$message.success(data.msg);
                (await data.code) === 0 && this.handleToggle(1);
                (await data.code) !== 0 && this.$message.error(data.msg);
            } catch (error) {
                console.log(error);
            }
        },
        // data validate
        handleValidate(type) {
            if (type === 1 || type === void 0) {
                // reset
                this.$set(this.isError, "name", false);
                this.$set(this.errorMsg, "name", "名称不能为空");
                // validate
                this.name === "" && this.$set(this.isError, "name", true);
                this.AjaxCheckProductPrepareCenter();
            }
            if (type === 2 || type === void 0) {
                // reset
                this.$set(this.isError, "fac", false);
                // validate
                this.checkListFac.length === 0 &&
                    this.$set(this.isError, "fac", true);
            }
            if (type === 3 || type === void 0) {
                // reset
                this.$set(this.isError, "rep", false);
                // validate
                this.checkListReper.length === 0 &&
                    this.$set(this.isError, "rep", true);
            }
            if (this.isError.name || this.isError.fac || this.isError.rep) {
                return false;
            }
            return true;
        },
        // fac_ajax
        async AjaxGetEasyFactorys() {
            let params = {
                token: "",
                userId: this.userId
            };
            try {
                let { data } = await getEasyFactorys(params);
                this.facList = data;
            } catch (error) {
                console.log(error);
            }
        },
        // repertory_ajax
        async AjaxGetBossStorehouses() {
            try {
                let { data } = await getBossStorehouses({
                    userId: this.userId
                });
                (await data.code) === 0 && (this.reperList = data.data);
            } catch (error) {
                console.log(error);
            }
        },
        // info_ajax
        async AjaxQueryProductPrepareCenterInfo(id) {
            if (!id) {
                console.log("未传ID");
                return;
            }
            let params = {
                id: id,
                userId: this.userId
            };
            try {
                let { data } = await queryProductPrepareCenterInfo(params);
                (await data.code) === 0 &&
                    (this.name = data.productPrepareCenter.name);
                // checkListFac
                let arr = data.units.filter(e => {
                    return e.status === 1;
                });
                arr.forEach(e => {
                    this.checkListFac.push(e.id);
                });
                // checkListReper
                let arr1 = data.storehouses.filter(e => {
                    return e.status === 1;
                });
                arr1.forEach(e => {
                    this.checkListReper.push(e.id);
                });
            } catch (error) {
                console.log(error);
            }
        },
        // cancle
        handleCancle() {
            (this.name = ""), (this.checkListFac = []);
            this.checkListReper = [];
            this.handleToggle();
        },
        // toggle
        handleToggle(type) {
            this.$emit("toggle", type);
        }
    },
    watch: {
        name() {
            this.handleValidate(1);
        },
        checkListFac() {
            this.handleValidate(2);
        },
        checkListReper() {
            this.handleValidate(3);
        }
    },
    created() {
        this.AjaxGetEasyFactorys(); // 获取工厂列表
        this.AjaxGetBossStorehouses(); // 获取仓库列表

        if (this.objId) {
            this.AjaxQueryProductPrepareCenterInfo(this.objId);
        }
    }
};
</script>

<style lang="scss" scoped>
// other
.btn_w98 {
    width: 98px !important;
    height: 40px;
}
.w200 {
    display: inline-block;
    width: 200px;
}
.edit {
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 88px;
    margin-bottom: -88px;
    width: 750px;
    height: 100%;
    background-color: #fff;
    overflow-y: scroll;
    z-index: 101;
    &_header {
        position: fixed;
        top: 0;
        margin-bottom: 8px;
        padding: 32px 32px 16px 32px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 750px;
        background-color: #fff;
        border-bottom: 1px solid #e6eaf0;
        z-index: 50;
        p {
            font-size: 20px;
            color: #3b3b3b;
        }
    }
    &_content {
        padding: 8px 32px 200px 50px;
        z-index: 40;
        &--wrap {
            margin-top: 24px;
            border-bottom: 1px solid #e6eaf0;
            &:last-child {
                border-bottom: 0;
            }
            .label {
                position: relative;
                display: inline-block;
                width: 40px;
                text-indent: 5px;
                font-size: 14px;
                color: #3b3b3b;
                &::before {
                    position: absolute;
                    top: -3px;
                    left: -5px;
                    content: "*";
                    font-size: 16px;
                    color: #ff0000;
                }
            }
            .inp {
                width: 250px;
            }
            .tips {
                width: 560px;
                font-size: 14px;
                color: #fa4150;
            }
            .error {
                position: absolute;
                top: 40px;
                left: 42px;
                font-size: 12px;
            }
            .check_item {
                margin-bottom: 12px;
                margin-right: 20px;
                width: 324px;
                &:nth-of-type(2n) {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
