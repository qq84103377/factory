<template>
    <section class="goods-progress">
        <div v-if='hasPermission'>
            <!--头部begin-->
            <page-title title="货品生产进度报表" bg>
                <div class="report-wrap">
                    <nf-button class="go-back" @click="goBackClick">返回上级</nf-button>
                </div>
            </page-title>
            <!--头部end-->
            <div class="filter-bar">
                <el-form :inline="true" label-width="80px" :model="filterParams">
                    <el-form-item label="制单时间">
                        <el-date-picker v-model="filterParams.date" type="daterange" :picker-options="pickerOptions" @change="handleDateChange" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="">
                        <nf-button type="filter" width='72' fsize='14' @click="handleFilter">筛选</nf-button>
                    </el-form-item>
                </el-form>
                <nf-button class="report-btn" @click="downLoadReport">导出报表</nf-button>
            </div>
            <page-wrap class="report-table">
                <el-table class="no-expanded-cell-padding" :data="tableData" border style="width: 100%;">
                    <el-table-column type="expand" v-if="configData.linkType===1" width="25">
                        <template slot-scope="scope">
                            <div style="padding-left: 25px">
                                <el-table :show-header="false" :data="scope.row.goods" class="no-border no-background is-fixed-header" style="width: 100%;">
                                    <el-table-column prop="styleName" align="center">
                                    </el-table-column>
                                    <el-table-column v-for="(item, index) in configData.configNode" :key="index" :prop="item + ''" :label="item + ''" align="center">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="configData.attr" v-if="configData.linkType === 1" align="center">
                        <template slot-scope="scope">
                            {{ configData.configGattr[scope.$index] }}
                        </template>
                    </el-table-column>
                    <el-table-column label="款号" v-if="configData.linkType === 0" align="center">
                        <template slot-scope="scope">
                            {{ scope.row.styleName }}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(item, index) in configData.configNode" :key="index" :prop="item + ''" :label="item + ''" align="center">
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="configData.pageSize">
                    </el-pagination>
                </div>
            </page-wrap>
        </div>
        <el-dialog :show-close="false" :visible.sync="deleVisible" size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <p style="font-size:24px;margin-bottom:24px;">没有权限</p>
                    <p>如需查看报表，请联系老板在报表管理中授予您查看权限！</P>
                </div>
                <div style="margin-top:24px;">
                    <nf-button type="warning" @click="deleVisible = false">知道了</nf-button>
                </div>
            </div>
        </el-dialog>
        <section v-if="!hasPermission" class="worker-check">
            <div class="img-worker">
                <img src="../../assets/images/pic_nounnothing.png" alt="">
            </div>
        </section>
    </section>
</template>

<script>
import { queryProgress, downloadExcel } from '@/api';
import Format from '@/utils/format'
export default {
    data() {
        return {
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            currentPage: 1,
            configData: {},
            filterParams: {
                date: '',
                startDate: '',
                endDate: ''
            },
            // 无权限弹窗
            deleVisible: false,
            // 权限--页面显示条件
            hasPermission: true
        }
    },
    computed: {
        baseParam() {
            return {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                formId: this.$route.query.formId,
            }
        },
        tableData() {
            return this.configData.linkType === 0 ? this.configData.goods : this.configData.types;
        }
    },
    created() {
        if(this.$route.query.formId) {
            this.fetchData({
                ...this.baseParam,
                pageNo: 1
            })
        }
    },
    methods: {
        //返回上一层
        goBackClick() {
            this.$router.push("/reportManage");
        },
        fetchData(params) {
            queryProgress(params)
                .then(res => {
                    if (res.data.code == 6) {
                        this.deleVisible = true;
                        this.hasPermission = false;
                    }
                    this.configData = res.data.data;
                })
        },
        downLoadReport() {
            window.open(downloadExcel({
                type: this.configData.linkType === 0 ? 3 : 4
            }))
            // downloadExcel({
            //     type: this.configData.linkType === 0 ? 3 : 4
            // })
            // .then(res => {

            // })
        },
        handleCurrentChange(val) {
            const params = {
                ...this.baseParam,
                pageNo: val
            };
            this.fetchData(params)
        },
        handleDateChange(val) {
        },
        handleFilter() {
            if (!this.filterParams.date) return;
            const start = this.filterParams.date[0] ? Format.formatDate(new Date(this.filterParams.date[0]), 'yyyy-MM-dd') : '';
            const end = this.filterParams.date[1] ? Format.formatDate(new Date(this.filterParams.date[1]), 'yyyy-MM-dd') : '';
            const params = {
                ...this.baseParam,
                pageNo: 1,
                startDate: start,
                endDate: end
            };
            this.fetchData(params);
        }
    }
}
</script>

<style lang="scss" scoped>
.goods-progress{
    .filter-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 32px 0;
        border-radius: 2px;
        background-color: #ffffff;
        box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
        .report-btn {
            margin-bottom: 22px;
        }
    }
    .report-table {
        padding: 0 !important;
        margin-top: 16px;
    }
    .pagination {
        margin-top: 25px;
        text-align: right;
    }
    .dialog-content-wrap {
        text-align: center;
    }
    .worker-check {
        background-color: #fff;
        min-height: 620px;
        .img-worker {
            width: 100%;
            display: flex;
            justify-content: center;
            img {
                width: 406px;
                height: 224px;
                opacity: 0.6;
                margin-top: 120px;
            }
        }
    }

}
</style>
<style lang="scss">
.goods-progress{
    .page_title--head {
        font-size: 16px;
        line-height: 32px;
    }
    .report-wrap {
        .nf-button{
            width: 72px;
            font-size: 12px !important;
        }
    }
    .el-form-item__label{
        font-size: 12px;
    }
    .el-input__inner{
        font-size: 12px;
    }
    .nf-button--filter{
        font-size: 12px !important;
    }
    .nf-button--default {
        width: 100px;
        font-size: 12px !important;
    }
}
</style>