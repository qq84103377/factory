<template>
    <section class="template-design-create">
        <div style="display: flex;align-items: center;height: 72px;padding: 0 24px;border-bottom: 1px solid #E6EAF0;">
            <page-title style="width: 100%;padding-bottom: 0;" :title="(editId?'编辑':'新建')+'工序模板'">
                <nf-button @click="$emit('toggle')">取消</nf-button>
                <nf-button type="warning" :loading="visible.btnLoading" @click="submit">确定</nf-button>
            </page-title>
        </div>
        <base-box style="padding: 24px;box-shadow: none">
            <!-- 基本信息 -->
            <content-wrap class="create-form-wrapper" title="基本信息" type="big">
                <el-form class="create-form" ref="create-form" :model="formData" :rules="rules" label-width="100px">
                    <el-row type="flex">
                        <el-form-item class="create-form__item" label="工序名称" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入工序名称"></el-input>
                        </el-form-item>
                        <el-form-item class="create-form__item" label="默认负责人" prop="checkChargerIds">
                            <el-select v-model="formData.checkChargerIds" filterable multiple placeholder="请选择负责人">
                                <el-option
                                        v-for="item in options.userOptions"
                                        :key="item.id"
                                        :label="item.userName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>
                </el-form>
            </content-wrap>
            <!-- 节点类型 -->
            <content-wrap class="flow" title="工序流程" type="big">
                <el-form class="create-form" ref="procedure-form" :model="formData" :rules="rules" label-width="100px">
                    <el-form-item class="create-form__item" label="工序模板">
                        <el-select filterable @change="selectTemplate" v-model="formData.templateId" placeholder="请在现有工序模板中选择">
                            <el-option
                                    v-for="item in templateList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <create-table
                        ref="template-create-table"
                        :options="templateItem"
                        :nodeList="nodeList"
                        :userList="options.userOptions"
                ></create-table>
                <nf-button v-if="editId && $route.query.type!=='goodsSample'" class="delete-btn" @click="handleDeleteClick">删除模板</nf-button>
            </content-wrap>
        </base-box>

        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" class="custom-dialog tip-dialog"
                   :visible.sync="isDeleteVisible" :show-close="false" :close-on-click-modal="false" size="tiny">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="tip-text">是否确认删除该工序模板？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDeleteVisible = false">取 消</el-button>
                <el-button :loading="delLoading" type="primary" @click="delTemplate()">确认</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {
        templateUpdate,
        getPersonList,
        templateCreate,
        getNodeTemplateList,
        getAllNodeList,
        templateDelete,
        costRelationDelete,
        goodsTemplateCreate,
        goodsTemplateUpdate,
        goodsTemplateDetail,
        goodsTemplateDelete,
        templateEdit
    } from '@/api';
    import {addDesignTemplate, getDesignNodeList} from '@/api/sample-centre';
    import createTable from './create-table';

    export default {
        props: {
            detailFrom: {
                type: String,
                default: ''
            },
            form: {
                type: String,
                default: ''
            },
            editId: {
                type: String,
                default: ''
            },
            designStyleId: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        components: {
            createTable
        },
        watch: {
            show(v) {
                if(v){
                    if(this.editId){
                        this.formData.templateId = ''
                        // templateEdit({id: this.editId}).then(res => {
                        //     console.log(res.data, '编辑准备数据');
                        //     this.formData.name = res.data.data.name
                        //     this.formData.version = res.data.data.version
                        //     this.formData.checkChargerIds = res.data.data.checkChargerIds
                        //     this.templateItem = {nodes: JSON.parse(JSON.stringify(res.data.data.prcdNodes))}
                        // })
                        this.templateEdit()
                    }
                }else {
                    if(!this.editId){
                        this.resetForm()
                    }
                }
            }
        },
        data() {
            return {
                formDataNameFir:'',
                formDataChargerIdsFir:[],
                templateItemDataFir:[],
                delLoading: false,
                isDeleteVisible: false, //删除弹窗
                nodeList: [], //所有节点列表
                templateItem: {}, //选中的工序模板
                templateList: [], //工序模板下拉
                visible: {
                    btnLoading: false
                },
                formData: {
                    designStyleId: this.$route.query.designStyleId || this.designStyleId,
                    styleId: this.$route.query.styleId || '',
                    name: '',
                    checkChargerIds: [],
                    templateId: '',
                    prcdNodes: []
                },
                options: {
                    userOptions: [],
                    // nodeOptions: []
                },
                rules: {
                    name: [
                        {
                            required: true, message: '请输入工序名称',
                        }
                    ],
                    checkChargerIds: [
                        {
                            required: true, message: '请选择默认负责人',
                        }
                    ],
                }
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            }
        },
        created() {
            this.getTemplateList()
            // this.fetchNodeList();
            this.fetchUserList();
            this.getAllNode()
            if (this.editId) {
                this.templateEdit()
            }
            if (this.detailFrom==='goods') {
                this.formData.styleId = this.$route.query.id
            }
        },
        methods: {
            //检查数据是否有更改
            checkIsChange(){
                let value = false;
                let prcdNodes = [];
                this.formData.prcdNodes = this.$refs['template-create-table'].getNodeList();
                for(let i=0;i<this.formData.prcdNodes.length;i++){
                    prcdNodes.push({})
                }
                if(!this.editId){
                    //新建
                    if(this.formData.name || this.formData.checkChargerIds.length || this.formData.prcdNodes.length){
                        value = true
                    }
                }else {
                    //编辑|| JSON.stringify(this.formData.prcdNodes)!==JSON.stringify(this.artData.attachments)
                    this.formData.prcdNodes.forEach((item,index)=>{
                        for(let k in item){
                            if(k!=='ailc'){
                                prcdNodes[index][k] = this.templateItemDataFir[index][k]
                            }else {
                                prcdNodes[index][k] = this.formData.prcdNodes[index][k]
                            }
                        }
                    })
                    console.log(this.formData.prcdNodes);
                    console.log(prcdNodes);

                    if((this.formData.name !==this.formDataNameFir) || (JSON.stringify(this.formData.checkChargerIds) !== JSON.stringify(this.formDataChargerIdsFir)) || JSON.stringify(this.formData.prcdNodes)!==JSON.stringify(prcdNodes)){
                        value = true
                    }
                }
                return value
            },
            // 获取列表信息
            templateEdit() {
                let templateEditApi;
                if(this.detailFrom==='goods'){
                    templateEditApi = goodsTemplateDetail
                }else {
                    templateEditApi = templateEdit
                }
                templateEditApi({id: this.editId}).then(res => {
                    console.log(res.data, '编辑准备数据');
                    this.formDataNameFir = res.data.data.name
                    this.formDataChargerIdsFir = JSON.parse(JSON.stringify(res.data.data.checkChargerIds))
                    this.templateItemDataFir = JSON.parse(JSON.stringify(res.data.data.prcdNodes))
                    this.formData.name = res.data.data.name
                    this.formData.version = res.data.data.version
                    this.formData.checkChargerIds = res.data.data.checkChargerIds
                    this.templateItem = {nodes: JSON.parse(JSON.stringify(res.data.data.prcdNodes))}
                })
            },
            //删除模板
            handleDeleteClick(){
                // 权限
                if(!this.powerJudgement.permissions("fac.spl.design.style.template.delete")){
                    return
                }
                this.isDeleteVisible = true;
            },
            //关闭弹窗后清空已选择的数据
            resetForm() {
                this.formData = {
                    designStyleId: this.$route.query.designStyleId || this.designStyleId || '',
                    name: '',
                    checkChargerIds: [],
                    templateId: '',
                    prcdNodes: []
                }
                this.templateItem = {nodes:[]}
                this.$refs['create-form'].resetFields()
            },
            //删除模板
            delTemplate() {
                this.delLoading = true


                if(this.form==='costAccountingDetail'){
                    //成本核算详情过来
                    costRelationDelete({templateId:this.editId,id:this.$route.query.id}).then(res=>{
                        if(res.data.code===0){
                            this.$message.success('删除成功')
                            this.$emit('toggle')
                            this.resetForm()
                        }
                    })
                    return
                }
                //设计档案和商品档案tab栏过来
                let goodsTemplateDeleteApi;
                if(this.detailFrom==='goods'){
                    goodsTemplateDeleteApi = goodsTemplateDelete
                }else {
                    goodsTemplateDeleteApi = templateDelete
                }
                goodsTemplateDeleteApi({id: this.editId}).then(res => {
                    this.delLoading = false
                    this.isDeleteVisible = false
                    if (res.data.code == 0) {
                        this.$message.success('删除成功')
                        this.$emit('toggle')
                        this.resetForm()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            getAllNode() {
                getAllNodeList({unitId: this.unitId}).then(res => {
                    console.log(res.data, '所有节点');
                    this.nodeList = res.data.prcdNodes
                })
            },
            //选择对应的工序模板
            selectTemplate(v) {
                this.templateItem = this.templateList.find(item => {
                    return item.id == v
                })
                //默认负责人要根据选中的模板变化
                if(this.templateItem){
                    this.formData.checkChargerIds = this.templateItem.chargers.map(item => {
                        return item.id
                    })
                }else {
                    this.templateItem = {nodes:[]}
                }
            },
            // 获取工序模板下拉列表
            getTemplateList() {
                getNodeTemplateList({unitId: this.unitId}).then(res => {
                    console.log(res.data, '工序模板下拉');
                    this.templateList = res.data.templates
                })
            },
            //获取负责人接口
            fetchUserList() {
                let params = {
                    userId: this.userId,
                    unitId: this.unitId
                };
                getPersonList(params)
                    .then(res => {
                        console.log(res)
                        this.options.userOptions = res.data;
                    });
            },
            // 获取节点列表
            // fetchNodeList() {
            //     const params = {
            //         unitId: this.unitId
            //     }
            //     getDesignNodeList(params)
            //         .then(res => {
            //             const {data} = res.data;
            //             this.options.nodeOptions = data;
            //         });
            // },
           async submit() {
                let flag = false
                this.formData.prcdNodes = this.$refs['template-create-table'].getNodeList()
                this.formData.userId = this.userId
                this.$refs['create-form'].validate((valid) => {
                    if (valid) {
                        if (this.formData.prcdNodes.some(v => v.prcdNodeId == '') || !this.formData.prcdNodes.length) {
                            return this.$message.error('请选择节点');
                        }
                        flag = true

                    }
                });
                if(!flag) return;
               this.visible.btnLoading = true;
               let templateUpdateApi,templateCreateApi;
               if(this.detailFrom==='goods'){
                   templateUpdateApi = goodsTemplateUpdate
                   templateCreateApi = goodsTemplateCreate
               }else {
                   templateUpdateApi = templateUpdate
                   templateCreateApi = templateCreate
               }
               if (this.editId) {
                   this.formData.id = this.editId
                   await  templateUpdateApi(this.formData)
                       .then(res => {
                           this.visible.btnLoading = false;
                           if (res.data.code === 0) {
                               flag = true
                               this.$message.success('编辑成功');
                               this.$emit('toggle')
                           }
                           else {
                               flag = false
                               this.$message.error(res.data.msg || '编辑失败');
                           }
                       });
               }else {
                await  templateCreateApi(this.formData)
                       .then(res => {
                           this.visible.btnLoading = false;
                           if (res.data.code === 0) {
                               flag = true
                               this.$message.success('新建成功');
                               this.$emit('toggle',res.data.data)
                           }
                           else {
                               flag = false
                               this.$message.error(res.data.msg || '新建失败');
                           }
                       });
               }
                return flag
            }
        }
    }
</script>

<style lang="scss">
    .template-design-create {
        .el-select {
            width: 100%
        }
    }
</style>


<style lang="scss" scoped>
    .delete-btn {
        /*margin-left: 32px;*/
        color: #fa4150;
        background-color: #fff;
        margin-top: 16px;
    }

    .template-design-create {
        position: fixed;
        right: 0;
        top: 0;
        z-index: 3000;
        width: 1200px;
        height: 100%;
        background: #fff;
        overflow-y: auto;
    }

    .create-form-wrapper {
        border-bottom: 1px solid #E6EAF0;
    }

    .create-form__item {
        width: 33%;
        margin-bottom: 10px;
        margin-right: 20px;
    }

    .flow {
        margin-top: 16px;
        .input-wrap {
            flex: 1;
            margin-left: 3px;
            .input-inner {
                width: 100%;
                height: 100%;
                padding: 0 3px;
                font-size: 12px;
                background: #F5F7FA;
            }
        }
    }
</style>

