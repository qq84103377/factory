<template>
    <div class="stock-list">
        <el-row>
            <el-table
                    :data="currentTableData"
                    border
                    class="no-cell-padding no-hover-highlight"
                    style="width: 100%;font-size: 12px;">
                <el-table-column
                        prop="date"
                        :label="`商品款号${bigList.styleSum ?'(' + bigList.styleSum + ')' : ''}`"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <div class="cell-con">
                            <img class="good-img" :src="(scope.row.pictureUrl || defaultImg) + '?imageView/0/w/45/h/45'"
                                 alt="">
                            <p class="style-no">{{ scope.row.styleNo }}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="styleName"
                        label="商品名称"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                </el-table-column>
                <el-table-column
                        v-if="type==3||type==4"
                        label="关联订单"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <div class="cell-con">
                            <order-select v-if="isShowAction" :goodsId="scope.row.id||scope.row.styleId" v-model="scope.row.facPrdOrderId"></order-select>
                            <div v-else>{{scope.row.facPrdOrderNo}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="isStorage"
                        prop="stockNum"
                        :label="`${type==1?'入库':(type==3?'发货':type==4?'退货':type==5?'入库通知':'出库')}数合计`"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <div>
                            {{type==0 ? Number(scope.row.stockNum || 0)*-1 : scope.row.stockNum}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="isRealStore"
                        prop="num"
                        label="总库存数"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                </el-table-column>
                <el-table-column
                        v-if="isRealStore"
                        prop="date123"
                        label="计划成本"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <span>¥{{scope.row.cost||0}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="isStorage"
                        prop="cost"
                        label="价格"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <input @input="handlePrice(scope.$index)" v-if="isShowAction" v-model.number="scope.row.cost" type="number">
                        <span v-else>{{scope.row.cost}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="totalPrice"
                        label="金额合计"
                        align="center"
                        :class-name="tdClassName"
                        width="110">
                    <template slot-scope="scope">
                        <div v-if="!isRealStore">
                            {{(type==0 ? '-¥'+(Number(scope.row.totalPrice || 0).toFixed(2)) : (type==3||type==4) ? Number(scope.row.totalPrice || 0).toFixed(2) :'+¥'+(Number(scope.row.totalPrice||0)).toFixed(2))}}
                        </div>
                        <div v-else>
                            ¥{{((scope.row.cost || 0) * (scope.row.num || 0)).toFixed(2)}}
                        </div>
                    </template>
                </el-table-column>


                <!--<el-table-column-->
                <!--prop="num"-->
                <!--:label="`${columnLabel}${bigList.stockSum ? '(' + bigList.stockSum + ')' : ''}`"-->
                <!--align="center"-->
                <!--:class-name="tdClassName"-->
                <!--width="100">-->
                <!--<template slot-scope="scope">-->
                <!--<span>{{ scope.row.num }}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column
                        align="center"
                        :label="handleLabel()"
                        :class-name="tdClassName"
                        fit>
                    <template slot-scope="scope">
                        <el-table
                                :data="scope.row.commonStyleSkuList"
                                class="row-table no-cell-padding is-fixed-header no-border"
                                style="width: 100%;font-size: 12px;">
                            <el-table-column
                                    label="规格"
                                    fixed
                                    align="center"
                                    width="200">
                                <template slot-scope="scope">
                                    <div class="standard">
                                        <div class="standard-left">
                                            <p class="standard-color">{{scope.row.colorName}}</p>
                                        </div>
                                        <div class="standard-right"
                                             v-if="scope.row.lengths && scope.row.lengths.length">
                                            <p class="standard-length"
                                               v-for="(lengthItem,index) in scope.row.lengths"
                                               :key="index">{{ lengthItem.standardValue }}</p>
                                        </div>
                                    </div>

                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="一手"
                                    align="center"
                                    class-name="is-column-cell-block"
                                    v-if="isStorage&& isShowAction && !formType"
                                    width="80">
                                <template slot-scope="scope">
                                    <once-input
                                            :onceInputModel="onceInputModel"
                                            :scope="scope"
                                            @on-input="handleInputRowValue">
                                    </once-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    v-for="(size, index) in scope.row.sizes"
                                    :key="index"
                                    :class-name="isNoBorderRight"
                                    :label="'' + size.sizeValue"
                                    align="center"
                                    width="80">
                                <template slot-scope="scope">
                                    <div class="column-wrap">
                                        <table-column
                                                v-if="scope.row.lengths && scope.row.lengths.length"
                                                v-for="(lengthItem, lengthIndex) in scope.row.lengths"
                                                :key="lengthIndex"
                                                :lengthItem="lengthItem"
                                                :scope="scope"
                                                :sizeItem="size"
                                                :skuVal="currentValue"
                                                :isStorage="isStorage"
                                                :isShowAction="isShowAction&&!formType"
                                                :isShowInformNum="isShowInformNum"
                                                @on-input="handleInputValue"
                                        ></table-column>
                                        <table-column
                                                v-if="scope.row.lengths && !scope.row.lengths.length"
                                                :scope="scope"
                                                :sizeItem="size"
                                                :skuVal="currentValue"
                                                :isStorage="isStorage"
                                                :isShowAction="isShowAction&&!formType"
                                                :isShowInformNum="isShowInformNum"
                                                @on-input="handleInputValue"
                                        ></table-column>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="isShowAction&&!formType"
                        prop="name"
                        label="操作"
                        :class-name="tdClassName"
                        align="center"
                        :width="150">
                    <template slot-scope="scope">
                        <div class="btn-wrap isStorage" v-if="!isStorage">
                            <el-button type="text" @click="handleAddStock(scope.row, 'IN_STORAGE')">
                                <icon type="icon-storage"></icon>
                                入库
                            </el-button>
                            <el-button type="text" @click="handleAddStock(scope.row, 'OUT_STORAGE')">
                                <icon type="icon-outroom"></icon>
                                出库
                            </el-button>
                            <el-button type="text" @click="handleAddStock(scope.row, 'ADJUST')">
                                <icon type="icon-adjust"></icon>
                                调整
                            </el-button>
                            <el-popover
                                    popper-class="no-padding"
                                    placement="bottom"
                                    width="128"
                                    trigger="hover">
                                <el-button type="text" slot="reference">
                                    <icon type="icon-more"></icon>
                                    更多
                                </el-button>
                                <div class="more-handle">
                                    <div>
                                        <el-button @click="clickisshow(scope)" type="text">
                                            <icon type="icon-record" w="16" h="16"></icon>
                                            查看变动记录
                                        </el-button>
                                    </div>
                                    <div>
                                        <el-button type="text" @click="$router.push(`/home/stock/bill?storehouseId=${storehouseId}&styleId=${scope.row.styleId}`)">
                                            <icon type="icon-details" w="16" h="16"></icon>
                                            查看单据
                                        </el-button>
                                    </div>
                                    <div>
                                        <el-button type="text" @click="handleShowDeleteDialog(scope.row,scope.$index)">
                                            <icon type="icon-delete" w="12" h="12"></icon>
                                            删除
                                        </el-button>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                        <div class="btn-wrap" v-if="isStorage">
                            <el-button type="text" @click="handleAddStock(scope.row)">
                                <icon type="icon-add" w="12" h="12"></icon>
                                追加
                            </el-button>
                            <el-button v-if="!hasRelateOrder" type="text" @click="deleteItem(scope.row)">
                                <icon type="icon-delete" w="12" h="12"></icon>
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div v-if="isStorage&&isShowAction" style="border: 1px solid #DFE6EC;border-top: none;line-height: 32px;padding: 0 15px;">-->
            <!--<input style="border: none;text-align: left;" v-if="addGoods" placeholder="输入款号/名称/厂家货号搜索添加商品">-->
            <!--<span v-else @click="addGoods=true">+ 添加商品</span>-->
            <!--</div>-->

            <!-- 追加入库 -->
            <el-dialog
                    :modal-append-to-body="false"
                    :show-close="false"
                    custom-class="table-dialog nf-dialog"
                    :visible.sync="dialogTableVisible">
                <div class="dialog-title" slot="title">
                    {{styleNo}}-{{ dialogTitile }}
                </div>
                <div class="dialog-main">
                    <div class="input-wrap" v-if="!isStorage">
                        <el-form :inline="true" :model="form" ref="form" class="demo-form-inline stock-dialog-form">
                            <el-form-item
                                    label="备注"
                                    prop="remark"
                                    :rules="[
                            { required: dialogTitile === '调整', message: '调整备注不能为空！', trigger: 'blur' }
                        ]">
                                <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
                            </el-form-item>
                            <el-form-item label="操作日期">
                                <el-date-picker
                                        v-model="form.opDate"
                                        type="date"
                                        @change="handleOpDate"
                                        format="yyyy-MM-dd"
                                        placeholder="选择操作日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table
                            :data="currentStyleSkuList"
                            class="no-hover-highlight row-table no-cell-padding is-fixed-header dialog-table"
                            border>
                        <el-table-column
                                label="规格"
                                fixed
                                align="center"
                                width="120">
                            <template slot-scope="scope">
                                <div class="standard">
                                    <div class="standard-left">
                                        <p class="standard-color">{{scope.row.colorName}}</p>
                                    </div>
                                    <div class="standard-right" v-if="scope.row.lengths && scope.row.lengths.length">
                                        <div class="standard-length"
                                           v-for="(lengthItem,index) in scope.row.lengths"
                                           :key="index">{{ lengthItem.standardValue }}</div>
                                    </div>
                                </div>
                                <!-- <p>{{scope.row.colorName}}</p> -->
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="一手"
                                align="center"
                                class-name="is-column-cell-block"
                                width="80">
                            <template slot-scope="scope">
                                <once-input
                                        :onceInputModel="onceInputModel"
                                        :scope="scope"
                                        @on-input="handleInputRowValue">
                                </once-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-for="(size, index) in currentStyleSizes"
                                :key="size.id"
                                :label="size.sizeValue"
                                align="center"
                                class-name="is-column-cell-block"
                                width="80">
                            <template slot-scope="scope">
                                <div class="input-wrap">
                                    <input
                                            v-for="(lengthItem, index) in scope.row.lengths"
                                            :key="index"
                                            v-if="scope.row.lengths &&
                                    scope.row.lengths.length &&
                                    currentStandbyValue[`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/${lengthItem.standardId || ''}`]"
                                            class="column-input"
                                            type="text"
                                            @input="handleInputValue(`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/${lengthItem.standardId || ''}`, scope.row)"
                                            v-model="currentStandbyValue[`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/${lengthItem.standardId || ''}`].num"/>
                                    <input
                                            v-if="scope.row.lengths &&
                                    !scope.row.lengths.length &&
                                    currentStandbyValue[`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/`]"
                                            class="column-input"
                                            type="text"
                                            @input="handleInputValue(`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/`, scope.row)"
                                            v-model="currentStandbyValue[`${scope.row.id}/${scope.row.colorId}/${size.sizeId}/`].num"/>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="adjust-tip" v-show="dialogTitile === '调整'">
                        <icon type="icon-chexiaogongdan-jiedianjingbao-da" w="12" h="12"></icon>
                        请在表格内直接输入最终数量进行库存调整。
                    </div>
                    <div class="total">
                        {{dialogTitile}}总计：
                        <span
                                v-show="dialogTitile !== '调整'"
                                :class="[
                        dialogTitile == '出库' ? 'yellow' : '',
                        dialogTitile == '入库' ? 'green' : ''
                    ]">{{totalNum}} 件</span>
                        <span
                                v-show="dialogTitile === '调整'"
                                class="red">
                        <i>+{{adjustNum.addNum}} 件</i>
                        <i v-show="adjustNum.subNum">/{{'-' + adjustNum.subNum}}件</i>
                    </span>
                    </div>
                </div>
                <div class="footer" slot="footer">
                    <nf-button @click="cancelAddStock">取消</nf-button>
                    <nf-button :loading="btnLoading" type="warning" @click="handleSubmit">确定</nf-button>
                </div>
            </el-dialog>
            <!-- 删除入库 -->
            <el-dialog
                    :show-close="false"
                    size="tiny"
                    custom-class="table-dialog nf-dialog"
                    :visible.sync="deleteVisible">
                <div class="dialog-main delete-dialog-main">
                    <icon type="icon-waring" w="80" h="80"></icon>
                    <p class="dialog-main__tip-msg">是否确认删除{{handleRow.styleNo}}的入/出库？</p>
                </div>
                <div class="footer edit-dialog-footer" slot="footer">
                    <nf-button @click="deleteVisible = false">取消</nf-button>
                    <nf-button type="warning" @click="handleSubmitDelate">确定</nf-button>
                </div>
            </el-dialog>
        </el-row>
    </div>
</template>

<script>
    import Emitter from "./mixins";
    import Utils from "@/utils/format";
    import {mapMutations} from "vuex";
    import TableColumn from "./table-column";
    import OnceInput from "./once-input";
    import {updateInventoryItem, deleteInventoryItem} from "@/api/api";
    import orderSelect from '@/components/Common/custom-select/relateOrderSelect'

    export default {
        props: {
            //   编辑/新建页面
            isStorage: {
                type: Boolean,
                default: false
            },
            value: {},
            isRealStore: {
                type: Boolean,
                default: false
            },
            standbyValue: {}, // 备用表格数据
            tableData: Array,
            bigList: {
                type: Object,
                default: {}
            },
            type: {
                type: Number, // 出库0 入库1 损益2 发货3  退货4
            },
            isShowAction: {
                type: Boolean,  //显示操作列
                default: true
            },
            formType: {
                type: Boolean,  //质检节点出库禁用
                default: false
            },
            hasRelateOrder: {
                type: '', // 是否有选择关联入库通知单
                default: ''
            },
            isEdit: {
                type: Boolean, // 是否编辑状态
                default: false
            },
            isShowInformNum: {
                type: Boolean, // 是否显示实际数
                default: false
            }
        },
        components: {
            TableColumn,
            OnceInput,
            orderSelect
        },
        mixins: [Emitter],
        data() {
            return {
                btnLoading: false,
                addGoods: false,
                dialogTableVisible: false,
                deleteVisible: false,
                defaultImg: this.$globalConfig.qiniu.baseDefaultUrl,
                formInline: {},
                styleNo: "",
                // handleType: '',
                handleRow: {},
                currentStyleSkuList: {},
                currentStyleSizes: [],
                form: {
                    remark: "",
                    opDate: Utils.formatDate(new Date(), "yyyy-MM-dd"),
                    changeType: ""
                },
                i: "",
            };
        },
        computed: {
            //
            isInStorge() {
                return Number(this.$route.query["isIn"]);
            },
            tdClassName() {
                return this.isStorage ? "" : "is-white-header";
            },
            isNoBorderRight() {
                return this.isStorage
                    ? "is-column-cell-block"
                    : "is-column-cell-block is-no-border-right";
            },
            // table表格里的sku表格数值
            currentValue: {
                get() {
                    return this.value;
                },
                set(val) {
                    this.$emit("input", val);
                    // this.setGoodList(val);
                }
            },
            // 用来处理弹窗表格数值
            currentStandbyValue: {
                get() {
                    return this.standbyValue;
                },
                set(val) {
                }
            },
            columnSkuVal() {
                return this.dialogTableVisible
                    ? this.currentStandbyValue
                    : this.currentValue;
            },
            currentTableData: {
                get() {
                    return this.tableData;
                },
                set(val) {
                    // this.dispatch('InStorage', 'update', [val])
                }
            },
            onceInputModel() {
                const onceModel = {};
                const skuVal = this.columnSkuVal;
                Object.keys(skuVal).map(key => {
                    const keyArr = key.split("/");
                    const skuIdStr = `${keyArr[0]}/${keyArr[1]}/${keyArr.pop()}`;
                    onceModel[skuIdStr] = {
                        stockNum: ""
                    };
                });
                return onceModel;
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id;
            },
            userId() {
                return (
                    this.$store.state.userInfo.id ||
                    JSON.parse(sessionStorage.getItem("user_login")).userId
                );
            },
            storehouseId() {
                return this.$route.query.storehouseId || sessionStorage.storehouseId;
            },
            totalNum() {
                let num = 0;
                Object.keys(this.currentStandbyValue).map(idStr => {
                    if (
                        this.currentStandbyValue[idStr].styleId ===
                        (this.handleRow.styleId || this.handleRow.id)
                    ) {
                        num += Number(this.currentStandbyValue[idStr].num);
                    }
                });
                return num;
            },
            adjustNum() {
                let addNum = 0,
                    subNum = 0;
                Object.keys(this.currentStandbyValue).map(idStr => {
                    if (
                        this.currentStandbyValue[idStr].styleId ===
                        (this.handleRow.styleId || this.handleRow.id)
                    ) {
                        const newNum = this.currentStandbyValue[idStr].num,
                            oldNUm = this.currentValue[idStr].num;
                        if (newNum > oldNUm) {
                            addNum += Number(newNum - oldNUm);
                        } else {
                            subNum += Number(oldNUm - newNum);
                        }
                        // num += Number(this.currentStandbyValue[idStr].num)
                    }
                });
                return {
                    addNum,
                    subNum
                };
            },
            dialogTitile() {
                let title = "";
                if (this.isRealStore) {
                    const type = this.form.changeType;
                    if (type && type === "IN_STORAGE") {
                        title = "入库";
                    }
                    if (type && type === "OUT_STORAGE") {
                        title = "出库";
                    }
                    if (type && type === "ADJUST") {
                        title = "调整";
                    }
                } else {
                    title = this.isInStorge ? "入库" : "出库";
                }
                return title;
            },
            columnLabel() {
                if (this.isRealStore) {
                    return "库存数";
                } else if (this.isInStorge) {
                    return "入库数";
                } else {
                    return "出库数";
                }
            }
        },
        watch: {
            dialogTableVisible(val) {
                if (val && !this.$route.query["isIn"]) {
                    this.form["remark"] = "";
                    this.form.opDate = Utils.formatDate(new Date(), "yyyy-MM-dd")
                    this.$nextTick(() => {
                        this.$refs["form"].resetFields();
                    });
                }
            }
        },
        mounted() {
            // console.log(this.tableData);
        },
        methods: {
            ...mapMutations(["setGoodList"]),
            handleLabel() {
                if(this.isRealStore) {
                    return '具体库存';
                }else {
                    if(this.type==3){
                        return '发货数'
                    }else if (this.type==4){
                        return '退货数'
                    }else if (this.type==5){
                        return '入库通知数/实际入库数（未确认入库时只显示通知数）'
                    }else if (this.hasRelateOrder&&!this.isEdit) {
                        if(this.type==1){
                            return '入库通知数/入库数'
                        }else if (this.type==0){
                            return '出库数/确认入库数（未确认入库时只显示出库数）'
                        }
                    }else {
                        if(this.type==1){
                            return '入库数'
                        }else if (this.type==0){
                            return '出库数'
                        }
                    }
                }
                // isRealStore?'具体库存':(type==1?'入库数':(type==3?'发货数':type==4?'退货数':type==5?'入库通知数/实际入库数（未确认入库时只显示通知数）':(hasRelateOrder?'出库数/确认入库数（未确认入库时只显示出库数）':'出库数')))
            },
            handlePrice(index) {
                this.$set(this.currentTableData[index],'totalPrice',(this.currentTableData[index].stockNum||0) * this.currentTableData[index].cost)
            },
            // 一手
            handleInputRowValue(row, index, lengthItem) {
                let {colorId, id, stockNum} = row; // id 为 styleId
                const valueObj = !this.dialogTableVisible
                    ? this.currentValue
                    : this.currentStandbyValue;
                if (!/^[0-9]*$/.test(stockNum)) {
                    this.$message.error("请输入纯数字！");
                    row.stockNum = 0;
                    return;
                }
                Object.keys(valueObj).map(item => {
                    // 通过id查找到table某一行，再通过colorId 找到sku的一行
                    // const isLenght = lengthItem && item.includes(id) && item.includes(colorId) && item.includes(lengthItem.standardId);
                    const bol = item.includes(id) && item.includes(colorId);
                    const isLenght =
                        bol && lengthItem && item.includes(lengthItem.standardId);
                    stockNum = isLenght
                        ? this.onceInputModel[
                        row.id + "/" + row.colorId + "/" + lengthItem.standardId
                            ].stockNum
                        : stockNum;
                    isLenght && this.setRowSkuVal(item, stockNum);
                    isLenght && console.log(item);
                    !lengthItem && bol && this.setRowSkuVal(item, stockNum);
                });
                !this.dialogTableVisible && this.countRowStockNum(row);
            },
            // 判断点击更多是否有权限
            clickisshow(scope) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.inventory.record.list") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.$router.push(
                    "/home/stock/stockrecord?styleNo=" +
                    scope.row.styleNo +
                    "&storehouseId=" +
                    this.storehouseId
                );
            },
            setRowSkuVal(key, stockNum) {
                if (!this.dialogTableVisible) {
                    this.currentValue[key].num = stockNum;
                } else {
                    this.currentStandbyValue[key].num = stockNum;
                }
            },
            // 单个
            handleInputValue(idStr, row) {
                console.log(row,'=3=3=3');
                // dialogTableVisible 为 true时，修改的是弹窗的表格
                const valueObj = !this.dialogTableVisible
                    ? this.currentValue
                    : this.currentStandbyValue;
                const num = valueObj[idStr].num;
                if (!/^[0-9]*$/.test(num)) {
                    this.$message.error("请输入纯数字！");
                    if (!this.dialogTableVisible) {
                        this.currentValue[idStr].num = 0;
                    } else {
                        this.currentStandbyValue[idStr].num = 0;
                    }
                }
                // if (!this.checkOutStockSkuValue(row.styleId)) return
                !this.dialogTableVisible && this.countRowStockNum(row);
            },
            // 当操作类型为出库时检查
            checkOutStockSkuValue(styleId, stockNum) {
                // stockNum 输入一手时
                if (this.dialogTitile === "出库") {
                    let isSubmit = false;
                    for (let key in this.currentStandbyValue) {
                        // console.log(this.currentStandbyValue[key].num > this.currentValue[key].num)
                        const newNum = stockNum || this.currentStandbyValue[key].num;
                        const oldNum = this.currentValue[key].num;
                        // const num = stockNum || this.currentValue[key].num;
                        if (key.indexOf(styleId) > -1 && newNum > oldNum) {
                            isSubmit = false;
                            this.currentStandbyValue[key].num = this.currentValue[key].num;
                            this.$confirm(
                                `规格中${this.currentValue[key].colorName}、${
                                    this.currentValue[key].sizeValue
                                    }出库数量超过库存量`,
                                "提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "error"
                                }
                            )
                                .then(() => {
                                })
                                .catch(() => {
                                });
                            return isSubmit;
                        }
                        isSubmit = true;
                    }
                    return isSubmit;
                } else {
                    return true;
                }
            },
            // 计算货款库存数
            countRowStockNum(row, val) {
                let num = 0;
                const index = this.tableData.findIndex(
                    item => (item.styleId || item.id) === row.id
                );
                Object.keys(this.currentValue).map(item => {
                    if (item.indexOf(row.id) > -1) {
                        num += Number(this.currentValue[item].num);
                    }
                });
                // 在批量入库时 id 为styleId， 实时库存就为styleId；
                this.currentTableData[index].num = num;
                this.$set(this.currentTableData[index],'stockNum',num)
                this.$set(this.currentTableData[index],'totalPrice',(Number(this.currentTableData[index].stockNum)||0) * (this.currentTableData[index].cost||0))
                // 存取vuex∂
                this.setGoodList(this.currentTableData);
            },
            // 点击追加按钮
            handleAddStock(row, type) {
                this.sign == "0"
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist) {
                    // 入库权限
                    if (type == "IN_STORAGE") {
                        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                            .permissionList;
                        if (datalist.indexOf("fac.inventory.inStorage") == -1) {
                            this.$message.error("抱歉，您没有操作权限");
                            return;
                        }
                        // 出库权限
                    } else if (type == "OUT_STORAGE") {
                        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                            .permissionList;
                        if (datalist.indexOf("fac.inventory.outStorage") == -1) {
                            this.$message.error("抱歉，您没有操作权限");
                            return;
                        }
                        // 调整权限
                    } else if (type == "ADJUST") {
                        var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                            .permissionList;
                        if (datalist.indexOf("fac.inventory.adjust.storage") == -1) {
                            this.$message.error("抱歉，您没有操作权限");
                            return;
                        }
                    }
                }

                let skuList = JSON.parse(JSON.stringify(row.commonStyleSkuList));
                this.handleRow = JSON.parse(JSON.stringify(row)); // 记录操作行
                // console.log(this.handleRow)
                this.styleNo = row.styleNo;
                this.form.changeType = type || "";
                this.initCurrentStandbyValue();
                this.currentStyleSkuList = this.initCurrentStyleSkuList(skuList);
                this.currentStyleSizes = row.sizes.slice();
                this.dialogTableVisible = true;
            },
            // 初始化弹窗表格值
            initCurrentStyleSkuList(arr = []) {
                return (arr = arr.map(item => {
                    item.stockNum = "";
                    return item;
                }));
            },
            // 初始数据tableData里input的值；
            initCurrentStandbyValue(styleId) {
                Object.keys(this.currentStandbyValue).map(idStr => {
                    if (styleId) {
                        // 删除成功够清空表格的值
                        if (this.currentValue[idStr].styleId === styleId) {
                            this.currentValue[idStr].num = "";
                        }
                    } else {
                        // 追加
                        if (this.dialogTitile === "调整") {
                            this.currentStandbyValue[idStr].num = this.currentValue[idStr].num;
                            // return
                        } else {
                            this.currentStandbyValue[idStr].num = "";
                        }
                    }
                });
            },
            cancelAddStock() {
                this.dialogTableVisible = false;
            },
            // 点击弹窗确定按钮
            handleSubmit() {
                // console.log(this.handleRow);
                // return
                if (this.isStorage) {
                    this.submitUpdataStock();
                    return;
                }
                //实时库存页面
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.submitUpdataStock();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            submitUpdataStock() {
                if (this.isRealStore) {
                    const params = this.getUpdataParams();
                    if (!params.inventoryItemStockSysku.length) {
                        this.$message.error("请输入数量");
                        return;
                    }
                    if (this.dialogTitile === "调整") {
                        if (this.form.remark == "") {
                            this.$message.error("请填写备注");
                            return;
                        }
                    }
                    this.btnLoading = true
                    this.updataStock(params).then(res => {
                        this.btnLoading = false
                        if (res) {
                            this.$emit('getData')
                            this.submitSuccess(this.handleRow.styleId);
                        }
                    });
                } else {
                    this.submitSuccess(this.currentStyleSkuList[0].id);
                }
            },
            submitSuccess(styleId) {
                Object.keys(this.currentValue).map(idStr => {
                    const num = this.currentStandbyValue[idStr].num,
                        oldNum = this.currentValue[idStr].num;
                    if (this.dialogTitile === "出库" && !this.isStorage) {
                        this.currentValue[idStr].num =
                            Number(this.currentValue[idStr].num) - Number(num);
                    } else if (this.dialogTitile === "调整") {
                        this.currentValue[idStr].num +=
                            num > oldNum ? num - oldNum : num - oldNum;
                        // if (num > oldNum) {

                        // }
                    } else {
                        this.currentValue[idStr].num =
                            Number(this.currentValue[idStr].num) + Number(num);
                    }
                });
                this.dialogTableVisible = false;
                this.initCurrentStandbyValue();
                this.countRowStockNum({id: styleId});
            },
            getUpdataParams() {
                const row = this.handleRow;
                // let totalNum;
                // if (this.dialogTitile === '出库'）
                // let totalNum = this.dialogTitile === '入库' ? this.totalNum : this.adjustNum.addNum;
                // if(this.dialogTitile === '调整') {

                // }
                return {
                    subtractNum: this.dialogTitile === "调整" ? this.adjustNum.subNum : "",
                    ...this.form,
                    facId: this.unitId,
                    userId: this.userId,
                    storehouseId: this.storehouseId,
                    id: row.id,
                    targetType: row.targetType,
                    targetId: row.styleId,
                    num:
                        this.dialogTitile === "调整" ? this.adjustNum.addNum : this.totalNum,
                    inventoryItemStockSysku: this.getInventoryItemStockSysku(row)
                };
            },
            getInventoryItemStockSysku(row) {
                const inventoryItemStockSysku = [];
                Object.keys(this.currentValue).map(idStr => {
                    // const item = {}
                    const currentStandbyValue = this.currentStandbyValue[idStr];
                    if (row.styleId === currentStandbyValue.styleId) {
                        const item = row.inventoryItemStockList.find(
                            listItem => listItem.styleSkuId === currentStandbyValue.skuId
                        );
                        if (currentStandbyValue.num) {
                            inventoryItemStockSysku.push({
                                ...item,
                                styleSkuId: currentStandbyValue.skuId,
                                skuId: currentStandbyValue.skuId,
                                num: currentStandbyValue.num
                            });
                        }
                    }
                });
                return inventoryItemStockSysku;
            },
            updataStock(params) {
                return updateInventoryItem(params).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg);
                        return true;
                    } else {
                        this.$message.error(res.data.msg);
                        return false;
                    }
                });
            },
            // 批量入库删除
            deleteItem(row) {
                const index = this.currentTableData.findIndex(item => item.id === row.id);
                this.currentTableData.splice(index, 1);
            },
            handleShowDeleteDialog(row, index) {
                var datalist = JSON.parse(sessionStorage.getItem("user_login"))
                    .permissionList;
                if (datalist.indexOf("fac.inventory.delete") == -1) {
                    this.$message.error("抱歉，您没有操作权限");
                    return;
                }
                this.deleteVisible = true;
                this.handleRow = row;
                this.i = index;
            },
            handleSubmitDelate() {
                // console.log(this.handleRow)
                this.deteleItemEv({
                    facId: this.unitId,
                    userId: this.userId,
                    id: this.handleRow.id
                });
            },
            // 实时库存删除
            deteleItemEv(params) {
                deleteInventoryItem(params).then(res => {
                    if (res.data.code === 0) {
                        this.deleteVisible = false;
                        this.$message.success("删除成功");
                        // console.log(this.handleRow)
                        this.initCurrentStandbyValue(this.handleRow.styleId);
                        this.countRowStockNum({id: this.handleRow.styleId}, 0);
                        // const index = this.currentTableData.findIndex(item => item.id === params.id);
                        // this.currentTableData.splice(index, 1);
                        this.$nextTick(() => {
                            this.currentTableData.splice(this.i, 1);
                            this.$emit("getData");
                        });
                        // this.currentTableData.splice(this.i, 1);
                        return;
                    }
                    this.$message.error(res.data.msg);
                });
            },
            handleOpDate(val) {
                this.form.opDate = val;
            }
        },
        destroyed() {
            this.setGoodList([]);
        }
    };
