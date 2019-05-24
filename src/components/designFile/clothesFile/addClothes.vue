<template>
    <div class="add-clothes">
        <header class="header">
            <span>{{artData.sampleId?'编辑':'新建'}}样衣档案</span>
            <span class="header_right">
                <nf-button style="width: 98px;" @click="handleClick">取消</nf-button>
                <nf-button style="width: 98px;" :loading="btnLoading" @click="updateCommonProcessForm" type="warning">完成</nf-button>
            </span>
        </header>
        <section>
            <div class="artorders">
                <content-wrap style="position: relative;" title="基本信息">
                    <div class="arr-artorder">
                        <div class="header-artorder">
                            <div class="header-artorder-right">
                                <el-form :label-position="labelPosition" label-width="100px" :model="formData"
                                         :rules="rules" ref='baseForm'>
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item label="样衣号" prop="name">
                                            <el-input :maxlength="20" placeholder="不填则系统自动生成"
                                                      v-model.trim="formData.sampleNo" @blur="checkRepeat"></el-input>
                                        </el-form-item>
                                        <el-form-item class="detail-form__item" label="样衣名称">
                                            <el-input :maxlength="30" placeholder="请输入样衣名称"
                                                      v-model.trim="formData.sampleName"></el-input>
                                        </el-form-item>
                                        <el-form-item label="设计款号" prop="name">
                                            <el-input disabled v-model.trim="formData.designNo"></el-input>
                                        </el-form-item>
                                    </el-row>
                                    <!-- <el-row class="detail-form__row" type="flex">
                                        
                                        <el-form-item class="detail-form__item" label="样衣状态">
                                            <el-select disabled v-model="formData.status" placeholder="请选择">
                                                <el-option
                                                        v-for="item in options"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-row> -->
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item class="detail-form__item" label="颜色">
                                            <colorSelectGroup :SingleElection="true" v-model="formData.colorId" :groupData="colors"></colorSelectGroup>

                                            <!--<el-select class="colortri" v-model="formData.colorId"-->
                                                       <!--filterable placeholder="请选择颜色">-->
                                                <!--&lt;!&ndash;<template>&ndash;&gt;-->
                                                <!--&lt;!&ndash;<el-option :value="''" disabled style="cursor:pointer;">&ndash;&gt;-->
                                                <!--&lt;!&ndash;<span class="new_set" @click="newColor">新建</span>&ndash;&gt;-->
                                                <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
                                                <!--&lt;!&ndash;</template>&ndash;&gt;-->
                                                <!--<el-option v-for="item in colors" :key="item.id"-->
                                                           <!--:label="item.value+'-'+item.name"-->
                                                           <!--:value="item.id">-->
                                                <!--</el-option>-->
                                            <!--</el-select>-->
                                        </el-form-item>
                                        <el-form-item class="detail-form__item" label="内长">
                                            <el-select v-model="formData.standardId" filterable
                                                       placeholder="请选择内长">
                                                <!--<template>-->
                                                <!--<el-option :value="''" disabled style="cursor:pointer;">-->
                                                <!--<span class="new_set" @click="newLength">新建</span>-->
                                                <!--</el-option>-->
                                                <!--</template>-->
                                                <el-option v-for="item in lengths" :key="item.id" :label="item.name"
                                                           :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item class="detail-form__item" label="尺码">
                                            <size-select :toggle="isShow" :selectedSizes="artData.sampleId?[{id:artData.sizeId}]:[]" @sizeArr="getSizeId"
                                                         @select="v => {formData.sizeId = v[0]||''}" :multiple="false"
                                                         ref="selectSize"></size-select>
                                        </el-form-item>
                                    </el-row>
                                    <!-- <el-row class="detail-form__row" type="flex">
                                        <el-form-item class="detail-form__item" label="尺码">
                                            <size-select :toggle="isShow" :selectedSizes="artData.sampleId?[{id:artData.sizeId}]:[]" @sizeArr="getSizeId"
                                                         @select="v => {formData.sizeId = v[0]||''}" :multiple="false"
                                                         ref="selectSize"></size-select>
                                        </el-form-item>
                                    </el-row> -->
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item style="width: auto" class="detail-form__item" label="样衣图片">
                                            <input type="file" style="display: none;" id="file-upload1"
                                                   accept="image/png,image/jpeg,image/jpg,image/gif" multiple
                                                   @change="imgUpload">
                                            <label class="upload-file" for="file-upload1">添加图片</label>
                                            <span style="font-size: 12px;color: #A2ABB8">只能上传 jpg/png 文件，且不超过 5m</span>
                                            <pic-list :fileList="formData.picturePaths"></pic-list>
                                        </el-form-item>
                                    </el-row>
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item style="width: auto" class="detail-form__item" label="备注">
                                            <UE :defaultMsg='defaultMsg' :config=config id="addClothesUe" ref="ueRefAddClothes"></UE>
                                            <!-- <div>
                                                <attachEdit :showDiffBtn="true" @attachD='attachList'
                                                            :attachData='formData.attachments'></attachEdit>
                                            </div> -->
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </content-wrap>
                <!-- <content-wrap style="position: relative;" title="其他信息">
                    <div class="arr-artorder">
                        <div class="header-artorder">
                            <div class="header-artorder-right">
                                <el-form :label-position="labelPosition" label-width="100px" :model="formData"
                                         :rules="rules" ref='otherForm'>
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item label="版师">
                                            <el-select v-model="formData.sampleMachinistIds" multiple
                                                       filterable placeholder="请选择版师">
                                                <el-option
                                                        v-for="item in userList"
                                                        :key="item.id"
                                                        :label="item.userName"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item class="detail-form__item" label="样衣师">
                                            <el-select v-model="formData.sampleDesignerIds" multiple
                                                       filterable placeholder="请选择样衣师">
                                                <el-option
                                                        v-for="item in userList"
                                                        :key="item.id"
                                                        :label="item.userName"
                                                        :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-row>
                                    <el-row class="detail-form__row" type="flex">
                                        <el-form-item label="工作系数">
                                            <el-input type="number" placeholder="请输入"
                                                      v-model.number="formData.workingCoefficient"></el-input>
                                        </el-form-item>
                                        <el-form-item class="detail-form__item" label="样衣工时">
                                            <el-input type="number" placeholder="请输入"
                                                      v-model.number="formData.sampleManHour">
                                                <template slot="append">(小时)</template>
                                            </el-input>
                                        </el-form-item>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </content-wrap> -->
            </div>
        </section>
    </div>
