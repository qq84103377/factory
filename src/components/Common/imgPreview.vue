<template>
    <!-- 图片预览 -->
    <div class="goods_img_arch">
        <el-dialog :visible.sync="centerDialogVisible" @close="dialogClose"  :modal-append-to-body="false" :show-close="true" width="100%" :modal="true" center>
            <div>
                <i class="el-icon-arrow-left" @click="leftImg"></i>
            </div>
            <div class="imgs"><img v-for="(item,index) in newImgLists" v-if="index == imgIndex" :src="item.path"
                                   style=" max-width: 592px; max-height: 600px;"></div>
            <div>
                <i class="el-icon-arrow-right" @click="rightImg"></i>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "imgPreview",
        props:['centerDialogVisible','imgLists','imgIndex'],
        data(){
            return {
                centerDialogVisible:false,
                imgIndex:0,
                imgLists:[],
            }
        },
        computed:{
            newImgLists(){
                // 格式处理
                var newImgListsArr = [];
                if(this.imgLists[0]){
                    if(!this.imgLists[0].path){
                        this.imgLists.forEach(item=>{
                            newImgListsArr.push({path:item})
                        })
                    }else {
                        newImgListsArr = this.imgLists
                    }

                }
                return newImgListsArr
            }
        },
        created(){

        },
        methods:{
            dialogClose(){
                this.$emit('dialogClose')
            },
            // 预览图片点击左边
            leftImg() {
                if (this.imgIndex == 0) {
                    return false;
                } else {
                    this.imgIndex--;
                }
            },
            // 预览图片点击右边
            rightImg() {
                if (this.imgIndex >= this.imgLists.length - 1) {
                    return false;
                } else {
                    this.imgIndex++;
                }
            },
        }
    }
</script>

<style lang="scss">
    .goods_img_arch {
        min-width: 1010px;
        padding-bottom: 5px;
        border-radius: 4px;
        position: relative;
    .el-dialog {
        box-shadow: none;
    }
    .el-dialog--small {
        background-color: transparent;
        width: 100% !important;
        top: 5% !important;
    }
    .el-dialog__body {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .el-dialog__headerbtn .el-dialog__close {
        font-size: 24px;
        position: absolute;
        right: 60px;
        top: -18px;
        z-index: -1;
        cursor: pointer;
    }
    .imgs {
        height: 600px;
        display: flex;
        transition: all 1s;
        justify-content: center;
        align-items: center;
        user-select: none;
        margin: 0 auto;
    img {
        max-width: 700px;
        max-height: 700px;
    }
    }
    .el-icon-arrow-left {
        font-size: 48px;
        color: #ccc;
        cursor: pointer;
    &:hover {
         color: #fff;
     }
    }
    .el-icon-arrow-right {
        font-size: 48px;
        color: #ccc;
        cursor: pointer;
    &:hover {
         color: #fff;
     }
    }
    }
</style>