</script>

<style lang="scss" scoped>
    .red {
        color: #fa4150;
    }

    .green {
        color: #23c811;
    }

    .yellow {
        color: #fc8a26;
    }

    .stock-list {
        // width: 1200px;
        // overflow: scroll;
        .good-img {
            width: 45px;
            height: 45px;
        }
        .cell-con {
            line-height: 15px;
            // padding: 12px 0;
        }
        .btn-wrap {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            >span,>button {
                width: 50%;
                margin-left: 0;
            }
            svg {
                width: 16px;
                height: 16px;
                margin-top: -2px;
                margin-right: 5px;
            }
            /*<!--&.isStorage{-->*/
            /*<!--justify-content: flex-start;-->*/
            /*<!--span,button {-->*/
            /*<!--width: 33%;-->*/
            /*<!--margin-left: 0;-->*/
            /*<!--}-->*/
            /*<!--&gt;span{-->*/
            /*<!--margin-left: -12px;-->*/
            /*<!--}-->*/
            /*<!--}-->*/
        }
        .adjust-tip {
            width: 270px;
            padding: 0 8px;
            margin-top: 12px;
            line-height: 28px;
            text-align: left;
            font-size: 12px;
            color: #a2abb8;
            background-color: #f5f7fa;
            svg {
                margin-right: 5px;
            }
        }
    }

    .more-handle {
        div {
            padding-left: 11px;
            &:hover {
                background: #ebeff5;
            }
        }
        button {
            margin-left: 0;
            width: 100%;
            text-align: left;
        }
        svg {
            margin-right: 5px;
        }
    }

    input {
        display: block;
        width: 100%;
        padding: 0;
        text-align: center;
        box-sizing: border-box;
        background: transparent;
        height: 38px;
        &:not(:last-child) {
            border-bottom: 1px solid #e0e6ed;
        }
        &:focus {
            // box-sizing: border-box;
            // height: 34px;
            border: 1px solid #ffa914; /*box-shadow: inset 0 -1px 0 0 #e0e6ed; */
            // box-shadow: inset 0 -1px 0 0 #e0e6ed
        }
    }

    .column-wrap {
        .input-wrap:not(:last-child) {
            border-bottom: 1px solid #e0e6ed;
        }
    }

    .table-dialog {
        input {
            width: 100%;
            height: 38px;
            box-sizing: border-box;
        }
        .total {
            margin-top: 16px;
            text-align: right;
            span {
                font-size: 20px;
            }
        }
        .dialog-title {
            text-align: center;
            font-size: 20px;
            padding-bottom: 16px;
        }
        .dialog-main {
            text-align: left;
            &__tip-msg {
                margin-top: 32px;
            }
        }
        .delete-dialog-main {
            text-align: center;
        }
        .edit-dialog-footer {
            padding-top: 22px;
            padding-bottom: 17px;
            border-top: 1px solid #e0e6ed;
            text-align: center;
        }
        .stock-dialog-form {
            display: flex;
            justify-content: space-between;
        }
        .dialog-table {
            display: inline-block;
            width: auto;
        }
    }

    .standard {
        display: flex;
        &-left {
            flex: 1;
            .standard-color {
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }
        }
        &-right {
            /*display: flex;*/
            /*flex-direction: column;*/
            width: 50%;
            border-left: 1px solid rgb(223, 228, 236);
            .standard-length {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 38px;
                box-sizing: border-box;
                &:not(:last-child) {
                    border-bottom: 1px solid rgb(223, 228, 236);
                }
            }
        }
    }
</style>
<style lang="scss">
    .el-table__body,
    .el-table__footer,
    .el-table__header {
        // table-layout: inherit !important;
    }
</style>

