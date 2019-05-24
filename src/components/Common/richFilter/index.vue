<template>
    <div class="rich-filter">
        <el-input class="fs12"  :placeholder="selected.length>0?'已选'+selected.length+'个':placeholder" @focus="showSelectDialog" icon="caret-bottom"></el-input>
        <el-dialog  :modal-append-to-body="false" class="custom-dialog" :title="dialogParams.dialogTitle"
                   :visible.sync="selectDialoVisible" size="small">
            <div class="main-content">
                <div style="width: 300px" class="column-item">
                    <div class="header">属性筛选</div>
                    <div class="body">　　
                        <el-form label-width="90px">
                            <template v-for="(filterItem,filterIndex) in dialogParams.filterItems" >
                                <el-form-item :class="{'goods-attr-item':filterItem.item.type =='STYLE_ATTR'}"
                                              v-if="filterItem.itemType=='NORMAL_ITEM'" :label="filterItem.item.name">
                                    <!--文本类型-->
                                    <el-input v-if="filterItem.item.type=='TEXT'" type="text"
                                              v-model="filterItem.selected" :placeholder="getPlaceHolder(filterItem.item.name)"></el-input>
                                    <!--下拉框类型-->
                                    <el-select
                                            v-else-if="['SINGLE_SELECT','MULTI_SELECT'].includes(filterItem.item.type)
                                                        &&!filterItem.item.remoteFilter"
                                            v-model="filterItem.selected"
                                            clearable
                                            filterable
                                            :multiple="filterItem.item.type == 'MULTI_SELECT'"
                                            :placeholder="getPlaceHolder(filterItem.item.name)">
                                        <el-option
                                                v-for="item in filterItem.item.selectOptions"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <!--远程搜索的下拉框类型-->
                                    <remote-select
                                            v-else-if="['SINGLE_SELECT','MULTI_SELECT'].includes(filterItem.item.type)
                                                        &&filterItem.item.remoteFilter"
                                            v-model="filterItem.selected"
                                            :modelName="modelName"
                                            :filter-item="filterItem"
                                            :filter-index="filterIndex"></remote-select>
                                    <!--日期类型-->
                                    <el-date-picker
                                            v-else-if="['DATE_SINGLE','DATE_RANGE'].includes(filterItem.item.type)"
                                            v-model="filterItem.selected"
                                            :type="filterItem.item.type=='DATE_SINGLE'?'date':'daterange'"
                                             placeholder="全部">
                                    </el-date-picker>
                                    <goods-attr-item ref="goodsAttrItem"
                                            :model-name="modelName"
                                            v-else-if="filterItem.item.type=='STYLE_ATTR'"
                                            v-model="filterItem.selected"></goods-attr-item>
                                    <workerLeader
                                            v-else-if="filterItem.item.type=='MULTI_SELECT_USER'"
                                            :manListProps="manList"
                                            v-model="filterItem.selected"
                                            placeholder="全部">
                                    </workerLeader>
                                </el-form-item>
                                <el-form-item v-else :label="filterItem.item.customFieldName">
                                    <el-select
                                            v-model="filterItem.selected"
                                            clearable
                                            filterable
                                            :multiple="filterItem.item.customFieldType == 'MULTI_SELECT'"
                                            placeholder="全部">
                                        <el-option
                                                v-for="item in filterItem.item.options"
                                                :key="item.optionId"
                                                :label="item.optionName"
                                                :value="item.optionId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-form>
                    </div>
                    <div class="footer">
                        <div class="btn-group">
                            <el-button size="small" class="btn btn-reset" @click="reset">清空属性</el-button>
                            <el-button :loading="isSubmitting" style="background-color: #54D1BC;color: #fff;border: 1px solid #54D1BC;" size="small" class="btn btn-submit" @click="filter">查询</el-button>
                        </div>
                    </div>
                </div>
                <div style="width: 360px" class="column-item">
                    <div class="header">查询结果</div>
                    <div class="body" v-loading="isSubmitting">
                        <el-table
                                ref="searchTable"
                                @select="selectOne"
                                @select-all="selectAll"
                                :data="searchList"
                                border
                                height="552"
                                class="custom-table"
                                style="width: 100%">
                            <el-table-column type="selection" width="35">
                            </el-table-column>
                            <el-table-column prop="picturePath" label="图片" width="55">
                                <template slot-scope="scope">
                                    <img class="result-img" v-errorLogo :src="scope.row.picturePath"/>
                                </template>
                            </el-table-column>
                            <el-table-column prop="resultColumn" :label="dialogParams.resultColumnText">
                                <template slot-scope="scope">
                                    <div v-html="scope.row.resultColumn"></div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="footer">
                        <el-pagination @current-change="getList" :page-size="page.pageSize"
                                       layout="total, prev, pager, next"
                                       :total="page.totalCount" :current-page.sync="page.pageNo">
                        </el-pagination>
                    </div>
                </div>
                <div style="width: 400px" class="column-item">
                    <div class="header">已选范围</div>
                    <div class="body">
                        <el-table
                                :data="selectedList"
                                border
                                height="552"
                                class="custom-table"
                                style="width: 100%">
                            <el-table-column prop="picturePath" label="图片" width="55">
                                <template slot-scope="scope">
                                    <img class="result-img" v-errorLogo :src="scope.row.picturePath"/>
                                </template>
                            </el-table-column>
                            <el-table-column prop="resultColumn" :label="dialogParams.resultColumnText">
                                <template slot-scope="scope">
                                    <div v-html="scope.row.resultColumn"></div>
                                </template>
                            </el-table-column>
                            <el-table-column width="75"  :render-header="renderDeleteAllHeader">
                                <template slot-scope="scope">
                                    <span @click="deleteOne(scope.row,scope.$index)" class="red pointer">删除</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="footer"><div class="pdt8 pdb8">共{{selectedList.length}}条</div></div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button :disabled="isSaving" type="primary" @click="filterAll">选择全部</el-button>
                <el-button :disabled="isSaving" type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        getCommonFilterDialogParams,
        commonFilterRemoteSearch,
        getUnitUser,
        commonFilterSearch
    } from '@/api'
    import GoodsAttrItem from "./goodsAttrItem";
    import RemoteSelect from "./remoteSelect";
    import {formatDate} from "@/utils";
    export default {
        // "dialogType":"弹窗类型",
        /*
        STYLE("商品档案筛选"),
        DESIGN_STYLE("设计档案筛选"),
        MATERIAL("物料档案筛选");

        */
        // "modelName":"模块名称",
        /*
        GOODS_STYLE 商品档案；
        SPL_DESIGN_STYLE 设计档案;
        FAC_PRD_ORDER    生产订单;
        FACTORY_MISSION  生产工单;
        GOODS_STOCK  商品库存
        */

        props: ['value','dialogType','modelName','placeholder'],
        components: {
            RemoteSelect,
            GoodsAttrItem},
        data() {
            return {
                selected:[], //选中的id
                isSubmitting:false,
                searchList: [], // 搜索结果列表
                selectedList: [],  // 选中列表
                backupSelectedList:[], //每次点击筛选后，把选中的列表报错起来，用于点击取消的时候，将选中列表复原
                filterParams:{},
                page: {
                    pageNo: 1,
                    pageSize: 12,
                    totalCount: 0,
                },
                selectDialoVisible: false,
                dialogParams: {
                    dialogTitle: '', //"弹窗标题"
                    resultColumnText: '', //"筛选结果的列名"
                    filterItems: '', //左侧的筛选项
                },
                groupOptions: [],//分组用户
                searchType:2 , // 1:普通搜索，2：选择全部
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch:{
            value(val){
                if((!Object.keys(val).length)||
                    (val.searchType==1&&val.ids&&!val.ids.length)||
                    (val.searchType==2&&val.searchParam&&!Object.keys(val.searchParam).length)){
                    this.selected = []
                    if(this.dialogParams.filterItems){
                        this.dialogParams.filterItems.forEach(filterItems => filterItems.selected = filterItems.item.type==='TEXT'?'':[])
                    }
                    let hasGoodsAttrItem =this.dialogParams.filterItems.some(filterItem=>filterItem.item.type==='STYLE_ATTR')
                    if(hasGoodsAttrItem &&this.$refs.goodsAttrItem&&this.$refs.goodsAttrItem[0]){
                        this.$refs.goodsAttrItem[0].reset()
                    }
                }
            },
            selectDialoVisible(val){
                if(val&&!this.selected.length&&this.searchType!=2){
                    this.page.pageNo = 1
                    this.page.totalCount = 0
                    this.searchList = []
                    this.selectedList = []
                }
            }
        },
        methods: {
            // 显示筛选弹层
            getPlaceHolder(name){
                let placeholder = '全部'
                switch (name){
                    case '商品款号' : placeholder = '输入款号搜索';break;
                    case '商品名称' : placeholder = '输入名称搜索';break;
                    case '厂家货号' : placeholder = '输入货号搜索';break;
                    case '供应商' : placeholder = '输入名称/编号搜索';break;
                }
                return placeholder
            },
            // 显示筛选弹层
            showSelectDialog(){
                this.selectDialoVisible = true
                this.$nextTick(function () {
                    this.checkedCurrentPage()
                })

            },
            // 重置
            reset(){
                this.searchType = 1
                this.dialogParams.filterItems.forEach(filterItems => filterItems.selected = filterItems.item.type==='TEXT'?'':[])
                let hasGoodsAttrItem =this.dialogParams.filterItems.some(filterItem=>filterItem.item.type==='STYLE_ATTR')
                if(hasGoodsAttrItem){
                    this.$refs.goodsAttrItem[0].reset()
                }
                this.filter()
            },
            // 获取列表
            getList(pageNo){
                this.page.pageNo = pageNo
                let params = {
                    ...this.filterParams,
                    pageNo:this.page.pageNo,
                    pageSize:this.page.pageSize
                }
                this.isSubmitting = true
                commonFilterSearch(params).then(res =>{
                    this.isSubmitting = false
                    if(res.data.code == 0){
                        this.searchList = res.data.data.list
                        this.page.totalCount = res.data.data.totalCount
                        // 将右侧选中的，勾选上复选框
                        this.$nextTick(function () {
                            this.checkedCurrentPage()
                        })
                    }
                })
            },
            // 拼接查询参数
            setFilterParams(){
                this.filterParams = {}
                // 自定义字段参数
                let customFieldParams = []
                // 商品属性字段参数:attrIds categorys
                let goodsAttrParams = {}
                // 普通字段
                let commonParams = {}
                this.dialogParams.filterItems.forEach(filterItem =>{
                    if(filterItem.itemType ==='CUSTOM_ITEM'){
                        if(filterItem.selected.length){
                            customFieldParams.push({
                                customFieldId:filterItem.item.customFieldId,
                                selectedOptions:filterItem.item.customFieldType==='SINGLE_SELECT'?[filterItem.selected]:filterItem.selected
                            })
                        }
                    } else {
                        if(filterItem.item.type ==='STYLE_ATTR'){
                            goodsAttrParams = filterItem.selected
                        } else {
                            // 处理时间格式
                            let selected = filterItem.selected
                            if(filterItem.item.type === 'DATE_SINGLE'&&selected.length){
                                selected = formatDate(selected, "yyyy-MM-dd")
                            } else if(filterItem.item.type === 'DATE_RANGE'&&selected.length){
                                selected = [formatDate(selected[0], "yyyy-MM-dd"),formatDate(selected[1], "yyyy-MM-dd")]
                            }
                            commonParams[filterItem.item.key] = selected
                        }
                    }
                })
                this.filterParams = {
                    ...commonParams,
                    ...goodsAttrParams,
                    customFieldParams : customFieldParams,
                    dialogType:this.dialogParams.dialogType,
                    unitId:this.unitId,
                    userId:this.userId,
                }
            },
            // 查询
            filter(){
                this.setFilterParams()
                this.getList(1)
            },
            // 查询弹窗所需数据（包括左侧筛选项、弹窗标题、列名等）
            async getCommonFilterDialogParams() {
                let params = {
                    dialogType: this.dialogType,
                    bossUnitId: this.bossUnitId
                }
                await getCommonFilterDialogParams(params).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data
                        data.filterItems.forEach(item => item.selected = item.item.type==='TEXT'?'':[])
                        this.dialogParams = data
                    }
                })
            },
            // 取消
            cancel() {
                this.selectedList = JSON.parse(JSON.stringify(this.backupSelectedList))
                this.selectDialoVisible = false
            },
            // 确定筛选
            confirm() {
                this.backupSelectedList = JSON.parse(JSON.stringify(this.selectedList))
                this.selected = this.selectedList.map(item=>item.id)
                this.searchType = this.selected.length>0?1:2
                if(this.searchType == 1){
                    this.$emit('input',{ids:this.selected,searchType:this.searchType})
                    this.$emit('filter',{ids:this.selected,searchType:this.searchType})
                } else {
                    this.$emit('input',{ searchParam:this.filterParams,searchType:this.searchType})
                    this.$emit('filter',{ searchParam:this.filterParams,searchType:this.searchType})
                }
                this.selectDialoVisible = false
            },
            // 点击复选框
            selectOne(selection,row){
                let actionIndex = this.selectedList.findIndex(item=>item.id === row.id)
                if(actionIndex>-1){
                    this.selectedList.splice(actionIndex,1)
                } else {
                    this.selectedList.push(row)
                }
            },
            // 点击全选框
            selectAll(selection){
                // 全部选中
                if(selection.length>0){
                    selection.forEach(selectionItem => {
                        if (!this.selectedList.some(item => item.id === selectionItem.id)) {
                            this.selectedList.push(selectionItem)
                        }
                    })
                } else{
                    let selectedList = []
                    this.selectedList.forEach(selectedItem =>{
                        if(!this.searchList.some(item =>item.id === selectedItem.id)){
                            selectedList.push(selectedItem)
                        }
                    })
                    this.selectedList = selectedList
                }
            },
            // 删除一条已选
            deleteOne(item,index){
                let deleteItem = this.searchList.find(searchItem=>item.id === searchItem.id)
                this.$refs.searchTable.toggleRowSelection(deleteItem,false)
                this.selectedList.splice(index,1)
            },
            // 删除所有已选
            deleteAll(){
                this.searchList.forEach(item=>{
                    this.$refs.searchTable.toggleRowSelection(item,false)
                })
                this.selectedList = []
            },
            // 切换筛选结果页的时候，根据已选范围，将查询结果里对应的复选框选中
            checkedCurrentPage(){
                this.searchList.forEach(searchItem=>{
                    if(this.selectedList.some(item =>item.id ===searchItem.id)){
                        this.$refs.searchTable.toggleRowSelection(searchItem,true)
                    } else{
                        this.$refs.searchTable.toggleRowSelection(searchItem,false)
                    }
                })
            },
            // 获取分组用户
            fetchUnitUser() {
                getUnitUser({
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                }).then(res => {
                    if (res.data.code == 0) {
                        this.groupOptions = res.data.data.facGroupDTOS;
                    }

                });
            },
            // 选择全部
            filterAll(){
                this.setFilterParams()
                this.searchType = 2
                this.$emit('input',{ searchParam:this.filterParams,searchType:this.searchType})
                this.$emit('filter',{ searchParam:this.filterParams,searchType:this.searchType})
                this.selectDialoVisible = false
                this.selectedList = []
                this.selected = []
            },
            renderDeleteAllHeader(createElement, {column, $index}) {
                return ( < div
                onClick = {this.deleteAll}
                style = "color:#fa4150;cursor:pointer" > 全部删除 < /div>);
                // return ''
            },

        },
        async created() {
            this.fetchUnitUser()
            await this.getCommonFilterDialogParams()
            // 创建时给v-model设置默认值
            // this.setFilterParams()
            // this.$emit('input',{ searchParam:this.filterParams,searchType:this.searchType})
            // this.$emit('filter',{ searchParam:this.filterParams,searchType:this.searchType})

        }
    }
