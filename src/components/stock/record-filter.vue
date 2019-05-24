<template>
    <div class="filter">
        <el-row class="filter-form">
            <div class="form-item">
                <label>操作时间</label>
                <template>
                 <el-date-picker
                    @change="beginDate"
                        v-model="value6"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        placeholder="请选择日期范围"
                        :picker-options="pickerOptions5">
                </el-date-picker>
                </template>
            </div>
            <div class="form-item">
                <label>操作人</label>
                <workerLeader
                        v-model="filterForm.opBy"
                        :placeholder="'请选择操作人'"
                        :single="'single'"
                >
                </workerLeader>
                <!--<el-select v-model="filterForm.opBy" placeholder="请选择操作人">-->
                    <!--<el-option v-for="(item,index) in opMan" :key="index" :label="item.userName" :value="item.id"></el-option>-->
                <!--</el-select>-->
            </div>
            <div class="form-item">
                <label>操作工厂</label>
                <el-select clearable v-model="filterForm.unitId" placeholder="请选择操作工厂">
                    <el-option v-for="(item,index) in facItem" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="form-item">
                <label>变动类型</label>
                <el-select clearable v-model="filterForm.changeType" placeholder="请选择变动类型">
                    <el-option v-for="(item,index) in changeType" :key="index" :label="item.value" :value="item.id"></el-option>
                </el-select>
            </div>
            <div class="form-item">
                <label>商品档案</label>
                <rich-filter  style="flex: 1" v-model="richFilterParams"
                             dialogType='STYLE'
                             placeholder="点击可筛选商品"
                             modelName="GOODS_STOCK"></rich-filter>
                <!--<goods-attr-dialog @confirm="getAllAttrId" :isReset="isReset" modelName="GOODS_STOCK" style="flex: 1"></goods-attr-dialog>-->
            </div>
            <!--<div class="form-item collapse" @click="showTypeForm">-->
                <!--<el-button class="collapse-btn" type="text">展开货品属性筛选<i class="el-icon-arrow-down"></i></el-button>-->
            <!--</div>-->
            <div style="float: right;" class="form-item btn-wrap">
                <button @click="selecContent" class="filter-btn">筛选</button>
            </div>
        </el-row>
        <div v-if="isExpand" class="select">
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.brandArr" @change="brandChange" title="品牌">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.brand" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;margin-left:-14px;" v-model="filterForm.typeArr.designerArr" @change="designerChange" title="设计师">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.designer" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.waveArr" @change="waveChange" title="波段">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.wave" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.kindArr" @change="kindChange" title="分类">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.kind" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.seasonArr" @change="seasonChange" title="季节">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.season" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.yearArr" @change="yearChange" title="年份">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.year" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
            <filter-select style="margin-bottom:16px;" v-model="filterForm.typeArr.tagArr" @change="tagChange" title="标签">
                <select-option style="margin-right:4px;" v-for="(item,index) of facInfo.tag" :key="index" :label="item.value" :value="item.id"></select-option>
            </filter-select>
        </div>
    </div>
</template>

