<template>
    <div class="node-dialog">
        <el-dialog
                class="node-edit-dialog"
                :visible.sync="show"
                width="30%"
                center
                :show-close="false"
                :modal-append-to-body="false"
                :before-close="handleClose">
            <div slot="title" class="title">
                <!--<span v-if="from === 'designIndex'">配置提报必填</span>-->
                <span>配置可编辑字段</span>
            </div>
            <ul>
                <li @click="open(e)" v-for="(e,index) in targetList" :key="index">
                    <div :class="['li-header', e.isActive ? 'borderB' : '']">
                        <el-checkbox
                                :indeterminate="from === 'designIndex' ? false : e.isIndeterminate"
                                :disabled="from === 'designIndex' ? true : false"
                                v-model="e.checkAll"
                                @change="handleCheckAllChange(e)">
                                {{e.fieldName}}
                        </el-checkbox>
                        <span class="child-item" v-if="e.checkAll && !e.children">
                            <el-checkbox :label="e.childrenId" v-model="e.checkCode">
                                {{e.checkName}}
                            </el-checkbox>
                        </span>
                        <i v-show="e.children&&e.children.length > 0"
                           :class="[e.isActive ?'el-icon-caret-top' : 'el-icon-caret-bottom', 'header-icon']"></i>
                    </div>
                    <div class="li-content" v-show="e.isActive&&e.children&&e.children.length > 0">
                        <el-checkbox-group v-model="e.checked" @change="handleCheckedCitiesChange(e, item)">
                            <!--条形码暂时不显示，以后会用，勿删-->
                            <div class="check-block" v-for="item in e.children" v-if="item.fieldCode !== 'barcode'">
                                <span class="parent-item">
                                    <el-checkbox
                                            :disabled="from === 'designIndex'? true : false"
                                            :label="item.fieldId">
                                            {{item.fieldName}}
                                    </el-checkbox>
                                </span>
                                <span class="child-item" v-if="item.isSelect">
                                    <el-checkbox :label="item.childrenId">
                                        {{item.checkName}}
                                    </el-checkbox>
                                </span>

                            </div>
                        </el-checkbox-group>
                    </div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer center">
                <div class="foot-btn-left">
                    <el-button @click="reset">重 置</el-button>
                </div>
                <div class="foot-btn-right">
                    <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
                </div>

            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {targetField} from '@/api/sample-centre';

    export default {
        name: 'nodeDialog',
        props: ['show', 'list','from', 'selectedArr'],
        /**********************************
         from: 'nodeDesignList'，设计节点列表标识
               'designIndex', 设计档案首页标识
         selectedArr: 已选的数组
         ***********************************/
        data() {
            return {
                targetList: this.list,
                copyString: '',     //备份数据
            }
        },
        watch: {
            list(val) {
                this.targetList = val;
                this.copyString = JSON.stringify(val);
            },
            selectedArr(){
                this.checkItem();
            },
            deep: true
        },
        methods: {
            checkItem(){
                //每次弹窗修改之前还原默认值
                this.targetList = JSON.parse(this.copyString);
                if(this.selectedArr.length){
                    //封装一级选项勾选数据
                    this.selectedArr.forEach(val =>{
                        this.targetList.forEach(item =>{
                            //有parentId说明是二级选项
                            if(val.parentId) {
                                if (val.parentId == item.fieldId) {
                                    let attr = val.fieldId;
                                    item.checked.push(attr);
                                    //二级选项的子选项必填
                                    if(val.required){
                                        let attrChild = 'child-' + val.fieldId;
                                        item.checked.push(attrChild);
                                    }
                                }
                            }
                            //没有parentId说明是一级选项
                            else{
                                //没有子项的一级选项
                                if (val.fieldId == item.fieldId && !item.children) {
                                    item.checkAll = true;
                                    item.isIndeterminate = false;
                                    if(val.required){
                                        item.checkCode = true;
                                    }else{
                                        item.checkCode = 0;
                                    }
                                }
                                //设计档案首页所有一级二级都是必填，所以过滤
                                if(this.from === 'designIndex'&& item.children){
                                    item.checkAll = true;
                                    item.isIndeterminate = false;
                                    item.checkCode = true;
                                }
                            }
                        });
                    });
                    //封装二级选项勾选数据
                    this.targetList.forEach(item =>{
                        item.checked.forEach(num => {
                            item.children.forEach(v => {
                                //勾选匹配到的二级选项
                                if(num === v.fieldId){
                                    v.isSelect = true;
                                }
                                let start = num.indexOf('child-');
                                //勾选二级选项的必填
                                if(start === 0 && num.includes(v.fieldId)){
                                    v.checkCode = 1;
                                }
                            });
                        })
                    });
                    //一级选项是否打钩
                    this.targetList.forEach(item =>{
                        //设计档案首页所有一级二级都是必填，所以过滤
                        if(item.checked.length && this.from !== 'designIndex'){
                            if(item.checked.length === item.children.length * 2){
                                item.checkAll = true;
                                item.checkCode = true;
                                item.isIndeterminate = false;
                            }else{
                                item.checkAll = false;
                                item.checkCode = 0;
                                item.isIndeterminate = true;
                            }
                        }
                    })
                }
            },
            selectChild(item){
                //每次选择之前先初始化
                if(item.children){
                    item.children.forEach(v => {
                        v.isSelect = false;
                        v.checkCode = 0;
                    });
                }
                //有值选中
                if(item.checked.length > 0){
                    item.checked.forEach(num => {
                        item.children.forEach(v => {
                            //勾选匹配到的子选项
                            if(num === v.fieldId){
                                v.isSelect = true;
                            }
                            let start = num.indexOf('child-');
                            //child开头，而且child-后面的id跟父选项id匹配，说明勾选了“提报时检测必填”子选项
                            if(start === 0){
                                //截取‘child-’得到id和父id比较
                                let childStrId = num.slice(6, num.length);
                                if(childStrId === v.fieldId){
                                    v.checkCode = 1;
                                }
                            }
                        });
                    })
                }
            },
            cancel() {
                this.$emit('update:show', false)
            },
            handleClose() {
                this.$emit('update:show', false)
            },
            confirm() {
                //设计节点管理
                if(this.from === 'nodeDesignList' || this.from === 'designIndex'){
                    this.$emit('commitList',this.targetList);
                    this.$emit('update:show', false);
                    return
                }
                this.$emit('update:list', this.targetList);
                this.$message.success('配置成功');
                this.$emit('update:show', false)
            },
            //重置
            reset(){
                this.checkItem();
            },
            open(e) {
                if (e.children && e.children.length > 0) {
                    this.$set(e, 'isActive', !e.isActive)
                }
            },
            handleCheckAllChange(event) {
                let childrenId = [];
                if (event.children) {
                    event.children.map(item => {
                        childrenId.push(item.fieldId)
                    })
                }
                event.checked = event.checkAll ? childrenId : [];
                this.$set(event, 'isIndeterminate', false);
                this.selectChild(event);
            },
            handleCheckedCitiesChange(value) {
                if(this.from !== 'designIndex'){
                    let checkedCount = value.checked.length;
                    value.checkAll = checkedCount === value.children.length * 2;
                    this.$set(value, 'isIndeterminate', checkedCount > 0 && checkedCount < (value.children.length * 2));
                }
                this.selectChild(value);
            }
        },
    }