</script>
<style lang="scss" scoped>
    .rich-filter {
        .main-content {
            position: relative;
            height: 630px;
            padding: 16px;
            display: flex;
            .column-item {
                height: 100%;
                border: 1px solid #DFE6EC;
                display: flex;
                flex-direction: column;
                font-size: 12px;
                margin-right: 16px;
                &:last-child {
                    margin-right: 0;
                }
                .header {
                    line-height: 32px;
                    font-weight: bold;
                    padding: 0 12px;
                    border-bottom: 1px solid #DFE6EC;
                }
                .body {
                    position: relative;
                    flex: 1;
                    overflow-y: auto;
                    .delete-all-btn {
                        position: absolute;
                        right: 15px;
                    }
                    .result-img {
                        width: 38px;
                        height: 38px;
                        vertical-align: middle;
                        margin: 3px 0;
                    }
                }
                .footer {
                    display: flex;
                    align-items: center;
                    flex-direction: row-reverse;
                    height: 40px;
                    padding: 0 6px;
                    border-top: 1px solid #DFE6EC;
                }
            }
        }
    }
</style>
<style lang="scss">
    .rich-filter {
        .el-dialog {
            width: 1130px;
            top: 30px !important;
            margin-bottom: 0;
            .el-dialog__body {
                padding: 0;
            }
            .el-dialog__footer {
                padding: 12px 24px;
                text-align: right;
            }
        }
        .column-item {

            .el-form-item{
                display: flex;
                margin-bottom: 12px;
                margin-right: 0;
                &>.el-form-item__label{
                    font-size: 12px;
                }
                &>.el-form-item__content{
                    flex: 1;
                    margin-left: 0 !important;
                    .el-select,
                    .el-input{
                        font-size: 12px;
                        width: 100%;
                    }
                }
            }
            /*.el-form-item__label{*/
                /*float: left!important;*/
                /*display: block !important;*/
            /*}*/
             /*.el-form-item__content{*/
                /*display: block !important;*/
                /*vertical-align: baseline !important;*/
            /*}*/
            .el-table::after, .el-table::before {
                content: none;
            }
            .el-table {
                border: none;
                .el-table--border tr > td:last-child,
                .el-table--border tr > th:last-child {
                    border-right: none !important;
                }
            }
            .custom-table.el-table .cell, .custom-table.el-table th > div{
                padding-left: 10px !important;
                padding-right: 10px !important;
            }
            .el-form {
                margin-top: 12px;
            }
            .el-form-item {
                margin: 0 12px 12px 0;
                .el-date-editor--daterange.el-input,
                .el-select {
                    width: 100%;
                }
            }
            .el-form-item.goods-attr-item {
                margin-right: 0;
                margin-bottom: 0;
                & > .el-form-item__content {
                    margin-left: 0 !important;
                }
            }
        }
        .footer{
            .el-pagination{
                line-height: 28px !important;
                padding-left: 0;
                .el-pagination__total{
                    margin: 0 3px;
                }
            }
            .btn-group{
                margin: 0 !important;
            }
        }


    }

</style>
