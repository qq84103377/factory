<template>
    <div class="edit-color">
        <div class="color-header">
            <span>通用颜色库</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="$emit('hiddenWindow')">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </span>
        </div>
        <div class="color-table">
            <div class="color-table-title">
                <div class="color-title-name title-bg">色号</div>
                <div  class="color-title-name title-bg">
                    色名</div>
                <div class="color-title-name title-bg">
                    操作 <div style="width:14px;height:14px;cursor:pointer;" v-popover:popover1>
                    <icon style="width:14px;height:14px;margin-left:4px;" type="icon-tongyong-tishi"></icon>
                    <el-popover  popper-class='backgroundPopover' ref="popover1" placement="top-start" width="180" :offset = "180" height="86" trigger="hover">
                        <div  style="color:#fff;">只有未被货品引用才允许被删除。</div>
                    </el-popover>
                </div>
                </div>
            </div>
            <div class="color-table-scroll" :style="{'max-height': h-226 + 'px'}">
                <draggable v-model="tableData" :options="{handle:'.draggable'}" @update="sureGoods">
                    <transition-group>
                        <div v-for="(item,index) of tableData" :key="'ColorAttr'+index" class="color-table-title" style="margin-top:-1px;">
                            <div @click="isExpandVal(index)" style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span v-if="!item.isExpandVal">{{item.value}}</span>
                                <el-input
                                        v-if="item.isExpandVal"
                                        v-focus='item.isExpandVal'
                                        :maxlength="12"
                                        placeholder="色号不填则自动生成"
                                        v-model.trim="item.value">
                                </el-input>
                            </div>
                            <div @click="isExpandName(index)" style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span  v-show="!item.isExpandName">{{item.name}}</span>
                                <el-input
                                        v-if="item.isExpandName"
                                        v-focus='item.isExpandName'
                                        :maxlength="12"
                                        placeholder="请输入色名"
                                        v-model.trim="item.name">
                                </el-input>
                            </div>
                            <div v-if="!item.edit" class="color-title-name color-opera handle">
                                <div  class="color-sort draggable"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序</div>
                                <div  @click="editColor(item)" class="color-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                                <div  @click="delX(item,index)" class="color-sort"><span v-if="item.removeTag===1"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span></div>
                            </div>
                            <div class="edit-color-opera" v-if="item.edit">
                                <div @click="editCancel(item,index)" class="edit-color-cancel">取消</div>
                                <div @click="sureEditColor(item)" style="color:#ffa914;cursor:pointer;">确定</div>
                            </div>
                        </div>
                    </transition-group >
                </draggable>
            </div>
            <div @click="addColor" class="add-color">+添加</div>
        </div>
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="visible.deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前色号？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delColorNum">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import {updateFacCommonSettingsSort,deleteFacCommonSettings,updateCommonColor,addCommonSkuAttr} from '../../../api/api'
    export default {
        props: {
            h: '',
            info: []
        },
        data() {
            return {
                edit:false,
                tableData: JSON.parse(JSON.stringify(this.info)),
                visible:{
                    deleVisible:false,
                },
                delItem:{},
                delIndex:0,
                userId: ''
            }
        },
        components: {
            draggable,
        },
        watch: {
            tableData(val) {
                val.forEach(item => {
                    item.value.replace(/[\W]/g,'');
                })
            }
        },
        mounted() {
            // console.log(this.info,'mounted')
            this.info.forEach(item => {
                this.$set(item, 'isExpandVal', false); // color num input show/hide
                this.$set(item, 'isExpandName', false); // color name input show/hide
                this.$set(item, 'remove', false); // color name input show/hide
                this.$set(item, 'deleteTag', 0);
                this.$set(item, 'edit', false);
                item.value === void 0 ? this.$set(item, 'value', ''):void 0;
            });
            // console.log(this.info,'12');

            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        },
        //自动获取焦点，对input进行DOM操作，实际上；
        directives: {
            focus: {
                inserted: (el, {value}) => {
                    // console.log(el,value);
                    if (value) {
                        //由于是饿了么的el-input，需要拿到父元素下面的input
                        el.firstElementChild.focus();
                    }
                }
            }
        },
        methods: {
            delX(item,index) {
                if(item.removeTag===1 ) {
                    this.visible.deleVisible = true;
                    this.delItem = item;
                    this.delIndex = index;
                }
            },
            delColorNum() {
                this.delColor(this.delItem,this.delIndex);
            },
            handleClick() {
                this.$emit('hiddenWindow');
            },
            delColor(item,index) {
                if(item.removeTag === 1) {
                    this.tableData.splice(index,1);
                    let params = {
                        userId:this.userId,
                        type:'color',
                        id:item.id
                    }
                    deleteFacCommonSettings(params).then(
                        res => {
                            console.log(res.data);
                            if(res.data.code ==0) {
                                this.visible.deleVisible = false;
                                this.$message.success(res.data.msg);
                            }else {
                                this.$message.error(res.data.msg);
                            }
                        }
                    )
                }else {
                    return;
                }
            },
            editCancel(item,index) {
                if(item.id ==='') {
                    if(item.name ===''||item.value ==='') {
                        this.tableData.splice(index,1);
                    }else if(item.noDel==1){
                        item.edit = false;
                        item.isExpandVal=false;
                        item.isExpandName=false;
                    }else {
                        this.tableData.splice(index,1);
                    }
                }else {
                    item.edit = false;
                    item.isExpandVal=false;
                    item.isExpandName=false;
                    item.name = this.info[index].name;
                    item.value = this.info[index].value;
                }
            },
            editColor(item,index) {
                this.tableData.forEach((items,index) => {
                    items.edit = false;
                    this.$set(items, 'isExpandVal', false); // color num input show/hide
                    this.$set(items, 'isExpandName', false); // color num input show/hide
                })
                item.edit = true;
                item.isExpandName = true;
            },
            sureEditColor(item) {
                if(item.id !=='') {
                    let params = {
                        userId:this.userId,
                        id:item.id,
                        name:item.name,
                        value:item.value,
                    }
                    updateCommonColor(params).then(
                        res => {
                            console.log(res.data);
                            if(res.data.code == 0) {
                                item.edit = false;
                                item.isExpandVal=false;
                                item.isExpandName=false;
                            }else {
                                this.$message.error(res.data.msg);
                            }
                        }
                    )
                }else {
                    let params = {
                        userId:this.userId,
                        type: 1,
                        name:item.name,
                        value:item.value,
                    }
                    addCommonSkuAttr(params).then(
                        res => {
                            console.log(res.data);
                            if(res.data.code !==0) {
                                this.$message.error(res.data.msg);
                            }else {
                                item.id=res.data.data.id;
                                item.edit = false;
                                item.isExpandVal=false;
                                item.isExpandName=false;
                                item.noDel = 1;
                                //不填色号时进行赋值
                                let _length = this.tableData.length - 1;
                                this.tableData[_length].value = res.data.data.value;
                            }
                        }
                    )
                }
            },
            //点击编辑色号
            isExpandVal(index) {
                if(this.tableData[index].edit == true) {
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandVal', false); // color num input show/hide
                    })
                    this.tableData.forEach(item => {
                        this.$set(item, 'edit', false); // color num input show/hide
                    })
                    this.$set(this.tableData[index], 'isExpandVal', true);
                    this.$set(this.tableData[index], 'edit', true);
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandName', false); // color num input show/hide
                    })
                }

            },
            //点击编辑色名
            isExpandName(index) {
                if(this.tableData[index].edit == true) {
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandName', false); // color num input show/hide
                    })
                    this.$set(this.tableData[index], 'isExpandName', true);
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandVal', false); // color num input show/hide
                    })
                }
            },
            //enter时进入到色名编辑；
            enterVal(index) {
                if(this.tableData[index].edit == true) {
                    if(this.tableData[index].value==='') {
                        this.$message.error("请输入色号");
                        return;
                    }else{
                        if((/^[A-Za-z0-9]{1,12}$/).test(this.tableData[index].value)) {
                            this.tableData[index].isExpandVal = false;
                            this.tableData[index].isExpandName = true;
                        }else {
                            item.value='';
                        }
                    }
                }
            },
            //enterName,添加一条新的，并自动获取到焦点；

            enterName(index) {
                if(this.tableData[index].edit == true) {
                    this.tableData[index].isExpandName = false;
                    if(this.tableData.length === index+1) {
                        this.addColor();
                    }else {
                        this.tableData[index+1].isExpandVal = true;
                    }
                }
            },
            //点击添加按钮添加颜色
            addColor() {
                if(this.tableData.length>0 && this.tableData[this.tableData.length-1].id==''&&(this.tableData[this.tableData.length-1].value==''||this.tableData[this.tableData.length-1].name=='')) {
                    this.tableData.splice(this.tableData.length-1,1);
                }else {
                    // this.tableData.forEach((items,index) => {
                    //     items.value = this.info[index].value;
                    //     items.name = this.info[index].name;
                    // })
                    this.tableData.push({
                        name:'',
                        value:'',
                        remove:false,
                        removeColor:1,
                        isExpandVal:false,
                        isExpandName:false,
                        deleteTag:'0',
                        removeTag:1,
                        edit:true,
                        id:'',
                        noDel:0,
                    })
                }
                this.isExpandName(this.tableData.length-1);
            },
            sureGoods() {
                this.tableData.forEach((item,index) => {
                    // console.log(item.value.toUpperCase ());
                    // item.value = item.value.toUpperCase ();
                    if(item.value == '') {
                        this.tableData.splice(index,1);
                    }else if(item.name == '') {
                        // this.tableData.splice(index,1);
                    }
                })
                let arrIds = [];
                for(let i = 0;i<this.tableData.length;i++) {
                    if(this.tableData[i].id!='') {
                        arrIds.push(this.tableData[i].id);
                    }
                }
                let params = {
                    colorIds:arrIds,
                    userId:this.userId
                };
                console.log(params);
                updateFacCommonSettingsSort(params).then(
                    res=> {
                        if(res.data.code===0) {
                            // this.$emit('hiddenWindow');
                            console.log('move success');
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            },
        }
    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .red{
        color: #fa4150;
    }
    .test{
        display: flex;
    }
    .title-bg {
        background-color: #f5f7fa;
        color: #a2abb8 !important;
    }
    .edit-color {
        position: fixed;
        top: 0;
        right: 0;
        width: 850px !important;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 101;
        .color-header {
            width: 850px;
            height: 88px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 2;
        }
        .color-table{
            margin:32px;
            box-sizing: border-box;
            .color-table-title {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 36px;
                color: #a2abb8;
                border: 1px solid #e6eaf0;
            }
            .color-title-name{
                width:33.3333%;
                display: flex;
                justify-content: center;
                align-items: center;
                height:36px;
                color: #3b3b3b;
                position: relative;
            }
            .color-opera {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height:36px;
            }
            .add-color{
                height:36px;
                display: flex;
                justify-content: center;
                align-items: center;
                width:100%;
                height:36px;
                color:#ffa914;
                border: 1px solid  #e6eaf0;
                margin-top:-1px;
                box-sizing: border-box;
                &:hover{
                    background-color: #f7f9fc;
                    cursor: pointer;
                }
            }
            .color-sort{
                display: flex;
                justify-content: center;
                align-items: center;
                width:50%;
                border-right:1px solid #e6eaf0;
                height:36px;
                color: #808080;
                &:hover {
                    color: #3b3b3b;
                    cursor: pointer;
                }
            }
            .del-color{
                display: flex;
                justify-content: center;
                align-items: center;
                width:50%;
            }
            .del-text{
                color:#808080;
                &:hover {
                    color: #3b3b3b;
                }
            }
            .color-table-scroll{
                overflow-y: auto;
                overflow-x: hidden;
                max-height:600px;
            }
            .edit-color-opera {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 33.3333%;
                height:100%;
                .edit-color-cancel {
                    margin-right:24px;
                    cursor: pointer;
                }
            }
            .color-draggable{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                min-width: 90%;
            }
        }
    }
</style>
<style lang="scss">
    .backgroundPopover{
        background:#939fb8;
        border:1px solid #939fb8;
    }
    .popper__arrow::after{
        border-top-color::#939fb8 !important;
    }
    .edit-color .el-checkbox__inner {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        &:hover {
            boder: 1px solid #ffa914;
            color: #3b3b3b !important;
        }
        &::after {
            box-sizing: content-box;
            content: "";
            border: 2px solid #fff;
            border-left: 0;
            border-top: 0;
            height: 8px;
            left: 3px;
            position: absolute;
            top: 0px;
            -ms-transform: rotate(45deg) scaleY(0);
            transform: rotate(45deg) scaleY(0);
            width: 4px;
            transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
            -ms-transform-origin: center;
            transform-origin: center;
        }
    }
    .edit-color {
        .el-input__inner {
            border:1px solid #ffa914;
            border-radius:0px;
            text-align:center;
        }
    }
    .edit-color .dialog-content-wrap {
        text-align: center;
        .delete-tip {
            padding-top:4px;
            font-size: 16px;
        }
        p {
            line-height: 26px;
        }
    }
    .edit-color  .handle-delete {
        margin-top: 34px;
    }
</style>






