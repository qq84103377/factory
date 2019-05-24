<template>
    <div class="size-select">
        <el-select
                :disabled="disabled"
                popper-class="sizeSelect"
                :class="{'input-border':sizeTips}"
                v-model="selectedValue"
                multiple
                filterable
                placeholder="请选择尺码"
                :filter-method="filterSize"
                @remove-tag="deleteSize"
                @visible-change="visibleChange">
            <el-option>
                <div v-if="allFilterSizeList.length" class="size-content" :class="{'no-group':!switchSizeGroup}">
                    <ul v-show="switchSizeGroup" class="group-list">
                        <li v-for="(item,index) in allFilterSizeList" class="item"
                            :class="{'active':allFilterSizeList[currentGroupIndex].category == item.category}"
                            @click.stop="clickGroup(item,index)">
                            {{ item.category }}
                            <el-checkbox v-model="isSelectAll"
                                         v-if="multiple&&(allFilterSizeList[currentGroupIndex].category == item.category)"
                                         class="checkbox"
                                         @change.stop.prevent="selectAll"></el-checkbox>
                            <i style="position: absolute;right: 6px;top: 11px;color: rgb(191, 200, 217);"
                               :class="{'el-icon-caret-right':allFilterSizeList[currentGroupIndex].category == item.category}"></i>
                        </li>

                    </ul>
                    <ul class="size-list">
                        <li class="new-btn" @click="showAddSize" v-if="getFacCommonSettings">+新建尺码</li>
                        <li v-for="(item,index) in currentSizeList"
                            class="item"
                            @click.stop.prevent="toggleSize(item)">
                            {{item.name}}
                            <i v-if="item.checked" style="position: absolute;right: 12px;top: 11px;color:#ffa914;"
                               class="el-icon-check"></i>
                        </li>

                    </ul>
                </div>
                <div v-else class="no-data">暂无符合条件的尺码组</div>
            </el-option>
        </el-select>
        <el-dialog class="add-size size" :visible.sync="isAddSize" size="tiny" :modal-append-to-body="false">
            <h3 class="title">新建尺码</h3>
            <!-- <div class="mgt15">
                <el-input type="text" placeholder="请输入想要新建的尺码" :maxlength="12" v-model.trim="addSizeName"></el-input>
            </div> -->
            <el-form  label-width="80px">
                <el-form-item
                    prop=""
                    :required="true"
                    label="尺码编码"
                >
                    <el-input style="width:100%; margin-bottom:20px;" v-model.trim="addSizeValue" placeholder="不填则自动生成"></el-input>
                </el-form-item>
                <el-form-item
                    label="尺码描述"
                    :required="true"
                >
                    <el-input v-model.trim="addSizeName" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<nf-button @click="isAddSize = false" class="cancel is-plain">取消</nf-button>
				<nf-button class="mgl12" @click="addSize()" type="warning">确定</nf-button>
      		</span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        designstyleIsRefrancedSkuId,
        commonSizeCatagoryList,
        orgSizeCatagoryList,
        addCommonSize,
        judgeFacDelSku,
        addCommonSkuAttr
    } from "../../api/api";

    export default {
        // props: ['selectedId','switchSizeGroup'],
        props: {
            selectedSizes: {
                type: Array,
                default() {
                    return []
                }
            },
            switchSizeGroup: {
                type: Boolean,
                default: true
            },
            sizeTips: {
                type: Boolean,
                require: false
            },
            goodsInfoSize: {
                type: Array,
                default() {
                    return []
                }
            },
            sizeArrItem: {
                type: Array,
                default() {
                    return []
                }
            },
            multiple: {
                type: Boolean,
                default: true
            },
            toggle: {
                type: Boolean,
                default: false
            },
            isGoodsAdd: { // 判断是否是商品档案引用，用于商品档案尺码的删除、设计档案也一样
                type:Boolean,
                default() {
                    return false
                }
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                valueFirTime:true,
                getFacCommonSettings:true, //十个属性新建按钮权限
                allSizeList: [],
                currentSizeList: [],
                selectedSizesFir: [],
                isSelectAll: false,
                selectedValue: [],
                allFilterSizeList: [],
                currentGroupIndex: 0,
                beforeSearchIndex: 0,
                isAddSize: false,
                addSizeValue: '',
                addSizeName: ''
            }
        },
        watch:{
            selectedValue(v){
                console.log(v,'qiguai');
                if(this.multiple){
                    this.$emit('select',v)
                }else {
                    this.$emit('select',this.getSizeIdArr())
                }
            },
            toggle(v){
                if(v){
                    console.log('显示');
                    // this.getSizeCatagoryList()
                    this.initSelected()
                    // 进行选中赋值和是否可删除设置之后，再显示当前选中的尺码
                    this.currentSizeList = this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.slice(0, this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)
                }
            },
            selectedSizes(){

                if(this.valueFirTime){
                    this.selectedSizesFir = JSON.parse(JSON.stringify(this.selectedSizes))
                    this.valueFirTime = false
                }

                // let selectId = []
                // console.log('watch');
                // this.selectedSizes.forEach(item => {
                //     selectId.push(item.id)
                // })
                // // console.log(this.selectedSizes,'选中的尺码信息')
                // this.selectedId = selectId
            },
            selectedId(v){
                if(v){
                    this.initSelected()
                }
            }
        },
        computed: {
            selectedId: function () {
                // console.log(this.selectedSizes,'computed');
                let selectId = []
                this.selectedSizes.forEach(item => {
                    if (item.id) {
                        selectId.push(item.id)
                    } else {
                        selectId.push(item)
                    }

                })
                // console.log(selectId,'选中的尺码信息')
                return selectId
            },
            newSizeArrItem(){
                return this.sizeArrItem
            }

        },
        methods: {
            showAddSize() {
                this.isAddSize = true;
                this.addSizeValue = '';
                this.addSizeName = '';
                $(".sizeSelect").css('display','none');
            },
            // 点击尺码组
            clickGroup(item, index) {
                if (this.allFilterSizeList[this.currentGroupIndex].category != item.category) {
                    this.selectedValue.splice(0, this.selectedValue.length)
                    this.currentGroupIndex = index
                    this.isSelectAll = false
                    this.currentSizeList = this.allFilterSizeList[index].commonSkuAttrDTOList
                    this.clearSelect()

                }
            },
            // 下拉框右侧选中或移除单个尺码
            toggleSize(item) {
                console.log(item);
                let flag = true;
                this.newSizeArrItem.forEach($item=>{
                    if($item.id===item.id && $item.removeTag===0){
                        flag = false;
                        this.$message({
                            showClose: true,
                            message: "该尺码被工单或BOM表引用，不可删除",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });

                    }
                });
                if(!flag) return;

                if(this.$route.query.designStyleId&&this.selectedId.some(v => (v==item.id))) {
                    designstyleIsRefrancedSkuId({
                        designStyleId: this.$route.query.designStyleId,
                        id: item.id
                    }).then(res => {
                        console.log(res);
                        if (res.data.code == 1) {
                            this.$message.error(res.data.msg)
                        }else{
                            item.checked = !item.checked;

                            if (item.checked) {
                                this.selectedValue.push(item.name)
                            } else {
                                var currentItem = item.name;
                                var deleteIndex;
                                this.selectedValue.forEach((item, index) => {
                                    if (item == currentItem) {
                                        deleteIndex = index
                                    }
                                })
                                this.selectedValue.splice(deleteIndex, 1)
                            }
                            // 检查是否需要勾上全选复选框
                            this.checkSelectAll()
                            this.$emit('sizeArr', this.getSizeIdArr())
                        }
                    })
                    return
                }
                if(this.multiple){
                    item.checked = !item.checked;

                    if (item.checked) {
                        this.selectedValue.push(item.name)
                    } else {
                        var currentItem = item.name;
                        var deleteIndex;
                        this.selectedValue.forEach((item, index) => {
                            if (item == currentItem) {
                                deleteIndex = index
                            }
                        })
                        this.selectedValue.splice(deleteIndex, 1)
                    }
                    // 检查是否需要勾上全选复选框
                    this.checkSelectAll()
                } else {
                    this.currentSizeList.forEach(v => {
                        v.checked = false
                    })
                    item.checked = true
                    this.selectedValue = [item.name]
                }

                this.$emit('sizeArr', this.getSizeIdArr())
            },
            // 检查是否需要勾上全选复选框
            checkSelectAll() {
                if (this.selectedValue.length == this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length) {
                    this.isSelectAll = true
                }
                else {
                    this.isSelectAll = false
                }
            },
            // 全选
            selectAll() {

                if (this.isSelectAll) {
                    var selectTemp = JSON.parse(JSON.stringify(this.selectedValue)).slice(0, this.selectedValue.length)
                    if (this.selectedValue.length <= 0) {
                        this.selectedValue.splice(0, this.selectedValue.length)
                    }
                    this.currentSizeList.forEach((item, index) => {
                        if (this.isSelectAll) {
                            selectTemp.push(item.name)
                            item.checked = true
                        } else {
                            item.checked = false
                        }
                    })
                    this.selectedValue = Array.from(new Set(selectTemp))
                }
                else {
                    this.clearSelect()
                }
                this.$emit('sizeArr', this.getSizeIdArr())

            },
            // 全选或清除 选中的所有尺码
            clearSelect() {
                this.selectedValue.splice(0, this.selectedValue.length)
                this.currentSizeList.forEach((item, index) => {
                    if (this.isSelectAll) {
                        this.selectedValue.push(item.name)
                        item.checked = true
                    } else {
                        item.checked = false
                        // this.selectedValue.splice(0,this.selectedValue.length)
                    }
                })
            },

            // 点击删除尺码调接口
            deleteSize(val) {
                //获取targetFlag, targetId
                // 初始化的时候删除
                this.currentSizeList = this.allFilterSizeList[this.currentGroupIndex]
                    .commonSkuAttrDTOList
                let targetFlag = 0;
                let targetId = '';
                this.currentSizeList.find(item => {
                    if(item.name==val.value){
                        targetFlag = item.removeTag;
                        targetId = item.id
                    }
                });
                // removetag为0不能移除
                let flag = true;
                this.newSizeArrItem.forEach($item=>{
                    if($item.id===targetId && $item.removeTag===0){
                        flag = false;
                        this.$message({
                            showClose: true,
                            message: "该尺码被工单或BOM表引用，不可删除",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.selectedValue.push(val.value);

                    }
                });
                if(!flag) return;
                if(this.$route.query.designStyleId) {
                    designstyleIsRefrancedSkuId({
                        designStyleId: this.$route.query.designStyleId,
                        id: targetId
                    }).then(res => {
                        console.log(res);
                        if (res.data.code == 1) {
                            this.selectedValue.push(val.value);
                            this.$message.error(res.data.msg)
                        }else{
                            for (let i = 0; i < this.currentSizeList.length; i++) {
                                if (this.currentSizeList[i].name == val.value) {
                                    this.currentSizeList[i].checked = false
                                    this.checkSelectAll()
                                    break;
                                }
                            }
                            this.$emit('sizeArr', this.getSizeIdArr())
                        }
                    })
                    return
                }

               if(this.goodsInfoSize.lengths){
                   if (this.goodsInfoSize.lengths.length > 0) {
                       var sku = [];
                       var color_size = []
                       var selectedId = ""
                       for (let i = 0; i < this.selectedSizes.length; i++) {
                           if(this.selectedSizes[i].name === val.value){//获取当前点击的id
                               selectedId = this.selectedSizes[i].id
                           }
                       }
                       console.log(selectedId,1);
                       for (let j = 0; j < this.goodsInfoSize.colors.length; j++) {
                           color_size.push(this.goodsInfoSize.colors[j].id + "_" + selectedId);	//颜色_尺码
                       }
                       console.log(color_size,2);
                       for (let k = 0; k < color_size.length; k++) {
                           for (let h = 0; h < this.goodsInfoSize.lengths.length; h++) {
                               sku.push(color_size[k] + "_" + this.goodsInfoSize.lengths[h].id);		//颜色_尺码_内长
                           }
                       }
                       console.log(sku,3);
                   } else {
                       var sku = [];
                       for (let colorItem of this.goodsInfoSize.colors) {
                           sku.push(colorItem.id + "_" + val.id);
                       }
                   }

                       let params = {
                           goodsId: this.$route.query.goodsId,
                           styleId: this.$route.query.id,
                           sku: sku
                       };
                       judgeFacDelSku(params).then(res => {
                           if (res.data.data == 1) {
                               this.selectedValue.push(val.value)
                               this.$message({
                                   showClose: true,
                                   message: "该尺码被工单或BOM表引用，不可删除",
                                   type: "error",
                                   duration: this.$globalConfig.elementUI.duration
                               });
                           }else {
                               for (let i = 0; i < this.currentSizeList.length; i++) {
                                   if (this.currentSizeList[i].name == val.value) {
                                       this.currentSizeList[i].checked = false
                                       this.checkSelectAll()
                                       break;
                                   }
                               }
                           }

                       });
               }else{
                   for (let i = 0; i < this.currentSizeList.length; i++) {
                       if (this.currentSizeList[i].name == val.value) {
                           this.currentSizeList[i].checked = false
                           this.checkSelectAll()
                           break;
                       }
                   }
                   this.$emit('sizeArr', this.getSizeIdArr())
               }
            },
            // 搜索过滤
            filterSize(value) {

                if (value) {
                    setTimeout(() => {
                        let beforeSearchGroupName = this.allFilterSizeList.length > 0 ? this.allFilterSizeList[this.currentGroupIndex].category : ''
                        this.allFilterSizeList.splice(0, this.allFilterSizeList.length)
                        // 搜索
                        this.allSizeList.forEach((item, index) => {
                            let tempSizeList = item.commonSkuAttrDTOList.filter(item => {
                                if (!item.name) {
                                    return
                                }
                                return item.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
                            })
                            if (tempSizeList.length > 0) {
                                let tempSizeGroup = {
                                    category: this.allSizeList[index].category,
                                    commonSkuAttrDTOList: tempSizeList
                                }
                                this.allFilterSizeList.push(tempSizeGroup)
                            }
                        })
                        // 搜索有结果
                        if (this.allFilterSizeList.length > 0) {
                            // 输入框没有选中的尺码
                            if (this.selectedValue.length <= 0) {
                                this.currentGroupIndex = 0
                                // this.currentSizeList = this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList
                                //     .slice(0, this.allFilterSizeList[0].commonSkuAttrDTOList.length)
                            } else {
                                let hasSelectedGroup = false
                                this.allFilterSizeList.forEach((item, index) => {
                                    if (item.category == beforeSearchGroupName) {
                                        hasSelectedGroup = true
                                        this.currentGroupIndex = index
                                    }
                                })

                                // 如果搜索出来的尺码组中不包括当前所选中都尺码所在的尺码组，清空所选尺码
                                if (!hasSelectedGroup) {
                                    this.selectedValue.splice(0, this.selectedValue.length)
                                    this.isSelectAll = false
                                    this.currentGroupIndex = 0
                                }

                            }
                            this.currentSizeList = this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList
                                .slice(0, this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)
                        }
                    }, 200);
                }
                else {
                    this.allFilterSizeList = this.allSizeList.slice(0, this.allSizeList.length)
                    this.currentSizeList = this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList
                        .slice(0, this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)

                }
                // 当前文本框中已经有选中的尺码，然后又搜索，这时如果搜索没有结果，应该将该组选中的尺码全部清除
                // return true;
            },
            visibleChange(visible) {
                // 容错
                if(!this.allFilterSizeList.length){
                    return
                }
                this.isSelectAll = (this.selectedValue.length == this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)
                this.getSizeIdArr()
                // 下拉框隐藏时，把当前获取焦点的尺码组在全部尺码组中的index算出来
                if (!visible) {

                    let currentGroupName = this.allFilterSizeList[this.currentGroupIndex].category;

                    this.allSizeList.forEach((item, index) => {
                        if (item.category == currentGroupName) {
                            this.beforeSearchIndex = index;
                        }
                    })
                    this.$emit('sizeArr', this.getSizeIdArr())
                }
                else {
                    this.currentGroupIndex = this.beforeSearchIndex;
                    this.currentSizeList = this.allFilterSizeList[this.beforeSearchIndex]
                        .commonSkuAttrDTOList.slice(0, this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)
                }
            },
            getSizeCatagoryList() {
                let params = {
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    // facId: JSON.parse(sessionStorage.getItem('last_login')).id
                };
                commonSizeCatagoryList(params).then(res => {
                    // console.log(res.data);
                    if (res.data.code == 0) {
                        res.data.commonSizeCategoryList.forEach(item => {
                            // if(item.status ==1){
                            this.allSizeList.push(item)
                            // }
                        })
                        this.allFilterSizeList = this.allSizeList.slice(0, this.allSizeList.length)
                        this.initSelected()
                        // 进行选中赋值和是否可删除设置之后，再显示当前选中的尺码
                        this.currentSizeList = this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.slice(0, this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length)
                        // console.log(this.currentSizeList,'当前尺码组')

                    }

                });
            },
            getSizeIdArr() {
                let arr = [];
                for (let i = 0; i < this.selectedValue.length; i++) {
                    for (let j = 0; j < this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length; j++) {
                        if (this.selectedValue[i] == this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].name) {
                            arr.push(this.allFilterSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].id)
                            break;
                        }
                    }
                }
                return arr
            },
            resetFields() {
                this.selectedValue = []
                this.currentSizeList.forEach((item, index) => {
                    item.checked = false
                })
            },
            // 初始化选中的值
            initSelected() {
                // 解决报错的选中之前的值
                // 判断当前所选中的尺码属于哪个尺码组
                if (this.allSizeList.length > 0) {
                    for (let i = 0; i < this.allSizeList.length; i++) {
                        for (let j = 0; j < this.allSizeList[i].commonSkuAttrDTOList.length; j++) {
                            if (this.selectedId[0] == this.allSizeList[i].commonSkuAttrDTOList[j].id) {
                                this.currentGroupIndex = i;
                                this.beforeSearchIndex = i;
                            }
                        }
                    }
                }

                if (this.selectedId && this.selectedId.length > 0 && this.allSizeList.length > 0) {
                    // this.selectedValue.splice(0, this.selectedValue.length)

                    // 设置默认选中的尺码值selectedValue
                    console.log(this.allSizeList, '...,,')
                    let selectArr = []
                    for (let i = 0; i < this.selectedId.length; i++) {
                        for (let j = 0; j < this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length; j++) {
                            if (this.selectedId[i] == this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].id) {
                                selectArr.push(this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].name)
                                this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].checked = true
                            }
                        }
                    }
                    this.selectedValue = selectArr
                }
                // console.log(this.selectedValue,'qiguai1111111');
                if (this.selectedSizes&& this.allSizeList.length > 0) {
                    for (let i = 0; i < this.selectedSizes.length; i++) {
                        for (let j = 0; j < this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length; j++) {
                            if (this.selectedSizes[i].id == this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].id) {
                                this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[j].removeTag = this.selectedSizes[i].removeTag;
                            }
                        }
                    }
                }

            },
            addSize() {
                if (this.addSizeName == '') {
                    return;
                }

                for (let i = 0; i < this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.length; i++) {
                    if (this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[i].name &&
                        this.addSizeName.toLowerCase() == this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList[i].name.toLowerCase()) {
                        this.$message({
                            showClose: true,
                            message: "已有该尺码了",
                            type: "error",
                            duration: this.$globalConfig.elementUI.duration
                        });
                        this.addSizeName = "";
                        return;
                    }
                }

                let params = {
                    name: this.addSizeName,
                    value:this.addSizeValue,
                    type:2,
                    categoryId: this.allSizeList[this.currentGroupIndex].categoryId,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                };
                addCommonSkuAttr(params).then(
                    res => {
                        if (res.data.code == 0) {
                            this.isAddSize = false
                            let sizeItem = res.data.data
                            this.allSizeList[this.currentGroupIndex].commonSkuAttrDTOList.push(sizeItem)
                            if(this.multiple){
                                this.selectedValue.push(this.addSizeName)
                            }else{
                                this.selectedValue = [this.addSizeName]
                                this.currentSizeList.some(v => {
                                    if(v.checked){
                                        v.checked = false
                                        return !v.checked
                                    }
                                })
                            }
                            sizeItem.checked = true
                            this.addSizeName = ""
                            this.addSizeValue = ""
                            this.$emit('sizeArr', this.getSizeIdArr())
                            this.$emit('isAddAttr')
                            // this.$emit('success')
                        }
                    }
                )
            }
        },
        created: function () {

            //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
            let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
            if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
                this.getFacCommonSettings = false
            }
            this.getSizeCatagoryList();

        }
    }
