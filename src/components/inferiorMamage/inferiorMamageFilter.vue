<template>
    <div class="filter">
        <div class="filter-wrap box-shadow custom-filter-form">
            <el-form style="margin-left: -25px" :model="filterFormData" label-width="80px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品款号">
                            <result-all-select
                                    v-model="filterFormData.styleIds"
                                    :multiple="true"
                                    :options="styleList"
                                    @remoteMethod="remoteMethod('styleIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="生产工单">
                            <result-all-select
                                    v-model="filterFormData.missionIds"
                                    :multiple="true"
                                    :options="missionList"
                                    @remoteMethod="remoteMethod('missionIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="外发厂">
                            <result-all-select
                                    v-model="filterFormData.outsideFactoryIds"
                                    :multiple="true"
                                    :options="outsideFactoryList"
                                    @remoteMethod="remoteMethod('outsideFactoryIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="工位">
                            <result-all-select
                                    v-model="filterFormData.userIds"
                                    :multiple="true"
                                    :options="purchaserList"
                                    @remoteMethod="remoteMethod('userIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="颜色">
                            <colorSelectGroup ref="colorSelectGroup" :hideNew="true" v-model="filterFormData.colorIds"></colorSelectGroup>

                            <!--<result-all-select-->
                                    <!--v-model="filterFormData.colorIds"-->
                                    <!--:multiple="true"-->
                                    <!--:options="colorList"-->
                                    <!--@remoteMethod="remoteMethod('colorIds',$event)">-->
                            <!--</result-all-select>-->
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="尺码">
                            <result-all-select
                                    v-model="filterFormData.sizeIds"
                                    :multiple="true"
                                    :options="sizeList"
                                    @remoteMethod="remoteMethod('sizeIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="内长">
                            <result-all-select
                                    v-model="filterFormData.standardIds"
                                    :multiple="true"
                                    :options="standardList"
                                    @remoteMethod="remoteMethod('standardIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="次品标签">
                            <result-all-select
                                    v-model="filterFormData.defectiveLabelIds"
                                    :multiple="true"
                                    :options="labelList"
                                    @remoteMethod="remoteMethod('defectiveLabelIds',$event)">
                            </result-all-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="状态">
                            <el-select
                                    v-model="filterFormData.status"
                                    multiple
                                    filterable
                                    clearable
                                    placeholder="请选择">
                                <el-option
                                        v-for="item in statusList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="18">
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        workbays,
        goodsStyleSimpleList,
        outsideFactoryListForSelect,
        facDefectiveLabels,
    } from "@/api";
    import {
        getSkuAttrList,
        simpleMissionList,
    } from "@/api/inferiorMamage"
    import resultAllSelect from "../Common/custom-select/resultAllSelect";
    export default {
        name: "filter",
        components: {
            resultAllSelect,
        },
        data(){
            return{
                //筛选区已选数据
                filterFormData:{
                    styleIds: [],               //商品款号
                    missionIds: [],             //生产工单
                    outsideFactoryIds: [],      //外发厂
                    userIds: [],                //工位
                    colorIds: [],               //颜色
                    sizeIds: [],                //尺码
                    standardIds: [],            //内长
                    defectiveLabelIds: [],      //次品标签
                    status: ['0'],                 //状态
                },
                styleList: [],           //商品款号下拉
                missionList: [],           //生产工单下拉
                outsideFactoryList: [],           //外发厂下拉
                purchaserList: [],           //工位下拉
                colorList: [],           //颜色下拉
                sizeList: [],           //尺码下拉
                standardList: [],           //内长下拉
                labelList: [],           //次品标签下拉
                timer: '',
                statusList: [
                    {
                        name: '返修中',
                        id: '0'
                    },
                    {
                        name: '已返厂',
                        id: '4'
                    }
                ],     //状态下拉
            }
        },
        mounted(){
            this.$refs.colorSelectGroup.search('')
        },
        methods:{
            //远程搜索
            remoteMethod(type, query){
                if(this.timer){
                    clearTimeout(this.timer)
                }
                this.timer = setTimeout(() => {
                    if(type === 'styleIds'){
                        this.styleRemoteMethod(query)
                    }else if(type === 'userIds'){
                        this.workRemoteMethod(query);
                    }else if(type === 'missionIds'){
                        this.missionRemoteMethod(query);
                    }else if(type === 'outsideFactoryIds'){
                        this.outsideFacRemoteMethod(query);
                    }else if(type === 'colorIds'){
                        this.skuRemoteMethod(query, 'color');
                    }else if(type === 'sizeIds'){
                        this.skuRemoteMethod(query, 'size');
                    }else if(type === 'standardIds'){
                        this.skuRemoteMethod(query, 'length');
                    }else if(type === 'defectiveLabelIds'){
                        this.inferiorRemoteMethod(query);
                    }
                }, 300);
            },
            //商品款号搜索
            styleRemoteMethod(query) {
                let params = {
                    unitId: this.$common.facId(),
                    userId: this.$common.userId(),
                    key: query,
                    modelName: 'FACTORY_MISSION'
                };
                goodsStyleSimpleList(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //替换属性
                        data = this.$common.changeAttr(data, ['styleId', 'show'], ['id', 'name']);
                        this.styleList = data;
                    }else{
                        this.styleList = [];
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //生产工单搜索
            missionRemoteMethod(query) {
                let params = {
                    unitId: this.$common.unitId(),        // 工厂id
                    keyword: query,
                };
                simpleMissionList(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //替换属性
                        data = this.$common.changeAttr(data, ['missionId', 'orderNo'], ['id', 'name']);
                        this.missionList = data;
                    }else{
                        this.missionList = [];
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //外发厂搜索
            outsideFacRemoteMethod(query){
                let params= {
                    userId: this.$common.userId(),        // 用户id
                    factoryId: this.$common.facId(),        // 当前所在工厂id
                    keyword: query,
                };
                outsideFactoryListForSelect(params).then(res=>{
                    if(res.data.code ===0){
                        this.outsideFactoryList = res.data.data;
                        //加一个本厂对象
                        let factory = {id: 'ALL', name: '本厂'};
                        this.outsideFactoryList.unshift(factory);
                    }
                })
            },
            //工位搜索
            workRemoteMethod(query) {
                let params = {
                    facId: this.$common.facId(),
                    groupIds: ['ALL'],
                    keyword: query,
                };
                workbays(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //替换属性
                        data = this.$common.changeAttr(data, 'userName', 'name');
                        this.purchaserList = data;
                    }else{
                        this.purchaserList = [];
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //sku 颜色、内长、尺码搜索
            skuRemoteMethod(query, type) {
                let params = {
                    unitId: this.$common.unitId(),        // 工厂id
                    type: type,         // 类型 取值（color/size/length)
                    keyword: query,
                };
                getSkuAttrList(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        this.getSkuSelectValue(type, data);
                    }else{
                        this.getSkuSelectValue(type, []);
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //sku属性赋值
            getSkuSelectValue(type, value){
                if(type === 'color'){
                    this.colorList = value;
                }else if(type === 'size'){
                    this.sizeList = value;
                }else if(type === 'length'){
                    this.standardList = value;
                }
            },
            //次品标签搜索
            inferiorRemoteMethod(query) {
                let params = {
                    userId: this.$common.userId(),
                    facId: this.$common.facId(),
                    keyword: query,
                };
                facDefectiveLabels(params).then(res => {
                    if(res.data.code === 0){
                        let data = res.data.data;
                        //替换属性
                        data = this.$common.changeAttr(data, 'labelName', 'name');
                        this.labelList = data;
                    }else{
                        this.labelList = [];
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //重置
            reset() {
                this.filterFormData = {
                    styleIds: [],               //商品款号
                    missionIds: [],             //生产工单
                    outsideFactoryIds: [],      //外发厂
                    userIds: [],                //工位
                    colorIds: [],               //颜色
                    sizeIds: [],                //尺码
                    standardIds: [],            //内长
                    defectiveLabelIds: [],      //次品标签
                    status: ['0'],                 //状态
                };
            },
            //筛选
            submit() {
                this.$emit('filterData', this.filterFormData);
            },
        },
        created(){
            this.styleRemoteMethod('');
            this.workRemoteMethod('');
            this.missionRemoteMethod('');
            this.outsideFacRemoteMethod('');
            this.skuRemoteMethod('', 'color');
            this.skuRemoteMethod('', 'size');
            this.skuRemoteMethod('', 'length');
            this.inferiorRemoteMethod('');
        },
    }
</script>

<style lang="scss" scoped>
    .filter{
        margin-bottom: 10px;
        .filter-wrap{
            max-height: 200px;
            overflow-y: auto;
        }
    }
</style>
