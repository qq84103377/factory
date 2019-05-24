<template>
    <div class="workerManage" v-if="isShow">
        <div class="workerManage_bg">
        </div>
        <div class="workerManage_box">
            <div class="workerManage_box--title">
                管理工位
            </div>
            <div class="workerManage_box--content">
                <div class="clearfix">
                    <div class="inp_item fl">
                        <span class="label">工厂筛选</span>
                        <el-select v-model="checkedUnitList" multiple placeholder="全部" @change="handleUnitSelected">
                            <el-option v-for="(item, index) in unitList" :key="index" :label="item.name" :value="item.id">
                                {{item.name}}
                            </el-option>
                        </el-select>
                    </div>
                    <div class="inp_item fr">
                        <span class="label">工位状态</span>
                        <el-select v-model="checkedStatusList" placeholder="全部" @change="handleStatusSelected">
                            <el-option v-for="(item,index) in workerStatus" :key="index" :label="item.name" :value="item.id">
                                {{item.name}}
                            </el-option>
                        </el-select>
                    </div>
                    <div class="inp_item fr" style="margin: 20px 0">
                        <el-input v-model.trim="keyword" placeholder="搜索工位" icon="search" @change="handleSearch"></el-input>
                    </div>
                </div>
                <div class="list">
                    <div class="header">
                        <el-checkbox v-model="checkedAll" @change="handleAllSelected">全选</el-checkbox>
                        <p>灰色工位为禁用状态</p>
                    </div>
                    <div class="content">
                        <el-checkbox-group v-model="checkedList" @change="handleListChange">
                            <div class="item" v-for="(item, index) in list">
                                <el-checkbox :label="item.id" :key="index">
                                    <span class="w_180px ellipsis_1" :class="{'isDisabled': item.disabled}">{{item.loginName}} - {{item.userName}}</span>
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
            <div class="workerManage_box--footer">
                <nf-button class="margin_16" @click="handleCancle">取消</nf-button>
                <nf-button class="margin_32" type="warning" @click="handleConfirm">确定</nf-button>
            </div>
        </div>
    </div>
</template>

<script>
/*
使用：
:isShow.sync="true／false" 控制显示／隐藏
*/
import { querySysUnitAllUser } from "@/api/api";
export default {
    data() {
        return {
            list: [], // 所有工位
            checkedList: [], // 选中的工位
            unitList: [], // 所有的工厂或者分组
            checkedUnitList: [], // 选中的工厂或者分组
            checkedStatusList: "ALL", // 选择的状态
            checkedAll: false, // 全选
            workerStatus: [
                { name: "全部", id: "ALL" },
                { name: "已禁用", id: "DISABLE" },
                { name: "已启用", id: "ENABLE" }
            ],
            keyword: "",
            params: {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            }
        };
    },
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        workerList: {
            type: Array
        }
    },
    // computed: {
    //     isDisabled() {
    //         return this.checkedStatusList === "DISABLE";
    //     }
    // },
    watch: {
        checkedList: {
            handler(val) {
                // this.handleListChange();
                this.checkedAll = this.list.length !== 0?this.checkedList.length === this.list.length:false;
            },
            deep: true
        },
        workerList: {
            handler(val) {
                val.forEach(item => {
                    this.checkedList.push(item.id);
                });
                // this.handleListChange();
                // this.checkedAll = this.list.length !== 0?this.checkedList.length === this.list.length:false;
            },
            deep: true
        },
        isShow(val) {
            val && this.AjaxQuerySysUnitAllUser();
        }
    },
    methods: {
        // ajax all data
        async AjaxQuerySysUnitAllUser(params) {
            let param = params || this.params;
            try {
                let { data } = await querySysUnitAllUser(param);
                (await data.code) === 0 && (this.unitList = data.unitList);
                (await data.code) === 0 && (this.list = data.unitAllUserList);
                (await data.code) === 0 && this.handleDataFilter();
            } catch (error) {
                console.log(error);
            }
        },
        // data filter
        handleDataFilter() {
            let arr = [];
            this.list.forEach(e => {
                arr.push(e.id);
            });
            this.checkedList = this.checkedList.filter(item =>
                arr.includes(item)
            );
        },
        // all selected
        handleAllSelected() {
            this.checkedList = [];
            if (this.checkedAll) {
                this.list.forEach(e => {
                    this.checkedList.push(e.id);
                });
            }
        },
        // unit selected
        handleUnitSelected() {
            this.$set(this.params, "unitIds", this.checkedUnitList);
            this.AjaxQuerySysUnitAllUser(this.params);
        },
        // status selected
        handleStatusSelected() {
            this.$set(this.params, "status", this.checkedStatusList);
            this.AjaxQuerySysUnitAllUser(this.params);
        },
        // list selected
        handleListChange() {
            // console.log('this.checkedList',this.checkedList);
            // console.log('this.list',this.list);
            // this.checkedAll = this.checkedList.length === this.list.length;
        },
        // search
        handleSearch() {
            this.$set(this.params, "keyword", this.keyword);
            this.AjaxQuerySysUnitAllUser(this.params);
        },
        // update hide／show
        handleCancle() {
            this.checkedList = [];
            this.checkedUnitList = [];
            this.checkedStatusList = "ALL";
            this.keyword = "";

            this.params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            };
            this.$emit("update:isShow", false);
        },
        // confirm
        handleConfirm() {
            this.$emit("confirm", this.checkedList);
            this.checkedList = [];
        }
    },
    mounted() {
        // 数据初始化
        this.AjaxQuerySysUnitAllUser();
        // console.log(this.workerList);
    }
};
</script>

<style lang="scss" scoped>
// other
.margin_32 {
    margin-right: 32px;
}
.margin_16 {
    margin-right: 16px;
}
.w_180px {
    display: inline-block;
    width: 180px;
}
.isDisabled {
    color: #c4c6cc;
}
// main style
.workerManage {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 109;
    &_bg {
        width: 100%;
        height: 100%;
        background: #000000;
        opacity: 0.5;
        z-index: 110;
    }
    &_box {
        position: absolute;
        top: 50%;
        left: 50%;
        // transform: translate(-50%, -50%); // 莫名抖动bug
        margin: -300px 0 0 -366px;
        width: 732px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 26px 12px -15px rgba(0, 0, 0, 0.25);
        z-index: 111;
        &--title {
            height: 52px;
            line-height: 52px;
            text-align: center;
            font-size: 20px;
            color: #3b3b3b;
            border-bottom: 1px solid #e6eaf0;
        }
        &--content {
            padding: 24px 32px;
            // display: flex;
            // justify-content: space-between;
            .inp_item {
                .label {
                    display: inline-block;
                    width: 68px;
                    font-size: 14px;
                    color: #3b3b3b;
                }
            }
            .list {
                height: 276px;
                border: 1px solid #e6eaf0;
                .header {
                    padding: 0 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 36px;
                    border-bottom: 1px solid #e6eaf0;
                    p {
                        color: #a2abb8;
                    }
                }
                .content {
                    padding: 16px;
                    height: 200px;
                    overflow: scroll;
                    .item {
                        display: inline-block;
                        margin: 0 8px 12px 0;
                        width: 202px;
                    }
                }
            }
        }
        &--footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 88px;
            border: 1px solid #e6eaf0;
        }
    }
}
</style>
<style lang="scss">
.inp_item {
    .el-input {
        width: 250px;
    }
}
</style>

