<template>
  <div class="newnode">
        <div class="newnode-header">
            <page-title style="margin-top:8px;margin-bottom:24px;line-height:1;height:24px;" title="新建节点">
            <nf-button @click="$router.push('workingProcedure')" style="width: 98px;">取消</nf-button>
            <nf-button style="width:98px;" type="warning" @click="sureAddNode" :loading="btnLoading">
                确定
            </nf-button>
            </page-title>
        </div>
        <div class="newnode-container">
            <create-node @nodeData="nodeDatas"></create-node>
        </div>
  </div>
</template>

<script>
import createNode from './children/createNode.vue'
import {addNodeTypes,prcdNodesUpdate} from '../../api/api'
export default {
    data() {
        return {
            nodeData:{},
            btnLoading: false
        };
    },
    components: {
        createNode
    },
    methods: {
        nodeDatas(val) {
            this.nodeData = val;
        },
        sureAddNode() {
            if(this.nodeData.name=='') {
                this.$message.error('节点名称不能为空');
                return;
            };
            if(this.nodeData.prcdNodeTypeId=='') {
                this.$message.error('请选择节点类型');
                return;
            };
            if(this.nodeData.allowMaterialConfig) {
                if(!this.nodeData.materialKindIds.length) {
                    return this.$message.error('请选择物料分类')
                }
            }
            //上报不允许超过目标数勾选时传false  不勾选传true
            this.nodeData.allowCompleteExcess = !this.nodeData.allowCompleteExcess;
            this.btnLoading = true;
            let addNodeTypesGo;
            if(this.$route.query.id){
                this.nodeData.prcdNodeTages.forEach(item=>{
                    if(!item.use){
                        item.use = false
                    }
                });
                this.nodeData.prcdNodeTags = this.nodeData.prcdNodeTages
                //编辑
                addNodeTypesGo = prcdNodesUpdate
            }else {
                addNodeTypesGo = addNodeTypes
            }
            addNodeTypesGo(this.nodeData).then(res => {
                console.log(res);
                if (res.data.code != 0) {
                    this.$message.error(res.data.msg);
                } else {
                    this.$message.success(res.data.msg);
                    this.$router.push('/workingProcedure');
                }
                this.btnLoading = false
            });
        }
    },
}
</script>

<style lang="scss" scoped>
    .newnode {
        .newnode-container {
            width: 100%;
            min-width:1100px;
            min-height:400px;
            background: #fff;
            box-shadow: 0px 6px 10px -3px rgba(13,51,128,0.1);
            border-radius: 2px ;
            box-sizing: border-box;
            padding: 32px;
        }
    }
</style>
