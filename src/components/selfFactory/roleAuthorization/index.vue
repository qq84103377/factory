<template>
    <section class="role-authorization">
        <page-title title="角色权限">
            <el-input v-model="keyword" @change="getRoleList(1)" class="search"  placeholder="输入角色名称搜索" icon="search">
            </el-input>
            <nf-button type="warning" svg="icon-btn-add" @click="$router.push({path:'/home/setting/roleAuthorization/roleInfo',query:{pageType:'new'}})">新建角色</nf-button>
        </page-title>
        <div class="box-shadow">
            <el-table :row-class-name="tableRowClassName" @row-click="showDetail" :data="tableData" empty-text="暂无角色权限数据">
                <el-table-column   prop="name"  label="角色名称">
                    <template slot-scope="scope">
                         <span :class="{'gray':scope.row.disabled}">{{scope.row.name}}{{scope.row.disabled?'（已禁用）':''}}</span>
                    </template>
                </el-table-column>
                <el-table-column   prop="remark"  label="备注信息">
                    <template slot-scope="scope">
                        <span :class="{'gray':scope.row.disabled}">{{scope.row.remark}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="createAt" sortable="true" label="创建时间">
                    <template slot-scope="scope">
                        <span :class="{'gray':scope.row.disabled}">{{scope.row.createAt}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-content">
                <el-pagination @current-change="handleCurrentChange" :page-size="10" layout="total, prev, pager, next" :current-page.sync="currentPage" :total="totalNum">
                </el-pagination>
            </div>
        </div>
    </section>
</template>

<script>
    // import config from "../../config/index";
    import {
        getRoleList
} from "@/api/api";

// table config
// const tableConfig = [
//     { prop: "name", label: "角色名称",sortable:false},
//     { prop: "remark", label: "备注信息",sortable:false},
//     { prop: "createAt", label: "创建时间",sortable:true },
// ];
export default {
    data() {
        return {
            keyword:'',
            // tableConfig: tableConfig, //列表项配置数据
            tableData: [], // 列表数据
            totalNum: 0, // 列表总数量
            currentPage: 1 // el-pagination-当前页
        };
    },
    async created() {
        // 列表数据
         this.getRoleList();
    },
    methods: {
        // 点击表格行
        showDetail(row, event, column){
            this.$router.push({path:'/home/setting/roleAuthorization/roleInfo',query:{pageType:'detail',id:row.id}})
        },
        // 查询物料分类列表
        async getRoleList(num) {
            let params = {
                pageNo: num || 1,
                pageSize: 10,
                keyword:this.keyword,
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
            };
            this.currentPage = params.pageNo;
            let res = await getRoleList(params);
            this.tableData = res.data.data.list;
            this.totalNum = res.data.data.totalCount;
        },
        // 分页
        handleCurrentChange(e) {
            this.getRoleList(e);
        },
        // 修改表格底色
        tableRowClassName(row, index) {
            if (index%2 === 0) {
                return 'dark-row';
            }
            return '';
        }
    }
};
</script>

<style lang="scss" scoped>
    .search{
        width: 320px;
        margin-right: 8px;
        .el-input__inner{
            width: 100%;
        }
    }
</style>
<style lang="scss">
    .role-authorization{
        .el-table{
            border: none;
        }
        .el-table::after{
            background-color:transparent;
        }
        .el-table th,
        .el-table__footer-wrapper thead div,
        .el-table__header-wrapper thead div{
            background-color: #fff;
        }
        .el-table th{
            border-bottom:1px solid rgb(223, 228, 236);
        }
        .el-table tr:hover{
            cursor: pointer;
        }
        .el-table tr.dark-row{
            background-color: #f7f9fc;
        }
        .el-table td{
            border-bottom: none;
            height: 48px;
        }
        .search{
            .el-input__inner{
                width: 100%;
                height: 38px;
            }
        }
    }
</style>
