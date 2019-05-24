<template>
    <el-table
            class="custom-table"
            :data="facPrdOrderList"
            stripe
            border
            empty-text="暂无数据"
            @row-click="getDetaile">
        <el-table-column
                align="center"
                prop="code"
                label="编号"
                sortable>
        </el-table-column>
        <el-table-column
                align="center"
                prop="name"
                label="名称"
                sortable>
        </el-table-column>
        <el-table-column
                align="center"
                prop="factoryRateName"
                label="厂商评级">
        </el-table-column>
        <el-table-column
                align="center"
                prop="attrName"
                label="品牌">
        </el-table-column>
        <el-table-column
                align="center"
                label="加工厂仓库">
            <template slot-scope="scope">
                <div class="fac-store" @click.stop="handleClickHouse(scope.row.commonStorehouseId)">
                    {{scope.row.commonStorehouseName}}
                </div>
            </template>
        </el-table-column>
        <el-table-column
                align="center"
                prop="contacts"
                label="联系人">
        </el-table-column>
        <el-table-column
                align="center"
                prop="telephone"
                label="联系电话">
        </el-table-column>
        <el-table-column
                align="center"
                prop="mobilePhone"
                label="手机">
        </el-table-column>
        <el-table-column
                align="center"
                prop="address"
                label="地址">
        </el-table-column>
        <el-table-column
                align="center"
                prop="reviewStatusText"
                label="审核状态">
        </el-table-column>
        <el-table-column
                align="center"
                prop="reviewRemark"
                label="审批备注">
        </el-table-column>
        <el-table-column
                align="center"
                prop="statuses"
                label="停用状态">
        </el-table-column>
        <el-table-column
                align="center"
                prop="dateCreated"
                width="160"
                label="创建时间"
                sortable>
        </el-table-column>
        <el-table-column v-if="isDocumentReview" label="操作" fixed="right" width="200" class-name="cellHeight" align="center">
            <template slot-scope="scope">
                <div style="color: #1CA1FF;display: flex;justify-content: space-between;align-items: center;height: 100%;padding: 0 10px;cursor: pointer;">
                    <div @click="$router.push(`/outsideFactory/info/${scope.row.id}`)">查看</div>
                    <div @click="$emit('taskPass',scope.row.taskId,true,scope.row)">
                        <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='NORMAL_REVIEW'">通过</el-button>
                        <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='ANTI_REVIEW'">批准</el-button>
                    </div>
                    <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='NORMAL_REVIEW'" @click="$emit('taskUnPassDialogGo',scope.row.taskId,scope.row)">驳回</el-button>
                    <el-button class="opr-btn" :loading="scope.row.btnLoading" v-if="scope.row.taskName==='ANTI_REVIEW'" @click="$emit('taskPass',scope.row.taskId,false,scope.row)">不批准</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "table",
        props: ['facPrdOrderList'],
        computed: {
          isDocumentReview() {
              return this.$route.path === '/documentReview'
          }
        },
        data() {
            return {
            }
        },
        methods: {
            //查看仓库
            handleClickHouse(id){
                this.$router.push({
                    path: `/materialInventory/matremaind?storehouseId=${id}`,
                    query: {
                        from: 'outsideFactory'
                    }
                })
            },
            //跳转到详情页
            getDetaile(row) {
                // 权限
                // var datalist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                // if (datalist.indexOf("fac.supplier.list") == -1) {
                //     this.$message.error("抱歉，您没有操作权限");
                //     return;
                // }
                if(!this.isDocumentReview){
                    this.$router.push({
                        path: `/outsideFactory/info/${row.id}`
                    })
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .fac-store{
        cursor: pointer;
    }
    .opr-btn{
        font-size: 12px;
        padding: 0;
        color: #1CA1FF;
        cursor: pointer;
        background-color: transparent;
        border: none;
    }
</style>