<script>
import FilterSelect from './filter-select';
import SelectOption from './option';
import {getFacUnitSettings,getFacCommonSettings,getEasyFactorys,queryInventoryItemOpByList} from '../../api/api'
import outsideSupplierSelect from '@/components/Common/custom-select/outside-supplier-select';
import clientSelect from '@/components/Common/custom-select/clientSelect.vue'
export default {
    data() {
        return {
            richFilterParams:{},
            supplier: [],
            isExpand: false,
            filterForm: {
                unitId:'',
                changeType:'',
                opBy: '',
                opDateStart:'',
                opDateEnd:'',
                typeArr: {
                    brandArr: ["ALL"],
                    designerArr: ["ALL"],
                    waveArr: ["ALL"],
                    kindArr: ["ALL"],
                    seasonArr: ["ALL"],
                    yearArr: ["ALL"],
                    tagArr: ["ALL"]
                },
            },
            changeType: [
                {
                value: "出库",
                id: "OUT_STORAGE"
                },
                {
                value: "入库",
                id: "IN_STORAGE"
                },
                {
                value: "调整",
                id: "ADJUST"
                },
            ],
            value6:[],
            pickerOptions5: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            loginType:'',
            facInfo:[],
            facItem:[],
            opMan:[],
            userId: ''
        }
    },
    components: {
        FilterSelect,
        SelectOption,
        outsideSupplierSelect,
        clientSelect
    },
    methods: {
        selecContent() {
            this.$emit('selectobj',{...this.richFilterParams,...this.filterForm});
        },
        brandChange(val) {

        },
        designerChange(val) {
            // console.log(val);
        },
        kindChange(val) {

        },
        seasonChange(val) {
            // console.log(val);
        },
        tagChange(val) {
            // console.log(val);
        },
        yearChange(val) {

        },
        waveChange(val) {
            // console.log(val);
        },
        beginDate(val) {
            val.split('至');
            this.filterForm.opDateStart=val.split('至')[0];
            this.filterForm.opDateEnd=val.split('至')[1];
        },
        //工厂列表
        getFacList() {
            let params = {
            "token": "",
            "userId": this.userId
            };
            getEasyFactorys(params).then(
            res => {
                this.facItem = res.data;
            }
            )
        },
        // 获取弹窗的属性
        // getAllAttrId(val,categorys) {
        //     this.filterForm.categorys = categorys&&categorys.length > 0 ? categorys : undefined
        //     this.filterForm.attrIds = val&&val.length > 0 ? val : undefined
        // },
        //老板获取
        getFacCommonSettings() {
            let params = {
                userId: this.userId,
                token: "",
                type: "all"
            };
            getFacCommonSettings(params).then(res => {
                this.facInfo = res.data.data;});
        },
        //员工获取
        getFacUnitSettings() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                token: "",
                type: "all"
            };
            getFacUnitSettings(params).then(res => {
                this.facInfo = res.data.data;});
        },
        // ----- 员工和老板的数据调用 -----
        showTypeForm() {
            this.isExpand = !this.isExpand;
            if (this.isExpand) {
                this.getFacUnitSettings();
            }
        },
        queryInventoryItemOpByList() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem("last_login")).id,
                userId: this.userId,
                storehouseId:this.$route.query.storehouseId,
            }
            queryInventoryItemOpByList(params).then(
                res => {
                    this.opMan = res.data.inventoryItemOpByList;
                }
            )
        },

        getManId(val){
            this.filterForm.opBy = val
        }
    },
    created(){
        this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
        this.getFacList();
        this.queryInventoryItemOpByList();
    },
    updated() {
        // this.selecContent();
    }

}
</script>

<style lang="scss" scoped>
    .filter {
        padding: 24px 32px 8px;
        margin: 16px 0;
        border-radius: 2px;
        background: #ffffff;
        box-shadow: 0 30px 20px -24px rgba(13, 51, 128, 0.1), 0 3px 10px -3px rgba(13, 51, 128, 0.1);
    }
    .select {
        padding-bottom: 16px;
    }
    .filter-form {
        // &__bottom {
        //     display: inline-block;
        // }
        .form-item {
            width: 25%;
            padding-right: 16px;
            float: left;
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            box-sizing: border-box;
            label {
                display: inline-block;
                width: 60px;
                margin-right: 12px;
                color: #3b3b3b;
                text-align: right;
                font-size: 12px;
            }
            .el-select {
                flex: 1
            }
            &:nth-of-type(4n) {
                padding-right: 0
            }
            &.btn-wrap {
                justify-content: flex-end
            }
            &.collapse {
                height: 36px;
                cursor: pointer;
                align-items: center;
                .collapse-btn {
                    margin-left: 20px;
                    color: #808080;
                }
                i {
                    margin-left: 5px;
                    font-size: 12px;
                }
            }
            .filter-btn {
                width: 72px;
                height: 36px;
                color: #ffffff;
                font-size: 14px;
                border-radius: 2px;
                background-color: #54d1bc;
                &:hover {
                    background-color: #6cd9c7
                }
            }
            .el-date-editor--daterange.el-input {
                width: 220px;
                flex: 1;
            }
        }
    }
</style>
