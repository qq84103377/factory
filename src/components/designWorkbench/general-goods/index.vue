<template>
    <div>
        <!-- 生成商品档案 -->
        <el-dialog
                :modal-append-to-body="false"
                custom-class="custom-dialog general-goods-dialog"
                :title=title
                :show-close="false"
                :visible.sync="dialogVisible"
                @close="cancel">
            <p class="audit-tip" v-if="from !== 'nodeDesignCreate' && from !== 'nodeDesignList'">
                <icon type="icon-tips" w="11" h="11"/>
                提示：操作成功后设计资料单将形成一张新的货品资料单
            </p>
            <div :class="{'collapse-wrap': from !== 'nodeDesignCreate' && from !== 'nodeDesignList'}"
                v-loading="loading">
                <div v-if="nodeTypeCode ==='LAST_REVIEW'||nodeTypeCode ==='REVIEW'" style="line-height: 40px;text-align: center;background: #F0F2F5;border: 1px solid #E6EAF0;border-bottom: none;">
                    <el-checkbox v-model="autoUpdateGoods" v-if="nodeTypeCode ==='LAST_REVIEW'">通过后自动生成/更新商品档案的对应字段</el-checkbox>
                    <el-checkbox v-model="changeDesignListUpdateGoods">更改设计档案后提示更新商品</el-checkbox>
                </div>
                <info-collapse-item
                        v-for="(item, key, index) of checkConf"
                        :key="index"
                        v-model="item.model"
                        :check-type="key"
                        :prop="item.prop || 'id'"
                        :title="item.title"
                        :tip-show="index === 1 && from !== 'nodeDesignCreate' && from !== 'nodeDesignList'"
                        :children-list="item.list"
                        @change="handleChange"
                        @change-all="handleSelectAllChange"></info-collapse-item>
            </div>
            <!-- footer -->
            <el-row type="flex" justify="center" slot="footer">
                <nf-button @click="cancel">取 消</nf-button>
                <nf-button
                        class="btn--submit"
                        type="warning"
                        :loading="visible.btnLoading"
                        @click="submit">确 定</nf-button>
            </el-row>
        </el-dialog>
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="updateGoodsNew" :show-close="false"
                   size="tiny" :close-on-click-modal="false">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="remark">是否更新商品档案？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateGoodsNew = false">取消</el-button>
                <el-button  type="primary" @click="updateDialoVisibleGo" :loading="visible.updateBtnLoading">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog class="custom-dialog tip-dialog" :visible.sync="updateGoodsPrice" :show-close="false"
                   size="tiny" :close-on-click-modal="false">
            <div class="text-center">
                <icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
                <p class="remark">是否将“{{updateCostName}}”的成本信息更新到商品档案的物料成本、加工成本、计划成本价？？</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateGoodsPriceGo(false)" :loading="visible.updatePriceBtnLoading">不更新</el-button>
                <el-button  type="primary" @click="updateGoodsPriceGo(true)" :loading="visible.updatePriceBtnLoading">更新</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import InfoCollapseItem from '@/components/designWorkbench/general-goods/info-collapse-item.vue';
    import { getDesignNodeGenerateStyle, createDesignNodeGenerateStyle } from '@/api/sample-centre';
    import { configNames } from '@/api/api';
    import {getCustomFieldList} from '@/api/selfFactory.js'
    export default {
        props: {
            nodeDetailData: Object,
            missionPrcd: Object,
            dialogVisible:Boolean,
            from: String,
            updateGoodsType: String,
            selectedArr: Array,
            nodeTypeCode:String
        },
        /**********************************
         from: 'nodeDesignCreate'，新建设计节点标识
               'nodeDesignList', 设计节点列表标识
         selectedArr: 已选的数组
         ***********************************/
        data() {
            return {
                updateCostName:'',
                updateGoodsPrice:false,
                updateGoodsPriceParams:{},
                dataNodeGenerateStyle:{},
                updateGoodsNew:false,
                loading: false,
                visible: {
                    updatePriceBtnLoading: false,
                    btnLoading: false,
                    updateBtnLoading: false,
                },
                checkData: {},
                checkConf: {
                    baseInfo: {
                        title: '基本信息',
                        prop: 'id',
                        model: [2, 3,18,19,20,21],
                        list: [
                            {
                                label: '设计款号',
                                disabled: true,
                                id: 2,
                                value: true
                            },
                            {
                                label: '商品款号',
                                disabled: true,
                                id: 18,
                                value: true
                            },
                            {
                                label: '商品名称',
                                disabled: true,
                                id: 3,
                                value: true
                            },
                            {
                                label: '供应商',
                                disabled: false,
                                id: 28,
                                value: true
                            },
                            {
                                label: '厂家货号',
                                disabled: false,
                                id: 29,
                                value: true
                            },

                            {
                                label: '颜色',
                                disabled: true,
                                id: 19,
                                value: true
                            },
                            {
                                label: '尺码',
                                disabled: true,
                                id: 20,
                                value: true
                            },
                            {
                                label: '内长',
                                disabled: true,
                                id: 21,
                                value: true
                            },
                            {
                                label: '厂家色号',
                                disabled: false,
                                id: 56,
                                value: true
                            },
                            {
                                label: '厂家色名',
                                disabled: false,
                                id: 57,
                                value: true
                            },
                            {
                                label: '供应商货号',
                                disabled: false,
                                id: 100,
                                value: true
                            },
                            //注释条形码，以后会启用，勿删
                            // {
                            //     label: '条形码',
                            //     disabled: false,
                            //     id: 58,
                            //     value: true
                            // },
                        ]
                    },
                    attrsInfo: {
                        title: '属性信息',
                        prop: 'id',
                        model: [],
                        list: [
                            {
                                label: '品牌',
                                disabled: false,
                                id: 8,
                                value: false
                            },
                            {
                                label: '品类',
                                disabled: false,
                                id: 30,
                                value: false
                            },
                            {
                                label: '设计师',
                                disabled: false,
                                id: 9,
                                value: true
                            },
                            {
                                label: '年份',
                                disabled: false,
                                id: 13,
                                value: true
                            },
                            {
                                label: '月份',
                                disabled: false,
                                id: 15,
                                value: true
                            },
                            {
                                label: '季节',
                                disabled: false,
                                id: 14,
                                value: true
                            },
                            {
                                label: '分类',
                                disabled: false,
                                id: 10,
                                value: true
                            },
                            {
                                label: '标签',
                                disabled: false,
                                id: 12,
                                value: true
                            },
                            {
                                label: '风格',
                                disabled: false,
                                id: 11,
                                value: true
                            },

                            {
                                label: '波段',
                                disabled: false,
                                id: 16,
                                value: true
                            }
                        ]
                    },
                    goodsInfo: {
                        title: '描述信息',
                        prop: 'id',
                        model: [],
                        list: [
                            {
                                label: '商品描述',
                                disabled: false,
                                id: 22,
                                value: true
                            },
                            {
                                label: '模式',
                                disabled: false,
                                id: 37,
                                value: true
                            },
                            {
                                label: '上市日期',
                                disabled: false,
                                id: 38,
                                value: true
                            },
                            {
                                label: '国际码',
                                disabled: false,
                                id: 39,
                                value: true
                            },
                            {
                                label: '开发部门',
                                disabled: false,
                                id: 40,
                                value: true
                            },
                            {
                                label: '开发者',
                                disabled: false,
                                id: 41,
                                value: true
                            },
                            // {
                            //     label: '样衣图转商品图',
                            //     disabled: false,
                            //     id: 28,
                            //     value: true
                            // }
                        ]
                    },
                    priceInfo: {
                        title: '价格信息',
                        prop: 'id',
                        model: [],
                        list: [
                            {
                                label: '销售价',
                                disabled: false,
                                id: 60,
                                value: true
                            },
                            {
                                label: '吊牌价',
                                disabled: false,
                                id: 44,
                                value: true
                            },
                            {
                                label: '动销价',
                                disabled: false,
                                id: 77,
                                value: true
                            },
                            {
                                label: '动销价比',
                                disabled: false,
                                id: 70,
                                value: true
                            },
                            {
                                label: '物料成本',
                                disabled: false,
                                id: 68,
                                value: true
                            },
                            {
                                label: '加工成本',
                                disabled: false,
                                id: 69,
                                value: true
                            },
                            {
                                label: '计划成本价',
                                disabled: false,
                                id: 61,
                                value: true
                            },{
                                label: '最初供货价',
                                disabled: false,
                                id: 42,
                                value: true
                            },
                            {
                                label: '我司核价',
                                disabled: false,
                                id: 43,
                                value: true
                            },
                            {
                                label: '最终供货价',
                                disabled: false,
                                id: 52,
                                value: true
                            },
                        ]
                    },
                    attachmentNames: {
                        title: '附件',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                    samples: {
                        title: '样衣信息',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                    processForms: {
                        title: '工艺信息',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                    boms: {
                        title: 'BOM表',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                    templates:{
                        title: '工序模板',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                    costs:{
                        title: '计划成本核算',
                        prop: 'id',
                        model: [],
                        list: []
                    },
                },
                copyString:{},
                autoUpdateGoods:false,// 通过后自动生成/更新商品档案的对应字段
                changeDesignListUpdateGoods:false,// 更改设计档案后提示更新商品
                customFieldIds:[],

            }
        },
        watch:{
            selectedArr(val){
                if(!val) return;
                this.checkItem();
                this.autoUpdateGoods = val.some(item =>item.fieldId==0)
                this.changeDesignListUpdateGoods = val.some(item =>item.fieldId=='00')
            },
            dialogVisible(val){
                if(val &&this.from === 'nodeDesignCreate'){
                    this.getCustomFieldList()
                }
            }

        },
        mounted(){
            this.fetchCheckListData();
            console.log(this.from,'this.from')
            if(this.from === 'nodeDesignCreate' || this.from === 'nodeDesignList') {
                this.getConfigNames()
            }
        },
        created() {
            // 新建设计节点和设计节点列表页面没有样衣，工艺和bom,所以删除这三个属性
            if(this.from === 'nodeDesignCreate' || this.from === 'nodeDesignList'){
                delete this.checkConf.samples;
                delete this.checkConf.processForms;
                delete this.checkConf.boms;
            }
            this.copyString = JSON.stringify(this.checkConf);
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            title(){
                if(this.from === 'nodeDesignCreate' || this.from === 'nodeDesignList'){
                    return "配置生成商品默认字段"
                }else{
                    return "生成商品档案"
                }
            }
        },
        components: {
            // DetailMainTable,
            InfoCollapseItem
        },
        methods: {
            // 获取附件和自定义属性名称的内容
            getConfigNames() {
                this.loading = true
                configNames({userId:this.userId}).then(res => {
                    this.dataNodeGenerateStyle = res.data.data
                    let baseInfosArr = [];
                    let baseInfos = res.data.data.baseInfos
                    baseInfos.forEach((item,index)=>{
                        if(['checkSkuAttrId1','checkSkuAttrId2','checkSkuAttrId3'].indexOf(item.code)>-1){
                            baseInfosArr.push(
                                {
                                    label: item.name,
                                    disabled: false,
                                    id: 62+index,
                                    value: true
                                }
                            )
                        }
                    });
                    baseInfosArr.push(
                        {
                            label: 'SKU备注',
                            disabled: false,
                            id: 65,
                            value: true
                        },
                        {
                            label: '设计图转商品图',
                            disabled: false,
                            id: 66,
                            value: true
                        },
                        {
                            label: '创意图转商品图',
                            disabled: false,
                            id: 67,
                            value: true
                        },
                    )
                    // 自定义属性
                    let attrList = []
                    let data = res.data.data.attrNames
                    let num = 31
                    let attrNum = 48
                    data.forEach( i => {
                        if(i.code != 'checkField6' && i.code != 'checkField7' && i.code != 'checkField8') {
                            attrList.push({
                                label: i.name,
                                disabled: false,
                                id: num,
                                value: true
                            })
                        } else {
                            attrList.push({
                                label: i.name,
                                disabled: false,
                                id: attrNum,
                                value: true
                            })
                        }
                        attrNum++
                        num++
                    })
                    // 附件
                    let attachmentList = res.data.data.attachmentNames
                    let attachmenrNum = 46
                    let list = []
                    attachmentList.forEach( i => {
                        list.push({
                            label: i.name,
                            disabled: false,
                            id: attachmenrNum,
                            value: true
                    })
                        attachmenrNum++
                    })
                    // attachmentNames
                    this.$nextTick(() => {
                        this.checkConf.baseInfo.list = this.checkConf.baseInfo.list.concat(baseInfosArr)
                        this.checkConf.attrsInfo.list = this.checkConf.attrsInfo.list.concat(attrList)
                        this.checkConf.attachmentNames.list = list
                    })
                    console.log(this.checkConf,'00099')
                    this.loading = false
                })
            },
            //选中已选选项
            checkItem(){
                //每次弹窗修改之前还原默认值
                this.checkConf = JSON.parse(this.copyString);

                if(this.selectedArr&&this.selectedArr.length){

                    this.selectedArr.forEach(item =>{
                        let fieldId = parseInt(item.fieldId);
                        if(item.parentId === '36'&&item.fieldId.length ==32){
                            fieldId = item.fieldId
                        }

                        //设计基本信息
                        //由于后面新增的  设计图转商品图/创意图转商品图的节点没有parentId(后面应该具体确认下给个parentId才可以)
                        if(item.parentId === '1'||item.fieldId ==='66'||item.fieldId ==='67'){
                            let baseInfoModel = this.checkConf.baseInfo.model;
                            if(!baseInfoModel.includes(fieldId)){
                                baseInfoModel.push(fieldId);
                            }
                        }
                        // 通过后自动生成/更新商品档案的对应字段
                        else if(item.fieldId === '0') {
                            this.autoUpdateGoods = true
                        }
                        else if(item.fieldId === '00') {
                            this.changeDesignListUpdateGoods = true
                        }
                        //属性信息
                        else if(item.parentId === '7'){
                            let attrsInfoModel = this.checkConf.attrsInfo.model;
                            if(!attrsInfoModel.includes(fieldId)){
                                attrsInfoModel.push(fieldId);
                            }
                        }
                        //描述信息
                        else if(item.parentId === '36'){
                            console.log(item,111)
                            let goodsInfoModel = this.checkConf.goodsInfo.model;
                            if(!goodsInfoModel.includes(fieldId)){
                                goodsInfoModel.push(fieldId);
                            }
                        }
                        //价格信息
                        else if(item.parentId === '59'){
                            let priceInfoModel = this.checkConf.priceInfo.model;
                            if(!priceInfoModel.includes(fieldId)){
                                priceInfoModel.push(fieldId);
                            }
                        }
                        // 附件
                        else if(item.parentId === '45'){
                            let attachmentNamesModel = this.checkConf.attachmentNames.model;
                            if(!attachmentNamesModel.includes(fieldId)){
                                attachmentNamesModel.push(fieldId);
                            }
                        }
                    })
                }
                this.getCustomFieldList()
                this.initCheckList(this.dataNodeGenerateStyle);
            },
            // 获取生成档案选择数据列表
            fetchCheckListData() {
                // 权限
                // if(!this.powerJudgement.permissions("fac.spl.design.mission.node.generate")){
                //     return
                // }
                // let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                // if (powerlist.indexOf('fac.spl.design.mission.node.generate') == -1) {
                //     return
                // }
                console.log(this.missionPrcd,'missionPrcd');
                if(this.missionPrcd){
                    const designStyleId = this.missionPrcd.designStyleId;
                    const prcdNodeId = this.missionPrcd.prcdNodeId;
                    this.visible.btnLoading = true;
                    this.loading = true;
                    getDesignNodeGenerateStyle({ designStyleId ,prcdNodeId}).then(res => {
                        this.visible.btnLoading = false;
                        this.dataNodeGenerateStyle = res.data.data;
                        this.selectedArr = res.data.data.fields;
                        this.loading = false
                    });
                }
            },
            initCheckList(data) {
                if(data){
                    if(data['samples']){
                        this.checkConf['samples'].list = data['samples'].map(item => {
                            return {
                                label: item.sampleNo,
                                id: item.sampleId,
                                disabled: false,
                                bomIds: item.bomIds || [],
                                costIds: item.costIds || [],
                                templataIds: item.templataIds || [],
                                processFormIds: item.processFormIds || []
                            }
                        });
                        this.checkConf['samples'].list.push({
                            label: '样衣图转商品图',
                            disabled: false,
                            id: 28,
                            value: true,
                            bomIds:  [],
                            processFormIds:  []
                        })

                    }
                    if(data['boms']){
                        this.checkConf['boms'].list = data['boms'].map(item => {
                            return {
                                label: item.bomName,
                                id: item.bomId,
                                disabled: item.isDefault,
                                hasSingleDosage: item.hasSingleDosage,
                                hasStyleSku:item.hasStyleSku,
                                isDefault:item.isDefault,
                                selectedCount:0 //用于存储被选中的次数

                            }
                        });
                        data['boms'].forEach(item=>{
                            if(item.isDefault){
                                this.checkConf['boms'].model.push(item.bomId)
                            }
                        })
                    }
                    if(data['templates']){
                        this.checkConf['templates'].list = data['templates'].map(item => {
                            return {id: item.id,label:item.name,disabled:item.isDefault,isDefault:item.isDefault}
                        });
                        data['templates'].forEach(item=>{
                            if(item.isDefault){
                                this.checkConf['templates'].model.push(item.id)
                            }
                        })
                    }
                    if(data['costs']){
                        this.checkConf['costs'].list = data['costs'].map(item => {
                            return {id: item.id,label:item.name,disabled:item.isDefault,isDefault:item.isDefault}
                        });
                        data['costs'].forEach(item=>{
                            if(item.isDefault){
                                this.checkConf['costs'].model.push(item.id)
                            }
                        })
                    }
                    if(data['processForms']){
                        this.checkConf['processForms'].list = data['processForms'].map(item => {
                            return {
                                label: item.processFormName,
                                id: item.processFormId,
                                disabled: false,
                                selectedCount: 0 //用于 存储被选中的次数

                            }
                        });
                    }
                    // 自定义属性
                    if(data['attrNames']){
                        let attrList = []
                        let num = 31;
                        let attrNum = 48
                        data['attrNames'].forEach(item => {
                            if (item.code != 'checkField6' && item.code != 'checkField7' && item.code != 'checkField8') {
                                attrList.push(
                                    {
                                        label: item.name,
                                        disabled: false,
                                        id: num,
                                        value: true
                                    })
                            } else {
                                attrList.push(
                                    {
                                        label: item.name,
                                        disabled: false,
                                        id: attrNum,
                                        value: true
                                    })
                            }
                                attrNum++
                                num++
                        });
                        this.checkConf['attrsInfo'].list = this.checkConf['attrsInfo'].list.concat(attrList)
                    }
                    //基本信息
                    if(data['baseInfos']){
                        let baseInfosArr = [];
                        data['baseInfos'].forEach((item,index)=>{
                            if(['checkSkuAttrId1','checkSkuAttrId2','checkSkuAttrId3'].indexOf(item.code)>-1){
                                baseInfosArr.push(
                                    {
                                        label: item.name,
                                        disabled: false,
                                        id: 62+index,
                                        value: true
                                    }
                                )
                            }
                        });
                        baseInfosArr.push(
                            {
                                label: 'SKU备注',
                                disabled: false,
                                id: 65,
                                value: true
                            },
                            {
                                label: '设计图转商品图',
                                disabled: false,
                                id: 66,
                                value: true
                            },
                            {
                                label: '创意图转商品图',
                                disabled: false,
                                id: 67,
                                value: true
                            },
                        )
                        this.checkConf['baseInfo'].list = this.checkConf['baseInfo'].list.concat(baseInfosArr)

                    }
                    // 附件
                    if(data['attachmentNames']){
                        let list = []
                        let attachmenrNum = 46
                        data['attachmentNames'].forEach(item => {
                            list.push(
                                {
                                    label: item.name,
                                    disabled: false,
                                    id: attachmenrNum,
                                    value: true
                                })
                                attachmenrNum++
                        });
                        this.checkConf['attachmentNames'].list = list
                    }
                }
                // console.log(this.checkConf,'9999感冒颗粒');
            },
            handleChange(val, type) {
                // console.log(val,type,"传回来什么数据")
                if (type === 'samples') {
                    const samplesChecked = this.checkConf['samples'].list.find(item => item.id === val);
                    const { bomIds, processFormIds,costIds,templataIds } = samplesChecked;
                    const isCancel = this.checkConf['samples'].model.indexOf(val) === -1; // 当选中的数据不存在val时，为取消
                    console.log(this.checkConf,'传过去的关联id')
                    if (isCancel) {
                        // 取消某个勾选
                        this.valueSetDisableAndModel('costs',costIds,false)
                        this.valueSetDisableAndModel('templates',templataIds,false)
                        this.valueSetDisableAndModel('boms',bomIds,false)
                        this.valueSetDisableAndModel('processForms',processFormIds,false)
                        // this.filterCheckedModel(bomIds, processFormIds);
                    }
                    else {
                        // 勾选某个
                        this.valueSetDisableAndModel('costs',costIds,true)
                        this.valueSetDisableAndModel('templates',templataIds,true)
                        this.valueSetDisableAndModel('boms',bomIds,true)
                        this.valueSetDisableAndModel('processForms',processFormIds,true)
                        // this.concatCheckedModel(bomIds, processFormIds);
                    }
                }
            },
            valueSetDisableAndModel(key,ids,flag){
                if(!ids || !ids.length) return;
                //剔除默认的id

                this.checkConf[key].list.forEach(item=>{
                    ids.forEach($item=>{
                        if(item.id===$item && !item.isDefault){

                            this.$set(item,'disabled',flag);
                            let index = this.checkConf[key].model.indexOf($item)
                            if(index===-1 && flag){
                                this.checkConf[key].model.push($item)
                            }
                            if(index>-1&&!flag){
                                this.checkConf[key].model.splice(index,1)
                            }
                        }
                    })
                })
            },
            handleSelectAllChange(checkAll, type) {
                if (type === 'samples') {
                    if (checkAll) {
                        console.log(this.checkConf['samples'].list);
                        this.checkConf['samples'].list.forEach(item => {
                            const { bomIds, processFormIds, costIds,templataIds} = item;
                            this.valueSetDisableAndModel('costs',costIds,true)
                            this.valueSetDisableAndModel('templates',templataIds,true)
                            this.valueSetDisableAndModel('boms',bomIds,true)
                            this.valueSetDisableAndModel('processForms',processFormIds,true)
                            // this.concatCheckedModel(bomIds, processFormIds);
                        });
                    }
                    else {
                        this.checkConf['samples'].list.forEach(item => {
                            const { bomIds = [], processFormIds = [] ,costIds,templataIds} = item;
                            this.valueSetDisableAndModel('costs',costIds,false)
                            this.valueSetDisableAndModel('templates',templataIds,false)
                            this.valueSetDisableAndModel('boms',bomIds,false)
                            this.valueSetDisableAndModel('processForms',processFormIds,false)
                            // this.filterCheckedModel(bomIds, processFormIds);
                        });
                    }
                }
            },
            // 样衣选中值关联工艺和bom（选中的时候，在对应的bom表或工艺信息里面存被选中的次数，取消的时候，根据被选中的次数是否为1来判断要不要取消选中）
            concatCheckedModel(bomIds, processFormIds) {
                this.setSelectedCount('processForms', processFormIds, true);
                this.setSelectedCount('boms', bomIds, true);
                processFormIds.forEach(item =>{
                    if(this.checkConf['processForms'].model.indexOf(item)===-1){
                        this.checkConf['processForms'].model = this.checkConf['processForms'].model.concat(item);
                    }
                })
                bomIds.forEach(item =>{
                    if(this.checkConf['boms'].model.indexOf(item)===-1){
                        this.checkConf['boms'].model = this.checkConf['boms'].model.concat(item);
                    }
                })
                this.setDisabled('processForms', processFormIds, true);
                this.setDisabled('boms', bomIds, true);

            },
            // 样衣取消选中过滤
            filterCheckedModel(bomIds, processFormIds) {
                // 通过在bom表和工艺信息对应的item里面存储selectedCount（被选中的次数），来决定样衣信息取消选中的时候，工艺信息和bom表对应被引用的item要不要取消选中
                // 为什么这样做？因为不同样衣信息item里面的所引用的工艺信息和bom表有可能是同一个
                this.setSelectedCount('processForms', processFormIds, false);
                this.setSelectedCount('boms', bomIds, false);
                // this.checkConf['processForms'].model = []
                this.checkConf['processForms'].list.forEach(item =>{
                    // 检查selectedCount===0并且和样衣档案有关联的id
                    if(item.selectedCount===0&&processFormIds.indexOf(item.id)>-1){
                        item.disabled = false
                        console.log( this.checkConf['processForms'].model,'删除前')
                        let itemIdIndex =  this.checkConf['processForms'].model.indexOf(item.id)
                        console.log(itemIdIndex,'要删除的索引')
                        this.checkConf['processForms'].model.splice(itemIdIndex,1)
                        console.log( this.checkConf['processForms'].model,'删除后')

                    }
                })
                this.checkConf['boms'].list.forEach(item =>{
                    // 检查selectedCount===0并且和样衣档案有关联的id
                    if(item.selectedCount===0&&bomIds.indexOf(item.id)>-1){
                        console.log(item.label,'进来了')
                        item.disabled = false
                        let itemIdIndex =  this.checkConf['boms'].model.indexOf(item.id)
                        this.checkConf['boms'].model.splice(itemIdIndex,1)
                    }
                })
                // this.checkConf['processForms'].model = this.checkConf['processForms'].model.filter(modelItem => processFormIds.indexOf(modelItem) === -1);
                // this.checkConf['boms'].model = this.checkConf['boms'].model.filter(modelItem => bomIds.indexOf(modelItem) === -1);
                // this.setDisabled('processForms', processFormIds, false);
                // this.setDisabled('boms', bomIds, false);
            },
            //checkbox设置不可用
            setDisabled(obj, arr, disabled) {
                if (!arr) return;
                this.checkConf[obj].list.forEach(item => {
                    if (arr.indexOf(item.id) > -1) {
                        item.disabled = disabled;
                    }
                });
            },
            setSelectedCount(obj,arr,isAdd){
                if (!arr) return;
                this.checkConf[obj].list.forEach(item => {
                    if (arr.indexOf(item.id) > -1) {
                        if(isAdd){
                            item.selectedCount = item.selectedCount+1
                        } else{
                            item.selectedCount = item.selectedCount-1
                        }
                    }
                });
            },
            // 提交生成商品档案
            submit() {
                //设计节点管理
                if(this.from === 'nodeDesignList'){
                    this.$emit('update:dialogVisible',false);
                    // 如果是大货物型节点，并且选中通过后自动生成/更新商品档案的对应字段，将 autoUpdateGoods:{model:[0]} 塞到checkConf里面，表示选中
                    if(this.nodeTypeCode ==='LAST_REVIEW'){
                        this.checkConf.autoUpdateGoods ={
                            model:this.autoUpdateGoods?[0]:[]
                        }
                    }
                    if(this.nodeTypeCode ==='LAST_REVIEW' || this.nodeTypeCode ==='REVIEW'){
                        this.checkConf.changeDesignListUpdateGoods ={
                            model:this.changeDesignListUpdateGoods?['00']:[]
                        }
                    }

                    this.$emit('commitGoodsList',this.checkConf);
                    return
                }
                //新建设计节点
                if(this.from === 'nodeDesignCreate'){
                    this.$emit('update:dialogVisible',false);
                    // 如果是大货物型节点，并且选中通过后自动生成/更新商品档案的对应字段，将 autoUpdateGoods:{model:[0]} 塞到checkConf里面，表示选中
                    if(this.nodeTypeCode ==='LAST_REVIEW' ){
                        this.checkConf.autoUpdateGoods ={
                            model:this.autoUpdateGoods?[0]:[]
                        }
                    }
                    if(this.nodeTypeCode ==='LAST_REVIEW' || this.nodeTypeCode ==='REVIEW'){
                        this.checkConf.changeDesignListUpdateGoods ={
                            model:this.changeDesignListUpdateGoods?['00']:[]
                        }
                    }
                    this.$emit('getGoodsList',this.checkConf);
                    this.$message.success('配置成功');
                    return
                }
                // 生成商品档案
                if(!this.missionPrcd.styleId){
                    this.createDesignNodeGenerateStyle()
                }else {
                    //弹框是否更新
                    this.updateGoodsNew=true
                }
            },
            //更新
            updateDialoVisibleGo(){
                this.createDesignNodeGenerateStyle()
            },
            //生成商品档案接口请求
            createDesignNodeGenerateStyle(){
                console.log("这里面：",this.checkConf['baseInfo']);
                const designStyleId = this.missionPrcd.designStyleId
                let checkCustomFieldIds = []
                this.checkConf['goodsInfo'].model.forEach(item =>{
                    if(this.customFieldIds.includes(item)){
                        checkCustomFieldIds.push(item)
                    }
                })
                console.log(this.checkConf);
                const params = {
                    userId: this.userId,
                    unitId: this.unitId,
                    designStyleId,
                    missionPrcdNodeId: this.missionPrcd.missionPrcdNodeId,
                    checkOutsideFactory:this.checkConf['baseInfo'].model.includes(28), //供应商
                    checkPlantArticleNumber:this.checkConf['baseInfo'].model.includes(29), //厂家货号
                    checkFactoryColorNo:this.checkConf['baseInfo'].model.includes(56), //厂家色号
                    checkFactoryColorName:this.checkConf['baseInfo'].model.includes(57), //厂家色名
                    checkCofNo:this.checkConf['baseInfo'].model.includes(100), //厂家色名
                    checkSkuAttrId1:this.checkConf['baseInfo'].model.includes(62), //sku属性1
                    checkSkuAttrId2:this.checkConf['baseInfo'].model.includes(63), //sku属性2
                    checkSkuAttrId3:this.checkConf['baseInfo'].model.includes(64), //sku属性3
                    checkSkuRemark:this.checkConf['baseInfo'].model.includes(65), //sku备注
                    checkDesignToStylePicture:this.checkConf['baseInfo'].model.includes(66), //设计图转商品图
                    checkCreativityToStylePicture:this.checkConf['baseInfo'].model.includes(67), //创意图转商品图
                    // checkBarcode:this.checkConf['baseInfo'].model.includes(58), //条形码
                    checkBarcode:this.bossUnitId==='d7fd1f7f3f6948d7ac9021873a38d09e'?true:this.checkConf['baseInfo'].model.includes(58), //七个半环境必传true 否则按原逻辑处理
                    checkBrand:this.checkConf['attrsInfo'].model.includes(8), //品牌
                    checkDesigner:this.checkConf['attrsInfo'].model.includes(9), //设计师
                    checkCategory:this.checkConf['attrsInfo'].model.includes(10), //分类
                    checkStyle:this.checkConf['attrsInfo'].model.includes(11), //风格
                    checkTag:this.checkConf['attrsInfo'].model.includes(12), //标签
                    checkYear:this.checkConf['attrsInfo'].model.includes(13), //年份
                    checkSeason:this.checkConf['attrsInfo'].model.includes(14), //季节
                    checkMonth:this.checkConf['attrsInfo'].model.includes(15), //月份
                    checkBand:this.checkConf['attrsInfo'].model.includes(16), //波段
                    checkCategorySmall:this.checkConf['attrsInfo'].model.includes(30), //品类
                    checkField1:this.checkConf['attrsInfo'].model.includes(31), //商品属性1
                    checkField2:this.checkConf['attrsInfo'].model.includes(32), //商品属性2
                    checkField3:this.checkConf['attrsInfo'].model.includes(33), //商品属性3
                    checkField4:this.checkConf['attrsInfo'].model.includes(34), //商品属性4
                    checkField5:this.checkConf['attrsInfo'].model.includes(35), //商品属性5
                    checkField6:this.checkConf['attrsInfo'].model.includes(53), //商品属性6
                    checkField7:this.checkConf['attrsInfo'].model.includes(54), //商品属性7
                    checkField8:this.checkConf['attrsInfo'].model.includes(55), //商品属性8
                    checkStyleDesc:this.checkConf['goodsInfo'].model.includes(22), //商品描述
                    checkModel:this.checkConf['goodsInfo'].model.includes(37), //模式
                    checkDateListing:this.checkConf['goodsInfo'].model.includes(38), //上市日期
                    checkInternationalCode:this.checkConf['goodsInfo'].model.includes(39), //国际码
                    checkDevelopmentDepartment:this.checkConf['goodsInfo'].model.includes(40), //开发部门
                    checkDeveloper:this.checkConf['goodsInfo'].model.includes(41), //开发者
                    checkFirstSupplyPrice:this.checkConf['priceInfo'].model.includes(42), //最初供货价
                    checkAccountingPrice:this.checkConf['priceInfo'].model.includes(43), //我司核价
                    checkRetailPrice:this.checkConf['priceInfo'].model.includes(44), //吊牌价
                    checkSampleToStylePicture:this.checkConf['samples'].model.includes(28), //样衣图转商品图
                    checkLastSupplyPrice:this.checkConf['priceInfo'].model.includes(52), //最终供货价
                    checkAttachmentList1:this.checkConf['attachmentNames'].model.includes(46), //附件1
                    checkAttachmentList2:this.checkConf['attachmentNames'].model.includes(47), //附件2
                    checkAttachmentList3:this.checkConf['attachmentNames'].model.includes(48), //附件3
                    checkAttachmentList4:this.checkConf['attachmentNames'].model.includes(49), //附件4
                    checkAttachmentList5:this.checkConf['attachmentNames'].model.includes(50), //附件5
                    checkAttachments:this.checkConf['attachmentNames'].model.includes(51), //其他附件
                    checkPrice:this.checkConf['priceInfo'].model.includes(60), //销售价
                    checkCost:this.checkConf['priceInfo'].model.includes(61), //计划成本价
                    checkSellPrice:this.checkConf['priceInfo'].model.includes(77), //动销价
                    checkSellPricePop:this.checkConf['priceInfo'].model.includes(70), //动销价比
                    checkMaterialCost:this.checkConf['priceInfo'].model.includes(68), //物料成本价
                    checkProcessingCost:this.checkConf['priceInfo'].model.includes(69), //加工成本价
                    // checkSampleToStylePicture:this.checkConf['goodsInfo'].model.includes(28), //样衣图转商品图
                    sampleIds: this.checkConf['samples'].model, //样衣信息
                    bomIds: this.checkConf['boms'].model,   //bom表
                    costIds: this.checkConf['costs'].model,   //bom表
                    templateIds: this.checkConf['templates'].model,   //bom表
                    processFormIds: this.checkConf['processForms'].model,    //工艺信息
                    checkCustomFieldIds:checkCustomFieldIds ,//自定义字段相关id
                };
                const hasSingleDosage = params.bomIds.length && this.checkConf['boms'].list.some(item => params.bomIds.includes(item.id) && !item.hasSingleDosage);
                if (hasSingleDosage) {
                    return this.$message.error('尚未填单件用量');
                }
                console.log(params,'商品自动生成的参数')
                let flag = this.checkConf['costs'].list.some(item=>{
                    if(this.checkConf['costs'].model.indexOf(item.id)>-1&&item.isDefault){
                        this.updateCostName = item.label
                    }
                   return this.checkConf['costs'].model.indexOf(item.id)>-1&&item.isDefault
                })
                if(flag){
                    this.updateGoodsPriceParams = params
                    this.updateGoodsPrice = true
                    return
                }

                this.visible.btnLoading = true;
                this.visible.updateBtnLoading = true;
                if(this.updateGoodsType==='editDesignFile'){
                    this.updateGoodsPriceParams = params
                    this.$emit('updateEditDesignFile')
                    return

                }

                createDesignNodeGenerateStyle(params)
                    .then(res => {
                        this.visible.btnLoading = false;
                        this.visible.updateBtnLoading = false;
                        this.updateGoodsNew=false
                        if (res.data.code === 0) {
                            // this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                            // this.$emit('on-update');
                            // if(this.from==='designWorkbench'){
                            //     this.$emit('designWorkbenchUpdateNode')
                            // }
                            this.$emit('update:dialogVisible',false)
                            this.$emit('updateNode',designStyleId)

                            // 生成商品档案
                            if(!this.missionPrcd.styleId){
                                return this.$message.success('生成商品档案成功')
                            }else {
                                return this.$message.success('更新商品档案成功')
                            }
                            ;
                        };
                        this.$message.error(res.data.msg || '生成商品档案失败');
                    });

            },
            updateGoodsPriceGo(flag){
                this.updateGoodsPriceParams.isUpdateCost = flag
                this.visible.updatePriceBtnLoading = true;
                createDesignNodeGenerateStyle(this.updateGoodsPriceParams)
                    .then(res => {
                        this.visible.updatePriceBtnLoading = false;
                        this.updateGoodsNew=false
                        if (res.data.code === 0) {
                            // this.dispatch('SampleMissionDetail', 'update.mission.detail'); // index.vue created中$on的方法
                            // this.$emit('on-update');
                            // if(this.from==='designWorkbench'){
                            //     this.$emit('designWorkbenchUpdateNode')
                            // }
                            this.$emit('update:dialogVisible',false)
                            this.$emit('updateNode',this.missionPrcd.designStyleId)
                            // 生成商品档案
                            if(!this.missionPrcd.styleId){
                                return this.$message.success('生成商品档案成功')
                            }else {
                                return this.$message.success('更新商品档案成功')
                            }
                            ;
                        };
                        this.$message.error(res.data.msg || '生成商品档案失败');
                    });
            },
            cancel(){
                this.$emit('update:dialogVisible',false)
            },
            // 获取自定义字段的内容，塞到goodsInfo里面
            getCustomFieldList() {
                let params = {
                    module:'STYLE',
                    bossUnitId:this.bossUnitId
                }
                this.customFieldIds = []
                getCustomFieldList(params).then(res => {
                    if(res.data.code ==0){
                        let customFieldList = []
                        res.data.data.forEach(item => {
                            this.customFieldIds.push(item.customFieldId )
                            customFieldList.push({
                                label: item.customFieldName,
                                disabled: false,
                                id:item.customFieldId ,
                                value: true
                            })
                        })
                        this.checkConf.goodsInfo.list = this.checkConf.goodsInfo.list.concat(customFieldList)
                    }
                })
            },
        }
    }
</script>
<style lang="scss">
    .general-goods-dialog {
        &.el-dialog--small{
            width: 560px;
        }
        .el-dialog__body {
            position: relative;
        }
    }
    .tips-popper {
        background: #95A0B9;
    }
</style>


<style lang="scss" scoped>
    /*@import './common.scss';*/
    .tips {
        line-height: 18px;
        color: #fff;
    }
    .btn--submit {
        margin-left: 12px;
    }
    // 审核dialog
    .audit-tip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
        padding: 5px 16px;
        background: #F5F7FA
    }
    .audit-select {
        margin: 12px 0;
    }
    .collapse-wrap {
        margin-top: 12px;
    }
</style>
