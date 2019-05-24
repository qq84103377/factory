<template>

    <div class="submitter-item">
        <el-form>
            <el-form-item :label="nodeType==='TYPING'?'版师':'样衣师'" label-width="80px">
                <div style="width: 220px;display: inline-block">
                    <span>{{item.sampleAndMachinist.name}}</span>
                </div>
                <!--<span v-if="index!=0" @click="deleteItem" class="gray mgl10 pointer">删除</span>-->
            </el-form-item>
            <el-form-item label="难度" label-width="80px">
                <div class="difficulty-table">
                    <table>
                        <tr>
                            <td>难度分类</td>
                            <td>
                                <el-select style="width: 100%;" v-model="item.sampleAndMachinist.difficultyId" placeholder="请选择打版类型"
                                           @change="selectRight">
                                    <el-option
                                            v-for="r in rightList"
                                            :key="r.difficultyId"
                                            :label="r.rightTitle"
                                            :value="r.difficultyId">
                                    </el-option>
                                </el-select>
                            </td>
                            <td> </td>
                        </tr>
                        <tr class="difficulty-item" v-for="(d,dIndex) in item.difficultyConfigs" :key="dIndex">
                            <td class="no-padding">
                                <el-select style="width: 100%;" v-model="d.styleId" placeholder="请选择难度分类"
                                           @change="selectLeft(d)">
                                    <el-option
                                            v-for="l in leftList"
                                            :key="l.styleId"
                                            :label="l.leftTitle"
                                            :value="l.styleId">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>{{d.difficultyDegree===0?'':d.difficultyDegree}}</td>
                            <td @click="del(dIndex)">删除</td>
                        </tr>
                        <tr>
                            <td colspan="2"><span @click="addRow" class="orange pointer">+添加</span></td>
                        </tr>
                        <tr>
                            <td>合计</td>
                            <td>
                                <el-input @blur="handleDiffcultyBlur" type="number"
                                          v-model="item.sampleAndMachinist.difficulty"></el-input>
                            </td>
                            <td style="border-top: 1px solid #E6EAF0;"> </td>
                        </tr>
                    </table>
                </div>
            </el-form-item>
            <el-form-item label="备注" label-width="80px">
                <el-input v-model="item.reason"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {getUnitUser, getDifficulty} from '@/api';
    import {
        designWorkbenchPatternStyleList,
        designWorkbenchPatternDifficultyList,
        designWorkbenchAllocationMachinist,
        designWorkbenchAllocationSampleDesigner
    } from '@/api/sample-centre';
    import WorkerLeader from "../../Common/workerLeader";

    export default {
        components: {WorkerLeader},
        props: ['nodeType', 'item', 'index', 'rightList', 'leftList', 'missionPrcdNodeId', 'designPrcdNodeId'],
        data() {
            return {
                difTotal: 0,
                options: {
                    groupOptions: []
                },
                rightId: '',
                difficultyConfigs: [
                    // {
                    //     styleId: "",    //左边的id
                    //     difficultyId: "",  //右边的难度
                    //     difficultyDegree: "",  //难度系数
                    //     otherDifficulty: "",     //其他难度系数
                    //     type: "",
                    //     sort: 1,
                    //     rightNum: "",
                    //     leftNum: "",
                    //     detailId: ''
                    // }
                ], //难度表格数据源
            }
        },
        created() {
            console.log('新建一个');
            this.fetchUnitUser();
            // this.difficultyConfigs = [{
            //     styleId: "",    //左边的id
            //     difficultyId: "",  //右边的难度
            //     difficultyDegree: "",  //难度系数
            //     otherDifficulty: "",     //其他难度系数
            //     type: this.nodeType==='TYPING'?'0':'1',
            //     sort: 1,
            //     detailId: ''
            // }]
        },
        watch: {
            // rightList: {
            //     // 如果下拉只有1个值时自动选择
            //     handler(v) {
            //         if(v.length == 1){
            //             this.rightId = v[0].difficultyId
            //             this.selectRight()
            //         }
            //     },
            //     deep: true
            // },
            // leftList: {
            //     // 如果下拉只有1个值时自动选择
            //     handler(v) {
            //         if(v.length == 1){
            //             this.difficultyConfigs[0].styleId = v[0].styleId
            //             this.selectRight(this.difficultyConfigs[0])
            //         }
            //     },
            //     deep: true
            // },
            total(val) {
                this.item.sampleAndMachinist.difficulty = val
                // this.item.totalDifficulty = val
            },
            missionPrcdNodeIds(val) {
                this.item.missionPrcdNodeIds = val
            },
            difficultyConfigs: {
                handler(v) {
                    // if(this.rightList.length == 1&&this.rightId==''){
                    //     this.rightId = this.rightList[0].difficultyId
                    //     this.selectRight()
                    // }
                    // if(this.leftList.length == 1){
                    //     v[v.length-1].styleId = this.leftList[0].styleId
                    //     this.selectLeft(v[v.length-1])
                    // }
                    this.item.difficultyConfigs = v
                },
                deep: true
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            },
            total() {
                let total = 0
                this.item.difficultyConfigs.forEach(item => {
                    total = total + (item.difficultyDegree||0)
                })
                return total
            }
            // totalDifficulty() {
            //     let total = 0
            //     if (this.difficultyConfigs.length) {
            //         this.difficultyConfigs.forEach(item => {
            //             total = total + item.difficultyDegree
            //         })
            //     }
            //     return total.toFixed(3)
            // }
        },
        methods: {
            del(index) {
                console.log(this.item.difficultyConfigs);
                this.item.difficultyConfigs.splice(index,1)
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
            // 添加行
            addRow() {
                this.item.difficultyConfigs.push({
                    styleId: '',
                    difficultyId: this.item.sampleAndMachinist.difficultyId,
                    difficultyDegree: 0
                })
                // let styleId = ''
                // if(this.leftList.length == 1){
                //     styleId = this.leftList[0].styleId
                // }
                // this.difficultyConfigs.push( {
                //     styleId: "",    //左边的id
                //     difficultyId: "",  //右边的难度
                //     difficultyDegree: "",  //难度系数
                //     otherDifficulty: "",     //其他难度系数
                //     type: this.nodeType==='TYPING'?'0':'1',
                //     sort: this.difficultyConfigs.length + 1,
                //     detailId: ''
                // })
                // if(this.leftList.length == 1){
                //     this.selectLeft(this.difficultyConfigs[this.difficultyConfigs-1])
                // }
            },
            // 选择行
            selectLeft(item) {
                if (this.item.sampleAndMachinist.difficultyId) {
                    getDifficulty({
                        designPrcdNodeId: this.designPrcdNodeId,
                        rightId: this.item.sampleAndMachinist.difficultyId,
                        leftId: item.styleId
                    }).then(res => {
                        item.difficultyDegree = res.data.data.difficulty
                        item.detailId = res.data.data.patternDetailId
                        // item.difficultyId = this.rightId
                    })
                }

            },
            // 选择列
            selectRight() {
                this.item.difficultyConfigs.forEach(v => {
                    v.difficultyId = this.item.sampleAndMachinist.difficultyId
                    // v.otherDifficulty = this.difTotal * 1 - this.total * 1
                    if (v.styleId) {
                        getDifficulty({
                            designPrcdNodeId: this.designPrcdNodeId,
                            rightId: this.item.sampleAndMachinist.difficultyId,
                            leftId: v.styleId
                        }).then(res => {
                            v.difficultyDegree = res.data.data.difficulty
                            v.detailId = res.data.data.patternDetailId
                        })
                    }
                })
            },
            // 校验难度系数
            handleDiffcultyBlur(e) {
                // let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
                // if (v !== "" && !pattern.test(v)) {
                //     this.$message.error('难度系数最多只能输入3位小数');
                //     return
                // }
                // this.item.difficultyConfigs.forEach(v => {
                //     v.otherDifficulty = (e.target.value * 1 - this.total * 1) < 0?0:e.target.value * 1 - this.total * 1
                // })
            },
            deleteItem() {
                this.$emit('deleteItem', this.index)
            }

        }
    }
</script>

<style lang="scss">
    .set-submitter-difficulty-dialog {

        .el-dialog--tiny {
            width: 546px;
        }
        .el-form-item {
            margin-bottom: 15px;
        }
        .el-form-item__content .el-input {
            width: 100%;
        }
        .difficulty-table {
            .el-input__inner {
                border: none !important;
            }
        }

        .el-form-item__label {
            font-size: 12px;
        }
        .el-input {
            font-size: 12px;
        }
        .el-form-item__content {
            line-height: 32px;
        }
    }

</style>


<style lang="scss" scoped>
    .set-submitter-difficulty-dialog {
        .submitter-item {
            border-bottom: 1px solid #e6eaf0;
            &:last-child {
                border-bottom: none;
            }
        }
        .difficulty-table {
            border: 1px solid #E6EAF0;
            border-left: none;
            border-bottom: none;
            table {
                width: 100%;
                td {
                    width: 50%;
                    padding: 0 8px;
                    font-size: 12px;
                    border-bottom: 1px solid #E6EAF0;
                    border-left: 1px solid #E6EAF0;
                    white-space: nowrap;
                }
                td.no-padding {
                    padding: 0;
                    border-left: 1px solid #E6EAF0;
                    border-right: 1px solid #E6EAF0;
                }
            }

        }

    }

</style>
