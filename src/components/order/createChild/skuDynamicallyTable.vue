<template>
    <div class="sku-dynamically-table" v-show="visible">
        <template>
            <el-table
                    :class = "[editTable ? 'edit-table' : '', 'sku-table']"
                    :row-class-name="tableRowClassName"
                    :data="skuTableData"
                    border
                    max-height="440">
                <el-table-column
                        align="center"
                        width="100px"
                        label="颜色">
                    <template slot-scope="scope">
                        <div>
                            <i v-if="scope.row.skcFlag" class="skc-icon">&bull;</i>
                            <i v-else class="skc-icon">&nbsp;</i>
                            <span>{{scope.row.colorName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="尺码">
                    <template slot-scope="scope">
                        <div v-if="scope.row.skcFlag">
                            <span>-</span>
                        </div>
                        <div v-else>
                            <span>{{scope.row.sizeName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="号型">
                    <template slot-scope="scope">
                        <div v-if="scope.row.skcFlag">
                            <span>-</span>
                        </div>
                        <div v-else>
                            <span>{{scope.row.sizeTypeCategory}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="内长">
                    <template slot-scope="scope">
                        <div v-if="scope.row.skcFlag">
                            <span>-</span>
                        </div>
                        <div v-else>
                            <span>{{scope.row.standardName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="180px"
                        :class-name="{'skc-bg' : editTable}"
                        label="厂家色号">
                    <template slot-scope="scope">
                       <div v-if="handlePowerVisible('factoryColorNo')" :class="{'disabled-bg':!handlePowerEdit('factoryColorNo')&&editTable && scope.row.skcFlag}">
                           <div v-if="editTable && scope.row.skcFlag">
                               <el-input
                                       :disabled="!handlePowerEdit('factoryColorNo')"
                                       maxlength="20"
                                       type="textarea"
                                       autosize
                                       placeholder="请输入"
                                       resize="none"
                                       @input="skcRowChange(scope.row, 'factoryColorNo')"
                                       v-model.trim="scope.row.factoryColorNo">
                               </el-input>
                           </div>
                           <div v-else style="width: 100%;height: 100%;color: #bbb" :class="{'disabled-bg':!handlePowerEdit('factoryColorNo')}">{{scope.row.factoryColorNo}}</div>
                       </div>
                        <div v-else :class="{'disabled-bg':!handlePowerEdit('factoryColorNo')}">***</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="180px"
                        :class-name="{'skc-bg' : editTable}"
                        label="厂家色名">
                    <template slot-scope="scope">
                        <div v-if="handlePowerVisible('factoryColorName')" :class="{'disabled-bg':!handlePowerEdit('factoryColorName')&&editTable && scope.row.skcFlag}">
                            <div v-if="editTable && scope.row.skcFlag">
                                <el-input
                                        :disabled="!handlePowerEdit('factoryColorName')"
                                        maxlength="20"
                                        type="textarea"
                                        autosize
                                        placeholder="请输入"
                                        resize="none"
                                        @input="skcRowChange(scope.row, 'factoryColorName')"
                                        v-model.trim="scope.row.factoryColorName">
                                </el-input>
                            </div>
                            <div v-else style="width: 100%;height: 100%;color: #bbb" :class="{'disabled-bg':!handlePowerEdit('factoryColorName')}">{{scope.row.factoryColorName}}</div>
                        </div>
                        <div v-else :class="{'disabled-bg':!handlePowerEdit('factoryColorName')}">***</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="182px"
                        :class-name="{'edit-bg' : editTable}"
                        label="供应商货号">
                    <template slot-scope="scope">
                        <div v-if="handlePowerVisible('cofNo')" :class="{'disabled-bg':!handlePowerEdit('cofNo')&&editTable}">
                            <div v-if="editTable" class="table-cofNo sku-select-wrap">
                                <el-input
                                        :disabled="!handlePowerEdit('cofNo')"
                                        maxlength="64"
                                        type="textarea"
                                        autosize
                                        placeholder="请输入"
                                        resize="none"
                                        @input="skcRowChange(scope.row, 'cofNo')"
                                        v-model.trim="scope.row.cofNo">
                                </el-input>
                            </div>
                            <div v-else style="width: 100%;height: 100%;color: #bbb" :class="{'disabled-bg':!handlePowerEdit('cofNo')}">{{scope.row.cofNo}}</div>
                        </div>
                        <div v-else :class="{'disabled-bg':!handlePowerEdit('cofNo')}">***</div>
                    </template>
                </el-table-column>
                <!--sku自定义属性-->
                <el-table-column
                        align="center"
                        width="130px"
                        v-for="(item, index) in skuTitleArr"
                        :key="index"
                        :class-name="{'edit-bg' : editTable}"
                        :label="item">
                    <template slot-scope="scope">
                        <div v-if="editTable" :class="{'disabled-bg':!handlePowerEdit('skuAttrValue'+ (index+1))}">
                            <div v-if="handlePowerVisible('skuAttrValue'+ (index+1))" class="sku-select-wrap">
                                <el-select
                                        :disabled="!handlePowerEdit('skuAttrValue'+ (index+1))"
                                        class="sku-select"
                                        @change="skcRowChange(scope.row, 'skuAttrId'+ (index+1))"
                                        v-model="scope.row['skuAttrId'+ (index+1)]">
                                    <!--<option-->
                                            <!--value=null-->
                                            <!--class="option-none">-->
                                            <!--请选择-->
                                    <!--</option>-->
                                    <el-option
                                            v-for="items in skuSelectArr['skuAttrList'+(index+1)]"
                                            :key="items.attrId"
                                            :value="items.attrId" :label="items.attrVal">
                                    </el-option>
                                </el-select>
                            </div>
                            <el-select v-else placeholder="***" disabled></el-select>
                        </div>
                        <div v-else>{{handlePowerVisible('skuAttrValue'+ (index+1))?scope.row['skuAttrValue'+ (index+1)]:'***'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="180px"
                        :class-name="{'edit-bg' : editTable}"
                        label="SKU备注">
                    <template slot-scope="scope">
                        <div v-if="editTable" :class="{'disabled-bg':!handlePowerEdit('skuRemark')}">
                            <div v-if="handlePowerVisible('skuRemark')">
                                <el-input
                                        :disabled="!handlePowerEdit('skuRemark')"
                                        type="textarea"
                                        autosize
                                        placeholder="请输入"
                                        resize="none"
                                        @input="skcRowChange(scope.row, 'remark')"
                                        v-model.trim="scope.row.remark">
                                </el-input>
                            </div>
                            <div v-else>***</div>
                        </div>
                        <div v-else>{{handlePowerVisible('skuRemark')?scope.row.remark:'***'}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        width="215px"
                        v-if="from !== 'design' && editTable"
                        :class-name="{'edit-bg' : editTable, 'skc-code-bg' : true}"
                        :render-header="renderHeader1"
                        label="条形码">
                    <template slot-scope="scope">
                       <div v-if="handlePowerVisible('skuBarcode')" :class="{'disabled-bg':!handlePowerEdit('skuBarcode')&&!scope.row.skcFlag}">
                           <div v-if="scope.row.skcFlag">
                               <span>-</span>
                           </div>
                           <div v-else>
                               <el-input
                                       :disabled="!handlePowerEdit('skuBarcode')"
                                       @change="noChinese($event,scope.$index)"
                                       maxlength="50"
                                       type="textarea"
                                       autosize
                                       placeholder="请输入"
                                       resize="none"
                                       v-model.trim="scope.row.barcode">
                               </el-input>
                           </div>
                       </div>
                        <div v-else>***</div>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        v-else-if="from !== 'design' && !editTable"
                        width="230px"
                        label="条形码">
                    <template slot-scope="scope">
                        <div v-if="handlePowerVisible('skuBarcode')">
                            <div v-if="scope.row.skcFlag">
                                <span>-</span>
                            </div>
                            <div v-else>
                                <span>{{scope.row.barcode}}</span>
                            </div>
                        </div>
                        <div v-else>***</div>
                    </template>
                </el-table-column>
            </el-table>
        </template>
    </div>
</template>

<script>
    import {
        getFacCommonSettingsSku,
        generatorSkuBarcodes,
    } from '@/api'
    export default {
        name: "skuDynamicallyTable",
        props:['type','styleNo','autoNumberGood','colorArr','sizeArr','lengthArr','editSkuTable','from','titleAndSelect','fieldRoles'],
        /**********************************
         type: 操作类型
                1.add  新建
                2.edit  编辑
                3.see  查看
         styleNo: 商品款号 （自动生成条形码功能必需）
         autoNumberGood: 自动编号规则  （自动生成条形码功能可选）
         colorArr: sku颜色数组 (编辑状态必需)
         sizeArr: sku尺码数组 (编辑状态必需)
         lengthArr: sku内长数组 (编辑状态必需)
         editSkuTable: 获取的sku表格数据，（查看和编辑状态必需）
         from:  'design'设计档案的标识
         titleAndSelect: 表头和下拉数据
         ***********************************/
        data(){
            return{
                visible: false,     //是否显示
                colorDesArr:[],     //带name的颜色数组
                sizeDesArr:[],      //带name尺码数组
                lengthDesArr:[],    //带name内长数组
                skuAttributes:[],   //全部颜色，尺码，内长数组
                skuTableData: [],   //表格数据
                oldTable:[],        //修改之前备份表格数据
                editFlag: false,     //编辑状态标识，只在编辑状态触发一次
                isActive: true,
                allSkuFlag: false,   //请求全部sku接口标识，用来判断只调用一次接口
                skcRow: {
                    factoryColorNo: '',
                    factoryColorName: '',
                    skuAttrId1: null,
                    skuAttrId2: null,
                    skuAttrId3: null,
                    remark: '',
                    skcFlag: true,
                },
                timer: '',
            }
        },
        watch: {
            colorArr() {
                if(this.allSkuFlag){
                    this.getColorName();
                }
            },
            sizeArr() {
                if(this.allSkuFlag){
                    this.getSizeName();
                }
            },
            lengthArr(){
                if(this.allSkuFlag){
                    this.getLengthName();
                }
            },
            editSkuTable(){
                this.showTable();
            },
        },
        computed:{
            userId() {
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            editTable(){
                if(this.type === 'add' || this.type === 'edit'){
                    return true
                }else{
                    return false
                }
            },
            skuTitleArr(){
                if(this.titleAndSelect){
                    return this.titleAndSelect.skuAttrTitle;
                }else{
                    return [];
                }
            },
            skuSelectArr(){
                if(this.titleAndSelect){
                    return this.titleAndSelect.skuAttrSelect;
                }else{
                    return [];
                }
            },
        },
        methods:{
            handlePowerEdit(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).editable
                }else {
                    return false
                }
            },
            handlePowerVisible(key) {
                if(this.fieldRoles.length){
                    return this.fieldRoles.find(v => v.code === key).visible
                }else {
                    return false
                }
            },
            noChinese(barcode,index){
                this.$set(this.skuTableData[index],'barcode',barcode.replace(/[\u4E00-\u9FA5]/g,''))
                this.skuTableData = JSON.parse(JSON.stringify(this.skuTableData))
            },
            //skc行批量修改厂家色号、色名、sku属性、sku备注
            skcRowChange(row, attr){
                //skc行才允许批量修改
                if(row.skcFlag){
                    if(this.timer){
                        clearTimeout(this.timer)
                    }
                    this.timer = setTimeout(() => {
                        let tableData = JSON.parse(JSON.stringify(this.skuTableData));
                        tableData.forEach(item => {
                            //sku对应属性值读取skc行
                            if(!item.skcFlag){
                                if(item.colorName === row.colorName){
                                    item[attr] = row[attr]
                                }
                            }
                        });
                        this.skuTableData = tableData;
                    }, 500);
                }
            },
            //给表格skc行加样式
            tableRowClassName(row){
                if(row.skcFlag){
                    return 'skc-row'
                }
            },
            //监听颜色，尺码
            changeSkuSelect(){
                //内长为空时默认加“无”
                if(this.lengthArr.length === 0){
                    this.lengthDesArr = [{ "id": "36fec3286377458bb445d0a287cd8e0e", "name": "无" }];
                }
                //前面默认填写了内长，所以只要颜色和尺码有值就显示sku表格
                if(this.colorDesArr.length && this.sizeDesArr.length){
                    this.oldTable = [...this.skuTableData];
                    /** 编辑状态第一次显示的数据需要初始化
                    必须保证是编辑状态，而且父组件传了初始的sku表格数据 **/
                    if(this.editFlag && this.editSkuTable && this.editSkuTable.length){
                        this.initEditSkuTable();
                        this.visible = true;
                        return
                    }
                    this.skuTableData = [];
                    this.colorDesArr.forEach((colorItem => {

                        //添加skc行
                        let skcObj = {...this.skcRow};
                        skcObj.colorName = colorItem.name;
                        skcObj.factoryColorNo = colorItem.value;
                        this.skuTableData.push(skcObj);

                        this.sizeDesArr.forEach((sizeItem =>{
                            this.lengthDesArr.forEach((lengthItem) => {
                                let skuItem = {};
                                skuItem.skuIdStr = colorItem.id + '_' + sizeItem.id + '_' + lengthItem.id;
                                skuItem.colorName = colorItem.name;
                                skuItem.factoryColorNo = colorItem.value;
                                skuItem.cofNo = colorItem.cofNo;
                                skuItem.colorId = colorItem.id;
                                skuItem.sizeName = sizeItem.name;
                                skuItem.sizeId = sizeItem.id;
                                skuItem.sizeTypeCategory = sizeItem.sizeTypeCategory ? sizeItem.sizeTypeCategory : '-';
                                skuItem.standardName = lengthItem.name;
                                skuItem.standardId = lengthItem.id;
                                skuItem.skcFlag = false;
                                skuItem.skuAttrId1 = null;
                                skuItem.skuAttrId2 = null;
                                skuItem.skuAttrId3 = null;
                                this.skuTableData.push(skuItem)
                            });
                        }));
                    }));
                    this.skuTableOldValueSave();
                    this.visible = true
                }
                else{
                    this.visible = false
                }
            },
            // sku表格已填厂家色号，厂家色名，sku自定义属性，sku备注，条形码重新赋值
            skuTableOldValueSave(){
                this.skuTableData.forEach(val => {
                    let skcResult = this.oldTable.find(item => {
                        return  val.skcFlag && item.skcFlag && (val.colorName === item.colorName)
                    });
                    // skc行,使用原来数据
                    if(skcResult){
                        val.factoryColorNo = skcResult.factoryColorNo;
                        val.factoryColorName = skcResult.factoryColorName;
                        val.skuAttrId1 = skcResult.skuAttrId1;
                        val.skuAttrId2 = skcResult.skuAttrId2;
                        val.skuAttrId3 = skcResult.skuAttrId3;
                        val.remark = skcResult.remark;
                        val.cofNo = skcResult.cofNo;
                    }
                    //sku行
                    else{
                        let oldSkuResult = this.oldTable.find(item => {
                            return (val.skuIdStr === item.skuIdStr) && !item.skcFlag
                        });
                        //之前已存在的sku行，使用原来数据
                        if(oldSkuResult){
                            val.id = oldSkuResult.id;
                            val.factoryColorNo = oldSkuResult.factoryColorNo;
                            val.factoryColorName = oldSkuResult.factoryColorName;
                            val.skuAttrId1 = oldSkuResult.skuAttrId1;
                            val.skuAttrId2 = oldSkuResult.skuAttrId2;
                            val.skuAttrId3 = oldSkuResult.skuAttrId3;
                            val.remark = oldSkuResult.remark;
                            val.barcode = oldSkuResult.barcode;
                            val.cofNo = oldSkuResult.cofNo;
                        }
                        else{
                            let newSkuResult = this.oldTable.find(item => {
                                return (val.colorName === item.colorName) && item.skcFlag
                            });
                            //新增的sku行数据取skc行数据
                            if(newSkuResult){
                                val.cofNo = newSkuResult.cofNo;
                                val.factoryColorNo = newSkuResult.factoryColorNo;
                                val.factoryColorName = newSkuResult.factoryColorName;
                                val.skuAttrId1 = newSkuResult.skuAttrId1;
                                val.skuAttrId2 = newSkuResult.skuAttrId2;
                                val.skuAttrId3 = newSkuResult.skuAttrId3;
                                val.remark = newSkuResult.remark;
                            }
                        }
                    }
                });
            },
            //渲染编辑状态的sku
            initEditSkuTable(){
                this.skuTableData = this.editSkuTable;
                this.editFlag = false;
            },
            //封装颜色对象数组
            getColorName(){
                this.colorDesArr = [];
                if(this.colorArr && this.colorArr.length){
                    this.colorArr.forEach((item => {
                        this.skuAttributes.colorList.forEach((val => {
                            if(item === val.id){
                                let obj = {};
                                obj.id = val.id;
                                obj.name = val.name;
                                obj.value = val.value;
                                this.colorDesArr.push(obj);
                            }
                        }));
                    }))
                }
                this.changeSkuSelect()
            },
            //封装尺码对象数组
            getSizeName(){
                this.sizeDesArr = [];
                if(this.sizeArr && this.sizeArr.length){
                    this.sizeArr.forEach((item => {
                        this.skuAttributes.sizeList.forEach((val => {
                            if(item === val.id){
                                let obj = {};
                                obj.id = val.id;
                                obj.name = val.name;
                                obj.sizeTypeCategoryId = val.sizeTypeCategoryId;
                                obj.sizeTypeCategory = val.sizeTypeCategory;
                                this.sizeDesArr.push(obj);
                            }
                        }));
                    }))
                }
                this.changeSkuSelect()
            },
            //封装内长对象数组
            getLengthName(){
                this.lengthDesArr = [];
                if(this.lengthArr  && this.lengthArr.length){
                    this.lengthArr.forEach((item => {
                        this.skuAttributes.standardList.forEach((val => {
                            if(item === val.id){
                                let obj = {};
                                obj.id = val.id;
                                obj.name = val.name;
                                this.lengthDesArr.push(obj);
                            }
                        }));
                    }))
                }
                this.changeSkuSelect()
            },
            // 获取所有颜色，内长，尺码下拉数据
            getFacCommonSettingsSku(){
                let params= {
                    userId: this.userId,
                    type: "all"
                };
                getFacCommonSettingsSku(params).then(res=>{
                    if(res.data.code ===0){
                        this.skuAttributes = res.data.data;
                        this.allSkuFlag = true;
                        this.getColorName();
                        this.getSizeName();
                        this.getLengthName();
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //获取sku列表数组
            getSkuArr(){
                let arr = [];
                if(this.skuTableData.length){
                    this.skuTableData.forEach((item => {
                        if(!item.skcFlag){
                            let obj = {};
                            obj.colorId = item.colorId;
                            obj.sizeId = item.sizeId;
                            obj.standardId = item.standardId;
                            arr.push(obj);
                        }
                    }))
                }
                return arr
            },
            //是否显示表格
            showTable(){
                this.skuTableData = this.editSkuTable;
                //有数据时，表格显示
                if(this.editSkuTable && this.editSkuTable.length){
                    this.visible = true;
                }
            },
            //自动生成条形码
            handleGetBarcode(){
                if(!this.handlePowerEdit('skuBarcode')) return
                //商品款号必填
                if(!this.styleNo){
                    if(this.autoNumberGood){
                        this.$message.error("请更新商品款号");
                    }else{
                        this.$message.error("商品款号未填写，条形码生成失败");
                    }
                    return
                }
                let skuList = this.getSkuArr();
                let params= {
                    userId:this.userId,
                    unitId: this.unitId,
                    styleNo: this.styleNo,
                    commonStyleSkuDTOList: skuList
                };
                generatorSkuBarcodes(params).then(res=>{
                    if(res.data.code ===0){
                        let data = res.data.data;
                        let table = [...this.skuTableData];
                        let barcodeLength = 0;  //条形码下标
                        table.forEach(item => {
                            //skc行不取条形码
                            if(!item.skcFlag){
                                item.barcode = data[barcodeLength].barcode;
                                barcodeLength++;
                            }
                        });
                        this.skuTableData = JSON.parse(JSON.stringify(table));
                        let resultText = []
                        if(res.data.successNum>0){
                            resultText.push('成功生成'+res.data.successNum+'条条形码')
                        }
                        if(res.data.failNum>0){
                            resultText.push(res.data.failNum+'条条形码生成失败')
                        }
                        if(resultText.length){
                            this.$message(resultText.join(','));
                        }
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //自定义表头
            renderHeader1(h, {column}) {
                return h('div', {class: 'render-wrap',},[
                    h('span', '条形码'),
                    h('span',{class: `render-btn ${this.handlePowerEdit('skuBarcode')?'':'disabled-btn'}`,on: {click: this.handleGetBarcode}},'自动生成'),
                ]);
            },
        },
        created(){
            //编辑状态初始化时，需要将接口的数据渲染到sku表格中
            if(this.type === 'edit'){
                this.editFlag = true;
            }
            //新建、编辑状态需要获取sku全部数据
            if(this.type === 'add' || this.type === 'edit'){
                this.getFacCommonSettingsSku();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .sku-dynamically-table{
        .skc-icon{
            width: 10px;
            font-size: 30px;
            display: inline-block;
            vertical-align: bottom;
            color: #1CA1FF;
        }
        .sku-table{
            width: 100%;
            .edit-bg{
                background-color: #FFF9ED !important;
            }
            .sku-select{
                width: 100%;
                font-size: 14px;
                border: none;
                background-color: transparent;
                outline: none;
                color: rgb(31, 41, 61);
                .option-none{
                    display: none;
                }
            }
        }
    }
</style>
<style lang="scss">
    .sku-dynamically-table{
        .cell{
            height: 100%;
            padding: 0;
            &>div{
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .skc-row{
            background-color: #F2FAFF !important;
        }
        .sku-table{
            .skc-row .skc-bg{
                background-color: #FFF9ED !important;
            }
            .skc-row .skc-code-bg{
                background-color: #F2FAFF !important;
            }
            .skc-row .skc-bg,.edit-bg{
                input,
                textarea{
                    border: none;
                    background-color: transparent;
                }
            }
            .disabled-bg{
                background-color: rgb(238, 240, 246);
                display: flex;
                align-items: center;
                justify-content: center;
                input,
                textarea{
                    padding-left: 0;
                    border: none;
                    background-color: transparent;
                }
            }
            .render-wrap{
                .render-btn{
                    display: inline-block;
                    font-size: 12px;
                    color: #fff;
                    text-align: center;
                    background: #ffa914;
                    line-height: 20px;
                    padding: 0 5px;
                    margin: 0 10px;
                    cursor: pointer;
                    &.disabled-btn{
                        cursor: not-allowed;
                        background: #ccc;
                    }
                }
            }
            .table-cofNo{
                .el-textarea__inner{
                    border: none;
                }
            }
        }
        .el-table__body-wrapper{
            position: sticky;
        }
        .el-table td{
            height: 30px;
        }
        .el-textarea__inner{
            padding:auto 0 !important;
            text-align: center;
        }
    }
</style>
