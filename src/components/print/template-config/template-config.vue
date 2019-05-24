<template>
    <div class="print-template-config">
        <div class="print-tab">
            <div class="print-tab-left">
                <div class="title-operationDeclaration">
                    <div>可打印数据</div>
                    <div class="check-opera" @click="showOperaDesc">查看操作说明</div>
                </div>
                <el-input class="mgb8" placeholder="搜索字段名称" icon="search" v-model.trim="searchPrint"
                          @change="searchPrintName">
                </el-input>
                <template>
                    <el-table class="custom-table" :data="wildcards" max-height="550" border
                              style="width: 329px;">
                        <el-table-column prop="name" label="序号" width="60">
                            <template slot-scope="scope">{{scope.$index +1}}</template>
                        </el-table-column>
                        <el-table-column prop="name" label="数据字段" width="130">
                            <template slot-scope="scope">
                                <!--工单独有的popover-->
                                <div v-if="templateType ==='mission'" style="position:relative;">{{scope.row.name}}
                                    <span v-popover:popover1
                                          v-if="templateType ==='mission'&&(scope.$index==9||scope.$index==17||scope.$index==19||scope.$index==23)">
                                        <icon style="width:15px;margin-left:2px;" type="icon-tongyong-tishi"></icon>
                                        <el-popover popper-class='backgroundPopover' ref="popover1"
                                                    placement="top-start"
                                                    trigger="hover">
                                            <div v-if="scope.$index==9"><img style="width:100%;"
                                                                             src="../../../../static/images/pic_sku.png"></div>
                                            <div v-if="scope.$index==17"><img style="width:100%;"
                                                                              src="../../../../static/images/pic_data-form.png"></div>
                                            <div v-if='scope.$index==19'><img style="width:100%;"
                                                                              src="../../../../static/images/pic_guige.png"></div>
                                            <div v-if='scope.$index==23'><img style="width:100%;"
                                                                              src="../../../../static/images/pic_shuxing.png"></div>
                                        </el-popover>
                                    </span>
                                </div>
                                <!--其他类型的-->
                                <div v-else  @click="columnClick(scope.row)" class="pointer" >
                                    {{scope.row.name}}
                                    <icon v-if="scope.row.type == 1||scope.row.type == 2" style="width:12px;height:12px;margin-right:4px;"
                                          type="icon-edit"></icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="通配符">
                            <template slot-scope="scope">
                                <div @click="copyName(scope.row.wildcard)">{{scope.row.wildcard}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
            <div class="print-tab-right">
                <div v-if="isPrimaryTemplate" class="print-name-select-show">
                    <div style="width:105px;margin-left:14px;"><span style="color:red;">*</span><span>打印模板名称：</span>
                    </div>
                    <div class="print-name">
                        <el-input style="font-size:16px;" placeholder="输入打印模板名称" v-model.trim="templateData.name">
                        </el-input>
                    </div>
                    <div v-if="templateType!='designStyle'&&templateType!='order'&&templateType!='mission_report'" class="blue action-btn" @click='visible.systemTemplateVisible=true;'>选择预设模板</div>
                    <div class="orange action-btn " @click="printPreview">打印实例预览</div>
                </div>
                <UE @htmlData="htmlChange" :defaultMsg=defaultMsg :config=config :id=ueId ref="ue"></UE>
                <textarea id="contents" rows="10" cols="10" style="height:0;width:0;opacity: 0;">{{copyData}}</textarea>
            </div>
        </div>
        <!--预设模板弹出框-->
        <div v-if="visible.systemTemplateVisible" class="show-default">
            <el-dialog class="custom-dialog" title="预设打印模板" :modal-append-to-body="false" :show-close="false"
                       :visible.sync="visible.systemTemplateVisible" size='small'>
                <div class="dialog-content-wrap">
                    <div class="tab-default">
                        <div class="btn-tab">{{systemTemplate.name}}
                            <div class="select-btn">
                                <i class="el-icon-check"></i>
                            </div>
                        </div>
                        <!-- <div class="btn-tab">未来增加的模板</div> -->
                    </div>
                    <div id="defaultUERender" v-html="systemTemplate.content">
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="visible.systemTemplateVisible=false">取 消</el-button>
                    <el-button type="primary" @click="setSystemTemplate">选择</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import UE from '../../ue/ue';
    export default {
        props: {
            //是不是主模版，不是主模板的不需要显示富文本上面的编辑模板名称和预设模板以及打印预览
            isPrimaryTemplate: {
                type: Boolean,
                default: true
            },
            //模板类型
            templateType: {
                type: String,
                default: ''
            },
            templateData: {
                type: Object,
                default: {
                    name: '', //模板名称
                    wildcards: [],// 通配符列表
                    content: '',//模板内容
                    systemTemplate: {}, //系统预设模板
                }
            }
        },
        // props:['isPrimaryTemplate','templateType','templateData'],
        components: {UE},
        data() {
            return {
                defaultMsg: '',
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 450,
                    zIndex: 3,
                },
                searchPrint: '',
                // checked: 'true',
                ueId: "ueId" + this.templateData.name, // 不同编辑器必须不同的id
                copyData: '',
                visible: {
                    systemTemplateVisible: false,
                },
                templateData: [],
                wildcards:[]
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            systemTemplate() {
                return this.templateData.systemTemplate
            }
        },
        methods: {
            //复制内容到剪切板
            copyName(val) {
                this.copyData = val;
                let e = this.$el.querySelector("#contents");
                e.value = val;
                e.select();
                window.document.execCommand('Copy');
                this.$message({
                    showClose: false,
                    message: "复制成功",
                    type: "success",
                    duration: this.$globalConfig.elementUI.duration
                });
            },
            // 预览工单
            printPreview(){
                this.$emit('printPreview')
            },
            // 使用预设模板
            setSystemTemplate() {
                this.visible.systemTemplateVisible = false;
                this.$refs.ue.setUEContent(this.templateData.systemTemplate.content)
            },
            //模板改变的时候
            htmlChange() {
                let html = this.$refs.ue.getUEContent()
                this.templateData.content = html
            },
            //显示操作说明弹窗
            showOperaDesc() {
                this.$emit('showOperaDesc')
            },
            // 点击数据字段列的时候，row.type==1时，让父组件弹出子模板配置弹窗
            // row.type ==2时，让父组件弹出设置图片的宽、高的弹出
            columnClick(row) {
                if(row.type == 1){
                    this.$emit('showChildTemplateConfig', row)
                }
                else{
                    this.$emit('setPictureSize',row)
                }
            },
            // 筛选字段名称
            searchPrintName(val){
                if(val){
                    this.wildcards = this.templateData.wildcards.filter(item =>{
                        return item.name.indexOf(val)!=-1
                    })
                } else {
                    this.wildcards = this.templateData.wildcards
                }
            }
        },
        watch: {
            'templateData.content'(val) {
                this.$refs.ue.setUEContent(val);

            },
            'templateData.wildcards'(val) {
                this.wildcards = val
            },
        },
        created() {
            this.defaultMsg = this.templateData.content
            this.wildcards = this.templateData.wildcards
            if (this.templateData.systemTemplate) {
                this.systemTemplate = this.templateData.systemTemplate
            }

        },
    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .print-template-config {
        /*主页面样式*/
        .print-tab {
            display: flex;
            align-items: stretch;
            min-height: 623px;
            width: 100%;
            flex: 1;
            background-color: #fff;
            .print-tab-left {
                width: 329px;
                // min-width:314px;
                height: 100%;
                box-shadow: 1px 0 0 0 #e6e7ed;
                padding: 16px 16px 16px 16px;
                .title-operationDeclaration {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    .check-opera {
                        color: $color-btn;
                        &:hover {
                            color: $color-btn;
                            text-decoration: underline;
                            cursor: pointer;
                        }
                    }
                }
            }
            .print-tab-right {
                .print-name-select-show {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 46px;
                    font-size: 14px;
                    width: 100%;
                    .print-name {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        flex: 1;
                        .el-input__inner {
                            border: none;
                        }
                    }
                    .action-btn {
                        width: 108px;
                        height: 46px;
                        line-height: 46px;
                        text-align: center;
                        box-shadow: inset -1px 0 0 0 #e0e6ed;
                        cursor: pointer;
                        background-color: #fff;
                        &:hover {
                            background-color: #F7F9FC;
                        }
                    }
                }
            }
        }
        /*预设模板弹窗样式*/
        .show-default {
            .titile-name-default {
                font-size: 20px;
                color: #3b3b3b;
                padding-bottom: 16px;
                border-bottom: 1px solid #e0e6ed;
            }
            .tab-default {
                display: flex;
                justify-content: flex-start;
                padding-bottom: 24px;
                .btn-tab {
                    position: relative;
                    width: 180px;
                    height: 40px;
                    border: solid 1px #ffa914;
                    margin: 0 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .select-btn {
                    position: absolute;
                    border-bottom: 24px solid $color-btn;
                    border-left: 24px solid transparent;
                    height: 0;
                    width: 0;
                    bottom: 0;
                    right: 0;
                    .el-icon-check {
                        color: #fff;
                        font-size: 12px;
                        position: absolute;
                        bottom: -24px;
                        right: -1px;
                        z-index: 1;
                    }
                }
            }
            #defaultUERender {
                border: 1px solid #e0e6ed;
                padding: 24px;
                box-sizing: border-box;
                height: 100%;
                width: 624px;
                margin: 0 auto;
            }
        }
    }


</style>
<style lang="scss">
    .print-template-config {
        .print-name {
            .el-input__inner {
                border: none;
                padding: 3px 0;
                font-size: 14px;
            }
        }
        .show-default {
            .el-dialog--small {
                width: 710px;
                table{
                    width: 100% !important;
                }
            }
        }
    }
</style>



