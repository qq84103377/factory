<template>
    <base-box class="custom-filter-form box-shadow">
        <el-form class="clearfix"
                 label-width="80px">

            <!--<el-form-item class="filter-form__item" label="商品属性">-->
            <!--<goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset"></goods-attr-dialog>-->
            <!--</el-form-item>-->
            <!--<el-form-item class="filter-form__item" label="创建时间">-->
            <!--<el-date-picker-->
            <!--@change="orderDateChange"-->
            <!--v-model="createDateRange"-->
            <!--type="daterange"-->
            <!--placeholder="创建时间">-->
            <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <!--<el-form-item class="filter-form__item" label="创建人">-->
            <!--<workerLeader  v-model="filterFormData.creatorIds" placeholder="请选择创建人"></workerLeader>-->
            <!--</el-form-item>-->
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-form-item label="设计档案">
                    <rich-filter v-model="richFilterParams"
                                 dialogType='DESIGN_STYLE'
                                 placeholder="点击可筛选档案"
                                 modelName="SPL_DESIGN_STYLE"></rich-filter>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-form-item label="设计款号">
                    <el-select
                            v-model="filterFormData.designStyleNos"
                            remote
                            reserve-keyword
                            filterable
                            multiple
                            :remote-method="fetchGoodList"
                            clearable
                            placeholder="请选择或搜索">
                        <el-option v-for="item in options.designStyleList" :key="item.id" :label="item.name"
                                   :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <!--提报型节点和审核型节点筛选条件-->
            <el-col v-if="['SUBMIT','TYPING','SAMPLE','REVIEW','LAST_REVIEW'].indexOf(currentNode.type)>-1" :xs="12" :sm="12" :md="12"
                    :lg="6">
                <el-form-item  label="商品款号">
                    <design-goods-select v-model="filterFormData.styleNos" :needStyleNo="true" :multiple="true"></design-goods-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-form-item  label="负责人">
                    <v-user-select v-model="filterFormData.chargerIds " :options="options.groupOptions" @remote="fetchUnitUser" placeholder="请选择负责人"></v-user-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-form-item  label="负责组">
                    <charge-group-select placeholder="全部" :multiple="true" v-model="filterFormData.groupIds" :groupList="options.chargeGroup"></charge-group-select>
                </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <!--提报状态、打版状态、样衣状态、评审状态 公用此字段（都是对设计工单状态的筛选）-->
                <el-form-item :label="filterLabel.submitStatus">
                    <filter-check-group multiple v-model="filterFormData.status">
                        <filter-check-item
                                v-for="item in workbenchStatusList"
                                :options="workbenchStatusList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.name">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.status"-->
                    <!--filterable-->
                    <!--multiple-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in workbenchStatusList" :key="item.value" :label="item.name"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'SUBMIT'||currentNode.type === 'REVIEW'" :xs="12" :sm="12" :md="12"
                    :lg="6">
                <el-form-item label="商品描述">
                    <filter-check-group v-model="filterFormData.hasStyleDesc">
                        <filter-check-item
                                v-for="item in options.hasStyleDescList"
                                :options="options.hasStyleDescList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.hasStyleDesc"-->
                    <!--clearable-->
                    <!--placeholder="请选择或搜索">-->
                    <!--<el-option v-for="item in options.hasStyleDescList" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'TYPING'" :xs="12" :sm="12" :md="12" :lg="6">
                <!--打扮版型节点筛选条件-->
                <el-form-item label="打版文件">
                    <filter-check-group v-model="filterFormData.hasTypingFile">
                        <filter-check-item
                                v-for="item in options.hasTypingFileList"
                                :options="options.hasTypingFileList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.hasTypingFile"-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in options.hasTypingFileList" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'SAMPLE'" :xs="12" :sm="12" :md="12" :lg="6">
                <!--样衣型节点筛选条件-->
                <el-form-item label="样衣图">
                    <filter-check-group v-model="filterFormData.hasSamplePicture">
                        <filter-check-item
                                v-for="item in options.hasSamplePictureList"
                                :options="options.hasSamplePictureList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.hasSamplePicture"-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in options.hasSamplePictureList" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'REVIEW' || currentNode.type === 'LAST_REVIEW'" :xs="12" :sm="12"
                    :md="12" :lg="6">
                <!--审核型、终审型节点筛选条件-->
                <el-form-item label="档案状态">
                    <filter-check-group v-model="filterFormData.designStyleStatus">
                        <filter-check-item
                                v-for="item in options.designStyleStatus"
                                :options="options.designStyleStatus"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.designStyleStatus"-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in options.designStyleStatus" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'REVIEW' || currentNode.type === 'LAST_REVIEW'" :xs="12" :sm="12"
                    :md="12" :lg="6">
                <!--审核型、终审型节点筛选条件-->
                <el-form-item label="商品状态">
                    <filter-check-group v-model="filterFormData.goodsStatus">
                        <filter-check-item
                                v-for="item in options.goodsStatus"
                                :options="options.goodsStatus"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.goodsStatus"-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in options.goodsStatus" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'SUBMIT' || currentNode.type === 'TYPING' || currentNode.type === 'SAMPLE' || currentNode.type === 'REVIEW'"
                    :xs="12" :sm="12" :md="12" :lg="6">
                <!-- 除终审型以外的筛选 'SUBMIT','TYPING','SAMPLE','REVIEW'-->
                <el-form-item label="被驳回">
                    <filter-check-group v-model="filterFormData.hasReject">
                        <filter-check-item
                                v-for="item in options.reject"
                                :options="options.reject"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.hasReject"-->
                    <!--clearable-->
                    <!--placeholder="请选择或搜索">-->
                    <!--<el-option v-for="item in options.reject" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <el-col v-if="currentNode.type === 'SAMPLE'|| currentNode.type === 'TYPING'" :xs="12" :sm="12" :md="12"
                    :lg="6">
                <!--样衣型、打版师节点筛选条件-->
                <el-form-item :label="currentNode.type === 'SAMPLE'?'样衣师分配':'版师分配'">
                    <filter-check-group v-model="filterFormData.submitStatus">
                        <filter-check-item
                                v-for="item in options.submitStatusList"
                                :options="options.submitStatusList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </filter-check-item>
                    </filter-check-group>
                    <!--<el-select-->
                    <!--v-model="filterFormData.submitStatus"-->
                    <!--clearable-->
                    <!--placeholder="全部">-->
                    <!--<el-option v-for="item in options.submitStatusList" :key="item.value" :label="item.label"-->
                    <!--:value="item.value">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
            </el-col>
            <div>
                <el-col v-for="(item,index) in options.reviewStatus" :key="index" v-if="currentNode.type === 'REVIEW'" :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item :label="`评审状态(${item.name})`" label-width="75px">
                            <filter-check-group multiple v-model="statusList[index].status">
                                <filter-check-item
                                        v-for="item in options.status"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></filter-check-item>
                             </filter-check-group>
                    </el-form-item>
                </el-col>
            </div>
            <!--提报人、版师、样衣师都是同一个字段-->
            <!--<el-form-item v-if="currentNode.type === 'SUBMIT'|| currentNode.type === 'TYPING'|| currentNode.type ==='SAMPLE'" class="filter-form__item" :label="filterLabel.submitPerson">-->
                <!--<workerLeader :manListProps="selectPersonList"  v-model="filterFormData.submitters"  :placeholder="'请选择'+filterLabel.submitPerson"></workerLeader>-->
                <!--&lt;!&ndash;<v-user-select v-model=" filterFormData.submitters " :options="options.groupOptions" @remote="fetchUnitUser" :placeholder="'请选择'+filterLabel.submitPerson"></v-user-select>&ndash;&gt;-->
            <!--</el-form-item>-->
            <!--版师\样衣师-->

        </el-form>
        <!--检查项筛选-->
        <div style="border-top: 1px solid #E6EAF0;padding-top: 10px;" v-if="isCollapse&&currentNode.type != 'REVIEW'">
            <el-form
                    class="clearfix"
                    label-width="80px">
                <el-col v-for="(item,index) in checkDataList" :key="index" :xs="12" :sm="12" :md="12" :lg="6">
                    <el-form-item :label="item.attrName">
                        <el-select
                                v-model="item.check"
                                clearable
                                placeholder="请选择">
                            <el-option v-for="item in options.check" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="btn-group">
            <el-button style="font-size: 12px;color: #808080" type="text" @click="isCollapse = !isCollapse"
                       v-if="currentNode.type != 'REVIEW'">检查项筛选
                <i class="icon" :class="[isCollapse ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
            </el-button>
            <el-button class="btn btn-reset" @click="reset">重置</el-button>
            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
        </div>

    </base-box>
