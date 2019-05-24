<template>
    <div class="update-pic">

        <el-dialog custom-class="min360" title="修改头像" :visible.sync="updataPicVisible">
            <div class="user-info">
                <div class="cropper" v-show="!isUpload">
                    <VueCropper
                            ref="cropper"
                            :img="example2.img"
                            :outputSize="example2.size"
                            :outputType="example2.outputType"
                            :info="example2.info"
                            :canScale="example2.canScale"
                            :autoCrop="example2.autoCrop"
                            :autoCropWidth="example2.width"
                            :autoCropHeight="example2.height"
                            :fixed="example2.fixed"
                            :fixedNumber="example2.fixedNumber"
                            :full="example2.full">
                    </VueCropper>
                </div>
                <div class="view-img">
                    <img :src="resultURL" v-show="isUpload">
                </div>
                <div class="upload-btns">
                    <input ref="input" type="file" id="uploads" style="display:none; width: 0; height: 0; opacity: 0; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg">
                    <nf-button type="warning" @click="clickUpload()">点击上传</nf-button>
                    <nf-button type="warning" class="sava-btn" @click="finish()">保存修改</nf-button>
                </div>

            </div>
        </el-dialog>

    </div>
</template>

<script>
import VueCropper from 'vue-cropper'
import { getUploadToken, upDetailImg } from '../../api/api'
export default {
    components: { VueCropper },
    props:['img'],
    data: function() {
        return {
            imgUrl: "",
            updataPicVisible: true,
            reader: '',
            resultURL: '',
            isUpload: false,
            example2: {
                img: this.$props.img,    // 图片地址
                info: false,    // 宽高信息
                size: 1,        // 图片质量
                outputType: 'jpeg', // 输出格式
                canScale: true,    // 底图是否缩放
                autoCrop: true,     // 自动截图框
                // 只有自动截图开启 宽度高度才生效
//                autoCropWidth: 300,
//                autoCropHeight: 300,
                // 开启宽度和高度比例
                fixed: true,
                fixedNumber: [1, 1],
                full: false

            }
        }
    },
    methods: {
        clickUpload() {
            this.$refs.input.click()
        },
        uploadImg(e) {     //  图片上传逻辑
            this.resultURL = ''
            this.isUpload = false

            var file = e.target.files[0]
            if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
                alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                return false
            }
            this.reader = new FileReader()
            this.reader.onload = (e) => {
                this.example2.img = e.target.result
                this.$refs.cropper.startCrop()
            }
            this.reader.readAsDataURL(file)

        },
        finish(type, picSelect) {
            //  生成图片
            this.$refs.cropper.getCropData((data) => {
                this.resultURL = data
                sessionStorage.setItem('user_pic', data);
            })
            this.$refs.cropper.stopCrop()
            if (!this.reader) {
                return this.$message({
                    showClose:true,
                    type:'warning',
                    message:'请上传一张新图',
                    duration:this.$globalConfig.elementUI.duration
                })
            }
            this.isUpload = !this.isUpload;
            this.resultURL = this.reader.result;
            this.updataPicVisible = !this.updataPicVisible;

            //根据传进来的参数来判断
            if (true) {
                let imgParams = {
                    "appId": this.$globalConfig.appId.appId
                };
                getUploadToken(imgParams).then((res) => {
                        let files = sessionStorage.getItem('user_pic').split(",").splice(1, 1)[0];
                        const {data} = res;
                        // console.warn(data,files);
                        // console.log(data, 'res')
                        // console.log(files,'filesfilesfiles')
                        upDetailImg(files, {
                            headers: {
                                "Content-Type": "application/octet-stream",
                                "Authorization": "UpToken " + data.uptoken
                            },
                        }).then((result) => {
                                // console.log(result, 'result');
                                /*
                                
                                * 后台返回[object Promise]？？？
                                * 泽浩有时间看看吧
                                *
                                */
                                this.imgUrl = this.$globalConfig.qiniu.baseUrl + result.data.key;
                                this.imgKey = (result.data.key);
                                // console.log(this.imgKey, 'this.imgKey');
                                this.$emit('getImg', this.imgKey);
                            }
                            )
                    })
            } else {
                return false;
            }
        },
    },

}
</script>

<style lang="scss">
.update-pic,
.min360 {
    width: 360px; // height: 490px;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    .el-dialog__header {
        height: 64px;
        border-radius: 12px 12px 0 0;
        background-color: #262f3b;
        padding: 0;
        .el-dialog__title {
            width: 80px;
            height: 26px;
            padding-left: 40px;
            padding-top: 18px;
            display: inline-block;
            font-size: 20px;
            color: #fff;
            text-align: center;
        }
        .el-dialog__headerbtn {
            padding: 8px;
            box-sizing: border-box;
        }
    }
    .el-dialog__body {
        padding: 30px;
        .user-info {
            .cropper {
                height: 280px;
                height: 280px;
                border-radius: 50%;
                margin: 0 auto;
                img {
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                }
                .file {
                    position: relative;
                    display: inline-block;
                    background: #D0EEFF;
                    border: 1px solid #99D3F5;
                    border-radius: 4px;
                    padding: 4px 12px;
                    overflow: hidden;
                    color: #1E88C7;
                    text-decoration: none;
                    text-indent: 0;
                    line-height: 20px;
                }
                .file input {
                    position: absolute;
                    font-size: 100px;
                    right: 0;
                    top: 0;
                    opacity: 0;
                }
                .file:hover {
                    background: #AADFFD;
                    border-color: #78C3F3;
                    color: #004974;
                    text-decoration: none;
                }
            }
            .view-img {
                width: 280px;
                margin: 0 auto;
                img {
                    width: 280px;
                    height: 280px;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                }
            }
            .upload-btns {
                margin-top: 34px;
                display: flex;
                justify-content: center;
                align-items: center;
                button {
                    &:last-child {
                        margin-left: 20px;
                    }
                }
            }
        }
    }
}
</style>