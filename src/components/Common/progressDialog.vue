<template>
    <!--<el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>-->
    <el-dialog
            :show-close="false"
            class="custom-dialog progress-dialog"
            title="提示"
            :visible.sync="dialogVisible">
        <div style="text-align: center;margin-bottom: 8px;">{{currentNum < total ?'已处理':'已完成'}}: {{currentNum}}/{{total}}</div>
        <el-progress :status="currentNum < total ?'':'success'" :show-text="false" :stroke-width="18" :percentage="percent"></el-progress>
        <span slot="footer" class="dialog-footer">
    <!--<el-button type="primary" @click="isDone=true">完成</el-button>-->
    <el-button type="primary" @click="$emit('update:dialogVisible',false)">确 定</el-button>
  </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "progress-dialog",
        props: ['dialogVisible','total','isDone'],
        data() {
            return {
                currentNum: 0,
                time: null,
            }
        },
        computed: {
            percent() {
                return this.currentNum / (this.total||1) * 100
            }
        },
        methods: {

        },
        watch: {
            dialogVisible(v) {
                if(v) {
                    this.currentNum = 0
                   this.time = setInterval(() => {
                       if(this.currentNum >= this.total - 1) {
                           this.currentNum = this.total - 1
                           clearInterval(this.time)
                           return
                       }

                       this.currentNum++
                   },50)
                }else {
                    clearInterval(this.time)
                    this.currentNum = 0
                }
            },
            isDone(v) {
                if(v) {
                    clearInterval(this.time)
                    this.currentNum = this.total
                }
            }
        }
    }
</script>

<style lang="scss">
    .progress-dialog{
        .el-progress-bar__inner{
            background: #ff9c38;
        }
    }
</style>