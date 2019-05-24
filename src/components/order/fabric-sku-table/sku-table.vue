<template>
    <div class="nf-sku-table">
        <el-table
            :data="colorArr"
            border
            style="width: 100%">
                <el-table-column
                        v-if="editable"
                        class-name="nf-sku-table__standard--column"
                        label="序号"
                        align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.$index !== 0">{{ scope.$index }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    class-name="nf-sku-table__standard--column"
                    width="120"
                    align="center"
                    label="面料颜色">
                    <template slot-scope="scope">
                        <el-dropdown trigger="click" v-if="scope.$index === 0 && editable">
                            <el-button
                                class="nf-sku-table__add-btn"
                                type="text">+添加颜色</el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item
                                    @click.native.stop="handleAdd(colorItem)"
                                    v-for="colorItem in colorOptions"
                                    :key="colorItem.color_id">{{ colorItem.color_no_name }}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-row
                            class="standard"
                            type="flex"
                            v-if="!editable || scope.$index !== 0">
                            <div class="standard--left">
                                {{ scope.row.color_no_name }}
                            </div>
                            <div class="standard--right" v-if="isShowLength">
                                <p class="standard__length" v-for="lengthItem in lengthArr" :key="lengthItem.standard_id">{{ lengthItem.standard_value }}</p>
                            </div>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column
                    width="160"
                    v-if="editable"
                    align="center"
                    label="层数">
                    <template slot-scope="scope">
                        <span v-if="scope.$index === 0 && editable">(右侧填数可批量设码比)</span>
                        <template v-if="scope.$index !== 0">
                            <div class="hand-input" v-if="!isShowLength">
                                <nf-sku-table-once-input
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        colorItem: scope.row,
                                        onceModel: onceModel,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-once-input>
                            </div>
                            <div class="hand-input" v-if="isShowLength">
                                <nf-sku-table-once-input
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        onceModel: onceModel,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-once-input>
                            </div>
                        </template>
                    </template>
                </el-table-column>
                <!-- 渲染尺码列 -->
                <el-table-column label="码比" align="center">
                    <el-table-column
                        width="90"
                        align="center"
                        :label="sizeItem.size_value"
                        v-for="sizeItem in sizeArr"
                        :key="sizeItem.size_id">
                        <template slot-scope="scope">
                            <templage v-if="scope.$index === 0 && editable">
                                <input
                                        type="number"
                                        class="size-once-input"
                                        :key="sizeItem.size_id"
                                        v-model="sizeItem.target"
                                        @input="once(sizeItem)"
                                >
                            </templage>
                            <template v-if="!isShowLength && (scope.$index !== 0 || !editable)">
                                <div class="hand-input" v-if="editable">
                                    <nf-sku-table-input
                                        :skuVal.sync="currentSkuVal"
                                        v-bind="{
                                            sizeItem: sizeItem,
                                            colorItem: scope.row,
                                            showNum: showNum,
                                            isShowLength: isShowLength
                                        }"></nf-sku-table-input>
                                </div>
                                <!-- 没有内长时渲染 -->
                                <nf-sku-table-text
                                v-if="!editable"
                                :skuVal.sync="currentSkuVal"
                                v-bind="{
                                    sizeItem: sizeItem,
                                    colorItem: scope.row,
                                    showNum: showNum,
                                    isShowLength: isShowLength
                                }">
                                </nf-sku-table-text>
                            </template>
                            <template v-if="isShowLength && (scope.$index !== 0 || !editable)">
                                <div class="hand-input" v-if="editable">
                                    <nf-sku-table-input
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-input>
                                </div>
                                <div class="size" v-if="!editable">
                                    <!-- 有内长时渲染 -->
                                    <nf-sku-table-text
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        showNum: showNum,
                                        isShowLength: isShowLength
                                    }">
                                    </nf-sku-table-text>
                                </div>
                            </template>
                        </template>
                    </el-table-column>
                    <!-- 渲染尺码列---end -->
                </el-table-column>
                <el-table-column
                    class-name="nf-sku-table__standard--column"
                    label="操作"
                    width="90"
                    align="center"
                    v-if="editable">
                    <template slot-scope="scope">
                        <el-button type="text" style="color: #ff4949" @click="handleDelete(scope.row, scope.$index)" v-show="scope.$index !== 0">删除</el-button>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    class-name="nf-sku-table__standard--column"
                    label="合计"
                    width="90"
                    align="center"
                    v-if="editable">
                        <template slot-scope="scope">
                            <div class="size" v-if="!isShowLength">
                                <nf-sku-table-count
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        sizeItem: sizeItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-count>
                            </div>
                            <div class="size" v-if="isShowLength">
                                <nf-sku-table-count
                                    v-for="lengthItem in lengthArr"
                                    :key="lengthItem.standard_id"
                                    v-bind="{
                                        skuVal: currentSkuVal,
                                        lengthItem: lengthItem,
                                        colorItem: scope.row,
                                        isShowLength: isShowLength
                                    }"></nf-sku-table-count>
                            </div>
                        </template>
                </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
