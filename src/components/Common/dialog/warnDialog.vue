<template>
    <el-dialog
            class="warn-dialog"
            :visible.sync="visible"
            :modal-append-to-body="false"
            @close="cancel">
        <div class="body">
            <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
            <p class="message">{{ message }}</p>
            <p class="auxiliary">{{ text }}</p>
        </div>
        <div class="footer">
            <template v-if="type == 1">
                <nf-button class="warn-btn" @click="cancel">取消</nf-button>
                <nf-button class="warn-btn" type="warning" @click="confirm" :loading="loading">确定</nf-button>
            </template>
            <template v-else-if="type == 2">
                <nf-button class="warn-btn" type="warning" @click="confirm" :loading="loading">确定</nf-button>
            </template>
            <template v-if="type == 3">
                <nf-button class="warn-btn" @click="cancel">不保存</nf-button>
                <nf-button class="warn-btn" type="warning" @click="confirm" :loading="loading">保存</nf-button>
            </template>
            <template v-else-if="type == 4">
                <nf-button class="warn-btn" type="warning" @click="confirm" :loading="loading">好的</nf-button>
            </template>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "warnDialog",
        props:['visible','type','message','loading','text'],
        /*****
         * type: 按钮类型, 1为取消和确定两个按钮
         *                 2为一个确定按钮
         *                 3为不保存和保存两个按钮
         *                 4为一个好的按钮
         *                 （后续可增加...）
         *
         *****/
        methods:{
            //取消
            cancel(){
                this.$emit('update:visible', false)
                this.$emit('cancel');
            },
            //确定-
            confirm(){
                this.$emit('confirm')
            },
        }
    }
</script>
<style lang="scss" scoped>
    .warn-dialog{
        .message{
            color:#3b3b3b;
            font-size:16px;
            margin: 20px 0 20px;
            padding: 0 10px;
        }
        .auxiliary{
            font-size:12px;
            color:#A2ABB8;
            margin-bottom:30px;
        }
        .warn-btn{
            margin: 0 10px;
        }
    }
</style>
<style lang="scss">
    .warn-dialog{
        .el-dialog--small{
            width: 460px;
            .el-dialog__body{
                padding: 20px 0 0 0;
                text-align: center;
                .footer{
                    padding: 20px 0;
                    border-top: 1px solid #DFE6EC;
                }
            }
        }
    }
</style>
