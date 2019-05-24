<template>
    <!-- 按需采购、按计划外采购弹窗 -->
    <div class="search-material-dialog">
        <el-dialog
                class="custom-dialog"
                :title="type==0?'按需添加':'计划外采购'"
                :visible.sync="visible"
                :show-close="false"
                :modal-append-to-body="false"
                @close="cancel">
            <div class="main-wrap" v-loading="loading">
                <div class="search-area">
                    <div>
                        <span>搜索</span>
                        <el-input  class="search-input"
                                   @change="handleSearch"
                                   v-model="queryColumn"
                                   :placeholder="type==0?'输入物料款号/名称/供应商款号/商品款号/生产单号添加':'+ 输入物料款号/名称/物料分类/默认供应商/供应商款号色号添加'"
                                   icon="search">
                        </el-input>
                    </div>
                    <el-button v-if="type == 1"  @click='addMaterial.visible = true' size="small"  class="orange-btn">+新建物料</el-button>
                </div>
                <el-table
                        @select="handleCheckedChange"
                        @select-all="handleCheckAllChange"
                        ref="searchTable"
                        height="520"
                        :data="searchList"
                        border
                        class="custom-table tiny-row mgt8"
                        style="width: 100%">
                    <el-table-column
                            fixed="left"
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="kindName" label="分类"  min-width="60">
                    </el-table-column>
                    <el-table-column  label="图片"   width="46" algin="center">
                        <template slot-scope="scope">
                            <img @click="previewImg(scope.row)" v-errorLogo style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                 :src="scope.row.commonMaterialsSkuPicture"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="materialsNo" label="物料款号"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="materialsName" label="物料名称"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="colorName" label="颜色"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="specificationsRemark" label="规格"  min-width="60">
                    </el-table-column>
                    <el-table-column prop="supplierName" :label="type==0?'供应商':'默认供应商'"  min-width="100">
                    </el-table-column>
                    <el-table-column prop="supplierStyleColor" label="供应商款号/色号"  min-width="100">
                        <template slot-scope="scope">
                            <div>{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="unit" label="库存单位"  width="70">
                    </el-table-column>
                    <el-table-column v-if="type==0" prop="styleNo" label="商品款号"  min-width="100">
                    </el-table-column>
                    <el-table-column v-if="type==0" prop="demandSourceBillNo" label="生产单号"  min-width="100">
                    </el-table-column>
                    <el-table-column v-if="type==0" prop="planBuyQuantity" label="计划采购"  width="70">
                    </el-table-column>
                    <el-table-column v-if="type==0" fixed="right" prop="waitPurchaseQuantity" label="待采购"  width="70">
                        <template slot-scope="scope">
                            <div class="red">{{scope.row.waitPurchaseQuantity}}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text-right mgt8">
                    <el-pagination @current-change="handleCurrentChange" :current-page.sync="page.pageNo" :page-size="page.pageSize"
                                   layout="total, prev, pager, next" :total="page.total">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="text-right">
                <div v-if="type ==0" class="fl lh32" >已选生产单需求：<span class="orange">{{newSelectedList.length}}条</span></div>
                <div v-else class="fl lh32" >已选物料：<span class="orange">{{newSelectedList.length}}款</span></div>

                <el-button @click="cancel">取 消</el-button>
                <el-button :loading="isSubmitting" @click="confirm" type="primary" >确 定</el-button>
            </div>
        </el-dialog>
        <!-- 遮罩层 -->
        <transition name="opcity">
            <div style="z-index: 9998" class="cover" @click='addMaterial.visible =false' v-if='addMaterial.visible'>
            </div>
        </transition>
        <!-- 新建物料 -->
        <transition name="right-move">
            <add-material
                    style="z-index: 9999"
                    v-if='addMaterial.visible'
                    title="新建物料"
                    @cancel='addMaterial.visible = false'
                    @confirm='addMaterial.visible = false'
                    @success='addMaterialSuccess'
            ></add-material>
        </transition>
        <!--图片预览-->
        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>
    </div>
</template>

<script>
    import {
        purchaseAddDemandSearchV3,
    } from '@/api/material.js'
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件

    export default {
        // type:类型  0：按需添加；1：计划外采购

        props: ['visible','type','selectedList','supplierId'],

        data() {
            return {
                queryColumn: '',      //搜索词
                searchList:[], //搜索结果
                newSelectedList:[], //新一轮选中的列表
                loading:false,
                isSubmitting:false,
                page:{
                    pageNo:1,
                    pageSize:20,
                    total:0
                },
                addMaterial:{
                    visible:false
                },
                previewList:[]

            }
        },
        created(){
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            selectedIds(){
                return this.newSelectedList.map(item => item.lineId)
            }
        },
        watch:{
            visible(val){
                if(val){
                    this.newSelectedList = JSON.parse(JSON.stringify(this.selectedList))
                    this.page ={
                        pageNo:1,
                        pageSize:20,
                        total:0
                    }
                    this.getSearchList()
                }
            }
        },
        components: {
            addMaterial
        },
        methods: {
            // 物料添加成功、
            // 分类默认供应商供应商款号/色号
            // isConfig:是否配置了物料审核，配置了物料审核的，不能直接添加过来
            addMaterialSuccess(newMaterialsArr,isConfig){
                // 新建成功后，执行一下搜索，让刚刚新建的出现在第一页第一行
                this.queryColumn = ""
                this.page.pageNo = 1
                this.getSearchList()
                console.log(newMaterialsArr,1111)
            },
            // 预览图片
            previewImg(row){
                if (!row.commonMaterialsPictureList.length) return;
                this.previewList = row.commonMaterialsPictureList.map(item => {
                    return {
                        path: item
                    }
                });
                this.$nextTick(() => {
                    this.$refs["previewer"].show(0)
                });
            },
            // 关键字搜索
            handleSearch(){
                this.page.pageNo = 1
                this.getSearchList()
            },
            // 页码改变
            handleCurrentChange(pageNo){
                this.page.pageNo = pageNo
                this.getSearchList()
            },
            // 获取列表
            getSearchList(){
                let params = {
                    unitId:this.unitId,
                    userId:this.userId,
                    supplierId:this.supplierId,
                    queryColumn:this.queryColumn,
                    type:this.type,
                    pageNo:this.page.pageNo,
                    pageSize:this.page.pageSize
                }
                this.loading = true
                purchaseAddDemandSearchV3(params).then(res =>{
                    this.loading = false
                    if(res.data.code == 0){
                        this.page.total = res.data.data.totalCount
                        this.searchList = res.data.data.list
                        this.$nextTick(function (e) {
                            this.searchList.forEach(row => {
                                this.$refs.searchTable.toggleRowSelection(row,this.selectedIds.includes(row.lineId))
                            });
                        })
                    }
                })
            },
            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.$emit('confirm',this.newSelectedList)
                this.$emit('update:visible',false)

            },
            // 全选/取消全选操作
            handleCheckAllChange(selection) {
                let isCheckAll = selection.length>0
                if(isCheckAll){
                    selection.forEach(item => {
                        if(!this.selectedIds.includes(item.lineId)){
                            this.newSelectedList.push(item)
                        }
                    })
                } else {
                    let deleteLineIds = this.searchList.map(item => item.lineId)
                    let tempList = []
                    this.newSelectedList.forEach(item =>{
                        if(!deleteLineIds.includes(item.lineId)){
                            tempList.push(item)
                        }
                    })
                    this.newSelectedList = tempList
                }
                console.log(this.newSelectedList,'全选后')
            },
            // 选中/取消 单个
            handleCheckedChange(selection,row) {
                let selectedLineIds = selection.map(item => item.lineId)
                let isChecked = selectedLineIds.includes(row.lineId)
                if(isChecked){
                    this.newSelectedList.push(row)
                } else {
                    this.newSelectedList.splice(this.newSelectedList.findIndex(item => item.lineId ==row.lineId),1)
                }
                console.log(this.newSelectedList,'某次单选后')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .search-material-dialog{
        .search-area{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
        }
        .orange-btn{
            color:#ff9c38 ;
            background: transparent;
            border: 1px solid #ff9c38;
        }
    }
</style>
<style lang="scss">
    .search-material-dialog {
        .search-input{
            width: 360px;
            .el-input__inner{
                height: 32px;
            }
        }
        .el-dialog--small{
            top: 15px !important;
            width:80%;
            min-width: 1366px;
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
