<template>
    <div>
    <el-dialog
            size="large"
            class="purchase-add-dialog"
            :modal-append-to-body="false"
            :show-close="false"
            @close="$emit('update:visible',false)"
            :visible.sync="visible">
        <div slot="title" style="text-align: center;font-size: 16px;">按物料添加</div>
        <div class="purchase-add-dialog__body">
            <div style="display: flex;justify-content: space-between">
                <div>
                    <span style="margin-right: 8px;">搜索</span>
                    <el-input icon="search" style="width: 360px;" @input="pageNum = 1;getList()" v-model="keyword" placeholder="输入物料款号/名称/物料分类/默认供应商/供应商款号色号添加"></el-input>
                </div>
                <el-button @click='addMaterial = true' size="small"  class="orange-btn">+新建物料</el-button>
            </div>
            <el-table
                    height="9999"
                    v-loading="loading"
                    ref="multipleTable"
                    :data="tableData"
                    border
                    tooltip-effect="dark"
                    style="width: 100%;margin-top: 8px;"
                    @select="handleSelection"
            @select-all="handleCheckAllChange">
                <el-table-column
                        align="center"
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="分类"
                        prop="kindName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="图片"
                        prop="commonMaterialsSkuPicture">
                    <template slot-scope="scope">
                        <img @click="previewImg(scope.row)" v-errorLogo style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                             :src="scope.row.commonMaterialsSkuPicture"/>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="物料款号"
                        prop="materialsNo">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="物料名称"
                        prop="materialsName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="颜色"
                        prop="colorName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="规格"
                        prop="specificationsRemark">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="默认供应商"
                        prop="supplierName">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="供应商款号/色号">
                    <template slot-scope="scope">
                       <div>{{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="库存单位"
                        prop="stockUnitName">
                </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: space-between;margin-top: 8px;">
                <div>已选 <span style="color: #ff8d37">{{selection.length}}</span> 款物料</div>
                <el-pagination @current-change="loadingMore" :page-size="20" layout="total, prev, pager, next"
                               :total="total" :current-page.sync="pageNum">
                </el-pagination>
            </div>

        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="selection=materialSelectList;$emit('update:visible',false)">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </span>
    </el-dialog>

        <nf-previewer ref="previewer" value="path" :list="previewList"></nf-previewer>

        <!-- 遮罩层 -->
        <transition name="opcity">
            <div style="z-index: 9998" class="cover" @click='addMaterial =false' v-if='addMaterial'>
            </div>
        </transition>
        <!-- 新建物料 -->
        <transition name="right-move">
            <add-material
                    style="z-index: 9999"
                    v-if='addMaterial'
                    title="新建物料"
                    @cancel='addMaterial = false'
                    @confirm='addMaterial = false'
                    @success='addMaterialSuccess'
            ></add-material>
        </transition>
    </div>
</template>

<script>
    import {purchaseAddDemandSearchV3} from '@/api/material.js'
    import {pageFormQueryOnMaterial} from '@/api'
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件
    export default {
        name: "purchase-add-dialog",
        props: ['visible','materialSelectList','supId','supplierId'],
        components: {addMaterial},
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        data() {
            return {
                keyword: '',
                tableData: [],
                total: 0,
                pageNum: 1,
                loading: false,
                selection: [],
                previewList:[],
                addMaterial: false
            }
        },
        watch: {
            visible(v) {
                if(v) {
                    this.selection = JSON.parse(JSON.stringify(this.materialSelectList))
                    // this.keyword = ''
                    this.pageNum = 1
                    this.getList()
                }
            }
        },
        methods: {
            handleConfirm() {
                this.$emit('update:visible',false)
                this.$emit('confirm',this.selection)
            },
            addMaterialSuccess(newMaterialsArr,isConfig){
                // 新建成功后，执行一下搜索，让刚刚新建的出现在第一页第一行
                this.keyword = ""
                this.pageNum = 1
                this.getList()
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
            loadingMore(page) {
                this.pageNum = page
                this.getList(this.pageNum)
            },
            // 全选/取消全选操作
            handleCheckAllChange(selection) {
                let isCheckAll = selection.length>0
                if(isCheckAll){
                    selection.forEach(item => {
                        if(!this.selection.some(v => v.materialsSkuId === item.materialsSkuId)){
                            this.selection.push(item)
                        }
                    })
                } else {
                    let deleteLineIds = this.tableData.map(item => item.materialsSkuId)
                    let tempList = []
                    this.selection.forEach(item =>{
                        if(!deleteLineIds.includes(item.materialsSkuId)){
                            tempList.push(item)
                        }
                    })
                    this.selection = tempList
                }
            },
            handleSelection(selection,row) {
                let selectedLineIds = selection.map(item => item.materialsSkuId)
                let isChecked = selectedLineIds.includes(row.materialsSkuId)
                if(isChecked){
                    this.selection.push(row)
                } else {
                    this.selection.splice(this.selection.findIndex(item => item.materialsSkuId ==row.materialsSkuId),1)
                }
            },
            getList(pageNum=1) {
                this.loading = true
                let params = {
                    pageNo: pageNum,
                    pageSize: 20,
                    queryColumn: this.keyword,
                    unitId: this.unitId,
                    outsideFactoryId: this.supId,
                    supplierId: this.supplierId
                }
                pageFormQueryOnMaterial(params).then(res => {
                    this.loading = false
                    this.tableData = res.data.data.list || []
                    this.total = res.data.data.totalCount
                    this.$nextTick(() => {
                        this.tableData.forEach(row => {
                            this.$refs.multipleTable.toggleRowSelection(row,this.selection.some(v => v.materialsSkuId==row.materialsSkuId))
                        });
                    })
                })
            }
        },
        created() {
            // this.getList()
        }
    }
</script>

<style lang="scss" scoped>
    .orange-btn{
        color:#ff9c38 ;
        background: transparent;
        border: 1px solid #ff9c38;
    }
</style>