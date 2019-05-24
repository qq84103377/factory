<template>
    <div class="print-template-config">
        <!--操作说明弹出框-->
        <div class="opera-desc">
            <el-dialog @close="closeDialog" title="操作说明" class="custom-dialog" :modal-append-to-body="false" :show-close="false" :visible.sync="visible" size="small">
                <div class="dialog-content-wrap">
                    <div>
                        <p class="opera-text">
                            通配符运用在打印模板编辑中，每个通配符对应一个数据字段，实际打印时通配符位置会打印出对应的实际内容。
                            因此您想要在打印单的哪个位置上打印什么数据，就在右方模板编辑的那个位置输入那个数据字段的通配符，举例如下：
                        </P>
                    </div>
                    <div class="opera-ep">
                        实例：工单0101129001的客户为“广州李老板”，货品款号为211001，订货总数为200件。
                    </div>
                    <div class="opera-name">
                        <div>打印模板</div>
                        <div>实际打印单</div>
                    </div>
                    <div class="opera-example">
                        <div>
                            <div>工单编号：【工单号】</div>
                            <div>客户名称：【客户名】</div>
                            <div style="position:relative;left:6px;">货品款号：【货品款号】</div>
                            <div style="position:relative;left:6px;">订货总数：【订货总数】</div>
                        </div>
                        <div>
                            <div>工单编号：010112901</div>
                            <div>客户名称：广州李老板</div>
                            <div style="position:relative;left:-11px;">货品款号：211001</div>
                            <div style="position:relative;left:-15px;">订货总数：200件</div>
                        </div>
                    </div>
                    <div class="gray pdtb15 pdlr15">
                        特殊的复杂数据会在字段名旁边“？”号详细说明。另点击通配符相应的文字可直接复制到剪切板。
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button  type="primary" @click="closeDialog">知道了</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    export default {
        props:['visible'],
        data() {
            return {
            }
        },
        computed: {
        },
        methods: {
            closeDialog(){
                this.$emit('update:visible',false)
            }
        },
        created() {
        },
    }
</script>
<style lang="scss" scoped>
    @import "~scss_vars";
    .print-template-config{

        /*操作说明弹窗样式*/
        .opera-desc {
            padding: 16px;
            .dialog-content-wrap {
                color: $nf-text-color;
                .opera-text {
                    text-align: left;
                    line-height: 1.5;
                    padding: 15px;

                }
                .opera-ep {
                    line-height: 48px;
                    border: 1px solid #e0e6ed;
                    text-align: center;
                }
                .opera-name {
                    height: 48px;
                    border: 1px solid #e0e6ed;
                    border-top: none;
                    justify-content: center;
                    display: flex;
                    align-items: center;
                    &>div{
                        flex: 1;
                        text-align: center;
                    }
                }
                .opera-example {
                    height: 120px;
                    border: 1px solid #e0e6ed;
                    border-top: none;
                    justify-content: flex-start;
                    display: flex;
                    align-items: center;
                    &>div {
                        width: 50%;
                        height: 100%;
                        flex-direction: column;
                        justify-content: center;
                        display: flex;
                        align-items: center;
                        border-right: 1px solid #e0e6ed;
                        line-height: 1.5;
                    }
                }
            }
        }
    }


</style>
<style lang="scss">
</style>



