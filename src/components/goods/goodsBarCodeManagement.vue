<template>
  <div class="bar-code-management">
    <page-title style="margin-bottom:16px;height:48px;line-height:48px;" title="货品条码管理">
        <!-- <nf-button @click="$router.push('/goodsMangement')">返回上级</nf-button> -->
    </page-title>
    <div class="bar-select">
        <el-form class="custom-filter-form"  label-width="100px">
            <el-row>
                <el-col :span="8" style="margin-left:-50px;">
                    <el-form-item label="创建时间">
                        <el-date-picker range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="createDate" v-model="dateArea" type="daterange" align="right" placeholder="选择日期范围" :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="条形码">
                        <el-select v-model="barCode" placeholder="请选择">
                            <el-option
                                    v-for="item in lineCodeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="国标码">
                        <el-select v-model="internationalCode" placeholder="请选择">
                            <el-option
                                    v-for="item in internationalCodeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8"  style="margin-left:-50px;">
                    <el-form-item label="商品属性">
                        <goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset"></goods-attr-dialog>
                    </el-form-item>
                </el-col>
                <div class="btn-group">
                    <el-button class="btn btn-submit" @click="goodsBarcodes(0,1)">筛选</el-button>
                </div>
            </el-row>

        </el-form>
        <!--<div class="select-list">-->
            <!--<div class="select-type" style="justify-content:flex-end;display:flex;align-items:center;">-->
                <!--<span @click="toggleSelection([tableData[1]])">国际码</span>-->
            <!--</div>-->
        <!--</div>-->
        <!--<div class="bar-select-attr">-->
            <!--<div>-->
                <!--<span @click="selcetAttr" style="color:#808080;cursor:pointer;" v-if="showType">展开货品属性筛选<i style="margin-left:4px;" class="el-icon-caret-bottom"></i></span>-->
                <!--<span @click="selcetAttr" style="color:#808080;cursor:pointer;" v-if="!showType">收起货品属性筛选<i style="margin-left:4px;" class="el-icon-caret-top"></i></span>-->
            <!--</div>-->
            <!--<div>-->
                <!--<button @click="goodsBarcodes(0,1)" class="filter-btn">筛选</button>-->
            <!--</div>-->
        <!--</div>-->
        <div>
            <select-specific :facInfo='facInfo' @orderType='sel' :showType='showType'></select-specific>
        </div>
    </div>
    <div class="search-select">
        <div class="search-select-left">
            <div style="position:relative;">
                 <el-input placeholder="输入款号/条形码/国标码搜索" icon="search" @input="searchListShow" v-model.trim="codeSearch" :on-icon-click="handleIconClick"></el-input>
                 <ul class="search-ul" v-show="codeSearchShow">
                     <li v-for="(item,index) in searchList" @click="searchType(index)" :key="index" class="search-list">{{item.value}}</li>
                 </ul>
            </div>
            <template>
                <el-select v-model="barCodeSort" placeholder="请选择" @change="sortSearch(barCodeSort)">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </template>
        </div>
        <div  v-show="createCode&&editCodeShow&&loadCode" class="search-select-left" style="justify-content:flex-end;">
            <nf-button @click="createCodeFun" style="margin-right:12px;background-color:#1ca1ff;color:#fff;"><icon style="width:14px;height:14px;margin-right:4px;" type="icon-batchcode"></icon>批量生成条形码</nf-button>
            <nf-button @click="editCodeShow=false" style="width:98px;margin-right:12px;" type="warning"><icon style="width:14px;height:14px;margin-right:4px;" type="icon-goodscode-edit"></icon>编辑</nf-button>
            <nf-button @click="loadExcel" style="width:98px;background-color:#23c811;color:#fff;"><icon style="width:16px;height:16px;margin-right:4px;" type="icon-download"></icon>下载</nf-button>
        </div>
        <!-- 编辑的确定按钮 -->
        <div v-show="!editCodeShow" class="search-select-left" style="justify-content:flex-end;">
            <nf-button @click="editCodeFun" style="width:98px;margin-right:12px;">取消</nf-button>
            <nf-button @click="sureEdit('')" style="width:98px;" type="warning">确定</nf-button>
        </div>
        <!-- 下载的确定按钮 -->
        <div v-show="!loadCode" class="search-select-left" style="justify-content:flex-end;">
            <nf-button @click="loadCodeFun" style="width:98px;margin-right:12px;">取消</nf-button>
            <nf-button @click="generateExcel('')" style="width:98px;" type="warning">确定</nf-button>
        </div>
        <!-- 批量的确定按钮 -->
        <div v-show="!createCode" class="search-select-left" style="justify-content:flex-end;">
            <nf-button @click="createCode=true" style="width:98px;margin-right:12px;">取消</nf-button>
            <nf-button style="width:98px;" @click="sureCreateCode" type="warning">确定</nf-button>
        </div>
    </div>
    <div class="bar-table">
        <template>
            <el-table @select-all="selectAll" reserve-selection="true" @select="handleSelectionChange" ref="multipleTable" :data="tableData" border style="width: 100%;margin-bottom:24px;">
                <el-table-column v-if="!createCode || !loadCode" type="selection" align="center" style="margin-left:16px;" width="55">
                    <!-- <template slot-scope="scope">
                        <el-checkbox :checked='true'>
						</el-checkbox>
                    </template> -->
                </el-table-column>
                <el-table-column  prop="styleNo" label="货品款号" width="180">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.styleNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="颜色" width="180">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="内长">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.standardValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="尺码">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.sizeValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="条形码">
                    <template slot-scope="scope">
                        <div v-show="editCodeShow" :class="{'color-gray':!editCodeShow}" style="padding-left:16px;height:40px;width:200px;line-height:40px;" v-if="!scope.row.codeEdit" @click="editlineCode(scope.row)">{{scope.row.barcode}}</div>
                        <div v-show="!editCodeShow" :class="{'color-gray':!editCodeShow}" style="padding-left:16px;height:40px;width:200px;line-height:40px;" v-if="!scope.row.codeEdit" @click="editlineCode(scope.row)">{{scope.row.barcode?scope.row.barcode:'请输入'}}</div>
                        <el-input @input="editLine(scope.row)" @blur="isExist(scope.row)" v-focus="scope.row.codeEdit" v-if="scope.row.codeEdit" v-model="scope.row.barcode"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="国标码">
                    <template slot-scope="scope">
                        <div v-show="editCodeShow" :class="{'color-gray':!editCodeShow}" style="padding-left:16px;height:40px;width:200px;line-height:40px;" v-if="!scope.row.gjcodeEdit" @click="editgjCode(scope.row)">{{scope.row.gbcode}}</div>
                        <div v-show="!editCodeShow" :class="{'color-gray':!editCodeShow}" style="padding-left:16px;height:40px;width:200px;line-height:40px;" v-if="!scope.row.gjcodeEdit" @click="editgjCode(scope.row)">{{scope.row.gbcode?scope.row.gbcode:'请输入'}}</div>
                        <el-input @input="editInter(scope.row)" v-focus="scope.row.gjcodeEdit" v-if="scope.row.gjcodeEdit" v-model="scope.row.gbcode"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <div class="page">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="count">
            </el-pagination>
        </div>
    </div>
    <div>
        <el-dialog @close="code" :show-close="false" :visible.sync="centerDialogVisible" width="80%" size="large" center>
        <span slot="title" style="display:flex;justify-content:center;font-size:20px;border-bottom:1px solid #e6eaf0;padding-bottom:16px;">批量生成条形码</span>
        <div class="container-createcode">
            <div style="padding-bottom:12px;">共选择{{createCodeList.goodsNum}}款货品，{{createCodeList.skuNum}}个SKU，成功生成<span style="color:#23c811;">{{createCodeList.successNum}}</span>个条码，失败 <span style="color:#fa4150;">{{createCodeList.failNum}}</span> 个</div>
        <template>
            <el-table :data="createCodeList.barcodes" border max-height="420" style="overflow-y:auto;overflow-x:hidden;width: 100%;margin-bottom:24px;">
                <el-table-column  prop="styleNo" label="货品款号" width="170">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.styleNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="颜色" width="170">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="内长"  width="170">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.standardValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="尺码"  width="170">
                    <template slot-scope="scope">
                        <div style="padding-left:16px;height:100%;width:100%;">{{scope.row.sizeValue}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="条形码">
                    <template slot-scope="scope">
                        <!-- <div style="padding-left:16px;height:40px;width:300px;line-height:40px;" v-show="!scope.row.codeEdit" @click="editCodeDi(scope.row)">{{scope.row.barcode}}</div> -->
                        <el-input class="input" @blur="isExist(scope.row)" v-focus="scope.row.codeEdit" v-model="scope.row.barcode"></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        </div>
        <span slot="footer" style="display:flex;justify-content:space-between;">
            <div><nf-button @click="centerDialogVisible = false" style="width:130px;margin-right:12px;">取消</nf-button></div>
            <div>
                <nf-button  @click="sureSaveDownload" style="width:130px;margin-right:12px;background-color:#fff;color:#ffa914;">确定并下载</nf-button>
                <nf-button style="width:130px;background-color:#ffa914;color:#fff;" @click="sureSave" type="warning">确定</nf-button>
            </div>
        </span>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { getFacUnitSettings,goodsBarcodes,updateBarcodes,isExist,isExistBarcodes,generateExcel } from "../../api/api";
import SelectSpecific from './child/selectSpecific'
export default {
  data() {
    return {
        pickerOptions2: {
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
        multipleSelection: [],
        dateArea:'',
        options: [
            { value: '1',label: '货品新建时间从近到远'},
            { value: '2',label: '货品新建时间从远到近'},
            { value: '3',label: '货品款号正序'},
            { value: '4',label: '货品款号倒序'}
        ],
        lineCodeList: [
            { value: '0',label: '全部'},
            { value: '1',label: '有条形码'},
            { value: '2',label: '无条形码'}
        ],
        internationalCodeList: [
            { value: '0',label: '全部'},
            { value: '1',label: '有国际码'},
            { value: '2',label: '无国际码'}
        ],
        searchList:[
            {value:'搜索款号'},
            {value:'搜索条形码'},
            {value:'搜索国标码'}],
        barCode:'0',
        internationalCode:'0',
        showType:true,
        facInfo:{},
        placeorderStartAt:'',
        placeorderEndAt:'',
        codeSearch:'',
        tableData: [],
        currentPage:1,
        barCodeSort:'1',
        count:'',
        editCodeShow:true,
        brandArr:['ALL'],
        designerArr:['ALL'],
        waveArr:['ALL'],
        kindArr:['ALL'],
        yearArr:['ALL'],
        tagArr:['ALL'],
        seasonArr:['ALL'],
        createCode:true,
        loadCode:true,
        searchIndex:1,
        orderBy:1,
        codeSearchShow:false,
        centerDialogVisible:false,
        createCodeList:[],
        fileData:'',
        arrSelection:[],
        allSelect:'',
        selectChecked:[],
        error:0,
        errorMsg:0,
        tableInfo:[],
        userId: '',
        filterFormData: {
            categorys: [],
            attrIds: []
        }
    };
  },
    components: {
        SelectSpecific:SelectSpecific
    },
    //自动获取焦点，对input进行DOM操作，实际上；
    directives: {
        focus: {
            inserted: (el, {value}) => {
                if (value) {
                    //由于是饿了么的el-input，需要拿到父元素下面的input
                    el.firstElementChild.focus();
                }
            }
        }
    },
    methods: {
        // 获取弹窗的属性
        getAllAttrId(val,categorys) {
            this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
        },
        editCodeDi(val) {
            this.tableData.forEach(item => {
                this.$set(item, 'codeEdit', false); // color num input show/hide
            })
            val.codeEdit = true;
        },
        loadExcel() {
            this.allSelect = 1;
            this.generateExcel('');
        },
        code(val) {
            if(this.error==1) {

            }else {
                this.clearSelection();
            }
        },
        editLine(val) {
            this.errorMsg = 0;
            if((/^[A-Za-z0-9]{1,24}$/).test(val.barcode)) {
            }else {
                val.barcode ='';
            }
        },
        editInter(val) {
            if((/^[A-Za-z0-9\-]{1,24}$/).test(val.gbcode)) {
            }else {
                val.gbcode ='';
            }
        },
        handleSizeChange(val) {
            console.log(val);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.goodsBarcodes(0,1);
        },
        //全选的方法
        selectAll(val) {
            if(this.allSelect == '') {
                this.allSelect = 1;
            }else {
                this.allSelect = 0;
            }
        },
        setArrSelectAllIds(val) {
            for (let item of val) {
                !this.arrSelection.includes(item.barcodeId) && this.arrSelection.push(item.barcodeId);
            }
        },
        toggleSelection(rows) {
            rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
        },
        clearSelection() {
            this.$refs.multipleTable.clearSelection();
            this.allSelect = 0;
            this.arrSelection = [];
        },
        //勾选触发
        handleSelectionChange(val,row) {
            if(this.selectChecked.length===0) {
                this.selectChecked.push(row);
            }else {
                const l = this.selectChecked.length;
                for(let i=0;i<l;i++) {
                    if(this.selectChecked[i].barcodeId!==row.barcodeId) {
                        this.selectChecked.push(row);
                        this.selectChecked = [...new Set(this.selectChecked)]
                    }else{
                        this.selectChecked.splice(i,1);
                        break;
                    }
                }
                this.selectChecked = [...new Set(this.selectChecked)]
            }
            this.arrSelection.push(row.barcodeId);
        },
        pageGo(pNo) {
            //总的条数
            const num = this.count;
            //总页数
            let  totalPage = 0;
            //每页显示的行数
            const pageSize = 20;
            //总共分几页
            if(num/pageSize > parseInt(num/pageSize)){
                totalPage=parseInt(num/pageSize)+1;
            }else{
                totalPage=parseInt(num/pageSize);
            }
            const currentPage = pNo;
            let startRow = (currentPage - 1) * pageSize+1;//开始显示的行  31
            let endRow = currentPage * pageSize;//结束显示的行   40
            endRow = (endRow > num)? num : endRow;    //40

        },
        createDate(val) {
            val.split('至');
            this.placeorderStartAt = val.split('至')[0];
            this.placeorderEndAt = val.split('至')[1];
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
        selcetAttr() {
            this.showType = !this.showType;
        },
        searchListShow() {
            if(this.codeSearch!='') {
                this.codeSearchShow = true;
            }else {
                this.codeSearchShow = false;
                this.goodsBarcodes(0,1);
            }
        },
        sureSave() {
            this.sureEdit(this.createCodeList.barcodes);
            if(this.error===1) {
                this.centerDialogVisible = true;
                return;
            }else {
                this.clearSelection();
                this.createCode = true;
                this.centerDialogVisible = false;
            }
        },
        async sureSaveDownload() {
            await this.sureEdit(this.createCodeList.barcodes);
            if(this.error===1) {
                this.centerDialogVisible = true;
                return;
            }else {
                this.generateExcel(this.createCodeList.barcodes);
                this.clearSelection();
                this.createCode = true;
                this.centerDialogVisible = false;
            }
        },
        //下载条形码
        generateExcel(data) {

            // goodsFilter: [
            //     { keyType: 2, valueType: this.designerArr }, //设计师
            //     { keyType: 3, valueType: this.waveArr }, //波段
            //     { keyType: 4, valueType: this.kindArr }, //分类
            //     { keyType: 5, valueType: this.seasonArr }, //季节
            //     { keyType: 6, valueType: this.yearArr }, //年份
            //     { keyType: 7, valueType: this.tagArr }, //标签
            //     { keyType: 8, valueType: this.brandArr } //品牌
            // ],
            let params = {
                userId: this.userId,
                barcodes:data||this.selectChecked,
                allSelect:this.allSelect,
                categorys: this.filterFormData.categorys,
                attrIds: this.filterFormData.attrIds,
                keyword2:this.codeSearch || '',
                search:this.searchIndex,
                barcode:this.barCode-0 || 0,
                gbcode:this.internationalCode || 0,
                orderBy:this.orderBy,
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.userId,
                placeorderEndAt:this.placeorderEndAt,
                placeorderStartAt:this.placeorderStartAt,
                pageNo:this.currentPage
            }
            generateExcel(params).then(
                res => {
                    this.fileData =res.data;
                    var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','生成条码文件.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    this.clearSelection();
                }
            )
        },
        handleIconClick() {
            console.log(this.codeSearch);
        },
        editCodeFun() {
            this.editCodeShow =true;
            this.tableData.forEach((item,index) => {
                this.$set(item, 'codeEdit', false);
                this.$set(item, 'barcode', this.tableInfo[index].barcode);
                this.$set(item, 'gbcode', this.tableInfo[index].gbcode);
            });
            this.tableData.forEach(item => {
                this.$set(item, 'gjcodeEdit', false); // color num input show/hide
            })
            this.clearSelection();
        },
        createCodeFun() {
            this.codeSearchShow = '';
            this.selectChecked = [];
            this.createCode =false;
        },
        loadCodeFun() {
            this.loadCode = true;
            this.selectChecked = [];
            this.clearSelection();
        },
        editlineCode(val) {
            this.tableData.forEach(item => {
                this.$set(item, 'codeEdit', false); // color num input show/hide
            })
            if(!this.editCodeShow) {
                val.codeEdit = true;
            }
        },
        editgjCode(val) {
            this.tableData.forEach(item => {
                this.$set(item, 'gjcodeEdit', false); // color num input show/hide
            })
            if(!this.editCodeShow) {
                val.gjcodeEdit = true;
            }
        },
        async sureEdit(data) {
            if(this.errorMsg == 1) {
                return;
            }
            let params ={
                barcodes:data || this.tableData,
                userId: this.userId
            }
            await updateBarcodes(params).then(
                res => {
                    if(res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        this.error = 1;
                        return;
                    }else {
                        this.error = 0;
                        this.centerDialogVisible = false;
                        this.$message.success(res.data.msg);
                        this.goodsBarcodes(0,1);
                        this.editCodeShow = true;
                        this.tableData.forEach(item => {
                            this.$set(item, 'codeEdit', false); // color num input show/hide
                            this.$set(item, 'gjcodeEdit', false); // color num input show/hide
                        })
                    }
                }
            )
        },
        //确定批量生成
        sureCreateCode() {

            // goodsFilter: [
            //     { keyType: 2, valueType: this.designerArr }, //设计师
            //     { keyType: 3, valueType: this.waveArr }, //波段
            //     { keyType: 4, valueType: this.kindArr }, //分类
            //     { keyType: 5, valueType: this.seasonArr }, //季节
            //     { keyType: 6, valueType: this.yearArr }, //年份
            //     { keyType: 7, valueType: this.tagArr }, //标签
            //     { keyType: 8, valueType: this.brandArr } //品牌
            // ],
            let params = {
                userId: this.userId,
                barcodes:this.selectChecked,
                allSelect:this.allSelect,
                categorys: this.filterFormData.categorys,
                attrIds: this.filterFormData.attrIds,
                keyword2:this.codeSearch || '',
                search:this.searchIndex,
                barcode:this.barCode-0 || 0,
                gbcode:this.internationalCode || 0,
                orderBy:this.orderBy,
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.userId,
                placeorderEndAt:this.placeorderEndAt,
                placeorderStartAt:this.placeorderStartAt,
                pageNo:this.currentPage
            }
            isExistBarcodes(params).then(
                res => {
                    if(res.data.code == 0 ) {
                        this.centerDialogVisible = true;
                        this.createCodeList = res.data.data;
                        // this.clearSelection();
                    }
                }
            )
        },
        //获取条码的列表
        goodsBarcodes(index=0,orderBy=1) {
            // goodsFilter: [
            //     { keyType: 2, valueType: this.designerArr }, //设计师
            //     { keyType: 3, valueType: this.waveArr }, //波段
            //     { keyType: 4, valueType: this.kindArr }, //分类
            //     { keyType: 5, valueType: this.seasonArr }, //季节
            //     { keyType: 6, valueType: this.yearArr }, //年份
            //     { keyType: 7, valueType: this.tagArr }, //标签
            //     { keyType: 8, valueType: this.brandArr } //品牌
            // ],
            let params = {
                categorys: this.filterFormData.categorys,
                attrIds: this.filterFormData.attrIds,
                keyword2:this.codeSearch || '',
                search:this.searchIndex,
                barcode:this.barCode-0 || 0,
                gbcode:this.internationalCode || 0,
                orderBy:this.orderBy,
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.userId,
                placeorderEndAt:this.placeorderEndAt,
                placeorderStartAt:this.placeorderStartAt,
                pageNo:this.currentPage
            };
            goodsBarcodes(params).then(
              res  => {
                this.tableData = res.data.data.reAllGoodsSkus;
                this.tableInfo = JSON.parse(JSON.stringify(this.tableData));
                this.count = res.data.data.count;
                this.$nextTick(() => {
                    const arr = [];
                    this.allSelect && this.setArrSelectAllIds(this.tableData);
                    this.arrSelection.forEach(barcodeId => {
                        const index = this.tableData.findIndex(item => barcodeId === item.barcodeId);
                        if (index > -1) {
                            arr.push(this.tableData[index])
                        }
                    })
                    this.toggleSelection(arr);
                })
                }
            )
        },
        //选择想要搜索的类型
        searchType(index) {
            this.codeSearchShow = false;
            this.searchIndex = index;
            this.goodsBarcodes(index,this.orderBy);
        },
        //判断条码是否存在
        isExist (code) {
            let params = {
                barcode:code.barcode,
                userId: this.userId,
                token:'',
                barcodeId:code.barcodeId,
            };
            isExist(params).then(
                res => {
                    if(res.data.code != 0) {
                        this.$message.error(res.data.msg);
                        this.errorMsg = 1;
                    }
                }
            )
        },
        //搜索
        sortSearch(orderBy) {
            this.orderBy = orderBy;
            this.goodsBarcodes(this.searchIndex,orderBy);
        },
        //获取本厂的属性规格
        getFacUnitSettings() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                token: "",
                type: "all"
            };
            getFacUnitSettings(params).then(res => {
                res.data.data.brand.unshift({ value: "无", id: "NOTHING" });
                res.data.data.designer.unshift({ value: "无", id: "NOTHING" });
                res.data.data.wave.unshift({ value: "无", id: "NOTHING" });
                res.data.data.season.unshift({ value: "无", id: "NOTHING" });
                res.data.data.tag.unshift({ value: "无", id: "NOTHING" });
                res.data.data.kind.unshift({ value: "无", id: "NOTHING" });
                res.data.data.year.unshift({ value: "无", id: "NOTHING" });
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
            });
        },
    },
    mounted() {
        this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;

        this.goodsBarcodes(0,1);
        this.getFacUnitSettings();
    }
};
</script>
<style lang='scss' scoped>
    .color-gray {
        color:#ccc;
    }
    .bar-code-management{
        .bar-select{
            min-height:136px;
            background-color: #fff;
            margin-bottom:16px;
            box-sizing: border-box;
            padding: 24px 32px;
            margin-bottom:16px;
        }
        .select-list{
            display:flex;
            justify-content: flex-start;
            align-items: center;
        }
        .bar-select-attr{
            /*width:33.33%;*/
            display:flex;
            justify-content: flex-start;
            align-items: center;
            margin-top:16px;
        }
        .search-select {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom:16px;
            .search-select-left {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width:500px;
                .el-input {
                    width:240px;
                    margin-right:24px;
                }
                .search-ul {
                    position:absolute;
                    z-Index:2;
                    height:120px;
                    width:240px;
                    background-color:#fff;
                    border: solid 1px #dce0e6;
                    box-sizing: border-box;
                }
                .search-list {
                    width:240px;
                    height:33.33%;
                    display:flex;
                    justify-content:flex-start;
                    align-items:center;
                    padding-left:12px;
                    box-sizing: border-box;
                    &:hover {
                        background: #ebeff5;
                        cursor: pointer;
                    }
                }
            }
        }
        .filter-btn {
            width: 72px;
            height: 36px;
            color: #ffffff;
            font-size: 14px;
            border-radius: 2px;
            background-color: #54d1bc;
            margin-left:58px;
            &:hover {
                background-color: #6cd9c7
            }
        }
        .select-type{
            span {
                margin-right:10px;
            }
            width:33.333%;
            margin-right:46px;
            &:last-child {
                margin-right: 0;
            }
        }
        .bar-table {
            background-color: #fff;
            padding-bottom:12px;
        }
        .page {
            margin: 20px 0;
            text-align: right;
            margin-right: 32px;
        }
    }
</style>
<style lang="scss">
.bar-code-management {
    .select-type {
        .el-input__inner {
            border-radius:2px;
        }
        .el-date-editor.el-input {
            width: 79%;
        }
        .el-select {
            width: 83%;
        }
    }
    .search-select {
        .el-input__inner {
            width:240px;
            border-radius:2px;
        }
    }
    thead tr th {
        background-color: #fff;
        height:36px;
    }
    thead tr th .cell{
        background-color: #fff;
        color:#a2abb8;
    }
    .container-createcode {
        // max-height:500px;
        thead tr th {
            background-color: #f5f7fa;
            height:36px;
        }
        thead tr th .cell{
            background-color: #f5f7fa;
            color:#a2abb8;
        }
    }
    .el-table td {
        background-color: #fff !important;
        padding:0;
    }
    .el-table td .cell{
        padding:0;
    }
    .input .el-input__inner {
        border:none;
    }
    .bar-table .el-input__inner {
        padding:0;
        border:1px solid #ffa914;
        border-radius:0;
        height:39px;
        padding-left:14px;
        box-sizing:border-box;
    }
    .el-dialog--large {
        width:70%;
    }
}
</style>



