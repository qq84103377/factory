<template>
    <section class="clothes-file-detail">
        <base-box>
            <content-wrap style="position: relative;" class="content-wrap" title="基本信息">
                <nf-button svg="icon-edit1" @click="editClothes" style="width: 64px;height: 32px;padding: 0;position: absolute;right: 0;top: 0;">编辑</nf-button>
                <span :class="['status-tip',{finish:formData.status==1},{fail:formData.status==2}]"></span>
                <el-form
                        ref="baseInfo"
                        class="detail-form"
                        :model="formData"
                        label-width="100px">
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item class="detail-form__item" label="样衣号:">
                            <span>{{formData.sampleNo}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="样衣名称:">
                            <span>{{formData.sampleName}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="设计款号:">
                            <span>{{formData.designNo}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item class="detail-form__item" label="颜色:">
                            <span>{{formData.colorNo}}-{{formData.colorName}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="尺码:">
                            <span>{{formData.sizeName}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="内长:">
                            <span>{{formData.standardName}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item style="width: auto;" class="detail-form__item" label="样衣图片:">
                            <pic-list :isEdit="false" :fileList="formData.picturePaths"></pic-list>
                        </el-form-item>
                    </el-row>
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item style="width: auto;" class="detail-form__item" label="备注:">
                            <div class="remark" v-if="formData.remark"  v-html="formData.remark"></div>
                            <div v-if="!formData.attachments.length&&!formData.remark" class="">无</div>
                            <!--<div class="clearfix" >-->
                                <attachEdit v-if="formData.attachments.length" style="margin-top: 8px;line-height: 16px !important;" :isShowClose="false" :attachData='formData.attachments'></attachEdit>
                            <!--</div>-->
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap>
            <!-- <content-wrap class="content-wrap" title="其他信息">
                <el-form
                        ref="otherInfo"
                        class="detail-form"
                        :model="formData"
                        label-width="100px">
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item class="detail-form__item" label="版师:">
                            <span v-for="(item,index) in formData.sampleMachinists">{{(index!=0?'/':'')+item.machinistName}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="样衣师:">
                            <span v-for="(item,index) in formData.sampleDesigners">{{(index!=0?'/':'')+item.designerName}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row class="detail-form__row" type="flex">
                        <el-form-item class="detail-form__item" label="工作系数:">
                            <span>{{formData.workingCoefficient}}</span>
                        </el-form-item>
                        <el-form-item class="detail-form__item" label="样衣工时:">
                            <span>{{formData.sampleManHour}}</span>
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap> -->
        </base-box>


        <transition name="right-move">
            <add-clothes :artData='formData' :isShow="isShow" @toggle="changeArtList" v-show="isShow"></add-clothes>
        </transition>
        <transition name="opcity">
            <div class="cover" v-show="isShow" @click="isShow = false">
            </div>
        </transition>
    </section>
</template>

<script>
    import {sampleDetail} from '@/api/api'
    import picList from '../designFileInfo/pic-list'
    import addClothes from './addClothes'
    import attachEdit from '../../goods/child/attachEdit'

    export default {
        name: "design-file-detail",
        data(){
            return{
                isShow: false,
                formData:{
                    attachments:[]
                },
                createPic: [require('../../../assets/images/girl.jpg'),require('../../../assets/images/background.jpg')],
            }
        },
        components:{picList, addClothes, attachEdit},
        created(){
            this.getDetail()
        },
        methods:{
            //编辑
            editClothes(){
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.process.edit")){
                    return
                }
                this.isShow = true
            },
            changeArtList(v) {
                //清除isEdit的值 防止侧滑窗再次打开
                if(this.$route.query.isEdit){
                    let query = {...this.$route.query,isEdit:''}
                    this.$router.replace({path:'/designFile/clothesDetail',query})
                }
                if(v){
                    this.getDetail()
                }
                this.isShow = !this.isShow;
            },
            getDetail(){
                const params = {
                    id: this.$route.query.id
                };
                if (this.$route.query.missionPrcdNodeId) {
                    // 从节点详情进来查看详情
                    params.missionNodeId = this.$route.query.missionPrcdNodeId;
                    params.userId = JSON.parse(sessionStorage.getItem('user_login')).userId;
                }
                sampleDetail(params).then(res => {
                    console.log(res.data,'样衣档案详情');
                    this.formData = res.data.data;
                    this.$nextTick(() => {
                        if (this.$route.query.isEdit) {
                            // 从节点详情进来编辑
                            this.isShow = true;
                        }
                    });
                })
            }
        }
    }
</script>
<style lang="scss">
    .clothes-file-detail{
        .remark{
            img{
                max-width: 750px;
            }
        }
    }

</style>
<style lang="scss" scoped>
    .clothes-file-detail{
        .remark{
            line-height: 16px;
            padding: 10px;
            border: 1px solid #eee;
            &.remark-none{
                padding: 0;
                border: none;
            }
        }
        .status-tip{
            position: absolute;
            width: 116px;
            height: 65px;
            background: url("../../../assets/images/dbz.png") no-repeat;
            right: 30px;
            top: 44px;
            background-size: 100% 100%;
            &.finish{
                background: url("../../../assets/images/ycx.png") no-repeat;
                background-size: 100% 100%;
            }
            &.fail{
                background: url("../../../assets/images/yzf.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        .content-wrap{
            margin-bottom: 24px;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .detail-form__row {
            margin-left: -20px;
            .detail-form__item {
                width: 30%;
                margin-right: 32px;
                margin-bottom: 0 !important;
            }
            &:last-child .detail-form__item {
                margin-bottom: 0
            }
            .detail-form__edit-btn {
                text-decoration: underline;
                color: #1CA1FF;
            }
        }
        .pic-item{
            width: 80px;
            height: 80px;
            margin-right: 8px;
            padding-top: 11px;
        }

        .right-move-enter-active,
        .right-move-leave-active {
            transition: all 0.3s ease;
            transform: translateX(0);
        }

        .right-move-enter,
        .right-move-leave-to {
            transform: translateX(100%);
        }

        .opcity-enter-active,
        .opcity-leave-active {
            transition: all 0.5s ease;
            opacity: 0.5;
        }

        .opcity-enter,
        .opcity-leave-to {
            opacity: 0;
        }

        .cover {
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: #000;
            opacity: 0.5;
            top: 0;
            left: 0;
            z-index: 1;
        }
    }
</style>