</script>
<style lang="scss">
    .node-dialog {
        width: 670px;
        .el-dialog__header {
            padding: 0;
        }
        .el-dialog__body {
            padding: 16px 24px;
        }
        .borderB {
            border-bottom: 1px solid #E6EAF0;
        }
        .title {
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #3B3B3B;
            font-size: 16px;
            border-bottom: 1px solid #E6EAF0;
        }
        ul {
            border: 1px solid #E6EAF0;
            li {
                border-top: 1px solid #E6EAF0;
                &:first-child {
                    border-top: none;
                }
            }
            .li-header {
                height: 32px;
                padding: 0 12px;
                line-height: 32px;
                display: flex;
                justify-content: space-between;
                .header-icon {
                    height: 32px;
                    line-height: 32px;
                    vertical-align: middle;
                    color: #A2ABB8;
                }
            }
            .li-content {
                line-height: 38px;
                padding: 12px;
                display: flex;
                .el-checkbox-group{
                    width: 100%;
                    .check-block{
                        width: 33%;
                        float: left;
                        .parent-item{
                            width: 85px;
                            display: inline-block;
                        }
                    }
                }
                .el-checkbox {
                    flex: 1;
                }
            }
            .el-checkbox {
                color: #808080;
                .el-checkbox__label{
                    font-size: 12px;
                }
            }
        }
        .el-dialog__footer {
            overflow: hidden;
        }
        .dialog-footer{
            .foot-btn-left{
                float: left;
            }
            .foot-btn-right{
                float: right;
            }
        }
    }
</style>


