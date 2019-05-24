<template>
    <!-- 按需采购、按计划外采购弹窗 -->
    <div class="search-material-dialog">
        <el-dialog
                class="custom-dialog"
                :title="title"
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
                                   :placeholder="searchPlaceholder"
                                   icon="search">
                        </el-input>
                    </div>
                    <el-button v-if="type == 'material'"  @click='addMaterial.visible = true' size="small"  class="orange-btn">+新建物料</el-button>
                </div>
                <el-table
                        v-if="visible"
                        @select="handleCheckedChange"
                        @select-all="handleCheckAllChange"
                        ref="searchTable"
                        height="520"
                        :data="searchList"
                        border
                        class="custom-table tiny-row mgt8"
                        style="width: 100%">
                    <el-table-column
                            v-if="type=='notice'"
                            fixed="left"
                            align="center"
                            width="50"
                            label="">
                        <template slot-scope="scope">
                            <el-radio v-model="newSelectedList.billDeliveryNotifyId" :label="scope.row.id"><span></span></el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-else
                            fixed="left"
                            align="center"
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            v-for="column in fieldConfigList"
                            :key="column.code"
                            :prop="column.code"
                            :label="column.name"
                            :min-width="column.width">
                        <template slot-scope="scope">
                            <div class="custom-cell ">
                                <img @click="previewImg(scope.row)" v-if="column.name ==='图片'" v-errorLogo
                                     style="display:inline-block;vertical-align: middle;width: 24px;height: 24px;"
                                     :src="scope.row[column.code]"/>
                                <div  v-else-if="column.name ==='供应商款号/色号'">
                                    {{scope.row.supplierStyleNo}}/{{scope.row.supplierColorNo}}
                                </div>
                                <div  v-else-if="['制单日期','交货日期','操作日期','送料日期','采购日期'].includes(column.name)">
                                    {{scope.row[column.code] | filterTime }}
                                </div>
                                <div v-else>{{scope.row[column.code]}}</div>
                            </div>
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
                <div v-if="type == 'mission'" class="fl lh32" >已选<span class="orange">{{newSelectedList.length}}</span>条生产单</div>
                <div v-if="type == 'material'" class="fl lh32" >已选<span class="orange">{{newSelectedList.length}}</span>款物料</div>
                <div v-if="type == 'purchase'" class="fl lh32" >已选<span class="orange">{{newSelectedList.length}}</span>条采购单</div>
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
        deliveryPageFormQueryOnMaterial,
        deliveryPageQueryOnMission,
        deliveryPagePurchase,
        deliveryListBillNotify
    } from '@/api/material.js'
    import addMaterial from "@/components/material/materialArchives/addMaterial.vue"; //悬浮添加组件

    export default {
        // type:类型
        // mission：按工单
        // purchase：按采购单
        // notice：按送料通知单
        // material：按物料添加
        props: ['visible','type','selectedList','outsideFactoryId'],

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
                previewList:[],
                fieldConfigList:[],

            }
        },
        filters: {
            filterTime(val) {
                if (val) {
                    return val.slice(0, 11);
                }
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
            // selectedIds(){
            //     return this.newSelectedList.map(item => item.lineId)
            // },
            title(){
                let title = ''
                switch (this.type){
                    case 'mission': title = '按工单添加' ;break;
                    case 'purchase': title = '按采购单添加';break;
                    case 'notice': title = '按送料通知单添加';break;
                    case 'material': title = '按物料添加' ;break;
                }
                return title
            },
            searchPlaceholder(){
                let placeholder = ''
                switch (this.type){
                    case 'mission': placeholder = '输入商品款号/生产单号/整单外发/客户/负责人添加' ;break;
                    case 'purchase': placeholder = '输入采购单/采购员/供应商';break;
                    case 'notice': placeholder = '输入送料通知单号/送料仓库/加工厂/操作员/成衣款号搜索';break;
                    case 'material': placeholder = ' 输入物料款号/名称/物料分类/默认供应商/供应商款号色号添加' ;break;
                }
                return placeholder
            }
        },
        watch:{
            visible(val){
                if(val){
                    // 动态表头
                    if(this.type === 'mission'){
                        this.fieldConfigList = [
                            {code:'styleNo',name:'成衣款号',width:120},
                            {code:'facMissionNo',name:'工单号',width:120},
                            {code:'outsideFactoryName',name:'整单外发',width:120},
                            {code:'placeorderDate',name:'制单日期',width:120},
                            {code:'deliveryDate',name:'交货日期',width:120},
                            {code:'customerName',name:'客户',width:120},
                            {code:'num',name:'订货数',width:120},
                            {code:'chargerName',name:'负责人',width:120}
                        ]
                    } else if(this.type === 'material'){
                        this.fieldConfigList = [
                            {code:'kindName',name:'分类',width:120},
                            {code:'commonMaterialsSkuPicture',name:'图片',width:60},
                            {code:'materialsNo',name:'物料款号',width:100},
                            {code:'materialsName',name:'物料名称',width:120},
                            {code:'colorName',name:'颜色',width:80},
                            {code:'specificationsRemark',name:'规格',width:80},
                            {code:'supplierName',name:'默认供应商',width:120},
                            {code:'supplierStyleNo',name:'供应商款号/色号',width:120},
                            {code:'stockUnitName',name:'库存单位',width:80}
                        ]
                    } else if(this.type === 'notice'){
                        this.fieldConfigList = [
                            {code:'orderNo',name:'送料通知单号',width:120},
                            {code:'styleNo',name:'成衣款号',width:120},
                            {code:'storehouseName',name:'送料仓库',width:120},
                            {code:'outsideFactoryName',name:'加工厂',width:120},
                            {code:'username',name:'操作员',width:120},
                            {code:'dateOperate',name:'操作日期',width:120},
                        ]
                    } else if(this.type === 'purchase'){
                        this.fieldConfigList = [
                            {code:'billPurchaseOrderNo',name:'采购单号',width:120},
                            {code:'purchaserName',name:'采购员',width:120},
                            {code:'datePurchase',name:'采购日期',width:120},
                            {code:'supplierName',name:'供应商',width:120},
                        ]
                    }
                    this.newSelectedList = JSON.parse(JSON.stringify(this.selectedList))
                    this.page ={
                        pageNo:1,
                        pageSize:20,
                        total:0
                    }
                    this.getSearchList()
                }
            },
            'newSelectedList.billDeliveryNotifyId'(val){
                if(val&&this.type==='notice'){
                    let row = this.searchList.find(item=> item.id ==val)
                    this.newSelectedList = {
                        billDeliveryNotifyId:row.id,
                        billDeliveryNotifyNo:row.orderNo
                    }
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
                this.previewList = row.commonMaterialsPictureList
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
                    outsideFactoryId:this.outsideFactoryId,
                    queryColumn:this.queryColumn,
                    pageNo:this.page.pageNo,
                    pageSize:this.page.pageSize
                }
                let api = ''
                // mission：按工单
                // purchase：按采购单
                // notice：按送料通知单
                // material：按物料添加
                switch (this.type){
                    case 'mission': api= deliveryPageQueryOnMission ;break;
                    case 'purchase':api= deliveryPagePurchase;break;
                    case 'notice':api=deliveryListBillNotify;break;
                    case 'material': api=deliveryPageFormQueryOnMaterial ;break;
                }
                this.loading = true
                api(params).then(res =>{
                    this.loading = false
                    if(res.data.code == 0){
                        this.page.total = res.data.data.totalCount
                        this.searchList = res.data.data.list
                        if(this.type!='notice'){
                            this.$nextTick(function (e) {
                                this.searchList.forEach(row => {
                                    this.$refs.searchTable.toggleRowSelection(row,this.newSelectedList.includes(row.lineId))
                                });
                            })
                        }

                    }
                })
            },



            cancel(){
                this.$emit('update:visible',false)
            },
            confirm(){
                this.$emit('confirm',this.newSelectedList,this.type)
                this.$emit('update:visible',false)

            },
            // 全选/取消全选操作
            handleCheckAllChange(selection) {
                let isCheckAll = selection.length>0
                if(isCheckAll){
                    selection.forEach(item => {
                        if(!this.newSelectedList.includes(item.lineId)){
                            this.newSelectedList.push(item.lineId)
                        }
                    })
                } else {
                    let deleteLineIds = this.searchList.map(item => item.lineId)
                    let tempList = []
                    this.newSelectedList.forEach(item =>{
                        if(!deleteLineIds.includes(item.lineId)){
                            tempList.push(item.lineId)
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
                    this.newSelectedList.push(row.lineId)
                } else {
                    this.newSelectedList.splice(this.newSelectedList.findIndex(item => item ==row.lineId),1)
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
            width: 420px;
            .el-input__inner{
                height: 32px;
            }
        }
        .el-dialog--small{
            top: 30px !important;
            width:80%;
            margin-bottom: 0;
            .el-dialog__body{
                padding: 16px;
            }
        }
    }

</style>
