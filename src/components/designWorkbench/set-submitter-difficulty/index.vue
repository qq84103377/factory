<template>
    <div class="set-submitter-difficulty-dialog">
        <!--设置提报人弹出框-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog " :title="nodeType==='TYPING'?'分配版师':'分配样衣师'"
                   :visible.sync="visible" size="tiny" @close="hideDialog">
            <div class="submitter-item" v-for="(item,index) in submitterList" :key="index">
                <submitter-item @deleteItem="deleteItem" :item="item" :index="index" :nodeType="nodeType"
                           :designPrcdNodeId="designPrcdNodeId" :rightList="rightList"   :leftList="leftList" :missionPrcdNodeIds="missionPrcdNodeIds"></submitter-item>
            </div>
            <el-button style="margin-left: 80px" size="small" type="primary" @click="addSubmitter">
                +添加{{nodeType==='TYPING'?'版师':'样衣师'}}
            </el-button>

            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmSetSubmitter">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import submitterItem from "@/components/designWorkbench/set-submitter-difficulty/submitterItem.vue";
    import {
        getUnitUser, patternStyleAndDifficultyList, allocationSampleDesigner, allocationMachinist,
        patternStyleAndDifficultyRightList,patternStyleAndDifficultyLeftList
    } from '@/api';
    import {
        designWorkbenchPatternStyleList,
        designWorkbenchPatternDifficultyList,
        designWorkbenchAllocationMachinist,
        designWorkbenchAllocationSampleDesigner
    } from '@/api/sample-centre';

    export default {
        props: ['visible', 'nodeType', 'missionPrcdNodeIds','designPrcdNodeId'],
        components: {
            submitterItem
        },
        data() {
            return {
                submitterList: [],
                options: {
                    groupOptions: []
                },
                difficultyTypeList: [], //难度分类列表
                selectedTypingId: '',
                typingList: [], //打版类型列表
                isSubmitting: false,
                leftList: [],
                rightList: []
            }
        },
        created() {
            if (['TYPING', 'SAMPLE'].indexOf(this.nodeType) > -1) {
                this.getDifficultyTypeList();
                this.getTypingList();
                console.log('created')
            }
        },
        watch: {
            nodeType(val) {
                // console.log(val, '传进来')
                if (['TYPING', 'SAMPLE'].indexOf(this.nodeType) > -1) {
                    console.log('watch')
                    this.getDifficultyTypeList();
                    this.getTypingList();
                }
            },
            async visible(val) {
                if (val) {
                    await this.getLeftList()
                    this.getRightList()
                    this.submitterList = [{
                        // difficulty: 0,
                        // submitterIds: [],
                        sampleAndMachinist: {}, //样衣师
                        difficultyConfigs: [], //难度详情
                        difficulty: '',
                        otherDifficulty: ''
                    }]
                }
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem('user_login')).unitId;
            },
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId;
            }
        },
        methods: {
            // 获取难度系数左侧筛选下拉
            getRightList() {
                patternStyleAndDifficultyRightList({missionNodeId:this.missionPrcdNodeIds[0],type:this.nodeType === 'TYPING'?0:1}).then(res => {
                    this.rightList = res.data.data
                })
            },
            // 获取难度系数左侧筛选下拉
            async getLeftList() {
                await patternStyleAndDifficultyLeftList({missionNodeId:this.missionPrcdNodeIds[0],type:this.nodeType === 'TYPING'?0:1}).then(res => {
                    this.leftList = res.data.data
                })
            },
            // 获取难度系数下拉筛选列表
            getDifList() {
                patternStyleAndDifficultyList({missionNodeId: this.missionPrcdNodeIds[0], type: 1}).then(res => {
                    this.difficultyTypeList = res.data.data
                })
            },
            // 获取难度系数难度分类列表
            getDifficultyTypeList() {
                let params = {
                    nodeType: this.nodeType === 'TYPING' ? 0 : 1
                }
                designWorkbenchPatternStyleList(params).then(res => {
                    if (res.data.code === 0) {
                        this.difficultyTypeList = res.data.data
                    }
                })
            },
            // 获取难度系数打版类型列表
            getTypingList() {
                let params = {
                    nodeType: this.nodeType === 'TYPING' ? 0 : 1
                }
                designWorkbenchPatternDifficultyList
                (params).then(res => {
                    if (res.data.code === 0) {
                        this.typingList = res.data.data
                    }
                })
            },
            // 设置版师、样衣师
            confirmSetSubmitter() {
                let errorText = this.nodeType === 'TYPING' ? '版师' : '样衣师'
                let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
                // 检查是否有选择版师、样衣师，以及难度系数格式是否正确
                for (let i = 0; i < this.submitterList.length; i++) {
                    if (!this.submitterList[i].id) {
                        this.$message.error('请选择' + errorText)
                        return
                    }
                    // if (this.submitterList[i].submitterIds.length > 1) {
                    //     this.$message.error(errorText + '只能选择1个')
                    //     return
                    // }

                    // if (this.submitterList[i].difficulty !== "" && !pattern.test(this.submitterList[i].difficulty)) {
                    //     this.$message.error('难度系数最多只能输入3位小数');
                    //     return
                    // }
                }
                // 检查是否选中了相同对版师、样衣师
                let submitterIdsList = this.submitterList.map(value => {
                    return value.id
                })
                // submitterIdsList = [...new Set(submitterIdsList)]
                if (submitterIdsList.length !== Array.from(new Set(submitterIdsList)).length) {
                    this.$message.error('请选择不同的' + errorText);
                    return
                }
                // let subArr = JSON.parse(JSON.stringify(this.submitterList))
                // subArr.forEach(v => {
                //     // v.difficultyConfigs.forEach((d,di) => {
                //     //     if(!d.difficultyId||!d.styleId) {
                //     //         v.difficultyConfigs.splice(di--,1)
                //     //     }
                //     // })
                //     for (let i = 0; i < v.difficultyConfigs.length; i++) {
                //             if(!v.difficultyConfigs[i].difficultyId||!v.difficultyConfigs[i].styleId) {
                //                 v.difficultyConfigs.splice(i--,1)
                //             }
                //     }
                // })
                let subArr = []
                let flag = false
                this.submitterList.forEach(v => {
                    let detailIds = []
                    v.patternDetailIds.forEach(d => {
                        console.log(detailIds.some(v => d.detailId == v),'=======');
                        if(d.detailId){
                            if(!(detailIds.some(v => d.detailId==v))){
                                detailIds.push(d.detailId)
                            }else{
                                flag = true
                                this.$message.error('不能选择重复的难度分类')
                            }
                        }
                    })
                    subArr.push({
                        id: v.id,
                        difficulty:v.difficulty,
                        totalDifficulty: v.totalDifficulty,
                        patternDetailIds: detailIds,
                        reason: ''
                    })
                })
                if(flag)return

                let params = {
                    userId: this.userId,
                    missionPrcdNodeIds: this.missionPrcdNodeIds,
                    designStyleMachinistList: subArr
                }
                console.log(params, '参数');
                // return
                /**
                 *   {
                    "difficulty":"1.450",      难度系数
                    "otherDifficulty":"2.0",   其他难度系数
                    "submitterIds":[
                        "0b613190878c4617b6e5c49c870d98ce"
                    ],
                    "patternDetailIds":[     新增难度系数id
                        "xxxxxxxxxxxxxxx"
                    ]
                }
                 */
                let api
                // 设置版师
                if (this.nodeType === 'TYPING') {
                    api = allocationMachinist
                } else {
                    api = allocationSampleDesigner
                }
                this.isSubmitting = true
                api(params).then(res => {
                    if (res.data.code === 0) {
                        this.$emit('update:visible', false)
                        this.submitterList = [{
                            sampleAndMachinist: {},
                            difficultyConfigs: [],
                            difficulty: '',
                            otherDifficulty: ''
                        }]
                        this.selectedTypingId = ''
                        this.$message.success('设置成功')
                        this.$emit('setSubmitterSuccess')
                    }else {
                        this.$message.error(res.data.msg)
                    }
                    this.isSubmitting = false
                })
            },
            //隐藏弹出框
            hideDialog() {
                this.$emit('update:visible', false)
                this.submitterList = []
                this.selectedTypingId = ''
            },
            addSubmitter() {
                this.submitterList.push({
                    sampleAndMachinist: {},
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
                    ],
                    difficulty: '',
                    otherDifficulty: ''
                })
            },
            deleteItem(index) {
                this.submitterList.splice(index, 1)
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
            margin-bottom: 16px;
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
                }
            }

        }

    }

</style>
