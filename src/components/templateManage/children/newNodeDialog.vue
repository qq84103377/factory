<template>
<div class="node-dialog">
        <transition name="right-move"  v-if="isShow">
			<div class="newnode">
                <div class="newnode-header">
                    <span>添加节点</span>
                    <span class="header_right">
                        <nf-button style="width: 98px;" @click="hiddenShow">取消</nf-button>
                        <nf-button style="width: 98px;" type="warning" @click="sureAdd" :loading="btnLoading">确定</nf-button>
                    </span>
                </div>
                <div class="contain">
                    <create-node @nodeData="nodeDatas"></create-node>
                </div>
            </div>
		</transition>
		<transition name="opcity">
			<div class="cover" v-if="isShow" @click="hiddenShow">
			</div>
		</transition>
</div>
</template>

<script>
import createNode from './createNode.vue'
import { addNodeTypes } from '../../../api/api'
export default {
    props:{
        isShow:Boolean,
    },
    data() {
        return {
            nodeData:{},
            btnLoading: false
        }
    },
    components : {
        createNode
    },
    methods:{
        hiddenShow() {
            this.$emit('hiddenShow')
        },
        nodeDatas(val) {
            console.log(val);
            this.nodeData = val;            
        },
        sureAdd() {
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
            this.btnLoading = true
            addNodeTypes(this.nodeData).then(res => {
                console.log(res);
                if (res.data.code != 0) {
                this.$message.error(res.data.msg);
                } else {
                    this.$emit('addNode');               
                }
                this.btnLoading = false
            });
        },
    },
}
</script>
<style lang="scss" scoped>
    .newnode {
        position: fixed;
        top: 0;
        right: 0;
        width: 850px !important;
        height: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
        background-color: #fff;
        z-index: 2005;
        display: flex;
        flex-direction: column;
        .newnode-header {
            flex: 0 0 88px;
            color: #3b3b3b;
            font-size: 24px;
            padding: 16px 32px 20px 32px;
            box-sizing: border-box;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e6ed;
            z-index: 2;
        }
        .contain {
            padding: 32px;
            overflow-y: auto;
        }
    }
</style>

<style lang="scss">
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }
    
    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }
    
    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }
    
    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }  
    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 10;
    }
</style>
