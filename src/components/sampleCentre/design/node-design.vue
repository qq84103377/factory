<template>
    <div class="node-design">
        <el-table
                :data="nodeList"
                border
                style="width: 100%">
            <el-table-column
                    label="节点名称"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="节点类型"
                    prop="designPrcdNodeTypeId">
                <template slot-scope="scope">
                    {{ scope.row.nodeTypeName }}
                </template>
            </el-table-column>
            <el-table-column
                    width="780"
                    align="center"
                    label="操作">
                <template slot-scope="scope">
                    <ul class="node-btns">
                        <li
                                class="node-btn btn-group1"
                                @click="getStationGroup(scope.row.id)">
                            <span v-if="scope.row.designPrcdNodeTypeId != 2 && scope.$index != 0">配置分组</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group1"
                                @click="openDynamicHeader(scope.row)">
                            <span v-if="scope.row.allowConfigField || scope.$index == 0">配置表头</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group1"
                                @click="showDifDialog(scope.row)">
                            <span v-if="scope.row.designPrcdNodeTypeId==3||scope.row.designPrcdNodeTypeId==4">配置难度系数</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group1"
                                @click="openConfigFieldDialog(scope.row)">
                            <span v-if="scope.row.allowConfigField || scope.$index == 0">可编辑字段</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group2"
                                @click="openGoodFieldDialog(scope.row)">
                            <span v-if="scope.row.allowCreateGoodField">生成商品默认字段</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group3"
                                @click="showEditDialog(scope.row)">
                            <span v-if="scope.$index != 0">修改节点</span>
                            <span v-else></span>
                        </li>
                        <li
                                class="node-btn btn-group5"
                        >
                            <span v-if="scope.$index!==1 && scope.$index !== 0  && !moveNode" @click="orderChange(scope.row.id,scope.$index,'UP')">上移</span>
                            <span v-if="scope.$index!==1 && scope.$index !== 0  && moveNode" style="cursor: not-allowed">上移</span>
                            <span v-if="scope.$index===1 || scope.$index === 0"></span>
                        </li>
                        <li
                                class="node-btn btn-group5"
                        >
                            <span v-if="scope.$index!==nodeList.length-1 && !moveNode && scope.$index !== 0"  @click="orderChange(scope.row.id,scope.$index,'DOWN')">下移</span>
                            <span v-if="scope.$index!==nodeList.length-1 && moveNode && scope.$index !== 0"  style="cursor: not-allowed">下移</span>
                            <span v-if="scope.$index===nodeList.length-1 || scope.$index == 0"></span>
                        </li>
                        <li
                                class="node-btn btn-group4"
                                @click="showDeleteDialog(scope.row, scope.$index)">
                            <span v-if="scope.row.designPrcdNodeTypeId != '5' && scope.$index != 0">删除</span>
                            <span v-else></span>
                        </li>
                    </ul>
                </template>
            </el-table-column>
        </el-table>
        <!--配置可编辑字段弹窗 designIndex-->
        <node-dialog
                :show.sync="configFieldShow"
                :list.sync="list"
                :from="prcdNodeId==='style'?'designIndex':'nodeDesignList'"
                :selectedArr="selectedArr"
                @commitList="commitList">
        </node-dialog>
        <!--配置商品默认字段弹窗-->
        <general-goods
                :nodeTypeCode="nodeTypeCode"
                :dialogVisible.sync="goodFieldShow"
                from="nodeDesignList"
                :selectedArr="selectedArr"
                @commitGoodsList="commitGoodsList">
        </general-goods>
        <!-- 修改节点名称 -->
        <el-dialog
                custom-class="nf-dialog-common edit-dialog"
                title="修改节点名称"
                size="tiny"
                :show-close="false"
                :visible.sync="visible.dialogVisible">
            <p class="edit-tip">
                <icon type="icon-tips" w="11" h="11"/>
                修改后，用到此节点的工单和工序模板的节点名称也会被修改。
            </p>
            <el-row class="edit-dialog-form" type="flex" justify="center">
                <el-form ref="edit-form" :model="formData" :rules="rules" inline>
                    <el-form-item label="节点名称" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入节点名称"></el-input>
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.dialogVisible = false">取 消</nf-button>
                <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="submit">确 定
                </nf-button>
            </el-row>
        </el-dialog>
        <!-- 删除 -->
        <el-dialog
                custom-class="nf-dialog-common no-dialog-header"
                title="提示"
                size="tiny"
                :show-close="false"
                :visible.sync="visible.confirmVisible">
            <div class="dialog-content">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="delete-tip">是否确定删除该节点？</p>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="visible.confirmVisible = false">取 消</nf-button>
                <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="handleDelete">确 定
                </nf-button>
            </el-row>
        </el-dialog>

        <!--分组弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog" title="配置分组"
                   :visible.sync="groupDialog" size="tiny">
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
                           @click="confirmGroup" :loading="groupBtnLoading">确 定
                </el-button>
            </div>
        </el-dialog>
        <!--动态配置表头组件-->

        <dynamicHead
                v-if="dynamicAllItem&&dynamicAllItem.length"
                source="nodeDesign"
                :dynamicVisible="dynamicVisible"
                :allSelectItem="dynamicAllItem"
                :checkedArr="dynamicCheckArr"
                :sortArr="dynamicSortArr"
                @closeDynamicHead="dynamicVisible = false"
                @dynamicCommit="dynamicCommit"
                @dynamicReset="openDynamicHeader"
        >
        </dynamicHead>
        <!--配置难度系数弹窗-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog difficulty-dialog" title="配置难度系数自动计算规则"
                   :visible.sync="visible.difficultyShow" size="tiny">
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
                            <!--{{col.colArr[index]}}-->
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
                <el-button @click="visible.difficultyShow = false">取 消</el-button>
                <el-button type="primary"
                           :loading="visible.btnLoading" @click="confirm">确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getDesignNodeList,
        editDesignNodeName,
        deleteDesignNodeName,
        targetField,
        getNodeDesignDialogFields,
        nodeSeqencing,
        updateNodeDesignDialogFields,
        getDesignDialogFields,
        updateDesignDialogFields
    } from '@/api/sample-centre';
    import {getDifficultyDetail,updateDifficultyDetail,getEasyGroups,updateStation,getStationGroup,getTitleShowConfig,getDefaultTitleShow,updateTitleShowConfig} from '@/api'
    import {debounce} from '@/utils';
    import nodeDialog from "@/components/sampleCentre/design/component/nodeDialog";
    import GeneralGoods from "@/components/designWorkbench/general-goods/index";
    import dynamicHead from '@/components/Common/dynamicHead';
    export default {
        name: 'NodeDesign',
        components: {
            dynamicHead,
            nodeDialog,
            GeneralGoods
        },
        data() {
            return {
                dynamicVisible:false,
                titleChecks:[],
                dynamicAllItem:[],
                dynamicCheckArr:[],
                dynamicSortArr:[],
                splDesignPrcdNodeId:'',
                splDesignPrcdNodeTypeId:'',
                group:[],
                groups:[],
                groupBtnLoading:false,
                groupDialog:false,
                rows: [],
                difficultyTableData: [],
                moveNode:false,
                visible: {
                    btnLoading: false,
                    dialogVisible: false,
                    confirmVisible: false,
                    difficultyShow: false
                },
                formData: {
                    prcdNodeId: '',
                    name: ''
                },
                deleteRow: {},
                nodeList: [{name:'设计档案',nodeTypeName:'设计档案',id:'style'}],
                rules: {
                    name: [
                        {
                            required: true, message: '请输入节点名称'
                        },
                        {
                            max: 20, message: '长度在20个字符内'
                        }
                    ]
                },
                list: [],       //可配置必填信息
                goodsList: {},  //商品默认字段
                selectedArr:[],
                configFieldShow: false,
                goodFieldShow: false,
                prcdNodeId:'',  //设计节点id
                nodeType: '',
                nodeTypeCode:'', //设计节点类型编码
            }
        },
        computed: {
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
        },
        created() {
            console.log('测试是否build成功5');
            this.fetchNodeList();
            this.$on('node.design.search', this.remoteSearch);
            this.getTargetField();
            this.getAllGroup();
        },
        methods: {
            //配置表头
            openDynamicHeader(row){
                let obj={};
                let getTitleShowConfigType;
                if(row){
                        this.splDesignPrcdNodeTypeId = row.designPrcdNodeTypeId;
                        this.splDesignPrcdNodeId = row.id;
                        obj = {
                            userId:this.userId,
                            splDesignPrcdNodeId: row.id,
                            unitId:this.unitId
                        };
                    getTitleShowConfigType = getTitleShowConfig
                }else {
                    //恢复默认
                    obj = {
                        userId:this.userId,
                        splDesignPrcdNodeTypeId:this.splDesignPrcdNodeTypeId || 'style'
                    };
                    getTitleShowConfigType = getDefaultTitleShow
                }

                getTitleShowConfigType(obj).then(res=>{
                    console.log(res);
                    this.dynamicAllItem = res.data.data.fields;
                    let dynamicCheckArr = res.data.data.config;
                    this.dynamicCheckArr = JSON.parse(JSON.stringify(dynamicCheckArr)).map(item=>item.id);
                    this.dynamicSortArr = JSON.parse(JSON.stringify(dynamicCheckArr));
                    console.log(this.dynamicSortArr,'=3=3=3=3=');
                    // this.$nextTick(function () {
                        this.dynamicVisible = true;
                    // })

                })

            },

            dynamicCommit(val){
                console.log(val);
                let checkeds = val.map(item => item.id)
                updateTitleShowConfig({splDesignPrcdNodeId:this.splDesignPrcdNodeId,checkeds,unitId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.$message.success('配置成功')
                    }else {
                        this.$message.error(res.data.msg)
                    }
                    this.dynamicVisible = false;

                })


            },
            // 获取分组
            getStationGroup(id){
                this.groupDialog = true;
                this.splDesignPrcdNodeId = id;
                getStationGroup({designPrcdNodeId:id}).then(res=>{
                    this.group = res.data.data.map(item=>item.id)
                })
            },
            confirmGroup(){
                let obj={
                    splDesignPrcdNodeId:this.splDesignPrcdNodeId,
                    checkeds:this.group
                };
                this.groupBtnLoading = true
                updateStation(obj).then(res=>{
                    this.groupBtnLoading = false;
                    if(res.data.code===0){
                        this.groupDialog = false
                        this.$message.success('配置成功')
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
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
                this.visible.btnLoading = true
                let difficultyConfig = []
                this.difficultyTableData.forEach((v,vi) => {
                    v.colArr.forEach((c,ci) => {
                        if(v.colName != '' && this.rows[ci].rowName != '' && c.name != '') {
                            difficultyConfig.push({
                                styleId: this.rows[ci].styleId || '',
                                leftTitle: this.rows[ci].rowName,
                                difficultyId: v.difficultyId || '',
                                rightTitle: v.colName,
                                difficultyDegree: c.name,
                                type: this.nodeType,
                                sort: difficultyConfig.length,
                                rightNum: this.difficultyTableData.length,
                                leftNum: this.rows.length
                            })
                        }
                    })
                })



                const params = {
                    designPrcdNodeId:this.prcdNodeId,
                    difficultyConfig
                }
                console.log(params,'参数');
                updateDifficultyDetail(params).then(res => {
                    this.visible.btnLoading = false
                    if(res.data.code == 0){
                        this.visible.difficultyShow = false
                        this.$message.success(res.data.msg)
                    }else {
                        this.$message.error(res.data.msg)
                    }

                })


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
            //配置难度系数
            showDifDialog(item) {


                if(!this.powerJudgement.permissions("fac.designNodeTemp.node.update")) {
                    return
                }

                this.difficultyTableData = []
                this.rows = []
                this.visible.difficultyShow = true
                this.prcdNodeId = item.id
                this.nodeType = item.designPrcdNodeTypeId == 3?0:1
                getDifficultyDetail({designPrcdNodeId:item.id}).then(res => {
                    if(res.data.code == 0){
                        const row = res.data.data[0]?res.data.data[0].leftNum:0
                        const col = res.data.data[0]?res.data.data[0].rightNum:0
                        let arr = []
                        res.data.data.forEach((v,i) => {
                            arr.push({name:v.difficultyDegree})
                            if(i<row){
                                console.log(v.leftTitle);
                                this.rows.push({rowName:v.leftTitle,styleId:v.styleId})
                            }
                            if((i+1)%row == 0){
                                console.log(i,'iiii');
                                this.difficultyTableData.push({
                                    colName: v.rightTitle,
                                    colArr: arr,
                                    difficultyId: v.difficultyId
                                })
                                arr = []
                            }
                        })
                        // console.log(this.difficultyTableData,'this.difficultyTableData');
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //提交可编辑字段弹窗里的内容
            commitList(val){
                let fieldIds = [];    //可编辑字段数据
                val.forEach(i => {
                    //有子项
                    if (i.children&&i.children.length > 0) {
                        //保存父项数据
                        if(i.checked.length){
                            let fatherObj = {};
                            fatherObj.fieldId = i.fieldId;
                            fatherObj.required = 1;
                            fieldIds.push(fatherObj);
                        }
                        i.children.forEach(v => {
                            //保存选中的子项数据
                            if(v.isSelect){
                                let childObj = {};
                                childObj.fieldId = v.fieldId;
                                childObj.required = v.checkCode;
                                fieldIds.push(childObj)
                            }
                        })
                    }
                    //没有子项
                    else{
                        // 保存父项数据
                        if(i.checkAll){
                            let fatherObj = {};
                            fatherObj.fieldId = i.fieldId;
                            fatherObj.required = i.checkCode ? 1 : 0;
                            fieldIds.push(fatherObj);
                        }
                    }
                });
                let api;
                let params;
                if(this.prcdNodeId==='style') {
                    params = {
                        unitId: this.unitId,
                        fieldIds: fieldIds
                    };
                    api = updateDesignDialogFields
                }else {
                    params = {
                        prcdNodeId: this.prcdNodeId,
                        type: 1,
                        fieldIds: fieldIds
                    };
                    api = updateNodeDesignDialogFields
                }
                api(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //提交商品默认字段弹窗里的内容
            commitGoodsList(val){
                let defaultColumns = [];    //商品默认字段数据
                if(val.baseInfo && val.attrsInfo && val.goodsInfo && val.attachmentNames && val.priceInfo){
                    const baseInfo = val.baseInfo.model;   //设计基础信息
                    const attrsInfo = val.attrsInfo.model; //属性信息
                    const goodsInfo = val.goodsInfo.model; //商品信息
                    const attachmentNames = val.attachmentNames.model // 附件
                    const priceInfo = val.priceInfo.model // 价格信息
                    const autoUpdateGoods = val.autoUpdateGoods?val.autoUpdateGoods.model:[] // 价格信息
                    const changeDesignListUpdateGoods = val.changeDesignListUpdateGoods?val.changeDesignListUpdateGoods.model:[] // 价格信息
                    const selectArr = [...changeDesignListUpdateGoods,...autoUpdateGoods,...baseInfo, ...attrsInfo, ...goodsInfo, ...attachmentNames, ...priceInfo];
                    if(selectArr.length){
                        selectArr.forEach(item =>{
                            let goodsAttr = {};
                            goodsAttr.fieldId = item;
                            defaultColumns.push(goodsAttr);
                        })
                    }
                }
                const params = {
                    prcdNodeId: this.prcdNodeId,
                    type: 2,
                    fieldIds: defaultColumns
                };
                updateNodeDesignDialogFields(params).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            // 获取配置可编辑的字段
            getTargetField () {
                let params = {
                    bossUnitId: this.bossUnitId,
                    userId: this.userId
                }
                targetField(params).then(res => {
                    if (res.data.code == 0) {
                        //配置可编辑字段增加属性
                        let tarData = res.data.data;
                        tarData.forEach(item =>{
                            item.checkName = '提报时检测必填';
                            item.childrenId = 'child-'+item.fieldId;
                            item.checkCode = 0;
                            if(item.children && item.children.length){
                                item.children.forEach((v,index) => {
                                    v.isSelect = false;
                                    v.checkName = '提报时检测必填';
                                    v.childrenId = 'child-'+v.fieldId;
                                    v.checkCode = 0
                                })
                            }
                        });
                        this.list = tarData;
                    }
                })
            },
            //勾选弹窗已选字段
            selectFields(id, type) {
                const params = {
                    prcdNodeId: id,
                    type: type
                };
                getNodeDesignDialogFields(params).then(res => {
                    if (res.data.code == 0) {
                        this.selectedArr = res.data.data;
                    }
                })
            },
            //勾选设计档案弹窗已选字段
            designSelectFields() {
                const params = {
                    unitId: this.unitId
                };
                getDesignDialogFields(params).then(res => {
                    if (res.data.code == 0) {
                        this.selectedArr = res.data.data;
                        // this.$nextTick(function () {
                        //     this.$refs['nodeDialog'].selectedArr = this.selectedArr
                        // })
                    }
                })
            },
            //配置可编辑字段弹窗
            openConfigFieldDialog(row) {
                if(row.id !== 'style'){
                    if(!this.powerJudgement.permissions("fac.designNodeTemp.node.update")) {
                        return
                    }
                    this.prcdNodeId = row.id;
                    const type = 1;
                    this.selectFields(this.prcdNodeId, type);
                }else {
                    if (!this.powerJudgement.permissions("fac.spl.design.style.config.necessary")) {
                        return
                    }
                    this.prcdNodeId = row.id;
                    this.designSelectFields()
                }
                this.configFieldShow = true
            },
            //配置商品默认字段弹窗
            openGoodFieldDialog(row) {
                if(!this.powerJudgement.permissions("fac.designNodeTemp.node.update")) {
                    return
                }
                console.log(row,999999)
                this.prcdNodeId = row.id;
                const type = 2;
                this.selectFields(this.prcdNodeId, type);
                this.nodeTypeCode = row.nodeTypeCode
                this.goodFieldShow = true
            },
            validName(rule, value, callback) {
                if (!value) {
                    return callback(new Error('请输入节点名称'))
                }
                else {
                    // 此节点已存在，请检查后输入新的节点名称。
                    callback();
                }
            },
            remoteSearch(keyWord = '') {
                debounce(this.fetchNodeList)(keyWord);
            },
            // 获取节点列表
            fetchNodeList(name = '') {
                const params = {
                    name,
                    unitId: this.unitId,
                    userId: this.userId
                }
                getDesignNodeList(params)
                    .then(res => {
                        const {data} = res.data;
                        this.nodeList = [{name:'设计档案',nodeTypeName:'设计档案',id:'style'},...data]
                    });
            },
            orderChange(id,index,type){
                // 权限
                if (!this.powerJudgement.permissions("fac.designNodeTemp.node.update")) {
                    return
                }
                this.moveNode = true
                console.log(this.nodeList);

                nodeSeqencing({id,type}).then(res=>{
                    console.log(res);
                    this.moveNode = false
                    if(type==='DOWN'){
                        [this.nodeList[index],this.nodeList[index+1]] = [this.nodeList[index+1],this.nodeList[index]]
                        console.log(this.nodeList);

                    }else {
                        [this.nodeList[index],this.nodeList[index-1]] = [this.nodeList[index-1],this.nodeList[index]]

                    }
                    this.nodeList=[...this.nodeList]

                })

            },
            showEditDialog(row) {
                // 权限
                if (!this.powerJudgement.permissions("fac.designNodeTemp.node.update")) {
                    return
                }
                this.formData = {
                    name: row.name,
                    prcdNodeId: row.id
                };
                this.visible.dialogVisible = true;
            },
            showDeleteDialog(row, index) {
                // 权限
                if (!this.powerJudgement.permissions("fac.designNodeTemp.node.delete")) {
                    return
                }
                this.deleteRow = {...row, $index: index};
                this.visible.confirmVisible = true;
            },
            submit() {
                this.$refs['edit-form'].validate((valid) => {
                    if (valid) {
                        const params = this.formData;
                        this.visible.btnLoading = true;
                        editDesignNodeName(params)
                            .then(res => {
                                this.visible.btnLoading = false;
                                if (res.data.code === 0) {
                                    this.$message.success('修改成功');
                                    this.fetchNodeList();
                                    this.visible.dialogVisible = false
                                }
                                else {
                                    this.$message.error(res.data.msg || '修改失败');
                                }
                            });
                    }
                });
            },
            handleDelete() {
                const params = {
                    prcdNodeId: this.deleteRow.id
                };
                this.visible.btnLoading = true;
                deleteDesignNodeName(params)
                    .then(res => {
                        this.visible.btnLoading = false;
                        if (res.data.code === 0) {
                            this.$message.success('删除成功');
                            this.nodeList.splice(this.deleteRow.$index, 1);
                            this.visible.confirmVisible = false;
                        }
                        else {
                            this.$message.error(res.data.msg || '删除失败');
                        }
                    });
            }
        }
    }
</script>

<style lang="scss">
    .node-design .el-table {
        thead th {
            height: 28px;
            background: #F7F9FC;
            font-size: 12px;
            font-weight: bold;
            color: #808080;
        }
        .el-table__header-wrapper thead div {
            background-color: #F7F9FC;
            color: #808080;
        }
        tbody td {
            font-size: 12px;
            height: 32px;
            color: #3b3b3b;
            background-color: #fff;
            .cell {
                position: relative;
                padding: 0 10px;
                background-color: #fff;
            }
        }
        .el-table__body tr:hover > td {
            background-color: #fff;
        }
    }

    .node-design .edit-dialog {
        .el-dialog__body {
            position: relative;
        }
    }
    .node-design .difficulty-dialog{
        .el-dialog__body{
            max-width: 1250px;
        }
        .el-dialog--tiny{
            width: auto;
        }
    }
</style>

<style lang="scss" scoped>
    .node-design {
        margin-top: 12px;
        .btn {
            font-size: 12px
        }
        .btn--delete {
            margin-left: 12px
        }
        .btn--submit {
            margin-left: 12px;
        }
        .edit-dialog-form {
            margin-top: 22px;
        }
        .edit-tip {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            font-size: 12px;
            padding: 5px 16px;
            background: #F5F7FA
        }
        .dialog-content {
            text-align: center;
            p {
                margin-top: 24px;
            }
        }
        .node-btns{
            .node-btn{
                display: inline-block;
                font-size: 12px;
                text-decoration: underline;
                cursor: pointer;
                &.btn-group1{
                    width: 90px;
                    color: #1CA1FF;
                }
                &.btn-group2{
                    width: 140px;
                    color: #1CA1FF;
                }
                &.btn-group3{
                    width: 92px;
                    color: #808080;
                }
                &.btn-group4{
                    width: 68px;
                    color: #FA4150;
                }
                &.btn-group5{
                    width: 38px;
                    color: #808080;
                }
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
    }
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
</style>

