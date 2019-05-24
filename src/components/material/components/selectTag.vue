<template>
    <div class="select-tag">
        <el-dropdown trigger="click" @visible-change="visibleChange">
            <span class="el-dropdown-link tag-title">
                选择标签
            </span>
            <el-dropdown-menu slot="dropdown" class="tag-list">
                <el-dropdown-item class="add-text" @click.native="add">+新建标签</el-dropdown-item>
                <el-dropdown-item divided v-for="(item,index) in tagList" :key="index" @click.native="select(item)">{{item.name}}<i v-if="item.use" class="el-icon-check" style="float: right;margin-top: 10px;color:#FFA914;"></i></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!--新建弹窗-->
        <el-dialog title="新建标签" :visible.sync="addShow" class="custom-dialog" size = "tiny" :modal-append-to-body="false">
            <el-form label-width="70px" :rules="rules" ref="form">
                <el-form-item label="标签名称" required :error="errorText">
                    <el-input v-model="tagName" placeholder="请输入标签名称" :maxlength="20"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button  type="primary" @click="confirm">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {addBillLabel} from '@/api'
    export default {
        props: ['selectTagList', 'tagList', 'orderId', 'materialSkuId'],
        /*
        selectTagList： 选中的标签
        tagList：标签列表数据
        orderId：当前行的单据id
        materialSkuId： 当前行的物料id
        * */
        data () {
            return {
                isShow: true,
                addShow: false,
                tagName: '',
                errorText: ''
            }
        },
        watch:{
            tagName (val) {
                if(val) {
                    this.errorText = ''
                }
            },
            selectTagList: {
                handler(val) {
                    this.getSelectTag(val)
                },
                deep: true
            }
        },
        computed:{
            userId(){
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
        },
        methods:{
            // 下拉显示
            visibleChange(val) {
                if(val) {
                    // this.isShow = false
                    // return this.$message.error('你没有权限操作')
                    this.getSelectTag(this.selectTagList)
                }
            },
            getSelectTag(val) {
                if (val.length) {
                    for (let item of this.tagList) {
                        let tagItem = val.find(v => v.commonBillLabelId == item.id)
                        this.$nextTick(() => {
                            if (tagItem) {
                                this.$set(item, 'use', true)
                            } else {
                                this.$set(item, 'use', false)
                            }
                        })
                    }
                } else {
                    this.tagList.forEach(i => {
                        this.$set(i, 'use', false)
                    })
                }
            },
            // 新建标签
            add() {
                // 权限
                if((!this.powerJudgement.permissions("fac.defectiveLabel.queryAllDefectiveLabel"))){
                    return
                }
                this.addShow = true
            },
            // 确定
            confirm() {
                if(!this.tagName) {
                    this.errorText = '标签名称不能为空!'
                    return
                }
                if(this.tagName.length>20){
                    this.$message.error('标签名称不能超过20个字符')
                    return
                }
                let params = {
                    userId:this.userId,
                    label:this.tagName
                }
                addBillLabel(params).then(res=> {
                    if (res.data.code === 0) {
                        this.$message.success('新建成功')
                        this.tagName = ''
                        this.addShow = false
                        this.$emit('addSuccess')
                    } else if (res.data.code === 1){
                        this.errorText = res.data.msg

                    } else {
                        this.$message.error('新建失败')
                    }
                })
            },
            cancel() {
                this.addShow = false
                this.tagName = ''
                this.errorText = ''

            },
            // 选择
            select(item) {
                // 权限
                if((!this.powerJudgement.permissions("fac.defectiveLabel.queryAllDefectiveLabel"))){
                    return
                }
                this.$set(item, 'use', !item.use)
                // let arr = this.tagList.filter(v => v.use)
                let arr = this.tagList.filter(v => v.use)
                let arr1 = arr.map(v => {
                    return {
                        commonBillLabelId: v.id,
                        sort: v.sort
                    }
                })
                this.$emit('selectItem',arr1, this.orderId, this.materialSkuId)
            }
        }
    }
</script>
<style lang="scss">
    .select-tag{
        /*height: 26px;*/
        .el-dropdown{
            line-height: 26px;
            font-size:12px;
        }
        .tag-title{
            cursor: pointer;
            font-size:12px;
            line-height: 26px;
            color:#FFA914;
            text-decoration: underline;
            position:relative;
        }
        .error-tip{
            .el-input__inner{
                border-color:#FA4150;
            }
        }
    }
    .tag-list{
        position:absolute;
        padding:0;
        max-height: 264px;
        overflow-y: auto;
        .el-dropdown-menu__item--divided{
            margin-top:0 !important;
        }
        .el-dropdown-menu__item--divided:before{
            height: 0 !important;
        }
        .el-dropdown-menu__item{
            line-height: 32px !important;
            font-size:12px;
        }
        .add-text{
            color:#FFA914;
        }
    }
    .tag-list::-webkit-scrollbar{
        width:6px;
        height:4px;
    }
    .tag-list::-webkit-scrollbar-track{
        /*background: rgba(151, 168, 190, .3);*/
        border-radius:6px;
    }
    .tag-list::-webkit-scrollbar-thumb{
        display: block;
        width: 0;
        height: 0;
        cursor: pointer;
        border-radius: 3px;
        background-color: rgba(151, 168, 190, .3);
        transition: .3s background-color;
    }
    .tag-list::-webkit-scrollbar-thumb:hover{
        background: #747474;
    }
    .tag-list::-webkit-scrollbar-corner{
        background: #f6f6f6;
    }
</style>