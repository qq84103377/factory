<template>
    <div class="boss-reg">
        <el-dialog custom-class="min360" title="创建工厂" :visible="true" top=204px>
            <div class="user-info">
                <div class="set-content">
                    <div class="set-content-left">
                        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <button v-else class="el-icon-plus avatar-uploader-icon"></button>
                        </el-upload>
                    </div>
                    <div class="set-content-right">
    
                    </div>
                </div>
                <p>
                    <button class="update-btn">创建工厂</button>
                </p>
            </div>
    
        </el-dialog>
    
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    data() {
        return {
            imageUrl: ''
        };
    },
    methods: {
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~scss_vars';

.boss-reg .min360 {
    width: 760px;
    height: 490px;
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
        padding: 0;
        .user-info {
            padding-left: 40px;
            padding-right: 40px;
            .pic {
                width: 280px;
                height: 280px;
                background-color: #d8d8d8;
                border: 1px solid #979797;
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center; // padding: 15px;
                opacity: 1;
                background: url("../../assets/images/girl.jpg") center center no-repeat;
                background-size: cover;
                position: relative;
                .pic-circle1 {
                    border-radius: 50%;

                    width: 100%;
                    height: 100%;
                    background-color: #000;
                    opacity: 0.4;
                    z-index: 2;
                }
            }
            p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 0;
                .update-btn,
                .sava-btn {
                    margin-top: 34px;
                    border: none;
                    outline: none;
                    width: 110px;
                    height: 38px;
                    border-radius: 100px;
                    background-color: $color-btn;
                    font-family: PingFangSC;
                    font-size: 14px;
                    text-align: center;
                    color: #ffffff;
                    box-sizing: border-box;
                }
            }
        }
    }
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>