</template>
<script>
    const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
    import md5 from "js-md5";
    import picList from '../designFileInfo/pic-list'
    import sizeSelect from '../../../components/Common/size-select'
    import UE from "../../../components/ue/ue";
    import attachEdit from "@/components/goods/child/attachEdit";
    import {mapState} from "vuex";
    import {
        sampleIsExist,
        sampleUpdate,
        sampleCreate,
        designstyleFormUser,
        getUploadToken,
        addFacGoodsStyle,
        upDetailImgs,
        addFacUnitSettings,
        deleteFacUnitSettings,
        getFacUnitSettings,
        selectFacCommonSettings,
        checkFacGoodsStyle,
        selectDifSettings,
        sampleDetail
    } from "../../../api/api";

    export default {
        props: ["artData",'isShow','designStyleId', 'sampleId','designNo'],
        data() {
            return {
                btnLoading: false,
                // clothesPic: [],
                lengths: [],
                colors: [],
                options: [
                    {label: '打版中', value: 0},
                    {label: '已成型', value: 1},
                    {label: '已作废', value: 2},
                ],
                userList: [],
                labelPosition: "right",
                rules: {
                    // colorId: [
                    //     {
                    //         required: true,
                    //         message: '请选择颜色'
                    //     }
                    // ],
                    // sizeId: [
                    //     {
                    //         required: true,
                    //         message: "请选择尺码",
                    //     }
                    // ]
                },
                config: {
                    initialFrameWidth: null,
                    initialFrameHeight: 150,
                    zIndex: 1
                },
                defaultMsg: "",
                formData: {
                    attachments: [],
                    designId: this.$route.query.designStyleId || this.designStyleId, //设计档案ID
                    sampleNo: '', //样衣号
                    sampleName: '', //样衣名称
                    designNo: '', //设计款号
                    status: 0, //样衣状态
                    colorId: '',
                    standardId: '',
                    sizeId: '',
                    picturePaths: [],
                    content: "",
                    fileAttachments: [], //附件
                    sampleDesignerIds: [], // 样衣师
                    sampleMachinistIds: [], //版师
                    workingCoefficient: '', //工作系数
                    sampleManHour: '', //工时
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    targetStyleType: 0 //固定传值
                },
                attachFlag: false, //编辑时是否有上传过附件
                isRepeat: false //样衣号是否重复
            };
        },
        components: {
            UE,
            attachEdit,
            sizeSelect,
            picList
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            ...mapState(['designStyleNo']),
        },
        watch: {
            formData(v){
                console.log(v);
                if(this.designNo) {
                    this.formData.designNo = this.designNo
                    console.log(this.designNo,'designNo')
                } else {
                    this.formData.designNo = this.$store.state.DesignFile.designStyleNo || sessionStorage.getItem("setDesignStyleNo")
                }
            },
            isShow(v){
                if(v){
                    if (this.artData.sampleId) {
                        console.log(this.artData.sampleId,'this.artData.sampleId')
                        console.log(this.artData,'this.artData')
                        //编辑
                        // this.formData = JSON.parse(JSON.stringify(this.artData))
                        for(let k in this.artData){
                            this.formData[k] = JSON.parse(JSON.stringify(this.artData[k]))
                        }
                        this.formData.sampleDesignerIds = this.artData.sampleDesigners.map(item => {
                            return item.designerId
                        })
                        this.formData.sampleMachinistIds = this.artData.sampleMachinists.map(item => {
                            return item.machinistId
                        })
                        this.$refs.ueRefAddClothes.setUEContent(this.artData.remark||'')
                        console.log(this.formData,'展开');
                    }
                }else{
                    this.resetForm()
                }
            }
        },
        created() {
            if(this.designNo) {
                this.formData.designNo = this.designNo
                console.log(this.designNo,'designNo777')
            } else {
                this.formData.designNo = this.$store.state.DesignFile.designStyleNo || sessionStorage.getItem("setDesignStyleNo")
            }
            this.getSetting()
            this.getUserList()

        },
        mounted(){
            if (this.sampleId){
                this.sampleDetail()
            }
        },
        methods: {
            //检查数据是否有更改
            checkIsChange(){
                this.formData.content = this.$refs.ueRefAddClothes.getUEContent();
                let value = false
                if(!this.artData.sampleId){
                    //新建样衣时因为设计款号必定有值所以必定修改
                    value = true
                }else {
                    for(let k in this.artData){
                        if(k==='sampleDesigners'){
                            if(JSON.stringify(this.formData.sampleDesignerIds)!==JSON.stringify(this.artData.sampleDesigners.map(item => {
                                return item.designerId
                            }))){
                                value = true
                            }
                        }else if(k==='sampleMachinistIds'){
                            if(JSON.stringify(this.formData.sampleMachinistIds)!==JSON.stringify(this.artData.sampleMachinists.map(item => {
                                return item.machinistId
                            }))){
                                value = true
                            }
                        }else if(k==='remark'){
                            if((this.formData[k] || this.artData[k])&&(this.artData.remark!==this.formData.content)){
                                value = true
                            }
                        }else{
                            // (this.formData[k] || this.artData[k])是为了保证前后台存的格式不一样造成的不匹配 如sizeId一个是空一个是null
                            //数据处理。因为匹配的数据前台的可能是空数组但是后台的有时候是null 和空数组所以统一转null
                            let formData = JSON.parse(JSON.stringify(this.formData));
                            let artData = JSON.parse(JSON.stringify(this.artData));
                            for (let k in formData){
                                if(formData[k]instanceof Array && !formData[k].length){
                                    formData[k] = null;
                                }
                            }

                            for (let k in artData){
                                if(artData[k]instanceof Array && !artData[k].length){
                                    artData[k] = null;
                                }
                            }
                            if((formData[k] || artData[k]) && JSON.stringify(formData[k])!==JSON.stringify(artData[k])){
                                value = true
                            }
                        }
                    }


                }
                return value
            },
            // 获取样衣详情
            sampleDetail () {

                sampleDetail({id: this.sampleId}).then(res => {
                    this.artData = res.data.data
                    this.$emit('update:artData',res.data.data)
                    for(let k in this.artData){
                        this.formData[k] = JSON.parse(JSON.stringify(this.artData[k]))
                    }
                    this.formData.sampleDesignerIds = this.artData.sampleDesigners.map(item => {
                        return item.designerId
                    })
                    this.formData.sampleMachinistIds = this.artData.sampleMachinists.map(item => {
                        return item.machinistId
                    })
                    this.$refs.ueRefAddClothes.setUEContent(this.artData.remark||'')
                })
            },
            //关闭时清空表单已选择的
            resetForm(){
                this.formData = {
                    designId: this.$route.query.designStyleId, //设计档案ID
                    sampleNo: '', //样衣号
                    sampleName: '', //样衣名称
                    designNo: '', //设计款号
                    status: 0, //样衣状态
                    colorId: '',
                    standardId: '',
                    sizeId: '',
                    picturePaths: [],
                    content: "",
                    fileAttachments: [], //附件
                    sampleDesignerIds: [], // 样衣师
                    sampleMachinistIds: [], //版师
                    workingCoefficient: '', //工作系数
                    sampleManHour: '', //工时
                    unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    targetStyleType: 0 //固定传值
                }
                this.$refs.selectSize.resetFields()
                this.$refs.ueRefAddClothes.setUEContent('')
                this.$refs['baseForm'].resetFields()
            },
            //查重
            checkRepeat(){
                if((this.formData.sampleNo == this.artData.sampleNo) || (this.formData.sampleNo == '')){
                    this.isRepeat = false
                    return
                }
                //styleId=设计档案的id&sampleNo=样衣号
                sampleIsExist({styleId:this.$route.query.designStyleId,sampleNo:this.formData.sampleNo}).then(res => {
                    console.log(res.data);
                    if(res.data.code==0){
                        this.isRepeat = false
                    }else{
                        this.isRepeat = true
                        this.$message.error(res.data.msg)
                    }
                })
            },
            getSizeId(v) {
                console.log(v);
                this.formData.sizeId = v[0] || ''
            },
            //图片上传逻辑
            async imgUpload(e) {
                let params = {
                    appId: this.$globalConfig.appId.appId
                };
                const file = e.target.files;
                console.log(file);
                for (let i = 0; i < file.length; i++) {
                    if (file[i].size > 5000000) {
                        this.$message({
                            showClose: true,
                            message: "图片大小超过5M!,重新上传",
                            type: "error",
                        });
                        return false;
                    }
                    await getUploadToken(params).then(res => {
                        // this.img_name.token = res.data.uptoken;
                        var params2 = new FormData();
                        params2.append("file", file[i]);
                        params2.append("token", res.data.uptoken);
                        params2.append("key", this.setImgKey(file[i].name));
                        upDetailImgs(params2, {}).then(result => {
                            const _imgUrl =
                                this.$globalConfig.qiniu.baseUrl + result.data.key;
                            this.formData.picturePaths.push(_imgUrl)
                        });
                    });
                }
            },
            //md5图片上传Key的拼接
            setImgKey(name) {
                const storeId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
                const date = +new Date() + "";
                return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
            },
            getSetting() {
                let params = {
                    facId:
                    this.facIds || JSON.parse(sessionStorage.getItem("last_login")).id,
                    token: "",
                    type: "all"
                };
                getFacUnitSettings(params).then(res => {
                    // console.log(res.data, '新建样衣下拉');
                    this.colors = res.data.data.color
                    this.lengths = res.data.data.length
                })
            },
            handleClick() {
                this.$emit("toggle");
            },
            attachList(list) {
                this.attachFlag = true
                console.warn(list);
                this.formData.fileAttachments = list;
            },
          async  updateCommonProcessForm() {
                let flag = false;
                if(this.isRepeat){
                    this.$message.error('样衣号已经存在')
                    return
                }

                this.formData.content = this.$refs.ueRefAddClothes.getUEContent();
                if (this.$route.query.missionPrcdNodeId) {
                     this.formData.missionNodeId = this.$route.query.missionPrcdNodeId;
                }
                this.btnLoading = true
                if(this.artData.sampleId){
                    //编辑
                    if(!this.attachFlag){
                        this.formData.fileAttachments = this.formData.attachments
                    }
                    this.formData.id = this.artData.sampleId
                    console.log(this.formData, '参数');
                    await sampleUpdate(this.formData).then(res => {
                        this.btnLoading = false
                        console.log(res);
                        if (res.data.code == 0) {
                            flag = true
                            this.$message.success('编辑成功')
                            this.$emit("toggle", true);
                        } else {
                            this.$message.error(res.data.msg)
                            return false
                        }
                    });
                }else {

                  await  sampleCreate(this.formData).then(res => {
                        this.btnLoading = false
                        console.log(res);
                        if (res.data.code == 0) {
                            flag = true
                            this.$message.success('新建成功')
                            this.$emit("toggle", true);
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    });
                }
                return flag;

            },
            //获取版师和样衣师下拉列表
            getUserList() {
                let params = {
                    unitId: this.unitId,
                    userId: this.userId
                }
                designstyleFormUser(params).then(res => {
                    // console.log(res.data, '样衣师下拉');
                    this.userList = res.data.data
                })
            },
        }
    };
</script>
<style lang="scss">
    .add-clothes {
        .el-select {
            display: block !important;
        }
    }
</style>
<style lang="scss" scoped>
    @import "~scss_vars";

    .upload-file {
        width: 64px;
        line-height: 28px;
        background: #1CA1FF;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        margin-bottom: 8px;
    }

    .nf-input {
        display: inline-block;
        width: auto;
    }

    .w100 {
        width: 80px;
    }

    .w140 {
        width: 156px;
    }

    .add-clothes {
        position: fixed;
        top: 0;
        right: 0;
        // padding-top: 24px;
        padding-bottom: 200px;
        width: 1200px !important;
        height: 100%;
        overflow-y: scroll;
        background-color: #fff;
        z-index: 101;
        .header {
            position: fixed;
            // top: 64px;
            width: 1200px;
            height: 72px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 20;
        }
        .artorders {
            font-size: 14px;
            padding: 96px 24px 24px;
            .btn-artadd {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 18px;
                font-size: 14px;
            }
            .header-artorder {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                .header-artorder-right {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    .el-form {
                        width: 100%;
                        .detail-form__row {
                            margin-left: -20px;
                            width: 100%;
                            .el-form-item {
                                width: 50%;
                            }
                        }
                    }
                }
            }
        }
        .repertory_dialog {
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
            }
            .title {
                width: 100%;
                height: 52px;
                text-align: center;
                line-height: 52px;
                font-size: 20px;
                color: #3b3b3b;
                border-bottom: 1px solid #e0e6ed;
            }
            .footer {
                padding: 0 32px 32px 36px;
                button {
                    margin: 0 6px;
                }
            }
        }
        .repertory_dialog--dele {
            .el-dialog {
                width: 766px;
            }
            .body {
                text-align: center;
                P {
                    margin: 32px 0;
                    font-size: 14px;
                    color: #3b3b3b;
                }
            }
            .footer {
                display: flex;
                justify-content: center;
                padding-top: 28px;
                border-top: 1px solid #e0e6ed;
            }
        }
    }
</style>