import NfSkuTableText from './sku-table-text';
import NfSkuTableInput from './sku-table-input';
import NfSkuTableOnceInput from './sku-table-once-input';
import NfSkuTableCount from './sku-table-count';
import mixin from './sku-table-mixin';
export default {
    componentName: 'NfSkuTable',
    props: {
        // sku数组
        metadatas: {
            type: Array,
            default: (() => [])
        },
        // 带有上报过数据的sku列表
        quantities: {
            type: Array,
            default: (() => [])
        },
        colorOptions: [],
        editable: Boolean,
        showNum: Boolean // 是否只显示单个字段num，不显示finisNum
    },
    mixins: [mixin],
    components: {
        NfSkuTableText,
        NfSkuTableInput,
        NfSkuTableOnceInput,
        NfSkuTableCount
    },
    data() {
        return {
            tableData: {},
            currentSkuVal: {},
            colorArr: [],
            uid: 0,
            onceModel: {},
            backupCurrentSkuVal: {} // sku数据备份，方便currentSkuVal改变后可以回退数据
        }
    },
    computed: {
        // colorArr() {
        //     const arr = this.tableData['colorArr'];
        //     arr.unshift({});
        //     return this.tableData['colorArr'];
        // },
        lengthArr() {
            return this.tableData['lengthArr'];
        },
        sizeArr() {
            return this.tableData['sizeArr'];
        },
        isShowLength() {
            return this.lengthArr.length;
        },
        // 总数
        totalQuality() {
            return Object.keys(this.currentSkuVal).reduce((num, key) => {
                num += Number(this.currentSkuVal[key].num);
                return num;
            }, 0);
        }
    },
    watch: {
        'currentSkuVal': {
            handler(val) {
                console.log(val)
                this.$emit('change', val, this.totalQuality);
            },
            deep: true
        },
        // 上报成功后重新
        'metadatas'(val) {
            this.tableData = this.getTableData(this.metadatas);
        }
    },
    created() {
        this.tableData = this.getTableData(this.metadatas);
        if (this.editable) {
            this.colorArr.push({})
        }
    },
    methods: {
        //一手
        once(sizeItem){
            if(sizeItem){
                // 遍历尺码
                if(sizeItem.target >= 0){
                    //遍历sku
                    for(let i in this.currentSkuVal){
                        if(i.indexOf(sizeItem.size_id) > 0){
                            this.currentSkuVal[i].num = sizeItem.target;
                        }
                    }
                }
            }
        },
        // 当不是编辑状态时，获取值
        resetSkuTableData() {
            // 输入框值
            Object.keys(this.currentSkuVal).forEach(key => {
                this.currentSkuVal[key].num = '';
            });
            // reset一手子组件的输入框值
            this.broadcast('NfSkuTableOnceInput', 'sku.table.once.input.initFn');
        },
        handleAdd(colorItem) {
            this.colorArr.splice(1, 0, { ...colorItem, uid: ++this.uid });
            this.getOnceModel();
            this.currentSkuVal = this.creatCurrentSkuVal(this.colorArr, this.metadatas);
            // console.log(skuVal);
            this.$emit('on-add-color', colorItem, this);
        },
        creatCurrentSkuVal(colorArr = [], metadatas = []) {
            const { lengthArr, sizeArr } = this.tableData;
            return colorArr.reduce((json, colorItem) => {
                metadatas.forEach((metadataItem, index) => {
                    if (metadataItem.color_id === colorItem.color_id) {
                        let _key;
                        if (!lengthArr.length) {
                            _key = `${metadataItem.color_id}-${metadataItem.size_id}-${colorItem.uid}`;
                        }
                        else {
                            _key = `${metadataItem.color_id}-${metadataItem.size_id}-${metadataItem.standard_id}-${colorItem.uid}`;
                        }
                        json[_key] = {
                            skuId: metadataItem.id,
                            storeyQuantity: this.currentSkuVal[_key] && this.currentSkuVal[_key].storeyQuantity || '',
                            num: this.currentSkuVal[_key] && this.currentSkuVal[_key].num || '',
                        }
                        this.getOnceModel(colorItem, metadataItem);
                    }
                });
                return json;
            }, {});
        },
        // 生成层数输入框v-model的值
        getOnceModel(colorItem, metadataItem) {
            if (!colorItem) return;
            let _key;
            if (this.isShowLength) {
                _key = `${colorItem.color_id}-${metadataItem.standard_id}-${colorItem.uid}`;
            }
            else {
                _key = `${colorItem.color_id}-${colorItem.uid}`;
            }
            const obj = { ...this.onceModel };
            // this.onceModel[_key] && this.onceModel[_key].storeyQuantity || '', 判断是否存在历史输入的值，有就取该值；
            obj[_key] = {
                storeyQuantity: this.onceModel[_key] && this.onceModel[_key].storeyQuantity || '',
            }
            this.onceModel = obj;
        },
        handleDelete(row, index) {
            this.colorArr.splice(index, 1);
            Object.keys(this.currentSkuVal).forEach(key => {
                const uid = key.substr(key.lastIndexOf('-') + 1);
                if (row.uid == uid) {
                    delete this.currentSkuVal[key];
                }
            });
            console.log(this.currentSkuVal)
            this.$nextTick(() => {
                this.$emit('on-delete', {row, index})
            });
        },
        // 给父组件获取currentSkuVal数据
        getSkuTableValue() {
            return this.currentSkuVal;
        },
        getBackUpSkuTableValue() {
            return this.backupCurrentSkuVal;
        },
        // 主要提供给外部需要修改currentSkuVal值时调用
        setCurrentSkuVal(value) {
            this.currentSkuVal = value;
        },
        setColorArr(arr) {
            this.colorArr = arr;
        },
        getColorArr() {
            return this.colorArr
        }
    }
}
</script>

