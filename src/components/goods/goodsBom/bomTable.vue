<template>
    <div class="content order-bom-table">
        废弃的bomTable，有哪里看到吗？
        <!-- 数据表格 -->
        <div class="isTable">
            <el-table
                    :data="tableData4"
                    border
                    stripe
                    :maxHeight="700"
                    style="width: 100%">
                <!--图片-->
                <el-table-column
                        label="图片"
                        width="76">
                    <template slot-scope="scope">
                        <div>
                            <img v-if="scope.row.commonMaterialsPictureList&&scope.row.commonMaterialsPictureList.length"
                                 @click="imgList(scope.row)"
                                 :src="scope.row.commonMaterialsPictureList[0].path?scope.row.commonMaterialsPictureList[0].path:scope.row.commonMaterialsPictureList[0]"
                                 alt="">
                        </div>
                    </template>
                </el-table-column>
                <!--物料分类-->
                <el-table-column
                        :prop="kindsName?kindsName:kindsNo"
                        label="物料分类"
                        width="120">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.kindsName?scope.row.kindsName:scope.row.kindsNo}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--物料款号-->
                <el-table-column
                        prop="materialsNo"
                        label="物料款号"
                        width="160">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.materialsNo}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--物料名称-->
                <el-table-column
                        prop="materialsName"
                        label="物料名称"
                        width="160">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.materialsName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--供应商-->
                <el-table-column
                        prop="supplierName"
                        label="供应商"
                        width="180">
                </el-table-column>


                <!--供应商款号-->
                <el-table-column
                        label="供应商款号"
                        width="90">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.supplierStyleNo">
                        <span v-else class="edit-text">{{scope.row.supplierStyleNo}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--供应商色号-->
                <el-table-column
                        label="供应商色号"
                        width="90">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.supplierColorNo">
                        <span v-else class="edit-text">{{scope.row.supplierColorNo}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>


                <!--颜色-->
                <el-table-column
                        prop="colorName"
                        label="颜色"
                        width="80">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.colorName?scope.row.colorName:scope.row.colorValue}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--单件用量-->
                <el-table-column
                        prop="singleDosage"
                        class-name="edit-bg"
                        label="* 单件用量"
                        width="95">
                    <template slot-scope="scope">
                        <div class="div_input_shu single-input">
                            <el-input v-model.trim="scope.row.singleDosage" type="number" step="0.01" placeholder="请输入" v-focus="singleFocus"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <!--损耗-->
                <el-table-column
                        prop="lossRate"
                        class-name="edit-bg"
                        label="* 损耗"
                        width="80">
                    <template slot-scope="scope">
                        <div class="div_input_shu loss">
                            <el-input v-model.trim="scope.row.lossRate" placeholder="0"></el-input>
                            <span>%</span>
                        </div>
                    </template>
                </el-table-column>
                <!--用于货品颜色-->
                <el-table-column
                        class-name="edit-bg"
                        label="* 用于货品颜色"
                        width="150">
                    <template slot-scope="scope">
                        <!-- 用于货品颜色下拉值 -->
                        <el-select
                                @change="colorM(scope.row.styleColorIdList,scope.$index,tableData4[scope.$index].styleColorIdList)"
                                v-model="scope.row.styleColorIdList" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in ColorList"
                                    :key="item.value"
                                    :label="item.name?item.name:item.value"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!--用于货品尺码-->
                <el-table-column
                        class-name="edit-bg"
                        label="* 用于货品尺码"
                        width="150">
                    <template slot-scope="scope">
                        <!-- 尺码下拉值 -->
                        <el-select
                                @change="colorM(scope.row.styleSizeIdList,scope.$index,tableData4[scope.$index].styleSizeIdList)"
                                v-model="scope.row.styleSizeIdList" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in SizeList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!--用于货品内长-->
                <el-table-column
                        class-name="edit-bg"
                        v-if="styleStandardIdList || source==='orderProduction'"
                        label="* 用于货品内长"
                        width="150">
                    <template slot-scope="scope">
                        <!-- 货品内长下拉值 -->
                        <el-select
                                @change="colorM(scope.row.styleStandardIdList,scope.$index,tableData4[scope.$index].styleStandardIdList)"
                                v-model="scope.row.styleStandardIdList" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in StandardList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <!--规格-->
                <el-table-column
                        prop="specificationsNo"
                        label="规格"
                        width="120">
                    <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.specificationsNo?scope.row.specificationsNo:scope.row.specificationsNo}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!--单位-->
                <el-table-column
                        prop="stockUnitName"
                        label="单位"
                        width="120">
                    <template slot-scope="scope">
                        <el-select
                                v-if="scope.row.editFlag"
                                class="edit-text"
                                v-model="scope.row.stockUnitId"
                                @change="changeUnit(scope.$index)"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in unitList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <span v-else class="edit-text">{{scope.row.stockUnitName || scope.row.unit}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--参考单价-->
                <el-table-column
                        label="参考单价"
                        width="70">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.planCost">
                        <span v-else class="edit-text">{{scope.row.planCost}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--备注-->
                <el-table-column
                        label="备注"
                        width="180">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.remark">
                        <span v-else class="edit-text">{{scope.row.remark}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>

                <!--材质-->
                <el-table-column
                        label="材质"
                        width="120">
                    <template slot-scope="scope">
                        <el-select
                                v-if="scope.row.editFlag"
                                class="edit-text"
                                v-model="scope.row.mt"
                                @change="changeMt(scope.$index)"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in scope.row.mtList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <span v-else class="edit-text">{{scope.row.mtName}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--种类-->
                <el-table-column
                        label="种类"
                        width="120">
                    <template slot-scope="scope">
                        <el-select
                                v-if="scope.row.editFlag"
                                class="edit-text"
                                v-model="scope.row.sp"
                                @change="changeSp(scope.$index)"
                                placeholder="请选择">
                            <el-option
                                    v-for="item in scope.row.spList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <span v-else class="edit-text">{{scope.row.spName}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--疵点-->
                <el-table-column
                        prop="defect"
                        label="疵点"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.defect">
                        <span v-else class="edit-text">{{scope.row.defect}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--成分-->
                <el-table-column
                        prop="component"
                        label="成分"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.component">
                        <span v-else class="edit-text">{{scope.row.component}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--大小-->
                <el-table-column
                        prop="size"
                        label="大小"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.size">
                        <span v-else class="edit-text">{{scope.row.size}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--形状-->
                <el-table-column
                        prop="shape"
                        label="形状"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.shape">
                        <span v-else class="edit-text">{{scope.row.shape}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--克重-->
                <el-table-column
                        prop="gweight"
                        label="克重"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.gweight">
                        <span v-else class="edit-text">{{scope.row.gweight}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--毛幅宽-->
                <el-table-column
                        prop="maoWidth"
                        label="毛幅宽"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.maoWidth">
                        <span v-else class="edit-text">{{scope.row.maoWidth}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--净幅宽-->
                <el-table-column
                        prop="netWidth"
                        label="净幅宽"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.netWidth">
                        <span v-else class="edit-text">{{scope.row.netWidth}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--洗水工艺-->
                <el-table-column
                        prop="washingProcess"
                        label="洗水工艺"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.washingProcess">
                        <span v-else class="edit-text">{{scope.row.washingProcess}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>
                <!--型号-->
                <el-table-column
                        prop="model"
                        label="型号"
                        width="80">
                    <template slot-scope="scope">
                        <input v-if="scope.row.editFlag"
                               class="edit-text"
                               placeholder="请输入"
                               v-model.trim="scope.row.model">
                        <span v-else class="edit-text">{{scope.row.model}}</span>
                        <span v-if="scope.row.editFlag" class="draw-bg"></span>
                    </template>
                </el-table-column>


                <!--操作-->
                <el-table-column
                        label="操作"
                        fixed="right"
                        width="170">
                    <template slot-scope="scope">
                        <!--<span class="bom-sort-btn sort-store-btn">排序</span>-->
                        <div v-if="!scope.row.editFlag">
                            <span class="operate-btn" @click="editRow(scope.$index)">编辑</span>
                            <span class="operate-line">|</span>
                            <span class="operate-btn" @click="handleChangeSupplier(scope.row, scope.$index)">换供应商</span>
                            <span class="operate-line">|</span>
                            <span class="operate-btn operate-btn-del" @click="deleteRow(scope.$index)">删除</span>
                        </div>
                        <div v-else>
                            <span class="operate-btn" @click="cancelEdit(scope.$index)">取消</span>
                            <span class="operate-line">|</span>
                            <span class="operate-btn operate-btn-save" @click="saveRow(scope.$index)">保存</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 悬浮添加组件 -->
        <add-bom ref="addBomRef"
                 @tableData4='tableData'
                 @select-all="handleSelectAll"
                 @newMaterialAdd="newMaterialAdd"
                 :parentTableData="tableData4"
                 :tableBomData="bomData">
        </add-bom>

        <!--
        **供应商选择弹窗备注**
        createSupplier: 显示添加供应商组件
        updateSupplierData: 更新bom表中供应商相关信息
        -->
        <supplier-change
                :visible.sync="changeSupplierShow"
                :materialRow="materialRow"
                @confirm="updateSupplierData">
        </supplier-change>

        <!--新增和编辑供应商，通用组件-->
        <transition name="right-move">
            <add
                    v-if="addSupplierShow"
                    type="add"
                    @update="getNewSup"
                    @hiddenWindow="cancelAdd"
                    @hideCover="cancelAdd">
            </add>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="addSupplierShow" @click="cancelAdd"></div>
        </transition>

        <!--//图片预览-->
        <imgPreview @dialogClose="centerDialogVisible=false" :centerDialogVisible="centerDialogVisible"
                    :imgLists="imgLists" :imgIndex="imgIndex"></imgPreview>
    </div>


</template>

<script>
    import {
        toAddBoomData, //新建提交数据接口
        searchSkuType, //sku下拉值接口
        updataBoomData, //编辑接口
        delectBomData, //删除接口
        listCommonMaterialsAttr, //单位下拉数据接口
        updateMissionBomMaterialsSku,  //工单bom表保存编辑后的物料
        updatePrdOrderBomMaterialsSku,  //订单bom表保存编辑后的物料
    } from "../../../api/api";
    import addBom from "./addBom.vue"; //悬浮添加组件
    import supplierChange from "@/components/goods/goodsBom/supplierChange.vue"; //换供应商组件
    import add from '@/components/material/materialSupplier/add.vue';
    export default {
        props: ["bomData", "styleId","source"],
        /**********************************
         source: 'orderProduction'一个值，生产订单标识
         ***********************************/
        components: {
            addBom, //悬浮添加组件
            add,
            supplierChange,
        },
        data() {
            return {
                centerDialogVisible: false, //判断显示图片预览显示与隐藏
                imgLists: [],
                imgIndex: 0,
                styleStandardIdList: false, //判断内长显示与隐藏
                inputBom: "", //BOM名称
                StandardList: [], //内长下拉值
                styleColorIdList: [], //颜色下拉所有值
                styleSizeIdList: [], //尺码下拉所有值
                isDeleteVisible: false, //确定删除的弹框显示和隐藏
                // tableData4: [], //表格列表数据
                ColorList: [], //颜色下拉数据
                SizeList: [], //尺码下拉数据
                id: "", //编辑保存BOM的id
                singleFocus: false,        //单件用量是否选中
                addSupplierShow: false,         //新建供应商组件
                changeSupplierShow: false,      //修改供应商弹窗组件
                unitList: [],                   //单位下拉数据
                mtList: [],                     //材质下拉数据
                spList: [],                     //种类下拉数据
                newSupplierArr:[],              //新建供应商成功后返回的供应商数据
                materialRow:{},                 //换供应商选中的某条物料数据
                editStorages:[],                //临时保存编辑的数据
                changeSupplierIndex:'',         //记录修改供应商信息数据所在的下标

            };
        },
        watch: {
            tableData4: {
                handler(val, oldVal) {
                    this.$emit("bomData", val);
                },
                deep: true
            }
        },
        computed: {
            tableData4() {
                return this.bomData;
            },
            styleId_id() {
                return this.styleId;
            },
            userId: function(){
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            }
        },
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
            //新增物料的数据，渲染到bom表中
            newMaterialAdd(val){
                const materialArr = val;
                materialArr.forEach(item => {
                    //初始化默认值
                    item.styleColorIdList = ['ALL'];    //颜色
                    item.styleSizeIdList = ['ALL'];     //尺码
                    item.styleStandardIdList = ['ALL']; //内长
                    item.singleFocus = false;          //光标选中
                    item.editFlag = false;             //编辑
                    this.tableData4.push(item);
                })
            },
            //单位选择
            changeUnit(index){
                let row = this.tableData4[index];
                const unitId = row.stockUnitId;
                this.unitList.forEach(item => {
                    if(item.id === unitId){
                        row.stockUnitName = item.name;
                    }
                });
            },
            //材质选择
            changeMt(index){
                let row = this.tableData4[index];
                const mt = row.mt;
                row.mtList.forEach(item => {
                    if(item.id === mt){
                        row.mtName = item.name;
                    }
                });
            },
            //种类选择
            changeSp(index){
                let row = this.tableData4[index];
                const sp = row.sp;
                row.spList.forEach(item => {
                    if(item.id === sp){
                        row.spName = item.name;
                    }
                });
            },
            //增加编辑标识符
            setEditFlag(){
                this.tableData4.forEach(item =>{
                    item.editFlag = false;
                })
            },
            //获取库存单位列表
            getStockUnitList() {
                let params = {
                    userId: this.userId,
                    type: 1
                };
                listCommonMaterialsAttr(params).then(res => {
                    if (res.data.length) {
                        this.unitList = res.data;
                    }
                });
            },
            //打开供应商侧滑栏
            showAdd(){
                this.addSupplierShow = true;
            },
            //关闭供应商侧滑栏
            cancelAdd() {
                this.addSupplierShow = false;
            },
            //获取新建的供应商
            getNewSup(val){
                this.newSupplierArr.push(val);
            },
            //更新供应商信息
            updateSupplierData(data){
                const row = this.tableData4[this.changeSupplierIndex];
                row.supplierId = data.supplierId;
                row.supplierName = data.supplierName;
                row.supplierStyleNo = data.supplierStyleNo;
                row.supplierColorNo = data.supplierColorNo;
                row.planCost = data.planCost;
                row.excludingTaxPrice = data.excludingTaxPrice;
            },

            // 图片预览
            imgList(row) {
                console.log(row.commonMaterialsPictureList);
                this.imgIndex = 0;
                this.imgLists = row.commonMaterialsPictureList || [{path:row.commonMaterialsSkuPicture}];
                this.centerDialogVisible = true;
            },
            // 判断选中全部颜色或者未选中全部颜色的方法,第一个值是你传的当前点击数据，第二个是索引，第三个是你表格原数据
            colorM(item, index, arr) {
                if (item.length > 1 && arr[0] == 'ALL') {
                    for (let i = 0; i < item.length; i++) {
                        if (item[i] == 'ALL') {
                            item.splice(i, 1)
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j] == "ALL") {
                                    arr.splice(j, 1)
                                }
                            }
                        }
                    }
                    return;
                }
                for (let i = 0; i < item.length; i++) {
                    if (item[i] == 'ALL') {
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j] != "ALL") {
                                arr.splice(j, 1)
                            }
                        }
                    }
                }

            },
            // 去重
            tableData(val, row) {
                const index = this.tableData4.findIndex(item => item.id === row.id);
                // 每次添加清除用于颜色，尺码，内长，单件用量
                if (index > -1) {
                    this.tableData4[index].styleColorIdList = []
                    this.tableData4[index].styleSizeIdList = []
                    if (this.styleStandardIdList == false) {
                        this.tableData4[index].styleStandardIdList = ["36fec3286377458bb445d0a287cd8e0e"]; //内长
                    } else {
                        this.tableData4[index].styleStandardIdList = []
                    }
                    this.tableData4[index].singleDosage = ''
                    this.tableData4.splice(index);
                }
                for (var i = 0; i < val.length; i++) {
                    val[i].lossRate = val[i].mlossRate

                    if (!val[i].styleColorIdList) {
                        val[i].styleColorIdList = ['ALL']; //颜色
                    }
                    if (!val[i].styleSizeIdList) {
                        val[i].styleSizeIdList = ['ALL']; //尺码
                    }

                    //不管是否有内长，默认都显示全部内长
                    val[i].styleStandardIdList = ['ALL'];

                    // if (this.styleStandardIdList == false) {
                    //     val[i].styleStandardIdList = ['ALL']; //内长
                    // }
                    // else {
                    //     if (!val[i].styleStandardIdList) {
                    //         for (let h = 0; h < this.StandardList.length; h++) {
                    //             val[i].styleStandardIdList = []
                    //             val[i].styleStandardIdList = this.StandardList[h].id; //内长
                    //         }
                    //     }
                    // }

                    var flag = true;
                    for (var j = 0; j < this.tableData4.length; j++) {
                        if (val[i].id == this.tableData4[j].id) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        this.tableData4.push(val[i]);
                        //每行增加光标选中标识
                        this.singleFocus = true;
                        //每行增加编辑标识
                        val[i].editFlag = false;
                    }
                }
            },
            // 全选传值
            handleSelectAll(val) {
                for (var i = 0; i < val.length; i++) {
                    val[i].lossRate = val[i].mlossRate
                    if (!val[i].styleColorIdList) {
                        val[i].styleColorIdList = ['ALL']; //颜色
                    }
                    if (!val[i].styleSizeIdList) {
                        val[i].styleSizeIdList = ['ALL']; //尺码
                    }

                    //不管是否有内长，默认都显示全部内长
                    val[i].styleStandardIdList = ['ALL'];

                    // if (this.styleStandardIdList == false) {
                    //     val[i].styleStandardIdList = ["ALL"]; //内长
                    // }
                    // else {
                    //     if (!val[i].styleStandardIdList) {
                    //         for (let h = 0; h < this.StandardList.length; h++) {
                    //             val[i].styleStandardIdList = []
                    //             val[i].styleStandardIdList = this.StandardList[h].id; //内长
                    //         }
                    //     }
                    // }

                    //每行增加编辑标识
                    val[i].editFlag = false;
                    this.tableData4.push(val[i]);
                }
            },
            // 编辑行
            editRow(index){
                let row = this.tableData4[index];
                const rowData = {...row};     //保存编辑前的数据，用于取消编辑
                this.editStorages.push(rowData);
                row.editFlag = true;
                this.tableData4.splice(index, 1 ,row);
            },
            // 取消编辑行
            cancelEdit(index){
                let cancelRow = this.tableData4[index];
                this.editStorages.forEach((item, i) =>{
                    if(item.id === cancelRow.id){
                        this.tableData4.splice(index, 1 ,item);
                        //数据还原后，删除此条数据
                        this.editStorages.splice(i, 1);
                    }
                });
            },
            // 删除行
            deleteRow(index) {
                this.$refs['addBomRef'].toggleSelectionFn(this.tableData4[index]);
                this.tableData4.splice(index, 1);
            },
            // 保存行
            saveRow(index) {
                //订单
                if(this.source === 'orderProduction'){
                    let row = this.tableData4[index];
                    let params = {...row};
                    params.userId = this.userId;
                    params.facPrdOrderGoodsId = this.bomData ? this.bomData.facPrdOrderGoodsId : '';  //新建的时候bom facPrdOrderGoodsId为空
                    params.materialsSkuId = params.materialsSkuId;
                    updatePrdOrderBomMaterialsSku(params).then(res => {
                        if (res.data.code === 0) {
                            let item = {...row};
                            item.editFlag = false;
                            this.tableData4.splice(index, 1 ,item);
                            this.$message.success('保存成功');
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    });
                }
                //工单
                else{
                    let row = this.tableData4[index];
                    let params = {...row};
                    params.userId = this.userId;
                    params.materialsSkuId = params.materialsSkuId;
                    updateMissionBomMaterialsSku(params).then(res => {
                        if (res.data.code === 0) {
                            let item = {...row};
                            item.editFlag = false;
                            this.tableData4.splice(index, 1 ,item);
                            this.$message.success('保存成功');
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    });
                }
            },

            //展开换供应商弹窗
            handleChangeSupplier(row, index){
                this.materialRow = row;
                this.changeSupplierIndex = index;
                this.changeSupplierShow = true;
            },
            // 获取款号对应的下拉数据
            searchSkuType() {
                let paramsCommonMsg = {
                    userId: JSON.parse(sessionStorage.getItem("user_login")).userId, //工厂id
                    styleId: this.styleId_id
                };

                searchSkuType(paramsCommonMsg).then(res => {
                    var objColor = {
                        id: "ALL",
                        name: "全部颜色",
                        value: ""
                    };
                    var objSize = {
                        id: "ALL",
                        name: "全部尺码",
                        value: ""
                    };
                    var objStandard = {
                        id: "ALL",
                        name: "全部内长",
                        value: ""
                    };
                    if (
                        res.data.commonSkuAttrStandardList[0].name == "无" &&
                        res.data.commonSkuAttrStandardList.length <= 1
                    ) {
                        this.styleStandardIdList = false;
                    } else {
                        res.data.commonSkuAttrStandardList.unshift(objStandard);
                        this.StandardList = res.data.commonSkuAttrStandardList; //内长下拉数据
                        this.styleStandardIdList = true;
                    }
                    // 控制色名为空的情况
                    for (let i = 0; i < res.data.commonSkuAttrColorList.length; i++) {
                        if (res.data.commonSkuAttrColorList[i].name) {
                            res.data.commonSkuAttrColorList[i].name = res.data.commonSkuAttrColorList[i].value + '-' + res.data.commonSkuAttrColorList[i].name
                        }
                    }
                    res.data.commonSkuAttrColorList.unshift(objColor);
                    res.data.commonSkuAttrSizeList.unshift(objSize);
                    console.log(res.data.commonSkuAttrColorList);
                    this.ColorList = res.data.commonSkuAttrColorList; //颜色下拉数据
                    this.SizeList = res.data.commonSkuAttrSizeList; //尺码下拉数据
                });
            }
        },
        created() {
            //获取单位下拉列表
            this.getStockUnitList();
            //给tableData4每行都增加一个编辑标识，编辑操作会用到
            this.setEditFlag();
            this.searchSkuType();
        },

    };
</script>

<style lang="scss" scoped>
    @import "~scss_vars";

    .content {
        padding: 20px 32px 0;
        .el-input {
            width: 250px;
            height: 36px;
            border-radius: 2px;
            background-color: #ffffff;
            // border: solid 1px #dce0e6;
        }
        .el-input__inner {
            border: none;
        }
        .div_input_shu {
            &.single-input{
                .el-input{
                    width: 75px;
                }
            }
            .el-input {
                width: 83px;
                .el-input__inner {
                    border: none;
                }
            }
        }
        .isTable{
            .operate-btn{
                padding:0 5px;
                color: #808080;
                cursor: pointer;
                &:hover{
                    color:#3B3B3B;
                }
            }
            .operate-line{
                font-size: 16px;
                color:rgb(223, 228, 236);
            }
            .operate-btn-del{
                color: #FA4150;
                &:hover{
                    color:#FB6773;
                }
            }
            .operate-btn-save{
                color: #FF7F14;
                &:hover{
                    color: #FF9843;
                }
            }
        }
    }

    .div_input {
        padding-left: 32px;
        padding-right: 32px;
        div {
            width: 100%;
        }
    }

    .delete-btn {
        margin-left: 32px;
        color: #fa4150;
        background-color: #fff;
        margin-top: 16px;
    }

</style>

<style lang="scss">
    .order-bom-table{
        .isTable {
            .el-input__inner {
                border: none;
                background-color: #FFF9ED;
            }
            .div_input .el-input__inner {
                border: 1px solid rgb(191, 200, 217);
            }
            .el-table__body tr.hover-row > td .el-input__inner {
                background-color: rgb(238, 240, 246);
            }
            .single{
                .el-input {
                    width: 100%;
                }
            }
            .loss {
                .el-input {
                    width: 45px;
                }
            }
            .edit-bg{
                background-color: #FFF9ED !important;
            }
            .edit-text{
                width: 100%;
                position: relative;
                z-index: 1;
            }
            .draw-bg{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background-color: #FFF9ED;
            }
            input{
                background-color: #FFF9ED !important;
            }

        }
        .el-input__inner{
            font-size: 12px;
        }
        .el-input{
            &.bom-name-input{
                width: 200px;
                height: 32px;
            }
        }
        .el-table{
            td{
                height: auto;
                position: relative;
            }
            th{
                height: auto;
            }
            font-size: 12px;
            .cell{
                padding-left: 10px;
                padding-right: 10px;
                img{
                    width: 56px;
                    height: 56px;
                    vertical-align: bottom;
                    margin: 4px 0;
                }
            }
            th > div{
                padding-left: 10px;
                padding-right: 10px;
            }
        }
        .page_title--head{
            font-size: 16px;
            margin-top: 15px;
        }
        .el-tag{
            background-color: #FFF9ED;
        }
    }
</style>

