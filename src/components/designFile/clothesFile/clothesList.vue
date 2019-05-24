<template>
    <div class="clothes-list">
        <el-table
                :data="tableData"
                border
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}">
            <el-table-column
                    prop="picturePath"
                    label="样衣图片"
                    width="92">
                <template slot-scope="scope">
                    <div style="display: flex;align-items: center;justify-content: center;padding: 5px 0;">
                        <img v-if="scope.row.picturePath[0]" style="width: 48px;height: 48px;"
                             :src="scope.row.picturePath[0]" alt="">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="designStyleNo"
                    label="设计款号"
                    sortable
                    width="156">
            </el-table-column>
            <el-table-column
                    prop="sampleNo"
                    label="样衣号"
                    sortable
                    width="156">
            </el-table-column>
            <el-table-column
                    prop="sampleName"
                    label="样衣名称">
            </el-table-column>
            <!-- <el-table-column
                    prop="status"
                    label="样衣状态"
                    width="96">
                <template slot-scope="scope">
                    <div :class="['status',{'finish':scope.row.status==1},{'fail':scope.row.status==2}]">
                        {{getSampleStatus(scope.row.status)}}
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
                    prop="sampleMachinists"
                    label="版师">
                <template slot-scope="scope">
                    <div>{{getMachinists(scope.row.sampleMachinists)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="sampleDesigners"
                    label="样衣师">
                <template slot-scope="scope">
                    <div>{{getDesignersName(scope.row.sampleDesigners)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="dateCreated"
                    label="创建时间"
                    sortable
                    width="170">
                <template slot-scope="scope">
                    <div>{{scope.row.dateCreated.substr(0,19)}}</div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="sampleId"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <div style="display:flex;justify-content:space-between;">
                        <div @click="goDetail(scope.row)"
                         style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline">
                            查看详情
                        </div>
                        <div @click="del(scope.row)"
                            style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline">
                            删除
                        </div>
                    </div>

                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import artDetail from '../technicsInfo/artDetail'
    import addArt from '../technicsInfo/addArt'
    import {sampleDelete } from "../../../api/api";

    export default {
        // detailTo 从（商品详情里面的样衣档案/设计档案的样衣档案）跳到详情 goods  design
        props: ['tableData', 'detailFrom','styleId'],
        data() {
            return {}
        },
        methods: {
            // 刪除
            del (row) {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.sample.delete")){
                    return
                }
                let params = {
                    sampleId: row.sampleId
                }
                sampleDelete(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success('删除成功')
                        this.$emit("toggle", true);
                    }
                })
            },
            getDesignersName(arr) {
                let namesArr = []
                if (arr) {
                    arr.forEach(item => {
                        namesArr.push(item.designerName)
                    })
                }
                return namesArr.join('、')

            },
            getMachinists(arr) {
                let namesArr = []
                if (arr) {
                    arr.forEach(item => {
                        namesArr.push(item.machinistName)
                    })
                }
                return namesArr.join('、')

            },
            getSampleStatus(status) {
                let statusText = ''
                switch (status) {
                    case 0 :
                        statusText = '打版中';
                        break;
                    case 1 :
                        statusText = '已成型';
                        break;
                    case 2 :
                        statusText = '已作废';
                        break;
                }
                return statusText
            },
            goDetail(row) {
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.sample.view")){
                    return
                }
                if (this.detailFrom === 'goods') {
                    this.$router.push({path: '/goodsClothesDetail', query: {id: row.sampleId,styleId:this.styleId,designStyleId:row.designStyleId,bomId:row.bomId,}})
                } else {
                    this.$router.push({
                        path: '/designFile/clothesDetail',
                        query: {
                            id: row.sampleId,
                            designStyleId: this.$route.query.designStyleId,
                            bomId: row.bomId,
                            processFormId: row.processFormId
                        }
                    })
                }
            }
        },
        created() {
            // console.log(this.tableData, '传进来的样衣档案列表')
        }
    }
</script>

<style lang="scss" scoped>
    .clothes-list {
        .status {
            width: 48px;
            line-height: 24px;
            text-align: center;
            border: 1px solid #1CA1FF;
            color: #1CA1FF;
            &.finish {
                color: #23C811;
                border-color: #23C811;
            }
            &.fail {
                color: #FA4150;
                border-color: #FA4150;
            }
        }
    }

</style>
