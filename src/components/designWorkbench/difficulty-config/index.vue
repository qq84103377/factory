<template>
    <div class="set-submitter-difficulty-dialog">
        <!--修改难度弹出框-->
        <el-dialog :modal-append-to-body="false" class="custom-dialog " title="修改难度"
                   :visible.sync="visible" size="tiny" @close="hideDialog">
            <div class="submitter-item" v-for="(item,index) in editInfo" :key="index">
                <submitter-item @deleteItem="deleteItem" :item="item" :index="index" :nodeType="nodeType"
                                :designPrcdNodeId="designPrcdNodeId" :rightList="rightList"   :leftList="leftList" :missionPrcdNodeId="missionPrcdNodeId"></submitter-item>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="hideDialog">取 消</el-button>
                <el-button :loading="isSubmitting" type="primary" @click="confirmSetSubmitter">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import submitterItem from "@/components/designWorkbench/difficulty-config/submitterItem.vue";
    import {
        getUnitUser, patternStyleAndDifficultyList, allocationSampleDesigner, allocationMachinist,updateSampleOrMachinistDifficulty,
        patternStyleAndDifficultyRightList,patternStyleAndDifficultyLeftList,getPatternStyleAndDifficulty
    } from '@/api';
    import {
        designWorkbenchPatternStyleList,
        designWorkbenchPatternDifficultyList,
        designWorkbenchAllocationMachinist,
        designWorkbenchAllocationSampleDesigner
    } from '@/api/sample-centre';

    export default {
        props: ['visible', 'nodeType', 'missionPrcdNodeId','designPrcdNodeId','designStyleId'],
        components: {
            submitterItem
        },
        data() {
            return {
                editInfo: [],
                submitterList: [],
                options: {
                    groupOptions: []
                },
                selectedTypingId: '',
                isSubmitting: false,
                leftList: [],
                rightList: []
            }
        },
        created() {
        },
        watch: {
            nodeType(val) {
                // console.log(val, '传进来')
                if (['TYPING', 'SAMPLE'].indexOf(this.nodeType) > -1) {
                }
            },
            visible(val) {
                if (val) {
                    this.getEditInfo()
                    this.getLeftList()
                    this.getRightList()
                    this.submitterList = [{
                        // difficulty: 0,
                        // submitterIds: [],
                        sampleAndMachinist: {}, //样衣师
                        difficultyConfigs: [] //难度详情
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
            //获取修改难度编辑数据
            getEditInfo() {
                getPatternStyleAndDifficulty({designStyleId:this.designStyleId,type:this.nodeType==='TYPING'?'0':'1'}).then(res => {
                    res.data.data.forEach(v => {
                        v.sampleAndMachinist.difficultyId = v.difficultyConfigs[0].difficultyId})
                    this.editInfo = res.data.data
                    // this.editInfo.forEach(v => {
                    //     v.sampleAndMachinist.difficultyId = v.difficultyConfigs[0].difficultyId
                    // })
                })
            },
            // 获取难度系数左侧筛选下拉
            getRightList() {
                patternStyleAndDifficultyRightList({missionNodeId:this.missionPrcdNodeId,type:this.nodeType === 'TYPING'?0:1}).then(res => {
                    this.rightList = res.data.data
                })
            },
            // 获取难度系数左侧筛选下拉
            getLeftList() {
                patternStyleAndDifficultyLeftList({missionNodeId:this.missionPrcdNodeId,type:this.nodeType === 'TYPING'?0:1}).then(res => {
                    this.leftList = res.data.data
                })
            },
            // 设置版师、样衣师
            confirmSetSubmitter() {
                let errorText = this.nodeType === 'TYPING' ? '版师' : '样衣师'
                let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
                // 检查是否有选择版师、样衣师，以及难度系数格式是否正确
                // for (let i = 0; i < this.submitterList.length; i++) {
                //     if (!this.submitterList[i].sampleAndMachinist.id) {
                //         this.$message.error('请选择' + errorText)
                //         return
                //     }
                //     // if (this.submitterList[i].submitterIds.length > 1) {
                //     //     this.$message.error(errorText + '只能选择1个')
                //     //     return
                //     // }
                //
                //     // if (this.submitterList[i].difficulty !== "" && !pattern.test(this.submitterList[i].difficulty)) {
                //     //     this.$message.error('难度系数最多只能输入3位小数');
                //     //     return
                //     // }
                // }
                let arr = []
                let flag = false
                this.editInfo.forEach(v => {
                    let dArr = []
                    let count = 0
                    v.difficultyConfigs.forEach(d => {
                        if(d.detailId){
                            if(!(dArr.some(v => d.detailId==v))){
                                count += d.difficultyDegree
                                dArr.push(d.detailId)
                            }else{
                                flag = true
                                this.$message.error('不能选择重复的难度分类')
                            }
                        }
                    })

                    /**
                     *  {
                        "id":"xx", //选择的版师或者样衣师表的id
                        "difficulty":10.5,//难度系数(用户填的)
                        "totalDifficulty":2.22,//难度系数总计(真实的总计)
                        "patternDetailIds":[ //难度系数详情id数组
                            "detailId1",
                            "detailId1"
                        ],
                        "reason":"修改"
                    },
                     * @type {{machinistSampleId: *, sampleAndMachinist: {id: *}, otherDifficulty: number, difficulty: *|string, reason, difficultyConfigs: Array}}
                     */
                    let obj = {
                        // machinistSampleId: v.sampleAndMachinist.sampleOrDesignId,
                        // sampleAndMachinist: {id: v.sampleAndMachinist.id},
                        // otherDifficulty: v.sampleAndMachinist.difficulty *1 - count,//合计输入框的值 - 每条难度的总和
                        // difficulty: v.sampleAndMachinist.difficulty, //合计输入框的值
                        // reason: v.reason,
                        // difficultyConfigs: dArr
                        id:v.sampleAndMachinist.id,
                        difficulty:v.sampleAndMachinist.difficulty,
                        totalDifficulty: count,
                        patternDetailIds: dArr,
                        reason: v.reason
                    }
                    arr.push(obj)
                })
                if(flag)return
                let params = {
                    // type: this.nodeType==='TYPING'?0:1,
                    // designStyleId: this.designStyleId,
                    // allocationSampleAndMachinistCommons: arr
                    userId:this.userId,
                    missionPrcdNodeIds: [this.missionPrcdNodeId],
                    designStyleMachinistList: arr
                }
                console.log(params, '参数');

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
                        this.editInfo = []
                        this.selectedTypingId = ''
                        this.$message.success('修改成功')
                        this.$emit('setSubmitterSuccess')
                    }
                    this.isSubmitting = false
                })
            },
            //隐藏弹出框
            hideDialog() {
                this.$emit('update:visible', false)
                this.editInfo = []
                this.selectedTypingId = ''
            },
            addSubmitter() {
                this.submitterList.push({
                    sampleAndMachinist: {},
                    difficultyConfigs: []
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
