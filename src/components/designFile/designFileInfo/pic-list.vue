<template>
    <div class="pic-list">
        <div class="label-group spec-info clearfix">
            <ul>
                <!--<draggable v-model="imgList" @update="datadragEnd" class="upload-img-wrap">-->
                    <li v-for="(item,index) of imgList" :key="index" @mouseenter="mask = index"
                        @mouseleave="mask = !index">
                        <div class="faceStyle" v-if="index==0&&isCover"><i id="triangle-down"></i><span>封面</span></div>
                        <span v-if="mask===index" class="mask">
		          <i class="el-icon-view" style="color: #fff;font-size: 20px;"
                     @click="popImgShow = true; imgIndex = index"></i>
		          <i v-if="isEdit" class="el-icon-delete2" style="color: #fff;font-size: 20px;margin-left: 15px;"
                     @click="cancelImg(index)"></i>
		          <span class="set-cover" v-if="index!==0&&isEdit" @click="faceing(index)">设为封面</span>
		        </span>
                        <a>
                            <img :src="item">
                        </a>
                    </li>
                <!--</draggable>-->
            </ul>
        </div>
        <!-- 放大图 -->
        <div class="goods_img">
            <el-dialog :visible.sync="popImgShow" :close-on-click-modal="false" :show-close="true" width="100%" :modal-append-to-body="false" center>
                <div style="display: flex;align-items: center;">
                    <i class="el-icon-arrow-left" @click="leftImg"></i>
                </div>
                <div class="imgs"><img :src="fileList[imgIndex]"></div>
                <div style="display: flex;align-items: center;">
                    <i class="el-icon-arrow-right" @click="rightImg"></i>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    // import {getPictureUploadToken, upDetailImgs} from '@/api/upload.js'
    // import md5 from 'js-md5';
    // const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    // import qiNiu from '@/utils/qiniu'
    export default {
        props: {
            // 是否有封面提示
            isCover: {
                type: Boolean,
                default() {
                    return true
                }
            },
            // 是否可编辑
            isEdit: {
                type: Boolean,
                default() {
                    return true
                }
            },
            fileList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        // watch: {
        //   isEdit(val) {
        //     this.isShow = val
        //   }
        // },
        data() {
            return {
                // imgList: this.fileList,
                mask: false,
                popImgShow: false, //放大图
                imgIndex: 0,
                // imgList: []
                // isShow: this.isEdit,
            }
        },
        components: {
            draggable
        },
        methods: {
            datadragEnd(evt) {
                console.log(evt)
                this.$emit('updateImg', this.imgList)
            },
            // 设置封面
            faceing(index) {
                this.fileList.unshift(this.fileList[index]);
                this.fileList.splice(index + 1, 1);
                console.log(this.fileList);
            },
            cancelImg(index) {
                this.fileList.splice(index, 1);
                this.$emit('delImg', this.fileList)
            },
            // 放大图
            leftImg() {
                if (this.imgIndex !== 0) {
                    this.imgIndex--
                }
            },
            rightImg() {
                if (this.imgIndex < this.fileList.length - 1) {
                    this.imgIndex++
                }
            }
        },
        watch: {
            // fileList(v) {
            //     this.imgList = v
            // }
        },
        computed:{
            imgList(){
                return this.fileList
            }
        },
        created(){
            // console.log(this.imgList);
        }
    }
</script>
<style lang="scss">
    .pic-list{
        .goods_img{
            .el-dialog__headerbtn .el-dialog__close{
                font-size: 32px;
            }
            .el-dialog{
                width: 100% !important;
                background: transparent;
                .el-dialog__body{
                    display: flex;
                    justify-content: space-between;
                    .el-icon-arrow-left,.el-icon-arrow-right{
                        font-size: 48px;
                    }
                    .imgs{
                        img{
                            max-width: 700px;
                            max-height: 700px;
                        }
                    }
                }
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
    /*@import 'src/styles/variables.scss';*/

    .pic-list {
        .label-group {
            .del {
                /*color: $auxiliaryText;*/
                display: inline-block;
                cursor: pointer;
            }
            .desc {
                font-size: 14px;
                float: left;
            }
            .label-title {
                width: 84px;
                float: left;
                font-size: 14px;
                text-align: right;
                > span {
                    /*color: $auxiliaryText;*/
                }
            }
            ul {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                width: 100%;
                padding: 0;
                /*min-height: 120px;*/
                .upload-img-wrap {
                    display: flex;
                }
                li {
                    width: 80px;
                    height: 80px;
                    margin: 10px;
                    position: relative;
                    cursor: pointer;
                    overflow: hidden;
                    .mask {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        background: rgba(0, 0, 0, .5);
                        z-index: 998;
                        .set-cover {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            line-height: 24px;
                            color: #fff;
                            font-size: 12px;
                            text-align: center;
                            background: #000;
                            z-index: 999;
                        }
                    }
                    .faceStyle {
                        text-align: center;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 777;
                        color: #6A1E1E;
                        background: #FFE32E;
                        font-size: 12px;
                        width: 32px;
                        height: 26px;
                        span {
                            width: 24px;
                            left: 50%;
                            transform: translateX(-50%);
                            position: absolute;
                            top: 7px;
                            line-height: normal;
                        }
                        #triangle-down{
                            position: absolute;
                            bottom: -6px;
                            left: 0;
                            width: 0px;
                            height: 0px;
                            color: white;
                            text-align: center;
                            border-top: 6px solid #FFE32E;
                            border-left: 16px solid transparent;
                            border-right: 16px solid transparent;
                        }
                    }
                    a {
                        border-radius: 0;
                        position: relative;
                        display: inline-block;
                        height: 100%;
                        width: 100%;
                        .imgCancel {
                            position: absolute;
                            top: 3px;
                            right: 5px;
                            cursor: pointer;
                            display: inline-block;
                            height: 12px;
                            width: 12px;
                        }
                        .faceSelect {
                            position: absolute;
                            bottom: 0;
                            height: 26px;
                            width: 100%;
                            background-color: rgba(0, 0, 0, 0.7);
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                        }
                    }
                    img {
                        width: 80px;
                        height: 80px;
                    }
                }
            }
        }
    }

</style>