</template>

<script>
    import FilterCheckGroup from '@/components/sampleCentre/mission/filter-check-group.vue';
    import FilterCheckItem from '@/components/sampleCentre/mission/filter-check-item.vue';
    import { selectFacCustomer , getPersonList , getUnitUser,goodsStyleNos, getRespGroup, getReviewStatus } from '@/api';
    import { getDesignNodeList, getDesignStyleList } from '@/api/sample-centre';
    import { designWorkbenchNodeStatusList } from '@/api/sample-centre';
    import chargeGroupSelect from '@/components/Common/custom-select/chargeGroupSelect'

    export default {
        props: {
            attrsData: Object,
            // selectPersonList: [],
            currentNode: Object,
            workbenchStatusList: [],
            checkDataList: [],
        },
        components: {
            FilterCheckGroup,
            FilterCheckItem,
            chargeGroupSelect,
        },
        data() {
            return {
                statusList: [], // 评审状态筛选参数
                richFilterParams:{
                }, //设计档案富筛选参数
                isCollapse: false,
                filterLabel:{
                    submitPerson:'提报人',
                    submitStatus:'提报状态'
                },
                isAttrSelectShow: false, // 属性筛选popover是否显示
                // isReset:false, //是否重置
                // createDateRange: '',
                filterFormData: {
                    hasReject: '',
                    designStyleNos: [],
                    designStyleStatus: 0,
                    // creatorIds: [],
                    goodsStatus: null,
                    chargerIds: [],
                    // submitters:[],
                    styleNos:[],
                    status: '',
                    hasStyleDesc: '',
                    hasTypingFile: '',
                    hasSamplePicture: '',
                    // attrIds: [],
                    // dateCreateStart:'',
                    // dateCreateEnd:'',
                    submitStatus: 0,
                    groupIds: [],
                },
                // attrFormData: { // 货品属性
                //     brand: [],
                //     designer: [],
                //     wave: [],
                //     kind: [],
                //     season: [],
                //     year: [],
                //     tag: []
                // },
                options: {
                    check: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '已填写',
                            value: 1
                        },
                        {
                            label: '未填写',
                            value: 2
                        },
                    ],
                    reject: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '被驳回',
                            value: 1
                        }
                    ],
                    goodsStatus: [
                        {
                            label: '全部',
                            value: null
                        },
                        {
                            label: '未生成商品',
                            value: 0
                        },
                        {
                            label: '已生成商品',
                            value: 1
                        }
                    ],
                    hasStyleDescList: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '未填写',
                            value: 2
                        },
                        {
                            label: '已填写',
                            value: 1
                        }
                    ],
                    designStyleStatus: [
                        {
                            label: '已提报',
                            value: 0
                        },
                        {
                            label: '已作废',
                            value: 1
                        },
                        {
                            label: '已完成',
                            value: 2
                        },
                        {
                            label: '未提报',
                            value: 3
                        },
                    ],
                    groupOptions:[],
                    chargeGroup:[],
                    designStyleList: [],
                    hasTypingFileList:[
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '已创建',
                            value: 1
                        },
                        {
                            label: '无',
                            value: 2
                        }
                    ],
                    hasSamplePictureList: [
                        {
                            label: '全部',
                            value: 0
                        },
                        {
                            label: '已创建',
                            value: 1
                        },
                        {
                            label: '未创建',
                            value: 2
                        }
                    ],
                    goodsStyleNos:[],
                    submitStatusList: [
                        {
                            label: '全部',
                            value:0
                        },
                        {
                            label: '未分配',
                            value:1
                        },
                        {
                            label: '已分配',
                            value:2
                        },
                    ],
                    reviewStatus: [],
                    status: [
                        {
                            label: '未评审',
                            value:0
                        },
                        {
                            label: '评审同意',
                            value:1
                        },
                        {
                            label: '评审不同意',
                            value:2
                        },
                    ],
                }
            }
        },
        created() {
            // this.getGoodsStyleNos();
            // this.fetchGoodList();
            this.fetchUnitUser();
        },

        watch: {
            'currentNode.id'(designPrcdNodeId) {
                if(designPrcdNodeId) {
                    getRespGroup({designPrcdNodeId,unitId:this.facId}).then(res => {
                        this.options.chargeGroup = res.data.data.map(v => {
                            return {groupName:v.name,groupId:v.id}
                        })
                    })
                    if(this.currentNode.type === 'REVIEW') {
                        getReviewStatus({userId:this.userId,unitId:this.facId,designPrcdNodeId}).then(res => {
                            this.options.reviewStatus = res.data.data
                            this.statusList = this.options.reviewStatus.map(item => {
                                return {id:item.id,status:[]}
                            })

                        })
                    }
                }
            },
            'currentNode.type'(val){

                console.log(val,'清楚筛选条件')
                this.reset()
                // 重新设置默认值
                if(this.currentNode.type === 'REVIEW' || this.currentNode.type === 'LAST_REVIEW'){
                    this.filterFormData.designStyleStatus = 0
                }
                if(this.currentNode.type === 'SAMPLE' || this.currentNode.type === 'TYPING'){
                    this.filterFormData.submitStatus = 0
                }
                console.log(this.filterFormData)
                switch (val){
                    case 'SUBMIT':
                        this.filterLabel.submitPerson ='提报人'
                        this.filterLabel.submitStatus = '提报状态'
                        break;
                    case 'TYPING':
                        this.filterLabel.submitPerson ='版师'
                        this.filterLabel.submitStatus = '打版状态'
                        break;
                    case 'SAMPLE':
                        this.filterLabel.submitPerson ='样衣师'
                        this.filterLabel.submitStatus = '样衣状态'
                        break;
                    case 'REVIEW':
                        this.filterLabel.submitPerson =''
                        this.filterLabel.submitStatus = '状态'
                        break;
                    case 'LAST_REVIEW':
                        this.filterLabel.submitPerson =''
                        this.filterLabel.submitStatus = '状态'
                        break;

                }
            },
            workbenchStatusList(val){
                // if(this.currentNode.type !== 'LAST_REVIEW'&&val&&val.length){
                if(val&&val.length){
                    let  defaultItem = val.find(item => item.defaultSelect == true)
                    this.filterFormData.status = [defaultItem.value]
                }
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            // currentAttrData() {
            //     const obj = {};
            //     Object.keys(this.attrsData).forEach(key => {
            //         if (this.attrFormData.hasOwnProperty(key)) {
            //             obj[key] = this.attrsData[key];
            //         }
            //     });
            //     return obj;
            // },
            // isSelectedAttrs() {
            //     return Object.keys(this.attrFormData).some(key => {
            //         return this.attrFormData[key].length;
            //     });
            // }
        },
        methods: {
            submit() {
                // this.filterFormData.attrIds = this.getAllAttrId();
                console.log(this.checkDataList,99999)
                let checkParams = {}
                this.checkDataList.forEach(v => {
                    checkParams[v.code] = v.check
                })
                this.$emit('on-filter', {...this.richFilterParams,...this.filterFormData,...checkParams,reviewStatus:this.currentNode.type === 'REVIEW'?this.statusList:[]});

            },
            reset() {

                this.richFilterParams = {}
                this.checkDataList.forEach(v => {
                    this.$set(v,'check','')
                })
                Object.keys(this.filterFormData).forEach(key => {
                    const isArr = Array.isArray(this.filterFormData[key]);
                    if (isArr) {
                        this.filterFormData[key] = [];
                    }
                    else {
                        this.filterFormData[key] = '';
                    }
                });
                this.statusList.forEach(v => {
                    v.status = []
                })
                // Object.keys(this.attrFormData).forEach(key => {
                //     this.attrFormData[key] = [];
                // });
                // this.createDateRange = '';
                // this.isReset = true
            },
            // 商品款号
            // getGoodsStyleNos(key) {
            //     goodsStyleNos({
            //         unitId: this.facId,
            //         key: key
            //     }).then(res => {
            //         console.log(res,'商品款号');
            //         this.options.goodsStyleNos = res.data.data
            //     });
            // },
            // 获取设计款号
            fetchGoodList(key) {
                getDesignStyleList({
                    unitId: this.facId,
                    key: key
                }).then(res => {
                    this.options.designStyleList = res.data.data;
                });
            },
            // 获取负责人列表
            fetchUnitUser(keyword = '') {
                getUnitUser({
                    unitId: this.facId,
                    keyword
                }).then(res => {
                    this.options.groupOptions = res.data.data.facGroupDTOS;

                    console.log(res);
                });
            },

            // 选取制单日期
            // orderDateChange(val) {
            //     const [start, end] = this.filterDate(val);
            //     this.filterFormData.dateCreateStart = start;
            //     this.filterFormData.dateCreateEnd = end;
            // },
            // filterDate(val) {
            //     return val.split(/\s-\s/g);
            // },
            // renderTitle(key) {
            //     const conf = {
            //         brand: '品牌',
            //         designer: '设计师',
            //         wave: '波段',
            //         kind: '分类',
            //         season: '季节',
            //         year: '年份',
            //         tag: '标签'
            //     }
            //     return conf[key];
            // },
            // itemActive(key) {
            //     return !this.attrFormData[key].length
            // },
            // handleSelectAll(key) {
            //     if (this.attrFormData[key].length !== this.currentAttrData[key].length) {
            //         this.attrFormData[key] = this.currentAttrData[key].map(item => {
            //             return item.id;
            //         });
            //     }
            //     else {
            //         this.attrFormData[key] = [];
            //     }
            // },
            // 获取某个属性的id列表
            // getAttrIds(key) {
            //     return this.attrsData[key].map(item => {
            //         return item.id;
            //     });
            // },
            // handleChange(key) {
            // console.log(this.attrFormData[key].length === this.attrsData[key].length)
            // if (this.attrsData[key].length === 1) {
            //     return;
            // };
            // console.log(this.attrFormData[key].length === this.attrsData[key].length)
            // if (this.attrFormData[key].length === this.attrsData[key].length) {
            //     this.attrFormData[key] = [];
            // }
            // },
            // getAllAttrId(val, categorys) {
            //     this.filterFormData.categorys = categorys&&categorys.length > 0 ? categorys : undefined
            //     this.filterFormData.attrIds = val&&val.length > 0 ? val : undefined
            //     // return Object.keys(this.attrFormData).reduce((arr, key) => {
            //     //     if (this.attrFormData[key].length) {
            //     //         arr.push(this.attrFormData[key]);
            //     //     }
            //     //     return arr;
            //     // }, []);
            // },



        }
    }
</script>

<style lang="scss">
</style>


<style lang="scss" scoped>
    .custom-filter-form {
        position: relative;
        padding: 16px 16px 8px 0;
    }
</style>
