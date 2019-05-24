<template>
    <div>
        <!--裁片组配置-->
        <el-dialog title="裁片组配置"
                   @close="$emit('update:chipConfigVisible',chipConfigVisible)"
                   :visible.sync="chipConfigVisible" :show-close="false" custom-class="custom-dialog" size="tiny">
            <div>
                <div class="chipConfigDiv chipConfigHDiv">
                    <p>裁片组</p>
                    <p>操作</p>
                </div>
                <div class="chipConfigDiv" style="background: #fff9ed;" v-for="(item,index) in chipConfigData" :key="index">
                    <p>
                        <input type="text" v-model.trim="item.name"  v-focus="item.edit" maxlength="8" style="height: 100%;width: 100%;background: #fff9ed;">
                    </p>
                    <p @click="chipConfigDelete(index)" style="cursor: pointer">删除</p>
                </div>
                <div class="chipConfigDiv chipConfigFDiv">
                    <p @click="chipConfigAdd">+ 添加裁片组</p>
                    <p></p>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="chipConfigVisible = false">取 消</el-button>
                <el-button type="primary" @click="cbsgcGetUpdate">确 认</el-button>
            </div>
        </el-dialog>
        <!--<el-dialog  title="裁片组名称"-->
        <!--@close="chipConfigAddName=''"-->
        <!--:visible.sync="chipConfigAddVisible" :show-close="false" custom-class="custom-dialog" size="tiny">-->
        <!--<el-input v-model="chipConfigAddName" placeholder="请输入裁片组名称"></el-input>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="chipConfigAddVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="chipConfigAdd">确 认</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
    import {cbsgcGetList, cbsgcGetUpdate} from '@/api';

    export default {
        name: "chipConfig",
        props: ['instanceId', 'chipConfigData', 'chipConfigVisible'],
        data() {
            return {
                chipConfigAddVisible: false,
                chipConfigAddName: '',
            }
        },
        //自动获取焦点，对input进行DOM操作，实际上；
        directives: {
            focus: {
                inserted: (el, {value}) => {
                    if (value) {
                        //由于是饿了么的el-input，需要拿到父元素下面的input
                        el.focus();
                    }
                }
            }
        },
        methods: {


            //删除裁片组
            chipConfigDelete(index) {
                this.chipConfigData.splice(index, 1)
            },
            //添加裁片组
            chipConfigAdd() {
                // this.chipConfigAddVisible = false;
                this.chipConfigData.forEach(item=>{
                    this.$set(item,'edit',false)
                    // item.edit = false
                })
                this.$nextTick(function () {
                    this.chipConfigData.push({name: '',edit:true})

                })
            },
            //修改
            cbsgcGetUpdate() {
                let flag=true;
                this.chipConfigData.forEach(item=>{
                    if(!item.name.length){
                        this.$message.error('裁片组不能为空')
                        flag = false
                    }
                });
                if(!flag) return;
                cbsgcGetUpdate({facMissionPrcdNodeId: this.instanceId, list: this.chipConfigData}).then(res => {
                    if (res.data.code === 0) {
                        this.$message.success(res.data.msg)
                        this.chipConfigVisible = false;

                    } else {
                        this.$message.error(res.data.msg)
                    }

                })
            },
        }
    }
</script>

<style  lang="scss">
    .chipConfigDiv{
        .el-input__inner{
            border: none;
            background: #fff9ed;
        }
    }
</style>
<style scoped lang="scss">
    .chipConfigDiv {
        display: flex;
        p {
            border: 1px solid rgba(223, 230, 236, 1);
            border-bottom: none;
            height: 37px;
            line-height: 37px;
            color: #3B3B3B;
        }
        p:nth-child(1) {
            flex: 2;
            border-right: none;
            padding-left: 10px;
        }
        p:nth-child(2) {
            text-align: center;
            color: #FA4150;
            flex: 1;
        }
    }

    .chipConfigHDiv {
        p {
            color: rgba(128, 128, 128, 1) !important;
            font-weight: 600;
        }
    }

    .chipConfigFDiv {

        p {
            border-bottom: 1px solid rgba(223, 230, 236, 1);
            color: #FFA914;
            cursor: pointer;
        }
    }
</style>
