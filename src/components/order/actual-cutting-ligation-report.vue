<template>
    <section class="report-container">
        <page-title title="上报扎号">
            <div class="report-container__btn">
                <nf-button @click="handleToBack">取 消</nf-button>
                <nf-button type="warningsimple" :loading="btnLoading1" @click="submit('DRAFT')">存为草稿</nf-button>
                <nf-button type="warning" :loading="btnLoading2" @click="submit('REPORT')">提 报</nf-button>
            </div>
        </page-title>
        <!-- 工单信息--start -->
        <mission-info class="report-container__header" :missionInfo="missionData.mission"></mission-info>
        <!-- 工单信息--end -->
        <div class="report-container__form">
            <el-form
                    :model="formData"
                    :inline="true"
                    :rules="rules"
                    ref="reportForm">
                <el-form-item class="report-container__form-item" label="完成日期" prop="dateCompleted">
                    <el-date-picker
                            v-model="formData.dateCompleted"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy-MM-dd"
                            @change="handlePickDate"
                            :disabled="dateDisable"></el-date-picker>
                </el-form-item>
                <el-form-item class="report-container__form-item" label="完成人员" prop="chargerId"
                              style="margin-left: 50px">
                    <workerLeader v-model="formData.chargerId" :single="'single'"
                                  :isDisabled="userDisable" :placeholder="'选择完成人员'"></workerLeader>
                </el-form-item>
            </el-form>
        </div>
        <div class="report-container__section">
            <content-wrap title="床次">
                <div class="lathe-input" slot="titleDesc">
                    <el-input style="width: 100px" size="small" v-model="formData.lathe" @blur="handleBlur"
                              placeholder="请输入床次"></el-input>
                    <!-- <button class="stick__btn" @click="handleCreate" type="button">生成扎号数据</button> -->
                </div>
                <div class="report-container__table">
                    <!-- :metadatas="fabricMetadatas" -->
                    <fabric-sku-table
                            ref="fabricSkuTable"
                            :metadatas="missionData.metadatas"
                            :color-options="facbricColorArr"
                            @on-add-color="handleChange"
                            @change="handleFabricSkuChange"
                            @on-delete="handleChange"
                            editable></fabric-sku-table>
                </div>
            </content-wrap>
        </div>
        <div class="report-container__section">
            <content-wrap title="生成扎号：">
                <div class="count" slot="titleDesc">
                    {{ listData.length }}
                </div>
                <div class="report-container__table">
                    <el-table class="report-container__table--list report-middle-table" :data="listData" border>
                        <el-table-column label="扎号(单号-床次-序号)" width="300">
                            <template slot-scope="scope">
                                <span>{{ scope.row.stickNum }}</span>
                                <el-input
                                        type="number"
                                        class="report-container__table-input"
                                        v-model="scope.row.ligationNo"
                                        size="mini"></el-input>
                            </template>
                        </el-table-column>

                        <el-table-column label="颜色" width="140" prop="color_no_name">

                        </el-table-column>
                        <el-table-column label="尺码" width="120" prop="size_value">

                        </el-table-column>
                        <el-table-column label="内长" width="120" prop="standard_value" v-if="isShowLength">

                        </el-table-column>
                        <el-table-column label="数量" width="90" prop="storeyQuantity">
                            <template slot-scope="scope">
                                <input placeholder="选填"
                                       style="border: none;"
                                       @input="storeyQuantityChange"
                                       v-model="scope.row.storeyQuantity">
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" width="250">
                            <template slot-scope="scope">
                                <input placeholder="选填"
                                       style="border: none;"
                                       v-model="scope.row.remark">
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </content-wrap>
            <content-wrap title="数量总计：">
                <div class="count" slot="titleDesc">
                    {{ quantityTotal }}
                </div>
                <div class="report-container__table">
                    <!-- <nf-sku-table
                        ref="nfSkuTable"
                        :metadatas="quantityMetadatas"
                        :quantities="nfSkuTableQuantities"
                        @change="handleSkuTableChange"
                        show-num></nf-sku-table> -->
                    <nf-sku-table
                            ref="nfSkuTable"
                            :metadatas="missionData.metadatas"
                            showNum
                            @change="countTotalNum"
                            :quantities="nfSkuTableQuantities"
                            style="margin-top: 20px"></nf-sku-table>
                    <!--<fabric-sku-table-->
                    <!--ref="nfSkuTable"-->
                    <!--:quantities="nfSkuTableQuantities"-->
                    <!--@change="handleSkuTableChange"-->
                    <!--:metadatas="listDataCount"-->
                    <!--show-num></fabric-sku-table>-->
                </div>
            </content-wrap>

        </div>
        <el-dialog :title="'是否打印本次生成的'+listData.length+'个扎号？'" :visible.sync="dialogTableVisible"
                   custom-class="printDialog">
            <el-table class="report-container__table--list" :data="ligationList" border>
                <el-table-column label="扎号(单号-床次-序号)" width="250">
                    <template slot-scope="scope">
                        <span>{{ scope.row.ligationNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="工单号" prop="orderNo">

                </el-table-column>
                <el-table-column label="颜色" width="90">
                    <template slot-scope="scope">
                        <span>{{ scope.row.colorNo }}-{{ scope.row.colorName }}</span>
                    </template>

                </el-table-column>
                <el-table-column label="尺码" width="90" prop="sizeName">

                </el-table-column>
                <el-table-column label="内长" width="90" prop="standardName">

                </el-table-column>
                <el-table-column label="数量" width="90" prop="num">

                </el-table-column>
                <el-table-column label="备注" width="90" prop="remark">

                </el-table-column>
            </el-table>

            <div class="printDialog_btns">
                <button @click="dialogTableVisible=false">不打印</button>
                <button @click="printGo('printBeginAllR')">打印</button>
            </div>

        </el-dialog>
        <printBarCoded v-if="ligationList.length>0" :cutGroup="cutGroup" :dataArr="JSON.parse(JSON.stringify(ligationList))"
                       :targetId="'printBeginAllR'" :numbers="num1"></printBarCoded>
        <el-dialog :modal-append-to-body="false" style="z-index: 9000;" title="批量打印"
                   :visible.sync="numbersVisible" :show-close="false" custom-class="custom-dialog numbersDialog" size="tiny">
            <div style="padding-left: 20px;display: flex">
                <div style="width: 80px;">裁片组：</div>
                <div style="width: 380px;">
                    <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox @change="handleCheckChange" v-model="item.check" v-for="item in chipConfigData" :label="item.name" :key="item.id">{{item.name}}</el-checkbox>
                    <span style="color: #FFA914;cursor: pointer;margin-bottom: 6px;display: inline-block" @click="chipConfigVisibleShow">+管理裁片组</span>
                </div>

            </div>
            <div>
                <span style="margin: 0 20px;">打印份数</span>
                <el-input-number v-model="num1" :min="1" :max="100"></el-input-number>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="numbersVisible = false">取 消</el-button>
                <el-button type="primary" @click="determinePrint">确 认</el-button>
            </div>
        </el-dialog>
        <chipConfig :chipConfigData="chipConfigData" :chipConfigVisible.sync="chipConfigVisible" :instanceId="instanceId"></chipConfig>

    </section>
</template>

<script>
    import MissionInfo from './common/mission-info';
    import FabricSkuTable from './fabric-sku-table/sku-table';
    import printBarCoded from './common/printBarCoded.vue';
    import {instanceMissionNodeInfo, commonNodeReport, ligationPrint,cbsgcGetList} from '@/api';
    import {formatDate} from '@/utils';
    import chipConfig from './common/chipConfig.vue';
    export default {
        name:'CuttingReport',
        data() {
            return {
                cutGroup:[],
                chipConfigData:[],
                num1: 1,
                chipConfigVisible: false,
                numbersVisible: false,
                checkAll: false,
                dialogTableVisible: false,
                btnLoading1: false,
                btnLoading2: false,
                listData: [],
                missionData: {},
                quantityMetadatas: [],
                quantityTotal: 0,
                fabricTotal: 0,
                fabricMetadatas: [],
                facbricColorArr: [],
                formData: {
                    chargerId: '',
                    dateCompleted: '',
                    lathe: ''
                },
                rules: {
                    chargerId: [
                        {
                            required: true,
                            message: '请选择完成人员！'
                        }
                    ],
                    dateCompleted: [
                        {
                            required: true,
                            message: '请选择完成日期！'
                        }
                    ]
                },

                ligationList: [],  // 是否确认打印扎号
            };
        },
        watch: {
            'dialogTableVisible': function (val) {
                if (!val) {
                    this.$store.dispatch('deleteVisitedView', this.$route);
                    this.$store.dispatch('deleteVisitedLive', 'CuttingReport');
                    this.$router.back();
                }
            },
        },
        computed: {
            nfSkuTableQuantities() {
                let listDataCount = [];
                let ids = [];
                this.listData.forEach(item => {
                    ids.push(item.id)

                })
                //去重
                ids = Array.from(new Set(ids));
                ids.forEach(item => {
                    listDataCount.push({skuId: item, num: ''})
                });
                //id一样的时候就num相加 不一样就push另一条数据算法
                console.log(this.listData);
                this.listData.forEach($item => {
                    if ($item.storeyQuantity !== '') {
                        $item.storeyQuantity = Number($item.storeyQuantity)
                    }
                    listDataCount.forEach(dataItem => {
                        dataItem.num = Number(dataItem.num)
                        if ($item.id === dataItem.skuId) {
                            dataItem.num += Number($item.storeyQuantity)
                        }
                    });
                })
                return listDataCount
            },
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            isBoss() {
                const info = sessionStorage.getItem('user_login');
                return JSON.parse(info).role === 1;
            },
            missionId() {
                return this.$route.query['missionId'];
            },
            instanceId() {
                return this.$route.query['instanceWorkflowId'];
            },
            isShowLength() {
                return this.missionData.components && this.missionData.components.actual_cutting_ligation.goodsWithoutStandard;
            },
            selectUserOptions() {
                return this.missionData.header && this.missionData.header.facUser;
            },
            dateDisable() {
                const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
                return datalist.indexOf('fac.mission.node.finishDate.update') === -1;
            },
            userDisable() {
                const datalist = JSON.parse(sessionStorage.getItem('user_login')).permissionList;
                return datalist.indexOf('fac.mission.node.finishBy.update') === -1;
            }
        },
        components: {
            printBarCoded,
            MissionInfo,
            chipConfig,
            FabricSkuTable
        },
        created() {
            this.resetFields();
            this.fecthMissionInfo();
            this.cbsgcGetList();
        },
        methods: {
            // 获取裁片组列表
            cbsgcGetList(){
                cbsgcGetList({facMissionPrcdNodeId:this.instanceId}).then(res=>{
                    if(res.data.code===0){
                        console.log(res);
                        this.chipConfigData = res.data.data

                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            chipConfigVisibleShow(){
                this.chipConfigVisible=true;
                this.cbsgcGetList();
            },
            //全选
            handleCheckAllChange(val) {
                this.chipConfigData.forEach(item=>{
                    item.check=this.checkAll
                })
                // this.isIndeterminate = false;
            },
            handleCheckChange(){
                let flag = true;
                this.chipConfigData.forEach(item=>{
                    if(!item.check){
                        flag = false
                    }
                });
                this.checkAll = flag
            },
            //返回
            handleToBack(){
                this.$store.dispatch('deleteVisitedView', this.$route);
                this.$store.dispatch('deleteVisitedLive', 'CuttingReport');
                this.$router.back();
            },
            storeyQuantityChange() {
                this.listData = [...this.listData]
                console.log(this.listData);
            },
            resetFields() {
                this.$refs['reportForm'] && this.$refs['reportForm'].resetFields();
                this.formData.dateCompleted = formatDate(new Date(), 'yyyy-MM-dd');
            },
            fecthMissionInfo() {
                const params = {
                    userId: this.userId,
                    instanceWorkflowId: this.instanceId,
                    facId: this.facId,
                    missionId: this.missionId
                };
                instanceMissionNodeInfo(params)
                    .then(res => {
                        if (res.data.code != 0) {
                            this.$message.error(res.data.msg);
                        }
                        const chargers = res.data.components.information.chargers;
                        this.missionData = res.data;
                        this.formData.lathe = res.data.components.actual_cutting_ligation.nextLathe;
                        this.formData['chargerId'] = !this.isBoss ? this.userId : (chargers.length ? chargers[0].id : '');
                        this.facbricColorArr = this.getColorArr(res.data.metadatas);
                    });
            },
            submit(actionType) {
                if (!this.listData.length) {
                    this.$message.error('没有可上报的扎号');
                    return;
                }
                this.$refs['reportForm'].validate((valid) => {
                    if (!valid) return;
                    const params = {
                        ...this.formData,
                        userId: this.userId,
                        instanceId: this.instanceId,
                        typeCode: 'actual_cutting_ligation',
                        actionType: actionType,
                    }
                    params.skus = this.listData.map(item => {
                        return {
                            remark: item.remark,
                            skuId: item.id,
                            quantity: item.storeyQuantity,
                            ligationNo: item.ligationNo
                        }
                    });
                    if(actionType === 'DRAFT'){
                        this.btnLoading1 = true;
                    }else if(actionType === 'REPORT'){
                        this.btnLoading2 = true;
                    }
                    commonNodeReport(params).then(res => {
                        if(actionType === 'DRAFT'){
                            this.btnLoading1 = false;
                        }else if(actionType === 'REPORT'){
                            this.btnLoading2 = false;
                        }
                        if (res.data.code === 0) {
                            const paramsPrint = {
                                missionId: this.missionId,
                                missionNodeId: this.instanceId,
                                pageNo: 1,
                                pageSize: 9999,
                                lathe: this.formData.lathe,
                                actionType: actionType,
                            }
                            ligationPrint(paramsPrint).then(res => {
                                console.log(res.data.ligationList);
                                this.ligationList = res.data.ligationList
                                this.dialogTableVisible = true
                            })
                            return
                        };
                        this.$message.error(res.data.msg || '上报失败');
                        })
                });
            },
            handlePickDate(val) {
                this.formData.dateCompleted = val;
            },
            // 获取颜色下拉列表
            getColorArr(metadatas) {
                const json = {};
                return metadatas.reduce((arr, item) => {
                    if (!json[item.color_id]) {
                        json[item.color_id] = item.color_id;
                        const {color_no_name, color_name, color_id} = item;
                        arr.push({
                            color_no_name,
                            color_name,
                            color_id
                        });
                    }
                    return arr;
                }, []);
            },
            handleChange(item) {
                const colorArr = this.$refs['fabricSkuTable'].getColorArr().slice(1);
                const skuVal = this.$refs['fabricSkuTable'].getSkuTableValue();
                const nfSkuTableValue = this.getRefNfSkuTableValue(skuVal, false);
                // this.$refs['nfSkuTable'].setCurrentSkuVal(nfSkuTableValue);
                // this.$refs['nfSkuTable'].setColorArr(colorArr);
                this.handleCreate();
            },
            // 床次sku表格改变事件
            handleFabricSkuChange(skuVal, total) {
                this.fabricTotal = total;
                this.handleChange();
            },
            // 数量总计sku表格改变事件
            // handleSkuTableChange(skuVal, total) {
            //     this.quantityTotal = total;
            // },
            countTotalNum() {
                const skus = this.$refs['nfSkuTable'].getSkuTableValue();
                this.quantityTotal = Object.keys(skus).reduce((total, key) => {
                    total += Number(skus[key].num);
                    return total;
                }, 0);
            },
            // 生成数量统计、扎号
            handleCreate() {
                let skuVal = this.$refs['fabricSkuTable'].getSkuTableValue();
                skuVal = JSON.parse(JSON.stringify(skuVal));
                // const bol = Object.keys(skuVal).every(key => !skuVal[key].storeyQuantity);
                // console.log(bol);
                // if (!this.fabricTotal) {
                //     this.$message.error('请输入数量');
                //     return;
                // }
                // if (bol) {
                //     this.$message.error('请输入层数');
                //     return;
                // }
                this.listData = this.getCreatedStickNum(skuVal);
                this.$nextTick(() => {
                    Object.keys(skuVal).forEach(key => {
                        skuVal[key].num = skuVal[key].num * skuVal[key].storeyQuantity;
                    });
                    // this.$refs['nfSkuTable'].setCurrentSkuVal(skuVal);
                    // this.$refs['nfSkuTable'].initSkuValData();
                });
            },
            getRefNfSkuTableValue(skuVal = {}, isNull = true) {
                // isNull填充数据是storeyQuantity和num是否为空，默认为空
                return Object.keys(skuVal).reduce((json, key) => {
                    json[key] = {
                        skuId: skuVal[key].skuId,
                        storeyQuantity: isNull ? '' : skuVal[key].storeyQuantity,
                        num: isNull ? '' : skuVal[key].num
                    }
                    return json;
                }, {});
            },
            // 获取生成扎号列表
            getCreatedStickNum(skuVal) {
                const sizeArr = this.$refs['fabricSkuTable'].sizeArr;
                let list = [], json = {}, index = 0;
                // tips: 先拿到某个尺码列中最大的数量（至少循环次）maxNum，再循环maxNum次
                sizeArr.forEach(sizeItem => {
                    const maxArr = Object.keys(skuVal).reduce((arr, key) => {
                        if (key.indexOf(sizeItem.size_id) > -1) {
                            arr.push(Number(skuVal[key].num));
                        }
                        return arr;
                    }, []);
                    if(maxArr.length===0) return [];
                    const maxNum = Math.max.apply(null, maxArr);
                    const emptyArr = new Array(maxNum).fill(0);
                    emptyArr.forEach(() => {
                        Object.keys(skuVal).forEach((key) => {
                            if (key.indexOf(sizeItem.size_id) > -1 && skuVal[key].num) {
                                //  json[key] 记录循环次数
                                if (json[key] === undefined) {
                                    json[key] = 0;
                                    json[key] += 1;
                                }
                                else {
                                    json[key] += 1;
                                }
                                if (json[key] <= skuVal[key].num) {
                                    // skuVal[key].num满足json[key] <= skuVal[key].num
                                    const skuItem = this.missionData.metadatas.find(metadataItem => skuVal[key].skuId === metadataItem.id);
                                    const obj = {...skuItem, storeyQuantity: skuVal[key].storeyQuantity}
                                    list.push(obj);
                                }
                            }
                        });
                    });
                });
                if(list.length===0) return [];
                return list.reduce((arr, item) => {
                    if (item.storeyQuantity) {
                        item = {...item};
                        item.stickNum = `${this.missionData.mission.missionNo}-${this.formData.lathe}-`;
                        item.ligationNo = ++index;
                        arr.push(item);
                    }

                    // console.log(arr)
                    return arr;
                }, []);
            },
            handleBlur() {
                const reg = /\W+/gi;
                if (reg.test(this.formData.lathe)) {
                    this.formData.lathe = this.missionData.components.actual_cutting_ligation.nextLathe;
                    return this.$message.error('只能输入字母和数字');
                }
            },
            //负责人分组
            getManId(arr) {
                this.formData.chargerId = arr
            },

            // 打印条码
            printGo(id) {
                this.cbsgcGetList()
                this.numbersVisible = true


            },
            determinePrint() {
                this.cutGroup = this.chipConfigData.filter(item=>item.check);
                this.$nextTick(function () {
                    // 1.设置要打印的区域 div的className
                    var newstr = document.getElementById('printBeginAllR').innerHTML
                    // 2. 复制给body，并执行window.print打印功能
                    document.body.innerHTML = newstr
                    // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
                    var oldstr = document.body.innerHTML
                    window.print()
                    window.location.reload()
                    document.body.innerHTML = oldstr
                    return false
                })

            },
        }
    }
</script>
<style lang="scss" scoped>

    .report-container__header {
        background: #fff;
        border: none;
        box-shadow: 0px 6px 10px -3px rgba(13, 51, 128, 0.05);
    }

    .report-container__form {
        margin: 12px 0;
        &-item {
            margin-bottom: 0;
        }
    }

    .report-container__section {
        padding: 16px 24px;
        margin-bottom: 12px;
        background: #fff;
    }

    .report-container__table {
        max-width: 1000px;
        display: inline-block;
        &-input {
            width: 48px;
        }
    }

    .lathe-input {
        display: inline-block;
        margin-left: 8px;
        .stick__btn {
            padding: 4px 12px;
            margin-left: 20px;
            font-size: 14px;
            color: rgba(28, 161, 255, 1);
            border-radius: 2px;
            border: 1px solid rgba(28, 161, 255, 1);
            float: right;
            &:hover {
                opacity: .7;
            }
        }
    }

    .count {
        display: inline-block;
        color: #FFA914;
    }
</style>

<style lang="scss">
    .numbersDialog{
        width: 540px;
        .el-checkbox + .el-checkbox{
            margin-left: 0;

        }
        .el-checkbox{
            margin-bottom: 6px;
            width: 33%;
            display: inline-block;
            float: left;
        }
    }
    .printDialog {
        width: 900px;
        .el-dialog__header {
            text-align: center;
        }
        .printDialog_btns {
            text-align: right;
            margin-top: 30px;
            button {
                padding: 0 16px;
                height: 32px;
                line-height: 32px;
                background: #fff;
                border: 1px solid #DCE0E6;
            }
            button:last-child {
                margin-left: 10px;
                color: #fff;
                background: #FFA914;
                border: 1px solid #FFA914;
            }
        }
    }
    .report-container{
        .report-container__table--list {
            th {
                background-color: #F5F7FA;
            }
            th > .cell {
                font-size: 12px;
                font-weight: normal;
                color: #A2ABB8;
                background-color: #F5F7FA;
            }
            .el-table__body {
                .cell,
                td {
                    &:nth-child(6) {
                        background: #F5F7FA !important;
                        input {
                            background: #F5F7FA !important;
                        }
                    }
                }
                .cell {
                    height: 100%;
                    line-height: 28px;
                }
            }
            td,
            th {
                height: 28px;
                line-height: 28px;
            }
        }
        .report-container__table {
            .report-middle-table {
                .el-input--mini .el-input__inner {
                    padding: 5px;
                }
                .el-table__row{
                    &:hover input{
                        background-color: #EEF0F6;
                    }
                    .cell{
                        input{
                            width: 100%;
                        }
                    }
                }
            }
        }
    }

</style>


