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
                <span>{{titleText}}字段可见性权限</span>
            </div>
            <ul>
                <li v-for="(e,index) in targetList" :key="index">
                    <div @click="open(e)" :class="['li-header', e.isActive ? 'borderB' : '']">
                        <el-checkbox
                                :indeterminate="e.indeterminate"
                                :disabled="e.isDefaultSelect"
                                v-model="e.visible"
                                @change="handleCheckAllChange($event,e)">
                                {{e.name}}
                        </el-checkbox>
                        <div>
                            <span class="child-item">
                            <el-checkbox @change="handleAllEdit($event,e)" v-model="e.editable">
                                可编辑
                            </el-checkbox>
                        </span>
                            <i v-show="e.childs&&e.childs.length > 0"
                               :class="[e.isActive ?'el-icon-caret-top' : 'el-icon-caret-bottom', 'header-icon']"></i>
                        </div>
                    </div>
                    <div class="li-content" v-show="e.isActive&&e.childs&&e.childs.length > 0">
                        <!--<el-checkbox-group v-model="e.checked" @change="handleCheckedCitiesChange(e)">-->
                            <!--条形码暂时不显示，以后会用，勿删-->
                            <div class="check-block" v-for="(item,index) in e.childs" :key="index">
                                <span class="parent-item">
                                    <el-checkbox
                                            @change="handleFieldCheck($event,item,e)"
                                            v-model="item.visible"
                                            :disabled="item.isDefaultSelect"
                                            :label="item.id">
                                            {{item.name}}
                                    </el-checkbox>
                                </span>
                                <span class="child-item" v-if="item.visible">
                                    <el-checkbox :disabled="item.isDefaultSelect" v-model="item.editable">
                                        可编辑
                                    </el-checkbox>
                                </span>

                            </div>
                        <!--</el-checkbox-group>-->
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

    export default {
        props: ['show', 'list','titleText'],
        data() {
            return {
                targetList: [],
                copyString: '',     //备份数据
            }
        },
        watch: {
            list(val) {
                let arr = JSON.parse(JSON.stringify(val));
                arr.forEach(v => {
                    this.$set(v,'isActive',true)
                    this.$set(v,'indeterminate',false)
                })
                this.copyString = JSON.parse(JSON.stringify(arr));
                this.targetList = JSON.parse(JSON.stringify(arr));
                // this.checkItem();
            },
            // show(v) {
            //    if(!v) {
            //        this.targetList = JSON.parse(JSON.stringify(this.copyString))
            //    }
            // }
        },
        methods: {
            handleCheckAllChange(e,item) {
                item.childs.forEach(v => {
                    if(!v.isDefaultSelect) {
                        v.visible = e.target.checked
                        v.editable = false
                    }else {
                        item.indeterminate = !e.target.checked
                    }
                })
            },
            handleAllEdit(e,item) {
                item.childs.forEach(v => {
                    if(!v.isDefaultSelect) {
                        v.editable = e.target.checked ? v.visible : false
                    }
                })
            },
            handleFieldCheck(e,item,firstItem) {
                firstItem.indeterminate = firstItem.childs.some(v => v.visible) && !firstItem.childs.every(v => v.visible)
                firstItem.visible = firstItem.childs.some(v => v.visible)
                if(!e.target.checked) item.editable = false
            },
            cancel() {
                this.$emit('update:show', false)
                // this.targetList = JSON.parse(JSON.stringify(this.copyString))
            },
            handleClose() {
                this.$emit('update:show', false)
                // this.targetList = JSON.parse(JSON.stringify(this.copyString))
            },
            confirm() {
                // this.copyString = JSON.parse(JSON.stringify(this.targetList))
                this.$emit('confirm',this.targetList,this.titleText==='商品档案'?'goodsStyleConfigs':'designStyleConfigs')
                this.$emit('update:show', false)
            },
            //重置
            reset(){
                this.targetList = JSON.parse(JSON.stringify(this.copyString))
            },
            open(e) {
                if (e.childs && e.childs.length > 0) {
                    this.$set(e, 'isActive', !e.isActive)
                }
            },
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
                flex-wrap: wrap;
                /*.el-checkbox-group{*/
                    /*width: 100%;*/
                    .check-block{
                        flex: 0 0 33%;
                        /*float: left;*/
                        .parent-item{
                            width: 115px;
                            display: inline-block;
                        }
                    }
                /*}*/
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


