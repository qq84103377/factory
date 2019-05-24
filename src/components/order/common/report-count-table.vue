<template>
    <el-table
            style="margin-top: 30px;"
            :style="{width:120*(sizeArr.length+2)+2+'px'}"
            v-if="currentListCount.length>0"
            class="ligation-report__table"
            :data="currentListCount"
            border>
        <el-table-column
                prop="colorName"
                label="规格"
                width="120">
        </el-table-column>
        <el-table-column
                v-for="(item,index) in sizeArr"
                :label="item.sizeName"
                :key="item"
                width="120">
            <template slot-scope="scope">
                <span>{{item.valueArr[scope.$index]}}</span>
            </template>
        </el-table-column>
        <el-table-column
                label="合计"
                width="120">
            <template slot-scope="scope">
                <span>{{fillter(scope.$index)}}</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "report-count-table",
        props:['currentList'],
        data() {
            return {
                currentList: [],
                listCount: [],
                currentListCount: [],
                sizeArrBf: [],
                sizeArr: [],
                oldNum: 0,
                timeNum: 0,
            }
        },
        watch:{
            'currentList':function (val) {
                // 监听总数据清除旧数据
                if (val.length === 0) {
                    this.listCount = [];
                    this.currentListCount = [];
                    this.sizeArrBf = [];
                    this.sizeArr = [];
                    this.oldNum = 0;
                }
            }
        },
        methods: {
            // 扎号选择
            handleItemClick(item) {
                if (this.listCount.indexOf(item.colorName) === -1) {
                    this.listCount.push(item.colorName);
                    this.currentListCount.push({'colorName': item.colorName})
                }
                // 如果尺寸在表格还没有就push进去，有就不用
                if (this.sizeArrBf.indexOf(item.sizeName) === -1) {
                    this.sizeArrBf.push(item.sizeName);
                    this.sizeArr.push({'sizeName': item.sizeName})
                }
                // 数值统计
                this.currentListCount.forEach(($itemCount, index) => {
                    this.sizeArr.forEach(($item, $index) => {
                        //初始化数值，全部为0
                        if (!this.sizeArr[$index].valueArr) {
                            console.log(121);
                            this.sizeArr[$index].valueArr = [];
                            this.sizeArr[$index].valueArr[index] = 0
                        } else {
                            if (!this.sizeArr[$index].valueArr[index]) {
                                this.sizeArr[$index].valueArr[index] = 0
                            }
                        }
                        if (item.colorName === $itemCount.colorName && item.sizeName === $item.sizeName) {
                            if (!this.sizeArr[$index].valueArr[index]) {
                                //初始化数值，全部为0
                                this.sizeArr[$index].valueArr[index] = 0
                            }
                            this.$set(this.sizeArr[$index].valueArr, index, this.sizeArr[$index].valueArr[index] + item.canReportNum)

                        }

                    })
                })
                console.log(this.sizeArr);
                // 对数据进行重构触发表格视图层
                let aaa = [...this.currentListCount];
                this.currentListCount = aaa;

            },
            // 合计
            fillter(rowIndex) {
                var sum = 0
                this.sizeArr.forEach(item => {
                    sum += parseInt(item.valueArr[rowIndex])
                })
                return sum
            },

            // 获取上一次的值备份
            getQualityOld(oldNum) {
                console.log(oldNum);
                this.oldNum = oldNum
            },
            // 数值变化
            handleInput(row) {
                console.log(row)

                if (row.canReportNum <0) {
                    row.canReportNum = 0
                    // 编辑的时候
                    // row.qualified = row.quantity;
                    this.$message.error('上报数量不能小于0')

                }
                if(row.num){
                    row.total = row.num
                }
                // alreadyReportNum是已报数 total是总数
                if (row.total - row.alreadyReportNum < row.canReportNum) {
                    // 编辑的时候
                    // row.qualified = row.quantity;
                    this.$message.error('修改的数量已经大于可上报的数量')

                }
                row.qualified = row.canReportNum;
                // row.qualified = row.qualified.replace(/^[0|-]/, '');
                if (row.reportId && row.qualified <= row.quantity) {
                    // 编辑的时候
                    row.qualified = row.quantity;
                    return this.$message.error('修改的数量不能小于上次上报的数量')
                }
                if (row.qualified > row.canReportNum) {
                    // 编辑的时候
                    // row.qualified = row.quantity;
                    this.$message.error('修改的数量已经大于可上报的数量')

                }
                console.log(row);
                // 数值统计
                if (!row.qualified) {
                    row.qualified = 0
                }
                this.currentListCount.forEach(($itemCount, index) => {
                    this.sizeArr.forEach(($item, $index) => {
                        if (row.colorName === $itemCount.colorName && row.sizeName === $item.sizeName) {
                            var num = row.qualified - this.oldNum
                            this.$set(this.sizeArr[$index].valueArr, index, this.sizeArr[$index].valueArr[index] + num)
                            // 把现在输入的数值赋值给备份数据
                            this.oldNum = row.qualified
                        }
                    })
                })
                // 对数据进行重构触发表格视图层
                let aaa = [...this.currentListCount];
                this.currentListCount = aaa;

            },

            handleItemDelete(row,$indexBig) {
                console.log(row);
                console.log(4545);
                // 删除后联动统计表格
                // 都有的颜色和码数 和减去现在的数
                this.currentListCount.forEach(($itemCount, index) => {
                    this.sizeArr.forEach(($item, $index) => {
                        if (row.colorName === $itemCount.colorName && row.sizeName === $item.sizeName) {
                            this.$set(this.sizeArr[$index].valueArr, index, this.sizeArr[$index].valueArr[index] - row.qualified)
                        }
                    })
                })
                var currentListColorArr = [];
                var currentListSizeArr = [];
                this.currentList.forEach(item => {
                    currentListColorArr.push(item.colorName)
                    currentListSizeArr.push(item.sizeName)
                })
                // 删除后没有这样的颜色
                if (currentListColorArr.indexOf(row.colorName) === -1) {
                    this.listCount.forEach((item, index) => {
                        if (item === row.colorName) {
                            this.listCount.splice(index, 1)
                        }
                    })
                    this.currentListCount.forEach((item, index) => {
                        if (item.colorName === row.colorName) {
                            this.currentListCount.splice(index, 1)
                        }
                    })
                }
                // 删除后没有这样的码数
                if (currentListSizeArr.indexOf(row.sizeName) === -1) {
                    // 删除后没有这样的码数
                    this.sizeArrBf.forEach((item, index) => {
                        if (item === row.sizeName) {
                            this.sizeArrBf.splice(index, 1)
                        }
                    })
                    this.sizeArr.forEach((item, index) => {
                        if (item.sizeName === row.sizeName) {
                            this.sizeArr[index].valueArr.splice($indexBig, 1)
                            this.sizeArr.splice(index, 1)

                        }
                    })
                }

                // 对数据进行重构触发表格视图层
                let aaa = [...this.currentListCount];
                this.currentListCount = aaa;
            }
        }
    }
</script>

<style scoped>

</style>