<style lang="scss">
    .nf-sku-table {
        display: inline-block;
        -webkit-user-select: none;
        &__add-btn {
            font-size: 12px;
            color: #FFA914;
        }
        &__standard--column {
            color: #A2ABB8;
        }
        th {
            background-color: #F5F7FA;
        }
        th > .cell {
            font-weight: normal;
            color: #A2ABB8;
            background-color: #F5F7FA;
        }
        .el-table__body {
            .cell,
            td {
                padding: 0;
                line-height: 40px;
                background: #fff;
            }
        }
        .standard {
            background-color: #F5F7FA;
            &--left {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            &--right {
                width: 50%;
                border-left: 1px solid rgb(223, 228, 236);
                .standard__length {
                    height: 40px;
                    box-sizing: border-box;
                    &:not(:last-child) {
                        border-bottom: 1px solid rgb(223, 228, 236);
                    }
                }
            }
        }

        .hand-input {
            &--inner {
                display: block;
                height: 40px;
                width: 100%;
                padding: 0 5px;
                box-sizing: border-box;
                cursor: pointer;
                &:focus {
                    box-shadow: inset 0 0 0 1px #ffa914;
                }
                &:not(:last-child) {
                    border-bottom: 1px solid rgb(223, 228, 236);
                }
            }
        }

        .size {
            &__value {
                 height: 40px;
                box-sizing: border-box;
                &:not(:last-child) {
                    border-bottom: 1px solid rgb(223, 228, 236);
                }
            }
        }
        .size-once-input{
            display: block;
            height: 40px;
            width: 100%;
            padding: 0 5px;
            box-sizing: border-box;
            cursor: pointer;
        }
    }
</style>
