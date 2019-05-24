<template>
    <div class="goods_management scroll-content">
        <div class="fixed-top" >
            <page-title style="padding: 10px;border-bottom: 1px solid #e0e6ed;" title="商品档案">
                <!-- <nf-button style="background:#939fb8;color:#fff;"  @click="$router.push('/goodsBarCodeManagement')">货品条码管理</nf-button>         -->
                <div style="display: inline-block">
                    <span>商品筛选</span>
                    <rich-filter style="display: inline-block;width:250px"
                                 v-model="richFilterParams"
                                 @filter="submit"
                                 dialogType='STYLE'
                                 placeholder="点击可筛选商品"
                                 modelName="GOODS_STYLE"></rich-filter>
                </div>
                <el-popover
                        ref="popover4"
                        placement="bottom"
                        width="100"
                        trigger="hover">
                    <nf-button @click.native="dialogGoodConfigGo">配置商品必填</nf-button>
                    <nf-button @click.native="exportExcel" style="margin: 6px 0">导出档案</nf-button>
                    <nf-button @click.native="systemImport">从体系导入</nf-button>
                    <nf-button @click.native="dialogVisibleExcel = true" style="margin-top: 6px;">从Excel导入</nf-button>
                </el-popover>
                <nf-button v-popover:popover4 style="width: 100px;">更多</nf-button>
                <nf-button type="warning" svg="icon-btn-add" @click.native="isShow">新建</nf-button>
            </page-title>
            <div class="custom-filter-form box-shadow clearfix">
                <el-form :model="filterFormData" status-icon label-width="100px" style="margin-left:-40px">

                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品款号">
                            <goods-select v-model="filterFormData.styleIds" :multiple="true"
                                          modelName="GOODS_STYLE"></goods-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="24" :lg="6" style="float: right;">
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </el-col>
                </el-form>
            </div>
            <plan-execute-work-panel config-code="goods_style"></plan-execute-work-panel>
        </div>

        <div v-loading="loading" class="main-content content mgt16" id="goods_content">
            <!--<template>-->
                <el-table
                        :height="tableHeight"
                        class="custom-table"
                        :data="listInfo"
                        @sort-change="sortTable"
                        :border="true"
                        style="width: 100%"
                        :default-sort="{prop: 'date', order: 'descending'}"
                        @row-click="goToInfo">
                    <el-table-column prop="styleNo" label="款号" sortable width="200">
                        <template slot-scope="scope">
                            <div class="style-content">
                            <img :src="scope.row.picture?scope.row.picture:$globalConfig.qiniu.baseDefaultUrl"
                                 @click.stop="imgList(scope.row)">
                            <span  class="style_no">{{scope.row.styleNo}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="styleName" label="名称" sortable width="150">
                    </el-table-column>
                    <el-table-column prop="outsideFactoryName" label="供应商" sortable width="150">
                    </el-table-column>
                    <el-table-column label="规格">
                        <template slot-scope="scope">
                            <ul>
                                <li>颜色：
                                    <span v-for="(item1,index) of scope.row.colors" :key="index" class="span">
                        {{item1.name?item1.value +'-'+item1.name:item1.value}}
                        <i v-if="index !== scope.row.colors.length - 1">、</i>
                      </span>
                                </li>
                                <li>尺码：
                                    <span v-for="(item1,index) of scope.row.sizes" :key="index" class="span">
                        {{item1.value}}
                        <i v-if="index !== scope.row.sizes.length - 1">、</i>
                      </span>
                                </li>
                                <li v-if=" scope.row.lengths.length!=0">内长：
                                    <span v-for="(item1,index) of scope.row.lengths" :key="index" class="span">
                        {{item1.value}}
                        <i v-if="index !== scope.row.lengths.length - 1">、</i>
                      </span>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createBy" label="创建人" width='80'>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable width='140'>
                    </el-table-column>
                    <el-table-column prop="opBy" label="最后更新人" width='90'>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后更新时间" width='140'>
                    </el-table-column>
                </el-table>
            <!--</template>-->
        </div>
        <div class="page">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="currentPage1" :page-size="20" layout="total, prev, pager, next"
                           :total="table">
            </el-pagination>
        </div>
        <el-dialog :visible.sync="centerDialogVisible" :show-close="true" width="100%" :modal="true" center>
            <div>
                <i class="el-icon-arrow-left" @click="leftImg"></i>
            </div>
            <div class="imgs"><img :src="this.imgLists[i]"></div>
            <div>
                <i class="el-icon-arrow-right" @click="rightImg"></i>
            </div>
        </el-dialog>

        <!-- 配置新建商品必填 -->
        <el-dialog
                custom-class="nf-dialog-common audit-dialog"
                title="配置新建商品必填"
                :close-on-click-modal="false"
                :show-close="false"
                :visible.sync="dialogGoodConfig">
            <div class="good-config-must">
                <div class="good-config-must-item" v-for="item in goodEditConfigTitleData" :key="item.fieldId">
                    <el-checkbox class="item-title" v-model="item.required" @change="changeAll(item.required,item.fieldId)">{{item.fieldName}}</el-checkbox>
                    <div class="item-container">
                        <el-checkbox v-model="$item.required" @change="isChangeAll(item.fieldId)" :disabled="$item.defaultFlag"  v-if="$item.parentId === item.fieldId" v-for="$item in goodEditConfigData" :key="$item.fieldId">{{$item.fieldName}}</el-checkbox>

                    </div>
                </div>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="space-between" slot="footer">
                <nf-button @click="dialogGoodConfigGo" style="margin-right: 20px;">重 置</nf-button>
                <span>
                    <nf-button @click="dialogGoodConfig = false" style="margin-right: 20px;" :loading="btnLoading">取 消</nf-button>
                    <nf-button type="warning" @click="dialogGoodConfigSubmit" :loading="btnLoading">确 定</nf-button>
                </span>

            </el-row>
        </el-dialog>
        <!--导入excel组件-->
        <UploadExcelComponent
                :excelStatic="excelStatic"
                :excelDemoUrl="excelDemoUrl"
                @uploadFinish="uploadFinish"
                @commit="commitExcelData"
                @reset="closeUploadComponent"
                :dialogVisibleExcel="dialogVisibleExcel">
        </UploadExcelComponent>

        <!--新建编辑商品组件-->
        <transition name="right-move">
            <goods-dialog
                    v-if="goodsDialog"
                    modelName="GOODS_STYLE"
                    :handleType="handleType"
                    :goodsId="editGoodsId"
                    :styleId="editGoodsStyleId"
                    @hidden="hiddenAddGoodsDialog">
            </goods-dialog>
        </transition>
        <transition name="opcity">
            <div class="cover1" v-if="goodsDialog" @click="hiddenAddGoodsDialog">
            </div>
        </transition>

    </div>
</template>

<script>
    import {
        selectFacGoodsStyle,
        getFacGoodsPictureList,
        goodEditConfig,
        goodUpdateConfig,
        getFacCommonAttrs,
        importGoodsExcel,
    } from "../../api/api";
    import {
        exportExcelGoodsStyle,
    } from "@/api/material.js";
    import SelectSpecific from "./child/selectSpecific";
    import UploadExcelComponent from '@/components/Common/uploadExcel.vue';
    import GoodsDialog from '@/components/order/createChild/goods-dialog.vue';
    import PlanExecuteWorkPanel from "@/components/goodsPlan/procurementPlan/list/components/planExecuteWorkPanel.vue";
    import CustomFieldFrom from '@/components/Common/customFieldFrom.vue';

    import { log } from 'util';
    export default {
        data() {
            return {
                isReset: false, // 是否重置
                filterFormData:{
                    styleIds:[],
                },
                tableHeight:500,
                goodEditConfigData:[],
                goodEditConfigTitleData:[],
                dialogGoodConfig:false,  //商品必填配置
                btnLoading:false,
                loading:false,
                to_outsideFactoryIds:[],//控制供应商变量传后台
                richFilterParams:{
                },//商品富筛选框参数
                centerDialogVisible: false,
                listInfo: [],
                input2: "",
                table: 0,
                currentPage1: 1,
                pageNo:1,
                picture: "",
                imgLists: [],
                i: 0,
                facInfo: {},
                brandArr: [],
                designerArr: [],
                waveArr: [],
                kindArr: [],
                yearArr: [],
                tagArr: [],
                seasonArr: [],
                showType: true,
                dialogVisibleExcel: false,//导入excel弹窗
                excelStatic:{
                    loading: false,
                    excelData: true,
                    excelDataErr:0,
                    excelDataSucc:0,
                    failureId: ''
                },
                excelDemoUrl: 'goodsTemplate',
                goodsDialog: false,     //编辑货品弹窗
                handleType: '',      //货品操作类型：新建/编辑
                editGoodsId: '',      //编辑操作要用的goodsId
                editGoodsStyleId: '',  //编辑操作要用的styleId
                outsid:{},//存储临时变量供应商的对象

            };
        },
        components: {
            SelectSpecific,
            UploadExcelComponent,
            GoodsDialog,
            PlanExecuteWorkPanel,
            CustomFieldFrom
        },
        mounted(){
            this.tableHeight = $('.main-content').height()
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
        },
        methods: {
            //导出档案
            exportExcel(){
                let params = {
                    ...this.richFilterParams,
                    facId: this.unitId,
                    pageNo: this.pageNo,
                    token: "",
                    sortType: 0,
                };
                exportExcelGoodsStyle(params).then(res => {
                    this.fileData = res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href', url);
                    a.setAttribute('download', '商品档案.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            },
            //从体系导入跳转
            systemImport(){
                this.$router.push("/goodsSystemImport");
            },
            dialogGoodConfigGo(){
                let datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.goods.style.required.field") === -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                goodEditConfig({unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.goodEditConfigData = res.data.data;
                        this.goodEditConfigTitleData = res.data.data.filter(item=>!item.parentId)
                        this.$nextTick(function () {
                            this.dialogGoodConfig = true
                        })
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })

            },
            changeAll(value,fieldId){
                // 全选或者取消全选操作
                this.goodEditConfigData.forEach(item=>{
                    if(item.parentId === fieldId && !item.defaultFlag){
                        this.$set(item,'required',value)
                    }

                })

            },
            isChangeAll(parentId){
                // 全选或者取消全选操作
                let flag = true
                this.goodEditConfigData.forEach(item=>{
                    if(item.parentId === parentId && !item.required){
                        flag = false
                    }
                });
                this.goodEditConfigData.forEach(item=>{
                    if(item.fieldId === parentId ){
                        this.$set(item,'required',flag)
                    }
                })
            },
            dialogGoodConfigSubmit(){
                this.btnLoading = true;
                let fieldIds = this.goodEditConfigData.filter(item=>item.required)
                goodUpdateConfig({unitId:this.unitId,fieldIds}).then(res=>{
                    console.log(res);
                    this.btnLoading = false;
                    if(res.data.code===0){
                        this.$message.success('配置成功')
                        this.dialogGoodConfig = false
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
            // 供应商下拉选中全部的时候的操作事件
            changeFunction(item){
                let arr = this.filterFormData.outsideFactoryIds;
                if (item.length > 1 && arr[0] == "all") {
                    for (let i = 0; i < item.length; i++) {
                        if (item[i] == "all") {
                            item.splice(i, 1);
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j] == "all") {
                                    arr.splice(j, 1);
                                }
                            }
                        }
                    }
                    return;
                }
                for (let i = 0; i < item.length; i++) {
                    if (item[i] == "all") {
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j] != "all") {
                                arr.splice(j, 1);
                            }
                        }
                    }
                }
            },
            //关闭新建商品弹窗
            hiddenAddGoodsDialog(val){
                if (val == 1) {
                    this.getListInfo();
                }
                this.goodsDialog = false;
            },
            // 获取弹窗的属性
            getAllAttrId(val,categorys) {
                this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
                this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            },
            //提交excel
            commitExcelData(form){
                if(form){
                    this.excelStatic.loading = true;
                    importGoodsExcel(form).then(res =>{
                        if(res.data.code === 0){
                            this.excelStatic.loading = false;
                            this.excelStatic.excelData = false;
                            this.excelStatic.excelDataErr = res.data.faithNum;
                            this.excelStatic.excelDataSucc = res.data.successNum;
                            this.excelStatic.failureId = res.data.failureId;
                            this.uploadFinish();
                        }else {
                            this.excelStatic.loading = false;
                            this.$message.error(res.data.message);
                        }
                    })
                }
            },
            //隐藏导入excel组件
            closeUploadComponent(){
                this.excelStatic.loading = false;
                this.excelStatic.excelData = true;
                this.excelStatic.excelDataErr = 0;
                this.excelStatic.excelDataSucc = 0;
                this.excelStatic.failureId = '';
                this.dialogVisibleExcel = false
            },
            uploadFinish() {
                this.getListInfo();
            },
            isShow() {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.goods.add") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.handleType = 'add';
                this.goodsDialog = true;
                // this.$router.push('/addGoodsStyle')
            },
            sel(val) {
                this.brandArr = val.brandArr;
                this.designerArr = val.designerArr;
                this.waveArr = val.waveArr;
                this.seasonArr = val.seasonArr;
                this.tagArr = val.tagArr;
                this.kindArr = val.kindArr;
                this.yearArr = val.yearArr;
            },
            sortTable(val) {
                var sort = val.order;
                if (sort == "ascending") {
                    sort = 0;
                } else {
                    sort = 1;
                }
                if (val.prop == "styleNo" || "styleName") {
                    this.searchForm(val.prop, sort);
                }
            },
            searchForm(prop, sort) {
                let params = {
                    ...this.richFilterParams,
                    facId: this.unitId,
                    token: "",
                    pageNo: this.currentPage1,
                    sortType: sort || "",
                    sortBy: "",
                    userId: this.userId,
                    modelName: 'GOODS_STYLE',
                };
                selectFacGoodsStyle(params).then(res => {
                    this.listInfo = res.data.goods;
                    this.table = res.data.count;
                });
            },
            imgList(row) {
                this.i = 0;
                this.picture = row.picture;
                this.centerDialogVisible = true;
                let params = {
                    facId: this.unitId,
                    goodsId: row.goodsId
                };
                getFacGoodsPictureList(params).then(res => {
                    this.imgLists = res.data.goodsPictureUrls;
                    this.picture = this.imgLists[this.i];
                });
            },
            leftImg() {
                if (this.i == 0) {
                    return false;
                } else {
                    this.imgLists[this.i--];
                }
            },
            rightImg() {
                if (this.i >= this.imgLists.length - 1) {
                    return false;
                } else {
                    this.imgLists[this.i++];
                }
            },
            goToInfo(row) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.goods.list") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push(
                    "/baseGoodsInfo?id=" + row.styleId + "&goodsId=" + row.goodsId
                );
            },
            getListInfo() {
                let params = {
                    facId: this.unitId,
                    // token: "21",
                    pageNo: 1,
                    userId: this.userId,
                    modelName: 'GOODS_STYLE',
                };
                this.loading = true
                selectFacGoodsStyle(params).then(res => {
                    this.loading = false

                    if (res.data.code == 0) {
                        this.listInfo = res.data.goods;
                        this.table = res.data.count;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                });
            },
            handleSizeChange(val) {
            },
            handleCurrentChange(val) {
                this.pageNo = val
                this.submit()
            },
            // 重置
            reset() {
                this.filterFormData.styleIds =[];
                this.isReset = true
            },
            // 查询
            submit(val) {
                this.isReset = false
                let params = {
                    ...val,
                    facId: this.unitId,
                    pageNo: this.pageNo,
                    styleIds:this.filterFormData.styleIds,
                    token: "",
                    sortType: 0,
                    userId: this.userId,
                    modelName: 'GOODS_STYLE',
                };
                selectFacGoodsStyle(params).then(res => {
                    this.listInfo = res.data.goods;
                    this.table = res.data.count;
                });
            },
            getFacUnitSettings() {
                let paramsCommonMsg = {
                    type: "all",
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    token: ""
                };
                getFacCommonAttrs(paramsCommonMsg).then(res => {
                    res.data.data.brand.unshift({value: "无", id: "NOTHING"});
                    res.data.data.designer.unshift({value: "无", id: "NOTHING"});
                    res.data.data.wave.unshift({value: "无", id: "NOTHING"});
                    res.data.data.season.unshift({value: "无", id: "NOTHING"});
                    res.data.data.tag.unshift({value: "无", id: "NOTHING"});
                    res.data.data.kind.unshift({value: "无", id: "NOTHING"});
                    res.data.data.year.unshift({value: "无", id: "NOTHING"});
                    for (let i = 0; i < res.data.data.brand.length; i++) {
                        res.data.data.brand[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.designer.length; i++) {
                        res.data.data.designer[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.wave.length; i++) {
                        res.data.data.wave[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.season.length; i++) {
                        res.data.data.season[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.tag.length; i++) {
                        res.data.data.tag[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.kind.length; i++) {
                        res.data.data.kind[i].isExpand = false;
                    }
                    for (let i = 0; i < res.data.data.year.length; i++) {
                        res.data.data.year[i].isExpand = false;
                    }
                    this.facInfo = res.data.data;
                    // this.$set(this.commonInfo, 'color', this.commonInfo['color'])
                    console.warn(this.commonInfo);
                });
            },
            brandAll() {
                this.brandArr = [];
            },
            designerAll() {
                this.designerArr = [];
            },
            waveAll() {
                this.waveArr = [];
            },
            kindAll() {
                this.kindArr = [];
            },
            yearAll() {
                this.yearArr = [];
            },
            seasonAll() {
                this.seasonArr = [];
            },
            tagAll() {
                this.tagArr = [];
            },
            selectGoods() {
                this.showType = !this.showType;
                this.getFacUnitSettings();
            }
        },
        created() {
            // this.getListInfo();
            this.getFacUnitSettings();
        },
        activated () { // 新建商品的时候要再重新获取一次
            this.searchForm();
        },
    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    a:link {
        color: $color-btn;
    }

    a:visited {
        color: $color-btn;
    }

    a:visited {
        color: $color-btn;
    }

    a:active {
        color: $color-btn;
    }

    .all {
        width: 100%;
        display: inline-block;
        height: 100%;
    }

    .goods_management {
        background: #fff;
        min-width: 1010px;
        padding-bottom: 5px;
        border-radius: 4px;
        position: relative;
        height: calc(100% + 43px);
        .select_goods {
            background-color: #fff;
            min-height: 84px;
            box-sizing: border-box;
            margin-bottom: 16px;
            color: #808080;
            padding: 24px 32px 24px 20px;
            .el-input {
                width: 280px !important;
            }
        }
        .addGoods {
            display: flex;
            justify-content: flex-start;
            margin-left: 82px;
            align-items: center;
            i {
                font-size: 12px;
                margin-right: 5px;
            }
        }
        .add_header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .style-content{
            display: flex;
            align-items: center;
        }
        .content {
            .style_no {
                margin-left: 12px;
            }
        }
        .page {
            margin: 20px 0;
            text-align: right;
            margin-right: 32px;
        }
        .filter-btn {
            width: 72px;
            height: 36px;
            color: #ffffff;
            font-size: 14px;
            border-radius: 2px;
            background-color: #54d1bc;
            margin-left: 58px;
            &:hover {
                background-color: #6cd9c7;
            }
        }
    }
    .good-config-must{
        border: 1px solid #e6eaf0;
        border-bottom: none;
        .good-config-must-item{
            border-bottom: 1px solid #e6eaf0;
            .item-title{
                border-bottom: 1px solid #e6eaf0;
                display: block;
                padding: 6px;
            }
            .item-container{
                padding: 6px;
            }
        }
    }
</style>
<style lang="scss">
    /*#goods_content tr th {*/
        /*height: 44px;*/
        /*font-weight: 700;*/
        /*color: #a2abb8;*/
        /*background-color: #fff;*/
        /*.cell {*/
            /*color: #a2abb8;*/
            /*background-color: #fff;*/
        /*}*/
    /*}*/
    .good-config-must{
        .item-container .el-checkbox{
            width: 30%;
            margin-bottom: 4px;
        }
        .el-checkbox + .el-checkbox{
            margin-left: 0;

        }
    }
    .el-table--fit td.gutter, .el-table--fit th.gutter{
        border-right-width:0
    }
    #goods_content tr:nth-child(n) {
        background-color: #f7f9fc;
    }

    #goods_content tr:nth-child(2n) {
        background-color: #fff;
    }

    /*#goods_content tbody tr {*/
        /*height: 72px;*/
        /*color: #909090;*/
    /*}*/

    #goods_content tbody tr img {
        height: 53px;
        width: 53px;
        border-radius: 4px;
    }

    #goods_content .list_name {
        font-size: 16px;
        font-weight: 700;
        color: #2c2c2c;
    }

    /*#goods_content tbody tr ul {*/
        /*text-align: center;*/
    /*}*/

    #goods_content tbody tr ul li {
        text-align: left;
        color: #a2abb8;
        font-size: 12px;
    }

    /*#goods_content .kuanhao {*/
        /*display: flex;*/
        /*justify-content: flex-start;*/
        /*align-items: center;*/
    /*}*/

    /*#goods_content .kuanhao :hover {*/
        /*text-decoration: underline;*/
        /*cursor: pointer;*/
    /*}*/

    /*#goods_content .kuanhao:nth-child(2) {*/
        /*margin-left: 10px;*/
        /*font-size: 16px;*/
        /*font-weight: 700;*/
        /*color: #2c2c2c;*/
    /*}*/

    /*#goods_content .cell {*/
        /*margin-left: 8px;*/
        /*color: #000;*/
        /*font-size: 14px;*/
        /*display: flex;*/
        /*align-items: center;*/
    /*}*/

    /*#goods_content thead {*/
        /*height: 44px;*/
    /*}*/

    .goods_management {
        .el-form-item{
            margin-bottom:12px !important;
        }
        /*.el-dialog {*/
            /*box-shadow: none;*/
        /*}*/
        /*.el-dialog--small {*/
            /*background-color: transparent;*/
            /*width: 100%;*/
            /*top: 5% !important;*/
        /*}*/
        /*.el-dialog__body {*/
            /*display: flex;*/
            /*align-items: center;*/
            /*justify-content: space-between;*/
        /*}*/
        /*.el-dialog__headerbtn .el-dialog__close {
            font-size: 24px;
            position: absolute;
            right: 60px;
            top: -18px;
            z-index: -1;
        }*/
        .imgs {
            height: 600px;
            display: flex;
            transition: all 1s;
            justify-content: center;
            align-items: center;
            user-select: none;
            width: 800px;
            img {
                max-width: 700px;
                max-height: 700px;
            }
        }
        .el-icon-arrow-left {
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
        .el-icon-arrow-right {
            font-size: 48px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
    }

    /*.goods_management .select_goods .el-input .el-input__inner {
        &::-webkit-input-placeholder {
            color: #2c2c2c;
        }
    }*/
</style>


