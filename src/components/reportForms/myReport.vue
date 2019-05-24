<template>
    <div>
        <header class="header">
            <div class="header-tab">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane v-for="(item,index) in tabList" :key="index" :label="item.name" :name="item.path" v-if="index<3">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="header-right">
                <div>
                    <el-dropdown trigger="click" class="more-report-dropdown" @command="changeReport">
                        <span class="el-dropdown-link">
                            更多报表
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) of tabList" :key="index" :command='item' v-if="index>=3">{{item.name}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <nf-button class='manager-btn' type="warning" @click="click_isshow">管理报表</nf-button>
            </div>
        </header>
        <main>
            <keep-alive>
                <router-view :key="routerKey"></router-view>
            </keep-alive>
        </main>
    </div>
</template>
<script>
import { selectFacForms } from "../../api/api";
import { permissionOfLineReport } from '../../api/lineReport/lineReportApi.js'
export default {
    data() {
        return {
            activeName: "/MyReport/FormsStatistics",
            tabList: [],
            moreReportList: [],
            loginType: "",
            sign: '0'
        };
    },
    computed: {
        routerKey() {
            return this.$route.name !== undefined
                ? this.$route.name + +new Date()
                : this.$route + +new Date();
        }
    },
    methods: {
        click_isshow() {
            var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                .permissionList;
            if (datalist) {
                for (let i = 0; i < datalist.length; i++) {
                    if (datalist[i] == "fac.forms.manage") {
                        this.sign = "1";
                    }
                }
            }
            if (this.sign == "0" || !datalist) {
                this.$message.error("抱歉，您没有操作权限");
                return;
            }
            this.$router.push("/reportmanage");
        },
        // 导航栏点击事件
        handleClick(tab, event) {
            const formId = this.tabList[tab.index].formId;
            if (this.tabList[tab.index].enumCode == "FACMISSIONLineReportFORM") {
                this.jundgePermission(item.formId).then(res => {
                    if (res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        return
                    }
                    this.$router.push({ path: tab.name, query: { formId } });
                }).catch(err => {
                    throw Error(err)
                })
            }
            this.$router.push({ path: tab.name, query: { formId } });
        },
        // 刷新重设当前导航高亮
        resetActiveTab() {
            this.activeName = this.$route.fullPath;
        },
        // 获取可用报表列表
        getReportList() {
            if (this.$store.state.userInfo) {
                /*
                        * login重构后，不再存储“”sessionStorage，
                        * 而是将之前所需数据存储在vuex中，以后需要用到用户信息的地方，
                        * 统一在store里取 
                        *
                        */
                this.loginType = this.$store.state.userInfo.type;
            } else {
                this.loginType = "1";
            }
            let params = {
                keyword: "",
                token: "token",
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            };
            //这里是用于切换tab时候跳转的路由及名称
            selectFacForms(params)
                .then(res => {
                    let arr = res.data.data;
                    arr.forEach((item, index) => {
                        if (item.formId != "" && item.status == 0) {
                            if (item.enumCode == "FACMISSIONFORM") {
                                this.tabList.push({
                                    formId: item.formId,
                                    name: item.formsName,
                                    path: "/MyReport/FormsStatistics"
                                });
                            } else if (item.enumCode == "FACEMOLUMENTFORM") {
                                this.tabList.push({
                                    formId: item.formId,
                                    name: item.formsName,
                                    path: "/MyReport/StaffSalaryReport"
                                });
                            } else if (item.enumCode == "FACMISSIONLineReportFORM") {
                                this.tabList.push({
                                    name: item.formsName,
                                    path: "/lineReport",
                                    formId: item.formId,
                                });
                            } else if (item.enumCode == "STAFF_NODE_REPORT_STATISTICS") {                                
                                this.tabList.push({
                                    name: item.formsName,
                                    path: "/MyReport/stationNodeProcessReport",
                                    formId: item.formId,
                                });
                            } else {
                                this.tabList.push({
                                    formId: item.formId,
                                    name:
                                        item.formsName == "" ? "货品生产进度报表" : item.formsName,
                                    path: `/MyReport/GoodProcessReport?formsName=${
                                        item.formsName
                                        }`
                                });
                            }
                            this.activeName = this.tabList[0].path;
                        }
                    });
                    if (this.tabList.length) {
                        this.$router.push({ path: this.tabList[0].path });
                    }
                })
                .catch(err => {
                });
        },
        // 更多报表-更换报表
        changeReport(item) {
            console.log(item);
            if (item.path == "/lineReport") {
                this.jundgePermission(item.formId).then(res => {
                    if (res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        return
                    }
                    this.$router.push({
                        path: item.path,
                        query: { formId: item.formId }
                    });
                }).catch(err => {
                    throw Error(err)
                })
            } 
            else {
                this.activeName = item.command;
                this.$router.push({
                    path: item.path,
                    query: { formId: item.formId }
                });
            }

        },
        // 判断权限
        async jundgePermission(_formId) {
            try {
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    formId: _formId
                }
                let res = await permissionOfLineReport(params)
                return res;
            } catch (error) {
                throw Error(error)
            }
        }
    },
    created() {
        this.resetActiveTab();
        this.getReportList();
    }
};
</script>
<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6eaf0;
}
.header-right {
    display: flex;
    align-items: center;
    .more-report-dropdown {
        margin-right: 32px;
        cursor: pointer;
        .el-dropdown-link {
            font-size: 20px;
        }
    }
}
</style>

