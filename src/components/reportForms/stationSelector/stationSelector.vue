<template>
    <div class="station-selector wrapper">
        <div class="el-input input-wrap">
            <i class="el-input__icon el-icon-caret-bottom"></i>
            <input type="text" :placeholder="checkList.length?`已选${checkList.length}个工位`:'全部'" class="el-input__inner outdoor-input" readonly @click="isDialogShow=!isDialogShow">
        </div>
        <div class="dialog-wrap" v-if="isDialogShow">
                <p class="dialog-title">选择工位</p>
                <div class="dialog-header">
                    <div>
                        <span class="input-title">工位分组</span>
                        <el-select v-model="workerIds" @change="changeGroup" class="input-item" clearable multiple placeholder="全部">
							<el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
                    </div>
                    <div>
                        <span class="input-title">工位状态</span>
                        <el-select v-model="workStatus"  @change="changeGroup" class="input-item" clearable placeholder="全部">
                            <el-option  label="全部" value="ALL">
							</el-option>
							<el-option  label="正常状态" value="ENABLE">
							</el-option>
                            <el-option  label="禁用状态" value="DISABLE">
							</el-option>
						</el-select>
                    </div>
                </div>
                <div class="search-input-wrap">
                    <el-input icon="search" placeholder="输入工位号/工位名称搜索" class="search-input" v-model="keyword"></el-input>
                </div>
                <div class="dialog-main">
                    <div class="list-header">
                        <el-checkbox @change="checkAll()" v-model="isCheckedAll">
							<span>全选</span>
						</el-checkbox>
                        <span class="list-header-title">灰色工位为禁用状态</span>
                    </div>
                    <div class="list-content" v-loading='loading'>
                        <el-checkbox-group v-model="checkList" class="checkbox-wrap">
                            <div v-for="(item,index) in computedList" :key='index' class="checkbox-item">
                                <el-checkbox  :label="item.id" :key="index" >
                                   <span :class="{'disable-name':item.disabled}"> {{item.loginName}} {{item.userName}}</span>
                                </el-checkbox>
                            </div>
						</el-checkbox-group>
                    </div>
                </div>
                <div class="dialog-footer-1">
                    <div class="btn-group">
                        <nf-button width='130' @click="isDialogShow = false">取消</nf-button>
                        <nf-button width='130' type='warning' @click="submitData">确定</nf-button>
                    </div>
                </div>
            </div>
        <div class="mask" @click="isDialogShow = false" v-if="isDialogShow"></div>
    </div>
</template>
<script>
import { getEasyGroups, getWorkbayListByFacId } from '../../../api/api';
import { UnitAllUser } from '../../../api/myReport/myReportApi';
export default {
    data() {
        return {
            isDialogShow: false,
            groupList: [],
            isCheckedAll: false,
            staffList: [],
            checkList: [],
            workerIds: [],
            keyword: '',
            loading: true,
            workStatus: 'ALL'
        };
    },
    model: {
        event: 'passData'
    },
    methods: {
        // 获取分组
        getGroups() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                token: ''
            };
            getEasyGroups(params)
                .then(res => {
                    this.groupList = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 改变分组
        changeGroup() {
            this.getStaff();
        },
        //全选
        checkAll() {
            this.checkList = [];
            if (this.isCheckedAll) {
                this.checkList = [];
                for (let i = 0; i < this.staffList.length; i++) {
                    this.checkList.push(this.staffList[i].id);
                }
            }
        },
        // 获取员工
        getStaff() {
            this.loading = true;
            let params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                unitIds: [JSON.parse(sessionStorage.getItem('last_login')).id],
                workbayIds: this.workerIds,
                keyword: '',
                status: this.workStatus
            };
            console.log(JSON.stringify(params));
            UnitAllUser(params)
                .then(res => {
                    console.log(res);
                    this.staffList = res.data.unitAllUserList;
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 提交所选数据至父组件
        submitData() {
            this.isDialogShow = false;
            this.$emit('passData', this.checkList);
        }
    },
    computed: {
        computedList() {
            return this.staffList.filter(item => {
                return item.loginName
                    .toLowerCase()
                    .includes(this.keyword.toLowerCase());
            });
        }
    },
    created() {
        this.getGroups();
        this.getStaff();
    }
};
</script>
<style lang="scss" scoped>
    .station-selector{
        .outdoor-input {
            cursor: pointer;
        }
        .input-wrap {
            position: relative;
        }
        .dialog-wrap {
            position: fixed;
            padding: 24px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 682px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 4px 10px 0 rgba(0, 17, 51, 0.1);
            border: solid 1px #dce0e6;
            z-index: 101;
            .dialog-header {
                margin-top: 24px;
                display: flex;
                justify-content: space-between;
                .input-item {
                    width: 250px;
                    height: 36px;
                }
                .input-title {
                    font-size: 14px;
                    color: #3b3b3b;
                    margin-right: 8px;
                }
            }
            .search-input-wrap {
                display: flex;
                flex-direction: row-reverse;
                margin-top: 20px;
                .search-input {
                    width: 250px;
                }
            }
            .dialog-main {
                margin-top: 18px;
                .list-header {
                    border: solid 1px #e6eaf0;
                    padding: 10px 16px;
                    display: flex;
                    justify-content: space-between;
                    .list-header-title {
                        line-height: 20px;
                        font-size: 12px;
                        color: #a2abb8;
                    }
                }
                .list-content {
                    padding-left: 16px;
                    height: 240px;
                    overflow: auto;
                    border-radius: 1px;
                    border: solid 1px #e6eaf0;
                    border-top: none;
                }
            }
            .dialog-footer-1 {
                display: flex;
                justify-content: flex-end;
                margin-top: 24px;
            }
        }
        .checkbox-wrap {
            display: flex;
            flex-wrap: wrap;
            .checkbox-item {
                width: 33%;
                margin-top: 16px;
            }
        }
        .disable-name {
            color: #c4c6cc;
        }
        .mask {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .nf-button{
            width: 100px !important;
            font-size: 12px !important;
        }
    }

</style>