</script>
<style lang="scss">
    .size {
        text-align: center;

        .el-dialog__footer {
            text-align: center;
        }
        .el-input__inner {
            // width: 170px !important;
        }
    }
    .input-border .el-input__inner {
        border: 1px solid #FA4150;
    }
</style>
<style lang="scss" scoped>

    .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
        background-color: #fff;
    }

    .el-select-dropdown__item {
        height: auto;
        padding: 0;
    }

    .el-select-dropdown__item span {
        line-height: 0 !important;
    }

    .no-data {
        padding: 8px 10px;
        color: rgb(191, 200, 217);
    }

    .size-content {
        position: relative;
        &.no-group {
            &:before {
                content: none;
            }
            .size-list {
                width: 100%
            }

        }
        &:before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 33%;
            border-left: 1px solid #d0d2d6;
        }
        .group-list {
            display: inline-block;
            vertical-align: top;
            width: 33%;
            max-height: 262px;
            overflow: auto;
            li {
                position: relative;
                line-height: 36px;
                padding: 0 12px;
                &:hover {
                    background-color: rgb(228, 230, 241);
                }
                &.active {
                    background-color: rgb(228, 230, 241);
                    .checkbox {
                        display: inline-block;
                    }
                }
                .el-checkbox__input {
                    font-size: 12px;
                    margin-bottom: -2px;
                }
                .checkbox {
                    display: none;
                    font-size: 10px;
                    margin-left: 2px;
                    .el-checkbox__input {
                        line-height: 18px !important;
                    }
                }
                .el-checkbox > .el-checkbox__input {
                    line-height: 18px !important;
                }

            }
        }
        .size-list {
            display: inline-block;
            vertical-align: top;
            width: 67%;
            max-height: 262px;
            margin-left: -3px;
            overflow: auto;
            li {
                position: relative;
                line-height: 36px;
                padding: 0 12px;
                &:hover {
                    background-color: rgba(0, 17, 51, 0.1);
                }
                &.active {
                    background-color: rgba(0, 17, 51, 0.1);
                    .arrow {
                        display: inline-block !important;
                    }
                }
                &.new-btn {
                    color: #ffa914;
                    &:hover {
                        background-color: #fff;
                    }
                }

            }
        }
    }


</style>
