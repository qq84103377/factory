<template>
    <section>
        <page-title title="新建设计节点">
            <nf-button @click="handleCancel">取消</nf-button>
            <nf-button type="warning" :loading="btnLoading" @click="submit">确定</nf-button>
        </page-title>
        <base-box :style="{'boxShadow': isComponent ? 'none' : ''}">
            <!-- 基本信息 -->
            <content-wrap class="create-form-wrapper" title="基本信息" type="big">
                <el-form class="create-form" ref="create-form" :model="formData" :rules="rules" label-width="80px">
                    <el-form-item class="create-form__item" label="节点名称" prop="prcdNodeName">
                        <el-input v-model="formData.prcdNodeName" placeholder="请输入节点名称（20字符内）"></el-input>
                    </el-form-item>
                </el-form>
            </content-wrap>
            <!-- 节点类型 -->
            <content-wrap class="node-type" title="节点类型" type="big">
                <p class="error-tip" slot="titleDesc" v-show="!formData.prcdNodeTypeId">请选择数据类型</p>
                <el-radio-group
                        style="width: 100%"
                        v-model="formData.prcdNodeTypeId"
                        @change="handleChange">
                    <el-row :gutter="12">
                        <el-col
                                class="design-noed-col"
                                :span="isComponent ? 12 : 8"
                                v-for="(item, index) of nodeConf"
                                :key="index">
                            <div class="node-type-item">
                                <el-radio style="white-space: inherit;width: 100%;"
                                        :label="item.id">
                                    <span class="node-type-item__label">{{ item.name }}</span>
                                    <template v-if="item.code === 'REVIEW'">
                                        <span class="node-type-item__desc">（对提报的内容进行评审，可生成商品档案）</span>
                                    </template>
                                    <template v-if="item.code === 'LAST_REVIEW'">
                                        <span class="node-type-item__desc">（对提报的内容进行评审，可自动生成和更新商品档案）</span>
                                    </template>
                                    <div style="display: flex;flex-wrap: wrap">
                                        <span @click="openConfigFieldDialog" class="node-type-item_text"
                                              v-if="formData.prcdNodeTypeId == item.id&&item.allowConfigField">可编辑字段</span>
                                        <span @click="openConfigDifficultyDialog" class="node-type-item_text"
                                              v-if="formData.prcdNodeTypeId == item.id&&item.allowConfigField&&(item.code === 'SAMPLE'||item.code === 'TYPING')">配置难度系数</span>
                                        <span @click="openGoodFieldDialog(item)" class="node-type-item_text"
                                              v-if="formData.prcdNodeTypeId == item.id&&item.allowCreateGoodField">生成商品默认字段</span>
                                        <span @click="openDynamicHeader(item.id)" class="node-type-item_text"
                                              v-if="formData.prcdNodeTypeId == item.id && item.allowTitleShow">配置表头</span>
                                        <span @click="groupDialogOpen" class="node-type-item_text"
                                              v-if="formData.prcdNodeTypeId == item.id && item.allowStationGroup">配置分组</span>
                                    </div>
                                </el-radio>
                            </div>
                        </el-col>
                    </el-row>
                </el-radio-group>

            </content-wrap>
        </base-box>
        <!--动态配置表头组件-->

        <dynamic-head
                v-if="dynamicAllItem&&dynamicAllItem.length"
                source="nodeDesign"
                title="配置表头显示内容"
                :dynamicVisible="dynamicVisible"
                :allSelectItem="dynamicAllItem"
                :checkedArr="dynamicCheckArr"
                :sortArr="dynamicSortArr"
                @closeDynamicHead="dynamicVisible = false"
                @dynamicCommit="dynamicCommit"
                @dynamicReset="openDynamicHeader"
        >
        </dynamic-head>
            <!--@dynamicSearch="getAllItem"-->
            <!--@dynamicReset="resetDefaultItem"-->
            <!--@updateCheckedArr="updateCheckedArr"-->
            <!--@updateSortArr="updateSortArr"-->
            <!--@dynamicCommit="dynamicCommit"-->
            <!--@closeDynamicHead="closeDynamicHead"-->
        <!--配置可编辑字段弹窗-->
        <node-dialog
                :show.sync="configFieldShow"
                :list.sync="list">
        </node-dialog>
        <!--配置商品默认字段弹窗-->
        <general-goods
                :nodeTypeCode="nodeTypeCode"
                :dialogVisible.sync="goodFieldShow"
                from="nodeDesignCreate"
                @getGoodsList="getGoodsList">
        </general-goods>
        <!--分组弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog" title="配置分组"
                   :visible.sync="groupDialog" :close-on-click-modal="false" size="tiny">
            <div class="remote-group">
                <span style="display:flex;width:78px;align-items:center;color:#3b3b3b;">所属分组</span>
                <el-select v-model="group" multiple placeholder="请选择分组" no-data-text="请先选择工厂">
                    <el-option v-for="item in groups" v-if="item.num" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer">
                <el-button @click="groupDialog = false">取 消</el-button>
                <el-button type="primary"
                           @click="confirmGroup">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--配置难度系数弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog difficulty-dialog" title="配置难度系数自动计算规则"
                   :visible.sync="difficultyShow" size="tiny">
            <div style="overflow-x: auto;">
                <table class="difficulty-table">
                    <tr>
                        　　
                        <th style="width: 200px;">难度分类</th>
                        <th v-for="(item,index) in difficultyTableData" :key="index">
                            <input type="text" v-model="item.colName" placeholder="请输入">
                        </th>
                        <th style="color: #FFA914;cursor: pointer;" @click="addCol">+ 添加</th>
                    </tr>
                    <tr v-for="(item,index) in rows" :key="index">
                        <td style="width: 200px">
                            <input type="text" v-model="item.rowName" maxlength="20" placeholder="请输入">
                        </td>
                        <td v-for="(col,colIndex) in difficultyTableData" :key="colIndex">
                            <input type="number" @blur="handleDiffcultyBlur" maxlength="20" v-model="col.colArr[index].name">
                        </td>
                        <td @click="delRow(index)" style="cursor: pointer;color: #808080;text-decoration: underline">删除</td>
                    </tr>
                    <tr>
                        <td style="width: 200px;color: #FFA914;cursor: pointer;" @click="addRow">+ 添加</td>
                        <td v-for="(item,index) in difficultyTableData" :key="index" @click="delCol(index)" style="cursor: pointer;color: #808080;text-decoration: underline">删除</td>
                        <td></td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary"
                           @click="confirm">确 定
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import {getDesignNodeType, createDesignNode, targetField} from '@/api/sample-centre';
    import { getEasyGroups,getDefaultTitleShow} from '@/api/api'
    import DynamicHead from '@/components/Common/dynamicHead';

    import nodeDialog from './component/nodeDialog'
    import GeneralGoods from "@/components/designWorkbench/general-goods/index";

    export default {
        props: {
            isComponent: Boolean
        },
        components: {
            DynamicHead,
            nodeDialog,
            GeneralGoods
        },
        data() {
            return {
                dynamicVisible:false,
                surePrcdNodeTypeId:'',
                titleChecks:[],
                dynamicAllItem:[],
                dynamicCheckArr:[],
                dynamicSortArr:[],
                groupSure:[],
                group:[],
                groups:[],
                groupDialog:false,
                temp: {
                  rows: [],
                  difficultyTableData: []
                },
                rows: [],
                difficultyTableData: [],
                btnLoading: false,
                configFieldShow: false,
                goodFieldShow: false,
                difficultyShow: false,
                formData: {
                    prcdNodeName: '',
                    prcdNodeTypeId: '',
                    difficultyConfigs: []
                },
                nodeConf: [],
                node: [
                    {name: '提报型', id: 1},
                    {name: '评审型', id: 2},
                    {name: '打版型', id: 3},
                    {name: '样衣型', id: 4}
                ],
                list: [],       //可配置必填信息
                goodsList: {},  //商品默认字段
                targetList: [],
                rules: {
                    prcdNodeName: [
                        {
                            required: true, message: '请输入节点名称',
                        },
                        {
                            max: 20, message: '长度在20个字符内'
                        }
                    ]
                },
                nodeTypeCode:'',// 当前点击操作的node设计节点
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        created() {
            // this.getTitleShowConfig();
            this.getAllGroup();
            this.fetchNodeTypeList();
            this.getTargetField()
        },
        methods: {
            //配置表头
            openDynamicHeader(id){
                if(id && id ===this.surePrcdNodeTypeId && this.titleChecks.length ) {
                    this.dynamicVisible = true;
                    return
                };
                let obj = {
                    userId:this.userId,
                    splDesignPrcdNodeTypeId:this.formData.prcdNodeTypeId
                };
                getDefaultTitleShow(obj).then(res=>{
                    this.dynamicAllItem = res.data.data.fields;
                    let dynamicCheckArr = res.data.data.config;
                    this.dynamicCheckArr = dynamicCheckArr.map(item=>item.id);
                    this.dynamicSortArr = dynamicCheckArr;
                    this.titleChecks = [];
                    // this.$nextTick(function () {
                        this.dynamicVisible = true;
                    // })

                })

            },
            dynamicCommit(val){
                this.surePrcdNodeTypeId = this.formData.prcdNodeTypeId;
                this.dynamicVisible = false;
                this.dynamicCheckArr = val.map(item=>item.id);
                this.dynamicSortArr = val;
                this.titleChecks = val.map(item => item.id)
            },
            //分组
            groupDialogOpen(){
                this.groupDialog = true;
                this.group = JSON.parse(JSON.stringify(this.groupSure));
            },
            confirmGroup(){
                this.groupDialog = false;
                this.groupSure = JSON.parse(JSON.stringify(this.group));

            },
            getAllGroup() {
                let getGroupParams = {
                    "facId": JSON.parse(sessionStorage.getItem('last_login')).id,
                    "token": ""
                };
                this.group = [];//清空分组
                getEasyGroups(getGroupParams).then(res => {
                    this.groups = res.data
                })
            },
            cancel() {
              this.difficultyShow = false
              // this.difficultyTableData = []
              // this.rows = []
            },
            //配置难度系数
            openConfigDifficultyDialog() {
                this.difficultyShow = true
                // this.rows = [...this.temp.rows]
                // this.difficultyTableData = [...this.temp.difficultyTableData]
            },
            confirm() {
                for (let i = 0; i < this.difficultyTableData.length; i++) {
                    const c = this.difficultyTableData[i].colArr
                    for (let j = 0; j < c.length; j++) {
                        if((c[j].name !== '' && ((this.rows[j]&&this.rows[j].rowName == '')||this.difficultyTableData[i].colName == ''))||(c[j].name == '' && (this.rows[j]&&this.rows[j].rowName != '') && this.difficultyTableData[i].colName != '')) {
                            this.$message.error('请完善配置信息!');
                            return
                        }
                    }
                }

                let rArr = this.rows.map(v => {
                    return v.rowName
                })
                rArr =  [...new Set(rArr)]
                if(rArr.length < this.rows.length) {
                    //有重复
                    return this.$message.error('难度分类的每一行不能重复');
                }

                let cArr = this.difficultyTableData.map(v => {
                    return v.colName
                })
                cArr =  [...new Set(cArr)]
                if(cArr.length < this.difficultyTableData.length) {
                    //有重复
                    return this.$message.error('难度分类的每一列不能重复');
                }

                this.difficultyShow = false
            },
            handleDiffcultyBlur(e) {
                const val = e.target.value
                let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
                if (val !== "" && !pattern.test(val)) {
                    this.$message.error('难度系数最多输入3位小数且不能为负数');
                    return
                }
            },
            delRow(index) {
                this.rows.splice(index,1)
                this.difficultyTableData.forEach(v => {
                    v.colArr.splice(index,1)
                })
            },
            delCol(index) {
                this.difficultyTableData.splice(index,1)
            },
            addRow() {
                this.rows.push({rowName:''})
                this.difficultyTableData.forEach(v => {
                    v.colArr.push({name:''})
                })
            },
            addCol() {
                const arr = [];
                this.rows.forEach((r,i) => {
                    arr.push({name:''})
                });
                this.difficultyTableData.push({colName:'',colArr:arr})
            },
            //获取商品默认字段填写的信息
            getGoodsList(val) {
                this.goodsList = val;
            },
            validName(rule, value, callback) {
                if (!value || value.length > 8) {
                    return callback(new Error('请输入节点名称（20字符内）'))
                }
                else {
                    // 此节点已存在，请检查后输入新的节点名称。
                    callback();
                }
            },
            // 获取节点类型列表
            fetchNodeTypeList() {
                getDesignNodeType({})
                    .then(res => {
                        const {data} = res.data;
                        this.nodeConf = data;
                    });
            },
            // 选择节点
            handleChange(index) {
                this.titleChecks = []
            },
            handleCancel() {
                if (this.isComponent) return this.$emit('on-cancel');
                this.$router.back();
            },
            // 获取配置可编辑的字段
            getTargetField() {
                let params = {
                    bossUnitId: this.bossUnitId,
                    userId: this.userId
                }
                targetField(params).then(res => {
                    if (res.data.code == 0) {
                        //配置可编辑字段增加属性
                        let tarData = res.data.data;
                        tarData.forEach(item => {
                            item.checkName = '提报时检测必填';
                            item.childrenId = 'child-' + item.fieldId;
                            item.checkCode = 0;
                            if (item.children && item.children.length) {
                                item.children.forEach((v, index) => {
                                    v.isSelect = false;
                                    v.checkName = '提报时检测必填';
                                    v.childrenId = 'child-' + v.fieldId;
                                    v.checkCode = 0
                                })
                            }
                        });
                        this.list = tarData;
                        this.targetList = tarData; // 备份
                    }
                })
            },
            //配置可编辑字段弹窗
            openConfigFieldDialog() {
                this.configFieldShow = true
            },
            //配置商品默认字段弹窗
            openGoodFieldDialog(node) {
                this.nodeTypeCode = node.code
                this.goodFieldShow = true
            },

            // 提交新建节点
            submit() {
                this.$refs['create-form'].validate((valid) => {
                    if (valid && this.formData.prcdNodeTypeId) {
                        let fieldIds = [];  //可编辑字段数据
                        let defaultColumns = [];    //商品默认字段数据
                        if (this.list.length) {
                            this.list.forEach(i => {
                                //有子项
                                if (i.children && i.children.length > 0) {
                                    //保存父项数据
                                    if (i.checked.length) {
                                        let fatherObj = {};
                                        fatherObj.fieldId = i.fieldId;
                                        fatherObj.required = 1;
                                        fieldIds.push(fatherObj);
                                    }
                                    i.children.forEach(v => {
                                        //保存选中的子项数据
                                        if (v.isSelect) {
                                            let childObj = {};
                                            childObj.fieldId = v.fieldId;
                                            childObj.required = v.checkCode;
                                            fieldIds.push(childObj)
                                        }
                                    })
                                }
                                //没有子项
                                else {
                                    // 保存父项数据
                                    if (i.checkAll) {
                                        let fatherObj = {};
                                        fatherObj.fieldId = i.fieldId;
                                        fatherObj.required = i.checkCode ? 1 : 0;
                                        fieldIds.push(fatherObj);
                                    }
                                }
                            });
                        }
                        if (this.goodsList.baseInfo && this.goodsList.attrsInfo && this.goodsList.goodsInfo && this.goodsList.attachmentNames && this.goodsList.priceInfo) {
                            const baseInfo = this.goodsList.baseInfo.model;   //设计基础信息
                            const attrsInfo = this.goodsList.attrsInfo.model; //属性信息
                            const goodsInfo = this.goodsList.goodsInfo.model; //商品信息
                            const attachmentNames = this.goodsList.attachmentNames.model; //附件信息
                            const priceInfo = this.goodsList.priceInfo.model; //价格信息
                            const autoUpdateGoods = this.goodsList.autoUpdateGoods?this.goodsList.autoUpdateGoods.model:[] // 只有转大货才有--通过后自动生成/更新商品档案的对应字段
                            const changeDesignListUpdateGoods = this.goodsList.changeDesignListUpdateGoods?this.goodsList.changeDesignListUpdateGoods.model:[] // 只有转大货才有--通过后自动生成/更新商品档案的对应字段
                            const selectArr = [...changeDesignListUpdateGoods,...autoUpdateGoods,...baseInfo, ...attrsInfo, ...goodsInfo, ...attachmentNames, ...priceInfo];
                            if (selectArr.length) {
                                selectArr.forEach(item => {
                                    let goodsAttr = {};
                                    goodsAttr.fieldId = item;
                                    defaultColumns.push(goodsAttr);
                                })
                            }
                        }


                        let difArr = []
                        this.difficultyTableData.forEach(c => {
                            c.colArr.forEach((v,i) => {
                                if(c.colName != '' && this.rows[i].rowName != '' && v.name != ''){
                                    difArr.push({
                                        sort: difArr.length + 1,
                                        leftNum: this.rows.length,
                                        rightNum: this.difficultyTableData.length,
                                        leftTitle:this.rows[i].rowName,
                                        rightTitle:c.colName,
                                        difficultyDegree:v.name,
                                        type: this.formData.prcdNodeTypeId=='3'?0:1 //0 打板  1 样衣
                                    })
                                }

                            })
                        })
                        const params = {
                            ...this.formData,
                            unitId: this.unitId,
                            fieldIds: fieldIds,
                            defaultColumns: defaultColumns,
                            difficultyConfigs: difArr,
                            stations:this.group,
                            titleChecks:this.titleChecks,
                        };
                        /**
                         * {
                                "leftTitle":"风衣",
                                "rightTitle":"freestyle",
                                "difficultyDegree":"10",
                                "type": "1"
                            }
                         * @type {boolean}
                         */
                        if(!this.titleChecks.length){
                            let obj = {
                                userId:this.userId,
                                splDesignPrcdNodeTypeId:this.formData.prcdNodeTypeId
                            };
                            getDefaultTitleShow(obj).then(res=>{
                                if(res.data.code === 0){
                                    let dynamicCheckArr = res.data.data.config;
                                    params.titleChecks = dynamicCheckArr.map(item=>item.id);

                                    this.btnLoading = true;
                                    createDesignNode(params)
                                        .then(res => {
                                            this.btnLoading = false;
                                            if (res.data.code === 0) {
                                                this.$message.success('新建成功');
                                                if (this.isComponent) return this.$emit('on-success', res.data.data);
                                                this.$router.back();
                                            }
                                            else {
                                                this.$message.error(res.data.msg || '新建失败');
                                            }
                                        });
                                }else {
                                    this.$message.error(res.data.msg);
                                }

                            })
                        }else {
                            this.btnLoading = true;
                            createDesignNode(params)
                                .then(res => {
                                    this.btnLoading = false;
                                    if (res.data.code === 0) {
                                        this.$message.success('新建成功');
                                        if (this.isComponent) return this.$emit('on-success', res.data.data);
                                        this.$router.back();
                                    }
                                    else {
                                        this.$message.error(res.data.msg || '新建失败');
                                    }
                                });
                        }


                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .remote-group {
        border-radius: 2px;
        min-width: 260px;
        margin-right: 32px;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .el-input {
            width: 95%;
        }
        .el-select {
            width: 95%;
        }
    }
    .create-form-wrapper {
        border-bottom: 1px solid #E6EAF0;
    }

    .create-form__item {
        width: 33%;
        margin-bottom: 6px;
    }

    .node-type {
        margin-top: 16px;
        .error-tip {
            display: inline-block;
            margin-left: 12px;
            font-size: 12px;
            color: #FA4150
        }
    }

    .design-noed-col {
        float: none;
        display: inline-block;
        vertical-align: top;
    }

    .node-type-item {
        padding: 8px 12px;
        margin-bottom: 12px;
        background: #F7F9FC;
        border: 1px solid #E6EAF0;
        font-size: 12px;
        .node-type-item__label {
            // font-size: 12px;
        }
        .node-type-item_text {
            line-height: 18px;
            color: #1CA1FF;
            text-decoration: underline;
            cursor: pointer;
            flex: 0 0 35%;
        }
        .node-type-item__desc {
            // font-size: 12px;
            color: #A2ABB8
        }
    }
    .difficulty-dialog{
        .difficulty-table{
            position: relative;
            white-space: nowrap;
            max-width: 650px;
            border: 1px solid #E6EAF0;
            font-size: 12px;
            color: #3B3B3B;
            tr{
                border-bottom: 1px solid #E6EAF0;
                line-height: 32px;
                &:last-child{
                    border-bottom: none;
                }
                th,td{
                    padding: 0 10px;
                    text-align: left;
                    font-weight: normal;
                    border-right: 1px solid #E6EAF0;
                    &:last-child{
                        border-right: none;
                    }
                }
            }
        }
    }

</style>
<style lang="scss">
    .difficulty-dialog{
        .el-dialog__body{
            max-width: 1250px;
        }
        .el-dialog--tiny{
            width: auto;
        }
    }
</style>
