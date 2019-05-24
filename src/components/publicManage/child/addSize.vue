<template>
    <span  class="container_set_specific_add" v-clickoutside="hideSelectSize">
        <span class="add-btn" @click="isVisible = !isVisible">+ 添加</span>
        <div v-if="isVisible" class="add_specific" @keyup.enter="addSize">
            <input type="text" :maxlength="12"  v-model.trim="sizeName" placeholder="请输入新尺码名称">
            <span class="add_specific_right">
                <span @click="addSize">+ 添加</span>
            </span>
        </div>
    </span>
</template>
<script>
    import {addCommonSize} from '../../../api/api'

export default {
    props:['sizeGroupItem'],
    data() {
        return {
            sizeName:'',
            isVisible:false
        }
    },
    components: {
    },
    methods: {
        //点击后消失
        hideSelectSize(arg) {
            this.isVisible = false
        },
        addSize() {
            if(this.sizeName =='') {
                return;
            }

            for (let i = 0; i < this.sizeGroupItem.commonSkuAttrDTOList.length; i++) {
                if (this.sizeName ==  this.sizeGroupItem.commonSkuAttrDTOList[i].name) {
                    this.$message({
                        message: "已有该尺码了",
                        duration: config.elementUI.duration,
                        type: "error"
                    });
                    this.sizeName = "";
                    return;
                }
            }

            let params = {
                name:this.sizeName,
                categoryId:this.sizeGroupItem.categoryId,
                userId:this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            };
            addCommonSize(params).then(
                res => {
                    if(res.data.code == 0){
                        console.log(res)
                        this.sizeName = "";
                        this.sizeGroupItem.commonSkuAttrDTOList.push(params)
                    }
                }
            )
        }
    }
}
</script>
<style lang="scss" scoped>
@import "~scss_vars";

.container_set_specific_add {
    display: flex;
    border: 1px solid #dce0e6;
    border-radius: 2px;
    color: #808080;
    height: 32px;
    width: 80px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    &:hover {
        background-color: #fafafa;
    }
    .add-btn{
        display: inline-block;
        line-height: 30px;
        width: 100%;
        text-align: center;
    }
    .add_specific {
        position: absolute;
        top: 38px;
        left: 0;
        width: 220px;
        height: 40px;
        border: 1px solid #d3dce6;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
        0 2px 4px 0 rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        background-color: #fff;
        z-index: 1;
        input {
            width: 70%;
            height: 38px;
            text-indent: 0.4em;
            font-size: 14px;
        }
        .add_specific_right {
            border-left: 1px solid #d3dce6;
            padding-left: 8px;
        }
    }
}
</style>



