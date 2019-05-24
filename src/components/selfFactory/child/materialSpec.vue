<template>
    <div class="edit-color">
        <div class="color-header">
            <span>物料规格</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="hideMaterialSpec">
                    收起<icon style="width:12px;height:8px;position:relative;top:-1px;left:4px;" type="icon-packup"></icon>
                </nf-button>
            </span>
        </div>
        <div class="color-table">
            <div class="color-table-title">
                <div class="color-title-name title-bg">规格号</div>
                <div  class="color-title-name title-bg">规格描述</div>
                <div class="color-title-name title-bg">
                    操作 <div style="width:14px;height:14px;cursor:pointer;" v-popover:popover1>
                    <icon style="width:14px;height:14px;margin-left:4px;" type="icon-tongyong-tishi"></icon>
                    <el-popover  popper-class='backgroundPopover' ref="popover1" placement="top-start" width="180" :offset = "180" height="86" trigger="hover">
                        <div  style="color:#fff;">只有未被任何组织里的物料引用的规格才允许删除。</div>
                    </el-popover>
                </div>
                </div>
            </div>
            <div class="color-table-scroll" :style="{'max-height': h-226 + 'px'}">
                <draggable v-model="tableData" :options="{handle:'.draggable'}" @update="datadragEnd" >
                    <transition-group>
                        <div v-for="(item,index) of tableData" :key="'MaterialSpec'+index" class="color-table-title" style="margin-top:-1px;">
                            <div @click="isExpandNo(index)" style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span v-if="!item.isExpandNo">{{item.no}}</span>
                                <el-input
                                        @input='writeVal(item)'
                                        :maxlength="8"
                                        v-focus='item.isExpandNo'
                                        v-if="item.isExpandNo"
                                        v-model.trim="item.no"
                                        placeholder="规格号不填则自动生成">
                                </el-input>
                            </div>
                            <div @click="isExpandRemark(index)" style="border-right:1px solid #e6eaf0;" class="color-title-name">
                                <span  v-show="!item.isExpandRemark">{{item.remark}}</span>
                                <el-input
                                        v-focus='item.isExpandRemark'
                                        v-if="item.isExpandRemark"
                                        v-model.trim="item.remark"
                                        placeholder="请输入规格描述">
                                </el-input>
                            </div>
                            <div v-if="!item.edit" class="color-title-name color-opera handle">
                                <div  class="color-sort draggable"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-liebiaocaozuo_tuodong"></icon>排序</div>
                                <div  @click="editMaterialSpec(item)" class="color-sort"><icon style="width:12px;height:12px;margin-right:4px;" type="icon-edit1"></icon>编辑</div>
                                <div  @click="delX(item,index)" class="color-sort"><span v-if="item.canDelete===1">
                                    <icon style="width:12px;height:12px;margin-right:4px;" type="icon-delete"></icon>删除</span></div>
                            </div>
                            <div class="edit-color-opera" v-if="item.edit">
                                <div @click="editCancel(item,index)" class="edit-color-cancel">取消</div>
                                <div @click="suerEditMaterialSpec(item)" style="color:#ffa914;cursor:pointer;">确定</div>
                            </div>
                        </div>
                    </transition-group >
                </draggable>
            </div>
            <div @click="addMaterialSpec" class="add-color">+添加</div>
        </div>
        <el-dialog
                :show-close="false"
                :modal="false"
                :visible.sync="visible.deleVisible"
                size="tiny">
            <div class="dialog-content-wrap">
                <div>
                    <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                    <p class="delete-tip">是否确定删除当前物料规格？</p>
                </div>
                <div class="handle-delete">
                    <nf-button @click="visible.deleVisible = false">取 消</nf-button>
                    <nf-button type="warning" @click="delMaterialSpec(delItem,delIndex)">确 定</nf-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    // import {updateFacCommonSettingsSort,deleteFacCommonSettings,updateCommonColor,addFacCommonSettings} from '../../../api/api'
    import {addOrUpdateCommonMaterialsSpecifications,
        deleteCommonMaterialsSpecifications,
        sortCommonMaterialsSpecifications} from '../../../api/api'
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
            }
        },
        components: {
            draggable,
        },
        watch: {
            tableData(val) {
                val.forEach(item => {
                    item.no.replace(/[\W]/g,'');
                })
            }
        },
        mounted() {
            this.info.forEach(item => {
                this.$set(item, 'isExpandNo', false); // color num input show/hide
                this.$set(item, 'isExpandRemark', false); // color name input show/hide
                this.$set(item, 'remove', false); // color name input show/hide
                this.$set(item, 'deleteTag', 0);
                this.$set(item, 'edit', false);
                item.no === void 0 ? this.$set(item, 'no', ''):void 0;
            });
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
            // 弹出删除弹层，定位删除的item
            delX(item,index) {
                if(item.canDelete===1 ) {
                    this.visible.deleVisible = true;
                    this.delItem = item;
                    this.delIndex = index;
                }
            },
            delMaterialSpec(item,index) {
                if(item.canDelete === 1) {
                    let params = {
                        id:item.id
                    }
                    deleteCommonMaterialsSpecifications(params).then(
                        res => {
                            if(res.data.code ==0) {
                                this.tableData.splice(index,1);
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
            // 取消编辑
            editCancel(item,index) {
                if(item.id ==='') {
                    if(item.no ===''||item.remark ==='') {
                        this.tableData.splice(index,1);
                    }else if(item.noDel==1){
                        item.edit = false;
                        item.isExpandNo=false;
                        item.isExpandRemark=false;
                    }else {
                        this.tableData.splice(index,1);
                    }
                }else {
                    item.edit = false;
                    item.isExpandNo=false;
                    item.isExpandRemark=false;
                    item.remark = this.info[index].remark;
                    item.no = this.info[index].no;
                }
            },
            // 编辑物料规格
            editMaterialSpec(item,index) {
                // 取消其他item的编辑状态
                this.tableData.forEach((items,index) => {
                    items.edit = false;
                    this.$set(items, 'isExpandNo', false); // color num input show/hide
                    this.$set(items, 'isExpandRemark', false); // color num input show/hide
                })
                item.edit = true;
                item.isExpandRemark = true;
            },
            // 保存编辑
            suerEditMaterialSpec(item) {
                let params = {
                    userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                    no:item.no,
                    remark:item.remark
                }
                if(item.id !==''){
                    params.id = item.id
                }
                addOrUpdateCommonMaterialsSpecifications(params).then(res =>{
                    if(res.data.code == 0) {
                        item.edit = false;
                        item.isExpandNo=false;
                        item.isExpandRemark=false;
                        if(item.id === ''){
                            item.id = res.data.data
                            item.noDel = 1;
                        }
                        //不填规格号时进行赋值
                        let _length = this.tableData.length - 1;
                        const lastItem = this.tableData[_length];
                        if(lastItem.no == ''){
                            lastItem.no = res.data.no;
                        }
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //点击编辑规格号
            isExpandNo(index) {
                if(this.tableData[index].edit == true) {
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandNo', false); // color num input show/hide
                    })
                    this.tableData.forEach(item => {
                        this.$set(item, 'edit', false); // color num input show/hide
                    })
                    this.$set(this.tableData[index], 'isExpandNo', true);
                    this.$set(this.tableData[index], 'edit', true);
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandRemark', false); // color num input show/hide
                    })
                }

            },
            //点击编辑规格描述
            isExpandRemark(index) {
                if(this.tableData[index].edit == true) {
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandRemark', false); // color num input show/hide
                    })
                    this.$set(this.tableData[index], 'isExpandRemark', true);
                    this.tableData.forEach(item => {
                        this.$set(item, 'isExpandNo', false); // color num input show/hide
                    })
                }
            },
            // 验证规格号
            writeVal(item) {
                if((/^[A-Z0-9]{1,8}$/).test(item.no)) {
                }else {
                    this.$message.error('请输入大写英文字母和数字')
                    item.no ='';
                }
            },
            //点击添加物料规格
            addMaterialSpec() {
                if(this.tableData.length>0&&this.tableData[this.tableData.length-1].id==''&&(this.tableData[this.tableData.length-1].no==''
                        ||this.tableData[this.tableData.length-1].remark=='')) {
                    this.tableData.splice(this.tableData.length-1,1);
                }
                else {
                    this.tableData.push({
                        remark:'',
                        no:'',
                        remove:false,
                        removeColor:1,
                        isExpandNo:false,
                        isExpandRemark:false,
                        deleteTag:'0',
                        canDelete:1,
                        edit:true,
                        id:'',
                        noDel:0,
                    })
                }
                this.isExpandRemark(this.tableData.length-1);
            },
            // 关闭弹层
            hideMaterialSpec() {
                this.$emit('hiddenWindow');
            },
            // 拖动结束，发送排序请求
            datadragEnd() {
                this.tableData.forEach((item,index) => {
                    item.no = item.no.toUpperCase ();
                    if(item.no == '') {
                        this.tableData.splice(index,1);
                    }
                })
                let arrIds = [];
                for(let i = 0;i<this.tableData.length;i++) {
                    if(this.tableData[i].id!='') {
                        arrIds.push(this.tableData[i].id);
                    }
                }
                sortCommonMaterialsSpecifications(arrIds).then(
                    res=> {
                        if(res.data.code===0) {
                            console.log('move success')
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }
                )
            }
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
        border-top-color:#939fb8 !important;
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






