<template>
    <section class="charge-limit">
        <page-title title="收费限制">
            <div class="">
                <el-input v-model="keyword" @input="handlerInput" style="width: 240px;" placeholder="输入老板号/姓名/手机号码搜索" icon="search"></el-input>
            </div>
        </page-title>

        <el-table
                v-loading="loading"
                border
                :data="chargeList"
                style="width: 100%;font-size: 12px;">
            <el-table-column
                    prop="bossCode"
                    label="老板号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="userName"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号码">
            </el-table-column>
            <el-table-column
                    prop="factoryName"
                    label="所属工厂">
            </el-table-column>
            <el-table-column
                    prop="factoryNum"
                    label="工厂添加个数">
                <template slot-scope="scope">
                    {{scope.row.factoryNum ? scope.row.factoryNum : '不限'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="workbayNum"
                    label="工位添加个数">
                <template slot-scope="scope">
                    {{scope.row.workbayNum ? scope.row.workbayNum : '不限'}}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作">
                <template slot-scope="scope">
                    <div @click="showDialog(scope.row)" style="color: #1CA1FF;cursor: pointer;text-decoration: underline">
                        权限控制
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div style="display: flex;justify-content: flex-end;margin-top: 8px;">
            <el-pagination
                    layout="prev, pager, next"
                    :page-size="20"
                    :current-page="pageNo"
                    :total="totalCount"
            @current-change="handlerChange">
            </el-pagination>
        </div>

        <el-dialog
                class="custom-dialog"
                title="权限控制"
                :visible.sync="dialogVisible"
                size="tiny">
            <div style="border: 1px solid #e6eaf0;">
                <div style="line-height: 32px;background: #F5F7FA;padding: 0 10px;">模块名称</div>
                <authorization-group v-for="item in actionAuthList" :authGroup="item" :key="item.id"
                                     :isDetail="false"></authorization-group>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button :loading="btnLoading" type="primary" @click="confirm">确 定</el-button>
  </span>
        </el-dialog>

    </section>
</template>

<script>
    import authorizationGroup from '@/components/selfFactory/roleAuthorization/child/authorizationGroup.vue'
    import {chargeManageList,chargeManageDetail,chargeManageUpdate} from '@/api'

    export default {
        data() {
            return {
                loading: false,
                btnLoading: false,
                chargeList: [],
                dialogVisible: false,
                actionAuthList: [],
                pageNo: 1,
                bossUnitId: '',
                totalCount: 0,
                keyword: ''
            }
        },
        components: {
            authorizationGroup
        },
        computed:{
          userId() {
              return JSON.parse(sessionStorage.getItem("user_login")).userId;
          }
        },
        methods: {
            confirm() {
                this.btnLoading = true;
                let ids = []
                this.actionAuthList.forEach(firstItem=>{
                    firstItem.childrenMenuList.forEach(secItem => {
                        if(secItem.isUsed){
                            //二级菜单有选中
                            ids.push(secItem.id);
                        }
                    })
                    if(firstItem.isUsed){
                        //一级菜单有勾选过的话,将一级菜单的ID也拼接
                        ids.push(firstItem.id)
                    }
                })
                const params = {
                    bossUnitId: this.bossUnitId,
                    ids
                }
                console.log(params,'参数');
                chargeManageUpdate(params).then(res => {
                    this.btnLoading = false
                    if(res.data.code == 0){
                        this.dialogVisible = false
                        this.getList()
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            showDialog(row) {
                this.bossUnitId = row.bossUnitId
                chargeManageDetail({bossUnitId:row.bossUnitId}).then(res => {
                    this.actionAuthList = res.data.data

                    this.actionAuthList.forEach(firstItem => {
                        this.$set(firstItem,'firstCheckAll',firstItem.childrenMenuList.every(v => v.isUsed==true))
                    })
                })

                this.dialogVisible = true
            },
            handlerChange(page) {
                this.pageNo = page
                this.getList()
            },
            handlerInput() {
                this.pageNo = 1
                this.getList()
            },
            getList() {
                this.loading = true
                chargeManageList({userId:this.userId,keyword:this.keyword,pageNo:this.pageNo,pageSize:20}).then(res => {
                    this.loading = false
                    this.chargeList = res.data.data.list
                    this.totalCount = res.data.data.totalCount
                })
            }
        },
        created() {
            this.getList()
        }
    }
</script>

<style lang="scss" scoped>

</style>