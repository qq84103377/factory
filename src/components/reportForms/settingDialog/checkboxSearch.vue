<template>
<div>
    <div class="search-dialog">
        <div class="dialog-header">
            <el-input icon="search" placeholder="搜索" class="search-input" v-model="keyword">
            </el-input>
        </div>
        <div class="dialog-main">
            <el-checkbox-group v-model="checkList" class="checkbox-wrap">
                <div v-for="(item,index) in computedList" :key='index' class="checkbox-item">
                    <el-checkbox  :label="item.id" :key="index" >
                        {{item.name}}<span style="color:#a2abb8;">（{{item.targetType}}）</span>
                    </el-checkbox>
                </div>
            </el-checkbox-group>
        </div>
        <div class="dialog-footer-1">
            <div class="btn-group">
                <nf-button width='72' @click="handleToggle">取消</nf-button>
                <nf-button width='72' type='warning' @click="passdata">确定</nf-button>
            </div>
        </div>
    </div>
    <div class="mask" @click="handleToggle"></div>
</div>
</template>
<script>
export default {
    props: {
        arr: {
            default: () => []
        },
        checkArr: {
            default: () => []
        }
    },
    model: {
        event: 'passData'
    },
    data() {
        return {
            checkList: [],
            keyword: ''
        };
    },
    methods: {
        // 显示隐藏组件
        passdata() {
            this.$emit('passData', this.checkList);
        },
        handleToggle() {
            this.$emit('passData');
        }
    },
    created() {
        console.log(this.arr);
        this.checkList = this.checkArr;
    },
    computed: {
        computedList() {
            return this.arr.filter(item => {
                return item.name
                    .toLowerCase()
                    .includes(this.keyword.toLowerCase());
            });
        }
    },
    watch: {
    }
};
</script>
<style lang="scss" scoped>
.search-dialog {
    width: 500px;
    height: 376px;
    background-color: #ffffff;
    box-shadow: 0 4px 10px 0 rgba(0, 17, 51, 0.1);
    border: solid 1px #dce0e6;
    position: fixed;
    left: 50%;
    top: 55%;
    z-index: 303;
    padding: 12px;
    transform: translate(-50%, -50%);
}
.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 301;
    background: transparent;
}
.dialog-main {
    margin: 12px 0;
    height: 280px;
    overflow: auto;
}
.dialog-footer-1 {
    display: flex;
    justify-content: flex-end;
}
.checkbox-item {
    width: 50%;
    margin-bottom: 12px;
    display: inline-block;
}
</style>
